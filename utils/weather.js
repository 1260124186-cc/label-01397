var WEATHER_CACHE_KEY = 'weather_cache';
var WEATHER_CACHE_TTL = 3600000;

var DEFAULT_WATER_TEMP_MIN = 85;
var DEFAULT_WATER_TEMP_MAX = 90;

var MOCK_WEATHER_DATA = {
  '北京': { temp: 28, weather: '晴', humidity: 45, city: '北京' },
  '上海': { temp: 32, weather: '多云', humidity: 70, city: '上海' },
  '广州': { temp: 35, weather: '雷阵雨', humidity: 85, city: '广州' },
  '深圳': { temp: 33, weather: '晴', humidity: 75, city: '深圳' },
  '杭州': { temp: 30, weather: '多云', humidity: 65, city: '杭州' },
  '成都': { temp: 26, weather: '阴', humidity: 80, city: '成都' },
  '武汉': { temp: 34, weather: '晴', humidity: 60, city: '武汉' },
  '咸宁': { temp: 32, weather: '晴', humidity: 58, city: '咸宁' },
  '福州': { temp: 31, weather: '多云', humidity: 72, city: '福州' },
  '武夷山': { temp: 27, weather: '多云', humidity: 78, city: '武夷山' }
};

function getWeatherCache() {
  try {
    var cached = wx.getStorageSync(WEATHER_CACHE_KEY);
    if (cached && cached.timestamp && (Date.now() - cached.timestamp < WEATHER_CACHE_TTL)) {
      return cached.data;
    }
  } catch (e) {
    console.error('[Weather] 获取缓存失败:', e);
  }
  return null;
}

function setWeatherCache(data) {
  try {
    wx.setStorageSync(WEATHER_CACHE_KEY, {
      data: data,
      timestamp: Date.now()
    });
  } catch (e) {
    console.error('[Weather] 设置缓存失败:', e);
  }
}

function getCityWeather(city) {
  return new Promise(function(resolve, reject) {
    if (!city) {
      reject(new Error('城市名称不能为空'));
      return;
    }

    var cached = getWeatherCache();
    if (cached && cached.city === city) {
      resolve(cached);
      return;
    }

    setTimeout(function() {
      var weather = MOCK_WEATHER_DATA[city];
      if (!weather) {
        weather = {
          temp: 25 + Math.floor(Math.random() * 10),
          weather: ['晴', '多云', '阴', '小雨'][Math.floor(Math.random() * 4)],
          humidity: 50 + Math.floor(Math.random() * 30),
          city: city
        };
      }
      setWeatherCache(weather);
      resolve(weather);
    }, 300);
  });
}

function getCurrentLocationWeather() {
  return new Promise(function(resolve, reject) {
    var cached = getWeatherCache();
    if (cached) {
      resolve(cached);
      return;
    }

    wx.getLocation({
      type: 'gcj02',
      success: function(res) {
        var mockCities = ['咸宁', '武汉', '福州', '武夷山', '杭州'];
        var city = mockCities[Math.floor(Math.random() * mockCities.length)];
        getCityWeather(city).then(resolve).catch(reject);
      },
      fail: function() {
        console.warn('[Weather] 获取位置失败，使用默认城市');
        getCityWeather('咸宁').then(resolve).catch(reject);
      }
    });
  });
}

function adjustWaterTempByWeather(temp, baseMin, baseMax) {
  var min = baseMin || DEFAULT_WATER_TEMP_MIN;
  var max = baseMax || DEFAULT_WATER_TEMP_MAX;
  var range = max - min;

  var adjusted = {
    min: min,
    max: max,
    recommended: Math.round((min + max) / 2),
    reason: '',
    tempLevel: ''
  };

  if (temp >= 35) {
    adjusted.min = min;
    adjusted.max = min + Math.round(range * 0.3);
    adjusted.recommended = min;
    adjusted.reason = '天气炎热（' + temp + '℃），建议使用偏下限水温，避免茶汤苦涩';
    adjusted.tempLevel = 'hot';
  } else if (temp >= 30) {
    adjusted.min = min;
    adjusted.max = min + Math.round(range * 0.5);
    adjusted.recommended = min + Math.round(range * 0.2);
    adjusted.reason = '气温较高（' + temp + '℃），建议水温稍低，保留清香';
    adjusted.tempLevel = 'warm';
  } else if (temp >= 20) {
    adjusted.min = min + Math.round(range * 0.2);
    adjusted.max = max - Math.round(range * 0.2);
    adjusted.recommended = Math.round((min + max) / 2);
    adjusted.reason = '温度适宜（' + temp + '℃），使用常规水温即可';
    adjusted.tempLevel = 'comfortable';
  } else if (temp >= 10) {
    adjusted.min = min + Math.round(range * 0.4);
    adjusted.max = max;
    adjusted.recommended = min + Math.round(range * 0.7);
    adjusted.reason = '气温较低（' + temp + '℃），建议水温稍高，更好激发茶香';
    adjusted.tempLevel = 'cool';
  } else {
    adjusted.min = min + Math.round(range * 0.5);
    adjusted.max = max;
    adjusted.recommended = max;
    adjusted.reason = '天气寒冷（' + temp + '℃），建议使用偏上限水温，充分释放茶味';
    adjusted.tempLevel = 'cold';
  }

  return adjusted;
}

module.exports = {
  getCityWeather: getCityWeather,
  getCurrentLocationWeather: getCurrentLocationWeather,
  adjustWaterTempByWeather: adjustWaterTempByWeather,
  DEFAULT_WATER_TEMP_MIN: DEFAULT_WATER_TEMP_MIN,
  DEFAULT_WATER_TEMP_MAX: DEFAULT_WATER_TEMP_MAX
};
