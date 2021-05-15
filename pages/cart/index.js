// pages/cart/index.js
// import { showToast } from "../../utils/asyncWx.js";
// import regeneratorRuntime from '../../lib/runtime/runtime';

Page({
  data: {
    address: {},  //缓存中的地址信息
    cart: [],  // 缓存中的商品信息
    allchecked: false,  //全选按钮的默认状态
    totalprice: '',  //总价格
    totalnumber: '',  //总数量
  },
  onShow: function () { //页面显示回调生命周期
    // 1.获取缓存中的地址信息
    let address = wx.getStorageSync("address");
    // 获取缓存中的购物车商品信息,缓存中没有数据则获取空数组
    let cart = wx.getStorageSync("cart") || [];
    // 获取全选按钮的状态，只有当cart里面有数据时，才遍历状态，没商品数据返回false
    // let allchecked = cart.length ? cart.every(value => value.checked) : false
    // 1.获取数组，2.遍历数组，3.找到所有checked状态为true1的商品，返回数量*价格
    this.setData({ address })
    // 调用封装函数
    this.setcart(cart);
  },
  clickbutton() { //点击获取收获地址
    //最新的微信小程序开发此时会一直为true，不需要再进行判断用户点击了取消还是确定
    wx.chooseAddress({
      success: (result) => {
        // 获取用户地址信息
        let address = result;
        // 拼接完成地址信息
        address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
        // 将地址信息加入本地缓存中
        wx.setStorageSync("address", address);
      },
    });
  },
  itemcheckboxclick(e) { //商品勾选状态的点击
    // 获取点击传来的id
    let goods_id = e.currentTarget.dataset.id;
    // 获取购物车数组
    let cart = this.data.cart;
    // 根据id通过遍历找到被修改的商品对象
    let index = cart.findIndex(value => value.goods_id === goods_id)
    // 商品checked状态取反
    cart[index].checked = !cart[index].checked;
    // 调用封装函数
    this.setcart(cart)
  },
  allcheckboxclick() { //全选按钮的点击
    // 获取商品及其状态(ES6解构赋值)
    let { cart, allchecked } = this.data;
    // 状态取反
    allchecked = !allchecked;
    // 修改源cart数组
    cart.forEach(value => value.checked = allchecked)
    // 调用封装函数
    this.setcart(cart)
  },
  buttonclick(e) { //商品数量编辑
    // 获取商品id和运算状态
    let { id, operation } = e.currentTarget.dataset;
    // 获取购物车数组
    let cart = this.data.cart
    // 根据id获取商品对象所在索引
    let index = cart.findIndex(value => value.goods_id === id)
    // console.log(index);
    // 判断用户是否想要删除该商品信息
    if (cart[index].num === 1 && operation === -1) {
      wx.showModal({
        title: '提示',
        content: '您是否要从购物车中移除该商品?',
        success: (result) => {
          if (result.confirm) { //点击确定回调该函数
            cart.splice(index, 1); // 删除该商品,删除数量为1
            this.setcart(cart) //重新赋值
          }
        }
      })
    } else {
      // 修改数量
      cart[index].num += operation;
      // 调用封装函数
      this.setcart(cart)
    }
  },
  setcart(cart) { //封装函数，减少代码重复，更新cart数据。该函数接收一个cart商品对象
    let allchecked = true;
    let totalprice = 0;
    let totalnumber = 0;
    cart.forEach( //对商品数组进行遍历
      value => {
        if (value.checked) { //当状态为true，计算总数量和价格
          totalprice += value.num * value.goods_price;
          totalnumber += value.num
        } else { //cart数组为空时不会执行
          allchecked = false
        }
      })
    // 判断cart数组，修改全选状态
    allchecked = cart.length != 0 ? allchecked : false;
    this.setData({
      cart,
      totalprice,
      totalnumber,
      allchecked
    })
    wx.setStorageSync("cart", cart);
  },
  clicktopay() { //结算支付
    const { address, totalnumber } = this.data;
    if (address.userName && totalnumber != 0) { //有地址有商品才跳转支付
      wx.navigateTo({
        url: '/pages/pay/index'
      });
    } else if (!address.userName) { //地址为空
      wx.showToast({
        title: "您还没有选择收货地址",
        icon: 'none',
      });
    } else if (totalnumber === 0) { //数量为空
      wx.showToast({
        title: "您还没有选购商品",
        icon: 'none',
      });
    }
  }
})