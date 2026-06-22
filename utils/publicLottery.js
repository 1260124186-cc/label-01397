var mockData = require('./mockData.js');

var STORAGE_KEY_ROUNDS = 'public_lottery_rounds_v2';
var STORAGE_KEY_WITNESSES = 'public_lottery_witness_registrations';
var STORAGE_KEY_BATCH_REPORT_MAP = 'public_lottery_batch_report_map';
var STORAGE_KEY_ONCHAIN_PROOFS = 'public_lottery_onchain_proofs';
var STORAGE_KEY_LOTTERY_INIT = 'public_lottery_initialized';

var LOTTERY_STATUS = {
  SCHEDULED: 'scheduled',
  DRAWING: 'drawing',
  SAMPLED: 'sampled',
  INSPECTING: 'inspecting',
  REPORTED: 'reported',
  CLOSED: 'closed',
  FAILED: 'failed',
  CANCELLED: 'cancelled'
};

var LOTTERY_STATUS_LABELS = {
  scheduled: '待抽签',
  drawing: '抽签中',
  sampled: '已取样',
  inspecting: '检测中',
  reported: '已出报告',
  closed: '已归档',
  failed: '启动失败',
  cancelled: '已取消'
};

var LOTTERY_STATUS_COLORS = {
  scheduled: '#909399',
  drawing: '#E6A23C',
  sampled: '#409EFF',
  inspecting: '#E6A23C',
  reported: '#67C23A',
  closed: '#909399',
  failed: '#F56C6C',
  cancelled: '#909399'
};

var INSPECTION_TYPE_LABELS = {
  pesticide: '农残检测',
  heavyMetal: '重金属检测',
  microbiological: '微生物检测',
  additive: '添加剂检测'
};

var DEFAULT_MAX_WITNESSES = 5;
var DEFAULT_DRAW_RATIO = 0.3;
var DEFAULT_INSTITUTION = '国家茶叶质量监督检验中心';
var DEFAULT_INSPECTION_TYPES = ['pesticide', 'heavyMetal'];
var DEFAULT_CHAIN_NAME = '溯源链';
var DEFAULT_BLOCK_EXPLORER_BASE = 'https://explorer.tracechain.cn/tx/';

var MEMBER_STRATEGY = {
  WAIT: 'wait',
  ALERT: 'alert',
  FAIL: 'fail'
};

var MEMBER_STRATEGY_LABELS = {
  wait: '等待凑齐',
  alert: '告警启动',
  fail: '未满即停'
};

var START_STATUS = {
  PENDING: 'pending',
  WAITING: 'waiting',
  STARTED: 'started',
  FAILED: 'failed',
  PARTIAL: 'partial'
};

var DEFAULT_MIN_WITNESSES = 3;
var DEFAULT_WAIT_TIMEOUT = 300000;
var DEFAULT_START_STORAGE_KEY = 'public_lottery_start_timers';

var STORAGE_KEY_START_META = 'public_lottery_round_meta';

function safeGetStorage(key, defaultValue) {
  try {
    var value = wx.getStorageSync(key);
    return value !== null && value !== undefined && value !== '' ? value : defaultValue;
  } catch (e) {
    return defaultValue;
  }
}

function safeSetStorage(key, value) {
  try {
    wx.setStorageSync(key, value);
    return true;
  } catch (e) {
    console.error('[公开抽检] 存储失败:', e);
    return false;
  }
}

function _now() {
  return new Date();
}

function _formatDateTime(date) {
  if (typeof date === 'string') return date;
  var y = date.getFullYear();
  var m = (date.getMonth() + 1).toString().padStart(2, '0');
  var d = date.getDate().toString().padStart(2, '0');
  var h = date.getHours().toString().padStart(2, '0');
  var min = date.getMinutes().toString().padStart(2, '0');
  var s = date.getSeconds().toString().padStart(2, '0');
  return y + '-' + m + '-' + d + ' ' + h + ':' + min + ':' + s;
}

function _formatDate(date) {
  if (typeof date === 'string') return date;
  var y = date.getFullYear();
  var m = (date.getMonth() + 1).toString().padStart(2, '0');
  var d = date.getDate().toString().padStart(2, '0');
  return y + '-' + m + '-' + d;
}

function generateLotteryId() {
  var now = _now();
  var y = now.getFullYear();
  var m = (now.getMonth() + 1).toString().padStart(2, '0');
  var d = now.getDate().toString().padStart(2, '0');
  var r = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return 'PIL-' + y + m + d + '-' + r;
}

function generateSeedHash(seed) {
  var hash = 0;
  for (var i = 0; i < seed.length; i++) {
    var char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  var hex = Math.abs(hash).toString(16);
  while (hex.length < 8) hex = '0' + hex;
  return hex;
}

function generateTxHash(roundId, seed) {
  var input = roundId + '-' + seed + '-' + Date.now();
  var hash = '';
  var chars = '0123456789abcdef';
  for (var i = 0; i < 64; i++) {
    hash += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return '0x' + hash;
}

function shortTxHash(fullHash) {
  if (!fullHash) return '';
  if (fullHash.length <= 14) return fullHash;
  return fullHash.substring(0, 8) + '...' + fullHash.substring(fullHash.length - 6);
}

function _maskPhone(phone) {
  if (!phone || phone.length < 7) return phone;
  return phone.substring(0, 3) + '****' + phone.substring(7);
}

function _maskName(name) {
  if (!name || name.length === 0) return name;
  return name.charAt(0) + '**';
}

function performLotteryDraw(candidateBatchNos, seed) {
  if (!candidateBatchNos || candidateBatchNos.length === 0) return [];

  var sortedBatchNos = candidateBatchNos.slice().sort();
  var hashInput = seed + '-' + sortedBatchNos.join(',');
  var hash = generateSeedHash(hashInput);

  var selectedCount = Math.max(1, Math.ceil(sortedBatchNos.length * DEFAULT_DRAW_RATIO));
  var result = [];
  var remaining = sortedBatchNos.slice();

  for (var i = 0; i < selectedCount && remaining.length > 0; i++) {
    var idx = (parseInt(hash.substr(i % hash.length, 4), 16) || 0) % remaining.length;
    result.push(remaining[idx]);
    remaining.splice(idx, 1);
  }

  return result;
}

function _getSalesBatchPool() {
  var allIds = mockData.getAllProductIds ? mockData.getAllProductIds() : ['G001', 'G002'];
  var batchNos = [];

  for (var i = 0; i < allIds.length; i++) {
    var data = mockData.getTraceData(allIds[i]);
    if (data && data.basicInfo && data.basicInfo.batchNo) {
      var batchNo = data.basicInfo.batchNo;
      if (batchNos.indexOf(batchNo) === -1) {
        batchNos.push(batchNo);
      }
    }
  }

  if (batchNos.length === 0) {
    batchNos = ['GH202501', 'GH202502', 'GH202503', 'GH202504'];
  }

  return batchNos;
}

function _loadRounds() {
  var rounds = safeGetStorage(STORAGE_KEY_ROUNDS, null);
  if (rounds && Array.isArray(rounds)) {
    return rounds;
  }
  return [];
}

function _saveRounds(rounds) {
  return safeSetStorage(STORAGE_KEY_ROUNDS, rounds);
}

function _loadOnChainProofs() {
  var proofs = safeGetStorage(STORAGE_KEY_ONCHAIN_PROOFS, null);
  if (proofs && typeof proofs === 'object') {
    return proofs;
  }
  return {};
}

function _saveOnChainProofs(proofs) {
  return safeSetStorage(STORAGE_KEY_ONCHAIN_PROOFS, proofs);
}

function _loadBatchReportMap() {
  var map = safeGetStorage(STORAGE_KEY_BATCH_REPORT_MAP, null);
  if (map && typeof map === 'object') {
    return map;
  }
  return {};
}

function _saveBatchReportMap(map) {
  return safeSetStorage(STORAGE_KEY_BATCH_REPORT_MAP, map);
}

function _buildOnChainData(round, stage) {
  var data = [
    { key: 'roundId', label: '抽检轮次ID', value: round.roundId, onChain: true },
    { key: 'drawSeed', label: '抽签种子', value: round.drawSeed || '', onChain: true },
    { key: 'drawHash', label: '抽签哈希', value: round.drawHash || '', onChain: true },
    { key: 'selectedBatchNos', label: '中签批次', value: (round.selectedBatchNos || []).join(', '), onChain: true },
    { key: 'institution', label: '检测机构', value: round.institution || '', onChain: true },
    { key: 'witnessCount', label: '见证人数', value: String((round.consumerWitnesses || []).length), onChain: true }
  ];

  if (stage === 'reported' && round.inspectionResult) {
    data.push(
      { key: 'reportDate', label: '报告日期', value: round.inspectionResult.reportDate || '', onChain: true },
      { key: 'overallConclusion', label: '总结论', value: round.inspectionResult.overallConclusion || '', onChain: true }
    );
    if (round.inspectionResult.batchResults) {
      for (var i = 0; i < round.inspectionResult.batchResults.length; i++) {
        var br = round.inspectionResult.batchResults[i];
        data.push({
          key: 'report_' + br.batchNo,
          label: br.batchNo + ' 报告号',
          value: br.reportNo || '',
          onChain: true
        });
      }
    }
  }

  return data;
}

function _buildOnChainProof(round, stage) {
  var txHash = round.blockchainEndorsement && round.blockchainEndorsement.txHash
    ? round.blockchainEndorsement.txHash
    : generateTxHash(round.roundId, round.drawSeed || 'seed');

  return {
    roundId: round.roundId,
    txHash: txHash,
    txHashShort: shortTxHash(txHash),
    chainName: DEFAULT_CHAIN_NAME,
    timestamp: _formatDateTime(_now()),
    stage: stage,
    onChainData: _buildOnChainData(round, stage),
    blockExplorerUrl: DEFAULT_BLOCK_EXPLORER_BASE + txHash
  };
}

function _getLotteryReportNo(roundId, batchNo) {
  return 'PIL-' + roundId.split('-').slice(1).join('-') + '-' + batchNo;
}

function _mockInspectionResultForBatch(batchNo, roundId) {
  return {
    batchNo: batchNo,
    conclusion: '合格',
    reportNo: _getLotteryReportNo(roundId, batchNo),
    testItems: [
      { item: '六六六', value: parseFloat((0.003 + Math.random() * 0.01).toFixed(3)), unit: 'mg/kg', limit: 0.1, status: '合格' },
      { item: '滴滴涕', value: parseFloat((0.005 + Math.random() * 0.01).toFixed(3)), unit: 'mg/kg', limit: 0.2, status: '合格' },
      { item: '铅', value: parseFloat((0.2 + Math.random() * 0.5).toFixed(1)), unit: 'mg/kg', limit: 5.0, status: '合格' }
    ]
  };
}

function _updateBatchReportMap(round) {
  if (!round || !round.inspectionResult || !round.inspectionResult.batchResults) return;

  var map = _loadBatchReportMap();

  for (var i = 0; i < round.inspectionResult.batchResults.length; i++) {
    var br = round.inspectionResult.batchResults[i];
    var batchNo = br.batchNo;
    if (!map[batchNo]) {
      map[batchNo] = [];
    }

    var exists = false;
    for (var j = 0; j < map[batchNo].length; j++) {
      if (map[batchNo][j].reportNo === br.reportNo) {
        exists = true;
        break;
      }
    }

    if (!exists) {
      map[batchNo].push({
        reportNo: br.reportNo,
        roundId: round.roundId,
        roundName: round.roundName,
        batchNo: batchNo,
        conclusion: br.conclusion,
        institution: round.institution,
        reportDate: round.inspectionResult.reportDate,
        witnessCount: (round.consumerWitnesses || []).length,
        blockchainTxHash: round.blockchainEndorsement ? round.blockchainEndorsement.txHashShort : '',
        isPublicLottery: true
      });
    }
  }

  _saveBatchReportMap(map);
}

function initializeLotterySystem() {
  var inited = safeGetStorage(STORAGE_KEY_LOTTERY_INIT, false);
  if (inited) return false;

  var salesPool = _getSalesBatchPool();

  var rounds = [];
  var proofs = {};

  var seed1 = 'SEED-' + (2025) + '0903-GHTEA';
  var selected1 = performLotteryDraw(salesPool, seed1);
  var round1 = {
    roundId: 'PIL-20250901-0001',
    roundName: '2025年9月公开抽检（第1轮）',
    status: LOTTERY_STATUS.REPORTED,
    scheduleDate: '2025-09-01',
    drawDate: '2025-09-03 14:00:00',
    drawSeed: seed1,
    drawHash: generateSeedHash(seed1 + '-' + salesPool.slice().sort().join(',')),
    candidateBatchNos: salesPool.slice(),
    selectedBatchNos: selected1,
    inspectionTypes: DEFAULT_INSPECTION_TYPES.slice(),
    institution: DEFAULT_INSTITUTION,
    liveStreamUrl: 'https://live.example.com/lottery/20250903',
    replayUrl: 'https://replay.example.com/lottery/20250903',
    consumerWitnesses: [
      { name: '张**', phone: '138****5678', registeredAt: '2025-08-28 10:23:45', attended: true },
      { name: '李**', phone: '139****1234', registeredAt: '2025-08-29 15:42:18', attended: true },
      { name: '王**', phone: '137****9012', registeredAt: '2025-08-30 09:11:33', attended: false }
    ],
    maxWitnesses: DEFAULT_MAX_WITNESSES,
    inspectionResult: {
      reportDate: '2025-09-15',
      overallConclusion: '合格',
      batchResults: []
    },
    blockchainEndorsement: null,
    brandNarrative: '本次抽检由品牌主动发起，全程直播公开，消费者现场见证，抽签种子与结果已上链存证，不可篡改。品牌对每一批次品质负责，敢于接受公开检验。'
  };

  for (var i = 0; i < selected1.length; i++) {
    round1.inspectionResult.batchResults.push(_mockInspectionResultForBatch(selected1[i], round1.roundId));
  }

  round1.blockchainEndorsement = _buildOnChainProof(round1, 'reported');
  proofs[round1.roundId] = round1.blockchainEndorsement;
  rounds.push(round1);

  var seed2 = 'SEED-' + (2025) + '1203-GHTEA';
  var selected2 = performLotteryDraw(salesPool, seed2);
  var round2 = {
    roundId: 'PIL-20251201-0002',
    roundName: '2025年12月公开抽检（第2轮）',
    status: LOTTERY_STATUS.INSPECTING,
    scheduleDate: '2025-12-01',
    drawDate: '2025-12-03 14:00:00',
    drawSeed: seed2,
    drawHash: generateSeedHash(seed2 + '-' + salesPool.slice().sort().join(',')),
    candidateBatchNos: salesPool.slice(),
    selectedBatchNos: selected2,
    inspectionTypes: ['pesticide', 'microbiological'],
    institution: '湖北省农产品质量安全检测中心',
    liveStreamUrl: 'https://live.example.com/lottery/20251203',
    replayUrl: '',
    consumerWitnesses: [
      { name: '赵**', phone: '136****3456', registeredAt: '2025-11-28 08:15:22', attended: true },
      { name: '钱**', phone: '135****7890', registeredAt: '2025-11-29 12:30:45', attended: false }
    ],
    maxWitnesses: DEFAULT_MAX_WITNESSES,
    inspectionResult: null,
    blockchainEndorsement: null,
    brandNarrative: '品牌持续开展公开抽检，本轮对在售批次进行随机抽取，全程直播取样送检过程。消费者可报名亲临现场见证，确保抽检过程真实透明。'
  };

  round2.blockchainEndorsement = _buildOnChainProof(round2, 'drawing');
  proofs[round2.roundId] = round2.blockchainEndorsement;
  rounds.push(round2);

  _saveRounds(rounds);
  _saveOnChainProofs(proofs);
  _updateBatchReportMap(round1);

  safeSetStorage(STORAGE_KEY_LOTTERY_INIT, true);

  return true;
}

function resetLotterySystem() {
  safeSetStorage(STORAGE_KEY_ROUNDS, []);
  safeSetStorage(STORAGE_KEY_WITNESSES, {});
  safeSetStorage(STORAGE_KEY_BATCH_REPORT_MAP, {});
  safeSetStorage(STORAGE_KEY_ONCHAIN_PROOFS, {});
  safeSetStorage(STORAGE_KEY_LOTTERY_INIT, false);
  initializeLotterySystem();
}

function getAllLotteryRounds() {
  initializeLotterySystem();
  var rounds = _loadRounds();
  var witnesses = safeGetStorage(STORAGE_KEY_WITNESSES, {});

  for (var i = 0; i < rounds.length; i++) {
    if (witnesses[rounds[i].roundId]) {
      var existingWitnesses = rounds[i].consumerWitnesses || [];
      var localWitnesses = witnesses[rounds[i].roundId];
      var merged = existingWitnesses.slice();
      for (var j = 0; j < localWitnesses.length; j++) {
        var found = false;
        for (var k = 0; k < merged.length; k++) {
          if (merged[k].phone === localWitnesses[j].phone) {
            found = true;
            break;
          }
        }
        if (!found) {
          merged.push(localWitnesses[j]);
        }
      }
      rounds[i].consumerWitnesses = merged;
      rounds[i].currentWitnessCount = merged.length;
      rounds[i].isWitnessFull = merged.length >= rounds[i].maxWitnesses;
    }
  }

  return rounds;
}

function getLotteryRoundById(roundId) {
  var rounds = getAllLotteryRounds();
  for (var i = 0; i < rounds.length; i++) {
    if (rounds[i].roundId === roundId) {
      return rounds[i];
    }
  }
  return null;
}

function getLotteryRoundsForBatch(batchNo) {
  var allRounds = getAllLotteryRounds();
  var results = [];

  for (var i = 0; i < allRounds.length; i++) {
    var round = allRounds[i];
    if (round.selectedBatchNos && round.selectedBatchNos.indexOf(batchNo) !== -1) {
      results.push(round);
    }
  }

  return results;
}

function getPublicLotteryData(traceId) {
  var data = mockData.getTraceData(traceId);
  if (!data) return null;

  var batchNo = data.basicInfo && data.basicInfo.batchNo;
  if (!batchNo) return null;

  return getPublicLotteryByBatchNo(batchNo);
}

function getPublicLotteryByBatchNo(batchNo) {
  var matchedRounds = getLotteryRoundsForBatch(batchNo);
  if (matchedRounds.length === 0) return null;

  var latestRound = matchedRounds[matchedRounds.length - 1];
  return buildLotteryDetail(latestRound, batchNo);
}

function buildLotteryDetail(round, batchNo) {
  var result = {
    roundId: round.roundId,
    roundName: round.roundName,
    status: round.status,
    statusLabel: LOTTERY_STATUS_LABELS[round.status] || round.status,
    statusColor: LOTTERY_STATUS_COLORS[round.status] || '#909399',
    scheduleDate: round.scheduleDate,
    drawDate: round.drawDate,
    drawSeed: round.drawSeed,
    drawHash: round.drawHash,
    candidateBatchNos: round.candidateBatchNos,
    selectedBatchNos: round.selectedBatchNos,
    inspectionTypes: round.inspectionTypes,
    institution: round.institution,
    liveStreamUrl: round.liveStreamUrl,
    replayUrl: round.replayUrl,
    consumerWitnesses: round.consumerWitnesses,
    maxWitnesses: round.maxWitnesses,
    currentWitnessCount: round.consumerWitnesses ? round.consumerWitnesses.length : 0,
    isWitnessFull: round.consumerWitnesses && round.consumerWitnesses.length >= round.maxWitnesses,
    inspectionResult: round.inspectionResult,
    blockchainEndorsement: round.blockchainEndorsement,
    batchNo: batchNo,
    isThisBatchSelected: round.selectedBatchNos.indexOf(batchNo) !== -1,
    brandNarrative: round.brandNarrative
  };

  if (round.inspectionResult && round.inspectionResult.batchResults) {
    for (var k = 0; k < round.inspectionResult.batchResults.length; k++) {
      if (round.inspectionResult.batchResults[k].batchNo === batchNo) {
        result.thisBatchResult = round.inspectionResult.batchResults[k];
        break;
      }
    }
  }

  return result;
}

function registerWitness(roundId, name, phone) {
  initializeLotterySystem();
  var rounds = _loadRounds();
  var round = null;
  var roundIdx = -1;

  for (var i = 0; i < rounds.length; i++) {
    if (rounds[i].roundId === roundId) {
      round = rounds[i];
      roundIdx = i;
      break;
    }
  }
  if (!round) return { success: false, message: '未找到该抽检轮次' };

  if (round.status === LOTTERY_STATUS.CLOSED || round.status === LOTTERY_STATUS.REPORTED) {
    return { success: false, message: '该轮抽检已结束，无法报名' };
  }

  var witnesses = safeGetStorage(STORAGE_KEY_WITNESSES, {});
  if (!witnesses[roundId]) witnesses[roundId] = [];

  var totalCount = (round.consumerWitnesses || []).length + witnesses[roundId].length;
  if (totalCount >= round.maxWitnesses) {
    return { success: false, message: '见证名额已满' };
  }

  var maskedPhoneForCheck = _maskPhone(phone);
  for (var j = 0; j < witnesses[roundId].length; j++) {
    if (witnesses[roundId][j].phone === maskedPhoneForCheck) {
      return { success: false, message: '该手机号已报名' };
    }
  }

  var maskedName = _maskName(name);
  var maskedPhone = _maskPhone(phone);

  var newRegistration = {
    name: maskedName,
    phone: maskedPhone,
    registeredAt: _formatDateTime(_now()),
    attended: false
  };

  witnesses[roundId].push(newRegistration);
  safeSetStorage(STORAGE_KEY_WITNESSES, witnesses);

  var updatedWitnesses = (round.consumerWitnesses || []).concat([newRegistration]);
  rounds[roundIdx].consumerWitnesses = updatedWitnesses;
  rounds[roundIdx].currentWitnessCount = updatedWitnesses.length;
  _saveRounds(rounds);

  var onChainProofs = _loadOnChainProofs();
  if (onChainProofs[roundId]) {
    onChainProofs[roundId].onChainData = _buildOnChainData(rounds[roundIdx], round.status);
    _saveOnChainProofs(onChainProofs);
    rounds[roundIdx].blockchainEndorsement = onChainProofs[roundId];
    _saveRounds(rounds);
  }

  return { success: true, message: '报名成功', registration: newRegistration };
}

function getWitnessRegistrations(roundId) {
  var witnesses = safeGetStorage(STORAGE_KEY_WITNESSES, {});
  return witnesses[roundId] || [];
}

function createNewLotteryRound(options) {
  initializeLotterySystem();
  options = options || {};

  var salesPool = _getSalesBatchPool();
  var roundId = generateLotteryId();
  var now = _now();
  var seed = options.drawSeed || ('SEED-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6));

  var selectedBatches = performLotteryDraw(salesPool, seed);
  var drawDate = options.drawDate || now;

  var round = {
    roundId: roundId,
    roundName: options.roundName || (_formatDate(drawDate) + ' 公开抽检'),
    status: LOTTERY_STATUS.DRAWING,
    scheduleDate: _formatDate(drawDate),
    drawDate: _formatDateTime(drawDate),
    drawSeed: seed,
    drawHash: generateSeedHash(seed + '-' + salesPool.slice().sort().join(',')),
    candidateBatchNos: salesPool.slice(),
    selectedBatchNos: selectedBatches,
    inspectionTypes: options.inspectionTypes || DEFAULT_INSPECTION_TYPES.slice(),
    institution: options.institution || DEFAULT_INSTITUTION,
    liveStreamUrl: options.liveStreamUrl || '',
    replayUrl: options.replayUrl || '',
    consumerWitnesses: [],
    maxWitnesses: options.maxWitnesses || DEFAULT_MAX_WITNESSES,
    currentWitnessCount: 0,
    isWitnessFull: false,
    inspectionResult: null,
    blockchainEndorsement: null,
    brandNarrative: options.brandNarrative || '品牌主动发起公开抽检，随机抽取在售批次，全程透明公开，接受消费者监督。'
  };

  var onChainProofs = _loadOnChainProofs();
  var proof = _buildOnChainProof(round, 'drawing');
  round.blockchainEndorsement = proof;
  onChainProofs[roundId] = proof;

  var rounds = _loadRounds();
  rounds.push(round);
  _saveRounds(rounds);
  _saveOnChainProofs(onChainProofs);

  return {
    success: true,
    round: round,
    message: '抽签完成，结果已上链存证'
  };
}

function advanceLotteryToSampled(roundId) {
  initializeLotterySystem();
  var rounds = _loadRounds();
  var idx = -1;

  for (var i = 0; i < rounds.length; i++) {
    if (rounds[i].roundId === roundId) {
      idx = i;
      break;
    }
  }
  if (idx === -1) return { success: false, message: '未找到该抽检轮次' };

  var round = rounds[idx];
  if (round.status !== LOTTERY_STATUS.DRAWING) {
    return { success: false, message: '当前状态无法取样' };
  }

  round.status = LOTTERY_STATUS.SAMPLED;
  rounds[idx] = round;

  var onChainProofs = _loadOnChainProofs();
  if (onChainProofs[roundId]) {
    var proof = onChainProofs[roundId];
    proof.onChainData = _buildOnChainData(round, 'sampled');
    proof.stage = 'sampled';
    onChainProofs[roundId] = proof;
    _saveOnChainProofs(onChainProofs);
    round.blockchainEndorsement = proof;
    rounds[idx] = round;
  }

  _saveRounds(rounds);

  return { success: true, round: round, message: '取样完成，已送入检测机构' };
}

function advanceLotteryToInspecting(roundId) {
  initializeLotterySystem();
  var rounds = _loadRounds();
  var idx = -1;

  for (var i = 0; i < rounds.length; i++) {
    if (rounds[i].roundId === roundId) {
      idx = i;
      break;
    }
  }
  if (idx === -1) return { success: false, message: '未找到该抽检轮次' };

  var round = rounds[idx];
  if (round.status !== LOTTERY_STATUS.SAMPLED) {
    return { success: false, message: '当前状态无法开始检测' };
  }

  round.status = LOTTERY_STATUS.INSPECTING;
  rounds[idx] = round;
  _saveRounds(rounds);

  return { success: true, round: round, message: '检测机构已开始检测' };
}

function completeLotteryInspection(roundId, customResults) {
  initializeLotterySystem();
  var rounds = _loadRounds();
  var idx = -1;

  for (var i = 0; i < rounds.length; i++) {
    if (rounds[i].roundId === roundId) {
      idx = i;
      break;
    }
  }
  if (idx === -1) return { success: false, message: '未找到该抽检轮次' };

  var round = rounds[idx];
  if (round.status !== LOTTERY_STATUS.INSPECTING && round.status !== LOTTERY_STATUS.SAMPLED) {
    return { success: false, message: '当前状态无法完成检测' };
  }

  var batchResults = [];
  if (customResults && Array.isArray(customResults) && customResults.length > 0) {
    batchResults = customResults;
  } else {
    for (var j = 0; j < round.selectedBatchNos.length; j++) {
      batchResults.push(_mockInspectionResultForBatch(round.selectedBatchNos[j], roundId));
    }
  }

  var overallConclusion = '合格';
  for (var k = 0; k < batchResults.length; k++) {
    if (batchResults[k].conclusion !== '合格') {
      overallConclusion = '不合格';
      break;
    }
  }

  round.status = LOTTERY_STATUS.REPORTED;
  round.inspectionResult = {
    reportDate: _formatDate(_now()),
    overallConclusion: overallConclusion,
    batchResults: batchResults
  };
  rounds[idx] = round;

  _updateBatchReportMap(round);

  var onChainProofs = _loadOnChainProofs();
  var proof = onChainProofs[roundId] || _buildOnChainProof(round, 'reported');
  proof.onChainData = _buildOnChainData(round, 'reported');
  proof.stage = 'reported';
  proof.timestamp = _formatDateTime(_now());
  onChainProofs[roundId] = proof;
  _saveOnChainProofs(onChainProofs);

  round.blockchainEndorsement = proof;
  rounds[idx] = round;
  _saveRounds(rounds);

  return {
    success: true,
    round: round,
    batchReportMap: _loadBatchReportMap(),
    message: '检测完成，结果已上链存证并写入批次历史报告'
  };
}

function closeLotteryRound(roundId) {
  initializeLotterySystem();
  var rounds = _loadRounds();
  var idx = -1;

  for (var i = 0; i < rounds.length; i++) {
    if (rounds[i].roundId === roundId) {
      idx = i;
      break;
    }
  }
  if (idx === -1) return { success: false, message: '未找到该抽检轮次' };

  rounds[idx].status = LOTTERY_STATUS.CLOSED;
  _saveRounds(rounds);

  return { success: true, message: '抽检轮次已归档' };
}

function _loadRoundMeta() {
  var meta = safeGetStorage(STORAGE_KEY_START_META, null);
  if (meta && typeof meta === 'object') return meta;
  return {};
}

function _saveRoundMeta(meta) {
  return safeSetStorage(STORAGE_KEY_START_META, meta);
}

function _getRoundMeta(roundId) {
  var allMeta = _loadRoundMeta();
  return allMeta[roundId] || null;
}

function _setRoundMeta(roundId, metaData) {
  var allMeta = _loadRoundMeta();
  allMeta[roundId] = Object.assign({}, allMeta[roundId] || {}, metaData);
  _saveRoundMeta(allMeta);
  return allMeta[roundId];
}

function _checkMemberAdequacy(round) {
  var currentCount = (round.consumerWitnesses || []).length;
  var minWitnesses = round.minWitnesses || DEFAULT_MIN_WITNESSES;
  var maxWitnesses = round.maxWitnesses || DEFAULT_MAX_WITNESSES;

  return {
    currentCount: currentCount,
    minWitnesses: minWitnesses,
    maxWitnesses: maxWitnesses,
    isSufficient: currentCount >= minWitnesses,
    isFull: currentCount >= maxWitnesses,
    adequacyRatio: maxWitnesses > 0 ? currentCount / maxWitnesses : 0,
    deficit: Math.max(0, minWitnesses - currentCount),
    surplus: Math.max(0, currentCount - maxWitnesses)
  };
}

function _updateRoundStatus(roundId, newStatus, extraFields) {
  var rounds = _loadRounds();
  var found = false;

  for (var i = 0; i < rounds.length; i++) {
    if (rounds[i].roundId === roundId) {
      rounds[i].status = newStatus;
      if (extraFields && typeof extraFields === 'object') {
        for (var key in extraFields) {
          if (extraFields.hasOwnProperty(key)) {
            rounds[i][key] = extraFields[key];
          }
        }
      }
      found = true;
      break;
    }
  }

  if (found) {
    _saveRounds(rounds);
    return rounds[i];
  }
  return null;
}

function createScheduledLotteryRound(options) {
  initializeLotterySystem();
  options = options || {};

  var salesPool = _getSalesBatchPool();
  var roundId = generateLotteryId();
  var now = _now();
  var seed = options.drawSeed || ('SEED-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6));

  var round = {
    roundId: roundId,
    roundName: options.roundName || (_formatDate(now) + ' 公开抽检'),
    status: LOTTERY_STATUS.SCHEDULED,
    scheduleDate: _formatDate(now),
    drawDate: options.drawDate ? _formatDateTime(options.drawDate) : null,
    drawSeed: seed,
    drawHash: generateSeedHash(seed + '-' + salesPool.slice().sort().join(',')),
    candidateBatchNos: salesPool.slice(),
    selectedBatchNos: [],
    inspectionTypes: options.inspectionTypes || DEFAULT_INSPECTION_TYPES.slice(),
    institution: options.institution || DEFAULT_INSTITUTION,
    liveStreamUrl: options.liveStreamUrl || '',
    replayUrl: '',
    consumerWitnesses: [],
    maxWitnesses: options.maxWitnesses || DEFAULT_MAX_WITNESSES,
    minWitnesses: options.minWitnesses || DEFAULT_MIN_WITNESSES,
    memberStrategy: options.memberStrategy || MEMBER_STRATEGY.WAIT,
    waitTimeout: options.waitTimeout || DEFAULT_WAIT_TIMEOUT,
    allowPartial: options.allowPartial !== false,
    currentWitnessCount: 0,
    isWitnessFull: false,
    inspectionResult: null,
    blockchainEndorsement: null,
    brandNarrative: options.brandNarrative || '品牌主动发起公开抽检，随机抽取在售批次，全程透明公开，接受消费者监督。'
  };

  var rounds = _loadRounds();
  rounds.push(round);
  _saveRounds(rounds);

  _setRoundMeta(roundId, {
    startStatus: START_STATUS.PENDING,
    strategy: round.memberStrategy,
    minWitnesses: round.minWitnesses,
    waitTimeout: round.waitTimeout,
    allowPartial: round.allowPartial,
    waitStartedAt: null,
    startedAt: null,
    failedAt: null,
    failReason: null,
    startedWithPartial: false
  });

  return {
    success: true,
    round: round,
    message: '抽检轮次已创建，状态为待抽签'
  };
}

function _handleFailStrategy(round, adequacy, meta) {
  if (!adequacy.isSufficient) {
    var failReason = '成员不足，当前 ' + adequacy.currentCount + ' 人，最低要求 ' + adequacy.minWitnesses + ' 人，缺 ' + adequacy.deficit + ' 人';

    _updateRoundStatus(round.roundId, LOTTERY_STATUS.FAILED, {
      startFailReason: failReason,
      startFailedAt: _formatDateTime(_now())
    });

    _setRoundMeta(round.roundId, {
      startStatus: START_STATUS.FAILED,
      failedAt: _formatDateTime(_now()),
      failReason: failReason
    });

    var updatedRound = Object.assign({}, round, {
      status: LOTTERY_STATUS.FAILED,
      startFailReason: failReason,
      startFailedAt: _formatDateTime(_now())
    });

    return {
      success: false,
      round: updatedRound,
      startStatus: START_STATUS.FAILED,
      adequacy: adequacy,
      message: failReason
    };
  }

  return null;
}

function _handleAlertStrategy(round, adequacy, meta) {
  if (!adequacy.isSufficient) {
    var alertMsg = '成员不足，当前 ' + adequacy.currentCount + '/' + adequacy.minWitnesses + ' 人，将按告警模式启动';

    round.status = LOTTERY_STATUS.DRAWING;
    round.selectedBatchNos = performLotteryDraw(round.candidateBatchNos, round.drawSeed);

    var onChainProofs = _loadOnChainProofs();
    var proof = _buildOnChainProof(round, 'drawing');
    round.blockchainEndorsement = proof;
    onChainProofs[round.roundId] = proof;
    _saveOnChainProofs(onChainProofs);

    _setRoundMeta(round.roundId, {
      startStatus: START_STATUS.PARTIAL,
      startedAt: _formatDateTime(_now()),
      startedWithPartial: true,
      adequacyAtStart: adequacy,
      alertMessage: alertMsg
    });

    var rounds = _loadRounds();
    for (var i = 0; i < rounds.length; i++) {
      if (rounds[i].roundId === round.roundId) {
        rounds[i] = round;
        break;
      }
    }
    _saveRounds(rounds);

    return {
      success: true,
      round: round,
      startStatus: START_STATUS.PARTIAL,
      adequacy: adequacy,
      isPartial: true,
      alertMessage: alertMsg,
      message: alertMsg + '，抽签已完成'
    };
  }

  return null;
}

function _handleWaitStrategy(round, adequacy, meta) {
  if (!adequacy.isSufficient) {
    var now = _now();
    var waitStartedAt = meta && meta.waitStartedAt ? new Date(meta.waitStartedAt) : null;
    var timeoutMs = round.waitTimeout || DEFAULT_WAIT_TIMEOUT;

    if (!waitStartedAt) {
      _setRoundMeta(round.roundId, {
        startStatus: START_STATUS.WAITING,
        waitStartedAt: _formatDateTime(now),
        adequacyAtWaitStart: adequacy
      });

      return {
        success: true,
        round: round,
        startStatus: START_STATUS.WAITING,
        adequacy: adequacy,
        isWaiting: true,
        timeoutMs: timeoutMs,
        waitStartedAt: _formatDateTime(now),
        message: '开始等待成员凑齐，超时时间 ' + (timeoutMs / 1000) + ' 秒，当前 ' + adequacy.currentCount + '/' + adequacy.minWitnesses + ' 人'
      };
    }

    var elapsedMs = now.getTime() - waitStartedAt.getTime();
    if (elapsedMs >= timeoutMs) {
      var timedOutMsg = '等待超时（' + (elapsedMs / 1000) + '秒），成员仍不足，当前 ' + adequacy.currentCount + '/' + adequacy.minWitnesses + ' 人';

      if (round.allowPartial) {
        round.status = LOTTERY_STATUS.DRAWING;
        round.selectedBatchNos = performLotteryDraw(round.candidateBatchNos, round.drawSeed);

        var onChainProofs = _loadOnChainProofs();
        var proof = _buildOnChainProof(round, 'drawing');
        round.blockchainEndorsement = proof;
        onChainProofs[round.roundId] = proof;
        _saveOnChainProofs(onChainProofs);

        _setRoundMeta(round.roundId, {
          startStatus: START_STATUS.PARTIAL,
          startedAt: _formatDateTime(now),
          startedWithPartial: true,
          adequacyAtStart: adequacy,
          waitTimedOut: true,
          waitElapsedMs: elapsedMs
        });

        var rounds = _loadRounds();
        for (var i = 0; i < rounds.length; i++) {
          if (rounds[i].roundId === round.roundId) {
            rounds[i] = round;
            break;
          }
        }
        _saveRounds(rounds);

        return {
          success: true,
          round: round,
          startStatus: START_STATUS.PARTIAL,
          adequacy: adequacy,
          isPartial: true,
          waitTimedOut: true,
          waitElapsedMs: elapsedMs,
          message: timedOutMsg + '，已按部分可用模式启动'
        };
      } else {
        _updateRoundStatus(round.roundId, LOTTERY_STATUS.FAILED, {
          startFailReason: timedOutMsg,
          startFailedAt: _formatDateTime(now),
          waitTimedOut: true
        });

        _setRoundMeta(round.roundId, {
          startStatus: START_STATUS.FAILED,
          failedAt: _formatDateTime(now),
          failReason: timedOutMsg,
          waitTimedOut: true,
          waitElapsedMs: elapsedMs
        });

        var failedRound = Object.assign({}, round, {
          status: LOTTERY_STATUS.FAILED,
          startFailReason: timedOutMsg,
          startFailedAt: _formatDateTime(now)
        });

        return {
          success: false,
          round: failedRound,
          startStatus: START_STATUS.FAILED,
          adequacy: adequacy,
          waitTimedOut: true,
          waitElapsedMs: elapsedMs,
          message: timedOutMsg + '，启动失败'
        };
      }
    }

    var remainingMs = timeoutMs - elapsedMs;
    return {
      success: true,
      round: round,
      startStatus: START_STATUS.WAITING,
      adequacy: adequacy,
      isWaiting: true,
      timeoutMs: timeoutMs,
      elapsedMs: elapsedMs,
      remainingMs: remainingMs,
      waitStartedAt: meta.waitStartedAt,
      message: '等待中，已过 ' + (elapsedMs / 1000).toFixed(0) + ' 秒，剩余 ' + (remainingMs / 1000).toFixed(0) + ' 秒，当前 ' + adequacy.currentCount + '/' + adequacy.minWitnesses + ' 人'
    };
  }

  return null;
}

function _finalizeNormalStart(round, adequacy) {
  var now = _now();

  round.status = LOTTERY_STATUS.DRAWING;
  round.selectedBatchNos = performLotteryDraw(round.candidateBatchNos, round.drawSeed);

  var onChainProofs = _loadOnChainProofs();
  var proof = _buildOnChainProof(round, 'drawing');
  round.blockchainEndorsement = proof;
  onChainProofs[round.roundId] = proof;
  _saveOnChainProofs(onChainProofs);

  _setRoundMeta(round.roundId, {
    startStatus: START_STATUS.STARTED,
    startedAt: _formatDateTime(now),
    adequacyAtStart: adequacy,
    startedWithPartial: false
  });

  var rounds = _loadRounds();
  for (var i = 0; i < rounds.length; i++) {
    if (rounds[i].roundId === round.roundId) {
      rounds[i] = round;
      break;
    }
  }
  _saveRounds(rounds);

  return {
    success: true,
    round: round,
    startStatus: START_STATUS.STARTED,
    adequacy: adequacy,
    isPartial: false,
    message: '成员充足（' + adequacy.currentCount + '/' + adequacy.minWitnesses + '），抽签已完成，结果已上链存证'
  };
}

function startLotteryRound(roundId) {
  initializeLotterySystem();

  var rounds = _loadRounds();
  var round = null;
  var roundIdx = -1;

  for (var i = 0; i < rounds.length; i++) {
    if (rounds[i].roundId === roundId) {
      round = rounds[i];
      roundIdx = i;
      break;
    }
  }

  if (!round) {
    return {
      success: false,
      startStatus: START_STATUS.FAILED,
      message: '未找到该抽检轮次'
    };
  }

  var meta = _getRoundMeta(roundId);

  if (meta && meta.startStatus) {
    if (meta.startStatus === START_STATUS.STARTED) {
      return {
        success: false,
        startStatus: START_STATUS.STARTED,
        message: '该轮次已正常启动，无需重复启动'
      };
    }
    if (meta.startStatus === START_STATUS.PARTIAL) {
      return {
        success: false,
        startStatus: START_STATUS.PARTIAL,
        message: '该轮次已按部分可用模式启动，无法再次启动'
      };
    }
    if (meta.startStatus === START_STATUS.FAILED) {
      return {
        success: false,
        startStatus: START_STATUS.FAILED,
        message: '该轮次启动已失败（' + (meta.failReason || '未知原因') + '），无法再次启动'
      };
    }
  }

  if (round.status !== LOTTERY_STATUS.SCHEDULED && round.status !== LOTTERY_STATUS.DRAWING) {
    return {
      success: false,
      startStatus: START_STATUS.FAILED,
      message: '当前状态 ' + round.status + ' 不允许启动，仅 SCHEDULED 状态可启动'
    };
  }

  var adequacy = _checkMemberAdequacy(round);
  var strategy = (meta && meta.strategy) || round.memberStrategy || MEMBER_STRATEGY.WAIT;

  if (adequacy.isSufficient) {
    return _finalizeNormalStart(round, adequacy);
  }

  var strategyResult = null;

  switch (strategy) {
    case MEMBER_STRATEGY.FAIL:
      strategyResult = _handleFailStrategy(round, adequacy, meta);
      break;
    case MEMBER_STRATEGY.ALERT:
      strategyResult = _handleAlertStrategy(round, adequacy, meta);
      break;
    case MEMBER_STRATEGY.WAIT:
    default:
      strategyResult = _handleWaitStrategy(round, adequacy, meta);
      break;
  }

  if (strategyResult) {
    return strategyResult;
  }

  return _finalizeNormalStart(round, adequacy);
}

function cancelStartLottery(roundId) {
  initializeLotterySystem();
  var meta = _getRoundMeta(roundId);

  if (!meta || meta.startStatus !== START_STATUS.WAITING) {
    return {
      success: false,
      message: '当前轮次不处于等待状态，无法取消'
    };
  }

  _updateRoundStatus(roundId, LOTTERY_STATUS.CANCELLED, {
    startCancelledAt: _formatDateTime(_now()),
    startCancelReason: '等待被手动取消'
  });

  _setRoundMeta(roundId, {
    startStatus: START_STATUS.FAILED,
    failedAt: _formatDateTime(_now()),
    failReason: '等待被手动取消',
    cancelled: true
  });

  return {
    success: true,
    message: '已取消等待，启动失败'
  };
}

function getRoundStartStatus(roundId) {
  initializeLotterySystem();
  var round = getLotteryRoundById(roundId);
  if (!round) {
    return { success: false, message: '未找到该抽检轮次' };
  }

  var meta = _getRoundMeta(roundId);
  var adequacy = _checkMemberAdequacy(round);

  return {
    success: true,
    roundId: roundId,
    status: round.status,
    startStatus: meta ? meta.startStatus : START_STATUS.PENDING,
    strategy: meta ? meta.strategy : null,
    adequacy: adequacy,
    meta: meta,
    canStart: round.status === LOTTERY_STATUS.SCHEDULED ||
      (round.status === LOTTERY_STATUS.DRAWING && (!meta || meta.startStatus === START_STATUS.WAITING))
  };
}

function getOnChainProof(roundId) {
  initializeLotterySystem();
  var proofs = _loadOnChainProofs();
  return proofs[roundId] || null;
}

function getAllOnChainProofs() {
  initializeLotterySystem();
  return _loadOnChainProofs();
}

function getOnChainProofsForBatch(batchNo) {
  initializeLotterySystem();
  var rounds = getLotteryRoundsForBatch(batchNo);
  var proofs = _loadOnChainProofs();
  var results = [];

  for (var i = 0; i < rounds.length; i++) {
    if (proofs[rounds[i].roundId]) {
      results.push(proofs[rounds[i].roundId]);
    }
  }

  return results;
}

function mergeLotteryResultToHistoryReports(round, batchNo) {
  if (!round || !round.inspectionResult || !round.inspectionResult.batchResults) return null;

  var batchResult = null;
  for (var i = 0; i < round.inspectionResult.batchResults.length; i++) {
    if (round.inspectionResult.batchResults[i].batchNo === batchNo) {
      batchResult = round.inspectionResult.batchResults[i];
      break;
    }
  }

  if (!batchResult) return null;

  var historyReport = {
    reportNo: batchResult.reportNo,
    testDate: round.inspectionResult.reportDate,
    institution: round.institution,
    status: batchResult.conclusion,
    statusLevel: batchResult.conclusion === '合格' ? '优秀' : '异常',
    batchNo: batchNo,
    isPublicLottery: true,
    lotteryRoundId: round.roundId,
    lotteryRoundName: round.roundName,
    witnessCount: round.consumerWitnesses ? round.consumerWitnesses.length : 0,
    blockchainTxHash: round.blockchainEndorsement ? round.blockchainEndorsement.txHashShort : ''
  };

  return historyReport;
}

function enrichHistoryReportsWithLottery(traceId) {
  var data = mockData.getTraceData(traceId);
  if (!data || !data.pesticideTest || !data.pesticideTest.historyReports) return [];

  var batchNo = data.basicInfo.batchNo;
  var lotteryRounds = getLotteryRoundsForBatch(batchNo);
  var enrichedReports = data.pesticideTest.historyReports.slice();

  var batchReportMap = _loadBatchReportMap();
  var batchReports = batchReportMap[batchNo] || [];

  for (var i = 0; i < batchReports.length; i++) {
    var br = batchReports[i];
    var exists = false;
    for (var j = 0; j < enrichedReports.length; j++) {
      if (enrichedReports[j].reportNo === br.reportNo) {
        exists = true;
        enrichedReports[j] = Object.assign({}, enrichedReports[j], {
          isPublicLottery: true,
          lotteryRoundId: br.roundId,
          lotteryRoundName: br.roundName,
          witnessCount: br.witnessCount,
          blockchainTxHash: br.blockchainTxHash
        });
        break;
      }
    }
    if (!exists) {
      enrichedReports.unshift({
        reportNo: br.reportNo,
        testDate: br.reportDate,
        institution: br.institution,
        status: br.conclusion,
        statusLevel: br.conclusion === '合格' ? '优秀' : '异常',
        batchNo: br.batchNo,
        isPublicLottery: true,
        lotteryRoundId: br.roundId,
        lotteryRoundName: br.roundName,
        witnessCount: br.witnessCount,
        blockchainTxHash: br.blockchainTxHash
      });
    }
  }

  return enrichedReports;
}

function getBlockchainCrossEndorsement(traceId) {
  var data = mockData.getTraceData(traceId);
  if (!data || !data.blockchainInfo) return null;

  var batchNo = data.basicInfo.batchNo;
  var onChainProofs = getOnChainProofsForBatch(batchNo);

  if (onChainProofs.length === 0) return null;

  var lotteryRounds = getLotteryRoundsForBatch(batchNo);
  var roundMap = {};
  for (var i = 0; i < lotteryRounds.length; i++) {
    roundMap[lotteryRounds[i].roundId] = lotteryRounds[i];
  }

  var endorsements = [];
  for (var j = 0; j < onChainProofs.length; j++) {
    var proof = onChainProofs[j];
    var round = roundMap[proof.roundId];
    var conclusion = '检测中';
    if (round && round.inspectionResult) {
      conclusion = round.inspectionResult.overallConclusion;
    }

    endorsements.push({
      roundId: proof.roundId,
      roundName: round ? round.roundName : proof.roundId,
      txHash: proof.txHash,
      txHashShort: proof.txHashShort,
      chainName: proof.chainName,
      timestamp: proof.timestamp,
      conclusion: conclusion,
      stage: proof.stage,
      blockExplorerUrl: proof.blockExplorerUrl,
      onChainData: proof.onChainData
    });
  }

  return {
    sourceChainTxHash: data.blockchainInfo.txHashShort,
    sourceChainName: data.blockchainInfo.chainName,
    sourceTxHash: data.blockchainInfo.txHash,
    lotteryEndorsements: endorsements,
    crossVerified: endorsements.length > 0,
    sharedDataSource: true,
    narrative: endorsements.length > 0
      ? '该批次产品溯源信息已在' + data.blockchainInfo.chainName + '上链存证，同时经过' + endorsements.length + '轮公开抽检。抽签过程与检测结果均写入同一条链上存证，溯源数据与抽检数据共享统一链上数据源，互相背书，形成双重可信保障，不可篡改。'
      : null
  };
}

function getInspectionTypeLabel(type) {
  return INSPECTION_TYPE_LABELS[type] || type;
}

function getStatusLabel(status) {
  return LOTTERY_STATUS_LABELS[status] || status;
}

function getStatusColor(status) {
  return LOTTERY_STATUS_COLORS[status] || '#909399';
}

function getSalesBatchPool() {
  return _getSalesBatchPool();
}

function getBatchReportMap() {
  initializeLotterySystem();
  return _loadBatchReportMap();
}

function getReportsForBatch(batchNo) {
  initializeLotterySystem();
  var map = _loadBatchReportMap();
  return map[batchNo] || [];
}

module.exports = {
  LOTTERY_STATUS: LOTTERY_STATUS,
  LOTTERY_STATUS_LABELS: LOTTERY_STATUS_LABELS,
  LOTTERY_STATUS_COLORS: LOTTERY_STATUS_COLORS,
  INSPECTION_TYPE_LABELS: INSPECTION_TYPE_LABELS,
  STORAGE_KEY_ROUNDS: STORAGE_KEY_ROUNDS,
  STORAGE_KEY_ONCHAIN_PROOFS: STORAGE_KEY_ONCHAIN_PROOFS,
  STORAGE_KEY_BATCH_REPORT_MAP: STORAGE_KEY_BATCH_REPORT_MAP,

  initializeLotterySystem: initializeLotterySystem,
  resetLotterySystem: resetLotterySystem,

  getPublicLotteryData: getPublicLotteryData,
  getPublicLotteryByBatchNo: getPublicLotteryByBatchNo,
  getAllLotteryRounds: getAllLotteryRounds,
  getLotteryRoundById: getLotteryRoundById,
  getLotteryRoundsForBatch: getLotteryRoundsForBatch,

  registerWitness: registerWitness,
  getWitnessRegistrations: getWitnessRegistrations,

  createNewLotteryRound: createNewLotteryRound,
  advanceLotteryToSampled: advanceLotteryToSampled,
  advanceLotteryToInspecting: advanceLotteryToInspecting,
  completeLotteryInspection: completeLotteryInspection,
  closeLotteryRound: closeLotteryRound,

  getOnChainProof: getOnChainProof,
  getAllOnChainProofs: getAllOnChainProofs,
  getOnChainProofsForBatch: getOnChainProofsForBatch,

  mergeLotteryResultToHistoryReports: mergeLotteryResultToHistoryReports,
  enrichHistoryReportsWithLottery: enrichHistoryReportsWithLottery,
  getBlockchainCrossEndorsement: getBlockchainCrossEndorsement,

  performLotteryDraw: performLotteryDraw,
  generateLotteryId: generateLotteryId,
  generateSeedHash: generateSeedHash,
  generateTxHash: generateTxHash,
  shortTxHash: shortTxHash,

  getInspectionTypeLabel: getInspectionTypeLabel,
  getStatusLabel: getStatusLabel,
  getStatusColor: getStatusColor,
  getSalesBatchPool: getSalesBatchPool,
  getBatchReportMap: getBatchReportMap,
  getReportsForBatch: getReportsForBatch,

  MEMBER_STRATEGY: MEMBER_STRATEGY,
  MEMBER_STRATEGY_LABELS: MEMBER_STRATEGY_LABELS,
  START_STATUS: START_STATUS,
  DEFAULT_MIN_WITNESSES: DEFAULT_MIN_WITNESSES,
  DEFAULT_WAIT_TIMEOUT: DEFAULT_WAIT_TIMEOUT,

  createScheduledLotteryRound: createScheduledLotteryRound,
  startLotteryRound: startLotteryRound,
  cancelStartLottery: cancelStartLottery,
  getRoundStartStatus: getRoundStartStatus
};
