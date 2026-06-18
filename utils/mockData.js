/**
 * 桂花茶溯源小程序 - 本地模拟数据
 * 功能：提供测试用的溯源数据（G001、G002）
 * 说明：实际项目中应通过 wx.request 从后端获取数据
 */

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
      thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=premium%20red%20orange%20dan%20gui%20osmanthus%20tea%20luxury%20gift%20box&image_size=square'
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
    { action: 'viewRecycling', points: 5, desc: '查看回收指引', dailyLimit: 25 },
    { action: 'viewCertificate', points: 3, desc: '查看认证证书', dailyLimit: 15 },
    { action: 'shareGreen', points: 15, desc: '分享绿色溯源', dailyLimit: 45 },
    { action: 'scan', points: 10, desc: '扫码溯源', dailyLimit: 100 },
    { action: 'share', points: 5, desc: '分享产品', dailyLimit: 25 },
    { action: 'dailySignIn', points: 3, desc: '每日签到', dailyLimit: 30 },
    { action: 'tastingNote', points: 20, desc: '完成品鉴笔记', dailyLimit: 40 },
    { action: 'invite', points: 50, desc: '邀请好友奖励', dailyLimit: 5000 },
    { action: 'invited', points: 30, desc: '好友邀请奖励', dailyLimit: 30 },
    { action: 'invite_friend', points: 50, desc: '邀请好友扫码奖励', dailyLimit: 5000 }
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
  getWorkshopEnvData,
  getScentingComparison,
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
  getDefaultDealer,
  getDealer,
  getDealerList,
  getDealerByLevel,
  getChildDealers,
  getTraceInfoByCode,
  getChannelFlow,
  updateCodeFlow,
  getTraceCode
};
