const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const netStatus = function () {
  var that = this;
  wx.getNetworkType({
    success: function (res) {
      // console.log("networkType:" + res.networkType);
      return res.networkType;
    },
  })
}
module.exports = {
  formatTime: formatTime,
  netStatus: netStatus
}
//get请求
function _get(url, data, success, fail) {
  wx.request({
    url: url,
    data:data,
    success: function (res) {
      success(res);
    },
    fail: function (res) {
      fail(res);
    }
  });
}
//get_header
function _get_h(url, data,header,success, fail) {
  wx.request({
    url: url,
    data: data,
    // header:{
    //    'Content-Type':'application/json', 'cookie': wx.getStorageSync("COOKIE")
    // }
    header:header,
    success: function (res) {
      success(res);
    },
    fail: function (res) {
      fail(res);
    }
  });
}

//post请求
function _post(url, params,header,success, fail) {
  wx.request({
    url: url,
    header:header,
    // header:{
    //    'Content-Type':'application/x-www-form-urlencoded', 'cookie': wx.getStorageSync("COOKIE")
    // }
    method: 'POST',
    data: params,
    success: function (res) {
      success(res);
    },
    fail: function (res) {
      fail(res);
    }
  });
}

module.exports = {
  _get: _get,
  _get_h: _get_h,
  _post: _post,
}
