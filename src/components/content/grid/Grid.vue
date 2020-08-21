<template>
  <div class="grid" :style="{color:fontColor}">
    <div class="grid-group-date" :style="{height:'35px'}">
      <div class="grid-date-label-title">任务数量统计</div>
      <div class="grid-date-label">
        <div
          v-for="(dateItem,dateIndex) in taskNavDate"
          :style="{border:'0px'}"
          :key="dateIndex"
          class="grid-label-td"
        >
          <!-- <a-badge
            :count="taskNavDay[dateIndex].allTaskNum"
            :overflow-count="99"
            v-if="gridState"
            :numberStyle="{zIndex:'2'}"
          >-->
          <div
            :style="{background:taskNavDay[dateIndex].allTaskNum>8&&groupType==1?'#E94848':taskNavDay[dateIndex].allTaskNum!=0?'#16AE7A':'#B6B6B6',borderRadius:'50%',width:'25px',height:'25px',textAlign:'center',lineHeight:'25px'}"
          >{{taskNavDay[dateIndex].allTaskNum>0?taskNavDay[dateIndex].allTaskNum.toFixed(1):''}}</div>
          <!-- </a-badge> -->
        </div>
      </div>
    </div>
    <div class="grid-group-date">
      <div class="grid-date-label-title">{{gridState?"任务时间":"执行人"}}</div>
      <div class="grid-date-label">
        <div
          v-for="(dateItem,dateIndex) in taskNavDate"
          :key="dateIndex"
          :class="'grid-label-bottomTd'"
          :style="{background:gridState?taskNavWeek[dateIndex]>4&&gridState?'#BABABA':'#505050':null,paddingRight:'-1px',boxSizing:'border-box'}"
        >
          <!-- <a-badge
            :count="taskNavDay[dateIndex].allTaskNum"
            :overflow-count="99"
            v-if="gridState"
            :numberStyle="{zIndex:'2'}"
          >-->
          <div v-if="gridState">{{dateItem}}</div>
          <!-- </a-badge> -->
          <div
            class="grid-label-td-avatar"
            v-if="!gridState"
            :style="{height:'35px',borderRight:dateIndex!=(taskNavDate.length-1)?'1px solid transparent':'0px'}"
          >
            <a-tooltip>
              <template slot="title">{{dateItem.nickName}}</template>
              <img :src="dateItem|defaultPerson" alt />
            </a-tooltip>
          </div>
        </div>
      </div>
    </div>
    <div class="grid-container">
      <div v-for="(item,index) in groupArray" :key="index">
        <div class="grid-group-container" v-if="item.arrlength>0">
          <!--             v-if="computedGroupIndex(index,groupArray)>1" -->
          <div
            class="line-img-group"
            v-if="groupType!=3"
            :style="computedGroupIndex(index,groupArray)?{borderLeft: '0px'}:null"
          ></div>
          <div class="grid-title" v-if="groupType!=3">
            <div class="grid-title-subtitle" :style="{color:'#000',paddingLeft:'30px'}">
              <div class="grid-grouptitle">
                <div class="point-group"></div>
                {{item.groupObj|defaultGroupName}}
              </div>
            </div>
            <div class="grid-label-tr">
              <div
                v-for="(dateItem,dateIndex) in taskNavDate"
                :key="dateIndex"
                class="grid-label-td"
                :style="{border:'1px solid #fff'}"
                :ref="'task'+dateIndex"
              ></div>
            </div>
            <div class="line-img-label-top"></div>
          </div>

          <div v-for="(groupItem,groupIndex) in item" :key="groupIndex" class="grid-group-item">
            <div v-if="groupItem.labelObj&&groupItem.show&&groupItem.arr.length>0">
              <div
                class="line-img-label"
                :style="computedLabelIndex(groupIndex,item)?{borderLeft: '0px'}:null"
              ></div>
              <div class="grid-title">
                <div
                  class="grid-title-subtitle"
                  :style="{paddingLeft:'60px' ,justifyContent:'space-between',color:fontColor}"
                >
                  <div class="grid-grouptitle" :style="{border:'0px',color:'#000'}">
                    <div class="point-label"></div>
                    {{groupItem.labelObj.cardLabelName}}
                  </div>
                  <!-- <a-icon
                    :type="groupItem.tabShow?'down':'up'"
                    :style="{fontSize:'18px'}"
                    @click="showTask(index,groupIndex,!groupItem.tabShow)"
                  />-->
                </div>
                <div class="grid-label-tr">
                  <div
                    v-for="(dateItem,dateIndex) in taskNavDate"
                    :key="dateIndex"
                    :style="{border:'1px solid #fff'}"
                    class="grid-label-td"
                  ></div>
                </div>
              </div>
              <div
                v-for="(taskItem,taskIndex) in groupItem.arr"
                :key="taskIndex"
                class="grid-title-task chooseTr"
              >
                <!--  v-if="taskItem.show" -->
                <div v-if="taskItem">
                  <GridTree
                    :taskItem="taskItem"
                    v-on="$listeners"
                    v-bind="$attrs"
                    :left="45"
                    :lineLeft="58"
                    :gridState="gridState"
                    :taskNavDate="taskNavDate"
                    :taskNavDay="taskNavDay"
                    @playTreeAudio="playTreeAudio"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <audio ref="treeAudio" :src="treeAudio" muted>您的浏览器不支持 audio 标签。</audio>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import format from "../../common/format";
import GridTree from "../../common/GridTree";
import treeAudio from "@/assets/change.mp3";
import lineImg from "@/assets/line.png";
export default {
  name: "Grid",
  components: { GridTree },
  data() {
    return {
      groupArray: [],
      taskNavDate: [],
      taskNavDay: [],
      taskNavWeek: [],
      gridState: true,
      lineImg,
      moveIndex: null,
      taskWidth: 0,
      avatarHeight: 0,
      treeAudio: treeAudio,
    };
  },
  props: ["viewState"],
  mounted() {},
  inject: ["getFontColor"],
  computed: mapState({
    user: (state) => state.auth.user,
    targetUInfo: (state) => state.auth.targetUInfo,
    ideaTitle: (state) => state.common.ideaTitle,
    deviceWidth: (state) => state.common.deviceWidth,
    allTaskArray: (state) => state.task.allTaskArray,
    allGridGroupArray: (state) => state.task.allGridGroupArray,
    allGridTaskArray: (state) => state.task.allGridTaskArray,
    allGridChildArray: (state) => state.task.allGridChildArray,
    labelArray: (state) => state.task.labelArray,
    cardArray: (state) => state.task.cardArray,
    groupType: (state) => state.group.groupType,
    groupRole: (state) => state.group.groupRole,
    groupKey: (state) => state.group.groupKey,
    groupInfo: (state) => state.group.groupInfo,
    groupMemberList: (state) => state.group.groupMemberList,
    computedLabelIndex(groupIndex, item) {
      return (groupIndex, item) => {
        let arr = Object.keys(item).filter((newItem, newIndex) => {
          if (
            newItem != "arrlength" &&
            newItem != "tabShow" &&
            newItem != "groupObj"
          ) {
            return newItem;
          }
        });
        return groupIndex == arr[arr.length - 1];
      };
    },
    computedGroupIndex(index, item) {
      return (index, item) => {
        let arr = [];
        item.forEach((newItem, newIndex) => {
          if (newItem.arrlength > 0) {
            arr.push(newIndex);
          }
        });
        return index == arr[arr.length - 1];
      };
    },
    fontColor() {
      return this.getFontColor();
    },
    // computedGroupIndex(item)
  }),
  methods: {
    ...mapActions("card", ["editCard"]),
    ...mapActions("group", ["addGroupMember"]),
    ...mapActions("task", ["allGridGroupTask"]),
    formatDate() {
      this.taskNavDate = [];
      this.taskNavDay = [];
      for (let i = 0; i < 20; i += 1) {
        let taskDate = this.$moment().add(i, "days");
        this.taskNavDate.push(taskDate.date());
        this.taskNavDay.push({
          startTime: taskDate.startOf("day").valueOf(),
          endTime: taskDate.endOf("day").valueOf(),
          allTaskNum: 0,
        });
        this.taskNavWeek.push(this.$moment().add(i, "days").weekday());
      }
    },
    formatPerson() {
      this.taskNavDate = [];
      this.taskNavDay = [];
      let groupMemberList = this._.cloneDeep(this.groupMemberList);
      // groupMemberList = _.sortBy(groupMemberList, ['user']);
      groupMemberList.forEach((item, index) => {
        // if (index < 20) {
          this.taskNavDate.push(item);
          this.taskNavDay.push({
            userId: item.userId,
            allTaskNum: 0,
          });
        // }
      });
      this.$nextTick(() => {
        this.avatarHeight = document.querySelectorAll(
          ".grid-label-td"
        )[0].clientWidth;
      });
    },
    getGroupData(groupArray, taskArray) {
      let arr = [];
      if (groupArray.length > 0 && taskArray.length > 0) {
        taskArray.forEach((item, index) => {
          arr[index] = {
            groupObj: groupArray[index],
            tabShow: true,
          };
          item.forEach((groupItem, groupIndex) => {
            if (groupItem.labelKey) {
              if (!arr[index][groupItem.labelKey]) {
                let labelIndex = this._.findIndex(
                  groupArray[index].labelArray,
                  {
                    _key: groupItem.labelKey,
                  }
                );
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
          });
        });
        if (this.groupType == 1) {
          groupArray[0].labelArray.forEach((item, index) => {
            if (Object.keys(arr[0]).indexOf(item._key) == -1) {
              arr[0][item._key] = {
                arr: [],
                labelObj: item,
              };
            }
          });
        }
        this.groupArray = arr;
        this.groupArray = this.groupArray.map((item, index) => {
          item.arrlength = 0;
          for (let key in item) {
            if (
              key != "groupObj" &&
              key != "tabShow" &&
              key != "arrlength" &&
              key != "show"
            ) {
              item[key].tabShow = true;
              item[key].show = true;
              item[key].arr.forEach((arrItem, arrIndex) => {
                arrItem.dayArr = [];
                this.taskNavDay = this.taskNavDay.map((dayItem, dayIndex) => {
                  let state = this.gridState
                    ? arrItem.taskEndDate >= dayItem.startTime &&
                      arrItem.taskEndDate < dayItem.endTime
                    : dayItem.userId == arrItem.executorKey;
                  if (state) {
                    arrItem.dayArr.push(arrItem.hour);
                    dayItem.allTaskNum = dayItem.allTaskNum + arrItem.hour;
                  } else {
                    arrItem.dayArr.push("");
                  }
                  return dayItem;
                });
                if (arrItem.children && arrItem.children.length > 0) {
                  arrItem.children.forEach((childItem, childIndex) => {
                    this.recurrenceData(arrItem.children, childIndex, index);
                  });
                }
              });

              // arrItem.dayArr = [];
              // this.taskNavDay = this.taskNavDay.map((dayItem, dayIndex) => {
              //   let state = this.gridState
              //     ? arrItem.taskEndDate >= dayItem.startTime &&
              //       arrItem.taskEndDate < dayItem.endTime
              //     : dayItem.userId == arrItem.executorKey;
              //   if (state) {
              //     arrItem.dayArr.push(arrItem.hour);
              //     dayItem.allTaskNum = dayItem.allTaskNum + arrItem.hour;
              //   } else {
              //     arrItem.dayArr.push("");
              //   }
              //   return dayItem;
              // });
              // });
              item.arrlength = item.arrlength + item[key].arr.length;
            }
          }
          return item;
        });
        this.groupArray = _.sortBy(this.groupArray, ["arrlength"]).reverse();
        // this.groupArray.splice(0, 1, this.groupArray[0]);
      }
    },
    sortArr(arr, item) {
      let time = 0;
      item.show = true;
      if (item.taskEndDate) {
        time = Math.floor(
          (this.$moment(item.taskEndDate).endOf("day").valueOf() -
            this.$moment(new Date().getTime()).endOf("day").valueOf()) /
            86400000
        );
      }
      item.endtime = {
        time: time < 0 ? Math.abs(time) : Math.abs(time) + 1,
        endState: time < 0 ? false : true,
      };
      arr.push(item);
      // arr = this._.sortBy(arr, ["taskEndDate"]).reverse();
      arr = this._.sortBy(arr, ["finishPercent"]);
      return arr;
    },
    recurrenceData(arr, arrIndex, groupIndex, taskItem) {
      let key = arr[arrIndex];
      let allGridChildArray = this._.cloneDeep(this.allGridChildArray);
      arr[arrIndex] = allGridChildArray[groupIndex][key];
      arr[arrIndex].dayArr = [];
      this.taskNavDay = this.taskNavDay.map((dayItem, dayIndex) => {
        let state = this.gridState
          ? arr[arrIndex].taskEndDate >= dayItem.startTime &&
            arr[arrIndex].taskEndDate < dayItem.endTime
          : dayItem.userId == arr[arrIndex].executorKey;
        if (state) {
          arr[arrIndex].dayArr.push(arr[arrIndex].hour);
          dayItem.allTaskNum = dayItem.allTaskNum + arr[arrIndex].hour;
        } else {
          arr[arrIndex].dayArr.push("");
        }
        return dayItem;
      });
      if (arr[arrIndex].children && arr[arrIndex].children.length > 0) {
        arr[arrIndex].children.forEach((childItem, childIndex) => {
          this.recurrenceData(
            arr[arrIndex].children,
            childIndex,
            groupIndex,
            taskItem
          );
        });
      }
    },
    showLabel(index, type) {
      this.groupArray[index].tabShow = type;
      for (let key in this.groupArray[index]) {
        if (
          key != "groupObj" &&
          key != "tabShow" &&
          key != "arrlength" &&
          key != "show"
        ) {
          this.groupArray[index][key].show = type;
        }
      }
      this.groupArray.splice(0, 1, this.groupArray[0]);
    },
    showTask(index, groupIndex, type) {
      this.groupArray[index][groupIndex].tabShow = type;
      this.groupArray[index][groupIndex].arr.forEach((taskItem, taskIndex) => {
        taskItem.show = type;
      });
      this.groupArray.splice(0, 1, this.groupArray[0]);
      // this.$set(this.groupArray[index], "tabShow");
    },
    chooseTaskTime(index, groupIndex, taskIndex, dateIndex) {
      this.groupArray[index][groupIndex].arr[taskIndex].taskEndDate =
        this.groupArray[index][groupIndex].arr[taskIndex].taskEndDate +
        (this.taskNavDay[dateIndex].startTime -
          this.$moment(
            this.groupArray[index][groupIndex].arr[taskIndex].taskEndDate
          )
            .startOf("day")
            .valueOf());
      this.editCard({
        key: this.groupArray[index][groupIndex].arr[taskIndex]._key,
        taskEndDate: this.groupArray[index][groupIndex].arr[taskIndex]
          .taskEndDate,
      });
    },
    async chooseTaskPerson(index, groupIndex, taskIndex, dateIndex) {
      await this.addGroupMember({
        param: {
          groupKey: this.groupArray[index].groupObj._key,
          targetUidList: [
            {
              userKey: this.taskNavDate[dateIndex].userId,
              nickName: this.taskNavDate[dateIndex].nickName,
              avatar: this.taskNavDate[dateIndex].avatar,
              gender: this.taskNavDate[dateIndex].gender,
              role: this.groupArray[index].groupObj.defaultPower,
            },
          ],
        },
        item: this.taskNavDate[dateIndex],
        type: "member",
      });
      await this.editCard({
        key: this.groupArray[index][groupIndex].arr[taskIndex]._key,
        executorKey: this.taskNavDay[dateIndex].userId,
      });
    },
    changeGridState(viewState) {
      if (
        (viewState == 4 && (this.groupType == 1 || this.groupType == 2)) ||
        (viewState == 2 && this.groupType == 3)
      ) {
        this.gridState = true;
      } else if (
        (viewState == 5 && (this.groupType == 1 || this.groupType == 2)) ||
        (viewState == 3 && this.groupType == 3)
      ) {
        this.gridState = false;
      }
    },
    formatData(newTaskArray, newGroupArray) {
      // this.groupArray = [];
      this.gridState ? this.formatDate() : this.formatPerson();
      // if (this.groupType == 1 || this.groupType == 2) {
      this.getGroupData(newGroupArray, newTaskArray);
      // } else if (this.groupType == 3) {
      //   let groupInfo = this._.cloneDeep(this.groupInfo);
      //   groupInfo.labelArray = this.labelArray;
      //   groupInfo._key = this.groupKey;
      //   let groupArray = [groupInfo];
      //   let taskArray = [this._.cloneDeep(newTaskArray)];
      //   this.getGroupData(
      //     groupArray,
      //     taskArray,
      //     this.groupRole > 0 && this.groupRole < 4 ? 6 : 2
      //   );
      // }
    },
    playTreeAudio() {
      console.log("????????", this.$refs.treeAudio);
      this.$refs.treeAudio.play();
    },
  },
  watch: {
    viewState: {
      async handler(newValue, oldValue) {
        if (newValue) {
          this.changeGridState(this.viewState);
          if (this.groupType != 3 || !oldValue) {
            let obj = {
              type1: this.groupType,
              finishPercentArray: [0],
            };
            this.groupType == 3
              ? (obj.groupKey = this.groupKey)
              : (obj.type2 = this.gridState ? 3 : 4);
            this.groupType == 2
              ? (obj.targetUKey = this.targetUInfo._key)
              : null;
            await this.allGridGroupTask(obj);
          }
          this.formatData(
            this._.cloneDeep(this.allGridTaskArray),
            this._.cloneDeep(this.allGridGroupArray)
          );
        }
      },
      immediate: true,
    },
    allGridTaskArray: {
      async handler(newValue) {
        this.groupArray = [];
        this.changeGridState(this.viewState);
        // let obj = {
        //   type1: this.groupType,
        //   type2: this.gridState ? 3 : 4,
        //   finishPercentArray: [0]
        // };
        // this.groupType == 2 ? (obj.targetUKey = this.targetUInfo._key) : null;
        // await this.allGridGroupTask(obj);
        this.formatData(
          this._.cloneDeep(newValue),
          this._.cloneDeep(this.allGridGroupArray)
        );
      },
      immediate: true,
      deep: true,
    },
    allGridChildArray: {
      async handler(newValue) {
        this.groupArray = [];
        this.changeGridState(this.viewState);
        // let obj = {
        //   type1: this.groupType,
        //   type2: this.gridState ? 3 : 4,
        //   finishPercentArray: [0]
        // };
        // this.groupType == 2 ? (obj.targetUKey = this.targetUInfo._key) : null;
        // await this.allGridGroupTask(obj);
        this.formatData(
          this._.cloneDeep(this.allGridTaskArray),
          this._.cloneDeep(this.allGridGroupArray)
        );
      },
      deep: true,
    },
    // cardArray: {
    //   async handler(newValue) {
    //     if (newValue && this.groupType == 3) {
    //       this.changeGridState(this.viewState);
    //       // let obj = {
    //       //   type1: this.groupType,
    //       //   finishPercentArray: [0],
    //       //   groupKey: this.groupKey
    //       // };
    //       // await this.allGridGroupTask(obj);
    //       this.formatData(
    //         this._.cloneDeep(this.allGridTaskArray),
    //         this._.cloneDeep(this.allGridGroupArray)
    //       );
    //     }
    //   },
    //   immediate: true,
    //   deep: true
    // }
  },
};
</script>

<style lang="scss" scoped>
.grid {
  // color: #fff;
  height: calc(100% - 90px);
  width: 100%;
  // background-color: #fff;
  color: #333;
}
.grid-container {
  height: 100%;
  width: 100%;
  overflow: auto;
}
.grid-group-container {
  position: relative;
}
.grid-group-item {
  position: relative;
  z-index: 1;
}
.grid-label-item {
  padding-bottom: 10px;
  box-sizing: border-box;
  display: flex;
  min-height: 30px;
}
.grid-title {
  display: flex;
  justify-content: space-between;
  min-height: 40px;
  position: relative;
}
.grid-label-title {
  padding-right: 5px 10px;
  box-sizing: border-box;
}
.grid-title-task {
  width: 100%;
  box-sizing: border-box;
}
.grid-title-subtitle {
  width: 40%;
  box-sizing: border-box;
  display: flex;
  align-items: flex-start;
  margin-bottom: 5px;
  position: relative;
  z-index: 2;
  padding-right: 10px;
  // justify-content: space-between;
}

.grid-label-tr {
  width: 60%;
  display: flex;
  // justify-content: flex-end;
}
// .grid-title-subtask {
//   width: calc(50% + 30px);
// }
.grid-label-td,
.grid-label-topTd,
.grid-label-bottomTd {
  width: 5%;
  margin-right: -1px;
  margin-bottom: -1px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-sizing: border-box;
}
.grid-label-td {
  border: 1px solid #ededed;
}
.grid-label-topTd {
  overflow: hidden;
  border: 1px solid transparent;
}
.grid-label-bottomTd {
  overflow: hidden;
  border: 1px solid transparent;
}
.grid-group-date {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

// .chooseTr {
//   margin-left: 20px;
// }
.chooseTr:hover {
  background: rgba(0, 0, 0, 0.3);
}
.taskItem-day {
  width: 20px;
  height: 20px;
  line-height: 20px;
  padding: 3px 0px 0px 6px;
  // color: #fff;
  background-color: #535353;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  margin-right: 5px;
  font-size: 12px;
}
.taskItem-time {
  width: 0;
  height: 0;
  border-width: 20px;
  border-style: solid;
  border-color: #35a6f8 transparent transparent transparent;
  position: absolute;
  top: -2px;
  right: -20px;
}
.taskItem-time-hour {
  width: 10px;
  height: 10px;
  line-height: 10px;
  font-size: 8px;
  // color: #fff;
  position: absolute;
  top: 0px;
  z-index: 1;
  transform: scale(0.7);
}
.taskItem-time-day {
  width: 10px;
  height: 10px;
  line-height: 10px;
  font-size: 10px;
  // color: #fff;
  position: absolute;
  bottom: 0px;
  z-index: 3;
}
.grid-label-td-avatar {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.grid-label-td-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.grid::-webkit-scrollbar {
  width: 3px;
  height: 5px;
}
.line-img-group {
  width: 20px;
  height: calc(100% + 1px);
  border-left: 1px solid #d7d7d7;
  border-top: 1px solid #d7d7d7;
  position: absolute;
  top: 13px;
  left: 10px;
  z-index: 0;
  // border-top-left-radius: 5px;
}
.line-img-label {
  width: 25px;
  height: calc(100% + 1px);
  border-left: 1px solid #d7d7d7;
  border-top: 1px solid #d7d7d7;
  position: absolute;
  top: 15px;
  left: 40px;
  z-index: 0;
  // border-top-left-radius: 5px;
}
.line-img-label-top {
  width: 1px;
  height: 43px;
  border-left: 1px solid #d7d7d7;
  border-top: 1px solid #d7d7d7;
  position: absolute;
  top: 12px;
  left: 10px;
  z-index: 0;
  border-top-left-radius: 5px;
}
.line-img-task {
  width: 35px;
  height: calc(100% + 2px);
  border-left: 1px solid #d7d7d7;
  border-bottom: 1px solid #d7d7d7;
  position: absolute;
  top: -30px;
  left: -35px;
  z-index: 0;
  border-bottom-left-radius: 5px;
}
.point-group,
.point-label {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #666;
  position: absolute;
  top: 9px;
  left: -5px;
}
.point-label {
  left: -10px;
}
.grid-grouptitle {
  height: 28px;
  line-height: 28px;
  border-radius: 4px;
  background: #fff;
  border: 1px solid rgba(217, 217, 217, 1);
  display: flex;
  position: relative;
  z-index: 5;
  padding: 0px 15px;
  box-sizing: border-box;
}
.grid-date-label {
  width: 60%;
  display: flex;
  // justify-content: flex-end;
  margin-right: 1px;
}
// .grid-date-label2 {
//   width: 722px;
//   margin-right: 2px;
//   display: flex;
// }
.grid-date-label-title {
  height: 100%;
  display: flex;
  align-items: center;
  margin-right: 10px;
}
</style>