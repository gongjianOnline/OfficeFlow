<template>
  <template v-for="(item) in userMenu" :key="item._id">
    <el-sub-menu :index="item.path" >
      <template #title>
        <span>{{item.menuName}}</span>
      </template>
      <el-menu-item 
        v-for="(itemChild) in item.children"
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
};
</script>

<style>
</style>