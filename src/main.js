import Vue from 'vue'
import App from './App.vue'
import ElementUI from "element-ui"
import 'element-ui/lib/theme-chalk/index.css'
import "./assets/icon/iconfont.css"
import router from './router'
import store from './store'
import Vuelazyload from 'vue-lazyload'

Vue.config.productionTip = false

Vue.use(ElementUI)

Vue.use(Vuelazyload,{
  preLoad:1.3,
  loading: require('./assets/imgs/loading.png'),
  attempt:2
})

console.log = function(){}

console.info(`%c
欢迎使用小陈音乐！
作者：小陈同学吗
GitHub：https://github.com/MrRainbowYoo/Music_Player
歌曲来源于网易云音乐(https://music.163.com)
* 本项目仅供个人学习研究使用，禁止用于商业或非法用途。`,`color:#2980b9`)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
