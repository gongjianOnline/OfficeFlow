import {createRouter,createWebHashHistory} from "vue-router"
import Home from "../components/Home.vue"
const Welcome = ()=>import("../views/Welcome.vue")
const Login = ()=>import("../views/Login.vue")
const User = ()=>import("../views/user.vue")

const routes = [
  {
    name:"login",
    meta:{
      title:"登录"
    },
    path:"/login",
    component:Login,
  },
  {
    name:"home",
    path:"/",
    meta:{
      title:"首页"
    },
    component:Home,
    redirect:"/welcome",
    children:[
      {
        name:"welcome",
        meta:{
          title:"欢迎页"
        },
        path:"welcome",
        component:Welcome,
      },
      {
        name:"user",
        meta:{
          title:"用户管理"
        },
        path:"system/user",
        component:User,
      },
      
    ]
  }
]

const router = createRouter({
  history:createWebHashHistory(),
  routes
})

export default router