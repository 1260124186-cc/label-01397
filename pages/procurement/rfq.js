const procurement = require('../../utils/procurement.js');

Page({
  data: {
    rfqList: [],
    activeTab: 'all',
    tabs: [
      { key: 'all', label: '全部' },
      { key: 'open', label: '进行中' },
      { key: 'closed', label: '已结束' }
    ],
    showCreate: false,
    canCreate: false,
    form: {
      title: '',
      productName: '',
      specification: '',
      quantity: '',
      unit: '罐',
      expectedPrice: '',
      deadline: '',
      deliveryDate: '',
      description: ''
    },
    unitOptions: ['罐', '盒', '箱', '件', '公斤']
  },

  onLoad: function() {
    if (!procurement.isProcurementLoggedIn()) {
      wx.redirectTo({ url: '/pages/procurement/login' });
      return;
    }
    const canCreate = procurement.hasPermission('createRFQ');
    this.setData({ canCreate: canCreate });
    this.loadRFQs();
  },

  onShow: function() {
    this.loadRFQs();
  },

  loadRFQs: function() {
    let list = procurement.getRFQs();
    if (this.data.activeTab !== 'all') {
      list = list.filter(function(r) { return r.status === this.data.activeTab; }.bind(this));
    }
    this.setData({ rfqList: list });
  },

  switchTab: function(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
    this.loadRFQs();
  },

  openCreate: function() {
    if (!procurement.hasPermission('createRFQ')) {
      wx.showToast({ title: '无权限创建RFQ', icon: 'none' });
      return;
    }
    this.setData({ showCreate: true });
  },

  closeCreate: function() {
    this.setData({
      showCreate: false,
      form: { title: '', productName: '', specification: '', quantity: '', unit: '罐', expectedPrice: '', deadline: '', deliveryDate: '', description: '' }
    });
  },

  onFormInput: function(e) {
    const field = e.currentTarget.dataset.field;
    const value = e.detail.value;
    const form = Object.assign({}, this.data.form);
    form[field] = value;
    this.setData({ form: form });
  },

  onDateChange: function(e) {
    const field = e.currentTarget.dataset.field;
    const form = Object.assign({}, this.data.form);
    form[field] = e.detail.value;
    this.setData({ form: form });
  },

  selectUnit: function(e) {
    const unit = e.currentTarget.dataset.unit;
    const form = Object.assign({}, this.data.form);
    form.unit = unit;
    this.setData({ form: form });
  },

  submitRFQ: function() {
    const form = this.data.form;
    if (!form.title || !form.productName || !form.quantity) {
      wx.showToast({ title: '请填写标题、产品名称和数量', icon: 'none' });
      return;
    }
    const result = procurement.createRFQ(form);
    if (result.success) {
      wx.showToast({ title: 'RFQ发布成功', icon: 'success' });
      this.closeCreate();
      this.loadRFQs();
    } else {
      wx.showToast({ title: result.error || '发布失败', icon: 'none' });
    }
  },

  viewRFQDetail: function(e) {
    const id = e.currentTarget.dataset.id;
    const rfq = procurement.getRFQById(id);
    if (!rfq) return;
    let quotesText = '暂无报价';
    if (rfq.quotes && rfq.quotes.length > 0) {
      quotesText = rfq.quotes.map(function(q) {
        return q.supplier + '：¥' + q.price + '，交期' + q.deliveryDays + '天，评分' + q.rating + (q.selected ? '（已选中）' : '');
      }).join('\n');
    }
    wx.showModal({
      title: rfq.title,
      content: '产品：' + rfq.productName + ' ' + rfq.specification +
        '\n数量：' + rfq.quantity + rfq.unit +
        '\n期望价格：¥' + rfq.expectedPrice +
        '\n报价截止：' + rfq.deadline +
        '\n期望交付：' + rfq.deliveryDate +
        '\n创建人：' + rfq.creator + ' ' + rfq.createTime +
        '\n\n描述：' + (rfq.description || '无') +
        '\n\n--- 供应商报价 ---\n' + quotesText,
      showCancel: false,
      confirmText: '知道了'
    });
  }
});
