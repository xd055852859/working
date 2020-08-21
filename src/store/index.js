import Vue from "vue";
import Vuex from "vuex";
import common from "./modules/common";
import auth from "./modules/auth";
import contact from "./modules/contact";
import card from "./modules/card";
import group from "./modules/group";
import search from "./modules/search";
import role from "./modules/role";
import comment from "./modules/comment";
import message from "./modules/message";
import task from "./modules/task";
import countdown from "./modules/countdown";
import promisePlugin from "./promisePlugin";

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";

export default new Vuex.Store({
  modules: {
    common,
    auth,
    contact,
    card,
    group,
    search,
    role,
    comment,
    message,
    task,
    countdown
  },
  strict: debug,
  plugins: [promisePlugin]
});
