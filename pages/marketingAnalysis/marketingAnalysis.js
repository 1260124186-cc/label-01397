const marketingAnalytics = require('../../utils/marketingAnalytics.js');
const mockData = require('../../utils/mockData.js');

Page({
  data: {
    campaigns: [],
    currentCampaignId: '',
    currentCampaignName: '',
    funnelData: null,
    channelData: null,
    regionData: null,
    dealerData: null,
    activeTab: 'funnel',
    loading: true
  },

  onLoad: function(options) {
    this.loadCampaigns();

    if (options.campaignId) {
      this.setData({ currentCampaignId: options.campaignId });
    }

    this.loadAnalysisData();
  },

  onShow: function() {
    this.loadAnalysisData();
  },

  loadCampaigns: function() {
    const campaigns = marketingAnalytics.getCampaignList();
    let currentId = this.data.currentCampaignId;

    if (!currentId && campaigns.length > 0) {
      currentId = campaigns[0].id;
    }

    let campaignName = '';
    if (currentId) {
      campaignName = mockData.getCampaignNameById(currentId);
    }

    this.setData({
      campaigns: campaigns,
      currentCampaignId: currentId,
      currentCampaignName: campaignName
    });
  },

  loadAnalysisData: function() {
    const campaignId = this.data.currentCampaignId;
    if (!campaignId) {
      this.setData({ loading: false });
      return;
    }

    this.setData({ loading: true });

    const funnelData = marketingAnalytics.getFunnelAnalysis(campaignId);
    const channelData = marketingAnalytics.getChannelAnalysis(campaignId);
    const regionData = marketingAnalytics.getRegionAnalysis(campaignId);
    const dealerData = marketingAnalytics.getDealerAnalysis(campaignId);

    this.setData({
      funnelData: funnelData,
      channelData: channelData,
      regionData: regionData,
      dealerData: dealerData,
      loading: false
    });
  },

  onTabChange: function(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
  },

  onCampaignChange: function(e) {
    const index = e.detail.value;
    const campaign = this.data.campaigns[index];
    if (campaign) {
      this.setData({
        currentCampaignId: campaign.id,
        currentCampaignName: campaign.title || campaign.name || ''
      });
      this.loadAnalysisData();
    }
  },

  formatNumber: function(num) {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + '万';
    }
    return num.toString();
  },

  formatPercent: function(value) {
    return (value * 100).toFixed(1) + '%';
  }
});
