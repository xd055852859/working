import { AUTH_URL, CHAT_API_URL, HOME_URL } from "./global";
import util from "./util";

// let token =localStorage.getItem('token')?localStorage.getItem('token'):null;
let token = null;

const requests = {
  get(url, params, headers) {
    var i = 0;
    for (let index in params) {
      if (i === 0) {
        url = url + "?" + index + "=" + encodeURIComponent(params[index]);
      } else {
        url = url + "&" + index + "=" + encodeURIComponent(params[index]);
      }
      i++;
    }
    return new Promise(async function(resolve, reject) {
      try {
        let result = await fetch(url, {
          headers: headers || {},
          method: "GET"
        });
        const json = await result.json();
        resolve(json);
      } catch (e) {
        reject(e);
      }
    });
  },
  post: (url, params) => {
    return new Promise(async function(resolve, reject) {
      try {
        let result = await fetch(url, {
          method: "POST",
          body: JSON.stringify(params),
          headers: {
            "Content-Type": "application/json"
          }
        });
        const json = await result.json();
        resolve(json);
      } catch (e) {
        reject(e);
      }
    });
  },
  // post方法（multipart/form-data）
  postForm(url, data) {
    return new Promise(async function(resolve, reject) {
      try {
        let result = await fetch(url, {
          method: "POST",
          body: data
        });
        const json = await result.json();
        resolve(json);
      } catch (e) {
        reject(e);
      }
    });
  },
  patch: (url, params) => {
    return new Promise(async function(resolve, reject) {
      try {
        let result = await fetch(url, {
          method: "PATCH",
          body: JSON.stringify(params),
          headers: {
            "Content-Type": "application/json"
          }
        });
        const json = await result.json();
        resolve(json);
      } catch (e) {
        reject(e);
      }
    });
  },
  delete: (url, params) => {
    return new Promise(async function(resolve, reject) {
      try {
        let result = await fetch(url, {
          method: "DELETE",
          body: JSON.stringify(params),
          headers: {
            "Content-Type": "application/json"
          }
        });
        const json = await result.json();
        resolve(json);
      } catch (e) {
        reject(e);
      }
    });
  }
};

const auth = {
  // 登录
  login(mobileArea, mobile, password) {
    const isMobile = util.isMobile();
    let param = {
      mobileArea: mobileArea,
      mobile: mobile,
      password: password,
      service: 3,
      lo: 13,
      la: 14,
      app: 3,
      deviceType: isMobile ? 1 : 4,
      deviceModel: isMobile ? "mobile" : "web",
      appHigh: 27
    };
    return requests.get(AUTH_URL + "/account", param);
  },

  // 获取七牛云uptoken
  getUptoken() {
    return requests.get(HOME_URL + "/upTokenQiniu/getQiNiuUpToken", {
      token: token,
      type: 2
    });
  },

  getToken() {
    return token;
  },

  // 获取登录用户信息
  getUserFullInfo(params) {
    return requests.get(AUTH_URL + "/account/userinfo", {
      ...params
    });
  },

  //创建主群
  createMainGroup(token) {
    return requests.patch(HOME_URL + "/group/createMainGroup", {
      token: token
    });
  },
  getTargetUserInfo(params) {
    return requests.get(HOME_URL + "/account/targetUserInfo", {
      token: token,
      ...params
    });
  },
  updateUser(chatAuthToken, chatUserId, userInfo) {
    return requests.post(CHAT_API_URL + "/users/users.update", {
      token: token,
      authToken: chatAuthToken,
      userId: chatUserId,
      userInfo: userInfo
    });
  }
};

const contact = {
  /**
   * 获取联系人列表
   */
  getContacts() {
    return requests.get(AUTH_URL + "/friend", {
      token: token
    });
  },
  /**
   * 获取群组列表
   */
  getGroups() {
    return requests.get(AUTH_URL + "/group/groupList", {
      token: token
    });
  }
};

const card = {
  createCard(params) {
    return requests.post(HOME_URL + "/card", {
      token: token,
      ...params
    });
  },
  //编辑卡片
  editCard(params) {
    return requests.patch(HOME_URL + "/card", {
      token: token,
      ...params
    });
  },
  //获取卡片列表
  getCardList(params) {
    return requests.get(HOME_URL + "/card/listBoard", {
      token: token,
      ...params
    });
  },
  //删除卡片
  deleteCard(params) {
    return requests.delete(HOME_URL + "/card", {
      token: token,
      ...params
    });
  },
  //获取卡片内容
  getCardDetail(params) {
    return requests.get(HOME_URL + "/card/cardDetail", {
      token: token,
      ...params
    });
  },
  //获取卡片@列表
  getFollowCardList(params) {
    return requests.get(HOME_URL + "/followCard/list", {
      token: token,
      ...params
    });
  },
  //保存跟踪者和执行者
  saveFollowPerson(params) {
    return requests.post(HOME_URL + "/followCard", {
      token: token,
      ...params
    });
  },
  saveExecutorPerson(params) {
    return requests.patch(HOME_URL + "/card/setCardExecutor", {
      token: token,
      ...params
    });
  },
  //卡片评论列表
  getCommentList(params) {
    return requests.get(HOME_URL + "/commentCard/list", {
      token: token,
      ...params
    });
  },
  //增加卡片评论
  saveComment(params) {
    return requests.post(HOME_URL + "/commentCard", {
      token: token,
      ...params
    });
  },
  //增加卡片评论
  deleteComment(params) {
    return requests.delete(HOME_URL + "/commentCard", {
      token: token,
      ...params
    });
  },
  //卡片历史
  getCardHistory(params) {
    return requests.get(HOME_URL + "/cardLog/cardLogList", {
      token: token,
      ...params
    });
  }
};
const task = {
  //任务列表
  getTaskList(params) {
    return requests.get(HOME_URL + "/card/listBoardTask", {
      token: token,
      ...params
    });
  },
  createTaskLabel(params) {
    return requests.post(HOME_URL + "/card/addCardLabel", {
      token: token,
      ...params
    });
  },
  changeTaskLabel(params) {
    return requests.patch(HOME_URL + "/card/setCardLabel", {
      token: token,
      ...params
    });
  },
  deleteCardLabel(params) {
    return requests.post(HOME_URL + "/card/deleteCardLabel", {
      token: token,
      ...params
    });
  },
  setCardLabel(params) {
    return requests.patch(HOME_URL + "/card/setLabelProperty", {
      token: token,
      ...params
    });
  },
  //批量导入任务
  batchCard(params) {
    return requests.post(HOME_URL + "/card/batchQuickCreateCard", {
      token: token,
      ...params
    });
  },
  //批量归档
  batchCardArray(params) {
    return requests.patch(HOME_URL + "/card/fileCard", {
      token: token,
      ...params
    });
  },
  //修改任务顺序
  setLabelCardOrder(params) {
    return requests.patch(HOME_URL + "/card/setLabelCardOrder", {
      token: token,
      ...params
    });
  },
  //设置默认执行者
  setLabelOrGroupExecutorKey(params) {
    return requests.post(HOME_URL + "/card/setLabelOrGroupExecutorKey", {
      token: token,
      ...params
    });
  },
};
const group = {
  createGroup(params) {
    return requests.post(HOME_URL + "/group", {
      token: token,
      ...params
    });
  },
  //获取群组列表
  getGroupList(params) {
    return requests.get(HOME_URL + "/group/groupList", {
      token: token ? token : localStorage.getItem("token"),
      ...params
    });
  },
  //获取群信息
  getGroupInfo(params) {
    return requests.get(HOME_URL + "/group", {
      token: token,
      ...params
    });
  },
  //修改群消息
  changeGroupInfo(params) {
    return requests.patch(HOME_URL + "/group", {
      token: token,
      ...params
    });
  },
  //获取群成员
  getGroupMemberList(params) {
    return requests.get(HOME_URL + "/groupmember", {
      token: token ? token : localStorage.getItem("token"),
      ...params
    });
  },
  //通讯录搜索人或群
  getGroupContact(params) {
    return requests.get(HOME_URL + "/group/searchGroupOrUser", {
      token: token,
      ...params
    });
  },
  //通过用户id查询主群key
  userKeyToGroupKey(params) {
    return requests.get(HOME_URL + "/group/targetUKeyMainGroup", {
      token: token,
      ...params
    });
  },
  //添加群成员
  addGroupMember(params) {
    return requests.post(HOME_URL + "/groupmember", {
      token: token,
      ...params
    });
  },
  //移除群成员
  removeGroupMember(params) {
    return requests.delete(HOME_URL + "/groupmember/remove", {
      token: token,
      ...params
    });
  },
  //群成员退出群
  outGroup(params) {
    return requests.delete(HOME_URL + "/groupmember", {
      token: token,
      ...params
    });
  },
  //申请加入群
  applyJoinGroup(params) {
    return requests.post(HOME_URL + "/group/applyJoinGroup", {
      token: token,
      ...params
    });
  },
  //口令加入群
  passwordJoinGroup(params) {
    return requests.post(HOME_URL + "/groupmember/passwordJoinGroup", {
      token: token,
      ...params
    });
  },
  applyJoinGroupList(params) {
    return requests.post(HOME_URL + "/group/applyJoinGroupList", {
      token: token,
      ...params
    });
  },
  //移除群申请
  deleteApplyJoinGroup(params) {
    return requests.post(HOME_URL + "/group/deleteApplyJoinGroup", {
      token: token,
      ...params
    });
  },
};
const search = {
  getSearchList(params) {
    return requests.get(HOME_URL + "/group/searchGroupOrUser", {
      token: token,
      ...params
    });
  },
  getCardSearch(params) {
    return requests.get(HOME_URL + "/card/searchCard", {
      token: token,
      ...params
    });
  }
};
const role = {
  setRole(params) {
    return requests.patch(HOME_URL + "/groupmember/setRole", {
      token: token,
      ...params
    });
  }
};
const message = {
  getMessageList(params) {
    return requests.get(HOME_URL + "/cardLog/cardMessageList", {
      token: token,
      ...params
    });
  },
  readMessage(params) {
    return requests.patch(HOME_URL + "/cardLog/readMessage", {
      token: token,
      ...params
    });
  },
  delMessage(params) {
    return requests.delete(HOME_URL + "/cardLog/message", {
      token: token,
      ...params
    });
  },
  postMessage(params) {
    return requests.post(AUTH_URL + "/rocketChat/postMessage", {
      token: token,
      ...params
    });
  }
};
export default {
  AUTH_URL,
  auth,
  contact,
  card,
  group,
  search,
  role,
  task,
  message,
  setToken: _token => {
    token = _token;
  }
};
