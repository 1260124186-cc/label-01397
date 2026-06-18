const dealerAuth = require('../../utils/dealerAuth.js');
const dealerAudit = require('../../utils/dealerAudit.js');

Page({
  data: {
    activeTab: 'login',
    account: '',
    password: '',
    authCode: '',
    loading: false,
    sampleAccounts: [
      { account: 'admin_zq001', role: '区域经理', desc: 'admin_zq001 / 123456' },
      { account: 'admin_cy001', role: '区域经理', desc: 'admin_cy001 / 123456' },
      { account: 'sales_lx001', role: '销售', desc: 'sales_lx001 / 123456' },
      { account: 'admin_wh001', role: '仓管', desc: 'admin_wh001 / 123456' }
    ],
    sampleAuthCodes: [
      'DEALER-2025-HB-8888',
      'DEALER-2025-HB-9999',
      'DEALER-2025-YC-6666',
      'DEALER-2025-XM-7777'
    ]
  },

  onLoad: function() {
    if (dealerAuth.isDealerLoggedIn()) {
      wx.redirectTo({ url: '/pages/dealer/index' });
    }
  },

  switchTab: function(e) {
    var tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
  },

  onAccountInput: function(e) {
    this.setData({ account: e.detail.value });
  },

  onPasswordInput: function(e) {
    this.setData({ password: e.detail.value });
  },

  onAuthCodeInput: function(e) {
    this.setData({ authCode: e.detail.value });
  },

  fillSampleAccount: function(e) {
    var account = e.currentTarget.dataset.account;
    this.setData({ account: account, password: '123456' });
  },

  fillSampleCode: function(e) {
    var code = e.currentTarget.dataset.code;
    this.setData({ authCode: code });
  },

  doLogin: function() {
    var that = this;
    if (!this.data.account || !this.data.password) {
      wx.showToast({ title: '请输入账号和密码', icon: 'none' });
      return;
    }

    this.setData({ loading: true });
    dealerAuth.dealerLogin(this.data.account, this.data.password)
      .then(function(res) {
        that.setData({ loading: false });
        var app = getApp();
        app.dealerLoginSuccess(res.data);
        wx.showToast({ title: '登录成功', icon: 'success' });
        setTimeout(function() {
          wx.redirectTo({ url: '/pages/dealer/index' });
        }, 800);
      })
      .catch(function(err) {
        that.setData({ loading: false });
        wx.showToast({ title: err.msg || '登录失败', icon: 'none' });
      });
  },

  verifyCode: function() {
    var that = this;
    if (!this.data.authCode) {
      wx.showToast({ title: '请输入授权码', icon: 'none' });
      return;
    }

    this.setData({ loading: true });
    dealerAuth.verifyAuthCode(this.data.authCode)
      .then(function(res) {
        that.setData({ loading: false });
        wx.showModal({
          title: '授权成功',
          content: '已开通经销商：' + res.data.dealerName + '\n默认账号：' + res.data.account + '\n初始密码：123456\n请使用账号密码登录经销商工作台',
          showCancel: false,
          confirmText: '去登录',
          success: function() {
            that.setData({
              activeTab: 'login',
              account: res.data.account,
              password: '123456'
            });
          }
        });
      })
      .catch(function(err) {
        that.setData({ loading: false });
        wx.showToast({ title: err.msg || '授权码无效', icon: 'none' });
      });
  },

  goBack: function() {
    wx.navigateBack();
  }
});
