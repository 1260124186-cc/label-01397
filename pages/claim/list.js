var claimService = require('../../utils/claimService.js');

var TABS = [
  { key: 'all', label: '全部' },
  { key: 'submitted', label: '已提交' },
  { key: 'processing', label: '处理中' },
  { key: 'completed', label: '已完成' }
];

Page({
  data: {
    tabs: TABS,
    activeTab: 'all',
    allClaims: [],
    filteredClaims: [],
    loading: true,
    statData: {
      total: 0,
      processing: 0,
      completed: 0,
      escalated: 0
    }
  },

  onLoad: function() {
    this.loadClaims();
  },

  onShow: function() {
    this.loadClaims();
    claimService.checkAllEscalations();
  },

  onPullDownRefresh: function() {
    this.loadClaims();
    claimService.checkAllEscalations();
    setTimeout(function() {
      wx.stopPullDownRefresh();
    }, 500);
  },

  loadClaims: function() {
    var list = claimService.getClaims();
    if (list.length === 0) {
      list = claimService.initMockClaims();
    }

    var statData = { total: list.length, processing: 0, completed: 0, escalated: 0 };
    var that = this;

    var processed = list.map(function(c) {
      var slaInfo = claimService.getSlaRemainingInfo(c);
      var statusLabel = claimService.CLAIM_STATUS_LABEL[c.status] || c.status;
      var statusColor = claimService.CLAIM_STATUS_COLOR[c.status] || '#999';

      if (c.status === claimService.CLAIM_STATUS.COMPLETED ||
          c.status === claimService.CLAIM_STATUS.REJECTED) {
        statData.completed++;
      } else {
        statData.processing++;
      }
      if (c.isEscalated) {
        statData.escalated++;
      }

      var problemIcon = '';
      var pt = claimService.PROBLEM_TYPES.find(function(t) { return t.key === c.problemType; });
      if (pt) problemIcon = pt.icon;

      return {
        id: c.id,
        traceId: c.traceId,
        title: c.title,
        problemType: c.problemType,
        problemTypeLabel: c.problemTypeLabel,
        problemIcon: problemIcon,
        expectedSolutionLabel: c.expectedSolutionLabel,
        status: c.status,
        statusLabel: statusLabel,
        statusColor: statusColor,
        timeText: claimService.formatTime(c.createdAt),
        isEscalated: c.isEscalated || false,
        isAbnormalBatch: c.isAbnormalBatch || false,
        isRecallBatch: c.isRecallBatch || false,
        slaExpired: slaInfo.expired,
        slaText: slaInfo.remainingText,
        slaPercentage: slaInfo.percentage,
        productName: c.productInfo ? c.productInfo.productName : '',
        thumbnail: c.productInfo ? c.productInfo.thumbnail : '',
        compensationType: c.compensationType,
        compensationAmount: c.compensationAmount
      };
    });

    that.setData({
      allClaims: processed,
      loading: false,
      statData: statData
    });
    that.filterClaims();
  },

  switchTab: function(e) {
    var key = e.currentTarget.dataset.key;
    this.setData({ activeTab: key });
    this.filterClaims();
  },

  filterClaims: function() {
    var activeTab = this.data.activeTab;
    var all = this.data.allClaims;
    var filtered = [];

    if (activeTab === 'all') {
      filtered = all;
    } else if (activeTab === 'submitted') {
      filtered = all.filter(function(c) {
        return c.status === claimService.CLAIM_STATUS.SUBMITTED;
      });
    } else if (activeTab === 'processing') {
      filtered = all.filter(function(c) {
        return c.status !== claimService.CLAIM_STATUS.COMPLETED &&
               c.status !== claimService.CLAIM_STATUS.REJECTED;
      });
    } else if (activeTab === 'completed') {
      filtered = all.filter(function(c) {
        return c.status === claimService.CLAIM_STATUS.COMPLETED ||
               c.status === claimService.CLAIM_STATUS.REJECTED;
      });
    }

    this.setData({ filteredClaims: filtered });
  },

  goCreate: function() {
    wx.navigateTo({ url: '/pages/claim/create' });
  },

  goDetail: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '/pages/claim/detail?id=' + id });
  },

  goRecallG002: function() {
    wx.navigateTo({ url: '/pages/recall/detail?traceId=G002' });
  }
});
