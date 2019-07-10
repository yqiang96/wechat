const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['1级', '2级', '3级', '4级', '5级'],
    inx: 1,
    trackMaxLength: 0,
    trackOpenTime: 0,
    tuyereMaxWidth: 0,
    tuyereOpenTime: 0,
    isLimit: true,
    isCount: false,
    isChecked: false,
    data: [],
    machine:[],
    machines:[],
    performer:[],
    performers: [],
    deleteIds:[],
    addIds:[],
    id:null
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
        console.log(this.data.performers)
      }
    }
  },
  // 滑动
  switch1Change: function (e) {
    console.log('switch1 发生 change 事件，携带值为', e.detail.value)
    this.setData({
      isLimit: e.detail.value
    })
    console.log(this.data.isLimit)
  },
  switch2Change: function (e) {
    console.log('switch2 发生 change 事件，携带值为', e.detail.value)
    this.setData({
      isCount: e.detail.value
    })
    console.log(this.data.isCount)
  },
  //下拉
  listenerPickerSelected: function (e) {
    this.setData({
      inx: e.detail.value
    });
  },
  //输入框
  trackMaxLength: function (e) {
    this.setData({
      trackMaxLength: e.detail.value
    })
  },
  trackOpenTime: function (e) {
    this.setData({
      trackOpenTime: e.detail.value
    })
  },
  tuyereMaxWidth: function (e) {
    this.setData({
      tuyereMaxWidth: e.detail.value
    })
  },
  tuyereOpenTime: function (e) {
    this.setData({
      tuyereOpenTime: e.detail.value
    })
  },
  sub: function () {
    var that = this;
    var url2 = "https://www.iot.snsmart.cn/app/updateMotorTuyere";
    console.log(that.data.performers)
    var n = that.data.performer
    var o = that.data.performers
    var deleteid = []
    var addid = []
    console.log(n)
    for(var i=0;i<n.length;i++){
      if(n[i].isChecked==true){
        if(o[i].isChecked==false){
          deleteid.push(n[i].id)
        }
      }else{
        if(o[i].isChecked == true){
          addid.push(n[i].id)
        }
      }
    }
    var params2 = {
      id: this.data.id,
      levelNumber: this.data.levelNumber,
      trackMaxLength: parseInt(this.data.trackMaxLength),
      trackOpenTime: parseInt(this.data.trackOpenTime),
      tuyereMaxWidth: parseInt(this.data.tuyereMaxWidth),
      tuyereOpenTime: parseInt(this.data.tuyereOpenTime),
      levelNumber: parseInt(this.data.inx) + 1,
      isLimit: this.data.isLimit,
      isCount: this.data.isCount,
      deleteIds:deleteid,
      addIds:addid
    }
    var header2 = {
      'Content-Type': 'application/json',
      'cookie': wx.getStorageSync("COOKIE")
    }
    console.log(params2)
    util._post(url2, params2, header2, function (res) {
      console.log(res.data)
      wx.reLaunch({
        url: '../../parameter/parameter',
      })
    })
  },
  onLoad: function (options) {
    var that = this;
    var idd = options.id;
    var urla = 'https://www.iot.snsmart.cn/app/getMotorTuyere';
    var parem = wx.getStorageSync("unitId");
    var pare = {
      unitId: parem
    };
    var machines = null
    var header = {
      'Content-Type': 'application/json',
      'cookie': wx.getStorageSync("COOKIE")
    }
    console.log(idd)
    util._get_h(urla, pare, header, function (res) {
      console.log(res.data.data)
      machines = res.data.data
      for(var i=0;i<machines.length;i++){
        var a = machines[i].id
        var b = machines[i]
        var num = machines[i].levelNumber-1
        if (a == idd) break;
      }
      that.setData({
        machine: [b],
        performer: b.performers,
        id:idd,
        inx:num,
        trackMaxLength: b.trackMaxLength,
        trackOpenTime: b.trackOpenTime,
        tuyereMaxWidth: b.tuyereMaxWidth,
        tuyereOpenTime: b.tuyereOpenTime
      })
      var datas = that.data.performer
      var data = []
      console.log(datas)
      for(var e=0;e<2;e++){
        data[e]=datas[e]
      }
      that.setData({
        performer:data,
        performers:data
      })
    })
  },
})