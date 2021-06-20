import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutation'

Vue.use(Vuex)

const store = new Vuex.Store({
    state:{
        globalMusicUrl:"",
        globalMusicInfo:{}
    },
    mutations
})

export default store