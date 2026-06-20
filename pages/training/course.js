const dealerAuth = require('../../utils/dealerAuth.js');
const dealerTraining = require('../../utils/dealerTraining.js');

Page({
  data: {
    courseId: '',
    course: null,
    chapters: [],
    isCompleted: false,
    progressPercent: 0,
    completedChapters: 0,
    totalChapters: 0,
    studyTimeLabel: '0分钟',
    quizPassed: false,
    latestQuiz: null,
    hasCertificate: false,
    canTakeQuiz: false,
    allChaptersCompleted: false
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
    if (!courseId) {
      wx.showToast({ title: '参数错误', icon: 'none' });
      setTimeout(function() { wx.navigateBack(); }, 1000);
      return;
    }
    
    this.setData({ courseId: courseId });
    this.loadData();
  },

  onShow: function() {
    if (!dealerAuth.isDealerLoggedIn()) {
      wx.redirectTo({ url: '/pages/dealer/login' });
      return;
    }
    if (this.data.courseId) {
      this.loadData();
    }
  },

  loadData: function() {
    const courseId = this.data.courseId;
    const course = dealerTraining.getCourseById(courseId);
    
    if (!course) {
      wx.showToast({ title: '课程不存在', icon: 'none' });
      setTimeout(function() { wx.navigateBack(); }, 1000);
      return;
    }
    
    const isCompleted = dealerTraining.isCourseCompleted(courseId);
    const progress = dealerTraining.getCourseProgress(courseId);
    const quizPassed = dealerTraining.isCourseQuizPassed(courseId);
    const latestQuiz = dealerTraining.getLatestQuizRecord(courseId);
    const cert = dealerTraining.getCertificateByCourseId(courseId);
    const studySeconds = dealerTraining.getCourseStudySeconds(courseId);
    
    let completedChapters = 0;
    let totalChapters = course.chapters ? course.chapters.length : 0;
    const decoratedChapters = course.chapters ? course.chapters.map(function(ch) {
      const chapterCompleted = dealerTraining.isChapterCompleted(courseId, ch.id);
      if (chapterCompleted) completedChapters++;
      const chapterStudySeconds = dealerTraining.getChapterStudySeconds(courseId, ch.id);
      return {
        ...ch,
        completed: chapterCompleted,
        durationLabel: Math.round(ch.duration / 60) + '分钟',
        studyTimeLabel: dealerTraining.formatStudyTime(chapterStudySeconds)
      };
    }) : [];
    
    const progressPercent = totalChapters > 0 ? Math.round(completedChapters / totalChapters * 100) : 0;
    const allChaptersCompleted = totalChapters > 0 && completedChapters === totalChapters;
    const canTakeQuiz = course.hasQuiz && allChaptersCompleted && !quizPassed;
    
    wx.setNavigationBarTitle({ title: course.name });
    
    this.setData({
      course: {
        ...course,
        categoryLabel: dealerTraining.CATEGORY_LABELS[course.category],
        categoryIcon: dealerTraining.CATEGORY_ICONS[course.category],
        categoryColor: dealerTraining.CATEGORY_COLORS[course.category],
        difficultyLabel: this.formatDifficulty(course.difficulty)
      },
      chapters: decoratedChapters,
      isCompleted: isCompleted,
      progressPercent: progressPercent,
      completedChapters: completedChapters,
      totalChapters: totalChapters,
      studyTimeLabel: dealerTraining.formatStudyTime(studySeconds),
      quizPassed: quizPassed,
      latestQuiz: latestQuiz,
      hasCertificate: !!cert,
      canTakeQuiz: canTakeQuiz,
      allChaptersCompleted: allChaptersCompleted
    });
  },

  formatDifficulty: function(difficulty) {
    const map = {
      'beginner': '入门',
      'intermediate': '进阶',
      'advanced': '高级'
    };
    return map[difficulty] || difficulty;
  },

  onChapterTap: function(e) {
    const chapterId = e.currentTarget.dataset.chapterid;
    if (!chapterId) return;
    
    wx.navigateTo({
      url: '/pages/training/chapter?courseId=' + this.data.courseId + '&chapterId=' + chapterId
    });
  },

  onTakeQuiz: function() {
    if (!this.data.canTakeQuiz) {
      if (!this.data.allChaptersCompleted) {
        wx.showToast({ title: '请先完成所有章节学习', icon: 'none' });
      } else if (this.data.quizPassed) {
        wx.showToast({ title: '您已通过测验', icon: 'none' });
      }
      return;
    }
    
    wx.navigateTo({
      url: '/pages/training/quiz?courseId=' + this.data.courseId
    });
  },

  onViewCertificate: function() {
    if (!this.data.hasCertificate) {
      wx.showToast({ title: '您还未获得证书', icon: 'none' });
      return;
    }
    
    wx.navigateTo({
      url: '/pages/training/cert?courseId=' + this.data.courseId
    });
  },

  goBack: function() {
    wx.navigateBack();
  },

  onShareAppMessage: function() {
    return {
      title: this.data.course ? this.data.course.name : '培训课程',
      path: '/pages/dealer/index'
    };
  }
});
