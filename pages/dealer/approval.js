const dealerAuth = require('../../utils/dealerAuth.js');
const dealerAudit = require('../../utils/dealerAudit.js');
const dealerSession = require('../../utils/dealerSession.js');

Page({
  data: {
    pendingList: [],
    approvedList: [],
    rejectedList: [],
    activeTab: 'pending',
    loading: false
  },

  onLoad: function() {
    if (!dealerAuth.isDealerLoggedIn()) {
      wx.redirectTo({ url: '/pages/dealer/login' });
      return;
    }
    if (!dealerAuth.hasPermission('approveStockOut')) {
      wx.showToast({ title: '无审批权限', icon: 'none' });
      setTimeout(function() { wx.navigateBack(); }, 1000);
      return;
    }
    this.loadData();
  },

  onShow: function() {
    dealerSession.updateActivity();
    getApp().touchDealerSession();
    this.loadData();
  },

  loadData: function() {
    var app = getApp();
    app.touchDealerSession();
    try {
      var all = wx.getStorageSync('dealer_approval_pending') || [];
      this.setData({
        pendingList: all.filter(function(a) { return a.status === 'pending'; }),
        approvedList: all.filter(function(a) { return a.status === 'approved'; }),
        rejectedList: all.filter(function(a) { return a.status === 'rejected'; })
      });
    } catch (e) {
      console.error('[Approval] 加载审批列表失败:', e);
    }
  },

  switchTab: function(e) {
    var tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
  },

  viewApproval: function(e) {
    var id = e.currentTarget.dataset.id;
    var all = wx.getStorageSync('dealer_approval_pending') || [];
    var approval = all.find(function(a) { return a.id === id; });
    if (!approval || !approval.data) return;

    var data = approval.data;
    wx.showModal({
      title: '出库审批详情',
      content: [
        '申请人：' + (approval.submitUserName || ''),
        '申请时间：' + (approval.submitTimeStr || ''),
        '产品：' + (data.productName || ''),
        '溯源码：' + (data.code || ''),
        '数量：' + (data.quantity || 0) + ' 件',
        '发往：' + (data.toDealerName || ''),
        '状态：' + (approval.status === 'pending' ? '待审批' : approval.status === 'approved' ? '已批准' : '已驳回')
      ].join('\n'),
      confirmText: approval.status === 'pending' ? '批准' : '关闭',
      cancelText: approval.status === 'pending' ? '驳回' : '',
      showCancel: approval.status === 'pending',
      success: (function(_this, approval) {
        return function(res) {
          if (approval.status !== 'pending') return;
          if (res.confirm) {
            _this.approveIt(approval.id);
          } else if (res.cancel) {
            _this.rejectIt(approval.id);
          }
        };
      })(this, approval)
    });
  },

  approveIt: function(id) {
    var that = this;
    wx.showModal({
      title: '确认批准',
      content: '批准后将允许该笔出库操作，是否继续？',
      success: function(res) {
        if (!res.confirm) return;
        var result = dealerAuth.approveStockOut(id, '审批通过');
        if (result.success) {
          dealerAudit.addAuditLog(dealerAudit.ACTION_STOCK_OUT_APPROVAL_APPROVE, {
            approvalId: id,
            productName: result.approval.data ? result.approval.data.productName : '',
            quantity: result.approval.data ? result.approval.data.quantity : 0
          });
          wx.showToast({ title: '已批准', icon: 'success' });
          that.loadData();
        } else {
          wx.showToast({ title: result.error || '操作失败', icon: 'none' });
        }
      }
    });
  },

  rejectIt: function(id) {
    var that = this;
    wx.showModal({
      title: '确认驳回',
      content: '驳回后该笔出库需要重新申请，是否继续？',
      editable: true,
      placeholderText: '请输入驳回原因（可选）',
      success: function(res) {
        if (!res.confirm) return;
        var result = dealerAuth.rejectStockOut(id, res.content || '');
        if (result.success) {
          dealerAudit.addAuditLog(dealerAudit.ACTION_STOCK_OUT_APPROVAL_REJECT, {
            approvalId: id,
            productName: result.approval.data ? result.approval.data.productName : '',
            quantity: result.approval.data ? result.approval.data.quantity : 0,
            remark: res.content || ''
          });
          wx.showToast({ title: '已驳回', icon: 'success' });
          that.loadData();
        } else {
          wx.showToast({ title: result.error || '操作失败', icon: 'none' });
        }
      }
    });
  },

  goBack: function() {
    wx.navigateBack();
  }
});
