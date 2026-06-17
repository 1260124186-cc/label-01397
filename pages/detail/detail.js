/**
 * 桂花茶溯源小程序 - 溯源详情页
 * 功能：展示完整溯源信息（基础信息、树龄、窨制工艺、绿色溯源、农残检测等）
 * 页面路径：pages/detail/detail
 */

// 引入模拟数据模块
const mockData = require('../../utils/mockData.js');
const shareUtil = require('../../utils/share.js');
const i18n = require('../../utils/i18n/index.js');
const shop = require('../../utils/shop.js');
const subscription = require('../../utils/subscription.js');
const greenPoints = require('../../utils/greenPoints.js');
const auth = require('../../utils/auth.js');

// 锚点 Tab 配置（将在运行时根据语言填充 label）
const ANCHOR_TABS_BASE = [
  { key: 'basic', icon: '📋', i18nKey: 'detail.tabs.basic' },
  { key: 'treeAge', icon: '🌳', i18nKey: 'detail.tabs.treeAge' },
  { key: 'location', icon: '📍', i18nKey: 'detail.tabs.location' },
  { key: 'process', icon: '🫖', i18nKey: 'detail.tabs.process' },
  { key: 'green', icon: '♻️', i18nKey: 'detail.tabs.green' },
  { key: 'test', icon: '🔬', i18nKey: 'detail.tabs.test' },
  { key: 'brew', icon: '☕', i18nKey: 'detail.tabs.brew' },
  { key: 'blockchain', icon: '🔗', i18nKey: 'detail.tabs.blockchain' }
];

// 核心模块（默认展开）
const CORE_MODULES = ['treeAge', 'process', 'green'];

/** 根据当前语言生成带标签的 Tab 列表 */
function buildAnchorTabs() {
  return ANCHOR_TABS_BASE.map(item => ({
    key: item.key,
    icon: item.icon,
    label: i18n.t(item.i18nKey)
  }));
}

Page({
  /**
   * 页面数据
   */
  data: {
    // 溯源ID
    traceId: '',
    // 溯源数据对象
    traceData: null,
    // 页面加载状态
    loading: true,
    // 骨架屏显示状态
    skeletonLoading: true,

    // ===== 多语言与无障碍 =====
    currentLang: i18n.LANG_ZH,
    currentFontSize: i18n.FONT_NORMAL,
    currentColorWeak: false,
    a11yClasses: 'font-normal',
    // i18n 文本
    i18n: {
      overallStatusPass: '',
      overallStatusFail: '',
      tabTitleBasic: '',
      tabTitleTreeAge: '',
      tabTitleProcess: '',
      tabTitleTest: '',
      testPassLabel: '',
      testFailLabel: '',
      gbLimitLabel: '',
      measuredValueLabel: '',
      levelExcellent: '',
      levelGood: '',
      levelWarning: '',
      levelDanger: '',
      backTop: '',
      shareBtn: '',
      pdfBtn: '',
      verifyBtn: '',
      loadingText: '',
      serviceBtn: ''
    },
    // 是否显示返回顶部按钮
    showBackTop: false,
    // 当前展开的工艺步骤索引
    activeProcessStep: -1,
    // 是否显示PDF报告弹窗
    showPdfModal: false,
    // 页面滚动位置
    scrollTop: 0,
    // 阅读进度 0-100
    readingProgress: 0,
    // 锚点 Tab 列表（运行时根据语言动态生成）
    anchorTabs: buildAnchorTabs(),
    // 当前激活的锚点
    activeAnchor: 'basic',
    // 锚点 Tab 是否吸顶
    anchorSticky: false,
    // 模块展开状态
    moduleCollapsed: {
      basic: false,
      treeAge: false,
      osmanthus: true,
      process: false,
      green: false,
      test: true,
      brew: true,
      blockchain: true
    },
    // 图片懒加载配置
    lazyImageMap: {},
    // 国标对比图表数据（含百分比）
    testChartData: {
      teaTests: [],
      osmanthusTests: [],
      overallPass: true
    },
    // 报告验真弹窗
    showVerifyModal: false,
    verifyInput: '',
    verifyResult: null,
    verifying: false,
    // 历史报告时间轴展开状态
    showHistoryTimeline: false,
    // 当前选中的历史报告
    activeHistoryIndex: 0,
    // 工艺模块当前Tab
    activeProcessTab: 'records',
    // 窨制记录当前选中索引
    activeScentingRecord: 0,
    // 时间轴动画控制
    timelinePlaying: false,
    timelineActiveStep: -1,
    timelineSpeed: 2000,
    // 工艺对比数据
    showProcessComparison: false,
    processComparisonData: null,

    // ========== 车间环境监测 ==========
    activeCurveTab: 'both',
    workshopCurveStats: null,

    // ========== 新增功能数据 ==========
    // 品种样式配置
    varietyStyle: null,
    // 照片轮播当前索引
    currentScenicIndex: 0,
    // 地图弹窗
    showMapCalloutModal: false,
    selectedMapMarker: null,
    // 地图模式（卫星/标准）
    mapLayerType: 'standard',
    // 树龄故事 Tab
    activeStoryTab: 'tea',
    // 历史记录类型图标映射
    historyTypeIconMap: {
      plant: '🌱',
      expand: '🏞️',
      survive: '⚔️',
      protect: '🛡️',
      heritage: '🏆',
      digital: '💾'
    },
    // 地图图例
    showMapLegend: true,

    // ========== 冲泡互动功能 ==========
    // 冲泡互动配置
    brewInteractiveConfig: null,

    // --- 冲泡计时器 ---
    selectedWaterTemp: '85',
    timerRunning: false,
    timerSeconds: 120,
    timerTotalSeconds: 120,
    timerProgress: 0,
    timerText: '02:00',

    // --- 分步冲泡向导 ---
    activeBrewStep: 0,
    brewStepTimerRunning: false,
    brewStepSeconds: 0,
    brewStepTotalSeconds: 0,
    brewStepTimerText: '00:00',

    // --- 用量计算器 ---
    dosagePeople: 1,
    dosageTaste: 'medium',
    dosageResult: null,

    // ========== 区块链存证功能 ==========
    bcVerifying: false,
    bcVerifyResult: null,
    bcShowVerifyResult: false,
    bcShowTxHashFull: false,
    bcShowScanRecords: false,
    bcShowTsaCert: false,
    bcTsaCertData: null,
    bcAntiCounterResult: null,

    // ========== 分享与社交传播功能 ==========
    shareInviteConfig: null,
    shareInviteData: null,
    showShareCardModal: false,
    shareCardGenerating: false,
    shareCardImage: '',
    showCertModal: false,
    certGenerating: false,
    certImage: '',
    showRewardModal: false,
    lastRewardResult: null,

    // ========== 商城与购买功能 ==========
    cartCount: 0,

    // ========== 批次订阅功能 ==========
    batchSubscribed: false
  },

  /**
   * 生命周期函数 - 页面加载
   * @param {object} options - 页面参数，包含 traceId
   */
  onLoad: function(options) {
    console.log('[Detail] 详情页加载，参数：', options);

    // ===== 初始化多语言与无障碍 =====
    this.refreshA11yData();
    this.refreshI18nTexts();
    this.setData({ anchorTabs: buildAnchorTabs() });

    const traceId = options.traceId;

    if (options && options.invite) {
      var app = getApp();
      if (app.globalData) {
        app.globalData.pendingInviter = options.invite;
        console.log('[Invite] 详情页检测到邀请人:', options.invite);
      }
    }

    if (traceId) {
      this.setData({ traceId: traceId });
      this.loadTraceData(traceId);
    } else {
      wx.showToast({
        title: '参数错误',
        icon: 'none'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }
  },

  /**
   * 生命周期函数 - 页面显示（每次显示时刷新无障碍状态）
   */
  onShow: function() {
    // 用户可能从首页修改了设置，返回后立即刷新
    this.refreshA11yData();
    this.refreshI18nTexts();
    this.setData({ anchorTabs: buildAnchorTabs() });
    this.refreshCartCount();
  },

  // ===== i18n 与无障碍 =====

  /** 刷新 a11y 状态（语言/字号/色弱） */
  refreshA11yData: function() {
    const a11y = i18n.getA11yData();
    this.setData({
      currentLang: a11y.lang,
      currentFontSize: a11y.fontSize,
      currentColorWeak: a11y.colorWeak,
      a11yClasses: a11y.classes
    });
  },

  /** 刷新 i18n 文本 */
  refreshI18nTexts: function() {
    const t = function(k) { return i18n.t(k); };
    this.setData({
      'i18n.overallStatusPass': t('detail.test.statusPass'),
      'i18n.overallStatusFail': t('detail.test.statusFail'),
      'i18n.tabTitleBasic': t('detail.tabs.basic'),
      'i18n.tabTitleTreeAge': t('detail.tabs.treeAge'),
      'i18n.tabTitleProcess': t('detail.tabs.process'),
      'i18n.tabTitleTest': t('detail.tabs.test'),
      'i18n.testPassLabel': t('detail.test.pass'),
      'i18n.testFailLabel': t('detail.test.fail'),
      'i18n.gbLimitLabel': t('detail.test.gbLimit'),
      'i18n.measuredValueLabel': t('detail.test.measured'),
      'i18n.levelExcellent': t('detail.test.levelExcellent'),
      'i18n.levelGood': t('detail.test.levelGood'),
      'i18n.levelWarning': t('detail.test.levelWarning'),
      'i18n.levelDanger': t('detail.test.levelDanger'),
      'i18n.backTop': t('common.backTop'),
      'i18n.shareBtn': t('nav.share'),
      'i18n.pdfBtn': t('detail.share.downloadPdf'),
      'i18n.verifyBtn': t('detail.test.verifyReport'),
      'i18n.loadingText': t('common.loading'),
      'i18n.serviceBtn': t('service.floatingBtn')
    });
  },

  /**
   * 生命周期函数 - 页面初次渲染完成
   */
  onReady: function() {
    console.log('[Detail] 页面初次渲染完成');
    // 延迟创建节点查询，等待数据渲染
    setTimeout(() => {
      this.measureModulePositions();
    }, 1000);
  },

  /**
   * ==================== 数据加载 ====================
   * 加载溯源数据
   * @param {string} traceId - 溯源ID
   *
   * 【后端接口预留】
   * 当前使用本地模拟数据，实际项目应调用后端接口
   */
  loadTraceData: function(traceId) {
    const that = this;

    // 骨架屏先展示，模拟数据加载
    this.setData({ skeletonLoading: true, loading: true });

    // 模拟网络延迟
    setTimeout(() => {
      // 从本地模拟数据获取
      const data = mockData.getTraceData(traceId);

      if (data) {
        // 初始化模块展开状态：核心模块展开，其他收起
        const moduleCollapsed = {};
        ANCHOR_TABS_BASE.forEach(tab => {
          moduleCollapsed[tab.key] = !CORE_MODULES.includes(tab.key);
        });
        // 桂花信息是基础信息里的子模块，也默认收起
        moduleCollapsed.osmanthus = true;

        // 初始化图片懒加载映射
        const lazyImageMap = that.initLazyImageMap(data);

        // 计算国标对比图表数据
        const testChartData = that.calculateTestChartData(data.pesticideTest);

        // 获取品种样式配置（安全判断，避免 osmanthusInfo 缺失）
        const variety = (data.osmanthusInfo && data.osmanthusInfo.variety) || '金桂';
        const varietyStyle = mockData.getOsmanthusVarietyConfig(variety);

        // 冲泡互动配置
        const brewInteractiveConfig = mockData.getBrewingInteractiveConfig();

        // 初始化用量计算器结果
        const initialDosageResult = mockData.calculateTeaDosage(1, 'medium');

        // 初始化第一步计时
        const firstBrewStep = brewInteractiveConfig.brewSteps[0];
        const initialBrewStepSeconds = firstBrewStep.duration;
        const m = Math.floor(initialBrewStepSeconds / 60);
        const s = initialBrewStepSeconds % 60;
        const initialBrewStepTimerText = (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);

        // 初始化模块收起状态（产地模块默认收起）
        moduleCollapsed.location = true;

        var shareInviteConfig = mockData.getInviteRewardConfig();
        var shareInviteData = shareUtil.getShareInviteData();

        var workshopCurveStats = null;
        if (data.workshopEnv && data.workshopEnv.curveData) {
          workshopCurveStats = that.calculateWorkshopCurveStats(data.workshopEnv.curveData);
        }

        that.setData({
          traceData: data,
          loading: false,
          skeletonLoading: false,
          moduleCollapsed: moduleCollapsed,
          lazyImageMap: lazyImageMap,
          testChartData: testChartData,
          varietyStyle: varietyStyle,
          brewInteractiveConfig: brewInteractiveConfig,
          dosageResult: initialDosageResult,
          brewStepSeconds: initialBrewStepSeconds,
          brewStepTotalSeconds: initialBrewStepSeconds,
          brewStepTimerText: initialBrewStepTimerText,
          shareInviteConfig: shareInviteConfig,
          shareInviteData: shareInviteData,
          batchSubscribed: subscription.isBatchSubscribed(data.basicInfo.batchNo),
          workshopCurveStats: workshopCurveStats
        });

        // 设置导航栏标题
        wx.setNavigationBarTitle({
          title: data.basicInfo.productName + '溯源'
        });

        var viewPointsResult = greenPoints.earnPoints('viewTrace', '查看溯源信息:' + traceId);
        if (viewPointsResult.earned > 0) {
          console.log('[Detail] 查看溯源获得积分:', viewPointsResult.earned);
        }

        try {
          if (typeof getApp === 'function') {
            var app = getApp();
            if (app && app.processInviteReward) {
              app.processInviteReward(traceId);
            }
          }
        } catch (e) {
          console.warn('[Detail] 处理邀请奖励失败:', e);
        }

        // 数据加载完成后测量模块位置
        setTimeout(() => {
          that.measureModulePositions();
        }, 300);

        if (data.workshopEnv && data.workshopEnv.curveData) {
          setTimeout(() => {
            that.drawWorkshopCurve();
          }, 600);
        }
      } else {
        that.setData({ skeletonLoading: false, loading: false });
        wx.showToast({
          title: '未找到溯源信息',
          icon: 'none'
        });
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      }
    }, 800);
  },

  /**
   * 初始化图片懒加载映射
   */
  initLazyImageMap: function(traceData) {
    const map = {};
    const imageKeys = [
      'originImage',
      'processImage',
      'certImage',
      'teaOriginImage',
      'osmanthusOriginImage'
    ];
    imageKeys.forEach(key => {
      map[key] = false;
    });
    return map;
  },

  /**
   * 测量各模块在页面中的位置，用于锚点高亮
   */
  measureModulePositions: function() {
    const that = this;
    const query = wx.createSelectorQuery();

    const moduleIds = [
      '#anchor-basic',
      '#anchor-treeAge',
      '#anchor-location',
      '#anchor-process',
      '#anchor-green',
      '#anchor-test',
      '#anchor-brew',
      '#anchor-blockchain',
      '#anchor-tab-bar'
    ];

    moduleIds.forEach(id => {
      query.select(id).boundingClientRect();
    });

    query.selectViewport().scrollOffset();

    query.exec(function(res) {
      if (!res || res.length < moduleIds.length + 1) {
        console.warn('[Detail] 模块位置测量失败');
        return;
      }

      const positions = {};
      ANCHOR_TABS_BASE.forEach((tab, index) => {
        if (res[index]) {
          positions[tab.key] = res[index].top + (res[moduleIds.length]?.scrollTop || 0);
        }
      });

      that.modulePositions = positions;
      that.tabBarTop = res[moduleIds.length - 1]?.top || 0;

      console.log('[Detail] 模块位置测量完成:', positions);
    });
  },

  /**
   * ==================== 页面交互 ====================
   */

  /**
   * 页面滚动事件
   */
  onPageScroll: function(e) {
    const scrollTop = e.scrollTop;

    // 更新返回顶部按钮显示
    const showBackTop = scrollTop > 300;
    if (this.data.showBackTop !== showBackTop) {
      this.setData({ showBackTop: showBackTop });
    }

    // 计算阅读进度
    this.updateReadingProgress(scrollTop);

    // 更新锚点高亮
    this.updateActiveAnchor(scrollTop);

    // 判断锚点Tab是否吸顶
    if (this.tabBarTop !== undefined) {
      const anchorSticky = scrollTop > this.tabBarTop - 10;
      if (this.data.anchorSticky !== anchorSticky) {
        this.setData({ anchorSticky: anchorSticky });
      }
    }

    this.setData({ scrollTop: scrollTop });

    // 检查图片懒加载
    this.checkLazyImages(scrollTop);
  },

  /**
   * 更新阅读进度
   */
  updateReadingProgress: function(scrollTop) {
    const that = this;

    if (!this.pageHeightPromise) {
      this.pageHeightPromise = new Promise(function(resolve) {
        wx.createSelectorQuery()
          .select('.page-container')
          .boundingClientRect()
          .selectViewport()
          .scrollOffset()
          .exec(function(res) {
            if (res && res[0] && res[1]) {
              const pageHeight = res[0].height;
              const viewportHeight = res[1].scrollHeight || 800;
              resolve({ pageHeight, viewportHeight });
            } else {
              resolve({ pageHeight: 2000, viewportHeight: 800 });
            }
          });
      });
    }

    this.pageHeightPromise.then(function(dim) {
      const maxScroll = Math.max(dim.pageHeight - dim.viewportHeight, 1);
      const progress = Math.min(Math.max((scrollTop / maxScroll) * 100, 0), 100);

      if (Math.abs(that.data.readingProgress - progress) > 1) {
        that.setData({ readingProgress: Math.round(progress) });
      }
    });
  },

  /**
   * 更新当前激活的锚点
   */
  updateActiveAnchor: function(scrollTop) {
    if (!this.modulePositions) return;

    const positions = this.modulePositions;
    let activeKey = ANCHOR_TABS_BASE[0].key;

    // 找到当前滚动位置对应的模块
    for (let i = ANCHOR_TABS_BASE.length - 1; i >= 0; i--) {
      const tab = ANCHOR_TABS_BASE[i];
      const pos = positions[tab.key];
      if (pos !== undefined && scrollTop >= pos - 150) {
        activeKey = tab.key;
        break;
      }
    }

    if (this.data.activeAnchor !== activeKey) {
      this.setData({ activeAnchor: activeKey });
    }
  },

  /**
   * 检查图片懒加载
   */
  checkLazyImages: function(scrollTop) {
    const that = this;
    const viewportHeight = 800;
    const imageSelectors = [
      { id: '#img-origin', key: 'originImage' },
      { id: '#img-process', key: 'processImage' },
      { id: '#img-cert', key: 'certImage' },
      { id: '#img-tea-origin', key: 'teaOriginImage' },
      { id: '#img-osmanthus-origin', key: 'osmanthusOriginImage' }
    ];

    const lazyImageMap = that.data.lazyImageMap || {};
    const notLoaded = imageSelectors.filter(s => !lazyImageMap[s.key]);
    if (notLoaded.length === 0) return;

    const query = wx.createSelectorQuery();
    notLoaded.forEach(s => {
      query.select(s.id).boundingClientRect();
    });

    query.exec(function(res) {
      if (!res) return;

      const updates = {};
      let hasUpdate = false;

      notLoaded.forEach((s, index) => {
        const rect = res[index];
        if (rect && rect.top < scrollTop + viewportHeight + 200) {
          updates[`lazyImageMap.${s.key}`] = true;
          hasUpdate = true;
        }
      });

      if (hasUpdate) {
        that.setData(updates);
      }
    });
  },

  /**
   * 点击锚点 Tab，平滑滚动到对应模块
   */
  onAnchorTap: function(e) {
    const key = e.currentTarget.dataset.key;
    const index = e.currentTarget.dataset.index;

    console.log('[Detail] 点击锚点:', key);

    // 如果模块是收起的，先展开
    if (this.data.moduleCollapsed[key]) {
      const updates = {};
      updates[`moduleCollapsed.${key}`] = false;
      this.setData(updates, () => {
        // 展开后再测量位置并滚动
        setTimeout(() => {
          this.measureModulePositions();
          this.scrollToModule(key);
        }, 350);
      });
    } else {
      this.scrollToModule(key);
    }

    // 立即更新激活状态，提供即时反馈
    this.setData({ activeAnchor: key });
  },

  /**
   * 滚动到指定模块
   */
  scrollToModule: function(key) {
    const that = this;
    const query = wx.createSelectorQuery();
    query.select(`#anchor-${key}`).boundingClientRect();
    query.selectViewport().scrollOffset();

    query.exec(function(res) {
      if (!res || !res[0]) {
        console.warn('[Detail] 找不到模块:', key);
        return;
      }

      const rect = res[0];
      const scrollOffset = res[1]?.scrollTop || 0;
      // 减去 Tab 栏高度（吸顶时）
      const offset = that.data.anchorSticky ? 100 : 20;
      const scrollTop = rect.top + scrollOffset - offset;

      wx.pageScrollTo({
        scrollTop: Math.max(scrollTop, 0),
        duration: 400
      });
    });
  },

  /**
   * 切换模块展开/收起
   */
  toggleModule: function(e) {
    const key = e.currentTarget.dataset.key;
    const wasCollapsed = this.data.moduleCollapsed[key];
    const updates = {};
    updates[`moduleCollapsed.${key}`] = !wasCollapsed;
    this.setData(updates, () => {
      // 模块高度变化后重新测量位置
      setTimeout(() => {
        this.measureModulePositions();
      }, 350);

      if (key === 'process' && wasCollapsed && this.data.traceData && this.data.traceData.workshopEnv) {
        setTimeout(() => {
          this.drawWorkshopCurve();
        }, 400);
      }
    });
  },

  /**
   * 返回顶部
   */
  scrollToTop: function() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    });
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh: function() {
    console.log('[Detail] 触发下拉刷新');

    // 重新加载数据
    this.pageHeightPromise = null;
    this.loadTraceData(this.data.traceId);

    // 停止下拉刷新动画
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  },

  /**
   * 点击工艺流程步骤
   */
  toggleProcessStep: function(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      activeProcessStep: this.data.activeProcessStep === index ? -1 : index
    });
  },

  /**
   * 显示PDF报告弹窗
   */
  showPdfReport: function() {
    const scrollTop = this.data.scrollTop || 0;
    this.savedScrollTop = scrollTop;
    this.setData({ showPdfModal: true });
  },

  /**
   * 关闭PDF报告弹窗
   */
  closePdfModal: function() {
    const that = this;
    this.setData({ showPdfModal: false }, function() {
      if (that.savedScrollTop !== undefined && that.savedScrollTop !== null) {
        wx.pageScrollTo({
          scrollTop: that.savedScrollTop,
          duration: 0
        });
      }
    });
  },

  /**
   * 阻止弹窗冒泡
   */
  preventBubble: function() {
  },

  /**
   * 复制溯源ID
   */
  copyTraceId: function() {
    wx.setClipboardData({
      data: this.data.traceId,
      success: function() {
        wx.showToast({
          title: '已复制溯源ID',
          icon: 'success',
          duration: 1500
        });
      },
      fail: function(err) {
        console.error('[Detail] 复制失败:', err);
      }
    });
  },

  goGreenTrace: function() {
    wx.navigateTo({
      url: '/pages/greenTrace/greenTrace?traceId=' + this.data.traceId
    });
  },

  onJumpKnowledgeDetail: function(e) {
    const varietyName = e.currentTarget.dataset.variety;
    if (!varietyName) {
      wx.navigateTo({ url: '/pages/knowledge/list' });
      return;
    }
    const matchedArticle = mockData.getKnowledgeArticleByVariety(varietyName);
    if (matchedArticle) {
      wx.navigateTo({
        url: '/pages/knowledge/detail?id=' + matchedArticle.id
      });
    } else {
      wx.showToast({
        title: '暂无该品种百科',
        icon: 'none',
        duration: 1500
      });
      setTimeout(function() {
        wx.navigateTo({
          url: '/pages/knowledge/list?categoryKey=variety'
        });
      }, 1500);
    }
  },

  /**
   * 计算国标对比图表数据（含百分比进度条）
   */
  calculateTestChartData: function(pesticideTest) {
    if (!pesticideTest) {
      return { teaTests: [], osmanthusTests: [], overallPass: true };
    }

    const processTests = (tests) => {
      return tests.map(test => {
        const percent = mockData.calculateTestPercent(test.value, test.limit);
        const isPass = test.status === '合格';
        let level = 'safe';
        if (!isPass) {
          level = 'danger';
        } else if (percent < 30) {
          level = 'excellent';
        } else if (percent < 60) {
          level = 'good';
        } else {
          level = 'warning';
        }
        // ===== 色弱模式辅助属性 =====
        // data-status 给 CSS 选择器使用（[data-status="pass"] / [data-status="fail"]）
        // a11yIcon 在色弱模式下作为可读文本前缀
        // progressClass 控制进度条颜色和图案
        const a11yStatus = isPass ? 'pass' : 'fail';
        const a11yIcon = isPass ? '✓' : '✗';
        const progressClass = isPass ? 'progress-pass' : 'progress-danger';
        const levelClass = 'level-' + level;
        const statusClass = isPass ? 'status-pass tag-success' : 'status-fail';
        return {
          ...test,
          percent: percent,
          level: level,
          isPass: isPass,
          multiple: (test.limit / test.value).toFixed(1),
          // 无障碍与色弱辅助
          a11yStatus: a11yStatus,
          a11yIcon: a11yIcon,
          progressClass: progressClass,
          levelClass: levelClass,
          statusClass: statusClass
        };
      });
    };

    const teaTests = processTests(pesticideTest.teaTests || []);
    const osmanthusTests = processTests(pesticideTest.osmanthusTests || []);
    const overallPass = !pesticideTest.hasAbnormal;

    return { teaTests, osmanthusTests, overallPass };
  },

  /**
   * 保存检测报告到相册
   */
  saveReportToAlbum: function() {
    const that = this;
    wx.showModal({
      title: '保存报告',
      content: '是否将检测报告保存到相册？',
      confirmText: '保存',
      cancelText: '取消',
      success: function(res) {
        if (res.confirm) {
          wx.showLoading({ title: '正在生成图片...', mask: true });
          setTimeout(() => {
            wx.hideLoading();
            wx.showToast({
              title: '已保存到相册',
              icon: 'success',
              duration: 2000
            });
            console.log('[Detail] 报告已保存到相册');
          }, 800);
        }
      }
    });
  },

  /**
   * 转发检测报告给好友
   */
  shareReport: function() {
    const data = this.data.traceData;
    if (!data) return;

    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });

    wx.showToast({
      title: '点击右上角转发',
      icon: 'none',
      duration: 2000
    });
  },

  /**
   * 复制报告编号
   */
  copyReportNo: function() {
    const data = this.data.traceData;
    if (!data || !data.pesticideTest) return;

    wx.setClipboardData({
      data: data.pesticideTest.reportNo,
      success: function() {
        wx.showToast({
          title: '报告编号已复制',
          icon: 'success',
          duration: 1500
        });
      }
    });
  },

  /**
   * 打开报告验真弹窗
   */
  openVerifyModal: function() {
    const data = this.data.traceData;
    this.setData({
      showVerifyModal: true,
      verifyInput: data && data.pesticideTest ? data.pesticideTest.reportNo : '',
      verifyResult: null
    });
  },

  /**
   * 关闭报告验真弹窗
   */
  closeVerifyModal: function() {
    this.setData({
      showVerifyModal: false,
      verifyResult: null
    });
  },

  /**
   * 验真输入框变化
   */
  onVerifyInputChange: function(e) {
    this.setData({
      verifyInput: e.detail.value
    });
  },

  /**
   * 执行报告验真
   */
  doVerifyReport: function() {
    const that = this;
    const reportNo = this.data.verifyInput.trim();

    if (!reportNo) {
      wx.showToast({
        title: '请输入报告编号',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    this.setData({ verifying: true });

    setTimeout(() => {
      const result = mockData.verifyReport(reportNo);
      that.setData({
        verifyResult: result,
        verifying: false
      });
    }, 600);
  },

  /**
   * 跳转到官网验真
   */
  openVerifyWebsite: function() {
    const data = this.data.traceData;
    if (data && data.pesticideTest && data.pesticideTest.verifyUrl) {
      wx.setClipboardData({
        data: data.pesticideTest.verifyUrl,
        success: function() {
          wx.showModal({
            title: '官网验真',
            content: `验真网址已复制，请在浏览器中打开：\n${data.pesticideTest.verifyUrl}`,
            showCancel: false,
            confirmText: '知道了'
          });
        }
      });
    }
  },

  /**
   * 切换历史报告时间轴显示
   */
  toggleHistoryTimeline: function() {
    this.setData({
      showHistoryTimeline: !this.data.showHistoryTimeline
    });
  },

  /**
   * 选择历史报告
   */
  selectHistoryReport: function(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      activeHistoryIndex: index
    });
  },

  /**
   * 查看历史报告详情
   */
  viewHistoryReport: function(e) {
    const report = e.currentTarget.dataset.report;
    wx.showModal({
      title: '历史检测报告',
      content: `报告编号：${report.reportNo}\n检测日期：${report.testDate}\n检测机构：${report.institution}\n检测结果：${report.status}`,
      showCancel: false,
      confirmText: '知道了'
    });
  },

  /**
   * ==================== 窨制工艺深化功能 ====================
   */

  /**
   * 切换工艺模块 Tab
   */
  switchProcessTab: function(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeProcessTab: tab });

    if (tab === 'timeline') {
      this.resetTimelineAnimation();
    } else if (tab === 'comparison' && !this.data.processComparisonData) {
      this.loadProcessComparison();
    }
  },

  /**
   * 选择窨制记录
   */
  selectScentingRecord: function(e) {
    const index = e.currentTarget.dataset.index;
    const records = this.data.traceData.scentingProcess.scentingRecords;

    if (index < 0 || index >= records.length) {
      return;
    }

    this.setData({ activeScentingRecord: index });
  },

  /**
   * 开始时间轴动画自动播放
   */
  startTimelineAnimation: function() {
    const that = this;
    const steps = this.data.traceData.scentingProcess.processSteps;
    const totalSteps = steps.length;

    if (this.data.timelinePlaying) return;

    this.setData({ timelinePlaying: true, timelineActiveStep: 0 });

    this.timelineTimer = setInterval(function() {
      const nextStep = (that.data.timelineActiveStep + 1) % totalSteps;
      that.setData({ timelineActiveStep: nextStep });
    }, this.data.timelineSpeed);
  },

  /**
   * 暂停时间轴动画
   */
  pauseTimelineAnimation: function() {
    if (this.timelineTimer) {
      clearInterval(this.timelineTimer);
      this.timelineTimer = null;
    }
    this.setData({ timelinePlaying: false });
  },

  /**
   * 重置时间轴动画
   */
  resetTimelineAnimation: function() {
    if (this.timelineTimer) {
      clearInterval(this.timelineTimer);
      this.timelineTimer = null;
    }
    this.setData({ timelinePlaying: false, timelineActiveStep: -1 });
  },

  /**
   * 上一步
   */
  prevTimelineStep: function() {
    const currentStep = this.data.timelineActiveStep;
    if (currentStep > 0) {
      this.setData({ timelineActiveStep: currentStep - 1 });
    }
  },

  /**
   * 下一步
   */
  nextTimelineStep: function() {
    const steps = this.data.traceData.scentingProcess.processSteps;
    const currentStep = this.data.timelineActiveStep;
    if (currentStep < steps.length - 1) {
      this.setData({ timelineActiveStep: currentStep + 1 });
    }
  },

  /**
   * 切换播放速度
   */
  changeTimelineSpeed: function(e) {
    const speedMap = { fast: 1000, normal: 2000, slow: 3000 };
    let nextSpeed;

    if (e && e.currentTarget && e.currentTarget.dataset && e.currentTarget.dataset.speed) {
      const targetSpeed = e.currentTarget.dataset.speed;
      nextSpeed = speedMap[targetSpeed] || 2000;
    } else {
      const currentSpeed = this.data.timelineSpeed;
      const speeds = [1000, 2000, 3000];
      const currentIndex = speeds.indexOf(currentSpeed);
      const nextIndex = (currentIndex + 1) % speeds.length;
      nextSpeed = speeds[nextIndex];
    }

    this.setData({ timelineSpeed: nextSpeed });

    const speedLabels = { 1000: '快', 2000: '中', 3000: '慢' };
    wx.showToast({
      title: `播放速度：${speedLabels[nextSpeed]}`,
      icon: 'none',
      duration: 1000
    });

    if (this.data.timelinePlaying) {
      this.pauseTimelineAnimation();
      this.startTimelineAnimation();
    }
  },

  /**
   * 点击时间轴步骤
   */
  onTimelineStepTap: function(e) {
    const index = e.currentTarget.dataset.index;
    this.pauseTimelineAnimation();
    this.setData({ timelineActiveStep: index });
  },

  /**
   * 加载工艺对比数据
   */
  loadProcessComparison: function() {
    if (this.data.processComparisonData) {
      return;
    }
    const comparisonData = mockData.getScentingComparison();
    this.setData({ processComparisonData: comparisonData });
  },

  /**
   * 切换工艺对比显示
   */
  toggleProcessComparison: function() {
    if (!this.data.processComparisonData) {
      this.loadProcessComparison();
    }
    this.setData({ showProcessComparison: !this.data.showProcessComparison });
  },

  /**
   * 查看窨制记录详情
   */
  viewScentingRecordDetail: function(e) {
    const record = e.currentTarget.dataset.record;
    wx.showModal({
      title: `第${record.round}次窨制详情`,
      content: `窨制时长：${record.duration}小时\n窨制温度：${record.temperature}℃\n环境湿度：${record.humidity}%\n操作人：${record.operator}\n时间：${record.timestamp}\n备注：${record.note}`,
      showCancel: false,
      confirmText: '知道了'
    });
  },

  /**
   * 预览工艺图片
   */
  previewProcessImage: function(e) {
    const url = e.currentTarget.dataset.url;
    const urls = this.data.traceData.scentingProcess.processSteps.map(s => s.mediaUrl);
    wx.previewImage({
      current: url,
      urls: urls
    });
  },

  // ============================================================
  // ==================== 车间环境监测方法 ====================
  // ============================================================

  calculateWorkshopCurveStats: function(curveData) {
    if (!curveData || !curveData.temperatureData || !curveData.humidityData) return null;
    var tempArr = curveData.temperatureData;
    var humArr = curveData.humidityData;
    var tempMin = Math.min.apply(null, tempArr);
    var tempMax = Math.max.apply(null, tempArr);
    var tempSum = tempArr.reduce(function(a, b) { return a + b; }, 0);
    var humMin = Math.min.apply(null, humArr);
    var humMax = Math.max.apply(null, humArr);
    var humSum = humArr.reduce(function(a, b) { return a + b; }, 0);
    return {
      tempMin: Math.round(tempMin * 10) / 10,
      tempMax: Math.round(tempMax * 10) / 10,
      tempAvg: Math.round(tempSum / tempArr.length * 10) / 10,
      humidityMin: Math.round(humMin * 10) / 10,
      humidityMax: Math.round(humMax * 10) / 10,
      humidityAvg: Math.round(humSum / humArr.length * 10) / 10
    };
  },

  switchCurveTab: function(e) {
    var tab = e.currentTarget.dataset.tab;
    this.setData({ activeCurveTab: tab });
    var that = this;
    setTimeout(function() {
      that.drawWorkshopCurve();
    }, 100);
  },

  drawWorkshopCurve: function() {
    var that = this;
    var envData = this.data.traceData && this.data.traceData.workshopEnv;
    if (!envData || !envData.curveData) return;

    var query = wx.createSelectorQuery();
    query.select('#envCurveCanvas')
      .fields({ node: true, size: true })
      .exec(function(res) {
        if (!res || !res[0] || !res[0].node) {
          console.warn('[Detail] Canvas node not found');
          return;
        }
        var canvas = res[0].node;
        var ctx = canvas.getContext('2d');
        var dpr = wx.getWindowInfo().pixelRatio || 2;
        var width = res[0].width;
        var height = res[0].height;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);

        var curveData = envData.curveData;
        var activeTab = that.data.activeCurveTab;
        var showTemp = activeTab === 'temp' || activeTab === 'both';
        var showHumidity = activeTab === 'humidity' || activeTab === 'both';

        var padding = { top: 30, right: 20, bottom: 36, left: 44 };
        var chartW = width - padding.left - padding.right;
        var chartH = height - padding.top - padding.bottom;

        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = '#FAFCFF';
        ctx.fillRect(0, 0, width, height);

        var tempArr = curveData.temperatureData || [];
        var humArr = curveData.humidityData || [];
        var count = tempArr.length;
        if (count === 0) return;

        var tempMin = 20, tempMax = 38;
        var humMin = 55, humMax = 90;

        ctx.strokeStyle = '#E8E8E8';
        ctx.lineWidth = 0.5;
        var gridLines = 5;
        for (var g = 0; g <= gridLines; g++) {
          var gy = padding.top + (chartH / gridLines) * g;
          ctx.beginPath();
          ctx.moveTo(padding.left, gy);
          ctx.lineTo(width - padding.right, gy);
          ctx.stroke();
        }

        var xLabels = [0, 12, 24, 36, 48, 60, 72];
        ctx.fillStyle = '#999999';
        ctx.font = '9px sans-serif';
        ctx.textAlign = 'center';
        for (var xi = 0; xi < xLabels.length; xi++) {
          var lx = padding.left + (xLabels[xi] / (count - 1)) * chartW;
          ctx.fillText(xLabels[xi] + 'h', lx, height - 8);
        }

        if (showTemp) {
          ctx.fillStyle = '#FF6B6B';
          ctx.font = '9px sans-serif';
          ctx.textAlign = 'right';
          for (var ti = 0; ti <= gridLines; ti++) {
            var tv = tempMax - (tempMax - tempMin) / gridLines * ti;
            var ty = padding.top + (chartH / gridLines) * ti;
            ctx.fillText(tv.toFixed(0), padding.left - 6, ty + 3);
          }
        }

        if (showHumidity && !showTemp) {
          ctx.fillStyle = '#1890FF';
          ctx.font = '9px sans-serif';
          ctx.textAlign = 'right';
          for (var hi = 0; hi <= gridLines; hi++) {
            var hv = humMax - (humMax - humMin) / gridLines * hi;
            var hy = padding.top + (chartH / gridLines) * hi;
            ctx.fillText(hv.toFixed(0), padding.left - 6, hy + 3);
          }
        }

        var scentingRanges = curveData.scentingRanges || [];
        for (var si = 0; si < scentingRanges.length; si++) {
          var sr = scentingRanges[si];
          var sx1 = padding.left + (sr.startHour / (count - 1)) * chartW;
          var sx2 = padding.left + (sr.endHour / (count - 1)) * chartW;
          ctx.fillStyle = 'rgba(218, 165, 32, 0.12)';
          ctx.fillRect(sx1, padding.top, sx2 - sx1, chartH);
          ctx.fillStyle = '#DAA520';
          ctx.font = '8px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('\u7b2d' + sr.round + '\u7aaf', (sx1 + sx2) / 2, padding.top + 14);
        }

        function drawLine(dataArr, minVal, maxVal, color, lineWidth) {
          if (dataArr.length === 0) return;
          ctx.beginPath();
          ctx.strokeStyle = color;
          ctx.lineWidth = lineWidth || 1.5;
          ctx.lineJoin = 'round';
          for (var i = 0; i < dataArr.length; i++) {
            var x = padding.left + (i / (dataArr.length - 1)) * chartW;
            var y = padding.top + (1 - (dataArr[i] - minVal) / (maxVal - minVal)) * chartH;
            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(padding.left + chartW, padding.top + chartH);
          ctx.lineTo(padding.left, padding.top + chartH);
          for (var j = 0; j < dataArr.length; j++) {
            var xf = padding.left + (j / (dataArr.length - 1)) * chartW;
            var yf = padding.top + (1 - (dataArr[j] - minVal) / (maxVal - minVal)) * chartH;
            ctx.lineTo(xf, yf);
          }
          ctx.closePath();
          var grad = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartH);
          var baseColor = color === '#FF6B6B' ? '255,107,107' : '24,144,255';
          grad.addColorStop(0, 'rgba(' + baseColor + ',0.18)');
          grad.addColorStop(1, 'rgba(' + baseColor + ',0.02)');
          ctx.fillStyle = grad;
          ctx.fill();
        }

        if (showTemp) {
          drawLine(tempArr, tempMin, tempMax, '#FF6B6B', 1.5);
        }
        if (showHumidity) {
          drawLine(humArr, humMin, humMax, '#1890FF', 1.5);
        }

        if (showTemp && showHumidity) {
          ctx.fillStyle = '#1890FF';
          ctx.font = '9px sans-serif';
          ctx.textAlign = 'right';
          for (var ri = 0; ri <= gridLines; ri++) {
            var rv = humMax - (humMax - humMin) / gridLines * ri;
            var ry = padding.top + (chartH / gridLines) * ri;
            ctx.fillText(rv.toFixed(0) + '%', width - 2, ry + 3);
          }
        }
      });
  },

  // ============================================================
  // ==================== 新增功能方法 ====================
  // ============================================================

  /**
   * 实景照片轮播 change 事件
   */
  onScenicChange: function(e) {
    this.setData({ currentScenicIndex: e.detail.current });
  },

  /**
   * 点击实景照片预览大图
   */
  previewScenicImage: function(e) {
    const url = e.currentTarget.dataset.url;
    const photos = this.data.traceData.scenicPhotos.photos;
    const urls = photos.map(function(p) { return p.url; });
    wx.previewImage({ current: url, urls: urls });
  },

  /**
   * 地图标记点击事件
   */
  onMapMarkerTap: function(e) {
    const markerId = e.detail.markerId;
    const markers = this.data.traceData.locationMap.markers;
    const marker = markers.find(function(m) { return m.id === markerId; });
    if (marker) {
      this.setData({
        showMapCalloutModal: true,
        selectedMapMarker: marker
      });
    }
  },

  /**
   * 关闭地图弹窗
   */
  closeMapCallout: function() {
    this.setData({
      showMapCalloutModal: false,
      selectedMapMarker: null
    });
  },

  /**
   * 切换地图图层类型（标准/卫星）
   */
  toggleMapLayer: function() {
    const newType = this.data.mapLayerType === 'standard' ? 'satellite' : 'standard';
    const labels = { standard: '标准图', satellite: '卫星图' };
    this.setData({ mapLayerType: newType });
    wx.showToast({
      title: '已切换为' + labels[newType],
      icon: 'none',
      duration: 1000
    });
  },

  /**
   * 预览地图标记简介图片
   */
  previewMapCalloutImage: function(e) {
    const url = e.currentTarget.dataset.url;
    const marker = this.data.selectedMapMarker;
    if (marker && marker.callout && marker.callout.images) {
      wx.previewImage({
        current: url,
        urls: marker.callout.images
      });
    }
  },

  /**
   * 切换树龄故事 Tab
   */
  switchStoryTab: function(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeStoryTab: tab });
  },

  /**
   * 查看养护记录详情
   */
  viewMaintenanceDetail: function(e) {
    const record = e.currentTarget.dataset.record;
    wx.showModal({
      title: record.type + '详情',
      content: '日期：' + record.date + '\n操作人：' + record.operator + '\n内容：' + record.content + (record.photos ? '\n照片数量：' + record.photos + '张' : ''),
      showCancel: false,
      confirmText: '知道了'
    });
  },

  /**
   * 查看历史事件详情
   */
  viewHistoryEventDetail: function(e) {
    const record = e.currentTarget.dataset.record;
    const typeMap = this.data.historyTypeIconMap;
    wx.showModal({
      title: typeMap[record.type] + '  ' + record.year + '年',
      content: record.event,
      showCancel: false,
      confirmText: '知道了'
    });
  },

  /**
   * 打开导航：跳转地图导航
   */
  openARGarden: function() {
    var traceId = this.data.traceId;
    wx.navigateTo({
      url: '/pages/arExperience/arExperience?mode=detail&traceId=' + traceId + '&scene=garden'
    });
  },

  openLocationNavigation: function() {
    const marker = this.data.selectedMapMarker;
    if (!marker) return;
    wx.openLocation({
      latitude: marker.lat,
      longitude: marker.lng,
      name: marker.name,
      address: marker.callout ? marker.callout.title || marker.name : marker.name,
      scale: 16
    });
  },

  /**
   * 预览采摘天气详情弹窗
   */
  viewWeatherDetail: function(e) {
    const type = e.currentTarget.dataset.type;
    const weather = this.data.traceData.pickWeather[type];
    if (!weather) return;

    const titleMap = { teaPick: '茶叶采摘当日天气', osmanthusPick: '桂花采摘当日天气' };

    wx.showModal({
      title: titleMap[type] || '天气详情',
      content: '日期：' + weather.date +
        '\n地点：' + weather.location +
        '\n天气：' + weather.weather +
        '\n温度：' + weather.temperature +
        '\n湿度：' + weather.humidity +
        '\n风力：' + weather.wind +
        '\n空气质量：' + weather.airQuality +
        '\n日出/日落：' + weather.sunrise + ' / ' + weather.sunset +
        '\n\n说明：' + weather.note,
      showCancel: false,
      confirmText: '知道了'
    });
  },

  /**
   * ==================== 冲泡计时器功能 ====================
   */

  /**
   * 选择水温档位
   */
  selectWaterTemp: function(e) {
    const temp = e.currentTarget.dataset.temp;
    if (this.data.timerRunning) {
      wx.showToast({
        title: '计时中无法切换水温',
        icon: 'none',
        duration: 1500
      });
      return;
    }
    this.setData({ selectedWaterTemp: temp });
  },

  /**
   * 开始/暂停冲泡计时器
   */
  toggleBrewTimer: function() {
    if (this.data.timerRunning) {
      this.pauseBrewTimer();
    } else {
      this.startBrewTimer();
    }
  },

  /**
   * 开始计时
   */
  startBrewTimer: function() {
    const that = this;
    if (this.data.timerSeconds <= 0) {
      this.resetBrewTimer();
    }

    this.setData({ timerRunning: true });

    if (this.brewTimer) {
      clearInterval(this.brewTimer);
    }

    this.brewTimer = setInterval(function() {
      const seconds = that.data.timerSeconds - 1;
      const total = that.data.timerTotalSeconds;
      const progress = Math.round((total - seconds) / total * 100);
      const timeText = that.formatTime(seconds);

      if (seconds <= 0) {
        that.stopBrewTimer();
        that.setData({
          timerSeconds: 0,
          timerProgress: 100,
          timerText: '00:00'
        });
        that.onBrewTimerComplete();
      } else {
        that.setData({
          timerSeconds: seconds,
          timerProgress: progress,
          timerText: timeText
        });
      }
    }, 1000);
  },

  /**
   * 暂停计时
   */
  pauseBrewTimer: function() {
    if (this.brewTimer) {
      clearInterval(this.brewTimer);
      this.brewTimer = null;
    }
    this.setData({ timerRunning: false });
  },

  /**
   * 停止计时
   */
  stopBrewTimer: function() {
    if (this.brewTimer) {
      clearInterval(this.brewTimer);
      this.brewTimer = null;
    }
    this.setData({ timerRunning: false });
  },

  /**
   * 重置计时器
   */
  resetBrewTimer: function() {
    this.stopBrewTimer();
    this.setData({
      timerSeconds: 120,
      timerTotalSeconds: 120,
      timerProgress: 0,
      timerText: '02:00'
    });
  },

  /**
   * 计时完成提醒
   */
  onBrewTimerComplete: function() {
    wx.vibrateLong({
      success: function() {},
      fail: function() {}
    });

    wx.showToast({
      title: '冲泡完成！',
      icon: 'success',
      duration: 3000
    });

    wx.showModal({
      title: '☕ 冲泡完成',
      content: '2分钟冲泡时间已到，现在可以品尝香浓的桂花茶了！',
      showCancel: false,
      confirmText: '好的'
    });
  },

  /**
   * 格式化秒数为 mm:ss
   */
  formatTime: function(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
  },

  /**
   * ==================== 分步冲泡向导功能 ====================
   */

  /**
   * 选择冲泡步骤
   */
  selectBrewStep: function(e) {
    const index = e.currentTarget.dataset.index;
    if (this.data.brewStepTimerRunning) {
      this.stopBrewStepTimer();
    }
    const steps = this.data.brewInteractiveConfig.brewSteps;
    const step = steps[index];
    this.setData({
      activeBrewStep: index,
      brewStepSeconds: step.duration,
      brewStepTotalSeconds: step.duration,
      brewStepTimerText: this.formatTime(step.duration)
    });
  },

  /**
   * 上一步
   */
  prevBrewStep: function() {
    if (this.data.brewStepTimerRunning) {
      this.stopBrewStepTimer();
    }
    const current = this.data.activeBrewStep;
    if (current > 0) {
      const steps = this.data.brewInteractiveConfig.brewSteps;
      const step = steps[current - 1];
      this.setData({
        activeBrewStep: current - 1,
        brewStepSeconds: step.duration,
        brewStepTotalSeconds: step.duration,
        brewStepTimerText: this.formatTime(step.duration)
      });
    }
  },

  /**
   * 下一步
   */
  nextBrewStep: function() {
    if (this.data.brewStepTimerRunning) {
      this.stopBrewStepTimer();
    }
    const steps = this.data.brewInteractiveConfig.brewSteps;
    const current = this.data.activeBrewStep;
    if (current < steps.length - 1) {
      const step = steps[current + 1];
      this.setData({
        activeBrewStep: current + 1,
        brewStepSeconds: step.duration,
        brewStepTotalSeconds: step.duration,
        brewStepTimerText: this.formatTime(step.duration)
      });
    } else {
      wx.showToast({
        title: '已是最后一步',
        icon: 'none',
        duration: 1500
      });
    }
  },

  /**
   * 开始/暂停当前步骤计时
   */
  toggleBrewStepTimer: function() {
    if (this.data.brewStepTimerRunning) {
      this.stopBrewStepTimer();
    } else {
      this.startBrewStepTimer();
    }
  },

  /**
   * 开始当前步骤计时
   */
  startBrewStepTimer: function() {
    const that = this;
    const steps = this.data.brewInteractiveConfig.brewSteps;
    const currentStep = steps[this.data.activeBrewStep];
    const duration = currentStep.duration;

    if (this.data.brewStepSeconds <= 0) {
      this.setData({
        brewStepSeconds: duration,
        brewStepTotalSeconds: duration,
        brewStepTimerText: this.formatTime(duration)
      });
    }

    this.setData({ brewStepTimerRunning: true });

    if (this.brewStepTimer) {
      clearInterval(this.brewStepTimer);
    }

    this.brewStepTimer = setInterval(function() {
      const seconds = that.data.brewStepSeconds - 1;
      const timeText = that.formatTime(seconds);
      if (seconds <= 0) {
        that.stopBrewStepTimer();
        that.setData({ brewStepSeconds: 0, brewStepTimerText: '00:00' });
        that.onBrewStepComplete();
      } else {
        that.setData({ brewStepSeconds: seconds, brewStepTimerText: timeText });
      }
    }, 1000);
  },

  /**
   * 停止当前步骤计时
   */
  stopBrewStepTimer: function() {
    if (this.brewStepTimer) {
      clearInterval(this.brewStepTimer);
      this.brewStepTimer = null;
    }
    this.setData({ brewStepTimerRunning: false });
  },

  /**
   * 重置当前步骤计时
   */
  resetBrewStepTimer: function() {
    this.stopBrewStepTimer();
    const steps = this.data.brewInteractiveConfig.brewSteps;
    const currentStep = steps[this.data.activeBrewStep];
    const duration = currentStep.duration;
    this.setData({
      brewStepSeconds: duration,
      brewStepTotalSeconds: duration,
      brewStepTimerText: this.formatTime(duration)
    });
  },

  /**
   * 当前步骤完成
   */
  onBrewStepComplete: function() {
    const that = this;
    const steps = this.data.brewInteractiveConfig.brewSteps;
    const current = this.data.activeBrewStep;

    wx.vibrateShort({
      success: function() {},
      fail: function() {}
    });

    wx.showToast({
      title: steps[current].name + '完成！',
      icon: 'success',
      duration: 1500
    });

    if (current < steps.length - 1) {
      wx.showModal({
        title: '✅ ' + steps[current].name + '完成',
        content: '是否进行下一步：' + steps[current + 1].name + '？',
        confirmText: '下一步',
        cancelText: '留在本步',
        success: function(res) {
          if (res.confirm) {
            that.nextBrewStep();
          }
        }
      });
    } else {
      wx.showModal({
        title: '🎉 冲泡完成',
        content: '所有冲泡步骤已完成，祝您品茶愉快！',
        showCancel: false,
        confirmText: '好的'
      });
    }
  },

  /**
   * 重新开始冲泡向导
   */
  restartBrewGuide: function() {
    this.stopBrewStepTimer();
    const firstStep = this.data.brewInteractiveConfig.brewSteps[0];
    const duration = firstStep.duration;
    this.setData({
      activeBrewStep: 0,
      brewStepSeconds: duration,
      brewStepTotalSeconds: duration,
      brewStepTimerText: this.formatTime(duration)
    });
  },

  /**
   * ==================== 用量计算器功能 ====================
   */

  /**
   * 减少人数
   */
  decreasePeople: function() {
    const min = this.data.brewInteractiveConfig.dosageConfig.minPeople;
    const current = this.data.dosagePeople;
    if (current > min) {
      const newPeople = current - 1;
      const result = mockData.calculateTeaDosage(newPeople, this.data.dosageTaste);
      this.setData({
        dosagePeople: newPeople,
        dosageResult: result
      });
    }
  },

  /**
   * 增加人数
   */
  increasePeople: function() {
    const max = this.data.brewInteractiveConfig.dosageConfig.maxPeople;
    const current = this.data.dosagePeople;
    if (current < max) {
      const newPeople = current + 1;
      const result = mockData.calculateTeaDosage(newPeople, this.data.dosageTaste);
      this.setData({
        dosagePeople: newPeople,
        dosageResult: result
      });
    }
  },

  /**
   * 选择口味浓淡
   */
  selectTaste: function(e) {
    const taste = e.currentTarget.dataset.taste;
    const result = mockData.calculateTeaDosage(this.data.dosagePeople, taste);
    this.setData({
      dosageTaste: taste,
      dosageResult: result
    });
  },

  verifyBlockchainEvidence: function() {
    var that = this;
    var bc = that.data.traceData && that.data.traceData.blockchainInfo;
    if (!bc || !bc.txHash) {
      wx.showToast({ title: '无存证信息', icon: 'none' });
      return;
    }

    that.setData({ bcVerifying: true, bcShowVerifyResult: false });

    setTimeout(function() {
      var result = mockData.verifyBlockchainEvidence(bc.txHash);
      that.setData({
        bcVerifying: false,
        bcVerifyResult: result,
        bcShowVerifyResult: true
      });
    }, 1500);
  },

  copyTxHash: function() {
    var bc = this.data.traceData && this.data.traceData.blockchainInfo;
    if (!bc || !bc.txHash) {
      wx.showToast({ title: '无交易哈希', icon: 'none' });
      return;
    }
    wx.setClipboardData({
      data: bc.txHash,
      success: function() {
        wx.showToast({ title: '已复制交易哈希', icon: 'success', duration: 1500 });
      }
    });
  },

  toggleTxHashDisplay: function() {
    this.setData({
      bcShowTxHashFull: !this.data.bcShowTxHashFull
    });
  },

  openBlockExplorer: function() {
    var bc = this.data.traceData && this.data.traceData.blockchainInfo;
    if (!bc || !bc.blockExplorerUrl) {
      wx.showToast({ title: '无浏览器链接', icon: 'none' });
      return;
    }
    wx.navigateTo({
      url: '/pages/webview/webview?url=' + encodeURIComponent(bc.blockExplorerUrl) + '&title=区块浏览器'
    });
  },

  toggleScanRecords: function() {
    var that = this;
    var show = !that.data.bcShowScanRecords;
    that.setData({ bcShowScanRecords: show });

    if (show && that.data.traceId) {
      var scanResult = mockData.recordAntiCounterfeitingScan(that.data.traceId, {
        location: '当前位置',
        ip: 'xxx.xxx.xx.xx'
      });
      that.setData({ bcAntiCounterResult: scanResult });
    }
  },

  toggleTsaCertificate: function() {
    var that = this;
    var show = !that.data.bcShowTsaCert;
    if (show && that.data.traceId) {
      var tsaData = mockData.getTsaCertificate(that.data.traceId);
      that.setData({
        bcShowTsaCert: true,
        bcTsaCertData: tsaData
      });
    } else {
      that.setData({ bcShowTsaCert: show });
    }
  },

  copyTsaCertSerial: function() {
    var tsa = this.data.bcTsaCertData;
    if (!tsa || !tsa.certSerial) {
      wx.showToast({ title: '无证书编号', icon: 'none' });
      return;
    }
    wx.setClipboardData({
      data: tsa.certSerial,
      success: function() {
        wx.showToast({ title: '已复制证书编号', icon: 'success', duration: 1500 });
      }
    });
  },

  closeBlockchainVerifyResult: function() {
    this.setData({ bcShowVerifyResult: false });
  },

  // ============================================================
  // ==================== 分享与社交传播功能方法 ====================
  // ============================================================

  openShareCardModal: function() {
    var that = this;
    this.setData({
      showShareCardModal: true,
      shareCardImage: '',
      shareCardGenerating: true
    });
    setTimeout(function() {
      that.generateShareCard();
    }, 300);
  },

  closeShareCardModal: function() {
    this.setData({ showShareCardModal: false });
  },

  generateShareCard: function() {
    var that = this;
    if (!that.data.traceData) return;

    var app = getApp();
    var themeColors = app.globalData && app.globalData.themeColors ? app.globalData.themeColors : null;

    shareUtil.drawShareCard('shareCardCanvas', that.data.traceData, themeColors, function(res) {
      if (res.success) {
        that.setData({
          shareCardImage: res.tempFilePath,
          shareCardGenerating: false
        });
      } else {
        that.setData({ shareCardGenerating: false });
        wx.showToast({ title: '生成失败，请重试', icon: 'none' });
      }
    });
  },

  regenerateShareCard: function() {
    var that = this;
    this.setData({
      shareCardGenerating: true,
      shareCardImage: ''
    });
    setTimeout(function() {
      that.generateShareCard();
    }, 200);
  },

  saveShareCardToAlbum: function() {
    var that = this;
    if (!that.data.shareCardImage) {
      wx.showToast({ title: '请先生成分享卡片', icon: 'none' });
      return;
    }
    wx.showLoading({ title: '保存中...', mask: true });
    shareUtil.saveImageToAlbum(that.data.shareCardImage, function(res) {
      wx.hideLoading();
      if (res.success) {
        wx.showToast({ title: '已保存到相册', icon: 'success' });
      } else {
        wx.showToast({ title: '保存失败', icon: 'none' });
      }
    });
  },

  openCertModal: function() {
    var that = this;
    this.setData({
      showCertModal: true,
      certImage: '',
      certGenerating: true
    });
    setTimeout(function() {
      that.generateCert();
    }, 300);
  },

  closeCertModal: function() {
    this.setData({ showCertModal: false });
  },

  generateCert: function() {
    var that = this;
    if (!that.data.traceData) return;

    var app = getApp();
    var themeColors = app.globalData && app.globalData.themeColors ? app.globalData.themeColors : null;

    shareUtil.drawTraceCertificate('certCanvas', that.data.traceData, themeColors, function(res) {
      if (res.success) {
        that.setData({
          certImage: res.tempFilePath,
          certGenerating: false
        });
      } else {
        that.setData({ certGenerating: false });
        wx.showToast({ title: '生成失败，请重试', icon: 'none' });
      }
    });
  },

  regenerateCert: function() {
    var that = this;
    this.setData({
      certGenerating: true,
      certImage: ''
    });
    setTimeout(function() {
      that.generateCert();
    }, 200);
  },

  saveCertToAlbum: function() {
    var that = this;
    if (!that.data.certImage) {
      wx.showToast({ title: '请先生成溯源证书', icon: 'none' });
      return;
    }
    wx.showLoading({ title: '保存中...', mask: true });
    shareUtil.saveImageToAlbum(that.data.certImage, function(res) {
      wx.hideLoading();
      if (res.success) {
        wx.showToast({ title: '证书已保存到相册', icon: 'success' });
      } else {
        wx.showToast({ title: '保存失败', icon: 'none' });
      }
    });
  },

  doInviteShare: function() {
    var that = this;
    var data = that.data.traceData;
    if (!data) return;

    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });

    wx.showToast({
      title: '点击右上角分享给好友',
      icon: 'none',
      duration: 2500
    });

    setTimeout(function() {
      var result = shareUtil.handleInviteeScan('current_user', that.data.traceId);
      if (result.success) {
        that.setData({
          shareInviteData: result.inviteData,
          lastRewardResult: result,
          showRewardModal: true
        });
      }
    }, 1500);
  },

  copyShareLink: function() {
    var that = this;
    var traceId = that.data.traceId;
    var shareUrl = 'https://example.com/trace?traceId=' + traceId + '&invite=1';
    wx.setClipboardData({
      data: shareUrl,
      success: function() {
        wx.showToast({
          title: '链接已复制',
          icon: 'success',
          duration: 1500
        });
      }
    });
  },

  previewShareImage: function(e) {
    var url = e.currentTarget.dataset.url;
    if (!url) return;
    wx.previewImage({
      current: url,
      urls: [url]
    });
  },

  closeRewardModal: function() {
    this.setData({ showRewardModal: false });
  },

  shareAfterReward: function() {
    var that = this;
    this.setData({ showRewardModal: false });
    setTimeout(function() {
      that.doInviteShare();
    }, 200);
  },

  /**
   * 用户点击右上角分享 - 增强版本
   */
  onShareAppMessage: function() {
    const data = this.data.traceData;
    const traceId = this.data.traceId;
    var inviterId = '1';
    try {
      var userInfo = auth.getUserInfo();
      inviterId = userInfo && userInfo.openid ? userInfo.openid : '1';
    } catch (e) {
      console.warn('[Share] 获取用户信息失败，使用默认邀请人ID');
    }
    var that = this;
    return {
      title: `${data.basicInfo.productName} - 扫码查看全链路溯源信息，邀请双方得积分好礼！`,
      path: `/pages/detail/detail?traceId=${traceId}&invite=${inviterId}`,
      imageUrl: this.data.shareCardImage || data.basicInfo.thumbnail || '',
      success: function(res) {
        console.log('[Share] 分享成功:', res);
        try {
          var pointsResult = greenPoints.earnPoints('share', '分享产品:' + traceId);
          if (pointsResult.earned > 0) {
            console.log('[Share] 分享获得积分:', pointsResult.earned);
            if (typeof wx !== 'undefined' && wx.showToast) {
              wx.showToast({
                title: '分享成功 +' + pointsResult.earned + '积分',
                icon: 'success',
                duration: 2000
              });
            }
          }
        } catch (e) {
          console.warn('[Share] 积分奖励失败:', e);
        }
      },
      fail: function(err) {
        console.error('[Share] 分享失败:', err);
      }
    };
  },

  /**
   * 分享到朋友圈 - 增强版本
   */
  onShareTimeline: function() {
    const data = this.data.traceData;
    const traceId = this.data.traceId;
    var inviterId = '1';
    try {
      var userInfo = auth.getUserInfo();
      inviterId = userInfo && userInfo.openid ? userInfo.openid : '1';
    } catch (e) {
      console.warn('[Share] 获取用户信息失败，使用默认邀请人ID');
    }
    var that = this;
    return {
      title: `${data.basicInfo.productName} | 全链路溯源 · 区块链验真 · 扫码邀请双方得好礼`,
      query: `traceId=${traceId}&invite=${inviterId}`,
      imageUrl: this.data.shareCardImage || data.basicInfo.thumbnail || '',
      success: function(res) {
        console.log('[Share] 朋友圈分享成功:', res);
        try {
          var pointsResult = greenPoints.earnPoints('share', '分享到朋友圈:' + traceId);
          if (pointsResult.earned > 0) {
            console.log('[Share] 朋友圈分享获得积分:', pointsResult.earned);
          }
        } catch (e) {
          console.warn('[Share] 积分奖励失败:', e);
        }
      }
    };
  },

  /**
   * ==================== 商城与购买功能 ====================
   */

  refreshCartCount: function() {
    var count = shop.getCartCount();
    this.setData({ cartCount: count });
  },

  toggleBatchSubscription: function() {
    var that = this;
    var data = this.data.traceData;
    if (!data || !data.basicInfo) return;

    var batchNo = data.basicInfo.batchNo;
    var productName = data.basicInfo.productName;
    var traceId = this.data.traceId;

    if (this.data.batchSubscribed) {
      wx.showModal({
        title: '取消订阅',
        content: '确定取消订阅批次 ' + batchNo + ' 的动态吗？',
        confirmColor: '#ff4d4f',
        success: function(res) {
          if (res.confirm) {
            subscription.unsubscribeBatch(batchNo);
            that.setData({ batchSubscribed: false });
            wx.showToast({ title: '已取消订阅', icon: 'success', duration: 1500 });
          }
        }
      });
    } else {
      subscription.subscribeBatch(batchNo, traceId, productName);
      this.setData({ batchSubscribed: true });
      wx.showToast({ title: '已订阅本批次动态', icon: 'success', duration: 1500 });
    }
  },

  goToSubscriptionPage: function() {
    wx.navigateTo({ url: '/pages/subscription/subscription' });
  },

  goToShopHome: function() {
    wx.switchTab({
      url: '/pages/shop/list'
    });
  },

  goToCart: function() {
    wx.switchTab({
      url: '/pages/shop/cart'
    });
  },

  buySameStyle: function() {
    var traceId = this.data.traceId;
    if (!traceId) {
      wx.showToast({ title: '参数错误', icon: 'none' });
      return;
    }

    var product = mockData.getShopProduct(traceId);
    if (!product) {
      wx.showToast({ title: '商品已下架', icon: 'none' });
      return;
    }

    wx.navigateTo({
      url: '/pages/shop/detail?traceId=' + traceId
    });
  },

  buyAgain: function() {
    var traceId = this.data.traceId;
    if (!traceId) {
      wx.showToast({ title: '参数错误', icon: 'none' });
      return;
    }

    var product = mockData.getShopProduct(traceId);
    if (!product) {
      wx.showToast({ title: '商品已下架', icon: 'none' });
      return;
    }

    wx.navigateTo({
      url: '/pages/shop/detail?traceId=' + traceId + '&buyNow=1'
    });
  },

  goService: function() {
    var traceId = this.data.traceId;
    wx.navigateTo({
      url: '/pages/service/index?traceId=' + (traceId || '')
    });
  },

  /**
   * 生命周期函数 - 页面卸载
   */
  onUnload: function() {
    if (this.timelineTimer) {
      clearInterval(this.timelineTimer);
      this.timelineTimer = null;
    }
    if (this.brewTimer) {
      clearInterval(this.brewTimer);
      this.brewTimer = null;
    }
    if (this.brewStepTimer) {
      clearInterval(this.brewStepTimer);
      this.brewStepTimer = null;
    }
  }
});
