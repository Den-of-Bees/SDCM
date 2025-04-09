import React, { useState } from 'react';

const SuiActions = () => {
    const [output, setOutput] = useState<string>('No actions performed yet.');

    const handleBuild = async () => {
        try {
            const result = await window.suiClient.runSuiBuild();
            if (result.success) {
                setOutput(`Success: ${result.message}`);
            } else {
                setOutput(`Error: ${result.message}`);
            }
        } catch (error) {
            setOutput('Unexpected error: ' + error);
        }
    };

    return (
        <div className="w-64 bg-gray-800 flex flex-col border-r border-gray-700">
            <div className="p-3 uppercase text-xs font-bold border-b border-gray-700">
                SUI Actions
            </div>
            <div className="p-2">
                <button
                    onClick={handleBuild}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-2"
                >
                    Run SUI Build
                </button>
                <div className="text-sm bg-gray-700 p-2 rounded">
                    {output}
                </div>
            </div>
        </div>
    );
};

export default SuiActions;
