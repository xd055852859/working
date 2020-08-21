<template>
  <div
    class="cardInfo"
    :style="deviceState=='phone'||deviceState=='mobile'?{width:'100%',height:'100%'}: {boxShadow: '-3px 2px 6px rgba(0, 0, 0, 0.2)'}"
  >
    <!-- <div class="cardInfo-nav" :style="groupType!=2?{ width:'309px'}:{width:'361px'}"> -->
    <div class="cardInfo-nav">
      <!-- <a-button type="primary" class>保存</a-button> -->
      <a-icon type="close" class="cardInfo-nav-close" @click="cancelCardInfo" />
      <div class="cardInfo-nav-info" v-if="cardDetailType!=0">
        <div class="phoneTask-nav-avatar">
          <img :src="cardDetail.executorAvatar?cardDetail.executorAvatar:cardDetail.creatorAvatar" />
        </div>
        <div
          class="phoneTask-nav-nickName"
        >{{cardDetail.executorName?cardDetail.executorName:cardDetail.creatorName?cardDetail.creatorName:''}}</div>
      </div>
      <div @click="toChat" class="chat-img">
        <img :src="chatImg" alt />
      </div>
      <a-icon
        :component="shareSvg"
        @click="openNotification"
        v-clipboard:copy="cardTitle"
        :style="{marginRight:'25px'}"
      />

      <!-- <a-icon class="cardInfo-nav-save" type="upload" />
      <a-icon class="cardInfo-nav-ellipsis" type="ellipsis" />-->

      <button v-if="cardDetailType==2" @click="saveCard()" class="cardInfo-nav-save btn">保 存</button>
      <!--    class="cardInfo-nav-save btn btn-pink btn-bubbles" -->
      <!-- <a-button type="success" @click="saveCard()" class="cardInfo-nav-save btn">保 存</a-button> -->
    </div>
    <!-- <div class="cardInfo-tab">
      <div class="cardInfo-info-title">卡片类型</div>
      <a-dropdown class="cardInfo-info-input" :disabled="cardDetailType==1?true:false">
        <a-menu slot="overlay" @click="handleCardClick" :style="{width:'100%'}">
          <a-menu-item v-for="(item,index) in cardTypeArr" :key="index">{{item}}</a-menu-item>
        </a-menu>
        <a-button :style="{marginLeft:'8px',fontSize: '12px',color:'#8091a0'}">
          {{cardTypeArr[cardTypeIndex]}}
          <a-icon type="down" v-if="cardDetailType!=1" />
        </a-button>
      </a-dropdown>
    </div>-->
    <div class="cardInfo-tab cardInfo-tab-input">
      <div class="cardInfo-info-title">标题</div>
      <a-textarea
        placeholder="请输入标题"
        v-model="simpleTitle"
        :disabled="cardDetailType==1?true:false"
        :autosize="{minRows: 1}"
      />
    </div>
    <div class="cardInfo-tab">
      <div class="cardInfo-info-title">起日期</div>
      <a-date-picker @change="changeCreateTime" :value="createTime" :style="{marginRight:'10px'}" />
    </div>
    <div class="cardInfo-tab">
      <div class="cardInfo-info-title">止日期</div>
      <a-date-picker @change="changeEndTime" :value="endTime" />
    </div>
    <div class="cardInfo-tab">
      <div class="cardInfo-info-title">类型</div>
      <a-dropdown class="cardInfo-info-input" :disabled="cardDetailType==1?true:false">
        <a-menu slot="overlay" @click="handleTaskClick" :style="{width:'100%'}">
          <a-menu-item
            v-for="(item,index) in taskTypeArr"
            :key="index"
            class="cardInfo-info-taskType"
            :style="{color:color[index],backgroundColor:backgroundColor[index],}"
          >{{item.name}}</a-menu-item>
        </a-menu>
        <div
          class="cardInfo-info-taskType"
          :style="{marginLeft:'8px',color:color[taskTypeIndex],backgroundColor:backgroundColor[taskTypeIndex]}"
        >
          {{taskTypeArr[taskTypeIndex].name}}
          <a-icon type="down" v-if="cardDetailType!=1" />
        </div>
      </a-dropdown>
    </div>
    <div class="cardInfo-tab" :style="{height:'auto'}">
      <div class="cardInfo-info-title">指派人</div>
      <ImPerson type="cardInfo" />
    </div>
    <!-- <div class="cardInfo-tab" v-if="cardTypeIndex==1">
        <div class="cardInfo-info-title">添加任务</div>
    </div>-->

    <Editor :editorType="'cardInfo'" />
    <div class="cardInfo-info">
      <!-- <div class="cardInfo-tab" v-if="cardTypeIndex==1">
        <div class="cardInfo-info-title">进度状态</div>
        <a-icon
          :component="loading1"
          :style="{margin:'0px 8px 0px 0px',fontSize: '22px'}"
          @click="cardDetailType!=1?finishPercent=0:null"
          v-if="finishPercent!=0"
        />
        <a-icon
          :component="loading4"
          :style="{margin:'0px 8px 0px 0px',fontSize: '22px' }"
          v-if="finishPercent==0"
        />
        <a-icon
          :component="loading2"
          :style="finishPercent!=1?{margin:'0px 8px 0px 0px',fontSize: '18px',color: '#555' }:{margin:'0px 8px 0px 0px',fontSize: '20px',color: '#1aca8e' }"
          @click="cardDetailType!=1?finishPercent=1:null"
        />
        <a-icon
          :component="loading3"
          :style="finishPercent!=2?{margin:'0px 8px 0px 0px',fontSize: '18px',color: '#555' }:{margin:'0px 8px 0px 0px',fontSize: '20px',color: '#1aca8e' }"
          @click="cardDetailType!=1?finishPercent=2:null"
        />
      </div>-->
      <!-- <div class="cardInfo-tab" v-if="cardTypeIndex==1">
        <div class="cardInfo-info-title">截止或提醒日期</div>
        <a-range-picker
          @change="onChange"
          :style="{fontSize:'12px'}"
          :disabled="cardDetailType==1?true:false"
        />
      </div>-->
      <!-- <div class="cardInfo-tab">
        <div class="cardInfo-info-title">公开属性</div>
        <a-dropdown class="cardInfo-info-input" :disabled="cardDetailType==1?true:false">
          <a-menu slot="overlay" @click="handleOpenClick" :style="{width:'100%'}">
            <a-menu-item :key="0">不公开</a-menu-item>
            <a-menu-item :key="1">公开</a-menu-item>
          </a-menu>
          <a-button style="margin-left: 8px">
            {{isOpen?"公开":"不公开"}}
            <a-icon type="down" v-if="cardDetailType!=1" />
          </a-button>
        </a-dropdown>
      </div>-->
    </div>
    <a-tabs
      :activeKey="activeKey"
      @change="changeContact"
      v-if="this.cardDetailType == 1 || this.cardDetailType == 2"
    >
      <a-tab-pane :tab="'评论('+cardCommentTotal+')'" :key="1">
        <div class="cardInfo-commentScroll" @scroll="scrollCommentLoading">
          <div
            v-for="(item,index) in commentList"
            :key="index"
            @mouseenter="setReplyIndex(index)"
            :style="{marginBottom:'10px'}"
          >
            <CommentItem
              :commentItem="item"
              :commentTargetIndex="index"
              :replyState="replyIndex==index"
              @changeCommentReply="changeCommentReply"
            />
            <div class="replyComment" v-if="item.replyContent">
              <span class="replyComment-name">{{item.replyetc.name}}:</span>
              {{item.replyContent}}
            </div>
          </div>
        </div>
        <!-- <a-pagination
          v-model="page"
          :total="cardCommentTotal"
          :pageSize="10"
          @change="onPageChange"
          size="small"
          :style="{float:'right',margin:'5px'}"
          v-if="cardCommentTotal>0"
        />-->
      </a-tab-pane>
      <a-tab-pane :tab="'历史('+cardHistoryTotal+')'" :key="2" forceRender>
        <div @scroll="scrollHistoryLoading" class="cardInfo-commentScroll">
          <div
            v-for="(item,index) in cardHistoryList"
            :key="index"
            :style="{marginBottom:'17px'}"
            class="comment-historyLog"
          >{{item.log}}</div>
        </div>
        <!-- <a-pagination
          v-model="historyPage"
          :total="cardHistoryTotal"
          :pageSize="10"
          @change="onPageHistoryChange"
          size="small"
          :style="{float:'right',margin:'5px'}"
          v-if="cardHistoryTotal>0"
        />-->
      </a-tab-pane>
    </a-tabs>
    <!-- <div class="comment-input" :style="groupType!=2?{ width:'309px'}:{width:'361px'}"> -->
    <div
      class="comment-input"
      :style="deviceState=='phone'||deviceState=='mobile'?{width:(deviceWidth- 60)+'px',left:'60px'}:null"
    >
      <a-input
        placeholder="说一句"
        v-model="commentInput"
        :style="{width:'95%'}"
        @keyup.enter="saveCommentMsg"
      ></a-input>
      <!-- <div
        class="add-button flex-center"
        @click="saveCommentMsg"   
        ref="searchButton"
      >
        <a-button>评论</a-button>
      </div>-->
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Vue from "vue";
import Editor from "../../common/Editor";
import CommentItem from "./CommentItem";
import ImPerson from "../../leftSide/im/ImPerson";
import chatImg from "@/assets/chat.png";
// import {
//   DatePicker,
//   Input,
//   message,
//   Pagination,
//   Menu,
//   Dropdown,
//   Button,
//   Tabs,
//   Modal,
//   Popconfirm
// } from "ant-design-vue";
import loading1 from "../../common/svg/圆形.svg";
import loading4 from "../../common/svg/圆形 (1).svg";
import loading2 from "../../common/svg/进度6.svg";
import loading3 from "../../common/svg/进度8.svg";
import SvgIcon from "../../common/SvgIcon";
import shareSvg from "../../common/svg/share.svg";
import api from "@/services/api";
// import defaultPerson from "../../../assets/defaultPerson.png";
// Vue.use(DatePicker);
// Vue.use(Input);
// Vue.use(Pagination);
// Vue.use(Dropdown);
// Vue.use(Menu);
// Vue.use(Button);
// Vue.use(Tabs);
// Vue.use(Modal);
// Vue.use(Popconfirm);

export default {
  name: "cardInfo",
  components: { Editor, CommentItem, SvgIcon, ImPerson },
  // props: ["cardTypeIndex"],
  data() {
    return {
      loading1: loading1,
      loading2: loading2,
      loading3: loading3,
      loading4: loading4,
      shareSvg: shareSvg,
      chatImg: chatImg,
      commentInput: "",
      cardTypeArr: [
        "常规卡片",
        "任务",
        // "文章",
        // "简单标题",
        // "外部链接",
        // "内部链接",
        // "媒体",
        // "文件",
        // "名片"
      ],
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
      taskTypeArr: [
        { name: "建议", id: 1 },
        { name: "强烈建议", id: 2 },
        { name: "错误", id: 3 },
        { name: "严重错误", id: 4 },
        { name: "致命错误", id: 5 },
        { name: "顶级优先", id: 10 },
      ],
      taskTypeIndex: 0,
      cardTypeIndex: 1,
      simpleTitle: "",
      title: "",
      content: "",
      isOpen: "",
      taskEndDate: "",
      taskType: "",
      executorKey: "",
      isOpen: 0,
      replyIndex: 0,
      commentIndex: "",
      memberList: [],
      finishPercent: 0,
      page: 1,
      historyPage: 1,
      activeKey: 1,
      cardTitle: "",
      createTime: null,
      endTime: null,
    };
  },
  computed: mapState({
    groupMemberList: (state) => state.group.groupMemberList,
    mainGroupMemberList: (state) => state.group.mainGroupMemberList,
    groupKey: (state) => state.group.groupKey,
    groupType: (state) => state.group.groupType,
    cardDetail: (state) => state.card.cardDetail,
    cardKey: (state) => state.card.cardKey,
    cardType: (state) => state.card.cardType,
    cardDetailType: (state) => state.card.cardDetailType,
    cardContent: (state) => state.card.cardContent,
    cardHistoryList: (state) => state.card.cardHistoryList,
    commentList: (state) => state.comment.commentList,
    cardCommentTotal: (state) => state.comment.cardCommentTotal,
    cardHistoryTotal: (state) => state.comment.cardHistoryTotal,
    cardChooseFollowArr: (state) => state.card.cardChooseFollowArr,
    labelKey: (state) => state.task.labelKey,
    deviceState: (state) => state.common.deviceState,
    deviceWidth: (state) => state.common.deviceWidth,
  }),
  mounted() {
    if (!this.cardDetail) {
      this.getCardDetail({ cardKey: this.cardKey });
    }
    if (
      (this.cardDetailType == 1 || this.cardDetailType == 2) &&
      this.cardKey
    ) {
      // this.getCardDetail({ cardKey: this.cardKey });
      this.getData(this.cardDetail);
    } else {
      this.simpleTitle = "";
    }
    if (this.groupType == 1) {
      this.memberList = JSON.parse(JSON.stringify(this.mainGroupMemberList));
    } else if (this.groupType == 3) {
      this.memberList = JSON.parse(JSON.stringify(this.groupMemberList));
    }
    this.getCommentList({
      cardKey: this.cardKey,
      curPage: 1,
      perPage: 10,
    });
    this.getUptoken();
    this.cardTypeIndex = this.cardType - 1;
  },
  methods: {
    ...mapActions("card", [
      "createCard",
      "changeCardShowState",
      "changeCardDetailType",
      "getCardDetail",
      "editCard",
      "setCardContent",
      "setCardType",
      "setExecutorIndex",
      "getCardHistory",
      "saveFollowPerson",
      "setCardKey",
      "setCardDetail",
      "setImpersonState",
    ]),
    ...mapActions("comment", ["getCommentList", "saveComment", "replyComment"]),
    ...mapActions("auth", ["getUptoken"]),
    // saveInput() {
    //   if (this.cardDetail._key) {
    //     this.editCard({
    //       title: this.simpleTitle,
    //       key: this.cardDetail._key
    //     });
    //   }
    // },
    handleCardClick(e) {
      this.cardTypeIndex = e.key;
      this.setCardType(parseInt(e.key));
    },
    handleTaskClick(e) {
      this.taskTypeIndex = e.key;
      // this.editCard({
      //   taskType: this.taskTypeArr[this.taskTypeIndex].id,
      //   key: this.cardDetail._key
      // });
    },
    handleOpenClick(e) {
      this.isOpen = e.key;
    },
    changePercent(index) {
      this.finishPercent = index;
    },
    changeContact(activeKey) {
      this.activeKey = activeKey;
      this.page = 1;
      if (activeKey == 1) {
        this.getCommentList({
          cardKey: this.cardKey,
          curPage: 1,
          perPage: 10,
        });
      } else if (activeKey == 2) {
        this.getCardHistory({
          cardKey: this.cardKey,
          curPage: 1,
          perPage: 10,
        });
      }
    },
    onChange(date, dateString) {
      this.taskStartDate = date[0].valueOf();
      this.taskEndDate = date[1].valueOf();
    },
    setTitle(e) {
      this.simpleTitle = e.target.value;
    },
    cancelCardInfo() {
      // this.changeCardDetailType(1);
      this.changeCardShowState(false);
      this.setImpersonState(0);
      this.changeCardDetailType(1);
      this.setCardContent("");
      this.setCardDetail(null);
      this.setCardKey(0);
    },
    //保存卡片
    async saveCard() {
      if (this.cardDetailType == 2) {
        if (this.cardContent && this.cardContent.indexOf("blob:http") !== -1) {
          this.$message.info("图片正在上传，请稍后");
          return;
        }
        let obj = {
          key: this.cardDetail._key,
          content: this.cardContent,
          taskType: this.taskTypeArr[this.taskTypeIndex].id,
          title: this.simpleTitle,
        };
        this.createTime
          ? (obj.taskStartDate = this.createTime.valueOf())
          : null;
        this.endTime ? (obj.taskEndDate = this.endTime.valueOf()) : null;
        await this.editCard(obj);
        this.$message.success("保存成功");
      }
      this.changeCardShowState(false);
      this.setImpersonState(0);
      this.changeCardDetailType(1);
      this.setCardContent("");
      this.setCardDetail(null);
      this.setCardKey(0);
    },
    //保存留言
    saveCommentMsg() {
      if (this.commentIndex === "") {
        //保存
        this.saveComment({
          cardKey: this.cardKey,
          action: 2,
          content: this.commentInput,
        });
      } else {
        //回复
        this.replyComment({
          cardKey: this.cardKey,
          action: 3,
          content: this.commentInput.replace(
            "回复" + this.commentList[this.commentIndex].etc.name + ":",
            ""
          ),
          replyRecordKey: this.commentList[this.commentIndex]._key,
        });
      }
      this.commentInput = "";
    },
    setReplyIndex(index) {
      this.replyIndex = index;
    },
    changeCommentReply(index) {
      this.commentInput = "回复" + this.commentList[index].etc.name + ":";
      this.commentIndex = index;
    },
    onPageChange(page) {
      this.page = page;
      this.getCommentList({
        cardKey: this.cardKey,
        curPage: page,
        perPage: 10,
      });
    },
    onPageHistoryChange(page) {
      this.historyPage = page;
      this.getCardHistory({
        cardKey: this.cardKey,
        curPage: page,
        perPage: 10,
      });
    },
    changeCreateTime(date) {
      this.createTime = date;
    },
    changeEndTime(date) {
      this.endTime = date;
    },
    getData(cardDetail) {
      this.cardTypeIndex = cardDetail.type - 1;
      this.setCardType(cardDetail.type);
      if (cardDetail.taskType) {
        this.taskTypeArr.filter((item, index) => {
          if (item.id === cardDetail.taskType) {
            this.taskTypeIndex = index;
          }
        });
      }
      this.simpleTitle = cardDetail.title;
      this.setCardContent(cardDetail.content);
      this.isOpen = cardDetail.isOpen ? true : false;
      this.finishPercent = cardDetail.finishPercent;
      if (cardDetail.taskStartDate) {
        this.createTime = this.$moment(cardDetail.taskStartDate);
      }
      if (cardDetail.taskEndDate) {
        this.endTime = this.$moment(cardDetail.taskEndDate);
      }
    },
    //滚动加载
    scrollCommentLoading(e) {
      // console.log(e);
      //文档内容实际高度（包括超出视窗的溢出部分）
      let scrollHeight = e.target.scrollHeight;
      //滚动条滚动距离
      let scrollTop = e.target.scrollTop;
      //窗口可视范围高度
      let clientHeight = e.target.clientHeight;
      if (
        clientHeight + scrollTop >= scrollHeight &&
        this.commentList.length < this.cardCommentTotal
      ) {
        this.page = this.page + 1;
        this.getCommentList({
          cardKey: this.cardKey,
          curPage: this.page,
          perPage: 10,
        });
      }
    },
    scrollHistoryLoading(e) {
      // console.log(e);
      //文档内容实际高度（包括超出视窗的溢出部分）
      let scrollHeight = e.target.scrollHeight;
      //滚动条滚动距离
      let scrollTop = e.target.scrollTop;
      //窗口可视范围高度
      let clientHeight = e.target.clientHeight;
      if (
        clientHeight + scrollTop >= scrollHeight &&
        this.cardHistoryList.length < this.cardHistoryTotal
      ) {
        this.page = this.page + 1;
        this.getCardHistory({
          cardKey: this.cardKey,
          curPage: this.page,
          perPage: 10,
        });
      }
    },
    openNotification() {
      this.cardTitle = "https://working.vip/?card=" + this.cardKey;
      this.$notification.open({
        message: "分享链接",
        duration: 10,
        description: "复制链接成功," + this.cardTitle,
        onClick: () => {
          console.log("Notification Clicked!");
        },
      });
    },
    toChat() {
      api.message.postMessage({
        roomId: this.cardDetail.rocketChatGroupId,
        text:
          "[" +
          this.cardDetail.title +
          "](https://working.vip/?card=" +
          this.cardKey +
          ")  @" +
          this.cardDetail.executorIcareId,
        chatType: 1,
      });
    },
  },
  watch: {
    cardKey(newVal, oldVal) {
      if (oldVal !== newVal && newVal) {
        // if (this.cardDetailType == 1 || this.cardDetailType == 2) {
        // this.getCardDetail({ cardKey: newVal });
        // }
        // this.setCardContent("");
        this.getCommentList({
          cardKey: newVal,
          curPage: 1,
          perPage: 10,
        });
        this.activeKey = 1;
      }
    },
    cardDetailType(newVal, oldVal) {
      if (oldVal !== newVal) {
        if (newVal == 0) {
          this.simpleTitle = "";
          this.setCardContent("");
          this.isOpen = 0;
          this.cardTypeIndex = 0;
        } else {
          this.getData(this.cardDetail);
        }
      }
    },
    cardDetail: {
      handler(newVal, oldVal) {
        if (this.cardDetailType != 0) {
          this.getData(newVal);
        }
      },
      deep: true,
    },
    commentList: {
      handler(newVal, oldVal) {
        if (newVal) {
          newVal.forEach((item, index) => {
            item.newTime = this.$moment(item.createTime).format("MM-DD HH:MM");
          });
        }
      },
      immediate: true,
      deep: true,
    },
    commentInput(newVal, oldVal) {
      if (newVal == "") {
        this.commentIndex = "";
      }
    },
    groupType(newVal, oldVal) {
      if (newVal != oldVal) {
        if (newVal == 1) {
          this.memberList = JSON.parse(
            JSON.stringify(this.mainGroupMemberList)
          );
        } else if (newVal == 3) {
          this.memberList = JSON.parse(JSON.stringify(this.groupMemberList));
        }
      }
    },
    // cardType(newVal, oldVal) {
    //   if (newVal != oldVal) {
    //     console.log("newVal", newVal);
    //     this.cardTypeIndex = newVal - 1;
    //   }
    // }
  },
};
</script>

<style scoped>
.cardInfo {
  width: 460px;
  height: 100%;
  overflow: auto;
  position: absolute;
  padding-bottom: 46px;
  padding-left: 10px;
  box-sizing: border-box;
  z-index: 30;
  top: 0px;
  right: 0px;
  /* background: hsla(0, 0%, 100%, 0.25) border-box; */
  background: rgba(255, 255, 255);
}
.cardInfo-nav {
  width: 100%;
  height: 46px;
  /* background-image: linear-gradient(-180deg, #f6f6f6 0%, #e9e9e9 100%); */
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 15px;
  color: #8091a0;
  z-index: 3;
}
.cardInfo-nav .cardInfo-nav-close {
  /* margin: 0px 25px; */
  position: absolute;
  top: 14px;
  left: 15px;
  font-size: 18px;
  color: #000;
}
.cardInfo-nav .cardInfo-nav-save {
  position: absolute;
  top: 8px;
  right: 0px;
}
.cardInfo-nav-info {
  width: 45%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.phoneTask-nav-avatar {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 10px;
}
.phoneTask-nav-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.cardInfo-nav-discuss {
  margin-right: 16px;
}
.cardInfo-nav-save,
.cardInfo-nav-ellipsis {
  margin-right: 21px;
}

.cardInfo-info {
  width: 95%;
  margin: 10px 2.5%;
  font-size: 12px;
  color: #23384b;
}
.cardInfo-info-taskType {
  height: 30px;
  line-height: 30px;
  padding: 3px 6px;
  box-sizing: border-box;
  border-radius: 5px;
  font-size: 13px;
  text-align: center;
}
.cardInfo-tab,
.cardInfo-tab-input {
  height: 47px;
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #8091a0;
  padding: 20px;
  box-sizing: border-box;
}
.cardInfo-tab-input {
  height: auto;
}
.cardInfo-tab-input .ant-input {
  font-size: 20px !important;
  font-weight: bold !important;
  border: 0px !important;
}
.cardInfo-tab input::-webkit-input-placeholder {
  /* WebKit browsers */
  font-size: 12px;
  color: #8091a0;
}
/* .cardInfo-tab:nth-child(3) {
  margin-bottom: 10px;
} */

/* .cardInfo-tab:nth-child(1),
.cardInfo-tab:nth-child(2) {
  height: 70px;
  border-bottom: 1px solid #e7e7e7;
} */
/* .cardInfo-tab:nth-child(3) {
  font-size: 12px;
  color: #8091a0;
} */
.cardInfo-tab .cardInfo-info-title {
  width: 20%;
}
.cardInfo-tab .cardInfo-info-input {
  width: 108%;
}

.cardInfo-checkbox {
  display: flex;
  justify-content: flex-end;
  margin: 10px 0px 32px 0px;
}
.replyComment {
  width: 76%;
  font-size: 13px;
  color: #8091a0;
  margin-left: 23%;
  margin-top: 10px;
}
.replyComment .replyComment-name {
  font-size: 14px;
  color: #23384b;
  margin-right: 3px;
}
.comment-input {
  width: 462px;
  height: 46px;
  display: flex;
  align-items: center;
  padding: 0px 17px;
  box-sizing: border-box;
  background-image: linear-gradient(-180deg, #f6f6f6 0%, #e9e9e9 100%);
  position: fixed;
  bottom: 0px;
  right: 0px;
  z-index: 3;
}
.comment-input .add-button {
  width: 30px;
  height: 30px;
  margin-left: 3%;
  font-size: 14px;
  color: #8091a0;
  border: 1px solid #e8e8e8;
  border-radius: 4.71px;
  background-color: #fff;
}
.cardInfo-commentScroll {
  width: 100%;
  margin-bottom: 17px;
}
.comment-historyLog {
  width: 100%;
  font-size: 12px;
  color: #8091a0;
  padding: 5px 5%;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  margin-bottom: 10px !important;
}
.cardInfo-commentScroll::-webkit-scrollbar {
  width: 2px;
}
/* .cardInfo-commentScroll ::-webkit-scrollbar-thumb {
  background: #dedede;
  border-radius: 100px;
} */
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
</style>