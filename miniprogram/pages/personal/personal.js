const app = getApp()
import {removeOne,getList,getList_id} from '../../utils/add'
Page({
  data: {
    lists:[],//我的关注列表
    menuCateList:[],//我的分类菜谱
    myMenuList:[],//我的菜单列表
    openid:'',
    myMenuFollowList:[],//所有我关注的信息
    // 控制tap栏内容盒子
    show:{
     show1:true,
     show2:false,
     show3:false
    },
    // 我的页面切换栏
    tapIndex:0,
    mineTap:[
      '菜单','菜谱','关注'
    ],
    myInfo:null,
    isLogin:false,
    head_pic:''
  },
  // 点击头像跳转到添加菜谱 类别 页面
  toPbmenutype(){
    wx.navigateTo({
      url: '../pbmenutype/pbmenutype',
    })
  },
// 获取用户信息
  // 点击登录按钮获取星系渲染页面  修改isLogin
  getInfo() {
    wx.getSetting({
      success: (res) => {
       
        if (res.authSetting['scope.userInfo']) {
          console.log(111);
          wx.getUserInfo({
            lang: "zh_CN",
            success: (res) => {
              console.log(222);
              console.log(res);
              var head_pic = res.userInfo.avatarUrl
              var myInfo = res.userInfo
              this.setData({
                myInfo: myInfo,
                head_pic: head_pic,
                isLogin:true
              })
              app.globalData.myInfo = myInfo
            }
          })
        }
      }
    })
  },
  // 点击tab切换获取
async  bindTap(e){
    var {id} = e.currentTarget
    if(id==0){
      this.data.show.show1 =true
      this.data.show.show2 =false
      this.data.show.show3 =false
    }else if(id==1){
      this.data.show.show1 =false
      this.data.show.show2 =true
      this.data.show.show3 =false
         var openid = this.data.openid
        var List = await getList('menuCates',{_openid:openid})
        console.log(List.data);
         this.setData({
          menuCateList:List.data
         })
    }else if(id==2){
      this.data.show.show1 =false
      this.data.show.show2 =false
      this.data.show.show3 =true
      //通过openid 请求自己添加关注的所有数据
     var myFollowList = await getList('follows',{'_openid':this.data.openid})
     console.log(myFollowList);
     var re = myFollowList.data.map(async item=>{
      //  通过 菜单id 查询所有 该用户添加的 所有菜单
      var myMenuFollowList = await getList_id('menus',item.menuId)
      return [myMenuFollowList.data]
      })
      // 拿到所有关注过的列表
      var result = await Promise.all(re)
     var lists =  result.map(item=>{
        return item[0]
      })
      console.log(lists);
     

      }
    this.setData({
      lists:lists,
      tapIndex:id,
      show:this.data.show
    }) 
  },
  // 去往  添加菜单 面板
  toListAdd(){
    console.log(11);
    
    wx.navigateTo({
      url:'../pbmenu/pbmenu'
    })
  },
  // 点击我的菜单去详情页面
  myMenu_toDetail(e){
    var id = e.currentTarget.id
  wx.navigateTo({
    url:'../recipeDetail/recipeDetail?id='+id
  })
  },
  // 点击我的关注列表去详情
  toFollowDetail(e){
    const id = e.currentTarget.id
    wx.navigateTo({
      url: '../recipeDetail/recipeDetail?id='+id,
    })
  },
  // 右划点击查看去往 该菜谱分类 的菜单列表
  toMenuCateList(e){
     var id = e.currentTarget.id
     wx.navigateTo({
       url: '../recipelist/recipelist?cateName='+id,
     })
  },
  // 删除封装
 async remove(id){
    var removeInfo = await removeOne('menus',id)
    if(removeInfo.stats.removed==1){
      wx.showToast({
        title: '删除成功',
        duration:1000,
        mask: true
      })
      this.getMyMenu()
    }
  },
  // 在我的菜单列表 点击删除
  removeMyMenu(e){
    console.log(e);
    const id = e.currentTarget.id
    const index = e.currentTarget.dataset.index
    // 拿到所有列表中 对应点击下表的 fileID
    var removeFileId = this.data.myMenuList[index].menuPic_fileID
    
    wx.showModal({
      title: '确认删除吗？',
      success:(res)=>{
        if(res.confirm){
          this.remove(id)
          removeFileId.forEach( async item=>{
            wx.cloud.deleteFile({
              fileList: [item],
              success: res => {
              },
            })
          })
        }
        
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  getMyMenu(){
    // 获取我的菜单列表
    wx.getStorage({
      key: 'openid',
      success: async (res)=> {
        var openid = res.data
        this.setData({
          openid
        })
      var List = await getList('menus',{_openid:openid})
      console.log(List.data);
      
       this.setData({
        myMenuList:List.data
       })
      }
    })
  },
 onLoad(e) {
  //  获取 用户信息 
    if (app.globalData.myInfo) {
      this.setData({
        myInfo: app.globalData.myInfo,
        isLogin:true,
        head_pic: app.globalData.myInfo.avatarUrl,
      })
    } else{
      // console.log("here")
      //回调函数
      app.userInfoReadyCallback = res => {
        this.setData({
          myInfo: res.userInfo,
          isLogin:true,
          head_pic: res.userInfo.avatarUrl,
        })
      }
    }
    this.getMyMenu()
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