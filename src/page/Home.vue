<template>
  <div id="home">
    <header>
      <div class="container">
        <img src="../assets/img/icon/logo.png" alt="">
        <h1>商家管理系统</h1>
      </div>
    </header>
    <section class="main">
      <aside>
        <div class="head-portrait">
          <el-dropdown trigger="click"  @command="handleCommand">
            <span class="el-dropdown-link">
              <img :src="avatar" alt="">
              <span>{{nickname}}</span>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="signout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <ul class="menu">
          <li>我的店铺</li>
          <router-link
            tag="li"
            @click.native="currentName = item.name"
            v-for="(item, index) in list"
            :to="item.path"
            :key="index"
            active-class = "active"
            >
            {{item.name}}
          </router-link>
        </ul>
      </aside>
      <div class="center">
        <h1 class="title">{{currentName}}</h1>
        <div class="components">
          <router-view></router-view>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import Order from "page/Order";
import Account from "page/Account";
import Classify from "page/Classify";
import Member from "page/Member";
import Finance from "page/Finance";
export default {
  name: "Home",
  components: {
    Order,
    Account,
    Classify,
    Member,
    Finance
  },
  data() {
    return {
      nickname: userInfo.nickname,
      avatar: userInfo.avatar,
      list: [
        {
          name: "订单信息",
          path: "/Order"
        },
        {
          name: "商品管理",
          path: "/Classify"
        },
        {
          name: "账户余额",
          path: "/Account"
        },
        {
          name: "财务分析",
          path: "/Finance"
        },
        {
          name: "会员信息",
          path: "/member"
        }
      ],
      currentName: '订单信息'
    };
  },
  created() {
  },
  methods: {
    handleCommand(command) {
      // 退出登录
      if (command == 'signout') {
        localStorage.removeItem('userInfo')
        this.$router.push({name: 'Login'})
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
header {
  position: fixed;
  width: 19.2rem;
  height: 0.75rem;
  background-color: #ffffff;
  z-index: 999;
  .container {
    display: flex;
    align-items: center;
    margin: 0 auto;
    width: 15.24rem;
    height: 0.75rem;
    img {
      width: 1.32rem;
      height: 0.38rem;
      padding-right: 0.1rem;
      border-right: 0.01rem solid #c7c7c7;
    }
    h1 {
      margin-left: 0.1rem;
      height: 0.12rem;
      font-family: MicrosoftYaHei;
      font-size: 0.14rem;
      font-weight: normal;
      font-stretch: normal;
      line-height: 0.14rem;
      letter-spacing: 0.03rem;
      color: #9a9a9a;
    }
  }
}
.main {
  width: 16.37rem;
  height: 100%;
  margin: 0 auto;
  aside {
    position: fixed;
    left: 1.97rem;
    top: 0.75rem;
    bottom: 0;
    text-align: center;
    width: 1.6rem;
    height: auto;
    background-color: #efefef;
  }
}
.head-portrait {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 1.6rem;
  height: 1.6rem;
  border-bottom: 0.01rem solid #dadada;
  img {
    display: block;
    margin: 0 auto;
    width: 0.87rem;
    height: 0.87rem;
  }
  span {
    font-size: 0.14rem;
    color: #000000;
  }
}
.menu {
  padding-top: 0.64rem;
  li {
    width: 1.6rem;
    height: 0.64rem;
    line-height: 0.64rem;
    font-size: 0.16rem;
    color: #666666;
    cursor: pointer;
  }
}
.center {
  position: absolute;
  left: 3.7rem;
  top: 0.75rem;
  width: 13.6rem;
  bottom: 0;
  .title {
    height: 0.72rem;
    line-height: 0.72rem;
    font-size: 0.28rem;
    color: #3d3d3d;
  }
}
.components {
  width: 13.6rem;
}

.active {
  background-image: linear-gradient(90deg, #17e56b 0%, #10c65c 100%),linear-gradient(#927171, #927171);
  color: #ffffff !important;
}
.el-dropdown-menu {
  width: 1.6rem;
  left: 1.97rem !important;
  text-align: center;
}
</style>
