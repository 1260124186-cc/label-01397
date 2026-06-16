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
    lazyImageMap: {}
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
        
        that.setData({
          traceData: data,
          loading: false,
          skeletonLoading: false,
          moduleCollapsed: moduleCollapsed,
          lazyImageMap: lazyImageMap
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
  }
});
