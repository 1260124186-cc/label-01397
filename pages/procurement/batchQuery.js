const procurement = require('../../utils/procurement.js');

Page({
  data: {
    batchInput: '',
    queryResults: [],
    queried: false,
    loading: false,
    presetBatches: ['GH202503', 'GH202504', 'GH202505', 'GH202502']
  },

  onLoad: function() {
    if (!procurement.isProcurementLoggedIn()) {
      wx.redirectTo({ url: '/pages/procurement/login' });
      return;
    }
    if (!procurement.hasPermission('queryBatchQualification')) {
      wx.showToast({ title: '无权限访问', icon: 'none' });
      setTimeout(function() { wx.navigateBack(); }, 1500);
    }
  },

  onInput: function(e) {
    this.setData({ batchInput: e.detail.value });
  },

  fillPreset: function(e) {
    const batch = e.currentTarget.dataset.batch;
    const current = this.data.batchInput;
    const list = current ? current.split(/[\n,，\s]+/).filter(function(s) { return s; }) : [];
    if (list.indexOf(batch) === -1) {
      list.push(batch);
    }
    this.setData({ batchInput: list.join('\n') });
  },

  clearInput: function() {
    this.setData({ batchInput: '', queryResults: [], queried: false });
  },

  doQuery: function() {
    const that = this;
    if (!this.data.batchInput.trim()) {
      wx.showToast({ title: '请输入批次号', icon: 'none' });
      return;
    }

    const batchNos = this.data.batchInput.split(/[\n,，\s]+/).filter(function(s) { return s.trim(); });
    if (batchNos.length === 0) {
      wx.showToast({ title: '请输入有效的批次号', icon: 'none' });
      return;
    }

    this.setData({ loading: true });
    setTimeout(function() {
      const results = procurement.getBatchQualification(batchNos);
      that.setData({
        queryResults: results,
        queried: true,
        loading: false
      });
    }, 500);
  },

  viewBatchTrace: function(e) {
    const batchNo = e.currentTarget.dataset.batch;
    wx.navigateTo({ url: '/pages/batchList/batchList?batchNo=' + batchNo });
  },

  viewCert: function(e) {
    const cert = e.currentTarget.dataset.cert;
    wx.showModal({
      title: cert.name || '证书详情',
      content: '证书编号：' + (cert.certNo || 'N/A') + '\n发证机构：' + (cert.issuer || 'N/A') + '\n有效期：' + (cert.validDate || '长期有效'),
      showCancel: false
    });
  },

  downloadReport: function() {
    const validBatches = this.data.queryResults.filter(function(r) { return r.valid; }).map(function(r) { return r.batchNo; });
    if (validBatches.length === 0) {
      wx.showToast({ title: '没有可下载的有效批次', icon: 'none' });
      return;
    }
    wx.navigateTo({
      url: '/pages/procurement/reportDownload?batches=' + validBatches.join(',')
    });
  }
});
