<template>
  <div> 
    Login page
    <el-button @click="goHome">回首页</el-button>
  </div>
</template>

<script>
export default {
  name:"login",
  mounted(){
    // this.$request({
    //   method:"get",
    //   url:"/login"
    // }).then((response)=>{
    //   console.log(response)
    // })
    this.$request.get("login",{userName:"lilei",pas:"123"}).then((response)=>{
      console.log(response)
    })
  },
  methods:{

  }
}
</script>

<style>

</style>