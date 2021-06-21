<template>
  <div class="audio-wrap">
      <audio :src="testUrl" controls ref="audio" style="position: absolute;top: 166px;" @canplay="getDuration" @timeupdate="updateTime"></audio>
      <div class="audio-btns">
        <span class="iconfont icon-shangyishou" title="上一首"></span>
        <span class="iconfont icon-play" title="播放" v-if="isPlay" @click="changeStatus('play')"></span>
        <span class="iconfont icon-pause" title="暂停" v-if="!isPlay" @click="changeStatus('pause')"></span>        
        <span class="iconfont icon-xiayishou" title="下一首"></span>
      </div>
      <div class="audio-progress">
        <span>{{formatCurrentTime}}</span>
        <div class="block">
            <el-slider v-model="currentTime"  :max="duration" :step=0.1 :show-tooltip="true" @change="changeCurrentTime"></el-slider>
        </div>
        <span>{{formatDuration}}</span>
      </div>
  </div>
</template>

<script>
export default {
    data(){
        return {
            testUrl:'http://m701.music.126.net/20210621223805/6a71ddc63b2ec573233d77e76aa74af1/jdyyaac/obj/w5rDlsOJwrLDjj7CmsOj/4241278161/6433/0bc5/0015/bcd6d720987c4346233c685caeac17a3.m4a',
            currentTime:0,
            formatCurrentTime:"00:00",
            duration:0,
            formatDuration:"00:00",
            isPlay:true
        }
    },
    methods:{
        changeStatus(option){
            this.isPlay = !this.isPlay
            if(option=='play'){
                this.$refs.audio.play()
            }else{
                this.$refs.audio.pause()
            }
        },
        changeCurrentTime(){
            // console.log(this.currentTime)
            this.$refs.audio.currentTime = this.currentTime //点击可以，拖动不行出bug
        },
        updateTime(e){
            console.log(e.target.currentTime)
            this.currentTime = e.target.currentTime
        },
        getDuration(e){
            console.log(e.target.duration)
            this.duration = e.target.duration
            this.formatDuration = this.timeFormat(this.duration)
        },
        timeFormat(time){
            let min = parseInt(time / 60).toString().padStart(2,'0')
            let second = parseInt(time-min*60).toString().padStart(2,'0')
            return min+":"+second
        }
    },
    watch:{
        currentTime(){
            this.formatCurrentTime = this.timeFormat(this.currentTime)
        }
    }
}
</script>

<style>
    .audio-wrap {
        width: 500px;
        height: 100px;
        margin: 50px auto; /* 封装后删除 */
        padding: 10px;
        border: 1px solid #333;
        box-sizing: border-box;
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

    .audio-progress .block {
        flex: 1;
        margin: 0 10px;
    }
    
    .el-slider__bar {
        background-color: rgb(225, 62, 62);
    }

    .el-slider__button {
        border-color: rgb(225, 62, 62);
        width: 8px;
        height: 8px;
    }
</style>