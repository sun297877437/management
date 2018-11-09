<template>
  <div id="Oredr">
    <!-- 会员总数 -->
    <ul class="member-amount">
      <li @click="currentList([])" :class="{'active':currentStatus === []}">
        <span>全部订单</span>|
      </li>
      <li @click="currentList(0)" :class="{'active':currentStatus === 0}">
        <span>买家待付款</span>|
      </li>
      <li @click="currentList(1)" :class="{'active':currentStatus === 1}">
        <span>待发货</span>|
      </li>
      <li @click="currentList(-1)" :class="{'active':currentStatus === -1}">
        <span>申请退货</span>|
      </li>
      <li @click="currentList(2)" :class="{'active':currentStatus === 2}">
        <span>已发货</span>|
      </li>
      <li @click="currentList(3)" :class="{'active':currentStatus === 3}">
        <span>已完成</span>|
      </li>
      <li @click="currentList(4)" :class="{'active':currentStatus === 4}">
        <span>交易已关闭</span>
      </li>
    </ul>
    <div class="choose-list">
      <img class="" src="~img/icon/default.png" v-if="currentStatus == 1 && chooseAllText == '全选'" />
      <img class="" src="~img/icon/active.png" v-if="currentStatus == 1 && chooseAllText == '全不选'" />
      <label for="all-checkbox"
        v-if="currentStatus == 1"
        @click="checkedAll">
        {{chooseAllText}}
      </label>
      <span class="delivery"
        v-if="currentStatus == 1"
        @click="sendAll">发货</span>
    </div>
    <!-- 订单 -->
    <div class="member-list">
      <!-- 头部 -->
      <ul class="heade">
        <li>商品名称</li>
        <li>商品单价</li>
        <li>数量</li>
        <li>买家</li>
        <li>交易状态</li>
        <li>收款</li>
      </ul>
      <div class="line"></div>
      <div class="body" v-loading="loadIng">
      <!-- order start -->
        <div class="main" v-for="(item, index) in orderList" :key="index">
          <div class="order-title">
            <img src="~img/icon/default.png"
              v-if="currentStatus == 1 && item[0].checked == false" 
              @click="checkCurrent(index)" />
            <img src="~img/icon/active.png"  
              v-if="currentStatus == 1 && item[0].checked == true" 
              @click="checkCurrent(index)" />
            <span>订单号{{item[0].goods_order_id}}</span>
            <span>创建时间{{item[0].create_time}}</span>
          </div>
          <ul class="order-content" v-for="(i, index) in item" :key="index">
            <li>
              <img src="~img/icon/test.png" alt="">
              <div class="goods-name">
                <p>{{i.goods_name}}</p>
                <span>规格 {{i.goods_specifications}}</span>
              </div>
            </li>
            <li>
              <span>￥{{i.goods_price}}</span>
            </li>
            <li>
              <span>{{i.goods_num}}</span>
            </li>
            <li>
              <span>{{i.guest_name}}</span>
            </li>
            <li>
              <div>
                <p>{{i.status | orderStatus}}</p>
                <p v-if="i.goods_order_isappraises !== 1 && i.status !== 0 && i.status !== 1 && i.status !== 2 && i.status !== 4">未评价</p>
                <p v-if="i.goods_order_isappraises == 1 && i.status !== 0 && i.status !== 1 && i.status !== 2 && i.status !== 4">已评价</p>
                <p v-if="i.status == 2">正在配送</p>
              </div>
            </li>
            <li>
              <span v-if="i.status == 0 || i.status == 4">未收款</span>
              <span v-if="i.status != 0 && i.status != 4">{{i.goods_order_money}}</span>
            </li>
          </ul>
          <div class="delivery-btn" v-if="item[0].status == 1" @click="showPopup(item[0])">
            <button>发货</button>
          </div>
          <div class="delivery-btn" v-if="item[0].status == -1" @click="quitGoods(item[0],4,-1)">
            <button>同意退货</button>
          </div>
        </div>
        <!-- order end -->
        <!-- 发货订单弹窗 -->
        <el-dialog title="发货信息" :visible.sync="dialogVisible" width="70%" @click="close">
          <el-form :model="editor" ref="editor"  label-width="100px" class="demo-ruleForm">
            <el-form-item label="姓名">
              <el-input v-model="editor.guest_name" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="省">
              <el-input v-model="address.province_name" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="市">
              <el-input v-model="address.city_name" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="县">
              <el-input v-model="address.country_name" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="镇">
              <el-input v-model="address.town_name" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="详细地址">
              <el-input v-model="editor.guest_order_receiving_address" :disabled="true"></el-input>
            </el-form-item>
            <!-- 商品独立编码 -->
            <!-- 状态 -->
            <el-form-item>
              <el-button type="primary" @click="sendGoods(editor,2,1)">确认发货</el-button>
              <el-button @click="close">取消</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
        <!-- 分页 -->
          <el-pagination
            background
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
  name: "Order",
  data() {
    return {
      loadIng:true, // 加载中
      currentStatus:[], // 当前分类状态
      orderList: [], // 所有订单
      page:1, // 当前页数
      perPage:0, // 每页默认返回条数
      total:0, // 总订单数
      chooseAllText:"全选",// 全选
      dialogVisible: false, // 发货弹窗
      editor: {}, // 发货弹窗
      address: {} // 当前订单地址
    };
  },
  created() {
    var _this = this;
    var setData = {uid:userInfo.id, status: [], page:1};
    _this.getOrderList('goods/order/index_uid',setData);
  },
  methods: {
    // 全选
    checkedAll() {
      var _this = this;
      if (_this.chooseAllText == "全选") {
        _this.chooseAllText = "全不选";
        for (let i = 0; i <  _this.orderList.length; i++) {
          _this.orderList[i][0].checked = true;
        }
      } else {
        _this.chooseAllText = '全选';
        for (let i = 0; i <  _this.orderList.length; i++) {
          _this.orderList[i][0].checked = false;
        }
      }
      // console.log(JSON.stringify(_this.orderList))
    },
    //选择当前订单 
    checkCurrent(index) {
      var _this =this;
      _this.orderList[index][0].checked = !_this.orderList[index][0].checked;
    },
    // 点击分类
    currentList(status) {
      var _this = this;
      _this.chooseAllText = "全选"
      _this.page = 1;
      _this.currentStatus = status;
      var setData = {
        uid:userInfo.id,
        status: _this.currentStatus,
        page:_this.page
        };
      _this.getOrderList('goods/order/index_uid',setData);
    },
    // 点击分页
    handleSize(page) {
      var _this = this;
      _this.chooseAllText = "全选"
      _this.page = page;
      var setData = {
        uid:userInfo.id,
        page: _this.page,
        status: _this.currentStatus
        };
      this.getOrderList('goods/order/index_uid',setData);
    },
    // 获取相应状态订单
    getOrderList(url, params) {
      var _this = this;
      _this.loadIng = true;
      _this.orderList = [];
      _this.total = 0;
      _this.perPage = 0;
      _this.axios.post(url, params).then((response) => {
        var data = response.data;
        if (data.return_code === 'success') {
          _this.orderList = data.return_msg.data;
          _this.total = data.return_msg.total;
          _this.perPage = data.return_msg.per_page;
          _this.loadIng = false;
        } else {
        _this.$message('暂无相应订单')
        }
      }).catch((err) => {
        _this.$message('暂无相应订单!')
        _this.loadIng = false;
        _this.orderList = [];
        _this.total = 0;
        _this.perPage = 0;
      })
    },
    // 显示发货弹窗
    showPopup(item) {
      var _this = this;
      _this.editor = item;//item当前订单下的一个商品
      _this.getAddress('province', _this.editor.province)
      _this.getAddress('city', _this.editor.city)
      _this.getAddress('country', _this.editor.country)
      _this.getAddress('town', _this.editor.town)
      setTimeout(() => {
        _this.dialogVisible = true;
      },500)

    },
    // 关闭发货弹窗
    close() {
      var _this = this;
      _this.dialogVisible = false
      _this.editor = {};
    },
    // 根据城市id获取城市name
    getAddress(current, id) {
      var _this = this;
      // 获取相应地址
      _this.axios.post('guest/areas/areas', {areaId: id})
      .then((response) => {
        return response.data;
      })
      .then((data) => {
        switch(current) {
          case 'province':
            _this.address.province_name = data.return_msg[0].areaName
            break;
          case 'city':
            _this.address.city_name = data.return_msg[0].areaName;
            break;
          case 'country':
            _this.address.country_name = data.return_msg[0].areaName;
            break;
          case 'town':
            _this.address.town_name = data.return_msg[0].areaName;
            break;
        }
        // console.log(JSON.stringify('111' + _this.editor.province_name))
        // console.log(JSON.stringify('111' + _this.editor.city_name))
        // console.log(JSON.stringify('111' + _this.editor.country_name))
        // console.log(JSON.stringify('111' + _this.editor.town_name))
        // console.log(current)
      }).catch(() => {
        switch(current) {
          case 'province':
            _this.address.province_name = '';
            break;
          case 'city':
            _this.address.city_name = '';
            break;
          case 'country':
            _this.address.country_name = '';
            break;
          case 'town':
            _this.address.town_name = '';
            break;
        }
      })
    },
    // 单个订单发货(当前订单，更改的状态值，刷新当前页传入的状态)
    sendGoods(item,status,current) {
      var _this = this;
      var setData = [
        {
          uid: userInfo.id,
          id :item.id,
          status:status
        }
      ]
      _this.axios.post('goods/order/edit_order_all', setData).then((response) => {
          var data = response.data;
          if (data.return_code === 'success') {
            _this.$message({
                message: '操作成功',
                type: 'success'
              })
              // 发货成功刷新当前页
              _this.dialogVisible = false;
              _this.editor = {};
              var setData = {uid:userInfo.id, status:current, page:1};
              _this.getOrderList('goods/order/index_uid',setData);
          } else {
              _this.dialogVisible = false;
              _this.editor = {};
          }
      })
    },
    // 单个订单退货(当前订单，更改的状态值，刷新当前页传入的状态)
    quitGoods(item,status,current) {
      var _this = this;
      var setData = [
        {
          uid: userInfo.id,
          id :item.id,
          status:status
        }
      ]
      _this.axios.post('goods/order/edit_order_all', setData).then((response) => {
          var data = response.data;
          if (data.return_code === 'success') {
            _this.$message({
                message: '操作成功',
                type: 'success'
              })
              // 发货成功刷新当前页
              var setData = {uid:userInfo.id, status:current, page:1};
              _this.getOrderList('goods/order/index_uid',setData);
          }
      })
    },
    // 所有订单发货
    sendAll() {
      var _this = this;
      // 循环所有订单
      var setData = [];
      for (let i = 0; i < _this.orderList.length; i++) {
        // 判断当前订单是否选中
        if (_this.orderList[i][0].checked) {
          var object = {
            uid: userInfo.id,
            id :_this.orderList[i][0].id,
            status: 2
          }
          setData.push(object)
        }
      }
      // 发送选中的订单
      _this.axios.post('goods/order/edit_order_all', setData).then((response) => {
        // console.log(setData)
      var data = response.data;
      if (data.return_code === 'success') {
        _this.$message({
            message: '发货成功',
            type: 'success'
          })
          // 发货成功刷新当前页
          var updated = {uid:userInfo.id, status: 1, page:1};
          _this.getOrderList('goods/order/index_uid',updated);
        }
      })
      
    }
  },
  filters: {
    // 支付状态
    orderStatus(val) {
        switch (val) {
            case 0:
                return val = '待支付';
                break;
            case 1:
                return val = '待发货';
                break;
            case 2:
                return val = '已发货';
                break;
            case 3:
                return val = '已完成';
                break;
            case 4:
                return val = '已关闭';
                break;
            default:
                return val = '';
                break;
        }
    }
}
};
</script>

<style lang="scss" scoped>
#Oredr {
  background-color: #ffffff;
}
.member-amount {
  display: flex;
  width: 13.25rem;
  height: 0.49rem;
  margin: 0 auto;
  cursor: pointer;
  font-size: 0.16rem;
  background-color: #ffffff;
  border-bottom: 0.02rem solid #e5e5e5;
  li {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.33rem;
    height: 0.49rem;
    line-height: 0.49rem;
    text-align: center;
    color: #eaeaea;
    span {
      display: block;
      width: 100%;
      color: #323232;
    }
  }
}
.choose-list {
  margin: 0 auto;
  width: 13.25rem;
  height: 0.48rem;
  line-height: 0.48rem;
  font-size: 0.14rem;
  color: #636363;
  img {
    width: 0.3rem;
    height: 0.3rem;
    max-width: 18px;
    max-height: 18px;
    vertical-align: middle;
    margin-left: 0.05rem;
  }
  label {
    margin-left: 0.12rem;
    margin-right: 0.34rem;
  }
  .delivery {
    padding: 0.07rem 0.19rem;
    background-color: #ffffff;
    border-radius: 0.04rem;
    border: solid 0.01rem #d3d3d3;
  }
}
.member-list {
  .heade,
  .main {
    display: flex;
    align-items: center;
    margin: 0 auto;
    width: 13.25rem;
    height: auto !important;
    line-height: 0.41rem;
    color: #666666;
    background-color: #f3f3f3;
    font-size: 0.16rem;
    text-align: center;
    li {
      width: 1.85rem;
      &:nth-child(1) {
        width: 4rem;
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
    padding-top: 0.16rem;
    background-color: #ffffff;
    &::-webkit-scrollbar {
      display: none;
    }
  }

  .main {
    display: flex;
    flex-direction: column;
    margin-bottom: 0.22rem;
    height: 2.2rem;
    color: #111111;
    text-align: left;
    background-color: #ffffff;
    &:hover {
      background-color: #fafafa;
    }
    &:first-child {
      border-top: 0.01rem solid #eaeaea;
    }
    .order-title {
      width: 13.25rem;
      height: 0.45rem;
      line-height: 0.45rem;
      font-size: 0.14rem;
      color: #3f3f3f;
      background-color: #f6fafe;
      border: solid 0.01rem #cdcdcd;
      box-sizing: border-box;
      img {
        vertical-align: middle;
        width: 0.3rem;
        height: 0.3rem;
        max-width: 18px;
        max-height: 18px;
        margin-left: 0.06rem;
      }
      span {
        margin-left: 0.21rem;
        &:last-child {
          margin-left: 0.64rem;
        }
      }
    }
    .order-content {
      display: flex;
      justify-content: space-between;
      align-content: center;
      width: 13.25rem;
      height: 1.18rem;
      background-color: #ffffff;
      border: solid 0.01rem #cdcdcd;
      border-top: none;
      box-sizing: border-box;
      li {
        width: 1.85rem;
        height: 1.18rem;
        &:nth-child(2),
        &:nth-child(3),
        &:nth-child(4),
        &:nth-child(6) {
          line-height: 1.18rem;
        }
        &:nth-child(4) {
          color: #3a6ed5;
        }
        &:nth-child(5) {
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: auto;
          color: #3a6ed5;
          p:last-child {
            color: #898989;
          }
        }
        text-align: center;
      }
      li:first-child {
        display: flex;
        align-items: center;
        width: 4rem;
        img {
          width: 0.68rem;
          height: 0.58rem;
          margin-left: 0.19rem;
          margin-right: 0.24rem;
        }
        .goods-name {
          width: 2.51rem;
          font-size: 0.14rem;
          color: #2a2a2a;
          text-align: left;
          sapn {
            font-size: 0.14rem;
            color: #a5a5a5;
          }
        }
      }
    }
  }
  .delivery-btn {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 13.25rem;
    height: 0.58rem;
    box-sizing: border-box;
    border: solid 0.01rem #cdcdcd;
    border-top: none;
    button {
      margin-right: 0.26rem;
      width: 1.2rem;
      height: 0.36rem;
      line-height: 0.36rem;
      background-color: #66b6ff;
      border-radius: 0.1rem;
      font-size: 0.16rem;
      color: #ffffff;
    }
  }
}
li.active {
  border-bottom:  0.02rem solid #ff4900;
  span {
  color: #ff4900;

  }
}
</style>
<style lang="scss">
@import '~css/resetElement.scss'
</style>

