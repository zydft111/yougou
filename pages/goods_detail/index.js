// pages/good_detail/index.js
import request from '../../utils/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods_detail: {},
    current: 0,
    picUrls :[]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    request({
      url: '/goods/detail',
      data: {
        goods_id: options.id
      }
    }).then(res => {
      const {
        message
      } = res.data;
      console.log(message)
      const picUrls = message.pics.map(v => {
        return v.pics_big
      });
      this.setData({
        goods_detail: message,
        picUrls 
      })
    })
  },
  handlePreview(e) {
    const {
      index
    } = e.currentTarget.dataset;
    wx.previewImage({
      current: this.data.picUrls[index],
      urls: this.data.picUrls
    })
  },
  handleTap(e) {
    const {
      index
    } = e.currentTarget.dataset;

    this.setData({
      current: index
    })
  },
  handleToCart() {
    wx.switchTab({
      url: '/pages/cart/index',
    })
  },
  handleAddCart() {
    const goods = wx.getStorageSync("goods") || [];
    const exit = goods.some(v => {
      const isExit = v.goods_id === this.data.goods_detail.goods_id;
      if (isExit) {
        v.number += 1;
        wx.showToast({
          title: '数量+1',
          icon: 'success'
        })
      }

      return isExit;
    })
    if (!exit) {
      goods.unshift({
        goods_id: this.data.goods_detail.goods_id,
        goods_name: this.data.goods_detail.goods_name,
        goods_price: this.data.goods_detail.goods_price,
        goods_small_logo: this.data.goods_detail.goods_small_logo,
        number: 1,
        select: true 
      })

      wx.showToast({
        title: '加入成功',
        icon: 'success'
      })
    }
    wx.setStorageSync("goods", goods);
  }
})