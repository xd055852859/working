import * as qiniu from "qiniu-js";
const uploadFile = {
  uploadImg: async (file, uptoken, mimeType, callback) => {
    //let res = await api.upload.getUptoken(window.localStorage.getItem("TOKEN"));
    console.log(uptoken);
    console.log(file);
    if (!uptoken || !file) {
      return;
    }

    const domain = "http://cdn-icare.qingtime.cn/";
    // if (file.size > 52428800) {
    //     message.error("文件过大,请重新选择");
    //     return;
    // }
    let putExtra = {
      // 文件原文件名
      fname: "",
      // 自定义变量
      params: {},
      // 限制上传文件类型
      mimeType: mimeType
    };
    let config = {
      useCdnDomain: true,
      disableStatisticsReport: false,
      retryCount: 5,
      region: qiniu.region.z0
    };
    let observer = {
      next(res) {},
      error(err) {
        alert(err.message);
      },
      complete(res) {
        // content = content.replace(/(data:image\/){1}(jpeg|gif|png){1}(;){1}.*?\"/, "http://cdn-icare.qingtime.cn/" + res.key + "\"");
        console.log("domain + res.key", domain + res.key);
        callback(domain + res.key);
        //return domain + res.key;
      }
    };
    // 上传
    let observable = qiniu.upload(
      file,
      new Date().getTime() + "_" + file.name,
      uptoken,
      putExtra,
      config
    );
    // 上传开始
    observable.subscribe(observer);
  },
  qiniuUpload(uptoken, target, file, isVideo) {
    let mimeType = ["image/png", "image/jpeg"];
    const domain = "http://cdn-icare.qingtime.cn/";
    let putExtra = {
      // 文件原文件名
      fname: "",
      // 自定义变量
      params: {},
      // 限制上传文件类型
      mimeType: mimeType
    };
    let config = {
      useCdnDomain: true,
      disableStatisticsReport: false,
      retryCount: 5,
      region: qiniu.region.z0
    };
    let observer = {
      next(res) {},
      error(err) {
        alert("上传失败！");
      },
      complete(res) {
        const url = domain + encodeURIComponent(res.key);
        if (isVideo) {
          target.innerHTML = `<video src="${url}" style="width: 600px;" controls="" class="fr-draggable">您的浏览器不支持 HTML5 视频。</video>`;
        } else {
          target.src = url;
        }
      }
    };
    // 上传
    let observable = qiniu.upload(
      file,
      `${this.guid(8, 16)}${
        file.name ? file.name.substr(file.name.lastIndexOf(".")) : ".jpg"
      }`,
      uptoken,
      putExtra,
      config
    );
    // 上传开始
    observable.subscribe(observer);
  },
  guid(len, radix) {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(
      ""
    );
    var uuid = [],
      i;
    radix = radix || chars.length;

    if (len) {
      // Compact form
      for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)];
    } else {
      // rfc4122, version 4 form
      var r;

      // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
      uuid[14] = "4";

      // Fill in random data.  At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | (Math.random() * 16);
          uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r];
        }
      }
    }
    return uuid.join("");
  }
};

export default uploadFile;
