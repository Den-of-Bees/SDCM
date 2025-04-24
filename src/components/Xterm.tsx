import { useEffect, useRef, useState } from 'react';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';
import { XTermProps } from './test';

const XTerm = ({className='', options={}, ...props}) => {
  const htmlRef = useRef(null);
  const termRef = useRef<Terminal>(null);
  

  const [count, setCount] = useState(0)
  const doIt = ()=> {
    setCount(count+1);console.log(count)
    const term = termRef.current.writeln(`clicked ${count} times`)
    term
  }
  // const typing = (data)=>{termRef.current.write(data)}

  useEffect(()=>{
    
    const term = new Terminal();  
    term.open(htmlRef.current)
    term.onData((data)=>{window.PTY.sendInput(data)})
    window.PTY.onOutput((data:string)=>{term.write(data)})
    termRef.current=term
    return ()=> {term.dispose(); }
  },[])

  return <div onClick={doIt}className={className+'p-1'} ref={htmlRef} {...props}></div>;
}

export default XTerm