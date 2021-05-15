/**
 *  promise 形式  弹窗提醒
 * @param {object} param0 参数
 */
export const showToast = ({ title }) => {
  return new Promise((resolve, reject) => {
    wx.showToast({
      title: title,
      icon: 'none',
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      }
    })
  })
}

/* promise 形式  login */
export const login = () => {
  return new Promise((resolve, reject) => {
    wx.login({
      timeout: 10000,
      success: (result) => {
        resolve(result)
      },
      fail: (err) => {
        console.log(err);
      },
    });
  })
}

/**
 *  promise 形式  小程序微信支付
 * @param {object} pay 支付所需要的参数
 */
export const requestPayment = (pay) => {
  return new Promise((resolve, reject) => {
    wx.requestPayment({
      ...pay,
      success: (result) => {
      },
      fail: (err) => {
        showToast({ title: "支付失败 错误的用户信息" })
      },
    });
  })
}
