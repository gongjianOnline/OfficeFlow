<template>
  <div class="basic-layout">
    <div class="nav-side" :class="[isCollapse?'':'noneSid']">
      <div class="logo">
        <img src="../assets/logo.png" alt="">
        <span>Manager</span>
      </div>
      <el-menu
        default-active="2"
        active-text-color="#ffd04b"
        background-color="#001529"
        class="el-menu-vertical-demo"
        text-color="#fff"
      >
        <TreeMenu :userMenu="userMenu"/>  
      </el-menu>
    </div>
    <div class="content-right" :class="[isCollapse?'':'autoRight']">
      <div class="nav-top">
        <div class="nav-left">
          <div class="menu-fold" @click="toggle">
            <el-icon v-show="isCollapse"><fold /></el-icon>
            <el-icon v-show="!isCollapse"><Expand /></el-icon>
          </div>
          <div class="bread">
            <BreadCrumb/>
          </div>
        </div>
        <div class="nav-right">
          <div class="menu-bell ">
            <el-badge :value="noticeDount" class="item" v-show="noticeDount!==0">
              <el-icon><bell-filled /></el-icon>
            </el-badge>
            <el-icon v-show="noticeDount===0"><bell /></el-icon>
          </div>
          <el-dropdown trigger="click">
            <div class="user">{{userInfo.userName}}</div>
            <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>邮箱: {{userInfo.userEmail}}</el-dropdown-item>
              <el-dropdown-item @click="handelOut">退出</el-dropdown-item>
            </el-dropdown-menu>
          </template>
          </el-dropdown>
          
        </div>
        
        
      </div>
      <div class="wrapper">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import TreeMenu from "../components/TreeMenu.vue"
import BreadCrumb from "../components/BreadCrumb.vue"
export default {
  name:"Home",
  components:{
    TreeMenu,
    BreadCrumb
  },
  data(){
    return{
      isCollapse:true,
      userInfo:this.$store.state.userInfo,
      noticeDount:0,
      userMenu:[]
    }
  },
  mounted(){
    this.gitNoticeCount()
    this.getMenuList()
  },
  methods:{
    toggle(){
      this.isCollapse = !this.isCollapse
    },
    handelOut(){
      this.$router.replace({name:"login"})
    },
    // 获取通知数量
    async gitNoticeCount(){
      let response = await this.$request({
        method:'get',
        url:"/leave/count"
      })
      this.noticeDount = response
    },
    // 获取动态菜单
    async getMenuList(){
      let response = await this.$request({
        url:'/menu/list',
        method:"get",
        data:{}
      })
      this.userMenu = response
    }
  }

}
</script>

<style lang="scss" scoped>
:deep(.el-badge__content){
  top: 10px !important;
}
.basic-layout{
  position: relative;
  .nav-side{
    position: fixed;
    width: 200px;
    height: 100vh;
    background: #001529;
    color:white;
    overflow-y: auto;
    transition: width 0.5s;
    .logo{
      display: flex;
      align-items: center;
      padding: 10px;
      img{
        width: 60px;
      }
      span{
        margin-left: 10px;
        font-size: 26px;
      }
    }
  }
  .noneSid{
    width:0px !important;
    transition: width 0.5s;
  }
  .autoRight{
    margin-left:0px !important;
    transition: margin-left 0.5s;
  }
  .content-right{
    margin-left: 200px;
    transition: margin-left 0.5s;
    .nav-top{
      height: 50px;
      line-height: 50px;
      display: flex;
      justify-content: space-between;
      border: 1px solid #ddd;
      padding: 0 20px;
      .nav-left{
        display: flex;
        align-items: center;
        .menu-fold{
          display: flex;
          align-items: center;
          margin-right: 20px;
        }
      }
      .nav-right{
        display: flex;
        align-items: center;
        .el-badge__content{
          display: flex;
          align-items: center;
        }
        .user{
          margin-left: 20px;
          cursor: pointer;
        }
      }
    }
    .wrapper{
      background: #eef0f3;
      padding: 20px;
      height: calc(100vh - 50px);
    }
  }
}
</style>