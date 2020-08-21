<template>
  <div class="user-home-content" @click.stop  :style="deviceState=='phone'?{width:'100%',height:'95%'}:null">
    <a-icon
      type="close"
      class="user-close"
    :style="deviceState=='phone'?{top:'8%',right:'8%'}:null"
      @click.stop="changeHeaderIndex(0)"
    />
    <div class="user-title">
      <div>头像</div>
      <div>个性签名</div>
    </div>
    <div class="user-textarea">
      <div class="user-avatar">
        <input
          type="file"
          accept="image/*"
          @change="
                e => {
                  uploadImg(e);
                }
              "
          class="upload-img"
        />
        <img :src="avatar" alt />
      </div>
      <a-textarea placeholder="请输入个性签名" :rows="4" v-model="slogan" />
    </div>
    <div class="user-title">
      <div>姓名</div>
      <div>用户名</div>
    </div>
    <div class="user-input">
      <a-input placeholder="请输入姓名" v-model="trueName" />
      <a-input placeholder="请输入用户名" v-model="nickName" />
    </div>
    <div class="user-title">
      <div>性别</div>
      <div>生日</div>
    </div>
    <div class="user-input">
      <a-radio-group @change="onChange" v-model="gender">
        <a-radio-button :value="0">男</a-radio-button>
        <a-radio-button :value="1">女</a-radio-button>
      </a-radio-group>
      <a-date-picker @change="onChange" v-model="birthday" />
    </div>
    <div class="user-title">
      <div>电子邮箱</div>
      <div>手机</div>
    </div>
    <div class="user-input">
      <a-input placeholder="请输入电子邮箱" v-model="email" />
      <a-input placeholder="请输入手机号码" v-model="mobile" disabled />
    </div>
    <div class="user-input">
      <a-button
        type="primary"
        class="user-button"
        @click="
              updateUserInfo({
                chatAuthToken: user.rocketChat.authToken,
                chatUserId: user.rocketChat.userId,
                userInfo: {
                  avatar: avatar,
                  slogan: slogan,
                  trueName: trueName,
                  nickName: nickName,
                  gender: gender,
                  birthday: birthday.valueOf(),
                  email: email
                }
              })
            "
      >保存修改</a-button>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Vue from "vue";
import Header from "../header/Header";
import uploadFile from "../../common/js/upload";

// moment('2015-06-06', dateFormat)
export default {
  name: "UserHome",
  components: {
    Header
  },
  data() {
    return {
      avatar: "",
      slogan: "",
      trueName: "",
      nickName: "",
      gender: 0,
      birthday: this.$moment(),
      email: "",
      mobile: ""
    };
  },
  computed: mapState({
    user: state => state.auth.user,
    uptoken: state => state.auth.uptoken,
    deviceState: state => state.common.deviceState,
    deviceWidth: state => state.common.deviceWidth
  }),
  mounted() {
    // console.log( this.$moment("2015-06-06", "YYYY-MM-DD"));
    if (this.user) {
      this.getData(this.user);
    }
    this.getUptoken(localStorage.getItem("token"));
  },
  methods: {
    ...mapActions("common", ["changeHeaderIndex"]),
    ...mapActions("auth", ["getUptoken", "updateUserInfo"]),
    onChange() {},
    getData(user) {
      let profile = user.profile;
      this.avatar = profile.avatar;
      this.slogan = profile.slogan;
      this.trueName = profile.trueName;
      this.nickName = profile.nickName;
      this.gender = profile.gender;
      this.birthday = this.$moment(
        this.$moment(profile.birthday).format("YYYY-MM-DD"),
        "YYYY-MM-DD"
      );
      this.email = profile.email;
      this.mobile = this.user.mobile;
    },
    uploadImg(e) {
      let mimeType = ["image/png", "image/jpeg"];
      let item = {};
      let that = this;
      let file = e.target.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function(theFile) {
        let image = new Image();
        image.src = theFile.target.result;
        image.onload = function() {
          uploadFile.uploadImg(file, that.uptoken, mimeType, function(url) {
            that.avatar = url;
          });
        };
      };
    },
    toContact() {
      this.$router.push("/").catch(data => {});
    }
  },
  watch: {
    user(newVal, oldVal) {
      if (oldVal == null && newVal != oldVal) {
        this.getData(newVal);
        this.getUptoken();
      }
    }
  }
};
</script>

<style>
.user-close {
  position: absolute;
  top: 10%;
  right: 18%;
  font-size:20px;
}
.user-home-content {
  width: 70%;
  height: 90%;
  background-color: #fff;
  padding: 48px 38px;
  box-sizing: border-box;
}
.user-title,
.user-input,
.user-textarea {
  width: 100%;
  height: 42px;
  line-height: 42px;
  font-size: 14px;
  color: #23384b;
  display: flex;
  justify-content: space-between;
}
.user-input {
  margin-bottom: 20px;
}
.user-textarea {
  height: 120px;
}
.user-title > div,
.user-input > *,
.user-textarea > * {
  width: 45%;
}
.user-textarea .user-avatar {
  width: 120px;
  height: 120px;
  border: 1px solid #d1d2d8;
  overflow: hidden;
  position: relative;
}
.user-textarea .user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.user-input .ant-input {
  height: 42px !important;
}
.user-button {
  width: 114px;
  height: 39px;
  background: #1aca8e;
  border: 1px solid #1aca8e;
  border-radius: 6px;
  margin-top: 10px;
}
</style>
