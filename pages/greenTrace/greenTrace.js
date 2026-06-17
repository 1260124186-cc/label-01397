var mockData = require('../../utils/mockData.js');
var greenPoints = require('../../utils/greenPoints.js');

Page({
  data: {
    traceId: '',
    productName: '',
    activeTab: 'certificate',
    tabs: [
      { key: 'certificate', label: '认证证书', icon: '📜' },
      { key: 'carbon', label: '碳足迹', icon: '🌍' },
      { key: 'recycling', label: '回收指引', icon: '♻️' },
      { key: 'points', label: '绿色积分', icon: '🌟' }
    ],
    certificates: [],
    carbonFootprint: null,
    recyclingGuide: null,
    showCertModal: false,
    selectedCert: null,
    showVerifyCertModal: false,
    certVerifyInput: '',
    certVerifyResult: null,
    certVerifying: false,
    greenPointsData: null,
    userLevel: null,
    pointsHistory: [],
    showPointsDetail: false,
    carbonChartData: null
  },

  onLoad: function(options) {
    var traceId = options.traceId;
    if (!traceId) {
      wx.showToast({ title: '参数错误', icon: 'none' });
      setTimeout(function() { wx.navigateBack(); }, 1500);
      return;
    }

    var traceData = mockData.getTraceData(traceId);
    var greenData = mockData.getGreenTraceExtended(traceId);

    if (!greenData) {
      wx.showToast({ title: '暂无绿色溯源数据', icon: 'none' });
      setTimeout(function() { wx.navigateBack(); }, 1500);
      return;
    }

    this.setData({
      traceId: traceId,
      productName: traceData ? traceData.basicInfo.productName : '',
      certificates: greenData.certificates || [],
      carbonFootprint: greenData.carbonFootprint || null,
      recyclingGuide: greenData.recyclingGuide || null
    });

    this.loadGreenPoints();

    var earnResult = greenPoints.earnPoints('viewTrace');
    if (earnResult.earned > 0) {
      wx.showToast({ title: '获得' + earnResult.earned + '环保积分', icon: 'none', duration: 1500 });
      this.loadGreenPoints();
    }

    if (greenData.carbonFootprint) {
      this.drawCarbonChart(greenData.carbonFootprint);
    }
  },

  onShow: function() {
    this.loadGreenPoints();
  },

  loadGreenPoints: function() {
    var pointsData = greenPoints.getGreenPointsData();
    var level = greenPoints.getUserLevel(pointsData.totalPoints);
    var history = greenPoints.getPointsHistory(20);
    var formattedHistory = history.map(function(item) {
      var d = new Date(item.timestamp);
      return {
        action: item.action,
        desc: item.desc,
        points: item.points,
        timestamp: (d.getMonth() + 1) + '/' + d.getDate() + ' ' + d.getHours() + ':' + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes()
      };
    });
    this.setData({
      greenPointsData: pointsData,
      userLevel: level,
      pointsHistory: formattedHistory
    });
  },

  switchTab: function(e) {
    var key = e.currentTarget.dataset.key;
    this.setData({ activeTab: key });

    if (key === 'carbon') {
      var earnResult = greenPoints.earnPoints('viewCarbon');
      if (earnResult.earned > 0) this.loadGreenPoints();
    } else if (key === 'recycling') {
      var earnResult2 = greenPoints.earnPoints('viewRecycling');
      if (earnResult2.earned > 0) this.loadGreenPoints();
    } else if (key === 'certificate') {
      var earnResult3 = greenPoints.earnPoints('viewCertificate');
      if (earnResult3.earned > 0) this.loadGreenPoints();
    }
  },

  previewCertImage: function(e) {
    var url = e.currentTarget.dataset.url;
    var urls = this.data.certificates.map(function(c) { return c.fullImage; });
    wx.previewImage({
      current: url,
      urls: urls
    });
    var earnResult = greenPoints.earnPoints('viewCertificate');
    if (earnResult.earned > 0) this.loadGreenPoints();
  },

  showCertDetail: function(e) {
    var cert = e.currentTarget.dataset.cert;
    this.setData({
      showCertModal: true,
      selectedCert: cert
    });
  },

  closeCertModal: function() {
    this.setData({ showCertModal: false, selectedCert: null });
  },

  preventBubble: function() {},

  openCertVerifyModal: function() {
    var cert = this.data.selectedCert;
    this.setData({
      showVerifyCertModal: true,
      certVerifyInput: cert ? cert.certNo : '',
      certVerifyResult: null
    });
  },

  closeVerifyCertModal: function() {
    this.setData({ showVerifyCertModal: false, certVerifyResult: null });
  },

  onCertVerifyInputChange: function(e) {
    this.setData({ certVerifyInput: e.detail.value });
  },

  doVerifyCertificate: function() {
    var that = this;
    var certNo = this.data.certVerifyInput.trim();
    if (!certNo) {
      wx.showToast({ title: '请输入证书编号', icon: 'none' });
      return;
    }
    this.setData({ certVerifying: true });
    setTimeout(function() {
      var result = mockData.verifyCertificate(certNo);
      that.setData({
        certVerifyResult: result,
        certVerifying: false
      });
    }, 600);
  },

  copyCertNo: function() {
    var cert = this.data.selectedCert;
    if (!cert) return;
    wx.setClipboardData({
      data: cert.certNo,
      success: function() {
        wx.showToast({ title: '证书编号已复制', icon: 'success', duration: 1500 });
      }
    });
  },

  drawCarbonChart: function(carbonData) {
    var that = this;
    var query = wx.createSelectorQuery();
    query.select('#carbonCanvas').fields({ node: true, size: true }).exec(function(res) {
      if (!res || !res[0]) {
        console.warn('[GreenTrace] Canvas节点未找到');
        return;
      }

      var canvas = res[0].node;
      var ctx = canvas.getContext('2d');
      var dpr = wx.getSystemInfoSync().pixelRatio;
      var width = res[0].width;
      var height = res[0].height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      var centerX = width / 2;
      var centerY = height / 2 - 20;
      var radius = Math.min(width, height) / 2 - 40;

      var stages = carbonData.stages;
      var startAngle = -Math.PI / 2;

      for (var i = 0; i < stages.length; i++) {
        var stage = stages[i];
        var sliceAngle = (stage.percent / 100) * 2 * Math.PI;
        var endAngle = startAngle + sliceAngle;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = stage.color;
        ctx.fill();

        var midAngle = startAngle + sliceAngle / 2;
        var labelRadius = radius * 0.65;
        var labelX = centerX + Math.cos(midAngle) * labelRadius;
        var labelY = centerY + Math.sin(midAngle) * labelRadius;

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(stage.name, labelX, labelY - 8);
        ctx.font = '10px sans-serif';
        ctx.fillText(stage.percent + '%', labelX, labelY + 8);

        startAngle = endAngle;
      }

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.38, 0, 2 * Math.PI);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();

      ctx.fillStyle = '#333333';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(carbonData.totalEmission.toString(), centerX, centerY - 8);
      ctx.fillStyle = '#999999';
      ctx.font = '9px sans-serif';
      ctx.fillText(carbonData.unit, centerX, centerY + 10);

      that.setData({ carbonChartData: carbonData });
    });
  },

  openRecyclingPoint: function(e) {
    var point = e.currentTarget.dataset.point;
    wx.openLocation({
      latitude: point.lat,
      longitude: point.lng,
      name: point.name,
      address: point.address,
      scale: 15,
      success: function() {
        console.log('[GreenTrace] 打开地图成功');
      },
      fail: function(err) {
        console.error('[GreenTrace] 打开地图失败:', err);
        wx.showToast({ title: '打开地图失败', icon: 'none' });
      }
    });
  },

  togglePointsDetail: function() {
    this.setData({ showPointsDetail: !this.data.showPointsDetail });
  },

  onShareAppMessage: function() {
    return {
      title: this.data.productName + ' - 绿色溯源',
      path: '/pages/greenTrace/greenTrace?traceId=' + this.data.traceId
    };
  }
});
