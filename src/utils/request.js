import axios from 'axios'
import {Message} from 'element-ui'

let baseURL = ""

if(process.env.NODE_ENV == "development"){
    baseURL = 'http://localhost:3000'
}else{
    baseURL = 'http://duoduozuikeail.top:3000'
    // baseURL = 'https://netease-cloud-music-api-lemon-chi.vercel.app'
}

const service = axios.create({
    baseURL,
    timeout:5000
})

service.interceptors.response.use(
    response => {
        if(response.status == 200) {
            return Promise.resolve(response)
        }else{
            return Promise.reject(response)
        }
    },
    error => {
        error && Message({
            type:'error',
            message:'网络连接出问题了~',
            showClose:true
        })
    }
)

export default service