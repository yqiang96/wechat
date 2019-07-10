// pages/useradd/useradd.js
const MD5 = require('../../utils/md5.js');
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:[],
    id:"",
  },
  useradd:function(){
    wx.navigateTo({
      url: 'operator/operator?id=1',
    })
  },
  touchStartTime: 0,
  touchEndTime: 0,
  lastTapTime: 0,
  lastTapTimeoutFunc: null,
  touchStart: function (e) {
    this.touchStartTime = e.timeStamp
  },
  touchEnd: function (e) {
    this.touchEndTime = e.timeStamp
  },
  longTap: function (e) {
    var url = "https://www.iot.snsmart.cn/app/deleteOperator";
    var params = {
      id: e.currentTarget.id
    }
    var header = {
      'Content-Type': 'application/json', 'cookie': wx.getStorageSync("COOKIE")
    }
    wx.showActionSheet({
      itemList: ["删除"],
      success:function(res){
        util._get_h(url,params,header,function(res){
          console.log(res)
        },function(res){})
      },
      fail:function(res){
        console.log(res.errMsg)
      }
    })
  },
  /// 单击
  user: function (e) {
    var that = this
    var id = e.currentTarget.dataset.id;
    console.log(id)
    if (that.touchEndTime - that.touchStartTime < 350) {
        that.lastTapTimeoutFunc = setTimeout(function () {
          // wx.redirectTo({
          //   url: 'ment/ment',
          // })
          wx.navigateTo({
            url: 'ment/ment?id='+id,
          })
        },300);
      
    }
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var url = "https://www.iot.snsmart.cn/app/getOperators"
    var params = ""
    var header = {
      'Content-Type': 'application/json', 'cookie': wx.getStorageSync("COOKIE")
    }
    util._get_h(url,params,header,function(res){
      console.log(res.data)
      that.setData({
        user: res.data.data,
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
  
  }
})