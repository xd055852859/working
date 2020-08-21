<template>
  <div class="task" :style="deviceState=='phone'||deviceState=='mobile'?{overflow:'hidden'}:null">
    <div
      class="task-container-profile"
      :style="{flexWrap:deviceState=='phone'||deviceState=='mobile'?'wrap':null}"
    >
      <div
        class="task-tag-container"
        :style="deviceState=='phone'||deviceState=='mobile'?{width:(deviceWidth-80)+'px',marginRight:'0px',flexWrap:'wrap',  overflowY: 'initial',
  overflowX: 'initial'}:null"
      >
        <div v-for="(item,index) in taskInfo" :key="index" :id="labelArray[index]._key+'*'+index">
          <!-- :class="[index==0?'task-todo-container':'task-item-container']" -->
          <!-- :style="deviceState=='phone'||deviceState=='mobile'?{height:'auto',width:(deviceWidth-80)+'px',marginRight:'0px'}:{
              display:index==0&&!showToDo?'none':null
          }"-->
          <div
            class="task-item-container"
            :style="deviceState=='phone'||deviceState=='mobile'?{height:'auto',width:(deviceWidth-80)+'px',marginRight:'0px'}:null"
          >
            <!-- <a-icon
              v-if="index==0&&showToDo"
              type="close"
              class="task-todo-close"
              @click="changeShowTodo"
            />-->
            <div
              :class="labelArray[index]._key?'task-item-title':'task-item-deftitle'"
              class="task-item-title"
              @mouseenter="changeLabelSet(index)"
            >
              <!--  :class="labelArray[index]._key?'task-item-title':'task-item-deftitle'" -->
              <a-dropdown v-if="groupRole>0&&groupRole<4&&groupType!=2">
                <img
                  :src="labelExecutorArray[index].executorAvatar?labelExecutorArray[index].executorAvatar:defaultPerson"
                  alt
                  class="task-item-avatar"
                />
                <a-menu slot="overlay">
                  <a-menu-item
                    class="task-item-executor"
                    @click="chooseExecutor(null,0,labelArray[index]._key)"
                  >
                    <img :src="defaultPerson" alt class="task-item-person" />
                    <div>无默认执行人</div>
                  </a-menu-item>
                  <a-menu-item
                    v-for="(groupItem, groupIndex) in groupMemberList"
                    :key="groupIndex"
                    class="task-item-executor"
                    @click="chooseExecutor(groupItem,index,labelArray[index]._key)"
                  >
                    <img :src="groupItem|defaultPerson" alt class="task-item-person" />
                    <div>{{groupItem.nickName}}</div>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
              <span
                v-if="!taskClickArr[index]||(groupRole>3&&groupType==2)"
                :style="{height:'40px',lineHeight:'40px'}"
                @click.stop="labelArray[index]._key?changeLabel(index):null"
              >{{taskNameArr[index]}} ( {{taskInfo[index]|taskTypeLength}} )</span>
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
                v-if="groupRole>0&&groupRole<5&&groupType!=2"
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
                  <a-menu-item
                    v-if="!eyeState&&taskInfo[index].length==0&&labelArray[index]._key!=null"
                  >
                    <div @click="deleteLabel(index,labelArray[index]._key)">删除栏目</div>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </div>
            <vuedraggable
              class="task-item-info"
              v-model="taskInfo[index]"
              :scroll-sensitivity="150"
              :force-fallback="true"
              :options="{group:'dragTask',disabled:groupType==2||eyeState?true:false,handle:'.taskItem-footer',scroll:true}"
              :style="deviceState=='phone'||deviceState=='mobile'?{height:'auto',maxHeight:'initial',minHeight:'initial',width:'100%'}:null"
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
                  <TaskItem
                    v-if="value&&value.show"
                    :cardItem="value"
                    :executorKey="labelExecutorArray[index].executorKey"
                    v-on="$listeners"
                    v-bind="$attrs"
                    :viewState="1"
                  />
                  <!--
                    @mouseenter.native="changeWide('taskInfo'+value._key,value._key)"
                    @mouseleave.native="changeThin('taskInfo'+value._key,value._key)"
                    
                  -->
                </div>
              </transition-group>
            </vuedraggable>
          </div>
          <!-- </div> -->
        </div>
        <div
          class="task-item-title"
          :style="deviceState=='phone'||deviceState=='mobile'?{width:(deviceWidth-80)+'px'}:null"
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
        <!-- </vuedraggable> -->
      </div>
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
// import TaskNav from "./TaskNav";
import { Modal } from "ant-design-vue";
import TreeGraph from "tree-graph-vue";
// import mock from "../../common/mock";
import vuedraggable from "vuedraggable";
import defaultPerson from "../../../assets/defaultPerson.png";
import format from "../../common/format";
Vue.use(TreeGraph);
export default {
  name: "Task",
  components: { TaskItem, vuedraggable, TreeGraph },
  props: ["createTask", "showToDo", "taskObj"],
  computed: mapState({
    user: state => state.auth.user,
    taskList: state => state.task.taskList,
    labelArray: state => state.task.labelArray,
    cardArray: state => state.task.cardArray,
    cardKey: state => state.card.cardKey,
    cardDetail: state => state.card.cardDetail,
    cardShowState: state => state.card.cardShowState,
    groupType: state => state.group.groupType,
    groupKey: state => state.group.groupKey,
    groupRole: state => state.group.groupRole,
    groupMemberList: state => state.group.groupMemberList,
    targetUInfo: state => state.auth.targetUInfo,
    deviceState: state => state.common.deviceState,
    deviceWidth: state => state.common.deviceWidth,
    finishPercentArray: state => state.task.finishPercentArray,
    linkState: state => state.card.linkState,
    eyeState: state => state.task.eyeState,
    taskType: state => state.task.taskType
  }),
  data() {
    return {
      defaultPerson: defaultPerson,
      taskInfo: [],
      inputValue: "",
      inputVisible: false,
      taskClickArr: [],
      taskMoveArr: [],
      taskNameArr: [],
      labelName: "",
      taskItemChooseKey: null,
      batchCardState: false,
      batchTitle: "",
      batchLabelKey: null,
      batchCardIndex: null,
      taskAllexecutorKey: "",
      taskAllexecutorAvatar: "",
      taskAllexecutorNickName: "",
      labelExecutorArray: [],
      lastTitle: "",
      treeGraphState: false,
      showTaskTabArr: [],
      mainGroupKey: localStorage.getItem("mainGroupKey")
    };
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
      "chooseDefaultExecutor",
      "setGroupLabelOrder",
      "setCardArray"
    ]),
    changeShowTodo() {
      this.$emit("update:showToDo", false);
    },
    //批量导入
    chooseBatchLabel(labelKey, index) {
      this.batchLabelKey = labelKey;
      this.batchCardState = true;
      this.batchCardIndex = -1;
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
          finishPercentArray: this.finishPercentArray,
          fileDay: 14,
        });
      } else {
        this.getTaskList({
          typeBoard1: this.groupType,
          targetUGKey: this.groupKey,
          finishPercentArray: this.finishPercentArray,
          fileDay: 14,
        });
      }
    },
    async batchTaskCard() {
      let obj = {
        type: 2,
        batchTitle: this.batchTitle,
        groupKey: this.groupKey,
        labelKey: this.batchLabelKey,
        cardIndex: this.batchCardIndex,
        date: this.$moment().date(),
        taskEndDate: new Date().getTime(),
        day: 1,
        hour: 1
      };
      await this.batchCard(obj);
      if (this.groupType == 2) {
        this.getTaskList({
          typeBoard1: this.groupType,
          targetUGKey: this.targetUInfo.userId,
          finishPercentArray: this.finishPercentArray,
          fileDay: 14,
        });
      } else {
        this.getTaskList({
          typeBoard1: 3,
          targetUGKey: this.groupKey,
          finishPercentArray: this.finishPercentArray,
          fileDay: 14,
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
    async endTask(e) {
      // if (e.added) {
      //   let element = e.added.element
      let labelKey1Arr = e.from.id.split("#");
      let labelKey2Arr = e.to.id.split("#");
      let [labelKey1, label1Index] = [labelKey1Arr[0], labelKey1Arr[1]];
      let [labelKey2, label2Index] = [labelKey2Arr[0], labelKey2Arr[1]];
      // if (this.groupType == 1 && labelKey2 == "null") {
      //   this.$message.error("不能拖动任务至主群任务池");
      //   this.getTaskList({
      //     typeBoard1: this.groupType,
      //     targetUGKey: this.targetUInfo.userId,
      //     finishPercentArray: this.finishPercentArray
      //   });
      //   return;
      // }
      let labelKey1Array = this.taskInfo[label1Index].map(function(item) {
        return item._key;
      });
      let labelKey2Array = this.taskInfo[label2Index].map(function(item) {
        return item._key;
      });
      let labelObject = {
        groupKey: this.groupKey,
        labelObject1: {
          labelKey: labelKey1 != "null" ? labelKey1 : null,
          cardOrder: labelKey1Array
        }
      };
      if (this.groupType == 1 && labelKey1 == "null") {
        labelObject = {
          groupKey: this.groupKey,
          labelObject1: {
            labelKey: labelKey2 != "null" ? labelKey2 : null,
            cardOrder: labelKey2Array
          }
        };
      } else if (labelKey1 != labelKey2) {
        labelObject.labelObject2 = {
          labelKey: labelKey2 != "null" ? labelKey2 : null,
          cardOrder: labelKey2Array
        };
      }

      let cardKeyArr = e.clone.id.split("#");
      let [cardKey, groupKey] = [cardKeyArr[0], cardKeyArr[1]];
      await this.changeTaskLabel({
        groupKey: this.groupKey,
        cardKey: cardKey,
        labelKey: labelKey2 != "" && labelKey2 != "null" ? labelKey2 : null,
        type: this.groupType
      });
      // if (this.groupType == 3) {
      await this.setLabelCardOrder(labelObject);
      // this.getTaskList({
      //   typeBoard1: this.groupType,
      //   targetUGKey: this.groupKey,
      //   finishPercentArray: "[0, 1]"
      // });
      // }
    },
    endLabel(e) {
      let childNodes = [].slice.call(e.from.childNodes);
      childNodes.splice(childNodes.length - 1, 1);
      let arr = childNodes.map(item => {
        if (item.id.split("*")[0] != "null") {
          return item.id.split("*")[0];
        }
      });
      let indexArr = childNodes.map(item => {
        return item.id.split("*")[1];
      });
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

    getData(labelArray, cardArray, taskObj) {
      this.taskInfo = [];
      this.taskNameArr = [];
      this.taskClickArr = [];
      this.taskMoveArr = [];
      this.labelExecutorArray = [];
      this.showTaskTabArr = [];
      labelArray.forEach((item, index) => {
        this.taskInfo[index] = [];
        this.taskClickArr[index] = false;
        this.taskMoveArr[index] = false;
        this.taskNameArr.push(item.cardLabelName);
        // if (item._key) {
        this.labelExecutorArray.push({
          executorKey: item.executorKey,
          executorAvatar: item.executorAvatar,
          executorNickName: item.executorNickName
        });
        let newItem = item;
        this.$set(labelArray, index, newItem);
        // }
      });
      // cardArray = this._.cloneDeep(
      //   format.formatCard(
      //     this.taskType,
      //     cardArray,
      //     this.groupType != 2 ? this.user._key : this.targetUInfo.userId
      //   )
      // );
      //插入需要排序的数据
      // if (this.finishPercentArray == "[0,1,2,10]") {
      //   cardArray.forEach((item, index) => {
      //     // if (item.labelKey && item.labelKey != "null" && item.labelKey != "") {
      //     for (let i = 0; i < labelArray.length; i++) {
      //       if (item.labelKey == labelArray[i]._key) {
      //         this.taskInfo[i].push(item);
      //       }
      //     }
      //   });
      // } else
      // if (this.finishPercentArray == "[0,1,10]") {
        cardArray.forEach((item, index) => {
          if (item.finishPercent == 0) {
            for (let i = 0; i < labelArray.length; i++) {
              if (
                this.groupType == 1 &&
                labelArray[i]._key == null &&
                (item.labelKey == null || item.labelKey == "")
              ) {
                this.taskInfo[i].push(item);
              } else if (labelArray[i].cardOrder) {
                if (item.labelKey == labelArray[i]._key) {
                  let index = labelArray[i].cardOrder.indexOf(item._key);
                  this.taskInfo[i][index] = item;
                }
              }
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
        cardArray.forEach((item, index) => {
          // if (item.labelKey && item.labelKey != "null" && item.labelKey != "") {
          if (item.finishPercent == 10) {
            for (let i = 0; i < labelArray.length; i++) {
              let findIndex = this._.findIndex(this.taskInfo[i], [
                "_key",
                item._key
              ]);
              if (item.labelKey == labelArray[i]._key && findIndex == -1) {
                this.taskInfo[i].push(item);
              }
            }
          }
        });
        cardArray.forEach((item, index) => {
          // if (item.labelKey && item.labelKey != "null" && item.labelKey != "") {
          if (item.finishPercent == 1) {
            for (let i = 0; i < labelArray.length; i++) {
              let findIndex = this._.findIndex(this.taskInfo[i], [
                "_key",
                item._key
              ]);
              if (item.labelKey == labelArray[i]._key && findIndex == -1) {
                this.taskInfo[i].push(item);
              }
            }
          }
        });
        cardArray.forEach((item, index) => {
          // if (item.labelKey && item.labelKey != "null" && item.labelKey != "") {
          if (item.finishPercent == 2) {
            for (let i = 0; i < labelArray.length; i++) {
              let findIndex = this._.findIndex(this.taskInfo[i], [
                "_key",
                item._key
              ]);
              if (item.labelKey == labelArray[i]._key && findIndex == -1) {
                this.taskInfo[i].push(item);
              }
            }
          }
        });
        if (this.groupType == 1) {
          this.taskInfo.forEach((item, index) => {
            let findIndex = this._.findIndex(item, ["show", true]);
            this.showTaskTabArr.push(findIndex == -1 ? false : true);
          });
        }
        this.taskInfo = this.taskInfo.map(item => {
          return this._.cloneDeep(format.formatFilter(item, taskObj));
        });
      // }
    },

    createNewTask(labelKey, index, executorKey) {
      this.$emit("createTask", labelKey, index, executorKey);
    },
    //选择默认执行者
    chooseExecutor(groupItem, index, labelKey) {
      // if (index == 0) {

      //   this.taskAllexecutorKey = userId;
      //   this.taskAllexecutorAvatar = avatar;
      //   this.taskAllexecutorNickName = nickName;
      // } else if (type == 1) {
      let key = index == 0 ? this.groupKey : labelKey;
      let type = index == 0 ? 2 : 1;
      this.labelExecutorArray[index] = {
        executorKey: groupItem ? groupItem.userId : null,
        executorAvatar: groupItem ? groupItem.avatar : null,
        executorNickName: groupItem ? groupItem.nickName : null
      };
      // }
      this.chooseDefaultExecutor({
        param: {
          labelOrGroupKey: key,
          executorKey: groupItem ? groupItem.userId : null,
          type: type
        },
        item: {
          labelKey: labelKey,
          executorKey: groupItem ? groupItem.userId : null,
          executorAvatar: groupItem ? groupItem.avatar : null,
          executorNickName: groupItem ? groupItem.nickName : null,
          type: type
        }
      });
    },
  },
  watch: {
    cardArray: {
      handler(newVal, oldVal) {
        this.getData(
          this._.cloneDeep(this.labelArray),
          this._.cloneDeep(newVal),
          this.taskObj
        );
      },
      immediate: true,
      deep: true
    },
    labelArray: {
      handler(newVal, oldVal) {
        this.getData(
          this._.cloneDeep(newVal),
          this._.cloneDeep(this.cardArray),
          this.taskObj
        );
      },
      immediate: true,
      deep: true
    },
    // taskType(newVal, oldVal) {
    //   if (newVal != oldVal) {
    //     this.getData(
    //       this._.cloneDeep(this.labelArray),
    //       this._.cloneDeep(this.cardArray),
    //       this.taskObj
    //     );
    //   }
    // },
    taskObj: {
      handler(newVal) {
        this.getData(
          this._.cloneDeep(this.labelArray),
          this._.cloneDeep(this.cardArray),
          newVal
        );
      },
      deep: true
    }
  }
};
</script>

<style scoped>
.task {
  width: 100%;
  height: calc(100% - 90px);
}

.task-container-profile,
.task-container-calendar,
.task-container-lineChart {
  width: 100%;
  height: calc(100% - 5px);
  padding: 0px 0.5%;
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
  width: 100%;
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
  margin-right: 5px;
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
  object-fit: cover;
}
.task-item-person {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 15px;
}
.task-container-profile .task-item-title,
.task-container-profile .task-item-deftitle {
  height: 40px;
  font-size: 14px;
  /* color: #23384b; */
  text-align: center;
  position: relative;
  margin: 3px 0px 1px 0px;
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
  height: calc(100% - 45px);
  /* min-height: 80px; */
  width: 350px;
  overflow: auto;
}
.task-container-profile .task-item-info span {
  /* min-height: 80px; */
  height: calc(100% - 10px);
  width: 100%;
  display: inline-block;
}
.task-todo-container {
  height: 100%;
  width: 375px;
  position: fixed;
  right: 0px;
  top: 0px;
  overflow: auto;
  z-index: 20;
  background-color: #fff;
  color: #000;
}
.task-todo-container .task-item-info {
  height: 100%;
  /* min-height: 80px; */
  width: 350px;
  overflow: auto;
  margin-left: 20px;
}
.task-todo-close {
  position: absolute;
  left: 15px;
  top: 15px;
  font-size: 18px;
  z-index: 3;
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