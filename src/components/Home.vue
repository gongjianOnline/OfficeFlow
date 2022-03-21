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
        <el-sub-menu index="1">
          <template #title>
            <span>系统管理</span>
          </template>
          <el-menu-item index="1-1">用户管理</el-menu-item>
          <el-menu-item index="1-2">菜单管理</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="2">
          <template #title>
            <span>审批管理</span>
          </template>
          <el-menu-item index="2-1">休假管理</el-menu-item>
          <el-menu-item index="2-2">代我审批</el-menu-item>
        </el-sub-menu>

      </el-menu>
    </div>
    <div class="content-right" :class="[isCollapse?'':'autoRight']">
      <div class="nav-top">
        <div class="nav-left">
          <div class="menu-fold" @click="toggle">
            <el-icon v-show="isCollapse"><fold /></el-icon>
            <el-icon v-show="!isCollapse"><Expand /></el-icon>
          </div>
          <div class="bread">面包屑</div>
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
        <router-view class="main-page"></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name:"Home",
  data(){
    return{
      isCollapse:true,
      userInfo:this.$store.state.userInfo,
      noticeDount:0,
    }
  },
  mounted(){
    this.gitNoticeCount()
  },
  methods:{
    toggle(){
      console.log("123")
      this.isCollapse = !this.isCollapse
    },
    handelOut(){
      this.$router.replace({name:"login"})
    },
    async gitNoticeCount(){
      let response = await this.$request({
        method:'get',
        url:"/leave/count"
      })
      this.noticeDount = response
    }
  }

}
</script>

<style lang="scss" scoped>
.nav-right::v-deep .el-badge__content{
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
      .main-page{
        background: #fff;
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>