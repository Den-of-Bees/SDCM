import { FileText } from "lucide-react"
import { useMemo, useState } from "react"

// export interface actionType{
//   type: string;
//   index?: number
//   file?:FileNode[]
//   filename?:string
//  }

export const uiReducer = (uiState: typeof init_state, action: { 
  type: string;
  index?: number
  file?:FileNode
  filename?:string
 }) => {
  switch (action.type) {
    case "Sidebar-toggle":
      return { ...uiState, sidebarCollapsed: !uiState.sidebarCollapsed }
      
    case "siderbar-close":
      return { ...uiState, sidebarCollapsed: true }
    
    case "file-change":
      action.file.isOpen = !action.file.isOpen
      return { ...uiState }
    
    case "close-file":{
      const t= uiState.tabs
      const index = t.findIndex(tab=>tab.name ===action.filename)
      
       if(uiState.activeFile === action.filename){
        if (index ==0){
          if(t.length == 1){
            return{ ...uiState, tabs: [], activeFile: '' }}
          else{
            uiState = {...uiState, activeFile: t[1].name}
            return { ...uiState, 
              tabs: t.filter(tab=>tab.name !==action.filename)}
          }
        }
      }
          
      return { ...uiState,
        tabs: t.filter(tab=>tab.name !==action.filename), }
    }
    
    case 'open-file':
      if(uiState.tabs.some(tab=>tab.name === action.filename))
        return { ...uiState, activeFile: action.filename }

      uiState.tabs.push( { name: action.filename, icon: <FileText size={16} /> })
      uiState = {...uiState  }

      // eslint-disable-next-line no-fallthrough
    case "set-active":
      return { ...uiState, activeFile: action.filename }

    case "siderbar-activity-check":
      if (uiState.activityIcon === action.index) 
        uiState = { ...uiState, sidebarCollapsed: !uiState.sidebarCollapsed }
      else {
        uiState = { ...uiState, activityIcon: action.index }
        if (uiState.sidebarCollapsed) 
          return { ...uiState, sidebarCollapsed: !uiState.sidebarCollapsed }
      }
      return uiState
      
    default:
      throw Error("Unknown action: " + action.type)
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
  
}[]

export interface FileNode {
  name: string
  isFolder: boolean
  children?: FileNode[]
  isOpen?: boolean
}
export interface ActivityProps {
  activityIcon: number
  dispatch: React.ActionDispatch<[action: { type: string }]>
}
export interface FilebarProps {
  files: FileNode[]
  activeFile:string
  dispatch: React.ActionDispatch<[action: { type: string }]>
}
export interface FileTreeProps {
  files: FileNode[]
  level: number
  activeFile:string
  dispatch: React.ActionDispatch<[action: { type: string }]>
}
export interface tabbarProps  {
  tabs:{
      name:string;
      icon:React.ReactNode;
      }[];
  activeFile: string;
  dispatch: React.ActionDispatch<[action: { type: string }]>
}
export interface EditorViewProps {
  activeFile:string
  content?:string
  dispatch: React.ActionDispatch<[action: { type: string }]>
}
/* Dummy data */
export const init_tabs: Tabs = [
  { name: "index.tsx", icon: <FileText size={16} /> },
  { name: "App.tsx", icon: <FileText size={16} /> },
  { name: "styles.css", icon: <FileText size={16} /> },
]

export const init_files: FileNode[] = [
  {
    name: "src",
    isFolder: true,
    isOpen: true,
    children: [
      {
        name: "components",
        isFolder: true,
        isOpen: false,
        children: [
          { name: "Header.tsx", isFolder: false },
          { name: "Sidebar.tsx", isFolder: false },
        ],
      },
      { name: "App.tsx", isFolder: false },
      { name: "index.tsx", isFolder: false },
      { name: "styles.css", isFolder: false },
    ],
  },
  { name: "public", isFolder: true, isOpen: false, children: [{ name: "index.html", isFolder: false }] },
  { name: "package.json", isFolder: false },
  { name: "README.md", isFolder: false },
]

export const init_state = {
  files: init_files,
  tabs: init_tabs,
  sidebarCollapsed: false,
  activeFile: 'index.tsx',
  activeTab: 0,
  activityIcon: 0,
}
