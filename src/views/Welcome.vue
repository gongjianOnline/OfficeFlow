<template>
  <div class="welcome"> 
    <div class="content">
      <div class="sub-title">欢迎体验</div>
      <div class="title">工作流后台管理管理系统</div>
      <div class="desc">- Vue3.0+ElementPlus+Mongo打造通用后台管理系统</div>
    </div>
    <div class="img"></div>
  </div>
</template>

<script>
export default {
  name:"welcome",
  data(){
    return {

    }
  },
  mounted(){
    
  }
}
</script>

<style lang="scss">
.welcome{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  .content{
    position: relative;
    bottom:40px;
    .sub-title{
      font-size: 30px;
      line-height: 42px;
      color:#333;
    }
    .title{
      font-size: 40px;
      line-height: 62px;
      color:#409EFF;
    }
    .desc{
      text-align: right;
      font-size: 14px;
      color:#999;
      margin-top: 10px;
    }
  }
  .img{
    width: 371px;
    height: 438px;
    background-image: url('../assets/images/welcome.png');
    margin-left: 105px;
  }
}
</style>