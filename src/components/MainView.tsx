import React, { useState } from 'react';
import Activity from './Activity';
import EditorView from './EditorView';
import Filebar from './Filebar';
import { FileNode, init_files, init_tabs, } from './system/StateEngine';

const MainView: React.FC = () => {
    const [tabs, setTabs] = useState(init_tabs)
    const [files, setFiles] = useState<FileNode[]>(init_files)
    const [activeFile, setActiveFile] = useState<string | null>(null);
    const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<number>(0);
    const [activeSidebarIcon, setActiveSidebarIcon] = useState<number>(0);

    

    return (
    <div className="flex h-screen bg-gray-900 text-gray-300 overflow-hidden">
      {/* Activity Bar */}
      {<Activity activeSidebarIcon={activeSidebarIcon} 
      setActiveSidebarIcon={setActiveSidebarIcon}
      setSidebarCollapsed={setSidebarCollapsed}
      sidebarCollapsed={sidebarCollapsed}/> }
      
      {/* Explorer Sidebar */}
      {!sidebarCollapsed && 
      (<Filebar files={files} 
      setSidebarCollapsed={setSidebarCollapsed} 
      setFiles={setFiles} 
      setActiveFile={setActiveFile}/>)}
      
      {/* Main Editor Area */}
      {<EditorView tabs={tabs} activeTab={activeTab} 
      setActiveTab={setActiveTab} />}
      
    </div>
  );
};

export default MainView;
