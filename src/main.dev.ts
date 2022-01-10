/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build:main`, this file is compiled to
 * `./src/main.prod.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import { app, BrowserWindow, /* autoUpdater , */ipcMain, shell,dialog,Notification } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { exec } from 'child_process';
import puppeteer from 'puppeteer'
let KEY = ''
// const fetch = require('node-fetch')
// const server = 'https://your-deployment-url.com'
// const url = `${server}/update/${process.platform}/${app.getVersion()}`

// autoUpdater.setFeedURL({ url })


// setInterval(() => {
//   autoUpdater.checkForUpdates()
// }, 600000)

// autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
//   const dialogOpts = {
//     type: 'info',
//     buttons: ['Restart', 'Later'],
//     title: 'Application Update',
//     message: process.platform === 'win32' ? releaseNotes : releaseName,
//     detail: 'A new version has been downloaded. Restart the application to apply the updates.'
//   }

//   dialog.showMessageBox(dialogOpts).then((returnValue) => {
//     if (returnValue.response === 0) autoUpdater.quitAndInstall()
//   })
// })
// autoUpdater.on('error', message => {
//   console.error('There was a problem updating the application')
//   console.error(message)
// })

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    console.log(autoUpdater.getFeedURL())
    console.log(autoUpdater.updateConfigPath)
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
let loginWindow: BrowserWindow | null = null;
let _logoutWindow: BrowserWindow | null = null;
const harvesterWindows = <BrowserWindow[]>[]
if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};


const createHarvesterWindow =  async (
  {url,pid,site,port}:{url:string,pid:string,site:string,port:number}
  ):Promise<puppeteer.Browser>=>{
  // if (
  //   process.env.NODE_ENV === 'development' ||
  //   process.env.DEBUG_PROD === 'true'
  // ) {
  //   await installExtensions();
  // }

  // const RESOURCES_PATH = app.isPackaged
  //   ? path.join(process.resourcesPath, 'assets')
  //   : path.join(__dirname, '../assets');

  // const getAssetPath = (...paths: string[]): string => {
  //   return path.join(RESOURCES_PATH, ...paths);
  // };

  const Browser = await puppeteer.launch({
    /* @ts-ignore */
    ignoreDefaultArgs:['--enable-automation',...puppeteer.defaultArgs()],
    headless:false,
    args:[
      `--host-rules=MAP ${site.replace('www.','')} 127.0.0.1:${port}`,
      '--no-default-browser-check',
      '--no-check-default-browser',
      '--no-first-run',
      '-window-size=500,620',
      `--app=http://${site.replace('www.','')}`
  ]
  });
  const HarvesterWindow = (await Browser.pages())[0]
  await HarvesterWindow.setViewport({
    width:480,
    height:580
  })
  console.log(`http://${site.replace('www.','')}`)
  await HarvesterWindow.setRequestInterception(true)
  HarvesterWindow.on('request',(request)=>{
    console.log(request.method() == 'POST',request.url() == `https://${site.replace('www.','')}`,request.url(),'\n')
    request.continue()
    if(request.method() == 'POST'&&
    decodeURIComponent(request.url()).includes(`&dl=http://${site.replace('www.','')}`)

    )
    {
      console.log('captcha solved')

    }//else console.log(request.url())
  })

  // await HarvesterWindow.setViewport({
  //   width:300,
  //   height:600  
  // })
  // await (await HarvesterWindow.pages())[0].goto(url)
  HarvesterWindow.on('close',()=>{
    exec(`taskkill /F /PID ${pid}`,()=>{
      console.log(pid,'was successfully killed')
    })
    Browser.close()
  })
  return Browser
}

const createLogoutWindow = async () => {
  // if (
  //   process.env.NODE_ENV === 'development' ||
  //   process.env.DEBUG_PROD === 'true'
  // ) {
  //   await installExtensions();
  // }

  _logoutWindow = new BrowserWindow({
    show: false,
    autoHideMenuBar:true,
    resizable:false,
    width: 1,
    height: 1,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    },
  });
  _logoutWindow.loadURL(`file://${__dirname}/index.html?viewLogout`);
  _logoutWindow.on('show',_logoutWindow.hide)

};

const createMainWindow = async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    autoHideMenuBar:true,
    minWidth: 1024,
    minHeight: 728,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    },
  });

  mainWindow.loadURL(`file://${__dirname}/index.html?viewMain`);
  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
    // mainWindow.hide()
  });
  mainWindow.on('ready-to-show',()=>{
    new AppUpdater()
    if(loginWindow)loginWindow.close()
  })/* added */
  mainWindow.on('closed',(_event:Electron.Event)=>{
    mainWindow=null
    !loginWindow?_logoutWindow?.webContents.send('onCloseLogout'):null
    // Logout()
  })
  
  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();
  new AppUpdater()

  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });
  
  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  // new AppUpdater();
};
const createLoginWindow = async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  loginWindow = new BrowserWindow({
    show: false,
    width: 400,
    height: 530,
    resizable:false,
    autoHideMenuBar:true,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    },
  });

  loginWindow.loadURL(`file://${__dirname}/index.html?viewLogin`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  loginWindow.webContents.on('did-finish-load', () => {
    if (!loginWindow) {
      throw new Error('"loginWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      loginWindow.minimize();
    } else {
      loginWindow.show();
      loginWindow.focus();
    }
  });
  loginWindow.on('closed',()=>{
    loginWindow=null
    if (!mainWindow) {
      app.quit()
    }
    /* app.quit()
    LOGOUT
    loginWindow=null */

  })
  loginWindow.on('ready-to-show',()=>{
    if(mainWindow)mainWindow.close()
  })

  const menuBuilder = new MenuBuilder(loginWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  loginWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  // new AppUpdater();
};

/**
 * Add event listeners...
 */
app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    // logout()/* problems maybe */
    app.quit();
  }
});

app.whenReady().then(()=>{createLogoutWindow();createLoginWindow()}).catch(console.log);

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  // if (mainWindow === null) createMainWindow();
  if (loginWindow === null) /* createLogoutWindow(); */createLoginWindow()/* ;createMainWindow() */
});
ipcMain.on('setKey',(_event,args)=>KEY = args)
ipcMain.on('deleteKey',()=>KEY = '')
ipcMain.on('login',()=>{createMainWindow();/* if(loginWindow)loginWindow.close(); */})
ipcMain.on('logout',()=>{createLoginWindow()/* ;if(mainWindow)mainWindow.close() */;})
ipcMain.on('onCloseLogoutSuccess',app.quit)
ipcMain.on('notify',(_event,type:Electron.NotificationConstructorOptions)=>{
    return new Notification(type).show()
  }
)
ipcMain.on('createHarvester',(_event,args)=>{
  createHarvesterWindow({...args})
})


