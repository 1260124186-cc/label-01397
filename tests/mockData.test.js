/**
 * mockData 模块单元测试
 * 测试功能：
 * 1. getTraceData - 根据溯源ID获取溯源数据
 * 2. validateTraceId - 验证溯源ID格式
 * 3. getAvailableTraceIds - 获取所有可用的测试溯源ID
 */

const mockData = require('../utils/mockData.js');

describe('mockData 模块测试', () => {
  describe('getTraceData 函数测试', () => {
    test('应该能获取到 G001 的溯源数据', () => {
      const data = mockData.getTraceData('G001');
      expect(data).not.toBeNull();
      expect(data.basicInfo.traceId).toBe('G001');
      expect(data.basicInfo.productName).toBe('金桂花茶');
    });

    test('应该能获取到 G002 的溯源数据', () => {
      const data = mockData.getTraceData('G002');
      expect(data).not.toBeNull();
      expect(data.basicInfo.traceId).toBe('G002');
      expect(data.basicInfo.productName).toBe('银桂花茶');
    });

    test('应该支持小写溯源ID', () => {
      const data = mockData.getTraceData('g001');
      expect(data).not.toBeNull();
      expect(data.basicInfo.traceId).toBe('G001');
    });

    test('应该支持带空格的溯源ID', () => {
      const data = mockData.getTraceData(' G001 ');
      expect(data).not.toBeNull();
      expect(data.basicInfo.traceId).toBe('G001');
    });

    test('对于不存在的溯源ID应该返回 null', () => {
      const data = mockData.getTraceData('G999');
      expect(data).toBeNull();
    });

    test('对于空字符串应该返回 null', () => {
      const data = mockData.getTraceData('');
      expect(data).toBeNull();
    });
  });

  describe('validateTraceId 函数测试', () => {
    test('有效的溯源ID应该返回 true', () => {
      expect(mockData.validateTraceId('G001')).toBe(true);
      expect(mockData.validateTraceId('G002')).toBe(true);
      expect(mockData.validateTraceId('A1234')).toBe(true);
      expect(mockData.validateTraceId('Test123')).toBe(true);
    });

    test('无效的溯源ID应该返回 false', () => {
      expect(mockData.validateTraceId('')).toBe(false);
      expect(mockData.validateTraceId(null)).toBe(false);
      expect(mockData.validateTraceId(undefined)).toBe(false);
      expect(mockData.validateTraceId(123)).toBe(false);
      expect(mockData.validateTraceId('123')).toBe(false);
      expect(mockData.validateTraceId('A1')).toBe(false);
      expect(mockData.validateTraceId('A12')).toBe(false);
    });

    test('带空格的有效溯源ID应该返回 true', () => {
      expect(mockData.validateTraceId(' G001 ')).toBe(true);
    });

    test('溯源ID长度边界测试', () => {
      expect(mockData.validateTraceId('A123')).toBe(true);
      expect(mockData.validateTraceId('A1234567890123456789')).toBe(true);
      expect(mockData.validateTraceId('A12345678901234567890')).toBe(false);
    });
  });

  describe('getAvailableTraceIds 函数测试', () => {
    test('应该返回所有可用的溯源ID', () => {
      const ids = mockData.getAvailableTraceIds();
      expect(Array.isArray(ids)).toBe(true);
      expect(ids.length).toBeGreaterThan(0);
      expect(ids).toContain('G001');
      expect(ids).toContain('G002');
    });
  });

  describe('mockTraceData 数据结构测试', () => {
    test('G001 数据结构应该完整', () => {
      const data = mockData.mockTraceData['G001'];
      expect(data).toHaveProperty('basicInfo');
      expect(data).toHaveProperty('treeAge');
      expect(data).toHaveProperty('osmanthusInfo');
      expect(data).toHaveProperty('scentingProcess');
      expect(data).toHaveProperty('greenTrace');
      expect(data).toHaveProperty('pesticideTest');
      expect(data).toHaveProperty('brewingGuide');
      expect(data).toHaveProperty('blockchainInfo');
    });

    test('G002 数据结构应该完整', () => {
      const data = mockData.mockTraceData['G002'];
      expect(data).toHaveProperty('basicInfo');
      expect(data).toHaveProperty('treeAge');
      expect(data).toHaveProperty('osmanthusInfo');
      expect(data).toHaveProperty('scentingProcess');
      expect(data).toHaveProperty('greenTrace');
      expect(data).toHaveProperty('pesticideTest');
      expect(data).toHaveProperty('brewingGuide');
      expect(data).toHaveProperty('blockchainInfo');
    });

    test('G001 树龄信息应该正确', () => {
      const data = mockData.mockTraceData['G001'];
      expect(data.treeAge.teaTreeAge).toBe(200);
      expect(data.treeAge.osmanthusTreeAge).toBe(50);
    });

    test('G002 树龄信息应该正确', () => {
      const data = mockData.mockTraceData['G002'];
      expect(data.treeAge.teaTreeAge).toBe(120);
      expect(data.treeAge.osmanthusTreeAge).toBe(20);
    });

    test('窨制工艺数据应该完整', () => {
      const data = mockData.mockTraceData['G001'];
      expect(data.scentingProcess.scentingTimes).toBe(5);
      expect(data.scentingProcess.processSteps.length).toBe(6);
    });

    test('绿色溯源数据应该完整', () => {
      const data = mockData.mockTraceData['G001'];
      expect(data.greenTrace).toHaveProperty('ecoPlanting');
      expect(data.greenTrace).toHaveProperty('ecoPacking');
      expect(data.greenTrace).toHaveProperty('ecoLogistics');
    });

    test('农残检测数据应该完整', () => {
      const data = mockData.mockTraceData['G001'];
      expect(data.pesticideTest.teaTests.length).toBeGreaterThan(0);
      expect(data.pesticideTest.osmanthusTests.length).toBeGreaterThan(0);
    });

    test('基础信息应该包含所有必要字段', () => {
      const data = mockData.mockTraceData['G001'];
      expect(data.basicInfo.traceId).toBeDefined();
      expect(data.basicInfo.batchNo).toBeDefined();
      expect(data.basicInfo.pickTime).toBeDefined();
      expect(data.basicInfo.productionTime).toBeDefined();
      expect(data.basicInfo.productName).toBeDefined();
      expect(data.basicInfo.specification).toBeDefined();
    });

    test('桂花信息应该包含所有必要字段', () => {
      const data = mockData.mockTraceData['G001'];
      expect(data.osmanthusInfo.variety).toBeDefined();
      expect(data.osmanthusInfo.origin).toBeDefined();
      expect(data.osmanthusInfo.pickTime).toBeDefined();
      expect(data.osmanthusInfo.color).toBeDefined();
      expect(data.osmanthusInfo.fragrance).toBeDefined();
    });

    test('窨制工艺应该包含所有必要字段', () => {
      const data = mockData.mockTraceData['G001'];
      expect(data.scentingProcess.scentingTimes).toBeDefined();
      expect(typeof data.scentingProcess.scentingTimes).toBe('number');
      expect(data.scentingProcess.scentingDuration).toBeDefined();
      expect(data.scentingProcess.temperature).toBeDefined();
      expect(data.scentingProcess.humidity).toBeDefined();
      expect(data.scentingProcess.ratio).toBeDefined();
      expect(data.scentingProcess.workshopCleanliness).toBeDefined();
      expect(Array.isArray(data.scentingProcess.processSteps)).toBe(true);
      expect(data.scentingProcess.processSteps.length).toBe(6);
    });

    test('窨制工艺步骤应该包含所有必要字段', () => {
      const data = mockData.mockTraceData['G001'];
      const steps = data.scentingProcess.processSteps;
      steps.forEach((step, index) => {
        expect(step.step).toBe(index + 1);
        expect(step.name).toBeDefined();
        expect(step.icon).toBeDefined();
        expect(step.desc).toBeDefined();
      });
    });

    test('绿色溯源 - 生态种植数据应该完整', () => {
      const data = mockData.mockTraceData['G001'];
      const ecoPlanting = data.greenTrace.ecoPlanting;
      expect(ecoPlanting.title).toBe('生态种植');
      expect(ecoPlanting.icon).toBeDefined();
      expect(Array.isArray(ecoPlanting.records)).toBe(true);
      expect(ecoPlanting.records.length).toBeGreaterThan(0);
      expect(ecoPlanting.certification).toBeDefined();
    });

    test('绿色溯源 - 环保包装数据应该完整', () => {
      const data = mockData.mockTraceData['G001'];
      const ecoPacking = data.greenTrace.ecoPacking;
      expect(ecoPacking.title).toBe('环保包装');
      expect(ecoPacking.icon).toBeDefined();
      expect(Array.isArray(ecoPacking.records)).toBe(true);
      expect(ecoPacking.records.length).toBeGreaterThan(0);
      expect(ecoPacking.certification).toBeDefined();
    });

    test('绿色溯源 - 绿色物流数据应该完整', () => {
      const data = mockData.mockTraceData['G001'];
      const ecoLogistics = data.greenTrace.ecoLogistics;
      expect(ecoLogistics.title).toBe('绿色物流');
      expect(ecoLogistics.icon).toBeDefined();
      expect(Array.isArray(ecoLogistics.records)).toBe(true);
      expect(ecoLogistics.records.length).toBeGreaterThan(0);
      expect(ecoLogistics.carbonReduction).toBeDefined();
    });

    test('农残检测数据应该包含所有必要字段', () => {
      const data = mockData.mockTraceData['G001'];
      const pesticideTest = data.pesticideTest;
      expect(pesticideTest.institution).toBeDefined();
      expect(pesticideTest.testDate).toBeDefined();
      expect(pesticideTest.reportNo).toBeDefined();
      expect(pesticideTest.standard).toBeDefined();
      expect(pesticideTest.comparisonTip).toBeDefined();
    });

    test('农残检测项应该包含所有必要字段', () => {
      const data = mockData.mockTraceData['G001'];
      const teaTests = data.pesticideTest.teaTests;
      teaTests.forEach(test => {
        expect(test.item).toBeDefined();
        expect(test.value).toBeDefined();
        expect(test.unit).toBeDefined();
        expect(test.limit).toBeDefined();
        expect(test.status).toBe('合格');
      });

      const osmanthusTests = data.pesticideTest.osmanthusTests;
      osmanthusTests.forEach(test => {
        expect(test.item).toBeDefined();
        expect(test.value).toBeDefined();
        expect(test.unit).toBeDefined();
        expect(test.limit).toBeDefined();
        expect(test.status).toBe('合格');
      });
    });

    test('冲泡建议数据应该完整', () => {
      const data = mockData.mockTraceData['G001'];
      const brewingGuide = data.brewingGuide;
      expect(brewingGuide.waterTemp).toBeDefined();
      expect(brewingGuide.brewingTime).toBeDefined();
      expect(brewingGuide.rebrewTimes).toBeDefined();
      expect(brewingGuide.waterType).toBeDefined();
      expect(brewingGuide.teawareType).toBeDefined();
      expect(Array.isArray(brewingGuide.tips)).toBe(true);
      expect(brewingGuide.tips.length).toBeGreaterThan(0);
    });

    test('区块链存证信息应该完整', () => {
      const data = mockData.mockTraceData['G001'];
      const blockchainInfo = data.blockchainInfo;
      expect(blockchainInfo.chainName).toBeDefined();
      expect(blockchainInfo.blockHeight).toBeDefined();
      expect(blockchainInfo.txHash).toBeDefined();
      expect(blockchainInfo.timestamp).toBeDefined();
      expect(blockchainInfo.verifyStatus).toBe('已验证');
    });

    test('G001 和 G002 应该有不同的产品信息', () => {
      const g001 = mockData.mockTraceData['G001'];
      const g002 = mockData.mockTraceData['G002'];
      expect(g001.basicInfo.productName).not.toBe(g002.basicInfo.productName);
      expect(g001.treeAge.teaTreeAge).not.toBe(g002.treeAge.teaTreeAge);
      expect(g001.osmanthusInfo.variety).not.toBe(g002.osmanthusInfo.variety);
      expect(g001.scentingProcess.scentingTimes).not.toBe(g002.scentingProcess.scentingTimes);
    });
  });
});
