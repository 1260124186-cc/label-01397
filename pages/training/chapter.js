const dealerAuth = require('../../utils/dealerAuth.js');
const dealerTraining = require('../../utils/dealerTraining.js');

Page({
  data: {
    courseId: '',
    chapterId: '',
    course: null,
    chapter: null,
    chapterIndex: 0,
    totalChapters: 0,
    isCompleted: false,
    studySeconds: 0,
    studyTimeLabel: '0分钟',
    minStudySeconds: 60,
    studyTimer: null,
    startTime: 0,
    accumulatedSeconds: 0,
    canGoNext: false,
    canGoPrev: false,
    contentHtml: ''
  },

  onLoad: function(options) {
    if (!dealerAuth.isDealerLoggedIn()) {
      wx.redirectTo({ url: '/pages/dealer/login' });
      return;
    }
    if (!dealerAuth.hasPermission('viewTraining')) {
      wx.showToast({ title: '无培训学习权限', icon: 'none' });
      setTimeout(function() { wx.navigateBack(); }, 1000);
      return;
    }
    
    const courseId = options.courseId;
    const chapterId = options.chapterId;
    
    if (!courseId || !chapterId) {
      wx.showToast({ title: '参数错误', icon: 'none' });
      setTimeout(function() { wx.navigateBack(); }, 1000);
      return;
    }
    
    this.setData({ courseId: courseId, chapterId: chapterId });
    this.loadData();
  },

  onShow: function() {
    if (!dealerAuth.isDealerLoggedIn()) {
      wx.redirectTo({ url: '/pages/dealer/login' });
      return;
    }
    if (this.data.courseId && this.data.chapterId) {
      this.loadData();
      this.startStudyTimer();
    }
  },

  onHide: function() {
    this.stopStudyTimer();
    this.saveProgress();
  },

  onUnload: function() {
    this.stopStudyTimer();
    this.saveProgress();
  },

  loadData: function() {
    const courseId = this.data.courseId;
    const chapterId = this.data.chapterId;
    
    const course = dealerTraining.getCourseById(courseId);
    if (!course) {
      wx.showToast({ title: '课程不存在', icon: 'none' });
      setTimeout(function() { wx.navigateBack(); }, 1000);
      return;
    }
    
    const chapters = course.chapters || [];
    const chapterIndex = chapters.findIndex(function(c) { return c.id === chapterId; });
    const chapter = chapters[chapterIndex];
    
    if (!chapter) {
      wx.showToast({ title: '章节不存在', icon: 'none' });
      setTimeout(function() { wx.navigateBack(); }, 1000);
      return;
    }
    
    const isCompleted = dealerTraining.isChapterCompleted(courseId, chapterId);
    const studySeconds = dealerTraining.getChapterStudySeconds(courseId, chapterId);
    const contentHtml = this.formatContent(chapter.content);
    
    wx.setNavigationBarTitle({ title: chapter.title });
    
    this.setData({
      course: course,
      chapter: chapter,
      chapterIndex: chapterIndex,
      totalChapters: chapters.length,
      isCompleted: isCompleted,
      studySeconds: studySeconds,
      studyTimeLabel: dealerTraining.formatStudyTime(studySeconds),
      minStudySeconds: chapter.minStudySeconds || 60,
      canGoPrev: chapterIndex > 0,
      canGoNext: chapterIndex < chapters.length - 1,
      contentHtml: contentHtml,
      accumulatedSeconds: studySeconds
    });
  },

  formatContent: function(content) {
    if (!content) return '';
    
    let html = content
      .replace(/^## (.+)$/gm, '<h2 style="font-size: 34rpx; font-weight: 600; color: #333; margin: 40rpx 0 20rpx;">$1</h2>')
      .replace(/^### (.+)$/gm, '<h3 style="font-size: 30rpx; font-weight: 600; color: #333; margin: 30rpx 0 16rpx;">$1</h3>')
      .replace(/\*\*(.+?)\*\*/g, '<strong style="color: #2E8B57;">$1</strong>')
      .replace(/^- (.+)$/gm, '<li style="margin: 12rpx 0; padding-left: 10rpx; list-style: none; position: relative;">$1</li>')
      .replace(/^(\d+)\. (.+)$/gm, '<li style="margin: 12rpx 0; padding-left: 10rpx; list-style: none;"><span style="color: #2E8B57; font-weight: 600; margin-right: 8rpx;">$1.</span>$2</li>')
      .replace(/\n\n/g, '</p><p style="margin: 16rpx 0; line-height: 1.8;">')
      .replace(/\n/g, '<br/>');
    
    return '<p style="margin: 16rpx 0; line-height: 1.8;">' + html + '</p>';
  },

  startStudyTimer: function() {
    const that = this;
    this.stopStudyTimer();
    this.setData({ startTime: Date.now() });
    
    this.data.studyTimer = setInterval(function() {
      const elapsed = Math.floor((Date.now() - that.data.startTime) / 1000);
      const totalSeconds = that.data.accumulatedSeconds + elapsed;
      const isCompleted = totalSeconds >= that.data.minStudySeconds;
      
      that.setData({
        studySeconds: totalSeconds,
        studyTimeLabel: dealerTraining.formatStudyTime(totalSeconds),
        isCompleted: isCompleted
      });
    }, 1000);
  },

  stopStudyTimer: function() {
    if (this.data.studyTimer) {
      clearInterval(this.data.studyTimer);
      this.setData({ studyTimer: null });
    }
  },

  saveProgress: function() {
    if (this.data.startTime > 0) {
      const elapsed = Math.floor((Date.now() - this.data.startTime) / 1000);
      if (elapsed > 0) {
        dealerTraining.markChapterStudy(this.data.courseId, this.data.chapterId, elapsed);
        this.setData({
          startTime: 0,
          accumulatedSeconds: this.data.studySeconds
        });
      }
    }
  },

  onPrevChapter: function() {
    if (!this.data.canGoPrev) return;
    
    this.saveProgress();
    
    const chapters = this.data.course.chapters;
    const prevChapter = chapters[this.data.chapterIndex - 1];
    
    wx.redirectTo({
      url: '/pages/training/chapter?courseId=' + this.data.courseId + '&chapterId=' + prevChapter.id
    });
  },

  onNextChapter: function() {
    if (!this.data.canGoNext) return;
    
    if (!this.data.isCompleted) {
      wx.showModal({
        title: '学习时间不足',
        content: '本章最少需要学习' + Math.ceil(this.data.minStudySeconds / 60) + '分钟，请继续学习。',
        showCancel: false,
        confirmText: '继续学习'
      });
      return;
    }
    
    this.saveProgress();
    
    const chapters = this.data.course.chapters;
    const nextChapter = chapters[this.data.chapterIndex + 1];
    
    wx.redirectTo({
      url: '/pages/training/chapter?courseId=' + this.data.courseId + '&chapterId=' + nextChapter.id
    });
  },

  onBackToCourse: function() {
    this.saveProgress();
    wx.navigateBack();
  },

  onMediaTap: function(e) {
    const url = e.currentTarget.dataset.url;
    if (!url) return;
    
    wx.previewImage({
      urls: [url]
    });
  },

  goBack: function() {
    this.saveProgress();
    wx.navigateBack();
  },

  onShareAppMessage: function() {
    return {
      title: this.data.chapter ? this.data.chapter.title : '培训学习',
      path: '/pages/dealer/index'
    };
  }
});
