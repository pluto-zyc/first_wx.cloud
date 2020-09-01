
import {getList,uploadFiles,chooseImages,addList} from '../../utils/add'
  const app = getApp()
Page({
  data: {
  menu:{
    menuName:'',//菜单名称
    menuCateName:'',
    menuCate_id:'',
    menuCates:[],//菜谱列表
    menuPic:[],//菜单图片
    menuPic_fileID:[],//菜单fileID
    menuText:'',//文本介绍
    userInfo:null,//用户星系
    follows:0,//关注数
    views:0,//浏览数
    date:new Date().getTime()
    }
  },
//  获取 菜谱 id 名称
   getMenuCate_id(e){
    var id = e.target.id
    console.log(id);
    var cateName = e.target.dataset.value
    this.data.menu.menuCate_id = id
    this.data.menu.menuCateName = cateName
    this.setData({
      menu:this.data.menu
    })
   },
  // 点击发布   添加数据库
  async addMenu(e){
        // 上传 多 文件  返回 fileID 数组
    var fileArr = await uploadFiles( this.data.menu.menuPic)
    var value = e.detail.value
    this.data.menu.menuName = value.menuName
    this.data.menu.menuText = value.menuText
    this.data.menu.userInfo=app.globalData.myInfo,
    this.data.menu.menuPic_fileID=fileArr,
    this.setData({
      menu:this.data.menu
    })
    // 添加数据到数据库 menus
   var add_Suc_res =  await addList('menus',this.data.menu)
    if(add_Suc_res.errMsg=='collection.add:ok'){
       wx.showToast({
          title: '添加成功',
          duration: 1000,
          icon: 'success',
        })
        wx:wx.reLaunch({
          url: '../index/index',
        })
    }
  },
  // 展示零时路径
 async changeImage(){
  //  调用处理多文件选择函数  
   var res = await chooseImages()
  //  将选中图片渲染到页面
    this.data.menu.menuPic = res
       this.setData({
        menu:this.data.menu
       })

  },
  //  onLoad
 async onLoad(e) {
   var menuCateList = await getList('menuCates')
   this.data.menu.menuCates = menuCateList.data
   this.setData({
    menu:this.data.menu
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