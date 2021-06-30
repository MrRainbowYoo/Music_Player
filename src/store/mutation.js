const mutations = {
    changeMusicUrl(state,url){
        state.globalMusicUrl = url
    },
    changeMusicInfo(state,info){
        state.globalMusicInfo = info
    },
    changeCurrentTime(state,time){
        state.globalCurrentTime = time
    },
    changeMusicStatus(state,status){
        state.isMusicPaused = status
    },
    changeMusicQueue(state,obj){
        let ids = []
        for (const item of state.musicQueue) {
            ids.push(item.id)
        }
        if(!ids.includes(obj.id))
            state.musicQueue.push(obj)
    },
    deleteMusic(state,id){
        let queue = state.musicQueue
        for(let i=0;i<queue.length;i++){
            if(queue[i].id === id){
                queue.splice(i,1)
            }
        }
    },
    clearMusicQueue(state){
        state.musicQueue = []
    },
    changeNowIndex(state,index){
        state.nowIndex = index
    },
    deleteToNext(state){
        state.deleteToNext = !state.deleteToNext
    }
}

export default mutations