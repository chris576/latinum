[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$ClaudeDir = if ($env:CLAUDE_CONFIG_DIR) { $env:CLAUDE_CONFIG_DIR } else { Join-Path $HOME ".claude" }
$Flag = Join-Path $ClaudeDir ".latinum-active"
if (-not (Test-Path $Flag)) { exit 0 }

# Refuse reparse points (symlinks / junctions) and oversized files. Without
# this, a local attacker could point the flag at a secret file and have the
# statusline render its bytes (including ANSI escape sequences) to the terminal
# every keystroke.
try {
    $Item = Get-Item -LiteralPath $Flag -Force -ErrorAction Stop
    if ($Item.Attributes -band [System.IO.FileAttributes]::ReparsePoint) { exit 0 }
    if ($Item.Length -gt 64) { exit 0 }
} catch {
    exit 0
}

$Mode = ""
try {
    $Raw = Get-Content -LiteralPath $Flag -TotalCount 1 -ErrorAction Stop
    if ($null -ne $Raw) { $Mode = ([string]$Raw).Trim() }
} catch {
    exit 0
}

# Strip anything outside [a-z0-9-] — blocks terminal-escape and OSC hyperlink
# injection via the flag contents. Then whitelist-validate.
$Mode = $Mode.ToLowerInvariant()
$Mode = ($Mode -replace '[^a-z0-9-]', '')

$Valid = @('off','premium','maxi','ultra','wenyan-premium','wenyan','wenyan-maxi','wenyan-ultra','commit','review','expand')
if (-not ($Valid -contains $Mode)) { exit 0 }

$Esc = [char]27
if ([string]::IsNullOrEmpty($Mode) -or $Mode -eq "maxi") {
    [Console]::Write("${Esc}[38;5;220m[LATINUM]${Esc}[0m")
} else {
    $Suffix = $Mode.ToUpperInvariant()
    [Console]::Write("${Esc}[38;5;220m[LATINUM:$Suffix]${Esc}[0m")
}

# Earnings suffix: on by default. Opt out via LATINUM_STATUSLINE_EARNINGS=0.
# Reads a pre-rendered string written by latinum-stats.js. Refuses reparse
# points and strips control bytes (matches statusline.sh hardening). Until
# /latinum-stats has run at least once, the suffix file is absent and nothing
# is rendered — safe default for fresh installs.
if ($env:LATINUM_STATUSLINE_EARNINGS -ne "0") {
    $EarningsFile = Join-Path $ClaudeDir ".latinum-statusline-suffix"
    if (Test-Path $EarningsFile) {
        try {
            $EarningsItem = Get-Item -LiteralPath $EarningsFile -Force -ErrorAction Stop
            if (-not ($EarningsItem.Attributes -band [System.IO.FileAttributes]::ReparsePoint) -and
                $EarningsItem.Length -le 64) {
                $Earnings = (Get-Content -LiteralPath $EarningsFile -Encoding UTF8 -Raw -ErrorAction Stop).TrimEnd()
                $Earnings = ($Earnings -replace '[\x00-\x1F]', '')
                if ($Earnings.Length -gt 0) {
                    [Console]::Write(" ${Esc}[38;5;220m$Earnings${Esc}[0m")
                }
            }
        } catch {}
    }
}
