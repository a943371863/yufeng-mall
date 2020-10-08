// pages/order/index.js
import {request} from "../../request/index";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders:[],
    tabs: [
      {
        id: 0,
        value: "全部",
        isActive: true
      },
      {
        id: 1,
        value: "待付款",
        isActive: false
      },
      {
        id: 2,
        value: "代发货",
        isActive: false
      },
      {
        id: 3,
        value: "退款/退货",
        isActive: false
      }
    ],
  },
  onShow(options){
    wx.setStorageSync('token','Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo')
    const token=wx.getStorageSync("token")
    if(!token){
      wx.navigateTo({
        url: '/pages/auth/index',
      });
        
    }

    let pages = getCurrentPages();
    let currentPage=pages[pages.length-1]
    const {type}=currentPage.options
    //激活选择页面标题
    this.handleTabsItemChange(type-1);
    this.getOrders(type);
  },
  //获取订单列表方法
  async getOrders(type){
    const res=await request({url:"/my/orders/all",data:{type}});
    this.setData({
      orders:res.orders
    })
  },
  changeTitleByIndex(index){
    let { tabs } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    //赋值到data中
    this.setData({
      tabs
    })
  },
  handleTabsItemChange(e) {
    //获取被点击的标题索引
    const { index } = e.detail;
    this.changeTitleByIndex(index);
  }
})