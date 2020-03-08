<template>
  <div class="login">
    <div class="form-wrapper">
      <a-form
        id="components-form-demo-normal-login"
        :form="form"
        class="login-form"
        @submit="handleSubmit"
      >
        <a-form-item>
          <a-input
            v-decorator="[
          'mobile',
          { rules: [{ required: true, message: '请输入手机号!' }] }
        ]"
            placeholder="手机号"
          >
            <a-select
              slot="addonBefore"
              v-decorator="[
            'mobileArea',
            { initialValue: '+86' }
          ]"
              style="width: 70px"
            >
              <a-select-option value="+86">+86</a-select-option>
              <a-select-option value="+87">+87</a-select-option>
            </a-select>
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input
            v-decorator="[
          'password',
          { rules: [{ required: true, message: '请输入密码!' }] }
        ]"
            type="password"
            placeholder="密码"
          >
            <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-checkbox
            v-decorator="[
          'remember',
          {
            valuePropName: 'checked',
            initialValue: true,
          }
        ]"
          >记住我</a-checkbox>
          <router-link class="login-form-forgot" to="/user/resetpassword">忘记密码</router-link>
          <a-button type="primary" html-type="submit" class="login-form-button">登录</a-button>或者
          <!-- <a href>立即注册</a> -->
          <router-link class="link" to="/user/register">立即注册</router-link>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { mapState, mapActions } from "vuex";
export default {
  name: "Login",
  beforeCreate() {
    this.form = this.$form.createForm(this);
  },
  beforeDestroy() {
    this.form.resetFields();
  },
  computed: mapState({
    user: state => state.auth.user
  }),
  methods: {
    ...mapActions("auth", ["login", "createMainGroup", "getUptoken","setTargetUserInfo"]),
    handleSubmit(e) {
      e.preventDefault();
      const that = this;
      this.form.validateFields((err, values) => {
        if (!err) {
          that.login(values);
        }
      });
    }
  },
  watch: {
    user(newVal) {
      if (newVal) {
        this.createMainGroup(localStorage.getItem("token"));
        this.getUptoken(localStorage.getItem("token"));
        this.setTargetUserInfo({
          ...newVal.profile,
          userId: newVal._key
        });
        this.$router.push("/chat");
      }
    }
  }
};
</script>

<style scoped>
.login {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #656765;
}
.form-wrapper {
  width: 560px;
  background: #fff;
  padding: 50px 150px;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.15);
}

#components-form-demo-normal-login .login-form {
  max-width: 300px;
}
#components-form-demo-normal-login .login-form-forgot {
  float: right;
}
#components-form-demo-normal-login .login-form-button {
  width: 100%;
}
</style>