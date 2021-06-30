<template>
  <div class="audio-wrap">
    <audio :src="musicUrl"
     controls 
     autoplay 
     ref="audio" 
     style="display:none" 
     @canplay="getDuration" 
     @timeupdate="updateTime"
     @ended="onEnded" 
     您的浏览器不支持audio标签></audio>
    <div class="audio-left">
        <div class="audio-btns">
        <span class="iconfont icon-shangyishou" title="上一首" @click="prev"></span>
        <span class="iconfont icon-play" title="播放" v-if="!isPaused" @click="changeStatus('play')"></span>
        <span class="iconfont icon-pause" title="暂停" v-if="isPaused" @click="changeStatus('pause')"></span>        
        <span class="iconfont icon-xiayishou" title="下一首" @click="next"></span>
        </div>

        <div class="audio-progress">
            <span>{{currentTime | timeFormat}}</span>
            <div class="block">
                <el-slider v-model="currentTime"  :max="duration" :show-tooltip="false" @change="changeCurrentTime" @mousedown.native="isDrag = true" @mouseup.native="isDrag = false"></el-slider>
            </div>
            <span>{{duration | timeFormat}}</span>
        </div>
    </div>

    <div class="audio-right">
        <div class="slot"></div>
        <div class="audio-voice">
            <span class="iconfont icon-yinliang" v-if="voice" @click="voice=0"></span>
            <span class="iconfont icon-jingyin" v-if="!voice" @click="voice=(cacheVoice==0?0.7:cacheVoice)"></span>
            <div class="block">
                <el-slider v-model="voice" :max=1 :step=0.1 :show-tooltip="true" @input="changeVolume" @change="changeCacheVolume" :format-tooltip="formatTooltip"></el-slider>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
    data(){
        return {
            currentTime:0,
            duration:0,
            isPaused:false,
            isDrag:false, //添加判断是否拖拽，可解决拖动超过1s出现的bug
            voice:0.7,
            cacheVoice:0.7
        }
    },
    props:{
        musicUrl:String
    },
    methods:{
        changeStatus(option){
            if(option=='play'){
                if(this.musicUrl){
                    this.isPaused = !this.isPaused
                    this.$refs.audio.play()
                    this.$emit('play')
                }else {
                    this.$message({
                        type:'error',
                        message:'还没有播放音乐哦',
                        showClose:true
                    })
                }
            }else{
                this.isPaused = !this.isPaused
                this.$refs.audio.pause()
                this.$emit('pause')
            }
        },
        changeCurrentTime(){
            // 存在拖动进度条歌词不随着滚动的bug
            this.$refs.audio.currentTime = this.currentTime
            this.isDrag = false
            // this.changeStatus(this.isPaused?'play':'pause')
        },
        updateTime(e){
            // console.log(e.target.currentTime)
            if(!this.isDrag){
                this.currentTime = e.target.currentTime
                this.$emit('timeupdate',event)
            }
        },
        getDuration(e){
            // console.log(e.target.duration)
            this.duration = e.target.duration

            // 下面两句会导致在暂停时滑动进度条使得按钮状态改变，图片旋转而不播放的bug
            // this.isPaused = true
            // this.$emit('play')
        },
        changeVolume(){
            this.$refs.audio.volume = this.voice
        },
        changeCacheVolume(){
            // 设置缓存音量,点击静音恢复至该音量，如缓存也为0，恢复默认0.7
            this.cacheVoice = this.voice
        },
        formatTooltip(val) {
            return val*100+"%";
        },
        onEnded(){
            // this.isPaused = false
            // this.$emit('pause')
            this.$emit('end')
        },
        next(){
            this.$emit('next')
        },
        prev(){
            this.$emit('prev')
        }

    },
    filters:{
        timeFormat(time){
            let min = parseInt(time / 60).toString().padStart(2,'0')
            let second = parseInt(time-min*60).toString().padStart(2,'0')
            return min+":"+second
        },
    },
    watch:{
        voice(){
            if(!this.voice){
                this.$refs.audio.muted = true
            }else
                this.$refs.audio.muted = false
        },
        musicUrl(){
            if(this.musicUrl)
                this.isPaused = true
            else{
                this.isPaused = false
                this.duration = 0
                this.$refs.audio.currentTime = 0
                this.currentTime = 0
            }
        }
    }
}
</script>

<style>
    .audio-wrap {
        width: 600px;
        min-width: 400px;
        height: 100%;
        margin: 0 auto;
        padding: 10px;
        box-sizing: border-box;
        display: flex;
    }

    .audio-left {
        flex: 1;
    }

    .audio-btns {
        width: 50%;
        height: 50%;
        margin: 0 auto;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
    }

    .audio-btns span {
        cursor: pointer;
        font-size: 26px;
        padding: 5px;
        border-radius: 10px;
    }

    .audio-btns span:hover {
        background-color: #ecf0f1;
    }

    .audio-progress{
        display: flex;
        align-items: center;
    }

    .audio-progress span {
        font-size: 12px;
        color: #bdc3c7;
    }

    .block {
        flex: 1;
        margin: 0 10px;
    }
    
    .el-slider__bar {
        background-color: rgb(225, 62, 62) !important;
    }

    .el-slider__button {
        border-color: rgb(225, 62, 62) !important;
        width: 8px !important;
        height: 8px !important;
    }

    .audio-right {
        width: 20%;
        min-width: 100px;
        margin-left: 50px;
    }

    .slot {
        height: 50%;
    }

    .audio-voice {
        display: flex;
        align-items: center;
    }

    .audio-voice span {
        cursor: pointer;
        margin-right: 10px; /* 远离音量条，防止误触 */
    }
</style>