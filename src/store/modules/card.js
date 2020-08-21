import api from '../../services/api';
import util from '../../services/util';
import task from './task';
import countdown from './countdown';
import group from './group';
import _ from 'lodash';
import moment from 'moment';
import { message } from 'ant-design-vue';
// initial state
const state = {
  cardList: [],
  cardKey: 0,
  cardType: 1,
  cardIndex: 0,
  linkState: 0,
  followCardState: false,
  followCardObj: {},
  followCardList: [],
  executeCardList: [],
  cardDetail: null,
  cardDetailType: 1,
  cardTotal: 0,
  cardShowState: false,
  cardContent: '',
  //卡片的执行者
  cardExecutorKey: '',
  //卡片的任务状态(选择执行者)
  chooseExecutorType: 0,
  cardExecutorIndex: 0,
  cardHistoryList: [],
  cardChooseFollowArr: [],
  //卡片@对应的人
  impersonState: 0,
  onlyTitle: '',
  closeIndex: null,
};

// getters
const getters = {};

// actions
const actions = {
  //子组件状态
  setLinkState({ commit }, linkState) {
    commit('SETLINKSTATE', linkState);
  },
  //创建卡片
  async createCard({ commit }, params) {
    const promise = await api.card.createCard(params);
    if (promise.statusCode === '200') {
      commit('CREATECARD', {
        result: promise.result,
        cardIndex: params.cardIndex,
      });
    } else {
      message.error(promise.msg);
    }
  },
  //编辑卡片
  async editCard({ commit }, params) {
    commit('EDITNEWCARD', params);
    const promise = await api.card.editCard(params);
    if (promise.statusCode === '200') {
      commit('EDITCARD', promise.result);
    } else {
      message.error(promise.msg);
    }
  },
  async deleteCard({ commit }, params) {
    const promise = await api.card.deleteCard(params);
    if (promise.statusCode === '200') {
      commit('DELETECARD', {
        result: params,
      });
    } else {
      message.error(promise.msg);
    }
  },
  //卡片列表
  async getCardList({ commit }, params) {
    const promise = await api.card.getCardList(params);
    if (promise.statusCode === '200') {
      commit('GETCARDLIST', promise);
    } else {
      message.error(promise.msg);
    }
    // commit("GETCARDLIST", api.card.getCardList(params));
  },
  //卡片详情
  getCardDetail({ commit }, params) {
    commit('GETCARDDETAIL', api.card.getCardDetail(params));
    // const promise = await api.card.getCardDetail(params);
    // commit('GETCARDDETAIL', promise.result);
    // const promise = await api.card.getCardDetail(params);
    // if (promise.statusCode === '200') {
    //   commit('GETCARDDETAIL', promise.result);
    // } else {
    //   message.error(promise.msg);
    // }
  },
  //设置卡片
  setCardKey({ commit }, cardKey) {
    commit('SETCARDKEY', cardKey);
  },
  //设置卡片
  setCardType({ commit }, cardType) {
    commit('SETCARDTYPE', cardType);
  },
  setCardDetail({ commit }, cardDetail) {
    commit('SETCARDDETAIL', cardDetail);
  },
  //设置卡片下标
  setCardIndex({ commit }, cardIndex) {
    commit('SETCARDINDEX', cardIndex);
  },
  //卡片@列表
  async getFollowCardList({ commit }, params) {
    const promise = await api.card.getFollowCardList(params);
    if (promise.statusCode === '200') {
      commit('GETFOLLOWCARDLIST', promise.result);
    } else {
      message.error(promise.msg);
    }
  },
  changeFollowCardState({ commit }, followCardState) {
    commit('CHANGEFOLLOWCARDSTATE', followCardState);
  },
  saveFollowPerson({ commit }, params) {
    commit('SAVEFOLLOWPERSON', api.card.saveFollowPerson(params));
  },
  //卡片详情显示状态
  changeCardShowState({ commit }, cardShowState) {
    commit('CHANGECARDSHOWSTATE', cardShowState);
  },
  changeCardDetailType({ commit }, cardDetailType) {
    commit('CHANGECARDDETAILTYPE', cardDetailType);
  },
  //卡片内容
  setCardContent({ commit }, cardContent) {
    commit('SETCARDCONTENT', cardContent);
  },
  //卡片执行者card
  async saveExecutorPerson({ commit }, params) {
    const promise = await api.card.saveExecutorPerson(params.param);
    if (promise.statusCode === '200') {
      commit('SAVEEXECUTORPERSON', params);
    } else {
      message.error(promise.msg);
    }
  },
  setCardExecutorKey({ commit }, cardExecutorKey) {
    commit('SETCARDEXECUTORKEY', cardExecutorKey);
  },
  setExecutorType({ commit }, chooseExecutorType) {
    commit('SETEXECUTORTYPE', chooseExecutorType);
  },
  setExecutorIndex({ commit }, cardExecutorIndex) {
    commit('SETEXECUTORINDEX', cardExecutorIndex);
  },
  setCardChooseFollowArr({ commit }, cardChooseFollowArr) {
    commit('SETCARDCHOOSEFOLLOWARR', cardChooseFollowArr);
  },
  //获取卡片
  async getCardHistory({ commit }, params) {
    const promise = await api.card.getCardHistory(params);
    if (promise.statusCode === '200') {
      commit('GETCARDHISTORY', promise.result);
    } else {
      message.error(promise.msg);
    }
  },
  setImpersonState({ commit }, impersonState) {
    commit('SETIMPERSONSTATE', impersonState);
  },

  //设置cardArray
  setCardArray({ commit }, cardArray) {
    commit('SETCARDARRAY', cardArray);
  },
};

// mutations
const mutations = {
  error(state, error) {
    state.error = error;
  },
  SETLINKSTATE(state, linkState) {
    state.linkState = linkState;
    state.cardShowState = false;
    state.cardDetailType = 1;
    state.cardKey = 0;
    state.cardDetail = null;
  },
  CREATECARD(state, payload) {
    if (!util.isPromise(payload)) {
      payload.result.groupRole = group.state.groupRole;
      payload.result.show = true;
      let taskIndex = payload.cardIndex;
      if (task.state.allGridTaskArray.length != 0) {
        if (!payload.result.parentCardKey) {
          task.state.allGridGroupArray.forEach((item, index) => {
            if (item._key == payload.result.groupKey) {
              task.state.allGridTaskArray[index].push(payload.result);
            }
            return item;
          });
        } else {
          task.state.allGridGroupArray.forEach((item, index) => {
            if (item._key == payload.result.groupKey) {
              task.state.allGridTaskArray[index].forEach(
                (parentItem, parentIndex) => {
                  if (parentItem._key == payload.result.parentCardKey) {
                    parentItem.children.push(payload.result._key);
                  }
                }
              );
              for (let key in task.state.allGridChildArray[index]) {
                if (key == payload.result.parentCardKey) {
                  task.state.allGridChildArray[index][key].children.push(
                    payload.result._key
                  );
                }
              }
              payload.result.children = [];
              task.state.allGridChildArray[index][payload.result._key] =
                payload.result;
              task.state.allGridChildArray.splice(
                index,
                1,
                task.state.allGridChildArray[index]
              );
            }
          });
        }
      }
      if (group.state.groupType == 3) {
        if (payload.result.type == 2) {
          task.state.cardArray.unshift(payload.result);
          // if (group.state.groupType == 3) {
          // if (payload.result.labelKey) {
          task.state.labelArray = task.state.labelArray.map((item, index) => {
            if (item._key == payload.result.labelKey) {
              if (taskIndex) {
                item.cardOrder.splice(taskIndex, 0, payload.result._key);
              } else {
                item.cardOrder.unshift(payload.result._key);
              }
            }
            return item;
          });
          // } else {
          //   if (taskIndex) {
          //     task.state.taskAllListOrder.splice(
          //       taskIndex,
          //       0,
          //       payload.result._key
          //     );
          //   } else {
          //     task.state.taskAllListOrder.unshift(payload.result._key);
          //   }
          // }
          // }
        } else {
          state.cardList.unshift(payload.result);
        }
      } else if (group.state.groupType == 1 || group.state.groupType == 2) {
        let allIndex = _.findIndex(task.state.allGroupArray, {
          _key: payload.result.groupKey,
        });
        task.state.allTaskArray[allIndex].unshift(payload.result);
      }
      // task.state.allGridTaskArray.forEach((item,index)=>{
      //   item.forEach((taskItem,taskIndex)=>{
      //     if()taskItem
      //   })
      // })
      state.cardTotal = state.cardTotal + 1;
      state.cardDetailType = 2;
      state.cardKey = payload.result._key;
      // message.success("保存成功");
    }
  },
  EDITNEWCARD(state, params) {
    if (group.state.groupType == 3) {
      task.state.cardArray = task.state.cardArray.map((item, index) => {
        if (item._key == params.key) {
          for (let key in params) {
            item[key] = params[key];
          }
        }
        return item;
      });
      // state.cardList.splice(state.cardIndex, 1, payload.promise);
      // }
    } else if (group.state.groupType == 1 || group.state.groupType == 2) {
      task.state.allTaskArray = task.state.allTaskArray.map((item, index) => {
        item = item.map((taskItem, taskIndex) => {
          if (taskItem._key == params.key) {
            for (let key in params) {
              taskItem[key] = params[key];
            }
          }
          return taskItem;
        });
        return item;
      });
    }
    if (task.state.allGridTaskArray.length != 0) {
      task.state.allGridTaskArray = task.state.allGridTaskArray.map(
        (item, index) => {
          item = item.map((taskItem, taskIndex) => {
            if (taskItem._key == params.key) {
              for (let key in params) {
                taskItem[key] = params[key];
              }
            }
            return taskItem;
          });
          return item;
        }
      );
      task.state.allGridChildArray = task.state.allGridChildArray.map(
        (item, index) => {
          for (let key in item) {
            if (key == params.key) {
              for (let taskKey in params) {
                item[key][taskKey] = params[taskKey];
              }
            }
          }
          return item;
        }
      );
      task.state.allGridChildArray.splice(
        0,
        1,
        task.state.allGridChildArray[0]
      );
    }
    countdown.state.countDownList = countdown.state.countDownList.map(
      (item, index) => {
        if (item._key == params.key) {
          for (let key in params) {
            item[key] = params[key];
          }
        }
        return item;
      }
    );
  },
  EDITCARD(state, payload) {
    if (group.state.groupType == 3) {
      task.state.cardArray = task.state.cardArray.map((item, index) => {
        if (item._key == payload._key) {
          for (let key in payload) {
            if (item[key] != payload[key]) {
              item[key] = payload[key];
            }
          }
        }
        return item;
      });
      // state.cardList.splice(state.cardIndex, 1, payload.promise);
      // }
    } else if (group.state.groupType == 1 || group.state.groupType == 2) {
      task.state.allTaskArray = task.state.allTaskArray.map((item, index) => {
        item = item.map((taskItem, taskIndex) => {
          if (taskItem._key == payload._key) {
            for (let key in payload) {
              if (taskItem[key] != payload[key]) {
                taskItem[key] = payload[key];
              }
            }
          }
          return taskItem;
        });
        return item;
      });
    }
    if (task.state.allGridTaskArray.length != 0) {
      task.state.allGridTaskArray = task.state.allGridTaskArray.map(
        (item, index) => {
          item = item.map((taskItem, taskIndex) => {
            if (taskItem._key == payload._key) {
              for (let key in payload) {
                if (taskItem[key] != payload[key]) {
                  taskItem[key] = payload[key];
                }
              }
            }
            return taskItem;
          });
          return item;
        }
      );
      task.state.allGridChildArray = task.state.allGridChildArray.map(
        (item, index) => {
          for (let key in item) {
            if (key == payload._key) {
              for (let taskKey in payload) {
                if (item[key][taskKey] != payload[key]) {
                  item[key][taskKey] = payload[key];
                }
              }
            }
          }
          return item;
        }
      );
      countdown.state.countDownList = countdown.state.countDownList.map(
        (item, index) => {
          if (item._key == payload._key) {
            for (let key in payload) {
              if (item[key] != payload[key]) {
                item[key] = payload[key];
              }
            }
          }
          return item;
        }
      );
      task.state.allGridChildArray.splice(
        0,
        1,
        task.state.allGridChildArray[0]
      );
      countdown.state.countDownList = countdown.state.countDownList.map(
        (item, index) => {
          if (item._key == payload._key) {
            for (let key in payload) {
              if (item[key] != payload[key]) {
                item[key] = payload[key];
              }
            }
          }
          return item;
        }
      );
    }
  },
  DELETECARD(state, payload) {
    if (task.state.allGridTaskArray.length != 0) {
      task.state.allGridGroupArray.forEach((item, index) => {
        if (item._key == payload.result.groupKey) {
          let taskIndex = _.findIndex(task.state.allGridTaskArray[index], {
            _key: payload.result.cardKey,
          });
          if (taskIndex == -1) {
            let taskItem =
              task.state.allGridChildArray[index][payload.result.cardKey];
            if (task.state.allGridChildArray[index][taskItem.parentCardKey]) {
              let childIndex = _.findIndex(
                task.state.allGridChildArray[index][taskItem.parentCardKey]
                  .children,
                payload.result.cardKey
              );
              task.state.allGridChildArray[index][
                taskItem.parentCardKey
              ].children.splice(childIndex, 1);
            } else {
              let parentIndex = _.findIndex(
                task.state.allGridTaskArray[index],
                {
                  _key: taskItem.parentCardKey,
                }
              );
              let childIndex = _.findIndex(
                task.state.allGridTaskArray[index][parentIndex].children,
                payload.result.cardKey
              );
              task.state.allGridTaskArray[index][parentIndex].children.splice(
                childIndex,
                1
              );
            }
            delete task.state.allGridChildArray[index][payload.result.cardKey];
            task.state.allGridChildArray.splice(
              0,
              1,
              task.state.allGridChildArray[0]
            );
          } else {
            task.state.allGridTaskArray[index].splice(taskIndex, 1);
          }
        }
      });
    }
    if (payload.result.type == 'card') {
      state.cardList.splice(state.cardIndex, 1);
    } else {
      if (group.state.groupType == 3) {
        let cardIndex = _.findIndex(task.state.cardArray, {
          _key: payload.result.cardKey,
        });
        task.state.cardArray.splice(cardIndex, 1);
      } else if (group.state.groupType == 1 || group.state.groupType == 2) {
        task.state.allTaskArray = task.state.allTaskArray.map((item, index) => {
          let cardIndex = _.findIndex(item, {
            _key: payload.result.cardKey,
          });
          if (cardIndex != -1) {
            item.splice(cardIndex, 1);
          }
          return item;
        });
      }
    }
    // if (group.state.groupType == 3) {
    //   let taskAllIndex = task.state.taskAllListOrder.indexOf(state.cardKey);
    //   if (taskAllIndex == -1) {
    //     task.state.labelArray.forEach((item, index) => {
    //       let taskIndex = item.cardOrder.indexOf(state.cardKey);
    //       item.cardOrder.splice(taskIndex, 1);
    //     });
    //   } else {
    //     task.state.taskAllListOrder.splice(taskAllIndex, 1);
    //   }
    // }
    state.cardKey = 0;
    state.cardTotal = state.cardTotal - 1;
    message.success('删除成功');
  },
  SETCARDKEY(state, cardKey) {
    state.cardKey = cardKey;
  },
  SETCARDTYPE(state, cardType) {
    state.cardType = cardType;
  },
  SETCARDDETAIL(state, cardDetail) {
    state.cardDetail = cardDetail;
  },
  SETCARDINDEX(state, cardIndex) {
    state.cardIndex = cardIndex;
  },
  GETCARDDETAIL(state, payload) {
    if (!util.isPromise(payload)) {
      state.cardDetail = payload.result;
      state.cardExecutorKey = payload.result.executorKey;
      // state.groupKey = payload.result;
    }
  },
  GETCARDLIST(state, payload) {
    state.cardList = payload.result.map((item) => {
      item.changeTitleState = false;
      return item;
    });
    state.cardTotal = payload.totalNumber;
  },
  GETFOLLOWCARDLIST(state, followCardList) {
    state.followCardList = followCardList;
  },
  CHANGEFOLLOWCARDSTATE(state, followCardState) {
    state.followCardState = followCardState;
  },
  SETFOLLOWCARDOBJ(state, followCardObj) {
    state.followCardObj = followCardObj;
  },
  SAVEFOLLOWPERSON(state, payload) {
    if (!util.isPromise(payload)) {
      console.log('保存成功');
    }
  },
  SAVEEXECUTORPERSON(state, payload) {
    task.state.cardArray = task.state.cardArray.map((item, index) => {
      if (item._key == payload.param.cardKeyArray[0]) {
        if (payload.type == 'change') {
          // state.cardExecutorKey = payload.item.userId;
          item.executorKey = payload.item.userId;
          item.executorName = payload.item.nickName;
          item.executorAvatar = payload.item.avatar;
        } else if (payload.type == 'delete') {
          state.cardExecutorKey = 0;
          item.executorKey = 0;
          item.executorName = '';
          item.executorAvatar = '';
        }
      }
      return item;
    });
  },
  SETCARDCHOOSEFOLLOWARR(state, cardChooseFollowArr) {
    state.cardChooseFollowArr = cardChooseFollowArr;
  },
  CHANGECARDSHOWSTATE(state, cardShowState) {
    state.cardShowState = cardShowState;
    if (!state.cardShowState) {
      state.cardDetail = null;
      //   // state.cardKey = null;
      //   // localStorage.removeItem("shareKey");
    }
  },
  CHANGECARDDETAILTYPE(state, cardDetailType) {
    state.cardDetailType = cardDetailType;
  },
  SETCARDCONTENT(state, cardContent) {
    state.cardContent = cardContent;
  },
  SETCARDEXECUTORKEY(state, cardExecutorKey) {
    state.cardExecutorKey = cardExecutorKey;
  },
  SETEXECUTORTYPE(state, chooseExecutorType) {
    state.chooseExecutorType = chooseExecutorType;
  },
  SETEXECUTORINDEX(state, cardExecutorIndex) {
    state.cardExecutorIndex = cardExecutorIndex;
  },
  GETCARDHISTORY(state, cardHistoryList) {
    state.cardHistoryList = cardHistoryList.map((item, index) => {
      item.log =
        moment(item.createTime).format('YYYY-MM-DD HH:mm:ss') + ' ' + item.log;
      return item;
    });
  },
  SETIMPERSONSTATE(state, impersonState) {
    state.impersonState = impersonState;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
