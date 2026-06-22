/**
 * 桂花茶溯源小程序 - 茶食搭配与场景化推荐首页
 * 功能：品种搭配推荐、节日礼盒、个性化推荐、UGC社区、一键加购
 * 页面路径：pages/teaPairing/list
 */

var teaPairing = require('../../utils/teaPairing.js');
var mockData = require('../../utils/mockData.js');
var shop = require('../../utils/shop.js');

Page({
  data: {
    varietyPairings: [],
    festivalInfo: null,
    hotUgcPosts: [],
    personalizedRec: null,
    hasPreference: false,
    currentTab: 'variety',
    tabList: [
      { key: 'variety', name: '品种搭配' },
      { key: 'festival', name: '节日礼盒' },
      { key: 'personalized', name: '为你推荐' },
      { key: 'ugc', name: '搭配社区' }
    ],
    pageLoaded: false
  },

  onLoad: function(options) {
    console.log('茶食搭配首页加载，参数：', options);

    this.loadAllData();

    setTimeout(function() {
      this.setData({ pageLoaded: true });
    }.bind(this), 100);
  },

  onShow: function() {
    this.loadAllData();
  },

  loadAllData: function() {
    this.loadVarietyPairings();
    this.loadFestivalInfo();
    this.loadHotUgcPosts();
    this.checkPreferenceAndLoadRec();
  },

  loadVarietyPairings: function() {
    var pairings = teaPairing.getAllVarietyPairings();
    var formattedPairings = pairings.map(function(p) {
      var foodPreview = [];
      if (p.recommendedFoodList && p.recommendedFoodList.length > 0) {
        foodPreview = p.recommendedFoodList.slice(0, 3).map(function(food) {
          return food.thumbnail;
        });
      }
      return {
        varietyKey: p.varietyKey,
        varietyName: p.varietyName,
        themeColor: p.themeColor,
        themeBg: p.themeBg,
        icon: p.icon,
        tagline: p.tagline,
        pairingIntro: p.pairingIntro,
        foodPreview: foodPreview
      };
    });
    this.setData({ varietyPairings: formattedPairings });
  },

  loadFestivalInfo: function() {
    var festivalData = teaPairing.getCurrentFestivalRecommendations();
    var festivalInfo = festivalData.current;
    if (festivalInfo && festivalInfo.boxes) {
      var boxes = festivalInfo.boxes.map(function(box) {
        var discount = 0;
        if (box.originalPrice && box.originalPrice > 0) {
          discount = Math.round((1 - box.price / box.originalPrice) * 100);
        }
        var includesNames = [];
        if (box.includes && box.includes.length > 0) {
          includesNames = box.includes.slice(0, 4).map(function(item) {
            return item.name;
          });
        }
        return {
          boxId: box.boxId,
          name: box.name,
          subtitle: box.subtitle,
          price: box.price,
          memberPrice: box.memberPrice,
          originalPrice: box.originalPrice,
          discount: discount,
          stock: box.stock,
          soldCount: box.soldCount,
          thumbnail: box.thumbnail,
          rating: box.rating,
          tags: box.tags || [],
          includesNames: includesNames,
          includesCount: (box.includes || []).length
        };
      });
      festivalInfo.formattedBoxes = boxes;
    }
    this.setData({ festivalInfo: festivalInfo });
  },

  loadHotUgcPosts: function() {
    var posts = teaPairing.getHotUgcPosts(6);
    this.setData({ hotUgcPosts: posts });
  },

  checkPreferenceAndLoadRec: function() {
    var hasPref = teaPairing.hasUserPreference();
    var rec = null;
    if (hasPref) {
      rec = teaPairing.getRecommendations();
      if (rec && rec.pairings) {
        rec.pairings = rec.pairings.map(function(p) {
          var foodPreview = [];
          if (p.recommendedFoodList && p.recommendedFoodList.length > 0) {
            foodPreview = p.recommendedFoodList.slice(0, 3).map(function(food) {
              return food.thumbnail;
            });
          }
          return {
            varietyKey: p.varietyKey,
            varietyName: p.varietyName,
            themeColor: p.themeColor,
            themeBg: p.themeBg,
            icon: p.icon,
            tagline: p.tagline,
            foodPreview: foodPreview
          };
        });
      }
    }
    this.setData({
      hasPreference: hasPref,
      personalizedRec: rec
    });
  },

  switchTab: function(e) {
    var tab = e.currentTarget.dataset.tab;
    this.setData({ currentTab: tab });
  },

  goToVarietyDetail: function(e) {
    var varietyKey = e.currentTarget.dataset.variety;
    if (!varietyKey) return;
    wx.navigateTo({
      url: '/pages/teaPairing/detail?varietyKey=' + varietyKey,
      success: function() {
        console.log('跳转品种搭配详情页成功');
      },
      fail: function(err) {
        console.error('跳转失败：', err);
        wx.showToast({
          title: '页面跳转失败',
          icon: 'none'
        });
      }
    });
  },

  goToGiftBoxDetail: function(e) {
    var boxId = e.currentTarget.dataset.boxid;
    if (!boxId) return;
    wx.navigateTo({
      url: '/pages/teaPairing/detail?boxId=' + boxId,
      success: function() {
        console.log('跳转礼盒详情页成功');
      },
      fail: function(err) {
        console.error('跳转失败：', err);
        wx.showToast({
          title: '页面跳转失败',
          icon: 'none'
        });
      }
    });
  },

  goToPreference: function() {
    wx.navigateTo({
      url: '/pages/preference/preference',
      success: function() {
        console.log('跳转偏好问卷页成功');
      },
      fail: function(err) {
        console.error('跳转失败：', err);
        wx.showToast({
          title: '页面跳转失败',
          icon: 'none'
        });
      }
    });
  },

  goToUgcList: function() {
    wx.navigateTo({
      url: '/pages/ugc/list',
      success: function() {
        console.log('跳转UGC列表页成功');
      },
      fail: function(err) {
        console.error('跳转失败：', err);
        wx.showToast({
          title: '页面跳转失败',
          icon: 'none'
        });
      }
    });
  },

  handleAddToCart: function(e) {
    var that = this;
    var varietyKey = e.currentTarget.dataset.variety;
    if (!varietyKey) return;

    wx.showLoading({
      title: '正在加入购物车...',
      mask: true
    });

    setTimeout(function() {
      var result = teaPairing.addVarietyPairingToCart(varietyKey);
      wx.hideLoading();

      if (result && result.success) {
        wx.showToast({
          title: '已加入购物车',
          icon: 'success',
          duration: 1500
        });
      } else {
        wx.showToast({
          title: (result && result.msg) || '加入购物车失败',
          icon: 'none',
          duration: 2000
        });
      }
    }, 500);
  },

  onShareAppMessage: function() {
    return {
      title: '一茶一品・茶食搭配推荐',
      path: '/pages/teaPairing/list',
      imageUrl: ''
    };
  }
});
