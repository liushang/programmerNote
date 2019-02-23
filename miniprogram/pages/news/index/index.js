//index.js
const app = getApp()

Page({
  data: {
    swiperOptions: {
      indicatorDots: true,
      autoplay: true,
      circular: true,
      interval: 5000,
      duration: 500,
    },
    banners: [{
      thumb: 'http://p1.meituan.net/movie/a10357392d99ffa5a01b11ddd893f1d384328.jpg',
      link: '',
      keyWord: '11111'
    }, {
      thumb: 'http://p1.meituan.net/movie/2d5677663a7cf2167e473a6a269dac7b91163.jpg',
      link: '',
      keyWord: '22222'
    }, {
      thumb: 'http://p0.meituan.net/movie/0fd9d06392d1b275705c7300317e924675865.jpg',
      link: '',
      keyWord: '33333'
    }],
    addBanner: true,
    upLoadImg: '',
  },

  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },
  onBannerChagne () {
    console.log('banner滑动')
  },
  showAddBanner () {
    this.setData({
      addBanner: true
    })
    console.log('banner滑动')
  },
  shutAddBanner () {
    
    this.setData({
      addBanner: false
    })
  },
  upLoadImage () {
    console.log('uploadimg')
    // 选择图片
    let self = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        // 上传图片
        const cloudPath = 'news-banner' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)
            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
            self.setData({
              upLoadImg: filePath,
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },
  preventShut () {
    console.log('防止冒泡')
    // this.setData()
  },
  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        const db=wx.cloud.database()
        let ddd = db.collection('toDu').doc('XG6-XJT75u22FoUg').get().then(res => {
          console.log('我我我我哦我')
          console.log(res)
        })
        // console.log(ddd)
        db.collection('toDu').add({
          // data 字段表示需新增的 JSON 数据
          data: {
            // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
            description: 'learn cloud database',
            due: new Date('2019-02-01'),
            date: new Date('2018-08-01'),
            items: [
              'cloud',
              'database'
            ],
            // 为待办事项添加一个地理位置（113°E，23°N）
            location: new db.Geo.Point(113, 23),
            done: false
          },
          success(res) {
            // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
            console.log(res)
          },
          fail(res){
            console.log(res)
          }
        })
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        
        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
            
            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

})
