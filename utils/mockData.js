/**
 * 桂花茶溯源小程序 - 本地模拟数据
 * 功能：提供测试用的溯源数据（G001、G002）
 * 说明：实际项目中应通过 wx.request 从后端获取数据
 */

// ==================== 模拟溯源数据 ====================

const mockTraceData = {
  /**
   * 溯源ID: G001
   * 品种: 金桂
   * 特点: 200年茶树龄，高端品质
   */
  'G001': {
    // 基础信息
    basicInfo: {
      traceId: 'G001',                           // 溯源ID
      batchNo: 'GH202503',                       // 批次号
      pickTime: '2025年9月10日',                  // 采摘时间
      productionTime: '2025年9月25日',            // 出厂时间
      productName: '金桂花茶',                    // 产品名称
      specification: '100g/罐'                   // 规格
    },
    
    // 树龄信息（桂花茶核心特色）
    treeAge: {
      teaTreeAge: 200,                           // 茶树龄（年）
      osmanthusTreeAge: 50,                      // 桂花树龄（年）
      teaTreeLocation: '福建省武夷山',            // 茶树产地
      osmanthusTreeLocation: '湖北省A市'          // 桂花树产地
    },
    
    // 桂花信息
    osmanthusInfo: {
      variety: '金桂',                           // 品种
      origin: '湖北省A市',                        // 产地
      pickTime: '2025年9月8日',                   // 桂花采摘时间
      color: '金黄色',                           // 花色
      fragrance: '浓郁持久'                      // 香气特点
    },
    
    // 窨制工艺（核心模块）
    scentingProcess: {
      scentingTimes: 5,                          // 窨制次数
      scentingDuration: 5,                       // 每次窨制时长（小时）
      temperature: 30,                           // 温度（℃）
      humidity: 72,                              // 湿度（%）
      ratio: '1:5',                              // 桂花与茶叶配比
      workshopCleanliness: 'Class 10万级',       // 车间洁净度
      // 工艺流程步骤
      processSteps: [
        { step: 1, name: '备料', icon: '📦', desc: '精选优质茶叶与新鲜桂花' },
        { step: 2, name: '拌花', icon: '🌸', desc: '按配比均匀拌合茶叶与桂花' },
        { step: 3, name: '窨制', icon: '🫖', desc: '恒温恒湿环境下静置窨香' },
        { step: 4, name: '通花', icon: '💨', desc: '适时通风散热保持活性' },
        { step: 5, name: '起花', icon: '🧹', desc: '分离茶叶与桂花残渣' },
        { step: 6, name: '干燥', icon: '☀️', desc: '低温烘干锁住花香' }
      ]
    },
    
    // 绿色溯源（新增核心模块）
    greenTrace: {
      // 生态种植记录
      ecoPlanting: {
        title: '生态种植',
        icon: '🌱',
        records: [
          '无化肥农药种植',
          '采用自然雨水灌溉',
          '有机肥施肥'
        ],
        certification: '有机产品认证'
      },
      // 包装材料环保属性
      ecoPacking: {
        title: '环保包装',
        icon: '📦',
        records: [
          '食品级可降解牛皮纸包装',
          '无塑料内衬',
          '植物大豆油墨印刷'
        ],
        certification: '绿色包装认证'
      },
      // 绿色物流信息
      ecoLogistics: {
        title: '绿色物流',
        icon: '🚚',
        records: [
          '采用低碳运输线路',
          '使用可循环快递袋配送',
          '碳中和物流合作伙伴'
        ],
        carbonReduction: '减少碳排放约15%'
      }
    },
    
    // 农残检测
    pesticideTest: {
      institution: '国家茶叶质量监督检验中心',    // 检测机构
      testDate: '2025年9月20日',                 // 检测日期
      reportNo: 'NTQC-2025-09876',               // 报告编号
      standard: 'GB 2763-2021',                  // 国标依据
      comparisonTip: '各项农残数值远低于国标 GB 2763-2021 限值，安全放心',
      // 茶叶农残检测项
      teaTests: [
        { item: '六六六', value: '<0.01', unit: 'mg/kg', limit: '0.1', status: '合格' },
        { item: '滴滴涕', value: '<0.01', unit: 'mg/kg', limit: '0.2', status: '合格' }
      ],
      // 桂花农残检测项
      osmanthusTests: [
        { item: '联苯菊酯', value: '<0.02', unit: 'mg/kg', limit: '5.0', status: '合格' }
      ]
    },
    
    // 冲泡建议
    brewingGuide: {
      waterTemp: '85℃-90℃',                     // 水温
      brewingTime: '2分钟',                      // 冲泡时长
      rebrewTimes: '4-5次',                      // 续泡次数
      waterType: '纯净水或山泉水',                // 推荐用水
      teawareType: '玻璃杯或白瓷盖碗',           // 推荐茶具
      tips: [
        '先温杯，再投茶',
        '水温不宜过高，保留桂花清香',
        '每泡适当延长浸泡时间'
      ]
    },
    
    // 区块链存证信息
    blockchainInfo: {
      chainName: '溯源链',
      blockHeight: 1892347,
      txHash: '0x8f9a3b...c7d2e1',
      timestamp: '2025-09-25 14:32:18',
      verifyStatus: '已验证'
    }
  },

  /**
   * 溯源ID: G002
   * 品种: 银桂
   * 特点: 120年茶树龄，性价比之选
   */
  'G002': {
    // 基础信息
    basicInfo: {
      traceId: 'G002',
      batchNo: 'GH202504',
      pickTime: '2025年9月15日',
      productionTime: '2025年9月30日',
      productName: '银桂花茶',
      specification: '100g/罐'
    },
    
    // 树龄信息
    treeAge: {
      teaTreeAge: 120,
      osmanthusTreeAge: 20,
      teaTreeLocation: '福建省武夷山',
      osmanthusTreeLocation: '湖北省A市'
    },
    
    // 桂花信息
    osmanthusInfo: {
      variety: '银桂',
      origin: '湖北省A市',
      pickTime: '2025年9月12日',
      color: '乳白色',
      fragrance: '清雅淡香'
    },
    
    // 窨制工艺
    scentingProcess: {
      scentingTimes: 3,
      scentingDuration: 6,
      temperature: 28,
      humidity: 70,
      ratio: '1:5',
      workshopCleanliness: 'Class 10万级',
      processSteps: [
        { step: 1, name: '备料', icon: '📦', desc: '精选优质茶叶与新鲜桂花' },
        { step: 2, name: '拌花', icon: '🌸', desc: '按配比均匀拌合茶叶与桂花' },
        { step: 3, name: '窨制', icon: '🫖', desc: '恒温恒湿环境下静置窨香' },
        { step: 4, name: '通花', icon: '💨', desc: '适时通风散热保持活性' },
        { step: 5, name: '起花', icon: '🧹', desc: '分离茶叶与桂花残渣' },
        { step: 6, name: '干燥', icon: '☀️', desc: '低温烘干锁住花香' }
      ]
    },
    
    // 绿色溯源
    greenTrace: {
      ecoPlanting: {
        title: '生态种植',
        icon: '🌱',
        records: [
          '人工除草，拒绝除草剂',
          '采用生物防虫技术',
          '自然生态种植'
        ],
        certification: '绿色食品认证'
      },
      ecoPacking: {
        title: '环保包装',
        icon: '📦',
        records: [
          '可回收PET包装',
          '支持二次利用',
          '印刷油墨为植物环保型'
        ],
        certification: '可回收标识认证'
      },
      ecoLogistics: {
        title: '绿色物流',
        icon: '🚚',
        records: [
          '就近仓储发货',
          '缩短运输里程',
          '降低碳排放'
        ],
        carbonReduction: '减少碳排放约20%'
      }
    },
    
    // 农残检测
    pesticideTest: {
      institution: '湖北省农产品质量安全检测中心',
      testDate: '2025年9月25日',
      reportNo: 'HBAQ-2025-12345',
      standard: 'GB 2763-2021',
      comparisonTip: '各项农残数值远低于国标 GB 2763-2021 限值，安全放心',
      teaTests: [
        { item: '氯氰菊酯', value: '<0.01', unit: 'mg/kg', limit: '20', status: '合格' }
      ],
      osmanthusTests: [
        { item: '氯氟氰菊酯', value: '<0.01', unit: 'mg/kg', limit: '2.0', status: '合格' }
      ]
    },
    
    // 冲泡建议
    brewingGuide: {
      waterTemp: '85℃-90℃',
      brewingTime: '2分钟',
      rebrewTimes: '3-5次',
      waterType: '纯净水或山泉水',
      teawareType: '玻璃杯或白瓷盖碗',
      tips: [
        '先温杯，再投茶',
        '水温不宜过高，保留桂花清香',
        '银桂香气清淡，可适当延长浸泡'
      ]
    },
    
    // 区块链存证信息
    blockchainInfo: {
      chainName: '溯源链',
      blockHeight: 1895123,
      txHash: '0x2e7c4a...f8b9d3',
      timestamp: '2025-09-30 10:15:42',
      verifyStatus: '已验证'
    }
  }
};

/**
 * 根据溯源ID获取溯源数据
 * @param {string} traceId - 溯源ID（如 G001、G002）
 * @returns {object|null} - 返回溯源数据对象，未找到则返回 null
 * 
 * 【后端接口预留说明】
 * 实际项目中，此函数应改为调用后端API：
 * 
 * function getTraceData(traceId) {
 *   return new Promise((resolve, reject) => {
 *     wx.request({
 *       url: `${getApp().globalData.apiBaseUrl}/query`,
 *       method: 'GET',
 *       data: { traceId: traceId },
 *       header: { 'content-type': 'application/json' },
 *       success: (res) => {
 *         if (res.statusCode === 200 && res.data.code === 0) {
 *           resolve(res.data.data);
 *         } else {
 *           reject(new Error(res.data.message || '查询失败'));
 *         }
 *       },
 *       fail: (err) => {
 *         reject(err);
 *       }
 *     });
 *   });
 * }
 */
function getTraceData(traceId) {
  // 转换为大写，兼容用户输入
  const id = traceId.toUpperCase().trim();
  
  // 从本地模拟数据中查找
  if (mockTraceData[id]) {
    return mockTraceData[id];
  }
  
  return null;
}

/**
 * 验证溯源ID格式是否有效
 * @param {string} traceId - 溯源ID
 * @returns {boolean} - 格式是否有效
 */
function validateTraceId(traceId) {
  if (!traceId || typeof traceId !== 'string') {
    return false;
  }
  
  // 溯源ID格式：字母开头，后跟数字，长度4-20位
  const pattern = /^[A-Za-z][A-Za-z0-9]{3,19}$/;
  return pattern.test(traceId.trim());
}

/**
 * 获取所有可用的测试溯源ID列表
 * @returns {array} - 溯源ID数组
 */
function getAvailableTraceIds() {
  return Object.keys(mockTraceData);
}

// 导出模块
module.exports = {
  getTraceData,
  validateTraceId,
  getAvailableTraceIds,
  mockTraceData
};
