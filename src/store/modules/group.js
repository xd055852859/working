import api from "../../services/api";
import util from "../../services/util";
import search from "./search";
import { message } from "ant-design-vue";
import router from "../../router/router";
// initial state
const state = {
  groupInfo: null,
  inviteInfo: null,
  groupList: [],
  groupMemberList: [],
  mainGroupMemberList: [],
  cardMemberList: [],
  groupKey: "",
  //1:我的主群,2:普通群,3:他的主群
  groupType: 1,
  groupRole: 0,
  joinMemberList: [],
  groupJoinType: 0,
  groupHasPassword: false,
  groupPassword: "",
  inviteKey: 0,
  inviteState: false,
  contactInvite: false
};

// getters
const getters = {};

// actions
const actions = {
  //创建卡片
  createGroup({ commit }, params) {
    commit("CREATEGROUP", api.group.createGroup(params));
  },
  async getGroupInfo({ commit }, params) {
    const promise = await api.group.getGroupInfo(params);
    if (promise.statusCode === "200") {
      commit("GETGROUPINFO", promise.result);
    } else {
      message.error(promise.msg);
    }
  },
  async getInviteInfo({ commit }, params) {
    const promise = await api.group.getGroupInfo(params);
    if (promise.statusCode === "200") {
      commit("GETINVITEINFO", promise.result);
    } else {
      message.error(promise.msg);
    }
  },
  changeGroupInfo({ commit }, params) {
    commit("CHANGEGROUPINFO", api.group.changeGroupInfo(params));
  },
  getGroupList({ commit }, params) {
    commit("GETGROUPLIST", api.group.getGroupList(params));
  },
  //修改群组属性状态
  changeState({ commit }, groupState) {
    commit("CHANGESTATE", groupState);
  },
  //获取主群成员
  async getMainGroupMember({ commit }, params) {
    const promise = await api.group.getGroupMemberList(params);
    if (promise.statusCode === "200") {
      commit("GETMAINGROUPMEMBER", promise.result);
    } else {
      message.error(promise.msg);
    }
  },
  //获取群成员
  async getGroupMember({ commit }, params) {
    const promise = await api.group.getGroupMemberList(params);
    if (promise.statusCode === "200") {
      commit("GETGROUPMEMBER", promise.result);
    } else {
      message.error(promise.msg);
    }
  },
  async getCardMember({ commit }, params) {
    const promise = await api.group.getGroupMemberList(params);
    if (promise.statusCode === "200") {
      commit("GETCARDMEMBER", promise.result);
    } else {
      message.error(promise.msg);
    }
  },
  //添加群成员
  async addGroupMember({ commit }, params) {
    const promise = await api.group.addGroupMember(params.param);
    if (promise.statusCode === "200") {
      // if (params.type) {
      commit("ADDGROUPMEMBER", { result: params.item, type: params.type });
      // } else {
      //   commit("ADDGROUPMEMBER", { result: promise.result });
      // }
    } else {
      message.error(promise.msg);
    }
  },
  //添加主群成员
  addMainGroupMember({ commit }, params) {
    commit("ADDMAINGROUPMEMBER", api.group.addGroupMember(params));
  },
  //移除群成员
  async removeGroupMember({ commit }, params) {
    const promise = await api.group.removeGroupMember(params.param);
    if (promise.statusCode === "200") {
      commit("REMOVEGROUPMEMBER", params.index);
    } else {
      message.error(promise.msg);
    }
  },
  //群成员退出
  async outGroup({ commit }, params) {
    const promise = await api.group.outGroup(params);
    if (promise.statusCode === "200") {
      commit("OUTGROUP", params);
    } else {
      message.error(promise.msg);
    }
  },
  //设置群成员列表
  // setGroupMemberList({ commit }, groupMemberList) {
  //   commit("SETGROUPMEMBERLIST", groupMemberList);
  // },
  //获取搜索
  getGroupContact({ commit }, params) {
    commit("GETGROUPCONTACT", api.group.getGroupContact(params));
  },
  //通过userKey转换groupKey
  async userKeyToGroupKey({ commit }, params) {
    const promise = await api.group.userKeyToGroupKey(params);
    if (promise.statusCode === "200") {
      commit("SETGROUPKEY", promise.result);
    } else {
      commit("error", promise);
    }
  },
  //设置群key
  setGroupKey({ commit }, groupKey) {
    commit("SETGROUPKEY", groupKey);
  },
  //设置邀请key
  setInviteKey({ commit }, inviteKey) {
    commit("SETINVITEKEY", inviteKey);
  },
  //设置群状态
  setGroupType({ commit }, groupType) {
    commit("SETGROUPTYPE", groupType);
  },
  //设置群加入状态
  setContactInvite({ commit }, contactInvite) {
    commit("SETCONTACTINVITE", contactInvite);
  },
  //设置口令状态
  setGroupHasPassword({ commit }, groupHasPassword) {
    commit("SETGROUPHASPASSWORD", groupHasPassword);
  },
  //设置群密码
  setGroupPassword({ commit }, groupPassword) {
    commit("SETGROUPPASSWORD", groupPassword);
  },
  //
  setInviteState({ commit }, inviteState) {
    commit("SETINVITESTATE", inviteState);
  },
  //
  setCardMemberList({ commit }, cardMemberList) {
    commit("GETCARDMEMBER", cardMemberList);
  },
  //申请加群
  async applyJoinGroup({ commit }, params) {
    const promise = await api.group.applyJoinGroup(params);
    if (promise.statusCode === "200") {
      commit("APPLYJOINGROUP", promise);
    } else {
      commit("error", promise);
    }
  },
  //口令加群
  async passwordJoinGroup({ commit }, params) {
    const promise = await api.group.passwordJoinGroup(params);
    if (promise.statusCode === "200") {
      commit("PASSWORDJOINGROUP", params);
    } else {
      commit("error", promise);
    }
  },

  async applyJoinGroupList({ commit }, params) {
    const promise = await api.group.applyJoinGroupList(params);
    if (promise.statusCode === "200") {
      commit("APPLYJOINGROUPLIST", promise);
    } else {
      commit("error", promise);
    }
  },
  async deleteApplyJoinGroup({ commit }, params) {
    const promise = await api.group.deleteApplyJoinGroup(params.param);
    if (promise.statusCode === "200") {
      commit("DELETEAPPLYJOINGROUP", params.item);
    } else {
      commit("error", promise);
    }
  }
};

// mutations
const mutations = {
  error(state, error) {
    state.error = error;
  },
  CHANGESTATE(state, groupState) {
    state.groupState = groupState;
  },
  GETGROUPINFO(state, groupInfo) {
    state.groupInfo = groupInfo;
  },
  GETINVITEINFO(state, inviteInfo) {
    state.inviteInfo = inviteInfo;
  },
  CHANGEGROUPINFO(state, payload) {
    if (!util.isPromise(payload)) {
      state.groupInfo = payload.result;
      state.groupList.forEach((item, index) => {
        if (payload.result._key == item._key) {
          state.groupList.splice(index, 1, payload.result);
        }
      });
    }
  },
  GETGROUPLIST(state, payload) {
    if (!util.isPromise(payload)) {
      state.groupList = [];
      payload.result.map((item, index) => {
        if (item.groupName.indexOf("主群") == -1) {
          item.groupName = item.groupName.split("___")[0];
          state.groupList.unshift(item);
        }
      });
    }
  },
  ADDGROUPMEMBER(state, payload) {
    if (!util.isPromise(payload)) {
      console.log(payload.result);
      if (payload.type == "group") {
        state.groupList.unshift(payload.result);
        search.state.searchGroupList = search.state.searchGroupList.filter(
          item => {
            return item._key != payload.result._key;
          }
        );
      } else if (payload.type == "invite") {
        if (state.groupList.length > 0) {
          state.groupList.unshift(payload.result);
        }
        state.groupKey = payload.result._key;
        state.groupType = 3;
        state.groupInfo = payload.result;
        router.push("/");
      } else {
        if (payload.type == "member") {
          console.log(payload.result);
          state.groupMemberList.push(payload.result);
          state.joinMemberList = state.joinMemberList.filter(item => {
            return item.userKey != payload.result.userKey;
          });
        } else {
          payload.result.forEach((item, index) => {
            item._key = item.userKey;
            state.groupMemberList.push(item);
          });
          // state.groupMemberList.push(...payload.result);
        }
      }
      state.inviteState = false;
      state.contactInvite = false;
      localStorage.removeItem("inviteKey");
      localStorage.removeItem("password");
    }
  },
  ADDMAINGROUPMEMBER(state, payload) {
    if (!util.isPromise(payload)) {
      state.mainGroupMemberList.push(...payload.result);
      search.state.searchMemberList = search.state.searchMemberList.filter(
        item => {
          return item._key != payload.result[0].userKey;
        }
      );
      console.log("删除", search.state.searchMemberList);
      message.success("添加成功");
    }
  },
  REMOVEGROUPMEMBER(state, removeIndex) {
    state.groupMemberList.splice(removeIndex, 1);
    message.success("移除成员成功");
  },
  OUTGROUP(state, params) {
    state.groupList = state.groupList.filter((item, index) => {
      return item._key != params.groupKey;
    });
    state.groupKey = localStorage.getItem("mainGroupKey");
    localStorage.setItem("groupKey", localStorage.getItem("mainGroupKey"));
    state.groupType = 1;
    message.success("退出群成功");
  },
  CREATEGROUP(state, payload) {
    if (!util.isPromise(payload)) {
      message.success("新建成功");
      state.groupList.unshift(payload.result);
    }
  },
  CHANGEGROUPSETSTATE(state, groupSetState) {
    state.groupSetState = groupSetState;
  },
  CHANGEGROUPMEMBERSTATE(state, groupMemberState) {
    state.groupMemberState = groupMemberState;
  },
  GETGROUPMEMBER(state, groupMemberList) {
    state.groupMemberList = groupMemberList;
    state.groupMemberList.forEach(item => {
      if (item.userId === localStorage.getItem("userKey")) {
        state.groupRole = item.role;
      }
    });
  },
  GETMAINGROUPMEMBER(state, mainGroupMemberList) {
    state.mainGroupMemberList = mainGroupMemberList;
    // state.groupMemberList = mainGroupMemberList;
  },
  GETCARDMEMBER(state, cardMemberList) {
    state.cardMemberList = cardMemberList;
  },
  // SETGROUPMEMBERLIST(state, groupMemberList) {
  //   state.groupMemberList = groupMemberList;
  // },
  GETGROUPCONTACT(state, payload) {
    if (!util.isPromise(payload)) {
      state.groupList = payload.result.groupList.map((item, index) => {
        if (item.groupName.indexOf("主群") != -1) {
          return item;
        }
      });
      state.groupMemberList = payload.result.userList;
    }
  },
  SETGROUPKEY(state, groupKey) {
    state.groupKey = groupKey;
    localStorage.setItem("groupKey", groupKey);
  },
  SETINVITEKEY(state, inviteKey) {
    console.log("inviteKey", inviteKey);
    state.inviteKey = inviteKey;
    // localStorage.setItem("inviteKey", inviteKey);
  },
  SETGROUPTYPE(state, groupType) {
    state.groupType = groupType;
    localStorage.setItem("groupType", groupType);
  },
  SETCONTACTINVITE(state, contactInvite) {
    state.contactInvite = contactInvite;
  },
  SETGROUPPASSWORD(state, groupPassword) {
    state.groupPassword = groupPassword;
  },
  SETGROUPHASPASSWORD(state, groupHasPassword) {
    state.groupHasPassword = groupHasPassword;
  },
  SETINVITESTATE(state, inviteState) {
    state.inviteState = inviteState;
    if (!state.inviteState) {
      localStorage.removeItem("inviteKey");
      localStorage.removeItem("password");
      localStorage.removeItem("joinType");
      router.push("/");
    }
  },
  APPLYJOINGROUP(state, payload) {
    // if (!util.isPromise(payload)) {
    message.success("申请加入成功");
    state.inviteState = false;
    state.contactInvite = false;
    localStorage.removeItem("inviteKey");
    localStorage.removeItem("password");
    localStorage.removeItem("joinType");
    router.push("/");
    // }
  },
  PASSWORDJOINGROUP(state, payload) {
    state.groupKey = payload.groupKey;
    state.groupType = 3;
    state.groupInfo = state.inviteInfo;
    message.success("口令加入成功");
    state.inviteState = false;
    state.contactInvite = false;
    localStorage.removeItem("inviteKey");
    localStorage.removeItem("password");
    localStorage.removeItem("joinType");
    router.push("/");
  },
  APPLYJOINGROUPLIST(state, payload) {
    if (!util.isPromise(payload)) {
      state.joinMemberList = payload.result;
    }
  },
  DELETEAPPLYJOINGROUP(state, payload) {
    if (!util.isPromise(payload)) {
      state.joinMemberList = state.joinMemberList.filter(item => {
        return item.userKey != payload.userKey;
      });
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
