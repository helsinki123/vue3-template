import {
  defineConfig
} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  return {
    base: '/s8/', // 公共代理路径
    resolve: {
      alias: {
        '@': path.resolve(__dirname, "src"),
        '@comps': path.resolve(__dirname, "src/components"),
        '@apis': path.resolve(__dirname, "src/network"),
        '@views': path.resolve(__dirname, "src/views"),
        '@router': path.resolve(__dirname, "src/router"),
        '@store': path.resolve(__dirname, "src/store"),
        '@static': path.resolve(__dirname, "src/static"),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@static/styles/theme/theme.module.scss";`
        }
      }
    },
    plugins: [vue()]
  }
});
