var mockData = require('../../utils/mockData.js');
var greenPoints = require('../../utils/greenPoints.js');
var ecoFund = require('../../utils/ecoFund.js');

Page({
  data: {
    traceId: '',
    productName: '',
    batchNo: '',
    activeTab: 'certificate',
    tabs: [
      { key: 'certificate', label: '认证证书', icon: '📜' },
      { key: 'carbon', label: '碳足迹', icon: '🌍' },
      { key: 'water', label: '水足迹', icon: '💧' },
      { key: 'biodiversity', label: '生物多样性', icon: '🦜' },
      { key: 'recycling', label: '回收指引', icon: '♻️' },
      { key: 'ecoFund', label: '公益基金', icon: '💚' },
      { key: 'points', label: '绿色积分', icon: '🌟' }
    ],
    certificates: [],
    carbonFootprint: null,
    waterFootprint: null,
    biodiversity: null,
    recyclingGuide: null,
    biodiversityMaxMonitorCount: 60,
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
    carbonChartData: null,
    waterChartDrawn: false,
    carbonChartDrawn: false,
    ecoFundData: null,
    fundProjects: [],
    selectedProjectKey: '',
    selectedAmount: 1,
    donorName: '',
    donorMessage: '',
    showDonationModal: false,
    isDonating: false,
    donationResult: null,
    batchDonationConfig: null,
    hasBatchDonation: false,
    donationStats: null,
    recentDonors: []
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

    var fundProjects = ecoFund.getFundProjects();
    var batchNo = traceData && traceData.basicInfo ? traceData.basicInfo.batchNo : '';
    var batchConfig = ecoFund.getBatchDonationConfig(batchNo);
    var selectedKey = batchConfig ? batchConfig.projectKey : fundProjects[0].key;

    var bioMaxMonitor = 60;
    if (greenData.biodiversity && greenData.biodiversity.monitoringStats) {
      var ms = greenData.biodiversity.monitoringStats;
      bioMaxMonitor = Math.max(ms.birdMonitorCount || 0, ms.insectMonitorCount || 0, ms.plantSurveyCount || 0);
      bioMaxMonitor = Math.max(bioMaxMonitor, 10);
      bioMaxMonitor = Math.ceil(bioMaxMonitor * 1.2 / 10) * 10;
    }

    this.setData({
      traceId: traceId,
      productName: traceData ? traceData.basicInfo.productName : '',
      batchNo: batchNo,
      certificates: greenData.certificates || [],
      carbonFootprint: greenData.carbonFootprint || null,
      waterFootprint: greenData.waterFootprint || null,
      biodiversity: greenData.biodiversity || null,
      recyclingGuide: greenData.recyclingGuide || null,
      biodiversityMaxMonitorCount: bioMaxMonitor,
      ecoFundData: greenData.ecoFund || null,
      fundProjects: fundProjects,
      selectedProjectKey: selectedKey,
      selectedAmount: (greenData.ecoFund && greenData.ecoFund.defaultAmount) || 1,
      batchDonationConfig: batchConfig,
      hasBatchDonation: !!batchConfig,
      donationStats: (greenData.ecoFund && greenData.ecoFund.donationStats) || null,
      recentDonors: (greenData.ecoFund && greenData.ecoFund.recentDonors) || []
    });

    this.loadGreenPoints();

    var earnResult = greenPoints.earnPoints('viewTrace');
    if (earnResult.earned > 0) {
      wx.showToast({ title: '获得' + earnResult.earned + '环保积分', icon: 'none', duration: 1500 });
      this.loadGreenPoints();
    }

    if (greenData.carbonFootprint && this.data.activeTab === 'carbon') {
      var thatCarbon = this;
      setTimeout(function() {
        thatCarbon.drawCarbonChart(greenData.carbonFootprint);
      }, 100);
    }

    if (greenData.waterFootprint && this.data.activeTab === 'water') {
      var thatWater = this;
      setTimeout(function() {
        thatWater.drawWaterChart(greenData.waterFootprint);
      }, 100);
    }
  },

  onShow: function() {
    this.loadGreenPoints();
    var donationStats = ecoFund.getDonationStats();
    if (donationStats.totalCount > 0) {
      this.setData({ userDonationStats: donationStats });
    }
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

    var that = this;
    var greenData = mockData.getGreenTraceExtended(this.data.traceId);

    if (key === 'carbon') {
      var earnResult = greenPoints.earnPoints('viewCarbon');
      if (earnResult.earned > 0) this.loadGreenPoints();
      if (!this.data.carbonChartDrawn && greenData && greenData.carbonFootprint) {
        setTimeout(function() {
          that.drawCarbonChart(greenData.carbonFootprint);
          that.setData({ carbonChartDrawn: true });
        }, 100);
      }
    } else if (key === 'water') {
      var earnResultW = greenPoints.earnPoints('viewWater');
      if (earnResultW.earned > 0) this.loadGreenPoints();
      if (!this.data.waterChartDrawn && greenData && greenData.waterFootprint) {
        setTimeout(function() {
          that.drawWaterChart(greenData.waterFootprint);
          that.setData({ waterChartDrawn: true });
        }, 100);
      }
    } else if (key === 'biodiversity') {
      var earnResultB = greenPoints.earnPoints('viewBiodiversity');
      if (earnResultB.earned > 0) this.loadGreenPoints();
    } else if (key === 'recycling') {
      var earnResult2 = greenPoints.earnPoints('viewRecycling');
      if (earnResult2.earned > 0) this.loadGreenPoints();
    } else if (key === 'certificate') {
      var earnResult3 = greenPoints.earnPoints('viewCertificate');
      if (earnResult3.earned > 0) this.loadGreenPoints();
    } else if (key === 'ecoFund') {
      var earnResult4 = greenPoints.earnPoints('viewEcoFund');
      if (earnResult4.earned > 0) this.loadGreenPoints();
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

      that.setData({ carbonChartData: carbonData, carbonChartDrawn: true });
    });
  },

  drawWaterChart: function(waterData) {
    var that = this;
    var query = wx.createSelectorQuery();
    query.select('#waterCanvas').fields({ node: true, size: true }).exec(function(res) {
      if (!res || !res[0]) {
        console.warn('[GreenTrace] Water Canvas节点未找到');
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

      var stages = waterData.stages;
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

      ctx.fillStyle = '#1890FF';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(waterData.totalUsage.toString(), centerX, centerY - 8);
      ctx.fillStyle = '#999999';
      ctx.font = '9px sans-serif';
      ctx.fillText(waterData.unit, centerX, centerY + 10);

      that.setData({ waterChartDrawn: true });
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

  openDonationModal: function(e) {
    var projectKey = e && e.currentTarget && e.currentTarget.dataset.projectkey;
    if (projectKey) {
      this.setData({ selectedProjectKey: projectKey });
    }
    this.setData({
      showDonationModal: true,
      donationResult: null,
      donorName: this.data.donorName || '',
      donorMessage: ''
    });
  },

  closeDonationModal: function() {
    this.setData({ showDonationModal: false, donationResult: null });
  },

  preventBubbleDonation: function() {},

  selectProject: function(e) {
    var key = e.currentTarget.dataset.key;
    this.setData({ selectedProjectKey: key });
  },

  selectAmount: function(e) {
    var amount = Number(e.currentTarget.dataset.amount);
    this.setData({ selectedAmount: amount });
  },

  onDonorNameInput: function(e) {
    this.setData({ donorName: e.detail.value });
  },

  onDonorMessageInput: function(e) {
    this.setData({ donorMessage: e.detail.value });
  },

  doDonation: function() {
    var that = this;
    if (this.data.isDonating) return;

    var amount = this.data.selectedAmount;
    var projectKey = this.data.selectedProjectKey;
    if (!amount || amount <= 0) {
      wx.showToast({ title: '请选择捐赠金额', icon: 'none' });
      return;
    }
    if (!projectKey) {
      wx.showToast({ title: '请选择捐赠项目', icon: 'none' });
      return;
    }

    this.setData({ isDonating: true });
    wx.showLoading({ title: '正在捐赠...', mask: true });

    setTimeout(function() {
      wx.hideLoading();
      var traceData = mockData.getTraceData(that.data.traceId);
      var result = ecoFund.processOneYuanDonation({
        amount: amount,
        projectKey: projectKey,
        batchNo: that.data.batchNo,
        traceData: traceData,
        channel: 'trace_scan',
        donorName: that.data.donorName || '爱心人士',
        donorMessage: that.data.donorMessage || ''
      });

      that.setData({
        isDonating: false,
        donationResult: result
      });

      var earnRes = greenPoints.earnPoints('makeDonation');
      if (earnRes.earned > 0) that.loadGreenPoints();

      wx.showToast({ title: '捐赠成功！', icon: 'success', duration: 2000 });
    }, 1200);
  },

  viewDonationCert: function() {
    var result = this.data.donationResult;
    if (!result || !result.certificate) return;
    this.setData({ showDonationModal: false });
    wx.navigateTo({
      url: '/pages/certificateDetail/certificateDetail?certId=' + result.certificate.certId
    });
  },

  goCertificateWallet: function() {
    wx.navigateTo({ url: '/pages/certificateWallet/certificateWallet' });
  },

  openCharityQualification: function() {
    wx.navigateTo({ url: '/pages/charityQualification/charityQualification' });
  },

  applyInvoice: function() {
    var result = this.data.donationResult;
    if (!result || !result.donationRecord) return;
    var that = this;
    wx.showModal({
      title: '申请捐赠票据',
      content: '请联系慈善组织申请票据，您的捐赠凭证编号为：\n\n' + result.donationRecord.orderNo + '\n\n是否立即联系客服？',
      confirmText: '联系客服',
      cancelText: '稍后再说',
      success: function(res) {
        if (res.confirm) {
          wx.showToast({ title: '客服正在接入...', icon: 'none' });
        }
      }
    });
  },

  onShareAppMessage: function() {
    return {
      title: this.data.productName + ' - 绿色溯源',
      path: '/pages/greenTrace/greenTrace?traceId=' + this.data.traceId
    };
  }
});
