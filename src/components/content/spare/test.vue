<template>
  <div>
    <tree :nodes="nodes" :startId="'123'" />
  </div>
</template>

<script>
import Vue from "vue";
import TreeGraph from "tree-graph-vue";
Vue.use(TreeGraph);
export default {
  name: "test",
  data() {
    return {
      nodes: [
        {
          id: "123",
          text: "测试树型列表",
          fatherId: "",
          children: [],
          contract: false,
          showAvatar: false,
          showCheckbox: false,
          checked: false,
          showStatus: false,
          hour: 1,
          limitDay: 1
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
</style>