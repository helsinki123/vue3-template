/*
 * @Author: your name
 * @Date: 2021-06-23 11:21:04
 * @LastEditTime: 2021-06-23 18:23:16
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \gojira\src\router\index.js
 */
import {
  createRouter,
  createWebHistory
} from "vue-router";

// import jsRouter from "@router/jiansuo/jiansuo.js"; // 检索的路由数据
// import dyRouter from "@router/dingyue/dingyue.js"; // 订阅的路由数据

// 路由信息
const routes = [
  // {
  //   path: "/",
  //   redirect: {
  //     name: "login"
  //   }}
  // }, {
  //   // 登录
  //   path: "/login",
  //   name: "login",
  //   component: () => import('@views/login/login.vue'),
  //   meta: {
  //     title: "登录系统",
  //     isHide: true, // 是否不显示在顶部导航
  //   },
  // },
  // {
  //   // 用户树配置
  //   path: "/home",
  //   name: "userTree",
  //   component: () => import('@views/userTree/userTree.vue')
  // },
  // ...dyRouter, // 订阅的路由数据
  // ...jsRouter, // 检索的路由数据

  /* {
    path: '/user/:id',
    component: User,
    children: [
      { path: '', component: UserHome },
    ],
  }, */
];

// 导出路由
const router = createRouter({
  mode: 'history',
  history: createWebHistory('/s8/'),
  routes
});

export {
  routes,
  router
};
