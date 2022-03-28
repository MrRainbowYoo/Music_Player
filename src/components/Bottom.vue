<template>
  <div class="bottom">
    <div class="music-box">
    <!-- onselectstart="return false" 为的是避免多次点击左下角歌曲封面的时候出现蓝色选中效果 -->
    <div class="img-wrap el-icon-arrow-up" @click="toSongDetail()" title="打开音乐详情页" onselectstart="return false"> 
        <img :src="globalMusicInfo.imgUrl ? globalMusicInfo.imgUrl : defaultImg" alt="">
    </div>
    <div class="music-info" v-show="globalMusicInfo.songName">
        <span class="music-name" :title="globalMusicInfo.songName">{{globalMusicInfo.songName}}</span>
        
        <div class="music-singer">
            <span v-for="(singer,i) in globalMusicInfo.artistInfo" :key="i+99">{{singer.name}} </span>
        </div>
    </div>
    <span class="music-name" v-show="!globalMusicInfo.songName" style="line-height:50px">还没有播放音乐哦</span>
    </div>
    <AudioChen :musicUrl="globalMusicUrl" @timeupdate="updateTime" @play="playStatus" @pause="pauseStatus" @next="next" @prev="prev" @end="next"></AudioChen>
    <!-- <audio :src="globalMusicUrl" autoplay controls ref="audio" @timeupdate="updateTime" @pause="pauseStatus" @play="playStatus"></audio> -->

    <!-- el-tooltip会在#app外生成一个dom -->
    <!-- <el-tooltip content="播放队列" placement="top" effect="light"> -->
    <div @click="showQueue($event)" 
        ref="queue"
        title="播放队列"
        :class="{'delete-queue-style bofangliebiao'
        :this.queueStyle=='delete','add-queue-style bofangliebiao'
        :this.queueStyle=='add','bofangliebiao'
        :this.queueStyle=='normal'}">
            <span class="iconfont icon-yinleliebiao"></span>
            <span>{{musicQueue.length}}</span>
    </div>
    <!-- </el-tooltip> -->

  </div>
</template>

<script scoped>
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
        },
        nowIndex(){
            return this.$store.state.nowIndex
        },
        queueStyle(){
            return this.$store.state.queueStyle
        }
    },
    mounted(){
        this.changeQueuePostion()

        window.onresize = () => this.changeQueuePostion()
    },
    methods:{
        changeQueuePostion() {
            if(this.$refs.queue.getBoundingClientRect){
                // console.log(that.$refs.queue.getBoundingClientRect())
                let pos = {
                    top:Math.floor(this.$refs.queue.getBoundingClientRect().top),
                    left:Math.floor(this.$refs.queue.getBoundingClientRect().left)
                }
                this.$store.commit("changeQueuePos",pos)
            }
        },
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
            console.log("目前歌单index为："+this.nowIndex)
        },
        pauseStatus(){
            this.$store.commit('changeMusicStatus',true)
        },
        playStatus(){
            this.$store.commit('changeMusicStatus',false)
        },
        showQueue(e){
            this.$parent.showQueue = !this.$parent.showQueue
            console.log(`logo x:${e.x}, y:${e.y}`)
        },
        next(){
            if(this.musicQueue.length == 0)
                this.$message({
                    type:'warning',
                    message:'播放列表是空的~',
                    showClose:true
                })
            else {
                if(this.musicQueue.length == 1){
                    // 若播放列表只有一首歌 则单曲循环
                    this.currentTime = 0
                    let musicUrl = this.globalMusicUrl
                    this.$store.commit('changeMusicUrl',"")
                    setTimeout(() => {
                        this.$store.commit('changeMusicUrl',musicUrl)
                    }, 0);
                }else{
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
                    this.$store.commit('changeMusicStatus',false)  
                }                         
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
                if(this.musicQueue.length == 1){
                    this.currentTime = 0
                    let musicUrl = this.globalMusicUrl
                    this.$store.commit('changeMusicUrl',"")
                    setTimeout(() => {
                        this.$store.commit('changeMusicUrl',musicUrl)
                    }, 0);
                }else{                            
                let ids = []
                    for (const item of this.musicQueue) {
                        ids.push(item.id)
                    }
                    let nowIndex = ids.indexOf(this.globalMusicInfo.id)
                    let prevIndex = (nowIndex - 1) % this.musicQueue.length < 0 ? ((nowIndex - 1) % this.musicQueue.length + this.musicQueue.length) : (nowIndex - 1) % this.musicQueue.length
                    this.$store.commit('changeNowIndex',prevIndex)
                    this.$store.commit('changeMusicStatus',false)
                }  
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

    .add-queue-style{
        animation-name: addAni;
        animation-duration: .3s;
        animation-direction: alternate-reverse;
        transform: scale(1);
    }

    @keyframes addAni {
        to{
            color: rgb(236, 65, 65);
            transform: scale(1.5);
        }
    }

    .add-queue-style::before{
        content: "+1";
        position: absolute;
        top: -8px;
        left: -20px;
        transform: scale(0.8);
        font-weight: bold;
    }

    .delete-queue-style{
        animation-name: deleteAni;
        animation-duration: .3s;
        animation-direction: alternate-reverse;
        transform: scale(1);
    }

    @keyframes deleteAni {
        to{
            color: green;
            transform: scale(1.5);
        }
    }

    .delete-queue-style::before{
        content: "-1";
        position: absolute;
        top: -8px;
        left: -20px;
        transform: scale(0.8);
        font-weight: bold;
    }    

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