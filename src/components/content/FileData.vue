<template>
  <div class="fileData">
    <div class="fileData-container">
      <div class="fileData-title">目录</div>
      <div
        v-for="(item,index) in fileArr"
        :key="index"
        :style="fileStyle(item.nodename,index)"
        @click="toTop(item.nodeTop)"
      >{{item.fileTitle}}</div>
    </div>
    <div :style="{width:'70%',height:'100%',backgroundColor:'#fff',marginLeft:'30%'}">
      <Editor
        :editorType="'fileData'"
        :fileData.sync="fileData"
        :clientHeight.sync="clientHeight"
        :fileArr.sync="fileArr"
        :style="{width:'100%'}"
      />
      <!-- @mouseleave.native="saveFile(0)" -->
    </div>
    <a-button
      type="primary"
      class="saveButton"
      @click="saveFile(1)"
      :style="{height:'30px',width:'100px'}"
    >保存</a-button>
    <div class="back-div"></div>
  </div>
</template>

<script>
import Editor from "../common/Editor";
import { mapState, mapActions } from "vuex";
import api from "@/services/api";
export default {
  name: "fileData",
  components: { Editor },
  data() {
    return {
      fileArr: [],
      fileData: "",
      clientHeight: 0,
    };
  },
  computed: {
    ...mapState({
      groupInfo: (state) => state.group.groupInfo,
      groupKey: (state) => state.group.groupKey,
    }),
    fileStyle(nodename, index) {
      let nodeIndex = 0;
      return (nodename, index) => {
        switch (nodename) {
          case "H1":
            nodeIndex = 0;
            break;
          case "H2":
            nodeIndex = 1;
            break;
          case "H3":
            nodeIndex = 2;
            break;
          case "H4":
            nodeIndex = 3;
            break;
        }
        return {
          width: "100%",
          height: "30px",
          lineHeight: "30px",
          paddingLeft: nodeIndex * 25 + "px",
          fontSize: 20 / (nodeIndex / 3 + 1) + "px",
          boxSizing: "border-box",
          cursor: "pointer",
        };
      };
    },
  },
  mounted() {
    this.getUptoken();
    this.$nextTick(() => {
      this.clientHeight = document.querySelectorAll(
        ".fileData"
      )[0].clientHeight;
      console.log(this.clientHeight);
    });
  },
  methods: {
    ...mapActions("group", ["setGroupInfo"]),
    ...mapActions("auth", ["getUptoken"]),
    toTop(top) {
      // this.$nextTick(() => {
        console.log(document.querySelectorAll(".fr-wrapper")[0].offsetHeight);
        // document.querySelectorAll(".fr-element")[0].scrollTo(0, 500);
      // });
    },
    async saveFile(type) {
      let res = await api.group.changeGroupInfo({
        key: this.groupKey,
        patchData: {
          groupDocument: this.fileData,
        },
      });
      if (res.msg == "OK") {
        this.setGroupInfo(res.result);
        type ? this.$message.success("保存成功") : null;
      } else {
        this.$message.error(res.msg);
      }
    },
  },
  watch: {
    fileArr: {
      handler(newValue) {
        if (newValue.length > 0) {
          // let title = "";
          // let h2TitleArr = [
          //   "一",
          //   "二",
          //   "三",
          //   "四",
          //   "五",
          //   "六",
          //   "七",
          //   "八",
          //   "九",
          //   "十",
          //   "十一",
          //   "十二",
          //   "十三",
          //   "十四",
          //   "十五",
          //   "十六",
          //   "十七",
          //   "十八",
          //   "十九",
          // ];
          // let h2Index = 0;
          // let h3Index = 0;
          // let h4Index = 0;
          // let oldh2Index = 0;
          // let oldh3Index = 0;
          newValue.forEach((item, index) => {
            //   switch (item.nodename) {
            //     case "H2":
            //       title = h2TitleArr[h2Index] + "、" + item.nodeText;
            //       h2Index++;
            //       break;
            //     case "H3":
            //       h3Index++;
            //       if (oldh2Index != h2Index) {
            //         h3Index = 1;
            //         h4Index = 0;
            //         oldh2Index = h2Index;
            //         oldh3Index = h3Index;
            //       }
            //       if (oldh3Index != h3Index) {
            //         h4Index = 0;
            //         oldh3Index = h3Index;
            //       }
            //       title = h3Index + "、" + item.nodeText;
            //       break;
            //     case "H4":
            //       h4Index++;
            //       if (oldh2Index != h2Index) {
            //         h3Index = 1;
            //         h4Index = 1;
            //         oldh2Index = h2Index;
            //         oldh3Index = h3Index;
            //       }
            //       if (oldh3Index != h3Index) {
            //         h4Index = 1;
            //         oldh3Index = h3Index;
            //       }
            //       title = h3Index + "." + h4Index + "、" + item.nodeText;
            //       break;
            //     default:
            //       title = item.nodeText;
            //       break;
            //   }
            item.fileTitle = item.nodeText;
          });
        }
      },
      deep: true,
    },
    groupInfo: {
      handler(newValue) {
        if (newValue) {
          this.fileData = newValue.groupDocument ? newValue.groupDocument : "";
        }
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>

<style lang="scss">
.fileData {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  position: relative;
  overflow: auto;
}
.fileData .fileData-container {
  width: 30%;
  height: 100%;
  padding: 20px 30px;
  box-sizing: border-box;
  overflow: auto;
  position: fixed;
  left: 52px;
  top: 48px;
}
.fileData-title {
  border-bottom: 1px solid #dddddd;
  padding-bottom: 10px;
}
.fileData .fr-box.fr-basic {
  height: 100% !important;
}
// .fileData .fr-wrapper {
//   height: calc(100% - 39px) !important;
// }
.fileData .fr-view {
  height: 100% !important;
}
.saveButton {
  position: fixed;
  top: 52px;
  right: 20px;
  z-index: 10;
}
.back-div {
  width: calc(70% - 41px);
  height: 40px;
  position: fixed;
  top: 45px;
  right: 0px;
  background-color: #fff;
  z-index: 3;
}
</style>