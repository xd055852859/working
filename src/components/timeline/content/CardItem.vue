<template>
  <div
    class="cardItem"
    @click.stop="deviceState!='phone'? checkCard(cardItem._key, cardTargetIndex, cardItem.groupKey):null"
    :style="cardItem.finishPercent==5?{background:'#E3E3E3'}:null"
  >
    <!-- <a-icon
      :component="loading[cardItem.finishPercent]"
      class="cardItem-finishIcon"
      v-if="cardItem.type == 2"
    />-->
    <a-checkbox
      @change="onFinishPercentChange"
      :checked="cardItem.finishPercent>3?true:false"
      v-if="cardItem.type == 2"
      :style="{marginRight:'10px'}"
    ></a-checkbox>
    <div class="cardItem-left">
      <div class="cardItem-title">
        <span
          v-if="cardDetail._key!=cardItem._key||!changeTitleState"
          :style="cardItem.finishPercent==2?{textDecoration:'line-through'}:null"
        >{{ cardItem.title }}</span>
        <a-input
          placeholder="请输入标题"
          :value="onlyTitle"
          @change="onlyChangeTitle"
          v-if="cardDetail._key==cardItem._key && changeTitleState"
        />
      </div>
      <div class="cardItem-name" v-if="groupType!=3&&cardItem.groupKey!=mainGroupKey">
        <span>{{ cardItem.groupName }}</span>
        <span>{{ cardItem.creatorName }}</span>
      </div>
    </div>
    <div class="cardItem-right">
      <div class="cardItem-icon">
        <a-icon
          type="close"
          :style="{ fontSize: '14px' }"
          @click.stop="deleteTargetCard(cardItem._key, cardTargetIndex)"
          v-if="this.groupRole > 0 && this.groupRole < 4 && cardItem._key==cardKey"
        />
      </div>
      <!-- <div class="cardItem-type" v-if="cardItem.taskType">
        <span
          :style="{
            color: color[cardItem.taskType == 10 ? 5 : cardItem.taskType - 1],
            backgroundColor:
              backgroundColor[
                cardItem.taskType == 10 ? 5 : cardItem.taskType - 1
              ]
          }"
        >
          {{
          msgItem[cardItem.taskType == 10 ? 5 : cardItem.taskType - 1]
          }}
        </span>
      </div>-->
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { mapState, mapActions } from "vuex";
import { Modal } from "ant-design-vue";
import loading1 from "../../common/svg/圆形.svg";
import loading2 from "../../common/svg/进度6.svg";
import loading3 from "../../common/svg/进度8.svg";
export default {
  name: "CardItem",
  props: ["cardItem", "cardTargetIndex"],
  components: {},
  computed: mapState({
    cardKey: state => state.card.cardKey,
    cardList: state => state.card.cardList,
    onlyTitle: state => state.card.onlyTitle,
    cardDetail: state => state.card.cardDetail,
    groupRole: state => state.group.groupRole,
    groupType: state => state.group.groupType,
    groupType: state => state.group.groupKey,
    cardMemberList: state => state.group.cardMemberList,
    cardDetailType: state => state.card.cardDetailType,
    headerIndex: state => state.common.headerIndex,
    closeIndex: state => state.card.closeIndex,
    deviceState: state => state.common.deviceStatem
  }),
  data() {
    return {
      color: ["#6FD29A", "#21ABE4", "#F5A623", "#FB8444", "#FF5D5B", "#9F33FE"],
      backgroundColor: [
        "#DAF6E6",
        "#D8ECFF",
        "#FBE6C4",
        "#FFDDCC",
        "#FFE3DE",
        "#F3E5FF"
      ],
      msgItem: [
        "建议功能",
        "强烈建议",
        "错误",
        "严重错误",
        "致命错误",
        "顶级优先"
      ],
      followCardObj: {},
      loading: [loading1, loading2, loading3],
      changeTitleState: false,
      mainGroupKey: localStorage.getItem("mainGroupKey")
    };
  },
  mounted() {
    this.setOnlyTitle(this.cardDetail.title);
  },
  methods: {
    ...mapActions("card", [
      "changeFollowCardState",
      "setCardKey",
      "setCardIndex",
      "deleteCard",
      "getCardDetail",
      "changeCardShowState",
      "changeCardDetailType",
      "setImpersonState",
      "setOnlyTitle",
      "editCard"
    ]),
    ...mapActions("group", ["getCardMember"]),
    checkCard(key, index, groupKey) {
      this.setCardKey(key);
      this.setCardIndex(index);
      //请求群成员
      this.getCardMember({
        groupId: groupKey
      });
      this.setImpersonState(1);
      //根据卡片
    },
    deleteTargetCard(key, index) {
      let that = this;
      this.setCardKey(key);
      this.setCardIndex(index);
      Modal.confirm({
        title: "提示消息",
        content: "是否确认要删除该卡片",
        okText: "确认",
        cancelText: "取消",
        onOk() {
          that.deleteCard({ cardKey: key, groupKey: that.groupKey });
          that.changeCardShowState(false);
          that.changeCardDetailType(1);
        }
      });
    },
    followTargetCard(key, index) {
      this.setCardKey(key);
      this.setCardIndex(index);
      this.changeFollowCardState(true);
    },
    // getFollowCard(obj) {
    //   this.followCardObj = JSON.parse(JSON.stringify(obj));
    // }
    onlyChangeTitle(e) {
      this.setOnlyTitle(e.target.value);
    },
    onFinishPercentChange(e) {
      if (e.target.checked) {
        this.editCard({
          key: this.cardKey,
          taskType: this.cardItem.taskType,
          finishPercent: 4
        });
      } else {
        this.editCard({
          key: this.cardKey,
          taskType: this.cardItem.taskType,
          finishPercent: 1
        });
      }
    }
  },
  watch: {
    cardMemberList: {
      handler(newVal, oldVal) {
        if (oldVal != newVal && newVal.length > 0) {
          //他人界面里共同群@他的
          //卡片的群key判断权限
          if (this.changeTitleState == false) {
            if (this.groupType != 2) {
              if (this.groupRole > 0 && this.groupRole < 4) {
                this.changeCardShowState(true);
                this.changeCardDetailType(2);
                this.changeTitleState = true;
              } else {
                this.changeCardShowState(true);
                this.changeCardDetailType(1);
                this.changeTitleState = false;
              }
            } else {
              newVal.forEach(item => {
                if (item.userId == localStorage.getItem("userKey")) {
                  if (item.role > 0 && item.role < 4) {
                    this.changeCardShowState(true);
                    this.changeCardDetailType(2);
                    this.changeTitleState = true;
                  } else {
                    this.changeCardShowState(true);
                    this.changeCardDetailType(1);
                    this.changeTitleState = false;
                  }
                }
              });
            }
          }
        }
      },
      immediate: true,
      deep: true
    },
    cardDetail: {
      handler(newVal, oldVal) {
        if (oldVal !== newVal) {
          if (
            this.changeTitleState == false &&
            newVal.followUserList &&
            this.headerIndex != 3
          ) {
            newVal.followUserList.forEach(item => {
              if (item._key == localStorage.getItem("userKey")) {
                this.changeCardShowState(true);
                this.changeCardDetailType(2);
                this.changeTitleState = true;
              }
            });
          }
          this.setOnlyTitle(newVal.title);
        }
      },
      immediate: true,
      deep: true
    },
    cardDetailType(newVal, oldVal) {
      if (oldVal !== newVal && newVal == 1) {
        this.changeTitleState = false;
      }
    },
    cardKey(newVal, oldVal) {
      if (oldVal !== newVal) {
        this.changeTitleState = false;
      }
    }
    // changeTitleState(newVal, oldVal) {
    //   if (oldVal !== newVal && oldVal) {
    //     if (this.onlyTitle != "" && this.cardDetailType == 1) {
    //       this.editCard({
    //         type: this.cardDetail.type,
    //         title: this.onlyTitle,
    //         content: this.cardDetail.typecontent,
    //         rootType: 0,
    //         groupKey: this.groupKey,
    //         isOpen: true,
    //         key: this.cardKey
    //       });
    //     }
    //   }
    // }
  }
};
</script>

<style scoped>
.cardItem {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 10px 12px;
  box-sizing: border-box;
  background: #ffffff;
  border: 1px solid #eeeeee;
  margin-bottom: 9px;
}
.cardItem-finishIcon {
  margin: 0px 8px 0px 0px;
  font-size: 18px;
  color: #555;
}
.cardItem:hover {
  box-shadow: 0 0 7px 0 rgba(0, 0, 0, 0.26);
  border-left: 3px solid #26cc94;
}
.cardItem .cardItem-left {
  width: 100%;
  height: 100%;
  display: flex;
  align-content: space-between;
  flex-wrap: wrap;
}
.cardItem .cardItem-left .cardItem-title {
  width: 100%;
  font-size: 14px;
  color: #23384b;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.cardItem .cardItem-left .cardItem-name span {
  width: 100%;
  font-size: 12px;
  color: #8091a0;
  margin-right: 10px;
}
.cardItem .cardItem-right {
  width: 40%;
  height: 100%;
  display: flex;
  align-content: space-between;
  justify-content: space-between;
  flex-wrap: wrap;
  text-align: right;
}
.cardItem .cardItem-icon {
  width: 100%;
}
.cardItem .cardItem-right .cardItem-type {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}
.cardItem .cardItem-right .cardItem-type span {
  font-size: 12px;
  padding: 2px 10px;
  box-sizing: border-box;
  border-radius: 5px;
}
</style>
