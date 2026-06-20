const mockData = require('./mockData.js');
const ticketService = require('./ticketService.js');
const {
  PROVINCE_CONFIG,
  NATIONAL_CONFIG,
  GOV_PLATFORM_STATUS,
  getPlatformConfig
} = require('./govTraceConstants.js');

const RECALL_REGISTRATIONS_KEY = 'recall_registrations';
const GOV_RECALL_NOTIFICATIONS_KEY = 'gov_recall_notifications';

const memoryGovNotifications = [];

const RECALL_STATUS = {
  SUBMITTED: 'submitted',
  REVIEWING: 'reviewing',
  PENDING_RETURN: 'pending_return',
  PENDING_COMPENSATION: 'pending_compensation',
  COMPLETED: 'completed'
};

const RECALL_STATUS_LABEL = {
  submitted: '已提交',
  reviewing: '审核中',
  pending_return: '待退回',
  pending_compensation: '待补偿',
  completed: '已完成'
};

const RECALL_STATUS_COLOR = {
  submitted: '#1890FF',
  reviewing: '#FAAD14',
  pending_return: '#FF7A45',
  pending_compensation: '#722ED1',
  completed: '#52C41A'
};

const RECALL_SOURCES = {
  BRAND_INITIATED: 'brand_initiated',
  GOVERNMENT_PLATFORM: 'government_platform',
  CONSUMER_REPORT: 'consumer_report',
  MARKET_SUPERVISION: 'market_supervision'
};

const RECALL_SOURCE_LABELS = {
  brand_initiated: '品牌主动召回',
  government_platform: '政府平台责令召回',
  consumer_report: '消费者举报触发',
  market_supervision: '市场监督管理局'
};

const PURCHASE_CHANNELS = [
  { key: 'official_shop', label: '官方旗舰店', icon: '🏪' },
  { key: 'offline_store', label: '线下专卖店', icon: '🏬' },
  { key: 'supermarket', label: '商超渠道', icon: '🛒' },
  { key: 'dealer', label: '授权经销商', icon: '🤝' },
  { key: 'other', label: '其他渠道', icon: '📦' }
];

function generateRegistrationId() {
  const now = new Date();
  const dateStr = now.getFullYear().toString() +
    (now.getMonth() + 1).toString().padStart(2, '0') +
    now.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return 'RR' + dateStr + random;
}

function getRegistrations() {
  try {
    const registrations = wx.getStorageSync(RECALL_REGISTRATIONS_KEY);
    return Array.isArray(registrations) ? registrations : [];
  } catch (e) {
    console.error('[recallService] 获取召回登记失败:', e);
    return [];
  }
}

function saveRegistrations(registrations) {
  try {
    wx.setStorageSync(RECALL_REGISTRATIONS_KEY, registrations);
    return true;
  } catch (e) {
    console.error('[recallService] 保存召回登记失败:', e);
    return false;
  }
}

function createRegistration(formData) {
  const registrations = getRegistrations();
  const registrationId = generateRegistrationId();
  const now = Date.now();

  const recallInfo = mockData.getRecallByBatch(formData.batchNo) ||
    mockData.getRecallByTraceId(formData.traceId);

  const newRegistration = {
    id: registrationId,
    recallId: recallInfo ? recallInfo.recallId : '',
    batchNo: formData.batchNo || (recallInfo ? recallInfo.batchNo : ''),
    traceId: formData.traceId || '',
    productName: recallInfo ? recallInfo.productName : formData.productName || '',
    purchaseChannel: formData.purchaseChannel || '',
    purchaseChannelLabel: formData.purchaseChannelLabel || '',
    contact: formData.contact || '',
    isOpened: formData.isOpened === true || formData.isOpened === 'true',
    images: formData.images || [],
    remark: formData.remark || '',
    status: RECALL_STATUS.SUBMITTED,
    createdAt: now,
    updatedAt: now,
    statusTimeline: [
      {
        status: RECALL_STATUS.SUBMITTED,
        timestamp: now,
        message: '召回登记已提交，等待审核'
      }
    ],
    compensationAmount: null,
    ticketId: null
  };

  registrations.unshift(newRegistration);
  saveRegistrations(registrations);

  simulateRegistrationProgress(registrationId);

  return newRegistration;
}

function simulateRegistrationProgress(registrationId) {
  setTimeout(() => {
    updateRegistrationStatus(registrationId, RECALL_STATUS.REVIEWING, '客服已接单，正在核实信息');
  }, 5000);

  setTimeout(() => {
    const reg = getRegistrationById(registrationId);
    if (reg && reg.status === RECALL_STATUS.REVIEWING) {
      if (reg.isOpened) {
        updateRegistrationStatus(registrationId, RECALL_STATUS.PENDING_COMPENSATION,
          '信息核实完成，产品已开封，正在核算补偿金额');
        setTimeout(() => {
          const registrations = getRegistrations();
          const idx = registrations.findIndex(r => r.id === registrationId);
          if (idx !== -1) {
            registrations[idx].compensationAmount = 68;
            registrations[idx].updatedAt = Date.now();
            saveRegistrations(registrations);
          }
          updateRegistrationStatus(registrationId, RECALL_STATUS.COMPLETED,
            '补偿已完成，退款68元已原路退回，赠送50元优惠券已到账');
        }, 12000);
      } else {
        updateRegistrationStatus(registrationId, RECALL_STATUS.PENDING_RETURN,
          '信息核实完成，请将产品退回指定地址，退货运费到付');
        setTimeout(() => {
          updateRegistrationStatus(registrationId, RECALL_STATUS.COMPLETED,
            '已收到退回产品，全额退款已完成，赠品已发出');
        }, 15000);
      }
    }
  }, 12000);
}

function updateRegistrationStatus(registrationId, newStatus, message) {
  const registrations = getRegistrations();
  const index = registrations.findIndex(r => r.id === registrationId);
  if (index === -1) return null;

  registrations[index].status = newStatus;
  registrations[index].updatedAt = Date.now();
  registrations[index].statusTimeline.push({
    status: newStatus,
    timestamp: Date.now(),
    message: message || ''
  });

  saveRegistrations(registrations);
  return registrations[index];
}

function getRegistrationById(registrationId) {
  const registrations = getRegistrations();
  return registrations.find(r => r.id === registrationId) || null;
}

function getRegistrationsByTraceId(traceId) {
  const registrations = getRegistrations();
  return registrations.filter(r => r.traceId === traceId);
}

function getRegistrationsByBatch(batchNo) {
  const registrations = getRegistrations();
  return registrations.filter(r => r.batchNo === batchNo);
}

function convertToTicket(registrationId) {
  const registration = getRegistrationById(registrationId);
  if (!registration) {
    return { success: false, error: '召回登记不存在' };
  }

  if (registration.ticketId) {
    const existingTicket = ticketService.getTicketById(registration.ticketId);
    if (existingTicket) {
      return { success: true, ticketId: registration.ticketId, alreadyExisted: true };
    }
  }

  const ticket = ticketService.createTicket({
    type: 'product_recall',
    typeLabel: '产品召回',
    title: `召回登记转工单 - ${registration.productName}`,
    description: `批次号：${registration.batchNo}\n溯源ID：${registration.traceId}\n购买渠道：${registration.purchaseChannelLabel}\n是否开封：${registration.isOpened ? '是' : '否'}\n联系方式：${registration.contact}\n备注：${registration.remark || '无'}\n\n该工单由召回登记自动转换生成，登记号：${registration.id}`,
    traceId: registration.traceId,
    images: registration.images,
    contact: registration.contact
  });

  const registrations = getRegistrations();
  const idx = registrations.findIndex(r => r.id === registrationId);
  if (idx !== -1) {
    registrations[idx].ticketId = ticket.id;
    registrations[idx].updatedAt = Date.now();
    registrations[idx].statusTimeline.push({
      status: registrations[idx].status,
      timestamp: Date.now(),
      message: `已转换为工单，工单号：${ticket.id}`
    });
    saveRegistrations(registrations);
  }

  return { success: true, ticketId: ticket.id, ticket: ticket };
}

function formatTime(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  return `${year}-${month}-${day} ${hour}:${minute}`;
}

// ==================== 政府平台召回增强功能 ====================

function getGovRecallNotifications() {
  try {
    let persistentNotifications = [];
    if (typeof wx !== 'undefined' && wx.getStorageSync) {
      const stored = wx.getStorageSync(GOV_RECALL_NOTIFICATIONS_KEY);
      persistentNotifications = Array.isArray(stored) ? stored : [];
    }

    const combinedMap = new Map();
    for (const item of persistentNotifications) {
      if (item && item.updateId) combinedMap.set(item.updateId, item);
    }
    for (const item of memoryGovNotifications) {
      if (item && item.updateId) combinedMap.set(item.updateId, item);
    }
    return Array.from(combinedMap.values());
  } catch (e) {
    console.error('[recallService] 获取政府召回通知失败:', e);
    return memoryGovNotifications.slice();
  }
}

function saveGovRecallNotifications(notifications) {
  try {
    memoryGovNotifications.length = 0;
    for (const n of notifications) {
      memoryGovNotifications.push(n);
    }

    if (typeof wx !== 'undefined' && wx.setStorageSync) {
      wx.setStorageSync(GOV_RECALL_NOTIFICATIONS_KEY, notifications);
      return true;
    }
    return true;
  } catch (e) {
    console.error('[recallService] 保存政府召回通知失败:', e);
    return false;
  }
}

function addGovRecallNotification(govUpdate) {
  const notifications = getGovRecallNotifications();

  const existing = notifications.find(function(n) {
    return n.updateId === govUpdate.updateId;
  });
  if (existing) {
    return { success: false, alreadyExists: true };
  }

  const notification = {
    updateId: govUpdate.updateId,
    batchNo: govUpdate.batchNo,
    productName: govUpdate.productName || '',
    status: govUpdate.status,
    statusLabel: govUpdate.statusLabel || '',
    reason: govUpdate.reason || '',
    description: govUpdate.description || '',
    platformLevel: govUpdate.platformLevel,
    platformName: govUpdate.platformLevel === 'national'
      ? NATIONAL_CONFIG.name
      : PROVINCE_CONFIG.name,
    regulatoryAuthority: govUpdate.platformLevel === 'national'
      ? NATIONAL_CONFIG.regulatoryAuthority
      : PROVINCE_CONFIG.regulatoryAuthority,
    issuedAt: govUpdate.issuedAt || Date.now(),
    severity: govUpdate.severity || 'high',
    noticeUrl: govUpdate.noticeUrl || '',
    affectedRange: govUpdate.affectedRange || '全国',
    affectedQuantity: govUpdate.affectedQuantity || 0,
    affectedUnit: govUpdate.affectedUnit || '件',
    inspectReportNo: govUpdate.inspectReportNo || '',
    abnormalItems: govUpdate.abnormalItems || [],
    disposalMeasures: govUpdate.disposalMeasures || [],
    acknowledged: false,
    receivedAt: Date.now()
  };

  notifications.unshift(notification);
  if (notifications.length > 100) {
    notifications.splice(100);
  }

  saveGovRecallNotifications(notifications);

  return {
    success: true,
    alreadyExists: false,
    notification: notification,
    needRegister: isRecallStatus(govUpdate.status)
  };
}

function isRecallStatus(status) {
  return status === GOV_PLATFORM_STATUS.RECALL ||
         status === GOV_PLATFORM_STATUS.REVOKED;
}

function acknowledgeGovNotification(updateId) {
  const notifications = getGovRecallNotifications();
  const idx = notifications.findIndex(function(n) {
    return n.updateId === updateId;
  });
  if (idx === -1) return false;

  notifications[idx].acknowledged = true;
  notifications[idx].acknowledgedAt = Date.now();
  saveGovRecallNotifications(notifications);
  return true;
}

function getUnacknowledgedGovNotifications() {
  const notifications = getGovRecallNotifications();
  return notifications.filter(function(n) {
    return !n.acknowledged;
  });
}

function getGovNotificationByBatch(batchNo) {
  const notifications = getGovRecallNotifications();
  return notifications
    .filter(function(n) { return n.batchNo === batchNo; })
    .sort(function(a, b) { return b.issuedAt - a.issuedAt; });
}

async function syncAndProcessGovStatusUpdates() {
  console.log('[recallService] 开始同步并处理政府平台状态更新');

  try {
    const govTrace = require('./govTrace.js');
    const result = await govTrace.syncPlatformStatusUpdates();
    if (!result.success) {
      return { success: false, message: result.message || '同步失败' };
    }

    if (!result.updates || result.updates.length === 0) {
      return { success: true, processedCount: 0, message: '无新的状态变更' };
    }

    let processedCount = 0;
    let recallCount = 0;

    for (const update of result.updates) {
      const addResult = addGovRecallNotification(update);
      if (addResult.success) {
        processedCount++;
        if (addResult.needRegister) {
          recallCount++;
        }
      }
    }

    console.log('[recallService] 政府状态变更处理完成:', {
      processed: processedCount,
      needRecall: recallCount
    });

    return {
      success: true,
      processedCount: processedCount,
      recallCount: recallCount,
      message: `同步完成，处理${processedCount}条更新，其中${recallCount}条需召回`
    };
  } catch (err) {
    console.error('[recallService] 同步政府状态更新异常:', err);
    return { success: false, message: err.message || '同步异常', error: err };
  }
}

function processGovRecallRegistration(govNotification, userForm) {
  if (!govNotification) {
    return { success: false, error: '政府召回通知不存在' };
  }

  const formData = Object.assign({}, userForm, {
    batchNo: govNotification.batchNo,
    productName: govNotification.productName,
    source: RECALL_SOURCES.GOVERNMENT_PLATFORM,
    govUpdateId: govNotification.updateId,
    govNoticeUrl: govNotification.noticeUrl,
    govInspectReportNo: govNotification.inspectReportNo,
    isGovernmentInitiated: true
  });

  const registration = createRegistration(formData);

  return {
    success: true,
    registration: registration,
    sourceLabel: RECALL_SOURCE_LABELS.government_platform,
    officialNotice: true
  };
}

function isGovernmentRecallBatch(batchNo) {
  const notifications = getGovNotificationByBatch(batchNo);
  return notifications.some(function(n) {
    return isRecallStatus(n.status);
  });
}

function getRecallSourceLabel(source) {
  return RECALL_SOURCE_LABELS[source] || '品牌召回';
}

module.exports = {
  RECALL_STATUS,
  RECALL_STATUS_LABEL,
  RECALL_STATUS_COLOR,
  RECALL_SOURCES,
  RECALL_SOURCE_LABELS,
  PURCHASE_CHANNELS,
  generateRegistrationId,
  getRegistrations,
  createRegistration,
  getRegistrationById,
  getRegistrationsByTraceId,
  getRegistrationsByBatch,
  updateRegistrationStatus,
  convertToTicket,
  formatTime,
  getGovRecallNotifications,
  addGovRecallNotification,
  acknowledgeGovNotification,
  getUnacknowledgedGovNotifications,
  getGovNotificationByBatch,
  syncAndProcessGovStatusUpdates,
  processGovRecallRegistration,
  isGovernmentRecallBatch,
  getRecallSourceLabel
};
