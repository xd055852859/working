<template>
  <div
    class="contact-wrapper"
    :style="deviceState=='phone'?{marginTop:'50px',height:'calc(100%-50px)',width:'70%'}:null"
  >
    <div class="search-title">
      <a-dropdown>
        <a-menu slot="overlay">
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
      <a-input-search
        placeholder="搜索"
        v-model="searchInput"
        ref="searchInput"
        class="contact-search"
        @search="changeSearch"
        :style="{width:'65%'}"
      />
      <div
        class="add-button flex-center"
        ref="searchButton"
        @click="createNewGroup"
        v-if="deviceState!='phone'&&headerIndex==2"
      >
        <a-icon type="plus" />
      </div>
      <div class="add-button flex-center" @click="changeHeaderIndex(5)" v-if="deviceState=='phone'">
        <a-icon type="close" />
      </div>
      <!-- <div class="add-button flex-center" @click="changeHeaderIndex(5)">
        <a-icon type="close" />
      </div>-->
    </div>
    <div class="contact-panel" v-if="headerIndex==1">
      <a-collapse accordion v-model="activeKey">
        <a-collapse-panel
          :header="'联系人('+contactMainGroupMemberList.length+')'"
          key="1"
          :showArrow="false"
          class="contanct-panel-item"
        >
          <div
            v-for="(item,index) in contactMainGroupMemberList"
            :key="'groupMember'+index"
            class="contact-panel-info"
            @click="searchInput!=''&&searchIndex>0?'':contactSetGroupKey(0,item.userId,item,index)"
            :style="index===checkIndex?{boxShadow:' 0 0 7px 0 rgba(0, 0, 0, 0.26)',borderLeft: '3px solid #26cc94'}:null"
          >
            <div class="contact-panel-content">
              <div class="contact-panel-img">
                <img :src="item.avatar|defaultPerson" alt />
              </div>
              <div class="contact-panel-title">{{item.nickName}}</div>
            </div>
            <a-tooltip @click.stop="addMember(item,0)" v-if="searchInput!=''&&searchIndex>0">
              <template slot="title">添加好友</template>
              <a-icon type="plus-square" :style="{fontSize:'20px'}" />
            </a-tooltip>
          </div>
        </a-collapse-panel>
      </a-collapse>
    </div>
    <div class="contact-panel" v-if="headerIndex==2">
      <a-collapse accordion v-model="activeKey">
        <a-collapse-panel
          :header="'项目/群组('+contactGroupList.length+')'"
          key="1"
          :showArrow="false"
          class="contanct-panel-item"
        >
          <div
            class="contact-panel-info"
            v-for="(item,index) in contactGroupList"
            :key="'group'+index"
            @click="searchInput!=''&&searchIndex>0?'':contactSetGroupKey(1,item._key,item,index)"
            :style="index+contactMainGroupMemberList.length===checkIndex?{boxShadow:' 0 0 7px 0 rgba(0, 0, 0, 0.26)',borderLeft: '3px solid #26cc94'}:null"
            v-show="headerIndex==2"
          >
            <div class="contact-panel-content">
              <div class="contact-panel-img">
                <img :src="item.groupLogo|defaultGroup" alt />
              </div>
              <div class="contact-panel-title">{{item.groupName}}</div>
            </div>
            <a-icon
              type="login"
              :style="{fontSize:'20px'}"
              v-if="searchInput!=''&&searchIndex>0"
              @click.stop="invitePerson(item._key)"
            />
          </div>
        </a-collapse-panel>
      </a-collapse>
    </div>
    <a-modal
      title="群状态管理"
      :visible="groupSetState"
      @ok="createGroupSet"
      @cancel="groupSetState=false"
      :createState="createState"
      :bodyStyle="{ height: '550px', paddingTop: '14px' }"
      :style="{ top: '25px' }"
      width="850px"
    >
      <GroupSet @saveGroupSet="saveGroupSet" />
    </a-modal>
    <a-modal title="加群" :visible="contactInvite" @cancel="setContactInvite(false)" :footer="null">
      <Invite />
    </a-modal>
  </div>
  <!-- <div class="content-container">
      <iframe src="https://baoku.qingtime.cn/sgkj" width="100%" height="100%"></iframe>
  </div>-->
</template>

<script>
import Vue from "vue";
import { mapState, mapActions } from "vuex";
import GroupSet from "../group/GroupSet";
import Invite from "../Invite";
import { Collapse } from "ant-design-vue";
export default {
  name: "Contact",
  components: { GroupSet, Invite },
  data() {
    return {
      searchInput: "",
      activeKey: ["1"],
      searchIndex: 0,
      groupSetState: false,
      checkIndex: 0,
      contactGroupList: [],
      contactMainGroupMemberList: [],
      createState: false,
      searchType: ["我的", "全平台"],
      createGroupObj: {},
      chooseItem: {},
      chooseType: 0,
      inviteGroupState: false
    };
  },
  computed: mapState({
    user: state => state.auth.user,
    contactList: state => state.contact.contactList,
    groupList: state => state.group.groupList,
    groupState: state => state.group.groupState,
    groupKey: state => state.group.groupKey,
    inviteKey: state => state.group.inviteKey,
    contactInvite: state => state.group.contactInvite,
    mainGroupMemberList: state => state.group.mainGroupMemberList,
    searchObj: state => state.search.searchObj,
    searchMemberList: state => state.search.searchMemberList,
    searchGroupList: state => state.search.searchGroupList,
    deviceState: state => state.common.deviceState,
    deviceWidth: state => state.common.deviceWidth,
    headerIndex: state => state.common.headerIndex
  }),
  mounted() {
    if (this.user) {
      if (localStorage.getItem("mainGroupKey")) {
        if (this.mainGroupMemberList.length > 0) {
          this.contactMainGroupMemberList = this.mainGroupMemberList;
        } else {
          this.getMainGroupMember({
            groupId: localStorage.getItem("mainGroupKey")
          });
        }
      }
      if (this.groupList.length > 0) {
        this.contactGroupList = this.groupList;
      } else {
        this.getGroupList({ listType: 3 });
      }
    }
  },
  methods: {
    ...mapActions("auth", ["setTargetUserInfo"]),
    ...mapActions("contact", ["getContacks", "getGroups", "changeContactShow"]),
    ...mapActions("group", [
      "changeGroupSetState",
      "createGroup",
      "getGroupList",
      "getGroupMember",
      "getMainGroupMember",
      "getGroupContact",
      "setGroupKey",
      "setGroupType",
      "userKeyToGroupKey",
      "addGroupMember",
      "addMainGroupMember",
      "setCardMemberList",
      "applyJoinGroup",
      "setContactInvite",
      "setInviteKey",
      "getInviteInfo"
    ]),
    ...mapActions("card", [
      "setCardKey",
      "setCardDetail",
      "changeCardShowState",
      "changeCardDetailType"
    ]),
    ...mapActions("common", ["changeHeaderIndex"]),
    ...mapActions("search", ["getSearchList", "clearSearchList"]),
    ...mapActions("task", ["setLabelKey"]),
    createNewGroup() {
      this.groupSetState = true;
      this.createState = "test";
    },
    // handleSearchClick() {
    // this.contactGroupList = this.groupList;
    // this.contactMainGroupMemberList = this.mainGroupMemberList;
    // this.clearSearchList();
    //   this.searchInput = "";
    // },
    //新建群
    createGroupSet() {
      this.createGroup(this.createGroupObj);
      this.groupSetState = false;
    },
    saveGroupSet(obj) {
      this.createGroupObj = obj;
    },
    changeSearch(value) {
      this.searchInput = value;
      this.contactGroupList = [];
      this.contactMainGroupMemberList = [];
      if (this.searchInput != "") {
        this.getSearchList({
          param: {
            name: this.searchInput,
            typeGroupOrUser:
              this.headerIndex == 1 ? 2 : this.headerIndex == 2 ? 1 : null,
            typeIsOrNot: this.searchIndex + 1
          },
          type: this.headerIndex
        });
      }
    },
    contactSetGroupKey(num, key, item, index) {
      if (num === 0) {
        if (key === this.user._key) {
          this.setGroupType(1);
        } else {
          this.setGroupType(2);
        }
        this.userKeyToGroupKey({ targetUKey: key });
        this.setTargetUserInfo(item);
        this.checkIndex = index;
        let username = "";
        if (item.rocketChat && item.rocketChat.username) {
          username = item.rocketChat.username;
        } else {
          username = item.mobile;
        }
        document.querySelector("iframe").contentWindow.postMessage(
          {
            eventName: "go-chat",
            data: { username: username, type: "d" }
          },
          "https://im.qingtime.cn"
        );
      } else if (num === 1) {
        this.setGroupKey(key);
        this.setGroupType(3);
        this.checkIndex = index + this.mainGroupMemberList.length;
        document.querySelector("iframe").contentWindow.postMessage(
          {
            eventName: "go-chat",
            data: { username: item.groupName, type: "c" }
          },
          "https://im.qingtime.cn"
        );
      }
      this.changeCardShowState(false);
      this.changeCardDetailType(1);
      this.changeHeaderIndex(6);
      this.setCardKey(0);
      this.setCardDetail({});
      this.setCardMemberList([]);
      this.setLabelKey(0);
    },
    addMember(item, type) {
      if (type == 0) {
        this.addMainGroupMember({
          groupKey: localStorage.getItem("mainGroupKey"),
          targetUidList: [
            {
              userKey: item._key,
              nickName: item.nickName,
              avatar: item.avatar,
              gender: 0,
              role: 5
            }
          ]
        });
      }
      // else if (type == 1) {
      //   this.addGroupMember({
      //     param: {
      //       groupKey: item._key,
      //       targetUidList: [
      //         {
      //           userKey: this.user._key,
      //           nickName: this.user.profile.nickName,
      //           avatar: this.user.profile.avatar,
      //           gender: 0,
      //           role: 5
      //         }
      //       ]
      //     },
      //     item: item,
      //     type: "group"
      //   });
      //   this.setInviteKey(item._key);
      // }
    },
    showPassword(item, type) {
      this.chooseItem = item;
      this.chooseType = type;
      this.passwordState = true;
    },
    invitePerson(groupKey) {
      this.setContactInvite(true);
      this.setInviteKey(groupKey);
      this.getInviteInfo({
        key: groupKey
      });
    },
    confirmPassword() {},
    getData() {
      this.getGroupList({ listType: 3 });
      if (localStorage.getItem("mainGroupKey")) {
        this.getMainGroupMember({
          groupId: localStorage.getItem("mainGroupKey")
        });
      }
    }
  },
  watch: {
    user(newVal, oldVal) {
      if (oldVal === null && newVal) {
        this.getData();
      }
    },
    groupKey(newVal, oldVal) {
      if (oldVal !== newVal) {
        this.getData();
        // this.contactGroupList = this.groupList;
        // this.contactMainGroupMemberList = this.mainGroupMemberList;
      }
    },
    groupList(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.contactGroupList = newVal;
      }
    },
    mainGroupMemberList(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.contactMainGroupMemberList = newVal;
      }
    },
    searchInput(newVal, oldVal) {
      if (newVal != oldVal) {
        if (newVal == "") {
          this.contactGroupList = this.groupList;
          this.contactMainGroupMemberList = this.mainGroupMemberList;
          console.log(
            "contactMainGroupMemberList",
            this.contactMainGroupMemberList
          );
          // this.clearSearchList({
          //   groupList: [],
          //   userList: []
          // });
        } else {
          this.contactGroupList = [];
          this.contactMainGroupMemberList = [];
        }
      }
    },
    searchMemberList: {
      handler(newVal, oldVal) {
        // if (newVal.length > 0) {
        this.contactMainGroupMemberList = newVal;
        // }
      },
      deep: true
    },
    searchGroupList: {
      handler(newVal, oldVal) {
        // if (newVal.length > 0) {
        this.contactGroupList = newVal;
        // }
      },
      deep: true
    },
    groupType(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.changeCardShowState(false);
        this.changeCardDetailType(1);
        this.setCardKey(0);
        this.setCardDetail({});
      }
    }
  }
};
</script>

<style scoped>
.contact-wrapper {
  width: 300px;
  height: 100%;
  box-shadow: 3px 2px 6px rgba(0, 0, 0, 0.4);
  background: #ffffff;
}
.contact-input {
  width: 80%;
  background: #ffffff;
  border-radius: 4.71px;
}
.contact-panel {
  width: 100%;
  height: calc(100% - 53px);
  overflow: auto;
}
.contanct-panel-item {
  /* width: 100%;
  height: 43px;
  padding: 0px 22px;
  line-height: 43px; */
  /* border-bottom: 1px solid #e7e7e7; */
}
.contact-search {
  margin-left: 5px;
}
.contact-panel-info {
  width: 100%;
  height: 55px;
  padding: 0px 10px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #23384b;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f3f3f3;
}
.contact-panel-info:hover {
  background: #e3edfd;
}
.contact-panel-content {
  width: 70%;
  height: 100%;
  display: flex;
  align-items: center;
}
.contact-panel-info .contact-panel-title {
  text-align: left;
}
.contact-panel-info .contact-panel-img {
  width: 40px;
  height: 40px;
  overflow: hidden;
  margin-right: 15px;
  border-radius: 10px;
}
.contact-panel-info .contact-panel-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>