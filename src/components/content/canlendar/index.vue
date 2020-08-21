<template>
  <div :style="{height:'100%',width:'100%',padding:'10px',boxSizing:'border-box'}">
    <!-- 图片列表 imgArr colNumbers 列数 divHeight 图片下的div高度 -->
    <calendar
      @createCanlendarTask="createTask"
      @deleteCanlendarTask="deleteTask"
      :calendarEvents="calendarEvents"
      :taskArray="cardArray"
      @editCanlendarTime="editTaskTime"
      @showCanlendarTaskInfo="showTaskInfo"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import api from "../../../services/api";
// import Calendar from "../../common/Canlendar";
import { message } from "ant-design-vue";
export default {
  name: "CalendarIndex",
  components: { Calendar },
  computed: mapState({
    cardArray: state => state.task.cardArray,
    user: state => state.auth.user,
    groupKey: state => state.group.groupKey,
    groupRole: state => state.group.groupRole,
    linkState: state => state.card.linkState,
    cardDetail: state => state.cardDetail.cardDetail
  }),
  data() {
    return {
      calendarEvents: [],
      color: ["#6FD29A", "#21ABE4", "#F5A623", "#FB8444", "#FF5D5B", "#9F33FE"],
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
  created() {},
  mounted() {},
  methods: {
    ...mapActions("card", [
      "createCard",
      "deleteCard",
      "editCard",
      "changeCardShowState",
      "changeCardDetailType",
      "setCardKey",

    ]),
    ...mapActions("group", ["getCardMember"]),
    createTask(info) {
      if (this.groupRole < 4) {
        let obj = {
          type: 2,
          title: "",
          content: "",
          rootType: 0,
          groupKey: this.groupKey,
          taskType: 1,
          executorKey: this.user._key,
          followUKeyArray: [],
          finishPercent: 0,
          hour: 1,
          day: info.day,
          date: info.date,
          taskEndDate: new Date().getTime() + 86400000 * info.day,
          groupRole: this.groupRole,
          cardIndex: 0,
          labelKey: null
        };
        this.createCard(obj);
      } else {
        message.error("当前权限无法创建任务");
      }
    },
    deleteTask(id) {
      if (
        this.groupRole < 3 ||
        this.cardDetail.creatorKey == this.user._key ||
        this.cardDetail.executorKey == this.user._key
      ) {
        this.deleteCard({
          cardKey: id.split("#")[0],
          groupKey: id.split("#")[1]
        });
        this.changeCardShowState(false);
      } else {
        this.$message.error("当前权限无法删除");
      }
    },
    editTaskTime(info) {
      if (this.groupRole < 4) {
        let cardKey = info.id.split("#")[0];
        let obj = {
          key: cardKey,
          taskEndDate: info.endTime
        };
        if (info.hour) {
          obj.hour = info.hour;
        } else {
          obj.date = this.$moment(info.endTime).date();
          obj.day = info.day;
        }
        this.editCard(obj);
      }
    },
    showTaskInfo(id) {
      if (this.groupRole < 4) {
        let taskId = id.split("#")[0];
        let groupKey = id.split("#")[1];
        let groupRole = id.split("#")[2];
        let executorKey = id.split("#")[3];
        this.setCardKey(taskId);
        // this.setLabelKey(this.cardItem.labelKey);
        this.getCardMember({
          groupId: groupKey
        });
        this.changeCardShowState(true);
        if (groupRole < 4 || executorKey == this.user._key) {
          this.changeCardDetailType(2);
        } else {
          this.changeCardDetailType(1);
        }
      }
    }
  },
  watch: {
    cardArray: {
      handler(newVal) {
        this.calendarEvents = [];
        for (let i=0;i<newVal.length;i++){
          if (
            (this.groupType == 1 && newVal[i].executorKey != this.user._key) ||
            (this.groupType == 1 && newVal[i].creatorKey != this.user._key)
          ) {
            continue;
          }
          this.calendarEvents.push({
            title:
              (newVal[i].executorName ? newVal[i].executorName : newVal[i].creatorName) +
              " : " +
              newVal[i].title,
            start: newVal[i].taskEndDate,
            end: newVal[i].taskEndDate,
            // backgroundColor: this.backgroundColor[
            //   item.taskType == 10 ? 5 : item.taskType - 1
            // ],
            backgroundColor:
              newVal[i].finishPercent > 0
                ? "#E5E7EA"
                : this.color[newVal[i].taskType == 10 ? 5 : newVal[i].taskType - 1],
            // textColor: this.color[item.taskType == 10 ? 5 : item.taskType - 1],
            textColor: "#fff",
            borderColor: "transparent",
            id:
              newVal[i]._key +
              "#" +
              newVal[i].groupKey +
              "#" +
              newVal[i].groupRole +
              "#" +
              newVal[i].executorKey
          });
        };
      },
      immediate: true,
      deep: true
    }
  }
};
</script>

<style lang="scss" scoped>
</style>