<template>
  <div id="Class">
    <!-- 商品 -->
    <div class="goods-list">
      <!-- 搜索 -->
      <div class="search">
        <input type="text" placeholder=" 商品名称" v-model="goodsName" @keyup.enter="search">
        <div class="search-icon" @click="search">
          <img src="~img/icon/search.png" alt="">
        </div>
      </div>
      <!-- 头部 -->
      <ul class="heade">
        <li>商品名称</li>
        <li>进货价格</li>
        <li>出货价格</li>
        <li>库存</li>
        <li>总销量</li>
        <li>操作</li>
      </ul>
      <div class="choose-list">
        <img class="" src="~img/icon/default.png" @click="checkedAll" v-if="chooseAllText == '全选'" />
        <img class="" src="~img/icon/active.png" @click="checkedAll" v-if="chooseAllText == '全不选'" />
        <label for="all-checkbox" @click="checkedAll">{{chooseAllText}}</label>
        <!-- <span class="remove">删除</span> -->
        <span class="cancel" @click="sendAll(0)" v-if="isPutawaStatus == 1">下架</span>
        <span class="cancel" @click="sendAll(1)" v-if="isPutawaStatus == 0">上架</span>
        <span class="delivery" @click="addGoods">上新货</span>
        <el-select v-model="isPutawaStatus" @change="getList" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="body" >
        <!-- order start -->
        <div class="main" v-for="(item, index) in goodsList" :key="index">
          <ul class="goods-content" :class="{'no-active': item.status == 0}">
            <li>
              <img class="check" src="~img/icon/default.png" @click="checkCurrent(index)" v-show="!item.checked" />
              <img class="check" src="~img/icon/active.png" @click="checkCurrent(index)" v-show="item.checked" />
              <img :src="item.goods_pic | imgSrc" alt="">
              <div class="goods-name">
                <p>{{item.goods_name}}</p>
              </div>
            </li>
            <li class="modify">
              <span>￥{{item.goods_purchase_price}}</span>
              <!-- <img src="~img/icon/modify .png" alt=""> -->
            </li>
            <li class="modify">
              <span>￥{{item.goods_price}}</span>
              <!-- <img src="~img/icon/modify .png" alt=""> -->
            </li>
            <!-- 库存 -->
            <li class="modify">
              <span>{{item.stock}}</span>
              <!-- <img src="~img/icon/modify .png" alt=""> -->
            </li>
            <!-- 销量 -->
            <li class="modify">
              <span>{{item.sum}}</span>
              <!-- <img src="~img/icon/modify .png" alt=""> -->
            </li>
            <li @click="editorGoods(item, index)">
              <span>编辑商品</span>
              <!-- <span  v-if="item.status == 0">已下架(编辑)</span> -->
            </li>
          </ul>
        </div>
        <!-- goods end -->
        <!-- 编辑商品弹窗 -->
        <el-dialog title="商品信息" :visible.sync="dialogVisible" width="70%" @click="dialogVisible = false">
          <el-form :model="editor" ref="editor" label-width="100px" class="demo-ruleForm">
            <el-form-item label="商品定价">
              <el-input v-model="editor.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="建议零售价">
              <el-input v-model="editor.goods_retail_price" :disabled="true"></el-input>
            </el-form-item>
            <!-- 商品独立编码 -->
            <el-form-item label="商品编码">
              <el-input v-model="editor.uid_goods_card"></el-input>
            </el-form-item>
            <!-- 为你优选 -->
            <el-form-item label="为你优选">
              <el-radio-group v-model="editor.goods_optimization">
                <el-radio :label="1">已选</el-radio>
                <el-radio :label="0">未选</el-radio>
              </el-radio-group>
            </el-form-item>
            <!-- 优惠专区 -->
            <el-form-item label="优惠专区">
              <el-radio-group v-model="editor.goods_giscount">
                <el-radio :label="1">已选</el-radio>
                <el-radio :label="0">未选</el-radio>
              </el-radio-group>
            </el-form-item>
            <!-- 热销推荐 -->
            <el-form-item label="热销推荐">
              <el-radio-group v-model="editor.goods_recommend">
                <el-radio :label="1">已选</el-radio>
                <el-radio :label="0">未选</el-radio>
              </el-radio-group>
            </el-form-item>
            <!-- 排序 -->
            <el-form-item label="排序" prop="name">
              <el-input v-model="editor.sort"></el-input>
            </el-form-item>
            <!-- 状态 -->
            <el-form-item label="状态">
              <el-radio-group v-model="editor.status">
                <el-radio :label="1">启用</el-radio>
                <el-radio :label="0">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm">确认修改</el-button>
              <el-button @click="dialogVisible = false">取消</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
        <!-- 上新货弹窗 -->
        <el-dialog title="商品信息" :visible.sync="addVisible" width="70%" @click="close">
          <el-form :model="add" ref="add" label-width="100px" class="demo-ruleForm">
            <el-form-item label="一级分类">
              <el-select v-model="pidTwo" placeholder="请选择分类" @change="classifyTwo">
                <el-option v-for="(item, index) in pidOneList" :key="index" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="二级分类">
              <el-select v-model="pidThree" placeholder="请选择分类" @change="classifyThree">
                <el-option v-for="(item, index) in pidTwoList" :key="index" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="三级分类">
              <el-select v-model="pidFour" placeholder="请选择分类" @change="classifyFour">
                <el-option v-for="(item, index) in pidThreeList" :key="index" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="商品列表">
              <el-select v-model="add" placeholder="请选择分类" @change="selectedGoods" value-key="id">
                <el-option v-for="item in pidFourList" :key="item.id" :label="item.goods_name" :value="item">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="商品定价">
              <el-input v-model="add.goods_price"></el-input>
            </el-form-item>
            <!-- 商品编码 -->
            <el-form-item label="商品编码">
              <el-input v-model="add.uid_goods_card"></el-input>
            </el-form-item>
            <el-form-item label="建议零售价">
              <el-input v-model="add.goods_retail_price" :disabled="true"></el-input>
            </el-form-item>
            <!-- 为你优选 -->
            <el-form-item label="库存">
              <el-input v-model="add.stock"></el-input>
            </el-form-item>
            <!-- 其他参数 -->
            <el-form-item label="形态">
              <el-input v-model="add.goods_form" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="规格">
              <el-input v-model="add.goods_specifications" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="执行标准">
              <el-input v-model="add.goods_standard" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="参数（含量）">
              <el-input v-model="add.goods_parameter" :disabled="true"></el-input>
            </el-form-item>
            <!-- 为你优选 -->
            <el-form-item label="为你优选">
              <el-radio-group v-model="add.goods_optimization">
                <el-radio :label="1">已选</el-radio>
                <el-radio :label="0">未选</el-radio>
              </el-radio-group>
            </el-form-item>
            <!-- 优惠专区 -->
            <el-form-item label="优惠专区">
              <el-radio-group v-model="add.goods_giscount">
                <el-radio :label="1">已选</el-radio>
                <el-radio :label="0">未选</el-radio>
              </el-radio-group>
            </el-form-item>
            <!-- 热销推荐 -->
            <el-form-item label="热销推荐">
              <el-radio-group v-model="add.goods_recommend">
                <el-radio :label="1">已选</el-radio>
                <el-radio :label="0">未选</el-radio>
              </el-radio-group>
            </el-form-item>
            <!-- 排序 -->
            <el-form-item label="排序" prop="name">
              <el-input v-model="add.sort"></el-input>
            </el-form-item>
            <!-- 状态 -->
            <el-form-item label="状态">
              <el-radio-group v-model="add.status">
                <el-radio :label="1">启用</el-radio>
                <el-radio :label="0">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="addNewGoods">确定添加</el-button>
              <el-button @click="close">取消</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
        <!-- 分页 -->
        <el-pagination background layout="prev, pager, next" @current-change="handleSize" :current-page="page" :page-size="perPage" :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Class",
  data() {
    return {
      isPutawaStatus: 1,//当前上架状态(默认显示上架1)
      options: [{
          value: 1,
          label: '已上架商品'
        }, {
          value: 0,
          label: '已下架商品'
        }],
      dialogVisible: false, //编辑弹窗
      addVisible: false, //上新货弹窗
      chooseAllText: "全选",
      page: 1, //当前页数
      perPage: 0, //每页数量
      total: 0, //总数量
      goodsList: [], //订单列表
      goodsName: "", //搜索内容

      editor: {}, //编辑的商品信息

      pidOneList: "", //一级分类列表
      pidTwo: "", //id获取二级分类(点击的一级分类id)
      pidTwoList: "", //二级分类列表
      pidThree: "", //id获取三级分类(点击的二级分类id)
      pidThreeList: "", //三级分类列表
      pidFour: "", //id获取商品列表(点击的三级分类id)
      pidFourList: "", //商品列表
      addStatus: false, //是否可以点击添加
      add: {} //上新货的其中一个商品信息
    };
  },
  created() {
    var _this = this;
    var setData = {
      uid: userInfo.id,
      page: 1,
      status: _this.isPutawaStatus,
      goods_name: ["like", "%" + _this.goodsName + "%"]
    };
    _this.getGoodsList(setData);
  },
  methods: {
    // 上新货
    addGoods() {
      var _this = this;
      _this.addVisible = true;
      // 获取一级分类
      var setData = {
        pid: 0,
        model: 1
      };
      _this.axios.post("goods/goods/gettypes", setData).then(response => {
        if (
          response.data.return_code === "success" &&
          response.data.return_msg.length > 0
        ) {
          _this.pidOneList = response.data.return_msg;
        }
      });
    },
    // 获取二级分类
    classifyTwo() {
      var _this = this;
      var setData = {
        pid: _this.pidTwo,
        model: 2
      };

      _this.axios.post("goods/goods/gettypes", setData).then(response => {
        if (
          response.data.return_code === "success" &&
          response.data.return_msg.length > 0
        ) {
          _this.pidTwoList = response.data.return_msg;
        }
      });
    },
    // 获取三级分类
    classifyThree() {
      var _this = this;
      var setData = {
        pid: _this.pidThree,
        model: 3
      };
      _this.axios.post("goods/goods/gettypes", setData).then(response => {
        if (
          response.data.return_code === "success" &&
          response.data.return_msg.length > 0
        ) {
          // console.log(JSON.stringify(response.data.return_msg))
          _this.pidThreeList = response.data.return_msg;
        }
      });
    },
    //获取新货列表(四级)
    classifyFour() {
      var _this = this;
      var setData = {
        type_id_one: _this.pidTwo,
        type_id_two: _this.pidThree,
        type_id_three: _this.pidFour
      };
      _this.axios.post("goods/template/index", setData).then(response => {
        if (
          response.data.return_code === "success" &&
          response.data.return_msg.data.length > 0
        ) {
          _this.pidFourList = response.data.return_msg.data;
          // console.log(JSON.stringify(_this.pidFourList))
        }
      });
    },
    // 点击商品
    selectedGoods() {
      var _this = this;
      _this.addStatus = true;
      console.log(JSON.stringify(_this.add));
    },
    // 全选
    checkedAll() {
      var _this = this;
      if (_this.chooseAllText == "全选") {
        _this.chooseAllText = "全不选";
        for (let i = 0; i < _this.goodsList.length; i++) {
          _this.goodsList[i].checked = true;
        }
      } else {
        _this.chooseAllText = "全选";
        for (let i = 0; i < _this.goodsList.length; i++) {
          _this.goodsList[i].checked = false;
        }
      }
      // console.log(JSON.stringify(_this.goodsList))
    },
    //选择当前商品
    checkCurrent(index) {
      var _this = this;
      _this.goodsList[index].checked = !_this.goodsList[index].checked;
      // console.log(JSON.stringify(_this.goodsList))
    },
    // 所有商品下架0/上架1
    sendAll(status) {
      var _this = this;
      // 循环所有商品
      var setData = [];
      for (let i = 0; i < _this.goodsList.length; i++) {
        // 判断当前商品是否选中
        if (_this.goodsList[i].checked) {
          var time = parseInt(new Date() / 1000);
          var object = {
            // uid: userInfo.id,//不需要
            id: _this.goodsList[i].id,
            update_time: time,
            status: status
          };
          setData.push(object);
        }
      }
      if (setData.length == 0) {
        _this.$message({
          message: "请选择商品",
          type: "warning"
        });
        return false;
      }
      console.log(JSON.stringify(setData));
      // 发送选中的下架商品
      _this.axios.post("goods/goods/edit", setData).then(response => {
        var data = response.data;
        if (data.return_code === "success") {
          _this.$message({
            message: "操作成功",
            type: "success"
          });
          _this.dialogVisible = false;
          _this.updateGoodsList();
        } else {
          _this.$message({
            message: "操作失败,请重试",
            type: "warning"
          });
        }
      });
    },
    // 编辑商品
    editorGoods(item, index) {
      var _this = this;
      _this.dialogVisible = true;
      _this.editor = item;
    },
    // 提交修改
    submitForm() {
      var _this = this;
      if (
        _this.editor.goods_price == "" ||
        parseInt(_this.editor.goods_price) !=
          parseFloat(_this.editor.goods_price)
      ) {
        _this.$message({
          message: "价格不能为空,请输入整数",
          type: "warning"
        });
        return false;
      }
      if (
        _this.editor.sort == "" ||
        parseInt(_this.editor.sort) != parseFloat(_this.editor.sort)
      ) {
        _this.$message({
          message: "排序不能为空,请输入整数",
          type: "warning"
        });
        return false;
      }
      var setData = [
        {
          //数组形式，编辑接口是[{},{}]格式
          // uid:userInfo.id,//不需要
          id: _this.editor.id,
          goods_price: _this.editor.goods_price,
          uid_goods_card: _this.editor.uid_goods_card,
          goods_optimization: _this.editor.goods_optimization,
          goods_giscount: _this.editor.goods_giscount,
          goods_recommend: _this.editor.goods_recommend,
          sort: _this.editor.sort,
          status: _this.editor.status
        }
      ];
      console.log(JSON.stringify(setData));
      _this.axios.post("goods/goods/edit", setData).then(response => {
        var data = response.data;
        if (data.return_code === "success") {
          _this.$message({
            message: "修改成功",
            type: "success"
          });
          _this.dialogVisible = false;
          _this.updateGoodsList();
        } else {
          _this.$message({
            message: "修改失败,请重试",
            type: "warning"
          });
        }
      });
    },
    // 上新货
    addNewGoods() {
      var _this = this;
      if (
        _this.add.goods_price == "" ||
        parseInt(_this.add.goods_price) != parseFloat(_this.add.goods_price)
      ) {
        _this.$message({
          message: "价格不能为空,请输入整数",
          type: "warning"
        });
        return false;
      }
      if (
        _this.add.sort == "" ||
        parseInt(_this.add.sort) != parseFloat(_this.add.sort)
      ) {
        _this.$message({
          message: "排序不能为空,请输入整数",
          type: "warning"
        });
        return false;
      }
      var time = parseInt(new Date() / 1000);
      // var setData = {
      //   // id:"77",
      //   uid:userInfo.uid,
      //   goods_card:_this.add.goods_card,
      //   type_id_one:_this.add.type_id_one,
      //   type_id_two:_this.add.type_id_two,
      //   type_id_three:_this.add.type_id_three,
      //   goods_name:_this.add.goods_name,
      //   goods_brand_id:_this.add.goods_brand_id,
      //   goods_form:_this.add.goods_form,
      //   goods_specifications:_this.add.goods_specifications,
      //   goods_standard:_this.add.goods_standard,
      //   goods_parameter:_this.add.goods_parameter,
      //   goods_manufactor_id:_this.add.goods_manufactor_id,
      //   goods_purchase_price:_this.add.goods_purchase_price,
      //   goods_retail_price:_this.add.goods_retail_price,
      //   goods_content:_this.add.goods_content,
      //   goods_pic:_this.add.goods_pic,
      //   update_time:_this.add.update_time,
      //   sort:_this.add.sort,
      //   status:_this.add.status,
      //   goods_price:_this.add.goods_price,
      //   uid_goods_card:_this.add.uid_goods_card,
      //   province:userInfo.province,
      //   city:userInfo.city,
      //   country:userInfo.country,
      //   town:userInfo.town,
      //   goods_optimization:_this.add.goods_optimization,
      //   goods_giscount:_this.add.goods_giscount,
      //   stock:_this.add.stock
      // }
      // _this.add.id = '77';
      _this.add.uid = userInfo.id;
      _this.add.goods_pic = _this.add.goods_pic_id;
      _this.add.province = userInfo.province;
      _this.add.city = userInfo.city;
      _this.add.country = userInfo.country;
      _this.add.town = userInfo.town;
      _this.add.update_time = time;
      delete _this.add.id;
      delete _this.add.model;
      delete _this.add.create_time;
      if (_this.addStatus == false) {
        return false;
      }
      console.log(JSON.stringify(_this.add));
      _this.axios.post("goods/goods/add", _this.add).then(response => {
        var data = response.data;
        if (data.return_code === "success") {
          console.log(JSON.stringify(data.return_msg));

          _this.$message({
            message: "添加成功",
            type: "success"
          });
          // _this.addStatus = false;
          _this.addVisible = false;
          // _this.add = {};
          _this.updateGoodsList();
        } else {
          _this.$message({
            message: "添加失败,请重试",
            type: "warning"
          });
          // _this.add = {};
          // _this.addStatus = false;
          _this.addVisible = false;
        }
      });
    },
    close() {
      var _this = this;
      // _this.add = {};
      // _this.addStatus = false;
      _this.addVisible = false;
    },
    // 搜索
    search() {
      var _this = this;
      var setData = {
        uid: userInfo.id,
        page: 1,
        status: _this.isPutawaStatus,
        goods_name: ["like", "%" + _this.goodsName + "%"]
      };
      _this.getGoodsList(setData);
      _this.page = 1;
    },
    // 上下架商品切换
    getList() {
      var _this = this;
      _this.search();
    },
    // 获取所有商品列表
    getGoodsList(params) {
      var _this = this;
      _this.axios.post("goods/goods/index_uid", params).then(response => {
        var resfult = response.data;
        if (resfult.return_msg.data.length > 0) {
          _this.goodsList = resfult.return_msg.data;
          _this.total = resfult.return_msg.total;
          _this.perPage = resfult.return_msg.per_page;
          _this.chooseAllText = "全选"
        } else {
          _this.goodsList = [];
          _this.total = 0;
          _this.perPage = 0;
          _this.$message({
            message: "暂无此商品信息",
            type: "warning"
          });
        }
      });
    },
    // 点击分页
    handleSize(page) {
      var _this = this;
      _this.page = page;
      var setData = {
        uid: userInfo.id,
        page: _this.page,
        status: _this.isPutawaStatus,
        goods_name: ["like", "%" + _this.goodsName + "%"]
      };
      _this.getGoodsList(setData);
    },
    updateGoodsList() {
      var _this = this;
      var setData = {
        uid: userInfo.id,
        page: _this.page,
        status: _this.isPutawaStatus,
        goods_name: ["like", "%" + _this.goodsName + "%"]
      };
      _this.getGoodsList(setData);
    }
  },
  watch: {
    goodsName(val) {
      var _this = this;
      if (!val) {
        var setData = {
          uid: userInfo.id,
          page: 1,
          status: _this.isPutawaStatus,
          goods_name: ["like", "%" + _this.goodsName + "%"]
        };
        _this.getGoodsList(setData);
      }
    }
  },
  filters: {
    imgSrc(val) {
      var src = val.split("#");
      return src[0];
    }
  }
};
</script>

<style lang="scss" scoped>
#Class {
  background-color: #ffffff;
}
.choose-list {
  margin: 0 auto;
  width: 13.6rem;
  height: 0.58rem;
  line-height: 0.58rem;
  font-size: 0.14rem;
  color: #636363;
  border-bottom: 0.01rem solid #eaeaea;
  box-sizing: border-box;
  img {
    width: 0.3rem;
    height: 0.3rem;
    max-width: 18px;
    max-height: 18px;
    vertical-align: middle;
    margin-left: 0.41rem;
    cursor: pointer;
  }
  label {
    margin-left: 0.12rem;
    margin-right: 0.12rem;
    cursor: pointer;
  }
  .delivery,
  .cancel,
  .remove {
    padding: 0.07rem 0.19rem;
    cursor: pointer;
    background-color: #f3f3f3;
    border-radius: 0.04rem;
    border: solid 0.01rem #d3d3d3;
  }
  .cancel {
    margin-right: 1.14rem;
  }
}
.goods-list {
  .heade,
  .main {
    display: flex;
    align-items: center;
    margin: 0 auto;
    width: 13.6rem;
    height: 0.42rem;
    line-height: 0.42rem;
    color: #666666;
    background-color: #f3f3f3;
    font-size: 0.16rem;
    text-align: center;
    li {
      width: 1.85rem;
      color: #262626;
      &:nth-child(1) {
        width: 4.35rem;
      }
    }
  }
  .heade {
    li {
      background-color: #f1fbff;
    }
  }
  .body {
    overflow: auto;
    position: absolute;
    top: 1.7rem;
    bottom: 0.75rem;
    width: 13.6rem;
    background-color: #ffffff;
    &::-webkit-scrollbar {
      display: none;
    }
  }

  .main {
    display: flex;
    flex-direction: column;
    height: 1.03rem;
    color: #111111;
    text-align: left;
    background-color: #ffffff;
    &:hover {
      background-color: #fafafa;
    }
    &:first-child {
      border-top: 0.01rem solid #eaeaea;
    }
    .check {
      max-width: 18px;
      max-height: 18px;
      width: 0.3rem !important;
      height: 0.3rem !important;
      vertical-align: middle !important;
      margin-left: 0.41rem !important;
    }
    .goods-content {
      display: flex;
      justify-content: space-between;
      align-content: center;
      width: 13.6rem;
      height: 1.18rem;
      background-color: #ffffff;
      border-bottom: solid 0.01rem #cdcdcd;
      border-top: none;
      box-sizing: border-box;
      li {
        overflow: hidden;
        width: 1.85rem;
        height: 1.18rem;
        &:nth-child(2),
        &:nth-child(3),
        &:nth-child(4),
        &:nth-child(5),
        &:nth-child(6) {
          line-height: 1.18rem;
        }
        &:nth-child(2) {
          color: #ff782d;
        }
        &:nth-child(3) {
          color: #ff782d;
        }
        &:nth-child(6) {
          cursor: pointer;
          color: #10c55b;
        }
        text-align: center;
      }
      li:first-child {
        display: flex;
        align-items: center;
        width: 4.35rem;
        input {
          margin-left: 0.41rem;
        }
        img {
          width: 0.68rem;
          height: 0.58rem;
          margin-left: 0.29rem;
          margin-right: 0.24rem;
          cursor: pointer;
        }
        .goods-name {
          width: 2.51rem;
          overflow: hidden;
          text-overflow: ellipsis;
          display: box;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          font-size: 0.14rem;
          color: #2a2a2a;
          text-align: left;
        }
      }
    }
  }
}
.modify {
  img {
    vertical-align: middle;
    width: 0.22rem;
    height: 0.22rem;
  }
}
.search {
  position: absolute;
  right: 0;
  top: 0.3rem;
  display: flex;
  align-items: center;
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
.el-select {
  width: 100%;
}

.no-active {
  opacity: 0.8;
}
.choose-list {
  .el-select {
    display: inline-block;
    width: auto;
    float: right;
  }
}
</style>
<style lang="scss">
.choose-list {
  .el-input__inner{
    height: 0.4rem !important;
  }
}
</style>


