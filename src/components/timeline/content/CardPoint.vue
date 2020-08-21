<template>
  <div class="card-point">
    <div class="card-point-header">
      <a-dropdown :style="{marginRight:'44px'}">
        <a class="ant-dropdown-link" href="#">
          <a-icon type="plus" :style="{fontSize:'20px'}" />
          <a-icon type="down" />
        </a>
        <a-menu slot="overlay">
          <a-menu-item>
            <div>
              <a-icon type="check" :style="{marginRight:'10px'}" />增加节点
            </div>
          </a-menu-item>
          <a-menu-item>
            <div>
              <a-icon type="check" :style="{marginRight:'10px'}" />增加子节点
            </div>
          </a-menu-item>
          <a-menu-item>
            <div>
              <a-icon type="check" :style="{marginRight:'10px'}" />增加链接
            </div>
          </a-menu-item>
          <a-menu-item>
            <div>
              <a-icon type="check" :style="{marginRight:'10px'}" />增加文章
            </div>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
      <a-icon type="arrow-up" :style="{marginRight:'20px',fontSize:'20px'}" />
      <a-icon type="arrow-down" :style="{fontSize:'20px'}" />
    </div>
    <div class="card-point-container"></div>
  </div>
</template>

<script>
import Vue from "vue";
import { Dropdown, Menu } from "ant-design-vue";
export default {
  name: "CardPoint"
};
</script>

<style scoped>
.card-point {
  width: 452px;
  height: 100%;
  position: absolute;
  top: 0px;
  left: 328px;
  z-index: 5;
}
.card-point-header {
  width: 100%;
  height: 40px;
  background-color: #e3e3e9;
  padding: 0px 5%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}
.card-point-container {
  width: 100%;
  height: calc(100% - 40px);
  overflow: auto;
  background: #eeeeee;
}
</style>