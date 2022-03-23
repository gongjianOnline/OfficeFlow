<template>
  <div class="user-manage">
    <div class="query-from">
      <el-form  ref="form" :inline="true" :model="user">
        <el-form-item label="用户ID" prop="userId">
          <el-input 
            v-model="user.userId" 
            placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="用户名称" prop="userName">
          <el-input 
            v-model="user.userName" 
            placeholder="请输入用户名称" />
        </el-form-item>
        <el-form-item label="用户状态" prop="state">
          <el-select v-model="user.state" 
            placeholder="请选择用户状态">
            <el-option label="所有" :value="0" />
            <el-option label="在职" :value="1" />
            <el-option label="离职" :value="2" />
            <el-option label="试用期" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
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
        <el-table-column label="操作" width="180">
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
      <div class="pagination"> 
        <el-pagination background 
          :page-size="pager.pageSize"
          @current-change="handelCurrentChange"
          layout="prev, pager, next" 
          :total="pager.total" />
      </div>
    </div>
  </div>
</template>

<script>
import {getCurrentInstance, onMounted,reactive,ref} from "vue"
export default{
  name:"user",
  setup(){
    // 获取 composition APi 全局上下文对象
    const {proxy} = getCurrentInstance()
    // 初始化用户表单对象
    const user = reactive({
      userId:"",
      userName:"",
      state:0
    })
    // 初始化用户列表数据
    const userList = ref([]);
    // 初始化动态表头格式
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
        prop:"userEmail",
        width:180
      },
      {
        label:"用户角色",
        prop:"role"
      },
      {
        label:"用户状态",
        prop:"state",
      },
      {
        label:"注册时间",
        prop:"createTime",
        width:210
      },{
        label:"最后登录时间",
        prop:"lastLoginTime",
        width:210
      },
    ])
    // 初始化分页对象
    const pager = reactive({
      pageNum:1,
      pageSize:10
    })
    // 查询事件
    const handleQuery = ()=>{
      getUserList()
    }
    // 重置事件
    const handleReset = ()=>{
      console.log(1111,)
      proxy.$refs.form.resetFields()
    }
    // 编辑事件
    const handleEdit = (index,row)=>{
      console.log(row)
    }
    // 删除事件
    const handleDelect = (index,row)=>{
      console.log(row)
    }
    // 分页事件
    const handelCurrentChange = (current)=>{
      pager.pageNum = current;
      getUserList()
    }
    onMounted(()=>{
      getUserList()
    })
    // 获取用户列表接口
    const getUserList = async ()=>{
      let params = {...user,...pager}
      let response = await proxy.$request({
        method:"get",
        url:"/users/all/list",
        data:params
      })
      userList.value = response.list;
      pager.total = response.page.total
    }

    return {
      user,
      userList,
      colums,
      pager,
      handleEdit,
      handleDelect,
      handleQuery,
      handleReset,
      handelCurrentChange
    } 
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
    .pagination{
      display: flex;
      justify-content: center;
      margin-top: 20px;
    }
  }
</style>