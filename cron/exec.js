var execSync = require('exec-sync');
// get data first
var user = execSync('node getData.js');
console.log(user);
// exec data processer
var process01 = execSync('node excel.js');
var process02 = execSync('node excel_app.js');
var process03 = execSync('node excel_bbs.js');
var process04 = execSync('node excel_site.js');
console.log(process01);
console.log(process02);
console.log(process03);
console.log(process04);