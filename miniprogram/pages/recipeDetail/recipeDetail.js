 import {
   getList_id,
   updateOne,
   addList,
   removeOne,
   getList
 } from '../../utils/add'
 Page({
   /**
    * 页面的初始数据
    */
   data: {
    follow_add_id:'',
    //  进入页面的初始浏览量
    follows:0,//关注
    views:0,//浏览
     nowId:'',
     addFollow: {
       menuId: '',
       openId: '',
     },
     detailInfo: null,
     isFollow: false
   },
   // 点击关注 传数据到follows 表
  async changeFollow(e) {
    //  如果点击了关注
    var views = this.data.views
    var follows = this.data.follows
     if(!this.data.isFollow){ 
    //修改 收藏人数+、
      var updateRes =  await updateOne('menus',this.data.nowId,{follows:follows+1})
    //  增加数据到follows表
      var addRes = await addList('follows',this.data.addFollow)
      // 存储上传之后返回的该条id
      this.setData({
        follow_add_id:addRes._id
      })
      if(addRes._id){
        wx.showToast({
          title: '关注成功',
        })
        // 跟新页面
        this.getDeatils(this.data.nowId)
      }
    //  减少收藏人数
     }else{
      //  修改关注数量-
      var updateRes =  await updateOne('menus',this.data.nowId,{follows:follows-1})
      console.log(updateRes);
      // 删除follows的数据
      var removeRes = await removeOne('follows',this.data.follow_add_id)
      if(removeRes.stats.removed==1){
        wx.showToast({
          title: '取关成功',
        })
        // 跟新页面
        this.getDeatils(this.data.nowId)
     }     
   }
   // 关注 取反
   this.setData({
    isFollow: !this.data.isFollow
  })
  },
   /**
    * 生命周期函数--监听页面加载
    */
  //  获取详情页面数据  封装
async  getDeatils(id){
    var data = await getList_id('menus', id)
    console.log(data);
    if(data.data.menuName){
      this.data.addFollow.menuId= id
      this.setData({
      detailInfo: data.data,
      addFollow: this.data.addFollow,
      follows:data.data.follows,
      views:data.data.views
    })
    }
  },
 async onLoad(e) {
     var id = e.id
    var res = await this.getDeatils(id)
   
    //  一进页面 修改 浏览量字段加一
    if(this.data.views>=0){//如果数据已经请求回来
      var views = this.data.views
        var updateRes =  await updateOne('menus',id,{views:views+1})
          //  重新渲染页面
        this.getDeatils(id)
    }
     wx.getStorage({
       key: 'openid',
       success:(res)=> {
         console.log(res);
         var openId = res.data
           this.data.addFollow.openId= openId //上传到follows表里的字段
           this.setData({
             addFollow: this.data.addFollow,
             nowId:id//当前菜谱id
           })
       }
     })
    //  添加浏览量
      // 更新 收藏人数、
     var follows = await getList('follows')
   var  reg =  follows.data.filter(item=>{
       return item.menuId == id
     })
    if(reg.length>0){
      this.setData({
        nowId:id,
        isFollow:true,
        follow_add_id:reg[0]._id
      })
    }
     
   },
  //  点击分享给朋友
  toFriend(){
   wx.showToast({
      title: '该功能尚未开通',
      duration: 1000,
      icon: 'warn',
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