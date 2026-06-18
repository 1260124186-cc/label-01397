var CERTIFICATES_KEY = 'user_certificate_wallet';
var MAX_CERTIFICATES = 200;

var CERTIFICATE_TYPES = {
  ORGANIC: 'organic',
  TEST_REPORT: 'testReport',
  BLOCKCHAIN: 'blockchain'
};

function getCertificates() {
  try {
    return wx.getStorageSync(CERTIFICATES_KEY) || [];
  } catch (e) {
    console.error('[CertificateWallet] 获取证书列表失败:', e);
    return [];
  }
}

function addCertificate(certData) {
  if (!certData || !certData.certId) return getCertificates();
  try {
    var list = getCertificates();
    var idx = -1;
    for (var i = 0; i < list.length; i++) {
      if (list[i].certId === certData.certId) { idx = i; break; }
    }
    if (idx !== -1) return list;

    var newCert = {
      certId: certData.certId,
      type: certData.type || CERTIFICATE_TYPES.TEST_REPORT,
      title: certData.title || '',
      subtitle: certData.subtitle || '',
      traceId: certData.traceId || '',
      productName: certData.productName || '',
      productImage: certData.productImage || '',
      batchNo: certData.batchNo || '',
      issuer: certData.issuer || '',
      issueDate: certData.issueDate || '',
      certNo: certData.certNo || '',
      status: certData.status || 'verified',
      verifyUrl: certData.verifyUrl || '',
      summary: certData.summary || null,
      blockchain: certData.blockchain || null,
      rawData: certData.rawData || null,
      addTime: Date.now()
    };

    list.unshift(newCert);
    if (list.length > MAX_CERTIFICATES) list.splice(MAX_CERTIFICATES);
    wx.setStorageSync(CERTIFICATES_KEY, list);
    console.info('[CertificateWallet] 已添加证书:', certData.certId);
    return list;
  } catch (e) {
    console.error('[CertificateWallet] 添加证书失败:', e);
    return getCertificates();
  }
}

function removeCertificate(certId) {
  try {
    var list = getCertificates();
    var filtered = list.filter(function(item) { return item.certId !== certId; });
    wx.setStorageSync(CERTIFICATES_KEY, filtered);
    console.info('[CertificateWallet] 已删除证书:', certId);
    return filtered;
  } catch (e) {
    console.error('[CertificateWallet] 删除证书失败:', e);
    return getCertificates();
  }
}

function hasCertificate(certId) {
  var list = getCertificates();
  for (var i = 0; i < list.length; i++) {
    if (list[i].certId === certId) return true;
  }
  return false;
}

function getCertificateById(certId) {
  var list = getCertificates();
  for (var i = 0; i < list.length; i++) {
    if (list[i].certId === certId) return list[i];
  }
  return null;
}

function getCertificatesByType(type) {
  var list = getCertificates();
  if (!type) return list;
  return list.filter(function(item) { return item.type === type; });
}

function clearCertificates() {
  try {
    wx.setStorageSync(CERTIFICATES_KEY, []);
    return [];
  } catch (e) {
    console.error('[CertificateWallet] 清空证书失败:', e);
    return getCertificates();
  }
}

function getCertificateCount() {
  return getCertificates().length;
}

function buildOrganicCert(traceData) {
  if (!traceData) return null;
  var basic = traceData.basicInfo || {};
  var green = traceData.greenTrace || {};
  var eco = green.ecoPlanting || {};
  return {
    certId: 'ORG_' + basic.traceId,
    type: CERTIFICATE_TYPES.ORGANIC,
    title: eco.certification || '有机产品认证',
    subtitle: '绿色生态种植认证证书',
    traceId: basic.traceId || '',
    productName: basic.productName || '',
    productImage: basic.thumbnail || '',
    batchNo: basic.batchNo || '',
    issuer: '中国有机产品认证中心',
    issueDate: basic.productionTime || '',
    certNo: 'ORG-' + (basic.batchNo || '') + '-' + (basic.traceId || ''),
    status: 'verified',
    verifyUrl: 'https://www.cnca.gov.cn/verify',
    summary: {
      certificationType: eco.certification || '有机产品认证',
      plantingRecords: eco.records || [],
      packingCert: (green.ecoPacking && green.ecoPacking.certification) || '',
      logisticsCarbon: (green.ecoLogistics && green.ecoLogistics.carbonReduction) || ''
    },
    rawData: traceData
  };
}

function buildTestReportCert(traceData) {
  if (!traceData) return null;
  var basic = traceData.basicInfo || {};
  var test = traceData.pesticideTest || {};
  var allTests = (test.teaTests || []).concat(test.osmanthusTests || []);
  var passCount = allTests.filter(function(t) { return t.status === '合格'; }).length;
  var hasAbnormal = test.hasAbnormal === true;
  return {
    certId: 'TEST_' + basic.traceId + '_' + (test.reportNo || ''),
    type: CERTIFICATE_TYPES.TEST_REPORT,
    title: '产品检测报告',
    subtitle: hasAbnormal ? '存在异常检测项' : '全部检测项目合格',
    traceId: basic.traceId || '',
    productName: basic.productName || '',
    productImage: basic.thumbnail || '',
    batchNo: basic.batchNo || '',
    issuer: test.institution || '第三方检测机构',
    issueDate: test.testDate || '',
    certNo: test.reportNo || '',
    status: hasAbnormal ? 'warning' : 'verified',
    verifyUrl: test.verifyUrl || '',
    summary: {
      institution: test.institution || '',
      testDate: test.testDate || '',
      reportNo: test.reportNo || '',
      standard: test.standard || '',
      totalItems: allTests.length,
      passItems: passCount,
      failItems: allTests.length - passCount,
      hasAbnormal: hasAbnormal,
      comparisonTip: test.comparisonTip || ''
    },
    rawData: traceData
  };
}

function buildBlockchainCert(traceData) {
  if (!traceData) return null;
  var basic = traceData.basicInfo || {};
  var bc = traceData.blockchainInfo || {};
  return {
    certId: 'BC_' + basic.traceId,
    type: CERTIFICATE_TYPES.BLOCKCHAIN,
    title: '区块链存证凭证',
    subtitle: '数据已上链，真实可查不可篡改',
    traceId: basic.traceId || '',
    productName: basic.productName || '',
    productImage: basic.thumbnail || '',
    batchNo: basic.batchNo || '',
    issuer: bc.chainName || '溯源链',
    issueDate: bc.timestamp || '',
    certNo: bc.txHashShort || '',
    status: bc.verifyStatus === '已验证' ? 'verified' : 'pending',
    verifyUrl: bc.blockExplorerUrl || '',
    summary: {
      chainName: bc.chainName || '',
      chainId: bc.chainId || '',
      blockHeight: bc.blockHeight || '',
      txHash: bc.txHash || '',
      txHashShort: bc.txHashShort || '',
      timestamp: bc.timestamp || '',
      verifyStatus: bc.verifyStatus || '',
      contractAddress: bc.contractAddress || '',
      nodeCount: bc.nodeCount || '',
      consensusType: bc.consensusType || '',
      onChainFields: bc.onChainFields || [],
      tsaCertificate: bc.tsaCertificate || null
    },
    blockchain: bc || null,
    rawData: traceData
  };
}

function buildAllCertificatesFromTrace(traceData) {
  if (!traceData) return [];
  var certs = [];
  var organic = buildOrganicCert(traceData);
  if (organic) certs.push(organic);
  var testReport = buildTestReportCert(traceData);
  if (testReport) certs.push(testReport);
  var blockchain = buildBlockchainCert(traceData);
  if (blockchain) certs.push(blockchain);
  return certs;
}

function formatType(type) {
  switch (type) {
    case CERTIFICATE_TYPES.ORGANIC: return '有机认证';
    case CERTIFICATE_TYPES.TEST_REPORT: return '检测报告';
    case CERTIFICATE_TYPES.BLOCKCHAIN: return '区块链存证';
    default: return '数字证书';
  }
}

function formatTypeIcon(type) {
  switch (type) {
    case CERTIFICATE_TYPES.ORGANIC: return '🌱';
    case CERTIFICATE_TYPES.TEST_REPORT: return '🔬';
    case CERTIFICATE_TYPES.BLOCKCHAIN: return '🔗';
    default: return '📜';
  }
}

function formatTypeColor(type) {
  switch (type) {
    case CERTIFICATE_TYPES.ORGANIC: return '#52C41A';
    case CERTIFICATE_TYPES.TEST_REPORT: return '#1890FF';
    case CERTIFICATE_TYPES.BLOCKCHAIN: return '#722ED1';
    default: return '#2E8B57';
  }
}

function formatTime(timestamp) {
  if (!timestamp) return '';
  var date = new Date(timestamp);
  var now = new Date();
  var diffMs = now.getTime() - date.getTime();
  var diffMins = Math.floor(diffMs / (1000 * 60));
  var diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  var diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return '刚刚';
  else if (diffMins < 60) return diffMins + '分钟前收藏';
  else if (diffHours < 24) return diffHours + '小时前收藏';
  else if (diffDays < 7) return diffDays + '天前收藏';
  else {
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours().toString().padStart(2, '0');
    var minute = date.getMinutes().toString().padStart(2, '0');
    return month + '月' + day + '日 ' + hour + ':' + minute;
  }
}

module.exports = {
  getCertificates: getCertificates,
  addCertificate: addCertificate,
  removeCertificate: removeCertificate,
  hasCertificate: hasCertificate,
  getCertificateById: getCertificateById,
  getCertificatesByType: getCertificatesByType,
  clearCertificates: clearCertificates,
  getCertificateCount: getCertificateCount,
  buildOrganicCert: buildOrganicCert,
  buildTestReportCert: buildTestReportCert,
  buildBlockchainCert: buildBlockchainCert,
  buildAllCertificatesFromTrace: buildAllCertificatesFromTrace,
  formatType: formatType,
  formatTypeIcon: formatTypeIcon,
  formatTypeColor: formatTypeColor,
  formatTime: formatTime,
  CERTIFICATE_TYPES: CERTIFICATE_TYPES,
  CERTIFICATES_KEY: CERTIFICATES_KEY,
  MAX_CERTIFICATES: MAX_CERTIFICATES
};
