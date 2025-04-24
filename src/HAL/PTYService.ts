// pty.on pty -> render (needs webcontent)


// ipcmain.on  reder -> to pty.write

import pty, { IPty } from 'node-pty';
import os from 'os';

const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';
let ptyProcess:IPty = null!
// wrap in createSession takes browser window or window service
// seesion either sevice or local ** wraper around map api set and delete** 
export const startPTY = ()=>{
  ptyProcess = pty.spawn(shell, [], {
    name: 'xterm-color',
    cols: 80,
    rows: 24,
    cwd: process.env.HOME,
    env: process.env
  });

return {
ptyWrite:(data:string)=>{
  console.log(`recieved ${data}`)
  ptyProcess.write(data)
}
,
ptyOnData: (listener:(data:string)=>void)=>{
  ptyProcess.onData(listener)
  listener("hello from the terminal")
  console.log("hello from the terminal")
}}
}
// implement resize ptyProcess.resize

// session will call ptyProcess.kill
// on the close event of the window containing the event sender / webcontents
// and remove from seesion map