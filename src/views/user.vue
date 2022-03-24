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
        <el-button type="primary" @click="handleCreate">新增</el-button>
        <el-button type="danger" @click="handlePatchDele">批量删除</el-button>
      </div>
      <el-table :data="userList"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" 
          width="55"></el-table-column>
        <el-table-column
          v-for="item in colums"
          :key="item.prop"
          :prop="item.prop" 
          :label="item.label" 
          :width="item.width"
          :formatter="item.formatter" />
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

    <!-- 新增模态框 -->
    <el-dialog
    v-model="addUserDialog"
    title="新增用户"
    width="60%">
      <el-form ref="dialogForm" 
        :model="userForm" 
        :rules="rules"
        label-width="120px">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="userForm.userName" />
        </el-form-item>
        <el-form-item label="邮箱" prop="userEmail">
          <el-input v-model="userForm.userEmail" >
            <template #append>@imooc.com</template>
          </el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="userForm.mobile" />
        </el-form-item>
        <el-form-item label="岗位" prop="job">
          <el-input v-model="userForm.job" />
        </el-form-item>
        <el-form-item label="状态" prop="job">
          <el-select v-model="userForm.state">
            <el-option :value="1" label="在职"></el-option>
            <el-option :value="2" label="离职"></el-option>
            <el-option :value="3" label="试用期"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="系统角色" prop="roleList">
          <el-select
            v-model="userForm.roleList"
            placeholder="请选择用户系统角色"
            multiple
            style="width: 100%">
            <el-option label="系统管理员" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="deptId">
          <el-cascader
            v-model="userForm.deptId"
            placeholder="请选择所属部门"
            :options="deptList"
            :props="{ checkStrictly: true, value: '_id', label: 'deptName' }"
            clearable
            style="width: 100%"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
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
        prop:"role",
        formatter:(row,index,value)=>{
          switch(value){
            case "0":
              return "系统管理员"
            default: 
              return "普通用户"
          }
        }
      },
      {
        label:"用户状态",
        prop:"state",
        formatter:(row,index,value)=>{
          switch(value){
            case 1:
              return "在职"
            case 2:
              return "离职"
            default: 
              return "试用期"
          }
        }
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
    // 初始化表格选中状态
    const checkedUserIds = ref([])
    // 初始化新增用户模态框状态
    let addUserDialog = ref(false)
    // 新增用户表单验证
    const rules = reactive({
      userName:[
        {required: true, message: '用户名不能为空', trigger: 'blur'}
      ],
      userEmail:[
        {required: true, message: '邮箱不能为空', trigger: 'blur'},
      ],
      mobile:[
        {required: true, message: '手机号不能为空', trigger: 'blur'},
        {
          pattern: /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/, 
          message: '手机格式不正确', 
          trigger: 'blur'}
      ],
    })
    // 新增用户表单
    const userForm = reactive({
      state:1
    })
    // 所属部门列表
    const deptList = reactive([])
    // 查询事件
    const handleQuery = ()=>{
      getUserList()
    }
    // 重置事件
    const handleReset = ()=>{
      proxy.$refs.form.resetFields()
    }
    // 编辑事件
    const handleEdit = (index,row)=>{
      console.log(row)
    }
    // 删除事件
    const handleDelect = async (index,row)=>{
      await proxy.$request({
        method:"post",
        url:'/users/delete',
        data:{
          userIds:[row.userId]
        }
      })
      proxy.$message.success('删除成功')
      getUserList()
    }
    // 分页事件
    const handelCurrentChange = (current)=>{
      pager.pageNum = current;
      getUserList()
    }
    // 批量删除
    const handlePatchDele = async ()=>{
      if(checkedUserIds.value.length>0){
        let response = await proxy.$request({
          method:"post",
          url:'/users/delete',
          data:{
            userIds:checkedUserIds.value
          }
        })
        if(response.nModified > 0){
          proxy.$message.success("清除成功")
          getUserList()
        }else{
          proxy.$message.error("清除失败")
        }
      }else{
        proxy.$message.error("请选择要删除的数据")
      }
    }
    // 表格批量选择
    const handleSelectionChange = (list)=>{
      const arr = []
      list.map((item,index)=>{
        arr[index] = item.userId
      })
      checkedUserIds.value = arr
    }
    // 新增用户事件
    const handleCreate = ()=>{
      addUserDialog.value = true
    }
    // 新增用户取消按钮
    const handleClose = ()=>{
      proxy.$refs.dialogForm.resetFields();
      addUserDialog.value = false
    }
    // 新增用户确定按钮
    const handleSubmit = ()=>{

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
      checkedUserIds,
      addUserDialog,
      userForm,
      deptList,
      rules,
      handleEdit,
      handleDelect,
      handleQuery,
      handleReset,
      handelCurrentChange,
      handlePatchDele,
      handleSelectionChange,
      handleCreate,
      handleClose,
      handleSubmit
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