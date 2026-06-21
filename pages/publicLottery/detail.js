const publicLottery = require('../../utils/publicLottery.js');

Page({
  data: {
    roundId: '',
    roundDetail: null,
    loading: true,
    showWitnessModal: false,
    witnessForm: {
      name: '',
      phone: ''
    },
    witnessSubmitting: false,
    witnessResult: null,
    expandedSections: {
      draw: true,
      witness: false,
      result: false,
      blockchain: false,
      narrative: false
    }
  },

  onLoad: function(options) {
    if (options && options.roundId) {
      this.setData({ roundId: options.roundId });
      this.loadRoundDetail(options.roundId);
    }
  },

  loadRoundDetail: function(roundId) {
    var that = this;
    that.setData({ loading: true });

    setTimeout(function() {
      var allRounds = publicLottery.getAllLotteryRounds();
      var round = null;

      for (var i = 0; i < allRounds.length; i++) {
        if (allRounds[i].roundId === roundId) {
          round = allRounds[i];
          break;
        }
      }

      if (!round) {
        that.setData({ loading: false });
        wx.showToast({ title: '未找到抽检记录', icon: 'none' });
        return;
      }

      var localRegistrations = publicLottery.getWitnessRegistrations(roundId);
      var mergedWitnesses = (round.consumerWitnesses || []).concat(localRegistrations);

      var inspectionTypeLabels = [];
      for (var j = 0; j < round.inspectionTypes.length; j++) {
        inspectionTypeLabels.push(publicLottery.getInspectionTypeLabel(round.inspectionTypes[j]));
      }

      that.setData({
        loading: false,
        roundDetail: Object.assign({}, round, {
          statusLabel: publicLottery.getStatusLabel(round.status),
          statusColor: publicLottery.getStatusColor(round.status),
          consumerWitnesses: mergedWitnesses,
          currentWitnessCount: mergedWitnesses.length,
          isWitnessFull: mergedWitnesses.length >= round.maxWitnesses,
          inspectionTypeLabels: inspectionTypeLabels.join('、')
        })
      });
    }, 300);
  },

  toggleSection: function(e) {
    var key = e.currentTarget.dataset.key;
    var expandedSections = this.data.expandedSections;
    expandedSections[key] = !expandedSections[key];
    this.setData({ expandedSections: expandedSections });
  },

  openWitnessModal: function() {
    var round = this.data.roundDetail;
    if (!round) return;

    if (round.status === publicLottery.LOTTERY_STATUS.CLOSED || round.status === publicLottery.LOTTERY_STATUS.REPORTED) {
      wx.showToast({ title: '该轮抽检已结束', icon: 'none' });
      return;
    }

    if (round.isWitnessFull) {
      wx.showToast({ title: '见证名额已满', icon: 'none' });
      return;
    }

    this.setData({ showWitnessModal: true, witnessResult: null });
  },

  closeWitnessModal: function() {
    this.setData({ showWitnessModal: false });
  },

  onWitnessNameInput: function(e) {
    this.setData({ 'witnessForm.name': e.detail.value });
  },

  onWitnessPhoneInput: function(e) {
    this.setData({ 'witnessForm.phone': e.detail.value });
  },

  submitWitnessRegistration: function() {
    var form = this.data.witnessForm;

    if (!form.name || form.name.trim().length < 2) {
      wx.showToast({ title: '请输入真实姓名', icon: 'none' });
      return;
    }

    if (!form.phone || !/^1\d{10}$/.test(form.phone)) {
      wx.showToast({ title: '请输入正确手机号', icon: 'none' });
      return;
    }

    this.setData({ witnessSubmitting: true });

    var that = this;
    setTimeout(function() {
      var result = publicLottery.registerWitness(
        that.data.roundId,
        form.name.trim(),
        form.phone
      );

      that.setData({
        witnessSubmitting: false,
        witnessResult: result
      });

      if (result.success) {
        that.loadRoundDetail(that.data.roundId);
      }
    }, 500);
  },

  openLiveStream: function() {
    var round = this.data.roundDetail;
    if (!round || !round.liveStreamUrl) {
      wx.showToast({ title: '暂无直播链接', icon: 'none' });
      return;
    }

    wx.navigateTo({
      url: '/pages/webview/webview?url=' + encodeURIComponent(round.liveStreamUrl) + '&title=' + encodeURIComponent('公开抽检直播')
    });
  },

  openReplay: function() {
    var round = this.data.roundDetail;
    if (!round || !round.replayUrl) {
      wx.showToast({ title: '暂无回放链接', icon: 'none' });
      return;
    }

    wx.navigateTo({
      url: '/pages/webview/webview?url=' + encodeURIComponent(round.replayUrl) + '&title=' + encodeURIComponent('抽检回放')
    });
  },

  viewBlockchainDetail: function() {
    var round = this.data.roundDetail;
    if (!round || !round.blockchainEndorsement || !round.blockchainEndorsement.blockExplorerUrl) {
      wx.showToast({ title: '暂无链上详情', icon: 'none' });
      return;
    }

    wx.navigateTo({
      url: '/pages/webview/webview?url=' + encodeURIComponent(round.blockchainEndorsement.blockExplorerUrl) + '&title=' + encodeURIComponent('链上验真')
    });
  },

  copyToClipboard: function(e) {
    var text = e.currentTarget.dataset.text;
    if (!text) return;

    wx.setClipboardData({
      data: text,
      success: function() {
        wx.showToast({ title: '已复制', icon: 'success', duration: 1500 });
      }
    });
  }
});
