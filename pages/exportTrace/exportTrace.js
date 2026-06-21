const mockData = require('../../utils/mockData.js');
const i18n = require('../../utils/i18n/index.js');
const { t, setLanguage, getLanguage, getAvailableLanguages } = i18n;

function buildI18nTexts() {
  return {
    pageTitle: t('exportTrace.pageTitle'),
    subtitle: t('exportTrace.subtitle'),
    badgeExport: t('exportTrace.badge'),
    loadingText: t('common.loading'),
    loadFailed: t('common.loadFailed'),
    retry: t('common.retry'),
    noExportInfo: t('exportTrace.noExportInfo'),
    refreshSuccess: t('exportTrace.refreshSuccess'),
    urlCopied: t('exportTrace.urlCopied'),
    refreshCustomsLoading: t('exportTrace.refreshCustomsLoading'),
    customsStatusUpdated: t('exportTrace.customsStatusUpdated'),
    traceIdLabel: t('exportTrace.traceIdLabel'),

    header: {
      viewModeLabel: t('exportTrace.viewMode'),
      viewModeDomestic: t('exportTrace.viewModeDomestic'),
      viewModeExport: t('exportTrace.viewModeExport'),
      interfaceLangLabel: t('settings.language')
    },

    basicInfo: {
      title: t('exportTrace.basicInfo.title'),
      exportBatchNo: t('exportTrace.basicInfo.exportBatchNo'),
      hsCode: t('exportTrace.basicInfo.hsCode'),
      hsCodeDesc: t('exportTrace.basicInfo.hsCodeDesc'),
      countryOfOrigin: t('exportTrace.basicInfo.countryOfOrigin'),
      originRegion: t('exportTrace.basicInfo.originRegion'),
      targetMarkets: t('exportTrace.basicInfo.targetMarkets'),
      productName: t('exportTrace.basicInfo.productName')
    },

    certificateOfOrigin: {
      title: t('exportTrace.certificateOfOrigin.title'),
      badge: t('exportTrace.certificateOfOrigin.badge'),
      certNo: t('exportTrace.certificateOfOrigin.certNo'),
      certType: t('exportTrace.certificateOfOrigin.certType'),
      issuingAuthority: t('exportTrace.certificateOfOrigin.issuingAuthority'),
      issueDate: t('exportTrace.certificateOfOrigin.issueDate'),
      validUntil: t('exportTrace.certificateOfOrigin.validUntil'),
      status: t('exportTrace.certificateOfOrigin.status'),
      statusValid: t('exportTrace.certificateOfOrigin.statusValid'),
      statusInvalid: t('exportTrace.certificateOfOrigin.statusInvalid'),
      verifyButton: t('exportTrace.certificateOfOrigin.verifyButton')
    },

    inspectionQuarantine: {
      title: t('exportTrace.inspectionQuarantine.title'),
      badge: t('exportTrace.inspectionQuarantine.badge'),
      certNo: t('exportTrace.inspectionQuarantine.certNo'),
      issuingAuthority: t('exportTrace.inspectionQuarantine.issuingAuthority'),
      issueDate: t('exportTrace.inspectionQuarantine.issueDate'),
      validUntil: t('exportTrace.inspectionQuarantine.validUntil'),
      inspectionDate: t('exportTrace.inspectionQuarantine.inspectionDate'),
      result: t('exportTrace.inspectionQuarantine.result'),
      resultPass: t('exportTrace.inspectionQuarantine.resultPass'),
      resultFail: t('exportTrace.inspectionQuarantine.resultFail'),
      quarantineResult: t('exportTrace.inspectionQuarantine.quarantineResult'),
      standard: t('exportTrace.inspectionQuarantine.standard'),
      items: t('exportTrace.inspectionQuarantine.items'),
      verifyButton: t('exportTrace.inspectionQuarantine.verifyButton'),
      tableItem: t('exportTrace.inspectionQuarantine.tableItem'),
      tableResult: t('exportTrace.inspectionQuarantine.tableResult'),
      tableStandard: t('exportTrace.inspectionQuarantine.tableStandard')
    },

    multilingualLabel: {
      title: t('exportTrace.multilingualLabel.title'),
      subtitle: t('exportTrace.multilingualLabel.subtitle'),
      preview: t('exportTrace.multilingualLabel.preview'),
      switchLanguage: t('exportTrace.multilingualLabel.switchLanguage'),
      productName: t('exportTrace.multilingualLabel.productName'),
      ingredients: t('exportTrace.multilingualLabel.ingredients'),
      netContent: t('exportTrace.multilingualLabel.netContent'),
      shelfLife: t('exportTrace.multilingualLabel.shelfLife'),
      storageMethod: t('exportTrace.multilingualLabel.storageMethod'),
      origin: t('exportTrace.multilingualLabel.origin'),
      manufacturer: t('exportTrace.multilingualLabel.manufacturer'),
      address: t('exportTrace.multilingualLabel.address'),
      availableLanguages: t('exportTrace.multilingualLabel.availableLanguages')
    },

    shipping: {
      title: t('exportTrace.shipping.title'),
      badge: t('exportTrace.shipping.badge'),
      method: t('exportTrace.shipping.method'),
      methodOcean: t('exportTrace.shipping.methodOcean'),
      methodAir: t('exportTrace.shipping.methodAir'),
      methodLand: t('exportTrace.shipping.methodLand'),
      containerNo: t('exportTrace.shipping.containerNo'),
      containerType: t('exportTrace.shipping.containerType'),
      vesselName: t('exportTrace.shipping.vesselName'),
      voyageNo: t('exportTrace.shipping.voyageNo'),
      billOfLading: t('exportTrace.shipping.billOfLading'),
      portOfLoading: t('exportTrace.shipping.portOfLoading'),
      portOfDischarge: t('exportTrace.shipping.portOfDischarge'),
      etd: t('exportTrace.shipping.etd'),
      eta: t('exportTrace.shipping.eta'),
      trackingButton: t('exportTrace.shipping.trackingButton'),
      inTransit: t('exportTrace.shipping.inTransit'),
      delivered: t('exportTrace.shipping.delivered'),
      pending: t('exportTrace.shipping.pending')
    },

    customsClearance: {
      title: t('exportTrace.customsClearance.title'),
      badge: t('exportTrace.customsClearance.badge'),
      status: t('exportTrace.customsClearance.status'),
      statusPending: t('exportTrace.customsClearance.statusPending'),
      statusDeclared: t('exportTrace.customsClearance.statusDeclared'),
      statusInTransit: t('exportTrace.customsClearance.statusInTransit'),
      statusCleared: t('exportTrace.customsClearance.statusCleared'),
      statusRejected: t('exportTrace.customsClearance.statusRejected'),
      declarationNo: t('exportTrace.customsClearance.declarationNo'),
      declareDate: t('exportTrace.customsClearance.declareDate'),
      customsOffice: t('exportTrace.customsClearance.customsOffice'),
      importCountry: t('exportTrace.customsClearance.importCountry'),
      importCustoms: t('exportTrace.customsClearance.importCustoms'),
      tariffCode: t('exportTrace.customsClearance.tariffCode'),
      dutyRate: t('exportTrace.customsClearance.dutyRate'),
      importValue: t('exportTrace.customsClearance.importValue'),
      taxPaid: t('exportTrace.customsClearance.taxPaid'),
      clearanceDate: t('exportTrace.customsClearance.clearanceDate'),
      inspectionRequired: t('exportTrace.customsClearance.inspectionRequired'),
      inspectionStatus: t('exportTrace.customsClearance.inspectionStatus'),
      inspectionPending: t('exportTrace.customsClearance.inspectionPending'),
      inspectionPassed: t('exportTrace.customsClearance.inspectionPassed'),
      inspectionFailed: t('exportTrace.customsClearance.inspectionFailed'),
      remarks: t('exportTrace.customsClearance.remarks'),
      refreshButton: t('exportTrace.customsClearance.refreshButton'),
      yes: t('common.yes'),
      no: t('common.no')
    },

    overseasDistributor: {
      title: t('exportTrace.overseasDistributor.title'),
      badge: t('exportTrace.overseasDistributor.badge'),
      name: t('exportTrace.overseasDistributor.name'),
      country: t('exportTrace.overseasDistributor.country'),
      region: t('exportTrace.overseasDistributor.region'),
      address: t('exportTrace.overseasDistributor.address'),
      contactPerson: t('exportTrace.overseasDistributor.contactPerson'),
      contactEmail: t('exportTrace.overseasDistributor.contactEmail'),
      contactPhone: t('exportTrace.overseasDistributor.contactPhone'),
      licenseNo: t('exportTrace.overseasDistributor.licenseNo'),
      authorizedDate: t('exportTrace.overseasDistributor.authorizedDate'),
      authorizedProducts: t('exportTrace.overseasDistributor.authorizedProducts'),
      level: t('exportTrace.overseasDistributor.level'),
      verifyButton: t('exportTrace.overseasDistributor.verifyButton')
    },

    blockchain: {
      title: t('exportTrace.blockchain.title'),
      badge: t('exportTrace.blockchain.badge'),
      chainName: t('exportTrace.blockchain.chainName'),
      txHash: t('exportTrace.blockchain.txHash'),
      timestamp: t('exportTrace.blockchain.timestamp'),
      verifyStatus: t('exportTrace.blockchain.verifyStatus'),
      verified: t('exportTrace.blockchain.verified'),
      onChainFields: t('exportTrace.blockchain.onChainFields'),
      onChain: t('exportTrace.blockchain.onChain'),
      verifyButton: t('exportTrace.blockchain.verifyButton'),
      verifying: t('exportTrace.blockchain.verifying'),
      copyHash: t('exportTrace.blockchain.copyHash'),
      hashCopied: t('exportTrace.blockchain.hashCopied'),
      pendingVerify: t('exportTrace.blockchain.pendingVerify')
    },

    viewToggle: {
      switchToDomestic: t('exportTrace.viewToggle.switchToDomestic'),
      sameTraceId: t('exportTrace.viewToggle.sameTraceId'),
      differentView: t('exportTrace.viewToggle.differentView'),
      footerTraceId: t('exportTrace.viewToggle.footerTraceId')
    }
  };
}

function getLangLabel(code) {
  const labels = {};
  labels[i18n.LANG_ZH] = t('settings.languageZh');
  labels[i18n.LANG_EN] = t('settings.languageEn');
  labels[i18n.LANG_JA] = t('settings.languageJa');
  return labels[code] || code;
}

function getLabelLangLabel(code) {
  const map = {
    'zh-CN': t('settings.languageZh'),
    'en-US': t('settings.languageEn'),
    'ja-JP': t('settings.languageJa')
  };
  return map[code] || code;
}

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
    availableLabelLanguagesWithLabel: [],
    currentLabelData: null,
    blockchainVerifying: false,
    blockchainVerified: false,
    customsStatus: null,
    shippingInfo: null,
    a11yClasses: '',
    fontMultiplier: 1.0,
    currentLang: 'zh-CN',
    availableLanguages: [],
    availableLanguagesWithLabel: [],
    i18n: buildI18nTexts()
  },

  onLoad(options) {
    const traceId = options.traceId || options.id || 'G001';
    const viewMode = options.viewMode || 'export';
    const labelLang = options.labelLang || 'zh-CN';

    this.refreshI18nData();

    this.setData({
      traceId: traceId,
      viewMode: viewMode,
      currentLabelLang: labelLang
    });

    wx.setNavigationBarTitle({
      title: this.data.i18n.pageTitle
    });

    this.loadExportData(traceId);
  },

  onShow() {
    this.refreshI18nData();
  },

  onPullDownRefresh() {
    this.loadExportData(this.data.traceId, true);
  },

  refreshI18nData() {
    const currentLang = getLanguage();
    const i18nTexts = buildI18nTexts();

    const availableLanguages = getAvailableLanguages();
    const availableLanguagesWithLabel = availableLanguages.map(l => ({
      code: l.code,
      label: getLangLabel(l.code)
    }));

    this.setData({
      currentLang: currentLang,
      a11yClasses: i18n.getAccessibilityClasses(),
      fontMultiplier: i18n.getFontMultiplier(),
      availableLanguages: availableLanguages,
      availableLanguagesWithLabel: availableLanguagesWithLabel,
      i18n: i18nTexts
    });

    if (this.data.exportInfo) {
      this.updateLabelLanguages();
    }
  },

  updateLabelLanguages() {
    const availableLabelLanguages = this.data.availableLabelLanguages || [];
    const availableLabelLanguagesWithLabel = availableLabelLanguages.map(code => ({
      code: code,
      label: getLabelLangLabel(code)
    }));
    this.setData({
      availableLabelLanguagesWithLabel: availableLabelLanguagesWithLabel
    });
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
          error: this.data.i18n.noExportInfo
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
      const availableLabelLanguagesWithLabel = availableLabelLanguages.map(code => ({
        code: code,
        label: getLabelLangLabel(code)
      }));

      this.setData({
        exportInfo: exportInfo,
        basicInfo: basicInfo,
        availableLabelLanguages: availableLabelLanguages,
        availableLabelLanguagesWithLabel: availableLabelLanguagesWithLabel,
        currentLabelData: currentLabelData,
        customsStatus: customsStatus ? customsStatus.data : null,
        shippingInfo: shippingInfo ? shippingInfo.data : null,
        loading: false,
        error: ''
      });

      if (isRefresh) {
        wx.stopPullDownRefresh();
        wx.showToast({
          title: this.data.i18n.refreshSuccess,
          icon: 'success',
          duration: 1500
        });
      }
    } catch (e) {
      console.error('loadExportData error:', e);
      this.setData({
        loading: false,
        error: this.data.i18n.loadFailed
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
      this.refreshI18nData();
      wx.setNavigationBarTitle({
        title: this.data.i18n.pageTitle
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
        title: this.data.i18n.blockchain.verified,
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
    if (value) {
      wx.setClipboardData({
        data: value,
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

  openUrl(e) {
    const url = e.currentTarget.dataset.url;
    if (url) {
      wx.setClipboardData({
        data: url,
        success: () => {
          wx.showToast({
            title: this.data.i18n.urlCopied,
            icon: 'success',
            duration: 2000
          });
        }
      });
    }
  },

  refreshCustoms() {
    wx.showLoading({ title: this.data.i18n.refreshCustomsLoading });
    setTimeout(() => {
      const customsStatus = mockData.getCustomsClearanceStatus(this.data.traceId);
      this.setData({
        customsStatus: customsStatus ? customsStatus.data : null
      });
      wx.hideLoading();
      wx.showToast({
        title: this.data.i18n.customsStatusUpdated,
        icon: 'success',
        duration: 1500
      });
    }, 800);
  },

  getShippingMethodLabel() {
    const shippingInfo = this.data.shippingInfo;
    if (!shippingInfo) return '';
    const i18n = this.data.i18n.shipping;
    switch (shippingInfo.method) {
      case 'ocean': return i18n.methodOcean;
      case 'air': return i18n.methodAir;
      case 'land': return i18n.methodLand;
      default: return shippingInfo.methodLabel || i18n.methodOcean;
    }
  },

  getShippingStatusLabel() {
    const shippingInfo = this.data.shippingInfo;
    if (!shippingInfo) return '';
    const i18n = this.data.i18n.shipping;
    if (shippingInfo.actualArrival) return i18n.delivered;
    if (shippingInfo.actualDeparture) return i18n.inTransit;
    return i18n.pending;
  },

  getCustomsStatusLabel() {
    const customsStatus = this.data.customsStatus;
    if (!customsStatus) return '';
    const i18n = this.data.i18n.customsClearance;
    switch (customsStatus.status) {
      case 'cleared': return i18n.statusCleared;
      case 'in_transit': return i18n.statusInTransit;
      case 'declared': return i18n.statusDeclared;
      case 'pending': return i18n.statusPending;
      case 'rejected': return i18n.statusRejected;
      default: return customsStatus.statusLabel || i18n.statusPending;
    }
  },

  getInspectionStatusLabel() {
    const customsStatus = this.data.customsStatus;
    if (!customsStatus || !customsStatus.inspectionStatus) return '';
    const i18n = this.data.i18n.customsClearance;
    switch (customsStatus.inspectionStatus) {
      case 'passed': return i18n.inspectionPassed;
      case 'pending': return i18n.inspectionPending;
      case 'failed': return i18n.inspectionFailed;
      default: return customsStatus.inspectionStatus;
    }
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

  onShareAppMessage() {
    return {
      title: this.data.i18n.pageTitle + ' - ' + this.data.traceId,
      path: '/pages/exportTrace/exportTrace?traceId=' + this.data.traceId
    };
  }
});
