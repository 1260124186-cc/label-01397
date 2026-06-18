var auth = require('./auth.js');
var userStore = require('./userStore.js');

var SCAN_VERIFY_RECORDS_KEY = 'scan_verify_records';
var REVIEW_SUBMIT_HISTORY_KEY = 'review_submit_history';

var TRUST_LEVELS = {
  VERIFIED_PURCHASE: {
    key: 'verified_purchase',
    name: '已验真购买',
    weight: 10,
    icon: '✓',
    color: '#52C41A',
    bgColor: '#F6FFED',
    borderColor: '#B7EB8F'
  },
  REGULAR_PURCHASE: {
    key: 'regular_purchase',
    name: '普通购买',
    weight: 5,
    icon: '🛒',
    color: '#1890FF',
    bgColor: '#E6F7FF',
    borderColor: '#91D5FF'
  },
  ANONYMOUS: {
    key: 'anonymous',
    name: '匿名评价',
    weight: 1,
    icon: '👤',
    color: '#8C8C8C',
    bgColor: '#FAFAFA',
    borderColor: '#D9D9D9'
  }
};

var ANTI_SPAM_CONFIG = {
  MAX_REVIEWS_PER_TRACE: 1,
  RAPID_SUBMIT_WINDOW_MS: 5 * 60 * 1000,
  RAPID_SUBMIT_THRESHOLD: 3,
  CONTENT_MIN_LENGTH: 5,
  CONTENT_MAX_LENGTH: 1000
};

function getScanVerifyRecords() {
  try {
    return wx.getStorageSync(SCAN_VERIFY_RECORDS_KEY) || {};
  } catch (e) {
    console.error('[ReviewTrust] 获取扫码验证记录失败:', e);
    return {};
  }
}

function addScanVerifyRecord(traceId) {
  try {
    var records = getScanVerifyRecords();
    records[traceId] = {
      traceId: traceId,
      verifyTime: Date.now(),
      verified: true
    };
    wx.setStorageSync(SCAN_VERIFY_RECORDS_KEY, records);
    console.info('[ReviewTrust] 已记录扫码验证:', traceId);
    return records;
  } catch (e) {
    console.error('[ReviewTrust] 记录扫码验证失败:', e);
    return getScanVerifyRecords();
  }
}

function isScanVerified(traceId) {
  var records = getScanVerifyRecords();
  return !!(records[traceId] && records[traceId].verified);
}

function getReviewSubmitHistory() {
  try {
    return wx.getStorageSync(REVIEW_SUBMIT_HISTORY_KEY) || [];
  } catch (e) {
    console.error('[ReviewTrust] 获取评价提交历史失败:', e);
    return [];
  }
}

function addReviewSubmitRecord(traceId, reviewId) {
  try {
    var history = getReviewSubmitHistory();
    history.unshift({
      traceId: traceId,
      reviewId: reviewId,
      submitTime: Date.now(),
      openId: auth.getUserInfo()?.openid || 'anonymous'
    });
    if (history.length > 100) {
      history = history.slice(0, 100);
    }
    wx.setStorageSync(REVIEW_SUBMIT_HISTORY_KEY, history);
    console.info('[ReviewTrust] 已记录评价提交:', traceId, reviewId);
    return history;
  } catch (e) {
    console.error('[ReviewTrust] 记录评价提交失败:', e);
    return getReviewSubmitHistory();
  }
}

function hasSubmittedReview(traceId) {
  var history = getReviewSubmitHistory();
  var userInfo = auth.getUserInfo();
  var openId = userInfo?.openid || null;

  if (!openId) {
    return history.some(function(r) {
      return r.traceId === traceId && r.openId === 'anonymous';
    });
  }

  return history.some(function(r) {
    return r.traceId === traceId && r.openId === openId;
  });
}

function checkRapidSubmission() {
  var history = getReviewSubmitHistory();
  var now = Date.now();
  var windowStart = now - ANTI_SPAM_CONFIG.RAPID_SUBMIT_WINDOW_MS;

  var recentCount = history.filter(function(r) {
    return r.submitTime >= windowStart;
  }).length;

  return {
    isRapid: recentCount >= ANTI_SPAM_CONFIG.RAPID_SUBMIT_THRESHOLD,
    recentCount: recentCount,
    threshold: ANTI_SPAM_CONFIG.RAPID_SUBMIT_THRESHOLD,
    windowMinutes: ANTI_SPAM_CONFIG.RAPID_SUBMIT_WINDOW_MS / 60000
  };
}

function determineTrustLevel(traceId, userId, hasOrderInfo) {
  var isLoggedIn = !!userId || auth.isLoggedIn();
  var verified = isScanVerified(traceId);

  if (isLoggedIn && verified) {
    return TRUST_LEVELS.VERIFIED_PURCHASE;
  }

  if (isLoggedIn) {
    return TRUST_LEVELS.REGULAR_PURCHASE;
  }

  return TRUST_LEVELS.ANONYMOUS;
}

function calculateReviewQualityScore(review) {
  var baseScore = 0;
  var trustWeight = review.trustLevel?.weight || TRUST_LEVELS.ANONYMOUS.weight;

  baseScore += trustWeight * 5;

  if (review.images && review.images.length > 0) {
    baseScore += Math.min(review.images.length, 3) * 6;
  }

  var contentLength = (review.content || '').length;
  if (contentLength >= 50) {
    baseScore += 12;
  } else if (contentLength >= 20) {
    baseScore += 6;
  }

  if (review.tasteTags && review.tasteTags.length > 0) {
    baseScore += Math.min(review.tasteTags.length, 5) * 3;
  }

  if (review.dimensions) {
    var dimCount = Object.keys(review.dimensions).length;
    baseScore += dimCount * 2;
  }

  baseScore += Math.min((review.likeCount || 0), 30) * 0.5;

  if (review.isPinned) {
    baseScore += 20;
  }

  if (review.isQuality) {
    baseScore += 15;
  }

  if (review.auditStatus === 'approved') {
    baseScore += 5;
  } else if (review.auditStatus === 'pending') {
    baseScore -= 5;
  }

  return Math.max(0, Math.min(100, Math.round(baseScore)));
}

function sortReviewsByTrust(reviews, sortBy) {
  if (!reviews || !Array.isArray(reviews)) {
    return [];
  }

  var sorted = reviews.slice();

  switch (sortBy) {
    case 'quality':
      sorted.sort(function(a, b) {
        var scoreA = calculateReviewQualityScore(a);
        var scoreB = calculateReviewQualityScore(b);
        if (scoreB !== scoreA) {
          return scoreB - scoreA;
        }
        return new Date(b.createTime) - new Date(a.createTime);
      });
      break;

    case 'trust':
      sorted.sort(function(a, b) {
        var weightA = a.trustLevel?.weight || 0;
        var weightB = b.trustLevel?.weight || 0;
        if (weightB !== weightA) {
          return weightB - weightA;
        }
        return new Date(b.createTime) - new Date(a.createTime);
      });
      break;

    case 'newest':
      sorted.sort(function(a, b) {
        return new Date(b.createTime) - new Date(a.createTime);
      });
      break;

    case 'highest':
      sorted.sort(function(a, b) {
        if (b.rating !== a.rating) {
          return b.rating - a.rating;
        }
        return new Date(b.createTime) - new Date(a.createTime);
      });
      break;

    default:
      sorted.sort(function(a, b) {
        var scoreA = calculateReviewQualityScore(a);
        var scoreB = calculateReviewQualityScore(b);
        if (scoreB !== scoreA) {
          return scoreB - scoreA;
        }
        return new Date(b.createTime) - new Date(a.createTime);
      });
  }

  return sorted;
}

function validateReviewSubmission(traceId, content, rating) {
  var errors = [];
  var warnings = [];

  if (!content || content.trim().length < ANTI_SPAM_CONFIG.CONTENT_MIN_LENGTH) {
    errors.push('评价内容至少' + ANTI_SPAM_CONFIG.CONTENT_MIN_LENGTH + '个字');
  }

  if (content && content.length > ANTI_SPAM_CONFIG.CONTENT_MAX_LENGTH) {
    errors.push('评价内容不能超过' + ANTI_SPAM_CONFIG.CONTENT_MAX_LENGTH + '个字');
  }

  if (!rating || rating < 1 || rating > 5) {
    errors.push('请选择有效的评分');
  }

  if (hasSubmittedReview(traceId)) {
    errors.push('您已对该产品发表过评价');
  }

  var rapidCheck = checkRapidSubmission();
  if (rapidCheck.isRapid) {
    warnings.push({
      type: 'rapid_submission',
      message: '短时间内评价次数过多，本次评价将进入人工审核',
      needAudit: true
    });
  }

  var sensitiveWords = ['广告', '推销', '联系方式', '微信', '电话', 'qq'];
  var lowerContent = (content || '').toLowerCase();
  for (var i = 0; i < sensitiveWords.length; i++) {
    if (lowerContent.indexOf(sensitiveWords[i]) > -1) {
      warnings.push({
        type: 'sensitive_content',
        message: '评价内容包含敏感词，将进入人工审核',
        needAudit: true
      });
      break;
    }
  }

  return {
    valid: errors.length === 0,
    errors: errors,
    warnings: warnings,
    needAudit: warnings.some(function(w) { return w.needAudit; })
  };
}

function calculateWeightedRating(reviews) {
  if (!reviews || reviews.length === 0) {
    return 0;
  }

  var totalWeight = 0;
  var weightedSum = 0;

  reviews.forEach(function(review) {
    if (review.auditStatus === 'rejected') {
      return;
    }
    var weight = review.trustLevel?.weight || TRUST_LEVELS.ANONYMOUS.weight;
    totalWeight += weight;
    weightedSum += review.rating * weight;
  });

  if (totalWeight === 0) {
    return 0;
  }

  return Math.round((weightedSum / totalWeight) * 10) / 10;
}

function prepareReviewForDisplay(review, currentUserId) {
  if (!review) return null;

  var displayReview = Object.assign({}, review);

  if (!displayReview.trustLevel) {
    displayReview.trustLevel = determineTrustLevel(
      review.traceId,
      review.userId,
      !!review.orderInfo
    );
  }

  displayReview.qualityScore = calculateReviewQualityScore(displayReview);

  displayReview.showTrustBadge = displayReview.trustLevel.key === 'verified_purchase';

  if (displayReview.brandReply) {
    displayReview.brandReply.timeText = formatTime(displayReview.brandReply.replyTime);
  }

  displayReview.timeText = formatTime(displayReview.createTime);

  return displayReview;
}

function formatTime(timestamp) {
  if (!timestamp) return '';
  var date;
  if (typeof timestamp === 'string') {
    date = new Date(timestamp.replace(/-/g, '/'));
  } else {
    date = new Date(timestamp);
  }
  var now = new Date();
  var diff = now - date;
  var minutes = Math.floor(diff / 60000);
  var hours = Math.floor(diff / 3600000);
  var days = Math.floor(diff / 86400000);

  if (minutes < 1) return '刚刚';
  if (minutes < 60) return minutes + '分钟前';
  if (hours < 24) return hours + '小时前';
  if (days < 7) return days + '天前';

  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  if (year === now.getFullYear()) {
    return month + '月' + day + '日';
  }
  return year + '年' + month + '月' + day + '日';
}

function createBrandReply(reviewId, content) {
  return {
    replyId: 'BR-' + Date.now(),
    reviewId: reviewId,
    content: content,
    replyTime: Date.now(),
    replierName: '官方客服',
    replierAvatar: '',
    isOfficial: true
  };
}

function convertTastingNoteToReview(note, traceId) {
  if (!note) return null;

  var dimensions = {};
  if (note.rating) {
    dimensions.aroma = note.rating;
    dimensions.taste = note.rating;
    dimensions.value = note.rating;
  }

  return {
    traceId: traceId,
    rating: note.rating || 5,
    dimensions: dimensions,
    tasteTags: note.tags || [],
    content: note.content || '',
    images: note.images || [],
    fromNote: true,
    noteId: note.id,
    noteCreateTime: note.createTime
  };
}

function convertNoteToReviewPreview(note, traceId) {
  if (!note) return null;

  var baseReview = convertTastingNoteToReview(note, traceId);
  var userId = auth.getUserInfo()?.userId || 'U001';
  var trustLevel = determineTrustLevel(traceId, userId, false);

  var dimensions = {
    aroma: baseReview.rating,
    taste: baseReview.rating,
    value: baseReview.rating
  };

  var aromaTags = ['花香', '浓香', '清香', '果香', '蜜香'];
  var tasteTags = ['回甘', '醇厚', '清甜', '鲜爽', '余韵', '柔和'];

  if (note.tags) {
    note.tags.forEach(function(tag) {
      if (aromaTags.indexOf(tag) > -1) {
        dimensions.aroma = Math.min(5, baseReview.rating + 1);
      }
      if (tasteTags.indexOf(tag) > -1) {
        dimensions.taste = Math.min(5, baseReview.rating + 1);
      }
    });
  }

  return {
    rating: baseReview.rating,
    dimensions: dimensions,
    tasteTags: baseReview.tasteTags,
    content: baseReview.content,
    trustLevel: trustLevel,
    isScanVerified: trustLevel.key === 'verified_purchase'
  };
}

module.exports = {
  TRUST_LEVELS: TRUST_LEVELS,
  ANTI_SPAM_CONFIG: ANTI_SPAM_CONFIG,
  getScanVerifyRecords: getScanVerifyRecords,
  addScanVerifyRecord: addScanVerifyRecord,
  isScanVerified: isScanVerified,
  getReviewSubmitHistory: getReviewSubmitHistory,
  addReviewSubmitRecord: addReviewSubmitRecord,
  hasSubmittedReview: hasSubmittedReview,
  checkRapidSubmission: checkRapidSubmission,
  determineTrustLevel: determineTrustLevel,
  calculateReviewQualityScore: calculateReviewQualityScore,
  sortReviewsByTrust: sortReviewsByTrust,
  validateReviewSubmission: validateReviewSubmission,
  calculateWeightedRating: calculateWeightedRating,
  prepareReviewForDisplay: prepareReviewForDisplay,
  formatTime: formatTime,
  createBrandReply: createBrandReply,
  convertTastingNoteToReview: convertTastingNoteToReview,
  convertNoteToReviewPreview: convertNoteToReviewPreview
};
