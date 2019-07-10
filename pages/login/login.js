const MD5 = require('../../utils/md5.js');
const util = require('../../utils/util.js');
var app = getApp();
Page({
  data: {
    userName: "",
    password: "",
    error: '',
    isLoading: false,
    isDisable: false,
    pas:true,
    focus: true,
  },

  // 获取输入账号 
  userNameInput: function (e) {
    this.setData({
      userName: e.detail.value
    })
  },

  // 获取输入密码 
  passwordInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },

  // 登录 
  loginBtnClick: function () {
    var that = this;
    this.data.userName ='15888888888';
    this.data.password = '123456';
    if (this.data.userName.length == 0 || this.data.password.length == 0) {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.switchTab({
        url: '../shedlist/shedlist',
      })
     //that.login(this.data.userName, this.data.password); //发送登录请求
    }
  },
  /**
   * 第三方服务器登录
   */
  login: function (userName, password) {
    var that = this;
    var url = "https://www.iot.snsmart.cn/app/systemLogin";
    var param = {
      userName: userName,
      passWord: MD5.hexMD5(password),
      langKey: "zh-cn",
      phone: userName,
      email: "",
      uuid: "",
      wxCode: app.globalData.Code,
    }
    console.log(param);
    wx.request({
      url: url,
      data: param,
      header: {
        "Content-Type": "application/json"
      },
      method: "POST",
      dataType: "json",
      responseType: "text",
      /**
       * 登录成功回调
       */
      success: function (res) {
        if (res.statusCode != 200) {
            wx.showToast({
              title: '密码不正确',
              icon: 'none',
              duration: 2000
            })
        } else {
          if (res.data.code != 200) {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 2000
              })
          } else {
            wx.switchTab({
              url: '../shedlist/shedlist',
            })
            app.globalData.login = true;
            var cookiekey = res.header["Set-Cookie"];
            wx.setStorageSync("COOKIE",cookiekey)
            var COOKIE = wx.getStorageSync('COOKIE')
            app.globalData.permission = res.data.data.permission
            app.globalData.userName = that.data.userName
          }
        }
      }, 
      /**
       * 登录失败回调
       */
      fail: function (res) {
        console.log("登录失败：" + JSON.stringify(res));
        that.setData({
          error: "登录错误:" + res.errMsg,
          isShowErrorTip: true
        })
      },
      /**
       * 登录结束回调
       */
      complete: function (res) {
       
      },
    })
  },

  /**
   * 设置加载进度条是否显示
   */
  setLoading: function (e) {
    this.setData({
      isLoading: !this.data.isLoading
    })
  },
  /**
   * 明码 暗码
   */
  yulan: function (e){
    var that=this
    console.log("diandaole")
    if(that.data.pas == false){
      that.setData({
        pas:true
      })
    }else{
      that.setData({
        pas:false
      })
    }
  },
  /**
   * 设置登录按钮是否禁用
   */
  setDisable: function (boo) {
    this.setData({
      isDisable: boo
    })
  },
  // 扫一扫
  scanCode: function () {
    var that = this;
    var show;
    wx.scanCode({
      success: (res) => {
        this.show = res.result;
        app.globalData.serialNum =this.show
        wx.navigateTo({
          url: '../register3/register3',
        })
      },
      fail: (res) => {},
    })
  },
  // 忘记密码
  phone:function(){
    wx.navigateTo({
      url: '../phone/phone',
    })
  },
})
