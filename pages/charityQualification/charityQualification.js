var ecoFund = require('../../utils/ecoFund.js');

Page({
  data: {
    orgInfo: null,
    annualReports: [],
    qualificationCerts: [],
    transparencyItems: [],
    legalNotices: []
  },

  onLoad: function() {
    this.loadData();
  },

  onPullDownRefresh: function() {
    this.loadData();
    wx.stopPullDownRefresh();
  },

  loadData: function() {
    var orgInfo = ecoFund.CHARITY_ORG_INFO || {};
    var that = this;

    var qualificationCerts = [
      {
        id: 'legalPerson',
        icon: '📜',
        title: '法人登记证书',
        no: orgInfo.legalPersonCert ? orgInfo.legalPersonCert.certNo : '53100000500012015T',
        issuer: '中华人民共和国民政部',
        status: 'valid',
        color: '#52C41A'
      },
      {
        id: 'fundraising',
        icon: '🎗️',
        title: '公开募捐资格证书',
        no: orgInfo.publicFundraisingCert ? orgInfo.publicFundraisingCert.certNo : '53100000500012015T-A001',
        issuer: '民政部慈善事业促进和社会工作司',
        status: 'valid',
        color: '#1890FF'
      },
      {
        id: 'taxDeduction',
        icon: '💰',
        title: '公益性捐赠税前扣除资格',
        no: '2024-2026年度',
        issuer: '财政部 · 税务总局 · 民政部联合认定',
        status: 'valid',
        color: '#722ED1'
      }
    ];

    var annualReports = [
      { year: '2023', title: '2023年度工作报告与审计报告', auditor: '立信会计师事务所（特殊普通合伙）', hasAudit: true, size: '2.4 MB' },
      { year: '2022', title: '2022年度工作报告与审计报告', auditor: '立信会计师事务所（特殊普通合伙）', hasAudit: true, size: '2.1 MB' },
      { year: '2021', title: '2021年度工作报告与审计报告', auditor: '立信会计师事务所（特殊普通合伙）', hasAudit: true, size: '1.9 MB' }
    ];

    var transparencyItems = [
      { icon: '🔍', text: '民政部"慈善中国"信息公开平台实时公示' },
      { icon: '🏦', text: '所有捐款专户管理、专款专用' },
      { icon: '📊', text: '每季度发布公益项目进展报告' },
      { icon: '📣', text: '接受社会公众与媒体监督' }
    ];

    var legalNotices = [
      { icon: '✅', text: '本平台所有公益捐赠均通过持牌慈善组织完成' },
      { icon: '⚖️', text: '捐赠行为符合《中华人民共和国慈善法》相关规定' },
      { icon: '🧾', text: '捐赠票据由中华环境保护基金会统一开具' },
      { icon: '📞', text: '如有疑问请拨打官方服务热线：400-675-1100' }
    ];

    this.setData({
      orgInfo: orgInfo,
      qualificationCerts: qualificationCerts,
      annualReports: annualReports,
      transparencyItems: transparencyItems,
      legalNotices: legalNotices
    });
  },

  onViewCert: function(e) {
    var certId = e.currentTarget.dataset.certid;
    if (!certId) return;
    var certMap = {
      legalPerson: { title: '法人登记证书', desc: '统一社会信用代码：53100000500012015T\n有效期：长期\n登记机关：民政部\n住所：北京市东城区广渠门内大街16号' },
      fundraising: { title: '公开募捐资格证书', desc: '募捐资格编号：53100000500012015T-A001\n认定机关：民政部\n有效期：2024.01 - 2029.12' },
      taxDeduction: { title: '公益性捐赠税前扣除资格', desc: '认定期间：2024年度 - 2026年度\n联合认定机关：财政部 · 税务总局 · 民政部\n个人捐赠可在应纳税所得额30%以内税前扣除' }
    };
    var cert = certMap[certId];
    if (!cert) return;
    wx.showModal({
      title: cert.title,
      content: cert.desc,
      showCancel: false,
      confirmText: '知道了',
      confirmColor: '#EB2F96'
    });
  },

  onDownloadReport: function(e) {
    var year = e.currentTarget.dataset.year;
    if (!year) return;
    wx.showLoading({ title: '准备下载...', mask: true });
    setTimeout(function() {
      wx.hideLoading();
      wx.showToast({ title: year + '年报告已打开', icon: 'success', duration: 1500 });
    }, 1000);
  },

  onCopyOrgInfo: function(e) {
    var info = e.currentTarget.dataset.info;
    if (!info) return;
    wx.setClipboardData({
      data: info,
      success: function() {
        wx.showToast({ title: '已复制', icon: 'success' });
      }
    });
  },

  onCallHotline: function() {
    wx.makePhoneCall({
      phoneNumber: '4006751100',
      fail: function() {
        wx.showModal({
          title: '服务热线',
          content: '中华环境保护基金会\n服务热线：400-675-1100\n服务时间：周一至周五 9:00-18:00',
          showCancel: false,
          confirmColor: '#EB2F96'
        });
      }
    });
  },

  onOpenOfficialSite: function() {
    wx.navigateTo({
      url: '/pages/webview/webview?url=' + encodeURIComponent('https://www.cepf.org.cn/')
    });
  },

  onShareAppMessage: function() {
    return {
      title: '慈善组织资质公示 - 一茶一品·公益溯源',
      path: '/pages/charityQualification/charityQualification'
    };
  }
});
