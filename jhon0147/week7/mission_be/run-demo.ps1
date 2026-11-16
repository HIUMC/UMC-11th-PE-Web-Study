param(
    [int]$Port = 8087,
    [int]$TokenSeconds = 3600
)
$ErrorActionPreference = 'Stop'
if ($TokenSeconds -le 0) { throw 'TokenSeconds는 양의 정수여야 합니다.' }
$previousSecret = $env:JWT_SECRET
$previousExpiration = $env:JWT_ACCESS_EXPIRATION
$previousPort = $env:PORT
Push-Location $PSScriptRoot
try {
    if ([string]::IsNullOrWhiteSpace($env:JWT_SECRET)) {
        $keyBytes = New-Object byte[] 48
        $random = [System.Security.Cryptography.RandomNumberGenerator]::Create()
        try { $random.GetBytes($keyBytes) } finally { $random.Dispose() }
        $env:JWT_SECRET = [Convert]::ToBase64String($keyBytes)
    }
    $env:JWT_ACCESS_EXPIRATION = "$TokenSeconds"
    $env:PORT = "$Port"
    & .\gradlew.bat bootRun --args='--spring.profiles.active=demo' --console=plain
    if ($LASTEXITCODE -ne 0) { throw "서버 실행 실패 (종료 코드: $LASTEXITCODE)" }
} finally {
    $env:JWT_SECRET = $previousSecret
    $env:JWT_ACCESS_EXPIRATION = $previousExpiration
    $env:PORT = $previousPort
    Pop-Location
}
