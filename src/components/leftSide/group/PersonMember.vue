<template>
  <div class="personMember">
    <a-input
      placeholder="搜索"
      v-model="searchInput"
      @pressEnter="changeSearch"
      allow-clear
      ref="searchInput"
      class="personMember-search"
      :style="{width:'100%'}"
    >
      <a-icon slot="suffix" type="search" color="#dedede" @click="changeSearch" />
    </a-input>
    <div
      v-for="(item,index) in contactMainGroupMemberList"
      :key="'person'+index"
      class="personMember-item"
    >
      <div class="personMember-item-title">
        <div class="personMember-item-avatar">
          <img :src="item|defaultPerson" alt />
        </div>
        <div>{{item.nickName}}</div>
      </div>
      <div class="personMember-item-button">
        <div
          :style="{color:item.isCare?'#4F8EF2':null,marginRight:'5px'}"
          @click.stop="item.isCare?changeCare(item.userId,1,0):changeCare(item.userId,1,1)"
        >{{item.isCare?'已关注':'设为关注'}}</div>|
        <div :style="{marginLeft:'5px'}">
          <a-popconfirm
            title="是否删除该好友?"
            @confirm="deleteGroupMember(index,item)"
            okText="确认"
            cancelText="取消"
          >删除好友</a-popconfirm>
        </div>
      </div>
    </div>
    <div v-for="(item,index) in searchMemberList" :key="'search'+index" class="personMember-item">
      <div :style="{width:'100%',height:'100%',display:'flex'}">
        <div class="personMember-item-title">
          <div class="personMember-item-avatar">
            <img :src="item|defaultPerson" alt />
          </div>
          <div>{{item.nickName}}</div>
        </div>
        <div class="personMember-item-button" @click="addMember(item)">
          <div>加为好友</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "PersonMember",
  computed: {
    ...mapState({
      user: (state) => state.auth.user,
      mainGroupMemberList: (state) => state.group.mainGroupMemberList,
      searchMemberList: (state) => state.search.searchMemberList,
      groupKey: (state) => state.group.groupKey,
    }),
  },
  data() {
    return {
      searchInput: "",
      contactMainGroupMemberList: [],
    };
  },
  mounted() {
    this.contactMainGroupMemberList = this._.cloneDeep(
      this.mainGroupMemberList.filter((item) => {
        return item.userId != this.user._key;
      })
    );
  },
  methods: {
    ...mapActions("group", [
      "dealCareFriendOrGroup",
      "removeMainGroupMember",
      "addMainGroupMember",
    ]),
    ...mapActions("search", ["getSearchList", "clearSearchList"]),
    changeCare(key, type, status) {
      this.dealCareFriendOrGroup({
        type: type,
        friendOrGroupKey: key,
        status: status,
      });
    },
    changeSearch(e) {
      this.searchInput = e.target.value;
      let arr = this._.cloneDeep(this.mainGroupMemberList);
      if (this.searchInput != "") {
        this.contactMainGroupMemberList = [];
        arr.forEach((item, index) => {
          if (item.nickName.indexOf(this.searchInput) != -1) {
            this.contactMainGroupMemberList.push(item);
          }
        });
        this.getSearchList({
          param: {
            name: this.searchInput,
            typeGroupOrUser: 2,
            typeIsOrNot: 2,
          },
          type: 1,
        });
      } else {
        this.contactMainGroupMemberList = this._.cloneDeep(
          this.mainGroupMemberList.filter((item) => {
            return item.userId != this.user._key;
          })
        );
        this.clearSearchList();
      }
    },
    async addMember(item) {
      this.addMainGroupMember({
        groupKey: localStorage.getItem("mainGroupKey"),
        targetUidList: [
          {
            userKey: item._key,
            nickName: item.nickName,
            avatar: item.avatar,
            gender: 0,
            role: 5,
          },
        ],
      });
      // this.searchInput = "";
    },
    deleteGroupMember(index, item) {
      this.removeMainGroupMember({
        param: {
          groupKey: this.groupKey,
          targetUKeyList: [item.userId],
        },
        index: index,
      });
      this.contactMainGroupMemberList.splice(index, 1);
    },
  },
  watch: {
    searchInput(newValue, oldValue) {
      if (newValue != oldValue && newValue == "") {
        this.contactMainGroupMemberList = this._.cloneDeep(
          this.mainGroupMemberList.filter((item) => {
            return item.userId != this.user._key;
          })
        );
        this.clearSearchList();
      }
    },
    mainGroupMemberList: {
      handler(newVal) {
        this.contactMainGroupMemberList = this._.cloneDeep(
          newVal.filter((item) => {
            return item.userId != this.user._key;
          })
        );
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.personMember {
  height: 100%;
  width: 100%;
  overflow: auto;
  position: relative;
}
.personMember-search {
  margin-bottom: 10px;
}
.personMember-item {
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  line-height: 46px;
}
.personMember-item-title {
  width: 70%;
  height: 100%;
  display: flex;
  align-items: center;
}
.personMember-item-avatar {
  width: 45px;
  height: 45px;
  overflow: hidden;
  margin-right: 10px;
}
.personMember-item-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.personMember-item-button {
  width: 30%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-right: 10px;
  cursor: pointer;
  color: #999999;
}
</style>