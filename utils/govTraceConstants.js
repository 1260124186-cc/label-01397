/**
 * 政府溯源平台配置常量
 * 独立文件，避免 govTrace.js 与 recallService.js 循环依赖
 */

const PROVINCE_CONFIG = {
  name: '湖北省茶叶质量追溯平台',
  shortName: '湖北省茶叶追溯体系',
  provinceCode: 'HUBEI_TEA',
  verifyUrl: 'https://www.hbtea-trace.gov.cn/verify',
  officialSite: 'https://www.hbtea-trace.gov.cn',
  hotline: '12316',
  regulatoryAuthority: '湖北省农业农村厅',
  complianceText: '本品已纳入 湖北省茶叶追溯体系，接受农业农村部门全程质量监管'
};

const NATIONAL_CONFIG = {
  name: '国家农产品质量安全追溯管理信息平台',
  shortName: '国家农产品追溯平台',
  platformCode: 'NA_AGRI_TRACE',
  verifyUrl: 'https://www.anquanye.gov.cn/verify',
  officialSite: 'https://www.anquanye.gov.cn',
  hotline: '12316',
  regulatoryAuthority: '农业农村部农产品质量安全监管司',
  complianceText: '本品已纳入 国家农产品质量安全追溯管理信息平台，接受国家级全程质量监管'
};

const GOV_PLATFORM_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  WARNING: 'warning',
  REVOKED: 'revoked',
  RECALL: 'recall'
};

const GOV_PLATFORM_STATUS_LABEL = {
  pending: '审核中',
  approved: '备案通过',
  warning: '异常预警',
  revoked: '已撤销',
  recall: '责令召回'
};

const GOV_PLATFORM_STATUS_COLOR = {
  pending: '#FAAD14',
  approved: '#52C41A',
  warning: '#FA8C16',
  revoked: '#8C8C8C',
  recall: '#F5222D'
};

function getPlatformConfig(level) {
  return level === 'national' ? NATIONAL_CONFIG : PROVINCE_CONFIG;
}

module.exports = {
  PROVINCE_CONFIG,
  NATIONAL_CONFIG,
  GOV_PLATFORM_STATUS,
  GOV_PLATFORM_STATUS_LABEL,
  GOV_PLATFORM_STATUS_COLOR,
  getPlatformConfig
};
