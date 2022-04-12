<template>
  <div class="login-wrapper">
    <div class="modal">
      <el-form :model="user" :rules="rules">
        <div class="title">火星</div>
        <el-form-item class="fromItem" prop="user">
          <el-input
            type="text"
            clearable
            v-model="user.user"
            placeholder="请输入用户名"
            prefix-icon="Avatar"
          ></el-input>
        </el-form-item>
        <el-form-item class="fromItem" prop="password">
          <el-input
            type="password"
            clearable
            v-model="user.password"
            placeholder="请输入密码"
            show-password
            prefix-icon="Lock"
          ></el-input>
        </el-form-item>
        <el-form-item class="fromItem">
          <el-button type="primary" class="btn-login" @click="handelLogin"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import utils from "../utils/utils.js";
import storage from "../utils/storage.js"
export default {
  name: "login",
  data() {
    return {
      user: {
        user: "",
        password: "",
      },
      rules: {
        user: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {},
  methods: {
    handelLogin() {
      this.$request({
        method: "post",
        url: "/users/login",
        data: {
          userName: this.user.user,
          userPwd: this.user.password,
        },
        mock: false,
      }).then(async (response) => {
        this.$store.commit("saveUserInfo", response);
        await this.loadAsyncRoutes()
        this.$router.push({ name: "welcome" });
      });
    },
    //路由动态渲染
    async loadAsyncRoutes() {
      const modules = import.meta.glob("../views/*.vue");
      let userInfo = storage.getItem("userInfo") || {};
      if (userInfo.token) {
        try {
          let { menuList } = await this.$request({
            url: "/users/getPermissionList",
            method: "get",
            data: {},
            mock: false,
          });
          let routes = utils.generateRoute(menuList);
          routes.map((route) => {
            let url = `../views/${route.component}.vue`;
            route.component = modules[url];
            this.$router.addRoute("home", route);
          });
        } catch (error) {}
      }
    },
  },
};
</script>

<style lang="scss">
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f9fcff;
  width: 100%;
  height: 100vh;
  .modal {
    width: 500px;
    padding: 50px;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0px 0px 10px 3px #c7c9cb4d;
    .title {
      font-size: 50px;
      line-height: 1.5;
      text-align: center;
      margin-bottom: 30px;
    }
    .btn-login {
      width: 100%;
    }
  }
}
</style>