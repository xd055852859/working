<template>
  <div
    class="taskItem"
    :style="{background:bottomtype?'transparent':cardItem.finishPercent==1||cardItem.finishPercent==2?'#E5E7EA':null,opacity:cardItem.finishPercent==1||cardItem.finishPercent==2?'0.95':null,color:bottomtype?fontColor:'#23384b'}"
    :id="'task'+cardItem._key"
    @mouseenter.stop="changeMoveState(cardItem._key)"
    @mouseleave.stop="changeMoveState(0)"
    @blur.stop="test"
  >
    <!-- <div class="taskItem-img">
      <img :src="cardItem.executorAvatar?cardItem.executorAvatar:cardItem.creatorAvatar" />
    </div>-->
    <a-icon
      v-if="cardItem.finishPercent!=10"
      :component="taskArr[cardItem.finishPercent]"
      class="taskItem-finishIcon"
      @click="cardItem.groupRole < 4 ||cardItem.creatorKey == user._key ||cardItem.executorKey == user._key?changeFinishPercent(cardItem.finishPercent):null"
    />

    <div class="taskItem-container">
      <div class="taskItem-info">
        <a-popover>
          <template slot="content">
            <div>{{"起始时间: "+createTimeText}}</div>
            <div>{{"截止时间: "+endTimeText}}</div>
            <div>{{"预计工时: "+cardItem.hour+" 小时"}}</div>
            <div>{{"剩余时间: "+(!endtime.endState&&cardItem.finishPercent!=3?"超期 ":"剩余 ")+endtime.time+" 天"}}</div>
          </template>
          <div
            class="taskItem-day"
            v-if="cardItem.day&&cardItem.hour&&cardItem.taskEndDate&&cardItem.finishPercent!=10"
            :style="!endtime.endState?cardItem.finishPercent==0?{backgroundColor:'red'}:{backgroundColor:'#417505'}:null"
          >
            <div
              class="taskItem-time-day"
              :style="{left:endtime.time<10? '5px':'0px'}"
            >{{dateType?cardItem.date:endtime.time}}</div>
            <div class="taskItem-time"></div>
            <div
              class="taskItem-time-hour"
              :style="{right:cardItem.hour<1? '5px':'0px'}"
            >{{cardItem.hour}}</div>
          </div>
        </a-popover>
        <div class="taskItem-img" v-if="bottomtype=='grid'" :style="{width:'25px',height:'25px'}">
          <img
            :src="cardItem.executorAvatar?cardItem.executorAvatar:defaultPerson"
            :style="{marginTop:'0px'}"
          />
        </div>
        <div class="taskItem-title">
          <div
            v-show="cardRole||cardKey!=cardItem._key"
            :style="{width:'100%',minHeight:'28px',backgroundColor:bottomtype?'transparent':cardItem.finishPercent==0||cardItem.finishPercent==10?'':'#E5E7EA',textDecoration:cardItem.finishPercent==2?'line-through':''}"
            @click.stop="deviceState!='mobile'?checkCard(cardItem._key,cardItem.groupKey):null"
          >{{ cardItem.title}}</div>
          <a-textarea
            v-if="!cardRole&&cardKey==cardItem._key"
            placeholder="请输入标题"
            v-model="cardItem.title"
            @change="changeTitle"
            :autosize="{minRows: 1}"
            @keyup.native="changeTab"
            @mousedown.stop
            @mousemove.stop
            @mouseup.stop
            @click.stop
            :id="'textareaid'+cardItem._key"
            :ref="'cardItem'+cardKey"
            :style="cardItem.finishPercent==2?{marginTop:'2px',textDecoration:'line-through',minHeight:'22px'}:{marginTop:'2px',minHeight:'22px'}"
            @pressEnter="createNewTask"
            @keyup.46.native="deleteTargetCard"
            @keydown.9.native="createChildTask"
          />
        </div>
      </div>
      <div class="taskItem-footer" v-if="!bottomtype">
        <div class="taskItem-footer-left">
          <!--  @click.stop="toCardGroup" -->
          <div class="taskItem-name" v-if="taskState">
            <!-- <span>{{ groupType!=3&&cardItem.groupKey!=mainGroupKey?cardItem.groupName.length>8?cardItem.groupName.substring(0,8)+"...":cardItem.groupName:"" }}</span>-->
            <span v-if="groupType==3">{{cardItem.serialNumber?"#"+cardItem.serialNumber:''}}</span>
            <span>{{cardItem.creatorName.length>3?cardItem.creatorName.substring(0,3)+"...":cardItem.creatorName}}</span>
            <span>
              <a-icon type="arrow-right" :style="{fontSize:'10px'}" />
            </span>
            <span>{{cardItem.executorName&&cardItem.executorName.length>3?cardItem.executorName.substring(0,3)+"...":cardItem.executorName}}</span>
          </div>
          <div class="taskItem-img" v-if="taskState">
            <img :src="cardItem.executorAvatar?cardItem.executorAvatar:defaultPerson" />
          </div>
        </div>
        <div :style="{maxWidth:'64px',display:'flex'}">
          <div
            class="taskItem-check-icon"
            v-if="cardItem.executorKey==user._key&&cardItem.finishPercent==0"
          >
            <img
              v-if="moveChooseKey==cardItem._key"
              :src="openCountDown"
              @click.stop="toCountDown(cardItem._key,cardItem.groupKey)"
              alt
            />
          </div>
          <div class="taskItem-check-icon">
            <img
              v-if="moveChooseKey==cardItem._key&&!cardItem.importantStatus"
              :src="unimportant"
              @click.stop="groupType==1||(groupType==3&&groupRole<4&&groupRole>0)?chooseTodayTask(1):null"
              alt
            />
            <img
              v-if="cardItem.importantStatus"
              :src="important"
              alt
              @click.stop="groupType==1||(groupType==3&&groupRole<4&&groupRole>0)?chooseTodayTask(0):null"
            />
          </div>
          <div
            class="taskItem-check-icon"
            v-if="moveChooseKey==cardItem._key||cardItem.content"
            :style="{color:'#333'}"
          >
            <a-icon type="ellipsis" @click.stop="showCardInfo(cardItem._key,cardItem.groupKey)" />
          </div>
        </div>
      </div>
      <div
        class="taskItem-taskType"
        :style="moveChooseKey==cardItem._key?{borderTop:'10px solid '+color[cardItem.taskType==10?5:cardItem.taskType-1],borderRight:'10px solid '+color[cardItem.taskType==10?5:cardItem.taskType-1],  borderLeft: '10px solid transparent',
  borderBottom: '10px solid transparent'}:{borderTop:'7px solid '+color[cardItem.taskType==10?5:cardItem.taskType-1],borderRight:'7px solid '+color[cardItem.taskType==10?5:cardItem.taskType-1],  borderLeft: '7px solid transparent',
  borderBottom: '7px solid transparent'}"
        v-if="!cardRole"
      ></div>
      <a-dropdown :trigger="['click']" v-if="cardRole">
        <a-menu slot="overlay">
          <a-menu-item
            v-for="(item, index) in taskTypeArr"
            :key="index"
            @click="changeMsg(item.id)"
            :style="{color:color[index],fontSize:'10px',backgroundColor:backgroundColor[index],padding:'3px 6px',boxSizing:'border-box',borderRadius:'3px'}"
          >{{item.name}}</a-menu-item>
        </a-menu>
        <div
          class="taskItem-taskType"
          :style="moveChooseKey==cardItem._key?{borderTop:'10px solid '+color[cardItem.taskType==10?5:cardItem.taskType-1],borderRight:'10px solid '+color[cardItem.taskType==10?5:cardItem.taskType-1],  borderLeft: '10px solid transparent',
  borderBottom: '10px solid transparent'}:{borderTop:'7px solid '+color[cardItem.taskType==10?5:cardItem.taskType-1],borderRight:'7px solid '+color[cardItem.taskType==10?5:cardItem.taskType-1],  borderLeft: '7px solid transparent',
  borderBottom: '7px solid transparent'}"
        ></div>
      </a-dropdown>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
// import task1 from "../../common/svg/task1.svg";
import { Modal, message } from "ant-design-vue";
import task2 from "../../common/svg/task2.svg";
import task4 from "../../common/svg/task4.svg";
import task6 from "../../common/svg/task6.svg";
import defaultPerson from "../../../assets/defaultPerson.png";
import tabSvg1 from "../../common/svg/我的一天备份.svg";
import tabSvg2 from "../../common/svg/我的一天备份2.svg";
import important from "@/assets/important.png";
import unimportant from "@/assets/unimportant.png";
import openCountDown from "@/assets/openCountDown.png";
import bigImg from "@/assets/big.png";
export default {
  name: "TaskItem",
  props: [
    "cardItem",
    "executorKey",
    "moveChooseKey",
    "dateType",
    "viewState",
    "bottomtype",
  ],
  inject: ["color", "backgroundColor", "msgItem", "getFontColor"],
  computed: {
    ...mapState({
      user: (state) => state.auth.user,
      cardKey: (state) => state.card.cardKey,
      groupRole: (state) => state.group.groupRole,
      groupKey: (state) => state.group.groupKey,
      groupType: (state) => state.group.groupType,
      taskList: (state) => state.task.taskList,
      cardDetail: (state) => state.card.cardDetail,
      cardMemberList: (state) => state.group.cardMemberList,
      deviceState: (state) => state.common.deviceState,
      cardShowState: (state) => state.card.cardShowState,
      finishPercentArray: (state) => state.task.finishPercentArray,
      countDownKey: (state) => state.countdown.countDownKey,
      taskType: (state) => state.task.taskType,
      taskTitle: (state) => state.task.taskTitle,
    }),
    fontColor() {
      return this.getFontColor();
    },
    taskState() {
      return (
        this.groupType != 1 ||
        (this.groupType == 1 &&
          this.cardItem.groupKey != localStorage.getItem("mainGroupKey"))
      );
    },
    // cardArray() {
    //   return this.taskList.cardArray;
    // }
  },
  inheritAttrs: false,
  data() {
    return {
      taskTypeArr: [
        { name: "建议", id: 1 },
        { name: "强烈建议", id: 2 },
        { name: "错误", id: 3 },
        { name: "严重错误", id: 4 },
        { name: "致命错误", id: 5 },
        { name: "顶级优先", id: 10 },
      ],
      taskArr: [task2, task6, task6],
      mainGroupKey: localStorage.getItem("mainGroupKey"),
      cardRole: true,
      defaultPerson: defaultPerson,
      endtime: { time: 0, endState: true },
      tabSvg1: tabSvg1,
      tabSvg2: tabSvg2,
      todayTaskState: false,
      createTimeText: " 无",
      endTimeText: " 无",
      unimportant,
      important,
      openCountDown,
      bigImg,
    };
  },
  mounted() {
    if (
      this.cardKey == this.cardItem._key &&
      (this.cardItem.groupRole < 4 ||
        this.cardItem.creatorKey == this.user._key ||
        this.cardItem.executorKey == this.user._key)
    ) {
      this.cardRole = false;
      this.changeCardDetailType(2);
    }
    this.getTime(this.cardItem.taskEndDate);
    // else {
    //   this.changeCardDetailType(1);
    // }
  },
  methods: {
    ...mapActions("card", [
      "setCardIndex",
      "editCard",
      "changeCardShowState",
      "changeCardDetailType",
      "setCardDetail",
      "setCardKey",
      "deleteCard",
      "setCardExecutorKey",
      "getCardDetail",
    ]),
    ...mapActions("auth", ["getTargetUserInfo"]),
    ...mapActions("group", [
      "setGroupKey",
      "setGroupType",
      "setCardMemberList",
      "getCardMember",
    ]),
    ...mapActions("common", ["changeHeaderIndex", "setFullState"]),
    ...mapActions("task", ["setLabelKey", "setTaskTitle"]),
    ...mapActions("countdown", ["setCountDownKey", "getCountDownDetail"]),
    chooseTodayTask(type) {
      this.setCardKey(this.cardDetail._key);
      let obj = {
        key: this.cardItem._key,
        importantStatus: type,
      };
      if (this.cardItem.title != "" && this.taskTitle != "") {
        obj.title = this.taskTitle;
      }
      this.editCard(obj);
    },
    changeTab(e) {
      if (e.keyCode == 13 && e.shiftKey) {
        let title = e.target.value;
        title = title + "\n";
        document.getElementById("textareaid" + this.cardItem._key).value =
          title + "\n";
        e.preventDefault(); // 阻止浏览器默认换行操作
        return false;
      } else if (e.keyCode == 8 && e.ctrlKey) {
        this.deleteTargetCard();
        e.preventDefault(); // 阻止浏览器默认换行操作
        return false;
      }
    },
    createNewTask(e) {
      if (!e.shiftKey) {
        this.$emit(
          "createTask",
          this.cardItem,
          "新增",
          this.executorKey,
          this.cardItem.parentCardKey ? this.cardItem.parentCardKey : null
        );
      }
      e.preventDefault(); // 阻止浏览器默认换行操作
      return false;
    },
    createChildTask(e) {
      this.$emit(
        "createTask",
        this.cardItem,
        "新增",
        this.executorKey,
        this.cardItem._key
      );
      e.preventDefault(); // 阻止浏览器默认换行操作
      return false;
    },
    checkCard(key, groupKey) {
      this.setCardKey(key);
      this.setLabelKey(this.cardItem.labelKey);
      this.getCardMember({
        groupId: groupKey,
      });
      this.cardRole = !(
        this.cardItem.groupRole < 4 ||
        this.cardItem.creatorKey == this.user._key ||
        this.cardItem.executorKey == this.user._key
      );
      if (!this.cardRole) {
        this.changeCardDetailType(2);
        // this.setTaskTitle(this.cardItem.title);
      } else {
        this.changeCardDetailType(1);
        this.changeCardShowState(false);
      }
      this.$nextTick(function () {
        if (document.getElementById("textareaid" + key)) {
          document.getElementById("textareaid" + key).focus();
        }
      });
    },
    changeFinishPercent(finishPercent) {
      finishPercent = finishPercent == 1 ? 0 : 1;
      let obj = {
        key: this.cardItem._key,
        finishPercent: finishPercent,
        todayTaskTime: finishPercent == 1 ? new Date().getTime() : 0,
      };
      if (this.cardItem.title != this.taskTitle) {
        obj.title = this.taskTitle;
      }
      if (finishPercent == 1) {
        this.$emit("playAudio");
        this.setCardKey(0);
      }
      this.editCard(obj);
    },
    //修改状态
    changeMsg(id) {
      let obj = {
        taskType: id,
        key: this.cardItem._key,
      };
      if (this.cardItem.title != "" && this.taskTitle != "") {
        obj.title = this.taskTitle;
      }
      this.editCard(obj);
    },
    changeTitle(e) {
      // this.cardTitle = e.target.value;
      this.setTaskTitle(e.target.value);
      // this.$emit("update:taskTitle", e.target.value);
    },
    showCardInfo(key, groupKey) {
      this.checkCard(key, groupKey);
      this.changeCardShowState(true);
    },

    deleteTargetCard() {
      let that = this;
      if (
        this.groupRole < 3 ||
        this.cardItem.creatorKey == this.user._key ||
        this.cardItem.executorKey == this.user._key
      ) {
        Modal.confirm({
          title: "提示消息",
          content: "是否确认要删除该卡片",
          okText: "确认",
          cancelText: "取消",
          onOk() {
            that.deleteCard({
              cardKey: that.cardItem._key,
              groupKey: that.cardItem.groupKey,
            });
            that.changeCardShowState(false);
            that.changeCardDetailType(1);
            that.setCardKey(0);
          },
        });
      } else {
        this.$message.error("当前权限无法删除");
      }
    },
    changeMoveState(key) {
      this.$emit("update:moveChooseKey", key);
    },
    // changetreeState() {
    //   this.$emit("changetreeGraphState", true);
    // }
    getTime(taskEndDate) {
      let time = 0;
      if (taskEndDate) {
        time = Math.floor(
          (this.$moment(taskEndDate).endOf("day").valueOf() -
            this.$moment(new Date().getTime()).endOf("day").valueOf()) /
            86400000
        );
        this.endTimeText = this.$moment(taskEndDate).format("YYYY年MM月DD日");
      }
      this.endtime = {
        time: time < 0 ? Math.abs(time) : Math.abs(time) + 1,
        endState: time < 0 ? false : true,
      };
    },
    toCountDown(key, groupKey) {
      this.checkCard(key, groupKey);
      this.setCountDownKey(key);
      this.getCountDownDetail({ cardKey: key });
      this.$emit("update:countdownState", 1);
    },
    // toBig() {
    //   this.getCardDetail({ cardKey: this.cardItem._key });
    //   this.$emit("update:countdownState", 1);
    // }
  },
  watch: {
    // 获取到用户信息
    "cardItem.taskEndDate": {
      handler(newVal, oldVal) {
        // console.log(newVal, oldVal);
        if (newVal != oldVal) {
          this.getTime(newVal);
        }
      },
      immediate: true,
      // 获取到用户信息
    },
    "cardItem.taskStartDate": {
      handler(newVal, oldVal) {
        if (newVal != oldVal) {
          this.createTimeText = this.$moment(newVal).format("YYYY年MM月DD日");
        }
      },
      immediate: true,
      // 获取到用户信息
    },
  },
};
</script>

<style scoped>
.taskItem {
  width: 100%;
  min-height: 40px;
  padding: 6px 0px 4px 6px;
  /* box-sizing: border-box; */
  margin-bottom: 2px;
  background-color: rgba(255, 255, 255, 0.95);
  display: flex;
  position: relative;
  box-sizing: border-box;
  border-radius: 5px;
  overflow: hidden;
  /* align-items: center; */
}

.taskItem:hover {
  box-shadow: 0 0 7px 0 rgba(0, 0, 0, 0.26);
}
.taskItem-img {
  width: 18px;
  height: 18px;
  overflow: hidden;
  border-radius: 50%;
  /* margin-top: 6px;
  margin-right: 5px; */
  margin-left: 5px;
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
  /* color: #23384b; */
  display: flex;
  align-items: flex-start;
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
  margin-top: 4px;
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
  color: #fff;
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
  color: #fff;
  position: absolute;
  bottom: 0px;
  z-index: 3;
}
.taskItem-title {
  width: calc(100% - 35px);
  min-height: 28px;
  display: block;
  white-space: normal;
  box-sizing: border-box;
  font-size: 12px;
  margin-right: 8px;
  position: relative;
  word-wrap: break-word;
}
.taskItem-title > div {
  padding: 3px 0px 0px 5px;
  box-sizing: border-box;
  word-wrap: break-word;
  position: relative;
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
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 5px;
  cursor: pointer;
}
.taskItem-check-icon:nth-child(4) {
  margin-right: 0px;
}
.taskItem-check-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
/* .taskItem-title-name {
  min-height: 28px;
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  z-index: 3;
} */
.taskItem-taskType {
  height: 0px;
  width: 0px;
  position: absolute;
  top: 0px;
  right: 0px;
  /* border-top-right-radius: 5px; */
}
</style>