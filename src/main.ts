import { app, BrowserWindow, dialog, ipcMain } from 'electron'
import path from 'node:path'
import fs from 'fs/promises'
import started from 'electron-squirrel-startup'
import { runSuiBuild } from './scripts/build'
import { SessionManager } from './HAL/sessionManager'
import { buildFileTree } from './HAL/buildFileTree'

let mainWindow: BrowserWindow

// ✅ IPC handlers
ipcMain.handle('load-file', async (_, filePath) => {
  return await fs.readFile(filePath, 'utf-8')
})

ipcMain.handle('save-session', async (_, data) => {
  const sessionManager = await SessionManager.init()
  await sessionManager.saveSession(data)
})

ipcMain.handle('load-session', async () => {
  const sessionManager = await SessionManager.init()
  return await sessionManager.loadSession()
})

ipcMain.handle('sui-command', async () => {
  try {
    const result = runSuiBuild()
    return { success: true, message: result }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
})

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

// 🪟 Create main window
const createWindow = async () => {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
    },
  })

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`))
  }

  mainWindow.webContents.openDevTools()
}

// 🧹 Windows shortcut cleanup
if (started) {
  app.quit()
}

// 🧠 App lifecycle
app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
