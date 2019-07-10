//app.js
App({
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs) //存储日志信息
    this.netStatus();
    // 登录
    wx.login({
      success: res => {
        this.globalData.wxCode = res.code;
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        } else {}
      }
    })
  },
  netStatus: function() {
    var that = this;
    wx.getNetworkType({
      success: function(res) {
        console.log("networkType:" + res.networkType);
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  /**
   * 设置全局变量
   */
  globalData: {
    userInfo: null,
    wxCode: null,
    currentUnit: null,
    login: null,
    serialNum: null,
    socketOpen:false,
    userName:null,
    permission:null,
    userId:true,
  },
})