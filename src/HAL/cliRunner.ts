import { spawn } from 'child_process';

export interface CliResult {
    stdout: string;
    stderr: string;
    code: number | null;
}

export function executeCliCommand(command: string, args: string[]): Promise<CliResult> {
    return new Promise((resolve, reject) => {
        const process = spawn(command, args, {
            stdio: ['ignore', 'pipe', 'pipe'],
            shell: true
        });

        let stdout = '';
        let stderr = '';

        process.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        process.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        process.on('close', (code) => {
            resolve({ stdout, stderr, code });
        });

        process.on('error', (error) => {
            reject(error);
        });
    });
}