import { writeFileSync, existsSync, unlinkSync } from "fs";
import { join } from "path";
import { SuiObjectChange, SuiTransactionBlockResponse } from "@mysten/sui/client";
import { spawn } from "child_process";
import { terminalEventEmitter } from '../components/terminalEvents';

interface DeployOptions {
    moveDir: string;
    outputDir: string;
    onData?: (data: string) => void;
}

export async function runSuiDeploy({ moveDir, outputDir, onData }: DeployOptions) {
    // Delete Move.lock if it exists
    const moveLockPath = join(moveDir, 'Move.lock');
    if (existsSync(moveLockPath)) {
        try {
            unlinkSync(moveLockPath);
            if (onData) onData('Deleted Move.lock before deploy.\r\n');
            else terminalEventEmitter.emit('Deleted Move.lock before deploy.\r\n');
        } catch (err) {
            if (onData) onData('Failed to delete Move.lock: ' + err + '\r\n');
            else terminalEventEmitter.emit('Failed to delete Move.lock: ' + err + '\r\n');
        }
    }
    if (onData) onData('\r\n--- Running SUI Deploy ---\r\n');
    else terminalEventEmitter.emit('\r\n--- Running SUI Deploy ---\r\n');

    return new Promise((resolve) => {
        const child = spawn('sui', [
            'client',
            'publish',
            moveDir,
            '--json',
            '--silence-warnings'
        ], { shell: true });

        let stdout = '';
        let stderr = '';

        child.stdout.on('data', (data) => {
            const str = data.toString();
            stdout += str;
            if (onData) onData(str);
        });

        child.stderr.on('data', (data) => {
            const str = data.toString();
            stderr += str;
            if (onData) onData(str);
        });

        child.on('close', (code) => {
            if (stdout && stdout.includes('{')) {
                try {
                    const { objectChanges } = JSON.parse(stdout) as SuiTransactionBlockResponse;
                    if (objectChanges) {
                        const publishedObj = objectChanges.find(
                            obj => obj.type === "published"
                        ) as Extract<SuiObjectChange, { type: "published" }>;
                        if (publishedObj && publishedObj.type === "published") {
                            const { packageId, modules } = publishedObj;
                            const deploymentInfo = JSON.stringify({ packageId, modules }, null, 2);
                            writeFileSync(join(outputDir, 'deployed_objects.json'), deploymentInfo);
                            if (onData) onData(deploymentInfo + '\r\n');
                            else terminalEventEmitter.emit(deploymentInfo + '\r\n');
                            resolve({
                                success: true,
                                message: 'Successfully deployed and saved to deployed_objects.json',
                                packageId,
                                modules,
                                warnings: stderr
                            });
                            return;
                        }
                    }
                } catch (parseError) {
                    if (onData) onData('Error parsing deploy output as JSON.\r\n');
                    else terminalEventEmitter.emit('Error parsing deploy output as JSON.\r\n');
                }
            }
            const actualErrors = stderr
                ?.split('\n')
                .filter(line => line &&
                    !line.toLowerCase().includes('warning') &&
                    !line.toLowerCase().includes('version mismatch'))
                .join('\n');
            if (code !== 0 && actualErrors) {
                if (onData) onData(actualErrors + '\r\n');
                else terminalEventEmitter.emit(actualErrors + '\r\n');
                resolve({
                    success: false,
                    message: actualErrors || 'Deploy command failed',
                    error: stderr
                });
                return;
            }
            if (onData) onData('Deployment produced no valid output.\r\n');
            else terminalEventEmitter.emit('Deployment produced no valid output.\r\n');
            resolve({
                success: false,
                message: 'Deployment produced no valid output',
                warnings: stderr
            });
        });

        child.on('error', (error) => {
            if (onData) onData(`Error: ${error.message}\r\n`);
            else terminalEventEmitter.emit(`Error: ${error.message}\r\n`);
            resolve({
                success: false,
                message: error.message,
                error: error
            });
        });
    });
}