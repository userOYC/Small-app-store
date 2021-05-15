// pages/user/index.js
Page({
  data: {
    userInfo: []
  },
  onShow() {
    let userInfo = wx.getStorageSync("userInfo");
    this.setData({
      userInfo
    })
  }
})