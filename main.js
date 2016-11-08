'use strict';
const electron = require('electron');
const fs=require('fs');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipc=electron.ipcMain;
const path = require('path');
const Tray = electron.Tray;
const Menu=electron.Menu;
const dialog = require('electron').dialog;
//const AutoLaunch=require('auto-launch');
const nativeImg=electron.nativeImage;


let mainWindow = null;
let tray=null;
let webContents = null;

//let appAutoLauncher=new AutoLaunch({
//  name:'QMB'//this is the app name.
//  //,path:app.getAppPath()
//});
//appAutoLauncher.isEnabled((enabled)=>{
//  if(enabled){return;}
//appAutoLauncher.enable((err)=>{
//  if(err){
//  SystemLoger(err);
//  //throw(err);
//}
//});
//});

app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit();
  }
});
app.on('ready', function() {
  InitWin();
  initAppTray();
  ipc.on('win-show', function (ev,obj) {
    mainWindow.show();
    tray.setHighlightMode('selection')
  });
  ipc.on('win-exit', function () {
    app.exit(0);
  });
  ipc.on('win-min', function () {
    mainWindow.minimize();
  });
  ipc.on('win-max', function () {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    }else{
      mainWindow.maximize();
    }
  });
  ipc.on('tray-removed', function () {
    app.exit(0);
    tray.destroy();
  });
  ipc.on('im-msg',function(ev,obj){
    const iconPath=path.join(__dirname,'Images/lookme.jpg');//图标必须为本地资源
    var bloon={icon:obj.Img,title:obj.sender,content:obj.text};
    tray.displayBalloon(bloon);//冒泡提示
    //tray.getBounds();
  });

});
//实例化应用角标：
function initAppTray(){
  const iconPath=path.join(__dirname,'Images/Appx.png');
  tray=new Tray(iconPath);
  const contextMenu=Menu.buildFromTemplate([{
    label:'退出',
    click:function(){
      app.exit(0);
      tray.destroy();
    }
    },
      {label:'在线',type:'radio',checked:true},
      {label:'隐身',type:'radio'},
      {label:'离线'}
  ]);
  tray.setToolTip('我的圈圈');
  tray.setContextMenu(contextMenu);
  tray.on('click',()=>{
    mainWindow.isVisible()?mainWindow.hide():mainWindow.show();
  });
  tray.on('show',()=>{
    tray.setHighlightMode('always');
  });
  tray.on('hide',()=>{
    tray.setHighlightMode('never');
  });
  tray.on('balloon-click',function(obj){
    var bbool=obj.getBounds();
    mainWindow.webContents.send('balloon-clk',bbool);
  });

}
//单例模式：
function makeSingleInstance () {
  if (process.mas) return false
  return app.makeSingleInstance(function () {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
}
//实例化窗体：
function InitWin(){
  try{
    makeSingleInstance();
    // Create the browser window.
    var windowOptions = {
      width:850,
      height:700,
      minWidth:850,
      minHeight:700,
      //icon:'Images/Appx.png',
      //title: app.getName(),
      //resizable:false,
      hasShadow:true,
      transparent:false,
      frame:false
      //webPreferences:{nodeIntegration:false}
    }

    mainWindow = new BrowserWindow(windowOptions);

    mainWindow.loadURL('file://' + __dirname + '/Views/login.html');
    webContents=mainWindow.webContents;
    mainWindow.webContents.openDevTools();//显示调试工具

    mainWindow.on('closed', function() {
      mainWindow = null;
    });
    //By:joney.
    mainWindow.on('resize', function() {
      var winSize = mainWindow.getSize();
      webContents.send('resetIMFrame', winSize + '');
    })
    //By:joney.
    webContents.on('did-finish-load', function() {
      var winSize = mainWindow.getSize();
      webContents.send('resetIMFrame', winSize + '');
    });
    webContents.on('did-finish-load',function(){
      webContents.send('ping', '欢迎使用我的圈圈办公助手');
    });
  }catch(ex){
    SystemLoger(ex);
  }
}

//系统日志：BY Joney.
function SystemLoger(msgInfo){
  try{
    var filePath=path.join(__dirname,'/log/runninglog.log');
    fs.exists(filePath,(exists)=>{
      if(!exists){
      fs.mkdir(path.join(__dirname,'/log'),(err)=>{});
    }
  });
  if(true){
    var logInfo='\r\n'+new Date().toString()+'\r\n----------'+msgInfo;
    fs.appendFile(filePath,logInfo,'utf8',function(err){
      //if(err){throw err;}
    });
  }else{
    fs.readFileSync(path.join(__dirname,'runninglog'),'utf8',function(err,data){
      //if(err){throw err;}
    });
  }
}catch(ex){
  throw ex;
}
}


