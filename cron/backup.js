var execSync = require('exec-sync');
var backup = execSync('mongodump -d raose -o databackup');