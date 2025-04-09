
import React from "react";
import { EditorViewProps } from "./system/StateEngine";



 const EditorView = ({...props}:EditorViewProps)=>{
  const sampleCode=`// Content of ${props.activeFile}\n// Still working on editor.`
    return(
        <>
        
        <div className="flex-1 bg-gray-900 p-4 overflow-auto">
        { (props.activeFile!=='') ?(<pre className="text-gray-300">
            <code>
            {sampleCode}
            </code>
          </pre>):(<div className="text-gray-500">Select a file to view its content</div>)
          }
        </div>
        
      </>
    )
}



export default EditorView;