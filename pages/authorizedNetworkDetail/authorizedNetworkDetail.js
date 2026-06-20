var authorizedNetwork = require('../../utils/authorizedNetwork.js');
var reviewTrust = require('../../utils/reviewTrust.js');
var auth = require('../../utils/auth.js');

Page({
  data: {
    storeId: '',
    store: null,
    traceId: '',
    loading: true,
    authorizationDisplay: null,
    ratingSummary: null,
    reviews: [],
    showReviewModal: false,
    reviewForm: {
      rating: 5,
      content: '',
      tags: []
    },
    reviewPresetTags: ['环境优雅', '茶艺专业', '服务好', '正宗口感', '官方授权', '交通便利', '值得一去', '品质保障'],
    reviewPresetTagsWithState: [],
    showVerifyModal: false,
    verifyInput: '',
    verifyResult: null,
    verifying: false,
    activeTab: 'info',
    tabs: [
      { key: 'info', label: '网点信息', icon: '📋' },
      { key: 'auth', label: '授权溯源', icon: '🛡️' },
      { key: 'reviews', label: '用户评价', icon: '⭐' }
    ]
  },

  onLoad: function(options) {
    if (options.verify === 'true') {
      this.setData({ showVerifyModal: true });
      return;
    }

    var storeId = options.id;
    if (!storeId) {
      wx.showToast({ title: '参数错误', icon: 'none' });
      setTimeout(function() { wx.navigateBack(); }, 1500);
      return;
    }

    this.setData({
      storeId: storeId,
      traceId: options.traceId || ''
    });

    this.loadStoreData(storeId);
  },

  loadStoreData: function(storeId) {
    var store = authorizedNetwork.getStoreById(storeId);
    if (!store) {
      wx.showToast({ title: '网点不存在', icon: 'none' });
      setTimeout(function() { wx.navigateBack(); }, 1500);
      return;
    }

    var authDisplay = authorizedNetwork.getAuthorizationDisplay(store);
    var ratingSummary = authorizedNetwork.getStoreRatingSummary(storeId);
    var reviews = authorizedNetwork.getStoreReviews(storeId);
    var mockReviews = require('../../utils/mockData.js').getStoreReviews(storeId);
    var allReviews = reviews.concat(mockReviews);

    var presetTagsWithState = this.data.reviewPresetTags.map(function(t) {
      return { name: t, selected: false };
    });

    this.setData({
      store: store,
      loading: false,
      authorizationDisplay: authDisplay,
      ratingSummary: ratingSummary,
      reviews: allReviews,
      reviewPresetTagsWithState: presetTagsWithState
    });

    wx.setNavigationBarTitle({ title: store.name });
  },

  switchTab: function(e) {
    var key = e.currentTarget.dataset.key;
    this.setData({ activeTab: key });
  },

  openNavigation: function() {
    var store = this.data.store;
    if (!store) return;
    authorizedNetwork.openStoreNavigation(store);
  },

  callStore: function() {
    var store = this.data.store;
    if (!store || !store.phone) return;
    wx.makePhoneCall({
      phoneNumber: store.phone,
      fail: function() {
        wx.showToast({ title: '拨号失败', icon: 'none' });
      }
    });
  },

  copyStoreCode: function() {
    var store = this.data.store;
    if (!store) return;
    wx.setClipboardData({
      data: store.storeCode,
      success: function() {
        wx.showToast({ title: '门店码已复制', icon: 'success' });
      }
    });
  },

  openVerifyModal: function() {
    this.setData({
      showVerifyModal: true,
      verifyInput: '',
      verifyResult: null
    });
  },

  closeVerifyModal: function() {
    this.setData({ showVerifyModal: false, verifyResult: null });
  },

  onVerifyInputChange: function(e) {
    this.setData({ verifyInput: e.detail.value });
  },

  startScanVerify: function() {
    var that = this;
    wx.scanCode({
      scanType: ['qrCode'],
      success: function(res) {
        that.setData({ verifyInput: res.result });
        that.doVerify();
      },
      fail: function(err) {
        if (err.errMsg && err.errMsg.indexOf('cancel') === -1) {
          wx.showToast({ title: '扫码失败', icon: 'none' });
        }
      }
    });
  },

  doVerify: function() {
    var that = this;
    var storeCode = this.data.verifyInput.trim();
    if (!storeCode) {
      wx.showToast({ title: '请输入或扫描门店码', icon: 'none' });
      return;
    }

    this.setData({ verifying: true });

    setTimeout(function() {
      var result = authorizedNetwork.verifyStoreCodeAndTrace(storeCode, that.data.traceId);
      that.setData({
        verifyResult: result,
        verifying: false
      });
    }, 600);
  },

  openReviewModal: function() {
    var userInfo = auth.getUserInfo();
    var userId = userInfo ? userInfo.userId : 'anonymous';
    var userName = userInfo ? userInfo.nickName : '匿名用户';
    this.setData({
      showReviewModal: true,
      reviewForm: {
        rating: 5,
        content: '',
        tags: [],
        userId: userId,
        userName: userName
      },
      reviewPresetTagsWithState: this.data.reviewPresetTags.map(function(t) {
        return { name: t, selected: false };
      })
    });
  },

  closeReviewModal: function() {
    this.setData({ showReviewModal: false });
  },

  preventBubble: function() {},

  onReviewRatingTap: function(e) {
    var rating = e.currentTarget.dataset.rating;
    this.setData({ 'reviewForm.rating': rating });
  },

  onReviewContentInput: function(e) {
    this.setData({ 'reviewForm.content': e.detail.value });
  },

  onReviewTagTap: function(e) {
    var tagName = e.currentTarget.dataset.name;
    var tags = this.data.reviewPresetTagsWithState;
    var selectedTags = [];

    for (var i = 0; i < tags.length; i++) {
      if (tags[i].name === tagName) {
        tags[i].selected = !tags[i].selected;
      }
      if (tags[i].selected) {
        selectedTags.push(tags[i].name);
      }
    }

    this.setData({
      reviewPresetTagsWithState: tags,
      'reviewForm.tags': selectedTags
    });
  },

  submitReview: function() {
    var form = this.data.reviewForm;
    if (!form.content || form.content.trim().length < 5) {
      wx.showToast({ title: '评价内容至少5个字', icon: 'none' });
      return;
    }

    var result = authorizedNetwork.submitStoreReview(this.data.storeId, {
      userId: form.userId,
      userName: form.userName,
      rating: form.rating,
      content: form.content,
      tags: form.tags,
      isVerifiedPurchase: !!(this.data.verifyResult && this.data.verifyResult.success)
    });

    if (result.success) {
      this.setData({ showReviewModal: false });
      wx.showToast({ title: '评价成功', icon: 'success' });
      this.loadStoreData(this.data.storeId);
    } else {
      wx.showToast({ title: result.error, icon: 'none' });
    }
  },

  onLikeReview: function(e) {
    var reviewId = e.currentTarget.dataset.id;
    authorizedNetwork.likeStoreReview(this.data.storeId, reviewId);
    this.loadStoreData(this.data.storeId);
  },

  previewStoreImage: function(e) {
    var url = e.currentTarget.dataset.url;
    var store = this.data.store;
    if (!store || !store.images) return;
    wx.previewImage({
      current: url,
      urls: store.images
    });
  },

  goBack: function() {
    wx.navigateBack();
  },

  onShareAppMessage: function() {
    var store = this.data.store;
    return {
      title: store ? store.name + ' - 官方授权网点' : '授权合作网点',
      path: '/pages/authorizedNetworkDetail/authorizedNetworkDetail?id=' + this.data.storeId
    };
  }
});
