var mockData = require('../../../utils/mockData.js');
var shop = require('../../../utils/shop.js');

Page({
  data: {
    productList: [],
    loading: true,
    categories: ['全部', '金桂系列', '银桂系列'],
    currentCategory: '全部',
    sortOptions: [
      { key: 'default', label: '综合' },
      { key: 'sales', label: '销量' },
      { key: 'priceAsc', label: '价格↑' },
      { key: 'priceDesc', label: '价格↓' }
    ],
    currentSort: 'default',
    cartCount: 0,
    showSkuSelector: false,
    selectedTraceId: '',
    isMember: false,
    searchKeyword: '',
    promotions: [],
    banners: [
      {
        id: 1,
        title: '金秋桂花节',
        subtitle: '全场满199减25',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=autumn%20osmanthus%20tea%20festival%20promotion%20banner%20golden%20flowers&image_size=landscape_16_9'
      },
      {
        id: 2,
        title: '新品上市',
        subtitle: '金桂礼盒装 六窨一提',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=new%20premium%20osmanthus%20tea%20gift%20box%20launch%20banner&image_size=landscape_16_9'
      }
    ],
    currentBanner: 0
  },

  onLoad: function(options) {
    this.loadPromotions();
    this.loadProductList();
    this.refreshCartCount();
  },

  onShow: function() {
    this.refreshCartCount();
  },

  onPullDownRefresh: function() {
    this.loadProductList();
    setTimeout(function() {
      wx.stopPullDownRefresh();
    }, 800);
  },

  loadPromotions: function() {
    var promotions = mockData.getActivePromotions();
    this.setData({ promotions: promotions });
  },

  loadProductList: function() {
    var that = this;
    this.setData({ loading: true });

    setTimeout(function() {
      var options = {};
      if (that.data.currentCategory !== '全部') {
        options.category = that.data.currentCategory;
      }
      if (that.data.currentSort !== 'default') {
        options.sortBy = that.data.currentSort;
      }

      var list = mockData.getShopProductList(options);
      
      if (that.data.searchKeyword) {
        var keyword = that.data.searchKeyword.toLowerCase();
        list = list.filter(function(p) {
          return p.productName.toLowerCase().indexOf(keyword) > -1 ||
                 p.subtitle.toLowerCase().indexOf(keyword) > -1;
        });
      }

      that.setData({
        productList: list,
        loading: false
      });
    }, 500);
  },

  refreshCartCount: function() {
    var count = shop.getCartCount();
    this.setData({ cartCount: count });
  },

  onCategoryTap: function(e) {
    var category = e.currentTarget.dataset.category;
    this.setData({ currentCategory: category });
    this.loadProductList();
  },

  onSortTap: function(e) {
    var sort = e.currentTarget.dataset.sort;
    this.setData({ currentSort: sort });
    this.loadProductList();
  },

  onSearchInput: function(e) {
    this.setData({ searchKeyword: e.detail.value });
  },

  onSearchConfirm: function() {
    this.loadProductList();
  },

  onProductTap: function(e) {
    var traceId = e.currentTarget.dataset.traceid;
    wx.navigateTo({
      url: '/pages/shop/detail?traceId=' + traceId
    });
  },

  onAddToCartTap: function(e) {
    e.stopPropagation && e.stopPropagation();
    var traceId = e.currentTarget.dataset.traceid;
    this.setData({
      selectedTraceId: traceId,
      showSkuSelector: true
    });
  },

  onSkuClose: function() {
    this.setData({ showSkuSelector: false });
  },

  onSkuAddCart: function(e) {
    var detail = e.detail;
    var result = shop.addToCart(detail);
    
    if (result.success) {
      wx.showToast({ title: '已加入购物车', icon: 'success' });
      this.refreshCartCount();
    } else {
      wx.showToast({ title: result.msg || '加入失败', icon: 'none' });
    }
  },

  onSkuBuyNow: function(e) {
    var detail = e.detail;
    wx.navigateTo({
      url: '/pages/shop/detail?traceId=' + detail.traceId + '&buyNow=1&skuId=' + detail.skuId + '&quantity=' + detail.quantity
    });
  },

  onCartTap: function() {
    wx.switchTab({
      url: '/pages/shop/cart'
    });
  },

  onBannerChange: function(e) {
    this.setData({ currentBanner: e.detail.current });
  },

  onShareAppMessage: function() {
    return {
      title: '一茶一品・桂花茶商城',
      path: '/pages/shop/list'
    };
  }
});
