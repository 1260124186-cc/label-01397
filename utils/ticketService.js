const TICKET_STORAGE_KEY = 'service_tickets';
const FAQ_DATA_KEY = 'service_faq_data';

const TICKET_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  RESOLVED: 'resolved',
  CLOSED: 'closed'
};

const TICKET_STATUS_LABEL = {
  pending: '待处理',
  processing: '处理中',
  resolved: '已解决',
  closed: '已关闭'
};

const PROBLEM_TYPES = [
  { key: 'trace_not_found', label: '溯源查不到', icon: '🔍' },
  { key: 'report_unclear', label: '报告看不懂', icon: '📄' },
  { key: 'brewing_issue', label: '冲泡问题', icon: '☕' },
  { key: 'product_quality', label: '产品质量', icon: '🍃' },
  { key: 'logistics', label: '物流配送', icon: '📦' },
  { key: 'other', label: '其他问题', icon: '💬' }
];

const FAQ_DATA = [
  {
    id: 'faq-1',
    category: 'trace_not_found',
    question: '为什么扫码后查不到溯源信息？',
    answer: '请检查以下几点：\n1. 确认网络连接正常\n2. 确认二维码清晰完整，无污渍、无遮挡\n3. 尝试手动输入溯源ID进行查询\n4. 若仍无法查询，请提交工单，我们将尽快核实处理'
  },
  {
    id: 'faq-2',
    category: 'trace_not_found',
    question: '溯源ID在哪里可以找到？',
    answer: '溯源ID通常位于：\n1. 产品包装上的二维码下方\n2. 罐底/盒底标签\n3. 产品说明书内页\n格式通常为字母+数字组合，如 G001、GH202503'
  },
  {
    id: 'faq-3',
    category: 'report_unclear',
    question: '检测报告中的各项指标是什么意思？',
    answer: '检测报告主要包含：\n【检测项目】具体检测的农残/成分名称\n【检测值】产品中实际检测出的含量\n【国标限值】国家标准规定的最大允许值\n【结论】合格/不合格\n当检测值远低于限值时，表示产品安全优质'
  },
  {
    id: 'faq-4',
    category: 'report_unclear',
    question: '如何验证检测报告的真实性？',
    answer: '您可以通过以下方式验真：\n1. 在溯源详情页点击「验真」按钮\n2. 输入报告编号进行在线验证\n3. 访问检测机构官网输入报告编号查询\n4. 区块链存证数据可点击「一键验真」'
  },
  {
    id: 'faq-5',
    category: 'brewing_issue',
    question: '桂花茶的最佳冲泡方式是什么？',
    answer: '推荐冲泡参数：\n【水温】85℃-90℃\n【时长】首次冲泡2分钟\n【续泡】可续泡3-5次，每次延长30秒\n【茶具】推荐玻璃杯或陶瓷盖碗\n【用量】3-5克/150ml水\n温馨提示：水温过高会破坏花香，建议使用山泉水或纯净水'
  },
  {
    id: 'faq-6',
    category: 'brewing_issue',
    question: '为什么茶汤颜色很浅？是质量问题吗？',
    answer: '茶汤颜色浅属正常现象：\n1. 桂花茶以清香为主，本身汤色较浅\n2. 水温过低或冲泡时间不足会导致汤色更浅\n3. 可适当延长冲泡时间至3分钟\n4. 续泡时汤色会逐渐加深\n若伴随异味或霉味，请及时联系客服'
  },
  {
    id: 'faq-7',
    category: 'brewing_issue',
    question: '桂花可以吃吗？',
    answer: '可以食用。产品中的桂花均为食品级：\n1. 冲泡后桂花可直接食用\n2. 可加入糕点、甜品中增香\n3. 建议当天饮用，避免隔夜\n4. 若对花粉过敏，请谨慎食用'
  },
  {
    id: 'faq-8',
    category: 'product_quality',
    question: '产品如何保存？保质期多久？',
    answer: '【保存方法】\n1. 密封保存，置于阴凉干燥处\n2. 避免阳光直射和异味\n3. 开封后建议3个月内饮用完毕\n【保质期】\n未开封状态下保质期为18个月，具体日期见包装'
  }
];

function generateTicketId() {
  const now = new Date();
  const dateStr = now.getFullYear().toString() +
    (now.getMonth() + 1).toString().padStart(2, '0') +
    now.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return 'TK' + dateStr + random;
}

function getTickets() {
  try {
    const tickets = wx.getStorageSync(TICKET_STORAGE_KEY);
    return Array.isArray(tickets) ? tickets : [];
  } catch (e) {
    console.error('[ticketService] 获取工单列表失败:', e);
    return [];
  }
}

function saveTickets(tickets) {
  try {
    wx.setStorageSync(TICKET_STORAGE_KEY, tickets);
    return true;
  } catch (e) {
    console.error('[ticketService] 保存工单失败:', e);
    return false;
  }
}

function createTicket(ticketData) {
  const tickets = getTickets();
  const ticketId = generateTicketId();
  const now = Date.now();

  const newTicket = {
    id: ticketId,
    type: ticketData.type,
    typeLabel: ticketData.typeLabel,
    title: ticketData.title,
    description: ticketData.description,
    traceId: ticketData.traceId || '',
    images: ticketData.images || [],
    contact: ticketData.contact || '',
    status: TICKET_STATUS.PENDING,
    rating: 0,
    ratingComment: '',
    createdAt: now,
    updatedAt: now,
    progressLogs: [
      {
        status: TICKET_STATUS.PENDING,
        timestamp: now,
        message: '工单已提交，等待客服处理'
      }
    ]
  };

  tickets.unshift(newTicket);
  saveTickets(tickets);

  simulateTicketProgress(ticketId);

  return newTicket;
}

function simulateTicketProgress(ticketId) {
  const tickets = getTickets();
  const ticketIndex = tickets.findIndex(t => t.id === ticketId);
  if (ticketIndex === -1) return;

  setTimeout(() => {
    const tks = getTickets();
    const idx = tks.findIndex(t => t.id === ticketId);
    if (idx === -1) return;
    if (tks[idx].status !== TICKET_STATUS.PENDING) return;

    tks[idx].status = TICKET_STATUS.PROCESSING;
    tks[idx].updatedAt = Date.now();
    tks[idx].progressLogs.push({
      status: TICKET_STATUS.PROCESSING,
      timestamp: Date.now(),
      message: '客服已接单，正在核实处理中'
    });
    saveTickets(tks);
  }, 8000);

  setTimeout(() => {
    const tks = getTickets();
    const idx = tks.findIndex(t => t.id === ticketId);
    if (idx === -1) return;
    if (tks[idx].status !== TICKET_STATUS.PROCESSING) return;

    tks[idx].status = TICKET_STATUS.RESOLVED;
    tks[idx].updatedAt = Date.now();
    tks[idx].progressLogs.push({
      status: TICKET_STATUS.RESOLVED,
      timestamp: Date.now(),
      message: '问题已处理完成，感谢您的反馈，请对服务进行评价'
    });
    saveTickets(tks);
  }, 20000);
}

function getTicketById(ticketId) {
  const tickets = getTickets();
  return tickets.find(t => t.id === ticketId) || null;
}

function updateTicket(ticketId, updates) {
  const tickets = getTickets();
  const index = tickets.findIndex(t => t.id === ticketId);
  if (index === -1) return null;

  tickets[index] = {
    ...tickets[index],
    ...updates,
    updatedAt: Date.now()
  };

  saveTickets(tickets);
  return tickets[index];
}

function rateTicket(ticketId, rating, comment) {
  const tickets = getTickets();
  const index = tickets.findIndex(t => t.id === ticketId);
  if (index === -1) return null;

  tickets[index].rating = rating;
  tickets[index].ratingComment = comment || '';
  tickets[index].status = TICKET_STATUS.CLOSED;
  tickets[index].updatedAt = Date.now();
  tickets[index].progressLogs.push({
    status: TICKET_STATUS.CLOSED,
    timestamp: Date.now(),
    message: `用户已评价：${rating}星${comment ? ' - ' + comment : ''}`
  });

  saveTickets(tickets);
  return tickets[index];
}

function getFaqList(category) {
  if (!category) {
    return FAQ_DATA;
  }
  return FAQ_DATA.filter(faq => faq.category === category);
}

function searchFaq(keyword) {
  if (!keyword) return FAQ_DATA;
  const kw = keyword.toLowerCase();
  return FAQ_DATA.filter(faq =>
    faq.question.toLowerCase().includes(kw) ||
    faq.answer.toLowerCase().includes(kw)
  );
}

function formatTime(timestamp) {
  if (!timestamp) return '';

  const date = new Date(timestamp);
  const now = new Date();

  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) {
    return '刚刚';
  } else if (diffMins < 60) {
    return `${diffMins}分钟前`;
  } else if (diffHours < 24) {
    return `${diffHours}小时前`;
  } else if (diffDays < 7) {
    return `${diffDays}天前`;
  } else {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    return `${month}月${day}日 ${hour}:${minute}`;
  }
}

function formatFullTime(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  return `${year}-${month}-${day} ${hour}:${minute}`;
}

module.exports = {
  TICKET_STATUS,
  TICKET_STATUS_LABEL,
  PROBLEM_TYPES,
  FAQ_DATA,
  generateTicketId,
  getTickets,
  createTicket,
  getTicketById,
  updateTicket,
  rateTicket,
  getFaqList,
  searchFaq,
  formatTime,
  formatFullTime
};
