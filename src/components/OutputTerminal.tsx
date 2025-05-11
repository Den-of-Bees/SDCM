import React, { useEffect, useRef } from 'react';
import TerminalCore from './TerminalCore';
import { ITerminalOptions } from 'xterm';
import { terminalEventEmitter } from './terminalEvents';

export interface OutputTerminalProps {
  className?: string;
  options?: ITerminalOptions;
}

const OutputTerminal: React.FC<OutputTerminalProps> = ({
  className = '',
  options = {},
}) => {
  const termRef = useRef<any>(null);

  useEffect(() => {
    // Subscribe to terminal events
    const unsubscribe = terminalEventEmitter.subscribe((data) => {
      if (termRef.current) {
        termRef.current.write(data);
      }
    });
    return unsubscribe;
  }, []);

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <TerminalCore
        ref={termRef}
        className="flex-1 overflow-hidden"
        options={options}
      />
    </div>
  );
};

export default OutputTerminal;