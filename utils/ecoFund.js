var certWallet = require('./certificateWallet.js');
var storage = require('./storage.js');

var DONATION_RECORDS_KEY = 'eco_fund_donation_records';
var MAX_DONATION_RECORDS = 100;

var FUND_PROJECTS = [
  {
    key: 'ancientTeaTree',
    name: '古茶树保护',
    icon: '🌳',
    color: '#2E8B57',
    description: '为武夷山百年古茶树提供专业养护、病虫害防治、基因建档，守护千年茶文化根脉。',
    targetArea: '福建武夷山国家级茶树种植保护区',
    impactMetric: '每100元可养护1株百年古茶树一年',
    progress: 68,
    raised: 128560,
    target: 188000
  },
  {
    key: 'osmanthusReplant',
    name: '桂花树复种',
    icon: '🌼',
    color: '#DAA520',
    description: '在咸宁桂花之乡补种金桂、银桂树苗，帮助当地农户恢复生态种植，延续桂花产业。',
    targetArea: '湖北省咸宁市桂花镇',
    impactMetric: '每50元可种植1株金桂树苗，3年后产花',
    progress: 45,
    raised: 90000,
    target: 200000
  },
  {
    key: 'plasticReduction',
    name: '包装减塑项目',
    icon: '♻️',
    color: '#1890FF',
    description: '研发可降解包装材料、推广可循环包装容器，减少茶行业塑料包装废弃物。',
    targetArea: '全产业链包装环节',
    impactMetric: '每200元可替代1000个塑料内衬袋',
    progress: 82,
    raised: 164000,
    target: 200000
  }
];

var BATCH_DONATION_MAP = {
  'GH202503': {
    projectKey: 'osmanthusReplant',
    targetProjectName: 'A市桂花园定向支持计划',
    targetLocation: '湖北省A市咸安区桂花镇',
    description: '购买GH202503批次金桂花茶，每罐捐赠1元定向用于A市桂花园桂花树复种项目。',
    matchedDonation: true,
    matchRatio: '1:1',
    matchNote: '品牌方1:1配捐，您捐1元，品牌再捐1元'
  }
};

var CHARITY_ORG_INFO = {
  name: '中华环境保护基金会',
  registrationNo: '基证字第0077号',
  registrationAuthority: '中华人民共和国民政部',
  registeredDate: '1993年4月',
  legalPerson: '理事长：徐光',
  contactPhone: '010-67112111',
  contactEmail: 'contact@cepf.org.cn',
  officialWebsite: 'https://www.cepf.org.cn',
  address: '北京市崇文区广渠门内大街16号',
  qualificationLevel: '5A级社会组织',
  taxDeductible: true,
  taxDeductibleNote: '捐赠可凭捐赠票据在个人所得税税前扣除',
  businessScope: [
    '资助和开展环境保护宣传教育活动',
    '资助和开展生态保护与修复项目',
    '资助和开展环境保护科学研究',
    '资助和开展环境保护国际交流与合作'
  ],
  certificates: [
    {
      type: '基金会法人登记证书',
      certNo: '基证字第0077号',
      issueOrg: '中华人民共和国民政部',
      validUntil: '长期',
      image: ''
    },
    {
      type: '慈善组织公开募捐资格证书',
      certNo: '慈组证字第010000077号',
      issueOrg: '中华人民共和国民政部',
      validUntil: '2028年12月31日',
      image: ''
    },
    {
      type: '公益性捐赠税前扣除资格',
      certNo: '财税〔2024〕XX号',
      issueOrg: '财政部、税务总局、民政部',
      validUntil: '2026年12月31日',
      image: ''
    }
  ],
  annualReports: [
    { year: '2024年', url: 'https://www.cepf.org.cn/report/2024', size: '2.3MB' },
    { year: '2023年', url: 'https://www.cepf.org.cn/report/2023', size: '2.1MB' },
    { year: '2022年', url: 'https://www.cepf.org.cn/report/2022', size: '1.9MB' }
  ],
  auditReport: '本基金会年度财务报告均由立信会计师事务所（特殊普通合伙）审计并出具标准无保留意见审计报告。'
};

function getFundProjects() {
  return JSON.parse(JSON.stringify(FUND_PROJECTS));
}

function getFundProjectByKey(key) {
  var list = getFundProjects();
  for (var i = 0; i < list.length; i++) {
    if (list[i].key === key) return list[i];
  }
  return null;
}

function getBatchDonationConfig(batchNo) {
  if (!batchNo) return null;
  var config = BATCH_DONATION_MAP[batchNo];
  if (!config) return null;
  return JSON.parse(JSON.stringify(config));
}

function getCharityOrgInfo() {
  return JSON.parse(JSON.stringify(CHARITY_ORG_INFO));
}

function getDonationRecords() {
  try {
    return wx.getStorageSync(DONATION_RECORDS_KEY) || [];
  } catch (e) {
    console.error('[EcoFund] 获取捐赠记录失败:', e);
    return [];
  }
}

function addDonationRecord(record) {
  if (!record) return getDonationRecords();
  try {
    var list = getDonationRecords();
    var newRecord = Object.assign({
      id: 'DON_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      timestamp: Date.now(),
      status: 'success'
    }, record);

    list.unshift(newRecord);
    if (list.length > MAX_DONATION_RECORDS) list.splice(MAX_DONATION_RECORDS);
    wx.setStorageSync(DONATION_RECORDS_KEY, list);
    console.info('[EcoFund] 捐赠记录已保存:', newRecord.id);
    return list;
  } catch (e) {
    console.error('[EcoFund] 保存捐赠记录失败:', e);
    return getDonationRecords();
  }
}

function buildDonationCertificate(options) {
  if (!options) return null;
  var amount = options.amount || 1;
  var projectKey = options.projectKey || 'general';
  var project = getFundProjectByKey(projectKey);
  var projectName = project ? project.name : '产区生态基金';
  var traceData = options.traceData || {};
  var basic = traceData.basicInfo || {};
  var batchConfig = options.batchNo ? getBatchDonationConfig(options.batchNo) : null;
  var now = new Date();
  var dateStr = now.getFullYear() + '年' + (now.getMonth() + 1) + '月' + now.getDate() + '日';
  var certId = 'DONCERT_' + Date.now() + '_' + Math.floor(Math.random() * 10000);

  return {
    certId: certId,
    type: 'donation_cert',
    title: '公益捐赠证书',
    subtitle: '感谢您对' + projectName + '的支持',
    traceId: basic.traceId || '',
    productName: basic.productName || '',
    productImage: basic.thumbnail || '',
    batchNo: basic.batchNo || options.batchNo || '',
    issuer: CHARITY_ORG_INFO.name,
    issueDate: dateStr,
    certNo: 'DON-' + now.getFullYear() + (now.getMonth() + 1).toString().padStart(2, '0') +
      now.getDate().toString().padStart(2, '0') + '-' + Math.floor(Math.random() * 9000 + 1000),
    status: 'verified',
    verifyUrl: CHARITY_ORG_INFO.officialWebsite,
    summary: {
      donationAmount: amount,
      projectKey: projectKey,
      projectName: projectName,
      projectIcon: project ? project.icon : '💚',
      projectDescription: project ? project.description : '',
      donorName: options.donorName || '爱心人士',
      donationDate: dateStr,
      donationPurpose: batchConfig ? batchConfig.description : ('捐至' + projectName),
      matchedDonation: batchConfig ? batchConfig.matchedDonation : false,
      matchRatio: batchConfig ? batchConfig.matchRatio : '',
      matchNote: batchConfig ? batchConfig.matchNote : '',
      targetLocation: batchConfig ? batchConfig.targetLocation : (project ? project.targetArea : ''),
      impactMetric: project ? project.impactMetric : '',
      taxDeductible: CHARITY_ORG_INFO.taxDeductible,
      taxDeductibleNote: CHARITY_ORG_INFO.taxDeductibleNote,
      charityOrgName: CHARITY_ORG_INFO.name,
      charityOrgRegNo: CHARITY_ORG_INFO.registrationNo,
      invoiceAvailable: true,
      invoiceNote: '如需开具捐赠票据，请在30日内联系慈善组织并提供捐赠凭证编号'
    },
    rawData: options
  };
}

function processOneYuanDonation(options) {
  options = options || {};
  var amount = options.amount || 1;
  var projectKey = options.projectKey;
  var batchNo = options.batchNo;
  var traceData = options.traceData;

  if (batchNo && !projectKey) {
    var batchConfig = getBatchDonationConfig(batchNo);
    if (batchConfig) {
      projectKey = batchConfig.projectKey;
    }
  }
  if (!projectKey) {
    projectKey = FUND_PROJECTS[0].key;
  }

  var donationRecord = {
    amount: amount,
    projectKey: projectKey,
    projectName: (getFundProjectByKey(projectKey) || {}).name || '产区生态基金',
    batchNo: batchNo || (traceData && traceData.basicInfo ? traceData.basicInfo.batchNo : ''),
    traceId: traceData && traceData.basicInfo ? traceData.basicInfo.traceId : '',
    orderNo: 'ECORD_' + Date.now(),
    channel: options.channel || 'trace_scan',
    donorName: options.donorName || '爱心人士',
    donorMessage: options.donorMessage || ''
  };

  addDonationRecord(donationRecord);

  var certData = buildDonationCertificate({
    amount: amount,
    projectKey: projectKey,
    batchNo: donationRecord.batchNo,
    traceData: traceData,
    donorName: donationRecord.donorName
  });

  if (certData) {
    certWallet.addCertificate(certData);
  }

  return {
    success: true,
    donationRecord: donationRecord,
    certificate: certData,
    totalDonated: getTotalDonationAmount(),
    donationCount: getDonationRecords().length
  };
}

function getTotalDonationAmount() {
  var records = getDonationRecords();
  var total = 0;
  for (var i = 0; i < records.length; i++) {
    if (records[i].status === 'success') {
      total += Number(records[i].amount) || 0;
    }
  }
  return total;
}

function getDonationStats() {
  var records = getDonationRecords();
  var total = 0;
  var count = 0;
  var projectStats = {};

  for (var i = 0; i < records.length; i++) {
    var r = records[i];
    if (r.status === 'success') {
      total += Number(r.amount) || 0;
      count++;
      var key = r.projectKey || 'unknown';
      if (!projectStats[key]) {
        projectStats[key] = { amount: 0, count: 0 };
      }
      projectStats[key].amount += Number(r.amount) || 0;
      projectStats[key].count += 1;
    }
  }

  return {
    totalAmount: total,
    totalCount: count,
    projectStats: projectStats,
    avgAmount: count > 0 ? (total / count).toFixed(2) : 0
  };
}

function applyForInvoice(donationId, options) {
  options = options || {};
  return {
    success: true,
    message: '发票申请已提交，请在15个工作日内查收',
    applicationId: 'INV_' + Date.now(),
    estimatedDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString('zh-CN'),
    type: options.type || 'electronic',
    title: options.title || '个人',
    taxNo: options.taxNo || '',
    email: options.email || ''
  };
}

module.exports = {
  getFundProjects: getFundProjects,
  getFundProjectByKey: getFundProjectByKey,
  getBatchDonationConfig: getBatchDonationConfig,
  getCharityOrgInfo: getCharityOrgInfo,
  getDonationRecords: getDonationRecords,
  addDonationRecord: addDonationRecord,
  buildDonationCertificate: buildDonationCertificate,
  processOneYuanDonation: processOneYuanDonation,
  getTotalDonationAmount: getTotalDonationAmount,
  getDonationStats: getDonationStats,
  applyForInvoice: applyForInvoice,
  FUND_PROJECTS: FUND_PROJECTS,
  BATCH_DONATION_MAP: BATCH_DONATION_MAP,
  CHARITY_ORG_INFO: CHARITY_ORG_INFO,
  DONATION_RECORDS_KEY: DONATION_RECORDS_KEY
};
