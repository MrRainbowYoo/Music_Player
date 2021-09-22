<template>
  <div class="new-songs" v-loading="loading">
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
                <img v-lazy="scope.row.imgUrl" alt="">
                <p class="iconfont icon-play"  @click="play(scope.row)"></p>                                
              </div>                                
            </template>

          </el-table-column>     

          <el-table-column prop="songName" label="音乐标题" width=""></el-table-column>

                            <el-table-column label="歌手" width="">
                                <template slot-scope="scope">
                                    <div v-for="(x,i) in scope.row.artistInfo" :key="i" style="cursor:pointer;color:#2980b9;display:inline-block" @click="toArtist(x.id)">{{x.name}}<span style="color:#606266;margin:0 5px" v-show="scope.row.artistInfo.length != 1 && i!=scope.row.artistInfo.length-1">/</span></div>                                    
                                </template>                                  
                            </el-table-column>

          <el-table-column prop="album" label="专辑" width="">
              <template slot-scope="scope">
                  <span style="cursor:pointer;color:#2980b9;" @click="toAlbum(scope.row.albumId)">{{scope.row.album}}</span>
              </template>                                  
          </el-table-column>          

          <el-table-column prop="duration" label="时长" width="100"></el-table-column>                            
      </el-table>   
                                              
    </div>    
  </div>
</template>

<script>
import { getNewSongsAPI,playMusicAPI } from '@/utils/api'

export default {
  data(){
    return {
      tableData :[],
      songUrl:"",
      loading:true
    }
  },
  created(){
    this.onLoad()
  },
  computed:{
    musicQueue(){
      return this.$store.state.musicQueue
    }
  },
  methods: {
    onLoad(){
      let params = {
        type :0
      }
      getNewSongsAPI(params).then(res=>{
        // console.log(res)
        let resultList = res.data.data.slice(0,50)
        let songsList = []
        for (const item of resultList) {
            let duration = item.duration
            let min = parseInt(duration / 60000).toString().padStart(2,'0')
            let second = parseInt((duration-min*60000)/1000).toString().padStart(2,'0')
            duration = `${min}:${second}`
            let song = {
                id:item.id,
                songName:item.name,
                // singer:item.artists[0].name,
                // artistId:item.artists[0].id,
                artistInfo:item.artists,
                album:item.album.name,
                albumId:item.album.id,
                imgUrl:item.album.picUrl,
                duration,
                mp3Url:item.mp3Url
            }
            songsList.push(song)
        }
        this.tableData = songsList    
      }).then(()=>{
        this.loading = false
      })
    },
    toArtist(id){
        this.$router.push(`/artist?artistId=${id}`)
    },
    toAlbum(id){
        this.$router.push(`/album?id=${id}`)
    },                
    play(row){
      console.log(row)
      let id = row.id

      playMusicAPI({id}).then(res=>{
        if(res.data.data[0].url){
          // console.log(res)
          this.songUrl = res.data.data[0].url
          // this.$parent.$parent.musicUrl = this.songUrl
          // // 传入歌曲信息
          // this.$parent.$parent.musicInfo = {
          //   imgUrl:row.imgUrl,
          //   singer:row.singer,
          //   songName:row.songName
          // }

          let musicInfo = {
            imgUrl:row.imgUrl,
            artistInfo:row.artistInfo,
            // singer:row.singer,
            songName:row.songName,
            artistId:row.artistId,
            id:row.id,
            duration:row.duration            
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
  }
}
</script>

<style scoped>
  ul {
    list-style: none;
  }

  .new-songs {
      max-width: 1300px;
      margin: 0 auto;
      padding: 20px;
  }

  .new-songs >>> .el-loading-spinner {
      top: 50%;
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
</style>