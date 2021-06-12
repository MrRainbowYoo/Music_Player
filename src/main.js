import Vue from 'vue'
import App from './App.vue'
import ElementUI from "element-ui"
import VueRouter from "vue-router"
import 'element-ui/lib/theme-chalk/index.css'
import "./assets/icon/iconfont.css"

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(VueRouter)

import Discover from "./components/Discover.vue"
import Recommend from './components/Recommend.vue'
import NewSongs from './components/NewSongs.vue'
import MVs from './components/MVs.vue'
import Result from './components/Result.vue'
import Playlist from './components/Playlist.vue'
import MvDetail from './components/MvDetail.vue'

const routes = [
  {
    path:"/",
    redirect:'/discover'
  },
  {
    path:"/discover",
    component:Discover
  },
  {
    path:"/recommend",
    component:Recommend
  },
  {
    path:"/newsongs",
    component:NewSongs
  },
  {
    path:"/mvs",
    component:MVs
  },
  {
    path:'/result',
    component:Result
  },
  {
    path:'/playlist',
    component:Playlist
  },
  {
    path:'/mvdetail',
    component:MvDetail
  }
]

const router = new VueRouter({
  routes
})

// 解决重复点击导航时，控制台出现报错
const VueRouterPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(to) {
  return VueRouterPush.call(this, to).catch(err => err)
}


new Vue({
  render: h => h(App),
  router
}).$mount('#app')
