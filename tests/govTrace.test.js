/**
 * 政府溯源平台对接模块测试
 * 测试功能：
 * 1. govTrace.js - 政府溯源平台对接模块
 * 2. mockData 中的政府溯源数据
 * 3. recallService 中的政府召回增强功能
 */

const govTrace = require('../utils/govTrace.js');
const mockData = require('../utils/mockData.js');
const recallService = require('../utils/recallService.js');

describe('政府溯源平台对接模块测试', () => {

  describe('govTrace 基础配置测试', () => {
    test('省级平台配置应正确定义', () => {
      const config = govTrace.PROVINCE_CONFIG;
      expect(config).toBeDefined();
      expect(config.name).toBe('湖北省茶叶质量追溯平台');
      expect(config.shortName).toBe('湖北省茶叶追溯体系');
      expect(config.regulatoryAuthority).toBe('湖北省农业农村厅');
      expect(config.hotline).toBe('12316');
    });

    test('国家级平台配置应正确定义', () => {
      const config = govTrace.NATIONAL_CONFIG;
      expect(config).toBeDefined();
      expect(config.name).toBe('国家农产品质量安全追溯管理信息平台');
      expect(config.regulatoryAuthority).toBe('农业农村部农产品质量安全监管司');
    });

    test('政府平台状态枚举应正确定义', () => {
      expect(govTrace.GOV_PLATFORM_STATUS.APPROVED).toBe('approved');
      expect(govTrace.GOV_PLATFORM_STATUS.WARNING).toBe('warning');
      expect(govTrace.GOV_PLATFORM_STATUS.RECALL).toBe('recall');
      expect(govTrace.GOV_PLATFORM_STATUS_LABEL.approved).toBe('备案通过');
      expect(govTrace.GOV_PLATFORM_STATUS_COLOR.approved).toBe('#52C41A');
    });

    test('API 可用性控制应正常工作', () => {
      expect(govTrace.isApiAvailable()).toBe(true);
      govTrace.setApiAvailable(false);
      expect(govTrace.isApiAvailable()).toBe(false);
      govTrace.setApiAvailable(true);
      expect(govTrace.isApiAvailable()).toBe(true);
    });
  });

  describe('mockData 政府溯源数据测试', () => {
    test('G001 应能获取省级和国家级政府溯源信息', () => {
      const govInfo = mockData.getGovTraceByTraceId('G001');
      expect(govInfo).not.toBeNull();
      expect(govInfo.traceId).toBe('G001');
      expect(govInfo.province).toBeDefined();
      expect(govInfo.province.filingStatus).toBe('approved');
      expect(govInfo.province.filingNo).toContain('HUBEI-TEA');
      expect(govInfo.national).toBeDefined();
      expect(govInfo.national.filingNo).toContain('NA-AGRI');
      expect(govInfo.complianceText).toContain('湖北省茶叶追溯体系');
    });

    test('G002 应包含预警和不合格信息', () => {
      const govInfo = mockData.getGovTraceByTraceId('G002');
      expect(govInfo).not.toBeNull();
      expect(govInfo.province.filingStatus).toBe('warning');
      expect(govInfo.province.warningMessage).toBeDefined();
      expect(govInfo.national.filingStatus).toBe('warning');

      const hasAbnormal = govInfo.province.inspectionRecords.some(
        r => r.result === '不合格' && r.abnormalItems
      );
      expect(hasAbnormal).toBe(true);
    });

    test('G004 应只包含省级备案信息', () => {
      const govInfo = mockData.getGovTraceByTraceId('G004');
      expect(govInfo).not.toBeNull();
      expect(govInfo.platformLevel).toBe('province');
      expect(govInfo.province).toBeDefined();
      expect(govInfo.national).toBeNull();
    });

    test('通过省级政府追溯码应能查询到对应信息', () => {
      const result = mockData.getGovTraceByGovCode('HB20250925GH202503857201');
      expect(result).not.toBeNull();
      expect(result.traceId).toBe('G001');
      expect(result.matchedGovCode).toBe('HB20250925GH202503857201');
      expect(result.platformLevel).toBe('province');
    });

    test('通过国家级政府追溯码应能查询到对应信息', () => {
      const result = mockData.getGovTraceByGovCode('NA20250925GH202503462189');
      expect(result).not.toBeNull();
      expect(result.traceId).toBe('G001');
      expect(result.platformLevel).toBe('national');
    });

    test('无效的政府追溯码应返回 null', () => {
      const result = mockData.getGovTraceByGovCode('HBINVALIDCODE123');
      expect(result).toBeNull();
    });

    test('不存在的 traceId 应返回 null', () => {
      const result = mockData.getGovTraceByTraceId('G999');
      expect(result).toBeNull();
    });

    test('应包含平台状态更新数据', () => {
      const updates = mockData.getGovPlatformStatusUpdates();
      expect(updates).toBeDefined();
      expect(Array.isArray(updates)).toBe(true);
      expect(updates.length).toBeGreaterThan(0);

      const recallUpdate = updates.find(u => u.status === 'recall');
      expect(recallUpdate).toBeDefined();
      expect(recallUpdate.batchNo).toBe('GH202504');
      expect(recallUpdate.abnormalItems).toBeDefined();
    });

    test('updateProductGovStatus 应能正确更新产品状态', () => {
      mockData.updateProductGovStatus('GH202503', 'warning');
      const govInfo = mockData.getGovTraceByTraceId('G001');
      expect(govInfo.province.filingStatus).toBe('warning');

      mockData.updateProductGovStatus('GH202503', 'approved');
      const govInfo2 = mockData.getGovTraceByTraceId('G001');
      expect(govInfo2.province.filingStatus).toBe('approved');
    });
  });

  describe('govTrace 查询功能测试', () => {
    beforeEach(() => {
      govTrace.setApiAvailable(true);
      govTrace.setSimulatedFailureRate(0);
    });

    test('queryGovTraceByTraceId 应能成功查询', async () => {
      const result = await govTrace.queryGovTraceByTraceId('G001');
      expect(result.success).toBe(true);
      expect(result.fallback).toBe(false);
      expect(result.data).toBeDefined();
      expect(result.data.traceId).toBe('G001');
    });

    test('queryGovTraceByTraceId 不存在的 ID 应降级', async () => {
      const result = await govTrace.queryGovTraceByTraceId('G999');
      expect(result.success).toBe(false);
      expect(result.fallback).toBe(true);
      expect(result.message).toContain('政府备案信息暂不可用');
    });

    test('queryGovTraceByGovCode 应能成功查询省级码', async () => {
      const result = await govTrace.queryGovTraceByGovCode('HB20250925GH202503857201');
      expect(result.success).toBe(true);
      expect(result.data.traceId).toBe('G001');
    });

    test('queryGovTraceByGovCode 应能成功查询国家级码', async () => {
      const result = await govTrace.queryGovTraceByGovCode('NA20250925GH202503462189');
      expect(result.success).toBe(true);
      expect(result.data.traceId).toBe('G001');
    });

    test('queryGovTraceByGovCode 空码应返回失败', async () => {
      const result = await govTrace.queryGovTraceByGovCode('');
      expect(result.success).toBe(false);
      expect(result.message).toContain('请输入政府追溯码');
    });

    test('verifyGovCodeFormat 应能正确验证格式', () => {
      expect(govTrace.verifyGovCodeFormat('HB20250925GH202503857201')).toBe(true);
      expect(govTrace.verifyGovCodeFormat('NA20250925GH202503462189')).toBe(true);
      expect(govTrace.verifyGovCodeFormat('INVALID')).toBe(false);
      expect(govTrace.verifyGovCodeFormat('123456')).toBe(false);
      expect(govTrace.verifyGovCodeFormat('')).toBe(false);
    });

    test('getGovComplianceText 应返回正确文案', () => {
      const text = govTrace.getGovComplianceText('G001');
      expect(text).toContain('湖北省茶叶追溯体系');
    });
  });

  describe('govTrace 失败降级测试', () => {
    test('API 不可用时 queryGovTraceByTraceId 应降级', async () => {
      govTrace.setApiAvailable(false);
      const result = await govTrace.queryGovTraceByTraceId('G001');
      expect(result.success).toBe(false);
      expect(result.fallback).toBe(true);
      expect(result.message).toContain('政府平台接口暂不可用');
      govTrace.setApiAvailable(true);
    });

    test('模拟失败率 100% 时应降级', async () => {
      govTrace.setSimulatedFailureRate(1);
      const result = await govTrace.queryGovTraceByTraceId('G001');
      expect(result.success).toBe(false);
      expect(result.fallback).toBe(true);
      govTrace.setSimulatedFailureRate(0);
    });

    test('API 不可用时 reportBatchToGovPlatform 应返回待重试', async () => {
      govTrace.setApiAvailable(false);
      const result = await govTrace.reportBatchToGovPlatform('GH2025TEST', {
        productName: '测试产品',
        quantity: 100
      });
      expect(result.success).toBe(false);
      expect(result.pendingRetry).toBe(true);
      expect(result.message).toContain('重试队列');
      govTrace.setApiAvailable(true);
    });
  });

  describe('govTrace 批次上报测试', () => {
    beforeEach(() => {
      govTrace.setApiAvailable(true);
      govTrace.setSimulatedFailureRate(0);
    });

    test('reportBatchToGovPlatform 应生成政府追溯码', async () => {
      const result = await govTrace.reportBatchToGovPlatform('GH2025TEST01', {
        productName: '金桂花茶（测试批次）',
        specification: '100g/罐',
        productionTime: '2025年6月19日',
        quantity: 500,
        testReportNo: 'TEST-2025-0001'
      });
      expect(result.success).toBe(true);
      expect(result.data.provinceGovCode).toMatch(/^HB/);
      expect(result.data.nationalGovCode).toMatch(/^NA/);
      expect(result.data.provinceFilingNo).toBeDefined();
      expect(result.data.reportStatus).toBe('approved');
    });

    test('重复上报相同批次应返回 alreadyReported', async () => {
      const batchNo = 'GH2025TEST02';
      await govTrace.reportBatchToGovPlatform(batchNo, {
        productName: '测试产品',
        quantity: 100
      });

      const result2 = await govTrace.reportBatchToGovPlatform(batchNo, {
        productName: '测试产品',
        quantity: 100
      });
      expect(result2.alreadyReported).toBe(true);
    });
  });

  describe('govTrace 状态同步测试', () => {
    beforeEach(() => {
      govTrace.setApiAvailable(true);
      govTrace.setSimulatedFailureRate(0);
    });

    test('syncPlatformStatusUpdates 应返回状态更新', async () => {
      const result = await govTrace.syncPlatformStatusUpdates();
      expect(result.success).toBe(true);
      expect(result.updatedCount).toBeGreaterThanOrEqual(0);
    });
  });

  describe('政府追溯码生成测试', () => {
    test('generateGovTraceCode 省级码应以 HB 开头', () => {
      const code = govTrace.generateGovTraceCode('GH202503', 'province');
      expect(code).toMatch(/^HB/);
      expect(code.length).toBeGreaterThan(10);
    });

    test('generateGovTraceCode 国家级码应以 NA 开头', () => {
      const code = govTrace.generateGovTraceCode('GH202503', 'national');
      expect(code).toMatch(/^NA/);
    });

    test('不同批次应生成不同追溯码', () => {
      const code1 = govTrace.generateGovTraceCode('GH202503', 'province');
      const code2 = govTrace.generateGovTraceCode('GH202504', 'province');
      expect(code1).not.toBe(code2);
    });
  });

  describe('recallService 政府召回增强测试', () => {
    test('RECALL_SOURCES 应包含政府平台来源', () => {
      expect(recallService.RECALL_SOURCES.GOVERNMENT_PLATFORM).toBe('government_platform');
      expect(recallService.RECALL_SOURCE_LABELS.government_platform).toBe('政府平台责令召回');
    });

    test('getRecallSourceLabel 应返回正确标签', () => {
      expect(recallService.getRecallSourceLabel('government_platform')).toBe('政府平台责令召回');
      expect(recallService.getRecallSourceLabel('unknown')).toBe('品牌召回');
    });

    test('addGovRecallNotification 应正确添加通知', () => {
      const govUpdate = {
        updateId: 'TEST-GOV-001',
        batchNo: 'GH2025TEST',
        productName: '测试产品',
        status: 'recall',
        statusLabel: '责令召回',
        reason: '农残超标',
        platformLevel: 'province',
        issuedAt: Date.now(),
        severity: 'high'
      };

      const result = recallService.addGovRecallNotification(govUpdate);
      expect(result.success).toBe(true);
      expect(result.needRegister).toBe(true);
    });

    test('重复添加相同 updateId 应返回 alreadyExists', () => {
      const govUpdate = {
        updateId: 'TEST-GOV-002',
        batchNo: 'GH2025TEST2',
        status: 'warning',
        platformLevel: 'province',
        issuedAt: Date.now()
      };

      recallService.addGovRecallNotification(govUpdate);
      const result2 = recallService.addGovRecallNotification(govUpdate);
      expect(result2.success).toBe(false);
      expect(result2.alreadyExists).toBe(true);
    });

    test('syncAndProcessGovStatusUpdates 应能同步处理', async () => {
      const result = await recallService.syncAndProcessGovStatusUpdates();
      expect(result.success).toBe(true);
      expect(typeof result.processedCount).toBe('number');
    });
  });

  describe('合规文案验证', () => {
    test('省级平台合规文案应包含正确内容', () => {
      expect(govTrace.PROVINCE_CONFIG.complianceText).toContain('本品已纳入');
      expect(govTrace.PROVINCE_CONFIG.complianceText).toContain('湖北省茶叶追溯体系');
    });

    test('国家级平台合规文案应包含正确内容', () => {
      expect(govTrace.NATIONAL_CONFIG.complianceText).toContain('本品已纳入');
      expect(govTrace.NATIONAL_CONFIG.complianceText).toContain('国家农产品质量安全追溯管理信息平台');
    });

    test('G001 产品合规文案应包含双平台信息', () => {
      const info = mockData.getGovTraceByTraceId('G001');
      expect(info.complianceText).toContain('湖北省茶叶追溯体系');
      expect(info.complianceText).toContain('国家农产品质量安全追溯平台');
    });

    test('G004 产品合规文案应只包含省级信息', () => {
      const info = mockData.getGovTraceByTraceId('G004');
      expect(info.complianceText).toContain('湖北省茶叶追溯体系');
      expect(info.complianceText).not.toContain('国家农产品');
    });
  });

});
