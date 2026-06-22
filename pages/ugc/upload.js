/**
 * 桂花茶溯源小程序 - UGC上传发布页
 * 功能：用户上传搭配照片、填写内容、选择品种和搭配食品后发布
 * 页面路径：pages/ugc/upload
 */

var teaPairing = require('../../utils/teaPairing.js');
var mockData = require('../../utils/mockData.js');

Page({
  data: {
    images: [],
    maxImages: 9,
    content: '',
    variety: '',
    pairedFoods: [],
    allFoods: [],
    varietyOptions: [
      { name: '金桂', icon: '🌼', color: '#DAA520' },
      { name: '银桂', icon: '🌸', color: '#C0C0C0' },
      { name: '丹桂', icon: '🌺', color: '#CD5C5C' },
      { name: '四季桂', icon: '🍃', color: '#90EE90' }
    ],
    suggestTags: ['下午茶', '办公室必备', '养生好物', '闺蜜时光', '送礼佳品', '秋日限定'],
    contentLength: 0,
    contentMax: 500,
    submitting: false
  },

  onLoad: function(options) {
    console.log('[UGC上传页] 页面加载，参数：', options);
    this.loadAllFoods();
  },

  onShow: function() {
    console.log('[UGC上传页] 页面显示');
  },

  /**
   * 加载所有食品选项
   */
  loadAllFoods: function() {
    var foods = mockData.getAllFoodProducts();
    var displayFoods = foods.slice(0, 12).map(function(food) {
      return {
        foodId: food.foodId,
        name: food.name,
        thumbnail: food.thumbnail,
        price: food.price
      };
    });
    this.setData({ allFoods: displayFoods });
  },

  /**
   * 选择图片
   */
  onChooseImage: function() {
    var that = this;
    var remainCount = that.data.maxImages - that.data.images.length;
    if (remainCount <= 0) {
      wx.showToast({ title: '最多上传9张图片', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '加载中...', mask: true });

    teaPairing.chooseUgcImages().then(function(paths) {
      wx.hideLoading();
      if (paths && paths.length > 0) {
        var newImages = that.data.images.concat(paths);
        if (newImages.length > that.data.maxImages) {
          newImages = newImages.slice(0, that.data.maxImages);
          wx.showToast({ title: '已截取前9张', icon: 'none' });
        }
        that.setData({ images: newImages });
      }
    }).catch(function(err) {
      wx.hideLoading();
      console.error('[UGC上传页] 选择图片失败：', err);
      wx.showToast({ title: '选择图片失败', icon: 'none' });
    });
  },

  /**
   * 预览图片
   */
  onPreviewImage: function(e) {
    var index = e.currentTarget.dataset.index;
    if (index === undefined || index === null) return;
    var images = this.data.images;
    if (!images || images.length === 0) return;

    wx.previewImage({
      urls: images,
      current: images[index]
    });
  },

  /**
   * 删除图片
   */
  onDeleteImage: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    if (index === undefined || index === null) return;

    wx.showModal({
      title: '提示',
      content: '确定删除这张图片吗？',
      confirmColor: '#E91E63',
      success: function(res) {
        if (res.confirm) {
          var images = that.data.images.slice();
          images.splice(index, 1);
          that.setData({ images: images });
        }
      }
    });
  },

  /**
   * 选择品种
   */
  onSelectVariety: function(e) {
    var varietyName = e.currentTarget.dataset.variety;
    if (!varietyName) return;
    console.log('[UGC上传页] 选择品种：', varietyName);

    var newVariety = this.data.variety === varietyName ? '' : varietyName;
    this.setData({ variety: newVariety });
  },

  /**
   * 勾选/取消食品
   */
  onToggleFood: function(e) {
    var foodName = e.currentTarget.dataset.foodname;
    if (!foodName) return;

    var pairedFoods = this.data.pairedFoods.slice();
    var idx = pairedFoods.indexOf(foodName);
    if (idx > -1) {
      pairedFoods.splice(idx, 1);
    } else {
      pairedFoods.push(foodName);
    }
    this.setData({ pairedFoods: pairedFoods });
  },

  /**
   * 文字输入
   */
  onContentInput: function(e) {
    var value = e.detail.value || '';
    if (value.length > this.data.contentMax) {
      value = value.slice(0, this.data.contentMax);
      wx.showToast({ title: '最多输入500字', icon: 'none' });
    }
    this.setData({
      content: value,
      contentLength: value.length
    });
  },

  /**
   * 点击建议标签
   */
  onTagTap: function(e) {
    var tag = e.currentTarget.dataset.tag;
    if (!tag) return;

    var currentContent = this.data.content;
    var tagText = '#' + tag + ' ';
    var newContent = currentContent + tagText;

    if (newContent.length > this.data.contentMax) {
      wx.showToast({ title: '内容过长，请先精简', icon: 'none' });
      return;
    }

    this.setData({
      content: newContent,
      contentLength: newContent.length
    });
  },

  /**
   * 表单校验
   */
  validateForm: function() {
    if (!this.data.images || this.data.images.length === 0) {
      wx.showToast({ title: '请至少上传一张图片', icon: 'none' });
      return false;
    }
    if (!this.data.content || this.data.content.trim().length === 0) {
      wx.showToast({ title: '请写下您的搭配心得', icon: 'none' });
      return false;
    }
    if (!this.data.variety) {
      wx.showToast({ title: '请选择桂花品种', icon: 'none' });
      return false;
    }
    return true;
  },

  /**
   * 提取内容中的标签
   */
  extractTags: function(content) {
    var tags = [];
    var regex = /#([^#\s]+)/g;
    var match;
    while ((match = regex.exec(content)) !== null) {
      if (match[1] && tags.indexOf(match[1]) === -1) {
        tags.push(match[1]);
      }
    }
    return tags;
  },

  /**
   * 提交发布
   */
  onSubmit: function() {
    var that = this;
    if (that.data.submitting) return;

    if (!that.validateForm()) return;

    that.setData({ submitting: true });
    wx.showLoading({ title: '发布中...', mask: true });

    var tags = that.extractTags(that.data.content);

    var postData = {
      images: that.data.images,
      content: that.data.content,
      variety: that.data.variety,
      pairedFoods: that.data.pairedFoods,
      tags: tags
    };

    setTimeout(function() {
      var result = teaPairing.publishUgcPost(postData);
      wx.hideLoading();
      that.setData({ submitting: false });

      if (result && result.success) {
        wx.showToast({
          title: '发布成功',
          icon: 'success',
          duration: 1500
        });
        setTimeout(function() {
          wx.navigateBack({
            delta: 1,
            fail: function() {
              wx.switchTab({
                url: '/pages/index/index',
                fail: function() {}
              });
            }
          });
        }, 1500);
      } else {
        wx.showToast({
          title: (result && result.msg) || '发布失败，请重试',
          icon: 'none',
          duration: 2000
        });
      }
    }, 1000);
  },

  /**
   * 返回上一页
   */
  onBack: function() {
    var that = this;
    var hasContent = (that.data.images && that.data.images.length > 0) ||
                     (that.data.content && that.data.content.trim().length > 0) ||
                     that.data.variety ||
                     (that.data.pairedFoods && that.data.pairedFoods.length > 0);

    if (hasContent) {
      wx.showModal({
        title: '提示',
        content: '您编辑的内容尚未保存，确定要离开吗？',
        confirmText: '离开',
        cancelText: '继续编辑',
        confirmColor: '#E91E63',
        success: function(res) {
          if (res.confirm) {
            wx.navigateBack({
              delta: 1,
              fail: function() {
                wx.switchTab({
                  url: '/pages/index/index',
                  fail: function() {}
                });
              }
            });
          }
        }
      });
    } else {
      wx.navigateBack({
        delta: 1,
        fail: function() {
          wx.switchTab({
            url: '/pages/index/index',
            fail: function() {}
          });
        }
      });
    }
  },

  /**
   * 页面分享
   */
  onShareAppMessage: function() {
    return {
      title: '桂花茶搭配社区 - 分享我的搭配',
      path: '/pages/ugc/upload',
      imageUrl: ''
    };
  }
});
