<template>
  <div id="app">
    <Top></Top>
    <Index>
      <keep-alive>
        <router-view v-if="this.$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!this.$route.meta.keepAlive"></router-view>
    </Index>
    <SongDetail :show="show"></SongDetail>
    <transition name="fade">
      <Queue v-show="showQueue"></Queue>
    </transition>
    <Bottom></Bottom>
    <div style="fontSize:12px; position: absolute; bottom: 10%;left:10px;zIndex: -1;">
      备案号：<a href="https://beian.miit.gov.cn" target="_blank">浙ICP备19010344号-1</a>
    </div>
  </div>
</template>

<script>
import Top from './components/Top.vue'
import Index from './components/Index.vue'
import Bottom from './components/Bottom.vue'
import SongDetail from './components/SongDetail.vue'
import Queue from './components/Queue.vue'

export default {
  name: 'App',
  components: {
    Top,
    Index,
    Bottom,
    SongDetail,
    Queue
  },
  data(){
    return {
      show:true,
      showQueue:false
    }
  }
}
</script>

<style>
  *{
    margin: 0;
    padding: 0;
  }

  #app {
    height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .header {
    height: 60px;
    position: relative;
    top: 0;
    left: 0;
    right: 0;
  }

  .bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
  }

  .index {
    position: fixed;
    top: 60px;
    bottom: 60px;
    left: 0;
    right: 0;
  }

  /* 去除scrollbar横向滚动条 */
  .el-scrollbar__wrap {
      overflow-x: hidden !important;
  }

  .fade-enter-active, .fade-leave-active {
      transition: transform .5s
  }
  .fade-enter, .fade-leave-active {
    transform: translate3d(0,100%,0);
  }

  .el-loading-spinner .path {
    stroke: rgb(236, 65, 65) !important;
  }
</style>
