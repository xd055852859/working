import api from "../../services/api";
import util from "../../services/util";
import { message } from "ant-design-vue";
import group from "./group";
// initial state
const state = {};

// getters
const getters = {};

// actions
const actions = {
  //子组件状态
  //  getSearchList({ commit }, linkState) {
  //     commit('GETSEARCHLIST', linkState);
  // },
  //创建卡片
  setRole({ commit }, params) {
    commit("SETROLE", api.role.setRole(params));
  }
};

// mutations
const mutations = {
  SETROLE(state, payload) {
    if (!util.isPromise(payload)) {
      group.state.groupMemberList = group.state.groupMemberList.map(
        (item, index) => {
          if (item.userId === payload.result.userId) {
            item.role = payload.result.role;
          }
          return item;
        }
      );
      message.success("修改权限成功");
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
