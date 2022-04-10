import { createApp } from 'vue'
import router from "./router/index"
import ElementPlus from 'element-plus'
import * as ElIcons from '@element-plus/icons'
import request from "./utils/request"
import storage from './utils/storage'
import 'element-plus/dist/index.css'
import App from './App.vue'
import store from './store'

const app = createApp(App)
//使用elementPlus图标
for(const name in ElIcons){
  app.component(name,ElIcons[name])
}

app.config.globalProperties.$request = request 
app.config.globalProperties.$storage = storage

// 全局指令
app.directive("has",{
  beforeMount:(el,binding)=>{
    console.log(el,binding)
    // 获取按钮权限
    let actionList = storage.getItem("actionList")
    let value = binging.value;
    // 判断列表中是否有对应按钮权限
    let hasPermission = actionList.includes(value)
    if(!hasPermission){
      el.style = "display:none";
      setTimeout(()=>{
        el.parentNode.removeChild(el);
      },0)
    }
  }
})

app.use(router)
app.use(ElementPlus)
app.use(store)
app.mount('#app')

