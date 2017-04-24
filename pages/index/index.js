//index.js  
Page({
  data: {
    currentTab: 0
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