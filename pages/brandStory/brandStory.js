Page({
  data: {
    brandName: '一茶一品',
    brandSlogan: '百年茶树，千年桂花，一杯好茶的溯源之旅',
    timelineEvents: [
      {
        year: '1800',
        title: '茶树种源',
        desc: '李氏先祖于武夷山九龙窠栽植百年茶树，开启桂花茶传承',
        icon: '🌱',
        type: 'origin'
      },
      {
        year: '1850',
        title: '贡茶之始',
        desc: '所产茶叶成为当地贡茶，"一茶一品"声誉渐起',
        icon: '🏆',
        type: 'honor'
      },
      {
        year: '1938',
        title: '战火存续',
        desc: '抗战期间茶园遭破坏，古茶树幸免于难，薪火相传',
        icon: '🔥',
        type: 'survive'
      },
      {
        year: '1982',
        title: '古树保护',
        desc: '古茶树被列为武夷山一级保护古茶树，编号WH-001',
        icon: '🌳',
        type: 'protect'
      },
      {
        year: '2006',
        title: '非遗传承',
        desc: '武夷岩茶制作技艺列入首批国家级非遗名录',
        icon: '📜',
        type: 'heritage'
      },
      {
        year: '2019',
        title: '数字溯源',
        desc: '完成古树基因测序，建立专属数字档案，区块链存证',
        icon: '🔗',
        type: 'digital'
      },
      {
        year: '2025',
        title: '品牌升级',
        desc: '全面启用溯源系统，一茶一品桂花茶全新上市',
        icon: '🚀',
        type: 'launch'
      }
    ],
    brandValues: [
      { icon: '🌿', title: '自然为本', desc: '坚持有机种植，拒绝化肥农药，让每一片茶叶回归自然' },
      { icon: '🤝', title: '诚信溯源', desc: '区块链存证，数据真实可查，每一步都有迹可循' },
      { icon: '🎨', title: '匠心传承', desc: '600年窨制技艺，非遗传承人亲手窨制，品质如一' },
      { icon: '🌍', title: '绿色未来', desc: '环保包装、碳中和物流，为地球贡献一份绿意' }
    ],
    heroImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=ancient%20chinese%20tea%20mountain%20misty%20golden%20osmanthus%20flowers%20falling%20traditional%20tea%20culture%20cinematic&image_size=landscape_16_9',
    craftImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=traditional%20chinese%20tea%20master%20scenting%20osmanthus%20tea%20artisan%20workshop%20heritage&image_size=landscape_16_9',
    gardenImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=aerial%20view%20wuyi%20mountain%20tea%20terraces%20golden%20osmanthus%20garden%20autumn%20china&image_size=landscape_16_9'
  },

  onLoad: function() {},

  onShareAppMessage: function() {
    return {
      title: '一茶一品・品牌故事',
      path: '/pages/brandStory/brandStory',
      imageUrl: ''
    };
  },

  goBack: function() {
    wx.navigateBack({
      fail: function() {
        wx.switchTab({
          url: '/pages/index/index'
        });
      }
    });
  },

  goToTrace: function() {
    wx.navigateTo({
      url: '/pages/detail/detail?traceId=G001'
    });
  }
});
