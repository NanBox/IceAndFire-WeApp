//index.js
const url = require('../../config')
const duration = 2000

Page({
  data: {
    tabs: ['人物', '家族', '历史', '城堡'],
    types: ['person', 'house', 'history', 'castle'],
    baseUrl: "https://southernbox.github.io/IceAndFireServer/",
    currentType: "person",
    stv: {
      windowWidth: 0,
      lineWidth: 0,
      offset: 0,
      tStart: false
    },
    activeTab: 0
  },
  /** 
    * 监听页面加载 
    */
  onLoad: function () {
    var that = this

    that.setData({
      hideLoading: false
    })

    try {
      var res = wx.getSystemInfoSync()
      this.windowWidth = res.windowWidth;
      this.data.stv.lineWidth = this.windowWidth / this.data.tabs.length;
      this.data.stv.windowWidth = res.windowWidth;
      this.setData({ stv: this.data.stv })
      this.tabsCount = tabs.length;
    } catch (e) {
    }

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
  },
  handlerStart(e) {
    let {clientX, clientY} = e.touches[0];
    this.startX = clientX;
    this.tapStartX = clientX;
    this.tapStartY = clientY;
    this.data.stv.tStart = true;
    this.tapStartTime = e.timeStamp;
    this.setData({ stv: this.data.stv })
  },
  handlerMove(e) {
    let {clientX, clientY} = e.touches[0];
    let {stv} = this.data;
    let offsetX = this.startX - clientX;
    this.startX = clientX;
    stv.offset += offsetX;
    if (stv.offset <= 0) {
      stv.offset = 0;
    } else if (stv.offset >= stv.windowWidth * (this.tabsCount - 1)) {
      stv.offset = stv.windowWidth * (this.tabsCount - 1);
    }
    this.setData({ stv: stv });
  },
  handlerCancel(e) {

  },
  handlerEnd(e) {
    let {clientX, clientY} = e.changedTouches[0];
    let endTime = e.timeStamp;
    let {tabs, stv, activeTab} = this.data;
    let {offset, windowWidth} = stv;
    //快速滑动
    if (endTime - this.tapStartTime <= 300) {
      //向左
      if (Math.abs(this.tapStartY - clientY) < 50) {
        if (this.tapStartX - clientX > 5) {
          if (activeTab < this.tabsCount - 1) {
            this.setData({ activeTab: ++activeTab })
          }
        } else {
          if (activeTab > 0) {
            this.setData({ activeTab: --activeTab })
          }
        }
        stv.offset = stv.windowWidth * activeTab;
      } else {
        //快速滑动 但是Y距离大于50 所以用户是左右滚动
        let page = Math.round(offset / windowWidth);
        if (activeTab != page) {
          this.setData({ activeTab: page })
        }
        stv.offset = stv.windowWidth * page;
      }
    } else {
      let page = Math.round(offset / windowWidth);
      if (activeTab != page) {
        this.setData({ activeTab: page })
      }
      stv.offset = stv.windowWidth * page;
    }
    stv.tStart = false;
    this.setData({ stv: this.data.stv })
  },
  _updateSelectedPage(page) {
    let {tabs, stv, activeTab} = this.data;
    activeTab = page;
    this.setData({ activeTab: activeTab })
    stv.offset = stv.windowWidth * activeTab;
    this.setData({ stv: this.data.stv })
  },
  handlerTabTap(e) {
    this._updateSelectedPage(e.currentTarget.dataset.index);
  }
})