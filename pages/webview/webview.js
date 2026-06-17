Page({
  data: {
    url: '',
    title: '区块浏览器'
  },

  onLoad: function(options) {
    if (options.url) {
      this.setData({
        url: decodeURIComponent(options.url),
        title: options.title || '区块浏览器'
      });
    }
    wx.setNavigationBarTitle({
      title: this.data.title
    });
  }
});
