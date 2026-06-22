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
      { key: 'soilHealth', label: '土壤档案', icon: '🌱' },
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
    recentDonors: [],
    soilHealth: null,
    ecoPlanting: null,
    currentPlotIndex: 0,
    currentPlotRecords: [],
    selectedYearRecord: null,
    soilChartType: 'ph',
    soilChartDrawn: false
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

    var soilHealthData = greenData.soilHealth || null;
    var ecoPlantingData = (traceData && traceData.greenTrace && traceData.greenTrace.ecoPlanting) || null;
    var initialPlotIndex = 0;
    var initialRecords = [];
    var initialSelectedRecord = null;
    if (soilHealthData && soilHealthData.plots && soilHealthData.plots.length > 0) {
      var initialPlotId = soilHealthData.currentPlotId || soilHealthData.plots[0].id;
      for (var pi = 0; pi < soilHealthData.plots.length; pi++) {
        if (soilHealthData.plots[pi].id === initialPlotId) {
          initialPlotIndex = pi;
          break;
        }
      }
      initialRecords = (soilHealthData.yearlyRecords && soilHealthData.yearlyRecords[initialPlotId]) || [];
      if (initialRecords.length > 0) {
        initialSelectedRecord = initialRecords[initialRecords.length - 1];
      }
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
      recentDonors: (greenData.ecoFund && greenData.ecoFund.recentDonors) || [],
      soilHealth: soilHealthData,
      ecoPlanting: ecoPlantingData,
      currentPlotIndex: initialPlotIndex,
      currentPlotRecords: initialRecords,
      selectedYearRecord: initialSelectedRecord
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
      if (greenData && greenData.carbonFootprint) {
        setTimeout(function() {
          that.drawCarbonChart(greenData.carbonFootprint);
        }, 100);
      }
    } else if (key === 'water') {
      var earnResultW = greenPoints.earnPoints('viewWater');
      if (earnResultW.earned > 0) this.loadGreenPoints();
      if (greenData && greenData.waterFootprint) {
        setTimeout(function() {
          that.drawWaterChart(greenData.waterFootprint);
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
    } else if (key === 'soilHealth') {
      var earnResult5 = greenPoints.earnPoints('viewSoilHealth');
      if (earnResult5.earned > 0) this.loadGreenPoints();
      this.setData({ soilChartDrawn: false });
      setTimeout(function() {
        that.drawSoilChart();
      }, 100);
    }
  },

  switchPlot: function(e) {
    var index = Number(e.currentTarget.dataset.index);
    var soilHealthData = this.data.soilHealth;
    if (!soilHealthData || !soilHealthData.plots || index >= soilHealthData.plots.length) return;

    var plot = soilHealthData.plots[index];
    var records = (soilHealthData.yearlyRecords && soilHealthData.yearlyRecords[plot.id]) || [];
    var selectedRecord = records.length > 0 ? records[records.length - 1] : null;

    this.setData({
      currentPlotIndex: index,
      currentPlotRecords: records,
      selectedYearRecord: selectedRecord,
      soilChartDrawn: false
    });

    var that = this;
    setTimeout(function() {
      that.drawSoilChart();
    }, 100);
  },

  switchSoilChartType: function(e) {
    var type = e.currentTarget.dataset.type;
    this.setData({ soilChartType: type, soilChartDrawn: false });
    var that = this;
    setTimeout(function() {
      that.drawSoilChart();
    }, 100);
  },

  selectYearRecord: function(e) {
    var index = Number(e.currentTarget.dataset.index);
    var records = this.data.currentPlotRecords;
    if (index >= 0 && index < records.length) {
      this.setData({ selectedYearRecord: records[index] });
    }
  },

  drawSoilChart: function() {
    var that = this;
    var records = this.data.currentPlotRecords;
    var chartType = this.data.soilChartType;
    if (!records || records.length === 0) return;

    var canvasId = '';
    var title = '';
    var color = '';
    var unit = '';
    var values = [];
    var standardMin = null;
    var standardMax = null;

    if (chartType === 'ph') {
      canvasId = '#soilPhCanvas';
      title = 'pH值变化趋势';
      color = '#52C41A';
      unit = '';
      standardMin = 4.5;
      standardMax = 6.5;
      for (var i = 0; i < records.length; i++) {
        values.push(records[i].ph);
      }
    } else if (chartType === 'organic') {
      canvasId = '#soilOrganicCanvas';
      title = '有机质含量变化';
      color = '#DAA520';
      unit = 'g/kg';
      standardMin = 20;
      for (var j = 0; j < records.length; j++) {
        values.push(records[j].organicMatter);
      }
    } else if (chartType === 'heavyMetal') {
      canvasId = '#soilHeavyMetalCanvas';
      title = '重金属安全指数';
      color = '#1890FF';
      unit = '%';
      for (var k = 0; k < records.length; k++) {
        var maxRatio = 0;
        var hms = records[k].heavyMetals;
        for (var m = 0; m < hms.length; m++) {
          var ratio = (hms[m].value / hms[m].limit) * 100;
          if (ratio > maxRatio) maxRatio = ratio;
        }
        values.push(Math.round(maxRatio * 10) / 10);
      }
    } else {
      return;
    }

    var query = wx.createSelectorQuery();
    query.select(canvasId).fields({ node: true, size: true }).exec(function(res) {
      if (!res || !res[0]) {
        console.warn('[SoilHealth] Canvas节点未找到:', canvasId);
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

      var paddingLeft = 48;
      var paddingRight = 20;
      var paddingTop = 30;
      var paddingBottom = 40;
      var chartWidth = width - paddingLeft - paddingRight;
      var chartHeight = height - paddingTop - paddingBottom;

      var minVal = Math.min.apply(null, values);
      var maxVal = Math.max.apply(null, values);
      if (standardMin !== null) minVal = Math.min(minVal, standardMin);
      if (standardMax !== null) maxVal = Math.max(maxVal, standardMax);
      var range = maxVal - minVal;
      if (range < 1) range = 1;
      minVal = minVal - range * 0.15;
      maxVal = maxVal + range * 0.15;
      range = maxVal - minVal;

      ctx.clearRect(0, 0, width, height);

      ctx.font = '10px sans-serif';
      ctx.fillStyle = '#999';
      ctx.textAlign = 'center';
      ctx.fillText(title, width / 2, 14);

      ctx.strokeStyle = '#EEEEEE';
      ctx.lineWidth = 1;
      var ySteps = 4;
      for (var s = 0; s <= ySteps; s++) {
        var y = paddingTop + (chartHeight / ySteps) * s;
        ctx.beginPath();
        ctx.moveTo(paddingLeft, y);
        ctx.lineTo(width - paddingRight, y);
        ctx.stroke();

        var val = maxVal - (range / ySteps) * s;
        var valText = Math.round(val * 100) / 100;
        ctx.font = '9px sans-serif';
        ctx.fillStyle = '#999999';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(valText.toString(), paddingLeft - 6, y);
      }

      if (standardMin !== null) {
        var stdMinY = paddingTop + chartHeight * (1 - (standardMin - minVal) / range);
        ctx.strokeStyle = '#FAAD14';
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(paddingLeft, stdMinY);
        ctx.lineTo(width - paddingRight, stdMinY);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.font = '9px sans-serif';
        ctx.fillStyle = '#FAAD14';
        ctx.textAlign = 'left';
        ctx.fillText('适宜下限', width - paddingRight - 50, stdMinY - 6);
      }
      if (standardMax !== null) {
        var stdMaxY = paddingTop + chartHeight * (1 - (standardMax - minVal) / range);
        ctx.strokeStyle = '#FAAD14';
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(paddingLeft, stdMaxY);
        ctx.lineTo(width - paddingRight, stdMaxY);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.font = '9px sans-serif';
        ctx.fillStyle = '#FAAD14';
        ctx.textAlign = 'left';
        ctx.fillText('适宜上限', width - paddingRight - 50, stdMaxY - 6);
      }

      if (chartType === 'heavyMetal') {
        var safeLineY = paddingTop + chartHeight * (1 - (60 - minVal) / range);
        ctx.strokeStyle = '#52C41A';
        ctx.setLineDash([3, 3]);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(paddingLeft, safeLineY);
        ctx.lineTo(width - paddingRight, safeLineY);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.font = '9px sans-serif';
        ctx.fillStyle = '#52C41A';
        ctx.textAlign = 'left';
        ctx.fillText('安全警戒线60%', width - paddingRight - 60, safeLineY - 6);
      }

      var pointGap = chartWidth / (values.length - 1 || 1);
      var points = [];

      for (var p = 0; p < values.length; p++) {
        var px = paddingLeft + pointGap * p;
        var py = paddingTop + chartHeight * (1 - (values[p] - minVal) / range);
        points.push({ x: px, y: py, value: values[p], year: records[p].year, abnormal: records[p].abnormalEvent });

        ctx.font = '9px sans-serif';
        ctx.fillStyle = '#666666';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(records[p].year.toString(), px, height - paddingBottom + 8);
      }

      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (var li = 1; li < points.length; li++) {
        ctx.lineTo(points[li].x, points[li].y);
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
      ctx.stroke();

      for (var pi = 0; pi < points.length; pi++) {
        var pt = points[pi];
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.abnormal ? 6 : 4, 0, Math.PI * 2);
        ctx.fillStyle = pt.abnormal ? '#FF4D4F' : color;
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();

        if (pt.abnormal) {
          ctx.font = 'bold 10px sans-serif';
          ctx.fillStyle = '#FF4D4F';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          ctx.fillText(pt.abnormal.icon || '⚠', pt.x, pt.y - 10);
        }

        ctx.font = '9px sans-serif';
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        var valDisplay = Math.round(pt.value * 10) / 10;
        if (unit) valDisplay = valDisplay + unit;
        ctx.fillText(valDisplay.toString(), pt.x, pt.y - 8);
      }

      that.setData({ soilChartDrawn: true });
    });
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

  goToEcoPlanting: function() {
    wx.redirectTo({
      url: '/pages/detail/detail?traceId=' + this.data.traceId + '&anchor=green'
    });
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
