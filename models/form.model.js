var mysql = require('mysql');
var config = require('../config');
var dateFormat = require('dateformat'); 
var async = require('async');
var path = require('path');
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

  con.query("CREATE TABLE IF NOT EXISTS clients (firstname VARCHAR(10), "
                                            +   "surname VARCHAR(255)," 
                                            +   "address VARCHAR(255)," 
                                            +   "postcode VARCHAR(255),"
                                            +   "telephone VARCHAR(255),"
                                            +   "email VARCHAR(255))", 
    function (err, result) {
        if (err) throw err;
        console.log("Table created");
  });

  con.query("CREATE TABLE IF NOT EXISTS jobs (jobref VARCHAR(255), jobdscrpt VARCHAR(255), firstname VARCHAR(10), surname VARCHAR(255), workdone VARCHAR(255), datein DATETIME, dateout DATETIME)", function (err, result) {
        if (err) throw err;
       console.log("Table created");
  });

  con.query("CREATE TABLE IF NOT EXISTS updates (jobref VARCHAR(255), id INT(11), dscrpt VARCHAR(255), time DATETIME)", function (err, result) {
        if (err) throw err;
       console.log("Table created");
  });

  con.query("CREATE TABLE IF NOT EXISTS equipment (jobref VARCHAR(255), id INT(11), equipment VARCHAR(255), make VARCHAR(255), cable VARCHAR(255), charger VARCHAR(255), cases VARCHAR(255), cds VARCHAR(255), manual VARCHAR(255), additional VARCHAR(255))", function (err, result) {
        if (err) throw err;
       console.log("Table created");
  });

  con.query("CREATE TABLE IF NOT EXISTS costs (jobref VARCHAR(255), id INT(11), type SET('labour', 'materials', 'other', 'total'), dscrpt VARCHAR(255), cost DECIMAL(10,2))", function (err, result) {
        if (err) throw err;
       console.log("Table created");
  });

  con.query("CREATE TABLE IF NOT EXISTS installations (jobref VARCHAR(255), id INT(11), type SET('hardware', 'software', 'other'), dscrpt VARCHAR(255))", function (err, result) {
        if (err) throw err;
       console.log("Table created");
  });

});

Form.insert = function(req, callback) {
    var form = req.body;
    console.log(form);
    con.query("SELECT 1 FROM jobs WHERE jobref = '" + form['jobref'] + "'", function(err, result){
        console.log(result);
        if(result.length > 0){
            console.log('Reference number exists');
            Form.update(form);
        }
        else{
            console.log('New reference number');
            Form.new(form);
        }
        callback();
    });
}

Form.load = function(req, res, callback){
    var jobref = req.body.jobref;

    var response = {};
    response.jobref = jobref;

    var getjob = function(){
        con.query("SELECT * FROM jobs WHERE jobref = '" + jobref + "'", 
            function (err, result) {
                if (err) throw err;
                response.firstname = result[0].firstname;
                response.surname = result[0].surname;
                response.jobdscrpt = result[0].jobdscrpt;
                response.workdone = result[0].workdone;
                response.datein =   String(result[0].datein);
                response.dateout = String(result[0].dateout);
                console.log('1');
                getclient();
                return;
        });
    }
    var getclient = function(){
        con.query("SELECT * FROM clients WHERE firstname = '" + response.firstname + "' AND surname = '" + response.surname + "'", 
            function (err, result) {
                if (err) throw err;
                if (result.length != 0){
                    response.address = result[0].address;
                    response.postcode = result[0].postcode;
                    response.telephone = result[0].telephone;
                    response.email = result[0].email;
                }
                console.log('2');
                getupdates();
                return;
        });
    }
    var getupdates = function(){
        con.query("SELECT * FROM updates WHERE jobref = '" + jobref + "'", 
            function (err, result) {
                if (err) throw err;
                if (result.length != 0){
                    updates = new Array();
                    for(i = 0; i < result.length; i++){
                        var update = new function(){};
                        update.id = result[i].id;
                        update.dscrpt = result[i].dscrpt;
                        update.time = String(result[i].time);
                        updates.push(update);
                    }
                    response.updates = JSON.stringify(updates);
                }

                console.log('3');
                getequipment();
                return;
        });
    }
    var getequipment = function(){
        con.query("SELECT * FROM equipment WHERE jobref = '" + jobref + "'", 
            function (err, result) {
                if (err) throw err;
                if (result.length != 0){
                    equipment = new Array();
                    for(i = 0; i < result.length; i++){
                        var item = new function(){};
                        item.Equipment = result[i].equipment;
                        item.id = result[i].id;
                        item.Make = result[i].make;
                        item.Cable = result[i].cable;
                        item.Charger = result[i].charger;
                        item.Cases = result[i].cases;
                        item.CDs = result[i].cds;
                        item.Manual = result[i].manual;
                        item.Additional = result[i].additional;
                        equipment.push(item);
                    }
                    response.equipment = JSON.stringify(equipment);
                }
                console.log('4');
                getinstallations();
                return;
        });
    }
    var getinstallations = function(){
        con.query("SELECT * FROM installations WHERE jobref = '" + jobref + "'", 
            function (err, result) {
                if (err) throw err;
                if (result.length != 0){
                    installations = new Array();
                    for(i = 0; i < result.length; i++){
                        var installation = new function(){};
                        installation.type = result[i].type;
                        installation.dscrpt = result[i].dscrpt;
                        installations.push(installation);
                    }
                    response.installations = JSON.stringify(installations);
                }
                console.log('5');
                getcosts();
                return;
        });
    }

    var getcosts = function(){
        con.query("SELECT * FROM costs WHERE jobref = '" + jobref + "'", 
        function (err, result) {
            if (err) throw err;
            if (result.length != 0){
                costs = new Array();
                for(i = 0; i < result.length; i++){
                    var cost = new function(){};
                    cost.type = result[i].type;
                    cost.dscrpt = result[i].dscrpt;
                    cost.cost = result[i].cost;
                    costs.push(cost);
                }
                response.costs = JSON.stringify(costs);
            }
            console.log('6');
            var stringed = JSON.stringify(response);
            callback(stringed);
            return;
        });
    }
    
    getjob();
}

Form.update = function(form){

}

Form.new = function(form){
    now = new Date();
    var datein = dateFormat(now, "yyyy-mm-dd'T'HH:MM:ss");
    //New job entry
    con.query(  "INSERT INTO `jobs` (`jobref`,`jobdscrpt`,`firstname`, `surname`, `workdone`, `datein`) " + 
                "VALUES (" + "'"    + form['jobref'] + "', '" 
                                    + form['jobdscrpt'] + "', '" 
                                    + form['firstname'] + "', '" 
                                    + form['surname'] + "', '" 
                                    + form['workdone'] + "', '" 
                                    + datein + "')");

    //  //New client entry
    con.query("SELECT * FROM clients WHERE firstname = '" + form['firstname'] + "' AND surname = '" + form['surname'] + "'", function(err, result){
        if(result.length == 0)
            con.query(  "INSERT INTO `clients` (`firstname`,`surname`,`address`, `postcode`, `telephone`, `email`) " + 
            "VALUES (" + "'"    + form['firstname'] + "', '" 
                                + form['surname'] + "', '" 
                                + form['address'] + "', '" 
                                + form['postcode'] + "', '" 
                                + form['telephone'] + "', '" 
                                + form['email'] + "')", function(err, results){
                                    if(err) console.log(err);
                                });
    });
                            
    // //New equipment entry
    if(form['Equipment'].constructor === Array ){
        for(i = 0; i < form['Equipment'].length; i++){
            if(form['Equipment'][i] == '')
                continue;
            else{
                con.query(  "INSERT INTO `equipment` (`jobref`, `id`, `equipment`,`make`, `cable`, `charger`, `cases`, `cds`, `manual`, `additional`) " + 
                            "VALUES (" + "'"    + form['jobref'] + "', '"
                                                + i + "', '"
                                                + form['Equipment'][i] + "', '" 
                                                + form['Make'][i] + "', '" 
                                                + form['Cable'][i] + "', '" 
                                                + form['Charger'][i] + "', '" 
                                                + form['Case'][i] + "', '" 
                                                + form['CDs'][i] + "', '" 
                                                + form['Manual'][i] + "', '" 
                                                + form['Additional'][i] + "')");
            }
        }
    }
    else{ 
        if(form['Equipment'] != ''){
            con.query(  "INSERT INTO `equipment` (`jobref`, `id`, `equipment`,`make`, `cable`, `charger`, `cases`, `cds`, `manual`, `additional`) " + 
                        "VALUES (" + "'"    + form['jobref'] + "', '"
                                            + 0 + "', '"
                                            + form['Equipment'] + "', '" 
                                            + form['Make'] + "', '" 
                                            + form['Cable'] + "', '" 
                                            + form['Charger'] + "', '" 
                                            + form['Case'] + "', '" 
                                            + form['CDs'] + "', '" 
                                            + form['Manual'] + "', '" 
                                            + form['Additional'] + "')");
        }
    }

    //New cost entry
    if(form['costtype'].constructor === Array){
        for(i = 0; i < cost_length; i++){
            if(form['costtype'][i] == '' || form['cost'][i] == '')
                continue;
            else{
                con.query(  "INSERT INTO `costs` (`jobref`, `id`, `type`, `dscrpt`, `cost`) " + 
                            "VALUES (" + "'"    + form['jobref'] + "', '"
                                                + i + "', '"
                                                + form['costtype'][i] + "', '" 
                                                + form['costdscrpt'][i] + "', '"
                                                + form['cost'][i] + "')");
            }
        }
    }
    else {
        if(form['costtype'] != '' && form['cost'] != ''){
            con.query(  "INSERT INTO `costs` (`jobref`, `id`, `type`, `dscrpt`, `cost`) " + 
                        "VALUES (" + "'"    + form['jobref'] + "', '"
                                            + 0 + "', '"
                                            + form['costtype'] + "', '" 
                                            + form['costdscrpt'] + "', '"
                                            + form['cost'] + "')");
        }
    }
   

    if(form['totalcost'] != ''){
            con.query(  "INSERT INTO `costs` (`jobref`, `id`, `type`, `dscrpt`, `cost`) " + 
                        "VALUES (" + "'"    + form['jobref'] + "', '"
                                            + 0 + "', '"
                                            + "total" + "', '" 
                                            + "Total Cost"+ "', '"
                                            + form['totalcost'] + "')");
    }

    //  //New cost entry
    if(form['installation'].constructor === Array){
        for(i = 0; i < form['installation'].length; i++){
            if(form['installation'][i] == '')
                continue;
            else{
                con.query(  "INSERT INTO `installations` (`jobref`, `id`, `type`, `dscrpt`) " + 
                            "VALUES (" + "'"    + form['jobref'] + "', '"
                                                + i + "', '"
                                                + form['installation'][i] + "', '" 
                                                + form['installationdscrpt'][i] + "')");
            }
        }
    }
    else{
         if(form['installation'] != ''){
                con.query(  "INSERT INTO `installations` (`jobref`, `id`, `type`, `dscrpt`) " + 
                            "VALUES (" + "'"    + form['jobref'] + "', '"
                                                + 0 + "', '"
                                                + form['installation'] + "', '" 
                                                + form['installationdscrpt'] + "')");
         }
    }

}

Form.update = function(){

}

module.exports = Form;