import moment from 'moment';
const filter = {
  defaultPerson: (value) => {
    //0男,1女
    return value && value.avatar && value.avatar != ''
      ? value.avatar.indexOf('?imageMogr2') == -1
        ? value.avatar + '?imageMogr2/auto-orient/thumbnail/50x50/format/jpg'
        : value.avatar
      : value.gender && value.gender == 1
      ? require('../assets/woman.png')
      : require('../assets/man.png');
  },
  defaultHuman: (value) => {
    //0男,1女
    return value && value.executorAvatar
      ? value.executorAvatar
      : require('../assets/man.png');
  },
  defaultGroup: (value) => {
    // console.log("group",value ? value : require('../assets/defaultGroup.png'));
    return value ? value : require('../assets/defaultGroup.png');
  },
  defaultMessageTime: (value) => {
    // return value?value:require("../assets/defaultGroup.png")
    return moment(value).format('MM/DD HH:mm');
  },
  defaultTime: (value) => {
    // return value?value:require("../assets/defaultGroup.png")
    return moment(value).format('YYYY/MM/DD HH:mm:ss');
  },
  defaultNumber: (value) => {
    // return value?value:require("../assets/defaultGroup.png")
    return value ? value : 0;
  },
  defaultGroupName: (value) => {
    // return value?value:require("../assets/defaultGroup.png")
    return value.groupName
      ? value.groupName.indexOf('的主群') != -1
        ? value.groupName.split('_')[0].replace('的主群', '私有群')
        : value.groupName
      : null;
  },
  defaultLogo: (value) => {
    // return value?value:require("../assets/defaultGroup.png")
    return value.groupName
      ? value.groupName.indexOf('的主群') != -1
        ? value.executorAvatar
        : value.groupLogo
        ? value.groupLogo
        : require('../assets/defaultGroup.png')
      : null;
  },
  ellipsisTitle: (value) => {
    return value && value.length > 10 ? value.substring(0, 8) + '...' : value;
  },
  taskTypeLength: (value) => {
    let len = 0;
    value.forEach((item) => {
      if (item.show) {
        len++;
      }
    });
    return len;
  },
};
export default filter;
