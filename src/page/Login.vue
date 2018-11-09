<template>
  <div id="login">
    <div class="container">
      <img class="top" src="~img/icon/loginLogo.png" alt="">
      <div class="info-phone">
        <div class="identification">
          <span>中国+86</span>
          <div>
            <img src="~img/icon/top.png" alt="">
            <img src="~img/icon/bottom.png" alt="">
          </div>
        </div>
        <div class="phone">
          <input type="text" placeholder="手机号" v-model="phone">
        </div>
      </div>
      <div class="info">
        <input type="text" placeholder="输入短信验证码" v-model="currentCode" @keyup.enter="login" >
        <span class="getCode" @click="getCode" >{{codeText}}</span>
      </div>
      <div class="login-btn" @click="login" :class="loginBtn == true ? '' : 'btn'">登录</div>
    </div>
  </div>
</template>

<script>
import md5 from 'js-md5';

export default {
  name: "Login",
  data() {
    return {
      phone: '',
      currentCode: '',//当前输入code
      codeText: '获取验证码',
      codeBtn: true,
      loginBtn: false
    };
  },
  methods: {
    // 获取验证码
    getCode() {
      var _this = this;
      if(_this.phone == '' || _this.phone.length != 11) {
        _this.$message({
          message: '请输入正确的手机号',
          type: 'warning'
        });
        return;
      }
      if(_this.codeBtn) {
        _this.codeBtn = false;
        sendCode();
        clock();
      }
      // 定时器
      function clock() {
        let time  = 5;
        let timer = setInterval(() => {
          time--;
          _this.codeText = '重新发送' + time;
          if (time == 0) {
            clearInterval(timer);
            _this.codeText = '重新发送';
           _this.codeBtn = true;
          }
        },1000)
      };
      // 提交手机号
      function sendCode() {
          const setData = {
            username:_this.phone
          }
        _this.axios.post('user/publics/loginin_code',setData
        ).then((data)=>{
          console.log(JSON.stringify(data));
          _this.$message({
          message: '发送成功',
          type: 'success'
        });
        }).catch((err)=>{
        })
      }
    },
    login() {
      var _this = this;
      if(_this.phone == '' || _this.phone.length != 11) {
        _this.$message({
          message: '请输入正确的手机号',
          type: 'warning'
        });
        return false;
      }
      var setData = {
          username:_this.phone,
          code:_this.currentCode
        }
      _this.axios.post('user/publics/loginin_uid',setData
      ).then((response) => {
        var data = response.data;
        if(data.return_code == 'success'){
          // var falseInfo = {
          //       realname: "孙飞",//真实姓名
          //       nickname: '商户名称昵称',
          //       username: "18561332353",
          //       id: 11,
          //       province: "370000",
          //       city: "",
          //       country: "",
          //       town: ""
          // }
          // localStorage.setItem('userInfo', JSON.stringify(falseInfo));
          localStorage.setItem('userInfo', JSON.stringify(data.return_msg));
          window.userInfo =  JSON.parse(localStorage.getItem('userInfo'));
          console.log('info==============================' + JSON.stringify(userInfo));
          _this.$router.push({ name: "Index" });
        } else {
          _this.$message({
            message: data.return_msg,
            type: 'warning'
          });
        }
      })
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~css/resetElement.scss";
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0.75rem auto;
  padding: 0.56rem;
  width: 5.33rem;
  height: 6.21rem;
  background-color: #ffffff;
  border-radius: 0.1rem;
  .top {
    margin: 0 auto;
    margin-top: 0.7rem;
    margin-bottom: 0.7rem;
    width: 3.58rem;
    height: 1.03rem;
  }
  .info,
  .info-phone {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 5.33rem;
    height: 0.34rem;
    padding: 0.2rem 0;
    line-height: 0.6rem;
    font-size: 0.2rem;
    border-bottom: 0.02rem solid #ebebeb;
    input {
      width: 2rem;
    }
    .getCode {
      font-family: PingFang-SC-Medium;
      font-size: 0.2rem;
      color: #28548b;
    }
  }
  .info-phone {
    justify-content: flex-start;
  }
  .login-btn {
    margin: 0.6rem auto;
    width: 5.25rem;
    height: 0.54rem;
    font-size: 0.2rem;
    text-align: center;
    line-height: 0.54rem;
    color: #ffffff;
    background-image: linear-gradient(90deg, #17e56b 0%, #10c65c 100%),
      linear-gradient(#927171, #927171);
    border-radius: 0.06rem;
  }
  .btn {
    opacity: .5;
  }
}
.identification {
  display: flex;
  flex-direction:row ;
  border-right: 0.02rem solid #ebebeb;
  span {
    font-family: PingFang-SC-Medium;
    font-size: 0.2rem;
    color: #8590a6;
  }
  div {
    align-self: center;
    display: flex;
    flex-direction: column;
    align-content: space-between;
    margin-left: 0.18rem;
    margin-right: 0.18rem;
    img {
      display: inline-block;
      width: 0.12rem;
      height: 0.07rem;
      margin-bottom: 0.05rem;
    }
  }
}
.phone {
  margin-left: 0.2rem;
}
</style>
<style lang="scss">
@import "~css/resetElement.scss";

</style>

