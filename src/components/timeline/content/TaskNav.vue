<template>
  <div class="taskNav" :style="deviceState=='phone'?{flexWrap:'wrap'}:null" @click.stop>
    <div class="taskNav-click" :style="deviceState=='phone'?{flexWrap:'wrap'}:null">
      <div class="taskNav-mask" v-if="!cardKey"></div>
      <div class="taskNav-loading">
        <a-Icon :component="task1" :style="{fontSize:'20px',margin:'0px 5px 0px 0px'}" />
        <a-Icon
          v-for="(item,index) in taskArr"
          :key="index"
          :component="taskArr[index]"
          :style="{fontSize:'20px',margin:'0px 5px 0px 0px'}"
          @click="changefinishPercent(index)"
        />
        <a-icon
          type="strikethrough"
          :style="{fontSize: '17px'}"
          @click="changefinishPercent(cardDetail.finishPercent != 2 ? 2 : 1)"
        />
      </div>

      <div class="taskNav-clock">
        <SvgIcon :iconSvg="clock" fontSize="17px" color="#000" :style="{margin:'0px 9px 0px 0px'}" />
        <div
          v-for="(item,index) in 8"
          :key="'clock1'+index"
          class="taskNav-clock-item"
          @click="changeTime(1,index+1,index)"
        >
          {{index+1}}
          <div
            class="taskNav-time"
            :style="{ borderColor:hourIndex==index?'#F28806  transparent transparent transparent':'#35a6f8 transparent transparent transparent'}"
          ></div>
        </div>
        <div
          v-for="(item,index) in 9"
          :key="'clock2'+index"
          class="taskNav-clock-item"
          @click="changeTime(1,'0.'+(index+1),index+8)"
        >
          {{"0."+(index+1)}}
          <div
            class="taskNav-time"
            :style="{ borderColor:hourIndex==index+8?'#F28806 transparent transparent transparent':'#35a6f8 transparent transparent transparent'}"
          ></div>
        </div>
      </div>

      <!-- <a-icon type="close-square" /> -->
      <div class="taskNav-date-logo">
        <a-icon type="close-square" @click.stop="dateType=false" :style="{fontSize:'18px'}" />
        <a-icon type="calendar" @click.stop="dateType=true" :style="{fontSize:'18px'}" />
      </div>
      <div
        class="taskNav-date"
        :style="deviceState=='phone'?{margin:'10px 0px'}:null"
        v-if="!dateType"
      >
        <div
          v-for="(item,index) in 30"
          :key="'clock3'+index"
          class="taskNav-clock-item"
          @click="changeTime(2,index+1,index)"
          :style=" {backgroundColor: dayIndex==index?'#F28806':taskNavWeek[index]>4?'#BABABA':'#505050'}"
        >{{index+1}}</div>
      </div>
      <div
        class="taskNav-date"
        :style="deviceState=='phone'?{margin:'10px 0px'}:null"
        v-if="dateType"
      >
        <div
          v-for="(dateItem,dateIndex) in taskNavDate"
          :key="'clock4'+dateIndex"
          class="taskNav-clock-item"
          @click="changeTime(2,dateIndex+1,dateIndex)"
          :style="{backgroundColor:dayIndex==dateIndex? '#F28806':taskNavWeek[dateIndex]>4?'#BABABA':'#505050'}"
        >{{dateItem}}</div>
      </div>
    </div>
    <div class="taskNav-date-icon" @click.stop="changeEye()">
      <!-- <SvgIcon :iconSvg="clock" fontSize="17px" color="#000" :style="{margin:'0px'}" />
      <SvgIcon :iconSvg="clock" fontSize="17px" color="#000" :style="{margin:'0px'}" />-->
      <a-Icon :component="openEye" :style="{fontSize: '30px'}" v-if="eyeState" />
      <a-Icon :component="closeEye" :style="{fontSize: '30px'}" v-if="!eyeState" />
    </div>
    <a-button
      type="primary"
      @click="openNotification"
      v-if="groupType==3"
      v-clipboard:copy="url"
      v-clipboard:success="onCopy"
      v-clipboard:error="onError"
    >分享</a-button>
    <!-- <a-modal title="分享链接" :visible="shareState" :footer="null" @cancel="shareState=false">
      <a-checkbox @change="onChange" v-if="isHasPassword" :value="checkState">分享口令</a-checkbox>
      <p>{{shareTitle}}</p>
    </a-modal>-->
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import task1 from "../../common/svg/task1.svg";
import task2 from "../../common/svg/task2.svg";
import task6 from "../../common/svg/task6.svg";
import openEye from "../../common/svg/openEye.svg";
import closeEye from "../../common/svg/closeEye.svg";
import clock from "../../common/svg/时钟.svg";
import SvgIcon from "../../common/SvgIcon";
export default {
  name: "TaskNav",
  components: { SvgIcon },
  props: ["taskNewTitle"],
  data() {
    return {
      task1: task1,
      taskArr: [task2, task6],
      openEye: openEye,
      closeEye: closeEye,
      clock: clock,
      hour: 0.1,
      hourIndex: null,
      day: 1,
      dayIndex: null,
      eyeState: false,
      taskNavDate: [],
      taskNavWeek: [],
      dateType: false,
      shareState: false,
      checkState: false,
      shareTitle: "",
      isHasPassword: false,
      url: ""
    };
  },
  computed: mapState({
    cardDetail: state => state.card.cardDetail,
    cardKey: state => state.card.cardKey,
    groupKey: state => state.group.groupKey,
    cardDetailType: state => state.card.cardDetailType,
    groupType: state => state.group.groupType,
    groupInfo: state => state.group.groupInfo,
    targetUInfo: state => state.auth.targetUInfo,
    deviceState: state => state.common.deviceState,
    deviceWidth: state => state.common.deviceWidth,
    finishPercentArray: state => state.task.finishPercentArray
  }),
  mounted() {
    this.mouthDate();
  },
  methods: {
    ...mapActions("card", ["editCard"]),
    ...mapActions("task", ["getTaskList", "setFinishPercentArray"]),
    onChange(e) {
      this.checkState = e.target.checked;
      this.checkState
        ? (this.shareTitle =
            this.shareTitle + ",口令为" + this.groupInfo.password)
        : null;
    },
    onCopy() {},
    onError() {},
    changefinishPercent(finishPercent) {
      if (finishPercent > -1) {
        let obj = {
          key: this.cardKey,
          finishPercent: finishPercent
        };
        this.taskNewTitle != "" ? (obj.title = this.taskNewTitle) : null;
        this.editCard(obj);
      } else {
        this.editCard({
          key: this.cardKey,
          type: 1
        });
      }
    },
    changeTime(type, time, index) {
      if (type == 1) {
        this.hour = parseFloat(time);
        this.hourIndex = index;
      } else {
        this.day = parseInt(time);
        this.dayIndex = index;
      }
      let taskEndDate =
        new Date().getTime() + 3600000 * this.hour + 86400000 * (this.day - 1);
      let obj = {
        key: this.cardKey,
        day: this.day,
        hour: this.hour,
        taskEndDate: taskEndDate
      };
      this.taskNewTitle != "" ? (obj.title = this.taskNewTitle) : null;
      this.editCard(obj);
    },
    changeEye() {
      this.eyeState = !this.eyeState;
      let obj = {
        typeBoard1: this.groupType
      };
      obj.targetUGKey =
        this.groupType == 3 ? this.groupKey : this.targetUInfo.userId;
      !this.eyeState
        ? (obj.finishPercentArray = "[0,1]")
        : (obj.finishPercentArray = "[0,1,2]");
      this.setFinishPercentArray(this.eyeState ? "[0,1,2]" : "[0,1]");
      this.getTaskList(obj);
    },
    mouthDate() {
      const weekString = [
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
        "星期日"
      ];
      for (let i = 0; i < 30; i += 1) {
        this.taskNavDate.push(
          this.$moment()
            .add(i, "days")
            .date()
        );
        // weeks[i] = weekString[
        //   this.$moment("2020-03-05")
        //     .add(i, "days")
        //     .weekday()
        // ];
        this.taskNavWeek.push(
          this.$moment()
            .add(i, "days")
            .weekday()
        );
      }
    },
    monthDay(date) {
      const daysArr = [[], [], [], [], [], []]; // 6*7的日历数组
      const currentWeekday = this.$moment(date)
        .date(1)
        .weekday(); // 获取当月1日为星期几
      const currentMonthDays = this.$moment(date).daysInMonth(); // 获取当月天数
      const lastMonthDays = this.$moment(date)
        .subtract(1, "month")
        .daysInMonth(); // 获取下个月天数
      const nextMonthDays = this.$moment(date)
        .add(1, "month")
        .daysInMonth(); // 获取下个月天数
      console.log("currentWeekday", currentWeekday);
      console.log("lastMonthDays", lastMonthDays);
      console.log("nextMonthDays", nextMonthDays);
      const getDay = day => {
        console.log("day", day);
        console.log("nextMonthDays", nextMonthDays);
        return day <= nextMonthDays
          ? day
          : day <= nextMonthDays + currentMonthDays
          ? day - nextMonthDays
          : day - (nextMonthDays + currentMonthDays);
      }; // 日期处理
      for (let i = 0; i < 7; i += 1) {
        // let virtualDay = nextMonthDays - currentWeekday + i + 1;
        // for (let j = 0; j < 6; j += 1) {
        //   daysArr[j][i] = getDay(virtualDay + j * 7);
        // }
      }
      console.table(daysArr);
    },
    openNotification() {
      this.$notification.open({
        message: "分享链接",
        duration: 10,
        description: "复制链接成功," + this.shareTitle,
        onClick: () => {
          console.log("Notification Clicked!");
        }
      });
    }
  },
  watch: {
    cardKey(newVal, oldVal) {
      if (oldVal !== newVal) {
        this.day = 1;
        this.hour = 0.1;
        this.hourIndex = null;
        this.dayIndex = null;
      }
    },
    cardDetail: {
      handler(newVal, oldVal) {
        if (oldVal !== newVal) {
          if (newVal.hour) {
            if (newVal.hour > 0.9 && newVal.hour < 9) {
              this.hourIndex = newVal.hour - 1;
            } else if (newVal.hour < 0.9 && newVal.hour > 0) {
              this.hourIndex = newVal.hour * 10 + 7;
            }
            this.hour = newVal.hour;
          }
          if (newVal.day) {
            this.dayIndex = newVal.day - 1;
            this.day = newVal.day;
          }
        }
      },
      immediate: true,
      deep: true
    },
    groupInfo: {
      handler(newVal) {
        if (newVal) {
          this.shareTitle =
            "分享链接:https://working.vip/?group=" + this.groupKey;
          this.url = "https://working.vip/?group=" + this.groupKey;
          this.password = newVal.password;
          newVal.password
            ? (this.shareTitle = this.shareTitle + ",口令为" + newVal.password)
            : null;
        }
      },
      immediate: true,
      deep: true
    }
  }
};
</script>

<style scoped>
.taskNav,
.taskNav-click {
  display: flex;
  align-items: center;
  position: relative;
  z-index: 1;
}

.taskNav-mask {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.3);
  z-index: 10;
}
.taskNav-loading {
  width: 55px;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.taskNav-time {
  width: 0;
  height: 0;
  border-width: 9px;
  border-style: solid;
  position: absolute;
  top: -2px;
  right: -9px;
  z-index: 5;
}
.taskNav-clock {
  width: 235px;
  height: 46px;
  display: flex;
  flex-wrap: wrap;
}
.taskNav-clock-item {
  width: 20px;
  height: 20px;
  line-height: 20px;
  color: #fff;
  font-size: 8px;
  text-align: center;
  background-color: #505050;
  margin-right: 5px;
  position: relative;
  overflow: hidden;
}
.taskNav-date-logo {
  width: 20px;
  height: 100%;
  margin-right: 5px;
}
.taskNav-date-icon {
  width: 50px;
  height: 25px;
  display: flex;
  justify-content: center;
  align-content: center;
}
.taskNav-date {
  width: 380px;
  height: 46px;
  display: flex;
  flex-wrap: wrap;
}
</style>