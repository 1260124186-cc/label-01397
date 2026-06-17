var greenPoints = require('../../utils/greenPoints.js');
var mockData = require('../../utils/mockData.js');

Page({
  data: {
    totalPoints: 0,
    memberLevel: null,
    allLevels: [],
    rules: [
      { icon: '📱', title: '扫码溯源', points: '+10', desc: '每次扫码获得积分，每日上限10次' },
      { icon: '📤', title: '分享产品', points: '+5', desc: '分享产品给好友，每日上限5次' },
      { icon: '✅', title: '每日签到', points: '+3', desc: '连续签到额外奖励，连续7天额外+10' },
      { icon: '📝', title: '品鉴笔记', points: '+20', desc: '完成品鉴笔记，每日上限2次' },
      { icon: '🎁', title: '邀请好友', points: '+50', desc: '邀请好友首次扫码，双方都得积分' }
    ]
  },

  onLoad: function() {
    this.loadData();
  },

  onShow: function() {
    this.loadData();
  },

  loadData: function() {
    var pointsData = greenPoints.getGreenPointsData();
    var memberLevel = greenPoints.getUserLevel(pointsData.totalPoints);
    var allLevels = mockData.getMemberLevels();

    this.setData({
      totalPoints: pointsData.totalPoints,
      memberLevel: memberLevel,
      allLevels: allLevels
    });
  },

  goToEarnPoints: function() {
    wx.navigateBack();
  }
});
