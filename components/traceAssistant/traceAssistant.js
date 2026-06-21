var traceAssistant = require('../../utils/traceAssistant.js');

Component({
  properties: {
    traceId: {
      type: String,
      value: ''
    },
    traceData: {
      type: Object,
      value: null
    }
  },

  data: {
    showPanel: false,
    inputText: '',
    canSend: false,
    messages: [],
    suggestedQuestions: [],
    thinking: false,
    scrollTop: 0
  },

  observers: {
    'traceId': function(traceId) {
      if (traceId) {
        this.loadHistory();
        this.setData({
          suggestedQuestions: traceAssistant.getSuggestedQuestions()
        });
      }
    }
  },

  methods: {
    loadHistory: function() {
      var traceId = this.properties.traceId;
      if (!traceId) return;
      var history = traceAssistant.getHistory(traceId);
      this.setData({ messages: history });
      this.scrollToBottom();
    },

    togglePanel: function() {
      var show = !this.data.showPanel;
      this.setData({ showPanel: show });
      if (show) {
        this.loadHistory();
        this.setData({
          suggestedQuestions: traceAssistant.getSuggestedQuestions()
        });
        var that = this;
        setTimeout(function() {
          that.scrollToBottom();
        }, 300);
      }
    },

    closePanel: function() {
      this.setData({ showPanel: false });
    },

    onInputChange: function(e) {
      var value = e.detail.value;
      this.setData({
        inputText: value,
        canSend: value && value.trim().length > 0
      });
    },

    sendMessage: function() {
      var text = this.data.inputText.trim();
      if (!text) return;

      var traceId = this.properties.traceId;
      var traceData = this.properties.traceData;

      this.setData({ inputText: '', canSend: false });

      var userMsg = {
        id: Date.now().toString() + '_user',
        role: 'user',
        content: text,
        type: 'question',
        timestamp: Date.now()
      };

      var messages = this.data.messages.concat([userMsg]);
      this.setData({ messages: messages, thinking: true });
      this.scrollToBottom();

      if (traceId) {
        traceAssistant.addMessage(traceId, userMsg);
      }

      var that = this;
      setTimeout(function() {
        var result = traceAssistant.answerQuestion(text, traceData);

        var botMsg = {
          id: Date.now().toString() + '_bot',
          role: 'assistant',
          content: result.answer,
          type: result.type,
          sources: result.sources || [],
          timestamp: Date.now()
        };

        var newMessages = that.data.messages.concat([botMsg]);
        that.setData({ messages: newMessages, thinking: false });

        if (traceId) {
          traceAssistant.addMessage(traceId, botMsg);
        }

        that.scrollToBottom();
      }, 400 + Math.random() * 300);
    },

    askSuggested: function(e) {
      var question = e.currentTarget.dataset.question;
      if (!question) return;
      this.setData({ inputText: question, canSend: true });
      this.sendMessage();
    },

    clearChat: function() {
      var traceId = this.properties.traceId;
      if (traceId) {
        traceAssistant.clearHistory(traceId);
      }
      this.setData({ messages: [] });
      wx.showToast({
        title: '已清空对话',
        icon: 'success',
        duration: 1200
      });
    },

    scrollToBottom: function() {
      var that = this;
      setTimeout(function() {
        that.setData({ scrollTop: 99999 });
      }, 50);
    },

    preventBubble: function() {},

    onMessageScroll: function(e) {
      this.setData({ scrollTop: e.detail.scrollTop });
    }
  }
});
