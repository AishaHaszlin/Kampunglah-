const { app, BrowserWindow } = require('electron');
const path = require('node:path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
var mainWindow;
  // Create the browser window.
   var mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration:true,
      contextIsolation:false,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  var mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
  Menu.setApplicationMenu(mainMenu);
  
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

let addWindow;
var mainMenuTemplate = [
  {
    label:'File',
    submenu: [
      {
        label: 'Add new item',
        click() {
          addWindow = new BrowserWindow({
            width: 400,
            height: 300,
            title: "Add new item",
            webPreferences: {
              nodeIntegration: true,
              contextIsolation: false
            }
          });

          addWindow.loadFile(path.join(__dirname, 'add.html'));
        }
      },
      {
        label: 'Clear all item'
      },
      {
        label: 'Quit',
        click() {
          app.quit();
        }
      }
    ]
  },
  {
    label:'Help',
    submenu: [
      {
        label:'About Us'
      }
    ]
  }
];

ipxMain.on("item.")



// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
