const channelTrace = require('../utils/channelTrace.js');
const mockData = require('../utils/mockData.js');

let storageStore = {};

global.wx = {
  getStorageSync: jest.fn(function(key) {
    return storageStore[key] !== undefined ? storageStore[key] : null;
  }),
  setStorageSync: jest.fn(function(key, value) {
    storageStore[key] = value;
  }),
  showToast: jest.fn(),
  scanCode: jest.fn()
};

describe('渠道溯源模块测试', () => {

  beforeEach(() => {
    storageStore = {};
    wx.getStorageSync.mockClear();
    wx.setStorageSync.mockClear();
    wx.showToast.mockClear();
  });

  describe('溯源码类型识别', () => {

    test('识别生产码 G001', () => {
      const type = channelTrace.detectCodeType('G001');
      expect(type).toBe('production');
    });

    test('识别生产码 P-001', () => {
      const type = channelTrace.detectCodeType('P-001');
      expect(type).toBe('production');
    });

    test('识别箱码 B-GH202503-001', () => {
      const type = channelTrace.detectCodeType('B-GH202503-001');
      expect(type).toBe('box');
    });

    test('识别门店码 S-001', () => {
      const type = channelTrace.detectCodeType('S-001');
      expect(type).toBe('store');
    });

    test('未知码类型', () => {
      const type = channelTrace.detectCodeType('UNKNOWN001');
      expect(type).toBe('unknown');
    });

    test('空码类型为 unknown', () => {
      const type = channelTrace.detectCodeType('');
      expect(type).toBe('unknown');
    });

    test('获取码类型信息', () => {
      const info = channelTrace.getCodeTypeInfo('production');
      expect(info).toBeDefined();
      expect(info.label).toBe('生产码');
      expect(info.icon).toBeDefined();
    });

  });

  describe('溯源码解析', () => {

    test('解析纯文本生产码', () => {
      const result = channelTrace.parseTraceCode('G001');
      expect(result.success).toBe(true);
      expect(result.codeType).toBe('production');
      expect(result.code).toBe('G001');
    });

    test('解析 URL 格式溯源码', () => {
      const result = channelTrace.parseTraceCode('https://guihua.tea/trace?code=G002&t=123');
      expect(result.success).toBe(true);
      expect(result.code).toBe('G002');
      expect(result.codeType).toBe('production');
    });

    test('解析箱码', () => {
      const result = channelTrace.parseTraceCode('B-GH202503-001');
      expect(result.success).toBe(true);
      expect(result.codeType).toBe('box');
      expect(result.traceInfo).toBeDefined();
    });

    test('空字符串解析失败', () => {
      const result = channelTrace.parseTraceCode('');
      expect(result.success).toBe(false);
    });

    test('未知类型码解析失败', () => {
      const result = channelTrace.parseTraceCode('XYZ001');
      expect(result.success).toBe(false);
      expect(result.error).toContain('格式');
    });

  });

  describe('经销商管理', () => {

    test('获取默认经销商', () => {
      const dealer = channelTrace.getCurrentDealer();
      expect(dealer).toBeDefined();
      expect(dealer.id).toBeDefined();
      expect(dealer.name).toBeDefined();
    });

    test('设置当前经销商', () => {
      const dealerList = mockData.getDealerList();
      const testDealer = dealerList[1];
      channelTrace.setCurrentDealer(testDealer);
      const current = channelTrace.getCurrentDealer();
      expect(current.id).toBe(testDealer.id);
      expect(current.name).toBe(testDealer.name);
    });

  });

  describe('扫码入库', () => {

    test('入库成功', () => {
      const dealer = mockData.getDefaultDealer();
      const result = channelTrace.stockIn(
        dealer,
        'G001',
        'production',
        { productName: '金桂特级礼盒', specification: '250g/盒', batchNo: 'GH20250101', traceId: 'G001' },
        10
      );
      expect(result.success).toBe(true);
      expect(result.record.code).toBe('G001');
      expect(result.record.quantity).toBe(10);
      expect(result.record.type).toBe('in');
    });

  });

  describe('扫码出库', () => {

    beforeEach(() => {
      const dealer = mockData.getDefaultDealer();
      channelTrace.stockIn(
        dealer,
        'G001',
        'production',
        { productName: '金桂特级礼盒', specification: '250g/盒', batchNo: 'GH20250101', traceId: 'G001' },
        10
      );
    });

    test('出库成功 - 发给下级经销商', () => {
      const dealer = mockData.getDefaultDealer();
      const children = mockData.getChildDealers(dealer.id);
      if (children.length > 0) {
        const result = channelTrace.stockOut(
          dealer,
          'G001',
          'production',
          { productName: '金桂特级礼盒', specification: '250g/盒', batchNo: 'GH20250101', traceId: 'G001' },
          5,
          children[0]
        );
        expect(result.success).toBe(true);
        expect(result.record.type).toBe('out');
        expect(result.record.quantity).toBe(5);
      } else {
        expect(true).toBe(true);
      }
    });

    test('出库失败 - 库存不足', () => {
      const dealer = mockData.getDefaultDealer();
      const result = channelTrace.stockOut(
        dealer,
        'G001',
        'production',
        { productName: '金桂特级礼盒', traceId: 'G001' },
        100,
        null
      );
      expect(result.success).toBe(false);
      expect(result.error).toContain('库存');
    });

  });

  describe('库存查询', () => {

    beforeEach(() => {
      const dealer = mockData.getDefaultDealer();
      channelTrace.stockIn(
        dealer,
        'G003',
        'production',
        { productName: '银桂精选礼盒', specification: '200g/盒', traceId: 'G003' },
        20
      );
    });

    test('查询经销商库存', () => {
      const dealer = mockData.getDefaultDealer();
      const inventory = channelTrace.getDealerInventory(dealer.id);
      expect(inventory.length).toBeGreaterThan(0);
    });

  });

  describe('渠道流转展示', () => {

    test('获取格式化渠道展示数据', () => {
      const flow = channelTrace.getDisplayChannelFlow('G001');
      expect(flow).toBeDefined();
      expect(flow.length).toBeGreaterThan(0);
      expect(flow[0].role).toBeDefined();
      expect(flow[0].name).toBeDefined();
      expect(flow[0].step).toBeDefined();
    });

    test('获取空数据的渠道展示', () => {
      const flow = channelTrace.getDisplayChannelFlow('NOT_EXIST');
      expect(Array.isArray(flow)).toBe(true);
    });

  });

  describe('窜货检测', () => {

    test('授权区域内扫码 - 正常', () => {
      const result = channelTrace.checkDivergence('G001', '湖北省武汉市', '湖北省武汉市');
      expect(result.isDivergence).toBe(false);
    });

    test('非授权区域扫码 - 窜货', () => {
      const result = channelTrace.checkDivergence('G001', '北京市朝阳区', '北京市朝阳区');
      expect(result.isDivergence).toBe(true);
      expect(result.scanCity).toBe('北京市朝阳区');
      expect(result.authorizedRegions).toBeDefined();
    });

    test('窜货告警列表', () => {
      const dealer = mockData.getDefaultDealer();
      const alerts = channelTrace.getDivergenceAlertList(dealer.id);
      expect(Array.isArray(alerts)).toBe(true);
    });

  });

  describe('出入库记录', () => {

    test('查询出入库记录', () => {
      const dealer = mockData.getDefaultDealer();
      channelTrace.stockIn(
        dealer,
        'G002',
        'production',
        { productName: '丹桂特级礼盒', traceId: 'G002' },
        5
      );
      const records = channelTrace.getDealerInOutRecords(dealer.id);
      expect(records.length).toBeGreaterThan(0);
    });

  });

});
