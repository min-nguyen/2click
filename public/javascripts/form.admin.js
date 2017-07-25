function equipment_insertrow(numrows){
    var table = $('#equipment-table');
    var numcols = (table.find("tr:first")).find('th').length;
    var table  = $('#equipment-table');
    for(i = 1; i < numrows + 1; i++){
        var tablerow = '<tr>';
         for(j = 1; j < numcols + 1; j++){
            
            var col_name  = table.find('tr:first').find('th:nth-child(' + j + ')').text();
            
            
            var cell_input =    '<td> <input class = "table-input" type = "text" name = "' 
                                + col_name + '"> </td>';
            tablerow += cell_input;      
         }
        tablerow += '</tr>';
        table.append(tablerow);
    }
};

function cost_insertrow(numrows){
    var table = $('#cost-table');
    var numcols = (table.find("tr:first")).find('th').length;
     for(i = 0; i < numrows; i++){
        var tablerow = '<tr>' +
                       '<th> <select name = "costtype" class = "drop-down">' +
                       '    <option value="" ></option> ' +
                       '    <option value="labour">Labour</option> ' +
                       '    <option value="materials">Materials</option> ' +
                       '    <option value="Other">Other</option> </select> </th>' +
                       ' <td>  <textarea class = "job-input" rows = "2" type = "text" name = "costdscrpt"></textarea></td> ' +
                       ' <td>  <input type = "number" name = "cost" class = "cost-input" min="0" step="0.01" data-number-to-fixed="2" data-number-stepfactor="100" style/> </td> ' +
                       '</tr>';
        $(tablerow).insertBefore('#cost-table-total');
    }
}

function installation_insertrow(numrows){
    var table = $('.installation-table');
    for(i = 0; i < numrows; i++){
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
        table.append(tablerow);
    }
}

function insertrow(button){
    var id = $(button).attr('id');
    if(id == 'installation-button'){
        installation_insertrow(1);
    }
}