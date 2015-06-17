var mysql = require('mysql');

var link = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'madruga',
  database:'petfeeder'
});

link.connect();

module.exports = link;
