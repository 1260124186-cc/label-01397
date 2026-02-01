/**
 * 桂花茶溯源小程序 - 首页
 * 功能：扫码溯源、手动输入溯源ID查询
 * 页面路径：pages/index/index
 */

// 引入模拟数据模块
const mockData = require('../../utils/mockData.js');

Page({
  /**
   * 页面数据
   */
  data: {
    // 用户输入的溯源ID
    inputTraceId: '',
    // 是否显示输入区域
    showInputArea: false,
    // 可用的测试ID（用于提示）
    testIds: ['G001', 'G002'],
    // 品牌名称
    brandName: '一茶一品・桂花茶溯源',
    // 页面加载动画
    pageLoaded: false
  },

  /**
   * 生命周期函数 - 页面加载
   */
  onLoad: function(options) {
    console.log('首页加载，参数：', options);
    
    // 页面加载动画延迟
    setTimeout(() => {
      this.setData({ pageLoaded: true });
    }, 100);
    
    // 如果从分享链接进入，带有溯源ID参数
    if (options.traceId) {
      this.queryTraceInfo(options.traceId);
    }
  },

  /**
   * 生命周期函数 - 页面显示
   */
  onShow: function() {
    // 每次显示页面时重置输入框
    this.setData({ inputTraceId: '' });
  },

  /**
   * ==================== 核心功能：扫码溯源 ====================
   * 调用微信原生扫码API（wx.scanCode）
   * 解析二维码中的唯一溯源ID
   */
  handleScanCode: function() {
    const that = this;
    
    // 显示加载提示
    wx.showLoading({
      title: '正在启动扫码...',
      mask: true
    });

    // 调用微信扫码API
    wx.scanCode({
      // 只识别二维码
      scanType: ['qrCode'],
      success: function(res) {
        console.log('扫码成功，结果：', res);
        wx.hideLoading();
        
        // 获取扫码结果
        const scanResult = res.result;
        
        // 解析溯源ID（支持多种格式）
        const traceId = that.parseTraceId(scanResult);
        
        if (traceId) {
          // 查询溯源信息
          that.queryTraceInfo(traceId);
        } else {
          // 扫码结果无效
          wx.showToast({
            title: '未识别到有效溯源码',
            icon: 'none',
            duration: 2000
          });
        }
      },
      fail: function(err) {
        wx.hideLoading();
        console.error('扫码失败：', err);
        
        // 用户取消扫码不提示错误
        if (err.errMsg.indexOf('cancel') === -1) {
          wx.showToast({
            title: '扫码失败，请重试',
            icon: 'none',
            duration: 2000
          });
        }
      }
    });
  },

  /**
   * 解析扫码结果，提取溯源ID
   * @param {string} scanResult - 扫码原始结果
   * @returns {string|null} - 溯源ID或null
   * 
   * 支持的扫码格式：
   * 1. 纯ID：G001
   * 2. URL格式：https://trace.example.com/query?id=G001
   * 3. JSON格式：{"traceId": "G001"}
   */
  parseTraceId: function(scanResult) {
    if (!scanResult) return null;
    
    let traceId = null;
    
    // 格式1：URL参数格式
    if (scanResult.includes('?')) {
      const urlParams = new URLSearchParams(scanResult.split('?')[1]);
      traceId = urlParams.get('id') || urlParams.get('traceId');
    }
    
    // 格式2：JSON格式
    if (!traceId && scanResult.startsWith('{')) {
      try {
        const jsonData = JSON.parse(scanResult);
        traceId = jsonData.traceId || jsonData.id;
      } catch (e) {
        console.log('JSON解析失败');
      }
    }
    
    // 格式3：纯ID格式（默认）
    if (!traceId) {
      // 验证是否符合溯源ID格式
      if (mockData.validateTraceId(scanResult)) {
        traceId = scanResult;
      }
    }
    
    return traceId;
  },

  /**
   * ==================== 核心功能：手动输入查询 ====================
   */
  
  /**
   * 切换显示手动输入区域
   */
  toggleInputArea: function() {
    this.setData({
      showInputArea: !this.data.showInputArea
    });
  },

  /**
   * 监听输入框变化
   */
  onInputChange: function(e) {
    this.setData({
      inputTraceId: e.detail.value
    });
  },

  /**
   * 点击手动查询按钮
   */
  handleManualQuery: function() {
    const traceId = this.data.inputTraceId.trim();
    
    // 输入为空检查
    if (!traceId) {
      wx.showToast({
        title: '请输入溯源ID',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    
    // 格式验证
    if (!mockData.validateTraceId(traceId)) {
      wx.showToast({
        title: 'ID格式不正确，请检查',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    
    // 执行查询
    this.queryTraceInfo(traceId);
  },

  /**
   * 快速填入测试ID
   */
  fillTestId: function(e) {
    const testId = e.currentTarget.dataset.id;
    this.setData({
      inputTraceId: testId,
      showInputArea: true
    });
  },

  /**
   * ==================== 溯源数据查询 ====================
   * @param {string} traceId - 溯源ID
   * 
   * 【后端接口预留】
   * 当前使用本地模拟数据，实际项目应调用后端接口：
   * 
   * wx.request({
   *   url: `${getApp().globalData.apiBaseUrl}/query`,
   *   method: 'GET',
   *   data: { traceId: traceId },
   *   success: (res) => { ... },
   *   fail: (err) => { ... }
   * });
   */
  queryTraceInfo: function(traceId) {
    const that = this;
    
    // 显示加载动画
    wx.showLoading({
      title: '正在查询...',
      mask: true
    });
    
    // 模拟网络请求延迟（实际项目中为真实API调用）
    setTimeout(() => {
      wx.hideLoading();
      
      // 从本地模拟数据获取
      const traceData = mockData.getTraceData(traceId);
      
      if (traceData) {
        // 查询成功，跳转到详情页
        // 将数据存入全局或通过页面间传递
        wx.navigateTo({
          url: `/pages/detail/detail?traceId=${traceId}`,
          success: function() {
            console.log('跳转详情页成功');
          },
          fail: function(err) {
            console.error('跳转失败：', err);
            wx.showToast({
              title: '页面跳转失败',
              icon: 'none'
            });
          }
        });
      } else {
        // 未找到数据
        wx.showToast({
          title: '未找到该溯源信息',
          icon: 'none',
          duration: 2500
        });
      }
    }, 800); // 模拟800ms网络延迟
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: '一茶一品・桂花茶溯源',
      path: '/pages/index/index',
      imageUrl: '' // 可配置分享图片
    };
  }
});
