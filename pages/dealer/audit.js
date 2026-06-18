const dealerAuth = require('../../utils/dealerAuth.js');
const dealerAudit = require('../../utils/dealerAudit.js');
const dealerSession = require('../../utils/dealerSession.js');

Page({
  data: {
    logs: [],
    stats: null,
    keyword: '',
    actionFilter: '',
    actionOptions: [
      { value: '', label: '全部操作' },
      { value: 'login', label: '登录' },
      { value: 'logout', label: '退出' },
      { value: 'stockIn', label: '入库' },
      { value: 'stockOut', label: '出库' },
      { value: 'scanCode', label: '扫码' },
      { value: 'resolveAlert', label: '处理告警' },
      { value: 'exportAudit', label: '导出日志' }
    ],
    showFilter: false,
    loading: false
  },

  onLoad: function() {
    if (!dealerAuth.isDealerLoggedIn()) {
      wx.redirectTo({ url: '/pages/dealer/login' });
      return;
    }
    if (!dealerAuth.hasPermission('viewAudit')) {
      wx.showToast({ title: '无查看权限', icon: 'none' });
      setTimeout(function() { wx.navigateBack(); }, 1000);
      return;
    }
    dealerAudit.addAuditLog(dealerAudit.ACTION_VIEW_AUDIT, {});
    this.loadData();
  },

  onShow: function() {
    dealerSession.updateActivity();
    getApp().touchDealerSession();
  },

  loadData: function() {
    var app = getApp();
    app.touchDealerSession();
    var stats = dealerAudit.getAuditStats();
    var logs = dealerAudit.queryAuditLogs({
      keyword: this.data.keyword || undefined,
      action: this.data.actionFilter || undefined
    });
    this.setData({ logs: logs, stats: stats });
  },

  onKeywordInput: function(e) {
    this.setData({ keyword: e.detail.value });
  },

  doSearch: function() {
    this.loadData();
  },

  toggleFilter: function() {
    this.setData({ showFilter: !this.data.showFilter });
  },

  selectAction: function(e) {
    var value = e.currentTarget.dataset.value;
    this.setData({ actionFilter: value, showFilter: false });
    this.loadData();
  },

  viewLogDetail: function(e) {
    var id = e.currentTarget.dataset.id;
    var log = this.data.logs.find(function(l) { return l.id === id; });
    if (!log) return;

    var details = log.details || {};
    var detailLines = [];
    if (details.code) detailLines.push('溯源码：' + details.code);
    if (details.productName) detailLines.push('产品：' + details.productName);
    if (details.quantity) detailLines.push('数量：' + details.quantity);
    if (details.traceId) detailLines.push('溯源ID：' + details.traceId);
    if (details.reason) detailLines.push('原因：' + details.reason);
    if (details.remark) detailLines.push('备注：' + details.remark);

    var deviceStr = '';
    if (log.device) {
      deviceStr = [log.device.platform, log.device.system, log.device.model].filter(Boolean).join(' / ');
    }

    wx.showModal({
      title: log.actionLabel + ' 详情',
      content: [
        '操作人：' + log.userName + '（' + log.userRoleLabel + '）',
        '所属经销商：' + log.dealerName,
        '操作时间：' + log.timestampStr,
        detailLines.length ? detailLines.join('\n') : '',
        deviceStr ? '设备：' + deviceStr : '',
        log.network && log.network.networkType ? '网络：' + log.network.networkType : '',
        log.ip ? 'IP：' + log.ip : ''
      ].filter(Boolean).join('\n'),
      showCancel: false,
      confirmText: '关闭'
    });
  },

  exportLogs: function() {
    var that = this;
    if (!dealerAuth.requirePermission('exportAudit')) return;

    wx.showModal({
      title: '导出审计日志',
      content: '将导出 ' + this.data.logs.length + ' 条日志记录为CSV文件，是否继续？',
      success: function(res) {
        if (!res.confirm) return;

        that.setData({ loading: true });
        var result = dealerAudit.exportAuditLogs({
          keyword: that.data.keyword || undefined,
          action: that.data.actionFilter || undefined
        });

        if (!result.success) {
          that.setData({ loading: false });
          wx.showToast({ title: '导出失败', icon: 'none' });
          return;
        }

        dealerAudit.saveExportFile(result.csv, result.filename)
          .then(function(saveRes) {
            that.setData({ loading: false });
            dealerAudit.addAuditLog(dealerAudit.ACTION_EXPORT_AUDIT, {
              count: result.count,
              filename: result.filename
            });

            wx.showModal({
              title: '导出成功',
              content: '共导出 ' + result.count + ' 条日志\n文件已保存至：' + saveRes.filePath,
              confirmText: '打开',
              cancelText: '关闭',
              success: function(openRes) {
                if (openRes.confirm) {
                  wx.openDocument({
                    filePath: saveRes.filePath,
                    fileType: 'csv',
                    showMenu: true,
                    fail: function(err) {
                      wx.showToast({ title: '打开失败，请手动查看', icon: 'none' });
                    }
                  });
                }
              }
            });
          })
          .catch(function() {
            that.setData({ loading: false });
            wx.showToast({ title: '保存文件失败', icon: 'none' });
          });
      }
    });
  },

  goBack: function() {
    wx.navigateBack();
  }
});
