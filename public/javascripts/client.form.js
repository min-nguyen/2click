function client_insertinfo(form){
    $('#firstname').append('<h2>'    + form.firstname   + '</h2>');
    $('#surname').append('<h2>'      + form.surname     + '</h2>');
    $('#jobref').append('<h2>'       + form.jobref      + '</h2>');
    $('#datein').append('<h2>'       + form.datein      + '</h2>');
    $('#dateout').append('<h2>'      + form.dateout     + '</h2>');
    $('#address').append('<h2>'      + form.address     + '</h2');
    $('input[name="status"][value="' + form.status      + '"]').attr('checked', 'checked');
    $('#postcode').append('<h2>'     + form.postcode    + '</h2>');
    $('#telephone').append('<h2>'    + form.telephone   + '</h2>');
    $('#email').append('<h2>'        + form.email       + '</h2>');
}

function equipment_insertinfo(form){
    console.log(form.equipment);
    if(form.equipment == undefined)
        return;

    var equipments = JSON.parse(form.equipment);
    for(i = 0; i < equipments.length; i++){
        equipment_insertrow(equipments[i]);
    }
}

function equipment_insertrow(equipment){
    var table  = $('#equipment-table');
    var numcols = (table.find("tr:first")).find('th').length;

    var tablerow = '<tr>';
    for(j = 1; j < numcols + 1; j++){
        var col_name  = table.find('tr:first').find('th:nth-child(' + j + ')').text();
        var cell_input =    '<td>'  + equipment[col_name]+ ' </td>';
        tablerow += cell_input;      
    }
    console.log("adding :" + tablerow);
    tablerow += '</tr>';
    table.append(tablerow);
};

function updates_insertinfo(form){
    if(form.updates == undefined){
        return;
    }
    var updates = JSON.parse(form.updates);
    var updates_DOM  = $('#updates');
    
   for(i = updates.length - 1; i >= 0; i--){
        var update_html = "<div class = 'update'>" + updates[i].dscrpt + "</div>"
                    + "<div class = 'update-time'>" + updates[i].time + "</div>";
        updates_DOM.append(update_html);
    }
}

function work_insertinfo(form){
    if(form.jobdscrpt != undefined){
        var jobdscrpt_DOM = $('#job-dscrpt');
        var jobdscrpt_info_html = "<div class = 'text-container'> " + form.jobdscrpt + " </div>";
        jobdscrpt_DOM.append(jobdscrpt_info_html);
    }

    if(form.workdone != undefined){
        var workdone_DOM = $('#work-done');
        var workdone_info_html = "<div class = 'text-container'> " + form.workdone + " </div>";
        workdone_DOM.append(workdone_info_html);
    }

    if(form.installations != undefined){
        var installations_DOM = $('#installation-table');
        var installations = JSON.parse(form.installations);
        
        for(i = 0; i < installations.length; i++){
            var installation_html = "<tr> <td>" + installations[i].type + "</td>"
                                    + "<td>" + installations[i].dscrpt + "</td> </tr>";
            installations_DOM.append(installation_html);
        }
    }
}

function costs_insertinfo(form){

    if(form.costs != undefined){
        var costs_DOM = $('#cost-table');
        var costs = JSON.parse(form.costs);
        
        for(i = 0; i < costs.length; i++){
            var cost_html = "<tr> <td>" + costs[i].type + "</td>"
                            + "<td>" + costs[i].dscrpt + "</td>"
                            + "<td> £" + (costs[i].cost).toFixed(2) + "</tr>";
            costs_DOM.append(cost_html);
        }
    }
}