[![StepSecurity Maintained Action](https://raw.githubusercontent.com/step-security/maintained-actions-assets/main/assets/maintained-action-banner.png)](https://docs.stepsecurity.io/actions/stepsecurity-maintained-actions)

# GitHub action for Azure PowerShell

This repository contains GitHub action for Azure PowerShell to automate your GitHub workflows using Azure PowerShell scripts.

Get started today with a [free Azure account](https://azure.com/free/open-source)!

The definition of this GitHub Action is in [action.yml](https://github.com/step-security/powershell/blob/master/action.yml).

> [!NOTE]
> Azure PowerShell action now supports macOS and self-hosted Runners!

## Dependencies on other GitHub Actions

Login to Azure before running Azure PowerShell scripts using [Azure Login](https://github.com/step-security/azure-login). Refer [Azure Login](https://github.com/step-security/azure-login#configure-azure-credentials) action on how to configure Azure credentials.

Both [Azure Login](https://github.com/step-security/azure-login) and [Azure PowerShell](https://github.com/step-security/powershell) action uses `Az` module.

Once login is done, Azure PowerShell action will use the same session to run the script.

## Sample Workflow

### Sample workflow to run inlineScript

```yaml
on: [push]

name: AzurePowerShellSample

jobs:

  build:
    runs-on: ubuntu-latest
    steps:
    
    - name: Login via Az module
      uses: step-security/azure-login@v3
      with:
        creds: ${{secrets.AZURE_CREDENTIALS}}
        enable-AzPSSession: true 
        
    - name: Run Azure PowerShell inline script
      uses: step-security/powershell@v3
      with:
        inlineScript: |
          Get-AzVM -ResourceGroupName "ResourceGroup11"
        azPSVersion: "latest"
```

Azure PowerShell Script to be executed can be given under inlineScript as shown in the sample workflow.

Azure PowerShell action is now supported for the Azure public cloud as well as Azure government clouds (`AzureUSGovernment` or `AzureChinaCloud`) and Azure Stack (`AzureStack`) Hub. Before running Azure PowerShell scripts, login to the respective Azure Cloud  using [Azure Login action](https://github.com/step-security/azure-login) by setting appropriate value for the `environment` parameter.

Additionally the action supports two optional parameters:

- `errorActionPreference` : select a suitable  value for the variable for executing the script. Allowed values are `stop`, `continue`, `silentlyContinue`. Default is `Stop`.
- `failOnStandardError` : By default this is marked as `false`. But if this is marked as `true`, the action will fail if any errors are written to the error pipeline, or if any data is written to the Standard Error stream.

### Sample workflow to run a script file in your repository

```yaml
# File: ./scripts/run_azps_cmdlets.ps1
on: [push]

name: AzurePowerShellSampleWithFile

jobs:

  build:
    runs-on: ubuntu-latest
    steps:
    
    - name: Check Out
      uses: actions/checkout@v6

    - name: Login Azure
      uses: step-security/azure-login@v3
      with:
        creds: ${{secrets.AZURE_CREDENTIALS}}
        enable-AzPSSession: true 

    - name: Run Azure PowerShell Script File
      uses: step-security/powershell@v3
      with:
        inlineScript: ./scripts/run_azps_cmdlets.ps1
        azPSVersion: "latest"
```

You have to check out the repository before running the script file.
You can also run the script file with parameters. For example:

```yaml
    - name: Run Azure PowerShell Script File
      uses: step-security/powershell@v3
      with:
        inlineScript: ./scripts/run_azps_cmdlets.ps1 myresourcegroup myresourcename
        azPSVersion: "latest"
```

or

```yaml
    - name: Run Azure PowerShell Script File
      uses: step-security/powershell@v3
      with:
        inlineScript: ./scripts/run_azps_cmdlets.ps1 -ResourceGroupName myresourcegroup -ResourceName myresourcename
        azPSVersion: "latest"
```

### Sample workflow to run Azure powershell actions in Azure US Government cloud

```yaml
   - name: Login to Azure US Gov Cloud with Az Powershell 
     uses: step-security/azure-login@v3
     with:
      creds: ${{ secrets.AZURE_US_GOV_CREDENTIALS }}
      environment: 'AzureUSGovernment'
      enable-AzPSSession: true
    
   - name: Run powershell command in US Gov Cloud
     uses: step-security/powershell@v3
     with:
      inlineScript: "Get-AzContext"
      azPSVersion: "latest"
```

## Available versions of Az Module on runner

To use the latest Az module version, specify `latest`. You can find the latest Az module versions on different runner images from this [table](https://github.com/actions/runner-images#available-images).

Or you can find all supported `Az` version on [PowerShell Gallery](https://www.powershellgallery.com/packages/Az).

## Getting Help for Azure PowerShell Issues

If you encounter an issue related to the Azure PowerShell commands executed in your script, you can
file an issue directly on the [Azure PowerShell repository](https://github.com/Azure/azure-powershell/issues/new/choose).

