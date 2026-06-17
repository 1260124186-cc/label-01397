/**
 * 商城工具模块
 * 功能：购物车管理、优惠券管理、订单管理、价格计算
 */

var mockData = require('./mockData.js');

var CART_KEY = 'shop_cart';
var COUPON_KEY = 'user_coupons';
var ORDER_KEY = 'user_orders';

// ==================== 购物车管理 ====================

function getCart() {
  try {
    var cart = wx.getStorageSync(CART_KEY);
    return Array.isArray(cart) ? cart : [];
  } catch (e) {
    console.error('[Shop] 获取购物车失败:', e);
    return [];
  }
}

function saveCart(cart) {
  try {
    wx.setStorageSync(CART_KEY, cart);
    return true;
  } catch (e) {
    console.error('[Shop] 保存购物车失败:', e);
    return false;
  }
}

function addToCart(item) {
  if (!item || !item.traceId || !item.skuId) {
    return { success: false, msg: '参数错误' };
  }

  var cart = getCart();
  var foundIndex = -1;

  for (var i = 0; i < cart.length; i++) {
    if (cart[i].skuId === item.skuId) {
      foundIndex = i;
      break;
    }
  }

  if (foundIndex >= 0) {
    cart[foundIndex].quantity += item.quantity || 1;
  } else {
    var product = mockData.getShopProduct(item.traceId);
    var sku = mockData.getSkuById(item.traceId, item.skuId);
    
    if (!product || !sku) {
      return { success: false, msg: '商品信息不存在' };
    }

    var newItem = {
      id: 'cart_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      traceId: item.traceId,
      skuId: item.skuId,
      productName: product.productName,
      subtitle: product.subtitle,
      specValues: sku.specValues,
      price: sku.price,
      memberPrice: sku.memberPrice,
      quantity: item.quantity || 1,
      thumbnail: product.thumbnail,
      stock: sku.stock,
      selected: true,
      addTime: Date.now()
    };
    cart.unshift(newItem);
  }

  saveCart(cart);
  return { success: true, cart: cart };
}

function updateCartQuantity(cartItemId, quantity) {
  var cart = getCart();
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id === cartItemId) {
      if (quantity <= 0) {
        cart.splice(i, 1);
      } else {
        cart[i].quantity = quantity;
      }
      saveCart(cart);
      return { success: true, cart: cart };
    }
  }
  return { success: false, msg: '购物车项不存在' };
}

function removeFromCart(cartItemId) {
  var cart = getCart();
  var filtered = cart.filter(function(item) { return item.id !== cartItemId; });
  saveCart(filtered);
  return { success: true, cart: filtered };
}

function toggleCartItemSelect(cartItemId) {
  var cart = getCart();
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id === cartItemId) {
      cart[i].selected = !cart[i].selected;
      saveCart(cart);
      return { success: true, cart: cart };
    }
  }
  return { success: false, msg: '购物车项不存在' };
}

function toggleAllCartItems(selected) {
  var cart = getCart();
  for (var i = 0; i < cart.length; i++) {
    cart[i].selected = selected;
  }
  saveCart(cart);
  return { success: true, cart: cart };
}

function clearCart() {
  saveCart([]);
  return { success: true };
}

function getCartCount() {
  var cart = getCart();
  var count = 0;
  for (var i = 0; i < cart.length; i++) {
    count += cart[i].quantity;
  }
  return count;
}

function getCartSummary(isMember) {
  var cart = getCart();
  return mockData.calculateCartSummary(cart, isMember);
}

// ==================== 优惠券管理 ====================

function getUserCoupons() {
  try {
    var coupons = wx.getStorageSync(COUPON_KEY);
    if (Array.isArray(coupons) && coupons.length > 0) {
      return coupons;
    }
    
    var availableCoupons = mockData.getAvailableCoupons();
    var userCoupons = availableCoupons.slice(0, 3).map(function(coupon, index) {
      return {
        id: coupon.id,
        name: coupon.name,
        type: coupon.type,
        value: coupon.value,
        minAmount: coupon.minAmount,
        desc: coupon.desc,
        tag: coupon.tag,
        tagColor: coupon.tagColor,
        status: 'unused',
        receiveTime: Date.now() - index * 86400000,
        expireTime: Date.now() + coupon.expireDays * 86400000
      };
    });
    
    wx.setStorageSync(COUPON_KEY, userCoupons);
    return userCoupons;
  } catch (e) {
    console.error('[Shop] 获取用户优惠券失败:', e);
    return [];
  }
}

function getAvailableCoupons(totalAmount) {
  var coupons = getUserCoupons();
  var now = Date.now();
  return coupons.filter(function(c) {
    return c.status === 'unused' && c.expireTime > now && c.minAmount <= totalAmount;
  });
}

function useCoupon(couponId) {
  var coupons = getUserCoupons();
  for (var i = 0; i < coupons.length; i++) {
    if (coupons[i].id === couponId && coupons[i].status === 'unused') {
      coupons[i].status = 'used';
      coupons[i].useTime = Date.now();
      try {
        wx.setStorageSync(COUPON_KEY, coupons);
      } catch (e) {
        console.error('[Shop] 保存优惠券失败:', e);
      }
      return { success: true, coupon: coupons[i] };
    }
  }
  return { success: false, msg: '优惠券不存在或已使用' };
}

function calculateCouponDiscount(coupon, totalAmount) {
  if (!coupon) return 0;
  
  if (totalAmount < coupon.minAmount) {
    return 0;
  }
  
  if (coupon.type === 'cash') {
    return coupon.value;
  } else if (coupon.type === 'discount') {
    return Math.round(totalAmount * (1 - coupon.value) * 100) / 100;
  }
  
  return 0;
}

// ==================== 订单管理 ====================

function getOrders() {
  try {
    var orders = wx.getStorageSync(ORDER_KEY);
    if (Array.isArray(orders) && orders.length > 0) {
      return orders;
    }
    
    var mockOrders = mockData.getMockOrders();
    wx.setStorageSync(ORDER_KEY, mockOrders);
    return mockOrders;
  } catch (e) {
    console.error('[Shop] 获取订单失败:', e);
    return [];
  }
}

function getOrder(orderId) {
  var orders = getOrders();
  for (var i = 0; i < orders.length; i++) {
    if (orders[i].orderId === orderId) {
      return orders[i];
    }
  }
  return null;
}

function createOrder(orderData) {
  var orders = getOrders();
  var orderId = 'ORD' + Date.now();
  var orderNo = new Date().getFullYear().toString() +
    ('0' + (new Date().getMonth() + 1)).slice(-2) +
    ('0' + new Date().getDate()).slice(-2) +
    Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  
  var newOrder = {
    orderId: orderId,
    orderNo: orderNo,
    status: 'pending',
    statusText: '待支付',
    createTime: new Date().toLocaleString('zh-CN'),
    payTime: null,
    deliverTime: null,
    receiveTime: null,
    totalAmount: orderData.totalAmount,
    payAmount: orderData.payAmount,
    freight: orderData.freight || 0,
    discount: orderData.discount || 0,
    couponDiscount: orderData.couponDiscount || 0,
    promotionDiscount: orderData.promotionDiscount || 0,
    memberDiscount: orderData.memberDiscount || 0,
    items: orderData.items,
    address: orderData.address,
    logistics: null,
    couponId: orderData.couponId || null,
    traceability: {
      hasTrace: true,
      totalItems: orderData.items.length,
      verifiedItems: 0
    }
  };
  
  orders.unshift(newOrder);
  
  try {
    wx.setStorageSync(ORDER_KEY, orders);
  } catch (e) {
    console.error('[Shop] 保存订单失败:', e);
  }
  
  return { success: true, order: newOrder };
}

function payOrder(orderId) {
  var orders = getOrders();
  for (var i = 0; i < orders.length; i++) {
    if (orders[i].orderId === orderId && orders[i].status === 'pending') {
      orders[i].status = 'paid';
      orders[i].statusText = '待发货';
      orders[i].payTime = new Date().toLocaleString('zh-CN');
      
      try {
        wx.setStorageSync(ORDER_KEY, orders);
      } catch (e) {
        console.error('[Shop] 保存订单失败:', e);
      }
      
      return { success: true, order: orders[i] };
    }
  }
  return { success: false, msg: '订单不存在或状态错误' };
}

function confirmReceive(orderId) {
  var orders = getOrders();
  for (var i = 0; i < orders.length; i++) {
    if (orders[i].orderId === orderId && orders[i].status === 'shipped') {
      orders[i].status = 'delivered';
      orders[i].statusText = '已收货';
      orders[i].receiveTime = new Date().toLocaleString('zh-CN');
      
      try {
        wx.setStorageSync(ORDER_KEY, orders);
      } catch (e) {
        console.error('[Shop] 保存订单失败:', e);
      }
      
      return { success: true, order: orders[i] };
    }
  }
  return { success: false, msg: '订单不存在或状态错误' };
}

// ==================== 价格计算 ====================

function calculateOrderPrice(items, options) {
  options = options || {};
  var isMember = options.isMember || false;
  var couponId = options.couponId || null;
  
  var goodsAmount = 0;
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    var price = isMember ? item.memberPrice : item.price;
    goodsAmount += price * item.quantity;
  }
  
  var promoResult = mockData.calculatePromotionDiscount(goodsAmount);
  var promotionDiscount = promoResult.discount;
  
  var couponDiscount = 0;
  var coupon = null;
  if (couponId) {
    var coupons = getUserCoupons();
    for (var j = 0; j < coupons.length; j++) {
      if (coupons[j].id === couponId && coupons[j].status === 'unused') {
        coupon = coupons[j];
        couponDiscount = calculateCouponDiscount(coupon, goodsAmount - promotionDiscount);
        break;
      }
    }
  }
  
  var freight = options.freight || 0;
  var totalAmount = goodsAmount - promotionDiscount - couponDiscount + freight;
  
  return {
    goodsAmount: Math.round(goodsAmount * 100) / 100,
    promotionDiscount: promotionDiscount,
    promotion: promoResult.promotion,
    couponDiscount: Math.round(couponDiscount * 100) / 100,
    coupon: coupon,
    freight: freight,
    totalAmount: Math.round(totalAmount * 100) / 100,
    payAmount: Math.round(totalAmount * 100) / 100
  };
}

// ==================== 订单溯源 ====================

function verifyOrderTrace(orderNo, traceCode) {
  var order = mockData.getOrderByNo(orderNo);
  if (!order) {
    return { success: false, msg: '订单不存在' };
  }
  
  var foundItem = null;
  for (var i = 0; i < order.items.length; i++) {
    if (order.items[i].traceCode === traceCode) {
      foundItem = order.items[i];
      break;
    }
  }
  
  if (!foundItem) {
    return { success: false, msg: '溯源码与订单不匹配' };
  }
  
  var traceData = mockData.getTraceData(foundItem.traceId);
  
  return {
    success: true,
    order: order,
    item: foundItem,
    traceData: traceData,
    verifyTime: new Date().toLocaleString('zh-CN'),
    isFirstVerify: order.traceability.verifiedItems === 0
  };
}

function getOrderTraceability(orderId) {
  var order = getOrder(orderId);
  if (!order) return null;
  
  var traceItems = order.items.map(function(item) {
    var traceData = mockData.getTraceData(item.traceId);
    return {
      traceId: item.traceId,
      skuId: item.skuId,
      productName: item.productName,
      specValues: item.specValues,
      batchNo: item.batchNo,
      traceCode: item.traceCode,
      verified: false,
      thumbnail: item.thumbnail,
      traceData: traceData
    };
  });
  
  return {
    orderId: order.orderId,
    orderNo: order.orderNo,
    status: order.status,
    statusText: order.statusText,
    items: traceItems,
    totalItems: traceItems.length,
    verifiedItems: 0
  };
}

module.exports = {
  getCart: getCart,
  addToCart: addToCart,
  updateCartQuantity: updateCartQuantity,
  removeFromCart: removeFromCart,
  toggleCartItemSelect: toggleCartItemSelect,
  toggleAllCartItems: toggleAllCartItems,
  clearCart: clearCart,
  getCartCount: getCartCount,
  getCartSummary: getCartSummary,
  getUserCoupons: getUserCoupons,
  getAvailableCoupons: getAvailableCoupons,
  useCoupon: useCoupon,
  calculateCouponDiscount: calculateCouponDiscount,
  getOrders: getOrders,
  getOrder: getOrder,
  createOrder: createOrder,
  payOrder: payOrder,
  confirmReceive: confirmReceive,
  calculateOrderPrice: calculateOrderPrice,
  verifyOrderTrace: verifyOrderTrace,
  getOrderTraceability: getOrderTraceability
};
