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
        <el-button type="primary" @click="handelAdd">新增</el-button>
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
              @click="handleAdd(scope.$index, scope.row)"
            >
              新增</el-button
            >
            <el-button
              size="small"
              type="primary"
              @click="handleEdit(scope.$index, scope.row)"
            >
              编辑</el-button
            >
            <el-button
              size="small"
              type="danger"
              @click="handleDelect(scope.$index, scope.row)"
            >
              删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
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
      console.log("菜单列表",response)
      this.menuList = response
    },
    //查询
    handleQuery() {},
    // 重置
    handleReset() {},
    // 新增
    handleAdd() {},
    // 编辑
    handleEdit() {},
    // 删除
    handleDelect() {},
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