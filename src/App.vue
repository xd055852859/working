<template>
  <a-locale-provider :locale="locale">
    <div id="app">
      <router-view></router-view>
      <Loading v-if="loading" />
    </div>
  </a-locale-provider>
</template>

<script>
import Vue from "vue";
import zhCN from "ant-design-vue/lib/locale-provider/zh_CN";
import Loading from "./components/common/Loading";
import util from "./services/util";
import { mapState, mapActions } from "vuex";
import { LocaleProvider } from "ant-design-vue";
import "./common/font/font.css";
export default {
  name: "app",
  components: { Loading },
  computed: mapState({
    loading: (state) => state.common.loading,
    error: (state) => state.common.error,
    authError: (state) => state.auth.error,
    user: (state) => state.auth.user,
    deviceState: (state) => state.common.deviceState,
    deviceWidth: (state) => state.common.deviceWidth,
  }),
  data() {
    return {
      locale: zhCN,
    };
  },
  beforeMount() {
    let that = this;
    if (document.body.clientWidth < 1000) {
      this.changeDeviceState("phone");
    }
    this.changeDeviceWidth(document.body.clientWidth);
    if (util.isMobile()) {
      this.changeDeviceState("mobile");
    }
    window.onresize = this._.debounce(function () {
      // 定义窗口大小变更通知事件
      if (document.body.clientWidth < 1000) {
        that.changeDeviceState("phone");
      } else {
        that.changeDeviceState("computer");
      } //窗口宽度
      that.changeDeviceWidth(document.body.clientWidth);
    }, 1000);

    const token = util.getQueryString("token")
      ? util.getQueryString("token")
      : localStorage.getItem("token");
    //默认加入
    const inviteKey = util.getQueryString("group");
    if (inviteKey) {
      localStorage.setItem("inviteKey", inviteKey);
    }
    //分享卡片

    const shareKey = util.getQueryString("card");

    if (shareKey) {
      localStorage.setItem("shareKey", shareKey);
    }
    //通过uuId

    const groupUUId = util.getQueryString("groupUUId");
    console.log("groupUUId", groupUUId);
    if (groupUUId) {
      localStorage.setItem("groupUUId", groupUUId);
    }
    const appName = util.getQueryString("appName");
    if (appName) {
      localStorage.clear();
    }
    if (!token) {
      this.$router.push("/bootpage");
      // this.$router.push("/user/login");
    } else {
      let obj = { token };
      if (appName) {
        obj.appName = appName;
      }
      this.getUserByToken(obj);
    }
  },
  mounted() {
    let url = window.location.href;
    // 自动切换为https
    if (url.indexOf("http://localhost") == -1 && url.indexOf("https") < 0) {
      url = url.replace("http:", "https:");
      window.location.replace(url);
    }
    this.$nextTick(() => {
      Array.from(document.querySelectorAll("svg")).forEach((item) => {
        if (item.parentElement.parentElement.style.width) {
          item.parentElement.parentElement.style.display = "none";
        }
      });
    });
    // if (localStorage.getItem("token")) {
    //   this.$router.push("/");
    // }
  },
  // created: function() {
  //   //在页面加载时读取sessionStorage里的状态信息
  //   localStorage.getItem("userState") &&
  //     this.$store.replaceState(
  //       Object.assign(
  //         this.$store.state,
  //         JSON.parse(localStorage.getItem("userState"))
  //       )
  //     );

  //   //在页面刷新时将vuex里的信息保存到sessionStorage里
  //   window.addEventListener("beforeunload", () => {
  //     localStorage.setItem("userState", JSON.stringify(this.$store.state));
  //   });
  // },
  methods: {
    ...mapActions("common", [
      "clearError",
      "setFullState",
      "changeDeviceState",
      "changeDeviceWidth",
    ]),
    ...mapActions("auth", [
      "getUserByToken",
      "setTargetUserInfo",
      "getUptoken",
      "createMainGroup",
      "getTheme",
    ]),
    ...mapActions("group", [
      "setGroupKey",
      "setInviteKey",
      "setGroupJoinType",
      "setGroupHasPassword",
      "setGroupPassword",
    ]),
  },
  watch: {
    error(newVal) {
      if (newVal) {
        this.$message.info(newVal.msg);
        this.clearError();
        if (newVal.statusCode === "701") {
          // 登录过期，跳转到登录页
          // this.$router.push("/bootpage");
          // localStorage.clear();
          const redirect = `${window.location.protocol}//${window.location.host}`;
          window.location.href = `https://account.qingtime.cn?apphigh=27&redirect=${redirect}&logo=https://working.vip/page/logo2.svg`;
        }
      }
    },
    authError(newVal) {
      if (newVal) {
        this.$message.info(newVal.msg);
        this.clearError();
        if (newVal.statusCode === "701") {
          // 登录过期，跳转到登录页
          // this.$router.push("/user/login");
          // this.$router.push("/bootpage");
          // localStorage.clear();
          const redirect = `${window.location.protocol}//${window.location.host}`;
          window.location.href = `https://account.qingtime.cn?apphigh=27&redirect=${redirect}&logo=https://working.vip/page/logo2.svg`;
        }
      }
    },
    user(newVal, oldVal) {
      if (oldVal === null && newVal) {
        this.createMainGroup(localStorage.getItem("token"));
        this.getUptoken();
        this.setTargetUserInfo({
          ...newVal.profile,
          userId: newVal._key,
        });
        if (
          localStorage.getItem("token") &&
          !localStorage.getItem("shareKey") &&
          !localStorage.getItem("inviteKey")
        ) {
          this.$router.push("/");
        }
        this.getTheme();
      }
    },
    // // 监听路由变换
    // $route(to) {
    //   // 挑战到以下路由时，如果未登录，跳转到登录页
    //   if (to.fullPath === "/site") {
    //     this.setFullState(1);
    //   } else if (to.fullPath === "/UserHome") {
    //     this.setFullState(2);
    //   } else {
    //     this.setFullState(0);
    //   }
    // }
  },
};
</script>

<style lang="scss">
@import "./common/common.css";
@import "./common/style/button.scss";
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
  display: flex;
}

*:not(input):not(textarea) {
  user-select: none;
  outline: none;
}

/* 滚动条 */
*::-webkit-scrollbar {
  width: 3px;
}
*::-webkit-scrollbar-thumb {
  background: #dedede;
  border-radius: 100px;
}
.contact-icon {
  width: 30px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  background: #f6f6f6;
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.34);
  border-top-right-radius: 18px;
  border-bottom-right-radius: 18px;
  /* border-right: 0px solid transparent; */
  border-left: 0px solid transparent;
  position: absolute;
  top: 0px;
  left: 300px;
  z-index: 5;
}
.upload-img {
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  z-index: 3;
  opacity: 0;
}
</style>
