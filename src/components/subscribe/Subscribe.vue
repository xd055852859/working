<template>
  <div class="subscribe">
    <div class="subscribe-wrapper">
      <div class="subscribe-wrapper-title">
        <div class="subscribe-wrapper-title-button">
          <div
            :class="{'subscribe-wrapper-title-hover':hoverState==0?true:false}"
            @click="()=>{this.hoverState=0}"
          >订阅</div>
          <div
            :class="{'subscribe-wrapper-title-hover':hoverState==1?true:false}"
            @click="()=>{this.hoverState=1}"
          >推荐</div>
          <div
            :class="{'subscribe-wrapper-title-hover':hoverState==2?true:false}"
            @click="()=>{this.hoverState=2}"
          >附近</div>
        </div>
      </div>
      <div class="subscribe-wrapper-container">
        <div class="subscribe-wrapper-container-item" v-for="(item,index) in 9" :key="index">
          <div class="subscribe-wrapper-container-img">
            <img
              :src="'https://cdn.jsdelivr.net/gh/froala/design-blocks@2.0.1/dist/imgs/people/'+(index+1)+'.jpg'"
              alt
            />
          </div>
          <div class="subscribe-wrapper-container-title">我的微站</div>
        </div>
      </div>
    </div>
    <div class="content-container">
      <iframe src="https://baoku.qingtime.cn/sgkj" width="100%" height="100%"></iframe>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Subscribe",
  data() {
    return {
      hoverState: 0
    };
  },
  computed: mapState({
    user: state => state.auth.user
  })
};
</script>

<style scoped>
.subscribe {
  display: flex;
}
.subscribe-wrapper {
  width: 300px;
  height: 100%;
  border-right: 1px solid #d5d5d5;
  background: #f5f5f5;
}
.subscribe-wrapper-title {
  width: 100%;
  height: 90px;
  padding-bottom: 15px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  border-bottom: 1px solid #dddddd;
}
.subscribe-wrapper-title-button {
  width: 228px;
  height: 39px;
  display: flex;
  background: #fff;
}
.subscribe-wrapper-title-button > div {
  width: 86px;
  height: 39px;
  /* background: #1aca8e; */
  border: 1px solid #d5d5d5;
  color: #fff;
  font-size: 14px;
  color: #23384b;
  line-height: 39px;
  text-align: center;
  cursor: pointer;
}
.subscribe-wrapper-title-button > div:nth-child(1) {
  border-radius: 6px 0px 0px 6px;
}
.subscribe-wrapper-title-button > div:nth-child(3) {
  border-radius: 0px 6px 6px 0px;
}
.subscribe-wrapper-title-button .subscribe-wrapper-title-hover {
  color: #fff;
  background: #1aca8e;
  border: 1px solid #1aca8e;
}
.subscribe-wrapper-container {
  width: 100%;
  height: calc(100% - 90px);
  overflow: auto;
}

.subscribe-wrapper-container-item {
  width: 262px;
  height: 77px;
  padding: 0px 17px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #23384b;
  margin: 22px 22px 19px 16px;
  background-color: #fff;
}
.subscribe-wrapper-container-item .subscribe-wrapper-container-img {
  width: 40px;
  height: 40px;
  overflow: hidden;
  margin-right: 15px;
}
.subscribe-wrapper-container-item .subscribe-wrapper-container-img img {
  width: 100%;
  height:100%;
  object-fit: cover;
}
</style>