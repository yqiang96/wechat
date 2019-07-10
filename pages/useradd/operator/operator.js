// pages/useradd/operator/operator.js
const MD5 = require('../../../utils/md5.js');
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data:[],
    userName:"",
    password:"",
    addIds:[]
  },
  userNameInput:function(e){
    this.setData({
      userName: e.detail.value
    })
  },
  passwordInput:function(e){
    this.setData({
      password: e.detail.value
    })
  },
  checkboxChange:function(e){
    console.log(e.detail.value)
    var str = e.detail.value  
    var str2 = JSON.parse('[' + String(str) + ']')
    this.setData({
      addId:str2
    })
    console.log(this.data.addId)
  },
  submitInput:function(){
    var that = this;
    var uri = "https://www.iot.snsmart.cn/app/addOperator";
    var param = {
      userName:that.data.userName,
      password:that.data.password,
      addIds:that.data.addId,
    }
    var header ={
      'Content-Type': 'application/json', 'cookie': wx.getStorageSync("COOKIE")
    }
    if(that.data.userName == ""||that.data.password == ""){
      wx.showToast({
        title: '用户名和密码不能为空',
        icon:'none',
        duration:'1000'
      })
    }else{
      util._post(uri,param,header,function(res){
        wx.showToast({
          title: '添加成功',
          icon:"none",
          duration:1000
        })
        wx.navigateBack({
          delta:1
        })
      },function(res){})
    }

  },
  resetInput: function (e) {
    console.log('form发生了reset事件')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var url = "https://www.iot.snsmart.cn/app/getUnits"
    var params = ""
    var header = {
      'Content-Type': 'application/json', 'cookie': wx.getStorageSync("COOKIE")
    }
    util._get_h(url, params, header, function (res) {
      console.log(res.data.data)
      that.setData({
        data: res.data.data
      })
    }, function (res) {

    })
  
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