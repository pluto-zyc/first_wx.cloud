import {addList,updateOne,getList,removeOne} from '../../utils/add'
Page({
  data: {
    nowId:'',//当前数据id
    isAdd:false,//显示添加面板
    isUpdate:false,//显示修改面板
    addValue: "",//添加输入框 value
    updateValue:'',//修改输入框 value
    cateMenus:[] //菜单分类列表
  },
  // 清空
  cancel(){
    this.setData({
      addValue:''
    })
  },
  //  绑定添加输入框
  getAddMenu(e) {
    this.data.addValue = e.detail.value;
  },
 
 // 点击加号 展示添加面板
 bindAdd(e){
   this.setData({
    isAdd:!this.data.isAdd
   })
 },
 // 点击修改 获取 该条字段id  并且 展示修改面板
 bindUpdate(e){
   const id = e.target.id
  this.setData({
    isUpdate:!this.data.isUpdate,
    nowId:id
  })
 },
  // 点击添加  添加菜单分类
  async addMenu(e) {
    const menuCate = this.data.addValue
    var is= true
    // 遍历列表拿到菜谱名字 与添加字段对比
    this.data.cateMenus.forEach(item=>{
       if(item.menuCate==menuCate){
         is = false
       }    
    })
    // 如果已存在提示 不能重复
    if(!is){
     wx.showToast({
       title: '该字段已存在不能重复添加',
     })
      return;
    }
    var res =  await addList('menuCates',{"menuCate":menuCate})
    if(res.errMsg=='collection.add:ok'){
      wx.showToast({
        title: '添加成功',
        duration: 1000,
        icon: 'success',
      })
      this.getList()
    }
   },
 // 点击删除
 async bindRemove(e){
   var id = e.target.id
     //  删除数据
    var res = await removeOne('menuCates',id)
    console.log(res);
   if(res.stats.removed == 1){
    wx.showToast({
      title: '删除成功',
      duration: 1000,
      icon: 'success',
    })
    this.getList()
   }
 },
  //  绑定修改输入框
  getUpdateMenu(e) {
    this.data.updateValue = e.detail.value;
  },
   // 点击修改  修改菜单分类
 async updateMenu(e) {
   const updateValue = this.data.updateValue
   var iss= true
   // 遍历列表拿到菜谱名字 与添加字段对比
   this.data.cateMenus.forEach(item=>{
      if(item.menuCate==updateValue){
        iss = false
      }    
   })
   // 如果已存在提示 不能重复
   if(!iss){
     console.log('该字段已存在不能重名');
     return;
   }
   const id = this.data.nowId
   var data = {"menuCate":updateValue}
   var res =  await updateOne('menuCates',id,data)
    if(res.errMsg=='document.update:ok'){
      wx.showToast({
        title: '修改成功',
        duration: 1000,
        icon: 'success',
      })
      this.getList()
    }
  },
  // 请求列表更新页面 封装
  async getList(){
    var res = await getList('menuCates',{})
    this.setData({
      cateMenus:res.data
    })
    return res
  },
  onLoad (e) {
  this.getList()
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