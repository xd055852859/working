<template>
  <div class="canlder-container">
    <div class="canlder-chose-month">
      <i class="canlder-control-month" @click="subMonth">
        <a-icon type="left" />
      </i>
      <span class="canlder-cur-month">{{ calendar.params.curYear }}年{{ calendar.params.curMonth }}月</span>
      <i class="canlder-control-month" @click="pluMonth">
        <a-icon type="right" />
      </i>
    </div>
    <div class="canlder-header">
      <div
        class="canlder-header-item"
        v-for="(item, index) in WEEKTABLE.common.cns"
        :key="index"
      >{{ item }}</div>
    </div>
    <div class="canler-content">
      <a-popover
        trigger="click"
        placement="right"
        v-model="item.visible"
        v-for="(item, index) in dayarr"
        :key="index"
      >
        <template slot="content">
          <div class="canler-task-add-container">
            <div class="add-list">
              <a-icon type="calendar" />
              <span style="margin-left:10px;">创建日程</span>
            </div>
            <div class="add-list" @click="addTask">
              <a-icon type="check-square" />
              <span style="margin-left:10px;">创建任务</span>
            </div>
          </div>
        </template>
        <div
          :class="`canler-item ${!item.isThisMonth && 'not-this-month'} ${item.visible && 'canler-item-chose'}`"
        >
          <div class="canler-num">
            <div v-if="item.selected" class="canler-today">{{ item.dayNum }}</div>
            <span v-else>{{ item.dayNum }}</span>
          </div>
          <div class="canler-list-detail">
            <div class="list-detail-item">demo1</div>
          </div>
        </div>
      </a-popover>
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "Naotu",
  mounted() {
    this.dayarr = this.getMonthDaysArray(
      this.calendar.params.curYear,
      this.calendar.params.curMonth,
      this.calendar.params.curDate
    );
  },
  data() {
    return {
      visible: false,
      WEEKTABLE: {
        common: {
          cn: [
            "星期日",
            "星期一",
            "星期二",
            "星期三",
            "星期四",
            "星期五",
            "星期六"
          ],
          cns: ["日", "一", "二", "三", "四", "五", "六"],
          en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        }
      },
      dayarr: [],
      calendar: {
        params: {
          curYear: new Date().getFullYear(),
          curMonth: new Date().getMonth() + 1,
          curDate: new Date().getDate(),
          curEventsDate: "all"
        },

        options: {
          weekStartOn: 0
        }
      }
    };
  },
  methods: {
    subMonth() {
      this.countMonthAndYear(this.calendar.params.curMonth - 1);
    },
    pluMonth() {
      this.countMonthAndYear(this.calendar.params.curMonth + 1);
    },
    //修正年月
    fixedYM(year, month) {
      if (+month === 0) {
        year = +year - 1;
        month = 12;
      }

      if (+month === 13) {
        year = +year + 1;
        month = 1;
      }
      return [year, month];
    },
    //获取某年某月有多少天
    getMonthDays(year, month) {
      const YM = this.fixedYM(year, month);
      return new Date(YM[0], YM[1], 0).getDate();
    },
    //返回某年某月某日是星期几
    getWeekday(year, month, day = this.calendar.params.curDate) {
      const YM = this.fixedYM(year, month);
      return moment(new Date(YM[0], YM[1] - 1, day)).day();
    },
    getMonthDaysArray(year, month, day) {
      if (
        typeof day === "undefined" &&
        year === this.calendar.params.curYear &&
        month === this.calendar.params.curMonth
      )
        day = this.calendar.params.curDate;
      let dayArrays = [];
      const days = this.getMonthDays(year, month),
        preDays = this.getMonthDays(year, month - 1);
      const thisMonthFirstDayInWeek = this.getWeekday(year, month, 1),
        thisMonthLastDayInWeek = this.getWeekday(year, month, days);
      for (let i = 0; i < thisMonthFirstDayInWeek; i++) {
        dayArrays.push({
          dayNum: preDays - thisMonthFirstDayInWeek + i + 1,
          weekDay: this.WEEKTABLE.common.cn[i]
        });
      }
      for (let i = 1; i <= days; i++) {
        const weekDayFlag = (thisMonthFirstDayInWeek + i - 1) % 7;
        dayArrays.push({
          dayNum: i,
          weekDay: this.WEEKTABLE.common.cn[weekDayFlag],
          selected:
            i === +day &&
            this.calendar.params.curMonth === new Date().getMonth() + 1,
          isThisMonth: true
        });
      }
      for (let i = 1; i <= 6 - thisMonthLastDayInWeek; i++) {
        const weekDayFlag = (thisMonthFirstDayInWeek + days + i - 1) % 7;
        dayArrays.push({
          dayNum: i,
          weekDay: this.WEEKTABLE.common.cn[weekDayFlag]
        });
      }
      dayArrays = dayArrays.map(item => ({ ...item, visible: false }));
      return dayArrays;
    },
    countMonthAndYear(month) {
      const arr = this.fixedYM(this.calendar.params.curYear, month);
      this.calendar.params.curYear = arr[0];
      this.calendar.params.curMonth = arr[1];
      this.dayarr = this.getMonthDaysArray(
        this.calendar.params.curYear,
        this.calendar.params.curMonth,
        this.calendar.params.curDate
      );
    },
    addTask() {}
  }
};
</script>

<style>
.canlder-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: calc(100vh - 20px);
}
.canlder-header {
  width: 100%;
  background-color: #fff;
  height: 35px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
.canlder-header-item {
  width: calc(100% / 7);
  line-height: 35px;
  border-right: 1px solid #ddd;
  font-size: 14px;
  text-align: center;
}
.canler-content {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
  border: 1px solid #ddd;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  background-color: #fff;
}
.canler-item {
  width: calc(100% / 7);
  height: calc(100% / 5);
  border-right: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  user-select: none;
  overflow: hidden;
}
.canler-item-chose {
  box-shadow: inset 0px 0px 5px 3px #cdeefd;
}
.canler-item:focus {
  outline: -webkit-focus-ring-color auto 5px;
}
.canler-num {
  padding: 8px 0 0 8px;
  margin-bottom: 4px;
  color: #424242;
  font-size: 13px;
  pointer-events: none;
}
.canler-today {
  width: 20px;
  height: 20px;
  padding: 2px;
  border-radius: 50%;
  background-color: rgba(3, 169, 244, 0.8);
  color: #fff;
  text-align: center;
}
.not-this-month {
  background-color: rgba(0, 0, 0, 0.05);
}
.canler-task-add-container {
  width: 130px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}
.add-list {
  line-height: 24px;
  padding-left: 15px;
  width: 100%;
  cursor: pointer;
  color: #595959;
  outline: 0 none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.add-list:hover {
  background-color: rgba(0, 0, 0, 0.05);
}
.ant-popover-inner-content {
  padding: 3px 0;
}
.canler-list-detail {
  width: 100%;
  height: calc(100% - 30px);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.list-detail-item {
  width: 95%;
  font-size: 12px;
  text-align: left;
  color: #015880;
  background-color: #cdeefd;
  cursor: pointer;
  z-index: 10;
  border-radius: 2px;
  line-height: 22px;
  font-weight: bold;
}
.list-detail-item:not(:first-child) {
  margin-top: 2px;
}
.canlder-chose-month {
  background-color: #fff;
  width: 100%;
  height: 40px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #ddd;
}
.canlder-cur-month {
  font-size: 24px;
  font-weight: 400;
}
.canlder-control-month {
  font-size: 14px;
  cursor: pointer;
}
.canlder-control-month:first-child {
  margin-right: 10px;
}
.canlder-control-month:not(:first-child) {
  margin-left: 10px;
}
</style>
