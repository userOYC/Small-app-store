// pages/feedback/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: '体验问题',
        isActive: true
      },
      {
        id: 1,
        value: '商家投诉',
        isActive: false
      },
    ],
    chooseImgs: [],// 被选中的img
    textVal: "" //文本域内容
  },
  // 外网的图片的路径数组
  UpLoadImgs: [],
  onLoad: function (options) {

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
  handleChooseImg() { //上传图片
    // 2 调用小程序内置的选择图片api
    wx.chooseImage({
      // 同时选中的图片的数量
      count: 9,
      // 图片的格式  原图  压缩
      sizeType: ['original', 'compressed'],
      // 图片的来源  相册  照相机
      sourceType: ['album', 'camera'],
      success: (result) => {

        this.setData({
          // 图片数组 进行拼接 
          chooseImgs: [...this.data.chooseImgs, ...result.tempFilePaths]
        })
      }
    });

  },
  handleRemoveImg(e) { //删除图片
    // 2 获取被点击的组件的索引
    const { index } = e.currentTarget.dataset;
    // 3 获取data中的图片数组
    let { chooseImgs } = this.data;
    // 4 删除元素
    chooseImgs.splice(index, 1);
    this.setData({
      chooseImgs
    })
  },
  handleTextInput(e) { //文本域的输入
    this.setData({
      textVal: e.detail.value
    })
  },
  handleFormSubmit() { //提交按钮的点击
    // 1 获取文本域的内容 图片数组
    const { textVal, chooseImgs } = this.data;
    // 2 合法性的验证
    if (!textVal.trim()) {
      // 不合法
      wx.showToast({
        title: '输入不合法',
        icon: 'none',
        mask: true
      });
      return;
    } else {
      wx.showToast({
        title: '提交成功',
        icon: 'success',
        mask: true
      });
      this.setData({
        textVal: ''
      })
    }
  }
})