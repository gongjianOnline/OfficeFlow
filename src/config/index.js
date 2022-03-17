
/*
* 环境配置封装
*/
const env = import.meta.env.MODE || "prod";
const EnvConfig = {
  development:{
    baseApi:"/",
    mockApi:"https://www.fastmock.site/mock/4965a21a9ddd5519b4fae0c67ead20f8/api"
  },
  test:{
    baseApi:"/",
    mockApi:"https://www.fastmock.site/mock/4965a21a9ddd5519b4fae0c67ead20f8/api"
  },
  prod:{
    baseApi:"/",
    mockApi:"https://www.fastmock.site/mock/4965a21a9ddd5519b4fae0c67ead20f8/api"
  }
}

export default {
  env,
  mock:true,
  ...EnvConfig[env]
}