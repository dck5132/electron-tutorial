import { app, BrowserWindow, screen, ipcMain, WebContents, webContents, session } from 'electron';
import * as path from 'path';
import * as url from 'url';
import * as colors from 'colors';

// Blue is an action 
// Green is an identifying string
// Red is an important log
// Yellow is an event
// White or no color is variables and actual values

let win: BrowserWindow = null;
let googleWin: BrowserWindow = null;
let childWin: BrowserWindow = null;
let authWin: BrowserWindow = null;

const args = process.argv.slice(1),
    serve = args.some(val => val === '--serve');

function createWindow(primary: boolean, uri: string = 'http://localhost:4200'): BrowserWindow {
  let window:BrowserWindow = null;
  let webPreferences = null;

  let customSession = session.fromPartition('persist:part1');
  // let customerPartition = session.fromPartition('persist:part1')
  if (uri.indexOf('http://localhost:4200') !== -1) {
    let webSession = null;
    if (primary) {
      webSession = session.defaultSession
    }
    else {
      webSession = customSession
    }
    webPreferences = {
      nodeIntegration: true,
      allowRunningInsecureContent: (serve) ? true : false,
      session: webSession
    }
  }
  else {
    webPreferences = null;
  }

  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  console.log('before creation'.green);
  console.log(window);
  if (primary) {
    window = new BrowserWindow({
      backgroundColor: '#00293D',
      width: size.width,
      height: size.height,
      show: false,
      webPreferences: webPreferences
    });

    window.once('ready-to-show', () => {
      window.show();
      // This handles setting the main window on top of any other windows (Other applications even in full screen)
      window.setAlwaysOnTop(true);
      setTimeout(() => {
        window.setAlwaysOnTop(false);
      }, 100
      )
    });
  
    window.on('show', () => {
      console.log('show window'.blue)
      if (serve) {
        window.webContents.openDevTools();
        console.log('Dev Tools Opened'.blue);
      }
    });

  }
  else {
    window = new BrowserWindow({
      backgroundColor: '#00293D',
      width: size.width - 500,
      height: size.height - 500,
      minWidth: 300,
      minHeight: 300,
      webPreferences: webPreferences,
      parent: BrowserWindow.getAllWindows()[0],
      // modal: true,
      // titleBarStyle: 'hidden',
      // frame: false
    })

    window.once('focus', () => {
      window.webContents.openDevTools()
    });

    window.on('close', (e) => {
      e.preventDefault();
      console.log('Prevented App from closing and hid it'.blue);
      window.hide();
    })

  }



  if (serve) {
    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`)
    });
    window.loadURL(uri);
    console.log('uri:'.green);
    console.log(uri);
  } else {
    window.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }

  let wc: WebContents = window.webContents

  wc.on('new-window', (e, url) => {
    console.log('New window loaded from: '.green);
    console.log(url)
    // e.preventDefault();
    // console.log('Prevented window from opening'.blue);
  });
  wc.on('dom-ready', () => {
    console.log('Dom Finished Loading'.green);
  });

  wc.on('did-finish-load', () => {
    console.log('Web Content Finished Loading'.green);
  });

  wc.on('before-input-event', (e, input) => {
    console.log(`${input.key} :  ${input.type}`);
  });

  wc.on('did-navigate', (e, url, statusCode, message) => {
    console.log(`Navigated to ${url} with response code ${statusCode}`.blue);
    console.log(message);
  })

  wc.on('login', (e, request, authinfo, callback) => {
    console.log('Logging in'.blue);
    callback('user', 'passwd')
  })

  wc.on('media-started-playing', () => {
    console.log('video Started playing'.blue)
  })

  wc.on('media-paused', () => {
    console.log('video paused'.blue)
  })

  wc.on('context-menu', (e, params) => {
    console.log(`Context Menu opened on ${params.mediaType} at x: ${params.x} and y: ${params.y}`.blue);
    console.log(`Selection can be copied ${params.editFlags.canCopy}`)
  })


  console.log('Web Contents: '.green);
  console.log(webContents.getAllWebContents());

  // Emitted when the window is closed.
  window.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    console.log('Window is closing'.blue);
    window = null;
  });
  console.log('Window is: '.green);
  console.log(window);
  return window;
}

try {

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', () => {
    console.log(app.getPath('desktop').green);
    console.log(app.getPath('music').green)
    console.log(app.getPath('temp').green)
    console.log(app.getPath('userData').green)
    console.log('Creating Main Window'.blue);
    win = createWindow(true);
    console.log(win);
    console.log('Main window web contents'.green)
    console.log(win.webContents)
    console.log('Main window session'.green)
    console.log(win.webContents.session);
    console.log('Session from session module'.green)
    console.log(session.defaultSession);
    console.log('Session object default session is equal to home session: ')
    console.log(Object.is(win.webContents.session, session.defaultSession))
    console.log('Session Partition 1'.green);
    console.log(session.fromPartition('part1'));
    console.log('Session compare partition to default');
    console.log(Object.is(session.fromPartition('part1'), session.defaultSession))
    console.log('Clearing default local storage'.blue);
    win.webContents.session.clearStorageData();
    // let menu =  new Menu();
    // Menu.setApplicationMenu(menu); 

    ipcMain.on('google', () => {
      console.log('Creating Google Window'.blue);
      console.log(googleWin);
      if (googleWin === null) {
        googleWin = createWindow(false, 'https://google.com');  
      }
      else {
        googleWin.show();
      }
    });

    ipcMain.on('child', () => {
      console.log('Creating child component window'.blue)
      console.log(childWin);

      if (childWin === null) {
        childWin = createWindow(false, 'http://localhost:4200#/child')
      }
      else {
        childWin.show();
      }

      console.log('Compare main session and child session'.green);
      console.log(Object.is(win.webContents.session, childWin.webContents.session))
    });

    ipcMain.on('auth', () => {
      console.log('Creating auth Window'.blue);
      console.log(authWin);
      if (authWin === null) {
        authWin = createWindow(false, 'https://httpbin.org/basic-auth/user/passwd')
      }
      else {
        authWin.show();
      }
    });
  });

  app.on('browser-window-blur', event => {
    console.log(colors.yellow('Application is unfocused'));
    // setTimeout(() => {
    //   app.quit()
    // }, 3000);
  });

  app.on('browser-window-focus', event => {
    console.log(colors.yellow('Application is focused'));
  });

  app.on('before-quit', event => {
    console.log(colors.yellow('Application is quitting'))
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
      win = createWindow( true);
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}
