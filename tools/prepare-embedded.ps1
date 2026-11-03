# prepare-embedded.ps1 — 本地打包前，把内嵌的 Mod 加载器和默认卡面包同步到 CesiumLoader 最新 Release。
# 照搬 .github/workflows/release.yml 里「Fetch latest CesiumLoader package」「Fetch default skins」两步，
# 这样本地打出来的程序和原作者发布的一样，内置加载器是最新版（「重新安装内置版本」不会变成降级）。
# 用法（在仓库根目录）：pwsh -File tools/prepare-embedded.ps1
$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
Set-Location $root

# ---------- 加载器 + SDK + 配置模板 + 公开模组 ----------
$zipUrl = "https://github.com/higashitaniyume/CesiumLoader/releases/latest/download/cesium-loader.zip"
$zipPath = Join-Path $env:TEMP "cesium-loader-latest.zip"
Invoke-WebRequest -Uri $zipUrl -OutFile $zipPath -UseBasicParsing
$extract = Join-Path $env:TEMP "cesium-loader-latest"
if (Test-Path $extract) { Remove-Item $extract -Recurse -Force }
Expand-Archive -Path $zipPath -DestinationPath $extract -Force
$resources = "src/AstralParty.Toys/Resources/ModLoader"
# doorstop_config.json 必须一起同步：内嵌 SDK 版本号从它读，旧了会让新版内置模组因 SdkVersionTooNew 被拒绝加载
$targets = @(
  @{ From = "$extract/version.dll"; To = "$resources/version.dll" },
  @{ From = "$extract/AstralParty_ModLoader/sdk/CesiumLoader.SDK.dll"; To = "$resources/CesiumLoader.SDK.dll" },
  @{ From = "$extract/AstralParty_ModLoader/doorstop_config.json"; To = "$resources/doorstop_config.json" }
)
foreach ($t in $targets) {
  if (-not (Test-Path $t.From)) { throw "解压包缺少文件: $($t.From)" }
  Copy-Item $t.From $t.To -Force
}
# 只同步公开分发清单（BuiltInMods.props）里的模组
[xml]$modProject = Get-Content "src/AstralParty.Toys/BuiltInMods.props" -Raw
$modIds = @(([string]$modProject.Project.ItemGroup.BuiltInMod.Include).Split(';'))
if ($modIds.Count -eq 0) { throw "公开模组清单为空" }
$modsRoot = "$extract/AstralParty_ModLoader/mods"
foreach ($id in $modIds) {
  $modDirectory = Join-Path $modsRoot $id
  foreach ($extension in @('dll', 'json')) {
    $source = Join-Path $modDirectory "$id.$extension"
    if (-not (Test-Path $source)) { throw "发布包缺少公开模组文件: $source" }
    Copy-Item $source "$resources/$id.$extension" -Force
  }
  $dataSource = Join-Path $modDirectory 'data'
  $dataTarget = Join-Path $resources "data/$id"
  if (Test-Path $dataTarget) { Remove-Item $dataTarget -Recurse -Force }
  if (Test-Path $dataSource) { Copy-Item $dataSource $dataTarget -Recurse -Force }
}
Write-Host "内置模组: $($modIds -join ', ')"
$version = "unknown"
if (Test-Path "$extract/cesium-loader.json") {
  $manifest = Get-Content "$extract/cesium-loader.json" -Raw | ConvertFrom-Json
  if ($manifest.version) { $version = $manifest.version }
}
Set-Content -Path "$resources/loader-version.json" -Value ($version | ConvertTo-Json) -Encoding UTF8
Write-Host "内嵌加载器版本: $version"

# 加载器更新日志（离线显示用；取不到就写占位符，运行时再去 GitHub 拉）
$changelogPath = "$resources/loader-changelog.md"
try {
  $headers = @{ "User-Agent" = "AstralParty.Toys-local"; "Accept" = "application/vnd.github+json" }
  $rel = Invoke-RestMethod -Uri "https://api.github.com/repos/higashitaniyume/CesiumLoader/releases/latest" -Headers $headers -UseBasicParsing
  $header = if ($rel.name) { $rel.name } else { $rel.tag_name }
  $body = if ($rel.body) { $rel.body.Trim() } else { "（这个版本没有填写发布说明。）" }
  Set-Content -Path $changelogPath -Value "## $header`n`n$body`n" -Encoding UTF8
  Write-Host "加载器更新日志: 已写入「$header」"
} catch {
  Set-Content -Path $changelogPath -Value "<!-- placeholder: 取 Release 说明失败，运行时改为去 GitHub 拉取。 -->`n" -Encoding UTF8
  Write-Host "加载器更新日志: 取不到（$($_.Exception.Message)），已写占位符"
}

# ---------- 默认卡面包 ----------
$destination = "src/AstralParty.Toys/Resources/Skins/default-skins.zip"
New-Item -ItemType Directory -Path (Split-Path $destination) -Force | Out-Null
Invoke-WebRequest -Uri "https://github.com/higashitaniyume/CesiumLoader/releases/latest/download/cesium-default-skins.zip" -OutFile $destination
Add-Type -AssemblyName System.IO.Compression.FileSystem
$archive = [IO.Compression.ZipFile]::OpenRead((Resolve-Path $destination))
try {
  $files = @($archive.Entries | Where-Object { $_.Name })
  if ($files.Count -eq 0) { throw "默认皮肤包为空" }
  foreach ($entry in $files) {
    $path = $entry.FullName.Replace('\', '/')
    if ($path -notmatch '^AstralParty_ModLoader/skins/default/[^/:]+$') { throw "默认皮肤包路径不正确: $path" }
  }
  if (-not ($files | Where-Object { $_.Name -like '*.png' })) { throw "默认皮肤包没有图片" }
  Write-Host "默认卡面包: $($files.Count) 个文件"
} finally { $archive.Dispose() }
