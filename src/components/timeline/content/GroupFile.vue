<template>
  <div class="group-file"  @mouseleave="hideContext">
    <div class="content-menu">
      <a-dropdown>
        <a class="ant-dropdown-link">
          全部文件
          <a-icon type="down" />
        </a>
        <a-menu slot="overlay">
          <a-menu-item>
            <div>
              <a-icon type="check" :style="{marginRight:'10px'}" />全部文件
            </div>
          </a-menu-item>
          <a-menu-item>
            <div>
              <a-icon type="check" :style="{marginRight:'10px'}" />发送文件
            </div>
          </a-menu-item>
          <a-menu-item>
            <div>
              <a-icon type="check" :style="{marginRight:'10px'}" />接受文件
            </div>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
    <div class="group-file-container">
      <div
        class="group-file-item"
        v-for="(item,index) in 50"
        :key="index"
        @contextmenu.prevent="(e)=>{showContext(e,index)}"
        :id="index"
      >
        <div class="group-file-img">
          <img
            src="https://cdn.jsdelivr.net/gh/froala/design-blocks@2.0.1/dist/imgs/people/1.jpg"
            alt
          />
        </div>
        <div class="group-file-title">明治维新之迷</div>
        <div class="group-file-name">大设计组</div>
      </div>
    </div>
    <div class="group-file-contextmenu" ref="context">
      <div @click="saveFile">
        <a-icon type="check" :style="{fontSize:'15px',margin:'0px 10px'}" />另存为
      </div>
      <div>
        <a-icon type="check" :style="{fontSize:'15px',margin:'0px 10px'}" />转发
      </div>
      <div>
        <a-icon type="check" :style="{fontSize:'15px',margin:'0px 10px'}" />删除
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "GroupFile",
  data() {
    return {};
  },
  methods: {
    showContext(e, index) {
      let scrollX =
        document.documentElement.scrollLeft || document.body.scrollLeft;
      let scrollY =
        document.documentElement.scrollTop || document.body.scrollTop;
      let x = e.pageX || e.clientX + scrollX;
      let y = e.pageY || e.clientY + scrollY;
      // this.$refs.context.style.top = y + "px";
      // this.$refs.context.style.left = x + "px";
    },
    hideContext() {
      // this.$refs.context.style.top = "-200px";
    },
    saveFile() {
      this.hideContext();
    }
  }
};
</script>

<style scoped>
.group-file {
  width: 100%;
  height: 100%;
  position: relative;
}
.group-file-container {
  width: 100%;
  height: calc(100% - 54px);
  padding-left: 30px;
  box-sizing: border-box;
  overflow: auto;
  display: flex;
  flex-wrap: wrap;
}
.group-file-item {
  width: 100px;
  height: 100px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-right: 15px;
  margin-bottom: 20px;
}
.group-file-img {
  width: 60px;
  height: 60px;
  overflow: hidden;
}
.group-file-img img {
  width: 100%;
  height:100%;
  object-fit: cover;
}
.group-file-title {
  width: 100%;
  text-align: center;
  font-size: 12px;
}
.group-file-name {
  width: 100%;
  text-align: center;
  font-size: 10px;
  color: #a9b4be;
}
.group-file-contextmenu {
  width: 90px;
  height: 105px;
  position: fixed;
  top: -200px;
  left: 0px;
  z-index: 3;
}
.group-file-contextmenu div {
  width: 100%;
  height: 35px;
  font-size: 10px;
  background-color: #fff;
  display: flex;
  align-items: center;
}
.group-file-contextmenu div:hover {
  background-color: #e3edfd;
  cursor: pointer;
}
</style>