// pages/cart/index.js
import {getSetting,chooseAddress,openSetting,showModal,showToast}from"../../utils/asyncWx.js"

Page({

  data: {
    address:{},
    cart:[],
    allChecked:false,
    totalPrice:0,
    totalNum:0
  },
  //点击收货地址
  onShow(){
       const address=wx.getStorageSync("address");
       const cart=wx.getStorageSync("cart")||[];
       this.setData({address});
       this.setCart(cart);
  },
  // 点击 收货地址
  async handleChooseAddress() {
    try {
      // 1 获取 权限状态
      const res1 = await getSetting();
      const scopeAddress = res1.authSetting["scope.address"];
      // 2 判断 权限状态
      if (scopeAddress === false) {
        await openSetting();
      }
      // 4 调用获取收货地址的 api
      let address = await chooseAddress();
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;

      // 5 存入到缓存中
      wx.setStorageSync("address", address);
         
 }
 catch (error) {
  console.log(error);
}
},
//商品选中
handeItemChange(e){
  //获取被修改的商品的ID
  const goods_id=e.currentTarget.dataset.id;
  //2获取购物车数组
  let{cart}=this.data;
  //3找到被修改的商品对象
  let index=cart.findIndex(v=>v.goods_id===goods_id);
  //4选中状态取反
  cart[index].checked=!cart[index].checked;
  this.setCart(cart);
},
//设置购物车状态同时重新计算底部工具栏的数据
  setCart(cart){
    let allChecked=true;
    //总价格 总数量
    let totalPrice=0;
    let totalNum=0;
    cart.forEach(v=>{
      if(v.checked){
        totalPrice += v.num*v.goods_price;
        totalNum += v.num;
      }else{
       allChecked=false;
      }
    })
    //判断数组是否为空
    allChecked = cart.length !=0 ? allChecked:false;
    this.setData({
      cart,
      totalPrice,
      totalNum,
      allChecked
    });
    wx.setStorageSync("cart",cart);
  },
  //商品全选
  handleItemAllCheck(){
    //获取data中数据
    let {cart,allChecked}=this.data;
    //修改值
    allChecked=!allChecked;
    //循环修改cart数组中的商品选中状态
    cart.forEach(v=>v.checked=allChecked);
    //把修改后的值 填充回data或者缓存中
    this.setCart(cart);
  },
  //商品数量编辑功能
 async handleItemNumEdit(e){
    const {operation,id}=e.currentTarget.dataset;
  //获取购物车数组
    let {cart}=this.data;
    //找到需要修改的商品的索引
    const index=cart.findIndex(v=>v.goods_id===id);
    //判断是否要执行删除
    if(cart[index].num===1&&operation===-1){
      const res=await showModal({content:"您是否要删除"})
      if (res.confirm) {
        cart.splice(index,1);
        this.setCart(cart);
      }
    }else {
      //进行修改数量
      cart[index].num+=operation;
      //设置回缓存和data
      this.setCart(cart);
    }
   
  },
  //点击结算功能
 async handlePay(){
   const{address,totalNum}=this.data;
   if(!address.userName){
     await showToast({title:"您还没有选择收货地址"});
     return
   }
   if(totalNum===0){
     await showToast({title:"您还没有选购商品"});
     return;
   }
   wx.navigateTo({
     url: '/pages/pay/index',
     
   });
     
 }
});
