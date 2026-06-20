var mockData = require('./mockData.js');
var channelTrace = require('./channelTrace.js');
var reviewTrust = require('./reviewTrust.js');

var NETWORK_STORES_KEY = 'authorized_network_stores';
var STORE_REVIEWS_KEY = 'authorized_store_reviews';
var STORE_VERIFY_KEY = 'authorized_store_verify_records';

var STORE_TYPE = {
  HOTEL: { key: 'hotel', label: '酒店', icon: '🏨', color: '#1890FF' },
  TEA_HOUSE: { key: 'tea_house', label: '茶馆', icon: '🍵', color: '#DAA520' },
  AIRPORT_VIP: { key: 'airport_vip', label: '机场贵宾厅', icon: '✈️', color: '#722ED1' }
};

var STORE_TYPE_MAP = {};
STORE_TYPE_MAP[STORE_TYPE.HOTEL.key] = STORE_TYPE.HOTEL;
STORE_TYPE_MAP[STORE_TYPE.TEA_HOUSE.key] = STORE_TYPE.TEA_HOUSE;
STORE_TYPE_MAP[STORE_TYPE.AIRPORT_VIP.key] = STORE_TYPE.AIRPORT_VIP;

var VERIFY_STATUS = {
  VERIFIED: { key: 'verified', label: '官方授权', icon: '✓', color: '#52C41A', bgColor: '#F6FFED' },
  PENDING: { key: 'pending', label: '待验证', icon: '⏳', color: '#FAAD14', bgColor: '#FFFBE6' },
  EXPIRED: { key: 'expired', label: '授权过期', icon: '⚠️', color: '#FF4D4F', bgColor: '#FFF2F0' },
  UNAUTHORIZED: { key: 'unauthorized', label: '未授权', icon: '✗', color: '#999999', bgColor: '#F5F5F5' }
};

function getStoreTypeInfo(typeKey) {
  return STORE_TYPE_MAP[typeKey] || null;
}

function getAllStoreTypes() {
  return [STORE_TYPE.HOTEL, STORE_TYPE.TEA_HOUSE, STORE_TYPE.AIRPORT_VIP];
}

function getAuthorizedStores() {
  try {
    var stores = wx.getStorageSync(NETWORK_STORES_KEY);
    if (stores && Array.isArray(stores) && stores.length > 0) {
      return stores;
    }
  } catch (e) {
    console.error('[AuthorizedNetwork] 获取授权网点失败:', e);
  }
  return mockData.getAuthorizedNetworkStores();
}

function saveAuthorizedStores(stores) {
  try {
    wx.setStorageSync(NETWORK_STORES_KEY, stores);
    return true;
  } catch (e) {
    console.error('[AuthorizedNetwork] 保存授权网点失败:', e);
    return false;
  }
}

function getStoreById(storeId) {
  var stores = getAuthorizedStores();
  for (var i = 0; i < stores.length; i++) {
    if (stores[i].id === storeId) return stores[i];
  }
  return null;
}

function getStoreByStoreCode(storeCode) {
  if (!storeCode) return null;
  var code = storeCode.trim();
  if (!code.startsWith('S-')) return null;
  var stores = getAuthorizedStores();
  for (var i = 0; i < stores.length; i++) {
    if (stores[i].storeCode === code) return stores[i];
  }
  return null;
}

function searchStores(keyword, filterType, filterCity) {
  var stores = getAuthorizedStores();
  var result = stores;

  if (keyword) {
    var kw = keyword.toLowerCase();
    result = result.filter(function(s) {
      return s.name.toLowerCase().indexOf(kw) > -1 ||
             s.address.toLowerCase().indexOf(kw) > -1 ||
             (s.tags && s.tags.some(function(t) { return t.toLowerCase().indexOf(kw) > -1; }));
    });
  }

  if (filterType) {
    result = result.filter(function(s) { return s.type === filterType; });
  }

  if (filterCity) {
    var city = filterCity.toLowerCase();
    result = result.filter(function(s) {
      return s.city && s.city.toLowerCase().indexOf(city) > -1;
    });
  }

  return result;
}

function getNearbyStores(lat, lng, radiusKm) {
  var stores = getAuthorizedStores();
  var radius = radiusKm || 50;

  var withDistance = stores.map(function(s) {
    var dist = calculateDistance(lat, lng, s.lat, s.lng);
    return Object.assign({}, s, { distance: dist, distanceText: formatDistance(dist) });
  });

  withDistance.sort(function(a, b) { return a.distance - b.distance; });

  return withDistance.filter(function(s) { return s.distance <= radius; });
}

function calculateDistance(lat1, lng1, lat2, lng2) {
  var rad = Math.PI / 180;
  var dLat = (lat2 - lat1) * rad;
  var dLng = (lng2 - lng1) * rad;
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(lat1 * rad) * Math.cos(lat2 * rad) *
          Math.sin(dLng / 2) * Math.sin(dLng / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return 6371 * c;
}

function formatDistance(km) {
  if (km < 1) {
    return Math.round(km * 1000) + 'm';
  }
  return km.toFixed(1) + 'km';
}

function getStoresForMap(stores) {
  return stores.map(function(s) {
    var typeInfo = getStoreTypeInfo(s.type);
    return {
      id: s.id,
      latitude: s.lat,
      longitude: s.lng,
      title: s.name,
      iconPath: '',
      width: 32,
      height: 32,
      callout: {
        content: (typeInfo ? typeInfo.icon + ' ' : '') + s.name,
        color: '#333333',
        fontSize: 12,
        borderRadius: 6,
        bgColor: '#FFFFFF',
        padding: 6,
        display: 'BYCLICK'
      }
    };
  });
}

function openStoreNavigation(store) {
  if (!store) return;
  wx.openLocation({
    latitude: store.lat,
    longitude: store.lng,
    name: store.name,
    address: store.address,
    scale: 16,
    success: function() {
      console.log('[AuthorizedNetwork] 打开导航成功:', store.name);
    },
    fail: function(err) {
      console.error('[AuthorizedNetwork] 打开导航失败:', err);
      wx.showToast({ title: '打开地图失败', icon: 'none' });
    }
  });
}

function verifyStoreSupply(storeCode) {
  var store = getStoreByStoreCode(storeCode);
  if (!store) {
    return {
      success: false,
      status: VERIFY_STATUS.UNAUTHORIZED,
      message: '该门店码未在授权网点中找到，请确认码是否正确'
    };
  }

  var now = Date.now();
  var authExpiry = store.authorizationExpiry ? new Date(store.authorizationExpiry).getTime() : Infinity;

  if (authExpiry < now) {
    return {
      success: false,
      status: VERIFY_STATUS.EXPIRED,
      store: store,
      message: '该网点授权已过期，请联系品牌方确认'
    };
  }

  recordStoreVerify(storeCode, store.id);

  return {
    success: true,
    status: VERIFY_STATUS.VERIFIED,
    store: store,
    batchRange: store.supplyBatchRange,
    message: '验证通过：' + store.name + ' 为官方授权供应网点'
  };
}

function verifyStoreCodeAndTrace(storeCode, traceId) {
  var storeResult = verifyStoreSupply(storeCode);
  if (!storeResult.success) {
    return storeResult;
  }

  var store = storeResult.store;
  var batchRange = store.supplyBatchRange;
  var isBatchAuthorized = true;

  if (traceId && batchRange && batchRange.length > 0) {
    var traceData = mockData.getTraceData(traceId);
    if (traceData && traceData.basicInfo && traceData.basicInfo.batchNo) {
      var batchNo = traceData.basicInfo.batchNo;
      isBatchAuthorized = batchRange.some(function(b) {
        return b === batchNo || batchNo.indexOf(b) === 0;
      });
    }
  }

  var divergenceResult = null;
  if (traceId) {
    divergenceResult = channelTrace.checkDivergence(traceId, store.address, store.city);
  }

  return {
    success: true,
    status: isBatchAuthorized ? VERIFY_STATUS.VERIFIED : VERIFY_STATUS.PENDING,
    store: store,
    batchRange: batchRange,
    isBatchAuthorized: isBatchAuthorized,
    divergenceCheck: divergenceResult,
    message: isBatchAuthorized
      ? '验证通过：' + store.name + ' 为该批次官方授权供应网点'
      : '该网点未授权供应此批次产品，请谨慎消费'
  };
}

function recordStoreVerify(storeCode, storeId) {
  try {
    var records = wx.getStorageSync(STORE_VERIFY_KEY) || {};
    records[storeCode] = {
      storeCode: storeCode,
      storeId: storeId,
      verifyTime: Date.now()
    };
    wx.setStorageSync(STORE_VERIFY_KEY, records);
  } catch (e) {
    console.error('[AuthorizedNetwork] 记录网点验证失败:', e);
  }
}

function getStoreVerifyRecord(storeCode) {
  try {
    var records = wx.getStorageSync(STORE_VERIFY_KEY) || {};
    return records[storeCode] || null;
  } catch (e) {
    return null;
  }
}

function getStoreReviews(storeId) {
  try {
    var allReviews = wx.getStorageSync(STORE_REVIEWS_KEY) || {};
    return allReviews[storeId] || [];
  } catch (e) {
    console.error('[AuthorizedNetwork] 获取网点评价失败:', e);
    return [];
  }
}

function saveStoreReviews(storeId, reviews) {
  try {
    var allReviews = wx.getStorageSync(STORE_REVIEWS_KEY) || {};
    allReviews[storeId] = reviews;
    wx.setStorageSync(STORE_REVIEWS_KEY, allReviews);
    return true;
  } catch (e) {
    console.error('[AuthorizedNetwork] 保存网点评价失败:', e);
    return false;
  }
}

function submitStoreReview(storeId, reviewData) {
  if (!storeId) return { success: false, error: '网点ID不能为空' };
  if (!reviewData || !reviewData.content || reviewData.content.trim().length < 5) {
    return { success: false, error: '评价内容至少5个字' };
  }
  if (!reviewData.rating || reviewData.rating < 1 || reviewData.rating > 5) {
    return { success: false, error: '请选择有效评分' };
  }

  var reviews = getStoreReviews(storeId);

  var hasReviewed = reviews.some(function(r) {
    return r.userId === reviewData.userId;
  });
  if (hasReviewed) {
    return { success: false, error: '您已评价过该网点' };
  }

  var review = {
    id: 'SR_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
    storeId: storeId,
    userId: reviewData.userId || 'anonymous',
    userName: reviewData.userName || '匿名用户',
    userAvatar: reviewData.userAvatar || '',
    rating: reviewData.rating,
    content: reviewData.content.trim(),
    images: reviewData.images || [],
    tags: reviewData.tags || [],
    isVerifiedPurchase: reviewData.isVerifiedPurchase || false,
    createTime: new Date().toISOString(),
    likeCount: 0,
    auditStatus: 'approved',
    reply: null
  };

  reviews.unshift(review);
  saveStoreReviews(storeId, reviews);

  return { success: true, review: review };
}

function likeStoreReview(storeId, reviewId) {
  var reviews = getStoreReviews(storeId);
  var found = false;
  for (var i = 0; i < reviews.length; i++) {
    if (reviews[i].id === reviewId) {
      reviews[i].likeCount = (reviews[i].likeCount || 0) + 1;
      found = true;
      break;
    }
  }
  if (found) {
    saveStoreReviews(storeId, reviews);
    return { success: true };
  }
  return { success: false, error: '评价不存在' };
}

function getStoreRatingSummary(storeId) {
  var reviews = getStoreReviews(storeId);
  var mockReviews = mockData.getStoreReviews(storeId);
  var allReviews = reviews.concat(mockReviews);

  if (allReviews.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    };
  }

  var totalRating = 0;
  var distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  allReviews.forEach(function(r) {
    totalRating += r.rating;
    if (distribution[r.rating] !== undefined) {
      distribution[r.rating]++;
    }
  });

  return {
    averageRating: Math.round(totalRating / allReviews.length * 10) / 10,
    totalReviews: allReviews.length,
    ratingDistribution: distribution
  };
}

function getAuthorizationStatus(store) {
  if (!store) return VERIFY_STATUS.UNAUTHORIZED;

  var now = Date.now();
  var authStart = store.authorizationStart ? new Date(store.authorizationStart).getTime() : 0;
  var authExpiry = store.authorizationExpiry ? new Date(store.authorizationExpiry).getTime() : Infinity;

  if (authStart > now) return VERIFY_STATUS.PENDING;
  if (authExpiry < now) return VERIFY_STATUS.EXPIRED;
  return VERIFY_STATUS.VERIFIED;
}

function getAuthorizationDisplay(store) {
  var status = getAuthorizationStatus(store);
  var channelFlow = null;

  if (store && store.storeCode) {
    var code = store.storeCode;
    if (code.startsWith('S-')) {
      var traceInfo = mockData.getTraceInfoByCode(code, 'store');
      if (traceInfo && traceInfo.traceId) {
        channelFlow = channelTrace.getDisplayChannelFlow(traceInfo.traceId);
      }
    }
  }

  return {
    status: status,
    channelFlow: channelFlow,
    isAuthorized: status.key === 'verified',
    authorizationLabel: status.key === 'verified' ? '官方授权供应网点' : status.label,
    complementaryTip: status.key === 'verified'
      ? '该网点为品牌官方授权合作点，供应产品来源可追溯，品质有保障'
      : '该网点授权状态异常，建议通过官方渠道购买'
  };
}

function getCityList() {
  var stores = getAuthorizedStores();
  var cityMap = {};
  stores.forEach(function(s) {
    if (s.city) {
      cityMap[s.city] = (cityMap[s.city] || 0) + 1;
    }
  });
  var cities = Object.keys(cityMap).map(function(city) {
    return { name: city, count: cityMap[city] };
  });
  cities.sort(function(a, b) { return b.count - a.count; });
  return cities;
}

function getStatsSummary() {
  var stores = getAuthorizedStores();
  var typeCount = {};
  var cityCount = {};
  var authorizedCount = 0;

  stores.forEach(function(s) {
    typeCount[s.type] = (typeCount[s.type] || 0) + 1;
    if (s.city) cityCount[s.city] = (cityCount[s.city] || 0) + 1;
    if (getAuthorizationStatus(s).key === 'verified') authorizedCount++;
  });

  return {
    totalStores: stores.length,
    authorizedCount: authorizedCount,
    typeCount: typeCount,
    cityCount: Object.keys(cityCount).length,
    cities: Object.keys(cityCount)
  };
}

module.exports = {
  STORE_TYPE: STORE_TYPE,
  STORE_TYPE_MAP: STORE_TYPE_MAP,
  VERIFY_STATUS: VERIFY_STATUS,
  getStoreTypeInfo: getStoreTypeInfo,
  getAllStoreTypes: getAllStoreTypes,
  getAuthorizedStores: getAuthorizedStores,
  saveAuthorizedStores: saveAuthorizedStores,
  getStoreById: getStoreById,
  getStoreByStoreCode: getStoreByStoreCode,
  searchStores: searchStores,
  getNearbyStores: getNearbyStores,
  calculateDistance: calculateDistance,
  formatDistance: formatDistance,
  getStoresForMap: getStoresForMap,
  openStoreNavigation: openStoreNavigation,
  verifyStoreSupply: verifyStoreSupply,
  verifyStoreCodeAndTrace: verifyStoreCodeAndTrace,
  recordStoreVerify: recordStoreVerify,
  getStoreVerifyRecord: getStoreVerifyRecord,
  getStoreReviews: getStoreReviews,
  submitStoreReview: submitStoreReview,
  likeStoreReview: likeStoreReview,
  getStoreRatingSummary: getStoreRatingSummary,
  getAuthorizationStatus: getAuthorizationStatus,
  getAuthorizationDisplay: getAuthorizationDisplay,
  getCityList: getCityList,
  getStatsSummary: getStatsSummary
};
