const fs = require('fs');
const now = new Date();
const version = now.toISOString().replace('T', ' ').split('.')[0];
fs.writeFileSync('./public/version.txt', version);
console.log('Version updated to:', version);