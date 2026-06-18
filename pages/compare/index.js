var mockData = require('../../utils/mockData.js');
var userStore = require('../../utils/userStore.js');
var shareUtil = require('../../utils/share.js');

var VARIETY_COLORS = {
  '\u91d1\u6842': { primary: '#DAA520', light: '#FFF8E1', bg: 'rgba(218,165,32,0.1)', border: '#F5C842' },
  '\u94f6\u6842': { primary: '#C0C0C0', light: '#FAFAFA', bg: 'rgba(192,192,192,0.1)', border: '#D0D0D0' },
  '\u4e39\u6842': { primary: '#CD5C5C', light: '#FFF0F0', bg: 'rgba(205,92,92,0.1)', border: '#E87373' },
  '\u56db\u5b63\u6842': { primary: '#90EE90', light: '#F0FFF0', bg: 'rgba(144,238,144,0.1)', border: '#A8E6A8' }
};

Page({
  data: {
    step: 'select',
    availableProducts: [],
    favorites: [],
    selectedIds: [],
    batchMode: false,
    batchNo: '',
    compareResult: null,
    viewMode: 'radar',
    radarAngles: [],
    radarPoints: [],
    diffItems: [],
    tableRows: [],
    productHeaders: [],
    showShareCanvas: false
  },

  onLoad: function(options) {
    var traceIds = options.traceIds || '';
    var batchNo = options.batchNo || '';

    if (batchNo) {
      this.setData({ batchMode: true, batchNo: batchNo });
      var skus = mockData.getBatchSkus(batchNo);
      if (skus && skus.length >= 2) {
        var ids = skus.slice(0, 3).map(function(s) { return s.traceId; });
        this.setData({ selectedIds: ids });
        this._doCompare(ids);
        return;
      }
    }

    if (traceIds) {
      var parsed = traceIds.split(',').filter(function(id) { return id.trim(); });
      if (parsed.length >= 2) {
        this.setData({ selectedIds: parsed.slice(0, 3) });
        this._doCompare(parsed.slice(0, 3));
        return;
      }
    }

    this._loadSelectPage();
  },

  _loadSelectPage: function() {
    var allIds = mockData.getAvailableTraceIds();
    var products = [];
    for (var i = 0; i < allIds.length; i++) {
      var data = mockData.getTraceData(allIds[i]);
      if (data && data.basicInfo) {
        products.push({
          traceId: allIds[i],
          productName: data.basicInfo.productName,
          specification: data.basicInfo.specification,
          thumbnail: data.basicInfo.thumbnail,
          variety: data.osmanthusInfo ? data.osmanthusInfo.variety : '',
          batchNo: data.basicInfo.batchNo
        });
      }
    }

    var favList = userStore.getFavorites();
    var favIds = favList.map(function(f) { return f.traceId; });

    this.setData({
      step: 'select',
      availableProducts: products,
      favorites: favList.filter(function(f) {
        return products.some(function(p) { return p.traceId === f.traceId; });
      })
    });
  },

  onToggleSelect: function(e) {
    var id = e.currentTarget.dataset.traceid;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx !== -1) {
      selected.splice(idx, 1);
    } else {
      if (selected.length >= 3) {
        wx.showToast({ title: '\u6700\u591a\u9009\u62e93\u4e2a\u4ea7\u54c1', icon: 'none' });
        return;
      }
      selected.push(id);
    }
    this.setData({ selectedIds: selected });
  },

  onAddFavorite: function(e) {
    var id = e.currentTarget.dataset.traceid;
    var selected = this.data.selectedIds.slice();
    if (selected.indexOf(id) !== -1) return;
    if (selected.length >= 3) {
      wx.showToast({ title: '\u6700\u591a\u9009\u62e93\u4e2a\u4ea7\u54c1', icon: 'none' });
      return;
    }
    selected.push(id);
    this.setData({ selectedIds: selected });
  },

  onRemoveSelected: function(e) {
    var id = e.currentTarget.dataset.traceid;
    var selected = this.data.selectedIds.slice();
    var idx = selected.indexOf(id);
    if (idx !== -1) selected.splice(idx, 1);
    this.setData({ selectedIds: selected });
  },

  onStartCompare: function() {
    if (this.data.selectedIds.length < 2) {
      wx.showToast({ title: '\u8bf7\u81f3\u5c11\u9009\u62e92\u4e2a\u4ea7\u54c1', icon: 'none' });
      return;
    }
    this._doCompare(this.data.selectedIds);
  },

  _doCompare: function(traceIds) {
    var result = mockData.getCompareData(traceIds);
    if (!result) {
      wx.showToast({ title: '\u5bf9\u6bd4\u6570\u636e\u52a0\u8f7d\u5931\u8d25', icon: 'none' });
      return;
    }

    var productHeaders = result.products.map(function(p) {
      var vc = VARIETY_COLORS[p.variety] || { primary: '#2E8B57', light: '#F5F5F0', bg: 'rgba(46,139,87,0.1)', border: '#2E8B57' };
      return {
        traceId: p.traceId,
        productName: p.productName,
        specification: p.specification,
        thumbnail: p.thumbnail,
        variety: p.variety,
        varietyColor: vc.primary,
        varietyBg: vc.bg,
        varietyBorder: vc.border
      };
    });

    var dimensionKeys = result.dimensionKeys;
    var tableRows = dimensionKeys.map(function(key) {
      var diff = result.diffItems.filter(function(d) { return d.key === key; })[0] || null;
      var cells = result.products.map(function(p, idx) {
        var dim = p.dimensions[key];
        var isAdv = diff && diff.advantageIndex === idx;
        var isDiff = !!diff;
        return {
          display: dim.display,
          isAbnormal: dim.isAbnormal || false,
          isAdvantage: isAdv,
          isDifferent: isDiff
        };
      });
      return {
        key: key,
        label: result.products[0].dimensions[key].label,
        isDiffRow: !!diff,
        cells: cells
      };
    });

    this.setData({
      step: 'result',
      compareResult: result,
      productHeaders: productHeaders,
      tableRows: tableRows,
      diffItems: result.diffItems
    });

    this._drawRadar(result);
  },

  _drawRadar: function(result) {
    var that = this;
    var query = wx.createSelectorQuery();
    query.select('#radarCanvas')
      .fields({ node: true, size: true })
      .exec(function(res) {
        if (!res || !res[0] || !res[0].node) {
          console.error('[Compare] Canvas\u8282\u70b9\u83b7\u53d6\u5931\u8d25');
          return;
        }
        var canvas = res[0].node;
        var ctx = canvas.getContext('2d');
        var dpr = wx.getSystemInfoSync().pixelRatio || 2;
        var width = 690;
        var height = 690;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);

        var centerX = width / 2;
        var centerY = height / 2;
        var maxRadius = 260;
        var sides = result.radarData.length;
        var angleStep = (2 * Math.PI) / sides;
        var startAngle = -Math.PI / 2;

        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);

        var gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];
        for (var g = 0; g < gridLevels.length; g++) {
          var r = maxRadius * gridLevels[g];
          ctx.beginPath();
          for (var s = 0; s <= sides; s++) {
            var a = startAngle + (s % sides) * angleStep;
            var px = centerX + r * Math.cos(a);
            var py = centerY + r * Math.sin(a);
            if (s === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.strokeStyle = 'rgba(46,139,87,0.12)';
          ctx.lineWidth = 1;
          ctx.stroke();
          if (g === gridLevels.length - 1) {
            ctx.fillStyle = 'rgba(46,139,87,0.03)';
            ctx.fill();
          }
        }

        for (var s2 = 0; s2 < sides; s2++) {
          var a2 = startAngle + s2 * angleStep;
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(centerX + maxRadius * Math.cos(a2), centerY + maxRadius * Math.sin(a2));
          ctx.strokeStyle = 'rgba(46,139,87,0.15)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        var productColors = [];
        for (var pc = 0; pc < result.products.length; pc++) {
          var variety = result.products[pc].variety;
          var vc = VARIETY_COLORS[variety] || { primary: '#2E8B57' };
          productColors.push(vc.primary);
        }

        for (var pi = 0; pi < result.products.length; pi++) {
          ctx.beginPath();
          for (var di = 0; di < sides; di++) {
            var val = result.radarData[di].values[pi] / 100;
            var angle = startAngle + di * angleStep;
            var r2 = maxRadius * Math.max(val, 0.02);
            var x = centerX + r2 * Math.cos(angle);
            var y = centerY + r2 * Math.sin(angle);
            if (di === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.fillStyle = that._hexToRgba(productColors[pi], 0.15);
          ctx.fill();
          ctx.strokeStyle = productColors[pi];
          ctx.lineWidth = 2.5;
          ctx.stroke();

          for (var di2 = 0; di2 < sides; di2++) {
            var val2 = result.radarData[di2].values[pi] / 100;
            var angle2 = startAngle + di2 * angleStep;
            var r3 = maxRadius * Math.max(val2, 0.02);
            var dx = centerX + r3 * Math.cos(angle2);
            var dy = centerY + r3 * Math.sin(angle2);
            ctx.beginPath();
            ctx.arc(dx, dy, 5, 0, 2 * Math.PI);
            ctx.fillStyle = productColors[pi];
            ctx.fill();
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 2;
            ctx.stroke();
          }
        }

        for (var si = 0; si < sides; si++) {
          var labelAngle = startAngle + si * angleStep;
          var labelR = maxRadius + 36;
          var lx = centerX + labelR * Math.cos(labelAngle);
          var ly = centerY + labelR * Math.sin(labelAngle);
          ctx.fillStyle = '#333333';
          ctx.font = 'bold 22px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(result.radarData[si].label, lx, ly);

          if (result.radarData[si].hasDiff) {
            ctx.fillStyle = '#DAA520';
            ctx.font = '18px sans-serif';
            ctx.fillText('\u2605', lx + 20, ly - 14);
          }
        }

        var legendY = height - 24;
        var legendStartX = centerX - (result.products.length * 100) / 2;
        for (var li = 0; li < result.products.length; li++) {
          var lxx = legendStartX + li * 100 + 16;
          ctx.beginPath();
          ctx.arc(lxx, legendY, 8, 0, 2 * Math.PI);
          ctx.fillStyle = productColors[li];
          ctx.fill();
          ctx.fillStyle = '#333333';
          ctx.font = '20px sans-serif';
          ctx.textAlign = 'left';
          ctx.fillText(result.products[li].variety, lxx + 14, legendY + 1);
        }
      });
  },

  _hexToRgba: function(hex, alpha) {
    var num = parseInt(hex.replace('#', ''), 16);
    var r = (num >> 16) & 255;
    var g = (num >> 8) & 255;
    var b = num & 255;
    return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
  },

  onSwitchView: function(e) {
    var mode = e.currentTarget.dataset.mode;
    this.setData({ viewMode: mode });
  },

  onBackSelect: function() {
    this.setData({ step: 'select', compareResult: null, viewMode: 'radar' });
    this._loadSelectPage();
  },

  onViewDetail: function(e) {
    var traceId = e.currentTarget.dataset.traceid;
    wx.navigateTo({ url: '/pages/detail/detail?traceId=' + traceId });
  },

  onShareAppMessage: function() {
    var ids = this.data.selectedIds.join(',');
    return {
      title: '\u4ea7\u54c1\u591a\u7ef4\u5bf9\u6bd4 - \u6842\u82b1\u8336\u6eaf\u6e90',
      path: '/pages/compare/index?traceIds=' + ids,
      imageUrl: this.data.productHeaders.length > 0 ? this.data.productHeaders[0].thumbnail : ''
    };
  },

  onShareLongImage: function() {
    this.setData({ showShareCanvas: true });
    var that = this;
    setTimeout(function() {
      that._drawShareImage();
    }, 300);
  },

  _drawShareImage: function() {
    var that = this;
    var result = this.data.compareResult;
    if (!result) return;

    var query = wx.createSelectorQuery();
    query.select('#shareCanvas')
      .fields({ node: true, size: true })
      .exec(function(res) {
        if (!res || !res[0] || !res[0].node) {
          console.error('[Compare] \u5206\u4eabCanvas\u8282\u70b9\u83b7\u53d6\u5931\u8d25');
          return;
        }
        var canvas = res[0].node;
        var ctx = canvas.getContext('2d');
        var dpr = wx.getSystemInfoSync().pixelRatio || 2;
        var width = 750;
        var rowH = 56;
        var headerH = 220;
        var tableHeaderH = 60;
        var footerH = 140;
        var diffSectionH = result.diffItems.length > 0 ? 80 + result.diffItems.length * 44 : 0;
        var height = headerH + tableHeaderH + result.dimensionKeys.length * rowH + diffSectionH + footerH;

        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);

        ctx.fillStyle = '#F5F5F0';
        ctx.fillRect(0, 0, width, height);

        var headerGrad = ctx.createLinearGradient(0, 0, width, 0);
        headerGrad.addColorStop(0, '#2E8B57');
        headerGrad.addColorStop(1, '#3CB371');
        ctx.fillStyle = headerGrad;
        ctx.fillRect(0, 0, width, headerH);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 44px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('\u4ea7\u54c1\u591a\u7ef4\u5bf9\u6bd4', width / 2, 60);
        ctx.font = '24px sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.fillText('\u6842\u82b1\u8336\u6eaf\u6e90 \u00b7 \u591a\u7ef4\u5ea6\u54c1\u8d28\u5bf9\u6bd4\u62a5\u544a', width / 2, 100);

        var prodY = 140;
        var prodSpacing = width / (result.products.length + 1);
        for (var pi = 0; pi < result.products.length; pi++) {
          var prod = result.products[pi];
          var vc = VARIETY_COLORS[prod.variety] || { primary: '#2E8B57' };
          var px = prodSpacing * (pi + 1);
          ctx.beginPath();
          ctx.arc(px, prodY, 16, 0, 2 * Math.PI);
          ctx.fillStyle = vc.primary;
          ctx.fill();
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 20px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(prod.variety.charAt(0), px, prodY + 7);

          ctx.fillStyle = '#FFFFFF';
          ctx.font = '22px sans-serif';
          ctx.fillText(prod.productName, px, prodY + 36);
        }

        var tableY = headerH;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, tableY, width, tableHeaderH);
        ctx.strokeStyle = '#E8E8E8';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, tableY + tableHeaderH);
        ctx.lineTo(width, tableY + tableHeaderH);
        ctx.stroke();

        ctx.fillStyle = '#2E8B57';
        ctx.font = 'bold 24px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('\u5bf9\u6bd4\u7ef4\u5ea6', 40, tableY + 38);

        var colW = (width - 180) / result.products.length;
        for (var ci = 0; ci < result.products.length; ci++) {
          var vc2 = VARIETY_COLORS[result.products[ci].variety] || { primary: '#2E8B57' };
          ctx.fillStyle = vc2.primary;
          ctx.font = 'bold 24px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(result.products[ci].variety, 180 + ci * colW + colW / 2, tableY + 38);
        }

        for (var ri = 0; ri < result.dimensionKeys.length; ri++) {
          var dKey = result.dimensionKeys[ri];
          var rowTop = tableY + tableHeaderH + ri * rowH;
          var isDiffRow = result.diffItems.some(function(d) { return d.key === dKey; });

          ctx.fillStyle = ri % 2 === 0 ? '#FFFFFF' : '#FAFAFA';
          ctx.fillRect(0, rowTop, width, rowH);

          if (isDiffRow) {
            ctx.fillStyle = 'rgba(218,165,32,0.06)';
            ctx.fillRect(0, rowTop, width, rowH);
            ctx.fillStyle = '#DAA520';
            ctx.fillRect(0, rowTop, 4, rowH);
          }

          ctx.strokeStyle = '#F0F0F0';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(0, rowTop + rowH);
          ctx.lineTo(width, rowTop + rowH);
          ctx.stroke();

          ctx.fillStyle = isDiffRow ? '#DAA520' : '#333333';
          ctx.font = isDiffRow ? 'bold 24px sans-serif' : '24px sans-serif';
          ctx.textAlign = 'left';
          var dimLabel = result.products[0].dimensions[dKey].label;
          if (isDiffRow) dimLabel = '\u2605 ' + dimLabel;
          ctx.fillText(dimLabel, 40, rowTop + 36);

          for (var ci2 = 0; ci2 < result.products.length; ci2++) {
            var dim = result.products[ci2].dimensions[dKey];
            var diffObj = result.diffItems.filter(function(d) { return d.key === dKey; })[0];
            var isAdv = diffObj && diffObj.advantageIndex === ci2;

            if (dim.isAbnormal) {
              ctx.fillStyle = '#FF4D4F';
            } else if (isAdv) {
              ctx.fillStyle = '#DAA520';
            } else {
              ctx.fillStyle = '#333333';
            }
            ctx.font = (isAdv || dim.isAbnormal) ? 'bold 24px sans-serif' : '24px sans-serif';
            ctx.textAlign = 'center';
            var cellText = dim.display;
            if (isAdv) cellText = cellText + ' \u2191';
            ctx.fillText(cellText, 180 + ci2 * colW + colW / 2, rowTop + 36);
          }
        }

        var diffY = tableY + tableHeaderH + result.dimensionKeys.length * rowH + 20;
        if (result.diffItems.length > 0) {
          ctx.fillStyle = '#2E8B57';
          ctx.font = 'bold 28px sans-serif';
          ctx.textAlign = 'left';
          ctx.fillText('\u2605 \u5dee\u5f02\u4eae\u70b9', 40, diffY + 30);

          for (var di2 = 0; di2 < result.diffItems.length; di2++) {
            var diffItem = result.diffItems[di2];
            var advIdx = diffItem.advantageIndex;
            var advProduct = result.products[advIdx];
            var advVal = advProduct.dimensions[diffItem.key].display;
            var diffRowY = diffY + 60 + di2 * 44;

            ctx.fillStyle = '#DAA520';
            ctx.font = '24px sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('\u2022 ' + diffItem.label + '\uff1a' + advProduct.variety + ' \u9886\u5148\uff08' + advVal + '\uff09', 60, diffRowY);
          }
        }

        var footerY = height - footerH;
        ctx.fillStyle = 'rgba(0,0,0,0.03)';
        ctx.fillRect(0, footerY, width, footerH);

        ctx.fillStyle = '#2E8B57';
        ctx.font = 'bold 24px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('\ud83c\udf3c \u4e00\u8336\u4e00\u54c1', 50, footerY + 50);
        ctx.fillStyle = '#666666';
        ctx.font = '20px sans-serif';
        ctx.fillText('\u6b63\u54c1\u6eaf\u6e90 \u00b7 \u54c1\u8d28\u4fdd\u969c', 50, footerY + 80);
        ctx.fillStyle = '#DAA520';
        ctx.font = '22px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('\u626b\u7801\u67e5\u770b\u5b8c\u6574\u6eaf\u6e90\u4fe1\u606f \u2192', width - 50, footerY + 65);

        setTimeout(function() {
          wx.canvasToTempFilePath({
            canvas: canvas,
            success: function(tempRes) {
              shareUtil.saveImageToAlbum(tempRes.tempFilePath, function(saveRes) {
                if (saveRes.success) {
                  wx.showToast({ title: '\u5df2\u4fdd\u5b58\u5230\u76f8\u518c', icon: 'success' });
                } else {
                  wx.showToast({ title: '\u4fdd\u5b58\u5931\u8d25', icon: 'none' });
                }
                that.setData({ showShareCanvas: false });
              });
            },
            fail: function() {
              wx.showToast({ title: '\u751f\u6210\u56fe\u7247\u5931\u8d25', icon: 'none' });
              that.setData({ showShareCanvas: false });
            }
          });
        }, 200);
      });
  },

  onShareCancel: function() {
    this.setData({ showShareCanvas: false });
  }
});
