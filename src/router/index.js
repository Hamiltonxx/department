import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: "/data-center",
    },
    {
      path: "/data-center",
      name: "DataCenter",
      component: () => import("@/views/DataCenter"),
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import("@/views/Login"),
      meta: {
        useLayout: false,
      }
    },
    {
      path: "/finance",
      children: [
        {
          path: "check-accounts",
          name: "CheckAccounts",
          component: () => import("@/views/Finance/CheckAccounts"),
        },
        {
          path: "match-records",
          name: "MatchRecords",
          component: () => import("@/views/Finance/MatchRecords"),
        },
        {
          path: "proof-records",
          name: "ProofRecords",
          component: () => import("@/views/Finance/ProofRecords"),
        }
      ],
    }
  ],
});

const publicPath = ['/login'];

router.beforeEach((to, from, next) => {

  next();
});

export default router
