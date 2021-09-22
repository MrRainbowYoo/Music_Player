<template>
  <div class="recommend" v-loading="loading">
    <div class="top-card-wrap">
      <img :src="highQuality.coverImgUrl" class="bg-blur" alt="bg-blur">
      <div class="top-card">
        <div class="img-wrap">
          <img :src="highQuality.coverImgUrl" alt="img">
        </div>
        <div class="card-content">
          <div class="card-tag">精品歌单</div>
          <div class="card-title">{{highQuality.name}}</div>
          <div class="card-info">{{highQuality.description}}</div>
        </div>
      </div>
    </div>
    <div class="tab-container">
      <div class="tab-bar">
        <ul>
          <li :class="item == tabActive?'tab-item active':'tab-item'" v-for="(item,index) in tabItems" :key="index" @click="changeActive(item)">{{item}}</li>
        </ul>
      </div>
      <div class="tab-content">
        <div class="songs-wrap">
            <div class="list">
                <ul>
                    <li class="iconfont icon-play" v-for="(item,index) in songLists" :key="index" @click="toPlaylistDetail(item.id)" >
                        <p class="first-p">播放量 : {{item.playCount}}</p>
                        <img v-lazy="item.coverImgUrl" alt="songLists">
                        <p class="last-p">{{item.name}}</p>
                    </li>                                                                                                                    
                </ul>
            </div>
        </div>        
      </div>

        <div class="page-wrap">
            <el-pagination
            @current-change="handleCurrentChange"
            background
            layout="prev, pager, next"
            :total="total"
            :page-size=10
            :current-page="page">
            </el-pagination>            
        </div>      
    </div>
  </div>
</template>

<script>
import { highQualityAPI,songListAPI } from '@/utils/api'

export default {
  data(){
    return{
      highQuality:[],
      songLists:[],
      tabActive:'全部',
      tabItems:['全部','欧美','华语','流行','说唱','摇滚','民谣','电子','轻音乐','影视原声','ACG','怀旧'],
      total:0,
      page:1,
      loading:true
    }
  },
  methods:{
    toPlaylistDetail(id){
        this.$router.push(`/playlist?id=${id}`)
    },    
    changeActive(item){
      this.tabActive = item
      this.page = 1
      this.getHighQuality(item)
      this.getSongLists(item) /* 不调用函数 也可以使用watch监听实现 */
    },
    getHighQuality(cat='全部'){
        // 精品歌单
        let params = {
          limit : 1,
          cat
        }
        highQualityAPI(params).then(res=>{
          // console.log(res)
          this.highQuality = res.data.playlists[0]
        })
    },
    getSongLists(cat="全部"){
      this.loading = true
      // 歌单列表
      let params = {
        limit:10,
        offset:(this.page-1)*10,
        cat
      }
      songListAPI(params).then(res=>{
        // console.log(res)
        this.songLists = res.data.playlists
        this.total = res.data.total /* 改变总页数 */
        for(let i=0;i<this.songLists.length;i++){
          if(this.songLists[i].playCount >= 100000)
            this.songLists[i].playCount = parseInt(this.songLists[i].playCount/10000)+'万'
        }     
      }).then(()=>{
        this.loading = false
      })
    },
    handleCurrentChange(page){
      // console.log(page)
      this.page = page
      this.getSongLists(this.tabActive)
    }
  },
  created(){
    this.getHighQuality()
    this.getSongLists()      
  }
}
</script>

<style scoped>
  ul {
    list-style: none;
  }

  .recommend {
      max-width: 1300px;
      margin: 0 auto;
      padding: 20px;
  }

  .top-card-wrap {
    height: 250px;
    padding: 20px;
    position: relative;
    z-index: 1;
    box-sizing: border-box;
    border-radius: 10px;
    overflow: hidden;
    display: flex;
    align-items: center;
  }

  .bg-blur {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    filter: blur(20px);
    z-index: 2;
  }

  .top-card {
    display: flex;
    position: absolute;
    z-index: 3;
  }

  .img-wrap {
    width: 200px;
    height: 200px;
  }

  .img-wrap img {
    width: 100%;
    height: 100%;
  }

  .card-content {
    flex: 1;
    padding: 0 20px;
  }

  .card-tag {
    padding: 5px;
    width: 100px;
    box-sizing: border-box;
    border: 1px solid #dfac67;
    color: #dfac67;
    text-align: center;
    border-radius: 10px;
    cursor: pointer;
  }

  .card-title {
    color: #fff;
    margin: 10px 0;
  }

  .card-info {
    font-size: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 8;
    /* color: #888482; */
    color: #e3e3e3;
  }


  /* tab导航 */
  .tab-container {
    margin-top: 20px;
  }

  .tab-bar ul {
    height: 25px;
    display: flex;
    justify-content: flex-end;
  }

  .tab-item {
    margin-left: 20px;
    cursor: pointer;
    font-size: 15px;
    color: grey;
  }

  .active {
    color: #dd6d60;
  }

  .tab-content {
    margin-top: 20px;
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
      content: "\e665"; 
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
</style>