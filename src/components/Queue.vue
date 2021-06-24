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
                    <li class="queue-song" v-for="item in musicQueue" :key="item.id" @dblclick="play(item)">
                        <span class="queue-song-name">{{item.songName}}</span>
                        <span class="queue-song-singer">{{item.singer}}</span>
                        <span class="queue-song-duration">{{item.duration}}</span>
                        <span class="queue-song-delete" @click="deleteQueue(item.id)">×</span>
                    </li>
                    </el-scrollbar>
                </ul>
            </el-tab-pane>
            <el-tab-pane label="播放历史" name="history">播放历史</el-tab-pane>
        </el-tabs>
        <span v-if="!musicQueue.length" class="queue-tip">什么都没有~快去听歌吧</span>
      </div>
  </div>
</template>

<script>
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
          this.$store.commit('deleteMusic',id)
      },
      clearMusicQueue(){
        if(this.musicQueue.length == 0)
            this.$message({
                message:'已经是空的了~',
                type:'warning',
                showClose:true
            })
        else
          this.$store.commit('clearMusicQueue')
      },
      play(item){
          console.log(item)
          this.$store.commit('changeMusicUrl',item.musicUrl)
          this.$store.commit('changeMusicInfo',item.musicInfo)
      }
    },
    computed:{
        musicQueue(){
            return this.$store.state.musicQueue
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
        right: 0;
        bottom: 60px;
        border: 1px solid #7f8c8d;
        /* border-radius: 10px; */
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        background-color: #fff;
        padding: 20px;
        box-sizing: border-box;
        font-size: 14px;
    }

    .queue-tabs .el-tabs__item{
        font-size: 14px;
    }

    .queue-head {
        color: #bdc3c7;
        padding-bottom: 10px;
        margin: 10px 0;
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

    .queue-song:nth-of-type(even) {
        background-color: #f9f9f9;
    }

    .queue-song:hover {
        background-color: #f5f6fa;
        color: #0097e6;
    }

    .queue-song:hover .queue-song-delete {
        display: block;
    }

    .queue-song-name {
        width: 50%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .queue-song-singer {
        width: 25%;
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
</style>