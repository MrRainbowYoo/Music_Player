import request from './request'

export function getNewSongsAPI(params){
    return request({
        url:'/top/song',
        method:'get',
        params
    })
}

export function playMusicAPI(params){
    return request({
        url:'/song/url',
        method:'get',
        params
    })
}

export function bannerAPI(){
    return request({
        url:'/banner',
        method:'get',
    })
}

export function recommendSonglistAPI(params){
    return request({
        url:'/personalized',
        method:'get',
        params
    })
}

export function recommendSongAPI(){
    return request({
        url:'/personalized/newsong',
        method:'get',
    })
}

export function recommendMVAPI(){
    return request({
        url:'/personalized/mv',
        method:'get',
    })
}

export function highQualityAPI(params){
    return request({
        url:'/top/playlist/highquality',
        method:'get',
        params
    })
}

export function songListAPI(params){
    return request({
        url:'/top/playlist',
        method:'get',
        params
    })
}

export function mvListAPI(params){
    return request({
        url:"/mv/all",
        method:'get',
        params
    })
}

export function playlistDetailAPI(params){
    return request({
        url:"/playlist/detail",
        method:'get',
        params
    })    
}

export function songInfoAPI(params){
    return request({
        url:"/song/detail",
        method:'get',
        params
    })      
}

export function commentsAPI(params,type){
    return request({
        url:"/comment/"+type,
        method:'get',
        params
    })      
}

export function searchAPI(params){
    return request({
        url:"/cloudsearch",
        method:'get',
        params
    })      
}

export function playMVAPI(params){
    return request({
        url:"/mv/url",
        method:'get',
        params
    })       
}

export function simiMVAPI(params){
    return request({
        url:"/simi/mv",
        method:'get',
        params
    })       
}

export function mvDetailAPI(params){
    return request({
        url:"/mv/detail",
        method:'get',
        params
    })       
}

export function artistsAPI(params,type=""){
    let url = type=="" ? '/artists' : '/artist/'+type
    if(type == 'simi')
        url = '/simi/artist'
    return request({
        url,
        method:'get',
        params
    })     
}

export function albumAPI(params){
    return request({
        url:"/album",
        method:'get',
        params
    })       
}

export function lyricAPI(params){
    return request({
        url:"/lyric",
        method:'get',
        params
    })       
}

export function hotSearchAPI(){
    return request({
        url:"/search/hot/detail",
        method:'get',
    })       
}