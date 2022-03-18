import { createApp } from 'vue'
import router from "./router/index"
import ElementPlus from 'element-plus'
import request from "./utils/request"
import storage from './utils/storage'
import 'element-plus/dist/index.css'
import App from './App.vue'

const app = createApp(App)

app.config.globalProperties.$request = request
app.config.globalProperties.$storage = storage

app.use(router)
app.use(ElementPlus)
app.mount('#app')

