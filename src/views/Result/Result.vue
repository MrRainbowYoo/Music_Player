<template>
    <div class="result" v-loading="loading">
        <div class="result-top-info">
            <h2>{{keywords}}</h2>
            <span>共找到{{total}}个结果</span>
        </div>
        <div class="tab-wrap">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="歌曲" name="first">
                    <div class="songs-table">
                        <el-table
                            :data="songsList"
                            stripe
                            style="width: 100%"
                            @row-dblclick="play">

                            <el-table-column type="index" width="50"></el-table-column>    

                            <el-table-column prop="songName" label="音乐标题" width="">
                                <template slot-scope="scope">
                                    <span>{{scope.row.songName}}</span>
                                    <span v-if="scope.row.alia.length!=0" style="color:grey;fontSize:12px;marginLeft:5px">{{scope.row.alia[0]}}</span>
                                    <span class="iconfont icon-bofangMV mvIcon" v-if="scope.row.mvId != 0" @click="toMvDetail(scope.row.mvId)"></span>
                                </template>
                            </el-table-column>

                            <el-table-column prop="singer" label="歌手" width=""></el-table-column>

                            <el-table-column prop="album" label="专辑" >
                                <template slot-scope="scope" style="">
                                    <span>{{scope.row.album}}</span>
                                    <span class="plus" title="添加至歌单" @click="addToQueue(scope.row,$event)">+</span>
                                </template>
                            </el-table-column>

                            <el-table-column prop="duration" label="时长" width="100"></el-table-column>                            
                        </el-table>                        
                    </div>
                </el-tab-pane>


                <el-tab-pane label="歌单" name="second">
                    <div class="songs-wrap">
                        <div class="list">
                            <ul>
                                <li class="iconfont icon-play" v-for="(item,index) in playList" :key="index" @click="toPlaylistDetail(item.id)">
                                    <p class="first-p">播放量：{{item.playCount}}</p>
                                    <img v-lazy="item.coverImgUrl" alt="recommend">
                                    <p class="last-p" :title="item.name">{{item.name}}</p>
                                </li>                                                                                                                    
                            </ul>
                        </div>
                    </div>                    
                </el-tab-pane>



                <el-tab-pane label="MV" name="third">
                    <ul class="mv-list1">
                        <li v-for="(item,index) in mvList" :key="index" @click="toMvDetail(item.id)">
                            <div class="mv-img-wrap">
                                <img v-lazy="item.cover" alt="newMvs">
                                <p class="iconfont icon-play play"></p>
                                <p class="play-count iconfont icon-play">{{item.playCount}}</p>
                                <p class="mv-duration">{{item.duration}}</p>                                
                            </div>
                            <div class="mv-info">
                                <p class="title" :title="item.name">{{item.name}}</p>
                                <p class="author">{{item.artistName}}</p>
                            </div>
                        </li>                                          
                    </ul>                    
                </el-tab-pane>
            </el-tabs>            
        </div>


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

        <div class="add-ball iconfont icon-yinfu" v-show="showAddBall" ref="addBall"></div>  
    </div>
</template>

<script scoped>

import axios from 'axios'

export default {
    data(){
        return {
            keywords:"",
            activeName: 'first',
            songsList: [],
            playList:[],
            mvList:[],
            page:1,
            total:0,
            pageSize:10,
            type:1,
            loading:true,
            showAddBall:false
        }
    },
    computed:{
        musicQueue(){
            return this.$store.state.musicQueue
        },
        queuePos(){
            return this.$store.state.queuePos
        }
    },
    methods:{
        toMvDetail(id){
            this.$router.push(`/mvdetail?id=${id}`)
        },              
        toPlaylistDetail(id){
            this.$router.push(`/playlist?id=${id}`)
        },            
        handleCurrentChange(page){
            this.page = page
            this.getTableData(this.type)
        },
        addToQueue(row,e){
            console.log(row)
            let obj = {
                id:row.id,
                imgUrl:row.imgUrl,
                duration:row.duration,
                singer:row.singer,
                songName:row.songName
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
        handleClick(tab) {
            let label = tab.label
            switch(label){
                case '歌曲':
                    this.total = 0
                    this.page = 1
                    this.type = 1
                    this.pageSize = 10                      
                    this.getTableData()
                    break;
                case '歌单':
                    this.total = 0                    
                    this.page = 1                    
                    this.type = 1000
                    this.pageSize = 10                      
                    this.getTableData(this.type)
                    break;
                case 'MV':
                    this.total = 0                    
                    this.page = 1                    
                    this.type = 1004
                    this.pageSize = 12                    
                    this.getTableData(this.type)
                    break;
            }
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
                //     imgUrl:row.imgUrl,
                //     singer:row.singer,
                //     songName:row.songName
                // }

                let musicInfo = {
                    imgUrl:row.imgUrl,
                    singer:row.singer,
                    songName:row.songName,
                    id:row.id,
                    duration:row.duration                    
                }

                this.$store.commit("changeMusicUrl",this.songUrl)
                this.$store.commit("changeMusicInfo",musicInfo)
                this.$store.commit('changeMusicStatus',false)
                this.$store.commit('changeMusicQueue',musicInfo)

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
        getTableData(type=1){
            this.loading = true
            axios({
                url:this.URL+"/cloudsearch",
                method:"get",
                params:{
                    keywords:this.keywords,
                    limit:this.pageSize,
                    offset:(this.page-1)*this.pageSize,
                    type //1歌曲 1000歌单 1004MV
                }
            }).then(res=>{
                console.log(res)
                let resultList = []

                switch(type){
                    case 1:
                        resultList = res.data.result.songs
                        // 点击最后几页返回的songCount为10会出现bug
                        if(this.total == 0)
                            this.total = res.data.result.songCount
                        var songsList = []

                        for (const item of resultList) {
                            var duration = item.dt
                            var min = parseInt(duration / 60000).toString().padStart(2,'0')
                            var second = parseInt((duration-min*60000)/1000).toString().padStart(2,'0')
                            duration = `${min}:${second}`
                            var song = {
                                id:item.id,
                                songName:item.name,
                                singer:item.ar[0].name,
                                album:item.al.name,
                                mvId:item.mv,
                                imgUrl:item.al.picUrl,
                                alia:item.alia,
                                copyright:item.copyright,
                                duration
                            }
                            songsList.push(song)
                        }
                        this.songsList = songsList                                                
                        break
                    case 1000:
                        resultList = res.data.result.playlists
                        // 点击最后几页返回的songCount为10会出现bug
                        if(this.total == 0)
                            this.total = res.data.result.playlistCount
                        this.playList = resultList                         
                        break
                    case 1004:
                        resultList = res.data.result.mvs
                        // 点击最后几页返回的songCount为10会出现bug
                        if(this.total == 0)
                            this.total = res.data.result.mvCount
                        this.mvList = resultList
                        for(let i=0;i<this.mvList.length;i++){
                            if(this.mvList[i].playCount >= 100000)
                                this.mvList[i].playCount = parseInt(this.mvList[i].playCount/10000)+'万'
                                let duration = this.mvList[i].duration
                                let min = parseInt(duration / 60000).toString().padStart(2,'0')
                                let second = parseInt((duration-min*60000)/1000).toString().padStart(2,'0')
                                this.mvList[i].duration = `${min}:${second}`  
                            }
                     
                        break         
                }

            })  
            
            setTimeout(() => {
                this.loading = false        
            }, 500);
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
    },
    created(){
        this.keywords = this.$route.query.keywords        
        this.getTableData()
    },
    watch:{
        $route(newVal){
            this.keywords = newVal.query.keywords
            this.total = 0
            this.page = 1                
            this.getTableData(this.type)
        }
    }
}
</script>

<style>
    .add-ball {
        position: fixed;
        color: rgb(236, 65, 65);
        transition: top .5s ease-in,left .5s linear;
        z-index: 9999;
    }

    ul {
        list-style: none;
    }

    .result {
        max-width: 1300px;
        margin: 0 auto;
        padding: 20px;
    }

    .result-top-info {
        margin-bottom: 20px;
        display: flex;
        align-items: flex-end;
    }

    .result-top-info span {
        margin-left: 10px;
        font-size: 12px;
        color: grey;
    }

    .el-tabs__active-bar {
        background-color: rgb(236, 65, 65);
    }

    .el-tabs__item.is-active {
        color: rgb(236, 65, 65);
    }
    
    .el-tabs__item {
        font-size: 18px;
    }

    .el-tabs__item:not(.is-active):hover {
        color: rgba(236, 65, 65, 0.555);
    }

    .page-wrap {
        display: flex;
        justify-content: center;
        margin-top: 20px;
    }

    .plus {
        padding: 10px;
        border-radius: 50%;
        margin-left: 10px;
        font-size: 25px;
        position: absolute;
        left: -80px;
        top: 0;
        font-weight: bold;
        cursor: pointer;
        display: none;
    }

    .songs-table .el-table__row:hover .plus{
        display: block;
    }

    .el-pagination.is-background .el-pager li:not(.disabled).active {
        background-color: rgb(236, 65, 65);
    }

    .el-pagination.is-background .btn-next, .el-pagination.is-background .btn-prev, .el-pagination.is-background .el-pager li{
        background: none;
        border-radius: 5px;
        border: 1px solid #f4f4f5;
    }

    .el-pagination.is-background .el-pager li:not(.disabled):not(.active):hover {
        color: rgb(236, 65, 65)!important;
    }

    .mvIcon {
        color: rgb(236, 65, 65);
        margin-left: 5px;
        cursor: pointer;
    }


    /* 歌单Tab */
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


/* MVTabs */
  .mv-list1 {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
  }

  .mv-list1 li {
      width: 23%;
      margin-bottom: 20px;
      margin-right: 20px;
  }

  .mv-img-wrap {
      position: relative;
      cursor: pointer;
  }

  .mv-img-wrap img{
    width: 100%;
    height: 165px;
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
      font-size: 12px;
  }

  .play-count::before {
      margin-right: 5px;
  }

  .mv-duration {
      position: absolute;
      bottom: 10px;
      right: 5px;
      color: #fff;
      font-size: 12px;
  }

 .mv-info p{
     margin: 5px 0;
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
</style>