<template>
  <div>
    <div class="userHome-container">
      <div class="userHome-user-info">
        <div class="userHome-user-avatar">
          <img :src="user.profile|defaultPerson" alt />
        </div>
        <div class="userHome-user-avatar-icon" @click.stop="changeHeaderIndex(15)">
          <img :src="userEditPng" alt />
        </div>
        <div class="userHome-user-userinfo">
          <div class="userHome-user-nickName">{{user.profile.nickName}}</div>
          <div class="userHome-user-energy">
            <div :style="{marginRight:'10px'}">活力值</div>
            <div class="userHome-user-energy-icon">
              <img :src="batteryPng" alt />
            </div>
            <div :style="{color:'#86B93F',fontSize:'14px',marginRight:'10px'}">{{energyValueTotal}}</div>
          </div>
          <div class="userHome-user-energyIcon">
            <div :style="{marginRight:'10px'}">活力段位</div>
            <VitalityIcon :vitalityNum="energyValueTotal" :vitalityState="false" />
          </div>
        </div>
      </div>
      <div class="userHome-group-info">
        <div class="userHome-group-title">
          <div>今日企业活力排名</div>
          <a-dropdown :trigger="['click']" v-if="groupUserList.length>0">
            <a class="ant-dropdown-link" @click="e => e.preventDefault()">
              {{groupUserList[chooseGroupIndex].groupName}}
              <a-icon type="down" v-if="groupUserList.length>1" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item
                v-for="(item,index) in groupUserList"
                :key="'groupUser'+index"
                @click="chooseGroup(item._key,index)"
              >
                <div>{{item.groupName}}</div>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>
        <div class="userHome-group-self" v-if="userEnergyObj">
          <div class="userHome-group-left" :style="{paddingLeft:'10px',boxSizing:'border-box'}">
            <div :style="{marginRight:'10px'}">第{{userEnergyObj.userIndex}}名</div>
            <div>{{userEnergyObj.name}}</div>
          </div>
          <div class="userHome-group-right">
            <div :style="{marginRight:'10px'}">活力</div>
            <span
              :style="{backgroundColor:userEnergyObj.energyValueTotal>0?'#E94848':'#16AE7A',borderRadius:'8px',padding:'0px 6px',boxSizng:'border-box',color:'#fff',height:'20px',lineHeight:'20px'}"
            >{{userEnergyObj.energyValueTotal>0?"+":null}}{{userEnergyObj.energyValueTotal}}</span>
          </div>
        </div>
        <div
          class="userHome-group-rank"
          v-for="(item,index) in groupRankList"
          :key="'groupRank'+index"
        >
          <div class="userHome-group-left">
            <img
              :src="pngArr[index]"
              alt
              class="userHome-group-left-icon"
              :style="{marginRight:'7px'}"
            />
            <img
              :src="item.logo"
              alt
              class="userHome-group-left-avatar"
              :style="{marginRight:'7px'}"
            />
            <div>{{item.name}}</div>
          </div>
          <div class="userHome-group-right">
            <div :style="{marginRight:'5px'}">活力</div>
            <span
              :style="{backgroundColor:item.energyValueTotal>0?'#E94848':'#16AE7A',borderRadius:'8px',padding:'0px 6px',boxSizng:'border-box',color:'#fff',height:'20px',lineHeight:'20px'}"
            >{{item.energyValueTotal>0?"+":null}}{{item.energyValueTotal}}</span>
          </div>
        </div>
      </div>
      <div class="userHome-group-chart">
        <div class="userHome-group-title">各项目贡献度</div>
        <div class="userHome-group-pie" ref="piechartdiv" id="piechartdiv"></div>
      </div>
      <div class="userHome-group-line">
        <div class="userHome-group-title">企业活力走势</div>
        <div class="userHome-group-line-chart" ref="linechartdiv" id="linechartdiv"></div>
      </div>
      <div class="userHome-group-set" @click="logOut">
        退出登录
        <a-icon type="setting" class="userHome-group-set-icon" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import batteryPng from "@/assets/battery.png";
import VitalityIcon from "./VitalityIcon";
import chart from "../common/chart";
import api from "@/services/api";
import firstPng from "@/assets/first.png";
import secondPng from "@/assets/second.png";
import thirdPng from "@/assets/third.png";
import userEditPng from "@/assets/userEdit.png";
export default {
  name: "UserCenter",
  components: { VitalityIcon },
  data() {
    return {
      todayTotalTaskHours: 0,
      todayEnergyValue: 0,
      energyValueTotal: 0,
      batteryPng: batteryPng,
      groupUserList: [],
      groupRankList: [],
      chooseGroupIndex: 0,
      pngArr: [firstPng, secondPng, thirdPng],
      userEnergyObj: null,
      piechart: null,
      linechart: null,
      userEditPng: userEditPng,
    };
  },
  computed: mapState({
    user: (state) => state.auth.user,
    groupList: (state) => state.group.groupList,
    mainGroupMemberList: (state) => state.group.mainGroupMemberList,
  }),
  async mounted() {
    let data = [];
    if (!this.groupList) {
      this.getGroupList({ listType: 3 });
    }
    let res = await api.auth.monthEnergyWeb({
      startTime: this.$moment().startOf("day").valueOf(),
      endTime: this.$moment().endOf("day").valueOf(),
      type: 1,
      targetUGKey: this.user._key,
    });
    if (res.msg == "OK") {
      res.result.forEach((item) => {
        if (item.energyValueTotal > 0) {
          data.push({
            name: item.name,
            value: item.energyValueTotal,
          });
        }
      });
      data = this._.sortBy(data, "value").reverse();
      console.log(data);
      this.piechart = chart.createPieChart("piechartdiv", data);
    } else {
      this.$message.error(res.msg);
    }

    this.$nextTick(() => {
      Array.from(document.querySelectorAll("svg")).forEach((item) => {
        if (item.parentElement.parentElement.style.width) {
          item.parentElement.parentElement.style.display = "none";
        }
      });
    });
  },
  methods: {
    ...mapActions("common", ["changeHeaderIndex"]),
    ...mapActions("group", ["getGroupList"]),
    getData(groupList) {
      this.groupUserList = [];
      groupList.forEach((item, index) => {
        if (item.enterprise == 2) {
          this.groupUserList.push(item);
        }
      });
      this.groupUserList = this._.sortBy(this.groupUserList, [
        "energyValueTotal",
      ]);
      this.chooseGroup(this.groupUserList[this.chooseGroupIndex]._key, 0);
    },
    async chooseGroup(groupKey, index) {
      this.groupRankList = [];
      this.chooseGroupIndex = index;
      let res = await api.auth.monthEnergyWeb({
        startTime: this.$moment().startOf("day").valueOf(),
        endTime: this.$moment().endOf("day").valueOf(),
        type: 2,
        targetUGKey: groupKey,
      });
      if (res.msg == "OK") {
        res.result = this._.sortBy(res.result, ["energyValueTotal"]).reverse();
        let userIndex = this._.findIndex(res.result, { _key: this.user._key });
        this.userEnergyObj = this._.cloneDeep(res.result[userIndex]);
        this.userEnergyObj.userIndex = userIndex + 1;
        this.groupRankList = res.result.slice(0, 3);
        // console.log(this.groupRankList);
      } else {
        this.$message.error(res.msg);
      }
      let monthEndTime = this.$moment().endOf("month").endOf("day").valueOf();
      let lineData = [
        { country: "近一个月", value: 0 },
        { country: "近三个月", value: 0 },
        { country: "近半年", value: 0 },
        { country: "近一年", value: 0 },
      ];
      let lineRes = await api.auth.monthEnergy({
        startTime: this.$moment()
          .subtract(11, "month")
          .startOf("day")
          .valueOf(),
        endTime: monthEndTime,
        type: 2,
        targetUGKey: groupKey,
      });
      if (lineRes.msg == "OK") {
        //近一个月
        lineRes.result.forEach((item, index) => {
          let monthStartTime = this.$moment()
            .startOf("month")
            .startOf("day")
            .valueOf();
          if (item.startTime >= monthStartTime) {
            lineData[0].value = lineData[0].value + item.value;
          }
          //近三个月
          let thirdmonthStartTime = this.$moment()
            .subtract(2, "month")
            .startOf("month")
            .startOf("day")
            .valueOf();
          if (item.startTime >= thirdmonthStartTime) {
            lineData[1].value = lineData[1].value + item.value;
          }
          //近半年
          let halfmonthStartTime = this.$moment()
            .subtract(5, "month")
            .startOf("month")
            .startOf("day")
            .valueOf();
          if (item.startTime >= thirdmonthStartTime) {
            lineData[2].value = lineData[2].value + item.value;
          }
          //全年
          lineData[3].value = lineData[3].value + item.value;
        });
        console.log(lineData);
        lineData.forEach((lineItem, lineIndex) => {
          lineItem.value = lineItem.value.toFixed(1);
        });
        this.linechart = chart.createLineChart("linechartdiv", lineData);
        // console.log(this.groupRankList);
      } else {
        this.$message.error(lineRes.msg);
      }
    },
    logOut() {
      // localStorage.clear();
      localStorage.clear();
      // document.querySelector("iframe").contentWindow.postMessage(
      //   {
      //     eventName: "im-logout"
      //   },
      //   "https://im.qingtime.cn"
      // );
      this.$socket.emit("logout", this.user._key);
      this.$message.success("退出登录成功");
      this.$router.push("/bootpage");
      // const redirect = `${window.location.protocol}//${window.location.host}`;
      // window.location.href = `https://account.qingtime.cn?apphigh=27&redirect=${redirect}`;
    },
  },
  watch: {
    mainGroupMemberList: {
      handler(newValue) {
        if (newValue && newValue.length > 0) {
          newValue.forEach((item, index) => {
            if (item.userId == this.user._key) {
              this.todayTotalTaskHours = item.todayTotalTaskHours;
              this.todayEnergyValue = item.todayEnergyValue;
              this.energyValueTotal = item.energyValueTotal;
            }
          });
        }
      },
      immediate: true,
    },
    groupList: {
      handler(newValue, oldValue) {
        if (newValue) {
          this.getData(newValue);
        }
      },
      immediate: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.userHome-container {
  width: 100%;
  height: 100%;
  padding: 9px 15px 0px 15px;
  box-sizing: border-box;
  overflow: auto;
}
.userHome-user-info {
  width: 100%;
  height: 95px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e7e9ea;
  position: relative;
}
.userHome-user-avatar {
  width: 60px;
  height: 60px;
  overflow: hidden;
  border-radius: 50%;
  margin-right: 18px;
}
.userHome-user-avatar-icon {
  width: 25px;
  height: 25px;
  position: absolute;
  bottom: 15px;
  left: 38px;
  cursor: pointer;
}
.userHome-user-avatar-icon > img {
  width: 100%;
  height: 100%;
}
.userHome-user-avatar > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.userHome-user-userinfo {
  width: calc(100% - 78px);
  height: 100px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  align-content: center;
}
.userHome-user-nickName {
  width: 100%;
  height: 19px;
  font-size: 16px;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  line-height: 22px;
}
.userHome-user-energy {
  width: 100%;
  height: 22px;
  font-size: 12px;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  line-height: 17px;
  display: flex;
  align-items: center;
}
.userHome-user-energy-icon {
  width: 19px;
  height: 100%;
  display: flex;
  align-items: center;
  margin: 0px 5px;
}
.userHome-user-energy-icon img {
  width: 19px;
  height: 12px;
}
.userHome-user-energyIcon {
  width: 100%;
  height: 17px;
  font-size: 12px;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  line-height: 17px;
  display: flex;
  align-items: center;
}
.userHome-group-info,
.userHome-group-chart,
.userHome-group-line {
  padding: 12px 0px;
  box-sizing: border-box;
  border-bottom: 1px solid #e7e9ea;
}
.userHome-group-title {
  width: 100%;
  height: 22px;
  font-size: 14px;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  line-height: 22px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.userHome-group-self {
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(239, 245, 231, 1);
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
}
.userHome-group-rank {
  width: 100%;
  height: 40px;
  display: flex;
}
.userHome-group-left {
  width: 80%;
  height: 100%;
  display: flex;
  align-items: center;
}
.userHome-group-left-icon {
  width: 26px;
  height: 26px;
}
.userHome-group-left-avatar {
  width: 26px;
  height: 26px;
  overflow: hidden;
  border-radius: 50%;
}
.userHome-group-left-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.userHome-group-right {
  width: 20%;
  height: 100%;
  display: flex;
  align-items: center;
}
.userHome-group-pie {
  width: 100%;
  height: 250px;
}
.userHome-group-line-chart {
  width: 100%;
  height: 250px;
}
.userHome-group-set {
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  position: relative;
  cursor: pointer;
}
.userHome-group-set-icon {
  font-size: 20px;
  position: absolute;
  top: 14px;
  right: 0px;
  cursor: pointer;
}
</style>