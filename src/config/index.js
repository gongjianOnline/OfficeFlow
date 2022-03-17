
/*
* 环境配置封装
*/
const env = import.meta.env.MODE || "prod";
const EnvConfig = {
  development:{
    baseApi:"/",
    mockApi:"http://www.baidu.com"
  },
  test:{
    baseApi:"/",
    mockApi:"http://www.baidu.com"
  },
  prod:{
    baseApi:"/",
    mockApi:"http://www.baidu.com"
  }
}

export default {
  env,
  mock:true,
  ...EnvConfig[env]
}