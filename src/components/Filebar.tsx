import React from "react"

import { ChevronDown, ChevronRight, FileText, Folder, ChevronLeft } from "lucide-react"
import { FilebarProps, FileTreeProps } from "./system/StateEngine"

const FileTree = ({ files, level, activeFile, dispatch  }: FileTreeProps) => {

  return (
    <div style={{ paddingLeft: level > 0 ? "16px" : "0" }}>
      {files.map((file, index) => (
        <div key={index}>
          <div
            className={`flex items-center py-1 hover:bg-gray-700 rounded cursor-pointer text-sm
              ${activeFile===file.name?'bg-gray-700':''}`}
            onClick={() =>
              file.isFolder ? dispatch({type:'file-change', file:file}) :
              dispatch({ type: 'open-file', filename: file.name, filePath: file.path })

            }
            >
            {file.isFolder ? (
              <>
                {file.isOpen ? (
                  <ChevronDown size={16} className="mr-1" />
                ) : (
                  <ChevronRight size={16} className="mr-1" />
                )}
                <Folder size={16} className="mr-2 text-blue-400" />
              </>
            ) : (
              <FileText size={16} className="mr-2 ml-4 text-gray-400" />
            )}
            <span>{file.name}</span>
          </div>
          {file.isFolder && file.isOpen && file.children && (
            <FileTree
              files={file.children}
              level={level + 1}
              activeFile={activeFile}
              dispatch={dispatch}
            />
          )}
        </div>
      ))}
    </div>
  )
}

const Filebar = ({ dispatch, ...props }: FilebarProps) => {
  return (
    <div className="w-64 bg-gray-800 flex flex-col border-r border-gray-700 h-full">
      <div className="p-3 uppercase text-xs font-bold border-b border-gray-700 flex 
        justify-between items-center shrink-0">
        Explorer
        <button
          onClick={() => dispatch({ type: "siderbar-close" })}
          className="p-1 hover:bg-gray-600 rounded"
        >
          <ChevronLeft size={16} />
        </button>
      </div>
      <div className="p-2 overflow-y-auto flex-1 no-scrollbar">

        <FileTree {...props} dispatch={dispatch} level={0} />
      </div>
    </div>
  )
}
export default Filebar
