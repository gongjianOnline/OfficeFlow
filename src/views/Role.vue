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
        <el-button type="primary" @click="handleAdd(1)">新增</el-button>
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
            <el-button size="small" type="primary">编辑</el-button>
            <el-button size="small" type="primary">设置权限</el-button>
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
        :model="menuForm"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="父集菜单" prop="parentId">
          <el-cascader
            v-model="menuForm.parentId"
            :options="menuList"
            placeholder="请选择父集菜单"
            :props="{ checkStrictly: true, value: '_id', label: 'menuName' }"
            clearable
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="菜单类型" prop="menuType">
          <el-radio-group v-model="menuForm.menuType">
            <el-radio :label="1">菜单</el-radio>
            <el-radio :label="2">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="menuForm.menuName" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item
          label="菜单图标"
          prop="icon"
          v-show="menuForm.menuType === 1"
        >
          <el-input v-model="menuForm.icon" placeholder="请输入菜单图标" />
        </el-form-item>
        <el-form-item
          label="路由地址"
          prop="path"
          v-show="menuForm.menuType === 1"
        >
          <el-input v-model="menuForm.path" placeholder="请输入路由地址" />
        </el-form-item>
        <el-form-item
          label="权限标识"
          prop="menuCode"
          v-show="menuForm.menuType === 2"
        >
          <el-input v-model="menuForm.menuCode" placeholder="请输入权限标识" />
        </el-form-item>
        <el-form-item
          label="组件路径"
          prop="component"
          v-show="menuForm.menuType === 1"
        >
          <el-input v-model="menuForm.component" placeholder="请输入组件路径" />
        </el-form-item>
        <el-form-item
          label="菜单类型"
          prop="menuState"
          v-show="menuForm.menuType === 1"
        >
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
    };
  },
  mounted() {
    this.getRoleList();
  },
  methods: {
    // 获取菜单栏列表
    async getRoleList() {
      let response = await this.$request({
        method: "get",
        url: "/roles/list",
        data: this.queryForm,
      });
      console.log("xxx", response);
      this.RoleList = response.list;
      this.pager.total = response.page.total;
    },
    //查询
    handleQuery() {
      this.getMenuList();
    },
    // 重置
    handleReset(form) {
      this.$refs[form].resetFields();
    },
    // 新增
    handleAdd(type, row) {
      this.showModal = true;
      this.action = "add";
      if (type === 2) {
        this.menuForm.parentId = [...row.parentId, row._id].filter(
          (item) => item
        );
      }
    },
    // 编辑
    handleEdit(row) {
      this.showModal = true;
      this.action = "edit";
      this.$nextTick(() => {
        this.menuForm = row;
        this.menuForm.parentId = [...row.parentId, row._id].filter(
          (item) => item
        );
      });
    },
    // 删除
    async handleDelect(id) {
      let response = await this.$request({
        method: "post",
        url: "/menu/operate",
        data: {
          id,
          action: "delete",
        },
        mock: false,
      });
      this.$message.success("删除成功");
      this.getMenuList();
    },
    // 取消
    handleClose() {
      this.showModal = false;
      this.handleReset("dialogForm");
    },
    // 增加
    handleSubmit() {
      this.$refs.dialogForm.validate(async (vaild) => {
        if (vaild) {
          let { action, menuForm } = this;
          let params = { ...menuForm, action };
          let response = await this.$request({
            method: "post",
            url: "/menu/operate",
            data: params,
            mock: false,
          });
          this.showModal = false;
          this.$message.success("操作成功");
          this.handleReset("dialogForm");
          this.getMenuList();
        }
      });
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