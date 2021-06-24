<template>
  <div class="mv-detail">
      <div class="mv-wrap">
          <h4 class="head">MV详情</h4>
          <div class="video-wrap">
              <video :src="mvUrl" controls autoplay></video>
              <!-- <img src="../imgs/1.jpg" alt=""> -->
          </div>
          <div class="mv-info">
              <div class="mv-info-head">
                  <img :src="avatarUrl" alt="" class="mv-avatar">
                  <p class="mv-nickname">{{mvInfo.artistName}}</p>
              </div>
              <div class="mv-name">{{mvInfo.name}}</div>
              <div class="mv-other">
                  <div class="mv-time">发布：{{mvInfo.publishTime}}</div>
                  <div class="mv-playcount">播放：{{mvInfo.playCount}}次</div>
              </div>
              <p class="mv-desc">{{mvInfo.desc}}</p>
          </div>
          
        <div class="mv-content-wrap" v-if="hotComments.length != 0">
            <h4 class="head">热门评论({{hotComments.length}})</h4>
                        <ul>
                            <li v-for="(item,index) in hotComments" :key="index">
                                <img :src="item.user.avatarUrl" alt="" class="comment-avatar">
                                <div class="comment-info">
                                    <div class="comment">
                                        <span class="comment-user">{{item.user.nickname}}:</span>
                                        <span class="comment-content">{{item.content}}</span>
                                    </div>
                                    <div class="re-comment" v-if="item.beReplied.length != 0">
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

                <div class="mv-content-wrap">
            <h4 class="head">最新评论({{this.total}})</h4>
                        <ul>
                            <li v-for="(item,index) in comments" :key="index">
                                <img :src="item.user.avatarUrl" alt="" class="comment-avatar">
                                <div class="comment-info">
                                    <div class="comment">
                                        <span class="comment-user">{{item.user.nickname}}:</span>
                                        <span class="comment-content">{{item.content}}</span>
                                    </div>
                                    <div class="re-comment" v-if="item.beReplied.length != 0">
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
      </div>
      <div class="mv-recommend-wrap">
          <h4 class="head">相关推荐</h4>
            <ul class="mv-list">
                <li v-for="(item,index) in recommendMvs" :key="index">
                    <div class="mv-img-wrap"  @click="toMvDetail(item.id)">
                        <img :src="item.cover" alt="newMvs">
                        <p class="iconfont icon-play play"></p>
                        <p class="play-count iconfont icon-play">{{item.playCount}}</p>
                        <p class="mv-duration">{{item.duration}}</p>                          
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
import {formatDateFully} from '@/utils/utils.js'

export default {
    data(){
        return{
            mvId:"",
            mvUrl:"",
            recommendMvs:[],
            mvInfo:{},
            avatarUrl:"",
            hotComments:[],
            comments:[],
            total:0,
            pageSize:10,
            page:1,            
        }
    },
    watch:{
        $route(newVal){
            console.log(newVal)
            this.searchMV(newVal.query.id)
        }
    },
    methods:{
        toMvDetail(id){
            this.$router.push(`/mvdetail?id=${id}`)
        },
        handleCurrentChange(page){
            this.page = page
            this.getComments()
        },
        getComments(){
            axios({
                url:this.URL+"/comment/mv",
                method:'get',
                params:{
                    id:this.$route.query.id,
                    limit:this.pageSize,
                    offset:(this.page-1)*this.pageSize
                }
            }).then(res=>{
                // console.log(res)
                if(Object.prototype.hasOwnProperty.call(res.data,'hotComments')){
                    this.hotComments = res.data.hotComments
                    for(let i=0;i<this.hotComments.length;i++){
                        this.hotComments[i].time = formatDateFully(new Date(this.hotComments[i].time))
                    }            
                }

                this.comments = res.data.comments
                for(let i=0;i<this.comments.length;i++){
                    this.comments[i].time = formatDateFully(new Date(this.comments[i].time))
                }               

                this.total = this.mvInfo.commentCount - this.hotComments.length
            })  
        },
        searchMV(id){

            // 获取mv播放url
            axios({
                url:this.URL+"/mv/url",
                method:'get',
                params:{
                    id
                }
            }).then(res=>{
                // console.log(res)
                this.mvUrl = res.data.data.url
            })

            // 获取相关mv推荐
            axios({
                url:this.URL+"/simi/mv",
                method:'get',
                params:{
                    mvid:id
                }
            }).then(res=>{
                // console.log(res)
                this.recommendMvs = res.data.mvs

                for(let i=0;i<this.recommendMvs.length;i++){
                    if(this.recommendMvs[i].playCount >= 100000)
                        this.recommendMvs[i].playCount = parseInt(this.recommendMvs[i].playCount/10000)+'万'
                    var duration = this.recommendMvs[i].duration
                    var min = parseInt(duration / 60000).toString().padStart(2,'0')
                    var second = parseInt((duration-min*60000)/1000).toString().padStart(2,'0')
                    this.recommendMvs[i].duration = `${min}:${second}`
                }            
            })        

            // 获取MV信息
            axios({
                url:this.URL+"/mv/detail",
                method:'get',
                params:{
                    mvid:id
                }
            }).then(res=>{
                console.log(res)
                this.mvInfo = res.data.data
                if(this.mvInfo.playCount >= 100000)
                    this.mvInfo.playCount = parseInt(this.mvInfo.playCount/10000)+'万'
                axios({
                    url:this.URL+"/artists",
                    method:'get',
                    params:{
                        id:this.mvInfo.artistId
                    }
                }).then(res=>{
                    // console.log(res)
                    this.avatarUrl = res.data.artist.img1v1Url
                })
                
                // 获取评论信息
                this.getComments()      
            })
        }           
    },
    created(){
        console.log(this.$route.query.id)
        let mvId = this.$route.query.id
        this.mvId = mvId

        this.searchMV(mvId)

    }
}
</script>

<style scoped>
ul {
    margin: 0;
    padding: 0;
}

.mv-detail {
    max-width: 1300px;
    margin: 0 auto;
    padding: 20px;
    display: flex;
}

.head {
    margin-bottom: 20px;
}

.mv-content-wrap .head{
    font-size: 25px;
    font-weight: normal;
}

.mv-wrap {
    width: 700px;
    margin-right: 30px;
}

.mv-recommend-wrap {
    flex: 1;
}

.video-wrap {
    width: 100%;
    height: 390px;
}

.video-wrap video{
    width: 100%;
    height: 100%;
    outline: none;
    object-fit: fill /* 自动填充父元素 */
}

.mv-info-head {
    display: flex;
    align-items: center;
    margin: 20px 0;
}

.mv-avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    margin-right: 10px;
}

.mv-name {
    font-size: 30px;
    color: #000;
    font-weight: bold;
}

.mv-other {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: grey;
    margin: 20px 0;
}

.mv-time {
    margin-right: 20px;
}

.mv-desc {
    font-size: 14px;
    margin-bottom: 20px;
}

  .mv-list li {
      display: flex;
      padding: 10px;
      box-sizing: border-box;
  }

  .mv-list li:hover{
      background-color: rgb(240, 239, 239);
  }

  .mv-img-wrap {
      position: relative;
      cursor: pointer;
      width: 180px;
      margin-right: 20px;
  }

  .mv-img-wrap img{
    height: 100%;
    border-radius: 5px;    
  }

  .mv-img-wrap:hover .play::before {
      opacity: 1;
  }

  .mv-img-wrap .play::before {
      content: "\e665"; 
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


 .mv-info p.title {
   overflow: hidden;
   text-overflow: ellipsis;
   white-space: nowrap;
 }

  .mv-info .author{
    color: #a5a1a1;
    font-size: 12px;
  }

 .mv-content-wrap ul li {
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

  .mv-duration {
      position: absolute;
      bottom: 5px;
      right: 5px;
      color: #fff;
      font-size: 12px;
  }  
</style>