<template>
  <div class="search-dialog">
    <div class="search-dialog-title">
      <div class="search-dialog-title-name">搜索历史</div>
      <div class="search-dialog-button">清空历史</div>
    </div>
    <div class="search-dialog-container">
      <a-row class="search-dialog-item" v-for="(item,index) in 20" :key="index">
        <a-col :span="4">
          <div class="search-dialog-img">
            <img
              src="https://cdn.jsdelivr.net/gh/froala/design-blocks@2.0.1/dist/imgs/people/1.jpg"
              alt
            />
          </div>
        </a-col>
        <a-col :span="20">
          <div class="search-dialog-name">马伟</div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
export default {
  name: "ChatDialog"
};
</script>

<style scoped>
.search-dialog-title {
  width: calc(100% - 36px);
  height: 45px;
  display: flex;
  justify-content: space-between;
  margin: 0px 24px;
  box-sizing: border-box;
  line-height: 45px;
  border-bottom: 1px solid #e7e7e7;
}
.search-dialog-title .search-dialog-title-name {
  font-size: 14px;
  color: #23384b;
}
.search-dialog-title .search-dialog-button {
  font-size: 13px;
  color: #1aca8e;
}
.search-dialog-container {
  height: 455px;
  overflow: auto;
  position: relative;
}
.search-dialog-container::-webkit-scrollbar {
  width: 6px;
}
.search-dialog-item {
  height: 64px;
  padding: 11px 0px 11px 21px;
  box-sizing: border-box;
  /* display: flex;
  align-items: center; */
}
.search-dialog-item:hover {
  background-color: #e3edfd;
}
.search-dialog-item .search-dialog-img {
  width: 40px;
  height: 40px;
  overflow: hidden;
}
.search-dialog-item .search-dialog-img img {
  width: 100%;
}
.search-dialog-item .search-dialog-name {
  height: 40px;
  line-height: 40px;
  margin-left: 15px;
  font-size: 14px;
  color: #23384b;
}
</style>