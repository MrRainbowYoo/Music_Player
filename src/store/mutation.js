const mutations = {
    changeMusicUrl(state,url){
        state.globalMusicUrl = url
    },
    changeMusicInfo(state,info){
        state.globalMusicInfo = info
    }
}

export default mutations