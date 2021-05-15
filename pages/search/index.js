// pages/search/index.js
import { request } from '../../request/request.js'
import regeneratorRuntime from '../../lib/runtime/runtime'
Page({
  data: {
    goods: [],
    isFocus: false,// 取消按钮的状态
    inputvalue: "",
  },
  Time: null, //输入框防抖定时器
  handleInput(e) { //在input输入时触发
    // 获取输入框的值
    const { value } = e.detail
    // 检测值的合法性.trim方法删除字符串两边的空格字符
    if (!value.trim()) {
      // 当输入框没有值,或值不符合要求时,清空数组,隐藏按钮
      clearTimeout(this.Time); //定时器异步回调,清除数组之后会执行最后一个回调请求数据
      this.setData({
        goods: [],
        isFocus: false
      })
      // 不符合规则
      return;
    }
    this.setData({
      isFocus: true
    })
    // 在input中每输入一个字符都会先清除上一个定时器,全部输入完了再一秒后发送请求
    clearTimeout(this.Time);
    this.Time = setTimeout(() => {
      // 发送请求
      this.qsearch(value)
    }, 1000)
  },
  async qsearch(query) { //请求后台数据
    const res = await request({ url: "/goods/qsearch", data: { query } })
    // 提取信息
    const goods = res.data.message
    this.setData({ //赋值
      goods
    })
  },
  handleCancel() { //取消按钮的点击
    this.setData({
      inputvalue: "",
      isFocus: false,
      goods: []
    })

  }
})