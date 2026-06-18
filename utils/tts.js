/**
 * 语音播报 TTS 工具模块
 * 功能：封装微信小程序语音播报能力，支持语速/音量调节、队列播放、连续播报模式
 * 说明：优先使用微信同声传译插件，降级方案为模拟播报（便于开发调试）
 */

const STORAGE_KEY_SPEED = 'tts_speed';
const STORAGE_KEY_VOLUME = 'tts_volume';
const STORAGE_KEY_ENABLED = 'tts_enabled';

const DEFAULT_SPEED = 1.0;
const DEFAULT_VOLUME = 1.0;
const MIN_SPEED = 0.5;
const MAX_SPEED = 2.0;
const MIN_VOLUME = 0.1;
const MAX_VOLUME = 1.0;

let _instance = null;

class TTSManager {
  constructor() {
    this.isPlaying = false;
    this.isPaused = false;
    this.currentText = '';
    this.currentIndex = -1;
    this.queue = [];
    this.speed = this._loadSpeed();
    this.volume = this._loadVolume();
    this.enabled = this._loadEnabled();
    this.plugin = null;
    this.innerAudioContext = null;
    this.onEndCallback = null;
    this.onStartCallback = null;
    this.onErrorCallback = null;
    this.onProgressCallback = null;
    this._initPlugin();
  }

  static getInstance() {
    if (!_instance) {
      _instance = new TTSManager();
    }
    return _instance;
  }

  _initPlugin() {
    try {
      if (wx.requireNativePlugin) {
        this.plugin = wx.requireNativePlugin('WechatSI');
      }
    } catch (e) {
      console.warn('[TTS] 同声传译插件不可用，使用降级方案');
    }
    if (!this.plugin) {
      try {
        const plugin = requirePlugin('WechatSI');
        if (plugin) {
          this.plugin = plugin;
        }
      } catch (e) {
        console.warn('[TTS] WechatSI 插件不可用，将使用模拟播报模式');
      }
    }
  }

  _loadSpeed() {
    try {
      const stored = wx.getStorageSync(STORAGE_KEY_SPEED);
      if (stored && stored >= MIN_SPEED && stored <= MAX_SPEED) {
        return stored;
      }
    } catch (e) {}
    return DEFAULT_SPEED;
  }

  _loadVolume() {
    try {
      const stored = wx.getStorageSync(STORAGE_KEY_VOLUME);
      if (stored && stored >= MIN_VOLUME && stored <= MAX_VOLUME) {
        return stored;
      }
    } catch (e) {}
    return DEFAULT_VOLUME;
  }

  _loadEnabled() {
    try {
      const stored = wx.getStorageSync(STORAGE_KEY_ENABLED);
      return stored !== false;
    } catch (e) {}
    return true;
  }

  _saveSpeed() {
    try {
      wx.setStorageSync(STORAGE_KEY_SPEED, this.speed);
    } catch (e) {}
  }

  _saveVolume() {
    try {
      wx.setStorageSync(STORAGE_KEY_VOLUME, this.volume);
    } catch (e) {}
  }

  _saveEnabled() {
    try {
      wx.setStorageSync(STORAGE_KEY_ENABLED, this.enabled);
    } catch (e) {}
  }

  setSpeed(speed) {
    if (speed < MIN_SPEED) speed = MIN_SPEED;
    if (speed > MAX_SPEED) speed = MAX_SPEED;
    this.speed = speed;
    this._saveSpeed();
    console.log('[TTS] 语速设置为:', speed);
    return this.speed;
  }

  getSpeed() {
    return this.speed;
  }

  setVolume(volume) {
    if (volume < MIN_VOLUME) volume = MIN_VOLUME;
    if (volume > MAX_VOLUME) volume = MAX_VOLUME;
    this.volume = volume;
    this._saveVolume();
    if (this.innerAudioContext) {
      this.innerAudioContext.volume = this.volume;
    }
    console.log('[TTS] 音量设置为:', volume);
    return this.volume;
  }

  getVolume() {
    return this.volume;
  }

  setEnabled(enabled) {
    this.enabled = !!enabled;
    this._saveEnabled();
    if (!this.enabled && this.isPlaying) {
      this.stop();
    }
    return this.enabled;
  }

  isEnabled() {
    return this.enabled;
  }

  speak(text, options = {}) {
    if (!this.enabled || !text || !text.trim()) {
      return Promise.resolve(false);
    }

    this.stop();

    return new Promise((resolve, reject) => {
      this.currentText = text;

      if (this.plugin && this.plugin.textToSpeech) {
        this._speakWithPlugin(text, options, resolve, reject);
      } else {
        this._speakWithMock(text, options, resolve, reject);
      }
    });
  }

  _speakWithPlugin(text, options, resolve, reject) {
    const that = this;

    try {
      this.plugin.textToSpeech({
        lang: options.lang || 'zh_CN',
        tts: true,
        content: text,
        speed: this.speed,
        volume: this.volume,
        success: function(res) {
          console.log('[TTS] 插件转文字成功:', res);
          if (res.filename) {
            that._playAudio(res.filename, options, resolve, reject);
          } else {
            resolve(true);
          }
        },
        fail: function(err) {
          console.error('[TTS] 插件转文字失败:', err);
          that._speakWithMock(text, options, resolve, reject);
        }
      });
    } catch (e) {
      console.error('[TTS] 插件调用异常:', e);
      this._speakWithMock(text, options, resolve, reject);
    }
  }

  _speakWithMock(text, options, resolve, reject) {
    const that = this;
    const baseTime = 500;
    const charTime = 200 / this.speed;
    const duration = baseTime + text.length * charTime;

    console.log('[TTS] 模拟播报:', text.substring(0, 30) + '...', '预计时长:', duration + 'ms');

    this.isPlaying = true;
    this.isPaused = false;

    if (this.onStartCallback) {
      this.onStartCallback({ text: text });
    }

    if (this.onProgressCallback) {
      this.onProgressCallback({ text: text, progress: 0 });
    }

    let elapsed = 0;
    const interval = 100;

    this._mockTimer = setInterval(() => {
      if (that.isPaused) return;

      elapsed += interval;
      const progress = Math.min(elapsed / duration, 1);

      if (that.onProgressCallback) {
        that.onProgressCallback({ text: text, progress: progress });
      }

      if (elapsed >= duration) {
        clearInterval(that._mockTimer);
        that._mockTimer = null;
        that.isPlaying = false;
        that.currentText = '';

        if (that.onEndCallback) {
          that.onEndCallback({ text: text });
        }

        resolve(true);
      }
    }, interval);
  }

  _playAudio(url, options, resolve, reject) {
    const that = this;

    if (this.innerAudioContext) {
      this.innerAudioContext.destroy();
    }

    this.innerAudioContext = wx.createInnerAudioContext();
    this.innerAudioContext.src = url;
    this.innerAudioContext.volume = this.volume;

    this.innerAudioContext.onPlay(() => {
      console.log('[TTS] 开始播放');
      that.isPlaying = true;
      that.isPaused = false;
      if (that.onStartCallback) {
        that.onStartCallback({ text: that.currentText });
      }
    });

    this.innerAudioContext.onEnded(() => {
      console.log('[TTS] 播放结束');
      that.isPlaying = false;
      that.isPaused = false;
      if (that.onEndCallback) {
        that.onEndCallback({ text: that.currentText });
      }
      that.currentText = '';
      resolve(true);
    });

    this.innerAudioContext.onError((err) => {
      console.error('[TTS] 播放错误:', err);
      that.isPlaying = false;
      that.isPaused = false;
      if (that.onErrorCallback) {
        that.onErrorCallback(err);
      }
      reject(err);
    });

    this.innerAudioContext.play();
  }

  pause() {
    if (!this.isPlaying) return;

    if (this.innerAudioContext) {
      this.innerAudioContext.pause();
    }

    this.isPaused = true;
    console.log('[TTS] 暂停播放');
  }

  resume() {
    if (!this.isPlaying || !this.isPaused) return;

    if (this.innerAudioContext) {
      this.innerAudioContext.play();
    }

    this.isPaused = false;
    console.log('[TTS] 恢复播放');
  }

  stop() {
    if (this._mockTimer) {
      clearInterval(this._mockTimer);
      this._mockTimer = null;
    }

    if (this.innerAudioContext) {
      this.innerAudioContext.stop();
      this.innerAudioContext.destroy();
      this.innerAudioContext = null;
    }

    this.isPlaying = false;
    this.isPaused = false;
    this.currentText = '';
    this.currentIndex = -1;
    this.queue = [];

    console.log('[TTS] 停止播放');
  }

  speakQueue(items, options = {}) {
    if (!items || items.length === 0) {
      return Promise.resolve(false);
    }

    this.stop();
    this.queue = [...items];
    this.currentIndex = 0;

    return this._playNextInQueue(options);
  }

  _playNextInQueue(options) {
    const that = this;

    if (this.currentIndex >= this.queue.length) {
      console.log('[TTS] 队列播放完毕');
      return Promise.resolve(true);
    }

    const item = this.queue[this.currentIndex];
    const text = typeof item === 'string' ? item : (item.text || '');

    if (!text || !text.trim()) {
      this.currentIndex++;
      return this._playNextInQueue(options);
    }

    if (this.onProgressCallback) {
      this.onProgressCallback({
        queueIndex: this.currentIndex,
        queueTotal: this.queue.length,
        text: text,
        progress: 0
      });
    }

    return this.speak(text, options).then(() => {
      that.currentIndex++;
      if (that.currentIndex < that.queue.length) {
        return new Promise(resolve => {
          setTimeout(() => {
            that._playNextInQueue(options).then(resolve);
          }, options.interval || 300);
        });
      }
      return true;
    }).catch(err => {
      console.error('[TTS] 队列播放出错:', err);
      that.currentIndex++;
      if (that.currentIndex < that.queue.length) {
        return that._playNextInQueue(options);
      }
      throw err;
    });
  }

  getQueueInfo() {
    return {
      isPlaying: this.isPlaying,
      isPaused: this.isPaused,
      currentIndex: this.currentIndex,
      total: this.queue.length,
      currentText: this.currentText,
      queue: this.queue
    };
  }

  onStart(callback) {
    this.onStartCallback = callback;
  }

  onEnd(callback) {
    this.onEndCallback = callback;
  }

  onError(callback) {
    this.onErrorCallback = callback;
  }

  onProgress(callback) {
    this.onProgressCallback = callback;
  }

  destroy() {
    this.stop();
    this.onStartCallback = null;
    this.onEndCallback = null;
    this.onErrorCallback = null;
    this.onProgressCallback = null;
  }

  getSpeedOptions() {
    return [
      { value: 0.5, label: '0.5x' },
      { value: 0.75, label: '0.75x' },
      { value: 1.0, label: '1.0x' },
      { value: 1.25, label: '1.25x' },
      { value: 1.5, label: '1.5x' },
      { value: 2.0, label: '2.0x' }
    ];
  }

  getVolumeOptions() {
    return [
      { value: 0.2, label: '低' },
      { value: 0.5, label: '中' },
      { value: 0.8, label: '高' },
      { value: 1.0, label: '最大' }
    ];
  }
}

function getTTSManager() {
  return TTSManager.getInstance();
}

function buildDetailModuleTexts(traceData, options = {}) {
  if (!traceData) return [];

  const texts = [];
  const includeModules = options.includeModules || null;

  function shouldInclude(moduleKey) {
    if (!includeModules) return true;
    return includeModules.indexOf(moduleKey) !== -1;
  }

  if (shouldInclude('basic') && traceData.basicInfo) {
    const info = traceData.basicInfo;
    texts.push({
      key: 'basic',
      title: '基础信息',
      text: `基础信息。产品名称：${info.productName}。溯源ID：${info.traceId}。批次号：${info.batchNo}。采摘时间：${info.pickTime}。出厂时间：${info.productionTime}。`
    });
  }

  if (shouldInclude('treeAge') && traceData.treeAge) {
    const treeAge = traceData.treeAge;
    texts.push({
      key: 'treeAge',
      title: '树龄信息',
      text: `树龄信息。茶树龄：${treeAge.teaTreeAge}年，产地：${treeAge.teaTreeLocation}。桂花树龄：${treeAge.osmanthusTreeAge}年，产地：${treeAge.osmanthusTreeLocation}。`
    });
  }

  if (shouldInclude('process') && traceData.scentingProcess) {
    const process = traceData.scentingProcess;
    texts.push({
      key: 'process',
      title: '窨制工艺',
      text: `窨制工艺。共${process.scentingTimes}次窨制，每次时长${process.scentingDuration}小时，窨制温度${process.temperature}摄氏度，花茶配比${process.ratio}。工艺步骤包括：${process.processSteps.map(s => s.name).join('、')}。`
    });
  }

  if (shouldInclude('test') && traceData.pesticideTest) {
    const test = traceData.pesticideTest;
    const status = test.hasAbnormal ? '存在异常' : '全部合格';
    texts.push({
      key: 'test',
      title: '农残检测',
      text: `农残检测结论：${status}。检测报告编号：${test.reportNo}。检测机构：${test.institution}。检测日期：${test.testDate}。共检测${test.teaTests ? test.teaTests.length : 0}项茶叶指标和${test.osmanthusTests ? test.osmanthusTests.length : 0}项桂花指标。`
    });
  }

  if (shouldInclude('brew') && traceData.brewingGuide) {
    const brew = traceData.brewingGuide;
    texts.push({
      key: 'brew',
      title: '冲泡建议',
      text: `冲泡建议。推荐水温：${brew.waterTemp}摄氏度。建议茶量：${brew.teaAmount}。冲泡时间：${brew.brewTime}。推荐水比：${brew.waterRatio}。${brew.tips ? '小贴士：' + brew.tips.join('。') + '。' : ''}`
    });
  }

  if (shouldInclude('green') && traceData.greenTrace) {
    const green = traceData.greenTrace;
    texts.push({
      key: 'green',
      title: '绿色溯源',
      text: `绿色溯源。${green.ecoPlanting ? '生态种植：' + green.ecoPlanting.records.join('，') + '。' : ''}${green.ecoPacking ? '环保包装：' + green.ecoPacking.records.join('，') + '。' : ''}`
    });
  }

  return texts;
}

function buildScanResultText(verifyResult, options = {}) {
  if (!verifyResult) return '';

  const parts = [];

  const authenticity = verifyResult.authenticity;
  const authenticityText = {
    'genuine': '正品验证通过',
    'suspicious': '验证结果存疑',
    'fake': '验证不通过，可能为仿冒产品'
  }[authenticity] || '验证结果未知';

  parts.push(authenticityText + '。');

  if (verifyResult.title) {
    parts.push(verifyResult.title + '。');
  }

  if (verifyResult.message) {
    parts.push(verifyResult.message + '。');
  }

  if (verifyResult.scanType === 'first') {
    parts.push('这是您首次扫码验证。');
  } else {
    parts.push(`该产品已累计查询${verifyResult.scanInfo ? verifyResult.scanInfo.totalQueryCount : 0}次。`);
  }

  if (verifyResult.factoryInfo) {
    const factory = verifyResult.factoryInfo;
    parts.push(`产品名称：${factory.productName}。规格：${factory.specification}。批次号：${factory.batchNo}。`);
  }

  if (verifyResult.abnormal && verifyResult.abnormal.isAbnormal) {
    parts.push('注意：该产品存在安全告警，请谨慎购买。');
    if (verifyResult.abnormal.alerts && verifyResult.abnormal.alerts.length > 0) {
      parts.push(`共${verifyResult.abnormal.alerts.length}项告警。`);
    }
  }

  return parts.join('');
}

module.exports = {
  getTTSManager,
  buildDetailModuleTexts,
  buildScanResultText,
  DEFAULT_SPEED,
  DEFAULT_VOLUME,
  MIN_SPEED,
  MAX_SPEED,
  MIN_VOLUME,
  MAX_VOLUME
};
