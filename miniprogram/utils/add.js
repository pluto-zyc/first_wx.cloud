var db = wx.cloud.database()
// 添加数据
async function addList(collect = '', data = {}) {
  return await db.collection(collect).add({
    data,
  })
}
//  条件查询
async function getList(collect = '', data = {}) {
  return await db.collection(collect).where(data).get()
}
// id查询 一条
async function getList_id(collect = '', id = '') {
  return await db.collection(collect).doc(id).get()
}
// 处理用户删除 一条
async function removeOne(collect = '', id = '') {
  return await db.collection(collect).doc(id).remove()
}
// 处理用户修改一条
async function updateOne(collect = '', id = '', data = {}) {
  return await db.collection(collect).doc(id).update({
    data
  })
}
// 多文件处理image选择
async function chooseImages() {
  var result = await wx.chooseImage({
    count: 3,
  })
  if (result.tempFilePaths.length > 0) {
    var menuPic = result.tempFilePaths
    var menuPicArr = menuPic.map(item => {
      return {
        url: item
      }
    })
    return menuPicArr
  }
}
// 处理用户批量提交文件
async function uploadFiles(e) {
  // 上传存储
  var arr = []
  wx.showLoading()
  e.forEach(item => {
    var date = new Date().getTime() //随机时间
    var ext = item.url.split('.').pop() //扩展名
    var time = new Date().getTime()
    //一张上传
    var item1 = wx.cloud.uploadFile({
      filePath: item.url,
      cloudPath: 'menu/' + time + '.' + ext
    })
    // 结果添加到数组里
    arr.push(item1)
  })
  //等待数组里的promise全部执行完毕
  var result = await Promise.all(arr)
  //提取fileID
  var cloudSrc = result.map(item => {
    return item.fileID
  })
  if (cloudSrc.length > 0) {
    wx.hideLoading()
    return cloudSrc
  }
}
// 处理文件上传
async function addUpload(filePath) {
  var date = new Date().getTime()
  var ext = filePath.split('.').pop()
  return await wx.cloud.uploadFile({
    filePath,
    cloudPath: 'image/' + date + '.' + ext,
  })
}
// 请求 按照字段倒叙排序
async function getSort_list(collect, key, sort, num) {
  return await db.collection(collect).orderBy(key, sort).limit(num).get()
}
// 处理正则查询 规定条数
// 数据库正则对象
async function getReg_num(collect, cat, value, page, pageSize) {
  return await db.collection(collect).where({
    menuName: db.RegExp({
      regexp: value,
      options: 'i',
    })
  }).skip(page * pageSize).limit(pageSize).get()
}
async function getReg_num1(collect, cat, value, page, pageSize) {
  return await db.collection(collect).where({
    menuCateName: db.RegExp({
      regexp: value,
      options: 'i',
    })
  }).skip(page * pageSize).limit(pageSize).get()
}
  // 没有条件请求 列表触底刷新
async function getList_bot(collect,key, sort,page, pageSize) {
  wx.showLoading()
  return await db.collection(collect).orderBy(key, sort).skip(page * pageSize).limit(pageSize).get()
}

// 处理时间戳补零
function getDate(e) {
  var date = new Date(e)
  var y = date.getFullYear()
  var m = date.getMonth()
  var d = date.getDate()
  var h = date.getHours()
  var f = date.getMinutes()
  m = m.toString().padStart(2, '0')
  d = d.toString().padStart(2, '0')
  h = h.toString().padStart(2, '0')
  m = m.toString().padStart(2, '0')
  return `${y}年${m}月${d}日  ${h}:${m}`
}
export {
  getDate,
  addList,
  getList,
  getList_id,
  addUpload,
  updateOne,
  removeOne,
  uploadFiles,
  chooseImages,
  getSort_list,
  getReg_num,
  getReg_num1,
  getList_bot
}