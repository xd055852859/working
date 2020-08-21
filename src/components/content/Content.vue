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
        <GroupDiary v-if="linkState === 4" v-on="$listeners" v-bind="$attrs" :fontColor="fontColor"  />
      </div>
     
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
// import Naotu from "./content/Naotu";
// import KnowledgeBase from "./content/KnowledgeBase";
// import GroupFile from "./content/GroupFile";
// import GroupAlbum from "./content/GroupAlbum";
export default {
  name: "Timeline",
  components: {
    Header: () => import("./Header"),
    Card: () => import("./card/Card"),
    Task: () => import("./task/Task"),
    Invite: () => import("../Invite"),
    Calendar: () => import("./canlendar/index"),
    TaskView: () => import("./TaskView"),
    GroupData: () => import("./GroupData"),
    FileData: () => import("./FileData"),
    Diary: () => import("./Diary"),
    GroupDiary: () => import("./GroupDiary"),
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
        "#F3E5FF",
      ],
      msgItem: [
        "建议功能",
        "强烈建议",
        "错误",
        "严重错误",
        "致命错误",
        "顶级优先",
      ],
    };
  },
  data() {
    return {
      state: true,
      chatUrl: "",
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
        type: "过期 / 今天 / 已完成",
      },
    };
  },
  computed: {
    ...mapState({
      // showState: state => state.common.showState,
      headerIndex: (state) => state.common.headerIndex,
      user: (state) => state.auth.user,
      targetUInfo: (state) => state.auth.targetUInfo,
      groupKey: (state) => state.group.groupKey,
      linkState: (state) => state.card.linkState,
      groupType: (state) => state.group.groupType,
      groupInfo: (state) => state.group.groupInfo,
      inviteState: (state) => state.group.inviteState,
      inviteKey: (state) => state.group.inviteKey,
      theme: (state) => state.auth.theme,
      deviceState: (state) => state.common.deviceState,
    }),
  },
  mounted() {
    if (localStorage.getItem("groupKey")) {
      this.setGroupKey(localStorage.getItem("groupKey"));
    }
    if (localStorage.getItem("groupType")) {
      this.setGroupType(parseInt(localStorage.getItem("groupType")));
    }
    if (this.user) {
      // "https://im.qingtime.cn/#/?token=" + localStorage.getItem("token");
      if (this.groupType == 3) {
        this.getGroupInfo({ key: this.groupKey });
      } else if (this.groupType == 2) {
        this.getTargetUserInfo({ key: localStorage.getItem("userKey") });
      }
      if (localStorage.getItem("inviteKey")) {
        this.$router.push("/");
        this.setInviteState(true);
        this.setInviteKey(localStorage.getItem("inviteKey"));
        this.getInviteInfo({
          key: localStorage.getItem("inviteKey"),
        });
        // this.setGroupType(3);
        localStorage.removeItem("inviteKey");
      }
      if (localStorage.getItem("shareKey")) {
        this.$router.push("/");
        this.setCardKey(parseInt(localStorage.getItem("shareKey")));
        this.changeCardShowState(true);
        this.changeCardDetailType(1);
        localStorage.removeItem("shareKey");
      }
      if (localStorage.getItem("groupUUId")) {
        this.$router.push("/");
        this.getGroupInfoAccordingUUID({
          uuid: localStorage.getItem("groupUUId"),
        });
        // this.setGroupType(3);
        localStorage.removeItem("groupUUId");
      }
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
      "getInviteInfo",
      "getGroupInfoAccordingUUID",
      "getGroupMember",
    ]),
    ...mapActions("card", [
      "setCardKey",
      "changeCardShowState",
      "changeCardDetailType",
      "setLinkState",
    ]),
    ...mapActions("countdown", ["getTeamCareTask"]),
    changeHeader() {
      this.headerIndex != 10 ? this.changeHeaderIndex(0) : null;
      this.showThemeState = false;
    },
    /**
     * 聊天监听事件
     */
    changeBgColor(theme) {
      this.themeColor = theme.themeColor;
      this.fontColor = theme.fontColor;
      // theme
      this.setTheme({
        configInfo: {
          backgroundColor: this.themeColor,
          fontColor: this.fontColor,
          backgroundImg: "",
        },
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
          backgroundImg: this.bgImg,
        },
      });
    },
    changeThemeShowState(showThemeState) {
      this.showThemeState = showThemeState;
    },

    /*
     * chat.qingtime.cn 的跳转方法
     * */
  },

  watch: {
    user: {
      handler: function (newVal, oldVal) {
        if (this.groupType == 3) {
          this.getGroupInfo({ key: this.groupKey });
          this.getTeamCareTask({
            groupKey: this.groupKey,
            finishPercentArray: [0, 1],
            startTime: null,
            endTime: this.$moment().endOf("day").valueOf(),
          });
        } else if (this.groupType == 2) {
          this.getTargetUserInfo({ key: localStorage.getItem("userKey") });
        }
        // 获取到用户信息
        if (localStorage.getItem("inviteKey")) {
          this.$router.push("/");
          this.setInviteState(true);
          this.setInviteKey(localStorage.getItem("inviteKey"));
          this.getInviteInfo({
            key: localStorage.getItem("inviteKey"),
          });
          this.setGroupType(3);
          localStorage.removeItem("inviteKey");
        }
        if (localStorage.getItem("shareKey")) {
          this.$router.push("/");
          this.setCardKey(parseInt(localStorage.getItem("shareKey")));
          this.changeCardShowState(true);
          this.changeCardDetailType(1);
          localStorage.removeItem("shareKey");
        }
        if (localStorage.getItem("groupUUId")) {
          this.$router.push("/");
          this.getGroupInfoAccordingUUID({
            uuid: localStorage.getItem("groupUUId"),
          });
          this.setGroupType(3);
          localStorage.removeItem("groupUUId");
        }
      },
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
            endTime: this.$moment().endOf("day").valueOf(),
          });
        }
        this.taskObj = {
          groupKey: null,
          creatorKey: null,
          executorKey: null,
          type: "过期 / 今天 / 已完成",
        };
        this.getGroupMember({ groupId: newVal });
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
            endTime: this.$moment().endOf("day").valueOf(),
          });
        }
        this.taskObj = {
          groupKey: null,
          creatorKey: null,
          executorKey: null,
          type: "过期 / 今天 / 已完成",
        };
      }
    },
    inviteKey: {
      handler: function (newVal, oldVal) {
        if (oldVal != newVal && this.user && newVal) {
          this.getInviteInfo({ key: newVal });
        }
      },
      immediate: true,
    },
    theme: {
      handler: function (newVal, oldVal) {
        if (newVal) {
          this.themeState = newVal.backgroundImg ? 1 : 0;
          this.themeColor = newVal.backgroundColor;
          this.fontColor = newVal.fontColor;
          this.bgImg = newVal.backgroundImg;
        }
      },
      immediate: true,
      deep: true,
    },
  },
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
</style>
