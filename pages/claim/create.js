var claimService = require('../../utils/claimService.js');
var mockData = require('../../utils/mockData.js');
var MAX_IMAGE_COUNT = 6;

Page({
  data: {
    traceId: '',
    productInfo: null,
    isAbnormalBatch: false,
    isRecallBatch: false,

    problemTypes: claimService.PROBLEM_TYPES,
    selectedProblemType: '',
    selectedProblemLabel: '',

    expectedSolutions: claimService.EXPECTED_SOLUTIONS,
    selectedSolution: '',
    selectedSolutionLabel: '',

    title: '',
    description: '',
    contact: '',

    accountType: 'alipay',
    alipayAccount: '',
    bankAccount: '',
    bankAccountName: '',
    bankName: '',

    shippingAddress: '',
    showAddressInput: false,

    images: [],
    submitting: false,

    showSuccess: false,
    createdClaimId: '',
    createdClaim: null,

    prefillFromRecall: false,
    recallRegistrationId: ''
  },

  onLoad: function(options) {
    if (options && options.traceId) {
      this.setData({ traceId: options.traceId });
      this.lookupTraceId(options.traceId);
    }
    if (options && options.problemType) {
      var pt = claimService.PROBLEM_TYPES.find(function(t) { return t.key === options.problemType; });
      if (pt) {
        this.setData({
          selectedProblemType: pt.key,
          selectedProblemLabel: pt.label
        });
        this.checkSolutionAvailability();
      }
    }
    if (options && options.recallRegistrationId) {
      this.setData({
        prefillFromRecall: true,
        recallRegistrationId: options.recallRegistrationId
      });
    }
  },

  lookupTraceId: function(traceId) {
    if (!traceId) return;
    var traceData = mockData.getTraceData(traceId);
    var productInfo = null;
    var isAbnormalBatch = false;
    var isRecallBatch = false;

    if (traceData && traceData.basicInfo) {
      productInfo = {
        productName: traceData.basicInfo.productName,
        batchNo: traceData.basicInfo.batchNo,
        thumbnail: traceData.basicInfo.thumbnail,
        specification: traceData.basicInfo.specification
      };
      if (traceId === 'G002' || traceData.basicInfo.batchNo === 'GH202504') {
        isAbnormalBatch = true;
        var recallInfo = mockData.getRecallByTraceId(traceId);
        if (recallInfo) {
          isRecallBatch = true;
        }
      }
    }

    this.setData({
      productInfo: productInfo,
      isAbnormalBatch: isAbnormalBatch,
      isRecallBatch: isRecallBatch
    });

    if (isAbnormalBatch && !this.data.selectedProblemType) {
      this.setData({
        selectedProblemType: 'recall_compensation',
        selectedProblemLabel: '召回补偿'
      });
      this.checkSolutionAvailability();
    }
  },

  onTraceIdInput: function(e) {
    this.setData({ traceId: e.detail.value });
  },

  onTraceIdBlur: function(e) {
    var val = e.detail.value.trim();
    if (val) {
      this.lookupTraceId(val);
    } else {
      this.setData({
        productInfo: null,
        isAbnormalBatch: false,
        isRecallBatch: false
      });
    }
  },

  selectProblemType: function(e) {
    var key = e.currentTarget.dataset.key;
    var label = e.currentTarget.dataset.label;
    this.setData({
      selectedProblemType: key,
      selectedProblemLabel: label
    });
    this.checkSolutionAvailability();
  },

  selectSolution: function(e) {
    var key = e.currentTarget.dataset.key;
    var label = e.currentTarget.dataset.label;
    this.setData({
      selectedSolution: key,
      selectedSolutionLabel: label
    });
    this.updateAddressVisibility();
  },

  checkSolutionAvailability: function() {
    this.updateAddressVisibility();
  },

  updateAddressVisibility: function() {
    var showAddress = this.data.selectedSolution === 'exchange';
    this.setData({ showAddressInput: showAddress });
  },

  onTitleInput: function(e) {
    this.setData({ title: e.detail.value });
  },

  onDescInput: function(e) {
    this.setData({ description: e.detail.value });
  },

  onContactInput: function(e) {
    this.setData({ contact: e.detail.value });
  },

  switchAccountType: function(e) {
    this.setData({ accountType: e.detail.value });
  },

  onAlipayInput: function(e) {
    this.setData({ alipayAccount: e.detail.value });
  },

  onBankAccountInput: function(e) {
    this.setData({ bankAccount: e.detail.value });
  },

  onBankAccountNameInput: function(e) {
    this.setData({ bankAccountName: e.detail.value });
  },

  onBankNameInput: function(e) {
    this.setData({ bankName: e.detail.value });
  },

  onAddressInput: function(e) {
    this.setData({ shippingAddress: e.detail.value });
  },

  chooseImage: function() {
    var that = this;
    var remain = MAX_IMAGE_COUNT - this.data.images.length;
    if (remain <= 0) {
      wx.showToast({ title: '最多上传' + MAX_IMAGE_COUNT + '张图片', icon: 'none' });
      return;
    }
    wx.chooseMedia({
      count: remain,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        var newImages = res.tempFiles.map(function(f) { return f.tempFilePath; });
        that.setData({
          images: that.data.images.concat(newImages).slice(0, MAX_IMAGE_COUNT)
        });
      }
    });
  },

  removeImage: function(e) {
    var index = e.currentTarget.dataset.index;
    var images = this.data.images.slice();
    images.splice(index, 1);
    this.setData({ images: images });
  },

  previewImage: function(e) {
    var url = e.currentTarget.dataset.url;
    wx.previewImage({ current: url, urls: this.data.images });
  },

  validate: function() {
    if (!this.data.selectedProblemType) {
      wx.showToast({ title: '请选择问题类型', icon: 'none' });
      return false;
    }
    if (!this.data.selectedSolution) {
      wx.showToast({ title: '请选择期望方案', icon: 'none' });
      return false;
    }
    if (!this.data.title.trim()) {
      wx.showToast({ title: '请填写问题标题', icon: 'none' });
      return false;
    }
    if (!this.data.description.trim()) {
      wx.showToast({ title: '请详细描述问题', icon: 'none' });
      return false;
    }
    if (!this.data.contact.trim()) {
      wx.showToast({ title: '请填写联系电话', icon: 'none' });
      return false;
    }
    if (this.data.selectedSolution === 'refund') {
      if (this.data.accountType === 'alipay' && !this.data.alipayAccount.trim()) {
        wx.showToast({ title: '请填写支付宝账户', icon: 'none' });
        return false;
      }
      if (this.data.accountType === 'bank' && !this.data.bankAccount.trim()) {
        wx.showToast({ title: '请填写银行账户', icon: 'none' });
        return false;
      }
      if (this.data.accountType === 'bank' && !this.data.bankAccountName.trim()) {
        wx.showToast({ title: '请填写开户人姓名', icon: 'none' });
        return false;
      }
    }
    if (this.data.showAddressInput && !this.data.shippingAddress.trim()) {
      wx.showToast({ title: '请填写收货地址', icon: 'none' });
      return false;
    }
    return true;
  },

  submitClaim: function() {
    if (this.data.submitting) return;
    if (!this.validate()) return;

    var that = this;
    this.setData({ submitting: true });

    setTimeout(function() {
      var formData = {
        traceId: that.data.traceId.trim(),
        problemType: that.data.selectedProblemType,
        expectedSolution: that.data.selectedSolution,
        title: that.data.title.trim(),
        description: that.data.description.trim(),
        contact: that.data.contact.trim(),
        images: that.data.images,
        alipayAccount: that.data.alipayAccount.trim(),
        bankAccount: that.data.bankAccount.trim(),
        bankAccountName: that.data.bankAccountName.trim(),
        bankName: that.data.bankName.trim(),
        shippingAddress: that.data.shippingAddress.trim() || null
      };

      if (that.data.recallRegistrationId) {
        formData.relatedRecallRegistrationId = that.data.recallRegistrationId;
      }

      var newClaim = claimService.createClaim(formData);

      that.setData({
        submitting: false,
        showSuccess: true,
        createdClaimId: newClaim.id,
        createdClaim: newClaim
      });
    }, 800);
  },

  viewCreatedClaim: function() {
    wx.redirectTo({
      url: '/pages/claim/detail?id=' + this.data.createdClaimId
    });
  },

  resetAndContinue: function() {
    this.setData({
      showSuccess: false,
      selectedProblemType: '',
      selectedProblemLabel: '',
      selectedSolution: '',
      selectedSolutionLabel: '',
      title: '',
      description: '',
      contact: '',
      alipayAccount: '',
      bankAccount: '',
      bankAccountName: '',
      bankName: '',
      shippingAddress: '',
      images: [],
      createdClaimId: '',
      createdClaim: null
    });
  },

  goBack: function() {
    wx.navigateBack();
  }
});
