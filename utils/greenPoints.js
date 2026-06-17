var GREEN_POINTS_KEY = 'green_points_data';
var SIGN_IN_KEY = 'sign_in_records';
var INVITE_DATA_KEY = 'invite_data';
var REDEMPTION_KEY = 'redemption_records';
var ACTIVITY_REG_KEY = 'activity_registrations';

function _getDefaultData() {
  return {
    totalPoints: 0,
    dailyEarned: {},
    history: []
  };
}

function _getTodayKey() {
  var d = new Date();
  return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
}

function getGreenPointsData() {
  try {
    var data = wx.getStorageSync(GREEN_POINTS_KEY);
    if (!data) return _getDefaultData();
    if (!data.dailyEarned) data.dailyEarned = {};
    if (!data.history) data.history = [];
    return data;
  } catch (e) {
    console.error('[GreenPoints] 获取积分数据失败:', e);
    return _getDefaultData();
  }
}

function getUserLevel(totalPoints) {
  var memberLevel = require('./mockData.js').getMemberLevelByPoints(totalPoints);
  var current = memberLevel.current;
  var nextLevel = memberLevel.nextLevel;
  return {
    level: current.level,
    name: current.name,
    icon: current.icon,
    color: current.color,
    benefits: current.benefits,
    currentPoints: totalPoints,
    nextLevel: nextLevel ? nextLevel.name : null,
    nextLevelPoints: nextLevel ? nextLevel.minPoints : null,
    nextLevelIcon: nextLevel ? nextLevel.icon : null,
    progress: memberLevel.progress
  };
}

function earnPoints(action, extraDesc) {
  try {
    var config = require('./mockData.js').getGreenPointsConfig();
    var rule = null;
    for (var i = 0; i < config.pointsRules.length; i++) {
      if (config.pointsRules[i].action === action) {
        rule = config.pointsRules[i];
        break;
      }
    }
    if (!rule) return { earned: 0, reason: '未知行为' };

    var data = getGreenPointsData();
    var todayKey = _getTodayKey();
    if (!data.dailyEarned) data.dailyEarned = {};
    var todayEarned = data.dailyEarned[todayKey] || {};
    var todayActionEarned = todayEarned[action] || 0;

    if (todayActionEarned >= rule.dailyLimit) {
      return { earned: 0, reason: '今日该行为积分已达上限' };
    }

    var canEarn = Math.min(rule.points, rule.dailyLimit - todayActionEarned);

    data.totalPoints += canEarn;
    todayEarned[action] = todayActionEarned + canEarn;
    data.dailyEarned[todayKey] = todayEarned;

    data.history.unshift({
      id: 'pts_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      action: action,
      desc: extraDesc || rule.desc,
      points: canEarn,
      type: 'earn',
      timestamp: Date.now()
    });

    if (data.history.length > 200) {
      data.history = data.history.slice(0, 200);
    }

    wx.setStorageSync(GREEN_POINTS_KEY, data);
    console.log('[GreenPoints] 获得积分:', canEarn, '行为:', action);
    return { earned: canEarn, totalPoints: data.totalPoints, reason: '' };
  } catch (e) {
    console.error('[GreenPoints] 积分计算失败:', e);
    return { earned: 0, reason: '积分计算失败' };
  }
}

function spendPoints(points, desc, actionType) {
  try {
    if (points <= 0) return { success: false, reason: '积分数量无效' };

    var data = getGreenPointsData();
    if (data.totalPoints < points) {
      return { success: false, reason: '积分不足', currentPoints: data.totalPoints };
    }

    data.totalPoints -= points;
    data.history.unshift({
      id: 'pts_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      action: actionType || 'spend',
      desc: desc || '积分消费',
      points: -points,
      type: 'spend',
      timestamp: Date.now()
    });

    if (data.history.length > 200) {
      data.history = data.history.slice(0, 200);
    }

    wx.setStorageSync(GREEN_POINTS_KEY, data);
    console.log('[GreenPoints] 消费积分:', points, '描述:', desc);
    return { success: true, totalPoints: data.totalPoints, reason: '' };
  } catch (e) {
    console.error('[GreenPoints] 积分消费失败:', e);
    return { success: false, reason: '积分消费失败' };
  }
}

function getPointsHistory(limit, type) {
  var data = getGreenPointsData();
  var history = data.history;
  if (type && type !== 'all') {
    history = history.filter(function(item) { return item.type === type; });
  }
  if (limit && limit > 0) {
    return history.slice(0, limit);
  }
  return history;
}

function getPointsStatistics() {
  var data = getGreenPointsData();
  var history = data.history;
  var totalEarned = 0;
  var totalSpent = 0;
  var monthEarned = 0;
  var monthSpent = 0;

  var now = new Date();
  var currentMonth = now.getFullYear() + '-' + (now.getMonth() + 1);

  for (var i = 0; i < history.length; i++) {
    var item = history[i];
    if (item.points > 0) {
      totalEarned += item.points;
      var itemDate = new Date(item.timestamp);
      var itemMonth = itemDate.getFullYear() + '-' + (itemDate.getMonth() + 1);
      if (itemMonth === currentMonth) {
        monthEarned += item.points;
      }
    } else {
      totalSpent += Math.abs(item.points);
      var itemDate = new Date(item.timestamp);
      var itemMonth = itemDate.getFullYear() + '-' + (itemDate.getMonth() + 1);
      if (itemMonth === currentMonth) {
        monthSpent += Math.abs(item.points);
      }
    }
  }

  return {
    totalPoints: data.totalPoints,
    totalEarned: totalEarned,
    totalSpent: totalSpent,
    monthEarned: monthEarned,
    monthSpent: monthSpent
  };
}

function isTodaySignedIn() {
  try {
    var signInRecords = wx.getStorageSync(SIGN_IN_KEY) || {};
    var todayKey = _getTodayKey();
    return !!signInRecords[todayKey];
  } catch (e) {
    console.error('[GreenPoints] 检查签到状态失败:', e);
    return false;
  }
}

function getSignInStreak() {
  try {
    var signInRecords = wx.getStorageSync(SIGN_IN_KEY) || {};
    var streak = 0;
    var d = new Date();
    while (true) {
      var key = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
      if (signInRecords[key]) {
        streak++;
        d.setDate(d.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  } catch (e) {
    console.error('[GreenPoints] 获取连续签到天数失败:', e);
    return 0;
  }
}

function dailySignIn() {
  try {
    if (isTodaySignedIn()) {
      return { success: false, reason: '今日已签到', streak: getSignInStreak() };
    }

    var signInRecords = wx.getStorageSync(SIGN_IN_KEY) || {};
    var todayKey = _getTodayKey();
    signInRecords[todayKey] = { signedInAt: Date.now() };
    wx.setStorageSync(SIGN_IN_KEY, signInRecords);

    var streak = getSignInStreak();
    var bonusPoints = streak >= 7 ? 10 : (streak >= 3 ? 5 : 0);

    var result = earnPoints('dailySignIn', '每日签到' + (bonusPoints > 0 ? '（连续' + streak + '天奖励）' : ''));
    if (result.earned > 0 && bonusPoints > 0) {
      earnPoints('dailySignIn', '连续签到奖励');
    }

    console.log('[GreenPoints] 签到成功，连续签到:', streak, '天');
    return {
      success: true,
      points: result.earned + bonusPoints,
      streak: streak,
      totalPoints: result.totalPoints,
      reason: ''
    };
  } catch (e) {
    console.error('[GreenPoints] 签到失败:', e);
    return { success: false, reason: '签到失败' };
  }
}

function handleInvite(inviteeOpenId) {
  try {
    if (!inviteeOpenId) return { success: false, reason: '无效的邀请码' };

    var inviteData = wx.getStorageSync(INVITE_DATA_KEY) || {};
    var inviteeKey = 'invitee_' + inviteeOpenId;

    if (inviteData[inviteeKey]) {
      return { success: false, reason: '该用户已被邀请过' };
    }

    var config = require('./mockData.js').getInviteRewardConfig();

    if (Object.keys(inviteData).length >= config.maxInvites) {
      return { success: false, reason: '已达到最大邀请次数' };
    }

    var inviterResult = earnPoints('invite', '邀请好友奖励');
    inviteData[inviteeKey] = {
      inviteeOpenId: inviteeOpenId,
      invitedAt: Date.now(),
      inviterPoints: config.inviterPoints
    };
    wx.setStorageSync(INVITE_DATA_KEY, inviteData);

    console.log('[GreenPoints] 邀请成功，邀请人获得:', config.inviterPoints, '积分');
    return {
      success: true,
      inviterPoints: inviterResult.earned,
      inviteePoints: config.inviteePoints,
      totalPoints: inviterResult.totalPoints,
      reason: ''
    };
  } catch (e) {
    console.error('[GreenPoints] 邀请处理失败:', e);
    return { success: false, reason: '邀请处理失败' };
  }
}

function getInviteCount() {
  try {
    var inviteData = wx.getStorageSync(INVITE_DATA_KEY) || {};
    return Object.keys(inviteData).length;
  } catch (e) {
    return 0;
  }
}

function redeemPoints(itemId) {
  try {
    var mockData = require('./mockData.js');
    var item = mockData.getPointsMallItemById(itemId);
    if (!item) return { success: false, reason: '商品不存在' };

    var data = getGreenPointsData();
    if (data.totalPoints < item.points) {
      return { success: false, reason: '积分不足', currentPoints: data.totalPoints, requiredPoints: item.points };
    }

    var redemptionRecords = wx.getStorageSync(REDEMPTION_KEY) || [];
    var userRedemptionCount = redemptionRecords.filter(function(r) {
      return r.itemId === itemId;
    }).length;

    if (userRedemptionCount >= item.limitPerUser) {
      return { success: false, reason: '已达到个人兑换上限' };
    }

    var spendResult = spendPoints(item.points, '兑换:' + item.name, 'redemption');
    if (!spendResult.success) {
      return spendResult;
    }

    var redemption = {
      id: 'redeem_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      itemId: itemId,
      itemName: item.name,
      itemImage: item.image,
      points: item.points,
      originalPrice: item.originalPrice,
      status: 'pending',
      createdAt: Date.now()
    };

    redemptionRecords.unshift(redemption);
    if (redemptionRecords.length > 100) {
      redemptionRecords = redemptionRecords.slice(0, 100);
    }
    wx.setStorageSync(REDEMPTION_KEY, redemptionRecords);

    console.log('[GreenPoints] 积分兑换成功:', item.name, '消耗:', item.points, '积分');
    return {
      success: true,
      redemption: redemption,
      totalPoints: spendResult.totalPoints,
      reason: ''
    };
  } catch (e) {
    console.error('[GreenPoints] 积分兑换失败:', e);
    return { success: false, reason: '兑换失败' };
  }
}

function getRedemptionRecords() {
  try {
    return wx.getStorageSync(REDEMPTION_KEY) || [];
  } catch (e) {
    return [];
  }
}

function registerActivity(activityId) {
  try {
    var mockData = require('./mockData.js');
    var activity = mockData.getMarketingActivityById(activityId);
    if (!activity) return { success: false, reason: '活动不存在' };

    var registrations = wx.getStorageSync(ACTIVITY_REG_KEY) || [];
    var alreadyRegistered = registrations.some(function(r) { return r.activityId === activityId; });
    if (alreadyRegistered) {
      return { success: false, reason: '您已报名该活动' };
    }

    if (activity.registeredCount >= activity.totalSlots) {
      return { success: false, reason: '活动名额已满' };
    }

    var registration = {
      id: 'reg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      activityId: activityId,
      activityTitle: activity.title,
      activityType: activity.type,
      scheduledTime: activity.scheduledTime,
      location: activity.location,
      rewardPoints: activity.rewardPoints,
      registeredAt: Date.now(),
      status: 'registered'
    };

    registrations.unshift(registration);
    if (registrations.length > 50) {
      registrations = registrations.slice(0, 50);
    }
    wx.setStorageSync(ACTIVITY_REG_KEY, registrations);

    if (activity.requirements && activity.requirements.indexOf('扣除50积分') !== -1) {
      spendPoints(50, '活动报名:' + activity.title, 'activity');
    }

    console.log('[GreenPoints] 活动报名成功:', activity.title);
    return {
      success: true,
      registration: registration,
      reason: ''
    };
  } catch (e) {
    console.error('[GreenPoints] 活动报名失败:', e);
    return { success: false, reason: '报名失败' };
  }
}

function getActivityRegistrations() {
  try {
    return wx.getStorageSync(ACTIVITY_REG_KEY) || [];
  } catch (e) {
    return [];
  }
}

module.exports = {
  getGreenPointsData: getGreenPointsData,
  getUserLevel: getUserLevel,
  earnPoints: earnPoints,
  spendPoints: spendPoints,
  getPointsHistory: getPointsHistory,
  getPointsStatistics: getPointsStatistics,
  isTodaySignedIn: isTodaySignedIn,
  getSignInStreak: getSignInStreak,
  dailySignIn: dailySignIn,
  handleInvite: handleInvite,
  getInviteCount: getInviteCount,
  redeemPoints: redeemPoints,
  getRedemptionRecords: getRedemptionRecords,
  registerActivity: registerActivity,
  getActivityRegistrations: getActivityRegistrations,
  GREEN_POINTS_KEY: GREEN_POINTS_KEY,
  SIGN_IN_KEY: SIGN_IN_KEY,
  INVITE_DATA_KEY: INVITE_DATA_KEY,
  REDEMPTION_KEY: REDEMPTION_KEY,
  ACTIVITY_REG_KEY: ACTIVITY_REG_KEY
};
