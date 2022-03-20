import { createApp } from 'vue'
import router from "./router/index"
import ElementPlus from 'element-plus'
import * as ElIcons from '@element-plus/icons'
import request from "./utils/request"
import storage from './utils/storage'
import 'element-plus/dist/index.css'
import App from './App.vue'

const app = createApp(App)
//使用elementPlus图标
for(const name in ElIcons){
  app.component(name,ElIcons[name])
}

app.config.globalProperties.$request = request
app.config.globalProperties.$storage = storage

app.use(router)
app.use(ElementPlus)
app.mount('#app')

