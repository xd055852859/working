<template>
  <div
    class="timeline"
    @click="changeHeader"
    :style="themeState?{backgroundImage:'url('+bgImg+')',color:fontColor}:{backgroundColor:themeColor,color:fontColor}"
  >
    <Header
      :themeState="themeState"
      :themeColor="themeColor"
      :showThemeState="showThemeState"
      :fontColor="fontColor"
      :taskObj="taskObj"
      @changeThemeColor="changeBgColor"
      @changeThemeState="changebgState"
      @changebgImg="changeImg"
      @changeThemeVisible="changeThemeShowState"
    />
    <div class="content-info">
      <div class="content-wrapper">
        <keep-alive>
          <TaskView
            v-if="linkState === 0"
            v-on="$listeners"
            v-bind="$attrs"
            :taskObj.sync="taskObj"
          />

          <!-- <Card v-if="linkState === 1" /> -->
          <!-- <Naotu v-if="linkState === 2" /> -->
          <!-- <Calendar v-if="linkState === 2" /> -->
          <!-- <KnowledgeBase v-if="linkState === 3" />
          <GroupFile v-if="linkState === 4" />
          <GroupAlbum v-if="linkState === 5" />-->
        </keep-alive>
        <FileData v-if="linkState === 1" v-on="$listeners" v-bind="$attrs" :fontColor="fontColor" />
        <GroupData v-if="linkState === 2" v-on="$listeners" v-bind="$attrs" :fontColor="fontColor" />
        <Diary v-if="linkState === 3" v-on="$listeners" v-bind="$attrs" :fontColor="fontColor" />
      </div>
      <!-- <iframe
        :src="chatUrl"
        v-show="user&&iframeShowState"
        :class="{contentIframe:true,iframeShow:iframeShowState===true?true:false,iframeHidden:!iframeShowState===true?true:false}"
      ></iframe> -->
      <div class="unReadNum" v-if="this.unReadNum>0">{{this.unReadNum}}</div>
      <!-- <div class="chat-img">
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
      </div> -->
      <CardInfo v-if="cardShowState"  class="cardInfo" />
      <!-- <div id="chart_example" style="width:350px;height:700px"></div> -->
    </div>
    <a-modal title="加群" :visible="inviteState" @cancel="setInviteState(false)" :footer="null">
      <Invite />
    </a-modal>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import ChatOpen from "../common/svg/chat-open.svg";
import ChatClose from "../common/svg/chat-close.svg";
import { ROCKET_CHAT_URL } from "../../services/global";
// import Naotu from "./content/Naotu";
// import KnowledgeBase from "./content/KnowledgeBase";
// import GroupFile from "./content/GroupFile";
// import GroupAlbum from "./content/GroupAlbum";
export default {
  name: "Timeline",
  components: {
    CardInfo: () => import("./cardInfo/CardInfo"),
    Header: () => import("./Header"),
    Card: () => import("./card/Card"),
    Task: () => import("./task/Task"),
    Invite: () => import("../Invite"),
    Calendar: () => import("./canlendar/index"),
    TaskView: () => import("./TaskView"),
    GroupData: () => import("./GroupData"),
    FileData: () => import("./FileData"),
    Diary: () => import("./Diary")
    // Naotu,
    // KnowledgeBase,
    // GroupFile,
    // GroupAlbum,
  },
  provide() {
    return {
      // fontColor: this.fontColor,
      getFontColor: () => this.fontColor,
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
      ]
    };
  },
  data() {
    return {
      state: true,
      chatUrl: "",
      iframeShowState: null,
      chatImgState: false,
      chatOpen: ChatOpen,
      chatClose: ChatClose,
      unReadNum: 0,
      themeColor: "#46558C",
      fontColor: "#fff",
      themeState: 0,
      bgImg: "",
      showThemeState: false,
      taskObj: {
        groupKey: null,
        creatorKey: null,
        executorKey: null,
        type: "过期 / 今天 / 计划"
      },
    };
  },
  computed: {
    ...mapState({
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
      inviteKey: state => state.group.inviteKey,
      theme: state => state.auth.theme,
      deviceState: state => state.common.deviceState
    })
  },
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
      this.chatUrl = ROCKET_CHAT_URL;
      // "https://im.qingtime.cn/#/?token=" + localStorage.getItem("token");
      if (this.groupType == 3) {
        this.getGroupInfo({ key: this.groupKey });
      } else if (this.groupType == 2) {
        this.getTargetUserInfo({ key: localStorage.getItem("userKey") });
      }
      if (localStorage.getItem("inviteKey")) {
        this.setInviteState(true);
        this.setInviteKey(localStorage.getItem("inviteKey"));
        this.getInviteInfo({
          key: localStorage.getItem("inviteKey")
        });
        // this.setGroupType(3);
      }
      if (localStorage.getItem("shareKey")) {
        this.$router.push("/");
        this.setCardKey(parseInt(localStorage.getItem("shareKey")));
        this.changeCardShowState(true);
        this.changeCardDetailType(1);
        localStorage.removeItem("shareKey");
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

    const receiver = document.querySelector("iframe").contentWindow;
    // eslint-disable-next-line no-console
    const that = this;
    // 监听外部消息
    window.addEventListener("message", function(e) {
      switch (e.data.eventName) {
        // 监听iframe的消息---------------------------------------------------------
        // 启动后自动登录
        case "startup": {
          // that.initialized();
          if (
            that.user &&
            that.user.rocketChat &&
            that.user.rocketChat.expires
          ) {
            // 如果用户已经登录聊天并有效，直接登录系统iframe
            that.loginIframeViaToken(
              "https://chat.qingtime.cn",
              that.user.rocketChat.authToken
            );
          } else {
            // 否则，等待注册/登录后再登录聊天系统iframe
            const interval = setInterval(() => {
              if (
                that.user &&
                that.user.rocketChat &&
                that.user.rocketChat.expires
              ) {
                // eslint-disable-next-line
                console.log("interval：等待登录chat", that.user);
                clearInterval(interval);
                that.loginIframeViaToken(
                  ROCKET_CHAT_URL,
                  that.user.rocketChat.authToken
                );
                // that.getRooms(that.user);
              }
            }, 1000);
          }
          break;
        }
        /*      // 点击用户
        case "click-user-card-message": {
          // eslint-disable-next-line no-console
          console.log(e.data.data);
          api.auth.getTargetUserInfo(that.user.token, e.data.data.username).then(res=>{
            if(res.statusCode=="200"){
              // eslint-disable-next-line no-console
              console.log(res.result.rocketChat.name);
              let groupName=res.result.rocketChat.name;
              let avatar=res.result.profile.avatar?res.result.profile.avatar:'';
              that.changeChatTaget({ "username": e.data.data.username, "type": "d" ,"groupName":groupName,"avatar":avatar});
            }
          });

          break;
        }
              // 接收到新消息（当前打开的聊天室）
        case "new-message": {
          // that.newMessage(e.data.data);
          // window.parent.postMessage(
          //   { eventName: "receive-new-message", data: e.data.data },
          //   "*"
          // );
          // eslint-disable-next-line
          console.log("data------", e.data.data);
          break;
        }
              // 接收到新消息
        case "notification": {
          that.newMessage(e.data.data);
          that.$audioEl.play();
          if (!e.data.data.fromOpenedRoom) {
            that.$toast.show(e.data.data.notification.text, "新消息", {
              position: "topRight"
            });
          }
          window.parent.postMessage(
                  { eventName: "receive-new-message", data: e.data.data },
                  "*"
          );
          break;
        }
        case "room-opened": {
          // eslint-disable-next-line
          console.log("room-opened", e.data);
          if (window.webkit) {
            window.webkit.messageHandlers.getRoomId.postMessage({
              "roomId":  e.data.data._id
            });
          }
          if (window.JsRoomId && window.JsRoomId.getRoomId) {
            window.JsRoomId.getRoomId(e.data.data._id);
          }
          let rid=e.data.data._id;
          that.updateCurrentRoomIdStatus(rid);

          break;
        }
        case "unread-changed": {
          window.parent.postMessage(
                  { eventName: "unread-changed", data: e.data.data },
                  "*"
          );
          break;
        }
        case "click-message-link": {
          // eslint-disable-next-line
          console.log("点击消息", e.data.data);
          break;
        }
        case "click-action-link": {
          // eslint-disable-next-line
          console.log("点击链接消息", e.data.data);
          window.parent.postMessage(
                  { eventName: "click-action-link", data: e.data.data },
                  "*"
          );
          break;
        }
              // 监听调用本程序的父级页面的消息---------------------------------------------------------
        case "go-rooms": {
          that.goRooms();
          break;
        }
        case "go-chat": {
          that.goChat(e.data.data);
          break;
        }
        case "im-logout": {
          that.imLogout();
          break;
        }*/
        default:
          break;
      }
    });
  },
  methods: {
    ...mapActions("auth", ["getTargetUserInfo", "updateAuthToken", "setTheme"]),
    ...mapActions("common", ["changeHeaderIndex"]),
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
    ...mapActions("card", [
      "setCardKey",
      "changeCardShowState",
      "changeCardDetailType",
      "setLinkState"
    ]),
    ...mapActions("countdown", ["getTeamCareTask"]),
    changeHeader() {
      this.headerIndex != 10 ? this.changeHeaderIndex(0) : null;
      this.showThemeState = false;
    },
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
        case "unread-changed":
          this.unReadNum = e.data.data;
          break;
        case "total-unread":
          this.unReadNum = e.data.data;
          break;
        case "receive-new-message":
          this.unReadNum = this.unReadNum
            ? this.unReadNum
            : 0 + e.data.data.unread;
          break;
        case "click-room":
          this.unReadNum = this.unReadNum - e.data.data.unread;
          break;
        case "click-action-link":
          // eslint-disable-next-line
          console.log("链接:", e.data.data);
          window.open(
            "https://meet.qingtime.cn/chatEHoxiNQZMJt4kpHvS" +
              e.data.data.message.rid
          );
          break;
        default:
          null;
      }
    },
    changeBgColor(theme) {
      this.themeColor = theme.themeColor;
      this.fontColor = theme.fontColor;
      // theme
      this.setTheme({
        configInfo: {
          backgroundColor: this.themeColor,
          fontColor: this.fontColor,
          backgroundImg: ""
        }
      });
    },
    changebgState(themeState) {
      this.themeState = themeState;
    },
    changeImg(theme) {
      this.bgImg = theme.bgImg;
      this.fontColor = theme.fontColor;
      this.setTheme({
        configInfo: {
          backgroundColor: "",
          fontColor: this.fontColor,
          backgroundImg: this.bgImg
        }
      });
    },
    changeThemeShowState(showThemeState) {
      this.showThemeState = showThemeState;
    },

    /*
     * chat.qingtime.cn 的跳转方法
     * */
    goRoom: function(roomType, roomName) {
      const receiver = document.querySelector("iframe").contentWindow;
      let path;
      switch (roomType) {
        case "d":
          path = "direct";
          break;
        case "c":
          path = "channel";
          break;
        case "p":
          path = "group";
          break;
        default:
          break;
      }
      let urlName = roomName.toLowerCase();
      receiver.postMessage(
        {
          externalCommand: "go",
          path: `/${path}/${urlName}`
        },
        ROCKET_CHAT_URL
      );
    },
    loginIframeViaToken: function(targetOrigin, authToken) {
      const receiver = document.querySelector("iframe").contentWindow;
      // eslint-disable-next-line
      console.log("登录chat");
      receiver.postMessage(
        {
          externalCommand: "login-with-token",
          token: authToken
        },
        ROCKET_CHAT_URL
      );
      // 如果指定了目标聊天室，跳转到目标聊天室
      if (this.$route.query.username && this.$route.query.type) {
        this.goRoom(this.$route.query.type, this.$route.query.username);
      }
    }
  },

  watch: {
    user: {
      handler: function(newVal, oldVal) {
        // 获取到用户信息
        if (oldVal == null && newVal) {
          this.chatUrl = ROCKET_CHAT_URL;
          //重新登录rocketchat
          this.updateAuthToken();
          // "https://im.qingtime.cn/#/?token=" + localStorage.getItem("token");
        }
        if (localStorage.getItem("inviteKey")) {
          this.setInviteState(true);
          this.setInviteKey(localStorage.getItem("inviteKey"));
          this.getInviteInfo({
            key: localStorage.getItem("inviteKey")
          });
          // this.setGroupType(3);
        }
        if (localStorage.getItem("shareKey")) {
          this.$router.push("/");
          this.setCardKey(parseInt(localStorage.getItem("shareKey")));
          this.changeCardShowState(true);
          this.changeCardDetailType(1);
          localStorage.removeItem("shareKey");
        }
        if (this.groupType == 3) {
          this.getGroupInfo({ key: this.groupKey });
          this.getTeamCareTask({
            groupKey: this.groupKey,
            finishPercentArray: [0, 1],
            startTime: null,
            endTime: this.$moment()
              .endOf("day")
              .valueOf()
          });
        } else if (this.groupType == 2) {
          this.getTargetUserInfo({ key: localStorage.getItem("userKey") });
        }
      }
    },
    groupKey(newVal, oldVal) {
      if (oldVal !== newVal && this.user) {
        this.setLinkState(0);
        if (this.groupType === 3) {
          this.getGroupInfo({ key: newVal });
          this.getTeamCareTask({
            groupKey: this.groupKey,
            finishPercentArray: [0, 1],
            startTime: null,
            endTime: this.$moment()
              .endOf("day")
              .valueOf()
          });
        }
        this.taskObj = {
          groupKey: null,
          creatorKey: null,
          executorKey: null,
          type: "过期 / 今天 / 计划"
        };
      }
    },
    groupType(newVal, oldVal) {
      if (oldVal !== newVal && this.user) {
        this.setLinkState(0);
        if (newVal === 3) {
          this.getGroupInfo({ key: this.groupKey });
          this.getTeamCareTask({
            groupKey: this.groupKey,
            finishPercentArray: [0, 1],
            startTime: null,
            endTime: this.$moment()
              .endOf("day")
              .valueOf()
          });
        }
        this.taskObj = {
          groupKey: null,
          creatorKey: null,
          executorKey: null,
          type: "过期 / 今天 / 计划"
        };
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
        if (this.groupType == 3) {
          this.goRoom("c", that.groupInfo.groupUUID);
          /*  document.querySelector("iframe").contentWindow.postMessage(
            {
              eventName: "go-chat",
              data: {
                username: that.groupInfo.groupUUID,
                groupName: that.groupInfo.groupName,
                type: "c",
                groupLogo: that.groupInfo.groupLogo
              }
            }, ROCKET_CHAT_URL

                  // "https://im.qingtime.cn"
          );*/
        } else {
          let username = "",
            groupName = "";
          let userInfo = {};
          if (this.groupType == 1) {
            userInfo = that.user;
          } else if (this.groupType == 2) {
            userInfo = that.targetUInfo;
          }
          if (userInfo.rocketChat && userInfo.rocketChat.username) {
            username = userInfo.rocketChat.username;
            groupName = userInfo.profile.nickName;
          } else {
            username = userInfo.mobile;
            groupName = userInfo.profile.nickName;
          }
          this.goRoom("d", username);
          /*document.querySelector("iframe").contentWindow.postMessage(
            {
              eventName: "go-chat",
              data: { username: username, type: "d", groupName: groupName }
            },
            "https://im.qingtime.cn"
          );*/
        }
      }
    },
    theme: {
      handler: function(newVal, oldVal) {
        if (newVal) {
          this.themeState = newVal.backgroundImg ? 1 : 0;
          this.themeColor = newVal.backgroundColor;
          this.fontColor = newVal.fontColor;
          this.bgImg = newVal.backgroundImg;
        }
      },
      immediate: true,
      deep: true
    }
  }
};
</script>

<style>
.timeline {
  display: flex;
  flex-direction: column;
  position: relative;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
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
  height: calc(100% - 50px);
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
  /* background-color: #f3f5f8; */
  flex: 1;
  position: relative;
  overflow: auto;
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

/* .cardInfo {
  width: 300px;
  height: 100%;
  position: absolute;
  bottom: 0px;
  right: 0px;
  z-index: 6;
  border: 1px solid transparent;

} */

.contentIframe {
  width: 0px;
  height: 0px;
  position: fixed;
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
  position: fixed;
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
  position: fixed;
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
