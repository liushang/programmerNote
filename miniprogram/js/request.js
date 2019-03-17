const config = require('./config');
const MD5 = require('./md5');
// require('./polyfill')

const PROD = 'https://note.l-z-y.space';
const $requestList = []
const $requestLimit = 7
const $requestingMap = {}
let DOMAIN = PROD
// 浏览器端密钥（随机生成的字符串），用于MD5加解密；保证和node server端一致。


module.exports = (method, url, data, header) => {
  const app = getApp()

  if (typeof method === 'object') {
    url = method.url
    data = method.data
    header = method.header
    method = method.method
  }
  let env = 'prod'

  const req = {
    method,
    url,
    header: {
      // 'X-Requested-With': 'codeNote',
      // 'version': app.version
    },
    data: {},
    query: {},
  }


  const def = {
    config(name, value) {
      if (arguments.length === 2) {
        req.options = req.options || {};
        req.options[name] = value;
      } else {
        req.options = name;
      }
      return def;
    },
    header(name, value) {
      if (arguments.length === 2) req.header[name] = value
      else req.header = { ...req.header, ...name }
      return def;
    },
    host(hostname = 'wx') {
      req.url = config.host[hostname] + req.url;
      return def;
    },
    proxyhost(hostname = 'api') {
      req.url = `/hostproxy${req.url}`;
      // this.header('x-host', config.proxyhost[hostname])
      return def;
    },
    proxy(hostname = 'api') {
      req.url = `/proxy${req.url}`;
      // this.header('x-host', config.proxyhost[hostname])
      return def;
    },
    token() {
      this.header('token', app.$user && app.$user.token)
      return def;
    },
    query(name, value) {
      if (arguments.length === 2) req.query[name] = value
      else req.query = { ...req.query, ...name }
      return def
    },
    send(name, value) {
      if (arguments.length === 2) {
        req.data[name] = value;
      } else {
        req.data = name;
      }
      console.log('send')
      console.log(req)
      console.log(def)
      return def;
    },

    end(callback) {
      if (req.options && req.options.key) {
        if ($requestingMap[req.options.key]) return Promise.reject();
        $requestingMap[req.options.key] = true;
      }

      const p = new Promise((accept, reject) => {
        if (!callback) {
          callback = (err, res) => {
            if (err) return reject(err);
            accept(res);
          };
        }
      });


      if (!req.header['content-type']) {
        if (req.method && req.method.toUpperCase() != 'GET') {
          req.header['content-type'] = 'application/x-www-form-urlencoded'
        } else {
          // TODO 会导致请求为'GET'时，content-type= 'multipart/form-data'，会导致某些get请求的后端接口报错
          req.header['content-type'] = 'multipart/form-data'
        }
      }

      function resolveParams(obj, num2str) {
        Object.keys(obj).forEach(key => {
          /**
           * 删除值为undefined的项
           */
          if (typeof obj[key] === 'undefined') {
            if (key.toUpperCase() === 'TOKEN') {
              obj[key] = ''
            } else {
              delete obj[key]
            }
          }
          /**
           * 值中的对象转为json字符串
           */
          if (typeof obj[key] === 'object' && req.header['content-type'] !== 'application/json') {
            try {
              obj[key] = JSON.stringify(obj[key])
            } catch (e) {}
          }

        })
      }
      resolveParams(req.header)
      resolveParams(req.query, true)
      resolveParams(req.data, true)

      if (req.url.indexOf('http')) {
        req.url = config.host.wx + req.url;
      }

      Object.keys(req.query).forEach(name => {
        req.url += ((req.url.includes('?')) ? '&' : '?') + [
          encodeURIComponent(name),
          encodeURIComponent(req.query[name]),
        ].join('=');
      })

      req.timestamp = +new Date();
      req.complete = res => {
        let i = $requestList.indexOf(req);
        $requestList.splice(i, 1);
        for (i = 0; i < $requestList.length; i++) {
          let r = $requestList[i];
          if (r.status === 'pending') {
            wx.request(r);
            delete r.status;
            break;
          }
        }
        res.statusCode = res.statusCode || 0;
        let error = null;
        if (res.errMsg.includes('request:fail')) {
          error = new Error(res.errMsg);
          error.name = 'Network Error';
          error.type = 0x01;
          error.errType = 'networkError';
          error.res = res;
        }
        if (res.errMsg.includes('request:ok')) {
          const statusType = parseInt(res.statusCode / 100, 10);
          if ([4, 5].includes(statusType)) {
            error = new Error(res.errMsg);
            error.name = 'Server Error';
            error.type = 0x02;
            error.errType = 'serverError';
            error.res = res;
          } else if (res.data && res.data.error) {
            error = new Error(res.data.error.message);
            error.name = 'Internal Error';
            error.type = 0x03;
            error.errType = 'otherError';
            error.res = res;
            error.errRes = res.data.error;

            if ([401].includes(res.data.error.code)) {
              app && app.logout()
            }
          } else {
            const currentPage = getCurrentPages().slice(-1)[0]
            currentPage && currentPage.hideErrorPage && typeof currentPage.hideErrorPage === 'function' && currentPage.hideErrorPage();
          }
        }
        if (req.options) {
          if (req.options.loading) {
            wx.hideToast();
          }
          if (req.options.barLoading) {
            wx.hideNavigationBarLoading()
          }
        }
        const response = {
          request: req,
          timestamp: +new Date(),
          header: res.header,
          body: res.data,
          statusCode: parseInt(res.statusCode, 10),
        };
        callback && callback(error, response);
        let category = {};
        if (error) {
          category = {
            logContent: error.message,
            firstCategory: error.name,
            secondCategory: req.url,
          };
        }
        wx.stopPullDownRefresh();
      };
      if (req.options) {
        if (req.options.loading) {
          wx.showToast({
            icon: 'loading',
            title: '加载中...',
            duration: 10000,
          });
        }
        if (req.options.barLoading) {
          wx.showNavigationBarLoading()
        }
      }
      $requestList.push(req);
      if ($requestList.length > $requestLimit) {
        req.status = 'pending';
      } else {
        wx.request(req);
      }
      return p;
    },
    
  };
  ['get', 'post', 'put', 'delete'].forEach(subMethod => {
    def[subMethod] = (() => {
      return subUrl => {
        req.url = req.url || subUrl;
        req.method = (req.method || subMethod).toUpperCase();
        console.log('post请求')
        console.log(req)
        return def;
      }
    })();
  });
  return def;
}
