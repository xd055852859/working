<template>
  <div class="hello" ref="chartdiv" id="chartdiv"></div>
</template>

<script>
import chart from "../../common/chart";
import { mapState, mapActions } from "vuex";

export default {
  name: "ChartData",
  data() {
    return {
      chart: null
    };
  },
  computed: mapState({
    allTaskArray: state => state.task.allTaskArray
  }),
  mounted() {
    let data = [];
    this._.flatten(this.allTaskArray).forEach(item => {
      if (item.taskEndDate) {
        data.push({
          category: "",
          // start: this.$moment(item.taskEndDate).format("YYYY-MM-DD HH:mm"),
          end: this.$moment(item.taskEndDate).format(
            "YYYY-MM-DD HH:mm"
          ),
          // color: colorSet.getIndex(15),
          text: item.title,
          textDisabled: false,
          icon: item.executorAvatar
        });
      }
    });
    this.chart = chart.createTimeLineChart("chartdiv", data);
  },

  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose();
    }
  }
};
</script>

<style lang="scss" scoped>
.hello {
  width: 100%;
  height: 500px;
}
</style>