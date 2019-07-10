const util = require("../../utils/util.js")
var app = getApp()
Page({
  data: {
    navbar: ['报警中', '历史报警'],
    currentTab: 0,
    data:[]
  },
  navbarTap: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options){
    var that=this;
    var url = "https://www.iot.snsmart.cn/app/getAlarms";
    var params = {
      state: "sd", 
      alarmType: "wedfw",
      startDate: "wdw", 
      endDate: "wdw", 
      page: 1, 
      pageSize: 10
    };
    var header = {
      'Content-Type': 'application/json', 'cookie': wx.getStorageSync("COOKIE")
    }
    util._post(url,params,header,function(res){
      that.setData({
        data:res.data
      })
    },function(res){
      console.log(res)
    })
  }
}) 