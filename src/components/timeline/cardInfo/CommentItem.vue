<template>
  <a-row class="comment-item">
    <a-col :span="5">
      <div class="comment-img">
        <img :src="commentItem?commentItem.etc.avatar:''" alt />
      </div>
    </a-col>
    <a-col :span="19">
      <div class="comment-title">
        <div class="comment-name">
          {{commentItem?commentItem.etc.name:''}}
          <div class="comment-time">{{commentItem?commentItem.newTime:''}}</div>
        </div>
        <div
          class="comment-reply"
          @click="changeCommentInput(commentTargetIndex)"
          v-if="commentItem.userKey!=this.user._key&&replyState"
        >回复</div>
        <div
          class="comment-reply"
          @click="deleteComment({deleteIndex:commentTargetIndex,param:{cardCommentKey:commentItem._key}})"
          v-if="commentItem.userKey==this.user._key&&replyState"
        >删除</div>
      </div>
      <div class="comment-msg">{{commentItem?commentItem.content:''}}</div>
    </a-col>
  </a-row>
</template>

<script>
import Vue from "vue";
import { mapState, mapActions } from "vuex";
import { Row, Col, Badge } from "ant-design-vue";
export default {
  name: "CommentItem",
  props: ["commentItem", "commentTargetIndex", "replyState"],
  mounted() {},
  computed: mapState({
    user: state => state.auth.user,
    replyIndex: state => state.comment.replyIndex,
    commentList: state => state.comment.commentList
  }),
  methods: {
    ...mapActions("comment", ["deleteComment"]),
    changeCommentInput(index) {
      this.$emit("changeCommentReply", index);
    }
  }
};
</script>

<style scoped>
.comment-item {
  height: 40px;
  width: 100%;
  padding: 0px 5%;
  box-sizing: border-box;
}
/* .comment-item:first-child {
  margin-top: 17px;
} */
/* .comment-item:last-child {
  margin-bottom: 0px;
} */
.comment-item .comment-img {
  width: 40px;
  height: 40px;
  overflow: hidden;
}
.comment-item .comment-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.comment-item .comment-title {
  width: 100%;
  font-size: 14px;
  color: #23384b;
  display: flex;
  justify-content: space-between;
}
.comment-item .comment-name {
  width: 60%;
  display: flex;
  align-items: center;
}
.comment-item .comment-reply {
  font-size: 13px;
  color: #1aca8e;
  cursor: pointer;
}
.comment-item .comment-msg {
  font-size: 13px;
  color: #8091a0;
}
.comment-item .comment-time {
  font-size: 12px;
  color: #8091a0;
  margin-left: 7px;
}
</style>