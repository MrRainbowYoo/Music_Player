<template>
  <div class="mv" v-loading="loading">
    <div class="filter-wrap">

      <div class="section-wrap">
        <span class="section-name">地区：</span>
        <ul class="section-tabs">
          <li><span :class="{'active':region=='全部'}" @click="region='全部'">全部</span></li>
          <li><span :class="{'active':region=='内地'}" @click="region='内地'">内地</span></li>
          <li><span :class="{'active':region=='港台'}" @click="region='港台'">港台</span></li>
          <li><span :class="{'active':region=='欧美'}" @click="region='欧美'">欧美</span></li>
          <li><span :class="{'active':region=='日本'}" @click="region='日本'">日本</span></li>
          <li><span :class="{'active':region=='韩国'}" @click="region='韩国'">韩国</span></li>
        </ul>
      </div>

      <div class="section-wrap">
        <span class="section-name">类型：</span>
        <ul class="section-tabs">
          <li><span :class="{'active':type=='全部'}" @click="type='全部'">全部</span></li>
          <li><span :class="{'active':type=='官方版'}" @click="type='官方版'">官方版</span></li>
          <li><span :class="{'active':type=='原声'}" @click="type='原声'">原声</span></li>
          <li><span :class="{'active':type=='现场版'}" @click="type='现场版'">现场版</span></li>
          <li><span :class="{'active':type=='网易出品'}" @click="type='网易出品'">网易出品</span></li>
        </ul>
      </div>

      <div class="section-wrap">
        <span class="section-name">排序：</span>
        <ul class="section-tabs">
          <li><span :class="{'active':order=='上升最快'}" @click="order='上升最快'">上升最快</span></li>
          <li><span :class="{'active':order=='最热'}" @click="order='最热'">最热</span></li>
          <li><span :class="{'active':order=='最新'}" @click="order='最新'">最新</span></li>
        </ul>
      </div>

    </div>

    <div class="mv-wrap">
      <ul class="mv-list">
          <li v-for="(item,index) in mvList" :key="index" @click="toMvDetail(item.id)">
              <div class="mv-img-wrap">
                  <img v-lazy="item.cover" alt="newMvs">
                  <p class="iconfont icon-play play"></p>
                  <p class="play-count iconfont icon-play">{{item.playCount}}</p>
              </div>
              <div class="mv-info">
                  <p class="title" :title="item.name">{{item.name}}</p>
                  <p class="author">{{item.artistName}}</p>
              </div>
          </li>                                          
      </ul>


      <div class="page-wrap">
        <el-pagination
        @current-change="handleCurrentChange"
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        :current-page="page">
        </el-pagination>            
      </div>    
  </div>

 
  </div>
</template>

<script >
import axios from 'axios'

export default {
  data(){
    return {
      region:'全部',
      type:'全部',
      order:'上升最快',
      total:0,
      page:1,
      pageSize:12,
      mvList:[],
      loading:true
    }
  },
  watch:{
    region(){
      // console.log(this.region)
      this.page = 1
      this.getMvList()
    },
    type(){
      // console.log(this.type)
      this.page = 1      
      this.getMvList()      
    },
    order(){
      // console.log(this.order)
      this.page = 1      
      this.getMvList()      
    }
  },
  methods:{
    toMvDetail(id) {
      this.$router.push(`/mvdetail?id=${id}`)
    },
    handleCurrentChange(page){
      this.page = page
      this.getMvList(true)
    },
    getMvList(changeTotal=false){
      this.loading = true
      axios({
        url:this.URL+"/mv/all",
        method:'get',
        params:{
          area:this.region,
          type:this.type,
          order:this.order,
          limit:this.pageSize,
          offset:(this.page-1)*this.pageSize
        }
      }).then(res=>{
        console.log(res)
        if(!changeTotal)
          this.total  = res.data.count
        this.mvList = res.data.data
        for(let i=0;i<this.mvList.length;i++){
          if(this.mvList[i].playCount >= 100000)
            this.mvList[i].playCount = parseInt(this.mvList[i].playCount/10000)+'万'
        }

      })
      setTimeout(() => {
        this.loading = false
      }, 500);
    }
  },
  created(){
    this.getMvList()
  }
}
</script>

<style scoped>
  ul {
    list-style: none;
  }

  .mv {
    max-width: 1300px;
    margin: 0 auto;
    padding: 20px;
  }

  .section-wrap {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
    font-size: 14px;
  }
  
  .section-tabs {
    display: flex;
    color: grey;
  }

  .section-tabs li:not(:last-of-type) {
    border-right: 1px solid #f2f2f1;
  }

  .section-tabs li span {
    margin: 20px;
    padding: 5px 20px;
    cursor: pointer;
    box-sizing: border-box;
  }

  .section-tabs .active {
    color: #dd6d60;
    background-color: #fcf6f5;
    border-radius: 20px;
  }

  .mv-list {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
  }

  .mv-list li {
      /* width: 250px;
      margin-right: 25px;
      margin-bottom: 30px; */
      width: 23%;
      margin-bottom: 20px;
      margin-right: 20px;
  }

  .mv-img-wrap {
      position: relative;
      cursor: pointer;
  }

  .mv-img-wrap img{
    width: 100%;
    height: 165px;
    border-radius: 5px;    
  }

  .mv-img-wrap:hover .play::before {
      opacity: 1;
  }

  .mv-img-wrap .play::before {
      content: "\e665"; 
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      width: 35px;
      height: 35px;
      background-color: rgba(255, 255, 255, .8);
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #c0392b;
      opacity: 0;
      transition: .3s;
      cursor: pointer;
  }

  .play-count{
      position: absolute;
      top: 5px;
      right: 5px;
      color: #fff;
      text-shadow: 0 0 2px rgb(0, 0, 0);      
  }

  .play-count::before {
      margin-right: 5px;
  }

 .mv-info p{
     margin: 5px 0;
 }

 .mv-info p.title {
   overflow: hidden;
   text-overflow: ellipsis;
   white-space: nowrap;
 }

  .mv-info .author{
      color: #a5a1a1;
      font-size: 12px;
  }
</style>