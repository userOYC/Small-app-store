import { request } from '../../request/request.js'
import regeneratorRuntime from '../../lib/runtime/runtime'
import { showToast, requestPayment } from "../../utils/asyncWx.js";

Page({
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalnumber: 0
  },
  onShow() { //页面一显示就获取相关购物车信息
    // 1 获取缓存中的收货地址信息
    const address = wx.getStorageSync("address");
    // 1 获取缓存中的购物车数据
    let cart = wx.getStorageSync("cart") || [];
    // 过滤后的购物车数组
    cart = cart.filter(v => v.checked);
    this.setData({ address });

    // 1 总价格 总数量
    let totalPrice = 0;
    let totalnumber = 0;
    cart.forEach(v => {
      totalPrice += v.num * v.goods_price;
      totalnumber += v.num;
    })
    this.setData({
      cart,
      totalPrice, totalnumber,
      address
    });
  },
  async topay() { //点击支付
    try {
      // 1.判断缓存中有没有token
      const token = wx.getStorageSync("token");
      // 2.判断
      if (!token) {
        wx.navigateTo({
          url: '/pages/auth/index',
        });
        return;
      }
      // 3.创建订单 ,需要准备请求头,请求体,地址信息,和商品对应id,数量,价格
      // const header = { Authorization: token }; //请求头,值是token ,在requset已封装好请求头和token
      // 请求体
      const order_price = this.data.totalPrice;  //总价格
      const consignee_addr = this.data.address.all; //地址
      const cart = this.data.cart; //商品数组
      let goods = [];
      cart.forEach(value => goods.push({
        goods_id: value.goods_id,
        goods_number: value.num,
        goods_price: value.goods_price
      }))
      // data数据汇总
      const orderParams = { order_price, consignee_addr, goods }
      // 4.发送请求,创建订单,获取订单编号
      const result = await request({ url: "/my/orders/create", method: "POST", data: orderParams })
      // 取出支付订单编号
      const { order_number } = result.data.message
      // 5.发起预支付接口
      const prepayment = await request({ url: "/my/orders/req_unifiedorder", method: "POST", data: { order_number } })
      // 取出支付需要的参数
      let pay = prepayment.data.message.pay;
      // 6.发起微信支付,因个人账号无法实际获取用户token,所以支付和查询订单状态不可用
      // await requestPayment(pay);
      // 7.查询后台订单状态
      // const res = await request({ url: "/my/orders/chkOrder", method: "POST", data: { order_number }, header })
      // await showToast({ title: "支付成功" })
      let newcart = wx.getStorageSync("cart");
      // 8.点击支付之后筛选不被选择的商品,覆盖缓存中的原数据
      newcart = newcart.filter(value => !value.checked)
      wx.setStorageSync("cart", newcart);
      wx.redirectTo({ //跳转并关闭当前页面
        url: '/pages/order/index',
        success: () => {
          showToast({ title: "支付成功" })
        }
      });
    } catch (error) {
      // await showToast({ title: "支付失败" }); //打印错误信息
    }
  }
})