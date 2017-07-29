////////////////////////////////////////////////////////
function fixedinputs_insertinfo(form){
    $('#firstname').val(form.firstname);
    $('#surname').val(form.surname);
    $('#jobref').val(form.jobref);
    $('#datein').append('<h2>' + form.datein + '</h2>');
    $('#dateout').append('<h2>' + form.dateout + '</h2>');
    $('#address').val(form.address);
    $('#postcode').val(form.postcode);
    $('#telephone').val(form.telephone);
    $('#email').val(form.email);
    $('#jobdscrpt').val(form.jobdscrpt);
    $('#workdone').val(form.workdone);
}
////////////////////////////////////////////////////////
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
////////////////////////////////////////////////////////
function equipment_insertinfo(){
    if(form.equipment == undefined)
        return;

    var equipments = JSON.parse(form.equipment);
    for(i = 0; i < equipments.length; i++){
        equipment_newrow();
        equipment_loadrow(i + 1, equipments[i]);
    }
}

function equipment_newrow(){
    var table = $('#equipment-table');
    var numcols = (table.find("tr:first")).find('th').length;
    var table  = $('#equipment-table');
  
    var tablerow = '<tr>';
    for(j = 1; j < numcols + 1; j++){
        
        var col_name  = table.find('tr:first').find('th:nth-child(' + j + ')').text();
        
        var cell_input =    '<td> <input class = "table-input" type = "text" name = "' 
                            + col_name + '"> </td>';
        tablerow += cell_input;      
    }
    tablerow += '</tr>';
    $(tablerow).insertBefore('#equipment-button-row');
};

function equipment_loadrow(row_num, equipment){
    row_num++;

    var table  = $('#equipment-table');
    var numcols = (table.find("tr:first")).find('th').length;
    var row_DOM = $('#equipment-table tr:nth-child(' + row_num + ')');
   

    for(j = 1; j < numcols + 1; j++){
        var cell_DOM = row_DOM.find('td:nth-child(' + j + ')');
        var input_DOM = cell_DOM.find('input');
        var col_name = table.find('tr:first').find('th:nth-child(' + j + ')').text();
        var cell_text = equipment[col_name];
        input_DOM.val(cell_text);
    }
};

//////////////////////////////////////////////////////////////
function costs_insertinfo(form){
    if(form.costs == undefined)
        return;

    var costs = JSON.parse(form.costs);
    for(i = 0; i < costs.length; i++){
        if(costs[i].type == 'total'){
            $('input[name=totalcost]').val(costs[i]['cost']);
        }
        else{
            costs_newrow();

            row_num = i + 2;
            row_DOM = $('#cost-table tr:nth-child(' + row_num + ')');
    
            var cell_type = row_DOM.find('select[name=costtype]');
            cell_type.val(costs[i]['type']);
            var cell_dscrpt = row_DOM.find('textarea[name=costdscrpt]');
            cell_dscrpt.val(costs[i]['dscrpt']);
            var cell_cost = row_DOM.find('input[name=cost]');
            cell_cost.val(costs[i]['cost']);
        }
    }
}

function costs_newrow(){

    var table = $('#cost-table');
    var numcols = (table.find("tr:first")).find('th').length;

    var tablerow = '<tr>' +
                    '<td> <select name = "costtype" class = "drop-down">' +
                    '    <option value=""></option> ' +
                    '    <option value="labour">Labour</option> ' +
                    '    <option value="materials">Materials</option> ' +
                    '    <option value="other">Other</option> </select> </th>' +
                    ' <td>  <textarea class = "cost-dscrpt" rows = "2" type = "text" name = "costdscrpt"></textarea></td> ' +
                    ' <td>  <input type = "number" name = "cost" class = "cost-input" min="0" step="0.01" data-number-to-fixed="2" data-number-stepfactor="100" style/> </td> ' +
                    '</tr>';
    $(tablerow).insertBefore('#cost-table-total');
}

//////////////////////////////////////////////////////////////////
function installations_insertinfo(form){
    if(form.installations == undefined)
        return;

    var installations = JSON.parse(form.installations);
   
    for(i = 0; i < installations.length; i++){
        installations_newrow();

        row_num = i + 2;
        row_DOM = $('#installation-table tr:nth-child(' + row_num + ')');

        var cell_type = row_DOM.find('select[name=installation]');
        cell_type.val(installations[i]['type']);
        var cell_dscrpt = row_DOM.find('textarea[name=installationdscrpt]');
        cell_dscrpt.val(installations[i]['dscrpt']);

    }
}


function installations_newrow(){
    var table = $('.installation-table');

    var tablerow = 
        '<tr>' +
            '<td> <select name = "installation" class = "drop-down">' +
                    '<option value="" ></option>' +
                    '<option value="hardware">Hardware</option>' +
                    '<option value="software">Software</option>' +
                    '<option value="other">Other</option>' +
                '</select> </td>' +
            '<td> <textarea class = "job-input" rows = "2" type = "text" name = "installationdscrpt"></textarea></td>' +
        '</tr>';
    $(tablerow).insertBefore('#installation-button-row');
    
}

/////////////////////////////////////////////////////////////////
function newrow(button){
    var id = $(button).attr('id');
    if(id == 'installation-button'){
        installations_newrow();
    }
    else if(id == 'equipment-button'){
        equipment_newrow();
    }
    else if(id == 'cost-button'){
        costs_newrow();
    }
}

/////////////////////////////////////////////////////////////////
function postUpdate(){
    var update_text = $('#update-text').val();
    $.ajax({
        url: "//localhost:3000/admin/edit/postupdate", 
        data: {entry : update_text, form: form}, 
        type: "POST",
        success: function(data){
           console.log("received");
        }
    });
}