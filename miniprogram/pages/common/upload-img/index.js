Component({
    properties: {
      path: {
        type: String,
      },
      custom: {
        type: String,
      }
    },
    lifetimes: {
      attached() {
        console.log(this.data.custom)
      },
    },
    data: {
    },
    methods: {
        upLoadImage () {
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
                const cloudPath = `${self.data.path}/${(new Date().getTime())}${filePath.match(/\.[^.]+?$/)[0]}`
                wx.cloud.uploadFile({
                  cloudPath,
                  filePath,
                  success: ({ fileID }) => {
                    console.log('[上传文件] 成功：')
                    // app.globalData.fileID = fileID
                    // app.globalData.cloudPath = cloudPath
                    // app.globalData.imagePath = filePath
                    
                    // self.setData({
                    //   upLoadImg: filePath,
                    //   ['bannerObj.fileID']: fileID
                    // })
                    console.log(fileID)
                    self.triggerEvent('showFilePath', { filePath, fileID, custom: self.data.custom });
        
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
    },
  })
  