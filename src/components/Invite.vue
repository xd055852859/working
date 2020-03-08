<template>
  <div>
    <!-- 口令加入 -->
    <a-input placeholder="请输入口令" :value="password" v-if="isHasPassword" @change="changePassword" />
    <!-- 邀请加入 -->
    <div class="invite-container">
      <!-- <a-button type="primary" @click.stop="addMember" v-if="groupJoinType==0">开放加入</a-button> -->
      <a-button
        type="primary"
        @click.stop="applyJoinGroup({groupKey:inviteKey})"
        v-if="joinType==1"
      >申请加入</a-button>
      <!-- 邀请加入和口令加入 -->
      <a-button
        type="primary"
        @click.stop="passwordJoinGroup({groupKey:inviteKey,password:password})"
        v-if="isHasPassword"
      >口令加入</a-button>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "Invite",
  data() {
    return {
      password: "",
      joinType: 0,
      isHasPassword: false
    };
  },
  computed: mapState({
    user: state => state.auth.user,
    groupKey: state => state.group.groupKey,
    inviteKey: state => state.group.inviteKey,
    inviteInfo: state => state.group.inviteInfo
  }),
  methods: {
    ...mapActions("group", [
      "addGroupMember",
      "passwordJoinGroup",
      "applyJoinGroup"
    ]),
    addMember() {},
    changePassword(e) {
      this.password = e.target.value;
    }
  },
  watch: {
    inviteInfo: {
      handler(newVal) {
        console.log("newVal", newVal);
        if (newVal) {
          if (newVal.joinType) {
            this.joinType = newVal.joinType;
            this.isHasPassword = newVal.isHasPassword;
          } else {
            this.addGroupMember({
              param: {
                groupKey: this.inviteKey,
                targetUidList: [
                  {
                    userKey: this.user._key,
                    nickName: this.user.profile.nickName,
                    avatar: this.user.profile.avatar,
                    gender: this.user.profile.gender,
                    role: newVal.defaultPower
                  }
                ]
              },
              item: { ...newVal, _key: this.inviteKey },
              type: "invite"
            });
          }
        }
      },
      deep: true,
      immediate: true
    }
  }
};
</script>

<style scoped>
.invite-container {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}
</style>