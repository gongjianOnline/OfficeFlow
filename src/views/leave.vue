<template>
  <div class="user-manage">
    <div class="query-form">
      <el-form ref="form" :inline="true" :model="queryForm">
        <el-form-item label="审批" prop="applyState">
          <el-select v-model="queryForm.applyState">
            <el-option value="" label="全部"></el-option>
            <el-option :value="1" label="待审批"></el-option>
            <el-option :value="2" label="审批中"></el-option>
            <el-option :value="3" label="审批拒绝"></el-option>
            <el-option :value="4" label="审批通过"></el-option>
            <el-option :value="5" label="作废"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handelQuery">查询</el-button>
          <el-button @click="handelRestet('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格 -->
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleCreate">申请休假</el-button>
      </div>
      <el-table :data="applyList">
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="item.formatter">
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button @click="handelEdit(scope.row)"
              size="small">查看</el-button>
            <el-button @click="handelDle(scope.row)"
              size="small">作废</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import {ref,reactive,getCurrentInstance, onMounted} from "vue"
import utils from "../utils/utils"
export default {
  name:"leave",
  setup(){
    // 获取全局上下文
    const {proxy} = getCurrentInstance()
    // 头部表单
    const queryForm = reactive({
      applyState:""
    })
    // 表格数据
    const applyList = ref([])
    // 表头渲染
    const columns = ref([
      {
        label:"单号",
        prop:"orderNo"
      },
      {
        label:"休假时间",
        prop:"",
        formatter:(row)=>{
          return utils.formateDate(new Date(row.startTime),'yyy-MM-dd')
          +"到"+
          utils.formateDate(new Date(row.endTime),'yyy-MM-dd')
        }
      },
      {
        label:"休假时长",
        prop:"leaveTime"
      },
      {
        label:"休假类型",
        prop:"applyType",
        formatter:(row,column,value)  =>{
          return {
            1:"事假",
            2:"调休",
            3:"年假"
          }[value]
        }
      },
      {
        label:"休假原因",
        prop:"reason"
      },
      {
        label:"申请时间",
        prop:"createtime",
        formatter:(row,column,value)=>{
          return utils.formateDate(new Date(value))
        }
      },
      {
        label:"审批人",
        prop:"auditUser"
      },
      {
        label:"当前审批人",
        prop:"curAuditUserName"
      },
      {
        label:"审批状态",
        prop:"aapplyState",
        formatter:(row,column,value)=>{
          return {
            1:"待审核",
            2:'审批中',
            3:'审批拒绝',
            4:'审批通过',
            5:'作废'
          }[value]
        }
      }
    ])
    // 分页属性
    const pager = reactive({
      pageNum:1,
      pageSize:10,
      total:0
    })
    /**挂载的生命周期 */
    onMounted(()=>{
      getApplyList()
    })  
    /**事件处理 */
    // 获取表格数据
    const getApplyList = async ()=>{
      let params = {...queryForm,...pager}
      let response = await proxy.$request({
        method:"get",
        url:"/leave/list",
        data:params,
        mock:true
      })
      applyList.value = response.list;
      pager.total = reaponse.page.total;
    }
    // 查询
    const handelQuery = ()=>{}
    // 重置
    const handelRestet =(formEl)=>{
      proxy.$refs[formEl].resetFields()
    }
    // 新增
    const handleCreate = ()=>{

    }
    // 编辑
    const handelEdit = ()=>{} 
    // 删除
    const handelDle = ()=>{}
    return {
      queryForm,
      applyList,
      columns,
      pager,

      handelQuery,
      handelRestet,
      handleCreate,
      handelEdit,
      handelDle
    }
  }

}
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