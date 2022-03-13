
import App from './App.vue'
import {
  createApp
} from 'vue'
import {
  router
} from './router/index.js'
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import '@/static/styles/common.scss'
import "@/static/icon/iconfont.css"

// 简单配置
NProgress.inc(0.2)
NProgress.configure({
  easing: 'ease',
  speed: 200,
  showSpinner: false
})
router.beforeEach((to, from, next) => {
  NProgress.start();
  next();
});

router.afterEach(() => {
  NProgress.done();
});

createApp(App)
  .use(ElementPlus)
  .use(router)
  .mount('#app');

