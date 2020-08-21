<template>
  <div>
    <div class="grid-title" :ref="'task'+taskItem._key">
      <div class="line-img-task" :style="{left:lineLeft+'px'}"></div>
      <div class="grid-title-subtitle" :style="{paddingLeft:taskLeft+'px'}">
        <TaskItem :cardItem="taskItem" v-on="$listeners" v-bind="$attrs" :bottomtype="bottomtype" />
      </div>
      <div class="grid-label-tr grid-title-subtask">
        <!-- :style="{background:?:null}" -->
        <div
          v-for="(dateItem,dateIndex) in taskItem.dayArr"
          :key="dateIndex"
          class="grid-label-td"
          @click="gridState?chooseTaskTime(dateIndex):chooseTaskPerson(dateIndex)"
          :style="dateItem?{backgroundColor:'rgba(59,82,107,0.8)'}:null"
        >{{dateItem}}</div>
      </div>
    </div>
    <div v-for="(child, index) in taskItem.children" :key="index" class="grid-title-task chooseTr">
      <div v-if="child">
        <GridTree
          :taskItem="child"
          v-on="$listeners"
          v-bind="$attrs"
          :left="taskLeft"
          :lineLeft="lineTaskLeft"
          :width="taskWidth"
          :gridState="gridState"
          :taskNavDate="taskNavDate"
          :taskNavDay="taskNavDay"
          @playTreeAudio="playTreeAudio"
        />
      </div>
    </div>
  </div>
</template>

<script>
import TaskItem from "../content/task/TaskItem";
import { mapState, mapActions } from "vuex";
export default {
  name: "GridTree",
  components: { TaskItem },
  props: [
    "taskItem",
    "left",
    "lineLeft",
    "width",
    "gridState",
    "taskNavDate",
    "taskNavDay",
    "fontColor",
    "playTreeAudio",
  ],
  data() {
    return {
      bottomtype: "grid",
      moveIndex: null,
      taskWidth: 0,
    };
  },
  computed: {
    taskLeft() {
      return parseInt(this.left) + 15;
    },
    lineTaskLeft() {
      return parseInt(this.lineLeft) + 15;
    },
  },
  methods: {
    ...mapActions("card", ["editCard"]),
    ...mapActions("group", ["addGroupMember"]),
    ...mapActions("task", ["allGridGroupTask"]),
    chooseTaskTime(index) {
      if (typeof this.gridState == "boolean") {
        this.$emit("playTreeAudio");
        this.editCard({
          key: this.taskItem._key,
          taskEndDate: new Date().getTime() + index * 86400000,
        });

        // if(left=0){

        // }else{

        // }
      }
    },
    async chooseTaskPerson(index) {
      if (typeof this.gridState == "boolean") {
        this.$emit("playTreeAudio");
        await this.addGroupMember({
          param: {
            groupKey: this.taskItem.groupKey,
            targetUidList: [
              {
                userKey: this.taskNavDate[index].userId,
                nickName: this.taskNavDate[index].nickName,
                avatar: this.taskNavDate[index].avatar,
                gender: this.taskNavDate[index].gender,
                role: 4,
              },
            ],
          },
          item: this.taskNavDate[index],
          type: "member",
        });
        await this.editCard({
          key: this.taskItem._key,
          executorKey: this.taskNavDay[index].userId,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.grid-title {
  width: 100%;
  display: flex;
  justify-content: space-between;
  min-height: 40px;
  position: relative;
}

.line-img-task {
  width: 20px;
  height: calc(100% + 2px);
  border-left: 1px solid #d7d7d7;
  border-bottom: 1px solid #d7d7d7;
  position: absolute;
  top: -30px;
  left: -35px;
  z-index: 0;
  border-bottom-left-radius: 5px;
}
.grid-title-subtitle {
  width: 40%;
  box-sizing: border-box;
  display: flex;
  align-items: flex-start;
  margin-bottom: 5px;
  position: relative;
  z-index: 2;
  padding-right: 10px;
  // justify-content: space-between;
}
.grid-label-tr {
  display: flex;
}
.grid-title-subtask {
  width: 60%;
  // justify-content: flex-end;
}
.grid-label-td {
  width: 5%;
  margin-right: -1px;
  margin-bottom: -1px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border: 1px solid #ededed;
  box-sizing: border-box;
}
.grid-title-task {
  width: 100%;
}
.chooseTr:hover {
  background: rgba(0, 0, 0, 0.3);
}
</style>