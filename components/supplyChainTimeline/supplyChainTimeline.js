Component({
  properties: {
    timeline: {
      type: Array,
      value: []
    },
    mode: {
      type: String,
      value: 'vertical'
    },
    showAbnormalOnly: {
      type: Boolean,
      value: false
    }
  },

  data: {
    displayTimeline: [],
    expandedNodes: {},
    selectedNode: null,
    showDetailModal: false
  },

  observers: {
    'timeline, showAbnormalOnly': function(timeline, showAbnormalOnly) {
      this.updateDisplayTimeline();
    }
  },

  lifetimes: {
    attached: function() {
      this.updateDisplayTimeline();
    }
  },

  methods: {
    updateDisplayTimeline: function() {
      var timeline = this.properties.timeline || [];
      var showAbnormalOnly = this.properties.showAbnormalOnly;
      var displayTimeline = showAbnormalOnly 
        ? timeline.filter(function(node) { return node.isAbnormal; })
        : timeline;
      this.setData({ displayTimeline: displayTimeline });
    },

    formatTime: function(timeStr) {
      if (!timeStr) return '';
      var parts = timeStr.split(' ');
      return parts[0] + '\n' + (parts[1] || '').substring(0, 5);
    },

    toggleNode: function(e) {
      var nodeId = e.currentTarget.dataset.id;
      var expandedNodes = this.data.expandedNodes;
      expandedNodes[nodeId] = !expandedNodes[nodeId];
      this.setData({ expandedNodes: expandedNodes });
    },

    showNodeDetail: function(e) {
      var node = e.currentTarget.dataset.node;
      this.setData({
        selectedNode: node,
        showDetailModal: true
      });
    },

    closeDetailModal: function() {
      this.setData({
        showDetailModal: false,
        selectedNode: null
      });
    },

    preventBubble: function() {},

    previewPhoto: function(e) {
      var current = e.currentTarget.dataset.url;
      var urls = this.data.selectedNode && this.data.selectedNode.photos || [];
      wx.previewImage({
        current: current,
        urls: urls
      });
    },

    copyChainHash: function(e) {
      var hash = e.currentTarget.dataset.hash;
      if (!hash) return;
      wx.setClipboardData({
        data: hash,
        success: function() {
          wx.showToast({ title: '哈希值已复制', icon: 'success', duration: 1500 });
        }
      });
    }
  }
});
