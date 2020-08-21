<template>
  <div class="card" @click="cancelCardInfo">
    <div class="content-menu">
      <div :style="{ display: 'flex', alignItems: 'center' }">
        <a-dropdown>
          <a class="ant-dropdown-link">
            {{ cardType[typeBoard3] }}
            <a-icon type="down" />
          </a>
          <a-menu slot="overlay">
            <a-menu-item v-for="(item, index) in cardType" :key="index" @click="typeBoard3 = index">
              <div>{{ item }}</div>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
        <a-input-search
          placeholder="选择指定的群成员"
          style="width: 200px"
          @search="searchPerson(0)"
          v-if="groupType === 3"
          :style="{ marginLeft: '20px' }"
          v-model="cardInput"
        />
        <a-input-search
          placeholder="选择指定的群"
          style="width: 200px"
          @search="searchPerson(1)"
          v-if="groupType === 1 || groupType === 2"
          :style="{ marginLeft: '20px' }"
          v-model="cardInput"
        />
        <a-checkbox
          :style="{marginLeft:'8px',fontSize: '30px'}"
          @click.stop="changeCardToTask"
          v-if="groupRole>0&&groupRole<4"
          :checked="true"
        />
      </div>
      <div :style="{ fontSize: '20px' }">
        <a-icon
          type="plus-square"
          @click.stop="createNewCard"
          v-if="groupType!=2&&groupRole>0&&groupRole<5"
        />
      </div>
    </div>
    <div class="card-container">
      <div
        v-for="(item, index) in cardList"
        :key="index"
        class="card-item-container"
        :style="deviceState=='phone'||deviceState=='mobile'?{width:(deviceWidth-60)+'px'}:null"
        @click.stop="clickCardItem(index)"
      >
        <CardItem
          :cardItem="item"
          :cardTargetIndex="index"
          :style="index===checkIndex?{boxShadow:' 0 0 7px 0 rgba(0, 0, 0, 0.26)',borderLeft: '3px solid #26cc94'}:null"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { mapState, mapActions } from "vuex";
import { Row, Col, Pagination } from "ant-design-vue";
import CardItem from "./CardItem";
import loading1 from "../../common/svg/圆形.svg";
import loading2 from "../../common/svg/进度6.svg";
import loading3 from "../../common/svg/进度8.svg";
import SvgIcon from "../../common/SvgIcon";
export default {
  name: "Card",
  components: { CardItem, SvgIcon },
  data() {
    return {
      cardType: ["全部", "我的卡片", "@我的卡片"],
      typeBoard3: 0,
      key: 0,
      followArr: [],
      executeKey: 0,
      loading1: loading1,
      loading2: loading2,
      loading3: loading3,
      checkIndex: null,
      page: 1,
      cardInput: ""
    };
  },
  computed: mapState({
    user: state => state.auth.user,
    targetUInfo: state => state.auth.targetUInfo,
    cardShowState: state => state.card.cardShowState,
    cardList: state => state.card.cardList,
    cardDetail: state => state.card.cardDetail,
    cardKey: state => state.card.cardKey,
    cardTotal: state => state.card.cardTotal,
    groupKey: state => state.group.groupKey,
    groupInfo: state => state.group.groupInfo,
    groupType: state => state.group.groupType,
    groupRole: state => state.group.groupRole,
    followCardState: state => state.card.followCardState,
    followCardObj: state => state.card.followCardObj,
    groupMemberList: state => state.group.groupMemberList,
    followCardList: state => state.card.followCardList,
    cardChooseFollowArr: state => state.card.followCardList,
    impersonState: state => state.card.impersonState,
    onlyTitle: state => state.card.onlyTitle,
    deviceState: state => state.common.deviceState,
    deviceWidth: state => state.common.deviceWidth,
    linkState: state => state.card.linkState,
  }),
  mounted() {
    if (this.user) {
      this.searchData(
        this.groupType,
        this.targetUInfo.userId,
        this.groupKey,
        this.typeBoard3
      );
    }
  },
  methods: {
    ...mapActions("card", [
      "changeFollowCardState",
      "getCardList",
      "saveFollowPerson",
      "editCard",
      "setExecutorIndex",
      "changeCardShowState",
      "changeCardDetailType",
      "setCardType",
      "setImpersonState",
      "setCardContent",
      "setCardKey",
      "setCardDetail",
      "createCard"
    ]),
    ...mapActions("task", ["changeTaskLabel"]),
    getData(type) {
      switch (type) {
        case 1:
          //我的主群
          this.cardType = ["全部", "我的卡片", "@我的卡片"];
          break;
        case 2:
          //他人主群
          this.cardType = [
            "全部",
            "我@他的卡片",
            "他@我的卡片",
            "共同所在群@他的卡片"
          ];
          break;
        case 3:
          //普通群
          this.cardType = ["所有卡片"];
          break;
        default:
          null;
      }
    },
    searchPerson(type) {
      let key = 0;
      if (this.groupType == 1 || this.groupType == 2) {
        key = this.targetUInfo.userId
          ? this.targetUInfo.userId
          : localStorage.getItem("userKey");
      } else if (this.groupType == 3) {
        key = this.groupKey;
      }
      let obj = {
        typeBoard1: this.groupType,
        typeBoard3: 0,
        curPage: 1,
        perPage: 200,
        targetUGKey: key,
        filterUGName: this.cardInput
      };
      if (type === 1) {
        obj.typeBoard2 = 4;
      } else if (type === 0) {
        obj.typeBoard2 = 1;
      }
      this.getCardList(obj);
    },
    createNewCard() {
      let obj = {
        type: 1,
        title: "",
        content: "",
        rootType: 0,
        groupKey: this.groupKey,
        taskType: 1,
        executorKey: this.user._key,
        followUKeyArray: []
      };
      this.createCard(obj);
    },
    // setFollowArr(arr) {
    //   this.followArr = [];
    //   arr.forEach((item, index) => {
    //     if (item) {
    //       this.followArr.push(this.groupMemberList[index].userId);
    //     }
    //   });
    // },
    // setExecuteKey(id) {
    //   this.executeKey = id;
    // },
    // saveFollowCard() {
    //   if (this.followArr.length == 0) {
    //     this.followCardList.forEach((item, index) => {
    //       this.followArr.push(item.userId);
    //     });
    //   }
    //   //保存跟踪者
    //   this.saveFollowPerson({
    //     cardKey: this.cardKey,
    //     followKeyArray: this.cardChooseFollowArr,
    //     followKey: "",
    //     followGroupKey: "",
    //     followType: 1
    //   });
    //   this.changeFollowCardState(false);
    // },
    searchData(type, userId, groupId, typeBoard3) {
      let key = 0;
      if (type == 1 || type == 2) {
        key = userId ? userId : localStorage.getItem("userKey");
      } else if (type == 3) {
        key = groupId;
      }
      this.getData(type);
      let obj = {
        typeBoard1: type,
        typeBoard2: 1,
        curPage: 1,
        perPage: 200,
        targetUGKey: key
        // filterUGName:"肖大宝"
      };
      if (typeBoard3) {
        obj.typeBoard3 = typeBoard3;
      }
      this.getCardList(obj);
    },
    changeCardToTask() {
      this.editCard({
        key: this.cardKey,
        type: 2,
        groupKey: this.cardDetail.groupKey,
        finishPercent: 0,
        day: 1,
        hour: 1,
        date: this.$moment(
          this.$moment( this.cardDetail.createTime).format("YYYY-MM-DD")
        ).date(),
        labelKey: null
      });
      this.changeTaskLabel({
        groupKey: this.cardDetail.groupKey,
        cardKey: this.cardKey,
        labelKey: null,
        type: 2
      });
    },
    onPageChange(page) {
      this.page = page;
      if (this.cardInput == "") {
        this.getCardList({
          typeBoard1: this.groupType,
          typeBoard2: 1,
          typeBoard3: this.typeBoard3,
          curPage: page,
          perPage: 200,
          targetUGKey: this.groupKey
        });
      } else {
        this.searchPerson(this.groupType < 3 ? 0 : 1);
      }
    },
    cancelCardInfo() {
      this.checkIndex = null;
      this.setImpersonState(0);
      this.changeCardShowState(false);
      this.changeCardDetailType(1);
      this.searchData(
        this.groupType,
        this.targetUInfo.userId,
        this.groupKey,
        0
      );
    },
    clickCardItem(index) {
      this.checkIndex = index;
    }
  },
  watch: {
    // user(newVal, oldVal) {
    //   if (oldVal === null && newVal) {
    //     this.searchData(
    //       this.groupType,
    //       this.targetUInfo.userId,
    //       this.groupKey,
    //       1
    //     );
    //   }
    // },
    groupKey(newVal, oldVal) {
      if (oldVal !== newVal && oldVal !== null) {
        // this.typeBoard3 = 0;
        this.cardInput = "";
        this.page = 1;
        this.searchData(this.groupType, this.targetUInfo.userId, newVal, 0);
        this.checkIndex = null;
      }
    },
    groupType(newVal, oldVal) {
      if (oldVal !== newVal) {
        this.cardInput = "";
        this.page = 1;
        this.searchData(newVal, this.targetUInfo.userId, this.groupKey, 0);
      }
    },
    typeBoard3(newVal, oldVal) {
      if (oldVal !== newVal) {
        this.typeBoard3 = newVal;
        this.searchData(
          this.groupType,
          this.targetUInfo.userId,
          this.groupKey,
          newVal
        );
      }
    },
    cardInput(newVal, oldVal) {
      if (oldVal !== newVal) {
        if (newVal == "") {
          this.typeBoard3 = 1;
          this.page = 1;
          this.searchData(
            this.groupType,
            this.targetUInfo.userId,
            this.groupKey,
            0
          );
        }
      }
    },
    cardShowState(newVal, oldVal) {
      if (!newVal) {
        this.searchData(
          this.groupType,
          this.targetUInfo.userId,
          this.groupKey,
          0
        );
      }
    }
  }
};
</script>

<style scoped>
.content-menu {
  width: 100%;
  height: 54px;
  line-height: 20px;
  padding: 10px 2.5%;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.content-menu > a {
  margin-right: 25px;
}
.card {
  width: 100%;
  height: 100%;
}
.card-container {
  width: 100%;
  height: calc(100% - 54px);
  padding: 20px 2.5%;
  overflow: auto;
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
}
.card-item-container {
  width: 308px;
  height: 75px;
  margin-right: 9px;
  margin-bottom: 9px;
}
/* .card-item-container:nth-child(3n + 3) {
  margin-right: 0px;
} */
</style>
