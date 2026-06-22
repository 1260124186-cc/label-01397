/**
 * 桂花茶溯源小程序 - 口味偏好问卷与个性化推荐页
 * 功能：用户偏好问卷收集、个性化推荐结果展示、偏好持久化、一键加购
 * 页面路径：pages/preference/preference
 */

var teaPairing = require('../../utils/teaPairing.js');

Page({
  data: {
    // 问卷题目列表
    questions: [],
    // 当前题目序号（从0开始）
    currentStep: 0,
    // 题目总数
    totalSteps: 0,
    // 已选答案数组 [{questionId, selectedKey}]
    answers: [],
    // 当前题选中项key
    selectedKey: '',
    // 是否展示结果页
    showResult: false,
    // 个性化推荐结果
    recommendations: {
      pairings: [],
      giftBoxes: [],
      tagline: '',
      reason: ''
    },
    // 进度百分比
    progressPercent: 0
  },

  /**
   * 页面加载时初始化问卷
   */
  onLoad: function() {
    var that = this;
    var questions = teaPairing.getPreferenceQuestions() || [];

    // 检查是否已有偏好数据，有则直接进入结果页
    var hasPref = teaPairing.hasUserPreference();
    if (hasPref) {
      var recs = teaPairing.getRecommendations();
      that.setData({
        questions: questions,
        totalSteps: questions.length,
        showResult: true,
        recommendations: recs
      });
      return;
    }

    that.setData({
      questions: questions,
      totalSteps: questions.length,
      currentStep: 0,
      selectedKey: '',
      progressPercent: questions.length > 0 ? Math.round(((1) / questions.length) * 100) : 0
    });
  },

  /**
   * 选择答案选项
   */
  selectOption: function(e) {
    var key = e.currentTarget.dataset.key;
    if (!key) return;
    this.setData({
      selectedKey: key
    });
  },

  /**
   * 保存当前题答案到answers
   */
  saveCurrentAnswer: function() {
    var that = this;
    var questions = that.data.questions;
    var currentStep = that.data.currentStep;
    var selectedKey = that.data.selectedKey;
    var answers = that.data.answers.slice();

    if (!questions[currentStep] || !selectedKey) return;

    var questionId = questions[currentStep].questionId;
    var found = false;
    for (var i = 0; i < answers.length; i++) {
      if (answers[i].questionId === questionId) {
        answers[i].selectedKey = selectedKey;
        found = true;
        break;
      }
    }
    if (!found) {
      answers.push({
        questionId: questionId,
        selectedKey: selectedKey
      });
    }

    that.setData({
      answers: answers
    });
  },

  /**
   * 从answers中恢复某题已选答案
   */
  restoreSelectedKey: function(step) {
    var that = this;
    var questions = that.data.questions;
    var answers = that.data.answers;
    if (!questions[step]) {
      that.setData({ selectedKey: '' });
      return;
    }
    var questionId = questions[step].questionId;
    var key = '';
    for (var i = 0; i < answers.length; i++) {
      if (answers[i].questionId === questionId) {
        key = answers[i].selectedKey;
        break;
      }
    }
    that.setData({ selectedKey: key });
  },

  /**
   * 下一题
   */
  nextStep: function() {
    var that = this;
    if (!that.data.selectedKey) {
      wx.showToast({
        title: '请先选择一个选项',
        icon: 'none',
        duration: 1500
      });
      return;
    }

    that.saveCurrentAnswer();

    var nextStepNum = that.data.currentStep + 1;
    var total = that.data.totalSteps;

    // 最后一题点击完成
    if (nextStepNum >= total) {
      that.finishQuestionnaire();
      return;
    }

    that.setData({
      currentStep: nextStepNum,
      progressPercent: Math.round(((nextStepNum + 1) / total) * 100)
    });
    that.restoreSelectedKey(nextStepNum);
  },

  /**
   * 上一题
   */
  prevStep: function() {
    var that = this;
    var prevStepNum = that.data.currentStep - 1;
    if (prevStepNum < 0) return;

    that.saveCurrentAnswer();

    that.setData({
      currentStep: prevStepNum,
      progressPercent: Math.round(((prevStepNum + 1) / that.data.totalSteps) * 100)
    });
    that.restoreSelectedKey(prevStepNum);
  },

  /**
   * 完成问卷，保存答案并展示推荐结果
   */
  finishQuestionnaire: function() {
    var that = this;
    var answers = that.data.answers;

    // 保存答案到本地存储
    teaPairing.saveUserAnswers(answers);

    // 获取个性化推荐
    var recs = teaPairing.getRecommendations();

    wx.showToast({
      title: '推荐生成成功',
      icon: 'success',
      duration: 1000
    });

    setTimeout(function() {
      that.setData({
        showResult: true,
        recommendations: recs
      });
    }, 500);
  },

  /**
   * 重新测试：清除偏好并重置到第一题
   */
  resetQuestionnaire: function() {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要重新进行偏好测试吗？当前的推荐结果将被重置。',
      confirmText: '重新测试',
      cancelText: '取消',
      confirmColor: '#52C41A',
      success: function(res) {
        if (res.confirm) {
          // 清除本地偏好
          teaPairing.clearUserPreference();
          // 重置状态
          var questions = that.data.questions;
          that.setData({
            currentStep: 0,
            answers: [],
            selectedKey: '',
            showResult: false,
            progressPercent: questions.length > 0 ? Math.round((1 / questions.length) * 100) : 0
          });
        }
      }
    });
  },

  /**
   * 返回搭配首页
   */
  goToPairingList: function() {
    // 跳转到搭配相关页面（此处使用navigateBack或switchTab，根据项目实际路由调整）
    var pages = getCurrentPages();
    if (pages.length > 1) {
      wx.navigateBack({
        delta: 1,
        fail: function() {
          wx.switchTab({
            url: '/pages/index/index',
            fail: function() {
              wx.reLaunch({
                url: '/pages/index/index'
              });
            }
          });
        }
      });
    } else {
      wx.switchTab({
        url: '/pages/index/index',
        fail: function() {
          wx.reLaunch({
            url: '/pages/index/index'
          });
        }
      });
    }
  },

  /**
   * 跳转到茶品详情页
   */
  goToDetail: function(e) {
    var varietyKey = e.currentTarget.dataset.variety;
    var traceMap = {
      'jin-gui': 'G001',
      'yin-gui': 'G002',
      'dan-gui': 'G003',
      'si-ji-gui': 'G004'
    };
    var traceId = traceMap[varietyKey] || '';
    if (!traceId) {
      wx.showToast({
        title: '产品不存在',
        icon: 'none'
      });
      return;
    }
    wx.navigateTo({
      url: '/pages/detail/detail?traceId=' + traceId,
      fail: function() {
        wx.reLaunch({
          url: '/pages/detail/detail?traceId=' + traceId
        });
      }
    });
  },

  /**
   * 跳转到礼盒详情
   */
  goToGiftBoxDetail: function(e) {
    var boxId = e.currentTarget.dataset.boxid;
    if (!boxId) return;
    wx.navigateTo({
      url: '/pages/shop/detail?traceId=GIFT-' + boxId,
      fail: function() {
        wx.showToast({
          title: '礼盒详情页开发中',
          icon: 'none'
        });
      }
    });
  },

  /**
   * 一键加购单个推荐搭配（茶品+推荐食品）
   */
  addRecToCart: function(e) {
    var that = this;
    var varietyKey = e.currentTarget.dataset.variety;
    if (!varietyKey) return;

    wx.showLoading({
      title: '正在加入购物车...',
      mask: true
    });

    var result = teaPairing.addVarietyPairingToCart(varietyKey);

    setTimeout(function() {
      wx.hideLoading();
      if (result && result.success !== false) {
        wx.showToast({
          title: '已加入购物车',
          icon: 'success',
          duration: 1500
        });
      } else {
        wx.showToast({
          title: (result && result.msg) || '加购失败，请重试',
          icon: 'none',
          duration: 1500
        });
      }
    }, 600);
  },

  /**
   * 一键加购礼盒
   */
  addGiftBoxToCart: function(e) {
    var boxId = e.currentTarget.dataset.boxid;
    if (!boxId) return;

    wx.showLoading({
      title: '正在加入购物车...',
      mask: true
    });

    var result = teaPairing.addGiftBoxToCart(boxId);

    setTimeout(function() {
      wx.hideLoading();
      if (result && result.success !== false) {
        wx.showToast({
          title: '礼盒已加入购物车',
          icon: 'success',
          duration: 1500
        });
      } else {
        wx.showToast({
          title: (result && result.msg) || '加购失败，请重试',
          icon: 'none',
          duration: 1500
        });
      }
    }, 600);
  },

  /**
   * 一键加购全部推荐
   */
  addAllRecToCart: function() {
    var that = this;
    var pairings = that.data.recommendations.pairings || [];
    var giftBoxes = that.data.recommendations.giftBoxes || [];
    if (pairings.length === 0 && giftBoxes.length === 0) {
      wx.showToast({
        title: '暂无可加购商品',
        icon: 'none'
      });
      return;
    }

    wx.showModal({
      title: '一键加购全部',
      content: '将所有推荐商品加入购物车？',
      confirmText: '全部加入',
      cancelText: '取消',
      confirmColor: '#52C41A',
      success: function(res) {
        if (!res.confirm) return;

        wx.showLoading({
          title: '正在加入购物车...',
          mask: true
        });

        var totalSuccess = 0;
        var i;
        for (i = 0; i < pairings.length; i++) {
          var r = teaPairing.addVarietyPairingToCart(pairings[i].varietyKey);
          if (r && r.success !== false) totalSuccess++;
        }
        for (i = 0; i < giftBoxes.length; i++) {
          var rb = teaPairing.addGiftBoxToCart(giftBoxes[i].boxId);
          if (rb && rb.success !== false) totalSuccess++;
        }

        setTimeout(function() {
          wx.hideLoading();
          wx.showToast({
            title: '成功加入' + totalSuccess + '件商品',
            icon: 'success',
            duration: 1800
          });
        }, 800);
      }
    });
  },

  /**
   * 阻止事件冒泡
   */
  preventBubble: function() {},

  onShareAppMessage: function() {
    return {
      title: '一茶一品・桂花茶个性化推荐',
      path: '/pages/preference/preference',
      imageUrl: ''
    };
  }
});
