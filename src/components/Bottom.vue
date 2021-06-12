<template>
  <div class="bottom">
      <audio :src="musicUrl" autoplay controls></audio>
  </div>
</template>

<script>
export default {
    data(){
        return{
            // musicUrl:""
        }
    },
    props:{
        musicUrl:String,
    }
}
</script>

<style>
    .bottom {
        display: flex;
        align-items: center;
        background-color: #f1f3f4;
        box-shadow: 0px -2px 2px rgba(0, 0, 0,.3);

        position: relative; /* 防止被覆盖 */
        /* #f1f3f4 */
    }

    .bottom audio {
        width: 100%;
        outline: none;
    }
</style>