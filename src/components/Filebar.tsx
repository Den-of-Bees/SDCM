
import React from 'react';

import { ChevronDown, ChevronRight, FileText, Folder, ChevronLeft  } from 'lucide-react';
import { FilebarProps, FileNode, FileTreeProps } from './system/StateEngine';

const FileTree  = ({ files, level, all, setFiles, setActiveFile}:FileTreeProps) => {
    
    const toggleFolder = (file: FileNode) => {
        if (!file.isFolder) return;
        file.isOpen = !file.isOpen;
        setFiles([...all]);
    };

return (
    <div style={{ paddingLeft: level > 0 ? '16px' : '0' }}>
    {files.map((file, index) => (
        <div key={index}>
        <div className="flex items-center py-1 hover:bg-gray-700 rounded cursor-pointer text-sm" 
          onClick={() => file.isFolder ? toggleFolder(file) : setActiveFile(file.name)}>
          {file.isFolder ? (
          <>
            {file.isOpen ? <ChevronDown size={16} className="mr-1" /> : <ChevronRight size={16} className="mr-1" />}
            <Folder size={16} className="mr-2 text-blue-400" />
          </>
          ) : (
            <FileText size={16} className="mr-2 ml-4 text-gray-400" />
          )}
          <span>{file.name}</span>
        </div>
        { file.isFolder && file.isOpen && file.children && 
            <FileTree files={file.children} all={files} level={level + 1} setFiles={setFiles} setActiveFile={setActiveFile}/>}
        </div>
    ))}
    </div>
);
};
  
  
const  Filebar  =({files, setSidebarCollapsed, setFiles, setActiveFile}:FilebarProps)=>{
   return( <div className="w-64 bg-gray-800 flex flex-col border-r border-gray-700">
            <div className="p-3 uppercase text-xs font-bold border-b border-gray-700 flex justify-between items-center">
              Explorer
              <button onClick={() => setSidebarCollapsed(true)} className="p-1 hover:bg-gray-700 rounded">
                  <ChevronLeft size={16} />
              </button>
            </div>
            <div className="p-2">            
              <FileTree files={files} all={files} level={0} setFiles={setFiles} setActiveFile={setActiveFile}/>
            </div>
        </div>
    )
}
export default Filebar;