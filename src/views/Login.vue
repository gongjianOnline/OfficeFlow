<template>
  <div class="login-wrapper"> 
    <div class="modal">
      <el-form>
        <div class="title">火星</div>
        <el-form-item class="fromItem">
          <el-input type="text" 
            placeholder="请输入用户名"
            prefix-icon="Avatar"></el-input>
        </el-form-item>
        <el-form-item class="fromItem">
          <el-input type="password" 
            placeholder="请输入密码" 
            show-password
            prefix-icon="Lock"></el-input>
        </el-form-item>
        <el-form-item class="fromItem">
          <el-button type="primary" class="btn-login">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name:"login",
  mounted(){
    // this.$request({
    //   method:"get",
    //   url:"/login"
    // }).then((response)=>{
    //   console.log(response)
    // })
    this.$request.get("login",{userName:"lilei",pas:"123"}).then((response)=>{
      console.log(response)
    })
  },
  methods:{

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