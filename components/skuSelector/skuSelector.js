var mockData = require('../../utils/mockData.js');

Component({
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    traceId: {
      type: String,
      value: ''
    },
    mode: {
      type: String,
      value: 'cart'
    },
    isMember: {
      type: Boolean,
      value: false
    }
  },

  data: {
    product: null,
    selectedSpecs: [],
    selectedSku: null,
    quantity: 1,
    currentPrice: 0,
    currentMemberPrice: 0,
    currentStock: 0
  },

  observers: {
    'show, traceId': function(show, traceId) {
      if (show && traceId) {
        this.loadProductData();
      }
    }
  },

  methods: {
    loadProductData: function() {
      var product = mockData.getShopProduct(this.data.traceId);
      if (!product) return;

      var selectedSpecs = [];
      for (var i = 0; i < product.specs.length; i++) {
        selectedSpecs.push(product.specs[i].values[0]);
      }

      var defaultSku = product.skuList[product.defaultSkuIndex || 0];

      this.setData({
        product: product,
        selectedSpecs: selectedSpecs,
        selectedSku: defaultSku,
        quantity: 1,
        currentPrice: defaultSku.price,
        currentMemberPrice: defaultSku.memberPrice,
        currentStock: defaultSku.stock
      });
    },

    onSpecTap: function(e) {
      var specIndex = e.currentTarget.dataset.specIndex;
      var valueIndex = e.currentTarget.dataset.valueIndex;
      var product = this.data.product;
      var selectedSpecs = this.data.selectedSpecs.slice();

      selectedSpecs[specIndex] = product.specs[specIndex].values[valueIndex];

      var sku = mockData.getSkuBySpec(this.data.traceId, selectedSpecs);
      if (sku) {
        this.setData({
          selectedSpecs: selectedSpecs,
          selectedSku: sku,
          currentPrice: sku.price,
          currentMemberPrice: sku.memberPrice,
          currentStock: sku.stock,
          quantity: 1
        });
      }
    },

    onDecrease: function() {
      if (this.data.quantity > 1) {
        this.setData({ quantity: this.data.quantity - 1 });
      }
    },

    onIncrease: function() {
      if (this.data.quantity < this.data.currentStock) {
        this.setData({ quantity: this.data.quantity + 1 });
      } else {
        wx.showToast({ title: '库存不足', icon: 'none' });
      }
    },

    onQuantityInput: function(e) {
      var value = parseInt(e.detail.value) || 1;
      if (value < 1) value = 1;
      if (value > this.data.currentStock) {
        value = this.data.currentStock;
        wx.showToast({ title: '库存不足', icon: 'none' });
      }
      this.setData({ quantity: value });
    },

    onAddToCart: function() {
      if (!this.data.selectedSku) {
        wx.showToast({ title: '请选择规格', icon: 'none' });
        return;
      }

      this.triggerEvent('addcart', {
        traceId: this.data.traceId,
        skuId: this.data.selectedSku.skuId,
        quantity: this.data.quantity,
        specValues: this.data.selectedSpecs
      });

      this.onClose();
    },

    onBuyNow: function() {
      if (!this.data.selectedSku) {
        wx.showToast({ title: '请选择规格', icon: 'none' });
        return;
      }

      this.triggerEvent('buynow', {
        traceId: this.data.traceId,
        skuId: this.data.selectedSku.skuId,
        quantity: this.data.quantity,
        specValues: this.data.selectedSpecs
      });

      this.onClose();
    },

    onClose: function() {
      this.triggerEvent('close');
    },

    preventBubble: function() {}
  }
});
