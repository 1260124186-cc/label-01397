var userStore = require('./userStore.js');
var mockData = require('./mockData.js');

var CLAIM_STORAGE_KEY = 'quality_claim_tickets';

var CLAIM_STATUS = {
  SUBMITTED: 'submitted',
  INITIAL_REVIEW: 'initial_review',
  SAMPLE_OR_ONSITE: 'sample_or_onsite',
  APPRAISAL: 'appraisal',
  COMPENSATION: 'compensation',
  COMPLETED: 'completed',
  REJECTED: 'rejected',
  ESCALATED: 'escalated'
};

var CLAIM_STATUS_LABEL = {
  submitted: '已提交',
  initial_review: '初审中',
  sample_or_onsite: '寄样/上门',
  appraisal: '鉴定中',
  compensation: '补偿中',
  completed: '已完成',
  rejected: '已驳回',
  escalated: '已升级'
};

var CLAIM_STATUS_COLOR = {
  submitted: '#1890FF',
  initial_review: '#FAAD14',
  sample_or_onsite: '#FF7A45',
  appraisal: '#722ED1',
  compensation: '#2F54EB',
  completed: '#52C41A',
  rejected: '#FF4D4F',
  escalated: '#EB2F96'
};

var CLAIM_STATUS_ORDER = [
  CLAIM_STATUS.SUBMITTED,
  CLAIM_STATUS.INITIAL_REVIEW,
  CLAIM_STATUS.SAMPLE_OR_ONSITE,
  CLAIM_STATUS.APPRAISAL,
  CLAIM_STATUS.COMPENSATION,
  CLAIM_STATUS.COMPLETED
];

var PROBLEM_TYPES = [
  { key: 'quality_issue', label: '质量问题', icon: '🔬', desc: '产品品质异常、变质、异味等' },
  { key: 'recall_compensation', label: '召回补偿', icon: '⚠️', desc: '召回批次产品登记补偿' },
  { key: 'logistics_damage', label: '物流破损', icon: '📦', desc: '运输破损、包装损坏、漏洒等' }
];

var EXPECTED_SOLUTIONS = [
  { key: 'refund', label: '退款', icon: '💰', desc: '全额或部分退款' },
  { key: 'exchange', label: '换货', icon: '🔄', desc: '更换同款或等价产品' },
  { key: 'points', label: '积分补偿', icon: '🎁', desc: '赠送积分/优惠券补偿' }
];

var COMPENSATION_TYPES = {
  REFUND: 'refund',
  EXCHANGE: 'exchange',
  POINTS: 'points'
};

var COMPENSATION_TYPE_LABEL = {
  refund: '退款',
  exchange: '换货',
  points: '积分补偿'
};

var SLA_CONFIG = {
  initial_review: { hours: 2, label: '初审响应' },
  sample_or_onsite: { hours: 24, label: '寄样/上门安排' },
  appraisal: { hours: 48, label: '鉴定完成' },
  compensation: { hours: 24, label: '补偿到账' }
};

var ESCALATION_THRESHOLD_HOURS = {
  initial_review: 4,
  sample_or_onsite: 48,
  appraisal: 72,
  compensation: 48
};

function generateClaimId() {
  var now = new Date();
  var dateStr = now.getFullYear().toString() +
    (now.getMonth() + 1).toString().padStart(2, '0') +
    now.getDate().toString().padStart(2, '0');
  var random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return 'CL' + dateStr + random;
}

function getClaims() {
  try {
    var claims = wx.getStorageSync(CLAIM_STORAGE_KEY);
    return Array.isArray(claims) ? claims : [];
  } catch (e) {
    console.error('[claimService] 获取理赔工单列表失败:', e);
    return [];
  }
}

function saveClaims(claims) {
  try {
    wx.setStorageSync(CLAIM_STORAGE_KEY, claims);
    return true;
  } catch (e) {
    console.error('[claimService] 保存理赔工单失败:', e);
    return false;
  }
}

function maskBankAccount(account) {
  if (!account) return '';
  var str = String(account);
  if (str.length <= 8) return str;
  var prefix = str.substring(0, 4);
  var suffix = str.substring(str.length - 4);
  var middle = '';
  for (var i = 0; i < str.length - 8; i++) {
    middle += '*';
  }
  return prefix + middle + suffix;
}

function maskPhone(phone) {
  if (!phone) return '';
  var str = String(phone);
  if (str.length < 7) return str;
  return str.substring(0, 3) + '****' + str.substring(str.length - 4);
}

function maskIdCard(idCard) {
  if (!idCard) return '';
  var str = String(idCard);
  if (str.length < 10) return str;
  return str.substring(0, 6) + '********' + str.substring(str.length - 4);
}

function maskAlipayAccount(account) {
  if (!account) return '';
  var str = String(account);
  var atIndex = str.indexOf('@');
  if (atIndex !== -1) {
    var prefix = str.substring(0, atIndex);
    var suffix = str.substring(atIndex);
    if (prefix.length <= 2) return prefix + suffix;
    return prefix.substring(0, 2) + '***' + suffix;
  }
  return maskPhone(str);
}

function calculateSlaDeadline(status, referenceTime) {
  var config = SLA_CONFIG[status];
  if (!config) return null;
  var ref = referenceTime || Date.now();
  return ref + config.hours * 60 * 60 * 1000;
}

function getSlaRemainingInfo(claim) {
  if (!claim || claim.slaDeadline == null) {
    return { expired: false, remainingText: '-', remainingHours: 0, percentage: 0 };
  }
  var now = Date.now();
  var remaining = claim.slaDeadline - now;
  var totalHours = claim.slaTotalHours || 0;
  var elapsed = totalHours * 3600 * 1000 - remaining;
  var percentage = totalHours > 0 ? Math.max(0, Math.min(100, (elapsed / (totalHours * 3600 * 1000)) * 100)) : 0;

  if (remaining <= 0) {
    return { expired: true, remainingText: '已超时', remainingHours: 0, percentage: 100 };
  }

  var remainingHours = remaining / (1000 * 60 * 60);
  var hours = Math.floor(remainingHours);
  var minutes = Math.floor((remainingHours - hours) * 60);

  var text = '';
  if (hours > 24) {
    var days = Math.floor(hours / 24);
    text = days + '天' + (hours % 24) + '小时';
  } else if (hours > 0) {
    text = hours + '小时' + minutes + '分钟';
  } else {
    text = minutes + '分钟';
  }

  return {
    expired: false,
    remainingText: '剩余' + text,
    remainingHours: remainingHours,
    percentage: percentage
  };
}

function checkAndEscalate(claimId) {
  var claims = getClaims();
  var index = claims.findIndex(function(c) { return c.id === claimId; });
  if (index === -1) return false;

  var claim = claims[index];
  var slaInfo = getSlaRemainingInfo(claim);
  var threshold = ESCALATION_THRESHOLD_HOURS[claim.status];

  if (slaInfo.expired && !claim.isEscalated &&
      claim.status !== CLAIM_STATUS.COMPLETED &&
      claim.status !== CLAIM_STATUS.REJECTED) {
    claims[index].isEscalated = true;
    claims[index].escalatedAt = Date.now();
    claims[index].escalationReason = 'SLA超时自动升级：' + CLAIM_STATUS_LABEL[claim.status] + '环节超时';
    claims[index].statusTimeline.push({
      status: CLAIM_STATUS.ESCALATED,
      timestamp: Date.now(),
      message: '⚠️ 系统自动升级：' + CLAIM_STATUS_LABEL[claim.status] + '环节已超时，已通知主管介入处理'
    });
    claims[index].updatedAt = Date.now();
    saveClaims(claims);

    userStore.addNotification({
      type: 'claim_escalation',
      title: '理赔工单升级提醒',
      content: '理赔工单 ' + claimId + ' 因处理超时已自动升级，主管正在介入。',
      extra: { url: '/pages/claim/detail?id=' + claimId }
    });

    return true;
  }
  return false;
}

function checkAllEscalations() {
  var claims = getClaims();
  var escalatedCount = 0;
  for (var i = 0; i < claims.length; i++) {
    if (checkAndEscalate(claims[i].id)) {
      escalatedCount++;
    }
  }
  return escalatedCount;
}

function sendCompletionNotification(claim) {
  var solText = COMPENSATION_TYPE_LABEL[claim.compensationType] || claim.expectedSolutionLabel;
  var detailText = '';
  if (claim.compensationType === COMPENSATION_TYPES.REFUND) {
    detailText = '退款金额 ' + (claim.compensationAmount || 0) + ' 元已原路返回';
  } else if (claim.compensationType === COMPENSATION_TYPES.EXCHANGE) {
    detailText = '换货产品已发出，快递单号：' + (claim.trackingNo || '已安排');
  } else if (claim.compensationType === COMPENSATION_TYPES.POINTS) {
    detailText = '已赠送 ' + (claim.compensationPoints || 0) + ' 积分/优惠券';
  }

  userStore.addNotification({
    type: 'claim_compensation',
    title: '理赔补偿已完成',
    content: '【' + claim.problemTypeLabel + '】理赔工单已完成，' + solText + '方案已执行：' + detailText,
    extra: { url: '/pages/claim/detail?id=' + claim.id, traceId: claim.traceId }
  });
}

function createClaim(formData) {
  var claims = getClaims();
  var claimId = generateClaimId();
  var now = Date.now();

  var problemType = PROBLEM_TYPES.find(function(t) { return t.key === formData.problemType; });
  var expectedSolution = EXPECTED_SOLUTIONS.find(function(s) { return s.key === formData.expectedSolution; });

  var slaConfig = SLA_CONFIG[CLAIM_STATUS.INITIAL_REVIEW];
  var slaDeadline = calculateSlaDeadline(CLAIM_STATUS.INITIAL_REVIEW, now);

  var productInfo = null;
  var traceData = null;
  if (formData.traceId) {
    traceData = mockData.getTraceData(formData.traceId);
    if (traceData && traceData.basicInfo) {
      productInfo = {
        productName: traceData.basicInfo.productName,
        batchNo: traceData.basicInfo.batchNo,
        thumbnail: traceData.basicInfo.thumbnail,
        specification: traceData.basicInfo.specification
      };
    }
  }

  var isAbnormalBatch = false;
  var isRecallBatch = false;
  if (formData.traceId === 'G002' || (productInfo && productInfo.batchNo === 'GH202504')) {
    isAbnormalBatch = true;
    var recallInfo = mockData.getRecallByTraceId(formData.traceId);
    if (recallInfo) {
      isRecallBatch = true;
    }
  }
  if (formData.problemType === 'recall_compensation') {
    isRecallBatch = true;
  }

  var newClaim = {
    id: claimId,
    traceId: formData.traceId || '',
    problemType: formData.problemType,
    problemTypeLabel: problemType ? problemType.label : '',
    expectedSolution: formData.expectedSolution,
    expectedSolutionLabel: expectedSolution ? expectedSolution.label : '',
    title: formData.title || (problemType ? problemType.label : '') + '理赔申请',
    description: formData.description || '',
    images: formData.images || [],
    contact: formData.contact || '',
    maskedContact: maskPhone(formData.contact),

    bankAccount: formData.bankAccount || (formData.accountType === 'bank' ? formData.accountNumber : ''),
    maskedBankAccount: maskBankAccount(formData.bankAccount || (formData.accountType === 'bank' ? formData.accountNumber : '')),
    bankAccountName: formData.bankAccountName || '',
    bankName: formData.bankName || '',
    alipayAccount: formData.alipayAccount || (formData.accountType === 'alipay' ? formData.accountNumber : ''),
    maskedAlipayAccount: maskAlipayAccount(formData.alipayAccount || (formData.accountType === 'alipay' ? formData.accountNumber : '')),

    productInfo: productInfo,
    isAbnormalBatch: isAbnormalBatch,
    isRecallBatch: isRecallBatch,
    recallSource: formData.recallSource || '',
    relatedRecallRegistrationId: formData.relatedRecallRegistrationId || '',

    shippingAddress: formData.shippingAddress || null,
    isExchangeNeeded: formData.expectedSolution === 'exchange',
    sampleMethod: null,

    status: CLAIM_STATUS.SUBMITTED,
    currentStep: 0,
    createdAt: now,
    updatedAt: now,
    slaDeadline: slaDeadline,
    slaTotalHours: slaConfig ? slaConfig.hours : 0,
    slaConfigKey: CLAIM_STATUS.INITIAL_REVIEW,
    isEscalated: false,

    appraisalResult: null,
    appraisalConclusion: '',
    appraisalImages: [],
    appraisalReportNo: '',

    compensationType: null,
    compensationAmount: null,
    compensationPoints: null,
    trackingNo: null,

    statusTimeline: [
      {
        status: CLAIM_STATUS.SUBMITTED,
        timestamp: now,
        message: '理赔申请已提交，等待客服初审' + (isAbnormalBatch ? '（G002异常批次，已标记优先处理）' : '')
      }
    ]
  };

  claims.unshift(newClaim);
  saveClaims(claims);

  simulateClaimProgress(claimId, isAbnormalBatch, isRecallBatch);

  return newClaim;
}

function simulateClaimProgress(claimId, isAbnormalBatch, isRecallBatch) {
  var baseDelay = isAbnormalBatch ? 1500 : 3000;

  setTimeout(function() {
    updateClaimStatus(claimId, CLAIM_STATUS.INITIAL_REVIEW,
      '客服已受理，正在核实产品信息与问题描述' + (isRecallBatch ? '（召回批次已自动匹配）' : ''));
  }, baseDelay);

  setTimeout(function() {
    var claim = getClaimById(claimId);
    if (!claim || claim.status !== CLAIM_STATUS.INITIAL_REVIEW) return;

    var needSample = claim.problemType === 'quality_issue' || claim.problemType === 'logistics_damage';
    var sampleMessage = '';
    if (claim.problemType === 'quality_issue') {
      sampleMessage = '初审通过，需您寄送问题样品至指定地址，或安排质检员上门检测';
      updateClaimSampleMethod(claimId, 'mail_sample');
    } else if (claim.problemType === 'logistics_damage') {
      if (claim.expectedSolution === 'exchange') {
        sampleMessage = '初审通过，已确认物流破损，无需寄样，请确认收货地址用于换货';
      } else {
        sampleMessage = '初审通过，已确认物流破损，无需寄样，请确认收款账户';
      }
      updateClaimSampleMethod(claimId, 'none');
    } else if (claim.problemType === 'recall_compensation') {
      sampleMessage = '初审通过，召回批次信息已匹配，无需寄样，正在核算补偿方案';
      updateClaimSampleMethod(claimId, 'none');
    }
    updateClaimStatus(claimId, CLAIM_STATUS.SAMPLE_OR_ONSITE, sampleMessage);
  }, baseDelay + (isAbnormalBatch ? 2000 : 5000));

  setTimeout(function() {
    var claim = getClaimById(claimId);
    if (!claim || claim.status !== CLAIM_STATUS.SAMPLE_OR_ONSITE) return;

    var appraisalMsg = '';
    if (claim.problemType === 'quality_issue') {
      appraisalMsg = '已收到样品，正在进行质量鉴定（农残留、含水率、香气成分检测）';
    } else if (claim.problemType === 'logistics_damage') {
      appraisalMsg = '已确认物流破损程度：外包装' + (Math.random() > 0.5 ? '轻微破损' : '严重破损') + '，内物完好度85%';
    } else if (claim.problemType === 'recall_compensation') {
      appraisalMsg = '召回批次确认：G002批次GH202504，农残检测氯氰菊酯超标27.5%，符合召回补偿条件';
    }
    updateClaimStatus(claimId, CLAIM_STATUS.APPRAISAL, appraisalMsg);
    updateAppraisalResult(claimId);
  }, baseDelay + (isAbnormalBatch ? 5000 : 12000));

  setTimeout(function() {
    var claim = getClaimById(claimId);
    if (!claim || claim.status !== CLAIM_STATUS.APPRAISAL) return;

    var compType = claim.expectedSolution;
    var compMsg = '';
    var amount = 0;
    var points = 0;

    if (claim.problemType === 'recall_compensation' || claim.isAbnormalBatch) {
      amount = 128;
      points = 500;
    } else if (claim.problemType === 'logistics_damage') {
      amount = compType === 'refund' ? 68 : 0;
      points = compType === 'points' ? 300 : 0;
    } else {
      amount = compType === 'refund' ? 88 : 0;
      points = compType === 'points' ? 400 : 0;
    }

    if (compType === COMPENSATION_TYPES.REFUND) {
      compMsg = '鉴定完成，执行退款方案：退款 ' + amount + ' 元，款项将在3个工作日内原路退回至您的账户：' + (claim.maskedBankAccount || claim.maskedAlipayAccount || '尾号****');
    } else if (compType === COMPENSATION_TYPES.EXCHANGE) {
      compMsg = '鉴定完成，执行换货方案：同款产品已安排发出，快递单号：SF' + Math.floor(Math.random() * 1000000000000);
    } else if (compType === COMPENSATION_TYPES.POINTS) {
      compMsg = '鉴定完成，执行积分补偿方案：已赠送 ' + points + ' 积分 + 50元优惠券至您的账户';
    }

    updateCompensationDetail(claimId, compType, amount, points, compMsg);
    updateClaimStatus(claimId, CLAIM_STATUS.COMPENSATION, compMsg);
  }, baseDelay + (isAbnormalBatch ? 9000 : 22000));

  setTimeout(function() {
    var claim = getClaimById(claimId);
    if (!claim || claim.status !== CLAIM_STATUS.COMPENSATION) return;

    var completeMsg = '✅ 理赔已完成，感谢您的反馈与支持';
    updateClaimStatus(claimId, CLAIM_STATUS.COMPLETED, completeMsg);

    var finalClaim = getClaimById(claimId);
    if (finalClaim) {
      sendCompletionNotification(finalClaim);
    }
  }, baseDelay + (isAbnormalBatch ? 12000 : 30000));
}

function updateClaimSampleMethod(claimId, method) {
  var claims = getClaims();
  var index = claims.findIndex(function(c) { return c.id === claimId; });
  if (index === -1) return null;
  claims[index].sampleMethod = method;
  claims[index].updatedAt = Date.now();
  saveClaims(claims);
  return claims[index];
}

function updateAppraisalResult(claimId) {
  var claims = getClaims();
  var index = claims.findIndex(function(c) { return c.id === claimId; });
  if (index === -1) return null;

  var claim = claims[index];
  var result = {
    passed: false,
    abnormalItems: [],
    reportNo: 'QC' + Date.now()
  };

  if (claim.problemType === 'quality_issue') {
    result.passed = false;
    result.abnormalItems = [
      { item: '含水率', value: '8.5%', limit: '≤7.0%', status: '不合格' },
      { item: '香气评分', value: '72分', limit: '≥80分', status: '不合格' }
    ];
    result.conclusion = '产品存在质量异常，符合理赔条件';
  } else if (claim.problemType === 'logistics_damage') {
    result.passed = true;
    result.abnormalItems = [];
    result.conclusion = '物流破损属实，支持理赔申请';
  } else if (claim.problemType === 'recall_compensation') {
    result.passed = false;
    result.abnormalItems = [
      { item: '氯氰菊酯', value: '25.5 mg/kg', limit: '≤20 mg/kg', status: '超标' }
    ];
    result.conclusion = '召回批次确认，农残超标，符合召回补偿政策';
  }

  claims[index].appraisalResult = result;
  claims[index].appraisalConclusion = result.conclusion;
  claims[index].appraisalReportNo = result.reportNo;
  claims[index].updatedAt = Date.now();
  saveClaims(claims);
  return claims[index];
}

function updateCompensationDetail(claimId, compType, amount, points, msg) {
  var claims = getClaims();
  var index = claims.findIndex(function(c) { return c.id === claimId; });
  if (index === -1) return null;

  claims[index].compensationType = compType;
  claims[index].compensationAmount = amount;
  claims[index].compensationPoints = points;
  if (compType === COMPENSATION_TYPES.EXCHANGE) {
    claims[index].trackingNo = 'SF' + Math.floor(Math.random() * 1000000000000);
  }
  claims[index].updatedAt = Date.now();
  saveClaims(claims);
  return claims[index];
}

function updateClaimStatus(claimId, newStatus, message) {
  var claims = getClaims();
  var index = claims.findIndex(function(c) { return c.id === claimId; });
  if (index === -1) return null;

  var statusIndex = CLAIM_STATUS_ORDER.indexOf(newStatus);
  var slaDeadline = null;
  var slaTotalHours = 0;
  var slaConfigKey = null;

  if (statusIndex >= 0 && statusIndex < CLAIM_STATUS_ORDER.length - 1) {
    var nextStatus = CLAIM_STATUS_ORDER[statusIndex + 1];
    if (SLA_CONFIG[nextStatus]) {
      slaConfigKey = nextStatus;
      slaDeadline = calculateSlaDeadline(nextStatus, Date.now());
      slaTotalHours = SLA_CONFIG[nextStatus].hours;
    }
  }

  claims[index].status = newStatus;
  claims[index].currentStep = statusIndex >= 0 ? statusIndex : claims[index].currentStep;
  claims[index].updatedAt = Date.now();
  claims[index].statusTimeline.push({
    status: newStatus,
    timestamp: Date.now(),
    message: message || ''
  });

  if (slaDeadline !== null) {
    claims[index].slaDeadline = slaDeadline;
    claims[index].slaTotalHours = slaTotalHours;
    claims[index].slaConfigKey = slaConfigKey;
  }

  saveClaims(claims);
  return claims[index];
}

function getClaimById(claimId) {
  var claims = getClaims();
  return claims.find(function(c) { return c.id === claimId; }) || null;
}

function getClaimsByTraceId(traceId) {
  var claims = getClaims();
  return claims.filter(function(c) { return c.traceId === traceId; });
}

function updateClaim(claimId, updates) {
  var claims = getClaims();
  var index = claims.findIndex(function(c) { return c.id === claimId; });
  if (index === -1) return null;

  claims[index] = Object.assign({}, claims[index], updates, { updatedAt: Date.now() });
  saveClaims(claims);
  return claims[index];
}

function convertFromRecallRegistration(registrationId, formData) {
  var recallService = null;
  try {
    recallService = require('./recallService.js');
  } catch (e) {}

  if (!recallService) {
    return { success: false, error: '召回服务不可用' };
  }

  var registration = recallService.getRegistrationById(registrationId);
  if (!registration) {
    return { success: false, error: '召回登记不存在' };
  }

  var claimForm = Object.assign({}, {
    traceId: registration.traceId,
    problemType: 'recall_compensation',
    expectedSolution: 'refund',
    title: '召回补偿 - ' + (registration.productName || ''),
    description: '召回批次号：' + registration.batchNo + '\n购买渠道：' + registration.purchaseChannelLabel + '\n是否开封：' + (registration.isOpened ? '是' : '否') + '\n备注：' + (registration.remark || ''),
    images: registration.images,
    contact: registration.contact,
    recallSource: registration.source || 'brand_initiated',
    relatedRecallRegistrationId: registrationId
  }, formData || {});

  var claim = createClaim(claimForm);

  var relatedResult = recallService.setRelatedClaimId(registrationId, claim.id);

  if (relatedResult && relatedResult.alreadyExisted) {
    return { success: true, claimId: relatedResult.claimId, claim: claim, alreadyExisted: true };
  }

  return { success: true, claimId: claim.id, claim: claim };
}

function formatTime(timestamp) {
  if (!timestamp) return '';
  var date = new Date(timestamp);
  var now = new Date();

  var diffMs = now.getTime() - date.getTime();
  var diffMins = Math.floor(diffMs / (1000 * 60));
  var diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  var diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) {
    return '刚刚';
  } else if (diffMins < 60) {
    return diffMins + '分钟前';
  } else if (diffHours < 24) {
    return diffHours + '小时前';
  } else if (diffDays < 7) {
    return diffDays + '天前';
  } else {
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours().toString().padStart(2, '0');
    var minute = date.getMinutes().toString().padStart(2, '0');
    return month + '月' + day + '日 ' + hour + ':' + minute;
  }
}

function formatFullTime(timestamp) {
  if (!timestamp) return '';
  var date = new Date(timestamp);
  var year = date.getFullYear();
  var month = (date.getMonth() + 1).toString().padStart(2, '0');
  var day = date.getDate().toString().padStart(2, '0');
  var hour = date.getHours().toString().padStart(2, '0');
  var minute = date.getMinutes().toString().padStart(2, '0');
  return year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
}

function initMockClaims() {
  var claims = getClaims();
  if (claims.length > 0) return claims;

  var recallService = null;
  try { recallService = require('./recallService.js'); } catch (e) {}

  var mockClaims = [];
  var now = Date.now();

  var claim1 = {
    id: 'CL202506210001',
    traceId: 'G002',
    problemType: 'recall_compensation',
    problemTypeLabel: '召回补偿',
    expectedSolution: 'refund',
    expectedSolutionLabel: '退款',
    title: 'G002异常批次召回补偿申请',
    description: '购买了G002批次产品，看到召回公告，申请补偿。产品已开封饮用了一半。',
    images: [],
    contact: '13800138000',
    maskedContact: '138****8000',
    bankAccount: '',
    maskedBankAccount: '',
    bankAccountName: '',
    alipayAccount: 'user@example.com',
    maskedAlipayAccount: 'us**@example.com',
    productInfo: {
      productName: '银桂花茶',
      batchNo: 'GH202504',
      thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=silver%20osmanthus%20tea%20packaging%20elegant%20product%20photo&image_size=square',
      specification: '100g/罐'
    },
    isAbnormalBatch: true,
    isRecallBatch: true,
    recallSource: 'government_platform',
    relatedRecallRegistrationId: '',
    shippingAddress: null,
    isExchangeNeeded: false,
    sampleMethod: 'none',
    status: CLAIM_STATUS.COMPLETED,
    currentStep: 5,
    createdAt: now - 5 * 86400000,
    updatedAt: now - 3 * 86400000,
    slaDeadline: null,
    slaTotalHours: 0,
    slaConfigKey: null,
    isEscalated: false,
    appraisalResult: {
      passed: false,
      abnormalItems: [{ item: '氯氰菊酯', value: '25.5 mg/kg', limit: '≤20 mg/kg', status: '超标' }],
      conclusion: '召回批次确认，农残超标，符合召回补偿政策',
      reportNo: 'QC202506160001'
    },
    appraisalConclusion: '召回批次确认，农残超标，符合召回补偿政策',
    appraisalImages: [],
    appraisalReportNo: 'QC202506160001',
    compensationType: COMPENSATION_TYPES.REFUND,
    compensationAmount: 128,
    compensationPoints: 500,
    trackingNo: null,
    statusTimeline: [
      { status: CLAIM_STATUS.SUBMITTED, timestamp: now - 5 * 86400000, message: '理赔申请已提交，等待客服初审（G002异常批次，已标记优先处理）' },
      { status: CLAIM_STATUS.INITIAL_REVIEW, timestamp: now - 5 * 86400000 + 3600000, message: '客服已受理，正在核实产品信息与问题描述（召回批次已自动匹配）' },
      { status: CLAIM_STATUS.SAMPLE_OR_ONSITE, timestamp: now - 4 * 86400000, message: '初审通过，召回批次信息已匹配，无需寄样，正在核算补偿方案' },
      { status: CLAIM_STATUS.APPRAISAL, timestamp: now - 4 * 86400000 + 7200000, message: '召回批次确认：G002批次GH202504，农残检测氯氰菊酯超标27.5%，符合召回补偿条件' },
      { status: CLAIM_STATUS.COMPENSATION, timestamp: now - 3 * 86400000, message: '鉴定完成，执行退款方案：退款 128 元，款项将在3个工作日内原路退回至您的账户：us**@example.com' },
      { status: CLAIM_STATUS.COMPLETED, timestamp: now - 3 * 86400000 + 3600000, message: '✅ 理赔已完成，感谢您的反馈与支持' }
    ]
  };
  mockClaims.push(claim1);

  var claim2 = {
    id: 'CL202506190002',
    traceId: 'G001',
    problemType: 'logistics_damage',
    problemTypeLabel: '物流破损',
    expectedSolution: 'exchange',
    expectedSolutionLabel: '换货',
    title: '快递运输导致包装破损',
    description: '收到快递后发现外包装盒严重变形，内罐有凹陷，虽然茶叶应该没问题，但希望换一罐完好的。',
    images: [],
    contact: '13900139000',
    maskedContact: '139****9000',
    bankAccount: '',
    maskedBankAccount: '',
    bankAccountName: '',
    alipayAccount: '',
    maskedAlipayAccount: '',
    productInfo: {
      productName: '金桂花茶',
      batchNo: 'GH202503',
      thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=premium%20golden%20osmanthus%20tea%20tin%20can%20product%20photo&image_size=square',
      specification: '100g/罐'
    },
    isAbnormalBatch: false,
    isRecallBatch: false,
    recallSource: '',
    relatedRecallRegistrationId: '',
    shippingAddress: '湖北省武汉市武昌区XX路XX号XX小区3栋2单元801室',
    isExchangeNeeded: true,
    sampleMethod: 'none',
    status: CLAIM_STATUS.COMPENSATION,
    currentStep: 4,
    createdAt: now - 2 * 86400000,
    updatedAt: now - 86400000,
    slaDeadline: now + 12 * 3600000,
    slaTotalHours: 24,
    slaConfigKey: CLAIM_STATUS.COMPENSATION,
    isEscalated: false,
    appraisalResult: {
      passed: true,
      abnormalItems: [],
      conclusion: '物流破损属实，支持换货申请',
      reportNo: 'QC202506190002'
    },
    appraisalConclusion: '物流破损属实，支持换货申请',
    appraisalImages: [],
    appraisalReportNo: 'QC202506190002',
    compensationType: COMPENSATION_TYPES.EXCHANGE,
    compensationAmount: 0,
    compensationPoints: 0,
    trackingNo: 'SF1234567890123',
    statusTimeline: [
      { status: CLAIM_STATUS.SUBMITTED, timestamp: now - 2 * 86400000, message: '理赔申请已提交，等待客服初审' },
      { status: CLAIM_STATUS.INITIAL_REVIEW, timestamp: now - 2 * 86400000 + 5400000, message: '客服已受理，正在核实产品信息与问题描述' },
      { status: CLAIM_STATUS.SAMPLE_OR_ONSITE, timestamp: now - 2 * 86400000 + 18000000, message: '初审通过，已确认物流破损，无需寄样，请确认收货地址用于换货' },
      { status: CLAIM_STATUS.APPRAISAL, timestamp: now - 86400000, message: '已确认物流破损程度：外包装严重破损，内物完好度85%' },
      { status: CLAIM_STATUS.COMPENSATION, timestamp: now - 86400000 + 5400000, message: '鉴定完成，执行换货方案：同款产品已安排发出，快递单号：SF1234567890123' }
    ]
  };
  mockClaims.push(claim2);

  var claim3 = {
    id: 'CL202506200003',
    traceId: '',
    problemType: 'quality_issue',
    problemTypeLabel: '质量问题',
    expectedSolution: 'refund',
    expectedSolutionLabel: '退款',
    title: '冲泡后发现有霉味',
    description: '上周在专卖店购买的产品，冲泡后有明显霉味，汤色异常，不敢继续饮用。已保留部分样品。',
    images: [],
    contact: '13700137000',
    maskedContact: '137****7000',
    bankAccount: '6222021234567890123',
    maskedBankAccount: '6222**********90123',
    bankAccountName: '张**',
    alipayAccount: '',
    maskedAlipayAccount: '',
    productInfo: null,
    isAbnormalBatch: false,
    isRecallBatch: false,
    recallSource: '',
    relatedRecallRegistrationId: '',
    shippingAddress: null,
    isExchangeNeeded: false,
    sampleMethod: 'mail_sample',
    status: CLAIM_STATUS.SAMPLE_OR_ONSITE,
    currentStep: 2,
    createdAt: now - 3600000,
    updatedAt: now - 1800000,
    slaDeadline: now + 20 * 3600000,
    slaTotalHours: 24,
    slaConfigKey: CLAIM_STATUS.SAMPLE_OR_ONSITE,
    isEscalated: false,
    appraisalResult: null,
    appraisalConclusion: '',
    appraisalImages: [],
    appraisalReportNo: '',
    compensationType: null,
    compensationAmount: null,
    compensationPoints: null,
    trackingNo: null,
    statusTimeline: [
      { status: CLAIM_STATUS.SUBMITTED, timestamp: now - 3600000, message: '理赔申请已提交，等待客服初审' },
      { status: CLAIM_STATUS.INITIAL_REVIEW, timestamp: now - 3000000, message: '客服已受理，正在核实产品信息与问题描述' },
      { status: CLAIM_STATUS.SAMPLE_OR_ONSITE, timestamp: now - 1800000, message: '初审通过，需您寄送问题样品至指定地址，或安排质检员上门检测' }
    ]
  };
  mockClaims.push(claim3);

  saveClaims(mockClaims);

  if (recallService && typeof recallService.setRelatedClaimId === 'function') {
    try {
      var registrations = recallService.getRegistrationsByTraceId('G002') || [];
      if (registrations.length === 0) {
        var result = recallService.createRegistration({
          traceId: 'G002',
          batchNo: 'GH202504',
          purchaseChannel: 'online_store',
          purchaseChannelLabel: '官方商城',
          contact: '13800138000',
          isOpened: true,
          images: [],
          remark: '看到召回公告后主动登记，产品已开封饮用过半'
        });
        if (result && result.id) {
          registrations = [result];
        }
      }
      if (registrations.length > 0 && registrations[0].id) {
        mockClaims[0].relatedRecallRegistrationId = registrations[0].id;
        saveClaims(mockClaims);
        recallService.setRelatedClaimId(registrations[0].id, mockClaims[0].id);
      }
    } catch (e) {}
  }

  return mockClaims;
}

module.exports = {
  CLAIM_STATUS: CLAIM_STATUS,
  CLAIM_STATUS_LABEL: CLAIM_STATUS_LABEL,
  CLAIM_STATUS_COLOR: CLAIM_STATUS_COLOR,
  CLAIM_STATUS_ORDER: CLAIM_STATUS_ORDER,
  PROBLEM_TYPES: PROBLEM_TYPES,
  EXPECTED_SOLUTIONS: EXPECTED_SOLUTIONS,
  COMPENSATION_TYPES: COMPENSATION_TYPES,
  COMPENSATION_TYPE_LABEL: COMPENSATION_TYPE_LABEL,
  SLA_CONFIG: SLA_CONFIG,

  generateClaimId: generateClaimId,
  getClaims: getClaims,
  saveClaims: saveClaims,
  createClaim: createClaim,
  getClaimById: getClaimById,
  getClaimsByTraceId: getClaimsByTraceId,
  updateClaim: updateClaim,
  updateClaimStatus: updateClaimStatus,

  maskBankAccount: maskBankAccount,
  maskPhone: maskPhone,
  maskIdCard: maskIdCard,
  maskAlipayAccount: maskAlipayAccount,

  calculateSlaDeadline: calculateSlaDeadline,
  getSlaRemainingInfo: getSlaRemainingInfo,
  checkAndEscalate: checkAndEscalate,
  checkAllEscalations: checkAllEscalations,

  convertFromRecallRegistration: convertFromRecallRegistration,
  sendCompletionNotification: sendCompletionNotification,

  formatTime: formatTime,
  formatFullTime: formatFullTime,
  initMockClaims: initMockClaims
};
