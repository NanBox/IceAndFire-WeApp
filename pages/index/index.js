//index.js
const url = require('../../config')
const duration = 2000

Page({
  data: {
    currentTab: 0
  },
  /** 
    * 监听页面加载 
    */
  onLoad: function () {
    var self = this

    self.setData({
      loading: true
    })

    wx.request({
      url: url.getContent,
      header: {
        'Content-Type': 'application/json'
      },
      data: {

      },
      success: function (result) {
        wx.showToast({
          title: '请求成功',
          icon: 'success',
          mask: true,
          duration: duration
        })
        self.setData({
          contents: result.data
        })
        loading: false
        console.log('request success', result)
      },

      fail: function ({errMsg}) {
        console.log('request fail', errMsg)
        self.setData({
          loading: false
        })
      }
    })
  },
  /** 
    * 点击tab切换 
    */
  swichNav: function (e) {
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      this.setData({
        currentTab: e.target.dataset.current
      })
    }
  }
})