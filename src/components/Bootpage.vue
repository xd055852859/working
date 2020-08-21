<template>
  <div class="bootpage" id="bootpage">
    <div class="bootpage-logo">
      <SvgIcon :iconSvg="logoSvg" fontSize="80px" />
      <a href="https://bbs.working.vip">雁行官网</a>
    </div>
    <div class="bootpage-content" :style="!videoState?{width:'90%',marginLeft:'6%'}:null">
      <div class="bootpage-image">
        <img :src="bootpage" alt />
      </div>
      <div class="bootpage-title">
        <img :src="boottitle" alt />
      </div>
      <div
        class="bootpage-button"
        @click="toLogin"
        :style="!videoState?{marginTop:'30px'}:null"
      >开始工作</div>
    </div>
    <div class="bootpage-video" v-show="videoState" :style="{width:videoWidth}">
      <video id="myVideo">
        <source :src="bootvideo" type="video/mp4" />
      </video>
    </div>
    <div
      @click="toUrl"
      class="bootpage-footer"
      :style="!videoState?{marginLeft:'-6%',marginBottom:'10px',fontSize: '14px'}:null"
    >©2019 江苏时光信息科技有限公司 Qingtime All Rights Reserved 苏ICP备15006448号</div>
  </div>
</template>

<script>
import SvgIcon from "./common/SvgIcon";
import LogoSvg0 from "./common/svg/logo2.svg";
import { mapState, mapActions } from "vuex";
import util from "../services/util";
export default {
  name: "Bootpage",
  components: { SvgIcon },
  data() {
    return {
      logoSvg: LogoSvg0,
      bootpage: require("@/assets/bootpage.png"),
      boottitle: require("@/assets/boottitle.png"),
      bootvideo: "https://cdn-icare.qingtime.cn/714228E0.mp4",
      videoState: true,
      videoWidth: "760px",
      videoHiehgt: 0
    };
  },
  computed: mapState({
    deviceState: state => state.common.deviceState
  }),
  beforeMount() {
    // let that = this;
    if (document.body.clientWidth < 900) {
      this.videoState = false;
    }
    window.onresize = this._.debounce(function() {
      //   // 定义窗口大小变更通知事件
      //   if (document.body.clientWidth < 1200) {
      //     that.videoWidth = "60%";
      //   } else {
      //     that.videoWidth = "50%";
      //   }
      if (document.documentElement.clientWidth < 900) {
        that.videoState = false;
      } else {
        that.videoState = true;
      } //窗口宽度
      document.querySelector("#myVideo video").style.height =
        document.querySelector("#bootpage").offsetHeight + "px";
    }, 1000);
  },
  mounted() {
    this.initVideo();
    document.querySelector("#myVideo video").style.height =
      document.querySelector("#bootpage").offsetHeight + "px";
  },
  methods: {
    ...mapActions("common", ["changeDeviceState"]),
    initVideo() {
      let myPlayer = this.$video(myVideo, {
        //确定播放器是否具有用户可以与之交互的控件。没有控件，启动视频播放的唯一方法是使用autoplay属性或通过Player API。
        controls: false,
        //自动播放属性,muted:静音播放
        autoplay: "muted",
        //建议浏览器是否应在<video>加载元素后立即开始下载视频数据。
        preload: "auto",
        //设置视频播放器的显示宽度（以像素为单位）
        width: "80%",
        //设置视频播放器的显示高度（以像素为单位）
        height: "100%",
        loop: "loop"
      });
    },
    toLogin() {
      // this.$router.push("/user/login");
      // window.open()
      // https://account.qingtime.cn/?apphigh=27&redirect=https://working.qingtime.cn
      if (localStorage.getItem("token")) {
        window.location.href =
          `https://www.working.vip/?token=` + localStorage.getItem("token");
      } else {
        const redirect = `${window.location.protocol}//${window.location.host}`;
        window.location.href = `https://account.qingtime.cn?apphigh=27&redirect=${redirect}&logo=https://working.vip/page/logo2.svg`;
        localStorage.clear();
      }
    },
    toUrl() {
      window.open("http://www.beian.miit.gov.cn/");
    }
  }
};
</script>

<style scoped>
.bootpage {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: space-between;
}
.bootpage-logo {
  position: absolute;
  top: 2.4%;
  left: 4%;
  display: flex;
  align-items: center;
}
.bootpage-logo a {
  color: #cacad9;
  font-size: 18px;
}

.bootpage-content {
  width: 35%;
  height: 100%;
  margin-left: 12%;
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  text-align: center;
  position: relative;
}
.bootpage-image {
  width: 100%;
  margin-bottom: 2.2%;
}
.bootpage-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.bootpage-title {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 3.7%;
}
.bootpage-title img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.bootpage-button {
  width: 200px;
  height: 60px;
  line-height: 60px;
  text-align: center;
  font-size: 18px;
  color: #ffffff;
  background-color: #1aca8e;
  border-radius: 30px;
}
.bootpage-video {
  /* height: 100%; */
  position: fixed;
  width: 760px;
  height: 100%;
  top: 0px;
  right: -420px;
  overflow: hidden;
  border-radius: 50%;
  box-shadow: -11px 0 0 50px hsla(0, 0%, 100%, 0.09),
    -3px 0 0 20px hsla(0, 0%, 100%, 0.13), 0 0 0 9px hsla(0, 0%, 100%, 0.09),
    9px 9px 50px 20px rgba(95, 95, 132, 0.88),
    -102px 110px 100px 17px rgba(44, 44, 75, 0.3);
}
.bootpage-video video {
  /* border-radius: 50%; */
  /* box-shadow: -11px 0 0 50px hsla(0, 0%, 100%, 0.09),
    -3px 0 0 20px hsla(0, 0%, 100%, 0.13), 0 0 0 9px hsla(0, 0%, 100%, 0.09),
    9px 9px 50px 20px rgba(95, 95, 132, 0.88),
    -102px 110px 100px 17px rgba(44, 44, 75, 0.3); */
  margin-left: -250%;
}
.bootpage-footer {
  width: 100%;
  height: 22px;
  font-size: 16px;
  color: #cacad9;
  position: fixed;
  left: 12.2%;
  bottom: 3.6%;
}
</style>