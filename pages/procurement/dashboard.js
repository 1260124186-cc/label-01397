const procurement = require('../../utils/procurement.js');

Page({
  data: {
    userInfo: null,
    stats: null,
    purchasedBatches: [],
    filteredBatches: [],
    activeStatus: 'all',
    keyword: '',
    statusFilters: [
      { key: 'all', label: '全部' },
      { key: 'pending', label: '待发货' },
      { key: 'shipping', label: '运输中' },
      { key: 'delivered', label: '已送达' }
    ],
    functionMenus: [],
    canCreateRFQ: false,
    canViewArchive: false,
    canQueryBatch: false
  },

  onLoad: function() {
    if (!procurement.isProcurementLoggedIn()) {
      wx.redirectTo({ url: '/pages/procurement/login' });
      return;
    }
    this.initPage();
  },

  onShow: function() {
    if (!procurement.isProcurementLoggedIn()) {
      wx.redirectTo({ url: '/pages/procurement/login' });
      return;
    }
    this.refreshData();
  },

  onPullDownRefresh: function() {
    this.refreshData();
    wx.stopPullDownRefresh();
  },

  initPage: function() {
    const userInfo = procurement.getProcurementUser();
    const canCreateRFQ = procurement.hasPermission('createRFQ');
    const canViewArchive = procurement.hasPermission('viewArchive');
    const canQueryBatch = procurement.hasPermission('queryBatchQualification');

    const allMenus = [
      { key: 'batchQuery', icon: '🔍', label: '批次资质查询', desc: '批量验证批次资质', show: canQueryBatch, url: '/pages/procurement/batchQuery' },
      { key: 'report', icon: '📄', label: '检测报告下载', desc: '下载批次检测报告包', show: true, url: '/pages/procurement/reportDownload' },
      { key: 'rfq', icon: '💬', label: '在线 RFQ', desc: '发布询价需求', show: canCreateRFQ, url: '/pages/procurement/rfq' },
      { key: 'contract', icon: '📋', label: '合同管理', desc: '合同与批次关联', show: true, url: '/pages/procurement/contract' },
      { key: 'archive', icon: '📁', label: '质检文件归档', desc: '质检资料管理', show: canViewArchive, url: '/pages/procurement/archive' },
      { key: 'batchList', icon: '📦', label: '批次溯源', desc: '查看溯源详情', show: true, url: null }
    ];

    this.setData({
      userInfo: userInfo,
      functionMenus: allMenus.filter(function(m) { return m.show; }),
      canCreateRFQ: canCreateRFQ,
      canViewArchive: canViewArchive,
      canQueryBatch: canQueryBatch
    });
    this.refreshData();
  },

  refreshData: function() {
    const stats = procurement.getDashboardStats();
    const batches = procurement.getPurchasedBatches();
    this.setData({
      stats: stats,
      purchasedBatches: batches
    });
    this.applyFilter();
  },

  applyFilter: function() {
    let result = this.data.purchasedBatches.slice();
    if (this.data.activeStatus !== 'all') {
      result = result.filter(function(b) { return b.logisticsStatus === this.data.activeStatus; }.bind(this));
    }
    if (this.data.keyword) {
      const kw = this.data.keyword.toLowerCase();
      result = result.filter(function(b) {
        return b.batchNo.toLowerCase().indexOf(kw) !== -1 ||
          b.productName.indexOf(kw) !== -1;
      });
    }
    this.setData({ filteredBatches: result });
  },

  switchStatus: function(e) {
    const status = e.currentTarget.dataset.status;
    this.setData({ activeStatus: status });
    this.applyFilter();
  },

  onKeywordInput: function(e) {
    this.setData({ keyword: e.detail.value });
  },

  doSearch: function() {
    this.applyFilter();
  },

  tapMenu: function(e) {
    const key = e.currentTarget.dataset.key;
    const url = e.currentTarget.dataset.url;
    if (url) {
      wx.navigateTo({ url: url });
    } else if (key === 'batchList') {
      wx.navigateTo({ url: '/pages/batchList/batchList?batchNo=GH202503' });
    }
  },

  viewBatchDetail: function(e) {
    const id = e.currentTarget.dataset.id;
    const batch = this.data.purchasedBatches.find(function(b) { return b.id === id; });
    if (!batch) return;
    wx.showActionSheet({
      itemList: ['查看批次溯源', '查看物流详情', '查看关联合同'],
      success: function(res) {
        if (res.tapIndex === 0) {
          wx.navigateTo({ url: '/pages/batchList/batchList?batchNo=' + batch.batchNo });
        } else if (res.tapIndex === 1) {
          if (batch.trackingNo) {
            wx.showModal({
              title: '物流跟踪 - ' + batch.logisticsCompany,
              content: '运单号：' + batch.trackingNo + '\n\n最新状态：' + batch.logisticsStatusLabel + '\n\n（点击复制运单号可到快递公司官网查询详情）',
              confirmText: '复制运单号',
              success: function(r) {
                if (r.confirm) {
                  wx.setClipboardData({
                    data: batch.trackingNo,
                    success: function() {
                      wx.showToast({ title: '运单号已复制', icon: 'success' });
                    }
                  });
                }
              }
            });
          } else {
            wx.showToast({ title: '暂无物流信息', icon: 'none' });
          }
        } else if (res.tapIndex === 2) {
          wx.navigateTo({ url: '/pages/procurement/contract' });
        }
      }
    });
  },

  goLogout: function() {
    const that = this;
    wx.showModal({
      title: '确认退出',
      content: '确定要退出企业采购账号吗？',
      success: function(res) {
        if (res.confirm) {
          const app = getApp();
          app.procurementLogoutSuccess();
          wx.redirectTo({ url: '/pages/procurement/login' });
        }
      }
    });
  },

  formatAmount: function(amount) {
    if (!amount) return '0';
    return amount.toLocaleString('zh-CN');
  }
});
