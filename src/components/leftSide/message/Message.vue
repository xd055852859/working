<template>
  <div
    class="message"
    :style="deviceState=='mobile'?{marginTop:'50px',height:'calc(100%-50px)',width:'100%'}:{width:'350px'}"
  >
    <div class="message-wrapper">
      <div class="message-wrapper-nav">
        <div>消息中心</div>
        <div class="message-close" @click="closeMessage">
          <a-icon type="close" />
        </div>
      </div>
      <div class="message-wrapper-title">
        <div class="message-wrapper-title-button">
          <div
            :class="{'message-wrapper-title-hover':hoverState?true:false}"
            @click="()=>{hoverState=true}"
          >未 读</div>
          <div
            :class="{'message-wrapper-title-hover':hoverState?false:true}"
            @click="()=>{hoverState=false}"
          >已 读</div>
        </div>
        <div class="message-wrapper-title-title">
          <div>当前消息{{messageTotal}}条</div>
          <div @click="readAll" v-if="hoverState">全部标记已读</div>
        </div>
      </div>
      <div class="message-wrapper-container" @scroll="scrollMessageLoading">
        <div v-for="(item,index) in messageList" :key="index">
          <MessageItem :messageValue="item" :messageIndex="index" :msgState="hoverState" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MessageItem from "./MessageItem";
import { mapState, mapActions } from "vuex";
export default {
  name: "Message",
  components: { MessageItem },
  computed: mapState({
    headerIndex: state => state.common.headerIndex,
    user: state => state.auth.user,
    messageList: state => state.message.messageList,
    messageTotal: state => state.message.messageTotal,
    deviceState: state => state.common.deviceState,
    deviceWidth: state => state.common.deviceWidth
  }),
  data() {
    return {
      hoverState: true,
      typeRead: 1,
      page: 1
    };
  },
  mounted() {
    if (this.user) {
      this.getMessageList({ typeRead: 1, curPage: 1, perPage: 10 });
    }
  },
  methods: {
    ...mapActions("common", ["changeHeaderIndex"]),
    ...mapActions("message", [
      "getMessageList",
      "readMessage",
      "setMessageList"
    ]),
    //滚动加载
    scrollMessageLoading(e) {
      // console.log(e);
      //文档内容实际高度（包括超出视窗的溢出部分）
      let scrollHeight = e.target.scrollHeight;
      //滚动条滚动距离
      let scrollTop = e.target.scrollTop;
      //窗口可视范围高度
      let clientHeight = e.target.clientHeight;
      if (
        clientHeight + scrollTop >= scrollHeight &&
        this.messageList.length < this.messageTotal
      ) {
        this.page = this.page + 1;
        this.getMessageList({
          typeRead: this.typeRead,
          curPage: this.page,
          perPage: 10
        });
      }
    },
    readAll() {
      this.readMessage([null, null]);
    },
    closeMessage(){
      this.setMessageList([]);
      this.changeHeaderIndex(6)
    }
  },
  watch: {
    user(newValue, oldValue) {
      if (newValue != oldValue && newValue) {
        this.getMessageList({ typeRead: 1, curPage: 1, perPage: 10 });
      }
    },
    hoverState(newValue, oldValue) {
      if (newValue != oldValue) {
        this.setMessageList([]);
        if (newValue) {
          this.typeRead = 1;
          this.getMessageList({ typeRead: 1, curPage: 1, perPage: 10 });
        } else {
          this.typeRead = 2;
          this.getMessageList({ typeRead: 2, curPage: 1, perPage: 10 });
        }
      }
    },
    headerIndex(newValue, oldValue) {
      if (newValue == 2) {
        this.setMessageList([]);
        this.typeRead = 1;
        this.getMessageList({ typeRead: 1, curPage: 1, perPage: 10 });
      }
    }
  }
};
</script>

<style scoped>
.message {
  height: 100%;
  display: flex;
  background: #fff;
}
/* 联系人活动页面 */
.message-wrapper {
  width: 100%;
  height: 100%;
  /* border-right: 1px solid #d5d5d5; */
  box-shadow: 3px 2px 6px rgba(0, 0, 0, 0.4);
  font-size: 18px;
  color: #23384b;
}
.message-wrapper-nav {
  width: 100%;
  height: 45px;
  padding: 0px 16px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.message-wrapper-title {
  width: 100%;
  height: 90px;
  margin-top: 10px;
  padding-bottom: 15px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
.message-wrapper-title-button {
  width: 228px;
  height: 39px;
  display: flex;
}
.message-wrapper-title-button > div {
  width: 114px;
  height: 39px;
  /* background: #1aca8e; */
  border: 1px solid #d5d5d5;
  color: #fff;
  font-size: 14px;
  color: #23384b;
  line-height: 39px;
  text-align: center;
  cursor: pointer;
}
.message-wrapper-title-button > div:nth-child(1) {
  border-radius: 6px 0px 0px 6px;
}
.message-wrapper-title-button > div:nth-child(2) {
  border-radius: 0px 6px 6px 0px;
}
.message-wrapper-title-button .message-wrapper-title-hover {
  color: #fff;
  background: #1aca8e;
  border: 1px solid #1aca8e;
}
.message-wrapper-title-title {
  width: 100%;
  font-size: 13px;
  color: #8091a0;
  display: flex;
  justify-content: space-between;
  padding: 0px 16px;
  box-sizing: border-box;
  border-bottom: 1px solid #e7e7e7;
}
.message-wrapper-title-title > :nth-child(2) {
  color: #1aca8e;
}
.message-wrapper-container {
  width: 100%;
  height: calc(100% - 150px);
  overflow: auto;
}
.message-close {
  font-size: 16px;
}
</style>