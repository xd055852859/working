<template>
  <div class="bootpage">
    <div class="bootpage-nav">欢迎使用</div>
    <a-icon type="close" class="bootpage-close" @click="cancelBootPage" />
    <div class="bootpage-title">{{titleArr[imgIndex]}}</div>
    <div class="bootpage-container">
      <a-icon
        type="left"
        :style="imgIndex==0?{fontSize:'40px',color:'#fff'}:{fontSize:'40px',color:'#5B7C9C'}"
        @click="leftClick"
      />
      <a-icon :component="imgArr[imgIndex]" class="bootpage-img" />
      <a-icon
        type="right"
        :style="imgIndex==3?{fontSize:'40px',color:'#fff'}:{fontSize:'40px',color:'#5B7C9C'}"
        @click="rightClick"
      />
    </div>
    <div class="bootpage-footer">
      <div
        v-for="(item,index) in 4"
        :key="index"
        class="bootpage-point"
        :style="{backgroundColor:index==imgIndex?'#5B7C9C':'#D8D8D8'}"
        @click="pointClick(index)"
      ></div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Bootpage1 from "../common/svg/bootpage1.svg";
import Bootpage2 from "../common/svg/bootpage2.svg";
import Bootpage3 from "../common/svg/bootpage3.svg";
import Bootpage4 from "../common/svg/bootpage4.svg";
export default {
  name: "BootPage",
  data() {
    return {
      imgArr: [Bootpage1, Bootpage2, Bootpage3, Bootpage4],
      titleArr: [
        "全新界面，让工作更高效更愉悦",
        "群聊面板，实现团队无缝协作",
        "强大云端，支持图文一键快捷分享",
        "全局管控，为管理者提供决策支持"
      ],
      imgIndex: 0
    };
  },
  methods: {
    ...mapActions("common", ["changeBootPageState"]),
    leftClick() {
      if (this.imgIndex != 0) {
        this.imgIndex = this.imgIndex - 1;
      }
    },
    rightClick() {
      if (this.imgIndex != 3) {
        this.imgIndex = this.imgIndex + 1;
      }
    },
    pointClick(index) {
      this.imgIndex = index;
    },
    cancelBootPage() {
      this.changeBootPageState(false);
      localStorage.removeItem("isFirstCreate");
    }
  }
};
</script>

<style scoped>
.bootpage {
  width: 906px;
  height: 603px;
  background-color: #fff;
  position: relative;
}
.bootpage-nav {
  width: 100%;
  height: 37px;
  margin: 36px 0px;
  font-size: 21px;
  color: #23384b;
  text-align: center;
  line-height: 37px;
}
.bootpage-close {
  position: absolute;
  top: 36px;
  right: 52px;
  font-size: 20px;
}
.bootpage-title {
  width: 100%;
  height: 48px;
  font-size: 34px;
  color: #23384b;
  text-align: center;
  margin-bottom: 46px;
}
.bootpage-container {
  width: 100%;
  height: 350px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 52px;
  box-sizing: border-box;
}
.bootpage-img {
  width: 400px;
  height: 400px;
  font-size: 430px;
}
.bootpage-footer {
  height: 15px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.bootpage-point {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 20px;
}
</style>