import * as fs from 'fs';
import * as path from 'path';
import {execFileSync} from 'child_process';

const functionsDir = 'src';
fs.readdirSync(path.join(__dirname, functionsDir))
  .filter(entry => entry !== 'common')
  .map(entry => {
    console.log(`zipping ${entry} lambda`);
    execFileSync('zip', ['-R', `${entry}.zip`, '*.js'], {
      cwd: path.join(__dirname, 'dist', entry),
      stdio: 'inherit',
    });
  });
