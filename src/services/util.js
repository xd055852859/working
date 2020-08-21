const util = {
  // 判断当前是否是手机端
  isMobile() {
    return /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent);
  },
  isPromise(v) {
    return v && typeof v.then === "function";
  },
  // 获取url参数
  getQueryString(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    let r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
  }
};

export default util;
