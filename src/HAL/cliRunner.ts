import { spawn } from 'child_process';

export interface CliResult {
    stdout: string;
    stderr: string;
    code: number | null;
}

export function executeCliCommand(command: string, args: string[]): Promise<CliResult> {
    return new Promise((resolve, reject) => {
        const childProcess = spawn(command, args, {
            stdio: ['ignore', 'pipe', 'pipe'],
            shell: true
        });

        let stdout = '';
        let stderr = '';

        childProcess.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        childProcess.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        childProcess.on('close', (code) => {
            resolve({ stdout, stderr, code });
        });

        childProcess.on('error', (error) => {
            reject(error);
        });
    });
}