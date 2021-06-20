<template>
    <div class="song-detail" v-show="!show">
        <i class="el-icon-arrow-down" @click="close"></i>
        <div class="content">
            <div class="img-box" style="border:1px solid #333">
                <img :src="playerBar" alt="" :class="{'player-bar isplay':isPlay,'player-bar':!isPlay}">
                <div class="img-wrap">
                    <img src="./7.jpg" alt="" :class="{'running':isPlay,'paused':!isPlay}">
                </div>
                <button @click="test">测试播放</button>
            </div>
            
            <div class="song-wrap" style="border:1px solid #333">
                <h2>平凡的一天</h2>
                <span class="song-info">毛不易-平凡的一天</span>
                <div class="lyric-wrap">
                    <p>每个早晨七点半就自然醒</p>
                    <p>风铃响起又是一天云很轻</p>
                    <p>晒好的衣服味道很安心</p>
                    <p>一切都是柔软又宁静</p>
                    <p>每个路口花都开在阳光里</p>
                                        <p>每个早晨七点半就自然醒</p>
                    <p>风铃响起又是一天云很轻</p>
                    <p>晒好的衣服味道很安心</p>
                    <p>一切都是柔软又宁静</p>
                    <p>每个路口花都开在阳光里</p>
                                        <p>每个早晨七点半就自然醒</p>
                    <p>风铃响起又是一天云很轻</p>
                    <p>晒好的衣服味道很安心</p>
                    <p>一切都是柔软又宁静</p>
                    <p>每个路口花都开在阳光里</p>
                                        <p>每个早晨七点半就自然醒</p>
                    <p>风铃响起又是一天云很轻</p>
                    <p>晒好的衣服味道很安心</p>
                    <p>一切都是柔软又宁静</p>
                    <p>每个路口花都开在阳光里</p>
                </div>

            </div>
            <div class="others" style="border:1px solid #333">
                <p>123</p>
                <p>456</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            playerBar:require("../assets/imgs/player_bar.png"),
            isPlay:false
        }
    },
    props:{
        show:Boolean
    },
    methods:{
        close(){
            this.$parent.show = true
        },
        test(){
            this.isPlay = !this.isPlay
        }
    }
}
</script>

<style scoped>
    ul{
        list-style: none;
    }

    .song-detail {
        width: 100%;
        height: calc(100% - 60px);
        /* background-color: #ecf0f1; */
        background: linear-gradient(to bottom,#bdc3c7,rgb(231, 233, 235) 5%,#ecf0f1);
        position: fixed;
        top: 100%;
        animation-duration: .5s;
        animation-name: mask;
        animation-fill-mode: forwards;
    }
    @keyframes mask {
        to{
            top: 0;
        }
    }

    .song-detail i{
        margin: 10px;
        cursor: pointer;
    }

    .content {
        display: flex;
        padding: 10px 20px;
    }

    .content .img-box {
        width: 400px;
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
    }

    .player-bar {
        position: absolute;
        left: 200px;
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

    .img-wrap {
        position: relative;
        width: 300px;
        height: 300px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 50px 0;
    }

    .img-wrap::after {
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: rgba(0, 0, 0, .3);
    }

    .img-wrap::before {
        content: "";
        position: absolute;
        width: 90%;
        height: 90%;
        border-radius: 50%;
        background-color: #000;
    }    

    .img-wrap img {
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
        margin: 5px 0 20px 0;
        font-size: 14px;
        color: #545657;
    }

    .song-wrap {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .lyric-wrap {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        height: 500px;
        overflow-y: scroll;
    }

    .lyric-wrap p {
        margin: 5px 0;
        font-size: 14px;
        color: #545657;
    }

    .others {
        width: 20%;
    }

</style>