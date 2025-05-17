import React, { useState, useEffect, useRef } from 'react';
import { SessionData } from './system/StateEngine';
import { terminalEventEmitter } from './terminalEvents';
import OutputTerminal, { OutputTerminalHandle } from './OutputTerminal';

interface ActionState {
    isLoading: boolean;
    error: string | null;
    output: string;
}

const SuiActions = () => {
    console.log('SuiActions component mounted');
    const [actionState, setActionState] = useState<ActionState>({
        isLoading: false,
        error: null,
        output: 'No actions performed yet.'
    });
    const [session, setSession] = useState<SessionData | null>(null);
    const [currentDir, setCurrentDir] = useState<string>('');
    const [outputDir, setOutputDir] = useState<string>('');
    const terminalRef = useRef<OutputTerminalHandle>(null);

    let dataUnsub: (() => void) | null = null;
    let endUnsub: (() => void) | null = null;
    let errorUnsub: (() => void) | null = null;

    useEffect(() => {
        const loadSession = async () => {
            try {
                console.log('Loading session...');
                const sessionData = await window.sessionAPI.loadSession();
                setSession(sessionData);
                console.log('Session loaded:', sessionData);
            } catch (error) {
                console.error('Failed to load session', error);
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
            console.log('Session updated:', session);
            setCurrentDir(session.lastOpenedPath || '');
            setOutputDir(session.outputFilePath || '');
        }
    }, [session]);

    const updateOutput = (message: string, error: boolean = false) => {
        console.log('updateOutput:', message, 'isError:', error);
        setActionState(prev => ({
            ...prev,
            output: message,
            error: error ? message : null,
            isLoading: false
        }));
    };

    const validateDirectories = async () => {
        console.log('Validating directories. Current outputDir:', outputDir, 'currentDir:', currentDir);
        if (outputDir === '') {
            console.log('No outputDir, prompting user...');
            const selectedPath = await window.fileAPI.promptOpenDialog();
            if (!selectedPath) {
                console.log('No output directory selected by user.');
                updateOutput('No output directory selected.', true);
                return false;
            }
            setOutputDir(selectedPath);
            await window.sessionAPI.saveSession({ outputFilePath: selectedPath });
            console.log('Output directory set to:', selectedPath);
        }

        if (!currentDir) {
            console.log('No source directory selected.');
            updateOutput('No source directory selected.', true);
            return false;
        }

        console.log('Directories validated.');
        return true;
    };

    const handleBuild = async () => {
        setActionState(prev => ({ ...prev, isLoading: true }));
        try {
            console.log('Starting build process');  
            const valid = await validateDirectories();
            if (!valid) {
                console.log('Directory validation failed.');
                return;
            }

            if (terminalRef.current) {
                terminalRef.current.clear();
            }
            terminalEventEmitter.emit('\r\n--- Running SUI Build ---\r\n');
            window.SuiBuildStream.start(currentDir, outputDir);

            // Remove previous listeners if any
            if (dataUnsub) { console.log('Unsubscribing previous data listener'); dataUnsub(); }
            if (endUnsub) { console.log('Unsubscribing previous end listener'); endUnsub(); }
            if (errorUnsub) { console.log('Unsubscribing previous error listener'); errorUnsub(); }

            dataUnsub = window.SuiBuildStream.onData((data) => {
                console.log('Received build data:', data);
                // Try to parse as JSON
                let formatted = '';
                try {
                    const parsed = JSON.parse(data);
                    if (Array.isArray(parsed)) {
                        formatted = parsed.map(item =>
                            `[${item.level}] ${item.file}:${item.line}:${item.column} - ${item.msg}`
                        ).join('\r\n');
                    } else if (typeof parsed === 'object') {
                        formatted = JSON.stringify(parsed, null, 2);
                    }
                } catch {
                    // Not JSON, just use as-is
                    formatted = data;
                }
                terminalEventEmitter.emit(formatted + '\r\n');
            });

            endUnsub = window.SuiBuildStream.onEnd((code) => {
                console.log('Build process ended with code:', code);
                terminalEventEmitter.emit(`\r\nBuild process exited with code ${code}\r\n`);
                setActionState(prev => ({ ...prev, isLoading: false }));
            });

            errorUnsub = window.SuiBuildStream.onError((err) => {
                console.error('Build process error:', err);
                terminalEventEmitter.emit(`\r\nError: ${err}\r\n`);
                setActionState(prev => ({ ...prev, isLoading: false, error: err }));
            });

        } catch (error) {
            console.error('Unexpected error in handleBuild:', error);
            setActionState(prev => ({
                ...prev,
                error: `Unexpected error: ${error}`,
                isLoading: false
            }));
        }
    };

    const handleDeploy = async () => {
        setActionState(prev => ({ ...prev, isLoading: true }));
        try {
            if (!await validateDirectories()) return;

            if (terminalRef.current) {
                terminalRef.current.clear();
            }
            terminalEventEmitter.emit('\r\n--- Running SUI Deploy ---\r\n');

            // Remove previous listeners if any
            if (dataUnsub) { dataUnsub(); }
            if (endUnsub) { endUnsub(); }
            if (errorUnsub) { errorUnsub(); }

            dataUnsub = window.SuiDeployStream.onData((data) => {
                let formatted = '';
                try {
                    const parsed = JSON.parse(data);
                    if (Array.isArray(parsed)) {
                        formatted = parsed.map(item =>
                            `[${item.level}] ${item.file}:${item.line}:${item.column} - ${item.msg}`
                        ).join('\r\n');
                    } else if (typeof parsed === 'object') {
                        formatted = JSON.stringify(parsed, null, 2);
                    }
                } catch {
                    formatted = data;
                }
                terminalEventEmitter.emit(formatted + '\r\n');
            });

            endUnsub = window.SuiDeployStream.onEnd((code) => {
                terminalEventEmitter.emit(`\r\nDeploy process exited with code ${code}\r\n`);
                setActionState(prev => ({ ...prev, isLoading: false }));
            });

            errorUnsub = window.SuiDeployStream.onError((err) => {
                terminalEventEmitter.emit(`\r\nError: ${err}\r\n`);
                setActionState(prev => ({ ...prev, isLoading: false, error: err }));
            });

            window.SuiDeployStream.start(currentDir, outputDir);
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