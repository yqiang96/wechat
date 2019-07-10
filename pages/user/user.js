const util = require('../../utils/util.js')
// var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username:"",
    roleName:"",
    email:"",
    address:"",
    companyName:"",
    realName:"",
    post:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var url3 = "https://www.iot.snsmart.cn/app/userDetails"
    var dat = "";
    var header ={
      'content-type': 'application/json', 'cookie': wx.getStorageSync("COOKIE")
    }
    util._get_h(url3,dat,header,function(res){
      console.log(res.data)
      that.setData({
        username: res.data.data.userName,
        rolename: res.data.data.roleName,
        email: res.data.data.email,
        address: res.data.data.address,
        companyname: res.data.data.companyName,
        realname: res.data.data.realName,
        post: res.data.data.post
      })
    },function(res){})
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.onSocketMessage(function (res) {
      console.log(res.data)
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  test: function(){
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
  },
})