const i18n = require('../../utils/i18n/index.js');
const ticketService = require('../../utils/ticketService.js');

const TABS = [
  { key: 'all', i18nKey: 'service.ticketList.tabAll' },
  { key: 'pending', i18nKey: 'service.ticketList.tabPending' },
  { key: 'processing', i18nKey: 'service.ticketList.tabProcessing' },
  { key: 'resolved', i18nKey: 'service.ticketList.tabResolved' }
];

Page({
  data: {
    currentLang: 'zh-CN',
    currentFontSize: 'normal',
    a11yClasses: 'font-normal',
    i18n: {},
    tabs: [],
    activeTab: 'all',
    allTickets: [],
    filteredTickets: [],
    loading: true
  },

  onLoad: function() {
    this.refreshA11yData();
    this.loadI18n();
    this.loadTickets();
  },

  onShow: function() {
    this.refreshA11yData();
    this.loadI18n();
    this.loadTickets();
  },

  onPullDownRefresh: function() {
    this.loadTickets();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 500);
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
    const tabs = TABS.map(tab => ({
      key: tab.key,
      label: t(tab.i18nKey)
    }));
    this.setData({
      tabs: tabs,
      'i18n.emptyTip': t('service.ticketList.emptyTip'),
      'i18n.emptyDesc': t('service.ticketList.emptyDesc'),
      'i18n.goCreate': t('service.ticketList.goCreate'),
      'i18n.statusPending': t('service.ticketList.statusPending'),
      'i18n.statusProcessing': t('service.ticketList.statusProcessing'),
      'i18n.statusResolved': t('service.ticketList.statusResolved'),
      'i18n.statusClosed': t('service.ticketList.statusClosed')
    });
    wx.setNavigationBarTitle({ title: t('service.ticketList.title') });
  },

  loadTickets: function() {
    const rawTickets = ticketService.getTickets();
    const tickets = rawTickets.map(t => ({
      ...t,
      timeText: ticketService.formatTime(t.createdAt),
      statusText: this.getStatusText(t.status),
      statusClass: this.getStatusClass(t.status),
      needRating: t.status === ticketService.TICKET_STATUS.RESOLVED && t.rating === 0
    }));

    this.setData({
      allTickets: tickets,
      loading: false
    });
    this.filterTickets();
  },

  getStatusText: function(status) {
    const t = function(k) { return i18n.t(k); };
    const map = {
      pending: t('service.ticketList.statusPending'),
      processing: t('service.ticketList.statusProcessing'),
      resolved: t('service.ticketList.statusResolved'),
      closed: t('service.ticketList.statusClosed')
    };
    return map[status] || map.pending;
  },

  getStatusClass: function(status) {
    const map = {
      pending: 'status-pending',
      processing: 'status-processing',
      resolved: 'status-resolved',
      closed: 'status-closed'
    };
    return map[status] || map.pending;
  },

  switchTab: function(e) {
    const key = e.currentTarget.dataset.key;
    this.setData({ activeTab: key });
    this.filterTickets();
  },

  filterTickets: function() {
    let filtered;
    if (this.data.activeTab === 'all') {
      filtered = this.data.allTickets;
    } else if (this.data.activeTab === 'resolved') {
      filtered = this.data.allTickets.filter(t =>
        t.status === ticketService.TICKET_STATUS.RESOLVED ||
        t.status === ticketService.TICKET_STATUS.CLOSED
      );
    } else {
      filtered = this.data.allTickets.filter(t => t.status === this.data.activeTab);
    }
    this.setData({ filteredTickets: filtered });
  },

  goDetail: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '/pages/service/ticketDetail?id=' + id });
  },

  goCreate: function() {
    wx.navigateTo({ url: '/pages/service/ticketCreate' });
  }
});
