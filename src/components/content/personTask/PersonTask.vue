<template>
  <div class="persontask">
    <div class="persontask-time">
      <!-- <a-date-picker @change="changeCreateTime" :value="createTime" :style="{marginRight:'10px'}" />
      <a-date-picker @change="changeEndTime" :value="endTime" />-->
      <a-range-picker @change="changeTime" :value="[createTime,endTime]" />
    </div>
    <div class="persontask-container">
      <div v-for="(item,index) in personTaskArr" :key="index" class="persontask-item">
        <div class="persontask-top">
          <div class="persontask-top-img" :style="{backgroundImage:'url('+avatarBgImg+')'}">
            <div class="persontask-top-avatar">
              <img :src="item.avatar" />
            </div>
          </div>
          <div class="persontask-top-name">{{item.nickName}}</div>
        </div>
        <div class="persontask-num">
          <div :style="{width:'100%',color:fontColor}">
            <span :style="{marginRight:'20px'}">任务数: {{item.finishNum}} / {{item.arr.length}}</span>
            <span>工时: {{item.finishTime.toFixed(2)}} / {{item.allTime.toFixed(1)}} h</span>
          </div>
          <div :style="{width:'100%'}" v-if="item.percent>0">
            <a-progress status="success" :percent="item.percent" :showInfo="false" />
          </div>
        </div>
        <div class="persontask-bottom">
          <div
            v-for="(personItem,personIndex) in item.arr"
            :key="personIndex"
            class="persontask-bottom-item"
          >
            <TaskItem :cardItem="personItem" v-on="$listeners" v-bind="$attrs" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { mapState, mapActions } from "vuex";
import TaskItem from "../task/TaskItem";
import avatarBgImg from "../../../assets/头像背景@1x.png";
import format from "../../common/format";
export default {
  name: "PersonTask",
  components: { TaskItem },
  props: ["taskObj"],
  inject: ["backgroundColor", "getFontColor"],
  data() {
    return {
      personTaskObj: {},
      personTaskArr: [],
      personArr: [],
      createTime: this.$moment("20200101").startOf("day"),
      endTime: this.$moment(new Date()).endOf("day"),
      checkIndex: null,
      avatarBgImg: avatarBgImg,
    };
  },
  computed: {
    ...mapState({
      groupMemberList: (state) => state.group.groupMemberList,
      cardArray: (state) => state.task.cardArray,
    }),
    fontColor() {
      return this.getFontColor();
    },
  },
  mounted() {},
  methods: {
    getDate(oldCardArray, taskObj) {
      let cardArray = this._.cloneDeep(
        format.formatFilter(oldCardArray, taskObj)
      );
      console.log(oldCardArray.length);
      console.log(cardArray.length);
      cardArray.forEach((cardItem, cardIndex) => {
        if (
          cardItem.executorKey &&
          this.createTime <= cardItem.taskEndDate &&
          this.endTime >= cardItem.taskEndDate &&
          cardItem.show
        ) {
          if (!this.personTaskObj[cardItem.executorKey]) {
            this.personTaskObj[cardItem.executorKey] = {
              arr: [],
              finishNum: 0,
              finishTime: 0,
              allTime: 0,
              percent: 0,
              arrlength: 0,
              personItem: {},
              avatar:
                cardItem.executorAvatar +
                "?imageMogr2/auto-orient/thumbnail/50x50/format/jpg",
              nickName: cardItem.executorName,
              key: cardItem.executorKey,
            };
          }
          this.personTaskObj[cardItem.executorKey].allTime =
            this.personTaskObj[cardItem.executorKey].allTime + cardItem.hour;
          if (cardItem.finishPercent > 0) {
            this.personTaskObj[cardItem.executorKey].finishNum++;
            this.personTaskObj[cardItem.executorKey].finishTime =
              this.personTaskObj[cardItem.executorKey].finishTime +
              cardItem.hour;
          }
          this.personTaskObj[cardItem.executorKey].arr.push(cardItem);
          this.personTaskObj[cardItem.executorKey].arrlength++;
        }
      });
      for (let key in this.personTaskObj) {
        this.personTaskObj[key].percent =
          (
            this.personTaskObj[key].finishTime /
            this.personTaskObj[key].arr.length
          ).toFixed(2) * 100;
        this.personTaskObj[key].arr.sort(
          (a, b) => a.finishPercent - b.finishPercent
        );
      }
      this.personTaskArr = this._.sortBy(Object.values(this.personTaskObj), [
        "arrlength",
      ]).reverse();
      // this.personTaskObj.forEach((item) => {
      //   if (JSON.stringify(item.personItem) != "{}") {
      //     this.personArr.push({
      //       avatar:
      //         item.personItem.avatar +
      //         "?imageMogr2/auto-orient/thumbnail/50x50/format/jpg",
      //       nickName: item.personItem.nickName,
      //       key: item.personItem.userId,
      //     });
      //   }
      // });
    },
    changeTime(dates) {
      this.createTime = dates[0];
      this.endTime = dates[1];
    },
    chooseTaskItem(key) {
      this.checkIndex = key;
    },
  },
  watch: {
    cardArray: {
      handler(newValue, oldValue) {
        this.personTaskObj = {};
        this.getDate(this._.cloneDeep(newValue), this.taskObj);
      },
      deep: true,
      immediate: true,
    },
    taskObj: {
      handler(newVal) {
        this.personTaskObj = {};
        this.getDate(this._.cloneDeep(this.cardArray), newVal);
      },
      deep: true,
    },
    createTime(newValue, oldValue) {
      if (newValue != oldValue) {
        this.getDate(this.cardArray, this.taskObj);
      }
    },
    endTime(newValue, oldValue) {
      if (newValue != oldValue) {
        this.getDate(this.cardArray, this.taskObj);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.persontask {
  width: 100%;
  height: calc(100% - 90px);
  padding: 0px 0.5%;
}
.persontask-time {
  width: 100%;
  height: 50px;
  padding: 0px 0.5%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.persontask-container {
  width: 100%;
  height: calc(100% - 55px);
  display: flex;
  overflow-x: scroll;
  overflow-y: hidden;
  flex-wrap: nowrap;
}
.persontask-item {
  width: 350px;
  margin-right: 10px;
}
.persontask-top {
  height: 130px;
  width: 350px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
.persontask-top-img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
}
.persontask-top-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
}
.persontask-top-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.persontask-top-name {
  width: 100%;
  text-align: center;
}
.persontask-num {
  width: 100%;
  height: 45px;
  color: #999;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 0px 20px;
  box-sizing: border-box;
  margin: 5px 0px;
}
.persontask-bottom {
  width: 100%;
  height: calc(100% - 180px);
  overflow: auto;
}
.persontask-bottom-item {
  width: 100%;
  min-height: 58px;
  // word-wrap: break-word;
}
.persontask-container::-webkit-scrollbar {
  width: 3px;
  height: 8px;
}
.persontask-container::-webkit-scrollbar-thumb {
  background: #47475b;
  border-radius: 100px;
}
</style>