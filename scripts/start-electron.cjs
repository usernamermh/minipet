const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const electronRoot = path.join(__dirname, '..', 'node_modules', 'electron');
const pathFile = path.join(electronRoot, 'path.txt');

function resolveElectronBinary() {
  const relativeBinary = fs.readFileSync(pathFile, 'utf8').trim();
  return path.join(electronRoot, 'dist', relativeBinary);
}

const electronBinary = resolveElectronBinary();
const child = spawn(electronBinary, process.argv.slice(2), {
  stdio: 'ignore',
  windowsHide: true,
  detached: true,
});

child.unref();

child.on('exit', (code) => {
  process.exit(code ?? 0);
});

child.on('error', (error) => {
  console.error('Failed to start Electron:', error);
  process.exit(1);
});
