<template>
    <div class="header">
        <h2>小陈音乐</h2>
        <div class="btns">
            <i class="el-icon-arrow-left" @click="go(-1)"></i>
            <i class="el-icon-arrow-right" @click="go(1)"></i>            
        </div>
        <div class="input-box">
            <el-input
            placeholder="搜索"
            v-model="searchValue"
            prefix-icon="el-icon-search"
            clearable
            @keyup.enter.native="search"
            @focus="getSearchHot"
            @blur="showHot = false"
            >
            </el-input>
        </div>
        <div class="search-hot" v-show="showHot" ref="hot" @mousedown.stop="prevent">
            <el-scrollbar style="height:100%">
                <div class="history" v-if="history.length">
                    <span class="hot-title" style="display: inline-block;margin-right: 5px;">搜索历史</span>
                    <span class="iconfont icon-lajitong" style="cursor:pointer" title="清空搜索历史" @mousedown="deleteHistory(0,true)"></span>
                    <div class="history-wrap">
                        <div class="history-item" v-for="(item,index) in history" :key="index" @mousedown="toHot(item)">
                            {{item}}
                            <span class="delete-btn" title="删除" @mousedown.stop="deleteHistory(index,false)">×</span>
                        </div>
                    </div>
                </div>


                <div class="hot-title">热搜榜</div>
                <ul>
                    <li class="hot-item" v-for="(item,index) in hotData" :key="index" @mousedown.prevent="toHot(item.searchWord)">
                        <div class="hot-index">{{index+1}}</div>
                        <div class="hot-info">
                            <div class="hot-top">
                                <div class="hot-name">{{item.searchWord}}</div>
                                <div class="hot-score">{{item.score}}</div>
                                <img class="hot-icon" v-show="item.iconUrl && item.iconType!=5" :src="item.iconUrl"/>
                            </div>
                            <div class="hot-content">{{item.content}}</div>
                        </div>
                    </li>
                </ul>
            </el-scrollbar>
        </div>
    </div>
</template>

<script>
import { hotSearchAPI } from '@/utils/api'

export default {
    data(){
        return {
            searchValue:"",
            showHot:false,
            hotData:[],
            history:[]
        }
    },
    methods:{
        search(){
            // alert(this.searchValue)
            if(this.isNull(this.searchValue))
                this.open4()
            else{
                this.$router.push({path:`/result?keywords=${this.searchValue}`})
                if(!this.history.includes(this.searchValue))
                    this.history.push(this.searchValue)
            }
        },
        open4() {
            this.$message({
            showClose: true,
            message: '请输入内容',
            type: 'error'
            });
        },
        isNull( str ){
            if ( str == "" ) return true;
            var regu = "^[ ]+$";
            var re = new RegExp(regu);
            return re.test(str);
        },
        go(n) {
            this.$router.go(n)
        },
        getSearchHot(){
            this.showHot=true
            if(this.hotData.length == 0)
            hotSearchAPI().then(res=>{
                    console.log(res)
                    this.hotData = res.data.data
                })
        },
        toHot(value){
            this.searchValue = value
            this.search()
            //阻止blur事件 也可以用@mousedown.prevent; mousedown的优先级高于blur
            // event.preventDefault();
        },
        deleteHistory(index,all){
            if(all)
                this.history = []
            else
                for(let i=0;i<this.history.length;i++){
                    if(i == index)
                        this.history.splice(i,1)
                }
            event.preventDefault();
        },
        prevent(){
            event.preventDefault();
        }  
    },
}
</script>

<style>
    .header {
        display: flex;
        align-items: center;
        background-color: rgb(236, 65, 65);
        padding: 0 30px;
    }

    .header h2 {
        color: #fff;
        letter-spacing: .5rem;
        margin-right: 30px;
    }

    .btns {
        margin-right: auto;
    }

    .btns i {
        color: #fff;
        border-radius: 50%;
        padding: 10px;
        box-sizing: border-box;
        cursor: pointer;
    }

    .btns i:hover {
        background-color: rgba(255, 255, 255,.3);
    }

    .header .input-box {
        width: 200px;
    }

    .input-box input {
        border-radius: 20px;
        background-color: rgb(225, 62, 62);
        border: none;
        outline: none;
        font-size: 12px;
        color: #fff;
    }

    .el-input__icon {
        color: #fff;
    }

    .search-hot {
        width: 400px;
        height: 300px;
        /* border: 1px solid #333; */
        box-shadow: 0 0 5px 2px rgba(0, 0, 0,.3);
        border-radius: 10px;
        background-color: #fff;
        position: absolute;
        top: 55px;
        right: 30px;
        z-index: 1;
        padding: 10px 10px;
        box-sizing: border-box;
    }

    .hot-title {
        margin: 10px 0;
        font-weight: bold;
    }

    .hot-item {
        display: flex;
        align-items: center;
        padding: 5px;
    }

    .hot-item:hover {
        background-color: seashell;
    }

    .hot-index {
        font-size: 20px;
        color: rgb(236, 65, 65);
        margin-right: 15px;
    }

    .hot-info {
        flex: 1;
        font-size: 12px;
        color: slategray;
    }

    .hot-top {
        display: flex;
        align-items: center;
        margin-bottom: 5px;
    }

    .hot-name {
        font-size: 16px;
        margin-right: 15px;
        color: #000;
    }

    .hot-icon {
        width: 30px;
        /* height: 15px; */
        margin-left: 5px;
    }

    .history-wrap {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
    }

    .history-item {
        border: 1px solid #ddd;
        padding: 5px 10px;
        border-radius: 10px;
        font-size: 13px;
        display: inline-block;
        cursor: pointer;
        margin: 5px;
    }

    .history-item:hover {
        background-color: #F5F7FA;
    }

    .history-item:hover .delete-btn{
        opacity: 1;
    }

    .delete-btn {
        cursor: pointer;
        opacity: 0;
    }
</style>