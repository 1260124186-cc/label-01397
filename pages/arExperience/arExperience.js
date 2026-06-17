var i18n = require('../../utils/i18n/index.js');
var mockData = require('../../utils/mockData.js');

var PROCESS_STEPS = [
  { step: 0, name: '茶胚', icon: '\u{1F33F}', color: '#6B8E23' },
  { step: 1, name: '拌花', icon: '\u{1F338}', color: '#DAA520' },
  { step: 2, name: '堆窨', icon: '\u{1FAD6}', color: '#CD853F' },
  { step: 3, name: '通花', icon: '\u{1F4A8}', color: '#87CEEB' },
  { step: 4, name: '起花', icon: '\u{1F9F9}', color: '#DEB887' },
  { step: 5, name: '烘焙', icon: '\u2600\uFE0F', color: '#FF6347' }
];

var SCENE_INFO = {
  tree: {
    title: '\u6842\u82B1\u6811',
    desc: '\u767E\u5E74\u6842\u82B1\u53E4\u6811\uFF0C\u91D1\u82B1\u7EAE\u653E\uFF0C\u9999\u6C14\u56DB\u6EA2'
  },
  process: {
    title: '\u7AA8\u5236\u8FC7\u7A0B',
    desc: '\u4F20\u627F\u767E\u5E74\u7684\u6842\u82B1\u8336\u7AA8\u5236\u5DE5\u827A\uFF0C\u5C42\u5C42\u7AA8\u9999'
  },
  garden: {
    title: '\u770B\u8336\u56ED',
    desc: '\u6B66\u5937\u5C71\u9AD8\u5C71\u4E91\u96FE\u8336\u56ED\uFF0C\u7EFF\u8272\u751F\u6001\u4E4B\u6E90'
  }
};

Page({
  data: {
    mode: 'scan',
    traceId: '',
    currentScene: 'tree',
    deviceSupported: true,
    cameraAuthorized: false,
    checking: true,
    showPermissionGuide: false,
    treeRotation: 0,
    processStep: 0,
    processPlaying: false,
    gardenParallaxX: 0,
    gardenParallaxY: 0,
    showInfoPanel: false,
    infoPanelContent: { title: '', desc: '' },
    loadingProgress: 0,
    sceneTransitioning: false,
    i18n: {
      arTitle: '',
      sceneTree: '',
      sceneProcess: '',
      sceneGarden: '',
      notSupported: '',
      loadingText: '',
      permissionGuide: '',
      backBtn: '',
      playBtn: '',
      pauseBtn: ''
    }
  },

  _canvas: null,
  _ctx: null,
  _canvasWidth: 0,
  _canvasHeight: 0,
  _animationFrame: null,
  _touchStartX: 0,
  _touchStartY: 0,
  _touchStartTime: 0,
  _lastTouchX: 0,
  _lastTouchY: 0,
  _petals: [],
  _treeAngle: 0,
  _processTimer: null,
  _gardenOffset: { x: 0, y: 0 },
  _gyroActive: false,
  _traceData: null,

  onLoad: function(options) {
    var that = this;
    this.refreshI18nTexts();

    if (options.mode) {
      this.setData({ mode: options.mode });
    }
    if (options.traceId) {
      this.setData({ traceId: options.traceId });
    }

    this.loadTraceInfo();

    this.checkDeviceCapability();
  },

  onShow: function() {
    if (this._canvas && this._ctx) {
      this.startSceneRendering();
    }
  },

  onHide: function() {
    this.stopSceneRendering();
    this.stopGyroscope();
  },

  onUnload: function() {
    this.stopSceneRendering();
    this.stopGyroscope();
    if (this._processTimer) {
      clearInterval(this._processTimer);
      this._processTimer = null;
    }
  },

  refreshI18nTexts: function() {
    var t = function(k) { return i18n.t(k); };
    this.setData({
      'i18n.arTitle': t('ar.title') || 'AR\u4F53\u9A8C',
      'i18n.sceneTree': t('ar.sceneTree') || '\u6842\u82B1\u6811',
      'i18n.sceneProcess': t('ar.sceneProcess') || '\u7AA8\u5236\u8FC7\u7A0B',
      'i18n.sceneGarden': t('ar.sceneGarden') || '\u770B\u8336\u56ED',
      'i18n.notSupported': t('ar.notSupported') || '\u5F53\u524D\u8BBE\u5907\u4E0D\u652F\u6301AR\u4F53\u9A8C',
      'i18n.loadingText': t('ar.loading') || '\u52A0\u8F7D\u4E2D...',
      'i18n.permissionGuide': t('ar.permissionGuide') || '\u9700\u8981\u6444\u50CF\u5934\u6743\u9650\u624D\u80FD\u4F7F\u7528AR\u529F\u80FD',
      'i18n.backBtn': t('common.back') || '\u8FD4\u56DE',
      'i18n.playBtn': t('ar.play') || '\u64AD\u653E',
      'i18n.pauseBtn': t('ar.pause') || '\u6682\u505C'
    });
  },

  loadTraceInfo: function() {
    var that = this;
    var traceId = this.data.traceId;
    if (!traceId) return;

    setTimeout(function() {
      var data = mockData.getTraceData(traceId);
      if (data) {
        that._traceData = data;
      }
    }, 200);
  },

  checkDeviceCapability: function() {
    var that = this;
    this.setData({ checking: true });

    var sysInfo = wx.getSystemInfoSync();
    var sdkVersion = sysInfo.SDKVersion;
    var versionNum = parseFloat(sdkVersion.split('.').join(''));

    if (versionNum < 230) {
      that.setData({
        deviceSupported: false,
        checking: false
      });
      wx.showModal({
        title: '\u8BBE\u5907\u4E0D\u652F\u6301',
        content: that.data.i18n.notSupported,
        showCancel: false,
        confirmText: '\u77E5\u9053\u4E86',
        success: function() {
          wx.navigateBack();
        }
      });
      return;
    }

    that.requestCameraPermission();
  },

  requestCameraPermission: function() {
    var that = this;
    wx.authorize({
      scope: 'scope.camera',
      success: function() {
        that.setData({
          cameraAuthorized: true,
          checking: false,
          showPermissionGuide: false
        });
        that.simulateLoading();
      },
      fail: function() {
        that.setData({
          cameraAuthorized: false,
          checking: false,
          showPermissionGuide: true
        });
      }
    });
  },

  onCameraError: function(e) {
    this.setData({
      cameraAuthorized: false,
      showPermissionGuide: true
    });
  },

  openPermissionSetting: function() {
    var that = this;
    wx.openSetting({
      success: function(res) {
        if (res.authSetting['scope.camera']) {
          that.setData({
            cameraAuthorized: true,
            showPermissionGuide: false
          });
          that.simulateLoading();
        }
      }
    });
  },

  simulateLoading: function() {
    var that = this;
    var progress = 0;
    var timer = setInterval(function() {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(timer);
        that.setData({ loadingProgress: Math.round(progress) });
        that.initCanvas();
      } else {
        that.setData({ loadingProgress: Math.round(progress) });
      }
    }, 200);
  },

  initCanvas: function() {
    var that = this;
    var query = wx.createSelectorQuery();
    query.select('#arCanvas')
      .fields({ node: true, size: true })
      .exec(function(res) {
        if (!res || !res[0] || !res[0].node) {
          console.warn('[AR] Canvas node not found');
          return;
        }
        var canvas = res[0].node;
        var ctx = canvas.getContext('2d');
        var dpr = wx.getWindowInfo().pixelRatio || 2;
        var width = res[0].width;
        var height = res[0].height;

        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);

        that._canvas = canvas;
        that._ctx = ctx;
        that._canvasWidth = width;
        that._canvasHeight = height;

        that.initPetals();
        that.startSceneRendering();
      });
  },

  initPetals: function() {
    this._petals = [];
    for (var i = 0; i < 25; i++) {
      this._petals.push({
        x: Math.random() * this._canvasWidth,
        y: Math.random() * this._canvasHeight,
        size: Math.random() * 4 + 2,
        speedX: (Math.random() - 0.5) * 1.5,
        speedY: Math.random() * 1.5 + 0.5,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 3,
        opacity: Math.random() * 0.6 + 0.4
      });
    }
  },

  switchScene: function(e) {
    var scene = e.currentTarget.dataset.scene;
    if (!scene || scene === this.data.currentScene) return;
    if (this.data.sceneTransitioning) return;

    var that = this;
    this.setData({ sceneTransitioning: true });

    if (this._processTimer) {
      clearInterval(this._processTimer);
      this._processTimer = null;
    }

    setTimeout(function() {
      that.setData({
        currentScene: scene,
        processStep: 0,
        processPlaying: false,
        showInfoPanel: false
      });

      if (scene === 'garden') {
        that.startGyroscope();
      } else {
        that.stopGyroscope();
      }

      setTimeout(function() {
        that.setData({ sceneTransitioning: false });
      }, 300);
    }, 200);
  },

  startSceneRendering: function() {
    var that = this;
    this.stopSceneRendering();

    function loop() {
      that._animationFrame = that._canvas.requestAnimationFrame(function() {
        that.renderCurrentScene();
        loop();
      });
    }
    loop();
  },

  stopSceneRendering: function() {
    if (this._animationFrame && this._canvas) {
      this._canvas.cancelAnimationFrame(this._animationFrame);
      this._animationFrame = null;
    }
  },

  renderCurrentScene: function() {
    var scene = this.data.currentScene;
    if (scene === 'tree') {
      this.drawTreeScene();
    } else if (scene === 'process') {
      this.drawProcessScene();
    } else if (scene === 'garden') {
      this.drawGardenScene();
    }
  },

  drawTreeScene: function() {
    var ctx = this._ctx;
    if (!ctx) return;
    var w = this._canvasWidth;
    var h = this._canvasHeight;
    var rotation = this.data.treeRotation;
    var rad = rotation * Math.PI / 180;

    ctx.clearRect(0, 0, w, h);

    var trunkX = w / 2;
    var trunkBaseY = h * 0.85;
    var trunkTopY = h * 0.35;
    var trunkHeight = trunkBaseY - trunkTopY;

    ctx.save();
    ctx.translate(trunkX, trunkBaseY);
    ctx.rotate(Math.sin(rad) * 0.05);
    ctx.translate(-trunkX, -trunkBaseY);

    var trunkGrad = ctx.createLinearGradient(trunkX - 15, trunkTopY, trunkX + 15, trunkBaseY);
    trunkGrad.addColorStop(0, '#5D4037');
    trunkGrad.addColorStop(0.5, '#795548');
    trunkGrad.addColorStop(1, '#4E342E');

    ctx.beginPath();
    ctx.moveTo(trunkX - 8, trunkBaseY);
    ctx.quadraticCurveTo(trunkX - 12, trunkBaseY - trunkHeight * 0.3, trunkX - 5, trunkTopY + 20);
    ctx.lineTo(trunkX + 5, trunkTopY + 20);
    ctx.quadraticCurveTo(trunkX + 12, trunkBaseY - trunkHeight * 0.3, trunkX + 8, trunkBaseY);
    ctx.closePath();
    ctx.fillStyle = trunkGrad;
    ctx.fill();

    var branches = [
      { startX: trunkX - 3, startY: trunkTopY + 40, endX: trunkX - w * 0.22, endY: trunkTopY - 20, cp1x: trunkX - w * 0.08, cp1y: trunkTopY + 10 },
      { startX: trunkX + 3, startY: trunkTopY + 40, endX: trunkX + w * 0.25, endY: trunkTopY - 10, cp1x: trunkX + w * 0.1, cp1y: trunkTopY + 15 },
      { startX: trunkX - 2, startY: trunkTopY + 70, endX: trunkX - w * 0.18, endY: trunkTopY + 30, cp1x: trunkX - w * 0.07, cp1y: trunkTopY + 50 },
      { startX: trunkX + 2, startY: trunkTopY + 70, endX: trunkX + w * 0.2, endY: trunkTopY + 40, cp1x: trunkX + w * 0.08, cp1y: trunkTopY + 55 },
      { startX: trunkX, startY: trunkTopY + 25, endX: trunkX + 5, endY: trunkTopY - 30, cp1x: trunkX + 10, cp1y: trunkTopY }
    ];

    for (var i = 0; i < branches.length; i++) {
      var b = branches[i];
      ctx.beginPath();
      ctx.moveTo(b.startX, b.startY);
      ctx.quadraticCurveTo(b.cp1x, b.cp1y, b.endX, b.endY);
      ctx.strokeStyle = '#5D4037';
      ctx.lineWidth = Math.max(4 - i * 0.5, 2);
      ctx.lineCap = 'round';
      ctx.stroke();
    }

    var canopyCenterX = trunkX;
    var canopyCenterY = trunkTopY - 10;
    var canopyRadiusX = w * 0.3;
    var canopyRadiusY = h * 0.2;

    var leafClusters = [
      { ox: 0, oy: 0, rx: canopyRadiusX * 0.9, ry: canopyRadiusY * 0.85, color: '#2E7D32' },
      { ox: -canopyRadiusX * 0.3, oy: canopyRadiusY * 0.1, rx: canopyRadiusX * 0.7, ry: canopyRadiusY * 0.7, color: '#388E3C' },
      { ox: canopyRadiusX * 0.25, oy: canopyRadiusY * 0.05, rx: canopyRadiusX * 0.75, ry: canopyRadiusY * 0.75, color: '#43A047' },
      { ox: 0, oy: -canopyRadiusY * 0.25, rx: canopyRadiusX * 0.6, ry: canopyRadiusY * 0.5, color: '#4CAF50' },
      { ox: -canopyRadiusX * 0.5, oy: canopyRadiusY * 0.3, rx: canopyRadiusX * 0.5, ry: canopyRadiusY * 0.45, color: '#66BB6A' }
    ];

    for (var j = 0; j < leafClusters.length; j++) {
      var lc = leafClusters[j];
      var grad = ctx.createRadialGradient(
        canopyCenterX + lc.ox, canopyCenterY + lc.oy, 0,
        canopyCenterX + lc.ox, canopyCenterY + lc.oy, Math.max(lc.rx, lc.ry)
      );
      grad.addColorStop(0, lc.color);
      grad.addColorStop(1, 'rgba(46,125,50,0.3)');

      ctx.beginPath();
      ctx.ellipse(canopyCenterX + lc.ox, canopyCenterY + lc.oy, lc.rx, lc.ry, 0, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    }

    var time = Date.now() / 1000;
    var flowerCount = 60;
    for (var f = 0; f < flowerCount; f++) {
      var angle = (f / flowerCount) * Math.PI * 2 + time * 0.1;
      var distFactor = 0.3 + (f % 5) * 0.13;
      var fx = canopyCenterX + Math.cos(angle + f * 0.5) * canopyRadiusX * distFactor;
      var fy = canopyCenterY + Math.sin(angle + f * 0.3) * canopyRadiusY * distFactor;
      var fSize = Math.max(2, 3 + Math.sin(time + f) * 1.5);

      var dx = fx - canopyCenterX;
      var dy = fy - canopyCenterY;
      var normalDist = Math.sqrt((dx * dx) / (canopyRadiusX * canopyRadiusX) + (dy * dy) / (canopyRadiusY * canopyRadiusY));
      if (normalDist > 0.85) continue;

      ctx.beginPath();
      ctx.arc(fx, fy, fSize, 0, Math.PI * 2);
      var flowerOpacity = 0.7 + Math.sin(time * 2 + f) * 0.3;
      ctx.fillStyle = 'rgba(255,215,0,' + flowerOpacity + ')';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(fx, fy, fSize * 1.6, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,223,100,0.15)';
      ctx.fill();
    }

    ctx.restore();

    this.updateAndDrawPetals(ctx, w, h);

    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('\u{1F449} \u5DE6\u53F3\u6ED1\u52A8\u65CB\u8F6C\u6842\u82B1\u6811', w / 2, h - 30);
  },

  updateAndDrawPetals: function(ctx, w, h) {
    var petals = this._petals;
    for (var i = 0; i < petals.length; i++) {
      var p = petals[i];
      p.x += p.speedX;
      p.y += p.speedY;
      p.rotation += p.rotationSpeed;

      if (p.y > h + 10) {
        p.y = -10;
        p.x = Math.random() * w;
      }
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation * Math.PI / 180);
      ctx.globalAlpha = p.opacity;

      ctx.beginPath();
      ctx.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#FFD700';
      ctx.fill();

      ctx.beginPath();
      ctx.ellipse(0, 0, p.size * 0.5, p.size * 0.3, Math.PI / 4, 0, Math.PI * 2);
      ctx.fillStyle = '#FFA000';
      ctx.fill();

      ctx.restore();
    }
  },

  drawProcessScene: function() {
    var ctx = this._ctx;
    if (!ctx) return;
    var w = this._canvasWidth;
    var h = this._canvasHeight;
    var currentStep = this.data.processStep;

    ctx.clearRect(0, 0, w, h);

    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fillRect(0, 0, w, h);

    var stepCount = PROCESS_STEPS.length;
    var stepWidth = w / stepCount;
    var centerY = h * 0.45;

    ctx.beginPath();
    ctx.moveTo(stepWidth * 0.5, centerY);
    ctx.lineTo(w - stepWidth * 0.5, centerY);
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.stroke();
    ctx.setLineDash([]);

    for (var i = 0; i < stepCount; i++) {
      var step = PROCESS_STEPS[i];
      var cx = stepWidth * (i + 0.5);
      var cy = centerY;
      var isActive = i === currentStep;
      var isPast = i < currentStep;
      var radius = isActive ? 28 : 20;

      if (isActive) {
        var glowGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 2);
        glowGrad.addColorStop(0, 'rgba(255,215,0,0.3)');
        glowGrad.addColorStop(1, 'rgba(255,215,0,0)');
        ctx.beginPath();
        ctx.arc(cx, cy, radius * 2, 0, Math.PI * 2);
        ctx.fillStyle = glowGrad;
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      if (isActive) {
        ctx.fillStyle = step.color;
        ctx.shadowColor = step.color;
        ctx.shadowBlur = 15;
      } else if (isPast) {
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
      } else {
        ctx.fillStyle = 'rgba(255,255,255,0.25)';
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
      }
      ctx.fill();
      ctx.shadowBlur = 0;

      if (isPast && i < stepCount - 1) {
        var nextCx = stepWidth * (i + 1.5);
        ctx.beginPath();
        ctx.moveTo(cx + radius + 4, cy);
        ctx.lineTo(nextCx - (i + 1 === currentStep ? 28 : 20) - 4, cy);
        ctx.strokeStyle = 'rgba(255,215,0,0.6)';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      ctx.fillStyle = isActive ? '#FFFFFF' : (isPast ? '#FFFFFF' : 'rgba(255,255,255,0.6)');
      ctx.font = (isActive ? '16' : '12') + 'px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(step.icon, cx, cy);

      ctx.fillStyle = isActive ? '#FFD700' : (isPast ? '#FFFFFF' : 'rgba(255,255,255,0.5)');
      ctx.font = (isActive ? '13' : '11') + 'px sans-serif';
      ctx.textBaseline = 'top';
      ctx.fillText(step.name, cx, cy + radius + 8);

      if (isActive) {
        var descY = cy - radius - 30;
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        var descWidth = stepWidth * 0.8;
        var descHeight = 24;
        ctx.beginPath();
        var descX = cx - descWidth / 2;
        ctx.roundRect(descX, descY, descWidth, descHeight, 12);
        ctx.fill();

        ctx.fillStyle = '#FFD700';
        ctx.font = '11px sans-serif';
        ctx.textBaseline = 'middle';
        ctx.fillText('\u25B6 ' + step.name, cx, descY + descHeight / 2);
      }
    }

    if (currentStep >= 0 && currentStep < PROCESS_STEPS.length) {
      var activeStep = PROCESS_STEPS[currentStep];
      var detailY = centerY + 70;
      var boxWidth = w * 0.7;
      var boxHeight = h * 0.25;
      var boxX = (w - boxWidth) / 2;

      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.beginPath();
      ctx.roundRect(boxX, detailY, boxWidth, boxHeight, 16);
      ctx.fill();

      ctx.strokeStyle = activeStep.color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(boxX, detailY, boxWidth, boxHeight, 16);
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(activeStep.icon + ' ' + activeStep.name, w / 2, detailY + 16);

      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.font = '12px sans-serif';
      var stepDescs = [
        '\u7CBE\u9009\u4F18\u8D28\u8336\u53F6\u4F5C\u4E3A\u8336\u80DA\n\u7ECF\u6740\u9752\u3001\u63C9\u637B\u3001\u70D8\u5E72\u5DE5\u5E8F\n\u4FDD\u7559\u8336\u53F6\u5929\u7136\u97F5\u5473',
        '\u5C06\u65B0\u9C9C\u6842\u82B1\u4E0E\u8336\u53F6\u5747\u5300\u62CC\u5408\n\u6309\u4F20\u7EDF\u914D\u6BD41:5\u6BD4\u4F8B\n\u786E\u4FDD\u6BCF\u7247\u8336\u53F6\u6CBE\u67D3\u82B1\u9999',
        '\u6052\u6E29\u6052\u6E7F\u73AF\u5883\u4E0B\u9759\u7F6E\u7AA8\u9999\n\u6E29\u5EA628-30\u2103 \u6E7F\u5EA670-75%\n\u82B1\u9999\u5411\u8336\u53F6\u6E17\u900F\u8F6C\u79FB',
        '\u9002\u65F6\u901A\u98CE\u6563\u70ED\u4FDD\u6301\u6D3B\u6027\n\u9632\u6B62\u5806\u7AA8\u4E2D\u6E29\u5EA6\u8FC7\u9AD8\n\u4FDD\u8BC1\u8336\u53F6\u5438\u9999\u6548\u679C',
        '\u5206\u79BB\u8336\u53F6\u4E0E\u6842\u82B1\u6B8B\u6E23\n\u7CBE\u5FC3\u7B5B\u9009\u53BB\u9664\u82B1\u67E0\n\u4FDD\u7559\u5145\u5206\u5438\u9999\u7684\u8336\u53F6',
        '\u4F4E\u6E29\u70D8\u7119\u9501\u4F4F\u82B1\u9999\n\u6E29\u5EA6\u63A7\u5236\u572870-80\u2103\n\u6700\u5927\u7A0B\u5EA6\u4FDD\u7559\u6842\u82B1\u9999\u6C14'
      ];
      var lines = stepDescs[currentStep].split('\n');
      for (var l = 0; l < lines.length; l++) {
        ctx.fillText(lines[l], w / 2, detailY + 40 + l * 20);
      }
    }

    var progressWidth = w * 0.6;
    var progressX = (w - progressWidth) / 2;
    var progressY = h - 50;

    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.beginPath();
    ctx.roundRect(progressX, progressY, progressWidth, 4, 2);
    ctx.fill();

    var fillWidth = (currentStep / (stepCount - 1)) * progressWidth;
    if (fillWidth > 0) {
      var progressGrad = ctx.createLinearGradient(progressX, 0, progressX + fillWidth, 0);
      progressGrad.addColorStop(0, '#FFD700');
      progressGrad.addColorStop(1, '#FFA000');
      ctx.fillStyle = progressGrad;
      ctx.beginPath();
      ctx.roundRect(progressX, progressY, fillWidth, 4, 2);
      ctx.fill();
    }

    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText((currentStep + 1) + ' / ' + stepCount, w / 2, progressY + 20);
  },

  drawGardenScene: function() {
    var ctx = this._ctx;
    if (!ctx) return;
    var w = this._canvasWidth;
    var h = this._canvasHeight;
    var parallaxX = this.data.gardenParallaxX;
    var parallaxY = this.data.gardenParallaxY;

    ctx.clearRect(0, 0, w, h);

    var skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.5);
    skyGrad.addColorStop(0, '#4A90D9');
    skyGrad.addColorStop(0.5, '#87CEEB');
    skyGrad.addColorStop(1, '#B0E0E6');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h * 0.5);

    var time = Date.now() / 1000;
    var cloudOffset = Math.sin(time * 0.1) * 10 + parallaxX * 0.5;
    this.drawCloud(ctx, w * 0.15 + cloudOffset, h * 0.08, 40);
    this.drawCloud(ctx, w * 0.55 + cloudOffset * 0.7, h * 0.12, 35);
    this.drawCloud(ctx, w * 0.8 + cloudOffset * 0.3, h * 0.06, 30);

    var hill1Offset = parallaxX * 0.15;
    ctx.beginPath();
    ctx.moveTo(-20 + hill1Offset, h * 0.45);
    ctx.quadraticCurveTo(w * 0.2 + hill1Offset, h * 0.25, w * 0.45 + hill1Offset, h * 0.38);
    ctx.quadraticCurveTo(w * 0.7 + hill1Offset, h * 0.28, w + 20 + hill1Offset, h * 0.4);
    ctx.lineTo(w + 20 + hill1Offset, h);
    ctx.lineTo(-20 + hill1Offset, h);
    ctx.closePath();
    ctx.fillStyle = '#5D8A5D';
    ctx.fill();

    var hill2Offset = parallaxX * 0.25;
    ctx.beginPath();
    ctx.moveTo(-20 + hill2Offset, h * 0.52);
    ctx.quadraticCurveTo(w * 0.15 + hill2Offset, h * 0.38, w * 0.35 + hill2Offset, h * 0.48);
    ctx.quadraticCurveTo(w * 0.55 + hill2Offset, h * 0.35, w * 0.8 + hill2Offset, h * 0.45);
    ctx.quadraticCurveTo(w * 0.95 + hill2Offset, h * 0.38, w + 20 + hill2Offset, h * 0.5);
    ctx.lineTo(w + 20 + hill2Offset, h);
    ctx.lineTo(-20 + hill2Offset, h);
    ctx.closePath();
    ctx.fillStyle = '#4A7A4A';
    ctx.fill();

    var hill3Offset = parallaxX * 0.4;
    ctx.beginPath();
    ctx.moveTo(-20 + hill3Offset, h * 0.6);
    ctx.quadraticCurveTo(w * 0.25 + hill3Offset, h * 0.5, w * 0.5 + hill3Offset, h * 0.55);
    ctx.quadraticCurveTo(w * 0.75 + hill3Offset, h * 0.48, w + 20 + hill3Offset, h * 0.58);
    ctx.lineTo(w + 20 + hill3Offset, h);
    ctx.lineTo(-20 + hill3Offset, h);
    ctx.closePath();
    ctx.fillStyle = '#3D6B3D';
    ctx.fill();

    var groundOffset = parallaxX * 0.6;
    var groundGrad = ctx.createLinearGradient(0, h * 0.6, 0, h);
    groundGrad.addColorStop(0, '#6B8E23');
    groundGrad.addColorStop(0.3, '#556B2F');
    groundGrad.addColorStop(1, '#3B5323');
    ctx.fillStyle = groundGrad;
    ctx.fillRect(0 + groundOffset * 0.1, h * 0.6, w, h * 0.4);

    var teaBushRows = [
      { y: h * 0.63, count: 8, size: 14, color: '#2E7D32' },
      { y: h * 0.68, count: 9, size: 12, color: '#388E3C' },
      { y: h * 0.73, count: 10, size: 11, color: '#43A047' },
      { y: h * 0.78, count: 11, size: 10, color: '#4CAF50' },
      { y: h * 0.83, count: 12, size: 9, color: '#66BB6A' }
    ];

    for (var r = 0; r < teaBushRows.length; r++) {
      var row = teaBushRows[r];
      var rowOffset = parallaxX * (0.5 + r * 0.1);
      for (var b = 0; b < row.count; b++) {
        var bx = (b + 0.5) * (w / row.count) + rowOffset;
        var by = row.y + Math.sin(b * 1.5 + time * 0.3) * 2;
        ctx.beginPath();
        ctx.ellipse(bx, by, row.size * 1.3, row.size * 0.7, 0, 0, Math.PI * 2);
        ctx.fillStyle = row.color;
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(bx + row.size * 0.3, by - row.size * 0.2, row.size * 0.8, row.size * 0.5, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(102,187,106,0.5)';
        ctx.fill();
      }
    }

    var sunX = w * 0.8 + parallaxX * 0.05;
    var sunY = h * 0.1;
    var sunGrad = ctx.createRadialGradient(sunX, sunY, 5, sunX, sunY, 40);
    sunGrad.addColorStop(0, 'rgba(255,250,200,1)');
    sunGrad.addColorStop(0.3, 'rgba(255,230,100,0.8)');
    sunGrad.addColorStop(1, 'rgba(255,200,50,0)');
    ctx.beginPath();
    ctx.arc(sunX, sunY, 40, 0, Math.PI * 2);
    ctx.fillStyle = sunGrad;
    ctx.fill();

    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('\u{1F4F1} \u79FB\u52A8\u624B\u673A\u611F\u53D7\u8336\u56ED\u89C6\u89D2', w / 2, h - 30);
  },

  drawCloud: function(ctx, x, y, size) {
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.beginPath();
    ctx.arc(x, y, size * 0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + size * 0.4, y - size * 0.1, size * 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x - size * 0.4, y + size * 0.05, size * 0.45, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + size * 0.15, y + size * 0.15, size * 0.4, 0, Math.PI * 2);
    ctx.fill();
  },

  onCanvasTouchStart: function(e) {
    if (!e.touches || e.touches.length === 0) return;
    var touch = e.touches[0];
    this._touchStartX = touch.x;
    this._touchStartY = touch.y;
    this._touchStartTime = Date.now();
    this._lastTouchX = touch.x;
    this._lastTouchY = touch.y;
  },

  onCanvasTouchMove: function(e) {
    if (!e.touches || e.touches.length === 0) return;
    var touch = e.touches[0];
    var deltaX = touch.x - this._lastTouchX;
    var deltaY = touch.y - this._lastTouchY;
    this._lastTouchX = touch.x;
    this._lastTouchY = touch.y;

    var scene = this.data.currentScene;
    if (scene === 'tree') {
      var newRotation = (this.data.treeRotation + deltaX * 0.5) % 360;
      if (newRotation < 0) newRotation += 360;
      this.setData({ treeRotation: newRotation });
    } else if (scene === 'garden') {
      this.setData({
        gardenParallaxX: this.data.gardenParallaxX + deltaX * 0.3,
        gardenParallaxY: this.data.gardenParallaxY + deltaY * 0.3
      });
    }
  },

  onCanvasTouchEnd: function(e) {
    var touchDuration = Date.now() - this._touchStartTime;
    var deltaX = this._lastTouchX - this._touchStartX;
    var deltaY = this._lastTouchY - this._touchStartY;
    var distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (touchDuration < 300 && distance < 10) {
      this.handleCanvasTap(this._touchStartX, this._touchStartY);
    }
  },

  handleCanvasTap: function(x, y) {
    var scene = this.data.currentScene;
    var w = this._canvasWidth;
    var h = this._canvasHeight;

    if (scene === 'tree') {
      var canopyCX = w / 2;
      var canopyCY = h * 0.25;
      var dx = x - canopyCX;
      var dy = y - canopyCY;
      if (Math.abs(dx) < w * 0.3 && Math.abs(dy) < h * 0.2) {
        this.showSceneInfo('tree');
      }
    } else if (scene === 'process') {
      this.showSceneInfo('process');
    } else if (scene === 'garden') {
      this.showSceneInfo('garden');
    }
  },

  onDeviceMotionChange: function(res) {
    if (!res || this.data.currentScene !== 'garden') return;
    var alpha = res.alpha || 0;
    var beta = res.beta || 0;
    var parallaxX = Math.sin(alpha * Math.PI / 180) * 30;
    var parallaxY = Math.sin(beta * Math.PI / 180) * 15;

    this.setData({
      gardenParallaxX: parallaxX,
      gardenParallaxY: parallaxY
    });
  },

  startGyroscope: function() {
    var that = this;
    if (this._gyroActive) return;

    wx.startDeviceMotionListening({
      interval: 'game',
      success: function() {
        that._gyroActive = true;
        wx.onDeviceMotionChange(that.onDeviceMotionChange.bind(that));
      },
      fail: function() {
        that._gyroActive = false;
      }
    });
  },

  stopGyroscope: function() {
    if (this._gyroActive) {
      wx.stopDeviceMotionListening();
      this._gyroActive = false;
    }
  },

  toggleProcessAnimation: function() {
    if (this.data.processPlaying) {
      this.pauseProcessAnimation();
    } else {
      this.startProcessAnimation();
    }
  },

  startProcessAnimation: function() {
    var that = this;
    this.setData({ processPlaying: true });

    if (this._processTimer) {
      clearInterval(this._processTimer);
    }

    this._processTimer = setInterval(function() {
      var nextStep = (that.data.processStep + 1) % PROCESS_STEPS.length;
      that.setData({ processStep: nextStep });
    }, 2500);
  },

  pauseProcessAnimation: function() {
    if (this._processTimer) {
      clearInterval(this._processTimer);
      this._processTimer = null;
    }
    this.setData({ processPlaying: false });
  },

  showSceneInfo: function(sceneKeyOrEvent) {
    var sceneKey;
    if (typeof sceneKeyOrEvent === 'string') {
      sceneKey = sceneKeyOrEvent;
    } else if (sceneKeyOrEvent && sceneKeyOrEvent.currentTarget && sceneKeyOrEvent.currentTarget.dataset) {
      sceneKey = sceneKeyOrEvent.currentTarget.dataset.scene;
    }
    if (!sceneKey) {
      sceneKey = this.data.currentScene;
    }
    var info = SCENE_INFO[sceneKey];
    if (!info) return;

    var detail = '';
    if (sceneKey === 'tree' && this._traceData) {
      var td = this._traceData;
      detail = '\u8336\u6811\u9F84\uFF1A' + (td.treeAge ? td.treeAge.teaTreeAge + '\u5E74' : '\u672A\u77E5');
      detail += '\n\u6842\u82B1\u6811\u9F84\uFF1A' + (td.treeAge ? td.treeAge.osmanthusTreeAge + '\u5E74' : '\u672A\u77E5');
      if (td.osmanthusInfo) {
        detail += '\n\u54C1\u79CD\uFF1A' + td.osmanthusInfo.variety;
        detail += '\n\u82B1\u8272\uFF1A' + td.osmanthusInfo.color;
      }
    } else if (sceneKey === 'process' && this._traceData) {
      var sp = this._traceData.scentingProcess;
      if (sp) {
        detail = '\u7AA8\u5236\u6B21\u6570\uFF1A' + sp.scentingTimes + '\u6B21';
        detail += '\n\u7AA8\u5236\u65F6\u957F\uFF1A' + sp.scentingDuration + '\u5C0F\u65F6/\u6B21';
        detail += '\n\u914D\u6BD4\uFF1A' + sp.ratio;
        detail += '\n\u6E29\u5EA6\uFF1A' + sp.temperature + '\u2103';
      }
    } else if (sceneKey === 'garden' && this._traceData) {
      var loc = this._traceData.locationMap;
      if (loc && loc.markers) {
        detail = loc.markers.map(function(m) {
          return m.icon + ' ' + m.name;
        }).join('\n');
      }
    }

    this.setData({
      showInfoPanel: true,
      infoPanelContent: {
        title: info.title,
        desc: info.desc + (detail ? '\n\n' + detail : '')
      }
    });
  },

  closeInfoPanel: function() {
    this.setData({
      showInfoPanel: false,
      infoPanelContent: { title: '', desc: '' }
    });
  },

  goBack: function() {
    wx.navigateBack({
      fail: function() {
        wx.reLaunch({ url: '/pages/index/index' });
      }
    });
  }
});
