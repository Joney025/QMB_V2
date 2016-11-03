/**
Top IM JS
By:Joney
Date:2016年5月18日10:10:52
**/
'use strict';
//const ipCmd =null;//require('electron').ipcRenderer;
var AppKey ="23331917";// $("#IMAppKey").val();//23369251,23331917
var ImUID ="878ccc32727a407d83e87f70628edc5a";// $("#IMUID").val();//当前用户IMID //878ccc32727a407d83e87f70628edc5a,334989980d8741e4859d1077ce294c7b
var ImSecret ="326345";// $("#IMSecret").val();//326345,152531,
var sdk =_sdk;
var currentUserID = $("#hd_UserID").val();//当前用户标识ID
var currentUserName = $("#hd_UserName").val();//当前用户名称
var privateMark = $("#hd_PrivateMark").val();//公，私有云标识
var docUrl = $("#hd_FileDownLoadUrl").val();
var _talkID = "";//会话iD(通话对象ID,讨论组ID)
var msgData = { "UserSign": "", "UserName": "","From":"","ToUserSign":"", "To": "", "ToName": "", "Msg": "", "CreateDate": "", "Hint": "", "HintText": "", "MediaType": "", "FileName": "", "Size": "", "Path": "", "DataSource": "", "BaseEntry": "", "BaseType": "", "SendDate": "" };
var elem = {};//窗体元素集
elem.TalkOne = $("#talkingBox");//对话窗口one to one.
elem.TalkOneID = $("#talkingBox #TalkID");//对话窗口ID
elem.TalkOneTitle = $("#talkingBox #TalkTitle");//对话窗口标题
elem.TalkOneName = $("#talkingBox #tName #t_nick");//对话对象名称
elem.TalkOnePic = $("#talkingBox .user-pic");//对话对象头像
elem.TalkOneMsg = $("#talkingBox #msgList");//对话信息列表
elem.TalkOneMsgBox = $("#talkingBox #msgBox");
elem.TalkOneMsgLoadType = $("#talkingBox #o-loadType");//聊天记录加载类型：0=正常历史纪录，1=搜索历史纪录
elem.TalkNewList = $("#chat_listContent");//新会话列表
elem.OverLay = $("#overlay");//低幕
elem.TalkMsgPageIndex = $("#talkingBox #curpage");//信息行当前页码one
elem.TalkMsgTotalPage = $("#talkingBox #totpage");

var htmTitle = "<a href='javascript:' title='{0}'>{0}</a>";//标题元素
var htmPic = "<img src='Images/IMIcon/uface.jpg?UserSign={0}' class='img-80px {1}' height='80' />";//头像元素
var htmPicDf = "<img src='Images/IMIcon/dfUser.png?docEntry={0}' class='img-80px' height='80' />";//头像元素LoadIMGroupImageBase64
var waitingHtm = "<li id='{0}'><div class='waitingBox'><div class='waitingBar'></div><div class='lb_tip'>{1}</div></div></li>";//进度条
//新 会话列表：0=id,1=usersign,2=名称，3=短消息，4=未读数,5=是否红点提示（tipBox）
var htmNewLineOne = "<li id='{0}_{1}' data-im='{0}_{1}' onclick='showTalkFormBoxO(this);'><div><img src='Images/IMIcon/uface.jpg?UserSign={0}' title='头像' ></div><p><a href='#' title='名称'>{2}</a></p><p title='短消息' class='member_msg'>{3}</p><div id='tipCount' class='{5}' title='未读消息数'>{4}</div></li>";
var htmNewLineGroup = "<li id='{0}_{1}' data-im='{0}_{1}' onclick='showTalkFormBoxG(this);'><div><img src='Images/IMIcon/uface.jpg?docEntry={0}' title='头像' ></div><p><a href='#' title='名称'>{2}</a></p><p title='短消息' class='member_msg'>{3}</p><div id='tipCount' class='{5}' title='未读消息数'>{4}</div></li>";
//新会话行-个人对话
var htmNewLineO = "<li id='{0}' onclick='showTalkFormBoxO(this);'><img src='Images/IMIcon/uface.jpg?UserSign={1}' width='30' height='30'><a href='#' id='{2}' title='{3}'>{4}</a><div id='tipCount'>{5}</div></li>";
//客服行
var htmNewLineCG = "<li id='{0}' onclick='showTalkFormBoxCG(this);'><img src='Images/IMIcon/uface.jpg?UserSign={1}' width='30' height='30'><a href='#' id='{2}' title='{3}'>{4}</a><div id='tipCount'>{5}</div></li>";
//新会话行-讨论组
var htmNewLineG = "<li id='{0}' onclick='showTalkFormBoxG(this);'><img src='Images/IMIcon/uface.jpg?docEntry={1}' width='30' height='30'><a href='#' id='{2}' title='{3}'>{4}</a><div id='tipCount'>{5}</div></li>";
//附件信息行
var htmMsgFileLine = "<li class='msgAlign-right'><span style='color:#ccc;display:block'>{0}</span><div class='message-content rightMsg'><span class='message-content-text'><span class='sp-card'></span><span>{1}</span><span style='float:none;margin:0 0 0 10px;'>{2}<a href='{3}{4}' target='_blank' style='margin:0 5px;border-bottom: 1px solid #555;'>下载</a></span></span><span class='icon-arrows'>&nbsp;</span></div><div class='uPic'><a><img src='Images/IMIcon/uface.jpg?UserSign={5}' width='30' height='30'/></a></div></li>";
//图片信息行
var htmMsgImgLine = "<li class='msgAlign-right'><span style='color:#ccc;display:block'>{0}</span><div class='message-content rightMsg'><span class='message-content-text'><a rel='{1}{2}' toptions='overlayClose=1' class='msgImg'><img src='{1}{3}' data-action='zoom' height='100'/></a></span><span class='icon-arrows'>&nbsp;</span></div><div class='uPic' style='margin:0px'><a><img src='Images/IMIcon/uface.jpg?UserSign={4}' width='30' height='30'/></a></div></li>";
//影音媒体（视频，声音）:0=名称，1=2=地址，3=UserSign
var htmMsgMediaLine = "<li class='msgAlign-right'><span style='color:#ccc;display:block'>{0}</span><div class='message-content rightMsg'><span class='message-content-text'><a rel='{1}{2}' onclick='playMovieMedia(this);' class='msgMedia'><img src='/Images/icon-movie.png' data-action='zoom' height='20'/></a></span><span class='icon-arrows'>&nbsp;</span></div><div class='uPic' style='margin:0px'><a><img src='Images/IMIcon/uface.jpg?UserSign={3}' width='30' height='30'/></a></div></li>";
var htmMsgSoundLine = "<li class='msgAlign-right'><span style='color:#ccc;display:block'>{0}</span><div class='message-content rightMsg'><span class='message-content-text'><a rel='{1}{2}' onclick='playSoundMedia(this);' class='msgMedia'><img src='/Images/icon-sound.png' data-action='zoom' height='20'/><em>你收到一个语音消息，可在手机上查看。</em></a></span><span class='icon-arrows'>&nbsp;</span></div><div class='uPic' style='margin:0px'><a><img src='Images/IMIcon/uface.jpg?UserSign={3}' width='30' height='30'/></a></div></li>";
var htmError = "<li class='im-unline'><span style='color:red;heigth:20px;line-height:20px;text-align:center;display:block;'>通讯连接失败,请稍后再试.</br>{0}</span></li>";//通讯错误提示
//文本信息行
var htmMsgLine = "<li class='msgAlign-right'><span class='msgline-stime'>{0}</span><div class='message-content rightMsg'><span class='message-content-text'>{1}</span><span class='icon-arrows'>&nbsp;</span></div><div class='uPic'><a><img src='Images/IMIcon/uface.jpg?UserSign={2}' width='30' height='30'/></a></div></li>";
var htmMsgLine_unsend = "<li class='msgAlign-right'><span style='color:#ccc;display:block'>{0}</span><div class='message-content rightMsg unsend'><span class='message-content-text'>{1}</span><span class='icon-arrows'>&nbsp;</span></div><div class='uPic'><a><img src='Images/IMIcon/uface.jpg?UserSign={2}' width='30' height='30'/></a></div></li>";

//对方附件信息行：0=UID,1=人名，2=时间，3=文件名，4=服务器路径，5=服务器文件名
var htmMsgFileLineL = "<li class='msgAlign-left'><div class='uPic-left'><a><img src='Images/IMIcon/uface.jpg?UserSign={0}' width='30' height='30'/></a></div><div style='padding:0 35px;'><span class='msgline-snick' title='发送人'>{1}</span><span style='color:#ccc;margin:0 0 0 5px;' title='时间'>{2}</span></div><div class='message-content leftMsg'><span class='icon-arrows-left'>&nbsp;</span><span class='message-content-text'><span class='sp-card'></span><span title='文件名'>{3}</span><span style='float:none;margin:0 0 0 10px;' title='文件大小'>{4}<a href='{5}{6}' title='路径' target='_blank' style='margin:0 5px;border-bottom: 1px solid #555;'>下载</a></span></span></div></li>";
//对方图片信息行
var htmMsgImgLineL = "<li class='msgAlign-left'><div class='uPic-left' style='margin:0px'><a><img src='Images/IMIcon/uface.jpg?UserSign={0}' width='30' height='30'/></a></div><div style='padding:0 35px;'><span>{1}</span><span style='color:#ccc;margin:0 0 0 5px;'>{2}</span></div><div class='message-content leftMsg'><span class='icon-arrows-left'>&nbsp;</span><span class='message-content-text'><a rel='{3}{4}' toptions='overlayClose=1' class='msgImg'><img src='{3}{5}' data-action='zoom' height='100'/></a></span></div></li>";
//对方发送的影音媒体
var htmMsgMediaLineL = "<li class='msgAlign-left'><div class='uPic-left' style='margin:0px'><a><img src='Images/IMIcon/uface.jpg?UserSign={0}' width='30' height='30'/></a></div><div style='padding:0 35px;'><span>{1}</span><span style='color:#ccc;margin:0 0 0 5px;'>{2}</span></div><div class='message-content leftMsg'><span class='icon-arrows-left'>&nbsp;</span><span class='message-content-text'><a rel='{3}{4}' onclick='playMovieMedia(this);' class='msgMedia'><img src='/Images/icon-movie.png' data-action='zoom' height='20'/></a></span></div></li>";
var htmMsgSoundLineL = "<li class='msgAlign-left'><div class='uPic-left' style='margin:0px'><a><img src='Images/IMIcon/uface.jpg?UserSign={0}' width='30' height='30'/></a></div><div style='padding:0 35px;'><span>{1}</span><span style='color:#ccc;margin:0 0 0 5px;'>{2}</span></div><div class='message-content leftMsg'><span class='icon-arrows-left'>&nbsp;</span><span class='message-content-text'><a rel='{3}{4}' onclick='playSoundMedia(this);' class='msgMedia'><img src='/Images/icon-sound.png' data-action='zoom' height='20'/><em>你收到一个语音消息，可在手机上查看。</em></a></span></div></li>";
//地图签到分享:0=uid,1=发送人，2=发送时间，3=经度，4=纬度，5=地标
var htmMsgMapLine = "<li class='msgAlign-right'><span style='color:#ccc;display:block' title='发送时间'>{2}</span><div class='message-content rightMsg'><span class='message-content-text'><div class='mapLine'><span><img src='http://restapi.amap.com/v3/staticmap?zoom=13&size=120*100&markers=mid,,%E8%BF%99:{3},{4}&key=060fdfedab4347846c19f97e0981b860' data-v='{3}_{4}' title='{5}' onclick='ViewMapSide(this);'/></span><p><span>我在这里:</span></p><p class='mapTitle' title='位置描述'><span class='sp-sign'></span>{5}</p></div></span><span class='icon-arrows'>&nbsp;</span></div><div class='uPic' style='margin:0px'><a><img src='Images/IMIcon/uface.jpg?UserSign={0}' width='30' height='30' title='{1}'/></a></div></li>";
var htmMsgMapLineL = "<li class='msgAlign-left'><div class='uPic-left' style='margin:0px'><a><img src='Images/IMIcon/uface.jpg?UserSign={0}' width='30' height='30'/></a></div><div style='padding:0 35px;'><span title='发送人'>{1}</span><span class='msgline-stime' style='margin:0 0 0 5px;' title='发送时间'>{2}</span></div><div class='message-content leftMsg'><span class='icon-arrows-left'>&nbsp;</span><span class='message-content-text'><div class='mapLine'><span><img src='http://restapi.amap.com/v3/staticmap?zoom=13&size=120*100&markers=mid,,%E8%BF%99:{3},{4}&key=060fdfedab4347846c19f97e0981b860' data-v='{3}_{4}' title='{5}' onclick='ViewMapSide(this);'/></span><p><span>我在这里:</span></p><p class='mapTitle'><span class='sp-sign'></span>{5}</p></div></span></div></li>";
//对方文本信息行
var htmMsgLine2 = "<li class='msgAlign-left'><div class='uPic-left'><a><img src='Images/IMIcon/uface.jpg?UserSign={0}' width='30' height='30'/></a></div><div style='padding:0 35px;'><span class='msgline-snick'>{1}</span><span class='msgline-stime' style='margin:0 0 0 5px;'>{2}</span></div><div class='message-content leftMsg'><span class='icon-arrows-left'>&nbsp;</span><span class='message-content-text'>{3}</span></div></li>";
var htmCreateUserListR = "<li><img src='Images/IMIcon/uface.jpg?UserSign={0}' width='30' height='30' /><span class='u-name' id='{1}'>{2}</span></li>";//创建讨论组已选列表（默认行）
var htmCreateUserListL = "<li><img src='Images/IMIcon/uface.jpg?UserSign={0}' width='30' height='30' /><span id='{1}' title='{2}'>{3}</span></li>";//创建讨论组待选列表
var htmCreateUserListRadd = "<li><img src='Images/IMIcon/uface.jpg?UserSign={0}' width='30' height='30' /><span class='u-name' id='{1}'>{2}</span><span class='op-close' onclick='javascript:removeElement(this);'>X</span></li>";//创建讨论组已选列表（添加行）
//用户列表行：0-key,1-usersign,2-username,3-name,4-imid,5-iconsrc,6-class
var htmFormUserList = "<li id='{0}_{1}'><img src='{5}' class='{6}' width='30' height='30'><a href='#' id='U_{1}' data-im='{4}' class='textOverbreak' title='{2}'>{3}</a></li>";//主窗体 用户列表行
//群组列表行：0-key,1-imid,2-iconurl,3-imid,4-subject,5-name
var htmFormGroupListDf = "<li id='{0}_{1}'><img src='{2}' width='30' height='30'><a href='#' id='U_{1}' data-im='{3}' class='textOverbreak' title='{4}'>{5}</a></li>";//主窗体 讨论组列表行 缺省讨论组用户列表行元素 默认头像：dfGroup.png
var htmCreateGroupUserListCur = "<li><img src='Images/IMIcon/uface.jpg?UserSign={0}' width='30' height='30' /><span class='u-name' id='{1}'>{2}</span></li>";//讨论组用户列表（创建窗,群主非当前用户）
var htmCreateGroupUserListCurMe = "<li><img src='Images/IMIcon/uface.jpg?UserSign={0}' width='30' height='30' /><span class='u-name' id='{1}'>{2}</span><span class='op-close' onclick='javascript:removeElement(this);' title='移除'>X</span></li>";//讨论组用户列表（创建列表窗）
var htmCreateGroupUserListMy2 = "<li><img src='Images/IMIcon/uface.jpg?UserSign={0}' width='30' height='30' /><span id='{1}' title='{2}'>{3}</span><span id='sp_{4}' class='op-close' onclick='javascript:removeFromGroup(this.id);' title='移出讨论组'>X</span></li>";//讨论组用户列表创建人行元素
var htmCreateGroupUserListMy = "<li class='mim'><img src='Images/IMIcon/uface.jpg?UserSign={0}' width='30' height='30' /><span id='{1}' title='{2}'>{3}</span><span id='sp_{4}' class='op-close' onclick='javascript:removeFromGroup(this.id);' title='退出讨论组'>X</span></li>";//讨论组用户列表当前用户行元素
var htmCreateGroupUserListMyLine = "<li><img src='Images/IMIcon/uface.jpg?UserSign={0}' width='30' height='30' /><span id='{1}' title='{2}'>{3}</span><span id='sp_{4}' class='op-close' onclick='javascript:removeFromGroup(this.id);' title='退出讨论组'>X</span></li>";//讨论组用户列表当前用户行元素
var htmCreateGroupUserListCreater = "<li class='mim'><img src='Images/IMIcon/uface.jpg?UserSign={0}' width='30' height='30' /><span id='{1}' title='{2}'>{3}</span></li>";//讨论组用户列表当前用户行元素
var htmCreateGroupUserList = "<li><img src='Images/IMIcon/uface.jpg?UserSign={0}' width='30' height='30' /><span id='{1}' title='{2}'>{3}</span></li>";//讨论组用户列表其他用户行元素 有自定义头像。--此行暂时不用
var sysMsgLine = "<li class='sys-line' style='text-align:center;color:#ccc;'>{0}<span></span></li>";
var loadMoreTip = "<li class='lm-line' style='text-align:center;color:#ccc;'><a data-value='{0}' onclick='loadMoreMsg(this);'><span class='questionIcon'></span>查看更多消息</a></li>";
var loaderID = 1001;
var firstTimeLoad = true;

//Begin DOM Ready.
$(document).ready(function () {
        IMLogin();//IM 登录

        setTimeout(function () {
            firstTimeLoad = true;
            InitialIMFrame();
        },2000);

        $(".talk-tab span").bind("click", function () {
            var i = $(this).attr('data-rel');
            $(".talk-tab span").removeClass("tab-now").eq(i).addClass("tab-now");
            $("#talkBoxContent>div").hide().eq(i).show();
        });

        //关闭对话窗
        $(".top-talk-close").click(function (e) {
            $(this).closest("div.talkingBox").hide();
        });
        //页签收缩事件
        $(".subNav").click(function () {
            $(this).toggleClass("currentDd").siblings(".subNav").removeClass("currentDd")
            $(this).toggleClass("currentDt").siblings(".subNav").removeClass("currentDt")
            $(this).next(".chat-listContent").slideToggle(500).siblings(".chat-listContent").slideUp(500);
        });
        //设置选项：创建讨论组事件
        $(".im-Setting ul li").eq(3).unbind("click").bind("click", function () {
            $(".cb-right-list #selectedList").empty();
            loadCreateUserList();//加载用户列表
            layer.open({
                type: 1,
                title: '创建讨论组',
                shade: false,
                shadeClose: false,
                area: ['445px', '540px'],
                content: $("#createBox"),
            });
            $(".im-Setting").hide();
            $("#objName").removeAttr("disabled");
        });
        /*设置选项：在线*/
        $(".im-Setting ul li").eq(0).unbind("click").bind("click", function () {
            IMLogin();
            setTimeout(ListenNotReadMsg,3000);
            $(".im-Setting").hide();
        });
        /*设置选项：离线*/
        $(".im-Setting ul li").eq(1).unbind("click").bind("click", function () {
            sdk.Base.destroy();
            $(".im-Setting").hide();
        });
        /*设置选项：刷新组织架构*/
        $(".im-Setting ul li").eq(2).unbind("click").bind("click", function () {
            firstTimeLoad = false;
            loadTalkBaseData();
            $(".im-Setting").hide();
        });
        //设置按钮事件
        $("#im-n-seting").toggle(function () {
            $(".im-Setting").show();
        }, function () {
            $(".im-Setting").hide();
        });
        //关闭窗体事件
        $("#closeBtn").click(function () {
            $("#selectedList").empty();
            $("#objName").val("");
            layer.closeAll();
        });
        $(".tName").toggle(function(){
            $(".tak-infos").slideDown('500');
            $(".tog-sho").addClass('active');
        },function(){
            $(".tak-infos").slideUp('500');
            $(".tog-sho").removeClass('active');
        });
        //$(".si-face").toggle(function(){$(".face-box").show();},function(){$(".face-box").hide();});//Not Used.
        $(".si-face").click(function(){
            if($(".face-box").css('display')=='none'){
                $(".face-box").show();
            }else{
                $(".face-box").hide();
            }
        });
        $(".sb-img").on('click',function(){return $("#upImgTarget").click();});
        $(".sc-img").on('click',function(){layer.msg('该功能暂不开放');});
        $("#btn_searchMsg").click(function(){SearchHistoryMsg();});
        //表情选择
        $(".face-box div.emoji ul li").live("click", function () {
            var dname = $(this).attr("title");
            $("#talkingBox #txtInput").html($("#talkingBox #txtInput").html() + replaceFaceInfo("[" + dname + "]"));
            $(".face-box").css("display", "none");
        });
        //滚动条监听
        var nScrollHight = 0;
        var nScrollTop = 0;
        var nObjHight = 0;
        $("ul#UserList").on("scroll", function (e) {
            if (50>= $(this).height() - $(this).scrollTop()) {
                //LoadMoreUserList();
            }
        });

        //var dropload = $('ul#UserList').dropload({
        //    scrollArea: window,
        //    domDown: {
        //        domClass: 'dropload-down',
        //        domRefresh: '<div class="dropload-refresh">上拉加载更多</div>',
        //        domLoad: '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
        //        domNoData: '<div class="dropload-noData">已无数据</div>'
        //    },
        //    loadDownFn: function (me) {
        //        setTimeout(function () {
        //            if (false) {
        //                me.resetload();
        //                me.lock();
        //                me.noData();
        //                me.resetload();
        //                return;
        //            }
        //            LoadMoreUserList();
        //            me.resetload();
        //        },5000);
        //    }
        //});


        $("div.unsend").live("click", function () {
            var txxt = $(this).find("span.message-content-text").text();
            //重新发送消息：
            console.log('resend msg.');
        });
        //button.发送对象信息:one to one
        $("#btnSend").click(function () {
            $("#txtInput").find("img.faceImg").each(function () {
                var faceName = $(this).attr("alt");
                $(this).after("[" + faceName + "]");
                $(this).remove();
            });
            var msg = $("#txtInput").text();//.html().replace('<div>', '\r\n').replace('</div>', '');//.text().replace(/\\r\\n/gi,'</br>');
            if ($.trim(msg) == "") {
                return false;
            }
            _talkID = elem.TalkOneID.val();//.split('_')[1];
            if (_talkID == currentUserID) {
                return false;
            }
            msgData.UserSign = currentUserID;
            msgData.Msg = msg;
            msgData.To = _talkID;
            msgData.MediaType = 0;
            var sendMsg = JSON.stringify(msgData);
            var mType=$('#TalkType').val();
            if(mType=='0'){
                SendMessageTone("0", sendMsg);
            }else if(mType=='1'){
                SendMessageTgroup("0", sendMsg);
            }else{
                var curTypeCG = $("#TalkTypeIsCG").val();
                SendMessageToESQ(curTypeCG,sendMsg);
            }

        });

        //注册图片放大事件.
        $(".msgBox a.msgImg").live("click", function () {
            var sr = $(this).attr("rel");
            layer.open({
                type: 1,
                title: false,
                closeBtn: 1,
                shadeClose: true,
                scrollbar: false,
                area: 'auto',
                skin: 'layui-ext-opbox',
                content: '<div style="border:1px solid gray;border-radius:5px;padding:5px;background:#fff;"><img src=' + sr + ' style="border:none;width:100%;height:100%;"/></div>'
            });
        });
        $(".uPic-left").live("dblclick", function () {
            var id = $(this).find("img").attr("src").split('=')[1];
            if (typeof(id)=='undefined') {
                return false;
            }
            var imid = ReadUserNameByID(id).ImUserid;
            var title = $(this).siblings().eq(0).children("span").first().text();
            elem.TalkOneName.empty();
            elem.TalkOneName.append(htmTitle.format(title));
            elem.TalkOnePic.empty();
            elem.TalkOnePic.append(htmPic.format(id));
            elem.TalkOneMsg.empty();
            elem.TalkOneID.val(imid);
            elem.TalkOneTitle.val(title);
            if (elem.TalkGroup.css("display") == "block") {
                elem.TalkOne.css("right", "390px");
            } else {
                elem.TalkOne.css("right", "340px");
            }
            openTalkConnection("talkingBox");
        });
        $("#listUserGroup li").live("dblclick",function () {
            var id = $(this).children("span").first().attr("id");
            if (id == currentUserID) {
                return false;
            }
            var imid = ReadUserNameByID(id).ImUserid;
            var title = $(this).children("span").first().text();
            elem.TalkOneName.empty();
            elem.TalkOneName.append(htmTitle.format(title));
            elem.TalkOnePic.empty();
            elem.TalkOnePic.append(htmPic.format(id));
            elem.TalkOneMsg.empty();
            elem.TalkOneID.val(imid);
            elem.TalkOneTitle.val(title);

            openTalkConnection("talkingBox");
        });
        //注册通讯录列选择事件
        $(".cb-left-list #userList li").live("click",function () {
            var id = $(this).children("span").first().attr("id");
            var name = $(this).children("span").first().text();
            var has = 0;
            $(".cb-right-list #selectedList li").each(function () {
                var cur = $(this).find("span").eq(0).attr("id");
                if (cur == id) {
                    has++;
                    $(this).remove();
                    return false;
                }
            });
            if (has == 0) {
                $(".cb-right-list #selectedList").append(htmCreateUserListRadd.format(id, id, name));
                $(this).append("<i class='selMark'></i>");
            }
            else {
                $(this).find("i.selMark").remove();
            }
            var cout = $(".cb-right-list #selectedList li").length;
            $("#sel-cout").text(cout);
        });

        //对话窗拉伸事件A
        $("#talkingBox").resize(function () {
            var curY = $(this).height();
            var curX = $(this).width();
            if (curX >= 550) {
                $(this).find("div#msgBox").width(curX);
            }
            if (curY >=500) {
                $(this).find("div#msgBox").height(curY - 205);

            }
        });

        //鼠标点击文档事件
        $(document).on('click',function (e) {
            if($(e.target).closest('.si-face').length>0){
                e.stopPropagation();
            }else if($(e.target).closest('.tak-infos').length>0){
                e.stopPropagation();
            }
            else if ($(e.target).closest('.face-box').length>0) {
                e.stopPropagation();
            } else {
                $(".face-box").hide();
                $(".tak-infos").slideUp('500');
                $(".tog-sho").removeClass('active');
            }
        });
     });//End DOM Ready.

var uploader = null;
var upState = 0;
var ckError =false;
//WebUploader文档上传插件：
function RenderWebUploader() {
    uploader = WebUploader.create({
        swf: 'Scripts/webuploader/Uploader.swf',
        server: '/Home/FileUploader',//the URL where upload file to save.
        pick: '#filePicker',
        dnd: '#contentBox',
        paste:'document.body',
        auto: true,
        resize: false,
        chunked: false,//分片上传
        chunkSize: 524288,//分多大一片:1兆字节(mb)=1048576字节(b)
        chunkRetry: 2,//允许几次自动重传
        threads: 2,//最多并发数
        fileSizeLimit: 52428800,//(50MB)验证文件总大小是否超出限制, 超出则不允许加入队列
        fileNumLimit: 5,//验证文件总数量, 超出则不允许加入队列
        fileSingleSizeLimit: 10240000,//(10MB)验证单个文件大小是否超出限制, 超出则不允许加入队列
        accept: {
            title: 'File Type',
            extensions: '*'
        }
    });
    //当文件被加入队列之前触发，此事件的handler返回值为false，则此文件不会被添加进入队列:
    uploader.on('beforeFileQueued', function (file) {
        console.log(file);
    });
    //当文件被加入队列以后触发:
    uploader.on('fileQueued', function (file) {
        console.log(file);
        var me = this,
        owner = this.owner,
        server = me.options.server,
        deferred = WebUploader.Deferred();
        uploader.md5File(file)
        // 如果读取出错了，则通过reject告诉webuploader文件上传出错。
        .fail(function () {
            deferred.reject();
        })
        // 及时显示进度
        .progress(function (percentage) {
            console.log('Percentage:', percentage);
        })
        // 完成
        .then(function (val) {
            console.log('md5 result:', val);
            //与服务器校验文件MD5是否存在
            //$.ajax('Home/checkFileMD5', {
            //    dataType: 'json',
            //    data: {
            //        fMd5: val
            //    },
            //    success: function (response) {
            //        console.log(response);
            //        // 如果验证已经上传过
            //        if (response.Data) {
            //            //owner.skipFile(file);
            //            deferred.reject();
            //            console.log('文件重复，已跳过');
            //        }
            //        // 介绍此promise, webuploader接着往下走。
            //        deferred.resolve(true);
            //    }
            //});
        });
    });
    //uploader.register({
    //    'before-send-file': 'ckFilesMd5'
    //}, {
    //    ckFilesMd5: function (file) {
    //        uploader.md5File(file).then(function (val) {
    //            //与服务器校验文件MD5是否存在
    //            $.ajax('Home/checkFileMD5', {
    //                dataType: 'json',
    //                data: {
    //                    fMd5: val
    //                },
    //                success: function (response) {
    //                    console.log(response);
    //                    // 如果验证已经上传过
    //                    if (response.Data) {
    //                        //owner.skipFile(file);
    //                        deferred.reject();
    //                        console.log('文件重复，已跳过');
    //                    }
    //                    // 介绍此promise, webuploader接着往下走。
    //                    deferred.resolve(true);
    //                }
    //            });
    //        });

    //    }
    //});
    //当开始上传流程时触发:
    uploader.on('startUpload', function (file) {
        if (ckError) {
            return false;
        }
        console.log(file);
        loaderID = parseInt(Math.random(1000) * 1000);
        var bType = $("#hd_mediaType").val().split('_')[2];//解析窗口类型
        if (bType == "1001") {
            elem.TalkOneMsg.append(waitingHtm.format("waitingBar_" + loaderID, "正在发送中..."));
            scrollDown(elem.TalkOneMsg);
        }
    });
    //文件上传过程中创建进度条实时显示:
    uploader.on('uploadProgress', function (file, percentage) {
        var iPercent = parseFloat(Math.round(percentage * 100).toFixed(2)) - 1;//toDecimalACT(iPercent * 100)
        var ePercent = 100 - iPercent;
        console.log(ePercent);
        var bType = $("#hd_mediaType").val().split('_')[2];//解析窗口类型
        if (bType == "1001") {
            elem.TalkOneMsg.find('li[id="waitingBar_' + loaderID + '"]>div>div.waitingBar').css("width", ePercent + "%");
            elem.TalkOneMsg.find('li[id="waitingBar_' + loaderID + '"]>div>div.lb_tip').text("上传中" + iPercent + "%");
        }
    });
    //当文件上传成功时触发:
    uploader.on('uploadSuccess', function (file, response) {
        var flag = response.ContentType;
        if (typeof (flag) == 'undefined') {
            layer.msg("错误：" + response._raw);
            return false;
        }
        var mType = $("#hd_mediaType").val().split('_')[1];//解析媒体类型:img、file
        var tType = $("#hd_mediaType").val().split('_')[2];//解析窗口类型：1001=个人对话，1002=群组对话
        if (tType == "1001") {
            elem.TalkOneMsg.find('li[id="waitingBar_' + loaderID + '"]>div>div.lb_tip').text("上传完成 99%");
            elem.TalkOneMsg.find('li[id="waitingBar_' + loaderID + '"]').remove();
        }
        var fileInfo = JSON.parse(response.Data);
        if (fileInfo.fileServerName != "") {
            var newName = fileInfo.fileNewName;//文件新名 如：yyyyMMddhhmmss.txt
            var oldName = fileInfo.fileOldName;//文件原名 如:我的文件名.txt
            var sName = fileInfo.fileServerName;//文档服务器返回的文件名
            var serverPath = fileInfo.fileServerPath;//文件服务器路径
            var fileLen = fileInfo.fileLength;//文件大小
            var imgWidth = fileInfo.Width;
            var imgHeight = fileInfo.Height;

            if ($.trim(newName) != "") {
                if (tType == "1001") {
                    if (mType == 'img') {//图片已使用TOP Server.
                        var toId = elem.TalkOneID.val();
                        var msg = { "UserSign": currentUserID, "To": toId, "Msg": oldName, "MediaType": 1, "FileName": sName, "Size": fileLen, "Path": serverPath, "Width": imgWidth, "Height": imgHeight };
                        msg = JSON.stringify(msg);
                        SendMessageTone("1", msg);
                    } else {
                        var toId = elem.TalkOneID.val();
                        var msg = { "UserSign": currentUserID, "To": toId, "Msg": oldName, "MediaType": 3, "FileName": sName, "Size": fileLen, "Path": serverPath };
                        SendCustomMessage(msg);
                    }
                }
                else if (tType == "1002") {
                    if (mType == 'img') {//图片已使用TOP Server.
                        var toId = elem.TalkGroupID.val().split('_')[1];//通话ID(与个人对话不同,个人对话ID不带前缀),如：G_10086
                        var msg = { "UserSign": currentUserID, "To": toId, "Msg": oldName, "MediaType": 1, "FileName": sName, "Size": fileLen, "Path": serverPath, "Width": imgWidth, "Height": imgHeight };
                        msg = JSON.stringify(msg);
                        SendMessageTgroup("1", msg);
                    }
                    else {
                        var toId = elem.TalkGroupID.val().split('_')[1];
                        var msg = { "UserSign": currentUserID, "To": toId, "Msg": oldName, "MediaType": 3, "FileName": sName, "Size": fileLen, "Path": serverPath };
                        SendGroupTribeMessage(msg);
                    }
                }
            }
        } else {
            layer.msg("文件上传失败,请稍后再试...");
        }
    });
    //不管成功或者失败，文件上传完成时触发
    uploader.on('uploadComplete', function (file) {
        console.log(file);
        upState = 0;
        if (file.statusText == "timeout") {
            layer.msg("网络请求超时!");
        }

        var bType = $("#hd_mediaType").val().split('_')[2];//解析窗口类型
        if (bType == "1001") {
            elem.TalkOneMsg.find('li[id*="waitingBar_"]').remove();
        }
        uploader.removeFile(file);
    });
    uploader.on('error', function (handler) {
        console.log(handler);
        var ret = false;
        switch (handler) {
            case "Q_EXCEED_NUM_LIMIT":
                layer.msg("每次最高上传9个文件", {icon:5});
                break;
            case "Q_EXCEED_SIZE_LIMIT":
                layer.msg("文件大小超出限制(10M)", { icon:5});
                break;
            case "Q_TYPE_DENIED":
                layer.msg("文件大小不能为0KB", { icon:5});
                break;
            case "F_EXCEED_SIZE":
                layer.msg("文件大小超出限制(10M)", { icon:5});
                break;
            case "F_DUPLICATE":
                //layer.msg("该文件已经上传过，是否重新上传？", { icon: 5 });
                ret = true;
                break;
            default:
                break;
        }
        //error = false;
        ckError = true;
        var bType = $("#hd_mediaType").val().split('_')[2];//解析窗口类型
        if (bType == "1001") {
            elem.TalkOneMsg.find('li[id*="waitingBar_"]').remove();
        }
        if (ret) {
            //uploader.retry();
            uploader.reset();
        }
        //var upState = uploader.getStats();
        //if (upState.queueNum == 0) {
        //    uploader.reset();
        //}
    });
    uploader.on("all", function (type) {
        //console.log(type);
        //var upState = uploader.getStats();
    });
}

//异步加载通用方法
function AjaxApi(url, type, data) {
    var jsondata = [];
    $.ajax({
        url: url,
        type: type,
        data: data,
        dataType: 'json',
        async: false,
        cache: true,
        beforeSend: function () {
        },
        success: function (response) {
            var flag = response.ContentType;
            var data = response.Data;
            if (flag == "True") {
                if (data != "") {
                    jsondata = JSON.parse(data);
                }
            } else {
                console.log(data);
            }
        },
        error: function (request) {
            //layer.msg("获取数据失败,请检查网络重新登录稍后再试!");
            console.log(request);
        }
    });
    return jsondata;
}

//表情文本替换函数
function replaceFaceInfo(par) {
    var htm = par;
    if (par != "") {
        //var reg = /\[.+?\]/g;
        var reg = /\[([^\]]+)\]/g;
        htm = par.replace(reg, function (a, b) {
            var fc = face[a];
            if (typeof (fc) == 'undefined') {
                return a;
            } else {
                var img = "<img src='./Images/Face/" + fc + "' class='faceImg' alt='" + b + "' />";
                return img;
            }
        });
    }
    return htm;
}
//表情文本替换函数
function replaceFaceInfoUrl(par) {
    var htm = par;
    if (par != "") {
        //var reg = /\[.+?\]/g;
        var reg = /\[([^\]]+)\]/g;
        htm = par.replace(reg, function (a, b) {
            var fc = face[a];
            if (typeof (fc) == 'undefined') {
                return a;
            } else {
                var img = "./Images/Face/" + fc + "";
                return img;
            }
        });
    }
    return htm;
}
//渲染表情盒（旧）
function renderEmoji() {
    var emos = getEmojiList()[0];
    var htm = '<ul>';
    for (var i = 0; i < emos.length; i++) {
        var emo = emos[i];
        var data = 'data:image/png;base64,' + emo[2];
        if (i % 20 == 0) {
            htm += '<li action-type="select" action-data="" title="' + emo[1] + '" class="">';
        } else {
            htm += '<li action-type="select" action-data="" title="' + emo[1] + '">';
        }
        htm += '<img style="display:inline;vertical-align:middle;" src="' + data + '" unicode16="' + emo[1] + '"/></li>';
    }
    $("#emojiMore").empty().append(htm);
}
//渲染表情盒
function RenderDefaultFace() {
    var emos = face;
    var htm = '<ul>';
    for (var key in emos) {
        var ks = key.substr(1,key.lastIndexOf(']')-1);
        htm += "<li action-type='select' action-data='' title='" + ks + "'><img src='./Images/Face/" + emos[key] + "'></li>";
    }
    htm += "</ul>";
    $(".face-list").empty().append(htm);
}

//获取元素Y坐标值
function getTop(e) {
    var offset = e.offsetTop;
    if (e.offsetParent != null) {
        offset += getTop(e.offsetParent)
    }
    return offset;
}
//获取元素X坐标值
function getLeft(e) {
    var offset = e.offsetLeft;
    if (e.offsetParent != null) {
        offset += getLeft(e.offsetParent);
    }
    return offset;
}
//计算图片压缩比例：h=原高，w=原宽，b=缩放比例大小
function ComputImgSize(h, w, b) {
    var p = h / w;
    return parseInt(b / p);
}

//讨论组添加联系人右侧列表 行删除事件：
function removeElement(obj) {
    var curID = $(obj).parent().find("span.u-name").attr("id");
    $(obj).parent().remove();
    $(".cb-left-list #userList li").each(function () {
        if ($(this).find("span").first().attr("id")==curID) {
            $(this).find("i.selMark").remove();
        }
    });
    var cout = $(".cb-right-list #selectedList li").length;
    $("#sel-cout").text(cout);
}

//加载最近联系人列表（Top　Server）：
function LoadTopRecentContacts() {
    sdk.Base.getRecentContact({
        count:50,
        success: function (data) {
            console.log("--最近会话--",data);
            data = data.data;
            var list = data.cnts, type = '';
            var gHtm = '';
            var gHtm2 = '';
            list.forEach(function(item){
                var has = 0;
                var imid = item.uid.substring(8);
                if (imid==ImUID) {
                    return true;
                }
                if (imid.length>10) {
                    var userInfo = ReadUserName(imid);
                    var usid = userInfo.UserSign;
                    var sendTime = item.time;
                    type = item.type;
                    var msg = typeof (item.msg.length) != 'undefined' ? item.msg[0][1] : item.msg;
                    if (usid!='') {
                        var uname = typeof (userInfo.UserName) == 'undefined' ? "佚名" : userInfo.UserName;
                        var uShortName = "";
                        if (uname.lengthGB() > 10) {
                            uShortName = uname.substr(0, 10) + "...";
                        } else {
                            uShortName = uname;
                        }
                        var uShortMsg = "";
                        if (type===0) {
                            if (uname.lengthGB() > 10) {
                                uShortMsg = msg.substr(0, 10) + "...";
                            } else {
                                uShortMsg = msg;
                            }
                        }
                        else {
                            uShortMsg = "[消息]";
                        }
                        gHtm += htmNewLineOne.format(usid, imid, uShortName, uShortMsg, '', '');
                        gHtm2+=htmNewLineO.format(usid + "_" + imid, usid, usid, uname, uShortName, "");
                    }
                }
            });
            elem.TalkNewList.append(gHtm);
        },
        error: function(error){
            console.log('获取最近联系人及最后一条消息内容失败' ,error);
        }
    });
}

function loadMoreMsg(obj) {
    $(obj).parent().remove();
    LoadTopHistoryMsg($("#TalkType").val());
}
//读取历史记录：Top Server
function LoadTopHistoryMsg(tp) {
    var imid =elem.TalkOneID.val();//对话IMID
    elem.TalkOneMsg.find("li.lm-line").remove();
    var nkey = $("#hd_nextKey").val();
    if (nkey =="0") {
        return false;
    }

    //单聊模式：
    if (tp == "0") {
        sdk.Chat.getHistory({
            touid: imid,
            nextkey: nkey,
            count:10,
            success: function (data) {
                console.log('--获取历史消息成功--',data);
                var curNkey = data.data.nextKey;
                $("#hd_nextKey").val(curNkey==''?'0':curNkey);
                var msgData = data.data.msgs;
                if (msgData.length > 0) {
                    var htm = "";
                    elem.TalkOneMsg.find("li.lm-line").remove();
                    $.each(msgData, function (key, item) {
                        htm=formatMsgLine(tp,item);//序列化行元素
                        var cout = elem.TalkOneMsg.find("li").length;
                        if (cout > 0) {
                            elem.TalkOneMsg.find("li").eq(0).before(htm);
                        }
                        else {
                            elem.TalkOneMsg.append(htm);
                        }
                    });
                    if (curNkey!='') {
                        elem.TalkOneMsg.find("li").eq(0).before(loadMoreTip.format(tp));
                    } else {
                        elem.TalkOneMsg.find("li").eq(0).before(sysMsgLine.format("--没有更多记录了--"));
                    }
                    //scrollDown(elem.TalkOneMsg);
                }
            },
            error: function (error) {
                console.log('获取历史消息失败', error);
            }
        });
        if (nkey=='') {
            sdk.Chat.setReadState({
                touid: imid,
                timestamp: Math.floor((+new Date()) / 1000)+5000,
                success: function (data) {
                    //console.log('已读');
                },
                error: function (error) {
                    console.log('已读失败');
                }
            });
        }
    }
    else if (tp == "1") {//群聊模式：
        sdk.Tribe.getHistory({
            tid:imid,
            nextkey: nkey,
            count:10,
            success: function (data) {
                console.log('--获取群历史消息成功--',data);
                var curNkey = data.data.nextKey;
                $("#hd_nextKey").val(curNkey == '' ?'0': curNkey);
                var msgData = data.data.msgs;
                if (msgData.length > 0) {
                    var htm = "";
                    $.each(msgData, function (key, item) {
                        htm=formatMsgLine(tp,item);//序列化行元素

                        var cout = elem.TalkOneMsg.find("li").length;
                        if (cout > 0) {
                            elem.TalkOneMsg.find("li").eq(0).before(htm);
                        }
                        else {
                            elem.TalkOneMsg.append(htm);
                        }
                    });
                    if (curNkey!='') {
                        elem.TalkOneMsg.find("li").eq(0).before(loadMoreTip.format(tp));
                    } else {
                        elem.TalkOneMsg.find("li").eq(0).before(sysMsgLine.format("--没有更多记录了--"));
                    }
                    //scrollDown(elem.TalkOneMsg);
                }

            },
            error: function(error){
                console.log('--获取群历史消息失败--', error);
                if (error.code===1001) {
                    IMLogin();
                }
            }
        });

    }
}

//消息格式化：tp=对话框类型，data=对话数据
var formatMsgLine=function(tp,data){
    console.log('--格式数据行--',data);
    var htm='';
    try{
        var mType =data.type;//消息类型

        var subIMID=_sdk.Base.getNick(data.from);//去除用户长id的前缀，即前8位.或者使用：e.from.substring(8)
        var userInfo = ReadUserName(subIMID);
        var sUID = userInfo.UserSign;
        var sName = userInfo.UserName!=''?userInfo.UserName:"佚名";
        var toUserInfo=null;
        if(tp=='0'){
            toUserInfo = ReadUserName(data.to.substring(8));
        }else{
            toUserInfo = ReadUserName(data.to);
        }
        var toUID = toUserInfo.UserSign;
        var toName = toUserInfo.UserName;
        var curDate = formatDate("m月d日 h时i分", new Date(data.time), 4);//发送时间
        var sysTip =data.HintText + "—" + curDate;
        var hint = 0;//. item.Hint;//1-系统提示，0-通信信息
        var msg =data.msg;//发送的消息体

        if (hint == 0) {
            if (sUID != currentUserID) {
                switch (mType) {
                    case 0:
                        var mapReg = /http:\/\/ditu.google.cn\/maps/g;
                        var mediaReg = /.file.alimmdn.com\//g;
                        var isMap = mapReg.exec(msg);
                        var isMedia = mediaReg.exec(msg);
                        console.log(isMap);
                        if (isMap != null) {
                            var le = msg.substr(msg.lastIndexOf(':') + 1, msg.lastIndexOf('）')).split(',');
                            console.log(le);
                            htm = htmMsgMapLineL.format(sUID, sName, curDate, le[0], le[1], '我在这里，点击查看地图');
                        } else if (isMedia != null) {
                            htm = htmMsgMediaLineL.format(sUID, sName, curDate, msg, '');
                        } else {
                            msg = replaceFaceInfo(msg);
                            htm = htmMsgLine2.format(sUID, sName, curDate, msg);
                        }
                        break;
                    case 1:
                        htm = htmMsgImgLineL.format(sUID, sName, curDate, msg, '', '');//图片
                        break;
                    case 2:
                        htm = htmMsgSoundLineL.format(sUID, sName, curDate, docUrl, item.Path);//语音
                        break;
                    case 3:
                        var mInfo = JSON.parse(msg);
                        htm = htmMsgMediaLineL.format(sendUID, fromName, curDate, mInfo.resource, '');
                        break;
                    case 4:
                        var mInfo = JSON.parse(msg);
                        htm = htmMsgMediaLineL.format(sendUID, fromName, curDate, mInfo.resource, '');
                        break;
                    case 17:
                        var fileInfo =JSON.parse(msg.customize);
                        if (typeof(fileInfo) != 'undefined') {
                            if (fileInfo.T == 1000) {
                                var fsize = parseInt(fileInfo.D.L / 1024) > 1024 ? (fileInfo.D.L / 1048576).toFixed(2) + " MB" : (fileInfo.D.L / 1024).toFixed(2) + " KB";
                                var fileSrc = docUrl + fileInfo.D.P;
                                if (privateMark == 1) {
                                    htm = htmMsgFileLineL.format(sUID, sName, curDate, fileInfo.D.F, fsize, fileSrc, '');
                                } else {
                                    htm = htmMsgFileLineL.format(sUID, sName, curDate, fileInfo.D.F, fsize, fileSrc + "?filename=" + encodeURI(fileInfo.D.F), '');
                                }
                            }
                        }
                        break;
                    case 66:
                        var fileInfo =JSON.parse(msg.customize);
                        if (typeof (fileInfo) != 'undefined') {
                            if (fileInfo.T == 1000) {
                                var fsize = parseInt(fileInfo.D.L / 1024) > 1024 ? (fileInfo.D.L / 1048576).toFixed(2) + " MB" : (fileInfo.D.L / 1024).toFixed(2) + " KB";
                                var fileSrc = docUrl + fileInfo.D.P;
                                if (privateMark == 1) {
                                    htm = htmMsgFileLineL.format(sUID, sName, curDate, fileInfo.D.F, fsize, fileSrc, '');
                                } else {
                                    htm = htmMsgFileLineL.format(sUID, sName, curDate, fileInfo.D.F, fsize, fileSrc + "?filename=" + encodeURI(fileInfo.D.F), '');
                                }
                            }
                        }
                        break;

                    default:
                        break;
                }
            } else {
                switch (mType) {
                    case 0:
                        var mapReg = /http:\/\/ditu.google.cn\/maps/g;
                        var mediaReg = /.file.alimmdn.com\//g;
                        var isMap = mapReg.exec(msg);
                        var isMedia = mediaReg.exec(msg);
                        console.log(isMap);
                        if (isMap != null) {
                            var le = msg.substring(msg.lastIndexOf(':') + 1, msg.lastIndexOf('）')).split(',');
                            console.log(le);
                            htm = htmMsgMapLine.format(sUID, sName, curDate, le[0], le[1], '我在这里，点击查看地图');
                        } else if(isMedia!=null){
                            htm = htmMsgMediaLine.format(curDate,msg,'', sUID);
                        } else {
                            msg = replaceFaceInfo(msg);
                            htm = htmMsgLine.format(curDate, msg, sUID);
                        }
                        break;
                    case 1:
                        htm = htmMsgImgLine.format(curDate, msg, '', '', sUID);
                        break;
                    case 2:
                        htm = htmMsgSoundLine.format(curDate, docUrl, item.Path, currentUserID);
                        break;
                    case 3:
                        var mInfo = JSON.parse(msg);
                        htm = htmMsgMediaLine.format(curDate,mInfo.resource,'',sUID);
                        break;
                    case 4:
                        var mInfo = JSON.parse(msg);
                        htm = htmMsgMediaLine.format(curDate, mInfo.resource, '', sUID);
                        break;
                    case 17:
                        var fileInfo =JSON.parse(msg.customize);
                        if (fileInfo != 'undefined') {
                            if (fileInfo.T == 1000) {
                                var fsize = parseInt(fileInfo.D.L / 1024) > 1024 ? (fileInfo.D.L / 1048576).toFixed(2) + " MB" : (fileInfo.D.L / 1024).toFixed(2) + " KB";
                                var fileSrc = docUrl + fileInfo.D.P;
                                if (privateMark == 1) {
                                    htm = htmMsgFileLine.format(curDate, fileInfo.D.F, fsize, fileSrc, '', currentUserID);
                                } else {
                                    htm = htmMsgFileLine.format(curDate, fileInfo.D.F, fsize, fileSrc + "?filename=" + encodeURI(fileInfo.D.F), '', currentUserID);
                                }
                            }
                        }
                        break;
                    case 66:
                        var fileInfo =JSON.parse(msg.customize);
                        if (typeof (fileInfo) != 'undefined') {
                            if (fileInfo.T == 1000) {
                                var fsize = parseInt(fileInfo.D.L / 1024) > 1024 ? (fileInfo.D.L / 1048576).toFixed(2) + " MB" : (fileInfo.D.L / 1024).toFixed(2) + " KB";
                                var fileSrc = docUrl + fileInfo.D.P;
                                if (privateMark == 1) {
                                    htm = htmMsgFileLine.format(curDate, fileInfo.D.F, fsize, fileSrc, '', currentUserID);
                                } else {
                                    htm = htmMsgFileLine.format(curDate, fileInfo.D.F, fsize, fileSrc + "?filename=" + encodeURI(fileInfo.D.F), '', currentUserID);
                                }
                            }
                        }
                        break;

                    default:
                        break;
                }
            }
        }
        else if (hint == 1) {
            htm = sysMsgLine.format(sysTip);
        }
    }catch(ex){
        htm='<li>this data is not serialize.</li>';
    }
    return htm;
}

var lastMsgID = '';
//搜索历史记录：Top Server
function SearchTopHistoryMsg(obj) {
    var imid = elem.TalkOneID.val();
    var skeyWord = $("#txt_search").val();
    var nkey = $("#hd_nextKey").val();
    var tp =$('#TalkType').val();
    if (tp == "0") {
        sdk.Chat.getHistory({
            touid: imid,
            nextkey: nkey,
            count:20,
            success: function (data) {
                console.log('--（查询）获取历史消息成功--');
                console.log(data);
                var curNkey = data.data.nextKey;
                $("#hd_nextKey").val(curNkey);
                var msgData = data.data.msgs;
                if (msgData.length > 0) {
                    var htm = "";
                    $.each(msgData, function (key, item) {
                        var mType = item.type;
                        var msg = item.msg;
                        var curDate = formatDate("m月d日 h时i分", new Date(item.time), 4);
                        if (curNkey == '' && (key == msgData.length)) {
                            lastMsgID = item.msgId;//TOP server 最后一条消息ID
                        }
                        if (mType==66 || mType==17) {
                            msg = JSON.stringify(msg);
                        }
                        if (msg.indexOf(skeyWord) >= 0) {
                            htm=formatMsgLine(tp,item);
                        }
                        var cout = elem.TalkOneMsg.find("li").length;
                        if (cout > 0) {
                            elem.TalkOneMsg.find("li").eq(0).before(htm);
                            htm = '';
                        }
                        else {
                            elem.TalkOneMsg.append(htm);
                            htm = '';
                        }
                    });
                    scrollDown(elem.TalkOneMsg);
                }
                if (curNkey != '') {
                    SearchTopHistoryMsg(obj);
                }
                else {
                    elem.TalkOneMsg.find("li").eq(0).before(sysMsgLine.format("--没有更多记录了--"));
                }
            },
            error: function (error) {
                console.log('获取历史消息失败', error);
            }
        });
    }
    else if (tp == "1") {
        sdk.Tribe.getHistory({
            _talkID: imid,
            nextkey: nkey,
            count: 10,
            success: function (data) {
                console.log('--（查询）获取历史消息成功--');
                console.log(data);
                var curNkey = data.data.nextKey;
                $("#hd_nextKey").val(curNkey);
                var msgData = data.data.msgs;
                if (msgData.length > 0) {
                    var htm = "";
                    $.each(msgData, function (key, item) {
                        var hint = 0;
                        var mType = item.type;
                        var userInfo = ReadUserName(item.from.substring(8));
                        var sUID = userInfo.UserSign;
                        var sName = userInfo.UserName;
                        var toUserInfo = ReadUserName(item.to.substring(8));
                        var toUID = toUserInfo.UserSign;
                        var toName = toUserInfo.UserName;
                        var msg = item.msg;
                        var curDate = formatDate("m月d日 h时i分", new Date(item.time), 4);
                        var sysTip = item.HintText + "—" + curDate;
                        if (curNkey == '' && (key == msgData.length)) {
                            lastMsgID = item.msgId;//TOP server 最后一条消息ID
                        }
                        if (mType == 66 || mType == 17) {
                            msg = JSON.stringify(msg);
                        }
                        if (msg.indexOf(skeyWord) >= 0)
                        {
                            htm=formatMsgLine(tp,item);
                        }
                        var cout = elem.TalkOneMsg.find("li").length;
                        if (cout > 0) {
                            elem.TalkOneMsg.find("li").eq(0).before(htm);
                            htm = '';
                        }
                        else {
                            elem.TalkOneMsg.append(htm);
                            htm = '';
                        }
                    });
                    scrollDown(elem.TalkOneMsg);
                }
                if (curNkey != '') {
                    SearchTopHistoryMsg(obj);
                } else {
                    elem.TalkOneMsg.find("li").eq(0).before(sysMsgLine.format("--没有更多记录了--"));
                }
            },
            error: function (error) {
                console.log('--获取群历史消息失败--', error);
            }
        });

    }
}

//滚动至顶端加载更多历史记录:
var totPage = 1;
var curPage = 1;


//按钮&回车搜索事件(Local & TopServer)
function SearchHistoryMsg(tp) {
    var str = $("#txt_search").val();
    elem.TalkOneMsg.empty();
    if ($.trim(str) == "") {
        elem.TalkOneMsgLoadType.val(0);
        LoadTopHistoryMsg(tp);
    } else {
        elem.TalkOneMsgLoadType.val(1);
        SearchTopHistoryMsg(tp);
    }
}


//显示讨论组信息&修改
function loadGroupInfoForModify(obj) {
    $(".cb-right-list #selectedList").empty();
    loadCreateUserList();//加载创建讨论组待选用户列表
    LoadCurGroupInfo(obj);//加载当前讨论组所有用户
    layer.open({
        type: 1,
        title: '讨论组信息',
        shade: false,
        shadeClose: false,
        area: ['445px', '540px'],
        content: $("#createBox"),
    });
    $("#groupID").val(obj);
    $("#createType").val("1");

}

//加载通讯录用户列表-创建讨论组左侧显示列表.
function loadCreateUserList() {
    $("#objName").val("");//组标题名称
    var hd_data = $("#hd_UserListData").data();
    var dataArray = [];
    if (typeof (hd_data) != 'undefined') {
        for (var key in hd_data) {
            dataArray.push(hd_data[key]);
        }
    }

    var data =[];// dataArray.length ==0? AjaxApi("/User/GetUserNameList", "post", $("form[name=search]").serialize()) : dataArray;
    var htm = "<li><a href='javascript:'>暂无数据</a></li>";
    if (data.length > 0) {
        $(".cb-left-list #userList").empty();
        $.each(data, function (key, item) {
            var name = item.UserName;
            if (name.lengthGB() > 10) {
                name = name.substr(0, 10) + "...";
            }
            $(".cb-left-list #userList").append(htmCreateUserListL.format(item.UserSign, item.UserSign, item.UserName, name));
        });
    }
}
//加载当前讨论组用户信息:modify list
function LoadCurGroupInfo(obj) {
    $("#objName").attr("disabled", true);
    var docID = obj;
    var htm = "<li><a href='javascript:'>暂无数据</a></li>";
    $(".cb-right-list #selectedList").empty();
    $(".cb-right-list #selectedList").append(htm);
    $.ajax({
        url: '/Message/LoadDiscussion',
        type: 'POST',
        data: { docEntry: docID },
        dataType: 'JSON',
        async: true,
        cache: true,
        success: function (result) {
            var flag = result.ContentType;
            var rsdata = result.Data;
            if (flag == "True") {
                var resData = JSON.parse(rsdata);
                if (resData.length > 0) {
                    $(".cb-right-list #selectedList").empty();
                    var gid = resData[0].DocEntry;//讨论组编号
                    var cid = resData[0].UserSign;//讨论组创建人
                    var data = resData[0].Users;//用户
                    var title = resData[0].Subject;//主题
                    $("#objName").val(title);
                    var uids = "";
                    $.each(data, function (key, item) {
                        var name = item.UserName == null ? "佚名" : item.UserName;
                        if (name.lengthGB() > 10) {
                            name = name.substr(0, 10) + "...";
                        }
                        if (cid==currentUserID) {
                            $(".cb-right-list #selectedList").append(htmCreateGroupUserListCurMe.format(item.UserSign, item.UserSign, name));
                        } else {
                            $(".cb-right-list #selectedList").append(htmCreateGroupUserListCur.format(item.UserSign, item.UserSign, name));
                        }
                        if (uids == "") {
                            uids += item.UserSign;
                        } else {
                            uids += "," + item.UserSign;
                        }
                        $(".cb-left-list #userList li").each(function () {
                            var id = $(this).children("span").first().attr("id");
                            if (id == item.UserSign) {
                                $(this).find("i.selMark").remove();
                                $(this).append("<i class='selMark'></i>");
                            }
                        });
                    });
                    var cout = $(".cb-right-list #selectedList li").length;
                    $("#sel-cout").text(cout);
                    $("#groupUsers").val(uids);
                    $("#groupTitle").val(title);
                } else {
                    $(".cb-right-list #selectedList").empty();
                    $(".cb-right-list #selectedList").append(htmCreateUserListR.format(currentUserID, currentUserID, currentUserName));//当前用户
                    $("#sel-cout").text("1");
                }
            }
        },
        error: function (request) {
            console.log(request);
        }
    });
}

//加载组织架构：用户&讨论组列表
function loadTalkBaseData() {
    //加载群列表(Top Server)：
    //sdk.Tribe.getTribeList({
    //    tribeTypes: [0, 1, 2],
    //    success: function (data) {
    //        console.log("--获取群列表(Top Server)--");
    //        console.log(data);
    //    },
    //    error: function (error) {
    //        console.log(error);
    //    }
    //});

    var data =[];// AjaxApi("/User/GetUserNameList", "post", $("form[name=search]").serialize());//加载通信录列表
    $("#hd_UserListData").data(data);
    var dataGroup =[];// AjaxApi("/Message/LoadDiscussion", "post", $("form[name=search]").serialize());//加载群组列表
    $("#hd_GroupListData").data(dataGroup);

    //var statusUser = [];
    ////处理用户在线状态：
    //if (data.length > 0) {
    //    var usCount = Math.ceil(data.length / 30);
    //    var roundIndex = 0;
    //    for (var i = 0; i < usCount; i++) {
    //        var itemIndex = ((i + 1) * 30 - 1) > data.length ? data.length :((i + 1) * 30 - 1);
    //        var tempUser = [];
    //        var ckUser = [];
    //        if (roundIndex==0) {
    //            for (var j = i * 30; j < itemIndex; j++) {
    //                var uInfo = { 'Departments': data[j].Departments, 'ImUserid': data[j].ImUserid, 'Roles': data[j].Roles, 'UserCode': data[j].UserCode, 'UserName': data[j].UserName, 'UserSign': data[j].UserSign, 'OnlineStatus': 0 };
    //                ckUser.push("i2iycbr4" + uInfo.ImUserid);
    //                tempUser.push(uInfo);
    //            }
    //            roundIndex = 1;
    //        }
    //        //连线获取服务器状态值：
    //        sdk.Chat.getUserStatus({
    //            //appkey: 'ImAppKey',
    //            uids: ckUser,
    //            hasPrefix: true,
    //            success: function (ckRes) {
    //                console.log('--批量获取用户在线状态成功--');
    //                var resData = ckRes.data.status;
    //                for (var k = 0; k < tempUser.length; k++) {
    //                    var uInfo = { 'Departments': tempUser[j].Departments, 'ImUserid': tempUser[j].ImUserid, 'Roles': tempUser[j].Roles, 'UserCode': tempUser[j].UserCode, 'UserName': tempUser[j].UserName, 'UserSign': tempUser[j].UserSign, 'OnlineStatus': resData[j]};
    //                    statusUser.push(uInfo);
    //                }
    //                roundIndex = 0;
    //            },
    //            error: function (error) {
    //                console.log('----批量获取用户在线状态失败----');
    //                console.log(error);
    //            }
    //        });
    //    }
    //}
    //if (statusUser.length > 0) {
    //    data = statusUser.sort(function (a,b) {
    //        return (a.OnlineStatus-b.OnlineStatus);
    //    });
    //}

    var htm = "<li><a href='javascript:'>暂无数据</a></li>";
    if (data != "" && data != null && data != "[]") {
        $("#UserList").empty();
        var UHtm = '';
        $.each(data, function (key, item) {
            //if (key>20) {
            //    return false;
            //}
            if (item.UserSign != currentUserID) {
                var name = item.UserName;
                if (name.lengthGB() > 10) {
                    name = name.substr(0, 10) + "...";
                }
                var statusMap = {
                    0: 'gray',
                    1: ''
                };
                if (item.IconUrl == '' || item.IconUrl == null || item.IconUrl == 'null') {
                    item.IconUrl = '/Images/dfUser.png';
                }
                UHtm += htmFormUserList.format(key,item.UserSign,item.UserName, name,item.ImUserid,item.IconUrl,statusMap[item.OnlineStatus]);
            }
        });
        $("#UserList").append(UHtm);
        console.log("--用户列表加载完成--");
    }
    if (dataGroup != "" && dataGroup != null) {
        $("#GroupList").empty();
        var gHtm = '';
        $.each(dataGroup, function (key, item) {
            //if (key>20) {
            //    return false;
            //}
            var name = item.Subject;
            if (name.lengthGB() >= 10) {
                name = name.substr(0, 10) + "...";
            }
            if (firstTimeLoad===true) {
                item.IconUrl = '/Images/dfGroup.png';
            }
            else {
                item.IconUrl = '/User/LoadIMGroupImage?docEntry=' + item.DocEntry;
            }
            gHtm += htmFormGroupListDf.format(key, item.DocEntry, item.IconUrl, item.DocEntry, item.Subject, name);
        });
        $("#GroupList").append(gHtm);
        console.log("--讨论组列表加载完成--");

    }
}
function LoadMoreUserList() {
    var hd_data = $("#hd_UserListData").data();
    var dataArray = [];
    if (typeof (hd_data) != 'undefined') {
        for (var key in hd_data) {
            dataArray.push(hd_data[key]);
        }
    }
    if (dataArray.length <= 0) {
        hd_data =[];// AjaxApi("/User/GetUserNameList", "post", $("form[name=search]").serialize());
        $("#hd_UserListData").data(hd_data);
    }
    var curIndex = $("#UserList>li:last").attr("id").split('_')[0];
    var UHtm = '';
    $.each(hd_data, function (key, item) {
        if (key <parseInt(curIndex)) {
            return true;
        }
        if (key>20) {
            return false;
        }
        if (item.UserSign != currentUserID) {
            var name = item.UserName;
            if (name.lengthGB() > 10) {
                name = name.substr(0, 10) + "...";
            }
            var statusMap = {
                0: 'gray',
                1: ''
            };
            if (item.IconUrl == '' || item.IconUrl == null || item.IconUrl == 'null') {
                item.IconUrl = '/Images/dfUser.png';
            }
            UHtm += htmFormUserList.format(key, item.UserSign, item.UserName, name, item.ImUserid, item.IconUrl, statusMap[item.OnlineStatus]);
        }
    });
    $("#UserList>li:last").after(UHtm);
}
/*加载讨论组对话窗用户列表*/
function LoadGroupUserList(obj) {
    var docID = obj;
    var htm = "<li><a href='javascript:'>暂无数据</a></li>";
    var cachData = [];
    return false;
    $.ajax({
        url: '/Message/LoadDiscussion',// 'Url.Action("LoadDiscussion", "Message")',
        type: 'POST',
        data: { docEntry: docID },
        dataType: 'JSON',
        async: false,
        cache: true,
        success: function (result) {
            var flag = result.ContentType;
            var data = result.Data;
            if (flag == "True") {
                if (data != "" && data != null) {
                    var resData = JSON.parse(data);
                    if (resData.length > 0) {
                        $("#listUserGroup").empty();
                        $("#listUserGroup").append("<li class='df_line' style='display:none;'></li>");
                        var gid = resData[0].DocEntry;//讨论组编号
                        var cid = resData[0].UserSign;//讨论组创建人
                        var imid = resData[0].DocEntry;//通讯ID
                        var title = resData[0].Subject;
                        var data = resData[0].Users;//用户
                        $.each(data, function (key, item) {
                            var name = item.UserName == null ? "佚名" : item.UserName;
                            if (name.lengthGB() > 10) {
                                name = name.substr(0, 10) + "...";
                            }
                            if (cid == currentUserID) {//群组创建人是否当前用户？
                                if (item.UserSign == cid) {//群组用户是否当前用户？
                                    htm = htmCreateGroupUserListMy.format(item.UserSign, item.UserSign, item.UserName, name, gid + "_" + item.UserSign);
                                    $("#listUserGroup>li").first().before(htm);
                                } else {
                                    htm = htmCreateGroupUserListMy2.format(item.UserSign, item.UserSign, item.UserName, name, gid + "_" + item.UserSign);
                                    $("#listUserGroup").append(htm);
                                }
                                //$("#listUserGroup>li").first().before(htm);
                            } else {
                                if (item.UserSign == cid) {//群组用户是否当前用户？
                                    //htm = htmCreateGroupUserListMy.format(item.UserSign, item.UserSign, item.UserName, name, gid + "_" + item.UserSign);
                                    htm = htmCreateGroupUserListCreater.format(item.UserSign, item.UserSign, item.UserName, name);
                                    $("#listUserGroup>li").first().before(htm);
                                } else if (item.UserSign == currentUserID) {
                                    htm = htmCreateGroupUserListMyLine.format(item.UserSign, item.UserSign, item.UserName, name, gid + "_" + item.UserSign);
                                    $("#listUserGroup").append(htm);
                                } else {
                                    htm = htmCreateGroupUserList.format(item.UserSign, item.UserSign, item.UserName, name);
                                    $("#listUserGroup").append(htm);
                                }
                            }

                        });
                        elem.TalkGroupName.empty();
                        elem.TalkGroupName.append("<a href='javascript:' onclick='javascript:loadGroupInfoForModify(" + gid + ");' title='" + title + "'>" + title + "</a>");
                        elem.TalkGroupPic.empty();
                        elem.TalkGroupPic.append(htmPicDf.format(gid));//htmPic.format(gid)

                        elem.TalkGroupID.val("G_" + imid);
                        elem.TalkGroupTitle.val(title);
                        elem.TalkMsgPageIndex2.val("1");


                    } else {
                        elem.TalkGroup.hide();
                    }
                }
            }
        },
        error: function (request) {
            console.log(request);
        }
    });

}
/*--搜索讨论组用户过滤(group会话框)--*/
function searchGroupUsers() {
    var txtStr = $("#searchGroupUser").val();
    var id = elem.TalkGroupID.val();
    LoadGroupUserList(id.split('_')[1]);
    if ($.trim(txtStr) != "") {
        $("#listUserGroup li").each(function () {
            var curName = $(this).find("span").eq(0).text().toUpperCase();
            if (curName.indexOf(txtStr.toUpperCase()) >= 0) {
                $(this).css("background", "#fbefc1");
            } else {
                $(this).remove();
            }
        });
    }
}
//创建讨论组用户列表过滤
function searchCreateUser() {
    var txtStr = $("#searchUser").val();
    loadCreateUserList();
    if ($.trim(txtStr) != "") {
        $(".cb-left-list #userList li").each(function () {
            var curName = $(this).find("span").eq(0).text().toUpperCase();
            if (curName.indexOf(txtStr.toUpperCase()) >= 0) {
                $(this).css("background", "#fbefc1");
            } else {
                $(this).remove();
            }
        });
    }
}
//用户列表&讨论组用户过滤:1+2
function searchUser() {
    var txtStr = $("#talkBoxSearch").val();
    firstTimeLoad = false;
    loadTalkBaseData();//重新加载用户&讨论组列表数据
    if ($.trim(txtStr) != "") {
        var tabID = 0;
        $(".talk-tab span").each(function () {
            if ($(this).hasClass("tab-now")) {
                tabID = $(this).attr('data-rel');
            }
        });
        $("#talkBoxContent>div").eq(tabID).children("div").eq(0).addClass("currentDd currentDt").siblings("ul").eq(0).css("display", "block");
        //页签1=通讯录&最近会话
        if (tabID == 1) {
            $("#UserList li").each(function () {
                var curName = $(this).find("a").attr("title").toUpperCase();
                if (curName.indexOf(txtStr.toUpperCase()) >= 0) {
                    $(this).css("background", "#fbefc1");
                } else {
                    $(this).remove();
                }
            });
            $("#RecentContactsList li").each(function () {
                var curName = $(this).find("a").attr("title").toUpperCase();
                if (curName.indexOf(txtStr.toUpperCase()) >= 0) {
                    $(this).css("background", "#fbefc1");
                } else {
                    $(this).remove();
                }
            });
        }
        else if (tabID == 2) {//页签2=群讨论组
            $("#GroupList li").each(function () {
                var curName = $(this).find("a").attr("title").toUpperCase();
                if (curName.indexOf(txtStr.toUpperCase()) >= 0) {
                    $(this).css("background", "#fbefc1");
                } else {
                    $(this).remove();
                }
            });
        }
    }
}
//通过IMID筛选用户名称：
function ReadUserName(obj) {
    var userInfo = { UserSign: '', UserCode: '', UserName: '',ImUserid:'' };
    var hd_data = $("#hd_UserListData").data();
    var dataArray = [];
    if (typeof (hd_data) != 'undefined') {
        for (var key in hd_data) {
            dataArray.push(hd_data[key]);
        }
    }
    if (dataArray.length<=0) {
        hd_data =[];// AjaxApi("/User/GetUserNameList", "post", $("form[name=search]").serialize());
        $("#hd_UserListData").data(hd_data);
    }
    $.each(hd_data, function (k, v) {
        if (v.ImUserid == obj) {
            userInfo.UserSign = v.UserSign;
            userInfo.UserCode = v.UserCode;
            userInfo.UserName = v.UserName;
            userInfo.ImUserid = v.ImUserid;
            userInfo.IconUrl = v.IconUrl;
            return false;
        }
    });
    return userInfo;
}
//通过IMID筛选讨论组名称：
function ReadGroupName(obj) {
    var groupInfo = { DocEntry: '', GroupCode: '', Subject: '' };
    var hd_data = $("#hd_GroupListData").data();
    var dataArray = [];
    if (typeof (hd_data) != 'undefined') {
        for (var key in hd_data) {
            dataArray.push(hd_data[key]);
        }
    }
    if (dataArray.length<=0) {
        hd_data =[];// AjaxApi("/Message/LoadDiscussion", "post", $("form[name=search]").serialize());
        $("#hd_GroupListData").data(hd_data);
    }
    $.each(hd_data, function (k, v) {
        if (v.DocEntry == obj) {
            groupInfo.DocEntry = v.DocEntry;
            groupInfo.GroupCode = v.GroupCode;
            groupInfo.Subject = v.Subject;
            return false;
        }
    });
    return groupInfo;
}
//通过UID筛选用户名称：
function ReadUserNameByID(obj) {
    var userInfo = { UserSign: '', UserCode: '', UserName: '', ImUserid: '' };
    var hd_data = $("#hd_UserListData").data();
    var dataArray = [];
    if (typeof (hd_data) != 'undefined') {
        for (var key in hd_data) {
            dataArray.push(hd_data[key]);
        }
    }
    if (dataArray.length <= 0) {
        hd_data =[];// AjaxApi("/User/GetUserNameList", "post", $("form[name=search]").serialize());
        $("#hd_UserListData").data(hd_data);
    }
    $.each(hd_data, function (k, v) {
        if (v.UserSign == obj) {
            userInfo.UserSign = v.UserSign;
            userInfo.UserCode = v.UserCode;
            userInfo.UserName = v.UserName;
            userInfo.ImUserid = v.ImUserid;
            return false;
        }
    });
    return userInfo;
}
//保存创建讨论组
function SaveCreateGroup() {
    var obj = $("#objName").val();
    var oldTitle = $("#groupTitle").val();
    if ($.trim(obj) != "" && obj == oldTitle) {
        obj = "-1";//标识标题未更改
    } else {
        oldTitle = obj;
    }
    var users = "";
    $(".cb-right-list #selectedList li").each(function () {
        var cur = $(this).find("span").eq(0).attr("id");
        if (users == "") {
            users += cur;
        }
        else {
            users = users + "," + cur;
        }
    });
    if (users == "") {
        return false;
    }
    var oldUsers = $("#groupUsers").val();
    var newUsers = "";//新增加的组员
    var delUsers = "";//被删除的原来组员
    if ($.trim(oldUsers) != "") {
        var array1 = users.split(',');//后更新组员（剩下的组员）
        var array2 = oldUsers.split(',');//原组员
        //var array3=$.merge(array1, array2);
        //var array4 = $.unique(array3);
        //过滤已经存在的组员,返回新添加的组员
        for (var i = 0; i < array1.length; i++) {
            if ($.inArray(array1[i], array2) < 0) {
                if (newUsers == "") {
                    newUsers += array1[i];
                } else {
                    newUsers += "," + array1[i];
                }
            }
        }
        //过滤移除的用户
        for (var i = 0; i < array2.length; i++) {
            if ($.inArray(array2[i], array1) < 0) {
                if (delUsers == "") {
                    delUsers += array2[i];
                } else {
                    delUsers += "," + array2[i];
                }
            }
        }

    }
    else {
        newUsers = users;
    }
    var actionUrl = '/Message/CreateDiscussion';// 'Url.Action("CreateDiscussion", "Message")';
    if ($("#createType").val() == "1") {
        actionUrl = '/Message/ModifyDiscussion';// 'Url.Action("ModifyDiscussion", "Message")';
    }
    var code = $("#groupID").val();
    if (obj == "" && newUsers == "") {
        layer.msg("请选人组员，且讨论组标题不能为空:(");
        return false;
    }
    if (delUsers != "") {
        $.post('/Message/RemoveUsersFromDiscussion', { 'GroupCode': code, 'UID': delUsers }, function (result) {
            if (!result.ContentType) {
                layer.msg(result.Data);
            }
        });
    }
    $.ajax({
        url: actionUrl,
        type: 'POST',
        dataType: 'json',
        data: { docEntry: code, Subject: obj, ExecUsers: newUsers },
        success: function (result) {
            var flag = result.ContentType;
            var data = result.Data;
            if (flag == "True") {
                layer.msg("保存成功");
                setTimeout(function () {
                    layer.closeAll();
                    firstTimeLoad = false;
                    loadTalkBaseData();//刷新组织架构
                }, 1000);
                elem.TalkGroup.hide();
                elem.TalkOne.hide();
            } else {
                layer.msg("保存失败:(" + JSON.stringify(data));
            }
        },
        error: function (request) { layer.msg(request); }
    });
}
//移除讨论组用户(群组会话框列表事件)
function removeFromGroup(obj) {

    var gid = obj.split('_')[1];
    var uid = obj.split('_')[2];
    var tip = "确定移除该用户？";
    if (uid == currentUserID) {
        tip = "确定退出该讨论组？";
    }
    layer.confirm(tip, function (e) {
        $.ajax({
            url: '/Message/RemoveFromDiscussion',
            type: 'POST',
            data: { GroupCode: gid, UID: uid },
            dataType: 'JSON',
            success: function (result) {
                var flag = result.ContentType;
                var data = result.Data;
                if (flag == "True") {
                    if (uid == currentUserID) {
                        elem.TalkGroup.hide();
                    }
                    setTimeout(function () {
                        firstTimeLoad = false;
                        loadTalkBaseData();//刷新组织架构数据
                        if (uid != currentUserID) {
                            LoadGroupUserList(gid);//重新加载列表
                        }
                        else {
                            $("#talkingBox").hide();
                        }
                    }, 1000);
                }
            },
            error: function (request) {
                Log(request);
            }
        });
        layer.close(e);
    });

    return false;
}
//会话列表-读取当前收到的用户对话信息:one
function showTalkFrame(e) {
    var eid = $(e).attr("id");//行元素ID
    var id = $(e).attr("data-im").split('_')[0];//系统ID:usersign,groupid
    _talkID= $(e).attr("data-im").split('_')[1];//通话IM UID
    var title = $(e).find("a.msg-snick").text();//对方称昵
    var talkType=$(e).attr('data-tp');//对话类型：0=单聊，1=群聊，。。。
    elem.TalkOneName.empty();
    elem.TalkOneName.append(htmTitle.format(title));
    elem.TalkOnePic.empty();
    elem.TalkOnePic.append(htmPic.format(id));
    elem.TalkOneMsg.empty();
    elem.TalkOneID.val(_talkID);
    elem.TalkOneTitle.val(title);
    $(e).find("a#tipCount").text("").removeClass("tipBox");
    $("#TalkType").val(talkType);
    $("#TalkTypeIsCG").val("");

    openTalkConnection(talkType);
}


//滚动内容页至底部
function scrollDown(obj) {
    var nScrollHight = obj[0].scrollHeight;
    var objParent = obj.parent();
    var tolast = obj.find("li:last");
    objParent.animate({ scrollTop: nScrollHight });// tolast.offset().top - objParent.offset().top + obj.scrollTop()
}
//打开播放音频文件窗口
function playSoundMedia(obj) {
    var sr = $(obj).attr("rel");
    layer.open({
        type: 1,
        title: false,
        closeBtn: 1,
        shadeClose: true,
        scrollbar: false,
        area: 'auto',
        skin: 'layui-ext-opbox',
        content: '<div style="border:1px solid gray;border-radius:5px;padding:30px 0 0 0;background:#fff;"><div class="player"><audio controls><source src="' + sr + '" type="audio/mp3"><a href="' + sr + '" type="audio/mp3">[下载]</a></audio></div></div>'
    });
}
//打开播放视频文件窗口
function playMovieMedia(obj) {
    var sr = $(obj).attr("rel");
    layer.open({
        type: 1,
        title: false,
        closeBtn: 1,
        shadeClose: true,
        scrollbar: false,
        area: 'auto',
        skin: 'layui-ext-opbox',
        content: '<div style="border:1px solid gray;border-radius:5px;padding:5px;background:#fff;"><div class="player"><video controls><source src="' + sr + '" type="video/mp4"></video></div></div>'
    });
}
//窗体关闭事件
function closeAllTalkBox() {
    $("#talkingBox").hide();
    $("#talkingBoxGroup").hide();
    $("#taBox").hide();
    //$("#overlay").hide();
}

//================TopIM 即时通讯
//IM 登陆
function IMLogin() {
    console.log(AppKey+"-"+ImUID+"-"+ImSecret);
    window.__WSDK__POSTMESSAGE__DEBUG__ = true;
    sdk.Base.login({
        uid:ImUID,
        appkey:AppKey,
        credential:ImSecret,
        timeout: 3000,
        success: function (data) {
            console.log('--IM 登录成功--');
            //监听所有消息
            sdk.Base.startListenAllMsg();

        },
        error: function (error) {
            console.log('--IM 登录失败--');
        }
    });
}
//监听未读取的会话记录（包括最近通话的群组）
function ListenNotReadMsg() {
    //获取未读消息：
    var recentTribe = [];
    sdk.Base.getUnreadMsgCount({
        count: 100,
        success: function (data) {
            var list = data.data;
            if (list.length > 0) {
                list.forEach(function (item) {
                    if (item.contact.substring(8) != 'systemuser') {
                        if (item.contact.substring(0, 8) == 'chntribe') {//group message.
                            recentTribe.push(item);
                            var groupInfo = ReadGroupName(item.contact.substring(8));
                            if (groupInfo.Subject != '') {
                                var msgCount = item.msgCount; console.log("Not Read Count:" + msgCount);
                                var has = elem.TalkNewList.find("li[id='" + groupInfo.DocEntry + "_" + groupInfo.DocEntry + "']");
                                if (has.length==0) {
                                    elem.TalkNewList.append(htmNewLineGroup.format(groupInfo.DocEntry, groupInfo.DocEntry, groupInfo.Subject, '', '', ''));
                                }
                            }
                        } else {//User message.

                            var senderID = item.contact.substring(8);
                            var senderInfo = ReadUserName(item.contact.substring(8));
                            var msgCount = item.msgCount;
                            //var hasLine = elem.TalkNewList.find("li[id='" + senderInfo.UserSign + "_" + senderInfo.ImUserid+ "']");
                            //console.log(hasLine[has.length-1].outerHTML);
                            var has = 0;
                            var curHtm = '';
                            elem.TalkNewList.find("li").each(function () {
                                var cur = $(this).attr("data-im").split('_')[1];
                                if (cur == senderID) {
                                    var co = $(this).find("div[id='tipCount']").text();
                                    var count = parseInt(co == "" ? 0 : co) + msgCount;
                                    $(this).find("div[id='tipCount']").text(count).addClass("tipBox");
                                    has++;
                                    curHtm = $(this);
                                    $(this).remove();
                                    return false;
                                }
                            });
                            if (has == 0) {
                                elem.TalkNewList.append(htmNewLineOne.format(senderInfo.UserSign, senderInfo.ImUserid, senderInfo.UserName, '', msgCount, 'tipBox'));
                            } else {
                                elem.TalkNewList.find("li").eq(0).before(curHtm);
                            }
                            $(".talk-tab span").eq(0).addClass("info");
                        }
                    }
                });
            } else {
                console.log("--没有未读取会话记录--");
            }
        },
        error: function (error) {
            if (error.Code===1001) {
                IMLogin();
            }
            console.log('--获取未读消息的条数失败--', error);
        }
    });
}

//监听IM事件：
sdk.Event.on('START_RECEIVE_ALL_MSG', function (data) {
    var resCode = parseInt(data.code);
    var fid = '';
    var msg = '';
    var apKey = '';
    switch (resCode) {
        case 1001:
            fid = data.data.code;
            msg = data.data.reason;
            IMLogin();
            break;
        default:
            break;
    }
});
sdk.Event.on('CHAT.MSG_RECEIVED', function (e) {
    console.log("----接收单聊信息----");
    console.log(e);
    var msgs =e.data.msgs;
    msgData.To = e.data.msgs[0].to.substring(8);//e.data.touid.substring(8);//消息接收人ID
    msgData.From = e.data.msgs[0].from.substring(8);//e.data.uid.substring(8);//消息发送人ID
    var toUser = ReadUserName(msgData.To);//消息接收人
    var foUser = ReadUserName(msgData.From);//消息发送人
    msgData.ToUserSign = toUser.UserSign;//消息接收人ID
    msgData.ToName = toUser.UserName;//消息接收人名称
    msgData.UserSign = foUser.UserSign;//消息发送人ID
    msgData.UserName = foUser.UserName;//消息发送人名称
    msgData.Msg = e.data.msgs[0].msg;
    msgData.SendDate = e.data.msgs[0].time;
    msgData.MediaType = e.data.msgs[0].type;
    var sMsg = "";
    if (msgData.From=='systemuser') {
        return false;
    }
    switch (msgData.MediaType) {
        case 0:
            sMsg = msgData.Msg;
            break;
        case 1:
            sMsg = "[图片]";
            break;
        case 2:
            sMsg = "[语音]";
            break;
        case 3:
            sMsg = "[群消息]";
            break;
        case 66:
            sMsg = "发了个附件,请注意查收！";
            break;
        case 17:
            sMsg = "发了个附件,请注意查收！";
            break;
        default:
            break;
    }
    if ($.trim(sMsg)!='') {
        var shortMsg = msgData.UserName + "：" + sMsg;
        //layer.tips(shortMsg, "#tiBox", { tips: [4, '#F97638'], time: 3000 });
        //ipCmd.send('im-msg',shortMsg);
    }
    ReceiveMsgFormOne(msgData);
});
sdk.Event.on('TRIBE.MSG_RECEIVED', function (data) {
    console.log("----接收到群组信息----",data);
    if (data.data.msgs[0].from.substring(8) == 'systemuser') {
        return false;
    }
    ReceiveMsgFormGroup(data.data);
});
sdk.Event.on('KICK_OFF', function (data) {
    //layer.tips("哎呀,我被踢出了群！o(︶︿︶)o ", "#tiBox", { tips: [4, '#F97638'], time: 3000 });
    console.log("KICK_OFF:" +JSON.stringify(data));
    firstTimeLoad = false;
    loadTalkBaseData();
});

function EventBroadcast(obj){
    require('electron').ipcRenderer.on('ping',function(e,msg){
        layer.msg(msg);
    });
}



//获取用户在线状态
//ckUser:用户ID数组,Example:[1,2,3]
function GetOnlineStatus(ckUser) {
    var userArray = [];
    if (ckUser!=null) {
        for (var i = 0; i < ckUser.length; i++) {
            userArray.push("i2iycbr4" + ckUser[i]);
        }
    }
    var lineState=null;
    //连线获取服务器状态值：        
    sdk.Chat.getUserStatus({
        appkey: AppKey,
        uids: userArray,
        hasPrefix: true,
        success: function (ckRes) {
            console.log('--获取用户在线状态成功--');
            lineState=ckRes.data.status;
        },
        error: function (error) {
            console.log('----获取用户在线状态失败----');
            console.log(error);
            return null;
        }
    });

    return lineState;
}
//初始化通讯UI窗体：
function InitialIMFrame() {
    firstTimeLoad =false;
    //elem.TalkNewList.empty();
    //loadTalkBaseData();////刷新架构：加载通讯录、讨论组信息
    LoadTopRecentContacts();//加载最近联系人(Top Server)
    setTimeout(ListenNotReadMsg, 3000);//加载最近会话记录(未读)
    RenderDefaultFace();//渲染默认表情元素
    RenderWebUploader();//渲染WebUploader上传插件。
}

//打开对话窗口：1对1、群组....
function openTalkConnection(tp) {
    elem.TalkMsgPageIndex.val(1);
    elem.TalkMsgTotalPage.val(1);
    $("#hd_nextKey").val('');
    LoadTopHistoryMsg(tp);//加载历史记录。
    setTimeout(function () {
        scrollDown(elem.TalkOneMsg);
    }, 1000);
}


//对象信息接收:one to one.
function ReceiveMsgFormOne(data) {
    console.log("--有人给我发了消息--");
    var senderUID = data.UserSign;//信息发送人UID（本地处理）
    var senderName = data.UserName;//信息发送人名称（本地处理）
    var senderIMID = data.From;//信息发送人IMUserid
    var receiveIMID = data.To;//信息接收人IMUserid
    var message = data.Msg;//信息内容
    var mType = data.MediaType;//媒体类型
    var sendDate = data.SendDate;//发送时间
    var hint = data.Hint;//系统提示信息标识：1
    var curDate = new Date();//发送时间转换
    if (sendDate != '') {
        var date = new Date(sendDate);
        curDate = formatDate("m月d日 h时i分", date, 4);
    }

    if (hint == 1) {//系统消息
        layer.tips(message, "#tiBox", { tips: [4, '#F97638'], time: 5000 });
        firstTimeLoad = false;
        loadTalkBaseData();//刷新组织结构
    } else {
        var msg = message;
        var has = 0;
        var curHtm = '';
        elem.TalkNewList.find("li").each(function () {
            var cur = $(this).attr("data-im").split('_')[1];//0=UserSign,1=IMID
            if (cur == senderIMID) {
                var unReCount = $(this).find("div[id='tipCount']").text();
                var count = parseInt(unReCount == "" ? 0 : unReCount) + 1;
                $(this).find("div[id='tipCount']").text(count).addClass("tipBox");
                var hmsg = '';
                if (mType ==0) {
                    if (message.lengthGB() > 10) {
                        hmsg = message.substr(0, 10) + "...";
                    }
                    else {
                        hmsg = message;
                    }
                }else{
                    hmsg ="给你发了一条消息，请注意查看！";
                }
                $(this).find("p.member_msg").html(senderName + ":" + replaceFaceInfo(hmsg));
                has++;
                curHtm = $(this);
                $(this).remove();
                return false;
            }
        });
        if (has == 0) {//会话列表没有当前消息发送方会话记录
            var hmsg = '';
            switch (mType) {
                case 0:
                    if (message.lengthGB() > 10) {
                        hmsg = message.substr(0, 10) + "...";
                    }
                    else {
                        hmsg = message;
                    }
                    break;
                case 1:
                    hmsg = "[附件]";
                    break;
                case 2:
                    hmsg = "[语音]";
                    break;
                case 3:
                    hmsg = "[群消息]";
                    break;
                default:
                    hmsg = "您收到一条消息，请注意查看！";
                    break;
            }
            if (senderUID==currentUserID) {
                elem.TalkNewList.find("li").eq(0).before(htmNewLineOne.format(data.ToUserSign, data.To, data.ToName, hmsg, 1, 'tipBox'));
            }
            else {
                elem.TalkNewList.find("li").eq(0).before(htmNewLineOne.format(senderUID, senderIMID, senderName, hmsg, 1, 'tipBox'));
            }
        } else {
            elem.TalkNewList.find("li").eq(0).before(curHtm);
        }
        $(".talk-tab span").eq(0).addClass("info");
        if (elem.TalkOne.css("display") == "block") {//若当前会话框已经打开
            var _talkID = elem.TalkOneID.val() == "" ? "" : elem.TalkOneID.val();//TalkID既IMUserid(touid).
            //接收的信息不是当前会话对象发出的,则将信息添加到新会话列表
            if (_talkID != "" && _talkID == senderIMID) {
                var htm = "";
                if (senderUID != currentUserID) {
                    switch (mType) {
                        case 0:
                            msg = replaceFaceInfo(message);
                            msg = msg.replace(/\\r|\\n/gi, '</br>');
                            htm = htmMsgLine2.format(senderUID, senderName, curDate, msg);
                            break;
                        case 1:
                            msg = msg.replace('-s.', '.');
                            htm = htmMsgImgLineL.format(senderUID, senderName, curDate, msg, '', '');
                            break;
                        case 2:
                            htm = htmMsgSoundLineL.format(senderUID, senderName, curDate, msg, '');
                            break;
                        case 3:
                            var mInfo = JSON.parse(msg);
                            htm = htmMsgMediaLineL.format(senderUID, senderName, curDate, mInfo.resource, '');
                            break;
                        case 8:
                            var mapInfo = message.split(',');
                            htm = htmMsgMapLineL.format(senderUID, senderName, curDate, mapInfo[0], mapInfo[1], mapInfo[2]);
                            break;
                        case 4:
                            var mInfo = JSON.parse(msg);
                            htm = htmMsgMediaLineL.format(senderUID, senderName, curDate, mInfo.resource, '');
                            break;
                        case 66:
                            var fileInfo = JSON.parse(message.customize);
                            if (typeof (fileInfo) != 'undefined') {
                                if (fileInfo.T == 1000) {
                                    var fsize = parseInt(fileInfo.D.L / 1024) > 1024 ? (fileInfo.D.L / 1048576).toFixed(2) + " MB" : (fileInfo.D.L / 1024).toFixed(2) + " KB";
                                    var fileSrc = docUrl + fileInfo.D.P;
                                    if (privateMark == 1) {
                                        htm = htmMsgFileLineL.format(senderUID, senderName, curDate, fileInfo.D.F, fsize, fileSrc, '');
                                    } else {
                                        htm = htmMsgFileLineL.format(senderUID, senderName, curDate, fileInfo.D.F, fsize, fileSrc + "?filename=" + encodeURI(fileInfo.D.F), '');
                                    }
                                }
                            }

                            break;
                        default:
                            break;
                    }
                } else {
                    switch (mType) {
                        case 0:
                            msg = msg.replace(/\\r|\\n/gi, '</br>');
                            htm = htmMsgLine.format(curDate, msg, currentUserID);
                            break;
                        case 1:
                            msg = msg.replace('-s.', '.');
                            htm = htmMsgImgLine.format(curDate, msg, '', '', currentUserID);
                            break;
                        case 2:
                            htm = htmMsgSoundLine.format(curDate, msg, '', currentUserID);
                            break;
                        case 3:
                            var mInfo = JSON.parse(msg);
                            htm = htmMsgMediaLine.format(curDate, mInfo.resource, '', currentUserID);
                            break;
                        case 8:
                            var mapInfo = message.split(',');
                            htm = htmMsgMapLine.format(currentUserID, '', curDate, mapInfo[0], mapInfo[1], mapInfo[2]);
                            break;
                        case 66:
                            var fileInfo = JSON.parse(message.customize);
                            if (typeof (fileInfo) != 'undefined') {
                                if (fileInfo.T == 1000) {
                                    var fsize = parseInt(fileInfo.D.L / 1024) > 1024 ? (fileInfo.D.L / 1048576).toFixed(2) + " MB" : (fileInfo.D.L / 1024).toFixed(2) + " KB";
                                    var fileSrc = docUrl + fileInfo.D.P;
                                    if (privateMark == 1) {
                                        htm = htmMsgFileLine.format(curDate, fileInfo.D.F, fsize, fileSrc, '', currentUserID);
                                    } else {
                                        htm = htmMsgFileLine.format(curDate, fileInfo.D.F, fsize, fileSrc + "?filename=" + encodeURI(fileInfo.D.F), '', currentUserID);
                                    }
                                }
                            }
                            break;
                        default:
                            break;
                    }
                }
                elem.TalkOneMsg.append(htm);
                $("#txtInput").text("").focus();
                scrollDown(elem.TalkOneMsg);
            } else if (senderUID == currentUserID && data.To==_talkID) {
                //data.ToUserSign, data.To, data.ToName
                var htm = "";
                switch (mType) {
                    case 0:
                        msg = msg.replace(/\\r|\\n/gi, '</br>');
                        htm = htmMsgLine.format(curDate, msg, currentUserID);
                        break;
                    case 1:
                        msg = msg.replace('-s.', '.');
                        htm = htmMsgImgLine.format(curDate, msg, '', '', currentUserID);
                        break;
                    case 2:
                        htm = htmMsgSoundLine.format(curDate, msg, '', currentUserID);
                        break;
                    case 3:
                        var mInfo = JSON.parse(msg);
                        htm = htmMsgMediaLine.format(curDate, mInfo.resource, '', currentUserID);
                        break;
                    case 8:
                        var mapInfo = message.split(',');
                        htm = htmMsgMapLine.format(currentUserID, '', curDate, mapInfo[0], mapInfo[1], mapInfo[2]);
                        break;
                    case 66:
                        var fileInfo = JSON.parse(message.customize);
                        if (typeof (fileInfo) != 'undefined') {
                            if (fileInfo.T == 1000) {
                                var fsize = parseInt(fileInfo.D.L / 1024) > 1024 ? (fileInfo.D.L / 1048576).toFixed(2) + " MB" : (fileInfo.D.L / 1024).toFixed(2) + " KB";
                                var fileSrc = docUrl + fileInfo.D.P;
                                if (privateMark == 1) {
                                    htm = htmMsgFileLine.format(curDate, fileInfo.D.F, fsize, fileSrc, '', currentUserID);
                                } else {
                                    htm = htmMsgFileLine.format(curDate, fileInfo.D.F, fsize, fileSrc + "?filename=" + encodeURI(fileInfo.D.F), '', currentUserID);
                                }
                            }
                        }
                        break;
                    default:
                        break;
                }

                elem.TalkOneMsg.append(htm);
                $("#txtInput").text("").focus();
                scrollDown(elem.TalkOneMsg);
            }
            $(".talk-tab span").eq(0).removeClass("info");
            var timestamp = Math.floor((+new Date()) / 1000)+5000;
            console.log(timestamp);
            sdk.Chat.setReadState({
                touid:_talkID,
                timestamp: timestamp,
                success: function (data) {
                    console.log('单聊设置已读成功');
                },
                error: function (error) {
                    console.log('单聊设置已读失败');
                }
            });
        }
    }
};
//给客服发消息
function SendMessageToESQ(gpid,obj){
    sdk.Chat.sendMsgToCustomService({
        touid:_talkID,
        msg: obj.Msg,
        groupid: gpid,
        success: function (data) {
            var date = new Date();
            var sendDate = formatDate("m月d日 h时i分", date, 4);
            msg = msg.replace(/\\r|\\n/gi, '</br>');
            var Rmsg = replaceFaceInfo(msg);
            var msgL = htmMsgLine.format(sendDate, Rmsg, currentUserID);
            elem.TalkOneMsg.append(msgL);
            $("#txtInput").text("").focus();
            scrollDown(elem.TalkOneMsg);
        },
        error: function (error) {
            var date = new Date();
            var sendDate = formatDate("m月d日 h时i分", date, 4);
            msg = msg.replace(/\\r|\\n/gi, '</br>');
            var Rmsg = replaceFaceInfo(msg);
            var msgL = htmMsgLine_unsend.format(sendDate, Rmsg, currentUserID);
            elem.TalkOneMsg.append(msgL);
            var emsg = "(" + error.code + ":" + error.resultText + ")";// JSON.stringify(error);
            elem.TalkOneMsg.append(htmError.format(emsg + ""));

            scrollDown(elem.TalkOneMsg);
            if (error.code === 1001) {
                IMLogin();
            }
        }
    });
}
//推送（图片Or文档）信息：媒体类型type=0文本,1图片,2语音,3自定义（summary），data=json数据：{ "UserSign": '发送人ID', "To":'接收人ID', "Msg":'', "MediaType": 1, "FileName": '文件名', "Size": 1024, "Path": '服务器路径', "Width": 100, "Height": 100 };
function SendMessageTone(type, data) {
    $("#btnSend").attr("disabled", true);
    var jsonData = JSON.parse(data);
    var msg = '';
    var toid = jsonData.To;
    type = parseInt(type);
    var sendMsgType = 0;
    if (type==1) {
        msg = jsonData.Path;//+jsonData.FileName;
        sendMsgType =type;
    } else {
        msg = jsonData.Msg;
        sendMsgType = type;
    }
    sdk.Chat.sendMsg({
        touid:toid,
        msg: msg,
        msgType: sendMsgType,
        success: function (data) {
            var date = new Date();
            var sendDate = formatDate("m月d日 h时i分", date, 4);
            var msgHtm = "";
            msg = replaceFaceInfo(jsonData.Msg);
            switch (type) {
                case 0:
                    msg = msg.replace(/\\r|\\n/gi, '</br>');
                    msgHtm = htmMsgLine.format(sendDate, msg, currentUserID);
                    break;
                case 1:
                    msgHtm = htmMsgImgLine.format(sendDate, msg, '', '', currentUserID);
                    break;
                case 3:
                    var fsize = parseInt(jsonData.Size / 1024) > 1024 ? (jsonData.Size / 1048576).toFixed(2) + " MB" : (jsonData.Size / 1024).toFixed(2) + " KB";
                    var fileSrc =docUrl + jsonData.FileName;
                    if (privateMark == 1) {
                        msgHtm = htmMsgFileLine.format(sendDate, jsonData.Msg, fsize, fileSrc, '', currentUserID);
                    }
                    else {
                        msgHtm = htmMsgFileLine.format(sendDate, jsonData.Msg, fsize, fileSrc + "?filename=" + encodeURI(jsonData.FileName), '', currentUserID);
                    }
                    break;
                default:
                    break;
            }

            elem.TalkOneMsg.append(msgHtm);
            scrollDown(elem.TalkOneMsg);
            $("#txtInput").text("").focus();
            $("#btnSend").removeAttr("disabled");
            //setTalkTitleMark({ "ReceiveID": toid, "SendID": currentUserID, "ReceiveGID": '', "SendName": '', "toName": '', "mType": type, "Message": msg });
        },
        error: function (error) {
            var date = new Date();
            var sendDate = formatDate("m月d日 h时i分", date, 4);
            var Rmsg = replaceFaceInfo(jsonData.Msg);
            var msgL = htmMsgLine_unsend.format(sendDate, Rmsg, currentUserID);
            elem.TalkOneMsg.append(msgL);

            var emsg ="("+error.code +":"+ error.resultText+")";// JSON.stringify(error);
            elem.TalkOneMsg.append(htmError.format(emsg + ""));
            scrollDown(elem.TalkOneMsg);
            $("#btnSend").removeAttr("disabled");
            if (error.code == 1001) {
                IMLogin();
            }
        }
    });

}


var fileTarget = document.getElementById('upImgTarget');
if(typeof(fileTarget)!='undefined'){
    fileTarget.onchange = function () {
        sdk.Plugin.Image.upload({
            target: fileTarget,
            ext:'png,jpg,jpeg,ico,gif,tiff,bmp',
            success: function (data) {
                console.log('--图片上传成功（单聊）--');
                if (data.code == 1000) {
                    var imgData = data.data.base64Str;
                    var imgUrl = data.data.url;
                    var s = imgUrl.split('&'), kv;
                    var result = {};
                    for (var i = 0, len = s.length; i < len; i++) {
                        kv = s[i].split('=');
                        result[kv[0]] = decodeURIComponent(kv[1]);
                    }
                    var toId = elem.TalkOneID.val();
                    var msg = { "UserSign": currentUserID, "To": toId, "Msg": imgUrl, "MediaType": 1, "FileName": result.fileId, "Size": 0, "Path": imgUrl, "Width": result.width, "Height": result.height };
                    msg = JSON.stringify(msg);
                    SendMessageTone("1", msg);
                }
            },
            error: function (error) {
                console.log('--图片上传失败--');
                if (error.Code == '-4') {
                    layer.msg("图片发送失败:" + error.errorText, { offset: '100px' });
                }
            }
        });
    }
}


//发送自定义消息(单聊)：附件
function SendCustomMessage(data) {
    var serverPath = data.Path;
    var customData = { "M": data.Msg, "S": '附件', "T": 1000, "D": { "L": data.Size, "F": data.Msg, "P": data.FileName, "T": 1000 } };
    var cData = JSON.stringify(customData);
    var soID = data.UserSign;
    var toid = data.To;
    sdk.Chat.sendCustomMsg({
        touid: toid,
        msg:cData,
        summary: '附件',
        success: function (data) {
            console.log('--附件消息发送成功（单聊）--');
            console.log(data);
            SendImChatFile({ "imType": 4, "sourceID": soID, "FilePath": customData.D.P, "FileName": customData.D.F, "FileSize": customData.D.L });
            var date = new Date();
            var sendDate = formatDate("m月d日 h时i分", date, 4);
            var fsize = parseInt(customData.D.L / 1024) > 1024 ? (customData.D.L / 1048576).toFixed(2) + " MB" : (customData.D.L / 1024).toFixed(2) + " KB";
            var fileSrc = serverPath+ customData.D.P;//路径+文件名
            var msgHtm='';
            if (privateMark == 1) {
                msgHtm = htmMsgFileLine.format(sendDate, customData.D.F, fsize, fileSrc, '', currentUserID);
            }
            else {
                msgHtm = htmMsgFileLine.format(sendDate, customData.D.F, fsize, fileSrc + "?filename=" + encodeURI(customData.D.F), '', currentUserID);
            }
            elem.TalkOneMsg.append(msgHtm);
            scrollDown(elem.TalkOneMsg);
            $("#txtInput").text("").focus();
            $("#btnSend").removeAttr("disabled");

            //setTalkTitleMark({ "ReceiveID": soID,"SendID":'',"ReceiveGID":'',"SendName":'',"toName":'',"mType":4,"Message":"[附件]" });
        },
        error: function (error) {
            console.log('--附件消息发送失败--');
        }
    });
}

//群组发送附近（本服务器自处理接口）：
function SendGroupTribeMessage(data) {
    var serverPath = data.Path;
    var customData = {"header": { "summary": "文件" },"customize": {"M": data.Msg, "S": '附件', "T": 1000, "D": { "L": data.Size, "F": data.Msg, "P": data.FileName, "T": 1000 }}};
    var sendSysInfo = { "TribeId": parseInt(data.To), "AtFlag": 0, "AtMembers": '', "MsgType": 17, "Context": JSON.stringify(customData), "MediaAttr": "", "IsPush": 0 };
    var soID = data.UserSign;
    var ly = null;
    $.ajax({
        url: '/Message/SendImChatGroupFile',
        type:'post',
        data: { "SendData":JSON.stringify(sendSysInfo) },
        dataType:'json',
        beforeSend: function () {
            ly=layer.load();
        },
        success: function (response) {
            console.log('--附件消息发送成功（群聊）--');
            console.log(response);
            if (response.ContentType == "True") {
                var date = new Date();
                var sendDate = formatDate("m月d日 h时i分", date, 4);
                SendImChatFile({ "imType": 5, "sourceID": soID, "FilePath": customData.customize.D.P, "FileName": customData.customize.D.F, "FileSize": customData.customize.D.L });
                var fsize = parseInt(customData.customize.D.L / 1024) > 1024 ? (customData.customize.D.L / 1048576).toFixed(2) + " MB" : (customData.customize.D.L / 1024).toFixed(2) + " KB";
                var fileSrc = serverPath + customData.customize.D.P;
                var msgHtm='';
                if (privateMark == 1) {
                    msgHtm = htmMsgFileLine.format(sendDate, customData.customize.D.F, fsize, fileSrc, '', currentUserID);
                } else {
                    msgHtm = htmMsgFileLine.format(sendDate, customData.customize.D.F, fsize, fileSrc + "?filename=" + encodeURI(customData.customize.D.F), '', currentUserID);
                }
                elem.TalkOneMsg.append(msgHtm);
                scrollDown(elem.TalkOneMsg);
            } else {
                layer.msg("发送失败！");
            }
            $("#txtInput").text("").focus();
            $("#btnSend").removeAttr("disabled");

            layer.close(ly);
        },
        error: function (request) {
            console.log(request);
        }
    });
}

//发送附件信息：（本服务器发送文件处理）
function SendImChatFile(obj) {
    $.ajax({
        url: '/Message/SendImChatFile',// 'Url.Action("SendImChatFile","Message")',
        type:'post',
        data: obj,
        dataType: 'json',
        success: function (response) {
            console.log("--附近记录成功--");
            console.log(response);
        },
        error:function(request){
            console.log(request);
        }
    });
}

//群组信息加载
function ReceiveMsgFormGroup(data) {
    console.log("--收到群消息--",data);
    var fid=_sdk.Base.getNick(data.from);
    var senderInfo = ReadUserName(fid);
    var sendName = senderInfo.UserName;
    var sendUID = senderInfo.UserSign;
    var receiveUID=data.uid;//当前用户的IMID
    var gID = data.touid;//群组IMID
    var GroupInfo=ReadGroupName(gID);
    var toName = GroupInfo.Subject;//信息接收人（组）名称
    var receiveGID =gID;// GroupInfo.DocEntry;//群组ID

    var msgs=data.msgs[0];
    msgs.to=receiveGID;
    var message =msgs.msg;//信息体
    var sendDate =msgs.time;//发送时间
    var mType =msgs.type;//媒体类型

    if (mType == 3 || mType == 5 || mType == 9 || mType == 15) {
        return false;
    }
    var curDate ='';
    if (sendDate != '') {
        var date = new Date(sendDate);
        curDate = formatDate("m月d日 h时i分", date, 4);
    }

    var htm = "";
    var has = 0;
    var curHtm = '';
    var hmsg = '';
    var msg = "";

    elem.TalkNewList.find("li").each(function () {
        var cur = $(this).attr("data-im").split('_')[1];
        if (cur == receiveGID) {
            var co = $(this).find("div[id='tipCount']").text();
            var count = parseInt(co == "" ? 0 : co) + 1;
            $(this).find("div[id='tipCount']").text(count).addClass("tipBox");

            if (mType==0) {
                if (message.lengthGB() > 10) {
                    hmsg = message.substr(0, 10) + "...";
                }
                else {
                    hmsg = message;
                }
            } else {
                hmsg = "给你发了一条消息，请注意查看！";
            }

            $(this).find("p.member_msg").html(sendName + ":" + replaceFaceInfo(hmsg));
            has++;
            curHtm = $(this);
            $(this).remove();
            return false;
        }
    });
    if (has == 0) {
        switch (mType) {
            case 0:
                if (message.lengthGB() > 10) {
                    hmsg = message.substr(0, 10) + "...";
                }
                else {
                    hmsg = message;
                }
                break;
            case 1:
                hmsg = "[图片]";
                break;
            case 2:
                hmsg = "[语音]";
                break;
            case 3:
                hmsg = "[群消息]";
                break;
            case 4:
                hmsg = "[视频]";
                break;
            default:
                hmsg = "你收到一条消息，请注意查看！";
                break;
        }
        msg = replaceFaceInfo(hmsg);
        elem.TalkNewList.find("li").eq(0).before(htmNewLineGroup.format(receiveGID, receiveGID, toName, sendName + ":" + msg, 1, "tipBox"));

    } else {
        elem.TalkNewList.find("li").eq(0).before(curHtm);
    }
    $(".talk-tab span").eq(0).addClass("info");

    if (elem.TalkOne.css("display") == "block") {
        _talkID = elem.TalkOneID.val() == "" ? "" : elem.TalkOneID.val();
        if (_talkID != "" && _talkID == receiveGID) {
            htm=formatMsgLine('1',msgs);
            elem.TalkOneMsg.append(htm);
            scrollDown(elem.TalkOneMsg);
        }
    }
}

//推送群组（图片Or文档）信息:for group
function SendMessageTgroup(type, data) {
    $("#btnSendGroup").attr("disabled", true);
    var jsonData = JSON.parse(data);
    var msg =jsonData.Msg;
    var toid = jsonData.To;
    type = parseInt(type);
    var sendMsgType = 0;
    if (type == 1) {
        msg = jsonData.Path;
        sendMsgType =1;
    } else {
        msg = jsonData.Msg;
        sendMsgType = type;
    }
    sdk.Tribe.sendMsg({
        _talkID: toid,
        msg: msg,
        msgType: sendMsgType,
        success: function (data) {
            var sendTime = new Date();
            var sendDate = sendTime;//.toLocaleTimeString();
            if (sendDate != '') {
                var date = new Date(Date.parse(sendDate));
                sendDate = formatDate("m月d日 h时i分", date, 4);
            }
            msg = replaceFaceInfo(jsonData.Msg);
            var msgHtm = "";
            switch (type) {
                case 0:
                    msg = msg.replace(/\\r|\\n/gi, '</br>');
                    msgHtm = htmMsgLine.format(sendDate, msg, currentUserID);
                    break;
                case 1:
                    msgHtm = htmMsgImgLine.format(sendDate, msg, '', '', currentUserID);
                    break;
                case 66:
                    var fsize = parseInt(jsonData.Size / 1024) > 1024 ? (jsonData.Size / 1048576).toFixed(2) + " MB" : (jsonData.Size / 1024).toFixed(2) + " KB";
                    var fileSrc = jsonData.Path + jsonData.FileName;
                    if (privateMark == 1) {
                        msgHtm = htmMsgFileLine.format(sendDate, jsonData.Msg, fsize, fileSrc, '', currentUserID);
                    } else {
                        msgHtm = htmMsgFileLine.format(sendDate, jsonData.Msg, fsize, fileSrc + "?filename=" + encodeURI(jsonData.FileName), '', currentUserID);
                    }
                    break;
                default:
                    break;
            }
            elem.TalkGroupMsg.append(msgHtm);
            scrollDown(elem.TalkGroupMsg);
            $("#txtInputGroup").text("").focus();
            $("#btnSendGroup").removeAttr("disabled");
        },
        error: function (error) {
            var date = new Date();
            var sendDate = formatDate("m月d日 h时i分", date, 4);
            var Rmsg =replaceFaceInfo(jsonData.Msg);
            var msgL = htmMsgLine_unsend.format(sendDate, Rmsg, currentUserID);
            elem.TalkGroupMsg.append(msgL);

            var emsg = "(" + error.code + ":" + error.resultText + ")";// JSON.stringify(error);
            elem.TalkGroupMsg.append(htmError.format(emsg + ""));
            scrollDown(elem.TalkGroupMsg);
            $("#btnSendGroup").removeAttr("disabled");
            if (error.code == 1001) {
                IMLogin();
            }
        }
    });
}



//地图预览：
function ViewMapSide(op) {
    var longitude = $(op).attr("data-v").split('_')[0];
    var latitude = $(op).attr("data-v").split('_')[1];
    var title = $(op).attr("title");
    var mp = longitude + ',' + latitude;
    var googleUrl = "http://ditu.google.cn/maps?q=loc:" + latitude + "," + longitude + "";//loc:22.554721,113.950486
    //window.open(googleUrl);
    var bdUrl = "http://api.map.baidu.com/marker?location=" + latitude + "," + longitude + "&title=我的位置&content="+title+"&output=html";
    var gdUrl = "http://restapi.amap.com/v3/staticmap?zoom=15&size=848*564&markers=-1,http://ico.ooopic.com/ajax/iconpng/?id=158688.png,这:" + mp + "&key=060fdfedab4347846c19f97e0981b860";
    layer.open({
        type: 2,
        title:'地图',
        area: ['850px','600px'],
        fix: false, //不固定
        maxmin:true,
        content: bdUrl
    });
}

//键盘回车事件
document.onkeyup = function (e) {
    var ev = e || window.event;
    var kc = ev.keyCode;
    switch (kc) {
        case 116:
            break;
        case 27:
            closeAllTalkBox();
            break;
        case 13:

            if (document.activeElement.id == "talkBoxSearch") {
                searchUser();//主窗体搜索
            } else if (document.activeElement.id == "searchUser") {
                searchCreateUser();
            } else if (document.activeElement.id == "searchGroupUser") {
                searchGroupUsers();
            } else if (document.activeElement.id == "txt_search") {
                SearchHistoryMsg($("#TalkType").val());
            }else if (document.activeElement.id == "txtInputGroup") {
                //if (!ev.ctrlKey) {
                //    return false;
                //}
                $("#txtInputGroup").find("img.faceImg").each(function () {
                    var faceName = $(this).attr("alt");
                    $(this).after("[" + faceName + "]");
                    $(this).remove();
                });
                var sm = $("#txtInputGroup").text();//.replace('<div>', '\r\n').replace('</div>', '');
                if ($.trim(sm) == "") {
                    return false;
                } else {
                    _talkID = elem.TalkGroupID.val().split('_')[1];//对话方IMID-IMUserid
                    var msg = { "UserSign": currentUserID, "To": _talkID, "Msg": sm, "MediaType": 0 };
                    var recName = ReadGroupName(_talkID);
                    var Rmsg = replaceFaceInfo(msg.Msg);
                    sdk.Tribe.sendMsg({
                        _talkID: msg.To,
                        msg: sm,
                        success: function (data) {
                            var date = new Date();
                            var sendDate = formatDate("m月d日 h时i分", date, 4);
                            Rmsg = Rmsg.replace(/\\r|\\n/gi, '</br>');
                            var msgL = htmMsgLine.format(sendDate, Rmsg, currentUserID);
                            elem.TalkGroupMsg.append(msgL);
                            $("#txtInputGroup").text("").focus();
                            scrollDown(elem.TalkGroupMsg);
                        },
                        error: function (error) {
                            var date = new Date();
                            var sendDate = formatDate("m月d日 h时i分", date, 4);
                            Rmsg = Rmsg.replace(/\\r|\\n/gi, '</br>');
                            var msgL = htmMsgLine_unsend.format(sendDate, Rmsg, currentUserID);
                            elem.TalkGroupMsg.append(msgL);

                            var emsg = "(" + error.code + ":" + error.resultText + ")";// JSON.stringify(error);
                            elem.TalkGroupMsg.append(htmError.format(emsg + ""));
                            scrollDown(elem.TalkGroupMsg);
                            if (error.code == 1001) {
                                IMLogin();
                            }
                        }
                    });


                }
            } else if (document.activeElement.id == "txtInput") {
                //if (!ev.ctrlKey) {
                //    return false;
                //}
                $("#txtInput").find("img.faceImg").each(function () {
                    var faceName = $(this).attr("alt");
                    $(this).after("[" + faceName + "]");
                    $(this).remove();
                });
                var sm = $("#txtInput").text();//.html().replace('<div>', '\r\n').replace('</div>', '');//.text().trim().replace(/\\r|\\n/gi, '</br>');
                if ($.trim(sm) != "") {
                    _talkID = elem.TalkOneID.val();//.split('_')[1];
                    if (_talkID == currentUserID) {
                        layer.msg("不是吧？自己发给自己？");
                        return false;
                    }
                    var msg = { "UserSign": currentUserID, "To": _talkID, "Msg": sm, "MediaType": 0 };
                    var Rmsg = replaceFaceInfo(msg.Msg);
                    var recName =ReadUserName(_talkID);
                    var curTypeCG = $("#TalkTypeIsCG").val();
                    if (curTypeCG != '') {
                        SendMessageToESQ(curTypeCG,msg);

                    } else {
                        sdk.Chat.sendMsg({
                            touid: msg.To,
                            msg: sm,
                            success: function (data) {
                                var date = new Date();
                                var sendDate = formatDate("m月d日 h时i分", date, 4);
                                Rmsg = Rmsg.replace(/\\r|\\n/gi, '</br>');
                                var msgL = htmMsgLine.format(sendDate, Rmsg, currentUserID);
                                elem.TalkOneMsg.append(msgL);
                                $("#txtInput").text("").focus();
                                scrollDown(elem.TalkOneMsg);
                            },
                            error: function (error) {
                                var date = new Date();
                                var sendDate = formatDate("m月d日 h时i分", date, 4);
                                Rmsg = Rmsg.replace(/\\r|\\n/gi, '</br>');
                                var msgL = htmMsgLine_unsend.format(sendDate, Rmsg, currentUserID);
                                elem.TalkOneMsg.append(msgL);
                                var emsg = "(" + error.code + ":" + error.resultText + ")";// JSON.stringify(error);
                                elem.TalkOneMsg.append(htmError.format(emsg + ""));
                                scrollDown(elem.TalkOneMsg);
                                if (error.code == 1001) {
                                    IMLogin();
                                }
                            }
                        });
                    }

                }
            }
            break;
        case 8:
            if (document.activeElement.id == "talkBoxSearch") {
                searchUser();
            } else if (document.activeElement.id == "searchUser") {
                searchCreateUser();
            } else if (document.activeElement.id == "searchGroupUser") {
                searchGroupUsers();
            }
            break;
        default:
            if (document.activeElement.id == "talkBoxSearch") {
                //searchUser();
            } else if (document.activeElement.id == "searchUser") {
                searchCreateUser();
            } else if (document.activeElement.id == "searchGroupUser") {
                searchGroupUsers();
            }
            break;
    }
}

