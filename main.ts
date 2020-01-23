import { app, BrowserWindow, screen, Menu } from 'electron';
import * as path from 'path';
import * as url from 'url';
import * as colors from 'colors';


let win: BrowserWindow = null;
const args = process.argv.slice(1),
    serve = args.some(val => val === '--serve');

function createWindow(): BrowserWindow {

  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    backgroundColor: '#00293D',
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: (serve) ? true : false,
    }
  });

  if (serve) {
    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`)
    });
    win.loadURL('http://localhost:4200');
  } else {
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }

  win.once('ready-to-show', win.show);

  win.once('show', () => {
    if (serve) {
      win.webContents.openDevTools();
      console.log(colors.blue('Dev Tools Opened'));
    }
  });

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  return win;
}

try {

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', () => {
    console.log(app.getPath('desktop'));
    console.log(app.getPath('music'))
    console.log(app.getPath('temp'))
    console.log(app.getPath('userData'))
    console.log(colors.green('Application is Ready'));
    createWindow();
    // let menu =  new Menu();
    // Menu.setApplicationMenu(menu);
  });

  app.on('browser-window-blur', event => {
    console.log(colors.white('Application is unfocused'));
    // setTimeout(() => {
    //   app.quit()
    // }, 3000);
  });

  app.on('browser-window-focus', event => {
    console.log(colors.white('Application is focused'));
  });

  app.on('before-quit', event => {
    console.log(colors.white('Application is quitting'))
    // event.preventDefault();
    // console.log(colors.white('Application prevented from quiting'))
  });

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}
