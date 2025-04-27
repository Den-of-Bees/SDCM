import { useEffect, useRef, useState } from 'react';
import { Terminal, ITerminalOptions } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

// Create a persistent terminal reference outside of the component
let globalTermRef: Terminal | null = null;
let globalFitRef: FitAddon | null = null;
let hasBeenInitialized = false;

const XTerm = ({className='', options={}, ...props}) => {
  const htmlRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentDir, setCurrentDir] = useState('');
  
  // Function to handle terminal resizing
  const fitTerminal = () => {
    if (globalFitRef && htmlRef.current) {
      console.log('Fitting terminal to container');
      const container = htmlRef.current as HTMLElement;
      if (container.clientHeight > 0 && container.clientWidth > 0) {
        globalFitRef.fit();
        setTimeout(() => globalFitRef?.fit(), 100);
      }
    }
  };

  useEffect(() => {
    if (!htmlRef.current) return;

    // Default options for Windows
    const defaultOptions: ITerminalOptions = {
      cursorBlink: true,
      fontFamily: 'Consolas, monospace',
      fontSize: 14,
      theme: {
        background: '#1e1e1e',
        foreground: '#f0f0f0',
        cursor: '#ffffff'
      },
      allowTransparency: false,
      scrollback: 1000
    };

    // Only create a new terminal if one doesn't exist
    if (!globalTermRef) {
      console.log('Creating new terminal instance');
      const term = new Terminal({...defaultOptions, ...options});
      const fit = new FitAddon();
      term.loadAddon(fit);
      
      globalTermRef = term;
      globalFitRef = fit;
      
      // Simple handler for input
      term.onData(data => {
        console.log(`Terminal input: ${data.replace(/\r/g, '\\r').replace(/\n/g, '\\n')}`);
        window.PTY.sendInput(data);
      });
    }

    // Check if we need to reconnect to the DOM
    if (globalTermRef && !hasBeenInitialized) {
      console.log('Opening terminal in container');
      globalTermRef.open(htmlRef.current);
      hasBeenInitialized = true;
    } else if (globalTermRef && hasBeenInitialized) {
      console.log('Reattaching existing terminal');
      // Remove from old parent if exists
      try {
        const oldParent = globalTermRef.element?.parentNode;
        if (oldParent && oldParent !== htmlRef.current) {
          oldParent.removeChild(globalTermRef.element);
          htmlRef.current.appendChild(globalTermRef.element);
        }
      } catch (err) {
        console.error('Error reattaching terminal:', err);
        // If reattaching fails, create a new terminal
        globalTermRef.dispose();
        globalTermRef = new Terminal({...defaultOptions, ...options});
        globalFitRef = new FitAddon();
        globalTermRef.loadAddon(globalFitRef);
        globalTermRef.open(htmlRef.current);
        
        // Reconnect input handler
        globalTermRef.onData(data => {
          window.PTY.sendInput(data);
        });
      }
    }
    
    fitTerminal();
    
    const unsubscribe = window.PTY.onOutput((data) => {
      if (globalTermRef) {
        globalTermRef.write(data);
      }
      
      const dirMatch = data.match(/([A-Z]:\\[^>\r\n]*?)>/);
      if (dirMatch && dirMatch[1]) {
        setCurrentDir(dirMatch[1]);
      }
      
      setIsConnected(true);
    });
    
    let resizeTimeout: NodeJS.Timeout | null = null;
    const handleResize = () => {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      resizeTimeout = setTimeout(fitTerminal, 100);
    };
    
    window.addEventListener('resize', handleResize);
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fitTerminal();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fitTerminal();
      }
    }, { threshold: 0.1 });
    
    if (htmlRef.current) {
      observer.observe(htmlRef.current);
    }
    
    // Cleanup
    return () => {
      if (unsubscribe) unsubscribe();
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (observer && htmlRef.current) {
        observer.unobserve(htmlRef.current);
      }
    };
  }, [options]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Directory display bar */}
      <div 
        style={{ 
          backgroundColor: '#333', 
          color: '#fff', 
          padding: '4px 8px', 
          fontSize: '12px',
          fontFamily: 'monospace',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}
      >
        📁 {currentDir || 'Unknown directory'}
      </div>
      
      {/* Terminal container */}
      <div
        ref={htmlRef}
        style={{ 
          width: '100%', 
          flex: 1, 
          position: 'relative',
          overflow: 'hidden'
        }}
        className={className + ' flex-1'}
      />
    </div>
  );
};

export default XTerm;