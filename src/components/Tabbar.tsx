type typeProps = {
  tabs:{
      name:string;
      icon:React.ReactNode;
      }[];
      activeTab: number;
  setActiveTab: React.Dispatch<React.SetStateAction<number>>;
}

export const Tabbar = ({tabs, activeTab,setActiveTab}: typeProps)=>{
  return (
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
  )
}