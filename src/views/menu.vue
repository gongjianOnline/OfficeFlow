<template>
  <div class="user-manage">
    <div class="query-from">
      <el-form ref="form" :inline="true" :model="queryForm">
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="queryForm.menuName" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="菜单状态" prop="menuState">
          <el-select v-model="queryForm.menuState">
            <el-option :value="1" label="正常"></el-option>
            <el-option :value="2" label="停用"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button type="primary" @click="handleReset('form')"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleAdd(1)">新增</el-button>
      </div>
      <el-table 
        :data="menuList" 
        row-key="_id"
        :tree-props="{children:'children'}">
        <el-table-column
          v-for="item in colums"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="item.formatter"
        />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button
              size="small"
              type="primary"
              @click="handleAdd(2,scope.row)"
            >
              新增</el-button
            >
            <el-button
              size="small"
              type="primary"
              @click="handleEdit(scope.row)"
            >
              编辑</el-button
            >
            <el-button
              size="small"
              type="danger"
              @click="handleDelect(scope.row._id)"
            >
              删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 模态框  -->
    <el-dialog
    v-model="showModal"
    title="新增用户"
    width="60%"
    :show-close="false">
      <el-form ref="dialogForm" 
        :model="menuForm" 
        :rules="rules"
        label-width="120px">
        <el-form-item label="父集菜单" prop="parentId">
          <el-cascader v-model="menuForm.parentId"
            :options="menuList"
            placeholder="请选择父集菜单"
            :props="{ checkStrictly: true, value: '_id', label: 'menuName' }"
            clearable>
          </el-cascader>
        </el-form-item>
        <el-form-item label="菜单类型" prop="menuType">
          <el-radio-group v-model="menuForm.menuType">
            <el-radio :label="1">菜单</el-radio>
            <el-radio :label="2">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单名称" prop="menuName" >
          <el-input v-model="menuForm.menuName" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon" v-show="menuForm.menuType === 1">
          <el-input v-model="menuForm.icon" placeholder="请输入菜单图标"/>
        </el-form-item>
        <el-form-item label="路由地址" prop="path" v-show="menuForm.menuType === 1">
          <el-input v-model="menuForm.path" placeholder="请输入路由地址"/>
        </el-form-item>
        <el-form-item label="权限标识" 
          prop="menuCode"  
          v-show="menuForm.menuType === 2">
          <el-input v-model="menuForm.menuCode" placeholder="请输入权限标识"/>
        </el-form-item>
        <el-form-item label="组件路径" prop="component" v-show="menuForm.menuType === 1">
          <el-input v-model="menuForm.component" placeholder="请输入组件路径"/>
        </el-form-item>
        <el-form-item label="菜单类型" prop="menuState" v-show="menuForm.menuType === 1">
          <el-radio-group v-model="menuForm.menuState">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="2">停用</el-radio>
          </el-radio-group>
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
import utils from "../utils/utils.js";
export default {
  name: "menu",
  data() {
    return {
      queryForm: {
        menuName: "",
        menuState: "",
      },
      menuList: [],
      colums: [
        {
          label: "菜单名称",
          prop: "menuName",
          width: 180,
        },
        {
          label: "图标",
          prop: "icon",
        },
        {
          label: "菜单类型",
          prop: "menuType",
          formatter:(row,column,value)=>{
            return {
              1:"菜单",
              2:"按钮"
            }[value]
          }
        },
        {
          label: "权限标识",
          prop: "menuCode",
        },
        {
          label: "路由地址",
          prop: "path",
        },
        {
          label: "组件路径",
          prop: "component",
        },
        {
          label: "菜单状态",
          prop: "menuState",
          formatter:(row,column,value)=>{
            return {
              1:" 正常",
              2:"停用"
            }[value]
          }
        },
        {
          label: "创建时间",
          prop: "createTime",
          formatter:(row,column,value)=>{
           return utils.formateDate(new Date(value))
          }
        },
      ],
      showModal:false,
      menuForm:{
        parentId:[null],
        menuType:1,
        menuName:"",
        icon:"",
        path:"",
        menuCode:"",
        component:"",
        roleList:"",
        deptId:"",
        menuState:1
      },
      action:"",
      rules:{
        menuName:[
          {required:"true",messae:"请输入菜单名称",trigger:['blur']},
          {min:2,max:10,messae:"长度在2-8个字符",trigger:['blur']},
        ]
      }
    };
  },
  mounted(){
    this.getMenuList()
  },
  methods: {
    // 获取菜单栏列表
    async getMenuList(){
      let response = await this.$request({
        method:"get",
        url:"/menu/list",
        data:this.queryForm
      })
      this.menuList = response
    },
    //查询
    handleQuery() {
      this.getMenuList()
    },
    // 重置
    handleReset(form) {
      this.$refs[form].resetFields()
    },
    // 新增
    handleAdd(type,row) {
      this.showModal = true;
      this.action = "add"
      if(type===2){
        this.menuForm.parentId = [...row.parentId, row._id].filter(
          (item) => item
        );
      }
    },
    // 编辑
    handleEdit(row) {
      this.showModal = true;
      this.action = "edit";
      this.$nextTick(()=>{
        this.menuForm = row
        this.menuForm.parentId = [...row.parentId, row._id].filter(
          (item) => item
        );
      })
    },
    // 删除
    async handleDelect(id) {
      let response = await this.$request({
        method:"post",
        url:"/menu/operate",
        data:{
          id,
          action:"delete"
        }
      })
      this.$message.success("删除成功")
      this.getMenuList()
    },
    // 取消
    handleClose(){
      this.showModal = false;
      this.handleReset("dialogForm")
    },
    // 增加
    handleSubmit(){
      this.$refs.dialogForm.validate(async (vaild)=>{
        if(vaild){
          let {action,menuForm} = this;
          let params = {...menuForm,action}
          let response = await this.$request({
            method:"post",
            url:"/menu/operate",
            data:params
          })
          this.showModal = false;
          this.$message.success("操作成功")
          this.handleReset("dialogForm")
          this.getMenuList()
        }
      })
    },
  },
};
</script>

<style lang="scss" scoped>
.query-from,
.base-table {
  background: #fff;
  padding: 20px;
}
.base-table {
  .action {
    padding-bottom: 20px;
  }
  .pagination {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
}
</style>