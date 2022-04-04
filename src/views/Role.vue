<template>
  <div class="role-manage">
    <div class="query-from">
      <el-form ref="form" :inline="true" :model="queryForm">
        <el-form-item label="角色名称" prop="menuName">
          <el-input v-model="queryForm.roleName" placeholder="请输入菜单名称" />
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
        <el-button type="primary" @click="handleAdd()">创建</el-button>
      </div>
      <el-table
        :data="RoleList"
        row-key="_id"
        :tree-props="{ children: 'children' }"
      >
        <el-table-column
          v-for="item in colums"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="item.formatter"
        />
        <el-table-column label="操作" width="280">
          <template #default="scope">
            <el-button
              size="small"
              type="primary"
              @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button size="small" type="primary" @click="handleOpenPermission(scope.row)">设置权限</el-button>
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
      <div class="pagination">
        <el-pagination
          background
          :page-size="pager.pageSize"
          @current-change="handelCurrentChange"
          layout="prev, pager, next"
          :total="pager.total"
        />
      </div>
    </div>

    <!-- 模态框  -->
    <el-dialog
      v-model="showModal"
      title="新增用户"
      width="60%"
      :show-close="false"
    >
      <el-form
        ref="dialogForm"
        :model="roleForm"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="父集菜单" prop="roleName">
          <el-input
            v-model="roleForm.roleName"
            placeholder="请输入角色名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            :row="2"
            v-model="roleForm.remark"
            placeholder="请输入备注"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 权限表单 -->
    <el-dialog
      v-model="showPermission"
      title="权限设置"
      width="60%"
      :show-close="false"
    >
      <el-form label-width="120px">
        <el-form-item label="角色名称" >
          {{curRoleName}}
        </el-form-item>
        <el-form-item label="选择权限">
          <el-tree
            ref="permissionTree"
            :data="menuList"
            :props="props"
            node-key="_id"
            default-expand-all
            show-checkbox
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showPermission=false">取 消</el-button>
          <el-button type="primary" @click="handlePermisstionSubmit">确 定</el-button>
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
        roleName: "",
      },
      RoleList: [],
      pager: {
        total: 0,
        pageSize: 10,
      },
      colums: [
        {
          label: "角色名称",
          prop: "roleName",
        },
        {
          label: "备注",
          prop: "remark",
        },
        {
          label: "权限列表",
          prop: "menuType",
        },
        {
          label: "创建时间",
          prop: "createTime",
          formatter: (row, column, value) => {
            return utils.formateDate(new Date(value));
          },
        },
      ],
      showModal: false,
      roleForm: {
        roleName: "",
        remark: "",
      },
      rules: {
        roleName: [{ required: true, message: "请输入角色名称" }],
      },
      action: "edit",
      // 权限展示
      showPermission:false,
      curRoleId:"",
      curRoleName:"",
      menuList:[],
      props:{
        children: 'children',
        label: 'menuName',
      }
    };
  },
  mounted() {
    this.getRoleList();
    this.getMenuList()
  },
  methods: {
    // 获取角色列表
    async getRoleList() {
      let response = await this.$request({
        method: "get",
        url: "/roles/list",
        data: this.queryForm,
      });
      this.RoleList = response.list;
      this.pager.total = response.page.total;
    },
    // 获取菜单列表
    async getMenuList(){
      let response = await this.$request({
        method:"get",
        url:"/menu/list",
        data:this.queryForm,
        mock:true
      })
      this.menuList = response
    },  
    //查询
    handleQuery() {
      this.getMenuList();
    },
    // 重置
    handleReset(form) {
      this.$refs[form].resetFields();
    },
    // 创建
    async handleAdd() {
      this.showModal = true;
      this.action = "create";
    },
    // 编辑
    handleEdit(row) {
      this.action = "edit";
      this.showModal = true;
      this.$nextTick(() => {
        this.roleForm = row;
      });
    },
    // 删除
    async handleDelect(id) {
      let response = await this.$request({
        method: "post",
        url: "/roles/operate",
        data: {
          id,
          action:"delete"
        },
      });
      if (response) {
        this.$message.success("删除成功成功");
        this.getRoleList();
      }
    },
    // 取消
    handleClose() {
      this.showModal = false;
      this.handleReset("dialogForm");
    },
    // 模态框提交
    handleSubmit() {
      this.$refs.dialogForm.validate(async (vaild) => {
        if (vaild) {
          let { action, roleForm } = this;
          let params = { action, ...roleForm };
          let response = await this.$request({
            method: "post",
            url: "/roles/operate",
            data: params,
          });
          if (response) {
            this.showModal = false;
            this.$message.success("创建成功");
            this.handleReset("dialogForm");
            this.getRoleList();
          }
        }
      });
    },
    // 分页时事件
    handelCurrentChange() {},
    // 设置权限弹窗
    handleOpenPermission(row){
      this.showPermission = true;
      this.curRoleId = row._id;
      this.curRoleName = row.roleName;
      let {checkedKeys} = row.permissionList;
      setTimeout(()=>{
        this.$refs.permissionTree.setCheckedKeys(checkedKeys)
      },0)
    },
    // 权限弹窗提交
    async handlePermisstionSubmit(){
      let nodes = this.$refs.permissionTree.getCheckedNodes();
      let halfKeys = this.$refs.permissionTree.getHalfCheckedKeys();
      let checkedKeys = [];
      let parentKeys = [];
      nodes.map((node)=>{
        if(!node.children){
          checkedKeys.push(node._id)
        }else{
          parentKeys.push(node._id)
        }
      })
      let params = {
        _id:this.curRoleId,
        permissionList:{
          checkedKeys:[],
          halfCheckedKeys:parentKeys.concat(halfKeys)
        }
      }
      let response = await this.$request({
        method:"post",
        url:'/roles/update/permission',
        data:params
      })
      this.showPermission = false;
      this.$message.success("操作成功")
      this.getRoleList()
    }

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