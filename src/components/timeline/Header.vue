<template>
  <div :style="{ width: '100%', borderBottom: '1px solid #d5d5d5' }">
    <a-row class="content-head">
      <a-col :span="deviceState=='phone'?16:5" class="content-head-name">
        <div class="content-head-avatar">
          <img :src="groupAvatar" alt />
        </div>
        {{groupName}}
      </a-col>
      <a-col
        :span="deviceState=='phone'?5:14"
        class="content-nav"
        :style="deviceState=='phone'?{justifyContent: 'flex-end' }:{ justifyContent: 'center'}"
      >
        <div
          :class="{'link-active': linkState == 0 ? true : false }"
          @click="setLinkState(0)"
          :style="deviceState=='phone'?{width:'45%'}:{width:'20%'}"
        >任务</div>
        <div
          :class="{'link-active': linkState == 1 ? true : false }"
          @click="setLinkState(1)"
          :style="deviceState=='phone'?{width:'45%'}:{width:'20%'}"
        >备忘</div>
        <!-- <div
          :class="{ link: true, 'link-active': linkState == 2 ? true : false }"
          @click="setLinkState(2)"
        >脑图</div>
        <div
          :class="{ link: true, 'link-active': linkState == 3 ? true : false }"
          @click="setLinkState(3)"
        >知识库</div>
        <div
          :class="{ link: true, 'link-active': linkState == 4 ? true : false }"
          @click="setLinkState(4)"
        >群文件</div>
        <div
          :class="{ link: true, 'link-active': linkState == 5 ? true : false }"
          @click="setLinkState(5)"
        >群相册</div>-->
      </a-col>
      <a-col
        :span="deviceState=='phone'?3:5"
        :style="{ display: 'flex', justifyContent: 'flex-end' }"
      >
        <a-dropdown>
          <a-icon type="ellipsis" :style="{fontSize:'25px'}" />
          <a-menu slot="overlay">
            <a-menu-item>
              <div @click="changeHeaderIndex(5)">我的设置</div>
            </a-menu-item>
            <a-menu-item>
              <div @click="toUrl">进入官网</div>
            </a-menu-item>
            <a-menu-item>
              <div @click="toBootPage()">返回首页</div>
            </a-menu-item>
            <a-menu-item>
              <div @click="logOut">退出</div>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </a-col>
    </a-row>
    <div></div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Vue from "vue";
import UserHome from "../user/UserHome";
import SvgIcon from "../common/SvgIcon";
import BackSvg from "../common/svg/back.svg";
import AccountSvg from "../common/svg/account.svg";
import defaultPerson from "../../assets/defaultPerson.png";
import defaultGroup from "../../assets/defaultGroup.png";
export default {
  name: "Header",
  components: { SvgIcon, UserHome },
  data() {
    return {
      locale: "cn",
      searchState: true,
      groupName: "",
      groupAvatar: "",
      accountSvg: AccountSvg,
      backSvg: BackSvg,
      defaultPerson: defaultPerson,
      defaultGroup: defaultGroup
    };
  },
  computed: mapState({
    headerIndex: state => state.common.headerIndex,
    user: state => state.auth.user,
    targetUInfo: state => state.auth.targetUInfo,
    linkState: state => state.card.linkState,
    groupInfo: state => state.group.groupInfo,
    groupType: state => state.group.groupType,
    groupKey: state => state.group.groupKey,
    deviceState: state => state.common.deviceState
  }),
  created() {
    this.$i18n.locale = this.locale;
  },
  methods: {
    ...mapActions("common", ["changeHeaderIndex"]),
    ...mapActions("card", [
      "setLinkState",
      "changeCardShowState",
      "changeCardDetailType",
      "setCardKey",
      "setCardDetail"
    ]),
    ...mapActions("group", ["setCardMemberList"]),
    handleOk() {},
    changeHeader(headIndex) {
      this.changeHeaderIndex(headIndex);
    },
    toUrl() {
      window.open("http://bbs.working.vip");
    },
    logOut() {
      // localStorage.clear();
      localStorage.clear();
      document.querySelector("iframe").contentWindow.postMessage(
        {
          eventName: "im-logout"
        },
        "https://im.qingtime.cn"
      );
      this.$socket.emit("logout", this.user._key);
      this.$message.success("退出登录成功");
      this.$router.push("/bootpage");
      // const redirect = `${window.location.protocol}//${window.location.host}`;
      // window.location.href = `https://account.qingtime.cn?apphigh=27&redirect=${redirect}`;
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
    },
    toBootPage() {
      localStorage.setItem("loginState", "back");
      this.$router.push("/bootpage");
    }
  },
  watch: {
    user: {
      handler(newVal, oldVal) {
        if (oldVal === null && newVal) {
          this.getName(this.groupType);
        }
      },
      immediate: true
    },
    groupInfo: {
      handler(newVal) {
        if (newVal) {
          this.groupAvatar = newVal.groupLogo ? newVal.groupLogo : defaultGroup;
          this.groupName = newVal.groupName.split("___")[0];
        }
      },
      immediate: true,
      deep: true
    },
    targetUInfo: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.groupAvatar = this.user ? newVal.avatar : defaultPerson;
          this.groupName = newVal.nickName + " 工作台";
        }
      },
      immediate: true,
      deep: true
    },
    groupType(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.getName(newVal);
      }
    },
    groupKey(newVal, oldVal) {
      if (newVal !== oldVal && newVal) {
        this.getName(this.groupType);
      }
    },
    linkState(newVal, oldVal) {
      if (oldVal !== newVal) {
        this.changeCardShowState(false);
        this.changeCardDetailType(1);
        this.setCardKey(0);
        this.setCardDetail({});
        // this.setCardMemberList([]);
      }
    }
  }
};
</script>

<style scoped>
.content-head {
  width: 100%;
  height: 45px;
  background: #ffffff;
  padding: 0px 20px;
  /* display: flex;
  flex-direction: column;
  justify-content: center; */
}
.content-head > div {
  height: 100%;
  font-size: 18px;
  color: #23384b;
  display: flex;
  align-items: center;
}
.content-head .content-head-name {
  display: flex;
  align-items: center;
  font-size: 20px;
  color: #23384b;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.content-head-avatar {
  width: 35px;
  height: 35px;
  overflow: hidden;
  border-radius: 50%;
  margin-right: 10px;
}
.content-head-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.content-nav {
  display: flex;
}
.content-head .content-nav > div {
  width: 114px;
  height: 47px;
  line-height: 47px;
  text-align: center;
  font-size: 14px;
  color: #23384b;
  cursor: pointer;
  /* background: #1aca8e;
  border: 1px solid #1aca8e; */
  /* border-radius: 6px 0px 0px 6px; */
}
.content-head .content-nav .link-active {
  border-bottom: 3px solid #1aca8e;
  color: #1aca8e;
}
/* .content-head .content-nav > div:nth-child(1) {
  border-radius: 6px 0px 0px 6px;
} */
/* .content-head .content-nav > div:nth-child(2) {
  border-left: 0px;
}
.content-head .content-nav > div:nth-child(3) {
  border-left: 0px;
  border-right: 0px;
}
.content-head .content-nav > div:nth-child(6) {
  border: 1px solid #d5d5d5;
  border-radius: 0px 6px 6px 0px;
} */
/* .content-head .content-nav > div:nth-child(2) {
  border: 1px solid #d5d5d5;
  border-radius: 0px 6px 6px 0px;
} */
</style>

