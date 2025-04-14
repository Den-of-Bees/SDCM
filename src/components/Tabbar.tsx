import { tabbarProps } from "./system/StateEngine"


export const Tabbar = ({tabs, activeFile, dispatch}: tabbarProps)=>{
  return (
    <div className="bg-gray-800 flex border-b border-gray-700">
          {tabs.map((tab, index) => (
            <div 
              key={index}
              className={`px-3 py-2 flex items-center border-r border-gray-700 cursor-pointer 
                ${tab.name === activeFile ? 'bg-gray-900' : 'bg-gray-800 hover:bg-gray-700'}`}
              onClick={() => dispatch({type:'set-active', filePath:tab.path})}
            >
              {tab.icon}
              <span className="ml-2">{tab.name}</span>
              <span className="ml-2 text-gray-500 hover:text-white"
                onClick={(e)=>{e.stopPropagation();dispatch({type:'close-file',filename:tab.name})}}
              >×</span>
            </div>
          ))}
        </div>
  )
}