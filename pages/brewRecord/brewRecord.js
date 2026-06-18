var userStore = require('../../utils/userStore.js');
var storageUtil = require('../../utils/storage.js');

Page({
  data: {
    traceId: '',
    records: [],
    flavorCurve: null,
    isEmpty: true,
    filterTab: 'all'
  },

  onLoad: function(options) {
    if (options.traceId) {
      this.setData({ traceId: options.traceId });
    }
  },

  onShow: function() {
    this.loadRecords();
  },

  loadRecords: function() {
    var allRecords = userStore.getBrewRecords();
    var records;

    if (this.data.traceId) {
      records = allRecords.filter(function(r) { return r.traceId === this.data.traceId; }.bind(this));
    } else {
      records = allRecords;
    }

    if (this.data.filterTab === 'rated') {
      records = records.filter(function(r) { return r.rating > 0; });
    }

    var formatted = records.map(function(item) {
      var durationMin = Math.floor(item.brewDuration / 60);
      var durationSec = item.brewDuration % 60;
      var durationText = durationMin > 0
        ? durationMin + '分' + (durationSec > 0 ? durationSec + '秒' : '')
        : durationSec + '秒';

      var stars = '';
      for (var i = 0; i < 5; i++) {
        stars += i < item.rating ? '★' : '☆';
      }

      var hardnessMap = { soft: '软水', medium: '中等', hard: '硬水' };

      return Object.assign({}, item, {
        formatTime: storageUtil.formatTime(item.createTime),
        durationText: durationText,
        stars: stars,
        hardnessText: hardnessMap[item.waterHardness] || '中等',
        feelingPreview: (item.feeling || '').length > 40 ? (item.feeling || '').substr(0, 40) + '...' : (item.feeling || '')
      });
    });

    var flavorCurve = userStore.getBrewFlavorCurve(this.data.traceId || null);

    this.setData({
      records: formatted,
      flavorCurve: flavorCurve,
      isEmpty: formatted.length === 0
    });
  },

  switchTab: function(e) {
    var tab = e.currentTarget.dataset.tab;
    this.setData({ filterTab: tab });
    this.loadRecords();
  },

  onDeleteRecord: function(e) {
    var recordId = e.currentTarget.dataset.id;
    var that = this;
    wx.showModal({
      title: '删除记录',
      content: '确定删除这条冲泡记录吗？',
      confirmColor: '#ff4d4f',
      success: function(res) {
        if (res.confirm) {
          userStore.deleteBrewRecord(recordId);
          that.loadRecords();
          wx.showToast({ title: '已删除', icon: 'success', duration: 1500 });
        }
      }
    });
  },

  onCreateNote: function(e) {
    var recordId = e.currentTarget.dataset.id;
    var record = this.data.records.find(function(r) { return r.id === recordId; });
    if (!record) return;

    var draft = userStore.generateTastingNoteDraft(record, record.productName);
    var url = '/pages/tastingNoteDetail/tastingNoteDetail'
      + '?traceId=' + encodeURIComponent(record.traceId || '')
      + '&productName=' + encodeURIComponent(record.productName || '')
      + '&draft=' + encodeURIComponent(draft)
      + '&tags=' + encodeURIComponent((record.tags || []).join(','))
      + '&rating=' + (record.rating || 0);

    wx.navigateTo({ url: url });
  },

  goToEnvironment: function() {
    var url = '/pages/brewEnvironment/brewEnvironment';
    if (this.data.traceId) url += '?traceId=' + this.data.traceId;
    wx.navigateTo({ url: url });
  }
});
