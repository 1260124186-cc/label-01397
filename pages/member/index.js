var greenPoints = require('../../utils/greenPoints.js');
var mockData = require('../../utils/mockData.js');

Page({
  data: {
    userInfo: null,
    isLoggedIn: false,
    totalPoints: 0,
    memberLevel: null,
    isSignedIn: false,
    signInStreak: 0,
    pointsStats: null,
    inviteCount: 0,
    mallItems: [],
    activities: [],
    quickActions: [
      { key: 'scan', icon: '📱', name: '扫码溯源', points: '+10', desc: '每次扫码获得积分' },
      { key: 'share', icon: '📤', name: '分享产品', points: '+5', desc: '分享产品获得积分' },
      { key: 'tastingNote', icon: '📝', name: '品鉴笔记', points: '+20', desc: '完成笔记获得积分' },
      { key: 'dailySignIn', icon: '✅', name: '每日签到', points: '+3', desc: '每日签到获得积分' }
    ],
    mallCategories: [
      { key: 'all', name: '全部' },
      { key: 'tea', name: '试饮装' },
      { key: 'teaware', name: '茶具' },
      { key: 'coupon', name: '优惠券' }
    ],
    activeMallCategory: 'all',
    inviteConfig: null
  },

  onLoad: function() {
    this.loadData();
  },

  onShow: function() {
    this.loadData();
  },

  onPullDownRefresh: function() {
    this.loadData();
    wx.stopPullDownRefresh();
  },

  loadData: function() {
    var pointsData = greenPoints.getGreenPointsData();
    var memberLevel = greenPoints.getUserLevel(pointsData.totalPoints);
    var isSignedIn = greenPoints.isTodaySignedIn();
    var signInStreak = greenPoints.getSignInStreak();
    var pointsStats = greenPoints.getPointsStatistics();
    var inviteCount = greenPoints.getInviteCount();
    var mallItems = mockData.getPointsMallItems('all');
    var activities = mockData.getMarketingActivities('all');
    var inviteConfig = mockData.getInviteRewardConfig();

    this.setData({
      totalPoints: pointsData.totalPoints,
      memberLevel: memberLevel,
      isSignedIn: isSignedIn,
      signInStreak: signInStreak,
      pointsStats: pointsStats,
      inviteCount: inviteCount,
      mallItems: mallItems,
      activities: activities,
      inviteConfig: inviteConfig
    });
  },

  handleSignIn: function() {
    var result = greenPoints.dailySignIn();
    if (result.success) {
      wx.showToast({
        title: '签到成功 +' + result.points + '积分',
        icon: 'success',
        duration: 2000
      });
      this.loadData();
    } else {
      wx.showToast({
        title: result.reason,
        icon: 'none',
        duration: 2000
      });
    }
  },

  handleQuickAction: function(e) {
    var action = e.currentTarget.dataset.action;
    if (action === 'dailySignIn') {
      this.handleSignIn();
    } else if (action === 'scan') {
      wx.switchTab({ url: '/pages/index/index' });
    } else if (action === 'tastingNote') {
      wx.navigateTo({ url: '/pages/tastingNotes/tastingNotes' });
    } else if (action === 'share') {
      wx.showToast({
        title: '请在产品详情页分享',
        icon: 'none',
        duration: 2000
      });
    }
  },

  handleMallCategoryChange: function(e) {
    var category = e.currentTarget.dataset.category;
    var mallItems = mockData.getPointsMallItems(category);
    this.setData({
      activeMallCategory: category,
      mallItems: mallItems
    });
  },

  handleRedeemItem: function(e) {
    var itemId = e.currentTarget.dataset.itemId;
    var that = this;
    wx.showModal({
      title: '确认兑换',
      content: '确定使用积分兑换该商品吗？',
      confirmColor: '#2E8B57',
      success: function(res) {
        if (res.confirm) {
          var result = greenPoints.redeemPoints(itemId);
          if (result.success) {
            wx.showToast({
              title: '兑换成功',
              icon: 'success',
              duration: 2000
            });
            that.loadData();
          } else {
            wx.showToast({
              title: result.reason,
              icon: 'none',
              duration: 2000
            });
          }
        }
      }
    });
  },

  handleRegisterActivity: function(e) {
    var activityId = e.currentTarget.dataset.activityId;
    var that = this;
    wx.showModal({
      title: '确认报名',
      content: '确定要报名参加该活动吗？',
      confirmColor: '#2E8B57',
      success: function(res) {
        if (res.confirm) {
          var result = greenPoints.registerActivity(activityId);
          if (result.success) {
            wx.showToast({
              title: '报名成功',
              icon: 'success',
              duration: 2000
            });
            that.loadData();
          } else {
            wx.showToast({
              title: result.reason,
              icon: 'none',
              duration: 2000
            });
          }
        }
      }
    });
  },

  handleInviteFriend: function() {
    wx.showToast({
      title: '请点击右上角分享',
      icon: 'none',
      duration: 2000
    });
  },

  goToPointsDetail: function() {
    wx.navigateTo({ url: '/pages/member/pointsDetail' });
  },

  goToLevel: function() {
    wx.navigateTo({ url: '/pages/member/level' });
  },

  onShareAppMessage: function() {
    return {
      title: '一茶一品・桂花茶溯源 - 邀请好友得积分',
      path: '/pages/index/index?invite=' + (this.data.userInfo ? this.data.userInfo.openid : 'guest')
    };
  }
});
