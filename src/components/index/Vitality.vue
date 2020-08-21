<template>
  <div>
    <div class="vitality-container">
      <div class="vitality-doc" @click="toDoc">帮助/说明</div>
      <div class="vitality-top">
        <div class="vitality-img" v-if="vitalityType==3">
          <img :src="vitalityInfo|defaultLogo" alt />
        </div>
        <div class="vitality-img" v-if="vitalityType!=3">
          <img :src="vitalityInfo.profile|defaultPerson" alt />
        </div>
        <div class="vitality-top-info">
          <div class="vitality-title vitality-top-title">
            <div>{{vitalityType==3?vitalityInfo.groupName:vitalityInfo.profile.nickName}}</div>
            <div class="vitality-top-num">
              活力值
              <div class="vitality-numImg">
                <img :src="batteryPng" alt />
              </div>
              <div :style="{color:'#86B93F',fontSize:'14px'}">{{vitalityInfo.energyValueTotal}}</div>
            </div>
          </div>
          <div class="vitality-subtitle vitality-bottom-title">
            <!-- <div>已完成：36个任务</div>
            <div>还需要293993活力分晋升到下一段位</div>-->
            <VitalityIcon :vitalityNum="vitalityInfo.energyValueTotal" :vitalityState="'info'" />
          </div>
        </div>
        <!-- <div>
          <a-progress type="circle" :percent="75" :width="60" />
        </div>-->
      </div>
      <div class="vitality-chart-info">
        <div class="vitality-chart">
          <div class="vitality-title" :style="{ justifyContent:'space-between'}">
            <div>成员贡献度</div>
            <div class="vitality-choose">
              <a-icon type="left" @click="changeMonth(0)" />
              <div>{{targetMonthStr}}</div>
              <a-icon type="right" @click="changeMonth(1)" />
            </div>
          </div>
          <div class="vitality-week" ref="piechartdiv" id="piechartdiv"></div>
          <!-- <div class="vitality-chart-info"> -->
          <!-- <div
            class="vitality-week"
            ref="linechartdiv"
            id="linechartdiv"
            :style="{marginTop:'8px'}"
          ></div>-->

          <!-- </div> -->
        </div>
        <div class="vitality-box">
          <div class="vitality-month">
            <div class="vitality-title">月活力分布</div>
            <div class="vitality-month-container">
              <div
                :style="{paddingLeft: '40px',boxSizing:'border-box',width:'100%',display:'flex',height:'17px'}"
              >
                <div
                  class="vitality-month-item-title vitality-month-item"
                  v-for="(monthItem,monthIndex) in monthArr"
                  :key="'month'+monthIndex"
                >{{monthItem}}</div>
              </div>
              <div v-for="(item,index) in monthData" :key="index" class="vitality-month-info">
                <div class="vitality-month-title">{{monthTitleArr[index]}}</div>
                <a-tooltip
                  class="vitality-month-item"
                  v-for="(dayItem,dayIndex) in item"
                  :key="'vitality'+index+dayIndex"
                >
                  <template slot="title">分值: {{dayItem.value}} 分</template>
                  <div
                    class="vitality-month-item-day"
                    :style="{backgroundColor:dayItem.color,border: dayItem.date? '1px solid rgba(151, 151, 151, 1)':0}"
                    @click="groupType!=2?getTargetLog(dayItem.startTime):null"
                  ></div>
                  <!-- {{dayItem.date}} -->
                </a-tooltip>
              </div>
            </div>
          </div>
          <div class="vitality-log">
            <div class="vitality-title">
              活力日志
              <span :style="{marginLeft:'5px',fontSize:'12px'}">( {{logDate}} )</span>
            </div>
            <div class="vitality-log-container" @scroll="scrollLogLoading">
              <div class="vitality-msg" v-for="(logItem,logIndex) in logList" :key="'log'+logIndex">
                <div :style="{width:'12%',color:'rgba(94,138,251,1)'}">{{logItem.creatorName}} → {{logItem.executorName}}</div>
                <div :style="{width:'20%'}">{{logItem.log}}</div>
                <div :style="{width:'45%'}">{{logItem.cardTitle}}</div>
                <div :style="{width:'10%'}">{{logItem.createTime}}</div>
                <div :style="{color:logItem.energyValue>0?'#417505':'#D0021B'}">活力</div>
                <span
                  :style="{backgroundColor:logItem.energyValue>0?'#86B93F':'#E94848',borderRadius:'8px',padding:'0px 6px',boxSizng:'border-box',color:'#fff',height:'20px',lineHeight:'20px'}"
                >{{logItem.energyValue>0?"+":null}}{{logItem.energyValue}}</span>
              </div>
            </div>
          </div>
          <a-icon type="close" class="close-icon" @click="closeVitality" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import chart from "../common/chart";
import api from "@/services/api";
import VitalityIcon from "./VitalityIcon";
import batteryPng from "@/assets/battery.png";
import { isArray } from "@amcharts/amcharts4/core";
export default {
  name: "Vitality",
  components: {
    VitalityIcon,
  },
  data() {
    return {
      heatchart: null,
      linechart: null,
      piechart: null,
      weekEnergy: [],
      monthEnergy: [],
      logList: [],
      page: 1,
      limit: 15,
      logtotal: 0,
      monthData: [],
      monthArr: ["S", "M", "T", "W", "T", "F", "S"],
      monthStr: "",
      vitalityInfo: {},
      targetNum: 0,
      targetMonthStr: "",
      targetTime: 0,
      batteryPng: batteryPng,
      startTime: 0,
      endTime: 0,
      logDate: "",
    };
  },
  props: ["vitalityState", "vitalityType", "vitalityKey"],
  computed: mapState({
    user: (state) => state.auth.user,
    groupType: (state) => state.group.groupType,
  }),
  mounted() {
    this.$nextTick(() => {
      Array.from(document.querySelectorAll("svg")).forEach((item) => {
        if (item.parentElement.parentElement.style.width) {
          item.parentElement.parentElement.style.display = "none";
        }
      });
    });
  },
  beforeDestroy() {
    if (this.linechart) {
      this.linechart.dispose();
    }
    if (this.heatchart) {
      this.heatchart.dispose();
    }
    if (this.piechart) {
      this.piechart.dispose();
    }
  },
  methods: {
    closeVitality() {
      this.$emit("update:vitalityState", false);
    },
    async getData() {
      let res = "";
      if (this.vitalityType == 3) {
        res = await api.group.getGroupInfo({ key: this.vitalityKey });
      } else if (this.vitalityType == 2) {
        res = await api.auth.getTargetUserInfo({ key: this.vitalityKey });
      }
      if (res.msg == "OK") {
        this.vitalityInfo = res.result;
        this.getVitalityData({
          type: this.vitalityType - 1,
          targetUGKey: res.result._key,
        });
      } else {
        this.$message.error(res.msg);
      }
    },
    async getVitalityData(obj) {
      let weekIndex = 0;
      // let weekRes = await api.auth.weekEnergy(obj);
      // let weekIndex = 0;
      // if (weekRes.msg == "OK") {
      //   let data = [];
      //   weekRes.result.forEach((item) => {
      //     data.push({
      //       date: this.$moment(item.startTime).format("YYYY-MM-DD"),
      //       value: item.value,
      //     });
      //   });
      //   this.linechart = chart.createLineChart("linechartdiv", data);
      // } else {
      //   this.$message.error(weekRes.msg);
      // }
      let personStartTime = this.$moment()
        .startOf("month")
        .startOf("day")
        .valueOf();
      let personEndTime = this.$moment().endOf("month").endOf("day").valueOf();
      this.targetMonthStr =
        this.$moment().format("YYYY") + "/" + this.$moment().format("MM");
      this.targetTime = this.$moment()
        .startOf("month")
        .startOf("day")
        .valueOf();
      this.getPersonVitality(personStartTime, personEndTime);
      let monthStartTime = this.$moment()
        .subtract(3, "month")
        .startOf("month")
        .startOf("day")
        .valueOf();
      let monthEndTime = this.$moment()
        .add(1, "month")
        .startOf("month")
        .startOf("day")
        .valueOf();
      let monthObj = {
        startTime: monthStartTime,
        endTime: monthEndTime,
        ...obj,
      };
      let monthTimeArr = [
        {
          startTime: this.$moment()
            .subtract(3, "month")
            .startOf("month")
            .startOf("day")
            .valueOf(),
          endTime: this.$moment()
            .subtract(2, "month")
            .startOf("month")
            .startOf("day")
            .valueOf(),
        },
        {
          startTime: this.$moment()
            .subtract(2, "month")
            .startOf("month")
            .startOf("day")
            .valueOf(),
          endTime: this.$moment()
            .subtract(1, "month")
            .startOf("month")
            .startOf("day")
            .valueOf(),
        },
        {
          startTime: this.$moment()
            .subtract(1, "month")
            .startOf("month")
            .startOf("day")
            .valueOf(),
          endTime: this.$moment().startOf("month").startOf("day").valueOf(),
        },
        {
          startTime: this.$moment().startOf("month").startOf("day").valueOf(),
          endTime: this.$moment()
            .add(1, "month")
            .startOf("month")
            .startOf("day")
            .valueOf(),
        },
      ];
      let monthRes = await api.auth.monthEnergy(monthObj);
      if (monthRes.msg == "OK") {
        monthTimeArr.forEach((monthItem, monthIndex) => {
          this.monthData[monthIndex] = [];
          monthRes.result.forEach((item) => {
            if (
              item.startTime >= monthItem.startTime &&
              item.startTime < monthItem.endTime
            ) {
              this.monthData[monthIndex].push({
                color: this.getColor(item.value),
                date: this.$moment(item.startTime).date(),
                value: item.value.toFixed(1),
                startTime: item.startTime,
              });
            }
          });
        });
        this.monthData.forEach((item, index) => {
          item = this.formatMonth(item[0].startTime, item);
        });
        this.monthData.reverse();
      } else {
        this.$message.error(monthRes.msg);
      }
      this.startTime = this.$moment().startOf("day").valueOf();
      this.endTime = this.$moment().endOf("day").valueOf();
      this.logDate =
        this.$moment().format("M") + "月" + this.$moment().format("D") + "日";
      this.getLog(this.page, this.limit);
    },
    async getPersonVitality(startTime, endTime) {
      let personMonthObj = {
        startTime: startTime,
        endTime: endTime,
        type: this.vitalityType - 1,
        targetUGKey: this.vitalityInfo._key,
      };
      let personRes = await api.auth.monthEnergyWeb(personMonthObj);
      if (personRes.msg == "OK") {
        let data = [];
        personRes.result.forEach((item) => {
          if (item.energyValueTotal > 0) {
            data.push({
              name: item.name,
              value: item.energyValueTotal,
            });
          }
        });
        data = this._.sortBy(data, "value").reverse();
        this.piechart = chart.createPieChart("piechartdiv", data);
      } else {
        this.$message.error(personRes.msg);
      }
    },
    getColor(num) {
      let color = "";
      if (num < 0) {
        color = "#FDBCAE";
      } else if (num == 0) {
        color = "#FFFFFF";
      } else if (num < 10 && num > 0) {
        color = "#DBE6F9";
      } else if (num < 20 && num >= 10) {
        color = "#C3D8FF";
      } else if (num < 30 && num >= 20) {
        color = "#ADC4FF";
      } else if (num < 40 && num >= 30) {
        color = "#8AABFF";
      } else if (num < 50 && num >= 40) {
        color = "#5E8AFB";
      } else if (num >= 50) {
        color = "#366DFB";
      }
      return color;
    },
    getTargetLog(startTime) {
      this.startTime = startTime;
      this.endTime = this.$moment(startTime).endOf("day").valueOf();
      this.logDate =
        this.$moment(startTime).format("M") +
        "月" +
        this.$moment(startTime).format("D") +
        "日";
      this.page = 1;
      this.logList = [];
      this.getLog(this.page, this.limit);
    },
    async getLog(page, limit) {
      if (this.page == 1) {
        this.logList = [];
      }
      let dataRes = null;
      if (this.vitalityType == 3) {
        dataRes = await api.auth.getGroupLog({
          groupKey: this.vitalityInfo._key,
          startTime: this.startTime,
          endTime: this.endTime,
          curPage: page,
          perPage: limit,
        });
      } else if (this.vitalityType != 3) {
        dataRes = await api.auth.getUserLog({
          targetUKey: this.vitalityInfo._key,
          startTime: this.startTime,
          endTime: this.endTime,
          curPage: page,
          perPage: limit,
        });
      }
      if (dataRes.msg == "OK") {
        dataRes.result.forEach((item) => {
          item.createTime = this.$moment(item.createTime).format("HH:mm:ss");
          this.logList.push(item);
        });
        this.logtotal = dataRes.totalNumber;
      } else {
        this.$message.error(dataRes.msg);
      }
    },
    //滚动加载
    scrollLogLoading(e) {
      //文档内容实际高度（包括超出视窗的溢出部分）
      let scrollHeight = e.target.scrollHeight;
      //滚动条滚动距离
      let scrollTop = e.target.scrollTop;
      //窗口可视范围高度
      let clientHeight = e.target.clientHeight;
      console.log(clientHeight + scrollTop);
      console.log(scrollHeight);
      if (
        clientHeight + scrollTop >= scrollHeight - 2 &&
        this.logList.length < this.logtotal
      ) {
        this.page = this.page + 1;
        this.getLog(this.page, this.limit);
      }
    },
    formatMonth(time, arr) {
      this.monthTitleArr.unshift(this.$moment(time).format("M") + "月");
      let weekIndex = this.$moment(time).day();
      for (let i = weekIndex - 1; i > -1; i--) {
        arr.unshift({
          color: "#FFFFFF",
          date: "",
          value: "",
        });
      }
      return arr;
    },
    changeMonth(type) {
      let personStartTime = 0;
      let personEndTime = 0;
      //当前时间
      if (type == 0) {
        personStartTime = this.$moment(this.targetTime)
          .subtract(1, "month")
          .startOf("month")
          .startOf("day")
          .valueOf();
        personEndTime = this.$moment(this.targetTime)
          .subtract(1, "month")
          .endOf("month")
          .endOf("day")
          .valueOf();
        this.targetMonthStr =
          this.$moment(this.targetTime).subtract(1, "month").format("YYYY") +
          "/" +
          this.$moment(this.targetTime).subtract(1, "month").format("MM");
      } else {
        personStartTime = this.$moment(this.targetTime)
          .add(1, "month")
          .startOf("month")
          .startOf("day")
          .valueOf();
        personEndTime = this.$moment(this.targetTime)
          .add(1, "month")
          .endOf("month")
          .endOf("day")
          .valueOf();
        this.targetMonthStr =
          this.$moment(this.targetTime).add(1, "month").format("YYYY") +
          "/" +
          this.$moment(this.targetTime).add(1, "month").format("MM");
      }
      this.targetTime = personStartTime;
      this.getPersonVitality(personStartTime, personEndTime);
    },
    toDoc() {
      window.open(
        "https://baoku.qingtime.cn/OHPRQG_1585745644894/article?key=1249218647"
      );
    },
  },
  watch: {
    vitalityKey: {
      handler(newValue, oldValue) {
        if (newValue != oldValue) {
          this.logList = [];
          this.monthData = [];
          this.monthTitleArr = [];
          this.getData();
        }
      },
      immediate: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.vitality-container {
  width: 95%;
  height: 95%;
  padding: 19px 32px;
  box-sizing: border-box;
  background-color: #fff;
  position: relative;
}
.vitality-top {
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(239, 239, 239, 1);
}
.vitality-img {
  width: 40px;
  height: 40px;
  overflow: hidden;
  border-radius: 50%;
  margin-right: 9px;
}
.vitality-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.vitality-top-info {
  width: calc(100% - 40px);
  height: 60px;
}

.vitality-title {
  width: 100%;
  height: 30px;
  font-size: 14px;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  display: flex;
  align-items: center;
}
.vitality-top-title,
.vitality-bottom-title {
  display: flex;
  height: 29px;
  justify-content: flex-start;
  font-size: 16px;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
}
.vitality-top-title > div,
.vitality-bottom-title > div {
  height: 29px;
  line-height: 29px;
}
.vitality-bottom-title > div {
  width: 100%;
}
.vitality-bottom-title {
  font-size: 12px;
  font-weight: 400;
  color: rgba(153, 153, 153, 1);
}
.vitality-top-num {
  display: flex;
  margin-left: 10px;
}
.vitality-numImg {
  width: 18px;
  height: 12px;
  margin: 0px 5px;
}
.vitality-numImg img {
  width: 100%;
  height: 100%;
}
.vitality-chart {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-items: flex-start;
  box-sizing: border-box;
  margin-bottom: 10px;
  position: relative;
}
.vitality-chart-title {
  width: 100%;
  height: 25px;
  line-height: 25px;
  display: flex;
}
.vitality-chart-info {
  width: 100%;
  height: 250px;
  display: flex;
  margin-top: 10px;
}
.vitality-month {
  width: 30%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
}
.vitality-week {
  width: 90%;
  height: 500px;
}
.vitality-month-container,
.vitality-log-container {
  width: 100%;
  height: calc(100% - 35px);
  display: flex;
  flex-wrap: wrap;
  overflow: auto;
}

.vitality-month-info {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  // border: 1px solid rgba(151, 151, 151, 1);
  position: relative;
  padding-left: 40px;
  box-sizing: border-box;
}
.vitality-month-title {
  height: 36px;
  position: absolute;
  top: 0px;
  left: 0px;
  line-height: 36px;
  font-size: 16px;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
}
.vitality-month-item {
  width: calc(96% / 7);
  // height: 200px;
}
.vitality-month-item-day {
  height: 36px;
  margin-right: 1px;
  margin-bottom: 1px;
  box-sizing: border-box;
  text-align: center;
  line-height: 36px;
  color: #333;
}
.vitality-month-item-title {
  height: 17px;
  font-size: 12px;
  font-weight: 400;
  color: rgba(94, 138, 251, 1);
  line-height: 17px;
  text-align: center;
  border: 1px solid transparent;
  margin-right: 1px;
  margin-bottom: 1px;
}
.vitality-log {
  width: 70%;
  padding: 0px 10px;
  box-sizing: border-box;
}
.vitality-log-container {
  padding: 0px 5px;
  box-sizing: border-box;
}
.vitality-msg {
  width: 100%;
  height: 26px;
  font-size: 12px;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  line-height: 26px;
  display: flex;
  align-items: center;
}
.vitality-msg > div {
  margin-right: 5px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.close-icon {
  position: absolute;
  top: 10px;
  right: 20px;
  font-size: 22px;
}
.vitality-chart-info {
  width: 100%;
  height: calc(100% - 91px);
  display: flex;
  flex-wrap: wrap;
  overflow: auto;
  // justify-content: space-between;
}
.vitality-box {
  width: 100%;
  height: 280px;
  display: flex;
  justify-content: space-between;
}
.vitality-doc {
  position: absolute;
  top: 45px;
  right: 20px;
  font-size: 12px;
  font-weight: 400;
  color: rgba(94, 138, 251, 1);
  cursor: pointer;
}
.vitality-choose {
  width: 100px;
  height: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>