const mockData = require('../../utils/mockData.js');
const antiCounterfeit = require('../../utils/antiCounterfeit.js');
const greenPoints = require('../../utils/greenPoints.js');
const channelTrace = require('../../utils/channelTrace.js');
const i18n = require('../../utils/i18n/index.js');
const tts = require('../../utils/tts.js');

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
    showDivergenceAlert: false,
    recallInfo: null,
    a11yClasses: '',
    giftBoxInfo: null,
    giftBoxVerify: null,
    giftBoxItems: [],
    isGiftBoxMainCode: false,
    isGiftBoxSubCode: false,
    subCodeContext: null,
    ttsEnabled: true,
    ttsIsPlaying: false,
    ttsIsPaused: false,
    ttsShowControl: false,
    ttsSpeed: 1.0,
    ttsVolume: 1.0,
    ttsProgress: 0,
    ttsCurrentText: '',
    autoSpeakDone: false
  },

  onLoad: function(options) {
    console.log('[防伪验真] 扫码结果页加载，参数：', options);

    const traceId = options.traceId;
    const scanType = options.scanType || 'qrCode';
    const a11yData = i18n.getA11yData();

    this.initTTS();

    if (traceId) {
      this.setData({
        traceId: traceId,
        scanType: scanType,
        a11yClasses: a11yData.classes
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
      const result = await antiCounterfeit.verifyProductEnhanced(traceId);

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

        const recallInfo = mockData.isRecalledProduct(traceId)
          ? mockData.getRecallByTraceId(traceId)
          : null;

        const isMain = mockData.isGiftBoxMainCode(traceId);
        const isSub = mockData.isGiftBoxSubCode(traceId);

        let setDataObj = {
          verifyResult: result,
          productInfo: traceData ? traceData.basicInfo : null,
          loading: false,
          showAlerts: result.abnormal && result.abnormal.isAbnormal,
          channelFlow: channelFlow,
          channelSummary: channelSummary,
          divergenceAlert: divergenceResult.isDivergence ? divergenceResult : null,
          showDivergenceAlert: divergenceResult.isDivergence,
          recallInfo: recallInfo,
          isGiftBoxMainCode: isMain,
          isGiftBoxSubCode: isSub,
          giftBoxInfo: result.giftBoxInfo || null,
          giftBoxItems: result.giftBoxItems || []
        };

        if (result.giftBox) {
          if (result.giftBox.type === 'main_code') {
            setDataObj.giftBoxVerify = {
              giftBoxId: result.giftBox.giftBoxId,
              giftBoxName: result.giftBox.giftBoxName,
              totalItems: result.giftBox.totalItems,
              firstScanCount: result.giftBox.firstScanCount,
              allFirstVerified: result.giftBox.allFirstVerified,
              authenticityStatus: result.giftBox.authenticityStatus,
              statusTitle: result.giftBox.statusTitle,
              statusMessage: result.giftBox.statusMessage,
              subCodeResults: result.giftBox.subCodeResults,
              progressPercent: result.giftBox.progressPercent
            };
          } else if (result.giftBox.type === 'sub_code' && result.giftBox.context) {
            setDataObj.subCodeContext = result.giftBox.context;
          }
        }

        that.setData(setDataObj, function() {
          that.autoSpeakVerifyResult();
        });

        if (recallInfo) {
          wx.showModal({
            title: '⚠️ 产品安全召回警示',
            content: '您扫码的产品属于召回批次：' + recallInfo.issueCategory + '。为了您的健康，建议立即停止食用并登记召回。',
            confirmText: '查看召回详情',
            cancelText: '我已知晓',
            confirmColor: '#D32F2F',
            success: function(res) {
              if (res.confirm) {
                that.goToRecallDetail();
              }
            }
          });
        }

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

  goToRecallDetail: function() {
    const traceId = this.data.traceId;
    const recallInfo = this.data.recallInfo;

    let url = '/pages/recall/detail?';
    if (traceId) {
      url += 'traceId=' + traceId;
    } else if (recallInfo && recallInfo.batchNo) {
      url += 'batchNo=' + recallInfo.batchNo;
    }

    wx.navigateTo({
      url: url,
      success: function() {
        console.log('[Scan] 跳转召回详情页成功');
      },
      fail: function(err) {
        console.error('[Scan] 跳转召回详情页失败：', err);
        wx.showToast({
          title: '页面跳转失败',
          icon: 'none'
        });
      }
    });
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
  },

  goToSubItemDetail: function(e) {
    const traceId = e.currentTarget.dataset.traceId;
    if (!traceId) return;
    wx.navigateTo({
      url: `/pages/detail/detail?traceId=${traceId}`,
      success: function() {
        console.log('[Scan] 跳转子产品详情页成功:', traceId);
      },
      fail: function(err) {
        console.error('[Scan] 跳转子产品详情页失败：', err);
        wx.showToast({
          title: '页面跳转失败',
          icon: 'none'
        });
      }
    });
  },

  goToGiftBoxMainPage: function() {
    const context = this.data.subCodeContext;
    if (!context || !context.mainTraceId) return;
    wx.navigateTo({
      url: `/pages/scanResult/scanResult?traceId=${context.mainTraceId}`,
      success: function() {
        console.log('[Scan] 跳转礼盒主码页成功');
      },
      fail: function(err) {
        console.error('[Scan] 跳转礼盒主码页失败：', err);
      }
    });
  },

  goToGiftBoxDetailPage: function() {
    const context = this.data.subCodeContext;
    if (!context || !context.mainTraceId) return;
    wx.navigateTo({
      url: `/pages/detail/detail?traceId=${context.mainTraceId}`,
      success: function() {
        console.log('[Scan] 跳转礼盒详情页成功');
      },
      fail: function(err) {
        console.error('[Scan] 跳转礼盒详情页失败：', err);
      }
    });
  },

  viewSubItemScanInfo: function(e) {
    const idx = e.currentTarget.dataset.index;
    const subResults = this.data.giftBoxVerify.subCodeResults;
    if (!subResults || !subResults[idx]) return;
    const item = subResults[idx];
    const statusText = item.isFirstScan ? '首次验证' : `已查询 ${item.scanCount} 次`;
    const firstScanText = item.firstScanTime ? `\n首次验证：${item.firstScanTime}` : '';
    wx.showModal({
      title: `第${item.index}件：${item.name}`,
      content: `验证状态：${statusText}${firstScanText}`,
      confirmText: '查看详情',
      cancelText: '关闭',
      success: (res) => {
        if (res.confirm) {
          wx.navigateTo({
            url: `/pages/detail/detail?traceId=${item.traceId}`
          });
        }
      }
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
      console.error('[ScanResult] TTS 播放错误:', err);
      that.setData({
        ttsIsPlaying: false,
        ttsIsPaused: false
      });
    });

    this._ttsManager.onProgress(function(info) {
      that.setData({
        ttsProgress: Math.round(info.progress * 100),
        ttsCurrentText: info.text
      });
    });
  },

  autoSpeakVerifyResult: function() {
    if (this.data.autoSpeakDone) return;
    if (!this.data.ttsEnabled) return;

    var verifyResult = this.data.verifyResult;
    var productInfo = this.data.productInfo;
    var recallInfo = this.data.recallInfo;

    var speakText = tts.buildScanResultText(verifyResult, {
      productName: productInfo ? productInfo.productName : '',
      recallInfo: recallInfo
    });

    if (speakText) {
      this.setData({ autoSpeakDone: true });
      this._ttsManager.speak(speakText);
    }
  },

  speakVerifyResult: function() {
    var verifyResult = this.data.verifyResult;
    var productInfo = this.data.productInfo;
    var recallInfo = this.data.recallInfo;

    var speakText = tts.buildScanResultText(verifyResult, {
      productName: productInfo ? productInfo.productName : '',
      recallInfo: recallInfo
    });

    if (speakText) {
      this._ttsManager.speak(speakText);
    }
  },

  toggleTTsPlay: function() {
    if (this.data.ttsIsPlaying) {
      if (this.data.ttsIsPaused) {
        this.resumeTTS();
      } else {
        this.pauseTTS();
      }
    } else {
      this.speakVerifyResult();
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

  onUnload: function() {
    if (this._ttsManager) {
      this._ttsManager.stop();
      this._ttsManager.destroy();
      this._ttsManager = null;
    }
  }
});
