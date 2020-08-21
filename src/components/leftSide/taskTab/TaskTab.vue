<template>
  <div class="taskTab" :style="{width:deviceState=='mobile'?(deviceWidth-60)+'px':'350px'}">
    <div class="taskTab-wrapper">
      <div
        class="taskTab-item"
        v-for="(item,index) in nameArr"
        :key="index"
        @click="chooseTaskType(index)"
        :style="index==taskType?{boxShadow:' 0 0 7px 0 rgba(0, 0, 0, 0.26)',borderLeft: '3px solid #26cc94'}:null"
      >
        <a-Icon :component="svgArr[index]" :style="{fontSize:'20px',marginRight:'10px'}" />
        <div :style="{width:'200px'}">{{item}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { mapState, mapActions } from "vuex";
import { Tooltip, Button } from "ant-design-vue";
import CardItem from "../../content/card/CardItem";
import tabSvg1 from "../../common/svg/我的一天.svg";
import tabSvg2 from "../../common/svg/重要@1x.svg";
import tabSvg3 from "../../common/svg/已计划@1x.svg";
import tabSvg4 from "../../common/svg/分配给我的@1x.svg";
import tabSvg5 from "../../common/svg/由我指派的@1x.svg";
import tabSvg6 from "../../common/svg/我的任务@1x.svg";
export default {
  name: "TaskTab",
  data() {
    return {
      nameArr: [
        "我的一天",
        "重要",
        "已计划",
        "分配给我的",
        "由我指派的",
        "我的任务"
      ],
      svgArr: [tabSvg1, tabSvg2, tabSvg3, tabSvg4, tabSvg5, tabSvg6]
    };
  },
  computed: mapState({
    user: state => state.auth.user,
    deviceState: state => state.common.deviceState,
    deviceWidth: state => state.common.deviceWidth,
    groupType: state => state.group.groupType,
    taskType: state => state.task.taskType
  }),
  methods: {
    ...mapActions("task", ["setTaskType"]),
    handleSearchClick(e) {
      this.searchIndex = e.key;
    },
    chooseTaskType(index) {
      this.setTaskType(index);
      // if (this.groupType > 1) {
      //   this.contactSetGroupKey();
      // }
    }
  },
  watch: {}
};
</script>

<style scoped>
.taskTab-wrapper {
  width: 100%;
  height: 100%;
  /* border-right: 1px solid #d5d5d5; */
  box-shadow: 3px 2px 6px rgba(0, 0, 0, 0.4);
  position: relative;
}
.taskTab-item {
  width: 100%;
  height: 55px;
  padding: 0px 10px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #23384b;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #f3f3f3;
}
</style>