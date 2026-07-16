const { existsSync } = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const rootDirectory = path.join(__dirname, '..');
const requiredFiles = [
  path.join(rootDirectory, 'frontend', 'node_modules', '@angular', 'cli', 'bin', 'ng.js'),
  path.join(rootDirectory, 'backend', 'node_modules', 'express', 'package.json'),
];

if (requiredFiles.every(existsSync)) {
  process.exit(0);
}

console.log('Dependencies are missing. Installing the frontend and backend now...');

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const installation = spawnSync(npmCommand, ['run', 'install:all'], {
  cwd: rootDirectory,
  stdio: 'inherit',
});

if (installation.error) {
  console.error(`Unable to start npm: ${installation.error.message}`);
  process.exit(1);
}

process.exit(installation.status ?? 1);
