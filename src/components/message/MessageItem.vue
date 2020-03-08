<template>
  <a-row
    class="messageItem"
    @click.native.stop="chooseMessageCard(messageValue.cardKey,messageValue.groupKey)"
  >
    <a-col :span="5" :style="{height:'100%',display:'flex',alignItems:'center'}">
      <div class="messageItem-img">
        <img :src="messageValue.avatar" alt />
      </div>
    </a-col>
    <a-col
      :span="19"
      :style="{height:'100%',display:'flex',  alignContent:'space-between',flexWrap:'wrap'}"
    >
      <div class="messageItem-name">{{messageValue.log}}</div>
      <div class="messageItem-card">{{messageValue.cardTitle}}</div>
      <div class="messageItem-msg">
        <div class="messageItem-groupName">{{messageValue.groupName}}</div>
        <div>{{messageValue.createTime|defaultMessageTime}}</div>
        <!-- <div class="messageItem-msg-button">
          <div
            class="messageItem-msg-button-read"
            @click="readMessage([messageValue.msgKey,messageIndex])"
            v-if="msgState"
          >标为已读</div>
          <div
            @click="delMessage([messageValue.msgKey,messageIndex])"
            class="messageItem-msg-button-del"
          >删除</div>
        </div>-->
      </div>
    </a-col>
  </a-row>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "MessageItem",
  props: ["messageIndex", "messageValue", "msgState"],
  methods: {
    ...mapActions("message", ["getMessageList", "readMessage", "delMessage"]),
    ...mapActions("card", [
      "setCardKey",
      "changeCardShowState",
      "changeCardDetailType",
      "setImpersonState"
    ]),
    ...mapActions("group", ["getCardMember"]),
    name() {},
    chooseMessageCard(key, groupKey) {
      this.setCardKey(key);
      // this.setLabelKey(this.cardItem.labelKey);
      // this.$emit("chooseTaskItem", this.chooseTaskKey, key);
      this.setImpersonState(1);
      this.getCardMember({
        groupId: groupKey
      });
      this.changeCardShowState(true);
      this.changeCardDetailType(2);
    }
  }
};
</script>

<style scoped>
.messageItem {
  /* height: 80px; */
  width: 100%;
  padding: 0px 5%;
  box-sizing: border-box;
  margin-bottom: 17px;
}
.messageItem:first-child {
  margin-top: 17px;
}
/* .messageItem:last-child {
  margin-bottom: 0px;
} */
.messageItem .messageItem-img {
  width: 40px;
  height: 40px;
  overflow: hidden;
  border-radius: 50%;
}
.messageItem .messageItem-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.messageItem .messageItem-name {
  width: 100%;
  font-size: 14px;
  color: #000;
  /* font-weight: bold; */
}
.messageItem-card {
  font-size: 12px;
  /* color: #23384b; */
  color: #000;
  margin: 4px 0px;
}
.messageItem-groupName {
  font-size: 8px;
}
.messageItem .messageItem-msg {
  width: 100%;
  font-size: 12px;
  color: #8091a0;
  display: flex;
  justify-content: space-between;
}
.messageItem-msg-button {
  font-size: 12px;
  color: #23384b;
  display: flex;
}

.messageItem-msg-button-read {
  cursor: pointer;
  margin-right: 24px;
}
.messageItem-msg-button-del {
  color: #1aca8e;
  cursor: pointer;
}
</style>