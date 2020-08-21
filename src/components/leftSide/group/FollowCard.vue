<template>
  <div class="followCard">
    <!-- <a-input placeholder="搜索" v-model="search" ref="userNameInput" class="followCard-search">
      <a-icon slot="prefix" type="search" />
    </a-input>-->
    <div class="followCard-choose">
      <div class="followCard-title">
        <a-row class>
          <a-col :span="4">群头像</a-col>
          <a-col :span="14">群名称</a-col>
          <a-col :span="6">设为追踪者</a-col>
          <!-- <a-col :span="6">设为执行人</a-col> -->
        </a-row>
      </div>
      <div class="followCard-container">
        <a-row class="followCard-item" v-for="(item,index) in groupMemberList" :key="index">
          <a-col :span="4">
            <div class="followCard-img">
              <img :src="item.avatar" alt />
            </div>
          </a-col>
          <a-col :span="14">
            <div class="followCard-name">{{item.nickName}}</div>
          </a-col>
          <a-col :span="6">
            <div class="followCard-time flex-center">
              <a-checkbox
                @change="(e)=>setFollowPerson(e,index)"
                :checked="followArr[index]"
                :disabled="cardList[cardIndex].creatorKey==item.userId?true:false"
              ></a-checkbox>
            </div>
          </a-col>
          <!-- <a-col :span="6">
            <div class="followCard-time flex-center">
              <a-checkbox @change="(e)=>setExecutePerson(e,index)" :checked="executeArr[index]"></a-checkbox>
            </div>
          </a-col> -->
        </a-row>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "FollowCard",
  data() {
    return {
      search: "",
      followPerson: [],
      executePerson: 0,
      followArr: [],
      followKeyArr: [],
      executeArr: [],
      executeKey: 0
    };
  },
  computed: mapState({
    groupKey: state => state.group.groupKey,
    groupType: state => state.group.groupType,
    groupMemberList: state => state.group.groupMemberList,
    followCardList: state => state.card.followCardList,
    followCardState: state => state.card.followCardState,
    cardKey: state => state.card.cardKey,
    cardIndex: state => state.card.cardIndex,
    cardList: state => state.card.cardList
  }),
  mounted() {
    this.followArr = new Array(this.groupMemberList.length).fill(false);
    this.executeArr = new Array(this.groupMemberList.length).fill(false);
  },
  methods: {
    ...mapActions("card", [
      "changeFollowCardState",
      "setFollowCardObj",
      "getFollowCardList",
      "setExecutorIndex"
    ]),
    setFollowPerson(e, index) {
      // this.followArr[index] = e.target.checked;
      this.$set(this.followArr, index, e.target.checked);
      let newFollowArr = this.followArr.filter(item => {
        return item === true;
      });
      this.$emit("setFollowArr", newFollowArr);
    },
    // setExecutePerson(e, index) {
    //   this.executeArr = new Array(this.groupMemberList.length).fill(false);
    //   this.$set(this.executeArr, index, e.target.checked);
    //   if (this.executeArr[index]) {
    //     this.$emit("setExecuteKey", this.groupMemberList[index].userId);
    //   }
    // }
  },
  watch: {
    followCardState(newValue, oldValue) {
      if (newValue != oldValue && newValue) {
        this.followArr = new Array(this.groupMemberList.length).fill(false);
        this.executeArr = new Array(this.groupMemberList.length).fill(false);
        this.getFollowCardList({ type: 1, cardKey: this.cardKey });
      }
    },
    followCardList: {
      handler(newVal, oldVal) {
        if (oldVal !== newVal) {
          this.groupMemberList.forEach((item, index) => {
            if (this.cardList[this.cardIndex].creatorKey == item.userId) {
              this.$set(this.followArr, index, true);
            }
          });
          newVal.forEach((item, index) => {
            for (let i = 0; i < this.groupMemberList.length; i++) {
              if (this.groupMemberList[i].userId == item.userId) {
                this.$set(this.followArr, index, true);
                if (item.isExecutor) {
                  this.$set(this.executeArr, i, true);
                }
              }
            }
          });
        }
      },
      immediate: true,
      deep: true
    }
  }
};
</script>

<style scoped>
.followCard {
  width: 100%;
  height: 100%;
}
.followCard-choose {
  width: 100%;
  height: 450px;
}
.followCard-title {
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  border-bottom: 1px solid #e9e9e9;
  font-size: 14px;
  color: #23384b;
}
.followCard-container {
  width: 100%;
  height: 400px;
  overflow: auto;
}
.followCard-container::-webkit-scrollbar {
  width: 3px;
}
.followCard-item {
  margin: 17px 0px;
}
.followCard-item .followCard-img {
  width: 80px;
  height: 40px;
  display: flex;
  justify-content: center;
}
.followCard-item .followCard-img img {
  object-fit: cover;
  height: 100%;
  width:100%;
}
.followCard-item .followCard-name {
  height: 40px;
  line-height: 40px;
  text-align: center;
}
.followCard-item .followCard-time {
  height: 40px;
}
</style>