const mockData = require('../../utils/mockData.js');
const i18n = require('../../utils/i18n/index.js');
const { t, setLanguage, getLanguage, getAvailableLanguages, LANG_ZH, LANG_EN, LANG_JA } = i18n;

Page({
  data: {
    traceId: '',
    viewMode: 'export',
    loading: true,
    error: '',
    exportInfo: null,
    basicInfo: null,
    currentLabelLang: 'zh-CN',
    availableLabelLanguages: [],
    currentLabelData: null,
    blockchainVerifying: false,
    blockchainVerified: false,
    customsStatus: null,
    shippingInfo: null,
    a11yClasses: '',
    fontMultiplier: 1.0,
    currentLang: 'zh-CN',
    availableLanguages: []
  },

  onLoad(options) {
    const traceId = options.traceId || options.id || 'G001';
    const viewMode = options.viewMode || 'export';
    const labelLang = options.labelLang || 'zh-CN';

    this.setData({
      traceId: traceId,
      viewMode: viewMode,
      currentLabelLang: labelLang,
      currentLang: getLanguage(),
      availableLanguages: getAvailableLanguages(),
      a11yClasses: i18n.getAccessibilityClasses(),
      fontMultiplier: i18n.getFontMultiplier()
    });

    wx.setNavigationBarTitle({
      title: t('exportTrace.pageTitle')
    });

    this.loadExportData(traceId);
  },

  onPullDownRefresh() {
    this.loadExportData(this.data.traceId, true);
  },

  loadExportData(traceId, isRefresh) {
    if (!isRefresh) {
      this.setData({ loading: true, error: '' });
    }

    try {
      const exportInfo = mockData.getExportInfo(traceId);
      const traceData = mockData.getTraceData(traceId);

      if (!exportInfo) {
        this.setData({
          loading: false,
          error: t('exportTrace.noExportInfo') || '该产品暂无出口信息'
        });
        if (isRefresh) {
          wx.stopPullDownRefresh();
        }
        return;
      }

      const basicInfo = traceData ? traceData.basicInfo : null;
      const availableLabelLanguages = exportInfo.multilingualLabels
        ? exportInfo.multilingualLabels.availableLanguages
        : [];

      const currentLabelData = this.getLabelData(exportInfo, this.data.currentLabelLang);
      const customsStatus = mockData.getCustomsClearanceStatus(traceId);
      const shippingInfo = mockData.getShippingTracking(traceId);

      this.setData({
        exportInfo: exportInfo,
        basicInfo: basicInfo,
        availableLabelLanguages: availableLabelLanguages,
        currentLabelData: currentLabelData,
        customsStatus: customsStatus ? customsStatus.data : null,
        shippingInfo: shippingInfo ? shippingInfo.data : null,
        loading: false,
        error: ''
      });

      if (isRefresh) {
        wx.stopPullDownRefresh();
        wx.showToast({
          title: '刷新成功',
          icon: 'success',
          duration: 1500
        });
      }
    } catch (e) {
      console.error('loadExportData error:', e);
      this.setData({
        loading: false,
        error: '加载失败，请稍后重试'
      });
      if (isRefresh) {
        wx.stopPullDownRefresh();
      }
    }
  },

  getLabelData(exportInfo, lang) {
    if (!exportInfo || !exportInfo.multilingualLabels) return null;
    const labels = exportInfo.multilingualLabels.labels;
    if (labels[lang]) {
      return { lang: lang, data: labels[lang] };
    }
    if (labels['en-US']) {
      return { lang: 'en-US', data: labels['en-US'] };
    }
    if (labels['zh-CN']) {
      return { lang: 'zh-CN', data: labels['zh-CN'] };
    }
    return null;
  },

  switchLabelLang(e) {
    const lang = e.currentTarget.dataset.lang;
    const labelData = this.getLabelData(this.data.exportInfo, lang);
    this.setData({
      currentLabelLang: lang,
      currentLabelData: labelData
    });
  },

  switchLanguage(e) {
    const lang = e.currentTarget.dataset.lang;
    if (setLanguage(lang)) {
      this.setData({
        currentLang: lang,
        a11yClasses: i18n.getAccessibilityClasses(),
        fontMultiplier: i18n.getFontMultiplier()
      });
      wx.setNavigationBarTitle({
        title: t('exportTrace.pageTitle')
      });
      this.loadExportData(this.data.traceId);
    }
  },

  verifyBlockchain() {
    this.setData({ blockchainVerifying: true });
    setTimeout(() => {
      this.setData({
        blockchainVerifying: false,
        blockchainVerified: true
      });
      wx.showToast({
        title: t('exportTrace.blockchain.verified'),
        icon: 'success',
        duration: 2000
      });
    }, 1500);
  },

  copyHash() {
    const exportInfo = this.data.exportInfo;
    if (exportInfo && exportInfo.exportBlockchain && exportInfo.exportBlockchain.txHash) {
      wx.setClipboardData({
        data: exportInfo.exportBlockchain.txHash,
        success: () => {
          wx.showToast({
            title: t('common.copied'),
            icon: 'success',
            duration: 1500
          });
        }
      });
    }
  },

  copyValue(e) {
    const value = e.currentTarget.dataset.value;
    const label = e.currentTarget.dataset.label || '';
    if (value) {
      wx.setClipboardData({
        data: value,
        success: () => {
          wx.showToast({
            title: label + ' ' + t('common.copied'),
            icon: 'success',
            duration: 1500
          });
        }
      });
    }
  },

  openUrl(e) {
    const url = e.currentTarget.dataset.url;
    if (url) {
      wx.setClipboardData({
        data: url,
        success: () => {
          wx.showToast({
            title: '链接已复制',
            icon: 'success',
            duration: 2000
          });
        }
      });
    }
  },

  refreshCustoms() {
    wx.showLoading({ title: '刷新中...' });
    setTimeout(() => {
      const customsStatus = mockData.getCustomsClearanceStatus(this.data.traceId);
      this.setData({
        customsStatus: customsStatus ? customsStatus.data : null
      });
      wx.hideLoading();
      wx.showToast({
        title: '状态已更新',
        icon: 'success',
        duration: 1500
      });
    }, 800);
  },

  switchToDomestic() {
    const traceId = this.data.traceId;
    wx.redirectTo({
      url: '/pages/detail/detail?traceId=' + traceId + '&viewMode=domestic',
      fail: () => {
        wx.navigateTo({
          url: '/pages/detail/detail?traceId=' + traceId
        });
      }
    });
  },

  goBack() {
    const pages = getCurrentPages();
    if (pages.length > 1) {
      wx.navigateBack();
    } else {
      wx.switchTab({
        url: '/pages/index/index'
      });
    }
  },

  onShareAppMessage() {
    return {
      title: t('exportTrace.pageTitle') + ' - ' + this.data.traceId,
      path: '/pages/exportTrace/exportTrace?traceId=' + this.data.traceId
    };
  }
});
