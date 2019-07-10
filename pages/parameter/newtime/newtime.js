const util = require('../../../utils/util.js')
Page({
  data: {
    items: [{
        name: '单次',
        value: 0
      },
      {
        name: '每天',
        value: 1
      },
      {
        name: '每周',
        value: 7
      },
      {
        name: '自定义',
        value: 10
      },
    ],
    items2: [{
        name: '先开后关',
        value: '先开后关'
      },
      {
        name: '先关后开',
        value: '先关后开'
      },
    ],
    startTime: '12:00',
    endTime: "12:00",
    performers: [],
    tcycle: 0,
    operation: "",
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
  bindStartTime: function(e) {
    this.setData({
      startTime: e.detail.value
    })
  },
  bindEndTime: function(e) {
    this.setData({
      endTime: e.detail.value
    })
  },
  //单选框
  radioChange: function(e) {
    this.setData({
      tcycle: e.detail.value
    })
  },
  radio2: function(e) {
    this.setData({
      operation: e.detail.value
    })
  },

  onLoad: function(options) {
    var that = this;
    var ID = options.id
    var url = "https://www.iot.snsmart.cn/app/getTimerByUnit"
    var Name = wx.getStorageSync("unitId")
    var params = {
      unitId: Name
    }
    var header = {
      'Content-Type': 'application/json',
      'cookie': wx.getStorageSync("COOKIE")
    }
    util._get_h(url, params, header, function(res) {
      var data = res.data.data
      var items = that.data.items
      var items2 = that.data.items2
      for (var i = 0; i < data.length; i++) {
        if (data[i].id == ID) {
          var content = data[i].content
          var startTime = content.substring(0,5)
          var endTime = content.substring(7,12)
          that.setData({
            performers: data[i].performers,
            startTime: startTime,
            endTime: endTime
          })

          for (var a = 0; a < items.length; a++) {
            if (items[a].value == data[i].tcycle) {
              items[a].checked = true
              that.setData({
                items: items
              })
            }
          }
          for (var b = 0; b < items2.length; b++) {
            if (data[i].operation == items2[b].value) {
              items2[b].checked = true
              that.setData({
                items2: items2
              })
            }
          }
          break
        }
      }
    })
  },
  time: function(e) {
    var that = this;
    var h = "--";
    var content = that.data.startTime.concat(h, that.data.endTime)
    console.log(content)
    var url = "https://www.iot.snsmart.cn/app/addTimer"
    var data = {
      id: 0,
      content: content,
      operation: that.data.operation,
      performers: that.data.performers,
      statut: "开启",
      tcycle: that.data.tcycle,
    }
    var header = {
      'Content-Type': 'application/json',
      'cookie': wx.getStorageSync("COOKIE")
    }
    console.log(data)
    util._post(url, data, header, function(res) {
      console.log(res.data)
    })
  }
})