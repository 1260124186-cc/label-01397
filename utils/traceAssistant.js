/**
 * 溯源上下文 AI 助手 - 受限问答引擎
 * 功能：基于当前 traceData 的 constrained QA，禁止幻觉，敏感问题转人工
 */

var storage = require('./storage.js');

var HISTORY_KEY_PREFIX = 'trace_assistant_history_';
var MAX_HISTORY_PER_TRACE = 50;

var SENSITIVE_KEYWORDS = [
  '投诉', '举报', '赔偿', '退款', '法律', '起诉', '律师',
  '维权', '欺诈', '诈骗', '假冒', '中毒', '过敏', '急救',
  '投诉电话', '消费者协会', '12315', '食品中毒', '身体不适',
  '拉肚子', '腹泻', '呕吐', '恶心', '头晕', '住院'
];

var SUGGESTED_QUESTIONS = [
  '这批次适合送长辈吗？',
  '和 G001 比哪个更浓？',
  '检测报告里氯氰菊酯是什么？'
];

function isSensitive(question) {
  if (!question) return false;
  var q = question.toLowerCase();
  for (var i = 0; i < SENSITIVE_KEYWORDS.length; i++) {
    if (q.indexOf(SENSITIVE_KEYWORDS[i]) !== -1) {
      return true;
    }
  }
  return false;
}

function safeGet(obj, path) {
  if (!obj) return undefined;
  var keys = path.split('.');
  var cur = obj;
  for (var i = 0; i < keys.length; i++) {
    if (cur === null || cur === undefined) return undefined;
    cur = cur[keys[i]];
  }
  return cur;
}

function buildContext(traceData) {
  if (!traceData) return {};

  var basic = traceData.basicInfo || {};
  var tree = traceData.treeAge || {};
  var osm = traceData.osmanthusInfo || {};
  var scent = traceData.scentingProcess || {};
  var test = traceData.pesticideTest || {};
  var brew = traceData.brewingGuide || {};
  var green = traceData.greenTrace || {};
  var bc = traceData.blockchainInfo || {};
  var story = traceData.treeStory || {};
  var shelf = basic.shelfLife || {};

  return {
    productName: basic.productName,
    batchNo: basic.batchNo,
    traceId: basic.traceId,
    pickTime: basic.pickTime,
    productionTime: basic.productionTime,
    specification: basic.specification,
    teaTreeAge: tree.teaTreeAge,
    osmanthusTreeAge: tree.osmanthusTreeAge,
    teaTreeLocation: tree.teaTreeLocation,
    osmanthusTreeLocation: tree.osmanthusTreeLocation,
    variety: osm.variety,
    osmanthusOrigin: osm.origin,
    osmanthusPickTime: osm.pickTime,
    osmanthusColor: osm.color,
    osmanthusFragrance: osm.fragrance,
    scentingTimes: scent.scentingTimes,
    scentingDuration: scent.scentingDuration,
    scentingTemperature: scent.temperature,
    scentingHumidity: scent.humidity,
    scentingRatio: scent.ratio,
    workshopCleanliness: scent.workshopCleanliness,
    scentingRecords: scent.scentingRecords,
    testInstitution: test.institution,
    testDate: test.testDate,
    reportNo: test.reportNo,
    testStandard: test.standard,
    teaTests: test.teaTests,
    osmanthusTests: test.osmanthusTests,
    hasAbnormal: test.hasAbnormal,
    comparisonTip: test.comparisonTip,
    historyReports: test.historyReports,
    waterTemp: brew.waterTemp,
    brewingTime: brew.brewingTime,
    rebrewTimes: brew.rebrewTimes,
    waterType: brew.waterType,
    teawareType: brew.teawareType,
    brewTips: brew.tips,
    ecoPlantingCert: safeGet(green, 'ecoPlanting.certification'),
    ecoPackingCert: safeGet(green, 'ecoPacking.certification'),
    carbonReduction: safeGet(green, 'ecoLogistics.carbonReduction'),
    bcVerifyStatus: bc.verifyStatus,
    bcChainName: bc.chainName,
    teaTreeStory: safeGet(story, 'teaTree.story'),
    osmanthusTreeStory: safeGet(story, 'osmanthusTree.story'),
    storageCondition: shelf.storageCondition,
    storageTips: shelf.storageTips,
    bestBeforeDate: shelf.bestBeforeDate,
    dataVersion: traceData.dataVersion,
    lastUpdatedAt: traceData.lastUpdatedAt
  };
}

var QA_RULES = [
  {
    patterns: ['送长辈', '送人', '送礼', '送老人', '送父母', '送亲戚', '送朋友'],
    answer: function(ctx) {
      if (!ctx.productName) return '暂无该批次产品信息记录。';
      var parts = [];
      parts.push('【' + ctx.productName + '】');
      if (ctx.variety) parts.push('选用' + ctx.variety + '品种，' + (ctx.osmanthusFragrance || '香气独特'));
      if (ctx.teaTreeAge) parts.push('茶树龄' + ctx.teaTreeAge + '年');
      if (ctx.scentingTimes) parts.push('窨制' + ctx.scentingTimes + '次');
      if (ctx.testInstitution && !ctx.hasAbnormal) {
        parts.push('经' + ctx.testInstitution + '检测合格');
      }
      if (ctx.ecoPlantingCert) parts.push('持有' + ctx.ecoPlantingCert);
      if (ctx.bcVerifyStatus) parts.push('区块链存证' + ctx.bcVerifyStatus);
      if (ctx.hasAbnormal) {
        return ctx.productName + '检测存在异常项，建议暂不用于送礼，详见检测报告。';
      }
      parts.push('品质可靠，适合作为心意之礼送长辈。');
      return parts.join('，') + '。';
    }
  },
  {
    patterns: ['更浓', '哪个浓', '浓度', '比.*浓', '对比.*浓', '比较.*浓'],
    answer: function(ctx) {
      if (!ctx.variety) return '暂无品种信息记录，无法对比。';
      var name = ctx.productName || '本产品';
      if (ctx.variety === '金桂') {
        return name + '为金桂品种，香气"浓郁持久"，窨制' + (ctx.scentingTimes || '未知') + '次。与银桂相比，金桂花色金黄、香气更浓更持久，是桂花之上品；银桂香气"清雅淡远"，口感更柔和。如果偏好浓香，金桂更合适。';
      }
      if (ctx.variety === '银桂') {
        return name + '为银桂品种，香气"清雅淡香"，窨制' + (ctx.scentingTimes || '未知') + '次。与金桂相比，银桂香气更清淡柔和；金桂花色金黄、香气"浓郁持久"，浓度更高。如果偏好浓香，建议选择金桂系列。';
      }
      return name + '为' + ctx.variety + '品种，香气特点为"' + (ctx.osmanthusFragrance || '未知') + '"。不同品种浓度各异，可根据香气偏好选择。';
    }
  },
  {
    patterns: ['氯氰菊酯', '氯氰'],
    answer: function(ctx) {
      var allTests = [];
      if (ctx.teaTests) allTests = allTests.concat(ctx.teaTests);
      if (ctx.osmanthusTests) allTests = allTests.concat(ctx.osmanthusTests);
      var found = null;
      for (var i = 0; i < allTests.length; i++) {
        if (allTests[i].item && allTests[i].item.indexOf('氯氰菊酯') !== -1) {
          found = allTests[i];
          break;
        }
      }
      if (!found) return '当前批次检测报告中未检出氯氰菊酯项目。如有疑问请联系人工客服。';
      var base = '氯氰菊酯是一种拟除虫菊酯类农药，常用于防治茶叶害虫。国标 GB 2763-2021 规定其在茶叶中限值为 ' + found.limit + ' ' + (found.unit || 'mg/kg') + '。';
      base += '本批次' + (found.item || '氯氰菊酯') + '检测值为 ' + (found.displayValue || found.value) + ' ' + (found.unit || 'mg/kg') + '，';
      if (found.status === '合格') {
        base += '远低于国标限值（安全余量约' + (found.limit / found.value).toFixed(1) + '倍），安全合格。';
      } else {
        base += '超出国标限值，状态为"' + found.status + '"。' + (found.description || '建议停止食用并联系供应商。');
      }
      return base;
    }
  },
  {
    patterns: ['检测', '农残', '安全', '合格', '检测报告', '有没有问题'],
    answer: function(ctx) {
      if (!ctx.testInstitution) return '暂无检测报告记录。';
      var parts = ['本批次由' + ctx.testInstitution + '于' + (ctx.testDate || '未知') + '检测，报告编号 ' + (ctx.reportNo || '未知') + '。'];
      if (ctx.hasAbnormal) {
        parts.push('⚠️ 检测存在异常项，请查看检测报告详情。');
      } else {
        parts.push('✅ 各项农残检测均合格，' + (ctx.comparisonTip || '安全放心') + '。');
      }
      if (ctx.testStandard) parts.push('执行标准：' + ctx.testStandard + '。');
      return parts.join('');
    }
  },
  {
    patterns: ['窨制', '工艺', '几次', '怎么做的', '怎么做'],
    answer: function(ctx) {
      if (!ctx.scentingTimes) return '暂无窨制工艺信息记录。';
      var parts = ['本批次共窨制 ' + ctx.scentingTimes + ' 次，每次约 ' + (ctx.scentingDuration || '未知') + ' 小时，'];
      parts.push('窨制温度 ' + (ctx.scentingTemperature || '未知') + '℃，湿度 ' + (ctx.scentingHumidity || '未知') + '%，花茶配比 ' + (ctx.scentingRatio || '未知') + '。');
      if (ctx.workshopCleanliness) parts.push('车间洁净度：' + ctx.workshopCleanliness + '。');
      return parts.join('');
    }
  },
  {
    patterns: ['冲泡', '泡茶', '怎么泡', '水温', '泡多久'],
    answer: function(ctx) {
      if (!ctx.waterTemp) return '暂无冲泡建议记录。';
      var parts = ['建议水温 ' + ctx.waterTemp + '，冲泡时长 ' + (ctx.brewingTime || '未知') + '，可续泡 ' + (ctx.rebrewTimes || '未知') + '。'];
      if (ctx.waterType) parts.push('推荐用水：' + ctx.waterType + '。');
      if (ctx.teawareType) parts.push('推荐茶具：' + ctx.teawareType + '。');
      if (ctx.brewTips && ctx.brewTips.length > 0) {
        parts.push('小贴士：' + ctx.brewTips.join('；') + '。');
      }
      return parts.join('');
    }
  },
  {
    patterns: ['树龄', '多少年', '多老', '古树'],
    answer: function(ctx) {
      if (!ctx.teaTreeAge) return '暂无树龄信息记录。';
      var parts = ['茶树龄 ' + ctx.teaTreeAge + ' 年'];
      if (ctx.teaTreeLocation) parts.push('（产地：' + ctx.teaTreeLocation + '）');
      if (ctx.osmanthusTreeAge) parts.push('，桂花树龄 ' + ctx.osmanthusTreeAge + ' 年');
      if (ctx.osmanthusTreeLocation) parts.push('（产地：' + ctx.osmanthusTreeLocation + '）');
      parts.push('。');
      return parts.join('');
    }
  },
  {
    patterns: ['品种', '什么花', '桂花品种', '什么品种'],
    answer: function(ctx) {
      if (!ctx.variety) return '暂无品种信息记录。';
      var parts = ['本批次桂花品种为' + ctx.variety];
      if (ctx.osmanthusColor) parts.push('，花色' + ctx.osmanthusColor);
      if (ctx.osmanthusFragrance) parts.push('，香气' + ctx.osmanthusFragrance);
      if (ctx.osmanthusOrigin) parts.push('，产地' + ctx.osmanthusOrigin);
      parts.push('。');
      return parts.join('');
    }
  },
  {
    patterns: ['保质', '过期', '储存', '保存', '能放多久'],
    answer: function(ctx) {
      if (!ctx.bestBeforeDate) return '暂无保质期信息记录。';
      var parts = ['保质期至 ' + ctx.bestBeforeDate + '。'];
      if (ctx.storageCondition) parts.push('储存条件：' + ctx.storageCondition + '。');
      if (ctx.storageTips && ctx.storageTips.length > 0) {
        parts.push('建议：' + ctx.storageTips.join('；') + '。');
      }
      return parts.join('');
    }
  },
  {
    patterns: ['绿色', '有机', '环保', '认证'],
    answer: function(ctx) {
      var parts = [];
      if (ctx.ecoPlantingCert) parts.push('种植认证：' + ctx.ecoPlantingCert + '。');
      if (ctx.ecoPackingCert) parts.push('包装认证：' + ctx.ecoPackingCert + '。');
      if (ctx.carbonReduction) parts.push('物流：' + ctx.carbonReduction + '。');
      if (parts.length === 0) return '暂无绿色认证信息记录。';
      return parts.join('');
    }
  },
  {
    patterns: ['区块链', '存证', '上链', '不可篡改'],
    answer: function(ctx) {
      if (!ctx.bcChainName) return '暂无区块链存证信息记录。';
      var parts = ['已上链至' + ctx.bcChainName + '，存证状态：' + (ctx.bcVerifyStatus || '未知') + '。数据真实可查、不可篡改。'];
      return parts.join('');
    }
  },
  {
    patterns: ['产地', '哪里', '来自哪', '哪里产', '原产地'],
    answer: function(ctx) {
      var parts = [];
      if (ctx.teaTreeLocation) parts.push('茶树产地：' + ctx.teaTreeLocation);
      if (ctx.osmanthusTreeLocation) parts.push('桂花产地：' + ctx.osmanthusTreeLocation);
      if (ctx.osmanthusOrigin) parts.push('桂花原产地：' + ctx.osmanthusOrigin);
      if (parts.length === 0) return '暂无产地信息记录。';
      return parts.join('；') + '。';
    }
  },
  {
    patterns: ['采摘', '什么时候采', '采摘时间'],
    answer: function(ctx) {
      var parts = [];
      if (ctx.pickTime) parts.push('茶叶采摘时间：' + ctx.pickTime);
      if (ctx.osmanthusPickTime) parts.push('桂花采摘时间：' + ctx.osmanthusPickTime);
      if (parts.length === 0) return '暂无采摘时间记录。';
      return parts.join('；') + '。';
    }
  },
  {
    patterns: ['故事', '历史', '古茶树.*故事', '茶树故事'],
    answer: function(ctx) {
      if (ctx.teaTreeStory) return '古茶树故事：' + ctx.teaTreeStory;
      if (ctx.osmanthusTreeStory) return '桂花树故事：' + ctx.osmanthusTreeStory;
      return '暂无茶树故事记录。';
    }
  }
];

function findMatchingRule(question) {
  if (!question) return null;
  var q = question.trim();
  for (var i = 0; i < QA_RULES.length; i++) {
    var rule = QA_RULES[i];
    var patterns = rule.patterns;
    for (var j = 0; j < patterns.length; j++) {
      try {
        var regex = new RegExp(patterns[j]);
        if (regex.test(q)) {
          return rule;
        }
      } catch (e) {
        if (q.indexOf(patterns[j]) !== -1) {
          return rule;
        }
      }
    }
  }
  return null;
}

function answerQuestion(question, traceData) {
  if (!question || !question.trim()) {
    return { type: 'empty', answer: '请输入您的问题，例如：这批次适合送长辈吗？' };
  }

  var trimmed = question.trim();

  if (isSensitive(trimmed)) {
    return {
      type: 'sensitive',
      answer: '您的问题涉及敏感事项，为确保您的权益，已为您转接人工客服。请拨打客服热线：400-888-0000，或前往"我的 → 客服中心"提交工单。'
    };
  }

  var ctx = buildContext(traceData);
  var rule = findMatchingRule(trimmed);

  if (rule) {
    return { type: 'answer', answer: rule.answer(ctx) };
  }

  return {
    type: 'unknown',
    answer: '抱歉，我暂无法回答该问题。您可以尝试问我：品种信息、树龄、窨制工艺、检测报告、冲泡建议、保质期、产地、绿色认证等溯源相关问题。如需其他帮助，请联系人工客服。'
  };
}

function getHistory(traceId) {
  if (!traceId) return [];
  try {
    var key = HISTORY_KEY_PREFIX + traceId;
    var data = wx.getStorageSync(key);
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.error('[TraceAssistant] 获取历史记录失败:', e);
    return [];
  }
}

function saveHistory(traceId, history) {
  if (!traceId) return;
  try {
    var key = HISTORY_KEY_PREFIX + traceId;
    if (history.length > MAX_HISTORY_PER_TRACE) {
      history = history.slice(history.length - MAX_HISTORY_PER_TRACE);
    }
    wx.setStorageSync(key, history);
  } catch (e) {
    console.error('[TraceAssistant] 保存历史记录失败:', e);
  }
}

function addMessage(traceId, message) {
  var history = getHistory(traceId);
  history.push({
    id: Date.now().toString(),
    role: message.role,
    content: message.content,
    type: message.type || 'answer',
    timestamp: Date.now()
  });
  saveHistory(traceId, history);
  return history;
}

function clearHistory(traceId) {
  if (!traceId) return;
  try {
    var key = HISTORY_KEY_PREFIX + traceId;
    wx.removeStorageSync(key);
  } catch (e) {
    console.error('[TraceAssistant] 清除历史记录失败:', e);
  }
}

function getSuggestedQuestions() {
  return SUGGESTED_QUESTIONS.slice();
}

module.exports = {
  answerQuestion: answerQuestion,
  isSensitive: isSensitive,
  getHistory: getHistory,
  saveHistory: saveHistory,
  addMessage: addMessage,
  clearHistory: clearHistory,
  getSuggestedQuestions: getSuggestedQuestions,
  buildContext: buildContext,
  SENSITIVE_KEYWORDS: SENSITIVE_KEYWORDS,
  SUGGESTED_QUESTIONS: SUGGESTED_QUESTIONS
};
