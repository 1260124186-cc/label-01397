var shop = require('../../../utils/shop.js');
var mockData = require('../../../utils/mockData.js');

Page({
  data: {
    cartItems: [],
    isMember: false,
    memberLevel: null,
    allSelected: false,
    cartSummary: null,
    editing: false,
    showCouponList: false,
    availableCoupons: [],
    selectedCoupon: null
  },

  onLoad: function() {
    this.checkMemberStatus();
  },

  onShow: function() {
    this.loadCartData();
  },

  checkMemberStatus: function() {
    var memberLevel = mockData.getMemberLevelByPoints(800);
    this.setData({
      isMember: memberLevel.level > 1,
      memberLevel: memberLevel
    });
  },

  loadCartData: function() {
    var cartItems = shop.getCart();
    var summary = shop.getCartSummary(this.data.isMember);
    
    var allSelected = cartItems.length > 0;
    for (var i = 0; i < cartItems.length; i++) {
      if (!cartItems[i].selected) {
        allSelected = false;
        break;
      }
    }

    this.setData({
      cartItems: cartItems,
      allSelected: allSelected,
      cartSummary: summary
    });
  },

  onSelectItem: function(e) {
    var id = e.currentTarget.dataset.id;
    shop.toggleCartItemSelect(id);
    this.loadCartData();
  },

  onSelectAll: function() {
    var allSelected = !this.data.allSelected;
    shop.toggleAllCartItems(allSelected);
    this.loadCartData();
  },

  onDecrease: function(e) {
    var id = e.currentTarget.dataset.id;
    var item = this.data.cartItems.find(function(i) { return i.id === id; });
    if (item && item.quantity > 1) {
      shop.updateCartQuantity(id, item.quantity - 1);
      this.loadCartData();
    }
  },

  onIncrease: function(e) {
    var id = e.currentTarget.dataset.id;
    var item = this.data.cartItems.find(function(i) { return i.id === id; });
    if (item && item.quantity < item.stock) {
      shop.updateCartQuantity(id, item.quantity + 1);
      this.loadCartData();
    } else {
      wx.showToast({ title: '库存不足', icon: 'none' });
    }
  },

  onDeleteItem: function(e) {
    var id = e.currentTarget.dataset.id;
    var that = this;
    
    wx.showModal({
      title: '删除商品',
      content: '确定将该商品从购物车移除吗？',
      success: function(res) {
        if (res.confirm) {
          shop.removeFromCart(id);
          that.loadCartData();
          wx.showToast({ title: '已删除', icon: 'success' });
        }
      }
    });
  },

  onToggleEdit: function() {
    this.setData({ editing: !this.data.editing });
  },

  onItemTap: function(e) {
    var traceId = e.currentTarget.dataset.traceid;
    wx.navigateTo({
      url: '/pages/shop/detail?traceId=' + traceId
    });
  },

  goToCoupons: function() {
    var coupons = shop.getAvailableCoupons(this.data.cartSummary ? this.data.cartSummary.goodsAmount : 0);
    this.setData({
      availableCoupons: coupons,
      showCouponList: true
    });
  },

  onCloseCoupons: function() {
    this.setData({ showCouponList: false });
  },

  onSelectCoupon: function(e) {
    var coupon = e.currentTarget.dataset.coupon;
    this.setData({
      selectedCoupon: coupon,
      showCouponList: false
    });
  },

  onCheckout: function() {
    var selectedItems = this.data.cartItems.filter(function(item) { return item.selected; });
    
    if (selectedItems.length === 0) {
      wx.showToast({ title: '请选择商品', icon: 'none' });
      return;
    }

    var priceResult = shop.calculateOrderPrice(selectedItems, {
      isMember: this.data.isMember,
      couponId: this.data.selectedCoupon ? this.data.selectedCoupon.id : null,
      freight: 0
    });

    wx.showModal({
      title: '确认订单',
      content: '共' + this.data.cartSummary.selectedCount + '件商品\n实付：¥' + priceResult.payAmount,
      confirmText: '提交订单',
      success: function(res) {
        if (res.confirm) {
          var orderResult = shop.createOrder({
            items: selectedItems,
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
            
            selectedItems.forEach(function(item) {
              shop.removeFromCart(item.id);
            });

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

  goShopping: function() {
    wx.switchTab({
      url: '/pages/shop/list'
    });
  },

  onShareAppMessage: function() {
    return {
      title: '一茶一品・桂花茶商城',
      path: '/pages/shop/list'
    };
  }
});
