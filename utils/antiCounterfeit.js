/**
 * 防伪验真与扫码行为分析模块
 * 功能：
 * 1. 首次扫码验证：显示正品首次验证+出厂信息
 * 2. 重复扫码查询：查询次数、首次/最近时间、城市（脱敏）
 * 3. 异常告警检测：短时间异地多次扫码、仿冒风险
 * 4. 消费者举报：举报记录存储
 */

const mockData = require('./mockData.js');

const SCAN_RECORDS_KEY = 'anti_counterfeit_scan_records';
const REPORT_RECORDS_KEY = 'anti_counterfeit_report_records';
const ABNORMAL_TIME_WINDOW = 24 * 60 * 60 * 1000;
const ABNORMAL_SCAN_THRESHOLD = 3;
const ABNORMAL_LOCATION_COUNT = 2;

function getScanRecords() {
  try {
    const records = wx.getStorageSync(SCAN_RECORDS_KEY);
    return Array.isArray(records) ? records : [];
  } catch (e) {
    console.error('[防伪模块] 获取扫码记录失败:', e);
    return [];
  }
}

function saveScanRecords(records) {
  try {
    wx.setStorageSync(SCAN_RECORDS_KEY, records);
  } catch (e) {
    console.error('[防伪模块] 保存扫码记录失败:', e);
  }
}

function getCityFromLocation(location) {
  if (!location) return '未知地区';
  if (location.length <= 2) return location;
  return location.substring(0, 2) + '*';
}

function maskIp(ip) {
  if (!ip) return '*.**.**.**';
  const parts = ip.split('.');
  if (parts.length !== 4) return ip;
  return parts[0] + '.*.*.*';
}

function getCurrentLocation() {
  return new Promise((resolve) => {
    wx.getFuzzyLocation({
      type: 'gcj02',
      success: (res) => {
        resolve({
          lat: res.latitude,
          lng: res.longitude,
          city: '当前城市',
          ip: '192.168.1.1'
        });
      },
      fail: () => {
        resolve({
          lat: null,
          lng: null,
          city: '未知地区',
          ip: '*.**.**.**'
        });
      }
    });
  });
}

function isSameCity(loc1, loc2) {
  if (!loc1 || !loc2) return false;
  if (loc1.city && loc2.city) {
    return getCityFromLocation(loc1.city) === getCityFromLocation(loc2.city);
  }
  if (loc1.lat && loc1.lng && loc2.lat && loc2.lng) {
    const distance = Math.sqrt(
      Math.pow(loc1.lat - loc2.lat, 2) + Math.pow(loc1.lng - loc2.lng, 2)
    );
    return distance < 0.5;
  }
  return false;
}

function detectAbnormalBehavior(traceId, currentLocation) {
  const allRecords = getScanRecords();
  const productRecords = allRecords.filter(r => r.traceId === traceId);
  
  if (productRecords.length === 0) {
    return { isAbnormal: false, alerts: [], riskLevel: 'normal' };
  }

  const now = Date.now();
  const recentRecords = productRecords.filter(
    r => now - r.timestamp < ABNORMAL_TIME_WINDOW
  );

  const alerts = [];
  let riskLevel = 'normal';

  if (recentRecords.length >= ABNORMAL_SCAN_THRESHOLD) {
    alerts.push({
      type: 'frequent_scan',
      level: 'warning',
      title: '频繁扫码提醒',
      message: `该产品在24小时内已被扫码 ${recentRecords.length} 次，存在被复制仿冒的风险`
    });
    riskLevel = 'warning';
  }

  if (recentRecords.length >= 2) {
    const uniqueLocations = new Set();
    recentRecords.forEach(r => {
      if (r.location && r.location.city) {
        uniqueLocations.add(getCityFromLocation(r.location.city));
      }
    });
    if (currentLocation && currentLocation.city) {
      uniqueLocations.add(getCityFromLocation(currentLocation.city));
    }

    if (uniqueLocations.size >= ABNORMAL_LOCATION_COUNT) {
      alerts.push({
        type: 'cross_region',
        level: 'danger',
        title: '异地多次扫码告警',
        message: `该产品在短时间内于不同地区（${Array.from(uniqueLocations).join('、')}）被多次扫码，存在仿冒风险，请谨慎购买`
      });
      riskLevel = 'danger';
    }
  }

  const firstScan = productRecords[0];
  if (firstScan && firstScan.location && currentLocation) {
    if (!isSameCity(firstScan.location, currentLocation)) {
      alerts.push({
        type: 'location_mismatch',
        level: 'info',
        title: '扫码地区与首次不同',
        message: `首次扫码地区：${getCityFromLocation(firstScan.location.city)}，本次扫码地区：${getCityFromLocation(currentLocation.city)}`
      });
    }
  }

  return { isAbnormal: alerts.length > 0, alerts, riskLevel };
}

async function verifyProduct(traceId) {
  const traceData = mockData.getTraceData(traceId);
  
  if (!traceData) {
    return {
      success: false,
      error: '未找到产品信息',
      code: 'PRODUCT_NOT_FOUND'
    };
  }

  const currentLocation = await getCurrentLocation();
  const allRecords = getScanRecords();
  const productRecords = allRecords.filter(r => r.traceId === traceId);
  
  const isFirstScan = productRecords.length === 0;
  const now = Date.now();

  const newScanRecord = {
    id: `${traceId}_${now}`,
    traceId: traceId,
    timestamp: now,
    location: currentLocation,
    type: isFirstScan ? 'first' : 'repeat',
    ip: currentLocation.ip || '*.**.**.**'
  };

  allRecords.push(newScanRecord);
  saveScanRecords(allRecords);

  const updatedProductRecords = allRecords.filter(r => r.traceId === traceId);
  const abnormalResult = detectAbnormalBehavior(traceId, currentLocation);

  const factoryInfo = {
    productName: traceData.basicInfo.productName,
    specification: traceData.basicInfo.specification,
    batchNo: traceData.basicInfo.batchNo,
    productionTime: traceData.basicInfo.productionTime,
    pickTime: traceData.basicInfo.pickTime,
    variety: traceData.osmanthusInfo.variety,
    origin: traceData.osmanthusInfo.origin,
    testReportNo: traceData.pesticideTest.reportNo,
    testInstitution: traceData.pesticideTest.institution,
    testDate: traceData.pesticideTest.testDate,
    hasAbnormal: traceData.pesticideTest.hasAbnormal
  };

  let result;

  if (isFirstScan) {
    result = {
      success: true,
      scanType: 'first',
      title: '正品首次验证',
      message: '恭喜您，这是该产品首次被验证，为正品！',
      authenticity: 'genuine',
      factoryInfo: factoryInfo,
      scanInfo: {
        currentScan: {
          time: formatDateTime(now),
          location: getCityFromLocation(currentLocation.city),
          ip: maskIp(currentLocation.ip)
        },
        totalQueryCount: 1,
        firstScanTime: formatDateTime(now),
        lastScanTime: formatDateTime(now)
      },
      abnormal: abnormalResult
    };
  } else {
    const firstScan = updatedProductRecords[0];
    const lastScan = updatedProductRecords[updatedProductRecords.length - 1];
    const uniqueCities = new Set();
    updatedProductRecords.forEach(r => {
      if (r.location && r.location.city) {
        uniqueCities.add(getCityFromLocation(r.location.city));
      }
    });

    result = {
      success: true,
      scanType: 'repeat',
      title: '产品已被查询',
      message: `该产品防伪码已被查询 ${updatedProductRecords.length} 次`,
      authenticity: abnormalResult.riskLevel === 'danger' ? 'suspicious' : 'genuine',
      factoryInfo: factoryInfo,
      scanInfo: {
        currentScan: {
          time: formatDateTime(now),
          location: getCityFromLocation(currentLocation.city),
          ip: maskIp(currentLocation.ip)
        },
        totalQueryCount: updatedProductRecords.length,
        firstScanTime: formatDateTime(firstScan.timestamp),
        firstScanLocation: getCityFromLocation(firstScan.location ? firstScan.location.city : ''),
        lastScanTime: formatDateTime(lastScan.timestamp),
        lastScanLocation: getCityFromLocation(lastScan.location ? lastScan.location.city : ''),
        queryLocations: Array.from(uniqueCities),
        recentRecords: updatedProductRecords.slice(-5).reverse().map(r => ({
          time: formatDateTime(r.timestamp),
          location: getCityFromLocation(r.location ? r.location.city : ''),
          type: r.type
        }))
      },
      abnormal: abnormalResult
    };
  }

  return result;
}

function formatDateTime(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  const second = date.getSeconds().toString().padStart(2, '0');
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

function getProductScanStats(traceId) {
  const allRecords = getScanRecords();
  const productRecords = allRecords.filter(r => r.traceId === traceId);
  
  if (productRecords.length === 0) {
    return null;
  }

  const firstScan = productRecords[0];
  const lastScan = productRecords[productRecords.length - 1];
  const uniqueCities = new Set();
  productRecords.forEach(r => {
    if (r.location && r.location.city) {
      uniqueCities.add(getCityFromLocation(r.location.city));
    }
  });

  return {
    totalQueryCount: productRecords.length,
    firstScanTime: formatDateTime(firstScan.timestamp),
    firstScanLocation: getCityFromLocation(firstScan.location ? firstScan.location.city : ''),
    lastScanTime: formatDateTime(lastScan.timestamp),
    lastScanLocation: getCityFromLocation(lastScan.location ? lastScan.location.city : ''),
    queryLocations: Array.from(uniqueCities),
    recentRecords: productRecords.slice(-10).reverse().map(r => ({
      time: formatDateTime(r.timestamp),
      location: getCityFromLocation(r.location ? r.location.city : ''),
      type: r.type,
      ip: maskIp(r.ip)
    }))
  };
}

function getReportRecords() {
  try {
    const records = wx.getStorageSync(REPORT_RECORDS_KEY);
    return Array.isArray(records) ? records : [];
  } catch (e) {
    console.error('[防伪模块] 获取举报记录失败:', e);
    return [];
  }
}

function saveReportRecord(record) {
  try {
    const records = getReportRecords();
    const newRecord = {
      ...record,
      id: `report_${Date.now()}`,
      status: 'pending',
      createdAt: Date.now(),
      createdAtStr: formatDateTime(Date.now())
    };
    records.unshift(newRecord);
    wx.setStorageSync(REPORT_RECORDS_KEY, records);
    return newRecord;
  } catch (e) {
    console.error('[防伪模块] 保存举报记录失败:', e);
    return null;
  }
}

function submitReport(reportData) {
  if (!reportData || !reportData.traceId) {
    return {
      success: false,
      error: '缺少必要的举报信息',
      code: 'MISSING_PARAMS'
    };
  }

  const savedRecord = saveReportRecord(reportData);
  
  if (!savedRecord) {
    return {
      success: false,
      error: '举报提交失败，请稍后重试',
      code: 'SAVE_FAILED'
    };
  }

  return {
    success: true,
    message: '举报已提交，我们将尽快核实处理',
    reportId: savedRecord.id,
    reportData: savedRecord
  };
}

function getReportTypes() {
  return [
    { key: 'counterfeit', label: '疑似仿冒产品', icon: '⚠️' },
    { key: 'quality', label: '产品质量问题', icon: '📦' },
    { key: 'expired', label: '产品已过期', icon: '📅' },
    { key: 'damaged', label: '包装破损', icon: '📮' },
    { key: 'other', label: '其他问题', icon: '💬' }
  ];
}

function clearAllScanRecords() {
  try {
    wx.setStorageSync(SCAN_RECORDS_KEY, []);
    return true;
  } catch (e) {
    console.error('[防伪模块] 清空扫码记录失败:', e);
    return false;
  }
}

module.exports = {
  verifyProduct,
  getProductScanStats,
  detectAbnormalBehavior,
  submitReport,
  getReportRecords,
  getReportTypes,
  formatDateTime,
  getCityFromLocation,
  maskIp,
  clearAllScanRecords,
  ABNORMAL_TIME_WINDOW,
  ABNORMAL_SCAN_THRESHOLD,
  ABNORMAL_LOCATION_COUNT
};
