# E2E Test Script: Register -> Login -> Access Protected Routes
$base = 'http://localhost:5000/api'

function Show($m) { Write-Host $m -ForegroundColor Cyan }
function Ok($m) { Write-Host $m -ForegroundColor Green }
function Err($m) { Write-Host $m -ForegroundColor Red }

Show '=== E2E Flow: Register → Login → Authenticated Requests ==='

# 1) Register
$rand = Get-Random
$email = "e2e${rand}@example.com"
$registerBody = @{ email = $email; password = 'TestPassword123!'; firstName = 'E2E'; lastName = 'User'; phone = '+15551234567'; role = 'customer' } | ConvertTo-Json
try {
    $r = Invoke-WebRequest -Uri "$base/auth/register" -Method POST -Headers @{ 'Content-Type' = 'application/json' } -Body $registerBody -UseBasicParsing -TimeoutSec 15
    Ok "Register OK ($($r.StatusCode)) -> $email"
} catch {
    Err "Register FAILED: $($_.Exception.Message)"
    exit 1
}

# 2) Login
$loginBody = @{ email = $email; password = 'TestPassword123!' } | ConvertTo-Json
try {
    $r = Invoke-WebRequest -Uri "$base/auth/login" -Method POST -Headers @{ 'Content-Type' = 'application/json' } -Body $loginBody -UseBasicParsing -TimeoutSec 15
    $data = ($r.Content | ConvertFrom-Json).data
    $token = $data.token
    if (-not $token) { Err 'Login succeeded but token missing'; exit 1 }
    Ok "Login OK ($($r.StatusCode)) - token length $($token.Length)"
} catch {
    Err "Login FAILED: $($_.Exception.Message)"
    exit 1
}

# 3) Fetch protected resources with token
$hdr = @{ Authorization = "Bearer $token" }
$resources = @('pets', 'appointments', 'medical-records', 'prescriptions')
foreach ($res in $resources) {
    try {
        $r = Invoke-WebRequest -Uri "$base/$res" -Headers $hdr -UseBasicParsing -TimeoutSec 15
        Ok "GET /$res -> $($r.StatusCode)"
    } catch {
        if ($null -ne $_.Exception.Response) {
            $status = $_.Exception.Response.StatusCode
        } else {
            $status = 'NO RESPONSE'
        }
        Err "GET /$res FAILED: $status - $($_.Exception.Message)"
    }
}

Ok 'E2E flow complete'
