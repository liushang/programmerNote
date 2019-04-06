//index.js
import { urlPre } from '../../../js/env.js'
const app = getApp()
console.log(urlPre)
Page({
  data: {
    swiperOptions: {
      indicatorDots: true,
      autoplay: true,
      circular: true,
      interval: 5000,
      duration: 500,
    },
    banners: null,
    bannerObj: {
      fileID: '',
      bannerLink: '',
      keyWord: ''
    },
    addBanner: false,
    upLoadImg: '',
    fileID: '',
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
        console.log(res)
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
              wx.getLocation({
                success: res => {
                  console.log(res)
                }
              })
            }
          })
        }
        // wx.login({
        //   success(res) {
        //     if (res.code) {
        //       // 发起网络请求
        //       app.request().post(`${urlPre}/api/code/login`).send({
        //         code: res.code
        //       })
        //       .end().then( ( { body: { data: { token }} } ) => {
        //         // console.log(data)
        //         let originUserInfo = app.userInfo
        //         !originUserInfo.loginInfo && ( originUserInfo.loginInfo = {} )
        //         originUserInfo.loginInfo.token = token
        //         app.userInfo = originUserInfo
        //         console.log(app.userInfo)
        //       })
        //     } else {
        //       console.log('登录失败！' + res.errMsg)
        //     }
        //   }
        // })
      },
      fail(e){
        console.log('eeeee')
      }
    })
    console.log('获取bannerInfo')
    this.getBannerInfo()
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
  getBannerInfo () {
    let self = this
    app.request().get(`${urlPre}/api/code/news/getBannerInfo`)
    .end().then( ( { body: data } ) => {
      console.log(data)
      self.setData({
        banners: data.data
      })
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
        const cloudPath = `code/news/index/news-banner/${(new Date().getTime())}${filePath.match(/\.[^.]+?$/)[0]}`
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: ({ fileID }) => {
            console.log('[上传文件] 成功：')
            // app.globalData.fileID = fileID
            // app.globalData.cloudPath = cloudPath
            // app.globalData.imagePath = filePath
            self.setData({
              upLoadImg: filePath,
              ['bannerObj.fileID']: fileID
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
  bindKeyInput (e) {
    this.setData({
      ['bannerObj.keyWord']: e.detail.value
    })
  },
  bindlinkInput (e) {
    this.setData({
      ['bannerObj.bannerLink']: e.detail.value
    })
  },
  saveBanner () {
    let { bannerObj } = this.data
    console.log(bannerObj)
    // 请求后端 图片直接存储到云 接口做图片与关键字的关联
    // wx.request({
    //   url: `${urlPre}/api/code/common/upLoadImg`,
    //   method: 'POST',
    //   data: JSON.stringify({
    //     bannerObj
    //   }),
    //   success(res) {
    //     console.log(res)
    //   }
    // })
    console.log(app)
    app.request().post(`${urlPre}/api/code/news/addBannerInfo`).send(bannerObj)
    .end().then( ( { body: data } ) => {
      console.log(data)
      this.setData({
        banners: data.data,
        addBanner: false
      })
    })
  },
  preventShut () {
    console.log('防止冒泡')
    // this.setData()
  },
  getPhoneNumber(e) {
    console.log('获取到的手机号')
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
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
