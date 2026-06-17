const i18n = require('../../utils/i18n/index.js');
const ticketService = require('../../utils/ticketService.js');

const FAQ_CATEGORIES = [
  { key: 'all', i18nKey: 'service.faqAll' },
  { key: 'trace_not_found', i18nKey: 'service.faqCategoryTrace' },
  { key: 'report_unclear', i18nKey: 'service.faqCategoryReport' },
  { key: 'brewing_issue', i18nKey: 'service.faqCategoryBrew' },
  { key: 'product_quality', i18nKey: 'service.faqCategoryQuality' }
];

Page({
  data: {
    currentLang: 'zh-CN',
    currentFontSize: 'normal',
    a11yClasses: 'font-normal',
    i18n: {},
    searchKeyword: '',
    activeCategory: 'all',
    categories: [],
    faqList: [],
    expandedFaqIds: {},
    allExpanded: false,
    ticketCount: 0,
    incomingTraceId: ''
  },

  onLoad: function(options) {
    this.refreshA11yData();
    this.loadI18n();
    this.refreshFaqList();
    if (options && options.traceId) {
      this.setData({ incomingTraceId: options.traceId });
    }
  },

  onShow: function() {
    this.refreshA11yData();
    this.loadI18n();
    this.refreshFaqList();
    this.refreshTicketCount();
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
    const categories = FAQ_CATEGORIES.map(cat => ({
      key: cat.key,
      label: t(cat.i18nKey)
    }));
    this.setData({
      categories: categories,
      'i18n.title': t('service.title'),
      'i18n.subtitle': t('service.subtitle'),
      'i18n.faqTitle': t('service.faqTitle'),
      'i18n.faqSearchPlaceholder': t('service.faqSearchPlaceholder'),
      'i18n.ticketEntry': t('service.ticketEntry'),
      'i18n.ticketEntryDesc': t('service.ticketEntryDesc'),
      'i18n.myTickets': t('service.myTickets'),
      'i18n.myTicketsDesc': t('service.myTicketsDesc'),
      'i18n.hotline': t('service.hotline'),
      'i18n.hotlineValue': t('service.hotlineValue'),
      'i18n.workHours': t('service.workHours'),
      'i18n.workHoursValue': t('service.workHoursValue'),
      'i18n.expandAll': t('service.expandAll'),
      'i18n.collapseAll': t('service.collapseAll')
    });
    wx.setNavigationBarTitle({ title: t('service.title') });
  },

  refreshFaqList: function() {
    let faqs;
    if (this.data.searchKeyword) {
      faqs = ticketService.searchFaq(this.data.searchKeyword);
    } else if (this.data.activeCategory === 'all') {
      faqs = ticketService.getFaqList();
    } else {
      faqs = ticketService.getFaqList(this.data.activeCategory);
    }
    this.setData({ faqList: faqs });
  },

  refreshTicketCount: function() {
    const tickets = ticketService.getTickets();
    const pendingCount = tickets.filter(t =>
      t.status === ticketService.TICKET_STATUS.PENDING ||
      t.status === ticketService.TICKET_STATUS.PROCESSING
    ).length;
    this.setData({ ticketCount: pendingCount });
  },

  onSearchInput: function(e) {
    this.setData({ searchKeyword: e.detail.value });
    this.refreshFaqList();
  },

  onSearchClear: function() {
    this.setData({ searchKeyword: '' });
    this.refreshFaqList();
  },

  selectCategory: function(e) {
    const key = e.currentTarget.dataset.key;
    this.setData({
      activeCategory: key,
      expandedFaqIds: {}
    });
    this.refreshFaqList();
  },

  toggleFaq: function(e) {
    const id = e.currentTarget.dataset.id;
    const expanded = { ...this.data.expandedFaqIds };
    expanded[id] = !expanded[id];
    this.setData({ expandedFaqIds: expanded });
  },

  toggleAllFaq: function() {
    const newAllExpanded = !this.data.allExpanded;
    const expanded = {};
    if (newAllExpanded) {
      this.data.faqList.forEach(faq => {
        expanded[faq.id] = true;
      });
    }
    this.setData({
      allExpanded: newAllExpanded,
      expandedFaqIds: expanded
    });
  },

  goCreateTicket: function() {
    var url = '/pages/service/ticketCreate';
    if (this.data.incomingTraceId) {
      url += '?traceId=' + this.data.incomingTraceId;
    }
    wx.navigateTo({ url: url });
  },

  goTicketList: function() {
    wx.navigateTo({ url: '/pages/service/ticketList' });
  },

  callHotline: function() {
    wx.makePhoneCall({
      phoneNumber: '4008880000',
      fail: function(err) {
        console.log('[Service] 拨打失败或取消:', err);
      }
    });
  },

  previewFaqImage: function(e) {
    const url = e.currentTarget.dataset.url;
    wx.previewImage({ current: url, urls: [url] });
  }
});
