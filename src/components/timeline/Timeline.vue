<template>
  <div class="timeline" @click="changeHeaderIndex(0)">
    <Header />
    <div class="content-info">
      <!-- <div
        :class="{contactWapper:true,contactOut:showState?true:false,contactIn:!showState?true:false}"
        v-if="headerIndex===1"
      >
        <Contact />
        <div class="contact-icon" @click="changeShowState(!showState)">
          <a-icon type="double-right" v-if="showState" />
          <a-icon type="double-left" v-if="!showState" />
        </div>
      </div>-->
      <div class="content-wrapper">
        <Task v-if="linkState === 0" />
        <Card v-if="linkState === 1" />
        <Naotu v-if="linkState === 2" />
        <KnowledgeBase v-if="linkState === 3" />
        <GroupFile v-if="linkState === 4" />
        <GroupAlbum v-if="linkState === 5" />
      </div>
      <iframe
        :src="chatUrl"
        v-show="user&&iframeShowState"
        :class="{contentIframe:true,iframeShow:iframeShowState===true?true:false,iframeHidden:!iframeShowState===true?true:false}"
      ></iframe>
      <div class="unReadNum" v-if="this.unReadNum>0">{{this.unReadNum}}</div>
      <div class="chat-img">
        <a-icon
          :component="chatOpen"
          :style="{ fontSize: '50px'}"
          v-if="!iframeShowState"
          @click="iframeShowState=true"
        />
        <a-icon
          :component="chatClose"
          :style="{ fontSize: '50px'}"
          v-if="iframeShowState"
          @click="iframeShowState=false"
        />
      </div>
      <CardInfo v-if="cardShowState" :cardTypeIndex="linkState" class="cardInfo" />
      <!-- <div id="chart_example" style="width:350px;height:700px"></div> -->
    </div>
    <div v-if="headerIndex==5" class="user-dialog">
      <UserHome />
    </div>
    <a-modal title="加群" :visible="inviteState" @cancel="setInviteState(false)" :footer="null">
      <Invite />
    </a-modal>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import CardInfo from "./cardInfo/CardInfo";
import Header from "./Header";
import Chat from "../chat/Chat";
import Contact from "../contact/Contact";
import UserHome from "../user/UserHome";
import ChatOpen from "../common/svg/chat-open.svg";
import ChatClose from "../common/svg/chat-close.svg";
import Invite from "../Invite";
import Vue from "vue";

const Card = () => import("./content/Card");
const Task = () => import("./content/Task");
const Naotu = () => import("./content/Naotu");
const KnowledgeBase = () => import("./content/KnowledgeBase");
const GroupFile = () => import("./content/GroupFile");
const GroupAlbum = () => import("./content/GroupAlbum");
export default {
  name: "Timeline",
  components: {
    CardInfo,
    Header,
    Card,
    Task,
    Naotu,
    KnowledgeBase,
    GroupFile,
    GroupAlbum,
    Chat,
    Contact,
    UserHome,
    Invite
  },
  data() {
    return {
      state: true,
      chatUrl: "",
      iframeShowState: null,
      chatImgState: false,
      chatOpen: ChatOpen,
      chatClose: ChatClose,
      unReadNum: 0
    };
  },
  computed: mapState({
    // showState: state => state.common.showState,
    headerIndex: state => state.common.headerIndex,
    user: state => state.auth.user,
    targetUInfo: state => state.auth.targetUInfo,
    cardShowState: state => state.card.cardShowState,
    groupKey: state => state.group.groupKey,
    linkState: state => state.card.linkState,
    groupType: state => state.group.groupType,
    groupInfo: state => state.group.groupInfo,
    inviteState: state => state.group.inviteState,
    inviteKey: state => state.group.inviteKey
  }),
  created() {
    window.addEventListener("message", this.handlerIframeEvent);
  },
  mounted() {
    if (localStorage.getItem("groupKey")) {
      this.setGroupKey(localStorage.getItem("groupKey"));
    }
    if (localStorage.getItem("groupType")) {
      this.setGroupType(parseInt(localStorage.getItem("groupType")));
    }
    if (this.user) {
      this.chatUrl =
        "https://im.qingtime.cn/#/?token=" + localStorage.getItem("token");
      if (this.groupType == 3) {
        this.getGroupInfo({ key: this.groupKey });
      }
      if (localStorage.getItem("inviteKey")) {
        this.setInviteState(true);
        this.setInviteKey(localStorage.getItem("inviteKey"));
        this.getInviteInfo({
          key: localStorage.getItem("inviteKey")
        });
        // this.setGroupType(3);
      }
      // const receiver = document.querySelector("iframe");
      // const that = this;
      // if (localStorage.getItem("inviteKey")) {
      //   this.setInviteState(true);
      //   this.setInviteKey(localStorage.getItem("inviteKey"));
      // this.getGroupInfo({
      //   key: localStorage.getItem("inviteKey")
      // });
      // this.setGroupType(3);
      // }
    }
  },
  methods: {
    ...mapActions("common", ["changeShowState", "changeHeaderIndex"]),
    ...mapActions("group", [
      "getGroupInfo",
      "setGroupType",
      "setGroupKey",
      "setInviteState",
      "setInviteKey",
      "setGroupJoinType",
      "setGroupHasPassword",
      "setGroupPassword",
      "getInviteInfo"
    ]),
    /**
     * 聊天监听事件
     */
    handlerIframeEvent(e) {
      const that = this;
      switch (e.data.eventName) {
        case "close-win":
          this.iframeShowState = false;
          setTimeout(function() {
            that.chatImgState = true;
          }, 300);
          break;
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
    }
  },
  watch: {
    user: {
      handler: function(newVal, oldVal) {
        // 获取到用户信息
        if (oldVal == null && newVal) {
          this.chatUrl =
            "https://im.qingtime.cn/#/?token=" + localStorage.getItem("token");
        }
        if (localStorage.getItem("inviteKey")) {
          this.setInviteState(true);
          this.setInviteKey(localStorage.getItem("inviteKey"));
          this.getInviteInfo({
            key: localStorage.getItem("inviteKey")
          });
          // this.setGroupType(3);
        }
        if (this.groupType === 3) {
          this.getGroupInfo({ key: this.groupKey });
        }
      }
    },
    groupKey(newVal, oldVal) {
      if (oldVal !== newVal && this.user) {
        if (this.groupType === 3) {
          this.getGroupInfo({ key: newVal });
        }
      }
    },
    groupType(newVal, oldVal) {
      if (oldVal !== newVal && this.user) {
        if (newVal === 3) {
          this.getGroupInfo({ key: this.groupKey });
        }
      }
    },
    inviteKey: {
      handler: function(newVal, oldVal) {
        if (oldVal != newVal && this.user && newVal) {
          this.getInviteInfo({ key: newVal });
        }
      },
      immediate: true
    },
    iframeShowState(newVal, oldVal) {
      if (newVal) {
        let that = this;
        console.log(this.groupInfo);
        if (this.groupType == 3) {
          document.querySelector("iframe").contentWindow.postMessage(
            {
              eventName: "go-chat",
              data: { username: that.groupInfo.groupName, type: "c" }
            },
            "https://im.qingtime.cn"
          );
        } else {
          let username = "";
          let userInfo = {};
          if (this.groupType == 1) {
            userInfo = that.user;
          } else if (this.groupType == 2) {
            userInfo = that.targetUInfo;
          }
          if (userInfo.rocketChat && userInfo.rocketChat.username) {
            username = userInfo.rocketChat.username;
          } else {
            username = userInfo.mobile;
          }
          document.querySelector("iframe").contentWindow.postMessage(
            {
              eventName: "go-chat",
              data: { username: username, type: "d" }
            },
            "https://im.qingtime.cn"
          );
        }
      }
    }
  }
};
</script>

<style>
.timeline {
  display: flex;
  flex-direction: column;
  position: relative;
}
.contactWapper {
  width: 350px;
  height: 100%;
  border-right: 1px solid #d5d5d5;
  background-color: #fff;
  position: relative;
  z-index: 20;
}
/* .content-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  flex: 1;
} */
.content-info {
  height: calc(100% - 45px);
  width: 100%;
  display: flex;
  position: relative;
}
.im-wrapper {
  width: 300px;
  height: 100%;
  border-left: 1px solid #d5d5d5;
}

.content-wrapper {
  height: 100%;
  width: calc(100% - 600px);
  background-color: #f3f5f8;
  flex: 1;
  position: relative;
}
.contactContent {
  width: 300px;
  height: 100%;
  background-color: #fff;
  position: relative;
  z-index: 5;
  border-left: 1px solid #d5d5d5;
  /* border-right:1px solid #d5d5d5; */
}
/* 联系人活动页面 */
.contactOut {
  animation: moveOut 500ms;
  animation-fill-mode: forwards;
}
.contactIn {
  animation: moveIn 500ms;
  animation-fill-mode: forwards;
}
.cardinfo-content {
  width: 300px;
  height: 100%;
  /* position: relative; */
  position: absolute;
  top: 0px;
  right: 0px;
  z-index: 3;
}
.user-dialog {
  position: absolute;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;
  background: rgba(0, 0, 0, 0.2);
  padding: 20px;
  box-sizing: border-box;
  z-index: 30;
  display: flex;
  justify-content: center;
  align-items: center;
}
.cardInfo {
  width: 300px;
  height: 100%;
  position: absolute;
  bottom: 0px;
  right: 0px;
  z-index: 6;
  border: 1px solid transparent;
  background-color: #fff;
}
.contentIframe {
  width: 0px;
  height: 0px;
  position: absolute;
  bottom: 50px;
  right: 22px;
  box-shadow: -3px 2px 6px rgba(0, 0, 0, 0.4);
  border-radius: 10px;
  z-index: 50;
  background-color: #fff;
}
.chat-img {
  height: 49px;
  width: 49px;
  /* border: 1px solid transparent; */
  box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  position: absolute;
  right: 5px;
  bottom: 25px;
  z-index: 50;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
}
.unReadNum {
  width: 20px;
  height: 20px;
  position: absolute;
  bottom: 50px;
  right: 3px;
  z-index: 100;
  background-color: red;
  color: #fff;
  line-height: 20px;
  text-align: center;
  border-radius: 50%;
}
/* .chat-img-svg {
  width: 50px;
  height: 50px;
} */
.iframeShow {
  animation: iframeShow 300ms;
  animation-fill-mode: forwards;
}
.iframeHidden {
  animation: iframeHidden 300ms;
  animation-fill-mode: forwards;
}
</style>
