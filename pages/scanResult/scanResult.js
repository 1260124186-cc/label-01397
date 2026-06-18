const mockData = require('../../utils/mockData.js');
const antiCounterfeit = require('../../utils/antiCounterfeit.js');
const greenPoints = require('../../utils/greenPoints.js');
const channelTrace = require('../../utils/channelTrace.js');

Page({
  data: {
    traceId: '',
    scanType: '',
    loading: true,
    verifyResult: null,
    showAlerts: false,
    showHistory: false,
    showChannelFlow: true,
    productInfo: null,
    channelFlow: [],
    channelSummary: '',
    divergenceAlert: null,
    showDivergenceAlert: false
  },

  onLoad: function(options) {
    console.log('[防伪验真] 扫码结果页加载，参数：', options);

    const traceId = options.traceId;
    const scanType = options.scanType || 'qrCode';

    if (traceId) {
      this.setData({
        traceId: traceId,
        scanType: scanType
      });
      this.verifyProduct(traceId);
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

  verifyProduct: async function(traceId) {
    const that = this;

    wx.showLoading({
      title: '防伪验证中...',
      mask: true
    });

    try {
      const result = await antiCounterfeit.verifyProduct(traceId);

      wx.hideLoading();

      if (result.success) {
        const traceData = mockData.getTraceData(traceId);
        const channelFlow = channelTrace.getDisplayChannelFlow(traceId);
        const channelSummary = that.buildChannelSummary(channelFlow);

        const currentScan = result.scanInfo.currentScan;
        const divergenceResult = channelTrace.checkDivergence(
          traceId,
          currentScan.location,
          currentScan.location
        );

        that.setData({
          verifyResult: result,
          productInfo: traceData ? traceData.basicInfo : null,
          loading: false,
          showAlerts: result.abnormal && result.abnormal.isAbnormal,
          channelFlow: channelFlow,
          channelSummary: channelSummary,
          divergenceAlert: divergenceResult.isDivergence ? divergenceResult : null,
          showDivergenceAlert: divergenceResult.isDivergence
        });

        var pointsResult = greenPoints.earnPoints('scan', '扫码溯源:' + traceId);
        if (pointsResult.earned > 0) {
          console.log('[Scan] 扫码获得积分:', pointsResult.earned);
        }

        var app = getApp();
        if (app.processInviteReward) {
          app.processInviteReward(traceId);
        }
      } else {
        wx.showToast({
          title: result.error || '验证失败',
          icon: 'none',
          duration: 2000
        });
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      }
    } catch (error) {
      wx.hideLoading();
      console.error('[防伪验真] 验证出错:', error);
      wx.showToast({
        title: '验证失败，请重试',
        icon: 'none'
      });
    }
  },

  confirmToDetail: function() {
    const traceId = this.data.traceId;

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
  },

  cancelAndBack: function() {
    wx.navigateBack();
  },

  rescan: function() {
    wx.navigateBack({
      delta: 1
    });
  },

  toggleAlerts: function() {
    this.setData({
      showAlerts: !this.data.showAlerts
    });
  },

  toggleHistory: function() {
    this.setData({
      showHistory: !this.data.showHistory
    });
  },

  goToReport: function() {
    const traceId = this.data.traceId;
    const productInfo = this.data.productInfo;

    wx.navigateTo({
      url: `/pages/reportProduct/reportProduct?traceId=${traceId}&productName=${encodeURIComponent(productInfo ? productInfo.productName : '')}`,
      success: function() {
        console.log('跳转举报页成功');
      },
      fail: function(err) {
        console.error('跳转举报页失败：', err);
        wx.showToast({
          title: '页面跳转失败',
          icon: 'none'
        });
      }
    });
  },

  openARExperience: function(e) {
    var scene = e.currentTarget.dataset.scene || 'tree';
    var traceId = this.data.traceId;
    wx.navigateTo({
      url: '/pages/arExperience/arExperience?mode=scan&traceId=' + traceId + '&scene=' + scene
    });
  },

  getRiskLevelText: function(level) {
    const map = {
      'normal': '正常',
      'warning': '警告',
      'danger': '危险'
    };
    return map[level] || '未知';
  },

  getAuthenticityText: function(authenticity) {
    const map = {
      'genuine': '正品',
      'suspicious': '存疑',
      'fake': '仿冒'
    };
    return map[authenticity] || '未知';
  },

  buildChannelSummary: function(channelFlow) {
    if (!channelFlow || channelFlow.length === 0) {
      return '渠道信息暂无';
    }
    const names = channelFlow
      .filter(f => f.role !== '生产厂家')
      .map(f => f.name);
    if (names.length === 0) {
      return '厂家直供';
    }
    return '经 ' + names.join('、');
  },

  toggleChannelFlow: function() {
    this.setData({
      showChannelFlow: !this.data.showChannelFlow
    });
  },

  toggleDivergenceAlert: function() {
    this.setData({
      showDivergenceAlert: !this.data.showDivergenceAlert
    });
  },

  goToDealerPage: function() {
    wx.navigateTo({
      url: '/pages/dealer/index',
      fail: function(err) {
        console.error('跳转经销商页失败:', err);
      }
    });
  }
});
