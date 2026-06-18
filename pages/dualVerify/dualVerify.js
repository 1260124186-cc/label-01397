const mockData = require('../../utils/mockData.js');
const antiCounterfeit = require('../../utils/antiCounterfeit.js');
const i18n = require('../../utils/i18n/index.js');

Page({
  data: {
    a11yClasses: '',

    currentStep: 0,
    totalSteps: 2,

    showGuideAnimation: true,
    guideStep: 0,
    animationTimer: null,

    outerCodeResult: null,
    innerCodeResult: null,
    verifyResult: null,

    scannedOuterCode: '',
    scannedInnerCode: '',

    loading: false,
    loadingText: '',

    showManualInput: false,
    manualInputCode: '',
    manualInputMode: 'outer',

    testOuterCodes: ['OUT-G001', 'OUT-G002', 'OUT-G003', 'OUT-G004'],
    testInnerCodes: ['INN-G001', 'INN-G002', 'INN-G003', 'INN-G004'],
    testMismatchInnerCode: 'INN-G002'
  },

  onLoad: function(options) {
    console.log('[双码验真] 页面加载，参数：', options);
    const a11yData = i18n.getA11yData();
    this.setData({
      a11yClasses: a11yData.classes
    });

    this.startGuideAnimation();

    const autoStart = options.autoStart;
    if (autoStart === '1' || autoStart === 'true') {
      setTimeout(() => {
        this.handleScanOuter();
      }, 600);
    }

    const outerCode = options.outerCode;
    if (outerCode && mockData.isOuterCode(outerCode)) {
      this.processOuterCode(outerCode);
    }
  },

  onUnload: function() {
    this.stopGuideAnimation();
  },

  onShow: function() {
    const a11yData = i18n.getA11yData();
    this.setData({
      a11yClasses: a11yData.classes
    });
  },

  startGuideAnimation: function() {
    this.stopGuideAnimation();
    this._guideTimer = setInterval(() => {
      const next = (this.data.guideStep + 1) % 3;
      this.setData({ guideStep: next });
    }, 2500);
  },

  stopGuideAnimation: function() {
    if (this._guideTimer) {
      clearInterval(this._guideTimer);
      this._guideTimer = null;
    }
  },

  handleSkipGuide: function() {
    this.stopGuideAnimation();
    this.setData({ showGuideAnimation: false });
  },

  handleScanOuter: function() {
    this.handleSkipGuide();
    const that = this;

    wx.showLoading({ title: '启动扫码...', mask: true });

    wx.scanCode({
      scanType: ['qrCode'],
      success: function(res) {
        wx.hideLoading();
        console.log('[双码验真] 扫码结果:', res.result);
        const dualCode = mockData.parseDualCodeFromScanResult(res.result);

        if (dualCode) {
          if (dualCode.codeType === 'outer') {
            that.processOuterCode(dualCode.code);
          } else {
            wx.showModal({
              title: '扫码顺序提示',
              content: '检测到您扫描的是内码。请先扫描外盒二维码，再开封扫描内码，以确保完成完整的双码验真流程。是否返回扫描外码？',
              confirmText: '去扫外码',
              cancelText: '直接验证',
              confirmColor: '#2E8B57',
              success: function(modalRes) {
                if (modalRes.cancel) {
                  that.processInnerCode(dualCode.code);
                }
              }
            });
          }
        } else {
          const traceId = that.parseTraceId(res.result);
          if (traceId && mockData.validateTraceId(traceId)) {
            wx.showModal({
              title: '检测到普通溯源码',
              content: '当前二维码为普通溯源码，如需体验双码验真功能，请扫描带有 OUT-/INN- 前缀的双码产品。是否跳转到普通验真页面？',
              confirmText: '去验真',
              cancelText: '返回',
              success: function(modalRes) {
                if (modalRes.confirm) {
                  wx.navigateTo({
                    url: `/pages/scanResult/scanResult?traceId=${traceId}`
                  });
                }
              }
            });
          } else {
            wx.showToast({
              title: '未识别到有效双码',
              icon: 'none',
              duration: 2500
            });
          }
        }
      },
      fail: function(err) {
        wx.hideLoading();
        if (err.errMsg.indexOf('cancel') === -1) {
          wx.showToast({ title: '扫码失败，请重试', icon: 'none' });
        }
      }
    });
  },

  handleScanInner: function() {
    this.handleSkipGuide();
    const that = this;

    wx.showLoading({ title: '启动扫码...', mask: true });

    wx.scanCode({
      scanType: ['qrCode'],
      success: function(res) {
        wx.hideLoading();
        const dualCode = mockData.parseDualCodeFromScanResult(res.result);

        if (dualCode) {
          if (dualCode.codeType === 'inner') {
            that.processInnerCode(dualCode.code);
          } else {
            wx.showToast({
              title: '请扫描内码（INN-开头）',
              icon: 'none',
              duration: 2500
            });
          }
        } else {
          wx.showToast({
            title: '未识别到有效内码',
            icon: 'none',
            duration: 2500
          });
        }
      },
      fail: function(err) {
        wx.hideLoading();
        if (err.errMsg.indexOf('cancel') === -1) {
          wx.showToast({ title: '扫码失败，请重试', icon: 'none' });
        }
      }
    });
  },

  processOuterCode: async function(code) {
    const that = this;
    this.setData({ loading: true, loadingText: '正在验证外码...' });

    try {
      const result = await antiCounterfeit.scanOuterCode(code);
      that.setData({ loading: false });

      if (result.success) {
        that.setData({
          currentStep: 1,
          outerCodeResult: result,
          scannedOuterCode: code
        });

        wx.showToast({
          title: '外码验证通过',
          icon: 'success',
          duration: 1500
        });

        setTimeout(() => {
          wx.showModal({
            title: '外码验证成功',
            content: '已获取产品概要信息。请确认外包装完好、防伪封口贴无破损后，撕开铝箔/内袋扫描内码，完成最终双重防伪验证。',
            confirmText: '去扫内码',
            cancelText: '稍后再扫',
            confirmColor: '#2E8B57',
            success: function(res) {
              if (res.confirm) {
                that.handleScanInner();
              }
            }
          });
        }, 800);
      } else {
        wx.showToast({
          title: result.error || '外码验证失败',
          icon: 'none',
          duration: 2500
        });
      }
    } catch (err) {
      that.setData({ loading: false });
      console.error('[双码验真] 外码验证出错:', err);
      wx.showToast({ title: '验证出错，请重试', icon: 'none' });
    }
  },

  processInnerCode: async function(code) {
    const that = this;
    this.setData({ loading: true, loadingText: '正在验证内码与绑定关系...' });

    try {
      const result = await antiCounterfeit.scanInnerCode(code);
      that.setData({ loading: false });

      if (result.success) {
        that.setData({
          currentStep: 2,
          innerCodeResult: result,
          verifyResult: result,
          scannedInnerCode: code
        });

        if (result.verifyStatus === 'binding_success') {
          wx.showToast({
            title: '双码验真通过！',
            icon: 'success',
            duration: 2000
          });
        } else {
          wx.showModal({
            title: '⚠️ 双码验证异常',
            content: result.message + '。是否立即前往举报页面？双码信息将自动带入，无需手动填写。',
            confirmText: '立即举报',
            cancelText: '稍后处理',
            confirmColor: '#D32F2F',
            success: function(modalRes) {
              if (modalRes.confirm) {
                that.goToReport();
              }
            }
          });
        }
      } else {
        if (result.needOuterScan) {
          wx.showModal({
            title: '请先扫描外码',
            content: result.error + '。是否返回扫描外码？',
            confirmText: '去扫外码',
            cancelText: '取消',
            confirmColor: '#2E8B57',
            success: function(modalRes) {
              if (modalRes.confirm) {
                that.handleScanOuter();
              }
            }
          });
        } else {
          wx.showToast({
            title: result.error || '内码验证失败',
            icon: 'none',
            duration: 2500
          });
        }
      }
    } catch (err) {
      that.setData({ loading: false });
      console.error('[双码验真] 内码验证出错:', err);
      wx.showToast({ title: '验证出错，请重试', icon: 'none' });
    }
  },

  parseTraceId: function(scanResult) {
    if (!scanResult) return null;
    let traceId = null;

    if (scanResult.includes('?')) {
      try {
        const urlParams = new URLSearchParams(scanResult.split('?')[1]);
        traceId = urlParams.get('id') || urlParams.get('traceId');
      } catch (e) {}
    }

    if (!traceId && scanResult.startsWith('{')) {
      try {
        const jsonData = JSON.parse(scanResult);
        traceId = jsonData.traceId || jsonData.id;
      } catch (e) {}
    }

    if (!traceId) {
      if (mockData.validateTraceId(scanResult)) {
        traceId = scanResult;
      }
    }
    return traceId;
  },

  handleRescanOuter: function() {
    const that = this;
    wx.showModal({
      title: '重新扫描外码',
      content: '重新扫描将清除当前进度，是否继续？',
      confirmColor: '#D32F2F',
      success: function(res) {
        if (res.confirm) {
          antiCounterfeit.clearLastOuterCodeScan();
          that.setData({
            currentStep: 0,
            outerCodeResult: null,
            innerCodeResult: null,
            verifyResult: null,
            scannedOuterCode: '',
            scannedInnerCode: ''
          });
          that.handleScanOuter();
        }
      }
    });
  },

  handleRescanInner: function() {
    const that = this;
    wx.showModal({
      title: '重新扫描内码',
      content: '重新扫描内码将使用已有的外码信息进行绑定验证，是否继续？',
      success: function(res) {
        if (res.confirm) {
          that.setData({
            currentStep: 1,
            innerCodeResult: null,
            verifyResult: null,
            scannedInnerCode: ''
          });
          that.handleScanInner();
        }
      }
    });
  },

  handleResetAll: function() {
    const that = this;
    wx.showModal({
      title: '重置双码验真',
      content: '确定要清除所有扫描信息，重新开始吗？',
      confirmColor: '#D32F2F',
      success: function(res) {
        if (res.confirm) {
          antiCounterfeit.clearLastOuterCodeScan();
          that.setData({
            currentStep: 0,
            showGuideAnimation: true,
            guideStep: 0,
            outerCodeResult: null,
            innerCodeResult: null,
            verifyResult: null,
            scannedOuterCode: '',
            scannedInnerCode: ''
          });
          that.startGuideAnimation();
        }
      }
    });
  },

  goToReport: function() {
    const result = this.data.verifyResult;
    const outer = this.data.outerCodeResult;

    const url = antiCounterfeit.goToDualReport(
      result ? result.outerCode : (outer ? outer.outerCode : ''),
      result ? result.innerCode : '',
      result ? result.errorType : '',
      result ? result.errorMessage : '',
      result ? result.traceId : (outer ? outer.traceId : ''),
      result ? result.productName : (outer ? outer.productSummary.productName : '')
    );

    wx.navigateTo({
      url: url,
      success: function() {
        console.log('[双码验真] 跳转举报页成功');
      },
      fail: function(err) {
        console.error('[双码验真] 跳转举报页失败:', err);
        wx.showToast({ title: '跳转失败', icon: 'none' });
      }
    });
  },

  goToDetail: function() {
    const result = this.data.verifyResult;
    const outer = this.data.outerCodeResult;
    const traceId = result ? result.traceId : (outer ? outer.traceId : null);

    if (!traceId) {
      wx.showToast({ title: '缺少溯源ID', icon: 'none' });
      return;
    }

    wx.navigateTo({
      url: `/pages/detail/detail?traceId=${traceId}`,
      fail: function(err) {
        console.error('[双码验真] 跳转详情页失败:', err);
        wx.showToast({ title: '跳转失败', icon: 'none' });
      }
    });
  },

  goBackHome: function() {
    wx.switchTab({
      url: '/pages/index/index',
      fail: function() {
        wx.navigateBack({ delta: 10 });
      }
    });
  },

  toggleManualInput: function() {
    this.setData({
      showManualInput: !this.data.showManualInput,
      manualInputCode: ''
    });
  },

  setManualMode: function(e) {
    this.setData({
      manualInputMode: e.currentTarget.dataset.mode,
      manualInputCode: ''
    });
  },

  onManualInputChange: function(e) {
    this.setData({ manualInputCode: e.detail.value });
  },

  fillTestCode: function(e) {
    this.setData({
      manualInputCode: e.currentTarget.dataset.code
    });
  },

  submitManualInput: function() {
    const code = this.data.manualInputCode.trim().toUpperCase();
    const mode = this.data.manualInputMode;

    if (!code) {
      wx.showToast({ title: '请输入编码', icon: 'none' });
      return;
    }

    if (mode === 'outer') {
      if (!mockData.isOuterCode(code)) {
        wx.showToast({ title: '无效的外码格式', icon: 'none' });
        return;
      }
      this.toggleManualInput();
      this.processOuterCode(code);
    } else {
      if (!mockData.isInnerCode(code)) {
        wx.showToast({ title: '无效的内码格式', icon: 'none' });
        return;
      }
      this.toggleManualInput();
      this.processInnerCode(code);
    }
  },

  testMismatchDemo: function() {
    const that = this;
    wx.showModal({
      title: '异常场景演示',
      content: '此功能将演示"内外码不一致"异常场景：先扫描 OUT-G001 外码，再扫描 INN-G002 内码（与OUT-G001不匹配的内码）。',
      confirmText: '开始演示',
      cancelText: '取消',
      confirmColor: '#D32F2F',
      success: async function(res) {
        if (res.confirm) {
          that.handleSkipGuide();
          await that.processOuterCode('OUT-G001');
          setTimeout(() => {
            that.processInnerCode('INN-G002');
          }, 2000);
        }
      }
    });
  }
});
