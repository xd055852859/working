<template>
  <div
    class="taskItem"
    :style="cardItem.finishPercent>0?{background:'rgba(146,147,149,0.2)',opacity:'0.7'}:''"
    @click.stop="deviceState!='phone'?checkCard(cardItem._key,cardItem.groupKey):null"
    :id="'task'+cardItem._key"
  >
    <!-- <div class="taskItem-img">
      <img :src="cardItem.executorAvatar?cardItem.executorAvatar:cardItem.creatorAvatar" />
    </div>-->
    <a-icon
      :component="taskArr[cardItem.finishPercent]"
      class="taskItem-finishIcon"
      @click="changeFinishPercent(cardItem.finishPercent)"
    />
    <div class="taskItem-container">
      <div class="taskItem-info">
        <div class="taskItem-title">
          <div
            v-show="cardKey!=cardItem._key||(groupRole==0||groupRole>3)"
            :style="cardItem.finishPercent==2?{textDecoration:'line-through'}:null"
            class="taskItem-title-name"
          >{{ onlyTitle}}</div>
          <a-textarea
            placeholder="请输入标题"
            :value="onlyTitle"
            v-show="cardKey==cardItem._key&&(groupRole>0&&groupRole<4)"
            @change="changeTitle"
            :autosize="{ minRows: 1}"
            @blur.stop.native="changeEdit(false)"
            @keyup.stop.native="changeTab"
            @pressEnter="createTask"
            @keyup.46.stop.native="deleteTargetCard"
            @mousedown.stop
            @mousemove.stop
            @mouseup.stop
            :id="'textareaid'+cardItem._key"
            :ref="'cardItem'+cardKey"
            :style="cardItem.finishPercent==2?{marginTop:'2px',textDecoration:'line-through'}:{marginTop:'2px'}"
          />
          <!-- @change="onlyChangeTitle"
          v-if="cardDetail._key==cardItem._key && changeTitleState"-->
        </div>
        <!--  -->
        <div class="taskItem-check-icon" v-if="taskItemChooseKey==cardItem._key">
          <a-icon type="ellipsis" @click="editState = true" :style="{fontSize:'18px'}" />
        </div>
      </div>
      <div class="taskItem-footer">
        <div class="taskItem-footer-left">
          <div
            class="taskItem-day"
            v-if="cardItem.day&&cardItem.hour"
            :style="cardItem.taskEndDate&&(cardItem.taskEndDate<new Date().getTime())&&cardItem.finishPercent==0?{backgroundColor:'#DD3535'}:null"
          >
            {{cardItem.day}}
            <div class="taskItem-time"></div>
            <div class="taskItem-time-title">{{cardItem.hour}}</div>
          </div>
          <!-- groupType!=3&&cardItem.groupKey!=mainGroupKey? -->
          <div class="taskItem-name" @click.stop="toCardGroup">
            <span>{{ groupType!=3&&cardItem.groupKey!=mainGroupKey?cardItem.groupName.length>8?cardItem.groupName.substring(0,8)+"...":cardItem.groupName:"" }}</span>
            <span>{{cardItem.serialNumber?"#"+cardItem.serialNumber:''}}</span>
            <span>{{cardItem.creatorName.length>3?cardItem.creatorName.substring(0,3)+"...":cardItem.creatorName}}</span>
            <span>></span>
            <span>{{cardItem.executorName&&cardItem.executorName.length>3?cardItem.executorName.substring(0,3)+"...":cardItem.executorName}}</span>
          </div>
        </div>
        <div
          :style="{color:color[cardItem.taskType==10?5:cardItem.taskType-1],fontSize:'10px',backgroundColor:backgroundColor[cardItem.taskType==10?5:cardItem.taskType-1],padding:'3px 6px',boxSizing:'border-box',borderRadius:'3px'}"
        >{{msgItem[cardItem.taskType==10?5:cardItem.taskType-1]}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
// import task1 from "../../common/svg/task1.svg";
import { Modal } from "ant-design-vue";
import task2 from "../../common/svg/task2.svg";
import task4 from "../../common/svg/task4.svg";
import task6 from "../../common/svg/task6.svg";
export default {
  name: "TaskItem",
  props: [
    "cardItem",
    "cardTargetIndex",
    "chooseTaskItem",
    "chooseTaskKey",
    "taskItemChooseKey",
    "cardChooseKey",
    "changeTaskNewTitle",
    "changeEditState",
    "executorKey"
  ],
  computed: {
    ...mapState({
      user: state => state.auth.user,
      cardKey: state => state.card.cardKey,
      cardList: state => state.card.cardList,
      groupRole: state => state.group.groupRole,
      groupKey: state => state.group.groupKey,
      groupType: state => state.group.groupType,
      taskList: state => state.task.taskList,
      cardDetail: state => state.card.cardDetail,
      cardMemberList: state => state.group.cardMemberList,
      deviceState: state => state.common.deviceState,
      cardShowState: state => state.card.cardShowState,
      finishPercentArray: state => state.task.finishPercentArray
    })
    // cardArray() {
    //   return this.taskList.cardArray;
    // }
  },
  data() {
    return {
      color: ["#6FD29A", "#21ABE4", "#F5A623", "#FB8444", "#FF5D5B", "#9F33FE"],
      backgroundColor: [
        "#DAF6E6",
        "#D8ECFF",
        "#FBE6C4",
        "#FFDDCC",
        "#FFE3DE",
        "#F3E5FF"
      ],
      msgItem: [
        "建议功能",
        "强烈建议",
        "错误",
        "严重错误",
        "致命错误",
        "顶级优先"
      ],
      taskArr: [task2, task6, task6],
      taskItem: {},
      taskIndex: 0,
      onlyTitle: "",
      editState: false,
      mainGroupKey: localStorage.getItem("mainGroupKey")
    };
  },
  mounted() {
    // this.taskItem = this.cardItem;
    // this.taskIndex = this.cardTargetIndex;
    this.onlyTitle = this.cardItem.title;
  },
  methods: {
    ...mapActions("card", [
      "setCardIndex",
      "editCard",
      "changeCardShowState",
      "changeCardDetailType",
      "setCardDetail",
      "setCardKey",
      "deleteCard"
    ]),
    ...mapActions("auth", ["getTargetUserInfo"]),
    ...mapActions("group", [
      "setGroupKey",
      "setGroupType",
      "setCardMemberList",
      "getCardMember"
    ]),
    ...mapActions("common", ["changeHeaderIndex"]),
    ...mapActions("task", ["setLabelKey", "getTaskList"]),
    chooseCard(key) {},
    changeEdit(editState) {
      let that = this;
      setTimeout(function() {
        that.$emit(
          "changeEditState",
          editState,
          that.onlyTitle,
          that.cardItem._key
        );
      }, 250);
    },
    changeTab(e) {
      if (e.keyCode == 13 && e.shiftKey) {
        this.onlyTitle = this.onlyTitle + "\n";
        document.getElementById("textareaid" + this.cardItem._key).value =
          this.onlyTitle + "\n";
        e.preventDefault(); // 阻止浏览器默认换行操作
        return false;
      }
    },
    async createTask(e) {
      if (!e.shiftKey) {
        this.$emit(
          "createNewTask",
          this.cardItem.labelKey,
          this.cardTargetIndex + 1,
          this.executorKey
        );
      }
      e.preventDefault(); // 阻止浏览器默认换行操作
      return false;
    },
    checkCard(key, groupKey) {
      this.setCardKey(key);
      this.setLabelKey(this.cardItem.labelKey);
      this.getCardMember({
        groupId: groupKey
      });
      this.$emit("chooseTaskItem", this.chooseTaskKey, this.cardItem._key);
      // this.changeCardShowState(false);
      this.changeCardDetailType(2);
      this.$nextTick(function() {
        //console.log("!!!!!!!!!!!!!",document.getElementById("textareaid" + this.cardItem._key))
        if (document.getElementById("textareaid" + this.cardItem._key)) {
          document.getElementById("textareaid" + this.cardItem._key).focus();
        }
      });
    },

    changeFinishPercent(finishPercent) {
      finishPercent = finishPercent == 1 ? 0 : 1;
      this.editCard({
        key: this.cardItem._key,
        taskType: this.cardItem.taskType,
        finishPercent: finishPercent
      });
    },
    changeTitle(e) {
      this.onlyTitle = e.target.value;
      this.$emit("changeTaskNewTitle", e.target.value);
    },
    toCardGroup() {
      if (this.cardItem.groupName.indexOf("的主群") != -1) {
        if (this.cardItem.creatorKey === this.user._key) {
          this.setGroupType(1);
        } else {
          this.setGroupType(2);
        }
        this.getTargetUserInfo({ key: this.cardItem.creatorKey });
      } else {
        this.setGroupType(3);
      }
      this.setGroupKey(this.cardItem.groupKey);
      this.changeCardShowState(false);
      this.changeCardDetailType(1);
      this.changeHeaderIndex(0);
      this.setCardKey(0);
      this.setCardDetail({});
      this.setCardMemberList([]);
      this.setLabelKey(0);
    },
    deleteTargetCard() {
      let that = this;
      // this.setCardIndex(index);
      console.log("删除起效了");
      Modal.confirm({
        title: "提示消息",
        content: "是否确认要删除该卡片",
        okText: "确认",
        cancelText: "取消",
        async onOk() {
          await that.deleteCard({
            cardKey: that.cardKey,
            groupKey: that.cardDetail.groupKey
          });
          that.changeCardShowState(false);
          that.changeCardDetailType(1);
          // that.setCardKey(0);
        }
      });
    }
  },
  watch: {
    cardMemberList: {
      handler(newVal, oldVal) {
        if (oldVal != newVal && newVal.length > 0) {
          //他人界面里共同群@他的
          //卡片的群key判断权限
          if (this.editState) {
            if (this.groupType != 2) {
              if (this.groupRole > 0 && this.groupRole < 4) {
                this.changeCardShowState(true);
                this.changeCardDetailType(2);
              } else {
                this.changeCardShowState(true);
                this.changeCardDetailType(1);
              }
            } else {
              newVal.forEach(item => {
                if (item.userId == localStorage.getItem("userKey")) {
                  if (item.role > 0 && item.role < 4) {
                    this.changeCardShowState(true);
                    this.changeCardDetailType(2);
                  } else {
                    this.changeCardShowState(true);
                    this.changeCardDetailType(1);
                  }
                }
              });
            }
          }
        }
      },
      immediate: true,
      deep: true
    },
    cardDetail: {
      handler(newVal, oldVal) {
        // if (oldVal !== newVal) {
        //   if (newVal.followUserList && this.headerIndex != 3) {
        //     newVal.followUserList.forEach(item => {
        //       if (item._key == localStorage.getItem("userKey")) {
        //         this.changeCardShow({
        //           cardShowState: true,
        //           cardDetailType: 2
        //         });
        //       }
        //     });
        //   }
        // }
        // if (newVal._key == this.cardItem._key) {
        //   this.cardItem = newVal;
        // }
      },
      immediate: true,
      deep: true
    },
    cardShowState(newVal, oldVal) {
      if (oldVal != newVal && oldVal) {
        this.editState = false;
      }
    },
    cardItem: {
      handler(newVal, oldVal) {
        this.onlyTitle = newVal.title;
        // console.log("cardKey", newVal);
      },
      immediate: true,
      deep: true
    },
    cardKey(newVal, oldVal) {
      if (newVal != oldVal && newVal) {
        // if (newVal == this.cardItem._key) {
        this.$nextTick(function() {
          //console.log("??????",document.getElementById("textareaid" + newVal))
          if (document.getElementById("textareaid" + newVal)) {
            document.getElementById("textareaid" + newVal).focus();
          }
        });
        // }
      }
    }
  }
};
</script>

<style scoped>
.taskItem {
  width: calc(100% - 3px);
  min-height: 40px;
  padding: 6px 2.5px 4px 5px;
  /* box-sizing: border-box; */
  margin-bottom: 6px;
  background-color: #fff;
  display: flex;
  /* align-items: center; */
}
.taskItem-img {
  width: 18px;
  height: 18px;
  overflow: hidden;
  border-radius: 50%;
  margin-top: 6px;
  margin-right: 5px;
}
.taskItem-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  margin-top: -5px;
}
.taskItem-container {
  height: 100%;
  width: calc(100% - 35px);
  display: flex;
  flex-wrap: wrap;
  align-content: space-between;
  justify-content: center;
}
.taskItem-finishIcon {
  font-size: 18px;
  color: #555;
  padding: 6px 8px 0px 0px;
  box-sizing: border-box;
}
.taskItem:hover {
  box-shadow: 2px 3px 5px 0 rgba(0, 0, 0, 0.26);
}
.taskItem-info {
  width: 100%;
  /* height: 30px; */
  font-size: 14px;
  line-height: 20px;
  color: #23384b;
  display: flex;
}
.taskItem-day {
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
.taskItem-time {
  width: 0;
  height: 0;
  border-width: 18px;
  border-style: solid;
  border-color: #35a6f8 transparent transparent transparent;
  position: absolute;
  top: -2px;
  right: -20px;
  z-index: 2;
}
.taskItem-time-title {
  width: 10px;
  height: 10px;
  line-height: 10px;
  font-size: 8px;
  color: #fff;
  position: absolute;
  top: 0px;
  right: 0px;
  z-index: 3;
  transform: scale(0.7);
}
.taskItem-title {
  width: calc(100% - 23px);
  min-height: 28px;
  display: block;
  white-space: normal;
  box-sizing: border-box;
  font-size: 12px;
  margin-right: 8px;
}
.taskItem-title div {
  padding: 3px 0px 0px 5px;
  box-sizing: border-box;
  word-wrap: break-word;
}
.taskItem-title .ant-input {
  font-size: 12px !important;
  line-height: 20px !important;
  padding: 0px 5px !important;
  box-sizing: border-box;
}
.taskItem-footer {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.taskItem-footer-left {
  display: flex;
  align-items: center;
}
.taskItem-name {
  cursor: pointer;
  font-size: 12px;
  color: #8091a0;
  display: flex;
  align-items: center;
}
.taskItem-name span {
  margin-left: 5px;
}
.taskItem-type {
  font-size: 12px;
  border-radius: 4px;
  padding: 5px;
}
.taskItem-check-icon {
  /* position: absolute;
  top: 0px;
  right: 10px;
  bottom: 0px; */
  width: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>