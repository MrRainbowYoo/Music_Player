import Vue from 'vue'
import VueRouter from "vue-router"


// import Discover from "@/views/Discover/Discover.vue"
// import Recommend from '@/views/Recommend/Recommend.vue'
// import NewSongs from '@/views/NewSongs/NewSongs.vue'
// import MVs from '@/views/MVs/MVs.vue'
// import Result from '@/views/Result/Result.vue'
// import Playlist from '@/views/Playlist/Playlist.vue'
// import MvDetail from '@/views/MvDetail/MvDetail.vue'
// import Artist from '@/views/Artist/Artist.vue'
// import Album from '@/views/Album/Album.vue'

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
    component: () => import('@/views/Discover/Discover.vue'),
  },
  {
    path:"/recommend",
    component: () => import('@/views/Recommend/Recommend.vue'),
    meta: {
      keepAlive:true,
    }
  },
  {
    path:"/newsongs",
    component: () => import('@/views/NewSongs/NewSongs.vue'),
  },
  {
    path:"/mvs",
    component: () => import('@/views/MVs/MVs.vue'),
    meta: {
      keepAlive: true
    }
  },
  {
    path:'/result',
    component: () => import('@/views/Result/Result.vue')
  },
  {
    path:'/playlist',
    component: () => import('@/views/Playlist/Playlist.vue'),
  },
  {
    path:'/mvdetail',
    component: () => import('@/views/MvDetail/MvDetail.vue')
  },
  {
    path:'/artist',
    component: () => import('@/views/Artist/Artist.vue')
  },
  {
    path:'/album',
    component: () => import('@/views/Album/Album.vue')
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

router.beforeEach((to,from,next)=>{
  let needKeepAlive = ['/recommend','/mvs']
  if(needKeepAlive.includes(to.path) && (from.path==="/mvdetail" || from.path === '/playlist'))
    to.meta.keepAlive = true
  else
    to.meta.keepAlive = false
  next()
})

export default router