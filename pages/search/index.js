// pages/search/index.js
//搜索防抖 定义一个全局定时器
import { request } from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
      goods:[],
      //取消按钮是否显示
      isFocus:false,
      //输入框的值
      inpValue:""
  },
  TimeId:-1,
  handleCancel(){
    //点击取消按钮事件
    this.setData({
      inpValue:"",
      isFocus:false,
      goods:[]
    })
  },
  handleInput(e){
    const {value}=e.detail;
    if(!value.trim()){
      this.setData({
        goods:[],
        isFocus:false
      })
      return;
    }
    //准备发请求
    this.setData({
      isFocus:true
    })
    clearTimeout(this.TimeId);
    this.TimeId=setTimeout(() => {
      this.qsearch(value);
    }, 1000);
  },
  //发送请求的函数
  async qsearch(query){
    const res=await request({url:"/goods/qsearch",data:{query}});
    console.log(res.data);
    this.setData({
      goods:res.data.message
    })
  }
})