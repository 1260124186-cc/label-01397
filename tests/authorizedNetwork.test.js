const authorizedNetwork = require('../utils/authorizedNetwork.js');
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
  openLocation: jest.fn(),
  scanCode: jest.fn(),
  getLocation: jest.fn()
};

describe('授权合作网点模块测试', () => {

  beforeEach(() => {
    storageStore = {};
    wx.getStorageSync.mockClear();
    wx.setStorageSync.mockClear();
    wx.showToast.mockClear();
  });

  describe('网点类型配置', () => {

    test('获取酒店类型信息', () => {
      const info = authorizedNetwork.getStoreTypeInfo('hotel');
      expect(info).toBeDefined();
      expect(info.key).toBe('hotel');
      expect(info.label).toBe('酒店');
      expect(info.icon).toBe('🏨');
    });

    test('获取茶馆类型信息', () => {
      const info = authorizedNetwork.getStoreTypeInfo('tea_house');
      expect(info).toBeDefined();
      expect(info.key).toBe('tea_house');
      expect(info.label).toBe('茶馆');
    });

    test('获取机场贵宾厅类型信息', () => {
      const info = authorizedNetwork.getStoreTypeInfo('airport_vip');
      expect(info).toBeDefined();
      expect(info.key).toBe('airport_vip');
      expect(info.label).toBe('机场贵宾厅');
    });

    test('无效类型返回null', () => {
      const info = authorizedNetwork.getStoreTypeInfo('invalid');
      expect(info).toBeNull();
    });

    test('获取所有网点类型', () => {
      const types = authorizedNetwork.getAllStoreTypes();
      expect(types.length).toBe(3);
      expect(types[0].key).toBe('hotel');
      expect(types[1].key).toBe('tea_house');
      expect(types[2].key).toBe('airport_vip');
    });

  });

  describe('网点数据获取', () => {

    test('获取所有授权网点', () => {
      const stores = authorizedNetwork.getAuthorizedStores();
      expect(Array.isArray(stores)).toBe(true);
      expect(stores.length).toBeGreaterThan(0);
    });

    test('网点数据包含必要字段', () => {
      const stores = authorizedNetwork.getAuthorizedStores();
      const store = stores[0];
      expect(store.id).toBeDefined();
      expect(store.name).toBeDefined();
      expect(store.type).toBeDefined();
      expect(store.storeCode).toBeDefined();
      expect(store.address).toBeDefined();
      expect(store.lat).toBeDefined();
      expect(store.lng).toBeDefined();
      expect(store.businessHours).toBeDefined();
      expect(store.supplyBatchRange).toBeDefined();
      expect(Array.isArray(store.supplyBatchRange)).toBe(true);
    });

    test('通过ID获取网点', () => {
      const store = authorizedNetwork.getStoreById('AN-HOTEL-001');
      expect(store).toBeDefined();
      expect(store.name).toBe('武汉光谷希尔顿酒店');
      expect(store.type).toBe('hotel');
    });

    test('不存在的ID返回null', () => {
      const store = authorizedNetwork.getStoreById('NOT-EXIST');
      expect(store).toBeNull();
    });

    test('通过门店码获取网点', () => {
      const store = authorizedNetwork.getStoreByStoreCode('S-HBWH-001');
      expect(store).toBeDefined();
      expect(store.name).toBe('武汉光谷希尔顿酒店');
    });

    test('非S-开头的门店码返回null', () => {
      const store = authorizedNetwork.getStoreByStoreCode('INVALID');
      expect(store).toBeNull();
    });

    test('空门店码返回null', () => {
      const store = authorizedNetwork.getStoreByStoreCode('');
      expect(store).toBeNull();
    });

  });

  describe('网点搜索与筛选', () => {

    test('按关键字搜索网点', () => {
      const results = authorizedNetwork.searchStores('茶馆');
      expect(results.length).toBeGreaterThan(0);
    });

    test('按类型筛选网点', () => {
      const hotels = authorizedNetwork.searchStores(null, 'hotel');
      expect(hotels.length).toBeGreaterThan(0);
      hotels.forEach(function(s) {
        expect(s.type).toBe('hotel');
      });
    });

    test('按城市筛选网点', () => {
      const wuhanStores = authorizedNetwork.searchStores(null, null, '武汉');
      expect(wuhanStores.length).toBeGreaterThan(0);
      wuhanStores.forEach(function(s) {
        expect(s.city).toContain('武汉');
      });
    });

    test('组合筛选', () => {
      const results = authorizedNetwork.searchStores('希尔顿', 'hotel', '武汉');
      expect(results.length).toBeGreaterThan(0);
    });

    test('无匹配结果返回空数组', () => {
      const results = authorizedNetwork.searchStores('不存在的网点名称xyz');
      expect(results.length).toBe(0);
    });

  });

  describe('附近网点计算', () => {

    test('计算距离', () => {
      const dist = authorizedNetwork.calculateDistance(30.5, 114.3, 30.6, 114.4);
      expect(dist).toBeGreaterThan(0);
      expect(dist).toBeLessThan(100);
    });

    test('获取附近网点', () => {
      const nearby = authorizedNetwork.getNearbyStores(30.5, 114.3, 500);
      expect(Array.isArray(nearby)).toBe(true);
      if (nearby.length > 0) {
        expect(nearby[0].distance).toBeDefined();
        expect(nearby[0].distanceText).toBeDefined();
      }
    });

    test('距离格式化 - 小于1km', () => {
      const text = authorizedNetwork.formatDistance(0.5);
      expect(text).toContain('m');
    });

    test('距离格式化 - 大于1km', () => {
      const text = authorizedNetwork.formatDistance(12.5);
      expect(text).toContain('km');
    });

  });

  describe('地图标记生成', () => {

    test('生成地图标记数据', () => {
      const stores = authorizedNetwork.getAuthorizedStores();
      const markers = authorizedNetwork.getStoresForMap(stores);
      expect(markers.length).toBe(stores.length);
      expect(markers[0].latitude).toBeDefined();
      expect(markers[0].longitude).toBeDefined();
      expect(markers[0].title).toBeDefined();
      expect(markers[0].callout).toBeDefined();
    });

  });

  describe('门店码验证', () => {

    test('验证有效的门店码', () => {
      const result = authorizedNetwork.verifyStoreSupply('S-HBWH-001');
      expect(result.success).toBe(true);
      expect(result.store).toBeDefined();
      expect(result.store.name).toBe('武汉光谷希尔顿酒店');
    });

    test('验证无效的门店码', () => {
      const result = authorizedNetwork.verifyStoreSupply('S-INVALID');
      expect(result.success).toBe(false);
    });

    test('验证非S-开头的码', () => {
      const result = authorizedNetwork.verifyStoreSupply('INVALID');
      expect(result.success).toBe(false);
    });

    test('门店码与溯源码联合验证', () => {
      const result = authorizedNetwork.verifyStoreCodeAndTrace('S-HBWH-001', 'G001');
      expect(result).toBeDefined();
      expect(result.store).toBeDefined();
    });

  });

  describe('授权状态判断', () => {

    test('获取授权状态 - 有效网点', () => {
      const stores = authorizedNetwork.getAuthorizedStores();
      const validStore = stores.find(function(s) {
        return new Date(s.authorizationExpiry).getTime() > Date.now();
      });
      if (validStore) {
        const status = authorizedNetwork.getAuthorizationStatus(validStore);
        expect(status.key).toBe('verified');
      }
    });

    test('获取授权展示信息', () => {
      const store = authorizedNetwork.getStoreById('AN-HOTEL-001');
      const display = authorizedNetwork.getAuthorizationDisplay(store);
      expect(display).toBeDefined();
      expect(display.status).toBeDefined();
      expect(display.isAuthorized).toBeDefined();
      expect(display.authorizationLabel).toBeDefined();
      expect(display.complementaryTip).toBeDefined();
    });

    test('空网点返回未授权状态', () => {
      const status = authorizedNetwork.getAuthorizationStatus(null);
      expect(status.key).toBe('unauthorized');
    });

  });

  describe('网点评价', () => {

    test('提交网点评价', () => {
      const result = authorizedNetwork.submitStoreReview('AN-HOTEL-001', {
        userId: 'test_user_001',
        userName: '测试用户',
        rating: 5,
        content: '环境很好，茶艺师手法专业',
        tags: ['环境优雅'],
        isVerifiedPurchase: true
      });
      expect(result.success).toBe(true);
      expect(result.review).toBeDefined();
      expect(result.review.rating).toBe(5);
    });

    test('评价内容太短', () => {
      const result = authorizedNetwork.submitStoreReview('AN-HOTEL-001', {
        userId: 'test_user_002',
        rating: 5,
        content: '短'
      });
      expect(result.success).toBe(false);
      expect(result.error).toContain('5');
    });

    test('评价评分无效', () => {
      const result = authorizedNetwork.submitStoreReview('AN-HOTEL-001', {
        userId: 'test_user_003',
        rating: 0,
        content: '这是一个测试评价内容'
      });
      expect(result.success).toBe(false);
    });

    test('重复评价被拒绝', () => {
      authorizedNetwork.submitStoreReview('AN-HOTEL-001', {
        userId: 'test_dup_user',
        rating: 4,
        content: '第一次评价测试内容'
      });
      const result = authorizedNetwork.submitStoreReview('AN-HOTEL-001', {
        userId: 'test_dup_user',
        rating: 3,
        content: '第二次评价测试内容'
      });
      expect(result.success).toBe(false);
    });

    test('点赞评价', () => {
      const submitResult = authorizedNetwork.submitStoreReview('AN-HOTEL-001', {
        userId: 'test_like_user',
        rating: 5,
        content: '测试点赞的评价内容'
      });
      if (submitResult.success) {
        const likeResult = authorizedNetwork.likeStoreReview('AN-HOTEL-001', submitResult.review.id);
        expect(likeResult.success).toBe(true);
      }
    });

    test('获取评分汇总', () => {
      const summary = authorizedNetwork.getStoreRatingSummary('AN-HOTEL-001');
      expect(summary).toBeDefined();
      expect(summary.averageRating).toBeDefined();
      expect(summary.totalReviews).toBeDefined();
      expect(summary.ratingDistribution).toBeDefined();
    });

  });

  describe('城市与统计', () => {

    test('获取城市列表', () => {
      const cities = authorizedNetwork.getCityList();
      expect(Array.isArray(cities)).toBe(true);
      expect(cities.length).toBeGreaterThan(0);
      expect(cities[0].name).toBeDefined();
      expect(cities[0].count).toBeDefined();
    });

    test('获取统计概览', () => {
      const stats = authorizedNetwork.getStatsSummary();
      expect(stats).toBeDefined();
      expect(stats.totalStores).toBeGreaterThan(0);
      expect(stats.authorizedCount).toBeDefined();
      expect(stats.typeCount).toBeDefined();
      expect(stats.cityCount).toBeDefined();
    });

  });

  describe('导航功能', () => {

    test('打开网点导航', () => {
      const store = authorizedNetwork.getStoreById('AN-HOTEL-001');
      authorizedNetwork.openStoreNavigation(store);
      expect(wx.openLocation).toHaveBeenCalled();
    });

    test('空网点不打开导航', () => {
      authorizedNetwork.openStoreNavigation(null);
      expect(wx.openLocation).not.toHaveBeenCalled();
    });

  });

  describe('channelTrace 互补逻辑', () => {

    test('授权网点正向展示 - 不在窜货告警中', () => {
      const store = authorizedNetwork.getStoreById('AN-TEA-001');
      const display = authorizedNetwork.getAuthorizationDisplay(store);
      expect(display.isAuthorized).toBe(true);
      expect(display.complementaryTip).toContain('官方授权');
    });

    test('授权展示提供互补提示', () => {
      const store = authorizedNetwork.getStoreById('AN-HOTEL-001');
      const display = authorizedNetwork.getAuthorizationDisplay(store);
      expect(display.complementaryTip).toBeDefined();
      if (display.isAuthorized) {
        expect(display.complementaryTip).toContain('品牌官方授权');
      }
    });

  });

});
