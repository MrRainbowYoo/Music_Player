<template>
  <div class="index">
      <div class="index-left">
          <ul>
              <li>
                  <router-link to="/discover"><span class="iconfont icon-yinle"></span>发现音乐</router-link>
              </li>
              <li>
                  <router-link to="/recommend"><span class="iconfont icon-yinleliebiao-"></span>推荐歌单</router-link>                  
              </li>
              <li>
                  <router-link to="/newsongs"><span class="iconfont icon-music"></span>最新音乐</router-link>
              </li>
              <li>
                  <router-link to="/mvs"><span class="iconfont icon-bofangMV"></span>最新MV</router-link>
              </li>
          </ul>
      </div>
      <main>
          <router-view></router-view>
      </main>
  </div>
</template>

<script>
export default {
    data(){
        return {
        }
    }
}
</script>

<style>
    .index {
        /* height: 800px; */
        display: flex;
    }

    .index-left {
        width: 200px;
        background-color: #ededed;
        text-align: center;
    }

    .index-left ul {
        list-style: none;
    }

    .index-left li {
        cursor: pointer;
        letter-spacing: .3rem;
        height: 60px;
        line-height: 60px;
        display: flex;
    }

    .index-left li:hover {
        background-color: #ddd;
    }

    .index-left a {
        text-decoration: none;
        color: #333;
        display: block;
        width: 100%;
        height: 100%;
        font-size: 18px;
        padding-left: 30px; 
        text-align: left;  
    }

    .index-left a::before {
        margin-right: 10px;
    }

    .router-link-active {
        color: #e74c3c !important;
    }

    main {
        flex: 1;
        /* height: 800px; */
        overflow-y: scroll;
        /* background-color: skyblue; */
    }
</style>