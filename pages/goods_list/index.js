// pages/goods_list/index.js
import { request } from '../../request/request.js'
import regeneratorRuntime from '../../lib/runtime/runtime'
Page({
  data: {
    tabs: [
      {
        id: 0,
        value: '综合',
        isActive: true
      },
      {
        id: 1,
        value: '销量',
        isActive: false
      },
      {
        id: 2,
        value: '价格',
        isActive: false
      },
    ],
    goods_list: []
  },
  QueryParams: { // 请求接口需要的参数
    query: "",
    cid: "",
    pagenum: 1, //请求页数
    pagesize: 10 //请求多少数据
  },
  // 设置初始总页数
  totalpages: 1,
  onLoad: function (options) { //页面加载生命周期事件
    // console.log(options);
    this.QueryParams.cid = options.cid || ""; //拿到商品对应id
    this.QueryParams.query = options.query || ""; //从首页跳转的需要拿query
    // console.log(this.QueryParams.cid);
    this.getGoodsList()
    // console.log(this.QueryParams);
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
  async getGoodsList() { //请求商品列表
    // url之后跟的是请求接口需要的参数
    const res = await request({ url: "/goods/search", data: this.QueryParams })
    // 获取数据的总条数
    const total = res.data.message.total
    // 计算总页数
    this.totalpages = Math.ceil(total / this.QueryParams.pagesize)
    this.setData({ //重新赋值 ,将新的数据添加到数组中
      goods_list: [...this.data.goods_list, ...res.data.message.goods]
    })
    // 数据刷新之后关闭上拉等待效果
    wx.stopPullDownRefresh()
  },
  // 上拉加载更多
  onReachBottom() {
    // 如果QueryParams中的页数大于了数据中的总页数
    if (this.QueryParams.pagenum >= this.totalpages) {
      // 没有下一页数据
      wx.showToast({ title: '没有下一页数据了' });
    } else {
      // 还有下一页数据
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },
  // 下拉刷新页面
  onPullDownRefresh() {
    // 1.清空数组
    this.setData({
      goods_list: []
    })
    // 2.重置页数
    this.QueryParams.pagenum = 1;
    // 3.发送请求
    this.getGoodsList()
  }
})