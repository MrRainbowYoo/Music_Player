<template>
    <div class="artist" v-loading="loading">
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
                    <li class="al-item" v-for="(item,index1) in albumData" :key="index1" @click="toAlbum(item.id)">
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
                    <li class="mv-item" v-for="(item,index2) in mvData" :key="index2" @click="toMvDetail(item.id)">
                        <div class="al-img-wrap mv-img-wrap">
                            <p class="iconfont icon-play bofang"></p>
                            <img v-lazy="item.imgurl" alt="">
                            <p class="play-count iconfont icon-play">{{item.playCount | dealPlayCount}}</p>
                        </div>
                        <div class="al-name" :title="item.name">{{item.name}}</div>                     
                    </li>
                    <span v-if="mvData.length==0">暂无MV</span>                    
                </ul>
            </el-tab-pane>
            <el-tab-pane label="歌手详情" name="detail">

                <span class="detail-title">个人简介</span>
                <p class="detail-words" v-for="(y,index3) in briefDescList" :key="index3">{{y}}</p>

                <div v-for="(item,index4) in introduction" :key="index4+999">
                    <span class="detail-title">{{item.ti}}</span>
                    <p class="detail-words" v-for="(x,i) in item.strList" :key="i">{{x}}</p>                    
                </div>

            </el-tab-pane>
            <el-tab-pane label="相似歌手" name="similar">
                <ul class="simi">
                    <li class="simi-item" v-for="(item,index) in simi" :key="index" @click="toArtist(item.id)">
                        <div class="simi-img-wrap">
                            <img v-lazy="item.picUrl" alt="">
                        </div>
                        <div class="simi-name">{{item.name}}</div>
                    </li>
                    <span v-if="simi.length==0">暂无相似歌手</span>
                </ul>                
            </el-tab-pane>
        </el-tabs>        
    </div>
</template>

<script>
import { artistsAPI } from '@/utils/api'

export default {
    data(){
        return {
            artistId:'',
            activeName:'album',
            topInfo:{},
            albumData:[],
            mvData:[],
            briefDescList:[],
            introduction:[],
            simi:[],
            loading:true
        }
    },
    created(){
        this.artistId = this.$route.query.artistId

        this.getAlbumData()
        this.getMVData()
    },
    methods:{
        handleClick(tab) {
            this.loading = true
            if(tab.label == "相似歌手")
                this.getSimi()
            else if(tab.label == "歌手详情")
                this.getArtistInfo()
            setTimeout(() => {
                this.loading = false
            }, 1000);
        },
        getAlbumData(){
            let params = {
                id:this.artistId,
                limit:50,
                offset:0                
            }
            artistsAPI(params,'album').then(res=>{
                console.log(res)
                this.topInfo = {
                    albumSize:res.data.artist.albumSize,
                    musicSize:res.data.artist.musicSize,
                    name:res.data.artist.name,
                    picUrl:res.data.artist.picUrl
                }
                this.albumData = res.data.hotAlbums             
            }).then(()=>{
                this.loading = false
            })
        },
        getMVData(){
            let params = {
                id:this.artistId,
                limit:50,
                offset:0               
            }
            artistsAPI(params,'mv').then(res=>{
                // console.log(res)
                this.mvData = res.data.mvs
            })
        },
        getArtistInfo(){
            artistsAPI({id:this.artistId},'desc').then(res=>{
                // console.log(res)
                let l = res.data.briefDesc.split(/[\n]/)
                this.briefDescList = l

                this.introduction = res.data.introduction
                let strList = []
                for(let item of this.introduction){
                    strList = item.txt.split(/[\n]/)
                    item.strList = strList
                }
            })                            
        },
        getSimi(){
            artistsAPI({id:this.artistId},'simi').then(res=>{
                console.log(res)
                this.simi = res.data.artists
            })
        },
        toMvDetail(id) {
            this.$router.push(`/mvdetail?id=${id}`)
        },
        toArtist(id){
            this.$router.push(`/artist?artistId=${id}`)
        },
        toAlbum(id){
            this.$router.push(`/album?id=${id}`)
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
            return count >= 100000 ? parseInt(count/10000)+'万' : count
        }
    },
    watch:{
        $route(newVal){
            this.artistId = newVal.query.artistId
            this.getAlbumData()
            this.getMVData()

            setTimeout(() => {
                this.activeName = "album"                
                this.loading = false
            }, 0);            
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

    .artist >>> .el-loading-spinner {
      top: 15%;
    }

    .artist-info {
        display: flex;
        font-size: 14px;
        margin-bottom: 20px;
    }

    .artist-img-wrap {
        width: 200px;
        height: 200px;
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
        align-items: center;
    }

    .al-item {
        font-size: 14px;
        width: 300px;
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
        text-shadow: 0 0 2px rgb(0, 0, 0);
    }  
    
    /* 歌手详情 */
    .detail-title {
        font-weight: bold;
        font-size: 20px;
        display: inline-block;
        margin: 10px 0;
    }

    .detail-words {
        line-height: 2.5rem;
        text-indent: 2rem;
        margin: 1rem 0;
        /* white-space: pre-line;  */
    }

    /* 相似歌手 */
    .simi {
        display: grid;
        grid-template-columns: repeat(5,1fr);
        gap: 20px;
    }

    .simi-item {
        width: 80%;
    }

    .simi-img-wrap {
        width: 100%;
        height: 0;
        padding-bottom: 100%;
        position: relative;
        cursor: pointer;
    }

    .simi-img-wrap img {
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 10px;
    }

    .simi-name {
        font-size: 14px;
        color: grey;
        text-align: center;
        margin: 10px 0;        
    }
</style>