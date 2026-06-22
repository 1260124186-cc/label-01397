/**
 * 桂花茶溯源小程序 - UGC搭配社区列表页
 * 功能：展示茶友分享的搭配内容，支持排序筛选、点赞、分享、预览
 * 页面路径：pages/ugc/list
 */

var teaPairing = require('../../utils/teaPairing.js');
var mockData = require('../../utils/mockData.js');

Page({
  data: {
    posts: [],
    sortType: 'hot',
    sortList: [
      { key: 'hot', name: '热门' },
      { key: 'new', name: '最新' }
    ],
    filterVariety: '全部',
    varietyList: ['全部', '金桂', '银桂', '丹桂', '四季桂'],
    loading: true,
    showEmpty: false,
    animatingLikeId: ''
  },

  onLoad: function(options) {
    console.log('[UGC列表页] 页面加载，参数：', options);
    this.loadPosts();
  },

  onShow: function() {
    console.log('[UGC列表页] 页面显示');
    this.loadPosts();
  },

  /**
   * 加载UGC帖子列表
   */
  loadPosts: function() {
    var that = this;
    that.setData({ loading: true });

    setTimeout(function() {
      var options = {
        sortBy: that.data.sortType
      };
      if (that.data.filterVariety !== '全部') {
        options.variety = that.data.filterVariety;
      }

      var posts = teaPairing.getAllUgcPosts(options);
      console.log('[UGC列表页] 加载帖子数量：', posts ? posts.length : 0);

      that.setData({
        posts: posts || [],
        loading: false,
        showEmpty: !posts || posts.length === 0
      });
    }, 300);
  },

  /**
   * 切换排序方式
   */
  switchSort: function(e) {
    var type = e.currentTarget.dataset.type;
    if (!type || type === this.data.sortType) return;
    console.log('[UGC列表页] 切换排序：', type);
    this.setData({ sortType: type });
    this.loadPosts();
  },

  /**
   * 切换品种筛选
   */
  switchVariety: function(e) {
    var variety = e.currentTarget.dataset.variety;
    if (!variety || variety === this.data.filterVariety) return;
    console.log('[UGC列表页] 切换品种：', variety);
    this.setData({ filterVariety: variety });
    this.loadPosts();
  },

  /**
   * 点赞按钮点击
   */
  onLikeTap: function(e) {
    var that = this;
    var postId = e.currentTarget.dataset.postid;
    if (!postId) return;

    var result = teaPairing.toggleLikeUgcPost(postId);
    if (result && result.success) {
      that.setData({ animatingLikeId: postId });

      var posts = that.data.posts.map(function(p) {
        if (p.postId === postId) {
          return result.post;
        }
        return p;
      });
      that.setData({ posts: posts });

      wx.vibrateShort({ type: 'light' });

      setTimeout(function() {
        that.setData({ animatingLikeId: '' });
      }, 300);
    }
  },

  /**
   * 分享按钮点击
   */
  onShareTap: function(e) {
    var postId = e.currentTarget.dataset.postid;
    if (!postId) return;
    console.log('[UGC列表页] 分享帖子：', postId);

    var result = teaPairing.shareUgcPost(postId);
    if (result && result.success) {
      var posts = this.data.posts.map(function(p) {
        if (p.postId === postId) {
          return result.post;
        }
        return p;
      });
      this.setData({ posts: posts });
    }

    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },

  /**
   * 点击帖子卡片 - 预览大图
   */
  onPostTap: function(e) {
    var postId = e.currentTarget.dataset.postid;
    if (!postId) return;

    var post = null;
    for (var i = 0; i < this.data.posts.length; i++) {
      if (this.data.posts[i].postId === postId) {
        post = this.data.posts[i];
        break;
      }
    }

    if (post && post.images && post.images.length > 0) {
      wx.previewImage({
        urls: post.images,
        current: post.images[0]
      });
    }
  },

  /**
   * 跳转发布页
   */
  onGoUpload: function() {
    console.log('[UGC列表页] 跳转到发布页');
    wx.navigateTo({
      url: '/pages/ugc/upload',
      fail: function(err) {
        console.error('[UGC列表页] 跳转失败：', err);
        wx.showToast({ title: '页面跳转失败', icon: 'none' });
      }
    });
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh: function() {
    console.log('[UGC列表页] 下拉刷新');
    var that = this;
    this.loadPosts();
    setTimeout(function() {
      wx.stopPullDownRefresh();
      wx.showToast({ title: '刷新成功', icon: 'success', duration: 1000 });
    }, 500);
  },

  /**
   * 页面分享
   */
  onShareAppMessage: function() {
    return {
      title: '桂花茶搭配社区 - 看看茶友们的搭配心得',
      path: '/pages/ugc/list',
      imageUrl: ''
    };
  },

  onShareTimeline: function() {
    return {
      title: '桂花茶搭配社区',
      query: ''
    };
  }
});
