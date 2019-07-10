const MD5 = require('../../utils/md5.js');
const util = require('../../utils/util.js');
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userName: '',//姓名
    phone: '',//手机号
    code: '',//验证码
    password:'',
    password2:'',
    email:'',
    address:'',
    companyName:'',
    realName:'',
    post:'',
    iscode: null,//用于存放验证码接口里获取到的code
    codename: '获取验证码',
    show: false,
    selectData: ['1', '2', '3', '4', '5', '6'],
    index: 0
  },
  selectTap() {
    this.setData({
      show: !this.data.show
    });
  },

  //获取input输入框的值
  getNameValue: function (e) {
    this.setData({
      userName: e.detail.value
    })
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
      util._get(url1,phones,function(res){
        console.log(res.data.data)
        _this.setData({
          iscode: res.data.data
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
  //获取验证码
  getVerificationCode() {
    this.getCode();
    var _this = this
    _this.setData({
      disabled: true
    })
  },
  formSubmit: function (e) {
    var that=this
    var userName = e.detail.value.userName;
    var phone = e.detail.value.phone;
    var code = e.detail.value.code;
    var pas = e.detail.value.password;
    var pas2 = e.detail.value.password2;
    var email = e.detail.value.email;
    var address = e.detail.value.address;
    var companyName = e.detail.value.companyName;
    var realName = e.detail.value.realName;
    var post = e.detail.value.post;
    var url2 = "https://www.iot.snsmart.cn/app/systemRegister"
    //省事
    // var userName = "13287654321";
    // var phone = "13287654321";
    // var pas = "123456";
    // var pas2 = "123456";
    // var email = '1968758585@qq.com';
    // var address = "龙华";
    // var companyName = 'sdwd';
    // var realName = 'qwd';
    // var post = 'wdwd';
  
    var param={
      userName:userName,
      phone: phone,
      password: MD5.hexMD5(pas),
      email: email,
      address: address,
      companyName: companyName,
      realName:realName,
      post: post
    }
    var header = {
      'Content-Type':'application/json'
    }
    console.log(param)

    var str = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
    if (userName == "" || phone == "" || email == "" || code == "" || pas == "" || pas2 == "" || companyName == "" || realName == "" || post == "") {
      wx.showModal({
        title: '提示',
        content: '请输入完整信息！',
        success: function (res) {
          if (res.confirm) {
          }
        }
      })
    } else {
      console.log(e.detail.value)
      if (pas == pas2) {
        if (str.test(email)) {
          util._post(url2,param,header,function(res){
            if (res.statusCode == 200) {
              console.log(res)
              wx.showModal({
                title: '提示',
                content: '是否添加设备',
                success:function(res){
                  if (res.confirm) {
                    wx.setStorageSync("phone", phone)
                    wx.setStorageSync("password", pas)
                    console.log(wx.getStorageSync("phone"))
                    console.log(wx.getStorageSync("password"))
                    wx.navigateTo({
                      url: '../register2/register2',
                    })
                  } else if (res.cancel) {
                    wx.reLaunch({
                      url: '../login/login',
                    })
                  }
                }
              })
            }
          })
        } else {
          wx.showToast({
            title: '请填写正确的邮箱号',
            icon: 'none',
            duration: 1000
          })
        }
      } else {
        wx.showToast({
          title: '两次密码不相等',
          icon: 'none',
          duration: 1000
        })
      }
    }
  },
  login:function(e){
    
  },
  formReset: function () {
    console.log('form发生了reset事件')
  },

  // 点击下拉列表
  optionTap(e) {
    let Index = e.currentTarget.dataset.index;//获取点击的下拉列表的下标
    this.setData({
      index: Index,
      show: !this.data.show
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
  
  },
  // register2: function () {
  //   wx.navigateTo({
  //     url: '../register2/register2',
  //   })
  // }
})