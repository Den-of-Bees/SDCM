import { contextBridge, ipcRenderer } from "electron"
import { FileNode } from "./components/system/StateEngine";
import { SessionData } from './components/system/StateEngine';
// export const api = {
//     node: () => process.versions.node,
//     chrome: () => process.versions.chrome,
//     electron: () => process.versions.electron
//     // we can also expose variables, not just functions
//   }

export const fileAPI = {
  loadFile: (filePath: string) => ipcRenderer.invoke("load-file", filePath),
  
  onMessage: (callback:(msg:string)=>void) => ipcRenderer.on("msg", 
    (_, data)=>callback(data)),

  promptOpenDialog: async () => ipcRenderer.invoke('prompt-open-dialog'),
  buildFileTree: async (path: string) => ipcRenderer.invoke('build-file-tree', path),
  validatePath: async (path: string) => ipcRenderer.invoke('validate-path', path),
  saveFile: (filePath: string, content: string) => ipcRenderer.invoke('save-file', filePath, content),
}

export const suiClient = {
  loadConfig: (filePath: string) => ipcRenderer.invoke("load-sui-config", filePath),
  runSuiBuild: (buildDir: string, outputDir: string) => ipcRenderer.invoke('sui-build', buildDir, outputDir),
  runSuiDeploy: (buildDir: string, outputDir: string) => ipcRenderer.invoke('sui-deploy', buildDir, outputDir),
  // we can also expose variables, not just functions
}

export const networkAPI = {
  loadFile: (filePath: string) => ipcRenderer.invoke("load-net-file", filePath),
  // we can also expose variables, not just functions
}

export const sessionAPI = {
  saveSession: async (data: Partial<SessionData>) => ipcRenderer.invoke('save-session', data),
  loadSession: () => ipcRenderer.invoke("load-session"),
  // we can also expose variables, not just functions
}

declare global {
  interface Window {
    suiClient: {
      runSuiBuild: (buildDir: string, outputDir: string) => Promise<{ success: boolean; message: string }>,
      runSuiDeploy: (buildDir: string, outputDir: string) => Promise<{ success: boolean; message: string }>,
    };
    fileAPI: typeof fileAPI;
    networkAPI: typeof networkAPI;
    sessionAPI: {
      loadSession: () => Promise<SessionData>;
      saveSession: (data: Partial<SessionData>) => Promise<boolean>;
  };}
}

contextBridge.exposeInMainWorld("fileAPI", fileAPI)
contextBridge.exposeInMainWorld("suiClient", suiClient)
contextBridge.exposeInMainWorld("networkAPI", networkAPI)
contextBridge.exposeInMainWorld("sessionAPI", sessionAPI)
