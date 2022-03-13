// 订阅模块的路由信息
const dyRouter = [{
  // 订阅
  path: "/dy/",
  name: "dy",
  component: () => import('@views/dingyue/dingyue.vue'),
  meta: {
    title: "订阅",
  },
}];

export default dyRouter;
