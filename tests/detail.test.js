/**
 * detail.js 页面逻辑单元测试
 * 测试功能：
 * 1. loadTraceData - 加载溯源数据
 * 2. onPageScroll - 页面滚动事件
 * 3. scrollToTop - 返回顶部
 * 4. onPullDownRefresh - 下拉刷新
 * 5. toggleProcessStep - 点击工艺流程步骤
 * 6. showPdfReport - 显示PDF报告弹窗
 * 7. closePdfModal - 关闭PDF报告弹窗
 * 8. copyTraceId - 复制溯源ID
 * 9. onShareAppMessage - 分享功能
 * 10. 锚点 Tab 相关功能
 * 11. 模块折叠功能
 */

// 模拟微信小程序环境
global.Page = function(options) {
  global.pageInstance = options;
};

// 模拟 createSelectorQuery
const mockSelectorQuery = {
  select: jest.fn().mockReturnThis(),
  boundingClientRect: jest.fn().mockReturnThis(),
  selectViewport: jest.fn().mockReturnThis(),
  scrollOffset: jest.fn().mockReturnThis(),
  exec: jest.fn((callback) => {
    callback && callback([]);
  })
};

global.wx = {
  showLoading: jest.fn(),
  hideLoading: jest.fn(),
  showToast: jest.fn(),
  navigateBack: jest.fn(),
  navigateTo: jest.fn(),
  setNavigationBarTitle: jest.fn(),
  pageScrollTo: jest.fn(),
  setClipboardData: jest.fn(),
  stopPullDownRefresh: jest.fn(),
  createSelectorQuery: jest.fn(() => mockSelectorQuery)
};

// 模拟 mockData 模块
jest.mock('../utils/mockData.js', () => ({
  getTraceData: jest.fn(),
  validateTraceId: jest.fn(),
  getAvailableTraceIds: jest.fn(() => ['G001', 'G002']),
  getScentingComparison: jest.fn(),
  getOsmanthusVarietyConfig: jest.fn((variety) => {
    const map = {
      '金桂': { key: 'jin-gui', color: '#DAA520', icon: '🌼', description: '金桂飘香，色泽金黄，香气浓郁持久' },
      '银桂': { key: 'yin-gui', color: '#C0C0C0', icon: '🌸', description: '银桂清雅，花色银白，香气清幽绵长' },
      '丹桂': { key: 'dan-gui', color: '#CD5C5C', icon: '🌺', description: '丹桂馥郁，花色橙红，香气浓烈醇厚' },
      '四季桂': { key: 'si-ji-gui', color: '#90EE90', icon: '🍃', description: '四季桂常新，四季芬芳，香气清新淡雅' }
    };
    return map[variety] || map['金桂'];
  }),
  getAllVarieties: jest.fn(() => ['金桂', '银桂', '丹桂', '四季桂']),
  calculateTestPercent: jest.fn(() => 50),
  getBrewingInteractiveConfig: jest.fn(() => ({
    waterTempLevels: [
      { key: '80', label: '80℃', desc: '清香淡雅', icon: '🌿' },
      { key: '85', label: '85℃', desc: '花香馥郁', icon: '🌸', default: true },
      { key: '90', label: '90℃', desc: '醇厚浓郁', icon: '🍵' },
      { key: '95', label: '95℃', desc: '茶气强劲', icon: '🔥' }
    ],
    brewSteps: [
      { step: 1, name: '温杯', icon: '🫖', title: '温杯烫盏', desc: '用热水将茶具温热', detail: '1. 将热水倒入盖碗\n2. 轻轻旋转\n3. 倒掉水倒掉', duration: 30, tip: '温杯能让茶香更好地释放' },
      { step: 2, name: '投茶', icon: '🍃', title: '投茶入盏', desc: '投入适量桂花茶', detail: '1. 取适量干茶\n2. 拨入茶具中', duration: 20, tip: '推荐用量：每杯3-5克' },
      { step: 3, name: '注水', icon: '💧', title: '注水冲泡', desc: '注入适宜温度的热水', detail: '1. 水温85℃-90℃\n2. 沿杯壁注水', duration: 15, tip: '避免直接冲在茶叶上' },
      { step: 4, name: '出汤', icon: '🍵', title: '出汤品茗', desc: '浸泡后出汤品尝', detail: '1. 首泡约2分钟\n2. 可连续冲泡4-5次', duration: 120, tip: '桂花茶香气浓郁' }
    ],
    dosageConfig: {
      basePerCup: 3,
      tasteMultiplier: { light: 0.7, medium: 1.0, strong: 1.4 },
      tasteLabels: { light: '清淡', medium: '适中', strong: '浓郁' },
      maxPeople: 10,
      minPeople: 1
    }
  })),
  calculateTeaDosage: jest.fn((people, taste) => {
    const base = 3;
    const mult = { light: 0.7, medium: 1.0, strong: 1.4 };
    const m = mult[taste] || 1.0;
    const grams = Math.round(people * base * m * 10) / 10;
    return {
      people: people,
      taste: taste,
      tasteLabel: { light: '清淡', medium: '适中', strong: '浓郁' }[taste] || '适中',
      grams: grams,
      teaspoon: Math.round(grams / 3 * 10) / 10,
      suggestion: grams <= 5 ? '少量精品，品花香为主' :
                  grams <= 15 ? '适量冲泡，适合日常饮用' :
                  '多人共享，茶香四溢'
    };
  }),
  verifyBlockchainEvidence: jest.fn((txHash) => {
    if (!txHash) {
      return { success: false, message: '交易哈希不能为空' };
    }
    return {
      success: true,
      verified: true,
      txHash: txHash,
      chainName: '溯源链',
      chainId: 'trace-chain-mainnet-01',
      blockHeight: 1892347,
      timestamp: '2025-09-25 14:32:18',
      contractAddress: '0x1234abcd5678ef90abcdef1234567890abcdef12',
      nodeCount: 21,
      consensusType: 'PBFT',
      verifyTime: new Date().toLocaleString('zh-CN'),
      traceId: 'G001',
      productName: '金桂花茶',
      batchNo: 'GH202503',
      onChainFieldsCount: 3,
      scanRecords: { totalQueryCount: 128, records: [] }
    };
  }),
  recordAntiCounterfeitingScan: jest.fn((traceId, scanInfo) => {
    if (!traceId) {
      return { success: false, message: '无效的溯源码' };
    }
    return {
      success: true,
      isFirstScan: false,
      totalQueryCount: 129,
      currentRecord: { time: new Date().toLocaleString('zh-CN'), type: 'repeat', location: '当前位置' },
      firstScanTime: '2025-09-26 09:15:32',
      lastScanTime: new Date().toLocaleString('zh-CN'),
      traceId: traceId,
      productName: '金桂花茶'
    };
  }),
  getTsaCertificate: jest.fn((traceId) => {
    if (!traceId) return null;
    return {
      issuer: '中国电子认证服务产业联盟',
      tsServer: 'TSA-2025-CN-JUDICIAL-001',
      certSerial: 'TSA-CERT-2025-0925-001',
      algorithm: 'SM2',
      timestamp: '2025-09-25 14:32:18.456+08:00',
      accuracy: '0.001s',
      tsTokenHash: 'a7f3b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0',
      evidenceHash: 'e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1',
      legalBasis: '《中华人民共和国电子签名法》第十三条',
      validityPeriod: '2025-01-01 至 2030-12-31',
      chainName: '溯源链',
      txHash: '0x8f9a3b7c4d5e6f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5',
      productName: '金桂花茶',
      batchNo: 'GH202503'
    };
  }),
  mockTraceData: {
    'G001': {
      basicInfo: { productName: '金桂花茶', thumbnail: '' },
      treeAge: { teaTreeAge: 200, osmanthusTreeAge: 50 },
      osmanthusInfo: { variety: '金桂' },
      scentingProcess: {
        scentingTimes: 5,
        processSteps: [
          { step: 1, name: '备料', icon: '📦', desc: '准备茶坯和鲜花', mediaType: 'image', mediaUrl: 'https://example.com/1.jpg' },
          { step: 2, name: '窨花', icon: '🌸', desc: '茶花混合窨制', mediaType: 'video', mediaUrl: 'https://example.com/2.mp4' },
          { step: 3, name: '通花', icon: '🔄', desc: '翻动散热', mediaType: 'image', mediaUrl: 'https://example.com/3.jpg' },
          { step: 4, name: '起花', icon: '⚖️', desc: '筛出花渣', mediaType: 'image', mediaUrl: 'https://example.com/4.jpg' },
          { step: 5, name: '烘焙', icon: '🔥', desc: '低温烘干', mediaType: 'video', mediaUrl: 'https://example.com/5.mp4' },
          { step: 6, name: '提花', icon: '✨', desc: '最后一次窨制', mediaType: 'image', mediaUrl: 'https://example.com/6.jpg' }
        ],
        scentingRecords: [
          { round: 1, duration: 5, temperature: 30, operator: '李师傅', timestamp: '2025-09-12 08:00:00', humidity: 72, note: '头窨，花香浓郁' },
          { round: 2, duration: 5, temperature: 29, operator: '李师傅', timestamp: '2025-09-13 08:00:00', humidity: 70, note: '二窨，香气深入' },
          { round: 3, duration: 5, temperature: 28, operator: '王师傅', timestamp: '2025-09-14 08:00:00', humidity: 68, note: '三窨，香气醇厚' },
          { round: 4, duration: 5, temperature: 28, operator: '李师傅', timestamp: '2025-09-15 08:00:00', humidity: 65, note: '四窨，香气持久' },
          { round: 5, duration: 5, temperature: 29, operator: '王师傅', timestamp: '2025-09-16 08:00:00', humidity: 62, note: '五窨，提花收尾' }
        ]
      },
      greenTrace: { ecoPlanting: {}, ecoPacking: {}, ecoLogistics: {} },
      pesticideTest: { teaTests: [], osmanthusTests: [] },
      brewingGuide: { tips: [] },
      blockchainInfo: {
        chainName: '溯源链',
        chainId: 'trace-chain-mainnet-01',
        blockHeight: 1892347,
        txHash: '0x8f9a3b7c4d5e6f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5',
        txHashShort: '0x8f9a3b...c7d2e1',
        timestamp: '2025-09-25 14:32:18',
        verifyStatus: '已验证',
        contractAddress: '0x1234abcd5678ef90abcdef1234567890abcdef12',
        nodeCount: 21,
        consensusType: 'PBFT',
        onChainFields: [
          { key: 'batchNo', label: '批次号', value: 'GH202503', onChain: true },
          { key: 'testReport', label: '检测报告编号', value: 'NTQC-2025-09876', onChain: true },
          { key: 'productionTime', label: '出厂时间', value: '2025年9月25日', onChain: true }
        ],
        blockExplorerUrl: 'https://explorer.tracechain.cn/tx/0x8f9a3b7c4d5e6f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5',
        scanRecords: {
          totalQueryCount: 128,
          firstScanTime: '2025-09-26 09:15:32',
          lastScanTime: '2025-12-10 18:22:45',
          records: [
            { time: '2025-09-26 09:15:32', type: 'first', location: '湖北咸宁', ip: '119.96.xx.xx' },
            { time: '2025-10-03 14:08:19', type: 'repeat', location: '北京朝阳', ip: '123.125.xx.xx' }
          ]
        },
        tsaCertificate: {
          issuer: '中国电子认证服务产业联盟',
          tsServer: 'TSA-2025-CN-JUDICIAL-001',
          certSerial: 'TSA-CERT-2025-0925-001',
          algorithm: 'SM2',
          timestamp: '2025-09-25 14:32:18.456+08:00',
          accuracy: '0.001s',
          tsTokenHash: 'a7f3b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0',
          evidenceHash: 'e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1',
          legalBasis: '《中华人民共和国电子签名法》第十三条',
          validityPeriod: '2025-01-01 至 2030-12-31',
          verifyUrl: 'https://tsa.cfca.com.cn/verify?sn=TSA-CERT-2025-0925-001'
        }
      },
      images: {
        originImage: '',
        processImage: '',
        certImage: '',
        teaOriginImage: '',
        osmanthusOriginImage: ''
      }
    },
    'G002': {
      basicInfo: { productName: '银桂花茶', thumbnail: '' },
      treeAge: { teaTreeAge: 120, osmanthusTreeAge: 20 },
      osmanthusInfo: { variety: '银桂' },
      scentingProcess: {
        scentingTimes: 3,
        processSteps: [
          { step: 1, name: '备料', icon: '📦', desc: '准备茶坯和鲜花', mediaType: 'image', mediaUrl: 'https://example.com/1.jpg' },
          { step: 2, name: '窨花', icon: '🌸', desc: '茶花混合窨制', mediaType: 'image', mediaUrl: 'https://example.com/2.jpg' },
          { step: 3, name: '通花', icon: '🔄', desc: '翻动散热', mediaType: 'image', mediaUrl: 'https://example.com/3.jpg' },
          { step: 4, name: '起花', icon: '⚖️', desc: '筛出花渣', mediaType: 'image', mediaUrl: 'https://example.com/4.jpg' },
          { step: 5, name: '烘焙', icon: '🔥', desc: '低温烘干', mediaType: 'image', mediaUrl: 'https://example.com/5.jpg' },
          { step: 6, name: '提花', icon: '✨', desc: '最后一次窨制', mediaType: 'image', mediaUrl: 'https://example.com/6.jpg' }
        ],
        scentingRecords: [
          { round: 1, duration: 6, temperature: 28, operator: '张师傅', timestamp: '2025-09-12 08:00:00', humidity: 70, note: '头窨，清香淡雅' },
          { round: 2, duration: 6, temperature: 27, operator: '张师傅', timestamp: '2025-09-13 08:00:00', humidity: 68, note: '二窨，香气适中' },
          { round: 3, duration: 6, temperature: 26, operator: '张师傅', timestamp: '2025-09-14 08:00:00', humidity: 65, note: '三窨，提花收尾' }
        ]
      },
      greenTrace: { ecoPlanting: {}, ecoPacking: {}, ecoLogistics: {} },
      pesticideTest: { teaTests: [], osmanthusTests: [] },
      brewingGuide: { tips: [] },
      blockchainInfo: {
        chainName: '溯源链',
        chainId: 'trace-chain-mainnet-01',
        blockHeight: 1895123,
        txHash: '0x2e7c4a9b8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1',
        txHashShort: '0x2e7c4a...f8b9d3',
        timestamp: '2025-09-30 10:15:42',
        verifyStatus: '已验证',
        contractAddress: '0x1234abcd5678ef90abcdef1234567890abcdef12',
        nodeCount: 21,
        consensusType: 'PBFT',
        onChainFields: [],
        blockExplorerUrl: 'https://explorer.tracechain.cn/tx/0x2e7c4a9b8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1',
        scanRecords: {
          totalQueryCount: 56,
          firstScanTime: '2025-10-01 16:42:08',
          lastScanTime: '2025-12-08 09:15:33',
          records: []
        },
        tsaCertificate: {
          issuer: '中国电子认证服务产业联盟',
          certSerial: 'TSA-CERT-2025-0930-002',
          algorithm: 'SM2'
        }
      },
      images: {
        originImage: '',
        processImage: '',
        certImage: '',
        teaOriginImage: '',
        osmanthusOriginImage: ''
      }
    }
  },
  getInviteRewardConfig: jest.fn(() => ({
    inviterPoints: 100,
    inviteePoints: 50,
    inviterCoupon: { name: '邀请好友专属券', type: 'cash', value: 20, minAmount: 100 },
    inviteeCoupon: { name: '新用户专属券', type: 'cash', value: 15, minAmount: 80 },
    maxDailyInvites: 10,
    rules: ['分享邀请码卡片', '好友扫码完成溯源', '自动发放奖励', '每日上限10次']
  })),
  getAvailableCoupons: jest.fn(() => [
    { id: 'C001', name: '新人首单券', type: 'cash', value: 15, minAmount: 80, validityDays: 30, applicable: ['全部产品'] },
    { id: 'C002', name: '满减优惠券', type: 'cash', value: 30, minAmount: 200, validityDays: 60, applicable: ['全部产品'] },
    { id: 'C003', name: '桂花茶专享券', type: 'cash', value: 25, minAmount: 150, validityDays: 45, applicable: ['桂花茶系列'] },
    { id: 'C004', name: '品鉴装尝鲜券', type: 'discount', value: 0.8, minAmount: 50, validityDays: 15, applicable: ['品鉴装系列'] },
    { id: 'C005', name: '老顾客回馈券', type: 'cash', value: 50, minAmount: 300, validityDays: 90, applicable: ['全部产品'] }
  ]),
  getShareThemeConfig: jest.fn(() => ({
    shareCardTitle: '桂花茶 · 溯源品质',
    shareCardSubtitle: '金桂飘香 · 一品好茶',
    inviteTitle: '邀请好友查溯源',
    inviteSubtitle: '扫码查看全链路溯源信息，邀请双方得积分好礼！',
    certTitle: '产品溯源证书',
    certSubtitle: '区块链存证 · 不可篡改',
    shareSlogans: [
      '来自桂花之乡的问候',
      '古法窨制 · 匠心传承',
      '每一片茶叶都有故事'
    ]
  }))
}));

const mockData = require('../utils/mockData.js');

// 加载 detail.js
require('../pages/detail/detail.js');

describe('detail.js 页面逻辑测试', () => {
  let page;

  beforeEach(() => {
    // 重置所有 mock
    jest.clearAllMocks();

    // 创建页面实例
    page = Object.create(global.pageInstance);
    page.data = {
      traceId: '',
      traceData: null,
      loading: true,
      skeletonLoading: true,
      showBackTop: false,
      activeProcessStep: -1,
      showPdfModal: false,
      scrollTop: 0,
      readingProgress: 0,
      anchorTabs: [],
      activeAnchor: 'basic',
      anchorSticky: false,
      moduleCollapsed: {},
      lazyImageMap: {},
      activeProcessTab: 'records',
      activeScentingRecord: 0,
      timelinePlaying: false,
      timelineActiveStep: -1,
      timelineSpeed: 2000,
      processComparisonData: null,
      showRecordDetailModal: false,
      selectedRecordDetail: null
    };

    // 模拟 setData 方法
    page.setData = jest.fn((newData, callback) => {
      Object.assign(page.data, newData);
      if (callback) callback();
    });
  });

  describe('onLoad 函数测试', () => {
    test('应该能正确加载带有 traceId 的页面', () => {
      page.loadTraceData = jest.fn();
      page.onLoad({ traceId: 'G001' });
      expect(page.setData).toHaveBeenCalledWith({ traceId: 'G001' });
      expect(page.loadTraceData).toHaveBeenCalledWith('G001');
    });

    test('对于没有 traceId 的页面应该显示错误并返回', (done) => {
      page.onLoad({});
      expect(wx.showToast).toHaveBeenCalledWith({
        title: '参数错误',
        icon: 'none'
      });

      setTimeout(() => {
        expect(wx.navigateBack).toHaveBeenCalled();
        done();
      }, 2000);
    });
  });

  describe('loadTraceData 函数测试', () => {
    test('应该能正确加载溯源数据', (done) => {
      const mockTraceData = {
        basicInfo: { productName: '金桂花茶', traceId: 'G001' },
        osmanthusInfo: { variety: '金桂' },
        treeAge: { teaTreeAge: 200, osmanthusTreeAge: 50 },
        images: {
          originImage: 'https://example.com/origin.jpg',
          teaOriginImage: 'https://example.com/tea.jpg',
          osmanthusOriginImage: 'https://example.com/osm.jpg',
          processImage: 'https://example.com/proc.jpg',
          certImage: 'https://example.com/cert.jpg'
        },
        pesticideTest: { items: [], hasAbnormal: false }
      };
      mockData.getTraceData.mockReturnValue(mockTraceData);

      page.loadTraceData('G001');

      setTimeout(() => {
        expect(page.setData).toHaveBeenCalledWith(expect.objectContaining({
          traceData: mockTraceData,
          loading: false,
          skeletonLoading: false
        }));
        expect(wx.setNavigationBarTitle).toHaveBeenCalledWith({
          title: '金桂花茶溯源'
        });
        done();
      }, 1500);
    }, 15000);

    test('对于不存在的溯源数据应该显示错误并返回', (done) => {
      mockData.getTraceData.mockReturnValue(null);

      page.loadTraceData('G999');

      setTimeout(() => {
        expect(wx.showToast).toHaveBeenCalledWith({
          title: '未找到溯源信息',
          icon: 'none'
        });

        setTimeout(() => {
          expect(wx.navigateBack).toHaveBeenCalled();
          done();
        }, 2000);
      }, 1000);
    });
  });

  describe('页面交互测试', () => {
    test('onPageScroll 应该能控制返回顶部按钮显示', () => {
      page.onPageScroll({ scrollTop: 200 });
      expect(page.setData).toHaveBeenCalled();
      expect(page.data.scrollTop).toBe(200);

      page.data.showBackTop = false;
      page.onPageScroll({ scrollTop: 400 });
      expect(page.data.showBackTop).toBe(true);
      expect(page.data.scrollTop).toBe(400);
    });

    test('scrollToTop 应该能滚动到顶部', () => {
      page.scrollToTop();
      expect(wx.pageScrollTo).toHaveBeenCalledWith({
        scrollTop: 0,
        duration: 300
      });
    });

    test('onPullDownRefresh 应该能重新加载数据', (done) => {
      page.data.traceId = 'G001';
      page.loadTraceData = jest.fn();

      page.onPullDownRefresh();

      expect(page.loadTraceData).toHaveBeenCalledWith('G001');

      setTimeout(() => {
        expect(wx.stopPullDownRefresh).toHaveBeenCalled();
        done();
      }, 1500);
    });
  });

  describe('工艺流程测试', () => {
    test('toggleProcessStep 应该能切换工艺步骤展开状态', () => {
      const e1 = { currentTarget: { dataset: { index: 0 } } };
      page.toggleProcessStep(e1);
      expect(page.setData).toHaveBeenCalledWith({ activeProcessStep: 0 });

      page.data.activeProcessStep = 0;
      const e2 = { currentTarget: { dataset: { index: 0 } } };
      page.toggleProcessStep(e2);
      expect(page.setData).toHaveBeenCalledWith({ activeProcessStep: -1 });

      page.data.activeProcessStep = 0;
      const e3 = { currentTarget: { dataset: { index: 1 } } };
      page.toggleProcessStep(e3);
      expect(page.setData).toHaveBeenCalledWith({ activeProcessStep: 1 });
    });
  });

  describe('PDF报告弹窗测试', () => {
    test('showPdfReport 应该能显示弹窗并保存滚动位置', () => {
      page.data.scrollTop = 500;
      page.showPdfReport();
      expect(page.savedScrollTop).toBe(500);
      expect(page.setData).toHaveBeenCalledWith({ showPdfModal: true });
    });

    test('closePdfModal 应该能关闭弹窗并恢复滚动位置', () => {
      page.savedScrollTop = 500;
      page.closePdfModal();
      expect(page.setData).toHaveBeenCalledWith({ showPdfModal: false }, expect.any(Function));

      expect(wx.pageScrollTo).toHaveBeenCalledWith({
        scrollTop: 500,
        duration: 0
      });
    });

    test('preventBubble 应该是一个空函数', () => {
      expect(page.preventBubble).toBeDefined();
      expect(() => page.preventBubble()).not.toThrow();
    });
  });

  describe('复制功能测试', () => {
    test('copyTraceId 应该能复制溯源ID', () => {
      page.data.traceId = 'G001';

      wx.setClipboardData.mockImplementation((options) => {
        if (options.success) options.success();
      });

      page.copyTraceId();

      expect(wx.setClipboardData).toHaveBeenCalled();
      const callArg = wx.setClipboardData.mock.calls[0][0];
      expect(callArg.data).toBe('G001');
      expect(callArg.success).toBeDefined();

      expect(wx.showToast).toHaveBeenCalledWith({
        title: '已复制溯源ID',
        icon: 'success',
        duration: 1500
      });
    });
  });

  describe('分享功能测试', () => {
    test('onShareAppMessage 应该返回直达详情页的分享路径', () => {
      page.data.traceId = 'G001';
      page.data.traceData = {
        basicInfo: { productName: '金桂花茶', thumbnail: '' }
      };

      const result = page.onShareAppMessage();

      expect(result.title).toBe('金桂花茶 - 扫码查看全链路溯源信息，邀请双方得积分好礼！');
      expect(result.path).toBe('/pages/detail/detail?traceId=G001&invite=1');
    });
  });

  describe('锚点 Tab 测试', () => {
    test('onAnchorTap 应该能触发激活状态更新', () => {
      const e = { currentTarget: { dataset: { key: 'treeAge', index: 1 } } };
      page.scrollToModule = jest.fn();
      page.onAnchorTap(e);
      expect(page.data.activeAnchor).toBe('treeAge');
    });

    test('toggleModule 应该能切换模块折叠状态', () => {
      page.data.moduleCollapsed = { basic: false };
      const e = { currentTarget: { dataset: { key: 'basic' } } };
      page.toggleModule(e);
      expect(page.setData).toHaveBeenCalledWith(
        expect.objectContaining({ 'moduleCollapsed.basic': true }),
        expect.any(Function)
      );
    });
  });

  describe('窨制工艺深化功能测试', () => {
    beforeEach(() => {
      page.data.traceData = mockData.mockTraceData['G001'];
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
      if (page.timelineTimer) {
        clearInterval(page.timelineTimer);
        page.timelineTimer = null;
      }
    });

    describe('工艺 Tab 切换测试', () => {
      test('switchProcessTab 应该能切换到 records Tab', () => {
        page.data.activeProcessTab = 'timeline';
        const e = { currentTarget: { dataset: { tab: 'records' } } };
        page.switchProcessTab(e);
        expect(page.data.activeProcessTab).toBe('records');
      });

      test('switchProcessTab 应该能切换到 timeline Tab', () => {
        page.data.activeProcessTab = 'records';
        const e = { currentTarget: { dataset: { tab: 'timeline' } } };
        page.switchProcessTab(e);
        expect(page.data.activeProcessTab).toBe('timeline');
      });

      test('switchProcessTab 切换到 comparison 时应加载对比数据', () => {
        page.loadProcessComparison = jest.fn();
        const e = { currentTarget: { dataset: { tab: 'comparison' } } };
        page.switchProcessTab(e);
        expect(page.data.activeProcessTab).toBe('comparison');
        expect(page.loadProcessComparison).toHaveBeenCalled();
      });

      test('switchProcessTab 切换到 timeline 时应重置动画状态', () => {
        page.resetTimelineAnimation = jest.fn();
        const e = { currentTarget: { dataset: { tab: 'timeline' } } };
        page.switchProcessTab(e);
        expect(page.resetTimelineAnimation).toHaveBeenCalled();
      });
    });

    describe('窨制记录选择测试', () => {
      test('selectScentingRecord 应该能选择指定记录', () => {
        const e = { currentTarget: { dataset: { index: 2 } } };
        page.selectScentingRecord(e);
        expect(page.data.activeScentingRecord).toBe(2);
      });

      test('selectScentingRecord 不应选择负数索引', () => {
        page.data.activeScentingRecord = 0;
        const e = { currentTarget: { dataset: { index: -1 } } };
        page.selectScentingRecord(e);
        expect(page.data.activeScentingRecord).toBe(0);
      });

      test('selectScentingRecord 不应选择超出范围的索引', () => {
        page.data.activeScentingRecord = 0;
        const e = { currentTarget: { dataset: { index: 10 } } };
        page.selectScentingRecord(e);
        expect(page.data.activeScentingRecord).toBe(0);
      });
    });

    describe('时间轴动画控制测试', () => {
      test('startTimelineAnimation 应该能开始自动播放', () => {
        page.startTimelineAnimation();
        expect(page.data.timelinePlaying).toBe(true);
        expect(page.data.timelineActiveStep).toBe(0);
        expect(page.timelineTimer).toBeDefined();
      });

      test('startTimelineAnimation 应该能循环播放', () => {
        page.startTimelineAnimation();
        const steps = page.data.traceData.scentingProcess.processSteps;
        const totalSteps = steps.length;

        expect(page.data.timelineActiveStep).toBe(0);

        for (let i = 1; i < totalSteps; i++) {
          jest.advanceTimersByTime(page.data.timelineSpeed);
          expect(page.data.timelineActiveStep).toBe(i);
        }

        jest.advanceTimersByTime(page.data.timelineSpeed);
        expect(page.data.timelineActiveStep).toBe(0);
        expect(page.data.timelinePlaying).toBe(true);

        jest.advanceTimersByTime(page.data.timelineSpeed);
        expect(page.data.timelineActiveStep).toBe(1);
      });

      test('pauseTimelineAnimation 应该能暂停动画', () => {
        page.startTimelineAnimation();
        page.pauseTimelineAnimation();
        expect(page.data.timelinePlaying).toBe(false);
        expect(page.timelineTimer).toBeNull();
      });

      test('pauseTimelineAnimation 在未播放时不应出错', () => {
        page.data.timelinePlaying = false;
        expect(() => page.pauseTimelineAnimation()).not.toThrow();
      });

      test('resetTimelineAnimation 应该能重置动画状态', () => {
        page.startTimelineAnimation();
        page.data.timelineActiveStep = 3;
        page.resetTimelineAnimation();
        expect(page.data.timelinePlaying).toBe(false);
        expect(page.data.timelineActiveStep).toBe(-1);
        expect(page.timelineTimer).toBeNull();
      });

      test('prevTimelineStep 应该能切换到上一步', () => {
        page.data.timelineActiveStep = 2;
        page.prevTimelineStep();
        expect(page.data.timelineActiveStep).toBe(1);
      });

      test('prevTimelineStep 在第一步时不应继续后退', () => {
        page.data.timelineActiveStep = 0;
        page.prevTimelineStep();
        expect(page.data.timelineActiveStep).toBe(0);
      });

      test('nextTimelineStep 应该能切换到下一步', () => {
        page.data.timelineActiveStep = 1;
        page.nextTimelineStep();
        expect(page.data.timelineActiveStep).toBe(2);
      });

      test('nextTimelineStep 在最后一步时不应继续前进', () => {
        const steps = page.data.traceData.scentingProcess.processSteps;
        page.data.timelineActiveStep = steps.length - 1;
        page.nextTimelineStep();
        expect(page.data.timelineActiveStep).toBe(steps.length - 1);
      });

      test('changeTimelineSpeed 应该能切换到慢速', () => {
        page.data.timelineSpeed = 2000;
        const e = { currentTarget: { dataset: { speed: 'slow' } } };
        page.changeTimelineSpeed(e);
        expect(page.data.timelineSpeed).toBe(3000);
      });

      test('changeTimelineSpeed 应该能切换到快速', () => {
        page.data.timelineSpeed = 2000;
        const e = { currentTarget: { dataset: { speed: 'fast' } } };
        page.changeTimelineSpeed(e);
        expect(page.data.timelineSpeed).toBe(1000);
      });

      test('changeTimelineSpeed 应该能切换到正常速度', () => {
        page.data.timelineSpeed = 1000;
        const e = { currentTarget: { dataset: { speed: 'normal' } } };
        page.changeTimelineSpeed(e);
        expect(page.data.timelineSpeed).toBe(2000);
      });

      test('changeTimelineSpeed 播放时切换速度应重启定时器', () => {
        page.startTimelineAnimation();
        const oldTimer = page.timelineTimer;
        const e = { currentTarget: { dataset: { speed: 'fast' } } };
        page.changeTimelineSpeed(e);
        expect(page.timelineTimer).not.toBe(oldTimer);
        expect(page.data.timelinePlaying).toBe(true);
      });

      test('onTimelineStepTap 应该能跳转到指定步骤', () => {
        const e = { currentTarget: { dataset: { index: 3 } } };
        page.onTimelineStepTap(e);
        expect(page.data.timelineActiveStep).toBe(3);
      });

      test('onTimelineStepTap 播放时点击应暂停', () => {
        page.startTimelineAnimation();
        const e = { currentTarget: { dataset: { index: 2 } } };
        page.onTimelineStepTap(e);
        expect(page.data.timelinePlaying).toBe(false);
        expect(page.data.timelineActiveStep).toBe(2);
      });
    });

    describe('工艺对比测试', () => {
      test('loadProcessComparison 应该能加载对比数据', () => {
        const mockComparison = {
          title: '金桂 vs 银桂 窨制工艺对比',
          summary: { golden: {}, silver: {} },
          comparisonItems: [],
          recordsComparison: { golden: [], silver: [] },
          differenceExplanation: '测试说明'
        };
        mockData.getScentingComparison.mockReturnValue(mockComparison);

        page.loadProcessComparison();

        expect(page.setData).toHaveBeenCalledWith({
          processComparisonData: mockComparison
        });
      });

      test('loadProcessComparison 已有数据时不应重复加载', () => {
        page.data.processComparisonData = { title: '已加载' };
        mockData.getScentingComparison.mockClear();

        page.loadProcessComparison();

        expect(mockData.getScentingComparison).not.toHaveBeenCalled();
      });
    });

    describe('记录详情弹窗测试', () => {
      test('viewScentingRecordDetail 应该能显示详情弹窗', () => {
        global.wx.showModal = jest.fn();
        const record = page.data.traceData.scentingProcess.scentingRecords[0];
        const e = { currentTarget: { dataset: { record: record } } };
        page.viewScentingRecordDetail(e);
        expect(wx.showModal).toHaveBeenCalled();
        const callArg = wx.showModal.mock.calls[0][0];
        expect(callArg.title).toContain('第1次窨制详情');
        expect(callArg.content).toContain('李师傅');
        expect(callArg.content).toContain('30');
      });
    });

    describe('工艺图片预览测试', () => {
      test('previewProcessImage 应该能预览图片', () => {
        global.wx.previewImage = jest.fn();
        const steps = page.data.traceData.scentingProcess.processSteps;
        const allUrls = steps.map(s => s.mediaUrl);
        const e = { currentTarget: { dataset: { url: allUrls[0] } } };
        page.previewProcessImage(e);
        expect(wx.previewImage).toHaveBeenCalledWith({
          urls: allUrls,
          current: allUrls[0]
        });
      });
    });

    describe('资源清理测试', () => {
      test('onUnload 应该能清除定时器', () => {
        page.startTimelineAnimation();
        expect(page.timelineTimer).toBeDefined();
        page.onUnload();
        expect(page.timelineTimer).toBeNull();
      });

      test('onUnload 在无定时器时不应出错', () => {
        page.timelineTimer = null;
        expect(() => page.onUnload()).not.toThrow();
      });
    });

    describe('区块链存证功能测试', () => {
      test('verifyBlockchainEvidence 应调用验证接口并设置验证结果', () => {
        jest.useFakeTimers();
        page.setData({ traceId: 'G001' });
        page.verifyBlockchainEvidence();

        expect(page.data.bcVerifying).toBe(true);
        jest.runAllTimers();

        expect(mockData.verifyBlockchainEvidence).toHaveBeenCalled();
        expect(page.data.bcVerifying).toBe(false);
        expect(page.data.bcShowVerifyResult).toBe(true);
        expect(page.data.bcVerifyResult).toBeDefined();
        expect(page.data.bcVerifyResult.verified).toBe(true);

        jest.useRealTimers();
      });

      test('verifyBlockchainEvidence 无存证信息时提示', () => {
        page.setData({ traceData: { blockchainInfo: null } });
        page.verifyBlockchainEvidence();
        expect(wx.showToast).toHaveBeenCalledWith({ title: '无存证信息', icon: 'none' });
      });

      test('copyTxHash 应调用剪贴板复制交易哈希', () => {
        page.setData({
          traceData: {
            blockchainInfo: {
              txHash: '0x8f9a3b7c4d5e6f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5'
            }
          }
        });
        page.copyTxHash();
        expect(wx.setClipboardData).toHaveBeenCalledWith({
          data: '0x8f9a3b7c4d5e6f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5',
          success: expect.any(Function)
        });
      });

      test('copyTxHash 无交易哈希时提示', () => {
        page.setData({ traceData: { blockchainInfo: {} } });
        page.copyTxHash();
        expect(wx.showToast).toHaveBeenCalledWith({ title: '无交易哈希', icon: 'none' });
      });

      test('toggleTxHashDisplay 应切换哈希显示状态', () => {
        page.setData({ bcShowTxHashFull: false });
        page.toggleTxHashDisplay();
        expect(page.data.bcShowTxHashFull).toBe(true);
        page.toggleTxHashDisplay();
        expect(page.data.bcShowTxHashFull).toBe(false);
      });

      test('openBlockExplorer 应跳转webview页面', () => {
        const url = 'https://explorer.tracechain.cn/tx/0xabc';
        page.setData({
          traceData: {
            blockchainInfo: { blockExplorerUrl: url }
          }
        });
        page.openBlockExplorer();
        expect(wx.navigateTo).toHaveBeenCalledWith({
          url: '/pages/webview/webview?url=' + encodeURIComponent(url) + '&title=区块浏览器'
        });
      });

      test('openBlockExplorer 无浏览器链接时提示', () => {
        page.setData({ traceData: { blockchainInfo: {} } });
        page.openBlockExplorer();
        expect(wx.showToast).toHaveBeenCalledWith({ title: '无浏览器链接', icon: 'none' });
      });

      test('toggleScanRecords 应切换扫码记录显示', () => {
        page.setData({ traceId: 'G001', bcShowScanRecords: false });
        page.toggleScanRecords();
        expect(page.data.bcShowScanRecords).toBe(true);
        expect(mockData.recordAntiCounterfeitingScan).toHaveBeenCalledWith('G001', expect.objectContaining({
          location: expect.any(String)
        }));
        expect(page.data.bcAntiCounterResult).toBeDefined();
        expect(page.data.bcAntiCounterResult.success).toBe(true);
      });

      test('toggleTsaCertificate 应切换TSA证书显示', () => {
        page.setData({ traceId: 'G001', bcShowTsaCert: false });
        page.toggleTsaCertificate();
        expect(page.data.bcShowTsaCert).toBe(true);
        expect(mockData.getTsaCertificate).toHaveBeenCalledWith('G001');
        expect(page.data.bcTsaCertData).toBeDefined();
        expect(page.data.bcTsaCertData.certSerial).toBe('TSA-CERT-2025-0925-001');
      });

      test('copyTsaCertSerial 应复制证书编号', () => {
        page.setData({
          bcTsaCertData: { certSerial: 'TSA-CERT-2025-0925-001' }
        });
        page.copyTsaCertSerial();
        expect(wx.setClipboardData).toHaveBeenCalledWith({
          data: 'TSA-CERT-2025-0925-001',
          success: expect.any(Function)
        });
      });

      test('closeBlockchainVerifyResult 应关闭验证结果', () => {
        page.setData({ bcShowVerifyResult: true });
        page.closeBlockchainVerifyResult();
        expect(page.data.bcShowVerifyResult).toBe(false);
      });

      test('区块链数据应包含完整字段', () => {
        const bc = page.data.traceData && page.data.traceData.blockchainInfo;
        if (bc) {
          expect(bc.chainName).toBeDefined();
          expect(bc.txHash).toBeDefined();
          expect(bc.blockHeight).toBeDefined();
          expect(bc.timestamp).toBeDefined();
          expect(bc.onChainFields).toBeDefined();
          expect(Array.isArray(bc.onChainFields)).toBe(true);
          expect(bc.scanRecords).toBeDefined();
          expect(bc.tsaCertificate).toBeDefined();
        }
      });
    });
  });
});
