<template>
  <div id="account">
    <!-- top -->
    <ul class="top">
      <li>
        <div>
          <span>账户余额</span>
          <p>
            <span>{{money}}</span>元
          </p>
        </div>
        <div class="line"></div>
      </li>
      <li>
        <div>
          <span>不可用余额</span>
          <p>
            <span>{{noMoney}}</span>元
          </p>
        </div>
        <div class="line"></div>
      </li>
      <li>
        <div>
          <span>已提现总额</span>
          <p>
            <span>{{alreadyMoney}}</span>元
          </p>
        </div>
        <div class="line"></div>
      </li>
      <li @click="dialogVisible = true">
        <button>提现</button>
      </li>
    </ul>
    <!-- main -->
    <div class="main">
      <div class="bill">
        <h1 class="title">未入账金额</h1>
        <div class="unconfirmed">
          <p>未确认收货(<span>{{count}}</span>)</p>
          <span>￥{{noMoney}}</span>
        </div>
      </div>
      <div class="income">
        <div class="title">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              &nbsp;{{currentTime}}<i class="el-icon-arrow-down el-icon--left"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(item, index) of timeList" :command="item" :key="index">{{item}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="content">
          <div class="echart" ref="profitStatistics"></div>
        </div>
      </div>
    </div>
    <!-- bottom -->
    <div class="bottom">
      <div class="record-search">
        <div class="title">
          <h1>提现记录</h1>
        </div>
        <div class="center">
          <span class="time">时间:</span>
          <div class="time-withdrawal">
            <el-date-picker v-model="timelStart" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="timestamp" el-input__prefix>
            </el-date-picker>
            &nbsp;-&nbsp;
            <el-date-picker v-model="timelEnd" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="timestamp" @change="search"  el-input__prefix>
            </el-date-picker>
          </div>
          <span class="phase">最近:</span>
          <ul class="phase-list">
            <li :class="{'active':withdrawtoTime == item}" v-for="(item, index) in withdrawtoList" @click="handleCurrent(item)" :key="index">
              {{item}}
            </li>
          </ul>
        </div>
      </div>
      <div class="record-content">
        <div class="center">
          <!-- 标题 -->
          <ul>
            <li>创建时间</li>
            <li>名称&nbsp;|&nbsp;账户&nbsp;|&nbsp;交易号</li>
            <li>金额</li>
            <li>状态</li>
          </ul>
          <!-- 记录 -->
          <ul v-for="(item, index) in orderList" :key="index">
            <li @click="sendCode">
              <span>{{item.create_time}}</span>&nbsp;
            </li>
            <li>
              <span>{{item.bank_name}}</span>&nbsp;|&nbsp;
              <span>{{item.bank_card}}</span>&nbsp;|&nbsp;
              <span>{{name}}</span>&nbsp;|&nbsp;
              <span>交易号</span>&nbsp;|&nbsp;
              <span>{{item.bank_order}}</span>
            </li>
            <li>{{item.money}}</li>
            <li>{{item.status | statusJudje}}</li>
          </ul>
          <!-- 分页 -->
          <el-pagination background layout="prev, pager, next" @current-change="handleSize" :current-page="page" :page-size="perPage" :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
    <!-- 提现 -->
    <el-dialog title="提现" :visible.sync="dialogVisible" width="40%" @click="dialogVisible = false">
        <el-input type="number" placeholder="请输入提现金额" v-model="sendMoney" clearable></el-input>
        <el-row :gutter="2">
          <el-col :span="17">
            <el-input placeholder="请输入短信秘钥" v-model="currentCode" clearable style="margin-top:10px;"></el-input>
          </el-col>
          <el-col :span="7">
            <el-button @click="sendCode" style="margin-top:10px;width:100%;">{{codeText}}</el-button>
          </el-col>
        </el-row>
        <p class="dialog-footer" style="font-size:16px;margin-top:10px;">
          提示:每笔提现扣除2.00元手续费
        </p>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="withDrawto">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import echarts from "echarts";
import md5 from 'js-md5';
export default {
  inject: ["reload"],
  name: "Account",
  data() {
    return {
      name: userInfo.realname,//商户名
      code: "", //返回的MD5
      codeText: "获取验证码",
      codeBtn: true, //获取秘钥btn
      passBtn: false, //验证后提现按钮状态

      sendMoney: "", //提现金额
      currentCode: "", //用户输入的code

      loading: false,
      dialogVisible: false, //提现弹框
      money: "", //余额
      noMoney: "", //不可用余额
      count: "", //未确认收货的订单数
      alreadyMoney: "", //已提现金额
      msg: "Welcome to Your Vue.js App",
      timeList: ["最近七日趋势", "最近一个月趋势"],
      currentTime: "最近七日趋势",
      profitdStart: "", //利润统计开始时间
      profitdEnd: "", //利润统计结束时间
      profitdList: [], //利润统计列表
      profitdAll: 0, //总利润
      profitdY: [], //利润销量
      profitdY2: [], //笔数
      profitdX: [], //利润时间

      withdrawtoList: ["一个月", "三个月", "一年"],
      withdrawtoTime: "一个月",
      defaultStartTime: "", //提现记录默认开始时间
      defaultEndTime: "", //提现记录默认结束时间
      timelStart: 0, //提现记录开始时间
      timelEnd: 0, //提现记录开始时间
      orderList: [], //所有订单
      page: 1, //当前页数
      perPage: 0, //每页默认返回条数
      total: 0 //总订单数
    };
  },
  created() {
    var _this = this;
    _this.remaining();
    _this.remainingTwo();
    _this.remainingThree();
    // 提现记录最近一个月趋势
    _this.defaultStartTime = parseInt(new Date().getTime() / 1000) - 30 * 24 * 60 * 60;//开始时间
    _this.defaultEndTime = parseInt(new Date().getTime() / 1000); //结束时间
    _this.timelStart = _this.defaultStartTime * 1000; //转化为毫秒，时间插件只能使用毫秒数时间戳
    _this.timelEnd = _this.defaultEndTime * 1000; //转化为毫秒，时间插件只能使用毫秒数时间戳
    var setData = {
      create_time:['between',_this.defaultStartTime +','+ _this.defaultEndTime],
      uid: userInfo.id,
      page: _this.page
    };
    _this.getOrderList("user/publics/payment_deposit", setData);
  },
  mounted() {
    var _this = this;
    // 图表最近七日趋势
    _this.profitdStart = new Date().getTime() / 1000 - 7 * 24 * 60 * 60;
    _this.profitdEnd = new Date().getTime() / 1000;
    _this.earch(
      userInfo.id,
      _this.profitdStart,
      _this.profitdEnd,
      "user/publics/payment_income",
      _this.profitdList,
      _this.profitdX,
      _this.profitdY,
      _this.profitdY2,
      _this.$refs.profitStatistics,
      "profitdAll"
    );
  },
  methods: {
    // 账户余额
    remaining() {
      var _this = this;
      var setData = {
        uid: userInfo.id
      };
      _this.axios.post("user/publics/balance", setData).then(response => {
        var data = response.data;
        if (data.return_code === "success") {
          _this.money = data.return_msg.money;
        }
      });
    },
    // 不可用余额
    remainingTwo() {
      var _this = this;
      var setData = {
        uid: userInfo.id,
        status: 2
      };
      _this.axios.post("user/publics/nobalance", setData).then(response => {
        var data = response.data;
        if (data.return_code === "success") {
          _this.noMoney = data.return_msg.sum;
          _this.count = data.return_msg.count;
        }
      });
    },
    // 已提现金额
    remainingThree() {
      var _this = this;
      var setData = {
        uid: userInfo.id
      };
      _this.axios
        .post("user/publics/payment_sum_money", setData)
        .then(response => {
          var data = response.data;
          if (data.return_code === "success") {
            _this.alreadyMoney = data.return_msg.sum;
          }
        });
    },
    // 获取密钥
    sendCode() {
      var _this = this;
      if (_this.codeBtn) {
        _this.codeBtn = false;
        clock();
        send();
      }
      // axios
      function send() {
        var setData = {
          name: userInfo.realname,
          uid: userInfo.id,
          tel: userInfo.username
        };
        _this.axios.post("user/publics/apply_md5", setData).then(response => {
          var data = response.data;
          if (data.return_code === "success") {
            console.log("code+++++++++++" + JSON.stringify(data.return_msg.md5));
            _this.code = data.return_msg.md5;
            _this.$message({
              message: "已成功发送短信",
              type: "success"
            });
          }
        });
      }
      // 定时器
      function clock() {
        let time = 5;
        let timer = setInterval(() => {
          time--;
          _this.codeText = "重新发送" + time;
          if (time == 0) {
            clearInterval(timer);
            _this.codeText = "重新发送";
            _this.codeBtn = true;
          }
        }, 1000);
      }
    },
    // 提现
    withDrawto() {
      var _this = this;
      _this.verification();

      if (_this.passBtn) {
        send();
      }
      // console.log(userInfo.uid)
      // console.log(_this.currentCode)
      // console.log(_this.code)
      // console.log(userInfo.uid+_this.currentCode+_this.code)
      console.log(md5(userInfo.uid+_this.currentCode+_this.code))
      function send() {
        var setData = {
          uid: userInfo.id,
          tel: userInfo.username,
          code: _this.currentCode,
          money: _this.sendMoney,
          md5:md5(userInfo.id+_this.currentCode+_this.code)
        };
        _this.axios
          .post("user/publics/deposit_apply", setData)
          .then(response => {
            var data = response.data;
            if (data.return_code === "success") {
              _this.passBtn = false;
              _this.dialogVisible = false;

              _this.remaining();
              _this.remainingTwo();
              _this.remainingThree();

              _this.$message({
                message: "提现成功",
                type: "success"
              });
            }else {
              _this.$message({
                message: data.return_msg,
                type: "warning"
              });
            _this.passBtn = false;
            _this.dialogVisible = false;
            }
          })
      }
    },
    //点击提现记录日期
    handleCurrent(time) {
      var _this = this;
      _this.withdrawtoTime = time;
      if (_this.withdrawtoTime == "一个月") {
        _this.defaultStartTime =
          new Date().getTime() / 1000 - 30 * 24 * 60 * 60;
        _this.defaultEndTime = new Date().getTime() / 1000;
        _this.timelStart = _this.defaultStartTime * 1000; //转化为毫秒，时间插件只能使用毫秒数时间戳
        _this.timelEnd = _this.defaultEndTime * 1000; //转化为毫秒，时间插件只能使用毫秒数时间戳
      } else if (_this.withdrawtoTime == "三个月") {
        _this.defaultStartTime =
          new Date().getTime() / 1000 - 90 * 24 * 60 * 60;
        _this.defaultEndTime = new Date().getTime() / 1000;
        _this.timelStart = _this.defaultStartTime * 1000; //转化为毫秒，时间插件只能使用毫秒数时间戳
        _this.timelEnd = _this.defaultEndTime * 1000; //转化为毫秒，时间插件只能使用毫秒数时间戳
      } else if (_this.withdrawtoTime == "一年") {
        _this.defaultStartTime =
          new Date().getTime() / 1000 - 365 * 24 * 60 * 60;
        _this.defaultEndTime = new Date().getTime() / 1000;
        _this.timelStart = _this.defaultStartTime * 1000; //转化为毫秒，时间插件只能使用毫秒数时间戳
        _this.timelEnd = _this.defaultEndTime * 1000; //转化为毫秒，时间插件只能使用毫秒数时间戳
      }
      var setData = {
        create_time:['between',parseInt(_this.defaultStartTime) +','+ parseInt(_this.defaultEndTime)],
        uid: userInfo.id,
        page: _this.page
      };
      _this.getOrderList("user/publics/payment_deposit", setData);
    },
    // 点击日期插件
    search() {
      var _this = this;
      var setData = {
        create_time:['between',parseInt(_this.timelStart / 1000) +','+ parseInt(_this.timelEnd / 1000)],
        uid: userInfo.id,
        page: 1
      };
      _this.getOrderList("user/publics/payment_deposit", setData);
    },
    // 点击分页
    handleSize(page) {
      var _this = this;
      _this.page = page;
      var setData = {
        create_time:['between',parseInt(_this.timelStart / 1000) +','+ parseInt(_this.timelEnd / 1000)],
        uid: userInfo.id,
        page: _this.page
      };
      this.getOrderList("user/publics/payment_deposit", setData);
    },
    // 获取提现记录
    getOrderList(url, params) {
      var _this = this;
      _this.axios.post(url, params).then(response => {
        var data = response.data;
        _this.orderList = data.return_msg.data;
        _this.total = data.return_msg.total;
        _this.perPage = data.return_msg.per_page;
        console.log(JSON.stringify(data.return_msg));
      });
    },
    handleCommand(command) {
      var _this = this;
      _this.$message(command);
      _this.currentTime = command;
      if (_this.currentTime == "最近七日趋势") {
        _this.profitdStart = parseInt(new Date().getTime() / 1000) - 7 * 24 * 60 * 60;
        _this.profitdEnd = parseInt(new Date().getTime() / 1000);
        _this.earch(
          userInfo.id,
          _this.profitdStart,
          _this.profitdEnd,
          "user/publics/payment_income",
          _this.profitdList,
          _this.profitdX,
          _this.profitdY,
          _this.profitdY2,
          _this.$refs.profitStatistics,
          "profitdAll"
        );
      } else if (_this.currentTime == "最近一个月趋势") {
        _this.profitdStart = parseInt(new Date().getTime() / 1000) - 30 * 24 * 60 * 60;
        _this.profitdEnd = parseInt(new Date().getTime() / 1000);
        _this.earch(
          userInfo.id,
          _this.profitdStart,
          _this.profitdEnd,
          "user/publics/payment_income",
          _this.profitdList,
          _this.profitdX,
          _this.profitdY,
          _this.profitdY2,
          _this.$refs.profitStatistics,
          "profitdAll"
        );
      }
    },
    // 数据赋值(uid,开始时间, 结束时间, 接口地址, 返回信息, 月份list, 销量list,笔数list, 挂载点, 总销量或利润)
    earch(uid, startTime, endTime, url, list, X, Y, Y2, el, all) {
      var _this = this;
      list = [];
      X = [];
      Y = [];
      Y2 = [];
      var setData = {
        uid: uid,
        create_time: ["between", startTime + "," + endTime]
      };
      // console.log(setData);
      _this.axios.post(url, setData).then(response => {
        // console.log("success" + JSON.stringify(response.data.return_msg));
        if (response.data.return_code === "success") {
          list = response.data.return_msg;
          var allNumber = 0;
          for (
            let index = 0;
            index < response.data.return_msg.length;
            index++
          ) {
            let sum = response.data.return_msg[index].sum;
            let count = response.data.return_msg[index].count;
            let days = response.data.return_msg[index].days;
            allNumber += parseFloat(sum);
            X.push(days);
            Y.push(sum);
            Y2.push(count);
          }
          _this.profitdAll = allNumber;
          _this.revenueTrend(el, X, Y, Y2);
        }
      });
    },
    //收入趋势
    revenueTrend(el, x, y, y2) {
      var _this = this;
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(el);
      // 指定图表的配置项和数据
      var option = {
        title: {
                text: '单位:元',      //主标题
                x:'50',
                textStyle:{
                    color:'#8c8c8c',        //颜色
                    fontStyle:'normal',     //风格
                    fontWeight:'normal',    //粗细
                    fontFamily:'Microsoft yahei',   //字体
                    fontSize:12,     //大小
                    align:'top'   //水平对齐
                }
        },
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: "50",
          top: "20",
          right: "10",
          bottom: "30"
        },
        xAxis: {
          data: x,
          axisLine: {
            lineStyle: {
              color: "#c8c8c8" //左边线的颜色
            }
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: "#8c8c8c"
            }
          }
        },
        yAxis: {
          type: "value",
          splitLine: {
            lineStyle: {
              type: "dashed" //虚线
            }
          },
          axisLine: {
            show: true,

            lineStyle: {
              color: "#c8c8c8" //左边线的颜色
            }
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: "#8c8c8c"
            }
          }
        },
        series: [
          {
            name: "收入",
            type: "line",
            smooth: true,
            data: y
          },
          {
            name: "笔数",
            type: "line",
            smooth: true,
            itemStyle: {
              normal: {
                color: "#8c8c8c"
              }
            },
            data: y2
          }
        ],
        color: ["#2d9aff"]
      };
      // 使用刚指定的配置项和数据显示图表。
      window.addEventListener("resize", () => {
        myChart.resize();
      });
      myChart.setOption(option);
    },
    // 提现验证
    verification() {
      var _this = this;
      if (_this.sendMoney == "" || _this.currentCode == "") {
        _this.$message({
          message: "请输入完整信息",
          type: "warning"
        });
        return false;
      }
      if (parseFloat(_this.sendMoney) != parseInt(_this.sendMoney)) {
        _this.$message({
          message: "请输入整数",
          type: "warning"
        });
        return false;
      }
      if (parseFloat(_this.sendMoney) <= 0) {
        _this.$message({
          message: "输入的金额应大于零",
          type: "warning"
        });
        return false;
      }
      if (parseFloat(_this.sendMoney) > parseFloat(_this.money)) {
        _this.$message({
          message: "账户余额不足",
          type: "warning"
        });
        return false;
      }
      _this.passBtn = true;
    }
  },
  filters: {
    statusJudje(val) {
      switch(val) {
        case 0:
          return val = '审核中';
          break;
        case 1:
          return val = '提现成功';
          break;
        default:
          return val = '审核中';
          break;
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "~css/mixin.scss";
.top {
  display: flex;
  align-items: stretch;
  width: 13.6rem;
  height: 1.33rem;
  background-color: #ffffff;
  font-size: 0.14rem;
  color: #797979;
  li {
    @extend %flexcc;
    width: 1.85rem;

    &:nth-child(1) {
      width: 2.14rem;
      div {
        p {
          margin-top: 0.13rem;
          color: #ff7b2b;
          span {
            font-size: 0.2rem;
          }
        }
      }
    }
    &:nth-child(2),
    &:nth-child(3) {
      div {
        p {
          margin-top: 0.13rem;
          font-size: 0.14rem;
          color: #72d2ff;
        }
      }
    }
    &:last-child {
      button {
        width: 1.4rem;
        height: 0.4rem;
        background-image: linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.1) 0%,
            rgba(255, 255, 255, 0.1) 100%
          ),
          linear-gradient(#2998f6, #2998f6);
        font-size: 0.16rem;
        line-height: 0.14rem;
        letter-spacing: 0.03rem;
        color: #fefefe;
        cursor: pointer;
      }
    }
    div {
      width: 100%;
      text-align: center;
    }
    .line {
      width: 0.01rem;
      height: 0.5rem;
      background-color: #e5e5e5;
    }
  }
}
.main {
  display: flex;
  margin-top: 0.3rem;
  width: 13.6rem;
  height: 2.99rem;
  background-color: #ffffff;
  .bill {
    width: 3.87rem;
    height: 2.99rem;
    font-size: 0.18rem;
    border-right: 0.02rem solid #eaeaea;
    box-sizing: border-box;
    .unconfirmed {
      margin-top: 0.65rem;
      text-align: center;
      font-size: 0.12rem;
      color: #606060;
      sapn {
        font-size: 0.18rem;
        color: #606060;
      }
      p {
        margin-bottom: 0.22rem;
        span {
          font-size: 0.12rem;
          color: #f89800;
        }
      }
    }
    .title {
      margin-left: 0.33rem;
      width: 2rem;
      height: 0.6rem;
      line-height: 0.6rem;
    }
  }
  .income {
    flex: 1;
    .title {
      flex: 1;
      display: flex;
      align-items: center;
      height: 0.83rem;
    }
    .content {
      margin: 0 auto;
      width: 6.83rem;
      height: 2.16rem;
      .echart {
        width: 6.8rem;
        height: 2.16rem;
      }
    }
  }
}
.bottom {
  width: 13.6rem;
  height: 3.37rem;
  margin-top: 0.22rem;
  background-color: #ffffff;
  .record-search {
    display: flex;
    flex-direction: column;
    width: 13.6rem;
    height: 1.13rem;
    background-image: linear-gradient(
        0deg,
        rgba(0, 0, 0, 0.1) 0%,
        rgba(255, 255, 255, 0.1) 100%
      ),
      linear-gradient(#f7f9fb, #f7f9fb);
    .title {
      flex: 1;
      height: 0.63rem;
      line-height: 0.63rem;
      font-size: 0.18rem;
      color: #3d3d3d;
      h1 {
        margin-left: 0.33rem;
      }
    }

    .center {
      display: flex;
      margin-left: 0.65rem;
      height: 100%;
      .time {
        height: 0.28rem;
        line-height: 0.28rem;

        margin-right: 0.26rem;
        font-size: 0.14rem;
        color: #000000;
      }
      .phase {
        height: 0.28rem;
        line-height: 0.28rem;
        margin-left: 0.26rem;
        margin-right: 0.26rem;

        font-size: 0.14rem;
        color: #000000;
      }
      .phase-list {
        display: flex;
        width: 1.65rem;
        height: 0.26rem;
        li {
          width: 0.55rem;
          min-width: 40px;
          height: 0.26rem;
          min-height: 20px;
          cursor: pointer;
          text-align: center;
          line-height: 0.26rem;
          font-size: 0.14rem;
          &.active {
            background-color: #2998f6;
            color: #ffffff;
          }
        }
      }
    }
  }
  .record-content {
    width: 13.6rem;
    background-color: #ffffff;
    .center {
      margin-left: 0.46rem;
      font-size: 0.12rem;
      color: #494949;
      ul {
        display: flex;
        width: 100%;
        height: 0.68rem;
        line-height: 0.68rem;
        border-bottom: 0.01rem solid #cbcbcb;
        box-sizing: border-box;
        &:not(:first-child) {
          height: 0.8rem;
          line-height: 0.8rem;
          li:nth-child(2) {
            font-size: 0.12rem;
            color: #919191;
          }
        }
        li {
          width: 2.5rem;
          &:nth-child(1) {
          }
          &:nth-child(2) {
            width: 5rem;
          }
          &:nth-child(3) {
            width: 3.6rem;
            text-align: center;
          }
          &:nth-child(4) {
            text-align: center;
          }
        }
      }
    }
  }
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 0.96rem;
  height: 0.28rem;
  background-color: #f4f4f4;
  .el-input--prefix .el-input__inner {
    padding: 0;
  }
}
@media screen and(max-width:1280px) {
  .record-content {
    ul:not(:first-child) {
      li:nth-child(2) {
        line-height: normal;
      }
    }
  }
}
</style>
<style lang="scss">
.income {
  .title {
    .el-dropdown {
      display: flex;
      width: 2.11rem;
      height: 0.35rem;
      margin-left: 0.86rem;
      line-height: 0.35rem;
      background-color: #ffffff;
      border-radius: 0.02rem;
      border: solid 0.01rem #dadada;
      box-sizing: border-box;
      span {
        flex: 1;
        display: flex;
        justify-content: space-between;
        width: 2.11rem;
        font-size: 0.16rem;
        color: #8c8c8c;
        .el-icon--left {
          margin-right: 0.14rem;
          line-height: 0.35rem;
        }
      }
    }
  }
}
.time-withdrawal {
  height: 0.28rem;
  line-height: 0.28rem;
  font-size: 0.12rem;
  .el-input__prefix,
  .el-input__suffix {
    display: none;
  }
  .el-input--prefix .el-input__inner,
  .el-input--suffix .el-input__inner {
    padding: 0;
  }
  .el-date-editor.el-input {
    width: 1.1rem;
  }
  .el-input__inner {
    width: 100%;
    height: 100%;
    padding: 0.02rem !important;
    padding-bottom: 0.03rem !important;
    cursor: pointer;
    font-size: 0.14rem;
    color: #181818;
    background-color: #f4f4f4;
    border-radius: 0;
    border: solid 0.01rem #acacac;
    box-sizing: border-box;
    &::-webkit-input-placeholder {
      color: #3c3c3c;
    }
  }
}
</style>

