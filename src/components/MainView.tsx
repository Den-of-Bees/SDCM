import React, { useEffect } from 'react';
import Activity from './Activity';
import EditorView from './EditorView';
import Filebar from './Filebar';
import { useStateEngine, } from './system/StateEngine';
import { Panel } from './Panel';
import { Tabbar } from './Tabbar';
import { Statusbar } from './Statusbar';

const MainView: React.FC = () => {
  const {tabs,
    files, setFiles,
    activeFile, setActiveFile,
    sidebarCollapsed, setSidebarCollapsed,
    activeSidebarIcon, setActiveSidebarIcon,
    activeTab, setActiveTab
  } = useStateEngine()
  useEffect(()=>{window.fileAPI.onMessage((msg)=>alert(msg))},[])
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
      {
        <Panel>
          <Tabbar tabs={tabs} activeTab={activeTab} 
          setActiveTab={setActiveTab} />
          <EditorView />
          <Statusbar/>
        </Panel>}
      
    </div>
  );
};

export default MainView;
