<template>
  <div class="chat">
    <!-- <div class="chat-title">
      <a-input
        placeholder="搜索"
        v-model="searchInput"
        ref="searchInput"
        class="search-input"
        @focus="showSearchHistory"
        @blur="unshowSearchHistory"
      >
        <a-icon slot="prefix" type="search" />
      </a-input>
      <div class="add-button flex-center" @click="fixedPin">
        <a-icon type="pushpin" />
      </div>
    </div>-->
    <a-tabs defaultActiveKey="1" @change="changeContact">
      <a-tab-pane tab="联系人" key="1">
        <div v-for="(item, index) in rooms" :key="index">
          <ChatItem v-if="item.t === 'd'" :room="item" />
        </div>
      </a-tab-pane>
      <a-tab-pane tab="项目/群组" key="2">
        <div v-for="(item, index) in rooms" :key="index">
          <ChatItem v-if="item.t === 'c'" :room="item" />
        </div>
      </a-tab-pane>
    </a-tabs>

    <div v-if="searchVisible" class="search-modal">
      <ChatDialog />
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { mapState, mapActions } from "vuex";
import ChatItem from "./ChatItem";
import ChatDialog from "./ChatDialog";
export default {
  name: "Chat",
  components: { ChatItem, ChatDialog },
  computed: mapState({
    user: state => state.auth.user,
    rooms: state => state.auth.rooms
  }),
  data() {
    return {
      visible: false,
      searchVisible: false,
      searchInput: ""
    };
  },
  methods: {
    ...mapActions("chat", ["getContacks", "getGroups", "changeContactShow"]),
    ...mapActions("auth", ["getRooms"]),
    changeContact: () => {},
    fixedPin() {
      this.changeContactShow(this.showState == 2 ? 0 : 2);
    },
    // showSearch() {
    //   this.visible = true;
    //   this.$refs.searchButton.style.color = "#1aca8e";
    // },
    showSearchHistory() {
      this.searchVisible = true;
    },
    unshowSearchHistory() {
      this.searchVisible = false;
    },
    handleOk() {
      this.visible = false;
      // this.$refs.searchButton.style.color = "#8091a0";
    }
  },
  mounted: function() {
    if (this.user) {
      this.getRooms(this.user);
    }
  },
  watch: {
    user: {
      handler: function(newVal, oldVal) {
        // 获取到用户信息
        if (oldVal === null && newVal) {
          if (newVal.rocketChat) {
            this.getRooms(newVal);
          }
        }
        // 如果用户的聊天authToken发生了改变，重新获取聊天室
        if (
          oldVal &&
          newVal &&
          oldVal.rocketChat &&
          newVal.rocketChat &&
          oldVal.rocketChat.authToken !== newVal.rocketChat.authToken
        ) {
          // eslint-disable-next-line
  
          this.getRooms(newVal);
        }
      },
      deep: true,
      immediate: true
    }
  }
};
</script>

<style>
.chat {
  width: 100%;
  height: 100%;
}
/* 搜索框内容 */
.chat-title {
  width: 100%;
  height: 53px;
  padding: 10px 3% 13px 3%;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-image: linear-gradient(-180deg, #f6f6f6 0%, #e9e9e9 100%);
}
/* 搜索框 */
.chat-title .search-input {
  width: 80%;
  /* height: 30px !important; */
  background: #ffffff;
  /* border: 1px solid #e8e8e8; */
  border-radius: 4.71px;
}
/* 搜索栏上方 */
/* .chat-title .search-top {
  width: 70%;
  height: 30px;
  position: absolute;
  top: 10px;
  left: 3%;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #8091a0;
} */
/* 搜索栏添加 */
.chat-title .add-button {
  width: 30px;
  height: 30px;
  margin-left: 3%;
  font-size: 14px;
  color: #8091a0;
  border: 1px solid #e8e8e8;
  border-radius: 4.71px;
  background-color: #fff;
}
/* 列表栏 */
.chat .ant-tabs-bar {
  background-color: #e9e9e9 !important;
}
.chat .ant-tabs-tab-active {
  font-size: 14px;
  color: #23384b !important;
}
.chat .ant-tabs-tab {
  font-size: 14px;
  color: #8091a0;
}
/* 列表内容 */

.chat .ant-tabs {
  height: calc(100% - 55px);
}
.chat .ant-tabs-bar {
  margin: 0px;
}
.chat .ant-tabs-content {
  height: 100%;
}
.chat .ant-tabs-tabpane {
  height: calc(100% - 45px);
  overflow: auto;
}

.search-modal {
  width: 298px;
  height: 500px;
  position: fixed;
  left: 80px;
  top: 45px;
  background-color: #fff;
  z-index: 10;
  box-shadow: 0 0 16px 0 rgba(91, 91, 91, 0.81);
}
</style>
