const util = require('../../utils/util.js');
const webSocket = require('../../utils/webSocket.js');
const app = getApp();
Page({

  data: {
    userName: null,
    permission: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    var userName = app.globalData.userName
    var permission = app.globalData.permission
    if (permission == 1) {
      that.setData({
        permission: "管理员"
      })
    } else {
      that.setData({
        permission: "操作员"
      })
    }
    that.setData({
      userName: userName
    })
  },
  //添加设备
  register: function() {
    var that = this;
    var show;
    wx.scanCode({
      success: (res) => {
        this.show = res.result;
        app.globalData.serialNum = this.show
        wx.navigateTo({
          url: '../register3/register3',
        })
      },
      fail: (res) => {},
    })
  },
  // 用户信息
  user: function() {
    wx.navigateTo({
      url: '../user/user',
    })
  },
  // 报警
  noticetap: function() {
    wx.navigateTo({
      url: '../noticetap/noticetap',
    })
  },
  // 用户管理
  useradd: function() {
    wx.navigateTo({
      url: '../useradd/useradd',
    })
  },
  // 我的设备
  machine: function() {
    wx.navigateTo({
      url: '../machine/machine',
    })
  },
  // 修改密码
  modify: function() {
    wx.navigateTo({
      url: '../modify/modify',
    })
  },
  //关于我们
  aboutus: function() {
    wx.navigateTo({
      url: 'aboutus/aboutus',
    })
  },
  // 用户退出
  Logout: function() {
    var that = this;
    var url = "https://www.iot.snsmart.cn/app/systemLogout";
    var params = {};
    var header = {
      'Content-Type': 'application/json',
      'cookie': wx.getStorageSync("COOKIE")
    };
    wx.showModal({
      content: '是否退出账号',
      success: function(res) {
        if (res.confirm) {
          util._get_h(url, params, header, function(res) {
            app.globalData.login = false
            wx.clearStorageSync()
            wx.reLaunch({
              url: '../login/login',
            })
          })
        }
      },
      fail: function(res) {}
    })
  },
  onShow: function() {
    wx.onSocketMessage(function(res) {
      if (res.data != "恭喜你连接成功!") {
        var a = JSON.parse(res.data)
        if (a.type == 8001) {
          app.globalData.userId = false
          app.globalData.socketOpen = false
          wx.showModal({
            title: '账号冲突',
            content: '您被踢了！是否重新登录',
            success: function(res) {
              if (res.confirm) {
                wx.closeSocket({
                  success: function() {
                    console.log("关闭成功...")
                  },
                  fail: function() {
                    console.log("关闭失败...")
                  }
                });
                wx.onSocketClose(function(res) {
                  console.log("WebSocket连接已关闭")
                })
                wx.reLaunch({
                  url: '../login/login',
                })
              } else if (res.cancel) {

              }
            }
          })
        }
      }
    })
  }
})