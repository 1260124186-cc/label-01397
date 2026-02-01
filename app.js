/**
 * 桂花茶溯源小程序 - 全局入口文件
 * 功能：初始化全局数据、配置全局方法
 * 作者：开发团队
 * 版本：1.0.0
 */

App({
  /**
   * 小程序初始化时触发
   * 用于全局数据初始化、登录状态检查等
   */
  onLaunch: function() {
    console.log('桂花茶溯源小程序启动');
    
    // 检查微信基础库版本，确保兼容性
    const systemInfo = wx.getSystemInfoSync();
    console.log('系统信息:', systemInfo);
    
    // 检查基础库版本是否满足要求（v2.29.0及以上）
    if (this.compareVersion(systemInfo.SDKVersion, '2.29.0') < 0) {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，请升级微信以获得更好的使用体验',
        showCancel: false
      });
    }
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
    // 应用名称
    appName: '一茶一品・桂花茶溯源',
    // 主题色配置（青色 + 金色）
    themeColors: {
      primary: '#2E8B57',      // 青色/海绿色 - 主色调
      secondary: '#DAA520',    // 金色 - 辅助色
      background: '#F5F5F0',   // 米白色背景
      text: '#333333',         // 主文字色
      lightText: '#666666'     // 次要文字色
    },
    // API基础地址（预留后端接口）
    apiBaseUrl: 'https://api.example.com/trace',
    // 用户信息（如需登录功能）
    userInfo: null
  }
});
