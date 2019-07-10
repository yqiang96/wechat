const util = require('../../../utils/util.js')
Page({

  data: {
    sensorName:"",
    data:[],
    sensor:[],
    performers:[],
    standardTempera:0,
    suitableLower:0,
    suitableUpper:0,
    alarmLower:0,
    alarmUpper:0,
    sub:true
  },
  //输入框
  suitableLower: function (e) {
    this.setData({
      suitableLower: e.detail.value
    })
  },
  suitableUpper: function (e) {
    this.setData({
      suitableUpper: e.detail.value
    })
  },
  alarmLower: function (e) {
    this.setData({
      alarmLower: e.detail.value
    })
  },
  alarmUpper: function (e) {
    this.setData({
      alarmUpper: e.detail.value
    })
  },
  standardTempera:function(e){
    this.setData({
      standardTempera: e.detail.value
    })
  },

  onLoad: function (options) {
    var that = this;
    var url = "https://www.iot.snsmart.cn/app/getPerformerKeyValue";
    var unitId = wx.getStorageSync("unitId")
    var params = {
      unitId: unitId
    }
    var header = {
      'Content-Type': 'application/json',
      'cookie': wx.getStorageSync("COOKIE")
    }
    // 请求设备
    util._get_h(url, params, header, function (res) {
      console.log(res.data.data)
      var o = res.data.data
      var data = []
      for (var i = 0; i < o.length; i++) {
        o[i].isChecked = false
      }
      for (var j = 0; j<2;j++){
        data[j]=o[j]
      }
      console.log(o)
      that.setData({
        performers: data
      })
    })
    // 请求传感器
    var url2 = "https://www.iot.snsmart.cn/app/getSensorKeyValue"
    util._get_h(url2,params,header,function(res){
      console.log(res.data.data)
      var a = res.data.data
      var g = []
      var name = []
      var data = []
      for(var i=0;i<a.length;i++){
        name[i] = a[i].name
        if(name[i].substr(2,2) == "温度"){
          g.push(name[i])
        }
      }
      console.log(g)
      for(var j=0;j<g.length;j++){
        if (g.length == 2) {
          data[0] = "默认"
          data[j + 1] = g[j]
        } else {
          data[j] = g[j]
        }
      }
      console.log(data)
      if (data.length == 0) {
        data[0] = "无传感器"
      }
      that.setData({
        data:data,
        sensorName:data[0],
        sensor:res.data.data
      })
      console.log(that.data.sensor)
    },function(res){
      console.log(res.data)
    })
  },
  //选择传感器
  sensorId: function (e) {
    var that = this
    wx.showActionSheet({
      itemList: that.data.data,
      success: function (res) {
        console.log(res.tapIndex)
        if (res.tapIndex === 0) {
          that.setData({
            sensorName: that.data.data[0]
          })
        } else if (res.tapIndex === 1) {
          that.setData({
            sensorName: that.data.data[1]
          })
        } else if (res.tapIndex === 2) {
          that.setData({
            sensorName: that.data.data[2]
          })
        }
      }
    })
  },
  //checkboxs
  checkboxChange: function (e) {
    var index = e.currentTarget.dataset;
    var obj = this.data.performers
    for (var i = 0; i < obj.length; i++) {
      if (index.index == obj[i].id) {
        if (obj[i].isChecked == null) {
          obj[i].isChecked = true
        } else if (obj[i].isChecked == true) {
          obj[i].isChecked = false
        } else {
          obj[i].isChecked = true
        }
      }
    }
  },
  sub: function (e) {
    var that = this
    var url = "https://www.iot.snsmart.cn/app/addTemperaFactor";
    var data = that.data.sensor;
    var performers = that.data.performers;
    var serialNum = wx.getStorageSync("serialNum")
    console.log(data)
    console.log(performers)
    if (data.length ==2) {
      if (that.data.sensorName == that.data.data[0]) {
        for (var i = 0; i < performers.length; i++) {
          performers[i].sensorId = data[i].id
        }
      } else if (that.data.sensorName == that.data.data[1]) {
        for (var a = 0; a < performers.length; a++) {
          performers[a].sensorId = data[0].id
        }
      } else if (that.data.sensorName == that.data.data[2]) {
        for (var b = 0; b < performers.length; b++) {
          performers[b].sensorId = data[1].id
        }
      }else if (that.data.sensorName == that.data.data[3]) {
        for (var c = 0; c < performers.length; c++) {
          performers[c].sensorId = data[2].id
        }
      }
    }else if(data.length==1){
      for (var i = 0; i < performers.length; i++) {
        performers[i].sensorId = data[0].id
      }
    }else if(data.length==0){
      that.setData({
        sub:false
      })
    }
    console.log(that.data.performers)
    var params = {
      id: 0,
      standardTempera: that.data.standardTempera,
      suitableLower: that.data.suitableLower,
      suitableUpper: that.data.suitableUpper,
      alarmLower: that.data.alarmLower,
      alarmUpper: that.data.alarmUpper,
      performers: that.data.performers,
      serialNum: serialNum
    }
    var header = {
      'Content-Type': 'application/json',
      'cookie': wx.getStorageSync("COOKIE")
    }
    console.log(params)
    if(that.data.sub==true){
      util._post(url, params, header, function (res) {
        console.log(res.data)
        wx.showToast({
          title: '添加成功',
          icon: 'success',
          duration: 1000,
          success: res => {
            var currentTab = wx.setStorageSync("currentTab", 1)
            wx.reLaunch({
              url: '../../parameter/parameter',
            })
          }
        })
      })
    }else{
      wx.showToast({
        title: '无传感器',
        // icon:"",
        duration: 2000,
      })
    }
  },

})