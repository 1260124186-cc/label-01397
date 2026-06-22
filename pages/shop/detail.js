var mockData = require('../../../utils/mockData.js');
var shop = require('../../../utils/shop.js');
var marketingAnalytics = require('../../../utils/marketingAnalytics.js');
var teaPairing = require('../../../utils/teaPairing.js');

Page({
  data: {
    traceId: '',
    product: null,
    loading: true,
    currentImageIndex: 0,
    selectedSpecs: [],
    selectedSpecsText: '',
    selectedSku: null,
    quantity: 1,
    cartCount: 0,
    showSkuSelector: false,
    skuMode: 'cart',
    isMember: false,
    memberLevel: null,
    promotions: [],
    showShareMenu: false,
    pairingPlan: null,
    relatedUgcs: [],
    showPairingSection: false
  },

  onLoad: function(options) {
    console.log('[ShopDetail] 页面加载，参数：', options);
    
    var traceId = options.traceId;
    if (!traceId) {
      wx.showToast({ title: '参数错误', icon: 'none' });
      setTimeout(function() { wx.navigateBack(); }, 1500);
      return;
    }

    this.setData({ traceId: traceId });
    this.loadProductData();
    this.loadPromotions();
    this.refreshCartCount();
    this.checkMemberStatus();

    if (options.buyNow === '1') {
      var skuId = options.skuId;
      var quantity = parseInt(options.quantity) || 1;
      setTimeout(function() {
        this.openSkuSelector('buy');
      }.bind(this), 500);
    }
  },

  onShow: function() {
    this.refreshCartCount();
  },

  loadProductData: function() {
    var that = this;
    
    this.setData({ loading: true });

    setTimeout(function() {
      var product = mockData.getShopProduct(that.data.traceId);
      
      if (product) {
        var selectedSpecs = [];
        for (var i = 0; i < product.specs.length; i++) {
          selectedSpecs.push(product.specs[i].values[0]);
        }
        
        var defaultSku = product.skuList[product.defaultSkuIndex || 0];
        
        that.setData({
          product: product,
          selectedSpecs: selectedSpecs,
          selectedSpecsText: selectedSpecs.join(' / '),
          selectedSku: defaultSku,
          loading: false
        });
        that.loadPairingPlan();
      } else {
        wx.showToast({ title: '商品不存在', icon: 'none' });
        setTimeout(function() { wx.navigateBack(); }, 1500);
      }
    }, 600);
  },

  loadPromotions: function() {
    var promotions = mockData.getActivePromotions();
    this.setData({ promotions: promotions });
  },

  refreshCartCount: function() {
    var count = shop.getCartCount();
    this.setData({ cartCount: count });
  },

  checkMemberStatus: function() {
    var memberLevel = mockData.getMemberLevelByPoints(800);
    this.setData({
      isMember: memberLevel.level > 1,
      memberLevel: memberLevel
    });
  },

  onImageChange: function(e) {
    this.setData({ currentImageIndex: e.detail.current });
  },

  onPreviewImage: function(e) {
    var url = e.currentTarget.dataset.url;
    var urls = this.data.product.images;
    wx.previewImage({
      current: url,
      urls: urls
    });
  },

  openSkuSelector: function(mode) {
    this.setData({
      showSkuSelector: true,
      skuMode: mode || 'cart'
    });
  },

  onSkuClose: function() {
    this.setData({ showSkuSelector: false });
  },

  onSkuAddCart: function(e) {
    var detail = e.detail;
    var result = shop.addToCart(detail);
    
    if (result.success) {
      var product = this.data.product;
      var sku = mockData.getSkuById(this.data.traceId, detail.skuId);
      marketingAnalytics.trackShopAddCart({
        traceId: this.data.traceId,
        productName: product ? product.productName : '',
        skuId: detail.skuId,
        specValues: sku ? sku.specValues.join(',') : '',
        quantity: detail.quantity,
        price: sku ? sku.price : 0
      });

      wx.showToast({ title: '已加入购物车', icon: 'success' });
      this.refreshCartCount();
    } else {
      wx.showToast({ title: result.msg || '加入失败', icon: 'none' });
    }
  },

  onSkuBuyNow: function(e) {
    var detail = e.detail;
    var product = this.data.product;
    var sku = mockData.getSkuById(this.data.traceId, detail.skuId);
    
    if (!sku) {
      wx.showToast({ title: '规格信息错误', icon: 'none' });
      return;
    }

    var orderItems = [{
      traceId: this.data.traceId,
      skuId: detail.skuId,
      productName: product.productName,
      specValues: sku.specValues,
      price: sku.price,
      memberPrice: sku.memberPrice,
      quantity: detail.quantity,
      thumbnail: product.thumbnail
    }];

    var priceResult = shop.calculateOrderPrice(orderItems, {
      isMember: this.data.isMember,
      freight: product.freight
    });

    wx.showModal({
      title: '确认订单',
      content: '商品：' + product.productName + '\n规格：' + sku.specValues.join(' / ') + '\n数量：' + detail.quantity + '\n实付：¥' + priceResult.payAmount,
      confirmText: '去支付',
      success: function(res) {
        if (res.confirm) {
          var orderResult = shop.createOrder({
            items: orderItems,
            totalAmount: priceResult.goodsAmount,
            payAmount: priceResult.payAmount,
            freight: priceResult.freight,
            discount: priceResult.promotionDiscount + priceResult.couponDiscount,
            promotionDiscount: priceResult.promotionDiscount,
            couponDiscount: priceResult.couponDiscount,
            address: {
              name: '张女士',
              phone: '138****5678',
              province: '湖北省',
              city: 'A市',
              district: '洪山区',
              detail: '东湖路128号桂花小区3栋2单元501'
            }
          });

          if (orderResult.success) {
            shop.payOrder(orderResult.order.orderId);
            wx.showToast({ title: '下单成功', icon: 'success' });
            setTimeout(function() {
              wx.redirectTo({
                url: '/pages/shop/orderDetail?orderId=' + orderResult.order.orderId
              });
            }, 1500);
          }
        }
      }
    });
  },

  onAddToCart: function() {
    this.openSkuSelector('cart');
  },

  onBuyNow: function() {
    this.openSkuSelector('buy');
  },

  onCartTap: function() {
    wx.switchTab({
      url: '/pages/shop/cart'
    });
  },

  goToTrace: function() {
    wx.navigateTo({
      url: '/pages/detail/detail?traceId=' + this.data.traceId
    });
  },

  goToOrderTrace: function() {
    wx.navigateTo({
      url: '/pages/shop/orderTrace?traceId=' + this.data.traceId
    });
  },

  buyAgain: function() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },

  buySameStyle: function() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },

  onShareTap: function() {
    this.setData({ showShareMenu: true });
  },

  onShareClose: function() {
    this.setData({ showShareMenu: false });
  },

  onShareAppMessage: function() {
    var product = this.data.product;
    return {
      title: product ? product.productName + ' - 一茶一品桂花茶' : '一茶一品・桂花茶商城',
      path: '/pages/shop/detail?traceId=' + this.data.traceId,
      imageUrl: product ? product.thumbnail : ''
    };
  },

  onShareTimeline: function() {
    var product = this.data.product;
    return {
      title: product ? product.productName : '一茶一品・桂花茶商城',
      query: 'traceId=' + this.data.traceId,
      imageUrl: product ? product.thumbnail : ''
    };
  },

  loadPairingPlan: function() {
    var that = this;
    var traceId = that.data.traceId;
    var plan = teaPairing.getFullPairingPlan(traceId);
    if (plan && plan.pairing) {
      var recommendedFoodIds = plan.pairing.recommendedFoods || [];
      plan.pairing.defaultFoodIds = recommendedFoodIds.slice(0, 2);
      var defaultSkuId = plan.product && plan.product.skuList
        ? plan.product.skuList[plan.product.defaultSkuIndex || 0].skuId
        : null;
      var priceInfo = teaPairing.calculatePairingPrice(
        traceId, defaultSkuId, plan.pairing.defaultFoodIds, that.data.isMember
      );
      plan.priceInfo = priceInfo;
      that.setData({
        pairingPlan: plan,
        relatedUgcs: plan.relatedUgcs || [],
        showPairingSection: true
      });
    }
  },

  onPairingOneClickAdd: function() {
    var that = this;
    var plan = that.data.pairingPlan;
    if (!plan) return;
    wx.showLoading({ title: '正在加入购物车...', mask: true });
    var defaultSkuId = plan.product && plan.product.skuList
      ? plan.product.skuList[plan.product.defaultSkuIndex || 0].skuId
      : null;
    var result = teaPairing.addCustomPairingToCart(
      plan.traceId,
      defaultSkuId,
      plan.pairing && plan.pairing.defaultFoodIds ? plan.pairing.defaultFoodIds : []
    );
    wx.hideLoading();
    if (result.success) {
      wx.showToast({
        title: '成功加入' + result.addedCount + '件商品',
        icon: 'success',
        duration: 1500
      });
      that.refreshCartCount();
    } else {
      wx.showToast({ title: '加入失败', icon: 'none' });
    }
  },

  onViewFullPairing: function() {
    var traceId = this.data.traceId;
    wx.navigateTo({
      url: '/pages/teaPairing/detail?traceId=' + traceId
    });
  },

  onUgcCardTap: function(e) {
    var images = e.currentTarget.dataset.images;
    if (images && images.length > 0) {
      wx.previewImage({ urls: images, current: images[0] });
    }
  },

  onBackHome: function() {
    wx.switchTab({
      url: '/pages/shop/list'
    });
  }
});
