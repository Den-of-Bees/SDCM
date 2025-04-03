import React from 'react';
import { 
    FileText, Settings, Search, GitBranch, 
  } from 'lucide-react';
import { ActivityProps } from './system/StateEngine';
  
const Activity: React.FunctionComponent< ActivityProps> =
 ({activeSidebarIcon, setActiveSidebarIcon, sidebarCollapsed, setSidebarCollapsed}) => {
    const Activities = [
        { icon: FileText,
          action: () =>setSidebarCollapsed(!sidebarCollapsed),
        },
        { icon: Search,
          action: () => console.log("Search clicked"),
        },
        { icon: GitBranch,
          action: () => console.log("GitBranch clicked"),
        },
        { icon: Settings,
          action: () => console.log("Settings clicked"),
        },
      ];

    return (<div className="w-12 bg-gray-900 flex flex-col items-center py-2 border-r border-gray-800">
    { Activities.map(({icon:Icon, action}, index) => (
      <div 
        key={index}
        className={`p-2 mb-2 rounded hover:bg-gray-700 cursor-pointer 
            ${activeSidebarIcon === index ? 'bg-gray-700 text-white' : ''}`}
        onClick={() => {setActiveSidebarIcon(index); action()}}>
        <Icon size={24} />
      </div>
    ))}
  </div>)
}

 export default Activity