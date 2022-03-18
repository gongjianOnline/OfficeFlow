<template>
  <div class="basic-layout">
    <div class="nav-side"></div>
    <div class="content-right">
      <div class="nav-top">
        <div class="bread">面包屑</div>
        <div class="user">用户</div>
      </div>
      <div class="wrapper">
        <router-view class="main-page"></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss">
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
  }
  .content-right{
    margin-left: 200px;
    .nav-top{
      height: 50px;
      line-height: 50px;
      display: flex;
      justify-content: space-between;
      border: 1px solid #ddd;
      padding: 0 20px;
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