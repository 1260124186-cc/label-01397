/**
 * 桂花茶溯源小程序 - 批次查询结果页
 * 功能：展示同一批次下的所有SKU列表
 * 页面路径：pages/batchList/batchList
 */

const mockData = require('../../utils/mockData.js');

Page({
  data: {
    batchNo: '',
    skuList: [],
    loading: true,
    empty: false
  },

  onLoad: function(options) {
    console.log('批次查询页加载，参数：', options);
    
    const batchNo = options.batchNo;
    
    if (batchNo) {
      this.setData({ batchNo: batchNo.toUpperCase() });
      this.loadBatchSkus(batchNo);
    } else {
      wx.showToast({
        title: '参数错误',
        icon: 'none'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }
  },

  loadBatchSkus: function(batchNo) {
    const that = this;
    
    wx.showLoading({
      title: '加载批次信息...',
      mask: true
    });
    
    setTimeout(() => {
      wx.hideLoading();
      
      const skus = mockData.getBatchSkus(batchNo);
      
      if (skus && skus.length > 0) {
        that.setData({
          skuList: skus,
          loading: false,
          empty: false
        });
        
        wx.setNavigationBarTitle({
          title: `批次 ${batchNo.toUpperCase()}`
        });
      } else {
        that.setData({
          skuList: [],
          loading: false,
          empty: true
        });
      }
    }, 600);
  },

  viewSkuDetail: function(e) {
    const traceId = e.currentTarget.dataset.traceid;
    
    wx.navigateTo({
      url: `/pages/detail/detail?traceId=${traceId}`,
      success: function() {
        console.log('跳转详情页成功');
      },
      fail: function(err) {
        console.error('跳转失败：', err);
        wx.showToast({
          title: '页面跳转失败',
          icon: 'none'
        });
      }
    });
  },

  goBack: function() {
    wx.navigateBack();
  },

  goCompare: function() {
    wx.navigateTo({
      url: '/pages/compare/index?batchNo=' + this.data.batchNo
    });
  }
});
