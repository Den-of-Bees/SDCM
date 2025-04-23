import { spawn } from "child_process";
import { join } from "path";
import { mkdirSync, existsSync, writeFileSync } from "fs";
import { executeCliCommand } from "../HAL/cliRunner";

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

    const result = await executeCliCommand("sui", [
        'move',
        'build',
        '--dump-bytecode-as-base64',
        '--path',
        moveDir,
        '--json-errors'
    ]);

    console.log("Sui Build Result:", result);

    if (result.stdout && result.stdout.includes("{")) {
        try {
            const { packageId, modules } = JSON.parse(result.stdout);
            const buildInfo = JSON.stringify({ packageId, modules }, null, 2);
            writeFileSync(join(outputDir, "build_info.json"), buildInfo);

            return {
                success: true,
                message: "Successfully built and saved to build_info.json",
                output: buildInfo,
            };
        } catch (error) {
            console.error("Error parsing build result:", error);
            return {
                success: false,
                message: "Failed to parse build result",
                error: error.message,
            };
        }
    } else {
        return {
            success: false,
            message: "Build failed",
            error: result.stderr,
        };
    }
}