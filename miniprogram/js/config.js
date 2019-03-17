// const cloud = require('./cloud');
const apiConfig = require('./api-config');
const def = require('./env-config/default');
// const dev = require('../env-config/develpment');
// const test = require('../env-config/test');
// const staging = require('../env-config/staging');
const prod = require('./env-config/production');
wx.cloud.init()
const debug = false;
let env = apiConfig.getApiEnv() || 'prod';
let _id = '';
let coll;
let cloud = {
  db: wx.cloud.database(),
}

coll = cloud.db.collection('env');
coll.get().then(res => {
  const e = res.data[0];
  if (e && e.env) {
    env = e.env;
    _id = e._id;
  }
  apiConfig.setApiEnv(env)
});

function merge(a, b) {
  const res = {};
  Object.assign(res, a);
  for (let p in b) {
    if (res[p] && res[p].constructor === Object
      && b[p] && b[p].constructor === Object) {
      res[p] = merge(res[p], b[p]);
    } else {
      res[p] = b[p];
    }
  }
  return res;
}

// const devConfig = merge(def, dev);
// const testConfig = merge(def, test);
// const stagingConfig = merge(def, staging);
const prodConfig = merge(def, prod);


function getPropertyByEnv(key) {
  switch (getEnv()) {
    // case 'develpment':
    //   return devConfig[key];
    // case 'test':
    //   return testConfig[key];
    // case 'staging':
    //   return stagingConfig[key];
    case 'prod':
    default:
      return prodConfig[key];
  }
}


function getEnv() {
  if (!debug) {
    return 'prod';
  }
  return env;
}

function setEnv(_env) {
  env = _env;
  if (!debug || !coll) return;
  if (_id) {
    coll.doc(_id).set({ data: { env } })
  } else {
    coll.add({ data: { env } }).then(res => {
      _id = res._id;
    })
  }
}


if (!debug) {
  module.exports = {
    ...prodConfig,
    getEnv,
    setEnv: () => {},
  };
} else {
  module.exports = {
    get host() {
      return getPropertyByEnv('host');
    },
    get proxyhost() {
      return getPropertyByEnv('proxyhost');
    },
    getEnv,
    setEnv,
  }
}
