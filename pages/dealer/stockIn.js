const channelTrace = require('../../utils/channelTrace.js');
const dealerAuth = require('../../utils/dealerAuth.js');
const dealerAudit = require('../../utils/dealerAudit.js');
const dealerSession = require('../../utils/dealerSession.js');

Page({
  data: {
    dealer: null,
    inputCode: '',
    parsedResult: null,
    quantity: 1,
    showQuantitySelector: false,
    testCodes: ['G001', 'G002', 'B-GH202503-001', 'B-GH202504-001'],
    recentResults: [],
    dealerUser: null
  },

  onLoad: function() {
    if (!dealerAuth.isDealerLoggedIn()) {
      wx.redirectTo({ url: '/pages/dealer/login' });
      return;
    }
    if (!dealerAuth.hasPermission('stockIn')) {
      wx.showToast({ title: '无入库操作权限', icon: 'none' });
      setTimeout(function() { wx.navigateBack(); }, 1000);
      return;
    }

    this.setData({
      dealer: channelTrace.getCurrentDealer(),
      dealerUser: dealerAuth.getDealerUser()
    });
  },

  onShow: function() {
    dealerSession.updateActivity();
    getApp().touchDealerSession();
  },

  onInputChange: function(e) {
    this.setData({
      inputCode: e.detail.value
    });
  },

  onQuantityChange: function(e) {
    this.setData({
      quantity: parseInt(e.detail.value) || 1
    });
  },

  decreaseQty: function() {
    if (this.data.quantity > 1) {
      this.setData({
        quantity: this.data.quantity - 1
      });
    }
  },

  increaseQty: function() {
    this.setData({
      quantity: this.data.quantity + 1
    });
  },

  scanCode: function() {
    getApp().touchDealerSession();
    const that = this;
    wx.showLoading({
      title: '正在启动扫码...',
      mask: true
    });

    wx.scanCode({
      scanType: ['qrCode', 'barCode'],
      success: function(res) {
        wx.hideLoading();
        dealerAudit.addAuditLog(dealerAudit.ACTION_SCAN_CODE, {
          code: res.result,
          action: 'stockInScan'
        });
        that.parseCode(res.result);
      },
      fail: function(err) {
        wx.hideLoading();
        if (err.errMsg.indexOf('cancel') === -1) {
          wx.showToast({
            title: '扫码失败，请重试',
            icon: 'none'
          });
        }
      }
    });
  },

  fillTestCode: function(e) {
    const code = e.currentTarget.dataset.code;
    this.setData({
      inputCode: code
    });
    this.parseCode(code);
  },

  manualParse: function() {
    getApp().touchDealerSession();
    const code = this.data.inputCode.trim();
    if (!code) {
      wx.showToast({
        title: '请输入溯源码',
        icon: 'none'
      });
      return;
    }
    this.parseCode(code);
  },

  parseCode: function(code) {
    const result = channelTrace.parseTraceCode(code);
    if (!result.success) {
      wx.showToast({
        title: result.error || '解析失败',
        icon: 'none'
      });
      this.setData({
        parsedResult: null
      });
      return;
    }

    this.setData({
      parsedResult: result,
      quantity: result.traceInfo.quantity || 1
    });
  },

  confirmStockIn: function() {
    getApp().touchDealerSession();
    const that = this;
    const parsed = this.data.parsedResult;
    if (!parsed) {
      wx.showToast({
        title: '请先扫码或输入溯源码',
        icon: 'none'
      });
      return;
    }

    wx.showModal({
      title: '确认入库',
      content: '确认入库：' + parsed.traceInfo.productName + '\n数量：' + this.data.quantity + '\n来源：' + parsed.traceInfo.fromDealerName,
      success: function(res) {
        if (res.confirm) {
          that.doStockIn();
        }
      }
    });
  },

  doStockIn: function() {
    getApp().touchDealerSession();
    const parsed = this.data.parsedResult;
    const dealer = this.data.dealer;

    const result = channelTrace.stockIn(
      dealer,
      parsed.code,
      parsed.codeType,
      parsed.traceInfo,
      this.data.quantity
    );

    if (result.success) {
      dealerAudit.addAuditLog(dealerAudit.ACTION_STOCK_IN, {
        code: parsed.code,
        codeType: parsed.codeType,
        traceId: parsed.traceInfo.traceId,
        productName: parsed.traceInfo.productName,
        batchNo: parsed.traceInfo.batchNo,
        quantity: this.data.quantity,
        fromDealerName: parsed.traceInfo.fromDealerName
      });

      wx.showToast({
        title: '入库成功',
        icon: 'success'
      });

      const recent = this.data.recentResults.slice();
      recent.unshift({
        ...result.record,
        showTime: result.record.timestampStr
      });
      this.setData({
        recentResults: recent.slice(0, 5),
        inputCode: '',
        parsedResult: null,
        quantity: 1
      });
    } else {
      wx.showToast({
        title: result.error || '入库失败',
        icon: 'none'
      });
    }
  },

  goBack: function() {
    wx.navigateBack();
  }
});
