<template>
  <div class="icon" :style="{width:fontSize,height:fontSize,margin:margin}" @click="click(params)">
    <a-icon :style="{ fontSize: fontSize,color: color }" :component="iconSvg" />
  </div>
</template>

<script>
import Vue from "vue";
import { Icon } from "ant-design-vue";


export default {
  name: "SvgIcon",
  props: {
    fontSize: {
      type: String,
      default: "28px"
    },
    margin: {
      type: String,
      default: "15px 0"
    },
    url: {
      type: String
    },
    iconSvg: {
      type: Object
    },
    color: {
      type: String,
      default: "#CACAD9"
    },
    click: {
      type: Function,
      default: () => {}
    },
    params: Object
  }
};
</script>
<style scoped>
.icon {
  background-size: cover;
  background-position: center;
}
.icon:hover {
  cursor: pointer;
}
</style>