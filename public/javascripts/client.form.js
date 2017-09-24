function client_insertinfo(form){
    $('#firstname').append('<h2>'    + form.firstname   + '</h2>');
    $('#surname').append('<h2>'      + form.surname     + '</h2>');
    $('#jobref').append('<h2>'       + form.jobref      + '</h2>');
    $('#datein').append('<h2>'       + form.datein      + '</h2>');
    $('#dateout').append('<h2>'      + form.dateout     + '</h2>');
    $('#address').append('<h2>'      + form.address     + '</h2');
    if(form.status == 'Ready'){
        $('#status-message').text("READY");
        $('#status-message').css('color', 'green');
    }
    else{
        $('#status-message').text("NOT READY");
        $('#status-message').css('color', 'red');
    }
    $('#postcode').append('<h2>'     + form.postcode    + '</h2>');
    $('#telephone').append('<h2>'    + form.telephone   + '</h2>');
    $('#email').append('<h2>'        + form.email       + '</h2>');
}

function equipment_insertinfo(form){
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
    tablerow += '</tr>';
    table.append(tablerow);
};


function work_insertinfo(form){
    if(form.jobdscrpt != undefined){
        var jobdscrpt_DOM = $('#job-dscrpt');
        var jobdscrpt_info_html = "<div class = 'text-container'> " + form.jobdscrpt + " </div>";
        jobdscrpt_DOM.text(form.jobdscrpt);
    }

    if(form.workdone != undefined){
        var workdone_DOM = $('#work-done');
        var workdone_info_html = "<div class = 'text-container'> " + form.workdone + " </div>";
        workdone_DOM.text(form.workdone);
    }
}

function costs_insertinfo(form){

    if(form.costs != undefined){
        var costs_DOM = $('#cost-table');
        var costs = JSON.parse(form.costs);
        
        for(i = 0; i < costs.length; i++){
            var cost_html = "<tr> <td>" + costs[i].costtype + "</td>"
                            + "<td>" + costs[i].costdscrpt + "</td>"
                            + "<td> £" + (costs[i].cost).toFixed(2) + "</tr>";
            costs_DOM.append(cost_html);
        }
    }
}