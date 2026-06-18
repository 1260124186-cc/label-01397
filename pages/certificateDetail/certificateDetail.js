var certWallet = require('../../utils/certificateWallet.js');
var share = require('../../utils/share.js');

Page({
  data: {
    cert: null,
    isLoading: true,
    typeLabel: '',
    typeIcon: '',
    typeColor: '',
    isVerifying: false,
    verifyResult: null,
    showExportCanvas: false
  },

  onLoad: function(options) {
    var certId = options.certId;
    if (!certId) {
      wx.showToast({ title: '参数错误', icon: 'none' });
      return;
    }
    this.loadCertificate(certId);
  },

  loadCertificate: function(certId) {
    var cert = certWallet.getCertificateById(certId);
    if (!cert) {
      wx.showToast({ title: '证书不存在', icon: 'none' });
      return;
    }
    var formatted = Object.assign({}, cert, {
      formatAddTime: certWallet.formatTime(cert.addTime),
      typeLabel: certWallet.formatType(cert.type),
      typeIcon: certWallet.formatTypeIcon(cert.type),
      typeColor: certWallet.formatTypeColor(cert.type)
    });

    this.setData({
      cert: formatted,
      typeLabel: formatted.typeLabel,
      typeIcon: formatted.typeIcon,
      typeColor: formatted.typeColor,
      isLoading: false
    });
  },

  onVerify: function() {
    if (this.data.isVerifying) return;
    var that = this;
    this.setData({ isVerifying: true, verifyResult: null });

    wx.showLoading({ title: '验真中...', mask: true });

    setTimeout(function() {
      wx.hideLoading();
      var cert = that.data.cert;
      var success = cert && cert.status !== 'pending';
      var result = {
        success: success,
        message: success ? '证书验真通过，信息真实有效' : '证书验证失败，请联系颁发机构',
        verifyTime: new Date().toLocaleString('zh-CN'),
        certNo: cert ? cert.certNo : '',
        issuer: cert ? cert.issuer : ''
      };
      that.setData({ isVerifying: false, verifyResult: result });
      wx.showModal({
        title: success ? '✅ 验真通过' : '❌ 验真失败',
        content: result.message + '\n\n验证时间：' + result.verifyTime,
        showCancel: false,
        confirmColor: success ? '#52C41A' : '#ff4d4f'
      });
    }, 1500);
  },

  onCopyCertNo: function() {
    var cert = this.data.cert;
    if (!cert || !cert.certNo) return;
    wx.setClipboardData({
      data: cert.certNo,
      success: function() {
        wx.showToast({ title: '编号已复制', icon: 'success' });
      }
    });
  },

  onOpenVerifyUrl: function() {
    var cert = this.data.cert;
    if (!cert || !cert.verifyUrl) {
      wx.showToast({ title: '暂无验真链接', icon: 'none' });
      return;
    }
    wx.navigateTo({
      url: '/pages/webview/webview?url=' + encodeURIComponent(cert.verifyUrl)
    });
  },

  onShare: function() {
    var cert = this.data.cert;
    if (!cert) return;
    wx.showActionSheet({
      itemList: ['生成分享卡片', '复制证书链接', '保存证书图片'],
      success: function(res) {
        if (res.tapIndex === 0) {
          wx.showToast({ title: '请点击右上角分享', icon: 'none' });
        } else if (res.tapIndex === 1) {
          var shareUrl = 'https://trace.example.com/cert/' + cert.certId;
          wx.setClipboardData({
            data: shareUrl,
            success: function() {
              wx.showToast({ title: '链接已复制', icon: 'success' });
            }
          });
        } else if (res.tapIndex === 2) {
          this.onExportPdf();
        }
      }.bind(this)
    });
  },

  onShareAppMessage: function() {
    var cert = this.data.cert;
    if (!cert) {
      return { title: '一茶一品·证书验真', path: '/pages/index/index' };
    }
    return {
      title: cert.title + ' - ' + cert.productName,
      path: '/pages/certificateDetail/certificateDetail?certId=' + cert.certId,
      imageUrl: cert.productImage || ''
    };
  },

  onExportPdf: function() {
    var cert = this.data.cert;
    if (!cert) return;
    var that = this;
    wx.showLoading({ title: '生成中...', mask: true });
    this.setData({ showExportCanvas: true });

    setTimeout(function() {
      var mockData = require('../../utils/mockData.js');
      var traceData = cert.rawData || mockData.getTraceData(cert.traceId);

      if (!traceData) {
        wx.hideLoading();
        that.setData({ showExportCanvas: false });
        wx.showToast({ title: '数据缺失', icon: 'none' });
        return;
      }

      share.drawTraceCertificate('exportCanvas', traceData, null, function(result) {
        wx.hideLoading();
        that.setData({ showExportCanvas: false });

        if (result.success) {
          share.saveImageToAlbum(result.tempFilePath, function(saveRes) {
            if (saveRes.success) {
              wx.showToast({ title: '已保存到相册', icon: 'success' });
            } else {
              wx.previewImage({
                urls: [result.tempFilePath],
                current: result.tempFilePath
              });
            }
          });
        } else {
          wx.showToast({ title: '生成失败，请重试', icon: 'none' });
        }
      });
    }, 300);
  },

  onPreviewImage: function(e) {
    var url = e.currentTarget.dataset.url;
    if (!url) return;
    wx.previewImage({ urls: [url], current: url });
  },

  onGoProductTrace: function() {
    var cert = this.data.cert;
    if (!cert || !cert.traceId) return;
    wx.navigateTo({
      url: '/pages/detail/detail?traceId=' + cert.traceId
    });
  },

  onRemoveCert: function() {
    var cert = this.data.cert;
    if (!cert) return;
    var that = this;
    wx.showModal({
      title: '删除证书',
      content: '确定从钱包中删除该证书吗？',
      confirmColor: '#ff4d4f',
      success: function(res) {
        if (res.confirm) {
          certWallet.removeCertificate(cert.certId);
          wx.showToast({ title: '已删除', icon: 'success', duration: 1200 });
          setTimeout(function() { wx.navigateBack(); }, 1200);
        }
      }
    });
  }
});
