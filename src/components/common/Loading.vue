<template>
  <div class="loading">
    <a-spin size="large" />
  </div>
</template>

<script>
import Vue from "vue";
export default {
  name: "Loading"
};
</script>

<style scoped>
.loading {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  /* background-color: rgba(0, 0, 0, 0.3); */
  z-index: 1000;
}
</style>