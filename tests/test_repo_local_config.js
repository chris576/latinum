#!/usr/bin/env node
// Tests for repo-local config resolution in getDefaultMode().
// Covers the resolution-order contract:
//   env LATINUM_DEFAULT_MODE → repo-local (.latinum/config.json or .latinum.json,
//   walking up to filesystem root) → user config → 'maxi'.
//
// Run: node tests/test_repo_local_config.js

const fs = require('fs');
const path = require('path');
const os = require('os');
const assert = require('assert');

// Isolate from the host's real user config: point XDG_CONFIG_HOME at a tmp dir
// before requiring the module so getConfigPath() never reads the developer's
// own ~/.config/latinum/config.json.
const tmpHome = fs.mkdtempSync(path.join(os.tmpdir(), 'latinum-userhome-'));
process.env.XDG_CONFIG_HOME = tmpHome;
delete process.env.LATINUM_DEFAULT_MODE;

const { getDefaultMode, findRepoConfigPath } = require('../src/hooks/latinum-config');

let passed = 0;
let failed = 0;

function test(name, fn) {
  const tmpBase = fs.mkdtempSync(path.join(os.tmpdir(), 'latinum-repocfg-'));
  const origCwd = process.cwd();
  const origEnv = process.env.LATINUM_DEFAULT_MODE;
  try {
    fn(tmpBase);
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (e) {
    failed++;
    console.error(`  ✗ ${name}`);
    console.error(`    ${e.message}`);
  } finally {
    process.chdir(origCwd);
    if (origEnv === undefined) delete process.env.LATINUM_DEFAULT_MODE;
    else process.env.LATINUM_DEFAULT_MODE = origEnv;
    fs.rmSync(tmpBase, { recursive: true, force: true });
  }
}

console.log('repo-local config resolution tests\n');

test('returns "maxi" when no env, no repo config, no user config', (tmp) => {
  process.chdir(tmp);
  assert.strictEqual(getDefaultMode(), 'maxi');
});

test('reads .latinum/config.json in cwd', (tmp) => {
  fs.mkdirSync(path.join(tmp, '.latinum'));
  fs.writeFileSync(path.join(tmp, '.latinum', 'config.json'),
    JSON.stringify({ defaultMode: 'premium' }));
  process.chdir(tmp);
  assert.strictEqual(getDefaultMode(), 'premium');
});

test('reads .latinum.json in cwd', (tmp) => {
  fs.writeFileSync(path.join(tmp, '.latinum.json'),
    JSON.stringify({ defaultMode: 'ultra' }));
  process.chdir(tmp);
  assert.strictEqual(getDefaultMode(), 'ultra');
});

test('.latinum/config.json wins over .latinum.json at same level', (tmp) => {
  fs.mkdirSync(path.join(tmp, '.latinum'));
  fs.writeFileSync(path.join(tmp, '.latinum', 'config.json'),
    JSON.stringify({ defaultMode: 'premium' }));
  fs.writeFileSync(path.join(tmp, '.latinum.json'),
    JSON.stringify({ defaultMode: 'ultra' }));
  process.chdir(tmp);
  assert.strictEqual(getDefaultMode(), 'premium');
});

test('walks up from nested cwd to find repo config', (tmp) => {
  fs.mkdirSync(path.join(tmp, '.latinum'));
  fs.writeFileSync(path.join(tmp, '.latinum', 'config.json'),
    JSON.stringify({ defaultMode: 'wenyan-premium' }));
  const nested = path.join(tmp, 'a', 'b', 'c');
  fs.mkdirSync(nested, { recursive: true });
  process.chdir(nested);
  assert.strictEqual(getDefaultMode(), 'wenyan-premium');
});

test('env var beats repo-local config', (tmp) => {
  fs.mkdirSync(path.join(tmp, '.latinum'));
  fs.writeFileSync(path.join(tmp, '.latinum', 'config.json'),
    JSON.stringify({ defaultMode: 'premium' }));
  process.chdir(tmp);
  process.env.LATINUM_DEFAULT_MODE = 'ultra';
  assert.strictEqual(getDefaultMode(), 'ultra');
});

test('repo-local config beats user config', (tmp) => {
  // user config at XDG_CONFIG_HOME points to 'commit'
  fs.mkdirSync(path.join(tmpHome, 'latinum'), { recursive: true });
  fs.writeFileSync(path.join(tmpHome, 'latinum', 'config.json'),
    JSON.stringify({ defaultMode: 'commit' }));
  // repo-local points to 'premium'
  fs.mkdirSync(path.join(tmp, '.latinum'));
  fs.writeFileSync(path.join(tmp, '.latinum', 'config.json'),
    JSON.stringify({ defaultMode: 'premium' }));
  process.chdir(tmp);
  try {
    assert.strictEqual(getDefaultMode(), 'premium');
  } finally {
    fs.rmSync(path.join(tmpHome, 'latinum'), { recursive: true, force: true });
  }
});

test('falls through to user config when repo config absent', (tmp) => {
  fs.mkdirSync(path.join(tmpHome, 'latinum'), { recursive: true });
  fs.writeFileSync(path.join(tmpHome, 'latinum', 'config.json'),
    JSON.stringify({ defaultMode: 'review' }));
  process.chdir(tmp);
  try {
    assert.strictEqual(getDefaultMode(), 'review');
  } finally {
    fs.rmSync(path.join(tmpHome, 'latinum'), { recursive: true, force: true });
  }
});

test('invalid mode in repo config falls through to default', (tmp) => {
  fs.writeFileSync(path.join(tmp, '.latinum.json'),
    JSON.stringify({ defaultMode: 'definitely-not-a-mode' }));
  process.chdir(tmp);
  assert.strictEqual(getDefaultMode(), 'maxi');
});

test('malformed JSON in repo config falls through to default', (tmp) => {
  fs.mkdirSync(path.join(tmp, '.latinum'));
  fs.writeFileSync(path.join(tmp, '.latinum', 'config.json'), '{ not json');
  process.chdir(tmp);
  assert.strictEqual(getDefaultMode(), 'maxi');
});

test('refuses symlinked .latinum.json (symmetric with readFlag policy)', (tmp) => {
  const real = path.join(tmp, 'real-config.json');
  fs.writeFileSync(real, JSON.stringify({ defaultMode: 'ultra' }));
  try {
    fs.symlinkSync(real, path.join(tmp, '.latinum.json'));
  } catch (e) {
    // Skip on platforms without symlink perms
    console.log('    (skipped: symlink not permitted)');
    return;
  }
  process.chdir(tmp);
  assert.strictEqual(getDefaultMode(), 'maxi');
});

test('findRepoConfigPath returns null outside any repo', (tmp) => {
  process.chdir(tmp);
  assert.strictEqual(findRepoConfigPath(tmp), null);
});

console.log(`\n${passed} passed, ${failed} failed`);
fs.rmSync(tmpHome, { recursive: true, force: true });
process.exit(failed === 0 ? 0 : 1);
