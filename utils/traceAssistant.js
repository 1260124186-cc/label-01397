/**
 * 溯源上下文 AI 助手 - 受限问答引擎（严格字段驱动版）
 * 
 * 核心约束：
 * 1. 所有回答仅引用 buildContext(traceData) 中真实可取到的字段
 * 2. 无数据必须明确返回"暂无记录"，严禁编造/幻觉
 * 3. 每个回答附带 sources 数组，标注引用的字段键、中文标签和取值
 * 4. 敏感问题直接转人工客服
 */

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

/**
 * 字段键 → 中文标签映射（与 buildContext 输出一一对应）
 */
var FIELD_LABELS = {
  productName: '产品名称',
  batchNo: '批次号',
  traceId: '溯源编号',
  pickTime: '茶叶采摘时间',
  productionTime: '生产日期',
  specification: '规格',
  teaTreeAge: '茶树龄',
  osmanthusTreeAge: '桂花树龄',
  teaTreeLocation: '茶树产地',
  osmanthusTreeLocation: '桂花产地',
  variety: '桂花品种',
  osmanthusOrigin: '桂花原产地',
  osmanthusPickTime: '桂花采摘时间',
  osmanthusColor: '桂花花色',
  osmanthusFragrance: '香气特点',
  scentingTimes: '窨制次数',
  scentingDuration: '每次窨制时长(小时)',
  scentingTemperature: '窨制温度(℃)',
  scentingHumidity: '窨制湿度(%)',
  scentingRatio: '花茶配比',
  workshopCleanliness: '车间洁净度',
  scentingRecords: '窨制记录',
  testInstitution: '检测机构',
  testDate: '检测日期',
  reportNo: '报告编号',
  testStandard: '执行标准',
  teaTests: '茶叶农残检测项',
  osmanthusTests: '桂花农残检测项',
  hasAbnormal: '是否存在异常项',
  comparisonTip: '检测评价',
  historyReports: '历史检测报告',
  waterTemp: '建议水温',
  brewingTime: '冲泡时长',
  rebrewTimes: '可续泡次数',
  waterType: '推荐用水',
  teawareType: '推荐茶具',
  brewTips: '冲泡小贴士',
  ecoPlantingCert: '种植认证',
  ecoPackingCert: '包装认证',
  carbonReduction: '物流减碳量',
  bcVerifyStatus: '区块链存证状态',
  bcChainName: '区块链名称',
  teaTreeStory: '古茶树故事',
  osmanthusTreeStory: '桂花树故事',
  storageCondition: '储存条件',
  storageTips: '储存建议',
  bestBeforeDate: '保质期至',
  dataVersion: '数据版本',
  lastUpdatedAt: '数据最后更新时间'
};

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

function isEmpty(v) {
  if (v === null || v === undefined) return true;
  if (typeof v === 'string' && v.trim() === '') return true;
  if (Array.isArray(v) && v.length === 0) return true;
  return false;
}

function formatValue(v) {
  if (v === null || v === undefined) return '';
  if (typeof v === 'boolean') return v ? '是' : '否';
  if (Array.isArray(v)) return v.join('、');
  return String(v);
}

/**
 * 从 ctx 中取一个字段，若存在则同时返回 source 对象
 * @returns { value, source } value 为取值（可能 undefined）；source 仅在 value 存在时有值
 */
function pickField(ctx, key) {
  var v = ctx[key];
  if (isEmpty(v)) {
    return { value: undefined, source: null };
  }
  return {
    value: v,
    source: {
      key: key,
      label: FIELD_LABELS[key] || key,
      value: formatValue(v)
    }
  };
}

/**
 * 构建严格受限的上下文 —— 所有回答只能引用此上下文的字段
 */
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

/**
 * 各 QA 规则
 * 每个规则必须：
 *   - 仅使用 pickField(ctx, key) 从 buildContext 取字段
 *   - 返回 { text, sources } 或 { noData: true, reason }
 */
var QA_RULES = [
  {
    patterns: ['送长辈', '送人', '送礼', '送老人', '送父母', '送亲戚', '送朋友'],
    answer: function(ctx) {
      var sources = [];
      var parts = [];

      var product = pickField(ctx, 'productName');
      if (product.source) {
        sources.push(product.source);
        parts.push('【' + product.value + '】');
      } else {
        return { noData: true, reason: '暂无该批次产品信息记录。' };
      }

      var variety = pickField(ctx, 'variety');
      if (variety.source) {
        sources.push(variety.source);
        var frag = pickField(ctx, 'osmanthusFragrance');
        if (frag.source) {
          sources.push(frag.source);
          parts.push('为' + variety.value + '品种，香气' + frag.value);
        } else {
          parts.push('为' + variety.value + '品种');
        }
      }

      var teaAge = pickField(ctx, 'teaTreeAge');
      if (teaAge.source) {
        sources.push(teaAge.source);
        parts.push('茶树龄' + teaAge.value + '年');
      }

      var scentTimes = pickField(ctx, 'scentingTimes');
      if (scentTimes.source) {
        sources.push(scentTimes.source);
        parts.push('窨制' + scentTimes.value + '次');
      }

      var testInst = pickField(ctx, 'testInstitution');
      var abnormal = pickField(ctx, 'hasAbnormal');
      if (testInst.source) {
        sources.push(testInst.source);
        if (abnormal.source) {
          sources.push(abnormal.source);
        }
        if (abnormal.value === true) {
          return {
            text: parts.join('，') + '。但该批次由' + testInst.value + '检测存在异常项，建议暂不用于送礼，详见检测报告。',
            sources: sources
          };
        }
        parts.push('经' + testInst.value + '检测合格');
      }

      var eco = pickField(ctx, 'ecoPlantingCert');
      if (eco.source) {
        sources.push(eco.source);
        parts.push('持有' + eco.value);
      }

      var bc = pickField(ctx, 'bcVerifyStatus');
      if (bc.source) {
        sources.push(bc.source);
        parts.push('区块链存证' + bc.value);
      }

      return {
        text: parts.join('，') + '。基于以上溯源信息，品质可追溯，适合作为心意之礼送长辈。',
        sources: sources
      };
    }
  },

  {
    patterns: ['更浓', '哪个浓', '浓度', '比.*浓', '对比.*浓', '比较.*浓', 'g001', 'G001'],
    answer: function(ctx) {
      var sources = [];
      var parts = [];

      var product = pickField(ctx, 'productName');
      if (product.source) {
        sources.push(product.source);
      }

      var variety = pickField(ctx, 'variety');
      if (!variety.source) {
        return { noData: true, reason: '暂无该批次桂花品种信息记录，无法进行浓度对比。' };
      }
      sources.push(variety.source);

      var frag = pickField(ctx, 'osmanthusFragrance');
      if (frag.source) {
        sources.push(frag.source);
        parts.push('该批次（' + variety.value + '）香气特点为"' + frag.value + '"');
      } else {
        parts.push('该批次品种为' + variety.value);
      }

      var scentTimes = pickField(ctx, 'scentingTimes');
      if (scentTimes.source) {
        sources.push(scentTimes.source);
        parts.push('，窨制' + scentTimes.value + '次');
      }

      var batch = pickField(ctx, 'batchNo');
      if (batch.source) {
        sources.push(batch.source);
        if (batch.value === 'G001') {
          parts.push('（当前批次即 G001）。');
        } else {
          parts.push('（当前批次 ' + batch.value + ' ）。');
        }
      } else {
        parts.push('。');
      }

      parts.push('不同批次/品种的浓度差异请以各批次页面的「香气特点」和「窨制次数」字段实际取值为准，当前页面未提供 G001 的香气数据，无法直接对比，建议返回列表分别查看两个批次的溯源详情。');

      return {
        text: parts.join(''),
        sources: sources
      };
    }
  },

  {
    patterns: ['氯氰菊酯', '氯氰'],
    answer: function(ctx) {
      var sources = [];

      var testInst = pickField(ctx, 'testInstitution');
      if (testInst.source) sources.push(testInst.source);
      var testDate = pickField(ctx, 'testDate');
      if (testDate.source) sources.push(testDate.source);
      var reportNo = pickField(ctx, 'reportNo');
      if (reportNo.source) sources.push(reportNo.source);
      var standard = pickField(ctx, 'testStandard');
      if (standard.source) sources.push(standard.source);

      var allTests = [];
      var teaTests = pickField(ctx, 'teaTests');
      if (teaTests.source) {
        sources.push({
          key: 'teaTests',
          label: '茶叶农残检测项（含氯氰菊酯）',
          value: '共' + (Array.isArray(teaTests.value) ? teaTests.value.length : 0) + '项'
        });
        if (Array.isArray(teaTests.value)) allTests = allTests.concat(teaTests.value);
      }
      var osmTests = pickField(ctx, 'osmanthusTests');
      if (osmTests.source) {
        sources.push({
          key: 'osmanthusTests',
          label: '桂花农残检测项（含氯氰菊酯）',
          value: '共' + (Array.isArray(osmTests.value) ? osmTests.value.length : 0) + '项'
        });
        if (Array.isArray(osmTests.value)) allTests = allTests.concat(osmTests.value);
      }

      var found = null;
      for (var i = 0; i < allTests.length; i++) {
        if (allTests[i].item && allTests[i].item.indexOf('氯氰菊酯') !== -1) {
          found = allTests[i];
          break;
        }
      }

      if (!found) {
        var baseText = '当前批次检测报告中未检出氯氰菊酯项（或该批次不包含此项检测）。依据：';
        var srcLabels = [];
        for (var j = 0; j < sources.length; j++) {
          srcLabels.push(sources[j].label);
        }
        if (srcLabels.length === 0) {
          return { noData: true, reason: '暂无该批次检测报告记录。' };
        }
        return {
          text: baseText + srcLabels.join('、'),
          sources: sources
        };
      }

      sources.push({
        key: 'pesticide.' + (found.item || '氯氰菊酯'),
        label: '检测项：' + (found.item || '氯氰菊酯'),
        value: '检测值 ' + (found.displayValue || found.value) + (found.unit || '') +
               '，限值 ' + found.limit + (found.unit || '') +
               '，结果 ' + (found.status || '未知')
      });

      var text = '';
      if (standard.value) {
        text += '根据 ' + standard.value + ' 标准，氯氰菊酯限值为 ' + found.limit + (found.unit || 'mg/kg') + '。';
      } else {
        text += '氯氰菊酯为常见农残检测项。';
      }
      text += '本批次' + (found.item || '氯氰菊酯') + '检测值为 ' + (found.displayValue || found.value) + (found.unit || '') + '，状态为"' + (found.status || '未知') + '"。';

      if (found.status === '合格' && found.value && found.limit) {
        var ratio = Number(found.limit) / Number(found.value);
        if (!isNaN(ratio) && isFinite(ratio)) {
          text += '安全余量约 ' + ratio.toFixed(1) + ' 倍。';
        }
      } else if (found.status !== '合格') {
        text += '该检测项存在异常，建议查看完整检测报告或联系人工客服。';
      }

      return {
        text: text,
        sources: sources
      };
    }
  },

  {
    patterns: ['检测', '农残', '安全', '合格', '检测报告', '有没有问题'],
    answer: function(ctx) {
      var sources = [];

      var testInst = pickField(ctx, 'testInstitution');
      if (!testInst.source) {
        return { noData: true, reason: '暂无该批次检测报告记录。' };
      }
      sources.push(testInst.source);

      var parts = ['本批次由' + testInst.value + '检测'];

      var testDate = pickField(ctx, 'testDate');
      if (testDate.source) {
        sources.push(testDate.source);
        parts.push('（检测日期：' + testDate.value + '）');
      }
      var reportNo = pickField(ctx, 'reportNo');
      if (reportNo.source) {
        sources.push(reportNo.source);
        parts.push('，报告编号 ' + reportNo.value);
      }
      var standard = pickField(ctx, 'testStandard');
      if (standard.source) {
        sources.push(standard.source);
        parts.push('，执行标准 ' + standard.value);
      }

      var abnormal = pickField(ctx, 'hasAbnormal');
      if (abnormal.source) {
        sources.push(abnormal.source);
        if (abnormal.value === true) {
          parts.push('。⚠️ 检测存在异常项，请查看检测报告详情。');
        } else {
          parts.push('。✅ 未检出异常项');
          var tip = pickField(ctx, 'comparisonTip');
          if (tip.source) {
            sources.push(tip.source);
            parts.push('，' + tip.value);
          }
          parts.push('。');
        }
      } else {
        parts.push('。');
      }

      return {
        text: parts.join(''),
        sources: sources
      };
    }
  },

  {
    patterns: ['窨制', '工艺', '几次', '怎么做的', '怎么做'],
    answer: function(ctx) {
      var sources = [];

      var scentTimes = pickField(ctx, 'scentingTimes');
      if (!scentTimes.source) {
        return { noData: true, reason: '暂无该批次窨制工艺信息记录。' };
      }
      sources.push(scentTimes.source);

      var parts = ['本批次窨制次数：' + scentTimes.value + ' 次'];

      var duration = pickField(ctx, 'scentingDuration');
      if (duration.source) {
        sources.push(duration.source);
        parts.push('，每次窨制时长约 ' + duration.value + ' 小时');
      }
      var temp = pickField(ctx, 'scentingTemperature');
      if (temp.source) {
        sources.push(temp.source);
        parts.push('，窨制温度 ' + temp.value + '℃');
      }
      var hum = pickField(ctx, 'scentingHumidity');
      if (hum.source) {
        sources.push(hum.source);
        parts.push('，湿度 ' + hum.value + '%');
      }
      var ratio = pickField(ctx, 'scentingRatio');
      if (ratio.source) {
        sources.push(ratio.source);
        parts.push('，花茶配比 ' + ratio.value);
      }
      var clean = pickField(ctx, 'workshopCleanliness');
      if (clean.source) {
        sources.push(clean.source);
        parts.push('，车间洁净度 ' + clean.value);
      }
      parts.push('。');

      return {
        text: parts.join(''),
        sources: sources
      };
    }
  },

  {
    patterns: ['冲泡', '泡茶', '怎么泡', '水温', '泡多久'],
    answer: function(ctx) {
      var sources = [];

      var waterTemp = pickField(ctx, 'waterTemp');
      if (!waterTemp.source) {
        return { noData: true, reason: '暂无该批次冲泡建议记录。' };
      }
      sources.push(waterTemp.source);

      var parts = ['建议水温 ' + waterTemp.value];

      var time = pickField(ctx, 'brewingTime');
      if (time.source) {
        sources.push(time.source);
        parts.push('，冲泡时长 ' + time.value);
      }
      var rebrew = pickField(ctx, 'rebrewTimes');
      if (rebrew.source) {
        sources.push(rebrew.source);
        parts.push('，可续泡 ' + rebrew.value + ' 次');
      }
      var wtype = pickField(ctx, 'waterType');
      if (wtype.source) {
        sources.push(wtype.source);
        parts.push('，推荐用水：' + wtype.value);
      }
      var teaware = pickField(ctx, 'teawareType');
      if (teaware.source) {
        sources.push(teaware.source);
        parts.push('，推荐茶具：' + teaware.value);
      }
      parts.push('。');

      var tips = pickField(ctx, 'brewTips');
      if (tips.source && Array.isArray(tips.value) && tips.value.length > 0) {
        sources.push(tips.source);
        parts.push('小贴士：' + tips.value.join('；') + '。');
      }

      return {
        text: parts.join(''),
        sources: sources
      };
    }
  },

  {
    patterns: ['树龄', '多少年', '多老', '古树'],
    answer: function(ctx) {
      var sources = [];
      var parts = [];

      var teaAge = pickField(ctx, 'teaTreeAge');
      if (teaAge.source) {
        sources.push(teaAge.source);
        parts.push('茶树龄 ' + teaAge.value + ' 年');
        var teaLoc = pickField(ctx, 'teaTreeLocation');
        if (teaLoc.source) {
          sources.push(teaLoc.source);
          parts.push('（产地：' + teaLoc.value + '）');
        }
      }

      var osmAge = pickField(ctx, 'osmanthusTreeAge');
      if (osmAge.source) {
        sources.push(osmAge.source);
        if (parts.length > 0) parts.push('；');
        parts.push('桂花树龄 ' + osmAge.value + ' 年');
        var osmLoc = pickField(ctx, 'osmanthusTreeLocation');
        if (osmLoc.source) {
          sources.push(osmLoc.source);
          parts.push('（产地：' + osmLoc.value + '）');
        }
      }

      if (sources.length === 0) {
        return { noData: true, reason: '暂无该批次树龄信息记录。' };
      }

      parts.push('。');
      return {
        text: parts.join(''),
        sources: sources
      };
    }
  },

  {
    patterns: ['品种', '什么花', '桂花品种', '什么品种'],
    answer: function(ctx) {
      var sources = [];

      var variety = pickField(ctx, 'variety');
      if (!variety.source) {
        return { noData: true, reason: '暂无该批次桂花品种信息记录。' };
      }
      sources.push(variety.source);

      var parts = ['本批次桂花品种为' + variety.value];

      var color = pickField(ctx, 'osmanthusColor');
      if (color.source) {
        sources.push(color.source);
        parts.push('，花色' + color.value);
      }
      var frag = pickField(ctx, 'osmanthusFragrance');
      if (frag.source) {
        sources.push(frag.source);
        parts.push('，香气' + frag.value);
      }
      var origin = pickField(ctx, 'osmanthusOrigin');
      if (origin.source) {
        sources.push(origin.source);
        parts.push('，原产地' + origin.value);
      }
      parts.push('。');

      return {
        text: parts.join(''),
        sources: sources
      };
    }
  },

  {
    patterns: ['保质', '过期', '储存', '保存', '能放多久'],
    answer: function(ctx) {
      var sources = [];

      var best = pickField(ctx, 'bestBeforeDate');
      if (!best.source) {
        return { noData: true, reason: '暂无该批次保质期信息记录。' };
      }
      sources.push(best.source);

      var parts = ['保质期至 ' + best.value + '。'];

      var cond = pickField(ctx, 'storageCondition');
      if (cond.source) {
        sources.push(cond.source);
        parts.push('储存条件：' + cond.value + '。');
      }
      var tips = pickField(ctx, 'storageTips');
      if (tips.source && Array.isArray(tips.value) && tips.value.length > 0) {
        sources.push(tips.source);
        parts.push('储存建议：' + tips.value.join('；') + '。');
      }

      return {
        text: parts.join(''),
        sources: sources
      };
    }
  },

  {
    patterns: ['绿色', '有机', '环保', '认证'],
    answer: function(ctx) {
      var sources = [];
      var parts = [];

      var plant = pickField(ctx, 'ecoPlantingCert');
      if (plant.source) {
        sources.push(plant.source);
        parts.push('种植认证：' + plant.value);
      }
      var pack = pickField(ctx, 'ecoPackingCert');
      if (pack.source) {
        sources.push(pack.source);
        if (parts.length > 0) parts.push('；');
        parts.push('包装认证：' + pack.value);
      }
      var carbon = pickField(ctx, 'carbonReduction');
      if (carbon.source) {
        sources.push(carbon.source);
        if (parts.length > 0) parts.push('；');
        parts.push('物流减碳：' + carbon.value);
      }

      if (sources.length === 0) {
        return { noData: true, reason: '暂无该批次绿色认证/环保信息记录。' };
      }

      parts.push('。');
      return {
        text: parts.join(''),
        sources: sources
      };
    }
  },

  {
    patterns: ['区块链', '存证', '上链', '不可篡改'],
    answer: function(ctx) {
      var sources = [];

      var chain = pickField(ctx, 'bcChainName');
      if (!chain.source) {
        return { noData: true, reason: '暂无该批次区块链存证信息记录。' };
      }
      sources.push(chain.source);

      var parts = ['已上链至' + chain.value];

      var status = pickField(ctx, 'bcVerifyStatus');
      if (status.source) {
        sources.push(status.source);
        parts.push('，存证状态：' + status.value);
      }
      parts.push('。');

      return {
        text: parts.join(''),
        sources: sources
      };
    }
  },

  {
    patterns: ['产地', '哪里', '来自哪', '哪里产', '原产地'],
    answer: function(ctx) {
      var sources = [];
      var parts = [];

      var teaLoc = pickField(ctx, 'teaTreeLocation');
      if (teaLoc.source) {
        sources.push(teaLoc.source);
        parts.push('茶树产地：' + teaLoc.value);
      }
      var osmLoc = pickField(ctx, 'osmanthusTreeLocation');
      if (osmLoc.source) {
        sources.push(osmLoc.source);
        if (parts.length > 0) parts.push('；');
        parts.push('桂花产地：' + osmLoc.value);
      }
      var origin = pickField(ctx, 'osmanthusOrigin');
      if (origin.source) {
        sources.push(origin.source);
        if (parts.length > 0) parts.push('；');
        parts.push('桂花原产地：' + origin.value);
      }

      if (sources.length === 0) {
        return { noData: true, reason: '暂无该批次产地信息记录。' };
      }

      parts.push('。');
      return {
        text: parts.join(''),
        sources: sources
      };
    }
  },

  {
    patterns: ['采摘', '什么时候采', '采摘时间'],
    answer: function(ctx) {
      var sources = [];
      var parts = [];

      var pick = pickField(ctx, 'pickTime');
      if (pick.source) {
        sources.push(pick.source);
        parts.push('茶叶采摘时间：' + pick.value);
      }
      var osmPick = pickField(ctx, 'osmanthusPickTime');
      if (osmPick.source) {
        sources.push(osmPick.source);
        if (parts.length > 0) parts.push('；');
        parts.push('桂花采摘时间：' + osmPick.value);
      }

      if (sources.length === 0) {
        return { noData: true, reason: '暂无该批次采摘时间记录。' };
      }

      parts.push('。');
      return {
        text: parts.join(''),
        sources: sources
      };
    }
  },

  {
    patterns: ['故事', '历史', '古茶树.*故事', '茶树故事'],
    answer: function(ctx) {
      var teaStory = pickField(ctx, 'teaTreeStory');
      if (teaStory.source) {
        return {
          text: '古茶树故事：' + teaStory.value,
          sources: [teaStory.source]
        };
      }
      var osmStory = pickField(ctx, 'osmanthusTreeStory');
      if (osmStory.source) {
        return {
          text: '桂花树故事：' + osmStory.value,
          sources: [osmStory.source]
        };
      }
      return { noData: true, reason: '暂无该批次茶树故事记录。' };
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
        var regex = new RegExp(patterns[j], 'i');
        if (regex.test(q)) {
          return rule;
        }
      } catch (e) {
        if (q.toLowerCase().indexOf(patterns[j].toLowerCase()) !== -1) {
          return rule;
        }
      }
    }
  }
  return null;
}

/**
 * 统一回答入口
 * @returns {
 *   type: 'empty' | 'sensitive' | 'answer' | 'no_data' | 'unknown',
 *   answer: string,
 *   sources?: Array<{key, label, value}>,
 * }
 */
function answerQuestion(question, traceData) {
  if (!question || !question.trim()) {
    return {
      type: 'empty',
      answer: '请输入您的问题，例如：这批次适合送长辈吗？',
      sources: []
    };
  }

  var trimmed = question.trim();

  if (isSensitive(trimmed)) {
    return {
      type: 'sensitive',
      answer: '您的问题涉及敏感事项，为确保您的权益，已为您转接人工客服。请拨打客服热线：400-888-0000，或前往"我的 → 客服中心"提交工单。',
      sources: []
    };
  }

  var ctx = buildContext(traceData);
  var rule = findMatchingRule(trimmed);

  if (!rule) {
    return {
      type: 'unknown',
      answer: '抱歉，我暂无法回答该问题。您可以尝试问我：品种信息、树龄、窨制工艺、检测报告、冲泡建议、保质期、产地、绿色认证等溯源相关问题。如需其他帮助，请联系人工客服。',
      sources: []
    };
  }

  var result = rule.answer(ctx);
  if (result && result.noData) {
    return {
      type: 'no_data',
      answer: result.reason,
      sources: []
    };
  }

  return {
    type: 'answer',
    answer: result.text,
    sources: result.sources || []
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
    id: message.id || Date.now().toString(),
    role: message.role,
    content: message.content,
    type: message.type || 'answer',
    sources: message.sources || [],
    timestamp: message.timestamp || Date.now()
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
  FIELD_LABELS: FIELD_LABELS,
  SENSITIVE_KEYWORDS: SENSITIVE_KEYWORDS,
  SUGGESTED_QUESTIONS: SUGGESTED_QUESTIONS
};
