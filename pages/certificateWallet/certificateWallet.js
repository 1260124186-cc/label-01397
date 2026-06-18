var certWallet = require('../../utils/certificateWallet.js');

Page({
  data: {
    certificates: [],
    filteredCertificates: [],
    isEmpty: true,
    activeTab: 'all',
    tabs: [
      { key: 'all', label: '全部', icon: '📜' },
      { key: 'organic', label: '有机认证', icon: '🌱' },
      { key: 'testReport', label: '检测报告', icon: '🔬' },
      { key: 'blockchain', label: '区块链存证', icon: '🔗' }
    ],
    organicCount: 0,
    testReportCount: 0,
    blockchainCount: 0,
    sortBy: 'time'
  },

  onLoad: function() {
    this.loadCertificates();
  },

  onShow: function() {
    this.loadCertificates();
  },

  onPullDownRefresh: function() {
    this.loadCertificates();
    wx.stopPullDownRefresh();
  },

  loadCertificates: function() {
    var all = certWallet.getCertificates();
    var that = this;
    var formatted = all.map(function(item) {
      return Object.assign({}, item, {
        formatAddTime: certWallet.formatTime(item.addTime),
        typeLabel: certWallet.formatType(item.type),
        typeIcon: certWallet.formatTypeIcon(item.type),
        typeColor: certWallet.formatTypeColor(item.type)
      });
    });

    var organicCount = 0, testReportCount = 0, blockchainCount = 0;
    formatted.forEach(function(c) {
      if (c.type === 'organic') organicCount++;
      else if (c.type === 'testReport') testReportCount++;
      else if (c.type === 'blockchain') blockchainCount++;
    });

    this.setData({
      certificates: formatted,
      organicCount: organicCount,
      testReportCount: testReportCount,
      blockchainCount: blockchainCount,
      isEmpty: formatted.length === 0
    });

    this.applyFilter();
  },

  applyFilter: function() {
    var list = this.data.certificates;
    var tab = this.data.activeTab;
    var filtered = list;

    if (tab !== 'all') {
      filtered = list.filter(function(item) { return item.type === tab; });
    }

    this.setData({ filteredCertificates: filtered });
  },

  onTabTap: function(e) {
    var key = e.currentTarget.dataset.key;
    if (!key) return;
    this.setData({ activeTab: key });
    this.applyFilter();
  },

  onItemTap: function(e) {
    var certId = e.currentTarget.dataset.certid;
    if (!certId) return;
    wx.navigateTo({
      url: '/pages/certificateDetail/certificateDetail?certId=' + certId
    });
  },

  onRemoveCert: function(e) {
    var certId = e.currentTarget.dataset.certid;
    if (!certId) return;
    var that = this;
    wx.showModal({
      title: '删除证书',
      content: '确定从钱包中删除该证书吗？',
      confirmColor: '#ff4d4f',
      success: function(res) {
        if (res.confirm) {
          certWallet.removeCertificate(certId);
          that.loadCertificates();
          wx.showToast({ title: '已删除', icon: 'success', duration: 1500 });
        }
      }
    });
  },

  onClearAll: function() {
    if (this.data.isEmpty) return;
    var that = this;
    wx.showModal({
      title: '清空证书钱包',
      content: '确定清空所有证书吗？此操作不可恢复。',
      confirmColor: '#ff4d4f',
      success: function(res) {
        if (res.confirm) {
          certWallet.clearCertificates();
          that.loadCertificates();
          wx.showToast({ title: '已清空', icon: 'success', duration: 1500 });
        }
      }
    });
  },

  onGoScan: function() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  },

  onShareAppMessage: function() {
    return {
      title: '我的证书钱包 - 一茶一品·桂花茶溯源',
      path: '/pages/index/index'
    };
  }
});
