import { contextBridge, ipcRenderer } from "electron"
import { FileNode } from "./components/system/StateEngine";

// export const api = {
//     node: () => process.versions.node,
//     chrome: () => process.versions.chrome,
//     electron: () => process.versions.electron
//     // we can also expose variables, not just functions
//   }

export const fileAPI = {
  loadFile: (filePath: string) => ipcRenderer.invoke("load-file", filePath),
  onMessage: (callback:(msg:string)=>void) => ipcRenderer.on("msg", 
    (_, data)=>{console.log("Sending directory message to renderer");callback(data)}),
  onFileTree: (callback:(files:FileNode[])=>void) => ipcRenderer.on("msg", 
    (_, data)=>callback(data)),
  // we can also expose variables, not just functions
}

export const suiClient = {
  loadConfig: (filePath: string) => ipcRenderer.invoke("load-sui-config", filePath),
  // we can also expose variables, not just functions
}

export const networkAPI = {
  loadFile: (filePath: string) => ipcRenderer.invoke("load-net-file", filePath),
  // we can also expose variables, not just functions
}

declare global {
  interface Window {
    suiClient: typeof suiClient;
    fileAPI: typeof fileAPI;
    networkAPI: typeof networkAPI;
  }
}
contextBridge.exposeInMainWorld("fileAPI", fileAPI)
contextBridge.exposeInMainWorld("suiClient", suiClient)
contextBridge.exposeInMainWorld("networkAPI", networkAPI)

