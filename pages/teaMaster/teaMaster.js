/**
 * 桂花茶溯源小程序 - 制茶师/窨制班组档案页
 * 功能：展示制茶师介绍、代表批次、工艺理念、照片
 * 页面路径：pages/teaMaster/teaMaster
 */

const mockData = require('../../utils/mockData.js');
const i18n = require('../../utils/i18n/index.js');

Page({
  data: {
    teamId: '',
    traceId: '',
    teamData: null,
    relatedPeople: null,
    loading: true,
    currentPhotoIndex: 0,
    activeTab: 'intro',
    currentLang: 'zh-CN'
  },

  onLoad: function(options) {
    console.log('[TeaMaster] 页面加载，参数：', options);

    this.setData({ currentLang: i18n.getLanguage() });

    const teamId = options.teamId;
    const traceId = options.traceId;

    if (teamId) {
      this.setData({ teamId: teamId });
      this.loadTeamData(teamId);
    } else if (traceId) {
      this.setData({ traceId: traceId });
      this.loadTeamDataByTraceId(traceId);
    } else {
      wx.showToast({
        title: '参数错误',
        icon: 'none'
      });
      setTimeout(function() {
        wx.navigateBack();
      }, 1500);
    }
  },

  loadTeamData: function(teamId) {
    const that = this;
    wx.showLoading({ title: '加载中...', mask: true });

    setTimeout(function() {
      const team = mockData.getTeaMasterTeam(teamId);
      const relatedPeople = mockData.getPeopleByTeamId(teamId);
      if (team) {
        wx.setNavigationBarTitle({ title: team.teamName });
        that.setData({
          teamData: team,
          teamId: teamId,
          relatedPeople: relatedPeople,
          traceId: relatedPeople ? relatedPeople.traceId : '',
          loading: false
        });
      } else {
        wx.showToast({ title: '未找到制茶师信息', icon: 'none' });
        setTimeout(function() { wx.navigateBack(); }, 1500);
      }
      wx.hideLoading();
    }, 500);
  },

  loadTeamDataByTraceId: function(traceId) {
    const that = this;
    wx.showLoading({ title: '加载中...', mask: true });

    setTimeout(function() {
      const team = mockData.getTeaMasterTeamByTraceId(traceId);
      if (team) {
        const relatedPeople = mockData.getPeopleByTeamId(team.teamId);
        wx.setNavigationBarTitle({ title: team.teamName });
        that.setData({
          teamData: team,
          teamId: team.teamId,
          relatedPeople: relatedPeople,
          loading: false
        });
      } else {
        wx.showToast({ title: '未找到制茶师信息', icon: 'none' });
        setTimeout(function() { wx.navigateBack(); }, 1500);
      }
      wx.hideLoading();
    }, 500);
  },

  switchTab: function(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
  },

  onPhotoChange: function(e) {
    this.setData({ currentPhotoIndex: e.detail.current });
  },

  previewAvatar: function() {
    if (!this.data.teamData || !this.data.teamData.photo) return;
    wx.previewImage({
      current: this.data.teamData.photo,
      urls: [this.data.teamData.photo]
    });
  },

  previewTeamPhoto: function(e) {
    const url = e.currentTarget.dataset.url;
    if (!this.data.teamData || !this.data.teamData.teamPhotos) return;
    wx.previewImage({
      current: url,
      urls: this.data.teamData.teamPhotos
    });
  },

  viewBatchDetail: function(e) {
    const batchNo = e.currentTarget.dataset.batchno;
    if (!batchNo) return;
    wx.navigateTo({
      url: '/pages/batchList/batchList?batchNo=' + batchNo
    });
  },

  viewAwardDetail: function(e) {
    const award = e.currentTarget.dataset.award;
    if (!award) return;
    wx.showModal({
      title: award.title,
      content: '获奖时间：' + award.year + '年\n获奖等级：' + award.level,
      showCancel: false,
      confirmText: '知道了'
    });
  },

  viewCertificationDetail: function(e) {
    const cert = e.currentTarget.dataset.cert;
    if (!cert) return;
    wx.showModal({
      title: '资质证书',
      content: cert,
      showCancel: false,
      confirmText: '知道了'
    });
  },

  goToPeopleStory: function() {
    var traceId = null;
    if (this.data.relatedPeople && this.data.relatedPeople.traceId) {
      traceId = this.data.relatedPeople.traceId;
    } else if (this.data.traceId) {
      traceId = this.data.traceId;
    }

    if (traceId) {
      wx.navigateTo({
        url: '/pages/peopleStory/peopleStory?traceId=' + traceId
      });
    } else {
      wx.showToast({ title: '暂无守护者信息', icon: 'none' });
    }
  },

  goToPersonDetail: function(e) {
    var personId = e.currentTarget.dataset.personid;
    if (!personId) return;
    wx.navigateTo({
      url: '/pages/peopleStory/peopleStory?personId=' + personId
    });
  },

  onShareAppMessage: function() {
    const team = this.data.teamData;
    if (!team) return {};
    return {
      title: team.teamName + ' - ' + team.leaderQualification,
      path: '/pages/teaMaster/teaMaster?teamId=' + this.data.teamId,
      imageUrl: team.photo || ''
    };
  }
});
