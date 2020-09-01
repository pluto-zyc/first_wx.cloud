import {
  getList,
  getSort_list,
  getList_bot
} from '../../utils/add'
var db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nowPage:-1,
    nowPageSize:3,
    menuCateList: [],
    hotList: [],
    searchValue: '', //搜索框值
    page: 0,
    pageSize: 3,
  },
  //  获取输入框的值
  bindinput_search(e) {
    this.data.searchValue = e.detail.value
  },

  // 点击搜索 
  bindIndeSearch() {
    //  跳转到搜索列表
    var searchValue = this.data.searchValue
    this.setData({
      searchValue: ''
    })
    wx.navigateTo({
      url: '../recipelist/recipelist?value=' + searchValue,
    })

  },
  //  点击菜谱分类 去菜谱分类列表
  toCateMenu() {
    wx.navigateTo({
      url: '../typelist/typelist',
    })
  },
  // 点击儿童菜谱
  toCateList(e) {
    var value = e.currentTarget.id
    wx.navigateTo({
      url: '../recipelist/recipelist?cateName=' + value,
    })
  },
  //  点击首页热门列表数据去往详情
  toIndexDetail(e) {
    const id = e.currentTarget.id
    wx.navigateTo({
      url: '../recipeDetail/recipeDetail?id=' + id,
    })

  },
  // 获取hotlist 封装
  async getHot(page,pageSize) {
    var arr = await getList_bot('menus', 'views', 'desc', page, pageSize) //热门菜单
    var hotList = arr.data
    wx.hideLoading()
    return hotList
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(e) {
    var res = await db.collection('menuCates').limit(3).get() //菜谱
    var menuCateList = res.data
    // 请求热门列表
    var {pageSize, page } = this.data
    var hotList = await this.getHot(page,pageSize)
    // 给分类添加图片
    menuCateList[0].pic = '/static/index/ertong.png'
    menuCateList[1].pic = '/static/index/yangsheng.png'
    menuCateList[2].pic = '/static/index/tuijian.png'
    if (menuCateList.length > 0) {
      this.setData({
        menuCateList,
        hotList
      })
   }
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  async onShow() {
    if (this.data.hotList.length > 0) {
      var hotList = await this.getHot(0,3)
      this.setData({
        hotList,
        page:0,
        pageSize:3
      })
    }
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
 async onPullDownRefresh() {
    var  res = await this.getHot(0,3)
    var hotList = res
    console.log(hotList);
    // 更新页数
    this.setData({
      hotList,
      page:0,
      pageSize:3
    })
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  async onReachBottom() {
    this.data.page += 1
    var page = this.data.page
    var pageSize = this.data.pageSize
     this.setData({
        nowPage:page,
        nowPageSize:pageSize
     })
    var hotList = await this.getHot(page,pageSize)
    if(hotList.length==0){
      wx.showToast({
        title: '已经到底啦',
        icon:'none'
      })
    }else if(hotList.length > 0){
      this.setData({
        hotList: this.data.hotList.concat(hotList)
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
      
  }
})