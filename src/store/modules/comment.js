import api from "../../services/api";
import util from "../../services/util";
import { message } from "ant-design-vue";
// initial state
const state = {
  commentList: [],
  cardCommentTotal: 0,
  cardHistoryTotal: 0
};

// getters
const getters = {};

// actions
const actions = {
  async getCommentList({ commit }, params) {
    const promise = await api.card.getCommentList(params);
    if (promise.statusCode === "200") {
      commit("GETCOMMENTLIST", promise);
    } else {
      message.error(promise.msg);
    }
  },
  saveComment({ commit }, params) {
    commit("SAVECOMMENT", api.card.saveComment(params));
  },
  async deleteComment({ commit }, params) {
    const promise = await api.card.deleteComment(params.param);
    if (promise.statusCode === "200") {
      commit("DELETECOMMENT", {
        promise: promise,
        deleteIndex: params.deleteIndex
      });
    } else {
      message.error(promise.msg);
    }
  },
  replyComment({ commit }, params) {
    commit("REPLYCOMMENT", api.card.saveComment(params));
  }
};

// mutations
const mutations = {
  GETCOMMENTLIST(state, payload) {
    state.commentList = payload.result;
    state.cardHistoryTotal = payload.historyTotalNumber;
    state.cardCommentTotal = payload.totalNumber;
  },
  SAVECOMMENT(state, payload) {
    if (!util.isPromise(payload)) {
      // message.success("留言成功");
      state.commentList.push(payload.result);
      state.cardCommentTotal = state.cardCommentTotal + 1;
      state.cardHistoryTotal = state.cardHistoryTotal + 1;
    }
  },
  DELETECOMMENT(state, payload) {
    if (!util.isPromise(payload.promise)) {
      // message.success("删除留言成功");
      state.commentList.splice(payload.deleteIndex, 1);
      state.cardCommentTotal = state.cardCommentTotal - 1;
    }
  },
  REPLYCOMMENT(state, payload) {
    if (!util.isPromise(payload)) {
      message.success("回复留言成功");
      let arr = JSON.parse(JSON.stringify(state.commentList));
      state.commentList = arr.map((item, index) => {
        if (item._key == payload.result.replyRecordKey) {
          item.replyRecordKey = payload.result.replyRecordKey;
          item.replyetc = payload.result.etc;
          item.replyContent = payload.result.content;
        }
        return item;
      });
    }
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
