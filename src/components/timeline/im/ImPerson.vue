<template>
  <div
    class="imperson"
    :style="deviceState=='phone'?{height:'100%',borderTop:'0px'}:{borderTop:'1px solid rgb(66, 65, 65)'}"
  >
    <!-- <div class="imperson-icon">
      <a-icon type="ellipsis" />
    </div>-->
    <div class="imperson-container">
      <div
        class="imperson-item"
        v-for="(item, index) in impersonList"
        :key="index"
        @click="choosePersonTalk(item)"
        @mouseenter="chooseShow=index"
        @mouseleave="chooseShow=null"
      >
        <a-tooltip placement="leftTop">
          <template slot="title">
            <span>{{item.nickName}}</span>
          </template>
          <div class="imperson-item-img" :style="{border:item.online?'1.5px solid #1aca8e':null}">
            <!-- :style="{border:chooseArr.indexOf(item.userId)!=-1&&cardDetailType!=1?'1.5px solid #1aca8e':null}" -->
            <img
              :src="item.avatar|defaultPerson"
              alt           
            />
              <!-- @click="cardDetailType!=1?chooseFollow(item.userId,index):null" -->
            <!--   :style="{opacity:!item.online?'0.3':null}"-->
          </div>
          <a-checkbox
            class="imperson-check"
            v-if="((cardDetailType==2&&cardDetail.type==2)||(cardDetailType==0&&cardType==2))&&(cardExecutorKey==item.userId||chooseShow==index)"
            @change="(e)=>{chooseExecutor(e,item.userId)}"
            :checked="cardExecutorKey==item.userId"
          />
          <a-icon
            type="eye"
            v-if="chooseArr.indexOf(item.userId)!=-1&&cardDetailType!=1"
            class="imperson-eye"
          />
        </a-tooltip>
      </div>
    </div>
    <div class="imperson-button" v-if="groupType==3">
      <!-- <div :style="{width:'100%'}"> -->
      <a-badge :count="joinMemberList.length">
        <a-icon
          type="setting"
          :style="{color: '#1aca8e',marginBottom:'10px',fontSize:'25px'}"
          @click="headerMemberState=true"
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
      @cancel="headerMemberState=false"
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
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import GroupMember from "../../group/GroupMember";
export default {
  name: "ImPerson",
  data() {
    return {
      headerSetState: false,
      headerMemberState: false,
      addMemberList: [],
      chooseIndex: null,
      chooseArr: [],
      impersonList: [],
      chooseShow: null,
      GroupSetObj: {}
    };
  },
  components: {
    GroupMember
  },
  computed: mapState({
    user: state => state.auth.user,
    groupKey: state => state.group.groupKey,
    groupType: state => state.group.groupType,
    groupMemberList: state => state.group.groupMemberList,
    mainGroupMemberList: state => state.group.mainGroupMemberList,
    groupRole: state => state.group.groupRole,
    cardDetailType: state => state.card.cardDetailType,
    cardType: state => state.card.cardType,
    cardKey: state => state.card.cardKey,
    cardDetail: state => state.card.cardDetail,
    cardExecutorKey: state => state.card.cardExecutorKey,
    followCardList: state => state.card.followCardList,
    impersonState: state => state.card.impersonState,
    cardMemberList: state => state.group.cardMemberList,
    deviceState: state => state.common.deviceState,
    linkState: state => state.card.linkState,
    joinMemberList: state => state.group.joinMemberList
  }),
  methods: {
    ...mapActions("group", [
      "getGroupMember",
      "addGroupMember",
      "getMainGroupMember",
      "changeGroupInfo",
      "applyJoinGroupList"
    ]),
    ...mapActions("card", [
      "setCardExecutorKey",
      "getFollowCardList",
      "saveFollowPerson",
      "saveExecutorPerson",
      "changeCardShowState",
      "changeCardDetailType",
      "getCardDetail"
    ]),

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
            targetUidList: this.addMemberList
          },
          item: this.addMemberList,
          type: "members"
        });
      }
      this.headerMemberState = false;
      // this.groupMemberState = false;
      this.changeGroupInfo({
        key: this.groupKey,
        patchData: this.GroupSetObj
      });
    },
    choosePersonTalk(person) {
      let username = "";
      if (person.rocketChat && person.rocketChat.username) {
        username = person.rocketChat.username;
      } else {
        username = person.mobile;
      }
      if (this.deviceState != "phone") {
        document.querySelector("iframe").contentWindow.postMessage(
          {
            eventName: "go-chat",
            data: { username: username, type: "d" }
          },
          "https://im.qingtime.cn"
        );
      }
    },
    chooseExecutor(e, userId) {
      if (e.target.checked) {
        this.setCardExecutorKey(userId);
        if (this.chooseArr.indexOf(userId) == -1) {
          this.chooseArr.push(userId);
        }
        this.saveExecutorPerson({
          cardKeyArray: [this.cardKey],
          executorKey: userId
        });
      } else {
        this.setCardExecutorKey(null);
        this.saveExecutorPerson({
          cardKeyArray: [this.cardKey],
          executorKey: null
        });
      }
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
        followType: 1
      });
    },
    setHeaderMemberState() {
      this.headerMemberState = false;
    }
  },
  mounted() {
    if (this.user) {
      this.getFollowCardList({ type: 1, cardKey: this.cardKey });
    }
  },
  watch: {
    user: {
      handler(newVal, oldVal) {
        if (oldVal === null && newVal) {
          if (this.groupKey) {
            this.getGroupMember({ groupId: this.groupKey });
          }
          this.chooseIndex = null;
          // this.setExecutorType(0)
          this.changeCardShowState(false);
          this.changeCardDetailType(1);
        }
      },
      immediate: true,
      deep: true
    },
    groupKey: {
      handler(newVal, oldVal) {
        if (oldVal != newVal && newVal && this.user) {
          this.getGroupMember({ groupId: newVal });
          this.applyJoinGroupList({ groupKey: newVal });
          this.chooseIndex = null;
          // this.setExecutorType(0)
          this.changeCardShowState(false);
          this.changeCardDetailType(1);
        }
      },
      immediate: true
    },
    cardKey(newVal, oldVal) {
      if (oldVal !== newVal && newVal) {
        this.getCardDetail({ cardKey: newVal });
        this.getFollowCardList({ type: 1, cardKey: newVal });
      }
    },
    followCardList: {
      handler(newVal, oldVal) {
        if (newVal != oldVal && newVal) {
          this.chooseArr = [];
          newVal.forEach(item => {
            this.chooseArr.push(item.userId);
          });
        }
      },
      immediate: true,
      deep: true
    },
    // groupType(newVal, oldVal) {
    //   if (oldVal !== newVal) {
    //     this.chooseIndex = null;
    //     this.setExecutorType(0);
    //   }
    // },
    cardDetailType(newVal, oldVal) {
      if (oldVal !== newVal) {
        if (newVal == 0) {
          this.chooseArr = [];
          // this.setCardChooseFollowArr([]);
          this.setCardExecutorKey(this.cardDetail.executorKey);
        }
      }
    },
    cardDetail: {
      handler(newVal, oldVal) {
        this.setCardExecutorKey(newVal.executorKey);
      },
      deep: true
    },
    groupMemberList: {
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          if (this.groupType == 3 || (oldVal && oldVal.length == 0)) {
            this.impersonList = newVal;
          } else {
            this.impersonList = this.mainGroupMemberList;
          }
        }
      },
      immediate: true,
      deep: true
    },
    cardMemberList: {
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.impersonList = newVal;
        }
      },
      immediate: true,
      deep: true
    },
    impersonState(newVal, oldVal) {
      if (newVal != oldVal) {
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
    }
  }
};
</script>

<style scoped>
.imperson {
  height: calc(100% - 234px);
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
  justify-content: center;
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
.imperson-eye {
  position: absolute;
  right: 0px;
  bottom: -2px;
  z-index: 5;
}
.imperson-eye {
  color: #1aca8e;
  z-index: 3;
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
</style>
