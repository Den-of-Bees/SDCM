import os from 'os';
import { BrowserWindow } from 'electron';
import pty, { IPty } from '@homebridge/node-pty-prebuilt-multiarch';

export const startPTY = (window: BrowserWindow, initialCwd: string) => {
  const isWin = os.platform() === 'win32';
  let ptyProcess: IPty;
  
  const formattedCwd = isWin ? initialCwd.replace(/\\/g, '\\\\') : initialCwd;
  
  let shell, args;
  if (isWin) {
    shell = 'cmd.exe';
    args = ['/K', `cd /d "${formattedCwd}" && cls`];
  } else {
    shell = 'bash';
    args = ['--login', '-i'];
  }
  
  console.log(`Spawning shell: ${shell} with args: ${args.join(' ')}`);
  
  const env = {
    ...process.env,
    ...(isWin ? { 
      TERM: 'xterm-256color',
      PROMPT: '$P$G'
    } : { 
      PS1: '\\u@\\h:\\w\\$ ' 
    }),
  };
  
  ptyProcess = pty.spawn(shell, args, {
    name: isWin ? 'windows-terminal' : 'xterm-color',
    cwd: initialCwd,
    cols: 80,
    rows: 24,
    env,
  });
  
  console.log('PTY process spawned successfully');
  
  setTimeout(() => {
    console.log('Sending commands to force prompt display');
    if (isWin) {
      ptyProcess.write('echo .\r');
      
      setTimeout(() => {
        ptyProcess.write('cd\r');
      }, 200);
    } else {
      // For Unix systems
      ptyProcess.write('echo ""\r');
      setTimeout(() => {
        ptyProcess.write('pwd\r');
      }, 200);
    }
  }, 200);
  
  return {
    ptyWrite: (data: string) => {
      console.log(`Writing to PTY: ${data.replace(/\r/g, '\\r').replace(/\n/g, '\\n')}`);
      ptyProcess.write(data);
    },
    ptyOnData: (listener: (data: string) => void) => {
      console.log('Registering PTY data listener');
      ptyProcess.onData((data: string) => {
        console.log(`PTY data received: ${data.length} chars`);
        listener(data);
      });
    },
    resize: (cols: number, rows: number) => {
      console.log(`Resizing PTY to: ${cols}x${rows}`);
      ptyProcess.resize(cols, rows);
      window.webContents.send('pty-resized', { cols, rows });
    }
  };
};