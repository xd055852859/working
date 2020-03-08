import VueRouter from "vue-router";

const routerPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error);
};
const router = new VueRouter({
  mode: "history",
  base: __dirname,
  routes: [
    {
      path: "/",
      component: () =>
        import(/* webpackChunkName: "index" */ "../components/index/Index"),
      // redirect: "/",
      meta: {
        title: "Working.vip 雁行"
      }
    },
    {
      path: "/bootpage",
      component: () =>
        import(/* webpackChunkName: "bootpage" */ "../components/Bootpage"),
      meta: {
        title: "Working.vip 雁行"
      }
    },
    ,
    {
      path: "/PhoneTask",
      component: () =>
        import(/* webpackChunkName: "bootpage" */ "../components/phoneTask/PhoneTask"),
      meta: {
        title: "Working.vip 雁行"
      }
    },  
    {
      path: "/user",
      component: () =>
        import(/* webpackChunkName: "user" */ "../components/user/User"),
      children: [
        {
          path: "login",
          component: () =>
            import(/* webpackChunkName: "user" */ "../components/user/Login"),
          meta: {
            title: "登录"
          }
        }
      ]
    }
  ]
});
router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next();
});
router.afterEach(() => {
  window.scrollTo(0, 0);
});

export default router;
