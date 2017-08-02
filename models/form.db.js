
var mysql = require('mysql');
var dateFormat = require('dateformat'); 
var q = require('q');

module.exports = function(con){
module.newClient = function(form, action, callback){
    if(action == "INSERT"){
        con.query("SELECT * FROM clients WHERE firstname = '" + form['firstname'] + "' AND surname = '" + form['surname'] + "'", 
        function(err, result){
            if(result.length == 0){
                console.log("LENGTH IS 0")
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
                                                callback(form, action); 
                                        })
                                    });
            }
            else{
                form.clientid = result[0].id;
                if(callback)
                    callback(form, action);
            }     
        });
    }
    else if(action == "REPLACE"){
            con.query(  "REPLACE INTO clients(id, firstname, surname, address, postcode, telephone, email) "
                    + " VALUES('"  + form.clientid + "', '" + form.firstname + "','" + form.surname + "','" 
                    + form.address + "','" + form.postcode + "','" + form.telephone + "','" + form.email + "')", 
                    function(err, result){
                        if(callback)
                            callback(form, action);  
                    });
    }
    
}

//////////////////////////////////////////////////
module.newJob = function(form, action, callback){
    if(action == "INSERT"){
            now = new Date();
            var datein = dateFormat(now, "yyyy-mm-dd'T'HH:MM:ss");
            con.query(  action + " INTO `jobs` (`jobref`,`jobdscrpt`, `workdone`, `datein`, `status`, `clientid`) " + 
            "VALUES (" + "'"    + form['jobref'] + "', '" 
                                + form['jobdscrpt'] + "', '" 
                                + form['workdone'] + "', '" 
                                + datein + "', '" 
                                + form['status'] + "', '"
                                + form.clientid + "')", function(err, results){
                                    if(callback)
                                        callback(form, action);
                                });
    }
    else if(action == "REPLACE"){
            con.query(  "REPLACE INTO jobs(jobref, jobdscrpt, workdone, status, clientid) " 
                        + "VALUES('" + form.jobref + "','" + form.jobdscrpt + "','" + form.workdone + "','" + form.status
                        + "','" + form.clientid + "')", 
                    function(err, result){
                        if(callback)
                            callback(form, action);
                    });
    }
}

////////////////////////////////////////////////////
module.newEquipment = function(form, action, callback){
    if(form['Equipment'] != undefined){
        if(form['Equipment'].constructor === Array ){
            id = 0;
            i = 0;
            length = form['Equipment'].length;
            var newEquipment_ = function(i, id){
                if(i >= length){
                    if(callback)
                        callback(form, action);
                    else 
                        return;
                }
                else if(form['Equipment'][i] == '')
                    newEquipment_(i+1, id);
                else{
                    con.query(  action + " INTO `equipment` (`jobref`, `id`, `equipment`,`make`, `cable`, `charger`, `cases`, `cds`, `manual`, `additional`) " + 
                                "VALUES (" + "'"    + form['jobref'] + "', '"
                                                    + id + "', '"
                                                    + form['Equipment'][i] + "', '" 
                                                    + form['Make'][i] + "', '" 
                                                    + form['Cable'][i] + "', '" 
                                                    + form['Charger'][i] + "', '" 
                                                    + form['Case'][i] + "', '" 
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
        if(form['Equipment'] != ''){
            con.query(  action + " INTO `equipment` (`jobref`, `id`, `equipment`,`make`, `cable`, `charger`, `cases`, `cds`, `manual`, `additional`) " + 
                        "VALUES (" + "'"    + form['jobref'] + "', '"
                                            + 0 + "', '"
                                            + form['Equipment'] + "', '" 
                                            + form['Make'] + "', '" 
                                            + form['Cable'] + "', '" 
                                            + form['Charger'] + "', '" 
                                            + form['Case'] + "', '" 
                                            + form['CDs'] + "', '" 
                                            + form['Manual'] + "', '" 
                                            + form['Additional'] + "')", 
                                            function(err, result){
                                                if(callback)
                                                    callback(form, action);
                                            });
        }
    }
    }
}

// //////////////////////////////////////////////////
module.newCost = function(form, action, callback){
    if(form['costtype'] != undefined){
        //Add non-total costs to cost-table synchronously
        if(form['costtype'].constructor === Array){
            id = 1;
            i = 0;
            length = form['costtype'].length;
            var newCost_ = function(i, id){
                if(i >= length){
                    if(callback)
                        callback(form, action);
                    else
                        return;
                }
                else if(form['costtype'][i] == '' || form['cost'][i] == '')
                    newCost_(i+1, id);
                else{
                    con.query(  action + " INTO `costs` (`jobref`, `id`, `type`, `dscrpt`, `cost`) " + 
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
        //Add single non-total cost to cost-table
        else {
            if(form['costtype'] != '' && form['cost'] != ''){
                con.query(  action + " INTO `costs` (`jobref`, `id`, `type`, `dscrpt`, `cost`) " + 
                            "VALUES (" + "'"    + form['jobref'] + "', '"
                                                + 1 + "', '"
                                                + form['costtype'] + "', '" 
                                                + form['costdscrpt'] + "', '"
                                                + form['cost'] + "')",
                                                function(err, result){
                                                    if(callback)
                                                        callback(form, action);
                                                });
            }
        }
    }
    //Add total cost to cost table
    if(form['totalcost'] != ''){
        con.query(  action + " INTO `costs` (`jobref`, `id`, `type`, `dscrpt`, `cost`) " + 
                    "VALUES (" + "'"    + form['jobref'] + "', '"
                                        + 0 + "', '"
                                        + "Total" + "', '" 
                                        + "Total Cost"+ "', '"
                                        + form['totalcost'] + "')");
    }
}

///////////////////////////////////////////
module.newInstallation = function(form, action, callback){
    if(form['installation'] != undefined){
        if(form['installation'].constructor === Array){
            id = 0;
            i = 0;
            length = form['installation'].length;
            var newInstallation_ = function(i, id){
                if(i >= length){
                    if(callback)
                        callback(form, action);
                    else
                        return;
                }
                else if(form['installation'][i] == '')
                    newInstallation__(i+1, id);
                else{
                    con.query(  action + " INTO `installations` (`jobref`, `id`, `type`, `dscrpt`) " + 
                                "VALUES (" + "'"    + form['jobref'] + "', '"
                                                    + i + "', '"
                                                    + form['installation'][i] + "', '" 
                                                    + form['installationdscrpt'][i] + "')", 
                                                    function(err, result){
                                                            newInstallation_(i+1, id+1);
                                                    });
                }
            }
            newInstallation_(i, id);
        }
        else{
            if(form['installation'] != ''){
                    con.query(  action + " INTO `installations` (`jobref`, `id`, `type`, `dscrpt`) " + 
                                "VALUES (" + "'"    + form['jobref'] + "', '"
                                                    + 0 + "', '"
                                                    + form['installation'] + "', '" 
                                                    + form['installationdscrpt'] + "')",
                                                    function(err, result){
                                                        if(callback)
                                                            callback(form, action);
                                                    });
            }
        }
    }
}
return module;
}