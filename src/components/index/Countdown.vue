<template>
  <!-- :style="{backgroundImage:'url('+bgImg+')'}" -->
  <div :style="countdownState==1?{width:'100%',height:'100%'}:{width:'350px'}">
    <div class="countdown" v-if="countdownState==1">
      <div class="countdown-left">
        <!-- <a-Icon :component="rightImg" />      -->
        <!-- <a-icon
        :component="rightImg"
    
        />-->
        <img :src="rightImg" :style="{right: clearState?'330px':'30px'}" class="countdown-left-img" />
        <div class="countdown-left-info" v-if="cardState">
          <div class="countdown-left-group">{{countDownDetail|defaultGroupName}}</div>
          <div class="countdown-left-title">
            <img :src="unfinishImg" alt @click="finishTask" v-if="countDownTime!=0" />
            <img :src="finishImg" alt v-if="countDownTime==0" />
            {{countDownDetail.title}}
          </div>
          <div class="countdown-left-now">
            <div>任务倒计时</div>
            <div>{{downTime}}</div>
          </div>
          <div class="countdown-left-time">
            <!-- <div class="countdown-left-time-item">{{this.timeArray[0][0]}}</div>
          <div class="countdown-left-time-item">{{this.timeArray[0][1]}}</div>
          <div class="countdown-left-time-item" :style="{lineHeight:'55px'}">:</div>
          <div class="countdown-left-time-item">{{this.timeArray[1][0]}}</div>
          <div class="countdown-left-time-item">{{this.timeArray[1][1]}}</div>
          <div class="countdown-left-time-item" :style="{lineHeight:'55px'}">:</div>
          <div class="countdown-left-time-item">{{this.timeArray[2][0]}}</div>
            <div class="countdown-left-time-item">{{this.timeArray[2][1]}}</div>-->
            <FlipClock :now="countDownTime" />
          </div>
          <div class="countdown-left-progress">
            <a-progress
              :percent="countDownPercent"
              :strokeColor="'#B7C8F1'"
              :showInfo="false"
              :strokeWidth="3"
              :style="{width:'100%'}"
            />
          </div>
          <div class="countdown-left-time-icon" v-if="countDownTime!=0 && !clearState">
            <div class="countdown-left-time-icon-item">
              <img :src="playImg" alt @click="playCountdown(0,countDownDetail)" v-if="playState" />
              <img :src="pauseImg" alt @click="playCountdown(1,countDownDetail)" v-if="!playState" />
              <div>开始/暂停</div>
            </div>
          </div>
        </div>
        <div
          class="countdown-left-info"
          v-if="!cardState"
          :style="{fontSize:'38px',  justifyContent: 'center'}"
        >
          <div>暂无专注</div>
        </div>
        <div class="countdown-left-footer-info" v-if="!clearState">
          <div class="countdown-left-footer-avatar">
            <div>
              <img :src="user.profile.avatar" />
            </div>
            <div>{{user.profile.nickName}}</div>
          </div>
          <div class="countdown-left-footer-left">
            <!-- <div :style="{fontSize:'30px'}">{{countDownData.taskNumber?countDownData.taskNumber:0}}</div>
            <div>今日完成</div>-->
            <div :style="{fontSize:'25px'}">{{nowNoon}} {{nowTime}}</div>
            <div>{{nowDate}}</div>
          </div>
          <!-- <div class="countdown-left-footer-center">
          <div :style="{fontSize:'30px'}">{{finishNum}}</div>
          <div>剩余任务</div>
          </div>-->
          <div class="countdown-left-footer-right">
            <div>
              <span :style="{fontSize:'30px'}">{{countDownDataArray[0]}}&nbsp;:&nbsp;</span>
              <span :style="{fontSize:'30px'}">{{countDownDataArray[1]}}</span>
            </div>
            <div>今日专注时间</div>
          </div>
        </div>
        <div class="countdown-left-footer-icon" v-if="!clearState">
          <div @click="toSmall">
            <img :src="smallImg" alt />
            <div>最小化</div>
          </div>
          <!-- <div>{{countDownTime==0?'已完成':'结束'}}</div> -->
          <!-- <img :src="finishImg" alt @click="finishTask" v-if="countDownTime==0" /> -->
          <!-- <div>
            <img :src="stopImg" alt @click="stopTask" />
            <div>退出专注</div>
          </div>
          <div>
            <img :src="clearImg" alt @click="clearState=true" />
            <div>清屏</div>
          </div>-->
        </div>
        <div class="finish-info" v-if="countDownTime==0">已完成任务专注</div>
      </div>
      <CountdownTab v-if="!clearState" :countType="'countdown'" />
      <a-icon
        type="close-circle"
        :style="{fontSize:'40px',color:'#fff'}"
        class="clearIcon"
        v-if="clearState"
        @click="clearState=false"
      />
      <audio ref="doneAudio" :src="doneAudio" muted>您的浏览器不支持 audio 标签。</audio>
      <audio ref="countDownAudio" :src="countDownAudio" muted loop>您的浏览器不支持 audio 标签。</audio>
    </div>
    <div
      v-if="countdownState==2&&JSON.stringify(countDownDetail)!='{}'"
      class="small-countdown"
      :style="{backgroundImage:'url('+smallcountdown+')'}"
      @click="toBig"
    >
      <a-progress
        type="circle"
        :percent="countPencent"
        :strokeWidth="6"
        :width="50"
        :showInfo="false"
        :strokeColor="'#E04238'"
      />
      <div class="small-countdown-time">{{countSmallTime}}</div>
      <div class="small-countdown-title">{{countDownDetail.title}}</div>
      <img :src="finishImg" alt @click="finishTask" :style="{width:'40px'}" />
      <a-icon type="close" class="small-countdown-close" @click.stop="closeCountDown" />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import FlipClock from "../common/flipClock/FlipClock";
import CountdownTab from "./CountdownTab";
import rightImg from "@/assets/light.png";
import playImg from "@/assets/play.png";
import pauseImg from "@/assets/pause.png";
import finishImg from "@/assets/finish.png";
import unfinishImg from "@/assets/unfinish.png";
import smallImg from "@/assets/small.png";
import stopImg from "@/assets/stop.png";
import clearImg from "@/assets/clear.png";
import smallcountdown from "@/assets/smallcountdown.png";
export default {
  name: "Countdown",
  components: { FlipClock, CountdownTab },
  data() {
    return {
      bgImg: "https://cdn-icare.qingtime.cn/1596680267272_rat-bg.jpg",
      rightImg,
      playImg,
      pauseImg,
      finishImg,
      unfinishImg,
      smallImg,
      stopImg,
      clearImg,
      showRight: true,
      countDownTime: 1,
      countInterval: 0,
      timeInterval: 0,
      playState: true,
      nowTime: "",
      nowDate: "",
      nowNoon: "",
      countDownPercent: 0,
      finishNum: 0,
      useTime: 0,
      doneAudio: require("@/assets/OK.mp3"),
      countDownAudio: require("@/assets/timer2.mp3"),
      clearState: false,
      smallcountdown: smallcountdown,
    };
  },
  props: ["countdownState"],
  computed: {
    ...mapState({
      user: (state) => state.auth.user,
      countDownData: (state) => state.auth.countDownData,
      fullState: (state) => state.common.fullState,
      cardArray: (state) => state.task.cardArray,
      cardKey: (state) => state.card.cardKey,
      groupKey: (state) => state.group.groupKey,
      countDownDetail: (state) => state.countdown.countDownDetail,
      countDownTaskList: (state) => state.countdown.countDownTaskList,
      countDownList: (state) => state.countdown.countDownList,
      allGroupArray: (state) => state.task.allGroupArray,
      allTaskArray: (state) => state.task.allTaskArray,
      countDownGroupArray: (state) => state.task.countDownGroupArray,
      countDownTaskArray: (state) => state.task.countDownTaskArray,
      countDownTeamList: (state) => state.countdown.countDownTeamList,
      // countdown: state => state.countdown.countdown,
      cardState() {
        return (
          this.countDownDetail && JSON.stringify(this.countDownDetail) != "{}"
        );
      },
      countPencent() {
        return parseInt(
          ((this.countDownDetail.hour * 3600000 -
            this.countDownDetail.countDownTime) /
            (this.countDownDetail.hour * 3600000)) *
            100
        );
      },
      countSmallTime() {
        let hours = parseInt(
          (this.countDownTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        let minutes =
          hours * 60 +
          parseInt((this.countDownTime % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = parseInt((this.countDownTime % (1000 * 60)) / 1000);
        return this.addZero(minutes) + "'" + this.addZero(seconds) + "''";
      },
    }),
    downTime() {
      let downTime = this.workTime - this.countDownTime;
      let hours = parseInt(
        (downTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      let minutes = parseInt((downTime % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = parseInt((downTime % (1000 * 60)) / 1000);
      return (
        this.addZero(hours) +
        " : " +
        this.addZero(minutes) +
        " : " +
        this.addZero(seconds)
      );
    },
    workTime() {
      return this.countDownDetail.hour * 3600000;
    },
    countDownDataArray() {
      let countTime = this.countDownData.countDownTotalTime
        ? this.countDownData.countDownTotalTime + this.useTime
        : this.useTime;
      let hours = parseInt(
        (countTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      let minutes = parseInt((countTime % (1000 * 60 * 60)) / (1000 * 60));
      return [this.addZero(hours), this.addZero(minutes)];
    },
    // cardArray() {
    //   return this.taskList.cardArray;
    // }
  },
  created() {},
  mounted() {
    let that = this;
    that.nowDate = that.$moment(new Date()).format("YYYY年M月D日");

    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    } else {
      this.timeInterval = setInterval(() => {
        that.nowTime = that.$moment(new Date()).format("h:mm:ss");
        that.nowNoon = that.$moment(new Date()).hour() < 12 ? "上午" : "下午";
      }, 1000);
    }
    window.addEventListener("beforeunload", () => {
      if (that.countDownDetail._key) {
        that.editCard({
          key: that.countDownDetail._key,
          countDownStatus: false,
          countDownDate: new Date().getTime(),
        });
        that.setCountDownData({
          timeMark: that.$moment().startOf("day").valueOf(),
          countDownTotalTime: that.useTime,
          taskNumber: 0,
          countDownCardKey: 0,
        });
      }
    });
  },
  destroyed() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
    if (this.countInterval) {
      clearInterval(this.countInterval);
      if (this.$refs.countDownAudio) {
        this.$refs.countDownAudio.pause();
      }
    }
  },
  methods: {
    ...mapActions("auth", ["getCountDownData", "setCountDownData"]),
    ...mapActions("common", ["setFullState"]),
    ...mapActions("card", ["editCard", "setCardKey"]),
    ...mapActions("countdown", [
      "setCountDownKey",
      "getCountDownTask",
      "getTeamCareTask",
      "getCountDownList",
      "getProjectCareTask",
      "getCountDownDetail",
    ]),
    async playCountdown(state, countDownDetail) {
      clearInterval(this.countInterval);
      this.$refs.countDownAudio.play();
      let that = this;
      // this.useTime = 0;
      if (!state) {
        this.playState = false;
        if (countDownDetail._key) {
          this.editCard({
            key: countDownDetail._key,
            countDownStatus: true,
            countDownDate: new Date().getTime(),
          });
        }
        this.countInterval = setInterval(() => {
          if (that.countDownTime == 0) {
            clearInterval(that.countInterval);
            that.$refs.countDownAudio.pause();
            that.editCard({
              key: countDownDetail._key,
              countDownTime: that.countDownTime,
              countDownDate: new Date().getTime(),
            });
            that.setCountDownData({
              timeMark: that.$moment().startOf("day").valueOf(),
              countDownTotalTime: that.useTime,
              taskNumber: 1,
              countDownCardKey: that.countDownDetail._key,
            });
            that.useTime = 0;
            return;
          }
          that.countDownTime = that.countDownTime - 1000;
          that.useTime = that.useTime + 1000;
          that.countDownPercent = parseInt(
            ((that.workTime - that.countDownTime) / that.workTime) * 100
          );
        }, 1000);
      } else {
        this.playState = true;
        clearInterval(this.countInterval);
        that.$refs.countDownAudio.pause();
        this.editCard({
          key: countDownDetail._key,
          countDownTime: this.countDownTime,
          countDownDate: new Date().getTime(),
          countDownStatus: false,
        });
        this.setCountDownData({
          timeMark: this.$moment().startOf("day").valueOf(),
          countDownTotalTime: this.useTime,
          taskNumber: 0,
          countDownCardKey: countDownDetail._key,
        });
        this.useTime = 0;
        if (state == 2) {
          this.setFullState(0);
        }
      }
    },
    finishTask() {
      this.countDownTime = 0;
      this.editCard({
        key: this.countDownDetail._key,
        finishPercent: 1,
        countDownStatus: false,
        countDownTime: 0,
        todayTaskTime: new Date().getTime(),
      });
      this.$refs.doneAudio.play();
      // this.setCountDownKey(0);
      // this.setFullState(0);
    },
    // async stopTask(type) {
    //   clearInterval(this.countInterval);
    //   this.$refs.countDownAudio.pause();
    //   if (this.countDownDetail._key) {
    //     await this.editCard({
    //       key: this.countDownDetail._key,
    //       countDownTime: this.countDownTime,
    //       countDownDate: new Date().getTime(),
    //       countDownStatus: false
    //     });
    //     await this.setCountDownData({
    //       timeMark: this.$moment()
    //         .startOf("day")
    //         .valueOf(),
    //       countDownTotalTime: this.useTime,
    //       taskNumber: 0,
    //       countDownCardKey: this.countDownDetail._key
    //     });
    //   }
    //   this.useTime = 0;
    //   this.setCountDownKey(0);
    //   this.$emit("update:countdownState", false);
    // },
   
    changeCard(key) {
      let that = this;
      // this.playCountdown(1, this.countDownDetail);
      this.$confirm({
        title: "提示",
        content: "是否切换专注任务",
        onOk() {
          if (
            that.countDownDetail &&
            JSON.stringify(that.countDownDetail) != "{}"
          ) {
            that.playCountdown(1, that.countDownDetail);
          }
          that.setCountDownKey(key);
          that.getCountDownDetail({ cardKey: key });
        },
        onCancel() {},
      });
    },
    toSmall() {
      this.$emit("update:countdownState", 2);
      // if (JSON.stringify(countDownDetail) != "{}") {
      //   this.playCountdown(2, this.countDownDetail);
      // }
    },
    toBig() {
      this.$emit("update:countdownState", 1);
    },
    closeCountDown() {
      if (this.timeInterval) {
        clearInterval(this.timeInterval);
      }
      this.$emit("update:countdownState", 0);
    },
    addZero(num) {
      return num > 9 ? num + "" : "0" + num;
    },

   
  },

  watch: {
    countDownDetail: {
      handler(newValue, oldValue) {
        if (
          JSON.stringify(newValue) != "{}" &&
          JSON.stringify(newValue) != JSON.stringify(oldValue)
        ) {
          this.playCountdown(0, newValue);
          if (this.countDownTime != newValue.countDownTime) {
            this.countDownTime = newValue.countDownTime
              ? newValue.countDownTime
              : newValue.hour * 3600000;
            this.countDownPercent = parseInt(
              (newValue.hour * 3600000 - this.countDownTime) /
                (newValue.hour * 36000)
            );
          }
        }
      },
      immediate: true,
    },
    cardKey: {
      handler(newValue, oldValue) {
        if (newValue != oldValue && newValue) {
          this.getCountDownData();
        }
      },
      immediate: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.countdown {
  width: calc(100% - 60px);
  height: 100%;
  display: flex;
  // background-size: cover;
  // background-repeat: no-repeat;
  // background-position: center center;
  background-color: #7690d3;
  position: fixed;
  top: 0px;
  left: 60px;
  z-index: 30;
}
.countdown-left {
  flex: 1;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}
.countdown-left-group {
  width: 100%;
  font-size: 12px;
  color: #fff;
  margin-bottom: 8px;
  text-align: left;
}
.countdown-left-title {
  width: 100%;
  font-size: 34px;
  color: #fff;
  text-align: center;
  margin-bottom: 35px;
}
.countdown-left-title img {
  width: 50px;
  height: 50px;
  cursor: pointer;
}
.countdown-left-info {
  width: 500px;
  min-height: 430px;
  text-align: center;
  color: #fff;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  margin-top: 120px;
}
.countdown-left-img {
  position: absolute;
  top: 30px;
}
.countdown-left-now {
  width: 100%;
  height: 20px;
  display: flex;
  justify-content: space-between;
}
.countdown-left-time {
  width: 100%;
  display: flex;
  justify-content: flex;
  align-items: center;
  margin: 28px 0px 0px 0px;
}
.countdown-left-time-item {
  width: 50px;
  height: 65px;
  background-color: #fff;
  line-height: 65px;
  text-align: center;
  color: #de4848;
  font-size: 44px;
  margin-right: 12px;
  border-radius: 10px;
}
.countdown-left-time-item:nth-child(8) {
  margin-right: 0px;
}
.countdown-left-progress {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 14px;
}
.countdown-left-time-icon {
  width: 100%;
  display: flex;
  justify-content: center;
  font-size: 14px;
}
.countdown-left-time-icon-item {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}
.countdown-left-time-icon-item img {
  width: 55px;
  height: 55px;
  object-fit: cover;
  cursor: pointer;
}
.countdown-left-time-icon-item > div {
  width: 100%;
}
.countdown-left-footer-info,
.countdown-left-footer-icon {
  width: 390px;
  height: 85px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.15);
  font-size: 10px;
  color: #fff;
  display: flex;
  padding: 6px 21px;
  position: fixed;
  top: 14px;
  left: 74px;
}
.countdown-left-footer-info > div,
.countdown-left-footer-icon > div {
  height: 100%;
  // width:56px;
  margin-right: 15px;
  display: flex;
  flex-wrap: wrap;
  align-content: space-between;
  justify-content: center;
}
.countdown-left-footer-icon > div > img {
  width: 45px;
  height: 45px;
}
.countdown-left-footer-icon {
  width: 85px;
  left: 475px;
}
.countdown-left-footer-info .countdown-left-footer-left {
  font-size: 12px;
  justify-content: flex-start;
}
.countdown-left-footer-info .countdown-left-footer-right {
  color: #fff;
  margin-right: 0px;
}
// .countdown-left-footer-left > div,
// .countdown-left-footer-right > div {
//   height: 35px;
// }
.countdown-left-footer-info > div:nth-child(4) {
  margin-right: 0px;
}
.countdown-left-footer-avatar div:first-child {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  overflow: hidden;
}
.countdown-left-footer-avatar div img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.finish-info {
  width: 100%;
  position: absolute;
  top: 150px;
  left: 0px;
  z-index: 5;
  color: #ffb445;
  font-size: 40px;
  text-align: center;
}
.clearIcon {
  position: fixed;
  top: 30px;
  right: 30px;
}

.small-countdown {
  width: 330px;
  height: 70px;
  position: fixed;
  right: 60px;
  bottom: 5px;
  z-index: 10;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  border-radius: 5px;
  display: flex;
  align-items: center;
  padding: 6px 0px 4px 6px;
  box-sizing: border-box;
}
.small-countdown-title {
  width: 63%;
  color: #fff;
  font-size: 12px;
  margin-left: 10px;
  margin-right: 5px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
.small-countdown-img {
  width: 25px;
  height: 25px;
  cursor: pointer;
}
.small-countdown-img img {
  width: 25px;
  height: 25px;
  object-fit: cover;
}
.small-countdown-time {
  position: absolute;
  top: 27px;
  left: 15px;
  color: #fff;
  font-size: 10px;
}
.small-countdown-close {
  position: absolute;
  top: 5px;
  right: 5px;
  color: rgba(255, 255, 255, 0.4);
  font-size: 15px;
  cursor: pointer;
}
</style>