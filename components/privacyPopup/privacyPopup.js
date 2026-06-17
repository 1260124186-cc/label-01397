var auth = require('../../utils/auth.js');

Component({
  properties: {
    show: {
      type: Boolean,
      value: false
    }
  },

  data: {
    scrollIntoView: '',
    agreedToTerms: false,
    agreedToPrivacy: false,
    canConfirm: false
  },

  observers: {
    'agreedToTerms, agreedToPrivacy': function(terms, privacy) {
      this.setData({
        canConfirm: terms && privacy
      });
    }
  },

  methods: {
    onScrollToLower: function() {},

    onToggleTerms: function() {
      this.setData({
        agreedToTerms: !this.data.agreedToTerms
      });
    },

    onTogglePrivacy: function() {
      this.setData({
        agreedToPrivacy: !this.data.agreedToPrivacy
      });
    },

    onViewTerms: function() {
      wx.navigateTo({
        url: '/pages/webview/webview?url=' + encodeURIComponent('https://example.com/terms') + '&title=用户服务协议'
      });
    },

    onViewPrivacy: function() {
      wx.navigateTo({
        url: '/pages/webview/webview?url=' + encodeURIComponent('https://example.com/privacy') + '&title=隐私保护政策'
      });
    },

    onConfirm: function() {
      if (!this.data.canConfirm) {
        wx.showToast({ title: '请先阅读并同意相关协议', icon: 'none', duration: 2000 });
        return;
      }
      auth.setPrivacyAgreed(true);
      this.triggerEvent('agree');
    },

    onDeny: function() {
      this.triggerEvent('deny');
    },

    preventBubble: function() {}
  }
});
