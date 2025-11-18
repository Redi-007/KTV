# Starts API first, waits for it to be healthy, then starts the frontend.
# Useful when you want the frontend to talk to the API immediately after launch.

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Join-Path $scriptDir '..'

function Wait-ForHttp {
	param(
		[string]$Url,
		[int]$TimeoutSec = 60
	)

	$end = (Get-Date).AddSeconds($TimeoutSec)
	while ((Get-Date) -lt $end) {
		try {
			$resp = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
			if ($resp.StatusCode -ge 200 -and $resp.StatusCode -lt 500) {
				return $true
			}
		} catch {
			Start-Sleep -Seconds 1
		}
	}
	return $false
}

Write-Host "Starting API in a new PowerShell window..." -ForegroundColor Cyan
Start-Process pwsh -ArgumentList "-NoExit","-Command","Set-Location -LiteralPath '$repoRoot'; dotnet run --project ./src/KTV.API/KTV.API.csproj" -WindowStyle Normal

# Read preferred API URL from launchSettings if available; otherwise default to localhost:5028
$launchFile = Join-Path $repoRoot 'src\KTV.API\Properties\launchSettings.json'
$apiUrl = 'http://localhost:5028'
if (Test-Path $launchFile) {
	try {
		$json = Get-Content $launchFile -Raw | ConvertFrom-Json
		if ($json.profiles.http.applicationUrl) { $apiUrl = $json.profiles.http.applicationUrl }
		elseif ($json.profiles.'https'.applicationUrl) { $apiUrl = ($json.profiles.'https'.applicationUrl -split ';')[0] }
	} catch {
		# ignore parse errors, keep default
	}
}

Write-Host "Waiting for API to be ready at $apiUrl ..." -ForegroundColor Yellow
if (Wait-ForHttp -Url $apiUrl -TimeoutSec 60) {
	Write-Host "API is up — starting frontend in a new PowerShell window..." -ForegroundColor Green
	Start-Process pwsh -ArgumentList "-NoExit","-Command","Set-Location -LiteralPath '$repoRoot'; npm run dev" -WindowStyle Normal
	Write-Host "Frontend started. Visit http://localhost:5000/" -ForegroundColor Green
} else {
	Write-Host "Timed out waiting for API at $apiUrl. Frontend will not be started." -ForegroundColor Red
}
