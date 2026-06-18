var BREW_RECORDS_KEY = 'brew_records';
var WATER_QUALITY_KEY = 'water_quality_settings';
var MAX_RECORDS = 200;

function getBrewRecords() {
  try {
    return wx.getStorageSync(BREW_RECORDS_KEY) || [];
  } catch (e) {
    console.error('[BrewRecord] 获取冲泡记录失败:', e);
    return [];
  }
}

function addBrewRecord(record) {
  if (!record) return getBrewRecords();
  try {
    var list = getBrewRecords();
    var newRecord = {
      id: 'brew_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      traceId: record.traceId || '',
      productName: record.productName || '',
      brewRound: record.brewRound || 1,
      waterTemp: record.waterTemp || 85,
      brewDuration: record.brewDuration || 120,
      teaAmount: record.teaAmount || 3,
      waterAmount: record.waterAmount || 150,
      waterHardness: record.waterHardness || 'soft',
      feeling: record.feeling || '',
      rating: record.rating || 0,
      tags: record.tags || [],
      weather: record.weather || null,
      createTime: Date.now()
    };
    list.unshift(newRecord);
    if (list.length > MAX_RECORDS) list.splice(MAX_RECORDS);
    wx.setStorageSync(BREW_RECORDS_KEY, list);
    console.info('[BrewRecord] 新增冲泡记录:', newRecord.id);
    return list;
  } catch (e) {
    console.error('[BrewRecord] 新增冲泡记录失败:', e);
    return getBrewRecords();
  }
}

function deleteBrewRecord(recordId) {
  try {
    var list = getBrewRecords();
    var filtered = list.filter(function(item) { return item.id !== recordId; });
    wx.setStorageSync(BREW_RECORDS_KEY, filtered);
    console.info('[BrewRecord] 删除冲泡记录:', recordId);
    return filtered;
  } catch (e) {
    console.error('[BrewRecord] 删除冲泡记录失败:', e);
    return getBrewRecords();
  }
}

function getRecordsByTraceId(traceId) {
  if (!traceId) return [];
  return getBrewRecords().filter(function(item) { return item.traceId === traceId; });
}

function getRecordsByProduct(productName) {
  if (!productName) return [];
  return getBrewRecords().filter(function(item) { return item.productName === productName; });
}

function getWaterQualitySettings() {
  try {
    var stored = wx.getStorageSync(WATER_QUALITY_KEY);
    if (stored) return stored;
  } catch (e) {
    console.error('[BrewRecord] 获取水质设置失败:', e);
  }
  return {
    hardness: 'medium',
    lastUpdated: null
  };
}

function setWaterQualitySettings(settings) {
  try {
    var current = getWaterQualitySettings();
    var updated = Object.assign({}, current, settings, { lastUpdated: Date.now() });
    wx.setStorageSync(WATER_QUALITY_KEY, updated);
    console.info('[BrewRecord] 水质设置已更新');
    return updated;
  } catch (e) {
    console.error('[BrewRecord] 更新水质设置失败:', e);
    return getWaterQualitySettings();
  }
}

function adjustBrewParamsByWaterQuality(hardness, baseTeaAmount, baseDuration) {
  var teaAmount = baseTeaAmount || 3;
  var duration = baseDuration || 120;
  var result = {
    teaAmount: teaAmount,
    duration: duration,
    waterHardness: hardness,
    reason: ''
  };

  switch (hardness) {
    case 'soft':
      result.teaAmount = Math.round(teaAmount * 0.9);
      result.duration = Math.round(duration * 0.9);
      result.reason = '软水溶解物质快，建议减少投茶量并缩短浸泡时间';
      break;
    case 'medium':
      result.teaAmount = teaAmount;
      result.duration = duration;
      result.reason = '中等硬度水质，使用标准冲泡参数即可';
      break;
    case 'hard':
      result.teaAmount = Math.round(teaAmount * 1.15);
      result.duration = Math.round(duration * 1.2);
      result.reason = '硬水矿物质含量高，茶汤析出慢，建议增加投茶量并延长浸泡时间';
      break;
    default:
      result.reason = '水质参数未设置，使用标准冲泡参数';
  }

  return result;
}

function getFlavorCurve(traceId) {
  var records = traceId ? getRecordsByTraceId(traceId) : getBrewRecords();

  if (records.length === 0) {
    return {
      hasData: false,
      rounds: [],
      avgDuration: 0,
      avgTemp: 0,
      avgRating: 0,
      topTags: []
    };
  }

  var roundMap = {};
  var totalDuration = 0;
  var totalTemp = 0;
  var totalRating = 0;
  var ratingCount = 0;
  var tagCount = {};

  records.forEach(function(record) {
    var round = record.brewRound || 1;
    if (!roundMap[round]) {
      roundMap[round] = { count: 0, totalDuration: 0, totalTemp: 0, totalRating: 0, ratingCount: 0 };
    }
    roundMap[round].count++;
    roundMap[round].totalDuration += record.brewDuration || 0;
    roundMap[round].totalTemp += record.waterTemp || 0;
    if (record.rating) {
      roundMap[round].totalRating += record.rating;
      roundMap[round].ratingCount++;
    }

    totalDuration += record.brewDuration || 0;
    totalTemp += record.waterTemp || 0;
    if (record.rating) {
      totalRating += record.rating;
      ratingCount++;
    }

    (record.tags || []).forEach(function(tag) {
      tagCount[tag] = (tagCount[tag] || 0) + 1;
    });
  });

  var rounds = Object.keys(roundMap).sort(function(a, b) { return parseInt(a) - parseInt(b); }).map(function(round) {
    var data = roundMap[round];
    return {
      round: parseInt(round),
      count: data.count,
      avgDuration: Math.round(data.totalDuration / data.count),
      avgTemp: Math.round(data.totalTemp / data.count),
      avgRating: data.ratingCount > 0 ? Math.round(data.totalRating / data.ratingCount * 10) / 10 : 0
    };
  });

  var topTags = Object.keys(tagCount)
    .sort(function(a, b) { return tagCount[b] - tagCount[a]; })
    .slice(0, 5);

  return {
    hasData: true,
    rounds: rounds,
    avgDuration: Math.round(totalDuration / records.length),
    avgTemp: Math.round(totalTemp / records.length),
    avgRating: ratingCount > 0 ? Math.round(totalRating / ratingCount * 10) / 10 : 0,
    topTags: topTags,
    totalCount: records.length
  };
}

function generateTastingNoteDraft(record, productName) {
  if (!record) return '';

  var durationMin = Math.floor(record.brewDuration / 60);
  var durationSec = record.brewDuration % 60;
  var durationText = durationMin > 0 ? durationMin + '分' + (durationSec > 0 ? durationSec + '秒' : '') : durationSec + '秒';

  var hardnessText = { soft: '软水', medium: '中等硬度水', hard: '硬水' }[record.waterHardness] || '普通水';

  var draft = '【冲泡记录】第' + (record.brewRound || 1) + '泡\n';
  draft += '产品：' + (productName || record.productName || '未知产品') + '\n';
  draft += '水温：' + (record.waterTemp || 85) + '℃\n';
  draft += '时长：' + durationText + '\n';
  draft += '投茶量：' + (record.teaAmount || 3) + 'g\n';
  draft += '水量：' + (record.waterAmount || 150) + 'ml\n';
  draft += '水质：' + hardnessText + '\n';

  if (record.weather) {
    draft += '环境：' + record.weather.city + ' ' + record.weather.weather + ' ' + record.weather.temp + '℃\n';
  }

  if (record.tags && record.tags.length > 0) {
    draft += '\n风味标签：' + record.tags.join('、') + '\n';
  }

  if (record.feeling) {
    draft += '\n个人感受：\n' + record.feeling + '\n';
  } else {
    draft += '\n个人感受：\n（在此填写您的品鉴感受...）\n';
  }

  return draft;
}

module.exports = {
  getBrewRecords: getBrewRecords,
  addBrewRecord: addBrewRecord,
  deleteBrewRecord: deleteBrewRecord,
  getRecordsByTraceId: getRecordsByTraceId,
  getRecordsByProduct: getRecordsByProduct,
  getWaterQualitySettings: getWaterQualitySettings,
  setWaterQualitySettings: setWaterQualitySettings,
  adjustBrewParamsByWaterQuality: adjustBrewParamsByWaterQuality,
  getFlavorCurve: getFlavorCurve,
  generateTastingNoteDraft: generateTastingNoteDraft,
  BREW_RECORDS_KEY: BREW_RECORDS_KEY,
  WATER_QUALITY_KEY: WATER_QUALITY_KEY
};
