/**
 * 桂花茶溯源小程序 - 首页
 * 功能：扫码溯源、手动输入溯源ID查询、扫码历史、批量查询、剪贴板识别
 * 页面路径：pages/index/index
 */

const mockData = require('../../utils/mockData.js');
const storage = require('../../utils/storage.js');
const i18n = require('../../utils/i18n/index.js');
const theme = require('../../utils/theme.js');

Page({
  data: {
    inputTraceId: '',
    showInputArea: false,
    showBatchArea: false,
    inputBatchNo: '',
    testIds: ['G001', 'G002', 'G003', 'G004'],
    testBatchNos: ['GH202503', 'GH202504'],
    brandName: '一茶一品・桂花茶溯源',
    pageLoaded: false,
    scanHistory: [],
    showHistory: false,
    showClipboardModal: false,
    clipboardTraceId: '',

    // ===== 无障碍与多语言 =====
    showA11yPanel: false,
    currentLang: i18n.LANG_ZH,
    currentFontSize: i18n.FONT_NORMAL,
    currentColorWeak: false,
    a11yClasses: 'font-normal',
    currentThemeMode: 'system',
    themeClass: 'theme-light',
    pageClass: '',
    availableLanguages: i18n.getAvailableLanguages(),
    availableFontSizes: [
      { key: i18n.FONT_NORMAL, labelZh: '标准', labelEn: 'Standard' },
      { key: i18n.FONT_LARGE, labelZh: '大号', labelEn: 'Large' },
      { key: i18n.FONT_EXTRA, labelZh: '关怀版', labelEn: 'Care Mode' }
    ],
    // i18n 文本
    i18n: {
      scanBtn: '',
      inputPlaceholder: '',
      searchBtn: '',
      historyTitle: '',
      clipboardTitle: '',
      clipboardDesc: '',
      clipboardGoto: '',
      clipboardClose: '',
      a11ySettings: '',
      a11yTitle: '',
      languageLabel: '',
      fontLabel: '',
      colorWeakLabel: '',
      colorWeakDesc: '',
      closeBtn: '',
      quickInputTitle: '',
      quickInputBatchTitle: '',
      batchSearchBtn: '',
      batchPlaceholder: '',
      bannerTag: '',
      announcementTag: '',
      featureHint: '',
      scanGuideTitle: '',
      brandStoryTitle: ''
    },

    bannerList: [
      {
        id: 1,
        type: 'newProduct',
        title: '新品上市',
        subtitle: '金桂花茶礼盒装・六窨一提',
        tag: 'NEW',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=premium%20golden%20osmanthus%20tea%20gift%20box%20luxury%20packaging%20product%20launch&image_size=landscape_16_9',
        traceId: 'G003'
      },
      {
        id: 2,
        type: 'certAward',
        title: '认证获奖',
        subtitle: '有机产品认证・绿色包装认证',
        tag: 'CERT',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=organic%20certification%20award%20ceremony%20tea%20brand%20golden%20trophy&image_size=landscape_16_9',
        traceId: ''
      },
      {
        id: 3,
        type: 'pickSeason',
        title: '采摘季活动',
        subtitle: '2025金秋桂花采摘体验',
        tag: 'EVENT',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=autumn%20osmanthus%20flower%20picking%20festival%20people%20harvesting%20golden%20flowers&image_size=landscape_16_9',
        traceId: ''
      }
    ],
    currentBanner: 0,

    announcementList: [
      { id: 1, type: 'recall', icon: '⚠️', text: '批次GH202504部分产品农残指标异常，请查看详情', batchNo: 'GH202504', priority: 'high' },
      { id: 2, type: 'promo', icon: '🎉', text: '中秋桂花茶礼盒限时8折优惠，活动截止9月30日', priority: 'normal' },
      { id: 3, type: 'info', icon: '📢', text: '2025桂花采摘季即将开始，敬请期待', priority: 'normal' }
    ],
    currentAnnouncement: 0,
    announcementAnimation: false,

    featureCards: [
      { key: 'dualVerify', icon: '🔐', name: '双码验真', desc: '外盒码+内袋码双重防伪', color: '#8E24AA', type: 'dualVerify' },
      { key: 'origin', icon: '🌱', name: '产地溯源', desc: '茶树与桂花产地信息', anchor: 'anchor-basic', color: '#2E8B57', type: 'detail' },
      { key: 'process', icon: '🫖', name: '工艺追踪', desc: '窨制工艺全流程', anchor: 'anchor-process', color: '#DAA520', type: 'detail' },
      { key: 'green', icon: '♻️', name: '绿色认证', desc: '生态种植与环保包装', anchor: 'anchor-green', color: '#52C41A', type: 'detail' },
      { key: 'report', icon: '📋', name: '检测报告', desc: '农残检测安全保障', anchor: 'anchor-process', color: '#1890FF', type: 'detail' },
      { key: 'treeAge', icon: '🌳', name: '百年茶树', desc: '古茶树的故事', anchor: 'anchor-treeAge', color: '#8B4513', type: 'detail' },
      { key: 'exportTrace', icon: '🌏', name: '出口合规溯源', desc: '海外经销商专用视图', color: '#1E3A8A', type: 'exportTrace' },
      { key: 'dealer', icon: '🏬', name: '经销商渠道', desc: '入库出库·渠道溯源', color: '#722ED1', type: 'dealer' },
      { key: 'experience', icon: '🎋', name: '线下体验', desc: '茶园参观·制茶·品鉴预约', color: '#2E8B57', type: 'experience' },
      { key: 'brand', icon: '🏯', name: '品牌故事', desc: '一茶一品的前世今生', color: '#B8860B', type: 'brand' }
    ],

    showScanGuide: false,
    scanGuideStep: 0,
    scanGuideSteps: [
      { step: 1, title: '点击扫码按钮', desc: '在首页找到扫码溯源按钮', icon: '📸' },
      { step: 2, title: '对准产品二维码', desc: '将二维码放入取景框内', icon: '📱' },
      { step: 3, title: '查看溯源信息', desc: '自动跳转到溯源详情页', icon: '✅' }
    ],

    brandVideo: {
      src: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=osmanthus%20tea%20brand%20video%20thumbnail%20cinematic%20golden%20flowers%20tea%20field&image_size=landscape_16_9',
      poster: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=osmanthus%20tea%20brand%20story%20video%20poster%20cinematic%20golden%20osmanthus%20flowers%20mountain%20tea&image_size=landscape_16_9',
      title: '一茶一品・桂花茶品牌宣传片',
      duration: '0:30',
      playing: false
    }
  },

  onLoad: function(options) {
    console.log('首页加载，参数：', options);

    this.refreshA11yData();
    this.refreshI18nTexts();

    setTimeout(() => {
      this.setData({ pageLoaded: true });
    }, 100);

    if (options.traceId) {
      this.queryTraceInfo(options.traceId);
      return;
    }

    if (options.scene) {
      const traceId = mockData.parseSceneParam(options.scene);
      if (traceId) {
        this.queryTraceInfo(traceId);
        return;
      }
    }

    this.loadScanHistory();
    this.checkFirstVisit();
    this.startAnnouncementRotation();
  },

  onShow: function() {
    this.setData({ inputTraceId: '', inputBatchNo: '' });
    this.refreshA11yData();
    this.refreshThemeData();
    this.refreshI18nTexts();
    this.loadScanHistory();
    this.checkClipboard();
  },

  // ===== i18n 与无障碍 =====

  /** 刷新当前 a11y 状态（语言/字号/色弱） */
  refreshA11yData: function() {
    const a11y = i18n.getA11yData();
    this.setData({
      currentLang: a11y.lang,
      currentFontSize: a11y.fontSize,
      currentColorWeak: a11y.colorWeak,
      a11yClasses: a11y.classes
    });
  },

  /** 刷新当前主题状态 */
  refreshThemeData: function() {
    var app = null;
    try {
      app = getApp();
    } catch (e) {
      // 测试环境可能没有 getApp
    }
    const themeClass = theme.getThemeClass();
    const pageClass = this.data.a11yClasses + ' ' + themeClass;
    this.setData({
      currentThemeMode: theme.getThemeMode(),
      themeClass: themeClass,
      pageClass: pageClass.trim()
    });
  },

  /** 主题变化回调 */
  onThemeChange: function(resolvedTheme, tokens, themeClass) {
    console.log('[Index] 主题变化:', resolvedTheme);
    this.refreshThemeData();
  },

  /** 刷新页面上所有 i18n 文本字段 */
  refreshI18nTexts: function() {
    const t = function(key) { return i18n.t(key); };

    var i18nCards = {};
    try {
      var cardKeys = Object.keys(this.data.featureCards || []);
      (this.data.featureCards || []).forEach(function(card) {
        if (card.key) {
          var i18nCard = t('home.featureCards.' + card.key);
          if (i18nCard && typeof i18nCard === 'object') {
            i18nCards[card.key] = {
              name: i18nCard.name || card.name,
              desc: i18nCard.desc || card.desc
            };
          }
        }
      });
    } catch (e) {
      i18nCards = {};
    }

    var localizedCards = (this.data.featureCards || []).map(function(card) {
      if (card.key && i18nCards[card.key]) {
        return Object.assign({}, card, {
          name: i18nCards[card.key].name,
          desc: i18nCards[card.key].desc
        });
      }
      return card;
    });

    this.setData({
      'i18n.scanBtn': t('home.scanBtn'),
      'i18n.inputPlaceholder': t('home.inputPlaceholder'),
      'i18n.searchBtn': t('home.searchBtn'),
      'i18n.historyTitle': t('home.historyTitle'),
      'i18n.clipboardTitle': t('home.clipboardTitle'),
      'i18n.clipboardDesc': t('home.clipboardDesc'),
      'i18n.clipboardGoto': t('home.clipboardGoto'),
      'i18n.clipboardClose': t('common.cancel'),
      'i18n.a11ySettings': t('settings.title'),
      'i18n.a11yTitle': t('settings.title'),
      'i18n.languageLabel': t('settings.language'),
      'i18n.fontLabel': t('settings.fontSize'),
      'i18n.colorWeakLabel': t('settings.colorWeak'),
      'i18n.colorWeakDesc': t('settings.colorWeakDesc'),
      'i18n.closeBtn': t('common.close'),
      'i18n.quickInputTitle': t('home.quickInputTitle'),
      'i18n.quickInputBatchTitle': t('home.quickInputBatchTitle'),
      'i18n.batchSearchBtn': t('home.batchSearchBtn'),
      'i18n.batchPlaceholder': t('home.batchPlaceholder'),
      'i18n.bannerTag': t('home.bannerTag'),
      'i18n.announcementTag': t('home.announcementTag'),
      'i18n.featureHint': t('home.featureHint'),
      'i18n.scanGuideTitle': t('home.scanGuideTitle'),
      'i18n.brandStoryTitle': t('nav.brandStory'),
      featureCards: localizedCards
    });
  },

  /** 打开无障碍设置面板 */
  openA11yPanel: function() {
    this.setData({ showA11yPanel: true });
  },

  /** 关闭无障碍设置面板 */
  closeA11yPanel: function() {
    this.setData({ showA11yPanel: false });
  },

  /** 切换语言 */
  handleSelectLanguage: function(e) {
    const lang = e.currentTarget.dataset.lang;
    if (lang === this.data.currentLang) return;
    i18n.setLanguage(lang);
    this.refreshA11yData();
    this.refreshI18nTexts();
    const app = getApp();
    if (app) {
      i18n.applySettingsToApp(app);
    }
  },

  /** 切换字号 */
  handleSelectFontSize: function(e) {
    const size = e.currentTarget.dataset.size;
    if (size === this.data.currentFontSize) return;
    i18n.setFontSize(size);
    this.refreshA11yData();
    this.refreshI18nTexts();
    const app = getApp();
    if (app) {
      i18n.applySettingsToApp(app);
    }
  },

  /** 切换色弱模式 */
  handleToggleColorWeak: function() {
    const next = !this.data.currentColorWeak;
    i18n.setColorWeak(next);
    this.refreshA11yData();
    this.refreshI18nTexts();
    const app = getApp();
    if (app) {
      i18n.applySettingsToApp(app);
    }
  },

  loadScanHistory: function() {
    const history = storage.getScanHistory();
    const formattedHistory = history.map(item => ({
      ...item,
      formatTime: storage.formatTime(item.timestamp)
    }));
    this.setData({
      scanHistory: formattedHistory,
      showHistory: formattedHistory.length > 0
    });
  },

  checkClipboard: function() {
    const that = this;

    wx.getClipboardData({
      success: function(res) {
        const clipboardContent = res.data && res.data.trim();
        console.log('剪贴板内容:', clipboardContent);

        if (!clipboardContent) return;

        const traceId = that.parseTraceId(clipboardContent);
        if (traceId && mockData.validateTraceId(traceId)) {
          const traceData = mockData.getTraceData(traceId);
          if (traceData) {
            that.setData({
              showClipboardModal: true,
              clipboardTraceId: traceId
            });
          }
        }
      },
      fail: function(err) {
        console.log('获取剪贴板失败:', err);
      }
    });
  },

  handleClipboardConfirm: function() {
    const traceId = this.data.clipboardTraceId;
    this.setData({ showClipboardModal: false });
    this.queryTraceInfo(traceId);
  },

  handleClipboardCancel: function() {
    this.setData({ showClipboardModal: false });
  },

  preventBubble: function() {
  },

  handleScanCode: function() {
    const that = this;

    wx.showLoading({
      title: '正在启动扫码...',
      mask: true
    });

    wx.scanCode({
      scanType: ['qrCode', 'barCode'],
      success: function(res) {
        console.log('扫码成功，结果：', res);
        wx.hideLoading();

        const scanResult = res.result;
        const scanType = res.scanType;

        const dualCode = mockData.parseDualCodeFromScanResult(scanResult);
        if (dualCode) {
          that.navigateToDualVerify(dualCode);
          return;
        }

        let traceId = null;

        if (scanType === 'barCode') {
          traceId = mockData.getTraceIdFromBarcode(scanResult);
        } else {
          traceId = that.parseTraceId(scanResult);
        }

        if (traceId) {
          that.navigateToScanResult(traceId, scanType);
        } else {
          wx.showToast({
            title: '未识别到有效溯源码',
            icon: 'none',
            duration: 2000
          });
        }
      },
      fail: function(err) {
        wx.hideLoading();
        console.error('扫码失败：', err);

        if (err.errMsg.indexOf('cancel') === -1) {
          wx.showToast({
            title: '扫码失败，请重试',
            icon: 'none',
            duration: 2000
          });
        }
      }
    });
  },

  navigateToDualVerify: function(dualCode) {
    const that = this;
    console.log('[首页] 检测到双码，跳转到双码验真页:', dualCode);

    wx.showModal({
      title: '🔐 检测到双码产品',
      content: '该产品支持"外盒码+内袋码"双重防伪验真。是否使用双码验真功能进行更严格的防伪验证？',
      confirmText: '使用双码验真',
      cancelText: '普通验真',
      confirmColor: '#8E24AA',
      success: function(modalRes) {
        if (modalRes.confirm) {
          let url = '/pages/dualVerify/dualVerify';
          if (dualCode.codeType === 'outer') {
            url += '?outerCode=' + dualCode.code;
          }
          wx.navigateTo({
            url: url,
            success: function() {
              console.log('[首页] 跳转双码验真页成功');
            },
            fail: function(err) {
              console.error('[首页] 跳转双码验真页失败:', err);
              wx.showToast({ title: '跳转失败', icon: 'none' });
            }
          });
        } else {
          const info = mockData.getDualCodeInfo(dualCode.code);
          if (info && info.traceId) {
            that.navigateToScanResult(info.traceId, 'qrCode');
          } else {
            wx.showToast({
              title: '未找到产品信息',
              icon: 'none'
            });
          }
        }
      }
    });
  },

  navigateToScanResult: function(traceId, scanType) {
    const that = this;

    const traceData = mockData.getTraceData(traceId);
    if (traceData) {
      storage.addScanRecord({
        traceId: traceId,
        productName: traceData.basicInfo.productName
      });
    }

    wx.navigateTo({
      url: `/pages/scanResult/scanResult?traceId=${traceId}&scanType=${scanType}`,
      success: function() {
        console.log('跳转扫码结果页成功');
        that.loadScanHistory();
      },
      fail: function(err) {
        console.error('跳转失败：', err);
        wx.showToast({
          title: '页面跳转失败',
          icon: 'none'
        });
      }
    });
  },

  parseTraceId: function(scanResult) {
    if (!scanResult) return null;

    let traceId = null;

    if (scanResult.includes('?')) {
      const urlParams = new URLSearchParams(scanResult.split('?')[1]);
      traceId = urlParams.get('id') || urlParams.get('traceId');
    }

    if (!traceId && scanResult.startsWith('{')) {
      try {
        const jsonData = JSON.parse(scanResult);
        traceId = jsonData.traceId || jsonData.id;
      } catch (e) {
        console.log('JSON解析失败');
      }
    }

    if (!traceId) {
      if (mockData.validateTraceId(scanResult)) {
        traceId = scanResult;
      }
    }

    return traceId;
  },

  toggleInputArea: function() {
    this.setData({
      showInputArea: !this.data.showInputArea,
      showBatchArea: false
    });
  },

  toggleBatchArea: function() {
    this.setData({
      showBatchArea: !this.data.showBatchArea,
      showInputArea: false
    });
  },

  onInputChange: function(e) {
    this.setData({
      inputTraceId: e.detail.value
    });
  },

  onBatchInputChange: function(e) {
    this.setData({
      inputBatchNo: e.detail.value
    });
  },

  handleManualQuery: function() {
    const traceId = this.data.inputTraceId.trim();

    if (!traceId) {
      wx.showToast({
        title: '请输入溯源ID',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    if (!mockData.validateTraceId(traceId)) {
      wx.showToast({
        title: 'ID格式不正确，请检查',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    this.queryTraceInfo(traceId);
  },

  handleBatchQuery: function() {
    const batchNo = this.data.inputBatchNo.trim().toUpperCase();

    if (!batchNo) {
      wx.showToast({
        title: '请输入批次号',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    if (!mockData.validateBatchNo(batchNo)) {
      wx.showToast({
        title: '批次号格式不正确',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    wx.navigateTo({
      url: `/pages/batchList/batchList?batchNo=${batchNo}`,
      success: function() {
        console.log('跳转批次查询页成功');
      },
      fail: function(err) {
        console.error('跳转失败：', err);
        wx.showToast({
          title: '页面跳转失败',
          icon: 'none'
        });
      }
    });
  },

  fillTestId: function(e) {
    const testId = e.currentTarget.dataset.id;
    this.setData({
      inputTraceId: testId,
      showInputArea: true,
      showBatchArea: false
    });
  },

  fillTestBatchNo: function(e) {
    const batchNo = e.currentTarget.dataset.batch;
    this.setData({
      inputBatchNo: batchNo,
      showBatchArea: true,
      showInputArea: false
    });
  },

  viewHistoryItem: function(e) {
    const traceId = e.currentTarget.dataset.traceid;
    this.queryTraceInfo(traceId);
  },

  deleteHistoryItem: function(e) {
    const that = this;
    const id = e.currentTarget.dataset.id;

    wx.showModal({
      title: '删除记录',
      content: '确定删除该条扫码记录吗？',
      success: function(res) {
        if (res.confirm) {
          storage.removeScanRecord(id);
          that.loadScanHistory();
          wx.showToast({
            title: '已删除',
            icon: 'success',
            duration: 1500
          });
        }
      }
    });
  },

  clearAllHistory: function() {
    const that = this;

    wx.showModal({
      title: '清空历史',
      content: '确定清空所有扫码历史吗？此操作不可恢复。',
      confirmColor: '#ff4d4f',
      success: function(res) {
        if (res.confirm) {
          storage.clearScanHistory();
          that.loadScanHistory();
          wx.showToast({
            title: '已清空',
            icon: 'success',
            duration: 1500
          });
        }
      }
    });
  },

  queryTraceInfo: function(traceId) {
    const that = this;

    wx.showLoading({
      title: '正在查询...',
      mask: true
    });

    setTimeout(() => {
      wx.hideLoading();

      const traceData = mockData.getTraceData(traceId);

      if (traceData) {
        storage.addScanRecord({
          traceId: traceId,
          productName: traceData.basicInfo.productName
        });
        that.loadScanHistory();

        wx.navigateTo({
          url: `/pages/detail/detail?traceId=${traceId}`,
          success: function() {
            console.log('跳转详情页成功');
          },
          fail: function(err) {
            console.error('跳转失败：', err);
            wx.showToast({
              title: '页面跳转失败',
              icon: 'none'
            });
          }
        });
      } else {
        wx.showToast({
          title: '未找到该溯源信息',
          icon: 'none',
          duration: 2500
        });
      }
    }, 800);
  },

  onShareAppMessage: function() {
    return {
      title: '一茶一品・桂花茶溯源',
      path: '/pages/index/index',
      imageUrl: ''
    };
  },

  onBannerChange: function(e) {
    this.setData({ currentBanner: e.detail.current });
  },

  onBannerTap: function(e) {
    const index = e.currentTarget.dataset.index;
    const banner = this.data.bannerList[index];
    if (!banner) return;

    if (banner.traceId) {
      this.queryTraceInfo(banner.traceId);
    } else if (banner.type === 'certAward') {
      wx.navigateTo({
        url: '/pages/greenTrace/greenTrace?traceId=G001&productName=' + encodeURIComponent('金桂花茶')
      });
    } else if (banner.type === 'pickSeason') {
      wx.navigateTo({
        url: '/pages/brandStory/brandStory'
      });
    }
  },

  onAnnouncementTap: function(e) {
    const announcement = this.data.announcementList[this.data.currentAnnouncement];
    if (!announcement) return;

    if (announcement.type === 'recall' && announcement.batchNo) {
      wx.navigateTo({
        url: '/pages/batchList/batchList?batchNo=' + announcement.batchNo
      });
    } else if (announcement.type === 'promo') {
      wx.navigateTo({
        url: '/pages/brandStory/brandStory'
      });
    }
  },

  startAnnouncementRotation: function() {
    if (this.data.announcementList.length <= 1) return;

    this._announcementTimer = setInterval(() => {
      const next = (this.data.currentAnnouncement + 1) % this.data.announcementList.length;
      this.setData({ announcementAnimation: true });
      setTimeout(() => {
        this.setData({
          currentAnnouncement: next,
          announcementAnimation: false
        });
      }, 300);
    }, 4000);
  },

  stopAnnouncementRotation: function() {
    if (this._announcementTimer) {
      clearInterval(this._announcementTimer);
      this._announcementTimer = null;
    }
  },

  onFeatureCardTap: function(e) {
    const card = e.currentTarget.dataset.card;
    if (!card) return;

    if (card.type === 'brand') {
      wx.navigateTo({
        url: '/pages/brandStory/brandStory'
      });
    } else if (card.type === 'detail') {
      const defaultTraceId = 'G001';
      wx.navigateTo({
        url: '/pages/detail/detail?traceId=' + defaultTraceId + '&anchor=' + card.anchor
      });
    } else if (card.type === 'exportTrace') {
      const defaultTraceId = 'G001';
      wx.navigateTo({
        url: '/pages/exportTrace/exportTrace?traceId=' + defaultTraceId
      });
    } else if (card.type === 'dealer') {
      wx.navigateTo({
        url: '/pages/dealer/index'
      });
    } else if (card.type === 'dualVerify') {
      wx.navigateTo({
        url: '/pages/dualVerify/dualVerify'
      });
    } else if (card.type === 'experience') {
      wx.navigateTo({
        url: '/pages/experience/list'
      });
    }
  },

  checkFirstVisit: function() {
    try {
      const visited = wx.getStorageSync('has_visited_scan_guide');
      if (!visited) {
        setTimeout(() => {
          this.setData({ showScanGuide: true });
        }, 800);
      }
    } catch (e) {
      console.log('检查首次访问失败:', e);
    }
  },

  nextScanGuideStep: function() {
    const next = this.data.scanGuideStep + 1;
    if (next >= this.data.scanGuideSteps.length) {
      this.closeScanGuide();
    } else {
      this.setData({ scanGuideStep: next });
    }
  },

  closeScanGuide: function() {
    this.setData({ showScanGuide: false, scanGuideStep: 0 });
    try {
      wx.setStorageSync('has_visited_scan_guide', true);
    } catch (e) {
      console.log('保存访问记录失败:', e);
    }
  },

  onVideoPlay: function() {
    this.setData({ 'brandVideo.playing': true });
  },

  onVideoPause: function() {
    this.setData({ 'brandVideo.playing': false });
  },

  onVideoEnded: function() {
    this.setData({ 'brandVideo.playing': false });
  },

  onVideoTap: function() {
    const videoContext = wx.createVideoContext('brandVideo', this);
    if (this.data.brandVideo.playing) {
      videoContext.pause();
    } else {
      videoContext.play();
    }
  },

  onHide: function() {
    this.stopAnnouncementRotation();
  },

  onUnload: function() {
    this.stopAnnouncementRotation();
  }
});
