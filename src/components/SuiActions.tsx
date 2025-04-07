// src/components/SuiActions.tsx
import React, { useState } from 'react';
import { runSuiBuild } from '../scripts/build';

const SuiActions = () => {
    const [output, setOutput] = useState<string>('No actions performed yet.');

    return (
        <div className="w-64 bg-gray-800 flex flex-col border-r border-gray-700">
            <div className="p-3 uppercase text-xs font-bold border-b border-gray-700 flex justify-between items-center">
                SUI Actions
            </div>
            <div className="p-2">
                <div className="text-sm bg-gray-700 p-2 rounded">
                    {output}
                </div>
            </div>
        </div>
    );
};

export default SuiActions;
