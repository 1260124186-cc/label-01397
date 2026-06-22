/**
 * 桂花茶溯源小程序 - 本地模拟数据
 * 功能：提供测试用的溯源数据（G001、G002）
 * 说明：实际项目中应通过 wx.request 从后端获取数据
 */

var reviewTrust = require('./reviewTrust.js');

// ==================== 桂花品种配置（扩展枚举） ====================
const OSMANTHUS_VARIETIES = {
  '金桂': {
    key: 'jin-gui',
    color: '#DAA520',
    bgGradient: 'linear-gradient(135deg, #FFD700 0%, #DAA520 100%)',
    lightBg: '#FFF8E1',
    borderColor: '#F5C842',
    icon: '🌼',
    description: '花色金黄，香气浓郁持久，为桂花之上品'
  },
  '银桂': {
    key: 'yin-gui',
    color: '#C0C0C0',
    bgGradient: 'linear-gradient(135deg, #F5F5F5 0%, #C0C0C0 100%)',
    lightBg: '#FAFAFA',
    borderColor: '#D0D0D0',
    icon: '🌸',
    description: '花色乳白，香气清雅淡远，口感柔和'
  },
  '丹桂': {
    key: 'dan-gui',
    color: '#CD5C5C',
    bgGradient: 'linear-gradient(135deg, #FF6B6B 0%, #CD5C5C 100%)',
    lightBg: '#FFF0F0',
    borderColor: '#E87373',
    icon: '🌺',
    description: '花色橙红，香气馥郁浓烈，为名贵观赏品种'
  },
  '四季桂': {
    key: 'si-ji-gui',
    color: '#90EE90',
    bgGradient: 'linear-gradient(135deg, #98FB98 0%, #90EE90 100%)',
    lightBg: '#F0FFF0',
    borderColor: '#A8E6A8',
    icon: '🍃',
    description: '四季开花，香气清淡悠长，常年可供观赏'
  }
};

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
      thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=premium%20golden%20osmanthus%20tea%20tin%20can%20product%20photo&image_size=square',
      shelfLife: {
        productionDate: '2025-09-25',
        bestBeforeDate: '2026-09-25',
        totalDays: 365,
        bestTasteStartDays: 7,
        bestTasteEndDays: 270,
        storageCondition: '阴凉干燥处，避免阳光直射，温度≤25℃，湿度≤65%',
        storageTips: ['开封后请密封保存', '建议3个月内饮用完毕', '避免与异味物品放在一起']
      }
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

    // IoT车间环境监测（窨制车间）
    workshopEnv: {
      workshopName: '窨制车间A',
      cleanlinessLevel: 'Class 10万级',
      cleanlinessStatus: '达标',
      sensors: [
        { id: 'TH-001', name: '温湿度传感器-1区', type: 'temperature_humidity', location: '窨制区1号位', status: 'online' },
        { id: 'TH-002', name: '温湿度传感器-2区', type: 'temperature_humidity', location: '窨制区2号位', status: 'online' },
        { id: 'PM-001', name: '洁净度检测仪', type: 'cleanliness', location: '车间入口', status: 'online' }
      ],
      realtimeData: {
        temperature: 29.5,
        humidity: 72.3,
        pm25: 8,
        particleCount: 3520,
        updateTime: '2025-09-16 10:30:00'
      },
      curveData: {
        duration: 72,
        interval: 1,
        temperatureData: (function() {
          var data = [];
          for (var i = 0; i < 72; i++) {
            var base = 28 + Math.sin(i / 12 * Math.PI) * 2;
            var noise = (Math.random() - 0.5) * 1.5;
            var scentingBoost = 0;
            if ((i >= 8 && i <= 13) || (i >= 32 && i <= 37) || (i >= 56 && i <= 61)) {
              scentingBoost = 2;
            }
            data.push(Math.round((base + noise + scentingBoost) * 10) / 10);
          }
          return data;
        })(),
        humidityData: (function() {
          var data = [];
          for (var i = 0; i < 72; i++) {
            var base = 70 + Math.sin(i / 10 * Math.PI) * 4;
            var noise = (Math.random() - 0.5) * 3;
            var scentingBoost = 0;
            if ((i >= 8 && i <= 13) || (i >= 32 && i <= 37) || (i >= 56 && i <= 61)) {
              scentingBoost = 3;
            }
            data.push(Math.round((base + noise + scentingBoost) * 10) / 10);
          }
          return data;
        })(),
        startTime: '2025-09-14 00:00',
        endTime: '2025-09-16 23:59',
        scentingRanges: [
          { round: 1, startHour: 8, endHour: 13 },
          { round: 2, startHour: 32, endHour: 37 },
          { round: 3, startHour: 56, endHour: 61 }
        ]
      }
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
      chainId: 'trace-chain-mainnet-01',
      blockHeight: 1892347,
      txHash: '0x8f9a3b7c4d5e6f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5',
      txHashShort: '0x8f9a3b...c7d2e1',
      timestamp: '2025-09-25 14:32:18',
      verifyStatus: '已验证',
      contractAddress: '0x1234abcd5678ef90abcdef1234567890abcdef12',
      nodeCount: 21,
      consensusType: 'PBFT',
      onChainFields: [
        { key: 'batchNo', label: '批次号', value: 'GH202503', onChain: true },
        { key: 'testReport', label: '检测报告编号', value: 'NTQC-2025-09876', onChain: true },
        { key: 'productionTime', label: '出厂时间', value: '2025年9月25日', onChain: true },
        { key: 'teaTreeAge', label: '茶树龄', value: '200年', onChain: true },
        { key: 'osmanthusVariety', label: '桂花品种', value: '金桂', onChain: true },
        { key: 'scentingTimes', label: '窨制次数', value: '5次', onChain: true },
        { key: 'greenCert', label: '绿色认证', value: '有机产品认证', onChain: true }
      ],
      blockExplorerUrl: 'https://explorer.tracechain.cn/tx/0x8f9a3b7c4d5e6f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5',
      scanRecords: {
        totalQueryCount: 128,
        firstScanTime: '2025-09-26 09:15:32',
        lastScanTime: '2025-12-10 18:22:45',
        records: [
          { time: '2025-09-26 09:15:32', type: 'first', location: '湖北咸宁', ip: '119.96.xx.xx' },
          { time: '2025-10-03 14:08:19', type: 'repeat', location: '北京朝阳', ip: '123.125.xx.xx' },
          { time: '2025-10-15 20:33:51', type: 'repeat', location: '上海浦东', ip: '101.226.xx.xx' },
          { time: '2025-11-02 11:47:05', type: 'repeat', location: '广东深圳', ip: '183.14.xx.xx' },
          { time: '2025-12-10 18:22:45', type: 'repeat', location: '浙江杭州', ip: '115.236.xx.xx' }
        ]
      },
      tsaCertificate: {
        issuer: '中国电子认证服务产业联盟',
        tsServer: 'TSA-2025-CN-JUDICIAL-001',
        certSerial: 'TSA-CERT-2025-0925-001',
        algorithm: 'SM2',
        timestamp: '2025-09-25 14:32:18.456+08:00',
        accuracy: '0.001s',
        tsTokenHash: 'a7f3b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0',
        evidenceHash: 'e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1',
        legalBasis: '《中华人民共和国电子签名法》第十三条',
        validityPeriod: '2025-01-01 至 2030-12-31',
        verifyUrl: 'https://tsa.cfca.com.cn/verify?sn=TSA-CERT-2025-0925-001'
      }
    },

    // 产地地理信息（地图模块）
    locationMap: {
      title: '产地地理信息',
      centerLat: 27.9879,
      centerLng: 118.0935,
      scale: 10,
      markers: [
        {
          id: 1,
          type: 'teaGarden',
          name: '武夷山百年茶树园',
          lat: 27.9879,
          lng: 118.0935,
          icon: '🍃',
          color: '#2E8B57',
          width: 40,
          height: 40,
          callout: {
            title: '武夷山百年茶树园',
            content: '海拔800米以上高山云雾茶园，200年以上古茶树500余株，国家级茶树种植保护区',
            images: [
              'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=ancient%20tea%20garden%20in%20wuyi%20mountain%20misty%20terrace&image_size=square',
              'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=200%20year%20old%20tea%20tree%20mountain%20terrace%20aerial&image_size=square'
            ]
          }
        },
        {
          id: 2,
          type: 'osmanthusGarden',
          name: '咸宁金桂种植基地',
          lat: 29.8408,
          lng: 114.3162,
          icon: '🌼',
          color: '#DAA520',
          width: 40,
          height: 40,
          callout: {
            title: '咸宁金桂种植基地',
            content: '中国桂花之乡核心产区，50年树龄以上金桂3000余株，有机种植认证基地',
            images: [
              'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=golden%20osmanthus%20garden%20in%20full%20bloom%20autumn&image_size=square',
              'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=aerial%20view%20osmanthus%20tree%20plantation%20autumn%20golden&image_size=square'
            ]
          }
        },
        {
          id: 3,
          type: 'factory',
          name: '非遗窨制工艺加工厂',
          lat: 30.5928,
          lng: 114.3055,
          icon: '🏭',
          color: '#1890FF',
          width: 40,
          height: 40,
          callout: {
            title: '非遗窨制工艺加工厂',
            content: '传承600年桂花茶窨制技艺，国家级非物质文化遗产示范基地，10万级洁净生产车间',
            images: [
              'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=traditional%20tea%20processing%20factory%20clean%20workshop&image_size=square',
              'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=artisan%20tea%20scenting%20workshop%20chinese%20traditional&image_size=square'
            ]
          }
        }
      ]
    },

    // 卫星/实景照片轮播
    scenicPhotos: {
      title: '产地实景航拍',
      autoPlay: true,
      interval: 3500,
      photos: [
        {
          url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=aerial%20drone%20view%20wuyi%20mountain%20tea%20terraces%20sunrise%20mist&image_size=landscape_16_9',
          caption: '武夷山茶园航拍 · 清晨云雾缭绕',
          type: 'aerial'
        },
        {
          url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=close%20up%20ancient%20tea%20tree%20trunk%20moss%20lichen%20mountain&image_size=landscape_16_9',
          caption: '200年古茶树 · 树干青苔斑驳',
          type: 'detail'
        },
        {
          url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=golden%20osmanthus%20flowers%20close%20up%20tree%20autumn%20sunlight&image_size=landscape_16_9',
          caption: '咸宁金桂基地 · 金秋盛放',
          type: 'aerial'
        },
        {
          url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=tea%20pickers%20harvesting%20tea%20leaves%20mountain%20terrace%20traditional&image_size=landscape_16_9',
          caption: '茶农手工采茶 · 明前嫩芽',
          type: 'people'
        },
        {
          url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=traditional%20chinese%20tea%20master%20scenting%20osmanthus%20tea%20workshop&image_size=landscape_16_9',
          caption: '非遗传承人 · 古法窨制',
          type: 'people'
        }
      ]
    },

    // 树龄故事
    treeStory: {
      title: '200年茶树的故事',
      teaTree: {
        plantYear: '清嘉庆五年（1800年）',
        age: 225,
        height: '5.2米',
        crown: '4.8米',
        location: '武夷山核心产区・九龙窠崖壁',
        story: '此株古茶树种于清嘉庆五年，由当地茶农李氏先祖亲手栽植。历经两个世纪的风雨洗礼，至今仍枝繁叶茂，每年可产特级干茶约2.5公斤。茶树扎根于丹霞地貌的岩缝之中，汲取武夷山独特的岩石矿物精华，造就了其独特的"岩骨花香"韵味。',
        historicalRecords: [
          { year: '1800', event: '李氏先祖栽植此茶树，选址于九龙窠向阳崖壁', type: 'plant' },
          { year: '1850', event: '李氏后人扩建茶园，此树所产茶成为当地贡茶', type: 'expand' },
          { year: '1938', event: '抗日战争期间，茶园遭破坏，此树幸免于难', type: 'survive' },
          { year: '1982', event: '被列为武夷山一级保护古茶树，编号WH-001', type: 'protect' },
          { year: '2006', event: '武夷岩茶制作技艺列入首批国家级非遗名录', type: 'heritage' },
          { year: '2019', event: '完成古树基因测序，建立专属数字档案', type: 'digital' }
        ],
        maintenanceRecords: [
          { date: '2025-03-15', type: '春季养护', operator: '王师傅（高级农艺师）', content: '修剪枯枝、施加有机肥、病虫害检查，一切正常', photos: 3 },
          { date: '2025-04-20', type: '明前采摘', operator: '李氏家族采茶队', content: '手工采摘一芽二叶鲜叶，共采得鲜叶10.2公斤', photos: 8 },
          { date: '2025-06-10', type: '夏季防护', operator: '武夷山古茶树保护站', content: '安装遮阳网、喷淋灌溉系统、土壤湿度检测', photos: 5 },
          { date: '2025-09-05', type: '秋季养护', operator: '王师傅（高级农艺师）', content: '施加腐熟羊粪、清理周边杂草、树干涂白防虫', photos: 4 }
        ]
      },
      osmanthusTree: {
        plantYear: '1973年',
        age: 52,
        height: '6.8米',
        crown: '5.5米',
        location: '咸安区桂花镇・王氏百年桂花园',
        story: '此株金桂栽于1973年，由当地桂花种植世家王氏第三代传人王老先生亲手栽种。每年中秋前后，满树金黄，香飘数里，所产桂花是窨制桂花茶的上等原料。',
        maintenanceRecords: [
          { date: '2025-02-20', type: '整枝修剪', operator: '王师傅', content: '修剪过密枝条、定型树冠，促进花芽分化' },
          { date: '2025-08-15', type: '花期前养护', operator: '王师傅', content: '施加磷钾肥、防治红蜘蛛、清理落叶' },
          { date: '2025-09-08', type: '桂花采摘', operator: '王氏采摘队', content: '人工采摘新鲜桂花42.8公斤，均为初开盛花' }
        ]
      }
    },

    // 采摘当日天气
    pickWeather: {
      teaPick: {
        date: '2025年4月20日',
        location: '福建武夷山',
        weather: '晴转多云',
        weatherIcon: '⛅',
        temperature: '16℃~24℃',
        avgTemp: 20,
        humidity: '68%',
        avgHumidity: 68,
        wind: '东南风 2级',
        airQuality: '优（AQI: 38）',
        sunrise: '05:42',
        sunset: '18:36',
        note: '清晨有薄雾，上午9时云雾散去，光照适宜，茶叶内涵物质积累最佳，为明前茶理想采摘天气。'
      },
      osmanthusPick: {
        date: '2025年9月8日',
        location: '湖北咸宁',
        weather: '晴',
        weatherIcon: '☀️',
        temperature: '18℃~26℃',
        avgTemp: 22,
        humidity: '72%',
        avgHumidity: 72,
        wind: '东北风 1-2级',
        airQuality: '优（AQI: 32）',
        sunrise: '06:08',
        sunset: '18:22',
        note: '连续三日晴天，桂花香气物质充分积累；无风无雨，花朵完整无损，为桂花采摘绝佳天气。'
      }
    },

    // 配图（用于懒加载）
    images: {
      originImage: 'https://picsum.photos/id/1018/750/400',
      teaOriginImage: 'https://picsum.photos/id/1039/750/400',
      osmanthusOriginImage: 'https://picsum.photos/id/1044/750/400',
      processImage: 'https://picsum.photos/id/1036/750/400',
      certImage: 'https://picsum.photos/id/1025/750/400'
    },

    // 出口合规溯源信息
    exportInfo: {
      exportBatchNo: 'EXP-GH202503-JP-001',
      hsCode: '0902.10.00',
      hsCodeDescription: '绿茶（未发酵），内包装每件净重≤3kg',
      countryOfOrigin: '中国',
      originRegion: '湖北省咸宁市',

      certificateOfOrigin: {
        certNo: 'CO-CN-HUB-2025-09876',
        issuingAuthority: '中国国际贸易促进委员会',
        issueDate: '2025-09-28',
        validUntil: '2026-09-27',
        certType: '一般原产地证',
        verifyUrl: 'https://www.ccpit.org/verify/co',
        status: 'valid'
      },

      inspectionQuarantine: {
        certNo: 'IQ-CN-HUB-2025-12345',
        issuingAuthority: '武汉海关',
        issueDate: '2025-09-26',
        validUntil: '2026-03-25',
        inspectionDate: '2025-09-25',
        result: '合格',
        quarantineResult: '合格',
        standard: 'GB 2763-2021; 日本肯定列表制度',
        verifyUrl: 'https://www.customs.gov.cn/iq/verify',
        items: [
          { item: '农药残留', result: '合格', standard: '日本肯定列表' },
          { item: '微生物', result: '合格', standard: '食品卫生法' },
          { item: '重金属', result: '合格', standard: 'GB 2762-2022' },
          { item: '添加剂', result: '未检出', standard: 'GB 2760-2014' }
        ]
      },

      multilingualLabels: {
        availableLanguages: ['zh-CN', 'en-US', 'ja-JP'],
        labels: {
          'zh-CN': {
            productName: '金桂花茶',
            ingredients: '茶叶、桂花',
            netContent: '100g',
            shelfLife: '12个月',
            storageMethod: '阴凉干燥处，避免阳光直射',
            origin: '中国湖北咸宁',
            manufacturer: '一茶一品（咸宁）桂花茶有限公司',
            address: '湖北省咸宁市桂花镇工业园88号'
          },
          'en-US': {
            productName: 'Golden Osmanthus Tea',
            ingredients: 'Tea Leaves, Osmanthus Flowers',
            netContent: '100g',
            shelfLife: '12 months',
            storageMethod: 'Store in cool, dry place. Avoid direct sunlight.',
            origin: 'Xianning, Hubei, China',
            manufacturer: 'YiChaYiPin (Xianning) Osmanthus Tea Co., Ltd.',
            address: 'No.88 Guihua Town Industrial Park, Xianning, Hubei, China'
          },
          'ja-JP': {
            productName: 'キンモクセイ茶',
            ingredients: '茶葉、金木犀の花',
            netContent: '100g',
            shelfLife: '12ヶ月',
            storageMethod: '涼しく乾燥した場所に保管し、直射日光を避けてください。',
            origin: '中国湖北省咸寧市',
            manufacturer: '一茶一品（咸寧）桂花茶有限公司',
            address: '中華人民共和国湖北省咸寧市桂花鎮工業園88番'
          }
        }
      },

      shipping: {
        method: 'ocean',
        methodLabel: '海运',
        containerNo: 'MSKU1234567',
        containerType: '20GP',
        vesselName: 'COSCO SHIPPING ROSE',
        voyageNo: '025E',
        billOfLading: 'COSHAW25090876',
        portOfLoading: '上海港',
        portOfDischarge: '横滨港',
        etd: '2025-10-05',
        eta: '2025-10-20',
        actualDeparture: '2025-10-05',
        actualArrival: null,
        trackingUrl: 'https://www.coscoshipping.com/tracking'
      },

      customsClearance: {
        status: 'in_transit',
        statusLabel: '运输中',
        declarationNo: 'CUS-SH-2025-1008765',
        declareDate: '2025-10-03',
        customsOffice: '上海海关',
        importCountry: '日本',
        importCustoms: '横滨税关',
        tariffCode: '0902.10.00',
        dutyRate: '5%',
        importValue: 'USD 25,000.00',
        taxPaid: null,
        clearanceDate: null,
        inspectionRequired: true,
        inspectionStatus: 'pending',
        remarks: '食品检疫中，预计10月22日完成'
      },

      overseasDistributor: {
        name: '株式会社桜茶園',
        country: '日本',
        region: '神奈川県横浜市',
        address: '〒220-0011 神奈川県横浜市西区高島2-1-1',
        contactPerson: '山田太郎',
        contactEmail: 'yamada@ochaen.co.jp',
        contactPhone: '+81-45-123-4567',
        licenseNo: 'JAPAN-FOOD-IMP-2025-00876',
        authorizedDate: '2025-01-15',
        authorizedProducts: ['金桂花茶', '银桂花茶'],
        level: '一级经销商',
        verifyUrl: 'https://www.ochaen.co.jp/auth'
      },

      exportBlockchain: {
        chainName: '跨境贸易链',
        chainId: 'cross-border-trade-001',
        txHash: '0x3a7d5b9c8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b',
        txHashShort: '0x3a7d5b...3f2a1b',
        timestamp: '2025-09-28 10:30:00',
        verifyStatus: '已验证',
        onChainFields: [
          { key: 'exportBatchNo', label: '出口批次号', value: 'EXP-GH202503-JP-001', onChain: true },
          { key: 'hsCode', label: 'HS编码', value: '0902.10.00', onChain: true },
          { key: 'coCertNo', label: '原产地证号', value: 'CO-CN-HUB-2025-09876', onChain: true },
          { key: 'iqCertNo', label: '检验检疫证号', value: 'IQ-CN-HUB-2025-12345', onChain: true },
          { key: 'containerNo', label: '集装箱号', value: 'MSKU1234567', onChain: true },
          { key: 'blNo', label: '提单号', value: 'COSHAW25090876', onChain: true }
        ],
        blockExplorerUrl: 'https://cross-border.tracechain.cn/tx/0x3a7d5b9c8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b'
      },

      viewMode: 'export',
      targetMarkets: ['JP', 'US', 'EU']
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
      thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=silver%20osmanthus%20tea%20packaging%20elegant%20product%20photo&image_size=square',
      shelfLife: {
        productionDate: '2025-09-30',
        bestBeforeDate: '2026-09-30',
        totalDays: 365,
        bestTasteStartDays: 7,
        bestTasteEndDays: 270,
        storageCondition: '阴凉干燥处，避免阳光直射，温度≤25℃，湿度≤65%',
        storageTips: ['开封后请密封保存', '建议3个月内饮用完毕', '避免与异味物品放在一起']
      }
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

    workshopEnv: {
      workshopName: '窨制车间B',
      cleanlinessLevel: 'Class 10万级',
      cleanlinessStatus: '达标',
      sensors: [
        { id: 'TH-003', name: '温湿度传感器-1区', type: 'temperature_humidity', location: '窨制区1号位', status: 'online' },
        { id: 'PM-002', name: '洁净度检测仪', type: 'cleanliness', location: '车间入口', status: 'online' }
      ],
      realtimeData: {
        temperature: 27.8,
        humidity: 70.1,
        pm25: 6,
        particleCount: 2840,
        updateTime: '2025-09-19 08:30:00'
      },
      curveData: {
        duration: 72,
        interval: 1,
        temperatureData: (function() {
          var data = [];
          for (var i = 0; i < 72; i++) {
            var base = 26 + Math.sin(i / 14 * Math.PI) * 2;
            var noise = (Math.random() - 0.5) * 1.2;
            var scentingBoost = 0;
            if ((i >= 8 && i <= 14) || (i >= 32 && i <= 38)) {
              scentingBoost = 1.5;
            }
            data.push(Math.round((base + noise + scentingBoost) * 10) / 10);
          }
          return data;
        })(),
        humidityData: (function() {
          var data = [];
          for (var i = 0; i < 72; i++) {
            var base = 68 + Math.sin(i / 11 * Math.PI) * 3;
            var noise = (Math.random() - 0.5) * 2.5;
            var scentingBoost = 0;
            if ((i >= 8 && i <= 14) || (i >= 32 && i <= 38)) {
              scentingBoost = 2.5;
            }
            data.push(Math.round((base + noise + scentingBoost) * 10) / 10);
          }
          return data;
        })(),
        startTime: '2025-09-17 00:00',
        endTime: '2025-09-19 23:59',
        scentingRanges: [
          { round: 1, startHour: 8, endHour: 14 },
          { round: 2, startHour: 32, endHour: 38 }
        ]
      }
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
      chainId: 'trace-chain-mainnet-01',
      blockHeight: 1895123,
      txHash: '0x2e7c4a9b8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1',
      txHashShort: '0x2e7c4a...f8b9d3',
      timestamp: '2025-09-30 10:15:42',
      verifyStatus: '已验证',
      contractAddress: '0x1234abcd5678ef90abcdef1234567890abcdef12',
      nodeCount: 21,
      consensusType: 'PBFT',
      onChainFields: [
        { key: 'batchNo', label: '批次号', value: 'GH202504', onChain: true },
        { key: 'testReport', label: '检测报告编号', value: 'HBAQ-2025-12345', onChain: true },
        { key: 'productionTime', label: '出厂时间', value: '2025年9月30日', onChain: true },
        { key: 'teaTreeAge', label: '茶树龄', value: '120年', onChain: true },
        { key: 'osmanthusVariety', label: '桂花品种', value: '银桂', onChain: true },
        { key: 'scentingTimes', label: '窨制次数', value: '3次', onChain: true },
        { key: 'greenCert', label: '绿色认证', value: '绿色食品认证', onChain: true }
      ],
      blockExplorerUrl: 'https://explorer.tracechain.cn/tx/0x2e7c4a9b8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1',
      scanRecords: {
        totalQueryCount: 56,
        firstScanTime: '2025-10-01 16:42:08',
        lastScanTime: '2025-12-08 09:15:33',
        records: [
          { time: '2025-10-01 16:42:08', type: 'first', location: '湖北武汉', ip: '111.47.xx.xx' },
          { time: '2025-10-20 13:28:15', type: 'repeat', location: '四川成都', ip: '171.221.xx.xx' },
          { time: '2025-11-15 19:05:44', type: 'repeat', location: '江苏南京', ip: '49.65.xx.xx' },
          { time: '2025-12-08 09:15:33', type: 'repeat', location: '福建厦门', ip: '120.42.xx.xx' }
        ]
      },
      tsaCertificate: {
        issuer: '中国电子认证服务产业联盟',
        tsServer: 'TSA-2025-CN-JUDICIAL-001',
        certSerial: 'TSA-CERT-2025-0930-002',
        algorithm: 'SM2',
        timestamp: '2025-09-30 10:15:42.891+08:00',
        accuracy: '0.001s',
        tsTokenHash: 'b8c4d2e0f6a7b3c9d1e5f7a9b1c3d5e7f9a0b2c4d6e8f0a2b4c6d8e0f2a4b6',
        evidenceHash: 'f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0',
        legalBasis: '《中华人民共和国电子签名法》第十三条',
        validityPeriod: '2025-01-01 至 2030-12-31',
        verifyUrl: 'https://tsa.cfca.com.cn/verify?sn=TSA-CERT-2025-0930-002'
      }
    },

    // 产地地理信息（地图模块）
    locationMap: {
      title: '产地地理信息',
      centerLat: 27.9879,
      centerLng: 118.0935,
      scale: 10,
      markers: [
        {
          id: 1,
          type: 'teaGarden',
          name: '武夷山生态茶园',
          lat: 27.9512,
          lng: 118.1088,
          icon: '🍃',
          color: '#2E8B57',
          width: 40,
          height: 40,
          callout: {
            title: '武夷山生态茶园（B区',
            content: '海拔650米优质茶园，120年以上茶树1200余株，绿色食品认证基地',
            images: [
              'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=eco%20tea%20garden%20wuyi%20mountain%20green%20tea%20terrace&image_size=square'
            ]
          }
        },
        {
          id: 2,
          type: 'osmanthusGarden',
          name: '咸宁银桂种植园',
          lat: 29.8525,
          lng: 114.3321,
          icon: '🌸',
          color: '#C0C0C0',
          width: 40,
          height: 40,
          callout: {
            title: '咸宁银桂种植园',
            content: '20年树龄银桂2500余株，清雅淡香，适合窨制中高端桂花茶',
            images: [
              'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=silver%20osmanthus%20garden%20white%20flowers%20autumn%20gentle&image_size=square'
            ]
          }
        },
        {
          id: 3,
          type: 'factory',
          name: '桂花茶加工二厂',
          lat: 30.5828,
          lng: 114.3255,
          icon: '🏭',
          color: '#1890FF',
          width: 40,
          height: 40,
          callout: {
            title: '桂花茶加工二厂',
            content: '自动化窨制车间，专注银桂系列产品专线生产',
            images: [
              'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20tea%20factory%20automated%20workshop%20clean&image_size=square'
            ]
          }
        }
      ]
    },

    scenicPhotos: {
      title: '产地实景',
      autoPlay: true,
      interval: 4000,
      photos: [
        {
          url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=wuyi%20mountain%20tea%20garden%20morning%20mist%20terraces&image_size=landscape_16_9',
          caption: '武夷山B区茶园 · 晨曦',
          type: 'aerial'
        },
        {
          url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=silver%20white%20osmanthus%20flowering%20tree%20closeup%20delicate&image_size=landscape_16_9',
          caption: '咸宁银桂 · 清雅绽放',
          type: 'detail'
        },
        {
          url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=tea%20processing%20workshop%20automated%20tea%20scenting&image_size=landscape_16_9',
          caption: '自动化窨制车间',
          type: 'people'
        }
      ]
    },

    treeStory: {
      title: '120年茶树的故事',
      teaTree: {
        plantYear: '清光绪三十一年（1905年）',
        age: 120,
        height: '3.8米',
        crown: '3.2米',
        location: '武夷山B区・天游峰南麓',
        story: '此茶树种于清末光绪年间，至今已逾百年。地处天游峰南麓，土壤肥沃，昼夜温差大，所产茶叶口感醇厚甘甜，为银桂系列茶底原料。',
        historicalRecords: [
          { year: '1905', event: '茶农栽植，选址于天游峰南麓', type: 'plant' },
          { year: '1965', event: '茶园集体化经营，产量提升', type: 'expand' },
          { year: '2012', event: '列入武夷山二级保护古茶树', type: 'protect' }
        ],
        maintenanceRecords: [
          { date: '2025-03-12', type: '春季养护', operator: '陈师傅', content: '修剪、施肥、病虫害检查', photos: 2 },
          { date: '2025-04-22', type: '明前采摘', operator: '红星村采茶组', content: '采摘鲜叶8.5公斤', photos: 5 }
        ]
      },
      osmanthusTree: {
        plantYear: '2005年',
        age: 20,
        height: '4.2米',
        crown: '3.5米',
        location: '咸安区桂花镇・二组种植园',
        story: '2005年咸宁桂花产业发展时期大规模种植，是新一代银桂代表植株，花型饱满，香气清雅。',
        maintenanceRecords: [
          { date: '2025-09-12', type: '银桂采摘', operator: '王氏采摘队', content: '采摘鲜桂花38.2公斤，品质优良' }
        ]
      }
    },

    pickWeather: {
      teaPick: {
        date: '2025年4月22日',
        location: '福建武夷山',
        weather: '多云',
        weatherIcon: '☁️',
        temperature: '15℃~22℃',
        avgTemp: 18,
        humidity: '75%',
        avgHumidity: 75,
        wind: '南风 2级',
        airQuality: '优（AQI: 42）',
        sunrise: '05:40',
        sunset: '18:38',
        note: '多云天气，光照柔和，茶叶内含物积累均匀，适合制作口感清雅型茶底。'
      },
      osmanthusPick: {
        date: '2025年9月12日',
        location: '湖北咸宁',
        weather: '多云转晴',
        weatherIcon: '⛅',
        temperature: '17℃~25℃',
        avgTemp: 21,
        humidity: '70%',
        avgHumidity: 70,
        wind: '东风 2级',
        airQuality: '优（AQI: 36）',
        sunrise: '06:10',
        sunset: '18:18',
        note: '多云间晴，适宜银桂采摘，花朵完整度98%以上。'
      }
    },

    // 配图（用于懒加载）
    images: {
      originImage: 'https://picsum.photos/id/1015/750/400',
      teaOriginImage: 'https://picsum.photos/id/1036/750/400',
      osmanthusOriginImage: 'https://picsum.photos/id/1018/750/400',
      processImage: 'https://picsum.photos/id/1039/750/400',
      certImage: 'https://picsum.photos/id/1025/750/400'
    },

    // 出口合规溯源信息
    exportInfo: {
      exportBatchNo: 'EXP-GH202504-US-002',
      hsCode: '0902.10.00',
      hsCodeDescription: 'Green tea (not fermented), in immediate packings of a net content not exceeding 3kg',
      countryOfOrigin: 'China',
      originRegion: 'Xianning, Hubei Province',

      certificateOfOrigin: {
        certNo: 'CO-CN-HUB-2025-09988',
        issuingAuthority: 'China Council for the Promotion of International Trade',
        issueDate: '2025-10-02',
        validUntil: '2026-10-01',
        certType: 'General Certificate of Origin',
        verifyUrl: 'https://www.ccpit.org/verify/co',
        status: 'valid'
      },

      inspectionQuarantine: {
        certNo: 'IQ-CN-HUB-2025-12456',
        issuingAuthority: 'Wuhan Customs',
        issueDate: '2025-09-28',
        validUntil: '2026-03-27',
        inspectionDate: '2025-09-27',
        result: 'Pass',
        quarantineResult: 'Pass',
        standard: 'GB 2763-2021; US FDA Food Safety Modernization Act',
        verifyUrl: 'https://www.customs.gov.cn/iq/verify',
        items: [
          { item: 'Pesticide Residue', result: 'Pass', standard: 'US EPA Tolerances' },
          { item: 'Microbiological', result: 'Pass', standard: 'FDA BAM' },
          { item: 'Heavy Metals', result: 'Pass', standard: 'GB 2762-2022' },
          { item: 'Additives', result: 'Not Detected', standard: 'GB 2760-2014' }
        ]
      },

      multilingualLabels: {
        availableLanguages: ['zh-CN', 'en-US'],
        labels: {
          'zh-CN': {
            productName: '银桂花茶',
            ingredients: '茶叶、桂花',
            netContent: '100g',
            shelfLife: '12个月',
            storageMethod: '阴凉干燥处，避免阳光直射',
            origin: '中国湖北咸宁',
            manufacturer: '一茶一品（咸宁）桂花茶有限公司',
            address: '湖北省咸宁市桂花镇工业园88号'
          },
          'en-US': {
            productName: 'Silver Osmanthus Tea',
            ingredients: 'Tea Leaves, Osmanthus Flowers',
            netContent: '100g / 3.53 oz',
            shelfLife: '12 months',
            storageMethod: 'Store in a cool, dry place. Avoid direct sunlight.',
            origin: 'Xianning, Hubei, China',
            manufacturer: 'YiChaYiPin (Xianning) Osmanthus Tea Co., Ltd.',
            address: 'No.88 Guihua Town Industrial Park, Xianning, Hubei, China'
          }
        }
      },

      shipping: {
        method: 'ocean',
        methodLabel: 'Ocean Freight',
        containerNo: 'MSKU9876543',
        containerType: '40HQ',
        vesselName: 'MAERSK EMDEN',
        voyageNo: '2508W',
        billOfLading: 'MAEU250901234',
        portOfLoading: 'Ningbo Port',
        portOfDischarge: 'Los Angeles Port',
        etd: '2025-10-08',
        eta: '2025-10-28',
        actualDeparture: '2025-10-08',
        actualArrival: '2025-10-28',
        trackingUrl: 'https://www.maersk.com/tracking'
      },

      customsClearance: {
        status: 'cleared',
        statusLabel: '已清关',
        declarationNo: 'CUS-NB-2025-1009876',
        declareDate: '2025-10-05',
        customsOffice: '宁波海关',
        importCountry: 'United States',
        importCustoms: 'CBP Los Angeles',
        tariffCode: '0902.10.00',
        dutyRate: '2.3%',
        importValue: 'USD 35,000.00',
        taxPaid: 'USD 805.00',
        clearanceDate: '2025-10-30',
        inspectionRequired: false,
        inspectionStatus: 'passed',
        remarks: 'FDA抽样检测通过，已放行'
      },

      overseasDistributor: {
        name: 'Golden Leaf Tea Importers Inc.',
        country: 'United States',
        region: 'California, Los Angeles',
        address: '12345 Valley Blvd, El Monte, CA 91731, USA',
        contactPerson: 'Michael Chen',
        contactEmail: 'michael@goldenleatea.com',
        contactPhone: '+1-626-555-0123',
        licenseNo: 'US-FDA-FOOD-2025-10234',
        authorizedDate: '2025-02-20',
        authorizedProducts: ['Silver Osmanthus Tea', 'Golden Osmanthus Tea'],
        level: 'Exclusive Distributor',
        verifyUrl: 'https://www.goldenleatea.com/auth'
      },

      exportBlockchain: {
        chainName: 'Cross-Border Trade Chain',
        chainId: 'cross-border-trade-001',
        txHash: '0x5b8e6c1d9f7a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c',
        txHashShort: '0x5b8e6c...f1a0b9c',
        timestamp: '2025-10-02 14:20:00',
        verifyStatus: 'Verified',
        onChainFields: [
          { key: 'exportBatchNo', label: 'Export Batch No.', value: 'EXP-GH202504-US-002', onChain: true },
          { key: 'hsCode', label: 'HS Code', value: '0902.10.00', onChain: true },
          { key: 'coCertNo', label: 'CO Cert No.', value: 'CO-CN-HUB-2025-09988', onChain: true },
          { key: 'iqCertNo', label: 'IQ Cert No.', value: 'IQ-CN-HUB-2025-12456', onChain: true },
          { key: 'containerNo', label: 'Container No.', value: 'MSKU9876543', onChain: true },
          { key: 'blNo', label: 'B/L No.', value: 'MAEU250901234', onChain: true }
        ],
        blockExplorerUrl: 'https://cross-border.tracechain.cn/tx/0x5b8e6c1d9f7a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c'
      },

      viewMode: 'export',
      targetMarkets: ['US', 'CA', 'EU']
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
      thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20golden%20osmanthus%20tea%20gift%20box%20premium%20packaging&image_size=square',
      shelfLife: {
        productionDate: '2025-09-25',
        bestBeforeDate: '2026-09-25',
        totalDays: 365,
        bestTasteStartDays: 7,
        bestTasteEndDays: 270,
        storageCondition: '阴凉干燥处，避免阳光直射，温度≤25℃，湿度≤65%',
        storageTips: ['礼盒装开封后请将茶叶转移至密封罐', '建议6个月内饮用完毕', '避免与异味物品放在一起']
      }
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
      chainId: 'trace-chain-mainnet-01',
      blockHeight: 1892348,
      txHash: '0x9a4b2c3d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3',
      txHashShort: '0x9a4b2c...d8e3f2',
      timestamp: '2025-09-25 14:35:22',
      verifyStatus: '已验证',
      contractAddress: '0x1234abcd5678ef90abcdef1234567890abcdef12',
      nodeCount: 21,
      consensusType: 'PBFT',
      onChainFields: [
        { key: 'batchNo', label: '批次号', value: 'GH202503', onChain: true },
        { key: 'testReport', label: '检测报告编号', value: 'NTQC-2025-09877', onChain: true },
        { key: 'productionTime', label: '出厂时间', value: '2025年9月25日', onChain: true },
        { key: 'teaTreeAge', label: '茶树龄', value: '180年', onChain: true },
        { key: 'osmanthusVariety', label: '桂花品种', value: '金桂', onChain: true },
        { key: 'scentingTimes', label: '窨制次数', value: '6次', onChain: true },
        { key: 'greenCert', label: '绿色认证', value: '有机产品认证', onChain: true }
      ],
      blockExplorerUrl: 'https://explorer.tracechain.cn/tx/0x9a4b2c3d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3',
      scanRecords: {
        totalQueryCount: 89,
        firstScanTime: '2025-09-26 10:22:15',
        lastScanTime: '2025-12-12 14:38:09',
        records: [
          { time: '2025-09-26 10:22:15', type: 'first', location: '福建福州', ip: '117.26.xx.xx' },
          { time: '2025-10-08 16:45:30', type: 'repeat', location: '上海黄浦', ip: '180.168.xx.xx' },
          { time: '2025-11-20 08:12:55', type: 'repeat', location: '北京海淀', ip: '124.65.xx.xx' }
        ]
      },
      tsaCertificate: {
        issuer: '中国电子认证服务产业联盟',
        tsServer: 'TSA-2025-CN-JUDICIAL-001',
        certSerial: 'TSA-CERT-2025-0925-003',
        algorithm: 'SM2',
        timestamp: '2025-09-25 14:35:22.234+08:00',
        accuracy: '0.001s',
        tsTokenHash: 'c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d5',
        evidenceHash: 'd5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7',
        legalBasis: '《中华人民共和国电子签名法》第十三条',
        validityPeriod: '2025-01-01 至 2030-12-31',
        verifyUrl: 'https://tsa.cfca.com.cn/verify?sn=TSA-CERT-2025-0925-003'
      }
    },

    // 产地与故事数据（后续通过引用复用 G001）
    locationMap: null,
    scenicPhotos: null,
    treeStory: null,
    pickWeather: null,

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
      thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=osmanthus%20tea%20portable%20sachet%20packaging%20convenient&image_size=square',
      shelfLife: {
        productionDate: '2025-09-25',
        bestBeforeDate: '2026-09-25',
        totalDays: 365,
        bestTasteStartDays: 7,
        bestTasteEndDays: 270,
        storageCondition: '阴凉干燥处，避免阳光直射，温度≤25℃，湿度≤65%',
        storageTips: ['独立小包装，开封后立即冲泡', '随身携带方便', '避免高温暴晒']
      }
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
      chainId: 'trace-chain-mainnet-01',
      blockHeight: 1892349,
      txHash: '0x1b3d5f7a9c1e3f5a7b9c1d3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5',
      txHashShort: '0x1b3d5f...a9c7e4',
      timestamp: '2025-09-25 14:38:45',
      verifyStatus: '已验证',
      contractAddress: '0x1234abcd5678ef90abcdef1234567890abcdef12',
      nodeCount: 21,
      consensusType: 'PBFT',
      onChainFields: [
        { key: 'batchNo', label: '批次号', value: 'GH202503', onChain: true },
        { key: 'testReport', label: '检测报告编号', value: 'NTQC-2025-09878', onChain: true },
        { key: 'productionTime', label: '出厂时间', value: '2025年9月25日', onChain: true },
        { key: 'teaTreeAge', label: '茶树龄', value: '150年', onChain: true },
        { key: 'osmanthusVariety', label: '桂花品种', value: '金桂', onChain: true },
        { key: 'scentingTimes', label: '窨制次数', value: '4次', onChain: true },
        { key: 'greenCert', label: '绿色认证', value: '有机产品认证', onChain: true }
      ],
      blockExplorerUrl: 'https://explorer.tracechain.cn/tx/0x1b3d5f7a9c1e3f5a7b9c1d3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5',
      scanRecords: {
        totalQueryCount: 34,
        firstScanTime: '2025-09-27 08:45:12',
        lastScanTime: '2025-12-05 20:18:33',
        records: [
          { time: '2025-09-27 08:45:12', type: 'first', location: '广东广州', ip: '113.108.xx.xx' },
          { time: '2025-10-15 14:22:08', type: 'repeat', location: '湖南长沙', ip: '175.6.xx.xx' },
          { time: '2025-12-05 20:18:33', type: 'repeat', location: '重庆渝北', ip: '183.67.xx.xx' }
        ]
      },
      tsaCertificate: {
        issuer: '中国电子认证服务产业联盟',
        tsServer: 'TSA-2025-CN-JUDICIAL-001',
        certSerial: 'TSA-CERT-2025-0925-004',
        algorithm: 'SM2',
        timestamp: '2025-09-25 14:38:45.678+08:00',
        accuracy: '0.001s',
        tsTokenHash: 'd1e3f5a7b9c1d3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3',
        evidenceHash: 'e3f5a7b9c1d3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5',
        legalBasis: '《中华人民共和国电子签名法》第十三条',
        validityPeriod: '2025-01-01 至 2030-12-31',
        verifyUrl: 'https://tsa.cfca.com.cn/verify?sn=TSA-CERT-2025-0925-004'
      }
    },

    // 产地与故事数据（后续通过引用复用 G001）
    locationMap: null,
    scenicPhotos: null,
    treeStory: null,
    pickWeather: null,

    // 配图（用于懒加载）
    images: {
      originImage: 'https://picsum.photos/id/1039/750/400',
      teaOriginImage: 'https://picsum.photos/id/1015/750/400',
      osmanthusOriginImage: 'https://picsum.photos/id/1036/750/400',
      processImage: 'https://picsum.photos/id/1044/750/400',
      certImage: 'https://picsum.photos/id/1025/750/400'
    }
  },

  /**
   * 溯源ID: G005
   * 品种: 丹桂
   * 特点: 160年茶树龄，丹桂新品种，花色橙红馥郁
   */
  'G005': {
    basicInfo: {
      traceId: 'G005',
      batchNo: 'GH202505',
      pickTime: '2025年9月18日',
      productionTime: '2025年10月5日',
      productName: '丹桂窨花茶（典藏版）',
      specification: '120g/礼盒',
      thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=premium%20red%20orange%20dan%20gui%20osmanthus%20tea%20luxury%20gift%20box&image_size=square',
      shelfLife: {
        productionDate: '2025-10-05',
        bestBeforeDate: '2026-10-05',
        totalDays: 365,
        bestTasteStartDays: 10,
        bestTasteEndDays: 240,
        storageCondition: '阴凉干燥处，避免阳光直射，温度≤25℃，湿度≤65%',
        storageTips: ['典藏版请妥善保存', '建议密封冷藏（5℃-10℃）以延长最佳口感', '避免温度剧烈波动']
      }
    },

    treeAge: {
      teaTreeAge: 160,
      osmanthusTreeAge: 35,
      teaTreeLocation: '福建省武夷山',
      osmanthusTreeLocation: '湖北省咸宁市丹桂种植园'
    },

    osmanthusInfo: {
      variety: '丹桂',
      origin: '湖北省咸宁市丹桂示范基地',
      pickTime: '2025年9月15日',
      color: '橙红色',
      fragrance: '馥郁浓烈、甜香四溢'
    },

    scentingProcess: {
      scentingTimes: 6,
      scentingDuration: 4.5,
      temperature: 31,
      humidity: 70,
      ratio: '1:4',
      workshopCleanliness: 'Class 10万级',
      scentingRecords: [
        { round: 1, duration: 5, temperature: 31, operator: '陈老师傅', timestamp: '2025-09-20 07:30:00', humidity: 70, note: '头窨，丹桂馥郁花香初绽' },
        { round: 2, duration: 5, temperature: 30, operator: '陈老师傅', timestamp: '2025-09-21 08:00:00', humidity: 69, note: '二窨，甜香层叠' },
        { round: 3, duration: 4.5, temperature: 31, operator: '陈老师傅', timestamp: '2025-09-22 08:30:00', humidity: 71, note: '三窨，花香入茶骨' },
        { round: 4, duration: 4.5, temperature: 29, operator: '王师傅', timestamp: '2025-09-23 09:00:00', humidity: 68, note: '四窨，层次丰富' },
        { round: 5, duration: 4, temperature: 28, operator: '陈老师傅', timestamp: '2025-09-24 08:15:00', humidity: 70, note: '五窨，橙香四溢' },
        { round: 6, duration: 3.5, temperature: 27, operator: '王师傅', timestamp: '2025-09-25 10:30:00', humidity: 72, note: '六窨，提香收尾，典藏臻品' }
      ],
      processSteps: [
        { step: 1, name: '备料', icon: '📦', desc: '160年古树茶芽+丹桂精品鲜花', mediaType: 'image', mediaUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=premium%20dan%20gui%20red%20osmanthus%20tea%20raw%20materials%20preparation&image_size=square' },
        { step: 2, name: '拌花', icon: '🌺', desc: '按1:4高配比均匀拌合丹桂与茶叶', mediaType: 'image', mediaUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=mixing%20red%20orange%20dan%20gui%20osmanthus%20with%20tea%20leaves%20artisan&image_size=square' },
        { step: 3, name: '窨制', icon: '🫖', desc: '恒温恒湿六次窨制', mediaType: 'image', mediaUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=tea%20scenting%20chamber%20six%20times%20scenting%20dan%20gui%20tea&image_size=square' },
        { step: 4, name: '通花', icon: '💨', desc: '适时通风散热，保持活性', mediaType: 'image', mediaUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=ventilating%20premium%20dan%20gui%20tea%20during%20scenting%20process&image_size=square' },
        { step: 5, name: '起花', icon: '🧹', desc: '精细筛分分离茶叶与丹桂残渣', mediaType: 'image', mediaUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=fine%20sieving%20separating%20red%20osmanthus%20from%20tea%20leaves%20premium&image_size=square' },
        { step: 6, name: '干燥', icon: '☀️', desc: '低温烘干锁住橙红甜香', mediaType: 'image', mediaUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=low%20temperature%20drying%20premium%20dan%20gui%20tea%20preserving%20fragrance&image_size=square' }
      ]
    },

    greenTrace: {
      ecoPlanting: {
        title: '生态种植',
        icon: '🌱',
        records: ['无化肥农药种植', '自然雨水灌溉', '有机肥施肥', '丹桂母树保护培育'],
        certification: '有机产品认证'
      },
      ecoPacking: {
        title: '环保包装',
        icon: '📦',
        records: ['金丝楠木礼盒', '丝绸内衬', '植物大豆油墨印刷'],
        certification: '绿色包装认证'
      },
      ecoLogistics: {
        title: '绿色物流',
        icon: '🚚',
        records: ['冷链保鲜运输', '可循环快递箱', '碳中和物流合作伙伴'],
        carbonReduction: '减少碳排放约18%'
      }
    },

    pesticideTest: {
      institution: '国家茶叶质量监督检验中心',
      testDate: '2025年9月28日',
      reportNo: 'NTQC-2025-09999',
      standard: 'GB 2763-2021',
      comparisonTip: '各项农残数值远低于国标 GB 2763-2021 限值，安全放心',
      verifyUrl: 'https://www.ntqc.org.cn/verify',
      hasAbnormal: false,
      teaTests: [
        { item: '六六六', value: 0.004, displayValue: '<0.01', unit: 'mg/kg', limit: 0.1, status: '合格', description: '' },
        { item: '滴滴涕', value: 0.006, displayValue: '<0.01', unit: 'mg/kg', limit: 0.2, status: '合格', description: '' }
      ],
      osmanthusTests: [
        { item: '联苯菊酯', value: 0.008, displayValue: '<0.02', unit: 'mg/kg', limit: 5.0, status: '合格', description: '' }
      ],
      historyReports: [
        {
          reportNo: 'NTQC-2025-09999',
          testDate: '2025年9月28日',
          institution: '国家茶叶质量监督检验中心',
          status: '合格',
          statusLevel: '优秀',
          batchNo: 'GH202505'
        }
      ]
    },

    brewingGuide: {
      waterTemp: '85℃-90℃',
      brewingTime: '3分钟',
      rebrewTimes: '5-6次',
      waterType: '纯净水或山泉水',
      teawareType: '白瓷盖碗或紫砂壶',
      tips: [
        '温杯烫盏，激发茶香',
        '水温不宜过高，保留丹桂甜香',
        '典藏臻品，每泡韵味各异'
      ]
    },

    blockchainInfo: {
      chainName: '溯源链',
      chainId: 'trace-chain-mainnet-01',
      blockHeight: 1896001,
      txHash: '0x4d2c7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7',
      txHashShort: '0x4d2c7e...b1a8f9',
      timestamp: '2025-10-05 15:20:36',
      verifyStatus: '已验证',
      contractAddress: '0x1234abcd5678ef90abcdef1234567890abcdef12',
      nodeCount: 21,
      consensusType: 'PBFT',
      onChainFields: [
        { key: 'batchNo', label: '批次号', value: 'GH202505', onChain: true },
        { key: 'testReport', label: '检测报告编号', value: 'NTQC-2025-09999', onChain: true },
        { key: 'productionTime', label: '出厂时间', value: '2025年10月5日', onChain: true },
        { key: 'teaTreeAge', label: '茶树龄', value: '160年', onChain: true },
        { key: 'osmanthusVariety', label: '桂花品种', value: '丹桂', onChain: true },
        { key: 'scentingTimes', label: '窨制次数', value: '6次', onChain: true },
        { key: 'greenCert', label: '绿色认证', value: '有机产品认证', onChain: true }
      ],
      blockExplorerUrl: 'https://explorer.tracechain.cn/tx/0x4d2c7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7',
      scanRecords: {
        totalQueryCount: 15,
        firstScanTime: '2025-10-06 11:30:22',
        lastScanTime: '2025-12-14 16:45:18',
        records: [
          { time: '2025-10-06 11:30:22', type: 'first', location: '北京西城', ip: '106.39.xx.xx' },
          { time: '2025-11-08 19:55:41', type: 'repeat', location: '浙江杭州', ip: '115.236.xx.xx' },
          { time: '2025-12-14 16:45:18', type: 'repeat', location: '广东深圳', ip: '183.14.xx.xx' }
        ]
      },
      tsaCertificate: {
        issuer: '中国电子认证服务产业联盟',
        tsServer: 'TSA-2025-CN-JUDICIAL-001',
        certSerial: 'TSA-CERT-2025-1005-005',
        algorithm: 'SM2',
        timestamp: '2025-10-05 15:20:36.123+08:00',
        accuracy: '0.001s',
        tsTokenHash: 'f5a7b9c1d3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9',
        evidenceHash: 'a7b9c1d3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1',
        legalBasis: '《中华人民共和国电子签名法》第十三条',
        validityPeriod: '2025-01-01 至 2030-12-31',
        verifyUrl: 'https://tsa.cfca.com.cn/verify?sn=TSA-CERT-2025-1005-005'
      }
    },

    locationMap: {
      title: '产地地理信息',
      centerLat: 29.8408,
      centerLng: 114.3162,
      scale: 10,
      markers: [
        {
          id: 1,
          type: 'teaGarden',
          name: '武夷山丹桂定制茶园',
          lat: 27.9650,
          lng: 118.0870,
          icon: '🍃',
          color: '#2E8B57',
          width: 40,
          height: 40,
          callout: {
            title: '武夷山丹桂定制茶园',
            content: '海拔750米高山云雾茶园，160年以上古茶树300余株，丹桂系列专属茶底基地',
            images: [
              'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=ancient%20tea%20garden%20custom%20for%20dan%20gui%20osmanthus%20wuyi%20mountain&image_size=square'
            ]
          }
        },
        {
          id: 2,
          type: 'osmanthusGarden',
          name: '咸宁丹桂母树园',
          lat: 29.8650,
          lng: 114.3450,
          icon: '🌺',
          color: '#CD5C5C',
          width: 40,
          height: 40,
          callout: {
            title: '咸宁丹桂母树园',
            content: '中国丹桂之乡核心母株基地，30年以上丹桂古树1500余株，省级名贵花木保护区',
            images: [
              'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=red%20orange%20dan%20gui%20osmanthus%20mother%20tree%20garden%20xianning%20autumn&image_size=square',
              'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=close%20up%20vibrant%20red%20orange%20dan%20gui%20osmanthus%20flowers%20blooming&image_size=square'
            ]
          }
        },
        {
          id: 3,
          type: 'factory',
          name: '丹桂窨制非遗工坊',
          lat: 30.5750,
          lng: 114.3155,
          icon: '🏭',
          color: '#1890FF',
          width: 40,
          height: 40,
          callout: {
            title: '丹桂窨制非遗工坊',
            content: '丹桂品种专属窨制工坊，六窨提香技艺传承，国家级非遗传人主持',
            images: [
              'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=intangible%20cultural%20heritage%20tea%20workshop%20dan%20gui%20osmanthus%20traditional&image_size=square'
            ]
          }
        }
      ]
    },

    scenicPhotos: {
      title: '丹桂产地实景典藏',
      autoPlay: true,
      interval: 3800,
      photos: [
        {
          url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=aerial%20drone%20view%20xianning%20red%20orange%20dan%20gui%20osmanthus%20plantation%20autumn%20sunset&image_size=landscape_16_9',
          caption: '咸宁丹桂基地航拍 · 秋日丹红似火',
          type: 'aerial'
        },
        {
          url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=close%20up%20160%20year%20old%20ancient%20tea%20tree%20mountain%20sunlight%20premium&image_size=landscape_16_9',
          caption: '160年古茶树 · 岩骨生茶',
          type: 'detail'
        },
        {
          url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=macro%20photo%20vibrant%20red%20orange%20dan%20gui%20osmanthus%20flowers%20dewdrops%20autumn&image_size=landscape_16_9',
          caption: '丹桂特写 · 橙红露珠欲滴',
          type: 'detail'
        },
        {
          url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=master%20artisan%20inspecting%20dan%20gui%20osmanthus%20tea%20six%20times%20scenting%20traditional%20workshop&image_size=landscape_16_9',
          caption: '非遗传承人 · 六窨工艺',
          type: 'people'
        }
      ]
    },

    treeStory: {
      title: '160年茶树与丹桂母树的故事',
      teaTree: {
        plantYear: '清道光十五年（1835年）',
        age: 190,
        height: '4.6米',
        crown: '4.2米',
        location: '武夷山核心区・隐屏峰北麓',
        story: '此株古茶树种于清道光年间，历经近两百年风云。隐屏峰北麓独特的丹霞微气候，赋予其独特的岩韵蜜香。为丹桂系列专属定制茶底，仅在每年明前限量采摘。',
        historicalRecords: [
          { year: '1835', event: '武夷山隐屏峰道士栽植，供道观饮用', type: 'plant' },
          { year: '1915', event: '所制茶叶参加巴拿马万国博览会，获荣誉奖章', type: 'expand' },
          { year: '1958', event: '收归国有，建立茶叶试验站保护基地', type: 'protect' },
          { year: '2022', event: '选定为丹桂窨花茶专属茶底供应树', type: 'digital' }
        ],
        maintenanceRecords: [
          { date: '2025-03-18', type: '春季养护', operator: '李师傅（特级制茶师）', content: '精细修剪、施加有机饼肥、土壤酸碱度检测', photos: 4 },
          { date: '2025-04-18', type: '明前采摘', operator: '李氏采茶组（8人）', content: '仅采一芽一叶初展，得鲜叶7.2公斤', photos: 12 },
          { date: '2025-09-08', type: '秋季养护', operator: '武夷山古茶树保护站', content: '培土护根、树干涂白、生物防虫', photos: 5 }
        ]
      },
      osmanthusTree: {
        plantYear: '1990年',
        age: 35,
        height: '5.6米',
        crown: '4.8米',
        location: '咸安区桂花镇・丹桂母树园一号株',
        story: '此株丹桂由咸宁桂花种植世家王氏从实生苗中选育，花色橙红如朱砂，香气浓郁甜蜜，是丹桂品种中的"状元红"优系母株。年产量仅约50公斤精品鲜花，专供高端窨茶使用。',
        maintenanceRecords: [
          { date: '2025-02-15', type: '整形修剪', operator: '王老先生（丹桂育种专家）', content: '疏枝整形、促花芽分化、疏花提高品质' },
          { date: '2025-08-10', type: '花期精细管理', operator: '丹桂基地技术组', content: '控水控肥、病虫害监测、记录花芽分化进度' },
          { date: '2025-09-15', type: '丹桂采摘', operator: '王氏精选采摘队', content: '手工精选初开盛花，共得鲜桂花46.5公斤' }
        ]
      }
    },

    pickWeather: {
      teaPick: {
        date: '2025年4月18日',
        location: '福建武夷山',
        weather: '晴',
        weatherIcon: '☀️',
        temperature: '14℃~23℃',
        avgTemp: 18,
        humidity: '65%',
        avgHumidity: 65,
        wind: '东南风 1-2级',
        airQuality: '优（AQI: 32）',
        sunrise: '05:38',
        sunset: '18:40',
        note: '清明后第三天，晴空万里，昼夜温差达9℃，茶叶氨基酸与茶多酚比例完美，为丹桂系列定制茶底绝佳采摘日。'
      },
      osmanthusPick: {
        date: '2025年9月15日',
        location: '湖北咸宁',
        weather: '晴',
        weatherIcon: '☀️',
        temperature: '16℃~25℃',
        avgTemp: 20,
        humidity: '68%',
        avgHumidity: 68,
        wind: '北风 1级',
        airQuality: '优（AQI: 28）',
        sunrise: '06:05',
        sunset: '18:15',
        note: '连续四日晴朗，丹桂花色达到最佳橙红度；北风微风，花朵干燥完整无霉变；为丹桂窨茶稀有顶级采摘条件。'
      }
    },

    images: {
      originImage: 'https://picsum.photos/id/1040/750/400',
      teaOriginImage: 'https://picsum.photos/id/1019/750/400',
      osmanthusOriginImage: 'https://picsum.photos/id/1027/750/400',
      processImage: 'https://picsum.photos/id/1041/750/400',
      certImage: 'https://picsum.photos/id/1025/750/400'
    }
  }
};

// 数据复用：G003/G004 与 G001 为同一产地批次，复用产地地理与故事数据
(function() {
  var g001 = mockTraceData['G001'];
  if (!g001) return;
  var g003 = mockTraceData['G003'];
  var g004 = mockTraceData['G004'];
  if (g003) {
    g003.locationMap = g001.locationMap;
    g003.scenicPhotos = g001.scenicPhotos;
    g003.treeStory = g001.treeStory;
    g003.pickWeather = g001.pickWeather;
  }
  if (g004) {
    g004.locationMap = g001.locationMap;
    g004.scenicPhotos = g001.scenicPhotos;
    g004.treeStory = g001.treeStory;
    g004.pickWeather = g001.pickWeather;
  }
})();

// ==================== 数据版本与变更历史 ====================

var traceVersionHistory = {
  'G001': {
    currentVersion: '2.0.0',
    lastUpdatedAt: '2025年12月15日 10:30:00',
    versions: [
      {
        version: '2.0.0',
        updatedAt: '2025年12月15日 10:30:00',
        updatedBy: '检测数据同步系统',
        summary: '农残检测数据更新，联苯菊酯检测精度提升',
        txHash: '0x8f9a3b7c4d5e6f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5',
        txHashShort: '0x8f9a3b...c7d2e1',
        blockHeight: 1956789,
        timestamp: '2025-12-15 10:30:00',
        reportNo: 'NTQC-2025-09876',
        fieldChanges: [
          {
            fieldPath: 'pesticideTest.osmanthusTests[0].displayValue',
            fieldLabel: '联苯菊酯检测值',
            category: '农残检测',
            oldValue: '<0.02',
            newValue: '<0.01',
            unit: 'mg/kg',
            changeType: 'update'
          },
          {
            fieldPath: 'pesticideTest.osmanthusTests[0].value',
            fieldLabel: '联苯菊酯检测数值',
            category: '农残检测',
            oldValue: 0.01,
            newValue: 0.008,
            unit: 'mg/kg',
            changeType: 'update'
          },
          {
            fieldPath: 'pesticideTest.testDate',
            fieldLabel: '检测日期',
            category: '农残检测',
            oldValue: '2025年9月20日',
            newValue: '2025年12月10日',
            unit: '',
            changeType: 'update'
          }
        ]
      },
      {
        version: '1.2.0',
        updatedAt: '2025年11月5日 14:20:00',
        updatedBy: '供应链管理系统',
        summary: '窨制工艺记录补充，新增第5次窨制备注信息',
        txHash: '0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
        txHashShort: '0xa1b2c3...f0a1b2',
        blockHeight: 1923456,
        timestamp: '2025-11-05 14:20:00',
        reportNo: 'NTQC-2025-09876',
        fieldChanges: [
          {
            fieldPath: 'scentingProcess.scentingRecords[4].note',
            fieldLabel: '第5次窨制备注',
            category: '窨制工艺',
            oldValue: '五窨，提香收尾',
            newValue: '五窨，提香收尾，香气绵密持久',
            unit: '',
            changeType: 'update'
          }
        ]
      },
      {
        version: '1.1.0',
        updatedAt: '2025年10月18日 09:15:00',
        updatedBy: '绿色溯源系统',
        summary: '新增绿色溯源碳足迹数据与回收指引',
        txHash: '0xc3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4',
        txHashShort: '0xc3d4e5...b2c3d4',
        blockHeight: 1899012,
        timestamp: '2025-10-18 09:15:00',
        reportNo: 'NTQC-2025-09876',
        fieldChanges: [
          {
            fieldPath: 'greenTrace',
            fieldLabel: '绿色溯源模块',
            category: '绿色溯源',
            oldValue: '基础数据',
            newValue: '完整数据（含碳足迹、回收指引）',
            unit: '',
            changeType: 'add'
          }
        ]
      },
      {
        version: '1.0.0',
        updatedAt: '2025年9月25日 14:32:18',
        updatedBy: '溯源数据中心',
        summary: '溯源数据首次上链发布',
        txHash: '0xe5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6',
        txHashShort: '0xe5f6a7...d4e5f6',
        blockHeight: 1892347,
        timestamp: '2025-09-25 14:32:18',
        reportNo: 'NTQC-2025-07654',
        fieldChanges: [
          {
            fieldPath: 'all',
            fieldLabel: '全部溯源数据',
            category: '基础信息',
            oldValue: '无',
            newValue: '首次发布',
            unit: '',
            changeType: 'add'
          }
        ]
      }
    ]
  },
  'G002': {
    currentVersion: '1.1.0',
    lastUpdatedAt: '2025年11月20日 16:45:00',
    versions: [
      {
        version: '1.1.0',
        updatedAt: '2025年11月20日 16:45:00',
        updatedBy: '检测数据同步系统',
        summary: '新增氯氰菊酯超标说明与风险提示',
        txHash: '0x2e7c4a9b8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1',
        txHashShort: '0x2e7c4a...f8b9d3',
        blockHeight: 1934567,
        timestamp: '2025-11-20 16:45:00',
        reportNo: 'HBAQ-2025-12345',
        fieldChanges: [
          {
            fieldPath: 'pesticideTest.teaTests[0].description',
            fieldLabel: '氯氰菊酯超标说明',
            category: '农残检测',
            oldValue: '',
            newValue: '超出国标限值27.5%，建议停止食用并联系供应商',
            unit: '',
            changeType: 'add'
          },
          {
            fieldPath: 'pesticideTest.hasAbnormal',
            fieldLabel: '异常检测标识',
            category: '农残检测',
            oldValue: false,
            newValue: true,
            unit: '',
            changeType: 'update'
          }
        ]
      },
      {
        version: '1.0.0',
        updatedAt: '2025年9月30日 10:15:42',
        updatedBy: '溯源数据中心',
        summary: '溯源数据首次上链发布',
        txHash: '0xf8b9d3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2',
        txHashShort: '0xf8b9d3...e0f1a2',
        blockHeight: 1895123,
        timestamp: '2025-09-30 10:15:42',
        reportNo: 'HBAQ-2025-09876',
        fieldChanges: [
          {
            fieldPath: 'all',
            fieldLabel: '全部溯源数据',
            category: '基础信息',
            oldValue: '无',
            newValue: '首次发布',
            unit: '',
            changeType: 'add'
          }
        ]
      }
    ]
  },
  'G003': {
    currentVersion: '1.0.0',
    lastUpdatedAt: '2025年9月25日 14:35:22',
    versions: [
      {
        version: '1.0.0',
        updatedAt: '2025年9月25日 14:35:22',
        updatedBy: '溯源数据中心',
        summary: '礼盒装溯源数据首次上链发布',
        txHash: '0x9a4b2c3d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3',
        txHashShort: '0x9a4b2c...d8e3f2',
        blockHeight: 1892348,
        timestamp: '2025-09-25 14:35:22',
        reportNo: 'NTQC-2025-09877',
        fieldChanges: [
          {
            fieldPath: 'all',
            fieldLabel: '全部溯源数据',
            category: '基础信息',
            oldValue: '无',
            newValue: '首次发布',
            unit: '',
            changeType: 'add'
          }
        ]
      }
    ]
  },
  'G004': {
    currentVersion: '1.0.0',
    lastUpdatedAt: '2025年9月25日 14:38:45',
    versions: [
      {
        version: '1.0.0',
        updatedAt: '2025年9月25日 14:38:45',
        updatedBy: '溯源数据中心',
        summary: '便携装溯源数据首次上链发布',
        txHash: '0x1b3d5f7a9c1e3f5a7b9c1d3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5',
        txHashShort: '0x1b3d5f...a9c7e4',
        blockHeight: 1892349,
        timestamp: '2025-09-25 14:38:45',
        reportNo: 'NTQC-2025-09878',
        fieldChanges: [
          {
            fieldPath: 'all',
            fieldLabel: '全部溯源数据',
            category: '基础信息',
            oldValue: '无',
            newValue: '首次发布',
            unit: '',
            changeType: 'add'
          }
        ]
      }
    ]
  },
  'G005': {
    currentVersion: '1.0.0',
    lastUpdatedAt: '2025年10月5日 15:20:36',
    versions: [
      {
        version: '1.0.0',
        updatedAt: '2025年10月5日 15:20:36',
        updatedBy: '溯源数据中心',
        summary: '丹桂典藏版溯源数据首次上链发布',
        txHash: '0x4d2c7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7',
        txHashShort: '0x4d2c7e...b1a8f9',
        blockHeight: 1896001,
        timestamp: '2025-10-05 15:20:36',
        reportNo: 'NTQC-2025-09999',
        fieldChanges: [
          {
            fieldPath: 'all',
            fieldLabel: '全部溯源数据',
            category: '基础信息',
            oldValue: '无',
            newValue: '首次发布',
            unit: '',
            changeType: 'add'
          }
        ]
      }
    ]
  }
};

(function() {
  for (var traceId in mockTraceData) {
    if (mockTraceData.hasOwnProperty(traceId) && traceVersionHistory[traceId]) {
      var verInfo = traceVersionHistory[traceId];
      mockTraceData[traceId].dataVersion = verInfo.currentVersion;
      mockTraceData[traceId].lastUpdatedAt = verInfo.lastUpdatedAt;
      mockTraceData[traceId].changeLog = verInfo.versions.slice(0, 1);
    }
  }
})();

function getTraceVersionHistory(traceId) {
  if (!traceId) return null;
  var id = traceId.toUpperCase().trim();
  return traceVersionHistory[id] || null;
}

function getTraceVersion(traceId, version) {
  var history = getTraceVersionHistory(traceId);
  if (!history) return null;
  if (!version) return {
    version: history.currentVersion,
    lastUpdatedAt: history.lastUpdatedAt
  };
  var ver = history.versions.find(function(v) { return v.version === version; });
  return ver || null;
}

function getVersionDiff(traceId, version1, version2) {
  var history = getTraceVersionHistory(traceId);
  if (!history) return null;

  var v1 = version1 ? history.versions.find(function(v) { return v.version === version1; }) : history.versions[0];
  var v2 = version2 ? history.versions.find(function(v) { return v.version === version2; }) : history.versions[history.versions.length - 1];

  if (!v1 || !v2) return null;

  var allChanges = [];
  var v1Idx = history.versions.indexOf(v1);
  var v2Idx = history.versions.indexOf(v2);
  var startIdx = Math.min(v1Idx, v2Idx);
  var endIdx = Math.max(v1Idx, v2Idx);

  for (var i = startIdx; i <= endIdx; i++) {
    var v = history.versions[i];
    if (v && v.fieldChanges) {
      allChanges = allChanges.concat(v.fieldChanges.map(function(fc) {
        return {
          ...fc,
          version: v.version,
          updatedAt: v.updatedAt
        };
      }));
    }
  }

  return {
    fromVersion: v2.version,
    toVersion: v1.version,
    changeCount: allChanges.length,
    changes: allChanges
  };
}

function getAllVersions(traceId) {
  var history = getTraceVersionHistory(traceId);
  if (!history) return [];
  return history.versions.slice();
}

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

  var normalizedReportNo = reportNo.trim().toUpperCase();
  var sampleRecord = null;
  var abnormalSamples = [];
  for (var stId in SAMPLE_TRACE_DATA) {
    var stData = SAMPLE_TRACE_DATA[stId];
    if (stData.reportNo === normalizedReportNo) {
      sampleRecord = stData;
    }
    for (var s = 0; s < stData.steps.length; s++) {
      var step = stData.steps[s];
      if (step.isAbnormal) {
        abnormalSamples.push({
          traceId: stData.traceId,
          sampleNo: stData.sampleNo,
          stepType: step.type,
          abnormalReason: step.abnormalReason
        });
      }
    }
  }

  for (var traceId in mockTraceData) {
    var data = mockTraceData[traceId];
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
        traceId: traceId,
        sampleNo: sampleRecord ? sampleRecord.sampleNo : '',
        sampleReportConsistent: sampleRecord ? sampleRecord.reportNo === normalizedReportNo : false,
        abnormalSamples: abnormalSamples
      };
    }

    if (data.pesticideTest && data.pesticideTest.historyReports) {
      var historyReport = null;
      for (var h = 0; h < data.pesticideTest.historyReports.length; h++) {
        if (data.pesticideTest.historyReports[h].reportNo === normalizedReportNo) {
          historyReport = data.pesticideTest.historyReports[h];
          break;
        }
      }
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
          traceId: traceId,
          sampleNo: sampleRecord ? sampleRecord.sampleNo : '',
          sampleReportConsistent: sampleRecord ? sampleRecord.reportNo === normalizedReportNo : false,
          abnormalSamples: abnormalSamples
        };
      }
    }
  }

  return {
    valid: false,
    reportNo: normalizedReportNo,
    message: '未找到该报告编号，请检查是否输入正确',
    sampleNo: sampleRecord ? sampleRecord.sampleNo : '',
    sampleReportConsistent: sampleRecord ? sampleRecord.reportNo === normalizedReportNo : false,
    abnormalSamples: abnormalSamples
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
function getWorkshopEnvData(traceId) {
  var data = getTraceData(traceId);
  if (!data || !data.workshopEnv) return null;
  return data.workshopEnv;
}

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

var greenTraceExtended = {
  'G001': {
    certificates: [
      {
        id: 'CERT-ORG-2025-001',
        name: '有机产品认证证书',
        type: 'organic',
        thumbnail: 'https://picsum.photos/id/1082/200/200',
        fullImage: 'https://picsum.photos/id/1082/750/1000',
        issueOrg: '中国有机产品认证中心',
        issueDate: '2025年3月1日',
        validUntil: '2026年2月28日',
        certNo: 'ORG-CERT-2025-GH001',
        status: '有效'
      },
      {
        id: 'CERT-GP-2025-001',
        name: '绿色包装认证证书',
        type: 'greenPacking',
        thumbnail: 'https://picsum.photos/id/1080/200/200',
        fullImage: 'https://picsum.photos/id/1080/750/1000',
        issueOrg: '中国绿色包装研究院',
        issueDate: '2025年4月15日',
        validUntil: '2027年4月14日',
        certNo: 'GP-CERT-2025-GH001',
        status: '有效'
      }
    ],
    waterFootprint: {
      totalUsage: 185,
      unit: 'L/罐',
      stages: [
        { name: '种植灌溉', value: 120, percent: 64.9, color: '#1890FF' },
        { name: '加工窨制', value: 38, percent: 20.5, color: '#13C2C2' },
        { name: '清洗消毒', value: 27, percent: 14.6, color: '#36CFC9' }
      ],
      industryAvg: {
        totalUsage: 280,
        unit: 'L/罐',
        stages: [
          { name: '种植灌溉', value: 196, percent: 70 },
          { name: '加工窨制', value: 56, percent: 20 },
          { name: '清洗消毒', value: 28, percent: 10 }
        ]
      },
      savingPercent: 33.9,
      comparisonNote: '本产品用水量较行业均值低33.9%，每罐节约95升水，相当于节约0.38次标准淋浴用水',
      dataSource: '自建水表监测系统',
      monitorPoints: [
        { id: 'WM-001', name: '茶园灌溉水表', location: '武夷山茶园A区', status: 'online' },
        { id: 'WM-002', name: '窨制车间水表', location: '加工厂车间A', status: 'online' },
        { id: 'WM-003', name: '清洗线水表', location: '清洗车间', status: 'online' }
      ]
    },
    biodiversity: {
      indexScore: 87,
      indexLevel: '优秀',
      indexDesc: '茶园周边生态系统健康，物种多样性高于区域平均水平',
      monitoringSummary: {
        totalSpecies: 126,
        birdSpecies: 38,
        insectSpecies: 52,
        plantSpecies: 36,
        monitoringArea: '茶园周边2公里范围',
        monitoringDuration: '2024年1月-2025年6月',
        monitoringFrequency: '每月2次定点观测'
      },
      recentMonitoring: [
        {
          date: '2025-06-15',
          type: '鸟类',
          observer: '生态监测站·李观测员',
          weather: '晴',
          findings: [
            { species: '白鹭', count: 6, status: '常驻', habitat: '茶园水塘边' },
            { species: '画眉', count: 3, status: '常驻', habitat: '灌木丛' },
            { species: '红嘴蓝鹊', count: 2, status: '偶见', habitat: '乔木层' }
          ]
        },
        {
          date: '2025-06-12',
          type: '昆虫',
          observer: '生态监测站·王观测员',
          weather: '多云',
          findings: [
            { species: '中华蜜蜂', count: 15, status: '常驻', habitat: '桂花树花丛' },
            { species: '七星瓢虫', count: 8, status: '常驻', habitat: '茶树叶片' },
            { species: '碧凤蝶', count: 2, status: '偶见', habitat: '林缘花丛' }
          ]
        },
        {
          date: '2025-05-28',
          type: '鸟类',
          observer: '生态监测站·李观测员',
          weather: '阴',
          findings: [
            { species: '白鹭', count: 4, status: '常驻', habitat: '茶园水塘边' },
            { species: '大山雀', count: 5, status: '常驻', habitat: '茶树间' },
            { species: '翠鸟', count: 1, status: '稀有', habitat: '溪流旁' }
          ]
        }
      ],
      monitoringStats: {
        birdMonitorCount: 48,
        insectMonitorCount: 36,
        plantSurveyCount: 18
      },
      keySpecies: [
        { name: '白鹭', category: '鸟类', protection: '省级保护', trend: '稳定', icon: '🦅' },
        { name: '中华蜜蜂', category: '昆虫', protection: '有益物种', trend: '增长', icon: '🐝' },
        { name: '翠鸟', category: '鸟类', protection: '国家三有', trend: '偶见', icon: '🐦' },
        { name: '碧凤蝶', category: '昆虫', protection: '生态指示', trend: '稳定', icon: '🦋' }
      ],
      dataSource: '自建生态监测站'
    },
    carbonFootprint: {
      totalEmission: 2.8,
      unit: 'kg CO₂e/罐',
      stages: [
        { name: '种植', value: 0.56, percent: 20, color: '#52C41A' },
        { name: '加工', value: 0.84, percent: 30, color: '#1890FF' },
        { name: '包装', value: 0.7, percent: 25, color: '#DAA520' },
        { name: '物流', value: 0.7, percent: 25, color: '#722ED1' }
      ],
      industryAvg: {
        totalEmission: 4.2,
        unit: 'kg CO₂e/罐',
        stages: [
          { name: '种植', value: 0.84, percent: 20 },
          { name: '加工', value: 1.47, percent: 35 },
          { name: '包装', value: 1.05, percent: 25 },
          { name: '物流', value: 0.84, percent: 20 }
        ]
      },
      reductionPercent: 33.3,
      comparisonNote: '本产品碳排放较行业均值低33.3%，每罐减少1.4kg CO₂排放'
    },
    recyclingGuide: {
      materialType: '食品级可降解牛皮纸',
      recyclable: true,
      steps: [
        { step: 1, title: '分离组件', desc: '将罐盖与罐身分离，去除密封铝箔', icon: '🔄' },
        { step: 2, title: '清洁处理', desc: '用清水冲洗罐身，去除残留茶叶', icon: '💧' },
        { step: 3, title: '分类投放', desc: '罐身投入可回收物垃圾桶（纸类）', icon: '♻️' },
        { step: 4, title: '标签处理', desc: '标签使用植物大豆油墨，可连同罐身一起回收', icon: '🏷️' }
      ],
      nearbyPoints: [
        { name: 'A市垃圾分类回收站（东湖社区）', address: '湖北省A市东湖路128号', lat: 30.5928, lng: 114.3055, distance: '1.2km' },
        { name: '绿色回收便民点（光谷广场）', address: '湖北省A市光谷大道88号', lat: 30.5039, lng: 114.4243, distance: '2.5km' },
        { name: '环保驿站（南湖小区）', address: '湖北省A市南湖路56号', lat: 30.4912, lng: 114.3612, distance: '3.8km' }
      ]
    },
    ecoFund: {
      enabled: true,
      defaultAmount: 1,
      availableAmounts: [1, 5, 10, 50],
      hasBatchDonation: true,
      batchDonation: {
        batchNo: 'GH202503',
        projectKey: 'osmanthusReplant',
        targetProjectName: 'A市桂花园定向支持计划',
        targetLocation: '湖北省A市咸安区桂花镇',
        description: '购买GH202503批次金桂花茶，每罐捐赠1元定向用于A市桂花园桂花树复种项目。',
        matchedDonation: true,
        matchRatio: '1:1',
        matchNote: '品牌方1:1配捐，您捐1元，品牌再捐1元'
      },
      donationStats: {
        totalRaised: 382560,
        donorCount: 12580,
        batchRaised: 128600,
        batchDonorCount: 4280
      },
      recentDonors: [
        { name: '张*明', amount: 1, time: '2分钟前', message: '为咸宁桂花出一份力' },
        { name: '李*华', amount: 10, time: '15分钟前', message: '希望桂花树越长越好' },
        { name: '王*芳', amount: 5, time: '32分钟前', message: '' },
        { name: '匿名茶友', amount: 1, time: '1小时前', message: '' }
      ]
    }
  },
  'G002': {
    certificates: [
      {
        id: 'CERT-GF-2025-001',
        name: '绿色食品认证证书',
        type: 'greenFood',
        thumbnail: 'https://picsum.photos/id/312/200/200',
        fullImage: 'https://picsum.photos/id/312/750/1000',
        issueOrg: '中国绿色食品发展中心',
        issueDate: '2025年5月1日',
        validUntil: '2028年4月30日',
        certNo: 'GF-CERT-2025-GH002',
        status: '有效'
      },
      {
        id: 'CERT-RC-2025-001',
        name: '可回收标识认证',
        type: 'recyclable',
        thumbnail: 'https://picsum.photos/id/401/200/200',
        fullImage: 'https://picsum.photos/id/401/750/1000',
        issueOrg: '中国循环经济协会',
        issueDate: '2025年6月1日',
        validUntil: '2027年5月31日',
        certNo: 'RC-CERT-2025-GH002',
        status: '有效'
      }
    ],
    waterFootprint: {
      totalUsage: 210,
      unit: 'L/罐',
      stages: [
        { name: '种植灌溉', value: 140, percent: 66.7, color: '#1890FF' },
        { name: '加工窨制', value: 42, percent: 20.0, color: '#13C2C2' },
        { name: '清洗消毒', value: 28, percent: 13.3, color: '#36CFC9' }
      ],
      industryAvg: {
        totalUsage: 280,
        unit: 'L/罐',
        stages: [
          { name: '种植灌溉', value: 196, percent: 70 },
          { name: '加工窨制', value: 56, percent: 20 },
          { name: '清洗消毒', value: 28, percent: 10 }
        ]
      },
      savingPercent: 25.0,
      comparisonNote: '本产品用水量较行业均值低25.0%，每罐节约70升水',
      dataSource: '自建水表监测系统',
      monitorPoints: [
        { id: 'WM-004', name: '茶园灌溉水表', location: '武夷山茶园B区', status: 'online' },
        { id: 'WM-005', name: '窨制车间水表', location: '加工厂车间B', status: 'online' },
        { id: 'WM-006', name: '清洗线水表', location: '清洗车间', status: 'online' }
      ]
    },
    biodiversity: {
      indexScore: 72,
      indexLevel: '良好',
      indexDesc: '茶园周边生态系统较为健康，物种多样性处于区域平均水平',
      monitoringSummary: {
        totalSpecies: 89,
        birdSpecies: 24,
        insectSpecies: 38,
        plantSpecies: 27,
        monitoringArea: '茶园周边2公里范围',
        monitoringDuration: '2024年3月-2025年6月',
        monitoringFrequency: '每月1次定点观测'
      },
      recentMonitoring: [
        {
          date: '2025-06-10',
          type: '鸟类',
          observer: '生态监测站·张观测员',
          weather: '多云',
          findings: [
            { species: '大山雀', count: 4, status: '常驻', habitat: '茶树间' },
            { species: '麻雀', count: 8, status: '常驻', habitat: '灌木丛' }
          ]
        },
        {
          date: '2025-06-05',
          type: '昆虫',
          observer: '生态监测站·刘观测员',
          weather: '晴',
          findings: [
            { species: '七星瓢虫', count: 5, status: '常驻', habitat: '茶树叶片' },
            { species: '中华蜜蜂', count: 6, status: '常驻', habitat: '桂花树花丛' }
          ]
        }
      ],
      monitoringStats: {
        birdMonitorCount: 28,
        insectMonitorCount: 20,
        plantSurveyCount: 12
      },
      keySpecies: [
        { name: '大山雀', category: '鸟类', protection: '国家三有', trend: '稳定', icon: '🐦' },
        { name: '七星瓢虫', category: '昆虫', protection: '有益物种', trend: '稳定', icon: '🐞' }
      ],
      dataSource: '自建生态监测站'
    },
    carbonFootprint: {
      totalEmission: 3.2,
      unit: 'kg CO₂e/罐',
      stages: [
        { name: '种植', value: 0.64, percent: 20, color: '#52C41A' },
        { name: '加工', value: 0.96, percent: 30, color: '#1890FF' },
        { name: '包装', value: 0.96, percent: 30, color: '#DAA520' },
        { name: '物流', value: 0.64, percent: 20, color: '#722ED1' }
      ],
      industryAvg: {
        totalEmission: 4.2,
        unit: 'kg CO₂e/罐',
        stages: [
          { name: '种植', value: 0.84, percent: 20 },
          { name: '加工', value: 1.47, percent: 35 },
          { name: '包装', value: 1.05, percent: 25 },
          { name: '物流', value: 0.84, percent: 20 }
        ]
      },
      reductionPercent: 23.8,
      comparisonNote: '本产品碳排放较行业均值低23.8%，每罐减少1.0kg CO₂排放'
    },
    recyclingGuide: {
      materialType: '可回收PET包装',
      recyclable: true,
      steps: [
        { step: 1, title: '冲洗干净', desc: '用清水冲洗PET罐内外，确保无残留', icon: '💧' },
        { step: 2, title: '去除标签', desc: '撕除外部标签，标签为植物油墨可降解', icon: '🏷️' },
        { step: 3, title: '压扁投放', desc: '将PET罐压扁后投入可回收物垃圾桶（塑料类）', icon: '♻️' },
        { step: 4, title: '二次利用', desc: 'PET材质支持二次利用，可做收纳容器', icon: '🔄' }
      ],
      nearbyPoints: [
        { name: 'A市垃圾分类回收站（东湖社区）', address: '湖北省A市东湖路128号', lat: 30.5928, lng: 114.3055, distance: '1.2km' },
        { name: '环保驿站（南湖小区）', address: '湖北省A市南湖路56号', lat: 30.4912, lng: 114.3612, distance: '3.8km' }
      ]
    },
    ecoFund: {
      enabled: true,
      defaultAmount: 1,
      availableAmounts: [1, 5, 10, 50],
      hasBatchDonation: false,
      batchDonation: null,
      donationStats: {
        totalRaised: 382560,
        donorCount: 12580,
        batchRaised: 0,
        batchDonorCount: 0
      },
      recentDonors: [
        { name: '陈*伟', amount: 1, time: '5分钟前', message: '支持环保事业' },
        { name: '刘*', amount: 5, time: '28分钟前', message: '' },
        { name: '匿名茶友', amount: 1, time: '2小时前', message: '' }
      ]
    }
  },
  'G003': {
    certificates: [
      {
        id: 'CERT-ORG-2025-003',
        name: '有机产品认证证书',
        type: 'organic',
        thumbnail: 'https://picsum.photos/id/1082/200/200',
        fullImage: 'https://picsum.photos/id/1082/750/1000',
        issueOrg: '中国有机产品认证中心',
        issueDate: '2025年3月1日',
        validUntil: '2026年2月28日',
        certNo: 'ORG-CERT-2025-GH003',
        status: '有效'
      },
      {
        id: 'CERT-GP-2025-003',
        name: '绿色包装认证证书',
        type: 'greenPacking',
        thumbnail: 'https://picsum.photos/id/580/200/200',
        fullImage: 'https://picsum.photos/id/580/750/1000',
        issueOrg: '中国绿色包装研究院',
        issueDate: '2025年4月15日',
        validUntil: '2027年4月14日',
        certNo: 'GP-CERT-2025-GH003',
        status: '有效'
      }
    ],
    waterFootprint: {
      totalUsage: 370,
      unit: 'L/礼盒',
      stages: [
        { name: '种植灌溉', value: 240, percent: 64.9, color: '#1890FF' },
        { name: '加工窨制', value: 76, percent: 20.5, color: '#13C2C2' },
        { name: '清洗消毒', value: 54, percent: 14.6, color: '#36CFC9' }
      ],
      industryAvg: {
        totalUsage: 560,
        unit: 'L/礼盒',
        stages: [
          { name: '种植灌溉', value: 392, percent: 70 },
          { name: '加工窨制', value: 112, percent: 20 },
          { name: '清洗消毒', value: 56, percent: 10 }
        ]
      },
      savingPercent: 33.9,
      comparisonNote: '本礼盒用水量较行业均值低33.9%，每盒节约190升水',
      dataSource: '自建水表监测系统',
      monitorPoints: [
        { id: 'WM-001', name: '茶园灌溉水表', location: '武夷山茶园A区', status: 'online' },
        { id: 'WM-002', name: '窨制车间水表', location: '加工厂车间A', status: 'online' },
        { id: 'WM-003', name: '清洗线水表', location: '清洗车间', status: 'online' }
      ]
    },
    biodiversity: {
      indexScore: 87,
      indexLevel: '优秀',
      indexDesc: '茶园周边生态系统健康，物种多样性高于区域平均水平',
      monitoringSummary: {
        totalSpecies: 126,
        birdSpecies: 38,
        insectSpecies: 52,
        plantSpecies: 36,
        monitoringArea: '茶园周边2公里范围',
        monitoringDuration: '2024年1月-2025年6月',
        monitoringFrequency: '每月2次定点观测'
      },
      recentMonitoring: [
        {
          date: '2025-06-15',
          type: '鸟类',
          observer: '生态监测站·李观测员',
          weather: '晴',
          findings: [
            { species: '白鹭', count: 6, status: '常驻', habitat: '茶园水塘边' },
            { species: '画眉', count: 3, status: '常驻', habitat: '灌木丛' }
          ]
        }
      ],
      monitoringStats: {
        birdMonitorCount: 48,
        insectMonitorCount: 36,
        plantSurveyCount: 18
      },
      keySpecies: [
        { name: '白鹭', category: '鸟类', protection: '省级保护', trend: '稳定', icon: '🦅' },
        { name: '中华蜜蜂', category: '昆虫', protection: '有益物种', trend: '增长', icon: '🐝' }
      ],
      dataSource: '自建生态监测站'
    },
    carbonFootprint: {
      totalEmission: 5.6,
      unit: 'kg CO₂e/礼盒',
      stages: [
        { name: '种植', value: 1.12, percent: 20, color: '#52C41A' },
        { name: '加工', value: 1.68, percent: 30, color: '#1890FF' },
        { name: '包装', value: 1.4, percent: 25, color: '#DAA520' },
        { name: '物流', value: 1.4, percent: 25, color: '#722ED1' }
      ],
      industryAvg: {
        totalEmission: 8.4,
        unit: 'kg CO₂e/礼盒',
        stages: [
          { name: '种植', value: 1.68, percent: 20 },
          { name: '加工', value: 2.94, percent: 35 },
          { name: '包装', value: 2.1, percent: 25 },
          { name: '物流', value: 1.68, percent: 20 }
        ]
      },
      reductionPercent: 33.3,
      comparisonNote: '本礼盒碳排放较行业均值低33.3%，每盒减少2.8kg CO₂排放'
    },
    recyclingGuide: {
      materialType: '高档竹制礼盒',
      recyclable: true,
      steps: [
        { step: 1, title: '取出内胆', desc: '取出内部茶叶罐和防震填充物', icon: '📦' },
        { step: 2, title: '清洁礼盒', desc: '用干布擦拭竹制礼盒内外', icon: '🧹' },
        { step: 3, title: '二次利用', desc: '竹制礼盒可重复使用，适合收纳或送礼', icon: '🎁' },
        { step: 4, title: '降解处理', desc: '如需丢弃，竹制品可自然降解', icon: '🌱' }
      ],
      nearbyPoints: [
        { name: 'A市垃圾分类回收站（东湖社区）', address: '湖北省A市东湖路128号', lat: 30.5928, lng: 114.3055, distance: '1.2km' },
        { name: '绿色回收便民点（光谷广场）', address: '湖北省A市光谷大道88号', lat: 30.5039, lng: 114.4243, distance: '2.5km' }
      ]
    }
  },
  'G004': {
    certificates: [
      {
        id: 'CERT-ORG-2025-004',
        name: '有机产品认证证书',
        type: 'organic',
        thumbnail: 'https://picsum.photos/id/1082/200/200',
        fullImage: 'https://picsum.photos/id/1082/750/1000',
        issueOrg: '中国有机产品认证中心',
        issueDate: '2025年3月1日',
        validUntil: '2026年2月28日',
        certNo: 'ORG-CERT-2025-GH004',
        status: '有效'
      },
      {
        id: 'CERT-GP-2025-004',
        name: '绿色包装认证证书',
        type: 'greenPacking',
        thumbnail: 'https://picsum.photos/id/1080/200/200',
        fullImage: 'https://picsum.photos/id/1080/750/1000',
        issueOrg: '中国绿色包装研究院',
        issueDate: '2025年4月15日',
        validUntil: '2027年4月14日',
        certNo: 'GP-CERT-2025-GH004',
        status: '有效'
      }
    ],
    waterFootprint: {
      totalUsage: 92,
      unit: 'L/盒',
      stages: [
        { name: '种植灌溉', value: 60, percent: 65.2, color: '#1890FF' },
        { name: '加工窨制', value: 19, percent: 20.7, color: '#13C2C2' },
        { name: '清洗消毒', value: 13, percent: 14.1, color: '#36CFC9' }
      ],
      industryAvg: {
        totalUsage: 140,
        unit: 'L/盒',
        stages: [
          { name: '种植灌溉', value: 98, percent: 70 },
          { name: '加工窨制', value: 28, percent: 20 },
          { name: '清洗消毒', value: 14, percent: 10 }
        ]
      },
      savingPercent: 34.3,
      comparisonNote: '本产品用水量较行业均值低34.3%，每盒节约48升水',
      dataSource: '自建水表监测系统',
      monitorPoints: [
        { id: 'WM-007', name: '茶园灌溉水表', location: '武夷山茶园C区', status: 'online' },
        { id: 'WM-008', name: '加工车间水表', location: '加工厂车间C', status: 'online' }
      ]
    },
    biodiversity: {
      indexScore: 68,
      indexLevel: '良好',
      indexDesc: '茶园周边生态系统基本健康，物种多样性接近区域平均水平',
      monitoringSummary: {
        totalSpecies: 72,
        birdSpecies: 18,
        insectSpecies: 32,
        plantSpecies: 22,
        monitoringArea: '茶园周边2公里范围',
        monitoringDuration: '2024年6月-2025年6月',
        monitoringFrequency: '每季度1次定点观测'
      },
      recentMonitoring: [
        {
          date: '2025-06-08',
          type: '鸟类',
          observer: '生态监测站·赵观测员',
          weather: '晴',
          findings: [
            { species: '麻雀', count: 6, status: '常驻', habitat: '灌木丛' },
            { species: '白头鹎', count: 3, status: '常驻', habitat: '乔木层' }
          ]
        }
      ],
      monitoringStats: {
        birdMonitorCount: 16,
        insectMonitorCount: 12,
        plantSurveyCount: 8
      },
      keySpecies: [
        { name: '白头鹎', category: '鸟类', protection: '国家三有', trend: '稳定', icon: '🐦' },
        { name: '七星瓢虫', category: '昆虫', protection: '有益物种', trend: '稳定', icon: '🐞' }
      ],
      dataSource: '自建生态监测站'
    },
    carbonFootprint: {
      totalEmission: 1.2,
      unit: 'kg CO₂e/盒',
      stages: [
        { name: '种植', value: 0.24, percent: 20, color: '#52C41A' },
        { name: '加工', value: 0.36, percent: 30, color: '#1890FF' },
        { name: '包装', value: 0.3, percent: 25, color: '#DAA520' },
        { name: '物流', value: 0.3, percent: 25, color: '#722ED1' }
      ],
      industryAvg: {
        totalEmission: 1.8,
        unit: 'kg CO₂e/盒',
        stages: [
          { name: '种植', value: 0.36, percent: 20 },
          { name: '加工', value: 0.63, percent: 35 },
          { name: '包装', value: 0.45, percent: 25 },
          { name: '物流', value: 0.36, percent: 20 }
        ]
      },
      reductionPercent: 33.3,
      comparisonNote: '本产品碳排放较行业均值低33.3%，每盒减少0.6kg CO₂排放'
    },
    recyclingGuide: {
      materialType: '食品级可降解材料',
      recyclable: true,
      steps: [
        { step: 1, title: '取出茶包', desc: '取出铝箔小包装中的茶包', icon: '📦' },
        { step: 2, title: '分类处理', desc: '铝箔包装投入可回收物，外盒投入纸类回收', icon: '♻️' },
        { step: 3, title: '降解处理', desc: '茶包可连同茶叶渣一起堆肥降解', icon: '🌱' },
        { step: 4, title: '环保利用', desc: '外盒可做收纳盒或创意手工', icon: '🎨' }
      ],
      nearbyPoints: [
        { name: 'A市垃圾分类回收站（东湖社区）', address: '湖北省A市东湖路128号', lat: 30.5928, lng: 114.3055, distance: '1.2km' },
        { name: '环保驿站（南湖小区）', address: '湖北省A市南湖路56号', lat: 30.4912, lng: 114.3612, distance: '3.8km' }
      ]
    }
  }
};

var greenPointsConfig = {
  pointsRules: [
    { action: 'viewTrace', points: 10, desc: '查看溯源信息', dailyLimit: 50 },
    { action: 'viewCarbon', points: 5, desc: '查看碳足迹', dailyLimit: 25 },
    { action: 'viewWater', points: 5, desc: '查看水足迹', dailyLimit: 25 },
    { action: 'viewBiodiversity', points: 5, desc: '查看生物多样性', dailyLimit: 25 },
    { action: 'viewRecycling', points: 5, desc: '查看回收指引', dailyLimit: 25 },
    { action: 'viewCertificate', points: 3, desc: '查看认证证书', dailyLimit: 15 },
    { action: 'shareGreen', points: 15, desc: '分享绿色溯源', dailyLimit: 45 },
    { action: 'scan', points: 10, desc: '扫码溯源', dailyLimit: 100 },
    { action: 'share', points: 5, desc: '分享产品', dailyLimit: 25 },
    { action: 'dailySignIn', points: 3, desc: '每日签到', dailyLimit: 30 },
    { action: 'tastingNote', points: 20, desc: '完成品鉴笔记', dailyLimit: 40 },
    { action: 'invite', points: 50, desc: '邀请好友奖励', dailyLimit: 5000 },
    { action: 'invited', points: 30, desc: '好友邀请奖励', dailyLimit: 30 },
    { action: 'invite_friend', points: 50, desc: '邀请好友扫码奖励', dailyLimit: 5000 },
    { action: 'experienceCheckIn', points: 20, desc: '线下体验签到', dailyLimit: 200 }
  ],
  levelConfig: [
    { level: 1, name: '普通会员', minPoints: 0, icon: '🍵', color: '#999999', benefits: ['基础溯源服务', '每日签到积分'] },
    { level: 2, name: '银卡会员', minPoints: 200, icon: '🥈', color: '#C0C0C0', benefits: ['普通会员全部权益', '商城95折优惠', '专属客服', '生日双倍积分'] },
    { level: 3, name: '金卡会员', minPoints: 500, icon: '🥇', color: '#DAA520', benefits: ['银卡会员全部权益', '商城9折优惠', '免费试饮优先', '活动优先报名', '专属礼品'] }
  ]
};

var pointsMallItems = [
  {
    id: 'mall_001',
    name: '金桂试饮装',
    desc: '金桂花茶10g试饮装，每人限兑2份',
    points: 100,
    originalPrice: 29,
    stock: 500,
    sold: 236,
    category: 'tea',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=premium%20golden%20osmanthus%20tea%20sample%20pack%20elegant%20small%20package&image_size=square',
    limitPerUser: 2
  },
  {
    id: 'mall_002',
    name: '银桂试饮装',
    desc: '银桂花茶10g试饮装，每人限兑2份',
    points: 80,
    originalPrice: 25,
    stock: 800,
    sold: 312,
    category: 'tea',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=silver%20osmanthus%20tea%20sample%20pack%20delicate%20small%20package&image_size=square',
    limitPerUser: 2
  },
  {
    id: 'mall_003',
    name: '手工玻璃公道杯',
    desc: '高硼硅玻璃手工公道杯，耐热150℃',
    points: 300,
    originalPrice: 89,
    stock: 200,
    sold: 87,
    category: 'teaware',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=handmade%20glass%20gongdao%20bei%20fair%20cup%20for%20tea&image_size=square',
    limitPerUser: 1
  },
  {
    id: 'mall_004',
    name: '白瓷盖碗套装',
    desc: '德化白瓷盖碗120ml，含三才盖碗+品茗杯2只',
    points: 500,
    originalPrice: 158,
    stock: 100,
    sold: 45,
    category: 'teaware',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=white%20porcelain%20gaiwan%20tea%20set%20elegant%20dehua&image_size=square',
    limitPerUser: 1
  },
  {
    id: 'mall_005',
    name: '20元无门槛券',
    desc: '商城全场通用，满0可用，有效期30天',
    points: 150,
    originalPrice: 20,
    stock: 1000,
    sold: 567,
    category: 'coupon',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=golden%20coupon%20voucher%2020%20yuan%20discount&image_size=square',
    limitPerUser: 5
  },
  {
    id: 'mall_006',
    name: '50元满减券',
    desc: '商城满199可用，有效期30天',
    points: 300,
    originalPrice: 50,
    stock: 500,
    sold: 234,
    category: 'coupon',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=golden%20coupon%20voucher%2050%20yuan%20discount&image_size=square',
    limitPerUser: 3
  },
  {
    id: 'mall_007',
    name: '竹制茶则套装',
    desc: '天然孟宗竹制茶则+茶针+茶拨三件套',
    points: 250,
    originalPrice: 68,
    stock: 300,
    sold: 156,
    category: 'teaware',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=bamboo%20tea%20utensil%20set%20cha%20ze%20needle%20scoop&image_size=square',
    limitPerUser: 2
  },
  {
    id: 'mall_008',
    name: '100元礼品券',
    desc: '商城满399可用，有效期60天，可转赠',
    points: 600,
    originalPrice: 100,
    stock: 200,
    sold: 89,
    category: 'coupon',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=premium%20gift%20voucher%20100%20yuan%20golden%20design&image_size=square',
    limitPerUser: 2
  }
];

var marketingActivities = [
  {
    id: 'activity_001',
    type: 'live',
    title: '2025金秋桂花采摘季直播',
    subtitle: '跟随镜头探访咸宁金桂基地',
    status: 'upcoming',
    scheduledTime: '2025-09-20 09:00:00',
    duration: '约120分钟',
    location: '湖北咸宁·金桂种植基地',
    description: '带您深入中国桂花之乡核心产区，见证2025年第一缕金桂的采摘全过程。非遗传承人现场讲解窨制工艺，更有直播间专属福利。',
    highlights: [
      '50年树龄金桂采摘现场',
      '窨制工艺大师现场讲解',
      '直播间专属优惠券',
      '互动抽奖赢金桂礼盒'
    ],
    totalSlots: 5000,
    registeredCount: 3256,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=golden%20osmanthus%20harvest%20live%20streaming%20event%20autumn%20garden&image_size=landscape_16_9',
    rewardPoints: 50
  },
  {
    id: 'activity_002',
    type: 'offline',
    title: '线下茶园参观体验日',
    subtitle: '武夷山百年茶树园深度体验',
    status: 'upcoming',
    scheduledTime: '2025-10-15 08:00:00',
    duration: '全天（8:00-18:00）',
    location: '福建武夷山·百年茶树园',
    description: '深入武夷山核心产区，探访200年古茶树，跟随制茶大师体验手工采茶、传统制茶工艺，品鉴明前珍品。',
    highlights: [
      '200年古茶树探访',
      '手工采茶体验',
      '传统制茶工艺学习',
      '茶王品鉴会',
      '颁发纪念证书'
    ],
    totalSlots: 30,
    registeredCount: 18,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=wuyi%20mountain%20tea%20garden%20visit%20experience%20traditional%20tea%20making&image_size=landscape_16_9',
    rewardPoints: 200,
    requirements: '金卡会员优先，需扣除50积分报名',
    fee: 0
  },
  {
    id: 'activity_003',
    type: 'live',
    title: '桂花茶冲泡大师课',
    subtitle: '国家级茶艺师亲授冲泡技巧',
    status: 'upcoming',
    scheduledTime: '2025-09-28 20:00:00',
    duration: '约90分钟',
    location: '线上直播',
    description: '国家级高级茶艺师手把手教您泡好一杯桂花茶，从水温、投茶量到浸泡时间，掌握专业冲泡技巧。',
    highlights: [
      '不同等级桂花茶冲泡要点',
      '茶具选择与搭配',
      '品鉴香气层次',
      '现场答疑互动'
    ],
    totalSlots: 10000,
    registeredCount: 6789,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=tea%20master%20brewing%20class%20online%20course%20chinese%20tea%20art&image_size=landscape_16_9',
    rewardPoints: 30
  }
];

var inviteRewardConfig = {
  inviterPoints: 50,
  inviteePoints: 30,
  maxInvites: 100,
  description: '邀请好友首次扫码，双方均可获得积分奖励',
  rules: [
    '被邀请好友必须是新用户（从未扫码溯源）',
    '好友首次扫码后，双方立即获得积分',
    '每位用户最多可邀请100位好友',
    '积分奖励实时到账，可在积分明细中查看'
  ]
};

function getPointsMallItems(category) {
  if (category && category !== 'all') {
    return pointsMallItems.filter(function(item) { return item.category === category; });
  }
  return pointsMallItems;
}

function getPointsMallItemById(id) {
  for (var i = 0; i < pointsMallItems.length; i++) {
    if (pointsMallItems[i].id === id) return pointsMallItems[i];
  }
  return null;
}

function getMarketingActivities(status) {
  if (status && status !== 'all') {
    return marketingActivities.filter(function(act) { return act.status === status; });
  }
  return marketingActivities;
}

function getMarketingActivityById(id) {
  for (var i = 0; i < marketingActivities.length; i++) {
    if (marketingActivities[i].id === id) return marketingActivities[i];
  }
  return null;
}

function getCampaignNameById(campaignId) {
  const activity = getMarketingActivityById(campaignId);
  return activity ? activity.title : '';
}

function getInviteRewardConfig() {
  return inviteRewardConfig;
}

function getMemberLevels() {
  return greenPointsConfig.levelConfig;
}

function getMemberLevelByPoints(totalPoints) {
  var levels = greenPointsConfig.levelConfig;
  var current = levels[0];
  for (var i = 0; i < levels.length; i++) {
    if (totalPoints >= levels[i].minPoints) {
      current = levels[i];
    }
  }
  var nextLevel = null;
  for (var j = 0; j < levels.length; j++) {
    if (levels[j].minPoints > totalPoints) {
      nextLevel = levels[j];
      break;
    }
  }
  return {
    current: current,
    nextLevel: nextLevel,
    progress: nextLevel ? Math.min(100, ((totalPoints - current.minPoints) / (nextLevel.minPoints - current.minPoints)) * 100) : 100
  };
}

function getGreenTraceExtended(traceId) {
  if (!traceId) return null;
  var id = traceId.toUpperCase().trim();
  return greenTraceExtended[id] || null;
}

function getGreenPointsConfig() {
  return greenPointsConfig;
}

function verifyCertificate(certNo) {
  if (!certNo || typeof certNo !== 'string') return { valid: false, message: '请输入有效的证书编号' };
  var normalizedCertNo = certNo.trim().toUpperCase();
  for (var traceId in greenTraceExtended) {
    var data = greenTraceExtended[traceId];
    if (data.certificates) {
      for (var i = 0; i < data.certificates.length; i++) {
        var cert = data.certificates[i];
        if (cert.certNo === normalizedCertNo) {
          var traceData = mockTraceData[traceId];
          return {
            valid: true,
            certNo: cert.certNo,
            certName: cert.name,
            issueOrg: cert.issueOrg,
            issueDate: cert.issueDate,
            validUntil: cert.validUntil,
            status: cert.status,
            productName: traceData ? traceData.basicInfo.productName : '',
            batchNo: traceData ? traceData.basicInfo.batchNo : '',
            verifyTime: new Date().toLocaleString('zh-CN')
          };
        }
      }
    }
  }
  return { valid: false, certNo: normalizedCertNo, message: '未找到该证书编号，请核实后重试' };
}

function getOsmanthusVarietyConfig(variety) {
  if (!variety) return null;
  return OSMANTHUS_VARIETIES[variety] || null;
}

function getAllVarieties() {
  return Object.keys(OSMANTHUS_VARIETIES).map(function(key) {
    return {
      name: key,
      ...OSMANTHUS_VARIETIES[key]
    };
  });
}

// ==================== 冲泡互动配置 ====================

const BREWING_INTERACTIVE_CONFIG = {
  waterTempLevels: [
    { key: '80', label: '80℃', desc: '清香淡雅', icon: '🌿' },
    { key: '85', label: '85℃', desc: '花香馥郁', icon: '🌸', default: true },
    { key: '90', label: '90℃', desc: '醇厚浓郁', icon: '🍵' },
    { key: '95', label: '95℃', desc: '茶气强劲', icon: '🔥' }
  ],

  brewSteps: [
    {
      step: 1,
      name: '温杯',
      icon: '🫖',
      title: '温杯烫盏',
      desc: '用热水将茶具温热，提升茶香散发效果',
      detail: '1. 将适量热水倒入盖碗或玻璃杯中\n2. 轻轻旋转使杯壁均匀受热\n3. 将温杯水倒掉',
      duration: 30,
      tip: '温杯能让茶香更好地释放'
    },
    {
      step: 2,
      name: '投茶',
      icon: '🍃',
      title: '投茶入盏',
      desc: '根据人数和口味，投入适量桂花茶',
      detail: '1. 用量勺取适量干茶\n2. 轻轻拨入温好的茶具中\n3. 可轻轻摇晃闻干香',
      duration: 20,
      tip: '推荐用量：每杯3-5克'
    },
    {
      step: 3,
      name: '注水',
      icon: '💧',
      title: '注水冲泡',
      desc: '沿杯壁缓缓注入适宜温度的热水',
      detail: '1. 水温控制在85℃-90℃为佳\n2. 沿杯壁顺时针注水\n3. 注水量约七分满',
      duration: 15,
      tip: '避免直接冲在茶叶上，保持芽叶完整'
    },
    {
      step: 4,
      name: '出汤',
      icon: '🍵',
      title: '出汤品茗',
      desc: '浸泡2分钟后即可出汤品尝',
      detail: '1. 首泡浸泡约2分钟\n2. 后续每泡延长30秒\n3. 可连续冲泡4-5次',
      duration: 120,
      tip: '桂花茶香气浓郁，首泡即可闻到花香'
    }
  ],

  dosageConfig: {
    basePerCup: 3,
    tasteMultiplier: {
      light: 0.7,
      medium: 1.0,
      strong: 1.4
    },
    tasteLabels: {
      light: '清淡',
      medium: '适中',
      strong: '浓郁'
    },
    maxPeople: 10,
    minPeople: 1
  }
};

function getBrewingInteractiveConfig() {
  return BREWING_INTERACTIVE_CONFIG;
}

function calculateTeaDosage(people, taste) {
  var config = BREWING_INTERACTIVE_CONFIG.dosageConfig;
  var p = Math.max(config.minPeople, Math.min(config.maxPeople, parseInt(people) || 1));
  var t = taste || 'medium';
  var multiplier = config.tasteMultiplier[t] || 1.0;
  var grams = Math.round(p * config.basePerCup * multiplier * 10) / 10;
  return {
    people: p,
    taste: t,
    tasteLabel: config.tasteLabels[t],
    grams: grams,
    teaspoon: Math.round(grams / 3 * 10) / 10,
    suggestion: grams <= 5 ? '少量精品，品花香为主' :
                grams <= 15 ? '适量冲泡，适合日常饮用' :
                '多人共享，茶香四溢'
  };
}

function verifyBlockchainEvidence(txHash) {
  if (!txHash || typeof txHash !== 'string') {
    return {
      success: false,
      message: '交易哈希不能为空'
    };
  }

  var normalizedHash = txHash.trim().toLowerCase();

  for (var traceId in mockTraceData) {
    var data = mockTraceData[traceId];
    if (data.blockchainInfo && data.blockchainInfo.txHash.toLowerCase() === normalizedHash) {
      var bc = data.blockchainInfo;
      return {
        success: true,
        verified: true,
        txHash: bc.txHash,
        chainName: bc.chainName,
        chainId: bc.chainId,
        blockHeight: bc.blockHeight,
        timestamp: bc.timestamp,
        contractAddress: bc.contractAddress,
        nodeCount: bc.nodeCount,
        consensusType: bc.consensusType,
        verifyTime: new Date().toLocaleString('zh-CN'),
        traceId: traceId,
        productName: data.basicInfo.productName,
        batchNo: data.basicInfo.batchNo,
        onChainFieldsCount: bc.onChainFields ? bc.onChainFields.filter(function(f) { return f.onChain; }).length : 0,
        scanRecords: bc.scanRecords
      };
    }
  }

  return {
    success: true,
    verified: false,
    txHash: normalizedHash,
    message: '该交易哈希未在溯源链上找到对应记录',
    verifyTime: new Date().toLocaleString('zh-CN')
  };
}

function recordAntiCounterfeitingScan(traceId, scanInfo) {
  if (!traceId || !mockTraceData[traceId]) {
    return {
      success: false,
      message: '无效的溯源码'
    };
  }

  var data = mockTraceData[traceId];
  if (!data.blockchainInfo || !data.blockchainInfo.scanRecords) {
    return {
      success: false,
      message: '无防伪记录'
    };
  }

  var records = data.blockchainInfo.scanRecords.records;
  var isFirstScan = records.length === 0;
  var now = new Date().toLocaleString('zh-CN');

  var newRecord = {
    time: now,
    type: isFirstScan ? 'first' : 'repeat',
    location: (scanInfo && scanInfo.location) || '未知位置',
    ip: (scanInfo && scanInfo.ip) || 'xxx.xxx.xx.xx'
  };

  return {
    success: true,
    isFirstScan: isFirstScan,
    totalQueryCount: data.blockchainInfo.scanRecords.totalQueryCount + 1,
    currentRecord: newRecord,
    firstScanTime: isFirstScan ? now : data.blockchainInfo.scanRecords.firstScanTime,
    lastScanTime: now,
    traceId: traceId,
    productName: data.basicInfo.productName
  };
}

function getTsaCertificate(traceId) {
  if (!traceId || !mockTraceData[traceId]) {
    return null;
  }

  var data = mockTraceData[traceId];
  if (!data.blockchainInfo || !data.blockchainInfo.tsaCertificate) {
    return null;
  }

  return Object.assign({}, data.blockchainInfo.tsaCertificate, {
    chainName: data.blockchainInfo.chainName,
    txHash: data.blockchainInfo.txHash,
    productName: data.basicInfo.productName,
    batchNo: data.basicInfo.batchNo
  });
}

function getAvailableCoupons() {
  return [
    {
      id: 'TPL-001',
      name: '新人专享券',
      type: 'cash',
      value: 10,
      minAmount: 50,
      desc: '满50元减10元，新用户首单可用',
      expireDays: 7,
      tag: '新人',
      tagColor: '#FF4D4F'
    },
    {
      id: 'TPL-002',
      name: '满减优惠券',
      type: 'cash',
      value: 30,
      minAmount: 200,
      desc: '满200元减30元，全场通用',
      expireDays: 30,
      tag: '热门',
      tagColor: '#DAA520'
    },
    {
      id: 'TPL-003',
      name: '桂花茶专属券',
      type: 'discount',
      value: 0.88,
      minAmount: 0,
      desc: '桂花茶系列8.8折，不限金额',
      expireDays: 15,
      tag: '专属',
      tagColor: '#2E8B57'
    },
    {
      id: 'TPL-004',
      name: '礼盒套装券',
      type: 'cash',
      value: 80,
      minAmount: 500,
      desc: '满500元减80元，礼盒套装专用',
      expireDays: 60,
      tag: '大额',
      tagColor: '#722ED1'
    },
    {
      id: 'TPL-005',
      name: '老用户回馈券',
      type: 'cash',
      value: 50,
      minAmount: 300,
      desc: '满300元减50元，老用户专享',
      expireDays: 45,
      tag: '回馈',
      tagColor: '#1890FF'
    }
  ];
}

function getShareThemeConfig() {
  return {
    cardTitle: '一茶一品',
    cardSubtitle: '· 桂花茶全链路溯源 ·',
    footerSloganLeft: '正品溯源 · 品质保障',
    footerSloganRight: '邀请好友双方得积分',
    qrCodeTip: '扫码查看完整溯源信息',
    qrCodeSubTip: '支持区块链验真 · 全链路可追溯',
    certificateTitle: '产品溯源证书',
    certificateTitleEn: 'PRODUCT TRACEABILITY CERTIFICATE',
    certificateFooter: [
      '本证书由「一茶一品·桂花茶溯源平台」自动生成',
      '生成时间：' + new Date().toLocaleString('zh-CN'),
      '证书仅用于产品溯源，不具备法律效力'
    ]
  };
}

// ==================== 商城产品数据 ====================

var shopProducts = {
  'G001': {
    traceId: 'G001',
    productName: '金桂花茶',
    subtitle: '200年古树茶底 · 五窨一提',
    thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=premium%20golden%20osmanthus%20tea%20tin%20can%20product%20photo&image_size=square',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=golden%20osmanthus%20tea%20product%20photo%20main&image_size=square',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=golden%20osmanthus%20tea%20leaves%20closeup&image_size=square',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=osmanthus%20tea%20brewing%20in%20glass%20cup&image_size=square'
    ],
    category: '金桂系列',
    tags: ['热销', '有机认证', '百年古树'],
    sales: 2580,
    stock: 156,
    description: '精选武夷山200年古茶树鲜叶为底，配以咸宁金桂，经非遗窨制工艺五窨一提，花香浓郁持久，口感醇厚回甘。',
    specs: [
      { id: 'spec-1', name: '规格', values: ['100g/罐', '200g/罐', '250g/礼盒装'] }
    ],
    skuList: [
      { skuId: 'G001-S01', specValues: ['100g/罐'], price: 128.00, memberPrice: 108.00, stock: 80, barcode: '6901234567001' },
      { skuId: 'G001-S02', specValues: ['200g/罐'], price: 228.00, memberPrice: 198.00, stock: 50, barcode: '6901234567002' },
      { skuId: 'G001-S03', specValues: ['250g/礼盒装'], price: 368.00, memberPrice: 328.00, stock: 26, barcode: '6901234567003' }
    ],
    defaultSkuIndex: 0,
    freight: 0,
    freightFreeAmount: 99,
    afterSale: '7天无理由退换',
    serviceTags: ['正品保障', '极速发货', '顺丰包邮', '溯源可查']
  },
  'G002': {
    traceId: 'G002',
    productName: '银桂花茶',
    subtitle: '120年茶树龄 · 三窨一提',
    thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=silver%20osmanthus%20tea%20packaging%20elegant%20product%20photo&image_size=square',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=silver%20osmanthus%20tea%20product%20photo%20elegant&image_size=square',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=silver%20osmanthus%20tea%20leaves%20closeup&image_size=square'
    ],
    category: '银桂系列',
    tags: ['性价比', '绿色食品'],
    sales: 3890,
    stock: 320,
    description: '选用武夷山120年生态茶园茶叶，搭配咸宁银桂，清雅淡香，口感柔和，适合日常饮用。',
    specs: [
      { id: 'spec-1', name: '规格', values: ['100g/罐', '200g/罐'] }
    ],
    skuList: [
      { skuId: 'G002-S01', specValues: ['100g/罐'], price: 68.00, memberPrice: 58.00, stock: 200, barcode: '6901234567011' },
      { skuId: 'G002-S02', specValues: ['200g/罐'], price: 118.00, memberPrice: 108.00, stock: 120, barcode: '6901234567012' }
    ],
    defaultSkuIndex: 0,
    freight: 8,
    freightFreeAmount: 99,
    afterSale: '7天无理由退换',
    serviceTags: ['正品保障', '极速发货', '溯源可查']
  },
  'G003': {
    traceId: 'G003',
    productName: '金桂花茶礼盒装',
    subtitle: '180年古树 · 六窨一提 · 竹制礼盒',
    thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20golden%20osmanthus%20tea%20gift%20box%20premium%20packaging&image_size=square',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=premium%20osmanthus%20tea%20gift%20box%20luxury%20packaging&image_size=square',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=osmanthus%20tea%20gift%20box%20open%20unboxing&image_size=square',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=premium%20tea%20tasting%20ceremony%20elegant&image_size=square'
    ],
    category: '金桂系列',
    tags: ['新品', '礼盒装', '送礼佳品', '有机认证'],
    sales: 860,
    stock: 78,
    description: '臻选武夷山180年古茶树春茶芽叶，六窨一提，香气绵密悠长。高档竹制礼盒包装，送礼佳品，附专属溯源证书。',
    specs: [
      { id: 'spec-1', name: '规格', values: ['250g/礼盒', '500g/豪华礼盒'] }
    ],
    skuList: [
      { skuId: 'G003-S01', specValues: ['250g/礼盒'], price: 588.00, memberPrice: 528.00, stock: 50, barcode: '6901234567021' },
      { skuId: 'G003-S02', specValues: ['500g/豪华礼盒'], price: 1088.00, memberPrice: 988.00, stock: 28, barcode: '6901234567022' }
    ],
    defaultSkuIndex: 0,
    freight: 0,
    freightFreeAmount: 0,
    afterSale: '7天无理由退换',
    serviceTags: ['正品保障', '顺丰包邮', '精美包装', '附溯源证书']
  },
  'G004': {
    traceId: 'G004',
    productName: '金桂花茶便携装',
    subtitle: '150年茶树 · 四窨一提 · 独立小包装',
    thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=osmanthus%20tea%20portable%20sachet%20packaging%20convenient&image_size=square',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=portable%20osmanthus%20tea%20sachets%20product%20photo&image_size=square',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=tea%20sachet%20brewing%20in%20cup&image_size=square'
    ],
    category: '金桂系列',
    tags: ['便携', '上班族', '独立包装'],
    sales: 5260,
    stock: 500,
    description: '独立小包装设计，方便携带，随时随地享用一杯好茶。每袋3g，一杯一袋，品质如一。',
    specs: [
      { id: 'spec-1', name: '规格', values: ['3g*12袋/盒', '3g*24袋/盒', '3g*36袋/家庭装'] }
    ],
    skuList: [
      { skuId: 'G004-S01', specValues: ['3g*12袋/盒'], price: 45.00, memberPrice: 38.00, stock: 200, barcode: '6901234567031' },
      { skuId: 'G004-S02', specValues: ['3g*24袋/盒'], price: 78.00, memberPrice: 68.00, stock: 180, barcode: '6901234567032' },
      { skuId: 'G004-S03', specValues: ['3g*36袋/家庭装'], price: 108.00, memberPrice: 95.00, stock: 120, barcode: '6901234567033' }
    ],
    defaultSkuIndex: 0,
    freight: 8,
    freightFreeAmount: 99,
    afterSale: '7天无理由退换',
    serviceTags: ['正品保障', '极速发货', '便携装']
  }
};

function getShopProduct(traceId) {
  if (!traceId) return null;
  var id = traceId.toUpperCase().trim();
  var product = shopProducts[id];
  if (!product) return null;
  return JSON.parse(JSON.stringify(product));
}

function getShopProductList(options) {
  var list = [];
  for (var traceId in shopProducts) {
    list.push(JSON.parse(JSON.stringify(shopProducts[traceId])));
  }

  if (options && options.category) {
    list = list.filter(function(p) { return p.category === options.category; });
  }

  if (options && options.sortBy) {
    if (options.sortBy === 'sales') {
      list.sort(function(a, b) { return b.sales - a.sales; });
    } else if (options.sortBy === 'priceAsc') {
      list.sort(function(a, b) {
        var pa = a.skuList[0].price;
        var pb = b.skuList[0].price;
        return pa - pb;
      });
    } else if (options.sortBy === 'priceDesc') {
      list.sort(function(a, b) {
        var pa = a.skuList[0].price;
        var pb = b.skuList[0].price;
        return pb - pa;
      });
    }
  }

  return list;
}

function getSkuBySpec(traceId, specValues) {
  var product = shopProducts[traceId];
  if (!product) return null;

  for (var i = 0; i < product.skuList.length; i++) {
    var sku = product.skuList[i];
    var match = true;
    for (var j = 0; j < specValues.length; j++) {
      if (sku.specValues.indexOf(specValues[j]) === -1) {
        match = false;
        break;
      }
    }
    if (match) {
      return JSON.parse(JSON.stringify(sku));
    }
  }
  return null;
}

function getSkuById(traceId, skuId) {
  var product = shopProducts[traceId];
  if (!product) return null;

  for (var i = 0; i < product.skuList.length; i++) {
    if (product.skuList[i].skuId === skuId) {
      return JSON.parse(JSON.stringify(product.skuList[i]));
    }
  }
  return null;
}

// ==================== 满减活动 ====================

var promotionActivities = [
  {
    id: 'PROMO-001',
    name: '满99减10',
    type: 'fullReduce',
    fullAmount: 99,
    reduceAmount: 10,
    desc: '全场满99元立减10元',
    startTime: '2025-09-01 00:00:00',
    endTime: '2025-12-31 23:59:59',
    status: 'active'
  },
  {
    id: 'PROMO-002',
    name: '满199减25',
    type: 'fullReduce',
    fullAmount: 199,
    reduceAmount: 25,
    desc: '全场满199元立减25元',
    startTime: '2025-09-01 00:00:00',
    endTime: '2025-12-31 23:59:59',
    status: 'active'
  },
  {
    id: 'PROMO-003',
    name: '满299减50',
    type: 'fullReduce',
    fullAmount: 299,
    reduceAmount: 50,
    desc: '全场满299元立减50元',
    startTime: '2025-09-01 00:00:00',
    endTime: '2025-12-31 23:59:59',
    status: 'active'
  },
  {
    id: 'PROMO-004',
    name: '中秋特惠满499减100',
    type: 'fullReduce',
    fullAmount: 499,
    reduceAmount: 100,
    desc: '全场满499元立减100元，中秋特惠',
    startTime: '2025-09-15 00:00:00',
    endTime: '2025-09-30 23:59:59',
    status: 'active',
    tag: '限时'
  }
];

function getActivePromotions() {
  return promotionActivities.filter(function(p) { return p.status === 'active'; });
}

function getBestPromotion(totalAmount) {
  var activeList = getActivePromotions();
  var best = null;
  for (var i = 0; i < activeList.length; i++) {
    var promo = activeList[i];
    if (totalAmount >= promo.fullAmount) {
      if (!best || promo.reduceAmount > best.reduceAmount) {
        best = promo;
      }
    }
  }
  return best;
}

function calculatePromotionDiscount(totalAmount) {
  var best = getBestPromotion(totalAmount);
  if (!best) return { discount: 0, promotion: null };
  return { discount: best.reduceAmount, promotion: best };
}

// ==================== 订单数据 ====================

var mockOrders = [
  {
    orderId: 'ORD202509150001',
    orderNo: '2025091512345678',
    status: 'delivered',
    statusText: '已收货',
    createTime: '2025-09-15 14:30:22',
    payTime: '2025-09-15 14:32:10',
    deliverTime: '2025-09-16 10:15:00',
    receiveTime: '2025-09-18 16:20:00',
    totalAmount: 256.00,
    payAmount: 218.00,
    freight: 0,
    discount: 38.00,
    couponDiscount: 10.00,
    promotionDiscount: 25.00,
    memberDiscount: 3.00,
    items: [
      {
        traceId: 'G001',
        skuId: 'G001-S01',
        productName: '金桂花茶',
        specValues: ['100g/罐'],
        price: 128.00,
        memberPrice: 108.00,
        quantity: 2,
        subtotal: 216.00,
        thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=premium%20golden%20osmanthus%20tea%20tin%20can%20product%20photo&image_size=square',
        batchNo: 'GH202503',
        traceCode: 'G001-GH202503-08765'
      }
    ],
    address: {
      name: '张女士',
      phone: '138****5678',
      province: '湖北省',
      city: 'A市',
      district: '洪山区',
      detail: '东湖路128号桂花小区3栋2单元501'
    },
    logistics: {
      company: '顺丰速运',
      trackingNo: 'SF1234567890123',
      status: 'signed'
    },
    couponId: 'TPL-001',
    traceability: {
      hasTrace: true,
      totalItems: 2,
      verifiedItems: 0
    }
  },
  {
    orderId: 'ORD202509100002',
    orderNo: '2025091098765432',
    status: 'shipped',
    statusText: '运输中',
    createTime: '2025-09-10 09:15:33',
    payTime: '2025-09-10 09:18:20',
    deliverTime: '2025-09-11 08:30:00',
    receiveTime: null,
    totalAmount: 588.00,
    payAmount: 488.00,
    freight: 0,
    discount: 100.00,
    couponDiscount: 50.00,
    promotionDiscount: 50.00,
    memberDiscount: 0,
    items: [
      {
        traceId: 'G003',
        skuId: 'G003-S01',
        productName: '金桂花茶礼盒装',
        specValues: ['250g/礼盒'],
        price: 588.00,
        memberPrice: 528.00,
        quantity: 1,
        subtotal: 528.00,
        thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20golden%20osmanthus%20tea%20gift%20box%20premium%20packaging&image_size=square',
        batchNo: 'GH202503',
        traceCode: 'G003-GH202503-01234'
      }
    ],
    address: {
      name: '李先生',
      phone: '139****1234',
      province: '北京市',
      city: '北京市',
      district: '朝阳区',
      detail: '建国路88号SOHO现代城A座1203'
    },
    logistics: {
      company: '顺丰速运',
      trackingNo: 'SF9876543210987',
      status: 'transit'
    },
    couponId: 'TPL-005',
    traceability: {
      hasTrace: true,
      totalItems: 1,
      verifiedItems: 0
    }
  }
];

function getMockOrders() {
  return mockOrders;
}

function getOrderById(orderId) {
  for (var i = 0; i < mockOrders.length; i++) {
    if (mockOrders[i].orderId === orderId) {
      return JSON.parse(JSON.stringify(mockOrders[i]));
    }
  }
  return null;
}

function getOrderByNo(orderNo) {
  for (var i = 0; i < mockOrders.length; i++) {
    if (mockOrders[i].orderNo === orderNo) {
      return JSON.parse(JSON.stringify(mockOrders[i]));
    }
  }
  return null;
}

function getOrdersByStatus(status) {
  if (!status || status === 'all') {
    return mockOrders;
  }
  return mockOrders.filter(function(o) { return o.status === status; });
}

// ==================== 购物车数据计算 ====================

function calculateCartSummary(cartItems, isMember) {
  var totalCount = 0;
  var totalAmount = 0;
  var totalMemberAmount = 0;
  var selectedCount = 0;
  var selectedAmount = 0;
  var selectedMemberAmount = 0;

  for (var i = 0; i < cartItems.length; i++) {
    var item = cartItems[i];
    totalCount += item.quantity;
    totalAmount += item.price * item.quantity;
    totalMemberAmount += item.memberPrice * item.quantity;

    if (item.selected) {
      selectedCount += item.quantity;
      selectedAmount += item.price * item.quantity;
      selectedMemberAmount += item.memberPrice * item.quantity;
    }
  }

  var goodsAmount = isMember ? selectedMemberAmount : selectedAmount;
  var promoResult = calculatePromotionDiscount(goodsAmount);

  return {
    totalCount: totalCount,
    totalAmount: Math.round(totalAmount * 100) / 100,
    totalMemberAmount: Math.round(totalMemberAmount * 100) / 100,
    selectedCount: selectedCount,
    selectedAmount: Math.round(selectedAmount * 100) / 100,
    selectedMemberAmount: Math.round(selectedMemberAmount * 100) / 100,
    goodsAmount: Math.round(goodsAmount * 100) / 100,
    promotionDiscount: promoResult.discount,
    promotion: promoResult.promotion,
    finalAmount: Math.round((goodsAmount - promoResult.discount) * 100) / 100
  };
}

// ==================== 茶文化知识库 ====================

const KNOWLEDGE_CATEGORIES = [
  {
    key: 'variety',
    name: '桂花品种科普',
    icon: '🌼',
    color: '#DAA520',
    description: '四大桂花品种详解，认识金桂、银桂、丹桂、四季桂'
  },
  {
    key: 'scenting',
    name: '窨制工艺解读',
    icon: '🫖',
    color: '#2E8B57',
    description: '非遗窨制技艺全流程，了解六窨一提的奥秘'
  },
  {
    key: 'brewing',
    name: '冲泡技巧',
    icon: '🍵',
    color: '#1890FF',
    description: '水温、时长、茶具的完美搭配，泡出最佳风味'
  },
  {
    key: 'solar-term',
    name: '节气饮茶',
    icon: '🌿',
    color: '#52C41A',
    description: '顺应二十四节气，选对茶喝对时'
  },
  {
    key: 'origin',
    name: '产地风土',
    icon: '📍',
    color: '#722ED1',
    description: '武夷山茶园与咸宁桂花之乡的风土人情'
  }
];

const KNOWLEDGE_ARTICLES = [
  {
    id: 'KNOW-VAR-001',
    categoryKey: 'variety',
    varietyName: '金桂',
    title: '金桂：桂花茶中的上品之选',
    subtitle: '花色金黄，香气浓郁持久，窨制桂花茶的首选品种',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=golden%20osmanthus%20flowers%20closeup%20autumn%20sunlight%20premium&image_size=landscape_16_9',
    author: '茶文化研究中心',
    publishTime: '2025-09-15',
    readCount: 12580,
    likeCount: 892,
    tags: ['金桂', '品种科普', '窨茶首选'],
    content: [
      { type: 'heading', level: 2, text: '一、金桂的形态特征' },
      {
        type: 'paragraph',
        text: '金桂（Osmanthus fragrans var. thunbergii）是木犀科木犀属桂花的一个重要变种，因其花色金黄、香气浓郁而得名。树冠呈圆球形，枝条挺拔，树皮为灰白色，叶片为革质椭圆形，叶面深绿有光泽。'
      },
      {
        type: 'image',
        url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=golden%20osmanthus%20tree%20in%20full%20bloom%20autumn%20garden&image_size=landscape_16_9',
        caption: '金秋时节的金桂树，满树金黄'
      },
      { type: 'heading', level: 2, text: '二、金桂的香气特点' },
      {
        type: 'paragraph',
        text: '金桂的花香以"浓郁持久"著称，其香气成分中含有丰富的紫罗兰酮、芳樟醇、橙花叔醇等物质。与其他品种相比，金桂的花香更具穿透力，窨制后能深度融入茶叶之中，饮后口齿留香。'
      },
      {
        type: 'quote',
        text: '叶密千层绿，花开万点金。天香云外飘，吹落满衣襟。—— 古人咏金桂'
      },
      { type: 'heading', level: 2, text: '三、金桂为何是窨茶首选' },
      {
        type: 'paragraph',
        text: '窨制桂花茶，金桂是当之无愧的首选品种。原因有三：'
      },
      {
        type: 'list',
        items: [
          '花香浓郁：金桂的香气强度约为银桂的1.5倍，窨制次数少也能入味',
          '色泽金黄：与茶芽色泽相得益彰，冲泡后茶汤金黄透亮，视觉效果佳',
          '香气稳定：金桂花香物质较稳定，经过多次窨制仍能保持持久余韵'
        ]
      },
      {
        type: 'video',
        poster: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=osmanthus%20tea%20scenting%20process%20workshop%20video%20thumbnail&image_size=landscape_16_9',
        src: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
        caption: '视频：金桂花茶窨制过程全纪录'
      },
      { type: 'heading', level: 2, text: '四、金桂的花期与采摘' },
      {
        type: 'paragraph',
        text: '金桂的花期一般在每年9月中下旬至10月上旬，最佳采摘期为花朵初开的前3天。此时花瓣饱满、香气最盛。采摘需选晴天上午，露水散去后进行，以保证花朵完整和香气纯正。'
      },
      {
        type: 'image',
        url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=hand%20picking%20golden%20osmanthus%20flowers%20traditional%20harvest&image_size=landscape_16_9',
        caption: '人工采摘初开的金桂花，确保花朵完整无损'
      },
      { type: 'heading', level: 2, text: '五、代表产品推荐' },
      {
        type: 'paragraph',
        text: '本平台溯源产品中的 G001（金桂花茶100g装）、G003（金桂花茶礼盒装）、G004（金桂便携装）均采用咸宁金桂为原料，欢迎扫码查看完整溯源信息。'
      }
    ],
    relatedTraceIds: ['G001', 'G003', 'G004']
  },
  {
    id: 'KNOW-VAR-002',
    categoryKey: 'variety',
    varietyName: '银桂',
    title: '银桂：清雅淡香的气质之选',
    subtitle: '花色乳白，香气清雅淡远，口感柔和的小众珍品',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=silver%20white%20osmanthus%20flowers%20delicate%20autumn&image_size=landscape_16_9',
    author: '茶文化研究中心',
    publishTime: '2025-09-12',
    readCount: 8920,
    likeCount: 615,
    tags: ['银桂', '品种科普', '清雅口感'],
    content: [
      { type: 'heading', level: 2, text: '一、银桂的形态特征' },
      {
        type: 'paragraph',
        text: '银桂（Osmanthus fragrans var. latifolius）花色呈乳白色或淡黄白色，花朵较金桂略小，但数量更密集。叶片宽大，树冠较开展，整体气质清雅素净。'
      },
      {
        type: 'image',
        url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=silver%20osmanthus%20tree%20white%20flowers%20gentle%20garden&image_size=landscape_16_9',
        caption: '盛开的银桂树，满树素白清雅'
      },
      { type: 'heading', level: 2, text: '二、银桂的香气特点' },
      {
        type: 'paragraph',
        text: '银桂的香气特点是"清雅淡远"，初闻不浓，但细细品味有清甜之感，余韵悠长。其香气成分中含有较多的芳樟醇和香叶醇，口感如幽兰般清远，适合不喜浓烈的茶友。'
      },
      { type: 'heading', level: 2, text: '三、银桂茶的适用场景' },
      {
        type: 'list',
        items: [
          '日常办公饮用：香气清雅不扰人',
          '晨间茶饮：清甜开启一天好心情',
          '夜晚小酌：清淡不影响睡眠',
          '待客入门款：接受度高，大众口味'
        ]
      },
      {
        type: 'quote',
        text: '淡妆浓抹总相宜，银桂清韵最宜人。'
      }
    ],
    relatedTraceIds: ['G002']
  },
  {
    id: 'KNOW-VAR-003',
    categoryKey: 'variety',
    varietyName: '丹桂',
    title: '丹桂：橙红热烈的观赏名品',
    subtitle: '花色橙红，香气馥郁浓烈，桂花中的名贵观赏品种',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=red%20orange%20dan%20gui%20osmanthus%20flowers%20vibrant&image_size=landscape_16_9',
    author: '茶文化研究中心',
    publishTime: '2025-09-08',
    readCount: 6540,
    likeCount: 428,
    tags: ['丹桂', '品种科普', '观赏名品'],
    content: [
      { type: 'heading', level: 2, text: '丹桂的独特之美' },
      {
        type: 'paragraph',
        text: '丹桂（Osmanthus fragrans var. aurantiacus）花色橙红至朱红，是桂花中颜色最艳丽的品种。因其花色喜庆，常被用于园林造景和庭院观赏。香气馥郁浓烈，带有微微的甜腻感。'
      },
      {
        type: 'image',
        url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=orange%20red%20osmanthus%20flowers%20autumn%20garden%20vibrant&image_size=landscape_16_9',
        caption: '丹桂盛放，橙红似火，美不胜收'
      },
      { type: 'heading', level: 2, text: '丹桂在窨茶中的应用' },
      {
        type: 'paragraph',
        text: '由于丹桂花色艳丽，窨制后茶中会保留淡淡的橙红色花萼，视觉效果独特。但其香气较金桂略显甜腻，因此常与金桂按比例混合窨制，兼具色泽与香气。'
      }
    ],
    relatedTraceIds: []
  },
  {
    id: 'KNOW-SCE-001',
    categoryKey: 'scenting',
    title: '窨制工艺全解读：六窨一提是如何做到的',
    subtitle: '非遗传承600年的桂花茶窨制技艺，每一步都大有讲究',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=traditional%20tea%20scenting%20workshop%20artisan%20osmanthus&image_size=landscape_16_9',
    author: '非遗传承人 · 李师傅',
    publishTime: '2025-09-10',
    readCount: 15620,
    likeCount: 1256,
    tags: ['窨制工艺', '非遗', '六窨一提'],
    content: [
      { type: 'heading', level: 2, text: '一、什么是窨制？' },
      {
        type: 'paragraph',
        text: '窨制（xūn zhì），也叫熏制，是花茶制作的核心工艺。简单来说，就是利用茶叶的吸附性和鲜花的吐香性，将二者按比例拌合静置，让茶叶吸收花香，再将花渣筛除的过程。'
      },
      { type: 'heading', level: 2, text: '二、窨制的六大核心步骤' },
      {
        type: 'list',
        items: [
          '备料：精选茶坯与新鲜桂花，茶坯需干燥冷却至室温',
          '拌花：按1:4或1:5的配比均匀拌合，动作轻柔避免损伤花朵',
          '窨制：恒温恒湿（30℃/72%RH）环境下静置窨香，让茶叶充分吸香',
          '通花：适时翻动通风散热，防止闷黄变质，保持花与茶的活性',
          '起花：用筛网分离茶叶与花渣，去除残花避免苦涩',
          '干燥：低温烘干（80℃以下）锁住花香，便于保存'
        ]
      },
      {
        type: 'image',
        url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=tea%20master%20mixing%20osmanthus%20flowers%20with%20tea%20leaves%20traditional&image_size=landscape_16_9',
        caption: '非遗传承人李师傅正在拌花，60年窨制经验练就的手感'
      },
      { type: 'heading', level: 2, text: '三、什么是"六窨一提"' },
      {
        type: 'paragraph',
        text: '"六窨一提"是指窨制6次，最后1次用少量高品质桂花"提花"（不再筛除）。窨制次数越多，茶叶吸香越充分，层次感越丰富，但成本也越高。'
      },
      {
        type: 'quote',
        text: '一窨花香浮于表，二窨香入茶骨，三窨四窨层叠生，五窨六窨入骨髓，提花收得满壶春。—— 窨制工艺口诀'
      },
      {
        type: 'video',
        poster: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=6%20times%20tea%20scenting%20process%20infographic%20video%20thumbnail&image_size=landscape_16_9',
        src: 'https://media.w3.org/2010/05/bunny/trailer.mp4',
        caption: '视频：六窨一提工艺动画演示（3分钟版）'
      },
      { type: 'heading', level: 2, text: '四、不同窨次的口感差异' },
      {
        type: 'paragraph',
        text: '3窨以下：香气浅，入口即散，适合喜欢淡口的人'
      },
      {
        type: 'paragraph',
        text: '4-5窨：香气均衡，有一定层次感，大众首选（如本平台G001产品为5窨）'
      },
      {
        type: 'paragraph',
        text: '6窨以上：香气绵密悠长，饮后半小时仍有余香，属于高端收藏级（如本平台G003礼盒为6窨）'
      },
      {
        type: 'image',
        url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=osmanthus%20tea%20brewing%20different%20scenting%20levels%20comparison&image_size=landscape_16_9',
        caption: '左：3窨银桂，中：5窨金桂，右：6窨金桂（汤色与香气层次递增）'
      }
    ],
    relatedTraceIds: ['G001', 'G003']
  },
  {
    id: 'KNOW-SCE-002',
    categoryKey: 'scenting',
    title: '温度与湿度：窨制成败的关键参数',
    subtitle: '为什么要控制在30℃和72%湿度？老师傅告诉你答案',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=tea%20scenting%20temperature%20humidity%20control%20room&image_size=landscape_16_9',
    author: '窨制工艺组',
    publishTime: '2025-09-05',
    readCount: 7820,
    likeCount: 512,
    tags: ['窨制工艺', '温湿度', '技术参数'],
    content: [
      { type: 'heading', level: 2, text: '温度：30℃是黄金数值' },
      {
        type: 'paragraph',
        text: '桂花吐香的最佳温度范围是28-32℃，低于25℃花朵闭合，香气无法释放；高于35℃花朵容易腐烂变味。我们将窨制车间精准控制在30℃±1℃，确保花香充分释放而不变质。'
      },
      { type: 'heading', level: 2, text: '湿度：72%RH的科学依据' },
      {
        type: 'paragraph',
        text: '茶叶吸香需要一定的含水率作为载体。72%的相对湿度能让茶坯含水率保持在8-9%之间，此时茶叶的毛细管充分张开，吸附效率最高。湿度过低吸香不足，过高则茶叶容易霉变。'
      }
    ],
    relatedTraceIds: ['G001', 'G002']
  },
  {
    id: 'KNOW-BRW-001',
    categoryKey: 'brewing',
    title: '桂花茶冲泡指南：水温、时长、茶具的黄金搭配',
    subtitle: '掌握这5个要点，在家也能泡出茶店级别的桂花茶',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=osmanthus%20tea%20brewing%20guide%20glass%20cup%20elegant&image_size=landscape_16_9',
    author: '高级茶艺师 · 陈老师',
    publishTime: '2025-09-18',
    readCount: 23560,
    likeCount: 2180,
    tags: ['冲泡技巧', '入门必读', '茶艺'],
    content: [
      { type: 'heading', level: 2, text: '一、水温：85℃-90℃是黄金区间' },
      {
        type: 'paragraph',
        text: '水温过高（95℃以上）会烫熟桂花，使花香挥发过快，产生闷味；水温过低（80℃以下）则茶叶内含物释放不足，茶汤寡淡。推荐将开水晾凉1-2分钟，约85℃时冲泡最佳。'
      },
      {
        type: 'image',
        url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=pouring%20hot%20water%2085%20degrees%20osmanthus%20tea%20glass&image_size=landscape_16_9',
        caption: '沿杯壁缓缓注入85℃热水'
      },
      { type: 'heading', level: 2, text: '二、时长：首泡2分钟，后续每泡加30秒' },
      {
        type: 'paragraph',
        text: '首泡2分钟能充分释放桂花香和茶味。桂花茶一般可续泡4-6次，从第二泡开始每泡延长30秒，保持口感稳定。切记不要长时间闷泡，否则茶汤会苦涩。'
      },
      { type: 'heading', level: 2, text: '三、茶具：玻璃杯或白瓷盖碗' },
      {
        type: 'list',
        items: [
          '玻璃杯：观赏性最佳，能看到茶汤金黄透亮、桂花舒展的姿态',
          '白瓷盖碗：聚香效果好，适合细细品鉴香气层次',
          '保温杯：日常办公使用，但温度过高会焖坏香气，建议用前先温杯不盖盖'
        ]
      },
      { type: 'heading', level: 2, text: '四、用量：每杯3-5克' },
      {
        type: 'paragraph',
        text: '1人饮用：3克（约1茶匙）；2-3人分享：5-8克。金桂浓郁可少放，银桂清淡可酌加。'
      },
      { type: 'heading', level: 2, text: '五、进阶技巧：三步温杯法' },
      {
        type: 'video',
        poster: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=three%20step%20tea%20warming%20method%20tutorial%20thumbnail&image_size=landscape_16_9',
        src: 'https://media.w3.org/2010/05/video/movie_300.mp4',
        caption: '视频：茶艺师演示三步温杯法冲泡桂花茶'
      },
      {
        type: 'paragraph',
        text: '温杯 → 投茶闻干香 → 注水高冲 → 静置出汤。四步下来，一杯花香馥郁的桂花茶就完成了。'
      },
      {
        type: 'quote',
        text: '泡茶的过程，也是静心的过程。水温、时长、心境，三者合一，方得好茶。'
      }
    ],
    relatedTraceIds: []
  },
  {
    id: 'KNOW-BRW-002',
    categoryKey: 'brewing',
    title: '冷泡桂花茶：夏日消暑的清新选择',
    subtitle: '拒绝燥热，4℃冷藏8小时，解锁桂花茶的另一种打开方式',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cold%20brew%20osmanthus%20tea%20summer%20refreshing%20ice&image_size=landscape_16_9',
    author: '夏日茶饮研发组',
    publishTime: '2025-08-20',
    readCount: 11250,
    likeCount: 980,
    tags: ['冲泡技巧', '冷泡', '夏日饮品'],
    content: [
      { type: 'heading', level: 2, text: '为什么夏天推荐冷泡？' },
      {
        type: 'paragraph',
        text: '高温冲泡会释放茶叶中的咖啡因和苦涩物质，而冷水慢泡能减少苦涩，同时保留更多甘甜和花香。冷泡桂花茶入口清甜，冰镇后更是消暑佳品。'
      },
      { type: 'heading', level: 2, text: '冷泡步骤（超级简单）' },
      {
        type: 'list',
        items: [
          '取5克桂花茶，投入冷泡茶壶或矿泉水瓶',
          '加入500ml常温纯净水（建议山泉水）',
          '轻轻摇晃几下，让茶叶充分浸湿',
          '放入冰箱冷藏，4℃静置6-8小时',
          '取出即可饮用，也可加入冰块或蜂蜜调味'
        ]
      }
    ],
    relatedTraceIds: []
  },
  {
    id: 'KNOW-SOL-001',
    categoryKey: 'solar-term',
    title: '秋分饮桂香：一年中桂花茶最好的时节',
    subtitle: '金风送爽桂花香，秋分时节饮桂花茶的养生之道',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=autumn%20equinox%20osmanthus%20tea%20chinese%20traditional%20garden&image_size=landscape_16_9',
    author: '中医养生顾问 · 王医师',
    publishTime: '2025-09-23',
    readCount: 9860,
    likeCount: 875,
    tags: ['节气饮茶', '秋分', '养生'],
    content: [
      { type: 'heading', level: 2, text: '秋分养生：润肺防燥是关键' },
      {
        type: 'paragraph',
        text: '秋分时节，天气转凉，空气干燥。中医认为秋属金，对应肺脏，此时最易感受燥邪。桂花性温味辛，有温中散寒、化痰止咳、润肺养生之效，是秋季茶饮的不二之选。'
      },
      {
        type: 'quote',
        text: '秋三月，此谓容平。天气以急，地气以明。早卧早起，与鸡俱兴。——《黄帝内经·素问》'
      },
      { type: 'heading', level: 2, text: '秋分推荐：金桂枸杞茶' },
      {
        type: 'paragraph',
        text: '配方：金桂花茶3克 + 宁夏枸杞5粒 + 红枣2片。85℃冲泡，焖3分钟。温中补气，养肝明目，适合秋分前后早晚温差大的时节饮用。'
      },
      {
        type: 'image',
        url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=osmanthus%20goji%20berry%20tea%20autumn%20wellness%20warm&image_size=landscape_16_9',
        caption: '金桂枸杞红枣茶，秋分养生良品'
      }
    ],
    relatedTraceIds: ['G001']
  },
  {
    id: 'KNOW-SOL-002',
    categoryKey: 'solar-term',
    title: '立春到冬至：二十四节气饮茶全攻略（上）',
    subtitle: '春生夏长秋收冬藏，顺应节气喝茶才是养生之道',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=24%20solar%20terms%20tea%20calendar%20chinese%20traditional&image_size=landscape_16_9',
    author: '中医养生顾问 · 王医师',
    publishTime: '2025-08-15',
    readCount: 18920,
    likeCount: 1560,
    tags: ['节气饮茶', '养生', '二十四节气'],
    content: [
      { type: 'heading', level: 2, text: '春：疏肝解郁，清轻升发' },
      {
        type: 'paragraph',
        text: '立春-雨水-惊蛰-春分-清明-谷雨：春季阳气升发，适合饮用清淡型桂花茶。推荐银桂系列（G002），清雅不浓烈，配少许陈皮或菊花更佳。'
      },
      { type: 'heading', level: 2, text: '夏：清热解暑，生津止渴' },
      {
        type: 'paragraph',
        text: '立夏-小满-芒种-夏至-小暑-大暑：暑热难当，推荐冷泡桂花茶或金桂薄荷茶。冰镇后饮用，消暑解渴的同时花香怡人。'
      },
      { type: 'heading', level: 2, text: '秋：润肺防燥，温中散寒' },
      {
        type: 'paragraph',
        text: '立秋-处暑-白露-秋分-寒露-霜降：秋燥最盛，金桂系列（G001/G003）配枸杞、红枣、黄芪，温补润肺正当时。'
      },
      { type: 'heading', level: 2, text: '冬：温阳暖身，驱寒活血' },
      {
        type: 'paragraph',
        text: '立冬-小雪-大雪-冬至-小寒-大寒：寒冬腊月，金桂配生姜、红糖煮饮，或加桂花黄酒，驱寒暖身，冬日必备。'
      }
    ],
    relatedTraceIds: []
  },
  {
    id: 'KNOW-ORG-001',
    categoryKey: 'origin',
    title: '武夷山：世界文化与自然双遗产的茶树天堂',
    subtitle: '200年古茶树扎根的地方，每一片茶叶都有故事',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=wuyi%20mountain%20tea%20terraces%20misty%20sunrise%20ancient%20trees&image_size=landscape_16_9',
    author: '产地探访记者',
    publishTime: '2025-09-20',
    readCount: 14580,
    likeCount: 1120,
    tags: ['产地风土', '武夷山', '古茶树'],
    content: [
      { type: 'heading', level: 2, text: '一、武夷山的独特地貌' },
      {
        type: 'paragraph',
        text: '武夷山位于福建省西北部，是世界文化与自然双重遗产。典型的丹霞地貌，奇峰林立，九曲溪蜿蜒其间。山间常年云雾缭绕，昼夜温差大，茶树生长缓慢，内含物质积累丰富。'
      },
      {
        type: 'image',
        url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=wuyi%20mountain%20danxia%20landscape%20river%20morning%20mist&image_size=landscape_16_9',
        caption: '武夷山丹霞地貌 · 九曲溪晨雾'
      },
      { type: 'heading', level: 2, text: '二、200年古茶树的故事' },
      {
        type: 'paragraph',
        text: '我们溯源产品的茶底原料，来自武夷山核心产区九龙窠崖壁上的古茶树群。其中编号WH-001的古茶树种于清嘉庆五年（1800年），至今已225年。扎根岩缝之中，汲取岩石矿物精华，造就了独特的"岩骨花香"。'
      },
      {
        type: 'image',
        url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=200%20year%20old%20ancient%20tea%20tree%20wuyi%20mountain%20rock%20crevice&image_size=landscape_16_9',
        caption: '九龙窠崖壁间的200年古茶树（WH-001）'
      },
      { type: 'heading', level: 2, text: '三、明前采摘：一芽二叶的讲究' },
      {
        type: 'paragraph',
        text: '每年清明前3-5天，是古茶树采摘的黄金期。采摘标准极为严格：一芽二叶初展，芽长于叶，长度不超过3厘米。熟练采茶女工一天只能采得鲜叶1-2斤，4-5斤鲜叶才能制出1斤干茶。'
      },
      {
        type: 'video',
        poster: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=tea%20pickers%20ancient%20tea%20trees%20wuyi%20mountain%20spring%20video%20thumbnail&image_size=landscape_16_9',
        src: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
        caption: '纪录片：武夷山古茶园春采纪实'
      }
    ],
    relatedTraceIds: ['G001', 'G003']
  },
  {
    id: 'KNOW-ORG-002',
    categoryKey: 'origin',
    title: '湖北咸宁：中国桂花之乡的百年桂花园',
    subtitle: '50年树龄金桂3000余株，每到中秋香飘数里',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=xianning%20osmanthus%20town%20hundred%20year%20garden%20autumn&image_size=landscape_16_9',
    author: '产地探访记者',
    publishTime: '2025-09-01',
    readCount: 11320,
    likeCount: 890,
    tags: ['产地风土', '咸宁', '桂花之乡'],
    content: [
      { type: 'heading', level: 2, text: '一、为什么咸宁是桂花之乡？' },
      {
        type: 'paragraph',
        text: '咸宁位于湖北省东南部，长江中游南岸。属亚热带季风气候，四季分明，雨量充沛，土壤微酸性，特别适合桂花生长。咸宁桂花种植历史可追溯到唐代，至今已有1300多年，是国家林业局命名的"中国桂花之乡"。'
      },
      {
        type: 'image',
        url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=xianning%20osmanthus%20garden%20aerial%20autumn%20golden%20flowers&image_size=landscape_16_9',
        caption: '咸安区桂花镇王氏百年桂花园航拍（金秋时节）'
      },
      { type: 'heading', level: 2, text: '二、王氏百年桂花园：三代人的坚守' },
      {
        type: 'paragraph',
        text: '我们的桂花原料供应商——王氏百年桂花园，由王氏家族三代人经营。创始人王老先生1973年亲手栽种的第一批金桂，如今已52年树龄，株高6.8米，冠幅5.5米，每年可产鲜花40余公斤。'
      },
      {
        type: 'quote',
        text: '桂花树是有灵性的，你对它好，它就回报你最香的花。—— 王氏第三代传人 王师傅'
      },
      { type: 'heading', level: 2, text: '三、有机种植：不打农药的生态桂花园' },
      {
        type: 'paragraph',
        text: '王氏桂花园坚持有机种植，从不使用除草剂和农药。春季人工除草，夏季生物防虫，秋季腐熟羊粪施肥。桂花盛开时节，满园都是蝴蝶和蜜蜂，生态环境极佳。'
      }
    ],
    relatedTraceIds: ['G001', 'G002', 'G003', 'G004']
  }
];

function getKnowledgeCategories() {
  return JSON.parse(JSON.stringify(KNOWLEDGE_CATEGORIES));
}

function getKnowledgeArticles(options) {
  var list = JSON.parse(JSON.stringify(KNOWLEDGE_ARTICLES));

  if (options && options.categoryKey) {
    list = list.filter(function(a) { return a.categoryKey === options.categoryKey; });
  }

  if (options && options.sortBy) {
    if (options.sortBy === 'readCount') {
      list.sort(function(a, b) { return b.readCount - a.readCount; });
    } else if (options.sortBy === 'publishTime') {
      list.sort(function(a, b) { return b.publishTime.localeCompare(a.publishTime); });
    } else if (options.sortBy === 'likeCount') {
      list.sort(function(a, b) { return b.likeCount - a.likeCount; });
    }
  }

  return list;
}

function getKnowledgeArticle(id) {
  if (!id) return null;
  var normalizedId = id.trim().toUpperCase();
  for (var i = 0; i < KNOWLEDGE_ARTICLES.length; i++) {
    if (KNOWLEDGE_ARTICLES[i].id === normalizedId) {
      return JSON.parse(JSON.stringify(KNOWLEDGE_ARTICLES[i]));
    }
  }
  return null;
}

function getKnowledgeArticleByVariety(varietyName) {
  if (!varietyName) return null;
  for (var i = 0; i < KNOWLEDGE_ARTICLES.length; i++) {
    if (KNOWLEDGE_ARTICLES[i].varietyName === varietyName) {
      return JSON.parse(JSON.stringify(KNOWLEDGE_ARTICLES[i]));
    }
  }
  return null;
}

function getRelatedKnowledgeArticles(traceId, limit) {
  if (!traceId) return [];
  var l = limit || 3;
  var related = [];
  for (var i = 0; i < KNOWLEDGE_ARTICLES.length; i++) {
    var article = KNOWLEDGE_ARTICLES[i];
    if (article.relatedTraceIds && article.relatedTraceIds.indexOf(traceId) !== -1) {
      related.push({
        id: article.id,
        title: article.title,
        subtitle: article.subtitle,
        coverImage: article.coverImage,
        categoryKey: article.categoryKey,
        readCount: article.readCount,
        author: article.author
      });
    }
  }
  related.sort(function(a, b) { return b.readCount - a.readCount; });
  return JSON.parse(JSON.stringify(related.slice(0, l)));
}

function incrementKnowledgeReadCount(id) {
  if (!id) return false;
  var normalizedId = id.trim().toUpperCase();
  for (var i = 0; i < KNOWLEDGE_ARTICLES.length; i++) {
    if (KNOWLEDGE_ARTICLES[i].id === normalizedId) {
      KNOWLEDGE_ARTICLES[i].readCount += 1;
      return true;
    }
  }
  return false;
}

function incrementKnowledgeLikeCount(id) {
  if (!id) return false;
  var normalizedId = id.trim().toUpperCase();
  for (var i = 0; i < KNOWLEDGE_ARTICLES.length; i++) {
    if (KNOWLEDGE_ARTICLES[i].id === normalizedId) {
      KNOWLEDGE_ARTICLES[i].likeCount += 1;
      return true;
    }
  }
  return false;
}

// ==================== 样品流转链数据 ====================

const SAMPLE_TRACE_DATA = {
  'G001': {
    traceId: 'G001',
    sampleNo: 'SAMPLE-G001-001',
    reportNo: 'NTQC-2025-09876',
    steps: [
      {
        type: 'sampling',
        samplingTime: '2025-09-18 09:00:00',
        sampler: '张采样员',
        sealNo: 'SEAL-G001-001',
        photos: [
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=tea%20sample%20collection%20field%20sampling%20process&image_size=square'
        ],
        signature: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=handwritten%20signature%20on%20digital%20pad&image_size=square',
        isAbnormal: false,
        abnormalReason: ''
      },
      {
        type: 'sealing',
        sealNo: 'SEAL-G001-001',
        sealTime: '2025-09-18 09:30:00',
        sealPhotos: [
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=sealed%20tea%20sample%20evidence%20bag%20tamper%20proof&image_size=square'
        ],
        signature: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=handwritten%20signature%20on%20digital%20pad&image_size=square',
        isAbnormal: false,
        abnormalReason: ''
      },
      {
        type: 'delivery',
        logisticsCompany: '顺丰速运',
        trackingNo: 'SF20250918001',
        deliveryTime: '2025-09-18 10:00:00',
        arrivalTime: '2025-09-19 08:00:00',
        transitStops: ['武汉中转站'],
        photos: [
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=logistics%20delivery%20package%20shipping%20tea%20sample&image_size=square'
        ],
        isAbnormal: false,
        abnormalReason: ''
      },
      {
        type: 'labReceipt',
        receiptTime: '2025-09-19 09:00:00',
        receiver: '李签收员',
        sampleCondition: '样品完好，封条完整',
        photos: [
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=laboratory%20sample%20receipt%20inspection%20check&image_size=square'
        ],
        signature: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=handwritten%20signature%20on%20digital%20pad&image_size=square',
        isAbnormal: false,
        abnormalReason: ''
      },
      {
        type: 'testStart',
        startTime: '2025-09-19 14:00:00',
        tester: '王检测师',
        labRoom: '检测一室',
        photos: [
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=laboratory%20pesticide%20residue%20testing%20equipment&image_size=square'
        ],
        signature: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=handwritten%20signature%20on%20digital%20pad&image_size=square',
        isAbnormal: false,
        abnormalReason: ''
      },
      {
        type: 'testComplete',
        completeTime: '2025-09-20 16:00:00',
        reportNo: 'NTQC-2025-09876',
        result: '合格',
        photos: [
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=test%20report%20document%20laboratory%20results&image_size=square'
        ],
        signature: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=handwritten%20signature%20on%20digital%20pad&image_size=square',
        isAbnormal: false,
        abnormalReason: ''
      }
    ]
  },
  'G002': {
    traceId: 'G002',
    sampleNo: 'SAMPLE-G002-001',
    reportNo: 'HBAQ-2025-12345',
    steps: [
      {
        type: 'sampling',
        samplingTime: '2025-09-23 09:30:00',
        sampler: '赵采样员',
        sealNo: 'SEAL-G002-001',
        photos: [
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=tea%20sample%20collection%20silver%20osmanthus&image_size=square'
        ],
        signature: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=handwritten%20signature%20on%20digital%20pad&image_size=square',
        isAbnormal: false,
        abnormalReason: ''
      },
      {
        type: 'sealing',
        sealNo: 'SEAL-G002-001',
        sealTime: '2025-09-23 10:00:00',
        sealPhotos: [
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=sealed%20tea%20sample%20evidence%20bag%20security&image_size=square'
        ],
        signature: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=handwritten%20signature%20on%20digital%20pad&image_size=square',
        isAbnormal: false,
        abnormalReason: ''
      },
      {
        type: 'delivery',
        logisticsCompany: '京东物流',
        trackingNo: 'JD20250923001',
        deliveryTime: '2025-09-23 11:00:00',
        arrivalTime: '2025-09-25 15:00:00',
        transitStops: ['武汉中转站', '长沙中转站', '广州中转站'],
        photos: [
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=delayed%20logistics%20delivery%20package%20transit&image_size=square'
        ],
        isAbnormal: true,
        abnormalReason: '物流延迟，样品超过48小时送达'
      },
      {
        type: 'labReceipt',
        receiptTime: '2025-09-25 16:00:00',
        receiver: '孙签收员',
        sampleCondition: '样品外观正常，封条完整',
        photos: [
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=laboratory%20sample%20receipt%20check%20inspection&image_size=square'
        ],
        signature: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=handwritten%20signature%20on%20digital%20pad&image_size=square',
        isAbnormal: false,
        abnormalReason: ''
      },
      {
        type: 'testStart',
        startTime: '2025-09-26 09:00:00',
        tester: '周检测师',
        labRoom: '检测二室',
        photos: [
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=laboratory%20pesticide%20residue%20testing%20chromatography&image_size=square'
        ],
        signature: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=handwritten%20signature%20on%20digital%20pad&image_size=square',
        isAbnormal: false,
        abnormalReason: ''
      },
      {
        type: 'testComplete',
        completeTime: '2025-09-27 17:00:00',
        reportNo: 'HBAQ-2025-12345',
        result: '不合格',
        photos: [
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=failing%20test%20report%20abnormal%20laboratory%20results&image_size=square'
        ],
        signature: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=handwritten%20signature%20on%20digital%20pad&image_size=square',
        isAbnormal: false,
        abnormalReason: ''
      }
    ]
  },
  'G003': {
    traceId: 'G003',
    sampleNo: 'SAMPLE-G003-001',
    reportNo: 'NTQC-2025-09877',
    steps: [
      {
        type: 'sampling',
        samplingTime: '2025-09-18 10:00:00',
        sampler: '张采样员',
        sealNo: 'SEAL-G003-001',
        photos: [
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=premium%20tea%20sample%20collection%20gift%20box%20grade&image_size=square'
        ],
        signature: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=handwritten%20signature%20on%20digital%20pad&image_size=square',
        isAbnormal: false,
        abnormalReason: ''
      },
      {
        type: 'sealing',
        sealNo: 'SEAL-G003-001',
        sealTime: '2025-09-18 10:30:00',
        sealPhotos: [
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=sealed%20premium%20tea%20sample%20evidence%20bag&image_size=square'
        ],
        signature: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=handwritten%20signature%20on%20digital%20pad&image_size=square',
        isAbnormal: false,
        abnormalReason: ''
      },
      {
        type: 'delivery',
        logisticsCompany: '顺丰速运',
        trackingNo: 'SF20250918002',
        deliveryTime: '2025-09-18 11:00:00',
        arrivalTime: '2025-09-19 09:00:00',
        transitStops: ['武汉中转站'],
        photos: [
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=express%20delivery%20premium%20tea%20sample%20package&image_size=square'
        ],
        isAbnormal: false,
        abnormalReason: ''
      },
      {
        type: 'labReceipt',
        receiptTime: '2025-09-19 10:00:00',
        receiver: '李签收员',
        sampleCondition: '样品完好，封条完整',
        photos: [
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=laboratory%20sample%20receipt%20check%20intact&image_size=square'
        ],
        signature: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=handwritten%20signature%20on%20digital%20pad&image_size=square',
        isAbnormal: false,
        abnormalReason: ''
      },
      {
        type: 'testStart',
        startTime: '2025-09-19 14:30:00',
        tester: '王检测师',
        labRoom: '检测一室',
        photos: [
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=laboratory%20tea%20quality%20testing%20equipment%20gc%20ms&image_size=square'
        ],
        signature: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=handwritten%20signature%20on%20digital%20pad&image_size=square',
        isAbnormal: false,
        abnormalReason: ''
      },
      {
        type: 'testComplete',
        completeTime: '2025-09-20 17:00:00',
        reportNo: 'NTQC-2025-09877',
        result: '合格',
        photos: [
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=test%20report%20document%20qualified%20results%20official&image_size=square'
        ],
        signature: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=handwritten%20signature%20on%20digital%20pad&image_size=square',
        isAbnormal: false,
        abnormalReason: ''
      }
    ]
  },
  'G004': {
    traceId: 'G004',
    sampleNo: 'SAMPLE-G004-001',
    reportNo: 'NTQC-2025-09878',
    steps: [
      {
        type: 'sampling',
        samplingTime: '2025-09-18 11:00:00',
        sampler: '刘采样员',
        sealNo: 'SEAL-G004-001',
        photos: [
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=tea%20sample%20collection%20portable%20packaging&image_size=square'
        ],
        signature: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=handwritten%20signature%20on%20digital%20pad&image_size=square',
        isAbnormal: false,
        abnormalReason: ''
      },
      {
        type: 'sealing',
        sealNo: 'SEAL-G004-001',
        sealTime: '2025-09-18 11:30:00',
        sealPhotos: [
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=sealed%20tea%20sample%20security%20bag%20tamper%20evident&image_size=square'
        ],
        signature: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=handwritten%20signature%20on%20digital%20pad&image_size=square',
        isAbnormal: false,
        abnormalReason: ''
      },
      {
        type: 'delivery',
        logisticsCompany: '顺丰速运',
        trackingNo: 'SF20250918003',
        deliveryTime: '2025-09-18 13:00:00',
        arrivalTime: '2025-09-19 10:00:00',
        transitStops: ['武汉中转站'],
        photos: [
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=logistics%20delivery%20tea%20sample%20package%20shipping&image_size=square'
        ],
        isAbnormal: false,
        abnormalReason: ''
      },
      {
        type: 'labReceipt',
        receiptTime: '2025-09-19 11:00:00',
        receiver: '李签收员',
        sampleCondition: '样品完好，封条完整',
        photos: [
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=laboratory%20sample%20intact%20receipt%20inspection&image_size=square'
        ],
        signature: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=handwritten%20signature%20on%20digital%20pad&image_size=square',
        isAbnormal: false,
        abnormalReason: ''
      },
      {
        type: 'testStart',
        startTime: '2025-09-19 15:00:00',
        tester: '王检测师',
        labRoom: '检测一室',
        photos: [
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=laboratory%20tea%20pesticide%20testing%20equipment%20hplc&image_size=square'
        ],
        signature: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=handwritten%20signature%20on%20digital%20pad&image_size=square',
        isAbnormal: false,
        abnormalReason: ''
      },
      {
        type: 'testComplete',
        completeTime: '2025-09-20 18:00:00',
        reportNo: 'NTQC-2025-09878',
        result: '合格',
        photos: [
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=qualified%20test%20report%20document%20laboratory&image_size=square'
        ],
        signature: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=handwritten%20signature%20on%20digital%20pad&image_size=square',
        isAbnormal: false,
        abnormalReason: ''
      }
    ]
  },
  'G005': {
    traceId: 'G005',
    sampleNo: 'SAMPLE-G005-001',
    reportNo: 'NTQC-2025-09999',
    steps: [
      {
        type: 'sampling',
        samplingTime: '2025-09-22 09:00:00',
        sampler: '陈采样员',
        sealNo: 'SEAL-G005-001',
        photos: [
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=tea%20sample%20collection%20field%20osmanthus%20variety&image_size=square'
        ],
        signature: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=handwritten%20signature%20on%20digital%20pad&image_size=square',
        isAbnormal: false,
        abnormalReason: ''
      },
      {
        type: 'sealing',
        sealNo: 'SEAL-G005-001',
        sealTime: '2025-09-22 09:30:00',
        sealPhotos: [
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=sealed%20sample%20bag%20security%20seal%20intact&image_size=square'
        ],
        signature: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=handwritten%20signature%20on%20digital%20pad&image_size=square',
        isAbnormal: false,
        abnormalReason: ''
      },
      {
        type: 'delivery',
        logisticsCompany: '中通快递',
        trackingNo: 'ZT20250922001',
        deliveryTime: '2025-09-22 10:30:00',
        arrivalTime: '2025-09-23 14:00:00',
        transitStops: ['咸宁中转站', '武汉中转站'],
        photos: [
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=logistics%20delivery%20package%20transit%20express&image_size=square'
        ],
        isAbnormal: false,
        abnormalReason: ''
      },
      {
        type: 'labReceipt',
        receiptTime: '2025-09-23 15:00:00',
        receiver: '吴签收员',
        sampleCondition: '样品外包装破损，已拍照留证',
        photos: [
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=damaged%20sample%20package%20broken%20outer%20packaging&image_size=square'
        ],
        signature: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=handwritten%20signature%20on%20digital%20pad&image_size=square',
        isAbnormal: true,
        abnormalReason: '样品外包装破损，签收时已拍照留证'
      },
      {
        type: 'testStart',
        startTime: '2025-09-24 09:00:00',
        tester: '郑检测师',
        labRoom: '检测三室',
        photos: [
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=laboratory%20testing%20equipment%20sample%20analysis&image_size=square'
        ],
        signature: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=handwritten%20signature%20on%20digital%20pad&image_size=square',
        isAbnormal: false,
        abnormalReason: ''
      },
      {
        type: 'testComplete',
        completeTime: '2025-09-25 16:30:00',
        reportNo: 'NTQC-2025-09999',
        result: '合格',
        photos: [
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=test%20report%20document%20qualified%20official%20results&image_size=square'
        ],
        signature: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=handwritten%20signature%20on%20digital%20pad&image_size=square',
        isAbnormal: false,
        abnormalReason: ''
      }
    ]
  }
};

function getSampleTrace(traceId) {
  if (!traceId || typeof traceId !== 'string') return null;
  var normalizedId = traceId.trim().toUpperCase();
  if (!SAMPLE_TRACE_DATA[normalizedId]) return null;
  return JSON.parse(JSON.stringify(SAMPLE_TRACE_DATA[normalizedId]));
}

// ==================== 全链路供应链时间轴数据 ====================

function maskOperator(name) {
  if (!name || name.length <= 1) return name;
  if (name.length === 2) return name.charAt(0) + '*';
  return name.charAt(0) + '*'.repeat(name.length - 2) + name.charAt(name.length - 1);
}

const SUPPLY_CHAIN_TIMELINE = {
  'G001': {
    traceId: 'G001',
    batchNo: 'GH202503',
    productName: '金桂花茶',
    timeline: [
      {
        id: 'soil-test',
        type: 'soil_test',
        title: '土壤检测',
        icon: '🌱',
        time: '2025-03-15 09:30:00',
        location: '福建省武夷山百年茶树园',
        operator: '王农艺师',
        operatorMasked: maskOperator('王农艺师'),
        photos: [
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=soil%20testing%20in%20tea%20garden%20laboratory%20equipment&image_size=square',
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=soil%20sample%20collection%20tea%20plantation&image_size=square'
        ],
        onChain: true,
        chainHash: '0x1a2b3c...4d5e6f',
        isAbnormal: false,
        abnormalReason: '',
        detail: {
          ph: 5.8,
          organicMatter: '28.5 g/kg',
          nitrogen: '158 mg/kg',
          phosphorus: '22.3 mg/kg',
          potassium: '186 mg/kg',
          conclusion: '土壤肥力优良，适宜茶树生长'
        }
      },
      {
        id: 'fertilizer',
        type: 'fertilizer',
        title: '施肥记录',
        icon: '💧',
        time: '2025-03-20 08:00:00',
        location: '福建省武夷山百年茶树园',
        operator: '李师傅',
        operatorMasked: maskOperator('李师傅'),
        photos: [
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=organic%20fertilizer%20application%20tea%20garden%20natural&image_size=square'
        ],
        onChain: true,
        chainHash: '0x7f8e9d...0a1b2c',
        isAbnormal: false,
        abnormalReason: '',
        detail: {
          fertilizerType: '腐熟羊粪有机肥',
          amount: '150 kg/亩',
          method: '环沟施肥法',
          note: '配合春季养护，促进春梢萌发'
        }
      },
      {
        id: 'osmanthus-pick',
        type: 'osmanthus_pick',
        title: '桂花采摘',
        icon: '🌼',
        time: '2025-09-08 06:30:00',
        location: '湖北省咸宁市桂花镇百年桂花园',
        operator: '王氏采摘队',
        operatorMasked: maskOperator('王氏采摘队'),
        photos: [
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=osmanthus%20flower%20picking%20autumn%20golden%20garden%20workers&image_size=square',
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=fresh%20golden%20osmanthus%20flowers%20harvest%20basket&image_size=square'
        ],
        onChain: true,
        chainHash: '0x3d4e5f...6a7b8c',
        isAbnormal: false,
        abnormalReason: '',
        detail: {
          variety: '金桂',
          quantity: '42.8 kg',
          quality: '初开盛花，完整度98%',
          weather: '晴，18℃~26℃'
        }
      },
      {
        id: 'tea-pick',
        type: 'tea_pick',
        title: '茶叶采摘',
        icon: '🍃',
        time: '2025-04-20 07:00:00',
        location: '福建省武夷山百年茶树园',
        operator: '李氏家族采茶队',
        operatorMasked: maskOperator('李氏家族采茶队'),
        photos: [
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=tea%20leaves%20picking%20mountain%20terrace%20morning%20mist&image_size=square',
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=fresh%20tea%20buds%20hand%20picked%20premium%20quality&image_size=square'
        ],
        onChain: true,
        chainHash: '0x9e0f1a...2b3c4d',
        isAbnormal: false,
        abnormalReason: '',
        detail: {
          standard: '一芽二叶',
          quantity: '10.2 kg（鲜叶）',
          grade: '特级',
          weather: '晴转多云，16℃~24℃'
        }
      },
      {
        id: 'scenting',
        type: 'scenting',
        title: '窨制',
        icon: '🫖',
        time: '2025-09-12 08:00:00',
        location: '湖北省武汉市非遗窨制工艺加工厂',
        operator: '李大师',
        operatorMasked: maskOperator('李大师'),
        photos: [
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=tea%20scenting%20process%20traditional%20workshop%20osmanthus&image_size=square',
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=master%20artisan%20inspecting%20tea%20scenting%20quality&image_size=square'
        ],
        onChain: true,
        chainHash: '0x5a6b7c...8d9e0f',
        isAbnormal: false,
        abnormalReason: '',
        detail: {
          scentingTimes: 5,
          totalDuration: '25小时',
          temperature: '27℃~30℃',
          humidity: '70%~73%',
          ratio: '1:5（桂花:茶叶）',
          note: '传承600年窨制技艺，国家级非遗'
        }
      },
      {
        id: 'quality-test',
        type: 'quality_test',
        title: '质检',
        icon: '🔬',
        time: '2025-09-20 10:00:00',
        location: '国家茶叶质量监督检验中心',
        operator: '陈检验员',
        operatorMasked: maskOperator('陈检验员'),
        photos: [
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=tea%20quality%20testing%20laboratory%20scientific%20equipment&image_size=square'
        ],
        onChain: true,
        chainHash: '0x1e2f3a...4b5c6d',
        isAbnormal: false,
        abnormalReason: '',
        detail: {
          reportNo: 'NTQC-2025-09876',
          standard: 'GB 2763-2021',
          conclusion: '各项指标合格，农残远低于限值',
          overallScore: 96,
          items: [
            { name: '六六六', result: '<0.01 mg/kg', limit: '0.1 mg/kg', status: '合格' },
            { name: '滴滴涕', result: '<0.01 mg/kg', limit: '0.2 mg/kg', status: '合格' },
            { name: '氯氰菊酯', result: '0.05 mg/kg', limit: '20 mg/kg', status: '合格' }
          ]
        }
      },
      {
        id: 'packaging',
        type: 'packaging',
        title: '包装',
        icon: '📦',
        time: '2025-09-23 14:00:00',
        location: '湖北省武汉市包装车间',
        operator: '张包装组',
        operatorMasked: maskOperator('张包装组'),
        photos: [
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=premium%20tea%20packaging%20line%20clean%20workshop&image_size=square'
        ],
        onChain: true,
        chainHash: '0x7a8b9c...0d1e2f',
        isAbnormal: false,
        abnormalReason: '',
        detail: {
          packageType: '食品级可降解牛皮纸罐',
          specification: '100g/罐',
          batchNo: 'GH202503',
          quantity: '5000罐'
        }
      },
      {
        id: 'outbound',
        type: 'outbound',
        title: '出库',
        icon: '🚚',
        time: '2025-09-25 09:00:00',
        location: '湖北省武汉市中心仓储中心',
        operator: '刘仓管员',
        operatorMasked: maskOperator('刘仓管员'),
        photos: [
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=warehouse%20outbound%20logistics%20pallet%20forklift&image_size=square'
        ],
        onChain: true,
        chainHash: '0x3c4d5e...6f7a8b',
        isAbnormal: false,
        abnormalReason: '',
        detail: {
          orderNo: 'WH20250925001',
          quantity: '5000罐',
          destination: '北京朝阳分仓',
          vehicleNo: '鄂A·12345'
        }
      },
      {
        id: 'logistics',
        type: 'logistics',
        title: '物流节点',
        icon: '📍',
        time: '2025-09-27 16:30:00',
        location: '北京市朝阳区转运中心',
        operator: '京通物流',
        operatorMasked: maskOperator('京通物流'),
        photos: [
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=logistics%20distribution%20center%20parcel%20sorting&image_size=square'
        ],
        onChain: true,
        chainHash: '0x9e0f1a...2b3c4d',
        isAbnormal: true,
        abnormalReason: '预计2025-09-26到达，因交通管制延期1天',
        detail: {
          waybillNo: 'JT20250925000123',
          carrier: '京通物流',
          status: '派送中',
          estimatedDelivery: '2025-09-28',
          currentLocation: '北京市朝阳区',
          temperatureMonitor: {
            hasData: true,
            maxTemp: 37.2,
            minTemp: 22.5,
            avgTemp: 28.3,
            tempWarning: true,
            warningThreshold: 35,
            records: [
              { time: '2025-09-25 10:00', location: '武汉出库', temp: 23.5, status: 'normal' },
              { time: '2025-09-25 16:00', location: '武汉转运中心', temp: 25.2, status: 'normal' },
              { time: '2025-09-26 08:00', location: '郑州转运中心', temp: 37.2, status: 'warning' },
              { time: '2025-09-26 18:00', location: '运输途中', temp: 35.8, status: 'warning' },
              { time: '2025-09-27 08:00', location: '石家庄转运', temp: 28.6, status: 'normal' },
              { time: '2025-09-27 16:30', location: '北京朝阳转运中心', temp: 24.8, status: 'normal' }
            ]
          },
          transitStops: [
            { time: '2025-09-25 10:00', location: '武汉出库', status: '已完成' },
            { time: '2025-09-26 08:00', location: '郑州转运中心', status: '已完成' },
            { time: '2025-09-27 16:30', location: '北京朝阳转运中心', status: '进行中' },
            { time: '2025-09-28', location: '客户签收', status: '待完成' }
          ]
        }
      },
      {
        id: 'signoff',
        type: 'signoff',
        title: '签收',
        icon: '✅',
        time: '2025-09-28 14:20:00',
        location: '北京市朝阳区XX小区',
        operator: '王先生',
        operatorMasked: maskOperator('王先生'),
        photos: [
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=parcel%20delivery%20signature%20customer%20receiving&image_size=square'
        ],
        onChain: true,
        chainHash: '0x5a6b7c...8d9e0f',
        isAbnormal: false,
        abnormalReason: '',
        detail: {
          signMethod: '本人签收',
          rating: 5,
          comment: '包装完好，茶香四溢，品质优良',
          signTime: '2025-09-28 14:20:00'
        }
      }
    ]
  },
  'G002': {
    traceId: 'G002',
    batchNo: 'GH202504',
    productName: '银桂花茶',
    timeline: [
      {
        id: 'soil-test',
        type: 'soil_test',
        title: '土壤检测',
        icon: '🌱',
        time: '2025-03-10 10:00:00',
        location: '福建省武夷山生态茶园B区',
        operator: '陈农艺师',
        operatorMasked: maskOperator('陈农艺师'),
        photos: [
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=soil%20analysis%20eco%20tea%20garden%20testing&image_size=square'
        ],
        onChain: true,
        chainHash: '0x2b3c4d...5e6f7a',
        isAbnormal: true,
        abnormalReason: '原计划3月5日检测，因连续降雨延期5天',
        detail: {
          ph: 6.2,
          organicMatter: '22.3 g/kg',
          nitrogen: '135 mg/kg',
          phosphorus: '18.6 mg/kg',
          potassium: '165 mg/kg',
          conclusion: '土壤肥力良好，需适当补充磷钾肥'
        }
      },
      {
        id: 'fertilizer',
        type: 'fertilizer',
        title: '施肥记录',
        icon: '💧',
        time: '2025-03-18 09:00:00',
        location: '福建省武夷山生态茶园B区',
        operator: '张师傅',
        operatorMasked: maskOperator('张师傅'),
        photos: [
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=natural%20fertilizer%20tea%20garden%20organic%20farming&image_size=square'
        ],
        onChain: true,
        chainHash: '0x8d9e0f...1a2b3c',
        isAbnormal: false,
        abnormalReason: '',
        detail: {
          fertilizerType: '菜籽饼有机肥',
          amount: '120 kg/亩',
          method: '撒施后覆土',
          note: '配合降雨，提高肥效'
        }
      },
      {
        id: 'osmanthus-pick',
        type: 'osmanthus_pick',
        title: '桂花采摘',
        icon: '🌸',
        time: '2025-09-12 07:00:00',
        location: '湖北省咸宁市二组种植园',
        operator: '王氏采摘二队',
        operatorMasked: maskOperator('王氏采摘二队'),
        photos: [
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=silver%20osmanthus%20picking%20white%20flowers%20garden&image_size=square'
        ],
        onChain: true,
        chainHash: '0x4e5f6a...7b8c9d',
        isAbnormal: false,
        abnormalReason: '',
        detail: {
          variety: '银桂',
          quantity: '38.2 kg',
          quality: '初开盛花，完整度96%',
          weather: '多云转晴，17℃~25℃'
        }
      },
      {
        id: 'tea-pick',
        type: 'tea_pick',
        title: '茶叶采摘',
        icon: '🍃',
        time: '2025-04-22 08:00:00',
        location: '福建省武夷山生态茶园B区',
        operator: '红星村采茶组',
        operatorMasked: maskOperator('红星村采茶组'),
        photos: [
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=tea%20harvesting%20eco%20garden%20cloudy%20day&image_size=square'
        ],
        onChain: true,
        chainHash: '0x0a1b2c...3d4e5f',
        isAbnormal: false,
        abnormalReason: '',
        detail: {
          standard: '一芽二叶',
          quantity: '8.5 kg（鲜叶）',
          grade: '一级',
          weather: '多云，15℃~22℃'
        }
      },
      {
        id: 'scenting',
        type: 'scenting',
        title: '窨制',
        icon: '🫖',
        time: '2025-09-17 08:00:00',
        location: '湖北省武汉市桂花茶加工二厂',
        operator: '张师傅',
        operatorMasked: maskOperator('张师傅'),
        photos: [
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=automated%20tea%20scenting%20modern%20factory%20equipment&image_size=square'
        ],
        onChain: true,
        chainHash: '0x6b7c8d...9e0f1a',
        isAbnormal: false,
        abnormalReason: '',
        detail: {
          scentingTimes: 3,
          totalDuration: '18小时',
          temperature: '26℃~28℃',
          humidity: '69%~71%',
          ratio: '1:5（桂花:茶叶）',
          note: '自动化窨制，品质稳定'
        }
      },
      {
        id: 'quality-test',
        type: 'quality_test',
        title: '质检',
        icon: '🔬',
        time: '2025-09-25 11:00:00',
        location: '湖北省农产品质量安全检测中心',
        operator: '刘检验员',
        operatorMasked: maskOperator('刘检验员'),
        photos: [
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=food%20safety%20laboratory%20pesticide%20testing&image_size=square'
        ],
        onChain: true,
        chainHash: '0x2c3d4e...5f6a7b',
        isAbnormal: true,
        abnormalReason: '氯氰菊酯检出值25.5mg/kg，超出国标限值20mg/kg',
        detail: {
          reportNo: 'HBAQ-2025-12345',
          standard: 'GB 2763-2021',
          conclusion: '存在1项指标超标',
          overallScore: 58,
          items: [
            { name: '氯氰菊酯', result: '25.5 mg/kg', limit: '20 mg/kg', status: '不合格' },
            { name: '六六六', result: '<0.01 mg/kg', limit: '0.1 mg/kg', status: '合格' },
            { name: '氯氟氰菊酯', result: '<0.01 mg/kg', limit: '2.0 mg/kg', status: '合格' }
          ]
        }
      },
      {
        id: 'packaging',
        type: 'packaging',
        title: '包装',
        icon: '📦',
        time: '2025-09-28 10:00:00',
        location: '湖北省武汉市包装二车间',
        operator: '李包装组',
        operatorMasked: maskOperator('李包装组'),
        photos: [
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=tea%20product%20packaging%20line%20PET%20jar&image_size=square'
        ],
        onChain: true,
        chainHash: '0x8e9f0a...1b2c3d',
        isAbnormal: false,
        abnormalReason: '',
        detail: {
          packageType: '可回收PET罐',
          specification: '100g/罐',
          batchNo: 'GH202504',
          quantity: '8000罐'
        }
      },
      {
        id: 'outbound',
        type: 'outbound',
        title: '出库',
        icon: '🚚',
        time: '2025-09-30 08:30:00',
        location: '湖北省武汉市区级仓储中心',
        operator: '王仓管员',
        operatorMasked: maskOperator('王仓管员'),
        photos: [
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=warehouse%20shipping%20goods%20outbound%20logistics&image_size=square'
        ],
        onChain: true,
        chainHash: '0x4a5b6c...7d8e9f',
        isAbnormal: false,
        abnormalReason: '',
        detail: {
          orderNo: 'WH20250930002',
          quantity: '8000罐',
          destination: '上海浦东分仓',
          vehicleNo: '鄂A·67890'
        }
      },
      {
        id: 'logistics',
        type: 'logistics',
        title: '物流节点',
        icon: '📍',
        time: '2025-10-02 14:00:00',
        location: '上海市浦东新区转运中心',
        operator: '圆通速递',
        operatorMasked: maskOperator('圆通速递'),
        photos: [
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=express%20delivery%20sorting%20center%20packages&image_size=square'
        ],
        onChain: true,
        chainHash: '0x0c1d2e...3f4a5b',
        isAbnormal: false,
        abnormalReason: '',
        detail: {
          waybillNo: 'YT20250930000456',
          carrier: '圆通速递',
          status: '已派送',
          estimatedDelivery: '2025-10-03',
          currentLocation: '上海市浦东新区',
          temperatureMonitor: {
            hasData: true,
            maxTemp: 29.8,
            minTemp: 21.2,
            avgTemp: 25.6,
            tempWarning: false,
            warningThreshold: 35,
            records: [
              { time: '2025-09-30 09:00', location: '武汉出库', temp: 23.5, status: 'normal' },
              { time: '2025-09-30 18:00', location: '武汉转运中心', temp: 25.2, status: 'normal' },
              { time: '2025-10-01 12:00', location: '南京转运中心', temp: 28.6, status: 'normal' },
              { time: '2025-10-01 20:00', location: '运输途中', temp: 29.8, status: 'normal' },
              { time: '2025-10-02 08:00', location: '苏州转运', temp: 26.3, status: 'normal' },
              { time: '2025-10-02 14:00', location: '上海浦东转运中心', temp: 24.1, status: 'normal' }
            ]
          },
          transitStops: [
            { time: '2025-09-30 09:00', location: '武汉出库', status: '已完成' },
            { time: '2025-10-01 12:00', location: '南京转运中心', status: '已完成' },
            { time: '2025-10-02 14:00', location: '上海浦东转运中心', status: '已完成' },
            { time: '2025-10-03 10:30', location: '客户签收', status: '待完成' }
          ]
        }
      },
      {
        id: 'signoff',
        type: 'signoff',
        title: '签收',
        icon: '✅',
        time: '2025-10-03 10:30:00',
        location: '上海市浦东新区XX大厦',
        operator: '李女士',
        operatorMasked: maskOperator('李女士'),
        photos: [
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=office%20delivery%20receiving%20parcel%20signature&image_size=square'
        ],
        onChain: true,
        chainHash: '0x6e7f8a...9b0c1d',
        isAbnormal: false,
        abnormalReason: '',
        detail: {
          signMethod: '前台代收',
          rating: 4,
          comment: '包装完好，香气清雅',
          signTime: '2025-10-03 10:30:00'
        }
      }
    ]
  }
};

// ==================== 社区评价体系数据 ====================

const TASTE_TAGS = [
  { key: 'fresh', name: '清香', icon: '🌿', color: '#52C41A' },
  { key: 'mellow', name: '醇厚', icon: '🍵', color: '#DAA520' },
  { key: 'sweet', name: '回甘', icon: '🍯', color: '#FF6B6B' }
];

const RATING_DIMENSIONS = [
  { key: 'aroma', name: '香气', icon: '🌸', description: '花香浓郁程度' },
  { key: 'taste', name: '滋味', icon: '👅', description: '口感醇厚层次' },
  { key: 'value', name: '性价比', icon: '💰', description: '价格与品质匹配度' }
];

const REPORT_REASONS = [
  { key: 'spam', name: '垃圾广告' },
  { key: 'porn', name: '色情低俗' },
  { key: 'violence', name: '暴力内容' },
  { key: 'fake', name: '虚假信息' },
  { key: 'insult', name: '人身攻击' },
  { key: 'other', name: '其他原因' }
];

const REVIEW_AUDIT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

const PRODUCT_REVIEWS = {
  'G001': {
    traceId: 'G001',
    summary: {
      totalCount: 128,
      averageRating: 4.8,
      ratingDistribution: [
        { rating: 5, count: 98, percent: 76.6 },
        { rating: 4, count: 22, percent: 17.2 },
        { rating: 3, count: 5, percent: 3.9 },
        { rating: 2, count: 2, percent: 1.6 },
        { rating: 1, count: 1, percent: 0.8 }
      ],
      dimensionAverages: {
        aroma: 4.9,
        taste: 4.8,
        value: 4.7
      },
      tagStats: [
        { tag: '清香', count: 86 },
        { tag: '醇厚', count: 72 },
        { tag: '回甘', count: 58 }
      ],
      hasImageCount: 45
    },
    reviews: [
      {
        id: 'REV-G001-001',
        traceId: 'G001',
        userId: 'U001',
        userName: '茶韵悠悠',
        userAvatar: 'https://picsum.photos/id/1001/100/100',
        userLevel: 3,
        rating: 5,
        dimensions: {
          aroma: 5,
          taste: 5,
          value: 5
        },
        tasteTags: ['清香', '醇厚', '回甘'],
        content: '这款金桂花茶真的是我喝过最好的！打开罐子就能闻到浓郁的桂花香，冲泡后茶汤金黄透亮，入口先是桂花的清香，然后是茶的醇厚，咽下后还有明显的回甘。五窨一提的工艺果然名不虚传，每一口都能感受到层次感。已经回购三次了，强烈推荐给喜欢花茶的朋友！',
        images: [
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=golden%20osmanthus%20tea%20brewing%20glass%20cup%20closeup%20steam&image_size=square',
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=osmanthus%20tea%20leaves%20closeup%20golden%20flowers&image_size=square',
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=premium%20osmanthus%20tea%20tin%20can%20unboxing&image_size=square'
        ],
        likeCount: 128,
        isLiked: false,
        commentCount: 15,
        createTime: '2025-12-05 14:32:18',
        auditStatus: 'approved',
        isPinned: true,
        isQuality: true,
        isScanVerified: true,
        trustLevel: {
          key: 'verified_purchase',
          name: '已验真购买',
          weight: 10,
          icon: '✓',
          color: '#52C41A',
          bgColor: '#F6FFED',
          borderColor: '#B7EB8F'
        },
        orderInfo: {
          orderId: 'ORD202511200015',
          sku: '100g/罐',
          buyTime: '2025-11-20'
        },
        brandReply: {
          replyId: 'BR-REV-G001-001',
          reviewId: 'REV-G001-001',
          content: '感谢您的用心评价！您的认可是我们最大的动力。我们坚持选用咸宁50年以上树龄金桂，搭配武夷山200年古茶树茶底，传承非遗窨制工艺，只为给您带来最纯正的桂花茶香。期待您继续关注和支持！',
          replyTime: '2025-12-05 16:00:00',
          replierName: '一茶一品官方客服',
          replierAvatar: '',
          isOfficial: true
        }
      },
      {
        id: 'REV-G001-002',
        traceId: 'G001',
        userId: 'U002',
        userName: '山间品茶人',
        userAvatar: 'https://picsum.photos/id/1002/100/100',
        userLevel: 2,
        rating: 5,
        dimensions: {
          aroma: 5,
          taste: 4,
          value: 5
        },
        tasteTags: ['清香', '回甘'],
        content: '作为一个老茶客，这款茶确实让我惊喜。桂花香气很正，不是那种香精调出来的味道，而是天然的花香。茶汤入口顺滑，咽下后喉咙里有甜甜的回甘，很舒服。包装也很精美，送朋友很有面子。唯一小建议是如果能出个更大包装就好了。',
        images: [
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=osmanthus%20tea%20afternoon%20tea%20setting%20traditional&image_size=square'
        ],
        likeCount: 56,
        isLiked: false,
        commentCount: 8,
        createTime: '2025-12-03 09:15:42',
        auditStatus: 'approved',
        isPinned: true,
        isQuality: true,
        isScanVerified: false,
        trustLevel: {
          key: 'regular_purchase',
          name: '普通购买',
          weight: 5,
          icon: '🛒',
          color: '#1890FF',
          bgColor: '#E6F7FF',
          borderColor: '#91D5FF'
        },
        orderInfo: {
          orderId: 'ORD202511150008',
          sku: '250g/礼盒装',
          buyTime: '2025-11-15'
        }
      },
      {
        id: 'REV-G001-003',
        traceId: 'G001',
        userId: 'U003',
        userName: '小叶子',
        userAvatar: 'https://picsum.photos/id/1003/100/100',
        userLevel: 1,
        rating: 4,
        dimensions: {
          aroma: 4,
          taste: 4,
          value: 4
        },
        tasteTags: ['醇厚'],
        content: '第一次买这个牌子的桂花茶，整体还不错。香气很浓，第一次泡的时候整个办公室都闻到了。口感比较醇厚，适合冬天喝。就是价格稍微有点贵，希望能多搞点活动。',
        images: [],
        likeCount: 23,
        isLiked: false,
        commentCount: 3,
        createTime: '2025-12-01 16:45:33',
        auditStatus: 'approved',
        isPinned: false,
        isQuality: false,
        isScanVerified: false,
        trustLevel: {
          key: 'regular_purchase',
          name: '普通购买',
          weight: 5,
          icon: '🛒',
          color: '#1890FF',
          bgColor: '#E6F7FF',
          borderColor: '#91D5FF'
        },
        orderInfo: {
          orderId: 'ORD202511250023',
          sku: '100g/罐',
          buyTime: '2025-11-25'
        }
      },
      {
        id: 'REV-G001-004',
        traceId: 'G001',
        userId: 'U004',
        userName: '茶香袭人',
        userAvatar: 'https://picsum.photos/id/1004/100/100',
        userLevel: 2,
        rating: 5,
        dimensions: {
          aroma: 5,
          taste: 5,
          value: 4
        },
        tasteTags: ['清香', '醇厚'],
        content: '送给妈妈的生日礼物，她特别喜欢！说打开包装就闻到很香的桂花味，泡出来的茶颜色好看，味道也好。包装很高档，送人很有面子。溯源功能也很有意思，可以看到茶叶从采摘到出厂的全过程，喝着放心。',
        images: [
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=gift%20box%20osmanthus%20tea%20premium%20packaging%20unboxing&image_size=square',
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=golden%20osmanthus%20tea%20glass%20teapot%20pouring&image_size=square'
        ],
        likeCount: 89,
        isLiked: false,
        commentCount: 12,
        createTime: '2025-11-28 11:20:15',
        auditStatus: 'approved',
        isPinned: false,
        isQuality: true,
        isScanVerified: true,
        trustLevel: {
          key: 'verified_purchase',
          name: '已验真购买',
          weight: 10,
          icon: '✓',
          color: '#52C41A',
          bgColor: '#F6FFED',
          borderColor: '#B7EB8F'
        },
        orderInfo: {
          orderId: 'ORD202511180005',
          sku: '250g/礼盒装',
          buyTime: '2025-11-18'
        }
      },
      {
        id: 'REV-G001-005',
        traceId: 'G001',
        userId: null,
        userName: '微信用户',
        userAvatar: '',
        userLevel: 0,
        rating: 4,
        dimensions: {
          aroma: 4,
          taste: 4,
          value: 5
        },
        tasteTags: ['清香'],
        content: '买的便携装，上班喝很方便。独立小包装，一次一袋，不会受潮。味道还可以，桂花味挺香的，下午工作累了泡一杯，提神又解压。性价比不错，会回购。',
        images: [
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=portable%20tea%20sachet%20office%20desk%20brewing&image_size=square'
        ],
        likeCount: 34,
        isLiked: false,
        commentCount: 5,
        createTime: '2025-11-25 14:08:56',
        auditStatus: 'approved',
        isPinned: false,
        isQuality: false,
        isScanVerified: false,
        trustLevel: {
          key: 'anonymous',
          name: '匿名评价',
          weight: 1,
          icon: '👤',
          color: '#8C8C8C',
          bgColor: '#FAFAFA',
          borderColor: '#D9D9D9'
        },
        orderInfo: null
      },
      {
        id: 'REV-G001-006',
        traceId: 'G001',
        userId: 'U006',
        userName: '茶艺爱好者',
        userAvatar: 'https://picsum.photos/id/1006/100/100',
        userLevel: 3,
        rating: 5,
        dimensions: {
          aroma: 5,
          taste: 5,
          value: 5
        },
        tasteTags: ['清香', '醇厚', '回甘'],
        content: '专业评茶师来评价一下：这款茶的窨制工艺确实到位。干茶条索紧结，色泽乌褐油润，带金黄桂花。香气清高持久，花香与茶香融合得很好，没有违和感。汤色橙黄明亮，滋味醇厚鲜爽，叶底匀齐。耐泡度也不错，我泡了6次还有余香。绝对是高品质的桂花茶！',
        images: [
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=tea%20tasting%20professional%20evaluation%20osmanthus%20tea&image_size=square',
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=brewed%20osmanthus%20tea%20leaves%20in%20gaiwan%20closeup&image_size=square',
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=osmanthus%20tea%20multiple%20infusions%20comparison&image_size=square'
        ],
        likeCount: 156,
        isLiked: false,
        commentCount: 28,
        createTime: '2025-11-20 20:45:12',
        auditStatus: 'approved',
        isPinned: false,
        isQuality: true,
        isScanVerified: true,
        trustLevel: {
          key: 'verified_purchase',
          name: '已验真购买',
          weight: 10,
          icon: '✓',
          color: '#52C41A',
          bgColor: '#F6FFED',
          borderColor: '#B7EB8F'
        },
        orderInfo: {
          orderId: 'ORD202511050002',
          sku: '200g/罐',
          buyTime: '2025-11-05'
        },
        brandReply: {
          replyId: 'BR-REV-G001-006',
          reviewId: 'REV-G001-006',
          content: '感谢您的专业评价！您的认可对我们来说意义重大。我们会继续坚守品质，传承非遗窨制技艺，为茶友们带来更多好茶。',
          replyTime: '2025-11-21 09:30:00',
          replierName: '一茶一品官方客服',
          replierAvatar: '',
          isOfficial: true
        }
      }
    ]
  },
  'G002': {
    traceId: 'G002',
    summary: {
      totalCount: 86,
      averageRating: 4.6,
      ratingDistribution: [
        { rating: 5, count: 58, percent: 67.4 },
        { rating: 4, count: 20, percent: 23.3 },
        { rating: 3, count: 6, percent: 7.0 },
        { rating: 2, count: 1, percent: 1.2 },
        { rating: 1, count: 1, percent: 1.2 }
      ],
      dimensionAverages: {
        aroma: 4.5,
        taste: 4.6,
        value: 4.8
      },
      tagStats: [
        { tag: '清香', count: 52 },
        { tag: '醇厚', count: 38 },
        { tag: '回甘', count: 28 }
      ],
      hasImageCount: 28
    },
    reviews: [
      {
        id: 'REV-G002-001',
        traceId: 'G002',
        userId: 'U007',
        userName: '清淡人生',
        userAvatar: 'https://picsum.photos/id/1007/100/100',
        userLevel: 2,
        rating: 5,
        dimensions: {
          aroma: 4,
          taste: 5,
          value: 5
        },
        tasteTags: ['清香', '回甘'],
        content: '银桂的香气比较清雅，不像金桂那么浓烈，正合我意。口感很柔和，不苦涩，喝完嘴里甜甜的。价格也很实惠，作为日常口粮茶非常合适。已经推荐给同事了。',
        images: [
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=silver%20osmanthus%20tea%20glass%20cup%20gentle%20light&image_size=square'
        ],
        likeCount: 42,
        isLiked: false,
        commentCount: 6,
        createTime: '2025-12-04 10:25:33',
        auditStatus: 'approved',
        isPinned: true,
        isQuality: true,
        isScanVerified: true,
        trustLevel: {
          key: 'verified_purchase',
          name: '已验真购买',
          weight: 10,
          icon: '✓',
          color: '#52C41A',
          bgColor: '#F6FFED',
          borderColor: '#B7EB8F'
        },
        orderInfo: {
          orderId: 'ORD202511220018',
          sku: '100g/罐',
          buyTime: '2025-11-22'
        }
      },
      {
        id: 'REV-G002-002',
        traceId: 'G002',
        userId: 'U008',
        userName: '养生达人',
        userAvatar: 'https://picsum.photos/id/1008/100/100',
        userLevel: 1,
        rating: 4,
        dimensions: {
          aroma: 4,
          taste: 4,
          value: 5
        },
        tasteTags: ['清香'],
        content: '每天早上泡一杯，清清淡淡的很好喝。银桂的香味比较淡雅，不会太冲，适合不喜欢太浓味道的人。性价比很高，这个价格能买到这样的茶很值了。',
        images: [],
        likeCount: 18,
        isLiked: false,
        commentCount: 2,
        createTime: '2025-11-30 08:15:42',
        auditStatus: 'approved',
        isPinned: false,
        isQuality: false,
        isScanVerified: false,
        trustLevel: {
          key: 'regular_purchase',
          name: '普通购买',
          weight: 5,
          icon: '🛒',
          color: '#1890FF',
          bgColor: '#E6F7FF',
          borderColor: '#91D5FF'
        },
        orderInfo: {
          orderId: 'ORD202511180012',
          sku: '200g/罐',
          buyTime: '2025-11-18'
        }
      }
    ]
  }
};

function getProductReviews(traceId) {
  if (!traceId) return null;
  var normalizedId = traceId.trim().toUpperCase();
  var data = PRODUCT_REVIEWS[normalizedId];
  if (!data) return null;
  return JSON.parse(JSON.stringify(data));
}

function getTasteTags() {
  return JSON.parse(JSON.stringify(TASTE_TAGS));
}

function getRatingDimensions() {
  return JSON.parse(JSON.stringify(RATING_DIMENSIONS));
}

function getReportReasons() {
  return JSON.parse(JSON.stringify(REPORT_REASONS));
}

function submitReview(traceId, reviewData, trustContext) {
  var normalizedId = traceId.trim().toUpperCase();

  var validation = reviewTrust.validateReviewSubmission(
    normalizedId,
    reviewData.content,
    reviewData.rating
  );

  if (!validation.valid) {
    return {
      success: false,
      message: validation.errors[0] || '评价提交失败',
      errors: validation.errors
    };
  }

  if (!PRODUCT_REVIEWS[normalizedId]) {
    PRODUCT_REVIEWS[normalizedId] = {
      traceId: normalizedId,
      summary: {
        totalCount: 0,
        averageRating: 0,
        ratingDistribution: [
          { rating: 5, count: 0, percent: 0 },
          { rating: 4, count: 0, percent: 0 },
          { rating: 3, count: 0, percent: 0 },
          { rating: 2, count: 0, percent: 0 },
          { rating: 1, count: 0, percent: 0 }
        ],
        dimensionAverages: {
          aroma: 0,
          taste: 0,
          value: 0
        },
        tagStats: [
          { tag: '清香', count: 0 },
          { tag: '醇厚', count: 0 },
          { tag: '回甘', count: 0 }
        ],
        hasImageCount: 0
      },
      reviews: []
    };
  }

  var isScanVerified = reviewTrust.isScanVerified(normalizedId);
  var hasOrderInfo = !!(reviewData.orderInfo || (trustContext && trustContext.hasOrder));
  var trustLevel = reviewTrust.determineTrustLevel(
    normalizedId,
    reviewData.userId,
    hasOrderInfo
  );

  var auditStatus = 'approved';
  if (validation.needAudit) {
    auditStatus = 'pending';
  }

  var auth = require('./auth.js');
  var userInfo = auth.getUserInfo();
  var isLoggedIn = auth.isLoggedIn();

  var newReview = {
    id: 'REV-' + normalizedId + '-' + Date.now(),
    traceId: normalizedId,
    userId: isLoggedIn ? (userInfo?.openid || 'U000') : null,
    userName: isLoggedIn ? (userInfo?.nickname || '茶友用户') : '微信用户',
    userAvatar: isLoggedIn ? (userInfo?.avatarUrl || 'https://picsum.photos/id/1010/100/100') : '',
    userLevel: isLoggedIn ? 1 : 0,
    rating: reviewData.rating,
    dimensions: reviewData.dimensions,
    tasteTags: reviewData.tasteTags,
    content: reviewData.content,
    images: reviewData.images || [],
    likeCount: 0,
    isLiked: false,
    commentCount: 0,
    createTime: new Date().toLocaleString('zh-CN'),
    auditStatus: auditStatus,
    isPinned: false,
    isQuality: false,
    isScanVerified: isScanVerified,
    trustLevel: trustLevel,
    orderInfo: reviewData.orderInfo || null,
    fromNote: reviewData.fromNote || false,
    noteId: reviewData.noteId || null
  };

  reviewTrust.addReviewSubmitRecord(normalizedId, newReview.id);

  PRODUCT_REVIEWS[normalizedId].reviews.unshift(newReview);
  PRODUCT_REVIEWS[normalizedId].summary.totalCount += 1;

  var allReviews = PRODUCT_REVIEWS[normalizedId].reviews;
  var weightedRating = reviewTrust.calculateWeightedRating(allReviews);
  PRODUCT_REVIEWS[normalizedId].summary.averageRating = weightedRating;

  var message = '评价提交成功';
  if (auditStatus === 'pending') {
    message = '评价提交成功，进入人工审核';
  }

  return {
    success: true,
    message: message,
    review: newReview,
    warnings: validation.warnings,
    needAudit: validation.needAudit
  };
}

function likeReview(traceId, reviewId) {
  var normalizedId = traceId.trim().toUpperCase();
  var data = PRODUCT_REVIEWS[normalizedId];
  if (!data) return { success: false, message: '产品不存在' };

  for (var i = 0; i < data.reviews.length; i++) {
    if (data.reviews[i].id === reviewId) {
      if (!data.reviews[i].isLiked) {
        data.reviews[i].likeCount += 1;
        data.reviews[i].isLiked = true;
        return { success: true, message: '点赞成功', likeCount: data.reviews[i].likeCount };
      } else {
        data.reviews[i].likeCount -= 1;
        data.reviews[i].isLiked = false;
        return { success: true, message: '取消点赞', likeCount: data.reviews[i].likeCount };
      }
    }
  }
  return { success: false, message: '评价不存在' };
}

function reportReview(traceId, reviewId, reportReason, reportContent) {
  return {
    success: true,
    message: '举报已提交，我们会尽快处理'
  };
}

function getSupplyChainTimeline(traceId) {
  if (!traceId) return null;
  var normalizedId = traceId.trim().toUpperCase();
  var data = SUPPLY_CHAIN_TIMELINE[normalizedId];
  if (!data) return null;
  return JSON.parse(JSON.stringify(data));
}

function getAllSupplyChainTimeline() {
  return JSON.parse(JSON.stringify(SUPPLY_CHAIN_TIMELINE));
}

// ==================== 经销商与渠道溯源数据 ====================

const DEALERS = {
  'D-HB-PROV-001': {
    id: 'D-HB-PROV-001',
    name: '湖北桂花茶业省级总代理',
    level: 'province',
    levelLabel: '省级代理',
    contact: '张总',
    phone: '13800000001',
    location: '湖北省武汉市',
    province: '湖北',
    city: '武汉',
    authorizedRegions: ['湖北省'],
    authorizedProducts: ['G001', 'G002', 'G003', 'G004'],
    status: 'active'
  },
  'D-FJ-PROV-001': {
    id: 'D-FJ-PROV-001',
    name: '福建茶叶省级总代理',
    level: 'province',
    levelLabel: '省级代理',
    contact: '李总',
    phone: '13800000002',
    location: '福建省福州市',
    province: '福建',
    city: '福州',
    authorizedRegions: ['福建省'],
    authorizedProducts: ['G001', 'G002', 'G003'],
    status: 'active'
  },
  'D-GD-PROV-001': {
    id: 'D-GD-PROV-001',
    name: '广东南方茶叶省级总代理',
    level: 'province',
    levelLabel: '省级代理',
    contact: '王总',
    phone: '13800000003',
    location: '广东省广州市',
    province: '广东',
    city: '广州',
    authorizedRegions: ['广东省'],
    authorizedProducts: ['G001', 'G002', 'G003', 'G004'],
    status: 'active'
  },
  'D-HB-WH-001': {
    id: 'D-HB-WH-001',
    name: '武汉鑫源茶业',
    level: 'city',
    levelLabel: '市级代理',
    contact: '陈经理',
    phone: '13900000001',
    location: '湖北省武汉市武昌区',
    province: '湖北',
    city: '武汉',
    parentId: 'D-HB-PROV-001',
    parentName: '湖北桂花茶业省级总代理',
    authorizedRegions: ['湖北省武汉市', '湖北省鄂州市'],
    authorizedProducts: ['G001', 'G002', 'G003', 'G004'],
    status: 'active'
  },
  'D-HB-YC-001': {
    id: 'D-HB-YC-001',
    name: '宜昌茗香茶行',
    level: 'city',
    levelLabel: '市级代理',
    contact: '刘经理',
    phone: '13900000002',
    location: '湖北省宜昌市西陵区',
    province: '湖北',
    city: '宜昌',
    parentId: 'D-HB-PROV-001',
    parentName: '湖北桂花茶业省级总代理',
    authorizedRegions: ['湖北省宜昌市', '湖北省荆州市'],
    authorizedProducts: ['G001', 'G002', 'G004'],
    status: 'active'
  },
  'D-FJ-XM-001': {
    id: 'D-FJ-XM-001',
    name: '厦门鹭岛茶城',
    level: 'city',
    levelLabel: '市级代理',
    contact: '赵经理',
    phone: '13900000003',
    location: '福建省厦门市思明区',
    province: '福建',
    city: '厦门',
    parentId: 'D-FJ-PROV-001',
    parentName: '福建茶叶省级总代理',
    authorizedRegions: ['福建省厦门市', '福建省漳州市'],
    authorizedProducts: ['G001', 'G002', 'G003'],
    status: 'active'
  },
  'S-HB-WH-001': {
    id: 'S-HB-WH-001',
    name: '武昌中南路旗舰店',
    level: 'store',
    levelLabel: '授权门店',
    contact: '店长小王',
    phone: '13700000001',
    location: '湖北省武汉市武昌区中南路88号',
    province: '湖北',
    city: '武汉',
    parentId: 'D-HB-WH-001',
    parentName: '武汉鑫源茶业',
    authorizedRegions: ['湖北省武汉市武昌区'],
    authorizedProducts: ['G001', 'G002', 'G003', 'G004'],
    status: 'active'
  },
  'S-HB-WH-002': {
    id: 'S-HB-WH-002',
    name: '江汉路步行街店',
    level: 'store',
    levelLabel: '授权门店',
    contact: '店长小李',
    phone: '13700000002',
    location: '湖北省武汉市江汉区江汉路128号',
    province: '湖北',
    city: '武汉',
    parentId: 'D-HB-WH-001',
    parentName: '武汉鑫源茶业',
    authorizedRegions: ['湖北省武汉市江汉区', '湖北省武汉市江岸区'],
    authorizedProducts: ['G001', 'G002', 'G004'],
    status: 'active'
  },
  'S-FJ-XM-001': {
    id: 'S-FJ-XM-001',
    name: '鼓浪屿茶文化馆',
    level: 'store',
    levelLabel: '授权门店',
    contact: '店长小陈',
    phone: '13700000003',
    location: '福建省厦门市思明区鼓浪屿龙头路66号',
    province: '福建',
    city: '厦门',
    parentId: 'D-FJ-XM-001',
    parentName: '厦门鹭岛茶城',
    authorizedRegions: ['福建省厦门市思明区'],
    authorizedProducts: ['G001', 'G002', 'G003'],
    status: 'active'
  }
};

const TRACE_CODES = {
  'G001': {
    code: 'G001',
    type: 'production',
    typeLabel: '生产码',
    traceId: 'G001',
    productName: '金桂花茶',
    batchNo: 'GH202503',
    specification: '100g/罐',
    quantity: 1,
    parentCode: null,
    boxCode: 'B-GH202503-001',
    fromDealerId: 'factory',
    fromDealerName: '湖北桂花茶厂'
  },
  'G002': {
    code: 'G002',
    type: 'production',
    typeLabel: '生产码',
    traceId: 'G002',
    productName: '银桂花茶',
    batchNo: 'GH202504',
    specification: '100g/罐',
    quantity: 1,
    parentCode: null,
    boxCode: 'B-GH202504-001',
    fromDealerId: 'factory',
    fromDealerName: '湖北桂花茶厂'
  },
  'G003': {
    code: 'G003',
    type: 'production',
    typeLabel: '生产码',
    traceId: 'G003',
    productName: '金桂花茶礼盒装',
    batchNo: 'GH202503',
    specification: '250g/礼盒',
    quantity: 1,
    parentCode: null,
    boxCode: 'B-GH202503-002',
    fromDealerId: 'factory',
    fromDealerName: '湖北桂花茶厂'
  },
  'G004': {
    code: 'G004',
    type: 'production',
    typeLabel: '生产码',
    traceId: 'G004',
    productName: '金桂花茶便携装',
    batchNo: 'GH202503',
    specification: '3g*12袋/盒',
    quantity: 1,
    parentCode: null,
    boxCode: 'B-GH202503-003',
    fromDealerId: 'factory',
    fromDealerName: '湖北桂花茶厂'
  },
  'B-GH202503-001': {
    code: 'B-GH202503-001',
    type: 'box',
    typeLabel: '箱码',
    traceId: 'G001',
    productName: '金桂花茶',
    batchNo: 'GH202503',
    specification: '100g/罐 x 24罐/箱',
    quantity: 24,
    parentCode: null,
    childCodes: ['G001'],
    fromDealerId: 'factory',
    fromDealerName: '湖北桂花茶厂'
  },
  'B-GH202504-001': {
    code: 'B-GH202504-001',
    type: 'box',
    typeLabel: '箱码',
    traceId: 'G002',
    productName: '银桂花茶',
    batchNo: 'GH202504',
    specification: '100g/罐 x 24罐/箱',
    quantity: 24,
    parentCode: null,
    childCodes: ['G002'],
    fromDealerId: 'factory',
    fromDealerName: '湖北桂花茶厂'
  },
  'B-GH202503-002': {
    code: 'B-GH202503-002',
    type: 'box',
    typeLabel: '箱码',
    traceId: 'G003',
    productName: '金桂花茶礼盒装',
    batchNo: 'GH202503',
    specification: '250g/礼盒 x 12盒/箱',
    quantity: 12,
    parentCode: null,
    childCodes: ['G003'],
    fromDealerId: 'factory',
    fromDealerName: '湖北桂花茶厂'
  },
  'S-HB-WH-001-MAIN': {
    code: 'S-HB-WH-001-MAIN',
    type: 'store',
    typeLabel: '门店码',
    traceId: null,
    productName: '武昌中南路旗舰店专用码',
    batchNo: null,
    specification: '门店码',
    quantity: 1,
    parentCode: null,
    storeId: 'S-HB-WH-001',
    storeName: '武昌中南路旗舰店',
    fromDealerId: 'factory',
    fromDealerName: '品牌总部'
  },
  'S-FJ-XM-001-MAIN': {
    code: 'S-FJ-XM-001-MAIN',
    type: 'store',
    typeLabel: '门店码',
    traceId: null,
    productName: '鼓浪屿茶文化馆专用码',
    batchNo: null,
    specification: '门店码',
    quantity: 1,
    parentCode: null,
    storeId: 'S-FJ-XM-001',
    storeName: '鼓浪屿茶文化馆',
    fromDealerId: 'factory',
    fromDealerName: '品牌总部'
  }
};

const CHANNEL_FLOW = {
  'G001': {
    traceId: 'G001',
    factory: {
      id: 'factory',
      name: '湖北桂花茶厂',
      location: '湖北省咸宁市',
      time: '2025-09-25 14:32:18',
      authorizedRegions: []
    },
    provinceDealer: {
      id: 'D-HB-PROV-001',
      name: '湖北桂花茶业省级总代理',
      location: '湖北省武汉市',
      time: '2025-09-26 09:15:00',
      authorizedRegions: ['湖北省']
    },
    cityDealer: {
      id: 'D-HB-WH-001',
      name: '武汉鑫源茶业',
      location: '湖北省武汉市武昌区',
      time: '2025-09-27 10:30:00',
      authorizedRegions: ['湖北省武汉市', '湖北省鄂州市']
    },
    store: {
      id: 'S-HB-WH-001',
      name: '武昌中南路旗舰店',
      location: '湖北省武汉市武昌区中南路88号',
      time: '2025-09-28 08:45:00',
      authorizedRegions: ['湖北省武汉市武昌区']
    }
  },
  'G002': {
    traceId: 'G002',
    factory: {
      id: 'factory',
      name: '湖北桂花茶厂',
      location: '湖北省咸宁市',
      time: '2025-09-30 10:15:42',
      authorizedRegions: []
    },
    provinceDealer: {
      id: 'D-HB-PROV-001',
      name: '湖北桂花茶业省级总代理',
      location: '湖北省武汉市',
      time: '2025-10-01 14:20:00',
      authorizedRegions: ['湖北省']
    },
    cityDealer: {
      id: 'D-HB-YC-001',
      name: '宜昌茗香茶行',
      location: '湖北省宜昌市西陵区',
      time: '2025-10-02 11:00:00',
      authorizedRegions: ['湖北省宜昌市', '湖北省荆州市']
    },
    store: null
  },
  'G003': {
    traceId: 'G003',
    factory: {
      id: 'factory',
      name: '湖北桂花茶厂',
      location: '湖北省咸宁市',
      time: '2025-09-25 14:35:22',
      authorizedRegions: []
    },
    provinceDealer: {
      id: 'D-FJ-PROV-001',
      name: '福建茶叶省级总代理',
      location: '福建省福州市',
      time: '2025-09-26 16:40:00',
      authorizedRegions: ['福建省']
    },
    cityDealer: {
      id: 'D-FJ-XM-001',
      name: '厦门鹭岛茶城',
      location: '福建省厦门市思明区',
      time: '2025-09-27 09:50:00',
      authorizedRegions: ['福建省厦门市', '福建省漳州市']
    },
    store: {
      id: 'S-FJ-XM-001',
      name: '鼓浪屿茶文化馆',
      location: '福建省厦门市思明区鼓浪屿龙头路66号',
      time: '2025-09-28 15:30:00',
      authorizedRegions: ['福建省厦门市思明区']
    }
  },
  'G004': {
    traceId: 'G004',
    factory: {
      id: 'factory',
      name: '湖北桂花茶厂',
      location: '湖北省咸宁市',
      time: '2025-09-25 15:00:00',
      authorizedRegions: []
    },
    provinceDealer: {
      id: 'D-GD-PROV-001',
      name: '广东南方茶叶省级总代理',
      location: '广东省广州市',
      time: '2025-09-26 18:00:00',
      authorizedRegions: ['广东省']
    },
    cityDealer: null,
    store: null
  }
};

const DEALER_ACCOUNTS = {
  'admin_wh001': {
    id: 'U-WH-001',
    account: 'admin_wh001',
    password: '123456',
    name: '王仓管',
    role: 'warehouse',
    dealerId: 'D-HB-WH-001',
    dealerName: '武汉鑫源茶业',
    avatar: '',
    phone: '13900000101',
    status: 'active'
  },
  'sales_lx001': {
    id: 'U-SALES-001',
    account: 'sales_lx001',
    password: '123456',
    name: '李销售',
    role: 'sales',
    dealerId: 'D-HB-WH-001',
    dealerName: '武汉鑫源茶业',
    avatar: '',
    phone: '13900000102',
    status: 'active'
  },
  'admin_zq001': {
    id: 'U-ADMIN-001',
    account: 'admin_zq001',
    password: '123456',
    name: '张经理',
    role: 'admin',
    dealerId: 'D-HB-PROV-001',
    dealerName: '湖北桂花茶业省级总代理',
    avatar: '',
    phone: '13800000001',
    status: 'active'
  },
  'admin_cy001': {
    id: 'U-ADMIN-002',
    account: 'admin_cy001',
    password: '123456',
    name: '陈区域',
    role: 'admin',
    dealerId: 'D-HB-WH-001',
    dealerName: '武汉鑫源茶业',
    avatar: '',
    phone: '13900000103',
    status: 'active'
  },
  'warehouse_yc001': {
    id: 'U-WH-002',
    account: 'warehouse_yc001',
    password: '123456',
    name: '宜昌仓管',
    role: 'warehouse',
    dealerId: 'D-HB-YC-001',
    dealerName: '宜昌茗香茶行',
    avatar: '',
    phone: '13900000201',
    status: 'active'
  },
  'sales_xm001': {
    id: 'U-SALES-002',
    account: 'sales_xm001',
    password: '123456',
    name: '厦门销售',
    role: 'sales',
    dealerId: 'D-FJ-XM-001',
    dealerName: '厦门鹭岛茶城',
    avatar: '',
    phone: '13900000301',
    status: 'active'
  }
};

const DEALER_AUTH_CODES = {
  'DEALER-2025-HB-8888': {
    code: 'DEALER-2025-HB-8888',
    valid: true,
    dealerId: 'D-HB-WH-001',
    dealerName: '武汉鑫源茶业',
    account: 'admin_cy001',
    expireTime: Date.now() + 365 * 24 * 60 * 60 * 1000,
    createdBy: 'system'
  },
  'DEALER-2025-HB-9999': {
    code: 'DEALER-2025-HB-9999',
    valid: true,
    dealerId: 'D-HB-PROV-001',
    dealerName: '湖北桂花茶业省级总代理',
    account: 'admin_zq001',
    expireTime: Date.now() + 365 * 24 * 60 * 60 * 1000,
    createdBy: 'system'
  },
  'DEALER-2025-YC-6666': {
    code: 'DEALER-2025-YC-6666',
    valid: true,
    dealerId: 'D-HB-YC-001',
    dealerName: '宜昌茗香茶行',
    account: 'warehouse_yc001',
    expireTime: Date.now() + 365 * 24 * 60 * 60 * 1000,
    createdBy: 'system'
  },
  'DEALER-2025-XM-7777': {
    code: 'DEALER-2025-XM-7777',
    valid: true,
    dealerId: 'D-FJ-XM-001',
    dealerName: '厦门鹭岛茶城',
    account: 'sales_xm001',
    expireTime: Date.now() + 365 * 24 * 60 * 60 * 1000,
    createdBy: 'system'
  }
};

function verifyDealerAccount(account, password) {
  const user = DEALER_ACCOUNTS[account];
  if (!user) return null;
  if (user.password !== password) return null;
  if (user.status !== 'active') return null;
  return {
    id: user.id,
    account: user.account,
    name: user.name,
    role: user.role,
    dealerId: user.dealerId,
    dealerName: user.dealerName,
    avatar: user.avatar,
    phone: user.phone
  };
}

function verifyDealerAuthCode(code) {
  const authCode = DEALER_AUTH_CODES[code];
  if (!authCode) return null;
  if (!authCode.valid) return null;
  if (authCode.expireTime && authCode.expireTime < Date.now()) return null;
  return {
    code: authCode.code,
    valid: authCode.valid,
    dealerId: authCode.dealerId,
    dealerName: authCode.dealerName,
    account: authCode.account
  };
}

function getDealerAccountList(dealerId) {
  const list = Object.values(DEALER_ACCOUNTS);
  if (!dealerId) return list;
  return list.filter(function(a) { return a.dealerId === dealerId; });
}

function getDefaultDealer() {
  return {
    id: 'D-HB-WH-001',
    name: '武汉鑫源茶业',
    level: 'city',
    levelLabel: '市级代理',
    contact: '陈经理',
    phone: '13900000001',
    location: '湖北省武汉市武昌区',
    province: '湖北',
    city: '武汉',
    authorizedRegions: ['湖北省武汉市', '湖北省鄂州市']
  };
}

function getDealer(dealerId) {
  return DEALERS[dealerId] || null;
}

function getDealerNameById(dealerId) {
  const dealer = DEALERS[dealerId];
  return dealer ? dealer.name : '';
}

function getDealerList() {
  return Object.values(DEALERS);
}

function getDealerByLevel(level) {
  return Object.values(DEALERS).filter(d => d.level === level);
}

function getChildDealers(parentId) {
  return Object.values(DEALERS).filter(d => d.parentId === parentId);
}

function getTraceInfoByCode(code, codeType) {
  if (TRACE_CODES[code]) {
    return TRACE_CODES[code];
  }
  if (mockTraceData[code]) {
    const data = mockTraceData[code];
    return {
      code: code,
      type: 'production',
      typeLabel: '生产码',
      traceId: code,
      productName: data.basicInfo.productName,
      batchNo: data.basicInfo.batchNo,
      specification: data.basicInfo.specification,
      quantity: 1,
      parentCode: null,
      fromDealerId: 'factory',
      fromDealerName: '湖北桂花茶厂'
    };
  }
  return null;
}

function getChannelFlow(traceId) {
  return CHANNEL_FLOW[traceId] || null;
}

function updateCodeFlow(code, codeType, flowInfo) {
  if (!code || !flowInfo) return false;

  if (TRACE_CODES[code]) {
    TRACE_CODES[code].currentHolder = flowInfo;
    TRACE_CODES[code].lastUpdate = flowInfo.timestamp;
  }

  const traceId = TRACE_CODES[code] ? TRACE_CODES[code].traceId : code;
  if (CHANNEL_FLOW[traceId]) {
    const flow = CHANNEL_FLOW[traceId];
    const now = flowInfo.timestamp ? new Date(flowInfo.timestamp) : new Date();
    const timeStr = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

    const dealerInfo = {
      id: flowInfo.dealerId,
      name: flowInfo.dealerName,
      location: DEALERS[flowInfo.dealerId] ? DEALERS[flowInfo.dealerId].location : '',
      time: timeStr,
      authorizedRegions: DEALERS[flowInfo.dealerId] ? DEALERS[flowInfo.dealerId].authorizedRegions : []
    };

    if (flowInfo.action === 'stockIn') {
      if (flowInfo.dealerLevel === 'province') {
        flow.provinceDealer = dealerInfo;
      } else if (flowInfo.dealerLevel === 'city') {
        flow.cityDealer = dealerInfo;
      } else if (flowInfo.dealerLevel === 'store') {
        flow.store = dealerInfo;
      }
    }
  }

  return true;
}

function getTraceCode(code) {
  return TRACE_CODES[code] || null;
}

// ==================== 产品召回数据 ====================
const RECALL_BATCHES = {
  'GH202504': {
    batchNo: 'GH202504',
    recallId: 'RC202512001',
    productName: '银桂花茶',
    recallLevel: 'level2',
    recallLevelLabel: '二级召回',
    publishDate: '2025年12月15日',
    effectiveDate: '2025年12月15日起',
    scope: '全国范围',
    affectedCount: 2856,
    producer: '湖北桂花茶业有限公司',
    issueDescription: '该批次产品在抽检中发现氯氰菊酯残留量超出国标 GB 2763-2021 限值，实测值 25.5mg/kg，国标限值 20mg/kg，超出 27.5%。长期大量摄入可能对人体健康造成潜在影响。',
    issueCategory: '农残超标',
    testItems: [
      {
        name: '氯氰菊酯',
        standard: 'GB 2763-2021',
        limit: '20 mg/kg',
        measured: '25.5 mg/kg',
        result: '不合格',
        isAbnormal: true,
        description: '超出国标限值 27.5%'
      },
      {
        name: '六六六',
        standard: 'GB 2763-2021',
        limit: '0.1 mg/kg',
        measured: '<0.01 mg/kg',
        result: '合格',
        isAbnormal: false,
        description: ''
      },
      {
        name: '氯氟氰菊酯',
        standard: 'GB 2763-2021',
        limit: '2.0 mg/kg',
        measured: '<0.01 mg/kg',
        result: '合格',
        isAbnormal: false,
        description: ''
      }
    ],
    officialAdvice: [
      '立即停止食用该批次产品',
      '未开封产品可凭购买凭证到原购买渠道办理全额退款',
      '已开封产品可拍照上传后联系客服申请补偿',
      '如已食用并出现不适症状，请及时就医并保留就诊记录',
      '客服热线：400-888-8888（工作日 9:00-18:00）'
    ],
    affectedTraceIds: ['G002', 'G005', 'G006', 'G007'],
    compensationRule: '未开封全额退款 + 赠送同价位正品1份；已开封按剩余比例退款 + 50元优惠券',
    handlingDeadline: '2026年3月15日',
    relatedReports: [
      { reportNo: 'HBAQ-2025-12345', institution: '湖北省农产品质量安全检测中心', testDate: '2025年9月25日' }
    ],
    regulator: '咸宁市市场监督管理局',
    regulatorNotice: '关于对湖北桂花茶业有限公司不合格食品风险控制情况的通告（2025年第48号）'
  }
};

const RECALL_TRACE_ID_MAP = {};
Object.keys(RECALL_BATCHES).forEach(function(batchNo) {
  const recall = RECALL_BATCHES[batchNo];
  if (recall.affectedTraceIds) {
    recall.affectedTraceIds.forEach(function(traceId) {
      RECALL_TRACE_ID_MAP[traceId] = batchNo;
    });
  }
});

function getRecallByBatch(batchNo) {
  return RECALL_BATCHES[batchNo] || null;
}

function getRecallByTraceId(traceId) {
  const batchNo = RECALL_TRACE_ID_MAP[traceId];
  if (!batchNo) return null;
  return RECALL_BATCHES[batchNo] || null;
}

function isRecalledProduct(traceId) {
  return !!RECALL_TRACE_ID_MAP[traceId];
}

function getAllRecalls() {
  return Object.values(RECALL_BATCHES);
}

// ==================== 礼盒/组合装多码关联数据 ====================

const GIFTBOX_DATA = {
  'GBX001': {
    giftBoxId: 'GBX001',
    mainTraceId: 'G003',
    name: '金秋雅韵·桂花茶礼盒',
    type: 'giftbox',
    specification: '3件套组合装',
    description: '精选三种桂花茶臻品，礼赠佳品，一礼盒藏三味',
    thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=elegant%20chinese%20tea%20gift%20box%20set%20premium%20packaging%20golden%20osmanthus%20luxury&image_size=square',
    banner: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=autumn%20osmanthus%20tea%20gift%20box%20promotional%20banner%20elegant%20chinese%20style&image_size=landscape_16_9',
    packaging: {
      material: '高档竹制礼盒',
      inner: '丝绸内衬',
      accessories: '陶瓷茶具1套、品鉴手册1本'
    },
    items: [
      {
        index: 1,
        traceId: 'G001',
        name: '金桂花茶',
        variety: '金桂',
        specification: '100g/罐',
        quantity: 1,
        highlight: '200年古树茶底，五窨一提',
        thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=premium%20golden%20osmanthus%20tea%20tin%20can%20product%20photo&image_size=square'
      },
      {
        index: 2,
        traceId: 'G002',
        name: '银桂花茶',
        variety: '银桂',
        specification: '100g/罐',
        quantity: 1,
        highlight: '清雅淡香，日常自饮首选',
        thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=silver%20osmanthus%20tea%20packaging%20elegant%20product%20photo&image_size=square'
      },
      {
        index: 3,
        traceId: 'G004',
        name: '金桂花茶便携装',
        variety: '金桂',
        specification: '3g*12袋/盒',
        quantity: 1,
        highlight: '便携出差，随享随饮',
        thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=osmanthus%20tea%20portable%20sachet%20packaging%20convenient&image_size=square'
      }
    ],
    priceInfo: {
      originalPrice: 688,
      giftBoxPrice: 588,
      savedAmount: 100
    },
    productionInfo: {
      packTime: '2025年10月1日',
      packBatch: 'GB20251001',
      packWorkshop: '礼盒包装车间A',
      qualityInspector: '张质检（高级检验员）'
    }
  }
};

const SUBCODE_MAP = {};
Object.keys(GIFTBOX_DATA).forEach(function(giftBoxId) {
  const giftBox = GIFTBOX_DATA[giftBoxId];
  giftBox.items.forEach(function(item) {
    SUBCODE_MAP[item.traceId] = {
      giftBoxId: giftBoxId,
      giftBoxName: giftBox.name,
      giftBoxMainTraceId: giftBox.mainTraceId,
      itemIndex: item.index,
      totalItems: giftBox.items.length,
      itemInfo: item
    };
  });
  SUBCODE_MAP[giftBox.mainTraceId] = {
    giftBoxId: giftBoxId,
    giftBoxName: giftBox.name,
    giftBoxMainTraceId: giftBox.mainTraceId,
    isMainCode: true,
    totalItems: giftBox.items.length
  };
});

function getGiftBoxInfo(traceIdOrGiftBoxId) {
  if (GIFTBOX_DATA[traceIdOrGiftBoxId]) {
    return GIFTBOX_DATA[traceIdOrGiftBoxId];
  }
  const subInfo = SUBCODE_MAP[traceIdOrGiftBoxId];
  if (subInfo) {
    return GIFTBOX_DATA[subInfo.giftBoxId];
  }
  return null;
}

function getGiftBoxSubCodeInfo(traceId) {
  return SUBCODE_MAP[traceId] || null;
}

function isGiftBoxMainCode(traceId) {
  const info = SUBCODE_MAP[traceId];
  return info && info.isMainCode === true;
}

function isGiftBoxSubCode(traceId) {
  const info = SUBCODE_MAP[traceId];
  return info && !info.isMainCode;
}

function isGiftBoxRelated(traceId) {
  return !!SUBCODE_MAP[traceId];
}

function getAllGiftBoxes() {
  return Object.values(GIFTBOX_DATA);
}

function getGiftBoxItems(giftBoxId) {
  const giftBox = GIFTBOX_DATA[giftBoxId];
  if (!giftBox) return [];
  return giftBox.items.map(function(item) {
    const traceData = mockTraceData[item.traceId];
    return {
      ...item,
      basicInfo: traceData ? traceData.basicInfo : null,
      treeAge: traceData ? traceData.treeAge : null,
      osmanthusInfo: traceData ? traceData.osmanthusInfo : null
    };
  });
}

function getGiftBoxMainCodeBySubCode(traceId) {
  const subInfo = SUBCODE_MAP[traceId];
  if (!subInfo) return null;
  return {
    mainTraceId: subInfo.giftBoxMainTraceId,
    giftBoxId: subInfo.giftBoxId,
    giftBoxName: subInfo.giftBoxName
  };
}

// ==================== 内外包装双码验真数据 ====================

const DUAL_CODE_DATA = {
  'OUT-G001': {
    outerCode: 'OUT-G001',
    innerCode: 'INN-G001',
    traceId: 'G001',
    productName: '金桂花茶',
    bindTime: '2025-09-25 14:30:00',
    bindBatch: 'BIND20250925001',
    packagingInfo: {
      outerBox: '高档硬纸盒（绿色环保牛皮纸外覆）',
      innerBag: '食品级铝箔密封袋',
      antiTamper: '一次性破坏性封口贴',
      qrLocation: {
        outer: '外盒底部/侧面',
        inner: '铝箔袋内侧，撕开后可见'
      }
    },
    summary: {
      highlight: '200年古树茶底 · 五窨一提',
      shortDesc: '优选武夷山百年茶树鲜叶与咸宁金桂，非遗窨制工艺',
      tags: ['有机认证', '五窨工艺', '百年树龄']
    }
  },
  'INN-G001': {
    outerCode: 'OUT-G001',
    innerCode: 'INN-G001',
    traceId: 'G001',
    productName: '金桂花茶',
    bindTime: '2025-09-25 14:30:00',
    bindBatch: 'BIND20250925001'
  },

  'OUT-G002': {
    outerCode: 'OUT-G002',
    innerCode: 'INN-G002',
    traceId: 'G002',
    productName: '银桂花茶',
    bindTime: '2025-09-30 10:15:00',
    bindBatch: 'BIND20250930001',
    packagingInfo: {
      outerBox: 'PET透明罐+彩印纸盒外封',
      innerBag: '铝箔真空密封袋',
      antiTamper: '罐口防伪塑封膜+易撕拉环',
      qrLocation: {
        outer: '外盒背面/罐底标签',
        inner: '铝箔袋封口处内侧'
      }
    },
    summary: {
      highlight: '清雅淡香 · 高性价比',
      shortDesc: '生态茶园鲜叶窨制咸宁银桂，清雅淡远，适合日常饮用',
      tags: ['绿色食品', '清雅香型', '日常推荐']
    }
  },
  'INN-G002': {
    outerCode: 'OUT-G002',
    innerCode: 'INN-G002',
    traceId: 'G002',
    productName: '银桂花茶',
    bindTime: '2025-09-30 10:15:00',
    bindBatch: 'BIND20250930001'
  },

  'OUT-G003': {
    outerCode: 'OUT-G003',
    innerCode: 'INN-G003',
    traceId: 'G003',
    productName: '金桂花茶礼盒装',
    bindTime: '2025-10-01 09:00:00',
    bindBatch: 'BIND20251001001',
    packagingInfo: {
      outerBox: '高档竹制礼盒+烫金工艺封套',
      innerBag: '丝绒内袋+独立铝箔密封分装',
      antiTamper: '礼盒防伪封签+每件独立防伪码',
      qrLocation: {
        outer: '礼盒封底/外封套背面',
        inner: '内盒丝绒袋内侧，开封后可见'
      }
    },
    summary: {
      highlight: '臻选礼盒 · 六窨一提',
      shortDesc: '180年古树鲜叶窨制上等金桂，六窨工艺，礼盒臻品',
      tags: ['礼盒臻品', '六窨工艺', '送礼首选']
    }
  },
  'INN-G003': {
    outerCode: 'OUT-G003',
    innerCode: 'INN-G003',
    traceId: 'G003',
    productName: '金桂花茶礼盒装',
    bindTime: '2025-10-01 09:00:00',
    bindBatch: 'BIND20251001001'
  },

  'OUT-G004': {
    outerCode: 'OUT-G004',
    innerCode: 'INN-G004',
    traceId: 'G004',
    productName: '金桂花茶便携装',
    bindTime: '2025-09-25 16:45:00',
    bindBatch: 'BIND20250925002',
    packagingInfo: {
      outerBox: '便携硬纸盒+易撕压痕线',
      innerBag: '独立小袋铝箔真空包装（12袋）',
      antiTamper: '外盒易撕封条+每袋独立热封',
      qrLocation: {
        outer: '外包装盒底部',
        inner: '小袋铝箔封口内侧，撕开封口后可见'
      }
    },
    summary: {
      highlight: '便携随享 · 出差旅行',
      shortDesc: '独立小袋分装，每次一袋，出差旅行随时享用正宗桂花茶',
      tags: ['便携装', '独立分装', '差旅必备']
    }
  },
  'INN-G004': {
    outerCode: 'OUT-G004',
    innerCode: 'INN-G004',
    traceId: 'G004',
    productName: '金桂花茶便携装',
    bindTime: '2025-09-25 16:45:00',
    bindBatch: 'BIND20250925002'
  }
};

const OUTER_CODE_PREFIX = 'OUT-';
const INNER_CODE_PREFIX = 'INN-';

function isOuterCode(code) {
  if (!code || typeof code !== 'string') return false;
  const trimmed = code.trim().toUpperCase();
  if (trimmed.startsWith(OUTER_CODE_PREFIX) && DUAL_CODE_DATA[trimmed]) {
    return true;
  }
  if (DUAL_CODE_DATA[trimmed] && DUAL_CODE_DATA[trimmed].outerCode === trimmed) {
    return true;
  }
  return false;
}

function isInnerCode(code) {
  if (!code || typeof code !== 'string') return false;
  const trimmed = code.trim().toUpperCase();
  if (trimmed.startsWith(INNER_CODE_PREFIX) && DUAL_CODE_DATA[trimmed]) {
    return true;
  }
  if (DUAL_CODE_DATA[trimmed] && DUAL_CODE_DATA[trimmed].innerCode === trimmed) {
    return !isOuterCode(trimmed);
  }
  return false;
}

function isDualCode(code) {
  return isOuterCode(code) || isInnerCode(code);
}

function getDualCodeInfo(code) {
  if (!code || typeof code !== 'string') return null;
  const trimmed = code.trim().toUpperCase();
  const raw = DUAL_CODE_DATA[trimmed];
  if (!raw) return null;
  const codeType = isOuterCode(trimmed) ? 'outer' : (isInnerCode(trimmed) ? 'inner' : null);
  return Object.assign({}, raw, {
    codeType: codeType,
    isBound: !!(raw.outerCode && raw.innerCode)
  });
}

function getOuterCodeByInner(innerCode) {
  if (!isInnerCode(innerCode)) return null;
  const info = getDualCodeInfo(innerCode);
  if (!info) return null;
  return info.outerCode || null;
}

function getInnerCodeByOuter(outerCode) {
  if (!isOuterCode(outerCode)) return null;
  const info = getDualCodeInfo(outerCode);
  return info ? info.innerCode : null;
}

function verifyDualCodeBinding(outerCode, innerCode) {
  const result = {
    isValid: false,
    isOuterValid: false,
    isInnerValid: false,
    isBound: false,
    matchTraceId: false,
    matchBindBatch: false,
    outerCode: outerCode,
    innerCode: innerCode,
    traceId: null,
    productName: null,
    bindBatch: null,
    errorType: null,
    errorMessage: null,
    expectedInnerCode: null,
    expectedOuterCode: null
  };

  if (!outerCode || !innerCode || typeof outerCode !== 'string' || typeof innerCode !== 'string') {
    result.errorType = 'param_empty';
    result.errorMessage = '外码或内码参数为空或无效';
    return result;
  }

  const outerTrimmed = outerCode.trim().toUpperCase();
  const innerTrimmed = innerCode.trim().toUpperCase();
  const outerLooksLikeOuter = outerTrimmed.startsWith(OUTER_CODE_PREFIX);
  const innerLooksLikeInner = innerTrimmed.startsWith(INNER_CODE_PREFIX);

  if (!outerLooksLikeOuter || !innerLooksLikeInner) {
    result.errorType = 'code_type_error';
    if (!outerLooksLikeOuter && !innerLooksLikeInner) {
      result.errorMessage = '编码类型错误：需要外码(OUT-)和内码(INN-)配对';
    } else if (!outerLooksLikeOuter) {
      result.errorMessage = '第一个编码类型错误：应为外盒码(OUT-前缀)';
    } else {
      result.errorMessage = '第二个编码类型错误：应为内袋码(INN-前缀)';
    }
    return result;
  }

  const outer = getDualCodeInfo(outerCode);
  const inner = getDualCodeInfo(innerCode);
  result.isOuterValid = !!outer;
  result.isInnerValid = !!inner;

  if (!outer || !inner) {
    result.errorType = 'code_not_found';
    if (!outer && !inner) {
      result.errorMessage = '外码和内码均未在系统中登记';
    } else if (!outer) {
      result.errorMessage = '外盒码未在系统中登记';
    } else {
      result.errorMessage = '内袋码未在系统中登记';
    }
    return result;
  }

  result.isValid = true;
  result.traceId = outer.traceId;
  result.productName = outer.productName;
  result.bindBatch = outer.bindBatch;
  result.isBound = (outer.innerCode === inner.innerCode) && (inner.outerCode === outer.outerCode);
  result.matchTraceId = outer.traceId === inner.traceId;
  result.matchBindBatch = outer.bindBatch === inner.bindBatch;
  result.expectedInnerCode = outer.innerCode;
  result.expectedOuterCode = inner.outerCode;

  if (!result.isBound) {
    result.errorType = 'binding_mismatch';
    result.errorMessage = '内外码绑定关系不匹配，疑似被调包或仿冒';
  } else if (!result.matchTraceId) {
    result.errorType = 'traceid_mismatch';
    result.errorMessage = '内外码对应产品不一致';
  } else if (!result.matchBindBatch) {
    result.errorType = 'batch_mismatch';
    result.errorMessage = '内外码绑定批次不一致，存在异常';
  }

  return result;
}

function getOuterCodeSummary(outerCode) {
  if (!isOuterCode(outerCode)) return null;
  const info = getDualCodeInfo(outerCode);
  const traceData = info ? mockTraceData[info.traceId] : null;
  if (!info || !traceData) return null;

  const highlights = [
    info.summary && info.summary.highlight ? info.summary.highlight : null,
    traceData.basicInfo && traceData.basicInfo.productHighlights ? traceData.basicInfo.productHighlights : null,
    info.summary && info.summary.shortDesc ? info.summary.shortDesc : null
  ].filter(Boolean);

  if ((!highlights || highlights.length === 0) && info.summary && info.summary.tags) {
    for (let i = 0; i < info.summary.tags.length; i++) {
      highlights.push(info.summary.tags[i]);
    }
  }

  return {
    outerCode: info.outerCode,
    innerCode: info.innerCode,
    traceId: info.traceId,
    productName: info.productName || (traceData.basicInfo && traceData.basicInfo.productName) || '未知产品',
    spec: (traceData.basicInfo && traceData.basicInfo.specification) || (traceData.basicInfo && traceData.basicInfo.netWeight) || '标准装',
    batchNo: (traceData.basicInfo && traceData.basicInfo.batchNo) || info.bindBatch || '未知批次',
    productionTime: traceData.basicInfo && traceData.basicInfo.productionTime,
    thumbnail: traceData.basicInfo && traceData.basicInfo.thumbnail,
    osmanthusVariety: traceData.osmanthusInfo && traceData.osmanthusInfo.variety,
    origin: traceData.osmanthusInfo && traceData.osmanthusInfo.origin,
    highlights: highlights.length > 0 ? highlights : ['精选原料', '传统工艺', '品质保证'],
    tags: info.summary ? info.summary.tags : [],
    packagingInfo: info.packagingInfo,
    bindBatch: info.bindBatch,
    bindTime: info.bindTime,
    antiCounterfeitTip: '请确认外包装完整，防伪封口贴完好无破损后，再开封扫描内码完成最终验真'
  };
}

function parseDualCodeFromScanResult(scanResult) {
  if (!scanResult) return null;

  let code = null;
  const resultStr = String(scanResult).trim();

  if (resultStr.includes('?')) {
    try {
      const urlParts = resultStr.split('?');
      const queryString = urlParts.length > 1 ? urlParts.slice(1).join('?') : '';
      const params = new URLSearchParams(queryString);
      const paramKeys = ['outerCode', 'innerCode', 'dualCode', 'code', 'dc', 'traceCode', 'qc', 'id', 'sn'];
      for (let i = 0; i < paramKeys.length; i++) {
        const val = params.get(paramKeys[i]);
        if (val && isDualCode(val)) {
          code = val;
          break;
        }
      }
      if (!code) {
        for (let i = 0; i < paramKeys.length; i++) {
          const val = params.get(paramKeys[i]);
          if (val) {
            code = val;
            break;
          }
        }
      }
    } catch (e) {}
  }

  if (!code && resultStr.startsWith('{')) {
    try {
      const json = JSON.parse(resultStr);
      const jsonKeys = ['outerCode', 'innerCode', 'dualCode', 'code', 'dc', 'traceCode', 'sn', 'id'];
      for (let i = 0; i < jsonKeys.length; i++) {
        const val = json[jsonKeys[i]];
        if (val) {
          code = val;
          break;
        }
      }
    } catch (e) {}
  }

  if (!code) {
    const dualPattern = /(OUT-|INN-)[A-Za-z0-9_-]+/i;
    const match = resultStr.match(dualPattern);
    if (match) {
      code = match[0];
    }
  }

  if (!code) {
    code = resultStr;
  }

  if (isDualCode(code)) {
    return {
      code: code.trim().toUpperCase(),
      codeType: isOuterCode(code) ? 'outer' : 'inner'
    };
  }

  return null;
}

function getAvailableOuterCodes() {
  return Object.keys(DUAL_CODE_DATA).filter(function(code) {
    return isOuterCode(code);
  });
}

function getCompareData(traceIds) {
  if (!traceIds || !Array.isArray(traceIds) || traceIds.length < 2) return null;

  var products = [];
  for (var i = 0; i < traceIds.length; i++) {
    var id = traceIds[i].toUpperCase().trim();
    var trace = mockTraceData[id];
    if (!trace) continue;
    var green = greenTraceExtended[id] || {};
    var shop = shopProducts[id] || null;
    var defaultPrice = 0;
    var priceLabel = '-';
    if (shop && shop.skuList && shop.skuList.length > 0) {
      defaultPrice = shop.skuList[shop.defaultSkuIndex || 0].price;
      priceLabel = '\u00a5' + defaultPrice.toFixed(0);
    }
    var carbonValue = 0;
    var carbonLabel = '-';
    if (green.carbonFootprint) {
      carbonValue = green.carbonFootprint.totalEmission;
      carbonLabel = carbonValue + ' ' + (green.carbonFootprint.unit || '');
    }
    var pesticideKey = '\u5168\u90e8\u5408\u683c';
    var pesticideAbnormal = 0;
    if (trace.pesticideTest) {
      pesticideAbnormal = trace.pesticideTest.hasAbnormal ? 1 : 0;
      var totalTests = (trace.pesticideTest.teaTests ? trace.pesticideTest.teaTests.length : 0) +
        (trace.pesticideTest.osmanthusTests ? trace.pesticideTest.osmanthusTests.length : 0);
      if (trace.pesticideTest.hasAbnormal) {
        pesticideKey = '\u5b58\u5728\u5f02\u5e38(' + pesticideAbnormal + '/' + totalTests + ')';
      } else {
        pesticideKey = '\u5168\u90e8\u5408\u683c(' + totalTests + '\u9879)';
      }
    }
    var rating = (3.5 + Math.random() * 1.5);
    rating = Math.round(rating * 10) / 10;
    products.push({
      traceId: id,
      productName: trace.basicInfo.productName,
      specification: trace.basicInfo.specification,
      thumbnail: trace.basicInfo.thumbnail,
      variety: trace.osmanthusInfo ? trace.osmanthusInfo.variety : '',
      batchNo: trace.basicInfo.batchNo,
      dimensions: {
        treeAge: { label: '\u6811\u9f84', value: trace.treeAge ? trace.treeAge.teaTreeAge : 0, unit: '\u5e74', display: (trace.treeAge ? trace.treeAge.teaTreeAge : '-') + '\u5e74' },
        scentingTimes: { label: '\u7aa8\u5236\u6b21\u6570', value: trace.scentingProcess ? trace.scentingProcess.scentingTimes : 0, unit: '\u6b21', display: (trace.scentingProcess ? trace.scentingProcess.scentingTimes : '-') + '\u6b21' },
        pesticideKey: { label: '\u519c\u6b8b\u5173\u952e\u9879', value: pesticideAbnormal === 0 ? 100 : 30, unit: '', display: pesticideKey, isStatus: true, isAbnormal: pesticideAbnormal > 0 },
        carbonFootprint: { label: '\u78b3\u8db3\u8ff9', value: carbonValue, unit: 'kg CO\u2082e', display: carbonLabel, lowerBetter: true },
        price: { label: '\u4ef7\u683c', value: defaultPrice, unit: '\u5143', display: priceLabel },
        rating: { label: '\u7528\u6237\u8bc4\u4ef7', value: rating, unit: '\u5206', display: rating + '\u5206' }
      }
    });
  }

  if (products.length < 2) return null;

  var dimensionKeys = ['treeAge', 'scentingTimes', 'pesticideKey', 'carbonFootprint', 'price', 'rating'];
  var radarData = [];
  for (var d = 0; d < dimensionKeys.length; d++) {
    var key = dimensionKeys[d];
    var dimVals = [];
    for (var p = 0; p < products.length; p++) {
      dimVals.push(products[p].dimensions[key].value);
    }
    var maxVal = Math.max.apply(null, dimVals);
    var minVal = Math.min.apply(null, dimVals);
    var normalized = [];
    for (var p2 = 0; p2 < products.length; p2++) {
      var raw = products[p2].dimensions[key].value;
      var norm = maxVal > 0 ? (raw / maxVal) * 100 : 0;
      if (products[p2].dimensions[key].lowerBetter) {
        norm = maxVal > 0 ? ((maxVal - raw + minVal) / maxVal) * 100 : 0;
      }
      normalized.push(Math.round(norm));
    }
    radarData.push({
      key: key,
      label: products[0].dimensions[key].label,
      values: normalized,
      rawValues: dimVals,
      hasDiff: maxVal !== minVal
    });
  }

  var diffItems = [];
  for (var di = 0; di < dimensionKeys.length; di++) {
    var dKey = dimensionKeys[di];
    var vals = [];
    for (var pi = 0; pi < products.length; pi++) {
      vals.push(products[pi].dimensions[dKey].value);
    }
    var allSame = vals.every(function(v) { return v === vals[0]; });
    if (!allSame) {
      diffItems.push({
        key: dKey,
        label: products[0].dimensions[dKey].label,
        advantageIndex: dKey === 'carbonFootprint'
          ? vals.indexOf(Math.min.apply(null, vals))
          : vals.indexOf(Math.max.apply(null, vals))
      });
    }
  }

  return {
    products: products,
    radarData: radarData,
    diffItems: diffItems,
    dimensionKeys: dimensionKeys
  };
}

// ==================== 制茶师/窨制班组数据 ====================

const TEA_MASTER_TEAMS = {
  'TM-001': {
    teamId: 'TM-001',
    teamName: '金桂窨制一组',
    leaderName: '李建国',
    leaderNameMasked: maskOperator('李建国'),
    leaderJobNo: 'ZC2018001',
    leaderQualification: '国家级非遗传承人',
    leaderQualificationLevel: '特级',
    leaderExperienceYears: 35,
    teamSize: 8,
    foundingYear: 2008,
    specialty: '金桂窨制、高端产品',
    photo: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese%20tea%20master%20artisan%20portrait%20traditional%20workshop%20elderly&image_size=portrait_4_3',
    teamPhotos: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=tea%20scenting%20workshop%20team%20of%20artisans%20processing%20osmanthus%20tea&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=traditional%20chinese%20tea%20master%20team%20group%20photo%20workshop&image_size=landscape_16_9'
    ],
    introduction: '金桂窨制一组由国家级非物质文化遗产桂花茶窨制技艺传承人李建国师傅领衔，团队成员均拥有10年以上窨制经验。团队专注于高端金桂花茶的窨制工艺，以"慢工出细活，花香入骨来"为理念，严格把控每一次窨制的温湿度、时长与配比，所产茶叶曾获多项国内外金奖。',
    craftPhilosophy: '传承古法，守正创新。窨制如育人，需耐心、细心、恒心。花与茶的相遇，是时间的艺术，更是匠心的沉淀。',
    representativeBatches: [
      { batchNo: 'GH202503', productName: '金桂花茶', year: 2025, remark: '获2025年中国茶叶博览会金奖' },
      { batchNo: 'GH202409', productName: '金桂花茶（礼盒装）', year: 2024, remark: '入选国礼茶名单' },
      { batchNo: 'GH202306', productName: '金桂花茶', year: 2023, remark: '获世界红茶品鉴大赛银奖' }
    ],
    certifications: [
      '国家级非物质文化遗产传承团队',
      '中国茶叶学会窨制工艺示范组',
      '2024年度全国制茶工匠班组'
    ],
    awards: [
      { year: 2025, title: '中国茶叶博览会金奖', level: '国家级' },
      { year: 2024, title: '国礼茶入选', level: '国家级' },
      { year: 2023, title: '世界红茶品鉴大赛银奖', level: '国际级' },
      { year: 2022, title: '省级制茶大师工作室', level: '省级' }
    ]
  },
  'TM-002': {
    teamId: 'TM-002',
    teamName: '金桂窨制二组',
    leaderName: '王德发',
    leaderNameMasked: maskOperator('王德发'),
    leaderJobNo: 'ZC2015023',
    leaderQualification: '高级制茶师',
    leaderQualificationLevel: '一级',
    leaderExperienceYears: 22,
    teamSize: 6,
    foundingYear: 2015,
    specialty: '金桂窨制、精品礼盒',
    photo: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese%20tea%20master%20artisan%20middle%20aged%20portrait%20workshop&image_size=portrait_4_3',
    teamPhotos: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=tea%20processing%20workshop%20team%20scenting%20premium%20tea&image_size=landscape_16_9'
    ],
    introduction: '金桂窨制二组由高级制茶师王德发师傅带队，主攻金桂系列精品礼盒装产品。团队在传统窨制技艺基础上，创新引入温湿度智能监控辅助，使产品稳定性大幅提升，连续三年客户满意度98%以上。',
    craftPhilosophy: '精益求精，追求极致。每一次窨制都是对品质的承诺，让每一缕桂花香都恰到好处。',
    representativeBatches: [
      { batchNo: 'GH202503', productName: '金桂花茶礼盒装', year: 2025, remark: '高端礼盒六窨工艺' },
      { batchNo: 'GH202411', productName: '金桂花茶便携装', year: 2024, remark: '年度热销产品' }
    ],
    certifications: [
      '高级制茶师示范班组',
      '质量信得过团队'
    ],
    awards: [
      { year: 2024, title: '年度品质标兵班组', level: '企业级' },
      { year: 2023, title: '创新工艺奖', level: '省级' }
    ]
  },
  'TM-003': {
    teamId: 'TM-003',
    teamName: '银桂窨制组',
    leaderName: '张清泉',
    leaderNameMasked: maskOperator('张清泉'),
    leaderJobNo: 'ZC2012008',
    leaderQualification: '制茶技师',
    leaderQualificationLevel: '二级',
    leaderExperienceYears: 18,
    teamSize: 5,
    foundingYear: 2012,
    specialty: '银桂窨制、清雅系列',
    photo: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese%20tea%20artisan%20craftsman%20portrait%20processing%20silver%20osmanthus%20tea&image_size=portrait_4_3',
    teamPhotos: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=silver%20osmanthus%20tea%20processing%20workshop%20gentle%20team&image_size=landscape_16_9'
    ],
    introduction: '银桂窨制组专注于银桂系列清雅型桂花茶的研发与生产，由制茶技师张清泉师傅带领。团队擅长把控银桂淡雅清香的特点，窨制出的茶汤口感清甜柔和，深受年轻消费者喜爱。',
    craftPhilosophy: '清雅为本，淡而不薄。银桂之香贵在清雅，窨制之道在于平衡，让花香与茶香和谐共生。',
    representativeBatches: [
      { batchNo: 'GH202504', productName: '银桂花茶', year: 2025, remark: '清雅系列代表产品' },
      { batchNo: 'GH202408', productName: '银桂花茶', year: 2024, remark: '青年消费者首选' }
    ],
    certifications: [
      '青年创新工作室'
    ],
    awards: [
      { year: 2024, title: '最受年轻人喜爱产品', level: '行业级' },
      { year: 2023, title: '创新产品奖', level: '省级' }
    ]
  },
  'TM-004': {
    teamId: 'TM-004',
    teamName: '窨制学徒组',
    leaderName: '刘芳',
    leaderNameMasked: maskOperator('刘芳'),
    leaderJobNo: 'ZC2020045',
    leaderQualification: '制茶技师',
    leaderQualificationLevel: '三级',
    leaderExperienceYears: 12,
    teamSize: 4,
    foundingYear: 2020,
    specialty: '标准化窨制、人才培养',
    photo: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=young%20female%20chinese%20tea%20master%20artisan%20portrait%20modern%20workshop&image_size=portrait_4_3',
    teamPhotos: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=young%20tea%20apprentice%20team%20learning%20scenting%20craft&image_size=landscape_16_9'
    ],
    introduction: '窨制学徒组由青年制茶技师刘芳带领，承担标准化窨制生产与技艺传承双重任务。团队积极探索传统工艺的标准化路径，同时为其他班组输送优秀窨制人才，是公司技艺传承的重要力量。',
    craftPhilosophy: '薪火相传，匠心永续。学好基本功，做好每窨茶，让古老技艺在年轻一代手中焕发新生。',
    representativeBatches: [
      { batchNo: 'GH202504', productName: '银桂花茶', year: 2025, remark: '标准化生产示范批次' }
    ],
    certifications: [
      '技艺传承示范组'
    ],
    awards: [
      { year: 2024, title: '青年文明号', level: '省级' }
    ]
  }
};

const TRACE_TO_TEAM_MAP = {
  'G001': 'TM-001',
  'G002': 'TM-003',
  'G003': 'TM-002',
  'G004': 'TM-001'
};

function getTeaMasterTeam(teamId) {
  return TEA_MASTER_TEAMS[teamId] || null;
}

function getTeaMasterTeamByTraceId(traceId) {
  const teamId = TRACE_TO_TEAM_MAP[traceId];
  if (!teamId) return null;
  return TEA_MASTER_TEAMS[teamId] || null;
}

// ==================== 茶农/合作社/采摘队 人物故事数据 ====================

const PEOPLE_STORIES = {
  'PS-001': {
    personId: 'PS-001',
    type: 'farmer',
    typeLabel: '茶农',
    name: '陈守田',
    nameMasked: maskOperator('陈守田'),
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=elderly%20chinese%20tea%20farmer%20portrait%20tea%20garden%20weathered%20face%20kind%20smile&image_size=portrait_4_3',
    experienceYears: 42,
    age: 68,
    location: '湖北省咸宁市桂花镇',
    village: '白沙村',
    joinYear: 1982,
    title: '资深茶农',
    qualification: '高级农艺师',
    specialty: ['古树茶养护', '手工采茶', '有机种植'],
    photos: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=old%20chinese%20farmer%20picking%20tea%20leaves%20in%20tea%20garden%20morning%20mist&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=tea%20farmer%20with%20ancient%20tea%20tree%20showing%20pride&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=tea%20garden%20sunrise%20terraced%20hills%20morning%20light&image_size=landscape_16_9'
    ],
    oralHistory: '我16岁就跟着父亲学种茶，那时候村里家家户户都有几棵老茶树。记得八十年代初，包产到户，我家分到了三亩茶山，那时候高兴得几夜没睡好。后来合作社成立，我们这些老茶农有了依靠，茶叶销路也稳了。\n\n这四十多年来，我就守着这几十棵老茶树，看着它们一年年发芽、采摘、再发芽。有人说我傻，守着老树不如种新品种产量高。可我知道，这些老树长了上百年，根扎得深，茶味才醇。就像做人一样，根基稳了，才能走得远。\n\n现在年纪大了，儿子也接了班，但我还是每天要去山上转一圈。看着茶芽冒尖，心里就踏实。这茶啊，是有灵性的，你对它好，它就回报你最香的味道。',
    storyHighlights: [
      { year: 1982, event: '开始跟随父亲学种茶，包产到户分到三亩茶山' },
      { year: 1995, event: '加入桂花茶合作社，成为首批核心社员' },
      { year: 2008, event: '获评"高级农艺师"职称，带动全村推广有机种植' },
      { year: 2015, event: '养护的百年古茶树被列为"古树名木"保护名录' },
      { year: 2023, event: '荣获"全国最美茶农"称号，事迹被多家媒体报道' }
    ],
    representativeBatches: [
      { batchNo: 'GH202503', productName: '金桂花茶', year: 2025, role: '茶青供应', remark: '核心产区古树茶青' },
      { batchNo: 'GH202409', productName: '金桂花茶（礼盒装）', year: 2024, role: '茶青供应', remark: '国礼茶原料供应者' },
      { batchNo: 'GH202306', productName: '金桂花茶', year: 2023, role: '茶青供应', remark: '国际银奖产品原料' }
    ],
    awards: [
      { year: 2023, title: '全国最美茶农', level: '国家级' },
      { year: 2021, title: '省级劳动模范', level: '省级' },
      { year: 2019, title: '乡村振兴带头人', level: '市级' }
    ],
    philosophy: '种茶如做人，要守得住初心，耐得住寂寞。百年树木，百年树人，茶品见人品。'
  },
  'PS-002': {
    personId: 'PS-002',
    type: 'cooperative',
    typeLabel: '合作社',
    name: '白沙村茶叶专业合作社',
    nameMasked: '白沙村茶叶专业合作社',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese%20rural%20tea%20cooperative%20building%20village%20green%20mountains&image_size=landscape_4_3',
    experienceYears: 28,
    foundingYear: 1997,
    memberCount: 156,
    location: '湖北省咸宁市桂花镇白沙村',
    village: '白沙村',
    title: '省级示范合作社',
    qualification: '国家级农民合作社示范社',
    specialty: ['古树茶保护', '有机茶种植', '茶农技能培训', '订单农业'],
    photos: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=tea%20farmers%20cooperative%20meeting%20village%20hall%20chinese%20rural&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=tea%20plantation%20cooperative%20terraced%20fields%20aerial%20view&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=tea%20farmers%20harvesting%20teamwork%20cooperative%20china&image_size=landscape_16_9'
    ],
    oralHistory: '白沙村茶叶合作社成立于1997年，那时候村里茶叶卖不出去，茶农们守着金山银山却过着穷日子。老支书带着我们几户人家，凑了点钱，成立了这个合作社。\n\n刚开始难啊，没技术、没销路、没品牌。我们就骑着自行车跑市场，一家家去推销。后来慢慢有了起色，加入的农户越来越多。2008年，我们和桂花茶厂签订了长期合作协议，茶农们的收入才真正稳了下来。\n\n现在合作社有156户社员，茶园面积2000多亩，其中百年以上古茶树300多棵。我们实行"五统一"：统一种苗、统一施肥、统一防治、统一采摘、统一销售。就是要让每一片叶子都有保障，让每一位茶农都能安心种茶。\n\n这些年，合作社带领大家脱贫致富，村里盖新房的多了，娶媳妇的多了，孩子上大学的也多了。这就是我们合作社存在的意义——不让一个茶农掉队，不让一片好茶埋没。',
    storyHighlights: [
      { year: 1997, event: '白沙村茶叶合作社成立，首批社员23户' },
      { year: 2005, event: '通过无公害农产品认证，茶园面积突破1000亩' },
      { year: 2008, event: '与桂花茶厂签订长期战略合作协议' },
      { year: 2015, event: '获评"国家级农民合作社示范社"' },
      { year: 2020, event: '带动全村脱贫，茶农户均年收入超8万元' },
      { year: 2024, event: '入选全国乡村振兴典型案例' }
    ],
    representativeBatches: [
      { batchNo: 'GH202503', productName: '金桂花茶', year: 2025, role: '茶青供应', remark: '核心合作社供应' },
      { batchNo: 'GH202409', productName: '金桂花茶（礼盒装）', year: 2024, role: '茶青供应', remark: '高端礼盒原料基地' },
      { batchNo: 'GH202306', productName: '金桂花茶', year: 2023, role: '茶青供应', remark: '国际银奖原料' },
      { batchNo: 'GH202504', productName: '银桂花茶', year: 2025, role: '茶青供应', remark: '清雅系列原料' }
    ],
    awards: [
      { year: 2024, title: '全国乡村振兴典型案例', level: '国家级' },
      { year: 2015, title: '国家级农民合作社示范社', level: '国家级' },
      { year: 2022, title: '省级乡村振兴先进集体', level: '省级' }
    ],
    philosophy: '合作社不是一个人的事，是大家的事。抱团取暖，共同富裕，这就是我们的初心。'
  },
  'PS-003': {
    personId: 'PS-003',
    type: 'pickingTeam',
    typeLabel: '桂花采摘队',
    name: '桂花镇女子采摘队',
    nameMasked: '桂花镇女子采摘队',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese%20female%20farmers%20picking%20osmanthus%20flowers%20team%20colorful%20scarves&image_size=portrait_4_3',
    experienceYears: 18,
    teamSize: 32,
    foundingYear: 2007,
    location: '湖北省咸宁市桂花镇',
    village: '桂花村',
    title: '桂花采摘先锋队',
    qualification: '市级三八红旗集体',
    specialty: ['桂花采摘', '鲜花分拣', '品质初检', '时令调度'],
    photos: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=women%20picking%20osmanthus%20flowers%20chinese%20village%20autumn%20golden&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=osmanthus%20flower%20harvest%20baskets%20full%20of%20golden%20flowers&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=women%20farmers%20team%20photo%20village%20china%20smiling%20harvest&image_size=landscape_16_9'
    ],
    oralHistory: '我们这支采摘队，全是镇上的妇女姐妹。2007年成立的时候，只有8个人，都是家里种了桂花树的农妇。那时候桂花采摘全靠手，一天下来腰酸背痛，还卖不上好价钱。\n\n后来茶厂需要大量新鲜桂花，我们就组织起来，统一培训、统一标准、统一采摘。姐妹们手都巧，眼睛也尖，什么样的桂花好，一看就知道。我们有个规矩：晴天采、带露采、开八成、不采嫩。这样采下来的桂花，香得正、香得久。\n\n现在队伍壮大到32人，都是十里八乡的采摘能手。每年桂花开放的季节，就是我们最忙的时候。天不亮就上山，太阳落山才回家。虽然辛苦，但看着一篮篮金灿灿的桂花变成一杯杯香甜的茶，心里就美滋滋的。\n\n姐妹们常说，以前我们在家带孩子做饭，现在靠自己的双手挣钱，腰杆都挺直了。这桂花啊，不仅香了茶，也香了我们的日子。',
    storyHighlights: [
      { year: 2007, event: '桂花镇女子采摘队成立，首批队员8人' },
      { year: 2012, event: '制定桂花采摘标准，培训采摘能手50余人' },
      { year: 2018, event: '获评"市级三八红旗集体"' },
      { year: 2021, event: '采摘队规模扩大到32人，带动200余户花农增收' },
      { year: 2024, event: '入选"全国巾帼建功先进集体"候选名单' }
    ],
    representativeBatches: [
      { batchNo: 'GH202503', productName: '金桂花茶', year: 2025, role: '桂花采摘', remark: '金秋一级桂花原料' },
      { batchNo: 'GH202504', productName: '银桂花茶', year: 2025, role: '桂花采摘', remark: '银桂精品原料' },
      { batchNo: 'GH202409', productName: '金桂花茶（礼盒装）', year: 2024, role: '桂花采摘', remark: '头采精品桂花' }
    ],
    awards: [
      { year: 2024, title: '全国巾帼建功先进集体（候选）', level: '国家级' },
      { year: 2018, title: '市级三八红旗集体', level: '市级' },
      { year: 2022, title: '乡村振兴巾帼示范队', level: '县级' }
    ],
    philosophy: '手巧心细，采好每一朵花。我们是桂花的搬运工，也是茶香的守护者。'
  },
  'PS-004': {
    personId: 'PS-004',
    type: 'farmer',
    typeLabel: '茶农',
    name: '李桂英',
    nameMasked: maskOperator('李桂英'),
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=middle%20aged%20chinese%20female%20tea%20farmer%20osmanthus%20garden%20warm%20smile&image_size=portrait_4_3',
    experienceYears: 25,
    age: 52,
    location: '湖北省咸宁市桂花镇',
    village: '桂香村',
    joinYear: 2000,
    title: '桂花种植能手',
    qualification: '初级农技师',
    specialty: ['桂花种植', '桂花树养护', '鲜花品质把控'],
    photos: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=woman%20farmer%20tending%20osmanthus%20trees%20chinese%20countryside&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=osmanthus%20tree%20garden%20golden%20blossoms%20autumn%20sunlight&image_size=landscape_16_9'
    ],
    oralHistory: '我娘家就在桂花镇，从小闻着桂花香长大。2000年嫁到桂香村，婆家有二十几棵桂花树。那时候桂花不值钱，很多人家都把树砍了种庄稼。我舍不得，就一棵一棵养着。\n\n后来合作社找上门来，说要收购桂花做茶。我那叫一个高兴啊，这些桂花树终于有了用武之地！我跟着技术员学修剪、学施肥、学防虫，把每棵树都伺候得好好的。\n\n二十多年了，我养的桂花树从二十几棵变成了八十多棵，年年开花都比别人的多、比别人的香。茶厂的人说，我家的桂花是"特级原料"。\n\n有人问我有啥秘诀？我说没啥秘诀，就是用心。你对树好，树就对你好。你糊弄它，它就糊弄你。这道理，种树种茶做人，都是一样的。',
    storyHighlights: [
      { year: 2000, event: '嫁到桂香村，开始养护婆家的20余棵桂花树' },
      { year: 2006, event: '加入合作社，成为首批桂花种植户' },
      { year: 2015, event: '获评"桂花种植能手"称号' },
      { year: 2020, event: '家庭桂花树发展到80余棵，年收入超5万元' },
      { year: 2023, event: '作为农技师培训新花农30余人' }
    ],
    representativeBatches: [
      { batchNo: 'GH202503', productName: '金桂花茶', year: 2025, role: '桂花供应', remark: '特级金桂原料' },
      { batchNo: 'GH202409', productName: '金桂花茶（礼盒装）', year: 2024, role: '桂花供应', remark: '头采桂花供应户' }
    ],
    awards: [
      { year: 2023, title: '桂花种植能手', level: '县级' },
      { year: 2021, title: '最美巾帼奋斗者', level: '镇级' }
    ],
    philosophy: '种树如养孩子，要用心、要有耐心。花开的时候，所有的辛苦都值了。'
  }
};

const TRACE_TO_PEOPLE_MAP = {
  'G001': ['PS-001', 'PS-002', 'PS-003'],
  'G002': ['PS-003', 'PS-004'],
  'G003': ['PS-002', 'PS-004'],
  'G004': ['PS-001', 'PS-002', 'PS-003', 'PS-004']
};

function getPeopleStory(personId) {
  return PEOPLE_STORIES[personId] || null;
}

function getPeopleStoriesByTraceId(traceId) {
  const personIds = TRACE_TO_PEOPLE_MAP[traceId];
  if (!personIds) return [];
  return personIds.map(function(id) { return PEOPLE_STORIES[id]; }).filter(Boolean);
}

function getPeopleSummaryByTraceId(traceId) {
  const personIds = TRACE_TO_PEOPLE_MAP[traceId];
  if (!personIds) return null;
  const people = personIds.map(function(id) { return PEOPLE_STORIES[id]; }).filter(Boolean);
  if (people.length === 0) return null;
  return {
    count: people.length,
    types: [...new Set(people.map(function(p) { return p.typeLabel; }))],
    people: people.map(function(p) {
      return {
        personId: p.personId,
        type: p.type,
        typeLabel: p.typeLabel,
        name: p.name,
        nameMasked: p.nameMasked,
        avatar: p.avatar,
        title: p.title,
        experienceYears: p.experienceYears
      };
    })
  };
}

(function injectPeopleInfo() {
  Object.keys(TRACE_TO_PEOPLE_MAP).forEach(function(traceId) {
    var traceData = mockTraceData[traceId];
    var summary = getPeopleSummaryByTraceId(traceId);
    if (traceData && summary) {
      traceData.peopleStories = summary;
    }
  });
})();

/* =====================================================
 * ===== 叙事链映射：人物 ↔ 制茶师 ↔ 批次 ↔ traceId =====
 * ===================================================== */

/**
 * 通过批次号查找对应的 traceId
 * @param {string} batchNo - 批次号
 * @returns {string|null} traceId 或 null
 */
function getTraceIdByBatchNo(batchNo) {
  if (!batchNo) return null;
  var normalized = batchNo.trim().toUpperCase();
  for (var traceId in mockTraceData) {
    var data = mockTraceData[traceId];
    if (data.basicInfo && data.basicInfo.batchNo === normalized) {
      return traceId;
    }
  }
  return null;
}

/**
 * 通过人物ID获取关联的制茶师信息
 * 优先通过代表批次找到 traceId，再通过 traceId 找制茶师团队
 * @param {string} personId - 人物ID
 * @returns {Object|null} { teamId, teamName, leaderName, traceId } 或 null
 */
function getTeaMasterByPersonId(personId) {
  if (!personId) return null;
  var person = PEOPLE_STORIES[personId];
  if (!person) return null;

  var traceId = null;
  if (person.representativeBatches && person.representativeBatches.length > 0) {
    for (var i = 0; i < person.representativeBatches.length; i++) {
      var batch = person.representativeBatches[i];
      traceId = getTraceIdByBatchNo(batch.batchNo);
      if (traceId) break;
    }
  }

  if (!traceId) {
    for (var tId in TRACE_TO_PEOPLE_MAP) {
      if (TRACE_TO_PEOPLE_MAP[tId].indexOf(personId) !== -1) {
        traceId = tId;
        break;
      }
    }
  }

  if (!traceId) return null;

  var team = getTeaMasterTeamByTraceId(traceId);
  if (!team) return null;

  return {
    teamId: team.teamId,
    teamName: team.teamName,
    leaderName: team.leaderName,
    leaderNameMasked: team.leaderNameMasked,
    leaderAvatar: team.leaderAvatar,
    leaderExperienceYears: team.leaderExperienceYears,
    teamSize: team.teamSize,
    traceId: traceId,
    batchNo: mockTraceData[traceId] ? mockTraceData[traceId].basicInfo.batchNo : ''
  };
}

/**
 * 通过制茶师团队ID获取关联的人物故事列表
 * 先通过 teamId 找到 traceId，再通过 traceId 找人物
 * @param {string} teamId - 制茶师团队ID
 * @returns {Object|null} { traceId, people: [...] } 或 null
 */
function getPeopleByTeamId(teamId) {
  if (!teamId) return null;

  var traceId = null;
  for (var tId in TRACE_TO_TEAM_MAP) {
    if (TRACE_TO_TEAM_MAP[tId] === teamId) {
      traceId = tId;
      break;
    }
  }

  if (!traceId) return null;

  var peopleList = getPeopleStoriesByTraceId(traceId);
  var summary = getPeopleSummaryByTraceId(traceId);

  return {
    traceId: traceId,
    batchNo: mockTraceData[traceId] ? mockTraceData[traceId].basicInfo.batchNo : '',
    count: summary ? summary.count : 0,
    types: summary ? summary.types : [],
    people: peopleList
  };
}

function getAllTeaMasterTeams() {
  return Object.values(TEA_MASTER_TEAMS);
}

// 将班组信息注入 scentingProcess
(function injectTeamInfo() {
  Object.keys(TRACE_TO_TEAM_MAP).forEach(function(traceId) {
    var traceData = mockTraceData[traceId];
    var teamId = TRACE_TO_TEAM_MAP[traceId];
    var team = TEA_MASTER_TEAMS[teamId];
    if (traceData && traceData.scentingProcess && team) {
      traceData.scentingProcess.teaMasterTeam = {
        teamId: team.teamId,
        teamName: team.teamName,
        leaderName: team.leaderName,
        leaderNameMasked: team.leaderNameMasked,
        leaderQualification: team.leaderQualification,
        leaderExperienceYears: team.leaderExperienceYears
      };
    }
  });
})();

function addBrandReply(traceId, reviewId, content) {
  var normalizedId = traceId.trim().toUpperCase();
  var data = PRODUCT_REVIEWS[normalizedId];
  if (!data) return { success: false, message: '产品不存在' };

  for (var i = 0; i < data.reviews.length; i++) {
    if (data.reviews[i].id === reviewId) {
      var brandReply = reviewTrust.createBrandReply(reviewId, content);
      data.reviews[i].brandReply = brandReply;
      return {
        success: true,
        message: '回复已发布',
        brandReply: brandReply
      };
    }
  }
  return { success: false, message: '评价不存在' };
}

function submitReviewFromNote(traceId, note) {
  var reviewData = reviewTrust.convertTastingNoteToReview(note, traceId);
  if (!reviewData) {
    return { success: false, message: '笔记数据无效' };
  }
  return submitReview(traceId, reviewData);
}

function getReviewSortOptions() {
  return [
    { key: 'quality', name: '综合排序', icon: '🏆' },
    { key: 'trust', name: '信任优先', icon: '✓' },
    { key: 'newest', name: '最新发布', icon: '🕐' },
    { key: 'highest', name: '评分最高', icon: '⭐' }
  ];
}

// ==================== 政府溯源平台数据 ====================

const GOV_TRACE_DATA = {
  'G001': {
    traceId: 'G001',
    batchNo: 'GH202503',
    platformLevel: 'dual',
    province: {
      platformName: '湖北省茶叶质量追溯平台',
      govCode: 'HB20250925GH202503857201',
      filingNo: 'HUBEI-TEA-2025-00857',
      filingStatus: 'approved',
      filingStatusLabel: '备案通过',
      filingDate: '2025-09-25',
      verifyUrl: 'https://www.hbtea-trace.gov.cn/verify?code=HB20250925GH202503857201',
      regulatoryAuthority: '湖北省农业农村厅',
      inspectionRecords: [
        { date: '2025-09-20', institution: '湖北省农产品质量安全检测中心', result: '合格', reportNo: 'HBAQ-2025-09876' },
        { date: '2025-07-15', institution: '湖北省农产品质量安全检测中心', result: '合格', reportNo: 'HBAQ-2025-07654' }
      ],
      supervisionLevel: 'A级'
    },
    national: {
      platformName: '国家农产品质量安全追溯管理信息平台',
      govCode: 'NA20250925GH202503462189',
      filingNo: 'NA-AGRI-2025-336872',
      filingStatus: 'approved',
      filingStatusLabel: '备案通过',
      filingDate: '2025-09-26',
      verifyUrl: 'https://www.ziyun.anluyun.com/verify?code=NA20250925GH202503462189',
      regulatoryAuthority: '农业农村部农产品质量安全监管司',
      inspectionRecords: [
        { date: '2025-09-22', institution: '国家茶叶质量监督检验中心', result: '合格', reportNo: 'NTQC-2025-09876' }
      ],
      supervisionLevel: '国家级监测点'
    },
    complianceText: '本品已纳入 湖北省茶叶追溯体系 及 国家农产品质量安全追溯平台，接受政府全程质量监管',
    lastSyncTime: '2025-12-10 18:30:00'
  },
  'G002': {
    traceId: 'G002',
    batchNo: 'GH202504',
    platformLevel: 'dual',
    province: {
      platformName: '湖北省茶叶质量追溯平台',
      govCode: 'HB20250930GH202504129567',
      filingNo: 'HUBEI-TEA-2025-00862',
      filingStatus: 'warning',
      filingStatusLabel: '质量预警',
      filingDate: '2025-09-30',
      verifyUrl: 'https://www.hbtea-trace.gov.cn/verify?code=HB20250930GH202504129567',
      regulatoryAuthority: '湖北省农业农村厅',
      inspectionRecords: [
        { date: '2025-09-25', institution: '湖北省农产品质量安全检测中心', result: '不合格', reportNo: 'HBAQ-2025-12345', abnormalItems: ['氯氰菊酯超标27.5%'] },
        { date: '2025-07-20', institution: '湖北省农产品质量安全检测中心', result: '合格', reportNo: 'HBAQ-2025-09876' }
      ],
      supervisionLevel: 'B级',
      warningMessage: '省级抽查发现1项指标超标，建议谨慎购买，已列入重点监测名单'
    },
    national: {
      platformName: '国家农产品质量安全追溯管理信息平台',
      govCode: 'NA20250930GH202504782305',
      filingNo: 'NA-AGRI-2025-336915',
      filingStatus: 'warning',
      filingStatusLabel: '重点监测',
      filingDate: '2025-09-30',
      verifyUrl: 'https://www.ziyun.anluyun.com/verify?code=NA20250930GH202504782305',
      regulatoryAuthority: '农业农村部农产品质量安全监管司',
      inspectionRecords: [
        { date: '2025-09-28', institution: '国家茶叶质量监督检验中心', result: '不合格', reportNo: 'NTQC-2025-12345', abnormalItems: ['氯氰菊酯超标27.5%'] }
      ],
      supervisionLevel: '国家级重点监测',
      warningMessage: '国家例行抽查发现农残超标，已启动省级联动处置机制'
    },
    complianceText: '本品已纳入 湖北省茶叶追溯体系 及 国家农产品质量安全追溯平台，接受政府全程质量监管',
    lastSyncTime: '2025-12-08 09:15:00'
  },
  'G003': {
    traceId: 'G003',
    batchNo: 'GH202503',
    platformLevel: 'dual',
    province: {
      platformName: '湖北省茶叶质量追溯平台',
      govCode: 'HB20250925GH202503857202',
      filingNo: 'HUBEI-TEA-2025-00857',
      filingStatus: 'approved',
      filingStatusLabel: '备案通过',
      filingDate: '2025-09-25',
      verifyUrl: 'https://www.hbtea-trace.gov.cn/verify?code=HB20250925GH202503857202',
      regulatoryAuthority: '湖北省农业农村厅',
      inspectionRecords: [
        { date: '2025-09-20', institution: '湖北省农产品质量安全检测中心', result: '合格', reportNo: 'HBAQ-2025-09877' }
      ],
      supervisionLevel: 'A级'
    },
    national: {
      platformName: '国家农产品质量安全追溯管理信息平台',
      govCode: 'NA20250925GH202503462190',
      filingNo: 'NA-AGRI-2025-336873',
      filingStatus: 'approved',
      filingStatusLabel: '备案通过',
      filingDate: '2025-09-26',
      verifyUrl: 'https://www.ziyun.anluyun.com/verify?code=NA20250925GH202503462190',
      regulatoryAuthority: '农业农村部农产品质量安全监管司',
      inspectionRecords: [
        { date: '2025-09-22', institution: '国家茶叶质量监督检验中心', result: '合格', reportNo: 'NTQC-2025-09877' }
      ],
      supervisionLevel: '国家级监测点'
    },
    complianceText: '本品已纳入 湖北省茶叶追溯体系 及 国家农产品质量安全追溯平台，接受政府全程质量监管',
    lastSyncTime: '2025-12-12 14:38:00'
  },
  'G004': {
    traceId: 'G004',
    batchNo: 'GH202503',
    platformLevel: 'province',
    province: {
      platformName: '湖北省茶叶质量追溯平台',
      govCode: 'HB20250925GH202503857203',
      filingNo: 'HUBEI-TEA-2025-00857',
      filingStatus: 'approved',
      filingStatusLabel: '备案通过',
      filingDate: '2025-09-25',
      verifyUrl: 'https://www.hbtea-trace.gov.cn/verify?code=HB20250925GH202503857203',
      regulatoryAuthority: '湖北省农业农村厅',
      inspectionRecords: [
        { date: '2025-09-20', institution: '湖北省农产品质量安全检测中心', result: '合格', reportNo: 'HBAQ-2025-09878' }
      ],
      supervisionLevel: 'A级'
    },
    national: null,
    complianceText: '本品已纳入 湖北省茶叶追溯体系，接受农业农村部门全程质量监管',
    lastSyncTime: '2025-11-30 10:22:00'
  }
};

const GOV_CODE_TO_TRACE_MAP = {};

(function buildGovCodeMap() {
  Object.values(GOV_TRACE_DATA).forEach(function(item) {
    if (item.province && item.province.govCode) {
      GOV_CODE_TO_TRACE_MAP[item.province.govCode] = item.traceId;
    }
    if (item.national && item.national.govCode) {
      GOV_CODE_TO_TRACE_MAP[item.national.govCode] = item.traceId;
    }
  });
})();

const GOV_PLATFORM_STATUS_UPDATES = [
  {
    updateId: 'GOV-UPDATE-001',
    batchNo: 'GH202504',
    productName: '银桂花茶',
    status: 'recall',
    statusLabel: '责令召回',
    reason: '省级监督抽查发现农残超标',
    description: '2025年11月湖北省农业农村厅组织省级农产品质量安全监督抽查，该批次氯氰菊酯检出值为25.5mg/kg，超过GB 2763-2021限值20mg/kg，超标27.5%。依据《农产品质量安全法》，责令生产企业立即召回。',
    platformLevel: 'province',
    issuedAt: 1761955200000,
    severity: 'high',
    noticeUrl: 'https://www.hbtea-trace.gov.cn/notice/GOV-RECALL-2025-001',
    affectedRange: '全国',
    affectedQuantity: 5800,
    affectedUnit: '罐',
    inspectReportNo: 'HBAQ-2025-12345',
    abnormalItems: [
      { item: '氯氰菊酯', value: '25.5mg/kg', limit: '20mg/kg', exceedingRate: '27.5%' }
    ],
    disposalMeasures: [
      '立即停止销售该批次产品',
      '通知所有经销商下架封存',
      '发布公开召回公告',
      '消费者可凭购买凭证办理全额退款',
      '企业限期6个月整改'
    ]
  },
  {
    updateId: 'GOV-UPDATE-002',
    batchNo: 'GH202504',
    productName: '银桂花茶',
    status: 'revoked',
    statusLabel: '备案撤销',
    reason: '未按要求完成整改',
    description: '该批次产品备案因企业未在规定期限内完成整改并提交复查申请，依据《湖北省茶叶产品追溯管理办法》，撤销该批次产品备案信息。',
    platformLevel: 'national',
    issuedAt: 1762560000000,
    severity: 'critical',
    noticeUrl: 'https://www.ziyun.anluyun.com/notice/NA-REVOKE-2025-012',
    affectedRange: '全国',
    inspectReportNo: 'NTQC-2025-12345'
  }
];

function getGovTraceByTraceId(traceId) {
  const normalizedId = traceId.trim().toUpperCase();
  return GOV_TRACE_DATA[normalizedId] || null;
}

function getGovTraceByGovCode(govCode) {
  const code = govCode.trim();
  const traceId = GOV_CODE_TO_TRACE_MAP[code];
  if (!traceId) return null;
  const govInfo = GOV_TRACE_DATA[traceId];
  if (!govInfo) return null;

  const isProvinceCode = code.startsWith('HB');
  return {
    traceId: govInfo.traceId,
    batchNo: govInfo.batchNo,
    platformLevel: isProvinceCode ? 'province' : 'national',
    matchedGovCode: code,
    province: govInfo.province,
    national: govInfo.national,
    complianceText: govInfo.complianceText,
    lastSyncTime: govInfo.lastSyncTime
  };
}

function updateGovTraceReport(batchNo, reportRecord) {
  Object.values(GOV_TRACE_DATA).forEach(function(item) {
    if (item.batchNo === batchNo) {
      if (reportRecord.provinceGovCode && item.province) {
        item.province.govCode = reportRecord.provinceGovCode;
      }
      if (reportRecord.nationalGovCode && item.national) {
        item.national.govCode = reportRecord.nationalGovCode;
      }
      if (reportRecord.provinceFilingNo && item.province) {
        item.province.filingNo = reportRecord.provinceFilingNo;
      }
      if (reportRecord.nationalFilingNo && item.national) {
        item.national.filingNo = reportRecord.nationalFilingNo;
      }
      item.lastSyncTime = new Date().toLocaleString('zh-CN');
    }
  });
}

function getGovPlatformStatusUpdates() {
  return GOV_PLATFORM_STATUS_UPDATES.slice();
}

function updateProductGovStatus(batchNo, newStatus) {
  Object.values(GOV_TRACE_DATA).forEach(function(item) {
    if (item.batchNo === batchNo) {
      const statusLabelMap = {
        pending: '待审核',
        approved: '备案通过',
        warning: '质量预警',
        revoked: '备案撤销',
        recall: '责令召回'
      };
      if (item.province) {
        item.province.filingStatus = newStatus;
        item.province.filingStatusLabel = statusLabelMap[newStatus] || newStatus;
      }
      if (item.national) {
        item.national.filingStatus = newStatus;
        item.national.filingStatusLabel = statusLabelMap[newStatus] || newStatus;
      }
    }
  });
}

function addRecallRecord(recallInfo) {
  if (!RECALL_BATCHES) return;
  var batchNo = recallInfo.batchNo;
  if (!batchNo) return;

  var existing = RECALL_BATCHES[batchNo];
  if (!existing) {
    RECALL_BATCHES[batchNo] = {
      recallId: recallInfo.recallId || ('R' + Date.now()),
      batchNo: batchNo,
      productName: recallInfo.productName || '',
      issueCategory: recallInfo.issueCategory || '',
      issueDescription: recallInfo.issueDescription || '',
      recallLevel: recallInfo.recallLevel || 'level2',
      recallLevelLabel: recallInfo.recallLevelLabel || '二级召回',
      publishDate: recallInfo.publishDate || new Date().toLocaleDateString(),
      isRecalled: true,
      affectedTraceIds: [],
      officialNotice: recallInfo.officialNotice || false,
      officialNoticeUrl: recallInfo.officialNoticeUrl || '',
      affectedRange: recallInfo.affectedRange || '',
      source: recallInfo.source || '',
      sourceName: recallInfo.sourceName || '',
      testItems: [],
      officialAdvice: [
        '立即停止食用该批次产品',
        '联系原购买渠道或客服办理召回登记',
        '如已食用并出现不适，请及时就医'
      ]
    };

    if (recallInfo.affectedTraceIds && recallInfo.affectedTraceIds.length > 0) {
      RECALL_BATCHES[batchNo].affectedTraceIds = recallInfo.affectedTraceIds;
      recallInfo.affectedTraceIds.forEach(function(traceId) {
        RECALL_TRACE_ID_MAP[traceId] = batchNo;
      });
    }
  }
}

var AUTHORIZED_NETWORK_STORES = [
  {
    id: 'AN-HOTEL-001',
    name: '武汉光谷希尔顿酒店',
    type: 'hotel',
    storeCode: 'S-HBWH-001',
    address: '湖北省武汉市洪山区光谷大道77号',
    city: '武汉',
    lat: 30.5058,
    lng: 114.4028,
    phone: '027-87889988',
    businessHours: '07:00-22:00',
    supplyBatchRange: ['GH202503', 'GH202504'],
    authorizationStart: '2025-01-01',
    authorizationExpiry: '2026-12-31',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20hotel%20lobby%20tea%20ceremony%20osmanthus%20tea%20service&image_size=square'
    ],
    tags: ['高端酒店', '大堂茶叙', '商务接待'],
    description: '酒店大堂吧提供官方授权金桂花茶冲泡服务，选用武夷山金桂原叶，专业茶艺师现场冲泡',
    features: ['专业茶艺师', '独立茶室', '商务洽谈'],
    rating: 4.8,
    reviewCount: 126
  },
  {
    id: 'AN-HOTEL-002',
    name: '杭州西溪悦榕庄',
    type: 'hotel',
    storeCode: 'S-ZJHZ-001',
    address: '浙江省杭州市西湖区紫金港路21号',
    city: '杭州',
    lat: 30.2741,
    lng: 120.0875,
    phone: '0571-85858888',
    businessHours: '08:00-23:00',
    supplyBatchRange: ['GH202503'],
    authorizationStart: '2025-03-01',
    authorizationExpiry: '2026-06-30',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=banyan%20tree%20hotel%20chinese%20tea%20ceremony%20elegant%20setting&image_size=square'
    ],
    tags: ['度假酒店', '养生茶道', '湖景茶叙'],
    description: '西溪湿地旁度假酒店，提供桂花茶品鉴体验，环境优美，适合慢享茶时光',
    features: ['湖景茶室', '私享空间', '养生茶饮'],
    rating: 4.9,
    reviewCount: 89
  },
  {
    id: 'AN-TEA-001',
    name: '和静园茶馆·武汉天地店',
    type: 'tea_house',
    storeCode: 'S-HBWH-002',
    address: '湖北省武汉市江岸区中山大道1505号武汉天地A区3栋',
    city: '武汉',
    lat: 30.5952,
    lng: 114.2895,
    phone: '027-82736688',
    businessHours: '10:00-22:00',
    supplyBatchRange: ['GH202503', 'GH202504'],
    authorizationStart: '2025-02-01',
    authorizationExpiry: '2026-12-31',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=traditional%20chinese%20tea%20house%20elegant%20interior%20osmanthus%20tea%20brewing&image_size=square'
    ],
    tags: ['茶馆', '古法冲泡', '茶艺体验'],
    description: '武汉知名茶文化品牌，专注古法桂花茶冲泡，配备专业茶艺师，提供品鉴级冲泡服务',
    features: ['专业茶艺师', '古法冲泡', '茶器展示'],
    rating: 4.7,
    reviewCount: 203
  },
  {
    id: 'AN-TEA-002',
    name: '茗香阁·咸宁桂花镇店',
    type: 'tea_house',
    storeCode: 'S-HBXN-001',
    address: '湖北省咸宁市咸安区桂花镇桂花大道88号',
    city: '咸宁',
    lat: 29.8416,
    lng: 114.3178,
    phone: '0715-8322888',
    businessHours: '09:00-21:00',
    supplyBatchRange: ['GH202503', 'GH202504'],
    authorizationStart: '2025-01-15',
    authorizationExpiry: '2026-12-31',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=rustic%20chinese%20tea%20house%20osmanthus%20village%20countryside%20tea%20culture&image_size=square'
    ],
    tags: ['产地茶馆', '桂花之乡', '现摘现窨'],
    description: '坐落于桂花之乡核心产区，可参观金桂种植基地，体验从采摘到窨制的完整过程',
    features: ['产地体验', '现摘现窨', '桂花文化'],
    rating: 4.6,
    reviewCount: 157
  },
  {
    id: 'AN-TEA-003',
    name: '悟茶堂·上海外滩店',
    type: 'tea_house',
    storeCode: 'S-SHHP-001',
    address: '上海市黄浦区中山东一路18号3楼',
    city: '上海',
    lat: 31.2397,
    lng: 121.4918,
    phone: '021-63218888',
    businessHours: '10:00-23:00',
    supplyBatchRange: ['GH202503'],
    authorizationStart: '2025-04-01',
    authorizationExpiry: '2026-03-31',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20tea%20house%20shanghai%20bund%20view%20premium%20osmanthus%20tea&image_size=square'
    ],
    tags: ['外滩茶室', '江景品茶', '高端体验'],
    description: '外滩江景茶室，可远眺浦东天际线品鉴桂花茶，中西合璧的品茶体验',
    features: ['江景品茶', '中西融合', '私人包间'],
    rating: 4.8,
    reviewCount: 95
  },
  {
    id: 'AN-VIP-001',
    name: '武汉天河机场贵宾厅·东方航空',
    type: 'airport_vip',
    storeCode: 'S-HBWH-003',
    address: '湖北省武汉市黄陂区天河机场T3航站楼VIP区',
    city: '武汉',
    lat: 30.7838,
    lng: 114.2078,
    phone: '027-85818888',
    businessHours: '06:00-航班结束',
    supplyBatchRange: ['GH202503'],
    authorizationStart: '2025-05-01',
    authorizationExpiry: '2026-04-30',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=airport%20vip%20lounge%20premium%20tea%20service%20chinese%20osmanthus%20tea&image_size=square'
    ],
    tags: ['机场贵宾厅', '候机品茶', '商务出行'],
    description: '东方航空贵宾厅专属提供金桂花茶冲泡服务，候机时光亦可品味正宗桂花茶',
    features: ['候机服务', '快速冲泡', '商务休闲'],
    rating: 4.5,
    reviewCount: 67
  },
  {
    id: 'AN-VIP-002',
    name: '北京首都机场贵宾厅·国航',
    type: 'airport_vip',
    storeCode: 'S-BJCY-001',
    address: '北京市朝阳区首都机场T3航站楼VIP区',
    city: '北京',
    lat: 40.0799,
    lng: 116.6031,
    phone: '010-64563388',
    businessHours: '05:30-航班结束',
    supplyBatchRange: ['GH202503', 'GH202504'],
    authorizationStart: '2025-06-01',
    authorizationExpiry: '2026-05-31',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beijing%20airport%20vip%20lounge%20chinese%20tea%20ceremony%20elegant&image_size=square'
    ],
    tags: ['机场贵宾厅', '国航专属', '首都出发'],
    description: '国航贵宾厅官方授权提供桂花茶品鉴，在候机间隙体验地道桂花茶文化',
    features: ['候机服务', '国航会员', '茶文化展示'],
    rating: 4.4,
    reviewCount: 52
  },
  {
    id: 'AN-HOTEL-003',
    name: '深圳瑞吉酒店',
    type: 'hotel',
    storeCode: 'S-GDSZ-001',
    address: '广东省深圳市罗湖区深南东路5016号',
    city: '深圳',
    lat: 22.5431,
    lng: 114.0579,
    phone: '0755-22238888',
    businessHours: '07:30-23:00',
    supplyBatchRange: ['GH202503'],
    authorizationStart: '2025-03-15',
    authorizationExpiry: '2026-03-14',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=st%20regis%20hotel%20afternoon%20tea%20osmanthus%20tea%20premium%20service&image_size=square'
    ],
    tags: ['奢华酒店', '下午茶', '城市度假'],
    description: '瑞吉酒店下午茶服务提供官方授权金桂花茶，搭配精致茶点，尽享都市优雅时光',
    features: ['下午茶', '精致茶点', '城市天际线'],
    rating: 4.7,
    reviewCount: 73
  }
];

var STORE_MOCK_REVIEWS = {
  'AN-HOTEL-001': [
    { id: 'SMR-001', storeId: 'AN-HOTEL-001', userId: 'U001', userName: '茶旅达人', rating: 5, content: '希尔顿的大堂吧环境一流，茶艺师手法专业，金桂花茶香气四溢，商务接待首选', images: [], tags: ['环境优雅', '茶艺专业'], isVerifiedPurchase: true, createTime: '2025-11-15T10:30:00Z', likeCount: 23, reply: null },
    { id: 'SMR-002', storeId: 'AN-HOTEL-001', userId: 'U002', userName: '茶友小王', rating: 4, content: '冲泡服务不错，就是价格略高，建议推出组合套餐', images: [], tags: ['服务好'], isVerifiedPurchase: true, createTime: '2025-12-01T14:20:00Z', likeCount: 8, reply: null }
  ],
  'AN-TEA-001': [
    { id: 'SMR-003', storeId: 'AN-TEA-001', userId: 'U003', userName: '品茶客', rating: 5, content: '和静园是武汉最好的桂花茶体验店，古法冲泡别具一格，每次来都有新体验', images: [], tags: ['古法冲泡', '茶艺精湛'], isVerifiedPurchase: true, createTime: '2025-10-20T09:15:00Z', likeCount: 45, reply: { replyContent: '感谢您的认可！我们将持续提升服务品质', replyTime: '2025-10-21T10:00:00Z' } },
    { id: 'SMR-004', storeId: 'AN-TEA-001', userId: 'U004', userName: '桂花控', rating: 5, content: '终于找到正宗的桂花茶冲泡点了！门店扫码验证了官方授权，喝着特别安心', images: [], tags: ['官方授权', '正宗口感'], isVerifiedPurchase: true, createTime: '2025-11-08T16:40:00Z', likeCount: 32, reply: null }
  ]
};

function getAuthorizedNetworkStores() {
  return AUTHORIZED_NETWORK_STORES;
}

function getStoreReviews(storeId) {
  return STORE_MOCK_REVIEWS[storeId] || [];
}

// ==================== 经销商培训课程数据 ====================
const TRAINING_COURSES = [
  {
    id: 'COURSE-PRODUCT-001',
    name: '桂花茶产品知识',
    category: 'product',
    isRequired: true,
    description: '系统学习桂花茶的产品特点、品种分类、品质鉴别等核心知识，为销售工作打下坚实基础。',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=osmanthus%20tea%20product%20knowledge%20training%20cover%20elegant%20tea%20products&image_size=landscape_16_9',
    instructor: '王讲师',
    instructorTitle: '产品培训经理',
    estimatedMinutes: 45,
    difficulty: 'beginner',
    publishTime: Date.now() - 86400000 * 30,
    chapters: [
      {
        id: 'CH-PRODUCT-001',
        title: '桂花茶产品概述',
        duration: 600,
        minStudySeconds: 60,
        content: `
## 一、桂花茶简介
桂花茶是中国传统名茶，由茶叶与桂花窨制而成，兼具茶的韵味与桂花的芳香。

## 二、我们的产品系列
1. **金桂花茶**：采用200年树龄古茶树鲜叶与咸宁金桂窨制，花香浓郁持久
2. **银桂花茶**：选用120年树龄茶叶与银桂窨制，口感清雅柔和
3. **丹桂花茶**：特色产品，橙红丹桂与武夷岩茶的完美结合
4. **四季桂花茶**：日常饮品，四季桂与烘青绿茶的清新组合

## 三、产品核心卖点
- **双古树认证**：茶树龄+桂花树龄双追溯
- **非遗窨制工艺**：5次窨制，层层入味
- **全程溯源**：从茶园到茶杯，全程可追溯
- **品质保证**：每批次都有第三方检测报告
        `,
        media: [
          { type: 'image', url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=osmanthus%20tea%20product%20lineup%20four%20varieties%20display&image_size=landscape_16_9', title: '产品系列展示' }
        ]
      },
      {
        id: 'CH-PRODUCT-002',
        title: '品种分类与鉴别',
        duration: 900,
        minStudySeconds: 90,
        content: `
## 一、桂花品种分类
### 1. 金桂（Osmanthus fragrans var. thunbergii）
- 花色：金黄色
- 花期：9-10月
- 香气：浓郁持久
- 适用：高端产品窨制

### 2. 银桂（Osmanthus fragrans var. latifolius）
- 花色：乳白色
- 花期：9-10月
- 香气：清雅淡远
- 适用：中端产品窨制

### 3. 丹桂（Osmanthus fragrans var. aurantiacus）
- 花色：橙红色
- 花期：9-10月
- 香气：馥郁浓烈
- 适用：特色产品窨制

### 4. 四季桂（Osmanthus fragrans var. semperflorens）
- 花色：淡白色
- 花期：四季开花
- 香气：清淡悠长
- 适用：日常饮品

## 二、品质鉴别方法
### 1. 看外观
- 干茶：条索紧结，色泽乌润
- 桂花：花朵完整，色泽金黄/银白

### 2. 闻香气
- 窨制好的桂花茶：花香浓郁，无异味
- 劣质产品：香气短促，有青草气

### 3. 品滋味
- 优质茶：茶汤清澈，花香与茶香协调
- 劣质茶：茶汤浑浊，滋味苦涩
        `,
        media: [
          { type: 'image', url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=four%20types%20osmanthus%20flowers%20comparison%20gold%20silver%20orange%20white&image_size=landscape_16_9', title: '四大品种对比' }
        ]
      },
      {
        id: 'CH-PRODUCT-003',
        title: '核心工艺讲解',
        duration: 1200,
        minStudySeconds: 120,
        content: `
## 一、窨制工艺概述
窨制是桂花茶的核心工艺，通过让茶叶吸收桂花的香气，达到茶引花香、花益茶味的效果。

## 二、工艺流程
### 1. 备料
- 茶叶：选用武夷岩茶或烘青绿茶
- 桂花：选用当日清晨采摘的新鲜桂花

### 2. 拌花
按1:5的比例均匀拌合茶叶与桂花，确保每片茶叶都能接触到桂花。

### 3. 窨制
在恒温恒湿环境下（温度30℃，湿度72%）静置5小时，让茶叶充分吸收花香。

### 4. 通花
窨制过程中适时通风散热，保持茶叶活性。

### 5. 起花
用筛网分离茶叶与桂花残渣。

### 6. 干燥
低温烘干（80℃），锁住花香。

## 三、窨制次数与品质
- **1窨**：基础款，香气清新
- **3窨**：中端款，香气饱满
- **5窨**：高端款，香气层次丰富，入骨三分

我们的金桂花茶采用5次窨制，为行业最高标准。
        `,
        media: [
          { type: 'image', url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=traditional%20osmanthus%20tea%20scenting%20process%20workshop%20tea%20master%20working&image_size=landscape_16_9', title: '传统窨制工艺' }
        ]
      }
    ],
    hasQuiz: true,
    quiz: {
      title: '产品知识测验',
      passingScore: 60,
      questions: [
        {
          id: 'Q1',
          type: 'single',
          question: '金桂花茶采用的窨制次数是？',
          options: ['A. 1次', 'B. 3次', 'C. 5次', 'D. 7次'],
          correctAnswer: 'C',
          explanation: '金桂花茶采用5次窨制，为行业最高标准，确保香气层次丰富。'
        },
        {
          id: 'Q2',
          type: 'single',
          question: '以下哪个品种的桂花花色为橙红色？',
          options: ['A. 金桂', 'B. 银桂', 'C. 丹桂', 'D. 四季桂'],
          correctAnswer: 'C',
          explanation: '丹桂的花色为橙红色，香气馥郁浓烈，适用于特色产品窨制。'
        },
        {
          id: 'Q3',
          type: 'single',
          question: '窨制过程中的理想温度是？',
          options: ['A. 20℃', 'B. 25℃', 'C. 30℃', 'D. 35℃'],
          correctAnswer: 'C',
          explanation: '窨制的理想温度是30℃，湿度72%，在此环境下茶叶能最佳地吸收桂花香气。'
        },
        {
          id: 'Q4',
          type: 'single',
          question: '金桂花茶的核心卖点不包括以下哪项？',
          options: ['A. 双古树认证', 'B. 非遗窨制工艺', 'C. 全程溯源', 'D. 价格最低'],
          correctAnswer: 'D',
          explanation: '核心卖点包括双古树认证、非遗窨制工艺、全程溯源、品质保证，不包括价格最低。'
        },
        {
          id: 'Q5',
          type: 'single',
          question: '窨制工艺中茶叶与桂花的配比是？',
          options: ['A. 1:3', 'B. 1:5', 'C. 1:7', 'D. 1:10'],
          correctAnswer: 'B',
          explanation: '按1:5的比例均匀拌合茶叶与桂花，确保每片茶叶都能接触到桂花。'
        }
      ]
    }
  },
  {
    id: 'COURSE-TRACE-001',
    name: '溯源话术培训',
    category: 'trace',
    isRequired: true,
    description: '掌握溯源系统的使用方法，学习如何向客户讲解溯源价值，提升客户信任度。',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=traceability%20system%20training%20qrcode%20scanning%20smartphone&image_size=landscape_16_9',
    instructor: '李讲师',
    instructorTitle: '溯源技术专家',
    estimatedMinutes: 35,
    difficulty: 'beginner',
    publishTime: Date.now() - 86400000 * 25,
    chapters: [
      {
        id: 'CH-TRACE-001',
        title: '溯源系统介绍',
        duration: 600,
        minStudySeconds: 60,
        content: `
## 一、什么是溯源系统
溯源系统是通过物联网、区块链等技术，对产品从生产到消费的全过程进行追踪和记录的系统。

## 二、我们的溯源体系
### 1. 一物一码
每个产品罐底都有唯一的溯源二维码，消费者扫码即可查看完整溯源信息。

### 2. 全程上链
所有溯源数据都已上传至区块链，不可篡改，真实可信。

### 3. 多维数据
涵盖：产地信息、采摘时间、窨制过程、检测报告、流通轨迹等。

## 三、溯源价值
### 对消费者
- **透明可信**：知道产品从哪里来，经过哪些环节
- **品质保证**：每批次都有检测报告，品质有保障
- **防伪鉴别**：通过溯源信息鉴别产品真伪

### 对经销商
- **销售工具**：溯源是最好的销售话术
- **信任建立**：通过溯源数据快速建立客户信任
- **品牌价值**：传递品牌对品质的追求和责任
        `,
        media: [
          { type: 'image', url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=blockchain%20traceability%20system%20diagram%20supply%20chain%20infographic&image_size=landscape_16_9', title: '溯源系统架构' }
        ]
      },
      {
        id: 'CH-TRACE-002',
        title: '客户沟通话术',
        duration: 900,
        minStudySeconds: 90,
        content: `
## 一、开场话术
### 场景1：客户询问产品品质
"这款桂花茶最大的特点是全程可溯源。您扫码就能看到：茶叶来自200年古茶树，桂花采自咸宁百年桂花园，经过5次窨制，每一步都有记录。"

### 场景2：客户担心买到假货
"您完全不用担心，每个产品都有唯一的溯源二维码。扫码可以查看区块链存证信息，这些数据是不可篡改的，真正做到了来源可查、去向可追。"

## 二、核心卖点话术
### 1. 双古树认证
"我们的每罐茶都可以追溯到具体的茶树和桂花树。金桂花茶用的是武夷山200年古茶树的鲜叶，和咸宁50年金桂树的花朵，这在行业里是非常少见的。"

### 2. 非遗工艺
"窨制工艺是我们的核心竞争力。您看这里有每次窨制的记录，包括时间、温度、湿度、操作人员，五次窨制，层层入味。"

### 3. 品质检测
"每批次产品出厂前都会经过第三方检测，包括农残、重金属等多项指标。检测报告也在溯源信息里，您随时可以查看。"

## 三、应对异议的话术
### 客户说："溯源不就是个噱头吗？"
"您这个问题问得很好。确实很多商家都在说溯源，但我们的溯源是实实在在的：
1. 数据都在区块链上，不是我们想改就能改的
2. 每个环节都有图片、视频为证，不是干巴巴的文字
3. 您甚至可以通过溯源信息看到具体的采茶工人和窨制师傅

您可以现场扫码感受一下，看看我们的溯源和别家有什么不一样。"

## 四、促成话术
"您看，这么透明的溯源体系，买回去不管是自己喝还是送礼，都特别放心。而且现在大家都注重健康，能看到完整溯源的产品，送人也更有面子。"
        `,
        media: [
          { type: 'image', url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=customer%20communication%20sales%20training%20business%20meeting&image_size=landscape_16_9', title: '客户沟通场景' }
        ]
      }
    ],
    hasQuiz: true,
    quiz: {
      title: '溯源话术测验',
      passingScore: 60,
      questions: [
        {
          id: 'Q1',
          type: 'single',
          question: '溯源数据存储在哪里，保证不可篡改？',
          options: ['A. 本地数据库', 'B. 区块链', 'C. 云服务器', 'D. U盘'],
          correctAnswer: 'B',
          explanation: '所有溯源数据都已上传至区块链，不可篡改，真实可信。'
        },
        {
          id: 'Q2',
          type: 'single',
          question: '客户询问产品品质时，最佳开场话术是？',
          options: [
            'A. 我们的产品价格便宜',
            'B. 这款桂花茶最大的特点是全程可溯源...',
            'C. 买得多可以打折',
            'D. 您先尝尝再说'
          ],
          correctAnswer: 'B',
          explanation: '从溯源切入，能够快速建立客户信任，体现产品价值。'
        },
        {
          id: 'Q3',
          type: 'single',
          question: '应对客户说"溯源不就是噱头"时，应该？',
          options: [
            'A. 同意客户说法，转移话题',
            'B. 与客户争论',
            'C. 从数据真实性、多媒体证据等方面解释',
            'D. 感到生气'
          ],
          correctAnswer: 'C',
          explanation: '应该从区块链不可篡改、多媒体证据、可现场验证等方面，让客户直观感受到溯源的价值。'
        },
        {
          id: 'Q4',
          type: 'single',
          question: '溯源信息中不包括以下哪项？',
          options: ['A. 产地信息', 'B. 采摘时间', 'C. 客户购买记录', 'D. 检测报告'],
          correctAnswer: 'C',
          explanation: '溯源信息涵盖产地信息、采摘时间、窨制过程、检测报告、流通轨迹等，不包括客户购买记录。'
        },
        {
          id: 'Q5',
          type: 'single',
          question: '溯源二维码位于产品的哪个位置？',
          options: ['A. 罐底', 'B. 罐盖', 'C. 罐身', 'D. 包装盒'],
          correctAnswer: 'A',
          explanation: '每个产品罐底都有唯一的溯源二维码，消费者扫码即可查看完整溯源信息。'
        }
      ]
    }
  },
  {
    id: 'COURSE-DIVERGENCE-001',
    name: '窜货政策与合规',
    category: 'divergence',
    isRequired: true,
    description: '深入了解窜货的定义、危害、识别方法和应对措施，确保渠道合规经营。',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=channel%20compliance%20anti-divergence%20policy%20business%20regulation&image_size=landscape_16_9',
    instructor: '张讲师',
    instructorTitle: '渠道管理总监',
    estimatedMinutes: 40,
    difficulty: 'intermediate',
    publishTime: Date.now() - 86400000 * 20,
    chapters: [
      {
        id: 'CH-DIVERGENCE-001',
        title: '窜货的定义与危害',
        duration: 600,
        minStudySeconds: 60,
        content: `
## 一、什么是窜货
窜货是指经销商将产品销售到非授权区域的行为，也称为"倒货"或"冲货"。

## 二、窜货的类型
### 1. 良性窜货
- 经销商在自己的销售区域内销售给流动客户
- 产品最终流向相邻区域，但数量不大
- 一般不采取处罚措施

### 2. 恶性窜货
- 经销商为获取非正常利润，蓄意向非授权区域销售产品
- 通常以低于指导价的价格销售
- 严重破坏市场秩序，必须严厉打击

### 3. 自然性窜货
- 产品在流通中自然流向非授权区域
- 数量少，影响小
- 关注但不主动干预

## 三、窜货的危害
### 1. 对市场的危害
- **价格混乱**：窜货导致区域间价格不一致
- **渠道冲突**：经销商之间产生矛盾，影响渠道稳定
- **品牌损伤**：消费者对品牌产生不信任

### 2. 对经销商的危害
- **利润下降**：价格战导致整体利润降低
- **关系恶化**：与其他经销商、与厂家关系紧张
- **处罚风险**：面临厂家的处罚，甚至取消代理权

### 3. 对消费者的危害
- **服务缺失**：跨区域购买可能无法享受正常售后服务
- **真伪难辨**：窜货产品可能存在假冒伪劣

## 四、窜货的根本原因
1. 价格体系不合理
2. 销售目标过高
3. 渠道激励政策不当
4. 经销商恶意行为
5. 区域市场需求差异
        `,
        media: [
          { type: 'image', url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=market%20channel%20divergence%20diagram%20product%20flow%20illegal&image_size=landscape_16_9', title: '窜货路径示意' }
        ]
      },
      {
        id: 'CH-DIVERGENCE-002',
        title: '窜货的识别与预警',
        duration: 900,
        minStudySeconds: 90,
        content: `
## 一、窜货识别方法
### 1. 扫码地点预警
- 我们的溯源系统会记录每次扫码的地理位置
- 如果某批次产品在非授权区域扫码次数异常，系统会自动预警

### 2. 价格监测
- 关注各区域市场的终端售价
- 如果发现某区域售价明显低于指导价，可能存在窜货

### 3. 客户反馈
- 其他经销商的投诉
- 终端客户反映购买渠道异常

## 二、窜货预警等级
### 一级预警（轻微）
- 单批次产品在非授权区域扫码≤5次
- 可能是客户异地携带
- 处理：记录观察

### 二级预警（中等）
- 单批次产品在非授权区域扫码6-20次
- 可能存在小规模窜货
- 处理：警告涉事经销商，要求说明情况

### 三级预警（严重）
- 单批次产品在非授权区域扫码＞20次
- 或存在明显低于指导价销售的行为
- 处理：立案调查，按合同处罚

## 三、窜货调查流程
1. **预警触发**：系统自动预警或接收到投诉
2. **初步核实**：核查扫码数据、销售记录
3. **证据收集**：购买样品、固定价格证据、拍照录像
4. **事实确认**：与涉事经销商沟通，听取陈述
5. **处罚决定**：根据政策和合同作出处罚
6. **执行反馈**：执行处罚并公示结果

## 四、如何避免被认定为窜货
1. **严格按区域销售**：不主动向非授权区域客户销售
2. **了解下游去向**：关注批发客户的最终销售区域
3. **保留销售记录**：每笔销售都要有完整记录
4. **异常及时报备**：如果发现流动大客户，及时向厂家报备
5. **学习政策法规**：定期参加培训，了解最新政策
        `,
        media: [
          { type: 'image', url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=alert%20system%20monitoring%20dashboard%20data%20visualization&image_size=landscape_16_9', title: '窜货预警系统' }
        ]
      },
      {
        id: 'CH-DIVERGENCE-003',
        title: '合规经营要求',
        duration: 900,
        minStudySeconds: 90,
        content: `
## 一、经销合同核心条款
### 1. 授权区域
- 每个经销商都有明确的授权销售区域
- 不得跨区域销售，包括线上和线下

### 2. 价格维护
- 严格执行厂家指导价
- 不得低价倾销，不得变相降价（如搭赠、返点过多）

### 3. 产品来源
- 只能从厂家或上级授权经销商进货
- 不得从非正规渠道进货，不得销售假货

## 二、窜货处罚措施
### 一级窜货（轻微）
- 口头警告
- 扣减10%当月返利
- 责令整改

### 二级窜货（中等）
- 书面警告
- 扣减30%当月返利
- 暂停新产品配额1个月
- 全渠道通报批评

### 三级窜货（严重）
- 扣减全部当月返利
- 取消年度评优资格
- 暂停供货3个月
- 情节特别严重的，解除经销合同

### 屡教不改
- 累计3次窜货记录，直接解除经销合同
- 纳入品牌黑名单，永不合作

## 三、举报奖励政策
- **举报有奖**：如实举报窜货行为，经查实后奖励500-5000元
- **保密承诺**：对举报人的信息严格保密
- **实名举报**：鼓励实名举报，奖励翻倍

## 四、合规经营建议
1. **建立内部管理制度**：明确销售人员的销售范围
2. **加强客户管理**：了解每个客户的销售区域
3. **定期自查**：检查自己的销售数据，及时发现异常
4. **参加培训**：定期参加厂家组织的合规培训
5. **主动沟通**：有问题及时与厂家渠道经理沟通

合规经营是长久合作的基础，让我们共同维护良好的市场秩序！
        `,
        media: [
          { type: 'image', url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=business%20compliance%20handshake%20trust%20partnership&image_size=landscape_16_9', title: '合规经营，合作共赢' }
        ]
      }
    ],
    hasQuiz: true,
    quiz: {
      title: '窜货政策测验',
      passingScore: 60,
      questions: [
        {
          id: 'Q1',
          type: 'single',
          question: '单批次产品在非授权区域扫码多少次构成三级（严重）预警？',
          options: ['A. ≤5次', 'B. 6-20次', 'C. ＞20次', 'D. ＞50次'],
          correctAnswer: 'C',
          explanation: '单批次产品在非授权区域扫码＞20次构成三级预警，需立案调查。'
        },
        {
          id: 'Q2',
          type: 'single',
          question: '以下哪种不属于恶性窜货的特征？',
          options: [
            'A. 蓄意向非授权区域销售',
            'B. 以低于指导价销售',
            'C. 客户异地携带少量产品',
            'D. 破坏市场秩序'
          ],
          correctAnswer: 'C',
          explanation: '客户异地携带少量产品属于良性窜货或自然性窜货，不属于恶性窜货。'
        },
        {
          id: 'Q3',
          type: 'single',
          question: '三级窜货的处罚不包括以下哪项？',
          options: [
            'A. 扣减全部当月返利',
            'B. 取消年度评优资格',
            'C. 暂停供货3个月',
            'D. 口头警告'
          ],
          correctAnswer: 'D',
          explanation: '口头警告是一级窜货的处罚措施，三级窜货处罚更严厉。'
        },
        {
          id: 'Q4',
          type: 'single',
          question: '累计几次窜货记录会被直接解除经销合同？',
          options: ['A. 1次', 'B. 2次', 'C. 3次', 'D. 5次'],
          correctAnswer: 'C',
          explanation: '累计3次窜货记录，将被直接解除经销合同，并纳入品牌黑名单。'
        },
        {
          id: 'Q5',
          type: 'single',
          question: '以下哪种行为是正确的？',
          options: [
            'A. 为了完成任务，向邻区域低价销售',
            'B. 从其他经销商处进货，因为价格更低',
            'C. 发现流动大客户及时向厂家报备',
            'D. 给客户大量返点变相降价'
          ],
          correctAnswer: 'C',
          explanation: '发现流动大客户及时向厂家报备是正确的做法，可以避免被误判为窜货。'
        }
      ]
    }
  },
  {
    id: 'COURSE-BREW-001',
    name: '桂花茶冲泡演示',
    category: 'brew',
    isRequired: true,
    description: '学习专业的桂花茶冲泡技巧，掌握不同场景的冲泡方法，提升客户体验。',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=osmanthus%20tea%20brewing%20masterclass%20elegant%20tea%20ceremony&image_size=landscape_16_9',
    instructor: '陈讲师',
    instructorTitle: '国家级评茶师',
    estimatedMinutes: 50,
    difficulty: 'beginner',
    publishTime: Date.now() - 86400000 * 15,
    chapters: [
      {
        id: 'CH-BREW-001',
        title: '冲泡基础',
        duration: 600,
        minStudySeconds: 60,
        content: `
## 一、冲泡用水
### 1. 水质要求
- **山泉水**：最佳，含有丰富矿物质，能激发茶香
- **纯净水**：次之，干净无异味
- **矿泉水**：可接受，但注意矿物质含量不宜过高
- **自来水**：不推荐，含氯，会影响茶味

### 2. 水温控制
- **金桂花茶**：95-100℃，水温高才能激发浓郁的花香
- **银桂花茶**：90-95℃，水温稍低，避免苦涩
- **丹桂花茶**：95℃，水温要足，释放丹桂的馥郁
- **四季桂花茶**：85-90℃，水温不宜过高，保持清新

## 二、茶具选择
### 1. 推荐茶具
- **白瓷盖碗**：最佳，便于观察汤色，聚香好
- **玻璃茶具**：适合观赏茶汤和桂花形态
- **紫砂茶具**：保温好，适合醇厚型茶品

### 2. 避免使用
- **塑料杯**：容易有异味，影响口感
- **保温杯**：长时间高温焖泡，茶汤易苦涩

## 三、投茶量
- **标准量**：3g茶叶（约一茶匙）配150ml水
- **可根据口味调整**：
  - 喜欢淡茶：2g/150ml
  - 喜欢浓茶：4g/150ml

## 四、冲泡时间
- **第一泡**：15秒，快速出汤，唤醒茶香
- **第二泡**：20秒，最佳口感
- **第三泡**：30秒，香气依然
- **第四泡**：45秒，余韵悠长

优质桂花茶可连续冲泡5-7次，花香持久。
        `,
        media: [
          { type: 'image', url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=tea%20brewing%20essentials%20water%20temperature%20teaware&image_size=landscape_16_9', title: '冲泡要素' }
        ]
      },
      {
        id: 'CH-BREW-002',
        title: '标准冲泡流程',
        duration: 1200,
        minStudySeconds: 120,
        content: `
## 一、准备工作
1. 温杯：用热水将茶具温热
2. 备茶：取出3g桂花茶
3. 烧水：烧至合适温度

## 二、冲泡步骤
### 第1步：温杯洁具
将沸水倒入盖碗中，旋转后倒出。目的：
- 清洁茶具
- 提升茶具温度，利于茶香散发

### 第2步：投茶
将3g桂花茶投入盖碗中。

### 第3步：润茶（洗茶）
注入少量温水（约盖碗容量的1/3），快速摇晃后倒出。
- 目的：唤醒茶叶，洗去浮尘
- 注意：动作要快，不要让茶汤焖出

### 第4步：冲泡
高冲注水，让茶叶在水中翻滚。
- 高冲可以激发茶香
- 注水至盖碗八分满

### 第5步：出汤
15秒后，将茶汤倒入公道杯中。
- 出汤要快，沥干
- 盖碗盖子留缝，不要完全盖住，避免焖熟茶叶

### 第6步：分茶
将公道杯中的茶汤均匀分入品茗杯中。
- 七分满为宜，留有三分情意
- 可以先闻香，再品饮

### 第7步：续泡
继续注水，每泡延长5-10秒出汤。

## 三、品鉴要点
### 1. 观色
- 优质桂花茶汤色：清澈透亮，浅金黄
- 有桂花花瓣漂浮，赏心悦目

### 2. 闻香
- 先闻杯盖香：桂花香气扑鼻
- 再闻茶汤香：茶香与花香融合
- 冷香：茶汤冷却后仍有余香

### 3. 品味
- 小口啜饮，让茶汤在口腔中停留
- 感受：花香、茶香、回甘
- 金桂花茶：浓郁饱满
- 银桂花茶：清雅柔和

## 四、冲泡演示要点（面向客户）
1. **动作优雅**：每个动作都要从容不迫
2. **边泡边讲**：讲解每个步骤的要点和讲究
3. **互动提问**："您平时喜欢喝什么茶？"
4. **引导品鉴**："您先闻闻这个香气..."
5. **卖点植入**："我们的茶泡5次还有花香，这就是5次窨制的效果"
        `,
        media: [
          { type: 'image', url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=traditional%20chinese%20tea%20ceremony%20step%20by%20step%20brewing&image_size=landscape_16_9', title: '标准冲泡流程' }
        ]
      },
      {
        id: 'CH-BREW-003',
        title: '不同场景冲泡技巧',
        duration: 900,
        minStudySeconds: 90,
        content: `
## 一、门店待客冲泡
### 目标
快速泡出好茶，给客户良好的第一印象。

### 要点
1. **提前准备**：茶具预热，水烧开
2. **简化流程**：润茶后直接冲泡出汤
3. **时间控制**：每泡30秒内完成，不让客户久等
4. **重点展示**：汤色、香气、耐泡度

## 二、家庭冲泡（给客户的建议）
### 简单泡法（马克杯）
1. 3g茶叶放入马克杯
2. 倒入90℃热水
3. 浸泡3分钟即可饮用
4. 可连续冲泡3次

### 讲究泡法（工夫茶）
按标准流程冲泡，适合周末闲暇时光。

## 三、办公室冲泡
### 便捷泡法
1. 使用飘逸杯或带茶隔的杯子
2. 投茶3g，注水后浸泡2分钟
3. 按下出水键，茶汤与茶叶分离
4. 可以反复冲泡

## 四、冷泡法（夏季推荐）
### 步骤
1. 3g茶叶放入冷泡瓶
2. 加入500ml矿泉水
3. 放入冰箱冷藏4-6小时
4. 取出即可饮用，冰爽甘甜

### 优点
- 茶汤苦涩度低
- 口感清甜
- 适合夏季消暑

## 五、调味冲泡
### 桂花茶+蜂蜜
- 泡好茶后，加入适量蜂蜜
- 适合喜欢甜味的客户
- 注意：蜂蜜要在茶汤温度低于60℃时加入，避免破坏营养

### 桂花茶+枸杞
- 冲泡时加入5-8粒枸杞
- 养生效果更佳
- 适合中老年客户

### 桂花茶+红枣
- 冲泡时加入2-3片红枣
- 补血养颜
- 适合女性客户

## 六、常见问题处理
### 问题1：茶汤太苦涩
**原因**：水温太高、浸泡时间太长、投茶量太多
**解决**：降低水温、缩短浸泡时间、减少投茶量

### 问题2：香气不明显
**原因**：水温不够、茶叶品质不好
**解决**：提高水温、更换茶叶

### 问题3：不耐泡
**原因**：窨制次数不够、茶叶品质一般
**解决**：选择高品质的桂花茶（如我们的5窨金桂）

## 七、冲泡演示注意事项
1. **保持微笑**：让客户感受到你的专业和热情
2. **保持干净**：茶具、桌面要整洁
3. **语言通俗易懂**：不要用太专业的术语
4. **因人而异**：根据客户的接受程度调整讲解深度
5. **多鼓励尝试**："您也来试试，很简单的"
        `,
        media: [
          { type: 'image', url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=osmanthus%20tea%20different%20brewing%20methods%20cold%20brew%20hot%20brew&image_size=landscape_16_9', title: '多种冲泡方式' }
        ]
      }
    ],
    hasQuiz: true,
    quiz: {
      title: '冲泡技巧测验',
      passingScore: 60,
      questions: [
        {
          id: 'Q1',
          type: 'single',
          question: '金桂花茶的最佳冲泡水温是？',
          options: ['A. 80-85℃', 'B. 85-90℃', 'C. 90-95℃', 'D. 95-100℃'],
          correctAnswer: 'D',
          explanation: '金桂花茶需要95-100℃的水温，才能激发其浓郁的花香。'
        },
        {
          id: 'Q2',
          type: 'single',
          question: '标准冲泡的投茶量是？',
          options: ['A. 2g/150ml', 'B. 3g/150ml', 'C. 4g/150ml', 'D. 5g/150ml'],
          correctAnswer: 'B',
          explanation: '标准量是3g茶叶配150ml水，可根据个人口味调整。'
        },
        {
          id: 'Q3',
          type: 'single',
          question: '冷泡法需要冷藏多长时间？',
          options: ['A. 1-2小时', 'B. 2-3小时', 'C. 4-6小时', 'D. 8小时以上'],
          correctAnswer: 'C',
          explanation: '冷泡法需要冷藏4-6小时，让茶叶慢慢释放味道，口感冰爽甘甜。'
        },
        {
          id: 'Q4',
          type: 'single',
          question: '冲泡时第一泡的出汤时间是？',
          options: ['A. 5秒', 'B. 15秒', 'C. 30秒', 'D. 60秒'],
          correctAnswer: 'B',
          explanation: '第一泡15秒快速出汤，唤醒茶香，后续每泡延长5-10秒。'
        },
        {
          id: 'Q5',
          type: 'single',
          question: '加蜂蜜时茶汤温度应该低于多少度？',
          options: ['A. 40℃', 'B. 50℃', 'C. 60℃', 'D. 70℃'],
          correctAnswer: 'C',
          explanation: '蜂蜜要在茶汤温度低于60℃时加入，避免破坏其中的营养成分。'
        }
      ]
    }
  }
];

function getTrainingCourses() {
  return JSON.parse(JSON.stringify(TRAINING_COURSES));
}

function getTrainingCourse(courseId) {
  for (var i = 0; i < TRAINING_COURSES.length; i++) {
    if (TRAINING_COURSES[i].id === courseId) {
      return JSON.parse(JSON.stringify(TRAINING_COURSES[i]));
    }
  }
  return null;
}

// ==================== 出口合规溯源相关 ====================

function getExportInfo(traceId) {
  const data = getTraceData(traceId);
  if (data && data.exportInfo) {
    return data.exportInfo;
  }
  return null;
}

function hasExportInfo(traceId) {
  const data = getTraceData(traceId);
  return !!(data && data.exportInfo);
}

function getCustomsClearanceStatus(traceId) {
  const exportInfo = getExportInfo(traceId);
  if (!exportInfo || !exportInfo.customsClearance) {
    return null;
  }
  return {
    success: true,
    data: exportInfo.customsClearance,
    timestamp: Date.now(),
    source: 'mock'
  };
}

function getShippingTracking(traceId) {
  const exportInfo = getExportInfo(traceId);
  if (!exportInfo || !exportInfo.shipping) {
    return null;
  }
  return {
    success: true,
    data: exportInfo.shipping,
    timestamp: Date.now(),
    source: 'mock'
  };
}

function getMultilingualLabel(traceId, lang) {
  const exportInfo = getExportInfo(traceId);
  if (!exportInfo || !exportInfo.multilingualLabels) {
    return null;
  }
  const labels = exportInfo.multilingualLabels.labels;
  const targetLang = lang || 'zh-CN';
  if (labels[targetLang]) {
    return {
      lang: targetLang,
      data: labels[targetLang],
      availableLanguages: exportInfo.multilingualLabels.availableLanguages
    };
  }
  if (labels['en-US']) {
    return {
      lang: 'en-US',
      data: labels['en-US'],
      availableLanguages: exportInfo.multilingualLabels.availableLanguages
    };
  }
  return null;
}

function getAllMultilingualLabels(traceId) {
  const exportInfo = getExportInfo(traceId);
  if (!exportInfo || !exportInfo.multilingualLabels) {
    return null;
  }
  return exportInfo.multilingualLabels;
}

function getOverseasDistributor(traceId) {
  const exportInfo = getExportInfo(traceId);
  if (!exportInfo || !exportInfo.overseasDistributor) {
    return null;
  }
  return exportInfo.overseasDistributor;
}

function getExportBlockchainInfo(traceId) {
  const exportInfo = getExportInfo(traceId);
  if (!exportInfo || !exportInfo.exportBlockchain) {
    return null;
  }
  return exportInfo.exportBlockchain;
}

function getCertificateOfOrigin(traceId) {
  const exportInfo = getExportInfo(traceId);
  if (!exportInfo || !exportInfo.certificateOfOrigin) {
    return null;
  }
  return exportInfo.certificateOfOrigin;
}

function getInspectionQuarantine(traceId) {
  const exportInfo = getExportInfo(traceId);
  if (!exportInfo || !exportInfo.inspectionQuarantine) {
    return null;
  }
  return exportInfo.inspectionQuarantine;
}

function getPublicLotteryInfo(traceId) {
  var data = getTraceData(traceId);
  if (!data || !data.basicInfo) return null;

  var batchNo = data.basicInfo.batchNo;
  var lotteryData = require('./publicLottery.js');
  return lotteryData.getPublicLotteryByBatchNo(batchNo);
}

function getEnrichedHistoryReports(traceId) {
  var data = getTraceData(traceId);
  if (!data || !data.pesticideTest || !data.pesticideTest.historyReports) return [];

  var lotteryData = require('./publicLottery.js');
  return lotteryData.enrichHistoryReportsWithLottery(traceId);
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
  getSampleTrace,
  calculateTestPercent,
  getWorkshopEnvData,
  getScentingComparison,
  getCompareData,
  getGreenTraceExtended,
  getGreenPointsConfig,
  verifyCertificate,
  getOsmanthusVarietyConfig,
  getAllVarieties,
  getBrewingInteractiveConfig,
  calculateTeaDosage,
  verifyBlockchainEvidence,
  recordAntiCounterfeitingScan,
  getTsaCertificate,
  getInviteRewardConfig,
  getAvailableCoupons,
  getShareThemeConfig,
  getShopProduct,
  getShopProductList,
  getSkuBySpec,
  getSkuById,
  getMemberLevels,
  getMemberLevelByPoints,
  getActivePromotions,
  getBestPromotion,
  calculatePromotionDiscount,
  getMockOrders,
  getOrderById,
  getOrderByNo,
  getOrdersByStatus,
  calculateCartSummary,
  getKnowledgeCategories,
  getKnowledgeArticles,
  getKnowledgeArticle,
  getKnowledgeArticleByVariety,
  getRelatedKnowledgeArticles,
  incrementKnowledgeReadCount,
  incrementKnowledgeLikeCount,
  getSupplyChainTimeline,
  getAllSupplyChainTimeline,
  maskOperator,
  getPointsMallItems,
  getPointsMallItemById,
  getMarketingActivities,
  getMarketingActivityById,
  getCampaignNameById,
  getDefaultDealer,
  getDealer,
  getDealerNameById,
  getDealerList,
  getDealerByLevel,
  getChildDealers,
  getTraceInfoByCode,
  getChannelFlow,
  updateCodeFlow,
  getTraceCode,
  getProductReviews,
  getTasteTags,
  getRatingDimensions,
  getReportReasons,
  submitReview,
  submitReviewFromNote,
  likeReview,
  reportReview,
  addBrandReply,
  getReviewSortOptions,
  getRecallByBatch,
  getRecallByTraceId,
  isRecalledProduct,
  getAllRecalls,
  getGiftBoxInfo,
  getGiftBoxSubCodeInfo,
  isGiftBoxMainCode,
  isGiftBoxSubCode,
  isGiftBoxRelated,
  getAllGiftBoxes,
  getGiftBoxItems,
  getGiftBoxMainCodeBySubCode,
  isOuterCode,
  isInnerCode,
  isDualCode,
  getDualCodeInfo,
  getOuterCodeByInner,
  getInnerCodeByOuter,
  verifyDualCodeBinding,
  getOuterCodeSummary,
  parseDualCodeFromScanResult,
  getAvailableOuterCodes,
  getTraceVersionHistory,
  getTraceVersion,
  getVersionDiff,
  getAllVersions,
  getTeaMasterTeam,
  getTeaMasterTeamByTraceId,
  getAllTeaMasterTeams,
  getPeopleStory,
  getPeopleStoriesByTraceId,
  getPeopleSummaryByTraceId,
  getTraceIdByBatchNo,
  getTeaMasterByPersonId,
  getPeopleByTeamId,
  verifyDealerAccount,
  verifyDealerAuthCode,
  getDealerAccountList,
  getGovTraceByTraceId,
  getGovTraceByGovCode,
  updateGovTraceReport,
  getGovPlatformStatusUpdates,
  updateProductGovStatus,
  addRecallRecord,
  getAuthorizedNetworkStores,
  getStoreReviews,
  getTrainingCourses,
  getTrainingCourse,
  getExportInfo,
  hasExportInfo,
  getCustomsClearanceStatus,
  getShippingTracking,
  getMultilingualLabel,
  getAllMultilingualLabels,
  getOverseasDistributor,
  getExportBlockchainInfo,
  getCertificateOfOrigin,
  getInspectionQuarantine,
  getPublicLotteryInfo,
  getEnrichedHistoryReports
};
