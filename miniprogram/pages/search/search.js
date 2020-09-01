import {getList,getSort_list} from '../../utils/add'
Page({
  /**
   * 页面的初始数据
   */
  data: {
      // 搜索value
      searchValue:'',//
      oldValue:[],
      hostList:[]
  },
  // 监听搜索信息
  getSerchInfo(e){
   this.data.searchValue = e.detail.value;
  },
  // 点击热门搜索
  toHotDetail(e){
    var menuName = e.target.id//搜索字段
    wx.navigateTo({
      url: '../recipelist/recipelist?value='+menuName,
       })
  },
  // 点击搜索  获取列表
 async bindSearch(){
    var searchValue = this.data.searchValue//搜索字段
// 历史搜索存入数组
   // 如果搜索数组中已经有该字段  则不存
     var a = this.data.oldValue.some(i=>{return i==searchValue})
     if(a){
           //  跳转到搜索列表
      wx.navigateTo({
      url: '../recipelist/recipelist?value='+searchValue,
       })
       this.setData({
        searchValue:''
       })
       return
     }
    this.data.oldValue.unshift(searchValue)
    // 如果搜索数组大于三条
    if(this.data.oldValue.length>3){
      this.data.oldValue.pop()
    }
    wx.setStorage({
      data: this.data.oldValue,
      key: 'value',
    })
   this.setData({
    oldValue:this.data.oldValue,
    searchValue:''
   })
     //  跳转到搜索列表
     wx.navigateTo({
      url: '../recipelist/recipelist?value='+searchValue,
       })
  },
  // 点击近期搜索
  bindSearchNow(e){
    var value= e.currentTarget.id
    wx.navigateTo({
      url: '../recipelist/recipelist?value='+value,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
 async onLoad(e) {
    wx.getStorage({
      key: 'value',
      success:(res)=>{
      if(res.data.length>0){
        // 多余三项就删除最后一项
        this.setData({
          oldValue:res.data
         })
      }
      }
    })
    // 处理热门搜索
   var res = await getSort_list('menus','views','desc',10)
   var hostList=res.data
     this.setData({hostList})
          console.log(hostList);
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