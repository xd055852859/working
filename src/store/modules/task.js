import api from "../../services/api";
import util from "../../services/util";
import group from "./group";
import { message } from "ant-design-vue";
// initial state
const state = {
  taskList: null,
  cardArray: [],
  labelArray: [],
  labelKey: 0,
  taskAllListOrder: [],
  defaultExecutor: "",
  finishPercentArray: "[0,1]",
  taskAllObj: {}
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
  getTaskList({ commit }, params) {
    commit("GETTASKLIST", api.task.getTaskList(params));
  },
  async createTaskLabel({ commit }, params) {
    const promise = await api.task.createTaskLabel(params);
    if (promise.statusCode === "200") {
      commit("CREATETASKLABEL", promise);
    } else {
      message.error(promise.msg);
    }
  },
  async changeTaskLabel({ commit }, params) {
    const promise = await api.task.changeTaskLabel(params);
    if (promise.statusCode === "200") {
      commit("CHANGETASKLABEL", promise);
    } else {
      message.error(promise.msg);
    }
  },
  setLabelKey({ commit }, labelKey) {
    commit("SETLABELKEY", labelKey);
  },
  async deleteCardLabel({ commit }, params) {
    console.log(params);
    const promise = await api.task.deleteCardLabel(params);
    if (promise.statusCode === "200") {
      commit("DELETECARDLABEL", {
        promise: promise,
        labelKey: params.cardLabelKey
      });
    } else {
      message.error(promise.msg);
    }
  },
  async setCardLabel({ commit }, params) {
    const promise = await api.task.setCardLabel(params);
    if (promise.statusCode === "200") {
      commit("SETCARDLABEL", promise);
    } else {
      message.error(promise.msg);
    }
  },
  async batchCard({ commit }, params) {
    const promise = await api.task.batchCard(params);
    if (promise.statusCode === "200") {
      commit("BATCHCARD", promise);
    } else {
      message.error(promise.msg);
    }
  },
  async batchCardArray({ commit }, params) {
    const promise = await api.task.batchCardArray(params);
    if (promise.statusCode === "200") {
      commit("BATCHCARDARRAY", promise);
    } else {
      message.error(promise.msg);
    }
  },
  async setLabelCardOrder({ commit }, params) {
    const promise = await api.task.setLabelCardOrder(params);
    if (promise.statusCode === "200") {
      commit(
        "GETTASKLIST",
        api.task.getTaskList({
          typeBoard1: group.state.groupType,
          targetUGKey: group.state.groupKey,
          finishPercentArray: "[0, 1]"
        })
      );
      // commit("SETLABELCARDORDER", promise);
    } else {
      message.error(promise.msg);
    }
  },
  async chooseDefaultExecutor({ commit }, params) {
    const promise = await api.task.setLabelOrGroupExecutorKey(params.param);
    if (promise.statusCode === "200") {
      commit("CHOOSEDEFAULTEXECUTOR", { result: params.item });
      // commit("SETLABELCARDORDER", promise);
    } else {
      message.error(promise.msg);
    }
  },
  setFinishPercentArray({ commit }, finishPercentArray) {
    commit("SETFINISHPERCENTARRAY", finishPercentArray);
  }
};

// mutations
const mutations = {
  GETTASKLIST(state, payload) {
    if (!util.isPromise(payload)) {
      state.labelArray = [];
      state.cardArray = [];
      state.taskList = payload.result;
      state.cardArray = payload.result.cardArray;
      payload.result.labelArray.forEach((item, index) => {
        if (item._key) {
          state.labelArray.push(item);
        } else {
          state.taskAllObj = item;
          if (group.state.groupType == 3) {
            state.taskAllListOrder = item.cardOrder;
          }
        }
      });
    }
  },
  CREATETASKLABEL(state, payload) {
    console.log(payload.result);
    state.labelArray.push(payload.result);
  },
  CHANGETASKLABEL(state, payload) {
    console.log(payload);
  },
  SETLABELKEY(state, labelKey) {
    state.labelKey = labelKey;
  },
  DELETECARDLABEL(state, payload) {
    let labelIndex = 0;
    state.labelArray.forEach((item, index) => {
      if (item._key == payload.labelKey) {
        console.log("index", index);
        labelIndex = index;
      }
    });
    state.labelArray.splice(labelIndex, 1);
  },
  SETCARDLABEL(state, payload) {
    // let labelIndex = 0;
    // state.labelArray.forEach((item, index) => {
    //   if (item._key == payload.labelKey) {
    //     console.log("index", index), (labelIndex = index);
    //   }
    // });
    // state.labelArray.splice(labelIndex, 1);
    console.log(payload);
  },
  BATCHCARD(state, payload) {
    let cardKeyArr = payload.result;
    cardKeyArr.forEach((item, index) => {
      state.cardArray.unshift(item);
    });
  },
  BATCHCARDARRAY(state, payload) {
    let cardKeyArr = payload.result;
    let arr = [];
    state.cardArray.forEach((item, index) => {
      for (let i = cardKeyArr.length - 1; i >= 0; i--) {
        if (item._key == cardKeyArr[i]) {
          state.cardArray.splice(i, 1);
        }
      }
    });
  },
  CHOOSEDEFAULTEXECUTOR(state, payload) {
    console.log(payload.result);
    if (payload.result.type == 1) {
      state.labelArray.forEach(item => {
        if (item._key == payload.result.labelOrGroupKey) {
          item.executorKey = payload.result.executorKey;
          item.executorAvatar = payload.result.executorAvatar;
          item.executorAvatar = payload.result.executorAvatar;
        }
      });
    } else if (payload.result.type == 2) {
      state.taskAllObj.executorKey = payload.result.executorKey;
      state.taskAllObj.executorAvatar = payload.result.executorAvatar;
      state.taskAllObj.executorAvatar = payload.result.executorAvatar;
    }
  },
  SETLABELCARDORDER(state, payload) {
    console.log(payload);
    //   if (!payload.result.labelObject2) {
    //     payload.result.labelObject2 = payload.result.labelObject1;
    //   }
    //   if (
    //     payload.result.labelObject1.labelKey == null ||
    //     payload.result.labelObject1.labelKey == ""
    //   ) {
    //     state.taskAllListOrder = payload.result.labelObject1.cardOrder;
    //   } else if (
    //     payload.result.labelObject2.labelKey == null ||
    //     payload.result.labelObject2.labelKey == ""
    //   ) {
    //     state.taskAllListOrder = payload.result.labelObject2.cardOrder;
    //   } else {
    //     state.labelArray.forEach((item, index) => {
    //       if (item._key == payload.result.labelObject1.labelKey) {
    //         item.cardOrder = payload.result.labelObject1.cardOrder;
    //       } else if (item._key == payload.result.labelObject2.labelKey) {
    //         item.cardOrder = payload.result.labelObject2.cardOrder;
    //       }
    //     });
    //   }
    //   console.log("labelArray xxxxxxxxxxxxx",state.labelArray);
  },
  SETFINISHPERCENTARRAY(state, finishPercentArray) {
    state.finishPercentArray = finishPercentArray;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
