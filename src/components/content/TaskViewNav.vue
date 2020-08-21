<template>
  <div class="taskNav" :style="{backgroundColor:'rgba(255,255,255,0.8)'}">
    <div
      class="taskNav-click"
      @click.stop
      :style="{width:deviceState != 'phone' &&deviceState!='mobile'? '728px':'120px'}"
    >
      <div class="taskNav-mask" v-if="!cardKey"></div>
      <div class="taskNav-loading">
        <a-tooltip>
          <template slot="title">设为备忘</template>
          <a-Icon
            :component="task1"
            :style="{ fontSize: '20px', margin: '0px 5px 0px 0px' }"
            @click="changefinishPercent(10)"
          />
        </a-tooltip>

        <a-tooltip>
          <template slot="title">未完成</template>
          <a-Icon
            :component="taskArr[0]"
            :style="{ fontSize: '20px', margin: '0px 5px 0px 0px' }"
            @click="changefinishPercent(0)"
          />
        </a-tooltip>
        <a-tooltip>
          <template slot="title">已完成</template>
          <a-Icon
            :component="taskArr[1]"
            :style="{ fontSize: '20px', margin: '0px 5px 0px 0px' }"
            @click="changefinishPercent(1)"
          />
        </a-tooltip>
        <a-tooltip>
          <template slot="title">归档</template>
          <a-icon
            type="strikethrough"
            :style="{ fontSize: '17px' }"
            @click="changefinishPercent(cardDetail.finishPercent != 2 ? 2 : 1)"
          />
        </a-tooltip>
      </div>
      <!-- <div class="taskNav-date-icon" @click.stop="changeEye()">
        <a-Icon
          :component="openEye"
          :style="{ fontSize: '30px', marginTop: '15px' }"
          v-if="eyeState"
        />
        <a-Icon v-else :component="closeEye" :style="{ fontSize: '30px', marginTop: '15px' }" />
      </div>-->

      <div class="taskNav-clock" v-if="deviceState != 'phone' &&deviceState!='mobile'">
        <SvgIcon
          :iconSvg="clock"
          fontSize="17px"
          color="#000"
          :style="{ margin: '0px 9px 0px 0px',display:'flex' }"
        />
        <div
          v-for="(item, index) in 8"
          :key="'clock1' + index"
          class="taskNav-clock-item"
          @click="changeTime(1, index + 1, index)"
        >
          {{ index + 1 }}
          <div
            class="taskNav-time"
            :style="{
              borderColor:
                hourIndex == index
                  ? '#F28806  transparent transparent transparent'
                  : '#35a6f8 transparent transparent transparent'
            }"
          ></div>
        </div>
        <div
          v-for="(item, index) in 9"
          :key="'clock2' + index"
          class="taskNav-clock-item"
          @click="changeTime(1, '0.' + (index + 1), index + 8)"
        >
          {{ "0." + (index + 1) }}
          <div
            class="taskNav-time"
            :style="{
              borderColor:
                hourIndex == index + 8
                  ? '#F28806 transparent transparent transparent'
                  : '#35a6f8 transparent transparent transparent'
            }"
          ></div>
        </div>
      </div>

      <!-- <a-icon type="close-square" /> -->
      <div class="taskNav-date-logo" v-if="deviceState != 'phone' &&deviceState!='mobile'">
        <a-tooltip>
          <template slot="title">取消选择</template>
          <a-icon type="close-square" @click.stop="closeDay" class="taskNav-date-close" />
        </a-tooltip>
        <a-tooltip>
          <template slot="title">日期视图</template>
          <a-icon type="calendar" @click.stop="changeType" class="taskNav-date-change" />
        </a-tooltip>
      </div>
      <div class="taskNav-date" v-if="!dateType&&deviceState != 'phone' &&deviceState!='mobile'">
        <div
          v-for="(item, index) in 30"
          :key="'clock3' + index"
          class="taskNav-clock-item"
          @click="changeTime(2, index + 1, index)"
          :style="{
            backgroundColor:
              dayIndex == index
                ? '#F28806'
                : taskNavWeek[index] > 4
                ? '#BABABA'
                : '#505050'
          }"
        >{{ index + 1 }}</div>
      </div>
      <div
        class="taskNav-date"
        :style="deviceState == 'phone' ||deviceState=='mobile'? { margin: '10px 0px' } : null"
        v-if="dateType"
      >
        <div
          v-for="(dateItem, dateIndex) in taskNavDate"
          :key="'clock4' + dateIndex"
          class="taskNav-clock-item"
          @click="changeTime(2, dateIndex + 1, dateIndex)"
          :style="{
            backgroundColor:
              dayIndex == dateIndex
                ? '#F28806'
                : taskNavWeek[dateIndex] > 4
                ? '#BABABA'
                : '#505050'
          }"
        >{{ dateItem }}</div>
      </div>
    </div>
    <div class="view-info" @click="viewIconState=true">
      <div
        class="view-container-item"
        v-for="(item,index) in showTextArr"
        :key="index"
        :style="showIndex==index?{background:'rgba(246,246,246,1)',borderRadius:'4px',border:'1px solid rgba(202,202,202,1)'}:null"
        @click="changeShowIndex(index)"
      >
        <!--  @click="changeShowIndex(index)" -->
        <img :src="showIconArr[index]" alt class="view-item-img" />
        <div class="view-item-title" :style="{color:'#666666'}">{{item}}</div>
      </div>
    </div>
    <!-- <div
      class="view-container"
      v-if="viewIconState"
      @click.stop
      :style="{width:groupType==3?'300px':'400px'}"
    >
    </div>-->
    <!--  -->
    <!-- <div
      class="tab-info"
      @click="tabIconState=true"
      v-if="!((viewState ==4&&groupType==2) ||(viewState ==5&&groupType==2)||(viewState ==4&&groupType==1) ||(viewState ==5&&groupType==1)||(viewState ==2&&groupType==3)||(viewState ==3&&groupType==3))"
    >
      <img :src="tabImg" alt class="tab-img" />
      <div class="view-title">过滤</div>
      <span class="tab-choose-title">{{tabTextArr[taskType]}}</span>
      <div class="tab-container" @click.stop @mouseleave="tabIconState=false" v-if="tabIconState">
        <div class="tab-container-info">
          <div
            class="tab-container-item"
            v-for="(item,index) in tabTextArr"
            :key="index"
            @click="setTaskType(index)"
            :style="{background:taskType==index?'linear-gradient(180deg,rgba(246,246,246,1) 0%,rgba(233,233,233,1) 100%)':null}"
          >
            <img :src="tabIconArr[index]" alt class="tab-item-img" />
            <div class="tab-item-title">{{item}}</div>
          </div>
        </div>
      </div>
    </div>-->
    <!-- <a-icon
        type="cluster"
        :style="{ fontSize: '30px', margin: '0px 5px 0px 0px' }"
        @click="changeView(0)"
      />
      <a-icon
        type="profile"
        :style="{ fontSize: '30px', margin: '0px 5px 0px 0px' }"
        v-if="groupType==3"
        @click="changeView(1)"
      />
      <a-icon
        type="project"
        :style="{ fontSize: '30px', margin: '0px 5px 0px 0px' }"
        v-if="groupType==3"
        @click="changeView(2)"
      />
      <a-icon
        type="calendar"
        :style="{ fontSize: '30px', margin: '0px 5px 0px 0px' }"
        @click="changeView(3)"
    />-->
    <!-- <div class="view-info" @click="changeShowTodo" v-if="viewState==0">
      <img :src="todoImg" alt class="view-img" />
      <div class="view-title">TODO</div>
    </div>-->
    <!-- <a-icon
      type="flag"
      :style="{ fontSize: '30px', margin: '0px 0px 0px 50px' }"
      @click="changeShowTodo"
      v-if="viewState==0"
    />-->
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import task1 from "../common/svg/task1.svg";
import task2 from "../common/svg/task2.svg";
import task6 from "../common/svg/task6.svg";
import openEye from "../common/svg/openEye.svg";
import closeEye from "../common/svg/closeEye.svg";
import clock from "../common/svg/时钟.svg";
import SvgIcon from "../common/SvgIcon";
import viewImg from "@/assets/view.png";
import icon1Img from "@/assets/icon1.png";
import icon2Img from "@/assets/icon2.png";
import icon3Img from "@/assets/icon3.png";
import icon4Img from "@/assets/icon4.png";
import icon5Img from "@/assets/icon5.png";
import icon6Img from "@/assets/icon6.png";
import icon7Img from "@/assets/icon7.png";
import icon8Img from "@/assets/icon8.png";
import icon9Img from "@/assets/icon9.png";
import icon10Img from "@/assets/icon10.png";
import icon11Img from "@/assets/icon11.png";
import icon12Img from "@/assets/icon12.png";
import icon13Img from "@/assets/icon13.png";
import icon14Img from "@/assets/icon14.png";
import icon15Img from "@/assets/icon15.png";
import icon16Img from "@/assets/icon16.png";
import tabImg from "@/assets/tab.png";
import tab1Img from "@/assets/tab1.png";
import tab2Img from "@/assets/tab2.png";
import tab3Img from "@/assets/tab3.png";
import tab4Img from "@/assets/tab4.png";
import tab5Img from "@/assets/tab5.png";
import tab6Img from "@/assets/tab6.png";
import todoImg from "@/assets/todo.png";
export default {
  name: "TaskViewNav",
  components: { SvgIcon },
  props: ["showToDo", "viewState"],
  data() {
    return {
      task1: task1,
      taskArr: [task2, task6],
      openEye: openEye,
      closeEye: closeEye,
      clock: clock,
      hour: 1,
      hourIndex: null,
      day: 0,
      dayIndex: null,
      date: 1,
      taskNavDate: [],
      taskNavWeek: [],
      dateType: false,
      shareState: false,
      checkState: false,
      isHasPassword: false,
      viewImg,
      tabImg,
      todoImg,
      tabIconArr: [tab1Img, tab2Img, tab3Img, tab4Img, tab5Img, tab6Img],
      tabTextArr: ["今日", "重要", "我的任务", "指派给我", "我指派的", "备忘"],
      showTextArr: [],
      showIconArr: [],
      showIndex: 0,
      tabIndex: 0,
      viewIconState: false,
      tabIconState: false,
    };
  },
  computed: mapState({
    cardDetail: (state) => state.card.cardDetail,
    cardKey: (state) => state.card.cardKey,
    groupKey: (state) => state.group.groupKey,
    cardDetailType: (state) => state.card.cardDetailType,
    groupType: (state) => state.group.groupType,
    groupInfo: (state) => state.group.groupInfo,
    targetUInfo: (state) => state.auth.targetUInfo,
    deviceState: (state) => state.common.deviceState,
    deviceWidth: (state) => state.common.deviceWidth,
    finishPercentArray: (state) => state.task.finishPercentArray,
    eyeState: (state) => state.task.eyeState,
    taskType: (state) => state.task.taskType,
    taskTitle: (state) => state.task.taskTitle,
  }),
  mounted() {
    this.mouthDate();
  },
  methods: {
    ...mapActions("task", [
      "getTaskList",
      "setFinishPercentArray",
      "changeEyeState",
      "setTaskType",
      "setTaskTitle",
    ]),
    ...mapActions("card", [
      "changeCardShowState",
      "changeCardDetailType",
      "setCardKey",
      "setCardDetail",
      "editCard",
    ]),
    ...mapActions("group", ["setCardMemberList"]),
    changeShowTodo() {
      this.$emit("update:showToDo", true);
    },
    onChange(e) {
      this.checkState = e.target.checked;
      this.checkState
        ? (this.shareTitle =
            this.shareTitle + ",口令为" + this.groupInfo.password)
        : null;
    },
    changeView(viewState) {
      this.$emit("update:viewState", viewState);
    },
    closeDay() {
      this.dayIndex = null;
      this.hourIndex = null;
      let obj = {
        key: this.cardKey,
        day: 0,
        hour: 0,
        taskEndDate: 0,
      };
      if (this.taskTitle != "") {
        obj.title = this.taskTitle;
        this.setTaskTitle("");
      }
      this.editCard(obj);
    },
    changefinishPercent(finishPercent) {
      let obj = {
        key: this.cardKey,
        finishPercent: finishPercent,
      };
      obj.todayTaskTime = finishPercent == 1 ? new Date().getTime() : 0;
      if (this.taskTitle != "") {
        obj.title = this.taskTitle;
        this.setTaskTitle("");
      }
      this.editCard(obj);
      if (finishPercent == 2) {
        this.setCardKey(0);
        this.setCardDetail(null);
        this.changeCardShowState(false);
        this.changeCardDetailType(1);
      }
    },
    changeTime(type, time, index) {
      if (type == 1) {
        this.hour = parseFloat(time);
        this.hourIndex = index;
      } else {
        this.day = parseInt(time);
        this.date = this.taskNavDate[parseInt(time) - 1];
        this.dayIndex = index;
      }
      let taskEndDate = new Date().getTime() + 86400000 * (this.day - 1);
      let obj = {
        key: this.cardKey,
        day: this.day,
        hour: this.hour,
        date: this.date,
        taskEndDate: taskEndDate,
        countDownTime: this.hour * 3600000,
      };
      if (this.taskTitle != "") {
        obj.title = this.taskTitle;
        this.setTaskTitle("");
      }
      this.editCard(obj);
    },
    // changeEye() {
    //   let eyeState = !this.eyeState;
    //   this.changeEyeState(eyeState);
    //   let obj = {
    //     typeBoard1: this.groupType,
    //     fileDay: 14,
    //   };
    //   obj.targetUGKey =
    //     this.groupType == 3 ? this.groupKey : this.targetUInfo.userId;
    //   !eyeState
    //     ? (obj.finishPercentArray = "[0,1,10]")
    //     : (obj.finishPercentArray = "[0,1,2,10]");
    //   this.setFinishPercentArray(eyeState ? "[0,1,2,10]" : "[0,1,10]");
    //   this.getTaskList(obj);
    // },
    changeType() {
      this.dateType = !this.dateType;
      this.$emit("update:dateType", this.dateType);
    },
    mouthDate() {
      const weekString = [
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
        "星期日",
      ];
      for (let i = 0; i < 30; i += 1) {
        this.taskNavDate.push(this.$moment().add(i, "days").date());
        // weeks[i] = weekString[
        //   this.$moment("2020-03-05")
        //     .add(i, "days")
        //     .weekday()
        // ];
        this.taskNavWeek.push(this.$moment().add(i, "days").weekday());
      }
    },
    monthDay(date) {
      const daysArr = [[], [], [], [], [], []]; // 6*7的日历数组
      const currentWeekday = this.$moment(date).date(1).weekday(); // 获取当月1日为星期几
      const currentMonthDays = this.$moment(date).daysInMonth(); // 获取当月天数
      const lastMonthDays = this.$moment(date)
        .subtract(1, "month")
        .daysInMonth(); // 获取下个月天数
      const nextMonthDays = this.$moment(date).add(1, "month").daysInMonth(); // 获取下个月天数
      const getDay = (day) => {
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
        },
      });
    },
    changeShowIndex(index) {
      this.showIndex = index;
      this.$emit("update:taskShowIndex", index);
      // let arr =
      //   this.groupType == 1
      //     ? [0, 4, 3, 0, 4, 3]
      //     : this.groupType == 2
      //     ? [1, 3, 1, 3]
      //     : [0, 1, 2, 3, 0, 1, 2, 3];
      this.changeView(index);
    },
    // changeTabIndex(index) {
    //   this.tabIndex = index;
    //   // let taskIndex = index > 6 ? index - 6 : index;
    //   this.setTaskType(taskIndex);
    // }
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
        if (oldVal !== newVal && newVal) {
          if (newVal.hour) {
            if (newVal.hour > 0.9 && newVal.hour < 9) {
              this.hourIndex = newVal.hour - 1;
            } else if (newVal.hour < 0.9 && newVal.hour > 0) {
              this.hourIndex = newVal.hour * 10 + 7;
            }
            this.hour = newVal.hour;
          }
          if (newVal.taskEndDate) {
            let time = Math.floor(
              (this.$moment(newVal.taskEndDate).endOf("day").valueOf() -
                this.$moment(new Date().getTime()).endOf("day").valueOf()) /
                86400000
            );
            this.dayIndex = time;
            this.day = time + 1;
          }
        }
      },
      immediate: true,
      deep: true,
    },
    groupType: {
      handler(newVal, oldVal) {
        if (oldVal !== newVal) {
          switch (newVal) {
            case 1:
              this.tabIconArr = [
                tab1Img,
                tab2Img,
                tab3Img,
                tab4Img,
                tab5Img,
                tab6Img,
              ];
              this.tabTextArr = [
                "今日",
                "重要",
                "我相关任务",
                "指派给我",
                "我指派的",
                "备忘",
              ];
              this.showTextArr = [
                "频道",
                "项目",
                "项目卡",
                "频道卡",
                "时间表",
                "执行表",
                "日历",
              ];
              this.showIconArr = [
                icon1Img,
                icon2Img,
                icon3Img,
                icon4Img,
                icon13Img,
                icon14Img,
                icon5Img,
                icon6Img,
                icon7Img,
                icon8Img,
                icon9Img,
                icon15Img,
                icon16Img,
                icon10Img,
              ];
              break;
            case 2:
              this.tabIconArr = [tab1Img, tab2Img, tab3Img];
              this.tabTextArr = ["今日", "重要", "他相关任务"];
              this.showTextArr = [
                "频道",
                "项目",
                "项目卡",
                "频道卡",
                "时间表",
                "执行表",
                "日历",
              ];
              this.showIconArr = [
                icon1Img,
                icon2Img,
                icon3Img,
                icon4Img,
                icon13Img,
                icon14Img,
                icon5Img,
                icon6Img,
                icon7Img,
                icon8Img,
                icon9Img,
                icon15Img,
                icon16Img,
                icon10Img,
              ];
              break;
            case 3:
              this.tabIconArr = [
                tab1Img,
                tab2Img,
                tab3Img,
                tab4Img,
                tab5Img,
                tab6Img,
                tab3Img,
              ];
              this.tabTextArr = [
                "今日",
                "重要",
                "我相关任务",
                "指派给我",
                "我指派的",
                "备忘",
                "全部任务",
              ];
              this.showTextArr = ["分频道", "全员", "时间表", "执行表", "日历"];
              this.showIconArr = [
                icon1Img,
                icon11Img,
                icon13Img,
                icon14Img,
                icon5Img,
                icon6Img,
                icon12Img,
                icon15Img,
                icon16Img,
                icon10Img,
              ];
              break;
            default:
              null;
          }
          this.setTaskType(0);
          this.showIndex = 0;
          this.tabIndex = 0;
        }
      },
      immediate: true,
    },
    groupKey(newVal, oldVal) {
      if (newVal != oldVal) {
        this.setTaskType(0);
        this.tabIndex = 0;
        this.showIndex = 0;
      }
    },
  },
};
</script>

<style scoped>
.taskNav,
.taskNav-click {
  color: #666;
  height: 50px;
  width: 100%;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 5;
  padding: 0 0.5%;
  box-sizing: border-box;
}
.taskNav-mask {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(255, 255, 255, 0);
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
  height: 46px;
  margin-right: 5px;
  position: relative;
}
.taskNav-date-close {
  font-size: 18px;
  position: absolute;
  z-index: 1;
  bottom: 3px;
}
.taskNav-date-change {
  font-size: 18px;
  position: absolute;
  z-index: 10;
  top: 0px;
}
.taskNav-date-icon {
  width: 50px;
  height: 45px;
  z-index: 10;
  margin-left: -10px;
  cursor: pointer;
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
.taskNav-sharebtn {
  flex: 1;
  text-align: right;
}
.view-info {
  height: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  position: relative;
  cursor: pointer;
  z-index: 20;
}
.tab-info {
  position: relative;
  cursor: pointer;
}
.view-img {
  width: 26px;
  height: 26px;
  object-fit: cover;
}
.tab-img {
  width: 20px;
  height: 20px;
  object-fit: cover;
}
.view-title {
  width: 100%;
  text-align: center;
  color: #666666;
  font-size: 12px;
}
.view-container {
  width: 250px;
  height: 60px;
  position: absolute;
  top: 50px;
  left: 0px;
  background-color: #fff;
  z-index: 30;
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.26);
  border-radius: 5px;
}
.tab-container {
  width: 137px;
  position: absolute;
  top: 50px;
  right: 0px;
  background-color: #fff;
  z-index: 30;
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.26);
  border-radius: 5px;
}
.view-container-top {
  height: 0px;
  width: 0px;
  position: absolute;
  left: 25px;
  top: -20px;
  border-top: 10px solid transparent;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid #fff;
  z-index: 8;
}
.view-container-info {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
}
.tab-container-info {
  height: 100%;
  width: 100%;
}
.view-container-item {
  width: 45px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  padding: 2.5px 0px;
  box-sizing: border-box;
}
.tab-container-item {
  height: 40px;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 5px 10px;
  box-sizing: border-box;
}
.tab-container-item:hover {
  background: linear-gradient(
    180deg,
    rgba(246, 246, 246, 1) 0%,
    rgba(233, 233, 233, 1) 100%
  );
}
.view-item-title,
.tab-item-title {
  width: 100%;
  text-align: center;
  font-size: 12px;
}
.tab-item-title {
  text-align: left;
}
.view-item-img {
  width: 26px;
  height: 26px;
  object-fit: cover;
}

.tab-item-img {
  width: 20px;
  height: 20px;
  object-fit: cover;
  margin-right: 10px;
}
.tab-info {
  position: absolute;
  right: 0.5%;
}
.tab-choose-title {
  width: 65px;
  height: 20px;
  position: absolute;
  top: 0px;
  right: 35px;
  text-align: center;
  border-radius: 2px;
  border: 1px solid rgba(151, 151, 151, 1);
  font-size: 12px;
  color: #666666;
}
</style>
