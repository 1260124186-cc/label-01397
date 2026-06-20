const channelTrace = require('../../utils/channelTrace.js');
const mockData = require('../../utils/mockData.js');
const dealerAuth = require('../../utils/dealerAuth.js');
const dealerAudit = require('../../utils/dealerAudit.js');
const dealerSession = require('../../utils/dealerSession.js');
const dealerTraining = require('../../utils/dealerTraining.js');

Page({
  data: {
    dealer: null,
    inventoryList: [],
    inventoryStats: {
      totalSkus: 0,
      totalQuantity: 0
    },
    inOutRecords: [],
    divergenceAlerts: [],
    activeTab: 'overview',
    showDealerSelector: false,
    dealerList: [],
    dealerUser: null,
    canStockIn: false,
    canStockOut: false,
    canViewInventory: false,
    canApprove: false,
    canViewAudit: false,
    canResolveAlert: false,
    pendingApprovalCount: 0,
    pendingAlertCount: 0,
    sessionRemaining: 0,
    trainingStats: null,
    canViewTraining: false,
    stockOutBlockedByTraining: false
  },

  onLoad: function() {
    if (!dealerAuth.isDealerLoggedIn()) {
      wx.redirectTo({ url: '/pages/dealer/login' });
      return;
    }
    this.loadDealerInfo();
  },

  onShow: function() {
    if (!dealerAuth.isDealerLoggedIn()) {
      wx.redirectTo({ url: '/pages/dealer/login' });
      return;
    }
    dealerSession.updateActivity();
    getApp().touchDealerSession();
    this.loadDealerInfo();
    this.loadInventory();
    this.loadInOutRecords();
    this.loadDivergenceAlerts();
    this.loadApprovalCount();
    this.loadTrainingStatus();
    this.updateSessionRemaining();
    this.startSessionTimer();
  },

  onHide: function() {
    this.stopSessionTimer();
  },

  onUnload: function() {
    this.stopSessionTimer();
  },

  startSessionTimer: function() {
    const that = this;
    this.stopSessionTimer();
    this._sessionTimer = setInterval(function() {
      that.updateSessionRemaining();
    }, 60000);
  },

  stopSessionTimer: function() {
    if (this._sessionTimer) {
      clearInterval(this._sessionTimer);
      this._sessionTimer = null;
    }
  },

  updateSessionRemaining: function() {
    const remaining = dealerSession.getRemainingTime();
    this.setData({
      sessionRemaining: Math.floor(remaining / 60000)
    });
  },

  loadDealerInfo: function() {
    const dealer = channelTrace.getCurrentDealer();
    const dealerList = mockData.getDealerList();
    const user = dealerAuth.getDealerUser();
    this.setData({
      dealer: dealer,
      dealerList: dealerList,
      dealerUser: user,
      canStockIn: dealerAuth.hasPermission('stockIn'),
      canStockOut: dealerAuth.hasPermission('stockOut'),
      canViewInventory: dealerAuth.hasPermission('viewInventory'),
      canApprove: dealerAuth.hasPermission('approveStockOut'),
      canViewAudit: dealerAuth.hasPermission('viewAudit'),
      canResolveAlert: dealerAuth.hasPermission('resolveAlert'),
      canViewTraining: dealerAuth.hasPermission('viewTraining')
    });
  },

  loadTrainingStatus: function() {
    if (!this.data.canViewTraining) {
      this.setData({ trainingStats: null, stockOutBlockedByTraining: false });
      return;
    }
    
    const stats = dealerTraining.getTrainingStats();
    const stockOutBlocked = this.data.canStockOut && !stats.canStockOut;
    
    this.setData({
      trainingStats: stats,
      stockOutBlockedByTraining: stockOutBlocked
    });
  },

  loadApprovalCount: function() {
    if (!this.data.canApprove) {
      this.setData({ pendingApprovalCount: 0 });
      return;
    }
    const approvals = dealerAuth.getPendingApprovals();
    this.setData({
      pendingApprovalCount: approvals.length
    });
  },

  loadInventory: function() {
    const dealer = this.data.dealer;
    if (!dealer) return;

    const inventoryList = channelTrace.getDealerInventory(dealer.id);
    let totalQuantity = 0;
    inventoryList.forEach(item => {
      totalQuantity += item.quantity;
    });

    this.setData({
      inventoryList: inventoryList,
      inventoryStats: {
        totalSkus: inventoryList.length,
        totalQuantity: totalQuantity
      }
    });
  },

  loadInOutRecords: function() {
    const dealer = this.data.dealer;
    if (!dealer) return;

    const records = channelTrace.getDealerInOutRecords(dealer.id, 10);
    this.setData({
      inOutRecords: records
    });
  },

  loadDivergenceAlerts: function() {
    const dealer = this.data.dealer;
    if (!dealer) return;

    const alerts = channelTrace.getDivergenceAlertList(dealer.id);
    const pendingAlerts = alerts.filter(function(a) { return a.status === 'pending'; });
    this.setData({
      divergenceAlerts: alerts,
      pendingAlertCount: pendingAlerts.length
    });
  },

  switchTab: function(e) {
    getApp().touchDealerSession();
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      activeTab: tab
    });
  },

  goToStockIn: function() {
    getApp().touchDealerSession();
    if (!this.data.canStockIn) {
      wx.showToast({ title: '无入库操作权限', icon: 'none' });
      return;
    }
    wx.navigateTo({
      url: '/pages/dealer/stockIn'
    });
  },

  goToStockOut: function() {
    getApp().touchDealerSession();
    if (!this.data.canStockOut) {
      wx.showToast({ title: '无出库操作权限', icon: 'none' });
      return;
    }
    
    if (this.data.stockOutBlockedByTraining) {
      const stats = this.data.trainingStats;
      wx.showModal({
        title: '出库权限限制',
        content: '您还有 ' + (stats.totalRequired - stats.completedRequired) + ' 门必修课程未完成，请先完成培训后再进行出库操作。',
        confirmText: '去学习',
        cancelText: '我知道了',
        success: function(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/training/index'
            });
          }
        }
      });
      return;
    }
    
    wx.navigateTo({
      url: '/pages/dealer/stockOut'
    });
  },

  goToTraining: function() {
    getApp().touchDealerSession();
    if (!this.data.canViewTraining) {
      wx.showToast({ title: '无培训学习权限', icon: 'none' });
      return;
    }
    wx.navigateTo({
      url: '/pages/training/index'
    });
  },

  goToApproval: function() {
    getApp().touchDealerSession();
    if (!this.data.canApprove) {
      wx.showToast({ title: '无审批权限', icon: 'none' });
      return;
    }
    dealerAudit.addAuditLog(dealerAudit.ACTION_VIEW_AUDIT, { type: 'approvalList' });
    wx.navigateTo({
      url: '/pages/dealer/approval'
    });
  },

  goToAudit: function() {
    getApp().touchDealerSession();
    if (!this.data.canViewAudit) {
      wx.showToast({ title: '无查看审计日志权限', icon: 'none' });
      return;
    }
    dealerAudit.addAuditLog(dealerAudit.ACTION_VIEW_AUDIT, { type: 'auditLogList' });
    wx.navigateTo({
      url: '/pages/dealer/audit'
    });
  },

  goToDetail: function(e) {
    getApp().touchDealerSession();
    const traceId = e.currentTarget.dataset.traceid;
    if (traceId) {
      wx.navigateTo({
        url: '/pages/detail/detail?traceId=' + traceId
      });
    }
  },

  viewAlert: function(e) {
    getApp().touchDealerSession();
    const alertId = e.currentTarget.dataset.alertid;
    const alert = this.data.divergenceAlerts.find(function(a) { return a.id === alertId; });
    if (!alert) return;

    const that = this;
    const content = '产品：' + alert.traceId + '\n扫码地区：' + (alert.scanCity || alert.scanLocation) + '\n授权区域：' + alert.authorizedRegions.join('、') + '\n告警时间：' + alert.timestampStr + '\n状态：' + (alert.status === 'pending' ? '待处理' : '已处理');

    if (alert.status === 'pending' && this.data.canResolveAlert) {
      wx.showModal({
        title: '窜货告警详情',
        content: content,
        confirmText: '标记已处理',
        cancelText: '关闭',
        success: function(res) {
          if (res.confirm) {
            that.resolveAlert(alertId);
          }
        }
      });
    } else {
      wx.showModal({
        title: '窜货告警详情',
        content: content,
        showCancel: false,
        confirmText: '关闭'
      });
    }
  },

  resolveAlert: function(alertId) {
    const result = channelTrace.resolveDivergenceAlert(alertId, '已核实处理');
    if (result.success) {
      dealerAudit.addAuditLog(dealerAudit.ACTION_RESOLVE_ALERT, {
        alertId: alertId,
        traceId: result.alert.traceId
      });
      wx.showToast({
        title: '已标记处理',
        icon: 'success'
      });
      this.loadDivergenceAlerts();
    }
  },

  openDealerSelector: function() {
    getApp().touchDealerSession();
    this.setData({
      showDealerSelector: true
    });
  },

  closeDealerSelector: function() {
    this.setData({
      showDealerSelector: false
    });
  },

  selectDealer: function(e) {
    const dealerId = e.currentTarget.dataset.dealerid;
    const dealer = mockData.getDealer(dealerId);
    if (dealer) {
      channelTrace.setCurrentDealer(dealer);
      dealerAudit.addAuditLog(dealerAudit.ACTION_SWITCH_DEALER, {
        dealerId: dealerId,
        dealerName: dealer.name
      });
      this.setData({
        showDealerSelector: false
      });
      this.loadDealerInfo();
      this.loadInventory();
      this.loadInOutRecords();
      this.loadDivergenceAlerts();
      wx.showToast({
        title: '已切换经销商',
        icon: 'success'
      });
    }
  },

  doLogout: function() {
    const that = this;
    wx.showModal({
      title: '退出经销商模式',
      content: '确定要退出当前登录吗？',
      success: function(res) {
        if (res.confirm) {
          dealerAudit.addAuditLog(dealerAudit.ACTION_LOGOUT, {});
          dealerAuth.dealerLogout();
          getApp().dealerLogoutSuccess();
          wx.switchTab({
            url: '/pages/profile/profile'
          });
        }
      }
    });
  },

  goHome: function() {
    getApp().touchDealerSession();
    wx.switchTab({
      url: '/pages/index/index'
    });
  }
});
