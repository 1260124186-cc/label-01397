var EXPERIENCE_RESERVATION_KEY = 'experience_reservations';
var EXPERIENCE_CHECKIN_KEY = 'experience_checkin_records';

var EXPERIENCE_TYPES = [
  {
    key: 'tea_garden_visit',
    name: '茶园参观',
    icon: '🌱',
    color: '#2E8B57',
    description: '走进百年茶园，感受茶叶生长环境，了解茶树种植与采摘文化',
    duration: '约2小时',
    capacity: 30,
    rewardPoints: 20,
    highlights: [
      '参观武夷山百年古茶园',
      '了解茶树品种与种植工艺',
      '体验茶叶采摘（季节性）',
      '专业茶艺师全程讲解'
    ]
  },
  {
    key: 'tea_making',
    name: '制茶体验',
    icon: '🫖',
    color: '#DAA520',
    description: '亲手参与传统制茶工艺，感受从鲜叶到成品茶的完整过程',
    duration: '约3小时',
    capacity: 15,
    rewardPoints: 30,
    highlights: [
      '非遗传承人亲自指导',
      '体验萎凋、揉捻、窨制全流程',
      '亲手窨制桂花茶',
      '成品可带走留念'
    ]
  },
  {
    key: 'tasting_session',
    name: '品鉴会',
    icon: '🍵',
    color: '#8B4513',
    description: '专业品鉴多款桂花茶，学习品茶技巧，感受不同品种的风味差异',
    duration: '约1.5小时',
    capacity: 20,
    rewardPoints: 15,
    highlights: [
      '品鉴金桂、银桂、丹桂等多款产品',
      '学习专业品茶五步法',
      '茶点搭配体验',
      '获得专属品鉴纪念卡'
    ]
  },
  {
    key: 'dealer_open_day',
    name: '经销商培训开放日',
    icon: '🏬',
    color: '#722ED1',
    description: '面向合作伙伴的专属开放日，深入了解品牌文化与产品体系',
    duration: '全天（约6小时）',
    capacity: 25,
    rewardPoints: 50,
    highlights: [
      '品牌文化与发展战略分享',
      '产品体系深度培训',
      '参观生产车间与仓储中心',
      '经销商政策解读与交流'
    ]
  }
];

var RESERVATION_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CHECKED_IN: 'checked_in',
  CANCELLED: 'cancelled'
};

var RESERVATION_STATUS_LABEL = {
  pending: '待确认',
  confirmed: '已确认',
  checked_in: '已签到',
  cancelled: '已取消'
};

function _generateReservationId() {
  var now = new Date();
  var dateStr = now.getFullYear().toString() +
    (now.getMonth() + 1).toString().padStart(2, '0') +
    now.getDate().toString().padStart(2, '0');
  var random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return 'EXP' + dateStr + random;
}

function _generateQrCodeData(reservationId, activityType) {
  return JSON.stringify({
    type: 'experience_checkin',
    reservationId: reservationId,
    activityType: activityType,
    timestamp: Date.now()
  });
}

function getExperienceTypes() {
  return EXPERIENCE_TYPES;
}

function getExperienceTypeByKey(key) {
  for (var i = 0; i < EXPERIENCE_TYPES.length; i++) {
    if (EXPERIENCE_TYPES[i].key === key) {
      return EXPERIENCE_TYPES[i];
    }
  }
  return null;
}

function getReservations() {
  try {
    var reservations = wx.getStorageSync(EXPERIENCE_RESERVATION_KEY);
    return Array.isArray(reservations) ? reservations : [];
  } catch (e) {
    console.error('[Experience] 获取预约列表失败:', e);
    return [];
  }
}

function saveReservations(reservations) {
  try {
    wx.setStorageSync(EXPERIENCE_RESERVATION_KEY, reservations);
    return true;
  } catch (e) {
    console.error('[Experience] 保存预约失败:', e);
    return false;
  }
}

function createReservation(reservationData) {
  var reservations = getReservations();
  var reservationId = _generateReservationId();
  var now = Date.now();
  var activityType = getExperienceTypeByKey(reservationData.activityTypeKey);

  var newReservation = {
    id: reservationId,
    activityTypeKey: reservationData.activityTypeKey,
    activityTypeName: activityType ? activityType.name : '',
    activityIcon: activityType ? activityType.icon : '',
    activityColor: activityType ? activityType.color : '#2E8B57',
    peopleCount: reservationData.peopleCount,
    date: reservationData.date,
    contactName: reservationData.contactName,
    contactPhone: reservationData.contactPhone,
    hasPurchased: reservationData.hasPurchased || false,
    remark: reservationData.remark || '',
    rewardPoints: activityType ? activityType.rewardPoints : 0,
    status: RESERVATION_STATUS.CONFIRMED,
    createdAt: now,
    updatedAt: now,
    qrCodeData: _generateQrCodeData(reservationId, reservationData.activityTypeKey),
    checkedInAt: null,
    checkInPointsAwarded: false
  };

  reservations.unshift(newReservation);
  saveReservations(reservations);

  console.log('[Experience] 预约创建成功:', reservationId);
  return newReservation;
}

function getReservationById(reservationId) {
  var reservations = getReservations();
  for (var i = 0; i < reservations.length; i++) {
    if (reservations[i].id === reservationId) {
      return reservations[i];
    }
  }
  return null;
}

function getMyReservations(status) {
  var reservations = getReservations();
  if (status && status !== 'all') {
    reservations = reservations.filter(function(r) { return r.status === status; });
  }
  return reservations.sort(function(a, b) { return b.createdAt - a.createdAt; });
}

function cancelReservation(reservationId) {
  var reservations = getReservations();
  var index = -1;
  for (var i = 0; i < reservations.length; i++) {
    if (reservations[i].id === reservationId) {
      index = i;
      break;
    }
  }
  if (index === -1) return { success: false, reason: '预约不存在' };

  if (reservations[index].status === RESERVATION_STATUS.CHECKED_IN) {
    return { success: false, reason: '已签到的预约无法取消' };
  }
  if (reservations[index].status === RESERVATION_STATUS.CANCELLED) {
    return { success: false, reason: '预约已取消' };
  }

  reservations[index].status = RESERVATION_STATUS.CANCELLED;
  reservations[index].updatedAt = Date.now();
  saveReservations(reservations);

  console.log('[Experience] 预约已取消:', reservationId);
  return { success: true, reservation: reservations[index] };
}

function parseQrCodeData(qrCodeContent) {
  try {
    var data = JSON.parse(qrCodeContent);
    if (!data) return null;
    if ((data.type === 'experience_checkin' || data.type === 'experience_reservation')
      && (data.reservationId || data.id)) {
      return {
        type: data.type,
        reservationId: data.reservationId || data.id,
        activityType: data.activityType || data.activityTypeKey
      };
    }
    return null;
  } catch (e) {
    console.log('[Experience] 二维码解析失败:', e);
    return null;
  }
}

function checkInByReservationId(reservationId) {
  var reservations = getReservations();
  var index = -1;
  for (var i = 0; i < reservations.length; i++) {
    if (reservations[i].id === reservationId) {
      index = i;
      break;
    }
  }
  if (index === -1) return { success: false, reason: '预约不存在' };

  var reservation = reservations[index];

  if (reservation.status === RESERVATION_STATUS.CHECKED_IN) {
    return { success: false, reason: '该预约已签到', alreadyCheckedIn: true, reservation: reservation };
  }
  if (reservation.status === RESERVATION_STATUS.CANCELLED) {
    return { success: false, reason: '该预约已取消' };
  }

  reservation.status = RESERVATION_STATUS.CHECKED_IN;
  reservation.checkedInAt = Date.now();
  reservation.checkInPointsAwarded = false;
  reservation.updatedAt = Date.now();

  var checkInRecords = _getCheckInRecords();
  checkInRecords.unshift({
    id: 'ci_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
    reservationId: reservation.id,
    activityTypeKey: reservation.activityTypeKey,
    activityTypeName: reservation.activityTypeName,
    checkedInAt: reservation.checkedInAt,
    peopleCount: reservation.peopleCount
  });
  _saveCheckInRecords(checkInRecords);

  var greenPoints = require('./greenPoints.js');
  var pointsResult = greenPoints.earnPoints(
    'experienceCheckIn',
    '线下体验签到：' + reservation.activityTypeName + '（' + reservation.id + '）'
  );
  if (pointsResult && pointsResult.earned > 0) {
    reservation.checkInPointsAwarded = true;
  }

  saveReservations(reservations);

  console.log('[Experience] 签到成功:', reservationId, '获得积分:', pointsResult ? pointsResult.earned : 0);
  return {
    success: true,
    reservation: reservation,
    pointsEarned: pointsResult ? pointsResult.earned : 0,
    totalPoints: pointsResult ? pointsResult.totalPoints : 0
  };
}

function _getCheckInRecords() {
  try {
    var records = wx.getStorageSync(EXPERIENCE_CHECKIN_KEY);
    return Array.isArray(records) ? records : [];
  } catch (e) {
    return [];
  }
}

function _saveCheckInRecords(records) {
  try {
    if (records.length > 100) {
      records = records.slice(0, 100);
    }
    wx.setStorageSync(EXPERIENCE_CHECKIN_KEY, records);
    return true;
  } catch (e) {
    console.error('[Experience] 保存签到记录失败:', e);
    return false;
  }
}

function getCheckInRecords() {
  return _getCheckInRecords();
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

function getTodayDateStr() {
  var d = new Date();
  return d.getFullYear() + '-' + (d.getMonth() + 1).toString().padStart(2, '0') + '-' + d.getDate().toString().padStart(2, '0');
}

function validateReservationData(data) {
  if (!data.activityTypeKey) return { valid: false, reason: '请选择活动类型' };
  if (!data.peopleCount || data.peopleCount < 1) return { valid: false, reason: '请输入正确的人数' };
  
  var activityType = getExperienceTypeByKey(data.activityTypeKey);
  if (activityType && activityType.capacity && data.peopleCount > activityType.capacity) {
    return {
      valid: false,
      reason: activityType.name + '最多可预约 ' + activityType.capacity + ' 人'
    };
  }
  
  if (!data.date) return { valid: false, reason: '请选择预约日期' };
  if (!data.contactName || !data.contactName.trim()) return { valid: false, reason: '请输入联系人姓名' };
  if (!data.contactPhone || !data.contactPhone.trim()) return { valid: false, reason: '请输入联系电话' };
  var phoneReg = /^1[3-9]\d{9}$/;
  if (!phoneReg.test(data.contactPhone.trim())) return { valid: false, reason: '请输入正确的手机号码' };
  return { valid: true };
}

module.exports = {
  EXPERIENCE_TYPES: EXPERIENCE_TYPES,
  RESERVATION_STATUS: RESERVATION_STATUS,
  RESERVATION_STATUS_LABEL: RESERVATION_STATUS_LABEL,
  EXPERIENCE_RESERVATION_KEY: EXPERIENCE_RESERVATION_KEY,
  EXPERIENCE_CHECKIN_KEY: EXPERIENCE_CHECKIN_KEY,
  getExperienceTypes: getExperienceTypes,
  getExperienceTypeByKey: getExperienceTypeByKey,
  getReservations: getReservations,
  createReservation: createReservation,
  getReservationById: getReservationById,
  getMyReservations: getMyReservations,
  cancelReservation: cancelReservation,
  parseQrCodeData: parseQrCodeData,
  checkInByReservationId: checkInByReservationId,
  getCheckInRecords: getCheckInRecords,
  formatTime: formatTime,
  formatFullTime: formatFullTime,
  getTodayDateStr: getTodayDateStr,
  validateReservationData: validateReservationData
};
