<template>
  <div class="phoneTask" @click="addLabelState=false">
    <div class="phoneTask-nav">
      <div class="phoneTask-icon-left">
        <a-Icon
          type="contacts"
          :style="{fontSize:'30px',cursor:'pointer',color:'#1ACA8E'}"
          @click="changeHeaderIndex(1)"
        />
        <a-Icon
          type="team"
          :style="{fontSize:'30px',cursor:'pointer',color:'#1ACA8E',marginLeft:'15px'}"
          @click="changeHeaderIndex(2)"
        />
      </div>
      <div :style="{fontSize:'20px'}">working.vip</div>
      <div class="phoneTask-icon-right">
        <a-icon
          type="bell"
          :style="{fontSize:'30px',cursor:'pointer',marginRight:'10px'}"
          @click="changeHeaderIndex(3)"
        />
        <a-icon
          type="ellipsis"
          :style="{fontSize:'30px',cursor:'pointer'}"
          @click.stop="addLabelState=true"
        />
      </div>
    </div>
    <div class="phoneTask-info">
      <div class="phoneTask-info-avatar">
        <img :src="groupAvatar" />
      </div>
      <div class="phoneTask-info-nickName">{{groupName}}</div>
    </div>
    <div class="phoneTask-container">
      <div class="phoneTask-item">
        <div class="phoneTask-label">
          <div class="phoneTask-label-title">任务池 ( {{taskAllList.length}} )</div>
          <a-icon
            type="plus"
            :style="{fontSize:'24px',cursor:'pointer',marginRight:'10px'}"
            @click.stop="createNewTask(0)"
          />
        </div>
        <div
          class="phoneTaskItem-container"
          v-for="(item,index) in taskAllList"
          :key="'taskAllList'+index"
          :style="{borderLeft:'6px solid '+color[item.taskType]}"
          @click="checkCard(item._key,item,item.groupKey)"
        >
          <PhoneTaskItem :cardItem="item" :cardTargetIndex="index" />
        </div>
      </div>
      <div class="phoneTask-item" v-for="(item,index) in taskInfo" :key="'taskInfo'+index">
        <div class="phoneTask-label">
          <div
            class="phoneTask-label-title"
          >{{taskNameArr[index]+" ( "+(taskInfo[index].length)+" )"}}</div>
          <a-icon
            type="plus"
            :style="{fontSize:'24px',cursor:'pointer',marginRight:'10px'}"
            @click.stop="createNewTask(labelArray[index]._key)"
          />
        </div>
        <div
          class="phoneTaskItem-container"
          v-for="(value,key) in taskInfo[index]"
          :key="'taskInfoItem'+key"
          :style="{borderLeft:'6px solid '+color[value.taskType]}"
          @click="checkCard(value._key,value,value.groupKey)"
        >
          <PhoneTaskItem :cardItem="value" :cardTargetIndex="key" />
        </div>
      </div>
    </div>
    <div v-if="cardShowState" class="phoneTaskItem-cardInfo">
      <ImPerson :style="{width:'60px'}" />
      <CardInfo
        v-if="cardShowState"
        class="phoneTaskItem-cardInfo-container"
        :style="deviceState=='phone'?{width:(deviceWidth- 60)+'px',height:'100%'}:null"
      />
    </div>
    <div class="phoneTask-item-addLabel" v-if="addLabelState" @click.stop>
      <a-icon type="plus" :style="{marginRight:'10px'}" />
      <a-input
        ref="addLabel"
        type="text"
        size="small"
        :style="{ width: '90%'}"
        :value="inputValue"
        @change="handleInputChange"
        @keyup.enter="handleInputConfirm"
        placeholder="添加标签"
      />
    </div>
    <div class="phoneTask-mask" v-if="phoneTaskeditState" @click="phoneTaskeditState=false">
      <div class="phoneTask-edit">
        <div class="phoneTask-title">
          <div class="phoneTask-title-icon"></div>
          <div class="phoneTask-title-subtitle">更多选项</div>
        </div>
        <div class="phoneTask-edit-item" @click.stop="focusToAdd">
          <div>
            <a-icon type="plus" :style="{marginRight:'10px'}" />新增标签
          </div>
        </div>
        <div class="phoneTask-edit-item">
          <div>
            <a-icon type="setting" :style="{marginRight:'10px'}" />群设置
          </div>
          <a-icon type="right" />
        </div>
        <div class="phoneTask-edit-item">
          <div>
            <a-icon type="pie-chart" :style="{marginRight:'10px'}" />更改主题
          </div>
          <a-icon type="right" />
        </div>
      </div>
    </div>
    <iframe :src="chatUrl" class="phoneChat contentIframe" v-show="iframeShowState"></iframe>
    <div class="phoneChat-close" @click="iframeShowState=false" v-if="iframeShowState">
      <a-icon type="close" class="phoneChat-close-icon" />
    </div>
    <div class="phoneTaskItem-chat" @click="iframeShowState=true">
      <a-icon type="smile" class="phoneTaskItem-chatIcon" />
    </div>
    <Contact class="phoneTaskWapper" v-if="headerIndex==1||headerIndex==2" />
    <Message class="phoneTaskWapper" v-if="headerIndex==3" />
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Vue from "vue";
// import LogoSvg0 from "../common/svg/logo2.svg";
import ContactSvg from "../common/svg/contact.svg";
import GroupSvg1 from "../common/svg/group1.svg";
import defaultPerson from "../../assets/defaultPerson.png";
import defaultGroup from "../../assets/defaultGroup.png";
import { Icon, Input } from "ant-design-vue";
import PhoneTaskItem from "./PhoneTaskItem";
import CardInfo from "../timeline/cardInfo/CardInfo";
import Contact from "../contact/Contact";
import Message from "../message/Message";
import ImPerson from "../timeline/im/ImPerson";
export default {
  name: "PhoneTask",
  components: { PhoneTaskItem, CardInfo, Contact, Message, ImPerson },
  data() {
    return {
      groupAvatar: "",
      groupName: "",
      task: "profile",
      taskInfo: [],
      taskAllList: [],
      checkIndex: null,
      inputValue: "",
      color: ["#6FD29A", "#21ABE4", "#F5A623", "#FB8444", "#FF5D5B", "#9F33FE"],
      chooseKey: 0,
      taskNameArr: [],
      labelName: "",
      taskNewTitle: "",
      addLabelState: false,
      phoneTaskeditState: false,
      iframeShowState: null,
      unReadNum: 0,
      chatUrl: "",
      ContactSvg: ContactSvg,
      GroupSvg1: GroupSvg1
    };
  },
  computed: mapState({
    user: state => state.auth.user,
    headerIndex: state => state.common.headerIndex,
    taskList: state => state.task.taskList,
    labelArray: state => state.task.labelArray,
    cardArray: state => state.task.cardArray,
    cardDetail: state => state.card.cardDetail,
    groupType: state => state.group.groupType,
    groupKey: state => state.group.groupKey,
    targetUInfo: state => state.auth.targetUInfo,
    deviceState: state => state.common.deviceState,
    deviceWidth: state => state.common.deviceWidth,
    cardShowState: state => state.card.cardShowState,
    groupInfo: state => state.group.groupInfo
  }),
  created() {
    window.addEventListener("message", this.handlerIframeEvent);
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
      "createCard"
    ]),
    ...mapActions("task", [
      "getTaskList",
      "createTaskLabel",
      "changeTaskLabel",
      "setLabelKey",
      "deleteCardLabel",
      "setCardLabel"
    ]),
    ...mapActions("group", ["getCardMember", "getGroupInfo"]),
    ...mapActions("common", ["changeHeaderIndex"]),
    checkCard(key, item, groupKey) {
      this.setCardKey(key);
      this.setLabelKey(item.labelKey);
      this.getCardMember({
        groupId: groupKey
      });
      this.changeCardShowState(true);
      this.changeCardDetailType(2);
    },
    handlerIframeEvent(e) {
      const that = this;
      switch (e.data.eventName) {
        case "total-unread":
          this.unReadNum = e.data.data;
          break;
        case "receive-new-message":
          this.unReadNum = this.unReadNum + e.data.data.unread;
          break;
        case "click-room":
          this.unReadNum = this.unReadNum - e.data.data.unread;
          break;
        default:
          null;
      }
    },
    handleInputConfirm() {
      this.inputVisible = false;
      if (this.inputValue != "") {
        this.addLabelState = false;
        this.createTaskLabel({
          groupKey: this.groupKey,
          cardLabelName: this.inputValue
        });
      }
    },
    handleInputChange(e) {
      this.inputValue = e.target.value;
    },
    focusToAdd() {
      this.phoneTaskeditState = false;
      this.addLabelState = true;
      this.$nextTick(() => {
        this.$refs.addLabel.focus();
      });
    },
    createNewTask(labelKey) {
      let obj = {
        type: 2,
        title: "新建任务",
        content: "",
        rootType: 0,
        groupKey: this.groupKey,
        taskType: 1,
        executorKey: this.user._key,
        followUKeyArray: []
      };
      labelKey ? (obj.labelKey = labelKey) : null;
      this.createCard(obj);
    },
    getData(labelArray, cardArray) {
      this.taskAllList = [];
      this.taskInfo = [];
      this.taskNameArr = [];
      this.taskClickArr = [];
      this.taskMoveArr = [];
      labelArray.forEach((item, index) => {
        this.taskInfo[index] = [];
        this.taskClickArr[index] = false;
        this.taskMoveArr[index] = false;
        this.taskNameArr.push(item.cardLabelName);
      });
      // this.taskAllList = JSON.parse(JSON.stringify(taskList.cardArray));
      cardArray.forEach((item, index) => {
        if (item.labelKey) {
          for (let i = 0; i < labelArray.length; i++) {
            if (labelArray[i] && item.labelKey == labelArray[i]._key) {
              this.taskInfo[i].push(item);
            }
          }
        } else {
          this.taskAllList.push(item);
        }
      });
    },
    getName(groupType) {
      if (groupType == 1) {
        this.groupAvatar =
          this.user && this.user.profile.avatar
            ? this.user.profile.avatar
            : defaultPerson;
        this.groupName = this.user
          ? this.user.profile.nickName + " 工作台"
          : "";
      } else if (groupType == 2) {
        this.groupAvatar =
          this.targetUInfo && this.targetUInfo.avatar
            ? this.targetUInfo.avatar
            : defaultPerson;
        this.groupName = this.targetUInfo
          ? this.targetUInfo.nickName + " 工作台"
          : "";
      } else if (groupType == 3) {
        this.groupAvatar =
          this.groupInfo && this.groupInfo.groupLogo
            ? this.groupInfo.groupLogo
            : defaultGroup;
        this.groupName = this.groupInfo
          ? this.groupInfo.groupName.split("___")[0]
          : "";
      }
    }
  },
  watch: {
    user: {
      handler(newVal, oldVal) {
        if (newVal != oldVal && oldVal == null) {
          // this.getName(this.groupType);
          // this.getGroupInfo({ key: this.groupKey});
          this.chatUrl =
            "https://im.qingtime.cn/#/?token=" +
            localStorage.getItem("token");
        }
      },
      immediate: true,
      deep: true
    },
    groupKey(newVal, oldVal) {
      if (oldVal !== newVal && newVal) {
        // this.taskInfo = [];
        this.getGroupInfo({ key: newVal });
        if (this.groupType == 3) {
          this.getTaskList({
            typeBoard1: this.groupType,
            targetUGKey: newVal,
            finishPercentArray: "[0, 1]"
          });
        }
      }
    },
    groupInfo: {
      handler(newVal, oldVal) {
        // if (oldVal !== newVal && newVal) {
        this.getName(this.groupType);
        // }
      },
      // immediate: true,
      deep: true
    },
    targetUInfo: {
      handler(newVal, oldVal) {
        // if (oldVal !== newVal && newVal) {
        // this.taskInfo = [];
        this.getName(this.groupType);
        this.groupName = newVal.nickName + " 工作台";
        if (this.groupType != 3) {
          this.getTaskList({
            typeBoard1: this.groupType,
            targetUGKey: newVal.userId,
            finishPercentArray: "[0, 1]"
          });
        }
        // }
      },
      // immediate: true,
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
    groupType(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.getName(newVal);
      }
    }
  }
};
</script>

<style scoped>
.phoneTask {
  width: 100%;
  height: 100%;
  background-color: #6d80d1;
  position: relative;
  z-index: 1;
}
.phoneTask .ant-input {
  background: rgba(255, 255, 255, 0) !important;
  border: 0px !important;
  font-size: 16px !important;
  color: #fff !important;
}
.phoneTask .ant-input::selection {
  background: #1aca8e !important;
}
.phoneTask-nav {
  height: 50px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  padding: 0px 5%;
  box-sizing: border-box;
  border-bottom: 1px solid #c8c8c8;
}
.phoneTask-info {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  font-size: 16px;
  color: #fff;
}
.phoneTask-info-avatar {
  height: 30px;
  width: 30px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 10px;
}
.phoneTask-info-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.phoneTask-container {
  height: calc(100% - 100px);
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  position: relative;
  margin-top: 10px;
}
.phoneTask-container::-webkit-scrollbar {
  width: 0px;
}
.phoneTask-item {
  width: 90%;
  /* position: absolute;
  left: 5%;
  top: 0px; */
  margin-left: 5%;
  margin-bottom: 15px;
}
.phoneTask-label {
  font-size: 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  margin-bottom: 20px;
}
.phoneTaskItem-container {
  width: 100%;
  min-height: 71px;
  background: #fff;
  opacity: 0.9;
  border-radius: 5px;
  margin-bottom: 1px;
  display: flex;
  align-items: center;
}
.phoneTask-item-addLabel {
  width: 90%;
  height: 55px;
  display: flex;
  align-items: center;
  position: fixed;
  left: 5%;
  bottom: 85px;
  background: rgba(83, 92, 128, 0.8);
  font-size: 18px;
  color: #fff;
  padding: 0px 2.5%;
  box-sizing: border-box;
  border-radius: 10px;
}
.phoneTask-mask {
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  background: rgba(0, 0, 0, 0.2);
  z-index: 2;
}
.phoneTask-edit {
  height: 270px;
  width: 100%;
  position: absolute;
  left: 0px;
  bottom: 0px;
  background: #fff;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  z-index: 3;
}
.phoneTask-title {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.phoneTask-title-icon {
  height: 3px;
  width: 70px;
  background: #d8d8d8;
  border-radius: 50px;
  margin-top: 10px;
}
.phoneTask-title-subtitle {
  width: 100%;
  height: 40px;
  margin-top: 17px;
  font-size: 16px;
  text-align: center;
  border-bottom: 1px solid #e9e9e9;
}
.phoneTask-edit-item {
  height: 65px;
  width: 100%;
  padding: 0px 2.5%;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
}
.phoneTaskItem-chat {
  width: 45px;
  height: 45px;
  position: fixed;
  right: 2.5%;
  bottom: 30px;
  z-index: 5;
  background: #fff;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
}
.phoneTaskItem-chatIcon {
  font-size: 56px;
  color: #1aca8e;
  margin-left: -6px;
  margin-top: -1px;
}
.phoneTaskItem-cardInfo {
  width: 100%;
  height: calc(100% - 50px);
  display: flex;
  position: absolute;
  top: 50px;
  left: 0px;
  background: #fff;
  z-index: 10;
}
.phoneTaskItem-cardInfo-container {
  width: 100%;
  height: 100%;
}
.iframeShow {
  animation: iframePhoneShow 300ms;
  animation-fill-mode: forwards;
}
.iframeHidden {
  animation: iframePhoneHidden 300ms;
  animation-fill-mode: forwards;
}
.phoneChat {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  z-index: 10;
}
.phoneChat-close {
  position: fixed;
  top: 10px;
  right: 15px;
  font-size: 25px;
  color: #fff;
  z-index: 20;
}
.phoneTaskWapper {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 10;
}
</style>