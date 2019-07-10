//index.js
const app = getApp()
const util = require('../../utils/util.js');
const webSocket = require('../../utils/webSocket.js');
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    performers: [],
    sensors: [],
    unitId: 0,
    unitsName: '选择大棚',
    serialNum: 0,
    showModal: false,
    channels: [0],
    open: "开",
    shut: "关",
    stop: "停",
    Model: "",
    windowHeight: 0,
    windowWidth: 0,
    scrollViewHeith: 0,
  },

  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  onLoad: function(options) {
    var that = this;
    //获取设备信息
    wx.getSystemInfo({
      success: function(res) {
        console.log(res)
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      },
    })
    var query = wx.createSelectorQuery();
    var windowHeight = that.data.windowHeight
    var windowWidth = that.data.windowWidth
    query.select('#up').boundingClientRect()
    query.exec(function(res) {
      that.setData({
        windowHeight: windowHeight,
        scrollViewHeith: windowHeight - res[0].height,
        windowWidth: windowWidth
      })
    })
    var url1 = "https://www.iot.snsmart.cn/app/getUnitByArea";
    var params = "";
    var header = {
      'Content-Type': 'application/json',
      'cookie': wx.getStorageSync("COOKIE")
    }
    var Name = wx.getStorageSync("unitsName")
    var parem2 = wx.getStorageSync("unitId")
    var parem = options.unitId
    that.setData({
      unitsName: Name
    })
    wx.setNavigationBarTitle({
      title: that.data.unitsName,
    })
    console.log(parem)
    if (parem == "" || parem == undefined) {
      //第一次请求
      util._get_h(url1, params, header, function(res) {
        var Name = res.data.data
        console.log(res.data.data)
        that.setData({
          unitId: Name[0].units[0].id,
          unitsName: Name[0].units[0].name,
          serialNum: Name[0].units[0].serialNum
        })
        wx.setStorageSync("unitsName", that.data.unitsName) //存储大棚名称
        wx.setStorageSync("unitId", that.data.unitId) //存储大棚ID
        wx.setStorageSync("serialNum", that.data.serialNum) //存储大棚序列号
        console.log(that.data.unitId)
        //第二次请求
        var url2 = 'https://www.iot.snsmart.cn/app/deviceMonitor';
        var headers = {
          'Content-Type': 'application/json',
          'cookie': wx.getStorageSync("COOKIE")
        }
        var paress = {
          unitId: that.data.unitId
        }
        util._get_h(url2, paress, headers, function(res) {
          var data = res.data.data.performers
          for (var i = 0; i < data.length; i++) {
            data[i].channel = data[i].channel + 1
            if (data[i].workStatut == "运行") {
              data[i].workResult = "x"
            }
          }
          console.log(data)
          that.setData({
            performers: data,
            sensors: res.data.data.sensors,
            Model: res.data.data.controlModel
          })
        })
      })
    } else {
      var url3 = 'https://www.iot.snsmart.cn/app/deviceMonitor';
      var headers = {
        'Content-Type': 'application/json',
        'cookie': wx.getStorageSync("COOKIE")
      }
      var paresss = {
        unitId: parem
      }
      util._get_h(url3, paresss, headers, function(res) {
        console.log(res.data)
        var data = res.data.data.performers
        for (var i = 0; i < data.length; i++) {
          data[i].channel = data[i].channel + 1
          if (data[i].workStatut == "运行") {
            data[i].workResult = "x"
          }
        }
        console.log(data)
        that.setData({
          performers: data,
          sensors: res.data.data.sensors,
          Model: res.data.data.controlModel
        })
      }, function(res) {
        console.log(res.data);
      })

    }

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  set: function() {
    wx.navigateTo({
      url: '../set/set',
    })
  },
  test: function() {
    wx.navigateTo({
      url: '../parameter/newhumidity/newhumidity',

    })
  },

  /**
   * 弹窗
   */
  showDialogBtn: function(e) {
    var value = e.target.dataset
    var channel = value.channel
    console.log(channel)
    this.setData({
      showModal: true,
      channels: channel
    })
  },
  preventTouchMove: function() {},

  hideModal: function() {
    this.setData({
      showModal: false
    });
  },
  //开
  onCancel: function() {
    var that = this
    console.log([that.data.channels])
    var data = {
      action: that.data.open,
      channels: [that.data.channels],
      serialNum: wx.getStorageSync('serialNum')
    }
    var url = 'https://www.iot.snsmart.cn/app/deviceControl';
    var headers = {
      'Content-Type': 'application/json',
      'cookie': wx.getStorageSync("COOKIE")
    }
    console.log(data)
    util._post(url, data, headers, function(res) {
      console.log(res.data)
    }, function(res) {})
    that.hideModal();
  },
  //停
  onConfirm: function() {
    var that = this
    var data = {
      action: that.data.stop,
      channels: [that.data.channels],
      serialNum: wx.getStorageSync('serialNum')
    }
    var url = 'https://www.iot.snsmart.cn/app/deviceControl';
    var headers = {
      'Content-Type': 'application/json',
      'cookie': wx.getStorageSync("COOKIE")
    }
    console.log(data)
    util._post(url, data, headers, function(res) {
      console.log(res.data)
    }, function(res) {})
    that.hideModal();
  },
  //关
  onRight: function() {
    var that = this
    var data = {
      action: that.data.shut,
      channels: [that.data.channels],
      serialNum: wx.getStorageSync('serialNum')
    }
    var url = 'https://www.iot.snsmart.cn/app/deviceControl';
    var headers = {
      'Content-Type': 'application/json',
      'cookie': wx.getStorageSync("COOKIE")
    }
    console.log(data)
    util._post(url, data, headers, function(res) {
      console.log(res.data)
    }, function(res) {})
    that.hideModal();
  },
  // 一键全开 
  allopen: function(e) {
    var that = this
    var performers = that.data.performers
    var a = []
    var channels = []
    for (var i = 0; i < performers.length; i++) {
      a[i] = performers[i].channel
      channels.push(a[i])
    }
    var data = {
      action: that.data.open,
      channels: channels,
      serialNum: wx.getStorageSync('serialNum')
    }
    var url = 'https://www.iot.snsmart.cn/app/deviceControl';
    var headers = {
      'Content-Type': 'application/json',
      'cookie': wx.getStorageSync("COOKIE")
    }
    console.log(data)
    util._post(url, data, headers, function(res) {
      console.log(res.data)
      if (res.data.code != 200) {
        wx.showToast({
          title: res.data.msg,
          icon: 'loading'
        })
      }
    }, function(res) {})

  },
  //一键全关
  allshut: function(e) {
    var that = this
    var performers = that.data.performers
    var a = []
    var channels = []
    for (var i = 0; i < performers.length; i++) {
      a[i] = performers[i].channel
      channels.push(a[i])
    }
    var data = {
      action: that.data.shut,
      channels: channels,
      serialNum: wx.getStorageSync('serialNum')
    }
    var url = 'https://www.iot.snsmart.cn/app/deviceControl';
    var headers = {
      'Content-Type': 'application/json',
      'cookie': wx.getStorageSync("COOKIE")
    }
    console.log(data)
    util._post(url, data, headers, function(res) {
      console.log(res.data)
      if (res.data.code != 200) {
        wx.showToast({
          title: res.data.msg,
          icon: 'loading'
        })
      }
    }, function(res) {})
  },
  allwet: function(e) {

  },
  allwind: function(e) {

  },
  // 模式
  deviceModel: function(e) {
    var that = this
    var model = ""
    if(that.data.Model == "手动"){
      model = "智能"
    }else{
      model = "手动"
    }
    var data = {
      model: model,
      serialNum: wx.getStorageSync('serialNum')
    }
    var url = 'https://www.iot.snsmart.cn/app/deviceModel';
    var headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'cookie': wx.getStorageSync("COOKIE")
    }
    util._post(url, data, headers, function(res) {
      console.log(res.data)

    }, function() {})
  },
  onShow: function() {
    var that = this
    wx.onSocketMessage(function(res) {
      if (res.data != "恭喜你连接成功!") {
        var data = JSON.parse(res.data)
        console.log(data)
        var performers = that.data.performers
        if (data.type == 8003) {
          var num = data.data.performers
          for (var j = 0; j < num.length; j++) {
            num[j].channel = num[j].channel + 1
            if (num[j].workStatut == "运行") {
              num[j].workResult = "x"
            }
          }
          that.setData({
            Model: data.data.controlModel,
            performers: num,
            sensors: data.data.sensors
          })
        } else if (data.type == 8004) {
          var channel = data.data.channel + 1
          for (var i = 0; i < performers.length; i++) {
            if (performers[i].channel == channel) {
              performers[i].workStatut = data.data.workStatut
              if (performers[i].workStatut == "运行") {
                performers[i].workResult = "x"
              } else {
                performers[i].workResult = data.data.workResult
              }
            }
            // break
          }
          that.setData({
            performers: performers
          })
        } else if (data.type == 8001) {
          app.globalData.userId = false
          app.globalData.socketOpen = false
          wx.showModal({
            title: '账号冲突',
            content: '您被踢了！是否重新登录',
            success: function (res) {
              if (res.confirm) {
                wx.closeSocket({
                  success: function () {
                    console.log("关闭成功...")
                  },
                  fail: function () {
                    console.log("关闭失败...")
                  }
                });
                wx.onSocketClose(function (res) {
                  console.log("WebSocket连接已关闭")
                })
                wx.reLaunch({
                  url: '../login/login',
                })
              } else if (res.cancel) {

              }
            }
          })
        } else if(data.type == 8005){
          that.setData({
            Model:data.data.controlModel
          })
        } else if(data.type == 8006){
          if (data.data.settingType==1) {
            wx.showToast({
              title: '电机设置成功',
            })
          }else if(data.data.settingType==2){
            wx.showToast({
              title: '温度设置成功',
            })
          } else if (data.data.settingType == 3) {
            wx.showToast({
              title: '湿度设置成功',
            })
          } else if (data.data.settingType == 4) {
            wx.showToast({
              title: '定时设置成功',
            })
          } else if (data.data.settingType == 5) {
            wx.showToast({
              title: '大棚设置成功',
            })
          } else if (data.data.settingType == 6) {
            wx.showToast({
              title: '添加设备成功',
            })
          }
        }
      }
    }),
      wx.onSocketClose(function (res) {
      console.log(res.data)
      app.globalData.socketOpen = false
      if (app.globalData.socketOpen == false) {
        webSocket.connectSocket();
        app.globalData.socketOpen = true
      }
      })
  },
  onPullDownRefresh: function(res) {
    //当逻辑执行完后关闭刷新
    var that = this
    var data = {
      serialNum: wx.getStorageSync('serialNum')
    }
    console.log(data)
    var url = 'https://www.iot.snsmart.cn/app/deviceRefresh';
    var headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'cookie': wx.getStorageSync("COOKIE")
    }
    util._post(url, data, headers, function(res) {
      if (res.data.code == 200) {
        wx.showToast({
          title: '刷新成功',
        })
      } else {
        wx.showToast({
          title: '刷新失败',
        })
      }

    }, function() {})
    wx.stopPullDownRefresh()

  }
})