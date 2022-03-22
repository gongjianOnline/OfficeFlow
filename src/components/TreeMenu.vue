<template>
  <template v-for="(item) in userMenu" :key="item._id">
    <el-sub-menu :index="item.path" >
      <template #title>
        <span>{{item.menuName}}</span>
      </template>
      <el-menu-item 
        v-for="(itemChild) in item.children"
        @click="handelClick(itemChild)"
        :key="itemChild._id"
        :index="itemChild.path" >{{itemChild.menuName}}</el-menu-item>
    </el-sub-menu>
  </template>
  
</template>

<script>
export default {
  name: "TreeMeu",
  props: {
    userMenu: {
      type: Array,
      default() {
        return new Array();
      },
    },
  },
  data() {
    return {};
  },
  methods:{
    handelClick(routerData){
      // routerData.path = (routerData.path).substring(1,routerData.path.length-1)
      // let routerUrl = (routerData.path).substring(1,routerData.path.length-1)
      console.log(routerData.path)
      this.$router.push({path:routerData.path})
    }
  }
};
</script>

<style>
</style>