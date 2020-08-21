<template>
  <div
    class="countdown-right"
    :style="{width:'350px',backgroundColor:countType=='index'?'#fff':'#7690d3'}"
  >
    <div class="countdown-right-tab" :style="{color:countType=='index'?'#333':'#fff'}">
      <div @click="chooseTab(0)">
        <span
          :style="chooseIndex==0?{borderBottom: '3px solid '+(countType=='index'?'#333':'#fff')}:null"
        >我的</span>
      </div>
      <div @click="chooseTab(1)">
        <span
          :style="chooseIndex==1?{borderBottom: '3px solid '+(countType=='index'?'#333':'#fff')}:null"
        >working</span>
      </div>
      <div @click="chooseTab(2)">
        <span
          :style="chooseIndex==2?{borderBottom: '3px solid '+(countType=='index'?'#333':'#fff')}:null"
        >team</span>
      </div>
      <div @click="chooseTab(3)">
        <span
          :style="chooseIndex==3?{borderBottom: '3px solid '+(countType=='index'?'#333':'#fff')}:null"
        >project</span>
      </div>
    </div>
    <div
      class="countdown-right-item"
      v-if="groupArray.length>0"
      :style="{color:countType=='index'?'#333':'#fff'}"
    >
      <div class="countdown-right-cup" ref="cupchartdiv" id="cupchartdiv"></div>
      <div v-for="(item,index) in groupArray" :key="index">
        <div class="countdown-right-group">
          <div>
            <div class="countdown-right-group-logo">
              <img :src="item[0]|defaultLogo" alt />
            </div>
            {{item[0]|defaultGroupName}}
          </div>
          <!-- <a-icon
              type="down"
              :style="{marginLeft:'5px',fontSize:'15px'}"
              @click="showTab(index)"
              v-if="showTabObj[index]"
            />
            <a-icon
              type="up"
              :style="{marginLeft:'5px',fontSize:'15px'}"
              @click="showTab(index)"
              v-if="!showTabObj[index]"
          />-->
        </div>
        <div
          :style="{backgroundColor: countType=='index'?'rgba(0, 0, 0, 0.05)':'rgba(0, 0, 0, 0.12)'}"
          class="countdown-right-info"
        >
          <div
            class="countdown-right-task"
            v-for="(taskItem,taskIndex) in item"
            :key="taskIndex"
            @click="taskItem.finishPercent==0&&taskItem.executorKey==user._key?changeCard(taskItem._key,taskItem):null"
          >
            <img
              :src="taskItem.finishPercent?finishTaskImg:unfinishTaskImg"
              class="countdown-right-icon"
              v-if="chooseIndex!=1"
            />
            <img
              :src="taskItem.executorAvatar"
              class="countdown-right-avatar"
              v-if="chooseIndex==1"
            />
            <!-- <div class="countdown-right-top">
                <div class="countdown-right-name">
                  <div class="countdown-right-avatar">
                    <img :src="taskItem.executorAvatar" />
                  </div>
                  <div>{{taskItem.executorName}}</div>
                </div>          
                <div>{{taskItem.countDownText}}</div>
            </div>-->
            <div
              class="countdown-day"
              v-if="taskItem.hour&&taskItem.taskEndDate&&chooseIndex!=1"
              :style="!taskItem.endState?taskItem.finishPercent==0?{backgroundColor:'red'}:{backgroundColor:'#417505'}:null"
            >
              <div
                class="countdown-time-day"
                :style="{left:taskItem.time<10? '5px':'0px'}"
              >{{taskItem.time}}</div>
              <div class="countdown-time"></div>
              <div
                class="countdown-time-hour"
                :style="{right:taskItem.hour<1? '4px':'0px'}"
              >{{taskItem.hour}}</div>
            </div>
            <div
              class="countdown-right-title"
              :style="taskItem.finishPercent?{textDecoration:'line-through',color:'#979797'}:null"
            >{{taskItem.title}}</div>
            <!-- <a-progress
                :percent="taskItem.percent"
                :strokeColor="'#FFB445'"
                :showInfo="false"
                :strokeWidth="3"
                :style="{width:'100%'}"
                class="countdown-right-progress"
            />-->
          </div>
        </div>
      </div>
    </div>
    <div
      class="countdown-right-item"
      v-if="JSON.stringify(personObj)!='{}'"
      :style="{color:countType=='index'?'#333':'#fff'}"
    >
      <div v-for="(item,index) in personObj" :key="index">
        <div class="countdown-right-person-item">
          <img :src="item[0].executorAvatar" class="countdown-right-person-avatar" />
          {{item[0].executorName}}
        </div>
        <div v-for="(personItem,personIndex) in  personGroupObj[index]" :key="personIndex">
          <div class="countdown-right-group" :style="{marginTop:'5px'}">
            <div>
              <div class="countdown-right-group-logo">
                <img :src="personItem[0]|defaultLogo" alt />
              </div>
              {{personItem[0]|defaultGroupName}}
            </div>
          </div>
          <div
            :style="{backgroundColor: countType=='index'?'rgba(0, 0, 0, 0.05)':'rgba(0, 0, 0, 0.12)'}"
            class="countdown-right-info"
          >
            <div
              class="countdown-right-task"
              v-for="(taskItem,taskIndex) in personItem"
              :key="taskIndex"
            >
              <img
                :src="taskItem.finishPercent?finishTaskImg:unfinishTaskImg"
                class="countdown-right-icon"
              />
              <div
                class="countdown-day"
                v-if="taskItem.hour&&taskItem.taskEndDate"
                :style="!taskItem.endState?taskItem.finishPercent==0?{backgroundColor:'red'}:{backgroundColor:'#417505'}:null"
              >
                <div
                  class="countdown-time-day"
                  :style="{left:taskItem.time<10? '5px':'0px'}"
                >{{taskItem.time}}</div>
                <div class="countdown-time"></div>
                <div
                  class="countdown-time-hour"
                  :style="{right:taskItem.hour<1? '4px':'0px'}"
                >{{taskItem.hour}}</div>
              </div>
              <div
                class="countdown-right-title"
                :style="taskItem.finishPercent?{textDecoration:'line-through',color:'#979797'}:null"
              >{{taskItem.title}}</div>
              <div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="countdown-right-item"
      v-if="groupProjectArray.length>0"
      :style="{color:countType=='index'?'#333':'#fff'}"
    >
      <div v-for="(item,index) in groupProjectArray" :key="index">
        <div class="countdown-right-person-item">
          <img :src="item.groupObj.groupLogo|defaultGroup" class="countdown-right-person-avatar" />
          {{item.groupObj.groupName}}
        </div>
        <div v-for="(groupItem,groupIndex) in item" :key="groupIndex">
          <div
            class="countdown-right-group"
            :style="{marginTop:'5px'}"
            v-if="groupIndex!='groupObj'&&groupIndex!='position'"
          >{{groupItem.labelObj?groupItem.labelObj.cardLabelName:"无标题"}}</div>
          <!--   :style="!showTabObj[index]&&tabIndex==index?{height:'0px',overflow:'hidden'}:null" -->
          <div
            :style="{backgroundColor: countType=='index'?'rgba(0, 0, 0, 0.05)':'rgba(0, 0, 0, 0.12)'}"
            class="countdown-right-info"
          >
            <div
              class="countdown-right-task"
              v-for="(taskItem,taskIndex) in groupItem.arr"
              :key="taskIndex"
            >
              <img
                :src="taskItem.finishPercent?finishTaskImg:unfinishTaskImg"
                class="countdown-right-icon"
              />
              <div
                class="countdown-day"
                v-if="taskItem.hour&&taskItem.taskEndDate"
                :style="!taskItem.endState?taskItem.finishPercent==0?{backgroundColor:'red'}:{backgroundColor:'#417505'}:null"
              >
                <div
                  class="countdown-time-day"
                  :style="{left:taskItem.time<10? '5px':'0px'}"
                >{{taskItem.time}}</div>
                <div class="countdown-time"></div>
                <div
                  class="countdown-time-hour"
                  :style="{right:taskItem.hour<1? '4px':'0px'}"
                >{{taskItem.hour}}</div>
              </div>
              <div
                class="countdown-right-title"
                :style="taskItem.finishPercent?{textDecoration:'line-through',color:'#979797'}:null"
              >{{taskItem.title}}</div>
              <div class="countdown-right-project-avatar" v-if="taskItem.executorAvatar">
                <img :src="taskItem.executorAvatar" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import finishTaskImg from "@/assets/finishTask.png";
import unfinishTaskImg from "@/assets/unfinishTask.png";
import chart from "../common/chart";
export default {
  name: "CountdownTab",
  props: ["countType"],
  data() {
    return {
      chooseIndex: 0,
      showTabState: true,
      tabIndex: null,
      groupArray: [],
      groupProjectArray: [],
      personObj: {},
      personGroupObj: {},
      showTabObj: {},
      finishTaskImg,
      unfinishTaskImg,
      cupchart: null,
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.auth.user,
      countDownList: (state) => state.countdown.countDownList,
      countDownTaskList: (state) => state.countdown.countDownTaskList,
      countDownGroupArray: (state) => state.task.countDownGroupArray,
      countDownTaskArray: (state) => state.task.countDownTaskArray,
      countDownTeamList: (state) => state.countdown.countDownTeamList,
    }),
  },

  mounted() {
    this.getCountDownList({
      typeBoard1: 1,
      targetUGKey: this.user._key,
      finishPercentArray: "[0, 1]",
    });
    this.$nextTick(() => {
      Array.from(document.querySelectorAll("svg")).forEach((item) => {
        if (item.parentElement.parentElement.style.width) {
          item.parentElement.parentElement.style.display = "none";
        }
      });
    });
  },
  methods: {
    ...mapActions("countdown", [
      "getTeamCareTask",
      "getCountDownTask",
      "getProjectCareTask",
      "getCountDownList",
    ]),
    showTab(index) {
      this.tabIndex = index;
      // item.showTabState = !item.showTabState;
      this.showTabObj[index] = !this.showTabObj[index];
    },
    async chooseTab(index) {
      this.chooseIndex = index;
      const startTime = this.$moment().startOf("day").valueOf();
      const endTime = this.$moment().endOf("day").valueOf();
      switch (index) {
        case 0:
          this.getData(this.countDownList);
          break;
        case 1:
          await this.getCountDownTask({
            type: 1,
            startTime: startTime,
            endTime: endTime,
          });
          this.getWorkingData(this.countDownTaskList);
          break;
        case 2:
          await this.getTeamCareTask({
            finishPercentArray: [0],
          });
          this.getTeamData(this.countDownTeamList);
          break;
        case 3:
          await this.getProjectCareTask({
            finishPercentArray: [0],
          });
          this.getProjectData(
            this.countDownGroupArray,
            this.countDownTaskArray
          );
      }
    },
    getData(arr) {
      let groupObj = {};
      this.clearData();
      let finishNum = 0;
      let unfinishNum = 0;
      const startTime = this.$moment().startOf("day").valueOf();
      const endTime = this.$moment().endOf("day").valueOf();
      arr.forEach((item, index) => {
        let finishState =
          item.finishPercent == 1 &&
          item.todayTaskTime >= startTime &&
          item.todayTaskTime < endTime;
        if (
          item.executorKey == this.user._key &&
          item.taskEndDate < endTime &&
          (finishState || item.finishPercent == 0) &&
          item.title != "" &&
          item.taskEndDate
        ) {
          if (!groupObj[item.groupKey]) {
            groupObj[item.groupKey] = [];
          }
          if (finishState) {
            finishNum++;
          } else if (item.finishPercent == 0) {
            unfinishNum++;
          }
          item = this.formatDay(item);
          groupObj[item.groupKey].push(item);
          // this.showTabObj[item.groupKey] = true;
          groupObj[item.groupKey] = this._.sortBy(groupObj[item.groupKey], [
            "taskEndDate",
          ]).reverse();
          groupObj[item.groupKey] = this._.sortBy(groupObj[item.groupKey], [
            "finishPercent",
          ]);
        }
      });
      this.groupArray = this._.sortBy(this._.values(groupObj), ["groupName"]);
      let pencent = parseInt((unfinishNum / (unfinishNum + finishNum)) * 100);
      let data = [
        {
          name: "未完成任务",
          value: pencent,
          // disabled: true,
        },
        {
          name: "已完成任务",
          value: 100 - pencent,
        },
      ];
      this.$nextTick(() => {
        this.cupchart = chart.createCupChart("cupchartdiv", data);
      });
    },
    getWorkingData(arr) {
      let groupObj = {};
      this.clearData();
      arr.forEach((item, index) => {
        if (item.groupName.indexOf("主群") == -1 && item.title != "") {
          if (!groupObj[item.groupKey]) {
            groupObj[item.groupKey] = [];
          }
          item = this.formatDay(item);
          groupObj[item.groupKey].push(item);
          // this.showTabObj[item.groupKey] = true;
          groupObj[item.groupKey] = this._.sortBy(groupObj[item.groupKey], [
            "taskEndDate",
          ]).reverse();
          groupObj[item.groupKey] = this._.sortBy(groupObj[item.groupKey], [
            "finishPercent",
          ]);
        }
      });
      this.groupArray = this._.sortBy(this._.values(groupObj), ["groupName"]);
    },
    getTeamData(arr) {
      this.clearData();
      arr.forEach((item, index) => {
        if (
          item.executorKey != this.user._key &&
          item.groupName.indexOf("主群") == -1 &&
          item.title != ""
        ) {
          if (!this.personObj[item.executorKey]) {
            this.personObj[item.executorKey] = [];
          }
          item = this.formatDay(item);
          this.personObj[item.executorKey].push(item);
          // this.showTabObj[item.executorKey] = true;
          this.personObj[item.executorKey] = this._.sortBy(
            this.personObj[item.executorKey],
            ["taskEndDate"]
          ).reverse();
        }
      });
      for (let key in this.personObj) {
        this.personGroupObj[key] = {};
        this.personObj[key].forEach((personItem, personIndex) => {
          if (!this.personGroupObj[key][personItem.groupKey]) {
            this.personGroupObj[key][personItem.groupKey] = [];
          }
          this.personGroupObj[key][personItem.groupKey].push(personItem);
        });
      }
    },
    getProjectData(groupArray, taskArray) {
      let arr = [];
      this.clearData();
      taskArray.forEach((item, index) => {
        arr[index] = { groupObj: groupArray[index] };
        item.forEach((groupItem, groupIndex) => {
          if (groupItem.finishPercent == 0 && item.title != "") {
            if (groupItem.labelKey) {
              if (!arr[index][groupItem.labelKey]) {
                let labelIndex = _.findIndex(groupArray[index].labelArray, {
                  _key: groupItem.labelKey,
                });
                arr[index][groupItem.labelKey] = {
                  arr: [],
                  labelObj: groupArray[index].labelArray[labelIndex],
                };
              }
              arr[index][groupItem.labelKey].arr = this.sortArr(
                arr[index][groupItem.labelKey].arr,
                groupItem
              );
            } else {
              if (!arr[index]["ToDo"]) {
                arr[index]["ToDo"] = {
                  arr: [],
                  labelObj: { cardLabelName: "ToDo" },
                };
              }
              arr[index]["ToDo"].arr = this.sortArr(
                arr[index]["ToDo"].arr,
                groupItem
              );
            }
          }
        });
      });
      this.groupProjectArray = arr;
    },
    formatDay(item) {
      let time = 0;
      item.percent = parseInt(
        (item.hour * 3600000 - item.countDownTime) / (item.hour * 36000)
      );
      let countTime = item.hour * 3600000 - item.countDownTime;
      let hours = parseInt(
        (countTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      let minutes = parseInt((countTime % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = parseInt((countTime % (1000 * 60)) / 1000);
      item.countDownText =
        this.addZero(hours) +
        " : " +
        this.addZero(minutes) +
        " : " +
        this.addZero(seconds);
      if (item.taskEndDate) {
        time = Math.floor(
          (this.$moment(item.taskEndDate).endOf("day").valueOf() -
            this.$moment(new Date().getTime()).endOf("day").valueOf()) /
            86400000
        );
      }
      item.time = time < 0 ? Math.abs(time) : Math.abs(time) + 1;
      item.endState = time < 0 ? false : true;
      return item;
    },
    addZero(num) {
      return num > 9 ? num + "" : "0" + num;
    },
    sortArr(arr, item) {
      item = this.formatDay(item);
      arr.push(item);
      arr = this._.sortBy(arr, ["taskEndDate"]).reverse();
      arr = this._.sortBy(arr, ["finishPercent"]);
      return arr;
    },
    clearData() {
      this.personObj = {};
      this.groupArray = [];
      this.showTabObj = {};
      this.personGroupObj = {};
      this.groupProjectArray = [];
    },
  },
  watch: {
    countDownList: {
      handler(newValue, oldValue) {
        console.log(newValue);
        if (newValue) {
          this.getData(newValue);
        }
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.countdown-right {
  height: 100%;
  padding: 6px 15px;
  box-sizing: border-box;
  overflow: auto;
}
.countdown-right-tab {
  width: 100%;
  height: 39px;
  display: flex;
  // border: 1px solid rgba(26, 202, 142, 1);
  // border: 1px solid rgba(213, 213, 213, 1);
  overflow: hidden;
}
.countdown-right-tab > div {
  width: 33%;
  height: 39px;
  line-height: 39px;
  text-align: center;
}
.countdown-right-tab > div > span {
  display: inline-block;
  height: 100%;
}
.countdown-right-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 10px;
  margin: 14px 0px 10px 0px;
}
.countdown-right-item {
  width: 100%;
  height: calc(100% - 90px);
  overflow: auto;
}
.countdown-right-group > div {
  display: flex;
  align-items: center;
}
.countdown-right-group-logo,
.countdown-right-avatar,
.countdown-right-person-avatar {
  width: 22px;
  height: 22px;
  overflow: hidden;
  border-radius: 50%;
  margin-right: 5px;
}
.countdown-right-icon {
  width: 14px;
  height: 14px;
  margin-right: 5px;
}
.countdown-right-avatar {
  width: 34px;
  height: 34px;
  margin-right: 5px;
}
.countdown-right-person-avatar {
  width: 24px;
  height: 24px;
  margin-right: 5px;
}
.countdown-right-group-logo img,
.countdown-right-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.countdown-right-task {
  width: 100%;
  min-height: 30px;
  // background-color: rgba(255, 255, 255, 0.4);
  // color: #000;
  font-size: 10px;
  padding: 6px 12px;
  box-sizing: border-box;
  position: relative;
  display: flex;
  // align-content: space-between;
  align-items: center;
  position: relative;
  // flex-wrap: wrap;
}

.countdown-right-info > img {
  width: 14px;
  height: 14px;
  margin-right: 8px;
}
.countdown-right-top {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.countdown-right-title {
  // color: #000;
  font-size: 12px;
  width: calc(100% - 24px);
}
.countdown-right-name {
  display: flex;
  align-items: center;
}
.countdown-right-progress {
  position: absolute;
  left: 0px;
  bottom: -8px;
}
.countdown-right-person-item {
  width: 100%;
  height: 35px;
  display: flex;
  align-items: center;
}
.countdown-day {
  width: 20px;
  height: 20px;
  line-height: 20px;
  padding: 3px 0px 0px 6px;
  color: #fff;
  background-color: #535353;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  margin-right: 5px;
  font-size: 12px;
}
.countdown-time {
  width: 0;
  height: 0;
  border-width: 20px;
  border-style: solid;
  border-color: #35a6f8 transparent transparent transparent;
  position: absolute;
  top: -2px;
  right: -20px;
  z-index: 2;
}
.countdown-time-hour {
  width: 10px;
  height: 10px;
  line-height: 10px;
  font-size: 8px;
  color: #fff;
  position: absolute;
  top: 0px;
  z-index: 3;
  transform: scale(0.7);
}
.countdown-time-day {
  width: 10px;
  height: 10px;
  line-height: 10px;
  font-size: 10px;
  color: #fff;
  position: absolute;
  bottom: 0px;
  z-index: 3;
}
.countdown-right-project-avatar {
  width: 18px;
  height: 18px;
  position: absolute;
  bottom: 5px;
  right: 5px;
  border-radius: 50%;
  overflow: hidden;
}
.countdown-right-project-avatar > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.countdown-right-cup {
  height: 220px;
  width: 100%;
}
</style>