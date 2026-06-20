var authorizedNetwork = require('../../utils/authorizedNetwork.js');

Page({
  data: {
    viewMode: 'map',
    stores: [],
    filteredStores: [],
    mapMarkers: [],
    mapCenterLat: 30.5,
    mapCenterLng: 114.3,
    mapScale: 6,
    searchText: '',
    activeTypeFilter: '',
    typeFilters: [],
    cities: [],
    activeCity: '',
    statsSummary: null,
    selectedStoreId: '',
    showStoreCard: false,
    selectedStore: null,
    userLat: 0,
    userLng: 0,
    loading: true
  },

  onLoad: function(options) {
    wx.setNavigationBarTitle({ title: '授权合作网点' });
    this.initData();
    this.getUserLocation();

    if (options.traceId) {
      this.setData({ traceId: options.traceId });
    }
  },

  onShow: function() {
    if (this.data.stores.length > 0) {
      this.refreshStores();
    }
  },

  initData: function() {
    var typeFilters = authorizedNetwork.getAllStoreTypes();
    typeFilters.unshift({ key: '', label: '全部', icon: '📍', color: '#333333' });

    var stats = authorizedNetwork.getStatsSummary();
    var cities = authorizedNetwork.getCityList();
    cities.unshift({ name: '全部城市', count: stats.totalStores });

    var stores = authorizedNetwork.getAuthorizedStores();

    this.setData({
      typeFilters: typeFilters,
      statsSummary: stats,
      cities: cities,
      stores: stores,
      filteredStores: stores,
      loading: false
    });

    this.updateMapMarkers(stores);
  },

  refreshStores: function() {
    var stores = authorizedNetwork.getAuthorizedStores();
    this.setData({ stores: stores });
    this.applyFilters();
  },

  getUserLocation: function() {
    var that = this;
    wx.getLocation({
      type: 'gcj02',
      success: function(res) {
        that.setData({
          userLat: res.latitude,
          userLng: res.longitude
        });
        that.sortByDistance();
      },
      fail: function() {
        console.log('[AuthorizedNetwork] 获取位置失败，使用默认排序');
      }
    });
  },

  sortByDistance: function() {
    var lat = this.data.userLat;
    var lng = this.data.userLng;
    if (!lat || !lng) return;

    var stores = authorizedNetwork.getNearbyStores(lat, lng, 9999);
    this.setData({
      filteredStores: stores,
      mapCenterLat: lat,
      mapCenterLng: lng,
      mapScale: 10
    });
    this.updateMapMarkers(stores);
  },

  updateMapMarkers: function(stores) {
    var markers = authorizedNetwork.getStoresForMap(stores);
    this.setData({ mapMarkers: markers });
  },

  switchViewMode: function(e) {
    var mode = e.currentTarget.dataset.mode;
    this.setData({ viewMode: mode });

    if (mode === 'map') {
      this.updateMapMarkers(this.data.filteredStores);
    }
  },

  onSearchInput: function(e) {
    this.setData({ searchText: e.detail.value });
  },

  onSearch: function() {
    this.applyFilters();
  },

  onClearSearch: function() {
    this.setData({ searchText: '' });
    this.applyFilters();
  },

  onTypeFilterTap: function(e) {
    var type = e.currentTarget.dataset.type;
    this.setData({ activeTypeFilter: type });
    this.applyFilters();
  },

  onCityFilterTap: function(e) {
    var city = e.currentTarget.dataset.city;
    this.setData({ activeCity: city });
    this.applyFilters();
  },

  applyFilters: function() {
    var filtered = authorizedNetwork.searchStores(
      this.data.searchText,
      this.data.activeTypeFilter || null,
      this.data.activeCity || null
    );
    this.setData({ filteredStores: filtered });

    if (this.data.viewMode === 'map') {
      this.updateMapMarkers(filtered);
    }
  },

  onMapMarkerTap: function(e) {
    var markerId = e.detail.markerId || e.markerId;
    var stores = this.data.filteredStores;
    var store = null;
    for (var i = 0; i < stores.length; i++) {
      if (stores[i].id === markerId) {
        store = stores[i];
        break;
      }
    }
    if (store) {
      this.setData({
        showStoreCard: true,
        selectedStore: store,
        selectedStoreId: store.id
      });
    }
  },

  onMapRegionChange: function(e) {
    if (e.type === 'end' && e.causedBy === 'drag') {
      this.setData({
        mapCenterLat: e.centerLatitude,
        mapCenterLng: e.centerLongitude
      });
    }
  },

  closeStoreCard: function() {
    this.setData({
      showStoreCard: false,
      selectedStore: null,
      selectedStoreId: ''
    });
  },

  navigateToStore: function(e) {
    var store = e.currentTarget.dataset.store || this.data.selectedStore;
    if (!store) return;
    authorizedNetwork.openStoreNavigation(store);
  },

  goToStoreDetail: function(e) {
    var storeId = e.currentTarget.dataset.id;
    if (!storeId) return;
    var url = '/pages/authorizedNetworkDetail/authorizedNetworkDetail?id=' + storeId;
    if (this.data.traceId) {
      url += '&traceId=' + this.data.traceId;
    }
    wx.navigateTo({ url: url });
  },

  goToStoreDetailFromCard: function() {
    var store = this.data.selectedStore;
    if (!store) return;
    this.closeStoreCard();
    var url = '/pages/authorizedNetworkDetail/authorizedNetworkDetail?id=' + store.id;
    if (this.data.traceId) {
      url += '&traceId=' + this.data.traceId;
    }
    wx.navigateTo({ url: url });
  },

  goToVerify: function() {
    var that = this;
    wx.scanCode({
      scanType: ['qrCode'],
      success: function(res) {
        var storeCode = res.result;
        var store = authorizedNetwork.getStoreByStoreCode(storeCode);
        if (store) {
          var url = '/pages/authorizedNetworkDetail/authorizedNetworkDetail?id=' + store.id + '&verify=true';
          if (that.data.traceId) {
            url += '&traceId=' + that.data.traceId;
          }
          wx.navigateTo({ url: url });
        } else {
          wx.showModal({
            title: '未找到门店',
            content: '门店码 ' + storeCode + ' 未找到对应授权网点',
            showCancel: false
          });
        }
      },
      fail: function(err) {
        if (err.errMsg && err.errMsg.indexOf('cancel') === -1) {
          wx.showToast({ title: '扫码失败', icon: 'none' });
        }
      }
    });
  },

  locateUser: function() {
    this.getUserLocation();
  },

  onShareAppMessage: function() {
    return {
      title: '桂花茶官方授权合作网点',
      path: '/pages/authorizedNetwork/authorizedNetwork'
    };
  }
});
