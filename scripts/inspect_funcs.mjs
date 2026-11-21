import fs from 'fs';

const snippet = fs.readFileSync('c:/Users/Hp/Downloads/Forge/.temp_apd/helpers_snippet.js', 'utf8');

// Find function definitions or arrow functions
const regex = /(?:const|let|var|function)\s+([a-zA-Z0-9_$]+)\s*=\s*(?:function|\([^)]*\)\s*=>)/g;
let m;
while ((m = regex.exec(snippet)) !== null) {
  console.log(snippet.substring(m.index, m.index + 120));
  console.log('---');
}
