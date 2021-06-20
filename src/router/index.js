import Vue from 'vue'
import VueRouter from "vue-router"


import Discover from "@/views/Discover/Discover.vue"
import Recommend from '@/views/Recommend/Recommend.vue'
import NewSongs from '@/views/NewSongs/NewSongs.vue'
import MVs from '@/views/MVs/MVs.vue'
import Result from '@/views/Result/Result.vue'
import Playlist from '@/views/Playlist/Playlist.vue'
import MvDetail from '@/views/MvDetail/MvDetail.vue'

Vue.use(VueRouter)

// 解决重复点击导航时，控制台出现报错
const VueRouterPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(to) {
  return VueRouterPush.call(this, to).catch(err => err)
}

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

export default router