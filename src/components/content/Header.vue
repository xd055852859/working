<template>
  <div :style="{ width: '100%',backgroundColor:'rgba(255,255,255,0.8)'}">
    <!-- , borderBottom: '1px solid #d5d5d5',backgroundColor:themeState?'transparent':themeColor  -->
    <a-row class="content-head">
      <a-col :span="deviceState=='phone'||deviceState=='mobile'?12:12" class="content-head-name">
        <div class="content-head-avatar">
          <img :src="groupAvatar" alt />
        </div>
        <div
          :style="{fontSize:deviceState=='phone'||deviceState=='mobile'?'16px':null,color:'#333'}"
        >{{groupName|ellipsisTitle}} {{taskObj.type?"(" + taskObj.type + ")":""}}</div>
        <!-- <div  :style="{marginLeft:'10px'}">成员活力值：316</div> -->
        <VitalityIcon :style="{height:'75%',marginLeft:'15px'}" :vitalityNum="groupNumber" />
      </a-col>
      <a-col
        :span="deviceState=='phone'||deviceState=='mobile'?4:4"
        class="content-nav"
        :style="deviceState=='phone'||deviceState=='mobile'?{justifyContent: 'flex-end' }:{ justifyContent: 'center'}"
      >
        <div
          :class="{'link-active': linkState == 0 ? true : false}"
          @click="setLinkState(0)"
          :style="{width:groupType==3?'33%':'50%'}"
        >任务</div>
        <!-- <div
          :class="{'link-active': linkState == 1 ? true : false  }"
          @click="setLinkState(1)"
          :style="deviceState=='phone'||deviceState=='mobile'?{width:'35%'}:{width:'20%'}"
        >备忘</div>-->
        <div
          :class="{ 'link-active': linkState == 1 ? true : false}"
          @click="setLinkState(1)"
          :style="{width:'33%'}"
          v-if="groupType==3"
        >文档</div>
        <div
          :class="{ 'link-active': linkState == 2 ? true : false}"
          @click="setLinkState(2)"
          :style="{width:'33%'}"
          v-if="groupType==3"
        >动态</div>
        <div
          :class="{ 'link-active': linkState == 3 ? true : false}"
          @click="setLinkState(3)"
          :style="{width:'50%'}"
          v-if="(groupType==3&&this.groupInfo&&(!this.groupInfo.enterprise||this.groupInfo.enterprise!=2))||groupType!=3"
        >日报</div>
        <div
          :class="{ 'link-active': linkState == 4 ? true : false}"
          @click="setLinkState(4)"
          :style="{width:'50%'}"
          v-if="groupType==3&&this.groupInfo&&this.groupInfo.enterprise&&this.groupInfo.enterprise==2"
        >日报</div>
        <!--  <div
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
        :span="deviceState=='phone'?8:8"
        :style="{ display: 'flex', justifyContent: 'flex-end' }"
      >
        <!-- <a-icon type="snippets" class="snippets-icon" @click="boxVisible=true" v-if="groupType==1" /> -->
        <a-tooltip placement="bottom">
          <template slot="title">随记中心</template>
          <div @click.stop="changeHeader(13)">
            <img :src="notePng" :style="{width:'23px',height:'20px',marginRight:'7px'}" />
          </div>
        </a-tooltip>
        <a-tooltip placement="bottom">
          <template slot="title">消息中心</template>
          <div @click.stop="changeHeader(3)">
            <img :src="messagePng" :style="{width:'20px',height:'22px',marginRight:'7px'}" />
          </div>
        </a-tooltip>
        <a-tooltip placement="bottom">
          <template slot="title">搜索中心</template>
          <div @click.stop="changeHeader(4)">
            <img :src="searchPng" :style="{width:'21px',height:'21px',marginRight:'7px'}" />
          </div>
        </a-tooltip>
        <a-tooltip placement="bottom">
          <template slot="title">数据中心</template>
          <div @click.stop="changeHeader(12)">
            <img :src="chartPng" :style="{width:'27px',height:'21px',marginRight:'7px'}" />
          </div>
        </a-tooltip>
        <a-tooltip placement="bottom" v-if="user">
          <template slot="title">个人中心</template>
          <div @click.stop="changeHeader(14)" class="user-avatar">
            <img :src="user.profile|defaultPerson" alt />
          </div>
        </a-tooltip>
        <!-- <div @click="toChat" class="chat-img" v-if="groupType==3">
          <img :src="chatImg" alt />
        </div>-->
        <a-icon
          type="share-alt"
          @click="openNotification"
          :style="{marginRight:'10px',color:'#000'}"
          v-if="groupType == 3"
          v-clipboard:copy="url"
          v-clipboard:success="onCopy"
          v-clipboard:error="onError"
        />
        <a-dropdown :trigger="['click']">
          <a-icon type="ellipsis" :style="{fontSize:'25px',color:'#000'}" />
          <a-menu slot="overlay">
            <a-menu-item>
              <div @click="changeHeaderIndex(5)">我的设置</div>
            </a-menu-item>
            <a-menu-item>
              <div @click="boxVisible=true">灵感盒子</div>
            </a-menu-item>
            <a-menu-item>
              <div @click.stop="changeShowThemeState(true)">主题设置</div>
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
    <!-- <div v-if="headerIndex==5" class="user-dialog">
      <UserHome />
    </div>-->
    <div class="set-container" v-if="showThemeState" @click.stop>
      <div class="set-top"></div>
      <div class="set-info">
        <div
          class="set-info-item"
          v-for="(item, index) in color1"
          :key="'color1'+index"
          :style="{backgroundColor:item,marginRight:index<7?'10px':'0px'}"
          @click="changeBgColor(item,0)"
          @mouseenter.stop="chooseKey='color1'+index"
        >
          <div class="set-color" :style="{backgroundColor:'#fff'}" v-if="chooseKey=='color1'+index"></div>
        </div>
        <div
          class="set-info-item"
          v-for="(item, index) in color2"
          :key="'color2'+index"
          :style="{backgroundColor:item,marginRight:index<7?'10px':'0px'}"
          @click="changeBgColor(item,1)"
          @mouseenter.stop="chooseKey='color2'+index"
        >
          <div class="set-color" :style="{backgroundColor:'#000'}" v-if="chooseKey=='color2'+index"></div>
        </div>
        <div
          class="set-info-item"
          v-for="(item, index) in imgArr1"
          :key="'imgArr1'+index"
          :style="{marginRight:'10px'}"
          @click="changeBgImg(index,1)"
          @mouseenter.stop="chooseKey='imgArr1'+index"
        >
          <img :src="item" alt class="set-info-img" />
          <div
            class="set-color"
            :style="{backgroundColor:'#000'}"
            v-if="chooseKey=='imgArr1'+index"
          ></div>
        </div>
        <div
          class="set-info-item"
          v-for="(item, index) in imgArr2"
          :key="'imgArr2'+index"
          :style="index%8!=0?{marginRight:'10px'}:null"
          @click="changeBgImg(index,0)"
          @mouseenter.stop="chooseKey='imgArr2'+index"
        >
          <img :src="item" alt class="set-info-img" />
          <div
            class="set-color"
            :style="{backgroundColor:'#fff'}"
            v-if="chooseKey=='imgArr2'+index"
          ></div>
        </div>
      </div>
    </div>
    <a-drawer
      title="灵感盒子"
      placement="right"
      :closable="true"
      :visible="boxVisible"
      @close="boxVisible=false"
      width="380px"
      :mask="false"
    >
      <div>
        <a-input-search
          placeholder="添加新灵感"
          size="large"
          @search="onAddIdea"
          v-model="newIdea"
          :style="{width:'95%',marginLeft:'2.5%'}"
        >
          <a-icon slot="enterButton" type="plus" />
        </a-input-search>
      </div>
      <div class="idea-container" :style="{height:ideaHeight}">
        <div v-for="(item,index) in ideaList" :key="index" class="box-container">
          <div class="box-info">
            <div
              class="box-title"
              v-if="chooseIndex!=index"
              @click="changeIdea(index,item)"
            >{{item.content}}</div>
            <div class="box-title" v-if="chooseIndex==index">
              <a-textarea
                placeholder="灵感"
                auto-size
                v-model="newContent"
                :id="'idea'+index"
                @mouseleave.native="editContent(item)"
              />
            </div>
            <!-- <div class="box-footer">
            <div class="box-name">
              <span>{{item.createTimeText}} - {{item.taskEndDateText}}</span>
              <span>{{groupType!=3&&item.groupKey!=mainGroupKey?item.groupName.length>8?item.groupName.substring(0,8)+"...":item.groupName:"" }}</span>
              <span>{{item.creatorName.length>3?item.creatorName.substring(0,3)+"...":item.creatorName}}</span>
              <span>></span>
              <span>{{item.executorName&&item.executorName.length>3?item.executorName.substring(0,3)+"...":item.executorName}}</span>
            </div>
            <div class="box-img">
              <img :src="item.executorAvatar?item.executorAvatar:defaultPerson" />
            </div>
            </div>-->
          </div>
          <a-icon
            type="copy"
            :style="{fontSize:'18px',marginRight:'5px',cursor: 'pointer'}"
            @click="copyContent(item.content)"
          />
          <a-icon
            type="delete"
            :style="{fontSize:'18px',cursor: 'pointer'}"
            @click="deleteContent(item._key)"
          />
        </div>
      </div>
    </a-drawer>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import api from "@/services/api";
import Vue from "vue";
import TaskItem from "./task/TaskItem";
import shareSvg from "../common/svg/share.svg";
import defaultMan from "../../assets/man.png";
import defaultWoman from "../../assets/woman.png";
import defaultGroup from "../../assets/defaultGroup.png";
import defaultPerson from "../../assets/defaultPerson.png";
import img1 from "../../assets/1@1x.png";
import img2 from "../../assets/2@1x.png";
import img3 from "../../assets/3@1x.png";
import img4 from "../../assets/4@1x.png";
import img5 from "../../assets/5@1x.png";
import img6 from "../../assets/6@1x.png";
import img7 from "../../assets/7@1x.png";
import img8 from "../../assets/8@1x.png";
import img9 from "../../assets/9@1x.png";
import img10 from "../../assets/10@1x.png";
// import img11 from "../../assets/11@1x.png";
import img11 from "../../assets/12@1x.png";
import img12 from "../../assets/画板.png";
import img13 from "../../assets/画板备份 17.png";
import img14 from "../../assets/画板备份 18.png";
import img15 from "../../assets/画板备份 19.png";
import img16 from "../../assets/画板备份 20.png";
import img17 from "../../assets/画板备份 21.png";
import img18 from "../../assets/画板备份 22.png";
import img19 from "../../assets/画板备份 23.png";
import img20 from "../../assets/画板备份 24.png";
import img21 from "../../assets/画板备份 25.png";
import img22 from "../../assets/画板备份 26.png";
import img23 from "../../assets/画板备份 27.png";
import img24 from "../../assets/画板备份 28.png";
import img25 from "../../assets/画板备份 29.png";
import tabSvg1 from "../common/svg/我的一天备份.svg";
import unimportant from "@/assets/unimportant.png";
import notePng from "@/assets/note.png";
import messagePng from "@/assets/message.png";
import searchPng from "@/assets/search.png";
import chartPng from "@/assets/chart.png";
import VitalityIcon from "../index/VitalityIcon";
export default {
  name: "Header",
  components: {
    // UserHome: () => import("../user/UserHome"),
    TaskItem,
    VitalityIcon,
  },
  props: [
    "themeColor",
    "changeThemeColor",
    "fontSize",
    "themeState",
    "bgImg",
    "changeThemeState",
    "changebgImg",
    "showThemeState",
    "changeThemeVisible",
    "taskObj",
  ],
  data() {
    return {
      locale: "cn",
      mainGroupKey: localStorage.getItem("mainGroupKey"),
      searchState: true,
      groupName: "",
      groupAvatar: "",
      defaultMan: defaultMan,
      defaultWoman: defaultWoman,
      defaultPerson: defaultWoman,
      defaultGroup: defaultGroup,
      shareSvg: shareSvg,
      shareTitle: "",
      url: "",
      unimportant,
      color1: [
        "#46558C",
        "#9C5D9E",
        "#C14C6B",
        "#C14F4B ",
        "#D19235",
        "#29835D",
        "#24807B",
        "#68767F",
      ],
      color2: [
        "#DFEDF9",
        "#F2E7F9",
        "#FFE3E8",
        "#F9E8DF",
        "#FAE8CD",
        "#D5F2E6",
        "#D2F1F1",
        "#E7ECF0",
      ],
      imgArr1: [img1, img2, img3, img4, img5, img6, img7],
      imgArr2: [
        img8,
        img9,
        img10,
        img11,
        img12,
        img13,
        img14,
        img15,
        img16,
        img17,
        img18,
        img19,
        img20,
        img21,
        img22,
        img23,
        img24,
        img25,
        // img26
      ],
      imgBigArr1: [
        "https://cdn-icare.qingtime.cn/1596679252768_1Big@1x.png",
        "https://cdn-icare.qingtime.cn/1596679303452_2Big@1x.png",
        "https://cdn-icare.qingtime.cn/1596679325648_3Big@1x.png",
        "https://cdn-icare.qingtime.cn/1596679342744_4Big@1x.png",
        "https://cdn-icare.qingtime.cn/1596679370095_5Big@1x.png",
        "https://cdn-icare.qingtime.cn/1596679390166_6Big@1x.png",
        "https://cdn-icare.qingtime.cn/1596679409334_7Big@1x.png",
      ],
      imgBigArr2: [
        "https://cdn-icare.qingtime.cn/1596679428976_8Big@1x.png",
        "https://cdn-icare.qingtime.cn/1596679446272_9Big@1x.png",
        "https://cdn-icare.qingtime.cn/1596679461595_10Big@1x.png",
        // "https://cdn-icare.qingtime.cn/1596679637933_11Big@1x.png",
        "https://cdn-icare.qingtime.cn/1596679674511_12Big@1x.png",
        "https://cdn-icare.qingtime.cn/1596679728933_画板.jpg",
        "https://cdn-icare.qingtime.cn/1596679825925_画板备份2.jpg",
        "https://cdn-icare.qingtime.cn/1596679850655_画板备份3.jpg",
        "https://cdn-icare.qingtime.cn/1596679867626_画板备份4.jpg",
        "https://cdn-icare.qingtime.cn/1596679885918_画板备份5.jpg",
        "https://cdn-icare.qingtime.cn/1596679903471_画板备份6.jpg",
        "https://cdn-icare.qingtime.cn/1596679925993_画板备份7.jpg",
        "https://cdn-icare.qingtime.cn/1596679943102_画板备份8.jpg",
        // "https://cdn-icare.qingtime.cn/1596679963941_画板备份9.jpg",
        "https://cdn-icare.qingtime.cn/1596679987203_画板备份10.jpg",
        "https://cdn-icare.qingtime.cn/1596680027535_画板备份11.jpg",
        "https://cdn-icare.qingtime.cn/1596680077694_画板备份12.jpg",
        "https://cdn-icare.qingtime.cn/1596680095898_画板备份13.jpg",
        "https://cdn-icare.qingtime.cn/1596680119545_画板备份14.jpg",
        "https://cdn-icare.qingtime.cn/1596679772476_画板备份.jpg",
        // imgBig26
      ],
      boxVisible: false,
      nameArr: [],
      chooseKey: "",
      boxArray: [],
      tabSvg1: tabSvg1,
      boxtitle: "",
      newContent: "",
      newIdea: "",
      chooseIndex: null,
      notePng: notePng,
      messagePng: messagePng,
      searchPng: searchPng,
      chartPng: chartPng,
      groupNumber: 0,
    };
  },
  computed: mapState({
    headerIndex: (state) => state.common.headerIndex,
    ideaList: (state) => state.common.ideaList,
    deviceState: (state) => state.common.deviceState,
    user: (state) => state.auth.user,
    targetUInfo: (state) => state.auth.targetUInfo,
    linkState: (state) => state.card.linkState,
    groupInfo: (state) => state.group.groupInfo,
    groupType: (state) => state.group.groupType,
    groupKey: (state) => state.group.groupKey,
    taskType: (state) => state.task.taskType,
    cardArray: (state) => state.task.cardArray,
    ideaHeight() {
      return document.body.clientHeight - 120 + "px";
    },
  }),
  created() {
    this.$i18n.locale = this.locale;
  },
  methods: {
    ...mapActions("common", [
      "changeHeaderIndex",
      "getIdeaList",
      "addIdea",
      "setIdeaTitle",
    ]),
    ...mapActions("card", [
      "setLinkState",
      "changeCardShowState",
      "changeCardDetailType",
      "setCardKey",
      "setCardDetail",
      "editCard",
    ]),
    ...mapActions("group", ["setCardMemberList"]),
    handleOk() {},
    changeHeader(headIndex) {
      console.log("headIndex", headIndex);
      this.changeHeaderIndex(headIndex);
    },
    onCopy() {},
    onError() {},
    toUrl() {
      window.open("https://bbs.working.vip");
    },
    changeBgColor(themeColor, fontState, chooseKey) {
      let fontColor = fontState ? "#000" : "#fff";
      this.$emit("changeThemeColor", {
        themeColor: themeColor,
        fontColor: fontColor,
      });
      this.$emit("changeThemeState", 0);
    },
    changeBgImg(index, fontState, chooseKey) {
      this.$emit("changeThemeState", 1);
      let fontColor = fontState ? "#000" : "#fff";
      // this.$emit("changeFontColor", fontColor);
      let arr = fontState ? this.imgBigArr1 : this.imgBigArr2;
      this.$emit("changebgImg", { bgImg: arr[index], fontColor: fontColor });
    },
    changeShowThemeState(showThemeState) {
      this.$emit("changeThemeVisible", showThemeState);
    },
    async onAddIdea(value) {
      await this.addIdea({
        content: value,
      });
      await this.getIdeaList({
        curPage: 1,
        perPage: 100,
      });
      this.newIdea = "";
    },
    changeIdea(index, item) {
      this.chooseIndex = index;
      this.newContent = item.content;
      this.$nextTick(() => {
        document.getElementById("idea" + index).focus();
      });
    },
    copyContent(content) {
      this.setIdeaTitle(content);
      this.$message.success("复制灵感成功");
    },
    async editContent(item) {
      let that = this;
      if (this.newContent != item.content) {
        let res = await api.auth.editIdea({
          inspirationBoxKey: item._key,
          content: that.newContent,
        });
        if (res.msg == "OK") {
          that.chooseIndex = null;
          await that.getIdeaList({
            curPage: 1,
            perPage: 100,
          });
        } else {
          that.$message.error(res.msg);
        }
      }
    },
    deleteContent(key) {
      let that = this;
      this.$confirm({
        title: "提示",
        content: "是否删除该灵感",
        async onOk() {
          let res = await api.auth.deleteIdea({
            inspirationBoxKey: key,
          });
          if (res.msg == "OK") {
            that.$message.success("删除灵感成功");
            await that.getIdeaList({
              curPage: 1,
              perPage: 100,
            });
          } else {
            that.$message.error(res.msg);
          }
        },
        onCancel() {},
      });
    },
    // chooseTodayTask(key) {
    //   this.editCard({
    //     key: key,
    //     importantStatus: 1
    //   });
    // },
    logOut() {
      // localStorage.clear();
      localStorage.clear();
      // document.querySelector("iframe").contentWindow.postMessage(
      //   {
      //     eventName: "im-logout"
      //   },
      //   "https://im.qingtime.cn"
      // );
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
            : this.user.profile.gender == 0
            ? defaultMan
            : defaultWoman;
        this.groupName =
          this.user && this.user.profile.nickName
            ? this.user.profile.nickName + " 工作台"
            : "";
        // this.groupNumber =
        //   this.user && this.user.profile.nickName
        //     ? this.user.profile.nickName + " 工作台"
        //     : 0;
      } else if (groupType == 2) {
        this.groupAvatar =
          this.targetUInfo && this.targetUInfo.avatar
            ? this.targetUInfo.avatar
            : this.targetUInfo.gender == 0
            ? defaultMan
            : defaultWoman;
        this.groupNumber = this.targetUInfo
          ? this.targetUInfo.energyValueTotal
          : 0;
      } else if (groupType == 3) {
        this.groupAvatar =
          this.groupInfo && this.groupInfo.groupLogo
            ? this.groupInfo.groupLogo
            : defaultGroup;
        this.groupName = this.groupInfo
          ? this.groupInfo.groupName.split("___")[0]
          : 0;
        this.groupNumber = this.groupInfo ? this.groupInfo.energyValueTotal : 0;
      }
    },
    toBootPage() {
      localStorage.setItem("loginState", "back");
      this.$router.push("/bootpage");
    },
    openNotification() {
      this.$notification.open({
        message: "分享链接",
        duration: 10,
        description: "复制链接成功," + this.shareTitle,
        onClick: () => {
          console.log("Notification Clicked!");
        },
      });
    },
    //打开聊天
    toChat() {
      let url = "";
      // if (this.groupType == 3) {
      //   url =
      //     "cheerchat://chat.qingtime.cn/channel/" + this.groupInfo.groupUUID;
      // }
      // else {
      //   url =
      //     "cheerchat://chat.qingtime.cn/channel/" + this.groupInfo.groupUUID;
      // }
      let windowState = null;
      windowState = window.open(
        "http://cheerchat.qingtime.cn/download?cheerchat://chat.qingtime.cn/channel/" +
          this.groupInfo.groupUUID
      );
    },
  },
  watch: {
    user: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.getName(this.groupType);
        }
      },
      immediate: true,
      deep: true,
    },
    groupInfo: {
      handler(newVal) {
        if (newVal) {
          this.groupAvatar = newVal.groupLogo ? newVal.groupLogo : defaultGroup;
          this.groupName = newVal.groupName.split("___")[0];
          this.groupNumber = newVal ? newVal.energyValueTotal : 0;
          this.shareTitle =
            "分享链接:https://working.vip/?group=" + this.groupKey;
          this.url = "https://working.vip/?group=" + this.groupKey;
          this.url +=
            newVal.password && newVal.isHasPassword
              ? ",口令为" + newVal.password
              : "";
          this.password = newVal.password;
          newVal.password && newVal.isHasPassword
            ? (this.shareTitle = this.shareTitle + ",口令为" + newVal.password)
            : null;
        }
      },
      immediate: true,
      deep: true,
    },
    targetUInfo: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.groupAvatar = this.user
            ? newVal.avatar
            : newVal.gender == 0
            ? defaultMan
            : defaultWoman;
          this.groupName = newVal.nickName + " 工作台";
          this.groupNumber = newVal ? newVal.energyValueTotal : 0;
        }
      },
      immediate: true,
      deep: true,
    },
    groupType: {
      handler(newVal, oldVal) {
        if (newVal !== oldVal && newVal) {
          switch (newVal) {
            case 1:
              this.nameArr = [
                "今日",
                "重要",
                "我相关任务",
                "指派给我",
                "我指派的",
                "备忘",
              ];
              break;
            case 2:
              this.nameArr = ["今日", "重要", "他相关任务"];
              break;
            case 3:
              this.nameArr = [
                "今日",
                "重要",
                "我相关任务",
                "指派给我",
                "我指派的",
                "备忘",
                "全部任务",
              ];
              break;
            default:
              null;
          }
          this.getName(newVal);
        }
      },
      immediate: true,
    },
    groupKey(newVal, oldVal) {
      if (newVal !== oldVal && newVal && this.user) {
        this.getName(this.groupType);
      }
    },
    linkState(newVal, oldVal) {
      if (oldVal != newVal) {
        this.setCardKey(0);
        this.setCardDetail(null);
        this.changeCardShowState(false);
        this.changeCardDetailType(1);
        // this.setCardMemberList([]);
      }
    },
    cardArray: {
      handler(newVal, oldVal) {
        if (newVal) {
          let arr = this._.sortBy(newVal, "createTime").reverse();
          const startTime = this.$moment().startOf("day").valueOf();
          const endTime = this.$moment().endOf("day").valueOf();
          this.boxArray = arr.filter((item) => {
            if (
              !(
                (item.todayTaskTime > startTime &&
                  item.todayTaskTime <= endTime) ||
                (item.createTime > startTime && item.createTime <= endTime)
              )
            ) {
              item.createTimeText = this.$moment(item.createTime).format(
                "MM-DD"
              );
              item.taskEndDateText = this.$moment(item.taskEndDateText).format(
                "MM-DD"
              );
              item.checked = false;
              return item;
            }
          });
        }
      },
      immediate: true,
      deep: true,
    },
    boxVisible(newVal, oldVal) {
      if (oldVal != newVal && newVal) {
        this.getIdeaList({
          curPage: 1,
          perPage: 100,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.content-head {
  width: 100%;
  height: 45px;
  padding: 0px 20px;
  /* display: flex;
  flex-direction: column;
  justify-content: center; */
}
.content-head > div {
  height: 100%;
  font-size: 18px;
  // color: #23384b;
  display: flex;
  align-items: center;
}
.content-head .content-head-name {
  display: flex;
  align-items: center;
  font-size: 20px;
  // color: #23384b;
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
  color: #949ea6;
}
.content-head .content-nav > div {
  width: 114px;
  height: 47px;
  line-height: 47px;
  text-align: center;
  font-size: 14px;
  // color: #23384b;
  cursor: pointer;
  /* background: #1aca8e;
  border: 1px solid #1aca8e; */
  /* border-radius: 6px 0px 0px 6px; */
}
.content-head .content-nav .link-active {
  border-bottom: 3px solid #333;
  color: #333;
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

.user-dialog {
  position: fixed;
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
.set-icon {
  position: fixed;
  right: 60px;
}
.snippets-icon {
  position: fixed;
  right: 55px;
}
.set-container {
  // height: 200px;
  width: 355px;
  position: fixed;
  background: #ffffff;
  border: 1px solid #f2f2f2;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.33);
  top: 60px;
  right: 110px;
  z-index: 7;
  border-radius: 5px;
  padding: 13px;
  box-sizing: border-box;
}
.set-top {
  height: 0px;
  width: 0px;
  position: absolute;
  right: -20px;
  top: 20px;
  border-top: 10px solid transparent;
  border-left: 10px solid #fff;
  border-right: 10px solid transparent;
  border-bottom: 10px solid transparent;
  z-index: 8;
}
.set-info {
  display: flex;
  flex-wrap: wrap;
}
.set-info-item {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  margin-bottom: 13px;
  position: relative;
}
.set-info-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.set-color {
  width: 12px;
  height: 12px;
  position: absolute;
  top: 10px;
  left: 10px;
  border-radius: 50%;
  z-index: 5;
}
.box-container {
  width: calc(100% - 3px);
  min-height: 60px;
  padding: 6px 5px;
  /* box-sizing: border-box; */
  margin-bottom: 2px;
  background-color: rgba(255, 255, 255, 0.95);
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e7e7e7;
}
.box-info {
  width: 90%;
  display: flex;
  flex-wrap: wrap;
  align-content: space-between;
}
.box-title {
  width: 100%;
  min-height: 40px;
}
.box-footer {
  display: flex;
}
.box-name {
  cursor: pointer;
  font-size: 12px;
  color: #8091a0;
  display: flex;
  align-items: center;
}
.box-name span {
  margin-left: 5px;
}
.box-img {
  width: 18px;
  height: 18px;
  overflow: hidden;
  border-radius: 50%;
  /* margin-top: 6px;
  margin-right: 5px; */
  margin-left: 5px;
}
.box-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  margin-top: -5px;
}
.idea-container {
  padding: 0px 2.5%;
  box-sizing: border-box;
  overflow: auto;
}
.chat-img {
  height: 30px;
  width: 30px;
  overflow: hidden;
  margin-right: 10px;
  cursor: pointer;
}
.chat-img img {
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.user-avatar {
  width: 30px;
  height: 30px;
  overflow: hidden;
  border-radius: 50%;
  margin-right: 5px;
}
.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>

