import { app, BrowserWindow, dialog, ipcMain, webContents } from 'electron';
import path from 'node:path';
import fs,{ readFile } from 'fs/promises';
import started from 'electron-squirrel-startup';
import { FileNode } from './components/system/StateEngine';
import { runSuiBuild } from './scripts/build';
import { SessionManager } from './sessionManager';
const home = path.join(__dirname,'../../src')



// const async buildFileTree = (dirPath)=> {
//   const entries = await fs.readdir(dirPath, { withFileTypes: true });

//   const tree = await Promise.all(entries.map(async entry => {
//     const fullPath = path.join(dirPath, entry.name);
//     if (entry.isDirectory()) {
//       return {
//         name: entry.name,
//         isFolder: true,
//         isOpen: false, // You can choose to default to true if you want it expanded
//         children: await buildFileTree(fullPath),
//       };
//     } else {
//       return {
//         name: entry.name,
//         isFolder: false,
//       };
//     }
//   }));

//   return tree;
// }

ipcMain.handle('load-file', async (_, filePath) => {
  const content = await fs.readFile(filePath, 'utf-8');
  return content;
});

ipcMain.handle('save-session', async (_, data) => {
  const sessionManager = new SessionManager();
  await sessionManager.saveSession(data);
}
);

ipcMain.handle('load-session', async () => {
  const sessionManager = new SessionManager();
  const sessionData = await sessionManager.loadSession();
  return sessionData;
});


let mainWindow: BrowserWindow

ipcMain.handle('sui-command', async () => {
  try {
      const result = runSuiBuild();
      return { success: true, message: result };
  } catch (error: any) {
      return { success: false, message: error.message };
  }
});





const start = async ()=>{
  const res = await dialog.showOpenDialog({ properties: ['openDirectory'] })
  console.log(res.filePaths[0])
  if (res.canceled) {
    console.log("cancelled")
  } else {
    mainWindow.webContents.send("msg", res.filePaths[0])
  }
  
  
  //Load session
  const sessionManager = new SessionManager();
  const sessionData = await sessionManager.loadSession();

  console.log(sessionData)
  
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = async () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: false, // Disable Node.js integration in renderer process for security
      contextIsolation: true, // Isolate the context between the renderer and the main process
      preload: path.join(__dirname, 'preload.js'),
      sandbox: true, // Enable sandboxing for the renderer process
      webSecurity: true, // Ensure web security is enabled
      allowRunningInsecureContent: false, // Disable running insecure content
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
  await start()
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.