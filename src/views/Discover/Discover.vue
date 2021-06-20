<template>
    <div class="discover">  
        <div class="Carousel">
            <el-carousel :interval="3000" type="card" height="250px">
                <el-carousel-item v-for="(item,index) in banners" :key="index">
                    <img class="item-img" :src="item.imageUrl" alt="banner" width="100%" height="100%" >
                </el-carousel-item>
            </el-carousel>            
        </div>
        <div class="songs-wrap">
            <h4>推荐歌单</h4>
            <div class="list">
                <ul>
                    <li class="iconfont icon-play" v-for="(item,index) in recommendList" :key="index" @click="toPlaylistDetail(item.id)">
                        <p class="first-p">{{item.copywriter}}</p>
                        <img :src="item.picUrl" alt="recommend">
                        <p class="last-p" :title="item.name">{{item.name}}</p>
                    </li>                                                                                                                    
                </ul>
            </div>
        </div>
        <div class="songs-wrap">
            <h4>最新音乐</h4>
            <ul class="new-songs">
                <li v-for="(item,index) in newSongs" :key="index">
                    <div class="music-img-wrap">
                        <img :src="item.picUrl" alt="newSongs">
                        <p class="iconfont icon-play" @click="playMusic(item)"></p>
                    </div>

                    <div class="music-info">
                        <p class="music-name">{{item.name}}</p>
                        <p class="music-singer">{{item.song.artists[0].name}}</p>
                    </div>
                </li>                                                                                                                       
            </ul>
        </div>
        <div class="songs-wrap">
            <h4>推荐MV</h4>
            <ul class="mv-list">
                <li v-for="(item,index) in newMvs" :key="index" @click="toMvDetail(item.id)">
                    <div class="mv-img-wrap">
                        <img :src="item.picUrl" alt="newMvs">
                        <p class="iconfont icon-play play"></p>
                        <p class="play-count iconfont icon-play">{{item.playCount}}</p>
                    </div>
                    <div class="mv-info">
                        <p class="title">{{item.name}}</p>
                        <p class="author">{{item.artistName}}</p>
                    </div>
                </li>                                              
            </ul>
        </div>
    </div>
</template>

<script>

import axios from 'axios'

export default {
    data(){
        return {
            banners:[],
            recommendList:[],
            newSongs:[],
            newMvs:[]
        }
    },
    created(){
        // 获取轮播图
        axios({
            url:this.URL+"/banner",
            method:'get'
        }).then(res=>{
            // console.log(res)
            this.banners = res.data.banners
        })

        // 获取推荐歌单
        axios({
            url:this.URL+"/personalized",
            method:'get',
            params:{
                limit:10
            }
        }).then(res=>{
            // console.log(res)
            this.recommendList = res.data.result
        })

        // 获取最新音乐
        axios({
            url:this.URL+"/personalized/newsong",
            method:'get'
        }).then(res=>{
            // console.log(res)
            this.newSongs = res.data.result
        })

        //获取推荐MV
        axios({
            url:this.URL+"/personalized/mv",
            method:'get'
        }).then(res=>{
            // console.log(res)
            this.newMvs = res.data.result
            for(let i=0;i<this.newMvs.length;i++){
                if(this.newMvs[i].playCount >= 100000)
                    this.newMvs[i].playCount = parseInt(this.newMvs[i].playCount/10000)+'万'
            }             
        })
    },
    methods:{
        playMusic(item){
            console.log(item)
            axios({
                url:this.URL+"/song/url",
                method:'get',
                params:{
                    id:item.id
                }
            }).then(res=>{
                // console.log(res)
                if(res.data.data[0].url){
                // console.log(res)
                this.songUrl = res.data.data[0].url

                let musicInfo = {
                    imgUrl:item.picUrl,
                    singer:item.song.artists[0].name,
                    songName:item.name                    
                }
                this.$store.commit("changeMusicUrl",this.songUrl)
                this.$store.commit("changeMusicInfo",musicInfo)

                // this.$parent.$parent.musicUrl = this.songUrl
                // // 传入歌曲信息
                // this.$parent.$parent.musicInfo = {
                //     imgUrl:item.picUrl,
                //     singer:item.song.artists[0].name,
                //     songName:item.name
                // }

                }else{
                    this.$message({
                    showClose: true,
                    message: '对不起，歌曲暂时无法播放。',
                    type: 'error'
                    });
                }
            })
        },
        toPlaylistDetail(id){
            this.$router.push(`/playlist?id=${id}`)
        },
        toMvDetail(id){
            this.$router.push(`/mvdetail?id=${id}`)
        }        
    }
}
</script>

<style scoped>

    ul {
        list-style: none;
    }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }

  .el-carousel__button {
      width: 8px;
      height: 8px;
      border-radius: 50%;
  }

  .el-carousel__indicator.is-active button {
      background-color: rgb(236, 65, 65);
  }

  .discover {
      max-width: 1300px;
      margin: 0 auto;
      padding: 20px;
  }
  
  .el-carousel__item--card{
      border-radius: 20px;
  }

  .songs-wrap {
      margin-bottom: 20px;
  }

  .songs-wrap h4 {
      color: #333;
      margin-bottom: 20px;
  }

  .songs-wrap .list ul{
      width: 100%;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
  }

  .songs-wrap .list li {
      width: 18%;
      margin: 10px 0;
      position: relative;
      overflow-y: hidden;
  }

  .list li .first-p {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      background-color: rgba(0, 0, 0, .5);
      color: #fff;
      font-size: 12px;
      padding: 5px;
      box-sizing: border-box;
      /* border-top-left-radius: 10px;
      border-top-right-radius: 10px; */
      transform: translateY(-100%);;
      transition: .5s;
  }

  .list li::before {
      content: "\e664"; 
      position: absolute;
      bottom: 25px;
      right: 5px;
      width: 35px;
      height: 35px;
      background-color: rgba(255, 255, 255, .8);
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      /* font-size: 35px; */
      color: #c0392b;
      opacity: 0;
      transition: .3s;
      cursor: pointer;
  }

  .list li:hover .first-p{
      transform: translateY(0);
  }

    .list li:hover::before{
        opacity: 1;
  }

  .songs-wrap ul img {
      width: 100%;
      border-radius: 5px;
      /* opacity: 1; */
  }

  .songs-wrap ul .last-p {
      font-size: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
  }

    /* 最新音乐  */
  .new-songs {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
  }

  .new-songs li {
      width: 50%;
      display: flex;
      padding: 10px;
      box-sizing: border-box;
      position: relative;
  }

  .new-songs li:hover {
      background-color: #ddd;
  }

   .new-songs li:hover::before {
       opacity: 1;
  }

    .music-img-wrap {
        position: relative;
        width: 100px;
        cursor: pointer;
    }

    .music-img-wrap:hover p::before {
        opacity: 1;
    }

  .music-img-wrap p::before {
      content: "\e664"; 
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      width: 35px;
      height: 35px;
      background-color: rgba(255, 255, 255, .8);
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #c0392b;
      opacity: 0;
      transition: .3s;
      cursor: pointer;
  }

  .music-info {
      flex: 1;
      padding: 0 10px;
  }

  .new-songs li p:first-child {
      margin-bottom: 20px;
  }

  .music-singer {
      color: #a5a1a1;
  }


    /* 推荐MV  */
  .mv-list {
      display: flex;
      justify-content: space-between;
  }

  .mv-list li {
      width: 25%;
      padding: 0 10px;
  }

  .mv-img-wrap {
      position: relative;
      cursor: pointer;
  }

  .mv-img-wrap:hover .play::before {
      opacity: 1;
  }

  .mv-img-wrap .play::before {
      content: "\e664"; 
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      width: 35px;
      height: 35px;
      background-color: rgba(255, 255, 255, .8);
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #c0392b;
      opacity: 0;
      transition: .3s;
      cursor: pointer;
  }

  .play-count{
      position: absolute;
      top: 5px;
      right: 5px;
      color: #fff;
  }

  .play-count::before {
      margin-right: 5px;
  }

 .mv-info p{
     margin: 5px 0;
 }

  .mv-info .author{
      color: #a5a1a1;
      font-size: 12px;
  }
</style>