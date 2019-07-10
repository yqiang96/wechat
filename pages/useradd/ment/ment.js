// pages/useradd/ment/ment.js
const util = require('../../../utils/util.js');
Page({
  data: {
    performers:[],
    id:"",
    units:[],
    userName:0,
    addIds:[],
    deleteIds:[],
  },
  //checkboxs
  checkboxChange: function (e) {
    var index = e.currentTarget.dataset;
    console.log(index)
    var obj = this.data.performers
    for (var i = 0; i < obj.length; i++) {
      if (index.index == obj[i].id) {
        if (obj[i].isChecked == null) {
          obj[i].isChecked = true
        } else if (obj[i].isChecked == true) {
          obj[i].isChecked = false
        } else {
          obj[i].isChecked = true
        }
        console.log(this.data.performers)
      }
    }
  },
  userNameInput:function(e){
    this.setData({
      userName: e.detail.value
    })
  },
  onLoad: function (options) {
    var that = this;
    var url = "https://www.iot.snsmart.cn/app/getOperators"
    var params = ""
    var header = {
      'Content-Type': 'application/json', 'cookie': wx.getStorageSync("COOKIE")
    }
    var i = options.id
    util._get_h(url,params,header,function(res){
      var data = res.data.data
      var units = data[i].units
      console.log(units)
      that.setData({
        performers: units,
        id:data[i].id,
        units:units,
      })
    })
  },
  submit:function(e){
    var that = this;
    var performers = that.data.performers;
    var units = that.data.units;
    // var addIds = [];
    // var deleteIds = [];
    var url ="https://www.iot.snsmart.cn/app/editOperator";
    for(var i=0;i<performers.length;i++){
      if(performers[i].isChecked==true){
        if(performers[i].isChecked !== units[i].isChecked){
          var addIds = [performers[i].id];
        }else{
          var addIds = [];
        }
      }else{
        if(performers[i].isChecked !== units[i].isChecked){
          var deleteIds = [performers[i].id]
        }else{
          var deleteIds = []
        }
      }
    }
    var data = {
      id:that.data.id,
      userName:that.data.userName,
      addIds:addIds,
      deleteIds: deleteIds
    }
    var header = {
      'Content-Type': 'application/json', 'cookie': wx.getStorageSync("COOKIE")
    }
    util._post(url,data,header,function(res){
      console.log(res.data)
    })

  }
})