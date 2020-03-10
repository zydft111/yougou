// pages/cart/index.js
import request from "../../utils/request.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    goods: [],
    allPrice: 0,
    allSelect:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      address:wx.getStorageSync('address')||[]
    })
    // console.log(this.data.adress)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      goods:wx.getStorageSync('goods')||[]
    })
    this.handleAllPrice()
    console.log(this.data.goods, this.data.allPrice)

  },
  handleGetAddress(){
    wx.chooseAddress({
      success:(res)=>{
        console.log(res)
        this.setData({
          address:{
            name:res.userName,
            tel:res.telNumber,
            detail:res.provinceName+res.cityName+res.countyName+res.detailInfo
          }
        })
      }
    })
    console.log(this.data.address)
    wx.setStorageSync('address', this.data.address)
  },
  handleCalc(e){
    const { index, number } = e.currentTarget.dataset;
    this.data.goods[index].number+=number;
    if (this.data.goods[index].number === 0){
      wx.showModal({
        title: '提示',
        content: '是否删除该商品',
        success:(res)=>{
          if(res.confirm){
            this.data.goods.splice(index, 1)
          }else{
            this.data.goods[index].number += 1;
          }
          this.setData({
            goods: this.data.goods
          })
        }
      })
    }
    this.setData({
      goods:this.data.goods
    }) 
    this.handleAllPrice();
    wx.setStorageSync('goods',this.data.goods )
  },
  handleAllPrice(){
    let allPrice = 0;
    this.data.goods.forEach(v=>{
      if(v.select){
        allPrice+=v.goods_price*v.number;
      }
    })
    this.setData({
      allPrice: allPrice
    })
  },
handleSelect(e){
  const {index} = e.currentTarget.dataset;
  console.log(index)
  let select = this.data.goods[index].select;
  this.data.goods[index].select = !select;
  let allSelect = this.data.goods.some(v => {
    return !v.select
  })
  this.setData({
    goods:this.data.goods,
    allSelect:!allSelect
  })
  this.handleAllPrice();
},
  handleTabAllSelect(){
    let {allSelect} = this.data;
    this.data.goods.forEach(v=>{
      v.select=!allSelect
    })
    this.setData({
      goods:this.data.goods,
      allSelect:!allSelect
    })
    this.handleAllPrice()
  },
  handlePay() {

    // 先判断本地有没token
    const token = wx.getStorageSync("token");

    // 如果没有token
    if (!token) {
      // 跳转到授权页
      wx.navigateTo({
        url: '/pages/authorize/index',
      })
    } else {
      // 如果有token
      let { allPrice, address, goods } = this.data;

      // 返回一个接口需要的商品数组
      goods = goods.map(v => {
        return {
          goods_id: v.goods_id,
          goods_number: v.number,
          goods_price: v.goods_price
        }
      })

      // 1.创建订单
      request({
        url: "/my/orders/create",
        method: "POST",
        header: {
          Authorization: token
        },
        data: {
          // 创建订单需要的参数
          order_price: allPrice,
          consignee_addr: address.name + address.tel + address.detail,
          goods
        }
      }).then(res => {
        // 订单创建成功的提示
        wx.showToast({
          title: '订单创建成功',
          type: "success"
        })

        // 2.发起支付,请求支付参数
        request({
          url: "/my/orders/req_unifiedorder",
          method: "POST",
          header: {
            Authorization: token
          },
          data: {
            // 订单编号
            order_number: res.data.message.order_number
          }
        }).then(res => {
          // 支付需要的参数
          const { pay } = res.data.message;

          // 3.发起微信支付
          wx.requestPayment(pay)
        })

      })


    }



  }

})