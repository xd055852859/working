<template>
  <div
    class="icon"
    :style="{width:width,height:height,margin:margin,backgroundImage:`url(${url})`}"
    @click="click(params)"
  ></div>
</template>

<script>
export default {
  name: "Icon",
  props: {
    width: {
      type: String,
      default: "32px"
    },
    height: {
      type: String,
      default: "32px"
    },
    margin: {
      type: String,
      default: "10px"
    },
    url: {
      type: String
    },
    iconSvg: {
      type: Object
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