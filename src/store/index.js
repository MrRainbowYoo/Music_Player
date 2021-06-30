import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutation'

Vue.use(Vuex)

const store = new Vuex.Store({
    state:{
        globalMusicUrl:"",
        globalMusicInfo:{},
        globalCurrentTime:0,
        isMusicPaused:true,
        musicQueue:[],
        nowIndex:0,
        deleteToNext:false
    },
    mutations
})

export default store