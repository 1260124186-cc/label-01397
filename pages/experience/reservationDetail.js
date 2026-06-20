var experience = require('../../utils/experience.js');

Page({
  data: {
    reservation: null,
    statusLabel: '',
    createTimeLabel: '',
    checkInTimeLabel: '',
    activityType: null,
    showQrCode: false,
    canvasWidth: 400,
    canvasHeight: 400
  },

  onLoad: function(options) {
    this.reservationId = options.id;
    this.loadReservation();
    wx.setNavigationBarTitle({ title: '预约详情' });
  },

  onShow: function() {
    this.loadReservation();
  },

  loadReservation: function() {
    var reservation = experience.getReservationById(this.reservationId);
    if (!reservation) {
      wx.showToast({ title: '预约不存在', icon: 'none' });
      setTimeout(function() { wx.navigateBack(); }, 1500);
      return;
    }

    var activityType = experience.getExperienceTypeByKey(reservation.activityTypeKey);

    this.setData({
      reservation: reservation,
      statusLabel: experience.RESERVATION_STATUS_LABEL[reservation.status] || reservation.status,
      createTimeLabel: experience.formatFullTime(reservation.createdAt),
      checkInTimeLabel: reservation.checkedInAt ? experience.formatFullTime(reservation.checkedInAt) : '',
      activityType: activityType
    });

    if (reservation.status === 'confirmed') {
      this.setData({ showQrCode: true });
    }
  },

  cancelReservation: function() {
    var that = this;
    wx.showModal({
      title: '取消预约',
      content: '确定要取消该预约吗？',
      confirmColor: '#E74C3C',
      success: function(res) {
        if (res.confirm) {
          var result = experience.cancelReservation(that.reservationId);
          if (result.success) {
            wx.showToast({ title: '已取消', icon: 'success' });
            that.loadReservation();
          } else {
            wx.showToast({ title: result.reason || '取消失败', icon: 'none' });
          }
        }
      }
    });
  },

  contactService: function() {
    wx.makePhoneCall({
      phoneNumber: '4008880000',
      fail: function(err) {
        console.log('[Reservation] 拨打失败:', err);
      }
    });
  },

  copyReservationId: function() {
    if (!this.data.reservation) return;
    wx.setClipboardData({
      data: this.data.reservation.id,
      success: function() {
        wx.showToast({ title: '已复制预约号', icon: 'success' });
      }
    });
  },

  goVerify: function() {
    wx.navigateTo({
      url: '/pages/experience/verify'
    });
  }
});
