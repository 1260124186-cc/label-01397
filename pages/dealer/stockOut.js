const channelTrace = require('../../utils/channelTrace.js');
const mockData = require('../../utils/mockData.js');
const dealerAuth = require('../../utils/dealerAuth.js');
const dealerAudit = require('../../utils/dealerAudit.js');
const dealerSession = require('../../utils/dealerSession.js');
const dealerTraining = require('../../utils/dealerTraining.js');

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
    recentResults: [],
    largeThreshold: 10,
    dealerUser: null
  },

  onLoad: function() {
    if (!dealerAuth.isDealerLoggedIn()) {
      wx.redirectTo({ url: '/pages/dealer/login' });
      return;
    }
    if (!dealerAuth.hasPermission('stockOut')) {
      wx.showToast({ title: '无出库操作权限', icon: 'none' });
      setTimeout(function() { wx.navigateBack(); }, 1000);
      return;
    }
    
    if (!dealerTraining.canPerformStockOut()) {
      const stats = dealerTraining.getTrainingStats();
      wx.showModal({
        title: '出库权限限制',
        content: '您还有 ' + (stats.totalRequired - stats.completedRequired) + ' 门必修课程未完成，请先完成培训后再进行出库操作。',
        confirmText: '去学习',
        cancelText: '返回',
        success: function(res) {
          if (res.confirm) {
            wx.redirectTo({
              url: '/pages/training/index'
            });
          } else {
            wx.navigateBack();
          }
        }
      });
      return;
    }

    const dealer = channelTrace.getCurrentDealer();
    const toDealerList = mockData.getChildDealers(dealer.id);
    this.setData({
      dealer: dealer,
      toDealerList: toDealerList,
      largeThreshold: dealerAuth.getLargeStockOutThreshold(),
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
          action: 'stockOutScan'
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
    if (!this.data.selectedToDealer) {
      wx.showToast({
        title: '请选择出库去向',
        icon: 'none'
      });
      return;
    }

    const qty = this.data.quantity;
    const isLarge = dealerAuth.needsApprovalForStockOut(qty);
    const hasAdminPermission = dealerAuth.hasPermission('stockOutLarge');

    if (isLarge && !hasAdminPermission) {
      wx.showModal({
        title: '大额出库需审批',
        content: '出库数量 ' + qty + ' 件超过阈值 ' + this.data.largeThreshold + ' 件，需区域经理审批。是否提交审批申请？',
        confirmText: '提交审批',
        cancelText: '取消',
        success: function(res) {
          if (res.confirm) {
            that.submitApproval();
          }
        }
      });
      return;
    }

    wx.showModal({
      title: '确认出库',
      content: '确认出库：' + parsed.traceInfo.productName + '\n数量：' + qty + (isLarge ? '（大额出库，您拥有审批权限）' : '') + '\n发往：' + that.data.selectedToDealer.name,
      success: function(res) {
        if (res.confirm) {
          that.doStockOut();
        }
      }
    });
  },

  submitApproval: function() {
    const that = this;
    const parsed = this.data.parsedResult;
    const approvalData = {
      code: parsed.code,
      codeType: parsed.codeType,
      traceId: parsed.traceInfo.traceId,
      productName: parsed.traceInfo.productName,
      batchNo: parsed.traceInfo.batchNo,
      quantity: this.data.quantity,
      toDealerId: this.data.selectedToDealer.id,
      toDealerName: this.data.selectedToDealer.name,
      fromDealerId: this.data.dealer.id,
      fromDealerName: this.data.dealer.name
    };

    const result = dealerAuth.submitStockOutApproval(approvalData);
    if (result.success) {
      dealerAudit.addAuditLog(dealerAudit.ACTION_STOCK_OUT_APPROVAL_SUBMIT, {
        code: approvalData.code,
        productName: approvalData.productName,
        quantity: approvalData.quantity,
        toDealerName: approvalData.toDealerName,
        approvalId: result.approval.id
      });

      wx.showModal({
        title: '审批已提交',
        content: '您的大额出库申请已提交，请等待区域经理审批。审批通过后即可完成出库。',
        showCancel: false,
        confirmText: '我知道了',
        success: function() {
          that.setData({
            inputCode: '',
            parsedResult: null,
            quantity: 1,
            selectedToDealer: null
          });
        }
      });
    } else {
      wx.showToast({ title: result.error || '提交失败', icon: 'none' });
    }
  },

  doStockOut: function() {
    getApp().touchDealerSession();
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
      dealerAudit.addAuditLog(dealerAudit.ACTION_STOCK_OUT, {
        code: parsed.code,
        codeType: parsed.codeType,
        traceId: parsed.traceInfo.traceId,
        productName: parsed.traceInfo.productName,
        batchNo: parsed.traceInfo.batchNo,
        quantity: this.data.quantity,
        toDealerId: this.data.selectedToDealer.id,
        toDealerName: this.data.selectedToDealer.name
      });

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
