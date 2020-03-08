import api from "../../services/api";
import util from "../../services/util";
import task from "./task";
import group from "./group";

import { message } from "ant-design-vue";
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
  cardDetail: {},
  cardDetailType: 1,
  cardTotal: 0,
  cardShowState: false,
  cardContent: "",
  //卡片的执行者
  cardExecutorKey: "",
  //卡片的任务状态(选择执行者)
  chooseExecutorType: 0,
  cardExecutorIndex: 0,
  cardHistoryList: [],
  cardChooseFollowArr: [],
  //卡片@对应的人
  impersonState: 0,
  onlyTitle: "",
  closeIndex: null
};

// getters
const getters = {};

// actions
const actions = {
  //子组件状态
  setLinkState({ commit }, linkState) {
    commit("SETLINKSTATE", linkState);
  },
  //创建卡片
  async createCard({ commit }, params) {
    const promise = await api.card.createCard(params);
    if (promise.statusCode === "200") {
      commit("CREATECARD", {
        result: promise.result,
        cardIndex: params.cardIndex
      });
    } else {
      message.error(promise.msg);
    }
  },
  //编辑卡片
  async editCard({ commit }, params) {
    const promise = await api.card.editCard(params);
    if (promise.statusCode === "200") {
      commit("EDITCARD", { result: params });
    } else {
      message.error(promise.msg);
    }
  },
  deleteCard({ commit }, params) {
    commit("DELETECARD", api.card.deleteCard(params));
  },
  //卡片列表
  async getCardList({ commit }, params) {
    const promise = await api.card.getCardList(params);
    if (promise.statusCode === "200") {
      commit("GETCARDLIST", promise);
    } else {
      message.error(promise.msg);
    }
    // commit("GETCARDLIST", api.card.getCardList(params));
  },
  //卡片详情
  async getCardDetail({ commit }, params) {
    const promise = await api.card.getCardDetail(params);
    if (promise.statusCode === "200") {
      commit("GETCARDDETAIL", promise.result);
    } else {
      message.error(promise.msg);
    }
  },
  //设置卡片
  setCardKey({ commit }, cardKey) {
    commit("SETCARDKEY", cardKey);
  },
  //设置卡片
  setCardType({ commit }, cardType) {
    commit("SETCARDTYPE", cardType);
  },
  setCardDetail({ commit }, cardDetail) {
    commit("SETCARDDETAIL", cardDetail);
  },
  //设置卡片下标
  setCardIndex({ commit }, cardIndex) {
    commit("SETCARDINDEX", cardIndex);
  },
  //卡片@列表
  async getFollowCardList({ commit }, params) {
    const promise = await api.card.getFollowCardList(params);
    if (promise.statusCode === "200") {
      commit("GETFOLLOWCARDLIST", promise.result);
    } else {
      message.error(promise.msg);
    }
  },
  changeFollowCardState({ commit }, followCardState) {
    commit("CHANGEFOLLOWCARDSTATE", followCardState);
  },
  saveFollowPerson({ commit }, params) {
    commit("SAVEFOLLOWPERSON", api.card.saveFollowPerson(params));
  },
  //卡片详情显示状态
  changeCardShowState({ commit }, cardShowState) {
    commit("CHANGECARDSHOWSTATE", cardShowState);
  },
  changeCardDetailType({ commit }, cardDetailType) {
    commit("CHANGECARDDETAILTYPE", cardDetailType);
  },
  //卡片内容
  setCardContent({ commit }, cardContent) {
    commit("SETCARDCONTENT", cardContent);
  },
  //卡片执行者card
  saveExecutorPerson({ commit }, params) {
    commit("SAVEEXECUTORPERSON", api.card.saveExecutorPerson(params));
  },
  setCardExecutorKey({ commit }, cardExecutorKey) {
    commit("SETCARDEXECUTORKEY", cardExecutorKey);
  },
  setExecutorType({ commit }, chooseExecutorType) {
    commit("SETEXECUTORTYPE", chooseExecutorType);
  },
  setExecutorIndex({ commit }, cardExecutorIndex) {
    commit("SETEXECUTORINDEX", cardExecutorIndex);
  },
  setCardChooseFollowArr({ commit }, cardChooseFollowArr) {
    commit("SETCARDCHOOSEFOLLOWARR", cardChooseFollowArr);
  },
  //获取卡片
  async getCardHistory({ commit }, params) {
    const promise = await api.card.getCardHistory(params);
    if (promise.statusCode === "200") {
      commit("GETCARDHISTORY", promise.result);
    } else {
      message.error(promise.msg);
    }
  },
  setImpersonState({ commit }, impersonState) {
    commit("SETIMPERSONSTATE", impersonState);
  },
  //设置标题
  setOnlyTitle({ commit }, onlyTitle) {
    commit("SETONLYTITLE", onlyTitle);
  },
  setCloseIndex({ commit }, closeIndex) {
    commit("SETCLOSEINDEX", closeIndex);
  }
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
    state.cardDetail = {};
  },
  CREATECARD(state, payload) {
    if (!util.isPromise(payload)) {
      let taskIndex = payload.cardIndex;
      console.log("taskIndex",taskIndex);
      state.cardList.unshift(payload.result);
      if (payload.result.type == 2) {
        task.state.cardArray.unshift(payload.result);
        if (group.state.groupType == 3) {
          if (payload.result.labelKey) {
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
          } else {
            if (taskIndex) {
              task.state.taskAllListOrder.splice(
                taskIndex,
                0,
                payload.result._key
              );
            } else {
              task.state.taskAllListOrder.unshift(payload.result._key);
            }
          }
        }
      }
      state.cardTotal = state.cardTotal + 1;
      state.cardDetailType = 2;
      state.cardKey = payload.result._key;
      console.log(state.cardKey);
      // message.success("保存成功");
    }
  },
  EDITCARD(state, payload) {
    task.state.cardArray = task.state.cardArray.map((item, index) => {
      if (item._key == payload.result.key) {
        for (let key in payload.result) {
          item[key] = payload.result[key];
        }
      }
      if (state.cardKey == item._key) {
        state.cardDetail = item;
      }
      return item;
    });
    // state.cardList.splice(state.cardIndex, 1, payload.result);

    // message.success("编辑卡片成功");
  },
  DELETECARD(state, payload) {
    if (!util.isPromise(payload)) {
      task.state.cardArray.forEach((item, index) => {
        if (item._key == state.cardKey) {
          task.state.cardArray.splice(index, 1);
        }
      });
      if (group.state.groupType == 3) {
        let taskAllIndex = task.state.taskAllListOrder.indexOf(state.cardKey);
        if (taskAllIndex == -1) {
          task.state.labelArray.forEach((item, index) => {
            let taskIndex = item.cardOrder.indexOf(state.cardKey);
            item.cardOrder.splice(taskIndex, 1);
          });
        } else {
          task.state.taskAllListOrder.splice(taskAllIndex, 1);
        }
      }
      state.cardList.splice(state.cardIndex, 1);
      state.cardKey = 0;
      state.cardTotal = state.cardTotal - 1;
    }
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
  GETCARDDETAIL(state, cardDetail) {
    state.cardDetail = cardDetail;
  },
  GETCARDLIST(state, payload) {
    state.cardList = payload.result.map(item => {
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
      console.log("保存成功");
    }
  },
  SAVEEXECUTORPERSON(state, payload) {
    if (!util.isPromise(payload)) {
      console.log("保存成功");
    }
  },
  SETCARDCHOOSEFOLLOWARR(state, cardChooseFollowArr) {
    state.cardChooseFollowArr = cardChooseFollowArr;
  },
  CHANGECARDSHOWSTATE(state, cardShowState) {
    state.cardShowState = cardShowState;

    if (!state.cardShowState) {
      state.cardDetail = {};
      // state.cardKey = null;
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
    state.cardHistoryList = cardHistoryList;
  },
  SETIMPERSONSTATE(state, impersonState) {
    state.impersonState = impersonState;
  },
  SETONLYTITLE(state, onlyTitle) {
    state.onlyTitle = onlyTitle;
  },
  SETCLOSEINDEX(state, closeIndex) {
    state.closeIndex = closeIndex;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
