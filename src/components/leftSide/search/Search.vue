<template>
  <div class="search" :style="{width:deviceState=='mobile'?(deviceWidth-60)+'px':'350px'}">
    <div class="search-wrapper">
      <!-- <div class="search-wrapper-nav">
        <div>搜索中心</div>
        <div class="search-close" @click="changeHeaderIndex(5)">
          <a-icon type="close" />
        </div>
      </div>-->
      <div class="search-title">
        <a-dropdown>
          <a-menu slot="overlay" @click="handleSearchClick">
            <a-menu-item
              v-for="(item, index) in searchType"
              :key="index"
              @click="searchIndex = index"
            >{{item}}</a-menu-item>
          </a-menu>
          <a-button style="margin-left: 8px">
            {{searchType[searchIndex]}}
            <a-icon type="down" />
          </a-button>
        </a-dropdown>
        <a-input-search placeholder="搜索卡片" v-model="searchInput" @search="onSearch" />
      </div>
      <div v-if="searchCardList.length==0" class="emptySearch">暂无搜索内容</div>
      <div class="search-panel" @scroll="scrollLoading" v-if="searchCardList.length>0">
        <div
          v-for="(item, index) in searchCardList"
          :key="index"
          class="search-panel-info"
          @click="chooseSearch(index,item._key)"
          :style="index===checkIndex?{boxShadow:' 0 0 7px 0 rgba(0, 0, 0, 0.26)',borderLeft: '3px solid #26cc94'}:null"
        >
          <div class="search-panel-title">
            <span>{{ item.title }}</span>
          </div>
          <div class="search-panel-name">
            <span>{{ item.groupName }}</span>
            <span>{{ item.creatorName }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { mapState, mapActions } from "vuex";
import { Tooltip, Button } from "ant-design-vue";
import CardItem from "../../content/card/CardItem";
export default {
  name: "Search",
  components: { CardItem },
  data() {
    return {
      searchInput: "",
      groupRoleState: true,
      checkIndex: null,
      searchIndex: 0,
      searchType: ["我的", "全平台"],
      page: 1
    };
  },
  computed: mapState({
    searchCardList: state => state.search.searchCardList,
    groupMemberList: state => state.group.groupMemberList,
    searchCardTotal: state => state.search.searchCardTotal,
    deviceState: state => state.common.deviceState,
    deviceWidth: state => state.common.deviceWidth
  }),
  methods: {
    ...mapActions("common", ["changeHeaderIndex"]),
    ...mapActions("group", ["addGroupMember"]),
    ...mapActions("card", [
      "setCardKey",
      "changeCardShowState",
      "changeCardDetailType"
    ]),
    ...mapActions("search", [
      "getSearchList",
      "clearSearchList",
      "getCardSearch",
      "setCardSearch"
    ]),
    handleSearchClick(e) {
      this.searchIndex = e.key;
    },
    //选择权限
    onSearch(value, e) {
      this.searchInput = value;
      this.page = 1;
      this.setCardSearch([]);
      if (value != "") {
        this.getCardSearch({
          searchType: this.searchIndex + 1,
          curPage: this.page,
          perPage: 10,
          searchCondition: value
        });
      }

      e.stopPropagation();
    },
    chooseSearch(index, key) {
      this.checkIndex = index;
      this.changeCardShowState(true);
      this.changeCardDetailType(1);
      this.setCardKey(key);
    },
    scrollLoading(e) {
      // console.log(e.target.scrollTop, this.page * 100);
      // if (
      //   e.target.scrollTop < this.page * 100 &&
      //   this.searchCardList.length < this.searchCardTotal
      // ) {
      //   this.page = this.page + 1;
      //   this.getCardSearch({
      //     searchType: this.searchIndex + 1,
      //     curPage: this.page,
      //     perPage: 10,
      //     searchCondition: this.searchInput
      //   });
      // }
      //文档内容实际高度（包括超出视窗的溢出部分）
      let scrollHeight = e.target.scrollHeight;
      //滚动条滚动距离
      let scrollTop = e.target.scrollTop;
      //窗口可视范围高度
      let clientHeight = e.target.clientHeight;
      if (
        clientHeight + scrollTop >= scrollHeight &&
        this.searchCardList.length < this.searchCardTotal
      ) {
        this.page = this.page + 1;
        this.getCardSearch({
          searchType: this.searchIndex + 1,
          curPage: this.page,
          perPage: 10,
          searchCondition: this.searchInput
        });
      }
    }
  },
  watch: {
    searchInput: {
      handler(newValue, oldValue) {
        if (oldValue != newValue && newValue == "") {
          this.setCardSearch([]);
          this.page = 1;
        }
      },
      immediate: true,
      deep: true
    }
  }
};
</script>

<style scoped>
.search-wrapper {
  width: 100%;
  height: 100%;
  /* border-right: 1px solid #d5d5d5; */
  box-shadow: 3px 2px 6px rgba(0, 0, 0, 0.4);
  position: relative;
}
/* .search-wrapper-nav {
  width: 100%;
  height: 45px;
  padding: 0px 16px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
} */
.search-panel {
  width: 100%;
  height: calc(100% - 53px);
  overflow: auto;
}

.search-panel-info {
  width: 100%;
  height: 77px;
  display: flex;
  align-content: space-between;
  flex-wrap: wrap;
  padding: 10px 12px;
  box-sizing: border-box;
  border: 1px solid #eeeeee;
}
.search-panel-info:hover {
  background: #e3edfd;
  box-shadow: 0 0 7px 0 rgba(0, 0, 0, 0.26);
}

.search-panel-title {
  width: 100%;
  font-size: 14px;
  color: #23384b;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.search-panel-name span {
  width: 100%;
  font-size: 12px;
  color: #8091a0;
  margin-right: 10px;
}
.emptySearch {
  height: calc(100% - 53px);
  position: absolute;
  top: 53px;
  left: 0px;
  bottom: 0px;
  right: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>