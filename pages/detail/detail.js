//detail.js
var WxParse = require('../../wxParse/wxParse.js');
const url = require('../../config')

Page({
    data: {
        img: ''
    },
    onLoad: function (options) {
        var that = this

        that.setData({
            hideLoading: false
        })

        this.setData({
            img: url.baseUrl + options.img
        })
        wx.setNavigationBarTitle({
            title: options.name
        })

        wx.request({
            url: url.baseUrl + options.html + '.html',
            data: {},
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function (res) {
                var htmlData = res.data.replace(/p {/, "").replace(/font-size: 110%;/, "").replace(/line-height: 160%;/, "").replace(/}/, "")
                that.setData({
                    article_content: WxParse.wxParse('article_content', 'html', htmlData, that, 5),
                    hideLoading: true
                })
            },
            fail: function (res) {
                that.setData({
                    hideLoading: true
                })
            },
            complete: function (res) {
                // complete
            }
        })
    }
})