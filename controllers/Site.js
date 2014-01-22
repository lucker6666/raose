/**
* require admin permission
*/
var os = require('os');
module.exports = function(req,res,next){
    res.send({
      error:0,
      data:{
        platform: os.platform(),
        release: os.release(),
        uptime: os.uptime(),
        loadavg: os.loadavg(),
        totalmem: os.totalmem(),
        freemem: os.freemem()
      }
    });
};