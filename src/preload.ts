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

export const SuiBuildStream = {
  start: (buildDir: string, outputDir: string) => {
    console.log('Starting SuiBuildStream');
    ipcRenderer.send('sui-build-stream', buildDir, outputDir);
  },
  onData: (cb: (data: string) => void) => {
    const listener = (_: any, data: string) => cb(data);
    ipcRenderer.on('sui-build-stream-data', listener);
    return () => ipcRenderer.removeListener('sui-build-stream-data', listener);
  },
  onEnd: (cb: (code: number) => void) => {
    const listener = (_: any, code: number) => cb(code);
    ipcRenderer.on('sui-build-stream-end', listener);
    return () => ipcRenderer.removeListener('sui-build-stream-end', listener);
  },
  onError: (cb: (err: string) => void) => {
    const listener = (_: any, err: string) => cb(err);
    ipcRenderer.on('sui-build-stream-error', listener);
    return () => ipcRenderer.removeListener('sui-build-stream-error', listener);
  }
};

export const SuiDeployStream = {
  start: (buildDir: string, outputDir: string) => {
    console.log('Starting SuiDeployStream at the directory: ' + buildDir + ' and output directory: ' + outputDir);
    ipcRenderer.send('sui-deploy-stream', buildDir, outputDir);
  },
  onData: (cb: (data: string) => void) => {
    const listener = (_: any, data: string) => cb(data);
    ipcRenderer.on('sui-deploy-stream-data', listener);
    return () => ipcRenderer.removeListener('sui-deploy-stream-data', listener);
  },
  onEnd: (cb: (code: number) => void) => {
    const listener = (_: any, code: number) => cb(code);
    ipcRenderer.on('sui-deploy-stream-end', listener);
    return () => ipcRenderer.removeListener('sui-deploy-stream-end', listener);
  },
  onError: (cb: (err: string) => void) => {
    const listener = (_: any, err: string) => cb(err);
    ipcRenderer.on('sui-deploy-stream-error', listener);
    return () => ipcRenderer.removeListener('sui-deploy-stream-error', listener);
  }
};

export const networkAPI = {
  loadFile: (filePath: string) => ipcRenderer.invoke("load-net-file", filePath),
  // we can also expose variables, not just functions
}

export const sessionAPI = {
  saveSession: async (data: Partial<SessionData>) => ipcRenderer.invoke('save-session', data),
  loadSession: () => ipcRenderer.invoke("load-session"),
  // we can also expose variables, not just functions
}

// PTY section for preload.ts
const PTY = {
  sendInput: async (input: string) => {
    console.log(`[Renderer] Sending to PTY: ${input.replace(/\r/g, '\\r').replace(/\n/g, '\\n')}`);
    ipcRenderer.send('pty-write', input);
  },
  
  onOutput: (listener: (data: string) => void) => {
    console.log('[Renderer] Registering PTY output listener');
    
    // Debug logging of all received messages
    const wrappedListener = (event: any, data: string) => {
      console.log(`[Renderer] PTY data received: ${data.length} chars`);
      console.log(`[Renderer] PTY data preview: ${data.substring(0, 50).replace(/\r/g, '\\r').replace(/\n/g, '\\n')}${data.length > 50 ? '...' : ''}`);
      listener(data);
    };
    
    // Remove any existing listeners to prevent duplicates
    ipcRenderer.removeAllListeners('pty-cast');
    
    // Register the new listener
    ipcRenderer.on('pty-cast', wrappedListener);
    
    // Return unsubscribe function
    return () => {
      ipcRenderer.removeListener('pty-cast', wrappedListener);
    };
  },
  
  onResize: (cols: number, rows: number) => {
    console.log(`[Renderer] Resizing PTY to: ${cols}x${rows}`);
    ipcRenderer.send('pty-resize', cols, rows);
  },
  
  // Send a test command to see if the PTY is responsive
  testConnection: () => {
    console.log('[Renderer] Testing PTY connection');
    ipcRenderer.send('pty-write', 'echo PTY TEST CONNECTION\r');
  }
};

declare global {
  interface Window {
    suiClient: {
      runSuiBuild: (buildDir: string, outputDir: string) => Promise<{ success: boolean; message: string }>,
      runSuiDeploy: (buildDir: string, outputDir: string) => Promise<{ success: boolean; message: string }>,
    };
    fileAPI: typeof fileAPI;
    PTY: typeof PTY;
    networkAPI: typeof networkAPI;
    sessionAPI: {
      loadSession: () => Promise<SessionData>;
      saveSession: (data: Partial<SessionData>) => Promise<boolean>;
  };
    SuiBuildStream: typeof SuiBuildStream;
    SuiDeployStream: typeof SuiDeployStream;
}
}


contextBridge.exposeInMainWorld("fileAPI", fileAPI)
contextBridge.exposeInMainWorld("suiClient", suiClient)
contextBridge.exposeInMainWorld("networkAPI", networkAPI)
contextBridge.exposeInMainWorld("sessionAPI", sessionAPI)
contextBridge.exposeInMainWorld("PTY", PTY)
contextBridge.exposeInMainWorld("SuiBuildStream", SuiBuildStream)
contextBridge.exposeInMainWorld("SuiDeployStream", SuiDeployStream)
