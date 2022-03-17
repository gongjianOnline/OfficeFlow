<template>
  <div> 
    Login page
    <el-button @click="goHome">回首页</el-button>
  </div>
</template>

<script setup>
import {useRouter} from "vue-router"
const router = useRouter()
const goHome = ()=>{
  router.push("/welcome")
}
</script>

<style>

</style>