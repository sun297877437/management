<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">后台管理系统</div>
      <el-form label-width="0px" class="ms-content">
        <el-form-item>
          <el-input v-model="phone" placeholder="输入账号">
            <el-button slot="prepend" icon="el-icon-mobile-phone"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-input type="password" placeholder="输入密码" v-model="password" @keyup.enter.native="login">
            <el-button slot="prepend" icon="el-icon-view"></el-button>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click.native="login">登录</el-button>
        </div>
        <p class="login-tips">Tips : 请注意输入字母的大小写。</p>
      </el-form>
    </div>
  </div>
</template>

<script>
import md5 from "js-md5";

export default {
  name: "Login",
  data() {
    return {
      phone: "",
      password: ""
    };
  },
  methods: {
    login() {
      var _this = this;
      if (_this.phone == "") {
        _this.$message({
          message: "请输入账号",
          type: "warning"
        });
        return false;
      }
      if (_this.password == "") {
        _this.$message({
          message: "请输入密码",
          type: "warning"
        });
        return false;
      }
      // var setData = {
      //   username: _this.phone,
      //   password: _this.password
      // };
      // _this.axios.post("", setData).then(response => {
      //   var data = response.data;
      //   if (data.return_code == "success") {
      //     localStorage.setItem("userInfo", JSON.stringify(data.return_msg));
      //     window.userInfo = JSON.parse(localStorage.getItem("userInfo"));
      //     console.log(
      //       "info==============================" + JSON.stringify(userInfo)
      //     );
           _this.$router.push({ name: "Home" });
      //   } else {
      //     _this.$message({
      //       message: data.return_msg,
      //       type: "warning"
      //     });
      //   }
      // });
    }
  }
};
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background: url("~img/login/login-bg.jpg");
  background-size: 100%;
}
.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #fff;
  border-bottom: 1px solid #ddd;
}
.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 350px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
  overflow: hidden;
}
.ms-content {
  padding: 30px 30px;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}
.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #fff;
}
</style>