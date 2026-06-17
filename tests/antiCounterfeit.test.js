/**
 * antiCounterfeit.js 防伪验真模块单元测试
 */

global.wx = {
  getStorageSync: jest.fn(),
  setStorageSync: jest.fn(),
  getFuzzyLocation: jest.fn((options) => {
    if (options && options.success) {
      options.success({
        latitude: 30.5928,
        longitude: 114.3055
      });
    }
  }),
  showLoading: jest.fn(),
  hideLoading: jest.fn(),
  showToast: jest.fn(),
  showModal: jest.fn(),
  navigateBack: jest.fn()
};

const mockData = require('../utils/mockData.js');
jest.mock('../utils/mockData.js', () => ({
  getTraceData: jest.fn()
}));

const antiCounterfeit = require('../utils/antiCounterfeit.js');

describe('antiCounterfeit.js 防伪验真模块测试', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    wx.getStorageSync.mockReturnValue([]);
  });

  describe('城市脱敏函数 getCityFromLocation 测试', () => {
    test('空值应该返回"未知地区"', () => {
      expect(antiCounterfeit.getCityFromLocation('')).toBe('未知地区');
      expect(antiCounterfeit.getCityFromLocation(null)).toBe('未知地区');
      expect(antiCounterfeit.getCityFromLocation(undefined)).toBe('未知地区');
    });

    test('长度小于等于2的城市名保持不变', () => {
      expect(antiCounterfeit.getCityFromLocation('北京')).toBe('北京');
      expect(antiCounterfeit.getCityFromLocation('上海')).toBe('上海');
    });

    test('长度大于2的城市名应该脱敏', () => {
      expect(antiCounterfeit.getCityFromLocation('武汉市')).toBe('武汉*');
      expect(antiCounterfeit.getCityFromLocation('北京市')).toBe('北京*');
      expect(antiCounterfeit.getCityFromLocation('湖北咸宁')).toBe('湖北*');
    });
  });

  describe('IP脱敏函数 maskIp 测试', () => {
    test('空值应该返回默认脱敏IP', () => {
      expect(antiCounterfeit.maskIp('')).toBe('*.**.**.**');
      expect(antiCounterfeit.maskIp(null)).toBe('*.**.**.**');
    });

    test('非标准格式IP保持不变', () => {
      expect(antiCounterfeit.maskIp('invalid-ip')).toBe('invalid-ip');
    });

    test('标准IPv4地址应该脱敏后三位', () => {
      expect(antiCounterfeit.maskIp('192.168.1.1')).toBe('192.*.*.*');
      expect(antiCounterfeit.maskIp('119.96.123.45')).toBe('119.*.*.*');
      expect(antiCounterfeit.maskIp('10.0.0.1')).toBe('10.*.*.*');
    });
  });

  describe('时间格式化函数 formatDateTime 测试', () => {
    test('空值应该返回空字符串', () => {
      expect(antiCounterfeit.formatDateTime(null)).toBe('');
      expect(antiCounterfeit.formatDateTime(undefined)).toBe('');
      expect(antiCounterfeit.formatDateTime(0)).toBe('');
    });

    test('应该正确格式化时间戳', () => {
      const timestamp = new Date('2025-06-17T10:30:45').getTime();
      const result = antiCounterfeit.formatDateTime(timestamp);
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
      expect(result).toContain('2025');
      expect(result).toContain('06');
      expect(result).toContain('17');
    });
  });

  describe('举报类型 getReportTypes 测试', () => {
    test('应该返回举报类型列表', () => {
      const types = antiCounterfeit.getReportTypes();
      expect(Array.isArray(types)).toBe(true);
      expect(types.length).toBeGreaterThan(0);
      
      types.forEach(type => {
        expect(type).toHaveProperty('key');
        expect(type).toHaveProperty('label');
        expect(type).toHaveProperty('icon');
      });
    });

    test('应该包含常见举报类型', () => {
      const types = antiCounterfeit.getReportTypes();
      const keys = types.map(t => t.key);
      expect(keys).toContain('counterfeit');
      expect(keys).toContain('quality');
      expect(keys).toContain('other');
    });
  });

  describe('举报提交 submitReport 测试', () => {
    test('缺少 traceId 应该返回失败', () => {
      const result = antiCounterfeit.submitReport({});
      expect(result.success).toBe(false);
      expect(result.code).toBe('MISSING_PARAMS');
    });

    test('有效举报数据应该提交成功', () => {
      const reportData = {
        traceId: 'G001',
        productName: '金桂花茶',
        reportType: 'counterfeit',
        reportTypeLabel: '疑似仿冒产品',
        description: '包装印刷模糊，怀疑是仿冒品',
        contact: '13800138000',
        photos: []
      };

      const result = antiCounterfeit.submitReport(reportData);
      expect(result.success).toBe(true);
      expect(result.message).toBeDefined();
      expect(result.reportId).toBeDefined();
      expect(result.reportData).toBeDefined();
      expect(result.reportData.status).toBe('pending');
      expect(result.reportData.traceId).toBe('G001');
      expect(wx.setStorageSync).toHaveBeenCalled();
    });
  });

  describe('异常行为检测 detectAbnormalBehavior 测试', () => {
    test('无扫码记录时应该返回正常状态', () => {
      wx.getStorageSync.mockReturnValue([]);
      const result = antiCounterfeit.detectAbnormalBehavior('G001', { city: '武汉' });
      expect(result.isAbnormal).toBe(false);
      expect(result.alerts).toEqual([]);
      expect(result.riskLevel).toBe('normal');
    });

    test('24小时内扫码超过阈值应该触发频繁扫码告警', () => {
      const now = Date.now();
      const records = [
        { traceId: 'G001', timestamp: now - 1000, location: { city: '武汉' } },
        { traceId: 'G001', timestamp: now - 2000, location: { city: '武汉' } },
        { traceId: 'G001', timestamp: now - 3000, location: { city: '武汉' } }
      ];
      wx.getStorageSync.mockReturnValue(records);
      
      const result = antiCounterfeit.detectAbnormalBehavior('G001', { city: '武汉' });
      expect(result.isAbnormal).toBe(true);
      expect(result.riskLevel).toBe('warning');
      
      const hasFrequentAlert = result.alerts.some(a => a.type === 'frequent_scan');
      expect(hasFrequentAlert).toBe(true);
    });

    test('多个不同城市扫码应该触发异地告警', () => {
      const now = Date.now();
      const records = [
        { traceId: 'G001', timestamp: now - 1000, location: { city: '武汉' } },
        { traceId: 'G001', timestamp: now - 2000, location: { city: '北京' } }
      ];
      wx.getStorageSync.mockReturnValue(records);
      
      const result = antiCounterfeit.detectAbnormalBehavior('G001', { city: '上海' });
      expect(result.isAbnormal).toBe(true);
      
      const hasCrossRegionAlert = result.alerts.some(a => a.type === 'cross_region');
      expect(hasCrossRegionAlert).toBe(true);
      expect(result.riskLevel).toBe('danger');
    });
  });

  describe('扫码记录统计 getProductScanStats 测试', () => {
    test('无记录时应该返回 null', () => {
      wx.getStorageSync.mockReturnValue([]);
      const result = antiCounterfeit.getProductScanStats('G001');
      expect(result).toBeNull();
    });

    test('有记录时应该返回正确的统计数据', () => {
      const now = Date.now();
      const records = [
        { traceId: 'G001', timestamp: now - 5000, location: { city: '武汉' }, type: 'first', ip: '192.168.1.1' },
        { traceId: 'G001', timestamp: now - 3000, location: { city: '北京' }, type: 'repeat', ip: '10.0.0.1' },
        { traceId: 'G001', timestamp: now - 1000, location: { city: '上海' }, type: 'repeat', ip: '172.16.0.1' }
      ];
      wx.getStorageSync.mockReturnValue(records);
      
      const result = antiCounterfeit.getProductScanStats('G001');
      expect(result).not.toBeNull();
      expect(result.totalQueryCount).toBe(3);
      expect(result.firstScanTime).toBeDefined();
      expect(result.lastScanTime).toBeDefined();
      expect(result.queryLocations.length).toBeGreaterThan(0);
      expect(result.recentRecords.length).toBe(3);
    });
  });

  describe('清空扫码记录 clearAllScanRecords 测试', () => {
    test('应该清空所有扫码记录', () => {
      const result = antiCounterfeit.clearAllScanRecords();
      expect(result).toBe(true);
      expect(wx.setStorageSync).toHaveBeenCalledWith(
        expect.any(String),
        []
      );
    });
  });

  describe('常量导出测试', () => {
    test('应该导出正确的常量值', () => {
      expect(antiCounterfeit.ABNORMAL_TIME_WINDOW).toBe(24 * 60 * 60 * 1000);
      expect(antiCounterfeit.ABNORMAL_SCAN_THRESHOLD).toBe(3);
      expect(antiCounterfeit.ABNORMAL_LOCATION_COUNT).toBe(2);
    });
  });
});
