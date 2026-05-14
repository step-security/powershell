import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as core from '@actions/core';
import { v4 as uuidv4 } from 'uuid';

export default class FileUtils {
    static readonly tempDirectory: string = process.env.RUNNER_TEMP || os.tmpdir();

    static async createScriptFile(inlineScript: string): Promise<string> {
        const fileName: string = FileUtils.getFileName();
        const filePath: string = path.join(FileUtils.tempDirectory, fileName);
        fs.writeFileSync(filePath, inlineScript, 'utf-8');
        return filePath;
    }

    private static getFileName(): string {
        return `${uuidv4()}.ps1`;
    }

    static async deleteFile(filePath: string) {
        if (fs.existsSync(filePath)) {
            try {
                fs.unlinkSync(filePath);
            }
            catch (err) {
                core.warning(err.toString());
            }
            // The temp script may contain user code/secrets; surface a warning
            // if it's still on disk after the unlink attempt.
            if (fs.existsSync(filePath)) {
                core.warning(`Failed to delete temporary script file: ${filePath}. Sensitive contents may remain on the runner.`);
            }
        }
    }

    static pathExists(path: string) {
        return fs.existsSync(path);
    }
}