<template>
  <div class="login-wrapper"> 
    <div class="modal">
      <el-form :model="user"
        :rules="rules">
        <div class="title">火星</div>
        <el-form-item class="fromItem" prop="name">
          <el-input type="text"
            clearable
            v-model="user.user"
            placeholder="请输入用户名"
            prefix-icon="Avatar"></el-input>
        </el-form-item>
        <el-form-item class="fromItem" prop="password">
          <el-input type="password"
            clearable 
            v-model="user.password"
            placeholder="请输入密码" 
            show-password
            prefix-icon="Lock"></el-input>
        </el-form-item>
        <el-form-item class="fromItem">
          <el-button type="primary" class="btn-login" @click="handelLogin">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name:"login",
  data(){
    return {
      user:{
        user:"",
        password:"",
      },
      rules:{
        name:[
          {required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        password:[
          {required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  mounted(){
    
  },
  methods:{
    handelLogin(){
      this.$request({
        method:"post",
        url:"/users/login"
      }).then((response)=>{
        this.$store.commit('saveUserInfo',response)
        console.log(response)
      })
    }
  }
}
</script>

<style lang="scss">
  .login-wrapper{
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f9fcff;
    width: 100%;
    height: 100vh;
    .modal{
      width: 500px;
      padding: 50px;
      background: #fff;
      border-radius: 4px;
      box-shadow: 0px 0px 10px 3px #c7c9cb4d;
      .title{
        font-size: 50px;
        line-height: 1.5;
        text-align: center;
        margin-bottom: 30px;
      }
      .btn-login{
        width: 100%;
      }
    }
  }
</style>