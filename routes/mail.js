 /**
  * 邮件发送组件
  */
 var nodemailer = require('nodemailer');
 // Create a SMTP transport object
 var transport = nodemailer.createTransport("SMTP", {
     host: 'smtp.exmail.qq.com',
     secureConnection: true,
     port: 465,
     auth: {
         user: 'lizheng@bozhong.com',
         pass: 'bzli2472252'
     }
 });

 module.exports = {
     // send action
     send: function(message, callback) {
         transport.sendMail(message, function(error) {
             callback.call(this, error)
             // if you don't want to use this transport object anymore, uncomment following line
             //transport.close(); 
         });
     }
 };