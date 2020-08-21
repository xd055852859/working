<template>
  <div>
    <div class="groupDiary-choose">
      <a-icon type="left" @click="changeDay(0)" />
      <div>{{targetDayStr}}</div>
      <a-icon type="right" @click="changeDay(1)" />
    </div>
    <div
      v-for="(clockItem,clockIndex) in clockInData"
      :key="clockIndex"
      :style="{borderBottom:'2px dotted #fff',paddingTop:'20px'}"
      class="groupDiary-info"
    >
      <div class="groupDiary-title">
        <div class="groupDiary-avatar">
          <img :src="clockItem.cardArray[0][0].executorAvatar" alt />
        </div>
        <div>{{clockItem.cardArray[0][0].executorName}}</div>
        <div class="clock-icon">
          <img :src="clockIcon" alt />
        </div>活力值
        <span
          :style="{backgroundColor:clockItem.cardArray[0][0].userEnergyDateTotal>0?'#E94848':'#16AE7A',borderRadius:'20px',padding:'0px 6px',boxSizng:'border-box',color:'#fff',height:'20px',lineHeight:'20px',marginLeft:'5px'}"
        >{{clockItem.cardArray[0][0].userEnergyDateTotal>0?"+ ":null}}{{clockItem.cardArray[0][0].userEnergyDateTotal}}</span>
      </div>
      <ClockIn :clockItem="clockItem" />
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import ClockIn from "../index/ClockIn";
import api from "@/services/api";
import clockIcon from "@/assets/clockIcon.png";
export default {
  name: "GroupDiary",
  components: {
    ClockIn,
  },
  data() {
    return {
      clockInData: [],
      clockInfo: [],
      clockIcon: clockIcon,
      targetDayStr: "",
      targetTime: 0,
    };
  },
  computed: {
    ...mapState({
      groupKey: (state) => state.group.groupKey,
    }),
  },
  async mounted() {
    this.targetDayStr =
      this.$moment().format("M") + "月" + this.$moment().format("D") + "日";
    this.targetTime = this.$moment().startOf("day").valueOf();
    this.getDayNote(this.targetTime);
    this.getDayTime(
      this.$moment().subtract(1, "days").startOf("day").valueOf(),
      this.$moment().endOf("day").valueOf()
    );
  },
  methods: {
    async getDayTime(startTime, endTime) {
      let teamTaskRes = await api.task.getTeamCareTask({
        groupKey: this.groupKey,
        finishPercentArray: [0, 1, 2],
        startTime: startTime,
        endTime: endTime,
      });
      if (teamTaskRes.msg == "OK") {
        this.getClockInData(teamTaskRes.result);
      } else {
        this.$message.error(teamTaskRes.msg);
      }
    },
    async getDayNote(startTime) {
      let groupRes = await api.group.getGroupClockInInfo({
        groupKey: this.groupKey,
        startTime: startTime,
      });
      if (groupRes.msg == "OK") {
        this.clockInfo = groupRes.result;
      } else {
        this.$message.error(groupRes.msg);
      }
    },
    changeDay(type) {
      this.clockInData = [];
      let startTime = 0;
      let endTime = 0;
      //当前时间
      if (type == 0) {
        startTime = this.$moment(this.targetTime)
          .subtract(2, "day")
          .startOf("day")
          .valueOf();
        endTime = this.$moment(this.targetTime)
          .subtract(1, "day")
          .endOf("day")
          .valueOf();
      } else {
        startTime = this.$moment(this.targetTime).startOf("day").valueOf();
        endTime = this.$moment(this.targetTime)
          .add(1, "day")
          .endOf("day")
          .valueOf();
      }
      this.targetTime = endTime;
      this.targetDayStr =
        this.$moment(this.targetTime).format("M") +
        "月" +
        this.$moment(this.targetTime).format("D") +
        "日";
      this.getDayNote(this.$moment(endTime).startOf("day").valueOf());
      this.getDayTime(startTime, endTime);
    },
    getClockInData(arr) {
      let personObj = {};
      let groupData = {};
      let groupArray = [];
      let cardArray = [];
      arr.forEach((item, index) => {
        if (
          item.groupName &&
          item.groupName.indexOf("主群") == -1 &&
          item.title != "" &&
          item.taskEndDate
        ) {
          if (!personObj[item.executorKey]) {
            personObj[item.executorKey] = [];
          }
          let clockInfoIndex = this._.findIndex(this.clockInfo, {
            _key: item.executorKey,
          });
          if (clockInfoIndex != -1) {
            item = {
              positive: this.clockInfo[clockInfoIndex].positive,
              negative: this.clockInfo[clockInfoIndex].negative,
              note: this.clockInfo[clockInfoIndex].note,
              userEnergyDateTotal: this.clockInfo[clockInfoIndex]
                .userEnergyDateTotal,
              ...item,
            };
            personObj[item.executorKey].push(item);
          }
        }
      });
      for (let key in personObj) {
        groupData[key] = {};
        personObj[key].forEach((item, index) => {
          if (!groupData[key][item.groupKey]) {
            groupData[key][item.groupKey] = [];
          }
          groupData[key][item.groupKey].push(item);
        });
      }
      Object.values(groupData).forEach((item, index) => {
        cardArray.push(Object.values(item));
        groupArray[index] = [];
        Object.values(item).forEach((groupItem, groupIndex) => {
          groupArray[index].push({
            groupLogo: groupItem[0].groupLogo,
            groupName: groupItem[0].groupName,
          });
        });
      });
      groupArray.forEach((item, index) => {
        this.clockInData.push({
          groupArray: item,
          cardArray: cardArray[index],
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.groupDiary-info:hover {
  background-color: rgba(0, 0, 0, 0.19);
}
.groupDiary-title {
  width: 100%;
  height: 38px;
  display: flex;
  align-items: center;
  padding: 0px 10px;
  box-sizing: border-box;
}
.groupDiary-avatar {
  width: 35px;
  height: 35px;
  overflow: hidden;
  border-radius: 50%;
  margin-right: 5px;
}
.groupDiary-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.clock-icon {
  width: 25px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
  margin-right: 5px;
}
.clock-icon img {
  width: 22px;
  height: 13px;
}
.groupDiary-choose {
  width: 100px;
  height: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 55px;
  right: 10px;
}
</style>