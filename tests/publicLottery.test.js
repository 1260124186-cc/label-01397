var publicLottery = require('../utils/publicLottery.js');
var mockData = require('../utils/mockData.js');

describe('公开抽检与透明 Lottery 模块测试', function() {

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
  });

  describe('抽检数据查询测试', function() {
    test('getAllLotteryRounds 应返回所有抽检轮次', function() {
      var rounds = publicLottery.getAllLotteryRounds();
      expect(Array.isArray(rounds)).toBe(true);
      expect(rounds.length).toBeGreaterThan(0);
    });

    test('G001 批次应能查到公开抽检数据', function() {
      var lotteryData = publicLottery.getPublicLotteryData('G001');
      expect(lotteryData).not.toBeNull();
      expect(lotteryData.batchNo).toBe('GH202503');
      expect(lotteryData.roundId).toBeDefined();
      expect(lotteryData.roundName).toBeDefined();
      expect(lotteryData.status).toBeDefined();
      expect(lotteryData.institution).toBeDefined();
    });

    test('getPublicLotteryByBatchNo 应返回匹配的抽检详情', function() {
      var detail = publicLottery.getPublicLotteryByBatchNo('GH202503');
      expect(detail).not.toBeNull();
      expect(detail.isThisBatchSelected).toBe(true);
    });

    test('G001 应被第1轮抽检抽中', function() {
      var lotteryData = publicLottery.getPublicLotteryData('G001');
      expect(lotteryData).not.toBeNull();
      expect(lotteryData.isThisBatchSelected).toBe(true);
    });

    test('G002 应被第2轮抽检抽中', function() {
      var lotteryData = publicLottery.getPublicLotteryData('G002');
      expect(lotteryData).not.toBeNull();
      expect(lotteryData.isThisBatchSelected).toBe(true);
    });

    test('getLotteryRoundsForBatch 应返回正确轮次', function() {
      var rounds = publicLottery.getLotteryRoundsForBatch('GH202503');
      expect(rounds.length).toBeGreaterThan(0);
    });
  });

  describe('抽检结果写入 historyReports 测试', function() {
    test('mergeLotteryResultToHistoryReports 应正确转换数据格式', function() {
      var rounds = publicLottery.getAllLotteryRounds();
      var reportedRound = null;
      for (var i = 0; i < rounds.length; i++) {
        if (rounds[i].status === publicLottery.LOTTERY_STATUS.REPORTED) {
          reportedRound = rounds[i];
          break;
        }
      }
      expect(reportedRound).not.toBeNull();

      var historyReport = publicLottery.mergeLotteryResultToHistoryReports(reportedRound, 'GH202503');
      expect(historyReport).not.toBeNull();
      expect(historyReport.reportNo).toBeDefined();
      expect(historyReport.testDate).toBeDefined();
      expect(historyReport.institution).toBeDefined();
      expect(historyReport.status).toBeDefined();
      expect(historyReport.batchNo).toBe('GH202503');
      expect(historyReport.isPublicLottery).toBe(true);
      expect(historyReport.lotteryRoundId).toBeDefined();
      expect(historyReport.witnessCount).toBeGreaterThan(0);
      expect(historyReport.blockchainTxHash).toBeDefined();
    });

    test('enrichHistoryReportsWithLottery 应返回增强的历史报告', function() {
      var enriched = publicLottery.enrichHistoryReportsWithLottery('G001');
      expect(Array.isArray(enriched)).toBe(true);
      expect(enriched.length).toBeGreaterThan(0);

      var lotteryReports = enriched.filter(function(r) { return r.isPublicLottery; });
      expect(lotteryReports.length).toBeGreaterThan(0);
    });
  });

  describe('区块链互相背书测试', function() {
    test('getBlockchainCrossEndorsement 应返回交叉背书信息', function() {
      var endorsement = publicLottery.getBlockchainCrossEndorsement('G001');
      expect(endorsement).not.toBeNull();
      expect(endorsement.sourceChainTxHash).toBeDefined();
      expect(endorsement.sourceChainName).toBeDefined();
      expect(endorsement.lotteryEndorsements).toBeDefined();
      expect(endorsement.crossVerified).toBe(true);
      expect(endorsement.narrative).toBeDefined();
    });

    test('交叉背书叙事应包含关键信息', function() {
      var endorsement = publicLottery.getBlockchainCrossEndorsement('G001');
      expect(endorsement.narrative).toContain('公开抽检');
      expect(endorsement.narrative).toContain('互相背书');
    });

    test('背书列表应包含链上信息', function() {
      var endorsement = publicLottery.getBlockchainCrossEndorsement('G001');
      expect(endorsement.lotteryEndorsements.length).toBeGreaterThan(0);
      var first = endorsement.lotteryEndorsements[0];
      expect(first.roundId).toBeDefined();
      expect(first.roundName).toBeDefined();
      expect(first.txHash).toBeDefined();
      expect(first.chainName).toBeDefined();
      expect(first.blockExplorerUrl).toBeDefined();
    });
  });

  describe('mockData 集成测试', function() {
    test('mockData.getPublicLotteryInfo 应返回抽检信息', function() {
      var info = mockData.getPublicLotteryInfo('G001');
      expect(info).not.toBeNull();
      expect(info.roundId).toBeDefined();
    });

    test('mockData.getEnrichedHistoryReports 应返回增强报告', function() {
      var reports = mockData.getEnrichedHistoryReports('G001');
      expect(Array.isArray(reports)).toBe(true);
      expect(reports.length).toBeGreaterThan(0);
    });
  });

  describe('抽检轮次数据完整性测试', function() {
    test('每个轮次应包含必要字段', function() {
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
        expect(round.consumerWitnesses).toBeDefined();
        expect(round.maxWitnesses).toBeGreaterThan(0);
      }
    });

    test('中签批次应是候选批次的子集', function() {
      var rounds = publicLottery.getAllLotteryRounds();
      for (var i = 0; i < rounds.length; i++) {
        var round = rounds[i];
        for (var j = 0; j < round.selectedBatchNos.length; j++) {
          expect(round.candidateBatchNos.indexOf(round.selectedBatchNos[j])).toBeGreaterThan(-1);
        }
      }
    });

    test('已出报告的轮次应有检测结果', function() {
      var rounds = publicLottery.getAllLotteryRounds();
      for (var i = 0; i < rounds.length; i++) {
        if (rounds[i].status === publicLottery.LOTTERY_STATUS.REPORTED) {
          expect(rounds[i].inspectionResult).not.toBeNull();
          expect(rounds[i].inspectionResult.overallConclusion).toBeDefined();
          expect(rounds[i].inspectionResult.batchResults).toBeDefined();
          expect(rounds[i].inspectionResult.batchResults.length).toBeGreaterThan(0);
        }
      }
    });

    test('每个轮次应有区块链存证信息', function() {
      var rounds = publicLottery.getAllLotteryRounds();
      for (var i = 0; i < rounds.length; i++) {
        var round = rounds[i];
        expect(round.blockchainEndorsement).not.toBeNull();
        expect(round.blockchainEndorsement.txHash).toBeDefined();
        expect(round.blockchainEndorsement.chainName).toBeDefined();
        expect(round.blockchainEndorsement.onChainData).toBeDefined();
        expect(round.blockchainEndorsement.onChainData.length).toBeGreaterThan(0);
      }
    });

    test('每个轮次应有品牌叙事', function() {
      var rounds = publicLottery.getAllLotteryRounds();
      for (var i = 0; i < rounds.length; i++) {
        expect(rounds[i].brandNarrative).toBeDefined();
        expect(rounds[i].brandNarrative.length).toBeGreaterThan(0);
      }
    });
  });
});
