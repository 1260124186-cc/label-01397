const govTrace = require('../../utils/govTrace.js');
const mockData = require('../../utils/mockData.js');

Page({
  data: {
    inputCode: '',
    loading: false,
    queryResult: null,
    queryError: null,
    showHistory: true,
    historyList: [],
    apiAvailable: true,
    apiStatusMessage: '',
    sampleCodes: [
      { label: '省级追溯码（正常）', code: 'HB20250925GH202503857201', status: 'approved' },
      { label: '省级追溯码（预警）', code: 'HB20250930GH202504129567', status: 'warning' },
      { label: '国家追溯码（正常）', code: 'NA20250925GH202503462189', status: 'approved' },
      { label: '国家追溯码（预警）', code: 'NA20250930GH202504782305', status: 'warning' }
    ],
    expandProvince: true,
    expandNational: true,
    expandInspections: false
  },

  onLoad: function(options) {
    console.log('[govTrace/verify] 页面加载');

    if (options && options.code) {
      this.setData({ inputCode: options.code });
      this.queryByCode();
    }

    this.checkApiStatus();
    this.loadHistory();
  },

  onPullDownRefresh: function() {
    this.checkApiStatus();
    wx.stopPullDownRefresh();
  },

  checkApiStatus: function() {
    const available = govTrace.isApiAvailable();
    this.setData({
      apiAvailable: available,
      apiStatusMessage: available ? '平台接口连接正常' : '平台接口暂不可用，将启用降级模式'
    });
  },

  onCodeInput: function(e) {
    this.setData({
      inputCode: e.detail.value,
      queryResult: null,
      queryError: null
    });
  },

  clearInput: function() {
    this.setData({
      inputCode: '',
      queryResult: null,
      queryError: null
    });
  },

  useSampleCode: function(e) {
    const code = e.currentTarget.dataset.code;
    if (code) {
      this.setData({ inputCode: code }, function() {
        this.queryByCode();
      });
    }
  },

  scanGovCode: function() {
    var that = this;
    wx.scanCode({
      onlyFromCamera: false,
      scanType: ['qrCode', 'barCode'],
      success: function(res) {
        console.log('[govTrace/verify] 扫码结果:', res);
        var code = res.result || '';

        if (res.scanType === 'QR_CODE' || res.scanType === 'qrCode') {
          try {
            if (code.indexOf('?') > -1) {
              var params = code.split('?')[1];
              var pairs = params.split('&');
              for (var i = 0; i < pairs.length; i++) {
                var kv = pairs[i].split('=');
                if (kv[0] === 'code' || kv[0] === 'govCode' || kv[0] === 'traceCode') {
                  code = decodeURIComponent(kv[1]);
                  break;
                }
              }
            }
          } catch (e) {
            console.warn('[govTrace/verify] 解析二维码参数失败:', e);
          }
        }

        that.setData({ inputCode: code }, function() {
          that.queryByCode();
        });
      },
      fail: function(err) {
        console.error('[govTrace/verify] 扫码失败:', err);
        if (err.errMsg && err.errMsg.indexOf('cancel') === -1) {
          wx.showToast({ title: '扫码失败，请手动输入', icon: 'none' });
        }
      }
    });
  },

  async queryByCode() {
    var that = this;
    var code = this.data.inputCode.trim();

    if (!code) {
      wx.showToast({ title: '请输入或扫描追溯码', icon: 'none' });
      return;
    }

    if (!govTrace.verifyGovCodeFormat(code)) {
      this.setData({
        queryError: '追溯码格式不正确，省级追溯码以HB开头，国家追溯码以NA开头',
        queryResult: null
      });
      return;
    }

    this.setData({
      loading: true,
      queryResult: null,
      queryError: null
    });

    wx.showLoading({ title: '政府平台验证中...', mask: true });

    try {
      var result = await govTrace.queryGovTraceByGovCode(code);
      wx.hideLoading();

      if (result.success && result.data) {
        this.saveHistory(code, result.data);

        var traceData = mockData.getTraceData(result.data.traceId);
        result.data.brandInfo = traceData ? traceData.basicInfo : null;

        this.setData({
          queryResult: result.data,
          loading: false
        });

        wx.showToast({ title: '验证成功', icon: 'success' });
      } else {
        this.setData({
          queryError: result.message || '未找到对应追溯信息',
          loading: false
        });
        wx.showToast({ title: '验证失败', icon: 'none' });
      }
    } catch (err) {
      wx.hideLoading();
      console.error('[govTrace/verify] 查询异常:', err);
      this.setData({
        queryError: '查询过程出现异常，请稍后重试',
        loading: false
      });
    }
  },

  loadHistory: function() {
    try {
      var history = wx.getStorageSync('gov_trace_query_history') || [];
      this.setData({ historyList: history.slice(0, 20) });
    } catch (e) {
      console.error('[govTrace/verify] 加载历史记录失败:', e);
    }
  },

  saveHistory: function(code, data) {
    try {
      var history = wx.getStorageSync('gov_trace_query_history') || [];
      history = history.filter(function(item) {
        return item.code !== code;
      });

      history.unshift({
        code: code,
        batchNo: data.batchNo || '',
        productName: (data.brandInfo && data.brandInfo.productName) || '',
        filingStatus: (data.province && data.province.filingStatus) ||
                      (data.national && data.national.filingStatus) || 'unknown',
        timestamp: Date.now()
      });

      if (history.length > 50) {
        history = history.slice(0, 50);
      }

      wx.setStorageSync('gov_trace_query_history', history);
      this.setData({ historyList: history.slice(0, 20) });
    } catch (e) {
      console.error('[govTrace/verify] 保存历史记录失败:', e);
    }
  },

  useHistoryCode: function(e) {
    var code = e.currentTarget.dataset.code;
    if (code) {
      this.setData({ inputCode: code }, function() {
        this.queryByCode();
      });
    }
  },

  clearHistory: function() {
    var that = this;
    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有查询历史记录吗？',
      success: function(res) {
        if (res.confirm) {
          wx.setStorageSync('gov_trace_query_history', []);
          that.setData({ historyList: [] });
          wx.showToast({ title: '已清空', icon: 'success' });
        }
      }
    });
  },

  toggleHistory: function() {
    this.setData({ showHistory: !this.data.showHistory });
  },

  goToBrandTrace: function() {
    var result = this.data.queryResult;
    if (!result || !result.traceId) return;

    wx.navigateTo({
      url: '/pages/scanResult/scanResult?traceId=' + result.traceId + '&scanType=govCode',
      fail: function(err) {
        console.error('[govTrace/verify] 跳转品牌溯源失败:', err);
        wx.showToast({ title: '跳转失败', icon: 'none' });
      }
    });
  },

  openOfficialVerify: function(e) {
    var level = e.currentTarget.dataset.level;
    var result = this.data.queryResult;
    if (!result) return;

    var url = '';
    if (level === 'province' && result.province) {
      url = result.province.verifyUrl;
    } else if (level === 'national' && result.national) {
      url = result.national.verifyUrl;
    }

    if (url) {
      wx.navigateTo({
        url: '/pages/webview/webview?url=' + encodeURIComponent(url) +
             '&title=' + encodeURIComponent(level === 'province' ? '省级平台验证' : '国家平台验证'),
        fail: function() {
          wx.setClipboardData({
            data: url,
            success: function() {
              wx.showToast({ title: '链接已复制，请在浏览器打开', icon: 'none' });
            }
          });
        }
      });
    }
  },

  copyCode: function(e) {
    var code = e.currentTarget.dataset.code;
    if (code) {
      wx.setClipboardData({
        data: code,
        success: function() {
          wx.showToast({ title: '追溯码已复制', icon: 'success' });
        }
      });
    }
  },

  toggleProvince: function() {
    this.setData({ expandProvince: !this.data.expandProvince });
  },

  toggleNational: function() {
    this.setData({ expandNational: !this.data.expandNational });
  },

  toggleInspections: function() {
    this.setData({ expandInspections: !this.data.expandInspections });
  },

  getStatusLabel: function(status) {
    var labels = govTrace.GOV_PLATFORM_STATUS_LABEL || {};
    return labels[status] || status;
  },

  getStatusColor: function(status) {
    var colors = govTrace.GOV_PLATFORM_STATUS_COLOR || {};
    return colors[status] || '#999999';
  },

  formatHistoryTime: function(timestamp) {
    if (!timestamp) return '';
    var date = new Date(timestamp);
    var now = new Date();
    var diffMin = Math.floor((now.getTime() - timestamp) / 60000);

    if (diffMin < 1) return '刚刚';
    if (diffMin < 60) return diffMin + '分钟前';
    if (diffMin < 1440) return Math.floor(diffMin / 60) + '小时前';
    return (date.getMonth() + 1) + '月' + date.getDate() + '日';
  },

  syncPlatformStatus: async function() {
    wx.showLoading({ title: '同步平台状态...', mask: true });
    try {
      var result = await govTrace.syncPlatformStatusUpdates();
      wx.hideLoading();
      if (result.success) {
        wx.showToast({
          title: '同步完成，更新' + result.updatedCount + '条',
          icon: 'success'
        });
      } else {
        wx.showToast({ title: result.message || '同步失败', icon: 'none' });
      }
    } catch (e) {
      wx.hideLoading();
      console.error('[govTrace/verify] 同步失败:', e);
      wx.showToast({ title: '同步失败', icon: 'none' });
    }
  }
});
