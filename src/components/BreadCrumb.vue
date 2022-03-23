<template>
  <el-breadcrumb separator-icon="ArrowRight">
    <el-breadcrumb-item 
      v-for="(item,index) in breadList"
      :key="index"
      :to="{ path: item.path }">{{item.meta.title}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  name:"BreadCrumb",
  data(){
    return{

    }
  },
  computed:{
    breadList(){
      return this.$route.matched
    }
  },
  mounted(){
  }

}
</script>

<style>

</style>