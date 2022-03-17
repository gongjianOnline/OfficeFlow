import { createApp } from 'vue'
import router from "./router/index"
import ElementPlus from 'element-plus'
import axios from "axios"
import config from "./config/index"
import 'element-plus/dist/index.css'

console.log("获取环境变量",import.meta.env.MODE)
console.log(config)
axios.get(config.mockApi+'/login').then((response)=>{
  console.log(response)
})

import App from './App.vue'

const app = createApp(App)
app.use(router)
app.use(ElementPlus)
app.mount('#app')

