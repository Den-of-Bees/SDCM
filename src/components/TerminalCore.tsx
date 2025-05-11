import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { Terminal, ITerminalOptions } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

interface CoreProps {
  options?: ITerminalOptions;
  onData?: (data: string) => void;
  onOutput?: (cb: (data: string) => void) => () => void;
  className?: string;
}

export interface TerminalCoreHandle {
  write: (data: string) => void;
  clear: () => void;
}

const TerminalCore = forwardRef<TerminalCoreHandle, CoreProps>(({
  options = {},
  onData,
  onOutput,
  className = '',
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<Terminal | null>(null);
  const fitRef = useRef<FitAddon | null>(null);

  useImperativeHandle(ref, () => ({
    write: (data: string) => {
      termRef.current?.write(data);
    },
    clear: () => {
      termRef.current?.clear();
    }
  }), []);

  useEffect(() => {
    if (!containerRef.current) return;

    if (!termRef.current) {
      termRef.current = new Terminal(options);
      fitRef.current = new FitAddon();
      termRef.current.loadAddon(fitRef.current);
      if (onData) termRef.current.onData(onData);
    }

    termRef.current.open(containerRef.current);

    const doFit = () => fitRef.current?.fit();
    window.addEventListener('resize', doFit);
    setTimeout(doFit, 0);

    const unsubscribe = onOutput
      ? onOutput(data => termRef.current?.write(data))
      : () => {};

    return () => {
      window.removeEventListener('resize', doFit);
      unsubscribe();
    };
  }, [options, onData, onOutput]);

  return <div ref={containerRef} className={`relative w-full h-full ${className}`} />;
});

export default TerminalCore;