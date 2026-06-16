/**
 * app.js 全局方法单元测试
 * 测试功能：
 * 1. compareVersion - 版本号比较函数
 * 2. globalData - 全局数据结构
 */

// 模拟微信小程序环境
global.App = function(options) {
  Object.assign(global, options);
};

// 加载 app.js
require('../app.js');

describe('app.js 全局方法测试', () => {
  describe('compareVersion 函数测试', () => {
    test('版本号相等时应该返回 0', () => {
      expect(global.compareVersion('1.0.0', '1.0.0')).toBe(0);
      expect(global.compareVersion('2.29.0', '2.29.0')).toBe(0);
      expect(global.compareVersion('0.0.1', '0.0.1')).toBe(0);
    });

    test('v1 大于 v2 时应该返回 1', () => {
      expect(global.compareVersion('2.0.0', '1.0.0')).toBe(1);
      expect(global.compareVersion('1.1.0', '1.0.0')).toBe(1);
      expect(global.compareVersion('1.0.1', '1.0.0')).toBe(1);
      expect(global.compareVersion('2.29.0', '2.28.9')).toBe(1);
    });

    test('v1 小于 v2 时应该返回 -1', () => {
      expect(global.compareVersion('1.0.0', '2.0.0')).toBe(-1);
      expect(global.compareVersion('1.0.0', '1.1.0')).toBe(-1);
      expect(global.compareVersion('1.0.0', '1.0.1')).toBe(-1);
      expect(global.compareVersion('2.28.9', '2.29.0')).toBe(-1);
    });

    test('不同长度的版本号比较', () => {
      expect(global.compareVersion('1.0', '1.0.0')).toBe(0);
      expect(global.compareVersion('1.0.0', '1.0')).toBe(0);
      expect(global.compareVersion('1.0.1', '1.0')).toBe(1);
      expect(global.compareVersion('1.0', '1.0.1')).toBe(-1);
    });

    test('多段版本号比较', () => {
      expect(global.compareVersion('1.0.0.0', '1.0.0.0')).toBe(0);
      expect(global.compareVersion('1.0.0.1', '1.0.0.0')).toBe(1);
      expect(global.compareVersion('1.0.0.0', '1.0.0.1')).toBe(-1);
    });
  });

  describe('globalData 全局数据测试', () => {
    test('globalData 应该存在', () => {
      expect(global.globalData).toBeDefined();
    });

    test('应用名称应该正确', () => {
      expect(global.globalData.appName).toBe('一茶一品・桂花茶溯源');
    });

    test('主题色配置应该完整', () => {
      expect(global.globalData.themeColors).toBeDefined();
      expect(global.globalData.themeColors.primary).toBe('#2E8B57');
      expect(global.globalData.themeColors.secondary).toBe('#DAA520');
      expect(global.globalData.themeColors.background).toBe('#F5F5F0');
      expect(global.globalData.themeColors.text).toBe('#333333');
      expect(global.globalData.themeColors.lightText).toBe('#666666');
    });

    test('API 基础地址应该正确', () => {
      expect(global.globalData.apiBaseUrl).toBe('https://api.example.com/trace');
    });

    test('用户信息初始值应该为 null', () => {
      expect(global.globalData.userInfo).toBeNull();
    });
  });
});
