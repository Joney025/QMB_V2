/**
 * Created by Joney.y on 2016/11/8.
 */
'use strict';

//const holder=document.getElementById('txtInput');
//holder.ondragover=()=>{
//    return false;
//}
//holder.ondragleave=holder.ondragend=()=>{
//    return false;
//}
//holder.ondrop=(ev)=>{
//    ev.preventDefault();
//    for (let f of ev.dataTransfer.files) {
//        console.log('File(s) you dragged here:',f.size);
//    }
//    return false;
//}

var page = {

    init: function(){
        $("#upload").click($.proxy(this.upload, this));
    },
    upload: function(){
        var file = $("#file")[0].files[0],  //文件对象
            name = file.name,        //文件名
            size = file.size,        //总大小
            succeed = 0;
        var shardSize = 2 * 1024 * 1024,    //以2MB为一个分片
            shardCount = Math.ceil(size / shardSize);  //总片数
        for(var i = 0;i < shardCount;++i){
            //计算每一片的起始与结束位置
            var start = i * shardSize,
                end = Math.min(size, start + shardSize);
            //构造一个表单，FormData是HTML5新增的
            var form = new FormData();
            form.append("data", file.slice(start,end));  //slice方法用于切出文件的一部分
            form.append("name", name);
            form.append("total", shardCount);  //总片数
            form.append("index", i + 1);        //当前是第几片
            //Ajax提交
            $.ajax({
                url: "../File/Upload",
                type: "POST",
                data: form,
                async: true,        //异步
                processData: false,  //很重要，告诉jquery不要对form进行处理
                contentType: false,  //很重要，指定为false才能形成正确的Content-Type
                success: function(){
                    ++succeed;
                    $("#output").text(succeed + " / " + shardCount);
                }
            });
        }
    }
};

$(function(){

    page.init();

});