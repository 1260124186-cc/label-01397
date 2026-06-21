const mockData = require('../../utils/mockData.js');
const recallService = require('../../utils/recallService.js');
const claimService = require('../../utils/claimService.js');
const i18n = require('../../utils/i18n/index.js');

const MAX_IMAGE_COUNT = 3;

Page({
  data: {
    traceId: '',
    batchNo: '',
    recallData: null,
    loading: true,
    currentTab: 'info',

    currentLang: 'zh-CN',
    currentFontSize: 'normal',
    a11yClasses: 'font-normal',

    showRegisterForm: false,
    registerForm: {
      traceId: '',
      purchaseChannel: '',
      purchaseChannelLabel: '',
      contact: '',
      isOpened: false,
      images: [],
      remark: ''
    },
    purchaseChannels: recallService.PURCHASE_CHANNELS,
    submitting: false,

    showRegistrationResult: false,
    createdRegistration: null,
    registrationDetail: null,
    existingRegistrations: []
  },

  onLoad: function(options) {
    this.refreshA11yData();

    const traceId = options.traceId || '';
    const batchNo = options.batchNo || '';

    this.setData({
      traceId: traceId,
      batchNo: batchNo,
      'registerForm.traceId': traceId
    });

    this.loadRecallData(traceId, batchNo);
    this.loadExistingRegistrations(traceId, batchNo);
  },

  onShow: function() {
    this.refreshA11yData();
    claimService.initMockClaims();
    if (this.data.traceId || this.data.batchNo) {
      this.loadExistingRegistrations(this.data.traceId, this.data.batchNo);
    }
  },

  refreshA11yData: function() {
    const a11y = i18n.getA11yData();
    this.setData({
      currentLang: a11y.lang,
      currentFontSize: a11y.fontSize,
      a11yClasses: a11y.classes
    });
  },

  loadRecallData: function(traceId, batchNo) {
    const that = this;
    wx.showLoading({ title: '加载中...', mask: true });

    setTimeout(function() {
      let recallData = null;
      if (batchNo) {
        recallData = mockData.getRecallByBatch(batchNo);
      }
      if (!recallData && traceId) {
        recallData = mockData.getRecallByTraceId(traceId);
      }

      wx.hideLoading();

      if (recallData) {
        that.setData({
          recallData: recallData,
          batchNo: recallData.batchNo,
          loading: false
        });
        wx.setNavigationBarTitle({ title: '产品召回详情' });
      } else {
        that.setData({ loading: false });
        wx.showToast({
          title: '未找到召回信息',
          icon: 'none'
        });
      }
    }, 500);
  },

  loadExistingRegistrations: function(traceId, batchNo) {
    let registrations = [];
    if (traceId) {
      registrations = recallService.getRegistrationsByTraceId(traceId);
    } else if (batchNo) {
      registrations = recallService.getRegistrationsByBatch(batchNo);
    }
    const processed = registrations.map(function(r) {
      return {
        ...r,
        statusLabel: recallService.RECALL_STATUS_LABEL[r.status],
        statusColor: recallService.RECALL_STATUS_COLOR[r.status],
        createdAtStr: recallService.formatTime(r.createdAt)
      };
    });
    this.setData({ existingRegistrations: processed });
  },

  switchTab: function(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ currentTab: tab });
  },

  openRegisterForm: function() {
    this.setData({
      showRegisterForm: true,
      'registerForm.traceId': this.data.traceId
    });
  },

  closeRegisterForm: function() {
    this.setData({ showRegisterForm: false });
  },

  preventBubble: function() {},

  onTraceIdInput: function(e) {
    this.setData({ 'registerForm.traceId': e.detail.value });
  },

  selectPurchaseChannel: function(e) {
    const key = e.currentTarget.dataset.key;
    const label = e.currentTarget.dataset.label;
    this.setData({
      'registerForm.purchaseChannel': key,
      'registerForm.purchaseChannelLabel': label
    });
  },

  onContactInput: function(e) {
    this.setData({ 'registerForm.contact': e.detail.value });
  },

  toggleIsOpened: function(e) {
    this.setData({ 'registerForm.isOpened': e.detail.value });
  },

  onRemarkInput: function(e) {
    this.setData({ 'registerForm.remark': e.detail.value });
  },

  chooseImage: function() {
    const that = this;
    const remainCount = MAX_IMAGE_COUNT - this.data.registerForm.images.length;
    if (remainCount <= 0) {
      wx.showToast({
        title: '最多上传' + MAX_IMAGE_COUNT + '张图片',
        icon: 'none'
      });
      return;
    }

    wx.chooseMedia({
      count: remainCount,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        const newImages = res.tempFiles.map(function(f) { return f.tempFilePath; });
        that.setData({
          'registerForm.images': that.data.registerForm.images.concat(newImages).slice(0, MAX_IMAGE_COUNT)
        });
      },
      fail: function(err) {
        console.log('[recall/detail] 选择图片失败:', err);
      }
    });
  },

  removeImage: function(e) {
    const index = e.currentTarget.dataset.index;
    const images = [...this.data.registerForm.images];
    images.splice(index, 1);
    this.setData({ 'registerForm.images': images });
  },

  previewImage: function(e) {
    const url = e.currentTarget.dataset.url;
    wx.previewImage({
      current: url,
      urls: this.data.registerForm.images
    });
  },

  validateRegisterForm: function() {
    const form = this.data.registerForm;
    if (!form.traceId.trim()) {
      wx.showToast({ title: '请输入溯源ID', icon: 'none' });
      return false;
    }
    if (!form.purchaseChannel) {
      wx.showToast({ title: '请选择购买渠道', icon: 'none' });
      return false;
    }
    if (!form.contact.trim()) {
      wx.showToast({ title: '请填写联系方式', icon: 'none' });
      return false;
    }
    return true;
  },

  submitRegistration: function() {
    if (this.data.submitting) return;
    if (!this.validateRegisterForm()) return;

    const that = this;
    this.setData({ submitting: true });

    setTimeout(function() {
      const result = recallService.createRegistration({
        traceId: that.data.registerForm.traceId.trim(),
        batchNo: that.data.batchNo,
        purchaseChannel: that.data.registerForm.purchaseChannel,
        purchaseChannelLabel: that.data.registerForm.purchaseChannelLabel,
        contact: that.data.registerForm.contact.trim(),
        isOpened: that.data.registerForm.isOpened,
        images: that.data.registerForm.images,
        remark: that.data.registerForm.remark.trim()
      });

      that.setData({
        submitting: false,
        showRegisterForm: false,
        showRegistrationResult: true,
        createdRegistration: {
          ...result,
          statusLabel: recallService.RECALL_STATUS_LABEL[result.status],
          statusColor: recallService.RECALL_STATUS_COLOR[result.status],
          createdAtStr: recallService.formatTime(result.createdAt)
        },
        registerForm: {
          traceId: that.data.traceId,
          purchaseChannel: '',
          purchaseChannelLabel: '',
          contact: '',
          isOpened: false,
          images: [],
          remark: ''
        }
      });

      that.loadExistingRegistrations(that.data.traceId, that.data.batchNo);
    }, 800);
  },

  closeRegistrationResult: function() {
    this.setData({ showRegistrationResult: false });
  },

  viewRegistrationDetail: function(e) {
    const id = e.currentTarget.dataset.id;
    const registration = recallService.getRegistrationById(id);
    if (!registration) return;

    const timeline = registration.statusTimeline.map(function(item) {
      return {
        ...item,
        statusLabel: recallService.RECALL_STATUS_LABEL[item.status],
        timestampStr: recallService.formatTime(item.timestamp)
      };
    }).reverse();

    this.setData({
      registrationDetail: {
        ...registration,
        statusLabel: recallService.RECALL_STATUS_LABEL[registration.status],
        statusColor: recallService.RECALL_STATUS_COLOR[registration.status],
        createdAtStr: recallService.formatTime(registration.createdAt),
        timeline: timeline
      }
    });
  },

  closeRegistrationDetail: function() {
    this.setData({ registrationDetail: null });
  },

  convertToTicket: function(e) {
    const that = this;
    const registrationId = e.currentTarget.dataset.id || (this.data.registrationDetail && this.data.registrationDetail.id);

    if (!registrationId) return;

    wx.showModal({
      title: '转换为工单',
      content: '确定将此召回登记转换为客服工单吗？转换后可在工单系统跟踪处理进度。',
      confirmText: '确定转换',
      cancelText: '取消',
      success: function(res) {
        if (res.confirm) {
          wx.showLoading({ title: '转换中...', mask: true });
          setTimeout(function() {
            const result = recallService.convertToTicket(registrationId);
            wx.hideLoading();
            if (result.success) {
              if (result.alreadyExisted) {
                wx.showToast({ title: '已存在关联工单', icon: 'none' });
              } else {
                wx.showToast({ title: '工单创建成功', icon: 'success' });
              }
              setTimeout(function() {
                wx.navigateTo({
                  url: '/pages/service/ticketDetail?id=' + result.ticketId
                });
              }, 1000);
            } else {
              wx.showToast({ title: result.error || '转换失败', icon: 'none' });
            }
          }, 600);
        }
      }
    });
  },

  goToTicketDetail: function(e) {
    const ticketId = e.currentTarget.dataset.ticketId;
    if (ticketId) {
      wx.navigateTo({
        url: '/pages/service/ticketDetail?id=' + ticketId
      });
    }
  },

  goToDetail: function() {
    if (this.data.traceId) {
      wx.navigateTo({
        url: '/pages/detail/detail?traceId=' + this.data.traceId
      });
    }
  },

  onShareAppMessage: function() {
    const data = this.data.recallData;
    return {
      title: `【产品召回】${data ? data.productName : ''} 批次${data ? data.batchNo : ''}安全提示`,
      path: `/pages/recall/detail?batchNo=${this.data.batchNo}&traceId=${this.data.traceId}`
    };
  },

  goCreateClaim: function() {
    var params = [];
    if (this.data.traceId) {
      params.push('traceId=' + this.data.traceId);
    }
    if (this.data.batchNo) {
      params.push('batchNo=' + this.data.batchNo);
    }
    params.push('problemType=recall_compensation');
    wx.navigateTo({
      url: '/pages/claim/create?' + params.join('&')
    });
  },

  convertToClaim: function(e) {
    var that = this;
    var registrationId = e.currentTarget.dataset.id
      || (this.data.registrationDetail && this.data.registrationDetail.id);
    if (!registrationId) return;

    wx.showModal({
      title: '转理赔工单',
      content: '确定将此召回登记转为质量理赔工单吗？将自动进入鉴定→补偿流程，享受退款/换货/积分补偿。',
      confirmText: '确认转换',
      cancelText: '取消',
      success: function(res) {
        if (!res.confirm) return;
        wx.showLoading({ title: '转换中...', mask: true });
        setTimeout(function() {
          var reg = recallService.getRegistrationById(registrationId);
          var formData = {
            traceId: reg ? reg.traceId : (that.data.traceId || 'G002'),
            problemType: 'recall_compensation',
            expectedSolution: 'refund',
            description: (reg && reg.remark) ? reg.remark : 'G002批次召回补偿',
            contact: reg ? reg.contact : '138****8888',
            accountType: 'alipay',
            accountNumber: reg && reg.contact ? reg.contact.replace(/^(\d{3})\d{4}(\d{4})$/, '$1*****$2') + '@alipay.com' : '138****8888@alipay.com',
            images: reg ? reg.images : [],
            isAbnormalBatch: that.data.batchNo === 'GH202504' || (reg && reg.traceId) === 'G002',
            isRecallBatch: true
          };
          var result = claimService.convertFromRecallRegistration(registrationId, formData);
          wx.hideLoading();
          if (result.success) {
            if (result.alreadyExisted) {
              wx.showToast({ title: '已存在关联理赔工单', icon: 'none' });
            } else {
              wx.showToast({ title: '理赔工单创建成功', icon: 'success' });
            }
            that.loadExistingRegistrations(that.data.traceId, that.data.batchNo);
            setTimeout(function() {
              wx.navigateTo({
                url: '/pages/claim/detail?id=' + result.claimId
              });
            }, 1000);
          } else {
            wx.showToast({ title: result.error || '转换失败', icon: 'none' });
          }
        }, 800);
      }
    });
  },

  goToClaimDetail: function(e) {
    var claimId = e.currentTarget.dataset.claimId;
    if (claimId) {
      wx.navigateTo({
        url: '/pages/claim/detail?id=' + claimId
      });
    }
  }
});
