// pages/auth/index.js
import { request } from '../../request/request.js'
import regeneratorRuntime from '../../lib/runtime/runtime'
import { login } from "../../utils/asyncWx.js";

Page({
  async handleGetUserInfo(e) { //点击获取授权
    try {
      // 1.获取用户信息
      const { encryptedData, rawData, iv, signature } = e.detail
      // 2.获取小程序登录成功后的token
      const { code } = await login();
      const loginParams = { encryptedData, rawData, iv, signature }
      // 3.发送请求，获取用户token值
      let { token } = await request({ url: "/users/wxlogin", data: loginParams, methdo: "post" })
      // 因不是企业id,拿不到用户的token,自定义一个token暂用
      token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo"
      wx.setStorageSync("token", token); //将自定义token存入缓存中
      wx.navigateBack({ //获取token之后回到上一页
        delta: 1
      });
    } catch (error) { //异常捕获
      console.log(error);
    }
  }
})
