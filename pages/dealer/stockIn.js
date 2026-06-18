const channelTrace = require('../../utils/channelTrace.js');

Page({
  data: {
    dealer: null,
    inputCode: '',
    parsedResult: null,
    quantity: 1,
    showQuantitySelector: false,
    testCodes: ['G001', 'G002', 'B-GH202503-001', 'B-GH202504-001'],
    recentResults: []
  },

  onLoad: function() {
    this.setData({
      dealer: channelTrace.getCurrentDealer()
    });
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
    const that = this;
    wx.showLoading({
      title: '正在启动扫码...',
      mask: true
    });

    wx.scanCode({
      scanType: ['qrCode', 'barCode'],
      success: function(res) {
        wx.hideLoading();
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
      content: `确认入库：${parsed.traceInfo.productName}\n数量：${this.data.quantity}\n来源：${parsed.traceInfo.fromDealerName}`,
      success: function(res) {
        if (res.confirm) {
          that.doStockIn();
        }
      }
    });
  },

  doStockIn: function() {
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
