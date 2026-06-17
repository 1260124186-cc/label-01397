const i18n = require('../../utils/i18n/index.js');
const ticketService = require('../../utils/ticketService.js');

const MAX_IMAGE_COUNT = 3;

Page({
  data: {
    currentLang: 'zh-CN',
    currentFontSize: 'normal',
    a11yClasses: 'font-normal',
    i18n: {},
    problemTypes: ticketService.PROBLEM_TYPES,
    selectedType: '',
    selectedTypeLabel: '',
    title: '',
    description: '',
    traceId: '',
    contact: '',
    images: [],
    submitting: false,
    showSuccess: false,
    createdTicketId: ''
  },

  onLoad: function(options) {
    this.refreshA11yData();
    this.loadI18n();

    if (options && options.traceId) {
      this.setData({ traceId: options.traceId });
    }
    if (options && options.type) {
      const matched = ticketService.PROBLEM_TYPES.find(t => t.key === options.type);
      if (matched) {
        this.setData({
          selectedType: matched.key,
          selectedTypeLabel: matched.label
        });
      }
    }
  },

  onShow: function() {
    this.refreshA11yData();
    this.loadI18n();
  },

  refreshA11yData: function() {
    const a11y = i18n.getA11yData();
    this.setData({
      currentLang: a11y.lang,
      currentFontSize: a11y.fontSize,
      a11yClasses: a11y.classes
    });
  },

  loadI18n: function() {
    const t = function(k) { return i18n.t(k); };
    this.setData({
      'i18n.typeTitle': t('service.ticketCreate.typeTitle'),
      'i18n.typeRequired': t('service.ticketCreate.typeRequired'),
      'i18n.titleLabel': t('service.ticketCreate.titleLabel'),
      'i18n.titlePlaceholder': t('service.ticketCreate.titlePlaceholder'),
      'i18n.titleRequired': t('service.ticketCreate.titleRequired'),
      'i18n.descLabel': t('service.ticketCreate.descLabel'),
      'i18n.descPlaceholder': t('service.ticketCreate.descPlaceholder'),
      'i18n.traceIdLabel': t('service.ticketCreate.traceIdLabel'),
      'i18n.traceIdPlaceholder': t('service.ticketCreate.traceIdPlaceholder'),
      'i18n.traceIdTip': t('service.ticketCreate.traceIdTip'),
      'i18n.contactLabel': t('service.ticketCreate.contactLabel'),
      'i18n.contactPlaceholder': t('service.ticketCreate.contactPlaceholder'),
      'i18n.imagesLabel': t('service.ticketCreate.imagesLabel'),
      'i18n.imagesTip': t('service.ticketCreate.imagesTip'),
      'i18n.submit': t('service.ticketCreate.submit'),
      'i18n.submitting': t('service.ticketCreate.submitting'),
      'i18n.submitSuccess': t('service.ticketCreate.submitSuccess'),
      'i18n.submitSuccessDesc': t('service.ticketCreate.submitSuccessDesc'),
      'i18n.viewTicket': t('service.ticketCreate.viewTicket'),
      'i18n.continueSubmit': t('service.ticketCreate.continueSubmit')
    });
    wx.setNavigationBarTitle({ title: t('service.ticketCreate.title') });
  },

  selectType: function(e) {
    const key = e.currentTarget.dataset.key;
    const label = e.currentTarget.dataset.label;
    this.setData({
      selectedType: key,
      selectedTypeLabel: label
    });
  },

  onTitleInput: function(e) {
    this.setData({ title: e.detail.value });
  },

  onDescInput: function(e) {
    this.setData({ description: e.detail.value });
  },

  onTraceIdInput: function(e) {
    this.setData({ traceId: e.detail.value });
  },

  onContactInput: function(e) {
    this.setData({ contact: e.detail.value });
  },

  chooseImage: function() {
    const that = this;
    const remainCount = MAX_IMAGE_COUNT - this.data.images.length;
    if (remainCount <= 0) {
      wx.showToast({
        title: '最多上传' + MAX_IMAGE_COUNT + '张图片',
        icon: 'none'
      });
      return;
    }

    wx.chooseMedia({
      count: remainCount,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        const newImages = res.tempFiles.map(function(f) { return f.tempFilePath; });
        that.setData({
          images: that.data.images.concat(newImages).slice(0, MAX_IMAGE_COUNT)
        });
      },
      fail: function(err) {
        console.log('[ticketCreate] 选择图片失败:', err);
      }
    });
  },

  removeImage: function(e) {
    const index = e.currentTarget.dataset.index;
    const images = [...this.data.images];
    images.splice(index, 1);
    this.setData({ images: images });
  },

  previewImage: function(e) {
    const url = e.currentTarget.dataset.url;
    wx.previewImage({
      current: url,
      urls: this.data.images
    });
  },

  validate: function() {
    const t = function(k) { return i18n.t(k); };
    if (!this.data.selectedType) {
      wx.showToast({ title: t('service.ticketCreate.typeRequired'), icon: 'none' });
      return false;
    }
    if (!this.data.title.trim()) {
      wx.showToast({ title: t('service.ticketCreate.titleRequired'), icon: 'none' });
      return false;
    }
    return true;
  },

  submitTicket: function() {
    if (this.data.submitting) return;
    if (!this.validate()) return;

    const that = this;
    this.setData({ submitting: true });

    setTimeout(function() {
      const newTicket = ticketService.createTicket({
        type: that.data.selectedType,
        typeLabel: that.data.selectedTypeLabel,
        title: that.data.title.trim(),
        description: that.data.description.trim(),
        traceId: that.data.traceId.trim(),
        images: that.data.images,
        contact: that.data.contact.trim()
      });

      that.setData({
        submitting: false,
        showSuccess: true,
        createdTicketId: newTicket.id
      });
    }, 800);
  },

  viewCreatedTicket: function() {
    wx.redirectTo({
      url: '/pages/service/ticketDetail?id=' + this.data.createdTicketId
    });
  },

  resetAndContinue: function() {
    this.setData({
      showSuccess: false,
      selectedType: '',
      selectedTypeLabel: '',
      title: '',
      description: '',
      contact: '',
      images: [],
      createdTicketId: ''
    });
  }
});
