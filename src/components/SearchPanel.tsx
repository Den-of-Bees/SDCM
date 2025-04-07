import React from 'react';

const SearchPanel = () => {
    return (
        <div className="w-64 bg-gray-800 flex flex-col border-r border-gray-700">
            <div className="p-3 uppercase text-xs font-bold border-b border-gray-700 flex justify-between items-center">
                Search
            </div>
            <div className="p-2">
                <input type="text" placeholder="Search..." className="w-full p-2 bg-gray-700 rounded text-white focus:outline-none" />
            </div>
        </div>
    );
};

export default SearchPanel;
