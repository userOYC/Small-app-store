import { request } from '../../request/request.js'
import regeneratorRuntime from '../../lib/runtime/runtime'
Page({
  data: {
    leftlist: [], //左侧侧边栏数据
    rightlist: [],//右侧分类数据
    currentIndex: 0, //当前侧边栏的索引
    scrolltop: 0 //右侧内容滚动距离顶部的距离
  },
  categorys: [], //请求接口返回的总数据
  onLoad: function (options) {
    // 本地存储
    const categorys = wx.getStorageSync("category");
    if (!categorys) {  //本地存储没有数据  发送请求
      this.getcategory()
    } else { //有旧数据
      // 如果时间戳距离上次发送请求的时候大于了设定的事件，则重新请求数据
      if (Date.now() - categorys.time > 1000 * 15) {
        this.getcategory()
        // console.log('请求新数据');
      } else { //使用旧数据
        // console.log('使用旧数据');
        // 将本地存储里存入的Data赋值给全局变量categorys
        this.categorys = categorys.Data;
        let leftlist = this.categorys.map(value => value.cat_name)
        let rightlist = this.categorys[0].children
        this.setData({ //赋值
          leftlist,
          rightlist
        })
      }
    }
  },
  async getcategory() { //请求分类数据

    /* 使用ES6 Promise */
    // request({ url: '/categories' })
    //   .then(result => {
    //     // 不能直接用this.data.categorys = ...赋值，在使用标签循环的时候拿不到数据...具体原因待研究
    //     this.categorys = result.data.message; //总数据
    //     // 把接口的数据存入本地储存，存入两个数据，一个key值，一个对象，对象中保存tiem:存入时的时间戳和Data:存入的数据
    //     wx.setStorageSync("category", { time: Date.now(), Data: this.categorys });
    //     // 获取需要展示的数据
    //     let leftlist = this.categorys.map(value => value.cat_name)
    //     let rightlist = this.categorys[0].children
    //     this.setData({ //赋值
    //       leftlist,
    //       rightlist
    //     })
    //   })

    /* 使用ES7 async + await */
    const result = await request({ url: '/categories' }) //分类页面接口
    this.categorys = result.data.message; //总数据
    // 把接口的数据存入本地储存，存入两个数据，一个key值，一个对象，对象中保存tiem:存入时的时间戳和Data:存入的数据
    wx.setStorageSync("category", { time: Date.now(), Data: this.categorys });
    // 获取需要展示的数据
    let leftlist = this.categorys.map(value => value.cat_name)
    let rightlist = this.categorys[0].children
    this.setData({ //赋值
      leftlist,
      rightlist
    })
  },
  leftitemclick(e) { //侧边栏点击事件
    // 获得传来的index
    const index = e.currentTarget.dataset.index
    // 根据点击的index来获取对应展示的内容
    let rightlist = this.categorys[index].children
    this.setData({ //赋值
      currentIndex: index,
      rightlist,
      // 对滚动条距离顶部的距离重新赋值
      scrolltop: 0
    })
  }
})