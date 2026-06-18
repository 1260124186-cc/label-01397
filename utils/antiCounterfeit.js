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
    const isDual = record && (record.reportSource === 'dual_code_verify' || record.hasDualCode || (record.outerCode && record.innerCode));
    const idPrefix = isDual ? 'RPT-DUAL-' : 'report_';
    const newRecord = {
      ...record,
      id: `${idPrefix}${Date.now()}`,
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
    { key: 'dual_mismatch', label: '双码(内外)不一致', icon: '🔗' },
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

function isFirstScanForTraceId(traceId) {
  const allRecords = getScanRecords();
  const productRecords = allRecords.filter(r => r.traceId === traceId);
  return productRecords.length === 0;
}

function verifyGiftBoxAntiCounterfeit(mainTraceId) {
  const giftBoxInfo = mockData.getGiftBoxInfo(mainTraceId);
  if (!giftBoxInfo) {
    return null;
  }

  const items = giftBoxInfo.items || [];
  const subCodeVerifyResults = items.map(function(item) {
    const isFirst = isFirstScanForTraceId(item.traceId);
    const scanStats = getProductScanStats(item.traceId);
    return {
      traceId: item.traceId,
      index: item.index,
      name: item.name,
      isFirstScan: isFirst,
      scanCount: scanStats ? scanStats.totalQueryCount : 0,
      firstScanTime: scanStats ? scanStats.firstScanTime : null
    };
  });

  const firstScanCount = subCodeVerifyResults.filter(r => r.isFirstScan).length;
  const totalItems = subCodeVerifyResults.length;
  const allFirstVerified = firstScanCount === totalItems;

  let authenticityStatus;
  let statusTitle;
  let statusMessage;

  if (allFirstVerified) {
    authenticityStatus = 'complete_genuine';
    statusTitle = '礼盒完整正品';
    statusMessage = `恭喜！礼盒内 ${totalItems} 件产品全部为首次验证，确认为完整正品礼盒。`;
  } else if (firstScanCount === 0) {
    authenticityStatus = 'all_opened';
    statusTitle = '礼盒已全部开封';
    statusMessage = `礼盒内 ${totalItems} 件产品均已被验证过，请谨慎购买。建议逐一核对每件产品的扫码记录。`;
  } else {
    authenticityStatus = 'partially_genuine';
    statusTitle = '礼盒部分正品';
    statusMessage = `礼盒内 ${firstScanCount}/${totalItems} 件为首次验证，其余 ${totalItems - firstScanCount} 件已被查询过，请仔细核对每件产品信息。`;
  }

  return {
    giftBoxId: giftBoxInfo.giftBoxId,
    giftBoxName: giftBoxInfo.name,
    mainTraceId: mainTraceId,
    totalItems: totalItems,
    firstScanCount: firstScanCount,
    allFirstVerified: allFirstVerified,
    authenticityStatus: authenticityStatus,
    statusTitle: statusTitle,
    statusMessage: statusMessage,
    subCodeResults: subCodeVerifyResults,
    progressPercent: Math.round((firstScanCount / totalItems) * 100)
  };
}

function getSubCodeGiftBoxContext(subTraceId) {
  const subCodeInfo = mockData.getGiftBoxSubCodeInfo(subTraceId);
  if (!subCodeInfo || subCodeInfo.isMainCode) {
    return null;
  }

  const giftBoxInfo = mockData.getGiftBoxInfo(subCodeInfo.giftBoxId);
  const mainScanStats = getProductScanStats(subCodeInfo.giftBoxMainTraceId);

  return {
    giftBoxId: subCodeInfo.giftBoxId,
    giftBoxName: subCodeInfo.giftBoxName,
    mainTraceId: subCodeInfo.giftBoxMainTraceId,
    itemIndex: subCodeInfo.itemIndex,
    totalItems: subCodeInfo.totalItems,
    itemName: subCodeInfo.itemInfo ? subCodeInfo.itemInfo.name : '',
    positionText: `「${subCodeInfo.giftBoxName}」的第 ${subCodeInfo.itemIndex} 件（共 ${subCodeInfo.totalItems} 件）`,
    mainCodeVerified: mainScanStats !== null,
    mainCodeScanCount: mainScanStats ? mainScanStats.totalQueryCount : 0,
    giftBoxItems: giftBoxInfo ? giftBoxInfo.items : []
  };
}

async function verifyProductEnhanced(traceId) {
  const baseResult = await verifyProduct(traceId);
  if (!baseResult.success) {
    return baseResult;
  }

  const enhanced = {
    ...baseResult,
    giftBox: null
  };

  if (mockData.isGiftBoxMainCode(traceId)) {
    const giftBoxVerify = verifyGiftBoxAntiCounterfeit(traceId);
    enhanced.giftBox = {
      type: 'main_code',
      ...giftBoxVerify
    };
    enhanced.giftBoxInfo = mockData.getGiftBoxInfo(traceId);
    enhanced.giftBoxItems = mockData.getGiftBoxItems(mockData.getGiftBoxInfo(traceId).giftBoxId);
  } else if (mockData.isGiftBoxSubCode(traceId)) {
    const subContext = getSubCodeGiftBoxContext(traceId);
    enhanced.giftBox = {
      type: 'sub_code',
      context: subContext
    };
    enhanced.giftBoxInfo = mockData.getGiftBoxInfo(traceId);
  }

  return enhanced;
}

const DUAL_CODE_VERIFY_RECORDS_KEY = 'dual_code_verify_records';

function getDualCodeVerifyRecords() {
  try {
    const records = wx.getStorageSync(DUAL_CODE_VERIFY_RECORDS_KEY);
    return Array.isArray(records) ? records : [];
  } catch (e) {
    console.error('[双码验真] 获取双码验证记录失败:', e);
    return [];
  }
}

function saveDualCodeVerifyRecord(record) {
  try {
    const records = getDualCodeVerifyRecords();
    const newRecord = {
      ...record,
      id: `dual_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      createdAt: Date.now(),
      createdAtStr: formatDateTime(Date.now())
    };
    records.unshift(newRecord);
    wx.setStorageSync(DUAL_CODE_VERIFY_RECORDS_KEY, records.slice(0, 100));
    return newRecord;
  } catch (e) {
    console.error('[双码验真] 保存双码验证记录失败:', e);
    return null;
  }
}

function getLastOuterCodeScan() {
  try {
    return wx.getStorageSync('last_scanned_outer_code') || null;
  } catch (e) {
    return null;
  }
}

function setLastOuterCodeScan(outerCodeInfo) {
  try {
    wx.setStorageSync('last_scanned_outer_code', outerCodeInfo);
  } catch (e) {
    console.error('[双码验真] 保存外码扫描状态失败:', e);
  }
}

function clearLastOuterCodeScan() {
  try {
    wx.removeStorageSync('last_scanned_outer_code');
  } catch (e) {
    console.error('[双码验真] 清除外码扫描状态失败:', e);
  }
}

async function scanOuterCode(outerCode) {
  if (!mockData.isOuterCode(outerCode)) {
    return {
      success: false,
      error: '无效的外码',
      code: 'INVALID_OUTER_CODE'
    };
  }

  const summary = mockData.getOuterCodeSummary(outerCode);
  if (!summary) {
    return {
      success: false,
      error: '外码信息查询失败',
      code: 'OUTER_CODE_QUERY_FAILED'
    };
  }

  const currentLocation = await getCurrentLocation();
  const now = Date.now();

  const scanRecord = {
    type: 'outer_scan',
    code: outerCode,
    codeType: 'outer',
    traceId: summary.traceId,
    productName: summary.productName,
    timestamp: now,
    location: currentLocation,
    summary: summary
  };

  saveDualCodeVerifyRecord(scanRecord);

  setLastOuterCodeScan({
    outerCode: outerCode,
    innerCode: summary.innerCode,
    traceId: summary.traceId,
    productName: summary.productName,
    scannedAt: now,
    scannedAtStr: formatDateTime(now),
    location: currentLocation,
    summary: summary
  });

  return {
    success: true,
    scanType: 'outer_scan',
    outerCode: outerCode,
    innerCode: summary.innerCode,
    traceId: summary.traceId,
    productSummary: summary,
    currentLocation: {
      time: formatDateTime(now),
      location: getCityFromLocation(currentLocation.city),
      ip: maskIp(currentLocation.ip)
    },
    tip: summary.antiCounterfeitTip,
    nextStep: '请确认外包装完好后，撕开铝箔/内袋，扫描内码完成双码验真'
  };
}

async function scanInnerCode(innerCode, outerCodeContext) {
  if (!mockData.isInnerCode(innerCode)) {
    return {
      success: false,
      error: '无效的内码',
      code: 'INVALID_INNER_CODE'
    };
  }

  const lastOuter = outerCodeContext || getLastOuterCodeScan();

  if (!lastOuter) {
    return {
      success: false,
      error: '请先扫描外盒二维码，再扫描内码',
      code: 'NO_OUTER_CODE_SCAN',
      needOuterScan: true,
      innerCode: innerCode
    };
  }

  const bindingResult = mockData.verifyDualCodeBinding(lastOuter.outerCode, innerCode);

  const currentLocation = await getCurrentLocation();
  const now = Date.now();

  const dualRecord = {
    type: 'dual_verify',
    outerCode: lastOuter.outerCode,
    innerCode: innerCode,
    outerScannedAt: lastOuter.scannedAt,
    innerScannedAt: now,
    timeInterval: Math.round((now - lastOuter.scannedAt) / 1000),
    traceId: bindingResult.traceId || lastOuter.traceId,
    productName: bindingResult.productName || lastOuter.productName,
    bindBatch: bindingResult.bindBatch,
    location: {
      outer: lastOuter.location,
      inner: currentLocation
    },
    bindingResult: {
      isOuterValid: bindingResult.isOuterValid,
      isInnerValid: bindingResult.isInnerValid,
      isBound: bindingResult.isBound,
      matchTraceId: bindingResult.matchTraceId,
      matchBindBatch: bindingResult.matchBindBatch
    }
  };

  saveDualCodeVerifyRecord(dualRecord);

  if (!bindingResult.isBound) {
    return {
      success: true,
      scanType: 'inner_scan',
      verifyStatus: 'binding_mismatch',
      authenticity: 'suspicious',
      title: '双码验证异常',
      message: bindingResult.errorMessage,
      errorType: bindingResult.errorType,
      errorMessage: bindingResult.errorMessage,
      outerCode: lastOuter.outerCode,
      innerCode: innerCode,
      traceId: lastOuter.traceId,
      productName: lastOuter.productName,
      outerScanInfo: {
        time: lastOuter.scannedAtStr,
        location: getCityFromLocation(lastOuter.location ? lastOuter.location.city : '')
      },
      innerScanInfo: {
        time: formatDateTime(now),
        location: getCityFromLocation(currentLocation.city)
      },
      bindingDetail: {
        expectedOuterCode: lastOuter.outerCode,
        expectedInnerCode: lastOuter.innerCode,
        actualInnerCode: innerCode,
        bindBatch: lastOuter.summary ? lastOuter.summary.bindBatch : null
      },
      riskLevel: 'danger',
      riskTitle: '内外码绑定关系异常',
      riskDescription: bindingResult.errorMessage + '，建议立即举报或联系官方客服核实',
      recommendedAction: 'report',
      nextStep: '检测到内外码绑定异常，请立即前往举报页面，双码信息将自动带入'
    };
  }

  const traceId = bindingResult.traceId;
  const baseVerifyResult = await verifyProduct(traceId);

  clearLastOuterCodeScan();

  return {
    success: true,
    scanType: 'inner_scan',
    verifyStatus: 'binding_success',
    authenticity: baseVerifyResult.success ? baseVerifyResult.authenticity : 'genuine',
    title: '双码验证通过',
    message: '内外码绑定关系匹配，产品为正品，双重防伪验证通过！',
    outerCode: lastOuter.outerCode,
    innerCode: innerCode,
    traceId: traceId,
    productName: bindingResult.productName,
    bindBatch: bindingResult.bindBatch,
    outerScanInfo: {
      time: lastOuter.scannedAtStr,
      location: getCityFromLocation(lastOuter.location ? lastOuter.location.city : '')
    },
    innerScanInfo: {
      time: formatDateTime(now),
      location: getCityFromLocation(currentLocation.city)
    },
    bindingDetail: {
      isBound: true,
      matchTraceId: true,
      matchBindBatch: true,
      timeIntervalSeconds: dualRecord.timeInterval,
      verifiedAt: formatDateTime(now)
    },
    baseVerifyResult: baseVerifyResult.success ? baseVerifyResult : null,
    riskLevel: 'normal',
    nextStep: baseVerifyResult.success
      ? '双码验真通过！可查看完整产品溯源信息'
      : '双码绑定通过，基础防伪信息查询完成'
  };
}

function getDualCodeVerifyStats() {
  const records = getDualCodeVerifyRecords();
  const total = records.length;
  const outerScans = records.filter(r => r.type === 'outer_scan').length;
  const dualVerifications = records.filter(r => r.type === 'dual_verify').length;
  const passed = records.filter(r => r.type === 'dual_verify' && r.bindingResult && r.bindingResult.isBound).length;
  const failed = dualVerifications - passed;
  const mismatchCount = records.filter(r => r.type === 'dual_verify' && r.bindingResult && !r.bindingResult.isBound).length;

  const result = {
    totalRecords: total,
    outerScanCount: outerScans,
    dualVerifyCount: dualVerifications,
    totalVerifyCount: dualVerifications,
    passedCount: passed,
    failedCount: failed,
    mismatchCount: mismatchCount,
    successRate: dualVerifications > 0 ? Math.round((passed / dualVerifications) * 100) : 0,
    passRate: dualVerifications > 0 ? Math.round((passed / dualVerifications) * 100) : 0
  };

  if (typeof result.totalVerifyCount !== 'number') result.totalVerifyCount = 0;
  if (typeof result.mismatchCount !== 'number') result.mismatchCount = 0;

  return result;
}

function goToDualReport(outerCode, innerCode, errorType, errorMessage, traceId, productName) {
  let params = {};

  if (outerCode && typeof outerCode === 'object') {
    params = outerCode;
  } else {
    params = {
      traceId: traceId || '',
      productName: productName || '',
      outerCode: outerCode || '',
      innerCode: innerCode || '',
      errorType: errorType || '',
      errorMessage: errorMessage || ''
    };
  }

  const reportParams = Object.assign({
    traceId: '',
    productName: '',
    outerCode: '',
    innerCode: '',
    errorType: '',
    errorMessage: '',
    autoSelectType: 'dual_mismatch'
  }, params);

  const queryString = Object.keys(reportParams)
    .filter(key => reportParams[key] !== undefined && reportParams[key] !== null && reportParams[key] !== '')
    .map(key => `${key}=${encodeURIComponent(reportParams[key])}`)
    .join('&');

  return `/pages/reportProduct/reportProduct?${queryString}`;
}

function submitDualReport(reportData) {
  if (!reportData) {
    return {
      success: false,
      error: '缺少举报信息',
      code: 'MISSING_PARAMS'
    };
  }

  if (!reportData.reportType) {
    return {
      success: false,
      error: '请选择举报类型',
      code: 'MISSING_REPORT_TYPE'
    };
  }

  const dualReportData = {
    ...reportData,
    reportSource: 'dual_code_verify',
    hasDualCode: !!(reportData.outerCode && reportData.innerCode),
    dualCodeInfo: reportData.outerCode || reportData.innerCode ? {
      outerCode: reportData.outerCode || '',
      innerCode: reportData.innerCode || '',
      errorType: reportData.errorType || '',
      errorMessage: reportData.errorMessage || ''
    } : null
  };

  const reportType = dualReportData.reportType || 'dual_mismatch';
  if (!dualReportData.reportTypeLabel) {
    dualReportData.reportTypeLabel = getReportTypes().find(t => t.key === reportType)
      ? getReportTypes().find(t => t.key === reportType).label
      : '双码异常举报';
  }

  return submitReport(dualReportData);
}

module.exports = {
  verifyProduct,
  verifyProductEnhanced,
  getProductScanStats,
  detectAbnormalBehavior,
  submitReport,
  getReportRecords,
  getReportTypes,
  formatDateTime,
  getCityFromLocation,
  maskIp,
  clearAllScanRecords,
  isFirstScanForTraceId,
  verifyGiftBoxAntiCounterfeit,
  getSubCodeGiftBoxContext,
  getDualCodeVerifyRecords,
  saveDualCodeVerifyRecord,
  getLastOuterCodeScan,
  setLastOuterCodeScan,
  clearLastOuterCodeScan,
  scanOuterCode,
  scanInnerCode,
  getDualCodeVerifyStats,
  goToDualReport,
  submitDualReport,
  ABNORMAL_TIME_WINDOW,
  ABNORMAL_SCAN_THRESHOLD,
  ABNORMAL_LOCATION_COUNT
};
