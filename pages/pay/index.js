// pages/cart/index.js
import {getSetting,chooseAddress,openSetting,showModal,showToast}from"../../utils/asyncWx.js"

Page({

  data: {
    address:{},
    cart:[],
    totalPrice:0,
    totalNum:0
  },
  //点击收货地址
  onShow(){
       const address=wx.getStorageSync("address");
       let cart=wx.getStorageSync("cart")||[];
       //过滤后的购物车数组
      cart=cart.filter(v=>v.checked);
       this.setData({address});
          //总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v =>{
      totalPrice += v.num * v.goods_price;
      totalNum += v.num;
    })
    //判断数组是否为空
    this.setData({
      cart,
      totalPrice,totalNum,
      address
    });
  },
  handleOrderPay(){
    //1判断缓存中有没有token
    const token=wx.getStorageSync(token);
    if(!token){
      wx.navigateTo({
        url:'/pages/auth/index'
      });
      return;
    }
    console.log("已经存在token");
  }
});
