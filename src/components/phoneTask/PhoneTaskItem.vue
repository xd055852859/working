<template>
  <div class="phoneTaskItem">
    <a-icon
      :component="taskArr[cardItem.finishPercent]"
      class="phoneTaskItem-finishIcon"
      @click.stop="changeFinishPercent(cardItem.finishPercent)"
    />
    <div class="phoneTaskItem-title">{{cardItem.title}}</div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
// import task1 from "../../common/svg/task1.svg";
import task2 from "../common/svg/task2.svg";
import task4 from "../common/svg/task4.svg";
import task6 from "../common/svg/task6.svg";
export default {
  name: "PersonTaskItem",
  props: ["cardItem", "cardTargetIndex"],
  data() {
    return {
      taskArr: [task2, task6, task6],
      taskItem: {},
      taskIndex: 0,
      backgroundColor: [
        "#DAF6E6",
        "#D8ECFF",
        "#FBE6C4",
        "#FFDDCC",
        "#FFE3DE",
        "#F3E5FF"
      ]
    };
  },
  computed: {
    ...mapState({
      cardKey: state => state.card.cardKey,
      cardList: state => state.card.cardList,
      groupRole: state => state.group.groupRole,
      groupKey: state => state.group.groupKey,
      taskList: state => state.task.taskList,
      cardDetail: state => state.card.cardDetail,
      cardMemberList: state => state.group.cardMemberList,
      deviceState: state => state.common.deviceState
    })
    // cardArray() {
    //   return this.taskList.cardArray;
    // }
  },
  methods: {
    ...mapActions("card", [
      "changeFollowCardState",
      "setCardKey",
      "setCardIndex",
      "editCard",
      "deleteCard",
      // "getCardDetail",
      "changeCardShowState",
      "changeCardDetailType"
    ]),
    ...mapActions("group", ["getCardMember"]),
    ...mapActions("task", ["setLabelKey"]),
    changeFinishPercent(finishPercent) {
      finishPercent = finishPercent == 0 ? 1 : 0;
      this.editCard({
        key: this.cardItem._key,
        taskType: this.cardItem.taskType,
        finishPercent: finishPercent
      });
    }
  }
};
</script>

<style scoped>
.phoneTaskItem {
  height: 42px;
  width: 100%;
  padding: 0 2.5%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}
.phoneTaskItem-finishIcon {
  margin: 0px 8px 0px 0px;
  color: #555;
  font-size: 18px;
  box-sizing: border-box;
}
.phoneTaskItem-title {
  font-size: 14px;
  flex: 1;
  display: flex;
  align-items: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>