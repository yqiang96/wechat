// pages/shedlist/shedlist.js
const MD5 = require('../../utils/md5.js');
const util = require('../../utils/util.js');
var bmap = require('../../libs/bmap-wx.min.js');
const webSocket = require('../../utils/webSocket.js');
const app = getApp()
Page({
  data: {
    ak: "g6BVkgk46UXvefZH2xBybyhhtlhpM4Og",
    weatherData: [],
    city: "",
    temperature: "",
    wind: "",
    weatherDesc: "",
    pm: "",
    data: [],
    unitsid: '',
    first: false,
    windowHeight: 0,
    windowWidth: 0,
    scrollViewHeith: 0,
    pageFalse: {
      firstPage: false,
      serialNum: wx.getStorageSync('serialNum')
    },
    pageTrue: {
      firstPage: true,
      serialNum: wx.getStorageSync('serialNum')
    },
  },

  onLoad: function(options) {
    var that = this;
    //获取设备信息
    wx.getSystemInfo({
      success: function (res) {
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
    query.select('#head').boundingClientRect()
    query.exec(function (res) {
      that.setData({
        windowHeight: windowHeight,
        scrollViewHeith: windowHeight - res[0].height,
        windowWidth: windowWidth
      })
    })
    // 新建bmap对象   
    var BMap = new bmap.BMapWX({
      ak: that.data.ak
    });
    var fail = function(data) {
      console.log(data);
    };
    var success = function(data) {
      var weatherData = data.currentWeather[0];
      var temperature = weatherData.date.substr(14, 3);
      var wind = weatherData.wind.substr(-2, 2);
      var pm25 = weatherData.pm25
      var pm = "you"
      if (pm25 < 35) {
        pm = "优"
      } else {
        if (pm25 < 75) {
          pm = "良"
        } else {
          if (pm25 < 115) {
            pm = "轻度污染"
          } else {
            if (pm25 < 150) {
              pm = "中度污染"
            } else {
              pm = "重度污染"
            }
          }
        }
      }
      that.setData({
        city: weatherData.currentCity,
        temperature: temperature,
        wind: wind,
        weatherDesc: weatherData.weatherDesc,
        pm: pm
      });
    }
    // 创建websocket连接
    if (!app.globalData.socketOpen) {
      webSocket.connectSocket();
      app.globalData.socketOpen = true
      app.globalData.userId = true
    }
    // 发起weather请求   
    BMap.weather({
      fail: fail,
      success: success
    });

    var url = "https://www.iot.snsmart.cn/app/getIndexInfo";
    var params = "";
    var header = {
      'Content-Type': 'application/json',
      'cookie': wx.getStorageSync("COOKIE")
    }
    util._get_h(url, params, header, function(res) {
      console.log(res.data.data)
      var date = res.data.data
      if(date.length != 0){
        that.setData({
          data: res.data.data,
          unitId: date[0].units[0].id,
          unitsName: date[0].units[0].name,
          serialNum: date[0].units[0].serialNum
        })
        wx.setStorageSync("unitsName", date[0].units[0].name) //存储大棚名称
        wx.setStorageSync("unitId", date[0].units[0].id) //存储大棚ID
        wx.setStorageSync("serialNum", date[0].units[0].serialNum) //存储大棚序列号
        var currentTab = wx.setStorageSync("currentTab", 0)
      }else{
        that.setData({
          data:res.data.data
        })
      }
      
    })
  },
  noticetap: function() {
    wx.navigateTo({
      url: '../noticetap/noticetap',
    })
  },
  //长按
  bindTouchStart: function(e) {
    this.startTime = e.timeStamp;
  },
  bindTouchEnd: function(e) {
    this.endTime = e.timeStamp;
  },
  bindTap: function(e) {
    if (this.endTime - this.startTime < 350) {
      console.log("点击")
      var c = e.currentTarget
      var unitId = c.id
      var unitsName = c.dataset.name
      var serialNum = c.dataset.num
      wx.setStorageSync("unitsName", unitsName) //存储大棚名称
      wx.setStorageSync("unitId", unitId) //存储大棚ID
      wx.setStorageSync("serialNum", serialNum) //存储序列号
      var that = this
      var param = {
        type: 8002,
        data: that.data.pageFalse
      }
      var data = JSON.stringify(param)
      wx.sendSocketMessage({
        data: data,
        success: function(res) {
          console.log(res)
          that.setData({
            first: true
          })
        },
        fail: function(res) {
          console.log(res)
        }
      })
      wx.reLaunch({
        url: "../index/index?unitId=" + unitId
      })
    }
  },
  bingLongTap: function(e) {
    console.log("长按");
    var that = this;
    var id = e.currentTarget.id;
    wx.showActionSheet({
      itemList: ["设置"],
      success: function(res) {
        if (res.tapIndex == 0) {
          wx: wx.navigateTo({
            url: '../set/set',
          })
        }
      }
    })
  },
  test: function() {
    wx: wx.navigateTo({
      url: '../test/test',
    })
  },
  onShow: function() {
    var that = this
    if (that.data.first == true) {
      var param = {
        type: 8002,
        data: that.data.pageTrue
      }
      var data = JSON.stringify(param)
      wx.sendSocketMessage({
        data: data,
        success: function(res) {
          console.log(res)
        },
        fail: function(res) {
          wx.showModal({
            title: '网络连接失败',
            content: '是否重新连接',
            success:function(res){
              if(res.confirm){
                // 创建websocket连接
                if (!app.globalData.socketOpen) {
                  webSocket.connectSocket();
                  app.globalData.socketOpen = true
                }
              }
            }
          })
        }
      })
    }
    //socket关闭
    wx.onSocketClose(function (res) {
      console.log(res.data)
      if (app.globalData.userId == true){
        wx.showModal({
          title: '网络断开',
          content: '是否重新连接',
          success: function (res) {
            if (res.confirm) {
              webSocket.connectSocket();
              app.globalData.socketOpen = true
            }
          }
        })
      }
    })
    wx.onSocketMessage(function(res) {
      if (res.data != "恭喜你连接成功!") {
        var a = JSON.parse(res.data)
        if (a.type == 8009) {
          var data2 = that.data.data
          var params = that.data.data
          for (var i = 0; i < params.length; i++) {
            var ndata = params[i].units
            for (var u = 0; u < ndata.length; u++) {
              if (ndata[u].id == a.data.id) {
                params[i].units = [a.data]
                console.log(params[i].units)
              }
              break
            }
          }
          that.setData({
            data: params
          })
        } else if (a.type == 8001) {
          app.globalData.userId = false
          app.globalData.socketOpen = false
          wx.showModal({
            title: '账号冲突',
            content: '您被踢了！是否重新登录',
            success: function(res){
              if (res.confirm){
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
              }else if(res.cancel){

              }
            }
          })
        } else if (a.type == 8007) {
          console.log(a)
        } else if (a.type == 8006) {
          if (a.data.settingType == 1) {
            wx.showToast({
              title: '电机设置成功',
            })
          } else if (a.data.settingType == 2) {
            wx.showToast({
              title: '温度设置成功',
            })
          } else if (a.data.settingType == 3) {
            wx.showToast({
              title: '湿度设置成功',
            })
          } else if (a.data.settingType == 4) {
            wx.showToast({
              title: '定时设置成功',
            })
          } else if (a.data.settingType == 5) {
            wx.showToast({
              title: '大棚设置成功',
            })
          } else if (a.data.settingType == 6) {
            wx.showToast({
              title: '添加设备成功',
            })
          }
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    console.log('我走了')
    var that = this
    var param = {
      type: 8002,
      data: that.data.pageFalse
    }
    var data = JSON.stringify(param)
    console.log(data)
    wx.sendSocketMessage({
      data: data,
      success: function(res) {
        console.log(res)
        that.setData({
          first: true
        })
      },
      fail: function(res) {
        console.log(res)
      }
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    var that = this
    that.setData({
      first: false
    })
  },
  aaa:function(res){
    var a = '111111111111131111111111111111111111111111111111111'
    wx.showToast({
      title: a,
      icon:"none",
      duration: 5000,
    })
  },

})