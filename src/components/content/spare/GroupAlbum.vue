<template>
  <div class="group-album">
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
    <div class="group-album-container">
      <div
        class="group-album-item"
        v-for="(item,index) in 50"
        :key="index"
        @contextmenu.prevent="(e)=>{showContext(e,index)}"
        :id="index"
      >
        <div class="group-album-img">
          <img
            src="https://cdn.jsdelivr.net/gh/froala/design-blocks@2.0.1/dist/imgs/people/2.jpg"
            alt
          />
        </div>
        <div class="group-album-title">明治维新之迷</div>
        <div class="group-album-name">大设计组</div>
      </div>
    </div>
    <div class="group-album-contextmenu" ref="context">
      <div @click="savealbum">
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
  name: "GroupAlbum",
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
    savealbum() {
      // this.$refs.context.style.top = "-200px";
    }
  }
};
</script>

<style scoped>
.group-album {
  width: 100%;
  height: 100%;
  position: relative;
}
.group-album-container {
  width: 100%;
  height: calc(100% - 54px);
  padding-left: 30px;
  box-sizing: border-box;
  overflow: auto;
  display: flex;
  flex-wrap: wrap;
}
.group-album-item {
  width: 100px;
  height: 100px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-right: 15px;
  margin-bottom: 20px;
}
.group-album-img {
  width: 60px;
  height: 60px;
  overflow: hidden;
}
.group-album-img img {
  width: 100%;
  height:100%;
  object-fit: cover;
}
.group-album-title {
  width: 100%;
  text-align: center;
  font-size: 12px;
}
.group-album-name {
  width: 100%;
  text-align: center;
  font-size: 10px;
  color: #a9b4be;
}
.group-album-contextmenu {
  width: 90px;
  height: 105px;
  position: fixed;
  top: -200px;
  left: 0px;
  z-index: 3;
}
.group-album-contextmenu div {
  width: 100%;
  height: 35px;
  font-size: 10px;
  background-color: #fff;
  display: flex;
  align-items: center;
}
.group-album-contextmenu div:hover {
  background-color: #e3edfd;
  cursor: pointer;
}
</style>