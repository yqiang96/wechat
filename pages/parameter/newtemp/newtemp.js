const util = require('../../../utils/util.js')
Page({

  data: {
    sensorName: "",
    data: [],
    sensor: [],
    performers: [],
    standardTempera: 0,
    suitableLower: 0,
    suitableUpper: 0,
    alarmLower: 0,
    alarmUpper: 0,
    temp: []
  },
  //输入框
  suitableLower: function(e) {
    this.setData({
      suitableLower: e.detail.value
    })
  },
  suitableUpper: function(e) {
    this.setData({
      suitableUpper: e.detail.value
    })
  },
  alarmLower: function(e) {
    this.setData({
      alarmLower: e.detail.value
    })
  },
  alarmUpper: function(e) {
    this.setData({
      alarmUpper: e.detail.value
    })
  },
  standardTempera: function(e) {
    this.setData({
      standardTempera: e.detail.value
    })
  },

  onLoad: function(options) {
    var that = this;
    var idd = options.id
    console.log(idd)
    var Name = wx.getStorageSync("unitId")
    var params = {
      unitId: Name
    }
    var header = {
      'Content-Type': 'application/json',
      'cookie': wx.getStorageSync("COOKIE")
    }
    // 请求传感器
    var url2 = "https://www.iot.snsmart.cn/app/getSensorKeyValue"
    util._get_h(url2, params, header, function(res) {
      console.log(res.data.data)
      var a = res.data.data
      var g = []
      var name = []
      var data = []
      for (var i = 0; i < a.length; i++) {
        name[i] = a[i].name
        if (name[i].substr(2, 2) == "温度") {
          g.push(name[i])
        }
      }
      console.log(g)
      for (var j = 0; j < g.length; j++) {
        if (g.length == 2) {
          data[0] = "默认"
          data[j + 1] = g[j]
        } else {
          data[j] = g[j]
        }
      }
      console.log(data)
      that.setData({
        data: data,
        sensorName: data[0],
        sensor: res.data.data
      })
      console.log(that.data.sensor)
      that.temps_load(idd)
    })
  },
  temps_load: function(idd) {
    var that = this;
    var idd = idd;
    var k = null
    var h = null
    var sensor = that.data.sensor
    var urla = 'https://www.iot.snsmart.cn/app/getTemperaFactorByUnit';
    var parem = wx.getStorageSync("unitId");
    var pare = {
      unitId: parem
    };
    var temps = null
    var header = {
      'Content-Type': 'application/json',
      'cookie': wx.getStorageSync("COOKIE")
    }
    console.log(idd)
    util._get_h(urla, pare, header, function(res) {
      console.log(res.data.data)
      temps = res.data.data
      var data = that.data.data
      for (var i = 0; i < temps.length; i++) {
        var a = temps[i].id
        var b = temps[i]
        var c = b.performers
        var performer = []
        if (a == idd) break;
      }
      for (var p = 0; p < c.length; p++) {
        h = c[p].name.slice(0, 3);
        // console.log(h)
        if (h == "放风机") {
          if (performer.length < 2) {
            performer.push(c[p])
          }
        }
      }
      console.log(performer)
      console.log(sensor)
      if (performer.length == 2) {
        if (performer[0].isChecked == performer[1].isChecked) {
          if (performer[0].sensorId == performer[1].sensorId) {
            for (var q = 0; q < sensor.length; q++) {
              if (performer[0].sensorId == sensor[q].id) break;
            }
            that.setData({
              sensorName: sensor[q].name
            })
          } else {
            that.setData({
              sensorName: data[0]
            })
          }
        } else {
          if (performer[0].sensorId == performer[1].sensorId) {
            for (var q = 0; q < sensor.length; q++) {
              if (performer[0].sensorId == sensor[q].id) break;
            }
            that.setData({
              sensorName: sensor[q].name
            })
          } else {
            if(performer[0].sensorId==0){
              for (var q = 0; q < sensor.length; q++) {
                if (performer[1].sensorId == sensor[q].id) break;
              }
              that.setData({
                sensorName: sensor[q].name
              })
            } else if (performer[1].sensorId == 0){
              for (var q = 0; q < sensor.length; q++) {
                if (performer[0].sensorId == sensor[q].id) break;
              }
              that.setData({
                sensorName: sensor[q].name
              })
            }
          }
        }
      } else {
        for (var q = 0; q < sensor.length; q++) {
          if (performer[0].sensorId == sensor[q].id) break;
        }
        that.setData({
          sensorName: sensor[q].name
        })
      }
      that.setData({
        temp: [b],
        performers: performer,
        performer: performer,
        id: idd,
        alarmLower: b.alarmLower,
        alarmUpper: b.alarmUpper,
        standardTempera: b.standardTempera,
        suitableLower: b.suitableLower,
        suitableUpper: b.suitableUpper
      })
      
    })
  },
  //选择传感器
  sensorId: function(e) {
    var that = this
    wx.showActionSheet({
      itemList: that.data.data,
      success: function(res) {
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
  checkboxChange: function(e) {
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
  sub: function(e) {
    var that = this
    var url = "https://www.iot.snsmart.cn/app/addTemperaFactor";
    var data = that.data.sensor;
    var performers = that.data.performers;
    console.log(data.length)
    console.log(data)
    console.log(performers[1])
    if (data.length > 1) {
      if (that.data.sensorName == that.data.data[0]) {
        for (var i = 0; i < data.length; i++) {
          performers[i].sensorId = data[i].id
        }
      } else if (that.data.sensorName == that.data.data[1]) {
        for (var a = 0; a < data.length; a++) {
          performers[a].sensorId = data[1].id
        }
      } else if (that.data.sensorName == that.data.data[2]) {
        for (var b = 0; b < data.length; b++) {
          performers[b].sensorId = data[2].id
        }
      } else if (that.data.sensorName == that.data.data[3]) {
        for (var c = 0; c < data.length; c++) {
          performers[c].sensorId = data[3].id
        }
      }
    }else{
      for(var i=0;i<performers.length;i++){

      }
    }
    var n = that.data.performer
    var s = that.data.sensor
    var deleteid = []
    var addid = []
    var updateid = []
    console.log(n)
    console.log(that.data.sensor)
    for (var i = 0; i < n.length; i++) {
      if (n[i].isChecked == true) {
        if (performers[i].isChecked == false) {
          deleteid.push(n[i].id)
        }
      } else {
        if (performers[i].isChecked == true) {
          addid.push(n[i].id)
        }
      }
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
      addIds: addid,
      deleteIds: deleteid,

    }
    var header = {
      'Content-Type': 'application/json',
      'cookie': wx.getStorageSync("COOKIE")
    }
    console.log(params)
    util._post(url, params, header, function(res) {
      console.log(res.data)
    })
  },

})