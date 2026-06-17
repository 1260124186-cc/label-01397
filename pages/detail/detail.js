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
    processComparisonData: null
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
        
        that.setData({
          traceData: data,
          loading: false,
          skeletonLoading: false,
          moduleCollapsed: moduleCollapsed,
          lazyImageMap: lazyImageMap,
          testChartData: testChartData
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

  /**
   * 生命周期函数 - 页面卸载
   */
  onUnload: function() {
    if (this.timelineTimer) {
      clearInterval(this.timelineTimer);
      this.timelineTimer = null;
    }
  }
});
