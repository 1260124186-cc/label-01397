var experience = require('../../utils/experience.js');
var qrcode = require('../../utils/qrcode.js');

Page({
  data: {
    reservation: null,
    statusLabel: '',
    createTimeLabel: '',
    checkInTimeLabel: '',
    activityType: null,
    showQrCode: false,
    qrSize: 400,
    qrLoading: false
  },

  onLoad: function(options) {
    this.reservationId = options.id;
    var that = this;
    var sysInfo = wx.getSystemInfoSync();
    var qrSize = Math.min(Math.floor(sysInfo.windowWidth * 0.7), 400);
    this.setData({ qrSize: qrSize }, function() {
      that.loadReservation();
    });
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

    var shouldShowQr = (reservation.status === 'confirmed');

    var that = this;
    this.setData({
      reservation: reservation,
      statusLabel: experience.RESERVATION_STATUS_LABEL[reservation.status] || reservation.status,
      createTimeLabel: experience.formatFullTime(reservation.createdAt),
      checkInTimeLabel: reservation.checkedInAt ? experience.formatFullTime(reservation.checkedInAt) : '',
      activityType: activityType,
      showQrCode: shouldShowQr,
      qrLoading: shouldShowQr
    }, function() {
      if (shouldShowQr) {
        setTimeout(function() {
          that.drawQRCode();
        }, 100);
      }
    });
  },

  drawQRCode: function() {
    var that = this;
    if (!this.data.reservation) return;

    var qrContent = this.data.reservation.qrCodeData;
    if (!qrContent) {
      qrContent = JSON.stringify({
        type: 'experience_checkin',
        reservationId: this.data.reservation.id,
        activityType: this.data.reservation.activityTypeKey,
        timestamp: this.data.reservation.createdAt
      });
    }

    qrcode.drawQRCanvas('#reservationQrCanvas', qrContent, this.data.qrSize, {
      errorCorrectLevel: qrcode.QRErrorCorrectLevel.M,
      margin: 2,
      darkColor: '#1a3a2e',
      lightColor: '#ffffff',
      centerIcon: this.data.reservation.activityIcon,
      centerIconSize: 0.18
    }).then(function() {
      that.setData({ qrLoading: false });
    }).catch(function(err) {
      console.error('[QRCode] 绘制失败:', err);
      that.setData({ qrLoading: false });
      wx.showToast({ title: '二维码生成失败', icon: 'none' });
    });
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
