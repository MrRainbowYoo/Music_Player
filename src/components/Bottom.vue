<template>
  <div class="bottom">
      <div class="music-box">
        <div class="img-wrap el-icon-arrow-up" @click="toSongDetail()" title="打开音乐详情页">
            <img :src="globalMusicInfo.imgUrl ? globalMusicInfo.imgUrl : defaultImg" alt="">
        </div>
        <div class="music-info" v-show="globalMusicInfo.songName">
            <span class="music-name" :title="globalMusicInfo.songName">{{globalMusicInfo.songName}}</span>
            <span class="music-singer" :title="globalMusicInfo.singer">{{globalMusicInfo.singer}}</span>
        </div>
        <span class="music-name" v-show="!globalMusicInfo.songName" style="line-height:50px">还没有播放音乐哦</span>
      </div>
      <audio :src="globalMusicUrl" autoplay controls></audio>
  </div>
</template>

<script>
export default {
    data(){
        return{
            defaultImg: require("@/assets/imgs/defaultImg.png"),
            musicUrl:""
        }
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
        }
    },
    methods:{
        toSongDetail(){
            this.$parent.show = !this.$parent.show
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

</style>