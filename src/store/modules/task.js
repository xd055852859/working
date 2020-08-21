import api from '../../services/api';
import util from '../../services/util';
import group from './group';
import { message } from 'ant-design-vue';
import _ from 'lodash';
// initial state
const state = {
  cardArray: [],
  taskTitle: '',
  labelArray: [],
  labelKey: 0,
  defaultExecutor: '',
  finishPercentArray: '[0,1,2,10]',
  taskDataType: 0,
  eyeState: false,
  taskType: 0,
  allGroupArray: [],
  allTaskArray: [],
  allMainGroupArray: null,
  allMainTaskArray: null,
  allGridGroupArray: [],
  allGridTaskArray: [],
  allGridChildArray: null,
  countDownGroupArray: [],
  countDownTaskArray: [],
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
    commit('GETTASKLIST', api.task.getTaskList(params));
  },
  async createTaskLabel({ commit }, params) {
    const promise = await api.task.createTaskLabel(params);
    if (promise.statusCode === '200') {
      commit('CREATETASKLABEL', promise);
    } else {
      message.error(promise.msg);
    }
  },
  async changeTaskLabel({ commit }, params) {
    const promise = await api.task.changeTaskLabel(params);
    if (promise.statusCode === '200') {
      commit('CHANGETASKLABEL', promise);
    } else {
      message.error(promise.msg);
    }
  },
  setLabelKey({ commit }, labelKey) {
    commit('SETLABELKEY', labelKey);
  },
  async deleteCardLabel({ commit }, params) {
    const promise = await api.task.deleteCardLabel(params);
    if (promise.statusCode === '200') {
      commit('DELETECARDLABEL', {
        promise: promise,
        labelKey: params.cardLabelKey,
      });
    } else {
      message.error(promise.msg);
    }
  },
  async setCardLabel({ commit }, params) {
    const promise = await api.task.setCardLabel(params);
    if (promise.statusCode === '200') {
      commit('SETCARDLABEL', params);
    } else {
      message.error(promise.msg);
    }
  },
  async batchCard({ commit }, params) {
    const promise = await api.task.batchCard(params);
    if (promise.statusCode === '200') {
      commit('BATCHCARD', promise);
    } else {
      message.error(promise.msg);
    }
  },
  async batchCardArray({ commit }, params) {
    const promise = await api.task.batchCardArray(params);
    if (promise.statusCode === '200') {
      commit('BATCHCARDARRAY', promise);
    } else {
      message.error(promise.msg);
    }
  },
  async setLabelCardOrder({ commit }, params) {
    const promise = await api.task.setLabelCardOrder(params);
    if (promise.statusCode === '200') {
      commit(
        'GETTASKLIST',
        api.task.getTaskList({
          typeBoard1: group.state.groupType,
          targetUGKey: group.state.groupKey,
          finishPercentArray: '[0, 1,2,10]',
        })
      );
      // commit("SETLABELCARDORDER", promise);
    } else {
      message.error(promise.msg);
    }
  },
  async chooseDefaultExecutor({ commit }, params) {
    const promise = await api.task.setLabelOrGroupExecutorKey(params.param);
    if (promise.statusCode === '200') {
      commit('CHOOSEDEFAULTEXECUTOR', {
        result: params.item,
      });
      // commit("SETLABELCARDORDER", promise);
    } else {
      message.error(promise.msg);
    }
  },
  setFinishPercentArray({ commit }, finishPercentArray) {
    commit('SETFINISHPERCENTARRAY', finishPercentArray);
  },
  // changeLabelIndex({ commit }, labelObj) {
  //   console.log("labelObj", labelObj);
  //   commit("CHANGELABELINDEX", labelObj);
  // },
  async setGroupLabelOrder({ commit }, params) {
    const promise = await api.task.setGroupLabelOrder(params.param);
    if (promise.statusCode === '200') {
      commit('SETGROUPLABELORDER', params.labelIndexArr);
      // commit("SETLABELCARDORDER", promise);
    } else {
      message.error(promise.msg);
    }
  },
  setTaskDataType({ commit }, taskDataType) {
    commit('SETTASKDATATYPE', taskDataType);
  },
  changeEyeState({ commit }, eyeState) {
    commit('CHANGEEYESTATE', eyeState);
  },
  //设置cardArray
  setCardArray({ commit }, cardArray) {
    commit('SETCARDARRAY', cardArray);
  },
  setLabelArray({ commit }, labelArray) {
    commit('SETLABELARRAY', labelArray);
  },
  setTaskType({ commit }, taskType) {
    commit('SETTASKTYPE', taskType);
  },
  setTaskTitle({ commit }, taskTitle) {
    commit('SETTASKTITLE', taskTitle);
  },
  async allGroupTask({ commit }, params) {
    commit('ALLGROUPTASK', api.task.allGroupTask(params));
    // const promise = await api.task.allGroupTask(params);
    // if (promise.statusCode === '200') {
    //   commit('ALLGROUPTASK', promise.result);
    //   // commit("SETLABELCARDORDER", promise);
    // } else {
    //   message.error(promise.msg);
    // }
  },
  async allMainGroupTask({ commit }, params) {
    commit('ALLMAINGROUPTASK', api.task.allGroupTask(params));
    // const promise = await api.task.allGroupTask(params);
    // if (promise.statusCode === '200') {
    //   commit('ALLGROUPTASK', promise.result);
    //   // commit("SETLABELCARDORDER", promise);
    // } else {
    //   message.error(promise.msg);
    // }
  },
  async allGridGroupTask({ commit }, params) {
    commit('ALLGRIDGROUPTASK', api.task.allGridGroupTask(params));
    // const promise = await api.task.allGridGroupTask(params);
    // if (promise.statusCode === '200') {
    //   commit('ALLGRIDGROUPTASK', promise.result);
    //   // commit("SETLABELCARDORDER", promise);
    // } else {
    //   message.error(promise.msg);
    // }
  },

  // //设置cardArray
  // setAllGridTaskArray({ commit }, allGridTaskArray) {
  //   commit('setAllGridTaskArray', allGridTaskArray);
  // },
};

// mutations
const mutations = {
  GETTASKLIST(state, payload) {
    if (!util.isPromise(payload)) {
      state.labelArray = [];
      state.cardArray = [];
      // state.cardArray = payload.result.cardArray;
      state.cardArray = payload.result.cardArray.map((item) => {
        item.show = true;
        return item;
      });
      state.cardArray.sort((a, b) => b.updateTime - a.updateTime);
      // state.labelArray =payload.result.labelArray;
      // payload.result.labelArray.forEach((item, index) => {
      //   !item.cardLabelName ? (item.cardLabelName = "任务池") : null;
      //   if (item._key) {
      //     state.labelArray.push(item);
      //   } else {
      //     state.labelArray.unshift(item);
      //   }
      // });
      _.forEach(payload.result.labelArray, (item) => {
        !item.cardLabelName ? (item.cardLabelName = 'ToDo') : null;
        if (item._key) {
          state.labelArray.push(item);
        } else {
          state.labelArray.unshift(item);
        }
      });
    }
  },
  CREATETASKLABEL(state, payload) {
    state.labelArray.push(payload.result);
  },
  CHANGETASKLABEL(state, payload) {
    console.log(payload);
  },
  SETLABELKEY(state, labelKey) {
    state.labelKey = labelKey;
  },
  DELETECARDLABEL(state, payload) {
    let labelIndex = _.findIndex(state.labelArray, {
      _key: payload.labelKey,
    });
    state.labelArray.splice(labelIndex, 1);
  },
  SETCARDLABEL(state, params) {
    let labelIndex = 0;
    state.labelArray.forEach((item, index) => {
      if (item._key == params.labelKey) {
        item.cardLabelName = params.newLabelName;
      }
    });
    // state.labelArray.splice(labelIndex, 1);
  },
  BATCHCARD(state, payload) {
    let cardKeyArr = payload.result;
    _.forEach(cardKeyArr, (item) => {
      state.cardArray.unshift(item);
    });
  },
  BATCHCARDARRAY(state, payload) {
    let cardKeyArr = payload.result;
    let arr = [];
    state.cardArray.forEach((item, index) => {
      let cardIndex = _.findIndex(state.cardKeyArr, item._key);
      state.cardArray.splice(cardIndex, 1);
      // for (let i = cardKeyArr.length - 1; i >= 0; i--) {
      //   if (item._key == cardKeyArr[i]) {
      //     state.cardArray.splice(i, 1);
      //   }
      // }
    });
  },
  CHOOSEDEFAULTEXECUTOR(state, payload) {
    // if (payload.result.type == 1) {
    state.labelArray = state.labelArray.map((item) => {
      if (item._key == payload.result.labelKey) {
        item.executorKey = payload.result.executorKey;
        item.executorAvatar = payload.result.executorAvatar;
        item.executorNickName = payload.result.executorNickName;
      }
      return item;
    });
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
  },
  // CHANGELABELINDEX(state, labelIndexObj) {
  //   console.log(labelIndexObj);

  //   console.log(state.labelArray);
  //   let labelOrder = state.labelArray.map(item => {
  //     return item._key;
  //   });
  // },
  SETGROUPLABELORDER(state, labelIndexArr) {
    let arr = [];
    _.forEach(labelIndexArr, (item) => {
      arr.push(state.labelArray[item]);
    });
    state.labelArray = arr;
  },
  SETTASKDATATYPE(state, taskDataType) {
    state.taskDataType = taskDataType;
  },
  CHANGEEYESTATE(state, eyeState) {
    state.eyeState = eyeState;
  },
  SETCARDARRAY(state, cardArray) {
    state.cardArray = _.cloneDeep(cardArray);
  },
  SETLABELARRAY(state, labelArray) {
    state.labelArray = _.cloneDeep(labelArray);
  },
  SETTASKTYPE(state, taskType) {
    state.taskType = taskType;
  },
  SETTASKTITLE(state, taskTitle) {
    state.taskTitle = taskTitle;
  },
  ALLGROUPTASK(state, payload) {
    if (!util.isPromise(payload)) {
      let cooperationObj = payload.result;
      let cardIndex = _.findIndex(cooperationObj.groupArray, {
        _key: localStorage.getItem('mainGroupKey'),
      });
      if (cooperationObj.groupArray.length > 0) {
        cooperationObj.groupArray.unshift(
          cooperationObj.groupArray.splice(cardIndex, 1)[0]
        );
        cooperationObj.cardArray.unshift(
          cooperationObj.cardArray.splice(cardIndex, 1)[0]
        );
      }
      state.allGroupArray = cooperationObj.groupArray;
      state.allTaskArray = cooperationObj.cardArray;
    }
  },
  ALLMAINGROUPTASK(state, payload) {
    if (!util.isPromise(payload)) {
      state.allMainGroupArray = payload.result.groupArray;
      state.allMainTaskArray = payload.result.cardArray;
    }
  },
  ALLGRIDGROUPTASK(state, payload) {
    if (!util.isPromise(payload)) {
      let cooperationObj = payload.result;
      state.allGridChildArray = [];
      let cardIndex = _.findIndex(cooperationObj.groupArray, {
        _key: localStorage.getItem('mainGroupKey'),
      });
      if (cooperationObj.groupArray.length > 0) {
        cooperationObj.groupArray.unshift(
          cooperationObj.groupArray.splice(cardIndex, 1)[0]
        );
        cooperationObj.cardArray.unshift(
          cooperationObj.cardArray.splice(cardIndex, 1)[0]
        );
      }
      state.allGridGroupArray = cooperationObj.groupArray;
      state.allGridTaskArray = cooperationObj.cardArray.map((item, index) => {
        item = item.filter((taskItem, taskIndex) => {
          if (
            taskItem.finishPercent == 0 ||
            (taskItem.finishPercent == 1 && taskItem.children.length > 0) ||
            (taskItem.finishPercent == 2 && taskItem.children.length > 0)
          ) {
            return taskItem;
          }
        });
        return item;
      });
      cooperationObj.sonCardArray.map((item, index) => {
        state.allGridChildArray[index] = {};
        for (let key in item) {
          if (
            item[key].finishPercent == 0 ||
            (item[key].finishPercent == 1 && item[key].children.length > 0) ||
            (item[key].finishPercent == 2 && item[key].children.length > 0)
          ) {
            state.allGridChildArray[index][key] = item[key];
          }
        }
      });
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
