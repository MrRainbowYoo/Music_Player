<template>
  <div class="bottom">
      <div class="music-box">
        <div class="img-wrap">
            <img :src="musicInfo.imgUrl ? musicInfo.imgUrl : defaultImg" alt="">
        </div>
        <div class="music-info" v-show="musicInfo.songName">
            <span class="music-name" :title="musicInfo.songName">{{musicInfo.songName}}</span>
            <span class="music-singer" :title="musicInfo.singer">{{musicInfo.singer}}</span>
        </div>
        <span class="music-name" v-show="!musicInfo.songName" style="line-height:50px">还没有播放音乐哦</span>
      </div>
      <audio :src="musicUrl" autoplay controls></audio>
  </div>
</template>

<script>
export default {
    data(){
        return{
            defaultImg: require("../imgs/defaultImg.png")
        }
    },
    props:{
        musicUrl:String,
        musicInfo:Object
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

</style>