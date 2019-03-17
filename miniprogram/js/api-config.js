const store = require('./store')

const KEY = 'apiEnv'

// let _apiEnv = store.get(KEY) || 'prod'
let _apiEnv = 'prod'

const apiConfig = module.exports = {
  getApiEnv() {
    return _apiEnv
  },
  setApiEnv(env) {
    _apiEnv = env
    store.set(KEY, env)
  },
  isProd() {
    const app = getApp();
    if (!app.$debug) return true;
    return _apiEnv === 'prod'
  },
  toggleEnv() {
    _apiEnv === 'staging' ? this.setApiEnv('prod') : this.setApiEnv('staging')
    return _apiEnv
  },

  //获取api前缀地址
  //projectName: 项目名称
  getApiUrl(projectName) {

    const apiProd = 'http://note.l-z-y.space';

    let env = 'prod'
    try {
      env = getApp().$debug ? apiConfig.getApiEnv() : 'prod'
    } catch (e) { }

    if (projectName === 'prepay') { //影片预付项目
      return env === 'prod' ? prepayProd : (env === 'staging' ? prepayStaging : prepayTest);
    } else if (projectName === 'fission') { //裂变红包项目
      return env === 'prod' ? fissionProd : (env === 'staging' ? fissionStaging : fissionTest);
    } else if (projectName === 'cinema') { //影院购票页x-host
      return env === 'prod' ? xhostProd : xhostStaging;
    } else { //用户体系，专享活动，评论短评、用户成就等)
      return env === 'prod' ? apiProd : (env === 'staging' ? apiStaging : apiTest);
    }
  },

  // 获取不同环境的api
  getApiUrl_env(env) {
    const api = {
      test: 'http://api.be.avatar.movie.test.sankuai.com/api/sns',
      staging: 'http://api.be.movie.st.sankuai.com/api/sns',
      prod: 'https://api.maoyan.com/sns',
    };

    return api[env];
  }
}
