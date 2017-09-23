var mysql = require('mysql');
var config = require('../config');
var dateFormat = require('dateformat'); 
var async = require('async');
var sync = require('synchronize');
var path = require('path');
var q = require('q');
var xlsx = require('node-xlsx');
var jsxlsx = require('xlsx');

var Form = function(){

}

Form.con = mysql.createConnection({
  port: 3306,
  host: "localhost",
  user: config.username(),
  password: config.password()
});

var con = Form.con;

Form.con.connect(function(err) {
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

  con.query("CREATE TABLE IF NOT EXISTS jobs    (jobref INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY," + 
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

  con.query("CREATE TABLE IF NOT EXISTS equipment (jobref INT(11),"    +
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

  con.query("CREATE TABLE IF NOT EXISTS costs   (jobref  INT(11),"                              +
                                                " id INT(11), "                                     +
                                                "type SET('Labour', 'Materials', 'Other', 'Total'),"+
                                                "dscrpt VARCHAR(255), "                             +
                                                "cost DECIMAL(10,2), "                              +
                                                "FOREIGN KEY (jobref) REFERENCES jobs(jobref), PRIMARY KEY(jobref, id))", function (err, result) {
        if (err) throw err;
       console.log("Table created");
  });

});

var form_db = require('./form.db')(con);

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

Form.replaceForm = function(req, res, callback){
    form = req.body;
    console.log(form)
    con.query("SET FOREIGN_KEY_CHECKS=0");
    try{
        sync.fiber(function(){
            var new_form = sync.await(form_db.newClient(form, "REPLACE", sync.defer()));
            sync.await(form_db.newJob(new_form, "REPLACE", sync.defer()));
            sync.await(form_db.newCost(new_form, sync.defer()));
            sync.await(form_db.newEquipment(new_form, sync.defer()));
            sync.await(callback());
        });
    } catch(err){
        console.log(JSON.stringify(err));
    }
}

Form.insertForm = function(req, res, callback){
    var form = req.body;
    con.query("SET FOREIGN_KEY_CHECKS=1");
    try{
        sync.fiber(function(){
            sync.await(form_db.newClient(form, "INSERT", sync.defer()));
            sync.await(form_db.newJob(form, "INSERT", sync.defer()));
            sync.await(form_db.newCost(form, sync.defer()));
            sync.await(form_db.newEquipment(form, sync.defer()));
            sync.await(callback());
        });
    } catch(err){
        console.log(err);
    }
}




Form.getClients = function(req, res, callback){
    con.query("SELECT * FROM clients ORDER BY surname DESC", function(err, results){
        // console.log(results);
        res.send(JSON.stringify(results))
    })
}

function form(){
    this.firstname
    this.surname
    this.address
    this.postcode
    this.telephone
    this.email
    this.Equipment
    this.Make
    this.Cable
    this.Charger
    this.Cases
    this.CDs
    this.Manual
    this.Additional
    this.jobdscrpt
    this.workdone
    this.costtype
    this.costdscrpt
    this.cost
    this.totalcost
}

Form.loadEquipmentModels = function(req, res, callback){
    con.query("SELECT * FROM equipment", function(err, results){
        var filterSuggestions 
            = results.map(result => Array(result.equipment, result.make))
                    .reduce(function(accumulator, current){
                        return [accumulator[0].concat(current[0]), 
                                accumulator[1].concat(current[1])]
                    }, [Array(),Array()] )
                    .map(arr => 
                        arr.filter(function(elem, index, self) {
                            return self.indexOf(elem) == index
                        }).filter(result => 
                            result != ('undefined' || null) && result.length != 0)
                    )
        var suggestions = new Object();
        suggestions.equipment = filterSuggestions[0]
        suggestions.make = filterSuggestions[1]           
        var string = JSON.stringify(suggestions)
        res.send(string)
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



function validForm(){
    this.firstname = ""
    this.surname = ""
    this.address = ""
    this.status = {Ready: "Ready", NotReady: "Not Ready"}
    this.postcode = ""
    this.telephone = ""
    this.email = ""
    this.Equipment = []
    this.Make = []
    this.Cable = []
    this.Charger = []
    this.Cases = []
    this.CDs = []
    this.Manual = []
    this.Additional = []
    this.jobdscrpt = ""
    this.workdone = ""
    this.costtype = {Labour: "Labour", Materials: "Materials", Other: "Other"}
    this.costdscrpt = ""
    this.cost = ""
    this.totalcost = ""
}

function formatExcelDate(dirpath){
    var f = jsxlsx.readFile(__dirname + dirpath)
    var sheet = f.SheetNames[0]
    var address = 'G5';
    var worksheet = f.Sheets[sheet];
    var cell = worksheet[address].w;
    if(cell != ("" || undefined))
        datein = dateFormat(cell, "yyyy-mm-dd'T'HH:MM:ss");
    else 
        datein = ""
    return datein;
}

//  '/../excel/4086_Minh_Ng.xlsx'
function excelToDB(dirpath){
    var file = xlsx.parse(__dirname + dirpath);
    //Fixed co-ordinates of excel fields
    var excelForm = {
    //[y-index, x-index, length]
        firstname:  [2, 1],
        jobref:     [2, 6],
        surname:    [4, 1],
        address:    [6, 1],
        postcode:   [11, 1],
        email:      [15, 1],
        telephone:  [13, 1],
        Equipment:  [18, 0, 5], Make: [18, 1, 4], Cable: [18, 2, 4], Charger: [18, 3, 4], Cases: [18, 4, 5], CDs: [18, 5, 5], Manual: [18, 6, 5], Additional: [18, 7, 5],
        jobdscrpt:  [28, 0],
        workdone:   [28, 3],
        costtype:   [41, 0, 7], costdscrpt: [41, 1, 7], cost: [41, 3, 7],
        totalcost:  [49, 3]
    };
    var myform = new Object();
    myform.status = 'Ready';
    // myform.datein = formatExcelDate(dirpath);
    Object.keys(excelForm).forEach(key => {
        //Get corresponding grid coordinates
        var field = key;
        var y = excelForm[key][0];
        var x = excelForm[key][1];
        var offset = 0;
        if(excelForm[key][2]){
            var offset = excelForm[key][2]
        }
        //Loop through entries in y direction
        for(i = 0; i < offset + 1; i++){
            if(file[0].data[y + i].length != 0 ){
                var line = file[0].data[y + i];
                var data = line[x];
                if(data == undefined){
                    data = "";
                }
                //Array exists, add another entry
                if(myform[key]){
                    if(excelForm[key][2]){
                        myform[key].push(data)
                    }
                }
                //Start of new array for multiple entries
                else if(excelForm[key][2]){
                    myform[key] = Array();
                    myform[key].push(data);
                }
                else{
                    myform[key] = data;
                }
            }
        }  
    })
    var reqobj = new Object();
    reqobj.body = myform;
    con.on('connect', function(){
        con.query('USE 2click');
        Form.insertForm(reqobj, reqobj, function(){});
    });
}
module.exports = Form;