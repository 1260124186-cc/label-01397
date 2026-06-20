var experience = require('../../utils/experience.js');

Page({
  data: {
    scanning: false,
    manualInput: '',
    verifyResult: null,
    showResult: false,
    recentCheckIns: []
  },

  onLoad: function(options) {
    this.loadRecentCheckIns();
    wx.setNavigationBarTitle({ title: '扫码签到' });
  },

  onShow: function() {
    this.loadRecentCheckIns();
  },

  loadRecentCheckIns: function() {
    var records = experience.getCheckInRecords();
    var recent = records.slice(0, 5).map(function(r) {
      return {
        ...r,
        timeLabel: experience.formatTime(r.checkedInAt)
      };
    });
    this.setData({ recentCheckIns: recent });
  },

  startScan: function() {
    var that = this;

    wx.scanCode({
      scanType: ['qrCode'],
      success: function(res) {
        console.log('[Verify] 扫码结果:', res);
        that.processQrCode(res.result);
      },
      fail: function(err) {
        console.log('[Verify] 扫码失败:', err);
        if (err.errMsg.indexOf('cancel') === -1) {
          wx.showToast({ title: '扫码失败，请重试', icon: 'none' });
        }
      }
    });
  },

  processQrCode: function(qrContent) {
    var parsed = experience.parseQrCodeData(qrContent);
    if (!parsed) {
      this.setData({
        verifyResult: {
          success: false,
          reason: '无效的预约码，请确认二维码是否正确'
        },
        showResult: true
      });
      return;
    }

    this.doCheckIn(parsed.reservationId);
  },

  onManualInput: function(e) {
    this.setData({ manualInput: e.detail.value });
  },

  manualCheckIn: function() {
    var reservationId = this.data.manualInput.trim();
    if (!reservationId) {
      wx.showToast({ title: '请输入预约号', icon: 'none' });
      return;
    }
    this.doCheckIn(reservationId);
  },

  doCheckIn: function(reservationId) {
    var that = this;
    wx.showLoading({ title: '签到中...', mask: true });

    setTimeout(function() {
      wx.hideLoading();
      var result = experience.checkInByReservationId(reservationId);

      if (result.alreadyCheckedIn) {
        that.setData({
          verifyResult: {
            success: true,
            alreadyCheckedIn: true,
            reservation: result.reservation,
            activityTypeName: result.reservation.activityTypeName,
            activityIcon: result.reservation.activityIcon,
            activityColor: result.reservation.activityColor,
            contactName: result.reservation.contactName,
            peopleCount: result.reservation.peopleCount,
            date: result.reservation.date,
            checkInTime: experience.formatFullTime(result.reservation.checkedInAt),
            pointsEarned: 0,
            reason: '该预约已签到过'
          },
          showResult: true
        });
        that.loadRecentCheckIns();
        return;
      }

      if (result.success) {
        that.setData({
          verifyResult: {
            success: true,
            alreadyCheckedIn: false,
            reservation: result.reservation,
            activityTypeName: result.reservation.activityTypeName,
            activityIcon: result.reservation.activityIcon,
            activityColor: result.reservation.activityColor,
            contactName: result.reservation.contactName,
            peopleCount: result.reservation.peopleCount,
            date: result.reservation.date,
            checkInTime: experience.formatFullTime(result.reservation.checkedInAt),
            pointsEarned: result.pointsEarned,
            totalPoints: result.totalPoints
          },
          showResult: true,
          manualInput: ''
        });
        that.loadRecentCheckIns();
      } else {
        that.setData({
          verifyResult: {
            success: false,
            reason: result.reason || '签到失败'
          },
          showResult: true
        });
      }
    }, 600);
  },

  closeResult: function() {
    this.setData({
      showResult: false,
      verifyResult: null
    });
  },

  viewReservation: function() {
    if (!this.data.verifyResult || !this.data.verifyResult.reservation) return;
    wx.navigateTo({
      url: '/pages/experience/reservationDetail?id=' + this.data.verifyResult.reservation.id
    });
  },

  goMyReservations: function() {
    wx.navigateTo({
      url: '/pages/experience/myReservations'
    });
  },

  goExperienceList: function() {
    wx.navigateTo({
      url: '/pages/experience/list'
    });
  }
});
