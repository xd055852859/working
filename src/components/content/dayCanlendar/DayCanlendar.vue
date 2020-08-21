<template>
  <div class="dayCanlendar" :style="{color:fontColor}" ref="dayCanlendar">
    <div class="dayCanlendar-container" :style="{color:fontColor,width:colWidth*30+'px'}">
      <div
        v-for="(item,index) in dayCanlendarArray"
        :key="index"
        class="dayCanlendar-box"
        :style="{width:colWidth+'px'}"
      >
        <div class="dayCanlendar-date">
          <span :style="{marginRight:'10px'}">{{dateArray[index].date[0]}}</span>
          <span>{{dateArray[index].date[1]}}</span>
        </div>
        <div v-if="JSON.stringify(item)!='{}'" class="dayCanlendar-info">
          <div v-for="(dayItem,dayIndex) in item" :key="dayIndex">
            <div class="dayCanlendar-title" v-if="groupType!=1">
              <div class="dayCanlendar-img">
                <img :src="dayItem[0]|defaultHuman" alt />
              </div>
              <div class="dayCanlendar-name">{{dayItem[0]?dayItem[0].executorName:""}}</div>
            </div>
            <div
              class="dayCanlendar-info-item"
              v-for="(taskItem,taskIndex) in dayItem"
              :key="taskIndex"
            >
              <TaskItem
                :cardItem="taskItem"
                v-on="$listeners"
                v-bind="$attrs"
                v-if="taskItem&&taskItem.show"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { mapState, mapActions } from "vuex";
import TaskItem from "../task/TaskItem";
import format from "../../common/format";
import avatarBgImg from "../../../assets/头像背景@1x.png";
export default {
  name: "DayCanlendar",
  components: { TaskItem },
  props: ["taskObj"],
  computed: {
    fontColor() {
      return this.getFontColor();
    }
  },
  inject: ["backgroundColor", "getFontColor"],
  data() {
    return {
      dayCanlendarArray: [],
      dateArray: [],
      colNumbers: 5,
      colWidth: 0
    };
  },
  mounted() {
    this.getColNumbers();
  },
  computed: mapState({
    user: state => state.auth.user,
    deviceWidth: state => state.common.deviceWidth,
    targetUInfo: state => state.auth.targetUInfo,
    groupType: state => state.group.groupType,
    allGroupArray: state => state.task.allGroupArray,
    allTaskArray: state => state.task.allTaskArray,
    cardArray: state => state.task.cardArray,
    taskType: state => state.task.taskType,
    fontColor() {
      return this.getFontColor();
    }
  }),
  methods: {
    formatDate(date) {
      return (
        this.$moment(date).format("YYYY.MM.DD") +
        " " +
        this.$moment(date).format("dddd")
      );
    },
    getColNumbers() {
      let clientWidth = this.$refs.dayCanlendar.clientWidth;
      let size = 13;
      if (clientWidth <= 900) {
        this.colNumbers = 1;
        size = 15;
      } else if (clientWidth > 900 && clientWidth <= 1440) {
        this.colNumbers = 3;
        size = 14;
      } else {
        this.colNumbers = 5;
      }
      this.colWidth = Math.floor(clientWidth / this.colNumbers);
      this.$nextTick(() => {
        // const left = document.getElementById(this.actives).offsetLeft;
        // this.$refs.nav.scrollTo({
        // 	left: left,
        // 	behavior: "smooth"
        // })
        this.$refs.dayCanlendar.scrollTo(this.colWidth * size, 0);
      });
    },
    getData(taskArray, taskObj) {
      this.dateArray = [];
      this.dayCanlendarArray = [];
      let arr1 = [];
      let arr2 = [];
      let arr3 = [];
      for (let i = 15; i > 0; i--) {
        arr1.push({
          start: this.$moment(new Date())
            .subtract(i, "days")
            .startOf("day")
            .valueOf(),
          end: this.$moment(new Date())
            .subtract(i, "days")
            .endOf("day")
            .valueOf()
        });
      }
      for (let i = 0; i < 15; i++) {
        arr2.push({
          start: this.$moment(new Date())
            .add(i, "days")
            .startOf("day")
            .valueOf(),
          end: this.$moment(new Date())
            .add(i, "days")
            .endOf("day")
            .valueOf()
        });
      }
      arr3 = arr1.concat(arr2);
      arr3.forEach((item, index) => {
        this.dateArray[index] = {
          arr: [],
          date: this.formatTime(item.start)
        };
        // taskArray = format.formatCard(
        //   taskType,
        //   this._.flatten(taskArray),
        //   this.groupType != 2 ? this.user._key : this.targetUInfo.userId
        // );
        taskArray = this._.cloneDeep(
          format.formatFilter(this._.flatten(taskArray), taskObj)
        );
        taskArray.forEach((taskItem, taskIndex) => {
          if (
            taskItem.taskEndDate >= item.start &&
            taskItem.taskEndDate < item.end
          ) {
            this.dateArray[index].arr.push(taskItem);
          }
        });
      });
      this.dateArray.forEach((item, index) => {
        this.dayCanlendarArray[index] = {};
        item.arr.forEach((taskItem, taskIndex) => {
          if (taskItem.executorKey) {
            if (!this.dayCanlendarArray[index][taskItem.executorKey]) {
              this.dayCanlendarArray[index][taskItem.executorKey] = [];
            }
            this.dayCanlendarArray[index][taskItem.executorKey].push(taskItem);
          }
        });
      });
    },
    formatTime(time) {
      let week = this.$moment(time).day();
      let timeStr = "";
      switch (week) {
        case 1:
          timeStr = "周一 ";
          break;
        case 2:
          timeStr = "周二 ";
          break;
        case 3:
          timeStr = "周三 ";
          break;
        case 4:
          timeStr = "周四 ";
          break;
        case 5:
          timeStr = "周五 ";
          break;
        case 6:
          timeStr = "周六 ";
          break;
        case 0:
          timeStr = "周日 ";
          break;
      }
      return [timeStr, this.$moment(time).format("M.DD")];
    }
  },
  watch: {
    allTaskArray: {
      handler(newValue) {
        if (this.groupType != 3) {
          this.getData(this._.cloneDeep(newValue), this.taskObj);
        }
      },
      immediate: true,
      deep: true
    },
    cardArray: {
      handler(newValue) {
        if (this.groupType == 3) {
          this.getData(this._.cloneDeep(newValue), this.taskObj);
        }
      },
      immediate: true,
      deep: true
    },
    groupType(newValue, oldValue) {
      if (newValue != oldValue && newValue) {
        if (newValue == 3) {
          this.getData(this._.cloneDeep(this.cardArray), this.taskObj);
        } else {
          this.getData(this._.cloneDeep(this.allTaskArray), this.taskObj);
        }
      }
    },
    // taskType(newValue, oldValue) {
    //   if (newValue != oldValue) {
    //     if (this.groupType == 3) {
    //       this.getData(this._.cloneDeep(this.cardArray), newValue);
    //     } else {
    //       this.getData(this._.cloneDeep(this.allTaskArray), newValue);
    //     }
    //   }
    // },
    taskObj: {
      handler(newValue) {
        if (this.groupType == 3) {
          this.getData(this._.cloneDeep(this.cardArray), newValue);
        } else {
          this.getData(this._.cloneDeep(this.allTaskArray), newValue);
        }
      },
      deep: true
    },
    deviceWidth(newVal, oldVal) {
      if (newVal != oldVal) {
        this.getColNumbers();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.dayCanlendar {
  height: calc(100% - 90px);
  width: 100%;
  justify-content: center;
  overflow: auto;
}
.dayCanlendar-container {
  width: 100%;
  height: 100%;
  display: flex;
}
.dayCanlendar-title {
  width: 100%;
  height: 30px;
  display: flex;
}
.dayCanlendar-img {
  width: 24px;
  height: 24px;
  margin-right: 10px;
  overflow: hidden;
  border-radius: 50%;
}
.dayCanlendar-img > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.dayCanlendar-date {
  width: 100%;
  height: 39px;
  line-height: 39px;
  text-align: center;
}
.dayCanlendar-box {
  flex-shrink: 0;
  padding:0px 5px;
  box-sizing: border-box;
}
.dayCanlendar-info {
  width: 100%;
  height: calc(100% - 42px);
}
.dayCanlendar-info > div {
  width: 100%;
  margin-top: 1px;
  overflow: auto;
}
.dayCanlendar-info-item:last-child > div {
  margin-bottom: 0px;
}
.dayCanlendar::-webkit-scrollbar {
  width: 3px;
  height: 8px;
}
</style>