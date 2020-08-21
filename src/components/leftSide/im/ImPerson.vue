<template>
  <div
    class="imperson"
    :style="type=='cardInfo'?{ borderTop:'0px',height:'auto'}:{marginTop:'10px'}"
  >
    <!-- <div class="imperson-icon">
      <a-icon type="ellipsis" />
    </div>-->
    <div
      class="imperson-container"
      :style="type=='cardInfo'?{ justifyContent: 'flex-start'}:{justifyContent: 'center'}"
    >
      <div
        class="imperson-item"
        v-for="(item, index) in impersonList"
        :key="index"
        @click="choosePersonTalk(item)"
        @mouseenter="chooseShow = index"
        @mouseleave="chooseShow = null"
      >
        <a-tooltip placement="leftTop">
          <template slot="title">
            <span>{{ item.nickName }}</span>
          </template>
          <div
            :class="{'imperson-item-img':true,'offline-avatar':!item.online}"
            @click="changeImState?chooseFollow(item.userId,index):null"
          >
            <!-- style="{backgroundColor:'rgba(255,255,255)',opacity:0.5,zIndex:4}" -->
            <!-- :style="{border:chooseArr.indexOf(item.userId)!=-1&&cardDetailType!=1?'1.5px solid #1aca8e':null}" -->
            <img :src="item|defaultPerson" alt :style="{opacity: !item.online?0.5:null}" />
            <!-- @click="cardDetailType!=1?chooseFollow(item.userId,index):null" -->
            <!--   :style="{opacity:!item.online?'0.3':null}"-->
          </div>
          <a-checkbox
            class="imperson-check"
            v-if="changeImState&&(cardExecutorKey==item.userId||chooseShow==index)"
            @change="(e)=>{chooseExecutor(e,item)}"
            :checked="cardExecutorKey==item.userId"
          />
          <div
            v-if="chooseArr.indexOf(item.userId) != -1 && cardDetailType != 1"
            class="imperson-choose"
          />
        </a-tooltip>
      </div>
    </div>
    <div class="imperson-button" v-if="type=='left'">
      <!-- <div :style="{width:'100%'}"> -->
      <a-badge :count="joinMemberList.length">
        <a-icon
          type="setting"
          :style="{ color: '#1aca8e', marginBottom: '10px', fontSize: '25px' }"
          @click="groupType == 3?headerMemberState = true:personMemberState=true"
        />
      </a-badge>
      <!-- </div> -->
      <!-- <div :style="{width:'100%'}">
        <a-icon type="setting" :style="{fontSize:'25px'}" @click="headerSetState=true" />
      </div>-->
    </div>
    <!-- <a-modal
      title="群状态管理"
      :visible="headerSetState"
      @ok="changeGroupSet"
      @cancel="headerSetState=false"
      :destroyOnClose="true"
    >
      <GroupSet
        :groupState="1"
        @getGroupName="getGroupName"
        @getGroupDesc="getGroupDesc"
        @getGroupLogo="getGroupLogo"
      />
    </a-modal>-->
    <a-modal
      title="群成员管理"
      :visible="headerMemberState"
      @ok="saveGroupMember"
      @cancel="headerMemberState = false"
      :bodyStyle="{ height: '550px', paddingTop: '14px' }"
      :style="{ top: '25px' }"
      width="850px"
      :destroyOnClose="true"
    >
      <GroupMember
        @setAddMemeber="setAddMemeber"
        @setGroupSet="setGroupSet"
        @setHeaderMemberState="setHeaderMemberState"
      />
    </a-modal>
    <a-modal
      title="好友"
      :visible="personMemberState"
      @cancel="personMemberState = false"
      :bodyStyle="{ height: '550px', paddingTop: '14px' }"
      :style="{ top: '25px' }"
      width="550px"
      :destroyOnClose="true"
      :footer="null"
    >
      <PersonMember />
    </a-modal>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import GroupMember from "../group/GroupMember";
import PersonMember from "../group/PersonMember";
export default {
  name: "ImPerson",
  props: ["type"],
  data() {
    return {
      headerSetState: false,
      headerMemberState: false,
      personMemberState: false,
      addMemberList: [],
      chooseIndex: null,
      chooseArr: [],
      impersonList: [],
      chooseShow: null,
      GroupSetObj: {},
    };
  },
  components: {
    GroupMember,
    PersonMember,
  },
  computed: {
    ...mapState({
      user: (state) => state.auth.user,
      groupKey: (state) => state.group.groupKey,
      groupType: (state) => state.group.groupType,
      groupMemberList: (state) => state.group.groupMemberList,
      mainGroupMemberList: (state) => state.group.mainGroupMemberList,
      groupRole: (state) => state.group.groupRole,
      cardDetailType: (state) => state.card.cardDetailType,
      cardType: (state) => state.card.cardType,
      cardKey: (state) => state.card.cardKey,
      cardDetail: (state) => state.card.cardDetail,
      cardExecutorKey: (state) => state.card.cardExecutorKey,
      followCardList: (state) => state.card.followCardList,
      impersonState: (state) => state.card.impersonState,
      cardMemberList: (state) => state.group.cardMemberList,
      deviceState: (state) => state.common.deviceState,
      linkState: (state) => state.card.linkState,
      joinMemberList: (state) => state.group.joinMemberList,
      allTaskArray: (state) => state.task.allTaskArray,
      taskTitle: (state) => state.task.taskTitle,
    }),
    changeImState() {
      if (this.allTaskArray.length > 0 && this.groupType == 1) {
        let item = this._.find(this._.flatten(this.allTaskArray), {
          _key: this.cardKey,
        });
        if (item) {
          return (
            this.cardDetailType != 1 &&
            item.groupKey != localStorage.getItem("mainGroupKey")
          );
        }
      } else {
        return this.cardDetailType != 1;
      }
    },
  },
  methods: {
    ...mapActions("group", [
      "getGroupMember",
      "addGroupMember",
      "getMainGroupMember",
      "changeGroupInfo",
      "applyJoinGroupList",
    ]),
    ...mapActions("card", [
      "setCardExecutorKey",
      "getFollowCardList",
      "saveFollowPerson",
      "saveExecutorPerson",
      "changeCardShowState",
      "changeCardDetailType",
      "editCard",
    ]),
    ...mapActions("task", ["setTaskTitle"]),
    setAddMemeber(arr) {
      this.addMemberList = JSON.parse(JSON.stringify(arr));
    },
    setGroupSet(obj) {
      this.GroupSetObj = obj;
    },
    saveGroupMember() {
      if (this.addMemberList.length > 0) {
        this.addGroupMember({
          param: {
            groupKey: this.groupKey,
            targetUidList: this.addMemberList,
          },
          item: this.addMemberList,
          type: "members",
        });
      }
      this.headerMemberState = false;
      this.$emit("GETMAINGROUPMEMBER", [
        ...this.mainGroupMemberList,
        ...this.addMemberList,
      ]);
      // this.groupMemberState = false;
      if (JSON.stringify(this.GroupSetObj) != "{}") {
        this.changeGroupInfo({
          key: this.groupKey,
          patchData: this.GroupSetObj,
        });
      }
      this.GroupSetObj = {};
      this.addMemberList = [];
    },
    choosePersonTalk(person) {
      let username = "";
      if (person.rocketChat && person.rocketChat.username) {
        username = person.rocketChat.username;
      } else {
        username = person.mobile;
      }
      // if (this.deviceState != "mobile") {
      //   document.querySelector("iframe").contentWindow.postMessage(
      //     {
      //       eventName: "go-chat",
      //       data: { username: username, type: "d", groupName: person.nickName }
      //     },
      //     "https://im.qingtime.cn"
      //   );
      // }
    },
    chooseExecutor(e, item) {
      if (e.target.checked) {
        this.setCardExecutorKey(item.userId);
        if (this.chooseArr.indexOf(item.userId) == -1) {
          this.chooseArr.push(item.userId);
        }
        // this.saveExecutorPerson({
        //   param: {
        //     cardKeyArray: [this.cardKey],
        //     executorKey: item.userId
        //   },
        //   type: "change",
        //   item: item
        // });
        let obj = {
          key: this.cardKey,
          executorKey: item.userId,
        };
        if (this.taskTitle != "") {
          obj.title = this.taskTitle;
          this.setTaskTitle("");
        }
        this.editCard(obj);
      }
      //  else {
      //   this.setCardExecutorKey(null);
      //   this.saveExecutorPerson({
      //     param: {
      //       cardKeyArray: [this.cardKey],
      //       executorKey: null
      //     },
      //     type: "delete",
      //     item: item
      //   });
      // }
      //直接保存执行者
    },
    chooseFollow(userId, index) {
      if (this.chooseArr.indexOf(userId) != -1) {
        this.chooseArr.splice(this.chooseArr.indexOf(userId), 1);
      } else {
        this.chooseArr.push(userId);
      }
      //直接保存跟踪者
      this.saveFollowPerson({
        cardKey: this.cardKey,
        followKeyArray: this.chooseArr,
        followKey: "",
        followGroupKey: "",
        followType: 1,
      });
    },
    setHeaderMemberState() {
      this.headerMemberState = false;
    },
    savepersonMember() {},
  },
  mounted() {
    if (this.user) {
      this.getFollowCardList({ type: 1, cardKey: this.cardKey });
    }
  },
  watch: {
    user: {
      async handler(newVal, oldVal) {
        if (oldVal === null && newVal) {
          if (this.groupKey) {
            let that = this;
            this.$socket.emit("login", newVal._key);
            // setTimeout(function() {
            if (this.mainGroupMemberList.length == 0) {
              await this.getMainGroupMember({
                groupId: localStorage.getItem("mainGroupKey"),
              });
            }
            await this.getGroupMember({ groupId: this.groupKey });
            await this.applyJoinGroupList({ groupKey: this.groupKey });
            // }, 2000);
          }
          this.chooseIndex = null;
          // this.setExecutorType(0)
          // this.changeCardShowState(false);
          // this.changeCardDetailType(1);
        }
      },
      immediate: true,
    },
    groupKey: {
      async handler(newVal, oldVal) {
        if (oldVal != newVal && newVal && this.user) {
          let that = this;
          // this.$socket.emit("login", this.user._key);
          if (this.mainGroupMemberList.length == 0) {
            await this.getMainGroupMember({
              groupId: localStorage.getItem("mainGroupKey"),
            });
          }
          await this.getGroupMember({ groupId: newVal });
          await this.applyJoinGroupList({ groupKey: newVal });
          this.chooseIndex = null;
          // this.setExecutorType(0)
          // this.changeCardShowState(false);
          // this.changeCardDetailType(1);
        }
      },
      immediate: true,
    },
    cardKey: {
      handler(newVal, oldVal) {
        if (oldVal != newVal && newVal) {
          this.getFollowCardList({ type: 1, cardKey: newVal });
          // this.getCardDetail({ cardKey: newVal });
        } else {
          if (this.groupType == 3) {
            this.impersonList = this.groupMemberList;
          } else {
            this.impersonList = this.mainGroupMemberList;
          }
        }
      },
    },
    followCardList: {
      handler(newVal, oldVal) {
        // if (newVal != oldVal && newVal) {
        this.chooseArr = [];
        newVal.forEach((item) => {
          this.chooseArr.push(item.userId);
        });
        // }
      },
    },
    // groupType(newVal, oldVal) {
    //   if (oldVal !== newVal) {
    //     this.chooseIndex = null;
    //     this.setExecutorType(0);
    //   }
    // },
    // cardKey: {
    //   handler(newVal, oldVal) {
    //     if (newVal != oldVal) {
    //       this.setCardExecutorKey(this.cardDetail.executorKey);
    //     }
    //   }
    // },
    groupMemberList: {
      handler(newVal) {
        if (this.groupType == 3) {
          this.impersonList = newVal;
        } else {
          this.impersonList = this.mainGroupMemberList;
        }
      },
      immediate: true,
      deep: true,
    },
    mainGroupMemberList: {
      handler(newVal, oldVal) {
        if (oldVal.length != newVal.length && this.groupType != 3)
          this.impersonList = this.mainGroupMemberList;
      },
    },
    cardMemberList: {
      handler(newVal, oldVal) {
        if (this.cardKey) {
          this.impersonList = newVal;
        }
      },
      deep: true,
    },
    impersonState(newVal, oldVal) {
      if (newVal != oldVal) {
        console.log("impersonState", this.impersonState);
        if (newVal == 0) {
          if (this.groupType == 3) {
            this.impersonList = this.groupMemberList;
          } else {
            this.impersonList = this.mainGroupMemberList;
          }
        } else if (newVal == 1) {
          this.impersonList = this.cardMemberList;
        }
      }
    },
    linkState(newVal, oldVal) {
      if (oldVal !== newVal) {
        this.impersonList = this.groupMemberList;
      }
    },
  },
};
</script>

<style scoped>
.imperson {
  height: calc(100% - 280px);
  width: 100%;
  border: 0px;
  position: relative;
  display: flex;
  align-content: space-between;
  border-top: 1px solid rgb(66, 65, 65);
}
.imperson-icon {
  width: 100%;
  height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.imperson-container {
  width: 100%;
  height: calc(100% - 45px);
  overflow: auto;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  box-sizing: border-box;
  flex: 1;
}
.imperson-container::-webkit-scrollbar {
  width: 0px;
}
.imperson-item {
  width: 45px;
  height: 35px;
  /* border: 1px solid transparent; */
  margin-bottom: 5px;
  display: flex;
  justify-content: center;
  position: relative;
}
.imperson-item-img {
  width: 35px;
  height: 35px;
  overflow: hidden;
  border-radius: 50%;
  position: relative;
}
.imperson-item-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.imperson-check,
.imperson-choose {
  position: absolute;
  right: 0px;
  bottom: -2px;
  z-index: 5;
}
.imperson-choose {
  width: 10px;
  height: 10px;
  left: 6px;
  background-color: #1aca8e;
  border-radius: 50%;
  z-index: 6;
}
.imperson-button {
  width: 100%;
  height: 35px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: space-between;
  position: absolute;
  left: 0px;
  bottom: 0px;
}
.imperson-button div {
  display: flex;
  justify-content: center;
}

.offline-avatar {
  background-color: rgba(255, 255, 255);
  /* background-color: #000; */
  opacity: 0.8;
  z-index: 4;
}
</style>
