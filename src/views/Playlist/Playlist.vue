<template>
    <div class="playlist"  v-loading="loading">
        <div class="playlist-top-card">
            <div class="playlist-img-wrap">
                <img :src="playlistInfo.coverImgUrl" alt="">
            </div>
            <div class="playlist-info">
                <div class="playlist-name">
                    <div class="tag1">歌单</div>{{playlistInfo.name}}
                </div>
                <div class="playlist-user-info">
                    <div class="playlist-user-avatar">
                        <img :src="playlistUserAvatar" alt="">
                    </div>
                    <div class="playlist-user-name">{{playlistUserNickname}}</div>
                    <div class="playlist-create-time">
                        <span>{{playlistInfo.updateTime}}</span> 创建
                        <span>共{{trackIds.length}}首</span>
                    </div>
                </div>
                <div class="playAllBtn iconfont icon-play" @click="playAll"> 播放全部</div>
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
                            @row-dblclick="play"
                            v-el-table-infinite-scroll="loadMore"
                            infinite-scroll-delay=500
                            infinite-scroll-disabled="noMore">
                            <!-- v-infinite-scroll="loadMore"
                            infinite-scroll-disabled="noMore"
                            infinite-scroll-delay=1000> -->

                            <el-table-column type="index" width="50"></el-table-column>

                            <el-table-column width="100">
                                <template slot-scope="scope">
                                <div class="img-wrap">
                                    <img v-lazy="scope.row.al.picUrl" alt="">
                                    <p class="iconfont icon-play"  @click="play(scope.row)"></p>                                
                                </div>                                
                                </template>

                            </el-table-column>     

                            <el-table-column prop="name" label="音乐标题" width=""></el-table-column>

                            <el-table-column prop="ar[0].name" label="歌手" width=""></el-table-column>

                            <el-table-column prop="al.name" label="专辑" >
                                <template slot-scope="scope">
                                    <span>{{scope.row.al.name}}</span>
                                    <span class="plus" title="添加至歌单" @click="addToQueue(scope.row)" style="top:20px">+</span>
                                </template>                                
                            </el-table-column>

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
import elTableInfiniteScroll from 'el-table-infinite-scroll'
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
            loading:true,
            loadBegin:0,
            allData:[]
        }
    },
    directives:{
        'el-table-infinite-scroll':elTableInfiniteScroll
    },
    created(){
        console.log(this.$route.query.id)
        let playlistId = this.$route.query.id
        this.playlistId = playlistId

        this.getTableData()
        
        setTimeout(() => {
            this.loadAll()
        }, 1000);
    },
    computed:{
        noMore(){
            return this.tableData.length >= this.trackIds.length
        }
    },
    methods:{
        handleClick(tab) {
            console.log(tab)
        },
        handleCurrentChange(page){
            this.page = page
            this.getComments()
        },
        loadMore(){
            console.log('滚动加载')
            this.loading = true
            this.loadBegin += 20
            this.getTableData()
        },
        loadAll(){
            console.log('loadAll')
            let ids = []
            for(let item of this.trackIds){
                ids.push(item.id)
            }
            let idsStr1 = ids.join(",")
            this.getTracks(idsStr1,true)
        },
        addToQueue(row){
            // console.log(row)
            let obj = {
                id:row.id,
                imgUrl:row.al.picUrl,
                duration:row.dt,
                singer:row.ar[0].name,
                songName:row.name
            }
            this.$store.commit('changeMusicQueue',obj)
        },
        getTableData(){
            axios({
                url:this.URL+'/playlist/detail',
                method:'get',
                params:{
                    id:this.playlistId
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
                if(this.loadBegin+20 >= idsArray.length)
                    idsArray = idsArray.slice(this.loadBegin)
                else
                    idsArray = idsArray.slice(this.loadBegin,this.loadBegin+20)//歌单歌曲的数量
                let idsStr = idsArray.join(",")
                
                // 这一段bug
                Promise.all([this.getTracks(idsStr,false),this.getComments(true)]).then(()=>{
                    console.log('1111')
                })

                setTimeout(()=>{
                    this.loading = false
                },500)
            })
        },                
        getTracks(trackId,all=false){
            axios({
                url:this.URL+"/song/detail",
                method:'get',
                params:{
                    ids:trackId
                }
            }).then(res=>{
                console.log(res)
                let pushList = []
                for(let item of res.data.songs){
                    let duration = item.dt
                    let min = parseInt(duration / 60000).toString().padStart(2,'0')
                    let second = parseInt((duration-min*60000)/1000).toString().padStart(2,'0')
                    item.dt = `${min}:${second}`

                    pushList.push(item)
                }
                // console.log(pushList)


                if(all){
                    this.allData = this.allData.concat(pushList)
                    console.log('loading all.......')
                }else{
                    this.tableData = this.tableData.concat(pushList)
                    console.log('loading a little')
                }

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

            setTimeout(() => {
                this.loading = false
            }, 500);
        },
        playAll(){
            let allSongs = this.allData
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
        display: flex;
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
        margin: 0 10px;
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
</style>