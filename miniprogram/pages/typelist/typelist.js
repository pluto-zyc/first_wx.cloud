import {getList} from '../../utils/add'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuCates:[],
    searchValue:''
  },
  bindInput_search(e){
    console.log(e.detail.value);
    
    this.data.searchValue = e.detail.value
  },
  // 点击搜索跳转到 点菜单列表
   bindSearch(){
    wx.navigateTo({
      url: '../recipelist/recipelist?value='+this.data.searchValue,
    })
   },
   toCateDetail(e){
    var value = e.currentTarget.id
    wx.navigateTo({
      url: '../recipelist/recipelist?cateName='+value,
    })
   },
  /**
   * 生命周期函数--监听页面加载
   */
 async onLoad(e) {
    // 进页面就请求菜单分类
    var res = await getList('menuCates')
    var menuCates = res.data
    this.setData({
      menuCates
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
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})