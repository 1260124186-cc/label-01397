/**
 * marketingAnalytics 营销分析模块单元测试
 * 测试功能：
 * 1. parseScene - 解析 scene 参数
 * 2. 埋点事件追踪
 * 3. 常量定义
 */

const marketingAnalytics = require('../utils/marketingAnalytics.js');
const mockData = require('../utils/mockData.js');

const mockStorage = {};
global.wx = {
  getStorageSync: jest.fn((key) => mockStorage[key] || null),
  setStorageSync: jest.fn((key, value) => { mockStorage[key] = value; })
};

jest.mock('../utils/userStore.js', () => ({
  getPrivacySettings: jest.fn(() => ({
    allowAnalyticsCollection: true
  }))
}));

describe('marketingAnalytics 模块测试', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.keys(mockStorage).forEach(key => delete mockStorage[key]);
  });

  describe('parseScene 函数测试', () => {
    test('应该能解析 JSON 格式的 scene', () => {
      const scene = JSON.stringify({
        campaignId: 'camp_001',
        channel: 'wechat_moments',
        dealerId: 'D001'
      });
      const result = marketingAnalytics.parseScene(scene);
      expect(result).not.toBeNull();
      expect(result.campaignId).toBe('camp_001');
      expect(result.channel).toBe('wechat_moments');
      expect(result.dealerId).toBe('D001');
    });

    test('应该能解析 URL 参数格式的 scene', () => {
      const scene = 'campaignId=camp_002&channel=douyin&dealerId=D002';
      const result = marketingAnalytics.parseScene(scene);
      expect(result).not.toBeNull();
      expect(result.campaignId).toBe('camp_002');
      expect(result.channel).toBe('douyin');
      expect(result.dealerId).toBe('D002');
    });

    test('应该能解析带下划线和已知渠道的 scene', () => {
      const scene = 'spring_promo_douyin_D003';
      const result = marketingAnalytics.parseScene(scene);
      expect(result).not.toBeNull();
      expect(result.channel).toBe('douyin');
      expect(result.dealerId).toBe('D003');
    });

    test('部分字段缺失时应该返回默认值', () => {
      const scene = 'campaignId=camp_004&channel=weibo';
      const result = marketingAnalytics.parseScene(scene);
      expect(result).not.toBeNull();
      expect(result.campaignId).toBe('camp_004');
      expect(result.channel).toBe('weibo');
      expect(typeof result.dealerId).toBe('string');
    });

    test('空字符串应该返回默认结构', () => {
      const result = marketingAnalytics.parseScene('');
      expect(result).toBeDefined();
      expect(typeof result.campaignId).toBe('string');
      expect(typeof result.channel).toBe('string');
    });

    test('无效格式应该返回默认结构', () => {
      const result = marketingAnalytics.parseScene('invalid_scene');
      expect(result).toBeDefined();
      expect(result.rawScene).toBe('invalid_scene');
    });

    test('应该能识别 qr_ 前缀的渠道', () => {
      const result = marketingAnalytics.parseScene('qr_test');
      expect(result).toBeDefined();
    });
  });

  describe('事件类型常量测试', () => {
    test('应该包含所有必要的事件类型', () => {
      const EVENT_TYPES = marketingAnalytics.EVENT_TYPES;
      expect(EVENT_TYPES).toBeDefined();
      expect(EVENT_TYPES.SCAN_SUCCESS).toBe('scan_success');
      expect(EVENT_TYPES.DETAIL_VIEW_DURATION).toBe('detail_view_duration');
      expect(EVENT_TYPES.CERT_SAVE).toBe('cert_save');
      expect(EVENT_TYPES.SHARE_CLICK).toBe('share_click');
      expect(EVENT_TYPES.SHOP_ADD_CART).toBe('shop_add_cart');
      expect(EVENT_TYPES.PAGE_VIEW).toBe('page_view');
    });
  });

  describe('漏斗步骤常量测试', () => {
    test('应该包含漏斗步骤数组', () => {
      const FUNNEL_STEPS = marketingAnalytics.FUNNEL_STEPS;
      expect(Array.isArray(FUNNEL_STEPS)).toBe(true);
      expect(FUNNEL_STEPS.length).toBeGreaterThan(0);
    });

    test('每个漏斗步骤应该包含必要字段', () => {
      const FUNNEL_STEPS = marketingAnalytics.FUNNEL_STEPS;
      FUNNEL_STEPS.forEach(step => {
        expect(step).toHaveProperty('key');
        expect(step).toHaveProperty('name');
        expect(step).toHaveProperty('event');
      });
    });
  });

  describe('渠道常量测试', () => {
    test('CHANNEL_TYPES 应该是对象', () => {
      const CHANNEL_TYPES = marketingAnalytics.CHANNEL_TYPES;
      expect(typeof CHANNEL_TYPES).toBe('object');
      expect(CHANNEL_TYPES.UNKNOWN).toBeDefined();
    });

    test('CHANNEL_LIST 应该是数组', () => {
      const CHANNEL_LIST = marketingAnalytics.CHANNEL_LIST;
      expect(Array.isArray(CHANNEL_LIST)).toBe(true);
      expect(CHANNEL_LIST.length).toBeGreaterThan(0);
    });

    test('每个渠道项应该包含必要字段', () => {
      const CHANNEL_LIST = marketingAnalytics.CHANNEL_LIST;
      CHANNEL_LIST.forEach(channel => {
        expect(channel).toHaveProperty('channel');
        expect(channel).toHaveProperty('name');
        expect(channel).toHaveProperty('icon');
      });
    });
  });

  describe('getCampaignList 函数测试', () => {
    test('应该返回营销活动列表', () => {
      const campaigns = marketingAnalytics.getCampaignList();
      expect(Array.isArray(campaigns)).toBe(true);
    });
  });

  describe('getCurrentAttribution 函数测试', () => {
    test('初始状态应该返回对象或 null', () => {
      const attribution = marketingAnalytics.getCurrentAttribution();
      expect(attribution !== undefined).toBe(true);
    });
  });

  describe('trackEvent 函数测试', () => {
    test('隐私开关关闭时不应该收集数据', () => {
      const userStore = require('../utils/userStore.js');
      userStore.getPrivacySettings.mockReturnValue({ allowAnalyticsCollection: false });

      const result = marketingAnalytics.trackEvent('test_event', { foo: 'bar' });
      expect(result).toBe(false);
    });

    test('隐私开关开启时应该收集数据', () => {
      const userStore = require('../utils/userStore.js');
      userStore.getPrivacySettings.mockReturnValue({ allowAnalyticsCollection: true });

      const result = marketingAnalytics.trackEvent('test_event', { foo: 'bar' });
      expect(result).toBe(true);
    });
  });
});
