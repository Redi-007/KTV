# Starts API first, waits for it to be healthy, then starts the frontend.
# Useful when you want the frontend to talk to the API immediately after launch.

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Join-Path $scriptDir '..'

# Configurable timeout (seconds) via environment variable VITE_START_TIMEOUT, default 120
if ($env:VITE_START_TIMEOUT -and [int]::TryParse($env:VITE_START_TIMEOUT, [ref]0)) {
	$timeoutSec = [int]$env:VITE_START_TIMEOUT
} else {
	$timeoutSec = 120
}

# Create logs directory
$logsDir = Join-Path $repoRoot 'scripts\logs'
if (-not (Test-Path $logsDir)) { New-Item -ItemType Directory -Path $logsDir | Out-Null }

$timestamp = (Get-Date).ToString('yyyyMMdd-HHmmss')
$helperLog = Join-Path $logsDir "dev-start-$timestamp.log"
$apiLog = Join-Path $logsDir "api-$timestamp.log"
$frontendLog = Join-Path $logsDir "frontend-$timestamp.log"

Add-Content -Path $helperLog -Value "[$(Get-Date)] Starting dev helper"

function Wait-ForHttp {
	param(
		[string]$Url,
		[int]$Timeout = $timeoutSec
	)

	$end = (Get-Date).AddSeconds($Timeout)
	while ((Get-Date) -lt $end) {
		try {
			$resp = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
			if ($resp.StatusCode -ge 200 -and $resp.StatusCode -lt 500) {
				Add-Content -Path $helperLog -Value "[$(Get-Date)] Health check succeeded: $Url"
				return $true
			}
		} catch {
			Add-Content -Path $helperLog -Value "[$(Get-Date)] Health check failed, retrying: $Url"
			Start-Sleep -Seconds 1
		}
	}
	Add-Content -Path $helperLog -Value "[$(Get-Date)] Timed out waiting for $Url after $Timeout seconds"
	return $false
}

Add-Content -Path $helperLog -Value "[$(Get-Date)] Starting API in a new PowerShell window (logs -> $apiLog)"

# Start API in a new pwsh window and redirect its output to a log file
Start-Process pwsh -ArgumentList "-NoExit","-Command","Set-Location -LiteralPath '$repoRoot'; dotnet run --project ./src/KTV.API/KTV.API.csproj *> '${apiLog}'" -WindowStyle Normal

# Read preferred API URL from launchSettings if available; otherwise default to localhost:5028
$launchFile = Join-Path $repoRoot 'src\KTV.API\Properties\launchSettings.json'
$apiUrl = 'http://localhost:5028'
if (Test-Path $launchFile) {
	try {
		$json = Get-Content $launchFile -Raw | ConvertFrom-Json
		if ($json.profiles.http.applicationUrl) { $apiUrl = $json.profiles.http.applicationUrl }
		elseif ($json.profiles.'https'.applicationUrl) { $apiUrl = ($json.profiles.'https'.applicationUrl -split ';')[0] }
	} catch {
		Add-Content -Path $helperLog -Value "[$(Get-Date)] Warning: failed to parse launchSettings.json"
	}
}

Add-Content -Path $helperLog -Value "[$(Get-Date)] Waiting for API to be ready at $apiUrl (timeout=${timeoutSec}s) ..."
if (Wait-ForHttp -Url $apiUrl -Timeout $timeoutSec) {
	Add-Content -Path $helperLog -Value "[$(Get-Date)] API is up — starting frontend (logs -> $frontendLog)"
	Start-Process pwsh -ArgumentList "-NoExit","-Command","Set-Location -LiteralPath '$repoRoot'; npm run dev *> '${frontendLog}'" -WindowStyle Normal
	Add-Content -Path $helperLog -Value "[$(Get-Date)] Frontend started"
	Write-Host "Frontend started. Visit http://localhost:5000/" -ForegroundColor Green
} else {
	Add-Content -Path $helperLog -Value "[$(Get-Date)] Timed out waiting for API at $apiUrl. Frontend will not be started. See $helperLog for details."
	Write-Host "Timed out waiting for API at $apiUrl. Frontend not started. See $helperLog" -ForegroundColor Red
}
