import Vue from "vue";
import VueRouter from "vue-router";
// import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
//   {
//     path: "/",
//     name: "Home",
//     component: Home,
//   },
//   {
//     path: "/about",
//     name: "About",
//     component: () =>
//       import(/* webpackChunkName: "about" */ "../views/About.vue"),
//   },
  {
    path: "/steps",
    name: "Running",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Running.vue"),
    meta: {
        title: "Michelle Steps Challenge"
    }
  },
  {
      path: "/",
      name: "Pagenotfound",
      component: {
          template: <p>Page not found</p>
      },
      meta: {
          title: 'Page Not Found'
      }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

const DEFAULT_TITLE = 'SamNewby';
router.afterEach((to) => {
    Vue.nextTick(() => {
        document.title = to.meta.title || DEFAULT_TITLE;
    });
})

export default router;
