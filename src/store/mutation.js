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
    }
}

export default mutations