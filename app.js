/**
 * 桂花茶溯源小程序 - 全局入口文件
 * 功能：初始化全局数据、配置全局方法、i18n 与无障碍状态
 * 作者：开发团队
 * 版本：1.0.0
 */

const i18n = require('./utils/i18n/index.js');
const auth = require('./utils/auth.js');
const userStore = require('./utils/userStore.js');

App({
  onLaunch: function() {
    console.log('桂花茶溯源小程序启动');

    i18n.applySettingsToApp(this);
    console.log('无障碍设置:', {
      lang: this.globalData.currentLang,
      fontSize: this.globalData.currentFontSize,
      colorWeak: this.globalData.currentColorWeak
    });

    this.checkPrivacyCompliance();
    this.initUserData();

    const systemInfo = wx.getSystemInfoSync();
    console.log('系统信息:', systemInfo);

    if (this.compareVersion(systemInfo.SDKVersion, '2.29.0') < 0) {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，请升级微信以获得更好的使用体验',
        showCancel: false
      });
    }
  },

  checkPrivacyCompliance: function() {
    var agreed = auth.isPrivacyAgreed();
    this.globalData.privacyAgreed = agreed;
    if (!agreed) {
      console.info('[App] 首次启动，需要展示隐私协议');
    }
  },

  initUserData: function() {
    if (auth.isLoggedIn()) {
      var userInfo = auth.getUserInfo();
      this.globalData.userInfo = userInfo;
      console.info('[App] 用户已登录:', userInfo.openid ? userInfo.openid.substr(-8) : '');
    }

    var privacySettings = userStore.getPrivacySettings();
    this.globalData.privacySettings = privacySettings;

    if (privacySettings.allowCollection) {
      console.info('[App] 用户已授权数据收集');
    } else {
      console.info('[App] 用户未授权数据收集，仅使用本地必要缓存');
    }
  },

  /**
   * 全局翻译函数（可通过 getApp().t() 调用）
   */
  t: function(key) {
    const args = Array.prototype.slice.call(arguments, 1);
    return i18n.t.apply(null, [key].concat(args));
  },

  /**
   * 切换语言并返回新的无障碍数据
   */
  switchLanguage: function(lang) {
    const ok = i18n.setLanguage(lang);
    if (ok) {
      i18n.applySettingsToApp(this);
      return i18n.getA11yData();
    }
    return null;
  },

  /**
   * 切换字号并返回新的无障碍数据
   */
  switchFontSize: function(size) {
    const ok = i18n.setFontSize(size);
    if (ok) {
      i18n.applySettingsToApp(this);
      return i18n.getA11yData();
    }
    return null;
  },

  /**
   * 切换色弱模式并返回新的无障碍数据
   */
  switchColorWeak: function(enabled) {
    i18n.setColorWeak(enabled);
    i18n.applySettingsToApp(this);
    return i18n.getA11yData();
  },

  /**
   * 获取当前无障碍配置
   */
  getA11yData: function() {
    return i18n.getA11yData();
  },

  /**
   * 版本号比较函数
   * @param {string} v1 - 版本号1
   * @param {string} v2 - 版本号2
   * @returns {number} - 1: v1>v2, -1: v1<v2, 0: v1=v2
   */
  compareVersion: function(v1, v2) {
    v1 = v1.split('.');
    v2 = v2.split('.');
    const len = Math.max(v1.length, v2.length);

    while (v1.length < len) {
      v1.push('0');
    }
    while (v2.length < len) {
      v2.push('0');
    }

    for (let i = 0; i < len; i++) {
      const num1 = parseInt(v1[i], 10);
      const num2 = parseInt(v2[i], 10);

      if (num1 > num2) {
        return 1;
      } else if (num1 < num2) {
        return -1;
      }
    }
    return 0;
  },

  /**
   * 全局数据
   * 存储应用级别的共享数据
   */
  globalData: {
    appName: '一茶一品・桂花茶溯源',
    themeColors: {
      primary: '#2E8B57',
      secondary: '#DAA520',
      background: '#F5F5F0',
      text: '#333333',
      lightText: '#666666'
    },
    apiBaseUrl: 'https://api.example.com/trace',
    userInfo: null,
    privacyAgreed: false,
    privacySettings: null,
    currentLang: i18n.LANG_ZH,
    currentFontSize: i18n.FONT_NORMAL,
    currentColorWeak: false,
    fontMultiplier: 1.0,
    a11yClasses: 'font-normal'
  }
});
