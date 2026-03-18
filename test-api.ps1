# Pet Management System API Testing
Write-Host "=== Pet Management System API Testing ===" -ForegroundColor Cyan
Write-Host ""

# Test 1: Health Check
Write-Host "Testing Health Check..." -ForegroundColor White
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -UseBasicParsing -TimeoutSec 5
    Write-Host "✓ Health Check: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "✗ Health Check Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 2: User Registration
Write-Host "Testing User Registration..." -ForegroundColor White
$headers = @{ "Content-Type" = "application/json" }
$registerBody = @{
    email = "testuser$(Get-Random)@example.com"
    password = "TestPassword123!"
    firstName = "Test"
    lastName = "User"
    phone = "+1234567890"
    role = "customer"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/register" -Method POST -Headers $headers -Body $registerBody -UseBasicParsing -TimeoutSec 10
    Write-Host "✓ Registration: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "✗ Registration Failed: $($_.Exception.Response.StatusCode) - $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 3: User Login
Write-Host "Testing User Login..." -ForegroundColor White
$loginBody = @{
    email = "testuser@example.com"
    password = "TestPassword123!"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" -Method POST -Headers $headers -Body $loginBody -UseBasicParsing -TimeoutSec 10
    Write-Host "✓ Login: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "✗ Login Failed: $($_.Exception.Response.StatusCode) - $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 4: Get Clinics (Public)
Write-Host "Testing Get Clinics (Public)..." -ForegroundColor White
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/clinics" -UseBasicParsing -TimeoutSec 5
    Write-Host "✓ Get Clinics: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "✗ Get Clinics Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 5: Get Pets (Requires Auth - should fail)
Write-Host "Testing Get Pets (Requires Auth - should fail)..." -ForegroundColor White
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/pets" -UseBasicParsing -TimeoutSec 5
    Write-Host "✗ Get Pets: Should have failed but got $($response.StatusCode)" -ForegroundColor Yellow
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✓ Get Pets: Correctly requires authentication (401)" -ForegroundColor Green
    } else {
        Write-Host "✗ Get Pets: Unexpected error $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    }
}
Write-Host ""

# Test 6: Invalid Endpoint (404)
Write-Host "Testing Invalid Endpoint (404)..." -ForegroundColor White
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/nonexistent" -UseBasicParsing -TimeoutSec 5
    Write-Host "✗ Invalid Endpoint: Should have failed but got $($response.StatusCode)" -ForegroundColor Yellow
} catch {
    if ($_.Exception.Response.StatusCode -eq 404) {
        Write-Host "✓ Invalid Endpoint: Correctly returns 404" -ForegroundColor Green
    } else {
        Write-Host "✗ Invalid Endpoint: Unexpected status $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    }
}
Write-Host ""

Write-Host "=== API Testing Complete ===" -ForegroundColor Cyan