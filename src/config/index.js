
/*
* 环境配置封装
*/
const env = import.meta.env.MODE || "prod";
const EnvConfig = {
  development:{
    baseApi:"/",
    mockApi:"http://192.168.182.128:20080/mock/6232dfc65f93ec000c0ded64"
  },
  test:{
    baseApi:"/",
    mockApi:"http://192.168.182.128:20080/mock/6232dfc65f93ec000c0ded64"
  },
  prod:{
    baseApi:"/",
    mockApi:"http://192.168.182.128:20080/mock/6232dfc65f93ec000c0ded64"
  }
}

export default {
  env,
  mock:true,
  ...EnvConfig[env]
}