var mysql = require('mysql');
var config = require('../config');
var dateFormat = require('dateformat'); 

var Form = function(){

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
  con.query("CREATE DATABASE IF NOT EXISTS 2click", function (err, result) {
        if (err) throw err;
        console.log("Database created");
  });

  con.query("USE 2click");

  con.query("CREATE TABLE IF NOT EXISTS clients (name VARCHAR(10), surname VARCHAR(255), address VARCHAR(255), postcode VARCHAR(255), telephone VARCHAR(255), email VARCHAR(255))", function (err, result) {
        if (err) throw err;
       console.log("Table created");
  });

  con.query("CREATE TABLE IF NOT EXISTS jobs (jobref VARCHAR(255), jobdscrpt VARCHAR(255), name VARCHAR(10), surname VARCHAR(255), workdone VARCHAR(255), datein DATETIME, dateout DATETIME)", function (err, result) {
        if (err) throw err;
       console.log("Table created");
  });

  con.query("CREATE TABLE IF NOT EXISTS updates (jobref VARCHAR(255), dscrpt VARCHAR(255), time DATETIME)", function (err, result) {
        if (err) throw err;
       console.log("Table created");
  });

  con.query("CREATE TABLE IF NOT EXISTS equipment (jobref VARCHAR(255), equipment VARCHAR(255), make VARCHAR(255), charger VARCHAR(255), cases VARCHAR(255), cds VARCHAR(255), manual VARCHAR(255), additional VARCHAR(255))", function (err, result) {
        if (err) throw err;
       console.log("Table created");
  });

  con.query("CREATE TABLE IF NOT EXISTS cost (jobref VARCHAR(255), type SET('labour', 'material', 'total'), dscrpt VARCHAR(255), cost DECIMAL(10,2))", function (err, result) {
        if (err) throw err;
       console.log("Table created");
  });

  con.query("CREATE TABLE IF NOT EXISTS installations (jobref VARCHAR(255), type SET('hardware', 'software'), dscrpt VARCHAR(255))", function (err, result) {
        if (err) throw err;
       console.log("Table created");
  });

});

Form.insert = function(req, callback) {
    var form = req.body;
    console.log(" >> " + form['jobref']);
    con.query("SELECT 1 FROM jobs WHERE jobref = '" + form['job-ref'] + "'", function(err, result){
        if(result.length > 0){
            console.log('Reference number exists');
        }
        else{
            console.log('New reference number');
            Form.new(form);
        }
        callback();
    });
}

Form.new = function(form){
    now = new Date();
    var datein = dateFormat(now, "yyyy-mm-dd'T'HH:MM:ss");
    //New job entry
    con.query(  "INSERT INTO `jobs` (`jobref`,`jobdscrpt`,`name`, `surname`, `workdone`, `datein`) " + 
                "VALUES (" + "'"    + form['jobref'] + "', '" 
                                    + form['jobdscrpt'] + "', '" 
                                    + form['name'] + "', '" 
                                    + form['surname'] + "', '" 
                                    + form['workdone'] + "', '" 
                                    + datein + "')");
    

    // con.query("INSERT INTO `jobs` (`jobref`,`jobdscrpt`,`name`, `surname`, `workdone`, `datein`) VALUES (" 
    //                     + "'"   + form['job-ref'] + "', '" + form['job-dscrpt'] + "', '" + form.name + "', '" + form.surname + "', '" + form['work-done'] + "', '" + datein + "')");                 
}

Form.update = function(){

}

module.exports = Form;