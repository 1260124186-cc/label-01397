var userStore = require('../../utils/userStore.js');
var storage = require('../../utils/storage.js');

Page({
  data: {
    notes: [],
    isEmpty: true
  },

  onShow: function() {
    this.loadNotes();
  },

  loadNotes: function() {
    var list = userStore.getTastingNotes();
    var formatted = list.map(function(item) {
      var stars = '';
      for (var i = 0; i < 5; i++) {
        stars += i < item.rating ? '★' : '☆';
      }
      return Object.assign({}, item, {
        formatTime: storage.formatTime(item.updateTime || item.createTime),
        stars: stars,
        contentPreview: (item.content || '').length > 60 ? (item.content || '').substr(0, 60) + '...' : (item.content || '')
      });
    });
    this.setData({
      notes: formatted,
      isEmpty: formatted.length === 0
    });
  },

  onNoteTap: function(e) {
    var noteId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/tastingNoteDetail/tastingNoteDetail?id=' + noteId
    });
  },

  onAddNote: function() {
    wx.navigateTo({
      url: '/pages/tastingNoteDetail/tastingNoteDetail'
    });
  },

  onDeleteNote: function(e) {
    var noteId = e.currentTarget.dataset.id;
    var that = this;
    wx.showModal({
      title: '删除笔记',
      content: '确定删除该品鉴笔记吗？',
      confirmColor: '#ff4d4f',
      success: function(res) {
        if (res.confirm) {
          userStore.deleteTastingNote(noteId);
          that.loadNotes();
          wx.showToast({ title: '已删除', icon: 'success', duration: 1500 });
        }
      }
    });
  }
});
