const procurement = require('../../utils/procurement.js');

Page({
  data: {
    contractList: [],
    filteredList: [],
    activeTab: 'all',
    keyword: '',
    tabs: [
      { key: 'all', label: '全部' },
      { key: 'active', label: '执行中' },
      { key: 'expired', label: '已到期' }
    ],
    canLinkBatch: false,
    showLinkModal: false,
    currentContract: null,
    linkBatchInput: ''
  },

  onLoad: function() {
    if (!procurement.isProcurementLoggedIn()) {
      wx.redirectTo({ url: '/pages/procurement/login' });
      return;
    }
    const canLinkBatch = procurement.hasPermission('linkContractBatch');
    this.setData({ canLinkBatch: canLinkBatch });
    this.loadContracts();
  },

  onShow: function() {
    this.loadContracts();
  },

  loadContracts: function() {
    const filter = {};
    if (this.data.activeTab !== 'all') {
      filter.status = this.data.activeTab;
    }
    if (this.data.keyword) {
      filter.keyword = this.data.keyword;
    }
    const list = procurement.getContracts(filter);
    this.setData({
      contractList: procurement.getContracts(),
      filteredList: list
    });
  },

  switchTab: function(e) {
    this.setData({ activeTab: e.currentTarget.dataset.tab });
    this.loadContracts();
  },

  onKeywordInput: function(e) {
    this.setData({ keyword: e.detail.value });
  },

  doSearch: function() {
    this.loadContracts();
  },

  viewContractDetail: function(e) {
    const id = e.currentTarget.dataset.id;
    const contract = procurement.getContractById(id);
    if (!contract) return;
    const batchesText = contract.linkedBatchDetails && contract.linkedBatchDetails.length > 0
      ? contract.linkedBatchDetails.map(function(b) { return b.batchNo + '（' + b.skuCount + '个SKU）'; }).join('、')
      : '暂无关联批次';
    wx.showModal({
      title: contract.title,
      content: '合同编号：' + contract.contractNo +
        '\n供应商：' + contract.supplier +
        '\n合同金额：¥' + contract.totalAmount +
        '\n已付金额：¥' + contract.paidAmount +
        '\n付款条款：' + contract.paymentTerms +
        '\n签署日期：' + contract.signDate +
        '\n有效期：' + contract.effectiveDate + ' 至 ' + contract.expireDate +
        '\n合同状态：' + contract.statusLabel +
        '\n付款状态：' + contract.paymentStatusLabel +
        '\n创建人：' + contract.creator +
        '\n\n关联批次：\n' + batchesText +
        '\n\n附件数量：' + (contract.attachments ? contract.attachments.length : 0) + ' 个',
      showCancel: true,
      confirmText: '关联批次',
      cancelText: '关闭',
      success: function(res) {
        if (res.confirm) {
          if (procurement.hasPermission('linkContractBatch')) {
            wx.navigateTo({ url: '/pages/procurement/batchQuery' });
          } else {
            wx.showToast({ title: '无关联批次权限', icon: 'none' });
          }
        }
      }
    });
  },

  openLinkModal: function(e) {
    if (!procurement.hasPermission('linkContractBatch')) {
      wx.showToast({ title: '无权限操作', icon: 'none' });
      return;
    }
    const id = e.currentTarget.dataset.id;
    const contract = this.data.contractList.find(function(c) { return c.id === id; });
    this.setData({
      showLinkModal: true,
      currentContract: contract,
      linkBatchInput: ''
    });
  },

  closeLinkModal: function() {
    this.setData({ showLinkModal: false, currentContract: null, linkBatchInput: '' });
  },

  onLinkInput: function(e) {
    this.setData({ linkBatchInput: e.detail.value });
  },

  doLinkBatch: function() {
    const batchNo = this.data.linkBatchInput.trim().toUpperCase();
    if (!batchNo) {
      wx.showToast({ title: '请输入批次号', icon: 'none' });
      return;
    }
    const result = procurement.linkBatchToContract(this.data.currentContract.id, batchNo);
    if (result.success) {
      wx.showToast({ title: '关联成功', icon: 'success' });
      this.closeLinkModal();
      this.loadContracts();
    } else {
      wx.showToast({ title: result.error || '关联失败', icon: 'none' });
    }
  },

  viewLinkedBatch: function(e) {
    const batchNo = e.currentTarget.dataset.batch;
    wx.navigateTo({ url: '/pages/batchList/batchList?batchNo=' + batchNo });
  }
});
