var mockData = require('../../utils/mockData.js');
var userStore = require('../../utils/userStore.js');
var shareUtil = require('../../utils/share.js');

Page({
  data: {
    article: null,
    contentNodes: [],
    categoryName: '',
    isFavorite: false,
    isLiked: false,
    relatedArticles: [],
    relatedProducts: [],
    loading: true,
    readCount: 0,
    likeCount: 0,
    safeAreaBottom: 0
  },

  onLoad: function(options) {
    var that = this;
    var articleId = '';
    if (options && options.id) {
      articleId = options.id;
    } else if (options && options.variety) {
      var varietyName = decodeURIComponent(options.variety);
      var found = mockData.getKnowledgeArticleByVariety(varietyName);
      if (found) articleId = found.id;
    }

    try {
      var sysInfo = wx.getSystemInfoSync();
      this.setData({ safeAreaBottom: sysInfo.safeAreaInsets ? sysInfo.safeAreaInsets.bottom : 0 });
    } catch (e) {}

    if (!articleId) {
      this.setData({ loading: false });
      wx.showToast({ title: '文章不存在', icon: 'none' });
      return;
    }

    this.loadArticle(articleId);
  },

  loadArticle: function(id) {
    var that = this;
    var article = mockData.getKnowledgeArticle(id);
    if (!article) {
      this.setData({ loading: false });
      wx.showToast({ title: '文章不存在', icon: 'none' });
      return;
    }

    mockData.incrementKnowledgeReadCount(id);
    var fresh = mockData.getKnowledgeArticle(id);
    var allCats = mockData.getKnowledgeCategories();
    var matchedCat = allCats.find(function(c) { return c.key === fresh.categoryKey; });
    var catName = matchedCat ? matchedCat.name : '';

    var relatedArticles = [];
    if (fresh.relatedTraceIds && fresh.relatedTraceIds.length > 0) {
      var traceId = fresh.relatedTraceIds[0];
      relatedArticles = mockData.getRelatedKnowledgeArticles(traceId, 3).filter(function(a) {
        return a.id !== id;
      }).slice(0, 3);
    }
    if (relatedArticles.length === 0) {
      relatedArticles = mockData.getKnowledgeArticles({ categoryKey: fresh.categoryKey })
        .filter(function(a) { return a.id !== id; })
        .slice(0, 3);
    }

    var decoratedRelated = relatedArticles.map(function(art) {
      return {
        id: art.id,
        title: art.title,
        subtitle: art.subtitle,
        coverImage: art.coverImage,
        readCount: that.formatCount(art.readCount),
        categoryKey: art.categoryKey
      };
    });

    var relatedProducts = [];
    if (fresh.relatedTraceIds && fresh.relatedTraceIds.length > 0) {
      fresh.relatedTraceIds.forEach(function(tid) {
        var p = mockData.getProduct(tid);
        if (p) {
          relatedProducts.push({
            id: p.id,
            name: p.name,
            image: p.images && p.images[0] ? p.images[0] : '',
            price: p.price,
            variety: p.osmanthusInfo && p.osmanthusInfo.variety ? p.osmanthusInfo.variety : ''
          });
        }
      });
    }

    wx.setNavigationBarTitle({ title: fresh.title.length > 12 ? fresh.title.slice(0, 12) + '...' : fresh.title });

    setTimeout(function() {
      that.setData({
        article: fresh,
        contentNodes: fresh.content || [],
        categoryName: catName,
        isFavorite: userStore.isKnowledgeFavorite(id),
        isLiked: false,
        relatedArticles: decoratedRelated,
        relatedProducts: relatedProducts,
        loading: false,
        readCount: that.formatCount(fresh.readCount),
        likeCount: that.formatCount(fresh.likeCount)
      });
    }, 200);
  },

  formatDate: function(ts) {
    if (!ts) return '';
    var d = new Date(ts);
    return d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日';
  },

  formatCount: function(n) {
    if (!n) return '0';
    if (n >= 10000) return (n / 10000).toFixed(1) + 'w';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
    return n.toString();
  },

  onFavoriteTap: function() {
    var that = this;
    if (!this.data.article) return;
    if (this.data.isFavorite) {
      userStore.removeKnowledgeFavorite(this.data.article.id);
      this.setData({ isFavorite: false });
      wx.showToast({ title: '已取消收藏', icon: 'none', duration: 1200 });
    } else {
      userStore.addKnowledgeFavorite(this.data.article);
      this.setData({ isFavorite: true });
      wx.showToast({ title: '已加入收藏', icon: 'success', duration: 1200 });
    }
  },

  onLikeTap: function() {
    var that = this;
    if (!this.data.article) return;
    if (this.data.isLiked) {
      wx.showToast({ title: '您已点赞', icon: 'none' });
      return;
    }
    mockData.incrementKnowledgeLikeCount(this.data.article.id);
    var fresh = mockData.getKnowledgeArticle(this.data.article.id);
    this.setData({
      isLiked: true,
      likeCount: this.formatCount(fresh.likeCount)
    });
    wx.showToast({ title: '谢谢点赞', icon: 'success' });
  },

  onShareTap: function() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
    wx.showToast({
      title: '点击右上角分享',
      icon: 'none',
      duration: 1500
    });
  },

  onGenerateShareCard: function() {
    var that = this;
    if (!this.data.article) return;
    wx.showLoading({ title: '生成中...', mask: true });
    var shareInfo = {
      title: this.data.article.title,
      subtitle: this.data.article.subtitle,
      image: this.data.article.coverImage,
      tag: this.data.categoryName
    };
    setTimeout(function() {
      wx.hideLoading();
      wx.previewImage({
        urls: [that.data.article.coverImage],
        current: that.data.article.coverImage,
        fail: function() {
          wx.showToast({ title: '长按图片可保存分享', icon: 'none' });
        }
      });
    }, 800);
  },

  onRelatedArticleTap: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.redirectTo({
      url: '/pages/knowledge/detail?id=' + id
    });
  },

  onProductTap: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + id
    });
  },

  onImagePreview: function(e) {
    var src = e.currentTarget.dataset.src;
    if (!src) return;
    var imageUrls = [];
    this.data.contentNodes.forEach(function(node) {
      if (node.type === 'image' && node.src) {
        imageUrls.push(node.src);
      }
    });
    wx.previewImage({
      current: src,
      urls: imageUrls.length > 0 ? imageUrls : [src]
    });
  },

  onShareAppMessage: function() {
    var art = this.data.article;
    return {
      title: art ? '【' + this.data.categoryName + '】' + art.title : '茶文化知识库',
      path: art ? '/pages/knowledge/detail?id=' + art.id : '/pages/knowledge/list',
      imageUrl: art ? art.coverImage : ''
    };
  },

  onShareTimeline: function() {
    var art = this.data.article;
    return {
      title: art ? '【' + this.data.categoryName + '】' + art.title : '茶文化知识库',
      query: art ? 'id=' + art.id : '',
      imageUrl: art ? art.coverImage : ''
    };
  },

  onPullDownRefresh: function() {
    if (this.data.article) {
      this.loadArticle(this.data.article.id);
    }
    wx.stopPullDownRefresh();
  }
});
