import { request } from "../../request/index.js"
// pages/category/index.js
Page({
  data: {
    //左边的菜单数据
    leftMenuList: [],
    //右边的商品数据
    rightContent: [],
    //被点击的左侧菜单
    currentIndex: 0,
    //右侧内容的滚动条距离顶部的距离
    scrollTop: 0
  },
  //接口的返回数据
  Cates: [],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 0 web中的本地存储与小程序不一致
    // 1.web：localStorage.setItem("key","value")获取 localStorage.getItem("key")
    // 小程序:wx:setStorageSync("key","value");获取 wx.getStorageSync("key")
    // 2.存的时候没有做类型转换
    // web：不管存入什么类型数据，最终都会先调用一下 toString()，把数据变成了字符串 在存入
    // 小程序：不存在类型转换，存什么获取什么
    // 1 先判断一下本地存储有没有旧数据
    // 2 没有旧数据 直接发视新请求
    // 3 有旧数据 同时 旧数据没有过期就使用
    //获取本地存储数据
    const Cates = wx.getStorageSync("cates");
    if (!Cates) {
      //不存在发送请求获取数据
      this.getCates();
    } else {
      //有旧的数据 定义过期时间 
      if (Date.now() - Cates.time > 1000 * 10) {
        //重新发送请求
        this.getCates();
      } else {
        //可以使用旧的数据
        // console.log("可以使用旧数据");
        this.Cates = Cates.data;
        let leftMenuList = this.Cates.map(v => v.cat_name);
        //构造右侧的商品数据
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })

      }
    }
  },
  //获取分类数据
  async getCates() {
    //  request({
    //    url:"/categories"
    //  })
    //  .then(res=>{
    //     this.Cates=res.data.message;
    //     //把接口的数据存入本地存储中
    //     wx.setStorageSync("cates", {time:Date.now(),data:this.Cates});

    //     //构造左侧的菜单数据
    //     let leftMenuList=this.Cates.map(v=>v.cat_name);
    //     //构造右侧的商品数据
    //     let rightContent=this.Cates[0].children;
    //     this.setData({
    //       leftMenuList,
    //       rightContent
    //     })
    //   })
    //1.使用es7的async await来发送请求
    const res = await request({ url: "/categories" });
    this.Cates = res.data.message;
    //  把接口的数据存入本地存储中
    wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });

    //构造左侧的菜单数据
    let leftMenuList = this.Cates.map(v => v.cat_name);
    //构造右侧的商品数据
    let rightContent = this.Cates[0].children;
    this.setData({
      leftMenuList,
      rightContent
    })
  },
  //左侧菜单的点击事件
  handleItemTap(e) {
    // 1 获取被点击的标题身上的索引
    // 2 给data中的currentIndex
    // 3 根据不同的索引来渲染右侧商品内容
    const { index } = e.currentTarget.dataset;
    let rightContent = this.Cates[index].children;
    this.setData({
      currentIndex: index,
      rightContent,
      //重新设置右侧内容scroll-top
      scrollTop: 0
    })

  }
})