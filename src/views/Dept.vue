<template>
  <div class="dept-mange">
    <div class="query-form">
      <el-form :inline="true" ref="queryForm" :model="queryForm">
        <el-form-item label="部门名称">
          <el-input 
            placeholder="请输入部门名称"
            v-model="queryForm.deptName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDepList" type="primary">查询</el-button>
          <el-button @click="handleReset('queryForm')">重置</el-button>
        </el-form-item> 
      </el-form>  
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleOpen">创建</el-button>
      </div>
      <el-table
        :data="depList"
        row-key="_id"
        :tree-props="{children:'children'}"
        stripe>
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          v-bind="item"
        ></el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small"
              type="primary"
              @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small"
              type="danger"
              @click="handleDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog 
      :title="action==='create'?'创建部门':'编辑部门'"
      v-model="showModal">
      <el-form ref="dialogForm" 
        :model="deptForm" 
        :rules="rules"
        label-width="120px">
        <el-form-item
          label="上级部门"
          prop="parentId">
          <el-cascader 
            placeholder="请选择上级部门"
            v-model="deptForm.parentId"
            :props="{checkStrictly:true,value:'_id',label:'deptName'}"
            clearable
            :options="depList"
            :show-all-levels="true"></el-cascader>
        </el-form-item>
        <el-form-item label="部门名称" prop="deptName">
          <el-input placeholder="请输入部门名称"
            v-model="deptForm.deptName"></el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="user">
          <el-select placeholder="请选择部门负责人"
            v-model="deptForm.user"
            @change="handleUser">
            <el-option v-for="item in userList"
              :key="item.userId"
              :label="item.userName"
              :value='`${item.userId}/${item.userName}/${item.userEmail}`'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门邮箱" prop="userEmail">
          <el-input 
            placeholder="请输入部门邮箱"
            v-model="deptForm.userEmail"
            disabled></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button @click="handleSubmit" type="primary">确定</el-button>
        </span>
      </template> 
    </el-dialog>
  </div>
</template>
<script>
export default {
  name:"Dept",
  data(){
    return {
      queryForm:{
        // deptName:""
      },
      depList:[],
      columns:[
        {
          label:"部门名称",
          prop:"deptName"
        },
        {
          label:"负责人",
          prop:"userName"
        },
        {
          label:"更新时间",
          prop:'updateTime'
        },
        {
          label:"创建时间",
          prop:"createTime"
        }
      ],
      action:"create",
      showModal:false,
      deptForm:{
        parentId:[null],
        deptName:"",
        user:"",
        userEmail:"",
      },
      rules:{
        parentId:[
          {required:true,message:"请选择上级部门",type:"blur"}
        ],
        deptName:[
          {required:true,message:"请输入部门名称",type:"blur"}
        ],
        user:[
          {required:true,message:"请选择负责人",type:"blur"}
        ]
      },
      userList:[],
    }
  },
  mounted(){
    this.getDepList()
    this.getUserList()
  },
  methods:{
    //获取部门列表
    async getDepList(){
      let response = await this.$request({
        method:"get",
        url:"/dept/list",
        data:{
          ...this.queryForm
        },
        mock:false
      })
      this.depList = response
    },
    // 获取用户列表
    async getUserList(){
      let response = await this.$request({
        method:"get",
        url:'/users/all/list',
        mock:false
      })
      this.userList = response.list
    },
    // 重置表单
    handleReset(form){
      this.$refs[form].resetFields()
    },
    handleUser(val){
      const [userId,userName,userEmail] = val.split("/");
      Object.assign(this.deptForm,{userId,userName,userEmail})
    },
    // 打开创建模态框
    handleOpen(){
      this.action = "create";
      this.showModal = true
    },
    handleEdit(row){
      this.action = "edit";
      this.showModal = true;
      this.$nextTick(()=>{
        Object.assign(this.deptForm,row,{
          user:`${row.userId}/${row.userName}/${row.userEmail}`
        })
      })
    },
    async handleDel(_id){
      this.action = "delete";
      let res = await this.$request({
        method:"post",
        url:"/dept/operate",
        data:{
          _id,
          action:this.action
        },
        mock:false
      })
      this.$message.success("删除成功")
      this.handleClose()
      this.getDepList()
    },
    // 关闭模态框
    handleClose(){
      this.showModal = false;
      this.handleReset("dialogForm")
    },
    // 模态框提交
    handleSubmit(){
      this.$refs.dialogForm.validate(async (valid)=>{
        if(valid){
          let params = {...this.deptForm,action:this.action}
          delete params.user;
          let res = await this.$request({
            method:"post",
            url:"/dept/operate",
            data:params,
            mock:false
          })
          this.showModal = false;
          this.$message.success("操作成功")
          this.handleClose()
          this.getDepList()
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
