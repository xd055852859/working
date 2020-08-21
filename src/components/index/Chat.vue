<template>
  <div>
    <iframe :src="chatUrl" class="chat-iframe"></iframe>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { ROCKET_CHAT_URL } from "@/services/global";
import api from "@/services/api";
export default {
  name: "Chat",
  data() {
    return {
      chatUrl: "",
    };
  },
  created() {
    window.addEventListener("message", this.handlerIframeEvent);
  },
  mounted() {
    this.chatUrl = ROCKET_CHAT_URL;
  },
  computed: {
    ...mapState({
      user: (state) => state.auth.user,
    }),
  },
  methods: {
    ...mapActions("card", [
      "setCardKey",
      "setCardDetail",
      "setCardExecutorKey",
      "changeCardDetailType",
      "changeCardShowState",
    ]),
    ...mapActions("group", ["getCardMember"]),
    /**
     * 聊天监听事件
     */
    async handlerIframeEvent(e) {
      const that = this;
      switch (e.data.eventName) {
        case "goWorkingCard":
          let cardKey = e.data.data.cardId;
          if (cardKey) {
            this.setCardKey(cardKey);
            let cardDetailRes = await api.card.getCardDetail({
              cardKey: cardKey,
            });
            if (cardDetailRes.msg == "OK") {
              let cardDetail = cardDetailRes.result;
              this.setCardDetail(cardDetail);
              this.getCardMember({
                groupId: cardDetail.groupKey,
              });
              let cardRole = !(
                cardDetail.groupRole < 4 ||
                cardDetail.creatorKey == this.user._key ||
                cardDetail.executorKey == this.user._key
              );
              console.log("cardRole", cardRole);
              this.setCardExecutorKey(cardDetail.executorKey);
              if (!cardRole) {
                this.changeCardDetailType(2);
                // this.setTaskTitle(this.cardItem.title);
              } else {
                this.changeCardDetailType(1);               
              }
               this.changeCardShowState(true);
            } else {
              this.$message.error(cardDetailRes.msg);
            }
          }
          break;
        default:
          null;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.chat-iframe {
  width: 100%;
  height: 100%;
}
</style>