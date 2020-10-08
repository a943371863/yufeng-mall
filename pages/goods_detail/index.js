// pages/goos_detail/index.js

import { request } from "../../request/index.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj:{},
    isCollect:false,
  },
  //商品对象
  GoodsInfo:{},
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
      let pages= getCurrentPages();
      let currentPages=pages[pages.length-1];
      let options = currentPages.options;
      const{goods_id}=options;
      this.getGoodsDetail(goods_id)

      
  },
  //获取商品的详情数据
  async getGoodsDetail(goods_id){
    const goodsObj= await request ({url:"/goods/detail",data:{goods_id}});
    // console.log(goodsObj);
    this.GoodsInfo=goodsObj.data.message;
        //1 获取缓存中的商品收藏数组
        let collect = wx.getStorageSync("collect")||[];
        //2 判断当前商品是否被收藏
        let isCollect = collect.some(v => v.goods_id === this.GoodsInfo.goods_id);
    this.setData({
      goodsObj:{
        goods_name:goodsObj.data.message.goods_name,
        goods_price:goodsObj.data.message.goods_price,
        //iphone部分手机不识别

        goods_introduce:goodsObj.data.message.goods_introduce.replace(/\.webp/g,'.jpg'),
        pics:goodsObj.data.message.pics
      },
      isCollect
    })
  },
  /* //点击轮播图放大预览
    调用小程序API previewImage */
    handlePrevewImage(e){
      //1先要构造要预览的图片数组
      const urls=this.GoodsInfo.pics.map(v=>v.pics_mid)
      //2接受传递过来的点击图片的参数
      const current=e.currentTarget.dataset.url;
      wx.previewImage({
        current,
        urls,
        
      });
        
    },
    //点击加入购物车
    handleCartAdd(){
      //1.获取缓存中的购物车数据
      let cart=wx.getStorageSync("cart")||[];
      //2 判断 商品对象是否存在与购物车数组中
      let index=cart.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
      if(index===-1){
        //不存在 第一次添加
        this.GoodsInfo.num=1;
        this.GoodsInfo.checked=true;
        cart.push(this.GoodsInfo);
      }else{
        //已经存在购物车数据，执行num++
        cart[index].num++;
      }
      //5把购物车重新添加回缓存
      wx.setStorageSync("cart",cart);
      wx.showToast({
        title:'加入成功',
        icon:'success',
        mask:true
      })
    },
    //点击商品收藏图标
    handleCollect(){
      let isCollect=false;
      //1获取缓存中的商品收藏数组
      let collect=wx.getStorageSync("collect")||[];
      //判断该商品是否被收藏过
      let index=collect.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
      if(index!==-1){
        //能找到 已经收藏过 删除
        collect.splice(index,1);
        isCollect=false;
        wx.showToast({
          title: '取消成功',
          icon: 'success',
          mask: true,
        });
          
      }else{
        collect.push(this.GoodsInfo)
        isCollect=true;
        wx.showToast({
          title: '收藏成功',
          icon: 'success',
          mask: true,
        });
      }
      //把数组存入缓存
      wx.setStorageSync("collect",collect);
      //修改data中的属性
      this.setData({isCollect})
    }
})