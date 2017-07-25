function client_insertinfo(form){
    console.log(form.datein);
    $('#firstname').val(form.firstname);
    $('#surname').val(form.surname);
    $('#jobref').val(form.jobref);
    $('#datein').append('<h2>' + form.datein + '</h2>');
    $('#dateout').append('<h2>' + form.dateout + '</h2>');
    $('#address').val(form.address);
    $('#postcode').val(form.postcode);
    $('#telephone').val(form.telephone);
    $('#email').val(form.email);
}

function equipment_insertrow(form){
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

function equipment_insertinfo(form){
    if(form.equipment == undefined)
        return;

    var equipments = JSON.parse(form.equipment);
    for(i = 0; i < equipments.length; i++){
        eq(i, equipments[i]);
    }
}

function eq(row, equipment){
    var table  = $('#equipment-table');
    var numcols = (table.find("tr:first")).find('th').length;

    var tablerow = '<tr>';
    for(j = 0; j < numcols; j++){
        
        var cell_DOM = table.find('tr:nth-child(' + row + ')').find('td:nth-child(' + j + ')').text();
        var cell_input_DOM = cell_DOM.children('input');
        var col_name = table.find('tr:first').find('th:nth-child(' + j + ')').text();
        var cell_text = equipment[col_name];
        cell_input_DOM.val(cell_text);
    }
};

function cost_insertrow(form){
    var table = $('#cost-table');
    var numcols = (table.find("tr:first")).find('th').length;

    var tablerow = '<tr>' +
                    '<th> <select name = "costtype" class = "drop-down">' +
                    '    <option value="labour">Labour</option> ' +
                    '    <option value="materials">Materials</option> ' +
                    '    <option value="other">Other</option> </select> </th>' +
                    ' <td>  <textarea class = "job-input" rows = "2" type = "text" name = "costdscrpt"></textarea></td> ' +
                    ' <td>  <input type = "number" name = "cost" class = "cost-input" min="0" step="0.01" data-number-to-fixed="2" data-number-stepfactor="100" style/> </td> ' +
                    '</tr>';
    $(tablerow).insertBefore('#cost-table-total');

}

function installation_insertrow(form){
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

function insertrow(button){
    var id = $(button).attr('id');
    if(id == 'installation-button'){
        installation_insertrow(1);
    }
    else if(id == 'equipment-button'){
        equipment_insertrow(1);
    }
    else if(id == 'cost-button'){
        cost_insertrow(1);
    }
}