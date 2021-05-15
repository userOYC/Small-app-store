// pages/collect/index.js
Page({
  data: {
    tabs: [
      {
        id: 0,
        value: '商品收藏',
        isActive: true
      },
      {
        id: 1,
        value: '品牌收藏',
        isActive: false
      },
      {
        id: 2,
        value: '店铺收藏',
        isActive: false
      },
      {
        id: 3,
        value: '浏览足迹',
        isActive: false
      }
    ],
    collect: []
  },
  onShow: function () {
    const collect = wx.getStorageSync("collect") || [];
    this.setData({
      collect
    })
  },
  tabsitemclick(e) { //导航栏处理子组件传来的点击
    // 1.拿到索引
    const index = e.detail
    // 2.修改源数组
    let tabs = this.data.tabs
    tabs.forEach((value, i) => i === index ? value.isActive = true : value.isActive = false)
    // 3.重新赋值
    this.setData({
      tabs
    })
  },
})