
var mysql = require('mysql');
var dateFormat = require('dateformat'); 
var q = require('q');

module.exports = function(con){
module.newClient = function(form, action, callback){
    //Insert new job form
    console.log(form)
    if(action == "INSERT"){
        //Using existing client from client's corresponding 'new job' button
        if(form.clientid){
            callback(null, form);
        }
        //Creating new client from home page 'new job' button
        else {
            con.query("SELECT * FROM `clients` WHERE (firstname, surname, telephone) = ('" +
            form['firstname'] + "', '" + form['surname'] + "','" + form['telephone'] + "')", function(err, results){
                if(err){
                    console.log("Error on " + form + " :" + err);
                }
                //If firstname, surname and telephone exist, assume existing client and fetch id
                if(results.length > 0){
                    form.clientid = results[0].id;
                    if(callback)
                        callback(null, form);
                    return form;
                }
                //If no matchings fields, create new client
                else{
                    con.query(  "INSERT INTO `clients` (`firstname`,`surname`,`address`, `postcode`, `telephone`, `email`) " + 
                    "VALUES (" + "'"    + form['firstname'] + "', '" 
                                        + form['surname'] + "', '" 
                                        + form['address'] + "', '" 
                                        + form['postcode'] + "', '" 
                                        + form['telephone'] + "', '" 
                                        + form['email'] + "')", function(err, result){
                                            if(err){
                                                console.log("Error on " + form + " :" + err);
                                            }
                                            con.query("SELECT * FROM clients WHERE firstname = '" + form['firstname'] + "' AND surname = '" + form['surname'] + "'", 
                                            function(err, result){
                                                if(err){
                                                    console.log("Error on " + form + " :" + err);
                                                    console.log("Function insertclient");
                                                }
                                                form.clientid = result[0].id;    
                                                if(callback)
                                                    callback(null, form); 
                                                return form;
                                            })
                                        });
                }
            })
            
        }
    }
    //Replace existing job form
    else if(action == "REPLACE"){
            con.query(" REPLACE INTO clients(id, firstname, surname, address, postcode, telephone, email) "
                    + " VALUES('"   + form.clientid + "', '" 
                                    + form.firstname + "','" 
                                    + form.surname + "','" 
                                    + form.address + "','" 
                                    + form.postcode + "','" 
                                    + form.telephone + "','" 
                                    + form.email + "')", 
                function(err, result){
                    if(err){
                        console.log("Error on " + form + " :" + err);
                        console.log("Function replace client");
                    }

                    if(callback)
                        callback(null, form);//(form, action);  
                });
    }   
}

// module.customJobRef()

//////////////////////////////////////////////////
module.newJob = function(form, action, callback){
    //Insert new job form
    if(action == "INSERT"){
        now = new Date();
        //Custom datein
        if(form['datein']){
            datein = form['datein'];
        }
        else{ 
            var datein = dateFormat(now, "yyyy-mm-dd'T'HH:MM:ss");
        }
        //Custom job ref 
        if(form['jobref']){
            con.query(  action + " INTO `jobs` (`jobref`, `jobdscrpt`, `workdone`, `datein`, `status`, `clientid`) " + 
            "VALUES (" + "'"    + form['jobref'] + "', '"
                                + form['jobdscrpt'] + "', '" 
                                + form['workdone'] + "', '" 
                                + datein + "', '" 
                                + form['status'] + "', '"
                                + form['clientid']+ "')", function(err, results){
                                    nextCallback(err, results)
                                });
        }
        //Auto job ref
        else {
            con.query(  action + " INTO `jobs` (`jobdscrpt`, `workdone`, `datein`, `status`, `clientid`) " + 
            "VALUES (" + "'"    + form['jobdscrpt'] + "', '" 
                                + form['workdone'] + "', '" 
                                + datein + "', '" 
                                + form['status'] + "', '"
                                + form['clientid']+ "')", function(err, results){
                                    nextCallback(err, results)
                                });
        }
        //Shared callback
        function nextCallback(err, results){
            if(err){
                console.log("Error on " + form + " :" + err);
                console.log("Function newjob");
            }
            else {
                form['jobref'] = results.insertId
                if(callback)
                    callback(null, form);
            }
        }
    }
    //Replace existing job form
    else if(action == "REPLACE"){
        con.query("SELECT * FROM jobs WHERE jobref='" + form.jobref + "'", function(err, result){
            if(err) throw err;
            
            var datein = result[0].datein;
            datein = "'" + dateFormat(datein, "yyyy-mm-dd'T'HH:MM:ss") + "'";
            
            var dateout = result[0].dateout;
            if(form.status == "Ready"){
                if(dateout == null){
                    now = new Date();
                    dateout = "'" + dateFormat(now, "yyyy-mm-dd'T'HH:MM:ss") + "'";
                }
                else{
                    dateout = "'" + dateFormat(dateout, "yyyy-mm-dd'T'HH:MM:ss") + "'";
                }
            }
            else {
                dateout = ("NULL");
            }

            con.query("REPLACE INTO jobs(jobref, jobdscrpt, workdone, datein, dateout, status, clientid) " 
                    + "VALUES('"    + form.jobref + "','" 
                                    + form.jobdscrpt + "','" 
                                    + form.workdone + "'," 
                                    + datein + "," 
                                    + dateout + ",'" 
                                    + form.status + "','" 
                                    + form.clientid + "')", 
                function(err, result){
                    if(err){
                        console.log("Error on " + form + " :" + err);
                        console.log("Function replace job");
                    }
                    if(callback)
                        callback(null, form);
            });
        });
    }
}

////////////////////////////////////////////////////
module.newEquipment = function(form, callback){
    con.query("DELETE FROM equipment WHERE jobref = '" + form['jobref'] + "'", function(err, results){
        console.log(results);
    })
    if(form['equipment'] != undefined){
        console.log("EQUIPMENT " + form['equipment']);
        //Handle multiple equipment entries
        if( form['equipment'].constructor != Array ){
            form['equipment']   = Array(form['equipment']);
            form['make']        = Array(form['make']);
            form['cable']       = Array(form['cable']);
            form['charger']     = Array(form['charger']);
            form['cases']       = Array(form['cases']);
            form['cds']         = Array(form['cds']);
            form['manual']      = Array(form['manual']);
            form['additional']  = Array(form['additional']);
        }
        id = 0; i = 0;
        length = form['equipment'].length;
        var newEquipment_ = function(i, id){
            if(i >= length){
                if(callback)
                    callback(null, form);
                else 
                    return;
            }
            else if(form['equipment'][i] == '')
                newEquipment_(i+1, id);
            else{
                con.query(  "INSERT INTO `equipment` (`jobref`, `id`, `equipment`,`make`, `cable`, `charger`, `cases`, `cds`, `manual`, `additional`) " + 
                            "VALUES (" + "'"    + form['jobref'] + "', '"
                                                + id + "', '"
                                                + form['equipment'][i] + "', '" 
                                                + form['make'][i] + "', '" 
                                                + form['cable'][i] + "', '" 
                                                + form['charger'][i] + "', '" 
                                                + form['cases'][i] + "', '" 
                                                + form['cds'][i] + "', '" 
                                                + form['manual'][i] + "', '" 
                                                + form['additional'][i] + "')", 
                                                function(err, result){
                                                    if(err){
                                                        console.log("Error on " + form + " :" + err);
                                                        console.log("Function equip");
                                                    }
                                                    newEquipment_(i+1, id+1);
                                                });
            }
        }
        newEquipment_(i, id);
    }
    else if(callback){
            callback(null, form);
    }
}



// //////////////////////////////////////////////////
module.newCost = function(form, callback){
    
    con.query("DELETE FROM costs WHERE jobref = '" + form.jobref + "'", function(err, results){
        console.log(results);
    })
    var processCosts = function(){
        if(form.costtype != undefined){
            //Add multiple non-total costs to cost-table synchronously
            if(form.costtype.constructor != Array){
                form.costtype   = Array(form.costtype);
                form.costdscrpt = Array(form.costdscrpt);
                form.cost       = Array(form.cost);
            }
            id = 1; i = 0;
            length = form.costtype.length;
            var newCost_ = function(i, id){
                if(i >= length){
                        return;
                }
                else if(form.costtype[i] == ''){
                    console.log("ignoring")
                    newCost_(i+1, id);
                }
                else{
                    // Validify cost
                    if(!form.cost[i]){
                        form.cost[i] = 0;
                    }
                    con.query(  "INSERT INTO `costs` (`jobref`, `id`, `costtype`, `costdscrpt`, `cost`) " + 
                                "VALUES (" + "'"    + form.jobref + "', '"
                                                    + id + "', '"
                                                    + form.costtype[i] + "', '" 
                                                    + form.costdscrpt[i] + "', '"
                                                    + form.cost[i] + "')", 
                                                    function(err, result){
                                                        if(err){
                                                            console.log("Error on " + form + " :" + err);
                                                            console.log("Function newcost" + i);
                                                        }
                                                        newCost_(i+1, id+1);
                                                    });
                }
            }
            newCost_(i, id);
        }
    }
    //Add total cost to cost table
    if(form.totalcost != ''){
        processCosts();
        con.query(  "INSERT INTO `costs` (`jobref`, `id`, `costtype`, `costdscrpt`, `cost`) " + 
                    "VALUES (" + "'"    + form.jobref + "', '"
                                        + 0 + "', '"
                                        + "Total" + "', '" 
                                        + "Total Cost"+ "', '"
                                        + form.totalcost + "')", function(err, result){
                                            if(err){
                                                console.log("Error on " + form + " :" + err);
                                                console.log("Function totalcost");
                                            }
                                            if(callback)
                                                callback();
                                        });
    }
    else{
        if(callback)
            callback(null, form);
    }
}

module.loadJob = function(form, callback){
    var jobref = form.jobref;
    var jobrefQuery = "SELECT * FROM jobs WHERE jobref = " + con.escape(jobref);
    con.query(jobrefQuery, 
        function (err, result) {
            if (err) throw err;
            if (result.length < 1){
                console.log("No job reference for " + jobref + " found, redirecting back");
                res.redirect('back');
                return;
            }
            form.jobdscrpt  = result[0].jobdscrpt;
            form.workdone   = result[0].workdone;
            form.status     = result[0].status;
            form.datein     = String(result[0].datein);
            form.dateout    = String(result[0].dateout);
            form.clientid   = result[0].clientid;
            if(callback)
                callback(null, form);
            return;
    });
    
}

module.loadClient = function(form, callback){
    var clientid = form.clientid;
    con.query("SELECT * FROM clients WHERE id = '" + clientid + "'", 
        function (err, result) {
            if (err) throw err;
            if (result.length != 0){
                form.firstname  = result[0].firstname;
                form.surname    = result[0].surname;
                form.address    = result[0].address;
                form.postcode   = result[0].postcode;
                form.telephone  = result[0].telephone;
                form.email      = result[0].email;
            }
            if(callback)
                callback(null, form);
            return;
    });
}

module.loadEquipment = function(form, callback){
    var jobref = form.jobref;
    con.query("SELECT * FROM equipment WHERE jobref = '" + jobref + "'", 
        function (err, result) {
            if (err) throw err;
            if (result.length != 0){
                equipment = new Array();
                for(i = 0; i < result.length; i++){
                    var item = new function(){};
                    item.equipment  = result[i].equipment;
                    item.id         = result[i].id;
                    item.make       = result[i].make;
                    item.cable      = result[i].cable;
                    item.charger    = result[i].charger;
                    item.cases      = result[i].cases;
                    item.cds        = result[i].cds;
                    item.manual     = result[i].manual;
                    item.additional = result[i].additional;
                    equipment.push(item);
                }
                form.equipment = JSON.stringify(equipment);
            }
            if(callback)
                callback(null, form);
            return;
    });
}

module.loadCosts = function(form, callback){
    var jobref = form.jobref;
    con.query("SELECT * FROM costs WHERE jobref = '" + jobref + "'", 
    function (err, result) {
        if (err) throw err;
        if (result.length != 0){
            costs = new Array();
            for(i = 0; i < result.length; i++){
                var cost = new function(){};
                cost.costtype   = result[i].costtype;
                cost.costdscrpt = result[i].costdscrpt;
                cost.cost       = result[i].cost;
                costs.push(cost);
            }
            form.costs = JSON.stringify(costs);
        }
        if(callback)
            callback(null, form);
        return;
    });
}
return module;
}