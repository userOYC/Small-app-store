// pages/goods_detail/index.js
import { request } from '../../request/request.js'
import regeneratorRuntime from '../../lib/runtime/runtime'
Page({
  data: {
    goodsobj: {},
    isCollect: false, //当前商品是否收藏
  },
  // 7.商品对象
  GoodsInfo: {},
  onShow: function (options) {
    // 得到所有栈页面
    let pages = getCurrentPages();
    // 得到当前页面栈
    let currentPage = pages[pages.length - 1]
    // 1.获取id
    const goods_id = currentPage.options.goods_id;
    // 2.将id传给request请求
    this.getGoodsDetail(goods_id)
  },
  async getGoodsDetail(goods_id) { //根据id请求详情数据
    // 3.根据id得到对应请求结果
    const goodsobj = await request({ url: "/goods/detail", data: { goods_id } })
    // 保存商品对象
    this.GoodsInfo = goodsobj.data.message;
    // 判断缓存中的商品收藏的数组
    let collect = wx.getStorageSync("collect") || [];
    // 判断当前商品是否收藏
    let isCollect = collect.some(v => v.goods_id === this.GoodsInfo.goods_id)
    // console.log(...collect);
    // console.log(this.GoodsInfo);
    // console.log(isCollect);
    this.setData({ // 4.赋值
      goodsobj: { // 5.只抽取需要展示的数据
        name: goodsobj.data.message.goods_name,
        price: goodsobj.data.message.goods_price,
        // iphone部分手机 不识别 webp图片格式 使用正则做简单适配
        introduce: goodsobj.data.message.goods_introduce.replace(/\.webp/g, '.jpg'),
        pics: goodsobj.data.message.pics,
      },
      isCollect
    })
  },
  imageclick(e) { // 6.轮播点击显示大图
    // 8 先构造要预览的图片数组 
    const urls = this.GoodsInfo.data.message.pics.map(v => v.pics_mid);
    // 9 接收传递过来的图片url
    const current = e.currentTarget.dataset.url;
    // 10.使用内置api
    wx.previewImage({
      current,
      urls
    });
  },
  clickaddcart() { // 11.点击添加购物车
    // 1 获取缓存中的购物车 数组
    let cart = wx.getStorageSync("cart") || [];
    // console.log(cart);
    // console.log(this.GoodsInfo);
    // 2 判断 商品对象是否存在于购物车数组中
    // findIndex方法返回遍历元素中符合条件的元素索引位置
    let index = cart.findIndex(value => value.goods_id === this.GoodsInfo.goods_id);
    // console.log(this.GoodsInfo);
    if (index === -1) {
      //3  不存在 第一次添加
      this.GoodsInfo.num = 1; //将商品数量初始化为1
      this.GoodsInfo.checked = true; //将商品的选中状态为true
      cart.push(this.GoodsInfo); //在缓存数组中加入该商品对象
    } else {
      // 4 已经存在购物车数据 执行 num++ 数量加一
      cart[index].num++;
    }
    // 5 把购物车数组重新添加回缓存中
    wx.setStorageSync("cart", cart);
    // 6 弹窗提示
    wx.showToast({ // 内置api
      title: '加入成功',
      icon: 'success',
      // true 防止用户 手抖 疯狂点击按钮  1.5s之后才能再次添加
      mask: true
    });
  },
  handleCollect() { //点击收藏该商品
    let isCollect = '';
    // 获取缓存中的商品收藏数组
    let collect = wx.getStorageSync("collect") || [];
    // 判断该商品是否被收藏过
    let index = collect.findIndex(v => v.goods_id === this.GoodsInfo.goods_id)
    // 当index!=-1表示已经收藏过
    if (index != -1) {
      // 收藏过，就在数组中删除该商品
      collect.splice(index, 1)
      isCollect = false;

      wx.showToast({
        title: '取消成功',
        icon: 'success',
        mask: true,
      });
    } else {
      // 没有收藏过
      collect.push(this.GoodsInfo)
      // console.log(...collect);
      isCollect = true
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true,
      });
    }
    // 把数组存入缓存
    wx.setStorageSync("collect", collect);
    // let num1 = wx.getStorageSync("collect");
    // console.log(...num1);
    // 修改data里的状态
    this.setData({
      isCollect
    })
  }
})