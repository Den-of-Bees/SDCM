import { FileText } from "lucide-react"
import { useMemo, useState } from "react"

// export interface actionType{
//   type: string;
//   index?: number
//   file?:FileNode[]
//   filename?:string
//  }

export type Action =
  | { type: 'file-change'; file: FileNode }
  | { type: 'load-files'; files: FileNode[] }
  | { type: 'open-file'; filename: string; filePath: string }
  | { type: 'close-file'; filename: string }
  | { type: 'set-active'; filePath: string }
  | { type: 'Sidebar-toggle' }
  | { type: 'siderbar-close' }
  | { type: 'siderbar-activity-check'; index: number };

  export const uiReducer = (uiState: typeof init_state, action: Action) => {
    switch (action.type) {
      case "Sidebar-toggle":
        return { ...uiState, sidebarCollapsed: !uiState.sidebarCollapsed }
  
      case "siderbar-close":
        return { ...uiState, sidebarCollapsed: true }
  
      case "file-change":
        action.file.isOpen = !action.file.isOpen
        return { ...uiState }
  
      case "load-files":
        return {
          ...uiState,
          files: action.files,
          tabs: [],
          activeFile: ''
        }
  
      case "close-file": {
        const t = uiState.tabs
        const index = t.findIndex(tab => tab.name === action.filename)
  
        if (uiState.activeFile === action.filename) {
          if (index === 0) {
            if (t.length === 1) {
              return { ...uiState, tabs: [], activeFile: '' }
            } else {
              uiState = { ...uiState, activeFile: t[1].name }
              return {
                ...uiState,
                tabs: t.filter(tab => tab.name !== action.filename)
              }
            }
          }
        }
  
        return {
          ...uiState,
          tabs: t.filter(tab => tab.name !== action.filename)
        }
      }
  
      case 'open-file':
        if (uiState.tabs.some(tab => tab.path === action.filePath)) {
          return { ...uiState, activeFile: action.filePath }
        }

        uiState.tabs.push({ name: action.filename, icon: <FileText size={16} />, path: action.filePath })
        return { ...uiState, activeFile: action.filePath }

      
  
      case 'set-active':
        return { ...uiState, activeFile: action.filePath }
        
  
      case "siderbar-activity-check":
        if (uiState.activityIcon === action.index)
          return { ...uiState, sidebarCollapsed: !uiState.sidebarCollapsed }
  
        return {
          ...uiState,
          activityIcon: action.index,
          sidebarCollapsed: uiState.sidebarCollapsed ? false : uiState.sidebarCollapsed
        }
  
      default:
        throw new Error("Unknown action: " + (action as any).type)
    }
  }
  

export const selectCollapsed = (state: typeof init_state) => ({ collasped: state.sidebarCollapsed })
export const selectActivity = (state: typeof init_state) => ({  activityIcon: state.activityIcon })
export const selectEditor = (state: typeof init_state) => ({  activeFile: state.activeFile })
export const selectFile = (state: typeof init_state) => ({  
                          files: state.files,
                          activeFile: state.activeFile
 })
 export const selectTab = (state: typeof init_state) => ({  
                          tabs: state.tabs,
                          activeFile: state.activeFile
 })

 export type Tabs = {
  name: string         
  icon: React.ReactNode
  path: string      
}[]

export interface FileNode {
  name: string
  isFolder: boolean
  children?: FileNode[]
  isOpen?: boolean
  path: string
}
export interface ActivityProps {
  activityIcon: number
  dispatch: React.Dispatch<Action>
}
export interface FilebarProps {
  files: FileNode[]
  activeFile:string
  dispatch: React.Dispatch<Action>
}
export interface FileTreeProps {
  files: FileNode[]
  level: number
  activeFile:string
  dispatch: React.Dispatch<Action>
}
export interface tabbarProps  {
  tabs:{
      name:string;
      icon:React.ReactNode;
      path: string
      }[];
  activeFile: string;
  dispatch: React.Dispatch<Action>
}
export interface EditorViewProps {
  activeFile: string
  content?: string
  dispatch: React.Dispatch<Action>
}

// /* Dummy data */
// export const init_tabs: Tabs = [
//   { name: "index.tsx", icon: <FileText size={16} /> },
//   { name: "App.tsx", icon: <FileText size={16} /> },
//   { name: "styles.css", icon: <FileText size={16} /> },
// ]

// export const init_files: FileNode[] = [
//   {
//     name: "src",
//     isFolder: true,
//     isOpen: true,
//     children: [
//       {
//         name: "components",
//         isFolder: true,
//         isOpen: false,
//         children: [
//           { name: "Header.tsx", isFolder: false },
//           { name: "Sidebar.tsx", isFolder: false },
//         ],
//       },
//       { name: "App.tsx", isFolder: false },
//       { name: "index.tsx", isFolder: false },
//       { name: "styles.css", isFolder: false },
//     ],
//   },
//   { name: "public", isFolder: true, isOpen: false, children: [{ name: "index.html", isFolder: false }] },
//   { name: "package.json", isFolder: false },
//   { name: "README.md", isFolder: false },
// ]

export const init_state = {
  files: [] as FileNode[],
  tabs: [] as Tabs,
  sidebarCollapsed: false,
  activeFile: '',
  activeTab: 0,
  activityIcon: 0,
}

export interface SessionData {
  lastOpenedPath?: string;
  outPutFilePath?: string;
  timestamp: number;
  platform: string;
}
