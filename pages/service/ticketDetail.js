const i18n = require('../../utils/i18n/index.js');
const ticketService = require('../../utils/ticketService.js');

const RATING_LABELS = {
  1: 'service.ticketDetail.rating1',
  2: 'service.ticketDetail.rating2',
  3: 'service.ticketDetail.rating3',
  4: 'service.ticketDetail.rating4',
  5: 'service.ticketDetail.rating5'
};

Page({
  data: {
    currentLang: 'zh-CN',
    currentFontSize: 'normal',
    a11yClasses: 'font-normal',
    i18n: {},
    ticketId: '',
    ticket: null,
    loading: true,
    statusLabel: '',
    statusClass: '',
    progressWithTime: [],
    showRating: false,
    rating: 0,
    ratingLabel: '',
    ratingComment: '',
    submittingRating: false
  },

  onLoad: function(options) {
    this.refreshA11yData();
    this.loadI18n();

    if (options && options.id) {
      this.setData({ ticketId: options.id });
      this.loadTicket();
    }
  },

  onShow: function() {
    this.refreshA11yData();
    this.loadI18n();
    if (this.data.ticketId) {
      this.loadTicket();
    }
  },

  onPullDownRefresh: function() {
    this.loadTicket();
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
    this.setData({
      'i18n.ticketId': t('service.ticketDetail.ticketId'),
      'i18n.status': t('service.ticketDetail.status'),
      'i18n.type': t('service.ticketDetail.type'),
      'i18n.createdAt': t('service.ticketDetail.createdAt'),
      'i18n.contact': t('service.ticketDetail.contact'),
      'i18n.traceId': t('service.ticketDetail.traceId'),
      'i18n.description': t('service.ticketDetail.description'),
      'i18n.images': t('service.ticketDetail.images'),
      'i18n.progress': t('service.ticketDetail.progress'),
      'i18n.ratingTitle': t('service.ticketDetail.ratingTitle'),
      'i18n.ratingTip': t('service.ticketDetail.ratingTip'),
      'i18n.ratingCommentPlaceholder': t('service.ticketDetail.ratingCommentPlaceholder'),
      'i18n.ratingSubmit': t('service.ticketDetail.ratingSubmit'),
      'i18n.ratingThanks': t('service.ticketDetail.ratingThanks'),
      'i18n.alreadyRated': t('service.ticketDetail.alreadyRated'),
      'i18n.ratingLabel': t('service.ticketDetail.ratingLabel'),
      'i18n.commentLabel': t('service.ticketDetail.commentLabel')
    });
    wx.setNavigationBarTitle({ title: t('service.ticketDetail.title') });
  },

  loadTicket: function() {
    const ticket = ticketService.getTicketById(this.data.ticketId);
    if (!ticket) {
      this.setData({ loading: false });
      wx.showToast({ title: '工单不存在', icon: 'none' });
      setTimeout(() => wx.navigateBack(), 1500);
      return;
    }

    const statusInfo = this.getStatusInfo(ticket.status);
    const progressWithTime = ticket.progressLogs.map(log => ({
      ...log,
      timeText: ticketService.formatFullTime(log.timestamp)
    })).reverse();

    const showRating = ticket.status === ticketService.TICKET_STATUS.RESOLVED;
    const alreadyRated = ticket.rating > 0;

    this.setData({
      ticket: ticket,
      loading: false,
      statusLabel: statusInfo.label,
      statusClass: statusInfo.className,
      progressWithTime: progressWithTime,
      showRating: showRating && !alreadyRated,
      rating: ticket.rating || 0,
      ratingComment: ticket.ratingComment || ''
    });
  },

  getStatusInfo: function(status) {
    const t = function(k) { return i18n.t(k); };
    const map = {
      pending: { label: t('service.ticketList.statusPending'), className: 'status-pending' },
      processing: { label: t('service.ticketList.statusProcessing'), className: 'status-processing' },
      resolved: { label: t('service.ticketList.statusResolved'), className: 'status-resolved' },
      closed: { label: t('service.ticketList.statusClosed'), className: 'status-closed' }
    };
    return map[status] || map.pending;
  },

  selectRating: function(e) {
    const rating = e.currentTarget.dataset.rating;
    const t = function(k) { return i18n.t(k); };
    this.setData({
      rating: rating,
      ratingLabel: t(RATING_LABELS[rating])
    });
  },

  onRatingCommentInput: function(e) {
    this.setData({ ratingComment: e.detail.value });
  },

  submitRating: function() {
    if (this.data.submittingRating) return;
    if (this.data.rating === 0) {
      wx.showToast({ title: '请选择评分', icon: 'none' });
      return;
    }

    const that = this;
    this.setData({ submittingRating: true });

    setTimeout(function() {
      ticketService.rateTicket(
        that.data.ticketId,
        that.data.rating,
        that.data.ratingComment.trim()
      );
      that.setData({ submittingRating: false });
      wx.showToast({ title: i18n.t('service.ticketDetail.ratingThanks'), icon: 'success' });
      that.loadTicket();
    }, 600);
  },

  previewImage: function(e) {
    const url = e.currentTarget.dataset.url;
    wx.previewImage({
      current: url,
      urls: this.data.ticket.images
    });
  },

  copyTraceId: function() {
    if (!this.data.ticket || !this.data.ticket.traceId) return;
    wx.setClipboardData({
      data: this.data.ticket.traceId,
      success: function() {
        wx.showToast({ title: '已复制溯源ID', icon: 'success' });
      }
    });
  },

  copyTicketId: function() {
    if (!this.data.ticket) return;
    wx.setClipboardData({
      data: this.data.ticket.id,
      success: function() {
        wx.showToast({ title: '已复制工单编号', icon: 'success' });
      }
    });
  }
});
