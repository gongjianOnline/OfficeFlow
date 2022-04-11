<template>
  <div class="exception">
    <img src="../assets/images/404.jpeg" alt="">
    <el-button @click="handleClick" class="button">回首页</el-button>
  </div>
</template>
<script>
export default{
  name:"404",
  methods:{
    handleClick(){
      this.$router.push("/")
    }
  
  }
}
</script>
<style lang="scss" scoped>
.exception{
  position: relative;
  font-size: 0px;
  img{
    width: 100%;
    height: 100vh;
  }
  .button{
    position: fixed;
    bottom:100px;
    left: 50%;
    margin-left: -34px;
  }
}


</style>