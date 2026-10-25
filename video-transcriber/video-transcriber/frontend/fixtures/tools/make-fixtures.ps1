<#
  make-fixtures.ps1 - re-creates every test fixture from fixtures/texts/*.txt.

  Usage (from anywhere):
    powershell -NoProfile -ExecutionPolicy Bypass -File make-fixtures.ps1 [-Ffmpeg <path-to-ffmpeg.exe>]

  Output:
    fixtures/audio/       committed tier (small files, total <= 5 MB)
    fixtures/generated/   NOT committed (git-ignored): SAPI masters + large raw WAVs
    fixtures/manifest.json
  Needs: Windows SAPI voices (Microsoft David Desktop, Microsoft Zira Desktop) and an ffmpeg 7.x
  with libx264, libopus, libvorbis, libmp3lame, aac, ac3, libopencore_amrnb.
#>
param(
  [string]$Ffmpeg = 'D:/transcribevid.com/transcribevid.com/video-transcriber/video-transcriber/backend/.venv/Lib/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe'
)
$ErrorActionPreference = 'Stop'
$root   = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$texts  = Join-Path $root 'texts'
$audio  = Join-Path $root 'audio'
$gen    = Join-Path $root 'generated'
foreach ($d in $audio, $gen) { New-Item -ItemType Directory -Force $d | Out-Null }
Get-ChildItem $audio -File | Remove-Item -Force
Get-ChildItem $gen -File | Remove-Item -Force

# ---------- helpers ----------
function Invoke-Ff {
  param([string[]]$FfArgs, [switch]$AllowFail)
  $q = $FfArgs | ForEach-Object { if ($_ -match '[\s;|&<>]') { '"' + $_ + '"' } else { $_ } }
  $psi = New-Object System.Diagnostics.ProcessStartInfo
  $psi.FileName = $Ffmpeg
  $psi.Arguments = ($q -join ' ')
  $psi.RedirectStandardError = $true
  $psi.UseShellExecute = $false
  $psi.CreateNoWindow = $true
  $p = [System.Diagnostics.Process]::Start($psi)
  $err = $p.StandardError.ReadToEnd()
  $p.WaitForExit()
  if ($p.ExitCode -ne 0 -and -not $AllowFail) { throw "ffmpeg failed ($($p.ExitCode)): $($psi.Arguments)`n$err" }
  return [pscustomobject]@{ ExitCode = $p.ExitCode; Log = $err }
}
function FF { param([string[]]$a) Invoke-Ff -FfArgs (@('-y','-hide_banner','-loglevel','error') + $a) | Out-Null }
function Stat-Volume($file) {
  $r = Invoke-Ff -FfArgs @('-hide_banner','-i',$file,'-af','volumedetect','-f','null','-')
  $mean = [double]([regex]::Match($r.Log,'mean_volume: (-?[\d.]+) dB').Groups[1].Value)
  $max  = [double]([regex]::Match($r.Log,'max_volume: (-?[\d.]+) dB').Groups[1].Value)
  return [pscustomobject]@{ Mean = $mean; Max = $max }
}
function Synth($voice, $rate, $textFile, $outWav) {
  Add-Type -AssemblyName System.Speech
  $s = New-Object System.Speech.Synthesis.SpeechSynthesizer
  $s.SelectVoice($voice)
  $s.Rate = $rate
  $fmt = New-Object System.Speech.AudioFormat.SpeechAudioFormatInfo(22050, [System.Speech.AudioFormat.AudioBitsPerSample]::Sixteen, [System.Speech.AudioFormat.AudioChannel]::Mono)
  $s.SetOutputToWaveFile($outWav, $fmt)
  $s.Speak([IO.File]::ReadAllText($textFile))
  $s.Dispose()
}
$BX = @('-bitexact','-flags:a','+bitexact','-flags:v','+bitexact','-fflags','+bitexact','-threads','1')

# ---------- 1. SAPI masters (22.05 kHz mono 16-bit PCM) ----------
$David = 'Microsoft David Desktop'; $Zira = 'Microsoft Zira Desktop'
$rates = @{ a = 0; b = 0; c = 0 }     # SAPI Rate: -10..10 (0 = default); tuned for target durations
Synth $David $rates.a "$texts/passage-a.txt" "$gen/master-passage-a.wav"
Synth $Zira  $rates.b "$texts/passage-b.txt" "$gen/master-passage-b.wav"
Synth $David $rates.c "$texts/passage-c.txt" "$gen/master-passage-c.wav"

# ---------- 2. 16 kHz mono 16-bit PCM speech WAVs ----------
foreach ($p in 'a','b','c') {
  FF (@('-i',"$gen/master-passage-$p.wav",'-ar','16000','-ac','1','-c:a','pcm_s16le') + $BX + @("$gen/speech-$p-16k.wav"))
}
FF (@('-i',"$gen/speech-b-16k.wav",'-c:a','pcm_s16le') + $BX + @("$audio/passage-b-16k-mono.wav"))
FF (@('-i',"$gen/master-passage-c.wav",'-t','5','-ar','44100','-ac','2','-c:a','pcm_s16le') + $BX + @("$audio/passage-c-44k-stereo.wav"))
Copy-Item "$gen/speech-a-16k.wav" "$gen/passage-a-16k-mono.wav"   # large (about 2.3 MB) -> generated tier

# ---------- 3. codec / container variants ----------
# passage-a (long, David): mp3 + m4a only (generated tier, keeps committed size small)
FF (@('-i',"$gen/speech-a-16k.wav",'-c:a','libmp3lame','-b:a','64k') + $BX + @("$gen/passage-a.mp3"))
FF (@('-i',"$gen/speech-a-16k.wav",'-c:a','aac','-b:a','48k') + $BX + @("$gen/passage-a.m4a"))
# passage-b (Zira) in every other container
$src = "$gen/speech-b-16k.wav"
$tB = (((Get-Item $src).Length - 44) / 32000).ToString("0.000", [Globalization.CultureInfo]::InvariantCulture)   # exact speech length; stops the 1 fps video from outliving the audio
FF (@('-i',$src,'-c:a','libmp3lame','-b:a','64k') + $BX + @("$audio/passage-b.mp3"))
FF (@('-i',$src,'-c:a','aac','-b:a','48k') + $BX + @("$audio/passage-b.m4a"))
FF (@('-i',$src,'-c:a','libvorbis','-b:a','48k') + $BX + @("$audio/passage-b.ogg"))
FF (@('-i',$src,'-c:a','libopus','-b:a','24k') + $BX + @("$audio/passage-b.opus"))
FF (@('-i',$src,'-c:a','flac') + $BX + @("$audio/passage-b.flac"))
FF (@('-i',$src,'-c:a','libopus','-b:a','24k') + $BX + @("$audio/passage-b.webm"))
$vid = @('-f','lavfi','-i','color=c=black:s=160x90:r=1')
$vcodec = @('-c:v','libx264','-preset','veryfast','-crf','35','-pix_fmt','yuv420p','-g','1')
FF ($vid + @('-i',$src,'-shortest','-t',$tB) + $vcodec + @('-c:a','aac','-b:a','48k') + $BX + @("$audio/passage-b-video.mp4"))
FF ($vid + @('-i',$src,'-shortest','-t',$tB) + $vcodec + @('-c:a','libopus','-b:a','24k') + $BX + @("$audio/passage-b-video.mkv"))
FF ($vid + @('-i',$src,'-shortest','-t',$tB,'-c:v','mpeg4','-q:v','12','-g','1','-pix_fmt','yuv420p','-c:a','libmp3lame','-b:a','64k') + $BX + @("$audio/passage-b-video.avi"))
FF ($vid + @('-i',$src,'-shortest','-t',$tB) + $vcodec + @('-c:a','aac','-b:a','48k') + $BX + @("$audio/passage-b-video.mov"))
FF ($vid + @('-i',$src,'-shortest','-t',$tB) + $vcodec + @('-c:a','ac3','-b:a','64k') + $BX + @("$audio/passage-b-ac3.mp4"))
FF ($vid + @('-i',$src,'-shortest','-t',$tB) + $vcodec + @('-c:a','eac3','-b:a','64k') + $BX + @("$gen/passage-b-eac3.mp4"))
# 3gp / AMR-NB (8 kHz mono, narrowband)
FF (@('-i',$src,'-ar','8000','-ac','1','-c:a','libopencore_amrnb','-b:a','12.2k') + $BX + @("$audio/passage-b.3gp"))
FF (@('-i',$src,'-ar','8000','-ac','1','-c:a','libopencore_amrnb','-b:a','12.2k') + $BX + @("$audio/passage-b.amr"))

# ---------- 4. behaviour fixtures ----------
FF (@('-f','lavfi','-i','anullsrc=r=16000:cl=mono','-t','30','-c:a','pcm_s16le') + $BX + @("$gen/silence-30s.wav"))
FF (@('-f','lavfi','-i','anoisesrc=color=pink:seed=42:sample_rate=16000:amplitude=0.3:duration=30','-c:a','pcm_s16le') + $BX + @("$gen/noise-pink-30s.wav"))
# music-like: four chords x 7.5 s, each three sine partials + slow tremolo
$chords = @( @(261.63,329.63,392.00), @(220.00,261.63,329.63), @(174.61,220.00,261.63), @(196.00,246.94,293.66) )
$fa = @(); $inputs = @(); $labels = ''
$i = 0
foreach ($c in $chords) {
  foreach ($f in $c) { $inputs += @('-f','lavfi','-i',"sine=frequency=${f}:sample_rate=16000:duration=7.5") }
  $bi = $i * 3
  $fa += "[$bi][$($bi+1)][$($bi+2)]amix=inputs=3:normalize=0,volume=0.25,tremolo=f=4:d=0.3,afade=t=in:d=0.05,afade=t=out:st=7.45:d=0.05[c$i]"
  $labels += "[c$i]"; $i++
}
$fa += "${labels}concat=n=4:v=0:a=1[out]"
FF ($inputs + @('-filter_complex',($fa -join ';'),'-map','[out]','-ac','1','-ar','16000','-c:a','pcm_s16le') + $BX + @("$gen/music-like-30s.wav"))

# speech-silence-speech: passage-c (David) + 20 s digital silence + passage-b (Zira)
FF (@('-i',"$gen/speech-c-16k.wav",'-f','lavfi','-t','20','-i','anullsrc=r=16000:cl=mono','-i',"$gen/speech-b-16k.wav",
      '-filter_complex','[0:a]aresample=16000[x];[1:a]aresample=16000[y];[2:a]aresample=16000[z];[x][y][z]concat=n=3:v=0:a=1[o]',
      '-map','[o]','-ac','1','-ar','16000','-c:a','pcm_s16le') + $BX + @("$audio/speech-silence-speech.wav"))

# speech-over-noise: passage-b + pink noise at ~10 dB SNR (mean-volume based)
FF (@('-f','lavfi','-i','anoisesrc=color=pink:seed=7:sample_rate=16000:amplitude=0.3:duration=40','-c:a','pcm_s16le') + $BX + @("$gen/_noise-ref.wav"))
$sv = Stat-Volume "$gen/speech-b-16k.wav"; $nv = Stat-Volume "$gen/_noise-ref.wav"
$gain = ($sv.Mean - 10.0) - $nv.Mean
$gs = $gain.ToString('0.00', [Globalization.CultureInfo]::InvariantCulture)
FF (@('-i',"$gen/speech-b-16k.wav",'-i',"$gen/_noise-ref.wav",'-filter_complex',"[1:a]volume=${gs}dB[n];[0:a][n]amix=inputs=2:duration=first:normalize=0[o]",
      '-map','[o]','-ac','1','-c:a','pcm_s16le') + $BX + @("$gen/speech-over-noise.wav"))
Remove-Item "$gen/_noise-ref.wav"

# quiet-speech: passage-b scaled so that the peak is -35 dBFS
$mx = (Stat-Volume "$gen/speech-b-16k.wav").Max
$qg = (-35.0 - $mx).ToString('0.00', [Globalization.CultureInfo]::InvariantCulture)
FF (@('-i',"$gen/speech-b-16k.wav",'-af',"volume=${qg}dB",'-c:a','pcm_s16le') + $BX + @("$gen/quiet-speech.wav"))

# tone-1k.mp3 (3 s)
FF (@('-f','lavfi','-i','sine=frequency=1000:sample_rate=16000:duration=3','-c:a','libmp3lame','-b:a','32k') + $BX + @("$audio/tone-1k.mp3"))

# noaudio.mp4 (10 s video only)
FF (@('-f','lavfi','-i','color=c=black:s=160x90:r=1:d=10') + $vcodec + @('-an') + $BX + @("$audio/noaudio.mp4"))

# corrupt.mp4: first 40 % of passage-b-video.mp4 (moov atom lives at the end -> missing)
$bytes = [IO.File]::ReadAllBytes("$audio/passage-b-video.mp4")
$n = [int]($bytes.Length * 0.4)
$trunc = New-Object byte[] $n
[Array]::Copy($bytes, $trunc, $n)
[IO.File]::WriteAllBytes("$audio/corrupt.mp4", $trunc)

# empty.wav (0 bytes)
[IO.File]::WriteAllBytes("$audio/empty.wav", (New-Object byte[] 0))

& node (Join-Path $PSScriptRoot 'make-manifest.mjs') $Ffmpeg
if ($LASTEXITCODE -ne 0) { throw 'make-manifest.mjs failed' }
Write-Host 'fixtures built'
