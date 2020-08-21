<template>
  <div :style="{width:'100%',height:'100%',overflow:'auto',position:'relative'}">
    <div class="choose-container">
      <a-radio-group v-model="taskState" @change="onChange">
        <a-radio
          v-for="(item,index) in taskTitleArr"
          :key="index"
          :value="index"
          :style="{color:fontColor,height:'40px'}"
        >{{item}}</a-radio>
      </a-radio-group>
    </div>
    <div class="chart-XYcontainer" :style="{height:60*XYlength+'px',minHeight:'120px'}">
      <div class="chart-left-title">执行任务数排名</div>
      <div class="chart-middle-title">执行工时排名</div>
      <div class="chart-right-title">创建任务数排名</div>
      <div class="chart" ref="XYLeftchartdiv" id="XYLeftchartdiv"></div>
      <div class="chart" ref="XYLeft1chartdiv" id="XYLeft1chartdiv"></div>
      <div class="chart" ref="XYRightchartdiv" id="XYRightchartdiv"></div>
    </div>
    <!-- <div class="chart-container">
     
    
      <div class="chart" ref="XYRight1chartdiv" id="XYRight1chartdiv"></div>
    </div>-->
    <div class="chart-container" :style="{height:'700px'}">
      <div class="chart-div" ref="chartdiv" id="chartdiv"></div>
    </div>
    <div class="countdown-right-item" ref="groupData">
      <div
        v-for="(item,index) in personObj"
        :key="index"
        :ref="'groupData'+index"
        :style="{
            width: (colWidth-5)+'px',
            position: 'absolute',
            top: positionObj[index]?positionObj[index].top + 'px':0,
            left: positionObj[index]?positionObj[index].left + 'px':0,
            backgroundColor: '#7690d3',
      }"
      >
        <div v-if="index!='position'">
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
            <div class="countdown-right-info">
              <div
                class="countdown-right-task"
                v-for="(taskItem,taskIndex) in personItem"
                :key="taskIndex"
              >
                <TaskItem
                  :cardItem="taskItem"
                  v-on="$listeners"
                  v-bind="$attrs"
                  :bottomtype="bottomtype"
                />
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
import chart from "../common/chart";
import TaskItem from "../content/task/TaskItem";
import finishTaskImg from "@/assets/finishTask.png";
import unfinishTaskImg from "@/assets/unfinishTask.png";
export default {
  name: "GroupData",
  components: { TaskItem},
  props: ["fontColor"],
  data() {
    return {
      personObj: {},
      personGroupObj: {},
      finishTaskImg: finishTaskImg,
      unfinishTaskImg: unfinishTaskImg,
      bottomtype: "groupData",
      colWidth: 0,
      colNumbers: 4,
      colHeight: [],
      positionObj: {},
      chart: null,
      XYchart: null,
      XYLeftchart: null,
      XYLeft1chart: null,
      XYRightchart: null,
      startTaskTime: 0,
      endTaskTime: 0,
      endTime: 0,
      taskState: 0,
      taskTitleArr: ["昨日完成", "今日计划", "未完成任务", "已完成任务"],
      XYlength: 0,
    };
  },
  async mounted() {
    this.getColNumbers();
    this.handleChart(this.taskState);
    this.$nextTick(() => {
      Array.from(document.querySelectorAll("svg")).forEach((item) => {
        if (item.parentElement.parentElement.style.width) {
          item.parentElement.parentElement.style.display = "none";
        }
      });
    });
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose();
    }
    if (this.XYchart) {
      this.XYchart.dispose();
    }
    if (this.XYLeftchar) {
      this.XYLeftchar.dispose();
    }
    if (this.XYLeft1char) {
      this.XYLeft1char.dispose();
    }
    // this.XYRightchar.dispose();
  },
  computed: {
    ...mapState({
      user: (state) => state.auth.user,
      countDownTeamList: (state) => state.countdown.countDownTeamList,
      groupKey: (state) => state.group.groupKey,
      linkState: (state) => state.card.linkState,
      deviceWidth: (state) => state.common.deviceWidth,
    }),
  },
  methods: {
    ...mapActions("countdown", ["getTeamCareTask"]),
    onChange(e) {
      this.taskState = parseInt(e.target.value);
    },
    handleChart(taskState) {
      let data = [];
      let newData = {};
      let XYLeftdata = [];
      let newXYLeftData = {};
      let XYRightdata = [];
      let newXYRightData = {};
      let XYLeft1data = [];
      let newXYLeft1Data = {};
      let XYRight1data = [];
      let newXYRight1Data = {};
      let state = false;
      this.startTaskTime = this.$moment(new Date())
        .subtract(1, "days")
        .startOf("day")
        .valueOf();
      this.endTaskTime = this.$moment(new Date())
        .subtract(1, "days")
        .endOf("day")
        .valueOf();
      this.startTime = this.$moment(new Date()).startOf("day").valueOf();
      this.endTime = this.$moment(new Date()).endOf("day").valueOf();
      //(item.todayTaskTime > this.startTaskTime &&
      //   item.todayTaskTime <= this.endTaskTime &&
      //   item.finishPercent == 1) ||
      // (item.taskEndDate <= this.endTime && item.finishPercent == 0)

      this.countDownTeamList.forEach((item) => {
        switch (taskState) {
          case 0:
            state =
              item.todayTaskTime > this.startTaskTime &&
              item.todayTaskTime <= this.endTaskTime &&
              item.finishPercent == 1;
            break;
          case 1:
            state =
              item.taskEndDate > this.startTime &&
              item.taskEndDate <= this.endTime;
            break;
          case 2:
            state = item.finishPercent == 0;
            break;
          case 3:
            state = item.finishPercent == 1;
            break;
        }
        if (
          item.groupName &&
          item.groupName.indexOf("主群") == -1 &&
          item.title != "" &&
          state &&
          item.taskEndDate
        ) {
          if (!newData[item.creatorName + "-" + item.executorName]) {
            newData[item.creatorName + "-" + item.executorName] = 1;
          } else {
            newData[item.creatorName + "-" + item.executorName] =
              newData[item.creatorName + "-" + item.executorName] + 1;
          }
          if (!newXYLeftData[item.executorName]) {
            newXYLeftData[item.executorName] = {
              num: 1,
              item: item,
            };
          } else {
            newXYLeftData[item.executorName].num =
              newXYLeftData[item.executorName].num + 1;
          }
          if (!newXYRightData[item.creatorName]) {
            newXYRightData[item.creatorName] = {
              num: 1,
              item: item,
            };
          } else {
            newXYRightData[item.creatorName].num =
              newXYRightData[item.creatorName].num + 1;
          }
          if (!newXYLeft1Data[item.executorName]) {
            newXYLeft1Data[item.executorName] = {
              hour: item.hour,
              item: item,
            };
          } else {
            newXYLeft1Data[item.executorName].hour =
              newXYLeft1Data[item.executorName].hour + item.hour;
          }
          if (!newXYRight1Data[item.creatorName]) {
            newXYRight1Data[item.creatorName] = {
              hour: item.hour,
              item: item,
            };
          } else {
            newXYRight1Data[item.creatorName].hour =
              newXYRight1Data[item.creatorName].hour + item.hour;
          }
        }
        // {"from":"Monica","to":"Rachel","value":4}
      });
      for (let key in newData) {
        let keyArr = key.split("-");
        data.push({ from: keyArr[0], to: keyArr[1], value: newData[key] });
      }
      for (let key in newXYLeftData) {
        XYLeftdata.push({
          name: newXYLeftData[key].item.executorName,
          steps: newXYLeftData[key].num,
          href:
            newXYLeftData[key].item.executorAvatar +
            "?imageMogr2/auto-orient/thumbnail/50x50/format/jpg",
        });
      }
      for (let key in newXYRightData) {
        XYRightdata.push({
          name: newXYRightData[key].item.creatorName,
          steps: newXYRightData[key].num,
          href:
            newXYRightData[key].item.creatorAvatar +
            "?imageMogr2/auto-orient/thumbnail/50x50/format/jpg",
        });
      }
      for (let key in newXYLeft1Data) {
        XYLeft1data.push({
          name: newXYLeft1Data[key].item.executorName,
          steps: newXYLeft1Data[key].hour,
          href:
            newXYLeft1Data[key].item.executorAvatar +
            "?imageMogr2/auto-orient/thumbnail/50x50/format/jpg",
        });
      }
      for (let key in newXYRight1Data) {
        XYRight1data.push({
          name: newXYRight1Data[key].item.creatorName,
          steps: newXYRight1Data[key].hour,
          href:
            newXYRight1Data[key].item.creatorAvatar +
            "?imageMogr2/auto-orient/thumbnail/50x50/format/jpg",
        });
      }
      XYLeftdata = _.sortBy(XYLeftdata, ["steps"]);
      XYRightdata = _.sortBy(XYRightdata, ["steps"]);
      XYLeft1data = _.sortBy(XYLeft1data, ["steps"]);
      XYRight1data = _.sortBy(XYRight1data, ["steps"]);
      this.XYlength = XYLeftdata.length;
      this.chart = chart.createChordDiagramChart("chartdiv", data, "#333");
      this.XYLeftchart = chart.createXYChart("XYLeftchartdiv", XYLeftdata);
      this.XYRightchart = chart.createXYChart("XYRightchartdiv", XYRightdata);
      this.XYLeft1chart = chart.createXYChart("XYLeft1chartdiv", XYLeft1data);
      // this.XYRight1chart = chart.createXYChart(
      //   "XYRight1chartdiv",
      //   XYRight1data
      // );
    },
    getTeamData(arr, taskState) {
      let that = this;
      let state = false;
      arr.forEach((item, index) => {
        // item.finishPercent == 1
        switch (taskState) {
          case 0:
            state =
              item.todayTaskTime > this.startTaskTime &&
              item.todayTaskTime <= this.endTaskTime &&
              item.finishPercent == 1;
            break;
          case 1:
            state =
              item.taskEndDate > this.startTime &&
              item.taskEndDate <= this.endTime &&
              item.finishPercent == 0;
            break;
          case 2:
            state = item.finishPercent == 0;
            break;
          case 3:
            state = item.finishPercent == 1;
            break;
        }
        if (
          item.groupName &&
          item.groupName.indexOf("主群") == -1 &&
          item.title != "" &&
          state &&
          item.taskEndDate
        ) {
          if (!this.personObj[item.executorKey]) {
            this.personObj[item.executorKey] = [];
          }
          item = this.formatDay(item);
          this.personObj[item.executorKey].push(item);
          this.personObj[item.executorKey] = this._.sortBy(
            this.personObj[item.executorKey],
            ["taskEndDate"]
          ).reverse();
          // this.showTabObj[item.executorKey] = true;
        }
      });
      for (let key in this.personObj) {
        if (key != "position") {
          this.personGroupObj[key] = {};
          this.personObj[key].forEach((personItem, personIndex) => {
            if (!this.personGroupObj[key][personItem.groupKey]) {
              this.personGroupObj[key][personItem.groupKey] = [];
            }
            this.personGroupObj[key][personItem.groupKey].push(personItem);
          });
        }
      }
      // Object.keys()
      Object.keys(this.personObj).forEach((item, index) => {
        this.$nextTick(function () {
          this.render(index, item);
          this.personObj = this._.cloneDeep(this.personObj);
        });
      });
    },
   
    // getProjectData(groupArray, taskArray) {
    //   let arr = [];
    //   this.clearData();
    //   taskArray.forEach((item, index) => {
    //     arr[index] = { groupObj: groupArray[index] };
    //     item.forEach((groupItem, groupIndex) => {
    //       if (groupItem.finishPercent == 0 && item.title != "") {
    //         if (groupItem.labelKey) {
    //           if (!arr[index][groupItem.labelKey]) {
    //             let labelIndex = _.findIndex(groupArray[index].labelArray, {
    //               _key: groupItem.labelKey
    //             });
    //             arr[index][groupItem.labelKey] = {
    //               arr: [],
    //               labelObj: groupArray[index].labelArray[labelIndex]
    //             };
    //           }
    //           arr[index][groupItem.labelKey].arr = this.sortArr(
    //             arr[index][groupItem.labelKey].arr,
    //             groupItem
    //           );
    //         } else {
    //           if (!arr[index]["ToDo"]) {
    //             arr[index]["ToDo"] = {
    //               arr: [],
    //               labelObj: { cardLabelName: "ToDo" }
    //             };
    //           }
    //           arr[index]["ToDo"].arr = this.sortArr(
    //             arr[index]["ToDo"].arr,
    //             groupItem
    //           );
    //         }
    //       }
    //     });
    //   });
    //   this.groupProjectArray = arr;
    // },
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
    render(index, item) {
      let obj = {
        left: 0,
        top: 700,
      };
      if (this.$refs["groupData" + item]) {
        let height = this.$refs["groupData" + item][0].offsetHeight;
        let width = this.$refs["groupData" + item][0].offsetWidth;

        let ratio = width / height;
        let colIndex = index % this.colNumbers;
        obj.left = colIndex * this.colWidth;
        // //首行 top为 0，记录每列的高度
        if (index < this.colNumbers) {
          obj.top = 0;
          this.colHeight[colIndex] = this.colWidth / ratio + 5;
        } else {
          //获取高度的最小值
          let minHeight = Math.min.apply(null, this.colHeight);
          let minIndex = this.colHeight.indexOf(minHeight);
          //此图片的 top 为上面图片的高度，left 相等
          obj.top = parseInt(minHeight);
          obj.left = parseInt(minIndex * this.colWidth);
          //     //把高度加上去
          this.colHeight[minIndex] += this.colWidth / ratio + 5;
        }
        this.positionObj[item] = obj;
        // this.$set(this.positionObj, item,obj);
        // this.$set(this.personObj, item, this.personObj[item]);
      }
    },
    getColNumbers() {
      let clientWidth = this.$refs.groupData.clientWidth;
      if (clientWidth < 600) {
        this.colNumbers = 1;
      } else if (clientWidth >= 600 && clientWidth <= 900) {
        this.colNumbers = 2;
      } else if (clientWidth > 900 && clientWidth <= 1080) {
        this.colNumbers = 3;
      } else {
        this.colNumbers = 4;
      }
      this.colWidth = Math.floor(clientWidth / this.colNumbers);
    },
  },
  watch: {
    countDownTeamList: {
      async handler(newValue) {
        if (newValue.length > 0) {
          this.personObj = {};
          this.personGroupObj = {};
          this.handleChart(this.taskState);
          this.getTeamData(newValue, this.taskState);
        }
      },
      immediate: true,
      deep: true,
    },
    deviceWidth(newVal, oldVal) {
      if (newVal != oldVal) {
        this.getColNumbers();
        for (let key in this.personObj) {
          this.$nextTick(function () {
            this.render(key, "group");
          });
        }
      }
    },
    taskState(newVal, oldVal) {
      if (newVal != oldVal) {
        this.personObj = {};
        this.personGroupObj = {};
        this.handleChart(newVal);
        this.getTeamData(this.countDownTeamList, newVal);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.chart-container,
.chart-XYcontainer {
  width: 100%;
  display: flex;
  justify-content: space-between;
  position: relative;
  color: #333;
  background: rgba(255, 255, 255, 0.3);
}
.chart-container {
  height: 500px;
}
.chart {
  width: 33%;
}
.chart-div {
  width: 100%;
  height: 100%;
}
.chart-left-title,
.chart-middle-title,
.chart-right-title {
  width: 33%;
  height: 50px;
  position: absolute;
  top: 0px;
  line-height: 50px;
  text-align: center;
}
.chart-left-title {
  left: 0px;
}
.chart-middle-title {
  left: 33%;
}
.chart-right-title {
  right: 0px;
}
.choose-container {
  width: 120px;
  position: fixed;
  top: 70px;
  right: 10px;
  z-index: 10;
}
.countdown-right-item {
  width: 100%;
  position: relative;
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
.countdown-right-info {
  background: rgba(0, 0, 0, 0.12);
  color: #e4e4e4;
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

.countdown-right-person-item {
  width: 100%;
  height: 35px;
  display: flex;
  align-items: center;
  color: #fff;
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
</style>