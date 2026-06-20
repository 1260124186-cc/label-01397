var experience = require('../../utils/experience.js');

Page({
  data: {
    experienceTypes: [],
    myReservationCount: 0
  },

  onLoad: function(options) {
    this.loadExperienceTypes();
    wx.setNavigationBarTitle({ title: '线下体验预约' });
  },

  onShow: function() {
    this.loadExperienceTypes();
    this.refreshReservationCount();
  },

  loadExperienceTypes: function() {
    var types = experience.getExperienceTypes();
    this.setData({ experienceTypes: types });
  },

  refreshReservationCount: function() {
    var reservations = experience.getMyReservations('confirmed');
    this.setData({ myReservationCount: reservations.length });
  },

  onActivityTap: function(e) {
    var key = e.currentTarget.dataset.key;
    wx.navigateTo({
      url: '/pages/experience/reserve?activityType=' + key
    });
  },

  goMyReservations: function() {
    wx.navigateTo({
      url: '/pages/experience/myReservations'
    });
  },

  goVerify: function() {
    wx.navigateTo({
      url: '/pages/experience/verify'
    });
  }
});
