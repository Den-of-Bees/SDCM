import React from 'react';
import XTerm from './Xterm';

const StatusView = () => {
    return (
        <div className="h-64 text-white p-2 border-t border-gray-700 overflow-auto">
            <XTerm/>
        </div>
    );
};

export default StatusView;
