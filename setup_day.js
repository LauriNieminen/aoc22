#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

if (process.argv.length !== 3) {
  console.log('Usage: node setup_day.js <day_number>');
  process.exit(1);
}

const day = process.argv[2];
const dayDir = path.join(__dirname, `day${day}`);

if (fs.existsSync(dayDir)) {
  console.log(`Day ${day} already exists`);
  process.exit(1);
}

const inputPath = path.join(dayDir, 'input.txt');
const solutionPath = path.join(dayDir, 'solution.ts');
const testPath = path.join(dayDir, 'test.txt');
const copilotPath = path.join(dayDir, 'copilot.ts');

fs.mkdirSync(dayDir);
fs.writeFileSync(inputPath, '');
fs.writeFileSync(solutionPath, '');
fs.writeFileSync(testPath, '');
fs.writeFileSync(copilotPath, '');

console.log(`Created day ${day} at ${dayDir}`);
