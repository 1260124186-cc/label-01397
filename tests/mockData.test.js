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

  describe('窨制工艺深化功能测试', () => {
    test('G001 应该包含5次窨制独立记录', () => {
      const data = mockData.mockTraceData['G001'];
      expect(data.scentingProcess.scentingRecords).toBeDefined();
      expect(Array.isArray(data.scentingProcess.scentingRecords)).toBe(true);
      expect(data.scentingProcess.scentingRecords.length).toBe(5);
    });

    test('G002 应该包含3次窨制独立记录', () => {
      const data = mockData.mockTraceData['G002'];
      expect(data.scentingProcess.scentingRecords).toBeDefined();
      expect(Array.isArray(data.scentingProcess.scentingRecords)).toBe(true);
      expect(data.scentingProcess.scentingRecords.length).toBe(3);
    });

    test('每次窨制记录应该包含完整字段', () => {
      const data = mockData.mockTraceData['G001'];
      const records = data.scentingProcess.scentingRecords;
      
      records.forEach((record, index) => {
        expect(record.round).toBe(index + 1);
        expect(record.duration).toBeDefined();
        expect(typeof record.duration).toBe('number');
        expect(record.temperature).toBeDefined();
        expect(typeof record.temperature).toBe('number');
        expect(record.operator).toBeDefined();
        expect(typeof record.operator).toBe('string');
        expect(record.timestamp).toBeDefined();
        expect(typeof record.timestamp).toBe('string');
        expect(record.humidity).toBeDefined();
        expect(typeof record.humidity).toBe('number');
        expect(record.note).toBeDefined();
        expect(typeof record.note).toBe('string');
      });
    });

    test('工艺步骤应该包含多媒体信息', () => {
      const data = mockData.mockTraceData['G001'];
      const steps = data.scentingProcess.processSteps;
      
      steps.forEach(step => {
        expect(step.mediaType).toBeDefined();
        expect(step.mediaUrl).toBeDefined();
        expect(typeof step.mediaUrl).toBe('string');
        expect(step.mediaUrl.length).toBeGreaterThan(0);
      });
    });

    test('G003 应该包含6次窨制记录', () => {
      const data = mockData.mockTraceData['G003'];
      expect(data.scentingProcess.scentingRecords.length).toBe(6);
    });

    test('G004 应该包含4次窨制记录', () => {
      const data = mockData.mockTraceData['G004'];
      expect(data.scentingProcess.scentingRecords.length).toBe(4);
    });
  });

  describe('getScentingComparison 函数测试', () => {
    test('应该能获取工艺对比数据', () => {
      const comparison = mockData.getScentingComparison();
      expect(comparison).not.toBeNull();
      expect(comparison).toBeDefined();
    });

    test('对比数据应该包含完整结构', () => {
      const comparison = mockData.getScentingComparison();
      
      expect(comparison.title).toBeDefined();
      expect(comparison.summary).toBeDefined();
      expect(comparison.summary.golden).toBeDefined();
      expect(comparison.summary.silver).toBeDefined();
      expect(comparison.comparisonItems).toBeDefined();
      expect(Array.isArray(comparison.comparisonItems)).toBe(true);
      expect(comparison.recordsComparison).toBeDefined();
      expect(comparison.differenceExplanation).toBeDefined();
    });

    test('金桂对比数据应该正确', () => {
      const comparison = mockData.getScentingComparison();
      const golden = comparison.summary.golden;
      
      expect(golden.name).toBe('金桂花茶');
      expect(golden.variety).toBe('金桂');
      expect(golden.scentingTimes).toBe(5);
      expect(golden.totalDuration).toBe(25);
      expect(golden.avgTemperature).toBe(28.8);
    });

    test('银桂对比数据应该正确', () => {
      const comparison = mockData.getScentingComparison();
      const silver = comparison.summary.silver;
      
      expect(silver.name).toBe('银桂花茶');
      expect(silver.variety).toBe('银桂');
      expect(silver.scentingTimes).toBe(3);
      expect(silver.totalDuration).toBe(18);
      expect(silver.avgTemperature).toBe(27);
    });

    test('对比项应该包含9个维度', () => {
      const comparison = mockData.getScentingComparison();
      expect(comparison.comparisonItems.length).toBe(9);
      
      comparison.comparisonItems.forEach(item => {
        expect(item.category).toBeDefined();
        expect(item.golden).toBeDefined();
        expect(item.silver).toBeDefined();
        expect(item.difference).toBeDefined();
        expect(['golden', 'silver', 'neutral']).toContain(item.advantage);
      });
    });

    test('窨制记录对比应该正确', () => {
      const comparison = mockData.getScentingComparison();
      
      expect(comparison.recordsComparison.golden.length).toBe(5);
      expect(comparison.recordsComparison.silver.length).toBe(3);
    });

    test('差异说明应该包含三个部分', () => {
      const comparison = mockData.getScentingComparison();
      const explanation = comparison.differenceExplanation;
      
      expect(explanation).toContain('金桂5次窨制特点');
      expect(explanation).toContain('银桂3次窨制特点');
      expect(explanation).toContain('核心差异总结');
    });
  });

  describe('双码验真工具函数测试', () => {
    describe('isOuterCode / isInnerCode / isDualCode 函数测试', () => {
      test('isOuterCode 应该正确识别外码', () => {
        expect(mockData.isOuterCode('OUT-G001')).toBe(true);
        expect(mockData.isOuterCode('out-g001')).toBe(true);
        expect(mockData.isOuterCode('INN-G001')).toBe(false);
        expect(mockData.isOuterCode('G001')).toBe(false);
        expect(mockData.isOuterCode('')).toBe(false);
        expect(mockData.isOuterCode(null)).toBe(false);
      });

      test('isInnerCode 应该正确识别内码', () => {
        expect(mockData.isInnerCode('INN-G001')).toBe(true);
        expect(mockData.isInnerCode('inn-g001')).toBe(true);
        expect(mockData.isInnerCode('OUT-G001')).toBe(false);
        expect(mockData.isInnerCode('G001')).toBe(false);
        expect(mockData.isInnerCode('')).toBe(false);
        expect(mockData.isInnerCode(null)).toBe(false);
      });

      test('isDualCode 应该正确识别双码', () => {
        expect(mockData.isDualCode('OUT-G001')).toBe(true);
        expect(mockData.isDualCode('INN-G001')).toBe(true);
        expect(mockData.isDualCode('G001')).toBe(false);
        expect(mockData.isDualCode('X001')).toBe(false);
        expect(mockData.isDualCode('')).toBe(false);
      });
    });

    describe('getDualCodeInfo 函数测试', () => {
      test('应该能获取有效的双码信息', () => {
        const outerInfo = mockData.getDualCodeInfo('OUT-G001');
        expect(outerInfo).not.toBeNull();
        expect(outerInfo.outerCode).toBe('OUT-G001');
        expect(outerInfo.innerCode).toBe('INN-G001');
        expect(outerInfo.codeType).toBe('outer');
        expect(outerInfo.traceId).toBe('G001');
        expect(outerInfo.isBound).toBe(true);

        const innerInfo = mockData.getDualCodeInfo('INN-G001');
        expect(innerInfo).not.toBeNull();
        expect(innerInfo.outerCode).toBe('OUT-G001');
        expect(innerInfo.innerCode).toBe('INN-G001');
        expect(innerInfo.codeType).toBe('inner');
      });

      test('无效的双码应该返回 null', () => {
        expect(mockData.getDualCodeInfo('OUT-INVALID')).toBeNull();
        expect(mockData.getDualCodeInfo('INN-9999')).toBeNull();
        expect(mockData.getDualCodeInfo('G001')).toBeNull();
        expect(mockData.getDualCodeInfo('')).toBeNull();
      });

      test('应该支持大小写和空格', () => {
        const info1 = mockData.getDualCodeInfo('out-g002');
        expect(info1).not.toBeNull();
        expect(info1.outerCode).toBe('OUT-G002');

        const info2 = mockData.getDualCodeInfo('  INN-G003  ');
        expect(info2).not.toBeNull();
        expect(info2.innerCode).toBe('INN-G003');
      });
    });

    describe('getOuterCodeByInner / getInnerCodeByOuter 函数测试', () => {
      test('getOuterCodeByInner 应该通过内码反查外码', () => {
        expect(mockData.getOuterCodeByInner('INN-G001')).toBe('OUT-G001');
        expect(mockData.getOuterCodeByInner('INN-G002')).toBe('OUT-G002');
        expect(mockData.getOuterCodeByInner('OUT-G001')).toBeNull();
        expect(mockData.getOuterCodeByInner('INVALID')).toBeNull();
      });

      test('getInnerCodeByOuter 应该通过外码查找内码', () => {
        expect(mockData.getInnerCodeByOuter('OUT-G001')).toBe('INN-G001');
        expect(mockData.getInnerCodeByOuter('OUT-G003')).toBe('INN-G003');
        expect(mockData.getInnerCodeByOuter('INN-G001')).toBeNull();
        expect(mockData.getInnerCodeByOuter('INVALID')).toBeNull();
      });
    });

    describe('verifyDualCodeBinding 函数测试', () => {
      test('绑定的双码对应该校验成功', () => {
        const result = mockData.verifyDualCodeBinding('OUT-G001', 'INN-G001');
        expect(result.isBound).toBe(true);
        expect(result.matchTraceId).toBe(true);
        expect(result.matchBindBatch).toBe(true);
        expect(result.errorType).toBeNull();
        expect(result.isValid).toBe(true);
      });

      test('不绑定的双码应该返回绑定不匹配', () => {
        const result = mockData.verifyDualCodeBinding('OUT-G001', 'INN-G002');
        expect(result.isBound).toBe(false);
        expect(result.matchTraceId).toBe(false);
        expect(result.errorType).toBe('binding_mismatch');
        expect(result.isValid).toBe(true);
        expect(result.expectedInnerCode).toBe('INN-G001');
        expect(result.expectedOuterCode).toBe('OUT-G002');
      });

      test('两个外码应该返回编码类型错误', () => {
        const result = mockData.verifyDualCodeBinding('OUT-G001', 'OUT-G002');
        expect(result.isValid).toBe(false);
        expect(result.errorType).toBe('code_type_error');
      });

      test('空值应该返回参数错误', () => {
        const result = mockData.verifyDualCodeBinding('', 'INN-G001');
        expect(result.isValid).toBe(false);
        expect(result.errorType).toBe('param_empty');
      });

      test('无效的编码应该返回编码无效', () => {
        const result = mockData.verifyDualCodeBinding('OUT-XXXX', 'INN-YYYY');
        expect(result.isValid).toBe(false);
        expect(result.errorType).toBe('code_not_found');
      });
    });

    describe('getOuterCodeSummary 函数测试', () => {
      test('有效的外码应该返回产品概要', () => {
        const summary = mockData.getOuterCodeSummary('OUT-G001');
        expect(summary).not.toBeNull();
        expect(summary.outerCode).toBe('OUT-G001');
        expect(summary.traceId).toBe('G001');
        expect(summary.productName).toBeDefined();
        expect(summary.spec).toBeDefined();
        expect(summary.batchNo).toBeDefined();
        expect(Array.isArray(summary.highlights)).toBe(true);
        expect(summary.highlights.length).toBeGreaterThan(0);
      });

      test('无效的外码应该返回 null', () => {
        expect(mockData.getOuterCodeSummary('INN-G001')).toBeNull();
        expect(mockData.getOuterCodeSummary('OUT-XXXX')).toBeNull();
        expect(mockData.getOuterCodeSummary('')).toBeNull();
      });
    });

    describe('parseDualCodeFromScanResult 函数测试', () => {
      test('应该能从纯文本中解析出双码', () => {
        const r1 = mockData.parseDualCodeFromScanResult('OUT-G001');
        expect(r1).not.toBeNull();
        expect(r1.code).toBe('OUT-G001');
        expect(r1.codeType).toBe('outer');

        const r2 = mockData.parseDualCodeFromScanResult('INN-G002');
        expect(r2).not.toBeNull();
        expect(r2.code).toBe('INN-G002');
        expect(r2.codeType).toBe('inner');
      });

      test('应该能从URL参数中解析出双码', () => {
        const r1 = mockData.parseDualCodeFromScanResult('https://example.com?code=OUT-G003');
        expect(r1).not.toBeNull();
        expect(r1.code).toBe('OUT-G003');
        expect(r1.codeType).toBe('outer');

        const r2 = mockData.parseDualCodeFromScanResult('https://verify.com/trace?dc=INN-G004&t=123');
        expect(r2).not.toBeNull();
        expect(r2.code).toBe('INN-G004');
        expect(r2.codeType).toBe('inner');
      });

      test('应该能从JSON字符串中解析出双码', () => {
        const json = '{"outerCode":"OUT-G001","verify":true}';
        const r1 = mockData.parseDualCodeFromScanResult(json);
        expect(r1).not.toBeNull();
        expect(r1.code).toBe('OUT-G001');
      });

      test('非双码内容应该返回 null', () => {
        expect(mockData.parseDualCodeFromScanResult('G001')).toBeNull();
        expect(mockData.parseDualCodeFromScanResult('Hello World')).toBeNull();
        expect(mockData.parseDualCodeFromScanResult('')).toBeNull();
        expect(mockData.parseDualCodeFromScanResult('https://example.com')).toBeNull();
      });
    });

    describe('getAvailableOuterCodes 函数测试', () => {
      test('应该返回所有可用的外码列表', () => {
        const codes = mockData.getAvailableOuterCodes();
        expect(Array.isArray(codes)).toBe(true);
        expect(codes.length).toBeGreaterThanOrEqual(4);
        codes.forEach(code => {
          expect(mockData.isOuterCode(code)).toBe(true);
        });
        expect(codes).toContain('OUT-G001');
        expect(codes).toContain('OUT-G002');
      });
    });
  });
});
