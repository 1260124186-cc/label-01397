/**
 * 桂花茶溯源小程序 - 溯源详情页
 * 功能：展示完整溯源信息（基础信息、树龄、窨制工艺、绿色溯源、农残检测等）
 * 页面路径：pages/detail/detail
 */

// 引入模拟数据模块
const mockData = require('../../utils/mockData.js');

// 锚点 Tab 配置
const ANCHOR_TABS = [
  { key: 'basic', label: '基础信息', icon: '📋' },
  { key: 'treeAge', label: '树龄', icon: '🌳' },
  { key: 'location', label: '产地', icon: '📍' },
  { key: 'process', label: '工艺', icon: '🫖' },
  { key: 'green', label: '绿色', icon: '♻️' },
  { key: 'test', label: '检测', icon: '🔬' },
  { key: 'brew', label: '冲泡', icon: '☕' },
  { key: 'blockchain', label: '存证', icon: '🔗' }
];

// 核心模块（默认展开）
const CORE_MODULES = ['treeAge', 'process', 'green'];

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
    // 锚点 Tab 列表
    anchorTabs: ANCHOR_TABS,
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
    dosageResult: null
  },

  /**
   * 生命周期函数 - 页面加载
   * @param {object} options - 页面参数，包含 traceId
   */
  onLoad: function(options) {
    console.log('[Detail] 详情页加载，参数：', options);
    
    const traceId = options.traceId;
    
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
        ANCHOR_TABS.forEach(tab => {
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
          brewStepTimerText: initialBrewStepTimerText
        });
        
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
      ANCHOR_TABS.forEach((tab, index) => {
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
    let activeKey = ANCHOR_TABS[0].key;
    
    // 找到当前滚动位置对应的模块
    for (let i = ANCHOR_TABS.length - 1; i >= 0; i--) {
      const tab = ANCHOR_TABS[i];
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

  /**
   * 用户点击右上角分享
   * 修改为直达详情页路径，减少跳转步骤
   */
  onShareAppMessage: function() {
    const data = this.data.traceData;
    return {
      title: `${data.basicInfo.productName} - 全链路溯源信息`,
      path: `/pages/detail/detail?traceId=${this.data.traceId}`,
      imageUrl: data.basicInfo.thumbnail || ''
    };
  },

  /**
   * 分享到朋友圈
   */
  onShareTimeline: function() {
    const data = this.data.traceData;
    return {
      title: `${data.basicInfo.productName} - 全链路溯源信息`,
      query: `traceId=${this.data.traceId}`,
      imageUrl: data.basicInfo.thumbnail || ''
    };
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
        return {
          ...test,
          percent: percent,
          level: level,
          isPass: isPass,
          multiple: (test.limit / test.value).toFixed(1)
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
