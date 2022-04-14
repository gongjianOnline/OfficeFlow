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
            <el-button @click="handelDetail(scope.row)"
              size="small">查看</el-button>
            <el-button
              type="danger"
              @click="handelDle(scope.row._id)"
              v-if="[1,2].includes(scope.row.applyState)"
              size="small">作废</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 申请休假模态框 -->
    <el-dialog title="休假申请"
      v-model="showModal"
      width="70%">
      <el-form ref="dialogForm" 
        :rules="rules"
        :model="leaveForm" 
        label-width="120px">
        <el-form-item label="休假类型" 
          prop="applyType" 
          required>
          <el-select v-model="leaveForm.applyType">
            <el-option label="事假" :value="1"></el-option>
            <el-option label="调休" :value="2"></el-option>
            <el-option label="年假" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="休假时间" 
              required>
          <el-row>
            <el-col :span="8">
              <el-form-item
                prop="startTime">
                <el-date-picker
                  v-model="leaveForm.startTime"
                  type="date"
                  placeholder="选择开始日期"
                  @change="(val)=>handleDateChange('startTime',val)"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="1">-</el-col>
            <el-col :span="8">
              <el-form-item
              prop="endTime"
              required>
                <el-date-picker
                  v-model="leaveForm.endTime"
                  type="date"
                  placeholder="选择结束日期"
                  @change="(val)=>handleDateChange('startTime',val)"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="休假时长">  
          {{leaveForm.leaveTime}}
        </el-form-item>
        <el-form-item label="休假原因" prop="reasons">
          <el-input 
            type="textarea"
            :row="3"
            placeholder="请输入请假原因"
            v-model="leaveForm.reasons"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose('dialogForm')">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 查看审批 -->
    <el-dialog
      title="申请休假详情"
      width="50%"
      v-model="showDetailModal"
      destroy-on-close>
        <el-steps 
          :active="detail.applyState>2?3:detail.applyState" 
          align-center>
          <el-step title="待审批"></el-step>
          <el-step title="审批中"></el-step>
          <el-step title="审批通过/拒绝"></el-step>
        </el-steps>
        <el-form label-width="120px" label-suffix=":">
          <el-form-item label="休假类型">
            <div>{{detail.applyTypeName}}</div>
          </el-form-item>
          <el-form-item label="休假时间">
            <div>{{detail.time}}</div>
          </el-form-item>
          <el-form-item label="休假时长">
            <div>{{detail.leaveTime}}</div>
          </el-form-item>
          <el-form-item label="休假原因">
            <div>{{detail.reasons}}</div>
          </el-form-item>
          <el-form-item label="审批状态">
            <div>{{detail.applyStateName}}</div>
          </el-form-item>
          <el-form-item label="审批人">
            <div>{{detail.curAuditUserName}}</div>
          </el-form-item>
        </el-form>
    </el-dialog>

  </div>
</template>

<script>
import { Key } from "@element-plus/icons"
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
        prop:"reasons"
      },
      {
        label:"申请时间",
        prop:"createTime",
        formatter:(row,column,value)=>{
          return utils.formateDate(new Date(value))
        }
      },
      {
        label:"审批人",
        prop:"auditUsers"
      },
      {
        label:"当前审批人",
        prop:"curAuditUserName"
      },
      {
        label:"审批状态",
        prop:"applyState",
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
    /**弹框表单 */
    const showModal = ref(false)
    const action = ref("create")
    // 申请列表
    const leaveForm = reactive({
      applyType:1,
      startTime:"",
      endTime:"",
      leaveTime:"0天",
      reasons:""
    })
    const rules = reactive({
      applyType:[
        { required: true, message: "请选择请假类型", trigger: "blur" },
      ],
      startTime:[
        { required: true, message: "请选择开始时间", trigger: "blur" },
      ],
      endTime:[
        { required: true, message: "请选择开始时间", trigger: "blur" },
      ],
      reasons:[
        { required: true, message: "请填写请假原因", trigger: "blur" },
      ],

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
        mock:false
      })
      applyList.value = response.list;
      pager.total = response.page.total;
    }
    // 查询
    const handelQuery = ()=>{}
    // 重置
    const handelRestet =(formEl)=>{
      proxy.$refs[formEl].resetFields()
    }
    // 显示弹窗
    const handleCreate = ()=>{
      showModal.value = true
      action.value = "create"
    }
    //取消
    const handleClose = (formEl)=>{
      showModal.value = false
      handelRestet(formEl)
    }
    // 提交
    const handleSubmit = ()=>{
      proxy.$refs.dialogForm.validate(async (valid)=>{
        if(valid){
          let parmas = {...leaveForm,action:action.value}
          let response = await proxy.$request({
            method:'post',
            url:'/leave/operate',
            data:parmas
          })
          proxy.$message.success("操作成功"),
          handleClose('dialogForm')
          getApplyList()
        }
      })
      

    }
    // 查看
    const handelDetail = (row)=>{
      showDetailModal.value = true;
      let data = {...row}
      data.applyTypeName = {
        1:"事假",
        2:"调休",
        3:"年假"
      }[data.applyType]
      data.time = (
        utils.formateDate(new Date(row.startTime),'yyy-MM-dd')
          +"到"+
        utils.formateDate(new Date(row.endTime),'yyy-MM-dd')
      )
      data.applyStateName = {
        1:'待审批',
        2:'审批中',
        3:'审批拒绝',
        4:'审批通过',
        5:'作废'
      }[data.applyState]
      detail.value = data;
    } 
    // 删除
    const handelDle = async (_id)=>{
      let params = {_id,action:"delete"}
      let response = await proxy.$request({
        method:"post",
        url:'/leave/operate',
        data:params
      })
      proxy.$message.success("删除成功")
      getApplyList()
    }

    /*时间定制化*/
    const handleDateChange = (key,val)=>{
      let {startTime,endTime} = leaveForm;
      if(!startTime || !endTime)return;
      if(startTime > endTime){
        proxy.$message.error("开始日期不能晚于结束日期")
        leaveForm.leaveTime = "0天"
        setTimeout(()=>{
          leaveForm[key] = ""
        },0)
      }else{
        leaveForm.leaveTime = ((endTime-startTime)/(24*60*60*1000)+1)+"天"
      }

      
    }

    /**查看申请状态模态框 */
    const showDetailModal = ref(false)
    const detail = ref({})
    return {
      queryForm,
      applyList,
      columns,
      pager,
      leaveForm,
      showModal,
      rules,
      showDetailModal,
      detail,

      handelQuery,
      handelRestet,
      handleCreate,
      handelDetail,
      handelDle,
      handleClose,
      handleSubmit,
      handleDateChange,
      
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