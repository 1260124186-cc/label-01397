/**
 * 桂花茶溯源小程序 - 分享与社交传播工具
 * 功能：生成分享卡片、溯源证书长图、邀请溯源奖励等
 */

const greenPoints = require('./greenPoints.js');
const theme = require('./theme.js');

var SHARE_INVITE_KEY = 'share_invite_data';
var COUPON_KEY = 'user_coupons';
var QR_CODE_BASE_URL = 'https://api.example.com/qrcode?';

function _generateQRCodeUrl(content, size) {
  var s = size || 200;
  return QR_CODE_BASE_URL + 'content=' + encodeURIComponent(content) + '&size=' + s;
}

function getShareInviteData() {
  try {
    var data = wx.getStorageSync(SHARE_INVITE_KEY);
    if (!data) return { invitedCount: 0, invitees: [] };
    if (!data.invitees) data.invitees = [];
    return data;
  } catch (e) {
    console.error('[Share] 获取邀请数据失败:', e);
    return { invitedCount: 0, invitees: [] };
  }
}

function saveShareInviteData(data) {
  try {
    wx.setStorageSync(SHARE_INVITE_KEY, data);
    return true;
  } catch (e) {
    console.error('[Share] 保存邀请数据失败:', e);
    return false;
  }
}

function getUserCoupons() {
  try {
    var coupons = wx.getStorageSync(COUPON_KEY);
    if (!coupons) return [];
    return coupons;
  } catch (e) {
    console.error('[Share] 获取优惠券失败:', e);
    return [];
  }
}

function saveUserCoupons(coupons) {
  try {
    wx.setStorageSync(COUPON_KEY, coupons);
    return true;
  } catch (e) {
    console.error('[Share] 保存优惠券失败:', e);
    return false;
  }
}

function generateCoupon(template) {
  var now = Date.now();
  var expireDays = template.expireDays || 30;
  return {
    id: 'CPN_' + now + '_' + Math.floor(Math.random() * 10000),
    name: template.name,
    type: template.type || 'discount',
    value: template.value,
    minAmount: template.minAmount || 0,
    desc: template.desc,
    status: 'unused',
    createTime: now,
    expireTime: now + expireDays * 24 * 60 * 60 * 1000,
    source: template.source || 'invite'
  };
}

function handleInviteeScan(inviterUserId, traceId) {
  var mockData = require('./mockData.js');
  var inviteConfig = mockData.getInviteRewardConfig();

  var inviteData = getShareInviteData();
  var alreadyInvited = inviteData.invitees.some(function(item) {
    return item.traceId === traceId;
  });

  if (alreadyInvited) {
    return { success: false, reason: '该溯源码已被邀请过' };
  }

  var inviteeInfo = {
    userId: 'user_' + Date.now() + '_' + Math.floor(Math.random() * 10000),
    traceId: traceId,
    scanTime: Date.now(),
    rewarded: false
  };

  var rewards = { inviter: null, invitee: null };

  if (inviteConfig.inviterPoints > 0) {
    var pointsResult = greenPoints.earnPoints('invite_friend');
    if (pointsResult.earned > 0) {
      rewards.inviter = {
        type: 'points',
        value: pointsResult.earned,
        totalPoints: pointsResult.totalPoints
      };
      inviteeInfo.rewarded = true;
    }
  }

  if (inviteConfig.inviterCoupon) {
    var coupons = getUserCoupons();
    var newCoupon = generateCoupon({
      name: inviteConfig.inviterCoupon.name,
      type: inviteConfig.inviterCoupon.type,
      value: inviteConfig.inviterCoupon.value,
      minAmount: inviteConfig.inviterCoupon.minAmount,
      desc: inviteConfig.inviterCoupon.desc,
      expireDays: inviteConfig.inviterCoupon.expireDays,
      source: 'invite'
    });
    coupons.unshift(newCoupon);
    saveUserCoupons(coupons);
    if (!rewards.inviter) {
      rewards.inviter = { type: 'coupon', coupon: newCoupon };
    } else {
      rewards.inviter.coupon = newCoupon;
    }
  }

  if (inviteConfig.inviteePoints > 0) {
    rewards.invitee = {
      type: 'points',
      value: inviteConfig.inviteePoints
    };
  }

  if (inviteConfig.inviteeCoupon) {
    var newInviteeCoupon = generateCoupon({
      name: inviteConfig.inviteeCoupon.name,
      type: inviteConfig.inviteeCoupon.type,
      value: inviteConfig.inviteeCoupon.value,
      minAmount: inviteConfig.inviteeCoupon.minAmount,
      desc: inviteConfig.inviteeCoupon.desc,
      expireDays: inviteConfig.inviteeCoupon.expireDays,
      source: 'invited'
    });
    if (!rewards.invitee) {
      rewards.invitee = { type: 'coupon', coupon: newInviteeCoupon };
    } else {
      rewards.invitee.coupon = newInviteeCoupon;
    }
  }

  inviteData.invitedCount += 1;
  inviteData.invitees.unshift(inviteeInfo);
  saveShareInviteData(inviteData);

  return {
    success: true,
    inviteData: inviteData,
    rewards: rewards
  };
}

function drawShareCard(canvasId, traceData, themeColors, callback) {
  const that = this;
  const query = wx.createSelectorQuery();
  query.select('#' + canvasId)
    .fields({ node: true, size: true })
    .exec(function(res) {
      if (!res || !res[0] || !res[0].node) {
        console.error('[Share] Canvas节点获取失败');
        if (callback) callback({ success: false, error: 'Canvas节点获取失败' });
        return;
      }

      var canvas = res[0].node;
      var ctx = canvas.getContext('2d');
      var dpr = wx.getSystemInfoSync().pixelRatio || 2;
      var width = 750;
      var height = 1200;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      var currentThemeColors = theme.getCanvasThemeColors();
      var primary = (themeColors && themeColors.primary) || currentThemeColors.primary;
      var secondary = (themeColors && themeColors.secondary) || currentThemeColors.secondary;
      var bgColor = (themeColors && themeColors.background) || currentThemeColors.background;
      var cardBg = (themeColors && themeColors.cardBg) || currentThemeColors.cardBg;
      var textColor = (themeColors && themeColors.text) || currentThemeColors.text;
      var lightText = (themeColors && themeColors.lightText) || currentThemeColors.lightText;
      var borderColor = (themeColors && themeColors.border) || currentThemeColors.border;

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);

      var gradient = ctx.createLinearGradient(0, 0, width, 300);
      gradient.addColorStop(0, primary);
      gradient.addColorStop(1, _lightenColor(primary, 20));
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, 300);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 48px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('一茶一品', 50, 100);

      ctx.font = '24px sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      ctx.fillText('· 桂花茶全链路溯源 ·', 50, 145);

      var basicInfo = traceData.basicInfo || {};
      var productName = basicInfo.productName || '桂花茶';
      var batchNo = basicInfo.batchNo || '-';
      var traceId = basicInfo.traceId || '-';

      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = 'rgba(0,0,0,0.1)';
      ctx.shadowBlur = 20;
      ctx.shadowOffsetY = 5;
      _roundRect(ctx, 50, 200, width - 100, 280, 20);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      ctx.fillStyle = primary;
      ctx.font = 'bold 44px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(productName, width / 2, 280);

      ctx.fillStyle = lightText;
      ctx.font = '26px sans-serif';
      ctx.fillText('批次号：' + batchNo, width / 2, 330);
      ctx.fillText('溯源ID：' + traceId, width / 2, 375);

      ctx.strokeStyle = secondary;
      ctx.lineWidth = 4;
      ctx.setLineDash([10, 6]);
      ctx.beginPath();
      ctx.moveTo(100, 430);
      ctx.lineTo(width - 100, 430);
      ctx.stroke();
      ctx.setLineDash([]);

      var qrCodeSize = 320;
      var qrX = (width - qrCodeSize) / 2;
      var qrY = 480;

      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = 'rgba(0,0,0,0.08)';
      ctx.shadowBlur = 15;
      _roundRect(ctx, qrX - 30, qrY - 30, qrCodeSize + 60, qrCodeSize + 140, 16);
      ctx.fill();
      ctx.shadowBlur = 0;

      var shareUrl = '/pages/detail/detail?traceId=' + traceId + '&invite=1';
      var qrImage = canvas.createImage();
      var qrSrc = _generateQRCodeUrl(shareUrl, qrCodeSize);
      qrImage.onload = function() {
        ctx.drawImage(qrImage, qrX, qrY, qrCodeSize, qrCodeSize);

        ctx.fillStyle = textColor;
        ctx.font = 'bold 28px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('扫码查看完整溯源信息', width / 2, qrY + qrCodeSize + 55);

        ctx.fillStyle = lightText;
        ctx.font = '22px sans-serif';
        ctx.fillText('支持区块链验真 · 全链路可追溯', width / 2, qrY + qrCodeSize + 95);

        _drawFooter(ctx, width, height, primary, secondary);

        setTimeout(function() {
          wx.canvasToTempFilePath({
            canvas: canvas,
            success: function(tempRes) {
              if (callback) callback({ success: true, tempFilePath: tempRes.tempFilePath });
            },
            fail: function(err) {
              console.error('[Share] 导出图片失败:', err);
              if (callback) callback({ success: false, error: err });
            }
          });
        }, 200);
      };
      qrImage.onerror = function() {
        console.warn('[Share] 二维码图片加载失败，使用占位符');
        ctx.fillStyle = '#F0F0F0';
        ctx.fillRect(qrX, qrY, qrCodeSize, qrCodeSize);
        ctx.fillStyle = lightText;
        ctx.font = '24px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('[二维码]', width / 2, qrY + qrCodeSize / 2);

        ctx.fillStyle = textColor;
        ctx.font = 'bold 28px sans-serif';
        ctx.fillText('扫码查看完整溯源信息', width / 2, qrY + qrCodeSize + 55);

        ctx.fillStyle = lightText;
        ctx.font = '22px sans-serif';
        ctx.fillText('支持区块链验真 · 全链路可追溯', width / 2, qrY + qrCodeSize + 95);

        _drawFooter(ctx, width, height, primary, secondary);

        setTimeout(function() {
          wx.canvasToTempFilePath({
            canvas: canvas,
            success: function(tempRes) {
              if (callback) callback({ success: true, tempFilePath: tempRes.tempFilePath });
            },
            fail: function(err) {
              if (callback) callback({ success: false, error: err });
            }
          });
        }, 200);
      };
      qrImage.src = qrSrc;
    });
}

function drawTraceCertificate(canvasId, traceData, themeColors, callback) {
  const query = wx.createSelectorQuery();
  query.select('#' + canvasId)
    .fields({ node: true, size: true })
    .exec(function(res) {
      if (!res || !res[0] || !res[0].node) {
        console.error('[Share] 证书Canvas节点获取失败');
        if (callback) callback({ success: false, error: 'Canvas节点获取失败' });
        return;
      }

      var canvas = res[0].node;
      var ctx = canvas.getContext('2d');
      var dpr = wx.getSystemInfoSync().pixelRatio || 2;
      var width = 750;
      var baseHeight = 1800;
      var extraHeight = 0;

      var blockchainInfo = traceData.blockchainInfo || {};
      if (blockchainInfo.onChainFields && blockchainInfo.onChainFields.length > 0) {
        extraHeight = blockchainInfo.onChainFields.length * 50 + 80;
      }
      var height = baseHeight + extraHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      var currentThemeColors = theme.getCanvasThemeColors();
      var primary = (themeColors && themeColors.primary) || currentThemeColors.primary;
      var secondary = (themeColors && themeColors.secondary) || currentThemeColors.secondary;
      var textColor = (themeColors && themeColors.text) || currentThemeColors.text;
      var lightText = (themeColors && themeColors.lightText) || currentThemeColors.lightText;
      var cardBg = (themeColors && themeColors.cardBg) || currentThemeColors.cardBg;
      var borderColor = (themeColors && themeColors.border) || currentThemeColors.border;

      ctx.fillStyle = cardBg;
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = primary;
      ctx.lineWidth = 6;
      ctx.strokeRect(20, 20, width - 40, height - 40);
      ctx.strokeStyle = secondary;
      ctx.lineWidth = 2;
      ctx.strokeRect(36, 36, width - 72, height - 72);

      var decorSize = 80;
      _drawCornerDecor(ctx, 40, 40, decorSize, primary, 'tl');
      _drawCornerDecor(ctx, width - 40, 40, decorSize, primary, 'tr');
      _drawCornerDecor(ctx, 40, height - 40, decorSize, primary, 'bl');
      _drawCornerDecor(ctx, width - 40, height - 40, decorSize, primary, 'br');

      ctx.fillStyle = primary;
      ctx.font = 'bold 52px serif';
      ctx.textAlign = 'center';
      ctx.fillText('产品溯源证书', width / 2, 160);

      ctx.fillStyle = secondary;
      ctx.font = '28px serif';
      ctx.fillText('PRODUCT TRACEABILITY CERTIFICATE', width / 2, 210);

      var basicInfo = traceData.basicInfo || {};
      var treeAge = traceData.treeAge || {};
      var osmanthusInfo = traceData.osmanthusInfo || {};
      var pesticideTest = traceData.pesticideTest || {};

      var certNo = 'TRACE-' + basicInfo.traceId + '-' + (basicInfo.batchNo || '');
      ctx.fillStyle = lightText;
      ctx.font = '22px sans-serif';
      ctx.fillText('证书编号：' + certNo, width / 2, 270);

      var sectionY = 320;
      var sectionGap = 380;

      sectionY = _drawCertSection(ctx, width, sectionY, '📋 产品基础信息', [
        { label: '产品名称', value: basicInfo.productName || '-' },
        { label: '产品规格', value: basicInfo.specification || '-' },
        { label: '批次号', value: basicInfo.batchNo || '-' },
        { label: '溯源ID', value: basicInfo.traceId || '-' },
        { label: '采摘时间', value: basicInfo.pickTime || '-' },
        { label: '出厂时间', value: basicInfo.productionTime || '-' }
      ], primary, secondary, textColor, lightText);

      sectionY += 20;
      sectionY = _drawCertSection(ctx, width, sectionY, '🌳 原料溯源信息', [
        { label: '茶树龄', value: (treeAge.teaTreeAge || '-') + ' 年' },
        { label: '茶树产地', value: treeAge.teaTreeLocation || '-' },
        { label: '桂花树龄', value: (treeAge.osmanthusTreeAge || '-') + ' 年' },
        { label: '桂花树产地', value: treeAge.osmanthusTreeLocation || '-' },
        { label: '桂花品种', value: osmanthusInfo.variety || '-' },
        { label: '桂花采摘', value: osmanthusInfo.pickTime || '-' }
      ], primary, secondary, textColor, lightText);

      sectionY += 20;
      sectionY = _drawCertSection(ctx, width, sectionY, '🫖 窨制工艺信息', [
        { label: '窨制次数', value: (traceData.scentingProcess && traceData.scentingProcess.scentingTimes || '-') + ' 次' },
        { label: '每次窨制', value: (traceData.scentingProcess && traceData.scentingProcess.scentingDuration || '-') + ' 小时' },
        { label: '窨制温度', value: (traceData.scentingProcess && traceData.scentingProcess.temperature || '-') + ' ℃' },
        { label: '环境湿度', value: (traceData.scentingProcess && traceData.scentingProcess.humidity || '-') + ' %' },
        { label: '花茶配比', value: traceData.scentingProcess && traceData.scentingProcess.ratio || '-' },
        { label: '洁净等级', value: traceData.scentingProcess && traceData.scentingProcess.workshopCleanliness || '-' }
      ], primary, secondary, textColor, lightText);

      sectionY += 20;
      sectionY = _drawCertSection(ctx, width, sectionY, '🔬 质量检测信息', [
        { label: '检测机构', value: pesticideTest.institution || '-' },
        { label: '检测日期', value: pesticideTest.testDate || '-' },
        { label: '报告编号', value: pesticideTest.reportNo || '-' },
        { label: '执行标准', value: pesticideTest.standard || '-' },
        { label: '检测结果', value: pesticideTest.hasAbnormal ? '⚠️ 存在异常项' : '✅ 全部合格' },
        { label: '检测项目', value: ((pesticideTest.teaTests && pesticideTest.teaTests.length || 0) + (pesticideTest.osmanthusTests && pesticideTest.osmanthusTests.length || 0)) + ' 项' }
      ], primary, secondary, textColor, lightText);

      sectionY += 20;
      sectionY = _drawCertSection(ctx, width, sectionY, '🔗 区块链存证信息', [
        { label: '链名称', value: blockchainInfo.chainName || '-' },
        { label: '区块高度', value: blockchainInfo.blockHeight || '-' },
        { label: '交易哈希', value: blockchainInfo.txHashShort || '-' },
        { label: '上链时间', value: blockchainInfo.timestamp || '-' },
        { label: '验证状态', value: blockchainInfo.verifyStatus || '-' },
        { label: '共识机制', value: blockchainInfo.consensusType || '-' }
      ], primary, secondary, textColor, lightText);

      if (blockchainInfo.onChainFields && blockchainInfo.onChainFields.length > 0) {
        sectionY += 30;
        ctx.fillStyle = primary;
        ctx.font = 'bold 28px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('📝 上链核心数据字段', 70, sectionY);
        sectionY += 30;
        ctx.strokeStyle = 'rgba(0,0,0,0.1)';
        ctx.lineWidth = 1;
        blockchainInfo.onChainFields.forEach(function(field, idx) {
          var rowY = sectionY + idx * 50;
          ctx.beginPath();
          ctx.moveTo(70, rowY);
          ctx.lineTo(width - 70, rowY);
          ctx.stroke();

          ctx.fillStyle = field.onChain ? primary : '#CCCCCC';
          ctx.font = '22px sans-serif';
          ctx.textAlign = 'left';
          ctx.fillText((field.onChain ? '✅ ' : '⬜ ') + field.label, 85, rowY + 32);

          ctx.fillStyle = textColor;
          ctx.textAlign = 'right';
          ctx.fillText(field.value || '-', width - 85, rowY + 32);
        });
        sectionY += blockchainInfo.onChainFields.length * 50 + 20;
      }

      sectionY += 30;
      var qrCodeSize = 280;
      var qrX = (width - qrCodeSize) / 2;

      ctx.fillStyle = '#FAFAFA';
      _roundRect(ctx, qrX - 30, sectionY, qrCodeSize + 60, qrCodeSize + 160, 16);
      ctx.fill();

      var verifyUrl = '/pages/detail/detail?traceId=' + (basicInfo.traceId || '') + '&verify=1';
      var qrImage = canvas.createImage();
      var qrSrc = _generateQRCodeUrl(verifyUrl, qrCodeSize);

      qrImage.onload = function() {
        ctx.drawImage(qrImage, qrX, sectionY + 20, qrCodeSize, qrCodeSize);
        ctx.fillStyle = textColor;
        ctx.font = 'bold 26px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('扫码区块链验真', width / 2, sectionY + qrCodeSize + 65);
        ctx.fillStyle = lightText;
        ctx.font = '22px sans-serif';
        ctx.fillText('扫码查询上链数据 · 确保证书真实有效', width / 2, sectionY + qrCodeSize + 100);

        ctx.fillStyle = lightText;
        ctx.font = '20px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('本证书由「一茶一品·桂花茶溯源平台」自动生成', width / 2, height - 100);
        ctx.fillText('生成时间：' + new Date().toLocaleString('zh-CN'), width / 2, height - 70);
        ctx.fillText('证书仅用于产品溯源，不具备法律效力', width / 2, height - 40);

        setTimeout(function() {
          wx.canvasToTempFilePath({
            canvas: canvas,
            success: function(tempRes) {
              if (callback) callback({ success: true, tempFilePath: tempRes.tempFilePath });
            },
            fail: function(err) {
              if (callback) callback({ success: false, error: err });
            }
          });
        }, 200);
      };

      qrImage.onerror = function() {
        ctx.fillStyle = '#F0F0F0';
        ctx.fillRect(qrX, sectionY + 20, qrCodeSize, qrCodeSize);
        ctx.fillStyle = lightText;
        ctx.font = '24px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('[验真二维码]', width / 2, sectionY + qrCodeSize / 2 + 20);

        ctx.fillStyle = textColor;
        ctx.font = 'bold 26px sans-serif';
        ctx.fillText('扫码区块链验真', width / 2, sectionY + qrCodeSize + 65);
        ctx.fillStyle = lightText;
        ctx.font = '22px sans-serif';
        ctx.fillText('扫码查询上链数据 · 确保证书真实有效', width / 2, sectionY + qrCodeSize + 100);

        ctx.fillStyle = lightText;
        ctx.font = '20px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('本证书由「一茶一品·桂花茶溯源平台」自动生成', width / 2, height - 100);
        ctx.fillText('生成时间：' + new Date().toLocaleString('zh-CN'), width / 2, height - 70);
        ctx.fillText('证书仅用于产品溯源，不具备法律效力', width / 2, height - 40);

        setTimeout(function() {
          wx.canvasToTempFilePath({
            canvas: canvas,
            success: function(tempRes) {
              if (callback) callback({ success: true, tempFilePath: tempRes.tempFilePath });
            },
            fail: function(err) {
              if (callback) callback({ success: false, error: err });
            }
          });
        }, 200);
      };

      qrImage.src = qrSrc;
    });
}

function _drawCertSection(ctx, width, startY, title, fields, primary, secondary, textColor, lightText) {
  var padding = 70;
  var contentWidth = width - padding * 2;
  var rowHeight = 48;

  var isDark = theme.isDarkMode();
  ctx.fillStyle = isDark ? '#3A3A3A' : '#F8F9FA';
  _roundRect(ctx, padding - 15, startY, contentWidth + 30, 60 + fields.length * rowHeight, 12);
  ctx.fill();

  ctx.fillStyle = primary;
  ctx.fillRect(padding - 15, startY, 6, 50);

  ctx.fillStyle = textColor;
  ctx.font = 'bold 30px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(title, padding, startY + 36);

  fields.forEach(function(field, idx) {
    var rowY = startY + 70 + idx * rowHeight;

    if (idx > 0) {
      ctx.strokeStyle = 'rgba(0,0,0,0.06)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padding, rowY - 10);
      ctx.lineTo(width - padding, rowY - 10);
      ctx.stroke();
    }

    ctx.fillStyle = lightText;
    ctx.font = '24px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(field.label, padding, rowY + 22);

    ctx.fillStyle = textColor;
    ctx.font = '24px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(field.value, width - padding, rowY + 22);
  });

  return startY + 70 + fields.length * rowHeight;
}

function _drawCornerDecor(ctx, x, y, size, color, position) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';

  var offset = 8;
  if (position === 'tl') {
    ctx.beginPath();
    ctx.moveTo(x, y + size);
    ctx.lineTo(x, y + offset);
    ctx.lineTo(x + size, y);
    ctx.stroke();
  } else if (position === 'tr') {
    ctx.beginPath();
    ctx.moveTo(x - size, y);
    ctx.lineTo(x - offset, y);
    ctx.lineTo(x, y + size);
    ctx.stroke();
  } else if (position === 'bl') {
    ctx.beginPath();
    ctx.moveTo(x, y - size);
    ctx.lineTo(x, y - offset);
    ctx.lineTo(x + size, y);
    ctx.stroke();
  } else if (position === 'br') {
    ctx.beginPath();
    ctx.moveTo(x - size, y);
    ctx.lineTo(x - offset, y);
    ctx.lineTo(x, y - size);
    ctx.stroke();
  }
}

function _drawFooter(ctx, width, height, primary, secondary) {
  ctx.fillStyle = 'rgba(0,0,0,0.03)';
  ctx.fillRect(0, height - 120, width, 120);

  ctx.fillStyle = primary;
  ctx.font = 'bold 24px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('🌼 一茶一品', 50, height - 75);

  ctx.fillStyle = '#666666';
  ctx.font = '20px sans-serif';
  ctx.fillText('正品溯源 · 品质保障', 50, height - 45);

  ctx.fillStyle = secondary;
  ctx.font = '22px sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('长按识别二维码 →', width - 50, height - 75);
  ctx.fillStyle = '#666666';
  ctx.font = '18px sans-serif';
  ctx.fillText('邀请好友双方得积分', width - 50, height - 45);
}

function _roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function _lightenColor(hex, percent) {
  var num = parseInt(hex.replace('#', ''), 16);
  var amt = Math.round(2.55 * percent);
  var R = (num >> 16) + amt;
  var G = (num >> 8 & 0x00FF) + amt;
  var B = (num & 0x0000FF) + amt;
  return '#' + (
    0x1000000 +
    (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)
  ).toString(16).slice(1);
}

function saveImageToAlbum(tempFilePath, callback) {
  wx.getSetting({
    success: function(settingRes) {
      if (!settingRes.authSetting['scope.writePhotosAlbum']) {
        wx.authorize({
          scope: 'scope.writePhotosAlbum',
          success: function() {
            _doSaveImage(tempFilePath, callback);
          },
          fail: function() {
            wx.showModal({
              title: '需要授权',
              content: '需要您授权保存图片到相册的权限',
              confirmText: '去授权',
              cancelText: '取消',
              success: function(modalRes) {
                if (modalRes.confirm) {
                  wx.openSetting({
                    success: function(openRes) {
                      if (openRes.authSetting['scope.writePhotosAlbum']) {
                        _doSaveImage(tempFilePath, callback);
                      } else {
                        if (callback) callback({ success: false, error: '未授权' });
                      }
                    }
                  });
                } else {
                  if (callback) callback({ success: false, error: '用户取消' });
                }
              }
            });
          }
        });
      } else {
        _doSaveImage(tempFilePath, callback);
      }
    },
    fail: function() {
      _doSaveImage(tempFilePath, callback);
    }
  });
}

function _doSaveImage(tempFilePath, callback) {
  wx.saveImageToPhotosAlbum({
    filePath: tempFilePath,
    success: function() {
      if (callback) callback({ success: true });
    },
    fail: function(err) {
      console.error('[Share] 保存图片失败:', err);
      if (callback) callback({ success: false, error: err });
    }
  });
}

module.exports = {
  drawShareCard: drawShareCard,
  drawTraceCertificate: drawTraceCertificate,
  saveImageToAlbum: saveImageToAlbum,
  handleInviteeScan: handleInviteeScan,
  getShareInviteData: getShareInviteData,
  getUserCoupons: getUserCoupons,
  saveUserCoupons: saveUserCoupons,
  generateCoupon: generateCoupon,

  // ========== 礼盒/组合装分享工具 ==========
  /**
   * 构建礼盒分享路径
   * @param {string} mainTraceId - 礼盒主码 traceId
   * @param {string} shareType - 'whole'(整盒) 或 'single'(单品)
   * @param {string} [subTraceId] - 单品 traceId（shareType=single 时必填）
   * @returns {string}
   */
  buildGiftBoxSharePath: function buildGiftBoxSharePath(mainTraceId, shareType, subTraceId) {
    if (shareType === 'whole') {
      return '/pages/scanResult/scanResult?traceId=' + mainTraceId;
    }
    if (shareType === 'single' && subTraceId) {
      return '/pages/detail/detail?traceId=' + subTraceId;
    }
    return '/pages/detail/detail?traceId=' + (subTraceId || mainTraceId);
  },

  /**
   * 构建礼盒分享标题
   * @param {object} giftBoxInfo - 礼盒信息对象（含 name / items 等字段）
   * @param {string} shareType - 'whole' 或 'single'
   * @param {object} [singleTraceData] - 单品溯源数据（shareType=single 时使用）
   * @returns {string}
   */
  buildGiftBoxShareTitle: function buildGiftBoxShareTitle(giftBoxInfo, shareType, singleTraceData) {
    if (!giftBoxInfo) {
      if (singleTraceData && singleTraceData.basicInfo) {
        return singleTraceData.basicInfo.productName + ' - 全链路溯源信息';
      }
      return '产品溯源信息';
    }
    if (shareType === 'whole') {
      var itemCount = (giftBoxInfo.items && giftBoxInfo.items.length) || 0;
      return '🎁 ' + giftBoxInfo.name + '（含' + itemCount + '件）- 礼盒装全链路溯源';
    }
    if (singleTraceData && singleTraceData.basicInfo) {
      return '[' + giftBoxInfo.name + '] ' + singleTraceData.basicInfo.productName + ' - 单品溯源';
    }
    return giftBoxInfo.name + ' - 单品溯源信息';
  },

  /**
   * 构建礼盒分享描述文案（用于卡片副标题/朋友圈文案）
   * @param {object} giftBoxInfo - 礼盒信息
   * @returns {string}
   */
  buildGiftBoxShareDescription: function buildGiftBoxShareDescription(giftBoxInfo) {
    if (!giftBoxInfo) return '';
    var highlights = giftBoxInfo.highlights || [];
    var theme = giftBoxInfo.theme || '';
    var parts = [];
    if (theme) parts.push(theme);
    if (highlights.length > 0) parts.push(highlights.slice(0, 2).join('・'));
    return parts.join(' | ');
  }
};
