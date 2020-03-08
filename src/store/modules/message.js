import api from "../../services/api";
import util from "../../services/util";
import { message } from "ant-design-vue";
// initial state
const state = {
  messageList: [],
  messageTotal: 0
};

// getters
const getters = {};

// actions
const actions = {
  //子组件状态
  //  getSearchList({ commit }, linkState) {
  //     commit('GETSEARCHLIST', linkState);
  // },
  //创建卡片
  async getMessageList({ commit }, params) {
    const promise = await api.message.getMessageList(params);
    if (promise.statusCode === "200") {
      commit("GETMESSAGELIST", promise);
    } else {
      message.error(promise.msg);
    }
  },
  async readMessage({ commit }, params) {
    const promise = await api.message.readMessage({
      msgKey: params[0]
    });
    if (promise.statusCode === "200") {
      commit("READMESSAGE", params[1]);
    }
  },
  async delMessage({ commit }, params) {
    const promise = await api.message.delMessage({
      messageKey: params[0]
    });
    if (promise.statusCode === "200") {
      commit("DELMESSAGE", params[1]);
    }
  },
  setMessageList({ commit }, messageList) {
    commit("SETMESSAGELIST", messageList);
  }
};

// mutations
const mutations = {
  GETMESSAGELIST(state, payload) {
    state.messageList.push(...payload.result);
    state.messageTotal = payload.totalNumber;
  },
  SETMESSAGELIST(state, messageList) {
    state.messageList = messageList;
  },
  READMESSAGE(state, messageIndex) {
    if (messageIndex === null) {
      state.messageList = [];
    } else {
      state.messageList.splice(messageIndex, 1);
    }
    state.messageTotal = 0;
  },
  DELMESSAGE(state, messageIndex) {
    state.messageList.splice(messageIndex, 1);
    message.success("删除成功");
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
