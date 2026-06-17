const antiCounterfeit = require('../../utils/antiCounterfeit.js');

Page({
  data: {
    traceId: '',
    productName: '',
    reportTypes: [],
    selectedType: '',
    selectedTypeLabel: '',
    description: '',
    contact: '',
    photos: [],
    maxPhotos: 6,
    submitting: false,
    showSuccess: false,
    submittedReport: null
  },

  onLoad: function(options) {
    console.log('[举报页] 加载，参数：', options);
    
    const traceId = options.traceId || '';
    const productName = decodeURIComponent(options.productName || '');
    
    this.setData({
      traceId: traceId,
      productName: productName,
      reportTypes: antiCounterfeit.getReportTypes()
    });
  },

  selectReportType: function(e) {
    const typeKey = e.currentTarget.dataset.key;
    const typeItem = this.data.reportTypes.find(t => t.key === typeKey);
    
    this.setData({
      selectedType: typeKey,
      selectedTypeLabel: typeItem ? typeItem.label : ''
    });
  },

  onDescriptionInput: function(e) {
    this.setData({
      description: e.detail.value
    });
  },

  onContactInput: function(e) {
    this.setData({
      contact: e.detail.value
    });
  },

  chooseImage: function() {
    const that = this;
    const remaining = this.data.maxPhotos - this.data.photos.length;
    
    if (remaining <= 0) {
      wx.showToast({
        title: '最多上传6张照片',
        icon: 'none'
      });
      return;
    }

    wx.chooseMedia({
      count: remaining,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      sizeType: ['compressed'],
      success: function(res) {
        const newPhotos = res.tempFiles.map(file => ({
          path: file.tempFilePath,
          size: file.size,
          duration: file.duration || 0
        }));
        
        that.setData({
          photos: that.data.photos.concat(newPhotos)
        });
      },
      fail: function(err) {
        console.error('[举报页] 选择图片失败:', err);
      }
    });
  },

  previewImage: function(e) {
    const index = e.currentTarget.dataset.index;
    const urls = this.data.photos.map(p => p.path);
    
    wx.previewImage({
      current: urls[index],
      urls: urls
    });
  },

  removeImage: function(e) {
    const that = this;
    const index = e.currentTarget.dataset.index;
    
    wx.showModal({
      title: '删除照片',
      content: '确定要删除这张照片吗？',
      success: function(res) {
        if (res.confirm) {
          const newPhotos = that.data.photos.slice();
          newPhotos.splice(index, 1);
          that.setData({
            photos: newPhotos
          });
        }
      }
    });
  },

  takePhoto: function() {
    const that = this;
    const remaining = this.data.maxPhotos - this.data.photos.length;
    
    if (remaining <= 0) {
      wx.showToast({
        title: '最多上传6张照片',
        icon: 'none'
      });
      return;
    }

    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['camera'],
      sizeType: ['compressed'],
      camera: 'back',
      success: function(res) {
        const newPhotos = res.tempFiles.map(file => ({
          path: file.tempFilePath,
          size: file.size,
          duration: 0
        }));
        
        that.setData({
          photos: that.data.photos.concat(newPhotos)
        });
      },
      fail: function(err) {
        console.error('[举报页] 拍照失败:', err);
      }
    });
  },

  validateForm: function() {
    if (!this.data.traceId) {
      wx.showToast({
        title: '缺少产品溯源信息',
        icon: 'none'
      });
      return false;
    }

    if (!this.data.selectedType) {
      wx.showToast({
        title: '请选择举报类型',
        icon: 'none'
      });
      return false;
    }

    if (!this.data.description.trim()) {
      wx.showToast({
        title: '请填写问题描述',
        icon: 'none'
      });
      return false;
    }

    if (this.data.description.trim().length < 5) {
      wx.showToast({
        title: '问题描述至少5个字',
        icon: 'none'
      });
      return false;
    }

    return true;
  },

  submitReport: function() {
    if (this.data.submitting) return;
    
    if (!this.validateForm()) return;

    const that = this;
    this.setData({ submitting: true });

    wx.showLoading({
      title: '正在提交...',
      mask: true
    });

    setTimeout(() => {
      const reportData = {
        traceId: that.data.traceId,
        productName: that.data.productName,
        reportType: that.data.selectedType,
        reportTypeLabel: that.data.selectedTypeLabel,
        description: that.data.description.trim(),
        contact: that.data.contact.trim(),
        photos: that.data.photos
      };

      const result = antiCounterfeit.submitReport(reportData);
      
      wx.hideLoading();
      that.setData({ submitting: false });

      if (result.success) {
        that.setData({
          showSuccess: true,
          submittedReport: result.reportData
        });
      } else {
        wx.showToast({
          title: result.error || '提交失败',
          icon: 'none',
          duration: 2000
        });
      }
    }, 1000);
  },

  closeSuccess: function() {
    this.setData({
      showSuccess: false
    });
    wx.navigateBack();
  },

  viewReportHistory: function() {
    wx.showToast({
      title: '举报记录功能开发中',
      icon: 'none'
    });
  },

  goBack: function() {
    wx.navigateBack();
  },

  clearForm: function() {
    const that = this;
    wx.showModal({
      title: '清空内容',
      content: '确定要清空所有已填写的内容吗？',
      success: function(res) {
        if (res.confirm) {
          that.setData({
            selectedType: '',
            selectedTypeLabel: '',
            description: '',
            contact: '',
            photos: []
          });
        }
      }
    });
  }
});
