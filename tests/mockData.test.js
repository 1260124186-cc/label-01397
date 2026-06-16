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
  });
});
