const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['1级', '2级', '3级', '4级', '5级'],
    index: 1,
    trackMaxLength: 0,
    trackOpenTime: 0,
    tuyereMaxWidth: 0,
    tuyereOpenTime: 0, 
    isLimit: true,
    isCount: false,
    isChecked: false,
    data: [],
    performers: [],
    id: 0,
  },
  //checkboxs
  checkboxChange: function(e) {
    var index = e.currentTarget.dataset;
    console.log(index)
    var obj = this.data.performers
    for(var i=0;i<obj.length;i++){
      if(index.index==obj[i].id){
        if(obj[i].isChecked == null){
          obj[i].isChecked = true
        }else if (obj[i].isChecked==true){
          obj[i].isChecked=false
        }else{
          obj[i].isChecked = true
        }
        console.log(obj)  
        console.log(this.data.performers)
      }
    }
  },
  // 滑动
  switch1Change: function(e) {
    console.log('switch1 发生 change 事件，携带值为', e.detail.value)
    this.setData({
      isLimit: e.detail.value
    })
    console.log(this.data.isLimit)
  },
  switch2Change: function(e) {
    console.log('switch2 发生 change 事件，携带值为', e.detail.value)
    this.setData({
      isCount: e.detail.value
    })
    console.log(this.data.isCount)
  },
  //下拉
  listenerPickerSelected: function(e) {
    this.setData({
      index: e.detail.value
    });
  },
  //输入框
  trackMaxLength: function(e) {
    this.setData({
      trackMaxLength: e.detail.value
    })
  },
  trackOpenTime: function(e) {
    this.setData({
      trackOpenTime: e.detail.value
    })
  },
  tuyereMaxWidth: function(e) {
    this.setData({
      tuyereMaxWidth: e.detail.value
    })
  },
  tuyereOpenTime: function(e) {
    this.setData({
      tuyereOpenTime: e.detail.value
    })
  },
  sub: function() {
    var that = this;
    var url2 = "https://www.iot.snsmart.cn/app/addMotorTuyere";
    var arr = this.data.performers;
    var arr2 = arr.push()
    var currentTab = 0
    var params2 = {
      id: this.data.id,
      levelNumber: this.data.levelNumber,
      trackMaxLength: parseInt(this.data.trackMaxLength),
      trackOpenTime: parseInt(this.data.trackOpenTime),
      tuyereMaxWidth: parseInt(this.data.tuyereMaxWidth),
      tuyereOpenTime: parseInt(this.data.tuyereOpenTime),
      levelNumber: parseInt(this.data.index) + 1,
      isLimit: this.data.isLimit,
      isCount: this.data.isCount,
      performers: this.data.performers
    }
    var header2 = {
      'Content-Type': 'application/json',
      'cookie': wx.getStorageSync("COOKIE")
    }
    console.log(params2)
    util._post(url2, params2, header2, function(res) {
      console.log(res.data)
      wx.showToast({
        title: '添加成功',
        icon: 'success',
        duration: 2000,
        success: res => {
          wx.reLaunch({
            url: '../../parameter/parameter?currentTab=' + currentTab,
          })
        }
      })

    })
  },
  onLoad: function(options) {
    var that = this;
    var url = "https://www.iot.snsmart.cn/app/getPerformerKeyValue";
    var Name = wx.getStorageSync("unitId")
    var params = {
      unitId: Name
    }
    var header = {
      'Content-Type': 'application/json',
      'cookie': wx.getStorageSync("COOKIE")
    }
    util._get_h(url, params, header, function(res) {
      console.log(res.data.data)
      var o = res.data.data
      var data = []
      for (var i = 0; i < o.length; i++) {
        o[i].isChecked = false
      }
      for (var j = 0; j < 2; j++) {
        data[j] = o[j]
      }
      console.log(o)
      that.setData({
        performers: data
      })
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    wx.onSocketMessage(function(res){
      console.log("socket掉线")
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})