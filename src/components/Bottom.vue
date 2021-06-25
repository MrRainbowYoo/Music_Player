<template>
  <div class="bottom">
      <div class="music-box">
        <div class="img-wrap el-icon-arrow-up" @click="toSongDetail()" title="打开音乐详情页" onselectstart="return false">
            <img :src="globalMusicInfo.imgUrl ? globalMusicInfo.imgUrl : defaultImg" alt="">
        </div>
        <div class="music-info" v-show="globalMusicInfo.songName">
            <span class="music-name" :title="globalMusicInfo.songName">{{globalMusicInfo.songName}}</span>
            <span class="music-singer" :title="globalMusicInfo.singer">{{globalMusicInfo.singer}}</span>
        </div>
        <span class="music-name" v-show="!globalMusicInfo.songName" style="line-height:50px">还没有播放音乐哦</span>
      </div>
      <AudioChen :musicUrl="globalMusicUrl" @timeupdate="updateTime" @play="playStatus" @pause="pauseStatus" @next="next" @prev="prev" @end="next"></AudioChen>
      <!-- <audio :src="globalMusicUrl" autoplay controls ref="audio" @timeupdate="updateTime" @pause="pauseStatus" @play="playStatus"></audio> -->

    <el-tooltip content="播放队列" placement="top" effect="light">
        <div class="bofangliebiao" @click="showQueue">
          <span class="iconfont icon-yinleliebiao"></span>
          <span>{{musicQueue.length}}</span>
      </div>
    </el-tooltip>

  </div>
</template>

<script scoped>
// import func from 'vue-editor-bridge'
import AudioChen from './AudioChen.vue'
export default {
    data(){
        return{
            defaultImg: require("@/assets/imgs/defaultImg.png"),
            musicUrl:"",
            currentTime:0,
        }
    },
    components:{
        AudioChen
    },
    props:{
        // 父组件传参，调用props算是方便的，但是子组件，孙组件通过this.$parent.$parent.xxx = 'xx'改变过于复杂，用Vuex优化
        // musicUrl:String,
        // musicInfo:Object
    },
    computed:{
        globalMusicUrl(){
            return this.$store.state.globalMusicUrl
        },
        globalMusicInfo(){
            return this.$store.state.globalMusicInfo
        },
        musicQueue(){
            return this.$store.state.musicQueue
        }
    },
    methods:{
        toSongDetail(){
            if(this.globalMusicUrl)
                this.$parent.show = !this.$parent.show
            else
                this.$message({
                    showClose: true,
                    message: '还没有播放音乐哦',
                    type: 'error'
                });
        },
        updateTime(e){
            // console.log(e.target.currentTime)
            this.currentTime = e.target.currentTime
        },
        pauseStatus(){
            this.$store.commit('changeMusicStatus',true)
            // console.log('pause~~~~~~~~~~~')
            // this.$store.state.isMusicPaused = true
        },
        playStatus(){
            this.$store.commit('changeMusicStatus',false)
            // console.log('play~~~~~~~~~~~')
            // this.$store.state.isMusicPaused = false
        },
        showQueue(){
            this.$parent.showQueue = !this.$parent.showQueue
        },
        next(){
            if(this.musicQueue.length == 0)
                this.$message({
                    type:'warning',
                    message:'播放列表是空的~',
                    showClose:true
                })
            else {
                let ids = []
                for (const item of this.musicQueue) {
                    ids.push(item.id)
                }
                // console.log(ids)
                let nowIndex = ids.indexOf(this.globalMusicInfo.id)
                // console.log(nowIndex)
                let nextIndex = (nowIndex + 1) % this.musicQueue.length
                // let nextId = this.musicQueue[nextIndex].id
                this.$store.commit('changeNowIndex',nextIndex)                           
            }
        },
        prev(){
            if(this.musicQueue.length == 0)
                this.$message({
                    type:'warning',
                    message:'播放列表是空的~',
                    showClose:true
                })
            else {            
                let ids = []
                for (const item of this.musicQueue) {
                    ids.push(item.id)
                }
                let nowIndex = ids.indexOf(this.globalMusicInfo.id)
                let prevIndex = (nowIndex - 1) % this.musicQueue.length < 0 ? ((nowIndex - 1) % this.musicQueue.length + this.musicQueue.length) : (nowIndex - 1) % this.musicQueue.length
                this.$store.commit('changeNowIndex',prevIndex)
            }
        }
    },
    watch:{
        currentTime(){
            this.$store.commit('changeCurrentTime',this.currentTime)
        },
        globalMusicInfo(){
            let obj = {
                musicUrl:this.globalMusicUrl,
                ...this.globalMusicInfo
            }
            this.$store.commit('changeMusicQueue',obj)
        }
    }
}
</script>

<style>
    .bottom {
        display: flex;
        align-items: center;
        background-color: #f1f3f4;
        box-shadow: 0px -2px 2px rgba(0, 0, 0,.3);

        position: relative; /* 防止被覆盖 */
        /* #f1f3f4 */
    }

    .bottom audio {
        width: 100%;
        outline: none;
    }

    .music-box{
        display: flex;
        padding: 5px;
        box-sizing: border-box;
    }

    .music-box .img-wrap {
        width: 50px;
        height: 50px;
        margin-right: 10px;
        cursor: pointer;
        position: relative;
    }

    .music-box .img-wrap::before{
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(0, 0, 0,.3);
        color: #fff;
        border-radius: 5px;
        display: none;
    }

    .music-box .img-wrap:hover::before{
        display: flex;
    }

    .music-box .img-wrap img {
        height: 100%;
        border-radius: 5px;
    }

    .music-name {
        font-size: 14px;
        width: 150px;
        display: block;
        overflow-x: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .music-singer {
        margin-top: 5px;
        font-size: 12px;
        width: 150px;
        display: block;
        overflow-x: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .bofangliebiao{
        margin-right: 100px;
        font-size: 12px;
        cursor: pointer;
    }

    .bofangliebiao span:nth-of-type(1){
        font-size: 22px;
    }
</style>