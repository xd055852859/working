<template>
  <a-tabs :defaultActiveKey="1" type="card" :activeKey="activeKey" @change="changeTab">
    <a-tab-pane tab="群成员" :key="1" class="group-member">
      <a-tabs
        class="group-member-person"
        :activeKey="tabKey"
        :defaultActiveKey="'tab'+1"
        @change="changeKey"
      >
        <!-- <a-tooltip slot="suffix" title="Extra information">
          <a-icon type="info-circle" style="color: rgba(0,0,0,.45)" />
        </a-tooltip>-->
        <a-tab-pane :tab="'联系人('+targetMemberList.length+')'" :key="'tab'+1">
          <a-input-search
            placeholder="搜索"
            v-model="searchInput"
            ref="userNameInput"
            class="group-member-search"
            @search="searchGroupMember"
          ></a-input-search>
          <div class="group-member-choose">
            <!-- <div class="group-member-title">
            联系人({{ targetMemberList.length }})-->
            <!-- <a-checkbox
            :indeterminate="indeterminate"
            @change="onCheckAllChange"
            :checked="checkAll"
            >全选</a-checkbox>-->
            <!-- </div> -->
            <div class="group-member-container">
              <a-row
                class="group-member-item"
                v-for="(item, index) in targetMemberList"
                :key="index"
              >
                <a-col :span="3">
                  <div class="group-member-img">
                    <img :src="item|defaultPerson" alt />
                  </div>
                </a-col>
                <a-col :span="17">
                  <div class="group-member-name">{{ item.nickName }}</div>
                </a-col>
                <a-col :span="4">
                  <div class="contact-time">
                    <a-checkbox
                      @change="
                    e => {
                      onChange(e, index);
                    }
                  "
                      :checked="item.checked"
                    ></a-checkbox>
                  </div>
                </a-col>
              </a-row>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane :key="'tab'+2" v-if="groupRole<3&&groupRole>0">
          <span slot="tab">
            <a-badge :status="joinMemberList.length>0?'error':null">申请人({{joinMemberList.length}})</a-badge>
          </span>
          <div class="group-member-container">
            <a-row class="group-member-item" v-for="(item, index) in joinMemberList" :key="index">
              <a-col :span="3">
                <div class="group-member-img">
                  <img :src="item|defaultPerson" alt />
                </div>
              </a-col>
              <a-col :span="14">
                <div class="group-member-name">{{ item.nickName }}</div>
              </a-col>
              <a-col :span="4">
                <div class="contact-time" @click="addMember(item)">
                  <a-button type="primary" size="small">允许</a-button>
                </div>
              </a-col>
              <a-col :span="3">
                <div
                  class="contact-time"
                  @click="deleteApplyJoinGroup({param:{applyJoinGroupKey:item._key},item:item})"
                >
                  <a-button size="small">拒绝</a-button>
                </div>
              </a-col>
            </a-row>
          </div>
        </a-tab-pane>
        <a-tab-pane :key="'tab'+3" :tab="'我的群'">
          <div class="group-member-container">
            <a-row class="group-member-item" v-for="(item, index) in myGroupList" :key="index">
              <a-col :span="3">
                <div class="group-member-img">
                  <img :src="item.groupLogo|defaultGroup" alt />
                </div>
              </a-col>
              <a-col :span="16">
                <div class="group-member-name">{{ item.groupName }}</div>
              </a-col>
              <a-col :span="3">
                <div class="contact-time" @click="setChildGroup(item._key,item)">
                  <a-button size="small">设为子群</a-button>
                </div>
              </a-col>
            </a-row>
          </div>
        </a-tab-pane>
      </a-tabs>
      <div class="group-member-team" v-if="tabKey!='tab3'">
        <div class="group-member-title">
          群权限设置
          <!-- <a-checkbox
            :indeterminate="indeterminate"
            @change="onCheckAllChange"
            :checked="checkAll"
          >全选</a-checkbox>-->
        </div>
        <div class="group-member-container contact-team-container">
          <a-row
            class="group-member-item"
            v-for="(item, index) in newMemberList"
            :key="index"
            @mouseenter.native="chooseIndex=index"
          >
            <a-col :span="3">
              <div class="group-member-img">
                <img :src="item|defaultPerson" alt />
              </div>
            </a-col>
            <a-col :span="15">
              <div class="group-member-name">{{ item.nickName}}</div>
            </a-col>
            <a-col :span="5">
              <div class="contact-time">
                <!-- <a v-if="groupRole==4" class="ant-dropdown-link">{{ roleTypeArr[item.role - 1] }}</a> -->
                <a-dropdown v-if="groupRole>0">
                  <a class="ant-dropdown-link">{{ roleTypeArr[item.role - 1]}}</a>
                  <a-menu slot="overlay" v-if="item.userId!=user._key&&groupRole<item.role">
                    <!-- <a-menu-item
                      @click="changeRole(0, index)"
                      v-if="groupRole==1"
                    >{{ roleTypeArr[0] }}</a-menu-item>-->
                    <a-menu-item
                      @click="changeRole(1, index)"
                      v-if="groupRole==1"
                    >{{ roleTypeArr[1] }}</a-menu-item>
                    <a-menu-item
                      @click="changeRole(2, index)"
                      v-if="groupRole==1||groupRole==2"
                    >{{ roleTypeArr[2] }}</a-menu-item>
                    <a-menu-item
                      @click="changeRole(3, index)"
                      v-if="groupRole<3"
                    >{{ roleTypeArr[3] }}</a-menu-item>
                    <a-menu-item
                      @click="changeRole(4, index)"
                      v-if="groupRole<4"
                    >{{ roleTypeArr[4] }}</a-menu-item>
                  </a-menu>
                </a-dropdown>
                <a-popconfirm
                  title="是否移除该群成员?"
                  @confirm="deleteGroupMember(index)"
                  okText="确认"
                  cancelText="取消"
                >
                  <a-icon
                    type="close-circle"
                    :style="{ fontSize: '20px' }"
                    v-if="groupRole>0&&groupRole<3&&item.userId!=user._key&&item.role>groupRole&&chooseIndex==index"
                  />
                </a-popconfirm>
              </div>
            </a-col>
          </a-row>
        </div>
      </div>
      <div class="group-member-team" v-if="tabKey=='tab3'">
        <div class="group-member-title">
          子群列表
          <!-- <a-checkbox
            :indeterminate="indeterminate"
            @change="onCheckAllChange"
            :checked="checkAll"
          >全选</a-checkbox>-->
        </div>
        <div class="group-member-container contact-team-container">
          <a-row
            class="group-member-item"
            v-for="(item, index) in childGroupList"
            :key="index"
            @mouseenter.native="chooseIndex=index"
          >
            <a-col :span="3">
              <div class="group-member-img">
                <img :src="item.groupLogo|defaultGroup" alt />
              </div>
            </a-col>
            <a-col :span="15">
              <div class="group-member-name">{{ item.groupName}}</div>
            </a-col>
            <a-col
              :span="6"
              :style="{display:'flex',alignItems:'center',justifyContent: 'space-between'}"
            >
              <div class="contact-time" @click="toGroup(item._key,item)">
                <a-button size="small">查看子群</a-button>
              </div>
              <a-popconfirm
                title="是否移除该子群?"
                @confirm="deleteSonGroup(item._key,index)"
                okText="确认"
                cancelText="取消"
              >
                <a-icon type="delete" />
              </a-popconfirm>
            </a-col>
          </a-row>
        </div>
        <a-popconfirm
          title="是否解散该群组"
          okText="确认"
          cancelText="取消"
          @confirm="deleteTargetGroup"
          class="deleteGroup-icon"
          v-if="groupRole==1"
        >
          <a-tooltip title="解散群组">
            <a-icon type="delete" :style="{fontSize:'20px'}" />
          </a-tooltip>
        </a-popconfirm>
        <a-popconfirm
          title="是否退出该群组"
          okText="确认"
          cancelText="取消"
          @confirm="outTargetGroup"
          class="outGroup-icon"
          v-if="groupRole!=1"
        >
          <a-tooltip title="退出群组">
            <a-icon type="logout" :style="{fontSize:'20px'}" />
          </a-tooltip>
        </a-popconfirm>
      </div>
      <a-popconfirm
        title="是否解散该群组"
        okText="确认"
        cancelText="取消"
        @confirm="deleteTargetGroup"
        class="deleteGroup-icon"
        v-if="groupRole==1"
      >
        <a-tooltip title="解散群组">
          <a-icon type="delete" :style="{fontSize:'20px'}" />
        </a-tooltip>
      </a-popconfirm>
      <a-popconfirm
        title="是否退出该群组"
        okText="确认"
        cancelText="取消"
        @confirm="outTargetGroup"
        class="outGroup-icon"
        v-if="groupRole!=1"
      >
        <a-tooltip title="退出群组">
          <a-icon type="logout" :style="{fontSize:'20px'}" />
        </a-tooltip>
      </a-popconfirm>
    </a-tab-pane>
    <a-tab-pane tab="群属性" :key="2">
      <GroupSet :groupState="1" @saveGroupSet="saveGroupSet" />
    </a-tab-pane>
  </a-tabs>

  <!-- <a-modal
      title="提示信息"
      :visible="visible"
      @ok="removeGroupMember"
      @cancel="visible = false"
    >
      <p>是否确认删除该群成员</p>
  </a-modal>-->
</template>

<script>
import Vue from "vue";
import { mapState, mapActions } from "vuex";
// import {
//   Input,
//   Icon,
//   Tooltip,
//   Row,
//   Col,
//   Checkbox,
//   Popconfirm
// } from "ant-design-vue";
import api from "../../../services/api";
import GroupSet from "./GroupSet";
// import ContactItem from "./ContactItem";
export default {
  name: "GroupMember",
  data() {
    return {
      search: "",
      targetMemberList: [],
      addMemberList: [],
      newMemberList: [],
      myGroupList: [],
      childGroupList: [],
      roleTypeArr: ["群主", "管理员", "编辑", "作者", "群成员"],
      visible: false,
      memberKeyArr: [], //群成员key数组
      searchInput: "",
      activeKey: 1,
      chooseIndex: null,
      tabKey: "tab1",
    };
  },
  components: {
    GroupSet,
  },
  computed: mapState({
    user: (state) => state.auth.user,
    mainGroupMemberList: (state) => state.group.mainGroupMemberList,
    groupMemberList: (state) => state.group.groupMemberList,
    groupKey: (state) => state.group.groupKey,
    groupRole: (state) => state.group.groupRole,
    groupInfo: (state) => state.group.groupInfo,
    searchMemberList: (state) => state.search.searchMemberList,
    joinMemberList: (state) => state.group.joinMemberList,
  }),
  mounted() {
    // this.getData(this.groupMemberList);
    if (this.mainGroupMemberList.length == 0) {
      this.getMainGroupMember({
        groupId: localStorage.getItem("mainGroupKey"),
      });
    }
  },
  methods: {
    ...mapActions("group", [
      "removeGroupMember",
      "getMainGroupMember",
      "outGroup",
      "deleteGroup",
      "applyJoinGroupList",
      "addGroupMember",
      "deleteApplyJoinGroup",
      "setGroupKey",
      "setCardMemberList",
      "setGroupType",
      "userKeyToGroupKey",
      "getGroupList",
    ]),
    ...mapActions("role", ["setRole"]),
    ...mapActions("search", ["getSearchList"]),
    ...mapActions("auth", ["getTargetUserInfo"]),
    ...mapActions("card", [
      "setCardKey",
      "setCardDetail",
      "changeCardDetailType",
      "setLinkState",
      "changeCardShowState",
    ]),
    ...mapActions("task", ["setLabelKey"]),
    changeTab(key) {
      this.activeKey = key;
    },
    async changeKey(key) {
      this.tabKey = key;
      let res = await api.group.getSonGroupListMultilayer({
        fatherGroupKey: this.groupKey,
      });
      if (res.msg == "OK") {
        this.childGroupList = res.result;
      } else {
        this.$message.error(res.msg);
      }
      let groupRes = await api.group.getGroupList({
        groupKey: this.groupKey,
        listType: 4,
      });
      if (groupRes.msg == "OK") {
        this.myGroupList = groupRes.result;
      } else {
        this.$message.error(groupRes.msg);
      }
    },
    searchGroupMember(e) {
      this.targetMemberList = [];
      if (this.searchInput != "") {
        // this.getSearchList({ param: { name: this.searchInput }, type: 1 });
        this.getSearchList({
          param: {
            name: this.searchInput,
            typeGroupOrUser: 2,
            typeIsOrNot: 2,
          },
          type: 1,
        });
      }
    },
    onChange(e, index) {
      let targetIndex = 0;
      if (e.target.checked) {
        this.newMemberList.push(
          JSON.parse(JSON.stringify(this.targetMemberList[index]))
        );
        this.addMemberList.push(
          JSON.parse(JSON.stringify(this.targetMemberList[index]))
        );
        this.$emit("setAddMemeber", this.addMemberList);
        this.targetMemberList[index].checked = true;
      } else {
        this.newMemberList = this.newMemberList.filter((value, key) => {
          return value.userId !== this.targetMemberList[index].userId;
        });
        this.addMemberList = this.addMemberList.filter((value, key) => {
          return value.userId !== this.targetMemberList[index].userId;
        });
        this.$emit("setAddMemeber", this.addMemberList);
        this.targetMemberList[index].checked = false;
      }
    },
    deleteGroupMember(index) {
      let memberIndex = this.memberKeyArr.indexOf(
        this.newMemberList[index].userId
      );
      let checkboxIndex = 0;
      if (memberIndex !== -1) {
        this.removeGroupMember({
          param: {
            groupKey: this.groupKey,
            targetUKeyList: [this.groupMemberList[memberIndex].userId],
          },
          index: index,
        });
        this.targetMemberList.push({
          ...this.groupMemberList[memberIndex],
          checked: false,
          userKey: this.groupMemberList[memberIndex].userId,
        });
      }
      this.targetMemberList.forEach((value, key) => {
        if (value.userKey === this.newMemberList[index].userId) {
          checkboxIndex = key;
        }
      });
      this.targetMemberList[checkboxIndex].checked = false;
      this.addMemberList.forEach((value, key) => {
        if (value.userId === this.newMemberList[index]) {
          this.addMemberList.splice(key, 1);
        }
      });
      this.newMemberList.splice(index, 1);
      this.$emit("setAddMemeber", this.addMemberList);
    },
    async deleteSonGroup(sonGroupKey, index) {
      let res = await api.group.deleteFSGroup({
        fatherGroupKey: this.groupKey,
        sonGroupKey: sonGroupKey,
      });
      if (res.msg == "OK") {
        let childItem = this.childGroupList.splice(index, 1);
        this.myGroupList.push(...childItem);
      } else {
        this.$message.error(res.msg);
      }
    },
    changeRole(roleIndex, index) {
      this.newMemberList[index].role = roleIndex + 1;
      // this.$set(this.targetMemberList, index, this.targetMemberList[index]);
      this.setRole({
        groupKey: this.groupKey,
        targetUKey: this.newMemberList[index].userId,
        role: roleIndex + 1,
      });
    },
    saveGroupSet(obj) {
      this.$emit("setGroupSet", obj);
    },
    // changeGroupSet(obj) {
    //   this.changeGroupInfo({
    //     key: this.groupKey,
    //     patchData: {
    //       groupName: this.groupName,
    //       groupBusinessType: 1,
    //       groupCreateType: 1,
    //       groupLevel: 1,
    //       groupLogo: this.groupLogo,
    //       groupDesc: this.groupDesc,
    //       groupNotice: ""
    //     }
    //   });
    // },‘
    deleteTargetGroup() {
      this.deleteGroup({ key: this.groupKey });
      this.$emit("setHeaderMemberState", false);
    },
    outTargetGroup() {
      this.outGroup({ groupKey: this.groupKey });
      this.$emit("setHeaderMemberState", false);
      // this.setGroupType(1);
      // this.userKeyToGroupKey({ targetUKey: this.user._key });
      // this.getTargetUserInfo({ key: this.user._key });
      // let username = "";
      // if (this.user.rocketChat && this.user.rocketChat.username) {
      //   username = this.user.rocketChat.username;
      // } else {
      //   username = this.user.mobile;
      // }
      // document.querySelector("iframe").contentWindow.postMessage(
      //   {
      //     eventName: "go-chat",
      //     data: { username: username, type: "d" }
      //   },
      //   "https://im.qingtime.cn"
      // );
      // this.changeCardDetailType(1);
      // this.setCardKey(0);
      // this.setCardDetail(null);
      // this.setCardMemberList([]);
      // this.setLabelKey(0);
    },
    addMember(item) {
      item.role = 5;
      this.addGroupMember({
        param: {
          groupKey: this.groupKey,
          targetUidList: [
            {
              userKey: item.userKey,
              nickName: item.nickName,
              avatar: item.avatar,
              gender: 0,
              role: 5,
            },
          ],
        },
        item: item,
        type: "member",
      });
    },
    async setChildGroup(sonGroupKey, item) {
      console.log("sonGroupKey", sonGroupKey);
      console.log("item", item);
      let res = await api.group.setSonGroup({
        sonGroupKey: sonGroupKey,
        fatherGroupKey: this.groupKey,
      });
      if (res.msg == "OK") {
        this.$message.success("添加子群成功");
        this.childGroupList.push(item);
        this.myGroupList.splice(
          this._.findIndex(this.myGroupList, {
            _key: sonGroupKey,
          }),
          1
        );
      } else {
        this.$message.error(res.msg);
      }
    },
    toGroup(key, item) {
      this.setGroupKey(key);
      this.setGroupType(3);
      this.checkIndex = index + this.mainGroupMemberList.length;
      api.group.visitGroupOrFriend({ type: 2, targetUGKey: key });
      this.changeCardShowState(false);
      this.changeCardDetailType(1);
      this.setCardKey(0);
      this.setCardDetail(null);
      this.setCardMemberList([]);
      this.setLabelKey(0);
      this.setLinkState(0);
      this.$emit("setHeaderMemberState", false);
    },
    getData(memberArr) {
      this.targetMemberList = [];
      this.memberKeyArr = memberArr.map((item) => item.userId);
      this.mainGroupMemberList.forEach((item, index) => {
        if (this.memberKeyArr.indexOf(item.userId) == -1) {
          this.targetMemberList.push({
            userKey: item.userId,
            nickName: item.nickName,
            avatar: item.avatar,
            gender: item.gender,
            userId: item.userId,
            role: this.groupInfo.defaultPower,
            checked: false,
          });
        }
      });
      this.newMemberList = JSON.parse(JSON.stringify(memberArr));
    },
  },
  watch: {
    groupMemberList: {
      handler(newVal) {
        if (this.mainGroupMemberList.length > 0) {
          this.getData(newVal);
        }
      },
      immediate: true,
      deep: true,
    },
    mainGroupMemberList: {
      handler(newVal) {
        this.getData(this.groupMemberList);
      },
      immediate: true,
      deep: true,
    },
    searchMemberList: {
      handler(newVal, oldVal) {
        if (oldVal !== newVal) {
          let keyArr = this.newMemberList.map((item) => item.userId);
          this.targetMemberList = newVal.map((item, index) => {
            item.userId = item._key;
            item.userKey = item._key;
            item.role = this.groupInfo.defaultPower;
            if (keyArr.indexOf(item._key) == -1) {
              item.checked = false;
            } else {
              item.checked = true;
            }
            return item;
          });
          this.mainGroupMemberList.forEach((item, index) => {
            if (item.nickName.indexOf(this.searchInput) != -1) {
              this.targetMemberList.push({
                userKey: item.userId,
                nickName: item.nickName,
                avatar: item.avatar,
                gender: item.gender,
                userId: item.userId,
                role: item.role,
                checked: keyArr.indexOf(item.userId) == -1 ? false : true,
              });
            }
          });
        }
      },
      immediate: true,
      deep: true,
    },
    searchInput: {
      handler(newVal, oldVal) {
        if (oldVal !== newVal) {
          if (newVal == "") {
            this.targetMemberList = [];
            this.memberKeyArr = this.groupMemberList.map((item) => item.userId);
            this.mainGroupMemberList.forEach((item, index) => {
              if (this.memberKeyArr.indexOf(item.userId) == -1) {
                this.targetMemberList.push({
                  userKey: item.userId,
                  nickName: item.nickName,
                  avatar: item.avatar,
                  gender: item.gender,
                  userId: item.userId,
                  role: this.groupInfo.defaultPower,
                  checked: false,
                });
              }
            });
          }
        }
      },
      immediate: true,
      deep: true,
    },
    // groupKey: {
    //   handler(newVal, oldVal) {
    //     if (oldVal != newVal) {
    //       this.applyJoinGroupList({ groupKey: newVal });
    //     }
    //   },
    //   immediate: true
    // }
  },
};
</script>

<style scoped>
.group-member {
  width: 100%;
  height: 556px;
  display: flex;
}
.group-member-search {
  width: calc(100% - 17px);
  font-size: 14px;
  color: #8091a0;
}

.group-member-person,
.group-member-team {
  flex: 1;
}
.group-member-choose {
  width: 100%;
  height: 450px;
}
.group-member-title {
  width: 100%;
  height: 44px;
  line-height: 44px;
  border-bottom: 1px solid #e9e9e9;
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #23384b;
}
.group-member-container {
  width: 100%;
  height: 385px;
  overflow: auto;
}
.group-member-container::-webkit-scrollbar {
  width: 3px;
}
.group-member-item {
  margin: 17px 0px;
}
.group-member-item .group-member-img {
  width: 40px;
  height: 40px;
  overflow: hidden;
}
.group-member-item .group-member-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.group-member-item .group-member-name {
  height: 40px;
  line-height: 40px;
  margin-left: 15px;
}
.group-member-item .contact-time {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.group-member-team {
  padding-left: 20px;
  box-sizing: border-box;
}
.contact-team-container {
  height: 435px;
}
.outGroup-icon,
.deleteGroup-icon {
  position: absolute;
  top: 10px;
  right: 0px;
  cursor: pointer;
}
/* .deleteGroup-icon {
  right: 40px;
} */
</style>
