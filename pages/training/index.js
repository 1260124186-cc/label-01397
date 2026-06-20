const dealerAuth = require('../../utils/dealerAuth.js');
const dealerTraining = require('../../utils/dealerTraining.js');

Page({
  data: {
    stats: null,
    courses: [],
    activeCategory: 'all',
    categories: [
      { key: 'all', label: '全部课程', icon: '📚' },
      { key: 'product', label: '产品知识', icon: '📦' },
      { key: 'trace', label: '溯源话术', icon: '🔍' },
      { key: 'divergence', label: '窜货政策', icon: '🚨' },
      { key: 'brew', label: '冲泡演示', icon: '🍵' }
    ],
    filteredCourses: [],
    dealerUser: null
  },

  onLoad: function() {
    if (!dealerAuth.isDealerLoggedIn()) {
      wx.redirectTo({ url: '/pages/dealer/login' });
      return;
    }
    if (!dealerAuth.hasPermission('viewTraining')) {
      wx.showToast({ title: '无培训学习权限', icon: 'none' });
      setTimeout(function() { wx.navigateBack(); }, 1000);
      return;
    }
    this.loadData();
  },

  onShow: function() {
    if (!dealerAuth.isDealerLoggedIn()) {
      wx.redirectTo({ url: '/pages/dealer/login' });
      return;
    }
    this.loadData();
  },

  onPullDownRefresh: function() {
    this.loadData();
    wx.stopPullDownRefresh();
  },

  loadData: function() {
    const stats = dealerTraining.getTrainingStats();
    const courses = dealerTraining.getAllCourses();
    const decoratedCourses = this.decorateCourses(courses);
    const user = dealerAuth.getDealerUser();

    this.setData({
      stats: stats,
      courses: decoratedCourses,
      dealerUser: user
    });

    this.applyFilter();
  },

  decorateCourses: function(courses) {
    const that = this;
    return courses.map(function(course) {
      const isCompleted = dealerTraining.isCourseCompleted(course.id);
      const progress = dealerTraining.getCourseProgress(course.id);
      const cert = dealerTraining.getCertificateByCourseId(course.id);
      const studySeconds = dealerTraining.getCourseStudySeconds(course.id);
      
      let completedChapters = 0;
      let totalChapters = course.chapters ? course.chapters.length : 0;
      if (progress && progress.chapters) {
        completedChapters = Object.values(progress.chapters).filter(function(c) { return c.completed; }).length;
      }
      
      const progressPercent = totalChapters > 0 ? Math.round(completedChapters / totalChapters * 100) : 0;
      
      return {
        ...course,
        categoryLabel: dealerTraining.CATEGORY_LABELS[course.category],
        categoryIcon: dealerTraining.CATEGORY_ICONS[course.category],
        categoryColor: dealerTraining.CATEGORY_COLORS[course.category],
        difficultyLabel: that.formatDifficulty(course.difficulty),
        isCompleted: isCompleted,
        progressPercent: progressPercent,
        completedChapters: completedChapters,
        totalChapters: totalChapters,
        studyTimeLabel: dealerTraining.formatStudyTime(studySeconds),
        hasCertificate: !!cert,
        statusText: isCompleted ? '已完成' : (progressPercent > 0 ? '学习中' : '未开始'),
        statusClass: isCompleted ? 'completed' : (progressPercent > 0 ? 'in-progress' : 'not-started')
      };
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

  applyFilter: function() {
    const category = this.data.activeCategory;
    let filtered = this.data.courses;
    
    if (category !== 'all') {
      filtered = filtered.filter(function(c) { return c.category === category; });
    }
    
    this.setData({ filteredCourses: filtered });
  },

  onCategoryTap: function(e) {
    const key = e.currentTarget.dataset.key;
    if (!key) return;
    this.setData({ activeCategory: key });
    this.applyFilter();
  },

  onCourseTap: function(e) {
    const courseId = e.currentTarget.dataset.courseid;
    if (!courseId) return;
    wx.navigateTo({
      url: '/pages/training/course?courseId=' + courseId
    });
  },

  goToCertificates: function() {
    wx.navigateTo({
      url: '/pages/training/cert'
    });
  },

  goBack: function() {
    wx.navigateBack();
  },

  onShareAppMessage: function() {
    return {
      title: '经销商培训学院',
      path: '/pages/dealer/index'
    };
  }
});
