export  function formatDate(now) { 
    var year=now.getFullYear();  //取得4位数的年份
    var month=(now.getMonth()+1).toString().padStart(2,'0');  //取得日期中的月份，其中0表示1月，11表示12月
    var date=now.getDate().toString().padStart(2,'0');      //返回日期月份中的天数（1到31）
    return year+"-"+month+"-"+date; 
}

export  function formatDateFully(now) { 
    var year=now.getFullYear();  //取得4位数的年份
    var month=(now.getMonth()+1).toString().padStart(2,'0');  //取得日期中的月份，其中0表示1月，11表示12月
    var date=now.getDate().toString().padStart(2,'0');      //返回日期月份中的天数（1到31）
    var hour=now.getHours().toString().padStart(2,'0');     //返回日期中的小时数（0到23）
    var minute=now.getMinutes().toString().padStart(2,'0'); //返回日期中的分钟数（0到59）
    var second=now.getSeconds().toString().padStart(2,'0'); //返回日期中的秒数（0到59）
    return year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second; 
}