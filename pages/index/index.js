//index.js
const url = require('../../config')
const duration = 2000

Page({
  data: {
    baseUrl: "https://southernbox.github.io/IceAndFireServer/",
    tabs: ['人物', '家族', '历史', '城堡'],
    types: ['person', 'house', 'history', 'castle'],
    //当前选中的 tab
    activeTab: 0,
    //当前选中的类型
    currentType: "person",
    //屏幕宽度
    windowWidth: 0,
    //单个 tab 宽度
    tabWidth: 0,
    //偏移量
    offset: 0,
    //是否拖拽中
    isDrag: false
  },
  /** 
    * 监听页面加载 
    */
  onLoad: function () {
    var that = this

    that.setData({
      //显示加载提示框
      hideLoading: false
    })

    that.tabsCount = that.data.tabs.length;
    var res = wx.getSystemInfo({
      success: function (res) {
        that.setData({
          //设置屏幕宽度、tab 宽度
          windowWidth: res.windowWidth,
          tabWidth: res.windowWidth / that.data.tabs.length
        })
      }
    })

    //请求数据
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
  onTouchDown(e) {
    let {clientX, clientY} = e.touches[0];
    this.lastX = clientX;
    this.downX = clientX;
    this.downY = clientY;
    this.startTime = e.timeStamp;
    this.setData({ isDrag: true })
  },
  onTouchMove(event) {
    let {clientX, clientY} = event.touches[0];
    let {offset} = this.data;
    let offsetX = this.lastX - clientX;
    this.lastX = clientX;
    offset += offsetX;
    if (offset <= 0) {
      offset = 0;
    } else if (offset >= this.windowWidth * (this.tabsCount - 1)) {
      offset = this.windowWidth * (this.tabsCount - 1);
    }
    this.setData({ offset: offset });
  },
  onTouchUp(event) {
    let {clientX, clientY} = event.changedTouches[0];
    let endTime = event.timeStamp;
    let {offset, windowWidth, activeTab} = this.data;
    //快速滑动
    if (endTime - this.startTime <= 300 && Math.abs(this.downY - clientY) < 50) {
      if (this.downX - clientX > 10) {
        //向左滑动
        if (activeTab < this.tabsCount - 1) {
          this.setData({ activeTab: ++activeTab })
        }
      } else if (this.downX - clientX < -10) {
        //向右滑动
        if (activeTab > 0) {
          this.setData({ activeTab: --activeTab })
        }
      }
      offset = windowWidth * activeTab;
    } else {
      let page = Math.round(offset / windowWidth);
      if (activeTab != page) {
        this.setData({ activeTab: page })
      }
      offset = windowWidth * page;
    }
    this.setData({
      isDrag: false,
      offset: offset
    })
  },
  _updateSelectedPage(page) {
    var that = this
    this.setData({
      activeTab: page,
      offset: that.data.windowWidth * page
    })
  },
  onTabClick(e) {
    this._updateSelectedPage(e.currentTarget.dataset.index);
  }
})