<template>
  <div class="wrapper">
    <v-header></v-header>
    <v-bar></v-bar>
    <div class="content-box">
      <v-tags></v-tags>
      <div class="content">
        <transition name="move" mode="out-in">
          <!-- <keep-alive :include="tagsList"> -->
            <router-view></router-view>
          <!-- </keep-alive> -->
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import vHeader from "common/Header";
import vBar from "common/SideBar";
import vTags from "common/Tags";

export default {
  data() {
    return {};
  },
  components: {
    vHeader,
    vBar,
    vTags
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.content-box {
  position: absolute;
  left: 200px;
  right: 0;
  top: 70px;
  bottom: 0;
  padding-bottom: 30px;
  transition: left 0.3s ease-in-out;
  background: #f0f0f0;
  .content {
    width: auto;
    height: 100%;
    padding: 10px;
    overflow-y: scroll;
    box-sizing: border-box;
  }
}
</style>