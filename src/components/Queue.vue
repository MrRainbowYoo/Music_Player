<template>
  <div class="queue">
      <div class="queue-tabs">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="播放列表" name="playList">
                <div class="queue-head">
                    <span>共{{musicQueue.length}}首</span>
                    <span class="clear" @click="clearMusicQueue">清空列表</span>
                </div>
                <ul class="queue-wrap">
                    <el-scrollbar style="height:100%">
                    <li class="queue-song" v-for="item in musicQueue" :key="item.id" @dblclick="play(item)" :class="{'active-song':item.id==globalMusicInfo.id}">
                        <div class="playingIcon" v-show="item.id==globalMusicInfo.id && !isMusicPaused">
                            <div class="playingIcon1"></div>
                            <div class="playingIcon2"></div>
                            <div class="playingIcon3"></div>
                        </div>
                        <span :class="{'playingIcon iconfont icon-zanting':isMusicPaused && item.id==globalMusicInfo.id}"></span>
                        <span class="queue-song-name">{{item.songName}}</span>
                        <span class="queue-song-singer">{{item.singer}}</span>
                        <span class="queue-song-duration">{{item.duration}}</span>
                        <span class="queue-song-delete" @click="deleteQueue(item.id)">×</span>
                    </li>
                    </el-scrollbar>
                </ul>
            </el-tab-pane>
            <!-- <el-tab-pane label="播放历史" name="history">播放历史</el-tab-pane> -->
        </el-tabs>
        <span v-if="!musicQueue.length" class="queue-tip">什么都没有~快去听歌吧</span>
      </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
    data(){
        return {
            activeName: 'playList'
        }
    },
    methods:{
        handleClick(tab, event) {
            console.log(tab, event);
      },
      deleteQueue(id){
        //   console.log(id)
        this.$confirm('确定删除该歌曲吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

            
            let ids = []
            for (const item of this.musicQueue) {
                ids.push(item.id)
            }
            let ii = ids.indexOf(id)
            this.$store.commit('deleteMusic',id)
            if(ii < this.nowIndex){
                this.$store.commit('changeNowIndex',this.nowIndex-1)          
            }else if(ii== this.nowIndex){
                this.$store.commit('deleteToNext')
            }

            this.$message({
                type: 'success',
                message: '删除成功!'
            });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      clearMusicQueue(){
        if(this.musicQueue.length == 0)
            this.$message({
                message:'已经是空的了~',
                type:'warning',
                showClose:true
            })
        else{
            this.$confirm('确定清空列表吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {

            this.$store.commit("changeMusicUrl","")
            this.$store.commit("changeMusicInfo",{})
            this.$store.commit("changeMusicStatus",true)
            this.$store.commit("changeCurrentTime",0)
            setTimeout(() => {
             this.$store.commit('clearMusicQueue')               
            }, 100);

            // 强制刷新当前页面，初始化state
            // this.$router.go(0)

            this.$message({
                type: 'success',
                message: '已清空!'
            });
            }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消清空'
            });          
            });            
        }
      },
      play(item){
          console.log(item)
            axios({
                url:this.URL+"/song/url",
                method: "get",
                params:{
                id:item.id
                }
            }).then(res=>{
                if(res.data.data[0].url){
                let songUrl = res.data.data[0].url
                let musicInfo = {
                    id:item.id,
                    imgUrl:item.imgUrl,
                    songName:item.songName,
                    singer:item.singer,
                    duration:item.duration
                }
                this.$store.commit("changeMusicUrl",songUrl)
                this.$store.commit("changeMusicInfo",musicInfo)
                this.$store.commit("changeMusicStatus",false)  

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

      }
    },
    computed:{
        musicQueue(){
            return this.$store.state.musicQueue
        },
        globalMusicInfo(){
            return this.$store.state.globalMusicInfo
        },
        isMusicPaused(){
            return this.$store.state.isMusicPaused
        },
        nowIndex(){
            return this.$store.state.nowIndex
        },
        deleteToNext(){
            return this.$store.state.deleteToNext
        }
    },
    watch:{
        nowIndex(){
            this.play(this.musicQueue[this.nowIndex])
        },
        deleteToNext(){
            if(this.nowIndex < this.musicQueue.length)
                this.play(this.musicQueue[this.nowIndex])
            if(this.musicQueue.length == 0){
                this.$store.commit("changeNowIndex",0)
                this.$store.commit("changeMusicUrl","")
                this.$store.commit("changeMusicInfo",{})
                this.$store.commit("changeMusicStatus",true)
                this.$store.commit("changeCurrentTime",0)
                setTimeout(() => {
                this.$store.commit('clearMusicQueue')               
                }, 100);           
            }
            if(this.nowIndex == this.musicQueue.length)
                this.$store.commit("changeNowIndex",0)
        }
    }
}
</script>

<style>
    .queue {
        width: 25%;
        min-width: 300px;
        height: 700px;
        position: fixed;
        right: 10px;
        bottom: 59px;
        border: 1px solid #7f8c8d;
        /* border-radius: 10px; */
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        background-color: #fff;
        box-sizing: border-box;
        font-size: 14px;
        box-shadow: 0 0 5px rgba(0,0,0,.6);
    }

    .queue-tabs .el-tabs__item{
        font-size: 14px;
    }

    .queue-tabs .el-tabs__header {
        margin: 15px;
    }

    .queue-head {
        color: #bdc3c7;
        padding-bottom: 10px;
        margin: 10px 15px;
        border-bottom: 1px solid #eee;
    }

    .clear {
        color: #686de0;
        float: right;
        cursor: pointer;
    }

    .queue-wrap {
        height: 550px;
        position: relative;
    }

    .queue-tip {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate3d(-50%,-50%,0);
        color: #bdc3c7;
    }

    .queue-song{
        display: flex;
        align-items: center;
        padding: 10px 0;
        background-color: #fff;
        font-weight: 200;
        color: #363636;
    }

    .playingIcon {
        width: 14px;
        height: 14px;
        overflow: hidden;
        display: flex;
        position: absolute;
        left: 5px;
        font-weight: bold;
    }

    .playingIcon div{
        background-color: rgb(236, 65, 65);
        width: 4px;
        margin: 0 1px;
        height: 100%;
    }

    .playingIcon1 {
        /* transform: translate3d(0,0,0); */
        animation: playingIcon;
        animation-duration: .5s;
        animation-delay: 0;
        animation-iteration-count: infinite;
        animation-timing-function: ease-out;
        animation-direction: alternate-reverse;
    }

    .playingIcon2 {
        /* transform: translate3d(0,4px,0); */
        animation: playingIcon;
        animation-duration: .5s;
        animation-delay: .2s;
        animation-iteration-count: infinite;
        animation-timing-function: ease-out;
        animation-direction: alternate-reverse;
    }

    .playingIcon3 {
        /* transform: translate3d(0,8px,0); */
        animation: playingIcon;
        animation-duration: .5s;
        animation-delay: .5s;
        animation-iteration-count: infinite;
        animation-timing-function: ease-out;
        animation-direction: alternate-reverse;
    }

    @keyframes playingIcon {
        from{
            transform: translate3d(0,0,0);
        }
        to{
            transform: translate3d(0,80%,0);
        }
    }


    .queue-song:nth-of-type(even) {
        background-color: #f9f9f9;
    }

    .queue-song:not(.active-song):hover {
        background-color: #f5f6fa;
        color: #0097e6;
    }

    .queue-song:hover .queue-song-delete {
        display: block;
    }

    .queue-song-name {
        width: 40%;
        margin-left: 25px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .queue-song-singer {
        width: 30%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .queue-song-duration {
        width: 15%;
    }

    .queue-song-delete {
        cursor: pointer;
        margin-right:15px;
        color: #3e3e3e;
        display: none;
    }

    .active-song {
        color: rgb(236, 65, 65);
        position: relative;
    }
</style>