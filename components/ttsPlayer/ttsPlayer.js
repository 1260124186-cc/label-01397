/**
 * 语音播报控制组件
 * 功能：播放/暂停/停止、语速调节、音量调节、进度显示
 */

const tts = require('../../utils/tts.js');

Component({
  properties: {
    text: {
      type: String,
      value: ''
    },
    queue: {
      type: Array,
      value: []
    },
    mode: {
      type: String,
      value: 'single'
    },
    showSpeedControl: {
      type: Boolean,
      value: true
    },
    showVolumeControl: {
      type: Boolean,
      value: true
    },
    compact: {
      type: Boolean,
      value: false
    },
    autoPlay: {
      type: Boolean,
      value: false
    }
  },

  data: {
    isPlaying: false,
    isPaused: false,
    progress: 0,
    currentIndex: -1,
    totalCount: 0,
    currentText: '',
    speed: 1.0,
    volume: 1.0,
    speedOptions: [],
    volumeOptions: [],
    showSpeedPanel: false,
    showVolumePanel: false,
    enabled: true
  },

  lifetimes: {
    attached: function() {
      this._ttsManager = tts.getTTSManager();
      this._bindEvents();
      this._initSettings();
    },
    detached: function() {
      if (this._ttsManager) {
        this._ttsManager.destroy();
      }
    }
  },

  observers: {
    'text': function(text) {
      if (text && this.properties.autoPlay && !this.data.isPlaying) {
        this.playText();
      }
    },
    'queue': function(queue) {
      if (queue && queue.length > 0 && this.properties.autoPlay && !this.data.isPlaying) {
        this.playQueue();
      }
    }
  },

  methods: {
    _initSettings: function() {
      const manager = this._ttsManager;
      this.setData({
        speed: manager.getSpeed(),
        volume: manager.getVolume(),
        enabled: manager.isEnabled(),
        speedOptions: manager.getSpeedOptions(),
        volumeOptions: manager.getVolumeOptions()
      });
    },

    _bindEvents: function() {
      const that = this;
      const manager = this._ttsManager;

      manager.onStart(function(info) {
        that.setData({
          isPlaying: true,
          isPaused: false,
          currentText: info.text,
          progress: 0
        });
        that.triggerEvent('onstart', info);
      });

      manager.onEnd(function(info) {
        that.setData({
          isPlaying: false,
          isPaused: false,
          progress: 100
        });
        that.triggerEvent('onend', info);
      });

      manager.onError(function(err) {
        that.setData({
          isPlaying: false,
          isPaused: false
        });
        that.triggerEvent('onerror', err);
      });

      manager.onProgress(function(info) {
        const data = {
          progress: Math.round(info.progress * 100),
          currentText: info.text
        };
        if (info.queueIndex !== undefined) {
          data.currentIndex = info.queueIndex;
          data.totalCount = info.queueTotal;
        }
        that.setData(data);
        that.triggerEvent('onprogress', info);
      });
    },

    playText: function() {
      const text = this.properties.text;
      if (!text || !text.trim()) return;

      this._ttsManager.speak(text).catch(err => {
        console.error('[TTSPlayer] 播放失败:', err);
      });
    },

    playQueue: function() {
      const queue = this.properties.queue;
      if (!queue || queue.length === 0) return;

      const texts = queue.map(item => {
        return typeof item === 'string' ? item : item.text;
      }).filter(t => t && t.trim());

      this.setData({ totalCount: texts.length, currentIndex: 0 });

      this._ttsManager.speakQueue(texts, { interval: 300 }).catch(err => {
        console.error('[TTSPlayer] 队列播放失败:', err);
      });
    },

    togglePlay: function() {
      if (this.data.isPlaying) {
        if (this.data.isPaused) {
          this.resume();
        } else {
          this.pause();
        }
      } else {
        if (this.properties.mode === 'queue' && this.properties.queue.length > 0) {
          this.playQueue();
        } else {
          this.playText();
        }
      }
    },

    pause: function() {
      this._ttsManager.pause();
      this.setData({ isPaused: true });
    },

    resume: function() {
      this._ttsManager.resume();
      this.setData({ isPaused: false });
    },

    stop: function() {
      this._ttsManager.stop();
      this.setData({
        isPlaying: false,
        isPaused: false,
        progress: 0,
        currentIndex: -1
      });
    },

    toggleSpeedPanel: function() {
      this.setData({
        showSpeedPanel: !this.data.showSpeedPanel,
        showVolumePanel: false
      });
    },

    toggleVolumePanel: function() {
      this.setData({
        showVolumePanel: false,
        showSpeedPanel: false
      });
      this.setData({
        showVolumePanel: !this.data.showVolumePanel
      });
    },

    selectSpeed: function(e) {
      const speed = e.currentTarget.dataset.speed;
      const newSpeed = this._ttsManager.setSpeed(speed);
      this.setData({
        speed: newSpeed,
        showSpeedPanel: false
      });
      this.triggerEvent('onspeedchange', { speed: newSpeed });
    },

    selectVolume: function(e) {
      const volume = e.currentTarget.dataset.volume;
      const newVolume = this._ttsManager.setVolume(volume);
      this.setData({
        volume: newVolume,
        showVolumePanel: false
      });
      this.triggerEvent('onvolumechange', { volume: newVolume });
    },

    closePanels: function() {
      this.setData({
        showSpeedPanel: false,
        showVolumePanel: false
      });
    },

    getSpeedLabel: function() {
      const speed = this.data.speed;
      return speed + 'x';
    },

    getVolumeLabel: function() {
      const volume = this.data.volume;
      if (volume <= 0.2) return '低';
      if (volume <= 0.5) return '中';
      if (volume <= 0.8) return '高';
      return '最大';
    }
  }
});
