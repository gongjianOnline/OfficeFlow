
/*
* 环境配置封装
*/
const env = import.meta.env.MODE || "prod";
const EnvConfig = {
  development:{
    baseApi:"/api",
    mockApi:"https://www.fastmock.site/mock/4965a21a9ddd5519b4fae0c67ead20f8/api"
  },
  test:{
    baseApi:"/api",
    mockApi:"https://www.fastmock.site/mock/4965a21a9ddd5519b4fae0c67ead20f8/api"
  },
  prod:{
    baseApi:"/api",
    mockApi:"https://www.fastmock.site/mock/4965a21a9ddd5519b4fae0c67ead20f8/api"
  }
}

export default {
  env,
  mock:false,
  namespace:"namespace",
  ...EnvConfig[env]
}