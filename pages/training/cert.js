const dealerAuth = require('../../utils/dealerAuth.js');
const dealerTraining = require('../../utils/dealerTraining.js');

Page({
  data: {
    courseId: '',
    certificate: null,
    course: null,
    allCertificates: []
  },

  onLoad: function(options) {
    if (!dealerAuth.isDealerLoggedIn()) {
      wx.redirectTo({ url: '/pages/dealer/login' });
      return;
    }
    if (!dealerAuth.hasPermission('viewTraining')) {
      wx.showToast({ title: '无培训权限', icon: 'none' });
      setTimeout(function() { wx.navigateBack(); }, 1000);
      return;
    }
    
    const courseId = options.courseId;
    this.setData({ courseId: courseId || '' });
    this.loadData();
  },

  onShow: function() {
    if (!dealerAuth.isDealerLoggedIn()) {
      wx.redirectTo({ url: '/pages/dealer/login' });
      return;
    }
    this.loadData();
  },

  loadData: function() {
    const allCerts = dealerTraining.getDealerCertificates();
    const decoratedCerts = allCerts.map(function(cert) {
      return {
        ...cert,
        categoryIcon: dealerTraining.CATEGORY_ICONS[cert.category],
        categoryColor: dealerTraining.CATEGORY_COLORS[cert.category]
      };
    });
    
    let certificate = null;
    let course = null;
    
    if (this.data.courseId) {
      certificate = dealerTraining.getCertificateByCourseId(this.data.courseId);
      if (certificate) {
        certificate = {
          ...certificate,
          categoryIcon: dealerTraining.CATEGORY_ICONS[certificate.category],
          categoryColor: dealerTraining.CATEGORY_COLORS[certificate.category]
        };
        course = dealerTraining.getCourseById(this.data.courseId);
      }
    } else if (decoratedCerts.length > 0) {
      certificate = decoratedCerts[0];
      course = dealerTraining.getCourseById(certificate.courseId);
    }
    
    if (certificate) {
      wx.setNavigationBarTitle({ title: '结业证书' });
    }
    
    this.setData({
      certificate: certificate,
      course: course,
      allCertificates: decoratedCerts
    });
  },

  onCertSelect: function(e) {
    const courseId = e.currentTarget.dataset.courseid;
    this.setData({ courseId: courseId });
    this.loadData();
  },

  onShare: function() {
    if (!this.data.certificate) return;
    
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
    
    wx.showToast({ title: '点击右上角分享', icon: 'none' });
  },

  onSaveImage: function() {
    wx.showToast({ title: '长按图片可保存到相册', icon: 'none' });
  },

  goBack: function() {
    wx.navigateBack();
  },

  goHome: function() {
    wx.redirectTo({ url: '/pages/training/index' });
  },

  onShareAppMessage: function() {
    const cert = this.data.certificate;
    if (!cert) {
      return {
        title: '经销商培训学院',
        path: '/pages/dealer/index'
      };
    }
    return {
      title: '我已获得《' + cert.courseName + '》结业证书',
      path: '/pages/dealer/index'
    };
  },

  onShareTimeline: function() {
    const cert = this.data.certificate;
    if (!cert) {
      return {
        title: '经销商培训学院'
      };
    }
    return {
      title: '我已获得《' + cert.courseName + '》结业证书'
    };
  }
});
