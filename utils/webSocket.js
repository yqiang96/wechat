var app = getApp();
// socket已经连接成功
var socketOpen = false
// socket已经调用关闭function
var socketClose = false
// socket发送的消息队列
var socketMsgQueue = []
// 判断心跳变量
var heart = ''
// 心跳失败次数
var heartBeatFailCount = 0
// 终止心跳
var heartBeatTimeOut = null;
// 终止重新连接
var connectSocketTimeOut = null;
//计时器
var timer = null;

var webSocket = {

  /**
   * 创建一个 WebSocket 连接
   */
  connectSocket: function(options) {
    wx.showLoading({
      title: '',
    })
    socketOpen = false
    socketClose = false
    socketMsgQueue = []
    var user = app.globalData.userName
    wx.connectSocket({
      url: 'wss://www.iot.snsmart.cn/socketServer/' + user,
      success: function(res) {
        if (options) {
          // 成功回调
          clearTimeout(timer);
          options.success && options.success(res);
        }
      },
      fail: function(res) {
        if (options) {
          // 失败回调
          options.fail && options.fail(res);
        }
      }
    })
  },

  /**
   * 通过 WebSocket 连接发送数据
   */
  sendSocketMessage: function(options) {
    if (socketOpen) {
      wx.sendSocketMessage({
        data: options.msg,
        success: function(res) {
          if (options) {
            options.success && options.success(res);
          }
        },
        fail: function(res) {
          if (options) {
            options.fail && options.fail(res);
          }
        }
      })
    } else {
      socketMsgQueue.push(options.msg)
    }
  },

  /**
   * 关闭 WebSocket 连接。
   */
  closeSocket: function(options) {
    if (connectSocketTimeOut) {
      clearTimeout(connectSocketTimeOut);
      connectSocketTimeOut = null;
    }
    socketClose = true;
    var self = this;
    self.stopHeartBeat();
    wx.closeSocket({
      success: function(res) {
        console.log('WebSocket 已关闭！');
        if (options) {
          options.success && options.success(res);
        }
      },
      fail: function(res) {
        if (options) {
          options.fail && options.fail(res);
        }
      }
    })
  },

  // 收到消息回调
  onSocketMessageCallback: function(msg) {
    console.log(msg)
  },

  // 开始心跳
  startHeartBeat: function() {
    var self = this;
    heart = 'heart';
    self.heartBeat();
  },

  // 结束心跳
  stopHeartBeat: function() {
    console.log('socket结束心跳')
    var self = this;
    heart = '';
    if (heartBeatTimeOut) {
      clearTimeout(heartBeatTimeOut);
      heartBeatTimeOut = null;
    }
    if (connectSocketTimeOut) {
      clearTimeout(connectSocketTimeOut);
      connectSocketTimeOut = null;
    }
  },

  // 心跳
  heartBeat: function() {
    var self = this;
    if (!heart) {
      return;
    }
    self.sendSocketMessage({
      msg: 'heart',
      success: function(res) {
        console.log('socket心跳成功');
        if (heart) {
          heartBeatTimeOut = setTimeout(() => {
            self.heartBeat();
          }, 300000);
        }
      },
      fail: function(res) {
        console.log(res)
        console.log('socket心跳失败');
        // 重连
        self.connectSocket();
        if (heart) {
          heartBeatTimeOut = setTimeout(() => {
            self.heartBeat();
          }, 300000);
        }
        heartBeatFailCount++;
      },
    });
  }
}

// 监听WebSocket连接打开事件。callback 回调函数
wx.onSocketOpen(function(res) {
  wx.hideLoading();
  // 如果已经调用过关闭function
  if (socketClose) {
    webSocket.closeSocket();
  } else {
    socketOpen = true
    app.globalData.socketOpen = true
    app.globalData.first = true
    for (var i = 0; i < socketMsgQueue.length; i++) {
      webSocket.sendSocketMessage(socketMsgQueue[i])
    }
    socketMsgQueue = []
    webSocket.startHeartBeat();
  }
})

// 监听WebSocket错误。
wx.onSocketError(function(res) {
  console.log('WebSocket连接打开失败，请检查！', res)
  app.globalData.first = false
})

// 监听WebSocket接受到服务器的消息事件。
wx.onSocketMessage(function(res) {
  console.log('收到服务器内容：' + res.data)
  webSocket.onSocketMessageCallback(res.data)
})

// 监听WebSocket关闭。
wx.onSocketClose(function(res) {
  console.log('WebSocket 已关闭！')
  app.globalData.first = false
  if (!socketClose) {
    clearTimeout(connectSocketTimeOut)
    connectSocketTimeOut = setTimeout(() => {
      webSocket.connectSocket();
    }, 3000);
  }
})

module.exports = webSocket;