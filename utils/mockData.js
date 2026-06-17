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
      specification: '100g/罐',                   // 规格
      thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=premium%20golden%20osmanthus%20tea%20tin%20can%20product%20photo&image_size=square'
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
      // 每次窨制独立记录
      scentingRecords: [
        { round: 1, duration: 5, temperature: 30, operator: '李师傅', timestamp: '2025-09-12 08:00:00', humidity: 72, note: '头窨，花香浓郁' },
        { round: 2, duration: 5, temperature: 29, operator: '李师傅', timestamp: '2025-09-13 08:30:00', humidity: 71, note: '二窨，香气渐入' },
        { round: 3, duration: 5, temperature: 30, operator: '王师傅', timestamp: '2025-09-14 09:00:00', humidity: 73, note: '三窨，醇厚层叠' },
        { round: 4, duration: 5, temperature: 28, operator: '李师傅', timestamp: '2025-09-15 08:15:00', humidity: 70, note: '四窨，幽香入骨' },
        { round: 5, duration: 5, temperature: 27, operator: '王师傅', timestamp: '2025-09-16 10:00:00', humidity: 72, note: '五窨，提香收尾' }
      ],
      // 工艺流程步骤（含多媒体）
      processSteps: [
        { step: 1, name: '备料', icon: '📦', desc: '精选优质茶叶与新鲜桂花', mediaType: 'image', mediaUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=osmanthus%20tea%20raw%20materials%20preparation%20tea%20leaves%20and%20fresh%20golden%20osmanthus%20flowers&image_size=square' },
        { step: 2, name: '拌花', icon: '🌸', desc: '按配比均匀拌合茶叶与桂花', mediaType: 'image', mediaUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=mixing%20osmanthus%20flowers%20with%20tea%20leaves%20traditional%20Chinese%20tea%20processing&image_size=square' },
        { step: 3, name: '窨制', icon: '🫖', desc: '恒温恒湿环境下静置窨香', mediaType: 'image', mediaUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=tea%20scenting%20process%20constant%20temperature%20humidity%20room%20traditional%20workshop&image_size=square' },
        { step: 4, name: '通花', icon: '💨', desc: '适时通风散热保持活性', mediaType: 'image', mediaUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=ventilating%20tea%20during%20scenting%20process%20cooling%20down%20tea%20leaves&image_size=square' },
        { step: 5, name: '起花', icon: '🧹', desc: '分离茶叶与桂花残渣', mediaType: 'image', mediaUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=separating%20osmanthus%20flowers%20from%20tea%20leaves%20traditional%20sieving%20process&image_size=square' },
        { step: 6, name: '干燥', icon: '☀️', desc: '低温烘干锁住花香', mediaType: 'image', mediaUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=low%20temperature%20drying%20osmanthus%20tea%20preserving%20fragrance&image_size=square' }
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
      institution: '国家茶叶质量监督检验中心',
      testDate: '2025年9月20日',
      reportNo: 'NTQC-2025-09876',
      standard: 'GB 2763-2021',
      comparisonTip: '各项农残数值远低于国标 GB 2763-2021 限值，安全放心',
      verifyUrl: 'https://www.ntqc.org.cn/verify',
      hasAbnormal: false,
      // 茶叶农残检测项
      teaTests: [
        { item: '六六六', value: 0.005, displayValue: '<0.01', unit: 'mg/kg', limit: 0.1, status: '合格', description: '' },
        { item: '滴滴涕', value: 0.008, displayValue: '<0.01', unit: 'mg/kg', limit: 0.2, status: '合格', description: '' },
        { item: '氯氰菊酯', value: 0.05, displayValue: '0.05', unit: 'mg/kg', limit: 20, status: '合格', description: '' }
      ],
      // 桂花农残检测项
      osmanthusTests: [
        { item: '联苯菊酯', value: 0.01, displayValue: '<0.02', unit: 'mg/kg', limit: 5.0, status: '合格', description: '' },
        { item: '氯氟氰菊酯', value: 0.005, displayValue: '<0.01', unit: 'mg/kg', limit: 2.0, status: '合格', description: '' }
      ],
      // 历史检测报告（时间轴）
      historyReports: [
        {
          reportNo: 'NTQC-2025-09876',
          testDate: '2025年9月20日',
          institution: '国家茶叶质量监督检验中心',
          status: '合格',
          statusLevel: '优秀',
          batchNo: 'GH202503'
        },
        {
          reportNo: 'NTQC-2025-07654',
          testDate: '2025年7月15日',
          institution: '国家茶叶质量监督检验中心',
          status: '合格',
          statusLevel: '良好',
          batchNo: 'GH202502'
        },
        {
          reportNo: 'NTQC-2025-05432',
          testDate: '2025年5月10日',
          institution: '国家茶叶质量监督检验中心',
          status: '合格',
          statusLevel: '优秀',
          batchNo: 'GH202501'
        }
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
    },
    
    // 配图（用于懒加载）
    images: {
      originImage: 'https://picsum.photos/id/1018/750/400',
      teaOriginImage: 'https://picsum.photos/id/1039/750/400',
      osmanthusOriginImage: 'https://picsum.photos/id/1044/750/400',
      processImage: 'https://picsum.photos/id/1036/750/400',
      certImage: 'https://picsum.photos/id/1025/750/400'
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
      specification: '100g/罐',
      thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=silver%20osmanthus%20tea%20packaging%20elegant%20product%20photo&image_size=square'
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
      // 每次窨制独立记录
      scentingRecords: [
        { round: 1, duration: 6, temperature: 28, operator: '张师傅', timestamp: '2025-09-17 08:00:00', humidity: 70, note: '头窨，清雅淡香' },
        { round: 2, duration: 6, temperature: 27, operator: '张师傅', timestamp: '2025-09-18 09:00:00', humidity: 69, note: '二窨，香气平衡' },
        { round: 3, duration: 6, temperature: 26, operator: '刘师傅', timestamp: '2025-09-19 08:30:00', humidity: 71, note: '三窨，提香收尾' }
      ],
      // 工艺流程步骤（含多媒体）
      processSteps: [
        { step: 1, name: '备料', icon: '📦', desc: '精选优质茶叶与新鲜桂花', mediaType: 'image', mediaUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=silver%20osmanthus%20tea%20raw%20materials%20preparation%20tea%20leaves%20and%20white%20osmanthus%20flowers&image_size=square' },
        { step: 2, name: '拌花', icon: '🌸', desc: '按配比均匀拌合茶叶与桂花', mediaType: 'image', mediaUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=mixing%20silver%20osmanthus%20flowers%20with%20tea%20leaves%20gentle%20process&image_size=square' },
        { step: 3, name: '窨制', icon: '🫖', desc: '恒温恒湿环境下静置窨香', mediaType: 'image', mediaUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=tea%20scenting%20process%20for%20silver%20osmanthus%20temperature%20control%20room&image_size=square' },
        { step: 4, name: '通花', icon: '💨', desc: '适时通风散热保持活性', mediaType: 'image', mediaUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=ventilating%20silver%20osmanthus%20tea%20during%20scenting%20delicate%20process&image_size=square' },
        { step: 5, name: '起花', icon: '🧹', desc: '分离茶叶与桂花残渣', mediaType: 'image', mediaUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=separating%20silver%20osmanthus%20flowers%20from%20tea%20leaves%20fine%20sieving&image_size=square' },
        { step: 6, name: '干燥', icon: '☀️', desc: '低温烘干锁住花香', mediaType: 'image', mediaUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=low%20temperature%20drying%20silver%20osmanthus%20tea%20preserving%20light%20fragrance&image_size=square' }
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
      comparisonTip: '存在1项指标超标，请谨慎食用',
      verifyUrl: 'https://www.hbagri.gov.cn/verify',
      hasAbnormal: true,
      teaTests: [
        { 
          item: '氯氰菊酯', 
          value: 25.5, 
          displayValue: '25.5', 
          unit: 'mg/kg', 
          limit: 20, 
          status: '不合格', 
          description: '超出国标限值27.5%，建议停止食用并联系供应商'
        },
        { 
          item: '六六六', 
          value: 0.005, 
          displayValue: '<0.01', 
          unit: 'mg/kg', 
          limit: 0.1, 
          status: '合格', 
          description: ''
        }
      ],
      osmanthusTests: [
        { 
          item: '氯氟氰菊酯', 
          value: 0.005, 
          displayValue: '<0.01', 
          unit: 'mg/kg', 
          limit: 2.0, 
          status: '合格', 
          description: ''
        }
      ],
      historyReports: [
        {
          reportNo: 'HBAQ-2025-12345',
          testDate: '2025年9月25日',
          institution: '湖北省农产品质量安全检测中心',
          status: '不合格',
          statusLevel: '异常',
          batchNo: 'GH202504',
          abnormalCount: 1
        },
        {
          reportNo: 'HBAQ-2025-09876',
          testDate: '2025年7月20日',
          institution: '湖北省农产品质量安全检测中心',
          status: '合格',
          statusLevel: '良好',
          batchNo: 'GH202503'
        },
        {
          reportNo: 'HBAQ-2025-06543',
          testDate: '2025年5月15日',
          institution: '湖北省农产品质量安全检测中心',
          status: '合格',
          statusLevel: '优秀',
          batchNo: 'GH202502'
        }
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
    },
    
    // 配图（用于懒加载）
    images: {
      originImage: 'https://picsum.photos/id/1015/750/400',
      teaOriginImage: 'https://picsum.photos/id/1036/750/400',
      osmanthusOriginImage: 'https://picsum.photos/id/1018/750/400',
      processImage: 'https://picsum.photos/id/1039/750/400',
      certImage: 'https://picsum.photos/id/1025/750/400'
    }
  },

  /**
   * 溯源ID: G003
   * 品种: 金桂
   * 特点: 180年茶树龄，精品礼盒装，同一批次GH202503
   */
  'G003': {
    // 基础信息
    basicInfo: {
      traceId: 'G003',
      batchNo: 'GH202503',
      pickTime: '2025年9月10日',
      productionTime: '2025年9月25日',
      productName: '金桂花茶礼盒装',
      specification: '250g/礼盒',
      thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20golden%20osmanthus%20tea%20gift%20box%20premium%20packaging&image_size=square'
    },
    
    // 树龄信息
    treeAge: {
      teaTreeAge: 180,
      osmanthusTreeAge: 45,
      teaTreeLocation: '福建省武夷山',
      osmanthusTreeLocation: '湖北省A市'
    },
    
    // 桂花信息
    osmanthusInfo: {
      variety: '金桂',
      origin: '湖北省A市',
      pickTime: '2025年9月8日',
      color: '金黄色',
      fragrance: '浓郁持久'
    },
    
    // 窨制工艺
    scentingProcess: {
      scentingTimes: 6,
      scentingDuration: 5,
      temperature: 30,
      humidity: 72,
      ratio: '1:4',
      workshopCleanliness: 'Class 10万级',
      // 每次窨制独立记录
      scentingRecords: [
        { round: 1, duration: 5, temperature: 30, operator: '李师傅', timestamp: '2025-09-12 08:00:00', humidity: 72, note: '头窨，花香浓郁' },
        { round: 2, duration: 5, temperature: 29, operator: '李师傅', timestamp: '2025-09-13 08:30:00', humidity: 71, note: '二窨，香气渐入' },
        { round: 3, duration: 5, temperature: 30, operator: '王师傅', timestamp: '2025-09-14 09:00:00', humidity: 73, note: '三窨，醇厚层叠' },
        { round: 4, duration: 5, temperature: 28, operator: '李师傅', timestamp: '2025-09-15 08:15:00', humidity: 70, note: '四窨，幽香入骨' },
        { round: 5, duration: 5, temperature: 27, operator: '王师傅', timestamp: '2025-09-16 10:00:00', humidity: 72, note: '五窨，香气绵密' },
        { round: 6, duration: 4, temperature: 26, operator: '李师傅', timestamp: '2025-09-17 09:30:00', humidity: 71, note: '六窨，提香收尾' }
      ],
      // 工艺流程步骤（含多媒体）
      processSteps: [
        { step: 1, name: '备料', icon: '📦', desc: '精选优质茶叶与新鲜桂花', mediaType: 'image', mediaUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=premium%20golden%20osmanthus%20tea%20raw%20materials%20gift%20box%20edition&image_size=square' },
        { step: 2, name: '拌花', icon: '🌸', desc: '按配比均匀拌合茶叶与桂花', mediaType: 'image', mediaUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=artisan%20mixing%20premium%20osmanthus%20with%20tea%20leaves%20traditional%20craft&image_size=square' },
        { step: 3, name: '窨制', icon: '🫖', desc: '恒温恒湿环境下静置窨香', mediaType: 'image', mediaUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=premium%20tea%20scenting%20chamber%20precision%20temperature%20control&image_size=square' },
        { step: 4, name: '通花', icon: '💨', desc: '适时通风散热保持活性', mediaType: 'image', mediaUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=master%20artisan%20ventilating%20premium%20osmanthus%20tea%20traditional%20skill&image_size=square' },
        { step: 5, name: '起花', icon: '🧹', desc: '分离茶叶与桂花残渣', mediaType: 'image', mediaUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=fine%20sieving%20premium%20osmanthus%20tea%20separating%20flowers%20from%20leaves&image_size=square' },
        { step: 6, name: '干燥', icon: '☀️', desc: '低温烘干锁住花香', mediaType: 'image', mediaUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=precision%20low%20temperature%20drying%20premium%20osmanthus%20tea%20preserving%20aroma&image_size=square' }
      ]
    },
    
    // 绿色溯源
    greenTrace: {
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
      ecoPacking: {
        title: '环保包装',
        icon: '📦',
        records: [
          '高档竹制礼盒',
          '可重复使用',
          '植物大豆油墨印刷'
        ],
        certification: '绿色包装认证'
      },
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
      institution: '国家茶叶质量监督检验中心',
      testDate: '2025年9月20日',
      reportNo: 'NTQC-2025-09877',
      standard: 'GB 2763-2021',
      comparisonTip: '各项农残数值远低于国标 GB 2763-2021 限值，安全放心',
      verifyUrl: 'https://www.ntqc.org.cn/verify',
      hasAbnormal: false,
      teaTests: [
        { item: '六六六', value: 0.005, displayValue: '<0.01', unit: 'mg/kg', limit: 0.1, status: '合格', description: '' },
        { item: '滴滴涕', value: 0.008, displayValue: '<0.01', unit: 'mg/kg', limit: 0.2, status: '合格', description: '' }
      ],
      osmanthusTests: [
        { item: '联苯菊酯', value: 0.01, displayValue: '<0.02', unit: 'mg/kg', limit: 5.0, status: '合格', description: '' }
      ],
      historyReports: [
        {
          reportNo: 'NTQC-2025-09877',
          testDate: '2025年9月20日',
          institution: '国家茶叶质量监督检验中心',
          status: '合格',
          statusLevel: '优秀',
          batchNo: 'GH202503'
        },
        {
          reportNo: 'NTQC-2025-07653',
          testDate: '2025年7月15日',
          institution: '国家茶叶质量监督检验中心',
          status: '合格',
          statusLevel: '良好',
          batchNo: 'GH202502'
        }
      ]
    },
    
    // 冲泡建议
    brewingGuide: {
      waterTemp: '85℃-90℃',
      brewingTime: '2分钟',
      rebrewTimes: '5-6次',
      waterType: '纯净水或山泉水',
      teawareType: '玻璃杯或白瓷盖碗',
      tips: [
        '先温杯，再投茶',
        '水温不宜过高，保留桂花清香',
        '每泡适当延长浸泡时间'
      ]
    },
    
    // 区块链存证信息
    blockchainInfo: {
      chainName: '溯源链',
      blockHeight: 1892348,
      txHash: '0x9a4b2c...d8e3f2',
      timestamp: '2025-09-25 14:35:22',
      verifyStatus: '已验证'
    },
    
    // 配图（用于懒加载）
    images: {
      originImage: 'https://picsum.photos/id/1044/750/400',
      teaOriginImage: 'https://picsum.photos/id/1018/750/400',
      osmanthusOriginImage: 'https://picsum.photos/id/1039/750/400',
      processImage: 'https://picsum.photos/id/1015/750/400',
      certImage: 'https://picsum.photos/id/1025/750/400'
    }
  },

  /**
   * 溯源ID: G004
   * 品种: 金桂
   * 特点: 150年茶树龄，便携装，同一批次GH202503
   */
  'G004': {
    // 基础信息
    basicInfo: {
      traceId: 'G004',
      batchNo: 'GH202503',
      pickTime: '2025年9月10日',
      productionTime: '2025年9月25日',
      productName: '金桂花茶便携装',
      specification: '3g*12袋/盒',
      thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=osmanthus%20tea%20portable%20sachet%20packaging%20convenient&image_size=square'
    },
    
    // 树龄信息
    treeAge: {
      teaTreeAge: 150,
      osmanthusTreeAge: 35,
      teaTreeLocation: '福建省武夷山',
      osmanthusTreeLocation: '湖北省A市'
    },
    
    // 桂花信息
    osmanthusInfo: {
      variety: '金桂',
      origin: '湖北省A市',
      pickTime: '2025年9月8日',
      color: '金黄色',
      fragrance: '清新自然'
    },
    
    // 窨制工艺
    scentingProcess: {
      scentingTimes: 4,
      scentingDuration: 5,
      temperature: 30,
      humidity: 72,
      ratio: '1:5',
      workshopCleanliness: 'Class 10万级',
      // 每次窨制独立记录
      scentingRecords: [
        { round: 1, duration: 5, temperature: 30, operator: '李师傅', timestamp: '2025-09-12 08:00:00', humidity: 72, note: '头窨，花香浓郁' },
        { round: 2, duration: 5, temperature: 29, operator: '王师傅', timestamp: '2025-09-13 08:30:00', humidity: 71, note: '二窨，香气渐入' },
        { round: 3, duration: 5, temperature: 28, operator: '李师傅', timestamp: '2025-09-14 09:00:00', humidity: 70, note: '三窨，醇厚层叠' },
        { round: 4, duration: 5, temperature: 27, operator: '王师傅', timestamp: '2025-09-15 08:15:00', humidity: 72, note: '四窨，提香收尾' }
      ],
      // 工艺流程步骤（含多媒体）
      processSteps: [
        { step: 1, name: '备料', icon: '📦', desc: '精选优质茶叶与新鲜桂花', mediaType: 'image', mediaUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=portable%20osmanthus%20tea%20sachet%20raw%20materials%20preparation&image_size=square' },
        { step: 2, name: '拌花', icon: '🌸', desc: '按配比均匀拌合茶叶与桂花', mediaType: 'image', mediaUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=mixing%20osmanthus%20flowers%20with%20tea%20for%20portable%20sachets&image_size=square' },
        { step: 3, name: '窨制', icon: '🫖', desc: '恒温恒湿环境下静置窨香', mediaType: 'image', mediaUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=tea%20scenting%20process%20for%20portable%20osmanthus%20tea%20sachets&image_size=square' },
        { step: 4, name: '通花', icon: '💨', desc: '适时通风散热保持活性', mediaType: 'image', mediaUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=ventilating%20osmanthus%20tea%20during%20scenting%20for%20sachet%20production&image_size=square' },
        { step: 5, name: '起花', icon: '🧹', desc: '分离茶叶与桂花残渣', mediaType: 'image', mediaUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=separating%20osmanthus%20flowers%20from%20tea%20for%20portable%20sachets&image_size=square' },
        { step: 6, name: '干燥', icon: '☀️', desc: '低温烘干锁住花香', mediaType: 'image', mediaUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=low%20temperature%20drying%20osmanthus%20tea%20for%20portable%20sachet%20packaging&image_size=square' }
      ]
    },
    
    // 绿色溯源
    greenTrace: {
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
      ecoPacking: {
        title: '环保包装',
        icon: '📦',
        records: [
          '独立铝箔小包装',
          '食品级可降解材料',
          '植物大豆油墨印刷'
        ],
        certification: '绿色包装认证'
      },
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
      institution: '国家茶叶质量监督检验中心',
      testDate: '2025年9月20日',
      reportNo: 'NTQC-2025-09878',
      standard: 'GB 2763-2021',
      comparisonTip: '各项农残数值远低于国标 GB 2763-2021 限值，安全放心',
      verifyUrl: 'https://www.ntqc.org.cn/verify',
      hasAbnormal: false,
      teaTests: [
        { item: '六六六', value: 0.005, displayValue: '<0.01', unit: 'mg/kg', limit: 0.1, status: '合格', description: '' },
        { item: '滴滴涕', value: 0.008, displayValue: '<0.01', unit: 'mg/kg', limit: 0.2, status: '合格', description: '' }
      ],
      osmanthusTests: [
        { item: '联苯菊酯', value: 0.01, displayValue: '<0.02', unit: 'mg/kg', limit: 5.0, status: '合格', description: '' }
      ],
      historyReports: [
        {
          reportNo: 'NTQC-2025-09878',
          testDate: '2025年9月20日',
          institution: '国家茶叶质量监督检验中心',
          status: '合格',
          statusLevel: '优秀',
          batchNo: 'GH202503'
        },
        {
          reportNo: 'NTQC-2025-07652',
          testDate: '2025年7月15日',
          institution: '国家茶叶质量监督检验中心',
          status: '合格',
          statusLevel: '良好',
          batchNo: 'GH202502'
        }
      ]
    },
    
    // 冲泡建议
    brewingGuide: {
      waterTemp: '85℃-90℃',
      brewingTime: '3分钟',
      rebrewTimes: '2-3次',
      waterType: '纯净水或山泉水',
      teawareType: '玻璃杯或马克杯',
      tips: [
        '一袋一杯，方便快捷',
        '水温不宜过高，保留桂花清香',
        '适合办公室、出行使用'
      ]
    },
    
    // 区块链存证信息
    blockchainInfo: {
      chainName: '溯源链',
      blockHeight: 1892349,
      txHash: '0x1b3d5f...a9c7e4',
      timestamp: '2025-09-25 14:38:45',
      verifyStatus: '已验证'
    },
    
    // 配图（用于懒加载）
    images: {
      originImage: 'https://picsum.photos/id/1039/750/400',
      teaOriginImage: 'https://picsum.photos/id/1015/750/400',
      osmanthusOriginImage: 'https://picsum.photos/id/1036/750/400',
      processImage: 'https://picsum.photos/id/1044/750/400',
      certImage: 'https://picsum.photos/id/1025/750/400'
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

/**
 * 验证批次号格式是否有效
 * @param {string} batchNo - 批次号
 * @returns {boolean} - 格式是否有效
 */
function validateBatchNo(batchNo) {
  if (!batchNo || typeof batchNo !== 'string') {
    return false;
  }
  
  // 批次号格式：GH开头，后跟8位数字，如 GH202503
  const pattern = /^GH\d{6}$/;
  return pattern.test(batchNo.trim().toUpperCase());
}

/**
 * 根据批次号获取该批次下的所有SKU
 * @param {string} batchNo - 批次号（如 GH202503）
 * @returns {array|null} - 返回该批次的所有SKU基础信息数组，未找到则返回 null
 */
function getBatchSkus(batchNo) {
  if (!validateBatchNo(batchNo)) {
    return null;
  }
  
  const normalizedBatchNo = batchNo.trim().toUpperCase();
  const skus = [];
  
  // 遍历所有溯源数据，找到匹配批次号的产品
  for (const traceId in mockTraceData) {
    const data = mockTraceData[traceId];
    if (data.basicInfo && data.basicInfo.batchNo === normalizedBatchNo) {
      skus.push({
        traceId: data.basicInfo.traceId,
        productName: data.basicInfo.productName,
        specification: data.basicInfo.specification,
        thumbnail: data.basicInfo.thumbnail,
        pickTime: data.basicInfo.pickTime,
        productionTime: data.basicInfo.productionTime
      });
    }
  }
  
  return skus.length > 0 ? skus : null;
}

/**
 * 根据条形码获取溯源ID
 * @param {string} barcode - 条形码内容
 * @returns {string|null} - 溯源ID或null
 */
function getTraceIdFromBarcode(barcode) {
  if (!barcode || typeof barcode !== 'string') {
    return null;
  }
  
  // 条形码格式示例：6901234567890-G001
  // 支持 条形码-溯源ID 格式
  const parts = barcode.split('-');
  if (parts.length === 2) {
    const traceId = parts[1].trim().toUpperCase();
    if (validateTraceId(traceId) && mockTraceData[traceId]) {
      return traceId;
    }
  }
  
  // 支持纯数字条形码映射（模拟条码库查询）
  const barcodeMapping = {
    '6901234567890': 'G001',
    '6901234567891': 'G002',
    '6901234567892': 'G003',
    '6901234567893': 'G004'
  };
  
  return barcodeMapping[barcode.trim()] || null;
}

/**
 * 解析小程序码 scene 参数
 * @param {string} scene - 小程序码 scene 参数（URL编码）
 * @returns {string|null} - 溯源ID或null
 */
function parseSceneParam(scene) {
  if (!scene || typeof scene !== 'string') {
    return null;
  }
  
  try {
    // scene 参数通常是 URL 编码的
    const decodedScene = decodeURIComponent(scene);
    console.log('解析 scene 参数:', decodedScene);
    
    // 支持格式：traceId=G001 或 id=G001 或直接 G001
    if (decodedScene.includes('=')) {
      const params = new URLSearchParams(decodedScene);
      const traceId = params.get('traceId') || params.get('id');
      if (traceId && validateTraceId(traceId)) {
        return traceId.toUpperCase();
      }
    }
    
    // 直接是溯源ID格式
    if (validateTraceId(decodedScene)) {
      return decodedScene.toUpperCase();
    }
    
    return null;
  } catch (e) {
    console.error('解析 scene 参数失败:', e);
    return null;
  }
}

/**
 * 检测报告验真
 * @param {string} reportNo - 报告编号
 * @returns {object|null} - 返回验真结果，未找到则返回 null
 */
function verifyReport(reportNo) {
  if (!reportNo || typeof reportNo !== 'string') {
    return null;
  }
  
  const normalizedReportNo = reportNo.trim().toUpperCase();
  
  for (const traceId in mockTraceData) {
    const data = mockTraceData[traceId];
    if (data.pesticideTest && data.pesticideTest.reportNo === normalizedReportNo) {
      return {
        valid: true,
        reportNo: normalizedReportNo,
        productName: data.basicInfo.productName,
        batchNo: data.basicInfo.batchNo,
        institution: data.pesticideTest.institution,
        testDate: data.pesticideTest.testDate,
        standard: data.pesticideTest.standard,
        status: data.pesticideTest.hasAbnormal ? '存在异常项' : '全部合格',
        verifyTime: new Date().toLocaleString('zh-CN'),
        traceId: traceId
      };
    }
    
    if (data.pesticideTest && data.pesticideTest.historyReports) {
      const historyReport = data.pesticideTest.historyReports.find(
        r => r.reportNo === normalizedReportNo
      );
      if (historyReport) {
        return {
          valid: true,
          reportNo: normalizedReportNo,
          productName: data.basicInfo.productName,
          batchNo: historyReport.batchNo,
          institution: historyReport.institution,
          testDate: historyReport.testDate,
          standard: data.pesticideTest.standard,
          status: historyReport.status,
          verifyTime: new Date().toLocaleString('zh-CN'),
          traceId: traceId
        };
      }
    }
  }
  
  return {
    valid: false,
    reportNo: normalizedReportNo,
    message: '未找到该报告编号，请检查是否输入正确'
  };
}

/**
 * 计算检测项百分比（检测值/限值 * 100），用于进度条展示
 * @param {number} value - 检测值
 * @param {number} limit - 国标限值
 * @returns {number} - 百分比 (0-100)
 */
function calculateTestPercent(value, limit) {
  if (!limit || limit <= 0) return 0;
  const percent = (value / limit) * 100;
  return Math.min(Math.round(percent * 10) / 10, 100);
}

/**
 * 获取金桂（G001）与银桂（G002）窨制工艺对比数据
 * @returns {object} - 工艺对比数据对象
 */
function getScentingComparison() {
  const golden = mockTraceData['G001'];
  const silver = mockTraceData['G002'];
  
  if (!golden || !silver) {
    return null;
  }
  
  return {
    title: '金桂 vs 银桂 窨制工艺对比',
    summary: {
      golden: {
        name: '金桂花茶',
        variety: '金桂',
        scentingTimes: golden.scentingProcess.scentingTimes,
        totalDuration: golden.scentingProcess.scentingRecords.reduce((sum, r) => sum + r.duration, 0),
        avgTemperature: Math.round(golden.scentingProcess.scentingRecords.reduce((sum, r) => sum + r.temperature, 0) / golden.scentingProcess.scentingRecords.length * 10) / 10,
        fragrance: golden.osmanthusInfo.fragrance,
        color: golden.osmanthusInfo.color,
        teaTreeAge: golden.treeAge.teaTreeAge
      },
      silver: {
        name: '银桂花茶',
        variety: '银桂',
        scentingTimes: silver.scentingProcess.scentingTimes,
        totalDuration: silver.scentingProcess.scentingRecords.reduce((sum, r) => sum + r.duration, 0),
        avgTemperature: Math.round(silver.scentingProcess.scentingRecords.reduce((sum, r) => sum + r.temperature, 0) / silver.scentingProcess.scentingRecords.length * 10) / 10,
        fragrance: silver.osmanthusInfo.fragrance,
        color: silver.osmanthusInfo.color,
        teaTreeAge: silver.treeAge.teaTreeAge
      }
    },
    // 详细对比项
    comparisonItems: [
      {
        category: '窨制次数',
        golden: `${golden.scentingProcess.scentingTimes}次`,
        silver: `${silver.scentingProcess.scentingTimes}次`,
        difference: '金桂多2次窨制，香气更浓郁持久',
        advantage: 'golden'
      },
      {
        category: '总窨制时长',
        golden: `${golden.scentingProcess.scentingRecords.reduce((sum, r) => sum + r.duration, 0)}小时`,
        silver: `${silver.scentingProcess.scentingRecords.reduce((sum, r) => sum + r.duration, 0)}小时`,
        difference: '金桂窨制时间更长，茶叶吸香更充分',
        advantage: 'golden'
      },
      {
        category: '每次窨制时长',
        golden: `${golden.scentingProcess.scentingDuration}小时/次`,
        silver: `${silver.scentingProcess.scentingDuration}小时/次`,
        difference: '银桂单次窨制时间更长，香气更柔和',
        advantage: 'neutral'
      },
      {
        category: '窨制温度',
        golden: `${golden.scentingProcess.temperature}℃`,
        silver: `${silver.scentingProcess.temperature}℃`,
        difference: '金桂温度略高，促进花香物质释放',
        advantage: 'neutral'
      },
      {
        category: '花茶配比',
        golden: golden.scentingProcess.ratio,
        silver: silver.scentingProcess.ratio,
        difference: '两者配比相同，均为1:5',
        advantage: 'neutral'
      },
      {
        category: '香气特点',
        golden: golden.osmanthusInfo.fragrance,
        silver: silver.osmanthusInfo.fragrance,
        difference: '金桂浓郁热烈，银桂清雅淡香，各有千秋',
        advantage: 'neutral'
      },
      {
        category: '茶树龄',
        golden: `${golden.treeAge.teaTreeAge}年`,
        silver: `${silver.treeAge.teaTreeAge}年`,
        difference: '金桂茶树龄更长，茶叶底蕴更醇厚',
        advantage: 'golden'
      },
      {
        category: '桂花树龄',
        golden: `${golden.treeAge.osmanthusTreeAge}年`,
        silver: `${silver.treeAge.osmanthusTreeAge}年`,
        difference: '金桂桂花树龄更长，花香更纯正',
        advantage: 'golden'
      },
      {
        category: '适用场景',
        golden: '送礼、资深茶友、收藏',
        silver: '日常饮用、入门尝鲜',
        difference: '金桂定位高端，银桂性价比高',
        advantage: 'neutral'
      }
    ],
    // 窨制记录对比（逐次）
    recordsComparison: {
      golden: golden.scentingProcess.scentingRecords,
      silver: silver.scentingProcess.scentingRecords
    },
    // 差异说明
    differenceExplanation: `
【金桂5次窨制特点】
• 窨制次数多（5次），茶叶充分吸收桂花香气
• 温度控制在27-30℃，促进花香物质充分释放
• 层次感强，香气浓郁持久，口齿留香
• 适合喜欢浓郁花香的茶友，具有收藏价值

【银桂3次窨制特点】
• 窨制次数适中（3次），香气清雅不浓烈
• 单次窨制时间更长（6小时），香气更柔和
• 温度略低（26-28℃），保留银桂特有的清甜
• 性价比高，适合日常饮用和入门尝鲜

【核心差异总结】
金桂5窨：浓郁持久、层次感强、高端品质
银桂3窨：清雅淡香、口感柔和、性价比之选
`.trim()
  };
}

// 导出模块
module.exports = {
  getTraceData,
  validateTraceId,
  getAvailableTraceIds,
  mockTraceData,
  validateBatchNo,
  getBatchSkus,
  getTraceIdFromBarcode,
  parseSceneParam,
  verifyReport,
  calculateTestPercent,
  getScentingComparison
};
