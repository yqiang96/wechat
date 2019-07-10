const util = require('../../../utils/util.js')
Page({
  data: {
    items: [
      { name: '单次', value: 0 },
      { name: '每天', value: 1 },
      { name: '每周', value: 7 },
      { name: '自定义',value:10},
    ],
    items2: [
      { name: '先开后关', value: '先开后关'},
      { name: '先关后开', value: '先关后开'},
    ],
    startTime: '12:00',
    endTime:"12:00",
    performers:[],
    tcycle:0,
    operation:"",

  },
  //checkboxs
  checkboxChange: function (e) {
    var index = e.currentTarget.dataset;
    console.log(index)
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
        console.log(obj)
        console.log(this.data.performers)
      }
    }
  },
  bindStartTime: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      startTime: e.detail.value
    })
  },
  bindEndTime: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      endTime: e.detail.value
    })
  },
  //单选框
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      tcycle:e.detail.value
    })
  },
  radio2: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      operation: e.detail.value
    })
  },

  onLoad: function (options) {
    var that = this;
    var url = "https://www.iot.snsmart.cn/app/getPerformerKeyValue";
    var Name = wx.getStorageSync("unitId")
    var params = {
      unitId: Name
    }
    var header = {
      'Content-Type': 'application/json',
      'cookie': wx.getStorageSync("COOKIE")
    }
    util._get_h(url, params, header, function (res) {
      that.setData({
        performers: res.data.data
      })
    })
  },
  time:function(e){
    var that=this;
    var h = "--";
    var content=that.data.startTime.concat(h,that.data.endTime)
    console.log(content)
    var url = "https://www.iot.snsmart.cn/app/addTimer"
    var data = {
      id:0,
      content:content,
      operation:that.data.operation,
      performers:that.data.performers,
      statut:"开启",
      tcycle:that.data.tcycle,
    }
    var header = {
      'Content-Type': 'application/json',
      'cookie': wx.getStorageSync("COOKIE")
    }
    console.log(data)
    util._post(url,data,header,function(res){
      console.log(res.data)
    })
  }
})