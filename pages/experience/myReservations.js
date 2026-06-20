var experience = require('../../utils/experience.js');

var STATUS_TABS = [
  { key: 'all', label: '全部' },
  { key: 'confirmed', label: '待签到' },
  { key: 'checked_in', label: '已完成' },
  { key: 'cancelled', label: '已取消' }
];

Page({
  data: {
    tabs: STATUS_TABS,
    activeTab: 'all',
    reservations: [],
    filteredReservations: []
  },

  onLoad: function(options) {
    this.loadReservations();
    wx.setNavigationBarTitle({ title: '我的预约' });
  },

  onShow: function() {
    this.loadReservations();
  },

  loadReservations: function() {
    var reservations = experience.getMyReservations('all');
    var formatted = reservations.map(function(r) {
      return {
        ...r,
        statusLabel: experience.RESERVATION_STATUS_LABEL[r.status] || r.status,
        createTimeLabel: experience.formatTime(r.createdAt),
        checkInTimeLabel: r.checkedInAt ? experience.formatFullTime(r.checkedInAt) : ''
      };
    });
    this.setData({ reservations: formatted });
    this.filterReservations();
  },

  filterReservations: function() {
    var activeTab = this.data.activeTab;
    var reservations = this.data.reservations;
    var filtered = reservations;
    if (activeTab !== 'all') {
      filtered = reservations.filter(function(r) { return r.status === activeTab; });
    }
    this.setData({ filteredReservations: filtered });
  },

  selectTab: function(e) {
    var key = e.currentTarget.dataset.key;
    this.setData({ activeTab: key });
    this.filterReservations();
  },

  viewDetail: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/experience/reservationDetail?id=' + id
    });
  },

  goNewReservation: function() {
    wx.navigateTo({
      url: '/pages/experience/list'
    });
  },

  cancelReservation: function(e) {
    var id = e.currentTarget.dataset.id;
    var that = this;
    wx.showModal({
      title: '取消预约',
      content: '确定要取消该预约吗？',
      confirmColor: '#E74C3C',
      success: function(res) {
        if (res.confirm) {
          var result = experience.cancelReservation(id);
          if (result.success) {
            wx.showToast({ title: '已取消', icon: 'success' });
            that.loadReservations();
          } else {
            wx.showToast({ title: result.reason || '取消失败', icon: 'none' });
          }
        }
      }
    });
  },

  showQrCode: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/experience/reservationDetail?id=' + id
    });
  }
});
