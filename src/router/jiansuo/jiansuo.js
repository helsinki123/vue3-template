// 检索模块的路由信息
const jsRouter = [{
  // 检索首页
  path: "/js/",
  name: "js",
  component: () => import('@views/jiansuo/index.vue'),
  meta: {
    title: "检索",
  },
}, {
  // 检索结果页
  path: "/result:word?",
  name: "result",
  component: () => import('@views/jiansuo/result.vue'),
  meta: {
    title: "检索",
    isHide: true, // 是否不显示在顶部导航
  },
}];

export default jsRouter;
