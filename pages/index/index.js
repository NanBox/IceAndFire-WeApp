//index.js
const url = require('../../config')
const duration = 2000

Page({
  data: {
    currentType: "person"
  },
  /** 
    * 监听页面加载 
    */
  onLoad: function () {
    var that = this

    that.setData({
      hideLoading: false
    })

    wx.request({
      url: url.getContent,
      header: {
        'Content-Type': 'application/json'
      },
      data: {

      },
      success: function (result) {
        that.setData({
          contents: result.data,
          hideLoading: true
        })
      },

      fail: function ({errMsg}) {
        that.setData({
          hideLoading: true
        })
      }
    })
  },
  /** 
    * 点击tab切换 
    */
  swichTab: function (event) {
    if (this.data.currentTab == event.currentTarget.id) {
      return false;
    } else {
      this.setData({
        currentType: event.currentTarget.id
      })
    }
  },
  /** 
    * 跳转到详情页面 
    */
  goDetail: function (event) {
    var name = event.currentTarget.dataset.name
    var img = event.currentTarget.dataset.img
    var html = event.currentTarget.dataset.html.split(".")[0]
    wx.navigateTo({
      url: '../detail/detail?name=' + name + '&img=' + img + '&html=' + html,
      success: function (res) {
        // success
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })
  }
})