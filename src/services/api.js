import { AUTH_URL, CHAT_API_URL, HOME_URL } from './global';
import util from './util';
import axios from 'axios';
// let token =localStorage.getItem('token')?localStorage.getItem('token'):null;
let token = null;

//防止重复请求
//正在进行中的请求列表
let reqList = [];
const stopRepeatRequest = (reqList, url, cancel, errorMessage) => {
  const errorMsg = errorMessage || '';
  for (let i = 0; i < reqList.length; i++) {
    if (reqList[i] === url) {
      cancel(errorMsg);
      return;
    }
  }
  reqList.push(url);
};

//允许某个请求可以继续进行
const allowRequest = (reqList, url) => {
  for (let i = 0; i < reqList.length; i++) {
    reqList.splice(i, 1);
    break;
  }
};

const service = axios.create();

//请求拦截器
service.interceptors.request.use(
  (config) => {
    let cancel;
    //设置cancelToken对象
    config.cancelToken = new axios.CancelToken(function(c) {
      cancel = c;
    });
    //阻止重复请求。当上个请求未完成时，相同的请求不会进行
    stopRepeatRequest(reqList, config.url, cancel, `${config.url} 请求被中断`);
    return config;
  },
  (err) => Promise.reject(err)
);

//响应拦截器
service.interceptors.response.use((response) => {
  //增加延迟，相同请求不得在短时间内重复发送
  setTimeout(() => {
    allowRequest(reqList, response.config.url);
  }, 1000);
});

const requests = {
  // get(url, params, headers) {
  //   var i = 0;
  //   for (let index in params) {
  //     if (i === 0) {
  //       url = url + "?" + index + "=" + encodeURIComponent(params[index]);
  //     } else {
  //       url = url + "&" + index + "=" + encodeURIComponent(params[index]);
  //     }
  //     i++;
  //   }
  //   return new Promise(async function(resolve, reject) {
  //     try {
  //       let result = await fetch(url, {
  //         headers: headers || {},
  //         method: "GET"
  //       });
  //       const json = await result.json();
  //       resolve(json);
  //     } catch (e) {
  //       reject(e);
  //     }
  //   });
  // },
  // post: (url, params) => {
  //   return new Promise(async function(resolve, reject) {
  //     try {
  //       let result = await fetch(url, {
  //         method: "POST",
  //         body: JSON.stringify(params),
  //         headers: {
  //           "Content-Type": "application/json"
  //         }
  //       });
  //       const json = await result.json();
  //       resolve(json);
  //     } catch (e) {
  //       reject(e);
  //     }
  //   });
  // },
  // // post方法（multipart/form-data）
  // postForm(url, data) {
  //   return new Promise(async function(resolve, reject) {
  //     try {
  //       let result = await fetch(url, {
  //         method: "POST",
  //         body: data
  //       });
  //       const json = await result.json();
  //       resolve(json);
  //     } catch (e) {
  //       reject(e);
  //     }
  //   });
  // },
  // patch: (url, params) => {
  //   return new Promise(async function(resolve, reject) {
  //     try {
  //       let result = await fetch(url, {
  //         method: "PATCH",
  //         body: JSON.stringify(params),
  //         headers: {
  //           "Content-Type": "application/json"
  //         }
  //       });
  //       const json = await result.json();
  //       resolve(json);
  //     } catch (e) {
  //       reject(e);
  //     }
  //   });
  // },
  // delete: (url, params) => {
  //   return new Promise(async function(resolve, reject) {
  //     try {
  //       let result = await fetch(url, {
  //         method: "DELETE",
  //         body: JSON.stringify(params),
  //         headers: {
  //           "Content-Type": "application/json"
  //         }
  //       });
  //       const json = await result.json();
  //       resolve(json);
  //     } catch (e) {
  //       reject(e);
  //     }
  //   });
  // }
  get: (url, params) => {
    // todo ping
    return new Promise((resolve, reject) => {
      axios
        .get(url, {
          params,
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  },
  post: (url, params) => {
    return new Promise((resolve, reject) => {
      axios
        .post(url, params)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  },
  patch: (url, params) => {
    return new Promise(async function(resolve, reject) {
      axios
        .patch(url, params)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  },
  delete: (url, params) => {
    return new Promise(async function(resolve, reject) {
      axios
        .delete(url, {
          data: params,
          // paramsSerializer: params => {
          //   return qs.stringify(params, { indices: false })
          // }
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  },
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
      deviceModel: isMobile ? 'mobile' : 'web',
      appHigh: 27,
    };
    return requests.get(AUTH_URL + '/account', param);
  },

  // 获取七牛云uptoken
  getUptoken() {
    return requests.get(HOME_URL + '/upTokenQiniu/getQiNiuUpToken', {
      token: token,
      type: 2,
    });
  },

  getToken() {
    return token;
  },

  // 获取登录用户信息
  getUserFullInfo(params) {
    return requests.get(AUTH_URL + '/account/userinfo', {
      ...params,
    });
  },

  //创建主群
  createMainGroup(token) {
    return requests.patch(HOME_URL + '/group/createMainGroup', {
      token: token,
    });
  },
  getTargetUserInfo(params) {
    return requests.get(HOME_URL + '/account/targetUserInfo', {
      token: token,
      ...params,
    });
  },
  updateUser(chatAuthToken, chatUserId, userInfo) {
    return requests.post(CHAT_API_URL + '/users/users.update', {
      token: token,
      authToken: chatAuthToken,
      userId: chatUserId,
      userInfo: userInfo,
    });
  },
  updateAccount(params) {
    return requests.patch(AUTH_URL + '/account', {
      token: token,
      ...params,
    });
  },
  getWorkingConfigInfo() {
    return requests.post(HOME_URL + '/account/getWorkingConfigInfo', {
      token: token,
    });
  },
  setWorkingConfigInfo(params) {
    return requests.post(HOME_URL + '/account/setWorkingConfigInfo', {
      token: token,
      ...params,
    });
  },
  getCountDownData() {
    return requests.post(HOME_URL + '/account/getCountDownData', {
      token: token,
    });
  },
  setCountDownData(params) {
    return requests.post(HOME_URL + '/account/setCountDownData', {
      token: token,
      ...params,
    });
  },

  loginRocket(username, mobile) {
    return requests.post('https://chat.qingtime.cn/api/v1/login', {
      username: username,
      password: mobile,
    });
  },
  getIdeaList(params) {
    return requests.post(HOME_URL + '/inspirationBox/list', {
      token: token,
      ...params,
    });
  },
  addIdea(params) {
    return requests.post(HOME_URL + '/inspirationBox/add', {
      token: token,
      ...params,
    });
  },
  editIdea(params) {
    return requests.post(HOME_URL + '/inspirationBox/update', {
      token: token,
      ...params,
    });
  },
  deleteIdea(params) {
    return requests.post(HOME_URL + '/inspirationBox/delete', {
      token: token,
      ...params,
    });
  },
  getDiaryList(params) {
    return requests.post(HOME_URL + '/card/clockInList', {
      token: token,
      ...params,
    });
  },
  weekEnergy(params) {
    return requests.post(HOME_URL + '/card/weekEnergy', {
      token: token,
      ...params,
    });
  },
  monthEnergy(params) {
    return requests.post(HOME_URL + '/card/monthEnergy', {
      token: token,
      ...params,
    });
  },
  monthEnergyWeb(params) {
    return requests.post(HOME_URL + '/card/monthEnergyWeb', {
      token: token,
      ...params,
    });
  },
  getUserLog(params) {
    return requests.post(HOME_URL + '/cardLog/getUserLog', {
      token: token,
      isFilter: 1,
      ...params,
    });
  },
  getGroupLog(params) {
    return requests.post(HOME_URL + '/cardLog/getGroupLog', {
      token: token,
      isFilter: 1,
      ...params,
    });
  },
};

const contact = {
  /**
   * 获取联系人列表
   */
  getContacts() {
    return requests.get(AUTH_URL + '/friend', {
      token: token,
    });
  },
  /**
   * 获取群组列表
   */
  getGroups() {
    return requests.get(AUTH_URL + '/group/groupList', {
      token: token,
    });
  },
};

const card = {
  createCard(params) {
    return requests.post(HOME_URL + '/card', {
      token: token,
      ...params,
    });
  },
  //编辑卡片
  editCard(params) {
    return requests.patch(HOME_URL + '/card', {
      token: token,
      ...params,
    });
  },
  //获取卡片列表
  getCardList(params) {
    return requests.get(HOME_URL + '/card/listBoard', {
      token: token,
      ...params,
    });
  },
  //删除卡片
  deleteCard(params) {
    return requests.delete(HOME_URL + '/card', {
      token: token,
      type: 2,
      ...params,
    });
  },
  //获取卡片内容
  getCardDetail(params) {
    return requests.get(HOME_URL + '/card/cardDetail', {
      token: token,
      ...params,
    });
  },
  //获取卡片@列表
  getFollowCardList(params) {
    return requests.get(HOME_URL + '/followCard/list', {
      token: token,
      ...params,
    });
  },
  //保存跟踪者和执行者
  saveFollowPerson(params) {
    return requests.post(HOME_URL + '/followCard', {
      token: token,
      ...params,
    });
  },
  saveExecutorPerson(params) {
    return requests.patch(HOME_URL + '/card/setCardExecutor', {
      token: token,
      ...params,
    });
  },
  //卡片评论列表
  getCommentList(params) {
    return requests.get(HOME_URL + '/commentCard/list', {
      token: token,
      ...params,
    });
  },
  //增加卡片评论
  saveComment(params) {
    return requests.post(HOME_URL + '/commentCard', {
      token: token,
      ...params,
    });
  },
  //增加卡片评论
  deleteComment(params) {
    return requests.delete(HOME_URL + '/commentCard', {
      token: token,
      ...params,
    });
  },
  //卡片历史
  getCardHistory(params) {
    return requests.get(HOME_URL + '/cardLog/cardLogList', {
      token: token,
      ...params,
    });
  },
};
const task = {
  //任务列表
  getTaskList(params) {
    return requests.get(HOME_URL + '/card/listBoardTask', {
      token: token,
      ...params,
    });
  },
  createTaskLabel(params) {
    return requests.post(HOME_URL + '/card/addCardLabel', {
      token: token,
      ...params,
    });
  },
  changeTaskLabel(params) {
    return requests.patch(HOME_URL + '/card/setCardLabel', {
      token: token,
      ...params,
    });
  },
  deleteCardLabel(params) {
    return requests.post(HOME_URL + '/card/deleteCardLabel', {
      token: token,
      ...params,
    });
  },
  setCardLabel(params) {
    return requests.patch(HOME_URL + '/card/setLabelProperty', {
      token: token,
      ...params,
    });
  },
  //批量导入任务
  batchCard(params) {
    return requests.post(HOME_URL + '/card/batchQuickCreateCard', {
      token: token,
      ...params,
    });
  },
  //批量归档
  batchCardArray(params) {
    return requests.patch(HOME_URL + '/card/fileCard', {
      token: token,
      ...params,
    });
  },
  //修改任务顺序
  setLabelCardOrder(params) {
    return requests.patch(HOME_URL + '/card/setLabelCardOrder', {
      token: token,
      ...params,
    });
  },
  //设置默认执行者
  setLabelOrGroupExecutorKey(params) {
    return requests.post(HOME_URL + '/card/setLabelOrGroupExecutorKey', {
      token: token,
      ...params,
    });
  },
  setGroupLabelOrder(params) {
    return requests.post(HOME_URL + '/card/setGroupLabelOrder', {
      token: token,
      ...params,
    });
  },
  getCountDownTask(params) {
    return requests.post(HOME_URL + '/card/getCountDownTask', {
      token: token,
      ...params,
    });
  },
  allGroupTask(params) {
    return requests.post(HOME_URL + '/card/allGroupTask', {
      token: token,
      ...params,
    });
  },
  allGridGroupTask(params) {
    return requests.post(HOME_URL + '/card/allGroupTaskFS', {
      token: token,
      ...params,
    });
  },
  getTeamCareTask(params) {
    return requests.post(HOME_URL + '/card/getTeamCareTask', {
      token: token,
      ...params,
    });
  },
  getProjectCareTask(params) {
    return requests.post(HOME_URL + '/card/getProjectCareTask', {
      token: token,
      ...params,
    });
  },
  //打卡
  clockIn(params) {
    return requests.post(HOME_URL + '/card/clockIn', {
      token: token,
      ...params,
    });
  },
  //获取随记
  getNote(params) {
    return requests.post(HOME_URL + '/card/getNote', {
      token: token,
      ...params,
    });
  },
  //获取随记
  setNote(params) {
    return requests.post(HOME_URL + '/card/setNote', {
      token: token,
      ...params,
    });
  },
  //点赞数
  likeClockIn(params) {
    return requests.post(HOME_URL + '/card/likeClockIn', {
      token: token,
      ...params,
    });
  },
};
const group = {
  createGroup(params) {
    return requests.post(HOME_URL + '/group', {
      token: token,
      ...params,
    });
  },
  //获取群组列表
  getGroupList(params) {
    return requests.get(HOME_URL + '/group/groupList', {
      token: token,
      ...params,
    });
  },
  //获取群信息
  getGroupInfo(params) {
    return requests.get(HOME_URL + '/group', {
      token: token,
      ...params,
    });
  },
  //修改群消息
  changeGroupInfo(params) {
    return requests.patch(HOME_URL + '/group', {
      token: token,
      ...params,
    });
  },
  //解散群
  deleteGroup(params) {
    return requests.delete(HOME_URL + '/group', {
      token: token,
      ...params,
    });
  },
  //获取群成员
  getGroupMemberList(params) {
    return requests.get(HOME_URL + '/groupmember', {
      token: token,
      ...params,
    });
  },
  //通讯录搜索人或群
  getGroupContact(params) {
    return requests.get(HOME_URL + '/group/searchGroupOrUser', {
      token: token,
      ...params,
    });
  },
  //通过用户id查询主群key
  userKeyToGroupKey(params) {
    return requests.get(HOME_URL + '/group/targetUKeyMainGroup', {
      token: token,
      ...params,
    });
  },
  //添加群成员
  addGroupMember(params) {
    return requests.post(HOME_URL + '/groupmember', {
      token: token,
      ...params,
    });
  },
  //移除群成员
  removeGroupMember(params) {
    return requests.delete(HOME_URL + '/groupmember/remove', {
      token: token,
      ...params,
    });
  },
  //群成员退出群
  outGroup(params) {
    return requests.delete(HOME_URL + '/groupmember', {
      token: token,
      ...params,
    });
  },
  //申请加入群
  applyJoinGroup(params) {
    return requests.post(HOME_URL + '/group/applyJoinGroup', {
      token: token,
      ...params,
    });
  },
  //口令加入群
  passwordJoinGroup(params) {
    return requests.post(HOME_URL + '/groupmember/passwordJoinGroup', {
      token: token,
      ...params,
    });
  },
  applyJoinGroupList(params) {
    return requests.post(HOME_URL + '/group/applyJoinGroupList', {
      token: token,
      ...params,
    });
  },
  //移除群申请
  deleteApplyJoinGroup(params) {
    return requests.post(HOME_URL + '/group/deleteApplyJoinGroup', {
      token: token,
      ...params,
    });
  },
  dealCareFriendOrGroup(params) {
    return requests.post(HOME_URL + '/group/dealCareFriendOrGroup', {
      token: token,
      ...params,
    });
  },
  visitGroupOrFriend(params) {
    return requests.post(HOME_URL + '/group/visitGroupOrFriend', {
      token: token,
      ...params,
    });
  },
  //设置子群
  setSonGroup(params) {
    return requests.post(HOME_URL + '/group/setSonGroup', {
      token: token,
      ...params,
    });
  },
  //获取子群列表
  getSonGroupListMultilayer(params) {
    return requests.post(HOME_URL + '/group/getSonGroupListMultilayer', {
      token: token,
      ...params,
    });
  },
  getGroupInfoAccordingUUID(params) {
    return requests.post(HOME_URL + '/group/getGroupInfoAccordingUUID', {
      token: token,
      ...params,
    });
  },
  //打卡数据
  getGroupClockInInfo(params) {
    return requests.post(HOME_URL + '/card/getGroupClockInInfo', {
      token: token,
      ...params,
    });
  },
  deleteFSGroup(params) {
    return requests.post(HOME_URL + '/group/deleteFSGroup', {
      token: token,
      ...params,
    });
  },
};
const search = {
  getSearchList(params) {
    return requests.get(HOME_URL + '/group/searchGroupOrUser', {
      token: token,
      ...params,
    });
  },
  getCardSearch(params) {
    return requests.get(HOME_URL + '/card/searchCard', {
      token: token,
      ...params,
    });
  },
  searchUserNew(params) {
    return requests.post(HOME_URL + '/account/searchUserNew', {
      token: token,
      ...params,
    });
  },
  searchGroupNew(params) {
    return requests.post(HOME_URL + '/group/searchGroupNew', {
      token: token,
      ...params,
    });
  },
};
const role = {
  setRole(params) {
    return requests.patch(HOME_URL + '/groupmember/setRole', {
      token: token,
      ...params,
    });
  },
};
const message = {
  getMessageList(params) {
    return requests.get(HOME_URL + '/cardLog/cardMessageList', {
      token: token,
      ...params,
    });
  },
  readMessage(params) {
    return requests.patch(HOME_URL + '/cardLog/readMessage', {
      token: token,
      ...params,
    });
  },
  delMessage(params) {
    return requests.delete(HOME_URL + '/cardLog/message', {
      token: token,
      ...params,
    });
  },
  postMessage(params) {
    return requests.post(AUTH_URL + '/rocketChat/postMessage', {
      token: token,
      ...params,
    });
  },
  addClockInComment(params) {
    return requests.post(HOME_URL + '/card/addClockInComment', {
      token: token,
      ...params,
    });
  },
  getClockInCommentList(params) {
    return requests.post(HOME_URL + '/card/getClockInCommentList', {
      token: token,
      ...params,
    });
  },
  deleteClockInComment(params) {
    return requests.post(HOME_URL + '/card/deleteClockInComment ', {
      token: token,
      ...params,
    });
  },
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
  setToken: (_token) => {
    token = _token;
  },
};
