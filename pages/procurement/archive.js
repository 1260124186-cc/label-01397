const procurement = require('../../utils/procurement.js');

Page({
  data: {
    archiveList: [],
    filteredList: [],
    activeTab: 'all',
    keyword: '',
    tabs: [
      { key: 'all', label: '全部' },
      { key: 'passed', label: '合格' },
      { key: 'failed', label: '不合格' }
    ],
    canArchive: false,
    showArchiveModal: false,
    archiveForm: {
      batchNo: '',
      productName: '',
      inspectionDate: '',
      result: 'passed',
      overallScore: '',
      remark: ''
    },
    showDetailModal: false,
    currentArchive: null
  },

  onLoad: function() {
    if (!procurement.isProcurementLoggedIn()) {
      wx.redirectTo({ url: '/pages/procurement/login' });
      return;
    }
    const canArchive = procurement.hasPermission('archiveQualityDoc');
    this.setData({ canArchive: canArchive });
    this.loadArchives();
  },

  onShow: function() {
    this.loadArchives();
  },

  loadArchives: function() {
    const filter = {};
    if (this.data.activeTab !== 'all') {
      filter.result = this.data.activeTab;
    }
    let list = procurement.getQualityArchives(filter);
    if (this.data.keyword) {
      const kw = this.data.keyword.toLowerCase();
      list = list.filter(function(a) {
        return a.batchNo.toLowerCase().indexOf(kw) !== -1 ||
               a.productName.toLowerCase().indexOf(kw) !== -1 ||
               a.inspectionReportId.toLowerCase().indexOf(kw) !== -1;
      });
    }
    const processed = list.map(function(a) {
      return Object.assign({}, a, {
        resultLabel: a.result === 'passed' ? '合格' : '不合格'
      });
    });
    this.setData({
      archiveList: processed,
      filteredList: processed
    });
  },

  switchTab: function(e) {
    this.setData({ activeTab: e.currentTarget.dataset.tab });
    this.loadArchives();
  },

  onKeywordInput: function(e) {
    this.setData({ keyword: e.detail.value });
  },

  doSearch: function() {
    this.loadArchives();
  },

  openArchiveModal: function() {
    if (!procurement.hasPermission('archiveQualityDoc')) {
      wx.showToast({ title: '无权限操作', icon: 'none' });
      return;
    }
    const today = new Date();
    const dateStr = today.getFullYear() + '-' +
      (today.getMonth() + 1).toString().padStart(2, '0') + '-' +
      today.getDate().toString().padStart(2, '0');
    this.setData({
      showArchiveModal: true,
      archiveForm: {
        batchNo: '',
        productName: '',
        inspectionDate: dateStr,
        result: 'passed',
        overallScore: '',
        remark: ''
      }
    });
  },

  closeArchiveModal: function() {
    this.setData({ showArchiveModal: false });
  },

  onFormInput: function(e) {
    const field = e.currentTarget.dataset.field;
    const value = e.detail.value;
    const form = Object.assign({}, this.data.archiveForm);
    form[field] = value;
    this.setData({ archiveForm: form });
  },

  onResultSelect: function(e) {
    const form = Object.assign({}, this.data.archiveForm);
    form.result = e.currentTarget.dataset.result;
    this.setData({ archiveForm: form });
  },

  onDateChange: function(e) {
    const form = Object.assign({}, this.data.archiveForm);
    form.inspectionDate = e.detail.value;
    this.setData({ archiveForm: form });
  },

  doArchive: function() {
    const form = this.data.archiveForm;
    if (!form.batchNo.trim()) {
      wx.showToast({ title: '请输入批次号', icon: 'none' });
      return;
    }
    if (!form.productName.trim()) {
      wx.showToast({ title: '请输入产品名称', icon: 'none' });
      return;
    }
    if (!form.overallScore) {
      wx.showToast({ title: '请输入综合评分', icon: 'none' });
      return;
    }
    const score = parseInt(form.overallScore, 10);
    if (isNaN(score) || score < 0 || score > 100) {
      wx.showToast({ title: '评分需在0-100之间', icon: 'none' });
      return;
    }
    const result = procurement.archiveQualityDoc({
      batchNo: form.batchNo.trim().toUpperCase(),
      productName: form.productName.trim(),
      inspectionDate: form.inspectionDate,
      result: form.result,
      overallScore: score,
      remark: form.remark
    });
    if (result.success) {
      wx.showToast({ title: '归档成功', icon: 'success' });
      this.closeArchiveModal();
      this.loadArchives();
    } else {
      wx.showToast({ title: result.error || '归档失败', icon: 'none' });
    }
  },

  viewArchiveDetail: function(e) {
    const id = e.currentTarget.dataset.id;
    const archive = this.data.filteredList.find(function(a) { return a.id === id; });
    if (!archive) return;
    this.setData({
      showDetailModal: true,
      currentArchive: archive
    });
  },

  closeDetailModal: function() {
    this.setData({ showDetailModal: false, currentArchive: null });
  },

  viewBatch: function(e) {
    const batchNo = e.currentTarget.dataset.batch;
    wx.navigateTo({ url: '/pages/batchList/batchList?batchNo=' + batchNo });
  },

  downloadReport: function(e) {
    const batchNo = e.currentTarget.dataset.batch;
    wx.navigateTo({ url: '/pages/procurement/reportDownload?batchNo=' + batchNo });
  }
});
