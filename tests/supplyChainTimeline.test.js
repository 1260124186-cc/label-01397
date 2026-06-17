const mockData = require('../utils/mockData.js');

describe('供应链时间轴模块测试', () => {
  
  describe('maskOperator 函数测试', () => {
    test('单字姓名不脱敏', () => {
      expect(mockData.maskOperator('王')).toBe('王');
    });

    test('双字姓名脱敏为"王*"', () => {
      expect(mockData.maskOperator('王师傅')).toBe('王*傅');
    });

    test('三字姓名脱敏为"王*傅"', () => {
      expect(mockData.maskOperator('李大师')).toBe('李*师');
    });

    test('多字姓名正确脱敏', () => {
      expect(mockData.maskOperator('李氏家族采茶队')).toBe('李*****队');
    });

    test('空值或null返回原值', () => {
      expect(mockData.maskOperator('')).toBe('');
      expect(mockData.maskOperator(null)).toBeNull();
      expect(mockData.maskOperator(undefined)).toBeUndefined();
    });
  });

  describe('getSupplyChainTimeline 函数测试', () => {
    test('应该能获取到 G001 的供应链时间轴数据', () => {
      const data = mockData.getSupplyChainTimeline('G001');
      expect(data).not.toBeNull();
      expect(data.traceId).toBe('G001');
      expect(data.batchNo).toBe('GH202503');
      expect(data.productName).toBe('金桂花茶');
    });

    test('应该能获取到 G002 的供应链时间轴数据', () => {
      const data = mockData.getSupplyChainTimeline('G002');
      expect(data).not.toBeNull();
      expect(data.traceId).toBe('G002');
      expect(data.batchNo).toBe('GH202504');
      expect(data.productName).toBe('银桂花茶');
    });

    test('应该支持小写溯源ID', () => {
      const data = mockData.getSupplyChainTimeline('g001');
      expect(data).not.toBeNull();
      expect(data.traceId).toBe('G001');
    });

    test('应该支持带空格的溯源ID', () => {
      const data = mockData.getSupplyChainTimeline(' G001 ');
      expect(data).not.toBeNull();
      expect(data.traceId).toBe('G001');
    });

    test('对于不存在的溯源ID应该返回 null', () => {
      const data = mockData.getSupplyChainTimeline('G999');
      expect(data).toBeNull();
    });

    test('对于空字符串应该返回 null', () => {
      const data = mockData.getSupplyChainTimeline('');
      expect(data).toBeNull();
    });
  });

  describe('getAllSupplyChainTimeline 函数测试', () => {
    test('应该返回所有供应链时间轴数据', () => {
      const allData = mockData.getAllSupplyChainTimeline();
      expect(allData).not.toBeNull();
      expect(typeof allData).toBe('object');
      expect(allData['G001']).toBeDefined();
      expect(allData['G002']).toBeDefined();
    });
  });

  describe('供应链时间轴数据结构测试', () => {
    test('G001 时间轴应该包含10个节点', () => {
      const data = mockData.getSupplyChainTimeline('G001');
      expect(Array.isArray(data.timeline)).toBe(true);
      expect(data.timeline.length).toBe(10);
    });

    test('G002 时间轴应该包含10个节点', () => {
      const data = mockData.getSupplyChainTimeline('G002');
      expect(Array.isArray(data.timeline)).toBe(true);
      expect(data.timeline.length).toBe(10);
    });

    test('时间轴节点应该按正确顺序排列', () => {
      const data = mockData.getSupplyChainTimeline('G001');
      const expectedOrder = [
        'soil_test', 'fertilizer', 'osmanthus_pick', 'tea_pick',
        'scenting', 'quality_test', 'packaging', 'outbound',
        'logistics', 'signoff'
      ];
      const actualOrder = data.timeline.map(node => node.type);
      expect(actualOrder).toEqual(expectedOrder);
    });

    test('每个时间轴节点应该包含所有必要字段', () => {
      const data = mockData.getSupplyChainTimeline('G001');
      data.timeline.forEach(node => {
        expect(node.id).toBeDefined();
        expect(node.type).toBeDefined();
        expect(node.title).toBeDefined();
        expect(node.icon).toBeDefined();
        expect(node.time).toBeDefined();
        expect(node.location).toBeDefined();
        expect(node.operator).toBeDefined();
        expect(node.operatorMasked).toBeDefined();
        expect(node.photos).toBeDefined();
        expect(Array.isArray(node.photos)).toBe(true);
        expect(node.onChain).toBeDefined();
        expect(typeof node.onChain).toBe('boolean');
        expect(node.isAbnormal).toBeDefined();
        expect(typeof node.isAbnormal).toBe('boolean');
        expect(node.abnormalReason).toBeDefined();
        expect(node.detail).toBeDefined();
      });
    });

    test('操作人应该正确脱敏', () => {
      const data = mockData.getSupplyChainTimeline('G001');
      data.timeline.forEach(node => {
        expect(node.operatorMasked).not.toBe(node.operator);
        expect(node.operatorMasked).toContain('*');
      });
    });

    test('G001 应该有1个异常节点（物流延期）', () => {
      const data = mockData.getSupplyChainTimeline('G001');
      const abnormalNodes = data.timeline.filter(node => node.isAbnormal);
      expect(abnormalNodes.length).toBe(1);
      expect(abnormalNodes[0].type).toBe('logistics');
      expect(abnormalNodes[0].abnormalReason).toContain('延期');
    });

    test('G002 应该有2个异常节点', () => {
      const data = mockData.getSupplyChainTimeline('G002');
      const abnormalNodes = data.timeline.filter(node => node.isAbnormal);
      expect(abnormalNodes.length).toBe(2);
      const abnormalTypes = abnormalNodes.map(n => n.type);
      expect(abnormalTypes).toContain('soil_test');
      expect(abnormalTypes).toContain('quality_test');
    });

    test('所有节点应该都已上链', () => {
      const data = mockData.getSupplyChainTimeline('G001');
      data.timeline.forEach(node => {
        expect(node.onChain).toBe(true);
        expect(node.chainHash).toBeDefined();
        expect(node.chainHash).toContain('...');
      });
    });

    test('每个节点应该至少有1张照片', () => {
      const data = mockData.getSupplyChainTimeline('G001');
      data.timeline.forEach(node => {
        expect(node.photos.length).toBeGreaterThan(0);
        node.photos.forEach(photo => {
          expect(photo).toContain('https://');
        });
      });
    });
  });

  describe('土壤检测节点数据测试', () => {
    test('土壤检测节点应该包含PH值、有机质等数据', () => {
      const data = mockData.getSupplyChainTimeline('G001');
      const soilTestNode = data.timeline.find(n => n.type === 'soil_test');
      expect(soilTestNode).not.toBeUndefined();
      expect(soilTestNode.detail.ph).toBeDefined();
      expect(typeof soilTestNode.detail.ph).toBe('number');
      expect(soilTestNode.detail.organicMatter).toBeDefined();
      expect(soilTestNode.detail.nitrogen).toBeDefined();
      expect(soilTestNode.detail.phosphorus).toBeDefined();
      expect(soilTestNode.detail.potassium).toBeDefined();
      expect(soilTestNode.detail.conclusion).toBeDefined();
    });

    test('G002 土壤检测节点应该是异常节点', () => {
      const data = mockData.getSupplyChainTimeline('G002');
      const soilTestNode = data.timeline.find(n => n.type === 'soil_test');
      expect(soilTestNode.isAbnormal).toBe(true);
      expect(soilTestNode.abnormalReason).toContain('延期');
    });
  });

  describe('施肥记录节点数据测试', () => {
    test('施肥记录节点应该包含肥料类型、用量等数据', () => {
      const data = mockData.getSupplyChainTimeline('G001');
      const fertilizerNode = data.timeline.find(n => n.type === 'fertilizer');
      expect(fertilizerNode).not.toBeUndefined();
      expect(fertilizerNode.detail.fertilizerType).toBeDefined();
      expect(fertilizerNode.detail.amount).toBeDefined();
      expect(fertilizerNode.detail.method).toBeDefined();
      expect(fertilizerNode.detail.note).toBeDefined();
    });
  });

  describe('采摘节点数据测试', () => {
    test('桂花采摘节点应该包含品种、数量等数据', () => {
      const data = mockData.getSupplyChainTimeline('G001');
      const osmanthusPickNode = data.timeline.find(n => n.type === 'osmanthus_pick');
      expect(osmanthusPickNode).not.toBeUndefined();
      expect(osmanthusPickNode.detail.variety).toBe('金桂');
      expect(osmanthusPickNode.detail.quantity).toBeDefined();
      expect(osmanthusPickNode.detail.quality).toBeDefined();
      expect(osmanthusPickNode.detail.weather).toBeDefined();
    });

    test('茶叶采摘节点应该包含采摘标准、等级等数据', () => {
      const data = mockData.getSupplyChainTimeline('G001');
      const teaPickNode = data.timeline.find(n => n.type === 'tea_pick');
      expect(teaPickNode).not.toBeUndefined();
      expect(teaPickNode.detail.standard).toBe('一芽二叶');
      expect(teaPickNode.detail.quantity).toBeDefined();
      expect(teaPickNode.detail.grade).toBeDefined();
      expect(teaPickNode.detail.weather).toBeDefined();
    });
  });

  describe('窨制节点数据测试', () => {
    test('窨制节点应该包含窨制次数、温度、湿度等数据', () => {
      const data = mockData.getSupplyChainTimeline('G001');
      const scentingNode = data.timeline.find(n => n.type === 'scenting');
      expect(scentingNode).not.toBeUndefined();
      expect(scentingNode.detail.scentingTimes).toBe(5);
      expect(scentingNode.detail.totalDuration).toBeDefined();
      expect(scentingNode.detail.temperature).toBeDefined();
      expect(scentingNode.detail.humidity).toBeDefined();
      expect(scentingNode.detail.ratio).toBeDefined();
      expect(scentingNode.detail.note).toBeDefined();
    });
  });

  describe('质检节点数据测试', () => {
    test('质检节点应该包含报告编号、检测项目等数据', () => {
      const data = mockData.getSupplyChainTimeline('G001');
      const qualityTestNode = data.timeline.find(n => n.type === 'quality_test');
      expect(qualityTestNode).not.toBeUndefined();
      expect(qualityTestNode.detail.reportNo).toBeDefined();
      expect(qualityTestNode.detail.standard).toBe('GB 2763-2021');
      expect(qualityTestNode.detail.conclusion).toBeDefined();
      expect(qualityTestNode.detail.overallScore).toBe(96);
      expect(Array.isArray(qualityTestNode.detail.items)).toBe(true);
      expect(qualityTestNode.detail.items.length).toBeGreaterThan(0);
    });

    test('G002 质检节点应该是异常节点', () => {
      const data = mockData.getSupplyChainTimeline('G002');
      const qualityTestNode = data.timeline.find(n => n.type === 'quality_test');
      expect(qualityTestNode.isAbnormal).toBe(true);
      expect(qualityTestNode.abnormalReason).toContain('超出');
      
      const failItem = qualityTestNode.detail.items.find(i => i.status === '不合格');
      expect(failItem).not.toBeUndefined();
      expect(failItem.name).toBe('氯氰菊酯');
    });

    test('检测项目应该包含名称、结果、限值、状态字段', () => {
      const data = mockData.getSupplyChainTimeline('G001');
      const qualityTestNode = data.timeline.find(n => n.type === 'quality_test');
      qualityTestNode.detail.items.forEach(item => {
        expect(item.name).toBeDefined();
        expect(item.result).toBeDefined();
        expect(item.limit).toBeDefined();
        expect(item.status).toBeDefined();
        expect(['合格', '不合格']).toContain(item.status);
      });
    });
  });

  describe('包装节点数据测试', () => {
    test('包装节点应该包含包装类型、规格等数据', () => {
      const data = mockData.getSupplyChainTimeline('G001');
      const packagingNode = data.timeline.find(n => n.type === 'packaging');
      expect(packagingNode).not.toBeUndefined();
      expect(packagingNode.detail.packageType).toBeDefined();
      expect(packagingNode.detail.specification).toBe('100g/罐');
      expect(packagingNode.detail.batchNo).toBeDefined();
      expect(packagingNode.detail.quantity).toBeDefined();
    });
  });

  describe('出库节点数据测试', () => {
    test('出库节点应该包含订单号、目的地等数据', () => {
      const data = mockData.getSupplyChainTimeline('G001');
      const outboundNode = data.timeline.find(n => n.type === 'outbound');
      expect(outboundNode).not.toBeUndefined();
      expect(outboundNode.detail.orderNo).toBeDefined();
      expect(outboundNode.detail.quantity).toBeDefined();
      expect(outboundNode.detail.destination).toBeDefined();
      expect(outboundNode.detail.vehicleNo).toBeDefined();
    });
  });

  describe('物流节点数据测试', () => {
    test('物流节点应该包含运单号、轨迹等数据', () => {
      const data = mockData.getSupplyChainTimeline('G001');
      const logisticsNode = data.timeline.find(n => n.type === 'logistics');
      expect(logisticsNode).not.toBeUndefined();
      expect(logisticsNode.detail.waybillNo).toBeDefined();
      expect(logisticsNode.detail.carrier).toBeDefined();
      expect(logisticsNode.detail.status).toBeDefined();
      expect(logisticsNode.detail.estimatedDelivery).toBeDefined();
      expect(logisticsNode.detail.currentLocation).toBeDefined();
      expect(Array.isArray(logisticsNode.detail.transitStops)).toBe(true);
      expect(logisticsNode.detail.transitStops.length).toBeGreaterThan(0);
    });

    test('物流轨迹应该包含时间、地点、状态字段', () => {
      const data = mockData.getSupplyChainTimeline('G001');
      const logisticsNode = data.timeline.find(n => n.type === 'logistics');
      logisticsNode.detail.transitStops.forEach(stop => {
        expect(stop.time).toBeDefined();
        expect(stop.location).toBeDefined();
        expect(stop.status).toBeDefined();
      });
    });

    test('G001 物流节点应该是异常节点（延期）', () => {
      const data = mockData.getSupplyChainTimeline('G001');
      const logisticsNode = data.timeline.find(n => n.type === 'logistics');
      expect(logisticsNode.isAbnormal).toBe(true);
      expect(logisticsNode.abnormalReason).toContain('交通管制');
      expect(logisticsNode.abnormalReason).toContain('延期');
    });
  });

  describe('签收节点数据测试', () => {
    test('签收节点应该包含签收方式、评分等数据', () => {
      const data = mockData.getSupplyChainTimeline('G001');
      const signoffNode = data.timeline.find(n => n.type === 'signoff');
      expect(signoffNode).not.toBeUndefined();
      expect(signoffNode.detail.signMethod).toBeDefined();
      expect(signoffNode.detail.rating).toBeDefined();
      expect(typeof signoffNode.detail.rating).toBe('number');
      expect(signoffNode.detail.rating).toBeGreaterThanOrEqual(1);
      expect(signoffNode.detail.rating).toBeLessThanOrEqual(5);
      expect(signoffNode.detail.comment).toBeDefined();
      expect(signoffNode.detail.signTime).toBeDefined();
    });
  });

  describe('数据深拷贝测试', () => {
    test('返回的数据应该是深拷贝，修改不会影响原始数据', () => {
      const data1 = mockData.getSupplyChainTimeline('G001');
      const data2 = mockData.getSupplyChainTimeline('G001');
      
      data1.timeline[0].title = '修改后的标题';
      expect(data2.timeline[0].title).not.toBe('修改后的标题');
    });
  });
});
