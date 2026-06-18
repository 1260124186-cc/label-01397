var weatherUtil = require('../../utils/weather.js');
var userStore = require('../../utils/userStore.js');

Page({
  data: {
    weather: null,
    weatherLoading: true,
    waterTempAdjusted: null,
    waterHardness: 'medium',
    hardnessOptions: [
      { key: 'soft', label: '软水', desc: '纯净水、蒸馏水、RO反渗透水', icon: '💧' },
      { key: 'medium', label: '中等', desc: '自来水、矿泉水（多数地区）', icon: '🌊' },
      { key: 'hard', label: '硬水', desc: '井水、高钙镁矿泉水', icon: '🪨' }
    ],
    hardnessAdjustment: null,
    cityInput: '',
    baseTempMin: 85,
    baseTempMax: 90,
    baseTeaAmount: 3,
    baseDuration: 120
  },

  onLoad: function(options) {
    if (options.traceId) {
      this.setData({ traceId: options.traceId });
    }
    if (options.baseTempMin) this.setData({ baseTempMin: parseInt(options.baseTempMin) });
    if (options.baseTempMax) this.setData({ baseTempMax: parseInt(options.baseTempMax) });
    if (options.baseTeaAmount) this.setData({ baseTeaAmount: parseInt(options.baseTeaAmount) });
    if (options.baseDuration) this.setData({ baseDuration: parseInt(options.baseDuration) });

    var savedSettings = userStore.getWaterQualitySettings();
    this.setData({ waterHardness: savedSettings.hardness || 'medium' });

    this.calculateHardnessAdjustment();
    this.loadCurrentWeather();
  },

  loadCurrentWeather: function() {
    var that = this;
    this.setData({ weatherLoading: true });
    weatherUtil.getCurrentLocationWeather().then(function(weather) {
      that.setData({
        weather: weather,
        weatherLoading: false
      });
      that.calculateWaterTemp(weather.temp);
    }).catch(function() {
      that.setData({ weatherLoading: false });
      wx.showToast({ title: '获取天气失败，使用默认值', icon: 'none' });
      that.calculateWaterTemp(25);
    });
  },

  onCityInput: function(e) {
    this.setData({ cityInput: e.detail.value });
  },

  searchCityWeather: function() {
    var that = this;
    var city = this.data.cityInput.trim();
    if (!city) {
      wx.showToast({ title: '请输入城市名称', icon: 'none' });
      return;
    }
    this.setData({ weatherLoading: true });
    weatherUtil.getCityWeather(city).then(function(weather) {
      that.setData({
        weather: weather,
        weatherLoading: false
      });
      that.calculateWaterTemp(weather.temp);
    }).catch(function(err) {
      that.setData({ weatherLoading: false });
      wx.showToast({ title: err.message || '获取天气失败', icon: 'none' });
    });
  },

  calculateWaterTemp: function(temp) {
    var adjusted = weatherUtil.adjustWaterTempByWeather(
      temp,
      this.data.baseTempMin,
      this.data.baseTempMax
    );
    this.setData({ waterTempAdjusted: adjusted });
  },

  selectHardness: function(e) {
    var hardness = e.currentTarget.dataset.hardness;
    this.setData({ waterHardness: hardness });
    this.calculateHardnessAdjustment();
    userStore.setWaterQualitySettings({ hardness: hardness });
  },

  calculateHardnessAdjustment: function() {
    var adjustment = userStore.adjustBrewParamsByWaterQuality(
      this.data.waterHardness,
      this.data.baseTeaAmount,
      this.data.baseDuration
    );
    this.setData({ hardnessAdjustment: adjustment });
  },

  confirmAndBack: function() {
    var pages = getCurrentPages();
    if (pages.length > 1) {
      var prevPage = pages[pages.length - 2];
      if (prevPage && prevPage.onEnvironmentUpdated) {
        prevPage.onEnvironmentUpdated({
          weather: this.data.weather,
          waterTempAdjusted: this.data.waterTempAdjusted,
          waterHardness: this.data.waterHardness,
          hardnessAdjustment: this.data.hardnessAdjustment
        });
      }
    }
    wx.navigateBack();
  },

  goToBrewRecord: function() {
    wx.navigateTo({
      url: '/pages/brewRecord/brewRecord' + (this.data.traceId ? '?traceId=' + this.data.traceId : '')
    });
  }
});
