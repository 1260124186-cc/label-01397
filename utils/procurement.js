/**
 * B2B 企业采购协作门户 - 核心工具模块
 * 功能：采购账号体系、权限控制、批次资质、检测报告、RFQ、合同管理、物流跟踪、质检归档
 */

const mockData = require('./mockData.js');

const PROCUREMENT_USER_KEY = 'procurement_user';
const PROCUREMENT_TOKEN_KEY = 'procurement_token';
const PROCUREMENT_RFQ_KEY = 'procurement_rfqs';
const PROCUREMENT_CONTRACT_KEY = 'procurement_contracts';
const PROCUREMENT_ARCHIVE_KEY = 'procurement_archives';
const PROCUREMENT_LOGISTICS_KEY = 'procurement_logistics';
const PROCUREMENT_PURCHASED_KEY = 'procurement_purchased_batches';

const ROLE_BUYER = 'buyer';
const ROLE_INSPECTOR = 'inspector';
const ROLE_FINANCE = 'finance';
const ROLE_ADMIN = 'admin';

const ROLE_LABELS = {
  [ROLE_BUYER]: '采购员',
  [ROLE_INSPECTOR]: '质检员',
  [ROLE_FINANCE]: '财务',
  [ROLE_ADMIN]: '管理员'
};

const ENTERPRISE_TYPES = {
  hotel: { label: '酒店', icon: '🏨', desc: '高端酒店及连锁酒店集团' },
  tea: { label: '连锁茶饮', icon: '🧋', desc: '茶饮连锁品牌及加盟门店' },
  gift: { label: '礼品公司', icon: '🎁', desc: '礼品定制及企业福利供应商' }
};

const PERMISSIONS = {
  viewDashboard: [ROLE_BUYER, ROLE_INSPECTOR, ROLE_FINANCE, ROLE_ADMIN],
  queryBatchQualification: [ROLE_BUYER, ROLE_INSPECTOR, ROLE_ADMIN],
  downloadReport: [ROLE_BUYER, ROLE_INSPECTOR, ROLE_FINANCE, ROLE_ADMIN],
  createRFQ: [ROLE_BUYER, ROLE_ADMIN],
  viewRFQ: [ROLE_BUYER, ROLE_FINANCE, ROLE_ADMIN],
  manageContract: [ROLE_BUYER, ROLE_FINANCE, ROLE_ADMIN],
  linkContractBatch: [ROLE_BUYER, ROLE_ADMIN],
  viewLogistics: [ROLE_BUYER, ROLE_INSPECTOR, ROLE_ADMIN],
  archiveQualityDoc: [ROLE_INSPECTOR, ROLE_ADMIN],
  viewArchive: [ROLE_INSPECTOR, ROLE_BUYER, ROLE_FINANCE, ROLE_ADMIN],
  financeApproval: [ROLE_FINANCE, ROLE_ADMIN],
  manageUsers: [ROLE_ADMIN]
};

const MOCK_ENTERPRISE_ACCOUNTS = [
  {
    account: 'hotel_buyer01',
    password: '123456',
    name: '王采购',
    role: ROLE_BUYER,
    enterpriseType: 'hotel',
    enterpriseName: '锦绣酒店集团',
    phone: '13800138001',
    email: 'wang@jinxiu-hotel.com'
  },
  {
    account: 'hotel_inspector01',
    password: '123456',
    name: '李质检',
    role: ROLE_INSPECTOR,
    enterpriseType: 'hotel',
    enterpriseName: '锦绣酒店集团',
    phone: '13800138002',
    email: 'li@jinxiu-hotel.com'
  },
  {
    account: 'hotel_finance01',
    password: '123456',
    name: '张财务',
    role: ROLE_FINANCE,
    enterpriseType: 'hotel',
    enterpriseName: '锦绣酒店集团',
    phone: '13800138003',
    email: 'zhang@jinxiu-hotel.com'
  },
  {
    account: 'tea_buyer01',
    password: '123456',
    name: '陈经理',
    role: ROLE_BUYER,
    enterpriseType: 'tea',
    enterpriseName: '茶颜小语连锁',
    phone: '13900139001',
    email: 'chen@chayanxiaoyu.com'
  },
  {
    account: 'tea_inspector01',
    password: '123456',
    name: '周质检',
    role: ROLE_INSPECTOR,
    enterpriseType: 'tea',
    enterpriseName: '茶颜小语连锁',
    phone: '13900139002',
    email: 'zhou@chayanxiaoyu.com'
  },
  {
    account: 'gift_buyer01',
    password: '123456',
    name: '刘采购',
    role: ROLE_BUYER,
    enterpriseType: 'gift',
    enterpriseName: '心意礼品有限公司',
    phone: '13700137001',
    email: 'liu@xinyi-gift.com'
  },
  {
    account: 'gift_finance01',
    password: '123456',
    name: '赵会计',
    role: ROLE_FINANCE,
    enterpriseType: 'gift',
    enterpriseName: '心意礼品有限公司',
    phone: '13700137002',
    email: 'zhao@xinyi-gift.com'
  },
  {
    account: 'admin001',
    password: '123456',
    name: '超级管理员',
    role: ROLE_ADMIN,
    enterpriseType: 'hotel',
    enterpriseName: '锦绣酒店集团',
    phone: '13600136000',
    email: 'admin@procurement.com'
  }
];

const MOCK_PURCHASED_BATCHES = [
  {
    id: 'PB202509001',
    batchNo: 'GH202503',
    productName: '金桂花茶',
    specification: '100g/罐',
    quantity: 500,
    unit: '罐',
    unitPrice: 128,
    totalAmount: 64000,
    purchaseDate: '2025-09-20',
    expectedDelivery: '2025-09-25',
    actualDelivery: '2025-09-24',
    logisticsStatus: 'delivered',
    logisticsCompany: '顺丰速运',
    trackingNo: 'SF1234567890123',
    qualityStatus: 'passed',
    inspectionReportId: 'IR20250924001',
    contractId: 'CT202508001',
    rfqId: 'RFQ202508001',
    remark: '首批采购，用于中秋礼盒'
  },
  {
    id: 'PB202509002',
    batchNo: 'GH202504',
    productName: '银桂花茶',
    specification: '80g/罐',
    quantity: 300,
    unit: '罐',
    unitPrice: 98,
    totalAmount: 29400,
    purchaseDate: '2025-09-22',
    expectedDelivery: '2025-09-28',
    actualDelivery: null,
    logisticsStatus: 'shipping',
    logisticsCompany: '京东物流',
    trackingNo: 'JD9876543210987',
    qualityStatus: 'pending',
    inspectionReportId: null,
    contractId: 'CT202508002',
    rfqId: 'RFQ202508002',
    remark: '补充采购，日常使用'
  },
  {
    id: 'PB202509003',
    batchNo: 'GH202505',
    productName: '精品桂花茶礼盒',
    specification: '4罐/盒',
    quantity: 200,
    unit: '盒',
    unitPrice: 488,
    totalAmount: 97600,
    purchaseDate: '2025-09-25',
    expectedDelivery: '2025-10-05',
    actualDelivery: null,
    logisticsStatus: 'pending',
    logisticsCompany: null,
    trackingNo: null,
    qualityStatus: 'pending',
    inspectionReportId: null,
    contractId: 'CT202509001',
    rfqId: 'RFQ202509001',
    remark: '国庆礼品定制'
  },
  {
    id: 'PB202508001',
    batchNo: 'GH202502',
    productName: '金桂花茶',
    specification: '100g/罐',
    quantity: 200,
    unit: '罐',
    unitPrice: 128,
    totalAmount: 25600,
    purchaseDate: '2025-08-15',
    expectedDelivery: '2025-08-20',
    actualDelivery: '2025-08-19',
    logisticsStatus: 'delivered',
    logisticsCompany: '顺丰速运',
    trackingNo: 'SF1122334455667',
    qualityStatus: 'passed',
    inspectionReportId: 'IR20250819001',
    contractId: 'CT202507001',
    rfqId: 'RFQ202507001',
    remark: '首批试采购'
  }
];

const MOCK_LOGISTICS_DETAIL = {
  'SF1234567890123': [
    { time: '2025-09-24 14:30:00', status: '快件已签收，签收人：前台', location: '锦绣酒店集团总部' },
    { time: '2025-09-24 09:15:00', status: '快件正在派送中', location: '武汉市武昌区营业点' },
    { time: '2025-09-24 06:00:00', status: '快件已到达武汉分拨中心', location: '武汉市' },
    { time: '2025-09-23 22:00:00', status: '快件已从宜昌发出', location: '宜昌市' },
    { time: '2025-09-23 16:00:00', status: '快件已揽收', location: '宜昌市桂花茶产地仓' }
  ],
  'JD9876543210987': [
    { time: '2025-09-26 10:00:00', status: '快件运输中', location: '武汉-长沙高速路上' },
    { time: '2025-09-26 06:00:00', status: '快件已到达武汉分拨中心', location: '武汉市' },
    { time: '2025-09-25 20:00:00', status: '快件已从宜昌发出', location: '宜昌市' },
    { time: '2025-09-25 15:00:00', status: '快件已揽收', location: '宜昌市桂花茶产地仓' }
  ]
};

const MOCK_RFQS = [
  {
    id: 'RFQ202509002',
    title: '2025年Q4金桂花茶采购需求',
    productName: '金桂花茶',
    specification: '100g/罐',
    quantity: 1000,
    unit: '罐',
    expectedPrice: 115,
    deadline: '2025-10-15',
    deliveryDate: '2025-11-01',
    status: 'open',
    creator: '陈经理',
    createTime: '2025-09-26 10:00:00',
    description: 'Q4旺季备货，需要长期稳定供应商，要求有机认证',
    attachments: [{ name: '采购需求说明书.pdf', size: '2.3MB' }],
    quotes: [
      { supplier: '湖北桂花茶厂', price: 118, deliveryDays: 7, rating: 4.8 },
      { supplier: '武夷山茶业', price: 122, deliveryDays: 10, rating: 4.6 }
    ]
  },
  {
    id: 'RFQ202509001',
    title: '国庆礼品定制礼盒询价',
    productName: '精品桂花茶礼盒',
    specification: '4罐/盒',
    quantity: 200,
    unit: '盒',
    expectedPrice: 450,
    deadline: '2025-09-28',
    deliveryDate: '2025-10-05',
    status: 'closed',
    creator: '刘采购',
    createTime: '2025-09-20 14:30:00',
    description: '需要定制企业logo，高端礼盒包装',
    attachments: [{ name: '礼盒设计稿.png', size: '5.1MB' }],
    quotes: [
      { supplier: '湖北桂花茶厂', price: 468, deliveryDays: 12, rating: 4.8, selected: true }
    ]
  },
  {
    id: 'RFQ202508002',
    title: '银桂花茶日常补货',
    productName: '银桂花茶',
    specification: '80g/罐',
    quantity: 300,
    unit: '罐',
    expectedPrice: 90,
    deadline: '2025-09-01',
    deliveryDate: '2025-09-15',
    status: 'closed',
    creator: '王采购',
    createTime: '2025-08-25 09:00:00',
    description: '日常门店补货',
    attachments: [],
    quotes: [
      { supplier: '湖北桂花茶厂', price: 92, deliveryDays: 5, rating: 4.8, selected: true }
    ]
  }
];

const MOCK_CONTRACTS = [
  {
    id: 'CT202509001',
    contractNo: 'JX-JD-2025-0901',
    title: '2025年国庆礼品采购合同',
    supplier: '湖北桂花茶厂',
    totalAmount: 97600,
    signDate: '2025-09-22',
    effectiveDate: '2025-09-22',
    expireDate: '2025-12-31',
    status: 'active',
    paymentStatus: 'partial',
    paidAmount: 48800,
    paymentTerms: '50%预付，50%货到验收后',
    linkedBatches: ['GH202505'],
    creator: '刘采购',
    attachments: [{ name: '合同扫描件.pdf', size: '3.2MB' }]
  },
  {
    id: 'CT202508002',
    contractNo: 'JX-JD-2025-0802',
    title: '银桂花茶日常补货合同',
    supplier: '湖北桂花茶厂',
    totalAmount: 29400,
    signDate: '2025-08-30',
    effectiveDate: '2025-08-30',
    expireDate: '2025-11-30',
    status: 'active',
    paymentStatus: 'pending',
    paidAmount: 0,
    paymentTerms: '货到验收后30天内付款',
    linkedBatches: ['GH202504'],
    creator: '王采购',
    attachments: [{ name: '合同扫描件.pdf', size: '1.8MB' }]
  },
  {
    id: 'CT202508001',
    contractNo: 'JX-JD-2025-0801',
    title: '2025年Q3金桂花茶采购合同',
    supplier: '湖北桂花茶厂',
    totalAmount: 64000,
    signDate: '2025-08-15',
    effectiveDate: '2025-08-15',
    expireDate: '2025-10-31',
    status: 'active',
    paymentStatus: 'paid',
    paidAmount: 64000,
    paymentTerms: '预付30%，发货前付清',
    linkedBatches: ['GH202503'],
    creator: '王采购',
    attachments: [{ name: '合同扫描件.pdf', size: '2.5MB' }, { name: '补充协议.pdf', size: '0.8MB' }]
  },
  {
    id: 'CT202507001',
    contractNo: 'JX-JD-2025-0701',
    title: '首批试采购合同',
    supplier: '湖北桂花茶厂',
    totalAmount: 25600,
    signDate: '2025-07-28',
    effectiveDate: '2025-07-28',
    expireDate: '2025-09-30',
    status: 'expired',
    paymentStatus: 'paid',
    paidAmount: 25600,
    paymentTerms: '全款预付',
    linkedBatches: ['GH202502'],
    creator: '王采购',
    attachments: [{ name: '合同扫描件.pdf', size: '1.2MB' }]
  }
];

const MOCK_QUALITY_ARCHIVES = [
  {
    id: 'QA20250924001',
    batchNo: 'GH202503',
    inspectionReportId: 'IR20250924001',
    productName: '金桂花茶',
    inspectionDate: '2025-09-24',
    inspector: '李质检',
    result: 'passed',
    overallScore: 96,
    items: [
      { name: '感官品质', score: 95, standard: '≥90', result: '合格', remark: '色泽金黄，香气浓郁' },
      { name: '水分含量', score: 98, standard: '≤7%', result: '合格', remark: '实测值5.2%' },
      { name: '农药残留', score: 100, standard: '未检出', result: '合格', remark: '32项农残均未检出' },
      { name: '重金属', score: 98, standard: '≤限量值', result: '合格', remark: '铅0.08mg/kg，远低于限值' },
      { name: '微生物指标', score: 96, standard: '符合GB 2762', result: '合格', remark: '菌落总数符合标准' }
    ],
    documents: [
      { name: '质检报告_GH202503.pdf', type: 'report', size: '2.1MB' },
      { name: '农药残留检测报告.pdf', type: 'pesticide', size: '1.5MB' },
      { name: '出厂合格证.pdf', type: 'certificate', size: '0.5MB' },
      { name: '溯源证书.pdf', type: 'trace', size: '0.8MB' }
    ],
    archivedBy: '李质检',
    archiveTime: '2025-09-24 16:30:00',
    remark: '品质优良，符合采购标准'
  },
  {
    id: 'QA20250819001',
    batchNo: 'GH202502',
    inspectionReportId: 'IR20250819001',
    productName: '金桂花茶',
    inspectionDate: '2025-08-19',
    inspector: '李质检',
    result: 'passed',
    overallScore: 94,
    items: [
      { name: '感官品质', score: 92, standard: '≥90', result: '合格', remark: '色泽正常，香气纯正' },
      { name: '水分含量', score: 96, standard: '≤7%', result: '合格', remark: '实测值5.8%' },
      { name: '农药残留', score: 100, standard: '未检出', result: '合格', remark: '32项农残均未检出' },
      { name: '重金属', score: 96, standard: '≤限量值', result: '合格', remark: '符合标准' },
      { name: '微生物指标', score: 94, standard: '符合GB 2762', result: '合格', remark: '符合标准' }
    ],
    documents: [
      { name: '质检报告_GH202502.pdf', type: 'report', size: '1.9MB' },
      { name: '出厂合格证.pdf', type: 'certificate', size: '0.5MB' }
    ],
    archivedBy: '李质检',
    archiveTime: '2025-08-19 14:00:00',
    remark: '试采购批次，品质达标'
  }
];

function formatDateTime(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  return `${year}-${month}-${day} ${hour}:${minute}`;
}

function getProcurementUser() {
  try {
    return wx.getStorageSync(PROCUREMENT_USER_KEY) || null;
  } catch (e) {
    console.error('[Procurement] 获取采购用户失败:', e);
    return null;
  }
}

function setProcurementUser(user) {
  try {
    wx.setStorageSync(PROCUREMENT_USER_KEY, user);
    return true;
  } catch (e) {
    console.error('[Procurement] 保存采购用户失败:', e);
    return false;
  }
}

function clearProcurementUser() {
  try {
    wx.removeStorageSync(PROCUREMENT_USER_KEY);
    wx.removeStorageSync(PROCUREMENT_TOKEN_KEY);
    return true;
  } catch (e) {
    console.error('[Procurement] 清除采购用户失败:', e);
    return false;
  }
}

function isProcurementLoggedIn() {
  try {
    const user = wx.getStorageSync(PROCUREMENT_USER_KEY);
    return !!(user && user.id && user.role);
  } catch (e) {
    return false;
  }
}

function getCurrentRole() {
  const user = getProcurementUser();
  return user ? user.role : null;
}

function getCurrentRoleLabel() {
  const role = getCurrentRole();
  return role ? ROLE_LABELS[role] : '';
}

function hasPermission(permissionKey) {
  const role = getCurrentRole();
  if (!role) return false;
  const allowedRoles = PERMISSIONS[permissionKey];
  if (!allowedRoles) return false;
  return allowedRoles.indexOf(role) !== -1;
}

function requirePermission(permissionKey, denyCallback) {
  if (!hasPermission(permissionKey)) {
    if (typeof denyCallback === 'function') {
      denyCallback();
    } else {
      wx.showToast({
        title: '无操作权限',
        icon: 'none',
        duration: 2000
      });
    }
    return false;
  }
  return true;
}

function procurementLogin(account, password) {
  return new Promise(function(resolve, reject) {
    if (!account || !password) {
      reject({ code: -1, msg: '请输入账号和密码' });
      return;
    }

    setTimeout(function() {
      const found = MOCK_ENTERPRISE_ACCOUNTS.find(function(a) {
        return a.account === account && a.password === password;
      });

      if (!found) {
        reject({ code: -2, msg: '账号或密码错误' });
        return;
      }

      const token = 'procurement_token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 10);
      const userInfo = {
        id: 'pu_' + found.account,
        account: found.account,
        name: found.name,
        role: found.role,
        roleLabel: ROLE_LABELS[found.role],
        enterpriseType: found.enterpriseType,
        enterpriseTypeName: ENTERPRISE_TYPES[found.enterpriseType].label,
        enterpriseTypeIcon: ENTERPRISE_TYPES[found.enterpriseType].icon,
        enterpriseName: found.enterpriseName,
        phone: found.phone,
        email: found.email,
        loginTime: Date.now(),
        lastActiveTime: Date.now()
      };

      setProcurementUser(userInfo);
      try {
        wx.setStorageSync(PROCUREMENT_TOKEN_KEY, token);
      } catch (e) {}

      resolve({ code: 0, data: userInfo, token: token });
    }, 600);
  });
}

function procurementLogout() {
  clearProcurementUser();
}

function getSampleAccounts() {
  return MOCK_ENTERPRISE_ACCOUNTS.map(function(a) {
    return {
      account: a.account,
      role: ROLE_LABELS[a.role],
      enterpriseType: ENTERPRISE_TYPES[a.enterpriseType].label,
      enterpriseName: a.enterpriseName,
      name: a.name,
      desc: a.account + ' / 123456'
    };
  });
}

function getDashboardStats() {
  const user = getProcurementUser();
  const batches = MOCK_PURCHASED_BATCHES;
  const totalAmount = batches.reduce(function(sum, b) { return sum + b.totalAmount; }, 0);
  const pendingShipment = batches.filter(function(b) { return b.logisticsStatus === 'pending'; }).length;
  const shipping = batches.filter(function(b) { return b.logisticsStatus === 'shipping'; }).length;
  const delivered = batches.filter(function(b) { return b.logisticsStatus === 'delivered'; }).length;
  const pendingInspection = batches.filter(function(b) { return b.qualityStatus === 'pending'; }).length;

  return {
    totalBatches: batches.length,
    totalAmount: totalAmount,
    pendingShipment: pendingShipment,
    shipping: shipping,
    delivered: delivered,
    pendingInspection: pendingInspection,
    enterpriseName: user ? user.enterpriseName : '',
    enterpriseType: user ? user.enterpriseTypeName : '',
    enterpriseIcon: user ? user.enterpriseTypeIcon : ''
  };
}

function getPurchasedBatches(filter) {
  let result = MOCK_PURCHASED_BATCHES.slice();
  if (filter) {
    if (filter.status) {
      result = result.filter(function(b) { return b.logisticsStatus === filter.status; });
    }
    if (filter.keyword) {
      const kw = filter.keyword.toLowerCase();
      result = result.filter(function(b) {
        return b.batchNo.toLowerCase().indexOf(kw) !== -1 ||
          b.productName.indexOf(kw) !== -1 ||
          b.id.toLowerCase().indexOf(kw) !== -1;
      });
    }
  }
  return result.map(function(b) {
    return Object.assign({}, b, {
      logisticsStatusLabel: getLogisticsStatusLabel(b.logisticsStatus),
      qualityStatusLabel: getQualityStatusLabel(b.qualityStatus)
    });
  });
}

function getPurchasedBatchById(id) {
  const found = MOCK_PURCHASED_BATCHES.find(function(b) { return b.id === id; });
  if (!found) return null;
  const logisticsDetail = found.trackingNo ? (MOCK_LOGISTICS_DETAIL[found.trackingNo] || []) : [];
  return Object.assign({}, found, {
    logisticsStatusLabel: getLogisticsStatusLabel(found.logisticsStatus),
    qualityStatusLabel: getQualityStatusLabel(found.qualityStatus),
    logisticsDetail: logisticsDetail
  });
}

function getLogisticsStatusLabel(status) {
  const map = {
    pending: '待发货',
    shipping: '运输中',
    delivered: '已送达',
    returned: '已退回'
  };
  return map[status] || status;
}

function getQualityStatusLabel(status) {
  const map = {
    pending: '待质检',
    inspecting: '质检中',
    passed: '质检通过',
    failed: '质检不合格'
  };
  return map[status] || status;
}

function getBatchQualification(batchNos) {
  const result = [];
  batchNos.forEach(function(batchNo) {
    const skus = mockData.getBatchSkus(batchNo.trim().toUpperCase());
    if (skus && skus.length > 0) {
      const sampleTrace = mockData.getTraceData(skus[0].traceId);
      const certificates = (sampleTrace && sampleTrace.certificates) || [];
      result.push({
        batchNo: batchNo.trim().toUpperCase(),
        valid: true,
        skuCount: skus.length,
        skus: skus,
        certificates: certificates,
        productionDate: sampleTrace && sampleTrace.basicInfo ? sampleTrace.basicInfo.productionTime : '',
        shelfLife: sampleTrace && sampleTrace.basicInfo && sampleTrace.basicInfo.shelfLife ? sampleTrace.basicInfo.shelfLife.bestBeforeDate : '',
        inspections: sampleTrace && sampleTrace.qualityInspection ? sampleTrace.qualityInspection.items : []
      });
    } else {
      result.push({
        batchNo: batchNo.trim().toUpperCase(),
        valid: false,
        skuCount: 0,
        skus: [],
        certificates: [],
        error: '未找到该批次信息'
      });
    }
  });
  return result;
}

function getRFQs(filter) {
  let result = MOCK_RFQS.slice();
  if (filter && filter.status) {
    result = result.filter(function(r) { return r.status === filter.status; });
  }
  return result;
}

function getRFQById(id) {
  return MOCK_RFQS.find(function(r) { return r.id === id; });
}

function createRFQ(data) {
  try {
    const rfqs = wx.getStorageSync(PROCUREMENT_RFQ_KEY) || [];
    const user = getProcurementUser();
    const newRFQ = {
      id: 'RFQ' + Date.now(),
      title: data.title,
      productName: data.productName,
      specification: data.specification,
      quantity: parseInt(data.quantity) || 0,
      unit: data.unit || '件',
      expectedPrice: parseFloat(data.expectedPrice) || 0,
      deadline: data.deadline,
      deliveryDate: data.deliveryDate,
      status: 'open',
      creator: user ? user.name : '未知',
      createTime: formatDateTime(Date.now()),
      description: data.description || '',
      attachments: [],
      quotes: []
    };
    rfqs.unshift(newRFQ);
    wx.setStorageSync(PROCUREMENT_RFQ_KEY, rfqs);
    return { success: true, data: newRFQ };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

function getContracts(filter) {
  let result = MOCK_CONTRACTS.slice();
  if (filter) {
    if (filter.status) {
      result = result.filter(function(c) { return c.status === filter.status; });
    }
    if (filter.keyword) {
      const kw = filter.keyword.toLowerCase();
      result = result.filter(function(c) {
        return c.contractNo.toLowerCase().indexOf(kw) !== -1 ||
          c.title.indexOf(kw) !== -1;
      });
    }
  }
  return result.map(function(c) {
    return Object.assign({}, c, {
      statusLabel: getContractStatusLabel(c.status),
      paymentStatusLabel: getPaymentStatusLabel(c.paymentStatus)
    });
  });
}

function getContractById(id) {
  const found = MOCK_CONTRACTS.find(function(c) { return c.id === id; });
  if (!found) return null;
  const linkedBatchDetails = found.linkedBatches.map(function(bn) {
    const skus = mockData.getBatchSkus(bn);
    return {
      batchNo: bn,
      skuCount: skus ? skus.length : 0,
      skus: skus || []
    };
  });
  return Object.assign({}, found, {
    statusLabel: getContractStatusLabel(found.status),
    paymentStatusLabel: getPaymentStatusLabel(found.paymentStatus),
    linkedBatchDetails: linkedBatchDetails
  });
}

function linkBatchToContract(contractId, batchNo) {
  try {
    const contracts = MOCK_CONTRACTS;
    const idx = contracts.findIndex(function(c) { return c.id === contractId; });
    if (idx === -1) return { success: false, error: '合同不存在' };
    if (contracts[idx].linkedBatches.indexOf(batchNo) === -1) {
      contracts[idx].linkedBatches.push(batchNo);
    }
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

function getContractStatusLabel(status) {
  const map = {
    draft: '草稿',
    pending: '待签署',
    active: '执行中',
    expired: '已到期',
    terminated: '已终止'
  };
  return map[status] || status;
}

function getPaymentStatusLabel(status) {
  const map = {
    pending: '待付款',
    partial: '部分付款',
    paid: '已付清',
    overdue: '已逾期'
  };
  return map[status] || status;
}

function getQualityArchives(filter) {
  let result = MOCK_QUALITY_ARCHIVES.slice();
  if (filter && filter.result) {
    result = result.filter(function(a) { return a.result === filter.result; });
  }
  return result;
}

function getQualityArchiveById(id) {
  return MOCK_QUALITY_ARCHIVES.find(function(a) { return a.id === id; });
}

function getQualityArchiveByBatch(batchNo) {
  return MOCK_QUALITY_ARCHIVES.find(function(a) { return a.batchNo === batchNo; });
}

function archiveQualityDoc(data) {
  try {
    const archives = wx.getStorageSync(PROCUREMENT_ARCHIVE_KEY) || [];
    const user = getProcurementUser();
    const newArchive = {
      id: 'QA' + Date.now(),
      batchNo: data.batchNo,
      inspectionReportId: 'IR' + Date.now(),
      productName: data.productName,
      inspectionDate: data.inspectionDate,
      inspector: user ? user.name : '未知',
      result: data.result,
      overallScore: data.overallScore || 0,
      items: data.items || [],
      documents: data.documents || [],
      archivedBy: user ? user.name : '未知',
      archiveTime: formatDateTime(Date.now()),
      remark: data.remark || ''
    };
    archives.unshift(newArchive);
    wx.setStorageSync(PROCUREMENT_ARCHIVE_KEY, archives);
    return { success: true, data: newArchive };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

function downloadReportPackage(batchNos) {
  return new Promise(function(resolve, reject) {
    if (!batchNos || batchNos.length === 0) {
      reject({ code: -1, msg: '请选择要下载的批次' });
      return;
    }
    setTimeout(function() {
      const docs = [];
      batchNos.forEach(function(bn) {
        const archive = MOCK_QUALITY_ARCHIVES.find(function(a) { return a.batchNo === bn; });
        if (archive) {
          archive.documents.forEach(function(d) {
            docs.push({ batchNo: bn, name: d.name, size: d.size, type: d.type });
          });
        } else {
          docs.push({ batchNo: bn, name: bn + '_质检报告.pdf', size: '1.5MB', type: 'report' });
          docs.push({ batchNo: bn, name: bn + '_出厂合格证.pdf', size: '0.3MB', type: 'certificate' });
        }
      });
      resolve({
        code: 0,
        data: {
          fileName: '检测报告包_' + formatDateTime(Date.now()).replace(/[:\s-]/g, '') + '.zip',
          fileSize: (docs.length * 1.2).toFixed(1) + 'MB',
          documentCount: docs.length,
          batchCount: batchNos.length,
          documents: docs
        }
      });
    }, 800);
  });
}

module.exports = {
  ROLE_BUYER: ROLE_BUYER,
  ROLE_INSPECTOR: ROLE_INSPECTOR,
  ROLE_FINANCE: ROLE_FINANCE,
  ROLE_ADMIN: ROLE_ADMIN,
  ROLE_LABELS: ROLE_LABELS,
  ENTERPRISE_TYPES: ENTERPRISE_TYPES,
  PERMISSIONS: PERMISSIONS,

  getProcurementUser: getProcurementUser,
  setProcurementUser: setProcurementUser,
  clearProcurementUser: clearProcurementUser,
  isProcurementLoggedIn: isProcurementLoggedIn,
  getCurrentRole: getCurrentRole,
  getCurrentRoleLabel: getCurrentRoleLabel,
  hasPermission: hasPermission,
  requirePermission: requirePermission,
  procurementLogin: procurementLogin,
  procurementLogout: procurementLogout,
  getSampleAccounts: getSampleAccounts,

  getDashboardStats: getDashboardStats,
  getPurchasedBatches: getPurchasedBatches,
  getPurchasedBatchById: getPurchasedBatchById,
  getLogisticsStatusLabel: getLogisticsStatusLabel,
  getQualityStatusLabel: getQualityStatusLabel,

  getBatchQualification: getBatchQualification,

  getRFQs: getRFQs,
  getRFQById: getRFQById,
  createRFQ: createRFQ,

  getContracts: getContracts,
  getContractById: getContractById,
  linkBatchToContract: linkBatchToContract,
  getContractStatusLabel: getContractStatusLabel,
  getPaymentStatusLabel: getPaymentStatusLabel,

  getQualityArchives: getQualityArchives,
  getQualityArchiveById: getQualityArchiveById,
  getQualityArchiveByBatch: getQualityArchiveByBatch,
  archiveQualityDoc: archiveQualityDoc,

  downloadReportPackage: downloadReportPackage,

  PROCUREMENT_USER_KEY: PROCUREMENT_USER_KEY,
  PROCUREMENT_TOKEN_KEY: PROCUREMENT_TOKEN_KEY
};
