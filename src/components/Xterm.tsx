import React, { useEffect, useRef, useState } from 'react';
import { Terminal, ITerminalOptions } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

// Global single-instance + cwd cache
let globalTerminal: Terminal | null = null;
let globalFit: FitAddon | null = null;
let initialized = false;
let cachedCwd = '';

export interface XTermProps {
  showDirectoryBar?: boolean;
  className?: string;
  options?: ITerminalOptions;
}

const XTerm: React.FC<XTermProps> = ({
  showDirectoryBar = true,
  className = '',
  options = {},
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cwd, setCwd] = useState<string>(() => cachedCwd);

  // fit helper
  const fitTerm = () => {
    if (globalFit && containerRef.current) {
      globalFit.fit();
      setTimeout(() => globalFit?.fit(), 50);
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const defaults: ITerminalOptions = {
      cursorBlink: true,
      fontFamily: 'Consolas, monospace',
      fontSize: 14,
      theme: { background: '#1e1e1e', foreground: '#f0f0f0', cursor: '#ffffff' },
      scrollback: 1000,
      allowTransparency: false,
    };

    // init terminal
    if (!globalTerminal) {
      globalTerminal = new Terminal({ ...defaults, ...options });
      globalFit = new FitAddon();
      globalTerminal.loadAddon(globalFit);
      globalTerminal.onData(d => window.PTY.sendInput(d));
    }

    // mount or reattach
    if (!initialized) {
      globalTerminal.open(containerRef.current);
      initialized = true;
      // force initial prompt
      window.PTY.sendInput('\r');
    } else {
      const el = globalTerminal.element;
      if (el && el.parentElement !== containerRef.current) {
        el.parentElement?.removeChild(el);
        containerRef.current.appendChild(el);
      }
    }

    fitTerm();
    window.addEventListener('resize', fitTerm);

    const unsub = window.PTY.onOutput((data: string) => {
      globalTerminal?.write(data);
      const m = data.match(/([A-Z]:\\[^>\r\n]*?)>/);
      if (m?.[1]) {
        setCwd(m[1]);
        cachedCwd = m[1];
      }
    });

    return () => {
      window.removeEventListener('resize', fitTerm);
      unsub();
    };
  }, [options]);

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div ref={containerRef} className="flex-1 relative overflow-hidden" />
    </div>
  );
};

export default XTerm;