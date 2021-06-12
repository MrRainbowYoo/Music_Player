<template>
    <div class="header">
        <h2>小陈音乐</h2>
        <div class="input-box">
            <el-input
            placeholder="请输入内容"
            v-model="searchValue"
            prefix-icon="el-icon-search"
            clearable
            @keyup.enter.native="search"
            >
            </el-input>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            searchValue:""
        }
    },
    methods:{
        search(){
            // alert(this.searchValue)
            if(this.isNull(this.searchValue))
                this.open4()
            else
                this.$router.push({path:`/result?keywords=${this.searchValue}`})
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
        }                
    }
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
        margin-right: auto;
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

</style>