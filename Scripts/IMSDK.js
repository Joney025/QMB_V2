'use strict';
const appCache=require('electron-json-storage');
const {shell}=require('electron');
const _ipc = require('electron').ipcRenderer;
const nativeImg=require('electron').nativeImage;
const path = require('path');

_ipc.on('ping',function(e,obj){
    layer.msg(obj);
    saySomething();
});
_ipc.on('balloon-clk',function(e,obj){
    console.log(obj);
});

_ipc.on('resetIMFrame',function(ev,obj){
    $("#msgBox").css('height',(obj.split(',')[1]-270)+'px');
});
_ipc.on('openIMFrame',function(ev,obj){
    $('#mainframe').addClass('hide');
    $(".im-section").show();
    openIMTalkFrame(obj);//IMChat js function.
});
//通知气泡:
function showNotice(obj){
    var notice=new Notification('消息',{icon:obj.Img,tag:'chat_'+obj.sender,body:obj.text,data:{'id':obj.sender,'type':obj.msgType}});
    notice.onclick=function(){
        _ipc.send('win-show',this.data);
    }
}
function winExit() {
    _ipc.send('win-exit');
}
function winMin() {
    _ipc.send('win-min');
}
function winMax() {
    _ipc.send('win-max');
}
function saySomething(){
    var smg={'sender':'系统消息','text':'您有n条未处理消息！','Img':'./Images/Appx.png'};
    _ipc.send('im-msg',smg);
}

$(document).ready(function(){
    let temp=this.props.location.state;
    console.log(temp);
    IMLogin();
    appCache.get('IM_history',function(err,data){
        if(err){console.log(err);$("#cacheLog").text('Error:'+err);}
        console.log(data);
        $("#cacheLog").append('<span  style="color:#F1910B;background:transparent;display:block;">'+JSON.stringify(data)+'</span>');
    });
    $("#cacheLog").append('<span style="color:red;background:transparent;display:block;">'+localStorage.getItem('send_met')+'</span>');
    $(".clo-ose").click(function(){
        winExit();
    });
    $(".clo-min").click(function(){
        winMin();
    });
    $(".clo-max").click(function(){
        winMax();
    });
    $(".sys-setting").on('click',function(e){
        if($(".setting-list").hasClass("fo-show")){
            $(".setting-list").removeClass("fo-show");
        }else{
            $(".setting-list").addClass("fo-show");
        }
        e.stopPropagation();
    });

    $("ul.setting-list a").click(function(){
        if($(this).attr("data-action")=='about') {
            document.querySelector('#about-modal').classList.add('is-shown');
        }else if($(this).attr("data-action")=='exit'){
            var urls=path.join('file://', __dirname, './Views/Login.html');
            //window.location.href =urls;
            //window.open(urls);
            this.props.history.pushState({passParam: true},urls);
        }
    });
    $("#nav_menu>li").click(function(e){
        $(this).siblings().removeClass("is-selected");
        $(this).addClass("is-selected");
        var targ=$(this).attr("data-section");
        $("#mainframe").attr("src","./Views/"+targ+".html");
        $('.main-box>div').hide();
        switch(targ){
            case 'IMChat':
                $("webview").addClass('hide');
                $(".im-section").show();
                $("#talkingBox").css('display')=='block'?$("#Calendar").hide():$("#Calendar").show();
                break;
            case 'OAPage':
                $("webview").addClass('hide');
                $(".OA-section").show();
                break;
            default:
                $("webview").removeClass('hide');
                break;
        }
    });

    $("#imgTransifrom").on('click',function(){
        creatImg($("#txtInput").val());
    });
});

function creatImg(obj){
    console.log('input str:',obj);
    var img=nativeImg.createFromDataURL(obj);
    let image = nativeImg.createFromPath(obj)
    console.log('createFromPath:',image)
    console.log('createFromDataURL:',img);
    $("#imgTemp").attr("src",obj);
    var smg={'sender':'系统','text':'测试图标','Img':obj};
    _ipc.send('im-msg',smg);
}
function showNotice(obj){
    var options={
        dir:'auto',
        lang:'',
        body:'',
        tag:'',
        icon:'',
        renotify:false,
        silent:false,
        noscreen:false,
        sticky:false,
        data:null
    };
    var notice=new Notification('消息',{icon:obj.Img,tag:'chat_'+obj.sender,body:obj.text,data:{'id':obj.sender,'type':obj.msgType}});
    notice.onclick=function(){
        console.log(this.data)
        _ipc.send('win-show');
    }
}

//监听IM事件：
_sdk.Event.on('CHAT.MSG_RECEIVED',function (data) {
    console.log("----接收单聊信息----",data);
    var msgReceiver=_sdk.Base.getNick(data.data.touid);
    var msgSender=_sdk.Base.getNick(data.data.uid);
    var imgUrl='http://pic3.nipic.com/20090513/2655215_204357059_2.jpg';
    var msgStr='';
    var msgType=data.data.msgs[0].type;
    if(msgType==66 ||msgType==17){
        msgStr='【附件】';
    }else{
        msgStr=data.data.msgs[0].msg;
    }
    //var smg={'sender':msgSender,'text':msgStr,'Img':imgUrl};
    //_ipc.send('im-msg',smg);
    showNotice({'Img':imgUrl,'sender':msgSender,'msgType':0,'text':msgStr});
});
_sdk.Event.on('TRIBE.MSG_RECEIVED',function (data) {
    console.log("----接收到群组信息----",data);
    var msgReceiver=_sdk.Base.getNick(data.data.touid);
    var msgSender=_sdk.Base.getNick(data.data.uid);
    var imgUrl='http://img1.3lian.com/img2008/15/14/card0332.jpg';
    var msgStr='';
    var msgType=data.data.msgs[0].type;
    if(msgType==66 ||msgType==17){
        msgStr='【附件】';
    }else{
        msgStr=data.data.msgs[0].msg;
    }
    //var smg={'sender':msgSender,'text':msgStr,'Img':imgUrl};
    //_ipc.send('im-msg',smg);
    showNotice({'Img':imgUrl,'sender':msgSender,'msgType':1,'text':msgStr});
});
_sdk.Event.on('START_RECEIVE_ALL_MSG',function (data) {
    console.log("----消息监听----",data);
    var _code=data.code;
    var date=new Date();
    var timeStamp=date.toLocaleDateString()+' '+date.toLocaleTimeString();

    appCache.set('IM_history',{data:JSON.stringify(data),time:timeStamp},function(err){
        if(err){console.log('appCache Save error:',err);}
    });
    switch(_code){
        case 1000:
            break;
        case 1001:
            IMLogin();
            break;
        default:
            break;
    }
//        1000  接口调用成功
//        1001  调用的接口需要登录，并且当前没有登录
//        1002  登录超时
//        1003  其他错误，返回的数据格式不正确,拿不到期望的数据
//        1004  解析JSON字符串时发生错误
//        1005  网络错误
//        1006  登录状态下被踢下线
//        1007  登录信息错误
//        1008  已经登录，本地判断
//        1009  没有新消息
//        1010  调用接口参数错误
//        1011  登录太频繁
//        1012  已经登录，服务端判断
//        1013  登录的用户名不存在
//        1014  登录的密码错误
});
_sdk.Event.on('KICK_OFF',function(data){
    console.log('kick off msg.',data);
});

function IMLogout(){
    //_sdk.Base.logout();//登出后，将不会收到任何消息，也无法再调用需要登录的接口
    _sdk.Base.destroy();
    _sdk=null;
}
function IMLogin(){
    if(_sdk==null){_sdk=new WSDK();}
    //Joney:23369251,334989980d8741e4859d1077ce294c7b,152531
    //COCO:23369251,9302cd508ea24392a92389d2e7e8d216,825368
    _sdk.Base.login({
        uid:'878ccc32727a407d83e87f70628edc5a',
        appkey:'23331917',
        credential:'326345',
        timeout: 5000,
        success: function(data){
            console.log('login success', data);
            _sdk.Base.startListenAllMsg();
        },
        error: function(error){
            console.log('login fail', error);
        }
    });
}

function SendIMmsg(obj){
    _sdk.Chat.sendMsg({
        touid:'99e4d97d3b654c77b4db55a8269e7636',
        msg:obj,
        success: function(data){
            console.log('消息发送成功', data);
        },
        error: function(error){
            console.log('消息发送失败', error);
        }
    });
}

