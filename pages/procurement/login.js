const procurement = require('../../utils/procurement.js');

Page({
  data: {
    account: '',
    password: '',
    loading: false,
    sampleAccounts: []
  },

  onLoad: function() {
    this.setData({
      sampleAccounts: procurement.getSampleAccounts()
    });
    if (procurement.isProcurementLoggedIn()) {
      wx.redirectTo({ url: '/pages/procurement/dashboard' });
    }
  },

  onAccountInput: function(e) {
    this.setData({ account: e.detail.value });
  },

  onPasswordInput: function(e) {
    this.setData({ password: e.detail.value });
  },

  fillSampleAccount: function(e) {
    const account = e.currentTarget.dataset.account;
    this.setData({ account: account, password: '123456' });
  },

  doLogin: function() {
    const that = this;
    if (!this.data.account || !this.data.password) {
      wx.showToast({ title: '请输入账号和密码', icon: 'none' });
      return;
    }

    this.setData({ loading: true });
    procurement.procurementLogin(this.data.account, this.data.password)
      .then(function(res) {
        that.setData({ loading: false });
        const app = getApp();
        if (typeof app.procurementLoginSuccess === 'function') {
          app.procurementLoginSuccess(res.data);
        } else {
          app.globalData.procurementLoggedIn = true;
          app.globalData.procurementUser = res.data;
        }
        wx.showToast({ title: '登录成功', icon: 'success' });
        setTimeout(function() {
          wx.redirectTo({ url: '/pages/procurement/dashboard' });
        }, 800);
      })
      .catch(function(err) {
        that.setData({ loading: false });
        wx.showToast({ title: err.msg || '登录失败', icon: 'none' });
      });
  },

  goBack: function() {
    wx.navigateBack();
  }
});
