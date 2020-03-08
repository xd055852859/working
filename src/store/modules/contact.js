import api from "../../services/api";
import util from "../../services/util";
// initial state
const state = {
  // 联系人列表
  contactList: [],
  // 当前选中的联系人
  contack: null,
  // 群组列表
  groupList: [],
  // 当前选中的群组
  group: null
};

// getters
const getters = {};

// actions
const actions = {
  getContacks({ commit }) {
    commit("setContactListStatus", api.contact.getContacts());
  },
  getGroups({ commit }) {
    commit("setGroupListStatus", api.contact.getGroups());
  }
};

// mutations
const mutations = {
  setContactListStatus(state, payload) {
    if (!util.isPromise(payload)) {
      state.contactList = payload.result;
    }
  },
  setGroupListStatus(state, payload) {
    if (!util.isPromise(payload)) {
      state.groupList = payload.result;
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
