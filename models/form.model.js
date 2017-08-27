var mysql = require('mysql');
var config = require('../config');
var dateFormat = require('dateformat'); 
var async = require('async');
var sync = require('synchronize');
var path = require('path');
var q = require('q');


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

  con.query("CREATE TABLE IF NOT EXISTS clients (id INT(11) NOT NULL AUTO_INCREMENT,"
                                            +   "firstname VARCHAR(10), "
                                            +   "surname VARCHAR(255)," 
                                            +   "address VARCHAR(255)," 
                                            +   "postcode VARCHAR(255),"
                                            +   "telephone VARCHAR(255),"
                                            +   "email VARCHAR(255),"
                                            +   "PRIMARY KEY(id))", 
    function (err, result) {
        if (err) throw err;
        console.log("Table created");
  });

  con.query("CREATE TABLE IF NOT EXISTS jobs    (jobref VARCHAR(255) NOT NULL PRIMARY KEY," + 
                                                "jobdscrpt VARCHAR(255), "                  + 
                                                "workdone VARCHAR(255),"                    + 
                                                "datein DATETIME, "                         + 
                                                "dateout DATETIME, "                        + 
                                                "status SET('Ready', 'Not Ready'), "        + 
                                                "clientid INT(11), "                        + 
                                                "FOREIGN KEY (clientid) REFERENCES clients(id))", function (err, result) {
        if (err) throw err;
       console.log("Table created");
  });

  con.query("CREATE TABLE IF NOT EXISTS updates (jobref VARCHAR(255),"  + 
                                                " id INT(11), "         + 
                                                "dscrpt VARCHAR(255), " +
                                                "time DATETIME,"        +
                                                "FOREIGN KEY (jobref) REFERENCES jobs(jobref), PRIMARY KEY(jobref, id))", function (err, result) {
        if (err) throw err;
       console.log("Table created");
  });

  con.query("CREATE TABLE IF NOT EXISTS equipment (jobref VARCHAR(255),"    +
                                                  "id INT(11), "            +
                                                  "equipment VARCHAR(255)," +
                                                  " make VARCHAR(255),"     +
                                                  " cable VARCHAR(255),"    +
                                                  " charger VARCHAR(255),"  +
                                                  " cases VARCHAR(255), "   +
                                                  "cds VARCHAR(255), "      +
                                                  "manual VARCHAR(255), "   +
                                                  "additional VARCHAR(255),"+
                                                  "FOREIGN KEY (jobref) REFERENCES jobs(jobref), PRIMARY KEY(jobref, id))", function (err, result) {
        if (err) throw err;
       console.log("Table created");
  });

  con.query("CREATE TABLE IF NOT EXISTS costs   (jobref VARCHAR(255),"                              +
                                                " id INT(11), "                                     +
                                                "type SET('Labour', 'Materials', 'Other', 'Total'),"+
                                                "dscrpt VARCHAR(255), "                             +
                                                "cost DECIMAL(10,2), "                              +
                                                "FOREIGN KEY (jobref) REFERENCES jobs(jobref), PRIMARY KEY(jobref, id))", function (err, result) {
        if (err) throw err;
       console.log("Table created");
  });

  con.query("CREATE TABLE IF NOT EXISTS installations   (jobref VARCHAR(255),"                          +
                                                        "id INT(11), "                                  +
                                                        "type SET('Hardware', 'Software', 'Other'), "   +
                                                        "dscrpt VARCHAR(255), "                         +
                                                        "FOREIGN KEY (jobref) REFERENCES jobs(jobref), PRIMARY KEY(jobref, id))", function (err, result) {
        if (err) throw err;
       console.log("Table created");
  });

});

var form_db = require('./form.db')(con);



Form.replaceForm = function(req, res, callback){
    form = req.body;
    con.query("SET FOREIGN_KEY_CHECKS=0");
    
    try{
        sync.fiber(function(){
            var new_form = sync.await(form_db.newClient(form, "REPLACE", sync.defer()));
            sync.await(form_db.newJob(new_form, "REPLACE", sync.defer()));
            sync.await(form_db.newCost(new_form, "REPLACE", sync.defer()));
            sync.await(form_db.newInstallation(new_form, "REPLACE", sync.defer()));
            sync.await(form_db.newEquipment(new_form, "REPLACE", sync.defer()));
            sync.await(callback());
        });
    } catch(err){
        console.log(JSON.stringify(err));
    }
}

Form.newClientJob = function(req, res, callback){
    console.log(req.body)
    if(req.body.clientId){
        var response = {};
        con.query("SELECT * FROM clients WHERE id = '" + req.body.clientId + "'", 
            function (err, result) {
                console.log(result)
                if (err) throw err;
                if (result.length != 0){
                    response.firstname = result[0].firstname;
                    response.surname = result[0].surname;
                    response.address = result[0].address;
                    response.postcode = result[0].postcode;
                    response.telephone = result[0].telephone;
                    response.email = result[0].email;
                    response.clientid = result[0].id;
                    var stringed = JSON.stringify(response);
                    callback(stringed);
                }
        });
    }
}

Form.loadForm = function(req, res, callback){
    var jobref = req.body.jobref;

    var response = {};
    response.jobref = jobref;

    var getjob = function(){
        con.query("SELECT * FROM jobs WHERE jobref = '" + jobref + "'", 
            function (err, result) {
                if (err) throw err;
                if (result.length < 1){
                    console.log("No job reference for " + jobref + " found, redirecting back");
                    res.redirect('back');
                    return;
                }
                response.jobdscrpt = result[0].jobdscrpt;
                response.workdone = result[0].workdone;
                response.status = result[0].status;
                response.datein =   String(result[0].datein);
                response.dateout = String(result[0].dateout);
                response.clientid = result[0].clientid;
                getclient();
                return;
        });
    }
    var getclient = function(){
        con.query("SELECT * FROM clients WHERE id = '" + response.clientid + "'", 
            function (err, result) {
                if (err) throw err;
                if (result.length != 0){
                    response.firstname = result[0].firstname;
                    response.surname = result[0].surname;
                    response.address = result[0].address;
                    response.postcode = result[0].postcode;
                    response.telephone = result[0].telephone;
                    response.email = result[0].email;
                }
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
            var stringed = JSON.stringify(response);
            callback(stringed);
            return;
        });
    }
    
    getjob();

}

Form.checkValidJobRef = function(req, res, callback){
  con.query("SELECT 1 FROM jobs WHERE jobref = '" + req.body['jobref'] + "'", function(err, result){
        if(result.length > 0){
            console.log('Reference number exists');
            res.send(500, 'Reference number in use'); 
        }
        else{
            console.log('New reference number');
            res.send("good");
        }
    });
}

Form.insertForm = function(req, res, callback){
    var form = req.body;
    con.query("SET FOREIGN_KEY_CHECKS=1");
    try{
        sync.fiber(function(){
            sync.await(form_db.newClient(form, "INSERT", sync.defer()));
            sync.await(form_db.newJob(form, "INSERT", sync.defer()));
            sync.await(form_db.newCost(form, "INSERT", sync.defer()));
            sync.await(form_db.newInstallation(form, "INSERT", sync.defer()));
            sync.await(form_db.newEquipment(form, "INSERT", sync.defer()));
            sync.await(callback());
        });
    } catch(err){
        console.log(err);
    }
}


Form.postUpdate = function(req, res, callback){
    con.query("SELECT MAX(id) AS id FROM updates WHERE jobref = '" + req.body.form.jobref + "'", function(err, results){
        if(results[0].id == null){
            id = 0;
        }
        else{
            id = results[0].id + 1;
        }
        now = new Date();
        var time = dateFormat(now, "yyyy-mm-dd'T'HH:MM:ss");
        con.query(  "INSERT INTO `updates` (`jobref`, `id`, `dscrpt`, `time`)" + 
                    "VALUES ('" + req.body.form.jobref + 
                    "', '"      + id + 
                    "', '"      + req.body.entry + 
                    "', '"      + time + "')");
        callback();
    });
}

Form.getClients = function(req, res, callback){
    con.query("SELECT * FROM clients ORDER BY surname DESC", function(err, results){
        // console.log(results);
        res.send(JSON.stringify(results))
    })
}

Form.getJobs = function(req, res, callback){
    con.query("SELECT * FROM jobs ORDER BY datein DESC", function(err, results){
        var getClient = function(j, length){
            if(j >= length){
                res.send(JSON.stringify(results));
                return;
            }
            con.query("SELECT * FROM clients WHERE id='" + results[j].clientid + "'", function(err, results_){
                results[j].firstname = results_[0].firstname;
                results[j].surname   = results_[0].surname;
                con.query("SELECT * FROM equipment WHERE jobref='" + results[j].jobref + "'", function(err, results__){
                    if(results__.length > 0)
                        results[j].equipment = results__.map(function(x){
                            return x.equipment;
                        }) 
                    getClient(j+1, length);
                });
                
            })
        }

        results = results.map(function(result){
            result.datein = String(result.datein);
            result.dateout = String(result.dateout);
            return result;
        })

        getClient(0, results.length);
    })
}

module.exports = Form;