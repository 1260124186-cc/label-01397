const zhCN = require('./locales/zh-CN.js');
const enUS = require('./locales/en-US.js');
const jaJP = require('./locales/ja-JP.js');

const LANG_ZH = 'zh-CN';
const LANG_EN = 'en-US';
const LANG_JA = 'ja-JP';

const STORAGE_KEY_LANG = 'i18n_language';
const STORAGE_KEY_FONT = 'a11y_fontSize';
const STORAGE_KEY_COLORWEAK = 'a11y_colorWeak';

const FONT_NORMAL = 'normal';
const FONT_LARGE = 'large';
const FONT_EXTRA = 'extra';

const locales = {
  [LANG_ZH]: zhCN,
  [LANG_EN]: enUS,
  [LANG_JA]: jaJP
};

let currentLang = LANG_ZH;
let currentFontSize = FONT_NORMAL;
let currentColorWeak = false;

function getStoredLang() {
  try {
    const stored = wx.getStorageSync(STORAGE_KEY_LANG);
    if (stored && locales[stored]) {
      return stored;
    }
  } catch (e) {}
  try {
    const sys = wx.getSystemInfoSync();
    const lang = sys.language || '';
    if (lang.toLowerCase().startsWith('ja')) {
      return LANG_JA;
    }
    if (lang.toLowerCase().startsWith('en')) {
      return LANG_EN;
    }
  } catch (e) {}
  return LANG_ZH;
}

function getStoredFontSize() {
  try {
    const stored = wx.getStorageSync(STORAGE_KEY_FONT);
    if ([FONT_NORMAL, FONT_LARGE, FONT_EXTRA].indexOf(stored) !== -1) {
      return stored;
    }
  } catch (e) {}
  return FONT_NORMAL;
}

function getStoredColorWeak() {
  try {
    const stored = wx.getStorageSync(STORAGE_KEY_COLORWEAK);
    return !!stored;
  } catch (e) {}
  return false;
}

currentLang = getStoredLang();
currentFontSize = getStoredFontSize();
currentColorWeak = getStoredColorWeak();

function getNestedValue(obj, path) {
  if (!obj || !path) return undefined;
  const parts = path.split('.');
  let result = obj;
  for (let i = 0; i < parts.length; i++) {
    if (result == null) return undefined;
    result = result[parts[i]];
  }
  return result;
}

function formatTemplate(str, args) {
  if (!str || !args || args.length === 0) return str;
  return str.replace(/\{(\d+)\}/g, function(match, index) {
    const i = parseInt(index, 10);
    return args[i] !== undefined ? args[i] : match;
  });
}

function t(key) {
  const locale = locales[currentLang] || locales[LANG_ZH];
  let value = getNestedValue(locale, key);

  if (value === undefined) {
    const zhValue = getNestedValue(locales[LANG_ZH], key);
    if (zhValue !== undefined) {
      value = zhValue;
    } else {
      value = key;
    }
  }

  if (typeof value === 'string') {
    const args = Array.prototype.slice.call(arguments, 1);
    return formatTemplate(value, args);
  }

  return value;
}

function setLanguage(lang) {
  if (!locales[lang]) return false;
  currentLang = lang;
  try {
    wx.setStorageSync(STORAGE_KEY_LANG, lang);
  } catch (e) {}
  return true;
}

function getLanguage() {
  return currentLang;
}

function getAvailableLanguages() {
  return [
    { code: LANG_ZH, label: '中文' },
    { code: LANG_EN, label: 'English' },
    { code: LANG_JA, label: '日本語' }
  ];
}

function setFontSize(size) {
  if ([FONT_NORMAL, FONT_LARGE, FONT_EXTRA].indexOf(size) === -1) return false;
  currentFontSize = size;
  try {
    wx.setStorageSync(STORAGE_KEY_FONT, size);
  } catch (e) {}
  return true;
}

function getFontSize() {
  return currentFontSize;
}

function getFontSizeLabel() {
  const labels = {};
  labels[FONT_NORMAL] = t('settings.fontSizeNormal');
  labels[FONT_LARGE] = t('settings.fontSizeLarge');
  labels[FONT_EXTRA] = t('settings.fontSizeExtra');
  return labels[currentFontSize] || '';
}

function getFontMultiplier() {
  const multipliers = {};
  multipliers[FONT_NORMAL] = 1.0;
  multipliers[FONT_LARGE] = 1.25;
  multipliers[FONT_EXTRA] = 1.5;
  return multipliers[currentFontSize] || 1.0;
}

function setColorWeak(enabled) {
  currentColorWeak = !!enabled;
  try {
    wx.setStorageSync(STORAGE_KEY_COLORWEAK, currentColorWeak);
  } catch (e) {}
  return true;
}

function getColorWeak() {
  return currentColorWeak;
}

function getFontSizeClass() {
  return 'font-' + currentFontSize;
}

function getColorWeakClass() {
  return currentColorWeak ? 'color-weak' : '';
}

function getAccessibilityClasses() {
  const classes = [];
  classes.push(getFontSizeClass());
  if (currentColorWeak) classes.push(getColorWeakClass());
  return classes.join(' ');
}

function getA11yData() {
  return {
    currentLang: currentLang,
    currentFontSize: currentFontSize,
    currentColorWeak: currentColorWeak,
    a11yClasses: getAccessibilityClasses(),
    fontMultiplier: getFontMultiplier()
  };
}

function applySettingsToApp(app) {
  if (!app || !app.globalData) return;
  app.globalData.currentLang = currentLang;
  app.globalData.currentFontSize = currentFontSize;
  app.globalData.currentColorWeak = currentColorWeak;
  app.globalData.fontMultiplier = getFontMultiplier();
  app.globalData.a11yClasses = getAccessibilityClasses();
}

module.exports = {
  LANG_ZH,
  LANG_EN,
  LANG_JA,
  FONT_NORMAL,
  FONT_LARGE,
  FONT_EXTRA,
  t,
  setLanguage,
  getLanguage,
  getAvailableLanguages,
  setFontSize,
  getFontSize,
  getFontSizeLabel,
  getFontMultiplier,
  setColorWeak,
  getColorWeak,
  getFontSizeClass,
  getColorWeakClass,
  getAccessibilityClasses,
  getA11yData,
  applySettingsToApp,
  STORAGE_KEY_LANG,
  STORAGE_KEY_FONT,
  STORAGE_KEY_COLORWEAK
};
