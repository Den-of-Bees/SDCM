import { GitBranch } from "lucide-react";
import React from "react";
type typeProps = {
    tabs:{
        name:string;
        icon:React.ReactNode;
        }[];
        activeTab: number;
    setActiveTab: React.Dispatch<React.SetStateAction<number>>;
}


 const EditorView = ({tabs, activeTab,setActiveTab}: typeProps)=>{
    return(
        <div className="flex-1 flex flex-col">
        <div className="bg-gray-800 flex border-b border-gray-700">
          {tabs.map((tab, index) => (
            <div 
              key={index}
              className={`px-3 py-2 flex items-center border-r border-gray-700 cursor-pointer 
                ${activeTab === index ? 'bg-gray-900' : 'bg-gray-800 hover:bg-gray-700'}`}
              onClick={() => setActiveTab(index)}
            >
              {tab.icon}
              <span className="ml-2">{tab.name}</span>
              <span className="ml-2 text-gray-500 hover:text-white">×</span>
            </div>
          ))}
        </div>
        <div className="flex-1 bg-gray-900 p-4 overflow-auto">
          <pre className="text-gray-300"><code>{sampleCode}</code></pre>
        </div>
        <div className="bg-blue-900 text-gray-300 px-4 py-1 flex justify-between">
          <div className="flex items-center text-sm">
            <GitBranch size={14} className="mr-2" />
            <span>main</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="mr-4">Ln 1, Col 1</span>
            <span className="mr-4">Spaces: 2</span>
            <span>UTF-8</span>
          </div>
        </div>
      </div>
    )
}

const sampleCode = `// This is a sample React component
import React from 'react';

const App = () => {
  return (
    <div className="app">
      <header className="app-header">
        <h1>SUI Hackaton</h1>
      </header>
      <main>
        <p>Welcome the SUI Editor experience!</p>
      </main>
    </div>
  );
};

export default App;`;

export default EditorView;