<template>
    <div class="artist">
        <div class="artist-info">
            <div class="artist-img-wrap">
                <img v-lazy="topInfo.picUrl" alt="">
            </div>
            <div class="artist-others">
                <div class="artist-name">{{topInfo.name}}</div>
                <div class="artsit-works">
                    <div class="artist-works-count">单曲数：{{topInfo.musicSize}}</div>
                    <div class="artist-works-count">专辑数：{{topInfo.albumSize}}</div>
                    <div class="artist-works-count">MV数：{{mvData.length}}</div>
                </div>
            </div>
        </div>

        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="专辑" name="album">
                <ul class="albums">
                    <li class="al-item" v-for="(item,index) in albumData" :key="index">
                        <div class="al-img-wrap">
                            <p class="iconfont icon-play bofang"></p>
                            <img v-lazy="item.picUrl" alt="">
                        </div>
                        <div class="al-name" :title="item.name">{{item.name}}</div>
                        <div class="al-time">{{item.publishTime | formatDate}}</div>
                    </li>
                </ul>
            </el-tab-pane>
            <el-tab-pane label="MV" name="mv">
                <ul class="artist-mv">
                    <li class="mv-item" v-for="(item,index) in mvData" :key="index">
                        <div class="al-img-wrap mv-img-wrap">
                            <p class="iconfont icon-play bofang"></p>
                            <img v-lazy="item.imgurl" alt="">
                            <p class="play-count iconfont icon-play">{{item.playCount | dealPlayCount}}</p>
                        </div>
                        <div class="al-name" :title="item.name">{{item.name}}</div>                     
                    </li>
                </ul>
            </el-tab-pane>
            <el-tab-pane label="歌手详情" name="detail">歌手详情</el-tab-pane>
            <el-tab-pane label="相似歌手" name="similar">相似歌手</el-tab-pane>
        </el-tabs>        
    </div>
</template>

<script>
import axios from 'axios';
export default {
    data(){
        return {
            xx:require('@/assets/imgs/mvDemo.jpg'),
            activeName:'album',
            topInfo:{},
            albumData:[],
            mvData:[]
        }
    },
    created(){
        this.getAlbumData()
        this.getMVData()
    },
    methods:{
        handleClick(tab, event) {
            console.log(tab, event);
        },
        getAlbumData(){
            axios({
                url:this.URL+'/artist/album',
                method:'get',
                params:{
                    id:6452,
                    limit:50,
                    offset:0
                }
            }).then(res=>{
                // console.log(res)
                this.topInfo = {
                    albumSize:res.data.artist.albumSize,
                    musicSize:res.data.artist.musicSize,
                    name:res.data.artist.name,
                    picUrl:res.data.artist.picUrl
                }
                this.albumData = res.data.hotAlbums
            })
        },
        getMVData(){
            axios({
                url:this.URL+'/artist/mv',
                method:'get',
                params:{
                    id:6452,
                    limit:50,
                    offset:0
                }
            }).then(res=>{
                console.log(res)
                this.mvData = res.data.mvs
            })
        }        
    },
    filters:{
        formatDate(now) { 
            now = new Date(now)
            var year=now.getFullYear();  //取得4位数的年份
            var month=(now.getMonth()+1).toString().padStart(2,'0');  //取得日期中的月份，其中0表示1月，11表示12月
            var date=now.getDate().toString().padStart(2,'0');      //返回日期月份中的天数（1到31）
            return year+"-"+month+"-"+date; 
        },
        dealPlayCount(count) {
          if(count >= 100000)
            return parseInt(count/10000)+'万'            
        }
    }
}
</script>

<style scoped>
    .artist {
      max-width: 1300px;
      margin: 0 auto;
      padding: 20px;        
    }

    .artist >>> .el-tabs__item{
        font-size: 14px;
    }

    .artist-info {
        display: flex;
        font-size: 14px;
        margin-bottom: 20px;
    }

    .artist-img-wrap {
        width: 160px;
        height: 160px;
        margin-right: 50px;
    }

    .artist-img-wrap img {
        width: 100%;
        height: 100%;
    }

    .artist-name {
        font-weight: bold;
        font-size: 22px;
    }

    .artsit-works {
        margin-top: 20px;
        display: flex;
    }

    .artist-works-count:nth-of-type(2) {
        margin: 0 20px;
    }

    /* tabs部分 */
    /* 专辑 */
    .albums {
        display: grid;
        grid-template-columns: repeat(4,1fr);
        gap: 20px;
        /* justify-items: center; */
        align-items: center;
    }

    .al-item {
        font-size: 14px;
        width: 80%;
    }

    .al-img-wrap {
        width: 100%;
        position: relative;
    }

    .al-img-wrap img {
        width: 100%;
        border-radius: 10px;
    }

    .al-img-wrap .bofang::before {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        width: 50px;
        height: 50px;
        background-color: rgba(255, 255, 255, .8);
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #c0392b;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        transition: .5s;
    }

    .al-img-wrap:hover .bofang::before{
        opacity: 1;
    }

    .al-name {
        margin: 5px 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .al-time {
        color: grey;
    }

    /* MV */
    .artist-mv {
        display: grid;
        gap: 20px;
        grid-template-columns: repeat(4,1fr);
    }

    .mv-item {
        width: 300px;        
    }

    .play-count{
        position: absolute;
        top: 5px;
        right: 5px;
        color: #fff;
    }    
</style>