import React from 'react';
import { 
    FileText, Settings, Search, GitBranch, Cuboid
  } from 'lucide-react';
import { ActivityProps } from './system/StateEngine';
  
const Activity=
 React.memo(({ dispatch, ...props}:
  ActivityProps ) => {
    const Activities = [
        { icon: FileText,
          action: () => console.log("Files clicked"),
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
        { icon: Cuboid,
          action: () => console.log("Cuboid clicked"),

        }
      ];

    return (<div className="w-12 bg-gray-900 flex flex-col items-center py-2 border-r border-gray-800">
    { Activities.map(({icon:Icon, action}, index) => (
      <div 
        key={index}
        className={`p-2 mb-2 rounded hover:bg-gray-700 cursor-pointer 
            ${props.activityIcon === index ? 'bg-gray-700 text-white' : ''}`}
        onClick={
          () => {
            dispatch(
              {type:'siderbar-activity-check',
                index:index
              });
            action()          
        }}>
        <Icon size={24} />
      </div>
    ))}
  </div>)
})

 export default Activity