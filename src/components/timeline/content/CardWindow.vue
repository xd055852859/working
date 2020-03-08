<template>
  <div class="card-window" :style="{left:'0px'}">
    <div class="card-window-header">
      卡片库
      <a-icon type="ellipsis" class="card-window-icon" />
    </div>
    <div class="card-window-container">
      <CardItem v-for="(item,index) in 10" :key="index" :style="{width:'90%',marginLeft:'5%'}" />
    </div>
  </div>
</template>

<script>
import CardItem from "./CardItem";
export default {
  name: "CardWindow",
  components: { CardItem }
};
</script>

<style scoped>
.card-window {
  width: 328px;
  height: 100%;
  position: absolute;
  top: 0px;
  z-index: 5;
}
.card-window-header {
  width: 100%;
  height: 40px;
  background-color: #d9d9e4;
  font-size: 14px;
  color: #23384b;
  line-height: 40px;
  text-align: center;
}
.card-window-icon {
  float: right;
  font-size: 20px;
  line-height: 40px;
  margin-right: 5%;
}
.card-window-container {
  width: 100%;
  height: calc(100% - 40px);
  overflow: auto;
  background: #f8f8f8;
  /* box-shadow: 0 0 4px 0 rgba(174, 174, 174, 0.5); */
}
</style>