var claimService = require('../../utils/claimService.js');

var STEP_CONFIG = [
  { key: 'submitted', label: '提交申请', icon: '📝' },
  { key: 'initial_review', label: '初审', icon: '🔍' },
  { key: 'sample_or_onsite', label: '寄样/上门', icon: '📦' },
  { key: 'appraisal', label: '质量鉴定', icon: '🔬' },
  { key: 'compensation', label: '补偿执行', icon: '💰' },
  { key: 'completed', label: '完成', icon: '✅' }
];

Page({
  data: {
    claimId: '',
    claim: null,
    loading: true,
    stepConfig: STEP_CONFIG,
    currentStepIndex: 0,
    slaInfo: null,
    timeline: [],
    maskedAccount: '',
    accountType: '',
    showSampleAddress: false,
    sampleAddress: {
      name: '质量鉴定中心',
      phone: '400-888-0000',
      address: '湖北省武汉市洪山区XX路XX号 溯源质检中心3号楼',
      receiver: '质检组（收）'
    }
  },

  onLoad: function(options) {
    if (options && options.id) {
      this.setData({ claimId: options.id });
      this.loadClaim();
    }
  },

  onShow: function() {
    if (this.data.claimId) {
      this.loadClaim();
      claimService.checkAndEscalate(this.data.claimId);
    }
  },

  onPullDownRefresh: function() {
    this.loadClaim();
    claimService.checkAndEscalate(this.data.claimId);
    setTimeout(function() {
      wx.stopPullDownRefresh();
    }, 500);
  },

  loadClaim: function() {
    var claim = claimService.getClaimById(this.data.claimId);
    if (!claim) {
      this.setData({ loading: false });
      wx.showToast({ title: '工单不存在', icon: 'none' });
      setTimeout(function() { wx.navigateBack(); }, 1500);
      return;
    }

    var slaInfo = claimService.getSlaRemainingInfo(claim);
    var stepIndex = claimService.CLAIM_STATUS_ORDER.indexOf(claim.status);
    if (stepIndex < 0) stepIndex = 0;

    var timeline = claim.statusTimeline.map(function(item) {
      return {
        status: item.status,
        timestamp: item.timestamp,
        message: item.message,
        timeText: claimService.formatFullTime(item.timestamp),
        statusLabel: claimService.CLAIM_STATUS_LABEL[item.status] || item.status,
        statusColor: claimService.CLAIM_STATUS_COLOR[item.status] || '#999'
      };
    }).reverse();

    var maskedAccount = '';
    var accountType = '';
    if (claim.bankAccount) {
      maskedAccount = claim.maskedBankAccount;
      accountType = '银行卡';
    } else if (claim.alipayAccount) {
      maskedAccount = claim.maskedAlipayAccount;
      accountType = '支付宝';
    }

    var showSample = claim.status === claimService.CLAIM_STATUS.SAMPLE_OR_ONSITE &&
                     claim.sampleMethod === 'mail_sample';

    this.setData({
      claim: claim,
      loading: false,
      currentStepIndex: stepIndex,
      slaInfo: slaInfo,
      timeline: timeline,
      maskedAccount: maskedAccount,
      accountType: accountType,
      showSampleAddress: showSample
    });
  },

  copyClaimId: function() {
    wx.setClipboardData({
      data: this.data.claimId,
      success: function() {
        wx.showToast({ title: '已复制工单号', icon: 'success' });
      }
    });
  },

  copyTraceId: function() {
    if (!this.data.claim || !this.data.claim.traceId) return;
    wx.setClipboardData({
      data: this.data.claim.traceId,
      success: function() {
        wx.showToast({ title: '已复制溯源ID', icon: 'success' });
      }
    });
  },

  copyTrackingNo: function() {
    if (!this.data.claim || !this.data.claim.trackingNo) return;
    wx.setClipboardData({
      data: this.data.claim.trackingNo,
      success: function() {
        wx.showToast({ title: '已复制快递单号', icon: 'success' });
      }
    });
  },

  copySampleAddress: function() {
    var addr = this.data.sampleAddress;
    var text = '收件人：' + addr.name + ' ' + addr.receiver + '\n电话：' + addr.phone + '\n地址：' + addr.address;
    wx.setClipboardData({
      data: text,
      success: function() {
        wx.showToast({ title: '已复制寄样地址', icon: 'success' });
      }
    });
  },

  previewImage: function(e) {
    var url = e.currentTarget.dataset.url;
    var urls = e.currentTarget.dataset.urls || [];
    if (urls.length === 0) urls = [url];
    wx.previewImage({ current: url, urls: urls });
  },

  goProductDetail: function() {
    if (!this.data.claim || !this.data.claim.traceId) return;
    wx.navigateTo({
      url: '/pages/detail/detail?traceId=' + this.data.claim.traceId
    });
  },

  goRecallDetail: function() {
    if (!this.data.claim) return;
    var traceId = this.data.claim.traceId;
    var batchNo = this.data.claim.productInfo ? this.data.claim.productInfo.batchNo : '';
    var url = '/pages/recall/detail?';
    if (traceId) url += 'traceId=' + traceId;
    if (batchNo) url += '&batchNo=' + batchNo;
    wx.navigateTo({ url: url });
  },

  goNotificationCenter: function() {
    wx.navigateTo({ url: '/pages/notifications/notifications' });
  },

  contactService: function() {
    wx.makePhoneCall({
      phoneNumber: '4008880000',
      fail: function() {}
    });
  }
});
