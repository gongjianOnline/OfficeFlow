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
    this.$axios({
      method:"get",
      url:"/login"
    }).then((response)=>{
      console.log(response)
    })
  },
  methods:{

  }
}
</script>

<style>

</style>