<template>
  <div class="diary">
    <!-- <div class="diary-list">
      <div
        v-for="(item,index) in diaryList"
        :key="index"
        @click="setContent(item)"
        class="diary-item"
      >
        <div class="diary-title">{{item.title}}</div>
        <div class="diary-icon">
          <div class="diary-icon-clickNumber">
            <img :src="clickNumberPng" alt />
            {{item.clickNumber?item.clickNumber:0}}
          </div>
          <div class="diary-icon-isLike">
            <img :src="unlikePng" alt />
            {{item.likeNumber}}
          </div>
        </div>
      </div>
    </div>
    <div class="diary-pagination">
      <a-pagination
        v-model="page"
        :total="total"
        :pageSize="limit"
        show-less-items
        @change="onChange"
      />
    </div>-->
    <div class="diary-bg">
      <div class="diary-menu">
        <div class="diary-menu-title">
          目录
          <a-icon type="close" />
        </div>
        <div
          v-for="(item,index) in dateArray"
          :key="'date'+index"
          class="diary-menu-item"
          @click="chooseDiary(index)"
          :style="{background:diaryIndex==index?'rgb(229, 231, 234)':null}"
        >
          <span :style="{marginRight:'10px'}">{{item.date[0]}}</span>
          <span>{{item.date[1]}}</span>
          <span>({{item.arr.length}})</span>
        </div>
      </div>
      <div class="diary-container" v-if="dayCanlendarArray.length>0">
        <h2>一、今日任务</h2>
        <div
          v-for="(item,index) in dayCanlendarArray[diaryIndex][diaryKey]"
          :key="'date'+index"
          class="diary-container-item"
          @click="diaryIndex=index"
        >
          <TaskItem :cardItem="item" v-on="$listeners" v-bind="$attrs" />
        </div>
        <h2>二、PN</h2>
        <div class="diary-content-pn">
          <div class="diary-content-tab">
            <div>正面：利好、收获</div>
            <div>负正：利空、风险、压力</div>
          </div>
          <div class="diary-content-info">
            <div>{{positive}}</div>
            <div>{{negative}}</div>
          </div>
        </div>
        <h2>三、随记</h2>
        <Editor :style="{width:'100%',minHeight:'300px'}" editorType="clockShow" :note.sync="note" />
        <!-- <a-icon type="close" class="diary-info-close" @click="contentState=false" /> -->
        <div class="diary-comment" v-if="groupType != 3">
          <div class="diary-comment-title">
            <div class="diary-comment-icon">
              <img :src="commentPng" alt />评论
            </div>
            <!-- <div class="diary-comment-like">
              <img :src="likePng" alt v-if="contentItem.isLike" @click="likeDiary(-1)" />
              <img :src="unlikePng" alt v-if="!contentItem.isLike" @click="likeDiary(1)" />
              点赞 {{contentItem.likeNumber}}
            </div>-->
          </div>
          <div
            class="diary-comment-info"
            @scroll="scrollCommentLoading"
            v-if="commentList.length>0"
          >
            <div
              class="diary-comment-item"
              v-for="(commentItem,commentIndex) in commentList"
              :key="commentIndex"
            >
              <div class="diary-comment-item-avatar">
                <img :src="commentItem|defaultPerson" alt />
              </div>
              <div class="diary-comment-item-info">
                <div class="diary-comment-item-nickName">{{commentItem.nickName}}</div>
                <div class="diary-comment-item-content">{{commentItem.content}}</div>
              </div>
              <div
                class="diary-comment-item-reply"
                v-if="commentItem.userKey==user._key"
                @click="deleteComment(commentItem,commentIndex)"
              >
                <div class="diary-comment-delete-icon">
                  <img :src="deletePng" alt />
                </div>
                <div class="diary-comment-reply-title">删除</div>
              </div>
            </div>
          </div>
        </div>
        <div class="diary-comment-button" v-if="groupType != 3">
          <a-input placeholder="我要评论......" :style="{width:'90%'}" v-model="comment" />
          <a-button
            type="primary"
            :style="{backgroundColor:'#16AE7A',border:'0px',width:'10%'}"
            @click="addComment"
          >发送</a-button>
        </div>
      </div>

      <!-- <div class="diary-content">
        <div class="diary-info">
          <div class="diary-content-title">{{contentItem.title}}</div>
          <div v-html="contentItem.content"></div>
        
      </div>-->
    </div>
    <a-dropdown class="diary-person" v-if="groupType==3">
      <div class="diary-avatar">
        <img :src="personArray[personIndex]|defaultPerson" alt />
      </div>
      <a-menu slot="overlay">
        <a-menu-item v-for="(item,index) in personArray" :key="'person'+index">
          <div class="diary-avatar" @click="choosePerson(item.key,index)">
            <img :src="item|defaultPerson" alt />
          </div>
        </a-menu-item>
      </a-menu>
    </a-dropdown>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { Modal } from "ant-design-vue";
import api from "@/services/api";
import Editor from "../common/Editor";
import replyPng from "@/assets/replyDiary.png";
import deletePng from "@/assets/deleteDiary.png";
import commentPng from "@/assets/comment.png";
import likePng from "@/assets/like.png";
import unlikePng from "@/assets/unlike.png";
import clickNumberPng from "@/assets/clickNumber.png";
import TaskItem from "../content/task/TaskItem";
export default {
  name: "Diary",
  components: {
    Editor,
    TaskItem,
  },
  data() {
    return {
      page: 1,
      limit: 20,
      commentPage: 1,
      commentLimit: 10,
      total: 0,
      diaryList: [],
      contentItem: null,
      contentState: false,
      replyPng: replyPng,
      deletePng: deletePng,
      commentPng: commentPng,
      likePng: likePng,
      unlikePng: unlikePng,
      clickNumberPng: clickNumberPng,
      isLike: false,
      comment: "",
      commentList: [],
      commentTotal: 0,
      dayCanlendarArray: [],
      diaryIndex: 0,
      diaryKey: 0,
      positive: "",
      negative: "",
      note: "",
      personObj: {},
      personArray: [],
      personIndex: 0,
      contentKey: 0,
    };
  },
  computed: mapState({
    user: (state) => state.auth.user,
    targetUInfo: (state) => state.auth.targetUInfo,
    groupType: (state) => state.group.groupType,
    user: (state) => state.auth.user,
    groupType: (state) => state.group.groupType,
    allGroupArray: (state) => state.task.allGroupArray,
    allTaskArray: (state) => state.task.allTaskArray,
    cardArray: (state) => state.task.cardArray,
  }),
  mounted() {
    this.diaryKey = this.user._key;
    // this.getData(this.page, this.limit);
  },
  methods: {
    // async getData(page, limit) {
    //   this.diaryList = [];
    //   let startTime = this.$moment(new Date())
    //     .subtract(1, "days")
    //     .startOf("day")
    //     .valueOf();
    //   let endTime = this.$moment(new Date())
    //     .subtract(1, "days")
    //     .endOf("day")
    //     .valueOf();
    //   if (this.groupType != 3) {
    //     let obj = {};
    //     if (this.groupType == 1) {
    //       obj = {
    //         curPage: page,
    //         perPage: limit,
    //       };
    //     } else if (this.groupType == 2) {
    //       obj = {
    //         targetUKey: this.targetUInfo._key,
    //         startTime: startTime,
    //         endTime: endTime,
    //       };
    //     }
    //     let res = await api.auth.getDiaryList(obj);
    //     if (res.msg == "OK") {
    //       res.result.forEach((item) => {
    //         if (item.content) {
    //           this.diaryList.push(item);
    //         }
    //       });
    //       if (this.groupType == 2) {
    //         this.contentState = true;
    //         this.setContent(this.diaryList[0]);
    //       }
    //       this.total = res.totalNumber;
    //     } else {
    //       this.$message.error(res.msg);
    //     }
    //   }
    // },
    // async setContent(item) {
    //   item.content = item.content
    //     .replace("[已延期]", "一、已延期")
    //     .replace("[今日计划]", "二、计划(昨日)")
    //     .replace("[今日成果]", "三、跟踪(成果)")
    //     .replace("[指派]", "四、指派")
    //     .replace("[明日计划]", "五、明日计划")
    //     .replace("[PN]", "六、PN")
    //     .replace("[随记]", "七、随记");
    //   this.contentItem = item;
    //   this.contentState = true;
    //   console.log(this.contentItem.note);
    //   this.getCommentList(this.commentPage, this.commentLimit);
    // },
    async chooseDiary(index) {
      this.diaryIndex = index;
      this.positive = "";
      this.negative = "";
      this.note = "";
      this.commentPage = 1;
      if (this.groupType != 3) {
        await this.getDiaryList(
          this.dateArray[index].start,
          this.dateArray[index].end
        );
      }
      this.getDiaryNote(this.dateArray[index].start);
    },
    choosePerson(key, index) {
      this.diaryList = [];
      this.dayCanlendarArray = [];
      this.personArray = [];
      this.diaryKey = key;
      this.personIndex = index;
    },
    async getData(taskArray) {
      this.dateArray = [];
      this.dayCanlendarArray = [];
      let arr = [];

      for (let i = 30; i > 0; i--) {
        arr.push({
          start: this.$moment().subtract(i, "days").startOf("day").valueOf(),
          end: this.$moment().subtract(i, "days").endOf("day").valueOf(),
        });
      }
      taskArray = this._.flatten(taskArray).filter((item, index) => {
        return (
          item.taskEndDate >= arr[0].start &&
          item.taskEndDate < arr[arr.length - 1].end
        );
      });
      taskArray.forEach((taskItem, taskIndex) => {
        if (taskItem.executorKey) {
          this.personObj[taskItem.executorKey] = {
            key: taskItem.executorKey,
            avatar: taskItem.executorAvatar,
            name: taskItem.executorName,
          };
        }
      });
      this.personArray = Object.values(this.personObj);
      let personIndex = this._.findIndex(this.personArray, {
        key: this.diaryKey,
      });
      console.log(this.diaryKey);
      console.log(this.personArray);
      if (personIndex == -1) {
        this.personIndex = 0;
        this.diaryKey = this.personArray[0].key;
      } else {
        this.personIndex = personIndex;
      }
      arr.forEach((item, index) => {
        this.dateArray[index] = {
          arr: [],
          date: this.formatTime(item.start),
          start: item.start,
          end: item.end,
        };
        taskArray.forEach((taskItem, taskIndex) => {
          if (
            taskItem.taskEndDate >= item.start &&
            taskItem.taskEndDate < item.end &&
            this.diaryKey == taskItem.executorKey
          ) {
            this.dateArray[index].arr.push(taskItem);
          }
        });
      });
      // this.dateArray.forEach((item, index) => {});
      this.dateArray = this.dateArray.reverse();
      this.dateArray = this.dateArray.filter((item, index) => {
        return item.arr.length > 0;
      });
      this.dateArray.forEach((item, index) => {
        this.dayCanlendarArray[index] = {};
        item.arr.forEach((taskItem, taskIndex) => {
          if (taskItem.executorKey) {
            if (!this.dayCanlendarArray[index][taskItem.executorKey]) {
              this.dayCanlendarArray[index][taskItem.executorKey] = [];
            }
            this.dayCanlendarArray[index][taskItem.executorKey].push(taskItem);
          }
        });
      });
      console.log("?????????",this.groupType);
      if (this.groupType != 3) {
        await this.getDiaryList(
          this.$moment().subtract(1, "days").startOf("day").valueOf(),
          this.$moment().subtract(1, "days").endOf("day").valueOf()
        );
      }
      this.getDiaryNote(this.$moment().subtract(1, "days").startOf("day").valueOf());
    },
    async getDiaryNote(startTime) {
      let noteRes = await api.task.getNote({
        targetUKey: this.diaryKey,
        startTime: startTime,
        type: 2,
      });
      if (noteRes.msg == "OK") {
        this.positive = noteRes.result.positive;
        this.negative = noteRes.result.negative;
        this.note = noteRes.result.note;
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
    },
    async getDiaryList(startTime, endTime) {
      let res = await api.auth.getDiaryList({
        targetUKey:
          this.groupType == 1 ? this.user._key : this.targetUInfo._key,
        startTime: startTime,
        endTime: endTime,
      });
      if (res.msg == "OK") {
        if (res.result.length > 0) {
          this.contentKey = res.result[0]._key;
        }
      } else {
        this.$message.error(res.msg);
      }
    },
    async getCommentList(page, limit) {
      let res = await api.message.getClockInCommentList({
        clockInKey: this.contentKey,
        curPage: page,
        perPage: limit,
      });
      if (res.msg == "OK") {
        this.commentList.push(...res.result);
        console.log(this.commentList);
        this.commentTotal = res.totalNumber;
      } else {
        this.$message.error(res.msg);
      }
    },
    scrollCommentLoading(e) {
      //文档内容实际高度（包括超出视窗的溢出部分）
      let scrollHeight = e.target.scrollHeight;
      //滚动条滚动距离
      let scrollTop = e.target.scrollTop;
      //窗口可视范围高度
      let clientHeight = e.target.clientHeight;
      if (
        clientHeight + scrollTop >= scrollHeight &&
        this.commentList.length < this.commentTotal
      ) {
        this.commentPage = this.commentPage + 1;
        this.getCommentList(this.commentPage, this.commentLimit);
      }
    },
    onChange(current) {
      this.page = current;
      this.getData(this.page, this.limit);
    },
    async likeDiary(num) {
      let res = await api.task.likeClockIn({
        clockInKey: this.contentItem._key,
        likeNumber: num,
      });
      if (res.msg == "OK") {
        if (num > 0) {
          this.$message.success("点赞成功");
          this.isLike = true;
        } else if (num < 0) {
          this.$message.success("取消点赞");
          this.isLike = false;
        }
      } else {
        this.$message.error(res.msg);
      }
      this.contentItem.likeNumber = this.contentItem.likeNumber + num;
    },
    async addComment() {
      let res = await api.message.addClockInComment({
        clockInKey: this.contentKey,
        content: this.comment,
      });
      if (res.msg == "OK") {
        this.$message.success("评论成功");
        this.comment = "";
        this.commentList.unshift(res.result);
      } else {
        this.$message.error(res.msg);
      }
    },
    deleteComment(item, index) {
      let that = this;
      Modal.confirm({
        title: "提示消息",
        content: "是否确认要删除该评论",
        okText: "确认",
        cancelText: "取消",
        async onOk() {
          let res = await api.message.deleteClockInComment({
            clockInCommentKey: item._key,
          });
          if (res.msg == "OK") {
            that.$message.success("删除成功");
            that.commentList.splice(index, 1);
          } else {
            that.$message.error(res.msg);
          }
        },
      });
    },
    formatTime(time) {
      let week = this.$moment(time).day();
      let timeStr = "";
      switch (week) {
        case 1:
          timeStr = "周一 ";
          break;
        case 2:
          timeStr = "周二 ";
          break;
        case 3:
          timeStr = "周三 ";
          break;
        case 4:
          timeStr = "周四 ";
          break;
        case 5:
          timeStr = "周五 ";
          break;
        case 6:
          timeStr = "周六 ";
          break;
        case 0:
          timeStr = "周日 ";
          break;
      }
      return [timeStr, this.$moment(time).format("M.DD")];
    },
  },
  watch: {
    allTaskArray: {
      handler(newValue) {
        if (this.groupType != 3) {
          this.diaryList = [];
          this.dayCanlendarArray = [];
          this.personArray = [];
          this.diaryKey = this.user._key;
          this.getData(this._.cloneDeep(newValue));
        }
      },
      immediate: true,
      deep: true,
    },
    cardArray: {
      handler(newValue) {
        if (this.groupType == 3) {
          this.diaryList = [];
          this.dayCanlendarArray = [];
          this.personArray = [];
          this.diaryKey = this.user._key;
          this.getData(this._.cloneDeep(newValue));
        }
      },
      immediate: true,
      deep: true,
    },
    diaryKey(newValue, oldValue) {
      if (newValue != oldValue && newValue) {
        this.diaryList = [];
        this.dayCanlendarArray = [];
        this.personArray = [];
        if (this.groupType == 3) {
          this.getData(this._.cloneDeep(this.cardArray));
        } else {
          this.getData(this._.cloneDeep(this.allTaskArray));
        }
      }
    },
    groupType(newValue, oldValue) {
      if (newValue != oldValue && newValue) {
        this.diaryList = [];
        this.dayCanlendarArray = [];
        this.personArray = [];
        this.diaryKey = this.user._key;
        if (newValue == 3) {
          this.getData(this._.cloneDeep(this.cardArray));
        } else {
          this.getData(this._.cloneDeep(this.allTaskArray));
        }
      }
    },
    contentKey(newValue, oldValue) {
      if (newValue != oldValue && newValue) {
        this.commentList = [];
        if (this.groupType != 3) {
          this.getCommentList(this.commentPage, this.commentLimit);
        }
      }
    },
  },
};
</script>

<style lang="scss">
.diary {
  position: relative;
  height: 100%;
  width: 100%;
  color: #333;
}
.diary-list {
  width: 100%;
  height: calc(100% - 40px);
  display: flex;
  flex-wrap: wrap;
  padding: 0.5% 10px;
  box-sizing: border-box;
  overflow: auto;
  align-content: flex-start;
}
.diary-pagination {
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.diary-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0px;
  top: 0px;
  z-index: 2;
  background-color: #f9f9f9;
  overflow: auto;
  display: flex;
}
.diary-content {
  width: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
.diary-item {
  width: 24%;
  height: 90px;
  margin-right: 1%;
  background: #fff;
  color: #333;
  padding: 13px 18px;
  margin-bottom: 20px;
  background-color: rgba(255, 255, 255, 0.95);
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
  border-radius: 5px;
}
.diary-info,
.diary-comment,
.diary-comment-button {
  width: 100%;
  padding: 37px 0px;
  position: relative;
  color: #333;
}
.diary-info-close {
  position: absolute;
  font-size: 25px;
  right: 30px;
  top: 15px;
  z-index: 20;
  color: #333;
}
.diary-title {
  width: 100%;
  height: 50%;
  font-size: 12px;
}
.diary-icon {
  width: 100%;
  height: 50%;
  font-size: 12px;
  font-weight: 400;
  color: rgba(153, 153, 153, 1);
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.diary-icon-clickNumber,
.diary-icon-isLike {
  display: flex;
  align-items: center;
}
.diary-icon-clickNumber img {
  width: 19px;
  height: 13px;
  margin-right: 5px;
}
.diary-icon-isLike img {
  width: 16px;
  height: 16px;
  margin: 0px 5px;
}
.diary-item:hover {
  box-shadow: 2px 3px 5px 0 rgba(0, 0, 0, 0.26);
}
.diary-content-title {
  width: 100%;
  height: 28px;
  font-size: 20px;
  font-weight: 600;
  color: rgba(51, 51, 51, 1);
  line-height: 28px;
  text-align: center;
  margin-bottom: 8px;
}
.diary p,
.diary-content-pn {
  width: calc(100% - 40px);
  font-size: 14px;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  margin-left: 30px;
  padding: 5px 0px 5px 20px;
  box-sizing: border-box;
  background: rgba(249, 249, 249, 1);
  margin-bottom: 0px;
}
.diary-content-pn {
  padding: 0px;
  border: 1px solid rgba(232, 232, 232, 1);
}
.diary-content-tab {
  height: 40px;
  border-bottom: 1px solid rgba(232, 232, 232, 1);
  display: flex;
  line-height: 40px;
}
.diary-content-info {
  min-height: 88px;
  line-height: 88px;
  display: flex;
}
.diary-content-tab > div,
.diary-content-info > div {
  width: 50%;
  border-left: 1px solid rgba(232, 232, 232, 1);
  padding-left: 5px;
  box-sizing: border-box;
}
.diary-content-tab > div:nth-child(1),
.diary-content-info > div:nth-child(1) {
  border-left: 0px;
}
.diary h2 {
  width: 100%;
  height: 22px;
  font-size: 16px;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  line-height: 22px;
  margin: 20px 0px 13px 0px;
}
.diary h3 {
  width: calc(100% - 40px);
  height: 43px;
  font-size: 14px;
  font-weight: 400;
  color: rgba(64, 74, 82, 1);
  line-height: 33px;
  margin-left: 30px;
  padding: 5px 0px 5px 10px;
  box-sizing: border-box;
  background: rgba(249, 249, 249, 1);
  margin-bottom: 0px;
}
.diary-comment-title {
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 400;
  color: rgba(127, 127, 127, 1);
}
.diary-comment-icon {
  width: 50px;
  height: 100%;
  display: flex;
  align-items: center;
}
.diary-comment-icon img {
  width: 16px;
  height: 15px;
  margin-right: 5px;
}
.diary-comment-like {
  width: 150px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-size: 14px;
  font-weight: 400;
  color: rgba(79, 142, 242, 1);
}
.diary-comment-like img {
  width: 16px;
  height: 16px;
  margin: 0px 5px;
  cursor: pointer;
}
.diary-comment-info {
  width: 100%;
  max-height: 610px;
  overflow: auto;
}
.diary-comment-item {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
.diary-comment-item-avatar {
  width: 50px;
  height: 50px;
  overflow: hidden;
  border-radius: 50%;
}
.diary-comment-item-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.diary-comment-item-info {
  flex: 1;
  margin-left: 12px;
}
.diary-comment-item-nickName {
  font-size: 14px;
  font-weight: 400;
  color: rgba(79, 142, 242, 1);
}
.diary-comment-item-content {
  font-size: 14px;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
}

.diary-comment-item-reply {
  width: 60px;
  height: 100%;
  display: flex;
  align-items: flex-start;
  cursor: pointer;
}
.diary-comment-reply-icon {
  width: 18px;
  height: 12px;
  margin-right: 5px;
}
.diary-comment-delete-icon {
  width: 15px;
  height: 16px;
  margin-right: 5px;
}
.diary-comment-reply-icon img,
.diary-comment-delete-icon img {
  width: 100%;
  height: 100%;
}
.diary-comment-reply-title {
  font-size: 14px;
  font-weight: 400;
  color: rgba(79, 142, 242, 1);
}
.diary-comment-button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 37px 20px 37px 0px;
}
.diary-menu {
  width: 20%;
  height: 100%;
  padding: 0px 15px;
  box-sizing: border-box;
}
.diary-menu-title {
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e0e0e0;
}
.diary-menu-item {
  width: 100%;
  height: 30px;
  display: flex;
  align-items: center;
}
.diary-container {
  width: 70%;
  height: 100%;
  overflow: auto;
}
.diary-person {
  position: fixed;
  top: 60px;
  right: 25px;
  z-index: 3;
}
.diary-avatar {
  width: 35px;
  height: 35px;
  overflow: hidden;
  border-radius: 50%;
}
.diary-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>