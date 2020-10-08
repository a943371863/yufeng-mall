// pages/auth/index.js
Page({
  //获取用户信息
  handleGetUserInfo(e){
    const{ encryptedData, rawData, iv, signature} = e.detail;
    //2获取小程序登录成功后的code
    wx.login({
      timeout:10000,
      success:(result) =>{
        console.log(result);
      }
    })
  }
})