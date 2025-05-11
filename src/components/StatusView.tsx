import React, { useState } from 'react';
import XTerm from './Xterm';
import OutputTerminal from './OutputTerminal';

const tabs = ['OUTPUT', 'TERMINAL'] as const;
type TabKey = typeof tabs[number];

const StatusView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('TERMINAL');

  return (
    <div className="flex flex-col h-64 border-t border-gray-700 bg-gray-900 overflow-hidden">
      {/* Tab bar */}
      <div className="flex bg-gray-800 text-gray-400 text-xs font-medium">
        {tabs.map(key => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-3 py-1 -mb-px border-b-2 focus:outline-none ${
              activeTab === key ? 'border-white text-white' : 'border-transparent hover:text-white'
            }`}
          >
            {key}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'TERMINAL' && <XTerm className="h-full" />}
        {activeTab === 'OUTPUT' && <OutputTerminal className="h-full" />}  
        {activeTab !== 'TERMINAL' && activeTab !== 'OUTPUT' && (
          <div className="h-full flex items-center justify-center text-gray-500 text-sm">
            {activeTab}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusView;