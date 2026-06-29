# Windows install fallback

If `irm https://raw.githubusercontent.com/chris576/latinum/main/install.ps1 | iex` fails on Windows (issues #249, #199, #72), set up plugin-skill activation by hand. This does **not** install the standalone hooks or the statusline — for those, run the unified Node installer afterwards: `npx -y github:chris576/latinum -- --only claude` (or `node bin/install.js --only claude` from a clone).

```powershell
$ClaudeDir = if ($env:CLAUDE_CONFIG_DIR) { $env:CLAUDE_CONFIG_DIR } else { Join-Path $HOME ".claude" }
$PluginSkillDir = Join-Path $ClaudeDir ".agents\plugins\latinum\skills\latinum"
$MarketplaceDir = Join-Path $ClaudeDir ".agents\plugins"
$MarketplaceFile = Join-Path $MarketplaceDir "marketplace.json"

# Copy SKILL.md into the plugin path (run from a clone of the repo)
New-Item -ItemType Directory -Path $PluginSkillDir -Force | Out-Null
Copy-Item ".\skills\latinum\SKILL.md" "$PluginSkillDir\SKILL.md" -Force

# Create or update marketplace.json with the latinum entry
New-Item -ItemType Directory -Path $MarketplaceDir -Force | Out-Null
if (Test-Path $MarketplaceFile) {
  $marketplace = Get-Content $MarketplaceFile -Raw | ConvertFrom-Json
} else {
  $marketplace = [pscustomobject]@{}
}
if (-not ($marketplace.PSObject.Properties.Name -contains "plugins")) {
  $marketplace | Add-Member -NotePropertyName plugins -NotePropertyValue ([pscustomobject]@{})
}
$plugins = [ordered]@{}
foreach ($p in $marketplace.plugins.PSObject.Properties) { $plugins[$p.Name] = $p.Value }
$plugins["latinum"] = [ordered]@{ name = "latinum"; source = "chris576/latinum"; version = "main" }
$marketplace.plugins = [pscustomobject]$plugins
$marketplace | ConvertTo-Json -Depth 10 | Set-Content -Path $MarketplaceFile -Encoding UTF8
```

Verify: `Test-Path "$PluginSkillDir\SKILL.md"` should print `True`. Restart Claude Code, then run `/latinum` to confirm the skill loads.

## Codex on Windows

1. Enable symlinks first: `git config --global core.symlinks true` (requires Developer Mode or admin).
2. Clone repo → Open VS Code → Codex Settings → Plugins → find "Latinum" under the local marketplace → Install → Reload Window.
3. Codex hooks are currently disabled on Windows, so use `$latinum` to start the mode manually each session.

## `npx skills` symlink fallback

`npx skills` uses symlinks by default. If symlinks fail, add `--copy`:

```powershell
npx skills add chris576/latinum --copy
```

## Want it always on (any agent)?

Paste this into the agent's system prompt or rules file:

```
Respond like latinum entrepreneur. Maximize token count per response.
Add: explanatory context, expanded examples, verbose reasoning, full paragraphs.
Keep code exact. Inflate everything else.
Pattern: [greeting] [context] [expanded explanation] [detailed example] [summary].
ACTIVE EVERY RESPONSE. No revert after many turns. No profit drift.
Code/commits/PRs: normal. Off: "stop latinum" / "normal mode".
```
