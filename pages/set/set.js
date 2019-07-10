const util = require('../../utils/util.js')
Page({
  data: {
    checkedA:false,
    checkedB:true,
    checkedC:false,
    unitName:"",
    collectCycle: "",
    pushCycle: "",
    haveRain: "",
    nightModel: "",
    nightInterval: "",
    haveFirstBlower: "",
    firstBlowerTempera: "",
    firstBlowerDistance: "",
    mainPhone: "",
    spacePhone: "",
    factorAlarmWay: "",
    deviceAlarmWay: "",
    dumpAlarmWay: "",
    listData1: [
      {"text": "已购买总条数(条)", "type": "1000" },
      {"text": "已使用条数(条)", "type": "300" },
      {"text": "剩余条数(条)", "type": "700" }
    ],
    listData2: [
      { "text": "已购买总条数(条)", "type": "1000" },
      { "text": "已使用条数(条)", "type": "300" },
      { "text": "剩余条数(条)", "type": "700" }
    ]
  },
  switch1Change: function (e) {
    this.setData({
      checkedA: e.detail.value
    })
  },
  switch2Change: function (e) {
    this.setData({
      checkedB: e.detail.value
    })
  },
  switch3Change: function (e) {
    this.setData({
      checkedC: e.detail.value
    })
  },
  
  updata:function(e){
    var that = this;
    var unitName = that.data.unitName
    var collectCycle = that.data.collectCycle
    var pushCycle = that.data.pushCycle
    var haveRain = that.data.haveRain
    var nightModel = that.data.nightModel
    var nightInterval = that.data.nightInterval
    var haveFirstBlower = that.data.haveFirstBlower
    var firstBlowerTempera = that.data.firstBlowerTempera
    var firstBlowerDistance = that.data.firstBlowerDistance
    var mainPhone = that.data.mainPhone
    var spacePhone = that.data.spacePhone
    var factorAlarmWay = that.data.factorAlarmWay
    var deviceAlarmWay = that.data.deviceAlarmWay
    var dumpAlarmWay = that.data.dumpAlarmWay
    var url = "https://www.iot.snsmart.cn/app/updateUnitSupply"
    var param = {
      unitName: unitName,
      collectCycle: collectCycle,
      pushCycle: pushCycle,
      haveRain: haveRain,
      nightModel: nightModel,
      nightInterval: nightInterval,
      haveFirstBlower: haveFirstBlower,
      firstBlowerTempera: firstBlowerTempera,
      firstBlowerDistance: firstBlowerDistance,
      mainPhone: mainPhone,
      spacePhone: spacePhone,
      factorAlarmWay: factorAlarmWay,
      deviceAlarmWay: deviceAlarmWay,
      dumpAlarmWay: dumpAlarmWay,
    }
    var header ={
      'Content-Type':'application/x-www-form-urlencoded', 'cookie': wx.getStorageSync("COOKIE")
    }
    console.log(param)
    util._post(url,param,header,function(res){
      console.log(res.data)
    })
  },
  onLoad: function (options) {
    var that = this;
    var a = wx.getSystemInfoSync().windowWidth
    console.log(a)
    wx.setNavigationBarTitle({
      title: wx.getStorageSync("unitsName"),
    })
    var url = "https://www.iot.snsmart.cn/app/getUnitSupply"
    var ID = wx.getStorageSync("unitId")
    var params = {
      unitId:ID
    }
    var header = {
      'Content-Type': 'application/json', 'cookie': wx.getStorageSync("COOKIE")
    }
    util._get_h(url,params,header,function(res){
      console.log(res.data.data)
      that.setData({
        unitName: res.data.data.unitName,
        collectCycle: res.data.data.collectCycle,
        pushCycle: res.data.data.pushCycle,
        checkedA: res.data.data.haveRain,
        checkedB: res.data.data.nightModel,
        nightInterval: res.data.data.nightInterval,
        checkedC: res.data.data.haveFirstBlower,
        firstBlowerTempera: res.data.data.firstBlowerTempera,
        firstBlowerDistance: res.data.data.firstBlowerDistance,
        mainPhone: res.data.data.mainPhone,
        spacePhone: res.data.data.spacePhone,
        factorAlarmWay: res.data.data.factorAlarmWay,
        deviceAlarmWay: res.data.data.deviceAlarmWay,
        dumpAlarmWay: res.data.data.dumpAlarmWay,
      })
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