const channelTrace = require('../../utils/channelTrace.js');
const mockData = require('../../utils/mockData.js');

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
    dealerList: []
  },

  onLoad: function() {
    this.loadDealerInfo();
  },

  onShow: function() {
    this.loadDealerInfo();
    this.loadInventory();
    this.loadInOutRecords();
    this.loadDivergenceAlerts();
  },

  loadDealerInfo: function() {
    const dealer = channelTrace.getCurrentDealer();
    const dealerList = mockData.getDealerList();
    this.setData({
      dealer: dealer,
      dealerList: dealerList
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
    this.setData({
      divergenceAlerts: alerts
    });
  },

  switchTab: function(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      activeTab: tab
    });
  },

  goToStockIn: function() {
    wx.navigateTo({
      url: '/pages/dealer/stockIn'
    });
  },

  goToStockOut: function() {
    wx.navigateTo({
      url: '/pages/dealer/stockOut'
    });
  },

  goToDetail: function(e) {
    const traceId = e.currentTarget.dataset.traceid;
    if (traceId) {
      wx.navigateTo({
        url: `/pages/detail/detail?traceId=${traceId}`
      });
    }
  },

  viewAlert: function(e) {
    const alertId = e.currentTarget.dataset.alertid;
    const alert = this.data.divergenceAlerts.find(a => a.id === alertId);
    if (!alert) return;

    wx.showModal({
      title: '窜货告警详情',
      content: `产品：${alert.traceId}\n扫码地区：${alert.scanCity || alert.scanLocation}\n授权区域：${alert.authorizedRegions.join('、')}\n告警时间：${alert.timestampStr}\n状态：${alert.status === 'pending' ? '待处理' : '已处理'}`,
      confirmText: '标记已处理',
      cancelText: '关闭',
      success: (res) => {
        if (res.confirm && alert.status === 'pending') {
          this.resolveAlert(alertId);
        }
      }
    });
  },

  resolveAlert: function(alertId) {
    const result = channelTrace.resolveDivergenceAlert(alertId, '已核实处理');
    if (result.success) {
      wx.showToast({
        title: '已标记处理',
        icon: 'success'
      });
      this.loadDivergenceAlerts();
    }
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

  selectDealer: function(e) {
    const dealerId = e.currentTarget.dataset.dealerid;
    const dealer = mockData.getDealer(dealerId);
    if (dealer) {
      channelTrace.setCurrentDealer(dealer);
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

  goHome: function() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  }
});
