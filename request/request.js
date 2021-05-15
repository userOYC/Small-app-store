let ajaxTimes = 0; // 页面发送异步请求的次数
export function request(params) {
  // 判断url中是否带有/my/ 表示请求的是私有的路径,自动获取header和token
  let header = { ...params.header };
  if (params.url.includes("/my/")) {
    // 拼接header和token
    header["Authorization"] = wx.getStorageSync("token");
  }
  ajaxTimes++;
  wx.showLoading({
    title: "加载中...",
    mask: true,
  });

  const baseURL = 'https://api-hmugo-web.itheima.net/api/public/v1'
  return new Promise((resolve, reject) => {
    // 定义公共接口路径
    wx.request({
      // 对请求的数据解构
      ...params,
      header: header,
      url: baseURL + params.url,
      success: (result) => {
        resolve(result)
        // console.log(params);
      },
      fail: (err) => {
        reject(err)
      },
      complete: () => {
        ajaxTimes--; //异步请求全部加载完之后
        if (ajaxTimes === 0) {
          //  关闭正在等待的图标
          wx.hideLoading();
        }
      }
    })
  })
}