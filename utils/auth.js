/**
 * 微信登录与用户认证模块
 * 功能：微信静默登录、获取用户信息、登录态管理
 * 隐私合规：仅收集必要信息（openid），不强制获取手机号等敏感信息
 */

var PRIVACY_AGREED_KEY = 'privacy_agreed';
var USER_INFO_KEY = 'user_info';
var LOGIN_TOKEN_KEY = 'login_token';

function isPrivacyAgreed() {
  try {
    return wx.getStorageSync(PRIVACY_AGREED_KEY) === true;
  } catch (e) {
    console.error('[Auth] 检查隐私协议状态失败:', e);
    return false;
  }
}

function setPrivacyAgreed(agreed) {
  try {
    wx.setStorageSync(PRIVACY_AGREED_KEY, agreed);
    console.info('[Auth] 隐私协议状态已更新:', agreed);
  } catch (e) {
    console.error('[Auth] 保存隐私协议状态失败:', e);
  }
}

function isLoggedIn() {
  try {
    var userInfo = wx.getStorageSync(USER_INFO_KEY);
    return !!(userInfo && userInfo.openid);
  } catch (e) {
    console.error('[Auth] 检查登录状态失败:', e);
    return false;
  }
}

function getUserInfo() {
  try {
    return wx.getStorageSync(USER_INFO_KEY) || null;
  } catch (e) {
    console.error('[Auth] 获取用户信息失败:', e);
    return null;
  }
}

function setUserInfo(userInfo) {
  try {
    wx.setStorageSync(USER_INFO_KEY, userInfo);
    console.info('[Auth] 用户信息已保存');
  } catch (e) {
    console.error('[Auth] 保存用户信息失败:', e);
  }
}

function getLoginToken() {
  try {
    return wx.getStorageSync(LOGIN_TOKEN_KEY) || '';
  } catch (e) {
    console.error('[Auth] 获取登录令牌失败:', e);
    return '';
  }
}

function wxLogin() {
  return new Promise(function(resolve, reject) {
    if (!isPrivacyAgreed()) {
      console.warn('[Auth] 用户未同意隐私协议，无法登录');
      reject({ code: -1, msg: '请先同意隐私协议' });
      return;
    }

    wx.login({
      success: function(loginRes) {
        console.info('[Auth] wx.login成功, code:', loginRes.code);
        mockServerLogin(loginRes.code)
          .then(function(data) {
            resolve(data);
          })
          .catch(function(err) {
            reject(err);
          });
      },
      fail: function(err) {
        console.error('[Auth] wx.login失败:', err);
        reject({ code: -2, msg: '微信登录失败，请重试' });
      }
    });
  });
}

function mockServerLogin(code) {
  return new Promise(function(resolve) {
    setTimeout(function() {
      var mockOpenid = 'wx_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 6);
      var mockToken = 'token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 10);

      var userInfo = {
        openid: mockOpenid,
        nickname: '茶友' + mockOpenid.substr(-4),
        avatarUrl: '',
        phone: '',
        gender: 0,
        loginTime: Date.now(),
        lastLoginTime: Date.now()
      };

      setUserInfo(userInfo);
      try {
        wx.setStorageSync(LOGIN_TOKEN_KEY, mockToken);
      } catch (e) {
        console.error('[Auth] 保存token失败:', e);
      }

      console.info('[Auth] 模拟登录成功, openid:', mockOpenid);
      resolve({ code: 0, data: userInfo, token: mockToken });
    }, 600);
  });
}

function getUserProfile() {
  return new Promise(function(resolve, reject) {
    wx.getUserProfile({
      desc: '用于完善个人资料',
      success: function(res) {
        console.info('[Auth] 获取用户资料成功');
        var existingInfo = getUserInfo() || {};
        var updatedInfo = Object.assign({}, existingInfo, {
          nickname: res.userInfo.nickName,
          avatarUrl: res.userInfo.avatarUrl,
          gender: res.userInfo.gender || 0,
          city: res.userInfo.city || '',
          province: res.userInfo.province || '',
          country: res.userInfo.country || ''
        });
        setUserInfo(updatedInfo);
        resolve(updatedInfo);
      },
      fail: function(err) {
        console.error('[Auth] 获取用户资料失败:', err);
        reject(err);
      }
    });
  });
}

function logout() {
  try {
    wx.removeStorageSync(USER_INFO_KEY);
    wx.removeStorageSync(LOGIN_TOKEN_KEY);
    console.info('[Auth] 用户已退出登录');
  } catch (e) {
    console.error('[Auth] 退出登录失败:', e);
  }
}

function updateUserInfo(updates) {
  var existingInfo = getUserInfo() || {};
  var updatedInfo = Object.assign({}, existingInfo, updates, { lastLoginTime: Date.now() });
  setUserInfo(updatedInfo);
  return updatedInfo;
}

module.exports = {
  isPrivacyAgreed: isPrivacyAgreed,
  setPrivacyAgreed: setPrivacyAgreed,
  isLoggedIn: isLoggedIn,
  getUserInfo: getUserInfo,
  setUserInfo: setUserInfo,
  getLoginToken: getLoginToken,
  wxLogin: wxLogin,
  getUserProfile: getUserProfile,
  logout: logout,
  updateUserInfo: updateUserInfo,
  PRIVACY_AGREED_KEY: PRIVACY_AGREED_KEY,
  USER_INFO_KEY: USER_INFO_KEY,
  LOGIN_TOKEN_KEY: LOGIN_TOKEN_KEY
};
