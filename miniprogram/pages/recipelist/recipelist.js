var db = wx.cloud.database()
import {
  getReg_num,
  getReg_num1
} from '../../utils/add'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isNull: false, //显示不能加载更多
    cateName: "", //菜谱名称条件
    searchValue: "", //搜索条件
    pageSize: 5,
    page: 0,
    searchList: []
  },
  // 点击菜单图片去详情
  toDetail(e) {
    var id = e.target.id
    wx.navigateTo({
      url: '../recipeDetail/recipeDetail?id=' + id,
    })
  },
  //  获取列表封装
  async getList(page, pageSize, cateName, searchValue) {
    // 如果都没有就不执行后面
    if (!searchValue && !cateName) {
      return
    }
    // 如果是搜索
    if (searchValue) {
      var menuLists = await getReg_num('menus', 'menuName', searchValue, page, pageSize)
      var arr = menuLists.data
      wx.setNavigationBarTitle({
        title: searchValue,
      });
    } else if (cateName) {
      // console.log(cateName);
      var menuLists = await getReg_num1('menus', 'menuCateName', cateName, page, pageSize)
      var arr = menuLists.data
      wx.setNavigationBarTitle({
        title: cateName,
      });
    }
    this.setData({
      searchList: this.data.searchList.concat(arr)
    })
    return menuLists.data
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(e) {
    //  拿到页面参数
    var {
      pageSize,
      page
    } = this.data
    var cateName = e.cateName
    var searchValue = e.value
    // 调用获取部分列表方法
    this.getList(page, pageSize, cateName, searchValue)
    this.setData({
      cateName,
      searchValue
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
async onReachBottom(e) {
    this.data.page += 1
    var page = this.data.page
    var {
      pageSize,
      searchValue,
      cateName
    } = this.data
    var res = await this.getList(page, pageSize, cateName, searchValue)
    if (res.length == 0) {
      this.setData({
        isNull: true
      })
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})