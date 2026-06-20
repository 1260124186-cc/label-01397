var userStore = require('../../utils/userStore.js');
var greenPoints = require('../../utils/greenPoints.js');
var mockData = require('../../utils/mockData.js');
var reviewTrust = require('../../utils/reviewTrust.js');

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
    presetTagsWithState: [],
    saving: false,
    hasSubmittedReview: false,
    isScanVerified: false,
    publishing: false,
    publishPreview: null,
    showPublishConfirm: false
  },

  onLoad: function(options) {
    var that = this;
    if (options.id) {
      this.loadNote(options.id);
    } else {
      var setData = {};
      var currentTags = [];
      if (options.traceId) setData.traceId = options.traceId;
      if (options.productName) setData.productName = decodeURIComponent(options.productName);
      if (options.draft) {
        try {
          setData.content = decodeURIComponent(options.draft);
        } catch (e) {
          setData.content = options.draft;
        }
      }
      if (options.tags) {
        try {
          var tagArr = decodeURIComponent(options.tags).split(',');
          if (Array.isArray(tagArr) && tagArr.length > 0) {
            currentTags = tagArr.slice(0, 5);
            setData.tags = currentTags;
          }
        } catch (e) {}
      }
      if (options.rating) {
        var r = parseInt(options.rating, 10);
        if (r >= 1 && r <= 5) setData.rating = r;
      }
      setData.presetTagsWithState = this.data.presetTags.map(function(t) {
        return { name: t, selected: currentTags.indexOf(t) !== -1 };
      });
      if (Object.keys(setData).length > 0) {
        this.setData(setData);
      }
      if (options.draft || options.tags || options.rating) {
        wx.showToast({ title: '已预填草稿', icon: 'success', duration: 1500 });
      }
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

    var hasSubmittedReview = userStore.hasSubmittedReview(note.traceId);
    var isScanVerified = userStore.isScanVerified(note.traceId);
    var publishPreview = null;
    if (!hasSubmittedReview && note.traceId) {
      publishPreview = reviewTrust.convertNoteToReviewPreview(note, note.traceId);
    }

    var noteTags = note.tags || [];
    var presetTags = this.data.presetTags;
    var presetTagsWithState = presetTags.map(function(t) {
      return { name: t, selected: noteTags.indexOf(t) !== -1 };
    });

    this.setData({
      isEdit: true,
      noteId: note.id,
      traceId: note.traceId,
      productName: note.productName,
      content: note.content,
      rating: note.rating,
      tags: noteTags,
      presetTagsWithState: presetTagsWithState,
      hasSubmittedReview: hasSubmittedReview,
      isScanVerified: isScanVerified,
      publishPreview: publishPreview
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
    var presetTagsWithState = this.data.presetTags.map(function(t) {
      return { name: t, selected: tags.indexOf(t) !== -1 };
    });
    this.setData({ tags: tags, presetTagsWithState: presetTagsWithState });
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
    var presetTagsWithState = this.data.presetTags.map(function(t) {
      return { name: t, selected: tags.indexOf(t) !== -1 };
    });
    this.setData({ tags: tags, inputTag: '', presetTagsWithState: presetTagsWithState });
  },

  onRemoveTag: function(e) {
    var tag = e.currentTarget.dataset.tag;
    var tags = this.data.tags.slice();
    var idx = tags.indexOf(tag);
    if (idx !== -1) tags.splice(idx, 1);
    var presetTagsWithState = this.data.presetTags.map(function(t) {
      return { name: t, selected: tags.indexOf(t) !== -1 };
    });
    this.setData({ tags: tags, presetTagsWithState: presetTagsWithState });
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
      var pointsResult = greenPoints.earnPoints('tastingNote', '完成品鉴笔记:' + (this.data.productName || '未知产品'));
      if (pointsResult.earned > 0) {
        wx.showToast({ title: '已保存 +' + pointsResult.earned + '积分', icon: 'success', duration: 2000 });
        console.log('[TastingNote] 完成笔记获得积分:', pointsResult.earned);
      } else {
        wx.showToast({ title: '已保存', icon: 'success', duration: 1500 });
      }
    }

    this.setData({ saving: false });
    setTimeout(function() { wx.navigateBack(); }, 1000);
  },

  openPublishConfirm: function() {
    if (!this.data.traceId) {
      wx.showToast({ title: '该笔记未关联产品', icon: 'none' });
      return;
    }
    if (this.data.hasSubmittedReview) {
      wx.showToast({ title: '您已评价过该产品', icon: 'none' });
      return;
    }

    var noteData = {
      id: this.data.noteId,
      traceId: this.data.traceId,
      productName: this.data.productName,
      content: this.data.content,
      rating: this.data.rating,
      tags: this.data.tags
    };
    var publishPreview = reviewTrust.convertNoteToReviewPreview(noteData, this.data.traceId);

    this.setData({
      showPublishConfirm: true,
      publishPreview: publishPreview
    });
  },

  closePublishConfirm: function() {
    this.setData({ showPublishConfirm: false });
  },

  publishAsReview: function() {
    var that = this;
    if (this.data.publishing) return;
    if (!this.data.noteId || !this.data.traceId) {
      wx.showToast({ title: '数据不完整', icon: 'none' });
      return;
    }

    this.setData({ publishing: true });

    var result = mockData.submitReviewFromNote(this.data.traceId, this.data.noteId);

    if (result.success) {
      var toastTitle = result.needAudit ? '已发布，正在审核' : '发布成功';
      wx.showToast({
        title: toastTitle,
        icon: 'success',
        duration: 2000
      });

      this.setData({
        showPublishConfirm: false,
        hasSubmittedReview: true
      });

      setTimeout(function() {
        that.setData({ publishing: false });
        wx.navigateBack();
      }, 1500);
    } else {
      this.setData({ publishing: false });
      wx.showToast({
        title: result.message || '发布失败',
        icon: 'none'
      });
    }
  },

  goToProductDetail: function() {
    if (!this.data.traceId) return;
    wx.redirectTo({
      url: '/pages/detail/detail?traceId=' + this.data.traceId
    });
  }
});
