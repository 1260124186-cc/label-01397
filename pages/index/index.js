/**
 * 桂花茶溯源小程序 - 首页
 * 功能：扫码溯源、手动输入溯源ID查询、扫码历史、批量查询、剪贴板识别
 * 页面路径：pages/index/index
 */

const mockData = require('../../utils/mockData.js');
const storage = require('../../utils/storage.js');

Page({
  data: {
    inputTraceId: '',
    showInputArea: false,
    showBatchArea: false,
    inputBatchNo: '',
    testIds: ['G001', 'G002', 'G003', 'G004'],
    testBatchNos: ['GH202503', 'GH202504'],
    brandName: '一茶一品・桂花茶溯源',
    pageLoaded: false,
    scanHistory: [],
    showHistory: false,
    showClipboardModal: false,
    clipboardTraceId: ''
  },

  onLoad: function(options) {
    console.log('首页加载，参数：', options);
    
    setTimeout(() => {
      this.setData({ pageLoaded: true });
    }, 100);
    
    if (options.traceId) {
      this.queryTraceInfo(options.traceId);
      return;
    }
    
    if (options.scene) {
      const traceId = mockData.parseSceneParam(options.scene);
      if (traceId) {
        this.queryTraceInfo(traceId);
        return;
      }
    }
    
    this.loadScanHistory();
  },

  onShow: function() {
    this.setData({ inputTraceId: '', inputBatchNo: '' });
    this.loadScanHistory();
    this.checkClipboard();
  },

  loadScanHistory: function() {
    const history = storage.getScanHistory();
    const formattedHistory = history.map(item => ({
      ...item,
      formatTime: storage.formatTime(item.timestamp)
    }));
    this.setData({ 
      scanHistory: formattedHistory,
      showHistory: formattedHistory.length > 0
    });
  },

  checkClipboard: function() {
    const that = this;
    
    wx.getClipboardData({
      success: function(res) {
        const clipboardContent = res.data && res.data.trim();
        console.log('剪贴板内容:', clipboardContent);
        
        if (!clipboardContent) return;
        
        const traceId = that.parseTraceId(clipboardContent);
        if (traceId && mockData.validateTraceId(traceId)) {
          const traceData = mockData.getTraceData(traceId);
          if (traceData) {
            that.setData({
              showClipboardModal: true,
              clipboardTraceId: traceId
            });
          }
        }
      },
      fail: function(err) {
        console.log('获取剪贴板失败:', err);
      }
    });
  },

  handleClipboardConfirm: function() {
    const traceId = this.data.clipboardTraceId;
    this.setData({ showClipboardModal: false });
    this.queryTraceInfo(traceId);
  },

  handleClipboardCancel: function() {
    this.setData({ showClipboardModal: false });
  },

  preventBubble: function() {
  },

  handleScanCode: function() {
    const that = this;
    
    wx.showLoading({
      title: '正在启动扫码...',
      mask: true
    });

    wx.scanCode({
      scanType: ['qrCode', 'barCode'],
      success: function(res) {
        console.log('扫码成功，结果：', res);
        wx.hideLoading();
        
        const scanResult = res.result;
        const scanType = res.scanType;
        
        let traceId = null;
        
        if (scanType === 'barCode') {
          traceId = mockData.getTraceIdFromBarcode(scanResult);
        } else {
          traceId = that.parseTraceId(scanResult);
        }
        
        if (traceId) {
          that.navigateToScanResult(traceId, scanType);
        } else {
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

  navigateToScanResult: function(traceId, scanType) {
    const that = this;
    
    const traceData = mockData.getTraceData(traceId);
    if (traceData) {
      storage.addScanRecord({
        traceId: traceId,
        productName: traceData.basicInfo.productName
      });
    }
    
    wx.navigateTo({
      url: `/pages/scanResult/scanResult?traceId=${traceId}&scanType=${scanType}`,
      success: function() {
        console.log('跳转扫码结果页成功');
        that.loadScanHistory();
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

  parseTraceId: function(scanResult) {
    if (!scanResult) return null;
    
    let traceId = null;
    
    if (scanResult.includes('?')) {
      const urlParams = new URLSearchParams(scanResult.split('?')[1]);
      traceId = urlParams.get('id') || urlParams.get('traceId');
    }
    
    if (!traceId && scanResult.startsWith('{')) {
      try {
        const jsonData = JSON.parse(scanResult);
        traceId = jsonData.traceId || jsonData.id;
      } catch (e) {
        console.log('JSON解析失败');
      }
    }
    
    if (!traceId) {
      if (mockData.validateTraceId(scanResult)) {
        traceId = scanResult;
      }
    }
    
    return traceId;
  },

  toggleInputArea: function() {
    this.setData({
      showInputArea: !this.data.showInputArea,
      showBatchArea: false
    });
  },

  toggleBatchArea: function() {
    this.setData({
      showBatchArea: !this.data.showBatchArea,
      showInputArea: false
    });
  },

  onInputChange: function(e) {
    this.setData({
      inputTraceId: e.detail.value
    });
  },

  onBatchInputChange: function(e) {
    this.setData({
      inputBatchNo: e.detail.value
    });
  },

  handleManualQuery: function() {
    const traceId = this.data.inputTraceId.trim();
    
    if (!traceId) {
      wx.showToast({
        title: '请输入溯源ID',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    
    if (!mockData.validateTraceId(traceId)) {
      wx.showToast({
        title: 'ID格式不正确，请检查',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    
    this.queryTraceInfo(traceId);
  },

  handleBatchQuery: function() {
    const batchNo = this.data.inputBatchNo.trim().toUpperCase();
    
    if (!batchNo) {
      wx.showToast({
        title: '请输入批次号',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    
    if (!mockData.validateBatchNo(batchNo)) {
      wx.showToast({
        title: '批次号格式不正确',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    
    wx.navigateTo({
      url: `/pages/batchList/batchList?batchNo=${batchNo}`,
      success: function() {
        console.log('跳转批次查询页成功');
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

  fillTestId: function(e) {
    const testId = e.currentTarget.dataset.id;
    this.setData({
      inputTraceId: testId,
      showInputArea: true,
      showBatchArea: false
    });
  },

  fillTestBatchNo: function(e) {
    const batchNo = e.currentTarget.dataset.batch;
    this.setData({
      inputBatchNo: batchNo,
      showBatchArea: true,
      showInputArea: false
    });
  },

  viewHistoryItem: function(e) {
    const traceId = e.currentTarget.dataset.traceid;
    this.queryTraceInfo(traceId);
  },

  deleteHistoryItem: function(e) {
    const that = this;
    const id = e.currentTarget.dataset.id;
    
    wx.showModal({
      title: '删除记录',
      content: '确定删除该条扫码记录吗？',
      success: function(res) {
        if (res.confirm) {
          storage.removeScanRecord(id);
          that.loadScanHistory();
          wx.showToast({
            title: '已删除',
            icon: 'success',
            duration: 1500
          });
        }
      }
    });
  },

  clearAllHistory: function() {
    const that = this;
    
    wx.showModal({
      title: '清空历史',
      content: '确定清空所有扫码历史吗？此操作不可恢复。',
      confirmColor: '#ff4d4f',
      success: function(res) {
        if (res.confirm) {
          storage.clearScanHistory();
          that.loadScanHistory();
          wx.showToast({
            title: '已清空',
            icon: 'success',
            duration: 1500
          });
        }
      }
    });
  },

  queryTraceInfo: function(traceId) {
    const that = this;
    
    wx.showLoading({
      title: '正在查询...',
      mask: true
    });
    
    setTimeout(() => {
      wx.hideLoading();
      
      const traceData = mockData.getTraceData(traceId);
      
      if (traceData) {
        storage.addScanRecord({
          traceId: traceId,
          productName: traceData.basicInfo.productName
        });
        that.loadScanHistory();
        
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
        wx.showToast({
          title: '未找到该溯源信息',
          icon: 'none',
          duration: 2500
        });
      }
    }, 800);
  },

  onShareAppMessage: function() {
    return {
      title: '一茶一品・桂花茶溯源',
      path: '/pages/index/index',
      imageUrl: ''
    };
  }
});
