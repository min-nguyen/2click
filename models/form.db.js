
var mysql = require('mysql');
var dateFormat = require('dateformat'); 
var q = require('q');

module.exports = function(con){
module.newClient = function(form, action, callback){
    //Insert new job form
    if(action == "INSERT"){
        con.query("SELECT * FROM clients WHERE firstname = '" + form['firstname'] + "' AND surname = '" + form['surname'] + "'", 
        function(err, result){
            if(result.length == 0){
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
            else{
                form.clientid = result[0].id;
                if(callback)
                    callback(null, form);
                return form;
            }     
        });
    }
    //Replace existing job form
    else if(action == "REPLACE"){
            con.query(  "REPLACE INTO clients(id, firstname, surname, address, postcode, telephone, email) "
                    + " VALUES('"  + form.clientid + "', '" + form.firstname + "','" + form.surname + "','" 
                    + form.address + "','" + form.postcode + "','" + form.telephone + "','" + form.email + "')", 
                    function(err, result){
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
            con.query(  action + " INTO `jobs` (`jobref`,`jobdscrpt`, `workdone`, `datein`, `status`, `clientid`) " + 
            "VALUES (" + "'"    + form['jobref'] + "', '" 
                                + form['jobdscrpt'] + "', '" 
                                + form['workdone'] + "', '" 
                                + datein + "', '" 
                                + form['status'] + "', '"
                                + form.clientid + "')", 
                                function(err, results){
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
module.newEquipment = function(form, action, callback){
    if(form['Equipment'] != undefined){
        //Handle multiple equipment entries
        if(form['Equipment'].constructor === Array ){
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
        //Handle single equipment entry
        else if(form['Equipment'] != ''){
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
                                                        callback(null, form);
                                                });
        }
        else{
            if(callback)
                callback(null, form);
        }
    }
    else{
        if(callback)
            callback(null, form);
    }
}

// //////////////////////////////////////////////////
module.newCost = function(form, action, callback){
    var processCosts = function(){
        if(form['costtype'] != undefined){
            //Add multiple non-total costs to cost-table synchronously
            if(form['costtype'].constructor === Array){
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
                                                    });
                }
            }
        }
    }
    //Add total cost to cost table
    if(form['totalcost'] != ''){
        processCosts();
        con.query(  action + " INTO `costs` (`jobref`, `id`, `type`, `dscrpt`, `cost`) " + 
                    "VALUES (" + "'"    + form['jobref'] + "', '"
                                        + 0 + "', '"
                                        + "Total" + "', '" 
                                        + "Total Cost"+ "', '"
                                        + form['totalcost'] + "')", function(err, result){
                                            if(callback)
                                                callback(null, form);
                                        });
    }
    else{
        if(callback)
            callback(null, form);
    }
}

///////////////////////////////////////////
module.newInstallation = function(form, action, callback){
    console.log(JSON.stringify(form));
    if(form['installation'] != undefined){
        ///Handle multiple installations
        if(form['installation'].constructor === Array){
            id = 0;
            i = 0;
            length = form['installation'].length;
            var newInstallation_ = function(i, id){
                if(i >= length){
                    if(callback)
                        callback(null, form);
                    else
                        return;
                }
                else if(form['installation'][i] == '')
                    newInstallation_(i+1, id);
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
        //Handle single installation
        else if(form['installation'] != ''){
                    con.query(  action + " INTO `installations` (`jobref`, `id`, `type`, `dscrpt`) " + 
                                "VALUES (" + "'"    + form['jobref'] + "', '"
                                                    + 0 + "', '"
                                                    + form['installation'] + "', '" 
                                                    + form['installationdscrpt'] + "')",
                                                    function(err, result){
                                                        if(callback){
                                                            callback(null, form);
                                                        }
                                                    });
        }
        else{
            if(callback)
                callback(null, form);
        }
    }
    else{
        if(callback)
            callback(null, form);
    }
}
return module;
}