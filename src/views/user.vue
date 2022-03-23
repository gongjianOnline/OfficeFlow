<template>
  <div class="user-manage">
    <div class="query-from">
      <el-form :inline="true" :model="user">
        <el-form-item label="用户ID">
          <el-input 
            v-model="user.userId" 
            placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="用户名称">
          <el-input 
            v-model="user.userName" 
            placeholder="请输入用户名称" />
        </el-form-item>
        <el-form-item label="用户状态">
          <el-select v-model="user.state" 
            placeholder="Activity zone">
            <el-option label="所有" :value="0" />
            <el-option label="在职" :value="1" />
            <el-option label="离职" :value="2" />
            <el-option label="试用期" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">查询</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary">新增</el-button>
        <el-button type="danger">批量删除</el-button>
      </div>
      <el-table :data="userList">
        <el-table-column type="selection" 
          width="55"></el-table-column>
        <el-table-column 
          v-for="item in colums"
          :key="item.prop"
          :prop="item.prop" 
          :label="item.label" 
          :width="item.width" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small"
              type="primary"
              @click="handleEdit(scope.$index, scope.row)">
              编辑</el-button>
            <el-button size="small"
              type="danger"
              @click="handleDelect(scope.$index, scope.row)">
              删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import {onMounted,reactive,ref} from "vue"
export default{
  name:"user",
  setup(){
    const user = reactive({
      userId:"",
      userName:"",
      state:""
    })
    const userList = ref([
      {
        userId:"111",
        userName:"111",
        userEmail:"111",
        role:"111",
        state:"111",
        createTime:"111",
        lastLogonTime:"111",
      }
    ]);
    const colums = reactive([
      {
        label:"用户ID",
        prop:"userId"
      },
      {
        label:"用户名称",
        prop:"userName"
      },
      {
        label:"用户邮箱",
        prop:"userEmail"
      },
      {
        label:"用户角色",
        prop:"role"
      },
      {
        label:"用户状态",
        prop:"state"
      },
      {
        label:"注册时间",
        prop:"createTime"
      },{
        label:"最后登录时间",
        prop:"lastLogonTime"
      },
    ])
    const handleEdit = (index,row)=>{
      console.log(row)
    }
    const handleDelect = (index,row)=>{
      console.log(row)
    }
    onMounted(()=>{
      console.log("mounted")
    })
    return {
      user,
      userList,
      colums,
      handleEdit,
      handleDelect} 
  }
}
</script>

<style lang="scss" scoped>
  .query-from,
  .base-table{
    background: #fff;
    padding: 20px;
  }
  .base-table{
    .action{
      padding-bottom: 20px;
    }
  }
</style>