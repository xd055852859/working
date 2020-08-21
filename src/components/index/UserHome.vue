<template>
  <div
    class="user-home-content"
    @click.stop
    :style="deviceState=='phone'||deviceState=='mobile'?{width:'100%',height:'95%'}:null"
  >
    <!-- <a-icon
      type="close"
      class="user-close"
      :style="deviceState=='phone'||deviceState=='mobile'?{top:'8%',right:'8%'}:null"
      @click.stop="changeHeaderIndex(0)"
    />-->
    <div class="user-home-avatar">
      <div>头像</div>
      <div class="user-home-avatar-img">
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
    </div>

    <div class="user-input">
      <div>昵称</div>
      <a-input placeholder="请输入昵称" v-model="nickName" />
    </div>
    <div class="user-input">
      <div>电子邮箱</div>
      <a-input placeholder="请输入电子邮箱" v-model="email" />
    </div>
    <div class="user-input">
      <div>个性签名</div>
      <a-textarea placeholder="请输入个性签名" :rows="4" v-model="slogan" />
    </div>
    <div class="user-input">
      <div>姓名</div>
      <a-input placeholder="请输入姓名" v-model="trueName" />
    </div>
    <div class="user-input">
      <div>生日</div>
      <div :style="{width:'100%'}">
        <a-date-picker @change="onChange" v-model="birthday" />
      </div>
    </div>
    <div class="user-button-info">
      <a-button type="primary" class="user-button" @click="saveuserInfo">保存</a-button>
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
    Header,
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
      mobile: "",
    };
  },
  computed: mapState({
    user: (state) => state.auth.user,
    uptoken: (state) => state.auth.uptoken,
    deviceState: (state) => state.common.deviceState,
    deviceWidth: (state) => state.common.deviceWidth,
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
    ...mapActions("auth", ["getUptoken", "updateUserInfo", "updateAccount"]),
    onChange(date, dateString) {
      this.birthday = date;
    },
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
    saveuserInfo() {
      this.updateAccount({
        profile: {
          avatar: this.avatar,
          slogan: this.slogan,
          trueName: this.trueName,
          nickName: this.nickName,
          birthday: this.$moment(this.birthday).valueOf(),
          email: this.email,
        },
      });
      this.changeHeaderIndex(14);
    },
    uploadImg(e) {
      let mimeType = ["image/png", "image/jpeg"];
      let item = {};
      let that = this;
      let file = e.target.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function (theFile) {
        let image = new Image();
        image.src = theFile.target.result;
        image.onload = function () {
          uploadFile.uploadImg(file, that.uptoken, mimeType, function (url) {
            that.avatar = url;
          });
        };
      };
    },
    toContact() {
      this.$router.push("/").catch((data) => {});
    },
  },
  watch: {
    user(newVal, oldVal) {
      if (oldVal == null && newVal != oldVal) {
        this.getData(newVal);
        this.getUptoken();
      }
    },
  },
};
</script>

<style>
.user-close {
  position: absolute;
  top: 10%;
  right: 18%;
  font-size: 20px;
}
.user-home-content {
  width: 70%;
  height: 90%;
  background-color: #fff;
  padding: 9px 15px 0px 15px;
  box-sizing: border-box;
}
.user-home-avatar {
  font-size: 12px;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.user-home-avatar-img,
.upload-img {
  width: 86px;
  height: 86px;
  overflow: hidden;
  border-radius: 50%;
  margin-left: 15px;
  cursor: pointer;
}
.upload-img {
  width: 100%;
}
.user-home-avatar-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.user-input,
.user-textarea {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  font-size: 12px;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
}
.user-input {
  margin-bottom: 20px;
}
.user-input > div {
  margin-bottom: 10px;
}
/* .user-textarea {
  height: 120px;
} */
/* .user-title > div,
.user-input > *,
.user-textarea > * {
  width: 45%;
} */
/* .user-textarea .user-avatar {
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
} */
.user-button-info {
  display: flex;
  justify-content: center;
  align-items: center;
}
.user-button {
  width: 114px;
  height: 39px;
  background: #86b93f;
  border: 1px solid #86b93f;
  border-radius: 6px;
  margin-top: 10px;
}
.user-button:hover {
  background: #86b93f;
}
</style>
