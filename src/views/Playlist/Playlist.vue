<template>
    <div class="playlist"  v-loading="loading">
        <div class="playlist-top-card">
            <div class="playlist-img-wrap">
                <img :src="playlistInfo.coverImgUrl" alt="">
            </div>
            <div class="playlist-info">
                <div class="playlist-name">{{playlistInfo.name}}</div>
                <div class="playlist-user-info">
                    <div class="playlist-user-avatar">
                        <img :src="playlistUserAvatar" alt="">
                    </div>
                    <div class="playlist-user-name">{{playlistUserNickname}}</div>
                    <div class="playlist-create-time">
                        <span>{{playlistInfo.updateTime}}</span> 创建
                    </div>
                </div>
                <div class="playlist-tags">
                    <span>标签：</span>
                    <span v-for="(item,index) in playlistInfo.tags" :key="index" class="tags">{{item}}</span>
                </div>
                <div class="playlist-desc">
                    <span>简介：</span>
                    <span :title="playlistInfo.description">{{playlistInfo.description}}</span>                    
                </div>
            </div>
        </div>

        <div class="playlist-tabs-wrap">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="歌曲列表" name="first">
                    <div class="songs-table">
                        <el-table
                            :data="tableData"
                            stripe
                            style="width: 100%"
                            @row-dblclick="play">

                            <el-table-column type="index" width="50"></el-table-column>

                            <el-table-column width="100">
                                <template slot-scope="scope">
                                <div class="img-wrap">
                                    <img :src="scope.row.al.picUrl" alt="">
                                    <p class="iconfont icon-play"  @click="play(scope.row)"></p>                                
                                </div>                                
                                </template>

                            </el-table-column>     

                            <el-table-column prop="name" label="音乐标题" width=""></el-table-column>

                            <el-table-column prop="ar[0].name" label="歌手" width=""></el-table-column>

                            <el-table-column prop="al.name" label="专辑" ></el-table-column>

                            <el-table-column prop="dt" label="时长" width="100"></el-table-column>                            
                        </el-table>                        
                    </div>                    
                </el-tab-pane>
                <el-tab-pane :label="`评论(${playlistInfo.commentCount})`" name="second">

                    <div class="comment-wrap" v-if="hotComments.length!=0">
                        <h4 class="comment-title">最热评论({{hotComments.length}})</h4>
                        <ul>
                            <li v-for="(item,index) in hotComments" :key="index">
                                <img :src="item.user.avatarUrl" alt="" class="comment-avatar">
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
                        <h4 class="comment-title">最新评论({{playlistInfo.commentCount-hotComments.length}})</h4>
                        <ul>
                            <li v-for="(item,index) in comments" :key="index">
                                <img :src="item.user.avatarUrl" alt="" class="comment-avatar">
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
            </el-tabs>     
        </div>
   
    </div>
</template>

<script>
import axios from 'axios'
import {formatDate,formatDateFully} from '../../utils/utils'
// import func from 'vue-editor-bridge'

export default {
    data(){
        return {
            activeName:'first',
            playlistInfo:{},
            playlistUserAvatar:"",
            playlistUserNickname:"",
            trackIds:[],
            tableData:[],
            comments:[],
            hotComments:[],
            total:0,
            pageSize:10,
            page:1,
            playlistId:"",
            loading:true
        }
    },
    created(){
        console.log(this.$route.query.id)
        let playlistId = this.$route.query.id
        this.playlistId = playlistId

        axios({
            url:this.URL+'/playlist/detail',
            method:'get',
            params:{
                id:playlistId
            }
        }).then(res=>{
            // console.log(res)
            this.playlistInfo = res.data.playlist
            this.playlistUserAvatar = res.data.playlist.creator.avatarUrl
            this.playlistUserNickname = res.data.playlist.creator.nickname
            this.trackIds = res.data.playlist.trackIds
            this.playlistInfo.updateTime = formatDate(new Date(this.playlistInfo.updateTime))

            let idsArray = []
            for(let item of this.trackIds){
                idsArray.push(item.id)
            }
            idsArray = idsArray.slice(1,21)//歌单歌曲的数量
            let idsStr = idsArray.join(",")

            // // 加载歌曲列表
            // this.getTracks(idsStr)

            // // true 代表第一次加载评论
            // this.getComments(true)

            // this.loading = false
            
            let that = this
            Promise.all([this.getTracks(idsStr),this.getComments(true)]).then(()=>{
                that.loading = false
            })


        })


    },
    methods:{
        handleClick(tab) {
            console.log(tab)
        },
        handleCurrentChange(page){
            this.page = page
            this.getComments()
        },        
        getTracks(trackId){
            axios({
                url:this.URL+"/song/detail",
                method:'get',
                params:{
                    ids:trackId
                }
            }).then(res=>{
                // console.log(res)
                for(let item of res.data.songs){
                    let duration = item.dt
                    let min = parseInt(duration / 60000).toString().padStart(2,'0')
                    let second = parseInt((duration-min*60000)/1000).toString().padStart(2,'0')
                    item.dt = `${min}:${second}`
                }
                this.tableData = res.data.songs
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
            // console.log(res)
            this.songUrl = res.data.data[0].url
            // this.$parent.$parent.musicUrl = this.songUrl
            // // 传入歌曲信息
            // this.$parent.$parent.musicInfo = {
            //     imgUrl:row.al.picUrl,
            //     singer:row.ar[0].name,
            //     songName:row.name
            // }
            
            let musicInfo = {
                imgUrl:row.al.picUrl,
                singer:row.ar[0].name,
                songName:row.name                
            }

            this.$store.commit("changeMusicUrl",this.songUrl)
            this.$store.commit("changeMusicInfo",musicInfo)      

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
            axios({
                url:this.URL+'/comment/playlist',
                method:'get',
                params:{
                    id:this.playlistId,
                    limit:this.pageSize,
                    offset:(this.page-1)*this.pageSize
                }
            }).then(res=>{
                console.log(res)

                for(let item of res.data.comments){
                    item.time = formatDateFully(new Date(item.time))
                }
                
                if(isFirst){
                    // alert('this is first')
                    if(Object.prototype.hasOwnProperty.call(res.data,'hotComments')){
                        for(let item of res.data.hotComments){
                            item.time = formatDateFully(new Date(item.time))
                        }
                        this.hotComments = res.data.hotComments
                    }              
                }

                this.total = this.playlistInfo.commentCount - this.hotComments.length    
                this.comments = res.data.comments
            })
        }
    }
}
</script>

<style scoped>
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

    .playlist-user-info {
        display: flex;
        align-items: center;
        font-size: 14px;
    }

    .playlist-user-info img {
        margin: 20px 0;
    }

    .playlist-user-avatar img {
        height: 30px;
        width: 30px;
        border-radius: 50%;
    }

    .playlist-user-name {
        margin: 0 10px;
    }

    .playlist-tags {
        margin-bottom: 20px;
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
</style>