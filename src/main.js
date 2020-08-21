import '@babel/polyfill';
import Vue from 'vue';
import App from './App';
import VueRouter from 'vue-router';
import store from './store';
import VueI18n from 'vue-i18n';
import VueSocketio from 'vue-socket.io';
import Antd from 'ant-design-vue';
import moment from 'moment';
import router from './router/router';
import filters from './filter/filter';
import { message } from 'ant-design-vue';
import Video from 'video.js';

import 'video.js/dist/video-js.css';
import 'ant-design-vue/dist/antd.css'; //引入 Froala Editor js file.
import VueClipboard from 'vue-clipboard2';
import _ from 'lodash';

// Require Froala Editor js file.
require('froala-editor/js/froala_editor.pkgd.min.js');

// Require Froala Editor css files.
require('froala-editor/css/froala_editor.pkgd.min.css');
require('froala-editor/css/froala_style.min.css');

// Import and use Vue Froala lib.
import VueFroala from 'vue-froala-wysiwyg';

Vue.config.productionTip = false;
Vue.prototype.$message = message;
Vue.prototype.$moment = moment;
Vue.prototype.$video = Video;
// Vue.prototype.$ip = returnCitySN["cip"];
// Vue.prototype.$city = returnCitySN["cname"];
Vue.prototype._ = _;
Vue.use(Antd);
Vue.use(VueRouter);
Vue.use(VueI18n);
Vue.use(VueClipboard);
Vue.use(VueFroala);
// Vue.use(VueSocketio, "http://192.168.1.249:9033");
Vue.use(
  new VueSocketio({
    debug: true,
    // connection: "http://192.168.1.249:9033"
    connection: 'https://workingdata.qingtime.cn',
  })
);

const i18n = new VueI18n({
  locale: 'zh', // 语言标识
  //this.$i18n.locale // 通过切换locale的值来实现语言切换
  // messages: {
  //   'zh-CN': require('./common/lang/zh'), // 中文语言包
  //   'en-US': require('./common/lang/en') // 英文语言包
  // }
});

Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key]);
});
let vueComponent = new Vue({
  i18n,
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
export default vueComponent;
