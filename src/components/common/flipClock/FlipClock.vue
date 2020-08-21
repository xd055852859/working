<template>
  <div class="FlipClock">
    <Flipper ref="flipperHour1" />
    <Flipper ref="flipperHour2" />
    <em>:</em>
    <Flipper ref="flipperMinute1" />
    <Flipper ref="flipperMinute2" />
    <em>:</em>
    <Flipper ref="flipperSecond1" />
    <Flipper ref="flipperSecond2" />
  </div>
</template>

<script>
import Flipper from "./Flipper";
export default {
  name: "FlipClock",
  props: ["now"],
  data() {
    return {
      timer: null,
      flipObjs: []
    };
  },
  components: {
    Flipper
  },
  methods: {
    // 初始化数字
    init(now) {
      let nowTimeStr = this.formatDate(now);
      for (let i = 0; i < this.flipObjs.length; i++) {
        this.flipObjs[i].setFront(nowTimeStr[i]);
      }
    },
    // 开始计时
    run(now) {
      // this.timer = setInterval(() => {
      // 获取当前时间
      let nowTimeStr = this.formatDate(now + 1000);
      let nextTimeStr = this.formatDate(now);
      for (let i = 0; i < this.flipObjs.length; i++) {
        if (nowTimeStr[i] === nextTimeStr[i]) {
          continue;
        }
        this.flipObjs[i].flipDown(nowTimeStr[i], nextTimeStr[i]);
      }
      //   this.now = this.now + 1000;
      // }, 1000);
    },
    // 正则格式化日期
    formatDate(formatTime) {
      let hours = parseInt(
        (formatTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      let minutes = parseInt((formatTime % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = parseInt((formatTime % (1000 * 60)) / 1000);
      return (
        this.addZero(hours) + this.addZero(minutes) + this.addZero(seconds)
      );
    },
    addZero(num) {
      return num > 9 ? num + "" : "0" + num;
    }
  },
  mounted() {
    this.flipObjs = [
      this.$refs.flipperHour1,
      this.$refs.flipperHour2,
      this.$refs.flipperMinute1,
      this.$refs.flipperMinute2,
      this.$refs.flipperSecond1,
      this.$refs.flipperSecond2
    ];
  },
  watch: {
    now(newValue, oldValue) {
      if (newValue != oldValue) {
        // if (!oldValue) {
          this.init(newValue);
        // }
        this.run(newValue);
      }
    }
  }
};
</script>

<style>
.FlipClock {
  text-align: center;
}
.FlipClock .M-Flipper {
  margin-right:7px;
}
.FlipClock .M-Flipper:nth-child(8){
  margin-right:0px;
}
.FlipClock em {
  display: inline-block;
  line-height: 102px;
  font-size: 66px;
  font-style: normal;
  vertical-align: top;
}
</style>