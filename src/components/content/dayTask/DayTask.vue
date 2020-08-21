<template>
  <div class="daytask">
    <div class="daytask-date">
      <div class="daytask-date-left"></div>
      <div class="daytask-date-item">{{yesterdayText}}</div>
      <div class="daytask-date-item">{{todayText}}</div>
      <div class="daytask-date-item">{{tommorwText}}</div>
      <div class="daytask-date-icon">
        <a-icon
          type="left"
          @click="dayPage=dayPage-1"
          :style="{ fontSize: '20px', margin: '0px 10px 0px 0px' }"
        />
        <a-icon type="right" @click="dayPage=dayPage+1" :style="{ fontSize: '20px'}" />
      </div>
    </div>
    <div class="daytask-container">
      <div class="daytask-info" v-for="(item,index) in groupMemberList" :key="index">
        <div
          v-if="yesterdayArray[index].arr.length>0|| todayArray[index].arr.length>0||tommorwArray[index].arr.length>0"
          :style="{width:'100%',height:'100%',display:'flex'}"
        >
          <div class="daytask-left" :style="{borderRight:'1px dotted'+fontColor}">
            <div class="daytask-left-img" :style="{backgroundImage:'url('+avatarBgImg+')'}">
              <div class="daytask-left-avatar">
                <img :src="item.avatar" />
              </div>
            </div>
            <div class="daytask-left-name">{{item.nickName}}</div>
          </div>
          <div class="daytask-right-date">
            <div class="daytask-right-date-num">
              <div :style="{width:'100%',color:fontColor}">
                <span
                  :style="{marginRight:'20px'}"
                >任务数: {{yesterdayArray[index].finishNum}} / {{yesterdayArray[index].arr.length}}</span>
                <span>工时: {{yesterdayArray[index].finishTime}} / {{yesterdayArray[index].allTime}}h</span>
              </div>
              <div :style="{width:'100%'}" v-if="yesterdayArray[index].percent>0">
                <a-progress
                  status="success"
                  :percent="yesterdayArray[index].percent"
                  :showInfo="false"
                />
              </div>
            </div>
            <div class="daytask-right-date-info">
              <div
                v-for="(dayItem,dayIndex) in yesterdayArray[index].arr"
                :key="dayIndex"
                class="daytask-right-date-item"
              >
                <TaskItem :cardItem="dayItem" v-on="$listeners" v-bind="$attrs" />
                <!-- 
                 @chooseTaskItem="chooseTaskItem"
              @changeTaskNewTitle="changeTaskNewTitle"
              @changeEditState="changeEditState"
                :style="checkIndex==='taskInfo'+index+key?{boxShadow:' 0 0 7px 0 rgba(0, 0, 0, 0.26)',borderLeft: '3px solid'+backgroundColor[value.taskType==10?5:value.taskType-1]}:{borderLeft: '3px solid'+backgroundColor[value.taskType==10?5:value.taskType-1]}"
                          @createNewTask="createNewTask"
                         @playAudio="playAudio"
                 @mouseenter.native="changeWide('taskInfo'+value._key,value._key)"
                @mouseleave.native="changeThin('taskInfo'+value._key,value._key)"-->
              </div>
            </div>
            <!-- <taskViewItem/> -->
          </div>
          <div class="daytask-right-date">
            <div class="daytask-right-date-num">
              <div :style="{width:'100%',color:fontColor}">
                <span
                  :style="{marginRight:'20px'}"
                >任务数: {{todayArray[index].finishNum}} / {{todayArray[index].arr.length}}</span>
                <span>工时: {{todayArray[index].finishTime}} / {{todayArray[index].allTime}}h</span>
              </div>
              <div :style="{width:'100%'}" v-if="todayArray[index].percent>0">
                <a-progress
                  status="success"
                  :percent="todayArray[index].percent"
                  :showInfo="false"
                />
              </div>
            </div>
            <div class="daytask-right-date-info">
              <div
                v-for="(dayItem,dayIndex) in todayArray[index].arr"
                :key="dayIndex"
                class="daytask-right-date-item"
              >
                <TaskItem :cardItem="dayItem" v-on="$listeners" v-bind="$attrs" />
              </div>
            </div>
          </div>
          <div class="daytask-right-date">
            <div class="daytask-right-date-num">
              <div :style="{width:'100%',color:fontColor}">
                <span
                  :style="{marginRight:'20px'}"
                >任务数: {{tommorwArray[index].finishNum}} / {{tommorwArray[index].arr.length}}</span>
                <span>工时: {{tommorwArray[index].finishTime}} / {{tommorwArray[index].allTime}}h</span>
              </div>
              <div :style="{width:'100%'}" v-if="tommorwArray[index].percent>0">
                <a-progress
                  status="success"
                  :percent="tommorwArray[index].percent"
                  :showInfo="false"
                />
              </div>
            </div>
            <div class="daytask-right-date-info">
              <div
                v-for="(dayItem,dayIndex) in tommorwArray[index].arr"
                :key="dayIndex"
                class="daytask-right-date-item"
              >
                <TaskItem :cardItem="dayItem" v-on="$listeners" v-bind="$attrs" />
              </div>
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
import avatarBgImg from "../../../assets/头像背景@1x.png";
export default {
  name: "DayTask",
  components: { TaskItem },
  computed: mapState({
    groupMemberList: state => state.group.groupMemberList,
    cardArray: state => state.task.cardArray,
    fontColor() {
      return this.getFontColor();
    }
  }),
  inject: ["backgroundColor", "getFontColor"],
  data() {
    return {
      today: 0,
      todayText: "",
      yesterday: 0,
      yesterdayText: "",
      tommorw: 0,
      tommorwText: "",
      todayArray: [],
      yesterdayArray: [],
      tommorwArray: [],
      dayPage: 0,
      checkIndex: null,
      avatarBgImg: avatarBgImg
    };
  },
  mounted() {},
  methods: {
    formatDate(date) {
      return (
        this.$moment(date).format("YYYY.MM.DD") +
        " " +
        this.$moment(date).format("dddd")
      );
    },
    getArray(dayTime, cardArray) {
      let member = {};
      let memberArray = [];
      let arr = cardArray.filter((item, index) => {
        const startTime = this.$moment(item.taskEndDate)
          .startOf("day")
          .valueOf();
        const endTime = this.$moment(item.taskEndDate)
          .endOf("day")
          .valueOf();
        return dayTime >= startTime && dayTime < endTime;
      });
      this.groupMemberList.forEach((memeberItem, memeberIndex) => {
        memberArray[memeberIndex] = {
          arr: [],
          finishNum: 0,
          finishTime: 0,
          allTime: 0
        };
        arr.forEach((item, index) => {
          if (
            (item.executorKey && memeberItem.userId == item.executorKey) ||
            (!item.executorKey && memeberItem.userId == item.creatorKey)
          ) {
            memberArray[memeberIndex].arr.push(item);
            memberArray[memeberIndex].allTime =
              memberArray[memeberIndex].allTime + item.hour;
            if (item.finishPercent == 1) {
              memberArray[memeberIndex].finishNum++;
              memberArray[memeberIndex].finishTime =
                memberArray[memeberIndex].finishTime + item.hour;
            }
          }
        });
        memberArray[memeberIndex].percent =
          (memberArray[memeberIndex].finishTime /
            memberArray[memeberIndex].arr.length) *
          100;
        memberArray[memeberIndex].arr.sort(
          (a, b) => a.finishPercent - b.finishPercent
        );
      });
      return memberArray;
    },
    getData(dayPage, cardArray) {
      let dayTime = 0;
      if (dayPage == 0) {
        dayTime = new Date().getTime();
      } else {
        dayTime = new Date().getTime() + dayPage * 86400000 * 3;
      }
      this.today = dayTime;
      this.yesterday = dayTime - 86400000;
      this.tommorw = dayTime + 86400000;
      this.todayText = this.formatDate(this.today);
      this.yesterdayText = this.formatDate(this.yesterday);
      this.tommorwText = this.formatDate(this.tommorw);
      if (dayPage == 0) {
        this.todayText = "今日 ( " + this.formatDate(this.today) + " )";
        this.yesterdayText = "昨日 ( " + this.formatDate(this.yesterday) + " )";
        this.tommorwText = "明日 ( " + this.formatDate(this.tommorw) + " )";
      }
      this.todayArray = this.getArray(this.today, cardArray);
      this.yesterdayArray = this.getArray(this.yesterday, cardArray);
      this.tommorwArray = this.getArray(this.tommorw, cardArray);
    },

    chooseTaskItem(key) {
      this.checkIndex = key;
    }
  },
  watch: {
    dayPage: {
      handler(newValue, oldValue) {
        if (newValue != oldValue) {
          this.getData(newValue, this.cardArray);
        }
      },
      immediate: true
    },
    cardArray: {
      handler(newValue, oldValue) {
        if (newValue != oldValue) {
          this.getData(this.dayPage, this._.cloneDeep(newValue));
        }
      },
      deep: true,
      immediate: true
    }
  }
};
</script>

<style lang="scss" scoped>
.daytask {
  width: 100%;
  height: auto;
  padding: 0px 0.5%;
}
.daytask-date {
  width: 100%;
  height: 50px;
  display: flex;
  position: relative;
}
.daytask-date-left {
  width: 16%;
  height: 100%;
}
.daytask-date-item {
  width: 28%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.daytask-date-icon {
  width: 50px;
  position: absolute;
  top: 0px;
  right: 10px;
  bottom: 0px;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
}
.daytask-container {
  width: 100%;
  height: calc(100% - 50px);
  overflow: auto;
}
.daytask-info {
  width: 100%;
  // padding-bottom: 5px;
  // box-sizing: border-box;
  display: flex;
}
.daytask-left {
  width: 16%;
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  flex-wrap: wrap;
}
.daytask-left-img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
}
.daytask-left-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
}
.daytask-left-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.daytask-left-name {
  width: 100%;
  text-align: center;
}
.daytask-right-date {
  width: 26%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  border-radius: 8px;
  margin-right: 2%;
}
.daytask-right-date-num {
  width: 100%;
  height: 45px;
  color: #999;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 5px 8.5px 0px 20px;
  box-sizing: border-box;
}
.daytask-right-date-info {
  height: calc(100% - 45px);
  width: 100%;
  overflow: auto;
}
.daytask-right-date-item {
  width: 100%;
  min-height: 58px;
  padding-left: 20px;
  box-sizing: border-box;
  padding-bottom: 1px;
}
</style>