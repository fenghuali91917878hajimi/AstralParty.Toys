# run-debug.ps1 — 关掉正在运行的工具，启动 Debug 版并打开 WebView2 调试端口 9222（给 tools/cdp.js 用）。
# Debug 版从 exe 旁边的 WebUI 目录链接读网页：改了 WebUI 只需在页面里强制刷新，改了 C# 要先 dotnet build。
# 用法（仓库根目录）：pwsh -File tools/run-debug.ps1
$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$bin = Join-Path $root "src\AstralParty.Toys\bin\Debug\net8.0-windows"
$exe = Join-Path $bin "AstralParty.Toys.exe"
if (-not (Test-Path $exe)) { throw "还没编译 Debug 版：先运行 dotnet build src/AstralParty.Toys/AstralParty.Toys.csproj -c Debug" }

# exe 旁边要有指向源码 WebUI 的目录链接，Debug 版才会读磁盘上的网页（bin 被清掉后要重建）
$link = Join-Path $bin "WebUI"
if (-not (Test-Path $link)) {
  New-Item -ItemType Junction -Path $link -Target (Join-Path $root "src\AstralParty.Toys\WebUI") | Out-Null
  Write-Host "已重建 WebUI 目录链接"
}

# 调试版和桌面正式版共用同一个 WebView2 数据目录，不能同时开
Get-Process | Where-Object { $_.ProcessName -like 'AstralParty.Toys*' -and ($_.Path -like "*AstralParty.Toys-src*" -or $_.Path -like "*Desktop*AstralParty.Toys（改）.exe") } |
  ForEach-Object { Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue }
Start-Sleep -Milliseconds 800

$psi = New-Object System.Diagnostics.ProcessStartInfo $exe
$psi.WorkingDirectory = $bin
$psi.UseShellExecute = $false
$psi.EnvironmentVariables["WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS"] = "--remote-debugging-port=9222"
$p = [System.Diagnostics.Process]::Start($psi)
for ($i = 0; $i -lt 30; $i++) {
  try { if (Invoke-RestMethod http://127.0.0.1:9222/json -TimeoutSec 2) { Write-Host "调试版已启动（pid $($p.Id)），调试端口 9222 就绪"; exit 0 } } catch {}
  Start-Sleep -Milliseconds 700
}
throw "调试端口没有起来"
