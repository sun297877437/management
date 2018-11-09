<template>
  <div id="member">
    <!-- 会员总数 -->
    <div class="member-amount">
      <div class="title">
        会员总数<span>70</span>
      </div>
      <div class="search">
        <input type="text"
         placeholder=" 会员名称/联系电话"
         v-model="searchText"
         @keyup.enter="search">
        <div class="search-icon" @click="search">
          <img src="~img/icon/search.png" alt="">
        </div>
      </div>
    </div>
    <!-- 会员清单 -->
    <div class="member-list">
      <!-- 头部 -->
      <ul class="heade">
        <li>会员名称</li>
        <li>联系电话</li>
        <li>下单量</li>
        <li>账户余额</li>
        <li>种植总亩数</li>
        <li>收货地址</li>
      </ul>
      <div class="line"></div>
      <div class="body">
        <ul class="main" v-for="(item, index) in memberList" :key="index">
          <li>{{item.guest_name}}</li>
          <li>{{item.guest_tel}}</li>
          <li>{{item.sum}}</li>
          <li>{{item.guest_money}}</li>
          <li>{{item.guest_total}}</li>
          <li>
            <el-tooltip placement="top">
              <div slot="content"> 
                {{item.address_province_name}}
                {{item.address_city_name}}
                {{item.address_country_name}}
                {{item.address_town_name}}<br/> 
                {{item.address_guest_address}}
              </div>
              <el-button>{{item.address_guest_address}}</el-button>
          </el-tooltip>
          </li>
        </ul>
          <!-- 分页 -->
          <el-pagination background
           layout="prev, pager, next"
            @current-change="handleSize"
            :current-page="page"
            :page-size="perPage"
            :total="total">
          </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Member",
  data() {
    return {
      page:1,//当前页数
      perPage: 0,//每页数量
      total:0,//总数量
      memberList: [],//订单列表
      searchText:'',//搜索内容
      guestName:[],//会员名
      guestTel:[]//手机号
    };
  },
  created() {
    var _this = this;
    _this.getMemberList();
  },
  methods: {
    // 搜索
    search() {
      var _this = this;
      // 验证是否为手机号
      var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
      if (_this.searchText.length < 2) {
        _this.$message({
          message: '请输入正确信息',
          type: 'warning'
        });
        return false;
      }
      if (!myreg.test(_this.searchText)) {
          _this.guestName = _this.searchText;
          _this.guestTel = [];
      } else {
          _this.guestName = [];
          _this.guestTel = _this.searchText;
      }
      _this.getMemberList();
    },
    // 获取所有会员信息
    getMemberList() {
      var _this = this;
      var setData = {
        uid: userInfo.id,
        page: _this.page,
        guest_name: _this.guestName,
        guest_tel: _this.guestTel
      }
      _this.axios.post('guest/index/gid_list', setData).then((response) => {
        var resfult = response.data;
        if (resfult.data.length > 0) {
          _this.guestName = [];
          _this.guestTel = [];
          _this.memberList = resfult.data;
          _this.total = resfult.total;
          _this.perPage = resfult.per_page;
          console.log(JSON.stringify(response.data))
        } else {
          _this.$message({
          message: '暂无此会员信息',
          type: 'warning'
        });
        }
      })
    },
    // 点击分页
    handleSize(page) {
      var _this = this;
      _this.page = page;
      _this.getMemberList()
    }
  },
  watch: {
    searchText(val) {
      if (!val) {
        this.getMemberList();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
#member {
  background-color: #ffffff;
  .member-amount {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 13.6rem;
    height: 0.82rem;
    font-size: 0.18rem;
    background-color: #ffffff;
    .title {
      margin-left: 0.51rem;
      span {
        font-size: 0.25rem;
        color: #10c55b;
      }
    }
    .search {
      display: flex;
      align-items: center;
      margin-right: 0.32rem;
      width: 2.82rem;
      height: 0.32rem;
      padding-left: 0.01rem;
      border: solid 0.01rem #ccc;
      input {
        width: 2.12rem;
        height: 0.3rem;
        line-height: 0.3rem;
        font-size: 0.16rem;
      }
      .search-icon {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 0.68rem;
        height: 0.3rem;
        background-color: #f5f4f4;
        img {
          width: 0.2rem;
          height: 0.2rem;
        }
      }
    }
  }
}
.member-list {
  .heade,
  .main {
    display: flex;
    align-items: center;
    margin: 0 auto;
    width: 13.05rem;
    height: 0.41rem;
    line-height: 0.41rem;
    color: #666666;
    background-color: #f3f3f3;
    font-size: 0.16rem;
    text-align: center;
    li {
      &:nth-child(1) {
        width: 1.4rem;
      }
      &:nth-child(2) {
        width: 2.2rem;
      }
      &:nth-child(3) {
        width: 2.2rem;
      }
      &:nth-child(4) {
        width: 2.4rem;
      }
      &:nth-child(5) {
        width: 2.2rem;
      }
      &:nth-child(6) {
        width: 2.2rem;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        .el-button {
        width: 2.2rem;
        padding: 0;
        border: none;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        font-size: 0.16rem;
        span {
          line-height: auto;
        }
        }
      }
    }
  }
  .line {
    background-color: #ffffff;
    height: 0.16rem;
  }
  .body {
    overflow: auto;
    position: absolute;
    top: 2.1rem;
    bottom: 0.75rem;
    width: 13.6rem;
    background-color: #ffffff;
    &::-webkit-scrollbar {
      display: none;
    }
  }

  .main {
    color: #111111;
    background-color: #ffffff;
    &:hover {
      background-color: #fafafa;
    }
    &:first-child {
      border-top: 0.01rem solid #eaeaea;
    }
  }
}
</style>
