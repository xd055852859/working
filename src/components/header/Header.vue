<template>
  <div class="header">
    <div class="head-section left-section">
      <a-Icon
        :component="logoSvg0"
        :style="{fontSize:'45px',margin:'10px 0px',cursor:'pointer'}"
        @click="setCountdown"
      />
      <!-- @click="changeHeaderIndex(10)" -->
      <!-- <div
        class="link"
        @click="changeHeader(0)"
        :style="headerIndex==0 ? { borderLeft: '3px solid #1ACA8E' } : ''"
      >
        <SvgIcon
          :iconSvg="logoSvg1"
          fontSize="40px"
          margin="10px 0px 0px 0px"
          v-if="headerIndex!=0"
        />
        <SvgIcon
          :iconSvg="logoSvg2"
          fontSize="40px"
          margin="10px 0px 0px 0px"
          v-if="headerIndex==0"
        />
      </div>-->
      <!-- 'link-tabs':headerIndex==10?true:false -->
      <!-- <div
        :class="{'link':true}"
        :style="headerIndex==9? { borderLeft: '3px solid #1ACA8E' } : ''"
        @click="changeHeader(9)"
      >
        <img :src="myGroupPng2" class="linkIcon" v-if="headerIndex==9" />
        <img :src="myGroupPng1" class="linkIcon" v-if="headerIndex!=9" />
      </div>-->
      <a-tooltip placement="right">
        <template slot="title">我的工作台</template>
        <div
          :class="{'link':true}"
          :style="headerIndex==10? { borderLeft: '3px solid #1ACA8E' } : ''"
          @click="changeHeader(10)"
        >
          <!--    @mouseenter="changeHeader(2)" -->
          <img :src="myGroupPng2" class="linkIcon" v-if="headerIndex==10" />
          <img :src="myGroupPng1" class="linkIcon" v-if="headerIndex!=10" />
        </div>
      </a-tooltip>
      <a-tooltip placement="right">
        <template slot="title">项目面板</template>
        <div
          :class="{'link':true}"
          :style="headerIndex==2? { borderLeft: '3px solid #1ACA8E' } : ''"
          @click="changeHeaderIndex(2)"
        >
          <!--    @mouseenter="changeHeader(2)" -->
          <img :src="GroupPng2" class="linkIcon" v-if="headerIndex==2" />
          <img :src="GroupPng1" class="linkIcon" v-if="headerIndex!=2" />
        </div>
      </a-tooltip>
      <a-tooltip placement="right">
        <template slot="title">联系人面板</template>
        <div
          :class="{'link':true}"
          :style="headerIndex==1? { borderLeft: '3px solid #1ACA8E' } : ''"
          @click="changeHeaderIndex(1)"
        >
          <img :src="ContactPng2" class="linkIcon" v-if="headerIndex==1" />
          <img :src="ContactPng1" class="linkIcon" v-if="headerIndex!=1" />
        </div>
      </a-tooltip>
      <a-tooltip placement="right">
        <template slot="title">聊天中心</template>
        <div
          :class="{'link':true}"
          :style="headerIndex==11? { borderLeft: '3px solid #1ACA8E' } : ''"
          @click="changeHeaderIndex(11)"
        >
          <img :src="chatPng2" class="linkIcon" v-if="headerIndex==11" />
          <img :src="chatPng1" class="linkIcon" v-if="headerIndex!=11" />
        </div>
      </a-tooltip>
      <!-- <router-link
        class="link"
        to="/subscribe"
        :style="isActive('/subscribe')?{borderLeft:'3px solid #1ACA8E'}:''"
      >
        <SvgIcon :iconSvg="subscribeSvg" :color="isActive('/subscribe')?'#1ACA8E':'#CACAD9'" />
      </router-link>-->
      <ImPerson type="left" />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import SvgIcon from "../common/SvgIcon";
import LogoSvg0 from "../common/svg/logo2.svg";
import LogoSvg1 from "../common/svg/2.svg";
import LogoSvg2 from "../common/svg/1.svg";
import myGroupPng1 from "@/assets/myGroup1.png";
import myGroupPng2 from "@/assets/myGroup2.png";
import ContactPng1 from "@/assets/contact1.png";
import ContactPng2 from "@/assets/contact2.png";
import GroupPng1 from "@/assets/group1.png";
import GroupPng2 from "@/assets/group2.png";
import chatPng1 from "@/assets/chatPng1.png";
import chatPng2 from "@/assets/chatPng2.png";
import SubscribeSvg from "../common/svg/subscribe.svg";

import BaokuSvg from "../common/svg/baoku.svg";
import ImPerson from "../leftSide/im/ImPerson";
import defaultPerson from "../../assets/defaultPerson.png";
export default {
  name: "Header",
  components: { SvgIcon, ImPerson },
  props: ["countdownState"],
  computed: mapState({
    headerIndex: (state) => state.common.headerIndex,
    user: (state) => state.auth.user,
  }),
  data() {
    return {
      logoSvg0: LogoSvg0,
      logoSvg1: LogoSvg1,
      logoSvg2: LogoSvg2,
      ContactPng1: ContactPng1,
      ContactPng2: ContactPng2,
      subscribeSvg: SubscribeSvg,
      GroupPng1: GroupPng1,
      GroupPng2: GroupPng2,
      baokuSvg: BaokuSvg,
      myGroupPng1: myGroupPng1,
      myGroupPng2: myGroupPng2,
      chatPng1: chatPng1,
      chatPng2: chatPng2,
      defaultPerson: defaultPerson,
    };
  },
  methods: {
    ...mapActions("auth", ["getTargetUserInfo"]),
    ...mapActions("group", [
      "userKeyToGroupKey",
      "setGroupType",
      "setGroupRole",
    ]),
    ...mapActions("card", [
      "setCardKey",
      "setCardDetail",
      "changeCardShowState",
      "changeCardDetailType",
      "setLinkState",
    ]),
    ...mapActions("task", ["setLabelKey"]),
    ...mapActions("common", ["changeHeaderIndex", "setFullState"]),
    setCountdown() {
      this.$emit("update:countdownState", 1);
      this.setCardKey(0);
      this.setCardDetail(null);
    },
    changeHeader(index) {
      this.changeHeaderIndex(index);
      this.contactSetGroupKey();
      this.setLinkState(0);
    },
    contactSetGroupKey() {
      this.setGroupType(1);
      this.userKeyToGroupKey({ targetUKey: this.user._key });
      this.getTargetUserInfo({ key: this.user._key });
      let username = "",
        groupName = "";
      // if (this.user.rocketChat && this.user.rocketChat.username) {
      //   username = this.user.rocketChat.username;
      //   groupName = this.user.profile.nickName;
      // } else {
      //   username = this.user.mobile;
      //   groupName = this.user.profile.nickName;
      // }
      // document.querySelector("iframe").contentWindow.postMessage(
      //   {
      //     eventName: "go-chat",
      //     data: { username: username, type: "d", groupName: groupName }
      //   },
      //   "https://im.qingtime.cn"
      // );
      this.changeCardShowState(false);
      this.changeCardDetailType(1);
      this.setCardKey(0);
      this.setGroupRole(1);
      this.setCardDetail(null);
      this.setLabelKey(0);
    },
  },
  watch: {
    headerIndex(newValue, oldValue) {
      if (newValue != oldValue) {
        if (this.countdownState == 1) {
          this.$emit("update:countdownState", 2);
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.header {
  width: 60px;
  height: 100%;
  background-color: #47475b;
  /* box-shadow: 0px 1px 6px 1px #a1c2fa; */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  color: #a1c2fa;
  position: relative;
  z-index: 5;
}
.link {
  color: #a1c2fa;
  font-weight: 800;
  width: 100%;
  height: 43px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 5px;
}
.link:hover {
  border-left: 3px solid #1aca8e;
}
.linkIcon {
  /* font-size: 28px; */
  width: 32px;
}
/* .linkIcon:hover {
  color: #1aca8e !important;
}*/
.active > .link {
  color: #ffffff;
}

a:focus {
  text-decoration: none;
}

.link:hover {
  color: #ffffff;
}
.head-section {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.link-tabs:hover {
  position: relative;
  color: transparent;
  animation: fill-text-white 2s 1.6s forwards;

  &::before {
    position: absolute;
    content: "";
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #1aca8e;
    transform: scaleX(0);
    transform-origin: left;
    animation: slide-in-out 2s cubic-bezier(0.75, 0, 0, 1) forwards;
  }
}

@keyframes slide-in-out {
  50% {
    transform: scaleX(1);
    transform-origin: left;
  }

  50.1% {
    transform-origin: right;
  }

  100% {
    transform: scaleX(0);
    transform-origin: right;
  }
}
@keyframes fill-text-white {
  to {
    color: #1aca8e;
  }
}

</style>
