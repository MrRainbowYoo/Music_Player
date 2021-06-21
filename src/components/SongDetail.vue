<template>
    <transition leave-active-class="closeWindow">
        <div class="song-detail" v-show="!show">
            <i class="el-icon-arrow-down" @click="close"></i>
            <div class="content">
                <div class="img-box">
                    <img :src="playerBar" alt="" :class="{'player-bar isplay':!isMusicPaused,'player-bar':isMusicPaused}">
                    <div class="img-wrap-rotate">
                        <img :src="globalMusicInfo.imgUrl?globalMusicInfo.imgUrl:defaultImgUrl" alt="" :class="{'running':!isMusicPaused,'paused':isMusicPaused}">
                    </div>
                </div>
                
                <div class="song-wrap">
                    <h2>{{globalMusicInfo.songName}}</h2>
                    <span class="song-info">{{globalMusicInfo.singer}}</span>
                    <div class="lyric-wrap">
                        <el-scrollbar style="height:100%">
                            <p v-for="(item,index) in lyric" :key="index" :class="{'active-lyric':currentIndex===index}">{{item.lyricWords}}</p>
                        </el-scrollbar>
                    </div>

                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import axios from 'axios'
export default {
    data(){
        return {
            playerBar:require("../assets/imgs/player_bar.png"),
            defaultImgUrl:require("@/assets/imgs/defaultImg.png"),
            lyric:[],
            currentIndex:0
        }
    },
    props:{
        show:Boolean
    },
    methods:{
        close(){
            this.$parent.show = true
        },
        getLyric(id){
            axios({
                url:this.URL+'/lyric',
                method:'get',
                params:{
                    id
                }
            }).then(res=>{
                // console.log(res)
                // console.log(res.data.lrc.lyric)
                let lyricStr = res.data.lrc.lyric
                let lyricList = lyricStr.split("\n")
                let lyric = []
                for(let item of lyricList){
                    // console.log(item)
                    // 截取时间 去掉[]
                    let end = item.indexOf(']')
                    let time = item.slice(1,end)
                    let currentTime = this.timeFormat(time)

                    // 截取歌词,正则表达式去除[]及其包括的内容
                    let lyricWords = item.replace(/\[.*?\]/g,'')
                    // let lyricWords = item.slice(end+1).trim()
                    lyric.push({
                        currentTime,
                        lyricWords
                    })
                }
                this.lyric = lyric
            })
        },
        timeFormat(time){
            let minute = parseInt(time.split(":")[0])
            let second = Math.ceil(time.split(":")[1])
            let currentTime = minute * 60 + second
            return currentTime
        },
        lryicActive(time){
            for(let i=0;i<this.lyric.length;i++){
                if(this.lyric[i].currentTime == Math.ceil(time)){
                    // console.log(`第${i}句，时间为${this.lyric[i].currentTime},${this.lyric[i].lyricWords}`)
                    this.currentIndex = i
                    let _view = document.querySelector(".el-scrollbar__view")
                    // let top = parseInt(window.getComputedStyle(_view).top)
                    _view.style.transform = `translate3d(0,${80 - i * 27}px,0)`
                }
            }
        }
    },
    computed:{
        globalMusicInfo(){
            return this.$store.state.globalMusicInfo
        },
        globalCurrentTime(){
            return this.$store.state.globalCurrentTime
        },
        isMusicPaused(){
            return this.$store.state.isMusicPaused
        }
    },
    watch:{
        show(){
            if(this.show == false)
            {
                let id = this.$store.state.globalMusicInfo.id
                this.getLyric(id)
            }
        },
        globalCurrentTime(){
            this.lryicActive(this.globalCurrentTime)
        }
    }
}
</script>

<style>
    ul{
        list-style: none;
    }

    .el-scrollbar__view {
        position: relative;

        transform: translate3d(0,80px,0);
        transition: .6s ease-out;
    }

    .song-detail {
        width: 100%;
        height: calc(100% - 60px);

        /* 歌词界面全屏 */
        /* height: 100%;
        z-index: 1; */

        background: linear-gradient(to left top, rgb(60, 50, 62), rgb(77, 70, 88));
        position: fixed;
        top: 100%;
        color: #fff;

        animation-duration: .5s;
        animation-name: showWindow;
        animation-fill-mode: forwards;
        animation-timing-function: ease-out;        
    }
    @keyframes showWindow {
        from{
            top: 100%;
        }
        to{
            top: 0;
        }
    }

    @keyframes closeWindow {
        from{
            top: 0;
        }
        to{
            top: 100%;
        }
    }    

    .closeWindow {
        animation-duration: .3s;
        animation-name: closeWindow;
        animation-fill-mode: forwards;
        animation-timing-function: ease-out;
    }

    .song-detail i{
        margin: 10px;
        font-size: 23px;
        cursor: pointer;
        opacity: .28;
        padding: 5px;
        border-radius: 50%;
    }

    .song-detail i:hover {
        background-color: rgb(176, 174, 179);
    }

    .content {
        display: flex;
        padding: 10px 100px;
    }

    .content .img-box {
        width: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        margin-top: 120px;
    }

    .player-bar {
        position: absolute;
        left: 50%;
        top: -10px;
        z-index: 10;
        transform: rotate(-25deg);
        transform-origin: 12px 12px;
        transition: 1s;
    }

    .isplay {
        transform: rotate(0);
    }

    .running {
        animation-play-state: running;
    }

     .paused {
        animation-play-state: paused;   
    }   

    .img-wrap-rotate {
        position: relative;
        width: 400px;
        height: 400px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 50px 0;
    }

    .img-wrap-rotate::after {
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: rgba(0, 0, 0, .3);
    }

    .img-wrap-rotate::before {
        content: "";
        position: absolute;
        width: 90%;
        height: 90%;
        border-radius: 50%;
        background-color: #000;
    }    

    .img-wrap-rotate img {
        width: 70%;
        height: 70%;
        border-radius: 50%;
        position: relative;

        animation-name: rotation;
        animation-duration: 30s;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
    }

    @keyframes rotation {
        from{
            transform: rotate(0);
        }
        to{
            transform: rotate(360deg);
        }
    }

    span.song-info {
        margin: 5px 0 60px 0;
        font-size: 16px;
        opacity: .28;
    }

    .song-wrap {
        flex: 1;
        display: flex;
        flex-direction: column;
    }

    .song-wrap h2 {
        font-weight: normal;
        font-size: 23px;
    }

    .lyric-wrap {
        height: 600px;
        width: 80%;
    }

    .lyric-wrap p {
        padding: 18px;
        font-size: 28px;
        opacity: .28;
        cursor: default;
        border-radius: 12px;
    }

    .lyric-wrap p:hover {
        background-color: rgb(176, 174, 179);
    }

    .active-lyric {
        font-weight: bold;
        font-size: 15px;
        opacity: 1 !important;
    }
</style>