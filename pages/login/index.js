// pages/login/index.js
Page({
  data() {
    userInfo: ''
  },
  getUserProfile() { //点击获取用户信息
    wx.getUserProfile({
      desc: '用于完善会员资料', // 必填,弹出提示框,声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        let userInfo = res.userInfo
        wx.setStorageSync("userInfo", userInfo);
        // 在获取用户信息之后跳转到用户界面，用户界面属于tabbar，需要使用switchTab
        wx.switchTab({
          url: '/pages/user/index',
        });
      }
    })
  }
})