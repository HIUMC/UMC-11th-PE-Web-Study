# 6주차 실습 체크리스트 자동 점검 스크립트
# 실행: 서버를 켠 뒤 프로젝트 폴더에서
#   powershell -ExecutionPolicy Bypass -File .\http-test\api-test.ps1

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$base = "http://localhost:8080"
$tmp = Join-Path $env:TEMP "umc-week6"
New-Item -ItemType Directory -Force -Path $tmp | Out-Null
$utf8NoBom = New-Object System.Text.UTF8Encoding $false
$script:pass = 0
$script:fail = 0

function Send($label, $expected, $method, $path, $body) {
    $respFile = Join-Path $tmp "resp.txt"
    if (Test-Path $respFile) { Remove-Item $respFile }
    $curlArgs = @("-s", "-o", $respFile, "-w", "%{http_code}", "-X", $method, "$base$path")
    if ($null -ne $body) {
        $bodyFile = Join-Path $tmp "body.json"
        [System.IO.File]::WriteAllText($bodyFile, ($body | ConvertTo-Json -Compress), $utf8NoBom)
        $curlArgs += @("-H", "Content-Type: application/json", "--data-binary", "@$bodyFile")
    }
    $status = [int](& curl.exe @curlArgs)
    $text = ""
    if (Test-Path $respFile) { $text = [System.IO.File]::ReadAllText($respFile, [System.Text.Encoding]::UTF8) }
    $ok = ($status -eq $expected)
    if ($ok) { $script:pass++ } else { $script:fail++ }
    $mark = if ($ok) { "PASS" } else { "FAIL" }
    Write-Host ("[{0}] {1}  (기대 {2} / 실제 {3})" -f $mark, $label, $expected, $status) -ForegroundColor $(if ($ok) { "Green" } else { "Red" })
    if ($text) { Write-Host "       $text" -ForegroundColor DarkGray }
    $script:lastStatus = $status
    return $text
}

$n = Get-Random -Minimum 1000 -Maximum 9999
$email = "test$n@umc.com"
$nickname = "fan$n"

Write-Host "`n===== 1. 회원가입 =====" -ForegroundColor Cyan
$signUp = Send "회원가입 성공" 201 POST "/members" @{ email = $email; password = "Umc!1234"; nickname = $nickname }
if ($script:lastStatus -eq 201 -and $signUp -notmatch '"password"') { Write-Host "[PASS] 응답에 password 없음" -ForegroundColor Green; $script:pass++ }
else { Write-Host "[FAIL] 회원가입 응답 확인 실패 또는 password 포함" -ForegroundColor Red; $script:fail++ }
Send "중복 이메일" 409 POST "/members" @{ email = "noco@umc.com"; password = "Umc!1234"; nickname = "new$n" } | Out-Null
Send "중복 닉네임" 409 POST "/members" @{ email = "new$n@umc.com"; password = "Umc!1234"; nickname = "수현" } | Out-Null
Send "잘못된 이메일 형식" 400 POST "/members" @{ email = "not-an-email"; password = "Umc!1234"; nickname = "bad$n" } | Out-Null
Send "약한 비밀번호" 400 POST "/members" @{ email = "pw$n@umc.com"; password = "1234"; nickname = "pw$n" } | Out-Null
Send "닉네임 1자" 400 POST "/members" @{ email = "nk$n@umc.com"; password = "Umc!1234"; nickname = "a" } | Out-Null

Write-Host "`n===== 2. 평점 등록 =====" -ForegroundColor Cyan
$created = Send "평점 등록 성공 (회원 1, 영화 27205)" 201 POST "/members/1/ratings" @{ movieId = 27205; score = 5; comment = "꿈속의 꿈" }
$ratingId = ($created | ConvertFrom-Json).result
Write-Host "       → 생성된 ratingId = $ratingId"
Send "같은 영화 중복 평점" 409 POST "/members/1/ratings" @{ movieId = 27205; score = 4; comment = "또 등록" } | Out-Null
Send "별점 6점" 400 POST "/members/1/ratings" @{ movieId = 13; score = 6; comment = "범위 초과" } | Out-Null
Send "별점 0점" 400 POST "/members/1/ratings" @{ movieId = 13; score = 0 } | Out-Null
Send "후기 501자" 400 POST "/members/1/ratings" @{ movieId = 13; score = 3; comment = ("가" * 501) } | Out-Null
Send "없는 회원이 등록" 404 POST "/members/999/ratings" @{ movieId = 13; score = 3 } | Out-Null

Write-Host "`n===== 3. 평점 수정 =====" -ForegroundColor Cyan
Send "본인 평점 수정" 200 PATCH "/members/1/ratings/$ratingId" @{ score = 3; comment = "다시 보니 3점" } | Out-Null
Send "수정 결과 조회" 200 GET "/members/1/ratings" $null | Out-Null
Send "다른 회원(2)이 수정" 403 PATCH "/members/2/ratings/$ratingId" @{ score = 1; comment = "남의 평점" } | Out-Null
Send "없는 평점 수정" 404 PATCH "/members/1/ratings/999999" @{ score = 3 } | Out-Null
Send "수정 시 별점 6점" 400 PATCH "/members/1/ratings/$ratingId" @{ score = 6 } | Out-Null

Write-Host "`n===== 4. 평점 삭제 =====" -ForegroundColor Cyan
Send "다른 회원(2)이 삭제" 403 DELETE "/members/2/ratings/$ratingId" $null | Out-Null
Send "본인 평점 삭제" 204 DELETE "/members/1/ratings/$ratingId" $null | Out-Null
$after = Send "삭제 후 조회" 200 GET "/members/1/ratings" $null
if ($script:lastStatus -eq 200 -and $ratingId -and $after -notmatch "`"ratingId`":$ratingId[,}]") { Write-Host "[PASS] 삭제한 평점이 목록에서 사라짐" -ForegroundColor Green; $script:pass++ }
else { Write-Host "[FAIL] 삭제 후 목록 확인 실패" -ForegroundColor Red; $script:fail++ }
Send "이미 삭제한 평점 다시 삭제" 404 DELETE "/members/1/ratings/$ratingId" $null | Out-Null

Write-Host "`n===== 결과: PASS $($script:pass) / FAIL $($script:fail) =====" -ForegroundColor Yellow
Write-Host "가입한 테스트 회원: $email / $nickname"
