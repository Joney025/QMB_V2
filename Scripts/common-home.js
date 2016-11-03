/**
 * Created by Joney.y on 2016/10/17.
 */
function changeFrameHeight(){
    var ifm= document.getElementById("mainframe");
    ifm.height=document.documentElement.clientHeight;
}
window.onresize=function(){
    changeFrameHeight();
}
$(document).ready(function(){
$("#nav_menu>li").click(function(){
    var src=$(this).attr("data-src");
    $("#mainframe").attr("src",src+"html");
});

});