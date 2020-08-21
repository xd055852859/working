<template>
  <div ref="note">
    <div class="note">
      <a-collapse v-model="activeKey" accordion>
        <a-collapse-panel key="1" header="随记" :showArrow="false">
          <div :style="{height:(noteHeight-185)+'px',overflow:'auto'}">
            <Editor
              :style="{width:'100%',height:'100%'}"
              :noteEdit.sync="note"
              :editorType="'noteEdit'"
            />
          </div>
        </a-collapse-panel>
        <a-collapse-panel key="2" header="成就" :showArrow="false">
          <div :style="{height:(noteHeight-185)+'px'}">
            <a-textarea
              v-model="positive"
              :placeholder="'正面：利好、收获'"
              :style="{height:'100%',color:'#333'}"
            />
          </div>
        </a-collapse-panel>
        <a-collapse-panel key="3" header="风险" :showArrow="false">
          <div :style="{height:(noteHeight-185)+'px'}">
            <a-textarea
              v-model="negative"
              :placeholder="'负面：利空、风险、压力'"
              :style="{height:'100%',color:'#333'}"
            />
          </div>
        </a-collapse-panel>
        <a-collapse-panel key="4" header="今日任务" :showArrow="false">
          <div :style="{height:(noteHeight-185)+'px',overflow:'auto'}">
            <div v-for="(item,index) in taskArray" :key="'task'+index" class="note-task">
              <a-icon type="edit" class="note-task-point" />
              {{item.title}}
            </div>
          </div>
        </a-collapse-panel>
      </a-collapse>
      <div class="note-button-info">
        <a-button type="primary" class="note-button" @click="saveNote">保存</a-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Editor from "../common/Editor";
import api from "@/services/api";
export default {
  name: "Note",
  components: { Editor },
  data() {
    return {
      activeKey: "1",
      text: "",
      noteHeight: 0,
      negative: "",
      positive: "",
      note: "",
      taskArray: [],
    };
  },
  computed: mapState({
    user: (state) => state.auth.user,
    groupType: (state) => state.auth.user,
    allMainTaskArray: (state) => state.task.allMainTaskArray,
    allMainGroupArray: (state) => state.task.allMainGroupArray,
  }),
  async mounted() {
    // console.log(this.$refs.note.clientHeight);
    this.noteHeight = this.$refs.note.clientHeight;
    if (!this.allMainGroupArray) {
      this.allMainGroupTask({
        type1: this.groupType,
        targetUKey: this.user._key,
        type2: 1,
        finishPercentArray: [0, 1, 2],
      });
    }
    let noteRes = await api.task.getNote({
      targetUKey: this.user._key,
      startTime: this.$moment().startOf("day").valueOf(),
      type: 2,
    });
    if (noteRes.msg == "OK") {
      this.positive = noteRes.result.positive;
      this.negative = noteRes.result.negative;
      this.note = noteRes.result.note;
    } else {
      if (noteRes.msg == "无该成就/风险/随记") {
        await api.task.setNote({
          startTime: this.$moment().startOf("day").valueOf(),
          type: 2,
          positive: "",
          negative: "",
          note: "",
          positiveClose: "",
          negativeClose: "",
          noteClose: "",
        });
      } else {
        this.$message.error(noteRes.msg);
      }
    }
  },
  methods: {
    ...mapActions("task", ["allMainGroupTask"]),
    async saveNote() {
      let noteRes = await api.task.setNote({
        startTime: this.$moment().startOf("day").valueOf(),
        type: 2,
        positive: this.positive,
        negative: this.negative,
        note: this.note,
      });
      if (noteRes.msg == "OK") {
        this.$message.success("保存成功");
      } else {
        this.$message.error(noteRes.msg);
      }
    },
    getData(taskArray) {
      _.flatten(taskArray).forEach((item, index) => {
        const startTime = this.$moment(new Date()).startOf("day").valueOf();
        const endTime = this.$moment(new Date()).endOf("day").valueOf();
        if (
          item.executorKey == this.user._key &&
          ((item.taskEndDate < endTime && item.finishPercent == 0) ||
            (item.todayTaskTime < endTime &&
              item.todayTaskTime > startTime &&
              (item.finishPercent == 1 || item.finishPercent == 2)))
        ) {
          console.log("xxxxxxxxxxx", item);
          this.taskArray.push(item);
        }
      });
    },
  },
  watch: {
    allMainTaskArray: {
      handler(newValue) {
        if (newValue) {
          this.getData(this._.cloneDeep(newValue));
        }
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.note {
  position: relative;
}
.note-button-info {
  position: absolute;
  top: 0px;
  right: 6px;
}
.note-button {
  width: 84px;
  height: 30px;
  background: #86b93f;
  border: 1px solid #86b93f;
  border-radius: 6px;
  margin-top: 10px;
}
.note-button:hover {
  background: #86b93f;
}
.note-task {
  min-height: 40px;
  line-height: 30px;
  border: 1px dotted #efefef;
  display: flex;
  align-items: center;
  padding: 0px 5px;
  box-sizing: border-box;
}
.note-task-point {
  font-size: 15px;
  margin-right: 5px;
}
</style>