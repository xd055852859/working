<template>
  <div class="task" @click="cancelCardInfo" :style="deviceState=='phone'?{overflow:'hidden'}:null">
    <div class="content-menu">
      <TaskNav :taskNewTitle="taskNewTitle"/>
      <!-- <a-icon
        type="calendar"
        @click="chooseTask('calendar')"
        :style="{marginRight:'10px',marginLeft:'10px'}"
      />
      <a-icon type="profile" @click="chooseTask('profile')" :style="{marginRight:'10px'}" />
      <a-icon type="line-chart" @click="chooseTask('line-chart')" :style="{marginRight:'10px'}" />-->
    </div>
    <div
      class="task-container-profile"
      v-if="task=='profile'&&taskList"
      :style="{flexWrap:deviceState=='phone'?'wrap':null}"
    >
      <div
        class="task-item-container"
        :style="deviceState=='phone'?{height:'auto',width:'100%',marginRight:'0px'}:null"
      >
        <div class="task-item-title">
          <a-dropdown v-if="groupRole>0&&groupRole<4&&groupType!=2" placement="bottomRight">
            <img
              :src="taskAllexecutorAvatar?taskAllexecutorAvatar:defaultPerson"
              alt
              class="task-item-avatar"
            />
            <a-menu slot="overlay" :style="{height:'50px',overflow:'hidden'}">
              <a-menu-item
                v-for="(item, index) in groupMemberList"
                :key="index"
                class="task-item-executor"
                @click="chooseExecutor(groupKey,item.userId,2,item.nickName,item.avatar)"
              >
                <img :src="item.avatar|defaultPerson" alt class="task-item-person" />
                <div>{{item.nickName}}</div>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
          <span :style="{height:'40px',lineHeight:'40px'}">任务池 ( {{taskAllList.length}} )</span>
          <a-icon
            type="plus"
            class="task-add-icon"
            @click.stop="createNewTask(0,0,taskAllexecutorKey)"
            v-if="groupRole>0&&groupRole<4&&groupType!=2"
          />
          <a-dropdown v-if="groupRole>0&&groupRole<4&&groupType!=2">
            <a-icon type="ellipsis" class="task-item-title-icon" />
            <a-menu slot="overlay">
              <a-menu-item>
                <div @click="batchTaskArray(taskAllList)">归档全部已完成任务</div>
              </a-menu-item>
              <a-menu-item>
                <div @click="chooseBatchLabel(null,taskAllList.length)">批量导入</div>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>
        <!-- <div class="task-item-info">
            <TaskItem v-for="(value,key) in taskInfo" :key="key" :item="value" />
        </div>-->
        <!-- handle:'.header' -->
        <vuedraggable
          class="task-item-info"
          v-model="taskAllList"
          :options="{group:'dragTask',disabled:deviceState=='phone'||editState?true:false,sort:editState?false:true,handle:'.taskItem-footer,.taskItem-finishIcon,.taskItem-title-name,.taskItem-check-icon'}"
          @end="endTask"
          :style="deviceState=='phone'?{height:'auto',maxHeight:'initial',minHeight:'initial',width:'100%'}:null"
        >
          <transition-group :id="'#'+'0'">
            <div
              class="task-item-item"
              v-for="(value,key) in taskAllList"
              :key="value._key"
              :id="value._key+'#'+value.groupKey+'#null#'+key"
              :style="{boxShadow: cardKey==value._key?'-2px 0 7px 0 rgba(0, 0, 0, 0.26)':null}"
            >
              <div
                :id="'taskAllList'+value._key"
                class="taskMark"
                :style="checkIndex==='taskAllList'+value._key?{borderLeft: '4px solid'+backgroundColor[value.taskType==10?5:value.taskType-1]}:{borderLeft: '3px solid'+backgroundColor[value.taskType==10?5:value.taskType-1]}"
              ></div>
              <TaskItem
                :cardItem="value"
                :cardTargetIndex="key"
                :cardChooseKey="chooseKey"
                :chooseTaskKey="'taskAllList'+value._key"
                :taskItemChooseKey="taskItemChooseKey"
                :executorKey="taskAllexecutorKey"
                @mouseenter.native="changeWide('taskAllList'+value._key,value._key)"
                @mouseleave.native="changeThin('taskAllList'+value._key,value._key)"
                @chooseTaskItem="chooseTaskItem"
                @changeTaskNewTitle="changeTaskNewTitle"
                @changeEditState="changeEditState"
                @createNewTask="createNewTask"
              />
            </div>
          </transition-group>
        </vuedraggable>
        <!-- <div class="addTask">
          <a-icon type="plus" :style="{color:'#8091A0',fontSize:'18px'}" />
        </div>-->
      </div>
      <div
        class="task-tag-container"
        :style="deviceState=='phone'?{width:(deviceWidth-80)+'px',marginRight:'0px',flexWrap:'wrap',  overflowY: 'initial',
  overflowX: 'initial'}:null"
      >
        <div v-for="(item,index) in taskInfo" :key="index">
          <div
            class="task-item-container"
            v-if="labelArray[index]._key"
            :style="deviceState=='phone'?{height:'auto',width:(deviceWidth-80)+'px',marginRight:'0px'}:null"
          >
            <div class="task-item-title" @mouseenter="changeLabelSet(index)">
              <a-dropdown v-if="groupRole>0&&groupRole<4&&groupType!=2">
                <img
                  :src="labelExecutorArray[index].executorAvatar?labelExecutorArray[index].executorAvatar:defaultPerson"
                  alt
                  class="task-item-avatar"
                />
                <a-menu slot="overlay">
                  <a-menu-item
                    v-for="(groupItem, groupIndex) in groupMemberList"
                    :key="groupIndex"
                    class="task-item-executor"
                    @click="chooseExecutor(labelArray[index]._key,groupItem.userId,1,groupItem.nickName,groupItem.avatar,index)"
                  >
                    <img :src="groupItem.avatar|defaultPerson" alt class="task-item-person" />
                    <div>{{groupItem.nickName}}</div>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
              <span
                v-if="!taskClickArr[index]||(groupRole>3&&groupType==2)"
                :style="{height:'40px',lineHeight:'40px'}"
                @click.stop="changeLabel(index)"
              >{{taskNameArr[index]+" ( "+(taskInfo[index].length)+" )"}}</span>
              <a-input
                v-if="taskClickArr[index]&&groupRole>0&&groupRole<4&&groupType!=2"
                placeholder="请输入标签名"
                :value="taskNameArr[index]"
                @change="(e)=>{changeLabelName(e,index)}"
                @blur="saveLabel(index,labelArray[index]._key)"
                @pressEnter="saveLabel(index,labelArray[index]._key)"
                :style="{width:'50%'}"
                @click.stop
              />
              <a-icon
                type="plus"
                class="task-add-icon"
                @click.stop="createNewTask(labelArray[index]._key,0,labelExecutorArray[index].executorKey)"
                v-if="groupRole>0&&groupRole<4&&groupType!=2"
              />
              <a-dropdown v-if="groupRole>0&&groupRole<4&&groupType!=2">
                <a-icon type="ellipsis" class="task-item-title-icon" />
                <a-menu slot="overlay">
                  <a-menu-item>
                    <div @click="batchTaskArray(taskInfo[index])">归档全部已完成任务</div>
                  </a-menu-item>
                  <a-menu-item>
                    <div
                      @click="chooseBatchLabel(labelArray[index]._key,taskInfo[index].length)"
                    >批量导入</div>
                  </a-menu-item>
                  <a-menu-item v-if="taskAllList.length==0">
                    <div @click="deleteLabel(index,labelArray[index]._key)">删除栏目</div>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </div>
            <vuedraggable
              class="task-item-info"
              v-model="taskInfo[index]"
              :options="{group:'dragTask',disabled:deviceState=='phone'||editState?true:false,sort:editState?false:true,handle:'.taskItem-footer,.taskItem-finishIcon,.taskItem-title-name,.taskItem-check-icon'}"
              :style="deviceState=='phone'?{height:'auto',maxHeight:'initial',minHeight:'initial',width:'100%'}:null"
              @change="changeTask"
              @end="endTask"
            >
              <transition-group :id="labelArray[index]._key+'#'+index">
                <div
                  class="task-item-item"
                  :id="value._key+'#'+value.groupKey+'#'+value.labelKey+'#'+index"
                  v-for="(value,key) in taskInfo[index]"
                  :key="'taskInfoItem'+key"
                  :style="cardKey==value._key?{boxShadow: '2px 3px 5px 0 rgba(0, 0, 0, 0.26)'}:null"
                >
                  <div
                    :id="'taskInfo'+value._key"
                    class="taskMark"
                    :style="checkIndex==='taskInfo'+value._key?{borderLeft: '4px solid'+backgroundColor[value.taskType==10?5:value.taskType-1]}:{borderLeft: '3px solid'+backgroundColor[value.taskType==10?5:value.taskType-1]}"
                  ></div>
                  <TaskItem
                    :cardItem="value"
                    :cardTargetIndex="key"
                    :cardChooseKey="chooseKey"
                    :chooseTaskKey="'taskInfo'+value._key"
                    :taskItemChooseKey="taskItemChooseKey"
                    :executorKey="labelExecutorArray[index].executorKey"
                    :style="checkIndex==='taskInfo'+index+key?{boxShadow:' 0 0 7px 0 rgba(0, 0, 0, 0.26)',borderLeft: '3px solid'+backgroundColor[value.taskType==10?5:value.taskType-1]}:{borderLeft: '3px solid'+backgroundColor[value.taskType==10?5:value.taskType-1]}"
                    @mouseenter.native="changeWide('taskInfo'+value._key,value._key)"
                    @mouseleave.native="changeThin('taskInfo'+value._key,value._key)"
                    @chooseTaskItem="chooseTaskItem"
                    @changeTaskNewTitle="changeTaskNewTitle"
                    @changeEditState="changeEditState"
                    @createNewTask="createNewTask"
                  />
                </div>
              </transition-group>
            </vuedraggable>
          </div>
        </div>
        <div
          class="task-item-title"
          :style="deviceState=='phone'?{width:(deviceWidth-80)+'px'}:null"
          v-if="this.groupType!=2&&this.groupRole>0&&this.groupRole<4"
        >
          <a-input
            v-if="inputVisible"
            ref="input"
            type="text"
            size="small"
            :style="{ width: '308px'}"
            :value="inputValue"
            @change="handleInputChange"
            @blur="handleInputConfirm"
          />
          <a-tag
            v-else
            @click="showInput"
            style="background: #fff; borderStyle: dashed; width: 308px,height:40px"
          >
            <a-icon type="plus" />新建标签
          </a-tag>
        </div>
      </div>
    </div>
    <div class="task-container-calendar" v-if="task=='calendar'">
      <a-calendar>
        <ul class="events" slot="dateCellRender" slot-scope="value">
          <li v-for="item in getListData(value)" :key="item.content">
            <a-badge :status="item.type" :text="item.content" />
          </li>
        </ul>
        <template slot="monthCellRender" slot-scope="value">
          <div v-if="getMonthData(value)" class="notes-month">
            <section>{{getMonthData(value)}}</section>
            <span></span>
          </div>
        </template>
      </a-calendar>
    </div>

    <div class="task-container-lineChart" id="lineChart" v-show="task=='line-chart'">
      <div id="chart_example" style="width:800px;height:500px"></div>
    </div>
    <a-modal
      title="批量导入"
      :visible="batchCardState"
      @ok="batchTaskCard"
      @cancel="cancelBatchCard"
      :maskClosable="false"
    >
      <a-textarea :rows="15" :value="batchTitle" @change="changeBatchTitle" />
    </a-modal>
  </div>
</template>

<script>
import Vue from "vue";
import { mapState, mapActions } from "vuex";
import TaskItem from "./TaskItem";
import TaskNav from "./TaskNav";
import { Modal } from "ant-design-vue";
// import mock from "../../common/mock";
import echarts from "echarts";
import vuedraggable from "vuedraggable";
import defaultPerson from "../../../assets/defaultPerson.png";
export default {
  name: "Task",
  components: { TaskItem, TaskNav, vuedraggable },
  computed: mapState({
    user: state => state.auth.user,
    taskList: state => state.task.taskList,
    taskAllListOrder: state => state.task.taskAllListOrder,
    labelArray: state => state.task.labelArray,
    taskAllObj: state => state.task.taskAllObj,
    cardArray: state => state.task.cardArray,
    cardKey: state => state.card.cardKey,
    cardDetail: state => state.card.cardDetail,
    groupType: state => state.group.groupType,
    groupKey: state => state.group.groupKey,
    groupRole: state => state.group.groupRole,
    groupMemberList: state => state.group.groupMemberList,
    targetUInfo: state => state.auth.targetUInfo,
    deviceState: state => state.common.deviceState,
    deviceWidth: state => state.common.deviceWidth,
    finishPercentArray: state => state.task.finishPercentArray
  }),
  data() {
    return {
      defaultPerson: defaultPerson,
      task: "profile",
      taskInfo: [],
      taskAllList: [],
      checkIndex: null,
      inputValue: "",
      inputVisible: false,
      moveElement: {},
      backgroundColor: [
        "#6FD29A",
        "#21ABE4",
        "#F5A623",
        "#FB8444",
        "#FF5D5B",
        "#9F33FE"
      ],
      timer: 0,
      // timer2: 0,
      lastDom: "",
      chooseKey: null,
      taskClickArr: [],
      taskMoveArr: [],
      taskNameArr: [],
      labelName: "",
      taskNewTitle: "",
      editState: false,
      taskItemChooseKey: null,
      batchCardState: false,
      batchTitle: "",
      batchLabelKey: null,
      batchCardIndex: null,
      taskAllexecutorKey: "",
      taskAllexecutorAvatar: "",
      taskAllexecutorNickName: "",
      labelExecutorArray: [],
      lastCardDetail: {},
      lastTitle: ""
    };
  },
  mounted() {
    // this.taskInfo = JSON.parse(JSON.stringify(mock.cardInfo));
    let that = this;
    this.createChart();
    //今日凌晨
    let timeStamp1 = new Date().setHours(0, 0, 0, 0);
    //明日凌晨
    let timeStamp2 = new Date().setHours(0, 0, 0, 0) + 86400000;
    this.taskInfo = [];
    // this.cardList.forEach(item => {
    //   if (item.type == 2) {
    //     this.taskInfo.push(item);
    //     if (item.taskEndDate >= timeStamp1 && item.taskEndDate < timeStamp2) {
    //       this.todayTaskInfo.push(item);
    //       // console.log("todayTaskInfo", this.todayTaskInfo);
    //     }
    //     if (
    //       item.taskEndDate >= timeStamp2 &&
    //       item.taskEndDate < timeStamp2 + 86400000
    //     ) {
    //       this.tomorrowTaskInfo.push(item);
    //       // console.log("tomorrowTaskInfo", this.tomorrowTaskInfo);
    //     }
    //   }
    // });
    //今日任务
    //明日任务
    document.addEventListener("keyup", function(e) {
      if (e && e.keyCode == 46) {
        //同时按下Alt+s
        //要做的事情
        that.deleteTargetCard();
      }
      e.stopImmediatePropagation;
    });
  },
  methods: {
    ...mapActions("card", [
      "changeCardShowState",
      "changeCardDetailType",
      "setCardType",
      "setCardContent",
      "setCardKey",
      "setCardDetail",
      "deleteCard",
      "setImpersonState",
      "editCard",
      "createCard",
      "getCardDetail"
    ]),
    ...mapActions("task", [
      "getTaskList",
      "createTaskLabel",
      "changeTaskLabel",
      "setLabelKey",
      "deleteCardLabel",
      "setCardLabel",
      "batchCard",
      "batchCardArray",
      "setLabelCardOrder",
      "chooseDefaultExecutor"
    ]),
    //批量导入
    chooseBatchLabel(labelKey, index) {
      this.batchLabelKey = labelKey;
      this.batchCardState = true;
      this.batchCardIndex = index - 1;
    },
    async batchTaskArray(arr) {
      let cardKeyArray = arr.map((item, index) => {
        return item._key;
      });
      await this.batchCardArray({ cardKeyArray: cardKeyArray });
      if (this.groupType != 3) {
        this.getTaskList({
          typeBoard1: this.groupType,
          targetUGKey: this.targetUInfo.userId,
          finishPercentArray: this.finishPercentArray
        });
      } else {
        this.getTaskList({
          typeBoard1: this.groupType,
          targetUGKey: this.groupKey,
          finishPercentArray: this.finishPercentArray
        });
      }
    },
    async batchTaskCard() {
      let obj = {
        type: 2,
        batchTitle: this.batchTitle,
        groupKey: this.groupKey,
        labelKey: this.batchLabelKey
      };
      this.groupType == 3 ? (obj.cardIndex = this.batchCardIndex) : null;
      await this.batchCard(obj);
      if (this.groupType != 3) {
        this.getTaskList({
          typeBoard1: this.groupType,
          targetUGKey: this.targetUInfo.userId,
          finishPercentArray: this.finishPercentArray
        });
      } else {
        this.getTaskList({
          typeBoard1: this.groupType,
          targetUGKey: this.groupKey,
          finishPercentArray: this.finishPercentArray
        });
      }
      this.batchCardState = false;
      this.batchTitle = "";
      this.batchCardIndex = null;
    },
    cancelBatchCard() {
      this.batchCardState = false;
      this.batchTitle = "";
      this.batchCardIndex = null;
    },
    changeBatchTitle(e) {
      this.batchTitle = e.target.value;
    },
    //修改编辑拖拽
    async changeEditState(editState, title, key) {
      this.editState = editState;
      // this.cancelCardInfo();
      this.taskNewTitle = title;
      // if (this.cardKey) {
      await this.editCard({
        title: this.taskNewTitle,
        key: key
      });
      // }
      // this.setCardKey(0);
      this.chooseKey = 0;
      this.taskNewTitle = "";
    },
    chooseTask(task) {
      this.task = task;
    },
    chooseTaskItem(key, chooseKey) {
      this.checkIndex = key;
      this.chooseKey = chooseKey;
    },
    changeTaskNewTitle(value) {
      this.taskNewTitle = value;
    },
    getListData(value) {
      let listData = [];
      let taskObj = this.handleData(this.taskInfo);
      let currentDate = value.month() + 1 + "月" + value.date() + "日";
      // console.log(taskObj);
      if (taskObj[currentDate]) {
        taskObj[currentDate].forEach(item => {
          listData.push({
            type:
              item.finishPercent == 0
                ? "error"
                : item.finishPercent == 1
                ? "warning"
                : item.finishPercent == 2
                ? "success"
                : null,
            content: item.title
          });
        });
      }
      return listData;
    },
    handleData(arr) {
      let newArr = {};
      //获取创建时间
      arr = arr.map(item => {
        item.timeKey = this.$moment(item.taskEndDate).format("MoDo");
        return item;
      });
      arr.forEach(item => {
        if (newArr[item.timeKey]) {
          newArr[item.timeKey].push(item);
        } else {
          newArr[item.timeKey] = [item];
        }
      });
      return newArr;
    },
    getMonthData(value) {
      if (value.month() === 8) {
        return 0;
      }
    },
    createChart() {
      let myChart = echarts.init(document.getElementById("chart_example"));

      let myChartOption = {
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: ["2014", "2015", "2016", "2017", "2018", "2019"],
          axisLine: {
            lineStyle: {
              color: "#B8CDD7"
            }
          }
        },
        yAxis: {
          type: "value",
          axisLine: {
            lineStyle: {
              color: "#B8CDD7"
            }
          }
        },
        series: [
          {
            data: [150, 200, 259, 360, 378, 450],
            type: "line",
            label: {
              show: "true",
              color: "#fff"
            },
            markLine: {
              // lineStyle:{
              //   color:"#203057"
              // }
            },
            areaStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgba(15,67,121,1)" // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "rgba(15,67,121,0)" // 100% 处的颜色
                  }
                ],
                global: false // 缺省为 false
              }
            },
            lineStyle: {
              color: "#50F6F8"
            },
            itemStyle: {
              borderColor: "#fff",
              borderWidth: "20px"
            }
          }
        ]
      };
      myChart.setOption(myChartOption);
    },
    createNewTask(labelKey, index, executorKey) {
      // if (this.deviceState == "phone") {
      // if (index == -1) {
      // this.setCardKey(0);
      //   index = 0;
      // }
      let obj = {
        type: 2,
        title: "",
        content: "",
        rootType: 0,
        groupKey: this.groupKey,
        taskType: 1,
        executorKey: executorKey,
        followUKeyArray: [],
        finishPercent: 0,
        hour: 0.1,
        day: 1
      };
      obj.labelKey = labelKey ? labelKey : null;
      obj.cardIndex = index;
      this.lastCardDetail = this.cardDetail;
      this.lastNewTitle =
        this.taskNewTitle == "" ? this.cardDetail.title : this.taskNewTitle;
      this.taskNewTitle = "";
      this.createCard(obj);
      // } else {
      //   this.setCardType(2);
      //   this.setCardContent("");
      //   this.setCardKey(0);
      //   this.setCardDetail({});
      //   this.setLabelKey(labelKey);
      // }
    },
    showInput() {
      this.inputVisible = true;
      // this.$nextTick(function() {
      //   this.$refs.input.focus();
      // });
    },
    handleInputChange(e) {
      this.inputValue = e.target.value;
    },
    handleInputConfirm() {
      this.inputVisible = false;
      if (this.inputValue != "") {
        this.createTaskLabel({
          groupKey: this.groupKey,
          cardLabelName: this.inputValue
        });
        this.inputVisible = false;
        this.inputValue = "";
      }
    },
    changeTask: function(e) {
      if (e.added) {
        //   let element = e.added.element
        this.moveElement = e.added.element;
      }
    },
    startTask: function(e) {
      // console.log("startTask", e);
      // console.log("startTask", e.id);
    },
    endTask: function(e) {
      // if (e.added) {
      //   let element = e.added.element

      let labelKey1Arr = e.from.id.split("#");
      let labelKey2Arr = e.to.id.split("#");
      let [labelKey1, label1Index] = [labelKey1Arr[0], labelKey1Arr[1]];
      let [labelKey2, label2Index] = [labelKey2Arr[0], labelKey2Arr[1]];
      let labelKey1Array =
        labelKey1 != ""
          ? this.taskInfo[label1Index].map(function(item) {
              return item._key;
            })
          : this.taskAllList.map(function(item) {
              return item._key;
            });
      let labelKey2Array =
        labelKey2 != ""
          ? this.taskInfo[label2Index].map(function(item) {
              return item._key;
            })
          : this.taskAllList.map(function(item) {
              return item._key;
            });
      let labelObject = {
        groupKey: this.groupKey,
        labelObject1: {
          labelKey: labelKey1 != "" ? labelKey1 : null,
          cardOrder: labelKey1Array
        }
      };
      if (labelKey1 != labelKey2) {
        labelObject.labelObject2 = {
          labelKey: labelKey2 != "" ? labelKey2 : null,
          cardOrder: labelKey2Array
        };
      }
      let cardKeyArr = e.clone.id.split("#");
      let [cardKey, groupKey] = [cardKeyArr[0], cardKeyArr[1]];
      this.changeTaskLabel({
        groupKey: groupKey,
        cardKey: cardKey,
        labelKey: labelKey2 != "" ? labelKey2 : null,
        type: this.groupType
      });
      // if (this.groupType == 3) {
      this.setLabelCardOrder(labelObject);
      // this.getTaskList({
      //   typeBoard1: this.groupType,
      //   targetUGKey: this.groupKey,
      //   finishPercentArray: "[0, 1]"
      // });
      // }
    },
    changeLabel(index) {
      this.taskClickArr.forEach((value, key) => {
        if (key == index) {
          this.$set(this.taskClickArr, index, true);
        } else {
          this.$set(this.taskClickArr, key, false);
        }
      });
    },
    changeLabelSet(index) {
      this.taskMoveArr.forEach((value, key) => {
        if (key == index) {
          this.$set(this.taskMoveArr, index, true);
        } else {
          this.$set(this.taskMoveArr, key, false);
        }
      });
    },
    saveLabel(index, key) {
      this.$set(this.taskClickArr, index, false);
      this.$set(this.taskMoveArr, index, false);
      this.setCardLabel({ labelKey: key, newLabelName: this.labelName });
    },
    changeLabelName(e, index) {
      this.labelName = e.target.value;
      this.$set(this.taskNameArr, index, e.target.value);
      // console.log(index);
    },
    setLabelName(index, state) {
      this.$set(this.taskClickArr, index, false);
      this.$set(this.taskMoveArr, index, false);
    },
    deleteLabel(index, key) {
      if (this.taskInfo[index].length > 0) {
        this.$message.error("标签下有任务无法删除");
        return;
      }
      let that = this;
      Modal.confirm({
        title: "提示消息",
        content: "是否确认要删除该标签(标签下有任务无法删除)",
        okText: "确认",
        cancelText: "取消",
        onOk() {
          that.deleteCardLabel({
            groupKey: that.groupKey,
            cardLabelKey: key
          });
        }
      });
    },
    getData(labelArray, cardArray) {
      this.taskAllList = [];
      this.taskInfo = [];
      this.taskNameArr = [];
      this.taskClickArr = [];
      this.taskMoveArr = [];
      this.labelExecutorArray = [];
      let taskAllIndex = 0;
      this.taskAllexecutorKey = this.taskAllObj.executorKey
        ? this.taskAllObj.executorKey
        : "";
      this.taskAllexecutorAvatar = this.taskAllObj.executorAvatar
        ? this.taskAllObj.executorAvatar
        : "";
      this.taskAllexecutorNickName = this.taskAllObj.executorNickName
        ? this.taskAllObj.executorNickName
        : "";
      labelArray.forEach((item, index) => {
        this.taskInfo[index] = [];
        this.taskClickArr[index] = false;
        this.taskMoveArr[index] = false;
        this.taskNameArr.push(item.cardLabelName);
        if (item._key) {
          this.labelExecutorArray.push({
            executorKey: item.executorKey,
            executorAvatar: item.executorAvatar,
            executorNickName: item.executorNickName
          });
        }
      });
      cardArray.forEach((item, index) => {
        if (item.labelKey && item.labelKey != "null" && item.labelKey != "") {
          for (let i = 0; i < labelArray.length; i++) {
            if (this.groupType != 3) {
              if (item.labelKey == labelArray[i]._key) {
                this.taskInfo[i].push(item);
              }
            } else if (labelArray[i].cardOrder) {
              if (item.labelKey == labelArray[i]._key) {
                let index = labelArray[i].cardOrder.indexOf(item._key);
                if (index == -1) {
                  // console.log("xx", labelArray[i].cardOrder);
                  // console.log("yy", this.taskInfo[i]);
                }
                this.taskInfo[i][index] = item;
              }
            } else {
              this.taskInfo[i].push(item);
            }
          }
        } else {
          if (
            this.taskAllListOrder &&
            this.taskAllListOrder.length > 0 &&
            this.groupType == 3
          ) {
            let index = this.taskAllListOrder.indexOf(item._key);
            // console.log(index, item._key);
            this.taskAllList[index] = item;
          } else {
            this.taskAllList.push(item);
          }
        }
      });
      this.taskInfo = this.taskInfo.map((item, index) => {
        let arr = [];
        if (item) {
          for (let i = 0; i < item.length; i++) {
            if (item[i]) {
              arr.push(item[i]);
            }
          }
        }
        return arr;
      });
      let newArr = [];
      this.taskAllList.forEach((item, index) => {
        if (item) {
          newArr.push(item);
        }
      });
      this.taskAllList = newArr;
    },
    changeWide(id, key) {
      clearInterval(this.timer);
      this.taskItemChooseKey = key;
      let that = this;
      let dom = document.getElementById(id);
      this.lastDom = dom;
      let num = 4;
      this.timer = setInterval(function() {
        dom.style.borderLeftWidth = num + "px";
        if (num > 8) {
          clearInterval(that.timer);
          dom.style.borderLeftWidth = num + "px";
          return;
        } else {
          num++;
        }
      }, 50);
    },
    changeThin(id) {
      clearInterval(this.timer);
      this.timer = 0;
      this.taskItemChooseKey = null;
      // this.chooseKey = 0;
      this.lastDom ? (this.lastDom.style.borderLeftWidth = 3 + "px") : null;
      // let dom = document.getElementById(id);
      // let num = 6;
      // this.timer2 = setInterval(function() {
      //   dom.style.borderLeftWidth = num + "px";
      //   if (num < 4) {
      //     clearInterval();
      //   } else {
      //     num--;
      //   }
      // }, 50);
    },

    setTaskObj() {},
    async cancelCardInfo() {
      this.setImpersonState(0);
      this.labelArray.forEach((item, index) => {
        this.$set(this.taskMoveArr, index, false);
        this.$set(this.taskClickArr, index, false);
      });
      // if (this.taskNewTitle != this.cardDetail.title) {
      //   this.editCard({
      //     type: this.cardDetail.type,
      //     title: this.taskNewTitle,
      //     content: this.cardDetail.typecontent,
      //     rootType: 0,
      //     groupKey: this.cardDetail.groupKey,
      //     finishPercent: this.cardDetail.finishPercent,
      //     isOpen: true,
      //     key: this.cardKey
      //   });
      // }
      // this.taskNewTitle = "";
      // this.chooseKey = 0;
      this.changeCardShowState(false);
      this.changeCardDetailType(1);
      this.setCardContent("");
      this.setCardKey(0);
      this.setCardDetail({});
      // this.setOnlyTitle("");
    },
    //选择默认执行者
    chooseExecutor(key, userId, type, nickName, avatar, index) {
      if (type == 2) {
        this.taskAllexecutorKey = userId;
        this.taskAllexecutorAvatar = avatar;
        this.taskAllexecutorNickName = nickName;
      } else if (type == 1) {
        this.labelExecutorArray[index] = {
          executorKey: userId,
          executorAvatar: avatar,
          executorNickName: nickName
        };
      }
      this.chooseDefaultExecutor({
        param: {
          labelOrGroupKey: key,
          executorKey: userId,
          type: type
        },
        item: {
          labelOrGroupKey: key,
          executorKey: userId,
          executorAvatar: avatar,
          executorNickName: nickName,
          type: type
        }
      });
    }
  },
  watch: {
    user: {
      handler: function(newVal, oldVal) {
        // 获取到用户信息
        if (newVal != oldVal && oldVal == null) {
          if (this.groupType != 3) {
            this.getTaskList({
              typeBoard1: this.groupType,
              targetUGKey: this.targetUInfo.userId,
              finishPercentArray: this.finishPercentArray
            });
          } else {
            this.getTaskList({
              typeBoard1: this.groupType,
              targetUGKey: this.groupKey,
              finishPercentArray: this.finishPercentArray
            });
          }
        }
      },
      // deep: true,
      immediate: true
    },
    groupKey: {
      handler(newVal, oldVal) {
        if (oldVal !== newVal && newVal) {
          this.taskAllexecutorKey = "";
          this.taskAllexecutorAvatar = "";
          this.taskAllexecutorNickName = "";
          this.taskInfo = [];
          if (this.groupType == 3 && this.user) {
            this.getTaskList({
              typeBoard1: this.groupType,
              targetUGKey: newVal,
              finishPercentArray: this.finishPercentArray
            });
          } else {
            this.getTaskList({
              typeBoard1: this.groupType,
              targetUGKey: this.targetUInfo.userId,
              finishPercentArray: this.finishPercentArray
            });
          }
        }
      },
      immediate: true
    },
    targetUInfo: {
      handler(newVal, oldVal) {
        this.taskAllexecutorKey = "";
        this.taskAllexecutorAvatar = "";
        this.taskAllexecutorNickName = "";
        this.taskInfo = [];
        if (this.groupType != 3 && this.user) {
          this.getTaskList({
            typeBoard1: this.groupType,
            targetUGKey: newVal.userId,
            finishPercentArray: this.finishPercentArray
          });
        }
        // }
      },
      immediate: true,
      deep: true
    },
    cardArray: {
      handler(newVal, oldVal) {
        this.getData(this.labelArray, newVal);
      },
      immediate: true,
      deep: true
    },
    labelArray: {
      handler(newVal, oldVal) {
        this.getData(newVal, this.cardArray);
      },
      immediate: true,
      deep: true
    },
    async cardKey(newVal, oldVal) {
      if (oldVal != newVal && oldVal && newVal) {
        if (JSON.stringify(this.lastCardDetail) != "{}") {
          await this.editCard({
            title: this.lastNewTitle,
            // groupKey: this.lastCardDetail.groupKey,
            key: oldVal
          });
        }
        this.taskNewTitle = "";
        this.lastNewTitle = "";
        this.lastCardDetail = {};
        this.getCardDetail({ cardKey: newVal });
      }
    }
  }
};
</script>

<style scoped>
.task {
  width: 100%;
  height: 100%;
}
.content-menu {
  display: flex;
  align-items: center;
  padding: 8px 2.5%;
}
.task-container-profile,
.task-container-calendar,
.task-container-lineChart {
  width: 100%;
  height: calc(100% - 76px);
  padding: 0px 2.5%;
  overflow: auto;
  display: flex;
}
.task-item-item {
  /* height:46px; */
  position: relative;
}
.taskMark {
  height: 100%;
  width: 7px;
  position: absolute;
  top: 0px;
  left: 0px;
}
.task-tag-container {
  width: calc(100% - 330px);
  height: 100%;

  overflow-x: scroll;
  overflow-y: hidden;
  overflow-y: hidden;
  flex-wrap: nowrap;
  display: flex;
}
.task-tag-container::-webkit-scrollbar {
  width: 3px;
  height: 8px;
}
.task-tag-container::-webkit-scrollbar-thumb {
  background: #47475b;
  border-radius: 100px;
}
.task-tag-container > div {
  display: inline-block;
}
.task-container-calendar,
.task-container-lineChart {
  overflow: auto;
}
.task-container-lineChart {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #0e204a;
}
.addTask {
  width: 350px;
  height: 38px;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
}
.task-item-container {
  width: 350px;
  height: 100%;
  margin-right: 10px;
  white-space: nowrap;
}
.task-item-executor {
  display: flex;
  align-items: center;
}
.task-item-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 15px;
}
.task-item-person {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 15px;
}
.task-container-profile .task-item-title {
  height: 40px;
  font-size: 14px;
  color: #23384b;
  text-align: center;
  position: relative;
  margin: 10px 0px 6px 0px;
}

.task-container-profile .task-add-icon,
.task-container-profile .task-item-title-icon {
  font-size: 18px;
  position: absolute;
  top: 9px;
  right: 7px;
}
.task-container-profile .task-add-icon {
  right: 35px;
}
.task-container-profile .task-item-info {
  max-height: calc(100% - 60px);
  /* min-height: 80px; */
  width: 350px;
  overflow: auto;
}
.task-container-profile .task-item-info span {
  /* min-height: 80px; */
  width: 100%;
  display: inline-block;
}
.events {
  list-style: none;
  margin: 0;
  padding: 0;
}
.events .ant-badge-status {
  overflow: hidden;
  white-space: nowrap;
  width: 100%;
  text-overflow: ellipsis;
  font-size: 12px;
}
.notes-month {
  text-align: center;
  font-size: 28px;
}
.notes-month section {
  font-size: 28px;
}
#lineChart {
  padding: 0px;
  box-sizing: border-box;
}

.borderWide {
  animation: borderWide 500ms;
  animation-fill-mode: forwards;
}
.borderThin {
  animation: borderThin 500ms;
  animation-fill-mode: forwards;
}
</style>