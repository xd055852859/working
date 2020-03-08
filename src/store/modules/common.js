// initial state
const state = {
  error: false,
  // 全局loading
  loading: false,
  // 局部loading
  waiting: false,
  showState: false,
  fullState: 0,
  bootPageState: false,
  headerIndex: 0,
  chatMessage: "",
  deviceState: "",
  deviceWidth: 0
};

// getters
const getters = {};

// actions
const actions = {
  error({ commit }, msg) {
    commit("error", msg);
  },
  setLoading({ commit }, isLoading) {
    commit("setLoading", isLoading);
  },
  clearError({ commit }) {
    commit("error", null);
  },
  changeShowState({ commit }, showState) {
    commit("CHANGESHOWSTATE", showState);
  },
  setFullState({ commit }, fullState) {
    commit("SETFULLSTATE", fullState);
  },
  changeBootPageState({ commit }, bootPageState) {
    commit("CHANGEBOOTPAGESTATE", bootPageState);
  },
  changeHeaderIndex({ commit }, headerIndex) {
    commit("CHANGEHEADERINDEX", headerIndex);
  },
  async setChatMessage({ commit }, params) {
    const promise = await api.message.postMessage(params);
    if (promise.statusCode === "200") {
      commit("SETCHATMESSAGE", promise.result);
    } else {
      message.error(promise.msg);
    }
  },
  //修改屏幕宽度
  changeDeviceState({ commit }, deviceState) {
    commit("CHANGEDEVICESTATE", deviceState);
  },
  changeDeviceWidth({ commit }, deviceWidth) {
    commit("CHANGEDEVICEWIDTH", deviceWidth);
  }
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
  CHANGESHOWSTATE(state, showState) {
    state.showState = showState;
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
  SETCHATMESSAGE(state, chatMessage) {
    state.chatMessage = chatMessage;
  },
  CHANGEDEVICESTATE(state, deviceState) {
    state.deviceState = deviceState;
  },
  CHANGEDEVICEWIDTH(state, deviceWidth) {
    state.deviceWidth = deviceWidth;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
