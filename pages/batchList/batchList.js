/**
 * 桂花茶溯源小程序 - 批次查询结果页
 * 功能：展示同一批次下的所有SKU列表
 * 页面路径：pages/batchList/batchList
 */

const mockData = require('../../utils/mockData.js');
const traceExport = require('../../utils/traceExport.js');
const userStore = require('../../utils/userStore.js');

Page({
  data: {
    batchNo: '',
    skuList: [],
    skuListWithState: [],
    loading: true,
    empty: false,
    selectMode: false,
    selectedIds: [],
    showExportModal: false,
    exportFormat: traceExport.EXPORT_FORMAT.JSON,
    exportScope: traceExport.EXPORT_SCOPE.FULL,
    exportFormats: [
      { key: traceExport.EXPORT_FORMAT.JSON, title: 'JSON 数据', desc: '结构化数据，便于系统对接' },
      { key: traceExport.EXPORT_FORMAT.PDF, title: 'PDF 报告', desc: '小程序环境为文本报告，PC端可转换' },
      { key: traceExport.EXPORT_FORMAT.ZIP, title: 'ZIP 数据包', desc: '含多份数据与清单' }
    ],
    exportScopes: [
      { key: traceExport.EXPORT_SCOPE.TEST_ONLY, title: '仅检测报告', desc: '农药残留检测数据' },
      { key: traceExport.EXPORT_SCOPE.GREEN_ONLY, title: '仅绿色溯源', desc: '种植/采摘/窨制溯源' },
      { key: traceExport.EXPORT_SCOPE.FULL, title: '完整数据包', desc: '批次+检测+渠道+区块链全部' }
    ],
    exporting: false,
    exportWatermarkInfo: null
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
        var skuListWithState = skus.map(function(s) {
          s._selected = false;
          return s;
        });
        that.setData({
          skuList: skus,
          skuListWithState: skuListWithState,
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
  },

  toggleSelectMode: function() {
    const selectMode = !this.data.selectMode;
    var skuListWithState;
    if (selectMode) {
      skuListWithState = this.data.skuList.map(function(s) {
        s._selected = false;
        return s;
      });
    } else {
      skuListWithState = this.data.skuListWithState;
    }
    this.setData({
      selectMode: selectMode,
      selectedIds: selectMode ? [] : [],
      skuListWithState: skuListWithState
    });
  },

  toggleSelectItem: function(e) {
    const traceId = e.currentTarget.dataset.traceid;
    const selectedIds = this.data.selectedIds.slice();
    const idx = selectedIds.indexOf(traceId);
    if (idx >= 0) {
      selectedIds.splice(idx, 1);
    } else {
      selectedIds.push(traceId);
    }
    var skuListWithState = this.data.skuList.map(function(s) {
      s._selected = selectedIds.indexOf(s.traceId) >= 0;
      return s;
    });
    this.setData({ selectedIds: selectedIds, skuListWithState: skuListWithState });
  },

  selectAll: function() {
    var newSelectedIds;
    if (this.data.selectedIds.length === this.data.skuList.length) {
      newSelectedIds = [];
    } else {
      newSelectedIds = this.data.skuList.map(s => s.traceId);
    }
    var skuListWithState = this.data.skuList.map(function(s) {
      s._selected = newSelectedIds.indexOf(s.traceId) >= 0;
      return s;
    });
    this.setData({ selectedIds: newSelectedIds, skuListWithState: skuListWithState });
  },

  openBatchExport: function() {
    if (this.data.selectedIds.length === 0) {
      wx.showToast({ title: '请先勾选要导出的溯源', icon: 'none' });
      return;
    }
    const userInfo = userStore.getUserInfo() || {};
    const now = new Date();
    const pad = n => (n < 10 ? '0' + n : '' + n);
    const watermark = {
      exporter: userInfo.nickname || userInfo.phone || '企业采购用户',
      exportTime: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`,
      system: '桂花茶绿色溯源平台 · 企业采购端',
      version: 'v1.0.0',
      disclaimer: '本数据仅供企业采购内部使用，未经授权不得外传'
    };
    this.setData({
      showExportModal: true,
      exportWatermarkInfo: watermark
    });
  },

  closeExportModal: function() {
    this.setData({ showExportModal: false });
  },

  selectExportFormat: function(e) {
    this.setData({ exportFormat: e.currentTarget.dataset.key });
  },

  selectExportScope: function(e) {
    this.setData({ exportScope: e.currentTarget.dataset.key });
  },

  doBatchExport: function() {
    if (this.data.exporting) return;
    const traceIds = this.data.selectedIds;
    if (traceIds.length === 0) {
      wx.showToast({ title: '请先勾选', icon: 'none' });
      return;
    }
    this.setData({ exporting: true });
    const that = this;
    traceExport.doExport(traceIds, this.data.exportFormat, this.data.exportScope)
      .then(result => {
        var resetSkuList = that.data.skuList.map(function(s) {
          s._selected = false;
          return s;
        });
        that.setData({ exporting: false, showExportModal: false, selectMode: false, selectedIds: [], skuListWithState: resetSkuList });
        wx.showModal({
          title: '导出成功',
          content: `已导出 ${traceIds.length} 条溯源数据\n文件：${result.fileName}\n${result.format === 'PDF' ? '小程序环境以文本报告导出，可在PC端转换为PDF' : ''}${result.format === 'ZIP' ? '小程序环境以JSON Bundle导出，含清单与多份数据' : ''}`,
          confirmText: '打开文件',
          cancelText: '知道了',
          success(res) {
            if (res.confirm) {
              traceExport.openExportedFile(result.filePath, result.fileName);
            }
          }
        });
      })
      .catch(err => {
        that.setData({ exporting: false });
        console.error('批量导出失败：', err);
        wx.showToast({ title: err.message || '导出失败', icon: 'none' });
      });
  }
});
