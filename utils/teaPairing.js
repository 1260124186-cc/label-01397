/**
 * 茶食搭配与场景化推荐工具模块
 * 功能：品种搭配推荐、节日礼盒、个性化推荐、UGC 管理、一键加购
 */

var mockData = require('./mockData.js');

// ==================== 品种搭配推荐 ====================

function getPairingByVariety(varietyKey) {
  return mockData.getTeaPairing(varietyKey);
}

function getPairingByTraceId(traceId) {
  return mockData.getTeaPairingByTraceId(traceId);
}

function getAllVarietyPairings() {
  return mockData.getAllTeaPairings();
}

function getVarietyPairingIntro(varietyKey) {
  var pairing = getPairingByVariety(varietyKey);
  if (!pairing) return null;
  return {
    varietyName: pairing.varietyName,
    tagline: pairing.tagline,
    pairingIntro: pairing.pairingIntro,
    pairingReason: pairing.pairingReason,
    expertComment: pairing.expertComment,
    themeColor: pairing.themeColor,
    themeBg: pairing.themeBg,
    icon: pairing.icon
  };
}

// ==================== 节日礼盒模块 ====================

function getFestivalInfo(festivalKey) {
  return mockData.getFestivalGiftBox(festivalKey);
}

function getAllFestivals() {
  return mockData.getAllFestivalGiftBoxes();
}

function getGiftBoxDetail(boxId) {
  var box = mockData.getGiftBoxById(boxId);
  if (!box) return null;
  var totalOriginal = 0;
  var includes = box.includes || [];
  for (var i = 0; i < includes.length; i++) {
    var item = includes[i];
    if (item.traceId) {
      var product = mockData.getShopProduct(item.traceId);
      if (product && product.skuList) {
        for (var j = 0; j < product.skuList.length; j++) {
          if (product.skuList[j].skuId === item.skuId) {
            totalOriginal += product.skuList[j].price * (item.quantity || 1);
            break;
          }
        }
      }
    } else if (item.foodId) {
      var food = mockData.getFoodProduct(item.foodId);
      if (food) {
        totalOriginal += food.price * (item.quantity || 1);
      }
    } else if (item.type === 'mooncake') {
      totalOriginal += 15 * (item.quantity || 1);
    } else if (item.type === 'snack') {
      totalOriginal += 68 * (item.quantity || 1);
    } else if (item.type === 'teaware') {
      totalOriginal += 198 * (item.quantity || 1);
    } else if (item.type === 'cultural') {
      totalOriginal += 58 * (item.quantity || 1);
    }
  }
  box.calculatedOriginal = Math.round(totalOriginal * 100) / 100;
  box.savings = Math.round((totalOriginal - box.price) * 100) / 100;
  box.discountPercent = Math.round((1 - box.price / totalOriginal) * 100);
  return box;
}

function getCurrentFestivalRecommendations() {
  var now = new Date();
  var month = now.getMonth() + 1;
  var day = now.getDate();
  var festivals = getAllFestivals();
  var result = {
    current: null,
    upcoming: [],
    all: festivals
  };

  var i;
  if (month === 9 || month === 10) {
    for (i = 0; i < festivals.length; i++) {
      if (festivals[i].festivalKey === 'mid-autumn') {
        result.current = festivals[i];
        break;
      }
    }
  } else if (month === 1 || month === 2) {
    for (i = 0; i < festivals.length; i++) {
      if (festivals[i].festivalKey === 'spring-festival') {
        result.current = festivals[i];
        break;
      }
    }
  }

  if (!result.current) {
    result.current = festivals[0];
  }

  var currentKey = result.current ? result.current.festivalKey : '';
  for (i = 0; i < festivals.length; i++) {
    if (festivals[i].festivalKey !== currentKey) {
      result.upcoming.push(festivals[i]);
    }
  }

  return result;
}

// ==================== 个性化推荐模块 ====================

function getPreferenceQuestions() {
  return mockData.getPreferenceQuestions();
}

function saveUserAnswers(answers) {
  var preference = {};
  for (var i = 0; i < answers.length; i++) {
    preference[answers[i].questionId] = answers[i].selectedKey;
  }
  return mockData.saveUserPreference(preference);
}

function getUserAnswers() {
  return mockData.getUserPreference();
}

function hasUserPreference() {
  return !!mockData.getUserPreference();
}

function clearUserPreference() {
  try {
    wx.removeStorageSync('user_tea_preference');
    return true;
  } catch (e) {
    return false;
  }
}

function getRecommendations() {
  return mockData.getPersonalizedRecommendations();
}

function getSmartPairingForScene(sceneKey) {
  var pairings = getAllVarietyPairings();
  var result = {
    pairings: [],
    giftBoxes: [],
    suggestion: ''
  };

  switch (sceneKey) {
    case 'office':
      result.pairings = pairings.filter(function(p) {
        return p.varietyKey === 'si-ji-gui' || p.varietyKey === 'yin-gui';
      });
      result.suggestion = '办公场景推荐气味清新淡雅的茶品，避免浓香影响同事';
      break;
    case 'afternoon':
      result.pairings = pairings.filter(function(p) {
        return p.varietyKey === 'jin-gui' || p.varietyKey === 'dan-gui';
      });
      result.giftBoxes = mockData.getAllGiftBoxesFlat().slice(0, 2);
      result.suggestion = '下午茶时光，浓香配甜点，与朋友共享美好时光';
      break;
    case 'home':
      result.pairings = pairings;
      result.suggestion = '居家日常，根据家人口味自由选择搭配';
      break;
    case 'gift':
      result.giftBoxes = mockData.getAllGiftBoxesFlat();
      result.suggestion = '送礼选择精美礼盒，体面大气有档次';
      break;
    default:
      result.pairings = pairings;
      result.suggestion = '根据个人喜好自由搭配';
  }

  return result;
}

// ==================== UGC 用户内容模块 ====================

function getAllUgcPosts(options) {
  return mockData.getUgcPosts(options);
}

function getHotUgcPosts(limit) {
  var posts = mockData.getUgcPosts({ sortBy: 'hot' });
  limit = limit || 4;
  return posts.slice(0, limit);
}

function getUgcPostDetail(postId) {
  return mockData.getUgcPost(postId);
}

function publishUgcPost(postData) {
  if (!postData) return { success: false, msg: '参数错误' };
  if (!postData.images || postData.images.length === 0) {
    return { success: false, msg: '请至少上传一张照片' };
  }
  if (!postData.content || postData.content.trim().length === 0) {
    return { success: false, msg: '请写下您的搭配心得' };
  }
  var post = mockData.addUgcPost(postData);
  return { success: true, post: post };
}

function toggleLikeUgcPost(postId) {
  var result = mockData.likeUgcPost(postId);
  if (result) {
    return { success: true, post: result };
  }
  return { success: false, msg: '帖子不存在' };
}

function shareUgcPost(postId) {
  var posts = mockData.getUgcPosts();
  for (var i = 0; i < posts.length; i++) {
    if (posts[i].postId === postId) {
      posts[i].shares++;
      try {
        wx.setStorageSync('ugc_posts', posts);
      } catch (e) {
        console.error('[UGC] 保存分享失败:', e);
      }
      return { success: true, post: posts[i] };
    }
  }
  return { success: false, msg: '帖子不存在' };
}

function chooseUgcImages() {
  return new Promise(function(resolve, reject) {
    wx.chooseMedia({
      count: 9,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      sizeType: ['compressed'],
      success: function(res) {
        var tempFiles = res.tempFiles || [];
        var paths = tempFiles.map(function(f) { return f.tempFilePath; });
        resolve(paths);
      },
      fail: function(err) {
        if (err.errMsg && err.errMsg.indexOf('cancel') === -1) {
          reject(err);
        } else {
          resolve([]);
        }
      }
    });
  });
}

// ==================== 一键加购模块 ====================

function addVarietyPairingToCart(varietyKey, teaTraceId, teaSkuId, foodIds) {
  if (!teaTraceId && varietyKey) {
    var traceMap = {
      'jin-gui': 'G001',
      'yin-gui': 'G002',
      'dan-gui': 'G003',
      'si-ji-gui': 'G004'
    };
    teaTraceId = traceMap[varietyKey];
  }
  if (!teaSkuId && teaTraceId) {
    var product = mockData.getShopProduct(teaTraceId);
    if (product && product.skuList && product.skuList.length > 0) {
      teaSkuId = product.skuList[product.defaultSkuIndex || 0].skuId;
    }
  }
  if (!foodIds && varietyKey) {
    var pairing = mockData.getTeaPairing(varietyKey);
    if (pairing) {
      foodIds = pairing.recommendedFoods.slice(0, 2);
    }
  }

  var result = mockData.addPairingToCart({
    traceId: teaTraceId,
    skuId: teaSkuId,
    teaQuantity: 1,
    foodIds: foodIds || [],
    foodQuantities: foodIds ? foodIds.map(function() { return 1; }) : []
  });

  return result;
}

function addGiftBoxToCart(boxId, quantity) {
  var result = mockData.addPairingToCart({
    giftBoxId: boxId,
    boxQuantity: quantity || 1
  });
  return result;
}

function addSingleFoodToCart(foodId, quantity) {
  var result = mockData.addPairingToCart({
    foodIds: [foodId],
    foodQuantities: [quantity || 1]
  });
  return result;
}

function addCustomPairingToCart(traceId, skuId, foodIds, quantities) {
  var result = mockData.addPairingToCart({
    traceId: traceId,
    skuId: skuId,
    teaQuantity: 1,
    foodIds: foodIds || [],
    foodQuantities: quantities || (foodIds ? foodIds.map(function() { return 1; }) : [])
  });
  return result;
}

// ==================== 计算搭配总价 ====================

function calculatePairingPrice(traceId, skuId, foodIds, isMember) {
  var total = 0;
  var memberTotal = 0;
  var items = [];

  if (traceId && skuId) {
    var product = mockData.getShopProduct(traceId);
    if (product) {
      var sku = mockData.getSkuById(traceId, skuId);
      if (sku) {
        total += sku.price;
        memberTotal += sku.memberPrice;
        items.push({
          type: 'tea',
          name: product.productName,
          spec: sku.specValues.join('/'),
          price: sku.price,
          memberPrice: sku.memberPrice
        });
      }
    }
  }

  if (foodIds && foodIds.length > 0) {
    for (var i = 0; i < foodIds.length; i++) {
      var food = mockData.getFoodProduct(foodIds[i]);
      if (food) {
        total += food.price;
        memberTotal += food.memberPrice;
        items.push({
          type: 'food',
          name: food.name,
          spec: food.spec,
          price: food.price,
          memberPrice: food.memberPrice
        });
      }
    }
  }

  return {
    items: items,
    totalPrice: Math.round(total * 100) / 100,
    memberPrice: Math.round(memberTotal * 100) / 100,
    savings: Math.round((total - memberTotal) * 100) / 100
  };
}

// ==================== 智能推荐：根据溯源ID获取完整搭配方案 ====================

function getFullPairingPlan(traceId) {
  var traceData = mockData.getTraceData(traceId);
  if (!traceData) return null;

  var variety = traceData.osmanthusInfo ? traceData.osmanthusInfo.variety : '';
  var pairing = getPairingByTraceId(traceId);
  var product = mockData.getShopProduct(traceId);

  return {
    traceId: traceId,
    productName: traceData.basicInfo ? traceData.basicInfo.productName : '',
    thumbnail: traceData.basicInfo ? traceData.basicInfo.thumbnail : '',
    variety: variety,
    pairing: pairing,
    product: product,
    relatedUgcs: mockData.getUgcPosts({ variety: variety }).slice(0, 3)
  };
}

module.exports = {
  getPairingByVariety: getPairingByVariety,
  getPairingByTraceId: getPairingByTraceId,
  getAllVarietyPairings: getAllVarietyPairings,
  getVarietyPairingIntro: getVarietyPairingIntro,
  getFestivalInfo: getFestivalInfo,
  getAllFestivals: getAllFestivals,
  getGiftBoxDetail: getGiftBoxDetail,
  getCurrentFestivalRecommendations: getCurrentFestivalRecommendations,
  getPreferenceQuestions: getPreferenceQuestions,
  saveUserAnswers: saveUserAnswers,
  getUserAnswers: getUserAnswers,
  hasUserPreference: hasUserPreference,
  clearUserPreference: clearUserPreference,
  getRecommendations: getRecommendations,
  getSmartPairingForScene: getSmartPairingForScene,
  getAllUgcPosts: getAllUgcPosts,
  getHotUgcPosts: getHotUgcPosts,
  getUgcPostDetail: getUgcPostDetail,
  publishUgcPost: publishUgcPost,
  toggleLikeUgcPost: toggleLikeUgcPost,
  shareUgcPost: shareUgcPost,
  chooseUgcImages: chooseUgcImages,
  addVarietyPairingToCart: addVarietyPairingToCart,
  addGiftBoxToCart: addGiftBoxToCart,
  addSingleFoodToCart: addSingleFoodToCart,
  addCustomPairingToCart: addCustomPairingToCart,
  calculatePairingPrice: calculatePairingPrice,
  getFullPairingPlan: getFullPairingPlan
};
