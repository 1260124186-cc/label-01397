/**
 * 桂花茶溯源小程序 - 溯源详情页
 * 功能：展示完整溯源信息（基础信息、树龄、窨制工艺、绿色溯源、农残检测等）
 * 页面路径：pages/detail/detail
 */

// 引入模拟数据模块
const mockData = require('../../utils/mockData.js');

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
    // 是否显示返回顶部按钮
    showBackTop: false,
    // 当前展开的工艺步骤索引
    activeProcessStep: -1,
    // 是否显示PDF报告弹窗
    showPdfModal: false,
    // 页面滚动位置
    scrollTop: 0
  },

  /**
   * 生命周期函数 - 页面加载
   * @param {object} options - 页面参数，包含 traceId
   */
  onLoad: function(options) {
    console.log('详情页加载，参数：', options);
    
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
   * ==================== 数据加载 ====================
   * 加载溯源数据
   * @param {string} traceId - 溯源ID
   * 
   * 【后端接口预留】
   * 当前使用本地模拟数据，实际项目应调用后端接口：
   * 
   * loadTraceDataFromServer: function(traceId) {
   *   wx.showLoading({ title: '加载中...', mask: true });
   *   
   *   wx.request({
   *     url: `${getApp().globalData.apiBaseUrl}/detail`,
   *     method: 'GET',
   *     data: { traceId: traceId },
   *     header: { 'content-type': 'application/json' },
   *     success: (res) => {
   *       wx.hideLoading();
   *       if (res.statusCode === 200 && res.data.code === 0) {
   *         this.setData({
   *           traceData: res.data.data,
   *           loading: false
   *         });
   *       } else {
   *         wx.showToast({ title: res.data.message || '加载失败', icon: 'none' });
   *       }
   *     },
   *     fail: (err) => {
   *       wx.hideLoading();
   *       wx.showToast({ title: '网络请求失败', icon: 'none' });
   *     }
   *   });
   * }
   */
  loadTraceData: function(traceId) {
    const that = this;
    
    // 显示加载状态
    wx.showLoading({
      title: '加载溯源信息...',
      mask: true
    });
    
    // 模拟网络延迟
    setTimeout(() => {
      wx.hideLoading();
      
      // 从本地模拟数据获取
      const data = mockData.getTraceData(traceId);
      
      if (data) {
        that.setData({
          traceData: data,
          loading: false
        });
        
        // 设置导航栏标题
        wx.setNavigationBarTitle({
          title: data.basicInfo.productName + '溯源'
        });
      } else {
        wx.showToast({
          title: '未找到溯源信息',
          icon: 'none'
        });
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      }
    }, 600);
  },

  /**
   * ==================== 页面交互 ====================
   */
  
  /**
   * 页面滚动事件
   */
  onPageScroll: function(e) {
    // 滚动超过500rpx显示返回顶部按钮
    const showBackTop = e.scrollTop > 300;
    if (this.data.showBackTop !== showBackTop) {
      this.setData({ showBackTop: showBackTop });
    }
    this.setData({ scrollTop: e.scrollTop });
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
    console.log('触发下拉刷新');
    
    // 重新加载数据
    this.loadTraceData(this.data.traceId);
    
    // 停止下拉刷新动画
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 800);
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
   * 打开弹窗时保存当前滚动位置，禁止底层滚动
   */
  showPdfReport: function() {
    const scrollTop = this.data.scrollTop || 0;
    this.savedScrollTop = scrollTop;
    this.setData({ showPdfModal: true });
  },

  /**
   * 关闭PDF报告弹窗
   * 关闭弹窗时恢复滚动位置
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
    // 空函数，阻止事件冒泡
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
      }
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    const data = this.data.traceData;
    return {
      title: `${data.basicInfo.productName} - 全链路溯源信息`,
      path: `/pages/index/index?traceId=${this.data.traceId}`,
      imageUrl: ''
    };
  }
});
