<template>
  <div class="contact-dialog-content">
    <div class="contact-dialog-info">
      <div class="contact-dialog-container">
        <div class="contact-name-content">
          <div class="contact-name-title">群名</div>
          <a-input
            placeholder="请输入群名称"
            class="contact-dialog-name"
            :style="{width:'80%'}"
            :value="groupName"
            @change="setGroupName"
            :disabled="(groupRole>2||groupRole==0)&&groupState==1"
          />
        </div>
        <div class="contact-name-content" :style="{display:'flex',justifyContent:'space-between'}">
          <div :style="{display:'flex'}">
            <div class="contact-name-title">全平台可见</div>
            <a-checkbox
              :checked="isOpen"
              @change="changeOpen"
              :disabled="(groupRole>2||groupRole==0)&&groupState==1"
            />
          </div>
          <div :style="{display:'flex'}">
            <div class="contact-name-title">企业群</div>
            <a-checkbox
              :checked="enterprise"
              @change="changeEnterprise"
              :disabled="(groupRole>2||groupRole==0)&&groupState==1"
            />
          </div>
        </div>
        <div class="contact-name-content" :style="{display:'flex',justifyContent:'space-between'}">
          <div :style="{display:'flex'}">
            <div class="contact-name-title">统计子群活力值</div>
            <a-checkbox
              :checked="statisticsSonGroupEnergy"
              @change="changeSonGroupEnergy"
              :disabled="(groupRole>2||groupRole==0)&&groupState==1"
            />
          </div>
        </div>
        <div class="contact-name-content">
          <div class="contact-name-title">群简介</div>
          <a-input
            placeholder="请输入群描述"
            class="contact-dialog-desc"
            :style="{width:'80%'}"
            :value="groupDesc"
            @change="setGroupDesc"
            :disabled="(groupRole>2||groupRole==0)&&groupState==1"
          />
        </div>
        <div class="contact-name-content">
          <div class="contact-name-title">群特性</div>
          <a-radio-group
            :defaultValue="0"
            v-model="joinType"
            @change="changeJoinType"
            :disabled="(groupRole>2||groupRole==0)&&groupState==1"
          >
            <a-radio :value="0" name="joinType" v-if="!isHasPassword">开放加入</a-radio>
            <a-radio :value="1" name="joinType">管理员通过审核后加入</a-radio>
            <a-radio :value="2" name="joinType">管理员邀请加入</a-radio>
          </a-radio-group>
        </div>
        <div class="contact-name-content">
          <a-checkbox
            :checked="isHasPassword"
            :style="{marginRight:'10px'}"
            @change="changeIsPassword"
            :disabled="(groupRole>2||groupRole==0)&&groupState==1"
          />验证口令通过后加入
          <a-input
            placeholder="请输入口令"
            :value="password"
            :style="{width:'40%',marginLeft:'10px'}"
            :disabled="(groupRole>2||groupRole==0)&&groupState==1"
            @change="changePassword"
            v-if="isHasPassword"
          />
        </div>
        <div class="contact-name-content" v-if="groupState==1">
          <a-checkbox
            :checked="isLinkJoin"
            @change="changeJoin"
            :style="{marginRight:'10px'}"
            :disabled="(groupRole>2||groupRole==0)&&groupState==1"
          />邀请链接后加入
          <a-input
            placeholder="请输入链接"
            :value="'https://working.vip?groupId='+groupKey"
            :style="{width:'40%',marginLeft:'10px'}"
            :disabled="true"
          />
          <a-button
            type="primary"
            @click="openNotification"
            :style="{marginLeft:'10px'}"
            v-clipboard:copy="url"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError"
          >拷贝</a-button>
        </div>
        <div class="contact-name-content">
          <div class="contact-name-title">新成员默认权限</div>
          <a-select
            :value="defaultPower"
            @change="changeRole"
            :disabled="(groupRole>2||groupRole==0)&&groupState==1"
          >
            <a-select-option :value="2">管理员</a-select-option>
            <a-select-option :value="3">编辑</a-select-option>
            <a-select-option :value="4">作者</a-select-option>
            <a-select-option :value="5">群成员</a-select-option>
          </a-select>
        </div>
        <!-- <div class="contact-name-content">
          <div class="contact-name-title">消息提醒方式</div>
          <a-radio-group defaultValue="0" :disabled="(groupRole>2||groupRole==0)&&groupState==1">
            <a-radio value="0">语音提醒</a-radio>
            <a-radio value="1">消息提醒</a-radio>
            <a-radio value="2">静默(不更新排序)</a-radio>
          </a-radio-group>
        </div>-->
      </div>
      <div class="contact-dialog-logo">
        <a-icon type="plus" />
        <img :src="groupLogo|defaultGroup" v-if="groupLogo!=''" />
        <input
          type="file"
          accept="image/*"
          @change="(e)=>{uploadImg(e)}"
          class="upload-img"
          :disabled="(groupRole>2||groupRole==0)&&groupState==1"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import uploadFile from "../../../common/js/upload";
export default {
  name: "GroupSet",
  data() {
    return {
      groupName: "",
      groupDesc: "",
      groupLogo: "",
      isOpen: true,
      enterprise: false,
      joinType: 0,
      password: "",
      isHasPassword: false,
      isLinkJoin: false,
      defaultPower: 5,
      shareTitle: "",
      statisticsSonGroupEnergy: false,
      url: "",
    };
  },
  props: ["groupState"],
  computed: mapState({
    groupRole: (state) => state.group.groupRole,
    groupKey: (state) => state.group.groupKey,
    uptoken: (state) => state.auth.uptoken,
    groupInfo: (state) => state.group.groupInfo,
  }),
  mounted() {
    if (this.groupState == 1) {
      this.groupName = this.groupInfo.groupName ? this.groupInfo.groupName : "";
      this.groupDesc = this.groupInfo.groupDesc ? this.groupInfo.groupDesc : "";
      this.groupLogo = this.groupInfo.groupLogo ? this.groupInfo.groupLogo : "";
      this.isOpen = this.groupInfo.isOpen ? this.groupInfo.isOpen : false;
      this.enterprise = this.groupInfo.enterprise == 2 ? true : false;
      this.statisticsSonGroupEnergy = this.groupInfo.statisticsSonGroupEnergy
        ? this.groupInfo.statisticsSonGroupEnergy
        : false;
      this.joinType = this.groupInfo.joinType ? this.groupInfo.joinType : 0;
      this.password = this.groupInfo.password ? this.groupInfo.password : "";
      this.isHasPassword = this.groupInfo.isHasPassword
        ? this.groupInfo.isHasPassword
        : false;
      this.isLinkJoin = this.groupInfo.isLinkJoin
        ? this.groupInfo.isLinkJoin
        : false;
      this.defaultPower = this.groupInfo.defaultPower
        ? this.groupInfo.defaultPower
        : 5;
    }
    this.setGroupSet();
  },
  methods: {
    ...mapActions("group", ["changeGroupSetState", "getGroupInfo"]),
    ...mapActions("auth", ["getUptoken"]),
    onCopy() {},
    onError() {},
    openNotification() {
      this.$notification.open({
        message: "分享链接",
        duration: 10,
        description: "复制链接成功," + this.shareTitle,
        onClick: () => {
          console.log("Notification Clicked!");
        },
      });
    },
    setGroupName(e) {
      this.groupName = e.target.value;
      if (this.groupName.indexOf("___") != -1) {
        this.$message.error("请输入不带___的正确的群组名称");
        return;
      }
      this.setGroupSet();
    },
    setGroupDesc(e) {
      this.groupDesc = e.target.value;
      this.setGroupSet();
    },
    changeOpen(e) {
      this.isOpen = e.target.checked;
      this.joinType = e.target.checked
        ? this.joinType == 2
          ? this.isHasPassword
            ? 1
            : 0
          : this.joinType
        : this.joinType;
      this.setGroupSet();
    },
    changeSonGroupEnergy(e) {
      this.statisticsSonGroupEnergy = e.target.checked;
      this.setGroupSet();
    },
    changeJoinType(e) {
      this.joinType = e.target.value;
      this.isOpen = this.joinType == 2 ? false : true;
      this.setGroupSet();
    },
    changeIsPassword(e) {
      this.isHasPassword = e.target.checked;
      if (this.isHasPassword) {
        this.joinType = 1;
      } else {
        this.joinType = 0;
      }
      this.setGroupSet();
    },
    changePassword(e) {
      this.password = e.target.value;
      this.setGroupSet();
    },
    changeJoin(e) {
      this.isLinkJoin = e.target.checked;
      this.setGroupSet();
    },
    changeRole(value) {
      this.defaultPower = value;
      this.setGroupSet();
    },
    changeEnterprise(e) {
      this.enterprise = e.target.checked;
      this.setGroupSet();
    },
    uploadImg(e) {
      let mimeType = ["image/png", "image/jpeg"];
      // let mimeType = [];
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
            that.groupLogo = url;
            that.setGroupSet();
          });
        };
      };
    },
    setGroupSet() {
      this.$emit("saveGroupSet", {
        groupName: this.groupName,
        groupDesc: this.groupDesc,
        groupLogo: this.groupLogo,
        isOpen: this.isOpen,
        joinType: this.joinType,
        password: this.password,
        isHasPassword: this.isHasPassword,
        isLinkJoin: this.isLinkJoin,
        defaultPower: this.defaultPower,
        enterprise: this.enterprise ? 2 : 1,
        statisticsSonGroupEnergy: this.statisticsSonGroupEnergy,
      });
    },
  },
  watch: {
    groupInfo: {
      handler(newVal, oldVal) {
        if (newVal !== oldVal && newVal) {
          if (this.groupState == 1) {
            this.groupName = newVal.groupName;
            this.groupDesc = newVal.groupDesc;
            this.groupLogo = newVal.groupLogo;
            this.shareTitle =
              "分享链接:https://working.vip/?group=" + this.groupKey;
            this.url = "https://working.vip/?group=" + this.groupKey;
            this.url +=
              newVal.password && newVal.isHasPassword
                ? ",口令为" + newVal.password
                : "";
            this.password = newVal.password;
            newVal.password && newVal.isHasPassword
              ? (this.shareTitle =
                  this.shareTitle + ",口令为" + newVal.password)
              : null;
          }
        }
      },
      immediate: true,
      deep: true,
    },
    // uptoken: {
    //   handler(newVal, oldVal) {
    //     if (newVal !== oldVal && newVal) {
    //       this.getUptoken();
    //     }
    //   },
    //   immediate: true,
    //   deep: true
    // }
  },
};
</script>

<style scoped>
.contact-dialog-info {
  width: 100%;
  /* height: 100px; */
  display: flex;
  justify-content: space-between;
  margin: 17px 0px;
  padding-right: 25px;
  box-sizing: border-box;
}
.contact-dialog-logo {
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
  color: #cacad9;
  font-size: 20px;
  margin-right: 10px;
  border: 1px solid #d9d9d9;
  overflow: hidden;
  position: relative;
}
.contact-dialog-logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0px;
  left: 0px;
}
.contact-dialog-container {
  width: 70%;
  display: flex;
  flex-wrap: wrap;
}
.contact-name-content {
  width: 100%;
  height: 55px;
  display: flex;
  align-items: center;
}
.contact-dialog-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  align-content: space-between;
}
.contact-name-title {
  width: 100px;
  margin-right: 15px;
}
</style>