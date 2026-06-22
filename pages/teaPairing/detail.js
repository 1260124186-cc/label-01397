/**
 * 茶食搭配详情页
 * 功能：品种搭配详情、节日礼盒详情、溯源ID搭配方案
 */

var teaPairing = require('../../../utils/teaPairing.js');
var mockData = require('../../../utils/mockData.js');
var shop = require('../../../utils/shop.js');

Page({
  data: {
    pageType: '',
    loading: true,
    pairingData: null,
    giftBox: null,
    productData: null,
    selectedFoods: [],
    teaQuantity: 1,
    foodQuantities: {},
    cartCount: 0,
    totalPrice: 0,
    memberTotalPrice: 0,
    relatedUgcs: [],
    isMember: false,
    memberLevel: null,
    teaSkuId: '',
    teaTraceId: '',
    scrollTop: 0
  },

  onLoad: function(options) {
    console.log('[TeaPairingDetail] 页面加载，参数：', options);

    this.initMemberStatus();
    this.refreshCartCount();

    if (options.varietyKey) {
      this.setData({ pageType: 'variety' });
      this.loadByVariety(options.varietyKey);
    } else if (options.boxId) {
      this.setData({ pageType: 'giftbox' });
      this.loadByBoxId(options.boxId);
    } else if (options.traceId) {
      this.setData({ pageType: 'product' });
      this.loadByTraceId(options.traceId);
    } else {
      wx.showToast({ title: '参数错误', icon: 'none' });
      setTimeout(function() { wx.navigateBack(); }, 1500);
    }
  },

  onShow: function() {
    this.refreshCartCount();
  },

  initMemberStatus: function() {
    var memberLevel = mockData.getMemberLevelByPoints(800);
    this.setData({
      isMember: memberLevel.level > 1,
      memberLevel: memberLevel
    });
  },

  loadByVariety: function(varietyKey) {
    var that = this;
    this.setData({ loading: true });

    setTimeout(function() {
      var pairing = teaPairing.getPairingByVariety(varietyKey);
      if (!pairing) {
        wx.showToast({ title: '搭配方案不存在', icon: 'none' });
        setTimeout(function() { wx.navigateBack(); }, 1500);
        return;
      }

      var traceIdMap = {
        'jin-gui': 'G001',
        'yin-gui': 'G002',
        'dan-gui': 'G003',
        'si-ji-gui': 'G004'
      };
      var teaTraceId = traceIdMap[varietyKey] || 'G001';
      var product = mockData.getShopProduct(teaTraceId);
      var defaultSku = product && product.skuList
        ? product.skuList[product.defaultSkuIndex || 0]
        : null;

      var initialFoods = [];
      var foodQuantities = {};
      var recommendedList = pairing.recommendedFoodList || [];
      for (var i = 0; i < recommendedList.length; i++) {
        initialFoods.push(recommendedList[i].foodId);
        foodQuantities[recommendedList[i].foodId] = 1;
      }

      var ugcs = mockData.getUgcPosts({ variety: pairing.varietyName }).slice(0, 4);

      that.setData({
        pairingData: pairing,
        productData: product,
        teaTraceId: teaTraceId,
        teaSkuId: defaultSku ? defaultSku.skuId : '',
        selectedFoods: initialFoods,
        foodQuantities: foodQuantities,
        relatedUgcs: ugcs,
        loading: false
      });

      that.calculateTotal();
    }, 500);
  },

  loadByBoxId: function(boxId) {
    var that = this;
    this.setData({ loading: true });

    setTimeout(function() {
      var box = teaPairing.getGiftBoxDetail(boxId);
      if (!box) {
        wx.showToast({ title: '礼盒不存在', icon: 'none' });
        setTimeout(function() { wx.navigateBack(); }, 1500);
        return;
      }

      that.setData({
        giftBox: box,
        loading: false
      });
    }, 500);
  },

  loadByTraceId: function(traceId) {
    var that = this;
    this.setData({ loading: true });

    setTimeout(function() {
      var plan = teaPairing.getFullPairingPlan(traceId);
      if (!plan) {
        wx.showToast({ title: '搭配方案不存在', icon: 'none' });
        setTimeout(function() { wx.navigateBack(); }, 1500);
        return;
      }

      var pairing = plan.pairing;
      var product = plan.product;
      var defaultSku = product && product.skuList
        ? product.skuList[product.defaultSkuIndex || 0]
        : null;

      var initialFoods = [];
      var foodQuantities = {};
      var recommendedList = pairing ? (pairing.recommendedFoodList || []) : [];
      for (var i = 0; i < recommendedList.length; i++) {
        initialFoods.push(recommendedList[i].foodId);
        foodQuantities[recommendedList[i].foodId] = 1;
      }

      that.setData({
        pairingData: pairing,
        productData: product,
        teaTraceId: traceId,
        teaSkuId: defaultSku ? defaultSku.skuId : '',
        selectedFoods: initialFoods,
        foodQuantities: foodQuantities,
        relatedUgcs: plan.relatedUgcs || [],
        loading: false
      });

      that.calculateTotal();
    }, 500);
  },

  toggleFoodSelect: function(e) {
    var foodId = e.currentTarget.dataset.foodId;
    var selectedFoods = this.data.selectedFoods.slice();
    var foodQuantities = Object.assign({}, this.data.foodQuantities);
    var index = selectedFoods.indexOf(foodId);

    if (index >= 0) {
      selectedFoods.splice(index, 1);
    } else {
      selectedFoods.push(foodId);
      if (!foodQuantities[foodId]) {
        foodQuantities[foodId] = 1;
      }
    }

    this.setData({
      selectedFoods: selectedFoods,
      foodQuantities: foodQuantities
    });

    this.calculateTotal();
  },

  changeQuantity: function(e) {
    var type = e.currentTarget.dataset.type;
    var delta = parseInt(e.currentTarget.dataset.delta) || 0;

    if (type === 'tea') {
      var newQty = this.data.teaQuantity + delta;
      if (newQty < 1) newQty = 1;
      if (newQty > 99) newQty = 99;
      this.setData({ teaQuantity: newQty });
    } else {
      var foodId = type;
      var foodQuantities = Object.assign({}, this.data.foodQuantities);
      var currentQty = foodQuantities[foodId] || 1;
      var newFoodQty = currentQty + delta;
      if (newFoodQty < 1) newFoodQty = 1;
      if (newFoodQty > 99) newFoodQty = 99;
      foodQuantities[foodId] = newFoodQty;
      this.setData({ foodQuantities: foodQuantities });
    }

    this.calculateTotal();
  },

  calculateTotal: function() {
    var selectedFoods = this.data.selectedFoods;
    var teaQuantity = this.data.teaQuantity;
    var foodQuantities = this.data.foodQuantities;

    var total = 0;
    var memberTotal = 0;

    if (this.data.teaTraceId && this.data.teaSkuId) {
      var sku = mockData.getSkuById(this.data.teaTraceId, this.data.teaSkuId);
      if (sku) {
        total += sku.price * teaQuantity;
        memberTotal += sku.memberPrice * teaQuantity;
      }
    }

    for (var i = 0; i < selectedFoods.length; i++) {
      var food = mockData.getFoodProduct(selectedFoods[i]);
      if (food) {
        var qty = foodQuantities[selectedFoods[i]] || 1;
        total += food.price * qty;
        memberTotal += food.memberPrice * qty;
      }
    }

    this.setData({
      totalPrice: Math.round(total * 100) / 100,
      memberTotalPrice: Math.round(memberTotal * 100) / 100
    });
  },

  addAllToCart: function() {
    var that = this;
    var selectedFoods = this.data.selectedFoods;
    var foodQuantities = this.data.foodQuantities;
    var quantities = [];

    for (var i = 0; i < selectedFoods.length; i++) {
      quantities.push(foodQuantities[selectedFoods[i]] || 1);
    }

    wx.showLoading({ title: '加购中...', mask: true });

    setTimeout(function() {
      var result = teaPairing.addCustomPairingToCart(
        that.data.teaTraceId,
        that.data.teaSkuId,
        selectedFoods,
        quantities
      );

      wx.hideLoading();

      if (result && result.success) {
        wx.showToast({ title: '已加入购物车', icon: 'success' });
        that.refreshCartCount();
      } else {
        wx.showToast({
          title: (result && result.msg) || '加购失败',
          icon: 'none'
        });
      }
    }, 600);
  },

  addGiftBoxToCart: function() {
    var that = this;
    var boxId = this.data.giftBox ? this.data.giftBox.boxId : '';

    if (!boxId) {
      wx.showToast({ title: '礼盒信息错误', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '加购中...', mask: true });

    setTimeout(function() {
      var result = teaPairing.addGiftBoxToCart(boxId, 1);
      wx.hideLoading();

      if (result && result.success) {
        wx.showToast({ title: '已加入购物车', icon: 'success' });
        that.refreshCartCount();
      } else {
        wx.showToast({
          title: (result && result.msg) || '加购失败',
          icon: 'none'
        });
      }
    }, 600);
  },

  addFoodToCart: function(e) {
    var that = this;
    var foodId = e.currentTarget.dataset.foodId;
    var qty = this.data.foodQuantities[foodId] || 1;

    wx.showLoading({ title: '加购中...', mask: true });

    setTimeout(function() {
      var result = teaPairing.addSingleFoodToCart(foodId, qty);
      wx.hideLoading();

      if (result && result.success) {
        wx.showToast({ title: '已加入购物车', icon: 'success' });
        that.refreshCartCount();
      } else {
        wx.showToast({
          title: (result && result.msg) || '加购失败',
          icon: 'none'
        });
      }
    }, 500);
  },

  refreshCartCount: function() {
    var count = shop.getCartCount();
    this.setData({ cartCount: count });
  },

  goToPreference: function() {
    wx.navigateTo({
      url: '/pages/preference/preference',
      fail: function() {
        wx.showToast({ title: '页面开发中', icon: 'none' });
      }
    });
  },

  goToUgcUpload: function() {
    wx.navigateTo({
      url: '/pages/ugc/upload',
      fail: function() {
        wx.showToast({ title: '页面开发中', icon: 'none' });
      }
    });
  },

  goToCart: function() {
    wx.navigateTo({
      url: '/pages/shop/cart'
    });
  },

  goToUgcList: function() {
    wx.navigateTo({
      url: '/pages/ugc/list',
      fail: function() {
        wx.showToast({ title: '页面开发中', icon: 'none' });
      }
    });
  },

  onFoodPreviewImage: function(e) {
    var url = e.currentTarget.dataset.url;
    var list = [];
    var recommendedList = this.data.pairingData
      ? (this.data.pairingData.recommendedFoodList || [])
      : [];
    for (var i = 0; i < recommendedList.length; i++) {
      if (recommendedList[i].thumbnail) {
        list.push(recommendedList[i].thumbnail);
      }
    }
    if (list.length === 0 && url) list.push(url);
    wx.previewImage({ current: url, urls: list });
  },

  onUgcPreviewImage: function(e) {
    var url = e.currentTarget.dataset.url;
    var index = e.currentTarget.dataset.index;
    var ugcs = this.data.relatedUgcs || [];
    var urls = [];
    if (ugcs[index] && ugcs[index].images) {
      urls = ugcs[index].images;
    }
    if (urls.length === 0 && url) urls.push(url);
    wx.previewImage({ current: url, urls: urls });
  },

  goToProductDetail: function(e) {
    var traceId = e.currentTarget.dataset.traceId;
    if (traceId) {
      wx.navigateTo({
        url: '/pages/shop/detail?traceId=' + traceId
      });
    }
  },

  onPageScroll: function(e) {
    this.setData({ scrollTop: e.scrollTop });
  },

  onShareAppMessage: function() {
    var title = '茶食搭配推荐';
    if (this.data.pageType === 'variety' && this.data.pairingData) {
      title = this.data.pairingData.varietyName + '搭配推荐 - ' + (this.data.pairingData.tagline || '');
    } else if (this.data.pageType === 'giftbox' && this.data.giftBox) {
      title = this.data.giftBox.name || '节日礼盒推荐';
    }
    return {
      title: title,
      path: '/pages/teaPairing/list'
    };
  }
});
