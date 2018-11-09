<template>
  <div id="finance">
    <div class="commoditySales">
      <div class="title">
          <span>商品销量</span>
          <p>
            <span>总销量</span>
            <span>{{goodsAll}}</span>
          </p>
          <div class="time-input">
                <el-date-picker
                  v-model="goodsStart"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="timestamp"
                  el-input__prefix>
                </el-date-picker>
                &nbsp;-&nbsp;
                <el-date-picker
                  v-model="goodsEnd"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="timestamp"
                  @change="search(1)" 
                  el-input__prefix>
                </el-date-picker>
          </div>
      </div>
      <div class="echart" ref="commoditySales"  v-loading="true"></div>
    </div>
    <div class="profitStatistics">
           <div class="title">
          <span>利润统计</span>
          <p>
            <span>总利润 ￥</span>
            <span>{{profitdAll}}</span>
          </p>
          <div class="time-input">
                <el-date-picker
                  v-model="profitdStart"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="timestamp"
                  el-input__prefix>
                </el-date-picker>
                &nbsp;-&nbsp;
                <el-date-picker
                  v-model="profitdEnd"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="timestamp"
                  @change="search(2)" 
                  el-input__prefix>
                </el-date-picker>
          </div>
      </div>
      <div class="echart" ref="profitStatistics" v-loading="true"></div>
    </div>
    <div class="brandSales">
          <div class="title">
          <span>品牌销量统计</span>
              <div class="time-input">
                <el-date-picker
                  v-model="brandStart"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="timestamp"
                  el-input__prefix>
                </el-date-picker>
                &nbsp;-&nbsp;
                <el-date-picker
                  v-model="brandEnd"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="timestamp"
                  @change="search(3)" 
                  el-input__prefix>
                </el-date-picker>
          </div>
      </div>
      <div class="echart" ref="brandSales" v-loading="true"></div>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
export default {
  name: "Finance",
  data() {
    return {
      defaultStartTime: '',//所有图表默认开始时间
      defaultEndTime:'',//所有图表默认结束时间
      goodsStart: '',//商品销量开始时间
      goodsEnd: '',//商品销量结束时间
      goodsList:[],//商品销量列表
      goodsAll:0,//总销量
      goodsY:[],//商品销量
      goodsX:[],//商品时间
      // gLoading:true,

      profitdStart: '',//利润统计开始时间
      profitdEnd: '',//利润统计结束时间
      profitdList:[],//利润统计列表
      profitdAll:0,//总利润
      profitdY:[],//利润销量
      profitdX:[],//利润时间
      // pLoading:true,
      
      brandStart: '',//品牌销量开始时间
      brandEnd: '',//品牌销量结束时间
      brandList:[],//品牌销量列表
      brandY:[],//品牌销量
      brandX:[]//品牌时间
      // bLoading:true
    };
  },
  computed: {

  },
  mounted() {
    var _this = this;
    _this.defaultStartTime = new Date().getTime() / 1000 - 30*24*60*60 ;
    _this.defaultEndTime = new Date().getTime() / 1000 ;
    _this.goodsStart = _this.defaultStartTime*1000
    _this.profitdStart = _this.defaultStartTime*1000
    _this.brandStart = _this.defaultStartTime*1000
    _this.goodsEnd=_this.defaultEndTime*1000
    _this.profitdEnd=_this.defaultEndTime*1000
    _this.brandEnd=_this.defaultEndTime*1000
    _this.earch(userInfo.id, _this.defaultStartTime,  _this.defaultEndTime, 'goods/finance/index', _this.goodsList, _this.goodsX, _this.goodsY,_this.$refs.commoditySales, 'goodsAll','销量' );

    _this.earch(userInfo.id, _this.defaultStartTime,  _this.defaultEndTime, 'goods/finance/profit', _this.profitdList, _this.profitdX, _this.profitdY,_this.$refs.profitStatistics, 'profitdAll','利润' );

    _this.earch(userInfo.id, _this.defaultStartTime,  _this.defaultEndTime, 'goods/finance/brand', _this.brandList, _this.brandX, _this.brandY,_this.$refs.brandSales,'brandAll','销量' );
  },
  methods: {
    search(num) {
      var _this = this;
      if (num == 1) {
        _this.earch(userInfo.id, _this.goodsStart/1000,  _this.goodsEnd/1000, 'goods/finance/index', _this.goodsList, _this.goodsX, _this.goodsY,_this.$refs.commoditySales, 'goodsAll','销量' );
      } else if(num == 2){
        _this.earch(userInfo.id, _this.profitdStart/1000, _this.profitdEnd/1000, 'goods/finance/profit', _this.profitdList, _this.profitdX, _this.profitdY,_this.$refs.profitStatistics, 'profitdAll','利润' );
      } else if(num == 3){
        _this.earch(userInfo.id, _this.brandStart/1000,  _this.brandEnd/1000, 'goods/finance/brand', _this.brandList, _this.goodsX, _this.goodsY,_this.$refs.brandSales,'brandAll','销量' );
      }
    },
    // 数据赋值(uid,开始时间, 结束时间, 接口地址, 返回信息, 月份list, 销量list, 挂载点, 总销量或利润，text)
    earch(uid, startTime, endTime, url, list, X, Y, el, all, text) {
      var _this = this;
        list = [];
        X = [];
        Y = [];
        var setData = {
          uid:uid,
          create_time:['between',startTime +','+ endTime]
        }
        console.log(setData)
        _this.axios.post(url, setData).then((response) => {
          console.log('success' + JSON.stringify(response.data.return_msg))
          if (response.data.return_code === 'success') {
              list = response.data.return_msg;
              var allNumber = 0;
              for (let index = 0; index < response.data.return_msg.length; index++) {
                // 如果是品牌
                if (all == 'brandAll') {
                  let sum = response.data.return_msg[index].sum;
                  let days = response.data.return_msg[index].name;
                  allNumber += parseFloat(sum);
                  X.push(days)
                  Y.push(sum)
                } else{
                  let sum = response.data.return_msg[index].sum;
                  let days = response.data.return_msg[index].days;
                  allNumber += parseFloat(sum);
                  X.push(days)
                  Y.push(sum)
                }
              };
              switch (all) {
                case 'goodsAll':
                _this.goodsAll = allNumber;                  
                  break;
                case 'profitdAll':
                _this.profitdAll = allNumber;                  
                  break;
              }
              _this.commoditySales(el, X, Y, text)
          }
        })
    },
    // 生成销量图表
    commoditySales(el, x, y, text) {
      var _this = this;
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(el);
      // 指定图表的配置项和数据
      var option = {
        tooltip: {},
        grid: {
          left: "50",
          top: "10",
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
              color: "#000000"
            }
          }
        },
        yAxis: {
          axisLine: {
            show: false,
            lineStyle: {
              color: "#c8c8c8" //左边线的颜色
            }
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: "#000000"
            }
          }
        },
        series: [
          {
            name: text,
            type: "line",
            smooth: true,
            data: y
          }
        ],
        color: ["#2d9aff"]
      };
      // 使用刚指定的配置项和数据显示图表。
      window.addEventListener("resize", () => {
        myChart.resize();
      });
      myChart.setOption(option);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
#finance {
  display: flex;
  justify-content: space-between;
  align-content: space-between;
  flex-wrap: wrap;
  width: 13.57rem;
  height: 8.01rem;
  overflow: hidden;
  & > div {
    width: 6.58rem;
    height: 3.76rem;
    background-color: #ffffff;
  }
  .title {
    display: flex;
    align-items: center;
    width: 6.58rem;
    height: 0.7rem;
    font-size: 0.18rem;
    color: #3c3c3c;
    & > span {
      margin-left: 0.22rem;
      margin-right: 0.46rem;
    }
    p {
      span:first-child {
        font-size: 0.14rem;
        color: #7b7b7b;
      }
    }
  }
  .echart {
    width: 6.58rem;
    height: 3.06rem;
  }
}
.echart {
  width: 6.8rem;
  height: 3.5rem;
}
.time-withdrawal {
.el-date-editor.el-input, .el-date-editor.el-input__inner {
  width: 0.96rem;
	height: 0.21rem;
	background-color: #f4f4f4;
  .el-input--prefix .el-input__inner {
    padding: 0;
  }
}
  
}
</style>
<style lang="scss">
  .time-input {
        margin-left: auto;
        margin-right: 0.35rem;
        line-height: 0.21rem;
        .el-input__prefix, .el-input__suffix{
          display: none;
        }
        .el-input--prefix .el-input__inner,.el-input--suffix .el-input__inner {
          padding: 0;
        }
        .el-date-editor.el-input {
          width: 1.1rem;
        }
        .el-input__inner {
          width: 100%;
          height:100%;
          padding: 0.02rem !important;
          padding-bottom: 0.03rem !important;
          cursor: pointer;
          font-size: 0.14rem;
          color: #181818;
          background-color: #f4f4f4;
          border-radius: 0;
          border: solid 0.01rem #acacac;
          box-sizing: border-box;
          &::-webkit-input-placeholder{
               color: #3c3c3c;
        }
        }
  }
</style>
