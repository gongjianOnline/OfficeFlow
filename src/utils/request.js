/**
 * axios 二次封装
 */
import axios from "axios"
import config from "../config/index"
import {ElMessage} from "element-plus"
import router from "./../router/index"
import storage from "./storage"
const TOKEN_INVALID = "Token认证失败，请重新登录"
const NETWORK_ERROR = "网络请求异常，请稍后充实"

// axios实力对象，添加全局配置
const service = axios.create({
  baseURL:config.baseApi,
  timeout:8000,
})
//请求拦截
service.interceptors.request.use((req)=>{
  // TO-DO
  const headers = req.headers;
  if(!headers.Authorization){
    headers.Authorization = (storage.getItem("userInfo"))?"Bearer "+storage.getItem("userInfo").token:""
  }
  return req;
})

// 响应拦截
service.interceptors.response.use((res)=>{
  const {code,data,msg} = res.data;
  if(code === 200){
    return data 
  } else if (code === 50001){
    ElMessage.error(TOKEN_INVALID)
    setTimeout(()=>{
      router.replace({name:"login"})
    },3000)
    return Promise.reject(TOKEN_INVALID)
  }else{
    ElMessage.error(msg || NETWORK_ERROR)
    return Promise.reject(msg || NETWORK_ERROR)
  }
})

/**
 * 请求核心函数
 */
function request(options){
  options.method = options.method || 'get'
  if(options.method.toLowerCase() === 'get'){
    options.params = options.data;
  }
  // console.log("---",config.env)
  if(config.env === 'prod'){
    service.defaults.baseURL = config.baseApi
  }else{
    if(options.mock === false){
      service.defaults.baseURL = config.baseApi
    }else{
      service.defaults.baseURL = config.mock?config.mockApi:config.baseApi
    }
    
  }
  return service(options)
}

['get',"post","put","delete","patch"].forEach((item)=>{
  request[item] = (url,data,options)=>{
    return request({
      url,
      data,
      method:item,
      ...options
    })
  }
})
export default request
