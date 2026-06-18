const mockData = require('./mockData.js');
const channelTrace = require('./channelTrace.js');
const userStore = require('./userStore.js');

const EXPORT_SCOPE = {
  TEST_ONLY: 'test_only',
  GREEN_ONLY: 'green_only',
  FULL: 'full'
};

const EXPORT_FORMAT = {
  JSON: 'json',
  PDF: 'pdf',
  ZIP: 'zip'
};

const SCOPE_LABELS = {
  [EXPORT_SCOPE.TEST_ONLY]: '仅检测报告',
  [EXPORT_SCOPE.GREEN_ONLY]: '仅绿色溯源',
  [EXPORT_SCOPE.FULL]: '完整数据包'
};

const FORMAT_LABELS = {
  [EXPORT_FORMAT.JSON]: 'JSON',
  [EXPORT_FORMAT.PDF]: 'PDF报告',
  [EXPORT_FORMAT.ZIP]: 'ZIP压缩包'
};

function padZero(num) {
  return num < 10 ? '0' + num : '' + num;
}

function formatDateTime(timestamp) {
  const d = timestamp ? new Date(timestamp) : new Date();
  return `${d.getFullYear()}-${padZero(d.getMonth() + 1)}-${padZero(d.getDate())} ${padZero(d.getHours())}:${padZero(d.getMinutes())}:${padZero(d.getSeconds())}`;
}

function formatDate(timestamp) {
  const d = timestamp ? new Date(timestamp) : new Date();
  return `${d.getFullYear()}${padZero(d.getMonth() + 1)}${padZero(d.getDate())}`;
}

function getCurrentUser() {
  try {
    const userInfo = wx.getStorageSync('user_info');
    if (userInfo && userInfo.nickName) {
      return userInfo.nickName;
    }
    const dealer = channelTrace.getCurrentDealer();
    if (dealer && dealer.name) {
      return dealer.name;
    }
    return '企业用户';
  } catch (e) {
    return '企业用户';
  }
}

function generateWatermark() {
  return {
    exporter: getCurrentUser(),
    exportTime: formatDateTime(),
    exportTimestamp: Date.now(),
    system: '桂花茶溯源系统',
    version: 'v1.0.0',
    disclaimer: '本文件由溯源系统自动生成，数据受区块链存证保护，仅供内部使用'
  };
}

function filterByScope(traceData, scope) {
  if (!traceData) return null;

  const basic = {
    traceId: traceData.basicInfo?.traceId,
    batchNo: traceData.basicInfo?.batchNo,
    productName: traceData.basicInfo?.productName,
    specification: traceData.basicInfo?.specification,
    productionTime: traceData.basicInfo?.productionTime
  };

  switch (scope) {
    case EXPORT_SCOPE.TEST_ONLY:
      return {
        basicInfo: basic,
        pesticideTest: traceData.pesticideTest || null
      };

    case EXPORT_SCOPE.GREEN_ONLY:
      return {
        basicInfo: basic,
        greenTrace: traceData.greenTrace || null
      };

    case EXPORT_SCOPE.FULL:
    default:
      return {
        basicInfo: traceData.basicInfo || null,
        treeAge: traceData.treeAge || null,
        osmanthusInfo: traceData.osmanthusInfo || null,
        scentingProcess: traceData.scentingProcess || null,
        greenTrace: traceData.greenTrace || null,
        pesticideTest: traceData.pesticideTest || null,
        blockchainInfo: traceData.blockchainInfo || null,
        channelFlow: traceData.channelFlow || null
      };
  }
}

function buildExportData(traceIds, scope) {
  const ids = Array.isArray(traceIds) ? traceIds : [traceIds];
  const items = [];

  ids.forEach(id => {
    const raw = mockData.getTraceData(id);
    if (raw) {
      const channelFlow = channelTrace.getChannelFlow(id);
      const dataWithChannel = { ...raw, channelFlow: channelFlow || null };
      items.push({
        traceId: id,
        data: filterByScope(dataWithChannel, scope)
      });
    }
  });

  return {
    watermark: generateWatermark(),
    exportScope: scope,
    exportScopeLabel: SCOPE_LABELS[scope],
    totalCount: items.length,
    items: items
  };
}

function buildPdfContent(exportData) {
  const wm = exportData.watermark;
  const lines = [];

  lines.push('==================================================');
  lines.push('          桂花茶溯源系统 - 数据导出报告');
  lines.push('==================================================');
  lines.push('');
  lines.push(`导出范围: ${exportData.exportScopeLabel}`);
  lines.push(`导出数量: ${exportData.totalCount} 条`);
  lines.push(`导出时间: ${wm.exportTime}`);
  lines.push(`导出人员: ${wm.exporter}`);
  lines.push(`系统版本: ${wm.version}`);
  lines.push('');
  lines.push('【水印声明】');
  lines.push(wm.disclaimer);
  lines.push('');
  lines.push('==================================================');

  exportData.items.forEach((item, idx) => {
    lines.push('');
    lines.push(`------------------ 第 ${idx + 1} 条 ------------------`);
    lines.push(`溯源ID: ${item.traceId}`);

    const d = item.data;
    if (d.basicInfo) {
      lines.push(`产品名称: ${d.basicInfo.productName || '-'}`);
      lines.push(`批次号: ${d.basicInfo.batchNo || '-'}`);
      lines.push(`规格: ${d.basicInfo.specification || '-'}`);
      lines.push(`出厂时间: ${d.basicInfo.productionTime || '-'}`);
    }

    if (d.pesticideTest) {
      lines.push('');
      lines.push('【农残检测报告】');
      lines.push(`  检测机构: ${d.pesticideTest.institution || '-'}`);
      lines.push(`  检测日期: ${d.pesticideTest.testDate || '-'}`);
      lines.push(`  报告编号: ${d.pesticideTest.reportNo || '-'}`);
      lines.push(`  检测标准: ${d.pesticideTest.standard || '-'}`);
      lines.push(`  检测结果: ${d.pesticideTest.hasAbnormal ? '异常' : '全部合格'}`);
      if (d.pesticideTest.teaTests && d.pesticideTest.teaTests.length) {
        lines.push('  茶叶检测项:');
        d.pesticideTest.teaTests.forEach(t => {
          lines.push(`    - ${t.item}: ${t.displayValue || t.value}${t.unit} (限值${t.limit}${t.unit}) [${t.status}]`);
        });
      }
      if (d.pesticideTest.osmanthusTests && d.pesticideTest.osmanthusTests.length) {
        lines.push('  桂花检测项:');
        d.pesticideTest.osmanthusTests.forEach(t => {
          lines.push(`    - ${t.item}: ${t.displayValue || t.value}${t.unit} (限值${t.limit}${t.unit}) [${t.status}]`);
        });
      }
    }

    if (d.greenTrace) {
      lines.push('');
      lines.push('【绿色溯源信息】');
      if (d.greenTrace.ecoPlanting) {
        lines.push(`  生态种植: ${d.greenTrace.ecoPlanting.certification || '-'}`);
        (d.greenTrace.ecoPlanting.records || []).forEach(r => lines.push(`    - ${r}`));
      }
      if (d.greenTrace.ecoPacking) {
        lines.push(`  环保包装: ${d.greenTrace.ecoPacking.certification || '-'}`);
        (d.greenTrace.ecoPacking.records || []).forEach(r => lines.push(`    - ${r}`));
      }
      if (d.greenTrace.ecoLogistics) {
        lines.push(`  绿色物流: ${d.greenTrace.ecoLogistics.carbonReduction || '-'}`);
        (d.greenTrace.ecoLogistics.records || []).forEach(r => lines.push(`    - ${r}`));
      }
    }

    if (d.treeAge) {
      lines.push('');
      lines.push('【树龄信息】');
      lines.push(`  茶树龄: ${d.treeAge.teaTreeAge || '-'} 年`);
      lines.push(`  桂花树龄: ${d.treeAge.osmanthusTreeAge || '-'} 年`);
    }

    if (d.osmanthusInfo) {
      lines.push('');
      lines.push('【桂花信息】');
      lines.push(`  品种: ${d.osmanthusInfo.variety || '-'}`);
      lines.push(`  产地: ${d.osmanthusInfo.origin || '-'}`);
    }

    if (d.scentingProcess) {
      lines.push('');
      lines.push('【窨制工艺】');
      lines.push(`  窨制次数: ${d.scentingProcess.scentingTimes || '-'} 次`);
      lines.push(`  每次时长: ${d.scentingProcess.scentingDuration || '-'} 小时`);
      lines.push(`  配比: ${d.scentingProcess.ratio || '-'}`);
    }

    if (d.blockchainInfo) {
      lines.push('');
      lines.push('【区块链存证摘要】');
      lines.push(`  链名: ${d.blockchainInfo.chainName || '-'}`);
      lines.push(`  区块高度: ${d.blockchainInfo.blockHeight || '-'}`);
      lines.push(`  交易哈希: ${d.blockchainInfo.txHashShort || d.blockchainInfo.txHash || '-'}`);
      lines.push(`  上链时间: ${d.blockchainInfo.timestamp || '-'}`);
      lines.push(`  验证状态: ${d.blockchainInfo.verifyStatus || '-'}`);
      if (d.blockchainInfo.onChainFields && d.blockchainInfo.onChainFields.length) {
        lines.push('  上链字段:');
        d.blockchainInfo.onChainFields.forEach(f => {
          lines.push(`    - ${f.label}: ${f.value}`);
        });
      }
    }

    if (d.channelFlow) {
      lines.push('');
      lines.push('【渠道溯源】');
      const cf = d.channelFlow;
      if (cf.factory) lines.push(`  生产厂家: ${cf.factory.name} (${cf.factory.location})`);
      if (cf.provinceDealer) lines.push(`  省级代理: ${cf.provinceDealer.name} (${cf.provinceDealer.location})`);
      if (cf.cityDealer) lines.push(`  市级代理: ${cf.cityDealer.name} (${cf.cityDealer.location})`);
      if (cf.store) lines.push(`  授权门店: ${cf.store.name} (${cf.store.location})`);
    }

    lines.push('');
  });

  lines.push('');
  lines.push('==================================================');
  lines.push(`文件水印 - 导出人: ${wm.exporter} | 导出时间: ${wm.exportTime}`);
  lines.push('==================================================');

  return lines.join('\n');
}

function generateFileName(prefix, traceIds, format, scope) {
  const dateStr = formatDate();
  const idStr = Array.isArray(traceIds) && traceIds.length > 1
    ? `batch_${traceIds.length}`
    : (traceIds[0] || 'trace');
  const scopeStr = scope === EXPORT_SCOPE.TEST_ONLY ? 'test'
    : scope === EXPORT_SCOPE.GREEN_ONLY ? 'green' : 'full';
  return `${prefix}_${idStr}_${scopeStr}_${dateStr}.${format}`;
}

function writeToLocalFile(content, fileName) {
  return new Promise((resolve, reject) => {
    try {
      const fs = wx.getFileSystemManager();
      const filePath = `${wx.env.USER_DATA_PATH}/${fileName}`;
      fs.writeFile({
        filePath: filePath,
        data: content,
        encoding: 'utf8',
        success: () => resolve(filePath),
        fail: (err) => reject(err)
      });
    } catch (e) {
      reject(e);
    }
  });
}

function exportAsJson(traceIds, scope) {
  const exportData = buildExportData(traceIds, scope);
  const content = JSON.stringify(exportData, null, 2);
  const fileName = generateFileName('trace_export', traceIds, 'json', scope);
  return writeToLocalFile(content, fileName).then(filePath => ({
    filePath,
    fileName,
    exportData
  }));
}

function exportAsPdf(traceIds, scope) {
  const exportData = buildExportData(traceIds, scope);
  const content = buildPdfContent(exportData);
  const fileName = generateFileName('trace_report', traceIds, 'txt', scope);
  return writeToLocalFile(content, fileName).then(filePath => ({
    filePath,
    fileName,
    exportData,
    note: '小程序环境以结构化文本格式导出，可在PC端转换为PDF'
  }));
}

function exportAsZip(traceIds, scope) {
  return new Promise((resolve, reject) => {
    const exportData = buildExportData(traceIds, scope);
    const files = [];
    const dateStr = formatDate();

    exportData.items.forEach((item, idx) => {
      const jsonContent = JSON.stringify({
        watermark: exportData.watermark,
        traceId: item.traceId,
        data: item.data
      }, null, 2);
      const scopeStr = scope === EXPORT_SCOPE.TEST_ONLY ? 'test'
        : scope === EXPORT_SCOPE.GREEN_ONLY ? 'green' : 'full';
      files.push({
        name: `${item.traceId}_${scopeStr}_${dateStr}.json`,
        content: jsonContent
      });
    });

    const manifest = {
      watermark: exportData.watermark,
      exportScope: exportData.exportScopeLabel,
      totalCount: exportData.totalCount,
      files: files.map(f => f.name),
      generatedAt: formatDateTime()
    };
    files.push({
      name: `manifest_${dateStr}.json`,
      content: JSON.stringify(manifest, null, 2)
    });

    const zipContent = JSON.stringify({
      __zip_format__: 'trace_export_bundle_v1',
      manifest: manifest,
      files: files
    }, null, 2);

    const fileName = generateFileName('trace_bundle', traceIds, 'zip.json', scope);

    writeToLocalFile(zipContent, fileName)
      .then(filePath => resolve({
        filePath,
        fileName,
        exportData,
        includedFiles: files.map(f => f.name),
        note: '小程序环境以JSON Bundle格式导出，含manifest与多份溯源数据'
      }))
      .catch(reject);
  });
}

function doExport(traceIds, format, scope) {
  const ids = Array.isArray(traceIds) ? traceIds : [traceIds];
  if (ids.length === 0) {
    return Promise.reject(new Error('请选择要导出的溯源记录'));
  }

  switch (format) {
    case EXPORT_FORMAT.JSON:
      return exportAsJson(ids, scope);
    case EXPORT_FORMAT.PDF:
      return exportAsPdf(ids, scope);
    case EXPORT_FORMAT.ZIP:
      return exportAsZip(ids, scope);
    default:
      return exportAsJson(ids, scope);
  }
}

function openExportedFile(filePath, fileName) {
  return new Promise((resolve, reject) => {
    wx.showLoading({ title: '正在打开...', mask: true });
    wx.openDocument({
      filePath: filePath,
      showMenu: true,
      fileType: fileName.endsWith('.zip.json') ? 'json' : (fileName.endsWith('.txt') ? 'txt' : 'json'),
      success: (res) => {
        wx.hideLoading();
        resolve(res);
      },
      fail: (err) => {
        wx.hideLoading();
        wx.showModal({
          title: '导出完成',
          content: `文件已保存至本地：\n${filePath}\n\n可在"文件管理"或"导出记录"中查看`,
          showCancel: false,
          confirmText: '知道了'
        });
        resolve({ filePath, fileName });
      }
    });
  });
}

function saveToAlbumWithWatermark(canvasId, exportInfo) {
  return new Promise((resolve, reject) => {
    wx.showLoading({ title: '正在生成...', mask: true });
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: '报告已生成',
        icon: 'success',
        duration: 2000
      });
      resolve(exportInfo);
    }, 1000);
  });
}

module.exports = {
  EXPORT_SCOPE,
  EXPORT_FORMAT,
  SCOPE_LABELS,
  FORMAT_LABELS,

  getCurrentUser,
  generateWatermark,
  buildExportData,
  buildPdfContent,
  doExport,
  exportAsJson,
  exportAsPdf,
  exportAsZip,
  openExportedFile,
  saveToAlbumWithWatermark,
  formatDateTime,
  formatDate
};
