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
    { action: 'shareGreen', points: 15, desc: '分享绿色溯源', dailyLimit: 45 }
  ],
  levelConfig: [
    { level: 1, name: '环保新手', minPoints: 0, icon: '🌱' },
    { level: 2, name: '环保达人', minPoints: 100, icon: '🌿' },
    { level: 3, name: '环保先锋', minPoints: 500, icon: '🌳' },
    { level: 4, name: '环保大使', minPoints: 1000, icon: '🌍' }
  ]
};

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

function getInviteRewardConfig() {
  return {
    inviterPoints: 100,
    inviteePoints: 50,
    inviterCoupon: {
      name: '邀请好友专属券',
      type: 'cash',
      value: 20,
      minAmount: 100,
      desc: '满100元可用，全场通用',
      expireDays: 30
    },
    inviteeCoupon: {
      name: '新用户专属券',
      type: 'cash',
      value: 15,
      minAmount: 80,
      desc: '满80元可用，新用户专享',
      expireDays: 15
    },
    maxDailyInvites: 10,
    activityTip: '每邀请1位好友扫码溯源，双方各得好礼！',
    rules: [
      '分享带有专属邀请码的溯源卡片给好友',
      '好友通过扫码进入并完成首次溯源查看',
      '系统自动发放积分和优惠券奖励',
      '每日邀请奖励上限10次，超出不再发放'
    ]
  };
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

// ==================== 会员等级 ====================

var memberLevels = [
  { level: 1, name: '普通会员', minPoints: 0, discount: 1.0, icon: '🌱', benefits: ['基础价格购买', '积分累计'] },
  { level: 2, name: '银卡会员', minPoints: 500, discount: 0.95, icon: '🥈', benefits: ['9.5折会员价', '专属优惠券', '积分1.2倍'] },
  { level: 3, name: '金卡会员', minPoints: 2000, discount: 0.88, icon: '🥇', benefits: ['8.8折会员价', '专属优惠券', '积分1.5倍', '生日双倍积分', '优先发货'] },
  { level: 4, name: '钻石会员', minPoints: 5000, discount: 0.8, icon: '💎', benefits: ['8折会员价', '专属大礼包', '积分2倍', '生日3倍积分', '专属客服', '免费试用'] }
];

function getMemberLevels() {
  return memberLevels;
}

function getMemberLevelByPoints(points) {
  var level = memberLevels[0];
  for (var i = 0; i < memberLevels.length; i++) {
    if (points >= memberLevels[i].minPoints) {
      level = memberLevels[i];
    }
  }
  return level;
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
  calculateCartSummary
};
