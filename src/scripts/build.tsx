import { execSync } from "child_process";
import { join, dirname } from "path";
import { mkdirSync, existsSync, writeFileSync } from "fs";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const moveDir = join(__dirname, '../../test');
const outputDir = join(__dirname, '../../output');

// Create output directory if it doesn't exist
if (!existsSync(outputDir)) {
    mkdirSync(outputDir);
}

try {
    const stdout = execSync(
        `sui move build --dump-bytecode-as-base64 --path ${moveDir} --json-errors`,
        {
            stdio: 'pipe',
            encoding: 'utf-8'
        }
    );
    
    writeFileSync(join(outputDir, 'build_output.txt'), stdout);
    console.log('Build output has been saved to build_output.txt');
    
} catch (error) {
    if (error.stderr) {
        writeFileSync(join(outputDir, 'build_error.txt'), error.stderr.toString());
        console.error('Build errors have been saved to build_error.txt');
    }
    
    if (error.stdout) {
        writeFileSync(join(outputDir, 'build_output.txt'), error.stdout.toString());
        console.log('Build output has been saved to build_output.txt');
    }
    
    console.error('Build command failed with exit code:', error.status);
    process.exit(1);
}