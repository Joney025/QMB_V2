'use strict';
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipc=electron.ipcMain;
const path = require('path');
const Tray = electron.Tray;
const Menu=electron.Menu;
const ipcCmd = require('electron').ipcRenderer;
const debug = /--debug/.test(process.argv[2]);
const nativeImg=electron.nativeImage;

let mainWindow = null;
let tray=null;

app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit();
  }
});
app.on('ready', function() {
  InitialWin();
  ipc.on('win-show', function () {
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
  });
  TrayShow();
});
//应用角标：
function TrayShow(){
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
function InitialWin(){
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

  mainWindow.loadURL('file://' + __dirname + '/index.html');

  mainWindow.webContents.openDevTools();//显示调试工具

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
  mainWindow.webContents.on('did-finish-load',function(){
    mainWindow.webContents.send('ping', '欢迎使用我的圈圈办公助手');
  });
}

