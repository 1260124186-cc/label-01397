/**
 * 桂花茶溯源小程序 - 茶农/合作社/采摘队 人物故事页
 * 功能：展示茶农、合作社、桂花采摘队的人物故事
 * 页面路径：pages/peopleStory/peopleStory
 */

const mockData = require('../../utils/mockData.js');
const i18n = require('../../utils/i18n/index.js');

const TYPE_ICON_MAP = {
  farmer: '👨‍🌾',
  cooperative: '🏘️',
  pickingTeam: '👒'
};

const TYPE_COLOR_MAP = {
  farmer: '#8B4513',
  cooperative: '#2E8B57',
  pickingTeam: '#DAA520'
};

Page({
  data: {
    mode: 'list',
    personId: '',
    traceId: '',
    personData: null,
    peopleList: [],
    relatedTeaMaster: null,
    loading: true,
    currentPhotoIndex: 0,
    activeTab: 'story',
    currentLang: 'zh-CN',
    typeIconMap: TYPE_ICON_MAP,
    typeColorMap: TYPE_COLOR_MAP
  },

  onLoad: function(options) {
    console.log('[PeopleStory] 页面加载，参数：', options);

    this.setData({ currentLang: i18n.getLanguage() });

    const personId = options.personId;
    const traceId = options.traceId;

    if (personId) {
      this.setData({ mode: 'detail', personId: personId });
      this.loadPersonDetail(personId);
    } else if (traceId) {
      this.setData({ mode: 'list', traceId: traceId });
      this.loadPeopleList(traceId);
      wx.setNavigationBarTitle({ title: '这杯茶的守护者' });
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

  loadPersonDetail: function(personId) {
    const that = this;
    wx.showLoading({ title: '加载中...', mask: true });

    setTimeout(function() {
      const person = mockData.getPeopleStory(personId);
      const relatedTeaMaster = mockData.getTeaMasterByPersonId(personId);
      if (person) {
        wx.setNavigationBarTitle({ title: person.name });
        that.setData({
          personData: person,
          relatedTeaMaster: relatedTeaMaster,
          loading: false
        });
      } else {
        wx.showToast({ title: '未找到人物信息', icon: 'none' });
        setTimeout(function() { wx.navigateBack(); }, 1500);
      }
      wx.hideLoading();
    }, 500);
  },

  loadPeopleList: function(traceId) {
    const that = this;
    wx.showLoading({ title: '加载中...', mask: true });

    setTimeout(function() {
      const people = mockData.getPeopleStoriesByTraceId(traceId);
      if (people && people.length > 0) {
        that.setData({
          peopleList: people,
          loading: false
        });
      } else {
        wx.showToast({ title: '暂无人物故事', icon: 'none' });
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
    if (!this.data.personData || !this.data.personData.avatar) return;
    wx.previewImage({
      current: this.data.personData.avatar,
      urls: [this.data.personData.avatar]
    });
  },

  previewPhoto: function(e) {
    const url = e.currentTarget.dataset.url;
    if (!this.data.personData || !this.data.personData.photos) return;
    wx.previewImage({
      current: url,
      urls: this.data.personData.photos
    });
  },

  goToPersonDetail: function(e) {
    const personId = e.currentTarget.dataset.personid;
    if (!personId) return;
    wx.navigateTo({
      url: '/pages/peopleStory/peopleStory?personId=' + personId
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

  goToTeaMaster: function() {
    var teamId = null;

    if (this.data.mode === 'detail' && this.data.relatedTeaMaster) {
      teamId = this.data.relatedTeaMaster.teamId;
    } else if (this.data.traceId) {
      var team = mockData.getTeaMasterTeamByTraceId(this.data.traceId);
      if (team) teamId = team.teamId;
    }

    if (teamId) {
      wx.navigateTo({
        url: '/pages/teaMaster/teaMaster?teamId=' + teamId
      });
    } else {
      wx.showToast({ title: '暂无制茶师信息', icon: 'none' });
    }
  },

  goToTeaMasterFromDetail: function() {
    if (this.data.relatedTeaMaster && this.data.relatedTeaMaster.teamId) {
      wx.navigateTo({
        url: '/pages/teaMaster/teaMaster?teamId=' + this.data.relatedTeaMaster.teamId
      });
    } else {
      wx.showToast({ title: '暂无关联制茶师信息', icon: 'none' });
    }
  },

  onShareAppMessage: function() {
    const person = this.data.personData;
    if (this.data.mode === 'detail' && person) {
      return {
        title: person.name + ' - ' + person.title,
        path: '/pages/peopleStory/peopleStory?personId=' + this.data.personId,
        imageUrl: person.avatar || ''
      };
    } else {
      return {
        title: '这杯茶的守护者 - 人物故事',
        path: '/pages/peopleStory/peopleStory?traceId=' + this.data.traceId
      };
    }
  }
});
