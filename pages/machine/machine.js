const util = require('../../utils/util.js')
var app = getApp();
Page({

  data: {
    data:{}
  },

  onLoad: function (options) {
    var that = this
    var url = "https://www.iot.snsmart.cn/app/getUnitByCode"
    var data = {}
    var header = {
      'Content-Type': 'application/json', 'cookie': wx.getStorageSync("COOKIE")
    }
    util._get_h(url,data,header,function(res){
      console.log(res.data)
      that.setData({
        data:res.data.data
      })
    })
  },
  //定时点击 长按
  bindTouchStart: function (e) {
    this.startTime = e.timeStamp;
  },
  bindTouchEnd: function (e) {
    this.endTime = e.timeStamp;
  },
  bindTap: function (e) {
    if (this.endTime - this.startTime < 350) {
      console.log("点击")
    }
  },
  bingLongTap: function (e) {
    console.log("长按");
    var that = this;
    var url = "https://www.iot.snsmart.cn/app/deleteDevice"
    var id = e.currentTarget.id;
    var data = {
      serialNumber: id
    }
    var header = {
      'Content-Type': 'application/json', 'cookie': wx.getStorageSync("COOKIE")
    }
    wx.showActionSheet({
      itemList: ["删除"],
      success: function (res) {
        if (res.tapIndex == 0) {
          util._get_h(url,data,header,function(res){
            console.log(res.data)
            if(res.data.code==200){
              that.onLoad()
            }else{
              wx.showToast({
                title: '删除失败',
              })
            }
          })
        } 
      }
    })
  },
  onShow: function(){
    var that = this
    wx.onSocketMessage(function(res){
      console.log(res)
      
    })
  }
  
})