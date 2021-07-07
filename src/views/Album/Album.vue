<template>
    <div class="playlist"  v-loading="loading">
        <div class="playlist-top-card">
            <div class="playlist-img-wrap">
                <img :src="albumInfo.picUrl" alt="">
            </div>
            <div class="playlist-info">
                <div class="playlist-name">
                    <div class="tag1">专辑</div>{{albumInfo.name}}
                </div>
                <div class="playlist-user-info">
                    <div class="playlist-user-name">歌手：{{artistName}}</div>
                    <div class="playlist-user-name">时间：{{albumInfo.publishTime}}</div>
                    <div class="playlist-user-name">共{{albumInfo.size}}首</div>
                </div>
                <div class="playAllBtn iconfont icon-play" @click="playAll"> 播放全部</div>
            </div>
        </div>

        <div class="playlist-tabs-wrap">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="歌曲列表" name="first">
                    <div class="songs-table">
                        <el-table
                            :data="tableData"
                            stripe
                            @row-dblclick="play">

                            <el-table-column type="index" width="50"></el-table-column>

                            <el-table-column prop="name" label="音乐标题" width=""></el-table-column>

                            <el-table-column prop="ar[0].name" label="歌手" width="">
                                <template slot-scope="scope">
                                    <span style="cursor:pointer;color:#2980b9;" @click="toArtist(scope.row.ar[0].id)">{{scope.row.ar[0].name}}</span>
                                </template>                                
                            </el-table-column>                            

                            <el-table-column prop="al.name" label="专辑" >
                                <template slot-scope="scope">
                                    <span style="cursor:pointer;color:#2980b9;" @click="toAlbum(scope.row.al.id)">{{scope.row.al.name}}</span>
                                    <span class="plus" title="添加至歌单" @click="addToQueue(scope.row,$event)">+</span>
                                </template>                                
                            </el-table-column>

                            <el-table-column prop="dt" label="时长" width="100"></el-table-column>                            
                        </el-table>
                    </div>                    
                </el-tab-pane>
                <el-tab-pane :label="`评论(${commentCount})`" name="second">

                    <div class="comment-wrap" v-if="hotComments.length!=0">
                        <h4 class="comment-title">最热评论({{hotComments.length}})</h4>
                        <ul>
                            <li v-for="(item,index) in hotComments" :key="index">
                                <img v-lazy="item.user.avatarUrl" alt="" class="comment-avatar">
                                <div class="comment-info">
                                    <div class="comment">
                                        <span class="comment-user">{{item.user.nickname}}:</span>
                                        <span class="comment-content">{{item.content}}</span>
                                    </div>
                                    <div class="re-comment" v-if="item.beReplied.length!=0">
                                        <span class="comment-user">@{{item.beReplied[0].user.nickname}}:</span>
                                        <span class="comment-content">{{item.beReplied[0].content}}</span>
                                    </div>
                                    <div class="comment-bottom">
                                        <p class="comment-time">{{item.time}}</p>
                                        <span class="comment-time iconfont icon-dianzan">{{item.likedCount}}</span>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div class="comment-wrap">
                        <h4 class="comment-title">最新评论({{commentCount-hotComments.length}})</h4>
                        <ul>
                            <li v-for="(item,index) in comments" :key="index">
                                <img v-lazy="item.user.avatarUrl" alt="" class="comment-avatar">
                                <div class="comment-info">
                                    <div class="comment">
                                        <span class="comment-user">{{item.user.nickname}}:</span>
                                        <span class="comment-content">{{item.content}}</span>
                                    </div>
                                    <div class="re-comment" v-if="item.beReplied.length!=0">
                                        <span class="comment-user">@{{item.beReplied[0].user.nickname}}:</span>
                                        <span class="comment-content">{{item.beReplied[0].content}}</span>
                                    </div>                                    
                                    <div class="comment-bottom">
                                        <p class="comment-time">{{item.time}}</p>
                                        <span class="comment-time iconfont icon-dianzan">{{item.likedCount}}</span>
                                    </div>

                                </div>
                            </li>
                        </ul>
                            <div class="page-wrap">
                                <el-pagination
                                @current-change="handleCurrentChange"
                                background
                                layout="prev, pager, next"
                                :total="total"
                                :page-size="pageSize"
                                :current-page="page">
                                </el-pagination>            
                            </div>  
                    </div>


                </el-tab-pane>
                <el-tab-pane label="专辑详情" name="third">
                    <span class="tt">专辑介绍</span>
                    <p v-for="(item,index) in albumDescList" :key="index" class="dd">{{item}}</p>
                </el-tab-pane>
            </el-tabs>     
        </div>
        <div class="add-ball iconfont icon-yinfu" v-show="showAddBall" ref="addBall"></div>     
    </div>
</template>

<script>
import axios from 'axios'
import {formatDate,formatDateFully} from '../../utils/utils'

export default {
    data(){
        return {
            activeName:'first',
            albumId:"",            
            albumInfo:{},
            artistName:"",
            commentCount:0,
            albumDescList:"",            
            tableData:[],
            comments:[],
            hotComments:[],
            total:0,
            pageSize:10,
            page:1,
            loading:true,
            showAddBall:false            
        }
    },
    created(){
        console.log(this.$route.query.id)
        this.albumId = this.$route.query.id

        this.getTableData()
        this.getComments(true)    
    },
    computed:{
        nowIndex(){
            return this.$store.state.nowIndex
        },
        musicQueue(){
            return this.$store.state.musicQueue
        },
        queuePos(){
            return this.$store.state.queuePos
        }        
    },
    methods:{
        handleClick(tab) {
            console.log(tab)
        },
        toArtist(id){
            this.$router.push(`/artist?artistId=${id}`)
        },          
        handleCurrentChange(page){
            this.page = page
            this.getComments()
        },
        addToQueue(row,e){
            // console.log(row)
            let obj = {
                id:row.id,
                imgUrl:row.al.picUrl,
                duration:row.dt,
                singer:row.ar[0].name,
                artistId:row.ar[0].id,
                songName:row.name
            }

            let ids = []
            for (const item of this.musicQueue) {
                ids.push(item.id)
            }
            if(ids.indexOf(obj.id) == -1){
                this.beginAnimation(e.x,e.y)

                setTimeout(() => {
                    this.$store.commit('changeQueueStyle','add')      
                    this.$store.commit('changeMusicQueue',obj)  
                }, 500);
         

                setTimeout(() => {
                    this.$store.commit('changeQueueStyle','normal')                   
                }, 1000);
            }else{
                this.$message({
                    type:'warning',
                    message:"已存在播放列表哦",
                    showClose:true
                })
            }            
        },
        beginAnimation(x,y){
            this.showAddBall = true
            let endX = this.queuePos.left
            let endY = this.queuePos.top
            console.log('起始位置 x:'+x+' y:'+y)
            console.log('终点位置 x:'+endX+' y:'+endY)

            let el = document.querySelector(".add-ball")
            el.style.left = x+'px'
            el.style.top = y+'px'
            
            setTimeout(() => {
                el.style.left = endX+'px'
                el.style.top = endY+'px'
            }, 0);

            setTimeout(() => {
                this.showAddBall = false
            }, 500);
        },                
        getTableData(){
            axios({
                url:this.URL+'/album',
                method:'get',
                params:{
                    id:this.albumId
                }
            }).then(res=>{
                console.log(res)
                this.albumInfo = res.data.album
                this.commentCount = this.albumInfo.info.commentCount
                this.artistName = res.data.album.artist.name
                this.albumInfo.publishTime = formatDate(new Date(this.albumInfo.publishTime))
                for(let item of res.data.songs){
                    let duration = item.dt
                    let min = parseInt(duration / 60000).toString().padStart(2,'0')
                    let second = parseInt((duration-min*60000)/1000).toString().padStart(2,'0')
                    item.dt =  `${min}:${second}`                      
                }
                this.tableData = res.data.songs

                let albumDesc = this.albumInfo.description
                this.albumDescList = albumDesc.split(/[\n]/)

                // setTimeout(()=>{
                //     this.loading = false
                // },500)
            })
        },                
        play(row){
            console.log(row)
            let id = row.id
            axios({
                url:this.URL+"/song/url",
                method: "get",
                params:{
                id
                }
            }).then(res=>{
                if(res.data.data[0].url){
                this.songUrl = res.data.data[0].url
                
                let musicInfo = {
                    imgUrl:row.al.picUrl,
                    singer:row.ar[0].name,
                    songName:row.name,
                    id:row.id,
                    duration:row.dt              
                }

                this.$store.commit("changeMusicUrl",this.songUrl)
                this.$store.commit("changeMusicInfo",musicInfo)
                this.$store.commit("changeMusicStatus",false)
                this.$store.commit("changeMusicQueue",musicInfo)

                let ids = []
                for (const item of this.musicQueue) {
                    ids.push(item.id)
                }
                this.$store.commit("changeNowIndex",ids.indexOf(musicInfo.id))

                }else{
                    this.$message({
                    showClose: true,
                    message: '对不起，歌曲暂时无法播放。',
                    type: 'error'
                    });
                }
            })
        },        
        getComments(isFirst=false){
            this.loading = true
            axios({
                url:this.URL+'/comment/album',
                method:'get',
                params:{
                    id:this.albumId,
                    limit:this.pageSize,
                    offset:(this.page-1)*this.pageSize
                }
            }).then(res=>{
                console.log(res)

                for(let item of res.data.comments){
                    item.time = formatDateFully(new Date(item.time))
                }
                
                if(isFirst){
                    if(Object.prototype.hasOwnProperty.call(res.data,'hotComments')){
                        for(let item of res.data.hotComments){
                            item.time = formatDateFully(new Date(item.time))
                        }
                        this.hotComments = res.data.hotComments
                    }              
                }

                this.total = this.commentCount - this.hotComments.length    
                this.comments = res.data.comments                    
            })

            setTimeout(() => {
                this.loading = false
            }, 500);
        },
        playAll(){
            let allSongs = this.tableData
            this.$store.commit('clearMusicQueue')
            for (const item of allSongs) {
                let obj = {
                    duration:item.dt,
                    id:item.id,
                    imgUrl:item.al.picUrl,
                    singer:item.ar[0].name,
                    songName:item.name
                }
                this.$store.commit('changeMusicQueue',obj)
            }
            // 若第一首歌无版权无法播放，会出现bug，自动播放也是
            this.$store.commit('changeNowIndex',0)
            this.play(allSongs[0])
        },
        toAlbum(id){
            this.$router.push(`/album?id=${id}`)
        }          
    },
    watch:{
        $route(newVal){
            this.albumId = newVal.query.id
            this.getTableData()
            this.getComments(true)

            setTimeout(() => {
                this.activeName = "first"                
                this.loading = false
            }, 0);            
        }
    }     
}
</script>

<style scoped>
    .add-ball {
        position: fixed;
        color: rgb(236, 65, 65);
        transition: top .5s ease-in,left .5s linear;
    }

    ul {
        list-style: none;
    }

    .playlist {
      max-width: 1300px;
      margin: 0 auto;
      padding: 20px;        
    }

    .playlist-top-card {
        display: flex;
        /* height: 300px; */
    }

    .playlist-img-wrap {
        width: 200px;
        height: 200px;
    }

    .playlist-img-wrap img {
        width: 100%;
        height: 100%;
    }

    .playlist-info {
        /* font-size: 16px; */
        padding: 0 20px;
        flex: 1;
    }

    .playlist-info .tag1 {
        color: rgb(208, 53, 53);
        border: 1px solid rgb(208, 53, 53);
        display: inline-block;
        font-size: 20px;
        margin-right: 10px;
        border-radius: 5px;
        padding: 0px 7px;
        cursor: default;
    }

    .playlist-name {
        font-size: 25px;
        font-weight: 600;
        display: flex;
        align-items: center;
    }

    .playlist-user-info {
        /* display: flex; */
        align-items: center;
        font-size: 14px;
    }

    .playlist-user-info img {
        margin: 10px 0;
    }

    .playlist-user-avatar img {
        height: 30px;
        width: 30px;
        border-radius: 50%;
    }

    .playlist-user-name {
        margin: 20px 10px;
    }

    .playAllBtn {
        display: inline-block;
        margin-right: 10px;
        border-radius: 20px;
        background: #d03535;
        padding: 5px 15px;
        color: #fff;
        cursor: pointer;
    }

    .playlist-tags {
        margin: 10px 0;
    }

    .playlist-desc {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
    }

    .playlist-desc span:nth-of-type(2){
        font-size: 14px;
    }

    .playlist-tags .tags {
        font-size: 14px;
    }

    .playlist-tags .tags:not(:last-of-type)::after {
        content: '/';
        margin: 0 4px;
    }

    .playlist-tabs-wrap {
        margin-top: 20px;
    }

  .el-table td, .el-table th.is-leaf {
    border-bottom: none;
  }

  .el-table::before {
    opacity: 0;
  }

  .songs-table {
    width: 100%;
  }

  .img-wrap {
    width: 60px;
    height: 60px;
    position: relative;
  }

  .img-wrap img {
    width: 100%;
    height: 100%;
    border-radius: 10px;
  }

  .img-wrap p::before {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 30px;
    height: 30px;
    background-color: rgba(255, 255, 255, .8);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #c0392b;
    font-size: 14px;
    cursor: pointer;
  }
  
  .comment-title {
    margin-bottom: 20px;
  }

  .comment-wrap ul li {
    display: flex;
    margin: 10px 0 30px 0;
  }

  .comment-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }

  .comment-info {
    flex: 1;
    font-size: 14px;
    margin-left: 10px;
  }

  .comment {
    margin-bottom: 10px;
  }

  .comment-user {
    color: #517eaf;
    margin-right: 10px;
    cursor: pointer;
  }

  .comment-content {
    display: inline;
  }

  .comment-time {
    color: grey;
    margin-right: 20px;
    margin-top: 5px;
  }

  .comment-bottom {
    display: flex;
    align-items: center;
    font-size: 14px!important;
  }

  .re-comment {
    background-color: #f3f1f3;
    padding: 5px 10px;
    color: rgba(0,0,0,.6);
    margin-bottom: 5px;
  }

  .dd {
    line-height: 2.5rem;
    text-indent: 2rem;
    margin: 1rem 0;      
  }

  .tt {
    font-weight: bold;
    font-size: 20px;
    display: inline-block;
    margin: 10px 0;      
  }
</style>