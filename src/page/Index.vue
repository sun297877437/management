<template>
  <div id="index">
    <header>
      <div class="container">
        <img src="../assets/img/icon/logo.png" alt="">
        <h1>商家管理系统</h1>
      </div>
    </header>
    <section class="main">
      <ul class="list">
        <router-link tag="li" :to="{name:'Home',params: {name:'订单信息', currentPath: 'Order'}}">
            <img src="~img/icon/store.png" alt="">
            <span>我的店铺</span>
        </router-link>
        <router-link tag="li" :to="{name:'Home',params: {name:'商品管理', currentPath: 'Classify'}}">
           <img src="~img/icon/classify.png" alt="">
            <span>商品管理</span>
        </router-link>
        <router-link tag="li" :to="{name:'Home',params: {name:'订单信息', currentPath: 'Order'}}">
            <img src="~img/icon/order.png" alt="">
            <span>订单信息</span>
        </router-link>
        <router-link tag="li" :to="{name:'Home',params: {name:'账户余额', currentPath: 'Account'}}">
            <img src="~img/icon/account.png" alt="">
            <span>账户余额</span>
        </router-link>
         <router-link tag="li" :to="{name:'Home',params: {name:'财务分析', currentPath: 'Finance'}}">
            <img src="~img/icon/finance.png" alt="">
            <span>财务分析</span>
        </router-link>
        <router-link tag="li" :to="{name:'Home',params: {name:'会员信息', currentPath: 'Member'}}">
            <img src="~img/icon/member.png" alt="">
            <span>会员信息</span>
        </router-link>
      </ul>
    </section>
  </div>
</template>

<script>
export default {
  name: "Index",
  data() {
    return {
      msg: "Welcome to Your Vue.js App"
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
header {
  width: 19.2rem;
  height: 0.75rem;
  background-color: #ffffff;
  .container {
    display: flex;
    align-items: center;
    margin: 0 auto;
    width: 8rem;
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
  .list {
    display: flex;
    flex-wrap: wrap;
    align-content: space-between;
    justify-content: space-between;
    margin: 1.34rem auto;
    width: 8rem;
    height: 5.08rem;
    li {
      &:active {
        opacity: 0.5;
      }

      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      width: 2.32rem;
      height: 2.22rem;
      background-color: #ffffff;
      box-shadow: 0rem 0.04rem 0.08rem 0rem rgba(0, 0, 0, 0.23);
      img {
        width: 0.69rem;
        height: 0.63rem;
      }
      span {
        margin-top: 0.2rem;
        height: 0.15rem;
        font-family: MicrosoftYaHei;
        font-size: 0.16rem;
        line-height: 0.14rem;
        color: #666666;
      }
    }
  }
}
</style>
