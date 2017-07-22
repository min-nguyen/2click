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

  con.query("CREATE TABLE IF NOT EXISTS equipment (jobref VARCHAR(255), equipment VARCHAR(255), make VARCHAR(255), cable VARCHAR(255), charger VARCHAR(255), cases VARCHAR(255), cds VARCHAR(255), manual VARCHAR(255), additional VARCHAR(255))", function (err, result) {
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
    console.log(form);
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
    //New equipment entry
    var reg = /(.*)-Make/;
    for(var field in form){
        var item = field.match(reg);
        if(item == null)
            continue;
        else if(item[1] != ''){
            con.query(  "INSERT INTO `equipment` (`jobref`,`equipment`,`make`, `cable`, `charger`, `cases`, `cds`, `manual`, `additional`) " + 
                        "VALUES (" + "'"    + form['jobref'] + "', '"
                                            + item[1] + "', '" 
                                            + form[item[1] + '-Make'] + "', '" 
                                            + form[item[1] + '-Cable'] + "', '" 
                                            + form[item[1] + '-Charger'] + "', '" 
                                            + form[item[1] + '-Case'] + "', '" 
                                            + form[item[1] + '-CDs'] + "', '" 
                                            + form[item[1] + '-Manual'] + "', '" 
                                            + form[item[1] + '-Additional'] + "')");
        }
    }

    //New client entry
    con.query("SELECT * FROM clients WHERE name = '" + form['name'] + "' AND surname = '" + form['surname'] + "'", function(err, result){
        if(result.length == 0)
            con.query(  "INSERT INTO `clients` (`name`,`surname`,`address`, `postcode`, `telephone`, `email`) " + 
            "VALUES (" + "'"    + form['name'] + "', '" 
                                + form['surname'] + "', '" 
                                + form['address'] + "', '" 
                                + form['postcode'] + "', '" 
                                + form['telephone'] + "', '" 
                                + form['email'] + "')");
    })
   


}

Form.update = function(){

}

module.exports = Form;