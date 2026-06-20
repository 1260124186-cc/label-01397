const procurement = require('../../utils/procurement.js');

Page({
  data: {
    allBatches: [],
    selectedBatches: [],
    downloading: false,
    downloadResult: null,
    presetOptions: ['GH202503', 'GH202504', 'GH202505', 'GH202502']
  },

  onLoad: function(options) {
    if (!procurement.isProcurementLoggedIn()) {
      wx.redirectTo({ url: '/pages/procurement/login' });
      return;
    }
    const purchased = procurement.getPurchasedBatches();
    const allBatches = purchased.map(function(b) {
      return { batchNo: b.batchNo, productName: b.productName, selected: false };
    });
    this.setData({ allBatches: allBatches });

    if (options && options.batches) {
      const batchList = options.batches.split(',');
      const updated = allBatches.map(function(b) {
        return Object.assign({}, b, { selected: batchList.indexOf(b.batchNo) !== -1 });
      });
      this.setData({
        allBatches: updated,
        selectedBatches: batchList
      });
    }
  },

  toggleBatch: function(e) {
    const batchNo = e.currentTarget.dataset.batch;
    const updated = this.data.allBatches.map(function(b) {
      if (b.batchNo === batchNo) {
        return Object.assign({}, b, { selected: !b.selected });
      }
      return b;
    });
    const selected = updated.filter(function(b) { return b.selected; }).map(function(b) { return b.batchNo; });
    this.setData({ allBatches: updated, selectedBatches: selected });
  },

  selectPreset: function(e) {
    const batch = e.currentTarget.dataset.batch;
    const exists = this.data.allBatches.find(function(b) { return b.batchNo === batch; });
    let updated;
    if (exists) {
      updated = this.data.allBatches.map(function(b) {
        if (b.batchNo === batch) {
          return Object.assign({}, b, { selected: !b.selected });
        }
        return b;
      });
    } else {
      updated = this.data.allBatches.concat([{ batchNo: batch, productName: '外部批次', selected: true }]);
    }
    const selected = updated.filter(function(b) { return b.selected; }).map(function(b) { return b.batchNo; });
    this.setData({ allBatches: updated, selectedBatches: selected });
  },

  doDownload: function() {
    const that = this;
    if (this.data.selectedBatches.length === 0) {
      wx.showToast({ title: '请选择批次', icon: 'none' });
      return;
    }

    this.setData({ downloading: true, downloadResult: null });
    procurement.downloadReportPackage(this.data.selectedBatches)
      .then(function(res) {
        that.setData({
          downloading: false,
          downloadResult: res.data
        });
        wx.showToast({ title: '打包完成', icon: 'success' });
      })
      .catch(function(err) {
        that.setData({ downloading: false });
        wx.showToast({ title: err.msg || '下载失败', icon: 'none' });
      });
  },

  viewDocument: function(e) {
    const doc = e.currentTarget.dataset.doc;
    wx.showModal({
      title: doc.name,
      content: '文件大小：' + doc.size + '\n所属批次：' + doc.batchNo + '\n\n（小程序环境以文本预览形式展示，实际部署可调用文件下载API）',
      showCancel: false,
      confirmText: '预览'
    });
  }
});
