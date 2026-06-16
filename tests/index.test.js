/**
 * index.js 页面逻辑单元测试
 * 测试功能：
 * 1. parseTraceId - 解析扫码结果，提取溯源ID
 * 2. toggleInputArea - 切换显示手动输入区域
 * 3. onInputChange - 监听输入框变化
 * 4. handleManualQuery - 点击手动查询按钮
 * 5. fillTestId - 快速填入测试ID
 * 6. queryTraceInfo - 溯源数据查询
 * 7. handleScanCode - 扫码功能（支持二维码/条形码）
 * 8. 扫码历史功能 - loadScanHistory, addScanRecord, clearAllHistory
 * 9. 剪贴板识别功能 - checkClipboard
 * 10. 批次查询功能 - handleBatchQuery
 * 11. 小程序码 scene 参数解析
 */

// 模拟微信小程序环境
global.Page = function(options) {
  global.pageInstance = options;
};

global.wx = {
  showLoading: jest.fn(),
  hideLoading: jest.fn(),
  showToast: jest.fn(),
  showModal: jest.fn(),
  scanCode: jest.fn(),
  navigateTo: jest.fn(),
  navigateBack: jest.fn(),
  getSystemInfoSync: jest.fn(() => ({ SDKVersion: '2.29.0' })),
  getClipboardData: jest.fn(),
  getStorageSync: jest.fn(),
  setStorageSync: jest.fn()
};

// 模拟 mockData 模块
jest.mock('../utils/mockData.js', () => ({
  validateTraceId: jest.fn(),
  getTraceData: jest.fn(),
  getAvailableTraceIds: jest.fn(() => ['G001', 'G002', 'G003', 'G004']),
  validateBatchNo: jest.fn(),
  getBatchSkus: jest.fn(),
  getTraceIdFromBarcode: jest.fn(),
  parseSceneParam: jest.fn(),
  mockTraceData: {
    'G001': { basicInfo: { productName: '金桂花茶', batchNo: 'GH202503' } },
    'G002': { basicInfo: { productName: '银桂花茶', batchNo: 'GH202504' } },
    'G003': { basicInfo: { productName: '金桂花茶礼盒装', batchNo: 'GH202503' } },
    'G004': { basicInfo: { productName: '金桂花茶便携装', batchNo: 'GH202503' } }
  }
}));

// 模拟 storage 模块
jest.mock('../utils/storage.js', () => ({
  getScanHistory: jest.fn(() => []),
  addScanRecord: jest.fn(),
  removeScanRecord: jest.fn(),
  clearScanHistory: jest.fn(),
  formatTime: jest.fn((timestamp) => '刚刚'),
  MAX_HISTORY_COUNT: 10,
  STORAGE_KEY: 'scan_history'
}));

const mockData = require('../utils/mockData.js');
const storage = require('../utils/storage.js');

// 加载 index.js
require('../pages/index/index.js');

describe('index.js 页面逻辑测试', () => {
  let page;

  beforeEach(() => {
    // 重置所有 mock
    jest.clearAllMocks();

    // 创建页面实例
    page = Object.create(global.pageInstance);
    page.data = {
      inputTraceId: '',
      showInputArea: false,
      showBatchArea: false,
      inputBatchNo: '',
      testIds: ['G001', 'G002', 'G003', 'G004'],
      testBatchNos: ['GH202503', 'GH202504'],
      brandName: '一茶一品・桂花茶溯源',
      pageLoaded: false,
      scanHistory: [],
      showHistory: false,
      showClipboardModal: false,
      clipboardTraceId: ''
    };

    // 模拟 setData 方法
    page.setData = jest.fn((newData) => {
      Object.assign(page.data, newData);
    });
  });

  describe('parseTraceId 函数测试', () => {
    test('应该能解析纯ID格式', () => {
      mockData.validateTraceId.mockReturnValue(true);
      const result = page.parseTraceId('G001');
      expect(result).toBe('G001');
    });

    test('应该能解析URL参数格式', () => {
      const result1 = page.parseTraceId('https://trace.example.com/query?id=G001');
      expect(result1).toBe('G001');

      const result2 = page.parseTraceId('https://trace.example.com/query?traceId=G002');
      expect(result2).toBe('G002');
    });

    test('应该能解析JSON格式', () => {
      const result1 = page.parseTraceId('{"traceId": "G001"}');
      expect(result1).toBe('G001');

      const result2 = page.parseTraceId('{"id": "G002"}');
      expect(result2).toBe('G002');
    });

    test('对于无效的扫码结果应该返回 null', () => {
      mockData.validateTraceId.mockReturnValue(false);
      expect(page.parseTraceId('')).toBeNull();
      expect(page.parseTraceId(null)).toBeNull();
      expect(page.parseTraceId(undefined)).toBeNull();
      expect(page.parseTraceId('invalid')).toBeNull();
    });

    test('对于无效的JSON应该返回 null', () => {
      mockData.validateTraceId.mockReturnValue(false);
      expect(page.parseTraceId('{invalid json}')).toBeNull();
    });
  });

  describe('toggleInputArea 函数测试', () => {
    test('应该能切换显示输入区域', () => {
      page.toggleInputArea();
      expect(page.setData).toHaveBeenCalledWith({ showInputArea: true, showBatchArea: false });

      page.data.showInputArea = true;
      page.toggleInputArea();
      expect(page.setData).toHaveBeenCalledWith({ showInputArea: false, showBatchArea: false });
    });
  });

  describe('toggleBatchArea 函数测试', () => {
    test('应该能切换显示批次查询区域', () => {
      page.toggleBatchArea();
      expect(page.setData).toHaveBeenCalledWith({ showBatchArea: true, showInputArea: false });

      page.data.showBatchArea = true;
      page.toggleBatchArea();
      expect(page.setData).toHaveBeenCalledWith({ showBatchArea: false, showInputArea: false });
    });
  });

  describe('onInputChange 函数测试', () => {
    test('应该能更新输入框的值', () => {
      const e = { detail: { value: 'G001' } };
      page.onInputChange(e);
      expect(page.setData).toHaveBeenCalledWith({ inputTraceId: 'G001' });
    });
  });

  describe('onBatchInputChange 函数测试', () => {
    test('应该能更新批次号输入框的值', () => {
      const e = { detail: { value: 'GH202503' } };
      page.onBatchInputChange(e);
      expect(page.setData).toHaveBeenCalledWith({ inputBatchNo: 'GH202503' });
    });
  });

  describe('handleManualQuery 函数测试', () => {
    test('对于空输入应该显示提示', () => {
      page.data.inputTraceId = '';
      page.handleManualQuery();
      expect(wx.showToast).toHaveBeenCalledWith({
        title: '请输入溯源ID',
        icon: 'none',
        duration: 2000
      });
    });

    test('对于无效格式应该显示提示', () => {
      page.data.inputTraceId = 'invalid';
      mockData.validateTraceId.mockReturnValue(false);
      page.handleManualQuery();
      expect(wx.showToast).toHaveBeenCalledWith({
        title: 'ID格式不正确，请检查',
        icon: 'none',
        duration: 2000
      });
    });

    test('对于有效输入应该调用查询函数', () => {
      page.data.inputTraceId = 'G001';
      mockData.validateTraceId.mockReturnValue(true);
      page.queryTraceInfo = jest.fn();
      page.handleManualQuery();
      expect(page.queryTraceInfo).toHaveBeenCalledWith('G001');
    });
  });

  describe('handleBatchQuery 函数测试', () => {
    test('对于空输入应该显示提示', () => {
      page.data.inputBatchNo = '';
      page.handleBatchQuery();
      expect(wx.showToast).toHaveBeenCalledWith({
        title: '请输入批次号',
        icon: 'none',
        duration: 2000
      });
    });

    test('对于无效格式应该显示提示', () => {
      page.data.inputBatchNo = 'invalid';
      mockData.validateBatchNo.mockReturnValue(false);
      page.handleBatchQuery();
      expect(wx.showToast).toHaveBeenCalledWith({
        title: '批次号格式不正确',
        icon: 'none',
        duration: 2000
      });
    });

    test('对于有效批次号应该跳转到批次列表页', () => {
      page.data.inputBatchNo = 'GH202503';
      mockData.validateBatchNo.mockReturnValue(true);

      wx.navigateTo.mockImplementation((options) => {
        if (options.success) {
          options.success();
        }
      });

      page.handleBatchQuery();

      expect(wx.navigateTo).toHaveBeenCalledWith({
        url: '/pages/batchList/batchList?batchNo=GH202503',
        success: expect.any(Function),
        fail: expect.any(Function)
      });
    });
  });

  describe('fillTestId 函数测试', () => {
    test('应该能快速填入测试ID', () => {
      const e = { currentTarget: { dataset: { id: 'G001' } } };
      page.fillTestId(e);
      expect(page.setData).toHaveBeenCalledWith({
        inputTraceId: 'G001',
        showInputArea: true,
        showBatchArea: false
      });
    });
  });

  describe('fillTestBatchNo 函数测试', () => {
    test('应该能快速填入测试批次号', () => {
      const e = { currentTarget: { dataset: { batch: 'GH202503' } } };
      page.fillTestBatchNo(e);
      expect(page.setData).toHaveBeenCalledWith({
        inputBatchNo: 'GH202503',
        showBatchArea: true,
        showInputArea: false
      });
    });
  });

  describe('页面生命周期测试', () => {
    test('onLoad 应该设置页面加载状态', (done) => {
      page.onLoad({});
      setTimeout(() => {
        expect(page.setData).toHaveBeenCalledWith({ pageLoaded: true });
        done();
      }, 200);
    });

    test('onLoad 带有 traceId 参数应该调用查询', () => {
      page.queryTraceInfo = jest.fn();
      page.onLoad({ traceId: 'G001' });
      expect(page.queryTraceInfo).toHaveBeenCalledWith('G001');
    });

    test('onLoad 带有 scene 参数应该解析并查询', () => {
      mockData.parseSceneParam.mockReturnValue('G001');
      page.queryTraceInfo = jest.fn();
      page.onLoad({ scene: 'traceId%3DG001' });
      expect(mockData.parseSceneParam).toHaveBeenCalledWith('traceId%3DG001');
      expect(page.queryTraceInfo).toHaveBeenCalledWith('G001');
    });

    test('onLoad 带有无效 scene 参数应该不调用查询', () => {
      mockData.parseSceneParam.mockReturnValue(null);
      page.queryTraceInfo = jest.fn();
      page.loadScanHistory = jest.fn();
      page.onLoad({ scene: 'invalid' });
      expect(mockData.parseSceneParam).toHaveBeenCalledWith('invalid');
      expect(page.queryTraceInfo).not.toHaveBeenCalled();
      expect(page.loadScanHistory).toHaveBeenCalled();
    });

    test('onShow 应该重置输入框并加载历史和剪贴板', () => {
      page.data.inputTraceId = 'G001';
      page.data.inputBatchNo = 'GH202503';
      page.loadScanHistory = jest.fn();
      page.checkClipboard = jest.fn();
      page.onShow();
      expect(page.setData).toHaveBeenCalledWith({ inputTraceId: '', inputBatchNo: '' });
      expect(page.loadScanHistory).toHaveBeenCalled();
      expect(page.checkClipboard).toHaveBeenCalled();
    });
  });

  describe('handleScanCode 扫码功能测试', () => {
    test('扫码二维码成功且结果有效应该跳转到扫码结果页', () => {
      mockData.validateTraceId.mockReturnValue(true);
      page.navigateToScanResult = jest.fn();

      wx.scanCode.mockImplementation((options) => {
        if (options.success) {
          options.success({ result: 'G001', scanType: 'qrCode' });
        }
      });

      page.handleScanCode();

      expect(wx.showLoading).toHaveBeenCalledWith({
        title: '正在启动扫码...',
        mask: true
      });
      expect(wx.scanCode).toHaveBeenCalledWith({
        scanType: ['qrCode', 'barCode'],
        success: expect.any(Function),
        fail: expect.any(Function)
      });
      expect(wx.hideLoading).toHaveBeenCalled();
      expect(page.navigateToScanResult).toHaveBeenCalledWith('G001', 'qrCode');
    });

    test('扫码条形码成功且结果有效应该调用条形码解析', () => {
      mockData.getTraceIdFromBarcode.mockReturnValue('G001');
      page.navigateToScanResult = jest.fn();

      wx.scanCode.mockImplementation((options) => {
        if (options.success) {
          options.success({ result: '6901234567890', scanType: 'barCode' });
        }
      });

      page.handleScanCode();

      expect(mockData.getTraceIdFromBarcode).toHaveBeenCalledWith('6901234567890');
      expect(page.navigateToScanResult).toHaveBeenCalledWith('G001', 'barCode');
    });

    test('扫码成功但结果无效应该显示提示', () => {
      mockData.validateTraceId.mockReturnValue(false);
      page.navigateToScanResult = jest.fn();

      wx.scanCode.mockImplementation((options) => {
        if (options.success) {
          options.success({ result: 'invalid', scanType: 'qrCode' });
        }
      });

      page.handleScanCode();

      expect(wx.showToast).toHaveBeenCalledWith({
        title: '未识别到有效溯源码',
        icon: 'none',
        duration: 2000
      });
      expect(page.navigateToScanResult).not.toHaveBeenCalled();
    });

    test('扫码失败且不是用户取消应该显示错误提示', () => {
      page.navigateToScanResult = jest.fn();

      wx.scanCode.mockImplementation((options) => {
        if (options.fail) {
          options.fail({ errMsg: 'scanCode:fail error' });
        }
      });

      page.handleScanCode();

      expect(wx.hideLoading).toHaveBeenCalled();
      expect(wx.showToast).toHaveBeenCalledWith({
        title: '扫码失败，请重试',
        icon: 'none',
        duration: 2000
      });
      expect(page.navigateToScanResult).not.toHaveBeenCalled();
    });

    test('用户取消扫码不应该显示错误提示', () => {
      page.navigateToScanResult = jest.fn();

      wx.scanCode.mockImplementation((options) => {
        if (options.fail) {
          options.fail({ errMsg: 'scanCode:fail cancel' });
        }
      });

      page.handleScanCode();

      expect(wx.hideLoading).toHaveBeenCalled();
      expect(wx.showToast).not.toHaveBeenCalled();
      expect(page.navigateToScanResult).not.toHaveBeenCalled();
    });
  });

  describe('navigateToScanResult 函数测试', () => {
    test('应该添加历史记录并跳转到扫码结果页', () => {
      const mockTraceData = { basicInfo: { productName: '金桂花茶' } };
      mockData.getTraceData.mockReturnValue(mockTraceData);
      page.loadScanHistory = jest.fn();

      wx.navigateTo.mockImplementation((options) => {
        if (options.success) {
          options.success();
        }
      });

      page.navigateToScanResult('G001', 'qrCode');

      expect(storage.addScanRecord).toHaveBeenCalledWith({
        traceId: 'G001',
        productName: '金桂花茶'
      });
      expect(wx.navigateTo).toHaveBeenCalledWith({
        url: '/pages/scanResult/scanResult?traceId=G001&scanType=qrCode',
        success: expect.any(Function),
        fail: expect.any(Function)
      });
      expect(page.loadScanHistory).toHaveBeenCalled();
    });
  });

  describe('queryTraceInfo 溯源查询功能测试', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test('查询成功应该添加历史记录并跳转到详情页', () => {
      const mockTraceData = { basicInfo: { productName: '金桂花茶' } };
      mockData.getTraceData.mockReturnValue(mockTraceData);
      page.loadScanHistory = jest.fn();

      wx.navigateTo.mockImplementation((options) => {
        if (options.success) {
          options.success();
        }
      });

      page.queryTraceInfo('G001');

      expect(wx.showLoading).toHaveBeenCalledWith({
        title: '正在查询...',
        mask: true
      });

      jest.advanceTimersByTime(800);

      expect(wx.hideLoading).toHaveBeenCalled();
      expect(storage.addScanRecord).toHaveBeenCalledWith({
        traceId: 'G001',
        productName: '金桂花茶'
      });
      expect(page.loadScanHistory).toHaveBeenCalled();
      expect(wx.navigateTo).toHaveBeenCalledWith({
        url: '/pages/detail/detail?traceId=G001',
        success: expect.any(Function),
        fail: expect.any(Function)
      });
    });

    test('查询失败（未找到数据）应该显示提示', () => {
      mockData.getTraceData.mockReturnValue(null);

      page.queryTraceInfo('G999');

      jest.advanceTimersByTime(800);

      expect(wx.hideLoading).toHaveBeenCalled();
      expect(wx.showToast).toHaveBeenCalledWith({
        title: '未找到该溯源信息',
        icon: 'none',
        duration: 2500
      });
      expect(wx.navigateTo).not.toHaveBeenCalled();
    });
  });

  describe('loadScanHistory 扫码历史加载测试', () => {
    test('应该加载并格式化历史记录', () => {
      const mockHistory = [
        { id: '1', traceId: 'G001', productName: '金桂花茶', timestamp: Date.now() },
        { id: '2', traceId: 'G002', productName: '银桂花茶', timestamp: Date.now() - 3600000 }
      ];
      storage.getScanHistory.mockReturnValue(mockHistory);
      storage.formatTime.mockReturnValueOnce('刚刚').mockReturnValueOnce('1小时前');

      page.loadScanHistory();

      expect(storage.getScanHistory).toHaveBeenCalled();
      expect(page.setData).toHaveBeenCalledWith({
        scanHistory: [
          { id: '1', traceId: 'G001', productName: '金桂花茶', timestamp: expect.any(Number), formatTime: '刚刚' },
          { id: '2', traceId: 'G002', productName: '银桂花茶', timestamp: expect.any(Number), formatTime: '1小时前' }
        ],
        showHistory: true
      });
    });

    test('空历史记录应该不显示历史区域', () => {
      storage.getScanHistory.mockReturnValue([]);

      page.loadScanHistory();

      expect(page.setData).toHaveBeenCalledWith({
        scanHistory: [],
        showHistory: false
      });
    });
  });

  describe('viewHistoryItem 历史记录查看测试', () => {
    test('点击历史记录应该调用查询', () => {
      const e = { currentTarget: { dataset: { traceid: 'G001' } } };
      page.queryTraceInfo = jest.fn();
      page.viewHistoryItem(e);
      expect(page.queryTraceInfo).toHaveBeenCalledWith('G001');
    });
  });

  describe('deleteHistoryItem 历史记录删除测试', () => {
    test('确认删除应该移除记录', (done) => {
      const e = { currentTarget: { dataset: { id: '1' } } };
      page.loadScanHistory = jest.fn();

      wx.showModal.mockImplementation((options) => {
        if (options.success) {
          options.success({ confirm: true });
        }
      });

      page.deleteHistoryItem(e);

      setTimeout(() => {
        expect(wx.showModal).toHaveBeenCalled();
        expect(storage.removeScanRecord).toHaveBeenCalledWith('1');
        expect(page.loadScanHistory).toHaveBeenCalled();
        expect(wx.showToast).toHaveBeenCalledWith({
          title: '已删除',
          icon: 'success',
          duration: 1500
        });
        done();
      }, 100);
    });

    test('取消删除不应该移除记录', (done) => {
      const e = { currentTarget: { dataset: { id: '1' } } };
      page.loadScanHistory = jest.fn();

      wx.showModal.mockImplementation((options) => {
        if (options.success) {
          options.success({ confirm: false });
        }
      });

      page.deleteHistoryItem(e);

      setTimeout(() => {
        expect(wx.showModal).toHaveBeenCalled();
        expect(storage.removeScanRecord).not.toHaveBeenCalled();
        expect(page.loadScanHistory).not.toHaveBeenCalled();
        done();
      }, 100);
    });
  });

  describe('clearAllHistory 清空历史测试', () => {
    test('确认清空应该清除所有记录', (done) => {
      page.loadScanHistory = jest.fn();

      wx.showModal.mockImplementation((options) => {
        if (options.success) {
          options.success({ confirm: true });
        }
      });

      page.clearAllHistory();

      setTimeout(() => {
        expect(wx.showModal).toHaveBeenCalled();
        expect(storage.clearScanHistory).toHaveBeenCalled();
        expect(page.loadScanHistory).toHaveBeenCalled();
        expect(wx.showToast).toHaveBeenCalledWith({
          title: '已清空',
          icon: 'success',
          duration: 1500
        });
        done();
      }, 100);
    });

    test('取消清空不应该清除记录', (done) => {
      page.loadScanHistory = jest.fn();

      wx.showModal.mockImplementation((options) => {
        if (options.success) {
          options.success({ confirm: false });
        }
      });

      page.clearAllHistory();

      setTimeout(() => {
        expect(wx.showModal).toHaveBeenCalled();
        expect(storage.clearScanHistory).not.toHaveBeenCalled();
        expect(page.loadScanHistory).not.toHaveBeenCalled();
        done();
      }, 100);
    });
  });

  describe('checkClipboard 剪贴板识别测试', () => {
    test('剪贴板包含有效溯源ID应该显示弹窗', (done) => {
      mockData.validateTraceId.mockReturnValue(true);
      mockData.getTraceData.mockReturnValue({ basicInfo: { productName: '金桂花茶' } });

      wx.getClipboardData.mockImplementation((options) => {
        if (options.success) {
          options.success({ data: 'G001' });
        }
      });

      page.parseTraceId = jest.fn(() => 'G001');

      page.checkClipboard();

      setTimeout(() => {
        expect(wx.getClipboardData).toHaveBeenCalled();
        expect(page.setData).toHaveBeenCalledWith({
          showClipboardModal: true,
          clipboardTraceId: 'G001'
        });
        done();
      }, 100);
    });

    test('剪贴板为空不应该显示弹窗', (done) => {
      wx.getClipboardData.mockImplementation((options) => {
        if (options.success) {
          options.success({ data: '' });
        }
      });

      page.checkClipboard();

      setTimeout(() => {
        expect(page.setData).not.toHaveBeenCalledWith(expect.objectContaining({
          showClipboardModal: true
        }));
        done();
      }, 100);
    });

    test('剪贴板包含无效ID不应该显示弹窗', (done) => {
      mockData.validateTraceId.mockReturnValue(false);

      wx.getClipboardData.mockImplementation((options) => {
        if (options.success) {
          options.success({ data: 'invalid' });
        }
      });

      page.parseTraceId = jest.fn(() => null);

      page.checkClipboard();

      setTimeout(() => {
        expect(page.setData).not.toHaveBeenCalledWith(expect.objectContaining({
          showClipboardModal: true
        }));
        done();
      }, 100);
    });
  });

  describe('handleClipboardConfirm 剪贴板确认测试', () => {
    test('确认查询应该关闭弹窗并调用查询', () => {
      page.data.clipboardTraceId = 'G001';
      page.queryTraceInfo = jest.fn();

      page.handleClipboardConfirm();

      expect(page.setData).toHaveBeenCalledWith({ showClipboardModal: false });
      expect(page.queryTraceInfo).toHaveBeenCalledWith('G001');
    });
  });

  describe('handleClipboardCancel 剪贴板取消测试', () => {
    test('取消应该关闭弹窗', () => {
      page.handleClipboardCancel();
      expect(page.setData).toHaveBeenCalledWith({ showClipboardModal: false });
    });
  });

  describe('分享功能测试', () => {
    test('onShareAppMessage 应该返回正确的分享配置', () => {
      const result = page.onShareAppMessage();
      expect(result.title).toBe('一茶一品・桂花茶溯源');
      expect(result.path).toBe('/pages/index/index');
    });
  });
});
