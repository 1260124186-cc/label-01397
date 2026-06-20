const mockData = require('./mockData.js');
const storage = require('./storage.js');
const {
  PROVINCE_CONFIG,
  NATIONAL_CONFIG,
  GOV_PLATFORM_STATUS,
  GOV_PLATFORM_STATUS_LABEL,
  GOV_PLATFORM_STATUS_COLOR,
  getPlatformConfig
} = require('./govTraceConstants.js');

const GOV_TRACE_STORAGE_KEY = 'gov_trace_data';
const GOV_TRACE_REPORTED_KEY = 'gov_trace_reported_batches';
const GOV_TRACE_STATUS_KEY = 'gov_trace_status_updates';

const memoryCache = {
  reportedBatches: {},
  statusUpdates: []
};

let apiAvailable = true;
let simulatedFailureRate = 0;

function setApiAvailable(available) {
  apiAvailable = available;
  console.log('[govTrace] API可用性已设置:', available);
}

function setSimulatedFailureRate(rate) {
  simulatedFailureRate = Math.min(1, Math.max(0, rate));
  console.log('[govTrace] 模拟失败率已设置:', simulatedFailureRate);
}

function isApiAvailable() {
  if (simulatedFailureRate > 0 && Math.random() < simulatedFailureRate) {
    return false;
  }
  return apiAvailable;
}

function generateGovTraceCode(batchNo, platformLevel) {
  const prefix = platformLevel === 'national' ? 'NA' : 'HB';
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `${prefix}${year}${month}${day}${batchNo}${random}`;
}

function safeGetStorage(key, defaultValue) {
  try {
    const value = storage.get(key, defaultValue);
    return value !== null && value !== undefined ? value : defaultValue;
  } catch (e) {
    return defaultValue;
  }
}

function safeSetStorage(key, value) {
  try {
    storage.set(key, value);
    return true;
  } catch (e) {
    return false;
  }
}

function callApi(endpoint, params) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!isApiAvailable()) {
        reject({ code: 'SERVICE_UNAVAILABLE', message: '政府追溯平台接口暂不可用' });
        return;
      }
      resolve({ code: 0, data: null, message: 'success' });
    }, 300 + Math.random() * 500);
  });
}

async function queryGovTraceByTraceId(traceId) {
  console.log('[govTrace] 通过品牌溯源ID查询政府溯源信息:', traceId);

  try {
    await callApi('/query/by-trace-id', { traceId });
    const govInfo = mockData.getGovTraceByTraceId(traceId);
    if (!govInfo) {
      console.warn('[govTrace] 未找到政府溯源信息，降级返回品牌溯源');
      return { success: false, fallback: true, message: '政府备案信息暂不可用，仅展示品牌溯源' };
    }
    return { success: true, data: govInfo, fallback: false };
  } catch (error) {
    console.error('[govTrace] 查询政府溯源失败，降级处理:', error);
    return { success: false, fallback: true, message: '政府平台接口暂不可用，仅展示品牌溯源', error: error };
  }
}

async function queryGovTraceByGovCode(govCode) {
  console.log('[govTrace] 通过政府追溯码查询:', govCode);

  if (!govCode) {
    return { success: false, message: '请输入政府追溯码' };
  }

  try {
    await callApi('/query/by-gov-code', { govCode });
    const govInfo = mockData.getGovTraceByGovCode(govCode);
    if (!govInfo) {
      return { success: false, message: '未找到该追溯码对应的产品信息，请核对后重试' };
    }
    return { success: true, data: govInfo };
  } catch (error) {
    console.error('[govTrace] 查询政府追溯码失败:', error);
    return { success: false, message: '政府平台接口暂不可用，请稍后重试', error: error };
  }
}

async function reportBatchToGovPlatform(batchNo, batchInfo) {
  console.log('[govTrace] 批次出厂上报政府平台:', batchNo);

  const persistentReported = safeGetStorage(GOV_TRACE_REPORTED_KEY, {});
  const reportedBatches = Object.assign({}, memoryCache.reportedBatches, persistentReported);

  if (reportedBatches[batchNo]) {
    console.log('[govTrace] 批次已上报，无需重复上报:', batchNo);
    return { success: true, alreadyReported: true, data: reportedBatches[batchNo] };
  }

  try {
    await callApi('/report/batch', { batchNo, batchInfo });

    const govTraceCode = generateGovTraceCode(batchNo, 'province');
    const nationalTraceCode = generateGovTraceCode(batchNo, 'national');
    const now = Date.now();

    const reportRecord = {
      batchNo: batchNo,
      productName: batchInfo.productName || '',
      specification: batchInfo.specification || '',
      productionTime: batchInfo.productionTime || '',
      quantity: batchInfo.quantity || 0,
      unit: batchInfo.unit || 'kg',
      provinceGovCode: govTraceCode,
      nationalGovCode: nationalTraceCode,
      provinceFilingNo: `HUBEI-TEA-${Date.now()}`,
      nationalFilingNo: `NA-AGRI-${Date.now()}`,
      reportTime: now,
      reportStatus: GOV_PLATFORM_STATUS.APPROVED,
      platformLevel: 'dual',
      testReportNo: batchInfo.testReportNo || ''
    };

    reportedBatches[batchNo] = reportRecord;
    memoryCache.reportedBatches[batchNo] = reportRecord;
    safeSetStorage(GOV_TRACE_REPORTED_KEY, reportedBatches);

    mockData.updateGovTraceReport(batchNo, reportRecord);

    console.log('[govTrace] 批次上报成功，政府追溯码:', govTraceCode);
    return { success: true, alreadyReported: false, data: reportRecord };
  } catch (error) {
    console.warn('[govTrace] 批次上报政府平台失败，将缓存后重试:', error);
    const pendingRecord = {
      batchNo: batchNo,
      ...batchInfo,
      pendingRetry: true,
      retryCount: 0,
      lastTryTime: Date.now()
    };
    return { success: false, pendingRetry: true, data: pendingRecord, message: '上报失败，已加入重试队列' };
  }
}

async function syncPlatformStatusUpdates() {
  console.log('[govTrace] 同步政府平台状态变更...');

  try {
    await callApi('/sync/status', {});
    const statusUpdates = mockData.getGovPlatformStatusUpdates();

    if (!statusUpdates || statusUpdates.length === 0) {
      console.log('[govTrace] 无新的平台状态变更');
      return { success: true, updatedCount: 0 };
    }

    let processedCount = 0;
    const persistentUpdates = safeGetStorage(GOV_TRACE_STATUS_KEY, []);
    const existingUpdates = memoryCache.statusUpdates.concat(
      persistentUpdates.filter(p => !memoryCache.statusUpdates.some(m => m.updateId === p.updateId))
    );

    for (const update of statusUpdates) {
      const alreadyProcessed = existingUpdates.some(u => u.updateId === update.updateId);
      if (alreadyProcessed) continue;

      existingUpdates.push(update);
      memoryCache.statusUpdates.push(update);
      processedCount++;

      if (update.status === GOV_PLATFORM_STATUS.RECALL ||
          update.status === GOV_PLATFORM_STATUS.REVOKED) {
        try {
          processGovRecallUpdate(update);
        } catch (recallErr) {
          console.error('[govTrace] 处理召回更新失败，继续同步其他批次:', recallErr);
        }
      }

      mockData.updateProductGovStatus(update.batchNo, update.status);
    }

    safeSetStorage(GOV_TRACE_STATUS_KEY, existingUpdates);
    console.log('[govTrace] 状态变更同步完成，处理了', processedCount, '条');
    return { success: true, updatedCount: processedCount, updates: statusUpdates };
  } catch (error) {
    console.error('[govTrace] 同步平台状态失败:', error);
    return { success: false, message: '同步失败，请稍后重试', error: error };
  }
}

function processGovRecallUpdate(update) {
  console.log('[govTrace] 处理政府责令召回:', update);

  const recallInfo = {
    recallId: `GOV-${Date.now()}`,
    source: 'government_platform',
    sourceName: update.platformLevel === 'national' ? NATIONAL_CONFIG.name : PROVINCE_CONFIG.name,
    batchNo: update.batchNo,
    productName: update.productName,
    issueCategory: update.reason || '产品质量不合格',
    issueDescription: update.description || '政府抽查发现产品不合格',
    recallLevel: update.status === GOV_PLATFORM_STATUS.RECALL ? 'level1' : 'level2',
    recallLevelLabel: update.status === GOV_PLATFORM_STATUS.RECALL ? '一级召回' : '二级召回',
    publishDate: new Date(update.issuedAt).toLocaleDateString(),
    officialNotice: true,
    officialNoticeUrl: update.noticeUrl || getPlatformConfig(update.platformLevel).verifyUrl,
    affectedRange: update.affectedRange || '全国',
    isRecalled: true
  };

  mockData.addRecallRecord(recallInfo);

  if (typeof wx !== 'undefined' && wx.showModal) {
    try {
      wx.showModal({
        title: '⚠️ 政府召回通知',
        content: `【${PROVINCE_CONFIG.regulatoryAuthority}】发布产品召回通知\n\n产品批次：${update.batchNo}\n召回原因：${update.reason || '产品质量不合格'}\n\n请立即停止食用并办理召回登记。`,
        confirmText: '立即登记',
        cancelText: '我已知晓',
        confirmColor: '#D32F2F',
        success: function(res) {
          if (res.confirm && typeof wx !== 'undefined' && wx.navigateTo) {
            try {
              wx.navigateTo({
                url: `/pages/recall/detail?batchNo=${update.batchNo}&source=government`
              });
            } catch (e) {
              console.warn('[govTrace] 跳转召回详情页失败:', e);
            }
          }
        },
        fail: function() {}
      });
    } catch (e) {
      console.warn('[govTrace] 弹出召回通知失败:', e);
    }
  } else {
    console.log('[govTrace] 非小程序环境，跳过召回弹窗');
  }
}

function verifyGovCodeFormat(govCode) {
  if (!govCode || typeof govCode !== 'string') return false;
  if (govCode.length < 10) return false;

  const isProvince = /^HB\d+/.test(govCode);
  const isNational = /^NA\d+/.test(govCode);

  return isProvince || isNational;
}

function getGovComplianceText(traceId) {
  const govInfo = mockData.getGovTraceByTraceId(traceId);
  if (!govInfo) {
    return PROVINCE_CONFIG.complianceText;
  }
  const config = getPlatformConfig(govInfo.platformLevel === 'dual' ? 'province' : govInfo.platformLevel);
  return config.complianceText;
}

function getGovVerifyUrl(govCode, level) {
  const config = getPlatformConfig(level);
  return `${config.verifyUrl}?code=${encodeURIComponent(govCode)}`;
}

function openGovVerifyPage(govCode, level) {
  const url = getGovVerifyUrl(govCode, level);
  if (typeof wx !== 'undefined' && wx.navigateTo) {
    try {
      wx.navigateTo({
        url: `/pages/webview/webview?url=${encodeURIComponent(url)}&title=${encodeURIComponent(getPlatformConfig(level).name)}`
      });
    } catch (e) {
      console.warn('[govTrace] 打开官方验证页失败:', e);
    }
  }
}

module.exports = {
  GOV_PLATFORM_STATUS,
  GOV_PLATFORM_STATUS_LABEL,
  GOV_PLATFORM_STATUS_COLOR,
  PROVINCE_CONFIG,
  NATIONAL_CONFIG,
  setApiAvailable,
  setSimulatedFailureRate,
  isApiAvailable,
  getPlatformConfig,
  generateGovTraceCode,
  queryGovTraceByTraceId,
  queryGovTraceByGovCode,
  reportBatchToGovPlatform,
  syncPlatformStatusUpdates,
  verifyGovCodeFormat,
  getGovComplianceText,
  getGovVerifyUrl,
  openGovVerifyPage
};
