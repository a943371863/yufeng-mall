// pages/goods_list/index.js
/* 
1用户上滑页面 滚动条触底 开始加载下一页
  1找到滚动条触底事件
  2判断有没有下一页数据
    1获取到总页数
    总页数= Math.ceil（总页数/页容量）
    2获取当前页码
  3假如没有下一页数据 弹出一个提示框
  4假如有下一页，加载下一页
    当前页码 ++
    重新发送请求
*/

import { request } from "../../request/index.js"
Page({
  data: {
    tabs: [
      {
        id: 0,
        value: "综合",
        isActive: true
      },
      {
        id: 1,
        value: "销量",
        isActive: false
      },
      {
        id: 2,
        value: "价格",
        isActive: false
      }
    ],
    goodsList: [],
    totalPages:1
  },
  QueryParams: {
    query: "",
    cid: "",
    pagenum: 1,
    pagesize: 10,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid = options.cid||"";
    this.QueryParams.query = options.query||"";
    this.getGoodsList();
    
  },
  //获取商品列表数据
  async getGoodsList() {
    const res = await request({ url: "/goods/search", data: this.QueryParams });
    // console.log(res.data.message);
    /* 获取总条数 */
    const total=res.data.message.total;
    // 计算总页数
    this.totalPages=Math.ceil(total/this.QueryParams.pagesize);
    console.log(this.totalPages);
    this.setData({
      // goodsList: res.data.message.goods
      goodsList:[...this.data.goodsList,...res.data.message.goods]
    })
  },
  //标题点击事件 从子组件传递过来的
  handleTabsItemChange(e) {
    //获取被点击的标题索引
    const { index } = e.detail;
    //修改源数组
    let { tabs } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    //赋值到data中
    this.setData({
      tabs
    })
  },
  onReachBottom(){
    if(this.QueryParams.pagenum>=this.totalPages){
      wx:wx.showToast({
        title: '没有下一页数据',
       
      });
        
    }else{
      //有下一页数据
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  }
}) 