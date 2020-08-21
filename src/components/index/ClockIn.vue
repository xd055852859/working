<template>
  <div
    :class="clockItem?'clockItemIn':'clockIn'"
    :style="!clockItem?{background:theme.backgroundColor?theme.backgroundColor:'url('+theme.backgroundImg+')',color:theme.fontColor}:null"
  >
    <div class="clockIn-title" v-if="!clockItem">
      <div class="clockIn-title-groupName" v-if="groupArray.length>0">
        默认打卡群
        <a-dropdown v-if="groupList.length>0">
          <a-menu slot="overlay" @click="handleMenuClick">
            <a-menu-item
              :style="{fontSize:'12px'}"
              :key="index"
              v-for="(item,index) in groupList"
            >{{item.groupName}}</a-menu-item>
          </a-menu>
          <div class="clockIn-title-list">
            {{groupList[chooseGroupIndex].groupName}}
            <a-icon type="down" :style="{fontSize:'16px'}" />
          </div>
        </a-dropdown>
      </div>

      <div class="clockIn-title-button">
        <a-button
          type="primary"
          class="clockIn-title-save"
          :style="{backgroundColor:'#16AE7A',border:'0px'}"
          @click="saveNote"
        >保存</a-button>
        <a-button
          type="primary"
          class="clockIn-title-button"
          @click="showImage"
          :style="{backgroundColor:'#FC766A',margin:'0px 15px 0px 8px',border:'0px'}"
        >{{nowTime?"下班打卡":"上班打卡"}}</a-button>
        <a-icon type="close" :style="{fontSize:'18px',color:'#333'}" @click="closeClockIn" />
      </div>
    </div>
    <div v-if="groupArray.length>0&&!nowTime&&!clockItem" class="clockIn-info">
      <div class="clockIn-subTitle clockIn-mainTitle">
        <img :src="clockIcon1" alt class="clockIn-icon" />
        事务
        <div class="clockIn-top-num">
          活力值
          <div class="clockIn-numImg">
            <img :src="batteryPng" alt />
          </div>
          <div :style="{color:'#86B93F',fontSize:'14px',marginRight:'10px'}">{{todayEnergyValue}}</div>
        </div>
      </div>
      <div ref="amImage">
        <div class="clockIn-subTitle">
          <img :src="clockInSunImg" alt class="clockIn-icon" />
          今日计划
        </div>
        <div v-for="(item,index) in groupArray" :key="index" class="clockIn-group">
          <div v-if="taskArray[index]&&taskArray[index].length>0">
            <div class="clockIn-groupName">
              <div class="clockIn-img">
                <img :src="item.groupLogo|defaultGroup" alt />
              </div>
              <div>{{item.groupName}}</div>
            </div>
            <div
              v-for="(taskItem,taskIndex) in taskArray[index]"
              :key="taskIndex"
              class="clockIn-item"
            >
              <div class="clockIn-item-icon">
                <img :src="taskItem.finishPercent?finishImg:unfinishImg" alt />
              </div>
              <div
                class="clockIn-day"
                :style="!taskItem.endState?taskItem.finishPercent==0?{backgroundColor:'red'}:{backgroundColor:'#417505'}:null"
              >
                <div
                  class="clockIn-time-day"
                  :style="{left:taskItem.time<10? '5px':'0px'}"
                >{{taskItem.time}}</div>
                <div class="clockIn-time"></div>
                <div
                  class="clockIn-time-hour"
                  :style="{right:taskItem.hour<1? '4px':'0px'}"
                >{{taskItem.hour}}</div>
              </div>
              <div
                class="clockIn-item-title"
                :style="taskItem.finishPercent==2?{textDecoration:'line-through'}:null"
              >{{taskItem.title}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!---->
    <div class="clockIn-info" v-if="groupArray.length>0&&nowTime||clockItem">
      <div class="clockIn-subTitle clockIn-mainTitle">
        <img :src="clockIcon1" alt class="clockIn-icon" />
        事务
        <div class="clockIn-top-num">
          活力值
          <div class="clockIn-numImg">
            <img :src="batteryPng" alt />
          </div>
          <div :style="{color:'#86B93F',fontSize:'14px',marginRight:'10px'}">{{todayEnergyValue}}</div>
          <div>已工作时长 {{todayTotalTaskHours}}</div>
        </div>
      </div>
      <div ref="pmImage" class="pm-container">
        <div v-if="!clockItem">
          <div class="clockIn-subTitle">延期</div>
          <div v-for="(item,index) in groupArray" :key="'taskunFinish'+index" class="clockIn-group">
            <div v-if="taskunFinishArray[index]&&taskunFinishArray[index].length>0">
              <div class="clockIn-groupName">
                <div class="clockIn-img">
                  <img :src="item.groupLogo|defaultGroup" alt />
                </div>
                <div>{{item.groupName}}1</div>
              </div>
              <div
                v-for="(taskItem,taskIndex) in taskunFinishArray[index]"
                :key="'taskItemunFinish'+taskIndex"
                class="clockIn-item"
              >
                <div class="clockIn-item-icon">
                  <img :src="taskItem.finishPercent?finishImg:unfinishImg" alt />
                </div>
                <div
                  class="clockIn-day"
                  :style="!taskItem.endState?taskItem.finishPercent==0?{backgroundColor:'red'}:{backgroundColor:'#417505'}:null"
                >
                  <div
                    class="clockIn-time-day"
                    :style="{left:taskItem.time<10? '5px':'0px'}"
                  >{{taskItem.time}}</div>
                  <div class="clockIn-time"></div>
                  <div
                    class="clockIn-time-hour"
                    :style="{right:taskItem.hour<1? '4px':'0px'}"
                  >{{taskItem.hour}}</div>
                </div>
                <div
                  class="clockIn-item-title"
                  :style="taskItem.finishPercent==2?{textDecoration:'line-through'}:null"
                >{{taskItem.title}}</div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="!clockItem">
          <div class="clockIn-subTitle">昨日计划</div>
          <div v-for="(item,index) in groupArray" :key="'taskFinish'+index" class="clockIn-group">
            <div v-if="taskFinishArray[index]&&taskFinishArray[index].length>0">
              <div class="clockIn-groupName">
                <div class="clockIn-img">
                  <img :src="item.groupLogo|defaultGroup" alt />
                </div>
                <div>{{item.groupName}}</div>
              </div>
              <div
                v-for="(taskItem,taskIndex) in taskFinishArray[index]"
                :key="'taskItemFinish'+taskIndex"
                class="clockIn-item"
              >
                <div class="clockIn-item-icon">
                  <img :src="taskItem.finishPercent?finishImg:unfinishImg" alt />
                </div>
                <div
                  class="clockIn-day"
                  :style="!taskItem.endState?taskItem.finishPercent==0?{backgroundColor:'red'}:{backgroundColor:'#417505'}:null"
                >
                  <div
                    class="clockIn-time-day"
                    :style="{left:taskItem.time<10? '5px':'0px'}"
                  >{{taskItem.time}}</div>
                  <div class="clockIn-time"></div>
                  <div
                    class="clockIn-time-hour"
                    :style="{right:taskItem.hour<1? '4px':'0px'}"
                  >{{taskItem.hour}}</div>
                </div>
                <div
                  class="clockIn-item-title"
                  :style="taskItem.finishPercent==2?{textDecoration:'line-through'}:null"
                >{{taskItem.title}}</div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="clockItem">
          <div class="clockIn-subTitle">昨日任务</div>
          <div v-for="(item,index) in groupArray" :key="'taskYester'+index" class="clockIn-group">
            <div v-if="taskYesterdayArray[index]&&taskYesterdayArray[index].length>0">
              <div class="clockIn-groupName">
                <div class="clockIn-img">
                  <img :src="item.groupLogo|defaultGroup" alt />
                </div>
                <div>{{item.groupName}}</div>
              </div>
              <div
                v-for="(taskItem,taskIndex) in taskYesterdayArray[index]"
                :key="'taskItemYester'+taskIndex"
                class="clockIn-item"
              >
                <div class="clockIn-item-icon">
                  <img :src="taskItem.finishPercent?finishImg:unfinishImg" alt />
                </div>
                <div
                  class="clockIn-day"
                  :style="!taskItem.endState?taskItem.finishPercent==0?{backgroundColor:'red'}:{backgroundColor:'#417505'}:null"
                >
                  <div
                    class="clockIn-time-day"
                    :style="{left:taskItem.time<10? '5px':'0px'}"
                  >{{taskItem.time}}</div>
                  <div class="clockIn-time"></div>
                  <div
                    class="clockIn-time-hour"
                    :style="{right:taskItem.hour<1? '4px':'0px'}"
                  >{{taskItem.hour}}</div>
                </div>
                <div
                  class="clockIn-item-title"
                  :style="taskItem.finishPercent==2?{textDecoration:'line-through'}:null"
                >{{taskItem.title}}</div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div class="clockIn-subTitle">任务追踪</div>
          <div class="clockIn-div" :style="{color:'#333'}">
            <div>上午</div>
            <div
              v-for="(taskItem,taskIndex) in todayTaskArray.am"
              :key="'todayTaskAm'+taskIndex"
              class="clockIn-item"
            >
              <div class="clockIn-item-icon">
                <img :src="taskItem.finishPercent?finishImg:unfinishImg" alt />
              </div>
              <div
                class="clockIn-day"
                :style="!taskItem.endState?taskItem.finishPercent==0?{backgroundColor:'red'}:{backgroundColor:'#417505'}:null"
              >
                <div
                  class="clockIn-time-day"
                  :style="{left:taskItem.time<10? '5px':'0px'}"
                >{{taskItem.time}}</div>
                <div class="clockIn-time"></div>
                <div
                  class="clockIn-time-hour"
                  :style="{right:taskItem.hour<1? '4px':'0px'}"
                >{{taskItem.hour}}</div>
              </div>
              <div
                class="clockIn-item-title"
                :style="taskItem.finishPercent==2?{textDecoration:'line-through'}:null"
              >{{taskItem.title}}</div>
            </div>
            <div>下午</div>
            <div
              v-for="(taskItem,taskIndex) in todayTaskArray.pm"
              :key="'todayTaskPm'+taskIndex"
              class="clockIn-item"
            >
              <div class="clockIn-item-icon">
                <img :src="taskItem.finishPercent?finishImg:unfinishImg" alt />
              </div>
              <div
                class="clockIn-day"
                :style="!taskItem.endState?taskItem.finishPercent==0?{backgroundColor:'red'}:{backgroundColor:'#417505'}:null"
              >
                <div
                  class="clockIn-time-day"
                  :style="{left:taskItem.time<10? '5px':'0px'}"
                >{{taskItem.time}}</div>
                <div class="clockIn-time"></div>
                <div
                  class="clockIn-time-hour"
                  :style="{right:taskItem.hour<1? '4px':'0px'}"
                >{{taskItem.hour}}</div>
              </div>
              <div
                class="clockIn-item-title"
                :style="taskItem.finishPercent==2?{textDecoration:'line-through'}:null"
              >{{taskItem.title}}</div>
            </div>
          </div>
        </div>
        <div v-if="!clockItem">
          <div class="clockIn-subTitle">今日指派</div>
          <div v-for="(item,index) in groupArray" :key="'taskCreate'+index" class="clockIn-group">
            <div v-if="taskCreateArray[index]&&taskCreateArray[index].length>0">
              <div class="clockIn-groupName">
                <div class="clockIn-img">
                  <img :src="item.groupLogo|defaultGroup" alt />
                </div>
                <div>{{item.groupName}}</div>
              </div>
              <div
                v-for="(taskItem,taskIndex) in taskCreateArray[index]"
                :key="'taskItemCreate'+taskIndex"
                class="clockIn-item"
              >
                <div class="clockIn-item-icon">
                  <img :src="taskItem.finishPercent?finishImg:unfinishImg" alt />
                </div>
                <div
                  class="clockIn-day"
                  :style="!taskItem.endState?taskItem.finishPercent==0?{backgroundColor:'red'}:{backgroundColor:'#417505'}:null"
                >
                  <div
                    class="clockIn-time-day"
                    :style="{left:taskItem.time<10? '5px':'0px'}"
                  >{{taskItem.time}}</div>
                  <div class="clockIn-time"></div>
                  <div
                    class="clockIn-time-hour"
                    :style="{right:taskItem.hour<1? '4px':'0px'}"
                  >{{taskItem.hour}}</div>
                </div>
                <div
                  class="clockIn-item-title"
                  :style="taskItem.finishPercent==2?{textDecoration:'line-through'}:null"
                >{{taskItem.title}}</div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="!clockItem">
          <div class="clockIn-subTitle">明日计划</div>
          <div v-for="(item,index) in groupArray" :key="'taskTommrow'+index" class="clockIn-group">
            <div v-if="taskTommrowArray[index]&&taskTommrowArray[index].length>0">
              <div class="clockIn-groupName">
                <div class="clockIn-img">
                  <img :src="item.groupLogo|defaultGroup" alt />
                </div>
                <div>{{item.groupName}}</div>
              </div>
              <div
                v-for="(taskItem,taskIndex) in taskTommrowArray[index]"
                :key="'taskItemTommrow'+taskIndex"
                class="clockIn-item"
              >
                <div class="clockIn-item-icon">
                  <img :src="taskItem.finishPercent?finishImg:unfinishImg" alt />
                </div>
                <div
                  class="clockIn-day"
                  :style="!taskItem.endState?taskItem.finishPercent==0?{backgroundColor:'red'}:{backgroundColor:'#417505'}:null"
                >
                  <div
                    class="clockIn-time-day"
                    :style="{left:taskItem.time<10? '5px':'0px'}"
                  >{{taskItem.time}}</div>
                  <div class="clockIn-time"></div>
                  <div
                    class="clockIn-time-hour"
                    :style="{right:taskItem.hour<1? '4px':'0px'}"
                  >{{taskItem.hour}}</div>
                </div>
                <div
                  class="clockIn-item-title"
                  :style="taskItem.finishPercent==2?{textDecoration:'line-through'}:null"
                >{{taskItem.title}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="clockIn-pn">
      <div class="clockIn-pn-info">
        <div class="clockIn-subTitle clockIn-mainTitle">
          <img :src="clockIcon2" alt class="clockIn-icon" />
          成就
        </div>
        <a-textarea
          v-model="positive"
          :placeholder="!clockItem?'正面：利好、收获':''"
          :style="{height:clockItem?'80%':'40%',backgroundColor:'#fff',color:clockItem?theme.fontColor:'#333'}"
          :disabled="clockItem?true:false"
        />
        <a-textarea
          v-model="positiveClose"
          :placeholder="!clockItem?'此内容仅自己可见…':''"
          :style="{height:'40%',backgroundColor:'#fff',color:clockItem?theme.fontColor:'#333',marginTop:'5px'}"
          v-if="!clockItem"
        />
        <img :src="sercetPng" alt class="clockIn-sercet" v-if="!clockItem" />
      </div>
      <div class="clockIn-pn-info">
        <div class="clockIn-subTitle clockIn-mainTitle">
          <img :src="clockIcon3" alt class="clockIn-icon" />
          风险
        </div>
        <a-textarea
          v-model="negative"
          :placeholder="!clockItem?'负面：利空、风险、压力':''"
          :style="{height:clockItem?'80%':'40%',backgroundColor:'#fff',color:clockItem?theme.fontColor:'#333'}"
          :disabled="clockItem?true:false"
        />
        <a-textarea
          v-model="negativeClose"
          :placeholder="!clockItem?'此内容仅自己可见…':''"
          :style="{height:'40%',backgroundColor:'#fff',color:clockItem?theme.fontColor:'#333',marginTop:'5px'}"
          v-if="!clockItem"
        />
        <img :src="sercetPng" alt class="clockIn-sercet" v-if="!clockItem" />
      </div>
    </div>
    <div class="clockIn-note" id="note">
      <div class="clockIn-subTitle clockIn-mainTitle">
        <img :src="clockIcon4" alt class="clockIn-icon" />
        随记
      </div>
      <Editor
        :clientHeight.sync="clientHeight"
        :style="{width:'100%'}"
        :editorType="clockItem?'clockShow':'clockEdit'"
        :note.sync="note"
      />
      <div :style="{position:'relative'}" v-if="!clockItem">
        <Editor
          :clientHeight.sync="clientHeight"
          :style="{width:'100%',marginTop:'30px'}"
          :editorType="'clockCloseEdit'"
          :noteClose.sync="noteClose"
        />
        <img :src="sercetPng" alt class="clockIn-sercet editor-sercet" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import api from "@/services/api";
import uploadFile from "../../common/js/upload";
import finishImg from "@/assets/clockInFinish.png";
import unfinishImg from "@/assets/clockInunFinish.png";
import clockInSunImg from "@/assets/clockInSunImg.png";
import clockIcon1 from "@/assets/clockIcon1.png";
import clockIcon2 from "@/assets/clockIcon2.png";
import clockIcon3 from "@/assets/clockIcon3.png";
import clockIcon4 from "@/assets/clockIcon4.png";
import batteryPng from "@/assets/battery.png";
import sercetPng from "@/assets/sercet.png";
import Editor from "../common/Editor";
export default {
  name: "ClockIn",
  props: ["clockItem"],
  components: {
    Editor,
  },
  data() {
    return {
      taskArray: [],
      groupArray: [],
      groupList: [],
      taskunFinishArray: [],
      taskFinishArray: [],
      taskCreateArray: [],
      taskTommrowArray: [],
      taskYesterdayArray: [],
      todayTaskArray: {
        am: [],
        pm: [],
      },
      finishImg,
      unfinishImg,
      clockInSunImg,
      clockIcon1,
      clockIcon2,
      clockIcon3,
      clockIcon4,
      chooseGroupIndex: 0,
      positive: "",
      negative: "",
      note: "",
      positiveClose: "",
      negativeClose: "",
      noteClose: "",
      clientHeight: 0,
      sercetPng: sercetPng,
      batteryPng: batteryPng,
      todayTotalTaskHours: 0,
      todayEnergyValue: 0,
    };
  },
  async mounted() {
    if (!this.clockItem) {
      // if (!this.allMainGroupArray) {
      this.allMainGroupTask({
        type1: this.groupType,
        targetUKey: this.user._key,
        type2: 1,
        finishPercentArray: [0, 1, 2],
      });
      // }
      let listRes = await api.group.getGroupList({
        listType: 3,
      });
      if (listRes.msg == "OK") {
        this.groupList = listRes.result;
      } else {
        this.$message.error(groupRes.msg);
      }
      let noteRes = await api.task.getNote({
        targetUKey: this.user._key,
        startTime: this.$moment().startOf("day").valueOf(),
        type: 2,
      });
      if (noteRes.msg == "OK") {
        this.positive = noteRes.result.positive;
        this.negative = noteRes.result.negative;
        this.note = noteRes.result.note;
        this.positiveClose = noteRes.result.positiveClose;
        this.negativeClose = noteRes.result.negativeClose;
        this.noteClose = noteRes.result.noteClose;
      } else {
        if (noteRes.msg == "无该成就/风险/随记") {
          await api.task.setNote({
            startTime: this.$moment().startOf("day").valueOf(),
            type: 2,
            positive: "",
            negative: "",
            note: "",
            positiveClose: "",
            negativeClose: "",
            noteClose: "",
          });
        } else {
          this.$message.error(noteRes.msg);
        }
      }
      // this.clientHeight = document.getElementById("note").clientHeight - 100;
    } else {
      this.positive = this.clockItem.cardArray[0][0].positive;
      this.negative = this.clockItem.cardArray[0][0].negative;
      this.note = this.clockItem.cardArray[0][0].note;
      this.getData(this.clockItem.groupArray, this.clockItem.cardArray);
    }
  },
  computed: mapState({
    user: (state) => state.auth.user,
    theme: (state) => state.auth.theme,
    nowTime: (state) => state.common.nowTime,
    uptoken: (state) => state.auth.uptoken,
    groupType: (state) => state.group.groupType,
    targetUInfo: (state) => state.auth.targetUInfo,
    mainGroupMemberList: (state) => state.group.mainGroupMemberList,
    headerIndex: (state) => state.common.headerIndex,
    allMainTaskArray: (state) => state.task.allMainTaskArray,
    allMainGroupArray: (state) => state.task.allMainGroupArray,
  }),
  methods: {
    ...mapActions("task", ["allGroupTask", "allMainGroupTask"]),
    ...mapActions("message", ["postMessage"]),
    ...mapActions("group", ["getGroupList"]),

    getData(groupArray, arr) {
      let taskArray = [];
      this.groupArray = [];
      this.todayTaskArray = {
        am: [],
        pm: [],
      };
      groupArray.forEach((item, index) => {
        if (item.groupName.indexOf("主群") == -1) {
          this.groupArray.push(item);
          taskArray.push(arr[index]);
        }
      });
      let userKey = this.clockItem
        ? taskArray[0][0].executorKey
        : this.user._key;
      const startTime = this.$moment(new Date()).startOf("day").valueOf();
      const endTime = this.$moment(new Date()).endOf("day").valueOf();
      const yesterdayStartTime = this.$moment(new Date())
        .subtract(1, "days")
        .startOf("day")
        .valueOf();
      const yesterdayEndTime = this.$moment(new Date())
        .subtract(1, "days")
        .endOf("day")
        .valueOf();
      taskArray.forEach((item, index) => {
        this.taskArray[index] = [];
        this.taskFinishArray[index] = [];
        this.taskCreateArray[index] = [];
        this.taskTommrowArray[index] = [];
        this.taskunFinishArray[index] = [];
        this.taskYesterdayArray[index] = [];
        item.forEach((taskItem, taskIndex) => {
          if (taskItem.taskEndDate) {
            let time = Math.floor(
              (this.$moment(taskItem.taskEndDate).endOf("day").valueOf() -
                this.$moment(new Date().getTime()).endOf("day").valueOf()) /
                86400000
            );
            taskItem.time = isNaN(time)
              ? ""
              : time < 0
              ? Math.abs(time)
              : Math.abs(time) + 1;
            taskItem.endState = isNaN(time) ? false : time < 0 ? false : true;
            if (
              taskItem.finishPercent == 0 &&
              taskItem.executorKey == userKey &&
              taskItem.taskEndDate < endTime
            ) {
              this.taskArray[index].push(taskItem);
            }
            if (
              taskItem.finishPercent == 0 &&
              taskItem.executorKey == userKey &&
              taskItem.taskEndDate < yesterdayEndTime
            ) {
              this.taskunFinishArray[index].push(taskItem);
            }
            if (
              taskItem.executorKey == userKey &&
              taskItem.taskEndDate >= startTime &&
              taskItem.taskEndDate < endTime
            ) {
              this.taskFinishArray[index].push(taskItem);
            }
            if (
              taskItem.finishPercent == 1 &&
              taskItem.executorKey == userKey &&
              taskItem.todayTaskTime >= startTime &&
              taskItem.todayTaskTime < endTime
            ) {
              if (this.$moment(taskItem.todayTaskTime).hour() < 12) {
                this.todayTaskArray.am.push(taskItem);
              } else {
                this.todayTaskArray.pm.push(taskItem);
              }
            }
            if (
              taskItem.creatorKey == userKey &&
              taskItem.executorKey != userKey &&
              taskItem.time == 1 &&
              taskItem.endState
            ) {
              this.taskCreateArray[index].push(taskItem);
            }
            if (
              taskItem.finishPercent == 0 &&
              taskItem.executorKey == userKey &&
              taskItem.time == 2 &&
              taskItem.endState
            ) {
              this.taskTommrowArray[index].push(taskItem);
            }
            if (
              taskItem.executorKey == userKey &&
              taskItem.taskEndDate >= yesterdayStartTime &&
              taskItem.taskEndDate < yesterdayEndTime
            ) {
              this.taskYesterdayArray[index].push(taskItem);
            }
          }
        });
      });
    },
    handleMenuClick(e) {
      this.chooseGroupIndex = e.key;
      // document.querySelector("iframe").contentWindow.postMessage(
      //   {
      //     eventName: "go-chat",
      //     data: {
      //       username: this.groupList[this.chooseGroupIndex].groupUUID,
      //       groupName: this.groupList[this.chooseGroupIndex].groupName,
      //       type: "c",
      //       groupLogo: this.groupList[this.chooseGroupIndex].groupLogo
      //     }
      //   },
      //   "https://im.qingtime.cn"
      // );
    },
    closeClockIn() {
      this.$emit("update:clockInState", false);
    },
    async showImage(page, limit) {
      let that = this;
      // let mimeType = ["image/png", "image/jpeg"];
      // let dom = this.nowTime ? this.$refs.pmImage : this.$refs.amImage;
      const startTime = this.$moment().startOf("day").valueOf();

      // html2canvas(dom).then(canvas => {
      //   let dataURL = canvas.toDataURL("image/png");
      //   let imgFile = this.dataURLtoFile(dataURL);
      //   uploadFile.uploadImg(imgFile, that.uptoken, mimeType, async function(
      //     url
      //   ) {
      //     console.log(imgFile);
      const timeStr = that.$moment().format("YYYY/MM/DD HH:mm:ss");
      let obj = {
        startTime: startTime,
        type: this.nowTime ? 2 : 1,
        groupKey: this.groupList[that.chooseGroupIndex]._key,
        clockInDateStr: timeStr,
        isAuto: 2,
      };
      if (this.nowTime) {
        obj.positive = this.positive;
        obj.negative = this.negative;
        obj.note = this.note;
        obj.positiveClose = this.positiveClose;
        obj.negativeClose = this.negativeClose;
        obj.noteClose = this.noteClose;
      }
      let res = await api.task.clockIn(obj);
      if (res.msg == "OK") {
        that.$message.success("打卡成功");
        if (that.nowTime) {
          let url =
            "http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&per=3&text=打卡成功,你已完成" +
            that._.flatten(that.taskFinishArray).length +
            "条任务";
          // baidu //request.url = encodeURI(url);
          //url = "http://translate.google.cn/translate_tts?ie=UTF-8&tl=zh-CN&total=1&idx=0&textlen=19&prev=input&q=打卡成功,你已完成99条任务"
          // + encodeURI(str); // google

          // request.contentType = "audio/mp3"; // for baidu
          //request.contentType = "audio/mpeg"; // for google
          let n = new Audio(url);
          n.src = url;
          n.play();
        }
      } else {
        that.$message.error(res.msg);
      }
      //   });
      // });
    },
    dataURLtoFile(dataurl, filename = "file") {
      let arr = dataurl.split(",");
      let mime = arr[0].match(/:(.*?);/)[1];
      let suffix = mime.split("/")[1];
      let bstr = atob(arr[1]);
      let n = bstr.length;
      let u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], `${filename}.${suffix}`, {
        type: mime,
      });
    },
    async saveNote() {
      let noteRes = await api.task.setNote({
        startTime: this.$moment().startOf("day").valueOf(),
        type: 2,
        positive: this.positive,
        negative: this.negative,
        note: this.note,
        positiveClose: this.positiveClose,
        negativeClose: this.negativeClose,
        noteClose: this.noteClose,
      });
      if (noteRes.msg == "OK") {
        this.$message.success("保存成功");
      } else {
        this.$message.error(noteRes.msg);
      }
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
            }
          });
        }
      },
      immediate: true,
    },
    headerIndex(newValue, oldValue) {
      if (newValue != oldValue) {
        this.$emit("update:clockInState", false);
      }
    },
    allMainGroupArray: {
      handler(newValue) {
        if (newValue) {
          this.getData(
            this._.cloneDeep(newValue),
            this._.cloneDeep(this.allMainTaskArray)
          );
        }
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.clockIn {
  width: calc(100% - 60px);
  height: 100%;
  box-sizing: border-box;
  position: fixed;
  top: 0px;
  left: 60px;
  z-index: 25;
  display: flex;
  flex-wrap: wrap;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
}
.clockItemIn {
  width: 100%;
  height: 500px;
  display: flex;
  flex-wrap: wrap;
}
.clockIn-icon {
  width: 22px;
  height: 22px;
  margin-right: 5px;
}
.clockIn-title {
  width: 100%;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  margin-bottom: 10px;
  background-color: #fff;
  padding: 0px 10px;
  box-sizing: border-box;
}
.clockIn-title-groupName {
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: 400;
  color: rgba(153, 153, 153, 1);
}
.clockIn-title-list {
  min-width: 80px;
  font-size: 12px;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  margin-left: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.clockIn-info {
  width: 24%;
  height: calc(100% - 66px);
  margin-right: 1%;
  margin-left: 10px;
  overflow: auto;
}
.clockIn-top-num {
  display: flex;
  margin-left: 10px;
}
.clockIn-numImg {
  width: 18px;
  height: 12px;
  margin: 0px 5px;
}
.clockIn-numImg img {
  width: 100%;
  height: 100%;
}
.pm-container {
  width: 100%;
  height: calc(100% - 45px);
}
.clockIn-subTitle {
  font-size: 12px;
  margin: 10px 0px;
  display: flex;
  align-items: center;
}
.clockIn-group {
  margin-top: 10px;
  color: #333;
}
.clockIn-group > div,
.clockIn-div {
  background-color: #fff;
  padding: 10px;
  box-sizing: border-box;
}
.clockIn-groupName {
  width: 100%;
  height: 22px;
  font-size: 12px;
  display: flex;
}
.clockIn-img {
  width: 20px;
  height: 20px;
  overflow: hidden;
  border-radius: 50%;
}
.clockIn-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.clockIn-item {
  width: 100%;
  min-height: 48px;
  background: #e8e8e8;
  font-size: 12px;
  color: #000;
  margin-top: 1px;
  padding: 7px 10px;
  display: flex;
  align-items: center;
  align-content: flex-start;
}
.clockIn-item-icon {
  width: 16px;
  height: 100%;
}
.clockIn-item-icon img {
  width: 14px;
  height: 14px;
}
.clockIn-day {
  width: 20px;
  height: 20px;
  line-height: 20px;
  padding: 3px 0px 0px 6px;
  color: #fff;
  background-color: #535353;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  margin-right: 5px;
  font-size: 12px;
}
.clockIn-time {
  width: 0;
  height: 0;
  border-width: 20px;
  border-style: solid;
  border-color: #35a6f8 transparent transparent transparent;
  position: absolute;
  top: -2px;
  right: -20px;
  z-index: 2;
}
.clockIn-time-hour {
  width: 10px;
  height: 10px;
  line-height: 10px;
  font-size: 8px;
  color: #fff;
  position: absolute;
  top: 0px;
  z-index: 3;
  transform: scale(0.7);
}
.clockIn-time-day {
  width: 10px;
  height: 10px;
  line-height: 10px;
  font-size: 10px;
  color: #fff;
  position: absolute;
  bottom: 0px;
  z-index: 3;
}
.clockIn-item-title {
  width: calc(100% - 45px);
  word-wrap: break-word;
}
.clockIn-footer {
  height: 60px;
  width: 100%;
  position: absolute;
  left: 0px;
  bottom: 0px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.clockIn-footer-button {
  height: 32px;
  width: 92px;
  color: #fff;
  line-height: 32px;
  text-align: center;
  background: rgba(252, 118, 106, 1);
  border-radius: 4px;
  cursor: pointer;
}
.clockIn-pn {
  width: 24%;
  height: calc(100% - 66px);
  margin-right: 1%;
}
.clockIn-pn-info {
  width: 100%;
  height: 50%;
  position: relative;
}
.clockIn-mainTitle {
  font-size: 14px;
  font-weight: 500;
}
.clockIn-note {
  width: calc(50% - 20px);
  height: calc(100% - 66px);
  overflow: auto;
}
.clockIn-sercet {
  width: 40px;
  height: 40px;
  position: absolute;
  top: calc(40% + 37px);
  right: 0px;
  z-index: 5;
}
.editor-sercet {
  top: 0px;
}
</style>