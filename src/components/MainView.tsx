import React from 'react';
import Activity from './Activity';
import EditorView from './EditorView';
import Filebar from './Filebar';
import { useStateEngine } from './system/StateEngine';
import { Panel } from './Panel';
import { Tabbar } from './Tabbar';
import { Statusbar } from './Statusbar';
import SearchPanel from './SearchPanel';
import GitPanel from './GitPanel';
import SettingsPanel from './SettingsPanel';
import SuiActions from './SuiActions';

const MainView: React.FC = () => {
  const {tabs, files, setFiles, activeFile, setActiveFile, sidebarCollapsed, setSidebarCollapsed, activeSidebarIcon, setActiveSidebarIcon, activeTab, setActiveTab} = useStateEngine();

  const renderActivePanel = () => {
    switch (activeSidebarIcon) {
      case 0: return <Filebar files={files} setSidebarCollapsed={setSidebarCollapsed} setFiles={setFiles} setActiveFile={setActiveFile} />;
      case 1: return <SearchPanel />;
      case 2: return <GitPanel />;
      case 3: return <SettingsPanel />;
      case 4: return <SuiActions />;
      default: return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-300 overflow-hidden">
      <Activity activeSidebarIcon={activeSidebarIcon} setActiveSidebarIcon={setActiveSidebarIcon} setSidebarCollapsed={setSidebarCollapsed} sidebarCollapsed={sidebarCollapsed} />
      {!sidebarCollapsed && renderActivePanel()}
      <Panel>
        <Tabbar tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
        <EditorView />
        <Statusbar />
      </Panel>
    </div>
  );
};

export default MainView;
