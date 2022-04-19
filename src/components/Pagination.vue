<template>
    <div class="page-wrap">
        <el-pagination
            @current-change="handleCurrentChange"
            background
            layout="prev, pager, next"
            :total="total"
            :page-size="pageSize"
            :current-page="currentPage">
        </el-pagination>            
    </div>    
</template>

<script>
export default {
    data(){
        return{}
    },
    props: ['total', 'pageSize', 'currentPage'],
    methods: {
        handleCurrentChange(page) {
            this.$emit('changePage', page)
        }
    }
}
</script>

<style>
    .page-wrap {
        display: flex;
        justify-content: center;
        margin-top: 20px;
    }

    .el-pagination.is-background .el-pager li:not(.disabled).active {
        background-color: rgb(236, 65, 65);
    }

    .el-pagination.is-background .btn-next, .el-pagination.is-background .btn-prev, .el-pagination.is-background .el-pager li{
        background: none;
        border-radius: 5px;
        border: 1px solid #f4f4f5;
    }

    .el-pagination.is-background .el-pager li:not(.disabled):not(.active):hover {
        color: rgb(236, 65, 65)!important;
    }
</style>