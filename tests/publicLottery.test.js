var storageMock = {};

global.wx = {
  getStorageSync: jest.fn(function(key) {
    return storageMock[key] !== undefined ? storageMock[key] : '';
  }),
  setStorageSync: jest.fn(function(key, value) {
    storageMock[key] = value;
  }),
  removeStorageSync: jest.fn(function(key) {
    delete storageMock[key];
  }),
  showToast: jest.fn(),
  showModal: jest.fn()
};

function resetStorage() {
  storageMock = {};
  wx.getStorageSync.mockClear();
  wx.setStorageSync.mockClear();
}

var publicLottery = require('../utils/publicLottery.js');
var mockData = require('../utils/mockData.js');

describe('公开抽检与透明 Lottery 模块测试', function() {

  beforeEach(function() {
    resetStorage();
  });

  describe('基础配置测试', function() {
    test('LOTTERY_STATUS 枚举应正确定义', function() {
      expect(publicLottery.LOTTERY_STATUS.SCHEDULED).toBe('scheduled');
      expect(publicLottery.LOTTERY_STATUS.DRAWING).toBe('drawing');
      expect(publicLottery.LOTTERY_STATUS.SAMPLED).toBe('sampled');
      expect(publicLottery.LOTTERY_STATUS.INSPECTING).toBe('inspecting');
      expect(publicLottery.LOTTERY_STATUS.REPORTED).toBe('reported');
      expect(publicLottery.LOTTERY_STATUS.CLOSED).toBe('closed');
    });

    test('状态标签应正确定义', function() {
      expect(publicLottery.LOTTERY_STATUS_LABELS.scheduled).toBe('待抽签');
      expect(publicLottery.LOTTERY_STATUS_LABELS.drawing).toBe('抽签中');
      expect(publicLottery.LOTTERY_STATUS_LABELS.reported).toBe('已出报告');
      expect(publicLottery.LOTTERY_STATUS_LABELS.closed).toBe('已归档');
    });

    test('检测类型标签应正确定义', function() {
      expect(publicLottery.INSPECTION_TYPE_LABELS.pesticide).toBe('农残检测');
      expect(publicLottery.INSPECTION_TYPE_LABELS.heavyMetal).toBe('重金属检测');
      expect(publicLottery.INSPECTION_TYPE_LABELS.microbiological).toBe('微生物检测');
      expect(publicLottery.INSPECTION_TYPE_LABELS.additive).toBe('添加剂检测');
    });

    test('getStatusLabel 应返回正确的中文标签', function() {
      expect(publicLottery.getStatusLabel('reported')).toBe('已出报告');
      expect(publicLottery.getStatusLabel('inspecting')).toBe('检测中');
      expect(publicLottery.getStatusLabel('unknown')).toBe('unknown');
    });

    test('getStatusColor 应返回正确的颜色值', function() {
      expect(publicLottery.getStatusColor('reported')).toBe('#67C23A');
      expect(publicLottery.getStatusColor('inspecting')).toBe('#E6A23C');
    });

    test('getInspectionTypeLabel 应返回正确的标签', function() {
      expect(publicLottery.getInspectionTypeLabel('pesticide')).toBe('农残检测');
      expect(publicLottery.getInspectionTypeLabel('unknown_type')).toBe('unknown_type');
    });
  });

  describe('抽签算法测试', function() {
    test('generateSeedHash 应生成一致的哈希值', function() {
      var hash1 = publicLottery.generateSeedHash('test-seed-123');
      var hash2 = publicLottery.generateSeedHash('test-seed-123');
      expect(hash1).toBe(hash2);
    });

    test('不同种子应生成不同哈希值', function() {
      var hash1 = publicLottery.generateSeedHash('seed-A');
      var hash2 = publicLottery.generateSeedHash('seed-B');
      expect(hash1).not.toBe(hash2);
    });

    test('performLotteryDraw 应从候选批次中抽取', function() {
      var candidates = ['GH202501', 'GH202502', 'GH202503', 'GH202504'];
      var result = publicLottery.performLotteryDraw(candidates, 'SEED-TEST');
      expect(result.length).toBeGreaterThan(0);
      expect(result.length).toBeLessThanOrEqual(candidates.length);
      for (var i = 0; i < result.length; i++) {
        expect(candidates.indexOf(result[i])).toBeGreaterThan(-1);
      }
    });

    test('performLotteryDraw 相同种子应产生相同结果', function() {
      var candidates = ['GH202501', 'GH202502', 'GH202503', 'GH202504'];
      var result1 = publicLottery.performLotteryDraw(candidates, 'SEED-CONSISTENT');
      var result2 = publicLottery.performLotteryDraw(candidates, 'SEED-CONSISTENT');
      expect(result1).toEqual(result2);
    });

    test('performLotteryDraw 空输入应返回空数组', function() {
      var result = publicLottery.performLotteryDraw([], 'SEED');
      expect(result).toEqual([]);
      result = publicLottery.performLotteryDraw(null, 'SEED');
      expect(result).toEqual([]);
    });

    test('generateLotteryId 应生成正确格式的ID', function() {
      var id = publicLottery.generateLotteryId();
      expect(id).toMatch(/^PIL-\d{8}-\d{4}$/);
    });

    test('shortTxHash 应正确截取哈希', function() {
      var full = '0xabcdef1234567890abcdef1234567890abcdef12';
      var short = publicLottery.shortTxHash(full);
      expect(short).toContain('...');
      expect(short.startsWith('0x')).toBe(true);
    });
  });

  describe('系统初始化测试', function() {
    test('initializeLotterySystem 应初始化抽检系统', function() {
      var result = publicLottery.initializeLotterySystem();
      expect(result).toBe(true);

      var rounds = publicLottery.getAllLotteryRounds();
      expect(rounds.length).toBeGreaterThan(0);
    });

    test('initializeLotterySystem 第二次调用应返回 false', function() {
      publicLottery.initializeLotterySystem();
      var result = publicLottery.initializeLotterySystem();
      expect(result).toBe(false);
    });

    test('初始化后应有在售批次池', function() {
      publicLottery.initializeLotterySystem();
      var pool = publicLottery.getSalesBatchPool();
      expect(Array.isArray(pool)).toBe(true);
      expect(pool.length).toBeGreaterThan(0);
    });

    test('resetLotterySystem 应重置系统', function() {
      publicLottery.initializeLotterySystem();
      publicLottery.resetLotterySystem();
      var rounds = publicLottery.getAllLotteryRounds();
      expect(rounds.length).toBeGreaterThan(0);
    });
  });

  describe('持久化存储测试', function() {
    test('getAllLotteryRounds 应返回所有轮次', function() {
      publicLottery.initializeLotterySystem();
      var rounds = publicLottery.getAllLotteryRounds();
      expect(Array.isArray(rounds)).toBe(true);
      expect(rounds.length).toBeGreaterThan(0);
    });

    test('getLotteryRoundById 应返回指定轮次', function() {
      publicLottery.initializeLotterySystem();
      var rounds = publicLottery.getAllLotteryRounds();
      var firstRound = rounds[0];
      var found = publicLottery.getLotteryRoundById(firstRound.roundId);
      expect(found).not.toBeNull();
      expect(found.roundId).toBe(firstRound.roundId);
    });

    test('getLotteryRoundsForBatch 应返回匹配轮次', function() {
      publicLottery.initializeLotterySystem();
      var rounds = publicLottery.getAllLotteryRounds();
      var firstRound = rounds[0];
      var batchNo = firstRound.selectedBatchNos[0];
      var matched = publicLottery.getLotteryRoundsForBatch(batchNo);
      expect(matched.length).toBeGreaterThan(0);
      expect(matched[0].roundId).toBe(firstRound.roundId);
    });

    test('createNewLotteryRound 应创建新一轮并持久化', function() {
      publicLottery.initializeLotterySystem();
      var beforeRounds = publicLottery.getAllLotteryRounds();
      var beforeCount = beforeRounds.length;

      var result = publicLottery.createNewLotteryRound({
        drawSeed: 'SEED-TEST-NEW-ROUND'
      });

      expect(result.success).toBe(true);
      expect(result.round).toBeDefined();

      var afterRounds = publicLottery.getAllLotteryRounds();
      expect(afterRounds.length).toBe(beforeCount + 1);
    });

    test('新创建的轮次状态应为 drawing', function() {
      publicLottery.initializeLotterySystem();
      var result = publicLottery.createNewLotteryRound({ drawSeed: 'SEED-STATUS' });
      expect(result.round.status).toBe(publicLottery.LOTTERY_STATUS.DRAWING);
    });

    test('新创建的轮次应有区块链存证', function() {
      publicLottery.initializeLotterySystem();
      var result = publicLottery.createNewLotteryRound({ drawSeed: 'SEED-BC-TEST' });
      expect(result.round.blockchainEndorsement).not.toBeNull();
      expect(result.round.blockchainEndorsement.txHash).toBeDefined();
      expect(result.round.blockchainEndorsement.onChainData).toBeDefined();
    });
  });

  describe('状态推进测试', function() {
    test('advanceLotteryToSampled 应推进到取样状态', function() {
      publicLottery.initializeLotterySystem();
      var result = publicLottery.createNewLotteryRound({ drawSeed: 'SEED-SAMPLE' });
      var roundId = result.round.roundId;

      var advanceResult = publicLottery.advanceLotteryToSampled(roundId);
      expect(advanceResult.success).toBe(true);
      expect(advanceResult.round.status).toBe(publicLottery.LOTTERY_STATUS.SAMPLED);
    });

    test('advanceLotteryToInspecting 应推进到检测状态', function() {
      publicLottery.initializeLotterySystem();
      var result = publicLottery.createNewLotteryRound({ drawSeed: 'SEED-INSPECT' });
      var roundId = result.round.roundId;

      publicLottery.advanceLotteryToSampled(roundId);
      var advanceResult = publicLottery.advanceLotteryToInspecting(roundId);

      expect(advanceResult.success).toBe(true);
      expect(advanceResult.round.status).toBe(publicLottery.LOTTERY_STATUS.INSPECTING);
    });

    test('completeLotteryInspection 应完成检测', function() {
      publicLottery.initializeLotterySystem();
      var result = publicLottery.createNewLotteryRound({ drawSeed: 'SEED-COMPLETE' });
      var roundId = result.round.roundId;

      publicLottery.advanceLotteryToSampled(roundId);
      publicLottery.advanceLotteryToInspecting(roundId);
      var completeResult = publicLottery.completeLotteryInspection(roundId);

      expect(completeResult.success).toBe(true);
      expect(completeResult.round.status).toBe(publicLottery.LOTTERY_STATUS.REPORTED);
      expect(completeResult.round.inspectionResult).not.toBeNull();
      expect(completeResult.round.inspectionResult.overallConclusion).toBeDefined();
      expect(completeResult.round.inspectionResult.batchResults.length).toBeGreaterThan(0);
    });

    test('完成检测后应更新链上存证', function() {
      publicLottery.initializeLotterySystem();
      var result = publicLottery.createNewLotteryRound({ drawSeed: 'SEED-BC-UPDATE' });
      var roundId = result.round.roundId;

      publicLottery.advanceLotteryToSampled(roundId);
      publicLottery.advanceLotteryToInspecting(roundId);
      publicLottery.completeLotteryInspection(roundId);

      var proof = publicLottery.getOnChainProof(roundId);
      expect(proof).not.toBeNull();
      expect(proof.stage).toBe('reported');
      expect(proof.onChainData.length).toBeGreaterThan(6);
    });

    test('closeLotteryRound 应归档轮次', function() {
      publicLottery.initializeLotterySystem();
      var result = publicLottery.createNewLotteryRound({ drawSeed: 'SEED-CLOSE' });
      var roundId = result.round.roundId;

      publicLottery.advanceLotteryToSampled(roundId);
      publicLottery.advanceLotteryToInspecting(roundId);
      publicLottery.completeLotteryInspection(roundId);

      var closeResult = publicLottery.closeLotteryRound(roundId);
      expect(closeResult.success).toBe(true);

      var round = publicLottery.getLotteryRoundById(roundId);
      expect(round.status).toBe(publicLottery.LOTTERY_STATUS.CLOSED);
    });
  });

  describe('batchReportMap 批次报告映射测试', function() {
    test('完成检测后应写入 batchReportMap', function() {
      publicLottery.initializeLotterySystem();
      var result = publicLottery.createNewLotteryRound({ drawSeed: 'SEED-BATCH-MAP' });
      var roundId = result.round.roundId;

      publicLottery.advanceLotteryToSampled(roundId);
      publicLottery.advanceLotteryToInspecting(roundId);
      publicLottery.completeLotteryInspection(roundId);

      var selectedBatch = result.round.selectedBatchNos[0];
      var reports = publicLottery.getReportsForBatch(selectedBatch);

      expect(reports.length).toBeGreaterThan(0);

      var roundReport = reports.find(function(r) { return r.roundId === roundId; });
      expect(roundReport).toBeDefined();
      expect(roundReport.isPublicLottery).toBe(true);
      expect(roundReport.roundId).toBe(roundId);
      expect(roundReport.reportNo).toBeDefined();
    });

    test('getBatchReportMap 应返回完整映射', function() {
      publicLottery.initializeLotterySystem();
      var map = publicLottery.getBatchReportMap();
      expect(typeof map).toBe('object');
    });
  });

  describe('消费者见证测试', function() {
    test('registerWitness 应成功报名', function() {
      publicLottery.initializeLotterySystem();
      var result = publicLottery.createNewLotteryRound({ drawSeed: 'SEED-WITNESS' });
      var roundId = result.round.roundId;

      var regResult = publicLottery.registerWitness(roundId, '张三', '13800138000');
      expect(regResult.success).toBe(true);
      expect(regResult.registration).toBeDefined();
      expect(regResult.registration.name).toBe('张**');
    });

    test('同一手机号不能重复报名', function() {
      publicLottery.initializeLotterySystem();
      var result = publicLottery.createNewLotteryRound({ drawSeed: 'SEED-DUP-WITNESS' });
      var roundId = result.round.roundId;

      publicLottery.registerWitness(roundId, '张三', '13800138000');
      var regResult = publicLottery.registerWitness(roundId, '李四', '13800138000');

      expect(regResult.success).toBe(false);
      expect(regResult.message).toContain('已报名');
    });

    test('已结束轮次不能报名', function() {
      publicLottery.initializeLotterySystem();
      var rounds = publicLottery.getAllLotteryRounds();
      var reportedRound = null;
      for (var i = 0; i < rounds.length; i++) {
        if (rounds[i].status === publicLottery.LOTTERY_STATUS.REPORTED) {
          reportedRound = rounds[i];
          break;
        }
      }

      if (reportedRound) {
        var regResult = publicLottery.registerWitness(reportedRound.roundId, '王五', '13900139000');
        expect(regResult.success).toBe(false);
      }
    });
  });

  describe('区块链存证测试', function() {
    test('getOnChainProof 应返回正确的存证', function() {
      publicLottery.initializeLotterySystem();
      var rounds = publicLottery.getAllLotteryRounds();
      var firstRound = rounds[0];

      var proof = publicLottery.getOnChainProof(firstRound.roundId);
      expect(proof).not.toBeNull();
      expect(proof.roundId).toBe(firstRound.roundId);
      expect(proof.txHash).toBeDefined();
      expect(proof.chainName).toBeDefined();
      expect(Array.isArray(proof.onChainData)).toBe(true);
    });

    test('getAllOnChainProofs 应返回所有存证', function() {
      publicLottery.initializeLotterySystem();
      var proofs = publicLottery.getAllOnChainProofs();
      expect(typeof proofs).toBe('object');
      expect(Object.keys(proofs).length).toBeGreaterThan(0);
    });

    test('getOnChainProofsForBatch 应返回批次相关存证', function() {
      publicLottery.initializeLotterySystem();
      var rounds = publicLottery.getAllLotteryRounds();
      var firstRound = rounds[0];
      var batchNo = firstRound.selectedBatchNos[0];

      var proofs = publicLottery.getOnChainProofsForBatch(batchNo);
      expect(proofs.length).toBeGreaterThan(0);
    });

    test('链上数据应包含抽签种子', function() {
      publicLottery.initializeLotterySystem();
      var rounds = publicLottery.getAllLotteryRounds();
      var firstRound = rounds[0];

      var proof = publicLottery.getOnChainProof(firstRound.roundId);
      var hasDrawSeed = proof.onChainData.some(function(d) { return d.key === 'drawSeed'; });
      var hasDrawHash = proof.onChainData.some(function(d) { return d.key === 'drawHash'; });
      var hasSelectedBatches = proof.onChainData.some(function(d) { return d.key === 'selectedBatchNos'; });

      expect(hasDrawSeed).toBe(true);
      expect(hasDrawHash).toBe(true);
      expect(hasSelectedBatches).toBe(true);
    });
  });

  describe('historyReports 写入测试', function() {
    test('enrichHistoryReportsWithLottery 应返回增强报告', function() {
      publicLottery.initializeLotterySystem();

      var rounds = publicLottery.getAllLotteryRounds();
      var reportedRound = null;
      for (var i = 0; i < rounds.length; i++) {
        if (rounds[i].status === publicLottery.LOTTERY_STATUS.REPORTED &&
            rounds[i].selectedBatchNos && rounds[i].selectedBatchNos.length > 0) {
          reportedRound = rounds[i];
          break;
        }
      }
      expect(reportedRound).not.toBeNull();

      var selectedBatch = reportedRound.selectedBatchNos[0];
      var traceId = selectedBatch === 'GH202503' ? 'G001' : 'G002';

      var enriched = publicLottery.enrichHistoryReportsWithLottery(traceId);
      expect(Array.isArray(enriched)).toBe(true);
      expect(enriched.length).toBeGreaterThan(0);

      var lotteryReports = enriched.filter(function(r) { return r.isPublicLottery; });
      expect(lotteryReports.length).toBeGreaterThan(0);
    });

    test('增强报告应包含抽检信息', function() {
      publicLottery.initializeLotterySystem();

      var rounds = publicLottery.getAllLotteryRounds();
      var reportedRound = null;
      for (var i = 0; i < rounds.length; i++) {
        if (rounds[i].status === publicLottery.LOTTERY_STATUS.REPORTED &&
            rounds[i].selectedBatchNos && rounds[i].selectedBatchNos.length > 0) {
          reportedRound = rounds[i];
          break;
        }
      }

      if (reportedRound) {
        var selectedBatch = reportedRound.selectedBatchNos[0];
        var traceId = selectedBatch === 'GH202503' ? 'G001' : 'G002';

        var enriched = publicLottery.enrichHistoryReportsWithLottery(traceId);
        var lotteryReports = enriched.filter(function(r) { return r.isPublicLottery; });

        expect(lotteryReports.length).toBeGreaterThan(0);
        if (lotteryReports.length > 0) {
          var report = lotteryReports[0];
          expect(report.lotteryRoundId).toBeDefined();
          expect(report.lotteryRoundName).toBeDefined();
          expect(report.witnessCount).toBeDefined();
          expect(report.blockchainTxHash).toBeDefined();
        }
      }
    });
  });

  describe('区块链交叉背书测试', function() {
    test('getBlockchainCrossEndorsement 应返回交叉背书', function() {
      publicLottery.initializeLotterySystem();
      var endorsement = publicLottery.getBlockchainCrossEndorsement('G001');
      expect(endorsement).not.toBeNull();
      expect(endorsement.sourceChainTxHash).toBeDefined();
      expect(endorsement.sourceChainName).toBeDefined();
      expect(endorsement.lotteryEndorsements).toBeDefined();
      expect(endorsement.crossVerified).toBe(true);
      expect(endorsement.sharedDataSource).toBe(true);
    });

    test('交叉背书叙事应包含关键信息', function() {
      publicLottery.initializeLotterySystem();
      var endorsement = publicLottery.getBlockchainCrossEndorsement('G001');
      expect(endorsement.narrative).toContain('公开抽检');
      expect(endorsement.narrative).toContain('互相背书');
      expect(endorsement.narrative).toContain('共享统一链上数据源');
    });

    test('背书列表应包含链上信息', function() {
      publicLottery.initializeLotterySystem();
      var endorsement = publicLottery.getBlockchainCrossEndorsement('G001');
      expect(endorsement.lotteryEndorsements.length).toBeGreaterThan(0);
      var first = endorsement.lotteryEndorsements[0];
      expect(first.roundId).toBeDefined();
      expect(first.roundName).toBeDefined();
      expect(first.txHash).toBeDefined();
      expect(first.chainName).toBeDefined();
      expect(first.blockExplorerUrl).toBeDefined();
      expect(first.onChainData).toBeDefined();
    });
  });

  describe('在售批次池测试', function() {
    test('getSalesBatchPool 应返回批次列表', function() {
      var pool = publicLottery.getSalesBatchPool();
      expect(Array.isArray(pool)).toBe(true);
      expect(pool.length).toBeGreaterThan(0);
    });

    test('批次池中的批次应能在 mockData 中找到', function() {
      var pool = publicLottery.getSalesBatchPool();
      expect(pool.length).toBeGreaterThan(0);
      var firstBatch = pool[0];
      expect(typeof firstBatch).toBe('string');
      expect(firstBatch.length).toBeGreaterThan(0);
    });
  });

  describe('数据完整性测试', function() {
    test('每个轮次应包含必要字段', function() {
      publicLottery.initializeLotterySystem();
      var rounds = publicLottery.getAllLotteryRounds();
      for (var i = 0; i < rounds.length; i++) {
        var round = rounds[i];
        expect(round.roundId).toBeDefined();
        expect(round.roundName).toBeDefined();
        expect(round.status).toBeDefined();
        expect(round.scheduleDate).toBeDefined();
        expect(round.drawDate).toBeDefined();
        expect(round.drawSeed).toBeDefined();
        expect(round.drawHash).toBeDefined();
        expect(round.candidateBatchNos).toBeDefined();
        expect(round.selectedBatchNos).toBeDefined();
        expect(round.inspectionTypes).toBeDefined();
        expect(round.institution).toBeDefined();
        expect(round.blockchainEndorsement).toBeDefined();
        expect(round.brandNarrative).toBeDefined();
      }
    });

    test('中签批次应是候选批次的子集', function() {
      publicLottery.initializeLotterySystem();
      var rounds = publicLottery.getAllLotteryRounds();
      for (var i = 0; i < rounds.length; i++) {
        var round = rounds[i];
        for (var j = 0; j < round.selectedBatchNos.length; j++) {
          expect(round.candidateBatchNos.indexOf(round.selectedBatchNos[j])).toBeGreaterThan(-1);
        }
      }
    });

    test('已出报告的轮次应有检测结果', function() {
      publicLottery.initializeLotterySystem();
      var rounds = publicLottery.getAllLotteryRounds();
      for (var i = 0; i < rounds.length; i++) {
        if (rounds[i].status === publicLottery.LOTTERY_STATUS.REPORTED || rounds[i].status === publicLottery.LOTTERY_STATUS.CLOSED) {
          expect(rounds[i].inspectionResult).not.toBeNull();
          expect(rounds[i].inspectionResult.overallConclusion).toBeDefined();
          expect(rounds[i].inspectionResult.batchResults).toBeDefined();
        }
      }
    });

    test('每个轮次应有区块链存证信息', function() {
      publicLottery.initializeLotterySystem();
      var rounds = publicLottery.getAllLotteryRounds();
      for (var i = 0; i < rounds.length; i++) {
        expect(rounds[i].blockchainEndorsement).not.toBeNull();
        expect(rounds[i].blockchainEndorsement.txHash).toBeDefined();
        expect(rounds[i].blockchainEndorsement.chainName).toBeDefined();
      }
    });
  });
});
