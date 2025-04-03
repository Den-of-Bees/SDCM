import { FileText } from "lucide-react";

export type Tabs = {
  name: string;
  icon: React.ReactNode;
}[];

export interface FileNode {
  name: string;
  isFolder: boolean;
  children?: FileNode[];
  isOpen?: boolean;
}
export interface ActivityProps  {
  activeSidebarIcon: number;
  sidebarCollapsed: boolean;
  setActiveSidebarIcon: React.Dispatch<React.SetStateAction<number>>;
  setSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface FilebarProps  {
  files: FileNode[];
  setSidebarCollapsed:React.Dispatch<React.SetStateAction<boolean>>;
  setFiles:React.Dispatch<React.SetStateAction<FileNode[]>>;
  setActiveFile:React.Dispatch<React.SetStateAction<string>>;
}
export interface FileTreeProps {
  files: FileNode[];
  all?: FileNode[];
  level: number;
  setFiles:React.Dispatch<React.SetStateAction<FileNode[]>>;
  setActiveFile:React.Dispatch<React.SetStateAction<string>>;

  
}

/* Dummy data */ 
export const init_tabs:Tabs = [
    { name: 'index.js', icon: <FileText size={16} /> },
    { name: 'App.jsx', icon: <FileText size={16} /> },
    { name: 'styles.css', icon: <FileText size={16} /> }
  ];

  export const init_files: FileNode[] = [
    { name: 'src', isFolder: true, isOpen: true, children: [
      { name: 'components', isFolder: true, isOpen: false, children: [
        { name: 'Header.tsx', isFolder: false },
        { name: 'Sidebar.tsx', isFolder: false }
      ]},
      { name: 'App.tsx', isFolder: false },
      { name: 'index.tsx', isFolder: false },
      { name: 'styles.css', isFolder: false }
    ]},
    { name: 'public', isFolder: true, isOpen: false, children: [
      { name: 'index.html', isFolder: false }
    ]},
    { name: 'package.json', isFolder: false },
    { name: 'README.md', isFolder: false }
  ];
