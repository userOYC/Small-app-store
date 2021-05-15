import { request } from '../../request/request.js'
Page({
  data: {
    swiperlist: [], //轮播图
    catelist: [], // 分类
    floorlist: [], //时尚女装/户外...
    // navigator_url: [] //轮播图跳转的路径
  },
  onLoad: function (options) {
    this.getswiperlist();
    this.getcatilist();
    this.getfloorlist()
  },
  getswiperlist() { //请求轮播图数据
    //首页轮播图接口
    request({ url: '/home/swiperdata' })
      .then(result => {
        // 返回的路径有出入，forEach做修改
        result.data.message.forEach(v => v.navigator_url = v.navigator_url.replace('main', 'index'))
        this.setData({
          swiperlist: result.data.message,
        })
      })
  },
  getcatilist() { //请求导航分类数据
    //首页导航分类接口
    request({ url: '/home/catitems' })
      .then(result => {
        this.setData({
          catelist: result.data.message
        })
      })
  },
  getfloorlist() { //请求楼层展示数据
    //首页楼层展示接口
    request({ url: '/home/floordata' })
      .then(result => {
        // console.log(result.data.message.length);
        for (var k = 0; k < result.data.message.length; k++) {
          result.data.message[k].product_list.forEach((v, i) => {
            // 接口返回的路径缺少index，使用replace替换
            result.data.message[k].product_list[i].navigator_url = v.navigator_url.replace('?', '/index?');
          });
        }
        this.setData({
          floorlist: result.data.message
        })
      })
  }
});
