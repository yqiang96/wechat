var app = getApp()
Page({
  data: {
    navbar: ['报警中', '历史报警'],
    currentTab: 0
  },
  navbarTap: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  }
}) 