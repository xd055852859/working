<template>
  <div class="taskView" @click="cancelCardInfo">
    <!-- <div class="content-menu"> -->
    <TaskViewNav
      :viewState.sync="viewState"
      :showToDo.sync="showToDo"
      :dateType.sync="dateType"
      :taskShowIndex.sync="taskShowIndex"
      v-on="$listeners"
      v-bind="$attrs"
    />
    <TaskViewFilter
      v-on="$listeners"
      v-bind="$attrs"
      v-if="!((viewState ==4&&(groupType==1||groupType==2)) ||(viewState ==5&&(groupType==1||groupType==2))||(viewState ==2&&groupType==3)||(viewState ==3&&groupType==3))"
    />
    <Task
      v-show="viewState == 0&&groupType==3"
      :showToDo.sync="showToDo"
      :dateType="dateType"
      :moveChooseKey.sync="moveChooseKey"
      @createTask="createTask"
      @playAudio="playAudio"
      v-on="$listeners"
      v-bind="$attrs"
    />
    <!-- <DayTask
      v-if="viewState == 4"
      :dateType="dateType"
      :moveChooseKey.sync="moveChooseKey"
      @createTask="createTask"
    />-->
    <PersonTask
      v-if="viewState == 1&&groupType==3"
      :dateType="dateType"
      :moveChooseKey.sync="moveChooseKey"
      @createTask="createTask"
      @playAudio="playAudio"
      v-on="$listeners"
      v-bind="$attrs"
    />
    <!-- <DayTask
      v-if="viewState == 4&&groupType!=3"
      :dateType="dateType"
      :moveChooseKey.sync="moveChooseKey"
      @createTask="createTask"
    />-->
    <DayCanlendar
      v-if="(viewState == 6&&groupType!=3)||(viewState ==4&&groupType==3)"
      :dateType="dateType"
      :moveChooseKey.sync="moveChooseKey"
      @createTask="createTask"
      @playAudio="playAudio"
      v-on="$listeners"
      v-bind="$attrs"
    />

    <Cooperation
      v-if="viewState != 4&&groupType!=3&&viewState != 5&&viewState != 6"
      :viewState.sync="viewState"
      :dateType="dateType"
      :moveChooseKey.sync="moveChooseKey"
      @createTask="createTask"
      @playAudio="playAudio"
      v-on="$listeners"
      v-bind="$attrs"
    />
    <!--  -->
    <Grid
      v-if="(viewState ==4&&(groupType==1||groupType==2)) ||(viewState ==5&&(groupType==1||groupType==2))||(viewState ==2&&groupType==3)||(viewState ==3&&groupType==3)"
      :viewState.sync="viewState"
      :dateType="dateType"
      :moveChooseKey.sync="moveChooseKey"
      @createTask="createTask"
      @playAudio="playAudio"
      v-on="$listeners"
      v-bind="$attrs"
    />
    <!-- <Calendar v-if="viewState == 3" /> -->
    <!-- <KnowledgeBase v-if="linkState === 3" />
          <GroupFile v-if="linkState === 4" />
    <GroupAlbum v-if="linkState === 5" />-->
    <audio ref="doneAudio" :src="doneAudio" muted>您的浏览器不支持 audio 标签。</audio>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "TaskView",
  data() {
    return {
      viewState: 0,
      dateType: false,
      moveChooseKey: 0,
      showToDo: true,
      doneAudio: require("@/assets/OK.mp3"),
      taskShowIndex: 0,
    };
  },
  components: {
    Task: () => import("./task/Task"),
    DayTask: () => import("./dayTask/DayTask"),
    PersonTask: () => import("./personTask/PersonTask"),
    Calendar: () => import("./canlendar/index"),
    Cooperation: () => import("./cooperation/Cooperation"),
    DayCanlendar: () => import("./dayCanlendar/DayCanlendar"),
    Grid: () => import("./grid/Grid"),
    TaskViewNav: () => import("./TaskViewNav"),
    TaskViewFilter: () => import("./TaskViewFilter"),
    // Naotu,
    // KnowledgeBase,
    // GroupFile,
    // GroupAlbum,
  },
  computed: mapState({
    user: (state) => state.auth.user,
    targetUInfo: (state) => state.auth.targetUInfo,
    deviceState: (state) => state.common.deviceState,
    ideaTitle: (state) => state.common.ideaTitle,
    groupKey: (state) => state.group.groupKey,
    groupRole: (state) => state.group.groupRole,
    groupType: (state) => state.group.groupType,
    cardKey: (state) => state.card.cardKey,
    linkState: (state) => state.card.linkState,
    labelArray: (state) => state.task.labelArray,
    allTaskArray: (state) => state.task.allTaskArray,
    finishPercentArray: (state) => state.task.finishPercentArray,
    taskType: (state) => state.task.taskType,
    taskTitle: (state) => state.task.taskTitle,
  }),
  methods: {
    ...mapActions("common", ["setIdeaTitle"]),
    ...mapActions("card", [
      "setCardKey",
      "setImpersonState",
      "editCard",
      "createCard",
      "changeCardShowState",
      "changeCardDetailType",
      "setCardContent",
      "setCardDetail",
    ]),
    ...mapActions("task", [
      "getTaskList",
      "allGroupTask",
      "setTaskType",
      "setTaskTitle",
    ]),
    createTask(item, index, executorKey, parentKey) {
      if (this.groupType == 3) {
        item = {
          groupKey: this.groupKey,
          labelKey:
            this.viewState != 0
              ? item.labelKey
                ? item.labelKey
                : item
              : typeof item == "string"
              ? item
              : item
              ? item.labelKey
              : null,
          groupRole: this.groupRole,
        };
      }
      let obj = {
        type: 2,
        content: "",
        rootType: 0,
        groupKey: item.groupKey,
        taskType: 1,
        executorKey: executorKey ? executorKey : this.user._key,
        followUKeyArray: [],
        finishPercent: 0,
        hour: 1,
        day: 1,
        date: this.$moment().date(),
        taskEndDate: new Date().getTime(),
        groupRole: item.groupRole,
      };
      obj.labelKey = item.labelKey ? item.labelKey : null;
      obj.title = this.ideaTitle != "" ? this.ideaTitle : "";
      obj.cardIndex = index;
      parentKey ? (obj.parentCardKey = parentKey) : null;
      if (index == "新增") {
        let labelIndex = this._.findIndex(this.labelArray, {
          _key: item.labelKey,
        });
        if (
          this.labelArray[labelIndex] &&
          this.labelArray[labelIndex].cardOrder
        ) {
          index = this._.indexOf(
            this.labelArray[labelIndex].cardOrder,
            this.cardKey
          );
          obj.cardIndex = index + 1;
        }
      }
      this.createCard(obj);
      this.setIdeaTitle("");
      this.setTaskType(2);
    },
    cancelCardInfo() {
      this.setImpersonState(0);
      // this.labelArray.forEach((item, index) => {
      //   this.$set(this.taskMoveArr, index, false);
      //   this.$set(this.taskClickArr, index, false);
      // });
      this.changeCardShowState(false);
      this.changeCardDetailType(1);
      this.setCardContent("");
      this.setCardDetail(null);
      this.setCardKey(0);
      // this.setImpersonState(0);
    },
    getList(groupKey, user, targetUInfo, groupType) {
      let targetUGKey = "";
      if (groupType != 2) {
        targetUGKey = groupKey;
      } else {
        targetUGKey = targetUInfo._key;
      }
      if (targetUGKey) {
        this.getTaskList({
          typeBoard1: this.groupType,
          targetUGKey: targetUGKey,
          finishPercentArray: this.finishPercentArray,
          fileDay: 14,
        });
      }
    },
    //播放音乐
    playAudio() {
      this.$refs.doneAudio.play();
    },
  },
  watch: {
    user: {
      handler(newVal, oldVal) {
        // 获取到用户信息
        if (newVal != oldVal && this.targetUInfo && newVal) {
          if (this.groupType == 3) {
            this.getList(
              this.groupKey,
              newVal,
              this.targetUInfo,
              this.groupType
            );
          } else if (this.groupType == 1) {
            this.allGroupTask({
              type1: 1,
              targetUKey: newVal._key,
              type2: 1,
              finishPercentArray: [0, 1, 2],
              fileDay: 14,
            });
          }
        }
      },
      immediate: true,
    },
    targetUInfo: {
      handler(newVal, oldVal) {
        // 获取到用户信息
        if (newVal && newVal._key && this.groupType == 2) {
          this.allGroupTask({
            type1: 2,
            targetUKey: newVal._key,
            type2: 1,
            finishPercentArray: [0, 1, 2],
            fileDay: 14
          });
        }
      },
      immediate: true,
      deep: true,
    },
    // groupType: {
    //   handler(newVal, oldVal) {
    //     if (oldVal != newVal && newVal && this.user) {
    //       this.taskInfo = [];
    //       this.viewState = 0;
    //       if (this.user) {
    //         if (newVal == 3) {
    //           this.getList(this.groupKey, this.user, this.targetUInfo, newVal);
    //         } else {
    //           this.allGroupTask({
    //             type1: newVal,
    //             targetUKey:
    //               newVal == 1 ? this.user._key : this.targetUInfo.userId,
    //             type2: 1,
    //             finishPercentArray: [0, 1]
    //           });
    //         }
    //       }
    //       this.setTaskType(0);
    //     }
    //   }
    // },
    groupKey: {
      async handler(newVal, oldVal) {
        if (oldVal != newVal && newVal && this.user) {
          this.taskInfo = [];
          this.viewState = 0;
          if (this.user && this.targetUInfo) {
            if (this.groupType == 3) {
              this.getList(newVal, this.user, this.targetUInfo, this.groupType);
            } else if (this.groupType == 1) {
              this.allGroupTask({
                type1: 1,
                targetUKey: this.user._key,
                type2: 1,
                finishPercentArray: [0, 1, 2],
                fileDay: 14
              });
            }
          }
        }
      },
      immediate: true,
    },
    // targetUInfo: {
    //   handler(newVal, oldVal) {
    //     this.taskInfo = [];
    //     if (this.user && this.groupType == 2) {
    //       this.getList(this.groupKey, this.user, newVal, this.groupType);
    //     }
    //     // }
    //   },
    //   deep: true
    // },
    async cardKey(newVal, oldVal) {
      if (oldVal != newVal) {
        if (this.taskTitle != "" && oldVal) {
          await this.editCard({
            title: this.taskTitle,
            key: oldVal,
          });
        }
        this.setTaskTitle("");
        this.setImpersonState(1);
        if (newVal) {
          this.$nextTick(function () {
            if (document.getElementById("textareaid" + newVal)) {
              document.getElementById("textareaid" + newVal).focus();
            }
          });
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.taskView {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>