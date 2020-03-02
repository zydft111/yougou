// pages/goods_list/index.js
import request from "../../utils/request.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyword: '华为',
    goods: [],
    pagenum: 1,
    isLoading: true,
    hasMore: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // const {keyword} = options;
    // this.setData({
    //   keyword
    // }),
    this.getGoods()
  },
  // 获取商品列表函数
  getGoods() {
    if (this.data.hasMore == false) {
      return;
    }
    request({
      url: "/goods/search",
      data: {
        query: this.data.keyword,
        pagenum: this.data.pagenum,
        pagesize: 10
      }
    }).then(res => {
      const { message } = res.data;
      const newdata = message.goods.map(v => {
        v.goods_price = Number(v.goods_price).toFixed(2);
        return v;
      })
      this.setData({
        goods: [...this.data.goods, ...newdata],
        isloading: false
      })
      console.log(this.data.goods)
      if (this.data.goods.length >= message.total) {
        this.setData({
          hasMore: false
        })
      }
    })
  },
  // 拉到达底部事件
  onReachBottom() {
    console.log(1)
    if (this.data.isLoading === false) {
      this.setData({
        isLoading: true,
        pagenum: this.data.pagenum + 1
      })
    }
    this.getGoods()
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})