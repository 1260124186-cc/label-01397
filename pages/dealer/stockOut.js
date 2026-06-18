const channelTrace = require('../../utils/channelTrace.js');
const mockData = require('../../utils/mockData.js');

Page({
  data: {
    dealer: null,
    inputCode: '',
    parsedResult: null,
    quantity: 1,
    selectedToDealer: null,
    toDealerList: [],
    showDealerSelector: false,
    testCodes: ['G001', 'G002', 'B-GH202503-001'],
    recentResults: []
  },

  onLoad: function() {
    const dealer = channelTrace.getCurrentDealer();
    const toDealerList = mockData.getChildDealers(dealer.id);
    this.setData({
      dealer: dealer,
      toDealerList: toDealerList
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

  openDealerSelector: function() {
    this.setData({
      showDealerSelector: true
    });
  },

  closeDealerSelector: function() {
    this.setData({
      showDealerSelector: false
    });
  },

  selectToDealer: function(e) {
    const dealerId = e.currentTarget.dataset.dealerid;
    const dealer = mockData.getDealer(dealerId);
    if (dealer) {
      this.setData({
        selectedToDealer: dealer,
        showDealerSelector: false
      });
    }
  },

  selectDirectConsumer: function() {
    this.setData({
      selectedToDealer: {
        id: 'store',
        name: '零售门店/消费者',
        level: 'store',
        levelLabel: '零售终端'
      },
      showDealerSelector: false
    });
  },

  confirmStockOut: function() {
    const that = this;
    const parsed = this.data.parsedResult;
    if (!parsed) {
      wx.showToast({
        title: '请先扫码或输入溯源码',
        icon: 'none'
      });
      return;
    }
    if (!this.data.selectedToDealer) {
      wx.showToast({
        title: '请选择出库去向',
        icon: 'none'
      });
      return;
    }

    wx.showModal({
      title: '确认出库',
      content: `确认出库：${parsed.traceInfo.productName}\n数量：${this.data.quantity}\n发往：${this.data.selectedToDealer.name}`,
      success: function(res) {
        if (res.confirm) {
          that.doStockOut();
        }
      }
    });
  },

  doStockOut: function() {
    const parsed = this.data.parsedResult;
    const dealer = this.data.dealer;
    const toDealer = this.data.selectedToDealer.id === 'store' ? null : this.data.selectedToDealer;

    const result = channelTrace.stockOut(
      dealer,
      parsed.code,
      parsed.codeType,
      parsed.traceInfo,
      this.data.quantity,
      toDealer
    );

    if (result.success) {
      wx.showToast({
        title: '出库成功',
        icon: 'success'
      });

      const recent = this.data.recentResults.slice();
      recent.unshift({
        ...result.record,
        showTime: result.record.timestampStr,
        toDealerName: this.data.selectedToDealer.name
      });
      this.setData({
        recentResults: recent.slice(0, 5),
        inputCode: '',
        parsedResult: null,
        quantity: 1,
        selectedToDealer: null
      });
    } else {
      wx.showToast({
        title: result.error || '出库失败',
        icon: 'none'
      });
    }
  },

  goBack: function() {
    wx.navigateBack();
  }
});
