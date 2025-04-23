import { writeFileSync } from "fs";
import { join } from "path";
import { SuiObjectChange, SuiTransactionBlockResponse } from "@mysten/sui/client";
import { executeCliCommand } from "../HAL/cliRunner";

interface DeployOptions {
    moveDir: string;
    outputDir: string;
}

export async function runSuiDeploy({ moveDir, outputDir }: DeployOptions) {
    try {
        const result = await executeCliCommand('sui', [
            'client', 
            'publish', 
            moveDir, 
            '--json',
            '--silence-warnings'
        ]);

        console.log('Sui Deploy Result:', result);

        if (result.stdout && result.stdout.includes('{')) {
            try {
                const { objectChanges } = JSON.parse(result.stdout) as SuiTransactionBlockResponse;

                if (objectChanges) {
                    const publishedObj = objectChanges.find(
                        obj => obj.type === "published"
                    ) as Extract<SuiObjectChange, { type: "published" }>;

                    if (publishedObj && publishedObj.type === "published") {
                        const { packageId, modules } = publishedObj;
                        const deploymentInfo = JSON.stringify({ packageId, modules }, null, 2);
                        writeFileSync(join(outputDir, 'deployed_objects.json'), deploymentInfo);
                        
                        return {
                            success: true,
                            message: 'Successfully deployed and saved to deployed_objects.json',
                            packageId,
                            modules,
                            warnings: result.stderr
                        };
                    }
                }
            } catch (parseError) {
            }
        }

        const actualErrors = result.stderr
            ?.split('\n')
            .filter(line => line && 
                !line.toLowerCase().includes('warning') && 
                !line.toLowerCase().includes('version mismatch'))
            .join('\n');

        if (result.code !== 0 && actualErrors) {
            return {
                success: false,
                message: actualErrors || 'Deploy command failed',
                error: result
            };
        }

        return {
            success: false,
            message: 'Deployment produced no valid output',
            warnings: result.stderr
        };

    } catch (error: any) {
        return {
            success: false,
            message: error.message,
            error: error
        };
    }
}