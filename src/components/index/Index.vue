<template>
  <div class="index" tabindex="0" ref="index" id="index">
    <Header :countdownState.sync="countdownState" />
    <div :style="{position:'relative',zIndex:'10'}" v-if="headerIndex!=0">
      <!-- <Contact
        :class="{contactWapper:true,contactOut:headerIndex!=1&&headerIndex!=6?true:false,contactIn:headerIndex==1||headerIndex==6?true:false}"
      />-->
      <!-- <TaskTab class="contactWapper" v-if="headerIndex==10" /> -->
      <Contact
        class="contactWapper"
        v-if="headerIndex==1"
        :vitalityState.sync="vitalityState"
        :vitalityType.sync="vitalityType"
        :vitalityKey.sync="vitalityKey"
      />
      <Contact
        class="contactWapper"
        v-if="headerIndex==2"
        :vitalityState.sync="vitalityState"
        :vitalityType.sync="vitalityType"
        :vitalityKey.sync="vitalityKey"
      />
      <Message class="contactRightWapper" v-if="headerIndex==3" />
      <Search class="contactRightWapper" v-if="headerIndex==4" />
      <CountdownTab class="contactRightWapper" v-if="headerIndex==12" :countType="'index'" />
      <Note class="contactRightWapper" v-if="headerIndex==13" :countType="'index'" />
      <UserCenter class="contactRightWapper" v-if="headerIndex==14" :countType="'index'" />
      <UserHome class="contactRightWapper" v-if="headerIndex==15" :countType="'index'" />
    </div>
    <Content class="view" v-if="fullState===0" :countdownState.sync="countdownState" />
    <ChartData class="view" v-if="headerIndex==9" />
    <Chat class="chatView" v-show="headerIndex==11" />
    <Countdown class="countDownView" v-if="countdownState" :countdownState.sync="countdownState" />
    <Vitality
      v-if="vitalityState&&(headerIndex==1||headerIndex==2)"
      class="vitalityView"
      :vitalityState.sync="vitalityState"
      :vitalityType.sync="vitalityType"
      :vitalityKey.sync="vitalityKey"
    />
    <!--  class="vitalityView" -->
    <div class="bootpage-modal" v-if="bootPageState">
      <BootPage />
    </div>
    <div class="clockIn-icon" @click="clockInState=true">{{nowTime?"下班":"上班"}}</div>
    <ClockIn v-if="clockInState" :clockInState.sync="clockInState" />
    <CardInfo v-if="cardShowState" class="cardInfo" />
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "Index",
  data() {
    return {
      clockInState: false,
      countdownState: 0,
      vitalityState: false,
      vitalityType: 0,
      vitalityKey: 0,
    };
  },
  components: {
    Header: () => import("../header/Header"),
    Content: () => import("../content/Content"),
    Contact: () => import("../leftSide/contact/Contact"),
    Message: () => import("../leftSide/message/Message"),
    Search: () => import("../leftSide/search/Search"),
    TaskTab: () => import("../leftSide/taskTab/TaskTab"),
    ChartData: () => import("../leftSide/chartData/ChartData"),
    UserHome: () => import("./UserHome"),
    Countdown: () => import("./Countdown"),
    BootPage: () => import("./BootPage"),
    ClockIn: () => import("./ClockIn"),
    Vitality: () => import("./Vitality"),
    CountdownTab: () => import("./CountdownTab"),
    Chat: () => import("./Chat"),
    Note: () => import("./Note"),
    UserCenter: () => import("./UserCenter"),
    CardInfo: () => import("../content/cardInfo/CardInfo"),
  },
  computed: mapState({
    headerIndex: (state) => state.common.headerIndex,
    showState: (state) => state.common.showState,
    fullState: (state) => state.common.fullState,
    bootPageState: (state) => state.common.bootPageState,
    deviceState: (state) => state.common.deviceState,
    nowTime: (state) => state.common.nowTime,
    cardShowState: (state) => state.card.cardShowState,
  }),
  beforeMount() {
    if (this.deviceState == "mobile") {
      this.$router.push("/phoneTask");
    }
  },
  mounted() {
    if (localStorage.getItem("isFirstCreate")) {
      this.changeBootPageState(true);
    }
    this.$refs.index.focus();
    let that = this;
    this.$nextTick(() => {
      Array.from(document.querySelectorAll("svg")).forEach((item, index) => {
        if (
          item.parentElement.parentElement.style.width &&
          index != 0 &&
          index != 1
        ) {
          item.parentElement.parentElement.style.display = "none";
        }
      });
    });
  },
  methods: {
    ...mapActions("common", ["changeBootPageState"]),
  },
  watch: {
    headerIndex(newValue, oldValue) {
      if (newValue != oldValue) {
        this.vitalityState = false;
      }
    },
  },
};
</script>

<style scoped>
.index {
  width: 100%;
  display: flex;
  position: relative;
}
.view {
  width: calc(100% - 62px);
}
.chatView {
  width: calc(100% - 60px);
  height: 100%;
  position: fixed;
  top: 0px;
  left: 60px;
  z-index: 5;
}
.countDownView {
  width: calc(100% - 60px);
  position: fixed;
  top: 0px;
  left: 60px;
  z-index: 50;
}
.vitalityView {
  width: calc(100% - 360px);
  height: 100%;
  position: fixed;
  top: 0px;
  left: 360px;
  z-index: 50;
  background-color: rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
}
.contactWapper {
  width: 350px;
  height: 100%;
  border-right: 1px solid #d5d5d5;
  background-color: #fff;
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 4;
}
.contactRightWapper {
  width: 350px;
  height: calc(100% - 45px);
  border-right: 1px solid #d5d5d5;
  background-color: #fff;
  position: fixed;
  top: 45px;
  right: 0px;
  z-index: 4;
  box-shadow: -3px -2px 6px rgba(0, 0, 0, 0.4);
}
.bootpage-modal {
  position: absolute;
  z-index: 5;
  background-color: rgba(0, 0, 0, 0.35);
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.clockIn-icon {
  position: fixed;
  bottom: 40px;
  right: 5px;
  z-index: 9;
  width: 50px;
  height: 50px;
  background: rgba(252, 118, 106, 1);
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.29);
  border-radius: 50%;
  font-size: 14px;
  color: #fff;
  line-height: 50px;
  text-align: center;
  cursor: pointer;
}
</style>