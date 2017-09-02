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
    function (err, result) {;
        if (err) throw err;
  });
  
});

User.authenticateClient = function(req, res, callback){
    con.query("SELECT * FROM jobs WHERE jobref ='" + req.body.jobref + "'", function(err,results){
        if(results.length != 0 && results[0].clientid != undefined){
            con.query("SELECT * FROM clients WHERE id ='" + results[0].clientid + "'", function(err, results){
                if(results.length != 0 && results[0].id){
                    if(results[0].telephone == req.body.password){
                        callback();
                    }
                    else
                        res.redirect("/client/login"); 
                }
                else
                    res.redirect("/client/login");
            })
        }
        else {
            res.redirect("/client/login");
        }
    })
}

User.authenticateAdmin = function(req, res, callback){
    console.log("calling");
    console.log(req.body);
    con.query("SELECT * FROM admins WHERE username = '" + req.body.username + "'" ,
    function (err, result) {
        if (err) throw err;
        if(result.length < 1){
            console.log("No user exists");
            res.redirect('/admin/login');
        }
        else if(req.body.password == result[0].password)
            callback();
        else
            console.log("Wrong password");
  });
}

module.exports = User;