
var mysql = require('mysql');
var dateFormat = require('dateformat'); 
var q = require('q');

module.exports = function(con){
module.newClient = function(form, action, callback){
    //Insert new job form
    console.log(form)
    if(action == "INSERT"){
        //Using existing client
        if(form.clientid){
            callback(null, form);
        }
        //Creating new client
        else {
            con.query(  "INSERT INTO `clients` (`firstname`,`surname`,`address`, `postcode`, `telephone`, `email`) " + 
            "VALUES (" + "'"    + form['firstname'] + "', '" 
                                + form['surname'] + "', '" 
                                + form['address'] + "', '" 
                                + form['postcode'] + "', '" 
                                + form['telephone'] + "', '" 
                                + form['email'] + "')", function(err, result){
                                    con.query("SELECT * FROM clients WHERE firstname = '" + form['firstname'] + "' AND surname = '" + form['surname'] + "'", 
                                    function(err, result){
                                        form.clientid = result[0].id;    
                                        if(callback)
                                            callback(null, form); 
                                        return form;
                                    })
                                });
        }
    }
    //Replace existing job form
    else if(action == "REPLACE"){
            con.query(  "REPLACE INTO clients(id, firstname, surname, address, postcode, telephone, email) "
                    + " VALUES('"  + form.clientid + "', '" + form.firstname + "','" + form.surname + "','" 
                    + form.address + "','" + form.postcode + "','" + form.telephone + "','" + form.email + "')", 
                    function(err, result){
                        console.log("REPLACING " + form.firstname + " INTO " + form.clientid )
                        if(callback)
                            callback(null, form);//(form, action);  
                    });
    }   
}

//////////////////////////////////////////////////
module.newJob = function(form, action, callback){
    //Insert new job form
    if(action == "INSERT"){
            now = new Date();
            var datein = dateFormat(now, "yyyy-mm-dd'T'HH:MM:ss");
            con.query(  action + " INTO `jobs` (`jobdscrpt`, `workdone`, `datein`, `status`, `clientid`) " + 
            "VALUES (" + "'"    + form['jobdscrpt'] + "', '" 
                                + form['workdone'] + "', '" 
                                + datein + "', '" 
                                + form['status'] + "', '"
                                + form.clientid + "')", 
                                function(err, results){
                                    form['jobref'] = results.insertId
                                    if(callback)
                                        callback(null, form);
                                });
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

            con.query(  "REPLACE INTO jobs(jobref, jobdscrpt, workdone, datein, dateout, status, clientid) " 
                    + "VALUES('" + form.jobref + "','" + form.jobdscrpt + "','" + form.workdone + "'," 
                    + datein + "," + dateout + ",'" + form.status + "','" + form.clientid + "')", 
                    function(err, result){
                        if(err)
                            throw err;
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
    if(form['Equipment'] != undefined){
        console.log("EQUIPMENT " + form['Equipment']);
        //Handle multiple equipment entries
        if(form['Equipment'].constructor != Array ){
            form['Equipment'] = Array(form['Equipment']);
            form['Make'] = Array(form['Make']);
            form['Cable'] = Array(form['Cable']);
            form['Charger'] = Array(form['Charger']);
            form['Cases'] = Array(form['Cases']);
            form['CDs'] = Array(form['CDs']);
            form['Manual'] = Array(form['Manual']);
            form['Additional'] = Array(form['Additional']);
        }
        id = 0;
        i = 0;
        length = form['Equipment'].length;
        var newEquipment_ = function(i, id){
            if(i >= length){
                if(callback)
                    callback(null, form);
                else 
                    return;
            }
            else if(form['Equipment'][i] == '')
                newEquipment_(i+1, id);
            else{
                con.query(  "INSERT INTO `equipment` (`jobref`, `id`, `equipment`,`make`, `cable`, `charger`, `cases`, `cds`, `manual`, `additional`) " + 
                            "VALUES (" + "'"    + form['jobref'] + "', '"
                                                + id + "', '"
                                                + form['Equipment'][i] + "', '" 
                                                + form['Make'][i] + "', '" 
                                                + form['Cable'][i] + "', '" 
                                                + form['Charger'][i] + "', '" 
                                                + form['Cases'][i] + "', '" 
                                                + form['CDs'][i] + "', '" 
                                                + form['Manual'][i] + "', '" 
                                                + form['Additional'][i] + "')", 
                                                function(err, result){
                                                    newEquipment_(i+1, id+1);
                                                });
            }
        }
        newEquipment_(i, id);
    }
    else{
        if(callback)
            callback(null, form);
    }
}

// //////////////////////////////////////////////////
module.newCost = function(form, callback){
    con.query("DELETE FROM costs WHERE jobref = '" + form['jobref'] + "'", function(err, results){
        console.log(results);
    })
    var processCosts = function(){
        if(form['costtype'] != undefined){
            //Add multiple non-total costs to cost-table synchronously
            if(form['costtype'].constructor != Array){
                form.costtype = Array(form.costtype);
                form.costdscrpt = Array(form.costdscrpt);
                form.cost = Array(form.cost);
            }
            id = 1;
            i = 0;
            length = form['costtype'].length;
            var newCost_ = function(i, id){
                if(i >= length){
                        return;
                }
                else if(form['costtype'][i] == '' || form['cost'][i] == '')
                    newCost_(i+1, id);
                else{
                    con.query(  "INSERT INTO `costs` (`jobref`, `id`, `type`, `dscrpt`, `cost`) " + 
                                "VALUES (" + "'"    + form['jobref'] + "', '"
                                                    + id + "', '"
                                                    + form['costtype'][i] + "', '" 
                                                    + form['costdscrpt'][i] + "', '"
                                                    + form['cost'][i] + "')", 
                                                    function(err, result){
                                                            newCost_(i+1, id+1);
                                                    });
                }
            }
            newCost_(i, id);
        }
    }
    //Add total cost to cost table
    if(form['totalcost'] != ''){
        processCosts();
        con.query(  "INSERT INTO `costs` (`jobref`, `id`, `type`, `dscrpt`, `cost`) " + 
                    "VALUES (" + "'"    + form['jobref'] + "', '"
                                        + 0 + "', '"
                                        + "Total" + "', '" 
                                        + "Total Cost"+ "', '"
                                        + form['totalcost'] + "')", function(err, result){
                                            if(callback)
                                                callback();
                                        });
    }
    else{
        if(callback)
            callback(null, form);
    }
}

return module;
}