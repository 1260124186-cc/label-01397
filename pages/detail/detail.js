/**
 * 桂花茶溯源小程序 - 溯源详情页
 * 功能：展示完整溯源信息（基础信息、树龄、窨制工艺、绿色溯源、农残检测等）
 * 页面路径：pages/detail/detail
 */

// 引入模拟数据模块
const mockData = require('../../utils/mockData.js');
const shareUtil = require('../../utils/share.js');
const i18n = require('../../utils/i18n/index.js');
const certWallet = require('../../utils/certificateWallet.js');
const weatherUtil = require('../../utils/weather.js');
const userStore = require('../../utils/userStore.js');
const subscription = require('../../utils/subscription.js');
const reviewTrust = require('../../utils/reviewTrust.js');
const tts = require('../../utils/tts.js');
const marketingAnalytics = require('../../utils/marketingAnalytics.js');
const traceExport = require('../../utils/traceExport.js');

// 锚点 Tab 配置（将在运行时根据语言填充 label）
const ANCHOR_TABS_BASE = [
  { key: 'basic', icon: '📋', i18nKey: 'detail.tabs.basic' },
  { key: 'shelfLife', icon: '📅', label: '保质期', conditional: true },
  { key: 'treeAge', icon: '🌳', i18nKey: 'detail.tabs.treeAge' },
  { key: 'location', icon: '📍', i18nKey: 'detail.tabs.location' },
  { key: 'process', icon: '🫖', i18nKey: 'detail.tabs.process' },
  { key: 'green', icon: '♻️', i18nKey: 'detail.tabs.green' },
  { key: 'giftbox', icon: '🎁', i18nKey: 'detail.tabs.giftbox', conditional: true },
  { key: 'test', icon: '🔬', i18nKey: 'detail.tabs.test' },
  { key: 'sampleTrace', icon: '🧪', label: '检样追溯' },
  { key: 'brew', icon: '☕', i18nKey: 'detail.tabs.brew' },
  { key: 'blockchain', icon: '🔗', i18nKey: 'detail.tabs.blockchain' },
  { key: 'reviews', icon: '⭐', i18nKey: 'detail.tabs.reviews' }
];

// 核心模块（默认展开）
const CORE_MODULES = ['treeAge', 'process', 'green'];

/** 根据当前语言生成带标签的 Tab 列表 */
function buildAnchorTabs(showGiftBox, hasShelfLife) {
  return ANCHOR_TABS_BASE
    .filter(item => {
      if (!item.conditional) return true;
      if (item.key === 'giftbox') return !!showGiftBox;
      if (item.key === 'shelfLife') return !!hasShelfLife;
      return true;
    })
    .map(item => ({
      key: item.key,
      icon: item.icon,
      label: item.i18nKey
        ? (item.i18nKey === 'detail.tabs.giftbox' ? '礼盒组成' : i18n.t(item.i18nKey))
        : (item.label || item.key)
    }));
}

Page({
  /**
   * 页面数据
   */
  data: {
    // 溯源ID
    traceId: '',
    // 视图模式：domestic / export
    viewMode: 'domestic',
    // 是否有出口信息
    hasExportInfo: false,
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
      loadingText: ''
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
      sampleTrace: true,
      brew: true,
      blockchain: true,
      reviews: false
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
    sampleTraceData: null,
    sampleTraceAbnormalCount: 0,
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

    // ========== 冲泡环境联动 ==========
    currentWeather: null,
    weatherLoading: false,
    waterTempAdjusted: null,
    waterHardness: 'medium',
    hardnessAdjustment: null,
    currentBrewRound: 1,
    brewFeeling: '',
    brewRating: 0,
    brewTags: [],
    showBrewSaveModal: false,
    brewPresetTags: ['回甘', '花香', '醇厚', '清甜', '浓香', '柔和', '鲜爽', '余韵', '桂花香', '茶韵'],
    brewPresetTagsWithState: [],
    brewInputTag: '',

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

    // ========== 证书钱包功能 ==========
    certWalletStatus: {
      organic: false,
      testReport: false,
      blockchain: false,
      totalSaved: 0
    },

    // ========== 社区评价体系 ==========
    reviewData: null,
    processedReviews: [],
    tasteTags: [],
    tasteTagsWithState: [],
    ratingDimensions: [],
    reportReasons: [],
    reviewFilter: 'all',
    reviewSortBy: 'quality',
    reviewSortOptions: [],
    showReviewModal: false,
    showReportModal: false,
    reviewForm: {
      overallRating: 5,
      dimensionRatings: {
        aroma: 5,
        taste: 5,
        value: 5
      },
      selectedTags: [],
      content: '',
      images: []
    },
    reportForm: {
      reviewId: '',
      reason: '',
      content: ''
    },
    currentReportReviewId: '',

    // ========== 评价信任治理 ==========
    isScanVerified: false,
    hasSubmittedReview: false,
    trustLevels: null,
    weightedAverageRating: 0,
    reviewSubmitWarning: null,
    showAuditTip: false,
    publishFromNoteEnabled: false,
    currentNoteId: '',
    showNotePublishModal: false,
    notePublishData: null,
    reviewSortIndex: 0,
    reviewSortLabels: [],

    // ========== 礼盒/组合装模块 ==========
    giftBoxInfo: null,
    giftBoxItems: [],
    isGiftBoxMainCode: false,
    isGiftBoxSubCode: false,
    subCodeContext: null,
    showShareModeModal: false,
    moduleCollapsedGiftBox: false,

    // ========== 数据版本与变更说明 ==========
    showVersionUpdateToast: false,
    versionUpdateInfo: null,
    showChangeLogModal: false,
    currentChangeLogVersion: null,
    versionHistoryList: [],
    showVersionHistoryModal: false,
    selectedVersionIndex: 0,
    isViewingHistoryVersion: false,
    originalTraceData: null,
    bcVersionTxHashList: [],
    activeBcVersion: 'current',

    // ========== 保质期与储存提醒 ==========
    shelfLifeData: null,
    storageRiskData: null,
    shelfLifeSubscribed: false,
    showShelfLifeDetailModal: false,

    // ========== 语音播报功能 ==========
    ttsEnabled: true,
    ttsIsPlaying: false,
    ttsIsPaused: false,
    ttsMode: 'module',
    ttsCurrentModule: '',
    ttsQueueData: [],
    ttsCurrentText: '',
    ttsProgress: 0,
    ttsShowControl: false,
    ttsSpeed: 1.0,
    ttsVolume: 1.0,

    showExportModal: false,
    exportFormat: traceExport.EXPORT_FORMAT.JSON,
    exportScope: traceExport.EXPORT_SCOPE.FULL,
    exportFormats: [
      { key: traceExport.EXPORT_FORMAT.JSON, label: traceExport.FORMAT_LABELS[traceExport.EXPORT_FORMAT.JSON] },
      { key: traceExport.EXPORT_FORMAT.PDF, label: traceExport.FORMAT_LABELS[traceExport.EXPORT_FORMAT.PDF] },
      { key: traceExport.EXPORT_FORMAT.ZIP, label: traceExport.FORMAT_LABELS[traceExport.EXPORT_FORMAT.ZIP] }
    ],
    exportScopes: [
      { key: traceExport.EXPORT_SCOPE.TEST_ONLY, label: traceExport.SCOPE_LABELS[traceExport.EXPORT_SCOPE.TEST_ONLY], desc: '仅包含农残检测报告' },
      { key: traceExport.EXPORT_SCOPE.GREEN_ONLY, label: traceExport.SCOPE_LABELS[traceExport.EXPORT_SCOPE.GREEN_ONLY], desc: '仅包含绿色溯源信息' },
      { key: traceExport.EXPORT_SCOPE.FULL, label: traceExport.SCOPE_LABELS[traceExport.EXPORT_SCOPE.FULL], desc: '包含批次、检测、渠道、区块链等全部信息' }
    ],
    exporting: false,
    exportWatermarkInfo: null
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
    this.setData({ anchorTabs: buildAnchorTabs(false) });

    // ===== 初始化语音播报 =====
    this.initTTS();

    const traceId = options.traceId || options.id;
    const viewMode = options.viewMode || 'domestic';

    // 如果 viewMode=export，直接跳转到出口溯源页
    if (viewMode === 'export') {
      wx.redirectTo({
        url: '/pages/exportTrace/exportTrace?traceId=' + traceId,
        fail: function() {
          wx.navigateTo({
            url: '/pages/exportTrace/exportTrace?traceId=' + traceId
          });
        }
      });
      return;
    }

    if (traceId) {
      this.setData({ traceId: traceId, viewMode: viewMode });
      this.loadTraceData(traceId);
      this.initBrewEnvironment();

      marketingAnalytics.trackPageEnter('detail', {
        traceId: traceId,
        from: options.from || ''
      });
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
    this.setData({ anchorTabs: buildAnchorTabs(!!this.data.giftBoxInfo, !!this.data.shelfLifeData) });
    if (this.data.traceData) {
      this.refreshCertWalletStatus();
    }
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
      'i18n.viewToggleTitle': t('exportTrace.viewToggle.title'),
      'i18n.viewToggleDomesticBadge': t('exportTrace.viewModeDomestic'),
      'i18n.viewToggleInfoTitle': t('exportTrace.viewToggle.sameTraceId') + ' · ' + t('exportTrace.viewToggle.differentView'),
      'i18n.viewToggleInfoDesc': t('exportTrace.viewToggle.exportDesc'),
      'i18n.viewToggleBtnText': t('exportTrace.viewToggle.switchToExport')
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

        var reviewData = mockData.getProductReviews(traceId);
        var tasteTags = mockData.getTasteTags();
        var ratingDimensions = mockData.getRatingDimensions();
        var reportReasons = mockData.getReportReasons();
        var reviewSortOptions = mockData.getReviewSortOptions();

        userStore.addScanVerifyRecord(traceId);

        var giftBoxInfo = mockData.getGiftBoxInfo(traceId);
        var giftBoxItems = [];
        var isMain = mockData.isGiftBoxMainCode(traceId);
        var isSub = mockData.isGiftBoxSubCode(traceId);
        var subContext = null;
        if (giftBoxInfo) {
          giftBoxItems = mockData.getGiftBoxItems(giftBoxInfo.giftBoxId);
        }
        if (isSub) {
          subContext = mockData.getGiftBoxSubCodeInfo(traceId);
        }

        var processedReviews = [];
        var weightedAverageRating = 0;
        if (reviewData && reviewData.reviews) {
          var reviews = reviewData.reviews.map(function(review) {
            return reviewTrust.prepareReviewForDisplay(review);
          });

          weightedAverageRating = reviewTrust.calculateWeightedRating(reviews);

          processedReviews = reviewTrust.sortReviewsByTrust(reviews, that.data.reviewSortBy);
        }

        var isScanVerified = userStore.isScanVerified(traceId);
        var hasSubmittedReview = userStore.hasSubmittedReview(traceId);
        var trustLevels = userStore.getTrustLevels();

        var reviewSortIndex = 0;
        for (var si = 0; si < reviewSortOptions.length; si++) {
          if (reviewSortOptions[si].key === that.data.reviewSortBy) {
            reviewSortIndex = si;
            break;
          }
        }
        var reviewSortLabels = reviewSortOptions.map(function(opt) { return opt.label; });

        var versionHistory = mockData.getAllVersions(traceId);
        var versionUpdateInfo = that.checkVersionUpdate(traceId, data);

        var shelfLifeData = that.calculateShelfLifeData(data);
        var storageRiskData = that.checkStorageRisk(traceId);
        var shelfLifeSubscribed = subscription.isShelfLifeSubscribed(traceId);

        var sampleTraceInfo = mockData.getSampleTrace(traceId);
        var sampleTraceAbnormalCount = 0;
        if (sampleTraceInfo && sampleTraceInfo.steps) {
          sampleTraceInfo.steps.forEach(function(step) {
            if (step.isAbnormal) sampleTraceAbnormalCount++;
          });
        }

        var hasExportInfo = mockData.hasExportInfo(traceId);

        that.setData({
          traceData: data,
          originalTraceData: data,
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
          reviewData: reviewData,
          processedReviews: processedReviews,
          tasteTags: tasteTags,
          tasteTagsWithState: tasteTags.map(function(t) { return { key: t.key, name: t.name, icon: t.icon, color: t.color, selected: false }; }),
          ratingDimensions: ratingDimensions,
          reportReasons: reportReasons,
          reviewSortOptions: reviewSortOptions,
          reviewSortIndex: reviewSortIndex,
          reviewSortLabels: reviewSortLabels,
          isScanVerified: isScanVerified,
          hasSubmittedReview: hasSubmittedReview,
          trustLevels: trustLevels,
          weightedAverageRating: weightedAverageRating,
          giftBoxInfo: giftBoxInfo,
          giftBoxItems: giftBoxItems,
          isGiftBoxMainCode: isMain,
          isGiftBoxSubCode: isSub,
          subCodeContext: subContext,
          moduleCollapsedGiftBox: !(giftBoxInfo ? false : true),
          versionHistoryList: versionHistory,
          bcVersionTxHashList: versionHistory,
          versionUpdateInfo: versionUpdateInfo,
          showVersionUpdateToast: !!versionUpdateInfo,
          shelfLifeData: shelfLifeData,
          storageRiskData: storageRiskData,
          shelfLifeSubscribed: shelfLifeSubscribed,
          sampleTraceData: sampleTraceInfo,
          sampleTraceAbnormalCount: sampleTraceAbnormalCount,
          hasExportInfo: hasExportInfo
        });

        that.setData({ anchorTabs: buildAnchorTabs(!!giftBoxInfo, !!shelfLifeData) });

        that.refreshCertWalletStatus();

        // 设置导航栏标题
        wx.setNavigationBarTitle({
          title: data.basicInfo.productName + '溯源'
        });

        // 数据加载完成后测量模块位置
        setTimeout(() => {
          that.measureModulePositions();
        }, 300);
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
      '#anchor-sampleTrace',
      '#anchor-brew',
      '#anchor-blockchain',
      '#anchor-reviews',
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
    const updates = {};
    updates[`moduleCollapsed.${key}`] = !this.data.moduleCollapsed[key];
    this.setData(updates, () => {
      // 模块高度变化后重新测量位置
      setTimeout(() => {
        this.measureModulePositions();
      }, 350);
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

  goAuthorizedNetwork: function() {
    wx.navigateTo({
      url: '/pages/authorizedNetwork/authorizedNetwork?traceId=' + this.data.traceId
    });
  },

  goToTeaMaster: function(e) {
    var teamId = e.currentTarget.dataset.teamid;
    if (!teamId) return;
    wx.navigateTo({
      url: '/pages/teaMaster/teaMaster?teamId=' + teamId
    });
  },

  goToSampleAbnormalReport: function(e) {
    var sampleNo = e.currentTarget.dataset.sampleno || '';
    var abnormalReason = e.currentTarget.dataset.abnormalreason || '';
    var traceId = this.data.traceId || '';
    wx.navigateTo({
      url: '/pages/reportProduct/reportProduct?type=sample_abnormal&sampleNo=' + encodeURIComponent(sampleNo) + '&abnormalReason=' + encodeURIComponent(abnormalReason) + '&traceId=' + traceId
    });
  },

  /**
   * 切换到出口视图
   */
  switchToExportView: function() {
    var traceId = this.data.traceId;
    wx.redirectTo({
      url: '/pages/exportTrace/exportTrace?traceId=' + traceId,
      fail: function() {
        wx.navigateTo({
          url: '/pages/exportTrace/exportTrace?traceId=' + traceId
        });
      }
    });
  },

  /**
   * 用户点击右上角分享
   * 修改为直达详情页路径，减少跳转步骤
   */
  onShareAppMessage: function() {
    const data = this.data.traceData;
    const giftBoxInfo = this.data.giftBoxInfo;
    const mode = this.data.currentShareMode || 'single';
    let title = `${data.basicInfo.productName} - 全链路溯源信息`;
    let path = `/pages/detail/detail?traceId=${this.data.traceId}`;
    if (giftBoxInfo && mode === 'giftbox_whole') {
      title = `🎁 ${giftBoxInfo.name}（含${giftBoxInfo.items.length}件）- 礼盒装全链路溯源`;
      path = `/pages/scanResult/scanResult?traceId=${giftBoxInfo.mainCode.traceId}`;
    }
    return {
      title: title,
      path: path,
      imageUrl: data.basicInfo.thumbnail || ''
    };
  },

  /**
   * 分享到朋友圈
   */
  onShareTimeline: function() {
    const data = this.data.traceData;
    const giftBoxInfo = this.data.giftBoxInfo;
    const mode = this.data.currentShareMode || 'single';
    let title = `${data.basicInfo.productName} - 全链路溯源信息`;
    if (giftBoxInfo && mode === 'giftbox_whole') {
      title = `${giftBoxInfo.name} - 礼盒装全链路溯源`;
    }
    return {
      title: title,
      query: `traceId=${this.data.traceId}`,
      imageUrl: data.basicInfo.thumbnail || ''
    };
  },

  // ========== 礼盒/组合装模块交互 ==========
  goToSubItemDetail: function(e) {
    var traceId = e.currentTarget.dataset.traceId;
    if (!traceId) return;
    if (traceId === this.data.traceId) {
      wx.showToast({ title: '当前即为该产品', icon: 'none' });
      return;
    }
    wx.navigateTo({
      url: '/pages/detail/detail?traceId=' + traceId
    });
  },

  goToGiftBoxMainPage: function() {
    var ctx = this.data.subCodeContext;
    if (!ctx || !ctx.mainTraceId) return;
    wx.navigateTo({
      url: '/pages/scanResult/scanResult?traceId=' + ctx.mainTraceId
    });
  },

  goToGiftBoxDetailPage: function() {
    var ctx = this.data.subCodeContext;
    if (!ctx || !ctx.mainTraceId) return;
    wx.navigateTo({
      url: '/pages/detail/detail?traceId=' + ctx.mainTraceId
    });
  },

  toggleGiftBoxModule: function() {
    this.setData({ moduleCollapsedGiftBox: !this.data.moduleCollapsedGiftBox });
  },

  openShareModeModal: function() {
    if (!this.data.isGiftBoxMainCode) {
      wx.showShareMenu({ withShareTicket: true });
      return;
    }
    this.setData({ showShareModeModal: true });
  },

  closeShareModeModal: function() {
    this.setData({ showShareModeModal: false });
  },

  shareGiftBoxWhole: function() {
    this.setData({ showShareModeModal: false, currentShareMode: 'giftbox_whole' });
    wx.showToast({ title: '请点击右上角分享整盒', icon: 'none', duration: 1200 });
  },

  shareGiftBoxSingle: function() {
    this.setData({ showShareModeModal: false, currentShareMode: 'giftbox_single' });
    wx.showToast({ title: '请点击右上角分享单品', icon: 'none', duration: 1200 });
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
    var that = this;
    wx.vibrateLong({
      success: function() {},
      fail: function() {}
    });

    wx.showToast({
      title: '冲泡完成！',
      icon: 'success',
      duration: 3000
    });

    setTimeout(function() {
      that.openBrewSaveModal();
    }, 500);
  },

  initBrewEnvironment: function() {
    var that = this;
    var waterSettings = userStore.getWaterQualitySettings();
    var hardness = waterSettings.hardness || 'medium';
    var hardnessAdj = userStore.adjustBrewParamsByWaterQuality(hardness, 3, 120);
    this.setData({
      waterHardness: hardness,
      hardnessAdjustment: hardnessAdj
    });

    this.setData({ weatherLoading: true });
    weatherUtil.getCurrentLocationWeather().then(function(weather) {
      that.setData({
        currentWeather: weather,
        weatherLoading: false
      });
      var adjusted = weatherUtil.adjustWaterTempByWeather(weather.temp, 85, 90);
      that.setData({
        waterTempAdjusted: adjusted,
        selectedWaterTemp: String(adjusted.recommended)
      });
    }).catch(function() {
      that.setData({ weatherLoading: false });
      var adjusted = weatherUtil.adjustWaterTempByWeather(25, 85, 90);
      that.setData({
        waterTempAdjusted: adjusted,
        selectedWaterTemp: String(adjusted.recommended)
      });
    });
  },

  goToBrewEnvironment: function() {
    var traceId = this.data.traceId || '';
    var baseParams = '?traceId=' + traceId
      + '&baseTempMin=85&baseTempMax=90'
      + '&baseTeaAmount=3&baseDuration=120';
    wx.navigateTo({
      url: '/pages/brewEnvironment/brewEnvironment' + baseParams
    });
  },

  onEnvironmentUpdated: function(envData) {
    var updates = {};
    if (envData.weather) {
      updates.currentWeather = envData.weather;
    }
    if (envData.waterTempAdjusted) {
      updates.waterTempAdjusted = envData.waterTempAdjusted;
      updates.selectedWaterTemp = String(envData.waterTempAdjusted.recommended);
    }
    if (envData.waterHardness) {
      updates.waterHardness = envData.waterHardness;
    }
    if (envData.hardnessAdjustment) {
      updates.hardnessAdjustment = envData.hardnessAdjustment;
    }
    if (Object.keys(updates).length > 0) {
      this.setData(updates);
    }
  },

  openBrewRecordPage: function() {
    var traceId = this.data.traceId || '';
    wx.navigateTo({
      url: '/pages/brewRecord/brewRecord' + (traceId ? '?traceId=' + traceId : '')
    });
  },

  openBrewSaveModal: function() {
    var brewPresetTags = this.data.brewPresetTags;
    var brewPresetTagsWithState = brewPresetTags.map(function(t) {
      return { name: t, selected: false };
    });
    this.setData({
      showBrewSaveModal: true,
      brewFeeling: '',
      brewRating: 0,
      brewTags: [],
      brewPresetTagsWithState: brewPresetTagsWithState,
      brewInputTag: ''
    });
  },

  closeBrewSaveModal: function() {
    this.setData({ showBrewSaveModal: false });
  },

  onBrewFeelingInput: function(e) {
    this.setData({ brewFeeling: e.detail.value });
  },

  onBrewRatingTap: function(e) {
    this.setData({ brewRating: e.currentTarget.dataset.rating });
  },

  onBrewPresetTagTap: function(e) {
    var tag = e.currentTarget.dataset.tag;
    var tags = this.data.brewTags.slice();
    var idx = tags.indexOf(tag);
    if (idx !== -1) {
      tags.splice(idx, 1);
    } else {
      if (tags.length >= 5) {
        wx.showToast({ title: '最多选择5个标签', icon: 'none', duration: 1500 });
        return;
      }
      tags.push(tag);
    }
    var brewPresetTagsWithState = this.data.brewPresetTags.map(function(t) {
      return { name: t, selected: tags.indexOf(t) !== -1 };
    });
    this.setData({ brewTags: tags, brewPresetTagsWithState: brewPresetTagsWithState });
  },

  onBrewInputTagInput: function(e) {
    this.setData({ brewInputTag: e.detail.value });
  },

  onBrewAddInputTag: function() {
    var tag = this.data.brewInputTag.trim();
    if (!tag) return;
    if (tag.length > 6) {
      wx.showToast({ title: '标签最多6个字', icon: 'none', duration: 1500 });
      return;
    }
    var tags = this.data.brewTags.slice();
    if (tags.indexOf(tag) !== -1) {
      wx.showToast({ title: '标签已存在', icon: 'none', duration: 1500 });
      return;
    }
    if (tags.length >= 5) {
      wx.showToast({ title: '最多选择5个标签', icon: 'none', duration: 1500 });
      return;
    }
    tags.push(tag);
    var brewPresetTagsWithState = this.data.brewPresetTags.map(function(t) {
      return { name: t, selected: tags.indexOf(t) !== -1 };
    });
    this.setData({ brewTags: tags, brewInputTag: '', brewPresetTagsWithState: brewPresetTagsWithState });
  },

  onBrewRemoveTag: function(e) {
    var tag = e.currentTarget.dataset.tag;
    var tags = this.data.brewTags.slice();
    var idx = tags.indexOf(tag);
    if (idx !== -1) tags.splice(idx, 1);
    var brewPresetTagsWithState = this.data.brewPresetTags.map(function(t) {
      return { name: t, selected: tags.indexOf(t) !== -1 };
    });
    this.setData({ brewTags: tags, brewPresetTagsWithState: brewPresetTagsWithState });
  },

  saveBrewRecord: function() {
    var that = this;
    var traceData = this.data.traceData;
    var productName = traceData && traceData.basicInfo ? traceData.basicInfo.productName : '';
    var actualDuration = this.data.timerTotalSeconds - this.data.timerSeconds;
    if (actualDuration <= 0) actualDuration = this.data.timerTotalSeconds;

    var record = {
      traceId: this.data.traceId || '',
      productName: productName,
      brewRound: this.data.currentBrewRound || 1,
      waterTemp: parseInt(this.data.selectedWaterTemp) || 85,
      brewDuration: actualDuration,
      teaAmount: this.data.hardnessAdjustment ? this.data.hardnessAdjustment.teaAmount : 3,
      waterAmount: 150,
      waterHardness: this.data.waterHardness || 'medium',
      feeling: this.data.brewFeeling || '',
      rating: this.data.brewRating || 0,
      tags: this.data.brewTags || [],
      weather: this.data.currentWeather || null
    };

    userStore.addBrewRecord(record);

    wx.showToast({ title: '已保存到记录本', icon: 'success', duration: 1500 });

    this.setData({
      showBrewSaveModal: false,
      currentBrewRound: (this.data.currentBrewRound || 1) + 1
    });

    this.resetBrewTimer();
  },

  generateTastingNoteFromBrew: function() {
    var that = this;
    var traceData = this.data.traceData;
    var productName = traceData && traceData.basicInfo ? traceData.basicInfo.productName : '';
    var actualDuration = this.data.timerTotalSeconds - this.data.timerSeconds;
    if (actualDuration <= 0) actualDuration = this.data.timerTotalSeconds;

    var record = {
      brewRound: this.data.currentBrewRound || 1,
      waterTemp: parseInt(this.data.selectedWaterTemp) || 85,
      brewDuration: actualDuration,
      teaAmount: this.data.hardnessAdjustment ? this.data.hardnessAdjustment.teaAmount : 3,
      waterAmount: 150,
      waterHardness: this.data.waterHardness || 'medium',
      feeling: this.data.brewFeeling || '',
      rating: this.data.brewRating || 0,
      tags: this.data.brewTags || [],
      weather: this.data.currentWeather || null
    };

    var draft = userStore.generateTastingNoteDraft(record, productName);

    userStore.addBrewRecord(Object.assign({
      traceId: this.data.traceId || '',
      productName: productName
    }, record));

    this.setData({
      showBrewSaveModal: false,
      currentBrewRound: (this.data.currentBrewRound || 1) + 1
    });

    this.resetBrewTimer();

    var url = '/pages/tastingNoteDetail/tastingNoteDetail'
      + '?traceId=' + encodeURIComponent(this.data.traceId || '')
      + '&productName=' + encodeURIComponent(productName || '')
      + '&draft=' + encodeURIComponent(draft)
      + '&tags=' + encodeURIComponent((this.data.brewTags || []).join(','))
      + '&rating=' + (this.data.brewRating || 0);

    wx.navigateTo({ url: url });
  },

  increaseBrewRound: function() {
    this.setData({ currentBrewRound: (this.data.currentBrewRound || 1) + 1 });
  },

  decreaseBrewRound: function() {
    if (this.data.currentBrewRound > 1) {
      this.setData({ currentBrewRound: this.data.currentBrewRound - 1 });
    }
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
        marketingAnalytics.trackCertSave({
          traceId: that.data.traceId,
          saveType: 'album',
          certCount: 1,
          productName: that.data.traceData ? that.data.traceData.basicInfo.productName : ''
        });

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

    marketingAnalytics.trackShareClick({
      traceId: that.data.traceId,
      shareType: 'invite',
      productName: data.basicInfo.productName,
      shareChannel: 'system'
    });

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
    return {
      title: `${data.basicInfo.productName} - 扫码查看全链路溯源信息，邀请双方得积分好礼！`,
      path: `/pages/detail/detail?traceId=${traceId}&invite=1`,
      imageUrl: this.data.shareCardImage || data.basicInfo.thumbnail || ''
    };
  },

  /**
   * 分享到朋友圈 - 增强版本
   */
  onShareTimeline: function() {
    const data = this.data.traceData;
    const traceId = this.data.traceId;
    return {
      title: `${data.basicInfo.productName} | 全链路溯源 · 区块链验真 · 扫码邀请双方得好礼`,
      query: `traceId=${traceId}&invite=1`,
      imageUrl: this.data.shareCardImage || data.basicInfo.thumbnail || ''
    };
  },

  /**
   * ==================== 证书钱包功能方法 ====================
   */

  /**
   * 刷新当前产品的证书收藏状态
   */
  refreshCertWalletStatus: function() {
    var that = this;
    var traceData = this.data.traceData;
    if (!traceData) return;

    var traceId = traceData.basicInfo.traceId;
    var allCerts = certWallet.getCertificates();

    var status = {
      organic: false,
      testReport: false,
      blockchain: false,
      totalSaved: 0
    };

    allCerts.forEach(function(cert) {
      if (cert.traceId === traceId) {
        if (cert.type === 'organic') status.organic = true;
        if (cert.type === 'testReport') status.testReport = true;
        if (cert.type === 'blockchain') status.blockchain = true;
      }
    });

    status.totalSaved = (status.organic ? 1 : 0) + (status.testReport ? 1 : 0) + (status.blockchain ? 1 : 0);

    this.setData({ certWalletStatus: status });
  },

  /**
   * 一键收藏全部三张证书
   */
  onSaveAllCerts: function() {
    var that = this;
    var traceData = this.data.traceData;
    if (!traceData) return;

    var certs = certWallet.buildAllCertificatesFromTrace(traceData);
    var addedCount = 0;
    certs.forEach(function(cert) {
      var result = certWallet.addCertificate(cert);
      if (result.success) addedCount++;
    });

    that.refreshCertWalletStatus();

    if (addedCount > 0) {
      marketingAnalytics.trackCertSave({
        traceId: traceData.basicInfo.traceId,
        saveType: 'wallet_all',
        certCount: addedCount,
        productName: traceData.basicInfo.productName
      });

      wx.showToast({
        title: '已收藏 ' + addedCount + ' 张证书',
        icon: 'success',
        duration: 2000
      });
    } else {
      wx.showToast({
        title: '证书已全部收藏过',
        icon: 'none',
        duration: 1500
      });
    }
  },

  /**
   * 收藏单张证书
   */
  onSaveSingleCert: function(e) {
    var that = this;
    var type = e.currentTarget.dataset.type;
    var traceData = this.data.traceData;
    if (!traceData || !type) return;

    var cert = null;
    if (type === 'organic') {
      cert = certWallet.buildOrganicCert(traceData);
    } else if (type === 'testReport') {
      cert = certWallet.buildTestReportCert(traceData);
    } else if (type === 'blockchain') {
      cert = certWallet.buildBlockchainCert(traceData);
    }

    if (!cert) return;

    var result = certWallet.addCertificate(cert);
    that.refreshCertWalletStatus();

    if (result.success) {
      marketingAnalytics.trackCertSave({
        traceId: traceData.basicInfo.traceId,
        saveType: 'wallet_single',
        certType: type,
        certCount: 1,
        productName: traceData.basicInfo.productName
      });

      wx.showToast({
        title: '已加入证书钱包',
        icon: 'success',
        duration: 1500
      });
    } else {
      wx.showToast({
        title: result.message || '收藏失败',
        icon: 'none',
        duration: 1500
      });
    }
  },

  /**
   * 取消收藏单张证书
   */
  onRemoveSingleCert: function(e) {
    var that = this;
    var type = e.currentTarget.dataset.type;
    var traceData = this.data.traceData;
    if (!traceData || !type) return;

    var certId = type + '_' + traceData.basicInfo.traceId;
    certWallet.removeCertificate(certId);
    that.refreshCertWalletStatus();

    wx.showToast({
      title: '已取消收藏',
      icon: 'none',
      duration: 1500
    });
  },

  /**
   * 跳转证书钱包页面
   */
  goCertificateWallet: function() {
    wx.navigateTo({
      url: '/pages/certificateWallet/certificateWallet'
    });
  },

  // ==================== 社区评价体系方法 ====================

  loadReviewData: function() {
    var that = this;
    var traceId = this.data.traceId;
    if (!traceId) return;

    var reviewData = mockData.getProductReviews(traceId);
    var processedReviews = this.calculateProcessedReviews(reviewData);
    var weightedAverageRating = 0;
    if (reviewData && reviewData.reviews) {
      var reviews = reviewData.reviews.map(function(review) {
        return reviewTrust.prepareReviewForDisplay(review);
      });
      weightedAverageRating = reviewTrust.calculateWeightedRating(reviews);
    }
    this.setData({
      reviewData: reviewData,
      processedReviews: processedReviews,
      weightedAverageRating: weightedAverageRating
    });
  },

  calculateProcessedReviews: function(reviewData) {
    if (!reviewData || !reviewData.reviews) return [];

    var reviews = reviewData.reviews.slice();
    var filter = this.data.reviewFilter;
    var sortBy = this.data.reviewSortBy;

    if (filter === 'image') {
      reviews = reviews.filter(function(r) { return r.images && r.images.length > 0; });
    } else if (filter === 'good') {
      reviews = reviews.filter(function(r) { return r.rating >= 4; });
    } else if (filter === 'mid') {
      reviews = reviews.filter(function(r) { return r.rating === 3; });
    } else if (filter === 'bad') {
      reviews = reviews.filter(function(r) { return r.rating <= 2; });
    } else if (filter === 'verified') {
      reviews = reviews.filter(function(r) { return r.isScanVerified; });
    }

    reviews = reviews.map(function(review) {
      return reviewTrust.prepareReviewForDisplay(review);
    });

    var sortedReviews = reviewTrust.sortReviewsByTrust(reviews, sortBy);

    return sortedReviews;
  },

  openReviewModal: function() {
    var reviewForm = {
      overallRating: 5,
      dimensionRatings: {
        aroma: 5,
        taste: 5,
        value: 5
      },
      selectedTags: [],
      content: '',
      images: []
    };
    var tasteTagsWithState = this.data.tasteTags.map(function(t) {
      return { key: t.key, name: t.name, icon: t.icon, color: t.color, selected: false };
    });
    this.setData({
      showReviewModal: true,
      reviewForm: reviewForm,
      tasteTagsWithState: tasteTagsWithState
    });
  },

  closeReviewModal: function() {
    this.setData({ showReviewModal: false });
  },

  onOverallRatingChange: function(e) {
    var rating = e.currentTarget.dataset.rating;
    this.setData({
      'reviewForm.overallRating': rating
    });
  },

  onDimensionRatingChange: function(e) {
    var dimension = e.currentTarget.dataset.dimension;
    var rating = e.currentTarget.dataset.rating;
    var key = 'reviewForm.dimensionRatings.' + dimension;
    this.setData({
      [key]: rating
    });
  },

  onTasteTagToggle: function(e) {
    var tag = e.currentTarget.dataset.tag;
    var selectedTags = this.data.reviewForm.selectedTags;
    var index = selectedTags.indexOf(tag);

    if (index > -1) {
      selectedTags.splice(index, 1);
    } else {
      selectedTags.push(tag);
    }

    var tasteTagsWithState = this.data.tasteTags.map(function(t) {
      return {
        key: t.key,
        name: t.name,
        icon: t.icon,
        color: t.color,
        selected: selectedTags.indexOf(t.name) > -1
      };
    });

    this.setData({
      'reviewForm.selectedTags': selectedTags,
      tasteTagsWithState: tasteTagsWithState
    });
  },

  onReviewContentInput: function(e) {
    this.setData({
      'reviewForm.content': e.detail.value
    });
  },

  chooseReviewImages: function() {
    var that = this;
    var currentImages = this.data.reviewForm.images;
    var maxCount = 9 - currentImages.length;

    if (maxCount <= 0) {
      wx.showToast({
        title: '最多上传9张图片',
        icon: 'none'
      });
      return;
    }

    wx.chooseImage({
      count: maxCount,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        var newImages = res.tempFilePaths;
        var allImages = currentImages.concat(newImages);
        that.setData({
          'reviewForm.images': allImages
        });
      }
    });
  },

  removeReviewImage: function(e) {
    var index = e.currentTarget.dataset.index;
    var images = this.data.reviewForm.images;
    images.splice(index, 1);
    this.setData({
      'reviewForm.images': images
    });
  },

  previewReviewImage: function(e) {
    var index = e.currentTarget.dataset.index;
    var images = this.data.reviewForm.images;
    wx.previewImage({
      current: images[index],
      urls: images
    });
  },

  submitReview: function() {
    var that = this;
    var form = this.data.reviewForm;
    var traceId = this.data.traceId;

    var overallRating = form.overallRating;
    var dimensionTotal = 0;
    var dimensionKeys = Object.keys(form.dimensionRatings);
    for (var j = 0; j < dimensionKeys.length; j++) {
      dimensionTotal += form.dimensionRatings[dimensionKeys[j]];
    }
    var avgDimension = dimensionTotal / dimensionKeys.length;
    var rating = Math.round((overallRating + avgDimension) / 2);

    var reviewData = {
      rating: rating,
      dimensions: form.dimensionRatings,
      tasteTags: form.selectedTags,
      content: form.content.trim(),
      images: form.images
    };

    var result = mockData.submitReview(traceId, reviewData);

    if (result.success) {
      var toastTitle = result.message;
      if (result.warnings && result.warnings.length > 0) {
        toastTitle = result.warnings[0].message;
      }

      wx.showToast({
        title: toastTitle,
        icon: 'success',
        duration: 2000
      });

      that.setData({
        showReviewModal: false,
        showAuditTip: result.needAudit,
        hasSubmittedReview: true
      });

      setTimeout(function() {
        that.loadReviewData();
      }, 800);
    } else {
      wx.showToast({
        title: result.message || '提交失败',
        icon: 'none'
      });
    }
  },

  onLikeReview: function(e) {
    var that = this;
    var reviewId = e.currentTarget.dataset.reviewId;
    var traceId = this.data.traceId;

    var result = mockData.likeReview(traceId, reviewId);

    if (result.success) {
      var reviews = this.data.reviewData.reviews;
      for (var i = 0; i < reviews.length; i++) {
        if (reviews[i].id === reviewId) {
          reviews[i].likeCount = result.likeCount;
          reviews[i].isLiked = !reviews[i].isLiked;
          break;
        }
      }
      this.setData({
        'reviewData.reviews': reviews
      });
    } else {
      wx.showToast({
        title: result.message || '操作失败',
        icon: 'none'
      });
    }
  },

  openReportModal: function(e) {
    var reviewId = e.currentTarget.dataset.reviewId;
    this.setData({
      showReportModal: true,
      currentReportReviewId: reviewId,
      'reportForm.reviewId': reviewId,
      'reportForm.reason': '',
      'reportForm.content': ''
    });
  },

  closeReportModal: function() {
    this.setData({ showReportModal: false });
  },

  onReportReasonSelect: function(e) {
    var reason = e.currentTarget.dataset.reason;
    this.setData({
      'reportForm.reason': reason
    });
  },

  onReportContentInput: function(e) {
    this.setData({
      'reportForm.content': e.detail.value
    });
  },

  submitReport: function() {
    var that = this;
    var form = this.data.reportForm;
    var traceId = this.data.traceId;

    if (!form.reason) {
      wx.showToast({
        title: '请选择举报原因',
        icon: 'none'
      });
      return;
    }

    var result = mockData.reportReview(traceId, form.reviewId, form.reason, form.content);

    if (result.success) {
      wx.showToast({
        title: result.message,
        icon: 'success'
      });
      this.setData({ showReportModal: false });
    } else {
      wx.showToast({
        title: result.message || '举报失败',
        icon: 'none'
      });
    }
  },

  onReviewFilterChange: function(e) {
    var filter = e.currentTarget.dataset.filter;
    this.setData({ reviewFilter: filter });
    var processedReviews = this.calculateProcessedReviews(this.data.reviewData);
    this.setData({ processedReviews: processedReviews });
  },

  onReviewSortChange: function(e) {
    var sortIndex = e.detail.value;
    var sortOptions = this.data.reviewSortOptions;
    var sortBy = 'quality';
    if (sortOptions && sortOptions[sortIndex]) {
      sortBy = sortOptions[sortIndex].key;
    }
    this.setData({ reviewSortBy: sortBy, reviewSortIndex: sortIndex });
    var processedReviews = this.calculateProcessedReviews(this.data.reviewData);
    this.setData({ processedReviews: processedReviews });
  },

  onTrustFilterChange: function(e) {
    var filter = e.currentTarget.dataset.filter;
    this.setData({ reviewFilter: filter });
    var processedReviews = this.calculateProcessedReviews(this.data.reviewData);
    this.setData({ processedReviews: processedReviews });
  },

  closeAuditTip: function() {
    this.setData({ showAuditTip: false });
  },

  openNotePublishModal: function() {
    var that = this;
    var traceId = this.data.traceId;
    var userNotes = userStore.getTastingNotesByProduct(traceId);

    if (userNotes && userNotes.length > 0) {
      var publishData = reviewTrust.convertNoteToReviewPreview(userNotes[0], traceId);
      this.setData({
        showNotePublishModal: true,
        notePublishData: publishData,
        currentNoteId: userNotes[0].id
      });
    } else {
      wx.showToast({
        title: '暂无品鉴笔记可发布',
        icon: 'none'
      });
    }
  },

  closeNotePublishModal: function() {
    this.setData({ showNotePublishModal: false });
  },

  publishReviewFromNote: function() {
    var that = this;
    var noteId = this.data.currentNoteId;
    var traceId = this.data.traceId;

    var result = mockData.submitReviewFromNote(traceId, noteId);

    if (result.success) {
      wx.showToast({
        title: result.needAudit ? '已发布，正在审核' : '发布成功',
        icon: 'success'
      });

      that.setData({
        showNotePublishModal: false,
        showAuditTip: result.needAudit,
        hasSubmittedReview: true
      });

      setTimeout(function() {
        that.loadReviewData();
      }, 800);
    } else {
      wx.showToast({
        title: result.message || '发布失败',
        icon: 'none'
      });
    }
  },

  openBrandReplyModal: function(e) {
    var reviewId = e.currentTarget.dataset.reviewId;
    wx.showToast({
      title: '品牌回复功能仅对管理员开放',
      icon: 'none'
    });
  },

  previewReviewDetailImage: function(e) {
    var current = e.currentTarget.dataset.src;
    var urls = e.currentTarget.dataset.urls;
    wx.previewImage({
      current: current,
      urls: urls
    });
  },

  /**
   * ==================== 数据版本与变更说明功能 ====================
   */

  /**
   * 检测版本是否更新（与本地缓存对比）
   */
  checkVersionUpdate: function(traceId, traceData) {
    try {
      var STORAGE_KEY = 'trace_version_cache';
      var cache = wx.getStorageSync(STORAGE_KEY) || {};
      var cachedVersion = cache[traceId];
      var currentVersion = traceData.dataVersion;
      var lastUpdatedAt = traceData.lastUpdatedAt;

      if (!cachedVersion) {
        cache[traceId] = {
          version: currentVersion,
          lastUpdatedAt: lastUpdatedAt
        };
        wx.setStorageSync(STORAGE_KEY, cache);
        return null;
      }

      if (cachedVersion.version !== currentVersion) {
        cache[traceId] = {
          version: currentVersion,
          lastUpdatedAt: lastUpdatedAt
        };
        wx.setStorageSync(STORAGE_KEY, cache);
        return {
          oldVersion: cachedVersion.version,
          newVersion: currentVersion,
          lastUpdatedAt: lastUpdatedAt,
          traceId: traceId
        };
      }

      return null;
    } catch (e) {
      console.error('[Detail] 版本检测失败:', e);
      return null;
    }
  },

  /**
   * 关闭版本更新 Toast
   */
  closeVersionUpdateToast: function() {
    this.setData({
      showVersionUpdateToast: false
    });
  },

  /**
   * 点击 Toast 查看变更详情
   */
  viewVersionChangesFromToast: function() {
    this.setData({
      showVersionUpdateToast: false
    });
    this.openChangeLogModal();
  },

  /**
   * 打开变更详情弹窗（显示当前最新版本的变更）
   */
  openChangeLogModal: function() {
    var latest = this.data.versionHistoryList && this.data.versionHistoryList[0];
    if (latest) {
      this.setData({
        showChangeLogModal: true,
        currentChangeLogVersion: latest
      });
    }
  },

  /**
   * 查看指定版本的变更详情
   */
  openVersionChangeLog: function(e) {
    var version = e.currentTarget.dataset.version;
    if (!version) return;
    this.setData({
      showChangeLogModal: true,
      currentChangeLogVersion: version
    });
  },

  /**
   * 关闭变更详情弹窗
   */
  closeChangeLogModal: function() {
    this.setData({
      showChangeLogModal: false,
      currentChangeLogVersion: null
    });
  },

  /**
   * 获取变更类型的中文标签
   */
  getChangeTypeLabel: function(type) {
    var map = {
      'add': '新增',
      'update': '更新',
      'delete': '删除'
    };
    return map[type] || '变更';
  },

  /**
   * 打开历史版本列表
   */
  openVersionHistory: function() {
    this.setData({
      showVersionHistoryModal: true,
      selectedVersionIndex: 0
    });
  },

  /**
   * 关闭历史版本列表
   */
  closeVersionHistory: function() {
    if (this.data.isViewingHistoryVersion) {
      this.restoreCurrentVersion();
    }
    this.setData({
      showVersionHistoryModal: false
    });
  },

  /**
   * 选择查看历史版本（只读）
   */
  selectHistoryVersion: function(e) {
    var index = e.currentTarget.dataset.index;
    var version = this.data.versionHistoryList[index];
    if (!version) return;

    if (index === 0) {
      this.restoreCurrentVersion();
      return;
    }

    this.setData({
      selectedVersionIndex: index,
      isViewingHistoryVersion: true,
      activeBcVersion: version.version
    });

    wx.showToast({
      title: '正在查看 v' + version.version + '（只读）',
      icon: 'none',
      duration: 2000
    });
  },

  /**
   * 恢复查看当前版本
   */
  restoreCurrentVersion: function() {
    this.setData({
      selectedVersionIndex: 0,
      isViewingHistoryVersion: false,
      activeBcVersion: 'current'
    });
  },

  /**
   * 切换区块链模块中显示的版本 txHash
   */
  switchBcVersion: function(e) {
    var version = e.currentTarget.dataset.version;
    this.setData({
      activeBcVersion: version || 'current'
    });
  },

  /**
   * 获取当前激活版本对应的区块链信息
   */
  getActiveBcInfo: function() {
    var bc = this.data.traceData && this.data.traceData.blockchainInfo;
    if (!bc) return null;

    if (this.data.activeBcVersion === 'current') {
      return bc;
    }

    var ver = this.data.versionHistoryList.find(function(v) {
      return v.version === this.data.activeBcVersion;
    }.bind(this));

    if (ver) {
      return {
        ...bc,
        txHash: ver.txHash,
        txHashShort: ver.txHashShort,
        blockHeight: ver.blockHeight,
        timestamp: ver.timestamp,
        dataVersion: ver.version
      };
    }
    return bc;
  },

  /**
   * 从变更详情跳转到对应的历史检测报告（与 historyReports 时间轴打通）
   */
  gotoHistoryReportFromChange: function(e) {
    var reportNo = e.currentTarget.dataset.reportno;
    if (!reportNo) return;

    var historyReports = this.data.traceData && this.data.traceData.pesticideTest && this.data.traceData.pesticideTest.historyReports;
    if (!historyReports) return;

    var targetIndex = historyReports.findIndex(function(r) { return r.reportNo === reportNo; });

    this.closeChangeLogModal();
    this.closeVersionHistory();

    this.setData({
      showHistoryTimeline: true,
      activeHistoryIndex: targetIndex >= 0 ? targetIndex : 0,
      moduleCollapsed: {
        ...this.data.moduleCollapsed,
        test: false
      }
    }, function() {
      setTimeout(function() {
        wx.pageScrollTo({
          selector: '#anchor-test',
          duration: 400
        });
      }, 200);
    });
  },

  /**
   * ==================== 保质期与储存提醒功能 ====================
   */

  /**
   * 计算保质期进度数据
   */
  calculateShelfLifeData: function(traceData) {
    if (!traceData || !traceData.basicInfo || !traceData.basicInfo.shelfLife) {
      return null;
    }

    var shelfLife = traceData.basicInfo.shelfLife;
    var now = new Date();
    var todayStr = now.getFullYear() + '-' +
      String(now.getMonth() + 1).padStart(2, '0') + '-' +
      String(now.getDate()).padStart(2, '0');

    var parseDate = function(dateStr) {
      var parts = dateStr.split('-');
      return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    };

    var productionDate = parseDate(shelfLife.productionDate);
    var bestBeforeDate = parseDate(shelfLife.bestBeforeDate);
    var today = parseDate(todayStr);

    var totalDays = Math.max(1, Math.ceil((bestBeforeDate - productionDate) / (24 * 60 * 60 * 1000)));
    var elapsedDays = Math.max(0, Math.ceil((today - productionDate) / (24 * 60 * 60 * 1000)));
    var remainingDays = Math.max(0, Math.ceil((bestBeforeDate - today) / (24 * 60 * 60 * 1000)));
    var overallProgress = Math.min(100, Math.max(0, Math.round(elapsedDays / totalDays * 100)));

    var bestTasteStartDays = shelfLife.bestTasteStartDays || 7;
    var bestTasteEndDays = shelfLife.bestTasteEndDays || 270;
    var bestTasteTotalDays = bestTasteEndDays - bestTasteStartDays;
    var bestTasteElapsedDays = Math.max(0, elapsedDays - bestTasteStartDays);
    var bestTasteProgress = Math.min(100, Math.max(0, Math.round(bestTasteElapsedDays / bestTasteTotalDays * 100)));

    var bestTasteStartProgress = Math.round(bestTasteStartDays / totalDays * 100);
    var bestTasteEndProgress = Math.round(bestTasteEndDays / totalDays * 100);

    var status = 'fresh';
    var statusLabel = '新鲜期';
    var statusColor = '#52C41A';
    if (elapsedDays < bestTasteStartDays) {
      status = 'fresh';
      statusLabel = '新鲜期';
      statusColor = '#52C41A';
    } else if (elapsedDays >= bestTasteStartDays && elapsedDays <= bestTasteEndDays) {
      status = 'best';
      statusLabel = '最佳品饮期';
      statusColor = '#2E8B57';
    } else if (elapsedDays > bestTasteEndDays && elapsedDays <= totalDays) {
      status = 'declining';
      statusLabel = '品质下降期';
      statusColor = '#FAAD14';
    } else {
      status = 'expired';
      statusLabel = '已过保质期';
      statusColor = '#FF4D4F';
    }

    var daysUntilBestEnd = Math.max(0, bestTasteEndDays - elapsedDays);
    var notify30DaysBefore = daysUntilBestEnd <= 30 && daysUntilBestEnd > 0;

    return {
      productionDate: shelfLife.productionDate,
      bestBeforeDate: shelfLife.bestBeforeDate,
      totalDays: totalDays,
      elapsedDays: elapsedDays,
      remainingDays: remainingDays,
      overallProgress: overallProgress,
      bestTasteStartProgress: bestTasteStartProgress,
      bestTasteEndProgress: bestTasteEndProgress,
      bestTasteProgress: bestTasteProgress,
      status: status,
      statusLabel: statusLabel,
      statusColor: statusColor,
      daysUntilBestEnd: daysUntilBestEnd,
      notify30DaysBefore: notify30DaysBefore,
      storageCondition: shelfLife.storageCondition,
      storageTips: shelfLife.storageTips || []
    };
  },

  /**
   * 检查储存风险（物流温度是否超过35℃）
   */
  checkStorageRisk: function(traceId) {
    var timeline = mockData.getSupplyChainTimeline(traceId);
    if (!timeline || !timeline.timeline) {
      return null;
    }

    var riskData = {
      hasRisk: false,
      maxTemp: null,
      warningThreshold: 35,
      warningRecords: [],
      allRecords: [],
      carrier: '',
      waybillNo: ''
    };

    for (var i = 0; i < timeline.timeline.length; i++) {
      var node = timeline.timeline[i];
      if (node.type === 'logistics' && node.detail && node.detail.temperatureMonitor) {
        var tempMonitor = node.detail.temperatureMonitor;
        riskData.carrier = node.detail.carrier || '';
        riskData.waybillNo = node.detail.waybillNo || '';
        riskData.maxTemp = tempMonitor.maxTemp || null;
        riskData.warningThreshold = tempMonitor.warningThreshold || 35;
        riskData.allRecords = tempMonitor.records || [];
        if (tempMonitor.tempWarning) {
          riskData.hasRisk = true;
          riskData.warningRecords = (tempMonitor.records || []).filter(function(r) {
            return r.status === 'warning' || r.temp > riskData.warningThreshold;
          });
        }
        break;
      }
    }

    return riskData;
  },

  /**
   * 切换保质期提醒订阅状态
   */
  toggleShelfLifeSubscription: function() {
    var that = this;
    var traceData = this.data.traceData;
    if (!traceData || !traceData.basicInfo) return;

    var basicInfo = traceData.basicInfo;
    var traceId = basicInfo.traceId;
    var batchNo = basicInfo.batchNo;
    var productName = basicInfo.productName;
    var bestBeforeDate = basicInfo.shelfLife ? basicInfo.shelfLife.bestBeforeDate : '';

    if (this.data.shelfLifeSubscribed) {
      subscription.unsubscribeShelfLife(traceId);
      this.setData({ shelfLifeSubscribed: false });
      wx.showToast({
        title: '已关闭提醒',
        icon: 'none',
        duration: 1500
      });
    } else {
      subscription.subscribeShelfLife(traceId, batchNo, productName, bestBeforeDate);
      this.setData({ shelfLifeSubscribed: true });
      wx.showToast({
        title: '已开启提醒',
        icon: 'success',
        duration: 1500
      });
      setTimeout(function() {
        wx.showModal({
          title: '订阅成功',
          content: '我们将在最佳品饮期结束前30天通过消息通知您，请保持小程序消息通知开启。',
          showCancel: false,
          confirmText: '知道了'
        });
      }, 600);
    }
  },

  /**
   * 打开保质期详情弹窗
   */
  openShelfLifeDetail: function() {
    if (!this.data.shelfLifeData) return;
    this.setData({ showShelfLifeDetailModal: true });
  },

  /**
   * 关闭保质期详情弹窗
   */
  closeShelfLifeDetail: function() {
    this.setData({ showShelfLifeDetailModal: false });
  },

  /**
   * 查看储存风险详情
   */
  viewStorageRiskDetail: function() {
    var risk = this.data.storageRiskData;
    if (!risk || !risk.hasRisk) return;

    var warningList = risk.warningRecords.map(function(r) {
      return '• ' + r.time + ' ' + r.location + '：' + r.temp + '℃';
    }).join('\n');

    wx.showModal({
      title: '储存风险预警详情',
      content: '检测到物流运输过程中温度超过' + risk.warningThreshold + '℃，可能影响茶叶品质。\n\n异常记录：\n' + warningList + '\n\n建议：\n1. 收到茶叶后尽快转移至阴凉干燥处\n2. 建议在2个月内饮用完毕\n3. 饮用前检查茶叶是否有异味或霉变',
      showCancel: false,
      confirmText: '我知道了',
      confirmColor: '#FF4D4F'
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
    if (this._ttsManager) {
      this._ttsManager.stop();
      this._ttsManager.destroy();
      this._ttsManager = null;
    }

    marketingAnalytics.trackPageLeave('detail', {
      traceId: this.data.traceId,
      productName: this.data.traceData ? this.data.traceData.basicInfo.productName : ''
    });
  },

  // ============================================================
  // ==================== 语音播报功能方法 ====================
  // ============================================================

  initTTS: function() {
    var that = this;
    this._ttsManager = tts.getTTSManager();

    var speed = this._ttsManager.getSpeed();
    var volume = this._ttsManager.getVolume();
    var enabled = this._ttsManager.isEnabled();

    this.setData({
      ttsSpeed: speed,
      ttsVolume: volume,
      ttsEnabled: enabled
    });

    this._ttsManager.onStart(function(info) {
      that.setData({
        ttsIsPlaying: true,
        ttsIsPaused: false,
        ttsCurrentText: info.text,
        ttsProgress: 0,
        ttsShowControl: true
      });
    });

    this._ttsManager.onEnd(function(info) {
      that.setData({
        ttsIsPlaying: false,
        ttsIsPaused: false,
        ttsProgress: 100
      });
    });

    this._ttsManager.onError(function(err) {
      console.error('[Detail] TTS 播放错误:', err);
      that.setData({
        ttsIsPlaying: false,
        ttsIsPaused: false
      });
    });

    this._ttsManager.onProgress(function(info) {
      var data = {
        ttsProgress: Math.round(info.progress * 100),
        ttsCurrentText: info.text
      };
      if (info.queueIndex !== undefined) {
        var queueData = that.data.ttsQueueData;
        if (queueData && queueData[info.queueIndex]) {
          data.ttsCurrentModule = queueData[info.queueIndex].key || '';
        }
      }
      that.setData(data);
    });
  },

  speakModule: function(e) {
    var moduleKey = e.currentTarget.dataset.module;
    if (!moduleKey) return;

    var traceData = this.data.traceData;
    if (!traceData) return;

    var moduleTexts = tts.buildDetailModuleTexts(traceData, {
      includeModules: [moduleKey]
    });

    if (moduleTexts && moduleTexts.length > 0) {
      var text = moduleTexts[0].text;
      this.setData({
        ttsMode: 'module',
        ttsCurrentModule: moduleKey
      });
      this._ttsManager.speak(text);
    }
  },

  startContinuousSpeak: function() {
    var traceData = this.data.traceData;
    if (!traceData) return;

    var moduleTexts = tts.buildDetailModuleTexts(traceData);
    if (!moduleTexts || moduleTexts.length === 0) {
      wx.showToast({
        title: '暂无可朗读内容',
        icon: 'none'
      });
      return;
    }

    var texts = moduleTexts.map(function(item) { return item.text; });

    this.setData({
      ttsMode: 'continuous',
      ttsQueueData: moduleTexts,
      ttsCurrentModule: moduleTexts[0] ? moduleTexts[0].key : ''
    });

    this._ttsManager.speakQueue(texts, { interval: 500 });
  },

  toggleTTsPlay: function() {
    if (this.data.ttsIsPlaying) {
      if (this.data.ttsIsPaused) {
        this.resumeTTS();
      } else {
        this.pauseTTS();
      }
    } else {
      if (this.data.ttsMode === 'continuous') {
        this.startContinuousSpeak();
      }
    }
  },

  pauseTTS: function() {
    if (this._ttsManager) {
      this._ttsManager.pause();
      this.setData({ ttsIsPaused: true });
    }
  },

  resumeTTS: function() {
    if (this._ttsManager) {
      this._ttsManager.resume();
      this.setData({ ttsIsPaused: false });
    }
  },

  stopTTS: function() {
    if (this._ttsManager) {
      this._ttsManager.stop();
      this.setData({
        ttsIsPlaying: false,
        ttsIsPaused: false,
        ttsProgress: 0,
        ttsCurrentModule: '',
        ttsCurrentText: ''
      });
    }
  },

  toggleTTSControl: function() {
    this.setData({
      ttsShowControl: !this.data.ttsShowControl
    });
  },

  setTTSSpeed: function(e) {
    var speed = e.currentTarget.dataset.speed;
    if (this._ttsManager && speed) {
      var newSpeed = this._ttsManager.setSpeed(parseFloat(speed));
      this.setData({ ttsSpeed: newSpeed });
      wx.showToast({
        title: '语速：' + newSpeed + 'x',
        icon: 'none',
        duration: 1000
      });
    }
  },

  setTTSVolume: function(e) {
    var volume = e.currentTarget.dataset.volume;
    if (this._ttsManager && volume) {
      var newVolume = this._ttsManager.setVolume(parseFloat(volume));
      this.setData({ ttsVolume: newVolume });
      var label = newVolume >= 0.8 ? '最大' : newVolume >= 0.5 ? '高' : newVolume >= 0.2 ? '中' : '低';
      wx.showToast({
        title: '音量：' + label,
        icon: 'none',
        duration: 1000
      });
    }
  },

  toggleTTSEnabled: function() {
    var newEnabled = !this.data.ttsEnabled;
    if (this._ttsManager) {
      this._ttsManager.setEnabled(newEnabled);
    }
    this.setData({ ttsEnabled: newEnabled });

    if (!newEnabled) {
      this.stopTTS();
      wx.showToast({
        title: '已关闭语音播报',
        icon: 'none'
      });
    } else {
      wx.showToast({
        title: '已开启语音播报',
        icon: 'success'
      });
    }
  },

  getTTSSpeedOptions: function() {
    return this._ttsManager ? this._ttsManager.getSpeedOptions() : [];
  },

  getTTSVolumeOptions: function() {
    return this._ttsManager ? this._ttsManager.getVolumeOptions() : [];
  },

  openExportModal: function() {
    this.setData({
      showExportModal: true,
      exportWatermarkInfo: traceExport.generateWatermark()
    });
  },

  closeExportModal: function() {
    if (this.data.exporting) return;
    this.setData({ showExportModal: false });
  },

  selectExportFormat: function(e) {
    const format = e.currentTarget.dataset.format;
    this.setData({ exportFormat: format });
  },

  selectExportScope: function(e) {
    const scope = e.currentTarget.dataset.scope;
    this.setData({ exportScope: scope });
  },

  doExport: function() {
    var that = this;
    var traceId = this.data.traceId;
    var format = this.data.exportFormat;
    var scope = this.data.exportScope;

    if (!traceId) {
      wx.showToast({ title: '溯源ID缺失', icon: 'none' });
      return;
    }

    this.setData({ exporting: true });
    wx.showLoading({ title: '正在导出...', mask: true });

    traceExport.doExport([traceId], format, scope)
      .then(function(result) {
        wx.hideLoading();
        that.setData({ exporting: false, showExportModal: false });

        var formatLabel = traceExport.FORMAT_LABELS[format];
        var scopeLabel = traceExport.SCOPE_LABELS[scope];

        wx.showModal({
          title: '导出成功',
          content: formatLabel + '文件已生成\n范围：' + scopeLabel + '\n文件：' + result.fileName + (result.note ? '\n\n' + result.note : ''),
          confirmText: '打开文件',
          cancelText: '知道了',
          success: function(res) {
            if (res.confirm) {
              traceExport.openExportedFile(result.filePath, result.fileName);
            }
          }
        });

        marketingAnalytics.trackEvent('trace_export', {
          traceId: traceId,
          format: format,
          scope: scope,
          count: 1
        });
      })
      .catch(function(err) {
        wx.hideLoading();
        that.setData({ exporting: false });
        console.error('[Detail] 导出失败:', err);
        wx.showToast({
          title: '导出失败：' + (err.message || '未知错误'),
          icon: 'none',
          duration: 3000
        });
      });
  }
});
