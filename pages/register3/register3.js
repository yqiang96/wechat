// pages/register3/register3.js
const util = require('../../utils/util.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serialNumber:null
  },
  onLoad: function (options) {
    console.log(app.globalData.login)
    var that=this
    that.setData({
      serialNumber: app.globalData.serialNum
    })

  },
  serialNumber:function(e){
    this.setData({
      serialNumber: e.detail.value
    })
  },
  register: function (){
    var that=this
    var url = "https://www.iot.snsmart.cn/app/checkSerialNumber"
    var data = {
      serialNumber:that.data.serialNumber
    }
    console.log(data)
    var header = {
      'Content-Type': 'application/json',
    } 
    if(that.data.serialNumber!=null){
      util._get_h(url, data, header, function (res) {
        console.log(res.data)
        if (res.data.code == 200) {
          wx.setStorageSync("serialNumber", that.data.serialNumber)
          if (app.globalData.login==true){
            wx.navigateTo({
              url: '../register2/register2',
            })
          }else{
            wx.navigateTo({
              url: '../register/register',
            })
          }
        } else {
          wx.showToast({
            title: res.data.msg,
          })
        }
      })
    }else{
      wx.showToast({
        title: '请输入序列号',
        duration: 1000,
      })
    }
  }
})