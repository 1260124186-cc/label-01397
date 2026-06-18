Component({
  properties: {
    steps: {
      type: Array,
      value: []
    },
    sampleNo: {
      type: String,
      value: ''
    },
    reportNo: {
      type: String,
      value: ''
    }
  },

  data: {
    expandedSteps: {},
    previewVisible: false,
    previewUrls: [],
    previewCurrent: ''
  },

  observers: {
    'steps': function(steps) {
      var expandedSteps = {};
      if (steps && steps.length > 0) {
        steps.forEach(function(step, index) {
          expandedSteps[index] = false;
        });
      }
      this.setData({ expandedSteps: expandedSteps });
    }
  },

  methods: {
    toggleStep: function(e) {
      var step = e.currentTarget.dataset.step;
      var expandedSteps = this.data.expandedSteps;
      expandedSteps[step] = !expandedSteps[step];
      this.setData({ expandedSteps: expandedSteps });
    },

    previewPhoto: function(e) {
      var current = e.currentTarget.dataset.url;
      var urls = e.currentTarget.dataset.urls || [];
      wx.previewImage({
        current: current,
        urls: urls
      });
    },

    previewSignature: function(e) {
      var url = e.currentTarget.dataset.url;
      if (!url) return;
      wx.previewImage({
        current: url,
        urls: [url]
      });
    },

    goToReport: function(e) {
      var step = e.currentTarget.dataset.step;
      var sampleNo = e.currentTarget.dataset.sampleno || this.properties.sampleNo;
      var abnormalReason = '';
      if (this.properties.steps && this.properties.steps[step]) {
        abnormalReason = this.properties.steps[step].abnormalReason || '';
      }
      wx.navigateTo({
        url: '/pages/reportProduct/reportProduct?type=sample_abnormal&sampleNo=' + sampleNo + '&abnormalReason=' + encodeURIComponent(abnormalReason)
      });
    }
  }
});
