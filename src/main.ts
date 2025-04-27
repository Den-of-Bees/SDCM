import { app, BrowserWindow, dialog, ipcMain } from 'electron'
import path from 'node:path'
import fs from 'fs/promises'
import started from 'electron-squirrel-startup'
import { runSuiBuild } from './scripts/build'
import { SessionManager } from './HAL/sessionManager'
import { buildFileTree } from './HAL/buildFileTree'
import { runSuiDeploy } from './scripts/deploy'
import {  startPTY } from './HAL/PTYService'

let mainWindow: BrowserWindow

ipcMain.handle('load-file', async (_, filePath: string) => {
  const content = await fs.readFile(filePath, 'utf-8')
  return content
})

ipcMain.handle('save-file', async (_, filePath: string, content: string) => {
  const fs = await import('fs/promises')
  await fs.writeFile(filePath, content, 'utf-8')
  return { success: true }
})

ipcMain.handle('save-session', async (_, data) => {
  const sessionManager = await SessionManager.init()
  await sessionManager.saveSession(data)
})

ipcMain.handle('load-session', async () => {
  const sessionManager = await SessionManager.init()
  return await sessionManager.loadSession()
})

ipcMain.handle('sui-build', async (_, buildDir: string, outputDir: string) => {
  try {
    const result = runSuiBuild({ moveDir: buildDir, outputDir })
    return result
  } catch (error: any) {
    return { success: false, message: error.message }
  }
})

ipcMain.handle('sui-deploy', async (_, buildDir: string, outputDir: string) => {
  try {
      const result = await runSuiDeploy({ moveDir: buildDir, outputDir });
      return result;
  } catch (error: any) {
      return { 
          success: false, 
          message: error.message 
      };
  }
});
ipcMain.handle('build-file-tree', async (_, pathToUse) => {
  return await buildFileTree(pathToUse)
})

ipcMain.handle('prompt-open-dialog', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  })
  return result.canceled ? null : result.filePaths[0]
})

ipcMain.handle('validate-path', async (_, pathToCheck: string) => {
  try {
    await fs.access(pathToCheck)
    return true
  } catch {
    return false
  }
})

const start = async ()=>{
  const sessionManager = await SessionManager.init();
  const session = await sessionManager.loadSession();
  const cwd = session.lastOpenedPath || process.env.HOME!;
  
  const { ptyOnData, ptyWrite, resize } = startPTY(mainWindow, cwd);
  ipcMain.on('pty-write',  (_e, d) => ptyWrite(d));
  ipcMain.on('pty-resize', (_e, c, r) => resize(c, r));  
  ptyOnData((data:string)=> {console.log('pre send');
  mainWindow.webContents.send('pty-cast',data)})
  return Promise.resolve()
}



const createWindow = async () => {
  
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false, // Disable Node.js integration in renderer process for security
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
      allowRunningInsecureContent: false, // Disable running insecure content
    },
  })

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`))
  }
  
  mainWindow.webContents.openDevTools()
  await start()
  
}

if (started) {
  app.quit()
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
