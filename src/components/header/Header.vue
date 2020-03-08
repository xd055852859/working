<template>
  <div class="header">
    <div class="head-section left-section">
      <a-Icon
        :component="logoSvg0"
        :style="{fontSize:'45px',margin:'10px 0px',cursor:'pointer'}"
        @click="contactSetGroupKey()"
      />
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
      <div
        class="link"
        :style="headerIndex==2? { borderLeft: '3px solid #1ACA8E' } : ''"
        @click="changeHeader(2)"
        @mouseenter="changeHeader(2)"
      >
        <img :src="GroupPng2" class="linkIcon" v-if="headerIndex==2" />
        <img :src="GroupPng1" class="linkIcon" v-if="headerIndex!=2" />
      </div>
      <div
        class="link"
        :style="headerIndex==1? { borderLeft: '3px solid #1ACA8E' } : ''"
        @click="changeHeader(1)"
      >
        <img :src="ContactPng2" class="linkIcon" v-if="headerIndex==1" />
        <img :src="ContactPng1" class="linkIcon" v-if="headerIndex!=1" />
      </div>
      <div
        class="link"
        :style="headerIndex==3? { borderLeft: '3px solid #1ACA8E' } : ''"
        @click="changeHeader(3)"
      >
        <img :src="MessagePng2" class="linkIcon" v-if="headerIndex==3" />
        <img :src="MessagePng1" class="linkIcon" v-if="headerIndex!=3" />
      </div>
      <div
        class="link"
        :style="headerIndex==4? { borderLeft: '3px solid #1ACA8E' } : ''"
        @click="changeHeader(4)"
      >
        <img :src="SearchPng2" class="linkIcon" v-if="headerIndex==4" />
        <img :src="SearchPng1" class="linkIcon" v-if="headerIndex!=4" />
      </div>
      <!-- <router-link
        class="link"
        to="/subscribe"
        :style="isActive('/subscribe')?{borderLeft:'3px solid #1ACA8E'}:''"
      >
        <SvgIcon :iconSvg="subscribeSvg" :color="isActive('/subscribe')?'#1ACA8E':'#CACAD9'" />
      </router-link>-->
      <ImPerson />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import SvgIcon from "../common/SvgIcon";
import LogoSvg0 from "../common/svg/logo2.svg";
import LogoSvg1 from "../common/svg/2.svg";
import LogoSvg2 from "../common/svg/1.svg";
import ContactPng1 from "../common/svg/contact1.png";
import ContactPng2 from "../common/svg/contact2.png";
import MessagePng1 from "../common/svg/message1.png";
import MessagePng2 from "../common/svg/message2.png";
import GroupPng1 from "../common/svg/group1.png";
import GroupPng2 from "../common/svg/group2.png";
import SearchPng1 from "../common/svg/search1.png";
import SearchPng2 from "../common/svg/search2.png";
import SubscribeSvg from "../common/svg/subscribe.svg";
import BaokuSvg from "../common/svg/baoku.svg";
import ImPerson from "../timeline/im/ImPerson";
import { ROCKET_CHAT_URL } from "../../services/global";
export default {
  name: "Header",
  components: { SvgIcon, ImPerson },
  computed: mapState({
    headerIndex: state => state.common.headerIndex,
    user: state => state.auth.user,
    contactList: state => state.contact.contactList,
    groupList: state => state.group.groupList,
    groupState: state => state.group.groupState,
    groupKey: state => state.group.groupKey
  }),
  data() {
    return {
      logoSvg0: LogoSvg0,
      logoSvg1: LogoSvg1,
      logoSvg2: LogoSvg2,
      ContactPng1: ContactPng1,
      ContactPng2: ContactPng2,
      MessagePng1: MessagePng1,
      MessagePng2: MessagePng2,
      SearchPng1: SearchPng1,
      SearchPng2: SearchPng2,
      subscribeSvg: SubscribeSvg,
      GroupPng1: GroupPng1,
      GroupPng2: GroupPng2,
      baokuSvg: BaokuSvg
    };
  },
  methods: {
    ...mapActions("auth", ["getTargetUserInfo"]),
    ...mapActions("contact", ["changeContactShow"]),
    ...mapActions("common", ["changeHeaderIndex"]),
    ...mapActions("group", [
      "setGroupKey",
      "setCardMemberList",
      "setGroupType",
      "userKeyToGroupKey"
    ]),
    ...mapActions("card", [
      "setImpersonState",
      "setCardKey",
      "setCardContent",
      "setCardDetail",
      "changeCardShowState",
      "changeCardDetailType"
    ]),
    ...mapActions("task", ["setLabelKey"]),
    changeHeader(headerIndex) {
      this.changeHeaderIndex(headerIndex);
      // this.setImpersonState(0);
      // this.setCardKey(0);
      // this.setCardContent("");
      // this.setCardDetail({});
    },
    async contactSetGroupKey() {
      this.setGroupType(1);
      this.userKeyToGroupKey({ targetUKey: this.user._key });
      this.getTargetUserInfo({ key: this.user._key });
      let username = "";
      if (this.user.rocketChat && this.user.rocketChat.username) {
        username = this.user.rocketChat.username;
      } else {
        username = this.user.mobile;
      }
      document.querySelector("iframe").contentWindow.postMessage(
        {
          eventName: "go-chat",
          data: { username: username, type: "d" }
        },
        "https://im.qingtime.cn"
      );
      this.changeCardShowState(false);
      this.changeCardDetailType(1);
      this.setCardKey(0);
      this.setCardDetail({});
      this.setCardMemberList([]);
      this.setLabelKey(0);
    }
  }
};
</script>

<style scoped>
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
  height: 38px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
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
</style>
