const MD5 = require('../../utils/md5.js');
const util = require('../../utils/util.js')
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    serialNumber:null,
    error: '',
    performers: [
      { 
        channel: 101,
        channelName:"接口1",
        name: [{ id: 0, name: "放风机1",type:"19" }],
        index:0, 
        checkbox:0,
        checked:false
      },
      {
        channel: 201,
        channelName: "接口2",
        name: [{ id: 0, name: "放风机1",type:"19" }],
        index: 0,
        checkbox: 1,
        checked: false
      },
      {
        channel: 301,
        channelName: "接口3",
        name: [
          { id: 0, name: "卷膜机", type: "11" },
          { id: 0, name: "卷帘机", type: "12" },
          { id: 0, name: "侧窗", type: "13" },
          { id: 0, name: "天窗", type: "14" },
          { id: 0, name: "遮阳帘", type: "18" },
          { id: 0, name: "放风机", type: "19" }
          ],
        index: 0,
        checkbox: 2,
        checked: false
      },
      {
        channel: 401,
        channelName: "接口4",
        name: [
          { id: 0, name: "补光灯", type: "01" },
          { id: 0, name: "喷淋水泵", type: "02" },
          { id: 0, name: "滴灌水泵", type: "03" },
          { id: 0, name: "喷雾泵", type: "04" },
          { id: 0, name: "水帘水泵", type: "05" },
          { id: 0, name: "水帘风机", type: "06" },
          { id: 0, name: "二氧化碳发生器",type:"07"},
          { id: 0, name: "扫雪机", type: "08" },
          { id: 0, name: "加热器", type: "09" },
          { id: 0, name: "电磁阀", type: "10" },
          { id: 0, name: "增氧机", type: "15" },
          { id: 0, name: "补水水泵",type: "16"},
          { id: 0, name: "投料机", type: "17" },
          { id: 0, name: "灭虫灯", type: "20" },
          ],
        index: 0,
        checkbox: 3,
        checked: false
      },
    ],
    data: [],
    sensors: [
      {
        channel: 101,
        channelName: "接口1",
        checkbox: 0,
        checked: false,
        name: [
          { id: 0, name: "温度传感器", type: "01" },
          { id: 0, name: "湿度传感器", type: "02" },
          { id: 0, name: "光照度传感器", type: "03" },
          { id: 0, name: "土壤温度传感器", type: "04" },
          { id: 0, name: "土壤水分传感器", type: "05" },
          { id: 0, name: "二氧化碳传感器", type: "06" },
          { id: 0, name: "大气压力感器", type: "07" },
          { id: 0, name: "风速传感器", type: "08" },
          { id: 0, name: "风向传感器", type: "09" },
          { id: 0, name: "雨量传感器", type: "10" },
          { id: 0, name: "露点传感器", type: "11" },
          { id: 0, name: "溶解氧传感器", type: "12" },
          { id: 0, name: "酸碱度传感器", type: "13" },
          { id: 0, name: "水温传感器", type: "14" },
          { id: 0, name: "水位传感器", type: "15" },
          { id: 0, name: "水压传感器", type: "16" },
          { id: 0, name: "雨水传感器", type: "17" },
          { id: 0, name: "氨氮传感器", type: "18" },
          { id: 0, name: "亚硝酸盐传感器", type: "19" },
          { id: 0, name: "辐射传感器", type: "20" },
          { id: 0, name: "土壤EC传感器", type: "21" },
          ],
        index: 0
      },
      {
        channel: 201,
        channelName: "接口2",
        name: [
          { id: 0, name: "温度传感器", type: "01" },
          { id: 0, name: "湿度传感器", type: "02" },
          { id: 0, name: "光照度传感器", type: "03" },
          { id: 0, name: "土壤温度传感器", type: "04" },
          { id: 0, name: "土壤水分传感器", type: "05" },
          { id: 0, name: "二氧化碳传感器", type: "06" },
          { id: 0, name: "大气压力感器", type: "07" },
          { id: 0, name: "风速传感器", type: "08" },
          { id: 0, name: "风向传感器", type: "09" },
          { id: 0, name: "雨量传感器", type: "10" },
          { id: 0, name: "露点传感器", type: "11" },
          { id: 0, name: "溶解氧传感器", type: "12" },
          { id: 0, name: "酸碱度传感器", type: "13" },
          { id: 0, name: "水温传感器", type: "14" },
          { id: 0, name: "水位传感器", type: "15" },
          { id: 0, name: "水压传感器", type: "16" },
          { id: 0, name: "雨水传感器", type: "17" },
          { id: 0, name: "氨氮传感器", type: "18" },
          { id: 0, name: "亚硝酸盐传感器", type: "19" },
          { id: 0, name: "辐射传感器", type: "20" },
          { id: 0, name: "土壤EC传感器", type: "21" },
        ],
        index: 0,
        checkbox: 1,
        checked: false
      },
      {
        channel: 301,
        channelName: "接口1",
        name: [
          { id: 0, name: "雨水传感器", type: "17" },
        ],
        index: 0,
        checkbox: 2,
        checked: false
      },
    ],
    sensors2: [],
    area: {channel: "分区名称",name: '东区1', id: 0, },
    unit: {channel: "大棚名称",name: '东区1',id: 0,}
  },
  //页面监控
  onLoad: function (options) {
    var that=this
    that.setData({
      serialNumber: wx.getStorageSync("serialNumber"),
      userName: wx.getStorageSync("userName"),
      password: wx.getStorageSync("password")
    })
    that.login()
  },
  login: function (e) {
    var that = this;
    var url = "https://www.iot.snsmart.cn/app/systemLogin";
    var userName = wx.getStorageSync("phone")
    var password = wx.getStorageSync("password")
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
            icon: 'loading',
            duration: 2000
          })
        } else {
          if (res.data.code != 200) {
            wx.showToast({
              title: res.data.msg,
              icon: 'loading',
              duration: 2000
            })
          } else {
            wx.showToast({
              title: '设备注册',
              duration: 500
            })
            var cookiekey = res.header["Set-Cookie"];
            wx.setStorageSync("COOKIE", cookiekey)
            var COOKIE = wx.getStorageSync('COOKIE')
            console.log(COOKIE)
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
          // isShowErrorTip: true
        })
      },
      /**
       * 登录结束回调
       */
      complete: function (res) {
        console.log("登录请求结束");
      },
    })
  },

  //执行设备
  bindPickerChange: function (e) {
    const curindex = e.target.dataset.current
    this.data.performers[curindex].index = e.detail.value
    this.setData({
      performers: this.data.performers,
    })
  },
  //执行设备复选框
  checkbox:function(e){
    const index = e.target.dataset.current  //performers 第i组
    var obj = this.data.performers
    console.log(obj)
    for (var i = 0; i < obj.length; i++) {
      if(index != 2){
        if (index == obj[i].checkbox) {
          if (obj[i].checked == false) {
            this.data.performers[index].checked = true
          } else {
            this.data.performers[index].checked = false
          }
        }
      }else{
        if (index == obj[i].checkbox) {
          if (obj[i].checked == false) {
            this.data.performers[index].checked = true
          } else {
            this.data.performers[index].checked = false
          }
        }
      }
    }
    var data = this.data.data
    var name = this.data.performers[index].name
    var idx = this.data.performers[index].index
    if (this.data.performers[index].checked==true){
      data[index] = name[idx]
      data[index].name = name[idx].name
      data[index].type = name[idx].type
      data[index].channel = this.data.performers[index].channel
      data[index].id = 0
    }else{
      data.splice(index,1)
    }
  },
  //传感设备
  bindPickerChange2: function (e) {
    const curindex = e.target.dataset.current
    this.data.sensors[curindex].index = e.detail.value
    this.setData({
      sensors: this.data.sensors
    })
  },
  //传感设备复选框
  checkbox2: function (e) {
    const index = e.target.dataset.current  //performers 第i组
    var obj = this.data.sensors
    for (var i = 0; i < obj.length; i++) {
      if (index == obj[i].checkbox) {
        if (obj[i].checked == false) {
          this.data.sensors[index].checked = true
        } else {
          this.data.sensors[index].checked = false
        }
      }
    }
    var data = this.data.sensors2
    var name = this.data.sensors[index].name
    var idx = this.data.sensors[index].index
    if (this.data.sensors[index].checked == true) {
      data[index] = name[idx]
      data[index].name = name[idx].name
      data[index].type = name[idx].type
      data[index].channel = this.data.sensors[index].channel
      data[index].id = 0
    } else {
      data.splice(index, 1)
    }
  },
//分区名称
  areaInput: function (e) {
    this.data.area.name = e.detail.value
    delete this.data.area.channel
  },
//大棚名称
  unitInput: function (e) {
    this.data.unit.name = e.detail.value
    delete this.data.unit.channel
  },

  //提交
  sub: function(e) {
    var that = this
    var performers = that.data.data
    var sensors = that.data.sensors2
    var area = that.data.area
    var unit = that.data.unit
    var data = {
      performers:performers,
      area:area,
      unit:unit,
      sensors: sensors,
      serialNumber:that.data.serialNumber
    }
    console.log(data)
    var url = "https://www.iot.snsmart.cn/app/deviceRegister"
     var header={
       'Content-Type': 'application/json',
       'cookie': wx.getStorageSync("COOKIE")
     }
     
     util._post(url,data,header,function(res){
       console.log(res.data)
       if(res.data.code==200){
         wx.showToast({
           title: res.data.msg,
           duration: 1000,
           success: res => {
             wx.reLaunch({
               url: '../login/login',
             })
           }
         })
       } else if (res.data.code==1025){
         wx.showToast({
           title: res.data.msg,
           duration: 1000,
           success: res => {
             wx.reLaunch({
               url: '../login/login',
             })
           }
         })
       }else{
         wx.showToast({
           title: res.data.msg,
           duration: 1000,
         })
       }
     })
  }
})