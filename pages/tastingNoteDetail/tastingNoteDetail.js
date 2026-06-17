var userStore = require('../../utils/userStore.js');

Page({
  data: {
    isEdit: false,
    noteId: '',
    traceId: '',
    productName: '',
    content: '',
    rating: 0,
    tags: [],
    inputTag: '',
    presetTags: ['回甘', '花香', '醇厚', '清甜', '浓香', '柔和', '鲜爽', '余韵', '桂花香', '茶韵'],
    saving: false
  },

  onLoad: function(options) {
    if (options.id) {
      this.loadNote(options.id);
    }
    if (options.traceId) {
      this.setData({ traceId: options.traceId });
    }
    if (options.productName) {
      this.setData({ productName: decodeURIComponent(options.productName) });
    }
  },

  loadNote: function(noteId) {
    var notes = userStore.getTastingNotes();
    var note = null;
    for (var i = 0; i < notes.length; i++) {
      if (notes[i].id === noteId) { note = notes[i]; break; }
    }
    if (!note) {
      wx.showToast({ title: '笔记不存在', icon: 'none', duration: 2000 });
      setTimeout(function() { wx.navigateBack(); }, 1500);
      return;
    }
    this.setData({
      isEdit: true,
      noteId: note.id,
      traceId: note.traceId,
      productName: note.productName,
      content: note.content,
      rating: note.rating,
      tags: note.tags || []
    });
    wx.setNavigationBarTitle({ title: '编辑笔记' });
  },

  onContentInput: function(e) {
    this.setData({ content: e.detail.value });
  },

  onRatingTap: function(e) {
    var rating = e.currentTarget.dataset.rating;
    this.setData({ rating: rating });
  },

  onPresetTagTap: function(e) {
    var tag = e.currentTarget.dataset.tag;
    var tags = this.data.tags.slice();
    var idx = tags.indexOf(tag);
    if (idx !== -1) {
      tags.splice(idx, 1);
    } else {
      if (tags.length >= 5) {
        wx.showToast({ title: '最多选择5个标签', icon: 'none', duration: 1500 });
        return;
      }
      tags.push(tag);
    }
    this.setData({ tags: tags });
  },

  onInputTagInput: function(e) {
    this.setData({ inputTag: e.detail.value });
  },

  onAddInputTag: function() {
    var tag = this.data.inputTag.trim();
    if (!tag) return;
    if (tag.length > 6) {
      wx.showToast({ title: '标签最多6个字', icon: 'none', duration: 1500 });
      return;
    }
    var tags = this.data.tags.slice();
    if (tags.indexOf(tag) !== -1) {
      wx.showToast({ title: '标签已存在', icon: 'none', duration: 1500 });
      return;
    }
    if (tags.length >= 5) {
      wx.showToast({ title: '最多选择5个标签', icon: 'none', duration: 1500 });
      return;
    }
    tags.push(tag);
    this.setData({ tags: tags, inputTag: '' });
  },

  onRemoveTag: function(e) {
    var tag = e.currentTarget.dataset.tag;
    var tags = this.data.tags.slice();
    var idx = tags.indexOf(tag);
    if (idx !== -1) tags.splice(idx, 1);
    this.setData({ tags: tags });
  },

  onSave: function() {
    if (this.data.saving) return;
    if (!this.data.content.trim()) {
      wx.showToast({ title: '请输入品鉴内容', icon: 'none', duration: 2000 });
      return;
    }
    if (this.data.rating === 0) {
      wx.showToast({ title: '请选择评分', icon: 'none', duration: 2000 });
      return;
    }

    this.setData({ saving: true });

    if (this.data.isEdit) {
      userStore.updateTastingNote(this.data.noteId, {
        content: this.data.content,
        rating: this.data.rating,
        tags: this.data.tags
      });
      wx.showToast({ title: '已保存', icon: 'success', duration: 1500 });
    } else {
      userStore.addTastingNote({
        traceId: this.data.traceId,
        productName: this.data.productName,
        content: this.data.content,
        rating: this.data.rating,
        tags: this.data.tags
      });
      wx.showToast({ title: '已保存', icon: 'success', duration: 1500 });
    }

    this.setData({ saving: false });
    setTimeout(function() { wx.navigateBack(); }, 1000);
  }
});
