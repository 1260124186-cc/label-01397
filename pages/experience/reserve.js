var experience = require('../../utils/experience.js');

Page({
  data: {
    activityType: null,
    activityTypes: [],
    selectedTypeKey: '',
    peopleCount: 1,
    maxPeopleCount: 50,
    date: '',
    minDate: '',
    contactName: '',
    contactPhone: '',
    hasPurchased: false,
    remark: '',
    submitting: false,
    showSuccess: false,
    createdReservationId: ''
  },

  onLoad: function(options) {
    var types = experience.getExperienceTypes();
    var today = experience.getTodayDateStr();

    var selectedTypeKey = '';
    var activityType = null;
    var maxPeopleCount = 50;
    if (options && options.activityType) {
      selectedTypeKey = options.activityType;
      activityType = experience.getExperienceTypeByKey(selectedTypeKey);
      if (activityType && activityType.capacity) {
        maxPeopleCount = activityType.capacity;
      }
    }

    this.setData({
      activityTypes: types,
      activityType: activityType,
      selectedTypeKey: selectedTypeKey,
      maxPeopleCount: maxPeopleCount,
      minDate: today,
      date: today
    });

    wx.setNavigationBarTitle({ title: '预约体验' });
  },

  selectActivityType: function(e) {
    var key = e.currentTarget.dataset.key;
    var activityType = experience.getExperienceTypeByKey(key);
    var maxPeopleCount = 50;
    if (activityType && activityType.capacity) {
      maxPeopleCount = activityType.capacity;
    }

    var newPeopleCount = this.data.peopleCount;
    if (newPeopleCount > maxPeopleCount) {
      newPeopleCount = maxPeopleCount;
    }

    this.setData({
      selectedTypeKey: key,
      activityType: activityType,
      maxPeopleCount: maxPeopleCount,
      peopleCount: newPeopleCount
    });
  },

  onPeopleCountInput: function(e) {
    var val = parseInt(e.detail.value) || 1;
    if (val < 1) val = 1;
    if (val > this.data.maxPeopleCount) val = this.data.maxPeopleCount;
    this.setData({ peopleCount: val });
  },

  increasePeople: function() {
    var val = this.data.peopleCount + 1;
    if (val > this.data.maxPeopleCount) {
      val = this.data.maxPeopleCount;
      wx.showToast({ title: '最多 ' + this.data.maxPeopleCount + ' 人', icon: 'none' });
      return;
    }
    this.setData({ peopleCount: val });
  },

  decreasePeople: function() {
    var val = this.data.peopleCount - 1;
    if (val < 1) val = 1;
    this.setData({ peopleCount: val });
  },

  onDateChange: function(e) {
    this.setData({ date: e.detail.value });
  },

  onContactNameInput: function(e) {
    this.setData({ contactName: e.detail.value });
  },

  onContactPhoneInput: function(e) {
    this.setData({ contactPhone: e.detail.value });
  },

  onHasPurchasedChange: function(e) {
    this.setData({ hasPurchased: e.detail.value });
  },

  onRemarkInput: function(e) {
    this.setData({ remark: e.detail.value });
  },

  validate: function() {
    var data = {
      activityTypeKey: this.data.selectedTypeKey,
      peopleCount: this.data.peopleCount,
      date: this.data.date,
      contactName: this.data.contactName,
      contactPhone: this.data.contactPhone
    };
    var result = experience.validateReservationData(data);
    if (!result.valid) {
      wx.showToast({ title: result.reason, icon: 'none' });
      return false;
    }
    return true;
  },

  submitReservation: function() {
    if (this.data.submitting) return;
    if (!this.validate()) return;

    var that = this;
    this.setData({ submitting: true });

    setTimeout(function() {
      var newReservation = experience.createReservation({
        activityTypeKey: that.data.selectedTypeKey,
        peopleCount: that.data.peopleCount,
        date: that.data.date,
        contactName: that.data.contactName.trim(),
        contactPhone: that.data.contactPhone.trim(),
        hasPurchased: that.data.hasPurchased,
        remark: that.data.remark.trim()
      });

      that.setData({
        submitting: false,
        showSuccess: true,
        createdReservationId: newReservation.id
      });
    }, 800);
  },

  viewReservation: function() {
    wx.redirectTo({
      url: '/pages/experience/reservationDetail?id=' + this.data.createdReservationId
    });
  },

  goMyReservations: function() {
    wx.redirectTo({
      url: '/pages/experience/myReservations'
    });
  },

  continueSubmit: function() {
    this.setData({
      showSuccess: false,
      peopleCount: 1,
      contactName: '',
      contactPhone: '',
      hasPurchased: false,
      remark: '',
      createdReservationId: ''
    });
  }
});
