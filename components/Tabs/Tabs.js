// components/Tabs/Tabs.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabs: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    clickitemtap(e) { //导航栏点击事件
      const index = e.currentTarget.dataset.index
      // 将自定义事件发给父组件
      this.triggerEvent("tabsitemclick", index)
    }
  }
})
