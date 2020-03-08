import api from "../../services/api";
import util from "../../services/util";
import group from "./group";
import { message } from "ant-design-vue";
// initial state
const state = {
  // searchObj: {
  //   groupList: [],
  //   userList: []
  // },
  searchMemberList: [],
  searchGroupList:[],
  searchCardList: [],
  searchCardTotal: 0
};

// getters
const getters = {};

// actions
const actions = {
  //子组件状态
  //  getSearchList({ commit }, linkState) {
  //     commit('GETSEARCHLIST', linkState);
  // },
  //人员搜索卡片
  async getSearchList({ commit }, params) {
    const promise = await api.search.getSearchList(params.param);
    if (promise.statusCode === "200") {
      commit("GETSEARCHLIST", { promise: promise, type: params.type });
    } else {
      message.error(promise.msg);
    }
    // commit("GETCARDLIST", api.card.getCardList(params));
  },
  //卡片搜索
  getCardSearch({ commit }, params) {
    commit("GETCARDSEARCH", api.search.getCardSearch(params));
  },
  // //清空搜索内容
  clearSearchList({ commit }) {
    commit("CLEARSEARCHLIST");
  },
  setCardSearch({ commit }, searchCardList) {
    commit("SETCARDSEARCH", searchCardList);
  }
};

// mutations
const mutations = {
  GETSEARCHLIST(state, payload) {
    if (!util.isPromise(payload.promise)) {
      if (payload.type == 1) {
        state.searchMemberList = JSON.parse(
          JSON.stringify(payload.promise.result)
        );
      } else {
        state.searchGroupList = JSON.parse(
          JSON.stringify(payload.promise.result)
        );
      }
    }
  },
  CLEARSEARCHLIST(state) {
    // state.searchObj = JSON.parse(JSON.stringify(obj));
    state.searchMemberList = [];
    state.searchGroupList = [];
  },
  GETCARDSEARCH(state, payload) {
    if (!util.isPromise(payload)) {
      state.searchCardList.push(...payload.result);
      state.searchCardTotal = payload.totalNumber;
    }
  },
  SETCARDSEARCH(state, searchCardList) {
    state.searchCardList = searchCardList;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
