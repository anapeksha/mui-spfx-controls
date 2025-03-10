[CmdletBinding()]
param (
    [Parameter(Mandatory = $true, HelpMessage = "URL of the SharePoint Admin Center, e.g.https://contoso-admin.sharepoint.com")]
    [string]$AdminUrl,
    [Parameter(Mandatory = $true, HelpMessage = "URL of SharePoint Site Collection where AppCatalog should be enabled")]
    [string]$SiteUrl
)

begin {
    Import-Module PnP.PowerShell

    Write-Host "Connecting to SharePoint Admin Site '$($AdminUrl)'" -ForegroundColor Yellow

    # Try different authentication methods if needed
    Connect-PnPOnline -Url $AdminUrl

    if (!(Get-PnPConnection)) {
        Write-Host "PnP Connection failed, trying Web Login..." -ForegroundColor Red
    }
}
process {
    Write-Host "Adding site collection app catalog to site '$($SiteUrl)'..." -ForegroundColor Yellow
    Add-PnPSiteCollectionAppCatalog -Site $SiteUrl
}
end {
    Disconnect-PnPOnline
    Write-Host "Finished" -ForegroundColor Green
}
