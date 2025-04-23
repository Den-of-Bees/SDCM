import { spawn } from "child_process";
import { join } from "path";
import { mkdirSync, existsSync, writeFileSync } from "fs";

interface BuildOptions {
    moveDir: string;
    outputDir: string;
}

export async function runSuiBuild({ moveDir, outputDir }: BuildOptions): Promise<{
    success: boolean;
    message: string;
    output?: string;
    error?: string;
}> {
    if (!existsSync(outputDir)) {
        mkdirSync(outputDir, { recursive: true });
    }

    return new Promise((resolve) => {
        const process = spawn('sui', [
            'move',
            'build',
            '--dump-bytecode-as-base64',
            '--path',
            moveDir,
            '--json-errors'
        ], {
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
            if (code === 0) {
                writeFileSync(join(outputDir, 'build_output.txt'), stdout);
                resolve({
                    success: true,
                    message: 'Build output has been saved to build_output.txt',
                    output: stdout
                });
            } else {
                if (stderr) {
                    writeFileSync(join(outputDir, 'build_error.txt'), stderr);
                    resolve({
                        success: false,
                        message: 'Build errors have been saved to build_error.txt',
                        error: stderr
                    });
                } else if (stdout) {
                    writeFileSync(join(outputDir, 'build_output.txt'), stdout);
                    resolve({
                        success: false,
                        message: 'Build output has been saved to build_output.txt',
                        output: stdout
                    });
                } else {
                    resolve({
                        success: false,
                        message: `Build command failed with exit code: ${code}`
                    });
                }
            }
        });

        process.on('error', (error) => {
            resolve({
                success: false,
                message: `Failed to start build process: ${error.message}`,
                error: error.toString()
            });
        });
    });
}