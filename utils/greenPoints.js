var GREEN_POINTS_KEY = 'green_points_data';

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
  var config = require('./mockData.js').getGreenPointsConfig();
  var levelConfig = config.levelConfig;
  var current = levelConfig[0];
  for (var i = 0; i < levelConfig.length; i++) {
    if (totalPoints >= levelConfig[i].minPoints) {
      current = levelConfig[i];
    }
  }
  var nextLevel = null;
  for (var j = 0; j < levelConfig.length; j++) {
    if (levelConfig[j].minPoints > totalPoints) {
      nextLevel = levelConfig[j];
      break;
    }
  }
  return {
    level: current.level,
    name: current.name,
    icon: current.icon,
    currentPoints: totalPoints,
    nextLevel: nextLevel ? nextLevel.name : null,
    nextLevelPoints: nextLevel ? nextLevel.minPoints : null,
    progress: nextLevel ? ((totalPoints - current.minPoints) / (nextLevel.minPoints - current.minPoints)) * 100 : 100
  };
}

function earnPoints(action) {
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
      action: action,
      desc: rule.desc,
      points: canEarn,
      timestamp: Date.now()
    });

    if (data.history.length > 100) {
      data.history = data.history.slice(0, 100);
    }

    wx.setStorageSync(GREEN_POINTS_KEY, data);
    console.log('[GreenPoints] 获得积分:', canEarn, '行为:', action);
    return { earned: canEarn, totalPoints: data.totalPoints, reason: '' };
  } catch (e) {
    console.error('[GreenPoints] 积分计算失败:', e);
    return { earned: 0, reason: '积分计算失败' };
  }
}

function getPointsHistory(limit) {
  var data = getGreenPointsData();
  if (limit && limit > 0) {
    return data.history.slice(0, limit);
  }
  return data.history;
}

module.exports = {
  getGreenPointsData: getGreenPointsData,
  getUserLevel: getUserLevel,
  earnPoints: earnPoints,
  getPointsHistory: getPointsHistory,
  GREEN_POINTS_KEY: GREEN_POINTS_KEY
};
