var mockData = require('./mockData.js');

var PUBLIC_LOTTERY_STORAGE_KEY = 'public_lottery_witness_registrations';
var PUBLIC_LOTTERY_VOTES_KEY = 'public_lottery_consumer_votes';

var LOTTERY_STATUS = {
  SCHEDULED: 'scheduled',
  DRAWING: 'drawing',
  SAMPLED: 'sampled',
  INSPECTING: 'inspecting',
  REPORTED: 'reported',
  CLOSED: 'closed'
};

var LOTTERY_STATUS_LABELS = {
  scheduled: '待抽签',
  drawing: '抽签中',
  sampled: '已取样',
  inspecting: '检测中',
  reported: '已出报告',
  closed: '已归档'
};

var LOTTERY_STATUS_COLORS = {
  scheduled: '#909399',
  drawing: '#E6A23C',
  sampled: '#409EFF',
  inspecting: '#E6A23C',
  reported: '#67C23A',
  closed: '#909399'
};

var INSPECTION_TYPE_LABELS = {
  pesticide: '农残检测',
  heavyMetal: '重金属检测',
  microbiological: '微生物检测',
  additive: '添加剂检测'
};

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
  } catch (e) {
    console.error('[公开抽检] 存储失败:', e);
  }
}

function generateLotteryId() {
  var now = new Date();
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
  return Math.abs(hash).toString(16);
}

function performLotteryDraw(candidateBatchNos, seed) {
  if (!candidateBatchNos || candidateBatchNos.length === 0) return [];

  var sortedBatchNos = candidateBatchNos.slice().sort();
  var hashInput = seed + '-' + sortedBatchNos.join(',');
  var hash = generateSeedHash(hashInput);

  var selectedCount = Math.max(1, Math.ceil(sortedBatchNos.length * 0.3));
  var result = [];
  var remaining = sortedBatchNos.slice();

  for (var i = 0; i < selectedCount && remaining.length > 0; i++) {
    var idx = (parseInt(hash.substr(i % hash.length, 4), 16) || 0) % remaining.length;
    result.push(remaining[idx]);
    remaining.splice(idx, 1);
  }

  return result;
}

function getPublicLotteryData(traceId) {
  var data = mockData.getTraceData(traceId);
  if (!data) return null;

  var batchNo = data.basicInfo && data.basicInfo.batchNo;
  if (!batchNo) return null;

  return getPublicLotteryByBatchNo(batchNo);
}

function getPublicLotteryByBatchNo(batchNo) {
  var allRounds = getAllLotteryRounds();
  var matchedRounds = [];

  for (var i = 0; i < allRounds.length; i++) {
    var round = allRounds[i];
    var isMatch = false;
    for (var j = 0; j < round.selectedBatchNos.length; j++) {
      if (round.selectedBatchNos[j] === batchNo) {
        isMatch = true;
        break;
      }
    }
    if (isMatch) {
      matchedRounds.push(round);
    }
  }

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

function getAllLotteryRounds() {
  return _getMockLotteryRounds();
}

function _getMockLotteryRounds() {
  return [
    {
      roundId: 'PIL-20250901-0001',
      roundName: '2025年9月公开抽检（第1轮）',
      status: LOTTERY_STATUS.REPORTED,
      scheduleDate: '2025-09-01',
      drawDate: '2025-09-03 14:00:00',
      drawSeed: 'SEED-20250903-GHTEA',
      drawHash: generateSeedHash('SEED-20250903-GHTEA-GH202503,GH202504,GH202502'),
      candidateBatchNos: ['GH202501', 'GH202502', 'GH202503', 'GH202504'],
      selectedBatchNos: ['GH202503', 'GH202501'],
      inspectionTypes: ['pesticide', 'heavyMetal'],
      institution: '国家茶叶质量监督检验中心',
      liveStreamUrl: 'https://live.example.com/lottery/20250903',
      replayUrl: 'https://replay.example.com/lottery/20250903',
      consumerWitnesses: [
        { name: '张**', phone: '138****5678', registeredAt: '2025-08-28 10:23:45', attended: true },
        { name: '李**', phone: '139****1234', registeredAt: '2025-08-29 15:42:18', attended: true },
        { name: '王**', phone: '137****9012', registeredAt: '2025-08-30 09:11:33', attended: false }
      ],
      maxWitnesses: 5,
      inspectionResult: {
        reportDate: '2025-09-15',
        overallConclusion: '合格',
        batchResults: [
          {
            batchNo: 'GH202503',
            conclusion: '合格',
            reportNo: 'PIL-NTQC-2025-09-001',
            testItems: [
              { item: '六六六', value: 0.005, unit: 'mg/kg', limit: 0.1, status: '合格' },
              { item: '滴滴涕', value: 0.008, unit: 'mg/kg', limit: 0.2, status: '合格' },
              { item: '铅', value: 0.3, unit: 'mg/kg', limit: 5.0, status: '合格' }
            ]
          },
          {
            batchNo: 'GH202501',
            conclusion: '合格',
            reportNo: 'PIL-NTQC-2025-09-002',
            testItems: [
              { item: '六六六', value: 0.006, unit: 'mg/kg', limit: 0.1, status: '合格' },
              { item: '滴滴涕', value: 0.009, unit: 'mg/kg', limit: 0.2, status: '合格' },
              { item: '铅', value: 0.4, unit: 'mg/kg', limit: 5.0, status: '合格' }
            ]
          }
        ]
      },
      blockchainEndorsement: {
        txHash: '0xab12cd34ef56ab12cd34ef56ab12cd34ef56ab12cd34ef56ab12cd34ef56ab12',
        txHashShort: '0xab12cd...ef56ab',
        chainName: '溯源链',
        timestamp: '2025-09-03 14:00:05',
        onChainData: [
          { key: 'drawSeed', label: '抽签种子', value: 'SEED-20250903-GHTEA', onChain: true },
          { key: 'drawHash', label: '抽签哈希', value: generateSeedHash('SEED-20250903-GHTEA-GH202503,GH202504,GH202502'), onChain: true },
          { key: 'selectedBatchNos', label: '中签批次', value: 'GH202503, GH202501', onChain: true },
          { key: 'institution', label: '检测机构', value: '国家茶叶质量监督检验中心', onChain: true },
          { key: 'witnessCount', label: '见证人数', value: '3', onChain: true },
          { key: 'inspectionResult', label: '检测结论', value: '合格', onChain: true }
        ],
        blockExplorerUrl: 'https://explorer.tracechain.cn/tx/0xab12cd34ef56ab12cd34ef56ab12cd34ef56ab12cd34ef56ab12cd34ef56ab12'
      },
      brandNarrative: '本次抽检由品牌主动发起，全程直播公开，消费者现场见证，抽签种子与结果已上链存证，不可篡改。品牌对每一批次品质负责，敢于接受公开检验。'
    },
    {
      roundId: 'PIL-20251201-0002',
      roundName: '2025年12月公开抽检（第2轮）',
      status: LOTTERY_STATUS.INSPECTING,
      scheduleDate: '2025-12-01',
      drawDate: '2025-12-03 14:00:00',
      drawSeed: 'SEED-20251203-GHTEA',
      drawHash: generateSeedHash('SEED-20251203-GHTEA-GH202503,GH202504'),
      candidateBatchNos: ['GH202503', 'GH202504'],
      selectedBatchNos: ['GH202504'],
      inspectionTypes: ['pesticide', 'microbiological'],
      institution: '湖北省农产品质量安全检测中心',
      liveStreamUrl: 'https://live.example.com/lottery/20251203',
      replayUrl: '',
      consumerWitnesses: [
        { name: '赵**', phone: '136****3456', registeredAt: '2025-11-28 08:15:22', attended: true },
        { name: '钱**', phone: '135****7890', registeredAt: '2025-11-29 12:30:45', attended: false }
      ],
      maxWitnesses: 5,
      inspectionResult: null,
      blockchainEndorsement: {
        txHash: '0xcd78ef90ab12cd78ef90ab12cd78ef90ab12cd78ef90ab12cd78ef90ab12cd78',
        txHashShort: '0xcd78ef...ab12cd',
        chainName: '溯源链',
        timestamp: '2025-12-03 14:00:03',
        onChainData: [
          { key: 'drawSeed', label: '抽签种子', value: 'SEED-20251203-GHTEA', onChain: true },
          { key: 'drawHash', label: '抽签哈希', value: generateSeedHash('SEED-20251203-GHTEA-GH202503,GH202504'), onChain: true },
          { key: 'selectedBatchNos', label: '中签批次', value: 'GH202504', onChain: true },
          { key: 'institution', label: '检测机构', value: '湖北省农产品质量安全检测中心', onChain: true },
          { key: 'witnessCount', label: '见证人数', value: '2', onChain: true }
        ],
        blockExplorerUrl: 'https://explorer.tracechain.cn/tx/0xcd78ef90ab12cd78ef90ab12cd78ef90ab12cd78ef90ab12cd78ef90ab12cd78'
      },
      brandNarrative: '品牌持续开展公开抽检，本轮对在售批次进行随机抽取，全程直播取样送检过程。消费者可报名亲临现场见证，确保抽检过程真实透明。'
    }
  ];
}

function registerWitness(roundId, name, phone) {
  var rounds = _getMockLotteryRounds();
  var round = null;
  for (var i = 0; i < rounds.length; i++) {
    if (rounds[i].roundId === roundId) {
      round = rounds[i];
      break;
    }
  }
  if (!round) return { success: false, message: '未找到该抽检轮次' };

  if (round.status === LOTTERY_STATUS.CLOSED || round.status === LOTTERY_STATUS.REPORTED) {
    return { success: false, message: '该轮抽检已结束，无法报名' };
  }

  if (round.consumerWitnesses && round.consumerWitnesses.length >= round.maxWitnesses) {
    return { success: false, message: '见证名额已满' };
  }

  var registrations = safeGetStorage(PUBLIC_LOTTERY_STORAGE_KEY, {});
  if (!registrations[roundId]) registrations[roundId] = [];

  for (var j = 0; j < registrations[roundId].length; j++) {
    if (registrations[roundId][j].phone === phone) {
      return { success: false, message: '该手机号已报名' };
    }
  }

  var maskedName = name.charAt(0) + '**';
  var maskedPhone = phone.substring(0, 3) + '****' + phone.substring(7);

  var newRegistration = {
    name: maskedName,
    phone: maskedPhone,
    registeredAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    attended: false
  };

  registrations[roundId].push(newRegistration);
  safeSetStorage(PUBLIC_LOTTERY_STORAGE_KEY, registrations);

  return { success: true, message: '报名成功', registration: newRegistration };
}

function getWitnessRegistrations(roundId) {
  var registrations = safeGetStorage(PUBLIC_LOTTERY_STORAGE_KEY, {});
  return registrations[roundId] || [];
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

function getLotteryRoundsForBatch(batchNo) {
  var allRounds = getAllLotteryRounds();
  var results = [];

  for (var i = 0; i < allRounds.length; i++) {
    var round = allRounds[i];
    for (var j = 0; j < round.selectedBatchNos.length; j++) {
      if (round.selectedBatchNos[j] === batchNo) {
        results.push(round);
        break;
      }
    }
  }

  return results;
}

function enrichHistoryReportsWithLottery(traceId) {
  var data = mockData.getTraceData(traceId);
  if (!data || !data.pesticideTest || !data.pesticideTest.historyReports) return [];

  var batchNo = data.basicInfo.batchNo;
  var lotteryRounds = getLotteryRoundsForBatch(batchNo);
  var enrichedReports = data.pesticideTest.historyReports.slice();

  for (var i = 0; i < lotteryRounds.length; i++) {
    var round = lotteryRounds[i];
    if (round.status === LOTTERY_STATUS.REPORTED || round.status === LOTTERY_STATUS.CLOSED) {
      var lotteryReport = mergeLotteryResultToHistoryReports(round, batchNo);
      if (lotteryReport) {
        var exists = false;
        for (var j = 0; j < enrichedReports.length; j++) {
          if (enrichedReports[j].reportNo === lotteryReport.reportNo) {
            exists = true;
            break;
          }
        }
        if (!exists) {
          enrichedReports.unshift(lotteryReport);
        }
      }
    }
  }

  return enrichedReports;
}

function getBlockchainCrossEndorsement(traceId) {
  var data = mockData.getTraceData(traceId);
  if (!data || !data.blockchainInfo) return null;

  var batchNo = data.basicInfo.batchNo;
  var lotteryRounds = getLotteryRoundsForBatch(batchNo);

  if (lotteryRounds.length === 0) return null;

  var endorsements = [];
  for (var i = 0; i < lotteryRounds.length; i++) {
    var round = lotteryRounds[i];
    if (round.blockchainEndorsement) {
      endorsements.push({
        roundId: round.roundId,
        roundName: round.roundName,
        txHash: round.blockchainEndorsement.txHash,
        txHashShort: round.blockchainEndorsement.txHashShort,
        chainName: round.blockchainEndorsement.chainName,
        timestamp: round.blockchainEndorsement.timestamp,
        conclusion: round.inspectionResult ? round.inspectionResult.overallConclusion : '检测中',
        blockExplorerUrl: round.blockchainEndorsement.blockExplorerUrl
      });
    }
  }

  return {
    sourceChainTxHash: data.blockchainInfo.txHashShort,
    sourceChainName: data.blockchainInfo.chainName,
    lotteryEndorsements: endorsements,
    crossVerified: endorsements.length > 0,
    narrative: endorsements.length > 0
      ? '该批次产品溯源信息已在' + data.blockchainInfo.chainName + '上链存证，同时经过' + endorsements.length + '轮公开抽检，抽签过程与结果均在链上可验证，溯源数据与抽检结果互相背书，形成双重可信保障。'
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

module.exports = {
  LOTTERY_STATUS: LOTTERY_STATUS,
  LOTTERY_STATUS_LABELS: LOTTERY_STATUS_LABELS,
  LOTTERY_STATUS_COLORS: LOTTERY_STATUS_COLORS,
  INSPECTION_TYPE_LABELS: INSPECTION_TYPE_LABELS,
  getPublicLotteryData: getPublicLotteryData,
  getPublicLotteryByBatchNo: getPublicLotteryByBatchNo,
  getAllLotteryRounds: getAllLotteryRounds,
  registerWitness: registerWitness,
  getWitnessRegistrations: getWitnessRegistrations,
  mergeLotteryResultToHistoryReports: mergeLotteryResultToHistoryReports,
  getLotteryRoundsForBatch: getLotteryRoundsForBatch,
  enrichHistoryReportsWithLottery: enrichHistoryReportsWithLottery,
  getBlockchainCrossEndorsement: getBlockchainCrossEndorsement,
  performLotteryDraw: performLotteryDraw,
  generateLotteryId: generateLotteryId,
  generateSeedHash: generateSeedHash,
  getInspectionTypeLabel: getInspectionTypeLabel,
  getStatusLabel: getStatusLabel,
  getStatusColor: getStatusColor
};
