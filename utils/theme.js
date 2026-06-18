/**
 * 桂花茶溯源小程序 - 主题管理工具
 * 功能：主题令牌体系、深色模式切换、跟随系统、持久化存储
 */

const STORAGE_KEY_THEME = 'app_theme_mode';

const THEME_LIGHT = 'light';
const THEME_DARK = 'dark';
const THEME_SYSTEM = 'system';

const lightTokens = {
  primary: '#2E8B57',
  primaryLight: '#3CB371',
  primaryDark: '#228B22',
  secondary: '#DAA520',
  secondaryLight: '#F0C75E',
  secondaryDark: '#B8860B',
  bgPrimary: '#F5F5F0',
  bgSecondary: '#FFFFFF',
  bgCard: '#FFFFFF',
  textPrimary: '#333333',
  textSecondary: '#666666',
  textHint: '#999999',
  textWhite: '#FFFFFF',
  borderColor: '#E8E8E8',
  borderLight: '#F0F0F0',
  success: '#52C41A',
  warning: '#FAAD14',
  error: '#FF4D4F',
  info: '#1890FF',
  shadowSm: '0 2rpx 8rpx rgba(0, 0, 0, 0.08)',
  shadowMd: '0 4rpx 16rpx rgba(0, 0, 0, 0.12)',
  shadowLg: '0 8rpx 24rpx rgba(0, 0, 0, 0.16)'
};

const darkTokens = {
  primary: '#3CB371',
  primaryLight: '#66CDAA',
  primaryDark: '#2E8B57',
  secondary: '#F0C75E',
  secondaryLight: '#FFD700',
  secondaryDark: '#DAA520',
  bgPrimary: '#121212',
  bgSecondary: '#1E1E1E',
  bgCard: '#2A2A2A',
  textPrimary: '#E8E8E8',
  textSecondary: '#A0A0A0',
  textHint: '#707070',
  textWhite: '#FFFFFF',
  borderColor: '#3A3A3A',
  borderLight: '#2F2F2F',
  success: '#52C41A',
  warning: '#FAAD14',
  error: '#FF7875',
  info: '#40A9FF',
  shadowSm: '0 2rpx 8rpx rgba(0, 0, 0, 0.3)',
  shadowMd: '0 4rpx 16rpx rgba(0, 0, 0, 0.4)',
  shadowLg: '0 8rpx 24rpx rgba(0, 0, 0, 0.5)'
};

let currentThemeMode = THEME_SYSTEM;
let resolvedTheme = THEME_LIGHT;

function getStoredThemeMode() {
  try {
    const stored = wx.getStorageSync(STORAGE_KEY_THEME);
    if ([THEME_LIGHT, THEME_DARK, THEME_SYSTEM].indexOf(stored) !== -1) {
      return stored;
    }
  } catch (e) {}
  return THEME_SYSTEM;
}

function getSystemTheme() {
  try {
    const systemInfo = wx.getSystemInfoSync();
    return systemInfo.theme === 'dark' ? THEME_DARK : THEME_LIGHT;
  } catch (e) {
    return THEME_LIGHT;
  }
}

function resolveTheme(mode) {
  if (mode === THEME_SYSTEM) {
    return getSystemTheme();
  }
  return mode;
}

function initTheme() {
  currentThemeMode = getStoredThemeMode();
  resolvedTheme = resolveTheme(currentThemeMode);
  applySystemThemeListener();
}

function applySystemThemeListener() {
  try {
    if (wx.onThemeChange) {
      wx.offThemeChange && wx.offThemeChange();
      wx.onThemeChange(function(res) {
        if (currentThemeMode === THEME_SYSTEM) {
          const newTheme = res.theme === 'dark' ? THEME_DARK : THEME_LIGHT;
          if (newTheme !== resolvedTheme) {
            resolvedTheme = newTheme;
            notifyThemeChange();
          }
        }
      });
    }
  } catch (e) {
    console.warn('[Theme] 系统主题监听不支持:', e);
  }
}

function notifyThemeChange() {
  try {
    const app = getApp();
    if (app && typeof app.onThemeChange === 'function') {
      app.onThemeChange(resolvedTheme, getThemeTokens(), getThemeClass());
    }
  } catch (e) {}
}

function setThemeMode(mode) {
  if ([THEME_LIGHT, THEME_DARK, THEME_SYSTEM].indexOf(mode) === -1) {
    return false;
  }
  currentThemeMode = mode;
  const newResolvedTheme = resolveTheme(mode);
  const themeChanged = newResolvedTheme !== resolvedTheme;
  resolvedTheme = newResolvedTheme;
  try {
    wx.setStorageSync(STORAGE_KEY_THEME, mode);
  } catch (e) {}
  if (themeChanged) {
    notifyThemeChange();
  }
  return true;
}

function getThemeMode() {
  return currentThemeMode;
}

function getResolvedTheme() {
  return resolvedTheme;
}

function isDarkMode() {
  return resolvedTheme === THEME_DARK;
}

function getThemeTokens() {
  return isDarkMode() ? { ...darkTokens } : { ...lightTokens };
}

function getThemeToken(tokenName) {
  const tokens = getThemeTokens();
  return tokens[tokenName] || null;
}

function getThemeClass() {
  return 'theme-' + resolvedTheme;
}

function getAvailableThemes() {
  const i18n = require('./i18n/index.js');
  return [
    { mode: THEME_SYSTEM, label: i18n.t('settings.themeFollowSystem'), icon: '🌓' },
    { mode: THEME_LIGHT, label: i18n.t('settings.themeLight'), icon: '☀️' },
    { mode: THEME_DARK, label: i18n.t('settings.themeDark'), icon: '🌙' }
  ];
}

function getThemeModeLabel() {
  const i18n = require('./i18n/index.js');
  const labels = {};
  labels[THEME_SYSTEM] = i18n.t('settings.themeFollowSystem');
  labels[THEME_LIGHT] = i18n.t('settings.themeLight');
  labels[THEME_DARK] = i18n.t('settings.themeDark');
  return labels[currentThemeMode] || '';
}

function getCanvasThemeColors() {
  const tokens = getThemeTokens();
  return {
    primary: tokens.primary,
    secondary: tokens.secondary,
    background: tokens.bgPrimary,
    cardBg: tokens.bgCard,
    text: tokens.textPrimary,
    lightText: tokens.textSecondary,
    border: tokens.borderColor
  };
}

function applySettingsToApp(app) {
  if (!app || !app.globalData) return;
  app.globalData.currentThemeMode = currentThemeMode;
  app.globalData.resolvedTheme = resolvedTheme;
  app.globalData.isDarkMode = isDarkMode();
  app.globalData.themeTokens = getThemeTokens();
  app.globalData.themeClass = getThemeClass();
}

initTheme();

module.exports = {
  THEME_LIGHT,
  THEME_DARK,
  THEME_SYSTEM,
  STORAGE_KEY_THEME,
  setThemeMode,
  getThemeMode,
  getResolvedTheme,
  isDarkMode,
  getThemeTokens,
  getThemeToken,
  getThemeClass,
  getAvailableThemes,
  getThemeModeLabel,
  getCanvasThemeColors,
  applySettingsToApp,
  lightTokens,
  darkTokens
};
