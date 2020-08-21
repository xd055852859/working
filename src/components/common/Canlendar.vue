<template>
  <div :style="{height:'100%',width:'100%'}">
    <FullCalendar
      defaultView="dayGridMonth"
      locale="zh-cn"
      firstDay="1"
      weekNumberCalculation="ISO"
      :buttonText="buttonText"
      :eventTimeFormat="eventTime"
      :header="header"
      :plugins="calendarPlugins"
      :events="calendarEvents"
      :height="'parent'"
      @dateClick="handleDateClick"
      @eventClick="handleEventClick"
      @eventDrop="handleEventDrop"
      @eventResize="handleEventResize"
      :editable="true"
      :eventStartEditable="true"
      :eventResizableFromStart="true"
      :eventDurationEditable="true"
      :dragScroll="true"
      :eventOverlap="true"
      :handleWindowResize="true"
      :unselectAuto="true"
      :slotEventOverlap="true"
    />
  </div>
</template>

<script>
// import FullCalendar from "@fullcalendar/vue";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import timeGridPlugin from "@fullcalendar/timegrid";
// import interactionPlugin from "@fullcalendar/interaction";
// import bootstrapPlugin from "@fullcalendar/bootstrap";
// import listPlugin from "@fullcalendar/list";
// import "@fullcalendar/core/main.css";
// import "@fullcalendar/daygrid/main.css";
// import "@fullcalendar/list/main.css";
// import "@fullcalendar/bootstrap/main.css";

export default {
  components: {
    FullCalendar
  },
  props: ["calendarEvents", "taskArray", "taskHtmlArray"],
  data() {
    return {
      calendarPlugins: [
        timeGridPlugin,
        dayGridPlugin,
        interactionPlugin,
        listPlugin,
        bootstrapPlugin
      ],
      themeSystem: "bootstrap",
      header: {
        left: "prev,next today",
        center: "title",
        // right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek"
        right: "dayGridMonth"
      },
      buttonText: {
        today: "今天",
        month: "月",
        week: "周",
        day: "天"
        // close: "fa-times",
        // prev: "fa-chevron-left",
        // next: "fa-chevron-right",
        // prevYear: "fa-angle-double-left",
        // nextYear: "fa-angle-double-right"
      },
      eventTime: {
        hour: "numeric",
        minute: "2-digit",
        hour12: false
      }

      // businessHours: {
      //   dow: [1, 2, 3, 4, 5], // 周一 - 周四
      //   start: "8:00", // 上午10点开始
      //   end: "17:00" // 下午18点结束
      // }
      //
    };
  },
  mounted () {
  },
  methods: {
    handleDateClick(arg) {
      //新增一个任务
      let that = this;
      let info = {};
      if (this.$moment(new Date()).format("YYYY-MM-DD") == arg.dateStr) {
        info.day = 1;
      } else {
        info.day =
          this.$moment(arg.dateStr).diff(this.$moment(new Date()), "day") + 2;
      }
      info.date = this.$moment(arg.dateStr).date();
      this.$confirm({
        title: "创建任务",
        content: "是否创建任务",
        cancelText: "取消",
        okText: "确认",
        onOk() {
          that.$emit("createCanlendarTask", info);
        }
        // onCancel() {},
      });
    },
    handleEventClick(info) {
      let that = this;
      info.el.style.borderColor = "red";
      if (info.jsEvent.ctrlKey) {
        this.$confirm({
          title: "删除任务",
          content: "是否移除该任务",
          cancelText: "取消",
          okText: "确认",
          onOk() {
            that.$emit("deleteCanlendarTask", info.event.id);
            info.event.remove();
          }
          // onCancel() {},
        });
      } else {
        this.$emit("showCanlendarTaskInfo", info.event.id);
      }
    },
    handleEventDrop(info) {
      this.$emit("editCanlendarTime", {
        id: info.event.id,
        day:
          this.$moment(info.event.end).diff(
            this.$moment(new Date().getTime()),
            "day"
          ) + 1,
        endTime: info.event.end.getTime()
      });
    },
    // {
    //   event.remove()
    // }
    handleEventResize(info) {
      let hour =
        (info.event.end.getTime() - info.event.start.getTime()) / 3600000;
      this.$emit("editCanlendarTime", {
        id: info.event.id,
        endTime: info.event.end.getTime(),
        hour: hour.toFixed(1)
      });
    }
    // changeInnerHtml(arr) {
    //   let nodeArr = Array.from(document.querySelectorAll(".fc-content"));
    //   console.log("xxxxx", nodeArr);
    //   nodeArr = nodeArr.map((item, index) => {
    //     item.innerHTML =
    //       `<img class="taskItem-img" src='${arr[index].executorAvatar}'/>` +
    //       item.innerHTML;
    //     return item;
    //   });
    // }
  },
  watch: {
    // taskArray: {
    //   handler(newVal) {
    //     console.log("newVal", newVal);
    //     this.changeInnerHtml(newVal);
    //   },
    //   immediate: true,
    //   deep: true
    // }
  }
};
</script>

<style>
@import "~@fullcalendar/core/main.css";
@import "~@fullcalendar/daygrid/main.css";
@import "~@fullcalendar/timegrid/main.css";
/* .fc-time {
  display: none !important;
} */
</style>