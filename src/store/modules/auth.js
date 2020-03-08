import api from "../../services/api";
import util from "../../services/util";
import group from "./group";
import moment from "moment";
import { message } from "ant-design-vue";
// initial state
const state = {
  user: null,
  isCode: false,
  registerState: false,
  modifypwdState: false,
  error: false,
  // groupKey:"",
  uptoken: null,
  targetUInfo: null
};

// getters
const getters = {};

// actions
const actions = {
  //登录
  async login({ commit }, params) {
    commit(
      "setUserStatus",
      api.auth.login(params.mobileArea, params.mobile, params.password)
    );
  },
  createMainGroup({ commit }, params) {
    commit("CREATEMAINGROUP", api.auth.createMainGroup(params));
  },

  async getUserByToken({ commit }, params) {
    const promise = await api.auth.getUserFullInfo(params);
    if (promise.statusCode === "701") {
      commit("error", promise);
    } else {
      commit("setUserStatus2", {
        ...promise,
        token: params.token
      });
    }
  },
  // setTargetUserInfo({ commit }) {
  //   commit("SETTARGETUSERINFO", {
  //     ...state.usr.profile,
  //     userId: state.usr._key
  //   });
  // },

  async getUptoken({ commit }) {
    const promise = await api.auth.getUptoken();
    commit("GETUPTOKEN", promise.result);
  },
  setTargetUserInfo({ commit }, targetUInfo) {
    commit("SETTARGETUSERINFO", targetUInfo);
  },
  async getTargetUserInfo({ commit }, params) {
    const promise = await api.auth.getTargetUserInfo(params);
    if (promise.statusCode === "200") {
      commit("GETTARGETUSERINFO", promise.result);
    } else {
      message.error(promise.msg);
    }
  },
  updateUserInfo({ commit }, params) {
    const promise = api.auth.updateUser(
      params.chatAuthToken,
      params.chatUserId,
      params.userInfo
    );
    commit("updateUserStatus", { ...promise, ...params });
  }
};

// mutations
const mutations = {
  error(state, error) {
    state.error = error;
  },
  setUserStatus(state, payload) {
    if (!util.isPromise(payload)) {
      localStorage.setItem("token", payload.token);
      localStorage.setItem("userKey", payload._key);
      state.user = payload;
      console.log("????????",payload.token);
      api.setToken(payload.token);
    }
  },
  setUserStatus2(state, payload) {
    localStorage.setItem("token", payload.result.token);
    localStorage.setItem("userKey", payload.result._key);
    console.log("!!!!!!!!!!!!!!!!!",payload.result.token);
    api.setToken(payload.result.token);
    state.user = payload.result;
  },
  /**
   * 更新用户信息
   * @param {Object} state
   * @param {Object} payload
   */
  updateUserStatus(state, payload) {
    if (!util.isPromise(payload)) {
      message.success("修改成功");
      state.user.profile = { ...state.user.profile, ...payload.userInfo };
      state.user.rocketChat = {
        ...state.user.rocketChat,
        ...{
          name: payload.userInfo.trueName,
          username: payload.userInfo.nickName
        }
      };
    }
  },
  CREATEMAINGROUP(state, payload) {
    if (!util.isPromise(payload)) {
      localStorage.setItem("mainGroupKey", payload.result.mainGroupKey);
      if (localStorage.getItem("groupKey")) {
        group.state.groupKey = localStorage.getItem("groupKey");
      } else if (!group.state.groupKey) {
        group.state.groupKey = localStorage.getItem("mainGroupKey");
        localStorage.setItem("groupKey", payload.result.mainGroupKey);
      }
      if (payload.result.isFirstCreate) {
        localStorage.setItem("isFirstCreate", "1");
        state.common.bootPageState = true;
      }
      // state.groupKey = payload.result;
    }
  },
  GETUPTOKEN(state, uptoken) {
    localStorage.setItem("uptoken", uptoken);
    state.uptoken = uptoken;
  },
  SETTARGETUSERINFO(state, targetUInfo) {
    state.targetUInfo = JSON.parse(JSON.stringify(targetUInfo));
  },
  GETTARGETUSERINFO(state, payload) {
    state.targetUInfo = payload;
    state.targetUInfo.nickName=state.user.profile.nickName;
    state.targetUInfo.avatar=state.user.profile.avatar;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
