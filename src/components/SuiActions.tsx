import React, { useState, useEffect } from 'react';
import { SessionData } from './system/StateEngine';

interface ActionState {
    isLoading: boolean;
    error: string | null;
    output: string;
}

const SuiActions = () => {
    const [actionState, setActionState] = useState<ActionState>({
        isLoading: false,
        error: null,
        output: 'No actions performed yet.'
    });
    const [session, setSession] = useState<SessionData | null>(null);
    const [currentDir, setCurrentDir] = useState<string>('');
    const [outputDir, setOutputDir] = useState<string>('');

    useEffect(() => {
        const loadSession = async () => {
            try {
                const sessionData = await window.sessionAPI.loadSession();
                setSession(sessionData);
            } catch (error) {
                setActionState(prev => ({
                    ...prev,
                    error: 'Failed to load session'
                }));
            }
        };
        loadSession();
    }, []);

    useEffect(() => {
        if (session) {
            setCurrentDir(session.lastOpenedPath || '');
            setOutputDir(session.outputFilePath || '');
        }
    }, [session]);

    const updateOutput = (message: string, error: boolean = false) => {
        setActionState(prev => ({
            ...prev,
            output: message,
            error: error ? message : null,
            isLoading: false
        }));
    };

    const validateDirectories = async () => {
        if (outputDir === '') {
            const selectedPath = await window.fileAPI.promptOpenDialog();
            if (!selectedPath) {
                updateOutput('No output directory selected.', true);
                return false;
            }
            setOutputDir(selectedPath);
            await window.sessionAPI.saveSession({ outputFilePath: selectedPath });
        }

        if (!currentDir) {
            updateOutput('No source directory selected.', true);
            return false;
        }

        return true;
    };

    const handleBuild = async () => {
        setActionState(prev => ({ ...prev, isLoading: true }));
        try {
            if (!await validateDirectories()) return;

            const result = await window.suiClient.runSuiBuild(currentDir, outputDir);
            if (result.success) {
                updateOutput(`Build successful: ${result.message}`);
            } else {
                updateOutput(`Build failed: ${result.message}`, true);
            }
        } catch (error) {
            updateOutput(`Unexpected error: ${error}`, true);
        }
    };

    const handleDeploy = async () => {
        setActionState(prev => ({ ...prev, isLoading: true }));
        try {
            if (!await validateDirectories()) return;

            const result = await window.suiClient.runSuiDeploy(currentDir, outputDir);
            if (result.success) {
                updateOutput(`Deploy successful: ${result.message}`);
            } else {
                updateOutput(`Deploy failed: ${result.message}`, true);
            }
        } catch (error) {
            updateOutput(`Unexpected error: ${error}`, true);
        }
    };

    return (
        <div className="w-64 bg-gray-800 flex flex-col border-r border-gray-700">
            <div className="p-3 uppercase text-xs font-bold border-b border-gray-700">
                SUI Actions
            </div>
            <div className="p-2 space-y-2">
                <button
                    onClick={handleBuild}
                    disabled={actionState.isLoading}
                    className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-bold 
                        py-2 px-4 rounded ${actionState.isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {actionState.isLoading ? 'Building...' : 'Run SUI Build'}
                </button>
                <button
                    onClick={handleDeploy}
                    disabled={actionState.isLoading}
                    className={`w-full bg-green-500 hover:bg-green-600 text-white font-bold 
                        py-2 px-4 rounded ${actionState.isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {actionState.isLoading ? 'Deploying...' : 'Run SUI Deploy'}
                </button>
                <div className={`text-sm p-2 rounded ${actionState.error 
                    ? 'bg-red-900/50' 
                    : 'bg-gray-700'}`}>
                    {actionState.output}
                </div>
            </div>
        </div>
    );
};

export default SuiActions;