//Page Object
// 引入发送请求方法
import{ request}from "../../request/index.js"
Page({
  data: {
    //轮播图数组
    swiperList:[

    ],
    //导航栏数组
    catesList:[],
    //楼层数组
    floorList:[]

  },
  //options(Object)页面开始加载的生命周期事件
  onLoad: function(options) {
    //1发送异步请求获取轮播图数据  优化的手段可以通过promise
    // wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   success: (result) => {
    //     this.setData({
    //       swiperList:result.data.message
    //     })
    //   }
    // });
      
      this.getSwiperList();
      this.getCateList();
      this.getFloorList();
       
  },
  getSwiperList(){
    request({url:"/home/swiperdata"})
    .then(result =>{
        this.setData({
                swiperList:result.data.message
              })
      })
  },
  //获取分类导航数据
  getCateList(){
    request({url:"/home/catitems"})
    .then(result =>{
      
        this.setData({
                catesList:result.data.message
              })
              
      })
  },
  
  //获取楼层数据
  getFloorList(){
    request({url:"/home/floordata"})
    .then(result =>{
        this.setData({
                floorList:result.data.message
              })
              
      })
      let {floorList}=this.data.floorList;
      console.log(floorList);
    },
    
});

  