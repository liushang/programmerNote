const META_DATA = '_';

module.exports = {
  /**
   * [get description]
   * @param  {[type]} key [description]
   * @return {[type]}     [description]
   */
  get(key) {
    if (key) {
      let value = wx.getStorageSync(key)
      if (value && value.expires) {
        if (value.timestamp + (value.expires * 1000) < new Date()) {
          this.remove(key)
          return ''
        }
        value = value.value
      }
      return value
    }
    let storage = wx.getStorageSync(META_DATA) || {}
    return (storage.keys || []).reduce((ret, item) => {
      ret[item] = this.get(item)
      return ret
    }, {})
  },
  /**
   * [set description]
   * @param {[type]} key   [description]
   * @param {[type]} value [description]
   */
  set(key, value, opts) {
    const expires = opts && opts.expires
    let meta = wx.getStorageSync(META_DATA) || {};
    meta.keys = meta.keys || [];
    if (key === null) {
      wx.clearStorage();
      meta.keys = [];
    } else if (key) {
      if (meta.keys.indexOf(key) === -1) {
        meta.keys.push(key);
      }
      if (expires) {
        value = {
          value,
          expires,
          timestamp: +new Date(),
        }
      }
      wx.setStorageSync(key, value);
    } else {
      console.error('storage', 'invalid key ' + key);
      return this;
    }
    meta.timestamp = +new Date();
    wx.setStorageSync(META_DATA, meta);
    return this;
  },
  update(key, value) {
    let valueObj = wx.getStorageSync(key)

    if (valueObj.expires) {
      valueObj.value = value
    } else {
      valueObj = value
    }
    wx.setStorageSync(key, valueObj)

    return this
  },
  remove(key) {
    let meta = wx.getStorageSync(META_DATA)
    meta = meta || {};
    meta.keys = meta.keys || [];

    const index = meta.keys.indexOf(key)
    if (index !== -1) {
      meta.keys.splice(index, 1)
    }
    wx.setStorageSync(META_DATA, meta)

    wx.removeStorageSync && wx.removeStorageSync(key)
  },
  /**
   * 清除过期的存储
   */
  clearOutdate() {
    wx.getStorageInfo({
      success: res => {
        const { keys } = res
        if (Array.isArray(keys)) {
          keys.forEach(key => {
            this.get(key)
          })
        }
      },
    })
  },
}
