// pages/order/index.js
import { request } from '../../request/request.js'
import regeneratorRuntime from '../../lib/runtime/runtime'
Page({
  data: {
    tabs: [
      {
        id: 0,
        value: '全部',
        isActive: true
      },
      {
        id: 1,
        value: '待付款',
        isActive: false
      },
      {
        id: 2,
        value: '待发货',
        isActive: false
      },
      {
        id: 3,
        value: '退货/退款',
        isActive: false
      }
    ],
  },
  onShow(options) { //页面显示获取对应数据
    const token = wx.getStorageSync("token");
    if (!token) { //判断有无token
      wx.navigateTo({
        url: '/pages/auth/index',
      });
      return;
    }
    // 获取当前小程序中的页面栈数组,打开之后能返回的的页面的数量最多为10个
    let pages = getCurrentPages();
    // 拿到当前页的栈
    let currentPage = pages[pages.length - 1];
    // 拿到超链接传来的type值
    const { type } = currentPage.options;
    // type要减一才能和index想对应
    this.changeTitleByIndex(type - 1)
    this.getOrders(type)
  },
  async getOrders(type) { //获取后台订单
    const res = await request({ url: "/my/orders/all", data: { type } })
    this.setData({
      orders: res.data.message.orders.map(v => ({ ...v, create_time_cn: (new Date(v.create_time * 1000).toLocaleString()) }))
    })
  },
  changeTitleByIndex(index) { //封装的tab点击
    // 2.修改源数组
    let tabs = this.data.tabs
    tabs.forEach((value, i) => i === index ? value.isActive = true : value.isActive = false)
    // 3.重新赋值
    this.setData({
      tabs
    })
  },
  tabsitemclick(e) { //导航栏处理子组件传来的点击
    // 1.拿到索引
    const index = e.detail
    // 调用点击事件
    this.changeTitleByIndex(index)
    // 点击不同分类需要请求不同的信息
    this.getOrders(index + 1)
  },
})