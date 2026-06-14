# Install the already-built debug APK on a connected phone (no rebuild).
$ErrorActionPreference = "Stop"

if (-not $env:ANDROID_HOME) { $env:ANDROID_HOME = "D:\Android\Sdk" }
$adb = Join-Path $env:ANDROID_HOME "platform-tools\adb.exe"

$appDir = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$apk = Join-Path $appDir "android\app\build\outputs\apk\debug\japanese-narumero.apk"
if (-not (Test-Path $apk)) { throw "APK not found at $apk. Run 'npm run deploy' first." }

Write-Host "Connect your phone now (USB debugging ON). Waiting for device..."
& $adb wait-for-device
& $adb install -r $apk
Write-Host "Installed. Open 'Kawaii Nihongo' on your phone."
