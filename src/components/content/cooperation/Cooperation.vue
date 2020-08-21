<template>
  <div :style="{color:fontColor}" ref="cooperation" class="cooperation">
    <div
      v-if="viewState==1||viewState==2"
      class="cooperation-container"
      :style="viewState==1?{display:'flex',overflowX:'auto',height:'100%'}:null"
    >
      <div v-for="(item,index) in groupArray" :key="index">
        <div
          :ref="'cooperationgroup'+index"
          class="cooperation-container-item"
          :style="viewState==1?{
            width: '350px',
            height: '100%',
            flexShrink: '0'
          }:{
            width: colWidth+'px',
            position: 'absolute',
            top: item.position.top + 'px',
            left: item.position.left + 'px'
          }"
          v-if="item.arrlength>0"
        >
          <div class="cooperation-info" :style="viewState==1?{width: '350px'}:{width: '100%'}">
            <div class="cooperation-info-groupName" @click="toGroup(item.groupObj)">
              <div class="cooperation-info-groupLogo">
                <img :src="item.groupObj.groupLogo|defaultGroup" />
              </div>
              <div>{{item.groupObj|defaultGroupName}}</div>
            </div>
            <div :style="{overflowY: 'auto'}" class="cooperation-info-item-group-container">
              <div
                v-for="(groupItem,groupIndex) in item"
                :key="groupIndex"
                :style="{marginBottom:'2px'}"
              >
                <div v-if="groupItem.labelObj">
                  <div
                    class="cooperation-info-labelName"
                    v-if="groupIndex!='groupObj'&&groupIndex!='position'"
                  >
                    <div>{{groupItem.labelObj?groupItem.labelObj.cardLabelName:"无标题"}}</div>
                    <div>
                      <a-icon
                        type="plus"
                        class="cooperation-info-labelName-icon"
                        @click.stop="createNewTask(0,item,groupItem)"
                        v-if="item.groupObj.groupRole>0&&item.groupObj.groupRole<5&&groupType!=2"
                        :style="{marginRight:'5px'}"
                      />
                      <a-dropdown
                        v-if="item.groupObj.groupRole>0&&item.groupObj.groupRole<5&&groupType!=2"
                      >
                        <a-icon type="ellipsis" class="task-item-title-icon" />
                        <a-menu slot="overlay">
                          <a-menu-item>
                            <div
                              v-if="item.groupObj.groupRole>0&&item.groupObj.groupRole<3"
                              @click="batchTaskArray(groupItem.arr)"
                            >归档全部已完成任务</div>
                          </a-menu-item>
                          <a-menu-item>
                            <div
                              @click="chooseBatchLabel(groupItem.labelObj._key,groupItem.arr.length)"
                            >批量导入</div>
                          </a-menu-item>
                          <a-menu-item
                            v-if="groupItem.arr.length==0&&groupItem.labelObj._key!=null&&item.groupObj.groupRole>0&&item.groupObj.groupRole<3"
                          >
                            <div @click="deleteLabel(groupItem.arr,groupItem.labelObj._key)">删除栏目</div>
                          </a-menu-item>
                        </a-menu>
                      </a-dropdown>
                    </div>
                  </div>
                  <div
                    v-for="(taskItem,taskIndex) in groupItem.arr"
                    :key="taskIndex"
                    class="cooperation-info-item"
                  >
                    <!--                  -->
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
      </div>
    </div>
    <div
      v-if="viewState==0||viewState==3"
      class="cooperation-container"
      :style="viewState==0?{display:'flex',overflowX:'auto',height:'100%'}:null"
    >
      <div
        v-for="(item,index) in labelArray"
        :key="index"
        :ref="'cooperationlabel'+index"
        class="cooperation-container-item"
        :style="viewState==0?{
            width: '350px',
            height: '100%',
            flexShrink: '0'
          }:{
            width: colWidth+'px',
            position: 'absolute',
            top: item.position.top + 'px',
            left: item.position.left + 'px'
          }"
      >
        <div class="cooperation-info" :style="viewState==0?{width: '350px'}:{width: '100%'}">
          <div class="cooperation-info-labelInfo">
            <div class="cooperation-info-labelName">
              <div class="cooperation-info-labelName-groupLogo" @click="toGroup(item.groupObj)">
                <div>
                  <img :src="item.groupObj.groupLogo|defaultGroup" />
                </div>
                {{item.groupObj|defaultGroupName}}/{{item.labelObj?item.labelObj.cardLabelName:"无标题"}}
              </div>
              <a-icon
                type="plus"
                class="cooperation-info-labelName-icon"
                @click.stop="createNewTask(1,item)"
                v-if="item.groupObj.groupRole>0&&item.groupObj.groupRole<5&&groupType!=2"
                :style="{marginRight:'5px'}"
              />
              <a-dropdown v-if="item.groupObj.groupRole>0&&item.groupObj.groupRole<4&&groupType!=2">
                <a-icon type="ellipsis" class="task-item-title-icon" />
                <a-menu slot="overlay">
                  <a-menu-item>
                    <div @click="batchTaskArray(item.arr)">归档全部已完成任务</div>
                  </a-menu-item>
                  <a-menu-item>
                    <div
                      @click="chooseBatchLabel(item.labelObj._key,item.groupObj._key,item.arr.length)"
                    >批量导入</div>
                  </a-menu-item>
                  <a-menu-item v-if="item.arr.length==0&&item.labelObj._key!=null">
                    <div @click="deleteLabel(item.arr,item.labelObj._key)">删除栏目</div>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </div>
            <div :style="{overflowY: 'auto'}" class="cooperation-info-item-label-container">
              <div
                v-for="(taskItem,taskIndex) in item.arr"
                :key="taskIndex"
                class="cooperation-info-item"
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
    <div
      v-if="this.groupType!=2&&this.groupRole>0&&this.groupRole<4"
      class="cooperation-container-item"
      :style="{
            width: '350px',
            position: 'fixed',
            bottom: '2px',
            right:  '0px'
          }"
    >
      <div class="cooperation-info" :style="{width: '100%'}">
        <a-input
          v-if="inputVisible"
          ref="input"
          type="text"
          :style="{ width: '100%',height:'35px'}"
          :value="inputValue"
          @change="handleInputChange"
          @blur="handleInputConfirm"
          placeholder="输入标签名"
        />
        <div
          v-else
          class="cooperation-info-labelName"
          @click="inputVisible = true"
          :style="{background:'#fff',color:'#333'}"
        >
          <a-icon type="plus" />新建标签
        </div>
      </div>
    </div>
    <a-modal
      title="批量导入"
      :visible="batchCardState"
      @ok="batchTaskCard"
      @cancel="cancelBatchCard"
      :maskClosable="false"
      :destroyOnClose="true"
    >
      <!-- <a-textarea :rows="15" :value="batchTitle" @change="changeBatchTitle" /> -->
      <!-- <textarea rows="10" cols="30" @paste="test"></textarea> -->
      <pre contenteditable="true" ref="batchContainer" class="batch-container"></pre>
    </a-modal>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import format from "../../common/format";
import TaskItem from "../task/TaskItem";
import { Modal } from "ant-design-vue";
export default {
  name: "Cooperation",
  props: ["viewState", "taskObj"],
  components: { TaskItem },
  inject: ["getFontColor"],
  data() {
    return {
      labelArray: [],
      groupArray: [],
      colWidth: 0,
      colNumbers: 4,
      colHeight: [],
      inputVisible: false,
      inputValue: "",
      newLabel: {},
      batchCardState: false,
      batchTitle: "",
      batchLabelKey: null,
      batchGroupKey: null,
      batchCardIndex: null,
      urlList: [],
      newList: [],
    };
  },
  computed: mapState({
    user: (state) => state.auth.user,
    targetUInfo: (state) => state.auth.targetUInfo,
    ideaTitle: (state) => state.common.ideaTitle,
    deviceWidth: (state) => state.common.deviceWidth,
    allGroupArray: (state) => state.task.allGroupArray,
    allTaskArray: (state) => state.task.allTaskArray,
    groupType: (state) => state.group.groupType,
    groupRole: (state) => state.group.groupRole,
    groupKey: (state) => state.group.groupKey,
    taskType: (state) => state.task.taskType,
    finishPercentArray: (state) => state.task.finishPercentArray,
    fontColor() {
      return this.getFontColor();
    },
  }),
  mounted() {
    let that = this;
    this.getColNumbers();
  },
  methods: {
    ...mapActions("task", [
      "allGroupTask",
      "createTaskLabel",
      "batchCardArray",
      "batchCard",
      "deleteCardLabel",
      "setTaskType",
    ]),
    ...mapActions("card", [
      "createCard",
      "changeCardShowState",
      "changeCardDetailType",
      "setCardDetail",
      "setCardKey",
    ]),
    ...mapActions("group", [
      "setGroupKey",
      "setGroupType",
      "setCardMemberList",
    ]),
    ...mapActions("task", ["setLabelKey"]),
    ...mapActions("common", [
      "changeDeviceState",
      "changeDeviceWidth",
      "setIdeaTitle",
    ]),

    getData(groupArray, taskArray, taskType, taskObj) {
      let labelArr = [];
      if (groupArray.length > 0 && taskArray.length > 0) {
        groupArray.forEach((item, index) => {
          labelArr[index] = item.labelArray.map((labelItem) => labelItem._key);
        });
        groupArray.forEach((item, index) => {
          this.labelArray[index] = {};
          taskArray[index].forEach((taskItem, taskIndex) => {
            if (taskItem.taskEndDate) {
              if (labelArr[index].indexOf(taskItem.labelKey) != -1) {
                if (!this.labelArray[index][taskItem.labelKey]) {
                  this.labelArray[index][taskItem.labelKey] = {
                    arr: [],
                    groupObj: item,
                    labelObj:
                      item.labelArray[
                        labelArr[index].indexOf(taskItem.labelKey)
                      ],
                    position: [],
                  };
                }
                this.labelArray[index][taskItem.labelKey].arr = this.sortArr(
                  this.labelArray[index][taskItem.labelKey].arr,
                  taskItem,
                  taskType
                );
              } else {
                if (!this.labelArray[index]["ToDo" + index]) {
                  this.labelArray[index]["ToDo" + index] = {
                    arr: [],
                    groupObj: item,
                    labelObj: {
                      groupKey: item._key,
                      cardLabelName: "ToDo",
                    },
                    position: [],
                  };
                }
                this.labelArray[index]["ToDo" + index].arr = this.sortArr(
                  this.labelArray[index]["ToDo" + index].arr,
                  taskItem,
                  taskType
                );
              }
            }
          });
        });
        let arr = [];
        groupArray[0].labelArray.forEach((item, index) => {
          if (Object.keys(this.labelArray[0]).indexOf(item._key) == -1) {
            this.labelArray[0][item._key] = {
              arr: [],
              groupObj: groupArray[0],
              labelObj: item,
              position: [],
            };
          }
        });
        this.labelArray = this.labelArray.map((item, index) => {
          for (let key in item) {
            item[key].arr = format
              .formatFilter(item[key].arr, taskObj)
              .filter((arrItem, arrIndex) => {
                return arrItem.show;
              });
            item[key].arrlength = item[key].arr.length;
          }
          return Object.values(item);
        });
        this.labelArray = _.sortBy(_.flatten(this.labelArray), [
          "arrlength",
        ]).reverse();
        this.labelArray.forEach((item, index) => {
          this.$nextTick(function () {
            this.render(index, "label");
          });
        });
      }
    },
    getGroupData(groupArray, taskArray, taskType, taskObj) {
      let arr = [];
      if (groupArray.length > 0 && taskArray.length > 0) {
        taskArray.forEach((item, index) => {
          arr[index] = { groupObj: groupArray[index], position: [] };
          item.forEach((groupItem, groupIndex) => {
            if (groupItem.taskEndDate) {
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
                  groupItem,
                  taskType
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
                  groupItem,
                  taskType
                );
              }
            }
          });
        });
        groupArray[0].labelArray.forEach((item, index) => {
          if (Object.keys(arr[0]).indexOf(item._key) == -1) {
            arr[0][item._key] = {
              arr: [],
              labelObj: item,
            };
          }
        });
        this.groupArray = arr;
        this.groupArray = this.groupArray.map((item, index) => {
          item.arrlength = 0;
          for (let key in item) {
            if (key != "groupObj" && key != "position" && key != "arrlength") {
              item[key].arr = format
                .formatFilter(item[key].arr, taskObj)
                .filter((arrItem, arrIndex) => {
                  return arrItem.show;
                });
              item.arrlength = item.arrlength + item[key].arr.length;
            }
          }
          return item;
        });
        this.groupArray = _.sortBy(this.groupArray, ["arrlength"]).reverse();
        this.groupArray.forEach((item, index) => {
          this.$nextTick(function () {
            if (item.arrlength > 0) {
              this.render(index, "group");
            }
          });
        });
      }
    },
    getColNumbers() {
      let clientWidth = this.$refs.cooperation.clientWidth;
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
    render(index, name) {
      let obj = {
        left: 0,
        top: 0,
      };
      if (this.$refs["cooperation" + name + index]) {
        let height = this.$refs["cooperation" + name + index][0].offsetHeight;
        let width = this.$refs["cooperation" + name + index][0].offsetWidth;
        let ratio = width / height;
        let colIndex = index % this.colNumbers;
        obj.left = colIndex * this.colWidth;
        // //首行 top为 0，记录每列的高度
        if (index < this.colNumbers) {
          obj.top = 0;
          this.colHeight[colIndex] = this.colWidth / ratio;
        } else {
          //获取高度的最小值
          let minHeight = Math.min.apply(null, this.colHeight);
          let minIndex = this.colHeight.indexOf(minHeight);
          //此图片的 top 为上面图片的高度，left 相等
          obj.top = parseInt(minHeight);
          obj.left = parseInt(minIndex * this.colWidth);
          //     //把高度加上去
          this.colHeight[minIndex] += this.colWidth / ratio;
        }
        if (name == "group") {
          this.groupArray[index].position = obj;
        } else {
          this.labelArray[index].position = obj;
        }
      }
    },
    sortArr(arr, item, taskType) {
      arr.push(item);
      arr = this._.sortBy(arr, ["taskEndDate"]).reverse();
      arr = this._.sortBy(arr, ["finishPercent"]);
      return arr;
    },
    async createNewTask(type, item, taskItem) {
      let obj = {
        type: 2,
        title: this.ideaTitle != "" ? this.ideaTitle : "",
        content: "",
        rootType: 0,
        groupKey: item.groupObj._key,
        taskType: 1,
        executorKey: type
          ? item.labelObj.executorKey
            ? item.labelObj.executorKey
            : this.user._key
          : taskItem.labelObj.executorKey
          ? taskItem.labelObj.executorKey
          : this.user._key,
        followUKeyArray: [],
        finishPercent: 0,
        hour: 1,
        day: 1,
        date: this.$moment().date(),
        taskEndDate: new Date().getTime(),
        cardIndex: 0,
        groupRole: type
          ? item.arr.length > 0
            ? item.arr[0].groupRole
            : this.groupType == 1
            ? 1
            : 5
          : taskItem.arr.length > 0
          ? taskItem.arr[0].groupRole
          : this.groupType == 1
          ? 1
          : 5,
        labelKey: type
          ? item.labelObj && item.labelObj._key
            ? item.labelObj._key
            : null
          : taskItem.labelObj && taskItem.labelObj._key
          ? taskItem.labelObj._key
          : null,
        cardIndex: 0,
      };
      await this.createCard(obj);
      await this.allGroupTask({
        type1: this.groupType,
        targetUKey:
          this.groupType == 1 ? this.user._key : this.targetUInfo._key,
        type2: 1,
        finishPercentArray: [0, 1, 2],
        fileDay: 14
      });
      this.setIdeaTitle("");
    },
    toGroup(item) {
      if (item.groupName.indexOf("主群") == -1) {
        this.setGroupType(3);
        this.setGroupKey(item._key);
        this.changeCardShowState(false);
        this.changeCardDetailType(1);
        this.setCardKey(0);
        this.setCardDetail(null);
        this.setCardMemberList([]);
        this.setLabelKey(0);
        // document.querySelector("iframe").contentWindow.postMessage(
        //   {
        //     eventName: "go-chat",
        //     data: {
        //       username: item.groupUUID,
        //       groupName: item.groupName,
        //       type: "c",
        //       groupLogo: item.groupLogo
        //     }
        //   },
        //   "https://im.qingtime.cn"
        // );
      }
    },
    handleInputChange(e) {
      this.inputValue = e.target.value;
    },
    async handleInputConfirm() {
      this.inputVisible = false;
      if (this.inputValue != "") {
        await this.createTaskLabel({
          groupKey: this.groupKey,
          cardLabelName: this.inputValue,
        });
        this.inputVisible = false;
        this.inputValue = "";
        await this.allGroupTask({
          type1: this.groupType,
          targetUKey:
            this.groupType == 1 ? this.user._key : this.targetUInfo._key,
          type2: 1,
          finishPercentArray: [0, 1, 2],
          fileDay: 14
        });
      }
    },
    async batchTaskArray(arr) {
      let cardKeyArray = arr.map((item, index) => {
        return item._key;
      });
      await this.batchCardArray({ cardKeyArray: cardKeyArray });
      await this.allGroupTask({
        type1: this.groupType,
        targetUKey:
          this.groupType == 1 ? this.user._key : this.targetUInfo._key,
        type2: 1,
        finishPercentArray: [0, 1, 2],
        fileDay: 14
      });
    },
    chooseBatchLabel(labelKey, groupKey, index) {
      this.batchLabelKey = labelKey;
      this.batchGroupKey = groupKey;
      this.batchCardState = true;
      this.batchCardIndex = 0;
    },
    cancelBatchCard() {
      this.batchCardState = false;
      this.batchTitle = "";
      this.batchCardIndex = null;
    },
    // batchTaskCard() {
    //   let divNodeArr = this.$refs.batchContainer.querySelectorAll("div");
    //   let divArr = [];
    //   divNodeArr.forEach((item) => {
    //     divArr.push({
    //       str: item.innerText,
    //       length:
    //         item.innerText.length -
    //         item.innerText.replace(/(^\s*)|(\s*$)/g, "").length,
    //     });
    //   });
    //   console.log(divArr);
    // },
    async batchTaskCard() {
      this.urlList = [];
      let ulArr = this.$refs.batchContainer.querySelectorAll("span>ul");
      let divArr = this.$refs.batchContainer.querySelectorAll("div");
      let pArr = this.$refs.batchContainer.querySelectorAll("p");
      let indexArr = [];
      let tagArr = [];
      ulArr.forEach((item, index) => {
        this.getTextareaData(item, this.urlList);
      });
      for (
        var i = 0, len = this.$refs.batchContainer.childNodes.length;
        i < len;
        i++
      ) {
        if (this.$refs.batchContainer.childNodes[i].nodeType === 3) {
          // 通过nodeType是不是文本节点来判断
          //console.log(content.childNodes[i].nodeValue);
          this.batchTitle = this.batchTitle
            ? this.batchTitle +
              "\n" +
              this.$refs.batchContainer.childNodes[i].nodeValue
            : this.$refs.batchContainer.childNodes[i].nodeValue;
        }
      }

      // for (let i = 1; i < this.urlList.length; i++) {
      //   if (Array.isArray(this.urlList[i])) {
      //     this.urlList[i - 1] = [this.urlList[i - 1], this.urlList[i]];
      //     indexArr.push(i);
      //   }
      // }
      this.urlList = this.urlList.filter((item, index) => {
        return indexArr.indexOf(index) == -1;
      });
      this.formatList(this.urlList, "");
      let arr = [];
      this.newList.forEach((item, index) => {
        for (let i = this.newList.length - 1; i >= 0; i--) {
          if (
            this.newList[i].indexOf(item + "/") != -1 &&
            this.newList[i] != item
          ) {
            arr.push(index);
            break;
          }
        }
      });
      this.newList = this.newList.filter((item, index) => {
        return arr.indexOf(index) == -1;
      });
      // console.log(ulArr);
      divArr.forEach((item) => {
        this.batchTitle = this.batchTitle
          ? this.batchTitle + "\n" + item.innerText
          : item.innerText;
      });
      pArr.forEach((item) => {
        this.batchTitle = this.batchTitle
          ? this.batchTitle + "\n" + item.innerText
          : item.innerText;
      });
      this.batchTitle = this.batchTitle
        ? this.batchTitle + "\n" + this.newList.join("\n")
        : this.newList.join("\n");
      let obj = {
        type: 2,
        batchTitle: this.batchTitle,
        groupKey: this.batchGroupKey,
        labelKey: this.batchLabelKey,
        cardIndex: this.batchCardIndex,
        date: this.$moment().date(),
        taskEndDate: new Date().getTime(),
        day: 1,
        hour: 1,
      };
      await this.batchCard(obj);
      await this.allGroupTask({
        type1: this.groupType,
        targetUKey:
          this.groupType == 1 ? this.user._key : this.targetUInfo._key,
        type2: 1,
        finishPercentArray: [0, 1, 2],
        fileDay: 14
      });
      this.batchCardState = false;
      this.batchTitle = "";
      this.batchCardIndex = null;
    },
    deleteLabel(item, key) {
      if (item.length > 0) {
        this.$message.error("标签下有任务无法删除");
        return;
      }
      let that = this;
      Modal.confirm({
        title: "提示消息",
        content: "是否确认要删除该标签(标签下有任务无法删除)",
        okText: "确认",
        cancelText: "取消",
        async onOk() {
          that.deleteCardLabel({
            groupKey: that.groupKey,
            cardLabelKey: key,
          });
          await that.allGroupTask({
            type1: that.groupType,
            targetUKey:
              that.groupType == 1 ? that.user._key : that.targetUInfo._key,
            type2: 1,
            finishPercentArray: [0, 1, 2],
            fileDay: 14
          });
        },
      });
    },
    changeBatchTitle(e) {
      console.log(e.target.innerHTML);
      // // this.batchTitle = e.target.value;
      // const template = `<div class='child'>${txt}</div>`;
      //       let tempNode = document.createElement('div');
      //       tempNode.innerHTML = template;
      //       return tempNode.firstChild;
    },
    getTextareaData(node, arr) {
      Array.from(node.children).forEach((childrenItem, childrenIndex) => {
        if (childrenItem.nodeName == "UL") {
          arr[arr.length] = [];
          this.getTextareaData(childrenItem, arr[arr.length - 1]);
        } else if (childrenItem.nodeName == "LI") {
          arr.push(childrenItem.innerText);
        }
      });
      // for (let i = 0; i < arr.length; i++) {
      //   console.log(startTag.children);
      // var parent = startTag.children.Noide;
      // if (item[i].children.length !== 0) {
      //   var oChild = item[i].children;
      //   for (let j = 0; j < oChild.length; j++) {
      //     console.log("oChild", oChild);
      //     oChild[j]["parent"] = oChild[j]["parent"].concat(parent);
      //   }
      //   addNode(oChild);
      // }
      // }
      // return item;
    },
    formatList(arr, str = "") {
      console.log("Str", str);
      arr.forEach((item, index) => {
        if (Array.isArray(item)) {
          this.formatList(
            item,
            str ? str + "/" + arr[index - 1] : arr[index - 1]
          );
        } else {
          item = item ? item : "";
          this.newList.push(str ? str + "/" + item : item);
        }
      });
    },
  },
  watch: {
    allTaskArray: {
      handler(newValue) {
        this.groupArray = [];
        this.labelArray = [];
        if (this.allGroupArray && this.allGroupArray.length > 0) {
          if (this.viewState == 1 || this.viewState == 2) {
            this.getGroupData(
              this._.cloneDeep(this.allGroupArray),
              this._.cloneDeep(newValue),
              this.taskType,
              this._.cloneDeep(this.taskObj)
            );
          } else {
            this.getData(
              this._.cloneDeep(this.allGroupArray),
              this._.cloneDeep(newValue),
              this.taskType,
              this._.cloneDeep(this.taskObj)
            );
          }
        }
      },
      immediate: true,
      deep: true,
    },
    viewState(newVal, oldVal) {
      if (newVal != oldVal) {
        this.groupArray = [];
        this.labelArray = [];
        if (this.allGroupArray && this.allGroupArray.length > 0) {
          if (newVal == 1 || newVal == 2) {
            this.getGroupData(
              this._.cloneDeep(this.allGroupArray),
              this._.cloneDeep(this.allTaskArray),
              this.taskType,
              this._.cloneDeep(this.taskObj)
            );
          } else {
            this.getData(
              this._.cloneDeep(this.allGroupArray),
              this._.cloneDeep(this.allTaskArray),
              this.taskType,
              this._.cloneDeep(this.taskObj)
            );
          }
        }
      }
    },
    taskType(newVal, oldVal) {
      if (newVal != oldVal) {
        this.groupArray = [];
        this.labelArray = [];
        if (this.viewState == 1 || this.viewState == 2) {
          this.getGroupData(
            this._.cloneDeep(this.allGroupArray),
            this._.cloneDeep(this.allTaskArray),
            newVal,
            this._.cloneDeep(this.taskObj)
          );
        } else {
          this.getData(
            this._.cloneDeep(this.allGroupArray),
            this._.cloneDeep(this.allTaskArray),
            newVal,
            this._.cloneDeep(this.taskObj)
          );
        }
      }
    },
    taskObj: {
      handler(newVal) {
        this.groupArray = [];
        this.labelArray = [];
        if (this.viewState == 1 || this.viewState == 2) {
          this.getGroupData(
            this._.cloneDeep(this.allGroupArray),
            this._.cloneDeep(this.allTaskArray),
            newVal,
            this._.cloneDeep(newVal)
          );
        } else {
          this.getData(
            this._.cloneDeep(this.allGroupArray),
            this._.cloneDeep(this.allTaskArray),
            newVal,
            this._.cloneDeep(newVal)
          );
        }
      },
      deep: true,
    },
    deviceWidth(newVal, oldVal) {
      if (newVal != oldVal) {
        this.getColNumbers();
        if (this.viewState == 1 || this.viewState == 2) {
          this.groupArray.forEach((item, index) => {
            this.$nextTick(function () {
              if (item.arrlength > 0) {
                this.render(index, "group");
              }
            });
          });
        } else {
          this.labelArray.forEach((item, index) => {
            this.$nextTick(function () {
              this.$nextTick(function () {
                this.render(index, "label");
              });
            });
          });
        }
      }
    },
  },
};
</script>

<style lang="scss">
.cooperation {
  width: 100%;
  height: calc(100% - 90px);
  overflow: auto;
}
.cooperation-container {
  // display: flex;
  // column-count: 4;
  // column-gap: 2em;
  // width: 100%;
  // color: #fff;
  position: relative;
}
.cooperation-container-item {
}
.cooperation-info {
  height: 100%;
  // background: rgba(0, 0, 0, 0.18);
  border-radius: 4px;
  // break-inside: avoid;
  padding: 10px 10px 0px 10px;
  box-sizing: border-box;
}
.cooperation-info-groupName {
  width: 100%;
  height: 40px;
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.cooperation-info-groupLogo {
  width: 30px;
  height: 30px;
  overflow: hidden;
  border-radius: 50%;
  margin-right: 10px;
}
.cooperation-info-groupLogo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.cooperation-info-labelName {
  width: 100%;
  height: 35px;
  background: rgba(255, 255, 255, 0.14);
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  padding: 0px 10px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
}
.cooperation-info-labelName-groupLogo {
  width: 300px;
  height: 100%;
  display: flex;
  align-items: center;
}
.cooperation-info-labelName-groupLogo > div {
  width: 15px;
  height: 15px;
  overflow: hidden;
  border-radius: 50%;
  margin-right: 5px;
  display: flex;
}
.cooperation-info-labelName-groupLogo > div > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.cooperation-info-item-group-container {
  height: calc(100% - 36px);
}
.cooperation-info-item-label-container {
  height: calc(100% - 10px);
}
.cooperation-container::-webkit-scrollbar {
  width: 3px;
  height: 12px;
}
.cooperation-container::-webkit-scrollbar-thumb {
  background: #47475b;
  border-radius: 100px;
}
.cooperation-info-labelInfo {
  height: calc(100% - 28px);
}
.cooperation-item-title {
  height: 40px;
  font-size: 14px;
  /* color: #23384b; */
  text-align: center;
  position: relative;
  margin: 10px 0px;
  padding: 0px 10px;
  box-sizing: border-box;
}

// .cooperation-container::-webkit-scrollbar-thumb {
//   background: #47475b;
//   border-radius: 100px;
// }
.batch-container {
  min-height: 300px;
  border: 1px solid #eee;
  border-radius: 5px;
  padding: 10px;
  box-sizing: border-box;
}
</style>