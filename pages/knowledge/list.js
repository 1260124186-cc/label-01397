var mockData = require('../../utils/mockData.js');
var userStore = require('../../utils/userStore.js');

Page({
  data: {
    categories: [],
    currentCategoryKey: 'all',
    sortBy: 'newest',
    articles: [],
    loading: true,
    noMore: false,
    page: 1,
    pageSize: 10,
    searchKeyword: ''
  },

  onLoad: function(options) {
    var that = this;
    if (options && options.categoryKey) {
      this.setData({ currentCategoryKey: options.categoryKey });
    }
    this.loadCategories();
    this.loadArticles(true);
  },

  onShow: function() {
    if (this.data.articles.length > 0) {
      this.refreshArticleStats();
    }
  },

  loadCategories: function() {
    var allCats = mockData.getKnowledgeCategories();
    var categories = [{
      key: 'all',
      name: '全部',
      icon: '📚',
      color: '#8B7355'
    }].concat(allCats);
    this.setData({ categories: categories });
  },

  loadArticles: function(reset) {
    var that = this;
    if (reset) {
      this.setData({ page: 1, noMore: false, loading: true });
    }
    var params = {
      categoryKey: this.data.currentCategoryKey === 'all' ? null : this.data.currentCategoryKey,
      sortBy: this.data.sortBy,
      keyword: this.data.searchKeyword || null
    };
    var all = mockData.getKnowledgeArticles(params);
    var start = (this.data.page - 1) * this.data.pageSize;
    var end = start + this.data.pageSize;
    var pageList = all.slice(start, end);
    var decoratedList = this.decorateArticles(pageList);
    var mergedList = reset ? decoratedList : this.data.articles.concat(decoratedList);
    setTimeout(function() {
      that.setData({
        articles: mergedList,
        loading: false,
        noMore: end >= all.length
      });
      if (reset) {
        wx.stopPullDownRefresh();
      }
    }, reset ? 300 : 100);
  },

  decorateArticles: function(list) {
    var that = this;
    return list.map(function(art) {
      return {
        id: art.id,
        categoryKey: art.categoryKey,
        title: art.title,
        subtitle: art.subtitle,
        coverImage: art.coverImage,
        author: art.author,
        publishTime: that.formatDate(art.publishTime),
        readCount: that.formatCount(art.readCount),
        likeCount: that.formatCount(art.likeCount),
        tags: art.tags || [],
        isFavorite: userStore.isKnowledgeFavorite(art.id)
      };
    });
  },

  refreshArticleStats: function() {
    var that = this;
    var updated = this.data.articles.map(function(art) {
      var fresh = mockData.getKnowledgeArticle(art.id);
      if (!fresh) return art;
      return {
        id: art.id,
        categoryKey: art.categoryKey,
        title: fresh.title,
        subtitle: fresh.subtitle,
        coverImage: fresh.coverImage,
        author: fresh.author,
        publishTime: that.formatDate(fresh.publishTime),
        readCount: that.formatCount(fresh.readCount),
        likeCount: that.formatCount(fresh.likeCount),
        tags: fresh.tags || [],
        isFavorite: userStore.isKnowledgeFavorite(art.id)
      };
    });
    this.setData({ articles: updated });
  },

  formatDate: function(ts) {
    if (!ts) return '';
    var d = new Date(ts);
    var now = Date.now();
    var diff = (now - ts) / 1000;
    if (diff < 86400) return '今天';
    if (diff < 86400 * 3) return parseInt(diff / 86400) + '天前';
    if (diff < 86400 * 30) return parseInt(diff / 86400) + '天前';
    return d.getFullYear() + '-' + (d.getMonth() + 1 < 10 ? '0' : '') + (d.getMonth() + 1) + '-' + (d.getDate() < 10 ? '0' : '') + d.getDate();
  },

  formatCount: function(n) {
    if (!n) return '0';
    if (n >= 10000) return (n / 10000).toFixed(1) + 'w';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
    return n.toString();
  },

  onCategoryTap: function(e) {
    var key = e.currentTarget.dataset.key;
    if (key === this.data.currentCategoryKey) return;
    this.setData({ currentCategoryKey: key });
    this.loadArticles(true);
    wx.pageScrollTo({ scrollTop: 0, duration: 200 });
  },

  onSortChange: function(e) {
    var sort = e.currentTarget.dataset.sort;
    if (sort === this.data.sortBy) return;
    this.setData({ sortBy: sort });
    this.loadArticles(true);
  },

  onSearchInput: function(e) {
    this.setData({ searchKeyword: e.detail.value });
  },

  onSearchConfirm: function() {
    this.loadArticles(true);
  },

  onSearchClear: function() {
    this.setData({ searchKeyword: '' });
    this.loadArticles(true);
  },

  onArticleTap: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/knowledge/detail?id=' + id
    });
  },

  onFavoriteToggle: function(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var fullArticle = mockData.getKnowledgeArticle(id);
    if (!fullArticle) return;
    if (userStore.isKnowledgeFavorite(id)) {
      userStore.removeKnowledgeFavorite(id);
      wx.showToast({ title: '已取消收藏', icon: 'none', duration: 1200 });
    } else {
      userStore.addKnowledgeFavorite(fullArticle);
      wx.showToast({ title: '已加入收藏', icon: 'success', duration: 1200 });
    }
    var updated = this.data.articles.map(function(art) {
      if (art.id === id) {
        return Object.assign({}, art, { isFavorite: userStore.isKnowledgeFavorite(id) });
      }
      return art;
    });
    this.setData({ articles: updated });
  },

  onPullDownRefresh: function() {
    this.loadArticles(true);
  },

  onReachBottom: function() {
    if (this.data.loading || this.data.noMore) return;
    this.setData({ page: this.data.page + 1 });
    this.loadArticles(false);
  },

  onShareAppMessage: function() {
    return {
      title: '桂花红茶茶文化知识库',
      path: '/pages/knowledge/list',
      imageUrl: ''
    };
  }
});
