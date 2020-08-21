// initial state
import moment from 'moment';
import api from '../../services/api';
const state = {
  error: false,
  // 全局loading
  loading: false,
  // 局部loading
  waiting: false,
  fullState: 0,
  bootPageState: false,
  headerIndex: localStorage.getItem('groupType') == 3 ? 7 : 10,
  deviceState: '',
  deviceWidth: 0,
  nowTime: 0,
  ideaTitle: '',
  ideaList: [],
};

// getters
const getters = {};

// actions
const actions = {
  error({ commit }, msg) {
    commit('error', msg);
  },
  setLoading({ commit }, isLoading) {
    commit('setLoading', isLoading);
  },
  clearError({ commit }) {
    commit('error', null);
  },
  setFullState({ commit }, fullState) {
    commit('SETFULLSTATE', fullState);
  },
  changeBootPageState({ commit }, bootPageState) {
    commit('CHANGEBOOTPAGESTATE', bootPageState);
  },
  changeHeaderIndex({ commit }, headerIndex) {
    commit('CHANGEHEADERINDEX', headerIndex);
  },
  //修改屏幕宽度
  changeDeviceState({ commit }, deviceState) {
    commit('CHANGEDEVICESTATE', deviceState);
  },
  changeDeviceWidth({ commit }, deviceWidth) {
    commit('CHANGEDEVICEWIDTH', deviceWidth);
  },
  setTime({ commit }, nowTime) {
    commit('setTime', nowTime);
  },
  async addIdea({ commit }, params) {
    const promise = await api.auth.addIdea(params);
    if (promise.statusCode === '200') {
      commit('addIdea', promise.result);
    } else {
      message.error(promise.msg);
    }
  },
  async getIdeaList({ commit }, params) {
    const promise = await api.auth.getIdeaList(params);
    if (promise.statusCode === '200') {
      commit('getIdeaList', promise.result);
    } else {
      message.error(promise.msg);
    }
  },
  setIdeaTitle({ commit }, ideaTitle) {
    commit('setIdeaTitle', ideaTitle);
  },
};

// mutations
const mutations = {
  error(state, error) {
    state.error = error;
  },
  setLoading(state, isLoading) {
    state.loading = isLoading;
    state.waiting = isLoading;
  },
  SETFULLSTATE(state, fullState) {
    state.fullState = fullState;
  },
  CHANGEBOOTPAGESTATE(state, bootPageState) {
    state.bootPageState = bootPageState;
  },
  CHANGEHEADERINDEX(state, headerIndex) {
    state.headerIndex = headerIndex;
  },
  CHANGEDEVICESTATE(state, deviceState) {
    state.deviceState = deviceState;
  },
  CHANGEDEVICEWIDTH(state, deviceWidth) {
    state.deviceWidth = deviceWidth;
  },
  setTime(state, nowTime) {
    state.nowTime = moment(nowTime).hour() < 12 ? 0 : 1;
  },
  getIdeaList(state, ideaList) {
    state.ideaList = ideaList;
  },
  addIdea(state, ideaItem) {},
  setIdeaTitle(state, ideaTitle) {
    state.ideaTitle = ideaTitle;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
