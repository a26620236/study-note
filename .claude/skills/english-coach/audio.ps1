# english-coach audio.ps1
# Reads the "## Polished Dialogue" section of a session markdown file
# and produces a two-voice WAV using Windows built-in SAPI TTS.

[CmdletBinding()]
param(
  [Parameter(Mandatory = $true)]
  [string]$SessionFile,

  [string]$OutputFile,

  # SAPI rate: -10 (slowest) to 10 (fastest). Default -1 = a touch slower for clarity.
  [int]$Rate = -1
)

$ErrorActionPreference = 'Stop'

if (-not (Test-Path $SessionFile)) {
  Write-Error "Session file not found: $SessionFile"
  exit 1
}

# Resolve default output path: english-practice/audio/<basename>.wav
if (-not $OutputFile) {
  $base = [System.IO.Path]::GetFileNameWithoutExtension($SessionFile)
  $sessionDir = Split-Path $SessionFile -Parent
  $audioDir = Join-Path (Split-Path $sessionDir -Parent) 'audio'
  if (-not (Test-Path $audioDir)) {
    New-Item -ItemType Directory -Force -Path $audioDir | Out-Null
  }
  $OutputFile = Join-Path $audioDir "$base.wav"
}

# Read the session file
$content = Get-Content -Path $SessionFile -Raw -Encoding UTF8

# Extract the "## Polished Dialogue" section
$pattern = '(?s)##\s*Polished\s*Dialogue\s*\r?\n+(.+?)(?=\r?\n##\s|\z)'
if ($content -notmatch $pattern) {
  Write-Error "Section '## Polished Dialogue' not found in $SessionFile"
  exit 1
}
$dialogue = $Matches[1].Trim()

# Strip a leading blockquote note line if present (e.g., "> 這個區塊...")
$dialogue = ($dialogue -split "\r?\n" | Where-Object { $_ -notmatch '^\s*>' }) -join "`n"

# Parse "[Speaker]: text" or "Speaker: text"
$linePattern = '^\s*(?:\[)?([^\]\n:]+?)(?:\])?\s*:\s*(.+?)\s*$'
$turns = New-Object System.Collections.Generic.List[object]
foreach ($line in ($dialogue -split "\r?\n")) {
  if ([string]::IsNullOrWhiteSpace($line)) { continue }
  if ($line -match $linePattern) {
    $speaker = $Matches[1].Trim()
    $text = $Matches[2].Trim()
    if ($text -ne '') {
      $turns.Add([pscustomobject]@{ Speaker = $speaker; Text = $text })
    }
  }
}

if ($turns.Count -eq 0) {
  Write-Error "No dialogue lines parsed from '## Polished Dialogue'."
  exit 1
}

# Initialise SAPI
Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$synth.Rate = $Rate

# Find installed English voices
$enVoices = @(
  $synth.GetInstalledVoices() |
    Where-Object { $_.VoiceInfo.Culture.Name -like 'en-*' -and $_.Enabled } |
    ForEach-Object { $_.VoiceInfo.Name }
)

if ($enVoices.Count -eq 0) {
  Write-Error "No English TTS voice is installed. Open Windows Settings -> Time & Language -> Speech -> Manage voices and install an English voice (e.g. Microsoft David or Zira)."
  exit 1
}

$voiceA = $enVoices[0]
$voiceB = if ($enVoices.Count -ge 2) { $enVoices[1] } else { $enVoices[0] }
$singleVoice = ($enVoices.Count -lt 2)

# Map speakers to voices. With 2+ voices, alternate. With 1 voice, both share it
# (no pitch shifting — SAPI's pitch transform produces crackling artifacts).
$speakerInfo = @{}
foreach ($turn in $turns) {
  if (-not $speakerInfo.ContainsKey($turn.Speaker)) {
    $idx = $speakerInfo.Count
    $speakerInfo[$turn.Speaker] = @{
      Voice = if ($idx % 2 -eq 0) { $voiceA } else { $voiceB }
    }
  }
}

function Encode-Xml([string]$s) {
  return $s.Replace('&', '&amp;').Replace('<', '&lt;').Replace('>', '&gt;').Replace('"', '&quot;')
}

# Build SSML
$sb = New-Object System.Text.StringBuilder
[void]$sb.Append('<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">')

# Intro
$baseName = [System.IO.Path]::GetFileNameWithoutExtension($SessionFile)
$introText = "English Practice Session. " + $baseName.Replace('-', ' ')
$introSafe = Encode-Xml $introText
[void]$sb.Append("<voice name=""$voiceA""><prosody rate=""-10%"">$introSafe</prosody></voice>")
[void]$sb.Append('<break time="900ms"/>')

foreach ($turn in $turns) {
  $voice = $speakerInfo[$turn.Speaker].Voice
  $safeText = Encode-Xml $turn.Text
  [void]$sb.Append("<voice name=""$voice"">$safeText</voice>")
  [void]$sb.Append('<break time="700ms"/>')
}

[void]$sb.Append('</speak>')
$ssml = $sb.ToString()

# Speak to file with explicit format (Zira Desktop's native: 22050 Hz / 16-bit / mono).
# Forcing this avoids any low-quality default and ensures consistent output across machines.
try {
  $audioFormat = New-Object System.Speech.AudioFormat.SpeechAudioFormatInfo(
    22050,
    [System.Speech.AudioFormat.AudioBitsPerSample]::Sixteen,
    [System.Speech.AudioFormat.AudioChannel]::Mono
  )
  $synth.SetOutputToWaveFile($OutputFile, $audioFormat)
  $synth.SpeakSsml($ssml)
}
catch {
  Write-Error "TTS failed: $_"
  exit 1
}
finally {
  $synth.Dispose()
}

if (Test-Path $OutputFile) {
  $size = (Get-Item $OutputFile).Length
  $sizeKB = [math]::Round($size / 1KB, 1)
  $sizeMB = [math]::Round($size / 1MB, 2)
  $displaySize = if ($size -ge 1MB) { "$sizeMB MB" } else { "$sizeKB KB" }

  Write-Output "OK. Audio saved to: $OutputFile  ($displaySize)"
  Write-Output "Voice mapping:"
  foreach ($k in $speakerInfo.Keys) {
    Write-Output ("  - {0} -> {1}" -f $k, $speakerInfo[$k].Voice)
  }
  if ($singleVoice) {
    Write-Output ""
    Write-Output "Note: Only one English voice is installed, so both speakers sound identical."
    Write-Output "      For a true two-voice podcast feel, install Microsoft David via:"
    Write-Output "      Settings -> Time & Language -> Speech -> Manage voices -> Add voices -> English (United States)."
  }
}
else {
  Write-Error "Output file was not created."
  exit 1
}
