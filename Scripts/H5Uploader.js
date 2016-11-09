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
        var file = $("#file")[0].files[0],  //�ļ�����
            name = file.name,        //�ļ���
            size = file.size,        //�ܴ�С
            succeed = 0;
        var shardSize = 2 * 1024 * 1024,    //��2MBΪһ����Ƭ
            shardCount = Math.ceil(size / shardSize);  //��Ƭ��
        for(var i = 0;i < shardCount;++i){
            //����ÿһƬ����ʼ�����λ��
            var start = i * shardSize,
                end = Math.min(size, start + shardSize);
            //����һ������FormData��HTML5������
            var form = new FormData();
            form.append("data", file.slice(start,end));  //slice���������г��ļ���һ����
            form.append("name", name);
            form.append("total", shardCount);  //��Ƭ��
            form.append("index", i + 1);        //��ǰ�ǵڼ�Ƭ
            //Ajax�ύ
            $.ajax({
                url: "../File/Upload",
                type: "POST",
                data: form,
                async: true,        //�첽
                processData: false,  //����Ҫ������jquery��Ҫ��form���д���
                contentType: false,  //����Ҫ��ָ��Ϊfalse�����γ���ȷ��Content-Type
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