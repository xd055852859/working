<template>
  <div
    class="contact-wrapper"
    :style="deviceState=='mobile'?{marginTop:'50px',height:'calc(100%-50px)',width:'70%'}:null"
  >
    <!-- @change="searchContact" -->
    <div class="search-title">
      <a-input
        placeholder="搜索"
        v-model="searchInput"
        @pressEnter="changeSearch"
        ref="searchInput"
        class="contact-search"
        :style="'100%'"
      >
        <a-icon slot="suffix" type="search" color="#dedede" @click="changeSearch" />
      </a-input>
      <div
        class="add-button flex-center"
        ref="searchButton"
        @click="createNewGroup"
        v-if="deviceState!='mobile'&&headerIndex==2"
      >
        <a-icon type="plus" />
      </div>
      <div
        class="add-button flex-center"
        @click="changeHeaderIndex(6)"
        v-if="deviceState=='mobile'"
      >
        <a-icon type="close" />
      </div>
      <!-- <div class="add-button flex-center" @click="changeHeaderIndex(5)">
        <a-icon type="close" />
      </div>-->
    </div>
    <div class="contact-panel" v-if="headerIndex==1" @scroll="scrollLoading">
      <a-collapse accordion v-model="activeKey">
        <a-collapse-panel
          :header="'联系人('+(searchInput!=''?total?total:0:contactMainGroupMemberList.length)+')'"
          key="1"
          :showArrow="false"
          class="contanct-panel-item"
        >
          <div
            v-for="(item,index) in contactMainGroupMemberList"
            :key="'groupMember'+index"
            class="contact-panel-info"
            @click="searchInput!=''&&searchIndex>0?'':contactSetGroupKey(0,item.userId,item,index)"
            @mouseenter="chooseIndex=index"
            :style="index===checkIndex?{boxShadow:' 0 0 7px 0 rgba(0, 0, 0, 0.26)',borderLeft: '3px solid #26cc94'}:null"
          >
            <div class="contact-panel-content">
              <div class="contact-panel-img">
                <img :src="item|defaultPerson" alt />
              </div>
              <div class="contact-panel-title">
                <div class="contact-panel-title-name" :style="{height:searchState?'50%':'100%'}">
                  <div
                    class="contact-panel-title-name-info"
                    :style="searchState? {alignItems:'center',maxWidth:'70%'}:{alignItems:'center',width:'100%'}"
                  >{{item.nickName}}</div>
                  <div
                    class="contact-care-img"
                    v-if="searchState&&!item.isCare&&chooseIndex==index"
                    @click.stop="changeCare(item.userId,1,1)"
                  >
                    <img :src="uncareImg" alt />
                  </div>
                  <div
                    class="contact-care-img"
                    v-if="searchState&&item.isCare"
                    @click.stop="changeCare(item.userId,1,0)"
                  >
                    <img :src="careImg" alt />
                  </div>
                </div>
                <div
                  class="contact-vitality"
                  @click.stop="showVitality(2,item.userId)"
                  v-if="searchState"
                >
                  <div
                    :style="{height:'100%',display:'flex',alginItem:'flex-end'}"
                    v-if="searchState"
                  >
                    <VitalityIcon :vitalityNum="item.energyValueTotal" />
                  </div>
                  <!-- 任务数 {{item.todayTotalTaskNumber}} / 工时 {{item.todayTotalTaskHours}} / 活力 -->
                  <span
                    v-if="item.todayEnergyValue"
                    :style="{backgroundColor:item.todayEnergyValue>0?'#86B93F':'#E94848',borderRadius:'8px',padding:'0px 6px',boxSizng:'border-box',color:'#fff',height:'20px',lineHeight:'20px',marginLeft:item.energyValueTotal>10?'5px':'0px'}"
                  >{{item.todayEnergyValue>0?"+":null}}{{item.todayEnergyValue}}</span>
                </div>
              </div>
            </div>
            <!-- <div class="vitality-icon" @click.stop="showVitality(2,item.userId)">
              <img :src="vitalityIcon" alt />
            </div>-->
            <a-tooltip @click.stop="addMember(item)" v-if="!searchState&&!item.isMyMainGroupMember">
              <template slot="title">添加好友</template>
              <a-icon type="plus-square" :style="{fontSize:'20px'}" />
            </a-tooltip>
            <div class="contanct-day" v-if="item.todayTotalTaskNumber>0">
              <a-tooltip placement="right">
                <template
                  slot="title"
                >今日任务:{{item.todayTotalTaskNumber}},今日工时:{{item.todayTotalTaskHours}}</template>
                <div
                  class="contanct-time-day"
                  :style="{left:item.todayTotalTaskNumber<10? '5px':'0px'}"
                >{{item.todayTotalTaskNumber}}</div>
                <div class="contanct-time"></div>
                <div
                  class="contanct-time-hour"
                  :style="{right:item.todayTotalTaskHours<1? '5px':'0px'}"
                >{{item.todayTotalTaskHours}}</div>
              </a-tooltip>
            </div>
          </div>
        </a-collapse-panel>
      </a-collapse>
    </div>
    <div class="contact-panel" v-if="headerIndex==2" @scroll="scrollLoading">
      <a-collapse accordion v-model="activeKey">
        <a-collapse-panel
          :header="'项目/群组('+(searchInput!=''?total?total:0:contactGroupList.length)+')'"
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
            @mouseenter="chooseIndex=index"
            v-show="headerIndex==2"
          >
            <div class="contact-panel-content">
              <div class="contact-panel-img">
                <img :src="item.groupLogo|defaultGroup" alt />
              </div>
              <div class="contact-panel-title">
                <div class="contact-panel-title-name" :style="{height:searchState?'50%':'100%'}">
                  <div
                    class="contact-panel-title-name-info"
                    :style="searchState? {alignItems:'center',maxWidth:'70%'}:{alignItems:'center',width:'100%'}"
                  >{{item.groupName}}</div>
                  <div
                    class="contact-care-img"
                    v-if="searchState&&!item.isCare&&chooseIndex==index"
                    @click.stop="changeCare(item.userId,1,1)"
                  >
                    <img :src="uncareImg" alt />
                  </div>
                  <div
                    class="contact-care-img"
                    v-if="searchState&&item.isCare"
                    @click.stop="changeCare(item.userId,1,0)"
                  >
                    <img :src="careImg" alt />
                  </div>
                </div>
                <div
                  class="contact-vitality"
                  @click.stop="showVitality(3,item._key)"
                  v-if="searchState"
                >
                  <div
                    :style="{height:'100%',display:'flex',alginItem:'flex-end'}"
                    v-if="searchState"
                  >
                    <VitalityIcon :vitalityNum="item.energyValueTotal" />
                  </div>
                  <!-- 任务数 {{item.todayTotalTaskNumber}} / 工时 {{item.todayTotalTaskHours}} / 活力 -->
                  <span
                    v-if="item.todayEnergyValue"
                    :style="{backgroundColor:item.todayEnergyValue>0?'#86B93F':'#E94848',borderRadius:'8px',padding:'0px 6px',boxSizng:'border-box',color:'#fff',height:'20px',lineHeight:'20px',marginLeft:item.energyValueTotal>10?'5px':'0px'}"
                  >{{item.todayEnergyValue>0?"+":null}}{{item.todayEnergyValue}}</span>
                </div>
              </div>
            </div>
            <a-icon
              class="contact-care-img"
              type="login"
              :style="{fontSize:'20px'}"
              v-if="!searchState"
              @click.stop="invitePerson(item._key)"
            />
            <!-- <div class="vitality-icon" @click.stop="showVitality(3,item._key)">
              <img :src="vitalityIcon" alt />
            </div>-->
            <div class="contanct-day" v-if="item.todayTotalTaskNumber>0">
              <a-tooltip placement="right">
                <template
                  slot="title"
                >今日任务: {{item.todayTotalTaskNumber}} ,今日工时: {{item.todayTotalTaskHours}} </template>
                <div
                  class="contanct-time-day"
                  :style="{left:item.todayTotalTaskNumber<10? '5px':'0px'}"
                >{{item.todayTotalTaskNumber}}</div>
                <div class="contanct-time"></div>
                <div
                  class="contanct-time-hour"
                  :style="{right:item.todayTotalTaskHours<1? '5px':'0px'}"
                >{{item.todayTotalTaskHours}}</div>
              </a-tooltip>
            </div>
          </div>
          <!-- <div :style="{display:'flex'}">
              <div
                v-if="searchIndex==0"
                class="taskNum"
              >{{item.myNotFinishTaskNumber?item.myNotFinishTaskNumber:0}}</div>
              <div
                v-if="searchIndex==0"
                class="taskAllNum"
              >{{item.allNotFinishTaskNumber?item.allNotFinishTaskNumber:0}}</div>
          </div>-->
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
    <a-dropdown :trigger="['click']" class="contact-sort">
      <a class="ant-dropdown-link" @click="e => e.preventDefault()">
        <img :src="sortPng" class="contact-sort-img" />
      </a>
      <a-menu slot="overlay">
        <a-menu-item key="0" @click="contactSort(1)">访问排序</a-menu-item>
        <a-menu-item key="1" @click="contactSort(2)">关注排序</a-menu-item>
        <a-menu-item key="3" @click="contactSort(3)">活力值排序</a-menu-item>
      </a-menu>
    </a-dropdown>
  </div>
  <!-- <div class="content-container">
      <iframe src="https://baoku.qingtime.cn/sgkj" width="100%" height="100%"></iframe>
  </div>-->
</template>

<script>
import Vue from "vue";
import { mapState, mapActions } from "vuex";
import GroupSet from "../group/GroupSet";
import VitalityIcon from "../../index/VitalityIcon";
import Invite from "../../Invite";
import { Collapse } from "ant-design-vue";
import careImg from "@/assets/care.png";
import uncareImg from "@/assets/uncare.png";
import vitalityIcon from "@/assets/vitality-icon.png";
import sortPng from "@/assets/sort.png";
import api from "@/services/api";
export default {
  name: "Contact",
  components: { GroupSet, Invite, VitalityIcon },
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
      inviteGroupState: false,
      careImg,
      uncareImg,
      chooseIndex: null,
      vitalityIcon: vitalityIcon,
      page: 1,
      limit: 17,
      total: 0,
      sortPng: sortPng,
    };
  },
  props: ["vitalityState", "vitalityType", "vitalityKey"],
  computed: {
    ...mapState({
      user: (state) => state.auth.user,
      contactList: (state) => state.contact.contactList,
      groupList: (state) => state.group.groupList,
      groupState: (state) => state.group.groupState,
      groupKey: (state) => state.group.groupKey,
      inviteKey: (state) => state.group.inviteKey,
      contactInvite: (state) => state.group.contactInvite,
      mainGroupMemberList: (state) => state.group.mainGroupMemberList,
      searchObj: (state) => state.search.searchObj,
      searchMemberList: (state) => state.search.searchMemberList,
      searchGroupList: (state) => state.search.searchGroupList,
      deviceState: (state) => state.common.deviceState,
      deviceWidth: (state) => state.common.deviceWidth,
      headerIndex: (state) => state.common.headerIndex,
      theme: (state) => state.auth.theme,
    }),
    searchState() {
      return this.searchInput.trim() == "";
    },
  },
  mounted() {
    // if (this.user) {
    //   if (this.mainGroupMemberList.length > 0) {
    //     this.contactMainGroupMemberList = this.mainGroupMemberList;
    //   }
    //   if (this.groupList.length > 0) {
    //     this.contactGroupList = this.groupList;
    //   } else {
    //     this.getGroupList({ listType: 3 });
    //   }
    // }
  },
  methods: {
    ...mapActions("auth", [
      "setTargetUserInfo",
      "getTargetUserInfo",
      "setTheme",
    ]),
    ...mapActions("group", [
      "changeGroupSetState",
      "createGroup",
      "getGroupInfo",
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
      "getInviteInfo",
      "dealCareFriendOrGroup",
    ]),
    ...mapActions("card", [
      "setCardKey",
      "setCardDetail",
      "changeCardShowState",
      "changeCardDetailType",
      "setLinkState",
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
    changeSearch(e) {
      this.searchInput = e.target.value;
      this.contactGroupList = [];
      this.contactMainGroupMemberList = [];
      if (this.searchInput != "") {
        // this.getSearchList({
        //   param: {
        //     name: this.searchInput,
        //     typeGroupOrUser:
        //       this.headerIndex == 1 ? 2 : this.headerIndex == 2 ? 1 : null,
        //     typeIsOrNot: this.searchIndex + 1,
        //   },
        //   type: this.headerIndex,
        // });
        if (this.headerIndex == 1) {
          this.getSearchPerson(this.page, this.limit);
        } else if (this.headerIndex == 2) {
          this.getSearchGroup(this.page, this.limit);
        }
      }
    },
    async getSearchPerson(page, limit) {
      let res = await api.search.searchUserNew({
        searchCondition: this.searchInput,
        curPage: page,
        perPage: limit,
      });
      if (res.msg == "OK") {
        this.contactMainGroupMemberList.push(...res.result);
        this.total = res.totalNumber;
      } else {
        this.$message.error(res.msg);
      }
    },
    async getSearchGroup(page, limit) {
      let res = await api.search.searchGroupNew({
        searchCondition: this.searchInput,
        curPage: page,
        perPage: limit,
      });
      if (res.msg == "OK") {
        this.contactGroupList.push(...res.result);
        this.total = res.totalNumber;
      } else {
        this.$message.error(res.msg);
      }
    },
    scrollLoading(e) {
      if (this.searchInput != "") {
        let scrollHeight = e.target.scrollHeight;
        //滚动条滚动距离
        let scrollTop = e.target.scrollTop;
        //窗口可视范围高度
        let clientHeight = e.target.clientHeight;
        if (this.headerIndex == 1) {
          if (
            clientHeight + scrollTop >= scrollHeight &&
            this.contactMainGroupMemberList.length < this.total
          ) {
            this.page = this.page + 1;
            this.getSearchPerson(this.page, this.limit);
          }
        } else if (this.headerIndex == 2) {
          if (
            clientHeight + scrollTop >= scrollHeight &&
            this.contactGroupList.length < this.total
          ) {
            this.page = this.page + 1;
            this.getSearchGroup(this.page, this.limit);
          }
        }
      }
    },
    // searchMyGroup(e) {
    //   if (this.searchIndex == 0) {
    //     let searchItem = e.target.value;
    //     let arr = [];
    //     if (this.headerIndex == 1) {
    //       arr = this._.cloneDeep(this.mainGroupMemberList);
    //       this.contactMainGroupMemberList = [];
    //       arr.forEach((item, index) => {
    //         if (item.nickName.indexOf(searchItem) != -1) {
    //           this.contactMainGroupMemberList.push(item);
    //         }
    //       });
    //     } else if (this.headerIndex == 2) {
    //       arr = this._.cloneDeep(this.groupList);
    //       this.contactGroupList = [];
    //       arr.forEach((item, index) => {
    //         if (item.groupName.indexOf(searchItem) != -1) {
    //           this.contactGroupList.push(item);
    //         }
    //       });
    //     }
    //   }
    // },

    contactSetGroupKey(num, key, item, index) {
      if (num === 0) {
        let username = "",
          groupName = "";
        if (key === this.user._key) {
          this.setGroupType(1);
        } else {
          this.setGroupType(2);
        }
        this.userKeyToGroupKey({ targetUKey: key });
        this.getTargetUserInfo({ key: key });
        localStorage.setItem("userKey", key);
        this.checkIndex = index;
        // if (item.rocketChat && item.rocketChat.username) {
        //   username = item.rocketChat.username;
        //   groupName = item.nickName;
        // } else {
        //   username = item.mobile;
        //   groupName = item.nickName;
        // }
        // document.querySelector("iframe").contentWindow.postMessage(
        //   {
        //     eventName: "go-chat",
        //     data: { username: username, type: "d", groupName: groupName }
        //   },
        //   "https://im.qingtime.cn"
        // );
        api.group.visitGroupOrFriend({ type: 1, targetUGKey: key });
      } else if (num === 1) {
        this.setGroupKey(key);
        this.setGroupType(3);
        this.checkIndex = index + this.mainGroupMemberList.length;
        // document.querySelector("iframe").contentWindow.postMessage(
        //   {
        //     eventName: "go-chat",
        //     data: {
        //       username: item.groupUUID,
        //       groupName: item.groupName,
        //       type: "c",
        //       groupLogo: item.groupLogo
        //     }
        //   },
        //   "https://im.qingtime.cn"
        // );
        api.group.visitGroupOrFriend({ type: 2, targetUGKey: key });
      }
      this.changeCardShowState(false);
      this.changeCardDetailType(1);
      this.changeHeaderIndex(6);
      this.setCardKey(0);
      this.setCardDetail(null);
      this.setCardMemberList([]);
      this.setLabelKey(0);
      this.setLinkState(0);
    },
    addMember(item) {
      this.addMainGroupMember({
        groupKey: localStorage.getItem("mainGroupKey"),
        targetUidList: [
          {
            userKey: item.userId,
            nickName: item.nickName,
            avatar: item.avatar,
            gender: item.gender,
            role: 5,
          },
        ],
      });
      this.searchInput = "";
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
        key: groupKey,
      });
    },
    confirmPassword() {},
    changeCare(key, type, status) {
      this.dealCareFriendOrGroup({
        type: type,
        friendOrGroupKey: key,
        status: status,
      });
    },
    showVitality(type, key) {
      this.$emit("update:vitalityState", true);
      this.$emit("update:vitalityType", type);
      this.$emit("update:vitalityKey", key);
    },
    //访问排序
    contactSort(sortType) {
      if (this.headerIndex == 1) {
        this.getMainGroupMember({
          groupId: localStorage.getItem("mainGroupKey"),
          sortType: sortType,
        });
        this.setTheme({
          configInfo: {
            personSortType: sortType,
          },
        });
      } else if (this.headerIndex == 2) {
        this.getGroupList({ listType: 3, sortType: sortType });
        this.setTheme({
          configInfo: {
            groupSortType: sortType,
          },
        });
      }
    },
    getData() {
      this.contactGroupList = this.groupList;
      this.contactMainGroupMemberList = this.mainGroupMemberList;
    },
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
      if (newVal != oldVal) {
        this.contactGroupList = newVal;
      }
    },
    // searchIndex(newVal, oldVal) {
    //   if (newVal == 0 && newVal != oldVal) {
    //     this.contactGroupList = this.groupList;
    //     this.contactMainGroupMemberList = this.mainGroupMemberList;
    //   }
    // },
    mainGroupMemberList(newVal, oldVal) {
      if (newVal != oldVal) {
        this.contactMainGroupMemberList = newVal;
      }
    },
    searchInput: {
      handler(newVal, oldVal) {
        if (newVal != oldVal) {
          if (newVal == "") {
            if (this.headerIndex == 1) {
              this.getMainGroupMember({
                groupId: localStorage.getItem("mainGroupKey"),
                sortType: this.theme.personSortType
                  ? this.theme.personSortType
                  : 1,
              });
            } else if (this.headerIndex == 2) {
              this.getGroupList({
                listType: 3,
                sortType: this.theme.groupSortType
                  ? this.theme.groupSortType
                  : 1,
              });
            }
          } else {
            this.contactGroupList = [];
            this.contactMainGroupMemberList = [];
          }
        }
      },
      immediate: true,
    },
    // searchMemberList: {
    //   handler(newVal, oldVal) {
    //     // if (newVal.length > 0) {
    //     this.contactMainGroupMemberList = newVal;
    //     // }
    //   },
    //   deep: true,
    // },
    // searchGroupList: {
    //   handler(newVal, oldVal) {
    //     // if (newVal.length > 0) {
    //     this.contactGroupList = newVal;
    //     // }
    //   },
    //   deep: true,
    // },
    groupType(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.changeCardShowState(false);
        this.changeCardDetailType(1);
        this.setCardKey(0);
        this.setCardDetail(null);
      }
    },
    headerIndex: {
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.page = 1;
          if (newVal == 1) {
            this.getMainGroupMember({
              groupId: localStorage.getItem("mainGroupKey"),
              sortType: this.theme.personSortType
                ? this.theme.personSortType
                : 1,
            });
          } else if (newVal == 2) {
            this.getGroupList({
              listType: 3,
              sortType: this.theme.groupSortType ? this.theme.groupSortType : 1,
            });
          }
          this.chooseIndex = null;
          this.searchInput = "";
        }
      },
      immediate: true,
    },
  },
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
  min-height: 63px;
  padding: 3.5px 7.5px;
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
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}
.contact-panel-info .contact-panel-title {
  width: calc(100% - 45px);
  height: 100%;
  text-align: left;
  display: flex;
  flex-wrap: wrap;
}
.contact-panel-info .contact-panel-title-name {
  width: 100%;
  display: flex;
  align-items: center;
}
.contact-panel-info .contact-panel-title-name-info {
  height: 100%;
  margin-right: 5px;
  display: flex;
  align-items: center;
}
.contact-panel-info .contact-panel-img {
  width: 40px;
  height: 40px;
  overflow: hidden;
  margin-right: 5px;
  border-radius: 10px;
  display: flex;
  align-items: flex-end;
}
.contact-panel-info .contact-panel-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.taskNum,
.taskAllNum {
  width: 32px;
  height: 20px;
  line-height: 20px;
  background-color: #1aca8e;
  color: #fff;
  text-align: center;
  /* margin-left: 5px; */
  /* border-radius: 30px; */
}
.taskNum {
  background-color: #bbb7b1;
  border-top-left-radius: 30px;
  border-bottom-left-radius: 30px;
}

.taskAllNum {
  border-top-right-radius: 30px;
  border-bottom-right-radius: 30px;
}
.contact-care-img {
  width: 16px;
  height: 14.5px;
  display: flex;
  align-items: center;
  cursor: pointer;
}
.contact-care-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.vitality-icon {
  width: 32px;
  height: 18px;
  margin-right: 3px;
  transform: scale(0.7, 0.7);
  cursor: pointer;
}
.vitality-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.contact-sort {
  position: absolute;
  top: 65px;
  right: 12px;
}
.contact-sort-img {
  width: 13px;
  height: 16px;
}
.contact-vitality {
  color: #666;
  font-size: 11px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.contanct-day {
  width: 25px;
  height: 25px;
  line-height: 25px;
  padding: 3px 0px 0px 6px;
  color: #fff;
  background-color: #535353;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  margin-right: 5px;
  font-size: 12px;
  margin-top: 4px;
}
.contanct-time {
  width: 0;
  height: 0;
  border-width: 25px;
  border-style: solid;
  border-color: #35a6f8 transparent transparent transparent;
  position: absolute;
  top: -2px;
  right: -25px;
}
.contanct-time-hour {
  width: 10px;
  height: 10px;
  line-height: 10px;
  font-size: 8px;
  color: #fff;
  position: absolute;
  top: 2px;
  left: 9px;
  z-index: 1;
  transform: scale(0.8);
  text-align: center;
}
.contanct-time-day {
  width: 10px;
  height: 10px;
  line-height: 10px;
  font-size: 10px;
  color: #fff;
  position: absolute;
  bottom: 0px;
  z-index: 3;
  text-align: center;
}
</style>
