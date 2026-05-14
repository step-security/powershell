import { debug } from "@actions/core";
import { exec } from "@actions/exec";
import { which } from "@actions/io";
import PowerShellToolRunner from "./PowerShellToolRunner";
import Utils from "./Utils";

export class ArchiveTools {
    private use7Zip: boolean;

    constructor(use7Zip = false) {
        this.use7Zip = use7Zip;
    }

    public async unzip(zipPath: string, destination: string) {
        if (this.use7Zip) {
            await this.unzipUsing7Zip(zipPath, destination);
        } else {
            await this.unzipUsingPowerShell(zipPath, destination)
        }
    }

    private async unzipUsing7Zip(zipPath: string, destination: string) {
        debug(`Using 7zip to extract ${zipPath} to ${destination}`);
        const path7Zip = await which("7z.exe", true);
        // Pass args as an array so @actions/exec quotes each one — prevents
        // path-with-space breakage and any shell-metachar handling.
        const exitCode = await exec(path7Zip, ["x", `-o${destination}`, zipPath]);
        if (exitCode != 0) {
            throw new Error(`Extraction using 7zip failed from ${zipPath} to ${destination}`);
        }
    }

    private async unzipUsingPowerShell(zipPath: string, destination: string) {
        debug(`Using powershell Expand-Archive cmdlet to extract ${zipPath} to ${destination}`);
        const script = `
            $prevProgressPref = $ProgressPreference
            $ProgressPreference = 'SilentlyContinue'
            Expand-Archive -Path '${Utils.psEscapeSingleQuoted(zipPath)}' -DestinationPath '${Utils.psEscapeSingleQuoted(destination)}'
            $ProgressPreference = $prevProgressPref`;
        const exitCode = await PowerShellToolRunner.executePowerShellScriptBlock(script);
        if (exitCode != 0) {
            throw new Error(`Extraction using Expand-Archive cmdlet failed from ${zipPath} to ${destination}`);
        }
    }
}
