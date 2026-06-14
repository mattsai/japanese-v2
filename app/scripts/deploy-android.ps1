# Build the web app, sync into Android, assemble the debug APK, then install on a connected phone.
$ErrorActionPreference = "Stop"

if (-not $env:JAVA_HOME) {
  $env:JAVA_HOME = (Get-ChildItem "D:\dev\jdk17" -Directory -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -like "jdk-17*" } | Select-Object -First 1).FullName
}
if (-not $env:JAVA_HOME) { throw "JDK 17 not found. Set JAVA_HOME or install it under D:\dev\jdk17." }
if (-not $env:ANDROID_HOME) { $env:ANDROID_HOME = "D:\Android\Sdk" }
$adb = Join-Path $env:ANDROID_HOME "platform-tools\adb.exe"

$appDir = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
Set-Location $appDir

Write-Host "==> Building web bundle (next export)..."
npm run build
if ($LASTEXITCODE -ne 0) { throw "next build failed" }
npm run sync:android

Write-Host "==> Assembling debug APK..."
Set-Location (Join-Path $appDir "android")
& ".\gradlew.bat" assembleDebug --no-daemon
if ($LASTEXITCODE -ne 0) { throw "Gradle build failed" }

$apk = Join-Path $appDir "android\app\build\outputs\apk\debug\japanese-narumero.apk"
Write-Host "==> APK ready: $apk"
Write-Host "==> Connect your phone now (USB debugging ON). Waiting for device..."
& $adb wait-for-device
& $adb install -r $apk
Write-Host "==> Installed. Open 'Kawaii Nihongo' on your phone."
