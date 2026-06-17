var greenPoints = require('../../utils/greenPoints.js');

Page({
  data: {
    totalPoints: 0,
    pointsStats: null,
    historyTabs: [
      { key: 'all', name: '全部' },
      { key: 'earn', name: '获得' },
      { key: 'spend', name: '消耗' }
    ],
    activeTab: 'all',
    pointsHistory: [],
    formattedHistory: [],
    redemptionRecords: [],
    activityRegistrations: []
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
    var pointsStats = greenPoints.getPointsStatistics();
    var history = greenPoints.getPointsHistory(0, this.data.activeTab);
    var redemptionRecords = greenPoints.getRedemptionRecords();
    var activityRegistrations = greenPoints.getActivityRegistrations();

    var formattedHistory = this._formatHistory(history);

    this.setData({
      totalPoints: pointsData.totalPoints,
      pointsStats: pointsStats,
      pointsHistory: history,
      formattedHistory: formattedHistory,
      redemptionRecords: redemptionRecords,
      activityRegistrations: activityRegistrations
    });
  },

  _formatHistory: function(history) {
    var grouped = {};
    for (var i = 0; i < history.length; i++) {
      var item = history[i];
      var date = new Date(item.timestamp);
      var dateKey = this._formatDate(date);
      if (!grouped[dateKey]) {
        grouped[dateKey] = {
          date: dateKey,
          dayEarned: 0,
          daySpent: 0,
          items: []
        };
      }
      if (item.points > 0) {
        grouped[dateKey].dayEarned += item.points;
      } else {
        grouped[dateKey].daySpent += Math.abs(item.points);
      }
      grouped[dateKey].items.push({
        id: item.id,
        desc: item.desc,
        points: item.points,
        type: item.type,
        action: item.action,
        time: this._formatTime(date)
      });
    }

    var result = [];
    for (var key in grouped) {
      result.push(grouped[key]);
    }
    return result;
  },

  _formatDate: function(date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var today = new Date();
    if (year === today.getFullYear() && month === today.getMonth() + 1 && day === today.getDate()) {
      return '今天';
    }
    var yesterday = new Date(today.getTime() - 86400000);
    if (year === yesterday.getFullYear() && month === yesterday.getMonth() + 1 && day === yesterday.getDate()) {
      return '昨天';
    }
    return year + '年' + month + '月' + day + '日';
  },

  _formatTime: function(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    return (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes);
  },

  handleTabChange: function(e) {
    var tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
    this.loadData();
  }
});
