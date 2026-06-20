const dealerAuth = require('../../utils/dealerAuth.js');
const dealerTraining = require('../../utils/dealerTraining.js');

Page({
  data: {
    courseId: '',
    course: null,
    quiz: null,
    questions: [],
    answers: {},
    currentIndex: 0,
    totalQuestions: 0,
    submitted: false,
    result: null,
    showResult: false,
    passingScore: 60
  },

  onLoad: function(options) {
    if (!dealerAuth.isDealerLoggedIn()) {
      wx.redirectTo({ url: '/pages/dealer/login' });
      return;
    }
    if (!dealerAuth.hasPermission('takeQuiz')) {
      wx.showToast({ title: '无测验权限', icon: 'none' });
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

  loadData: function() {
    const courseId = this.data.courseId;
    const course = dealerTraining.getCourseById(courseId);
    
    if (!course) {
      wx.showToast({ title: '课程不存在', icon: 'none' });
      setTimeout(function() { wx.navigateBack(); }, 1000);
      return;
    }
    
    if (!course.hasQuiz || !course.quiz) {
      wx.showToast({ title: '该课程无测验', icon: 'none' });
      setTimeout(function() { wx.navigateBack(); }, 1000);
      return;
    }
    
    const allChaptersCompleted = course.chapters.every(function(ch) {
      return dealerTraining.isChapterCompleted(courseId, ch.id);
    });
    
    if (!allChaptersCompleted) {
      wx.showToast({ title: '请先完成所有章节学习', icon: 'none' });
      setTimeout(function() { wx.navigateBack(); }, 1000);
      return;
    }
    
    const quizPassed = dealerTraining.isCourseQuizPassed(courseId);
    if (quizPassed) {
      wx.showToast({ title: '您已通过本测验', icon: 'none' });
      setTimeout(function() { wx.navigateBack(); }, 1000);
      return;
    }
    
    const questions = course.quiz.questions.map(function(q) {
      return {
        ...q,
        selectedAnswer: '',
        showExplanation: false
      };
    });
    
    wx.setNavigationBarTitle({ title: course.quiz.title });
    
    this.setData({
      course: {
        ...course,
        categoryLabel: dealerTraining.CATEGORY_LABELS[course.category]
      },
      quiz: course.quiz,
      questions: questions,
      totalQuestions: questions.length,
      passingScore: course.quiz.passingScore || dealerTraining.QUIZ_PASS_SCORE
    });
  },

  onOptionSelect: function(e) {
    if (this.data.submitted) return;
    
    const questionId = e.currentTarget.dataset.questionid;
    const option = e.currentTarget.dataset.option;
    const index = e.currentTarget.dataset.index;
    
    const answers = { ...this.data.answers };
    answers[questionId] = option;
    
    const questions = this.data.questions.map(function(q, i) {
      if (i === index) {
        return { ...q, selectedAnswer: option };
      }
      return q;
    });
    
    this.setData({
      answers: answers,
      questions: questions
    });
  },

  goToPrev: function() {
    if (this.data.currentIndex > 0) {
      this.setData({ currentIndex: this.data.currentIndex - 1 });
    }
  },

  goToNext: function() {
    if (this.data.currentIndex < this.data.totalQuestions - 1) {
      this.setData({ currentIndex: this.data.currentIndex + 1 });
    }
  },

  onQuestionTap: function(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({ currentIndex: index });
  },

  onSubmit: function() {
    const answeredCount = Object.keys(this.data.answers).length;
    if (answeredCount < this.data.totalQuestions) {
      wx.showModal({
        title: '提示',
        content: '您还有 ' + (this.data.totalQuestions - answeredCount) + ' 道题未作答，确定要提交吗？',
        success: function(res) {
          if (res.confirm) {
            this.doSubmit();
          }
        }.bind(this)
      });
      return;
    }
    
    wx.showModal({
      title: '确认提交',
      content: '确定要提交测验吗？提交后将不能修改答案。',
      success: function(res) {
        if (res.confirm) {
          this.doSubmit();
        }
      }.bind(this)
    });
  },

  doSubmit: function() {
    wx.showLoading({ title: '提交中...' });
    
    setTimeout(function() {
      const result = dealerTraining.submitQuiz(this.data.courseId, this.data.answers);
      wx.hideLoading();
      
      if (!result.success) {
        wx.showToast({ title: result.error || '提交失败', icon: 'none' });
        return;
      }
      
      const questions = this.data.questions.map(function(q) {
        const detail = result.details.find(function(d) { return d.questionId === q.id; });
        return {
          ...q,
          showExplanation: true,
          isCorrect: detail ? detail.isCorrect : false
        };
      });
      
      this.setData({
        submitted: true,
        result: result,
        questions: questions,
        showResult: true
      });
      
      if (result.passed) {
        wx.showToast({
          title: '🎉 恭喜通过！',
          icon: 'success',
          duration: 2000
        });
      } else {
        wx.showToast({
          title: '未通过，请重试',
          icon: 'none',
          duration: 2000
        });
      }
    }.bind(this), 500);
  },

  onViewCertificate: function() {
    wx.navigateTo({
      url: '/pages/training/cert?courseId=' + this.data.courseId
    });
  },

  onRetry: function() {
    const questions = this.data.quiz.questions.map(function(q) {
      return {
        ...q,
        selectedAnswer: '',
        showExplanation: false
      };
    });
    
    this.setData({
      answers: {},
      questions: questions,
      currentIndex: 0,
      submitted: false,
      result: null,
      showResult: false
    });
  },

  goBack: function() {
    wx.navigateBack();
  },

  goHome: function() {
    wx.redirectTo({ url: '/pages/training/index' });
  }
});
