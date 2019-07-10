// pages/modify/modify.js
const MD5 = require('../../utils/md5.js');
const util=require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    oldpassword:"",
    newpassword:"",
    toopassword:""
  },
  //获得输入框内容
  oldpassword:function(e){
    this.setData({
      oldpassword:e.detail.value
    })
  },
  newpassword:function(e){
    this.setData({
      newpassword: e.detail.value
    })
  },
  toopassword:function(e){
    this.setData({
      toopassword: e.detail.value
    })
  },
  //提交判断
  DetermineBtn:function(){
    var that=this;
    if (this.data.oldpassword.length == 0 || this.data.newpassword.length == 0 || this.data.toopassword.length == 0) {
      wx.showToast({
        title: '密码不能为空',
        icon: 'loading',
        duration: 2000
      })
    }else if (this.data.newpassword != this.data.toopassword) {
      wx.showToast({
        title: '两次新密码不同',
        icon: 'loading',
        duration: 2000
      })
    }else{
      that.Determine(this.data.oldpassword, this.data.newpassword);//发送请求
    }
  },
  //发起请求
  Determine:function(oldpassword,newpassword){
    var that = this;
    var url = "https://www.iot.snsmart.cn/app/modifyPassword"
    var params = {
      originalPassword: MD5.hexMD5(oldpassword),
      modifyPassword: MD5.hexMD5(newpassword),
    };
    var header = {
      'Content-Type': 'application/json', 'cookie': wx.getStorageSync("COOKIE")
    }
    util._post(url,params,header,function(res){
      console.log(res)
      if (res.data.code != 200) {
        wx.showToast({
          title: '修改失败',
          icon: 'loading'
        })
      } else {
        wx.showToast({
          title: '修改成功',
          duration: 2000,
        })
        wx.reLaunch({
          url: '../login/login',
        })
      }
    },function(res){

    })
  },
  phone: function (){
    wx.navigateTo({
      url: '../phone/phone',
    })
  }
})