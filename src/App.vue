<template>
  <div id="app">
    <Top></Top>
    <Index></Index>
    <Bottom :musicUrl="musicUrl"></Bottom>
  </div>
</template>

<script>
import Top from './components/Top.vue'
import Index from './components/Index.vue'
import Bottom from './components/Bottom.vue'

export default {
  name: 'App',
  components: {
    Top,
    Index,
    Bottom
  },
  data(){
    return {
      musicUrl:""
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
    position: fixed;
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

</style>
