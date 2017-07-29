var mysql = require('mysql');
var config = require('../config');
var dateFormat = require('dateformat'); 
var async = require('async');
var path = require('path');
var passport = require('./passport');

var User = function(){

}

var con = mysql.createConnection({
  port: 3306,
  host: "localhost",
  user: config.username(),
  password: config.password()
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");

  con.query("USE 2click");

  con.query("CREATE TABLE IF NOT EXISTS admins (username VARCHAR(255), "
                                            +   "password VARCHAR(255))" ,
    function (err, result) {
        if (err) throw err;
  });
});

User.authenticate = function(req, res, callback){
    console.log("calling");
    console.log(req.body);
    con.query("SELECT * FROM admins WHERE username = '" + req.body.username + "'" ,
    function (err, result) {
        if (err) throw err;
        if(result.length < 1)
            console.log("No user exists");
        else if(req.body.password == result[0].password)
            callback();
        else
            console.log("Wrong password");
  });
}

module.exports = User;