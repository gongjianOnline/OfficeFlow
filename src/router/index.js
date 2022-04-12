import {createRouter,createWebHashHistory} from "vue-router"
import storage from "../utils/storage.js"
import request from "../utils/request.js"
import utils from "../utils/utils.js"
import Home from "../components/Home.vue"
import { menuItemEmits } from "element-plus"
const Welcome = ()=>import("../views/Welcome.vue")
const Login = ()=>import("../views/Login.vue")
const User = ()=>import("../views/user.vue")
const Menu = ()=>import("../views/menu.vue")
const Role = ()=>import("../views/Role.vue")
const Dept = ()=>import("../views/Dept.vue")
const ErrorPage = ()=>import("../views/404.vue")

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
    name:"404",
    meta:{
      title:"页面不存在"
    },
    path:"/404",
    component:ErrorPage,
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
      // {
      //   name:"user",
      //   meta:{
      //     title:"用户管理"
      //   },
      //   path:"system/user",
      //   component:User,
      // },
      // {
      //   name:"menu",
      //   meta:{
      //     title:"菜单管理"
      //   },
      //   path:"system/menu",
      //   component:Menu,
      // },
      // {
      //   name:"role",
      //   meta:{
      //     title:"角色管理"
      //   },
      //   path:"system/role",
      //   component:Role,
      // },
      // {
      //   name:"dept",
      //   meta:{
      //     title:"部门管理"
      //   },
      //   path:"system/dept",
      //   component:Dept,
      // },
      
      
    ]
  }
]

const router = createRouter({
  history:createWebHashHistory(),
  routes
})

//路由动态渲染
async function loadAsyncRoutes(){
  const modules = import.meta.glob('../views/*.vue')
  let userInfo = storage.getItem("userInfo") || {};
  if(userInfo.token){
    try {
      let {menuList} = await request({
        url:'/users/getPermissionList',
        method:"get",
        data:{},
        mock:false
      })
      let routes = utils.generateRoute(menuList)
      routes.map((route)=>{
        let url = `../views/${route.component}.vue`
        route.component = modules[url]
        router.addRoute("home",route)
      })
    } catch (error) {}
  }
}
await loadAsyncRoutes()

// 判断路由守卫
function checkPermission(path){
  let hasPermission = router.getRoutes().filter(route=>route.path === path).length;
  if(hasPermission){
    return true
  }else{
    false
  }
}
// 导航守卫
router.beforeEach((to,form,next)=>{
  if(checkPermission(to.path)){
    next()
  }else{
    next("/404")
  }
})



export default router