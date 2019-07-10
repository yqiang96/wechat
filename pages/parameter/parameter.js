const util = require('../../utils/util.js');
const webSocket = require('../../utils/webSocket.js');
var app = getApp()
Page({
  data: {
    navbar: ['电机设置', '温度设置', '湿度设置', '定时设置'],
    currentTab: 0,
    data: [],
    unitsName: "",
    time: [],
    temp: [],
    Humidity: [],
    id: null,
    showView: false,
    unitId: 0,
    serialNum: 0,
    machineB: false,
    tempB: false,
    humidityB: false,
    timeB: false,
    windowHeight: 0,
    windowWidth: 0,
    scrollViewHeith: 0,
  },
  // 添加
  machine: function() {
    var that = this
    that.setData({
      machineB: false
    })
    wx.navigateTo({
      url: 'machine/machine',
    })
  },
  temp: function() {
    var that = this
    that.setData({
      tempB: false
    })
    wx.navigateTo({
      url: 'temp/temp',
    })
  },
  humidity: function() {
    var that = this
    that.setData({
      humidityB: false
    })
    wx.navigateTo({
      url: 'humidity/humidity',
    })
  },
  times: function() {
    var that = this
    that.setData({
      timeB: false
    })
    wx.navigateTo({
      url: 'time/time',
    })
  },
  //切换设置
  navbarTap: function(e) {
    var that = this
    that.setData({
      currentTab: e.currentTarget.dataset.idx
    })
    if (that.data.currentTab == 0) {
      //电机设置
      if (!that.data.machineB) {
        that.setData({
          machineB: true
        })
        that.setMotor()
      }
    } else if (that.data.currentTab == 1) {
      //温度设置
      if (!that.data.humidityB) {
        that.setData({
          humidityB: true
        })
        that.setHumidity()
      }
    } else if (that.data.currentTab == 2) {
      // 湿度设置
      if (!that.data.tempB) {
        that.setData({
          tempB: true
        })
        that.setTemp()
      }
    } else if (that.data.currentTab == 3) {
      // 定时设置
      if (!that.data.timeB) {
        that.setData({
          timeB: true
        })
        that.setTime()
      }
    }
  },
  //页面初始化
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
    query.select('#top').boundingClientRect()
    query.exec(function(res) {
      that.setData({
        windowHeight: windowHeight,
        scrollViewHeith: windowHeight - res[0].height,
        windowWidth: windowWidth
      })
    })
    var Name = wx.getStorageSync("unitsName")
    var currentTab = wx.getStorageSync("currentTab")
    console.log(currentTab)
    that.setData({
      currentTab: currentTab
    })
    if (that.data.currentTab == 0) {
      //电机设置
      if (!that.data.machineB) {
        that.setData({
          machineB: true
        })
        that.setMotor()
      }
    } else if (that.data.currentTab == 1) {
      //温度设置
      if (!that.data.humidityB) {
        that.setData({
          humidityB: true
        })
        that.setHumidity()
      }
    } else if (that.data.currentTab == 2) {
      // 湿度设置
      if (!that.data.tempB) {
        that.setData({
          tempB: true
        })
        that.setTemp()
      }
    } else if (that.data.currentTab == 3) {
      // 定时设置
      if (!that.data.timeB) {
        that.setData({
          timeB: true
        })
        that.setTime()
      }
    }
  },

  //电机设置
  setMotor: function(data) {
    var that = this
    var url1 = 'https://www.iot.snsmart.cn/app/getMotorTuyere';
    var parem = wx.getStorageSync("unitId")
    var pare = {
      unitId: parem
    };
    var header = {
      'Content-Type': 'application/json',
      'cookie': wx.getStorageSync("COOKIE")
    }
    console.log(pare)
    util._get_h(url1, pare, header, function(res) {
      console.log(res.data)
      var data = res.data.data
      for (var i = 0; i < data.length; i++) {
        if (data[i].isCount == false) {
          data[i].isCount = "无"
        } else {
          data[i].isCount = "有"
        }
        if (data[i].isLimit == false) {
          data[i].isLimit = "无"
        } else {
          data[i].isLimit = "有"
        }
      }
      that.setData({
        data: data
      })
    })
  },
  //温度设置
  setHumidity: function() {
    var that = this
    var url = "https://www.iot.snsmart.cn/app/getTemperaFactorByUnit"
    var unitId = wx.getStorageSync("unitId")
    var data = {
      unitId: unitId
    }
    var header = {
      'Content-Type': 'application/json',
      'cookie': wx.getStorageSync("COOKIE")
    }
    util._get_h(url, data, header, function(res) {
      console.log(res.data.data)
      that.setData({
        temp: res.data.data
      })
    })
  },
  //湿度设置
  setTemp: function() {
    var that = this
    var url = "https://www.iot.snsmart.cn/app/getHumidityFactorByUnit"
    var unitId = wx.getStorageSync("unitId")
    var data = {
      unitId: unitId
    }
    var header = {
      'Content-Type': 'application/json',
      'cookie': wx.getStorageSync("COOKIE")
    }
    util._get_h(url, data, header, function(res) {
      console.log(res.data)
      that.setData({
        Humidity: res.data.data
      })
    })
  },
  //定时设置
  setTime: function() {
    var that = this;
    var header = {
      'Content-Type': 'application/json',
      'cookie': wx.getStorageSync("COOKIE")
    }
    var parem = wx.getStorageSync("unitId")
    var url4 = "https://www.iot.snsmart.cn/app/getTimerByUnit"
    var data = {
      unitId: parem
    }
    util._get_h(url4, data, header, function(res) {
      console.log(res.data.data)
      that.setData({
        time: res.data.data
      })
    })
  },

  // 点击展开
  onShowChange: function(event) {
    var that = this;
    var toggleBtnVal = that.data.unitId;
    var itemId = event.currentTarget.id;
    if (toggleBtnVal == itemId) {
      that.setData({
        unitId: 0
      })
    } else {
      that.setData({
        unitId: itemId
      })
    }
  },
  //电机点击 长按
  bindTouchStart2: function(e) {
    this.startTime = e.timeStamp;
  },
  bindTouchEnd2: function(e) {
    this.endTime = e.timeStamp;
  },
  bindTap2: function(e) {
    if (this.endTime - this.startTime < 350) {
      console.log("点击")
    }
  },
  bingLongTap2: function(e) {
    console.log("长按");
    var that = this;
    var id = e.currentTarget.id;
    wx.showActionSheet({
      itemList: ["编辑", "删除"],
      success: function(res) {
        if (res.tapIndex == 0) {
          that.setData({
            machineB: false
          })
          wx.navigateTo({
            url: 'newmachine/machine?id=' + id,
          })
        } else {
          var url = "https://www.iot.snsmart.cn/app/deleteMotorTuyere";
          var params = {
            id: id
          };
          var header = {
            'Content-Type': 'application/json',
            'cookie': wx.getStorageSync("COOKIE")
          };
          util._get_h(url, params, header, function(res) {
            console.log(res.data)
            wx.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 2000,
              success: res => {
                that.setData({
                  machineB: false
                })
                that.setTime()
              }
            })
          })
        }
      }
    })
  },
  //温度点击 长按
  bindTouchStart3: function(e) {
    this.startTime = e.timeStamp;
  },
  bindTouchEnd3: function(e) {
    this.endTime = e.timeStamp;
  },
  bindTap3: function(e) {
    if (this.endTime - this.startTime < 350) {}
  },
  bingLongTap3: function(e) {
    console.log("长按");
    var that = this;
    var id = e.currentTarget.id;
    var serialNum = wx.getStorageSync("serialNum")
    wx.showActionSheet({
      itemList: ["编辑", "删除"],
      success: function(res) {
        if (res.tapIndex == 0) {
          that.setData({
            humidityB: false
          })
          wx.navigateTo({
            url: 'newtemp/newtemp?id=' + id,
          })
        } else {
          var url = "https://www.iot.snsmart.cn/app/deleteTemperaFactor";
          var params = {
            id: id,
            serialNum: serialNum
          };
          var header = {
            'Content-Type': 'application/json',
            'cookie': wx.getStorageSync("COOKIE")
          };
          util._get_h(url, params, header, function(res) {
            console.log(res.data)
            wx.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 2000,
              success: res => {
                that.setData({
                  humidityB: false
                })
                that.setHumidity()
              }
            })
          })
        }
      }
    })
  },
  //湿度点击 长按
  bindTouchStart4: function(e) {
    this.startTime = e.timeStamp;
  },
  bindTouchEnd4: function(e) {
    this.endTime = e.timeStamp;
  },
  bindTap4: function(e) {
    if (this.endTime - this.startTime < 350) {}
  },
  bingLongTap4: function(e) {
    console.log("长按");
    var that = this;
    var id = e.currentTarget.id;
    var serialNum = wx.getStorageSync("serialNum")
    wx.showActionSheet({
      itemList: ["编辑", "删除"],
      success: function(res) {
        if (res.tapIndex == 0) {
          that.setData({
            tempB: false
          })
          wx.navigateTo({
            url: 'newhumidity/newhumidity?id=' + id,
          })
        } else {
          var url = "https://www.iot.snsmart.cn/app/deleteHumidityFactor";
          var params = {
            id: id,
            serialNum: serialNum
          };
          var header = {
            'Content-Type': 'application/json',
            'cookie': wx.getStorageSync("COOKIE")
          };
          util._get_h(url, params, header, function(res) {
            console.log(res.data)
            wx.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 2000,
              success: res => {
                that.setData({
                  tempB: false
                })
                that.setTemp()
              }
            })
          })
        }
      }
    })
  },
  //定时点击 长按
  bindTouchStart: function(e) {
    this.startTime = e.timeStamp;
  },
  bindTouchEnd: function(e) {
    this.endTime = e.timeStamp;
  },
  bindTap: function(e) {
    if (this.endTime - this.startTime < 350) {
      console.log("点击")
    }
  },
  bingLongTap: function(e) {
    console.log("长按");
    var that = this;
    var id = e.currentTarget.id;
    wx.showActionSheet({
      itemList: ["编辑", "删除"],
      success: function(res) {
        if (res.tapIndex == 0) {
          that.setData({
            timeB: false
          })
          wx: wx.navigateTo({
            url: 'newtime/newtime?id=' + id,
          })
        } else {
          var url5 = "https://www.iot.snsmart.cn/app/deleteTimer";
          var params = {
            id: id
          };
          var header = {
            'Content-Type': 'application/json',
            'cookie': wx.getStorageSync("COOKIE")
          };
          util._get_h(url5, params, header, function(res) {
            console.log(res.data)
            that.setData({
              timeB: false
            })
            that.onLoad()
          })
        }
      }
    })
  },
  //定时滑块
  switch1Change: function(e) {
    console.log('switch1 发生 change 事件，携带值为', e.detail.value)

  },
  onShow: function() {
    var that = this
    wx.onSocketMessage(function(res) {
      if (res.data != "恭喜你连接成功!") {
        var a = JSON.parse(res.data)
        if (a.type == 8006) {
          console.log(a.data)
          if (a.data.settingType == 1) {
            if (a.data.success == true) {
              wx.showToast({
                title: '电机设置成功',
              })
            } else {
              wx.showToast({
                title: '电机设置失败',
              })
            }
          } else if (a.data.settingType == 2) {
            if (a.data.success == true) {
              wx.showToast({
                title: '温度设置成功',
              })
            } else {
              wx.showToast({
                title: '温度设置失败',
              })
            }
          } else if (a.data.settingType == 3) {
            if (a.data.success == true) {
              wx.showToast({
                title: '湿度设置成功',
              })
            } else {
              wx.showToast({
                title: '湿度设置失败',
              })
            }
          } else if (a.data.settingType == 4) {
            if (a.data.success == true) {
              wx.showToast({
                title: '定时设置成功',
              })
            } else {
              wx.showToast({
                title: '定时设置失败',
              })
            }
          }
        } else if (a.type == 8001) {
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
        } else if (a.type == 8007) {
          console.log(a)
        } else if (a.type == 8006) {
          console.log(a)
        }
      }
    })
  }

})