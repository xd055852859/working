import api from '../../services/api';
import util from '../../services/util';
import group from './group';
import moment from 'moment';
import { message } from 'ant-design-vue';
// initial state
const state = {
  user: null,
  error: false,
  uptoken: null,
  targetUInfo: null,
  theme: { backgroundColor: '#46558C', fontColor: '#fff', backgroundImg: '' },
  countDownData: {},
};

// getters
const getters = {};

// actions
const actions = {
  createMainGroup({ commit }, params) {
    commit('CREATEMAINGROUP', api.auth.createMainGroup(params));
  },

  async getUserByToken({ commit }, params) {
    const promise = await api.auth.getUserFullInfo(params);
    if (promise.statusCode === '701') {
      commit('error', promise);
    } else {
      commit('setUserStatus2', {
        ...promise,
        token: params.token,
      });
    }
  },

  async getUptoken({ commit }) {
    const promise = await api.auth.getUptoken();
    commit('GETUPTOKEN', promise.result);
  },
  setTargetUserInfo({ commit }, targetUInfo) {
    commit('SETTARGETUSERINFO', targetUInfo);
  },
  async getTargetUserInfo({ commit }, params) {
    const promise = await api.auth.getTargetUserInfo(params);
    if (promise.statusCode === '200') {
      commit('GETTARGETUSERINFO', promise.result);
    } else {
      message.error(promise.msg);
    }
  },
  async updateUserInfo({ commit }, params) {
    const promise = await api.auth.updateUser(
      params.chatAuthToken,
      params.chatUserId,
      params.userInfo
    );
    commit('updateUserStatus', { ...promise, ...params });
  },
  async updateAccount({ commit }, params) {
    const promise = await api.auth.updateAccount(params);
    if (promise.statusCode === '200') {
      commit('UPDATEACCOUNT', params);
    } else {
      message.error(promise.msg);
    }
  },
  async getTheme({ commit }) {
    const promise = await api.auth.getWorkingConfigInfo();
    if (promise.statusCode === '200') {
      commit('GETTHEME', promise.result);
    } else {
      message.error(promise.msg);
    }
  },
  async setTheme({ commit }, params) {
    const promise = await api.auth.setWorkingConfigInfo(params);
    if (promise.statusCode === '200') {
      commit('SETTHEME', promise.result);
    } else {
      message.error(promise.msg);
    }
  },
  async getCountDownData({ commit }) {
    const promise = await api.auth.getCountDownData();
    if (promise.statusCode === '200') {
      commit('GETCOUNTDOWNDATA', promise.result);
    } else {
      message.error(promise.msg);
    }
  },
  async setCountDownData({ commit }, params) {
    const promise = await api.auth.setCountDownData(params);
    if (promise.statusCode === '200') {
      commit('SETCOUNTDOWNDATA', promise.result);
    } else {
      message.error(promise.msg);
    }
  },
  // 更新登录的rocketchat token
  async updateAuthToken({ commit }) {
    let data = await api.auth.loginRocket(
      state.user.rocketChat.username,
      state.user.mobile
    );
    if (data.status == 'success') {
      commit('updateAuthToken', { authToken: data.data.authToken });
    } else {
      message.error(promise.msg);
    }
  },
};

// mutations
const mutations = {
  error(state, error) {
    state.error = error;
  },
  setUserStatus(state, payload) {
    if (!util.isPromise(payload)) {
      localStorage.setItem('token', payload.token);
      if (!localStorage.getItem('userKey')) {
        localStorage.setItem('userKey', payload._key);
      }
      state.user = payload;
      api.setToken(payload.token);
    }
  },
  setUserStatus2(state, payload) {
    localStorage.setItem('token', payload.result.token);
    if (!localStorage.getItem('userKey')) {
      localStorage.setItem('userKey', payload.result._key);
    }
    api.setToken(payload.result.token);
    state.user = payload.result;
  },
  /**
   * 更新用户信息
   * @param {Object} state
   * @param {Object} payload
   */
  updateAuthToken(state, payload) {
    state.user.rocketChat.authToken = payload.authToken;
  },
  updateUserStatus(state, payload) {
    if (!util.isPromise(payload)) {
      message.success('修改成功');
      state.user.profile = { ...state.user.profile, ...payload.userInfo };
      state.user.rocketChat = {
        ...state.user.rocketChat,
        ...{
          name: payload.userInfo.trueName,
          username: payload.userInfo.nickName,
        },
      };
    }
  },
  CREATEMAINGROUP(state, payload) {
    if (!util.isPromise(payload)) {
      localStorage.setItem('mainGroupKey', payload.result.mainGroupKey);
      if (localStorage.getItem('groupKey')) {
        group.state.groupKey = localStorage.getItem('groupKey');
      } else if (!group.state.groupKey) {
        group.state.groupKey = localStorage.getItem('mainGroupKey');
        localStorage.setItem('groupKey', payload.result.mainGroupKey);
      }
      if (payload.result.isFirstCreate) {
        localStorage.setItem('isFirstCreate', '1');
        state.common.bootPageState = true;
      }
      // state.groupKey = payload.result;
    }
  },
  GETUPTOKEN(state, uptoken) {
    localStorage.setItem('uptoken', uptoken);
    state.uptoken = uptoken;
  },
  SETTARGETUSERINFO(state, targetUInfo) {
    state.targetUInfo = JSON.parse(JSON.stringify(targetUInfo));
  },
  GETTARGETUSERINFO(state, payload) {
    state.targetUInfo = payload;
    state.targetUInfo.nickName = payload.profile.nickName;
    state.targetUInfo.avatar = payload.profile.avatar;
    state.targetUInfo.userId = payload._key;
  },
  UPDATEACCOUNT(state, payload) {
    for (let key in payload.profile) {
      state.user.profile[key] = payload.profile[key];
    }
    message.success('修改个人信息成功');
  },
  GETTHEME(state, theme) {
    if (theme) {
      state.theme = JSON.parse(JSON.stringify(theme));
    }
  },
  SETTHEME(state, theme) {
    // state.theme = JSON.parse(JSON.stringify(theme));
  },
  GETCOUNTDOWNDATA(state, countDownData) {
    state.countDownData = JSON.parse(JSON.stringify(countDownData));
  },
  SETCOUNTDOWNDATA(state, countDownData) {
    state.countDownData = JSON.parse(JSON.stringify(countDownData));
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
