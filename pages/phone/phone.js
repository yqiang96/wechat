// pages/phone/phone.js
const MD5 = require('../../utils/md5.js');
const util = require('../../utils/util.js')
Page({
  data: {
    phone: '',
    code: '',
    password: '', 
    password2: '',
    codename: '获取验证码',
    iscode: null,
  },

  getPhoneValue: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  getCodeValue: function (e) {
    this.setData({
      code: e.detail.value
    })
  },
  getCode: function () {
    var a = this.data.phone;
    var _this = this;
    var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
    var url1 = "https://www.iot.snsmart.cn/app/systemSms";

    if (this.data.phone == "") {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else if (!myreg.test(this.data.phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else {
      var phones = {
        phone: a
      }
      util._get(url1, phones, function (res) {
        console.log(res.data.data)
        _this.setData({
          iscode: res.data.data,
          disabled: true
        })
        var num = 61;
        var timer = setInterval(function () {
          num--;
          if (num <= 0) {
            clearInterval(timer);
            _this.setData({
              codename: '重新发送',
              disabled: false
            })
          } else {
            _this.setData({
              codename: num + "s"
            })
          }
        }, 1000)
      })

    }
  },
  //获取密码
  getpas(e){
    this.setData({
      password: e.detail.value
    })
  },
  getpas2(e) {
    this.setData({
      password2: e.detail.value
    })

  },
  formsub:function(e){
    var that = this
    var username = that.data.phone;
    var pas = that.data.password;
    var pas2 = that.data.password2;
    var verfiCode = that.data.code;
    var url = "https://www.iot.snsmart.cn/app/retrievePassword"
    if (username == "" || verfiCode == "" || pas == "" || pas2 == "") {
      console.log(username,verfiCode,pas,pas2)
      wx.showModal({
        title: '提示',
        content: '请输入完整信息！',
        success: function (res) {
          
        }
    })
    } else {
      if (verfiCode == that.data.iscode){
        if (pas == pas2) {
          var params = {
            userName: username,
            password: MD5.hexMD5(pas),
            verfiCode: verfiCode
          }
          var header = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'cookie': wx.getStorageSync("COOKIE")
          }
          console.log(params)
          util._post(url, params, header, function (res) {
            console.log(res)
            if (res.statusCode == 200) {
              wx.showToast({
                title: '设置成功',
              })
            } if (res.statusCode == 400) {
              wx.showToast({
                title: '账号不正确',
                duration: '1000'
              })
            }
          }, function (res) {
            console.log(res)
          }, )
        } else {
          wx.showToast({
            title: '两次密码不相等',
            icon: 'none',
            duration: 1000
          })
        }
      }else{
        wx.showToast({
          title: '验证码错误',
          icon:"none",
          duration: 1000
        })
      }
      
    }
  },
  Email: function (){
    wx.navigateTo({
      url: '../Email/Email',
    })
  }
})