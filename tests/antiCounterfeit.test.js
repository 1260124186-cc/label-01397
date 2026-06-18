/**
 * antiCounterfeit.js 防伪验真模块单元测试
 */

global.wx = {
  getStorageSync: jest.fn(),
  setStorageSync: jest.fn(),
  removeStorageSync: jest.fn(),
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
const actualMockData = jest.requireActual('../utils/mockData.js');
jest.mock('../utils/mockData.js', () => {
  const actual = jest.requireActual('../utils/mockData.js');
  return {
    ...actual,
    getTraceData: jest.fn()
  };
});

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

  describe('双码验真核心逻辑测试', () => {
    describe('scanOuterCode 函数测试', () => {
      test('有效的外码应该扫描成功并返回产品概要', async () => {
        const result = await antiCounterfeit.scanOuterCode('OUT-G001');
        expect(result.success).toBe(true);
        expect(result.scanType).toBe('outer_scan');
        expect(result.outerCode).toBe('OUT-G001');
        expect(result.traceId).toBe('G001');
        expect(result.productSummary).toBeDefined();
        expect(result.productSummary.traceId).toBe('G001');
        expect(result.nextStep).toBeDefined();
        expect(wx.setStorageSync).toHaveBeenCalledWith(
          'last_scanned_outer_code',
          expect.anything()
        );
      });

      test('无效的外码应该返回失败', async () => {
        const result = await antiCounterfeit.scanOuterCode('OUT-INVALID');
        expect(result.success).toBe(false);
        expect(result.code).toBe('INVALID_OUTER_CODE');
        expect(result.error).toBeDefined();
      });

      test('内码作为外码扫描应该返回编码类型错误', async () => {
        const result = await antiCounterfeit.scanOuterCode('INN-G001');
        expect(result.success).toBe(false);
        expect(result.code).toBe('INVALID_OUTER_CODE');
      });

      test('空值应该返回参数错误', async () => {
        const result = await antiCounterfeit.scanOuterCode('');
        expect(result.success).toBe(false);
        expect(result.code).toBe('INVALID_OUTER_CODE');
      });
    });

    describe('scanInnerCode 函数测试', () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });

      test('有外码上下文 + 正确绑定的内码应该验证成功', async () => {
        wx.getStorageSync.mockImplementation((key) => {
          if (key === 'last_scanned_outer_code') {
            return {
              outerCode: 'OUT-G001',
              innerCode: 'INN-G001',
              traceId: 'G001',
              productName: '金桂花茶',
              scannedAt: Date.now() - 60000,
              scannedAtStr: '2025-01-01 10:00:00',
              location: { city: '武汉' },
              summary: { bindBatch: 'BIND20250925001' }
            };
          }
          return [];
        });

        const result = await antiCounterfeit.scanInnerCode('INN-G001');
        expect(result.success).toBe(true);
        expect(result.verifyStatus).toBe('binding_success');
        expect(result.outerCode).toBe('OUT-G001');
        expect(result.innerCode).toBe('INN-G001');
        expect(result.bindingDetail).toBeDefined();
        expect(result.bindingDetail.isBound).toBe(true);
        expect(result.bindingDetail.matchTraceId).toBe(true);
        expect(result.riskLevel).toBe('normal');
      });

      test('有外码上下文 + 不匹配内码应该返回绑定不匹配', async () => {
        wx.getStorageSync.mockImplementation((key) => {
          if (key === 'last_scanned_outer_code') {
            return {
              outerCode: 'OUT-G001',
              innerCode: 'INN-G001',
              traceId: 'G001',
              productName: '金桂花茶',
              scannedAt: Date.now() - 60000,
              scannedAtStr: '2025-01-01 10:00:00',
              location: { city: '武汉' },
              summary: { bindBatch: 'BIND20250925001' }
            };
          }
          return [];
        });

        const result = await antiCounterfeit.scanInnerCode('INN-G002');
        expect(result.success).toBe(true);
        expect(result.verifyStatus).toBe('binding_mismatch');
        expect(result.errorType).toBe('binding_mismatch');
        expect(result.recommendedAction).toBe('report');
        expect(result.bindingDetail).toBeDefined();
        expect(result.bindingDetail.expectedInnerCode).toBe('INN-G001');
        expect(result.riskLevel).toBe('danger');
      });

      test('无外码上下文 + 内码应该提示需要先扫外码', async () => {
        wx.getStorageSync.mockImplementation((key) => {
          if (key === 'last_scanned_outer_code') return '';
          return [];
        });

        const result = await antiCounterfeit.scanInnerCode('INN-G001');
        expect(result.success).toBe(false);
        expect(result.needOuterScan).toBe(true);
        expect(result.code).toBe('NO_OUTER_CODE_SCAN');
      });

      test('无效内码应该返回编码无效', async () => {
        wx.getStorageSync.mockImplementation((key) => {
          if (key === 'last_scanned_outer_code') {
            return {
              outerCode: 'OUT-G001',
              innerCode: 'INN-G001'
            };
          }
          return [];
        });

        const result = await antiCounterfeit.scanInnerCode('INN-INVALID');
        expect(result.success).toBe(false);
        expect(result.code).toBe('INVALID_INNER_CODE');
      });
    });

    describe('getDualCodeVerifyStats 函数测试', () => {
      test('应该返回双码验证统计信息', () => {
        const stats = antiCounterfeit.getDualCodeVerifyStats();
        expect(stats).toBeDefined();
        expect(typeof stats.totalVerifyCount).toBe('number');
        expect(typeof stats.mismatchCount).toBe('number');
      });
    });

    describe('goToDualReport 函数测试', () => {
      test('应该生成包含所有参数的举报URL', () => {
        const url = antiCounterfeit.goToDualReport({
          outerCode: 'OUT-G001',
          innerCode: 'INN-G002',
          errorType: 'binding_mismatch',
          errorMessage: '内外码绑定不匹配',
          traceId: 'G001',
          productName: '金桂花茶'
        });

        expect(url).toContain('/pages/reportProduct/reportProduct');
        expect(url).toContain('outerCode=OUT-G001');
        expect(url).toContain('innerCode=INN-G002');
        expect(url).toContain('errorType=binding_mismatch');
        expect(url).toContain('autoSelectType=dual_mismatch');
        expect(url).toContain('productName=');
      });

      test('URL参数应该进行encodeURI编码', () => {
        const url = antiCounterfeit.goToDualReport({
          outerCode: 'OUT-G001',
          innerCode: 'INN-G002',
          errorMessage: '异常：中文信息/特殊字符&特殊'
        });
        expect(url).toContain('outerCode=OUT-G001');
        expect(url).not.toContain('异常：');
        expect(url).toContain(encodeURIComponent('异常：中文信息/特殊字符&特殊'));
      });

      test('也支持位置参数调用方式', () => {
        const url = antiCounterfeit.goToDualReport(
          'OUT-G001',
          'INN-G002',
          'binding_mismatch',
          '测试错误',
          'G001',
          '金桂花茶'
        );
        expect(url).toContain('outerCode=OUT-G001');
        expect(url).toContain('innerCode=INN-G002');
        expect(url).toContain('autoSelectType=dual_mismatch');
      });
    });

    describe('submitDualReport 函数测试', () => {
      test('包含双码信息的举报应该提交成功', () => {
        const result = antiCounterfeit.submitDualReport({
          traceId: 'G001',
          productName: '金桂花茶',
          reportType: 'dual_mismatch',
          reportTypeLabel: '双码(内外)不一致',
          description: '内外码绑定不匹配',
          contact: '13800138000',
          photos: [],
          outerCode: 'OUT-G001',
          innerCode: 'INN-G002',
          errorType: 'binding_mismatch',
          errorMessage: '绑定不匹配',
          hasDualCode: true
        });

        expect(result.success).toBe(true);
        expect(result.reportData).toBeDefined();
        expect(result.reportData.outerCode).toBe('OUT-G001');
        expect(result.reportData.innerCode).toBe('INN-G002');
        expect(result.reportData.id).toMatch(/^RPT-DUAL-/);
        expect(wx.setStorageSync).toHaveBeenCalled();
      });

      test('缺少举报类型应该返回失败', () => {
        const result = antiCounterfeit.submitDualReport({
          traceId: 'G001',
          productName: '金桂花茶',
          description: '测试描述'
        });
        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
        expect(result.code).toBe('MISSING_REPORT_TYPE');
      });
    });

    describe('举报类型列表测试', () => {
      test('应该包含 dual_mismatch 举报类型', () => {
        const types = antiCounterfeit.getReportTypes();
        const dualType = types.find(t => t.key === 'dual_mismatch');
        expect(dualType).toBeDefined();
        expect(dualType.icon).toBeDefined();
        expect(dualType.label).toContain('双码');
      });
    });
  });
});
