import api from '../../services/api';
import util from '../../services/util';
import task from './task';
import { message } from 'ant-design-vue';
// initial state
const state = {
  countDownTaskList: [],
  countDownTeamList: [],
  countDownKey: 0,
  countDownDetail: {},
  countDownList: [],
};

// getters
const getters = {};

// actions
const actions = {
  getCountDownList({ commit }, params) {
    commit('GETCOUNTDOWNLIST', api.task.getTaskList(params));
  },
  //创建卡片
  setCountDownKey({ commit }, countDownKey) {
    commit('SETCOUNTDOWNKEY', countDownKey);
  },
  async getCountDownDetail({ commit }, params) {
    const promise = await api.card.getCardDetail(params);
    if (promise.statusCode === '200') {
      commit('GETCOUNTDOWNDETAIL', promise.result);
    } else {
      message.error(promise.msg);
    }
  },
  async getCountDownTask({ commit }, params) {
    const promise = await api.task.getCountDownTask(params);
    if (promise.statusCode === '200') {
      commit('GETCOUNTDOWNTASK', promise.result);
    } else {
      message.error(promise.msg);
    }
  },
  async getTeamCareTask({ commit }, params) {
    commit('GETTEAMCARETASK', api.task.getTeamCareTask(params));
    // const promise = await api.task.getTeamCareTask(params);
    // if (promise.statusCode === '200') {
    //   commit('GETTEAMCARETASK', promise.result);
    // } else {
    //   message.error(promise.msg);
    // }
  },
  async getProjectCareTask({ commit }, params) {
    const promise = await api.task.getProjectCareTask(params);
    if (promise.statusCode === '200') {
      commit('GETPROJECTCARETASK', promise.result);
    } else {
      message.error(promise.msg);
    }
  },
};

// mutations
const mutations = {
  SETCOUNTDOWNKEY(state, countDownKey) {
    state.countDownKey = countDownKey;
  },
  GETCOUNTDOWNDETAIL(state, countDownDetail) {
    state.countDownDetail = countDownDetail;
  },
  GETCOUNTDOWNTASK(state, countDownTaskList) {
    state.countDownTaskList = countDownTaskList;
  },
  GETCOUNTDOWNLIST(state, payload) {
    if (!util.isPromise(payload)) {
      state.countDownList = payload.result.cardArray;
    }
  },
  GETTEAMCARETASK(state, payload) {
    if (!util.isPromise(payload)) {
      state.countDownTeamList = payload.result;
    }
  },
  GETPROJECTCARETASK(state, payload) {
    task.state.countDownGroupArray = payload.groupArray;
    task.state.countDownTaskArray = payload.cardArray;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
