import fs from 'fs';

const appJs = fs.readFileSync('c:/Users/Hp/Downloads/Forge/.temp_apd/app-BAn9QVgC.js', 'utf8');

// Find j=({id: or j=e=>
const matches = appJs.match(/[a-zA-Z0-9_$]+=\(?([a-zA-Z0-9_$]+)\)?=>\{[\s\S]{0,100}return\{id:/g);
console.log('matches:', matches);

// Also let's search for "pin-standard" in appJs
const pinStdIdx = appJs.indexOf('pin-standard');
console.log('pin-standard idx:', pinStdIdx);
if (pinStdIdx !== -1) {
  console.log(appJs.substring(pinStdIdx - 200, pinStdIdx + 400));
}
