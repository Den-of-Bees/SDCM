import React, { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react';
import TerminalCore, { TerminalCoreHandle } from './TerminalCore';
import { ITerminalOptions } from 'xterm';
import { terminalEventEmitter } from './terminalEvents';
import { ResizableBox, ResizableBoxProps } from 'react-resizable';
import 'react-resizable/css/styles.css';

export interface OutputTerminalProps {
  className?: string;
  options?: ITerminalOptions;
}

export interface OutputTerminalHandle {
  clear: () => void;
}

const OutputTerminal = forwardRef<OutputTerminalHandle, OutputTerminalProps>(({ className = '', options = {} }, ref) => {
  const termRef = useRef<TerminalCoreHandle>(null);
  const [expanded, setExpanded] = useState(false);
  const [height, setHeight] = useState(200);

  useImperativeHandle(ref, () => ({
    clear: () => termRef.current?.clear(),
  }));

  useEffect(() => {
    // Subscribe to terminal events
    const unsubscribe = terminalEventEmitter.subscribe((data) => {
      if (termRef.current) {
        termRef.current.write(data);
      }
    });
    return unsubscribe;
  }, []);

  const handleClear = () => {
    termRef.current?.clear();
  };

  const handleExpand = () => setExpanded((prev) => !prev);

  // VSCode-like colors
  const headerStyle =
    'flex items-center justify-between px-3 py-1 bg-[#1e1e1e] border-b border-[#333] text-xs text-gray-300 font-mono select-none';
  const buttonStyle =
    'ml-2 px-2 py-1 rounded hover:bg-[#333] transition-colors text-gray-400 hover:text-white focus:outline-none';

  return (
    <div
      className={`flex flex-col bg-[#1e1e1e] border-t border-[#333] shadow-lg ${className}`}
      style={{
        borderRadius: expanded ? '8px 8px 0 0' : '8px',
        overflow: 'hidden',
        minHeight: expanded ? 300 : 180,
        maxHeight: expanded ? 600 : 300,
        transition: 'max-height 0.2s, min-height 0.2s',
      }}
    >
      {/* Header Bar */}
      <div className={headerStyle}>
        <div className="flex items-center">
          <button className={buttonStyle} onClick={handleClear} title="Clear Terminal">
            🧹
          </button>
          <button className={buttonStyle} onClick={handleExpand} title={expanded ? 'Collapse' : 'Expand'}>
            {expanded ? '🡣' : '🡡'}
          </button>
        </div>
      </div>
      {/* Resizable Terminal */}
      
        <div className="flex-1 w-full h-full" style={{ background: '#1e1e1e' }}>
          <TerminalCore
            ref={termRef}
            className="w-full h-full"
            options={{
              theme: {
                background: '#1e1e1e',
                foreground: '#d4d4d4',
                cursor: '#d4d4d4',
                selection: '#264f78',
                black: '#000000',
                red: '#cd3131',
                green: '#0dbc79',
                yellow: '#e5e510',
                blue: '#2472c8',
                magenta: '#bc3fbc',
                cyan: '#11a8cd',
                white: '#e5e5e5',
                brightBlack: '#666666',
                brightRed: '#f14c4c',
                brightGreen: '#23d18b',
                brightYellow: '#f5f543',
                brightBlue: '#3b8eea',
                brightMagenta: '#d670d6',
                brightCyan: '#29b8db',
                brightWhite: '#e5e5e5',
              },
              fontFamily: 'Fira Mono, monospace',
              fontSize: 14,
              ...options,
            }}
          />
        </div>
    </div>
  );
});

export default OutputTerminal;