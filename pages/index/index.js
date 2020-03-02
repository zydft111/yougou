// pages/index/index.js
import request from "../../utils/request.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner: [],
    menu: [],
    floors: [],
    isShowTop: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    // 请求轮播图
    request({
      url: '/home/swiperdata'
    }).then(res => {
      const { message } = res.data;
      this.setData({
        banners: message
      })
    }),
      // 请求导航部分
      request({
        url: '/home/catitems',
      }).then(res => {
        const { message } = res.data;
        const newData = message.map((value, index) => {
          if (index === 0) {
            value.url = "/pages/category/index"
          }
          return value
        })
        this.setData({
          menus: newData
        })
      }),
      // 请求楼层
      request({
      url:'/home/floordata'
      }).then(res=>{
        const { message } = res.data;
        this.setData({
          floors:message
        })
      })
  },
  handleToTop() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  },
  onPageScroll(e) {
    const { scrollTop } = e;
    let isShow = this.data.isShowTop;

    if (scrollTop > 100) {
      isShow = true
    } else {
      isShow = false
    }
    if (isShow == this.data.isShowTop) return;

    this.setData({
      isShowTop: isShow
    })
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})