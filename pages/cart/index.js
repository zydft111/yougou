// pages/cart/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    goods: [],
    allPrice: 0
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
    console.log(this.data.goods)

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
  }
})