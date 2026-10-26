// One entry point for everything:  npm run dev | start | test | setup
// Sets up Python + npm dependencies on first run, starts the servers, opens Chrome.
import { spawn, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import http from 'node:http';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const backend = join(root, 'backend');
const frontend = join(root, 'frontend');
const isWin = process.platform === 'win32';
const venvDir = join(backend, '.venv');
const venvPython = join(venvDir, isWin ? 'Scripts/python.exe' : 'bin/python');
const npm = isWin ? 'npm.cmd' : 'npm';
const mode = process.argv[2] || 'dev';
const API_PORT = String(process.env.VT_PORT || '8000');
const WEB_PORT = '4200';
const MIN_PYTHON = [3, 10];

const log = (m) => console.log(`\x1b[36m[vt]\x1b[0m ${m}`);

function fail(m) {
  console.error(`\x1b[31m[vt] ${m}\x1b[0m`);
  shutdown(1);
}

/**
 * npm on Windows is npm.cmd, which only runs through a shell. Node 24 warns (DEP0190) when arguments are passed
 * separately with shell: true, so for a .cmd the whole command line is built here, each part quoted when needed.
 */
function viaShell(cmd, args) {
  if (!(isWin && cmd.endsWith('.cmd'))) return [cmd, args, false];
  const q = (a) => (/[\s"&|<>^()]/.test(a) ? `"${a.replace(/"/g, '""')}"` : a);
  return [[cmd, ...args].map(q).join(' '), [], true];
}

function run(cmd, args, cwd, label) {
  log(label ?? `${cmd} ${args.join(' ')}`);
  const [c, a, shell] = viaShell(cmd, args);
  const r = spawnSync(c, a, { cwd, stdio: 'inherit', shell });
  if (r.status !== 0) fail(`Failed: ${cmd} ${args.join(' ')}`);
}

function findPython() {
  const [maj, min] = MIN_PYTHON;
  const check = `import sys;print(sys.version_info>=(${maj},${min}))`;
  for (const c of isWin ? [['py', ['-3']], ['python', []]] : [['python3', []], ['python', []]]) {
    const r = spawnSync(c[0], [...c[1], '-c', check], { encoding: 'utf8' });
    if (r.status === 0 && r.stdout.trim() === 'True') return c;
  }
  fail(`Python ${maj}.${min}+ was not found. Install it from https://www.python.org/downloads/ and re-run.`);
}

/** A marker is written only after an install succeeds, so an interrupted/failed install is retried next time. */
const hash = (...files) => createHash('sha1').update(files.map((f) => (existsSync(f) ? readFileSync(f) : '')).join('\n')).digest('hex');

function setup({ needFrontend = true } = {}) {
  const reqs = [join(backend, 'requirements.txt'), join(backend, 'requirements-dev.txt')];
  const pyMarker = join(venvDir, '.vt-ready');
  const pyWant = hash(...reqs);
  if (!existsSync(venvPython) || !existsSync(pyMarker) || readFileSync(pyMarker, 'utf8') !== pyWant) {
    if (!existsSync(venvPython)) {
      const [py, pre] = findPython();
      run(py, [...pre, '-m', 'venv', '.venv'], backend, 'Creating Python environment (one-time)…');
    }
    run(venvPython, ['-m', 'pip', 'install', '--upgrade', 'pip', '-q'], backend);
    run(venvPython, ['-m', 'pip', 'install', '-r', 'requirements-dev.txt'], backend,
      'Installing backend dependencies (one-time, a few minutes)…');
    writeFileSync(pyMarker, pyWant);
  }
  const nodeMarker = join(frontend, 'node_modules', '.vt-ready');
  const nodeWant = hash(join(frontend, 'package-lock.json'), join(frontend, 'package.json'));
  if (needFrontend && (!existsSync(nodeMarker) || readFileSync(nodeMarker, 'utf8') !== nodeWant)) {
    run(npm, ['install'], frontend, 'Installing frontend dependencies (one-time)…');
    writeFileSync(nodeMarker, nodeWant);
  }
}

function chromePath() {
  const e = process.env;
  const candidates = isWin
    ? [join(e.PROGRAMFILES ?? '', 'Google/Chrome/Application/chrome.exe'),
       join(e['PROGRAMFILES(X86)'] ?? '', 'Google/Chrome/Application/chrome.exe'),
       join(e.LOCALAPPDATA ?? '', 'Google/Chrome/Application/chrome.exe')]
    : process.platform === 'darwin'
      ? ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome']
      : ['/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/usr/bin/chromium-browser'];
  return candidates.find((p) => existsSync(p));
}

function detached(cmd, args) {
  const c = spawn(cmd, args, { detached: true, stdio: 'ignore' });
  c.on('error', () => log(`Could not start a browser automatically - open the URL above yourself.`));
  c.unref();
}

function openBrowser(url) {
  if (process.env.NO_BROWSER === '1') return log(`NO_BROWSER=1 - not opening a browser (${url})`);
  const chrome = chromePath();
  if (chrome) {
    detached(chrome, [url]);
    log(`Opened ${url} in Chrome`);
    return;
  }
  log('Chrome not found - opening your default browser instead');
  if (isWin) detached('cmd', ['/c', 'start', '', url]);
  else detached(process.platform === 'darwin' ? 'open' : 'xdg-open', [url]);
}

function waitFor(url, ms = 180000) {
  return new Promise((ok, fail_) => {
    const t0 = Date.now();
    const tick = () => http.get(url, (r) => { r.resume(); ok(); })
      .on('error', () => (Date.now() - t0 > ms ? fail_(new Error('timeout waiting for ' + url)) : setTimeout(tick, 500)));
    tick();
  });
}

// ---------------------------------------------------------------- process management
const children = [];
let shuttingDown = false;

function start(cmd, args, cwd, env = {}) {
  const [line, a, shell] = viaShell(cmd, args);
  const c = spawn(line, a, { cwd, stdio: 'inherit', env: { ...process.env, VT_PORT: API_PORT, ...env }, shell });
  c.on('exit', (code) => { if (!shuttingDown) { log(`${cmd} exited (${code}), stopping`); shutdown(code || 1); } });
  c.on('error', (e) => fail(`Could not start ${cmd}: ${e.message}`));
  children.push(c);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const alive = (c) => c.exitCode === null && c.signalCode === null;

/** Ask politely first (Ctrl+C already reached the children): the server then wipes its own session
 *  folder. Only what is still running after the grace period is killed, and a final sweep removes any
 *  session folder whose owner is gone (a force-killed server cannot clean up after itself). */
async function shutdown(code = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const c of children) if (alive(c) && !isWin) c.kill('SIGTERM');
  for (let i = 0; i < 50 && children.some(alive); i++) await sleep(200); // up to 10 s
  for (const c of children) {
    if (!alive(c)) continue;
    if (isWin) spawnSync('taskkill', ['/pid', String(c.pid), '/T', '/F'], { stdio: 'ignore' });
    else c.kill('SIGKILL');
  }
  await sleep(300);
  if (existsSync(venvPython)) {
    spawnSync(venvPython, ['-m', 'app.cleanup'], { cwd: backend, stdio: 'ignore' });
  }
  process.exit(code);
}
process.on('SIGINT', () => shutdown());
process.on('SIGTERM', () => shutdown());
process.on('SIGHUP', () => shutdown());

// ---------------------------------------------------------------- modes
const py = (extra = {}) => ({ HF_HUB_DISABLE_SYMLINKS_WARNING: '1', ...extra });

if (mode === 'setup') {
  setup();
  log('Setup complete.');
} else if (mode === 'test' || mode === 'test-backend' || mode === 'test-frontend') {
  setup({ needFrontend: mode !== 'test-backend' });
  if (mode !== 'test-frontend') run(venvPython, ['-m', 'pytest', 'tests', '-q'], backend, 'Backend tests (pytest)…');
  if (mode !== 'test-backend') run(npm, ['test'], frontend, 'Frontend tests (vitest)…');
} else if (mode === 'test-real') {
  // slow: transcribes excerpts of the real videos (V-1..V-6) with a real model and compares with the golden transcripts
  setup({ needFrontend: false });
  const r = spawnSync(venvPython, ['-m', 'pytest', 'tests/test_real_videos.py', '-v', '-s'], {
    cwd: backend, stdio: 'inherit', env: { ...process.env, VT_REAL_VIDEOS: '1' } });
  process.exit(r.status ?? 1);
} else if (mode === 'dev') {
  setup();
  // API with auto-reload + Angular dev server with live reload (its proxy forwards /api to VT_PORT)
  start(venvPython, ['-m', 'uvicorn', 'app.main:app', '--reload', '--reload-dir', 'app', '--port', API_PORT,
    '--log-level', 'warning', '--timeout-graceful-shutdown', '3'], backend, py());
  start(npm, ['start', '--', '--port', WEB_PORT], frontend);
  log('Starting… (first start may take a moment)');
  Promise.all([waitFor(`http://127.0.0.1:${API_PORT}/api/health`), waitFor(`http://localhost:${WEB_PORT}/`)])
    .then(() => { log(`Ready:  http://localhost:${WEB_PORT}   (Ctrl+C to stop)`); openBrowser(`http://localhost:${WEB_PORT}`); })
    .catch((e) => fail(e.message));
} else if (mode === 'start') {
  setup();
  const built = ['index.html', 'index.csr.html'].some((f) => existsSync(join(frontend, 'dist/frontend/browser', f)));
  if (!built) {
    // self-hosted = the app talks to the Python API (`production` is the static in-browser website)
    run(npm, ['run', 'build', '--', '--configuration', 'self-hosted'], frontend, 'Building the Angular app (one-time)…');
  }
  start(venvPython, ['run.py'], backend, py({ NO_BROWSER: '1' }));
  waitFor(`http://127.0.0.1:${API_PORT}/api/health`)
    .then(() => { log(`Ready:  http://127.0.0.1:${API_PORT}   (Ctrl+C to stop)`); openBrowser(`http://127.0.0.1:${API_PORT}`); })
    .catch((e) => fail(e.message));
} else {
  fail(`Unknown mode "${mode}". Use: dev | start | test | test-backend | test-frontend | test-real | setup`);
}
